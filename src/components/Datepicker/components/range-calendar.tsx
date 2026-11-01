import cn from 'classnames';
import { Fragment } from 'react';

import { useDataTestId } from '../../../hooks/use-data-test-id';
import type { DatepickerDraft } from '../hooks/use-datepicker-draft';
import { useRangeScroll } from '../hooks/use-range-scroll';
import { MONTH_NAMES, monthLabel } from '../utils/date-utils';

import { CalendarMonth, Weekdays } from './calendar-month';

import styles from '../panel.module.css';

export function RangeCalendar({
    state,
    dataTestId,
}: {
    state: DatepickerDraft;
    dataTestId?: string;
}) {
    const id = useDataTestId(dataTestId);
    const scroll = useRangeScroll(state.month, state.navigationVersion);

    return (
        <div className={styles.rangeCalendar}>
            <div
                ref={scroll.monthsRef}
                className={styles.months}
                data-test-id={id('months')}
                onScroll={scroll.monthsScroll}
            >
                <div
                    ref={scroll.windowRef}
                    className={styles.monthWindow}
                    data-test-id={id('month-window')}
                />
                {scroll.months.map((month, index) => {
                    const handleClick = () => state.navigate(month);

                    const registerMonth = (element: HTMLButtonElement | null) =>
                        scroll.registerMonth(month, element);

                    return (
                        <Fragment key={month}>
                            {(index === 0 || month % 12 === 0) && (
                                <div className={styles.year}>{Math.floor(month / 12) + 1}</div>
                            )}
                            <button
                                type="button"
                                ref={registerMonth}
                                className={cn(
                                    styles.monthButton,
                                    month >= scroll.visible.first &&
                                        month <= scroll.visible.last &&
                                        styles.monthVisible
                                )}
                                title={monthLabel(month)}
                                data-test-id={id(`month-${month}`)}
                                onClick={handleClick}
                            >
                                {MONTH_NAMES[month % 12]}
                            </button>
                        </Fragment>
                    );
                })}
            </div>
            <div className={styles.calendars} data-test-id={id('calendar')}>
                <Weekdays />
                <div
                    ref={scroll.calendarRef}
                    className={styles.calendarMonths}
                    data-test-id={id('calendar-months')}
                    onScroll={scroll.calendarScroll}
                >
                    {scroll.calendars.map((month) => {
                        const registerCalendarMonth = (element: HTMLDivElement | null) =>
                            scroll.registerCalendarMonth(month, element);

                        return (
                            <div
                                key={month}
                                ref={registerCalendarMonth}
                                className={styles.monthBlock}
                            >
                                <CalendarMonth
                                    month={month}
                                    state={state}
                                    range
                                    dataTestId={dataTestId}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
