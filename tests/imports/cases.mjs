// Keep representative bundle scenarios here; public entrypoint checks cover every component.
export const importCases = [
    {
        component: 'Portal',
        render: '<Portal><span>IMPORT_TEST_PORTAL</span></Portal>',
        includes: { js: [/IMPORT_TEST_PORTAL/] },
        excludes: {
            js: [
                /displayName\s*=\s*["'](?:Modal|Popover|Collapse|Button|Spinner|TypographyText|TypographyTitle)["']/,
            ],
            css: [/--(?:modal|popover|collapse|button|spinner|typography)-/, /@font-face/],
            assets: [/\.woff2$/m],
        },
    },
    {
        component: 'Modal',
        render: '<Modal open aria-label="Import test">IMPORT_TEST_MODAL</Modal>',
        includes: {
            js: [/IMPORT_TEST_MODAL/, /showModal/],
            css: [/--modal-background-color/, /::backdrop/, /--modal-padding/, /@font-face/],
            assets: [/inter-latin-wght-normal[^/\\]*\.woff2$/m],
        },
        excludes: {
            js: [/displayName\s*=\s*["'](?:Popover|Collapse|TypographyTitle)["']/],
            css: [/--popover-/, /--collapse-/],
        },
    },
    {
        component: 'Collapse',
        render: '<Collapse defaultExpanded collapsedLabel="Details" showLeftChevron>IMPORT_TEST_COLLAPSE</Collapse>',
        includes: {
            js: [/IMPORT_TEST_COLLAPSE/, /M4 6L8 10L12 6/],
            css: [/--collapse-color/, /grid-template-rows/, /prefers-reduced-motion/, /@font-face/],
            assets: [/inter-latin-wght-normal[^/\\]*\.woff2$/m],
        },
        excludes: {
            js: [
                /displayName\s*=\s*["'](?:Button|Spinner|Popover|TypographyText|TypographyTitle)["']/,
            ],
            css: [/--button-/, /--spinner-/, /--popover-/, /--typography-/, /--collapse-inverted-/],
        },
    },
    {
        component: 'Popover',
        render: '<Popover open anchorElement={document.body}>IMPORT_TEST_POPOVER</Popover>',
        includes: {
            js: [/IMPORT_TEST_POPOVER/, /availableSize/],
            css: [
                /--popover-z-index/,
                /--popover-available-height/,
                /--popover-shadow\s*:/,
                /box-shadow\s*:\s*var\(--popover-shadow\)/,
            ],
        },
        excludes: {
            js: [/displayName\s*=\s*["'](?:Button|Spinner|TypographyText|TypographyTitle)["']/],
            css: [
                /--button-/,
                /--spinner-/,
                /--typography-/,
                /--popover-(?:background|color|inverted|border|padding)/,
                /background-color\s*:/,
                /border-radius\s*:/,
                /font-family\s*:/,
                /@font-face/,
            ],
            assets: [/\.woff2$/m],
        },
    },
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
            css: [/--typography-/, /--popover-/],
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
            css: [/--button-/, /--typography-/, /--popover-/, /--font-primary/, /@font-face/],
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
            css: [/--button-/, /--spinner-/, /--popover-/],
        },
    },
];
