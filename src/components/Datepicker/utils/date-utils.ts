import type { DatepickerRange } from '../types';

export const LAST_MONTH = 9999 * 12 - 1;
export const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function daysInMonth(year: number, month: number) {
    if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;

    return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseDate(value: string): { year: number; month: number; day: number } | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

    const [year, month, day] = value.split('-').map(Number);

    return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)
        ? { year, month, day }
        : null;
}

function ordinal(value: string) {
    const { year, month, day } = parseDate(value)!;
    const date = new Date(0);

    date.setUTCFullYear(year, month - 1, day);

    return date.getTime() / 86400000;
}

export function formatDate(value: string): string {
    return value.split('-').reverse().join('/');
}

export function getMonthIndex(value: string): number {
    const { year, month } = parseDate(value)!;

    return (year - 1) * 12 + month - 1;
}

export function monthDate(monthIndex: number, day = 1): string {
    return `${String(Math.floor(monthIndex / 12) + 1).padStart(4, '0')}-${String((monthIndex % 12) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function monthLabel(monthIndex: number): string {
    return `${MONTH_NAMES[monthIndex % 12]} ${Math.floor(monthIndex / 12) + 1}`;
}

export function clampMonth(monthIndex: number, range = false): number {
    return Math.min(LAST_MONTH - Number(range), Math.max(0, monthIndex));
}

export function getMonthDays(monthIndex: number): (string | null)[] {
    const first = monthDate(monthIndex);
    // 0001-01-01 was Monday; Gregorian calendar arithmetic is timezone independent.
    const offset = (((ordinal(first) + 3) % 7) + 7) % 7;
    const length = daysInMonth(Math.floor(monthIndex / 12) + 1, (monthIndex % 12) + 1);

    return Array.from({ length: Math.ceil((offset + length) / 7) * 7 }, (_, index) =>
        index < offset || index >= offset + length
            ? null
            : monthDate(monthIndex, index - offset + 1)
    );
}

export function countDays(from: string, to: string): number {
    return ordinal(to) - ordinal(from) + 1;
}

export function today(): string {
    const date = new Date();

    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function normalizeValue(
    mode: 'single' | 'range',
    value: unknown
): string | DatepickerRange | null {
    if (mode === 'single') return typeof value === 'string' && parseDate(value) ? value : null;
    if (!value || typeof value !== 'object') return null;

    const { from, to } = value as DatepickerRange;

    return typeof from === 'string' &&
        typeof to === 'string' &&
        parseDate(from) &&
        parseDate(to) &&
        from <= to
        ? { from, to }
        : null;
}
