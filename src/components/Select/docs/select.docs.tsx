import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';
import inputStyles from '../../Input/index.module.css?raw';
import inputVariables from '../../Input/vars.css?raw';
import popoverStyles from '../../Popover/index.module.css?raw';
import popoverVariables from '../../Popover/vars.css?raw';
import { TypographyText } from '../../Typography/text';

import { Select, type SelectOption } from '..';

import changelog from '../CHANGELOG.md?raw';
import componentStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import styles from './examples.module.css';

const options: SelectOption[] = [
    { id: 'cash', label: 'Кэш' },
    { id: 'tournaments', label: 'Турниры' },
    { id: 'spin', label: 'Турниры Spin & Go' },
    { id: 'other', label: 'Другое', disabled: true },
];
const sizes = [40, 48, 56, 64, 72] as const;
const example = `import { Select, type SelectOption } from '@koslibs/components/Select';

const options: SelectOption[] = [
    { id: 'cash', label: 'Кэш' },
    { id: 'tournaments', label: 'Турниры' },
];
const [value, setValue] = useState<string[]>(['cash']);

<Select
    options={options}
    multiple
    searchable
    label="Формат игры"
    value={value}
    onChange={(_, { value }) => setValue(value)}
    clear
    onClear={() => setValue([])}
/>`;

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Компонент соответствует{' '}
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2324-47285">
                    документации Select в Figma
                </a>
                . По умолчанию primary, size=40, внешний label, одиночный выбор; поиск и очистка
                выключены.
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
                options содержит уникальные string id, label и необязательный disabled. value — id
                или null; при multiple — массив id. onChange получает событие и{' '}
                {'{ value, selectedOptions }'}. defaultValue включает неуправляемый выбор. Очистка,
                как у Input, вызывает только onClear; управляемый value обновляет приложение.
            </p>
            <h2>Размеры и view</h2>
            <p>
                Высоты 40/48/56/64/72, текст 13/13/14/14/16 px, горизонтальные отступы
                12/12/16/16/20 px. Label снаружи — 13 px Medium, поднятый внутренний — 11 px Medium.
                Высоту строки задаёт Typography. Поле сохраняет высоту при длинном или множественном
                выборе. Внутренний label плавно поднимается и уменьшается за 180 мс, как у Input.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    {sizes.map((size) => (
                        <div key={size} className={styles.example}>
                            <TypographyText weight="medium">{size} px</TypographyText>
                            <Select
                                options={options}
                                size={size}
                                label="Формат игры"
                                defaultValue="cash"
                                block
                                dataTestId={`size-${size}-primary`}
                            />
                            <Select
                                options={options}
                                size={size}
                                label="Формат игры"
                                labelView="inner"
                                view="secondary"
                                multiple
                                defaultValue={['cash', 'tournaments']}
                                block
                                dataTestId={`size-${size}-secondary`}
                            />
                        </div>
                    ))}
                </div>
            </Unstyled>
            <h2>Выбор и поиск</h2>
            <p>
                Одиночный выбор заменяет id и закрывает список. Повторный выбор той же строки ничего
                не меняет. Multiple добавляет и удаляет id без закрытия, сохраняет порядок выбора и
                отображает подписи через запятую с пробелом. Порядок строк списка не меняется.
                Значения и длинные подписи строк сокращаются многоточием.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Select
                        options={options}
                        label="Одиночный выбор"
                        searchable
                        defaultValue="cash"
                        clear
                        block
                        dataTestId="docs-single"
                    />
                    <Select
                        options={options}
                        label="Множественный выбор"
                        multiple
                        searchable
                        defaultValue={['cash', 'tournaments']}
                        clear
                        block
                        dataTestId="docs-multiple"
                    />
                    <Select
                        options={[
                            {
                                id: 'long',
                                label: 'Турниры с глубокими стеками и дополнительными условиями',
                            },
                        ]}
                        defaultValue="long"
                        label="Длинная подпись"
                        className={styles.narrow}
                        clear
                        dataTestId="docs-long"
                    />
                </div>
            </Unstyled>
            <p>
                Поиск находится внутри dropdown, фильтрует label без учёта регистра и сбрасывается
                при закрытии. Выбранные строки вне результатов сохраняются. Между строками — 4 px;
                их высота — 40 px. Прокручивается только область вариантов до 240 px, поиск остаётся
                сверху. Popover совпадает с шириной поля, отстоит на 8 px и переворачивается вверх
                при нехватке места. Поиск и hover строки используют фон #F5F3EC, выбранная строка —
                #E0DBCE и отметку. При наведении выбранная строка сохраняет свой фон.
            </p>
            <p>
                Enter или Space открывают поле, стрелки перемещают выделение с пропуском disabled,
                Enter выбирает, Escape закрывает список. open/onOpenChange управляют раскрытием
                извне; без open используется внутреннее состояние и defaultOpen.
            </p>
            <h2>Состояния</h2>
            <p>
                error и hint повторяют Input: текст ошибки заменяет существующий hint, без hint
                подсвечивается только поле. Disabled блокирует все действия; readOnly сохраняет
                значение и фокус, но не раскрывается. Отдельная disabled-строка остаётся выбранной и
                видимой, переключить её нельзя; очистка всего набора по-прежнему доступна.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Select
                        options={options}
                        label="Ошибка"
                        hint="Выберите формат игры"
                        error="Проверьте формат игры"
                        block
                        dataTestId="docs-error"
                    />
                    <Select
                        options={options}
                        label="Disabled"
                        multiple
                        defaultValue={['cash', 'tournaments']}
                        clear
                        disabled
                        block
                        dataTestId="docs-disabled"
                    />
                    <Select
                        options={options}
                        label="Read-only"
                        defaultValue="cash"
                        readOnly
                        clear
                        block
                        dataTestId="docs-readonly"
                    />
                    <Select
                        options={options}
                        label="Внутренний label"
                        labelView="inner"
                        searchable
                        block
                        dataTestId="docs-inner"
                    />
                </div>
            </Unstyled>
            <h2>Результаты поиска</h2>
            <p>
                Компонент фильтрует переданный список options. Если совпадений нет, показывает
                «Ничего не найдено» и подсказку «Измените поисковый запрос». Это сообщение не
                включает error самого поля. noResultsText позволяет заменить основной текст.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <Select
                        options={options}
                        searchable
                        multiple
                        defaultValue={['cash']}
                        label="Поиск внутри списка"
                        hint="Введите «Омаха», чтобы увидеть сообщение об отсутствии совпадений"
                        clear
                        block
                        dataTestId="docs-search"
                    />
                </div>
            </Unstyled>
            <p>
                Поисковый запрос хранится внутри компонента и сбрасывается при закрытии списка.
                Очистка поиска меняет только запрос, сохраняя выбор. Уже известные подписи выбранных
                id сохраняются при смене options. Если id никогда не был в options, отображается сам
                id; компонент не выбирает другую строку автоматически.
            </p>
            <h2>Форма и настройка</h2>
            <p>
                ref указывает на HTMLButtonElement поля. name отправляет id через скрытые поля,
                multiple — повторяющиеся значения одного name. Disabled исключается из отправки,
                readOnly сохраняется. Сброс формы восстанавливает defaultValue неуправляемого
                Select; управляемые значения меняет приложение.
            </p>
            <p>
                className/style относятся к обёртке; labelClassName, messageClassName и
                dropdownClassName — к частям. getPortalContainer задаёт контейнер портала.
                dataTestId относится к кнопке; суффиксы частей указаны в Props. Label кнопки очистки
                всегда «close».
            </p>
        </>
    );
}

export function SelectDocs() {
    return (
        <ComponentDocs
            componentName="Select"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Select/index.module.css', content: componentStyles },
                { name: 'Select/vars.css', content: variables },
                { name: 'Input/index.module.css', content: inputStyles },
                { name: 'Input/vars.css', content: inputVariables },
                { name: 'Popover/index.module.css', content: popoverStyles },
                { name: 'Popover/vars.css', content: popoverVariables },
            ]}
        />
    );
}
