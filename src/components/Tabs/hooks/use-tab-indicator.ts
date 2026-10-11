import { useLayoutEffect, useRef, type MutableRefObject, type RefObject } from 'react';

import type { TabProps, TabsProps } from '../types';

type TabIndicatorOptions = {
    selectedId?: string;
    items: readonly TabProps[];
    size: NonNullable<TabsProps['size']>;
    listRef: RefObject<HTMLDivElement>;
    buttons: MutableRefObject<Map<string, HTMLButtonElement>>;
};

export function useTabIndicator({
    selectedId,
    items,
    size,
    listRef,
    buttons,
}: TabIndicatorOptions) {
    const indicatorRef = useRef<HTMLDivElement>(null);
    const indicatorPosition = useRef<{
        id: string;
        left: number;
        width: number;
        element: HTMLDivElement;
    }>();

    useLayoutEffect(() => {
        const list = listRef.current;
        const indicator = indicatorRef.current;
        const button = selectedId !== undefined ? buttons.current.get(selectedId) : undefined;
        if (!list || !indicator || !button || selectedId === undefined) {
            indicatorPosition.current = undefined;
            return;
        }
        const updateIndicator = () => {
            const left = button.offsetLeft;
            const width = button.offsetWidth;
            const previous = indicatorPosition.current;
            if (
                previous?.element === indicator &&
                previous.id === selectedId &&
                previous.left === left &&
                previous.width === width
            )
                return;
            // Place the initial indicator and layout corrections immediately.
            // Repeated observer notifications must not interrupt an active transition.
            indicator.style.transition =
                previous?.element === indicator && previous.id !== selectedId ? '' : 'none';
            indicator.style.width = `${width}px`;
            indicator.style.transform = `translateX(${left}px)`;
            indicatorPosition.current = { id: selectedId, left, width, element: indicator };
        };
        updateIndicator();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(updateIndicator);
        observer.observe(list);
        // Earlier titles can move the selected tab without changing its width.
        for (const tab of buttons.current.values()) observer.observe(tab);
        return () => observer.disconnect();
    }, [items, selectedId, size, listRef, buttons]);

    return indicatorRef;
}
