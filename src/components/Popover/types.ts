import type { Placement } from '@popperjs/core';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type PopoverPosition = Exclude<Placement, 'auto' | 'auto-start' | 'auto-end'>;

export type PopoverProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'className' | 'style'
> & {
    /** Содержимое поповера. Оформление и прокрутка задаются вызывающим компонентом. */
    children?: ReactNode;

    /**
     * Дополнительный класс внешнего контейнера.
     */
    className?: string;

    /**
     * Стили внешнего контейнера, включая ширину.
     */
    style?: CSSProperties;

    /**
     * Видимость поповера.
     */
    open: boolean;

    /**
     * Элемент, относительно которого открывается поповер.
     */
    anchorElement: HTMLElement | null;

    /**
     * Предпочтительная позиция относительно элемента.
     * @default 'bottom-start'
     */
    position?: PopoverPosition;

    /**
     * Смещение вдоль элемента и расстояние от него, в пикселях.
     * @default [0, 0]
     */
    offset?: [number, number];

    /**
     * Использовать ширину элемента, относительно которого открыт поповер.
     * @default false
     */
    useAnchorWidth?: boolean;

    /**
     * Запретить смену стороны при недостатке места.
     * @default false
     */
    preventFlip?: boolean;

    /**
     * Позиции, которые проверяются при недостатке места.
     */
    fallbackPlacements?: PopoverPosition[];

    /**
     * Удерживать поповер в пределах видимой области.
     * @default true
     */
    preventOverflow?: boolean;

    /**
     * Ограничивать высоту доступным местом.
     * Для прокрутки задайте содержимому min-height: 0 и overflow: auto.
     * @default true
     */
    availableHeight?: boolean;

    /**
     * Минимальный отступ от границ видимой области, в пикселях.
     * @default 8
     */
    viewportPadding?: number;

    /**
     * Обработчик запроса закрытия. Обновите open в вызывающем компоненте.
     */
    onClose?: VoidFunction;

    /**
     * Разрешить закрытие по нажатию вне поповера и его элемента.
     * @default true
     */
    outsideClick?: boolean;

    /**
     * Разрешить закрытие по Escape.
     * @default true
     */
    escapeKeyDown?: boolean;

    /**
     * Контейнер портала. По умолчанию — body документа anchorElement.
     * Если функция возвращает null, поповер не рендерится.
     */
    getPortalContainer?: () => Element | null;

    /**
     * Идентификатор для автоматизированных тестов.
     */
    dataTestId?: string;
};
