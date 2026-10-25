import { forwardRef, useCallback, useLayoutEffect, useState } from 'react';

import { Portal } from '../Portal';

import { SidepanelSurface } from './components/sidepanel-surface';
import type { SidepanelProps } from './types';

export const Sidepanel = forwardRef<HTMLDialogElement, SidepanelProps>(
    ({ open, onExited, getPortalContainer, ...restProps }, ref) => {
        const [mounted, setMounted] = useState(open);

        useLayoutEffect(() => {
            if (open) setMounted(true);
        }, [open]);

        const handleExited = useCallback(() => {
            setMounted(false);
            onExited?.();
        }, [onExited]);

        return mounted ? (
            <Portal getPortalContainer={getPortalContainer}>
                <SidepanelSurface {...restProps} ref={ref} open={open} onExited={handleExited} />
            </Portal>
        ) : null;
    }
);

Sidepanel.displayName = 'Sidepanel';
