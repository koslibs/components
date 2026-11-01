import { useLayoutEffect, useRef, useState } from 'react';

import { LAST_MONTH } from '../utils/date-utils';
import {
    measureMonths,
    offsetFor,
    positionAt,
    type MonthGeometry,
    type MonthPosition,
} from '../utils/range-scroll-geometry';

const CALENDAR_BUFFER = 12;
const MONTH_BUFFER = 36;

const calendarStartFor = (month: number) =>
    Math.max(0, Math.min(LAST_MONTH - CALENDAR_BUFFER + 1, month - 6));

const monthStartFor = (month: number) =>
    Math.max(0, Math.min(LAST_MONTH - MONTH_BUFFER + 1, month - 12));

type Anchor = { month: number; offset: number };
type ScrollGeometry = { calendar: MonthGeometry; months: MonthGeometry };

function setScroll(viewport: HTMLElement, offset: number) {
    viewport.scrollTop = Math.max(
        0,
        Math.min(offset, viewport.scrollHeight - viewport.clientHeight)
    );
}

export function useRangeScroll(month: number, navigationVersion: number) {
    const [calendarStart, setCalendarStart] = useState(() => calendarStartFor(month));
    const [monthStart, setMonthStart] = useState(() => monthStartFor(month));
    const [visible, setVisible] = useState({ first: month, last: month + 1 });
    const calendarRef = useRef<HTMLDivElement>(null);
    const monthsRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const calendarElements = useRef(new Map<number, HTMLElement>());
    const monthElements = useRef(new Map<number, HTMLElement>());
    const navigation = useRef('');
    const pendingPosition = useRef<MonthPosition | null>(null);
    const monthAnchor = useRef<Anchor | null>(null);
    const calendarTop = useRef(0);
    const monthsTop = useRef(0);
    const windowTop = useRef(0);

    function readGeometry(): ScrollGeometry | null {
        const viewport = calendarRef.current;
        const list = monthsRef.current;

        return viewport && list
            ? {
                  calendar: measureMonths(calendarElements.current),
                  months: measureMonths(monthElements.current),
              }
            : null;
    }

    function cancelPendingSeek() {
        if (!pendingPosition.current) return;

        pendingPosition.current = null;
        // A newer input uses the rendered buffer, cancelling an earlier queued replacement.
        setCalendarStart(calendarStart);
    }

    function recenterMonthList(target: number, months: MonthGeometry) {
        const list = monthsRef.current;
        const targetStart = monthStartFor(target);

        if (!list || targetStart === monthStart) return false;

        const anchor = months.find((row) => row.month === target);

        monthAnchor.current = anchor
            ? { month: target, offset: anchor.start - list.scrollTop }
            : null;
        setMonthStart(targetStart);

        return true;
    }

    function syncFromCalendar(geometry = readGeometry()) {
        const viewport = calendarRef.current;
        const list = monthsRef.current;
        const indicator = windowRef.current;

        if (!viewport || !list || !indicator || !geometry) return;

        calendarTop.current = viewport.scrollTop;

        const children = geometry.calendar;
        const first =
            children.find((child) => child.contentEnd > viewport.scrollTop + 1) ??
            children[children.length - 1];
        const last =
            children.findLast(
                (child) => child.start < viewport.scrollTop + viewport.clientHeight - 1
            ) ?? first;

        if (first && last && viewport.clientHeight) {
            const next = {
                first: first.month,
                last: last.month,
            };

            setVisible((current) =>
                current.first === next.first && current.last === next.last ? current : next
            );
        }

        const start = positionAt(children, viewport.scrollTop);
        const end = positionAt(children, viewport.scrollTop + viewport.clientHeight);

        if (!start || !end) return;

        const top = offsetFor(geometry.months, start);
        const bottom = offsetFor(geometry.months, end);

        if (top === null || bottom === null) {
            recenterMonthList(start.month, geometry.months);

            return;
        }

        // Move only the indicator per pixel; React updates the calendar at month boundaries.
        indicator.style.top = top + 'px';
        indicator.style.height = Math.max(0, bottom - top) + 'px';
        windowTop.current = top;

        const centeredTop = (top + bottom - list.clientHeight) / 2;

        if (
            (centeredTop < 0 || centeredTop > list.scrollHeight - list.clientHeight) &&
            recenterMonthList(start.month, geometry.months)
        )
            return;

        setScroll(list, centeredTop);
        // Programmatic scroll events must not feed back into the other viewport.
        monthsTop.current = list.scrollTop;
    }

    useLayoutEffect(() => {
        const viewport = calendarRef.current;
        const list = monthsRef.current;

        if (!viewport || !list) return;

        const key = month + ':' + navigationVersion;

        if (navigation.current !== key) {
            navigation.current = key;
            pendingPosition.current = { month, fraction: 0 };

            const targetStart = calendarStartFor(month);

            if (targetStart !== calendarStart) {
                setCalendarStart(targetStart);

                return;
            }
        }

        const geometry = readGeometry();

        if (!geometry) return;
        if (monthAnchor.current) {
            const { month: anchorMonth, offset } = monthAnchor.current;
            const anchor = geometry.months.find((row) => row.month === anchorMonth);

            if (anchor) setScroll(list, anchor.start - offset);

            monthAnchor.current = null;
            monthsTop.current = list.scrollTop;
        }
        if (pendingPosition.current) {
            const target = offsetFor(geometry.calendar, pendingPosition.current);

            if (target === null) {
                setCalendarStart(calendarStartFor(pendingPosition.current.month));

                return;
            }

            setScroll(viewport, target);
            pendingPosition.current = null;
        }

        syncFromCalendar(geometry);
    }, [month, navigationVersion, calendarStart, monthStart]);

    useLayoutEffect(() => {
        const viewport = calendarRef.current;
        const list = monthsRef.current;

        if (!viewport || !list) return;

        const resize = () => syncFromCalendar();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(resize);

            observer.observe(viewport);
            observer.observe(list);

            return () => observer.disconnect();
        }

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, [calendarStart, monthStart]);

    function recycleCalendar(geometry: MonthGeometry) {
        const viewport = calendarRef.current;

        if (!viewport) return;

        const first = positionAt(geometry, viewport.scrollTop);
        const last = positionAt(geometry, viewport.scrollTop + viewport.clientHeight);

        if (!first || !last) return;

        let start = calendarStart;

        if (first.month <= calendarStart + 1 && calendarStart > 0)
            start = Math.max(0, calendarStart - 4);
        else if (
            last.month >= calendarStart + CALENDAR_BUFFER - 2 &&
            calendarStart + CALENDAR_BUFFER <= LAST_MONTH
        )
            start = Math.min(LAST_MONTH - CALENDAR_BUFFER + 1, calendarStart + 4);
        if (start !== calendarStart) {
            pendingPosition.current = first;
            setCalendarStart(start);
        }
    }

    function calendarScroll() {
        const viewport = calendarRef.current;

        if (!viewport || viewport.scrollTop === calendarTop.current) return;

        cancelPendingSeek();

        const geometry = readGeometry();

        if (!geometry) return;

        syncFromCalendar(geometry);
        recycleCalendar(geometry.calendar);
    }

    function monthsScroll() {
        const list = monthsRef.current;
        const viewport = calendarRef.current;

        if (!list || !viewport) return;

        const delta = list.scrollTop - monthsTop.current;

        monthsTop.current = list.scrollTop;

        if (!delta) return;

        const geometry = readGeometry();

        if (!geometry) return;
        if (monthAnchor.current) monthAnchor.current.offset -= delta;

        const base = pendingPosition.current
            ? (offsetFor(geometry.months, pendingPosition.current) ?? windowTop.current)
            : windowTop.current;
        const target = positionAt(geometry.months, base + delta);

        if (target) {
            const offset = offsetFor(geometry.calendar, target);
            const targetStart = calendarStartFor(target.month);

            if (
                offset === null ||
                (offset + viewport.clientHeight > viewport.scrollHeight &&
                    targetStart !== calendarStart)
            ) {
                pendingPosition.current = target;
                setCalendarStart(targetStart);
            } else {
                cancelPendingSeek();
                setScroll(viewport, offset);
                syncFromCalendar(geometry);
                recycleCalendar(geometry.calendar);
            }
        }

        let start = monthStart;

        if (list.scrollTop < 72 && monthStart > 0) start = Math.max(0, monthStart - 12);
        else if (
            list.scrollTop + list.clientHeight >= list.scrollHeight - 72 &&
            monthStart + MONTH_BUFFER <= LAST_MONTH
        )
            start = Math.min(LAST_MONTH - MONTH_BUFFER + 1, monthStart + 12);
        if (start === monthStart) return;

        const anchor = geometry.months.find((row) => row.month === Math.max(start, monthStart));

        if (anchor)
            monthAnchor.current = {
                month: anchor.month,
                offset: anchor.start - list.scrollTop,
            };

        setMonthStart(start);
    }

    return {
        calendarRef,
        monthsRef,
        windowRef,

        registerCalendarMonth(monthIndex: number, element: HTMLDivElement | null) {
            if (element) calendarElements.current.set(monthIndex, element);
            else calendarElements.current.delete(monthIndex);
        },

        registerMonth(monthIndex: number, element: HTMLButtonElement | null) {
            if (element) monthElements.current.set(monthIndex, element);
            else monthElements.current.delete(monthIndex);
        },

        visible,
        calendarScroll,
        monthsScroll,
        calendars: Array.from({ length: CALENDAR_BUFFER }, (_, index) => calendarStart + index),
        months: Array.from({ length: MONTH_BUFFER }, (_, index) => monthStart + index),
    };
}
