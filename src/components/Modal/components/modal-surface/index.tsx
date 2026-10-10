import cn from 'classnames';
import {
    forwardRef,
    useLayoutEffect,
    useCallback,
    useRef,
    useMemo,
    type MouseEvent,
    type PointerEvent,
    type SyntheticEvent,
} from 'react';

import { ModalContext } from '../../context';
import type { ModalProps } from '../../types';
import { lockScroll } from '../../utils/lock-scroll';

import colorStyles from '../../colors.module.css';
import styles from '../../index.module.css';

type SurfaceProps = Omit<ModalProps, 'open' | 'getPortalContainer'>;

export const ModalSurface = forwardRef<HTMLDialogElement, SurfaceProps>(
    (
        {
            onClose,
            size = 720,
            escapeKeyDown = true,
            backdropClick = true,
            lockScroll: shouldLockScroll = true,
            className,
            dataTestId,
            children,
            onPointerDown,
            onClick,
            ...restProps
        },
        ref
    ) => {
        const dialogRef = useRef<HTMLDialogElement | null>(null);
        const backdropPointerDown = useRef(false);
        const mounted = useRef(false);
        const contextValue = useMemo(() => ({ onClose, dataTestId }), [onClose, dataTestId]);
        const mergedRef = useCallback(
            (element: HTMLDialogElement | null) => {
                dialogRef.current = element;
                if (typeof ref === 'function') ref(element);
                else if (ref) ref.current = element;
            },
            [ref]
        );

        useLayoutEffect(() => {
            const dialog = dialogRef.current;

            if (!dialog) return;

            mounted.current = true;
            if (!dialog.open) dialog.showModal();

            return () => {
                mounted.current = false;
                dialog.close();
            };
        }, []);

        useLayoutEffect(() => {
            const dialog = dialogRef.current;

            if (dialog && shouldLockScroll) return lockScroll(dialog.ownerDocument);
        }, [shouldLockScroll]);

        const isBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
            const bounds = event.currentTarget.getBoundingClientRect();

            return (
                event.target === event.currentTarget &&
                (event.clientX < bounds.left ||
                    event.clientX > bounds.right ||
                    event.clientY < bounds.top ||
                    event.clientY > bounds.bottom)
            );
        };

        const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
            event.stopPropagation();
            event.preventDefault();
            if (escapeKeyDown) {
                onClose?.();
            }
        };

        const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
            event.stopPropagation();
            // StrictMode can reopen the dialog before the cleanup's queued close event arrives.
            if (mounted.current && !event.currentTarget.open) {
                onClose?.();
            }
        };

        const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
            onPointerDown?.(event);
            backdropPointerDown.current = !event.defaultPrevented && isBackdrop(event);
        };

        const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
            onClick?.(event);
            const close = backdropPointerDown.current && isBackdrop(event);
            backdropPointerDown.current = false;

            if (backdropClick && close && !event.defaultPrevented) {
                onClose?.();
            }
        };

        return (
            <dialog
                {...restProps}
                ref={mergedRef}
                className={cn(
                    styles.component,
                    colorStyles.component,
                    styles[`size-${size}`],
                    className
                )}
                data-test-id={dataTestId}
                onCancel={handleCancel}
                onClose={handleClose}
                onPointerDown={handlePointerDown}
                onClick={handleClick}
            >
                <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
            </dialog>
        );
    }
);

ModalSurface.displayName = 'ModalSurface';
