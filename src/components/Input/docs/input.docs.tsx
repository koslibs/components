import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';
import { SearchIcon } from '@koslibs/icons/SearchIcon';
import { useState } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import changelog from '../CHANGELOG.md?raw';
import inputStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Input } from '..';

import styles from './examples.module.css';

const sizes = [40, 48, 56, 64, 72] as const;
const views = ['primary', 'secondary'] as const;
const example = `import { useState } from 'react';
import { Input } from '@koslibs/components/Input';

const [value, setValue] = useState('');

<Input
    label="Название профиля"
    placeholder="Введите имя"
    hint="Имя будет видно в списке профилей"
    view="secondary"
    value={value}
    onChange={(_, { value }) => setValue(value)}
    clear
    onClear={() => setValue('')}
    block
/>`;

function FormExample() {
    const [submitted, setSubmitted] = useState('');
    return (
        <form
            className={styles.example}
            onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setSubmitted(String(data.get('name')));
            }}
        >
            <Input label="Имя" name="name" defaultValue="Александр" required clear block />
            <div>
                <Button type="submit">Сохранить</Button>{' '}
                <Button type="reset" view="secondary">
                    Сбросить
                </Button>
            </div>
            {submitted && <output>Сохранено: {submitted}</output>}
        </form>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Цвета и геометрия соответствуют{' '}
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2219-33983">
                    документации Input в Figma
                </a>
                . За основу поведения взят{' '}
                <a href="https://github.com/core-ds/core-components/tree/master/packages/input">
                    Input Core DS
                </a>
                . Размер по умолчанию — 40, view — primary, label — outer.
            </p>
            <Primary />
            <div className={styles.scroll}>
                <Controls />
            </div>
            <h2>Использование</h2>
            <pre className={styles.scroll}>
                <code>{example}</code>
            </pre>
            <p>
                value задаёт управляемый режим; defaultValue — начальное значение неуправляемого
                поля. onChange получает событие и {'{ value }'}. Очистка вызывает только onClear: в
                управляемом режиме обновите value сами. Неуправляемое поле очищается автоматически.
            </p>
            <h2>Размеры и view</h2>
            <p>
                Высота относится только к полю. Текст 13 px для 40/48, 14 px для 56/64, 16 px для
                72. Отступы по горизонтали — 12/12/16/16/20 px. Скругление 8 px, gap 8 px. block
                растягивает компонент; без него ширина по умолчанию 320 px, ограничена контейнером.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {sizes.map((size) => (
                        <div className={styles.example} key={size}>
                            <span className={styles.caption}>{size} px</span>
                            <Input
                                block
                                size={size}
                                label="Название профиля"
                                defaultValue="Александр"
                                dataTestId={`size-${size}-primary`}
                            />
                            <Input
                                block
                                size={size}
                                view="secondary"
                                label="Название профиля"
                                labelView="inner"
                                defaultValue="Александр"
                                dataTestId={`size-${size}-secondary`}
                            />
                        </div>
                    ))}
                </div>
            </Unstyled>
            <h2>Длина значения</h2>
            <p>
                maxLength ограничивает длину нативного ввода. showValueLength включает счётчик,
                только если задан maxLength: например, 13/64. При labelView="outer" он расположен
                справа от внешнего label, при inner — справа в верхней строке внутри поля. Счётчик
                обновляется при вводе, очистке, сбросе формы и изменении value извне.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Input
                        block
                        label="Название профиля"
                        defaultValue="Мой профиль 1"
                        maxLength={64}
                        showValueLength
                        clear
                        dataTestId="length-outer"
                    />
                    <Input
                        block
                        view="secondary"
                        label="Название профиля"
                        labelView="inner"
                        defaultValue="Мой профиль 1"
                        maxLength={64}
                        showValueLength
                        clear
                        dataTestId="length-inner"
                    />
                </div>
            </Unstyled>
            <h2>Состояния</h2>
            <p>
                Наведите курсор и переведите фокус в поле: рамка не меняет его размер. error
                показывает красную рамку; сообщение заменяет существующий hint. Без hint текст
                ошибки не выводится. true включает состояние ошибки и сохраняет hint. Компонент не
                проверяет значение сам. disabled исключает поле из Tab и отправки формы; readOnly
                сохраняет фокус, копирование и отправку значения. Очистка скрыта в обоих случаях.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {views.map((view) => (
                        <div className={styles.example} key={view}>
                            <span className={styles.caption}>{view}</span>
                            <Input
                                block
                                view={view}
                                label="Обычное поле"
                                placeholder="Введите имя"
                                dataTestId={`state-${view}`}
                            />
                            <Input
                                block
                                view={view}
                                label="Ошибка"
                                placeholder="Введите имя"
                                hint="Введите название профиля"
                                error="Проверьте значение"
                                dataTestId={`error-${view}`}
                            />
                            <Input
                                block
                                view={view}
                                label="Ошибка без hint"
                                placeholder="Введите имя"
                                error="Проверьте значение"
                                dataTestId={`error-no-hint-${view}`}
                            />
                            <Input
                                block
                                view={view}
                                label="Disabled"
                                defaultValue="Александр"
                                disabled
                                clear
                                dataTestId={`disabled-${view}`}
                            />
                            <Input
                                block
                                view={view}
                                label="Read-only"
                                defaultValue="Александр"
                                readOnly
                                clear
                                dataTestId={`readonly-${view}`}
                            />
                        </div>
                    ))}
                </div>
            </Unstyled>
            <h2>Label, сообщения и аддоны</h2>
            <p>
                В пустом поле внутренний label расположен по центру, placeholder скрыт. При фокусе
                label поднимается и появляется placeholder. После ввода label остаётся наверху; при
                blur пустого поля возвращается в центр. В пустом readOnly поле label не поднимается.
                Placeholder не заменяет название. Передайте иконку или другой контент в
                leftAddon/rightAddon; интерактивный аддон сохраняет собственный фокус и обработчики.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Input
                        block
                        label="Название профиля"
                        defaultValue="Александр"
                        leftAddon={<SearchIcon width={16} height={16} className={styles.icon} />}
                        hint="Имя будет видно в списке профилей"
                        clear
                        dataTestId="anatomy"
                    />
                    <Input
                        block
                        view="secondary"
                        label="Название профиля"
                        labelView="inner"
                        placeholder="Введите имя"
                        dataTestId="inner-empty"
                    />
                    <Input
                        block
                        type="search"
                        placeholder="Поиск профилей"
                        leftAddon={<SearchIcon width={16} height={16} className={styles.icon} />}
                        clear
                    />
                    <Input
                        block
                        view="secondary"
                        label="Баланс"
                        defaultValue="12 500"
                        rightAddon={<span>RUB</span>}
                        inputMode="decimal"
                    />
                    <Input
                        className={styles.narrow}
                        label="Длинное название профиля"
                        defaultValue="Очень длинное название профиля, которое не помещается в поле"
                        hint="Label и hint могут переноситься, значение остаётся в одной строке"
                        clear
                        dataTestId="long-value"
                    />
                </div>
            </Unstyled>
            <h2>Форма</h2>
            <p>
                ref указывает на HTMLInputElement. name, type, required, autoComplete, inputMode и
                остальные нативные атрибуты передаются в input. Enter использует поведение формы.
                Label связан через htmlFor: клик по названию переводит фокус в input. Кнопка очистки
                не отправляет форму и возвращает фокус. Для touch-форм используйте размер от 48 и
                outer label.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <FormExample />
                </div>
            </Unstyled>
            <p>
                dataTestId относится к input; обёртка получает -form-control, поле -field, label
                -label, сообщение -hint/-error, аддоны -left-addon/-right-addon, очистка -clear,
                счётчик -counter. className и style относятся к обёртке; для частей есть
                fieldClassName, inputClassName, labelClassName и messageClassName. Цвета доступны
                через CSS-переменные во вкладке «Разработчику».
            </p>
        </>
    );
}

export function InputDocs() {
    return (
        <ComponentDocs
            componentName="Input"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Input/index.module.css', content: inputStyles },
                { name: 'Input/vars.css', content: variables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
