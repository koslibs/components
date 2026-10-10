import type { DialogHTMLAttributes } from 'react';

export type ModalProps = Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'open' | 'onClose' | 'onCancel'
> & {
    /**
     * Видимость окна. Закрытие запрашивается через onClose.
     */
    open: boolean;

    /**
     * Обработчик запроса закрытия. Обновите open в вызывающем компоненте.
     * Вызывается в том числе кнопкой закрытия Header.
     */
    onClose?: VoidFunction;

    /**
     * Ширина в пикселях или окно на весь экран.
     * @default 720
     */
    size?: 480 | 600 | 720 | 960 | 'fullscreen';

    /**
     * Разрешить закрытие по Escape.
     * @default true
     */
    escapeKeyDown?: boolean;

    /**
     * Разрешить закрытие по подложке.
     * @default true
     */
    backdropClick?: boolean;

    /**
     * Блокировать прокрутку страницы.
     * @default true
     */
    lockScroll?: boolean;

    /**
     * Контейнер портала. По умолчанию используется body текущего документа.
     */
    getPortalContainer?: () => Element | null;

    /**
     * Идентификатор для автоматизированных тестов.
     * Части наследуют его с суффиксами -header, -content, -footer и -controls.
     */
    dataTestId?: string;
};
