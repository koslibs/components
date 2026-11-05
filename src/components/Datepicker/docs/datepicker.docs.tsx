import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';
import buttonColors from '../../Button/colors.module.css?raw';
import buttonStyles from '../../Button/index.module.css?raw';
import buttonVariables from '../../Button/vars.css?raw';
import inputStyles from '../../Input/index.module.css?raw';
import inputVariables from '../../Input/vars.css?raw';
import popoverStyles from '../../Popover/index.module.css?raw';
import popoverVariables from '../../Popover/vars.css?raw';
import typographyStyles from '../../Typography/index.module.css?raw';
import typographyVariables from '../../Typography/vars.css?raw';

import { Datepicker, DatepickerPanel } from '..';

import changelog from '../CHANGELOG.md?raw';
import componentStyles from '../index.module.css?raw';
import panelStyles from '../panel.module.css?raw';
import variables from '../vars.css?raw';

import styles from './examples.module.css';

const example = `import { Datepicker, DatepickerPanel } from '@koslibs/components/Datepicker';

const handlePeriodChange = (_, { value }) => setPeriod(value);
const handlePeriodClear = () => setPeriod(null);
const handleDateChange = (_, { value }) => saveDate(value);

<Datepicker
    mode="range"
    value={period}
    onChange={handlePeriodChange}
    clear
    onClear={handlePeriodClear}
/>

<DatepickerPanel defaultValue="2026-10-25" onChange={handleDateChange} />`;

const popoverExample = `import { useState } from 'react';
import { DatepickerPopover } from '@koslibs/components/Datepicker';

function DateFilter() {
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <button type="button" ref={setAnchorElement} onClick={handleOpen}>
                Choose a date
            </button>
            <DatepickerPopover
                anchorElement={anchorElement}
                open={open}
                defaultValue="2026-10-25"
                onChange={handleClose}
                onClose={handleClose}
            />
        </>
    );
}`;

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Основан на{' '}
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2670-23276">
                    документации Datepicker в Figma
                </a>
                . По умолчанию одиночный выбор, primary, size=40, внешний label. Фиксированные
                английские подписи и неделя с понедельника.
            </p>
            <Primary />
            <div className={styles.scroll}>
                <Controls />
            </div>
            <h2>Значения и подтверждение</h2>
            <p>
                В single значение — строка YYYY-MM-DD или null; в range — {'{ from, to }'} или null,
                обе границы включены. onChange получает событие кнопки Apply и {'{ value }'}. До
                Apply календарь и ручной ввод меняют только черновик. Cancel, Escape и закрытие
                снаружи отменяют его. В поле дата отображается как DD/MM/YYYY.
            </p>
            <pre className={styles.scroll}>
                <code>{example}</code>
            </pre>
            <h2>Поповер со своим триггером</h2>
            <p>
                DatepickerPopover привязывается к anchorElement. Приложение задаёт open и решает,
                когда закрыть поповер. Apply передаёт выбранную дату через onChange. Клик снаружи,
                Escape и Cancel вызывают onClose, а для Cancel и Escape внутри панели можно передать
                отдельный onCancel. При закрытии черновик сбрасывается. При использовании
                defaultValue применённая дата хранится внутри компонента между открытиями.
            </p>
            <pre className={styles.scroll}>
                <code>{popoverExample}</code>
            </pre>
            <h2>Ручной ввод</h2>
            <p>
                Вводите YYYY-MM-DD в панели. Несуществующая дата, неполный ввод или конец раньше
                начала показывают ошибку и блокируют Apply. Пустое значение также нельзя применить;
                для очистки используйте clear у внешнего поля. Поддерживаются годы 0001–9999.
            </p>
            <h2>Самостоятельная панель</h2>
            <p>
                DatepickerPanel поддерживает те же mode, value, defaultValue и onChange. onCancel
                отменяет черновик; встроенная панель остаётся видимой. Для подтверждения и отмены
                используются кнопки Apply и Cancel.
            </p>
            <Unstyled>
                <div className={styles.panels}>
                    <DatepickerPanel defaultValue="2026-10-25" />
                    <DatepickerPanel
                        mode="range"
                        defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
                    />
                </div>
            </Unstyled>
            <h2>Выбор диапазона и навигация</h2>
            <p>
                Первый клик задаёт начало, наведение показывает preview, второй клик завершает
                диапазон. Клик раньше начала переносит начало; одинаковые даты задают один день.
                После полного диапазона следующий клик начинает новый. Левая колонка месяцев и
                календарь синхронизированы в обе стороны: прокрутка любой колонки перемещает и
                другую. Клик месяца переносит календарь к его началу. Колесо, трекпад, касание и
                полосы прокрутки перемещают месяцы непрерывно. Слева единое окно плавно показывает
                видимую часть календаря, включая части месяцев и переход года, и удерживается около
                центра списка. Левая колонка выше календаря на --datepicker-months-extra-height
                (36px). Заголовок дней недели неподвижен. Выбранные даты при прокрутке сохраняются.
                Сегодняшняя дата отдельно не выделяется. Высота календарного окна настраивается
                переменной --datepicker-range-calendar-height (по умолчанию 420px).
            </p>
            <h2>Размеры и состояния поля</h2>
            <Unstyled>
                <div className={styles.fields}>
                    {[40, 48, 56, 64, 72].map((size) => (
                        <Datepicker
                            key={size}
                            size={size as 40 | 48 | 56 | 64 | 72}
                            label={`Size ${size}`}
                            defaultValue="2026-10-25"
                        />
                    ))}
                    <Datepicker
                        label="Inner label"
                        labelView="inner"
                        size={56}
                        view="secondary"
                        clear
                        defaultValue="2026-10-25"
                    />
                    <Datepicker label="Disabled" disabled defaultValue="2026-10-25" />
                    <Datepicker label="Read only" readOnly defaultValue="2026-10-25" />
                    <Datepicker label="Error" error="Check the date" hint="YYYY-MM-DD" hasOutline />
                </div>
            </Unstyled>
            <h2>Управление, очистка и формы</h2>
            <p>
                value управляет применённой датой, defaultValue включает внутреннее состояние.
                open/defaultOpen/onOpenChange управляют раскрытием. Очистка вызывает только onClear;
                при управляемом value обновите его в обработчике. name отправляет YYYY-MM-DD, а в
                range — name.from и name.to. Пустые значения отправляются пустыми строками,
                disabled-поля не отправляются. Нативный reset восстанавливает defaultValue
                неуправляемого поля.
            </p>
            <p>
                Поддерживаются обычные кнопки, Tab/Enter/Space и Escape для отмены. Специальная
                навигация по дням с клавиатуры, API локализации и ограничение отдельных дат не
                предусмотрены.
            </p>
        </>
    );
}

export function DatepickerDocs() {
    return (
        <ComponentDocs
            componentName="Datepicker"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Datepicker/index.module.css', content: componentStyles },
                { name: 'Datepicker/panel.module.css', content: panelStyles },
                { name: 'Datepicker/vars.css', content: variables },
                { name: 'Input/index.module.css', content: inputStyles },
                { name: 'Input/vars.css', content: inputVariables },
                { name: 'Button/index.module.css', content: buttonStyles },
                { name: 'Button/colors.module.css', content: buttonColors },
                { name: 'Button/vars.css', content: buttonVariables },
                { name: 'Popover/index.module.css', content: popoverStyles },
                { name: 'Popover/vars.css', content: popoverVariables },
                { name: 'Typography/index.module.css', content: typographyStyles },
                { name: 'Typography/vars.css', content: typographyVariables },
            ]}
        />
    );
}
