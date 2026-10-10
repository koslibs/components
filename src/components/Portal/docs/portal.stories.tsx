import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useState } from 'react';

import { Portal, type PortalProps } from '..';

import { PortalDocs } from './portal.docs';

import styles from './examples.module.css';

function PortalExample(args: PortalProps) {
    const [first, setFirst] = useState<HTMLDivElement | null>(null);
    const [second, setSecond] = useState<HTMLDivElement | null>(null);
    const [target, setTarget] = useState<'first' | 'second' | 'none'>('first');

    return (
        <div className={styles.examples}>
            <div className={styles.actions}>
                <button type="button" onClick={() => setTarget('first')}>
                    Контейнер A
                </button>
                <button type="button" onClick={() => setTarget('second')}>
                    Контейнер B
                </button>
                <button type="button" onClick={() => setTarget('none')}>
                    Скрыть содержимое
                </button>
            </div>
            <div className={styles.target} ref={setFirst} data-test-id="portal-target-a">
                A
            </div>
            <div className={styles.target} ref={setSecond} data-test-id="portal-target-b">
                B
            </div>
            <Portal
                {...args}
                getPortalContainer={() => {
                    if (target === 'none') return null;
                    return target === 'first' ? first : second;
                }}
            >
                <div className={styles.content} data-test-id="portal-example-content">
                    <span>Содержимое Portal</span>
                    <input aria-label="Текст внутри Portal" defaultValue="Введите текст" />
                </div>
            </Portal>
        </div>
    );
}

const meta = {
    title: 'Components/Portal',
    component: Portal,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            page: PortalDocs,
            description: {
                component:
                    'Переносит содержимое в другой DOM-контейнер. Portal не создаёт обёртку и не задаёт оформление, позиционирование, z-index или поведение закрытия.',
            },
        },
    },
    args: { immediateMount: true },
    argTypes: {
        immediateMount: { control: 'boolean' },
        getPortalContainer: { control: false },
        children: { control: false },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <PortalExample {...args} /> };
