import type { ChipsItem } from '../types';

export function normalizeValue(
    items: readonly ChipsItem[],
    multiselect: boolean,
    value: unknown
): string | string[] | null {
    const available = new Set(items.map((item) => item.value));

    if (!multiselect) return typeof value === 'string' && available.has(value) ? value : null;
    if (!Array.isArray(value)) return [];

    return [
        ...new Set(
            value.filter((item): item is string => typeof item === 'string' && available.has(item))
        ),
    ];
}
