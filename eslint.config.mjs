import base from '@koslibs/configs/eslint';
import react from '@koslibs/configs/eslint/react';

export default [
    { ignores: ['storybook-static/**', 'coverage/**'] },
    ...base,
    react,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: { globals: { VoidFunction: 'readonly' } },
    },
];
