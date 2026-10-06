import type { Meta, StoryObj } from '@koslibs/builder/storybook';
import { StrictMode, useEffect, useState, type ComponentProps } from 'react';

import { Button } from '../../Button';
import { TypographyText } from '../../Typography';

import { ExampleSurface, type ExampleAppearance } from './example-surface';
import { PopoverDocs } from './popover.docs';

import { Popover } from '..';

import styles from './examples.module.css';

type PlaygroundProps = ComponentProps<typeof Popover> & { appearance?: ExampleAppearance };

function PlaygroundExample({ open: initialOpen, onClose, appearance, ...args }: PlaygroundProps) {
    const [open, setOpen] = useState(initialOpen);
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    const [wideAnchor, setWideAnchor] = useState(false);
    const [longContent, setLongContent] = useState(false);

    useEffect(() => setOpen(initialOpen), [initialOpen]);

    const handleToggle = () => setOpen((value) => !value);
    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };
    const handleResize = () => setWideAnchor((value) => !value);
    const handleContentChange = () => setLongContent((value) => !value);

    return (
        <div className={styles.playground}>
            <Button
                ref={setAnchorElement}
                view="secondary"
                onClick={handleToggle}
                dataTestId="popover-anchor"
            >
                {wideAnchor ? 'Кнопка с более длинным названием' : 'Открыть поповер'}
            </Button>
            <Popover {...args} open={open} anchorElement={anchorElement} onClose={handleClose}>
                <ExampleSurface appearance={appearance} dataTestId="popover-playground-content">
                    <div className={styles.playgroundContent}>
                        <TypographyText size={15} weight="bold">
                            Содержимое поповера
                        </TypographyText>
                        <TypographyText size={12}>
                            Нажатие внутри сохраняет окно открытым. Escape и нажатие снаружи
                            закрывают его.
                        </TypographyText>
                        <Button
                            view="secondary"
                            size={32}
                            onClick={handleResize}
                            dataTestId="popover-resize-anchor"
                        >
                            Изменить ширину кнопки
                        </Button>
                        <Button
                            view="secondary"
                            size={32}
                            onClick={handleContentChange}
                            dataTestId="popover-change-content"
                        >
                            {longContent ? 'Короткий контент' : 'Длинный контент'}
                        </Button>
                        {longContent &&
                            Array.from({ length: 30 }, (_, index) => (
                                <TypographyText key={index} size={12}>
                                    Строка {index + 1}
                                </TypographyText>
                            ))}
                    </div>
                </ExampleSurface>
            </Popover>
        </div>
    );
}

const positions = [
    'top-start',
    'top',
    'top-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
    'right-start',
    'right',
    'right-end',
];

const meta = {
    title: 'Components/Popover',
    component: Popover,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <StrictMode>
                <Story />
            </StrictMode>
        ),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            page: PopoverDocs,
            description: {
                component:
                    'Управляемый поповер относительно элемента. Рендерится через портал, выбирает подходящую сторону и ограничивает размеры. Содержимое, его оформление и прокрутка задаются снаружи.',
            },
        },
    },
    args: {
        open: false,
        anchorElement: null,
        position: 'bottom-start',
        offset: [0, 0],
        useAnchorWidth: false,
        preventFlip: false,
        preventOverflow: true,
        availableHeight: true,
        viewportPadding: 8,
        outsideClick: true,
        escapeKeyDown: true,
        appearance: 'default',
        style: { width: 304 },
        dataTestId: 'popover-playground',
    },
    argTypes: {
        open: { control: 'boolean' },
        position: { control: 'select', options: positions },
        offset: { control: 'object' },
        fallbackPlacements: { control: 'object' },
        useAnchorWidth: { control: 'boolean' },
        preventFlip: { control: 'boolean' },
        preventOverflow: { control: 'boolean' },
        availableHeight: { control: 'boolean' },
        viewportPadding: { control: { type: 'number', min: 0 } },
        outsideClick: { control: 'boolean' },
        escapeKeyDown: { control: 'boolean' },
        appearance: {
            name: 'Оформление примера',
            description: 'Оформление содержимого примера; не является свойством Popover.',
            control: 'select',
            options: ['default', 'inverted'],
            table: { category: 'Пример содержимого' },
        },
        onClose: { action: 'closed' },
        anchorElement: { control: false },
        children: { control: false },
        getPortalContainer: { control: false },
        style: { control: false },
        ref: { table: { disable: true } },
    },
} satisfies Meta<PlaygroundProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <PlaygroundExample {...args} />,
};
