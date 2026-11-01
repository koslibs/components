import { useEffect, useState } from 'react';

import type { DatepickerRange } from '../types';
import {
    clampMonth,
    countDays,
    getMonthIndex,
    normalizeValue,
    parseDate,
    today,
} from '../utils/date-utils';

export function useDatepickerDraft(
    mode: 'single' | 'range',
    committed: string | DatepickerRange | null
) {
    const from = typeof committed === 'string' ? committed : (committed?.from ?? '');
    const to = typeof committed === 'object' ? (committed?.to ?? '') : '';

    const [draft, setDraft] = useState({ from, to });
    const [preview, setPreview] = useState<string | null>(null);
    const [month, setMonth] = useState(() =>
        clampMonth(getMonthIndex(from || today()), mode === 'range')
    );
    const [touched, setTouched] = useState({ from: false, to: false });
    const [navigationVersion, setNavigationVersion] = useState(0);

    // Depend on date strings, not caller object identity: a repeated value is not a reset.
    useEffect(() => {
        setDraft({ from, to });
        setTouched({ from: false, to: false });
        setPreview(null);
        setMonth(clampMonth(getMonthIndex(from || today()), mode === 'range'));
        setNavigationVersion((current) => current + 1);
    }, [from, to, mode]);

    const value = normalizeValue(mode, mode === 'single' ? draft.from : draft);
    let toError: string | undefined;

    if (touched.to && (!draft.to || !parseDate(draft.to)))
        toError = 'Enter a valid date (YYYY-MM-DD)';
    else if (parseDate(draft.from) && parseDate(draft.to) && draft.to < draft.from)
        toError = 'End date must not precede start date';

    const errors = {
        from:
            touched.from && (!draft.from || !parseDate(draft.from))
                ? 'Enter a valid date (YYYY-MM-DD)'
                : undefined,
        to: toError,
    };

    function navigate(index: number) {
        setMonth(clampMonth(index, mode === 'range'));
        setNavigationVersion((current) => current + 1);
    }

    function reset() {
        setDraft({ from, to });
        setPreview(null);
        setTouched({ from: false, to: false });
        navigate(getMonthIndex(from || today()));
    }

    function input(field: 'from' | 'to', text: string) {
        setDraft((current) => ({ ...current, [field]: text }));
        setTouched((current) => ({ ...current, [field]: true }));
        setPreview(null);

        if (parseDate(text)) navigate(getMonthIndex(text));
    }

    function select(date: string) {
        if (mode === 'single' || !parseDate(draft.from) || value || date < draft.from)
            setDraft({ from: date, to: '' });
        else setDraft({ from: draft.from, to: date });

        setTouched({ from: false, to: false });
        setPreview(null);
    }

    let count = 0;

    if (typeof value === 'string') count = 1;
    else if (value) count = countDays(value.from, value.to);

    return {
        draft,
        value,
        errors,
        month,
        navigationVersion,
        preview,
        navigate,
        reset,
        input,
        select,
        count,

        hover(date: string | null) {
            setPreview(
                mode === 'range' && parseDate(draft.from) && !value && date && date >= draft.from
                    ? date
                    : null
            );
        },
    };
}

export type DatepickerDraft = ReturnType<typeof useDatepickerDraft>;
