import { Markdown } from '@koslibs/builder/storybook/blocks';

import readme from '../../README.md?raw';

export function IntroductionDocs() {
    return <Markdown>{readme}</Markdown>;
}
