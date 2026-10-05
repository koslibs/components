import type { Preview } from '@koslibs/builder/storybook';

const preview: Preview = {
    parameters: {
        controls: { expanded: true },
        options: { storySort: { order: ['Начало работы', 'Components'] } },
    },
};

export default preview;
