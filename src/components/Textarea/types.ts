import type { ChangeEvent, MouseEvent, ReactNode, TextareaHTMLAttributes } from 'react';

export type TextareaProps = Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'maxLength' | 'onChange' | 'children' | 'rows'
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
     * Максимальная длина нативного ввода в кодовых единицах UTF-16.
     */
    maxLength?: number;

    /**
     * Показывает текущую длину и maxLength рядом с label.
     * Работает только при заданном неотрицательном целом maxLength.
     * @default false
     */
    showValueLength?: boolean;

    /**
     * Вид поля: белый primary или светлый secondary.
     * @default 'primary'
     */
    view?: 'primary' | 'secondary';

    /**
     * Растягивает компонент на ширину контейнера.
     * @default false
     */
    block?: boolean;

    /**
     * Название поля. Клик переводит фокус в textarea.
     */
    label?: ReactNode;

    /**
     * Положение label. Внутренний label поднимается при фокусе или заполнении.
     * @default 'outer'
     */
    labelView?: 'outer' | 'inner';

    /**
     * Подсказка под полем. Сообщение об ошибке заменяет её.
     */
    hint?: ReactNode;

    /**
     * Сообщение об ошибке или true для состояния ошибки без сообщения.
     * Без непустого hint отображается только рамка. true сохраняет hint.
     */
    error?: ReactNode | boolean;

    /**
     * Начальное число видимых строк; при autosize — минимальное число строк.
     * Должно быть положительным целым числом.
     * @default 3
     */
    minRows?: number;

    /**
     * Максимальное число видимых строк при autosize. Затем текст прокручивается.
     * Значение меньше minRows ограничивается minRows.
     */
    maxRows?: number;

    /**
     * Подстраивает высоту под содержимое, включая переносы по ширине.
     * @default false
     */
    autosize?: boolean;

    /**
     * Разрешает менять высоту вручную за нижний правый угол.
     * Не работает вместе с autosize, в disabled и readOnly. Ширина сохраняется.
     * @default false
     */
    resize?: boolean;

    /**
     * Показывает кнопку очистки заполненного редактируемого поля.
     * @default false
     */
    clear?: boolean;

    /**
     * Обработчик ввода с нативным событием React и текущим значением.
     */
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>, payload: { value: string }) => void;

    /**
     * Обработчик очистки. Не вызывает onChange.
     * В управляемом режиме обновите value в этом обработчике.
     */
    onClear?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Класс визуального поля.
     */
    fieldClassName?: string;

    /**
     * Класс нативного textarea. className и style относятся к обёртке.
     */
    textareaClassName?: string;

    /**
     * Класс label.
     */
    labelClassName?: string;

    /**
     * Класс подсказки или сообщения об ошибке.
     */
    messageClassName?: string;

    /**
     * Идентификатор нативного textarea. Части получают суффиксы -form-control,
     * -field, -label, -hint, -error, -clear и -counter.
     */
    dataTestId?: string;
};
