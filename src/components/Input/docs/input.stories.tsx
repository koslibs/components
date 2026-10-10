import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { InputDocs } from './input.docs';

import { Input, type InputProps } from '..';

function PlaygroundExample({ value: initialValue, onChange, onClear, ...args }: InputProps) {
    const [value, setValue] = useState(initialValue ?? '');
    useEffect(() => setValue(initialValue ?? ''), [initialValue]);

    return (
        <Input
            {...args}
            value={value}
            onChange={(event, payload) => {
                setValue(payload.value);
                onChange?.(event, payload);
            }}
            onClear={(event) => {
                setValue('');
                onClear?.(event);
            }}
        />
    );
}

const meta = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: InputDocs,
            description: {
                component:
                    'Нативное поле ввода по дизайну Figma: primary/secondary, размеры 40–72, label внутри или снаружи, подсказка, ошибка, аддоны и очистка.',
            },
        },
    },
    args: {
        view: 'primary',
        size: 40,
        label: 'Название профиля',
        labelView: 'outer',
        placeholder: 'Введите имя',
        hint: 'Имя будет видно в списке профилей',
        value: 'Александр',
        maxLength: 64,
        showValueLength: false,
        clear: true,
        disabled: false,
        readOnly: false,
        block: false,
        dataTestId: 'input',
    },
    argTypes: {
        view: { control: 'select', options: ['primary', 'secondary'] },
        size: { control: 'select', options: [40, 48, 56, 64, 72] },
        labelView: { control: 'select', options: ['outer', 'inner'] },
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'text' },
        maxLength: { control: { type: 'number', min: 0, step: 1 } },
        showValueLength: { control: 'boolean' },
        defaultValue: { control: false },
        leftAddon: { control: false },
        rightAddon: { control: false },
        onChange: { action: 'changed' },
        onClear: { action: 'cleared' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};
