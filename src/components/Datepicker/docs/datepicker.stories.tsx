import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState, type MouseEvent } from 'react';

import { Button } from '../../Button';

import {
    Datepicker,
    DatepickerPanel,
    DatepickerPopover,
    type DatepickerChangePayload,
    type DatepickerProps,
    type DatepickerRange,
} from '..';

import { DatepickerDocs } from './datepicker.docs';

function PlaygroundExample(args: DatepickerProps) {
    const [value, setValue] = useState<DatepickerProps['value']>(args.value ?? null);

    useEffect(() => setValue(args.value ?? null), [args.value, args.mode]);

    const handleRangeChange = (
        event: MouseEvent<HTMLButtonElement>,
        payload: DatepickerChangePayload<DatepickerRange | null>
    ) => {
        setValue(payload.value);

        if (args.mode === 'range') args.onChange?.(event, payload);
    };

    const handleSingleChange = (
        event: MouseEvent<HTMLButtonElement>,
        payload: DatepickerChangePayload
    ) => {
        setValue(payload.value);

        if (args.mode !== 'range') args.onChange?.(event, payload);
    };

    const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
        setValue(null);
        args.onClear?.(event);
    };

    if (args.mode === 'range')
        return (
            <Datepicker
                {...args}
                mode="range"
                value={value && typeof value === 'object' ? value : null}
                onChange={handleRangeChange}
                onClear={handleClear}
            />
        );

    return (
        <Datepicker
            {...args}
            mode="single"
            value={typeof value === 'string' ? value : null}
            onChange={handleSingleChange}
            onClear={handleClear}
        />
    );
}

const meta = {
    title: 'Components/Datepicker',
    component: Datepicker,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: DatepickerDocs,
            description: {
                component:
                    'Одна календарная дата или включительный диапазон. Ручной ввод и календарь меняют черновик; Apply подтверждает выбор.',
            },
        },
    },
    args: {
        mode: 'single',
        value: '2026-10-25',
        label: 'Date',
        view: 'primary',
        size: 40,
        clear: true,
        dataTestId: 'datepicker',
    },
    argTypes: {
        mode: { control: 'select', options: ['single', 'range'] },
        size: { control: 'select', options: [40, 48, 56, 64, 72] },
        view: { control: 'select', options: ['primary', 'secondary'] },
        labelView: { control: 'select', options: ['outer', 'inner'] },
        value: { control: 'object' },
        hasOutline: { control: 'boolean' },
    },
    render: (args) => <PlaygroundExample {...args} />,
} satisfies Meta<typeof Datepicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Range: Story = {
    args: { mode: 'range', value: { from: '2026-12-28', to: '2027-01-04' }, label: 'Period' },
};
export const SinglePanel: Story = {
    render: () => <DatepickerPanel defaultValue="2026-10-25" dataTestId="single-panel" />,
};
export const RangePanel: Story = {
    render: () => (
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2027-02-08', to: '2027-02-26' }}
            dataTestId="range-panel"
        />
    ),
};
export const YearBoundary: Story = {
    render: () => (
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="year-panel"
        />
    ),
};
export const EmptyPanel: Story = { render: () => <DatepickerPanel dataTestId="empty-panel" /> };
export const Uncontrolled: Story = {
    render: () => <Datepicker label="Uncontrolled date" defaultValue="2026-10-25" clear />,
};

function ControlledExample() {
    const [value, setValue] = useState<DatepickerRange | null>({
        from: '2026-12-28',
        to: '2027-01-04',
    });

    const handleChange = (
        _: MouseEvent<HTMLButtonElement>,
        payload: DatepickerChangePayload<DatepickerRange | null>
    ) => setValue(payload.value);

    const handleClear = () => setValue(null);

    return (
        <Datepicker
            mode="range"
            label="Controlled period"
            value={value}
            onChange={handleChange}
            clear
            onClear={handleClear}
        />
    );
}

export const Controlled: Story = { render: () => <ControlledExample /> };

function ExternalPopoverExample() {
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);

    const handleToggle = () => setOpen((current) => !current);
    const handleClose = () => setOpen(false);

    const handleChange = (
        _: MouseEvent<HTMLButtonElement>,
        { value: next }: DatepickerChangePayload
    ) => {
        setValue(next);
        handleClose();
    };

    return (
        <>
            <Button ref={setAnchorElement} onClick={handleToggle}>
                {value ?? 'Choose a date'}
            </Button>
            <DatepickerPopover
                open={open}
                anchorElement={anchorElement}
                value={value}
                onChange={handleChange}
                onClose={handleClose}
                dataTestId="external-datepicker-popover"
            />
        </>
    );
}

export const ExternalPopover: Story = { render: ExternalPopoverExample };
export const InnerLabel: Story = { args: { labelView: 'inner', view: 'secondary', size: 56 } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Error: Story = {
    args: { error: 'Check the date', hint: 'YYYY-MM-DD', hasOutline: true },
};
