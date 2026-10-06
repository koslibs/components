import type { KoslibsBuilderConfig } from '@koslibs/builder';

const config: KoslibsBuilderConfig = {
    port: 6106,
    rsbuildConfig: {
        source: {
            entry: {
                index: [
                    './src/**',
                    '!./src/docs/**',
                    '!./src/**/*.stories.*',
                    '!./src/**/*.docs.*',
                    '!./src/**/*.test.*',
                    '!./src/**/*.spec.*',
                    '!./src/**/*.md',
                    '!./src/styles/fonts/**',
                ],
            },
            tsconfigPath: './tsconfig.build.json',
        },
        output: {
            sourceMap: { js: false, css: false },
            copy: [
                {
                    from: './src/styles/fonts/inter/LICENSE.txt',
                    to: 'styles/fonts/inter/LICENSE.txt',
                },
            ],
        },
        tools: {
            swc: { jsc: { transform: { react: { runtime: 'automatic' } } } },
        },
    },
    storybookViteConfig: { base: './' },
};

export default config;
