import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import type { ChipsProps } from '../types';
import { normalizeValue } from '../utils/normalize-value';

export function useChipsState(props: ChipsProps) {
    const { items, multiselect = false, defaultValue } = props;
    const controlled = props.value !== undefined;
    const groupRef = useRef<HTMLFieldSetElement>(null);
    const [localValue, setLocalValue] = useState(defaultValue);
    const value = normalizeValue(items, multiselect, controlled ? props.value : localValue);
    const selected = new Set(
        Array.isArray(value) ? value : [value].filter((item) => item !== null)
    );

    useEffect(() => {
        const form = groupRef.current?.form;
        let active = true;

        const handleReset = (event: Event) => {
            queueMicrotask(() => {
                if (active && !event.defaultPrevented && !controlled) setLocalValue(defaultValue);
            });
        };

        form?.addEventListener('reset', handleReset);

        return () => {
            active = false;
            form?.removeEventListener('reset', handleReset);
        };
    }, [props.form, controlled, defaultValue]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const item = items.find((candidate) => candidate.value === event.currentTarget.value);

        if (props.disabled || !item || item.disabled) return;

        if (props.multiselect) {
            const current = Array.isArray(value) ? value : [];
            const next = event.currentTarget.checked
                ? [...current, item.value]
                : current.filter((candidate) => candidate !== item.value);

            if (!controlled) setLocalValue(next);
            props.onChange?.(event, { value: next });
        } else if (value !== item.value) {
            if (!controlled) setLocalValue(item.value);
            props.onChange?.(event, { value: item.value });
        }
    };

    return { groupRef, selected, handleChange };
}
