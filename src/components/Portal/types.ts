import type { ReactNode } from 'react';

export type PortalProps = {
    /**
     * Содержимое, которое будет перенесено в контейнер портала без дополнительной обёртки.
     */
    children?: ReactNode;

    /**
     * Контейнер портала. По умолчанию используется body текущего документа.
     * Если функция возвращает null или undefined, содержимое не рендерится.
     */
    getPortalContainer?: () => Element | null | undefined;

    /**
     * Рендерить содержимое сразу, если контейнер уже существует.
     * При false контейнер определяется после монтирования, чтобы дождаться DOM-контейнера из ref.
     * @default true
     */
    immediateMount?: boolean;
};
