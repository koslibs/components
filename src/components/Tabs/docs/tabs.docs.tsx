import {
    ArgTypes,
    Controls,
    Description,
    Primary,
    Source,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import { useState, type ReactNode } from 'react';

import styles from './examples.module.css';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import changelog from '../CHANGELOG.md?raw';
import tabsStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Tab, Tabs, type TabsProps } from '..';

const profileTabs = [
    <Tab key="active" id="active" title="Active" count={5} />,
    <Tab key="archived" id="archived" title="Archived" count={2} />,
    <Tab key="empty" id="empty" title="Без сессий" count={0} />,
    <Tab key="unavailable" id="unavailable" title="Недоступно" count={3} disabled />,
];

const example = `import { Tabs, Tab, type TabsProps } from '@koslibs/components/Tabs';

const [selectedId, setSelectedId] = useState('active');
const handleChange: TabsProps['onChange'] = (_event, { selectedId }) => {
    setSelectedId(selectedId);
};

<>
    <Tabs selectedId={selectedId} onChange={handleChange}>
        <Tab id="active" title="Active" count={5} />
        <Tab id="archived" title="Archived" count={2} />
        <Tab id="disabled" title="Disabled" disabled />
    </Tabs>
    {selectedId === 'active' && <ActiveProfiles />}
    {selectedId === 'archived' && <ArchivedProfiles />}
</>

// Внутреннее управление рядом заголовков:
<Tabs defaultSelectedId="active">
    <Tab id="active" title="Active" count={5} />
    <Tab id="archived" title="Archived" count={2} />
</Tabs>`;

function Example({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section style={{ marginTop: 'var(--size-32)' }}>
            <h2>{title}</h2>
            <p>{description}</p>
            <Unstyled>
                <div className={styles.preview}>{children}</div>
            </Unstyled>
        </section>
    );
}

function ControlledExample() {
    const [selectedId, setSelectedId] = useState('active');
    const [requested, setRequested] = useState('active');
    return (
        <>
            <Tabs
                selectedId={selectedId}
                onChange={(_event, payload) => setRequested(payload.selectedId)}
                dataTestId="controlled-tabs"
            >
                {profileTabs}
            </Tabs>
            <p>Запрошенная вкладка: {requested}</p>
            <p>Отображаемое содержимое: {selectedId}</p>
            <div>
                <Button view="secondary" onClick={() => setSelectedId(requested)}>
                    Применить запрос
                </Button>
            </div>
        </>
    );
}

function DynamicExample() {
    const [removed, setRemoved] = useState(false);
    const [disabled, setDisabled] = useState(false);
    return (
        <>
            <div className={styles.actions}>
                <Button view="secondary" onClick={() => setRemoved((current) => !current)}>
                    {removed ? 'Вернуть Archived' : 'Удалить Archived'}
                </Button>
                <Button view="secondary" onClick={() => setDisabled((current) => !current)}>
                    {disabled ? 'Включить Active' : 'Отключить Active'}
                </Button>
            </div>
            <Tabs defaultSelectedId="archived" dataTestId="dynamic-tabs">
                <Tab id="active" title="Active" count={5} disabled={disabled} />
                {!removed && <Tab id="archived" title="Archived" count={2} />}
                <Tab id="empty" title="Без сессий" count={0} />
                <Tab id="unavailable" title="Недоступно" count={3} disabled />
            </Tabs>
        </>
    );
}

export function AllDisabledExample({ size = 40 }: Pick<TabsProps, 'size'>) {
    const [disabled, setDisabled] = useState(true);
    return (
        <>
            <Tabs size={size} dataTestId="all-disabled-tabs">
                <Tab id="active" title="Active" count={5} disabled />
                <Tab id="archived" title="Archived" count={2} disabled={disabled} />
                <Tab id="empty" title="Без сессий" count={0} disabled />
            </Tabs>
            <Button
                view="secondary"
                onClick={() => setDisabled((current) => !current)}
                dataTestId="toggle-disabled-tabs"
            >
                {disabled ? 'Включить Archived' : 'Отключить Archived'}
            </Button>
        </>
    );
}

function ContentExample() {
    const [selectedId, setSelectedId] = useState('active');
    const handleChange: TabsProps['onChange'] = (_event, payload) =>
        setSelectedId(payload.selectedId);
    return (
        <>
            <Tabs selectedId={selectedId} onChange={handleChange} dataTestId="headers-tabs">
                <Tab id="active" title="Active" count={5} />
                <Tab id="archived" title="Archived" count={2} />
                <Tab id="disabled" title="Disabled" disabled />
            </Tabs>
            <div data-test-id="external-content">
                {selectedId === 'active' && <p>Пять активных профилей.</p>}
                {selectedId === 'archived' && <p>Два архивных профиля.</p>}
            </div>
        </>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Выбор в Controls синхронизируется с примером. При hover текст темнеет, снизу
                появляется серый индикатор. При переключении оранжевая линия плавно перемещается к
                новой вкладке и подстраивается под её ширину за 200 мс.
            </p>
            <Primary />
            <h2>Использование</h2>
            <Source code={example} language="tsx" />
            <p>
                Все вкладки должны помещаться в доступную ширину. Tabs не поддерживает
                горизонтальную прокрутку и перенос ряда; количество и длину заголовков выбирайте с
                учётом места в интерфейсе.
            </p>
            <p>
                Если children не содержат Tab, компонент ничего не рендерит. Пустое состояние данных
                отображайте в содержимом выбранной вкладки, под управлением приложения.
            </p>
            <h2>Параметры Tabs</h2>
            <Controls />
            <h3>Tab</h3>
            <p>
                Tab описывает заголовок вкладки. Объявляйте его непосредственно внутри Tabs.
                Поддерживаются массивы, условные элементы и Fragment. Каждый Tab требует уникальный
                стабильный id; title может быть текстом или ReactNode. Для массива задавайте также
                key.
            </p>
            <ArgTypes of={Tab} />
            <Example
                title="Размеры и счётчики"
                description="Высота ряда — 40 или 48 px. Счётчик необязательный: 0 виден и не блокирует вкладку. Неизвестные, отрицательные и дробные значения скрываются. Disabled не выбирается; отдельного pressed-состояния нет."
            >
                <Tabs dataTestId="size40-tabs">{profileTabs}</Tabs>
                <Tabs size={48} dataTestId="size48-tabs">
                    {profileTabs}
                </Tabs>
            </Example>
            <Example
                title="Содержимое вне Tabs"
                description="Tabs управляет заголовками и выбором вкладки. Содержимое отображайте отдельными компонентами по selectedId. Их монтаж, сохранение состояния, загрузку и ошибки контролирует приложение."
            >
                <ContentExample />
            </Example>
            <Example
                title="Внешнее управление"
                description="При заданном selectedId onChange получает событие и { selectedId }, а выбор меняется после обновления selectedId родителем. Здесь запрос применяется отдельной кнопкой. Повторный выбор активной вкладки не вызывает callback."
            >
                <ControlledExample />
            </Example>
            <Example
                title="Изменение набора вкладок"
                description="Если активная вкладка удалена или отключена, выбирается ближайшая следующая доступная, затем предыдущая. Изменение children не вызывает onChange; в controlled-режиме поддерживайте selectedId в актуальном состоянии, чтобы внешний контент соответствовал заголовку. Возвращение удалённой вкладки не сбрасывает внутренний выбор."
            >
                <DynamicExample />
            </Example>
            <Example
                title="Все вкладки отключены"
                description="Если все Tab имеют disabled, заголовки и счётчики остаются видимыми. Активной вкладки и оранжевого индикатора нет. После включения вкладки она выбирается по обычным правилам; автоматический выбор не вызывает onChange."
            >
                <AllDisabledExample />
            </Example>
        </>
    );
}

export function TabsDocs() {
    return (
        <ComponentDocs
            componentName="Tabs"
            importNames={['Tabs', 'Tab']}
            documentation={<Documentation />}
            props={
                <>
                    <p>
                        Tab отображает кнопку вкладки, заголовок, счётчик и состояния. Tabs передаёт
                        общий выбор через внутренний контекст и управляет индикатором. Tab
                        используется внутри Tabs.
                    </p>
                    <h3>Tabs</h3>
                    <ArgTypes of={Tabs} />
                    <h3>Tab</h3>
                    <ArgTypes of={Tab} />
                </>
            }
            changelog={changelog}
            cssSources={[
                { name: 'Tabs/index.module.css', content: tabsStyles },
                { name: 'Tabs/vars.css', content: variables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
