import {
    Controls,
    Description,
    Primary,
    Source,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import type { ReactNode } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import typographyStyles from '../../Typography/index.module.css?raw';
import typographyPresets from '../../Typography/preset.module.css?raw';
import { TypographyText } from '../../Typography/text';
import typographyVariables from '../../Typography/vars.css?raw';

import { Chips } from '..';

import changelog from '../CHANGELOG.md?raw';
import componentStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import styles from './examples.module.css';

const items = [
    { value: 'all', label: 'All' },
    { value: 'co', label: 'CO' },
    { value: 'btn', label: 'BTN' },
    { value: 'sb', label: 'SB' },
    { value: 'bb', label: 'BB' },
    { value: 'unknown', label: 'Unknown (0)', disabled: true },
];

const example = `import { Chips, type ChipsItem } from '@koslibs/components/Chips';

const items: ChipsItem[] = [
    { value: 'all', label: 'All' },
    { value: 'co', label: 'CO' },
    { value: 'btn', label: 'BTN' },
    { value: 'unknown', label: 'Unknown (0)', disabled: true },
];

const handleChange = (_, { value }) => setSelectedPositions(value);

<section>
    <h3>Positions</h3>
    <Chips items={items} multiselect
        value={selectedPositions} onChange={handleChange} />
</section>

<Chips items={items} defaultValue="btn" />`;

function Example({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className={styles.example}>
            <TypographyText size={14}>{title}</TypographyText>
            {children}
        </div>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <p>
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2862-23187">
                    Документация в Figma
                </a>
                . Группа коротких вариантов. Если нужен заголовок, разместите его снаружи в
                приложении. По умолчанию выбирается один пункт; multiselect включает независимый
                выбор нескольких пунктов.
            </p>
            <Primary />
            <h2>Использование</h2>
            <Source code={example} language="tsx" />
            <Controls />
            <h2>Выбор и значения</h2>
            <p>
                В одиночном режиме value/defaultValue — string или null. Повторный клик сохраняет
                выбранный пункт. В multiselect — массив строк, повторный клик снимает пункт, пустой
                массив допустим. onChange получает нативное событие изменения и {'{ value }'}.
                Управляемый value обновляет родитель; defaultValue задаёт только начальное
                состояние.
            </p>
            <p>
                All — обычный item со своим value. В multiselect он может быть выбран вместе с
                другими пунктами. Специальная логика фильтрации задаётся приложением. Неизвестные
                value и повторы исключаются; недоступные выбранные пункты сохраняются. Массив
                onChange сохраняет порядок выбора, порядок отображения задаётся items.
            </p>
            <h2>Примеры</h2>
            <Unstyled>
                <div className={styles.examples}>
                    <Example title="Single select">
                        <Chips items={items} defaultValue="btn" dataTestId="chips-single" />
                    </Example>
                    <Example title="Multiselect">
                        <Chips
                            items={items}
                            multiselect
                            defaultValue={['co', 'btn']}
                            dataTestId="chips-multiple"
                        />
                    </Example>
                    <Example title="All — обычный пункт">
                        <Chips
                            items={items}
                            multiselect
                            defaultValue={['all', 'co']}
                            dataTestId="chips-all"
                        />
                    </Example>
                    <Example title="Disabled">
                        <Chips
                            items={items}
                            disabled
                            defaultValue="btn"
                            dataTestId="chips-disabled"
                        />
                    </Example>
                    <div className={styles.narrow}>
                        <Example title="Перенос и полные подписи">
                            <Chips
                                items={[
                                    ...items,
                                    {
                                        value: 'long',
                                        label: 'Длинная подпись отображается полностью',
                                    },
                                ]}
                                defaultValue="long"
                                dataTestId="chips-wrap"
                            />
                        </Example>
                    </div>
                </div>
            </Unstyled>
            <h2>Состояния и оформление</h2>
            <p>
                Высота 32px, отступы 6px по вертикали и 12px по горизонтали, Inter Regular 14/20,
                скругление 99px, gap 8px. Default, hover, active и disabled независимы от выбора.
                Фон и цвет текста меняются плавно за 100ms с ease-in-out; при prefers-reduced-motion
                переходы отключены. Длинная подпись сохраняется целиком и может увеличивать высоту
                chip в узком контейнере. Для изменения оформления используйте CSS-переменные
                --chips-*.
            </p>
            <h2>Нативное поведение и формы</h2>
            <p>
                Группа использует fieldset, radio в single и checkbox в multiselect. Работают
                нативная клавиатура и видимый фокус. disabled блокирует всю группу, items[].disabled
                — отдельный пункт. Выбранные значения доступны через value/onChange. form связывает
                группу с внешней формой. Reset восстанавливает defaultValue неуправляемой группы без
                onChange; preventDefault отменяет сброс. Управляемое значение сохраняется.
            </p>
        </>
    );
}

export function ChipsDocs() {
    return (
        <ComponentDocs
            componentName="Chips"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Chips/index.module.css', content: componentStyles },
                { name: 'Chips/vars.css', content: variables },
                { name: 'Typography/index.module.css', content: typographyStyles },
                { name: 'Typography/preset.module.css', content: typographyPresets },
                { name: 'Typography/vars.css', content: typographyVariables },
            ]}
        />
    );
}
