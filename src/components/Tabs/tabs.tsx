import cn from 'classnames';
import {
    Children,
    Fragment,
    forwardRef,
    isValidElement,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';

import { TabsContext } from './context';
import { useTabIndicator } from './hooks/use-tab-indicator';
import { Tab } from './tab';
import type { TabProps, TabsProps } from './types';

import styles from './index.module.css';

function collectTabs(children: ReactNode): TabProps[] {
    const items: TabProps[] = [];
    const ids = new Set<string>();
    const collect = (nodes: ReactNode) => {
        Children.forEach(nodes, (child) => {
            if (child === null || child === undefined || typeof child === 'boolean') return;
            if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
                collect(child.props.children);
                return;
            }
            if (!isValidElement<TabProps>(child) || child.type !== Tab) {
                throw new Error('Tabs accepts only Tab elements and Fragments.');
            }
            if (ids.has(child.props.id)) {
                throw new Error(`Tabs requires unique Tab ids: "${child.props.id}" is duplicated.`);
            }
            ids.add(child.props.id);
            items.push(child.props);
        });
    };
    collect(children);
    return items;
}

function resolveValue(
    items: readonly TabProps[],
    value: string | undefined,
    previous: { items: readonly TabProps[]; value?: string }
) {
    const index = items.findIndex((item) => item.id === value);
    if (index >= 0 && !items[index].disabled) return value;
    if (index < 0) {
        const previousIndex = previous.items.findIndex((item) => item.id === value);
        if (previousIndex >= 0) {
            const neighbors = [
                ...previous.items.slice(previousIndex + 1),
                ...previous.items.slice(0, previousIndex).reverse(),
            ];
            const neighbor = neighbors.find((candidate) =>
                items.some((item) => item.id === candidate.id && !item.disabled)
            );
            if (neighbor) return neighbor.id;
        }
        if (items.some((item) => item.id === previous.value && !item.disabled)) {
            return previous.value;
        }
    }
    const start = Math.max(0, index);
    return (
        items.slice(start).find((item) => !item.disabled)?.id ??
        items
            .slice(0, start)
            .reverse()
            .find((item) => !item.disabled)?.id
    );
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
    (
        {
            children,
            selectedId,
            defaultSelectedId,
            onChange,
            size = 40,
            emptyState,
            listClassName,
            dataTestId,
            className,
            ...restProps
        },
        ref
    ) => {
        const getDataTestId = useDataTestId(dataTestId);
        const items = useMemo(() => collectTabs(children), [children]);
        const [internalValue, setInternalValue] = useState(defaultSelectedId);
        const previousSelection = useRef<{ items: readonly TabProps[]; value?: string }>({ items });
        const selectedValue = resolveValue(
            items,
            selectedId ?? internalValue,
            previousSelection.current
        );
        const listRef = useRef<HTMLDivElement>(null);
        const buttons = useRef(new Map<string, HTMLButtonElement>());

        useLayoutEffect(() => {
            previousSelection.current = { items, value: selectedValue };
            if (selectedId === undefined && internalValue !== selectedValue) {
                setInternalValue(selectedValue);
            }
        }, [items, selectedValue, selectedId, internalValue]);

        const indicatorRef = useTabIndicator({
            selectedId: selectedValue,
            items,
            size,
            listRef,
            buttons,
        });

        const select = (id: string, event: Parameters<NonNullable<TabsProps['onChange']>>[0]) => {
            if (id === selectedValue) return;
            if (selectedId === undefined) setInternalValue(id);
            onChange?.(event, { selectedId: id });
        };

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, className)}
                data-test-id={dataTestId}
            >
                {selectedValue === undefined ? (
                    emptyState
                ) : (
                    <TabsContext.Provider
                        value={{
                            selectedId: selectedValue,
                            size,
                            dataTestId,
                            registerTab: (id, button) => {
                                if (button) buttons.current.set(id, button);
                                else buttons.current.delete(id);
                            },
                            selectTab: select,
                        }}
                    >
                        <div
                            ref={listRef}
                            className={cn(styles.list, listClassName)}
                            data-test-id={getDataTestId('list')}
                        >
                            {items.map((item) => (
                                <Tab key={item.id} {...item} />
                            ))}
                            <div
                                ref={indicatorRef}
                                className={styles.indicator}
                                data-test-id={getDataTestId('indicator')}
                            />
                        </div>
                    </TabsContext.Provider>
                )}
            </div>
        );
    }
);

Tabs.displayName = 'Tabs';
