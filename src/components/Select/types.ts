import type { ButtonHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import type { InputProps } from '../Input';
import type { PopoverProps } from '../Popover';

export type SelectOption = {
    /**
     * Стабильный уникальный идентификатор варианта.
     */
    id: string;

    /**
     * Подпись в поле и в списке. Используется для локального поиска.
     */
    label: string;

    /**
     * Запрещает переключение строки, сохраняя уже выбранное значение.
     * @default false
     */
    disabled?: boolean;
};

export type SelectChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export type SelectChangePayload<Value = string | null> = {
    /**
     * Значение выбора: id одиночного варианта либо массив id для multiple.
     */
    value: Value;

    /**
     * Выбранные варианты в порядке выбора, включая недоступные строки.
     */
    selectedOptions: SelectOption[];
};

type CommonProps = Pick<
    InputProps,
    | 'view'
    | 'size'
    | 'block'
    | 'hasOutline'
    | 'hint'
    | 'error'
    | 'clear'
    | 'className'
    | 'style'
    | 'labelClassName'
    | 'messageClassName'
> &
    Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'value' | 'defaultValue' | 'onChange' | 'children' | 'name' | 'type' | 'className' | 'style'
    > & {
        /**
         * Варианты с уникальными id. Порядок строк сохраняется при выборе.
         */
        options: readonly SelectOption[];

        /**
         * Название поля. Внешний label связан с кнопкой выбора через htmlFor и id.
         */
        label?: ReactNode;

        /**
         * Положение названия: снаружи или внутри. Внутренний label поднимается
         * при фокусе, раскрытии или наличии выбранных значений.
         * @default 'outer'
         */
        labelView?: 'outer' | 'inner';

        /**
         * Сохраняет читаемое значение и фокус, запрещая раскрытие, выбор и очистку.
         * @default false
         */
        readOnly?: boolean;

        /**
         * Текст пустого поля.
         * @default 'Выберите значение'
         */
        placeholder?: string;

        /**
         * Поиск внутри списка. По умолчанию фильтрует label без учёта регистра.
         * @default false
         */
        searchable?: boolean;

        /**
         * Placeholder поискового Input.
         * @default 'Поиск по списку'
         */
        searchPlaceholder?: string;

        /**
         * Управляемое раскрытие. Disabled и readOnly всегда скрывают список.
         */
        open?: boolean;

        /**
         * Начальное раскрытие неуправляемого списка.
         * @default false
         */
        defaultOpen?: boolean;

        /**
         * Запрос изменения раскрытия, в том числе при выборе, Escape и клике снаружи.
         */
        onOpenChange?: (open: boolean) => void;

        /**
         * Текст отсутствия совпадений.
         * @default 'Ничего не найдено'
         */
        noResultsText?: string;

        /**
         * Очистка, как у Input, вызывает только onClear, без onChange.
         * Неуправляемое поле очищается само; для управляемого обновите value.
         */
        onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

        /**
         * Имя поля формы. Multiple отправляет отдельное значение для каждого id.
         */
        name?: string;

        /**
         * Дополнительный класс выпадающего списка.
         */
        dropdownClassName?: string;

        /**
         * Контейнер портала. По умолчанию используется body документа поля.
         */
        getPortalContainer?: PopoverProps['getPortalContainer'];

        /**
         * Идентификатор кнопки выбора. Части получают суффиксы -form-control,
         * -field, -label, -value, -hint/-error, -clear, -dropdown, -search,
         * -options, -option-{id} и -empty.
         */
        dataTestId?: string;
    };

type SingleProps = {
    /**
     * Выбор одного варианта.
     * @default false
     */
    multiple?: false;

    /**
     * Id управляемого выбора. null означает отсутствие выбора.
     */
    value?: string | null;

    /**
     * Начальный id неуправляемого выбора.
     */
    defaultValue?: string | null;

    /**
     * Изменение выбора: событие и { value, selectedOptions }.
     */
    onChange?: (event: SelectChangeEvent, payload: SelectChangePayload) => void;
};

type MultipleProps = {
    /**
     * Множественный выбор. Строки переключаются без закрытия списка.
     */
    multiple: true;

    /**
     * Id управляемого выбора в порядке выбора. Пустой массив очищает поле.
     */
    value?: readonly string[];

    /**
     * Начальные id неуправляемого выбора.
     */
    defaultValue?: readonly string[];

    /**
     * Изменение выбора: событие и { value: string[], selectedOptions }.
     */
    onChange?: (event: SelectChangeEvent, payload: SelectChangePayload<string[]>) => void;
};

export type SelectProps = CommonProps & (SingleProps | MultipleProps);
