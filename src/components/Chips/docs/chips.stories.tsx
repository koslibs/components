import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState, type ChangeEvent } from 'react';

import { Chips, type ChipsChangePayload, type ChipsProps } from '..';

import { ChipsDocs } from './chips.docs';

const positions = [
    { value: 'all', label: 'All' },
    { value: 'utg', label: 'UTG' },
    { value: 'utg+1', label: 'UTG+1' },
    { value: 'utg+2', label: 'UTG+2' },
    { value: 'mp', label: 'MP' },
    { value: 'hj', label: 'HJ' },
    { value: 'co', label: 'CO' },
    { value: 'btn', label: 'BTN' },
    { value: 'sb', label: 'SB' },
    { value: 'bb', label: 'BB' },
    { value: 'unknown', label: 'Unknown (0)', disabled: true },
];

function PlaygroundExample(args: ChipsProps) {
    const [value, setValue] = useState<string | readonly string[] | null>(
        args.value ?? args.defaultValue ?? (args.multiselect ? [] : null)
    );

    useEffect(() => {
        setValue(args.value ?? args.defaultValue ?? (args.multiselect ? [] : null));
    }, [args.value, args.defaultValue, args.multiselect]);

    const handleSingleChange = (
        event: ChangeEvent<HTMLInputElement>,
        payload: ChipsChangePayload
    ) => {
        setValue(payload.value);
        if (!args.multiselect) args.onChange?.(event, payload);
    };

    const handleMultipleChange = (
        event: ChangeEvent<HTMLInputElement>,
        payload: ChipsChangePayload<string[]>
    ) => {
        setValue(payload.value);
        if (args.multiselect) args.onChange?.(event, payload);
    };

    if (args.multiselect)
        return (
            <Chips
                {...args}
                multiselect
                value={Array.isArray(value) ? value : []}
                onChange={handleMultipleChange}
            />
        );

    return (
        <Chips
            {...args}
            multiselect={false}
            value={typeof value === 'string' ? value : null}
            onChange={handleSingleChange}
        />
    );
}

const meta = {
    title: 'Components/Chips',
    component: Chips,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: ChipsDocs,
            description: {
                component:
                    'Компактная группа выбора одного или нескольких значений. All — обычный пункт. Высота 32px, Inter Regular 14/20, pill и перенос целых элементов.',
            },
        },
    },
    args: {
        items: positions,
        multiselect: false,
        disabled: false,
        dataTestId: 'chips',
    },
    argTypes: {
        multiselect: { control: 'boolean' },
        disabled: { control: 'boolean' },
        items: { control: 'object' },
        value: { control: 'object' },
        defaultValue: { control: 'object' },
        ref: { table: { disable: true } },
    },
    render: PlaygroundExample,
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultValue: 'all' } };

export const Multiselect: Story = {
    args: { multiselect: true, defaultValue: ['co', 'btn'] },
};

export const Disabled: Story = { args: { defaultValue: 'btn', disabled: true } };

export const DisabledItems: Story = {
    args: { multiselect: true, defaultValue: ['btn', 'unknown'] },
};

export const Empty: Story = {};

export const LongLabels: Story = {
    args: {
        items: [
            { value: 'short', label: 'Короткая метка' },
            { value: 'long', label: 'Полная длинная подпись без сокращения многоточием' },
            { value: 'unbroken', label: 'ОченьДлинноеСловоБезПробеловДляПроверкиУзкогоКонтейнера' },
        ],
        defaultValue: 'long',
        style: { maxWidth: 260 },
    },
};
