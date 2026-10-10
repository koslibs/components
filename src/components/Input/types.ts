import type { ChangeEvent, CSSProperties, InputHTMLAttributes, MouseEvent, ReactNode } from 'react';

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'maxLength' | 'onChange' | 'children'
> & {
    /**
     * Значение управляемого поля.
     */
    value?: string;

    /**
     * Начальное значение неуправляемого поля.
     */
    defaultValue?: string;

    /**
     * Максимальная длина ввода. Передаётся в нативный maxLength.
     * Длина считается в кодовых единицах UTF-16, как в HTML input.
     */
    maxLength?: number;

    /**
     * Показывает текущую длину и maxLength, например 13/64.
     * Работает только при заданном неотрицательном целом maxLength.
     * При inner расположен внутри поля, при outer — рядом с внешним label.
     * @default false
     */
    showValueLength?: boolean;

    /**
     * Вид поля: белый primary или светлый secondary.
     * @default 'primary'
     */
    view?: 'primary' | 'secondary';

    /**
     * Высота поля в пикселях без внешнего label и сообщения.
     * @default 40
     */
    size?: 40 | 48 | 56 | 64 | 72;

    /**
     * Растягивает компонент на ширину контейнера.
     * @default false
     */
    block?: boolean;

    /**
     * Название поля. Связывается с input через htmlFor и id.
     */
    label?: ReactNode;

    /**
     * Положение label: снаружи или внутри поля.
     * Внутренний label поднимается при фокусе или заполнении поля.
     * @default 'outer'
     */
    labelView?: 'outer' | 'inner';

    /**
     * Подсказка под полем. При наличии сообщения об ошибке заменяется им.
     */
    hint?: ReactNode;

    /**
     * Сообщение об ошибке или true для состояния ошибки без сообщения.
     * Сообщение заменяет hint; без hint отображается только состояние ошибки.
     */
    error?: ReactNode | boolean;

    /**
     * Аддон слева от значения, например иконка поиска.
     */
    leftAddon?: ReactNode;

    /**
     * Аддон справа от значения, например единица измерения или кнопка.
     */
    rightAddon?: ReactNode;

    /**
     * Показывает кнопку очистки заполненного поля. Скрыта в disabled и readOnly.
     * @default false
     */
    clear?: boolean;

    /**
     * Доступное имя кнопки очистки.
     * @default 'Очистить поле'
     */
    clearLabel?: string;

    /**
     * Обработчик ввода с нативным событием React и текущим значением.
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>, payload: { value: string }) => void;

    /**
     * Обработчик очистки. Не вызывает onChange.
     * Для управляемого поля обновите value в этом обработчике.
     */
    onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Класс обёртки компонента.
     */
    className?: string;

    /**
     * Стили обёртки компонента, включая ширину и CSS-переменные.
     */
    style?: CSSProperties;

    /**
     * Класс визуального поля с аддонами.
     */
    fieldClassName?: string;

    /**
     * Класс нативного input.
     */
    inputClassName?: string;

    /**
     * Класс label.
     */
    labelClassName?: string;

    /**
     * Класс подсказки или сообщения об ошибке.
     */
    messageClassName?: string;

    /**
     * Идентификатор нативного input. Части получают суффиксы -form-control,
     * -field, -label, -hint, -error, -left-addon, -right-addon, -clear и -counter.
     */
    dataTestId?: string;
};
