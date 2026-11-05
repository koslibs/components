import type { ButtonHTMLAttributes, CSSProperties, MouseEvent } from 'react';

import type { InputProps } from '../Input';
import type { PopoverProps } from '../Popover';

export type DatepickerRange = {
    /**
     * Начало включительного диапазона в формате YYYY-MM-DD.
     */
    from: string;

    /**
     * Конец включительного диапазона в формате YYYY-MM-DD.
     */
    to: string;
};

export type DatepickerChangePayload<Value = string | null> = {
    /**
     * Применённая дата или полный диапазон; null означает пустое значение.
     */
    value: Value;
};

type SingleProps = {
    /**
     * Выбор одной даты.
     * @default 'single'
     */
    mode?: 'single';

    /**
     * Управляемая дата YYYY-MM-DD или null.
     */
    value?: string | null;

    /**
     * Начальная дата неуправляемого компонента.
     */
    defaultValue?: string | null;

    /**
     * Подтверждение по Apply. Клики дней и ручной ввод меняют только черновик.
     */
    onChange?: (event: MouseEvent<HTMLButtonElement>, payload: DatepickerChangePayload) => void;
};

type RangeProps = {
    /**
     * Выбор включительного диапазона дат.
     */
    mode: 'range';

    /**
     * Управляемый полный диапазон YYYY-MM-DD или null.
     */
    value?: DatepickerRange | null;

    /**
     * Начальный диапазон неуправляемого компонента.
     */
    defaultValue?: DatepickerRange | null;

    /**
     * Подтверждение полного корректного диапазона по Apply.
     */
    onChange?: (
        event: MouseEvent<HTMLButtonElement>,
        payload: DatepickerChangePayload<DatepickerRange | null>
    ) => void;
};

export type DatepickerValueProps = SingleProps | RangeProps;

export type DatepickerPanelProps = DatepickerValueProps & {
    /**
     * HTML-идентификатор панели.
     */
    id?: string;

    /**
     * Отмена черновика кнопкой Cancel или Escape. Панель остаётся видимой.
     */
    onCancel?: VoidFunction;

    /**
     * Класс панели.
     */
    className?: string;

    /**
     * Стили панели и её CSS-переменные.
     */
    style?: CSSProperties;

    /**
     * Идентификатор панели. Части: -date/-from/-to, -apply, -cancel,
     * -count, -day-YYYY-MM-DD, -month-N, -months, -month-window, -calendar, -calendar-months,
     * -previous/-next.
     */
    dataTestId?: string;
};

export type DatepickerPopoverProps = DatepickerPanelProps &
    Pick<
        PopoverProps,
        'open' | 'anchorElement' | 'position' | 'getPortalContainer' | 'outsideClick'
    > & {
        /**
         * Запрос закрытия при клике снаружи или Escape. Cancel и Escape внутри панели
         * используют onCancel, если он задан. Видимость меняется через open.
         */
        onClose?: VoidFunction;
    };

type FieldProps = Pick<
    InputProps,
    | 'view'
    | 'size'
    | 'block'
    | 'label'
    | 'labelView'
    | 'hint'
    | 'error'
    | 'hasOutline'
    | 'clear'
    | 'labelClassName'
    | 'messageClassName'
> &
    Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'value' | 'defaultValue' | 'onChange' | 'children' | 'name' | 'type' | 'style'
    > & {
        /**
         * Стили обёртки поля и её CSS-переменные.
         */
        style?: CSSProperties;

        /**
         * Сохраняет отображение и фокус, запрещая раскрытие и очистку.
         * @default false
         */
        readOnly?: boolean;

        /**
         * Подпись пустого поля.
         * @default 'Choose date' / 'Choose dates'
         */
        placeholder?: string;

        /**
         * Управляемая видимость панели. Disabled и readOnly скрывают её.
         */
        open?: boolean;

        /**
         * Начальная видимость неуправляемой панели.
         * @default false
         */
        defaultOpen?: boolean;

        /**
         * Запрос изменения видимости панели.
         */
        onOpenChange?: (open: boolean) => void;

        /**
         * Очистка вызывает только onClear. При управляемом value обновите его сами.
         */
        onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

        /**
         * Имя в форме. Range отправляет name.from и name.to.
         */
        name?: string;

        /**
         * Класс всплывающей панели, отдельный от класса поля.
         */
        panelClassName?: string;

        /**
         * Контейнер портала, как в Popover.
         */
        getPortalContainer?: PopoverProps['getPortalContainer'];

        /**
         * Идентификатор кнопки поля. Части: -form-control, -field, -label,
         * -value, -hint/-error, -clear, -popup, -panel и части панели.
         */
        dataTestId?: string;
    };

export type DatepickerProps = FieldProps & DatepickerValueProps;
