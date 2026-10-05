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
                ],
            },
            tsconfigPath: './tsconfig.build.json',
        },
        output: { sourceMap: { js: false, css: false } },
        tools: {
            swc: { jsc: { transform: { react: { runtime: 'automatic' } } } },
        },
    },
    storybookViteConfig: { base: './' },
};

export default config;
