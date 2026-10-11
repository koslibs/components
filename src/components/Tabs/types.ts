import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

export type TabProps = {
    /**
     * Уникальный стабильный идентификатор вкладки.
     */
    id: string;

    /**
     * Текст заголовка вкладки.
     */
    title: ReactNode;

    /**
     * Неотрицательное целое число. Неизвестное значение скрывается, 0 отображается.
     */
    count?: number;

    /**
     * Запрещает выбор вкладки.
     * @default false
     */
    disabled?: boolean;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
    /**
     * Дочерние Tab в порядке отображения. id должны быть уникальными.
     * Поддерживаются массивы, условные элементы и Fragment.
     */
    children?: ReactNode;

    /**
     * Идентификатор активной вкладки в controlled-режиме.
     */
    selectedId?: string;

    /**
     * Начальная вкладка в uncontrolled-режиме. По умолчанию — первая доступная.
     */
    defaultSelectedId?: string;

    /**
     * Запрос выбора другой вкладки пользователем: событие и { selectedId }.
     * В controlled-режиме обновите selectedId. Повторный выбор и изменение children
     * не вызывают обработчик.
     */
    onChange?: (event: MouseEvent<HTMLButtonElement>, payload: { selectedId: string }) => void;

    /**
     * Высота заголовков вкладок в пикселях.
     * @default 40
     */
    size?: 40 | 48;

    /**
     * Общее пустое состояние, когда нет доступных вкладок.
     */
    emptyState?: ReactNode;

    /**
     * Класс ряда заголовков.
     */
    listClassName?: string;

    /**
     * Идентификатор корня. Части получают суффиксы -list, -indicator,
     * -tab-{id}.
     */
    dataTestId?: string;
};
