import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';
import { useState } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import inputVariables from '../../Input/vars.css?raw';
import { TypographyText } from '../../Typography/text';
import changelog from '../CHANGELOG.md?raw';
import textareaStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Textarea } from '..';

import styles from './examples.module.css';

const views = ['primary', 'secondary'] as const;
const multiline =
    'Первая строка.\nВторая строка.\nТретья строка.\nЧетвёртая строка.\nПятая строка.\nШестая строка.';
const example = `import { useState } from 'react';
import { Textarea } from '@koslibs/components/Textarea';

const [value, setValue] = useState('');

<Textarea
    label="Комментарий"
    placeholder="Введите комментарий"
    hint="Комментарий увидят участники"
    view="secondary"
    value={value}
    onChange={(_, { value }) => setValue(value)}
    clear
    onClear={() => setValue('')}
    minRows={3}
    maxRows={6}
    autosize
    maxLength={200}
    showValueLength
    block
/>`;

function FormExample() {
    const [submitted, setSubmitted] = useState('');
    return (
        <form
            className={styles.example}
            onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget).get('comment')));
            }}
        >
            <Textarea
                name="comment"
                label="Комментарий"
                defaultValue={'Первая строка.\nВторая строка.'}
                maxLength={200}
                showValueLength
                clear
                autosize
                block
                dataTestId="form-textarea"
            />
            <div>
                <Button type="submit">Сохранить</Button>{' '}
                <Button type="reset" view="secondary">
                    Сбросить
                </Button>
            </div>
            {submitted && <TypographyText tag="div">Сохранено: {submitted}</TypographyText>}
        </form>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Реализация соответствует{' '}
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2255-37928">
                    документации Textarea в Figma
                </a>
                . За основу поведения взят{' '}
                <a href="https://github.com/core-ds/core-components/tree/master/packages/textarea">
                    Textarea Core DS
                </a>
                . Цвета, сообщения, label и счётчик повторяют Input; высота зависит от строк.
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
                value — управляемое значение; defaultValue — начальное значение неуправляемого поля.
                onChange получает событие и {'{ value }'}. Очистка вызывает только onClear: в
                управляемом режиме обновите value сами. Неуправляемое поле очищается автоматически.
                Enter добавляет новую строку.
            </p>
            <h2>View и геометрия</h2>
            <p>
                По умолчанию view="primary", labelView="outer", minRows=3, autosize=false,
                resize=false, block=false. Текст Inter 13/17 px, padding 12 px, радиус 8 px, gap 8
                px. Высота поля с тремя строками — 75 px, с внутренним label — 90 px; с шестью —
                126/141 px. Внешний label и hint добавляют свою высоту. Без block ширина 320 px,
                ограничена контейнером. Label, hint и счётчик используют Typography и общие
                переменные Input.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {views.map((view) => (
                        <div className={styles.example} key={view}>
                            <TypographyText weight="medium">{view}</TypographyText>
                            <Textarea
                                view={view}
                                label="Комментарий"
                                placeholder="Введите комментарий"
                                block
                                dataTestId={`view-${view}`}
                            />
                            <Textarea
                                view={view}
                                label="Комментарий"
                                labelView="inner"
                                defaultValue={'Первая строка.\nВторая строка.'}
                                hint="Комментарий увидят участники"
                                maxLength={200}
                                showValueLength
                                clear
                                block
                                dataTestId={`anatomy-${view}`}
                            />
                        </div>
                    ))}
                </div>
            </Unstyled>
            <h2>Высота, autosize и resize</h2>
            <p>
                minRows задаёт начальную высоту. С autosize поле растёт и уменьшается по
                содержимому, включая переносы по ширине. maxRows ограничивает рост, затем появляется
                внутренний вертикальный скролл без стрелок и фона, с тонким закруглённым ползунком.
                Без autosize высота фиксирована, maxRows не используется. resize разрешает
                вертикальное изменение высоты за нижний правый угол; при autosize, disabled и
                readOnly оно отключено. Label, счётчик и hint остаются на своих местах.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Textarea
                        view="secondary"
                        label="3 строки"
                        placeholder="Введите комментарий"
                        block
                        dataTestId="rows-3"
                    />
                    <Textarea
                        view="secondary"
                        label="6 строк"
                        minRows={6}
                        placeholder="Введите комментарий"
                        block
                        dataTestId="rows-6"
                    />
                    <Textarea
                        view="secondary"
                        label="Autosize: 3–6 строк"
                        defaultValue={multiline}
                        minRows={3}
                        maxRows={6}
                        autosize
                        clear
                        block
                        dataTestId="autosize"
                    />
                    <Textarea
                        view="secondary"
                        label="Фиксированная высота со скроллом"
                        defaultValue={multiline}
                        block
                        dataTestId="fixed"
                    />
                    <Textarea
                        view="secondary"
                        label="Вертикальный resize"
                        defaultValue={'Первая строка.\nВторая строка.'}
                        resize
                        block
                        dataTestId="resize"
                    />
                </div>
            </Unstyled>
            <h2>Label и счётчик длины</h2>
            <p>
                В пустом inner поле label находится в первой строке, placeholder скрыт. При фокусе
                label поднимается, placeholder появляется; после ввода label остаётся сверху. При
                blur пустого поля он возвращается назад. Пустое readOnly поле сохраняет label на
                месте. maxLength ограничивает нативный ввод; showValueLength показывает длину в
                UTF-16 только при заданном неотрицательном целом maxLength. Счётчик 11 px выровнен с
                label по базовой линии: снаружи при outer и в верхней строке внутри при inner.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {(['outer', 'inner'] as const).map((labelView) => (
                        <Textarea
                            key={labelView}
                            view="secondary"
                            label="Комментарий"
                            labelView={labelView}
                            placeholder="Введите комментарий"
                            maxLength={200}
                            showValueLength
                            clear
                            block
                            dataTestId={`length-${labelView}`}
                        />
                    ))}
                </div>
            </Unstyled>
            <h2>Состояния и сообщения</h2>
            <p>
                Hover и focus не меняют геометрию. error показывает красную рамку, текст заменяет
                существующий непустой hint. Без hint текст ошибки не выводится; error=true сохраняет
                hint. Многострочное сообщение может увеличить высоту блока. disabled запрещает ввод
                и исключает поле из отправки формы; readOnly сохраняет фокус, копирование и значение
                в форме. Очистка скрыта в обоих состояниях.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {views.map((view) => (
                        <div className={styles.example} key={view}>
                            <TypographyText weight="medium">{view}</TypographyText>
                            <Textarea
                                view={view}
                                label="Ошибка с hint"
                                hint="Комментарий увидят участники"
                                error="Проверьте комментарий"
                                defaultValue="Первая строка."
                                block
                                dataTestId={`error-${view}`}
                            />
                            <Textarea
                                view={view}
                                label="Ошибка без hint"
                                error="Проверьте комментарий"
                                block
                                dataTestId={`error-no-hint-${view}`}
                            />
                            <Textarea
                                view={view}
                                label="Disabled"
                                defaultValue="Первая строка."
                                disabled
                                clear
                                block
                                dataTestId={`disabled-${view}`}
                            />
                            <Textarea
                                view={view}
                                label="Read-only"
                                defaultValue="Первая строка."
                                readOnly
                                clear
                                block
                                dataTestId={`readonly-${view}`}
                            />
                        </div>
                    ))}
                </div>
            </Unstyled>
            <h2>Форма и настройка</h2>
            <p>
                ref указывает на HTMLTextAreaElement. Нативные name, required, form, autoComplete,
                onFocus/onBlur/onKeyDown и другие атрибуты передаются в textarea. Сброс формы
                восстанавливает defaultValue, счётчик, очистку и высоту autosize. Клик по label или
                отступам поля переводит фокус в textarea. Очистка не отправляет форму.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <FormExample />
                </div>
            </Unstyled>
            <p>
                className и style относятся к обёртке. Для частей есть fieldClassName,
                textareaClassName, labelClassName и messageClassName. dataTestId относится к
                textarea; части получают -form-control, -field, -label, -hint/-error, -counter и
                -clear. CSS-переменные приведены во вкладке «Разработчику».
            </p>
        </>
    );
}

export function TextareaDocs() {
    return (
        <ComponentDocs
            componentName="Textarea"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Textarea/index.module.css', content: textareaStyles },
                { name: 'Textarea/vars.css', content: variables },
                { name: 'Input/vars.css', content: inputVariables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
