import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { TextareaDocs } from './textarea.docs';

import { Textarea, type TextareaProps } from '..';

function PlaygroundExample({ value: initialValue, onChange, onClear, ...args }: TextareaProps) {
    const [value, setValue] = useState(initialValue ?? '');
    useEffect(() => setValue(initialValue ?? ''), [initialValue]);

    return (
        <Textarea
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
    title: 'Components/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: TextareaDocs,
            description: {
                component:
                    'Многострочное поле в стиле Input: primary/secondary, inner/outer label, подсказка, ошибка, счётчик, очистка, autosize и вертикальный resize.',
            },
        },
    },
    args: {
        view: 'primary',
        label: 'Комментарий',
        labelView: 'outer',
        placeholder: 'Введите комментарий',
        hint: 'Комментарий увидят участники',
        value: 'Первая строка.\nВторая строка.',
        minRows: 3,
        autosize: false,
        resize: false,
        maxLength: 200,
        showValueLength: true,
        clear: true,
        disabled: false,
        readOnly: false,
        block: false,
        dataTestId: 'textarea',
    },
    argTypes: {
        view: { control: 'select', options: ['primary', 'secondary'] },
        labelView: { control: 'select', options: ['outer', 'inner'] },
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'text' },
        minRows: { control: { type: 'number', min: 1, step: 1 } },
        maxRows: { control: { type: 'number', min: 1, step: 1 } },
        maxLength: { control: { type: 'number', min: 0, step: 1 } },
        showValueLength: { control: 'boolean' },
        autosize: { control: 'boolean' },
        resize: { control: 'boolean' },
        defaultValue: { control: false },
        onChange: { action: 'changed' },
        onClear: { action: 'cleared' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};
