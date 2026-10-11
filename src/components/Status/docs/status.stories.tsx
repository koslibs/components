import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { TickIcon } from '@koslibs/icons/TickIcon';

import { StatusDocs } from './status.docs';

import { Status } from '..';

const meta = {
    title: 'Components/Status',
    component: Status,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: StatusDocs,
            description: {
                component:
                    'Status отображает короткую подпись состояния в плашке. Размеры 20/24/32/40, формы rectangular/rounded, восемь цветов и независимые декоративные аддоны. По умолчанию — 24 / rectangular / grey.',
            },
        },
    },
    args: {
        message: 'Готово',
        uppercase: false,
        size: 24,
        shape: 'rectangular',
        color: 'grey',
        dataTestId: 'status',
    },
    argTypes: {
        size: { control: 'select', options: [20, 24, 32, 40] },
        shape: { control: 'select', options: ['rectangular', 'rounded'] },
        color: {
            control: 'select',
            options: ['green', 'orange', 'red', 'blue', 'grey', 'teal', 'purple', 'sand'],
        },
        message: { control: 'text' },
        uppercase: { control: 'boolean' },
        leftAddon: {
            control: 'select',
            options: ['none', 'tick'],
            mapping: { none: undefined, tick: <TickIcon width={12} height={12} /> },
        },
        rightAddon: {
            control: 'select',
            options: ['none', 'tick'],
            mapping: { none: undefined, tick: <TickIcon width={12} height={12} /> },
        },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Status>;

export default meta;
export const Playground: StoryObj<typeof meta> = {};
