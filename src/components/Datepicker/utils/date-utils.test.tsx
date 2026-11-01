import { expect, test } from '@koslibs/builder/rstest';

import {
    countDays,
    formatDate,
    getMonthDays,
    getMonthIndex,
    normalizeValue,
    parseDate,
} from './date-utils';

test('strict calendar dates include early years and leap centuries', () => {
    for (const value of ['2028-02-29', '2000-02-29', '0001-01-01', '0099-12-31', '9999-12-31'])
        expect(parseDate(value)).not.toBeNull();
    for (const value of [
        '2026-02-29',
        '1900-02-29',
        '0000-01-01',
        '10000-01-01',
        '2026-2-01',
        '2026-04-31',
        '2026-13-01',
        '2026-00-01',
        '2026-01-00',
        '2026-01-01T00:00:00Z',
        '2026-10-25\n',
        '2026-10-25\r',
    ])
        expect(parseDate(value)).toBeNull();
});

test('month grids contain whole Monday-first weeks without leaking adjacent dates', () => {
    expect(formatDate('2026-10-25')).toBe('25/10/2026');
    expect(getMonthIndex('0001-01-01')).toBe(0);

    const days = getMonthDays(getMonthIndex('2026-10-25'));

    expect(days).toHaveLength(35);
    expect(days.slice(0, 4)).toEqual([null, null, null, '2026-10-01']);
    expect(days.slice(-2)).toEqual(['2026-10-31', null]);
    expect(getMonthDays(0)[0]).toBe('0001-01-01');
    expect(getMonthDays(getMonthIndex('9999-12-01')).filter(Boolean).at(-1)).toBe('9999-12-31');
});

test('inclusive day counts cross years and daylight saving changes', () => {
    expect(countDays('2026-12-28', '2027-01-04')).toBe(8);
    expect(countDays('2026-03-28', '2026-03-30')).toBe(3);
    expect(countDays('0001-01-01', '0001-01-01')).toBe(1);
});

test('invalid external values normalize to empty without rolling dates forward', () => {
    expect(normalizeValue('single', '2026-02-30')).toBeNull();
    expect(normalizeValue('single', 123)).toBeNull();
    expect(normalizeValue('single', '2026-10-25')).toBe('2026-10-25');
    expect(normalizeValue('range', { from: '2026-10-25' })).toBeNull();
    expect(normalizeValue('range', { from: '2026-10-25', to: '2026-10-24' })).toBeNull();
    expect(normalizeValue('range', { from: '2026-10-25', to: '2026-10-25' })).toEqual({
        from: '2026-10-25',
        to: '2026-10-25',
    });
});
