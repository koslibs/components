// Keep representative bundle scenarios here; public entrypoint checks cover every component.
export const importCases = [
    {
        component: 'Button',
        render: '<Button loading>IMPORT_TEST_BUTTON</Button>',
        includes: {
            js: [/IMPORT_TEST_BUTTON/, /conic-gradient/],
            css: [/--button-primary-background-color/, /--spinner-animation-duration/],
        },
    },
    {
        component: 'Spinner',
        render: '<Spinner visible dataTestId="IMPORT_TEST_SPINNER" />',
        includes: {
            js: [/IMPORT_TEST_SPINNER/, /conic-gradient/],
            css: [/--spinner-animation-duration/],
        },
        excludes: {
            js: [/displayName\s*=\s*["']Button["']/],
            css: [/--button-/],
        },
    },
];
