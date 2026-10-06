import {
    ArgTypes,
    Controls,
    Description,
    Primary,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import { useState } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import { Button } from '../../Button';
import { TypographyText } from '../../Typography';
import changelog from '../CHANGELOG.md?raw';
import popoverStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Popover, type PopoverProps } from '..';

import { ExampleSurface, type ExampleAppearance } from './example-surface';

import styles from './examples.module.css';

const example = `import { useState } from 'react';
import { Popover } from '@koslibs/components/Popover';
import { Button } from '@koslibs/components/Button';
import styles from './content.module.css';

const [open, setOpen] = useState(false);
const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
const handleToggle = () => setOpen((value) => !value);
const handleClose = () => setOpen(false);

<Button ref={setAnchorElement} onClick={handleToggle}>Профили</Button>
<Popover
    open={open}
    anchorElement={anchorElement}
    position="top-start"
    onClose={handleClose}
>
    <div className={styles.content}>{children}</div>
</Popover>

/* content.module.css — оформление принадлежит приложению */
.content {
    box-sizing: border-box;
    min-height: 0;
    max-height: var(--popover-available-height, none);
    padding: 12px;
    border-radius: 8px;
    background: #212512;
    color: #f5f3ec;
    overflow: auto;
}`;

function PopoverExample({
    label,
    long = false,
    clipped = false,
    appearance,
    ...args
}: Partial<PopoverProps> & {
    label: string;
    long?: boolean;
    clipped?: boolean;
    appearance?: ExampleAppearance;
}) {
    const [open, setOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    const handleToggle = () => setOpen((value) => !value);
    const handleClose = () => setOpen(false);

    return (
        <div className={clipped ? styles.clip : undefined}>
            <Button ref={setAnchorElement} view="secondary" onClick={handleToggle}>
                {label}
            </Button>
            <Popover
                {...args}
                open={open}
                anchorElement={anchorElement}
                onClose={handleClose}
                className={args.useAnchorWidth ? undefined : styles.width}
                dataTestId={long ? 'popover-long-example' : undefined}
            >
                <ExampleSurface
                    appearance={appearance}
                    dataTestId={long ? 'popover-long-example-content' : undefined}
                >
                    {long ? (
                        <div className={styles.menu}>
                            <TypographyText className={styles.heading} size={15} weight="bold">
                                Профили
                            </TypographyText>
                            <div className={styles.list} data-test-id="popover-example-list">
                                {Array.from({ length: 20 }, (_, index) => (
                                    <TypographyText key={index} className={styles.item} size={13}>
                                        Профиль {index + 1}
                                    </TypographyText>
                                ))}
                            </div>
                            <Button
                                className={styles.footer}
                                size={32}
                                view="secondary"
                                onClick={handleClose}
                            >
                                Закрыть список
                            </Button>
                        </div>
                    ) : (
                        <TypographyText size={13} color="inherit">
                            Произвольное содержимое поповера.
                        </TypographyText>
                    )}
                </ExampleSurface>
            </Popover>
        </div>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Откройте поповер кнопкой. Настройте позицию, оформление и способы закрытия в
                Controls.
            </p>
            <Primary />
            <h2>Использование</h2>
            <pre>
                <code>{example}</code>
            </pre>
            <p>
                Передайте DOM-элемент через callback ref и state: появление элемента вызовет рендер
                с актуальным anchorElement. При open=false или anchorElement=null поповер не
                рендерится. onClose запрашивает закрытие без аргументов; вызывающий компонент
                обновляет open.
            </p>
            <p>
                Popover отвечает за портал, позицию и размеры. Передайте собственную карточку через
                children: фон, цвет текста, рамки, отступы, скругление и шрифт задаются стилями
                содержимого. В этих примерах оформление сохранено в отдельном компоненте
                документации ExampleSurface и не входит в Popover.
            </p>
            <p>
                Тень задаёт сам Popover через --popover-shadow. По умолчанию используется 0 8px 24px
                rgba(0, 0, 0, 0.16); переменную можно переопределить в CSS приложения.
            </p>
            <Controls />
            <h2>Позиция и оформление</h2>
            <p>
                Доступны четыре стороны и выравнивания start/end. offset — смещение вдоль элемента и
                расстояние от него. По умолчанию offset равен [0, 0], без смещения и зазора. При
                нехватке места поповер меняет сторону; preventFlip отключает перенос,
                fallbackPlacements задаёт альтернативы.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PopoverExample label="Сверху" position="top-start" />
                    <PopoverExample label="Снизу" position="bottom-start" />
                    <PopoverExample label="Справа" position="right-start" />
                    <PopoverExample label="Слева" position="left-start" />
                    <PopoverExample
                        label="Тёмное оформление"
                        appearance="inverted"
                        position="top-start"
                    />
                </div>
            </Unstyled>
            <h2>Ширина</h2>
            <p>
                Ширина по умолчанию зависит от содержимого. Её можно задать через className или
                style. useAnchorWidth использует ширину элемента и обновляет её при изменении его
                размеров. CSS-переменные Popover задают z-index, отступ от границ экрана и доступную
                высоту и тень; остальное оформление задаётся содержимым.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PopoverExample label="По ширине этой кнопки" useAnchorWidth />
                </div>
            </Unstyled>
            <h2>Длинный контент</h2>
            <p>
                availableHeight ограничивает высоту доступным местом. Для прокрутки всей карточки
                задайте ей min-height: 0 и overflow: auto, как в Playground. Для неподвижных
                заголовка и действий передайте flex-контейнер с min-height: 0 и отдельный список с
                overflow: auto, как в примере ниже. Доступная высота передаётся содержимому через
                --popover-available-height.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PopoverExample
                        label="Длинный список"
                        position="top-start"
                        appearance="inverted"
                        long
                    />
                </div>
            </Unstyled>
            <h2>Портал и закрытие</h2>
            <p>
                Поповер рендерится через портал в body документа anchorElement и не обрезается
                overflow родительского контейнера. Нажатия внутри и на anchorElement не вызывают
                onClose. outsideClick и escapeKeyDown включены по умолчанию. Сам компонент не меняет
                open и не блокирует прокрутку страницы.
            </p>
            <p>
                getPortalContainer позволяет выбрать другой контейнер. Внутри нативной модалки
                передайте её dialog: содержимое портала в body находится ниже верхнего слоя dialog.
                Popover не назначает содержимому роль меню и не управляет выбором профиля.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PopoverExample label="Внутри overflow: hidden" clipped />
                </div>
            </Unstyled>
        </>
    );
}

export function PopoverDocs() {
    return (
        <ComponentDocs
            componentName="Popover"
            documentation={<Documentation />}
            props={<ArgTypes of={Popover} />}
            changelog={changelog}
            cssSources={[
                { name: 'Popover/index.module.css', content: popoverStyles },
                { name: 'Popover/vars.css', content: variables },
            ]}
        />
    );
}
