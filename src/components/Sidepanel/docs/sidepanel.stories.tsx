import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { Button } from '../../Button';

import { DemoPanel, type DemoProps } from './examples';
import { SidepanelDocs } from './sidepanel.docs';

import { Content, Footer, Header, Sidepanel } from '..';

function PlaygroundExample({ open: initialOpen, onClose, ...args }: DemoProps) {
    const [open, setOpen] = useState(initialOpen);
    useEffect(() => setOpen(initialOpen), [initialOpen]);
    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };
    return (
        <>
            <Button onClick={() => setOpen(true)} dataTestId="open-sidepanel">
                Открыть Sidepanel
            </Button>
            <DemoPanel {...args} open={open} onClose={handleClose} />
        </>
    );
}

const meta = {
    title: 'Components/Sidepanel',
    component: Sidepanel,
    subcomponents: { Header, Content, Footer },
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: SidepanelDocs,
            description: {
                component:
                    'Панель шириной 500 px с плавным выездом справа и бекдропом Modal. Header, прокручиваемый Content и Footer только с кнопками. На узком экране занимает всю ширину.',
            },
        },
    },
    args: {
        open: false,
        title: 'Заголовок панели',
        hasCloser: true,
        footerLayout: 'space-between',
        footerGap: 12,
        footerBlock: false,
        hasSecondary: true,
        footerSticky: true,
        longContent: false,
        form: false,
        escapeKeyDown: true,
        backdropClick: true,
        lockScroll: true,
        dataTestId: 'sidepanel',
    },
    argTypes: {
        open: { control: 'boolean' },
        title: {
            control: 'text',
            description: 'Title у Header. Пустая строка скрывает только заголовок.',
        },
        hasCloser: { control: 'boolean', description: 'hasCloser у Header.' },
        footerSticky: {
            control: 'boolean',
            description: 'sticky у Footer. По умолчанию кнопки видны при прокрутке.',
        },
        footerLayout: {
            control: 'select',
            options: ['start', 'end', 'center', 'space-between', 'column'],
            description:
                'layout у Footer. По умолчанию space-between; primary справа, secondary слева.',
        },
        footerGap: {
            control: 'select',
            options: [12, 16, 24, 32],
            description: 'gap у Footer, по умолчанию 12.',
        },
        footerBlock: { control: 'boolean', description: 'block у кнопок в примере.' },
        hasSecondary: { control: 'boolean', description: 'Передать secondary в Footer.' },
        longContent: { control: 'boolean' },
        form: { control: 'boolean' },
        escapeKeyDown: { control: 'boolean' },
        backdropClick: { control: 'boolean' },
        lockScroll: { control: 'boolean' },
        onClose: { action: 'close requested' },
        children: { control: false },
        getPortalContainer: { control: false },
    },
} satisfies Meta<DemoProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <PlaygroundExample {...args} /> };
