import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { Skeleton } from '..';

import { SkeletonDocs } from './skeleton.docs';

const meta = {
    title: 'Components/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: SkeletonDocs,
            description: {
                component:
                    'Заполнитель загружаемого блока. Сохраняет место контента и пульсирует с периодом 1,6 с. Размеры задаёт приложение; анимацией управляет animated.',
            },
        },
    },
    args: {
        animated: true,
        style: { width: '100%', height: 176 },
        dataTestId: 'skeleton',
    },
    argTypes: {
        animated: { control: 'boolean' },
        style: {
            control: 'object',
            description: 'Размеры и скругление блока. Например: { height: 176, borderRadius: 12 }.',
        },
        className: { control: 'text' },
        dataTestId: { control: 'text' },
        children: { table: { disable: true } },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
