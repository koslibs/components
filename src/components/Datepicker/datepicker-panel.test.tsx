import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { DatepickerPanel } from './datepicker-panel';
import { getMonthIndex, MONTH_NAMES, today } from './utils/date-utils';

import styles from './panel.module.css';

let container: HTMLDivElement;
let root: Root;
let calendarHeights: Record<number, number>;
const nativeOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop')!;
const nativeOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')!;
const nativeClientHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!;
const nativeScrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight')!;

function rowMonth(row: HTMLElement) {
    return getMonthIndex(row.querySelector<HTMLButtonElement>('button')!.title);
}

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    calendarHeights = {};
    // jsdom has no layout: use deliberately uniform 200px months to test pixel anchoring.
    Object.defineProperties(HTMLElement.prototype, {
        offsetTop: {
            configurable: true,

            get() {
                if (this.classList.contains(styles.monthBlock)) {
                    const first = rowMonth(this.parentElement.firstElementChild);
                    let top = 0;

                    for (let month = first; month < rowMonth(this); month += 1)
                        top += calendarHeights[month] ?? 200;

                    return top;
                }
                if (this.classList.contains(styles.monthButton)) {
                    let top = 8;

                    for (const child of this.parentElement.children) {
                        if (child === this) break;
                        if (child.classList.contains(styles.monthButton)) top += 36;
                        else if (!child.classList.contains(styles.monthWindow)) top += 18;
                    }

                    return top;
                }

                return nativeOffsetTop.get!.call(this);
            },
        },
        offsetHeight: {
            configurable: true,

            get() {
                if (this.classList.contains(styles.monthBlock))
                    return calendarHeights[rowMonth(this)] ?? 200;
                if (this.classList.contains(styles.monthButton)) return 36;

                return nativeOffsetHeight.get!.call(this);
            },
        },
        clientHeight: {
            configurable: true,

            get() {
                if (this.classList.contains(styles.calendarMonths)) return 400;
                if (this.classList.contains(styles.months)) return 420;

                return nativeClientHeight.get!.call(this);
            },
        },
        scrollHeight: {
            configurable: true,

            get() {
                if (this.classList.contains(styles.calendarMonths))
                    return Array.from<HTMLElement>(this.children).reduce(
                        (sum, child) => sum + child.offsetHeight,
                        0
                    );
                if (this.classList.contains(styles.months))
                    return (
                        16 +
                        Array.from<Element>(this.children).reduce((sum, child) => {
                            if (child.classList.contains(styles.monthButton)) return sum + 36;

                            return sum + (child.classList.contains(styles.monthWindow) ? 0 : 18);
                        }, 0)
                    );

                return nativeScrollHeight.get!.call(this);
            },
        },
    });
});
afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', nativeOffsetTop);
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', nativeOffsetHeight);
    Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight');
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight');
});

async function render(node: ReactNode) {
    await act(async () => root.render(node));
}

function part<T extends HTMLElement = HTMLElement>(suffix: string) {
    return container.querySelector<T>(`[data-test-id="panel-${suffix}"]`)!;
}

function navMonth(button: HTMLButtonElement) {
    const [name, year] = button.title.split(' ');

    return (Number(year) - 1) * 12 + MONTH_NAMES.indexOf(name);
}

function calendarRow(month: number) {
    return Array.from(part('calendar-months').children).find(
        (row) => rowMonth(row as HTMLElement) === month
    ) as HTMLElement;
}

function firstMonth() {
    const viewport = part('calendar-months');
    const rows = Array.from(viewport.children) as HTMLElement[];
    const visibleRow =
        rows.find((row) => row.offsetTop + row.offsetHeight > viewport.scrollTop + 1) ??
        rows.at(-1)!;

    return String(rowMonth(visibleRow));
}

async function click(suffix: string) {
    await act(async () => part(suffix).click());
}

async function input(suffix: string, value: string) {
    await act(async () => {
        const element = part<HTMLInputElement>(suffix);

        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
            element,
            value
        );
        element.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

test('single selects a draft, applies once and cancels back to committed date', async () => {
    const onChange = rstest.fn();
    const onCancel = rstest.fn();

    await render(
        <DatepickerPanel
            defaultValue="2026-10-25"
            onChange={onChange}
            onCancel={onCancel}
            dataTestId="panel"
        />
    );
    await click('day-2026-10-26');
    expect(onChange).not.toHaveBeenCalled();
    expect(part<HTMLInputElement>('date').value).toBe('2026-10-26');
    await click('cancel');
    expect(part<HTMLInputElement>('date').value).toBe('2026-10-25');
    expect(onCancel).toHaveBeenCalledTimes(1);
    await click('day-2026-10-26');
    await click('apply');
    expect(onChange.mock.calls[0][1]).toEqual({ value: '2026-10-26' });
    await click('day-2026-10-27');
    await act(async () =>
        container.firstElementChild!.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        )
    );
    expect(part<HTMLInputElement>('date').value).toBe('2026-10-26');
    expect(onCancel).toHaveBeenCalledTimes(2);
});

test('calendar-owned markup only exposes data-test-id metadata', async () => {
    await render(<DatepickerPanel mode="range" dataTestId="panel" />);

    const calendarElements = [
        container.firstElementChild!,
        part('months'),
        ...part('months').querySelectorAll('*'),
        part('calendar'),
        ...part('calendar').querySelectorAll('*'),
    ];

    for (const element of calendarElements) {
        const metadata = element
            .getAttributeNames()
            .filter(
                (name) =>
                    name.startsWith('aria-') ||
                    (name.startsWith('data-') && name !== 'data-test-id')
            );

        expect(metadata).toEqual([]);
    }
});

test('linked scrolling works without test identifiers', async () => {
    await render(
        <DatepickerPanel mode="range" defaultValue={{ from: '2026-12-28', to: '2027-01-04' }} />
    );

    const list = container.querySelector<HTMLElement>(`.${styles.months}`)!;
    const calendar = container.querySelector<HTMLElement>(`.${styles.calendarMonths}`)!;
    const initial = calendar.scrollTop;

    await act(async () => {
        list.scrollTop += 13.5;
        list.dispatchEvent(new Event('scroll'));
    });
    expect(calendar.scrollTop - initial).toBe(50);
});

test('manual invalid and unfinished dates block Apply, correction navigates and applies', async () => {
    const onChange = rstest.fn();

    await render(
        <DatepickerPanel defaultValue="2026-10-25" onChange={onChange} dataTestId="panel" />
    );

    for (const value of ['2026-02-30', '2026-02-']) {
        await input('date', value);
        expect(document.getElementById(`${part('date').id}-error`)).not.toBeNull();
        expect(document.getElementById(`${part('date').id}-error`)?.textContent).toContain(
            'Enter a valid date'
        );
        expect(part<HTMLButtonElement>('apply').disabled).toBe(true);
    }

    await input('date', '2028-02-29');
    expect(document.getElementById(`${part('date').id}-error`)).toBeNull();
    expect(part('day-2028-02-29')).not.toBeNull();
    await click('apply');
    expect(onChange.mock.calls[0][1]).toEqual({ value: '2028-02-29' });
    await input('date', '');
    expect(part<HTMLButtonElement>('apply').disabled).toBe(true);
});

test('controlled panel preserves draft on equal values and replaces it on external change', async () => {
    const onChange = rstest.fn();

    await render(
        <DatepickerPanel
            mode="range"
            value={{ from: '2026-12-28', to: '2027-01-04' }}
            onChange={onChange}
            dataTestId="panel"
        />
    );
    await click('day-2026-12-29');
    await render(
        <DatepickerPanel
            mode="range"
            value={{ from: '2026-12-28', to: '2027-01-04' }}
            onChange={onChange}
            dataTestId="panel"
        />
    );
    expect(part<HTMLInputElement>('from').value).toBe('2026-12-29');
    expect(part<HTMLInputElement>('to').value).toBe('');
    await render(
        <DatepickerPanel
            mode="range"
            value={{ from: '2027-02-08', to: '2027-02-26' }}
            onChange={onChange}
            dataTestId="panel"
        />
    );
    expect(part<HTMLInputElement>('from').value).toBe('2027-02-08');
    expect(part('day-2027-02-26')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
});

test('range clicks restart, preview without commit and accept a one-day interval', async () => {
    const onChange = rstest.fn();

    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2027-02-08', to: '2027-02-26' }}
            onChange={onChange}
            dataTestId="panel"
        />
    );
    await click('day-2027-02-10');
    await act(async () =>
        part('day-2027-02-20').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    );
    expect(part('day-2027-02-20').classList.contains(styles.previewEnd)).toBe(true);
    expect(part<HTMLInputElement>('to').value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
    await click('day-2027-02-09');
    expect(part<HTMLInputElement>('from').value).toBe('2027-02-09');
    await click('day-2027-02-09');
    expect(part('count').textContent).toBe('1 day');
    await click('apply');
    expect(onChange.mock.calls[0][1]).toEqual({ value: { from: '2027-02-09', to: '2027-02-09' } });
    await click('day-2027-02-12');
    expect(part<HTMLInputElement>('to').value).toBe('');
});

test('range manual validation rejects reversed bounds and counts days across years', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );
    expect(part('count').textContent).toBe('8 days');
    await input('to', '2026-12-27');
    expect(part<HTMLButtonElement>('apply').disabled).toBe(true);
    expect(document.getElementById(`${part('to').id}-error`)).not.toBeNull();
    await input('to', '2027-01-05');
    expect(part('day-2027-01-05')).not.toBeNull();
    expect(part('count').textContent).toBe('9 days');
});

test('a calendar click repairs an invalid range end without discarding its valid start', async () => {
    const onChange = rstest.fn();

    for (const badEnd of ['2027-02-30', '2027-02-', '2027-02-07']) {
        await render(
            <DatepickerPanel
                key={badEnd}
                mode="range"
                defaultValue={{ from: '2027-02-08', to: '2027-02-26' }}
                onChange={onChange}
                dataTestId="panel"
            />
        );
        await input('to', badEnd);
        expect(part('day-2027-02-12').classList.contains(styles.inRange)).toBe(false);
        await act(async () =>
            part('day-2027-02-20').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        );
        expect(part('day-2027-02-20').classList.contains(styles.previewEnd)).toBe(true);
        expect(part('day-2027-02-12').classList.contains(styles.inRange)).toBe(true);
        await click('day-2027-02-20');
        expect(part<HTMLInputElement>('from').value).toBe('2027-02-08');
        expect(part<HTMLInputElement>('to').value).toBe('2027-02-20');
        expect(document.getElementById(`${part('to').id}-error`)).toBeNull();
        await click('apply');
        expect(onChange).toHaveBeenLastCalledWith(expect.anything(), {
            value: { from: '2027-02-08', to: '2027-02-20' },
        });
    }
});

test('range scrolls by pixels, tracks visible months and retains its offset while recycling', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const dec = getMonthIndex('2026-12-01');

    expect(part(`month-${dec}`).classList.contains(styles.monthVisible)).toBe(true);
    expect(part(`month-${dec + 1}`).classList.contains(styles.monthVisible)).toBe(true);
    await click(`month-${dec - 1}`);
    expect(firstMonth()).toBe(String(dec - 1));
    await click(`month-${dec}`);

    const viewport = part('calendar-months');
    const wheel = new WheelEvent('wheel', { deltaY: 75, bubbles: true, cancelable: true });

    await act(async () => viewport.dispatchEvent(wheel));
    expect(wheel.defaultPrevented).toBe(false);
    await act(async () => {
        viewport.scrollTop += 75;
        viewport.dispatchEvent(new Event('scroll'));
    });
    expect(viewport.scrollTop % 200).toBe(75);
    expect(part(`month-${dec + 2}`).classList.contains(styles.monthVisible)).toBe(true);

    for (let i = 0; i < 40; i += 1) {
        await act(async () => {
            viewport.scrollTop += 180;
            viewport.dispatchEvent(new Event('scroll'));
        });
    }

    const visible = Number(firstMonth());

    expect(visible).toBe(dec + 36);
    expect(viewport.scrollTop % 200).toBe(75);
    expect(viewport.children.length).toBeLessThanOrEqual(16);

    for (let i = 0; i < 40; i += 1) {
        await act(async () => {
            viewport.scrollTop -= 180;
            viewport.dispatchEvent(new Event('scroll'));
        });
    }

    expect(firstMonth()).toBe(String(dec));
    expect(viewport.scrollTop % 200).toBe(75);
    await click(`month-${dec}`);
    expect(viewport.scrollTop % 200).toBe(0);
    expect(part(`month-${dec}`).classList.contains(styles.monthVisible)).toBe(true);
    expect(part('months').querySelectorAll('button').length).toBeLessThanOrEqual(40);
    expect(part<HTMLInputElement>('from').value).toBe('2026-12-28');
    await render(
        <DatepickerPanel
            mode="range"
            value={{ from: '9999-12-30', to: '9999-12-31' }}
            dataTestId="panel"
        />
    );
    expect(firstMonth()).toBe(String(9999 * 12 - 2));
    await act(async () =>
        part('calendar').dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
        )
    );
    expect(firstMonth()).toBe(String(9999 * 12 - 2));
    await render(
        <DatepickerPanel
            mode="range"
            value={{ from: '0001-01-01', to: '0001-01-02' }}
            dataTestId="panel"
        />
    );
    await act(async () =>
        part('calendar').dispatchEvent(
            new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true })
        )
    );
    expect(firstMonth()).toBe('0');
});

test('today has no special marker in single or range calendars', async () => {
    const date = today();

    await render(<DatepickerPanel dataTestId="panel" />);
    expect(part(`day-${date}`).classList.contains(styles.rangeStart)).toBe(false);
    expect(part(`day-${date}`).classList.contains(styles.selected)).toBe(false);
    await render(<DatepickerPanel mode="range" dataTestId="panel" />);
    expect(part(`day-${date}`).classList.contains(styles.rangeStart)).toBe(false);
    expect(part(`day-${date}`).classList.contains(styles.selected)).toBe(false);
});

test('choosing the last buffered month aligns its header instead of clamping before it', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const viewport = part('calendar-months');
    const target = rowMonth(viewport.lastElementChild as HTMLElement);

    await click(`month-${target}`);
    expect(firstMonth()).toBe(String(target));
    expect(viewport.scrollTop).toBe(calendarRow(target).offsetTop);
});

test('scrolling the month list moves the calendar by fractional months without feedback', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');
    const viewport = part('calendar-months');
    const initial = viewport.scrollTop;
    const indicator = part('month-window');

    const windowCenter = () =>
        Number.parseFloat(indicator.style.top) -
        list.scrollTop +
        Number.parseFloat(indicator.style.height) / 2;

    expect(windowCenter()).toBeCloseTo(list.clientHeight / 2);
    await act(async () => {
        list.scrollTop += 13.5;
        list.dispatchEvent(new Event('scroll'));
    });
    // December's 200 calendar pixels map to its 36px row plus the 18px year caption.
    expect(viewport.scrollTop - initial).toBe(50);
    expect(windowCenter()).toBeCloseTo(list.clientHeight / 2);

    const centeredTop = list.scrollTop;

    await act(async () => viewport.dispatchEvent(new Event('scroll')));
    expect(list.scrollTop).toBe(centeredTop);

    for (let step = 0; step < 40; step += 1) {
        await act(async () => {
            list.scrollTop += 36;
            list.dispatchEvent(new Event('scroll'));
        });
    }

    expect(Number(firstMonth())).toBeGreaterThan(24340);
    expect(viewport.children.length).toBeLessThanOrEqual(16);
    expect(list.querySelectorAll('button').length).toBeLessThanOrEqual(40);

    for (let step = 0; step < 40; step += 1) {
        await act(async () => {
            list.scrollTop -= 36;
            list.dispatchEvent(new Event('scroll'));
        });
    }

    expect(Number(firstMonth())).toBe(24311);
    expect(viewport.scrollTop % 200).toBeCloseTo(50);
    expect(part<HTMLInputElement>('from').value).toBe('2026-12-28');
    expect(part<HTMLInputElement>('to').value).toBe('2027-01-04');
});

test('the month window follows partial calendar scrolling within a month and across a year', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const viewport = part('calendar-months');
    const indicator = part('month-window');

    expect(indicator).not.toBeNull();

    const initial = Number.parseFloat(indicator.style.top);

    await act(async () => {
        viewport.scrollTop += 25;
        viewport.dispatchEvent(new Event('scroll'));
    });
    expect(Number.parseFloat(indicator.style.top) - initial).toBeCloseTo(6.75);
    await act(async () => {
        viewport.scrollTop += 25;
        viewport.dispatchEvent(new Event('scroll'));
    });
    expect(Number.parseFloat(indicator.style.top) - initial).toBeCloseTo(13.5);
    expect(Number.parseFloat(indicator.style.height)).toBeCloseTo(85.5);
});

test('linked scrolling uses the measured height of each calendar month', async () => {
    calendarHeights = { 24311: 260, 24312: 180 };
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const viewport = part('calendar-months');
    const list = part('months');
    const initialWindow = Number.parseFloat(part('month-window').style.top);
    const initialCalendar = viewport.scrollTop;

    await act(async () => {
        viewport.scrollTop += 65;
        viewport.dispatchEvent(new Event('scroll'));
    });
    expect(Number.parseFloat(part('month-window').style.top) - initialWindow).toBeCloseTo(13.5);
    await act(async () => {
        list.scrollTop += 13.5;
        list.dispatchEvent(new Event('scroll'));
    });
    expect(viewport.scrollTop - initialCalendar).toBeCloseTo(130);
});

test('a large left scroll aligns a trailing buffered month before the calendar can clamp', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');
    const viewport = part('calendar-months');
    const target = rowMonth(viewport.lastElementChild as HTMLElement);
    const delta =
        part(`month-${target}`).offsetTop - Number.parseFloat(part('month-window').style.top);

    await act(async () => {
        list.scrollTop += delta;
        list.dispatchEvent(new Event('scroll'));
    });
    expect(Number(firstMonth())).toBe(target);
    expect(viewport.scrollTop).toBe(calendarRow(target).offsetTop);
});

test('the month window stays centered near either edge of the navigation buffer', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');
    const indicator = part('month-window');

    const center = () =>
        Number.parseFloat(indicator.style.top) -
        list.scrollTop +
        Number.parseFloat(indicator.style.height) / 2;

    const last = navMonth(Array.from(list.querySelectorAll<HTMLButtonElement>('button')).at(-1)!);

    await click(`month-${last - 2}`);
    expect(center()).toBeCloseTo(list.clientHeight / 2);

    const first = navMonth(list.querySelector<HTMLButtonElement>('button')!);

    await click(`month-${first + 1}`);
    expect(center()).toBeCloseTo(list.clientHeight / 2);
});

test('batched left scroll events retain every delta while replacing the calendar buffer', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');

    await act(async () => {
        for (const delta of [252, 36]) {
            list.scrollTop += delta;
            list.dispatchEvent(new Event('scroll'));
        }
    });
    expect(Number(firstMonth())).toBe(24318);
    expect(part('calendar-months').scrollTop - calendarRow(24318).offsetTop).toBeCloseTo(100);
    expect(part<HTMLInputElement>('from').value).toBe('2026-12-28');
});

test('reversing a pending left scroll restores the latest position before layout commits', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');

    await act(async () => {
        for (const delta of [252, -252]) {
            list.scrollTop += delta;
            list.dispatchEvent(new Event('scroll'));
        }
    });
    expect(Number(firstMonth())).toBe(24311);
    expect(part('calendar-months').scrollTop - calendarRow(24311).offsetTop).toBe(0);
});

test('right scroll input supersedes a pending left seek before layout commits', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');
    const calendar = part('calendar-months');

    await act(async () => {
        list.scrollTop += 252;
        list.dispatchEvent(new Event('scroll'));
        calendar.scrollTop += 50;
        calendar.dispatchEvent(new Event('scroll'));
    });
    expect(Number(firstMonth())).toBe(24311);
    expect(calendar.scrollTop - calendarRow(24311).offsetTop).toBe(50);
});

test('batched left scroll events retain movement while the month-list buffer is pending', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const list = part('months');

    await act(async () => {
        for (const delta of [600, 12]) {
            list.scrollTop += delta;
            list.dispatchEvent(new Event('scroll'));
        }
    });

    const calendar = part('calendar-months');

    expect(Number(firstMonth())).toBe(24327);
    expect(calendar.scrollTop - calendarRow(24327).offsetTop).toBeCloseTo(0);
});

test('single month arrows preserve selected date and stop at calendar limits', async () => {
    await render(<DatepickerPanel value="0001-01-01" dataTestId="panel" />);
    expect(part<HTMLButtonElement>('previous').disabled).toBe(true);
    await click('next');
    expect(part('day-0001-02-01')).not.toBeNull();
    expect(part<HTMLInputElement>('date').value).toBe('0001-01-01');
    await render(<DatepickerPanel value="9999-12-31" dataTestId="panel" />);
    expect(part<HTMLButtonElement>('next').disabled).toBe(true);
});

test('a height-constrained range allows native wheel scrolling to reach lower dates', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const body = part('calendar').parentElement!.parentElement!;

    Object.defineProperty(body, 'clientHeight', { value: 100 });
    Object.defineProperty(part('calendar'), 'clientHeight', { value: 456 });

    const wheel = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    const before = firstMonth();

    await act(async () => part('calendar').dispatchEvent(wheel));
    expect(wheel.defaultPrevented).toBe(false);
    expect(firstMonth()).toBe(before);
});

test('wheel scrolls the whole panel when its headers and calendars exceed available height', async () => {
    await render(
        <DatepickerPanel
            mode="range"
            defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
            dataTestId="panel"
        />
    );

    const panel = container.querySelector<HTMLElement>('[role="dialog"]')!;

    Object.defineProperties(panel, { clientHeight: { value: 190 }, scrollHeight: { value: 654 } });

    const wheel = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });

    await act(async () => part('calendar').dispatchEvent(wheel));
    expect(wheel.defaultPrevented).toBe(false);
});
