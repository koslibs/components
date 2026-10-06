import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import { PopoverSurface } from './components/popover-surface';
import type { PopoverProps } from './types';

export type { PopoverProps, PopoverPosition } from './types';

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    ({ open, anchorElement, getPortalContainer, ...restProps }, ref) => {
        if (!open || !anchorElement) return null;

        const container = getPortalContainer
            ? getPortalContainer()
            : anchorElement.ownerDocument.body;

        return container
            ? createPortal(
                  <PopoverSurface {...restProps} anchorElement={anchorElement} ref={ref} />,
                  container
              )
            : null;
    }
);

Popover.displayName = 'Popover';
