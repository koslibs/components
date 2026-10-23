import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { AllDisabledExample, TabsDocs } from './tabs.docs';

import { Tab, Tabs, type TabsProps } from '..';

function PlaygroundExample({ selectedId: initialId, onChange, ...args }: TabsProps) {
    const [selectedId, setSelectedId] = useState(initialId);
    useEffect(() => setSelectedId(initialId), [initialId]);
    return (
        <div style={{ width: 720, maxWidth: '100%' }}>
            <Tabs
                {...args}
                selectedId={selectedId}
                onChange={(event, payload) => {
                    setSelectedId(payload.selectedId);
                    onChange?.(event, payload);
                }}
            />
            <p>
                {selectedId === 'active' && 'Пять активных профилей.'}
                {selectedId === 'archived' && 'Два архивных профиля.'}
                {selectedId === 'empty' && 'Сессий пока нет.'}
            </p>
        </div>
    );
}

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    subcomponents: { Tab },
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: TabsDocs,
            description: {
                component:
                    'Tabs с дочерними Tab: один ряд заголовков, необязательные счётчики и выбор вкладки. Содержимое отображается отдельно в приложении по selectedId. Размеры 40/48, controlled/uncontrolled.',
            },
        },
    },
    args: {
        children: [
            <Tab key="active" id="active" title="Active" count={5} />,
            <Tab key="archived" id="archived" title="Archived" count={2} />,
            <Tab key="empty" id="empty" title="Без сессий" count={0} />,
            <Tab key="unavailable" id="unavailable" title="Недоступно" count={3} disabled />,
        ],
        selectedId: 'active',
        size: 40,
        dataTestId: 'tabs',
    },
    argTypes: {
        children: { control: false },
        selectedId: { control: 'select', options: ['active', 'archived', 'empty'] },
        defaultSelectedId: { control: false },
        size: { control: 'select', options: [40, 48] },
        onChange: { action: 'changed' },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};

export const AllDisabled: Story = {
    parameters: { controls: { include: ['size'] } },
    render: ({ size }) => <AllDisabledExample size={size} />,
};
