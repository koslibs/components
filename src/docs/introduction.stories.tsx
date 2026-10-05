import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { IntroductionDocs } from './introduction.docs';

const meta = {
    id: 'getting-started-introduction',
    title: 'Начало работы/Введение',
    tags: ['autodocs'],
    parameters: { docs: { page: IntroductionDocs } },
} satisfies Meta;

export default meta;

export const Documentation: StoryObj<typeof meta> = {
    tags: ['!dev', '!test'],
    render: () => <></>,
};
