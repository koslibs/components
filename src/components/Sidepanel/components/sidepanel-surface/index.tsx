import cn from 'classnames';
import {
    forwardRef,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    type MouseEvent,
    type PointerEvent,
    type SyntheticEvent,
    type TransitionEvent,
} from 'react';

import { lockScroll } from '../../../../utils/lock-scroll';
import { SidepanelContext } from '../../context';
import { useDialogTransition } from '../../hooks/use-dialog-transition';
import type { SidepanelProps } from '../../types';

import styles from '../../index.module.css';
import scrollbarStyles from '../../scrollbar.module.css';

type SurfaceProps = Omit<SidepanelProps, 'getPortalContainer'> & {
    onExited: VoidFunction;
};

export const SidepanelSurface = forwardRef<HTMLDialogElement, SurfaceProps>(
    (
        {
            open,
            onClose,
            onExited,
            escapeKeyDown = true,
            backdropClick = true,
            lockScroll: shouldLockScroll = true,
            className,
            dataTestId,
            children,
            onPointerDown,
            onClick,
            onTransitionEnd,
            ...restProps
        },
        ref
    ) => {
        const dialogRef = useRef<HTMLDialogElement | null>(null);
        const backdropPointerDown = useRef(false);
        const mounted = useRef(false);

        useLayoutEffect(() => {
            mounted.current = true;
            return () => {
                mounted.current = false;
            };
        }, []);

        const { active, finishClosing } = useDialogTransition(dialogRef, open, onExited);

        const requestClose = useCallback(() => {
            if (open) onClose?.();
        }, [onClose, open]);

        const mergedRef = useCallback(
            (element: HTMLDialogElement | null) => {
                dialogRef.current = element;
                if (typeof ref === 'function') ref(element);
                else if (ref) ref.current = element;
            },
            [ref]
        );

        const context = useMemo(
            () => ({ onClose: requestClose, dataTestId }),
            [dataTestId, requestClose]
        );

        useLayoutEffect(() => {
            const dialog = dialogRef.current;
            if (active && shouldLockScroll && dialog) return lockScroll(dialog.ownerDocument, true);
        }, [active, shouldLockScroll]);

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
            event.preventDefault();
            event.stopPropagation();
            if (escapeKeyDown) requestClose();
        };

        const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
            event.stopPropagation();
            if (mounted.current && !event.currentTarget.open) requestClose();
        };

        const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
            onPointerDown?.(event);
            backdropPointerDown.current = !event.defaultPrevented && isBackdrop(event);
        };

        const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
            onClick?.(event);
            const close = backdropPointerDown.current && isBackdrop(event);
            backdropPointerDown.current = false;
            if (backdropClick && close && !event.defaultPrevented) requestClose();
        };

        const handleTransitionEnd = (event: TransitionEvent<HTMLDialogElement>) => {
            onTransitionEnd?.(event);
            if (event.target === event.currentTarget && event.propertyName === 'transform') {
                finishClosing();
            }
        };

        return (
            <dialog
                {...restProps}
                ref={mergedRef}
                className={cn(styles.component, scrollbarStyles.scrollbar, className)}
                data-test-id={dataTestId}
                data-state="closed"
                onCancel={handleCancel}
                onClose={handleClose}
                onPointerDown={handlePointerDown}
                onClick={handleClick}
                onTransitionEnd={handleTransitionEnd}
            >
                <SidepanelContext.Provider value={context}>{children}</SidepanelContext.Provider>
            </dialog>
        );
    }
);

SidepanelSurface.displayName = 'SidepanelSurface';
