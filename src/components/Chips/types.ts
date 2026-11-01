import type { ChangeEvent, FieldsetHTMLAttributes } from 'react';

export type ChipsItem = {
    /**
     * Уникальное значение пункта.
     */
    value: string;

    /**
     * Полная текстовая подпись пункта.
     */
    label: string;

    /**
     * Блокирует переключение пункта, сохраняя его выбранное состояние.
     * @default false
     */
    disabled?: boolean;
};

export type ChipsChangePayload<Value = string | null> = {
    /**
     * Выбранное значение или массив значений в порядке выбора.
     */
    value: Value;
};

type CommonProps = Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'onChange' | 'defaultValue' | 'children' | 'name' | 'disabled'
> & {
    /**
     * Пункты с уникальными value. All обрабатывается как обычный пункт.
     */
    items: readonly ChipsItem[];

    /**
     * Блокирует все пункты группы, сохраняя выбор.
     * @default false
     */
    disabled?: boolean;

    /**
     * Дополнительный CSS-класс списка пунктов.
     */
    listClassName?: string;

    /**
     * Дополнительный CSS-класс каждого chip.
     */
    itemClassName?: string;

    /**
     * Идентификатор группы для тестов. Пункты получают суффикс с их value.
     */
    dataTestId?: string;
};

type SingleProps = {
    /**
     * Выбирает один пункт. Повторное нажатие сохраняет выбор.
     * @default false
     */
    multiselect?: false;

    /**
     * Управляемое значение; null означает пустой выбор.
     */
    value?: string | null;

    /**
     * Начальное значение неуправляемой группы.
     * @default null
     */
    defaultValue?: string | null;

    /**
     * Изменение пользователем выбранного значения.
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: ChipsChangePayload) => void;
};

type MultipleProps = {
    /**
     * Независимое переключение нескольких пунктов.
     */
    multiselect: true;

    /**
     * Управляемый массив выбранных значений.
     */
    value?: readonly string[];

    /**
     * Начальный массив значений неуправляемой группы.
     * @default []
     */
    defaultValue?: readonly string[];

    /**
     * Изменение пользователем набора выбранных значений.
     */
    onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        payload: ChipsChangePayload<string[]>
    ) => void;
};

export type ChipsProps = CommonProps & (SingleProps | MultipleProps);
