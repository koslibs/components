import cn from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { createSizeModifier } from '../../create-size-modifier';
import type { PopoverProps } from '../../types';
import { usePopoverPosition } from '../../use-popover-position';

import styles from '../../index.module.css';

type Props = Omit<PopoverProps, 'open' | 'getPortalContainer' | 'anchorElement'> & {
    anchorElement: HTMLElement;
};

const DEFAULT_OFFSET: [number, number] = [0, 0];

export const PopoverSurface = forwardRef<HTMLDivElement, Props>(
    (
        {
            anchorElement,
            position = 'bottom-start',
            offset = DEFAULT_OFFSET,
            useAnchorWidth = false,
            preventFlip = false,
            fallbackPlacements,
            preventOverflow = true,
            availableHeight = true,
            viewportPadding = 8,
            onClose,
            outsideClick = true,
            escapeKeyDown = true,
            className,
            style,
            children,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
        useImperativeHandle(ref, () => popperElement!, [popperElement]);

        const padding = Math.max(0, viewportPadding);
        const modifiers = useMemo(
            () => [
                { name: 'offset', options: { offset } },
                {
                    name: 'flip',
                    enabled: !preventFlip,
                    options: { fallbackPlacements, boundary: [], padding },
                },
                {
                    name: 'preventOverflow',
                    enabled: preventOverflow,
                    options: { boundary: [], padding },
                },
                createSizeModifier({ availableHeight, useAnchorWidth, viewportPadding: padding }),
            ],
            [
                offset,
                preventFlip,
                fallbackPlacements,
                preventOverflow,
                availableHeight,
                useAnchorWidth,
                padding,
            ]
        );
        const {
            styles: popperStyles,
            attributes,
            update,
        } = usePopoverPosition(anchorElement, popperElement, position, modifiers);
        useEffect(() => {
            if (update) void update();
        }, [children, style, update]);

        useEffect(() => {
            if (!onClose) return;

            const ownerDocument = anchorElement.ownerDocument;
            const handlePointerDown = (event: PointerEvent) => {
                if (event.defaultPrevented) return;

                const path = event.composedPath();
                if (path.includes(anchorElement) || (popperElement && path.includes(popperElement)))
                    return;

                onClose();
            };
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key !== 'Escape' || event.defaultPrevented) return;

                event.preventDefault();
                event.stopPropagation();
                onClose();
            };

            if (outsideClick) ownerDocument.addEventListener('pointerdown', handlePointerDown);
            if (escapeKeyDown) ownerDocument.addEventListener('keydown', handleKeyDown);

            return () => {
                ownerDocument.removeEventListener('pointerdown', handlePointerDown);
                ownerDocument.removeEventListener('keydown', handleKeyDown);
            };
        }, [anchorElement, popperElement, onClose, outsideClick, escapeKeyDown]);

        return (
            <div
                {...restProps}
                {...attributes}
                ref={setPopperElement}
                className={cn(styles.component, className)}
                style={{
                    ...style,
                    ...popperStyles,
                    visibility: popperStyles?.transform ? style?.visibility : 'hidden',
                }}
                data-test-id={dataTestId}
            >
                {children}
            </div>
        );
    }
);

PopoverSurface.displayName = 'PopoverSurface';
