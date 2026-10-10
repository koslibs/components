import {
    ArgTypes,
    Controls as DocsControls,
    Description,
    Primary,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import { useState } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import { Popover } from '../../Popover';
import { TypographyText } from '../../Typography';
import changelog from '../CHANGELOG.md?raw';
import colors from '../colors.module.css?raw';
import contentStyles from '../components/content/index.module.css?raw';
import controlsStyles from '../components/controls/index.module.css?raw';
import footerStyles from '../components/footer/index.module.css?raw';
import headerStyles from '../components/header/index.module.css?raw';
import modalStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Content, Controls, Footer, Header, Modal, type ModalProps } from '..';

import styles from './examples.module.css';

const example = `import { useState } from 'react';
import { Modal, Header, Content, Footer, Controls } from '@koslibs/components/Modal';
import { Button } from '@koslibs/components/Button';

const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

<Button onClick={handleOpen}>Открыть</Button>
<Modal open={open} onClose={handleClose} aria-label="Заголовок окна" dataTestId="settings">
    <Header title="Заголовок окна" subtitle="Необязательное описание" />
    <Content>{children}</Content>
    <Footer>
        <Controls
            secondary={<Button view="secondary" size={48} onClick={handleClose}>Отмена</Button>}
            primary={<Button size={48} onClick={handleSubmit}>Сохранить</Button>}
        />
    </Footer>
</Modal>`;

type ExampleProps = {
    /**
     * Ширина окна.
     */
    size?: ModalProps['size'];

    /**
     * Показывает пример с прокручиваемым содержимым.
     */
    long?: boolean;

    /**
     * Показывает пример без заголовка.
     */
    withoutHeader?: boolean;
};

function ModalExample({ size = 720, long = false, withoutHeader = false }: ExampleProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const sizeLabel = long ? 'Длинный контент' : `${size}`;
    const label = withoutHeader ? 'Без Header' : sizeLabel;

    return (
        <>
            <Button view="secondary" onClick={handleOpen}>
                {label}
            </Button>
            <Modal open={open} size={size} onClose={handleClose} aria-label="Заголовок окна">
                {!withoutHeader && (
                    <Header title="Заголовок окна" subtitle="Необязательное описание" />
                )}
                <Content>
                    {long ? (
                        Array.from({ length: 30 }, (_, index) => (
                            <TypographyText tag="p" key={index}>
                                Строка {index + 1}. Содержимое передаётся через children.
                            </TypographyText>
                        ))
                    ) : (
                        <TypographyText>Здесь располагается ваш контент.</TypographyText>
                    )}
                </Content>
                <Footer>
                    <Controls
                        primary={
                            <Button size={48} onClick={handleClose}>
                                Закрыть окно
                            </Button>
                        }
                    />
                </Footer>
            </Modal>
        </>
    );
}

function NestedExample() {
    const [open, setOpen] = useState(false);
    const [nested, setNested] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleNestedOpen = () => setNested(true);
    const handleNestedClose = () => setNested(false);

    return (
        <>
            <Button view="secondary" onClick={handleOpen}>
                Вложенные окна
            </Button>
            <Modal open={open} onClose={handleClose} aria-label="Вложенные окна">
                <Header title="Вложенные окна" />
                <Content>
                    <Button view="secondary" onClick={handleNestedOpen}>
                        Открыть вложенное окно
                    </Button>
                </Content>
                <Footer>
                    <Controls
                        primary={
                            <Button size={48} onClick={handleClose}>
                                Закрыть окно
                            </Button>
                        }
                    />
                </Footer>
                <Modal
                    open={nested}
                    size={480}
                    onClose={handleNestedClose}
                    aria-label="Вложенное окно"
                >
                    <Header title="Вложенное окно" />
                    <Content>
                        <TypographyText>Escape закрывает только верхнее окно.</TypographyText>
                    </Content>
                </Modal>
            </Modal>
        </>
    );
}

function PopoverExample() {
    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

    return (
        <>
            <Button view="secondary" onClick={() => setOpen(true)}>
                Popover в модалке
            </Button>
            <Modal
                open={open}
                ref={setDialog}
                onClose={() => setOpen(false)}
                aria-label="Popover в модалке"
            >
                <Header title="Popover в модалке" />
                <Content>
                    <Button
                        ref={setAnchor}
                        view="secondary"
                        onClick={() => setPopoverOpen((value) => !value)}
                    >
                        Открыть Popover
                    </Button>
                    <Popover
                        open={popoverOpen}
                        anchorElement={anchor}
                        getPortalContainer={() => dialog}
                        onClose={() => setPopoverOpen(false)}
                    >
                        <div className={styles.popover}>
                            <TypographyText color="inherit">
                                Popover находится в верхнем слое модалки.
                            </TypographyText>
                            <Button view="secondary" onClick={() => setPopoverOpen(false)}>
                                Закрыть Popover
                            </Button>
                        </div>
                    </Popover>
                </Content>
            </Modal>
        </>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>Откройте окно кнопкой. Меняйте ширину и варианты закрытия в Controls.</p>
            <Primary />
            <h2>Использование</h2>
            <pre>
                <code>{example}</code>
            </pre>
            <h2>Состав</h2>
            <ul>
                <li>
                    <code>Modal</code> — портал, подложка, размеры и управление видимостью.
                </li>
                <li>
                    <code>Header</code> — title, subtitle и крестик. hasCloser=false скрывает
                    крестик. Крестик вызывает onClose ближайшего Modal через внутренний контекст.
                    Заголовок — 20 px semibold, подзаголовок — 14 px regular. Крестик 18 × 18 px
                    выровнен справа в области 48 × 32 px. Нижний отступ Header — 0.
                </li>
                <li>
                    <code>Content</code> — область с отступами 24 px и собственной прокруткой. Её
                    высота зависит от содержимого.
                </li>
                <li>
                    <code>Footer</code> — нижняя область для произвольного содержимого: сверху 0, по
                    бокам и снизу 24 px. Примеры действий используют Button 48.
                </li>
                <li>
                    <code>Controls</code> — слоты secondary и primary, расположенные в этом порядке.
                    Вместо слотов можно передать children. layout: start, end, center,
                    space-between, column; gap: 8, 12, 16, 24.
                </li>
            </ul>
            <p>
                Все части поддерживают className, style, ref, dataTestId и стандартные
                HTML-атрибуты. Части наследуют dataTestId ближайшего Modal с суффиксами -header,
                -content, -footer и -controls. Например, dataTestId="settings" создаёт
                settings-header, settings-content, settings-footer и settings-controls. Явный
                dataTestId части имеет приоритет; пустая строка отключает её атрибут. Без
                идентификатора атрибут не добавляется. Header, Content и Footer добавляйте по
                необходимости.
            </p>
            <h2>Поведение</h2>
            <p>
                open — управляемый параметр: onClose запрашивает закрытие, а вызывающий компонент
                меняет open. Escape, клик по подложке и нативное закрытие через ref или form
                method="dialog", а также крестик Header вызывают onClose модалки без аргументов. Во
                вложенном окне Header использует обработчик своего Modal. Клик внутри окна и
                перетаскивание из окна на подложку не закрывают его.
            </p>
            <p>Длинный Content прокручивается отдельно, Header и Footer остаются видимыми.</p>
            <p>
                Передайте доступное имя через aria-label или aria-labelledby. Нативный dialog
                удерживает фокус внутри открытого окна и возвращает его после закрытия.
                getPortalContainer выбирает контейнер портала; по умолчанию используется body. Если
                контейнер вернул null, окно не рендерится.
            </p>
            <DocsControls />
            <h2>Ширина</h2>
            <p>
                На узком экране окно уменьшается с отступом 16 px от краёв. fullscreen занимает весь
                экран.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {([480, 600, 720, 960, 'fullscreen'] as const).map((size) => (
                        <ModalExample key={size} size={size} />
                    ))}
                </div>
            </Unstyled>
            <h2>Длинный контент и необязательные части</h2>
            <p>
                Оболочка не задаёт фиксированную высоту и не содержит логики конкретного сценария.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <ModalExample long />
                    <ModalExample withoutHeader />
                </div>
            </Unstyled>
            <h2>Вложенные окна</h2>
            <p>Вложенное окно закрывается независимо от родительского.</p>
            <Unstyled>
                <NestedExample />
            </Unstyled>
            <h2>Popover внутри Modal</h2>
            <p>
                Передайте dialog из ref в getPortalContainer поповера. Так Popover будет внутри
                верхнего слоя окна. Escape сначала закрывает Popover, затем Modal.
            </p>
            <pre>
                <code>{`const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

<Modal open={open} ref={setDialog} onClose={handleClose} aria-label="Настройки">
    <Content>
        <Popover open={popoverOpen} anchorElement={anchorElement}
            getPortalContainer={() => dialog} onClose={handlePopoverClose}>
            {children}
        </Popover>
    </Content>
</Modal>`}</code>
            </pre>
            <Unstyled>
                <PopoverExample />
            </Unstyled>
        </>
    );
}

export function ModalDocs() {
    return (
        <ComponentDocs
            componentName="Modal"
            documentation={<Documentation />}
            props={
                <>
                    <h3>Modal</h3>
                    <ArgTypes of={Modal} />
                    <h3>Header</h3>
                    <ArgTypes of={Header} />
                    <h3>Content</h3>
                    <ArgTypes of={Content} />
                    <h3>Footer</h3>
                    <ArgTypes of={Footer} />
                    <h3>Controls</h3>
                    <ArgTypes of={Controls} />
                </>
            }
            changelog={changelog}
            cssSources={[
                { name: 'Modal/index.module.css', content: modalStyles },
                { name: 'Modal/colors.module.css', content: colors },
                { name: 'Modal/vars.css', content: variables },
                { name: 'styles/theme.css', content: theme },
                { name: 'Modal/Header', content: headerStyles },
                { name: 'Modal/Content', content: contentStyles },
                { name: 'Modal/Footer', content: footerStyles },
                { name: 'Modal/Controls', content: controlsStyles },
            ]}
        />
    );
}
