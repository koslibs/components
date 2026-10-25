import type { DialogHTMLAttributes } from 'react';

import type { PortalProps } from '../Portal';

export type SidepanelProps = Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'open' | 'onClose' | 'onCancel'
> & {
    /**
     * Видимость панели. Для закрытия обновите open в обработчике onClose.
     * Панель остаётся открытой до завершения анимации ухода вправо.
     */
    open: boolean;

    /**
     * Запрос закрытия по крестику, Escape или бекдропу.
     */
    onClose?: VoidFunction;

    /**
     * Вызывается после завершения закрытия панели.
     */
    onExited?: VoidFunction;

    /**
     * Разрешает запрос закрытия по Escape.
     * @default true
     */
    escapeKeyDown?: boolean;

    /**
     * Разрешает запрос закрытия по бекдропу.
     * @default true
     */
    backdropClick?: boolean;

    /**
     * Блокирует прокрутку страницы до завершения закрытия.
     * @default true
     */
    lockScroll?: boolean;

    /**
     * Контейнер портала. По умолчанию используется body текущего документа.
     */
    getPortalContainer?: PortalProps['getPortalContainer'];

    /**
     * Идентификатор панели. Части получают суффиксы -header, -closer, -content и -footer.
     */
    dataTestId?: string;
};
