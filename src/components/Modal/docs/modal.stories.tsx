import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { useEffect, useState } from 'react';

import { Button } from '../../Button';
import { TypographyText } from '../../Typography';

import { ModalDocs } from './modal.docs';

import { Content, Controls, Footer, Header, Modal, type ModalProps } from '..';

function PlaygroundExample({ open: initialOpen, onClose, ...args }: ModalProps) {
    const [open, setOpen] = useState(initialOpen);

    useEffect(() => setOpen(initialOpen), [initialOpen]);

    const handleOpen = () => setOpen(true);
    const handleDismiss = () => setOpen(false);
    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };

    return (
        <>
            <Button onClick={handleOpen}>Открыть модальное окно</Button>
            <Modal {...args} open={open} onClose={handleClose} aria-label="Заголовок окна">
                <Header title="Заголовок окна" subtitle="Необязательное описание" />
                <Content>
                    <TypographyText>Здесь располагается ваш контент.</TypographyText>
                </Content>
                <Footer>
                    <Controls
                        secondary={
                            <Button view="secondary" size={48} onClick={handleDismiss}>
                                Отмена
                            </Button>
                        }
                        primary={
                            <Button size={48} onClick={handleDismiss}>
                                Готово
                            </Button>
                        }
                    />
                </Footer>
            </Modal>
        </>
    );
}

const meta = {
    title: 'Components/Modal',
    component: Modal,
    subcomponents: { Header, Content, Footer, Controls },
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            page: ModalDocs,
            description: {
                component:
                    'Модальное окно на основе нативного dialog: Modal, Header, Content, Footer и Controls. Ширина по умолчанию 720 px, отступы 24 px, скругление 12 px. Содержимое и действия передаются вызывающим компонентом.',
            },
        },
    },
    args: {
        open: false,
        size: 720,
        escapeKeyDown: true,
        backdropClick: true,
        lockScroll: true,
        dataTestId: 'modal',
    },
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Видимость окна. В примере также можно открыть окно кнопкой.',
        },
        size: { control: 'select', options: [480, 600, 720, 960, 'fullscreen'] },
        escapeKeyDown: { control: 'boolean' },
        backdropClick: { control: 'boolean' },
        lockScroll: { control: 'boolean' },
        onClose: {
            action: 'closed',
            description: 'Обработчик запроса закрытия без аргументов. Для закрытия обновите open.',
        },
        children: { control: false },
        getPortalContainer: { control: false },
        ref: { table: { disable: true } },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};
