import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { Select, type SelectOption, type SelectProps } from '..';

import { SelectDocs } from './select.docs';

const options: SelectOption[] = [
    { id: 'cash', label: 'Кэш' },
    { id: 'tournaments', label: 'Турниры' },
    { id: 'spin', label: 'Турниры Spin & Go' },
    { id: 'other', label: 'Другое', disabled: true },
];

function PlaygroundExample(args: SelectProps) {
    const [value, setValue] = useState<SelectProps['value']>(args.value);
    useEffect(() => setValue(args.value), [args.value, args.multiple]);
    if (args.multiple)
        return (
            <Select
                {...args}
                multiple
                value={Array.isArray(value) ? value : []}
                onChange={(event, payload) => {
                    setValue(payload.value);
                    args.onChange?.(event, payload);
                }}
                onClear={(event) => {
                    setValue([]);
                    args.onClear?.(event);
                }}
            />
        );
    return (
        <Select
            {...args}
            multiple={false}
            value={typeof value === 'string' ? value : null}
            onChange={(event, payload) => {
                setValue(payload.value);
                args.onChange?.(event, payload);
            }}
            onClear={(event) => {
                setValue(null);
                args.onClear?.(event);
            }}
        />
    );
}

const meta = {
    title: 'Components/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: SelectDocs,
            description: {
                component:
                    'Одиночный и множественный выбор с поиском в списке. Геометрия Input, значения через запятую, длинные подписи с многоточием.',
            },
        },
    },
    args: {
        options,
        label: 'Формат игры',
        placeholder: 'Выберите значение',
        value: 'cash',
        view: 'primary',
        size: 40,
        labelView: 'outer',
        multiple: false,
        searchable: true,
        clear: true,
        hasOutline: false,
        dataTestId: 'select',
    },
    argTypes: {
        hasOutline: { control: 'boolean' },
        view: { control: 'select', options: ['primary', 'secondary'] },
        size: { control: 'select', options: [40, 48, 56, 64, 72] },
        labelView: { control: 'select', options: ['outer', 'inner'] },
        value: { control: 'object' },
        options: { control: 'object' },
        error: { control: 'text' },
        hint: { control: 'text' },
        label: { control: 'text' },
        multiple: { control: 'boolean' },
        searchable: { control: 'boolean' },
        clear: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        open: { control: false },
        defaultValue: { control: false },
        onChange: { action: 'changed' },
        onClear: { action: 'cleared' },
        onOpenChange: { action: 'opened' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <PlaygroundExample {...args} /> };
export const Multiple: Story = {
    args: { multiple: true, value: ['cash', 'tournaments'] },
    render: (args) => <PlaygroundExample {...args} />,
};

export const LongList: Story = {
    args: {
        options: Array.from({ length: 24 }, (_, index) => ({
            id: String(index),
            label: `Вариант ${index + 1}`,
        })),
        multiple: true,
        value: ['0', '1', '2'],
        labelView: 'inner',
    },
    render: (args) => <PlaygroundExample {...args} />,
};
