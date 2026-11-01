import { useState, type MouseEvent } from 'react';

import type { DatepickerRange, DatepickerValueProps } from '../types';
import { normalizeValue } from '../utils/date-utils';

export function useDatepickerValue(props: DatepickerValueProps) {
    const mode = props.mode ?? 'single';
    const controlled = props.value !== undefined;

    const [localValue, setLocalValue] = useState(() => normalizeValue(mode, props.defaultValue));

    const value = normalizeValue(mode, controlled ? props.value : localValue);

    return {
        value,

        commit(event: MouseEvent<HTMLButtonElement>, next: string | DatepickerRange | null) {
            const normalized = normalizeValue(mode, next);

            if (!normalized) return false;
            if (!controlled) setLocalValue(normalized);
            if (props.mode === 'range') {
                if (typeof normalized === 'object') props.onChange?.(event, { value: normalized });
            } else if (typeof normalized === 'string')
                props.onChange?.(event, { value: normalized });

            return true;
        },

        clear() {
            if (!controlled) setLocalValue(null);
        },

        reset() {
            if (!controlled) setLocalValue(normalizeValue(mode, props.defaultValue));
        },
    };
}
