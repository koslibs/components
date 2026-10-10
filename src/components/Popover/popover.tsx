import { forwardRef } from 'react';

import { Portal } from '../Portal';

import { PopoverSurface } from './components/popover-surface';
import type { PopoverProps } from './types';

export type { PopoverProps, PopoverPosition } from './types';

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    ({ open, anchorElement, getPortalContainer, ...restProps }, ref) => {
        if (!open || !anchorElement) return null;

        return (
            <Portal
                getPortalContainer={getPortalContainer ?? (() => anchorElement.ownerDocument.body)}
            >
                <PopoverSurface {...restProps} anchorElement={anchorElement} ref={ref} />
            </Portal>
        );
    }
);

Popover.displayName = 'Popover';
