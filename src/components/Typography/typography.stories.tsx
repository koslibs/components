import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { TypographyDocs } from './typography.docs';

import { TypographyText } from '.';

const meta = {
    title: 'Components/Typography',
    component: TypographyText,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: TypographyDocs,
            description: {
                component:
                    'TypographyText и TypographyTitle используют Inter через --font-primary. Размер, вес и цвет задаются отдельно от HTML-тега. Основные размеры и начертания взяты из макета GullEye.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 480, maxWidth: '100%' }}>
                <Story />
            </div>
        ),
    ],
    args: {
        children: 'GullEye — статистика и история раздач',
        size: 13,
        weight: 'regular',
        color: 'primary',
        tag: 'span',
        caps: false,
        monospaceNumbers: false,
        dataTestId: 'typography-playground',
    },
    argTypes: {
        children: { control: 'text', description: 'Содержимое текста.' },
        size: {
            control: 'select',
            options: [8, 9, 10, 11, 12, 13, 14, 15, 16, 20],
            description: 'Размер TypographyText в пикселях. По умолчанию 13.',
        },
        weight: {
            control: 'inline-radio',
            options: ['regular', 'medium', 'semibold', 'bold'],
            description: 'Толщина: 400, 500, 600 или 700.',
        },
        color: {
            control: 'select',
            options: ['inherit', 'primary', 'secondary', 'inverse', 'positive', 'negative'],
            description: 'Семантический цвет. По умолчанию inherit.',
        },
        tag: {
            control: 'inline-radio',
            options: ['span', 'p', 'div', 'li'],
            description: 'HTML-тег TypographyText. Для li используйте родительский список.',
        },
        caps: { control: 'boolean', description: 'Верхний регистр.' },
        monospaceNumbers: { control: 'boolean', description: 'Цифры одинаковой ширины.' },
        rowLimit: {
            control: 'select',
            options: [undefined, 1, 2, 3],
            description: 'Число видимых строк. Без значения текст не обрезается.',
        },
        className: { control: 'text', description: 'Дополнительный CSS-класс.' },
        style: { control: 'object', description: 'Инлайн-стили корневого элемента.' },
        dataTestId: { control: 'text', description: 'Значение атрибута data-test-id.' },
    },
} satisfies Meta<typeof TypographyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
