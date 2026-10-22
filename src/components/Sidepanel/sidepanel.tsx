import { forwardRef, useCallback, useLayoutEffect, useState } from 'react';

import { Portal } from '../Portal';

import { SidepanelSurface } from './components/sidepanel-surface';
import type { SidepanelProps } from './types';

export const Sidepanel = forwardRef<HTMLDialogElement, SidepanelProps>(
    ({ open, getPortalContainer, ...restProps }, ref) => {
        const [mounted, setMounted] = useState(open);

        useLayoutEffect(() => {
            if (open) setMounted(true);
        }, [open]);

        const handleExited = useCallback(() => {
            if (!open) setMounted(false);
        }, [open]);

        return mounted ? (
            <Portal getPortalContainer={getPortalContainer}>
                <SidepanelSurface {...restProps} ref={ref} open={open} onExited={handleExited} />
            </Portal>
        ) : null;
    }
);

Sidepanel.displayName = 'Sidepanel';
