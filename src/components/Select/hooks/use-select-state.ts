import { useEffect, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent } from 'react';

import type { SelectChangeEvent, SelectOption, SelectProps } from '../types';

function toIds(value: SelectProps['value']): string[] {
    return [...new Set(typeof value === 'string' ? [value] : (value ?? []))];
}

export function useSelectState(props: SelectProps) {
    const [localIds, setLocalIds] = useState(() => toIds(props.defaultValue));
    const [localOpen, setLocalOpen] = useState(props.defaultOpen ?? false);
    const [search, setSearch] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const retainedOptions = useRef(new Map<string, SelectOption>());
    const ids = props.value === undefined ? localIds : toIds(props.value);
    const selectedIds = props.multiple ? ids : ids.slice(0, 1);
    const optionMap = new Map(props.options.map((option) => [option.id, option]));
    const resolve = (id: string) =>
        optionMap.get(id) ?? retainedOptions.current.get(id) ?? { id, label: id };
    const selectedOptions = selectedIds.map(resolve);
    const blocked = props.disabled || props.readOnly;
    const open = !blocked && (props.open ?? localOpen);
    const query = props.searchable ? search.trim().toLocaleLowerCase() : '';
    const options = props.options.filter(
        (option) => !query || option.label.toLocaleLowerCase().includes(query)
    );

    useEffect(() => {
        retainedOptions.current = new Map(selectedOptions.map((option) => [option.id, option]));
    });

    useEffect(() => {
        if (!open) setSearch('');
    }, [open]);

    const resetRef = useRef<VoidFunction>();
    resetRef.current = () => {
        if (props.value === undefined) setLocalIds(toIds(props.defaultValue));
        if (props.open === undefined) setLocalOpen(false);
        setSearch('');
    };
    useEffect(() => {
        const form = buttonRef.current?.form;
        let active = true;
        const handleReset = (event: Event) => {
            queueMicrotask(() => {
                if (active && !event.defaultPrevented) resetRef.current?.();
            });
        };
        form?.addEventListener('reset', handleReset);
        return () => {
            active = false;
            form?.removeEventListener('reset', handleReset);
        };
    }, [props.form]);

    function setOpen(next: boolean) {
        if (next && blocked) return;
        if (props.open === undefined) setLocalOpen(next);
        if (next !== open) props.onOpenChange?.(next);
    }

    function select(option: SelectOption, event: SelectChangeEvent) {
        if (blocked || option.disabled) return;
        let nextIds = [option.id];
        if (props.multiple) {
            nextIds = selectedIds.includes(option.id)
                ? selectedIds.filter((id) => id !== option.id)
                : [...selectedIds, option.id];
        }
        if (props.value === undefined) setLocalIds(nextIds);
        if (props.multiple || selectedIds[0] !== option.id) {
            const nextOptions = nextIds.map(resolve);
            if (props.multiple)
                props.onChange?.(event, { value: nextIds, selectedOptions: nextOptions });
            else props.onChange?.(event, { value: option.id, selectedOptions: nextOptions });
        }
        if (!props.multiple) {
            setOpen(false);
            buttonRef.current?.focus();
        }
    }

    function close() {
        const restoreFocus = popupRef.current?.contains(
            buttonRef.current?.ownerDocument.activeElement ?? null
        );
        setOpen(false);
        if (restoreFocus) buttonRef.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (event.defaultPrevented || blocked) return;
        const { key } = event;
        if (key === 'Tab') {
            if (open) setOpen(false);
            return;
        }
        const available = options.filter((option) => !option.disabled);
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
            if (['Home', 'End'].includes(key) && (!open || event.currentTarget.tagName === 'INPUT'))
                return;
            event.preventDefault();
            setOpen(true);
            const current = available.findIndex((option) => option.id === activeId);
            let next = current <= 0 ? available.length - 1 : current - 1;
            if (key === 'Home') next = 0;
            if (key === 'End') next = available.length - 1;
            if (key === 'ArrowDown') next = (current + 1) % available.length;
            setActiveId(available[next]?.id ?? null);
        } else if (key === 'Enter' && open) {
            event.preventDefault();
            const active = available.find((option) => option.id === activeId);
            if (active) select(active, event);
        }
    }

    const triggerProps: ButtonHTMLAttributes<HTMLButtonElement> = {
        onFocus(event) {
            setFocused(true);
            props.onFocus?.(event);
        },
        onBlur(event) {
            setFocused(false);
            props.onBlur?.(event);
        },
        onClick(event) {
            props.onClick?.(event);
            if (event.defaultPrevented || blocked) return;
            setActiveId(null);
            setOpen(!open);
        },
        onKeyDown(event) {
            props.onKeyDown?.(event);
            handleKeyDown(event);
        },
    };

    return {
        options,
        selectedIds,
        selectedOptions,
        search,
        open,
        blocked,
        activeId: open ? activeId : null,
        raisedLabel: selectedIds.length > 0 || open || (focused && !blocked),
        buttonRef,
        popupRef,
        anchor,
        setAnchor,
        triggerProps,
        close,
        select,
        handleKeyDown,
        setSearch(value: string) {
            setActiveId(null);
            setSearch(value);
        },
        clear(event: Parameters<NonNullable<SelectProps['onClear']>>[0]) {
            if (props.value === undefined) setLocalIds([]);
            props.onClear?.(event);
            buttonRef.current?.focus();
        },
    };
}

export type SelectState = ReturnType<typeof useSelectState>;
