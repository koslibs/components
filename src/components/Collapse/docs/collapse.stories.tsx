import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { CollapseDocs } from './collapse.docs';

import { Collapse, type CollapseProps } from '..';

function PlaygroundExample({
    expanded: initialExpanded = false,
    onExpandedChange,
    ...args
}: CollapseProps) {
    const [expanded, setExpanded] = useState(initialExpanded);
    useEffect(() => setExpanded(initialExpanded), [initialExpanded]);

    return (
        <div style={{ width: 480, maxWidth: '100%' }}>
            <Collapse
                {...args}
                expanded={expanded}
                onExpandedChange={(nextExpanded) => {
                    setExpanded(nextExpanded);
                    onExpandedChange?.(nextExpanded);
                }}
            />
        </div>
    );
}

const meta = {
    title: 'Components/Collapse',
    component: Collapse,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: CollapseDocs,
            description: {
                component:
                    'Раскрываемый блок с кнопкой сверху: содержимое появляется под ней, а сама кнопка остаётся на месте. Подходит для списков и дополнительной информации. Скрытый контент остаётся смонтированным; его состояние сохраняется.',
            },
        },
    },
    args: {
        expanded: false,
        collapsedLabel: 'Показать файлы (3)',
        expandedLabel: 'Скрыть файлы',
        showRightChevron: true,
        showLeftChevron: false,
        children: (
            <div style={{ display: 'grid', gap: 12, padding: '12px 0' }}>
                <p>session-01.txt — Imported</p>
                <p>session-02.txt — Imported</p>
                <p>session-03.txt — Completed with warnings</p>
                <a href="#details">Подробности предупреждений</a>
            </div>
        ),
    },
    argTypes: {
        expanded: { control: 'boolean', description: 'Состояние controlled-компонента.' },
        defaultExpanded: {
            control: 'boolean',
            description: 'Начальное состояние, если expanded не задан.',
        },
        collapsedLabel: { control: 'text', description: 'Подпись при скрытом содержимом.' },
        expandedLabel: { control: 'text', description: 'Подпись при раскрытом содержимом.' },
        showRightChevron: { control: 'boolean', description: 'Показывать шеврон справа.' },
        showLeftChevron: { control: 'boolean', description: 'Показывать шеврон слева.' },
        onExpandedChange: { action: 'expanded changed' },
        onTransitionEnd: { action: 'transition ended' },
        children: { control: false },
        className: { control: 'text' },
        expandedContentClassName: { control: 'text' },
        dataTestId: { control: 'text' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};
