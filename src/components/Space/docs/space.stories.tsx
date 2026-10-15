import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { Space } from '..';

import { TypographyText } from '../../Typography/text';

import { SpaceDocs } from './space.docs';

import styles from './examples.module.css';

const meta = {
    title: 'Components/Space',
    component: Space,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: SpaceDocs,
            description: {
                component:
                    'Flex-раскладка с отступами из общей шкалы. Горизонтальное и вертикальное направление, выравнивание и перенос без CSS для каждого контейнера.',
            },
        },
    },
    args: {
        direction: 'vertical',
        size: 16,
        align: 'start',
        wrap: false,
        fullWidth: false,
        dataTestId: 'space',
        children: ['Первый', 'Второй', 'Третий'].map((label) => (
            <TypographyText key={label} className={styles.item}>
                {label}
            </TypographyText>
        )),
    },
    argTypes: {
        direction: { control: 'select', options: ['horizontal', 'vertical'] },
        size: {
            control: 'select',
            options: [
                2, 4, 6, 8, 12, 16, 20, 22, 24, 28, 30, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 128,
            ],
        },
        align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
        wrap: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
        children: { control: false },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Horizontal: Story = { args: { direction: 'horizontal', align: 'center', size: 12 } };
export const Wrap: Story = {
    args: {
        direction: 'horizontal',
        size: 16,
        wrap: true,
        className: styles.wrapped,
        children: [1, 2, 3, 4, 5].map((value) => (
            <TypographyText key={value} className={styles.item}>
                {value}
            </TypographyText>
        )),
    },
};
