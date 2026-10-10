import { ArgTypes, Controls, Description, Primary } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';

import { Portal } from '..';

import changelog from '../CHANGELOG.md?raw';

const example = `import { useRef } from 'react';
import { Portal } from '@koslibs/components/Portal';

function Example() {
    const container = useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={container} />
            <Portal getPortalContainer={() => container.current} immediateMount={false}>
                <span>Содержимое в отдельном контейнере</span>
            </Portal>
        </>
    );
}`;

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Переключайте контейнеры A и B или скройте содержимое. Оформление карточки
                принадлежит примеру.
            </p>
            <Primary />
            <Controls />
            <h2>Использование</h2>
            <pre>
                <code>{example}</code>
            </pre>
            <p>
                getPortalContainer возвращает существующий DOM-элемент. По умолчанию используется
                body текущего документа. null и undefined означают, что содержимое не нужно
                рендерить. Portal не создаёт и не удаляет сам контейнер; при размонтировании
                удаляются его дочерние элементы.
            </p>
            <h2>Монтирование</h2>
            <p>
                По умолчанию immediateMount=true: содержимое рендерится сразу, если контейнер уже
                существует. Этот режим используют Modal и Popover.
            </p>
            <p>
                Передайте immediateMount=false, если контейнер создаётся в том же рендере и
                передаётся через DOM-ref, как в примере выше. Тогда первый рендер Portal пустой, а
                контейнер определяется после монтирования. В Playground контейнеры сохраняются через
                callback ref в state: появление DOM-элемента запускает повторный рендер, поэтому
                пример работает и при immediateMount=true.
            </p>
            <h2>Ref и смена контейнера</h2>
            <p>
                ref указывает на контейнер, а не на первый дочерний элемент. При отсутствии
                контейнера и после размонтирования ref равен null. Контейнер проверяется при
                обновлении Portal; изменение DOM-ref само по себе не запускает React-рендер.
            </p>
            <p>
                При смене контейнера React создаёт содержимое заново: локальное состояние и
                введённый текст сбрасываются. Обновление children в прежнем контейнере сохраняет
                состояние.
            </p>
            <h2>Контекст и события</h2>
            <p>
                React-контекст и всплытие событий сохраняют связь с исходным React-деревом.
                CSS-наследование определяется фактическим DOM-контейнером.
            </p>
            <h2>Modal и Popover</h2>
            <p>
                Modal и Popover используют общий Portal, сохраняя собственные getPortalContainer.
                Для Popover по умолчанию выбирается body документа anchorElement. Внутри нативной
                модалки передайте её dialog в getPortalContainer поповера, чтобы содержимое осталось
                в верхнем слое окна.
            </p>
        </>
    );
}

export function PortalDocs() {
    return (
        <ComponentDocs
            componentName="Portal"
            documentation={<Documentation />}
            props={<ArgTypes of={Portal} />}
            changelog={changelog}
            cssSources={[]}
        />
    );
}
