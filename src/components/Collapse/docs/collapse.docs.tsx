import {
    Controls,
    Description,
    Primary,
    Source,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import { useId, useRef, useState, type ReactNode } from 'react';

import styles from './examples.module.css';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import changelog from '../CHANGELOG.md?raw';
import collapseStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Collapse } from '..';

const example = `import { Collapse } from '@koslibs/components/Collapse';

<Collapse
    collapsedLabel="Показать файлы (3)"
    expandedLabel="Скрыть файлы"
    onExpandedChange={(expanded) => console.log(expanded)}
>
    <FilesList files={files} />
</Collapse>`;

function Example({
    name,
    title,
    description,
    children,
}: {
    name: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section id={name} style={{ marginTop: 32 }}>
            <h2>{title}</h2>
            <p style={{ margin: '12px 0 20px' }}>{description}</p>
            <Unstyled>
                <div className={styles.preview}>{children}</div>
            </Unstyled>
        </section>
    );
}

function ControlledExample() {
    const [expanded, setExpanded] = useState(false);
    const [requested, setRequested] = useState(false);
    return (
        <>
            <Button view="secondary" onClick={() => setExpanded(requested)}>
                Применить запрос
            </Button>
            <p>Запрошено: {requested ? 'раскрыть' : 'свернуть'}</p>
            <Collapse
                expanded={expanded}
                collapsedLabel="Показать подробности"
                expandedLabel="Скрыть подробности"
                onExpandedChange={setRequested}
                dataTestId="controlled-collapse"
            >
                <p>Состояние обновляет родитель после подтверждения запроса.</p>
            </Collapse>
        </>
    );
}

function DynamicExample() {
    const [rows, setRows] = useState(1);
    const [transitions, setTransitions] = useState(0);
    return (
        <>
            <Collapse
                defaultExpanded
                collapsedLabel="Показать файлы"
                expandedLabel="Скрыть файлы"
                dataTestId="dynamic-collapse"
                onTransitionEnd={() => setTransitions((count) => count + 1)}
            >
                <div style={{ display: 'grid', gap: 12, padding: '12px 0' }}>
                    {Array.from({ length: rows }, (_, index) => (
                        <p key={index}>Файл {index + 1}.txt</p>
                    ))}
                    <Button view="secondary" onClick={() => setRows((count) => count + 1)}>
                        Добавить файл
                    </Button>
                </div>
            </Collapse>
            <p>Завершено переходов: {transitions}</p>
        </>
    );
}

function ExternalExample() {
    const [expanded, setExpanded] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const contentId = useId();
    return (
        <>
            <Button
                ref={trigger}
                view="secondary"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => setExpanded((value) => !value)}
            >
                {expanded ? 'Скрыть блок' : 'Раскрыть блок'}
            </Button>
            <div id={contentId}>
                <Collapse expanded={expanded}>
                    <p>Блок с внешним управлением.</p>
                    <Button
                        view="secondary"
                        onClick={() => {
                            trigger.current?.focus();
                            setExpanded(false);
                        }}
                    >
                        Закрыть из содержимого
                    </Button>
                </Collapse>
            </div>
        </>
    );
}

function DialogExample() {
    const dialog = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    return (
        <>
            <Button view="secondary" onClick={() => dialog.current?.showModal()}>
                Подробности импорта
            </Button>
            <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId}>
                <h2 id={titleId}>Импорт завершён</h2>
                <p>3 файла обработано. В одном файле есть предупреждение.</p>
                <Collapse collapsedLabel="Показать файлы (3)" expandedLabel="Скрыть файлы">
                    <div style={{ display: 'grid', gap: 12, padding: '12px 0' }}>
                        <p>session-01.txt — Imported</p>
                        <p>session-02.txt — Imported</p>
                        <p>session-03.txt — Completed with warnings</p>
                    </div>
                </Collapse>
                <Button view="secondary" onClick={() => dialog.current?.close()}>
                    Закрыть окно
                </Button>
            </dialog>
        </>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Кнопка переключает состояние. expanded в Controls синхронизирует пример с заданным
                значением.
            </p>
            <Primary />
            <h2>Использование</h2>
            <Source code={example} language="tsx" />
            <h2>Параметры</h2>
            <Controls />
            <Example
                name="uncontrolled"
                title="Внутреннее состояние"
                description="Без expanded компонент сам переключается. defaultExpanded задаёт только начальное состояние. Содержимое остаётся в DOM при закрытии: ввод пользователя сохраняется."
            >
                <Collapse
                    collapsedLabel="Показать подробности"
                    expandedLabel="Скрыть подробности"
                    dataTestId="uncontrolled-collapse"
                >
                    <div style={{ padding: '12px 0' }}>
                        <label>
                            Заметка{' '}
                            <input aria-label="Заметка" defaultValue="Проверить предупреждения" />
                        </label>
                    </div>
                </Collapse>
                <Button view="secondary">Следующее действие</Button>
            </Example>
            <Example
                name="controlled"
                title="Внешнее состояние"
                description="При заданном expanded нажатие только вызывает onExpandedChange. Здесь родитель применяет запрошенное состояние отдельной кнопкой. В обычном использовании передайте setExpanded напрямую."
            >
                <ControlledExample />
            </Example>
            <Example
                name="dynamic"
                title="Изменяемый контент"
                description="Раскрытый блок занимает естественную высоту. Новые строки, изображения и изменение ширины контейнера не обрезаются; измерение высоты через JavaScript не требуется."
            >
                <DynamicExample />
            </Example>
            <Example
                name="chevrons"
                title="Шевроны"
                description="По умолчанию виден только правый шеврон: вниз при закрытии и вверх при раскрытии. Левый смотрит вправо при закрытии и вниз при раскрытии. Оба шеврона можно скрыть независимо."
            >
                <Collapse collapsedLabel="Правый шеврон" dataTestId="right-chevron-collapse">
                    <p>Правый шеврон включён по умолчанию.</p>
                </Collapse>
                <Collapse
                    collapsedLabel="Левый шеврон"
                    showLeftChevron
                    showRightChevron={false}
                    dataTestId="left-chevron-collapse"
                >
                    <p>Левый шеврон поворачивается вправо → вниз.</p>
                </Collapse>
                <Collapse
                    collapsedLabel="Оба шеврона"
                    showLeftChevron
                    dataTestId="both-chevrons-collapse"
                >
                    <p>Оба шеврона показывают состояние блока.</p>
                </Collapse>
                <Collapse
                    collapsedLabel="Без шевронов"
                    showLeftChevron={false}
                    showRightChevron={false}
                    dataTestId="no-chevrons-collapse"
                >
                    <p>Кнопка переключает состояние без шевронов.</p>
                </Collapse>
            </Example>
            <Example
                name="external"
                title="Без встроенной кнопки"
                description="Не передавайте подписи, чтобы управлять блоком извне: у collapsedLabel и expandedLabel нет значений по умолчанию. Свяжите внешнюю кнопку с состоянием через aria-expanded и aria-controls; при закрытии верните на неё фокус."
            >
                <ExternalExample />
            </Example>
            <Example
                name="dark"
                title="На тёмном фоне"
                description="Переопределите --collapse-color и --collapse-hover-color на контейнере. Фон и цвет содержимого задаёт родитель. Проп colors не требуется."
            >
                <div className={styles.dark}>
                    <Collapse
                        defaultExpanded
                        collapsedLabel="Показать подробности"
                        expandedLabel="Скрыть подробности"
                    >
                        <p>Дополнительная информация.</p>
                    </Collapse>
                </div>
            </Example>
            <Example
                name="dialog"
                title="В модальном окне"
                description="Пример с нативным dialog: результат остаётся видимым, список файлов раскрывается по запросу пользователя."
            >
                <DialogExample />
            </Example>
            <h2>Клавиатура и анимация</h2>
            <p>
                Enter и Space активируют кнопку. aria-expanded и aria-controls связывают её с
                содержимым. Закрытый блок исключён из навигации и дерева доступности через inert и
                aria-hidden.
            </p>
            <p>
                При закрытии блока с фокусом внутри фокус возвращается на встроенную кнопку.
                Раскрытие занимает 200 мс. При prefers-reduced-motion анимация отключена.
                onTransitionEnd сообщает о завершении смены состояния, включая режим без анимации.
            </p>
            <p>
                className и ref относятся к корню, expandedContentClassName — к внутреннему
                содержимому. CSS-переменные --collapse-color, --collapse-hover-color и
                --collapse-focus-color позволяют настроить цвета.
            </p>
        </>
    );
}

export function CollapseDocs() {
    return (
        <ComponentDocs
            componentName="Collapse"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Collapse/index.module.css', content: collapseStyles },
                { name: 'Collapse/vars.css', content: variables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
