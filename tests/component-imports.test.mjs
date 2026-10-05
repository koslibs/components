import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const builderCli = fileURLToPath(
    new URL('./cli/index.js', import.meta.resolve('@koslibs/builder'))
);

async function write(directory, path, content) {
    const target = resolve(directory, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
}

async function json(directory, path, value) {
    await write(directory, path, JSON.stringify(value, null, 4));
}

function build(directory, command) {
    execFileSync(process.execPath, [builderCli, command, '--root', directory], {
        cwd: root,
        stdio: 'inherit',
    });
}

async function readOutput(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...(await readOutput(path)));
        else if (/\.(js|css)$/.test(entry.name)) files.push(await readFile(path, 'utf8'));
    }
    return files;
}

test('component subpath includes its code and CSS without unused components', async () => {
    const metadata = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    await mkdir(join(root, '.cache'), { recursive: true });
    const fixture = await mkdtemp(join(root, '.cache/component-imports-'));
    const library = join(fixture, 'library');
    const app = join(fixture, 'app');

    await json(library, 'package.json', {
        name: metadata.name,
        version: '0.0.0',
        type: metadata.type,
        main: metadata.main,
        types: metadata.types,
        exports: metadata.exports,
        sideEffects: metadata.sideEffects,
        peerDependencies: metadata.peerDependencies,
    });
    await cp(join(root, 'koslibs-builder.ts'), join(library, 'koslibs-builder.ts'));
    for (const directory of [library, app]) {
        await json(directory, 'tsconfig.json', {
            extends: relative(directory, join(root, 'tsconfig.json')).replaceAll('\\', '/'),
            compilerOptions: { rootDir: 'src' },
            include: ['src'],
        });
        await cp(join(root, 'tsconfig.build.json'), join(directory, 'tsconfig.build.json'));
    }

    await write(
        library,
        'src/index.ts',
        `export { Button } from './components/Button/index';
export { Spinner } from './components/Spinner/index';
`
    );
    for (const [name, marker] of [
        ['Button', 'BUTTON_INCLUDED'],
        ['Spinner', 'SPINNER_EXCLUDED'],
    ]) {
        await write(
            library,
            `src/components/${name}/index.tsx`,
            `import styles from './styles.module.css';
export function ${name}() {
    return <span className={styles.${marker}}>${marker}</span>;
}
`
        );
        await write(
            library,
            `src/components/${name}/styles.module.css`,
            `.${marker} { color: ${name === 'Button' ? 'red' : 'blue'}; }
`
        );
    }
    build(library, 'lib:build');
    await readFile(join(library, 'dist/components/Spinner/index.js'));
    await readFile(join(library, 'dist/components/Spinner/index.d.ts'));

    // Copy the published surface into a consumer's node_modules, with real package exports.
    const installed = join(app, 'node_modules/@koslibs/components');
    await mkdir(installed, { recursive: true });
    await cp(join(library, 'package.json'), join(installed, 'package.json'));
    await cp(join(library, 'dist'), join(installed, 'dist'), { recursive: true });
    await json(app, 'package.json', {
        name: 'component-import-consumer',
        private: true,
        type: 'module',
    });
    await write(
        app,
        'koslibs-builder.ts',
        `import base from '../library/koslibs-builder.ts';
export default {
    ...base,
    rsbuildConfig: {
        ...base.rsbuildConfig,
        source: { ...base.rsbuildConfig.source, entry: { index: './src/index.tsx' } },
    },
};
`
    );
    await write(
        app,
        'src/index.tsx',
        `import { Button } from '@koslibs/components/Button';
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(<Button />);
`
    );
    build(app, 'ui:build');

    const output = (await readOutput(join(app, 'dist'))).join('\n');
    assert.match(output, /BUTTON_INCLUDED/, 'Button must be present in the consumer bundle');
    assert.match(output, /\.BUTTON_INCLUDED[^{}]*\{/, 'Button CSS must be present');
    assert.doesNotMatch(output, /SPINNER_EXCLUDED/, 'Unused Spinner code and CSS must be absent');
});
