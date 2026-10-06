// Keep representative bundle scenarios here; public entrypoint checks cover every component.
export const importCases = [
    {
        component: 'Button',
        render: '<Button loading>IMPORT_TEST_BUTTON</Button>',
        includes: {
            js: [/IMPORT_TEST_BUTTON/, /conic-gradient/],
            css: [
                /--button-primary-background-color/,
                /--spinner-animation-duration/,
                /--font-primary\s*:\s*["']Inter["']/,
                /@font-face/,
            ],
            assets: [
                /inter-latin-wght-normal[^/\\]*\.woff2$/m,
                /inter-cyrillic-wght-normal[^/\\]*\.woff2$/m,
            ],
        },
        excludes: {
            js: [/displayName\s*=\s*["']Typography(?:Text|Title)["']/],
            css: [/--typography-/],
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
            js: [/displayName\s*=\s*["'](?:Button|TypographyText|TypographyTitle)["']/],
            css: [/--button-/, /--typography-/, /--font-primary/, /@font-face/],
            assets: [/\.woff2$/m],
        },
    },
    {
        component: 'Typography',
        render: '<><Typography.Text>IMPORT_TEST_TYPOGRAPHY</Typography.Text><Typography.Title tag="h2">Heading</Typography.Title></>',
        includes: {
            js: [/IMPORT_TEST_TYPOGRAPHY/, /TypographyText/, /TypographyTitle/],
            css: [
                /--typography-font-size-13/,
                /--typography-font-size-28/,
                /--typography-bold-font-weight/,
                /--font-primary\s*:\s*["']Inter["']/,
                /@font-face/,
            ],
            assets: [
                /inter-latin-wght-normal[^/\\]*\.woff2$/m,
                /inter-cyrillic-wght-normal[^/\\]*\.woff2$/m,
            ],
        },
        excludes: {
            js: [/displayName\s*=\s*["'](?:Button|Spinner)["']/, /conic-gradient/],
            css: [/--button-/, /--spinner-/],
        },
    },
];
