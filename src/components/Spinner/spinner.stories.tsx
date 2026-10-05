import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { SpinnerDocs } from './spinner.docs';

import { Spinner } from '.';

const meta = {
    title: 'Components/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: SpinnerDocs,
            description: {
                component:
                    'Индикатор ожидания для асинхронных действий. По умолчанию скрыт; передайте visible, чтобы показать его. Размер по умолчанию — 24 px. Цвет задаётся через style.color.',
            },
        },
    },
    args: { visible: true, size: 24 },
    argTypes: {
        visible: {
            control: 'boolean',
            description: 'Показывает индикатор. При false он не занимает места.',
        },
        size: {
            control: 'inline-radio',
            options: [16, 24, 48],
            description: 'Размер индикатора в пикселях, включая внутренние отступы.',
        },
        style: { control: 'object', description: 'Инлайн-стили; используйте color для цвета.' },
        className: { control: 'text', description: 'Дополнительный CSS-класс.' },
        id: { control: 'text', description: 'Идентификатор SVG-элемента в DOM.' },
        dataTestId: { control: 'text', description: 'Значение атрибута data-test-id.' },
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
