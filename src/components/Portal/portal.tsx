import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';

import type { PortalProps } from './types';

function getBody() {
    return typeof document === 'undefined' ? null : document.body;
}

export const Portal = forwardRef<Element | null, PortalProps>(
    ({ children, getPortalContainer = getBody, immediateMount = true }, ref) => {
        const [deferredContainer, setDeferredContainer] = useState<Element | null>(null);

        let container = deferredContainer;

        if (immediateMount) {
            container = typeof document === 'undefined' ? null : (getPortalContainer() ?? null);
        }

        // Resolve after every commit: an unchanged callback can read an updated DOM ref.
        useEffect(() => {
            if (!immediateMount) setDeferredContainer(getPortalContainer() ?? null);
        });

        useImperativeHandle<Element | null, Element | null>(ref, () => container, [container]);

        return container ? createPortal(children, container) : null;
    }
);

Portal.displayName = 'Portal';
