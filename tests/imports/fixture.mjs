import { execFileSync } from 'node:child_process';
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const builderCli = fileURLToPath(
    new URL('./cli/index.js', import.meta.resolve('@koslibs/builder'))
);
export const unusedMarker = /IMPORT_TEST_UNUSED_COMPONENT/;

async function write(root, path, content) {
    const target = resolve(root, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(
        target,
        typeof content === 'string' ? content : JSON.stringify(content, null, 4)
    );
}

async function writeTsconfig(root, project) {
    await write(project, 'tsconfig.json', {
        extends: relative(project, join(root, 'tsconfig.json')).replaceAll('\\', '/'),
        compilerOptions: { rootDir: 'src' },
        include: ['src'],
    });
    await cp(join(root, 'tsconfig.build.json'), join(project, 'tsconfig.build.json'));
}

function build(root, project, command) {
    execFileSync(process.execPath, [builderCli, command, '--root', project], {
        cwd: root,
        stdio: 'inherit',
    });
}

export async function readBundle(directory) {
    const result = { js: '', css: '' };
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
            const nested = await readBundle(path);
            result.js += nested.js;
            result.css += nested.css;
        } else {
            const kind = extname(entry.name).slice(1);
            if (kind === 'js' || kind === 'css')
                result[kind] += `\n${await readFile(path, 'utf8')}`;
        }
    }
    return result;
}

export async function createImportFixture(root, scenarios) {
    const metadata = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    const componentNames = (await readdir(join(root, 'src/components'), { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    if (!componentNames.length) throw new Error('No public components found in src/components');
    if (!scenarios.length) throw new Error('At least one bundle scenario is required');
    const scenarioNames = new Set();
    for (const scenario of scenarios) {
        if (!componentNames.includes(scenario.component))
            throw new Error(`Unknown component in import scenario: ${scenario.component}`);
        if (scenarioNames.has(scenario.component))
            throw new Error(`Duplicate import scenario: ${scenario.component}`);
        scenarioNames.add(scenario.component);
    }

    await mkdir(join(root, '.cache'), { recursive: true });
    const directory = await mkdtemp(join(root, '.cache/component-imports-'));
    const cleanup = async () => {
        const target = resolve(directory);
        if (
            !target.startsWith(`${resolve(root, '.cache')}${sep}`) ||
            !basename(target).startsWith('component-imports-')
        ) {
            throw new Error(`Refusing to remove a path outside the import-test cache: ${target}`);
        }
        await rm(target, { recursive: true, force: true });
    };
    const library = join(directory, 'library');
    const consumer = join(directory, 'consumer');
    try {
        await write(library, 'package.json', { ...metadata, version: '0.0.0' });
        await cp(join(root, 'src'), join(library, 'src'), {
            recursive: true,
            filter: (source) => {
                const path = relative(join(root, 'src'), source).replaceAll('\\', '/');
                return (
                    path !== 'docs' &&
                    !/\.(?:stories|docs|test|spec)\./.test(path) &&
                    !path.endsWith('.md')
                );
            },
        });
        await cp(join(root, 'koslibs-builder.ts'), join(library, 'koslibs-builder.ts'));
        await writeTsconfig(root, library);
        const rootExports = await readFile(join(library, 'src/index.ts'), 'utf8');
        await write(
            library,
            'src/index.ts',
            `${rootExports}\nexport { ImportTestUnusedComponent } from './components/ImportTestUnusedComponent';\n`
        );
        await write(
            library,
            'src/components/ImportTestUnusedComponent/index.tsx',
            `import styles from './styles.module.css';
export function ImportTestUnusedComponent() {
    return <span className={styles.IMPORT_TEST_UNUSED_COMPONENT}>IMPORT_TEST_UNUSED_COMPONENT</span>;
}
`
        );
        await write(
            library,
            'src/components/ImportTestUnusedComponent/styles.module.css',
            '.IMPORT_TEST_UNUSED_COMPONENT { color: blue; }'
        );
        build(root, library, 'lib:build');
        await access(join(library, 'dist/components/ImportTestUnusedComponent/index.js'));

        const installed = join(consumer, 'node_modules', ...metadata.name.split('/'));
        await mkdir(installed, { recursive: true });
        await cp(join(library, 'package.json'), join(installed, 'package.json'));
        await cp(join(library, 'dist'), join(installed, 'dist'), { recursive: true });
        await write(consumer, 'package.json', {
            name: 'component-import-consumer',
            private: true,
            type: 'module',
        });
        await writeTsconfig(root, consumer);
        await write(
            consumer,
            'resolve-subpaths.mjs',
            `console.log(JSON.stringify(${JSON.stringify(componentNames)}.map((name) => ({ name, module: import.meta.resolve(${JSON.stringify(metadata.name)} + '/' + name) }))));`
        );
        const resolved = JSON.parse(
            execFileSync(process.execPath, [join(consumer, 'resolve-subpaths.mjs')], {
                cwd: consumer,
                encoding: 'utf8',
            })
        );
        const components = resolved.map((component) => {
            const entry = metadata.exports[`./${component.name}`] ?? metadata.exports['./*'];
            if (!entry?.types) throw new Error(`${component.name}: missing types export`);
            return {
                name: component.name,
                module: fileURLToPath(component.module),
                types: resolve(installed, entry.types.replaceAll('*', component.name)),
            };
        });

        for (const scenario of scenarios) {
            await write(
                consumer,
                `src/${scenario.component}.tsx`,
                `import { ${scenario.component} } from '${metadata.name}/${scenario.component}';
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(${scenario.render});
`
            );
        }
        // Each environment has an independent compilation and output directory.
        const environments = Object.fromEntries(
            scenarios.map((scenario, index) => [
                index === 0 ? 'client' : scenario.component,
                {
                    source: { entry: { index: `./src/${scenario.component}.tsx` } },
                    output: { distPath: { root: `./dist/${scenario.component}` } },
                },
            ])
        );
        const { client, ...otherEnvironments } = environments;
        await write(
            consumer,
            'koslibs-builder.ts',
            `import base from '../library/koslibs-builder.ts';
export default {
    ...base,
    rsbuildConfig: {
        ...base.rsbuildConfig,
        source: { ...base.rsbuildConfig.source, entry: ${JSON.stringify(client.source.entry)} },
        environments: ${JSON.stringify(otherEnvironments)},
    },
    clientConfig: ${JSON.stringify(client)},
};
`
        );
        build(root, consumer, 'ui:build');
        return {
            components,
            cleanup,
            output: (name) => join(consumer, 'dist', name),
        };
    } catch (error) {
        await cleanup();
        throw error;
    }
}
