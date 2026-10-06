import { createPopper, type Modifier } from '@popperjs/core';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import type { PopoverPosition } from './types';

type PositionState = {
    styles: CSSProperties;
    attributes: Record<string, string | boolean>;
};

const initialState: PositionState = {
    styles: { position: 'fixed', left: 0, top: 0, visibility: 'hidden' },
    attributes: {},
};

// React owns styles and attributes; Popper only computes them. This also keeps
// caller styles intact when modifiers change or StrictMode remounts effects.
export function usePopoverPosition(
    anchorElement: HTMLElement,
    popperElement: HTMLDivElement | null,
    position: PopoverPosition,
    modifiers: Partial<Modifier<string, object>>[]
) {
    const [state, setState] = useState(initialState);
    const instanceRef = useRef<ReturnType<typeof createPopper> | null>(null);
    const updateState = useMemo<Modifier<'reactStyles', object>>(
        () => ({
            name: 'reactStyles',
            enabled: true,
            phase: 'write',
            requires: ['computeStyles'],
            fn: ({ state: popperState }) => {
                setState({
                    styles: { ...popperState.styles.popper } as CSSProperties,
                    attributes: { ...popperState.attributes.popper },
                });
            },
        }),
        []
    );

    useEffect(() => {
        if (!popperElement) return;

        let active = true;
        setState(initialState);
        const instance = createPopper(anchorElement, popperElement, {
            placement: position,
            strategy: 'fixed',
            modifiers: [
                ...modifiers,
                {
                    ...updateState,
                    fn: (args) => {
                        if (active) updateState.fn(args);
                    },
                },
                { name: 'applyStyles', enabled: false },
            ],
        });
        instanceRef.current = instance;

        const ResizeObserverClass = anchorElement.ownerDocument.defaultView?.ResizeObserver;
        const observer = ResizeObserverClass
            ? new ResizeObserverClass(() => void instance.update())
            : undefined;
        observer?.observe(anchorElement);
        observer?.observe(popperElement);

        return () => {
            active = false;
            observer?.disconnect();
            instance.destroy();
            instanceRef.current = null;
        };
    }, [anchorElement, popperElement, position, modifiers, updateState]);

    const update = useCallback(() => instanceRef.current?.update(), []);
    return { ...state, update };
}
