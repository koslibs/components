import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Положительный отступ из общей шкалы --size-*.
 */
export type SpaceSize =
    | 2
    | 4
    | 6
    | 8
    | 12
    | 16
    | 20
    | 22
    | 24
    | 28
    | 30
    | 32
    | 36
    | 40
    | 44
    | 48
    | 56
    | 64
    | 72
    | 80
    | 96
    | 128;

export type SpaceProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /**
     * Элементы раскладки. Отображаются без дополнительных обёрток.
     */
    children: ReactNode;

    /**
     * Направление раскладки.
     * @default 'vertical'
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Единый отступ между элементами и строками.
     * Обязательное положительное значение из глобальной шкалы --size-*.
     */
    size: SpaceSize;

    /**
     * Выравнивание по поперечной оси относительно direction.
     * @default 'start'
     */
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';

    /**
     * Разрешает перенос элементов на следующую строку или колонку.
     * @default false
     */
    wrap?: boolean;

    /**
     * Растягивает контейнер на всю ширину родителя.
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Идентификатор корневого элемента для тестов.
     */
    dataTestId?: string;
};
