import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { ButtonDocs } from './button.docs';

import { Button } from '..';

const addon = <span aria-hidden="true">★</span>;

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: ButtonDocs,
            description: {
                component:
                    'Кнопка запускает действие и поддерживает шесть вариантов оформления, шесть размеров, две формы, аддоны и подпись. По умолчанию используется primary, размер 40 и форма rectangular. Тип button предотвращает случайную отправку формы; для отправки передайте type="submit".',
            },
        },
    },
    args: {
        children: 'Импортировать',
        view: 'primary',
        size: 40,
        shape: 'rectangular',
        loading: false,
        disabled: false,
        block: false,
        hint: '',
        leftAddon: undefined,
        rightAddon: undefined,
    },
    argTypes: {
        children: { control: 'text', description: 'Основной текст кнопки.' },
        view: {
            control: 'select',
            options: ['primary', 'secondary', 'accent', 'outlined', 'transparent', 'text'],
            description: 'Вариант оформления кнопки.',
        },
        size: {
            control: 'select',
            options: [32, 40, 48, 56, 64, 72],
            description: 'Размер кнопки; для text высота определяется текстом.',
        },
        shape: {
            control: 'inline-radio',
            options: ['rectangular', 'rounded'],
            description: 'Прямоугольная форма со скруглением или форма капсулы.',
        },
        loading: { control: 'boolean', description: 'Спиннер и блокировка повторных нажатий.' },
        disabled: { control: 'boolean', description: 'Недоступное действие.' },
        block: { control: 'boolean', description: 'Растянуть кнопку на ширину контейнера.' },
        hint: { control: 'text', description: 'Подпись под текстом для размеров 56, 64 и 72.' },
        leftAddon: {
            control: 'select',
            options: ['none', 'star'],
            mapping: { none: undefined, star: addon },
            description: 'Иконка или другой элемент слева от текста.',
        },
        rightAddon: {
            control: 'select',
            options: ['none', 'star'],
            mapping: { none: undefined, star: addon },
            description: 'Иконка или другой элемент справа от текста.',
        },
        onClick: { action: 'clicked' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => (
        <div style={args.block ? { width: 'min(420px, 80vw)' } : undefined}>
            <Button {...args} />
        </div>
    ),
};
