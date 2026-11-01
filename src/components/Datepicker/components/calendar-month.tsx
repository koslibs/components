import cn from 'classnames';

import { useDataTestId } from '../../../hooks/use-data-test-id';
import { TypographyText } from '../../Typography/text';
import type { DatepickerDraft } from '../hooks/use-datepicker-draft';
import { getMonthDays, monthLabel, parseDate } from '../utils/date-utils';

import styles from '../panel.module.css';

export function Weekdays() {
    return (
        <div className={styles.weekdays}>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                <span key={day}>{day}</span>
            ))}
        </div>
    );
}

export function CalendarMonth({
    month,
    state,
    range,
    dataTestId,
}: {
    month: number;
    state: DatepickerDraft;
    range: boolean;
    dataTestId?: string;
}) {
    const id = useDataTestId(dataTestId);

    const from = parseDate(state.draft.from) ? state.draft.from : '';
    const to = typeof state.value === 'object' ? (state.value?.to ?? '') : '';
    const end = to || state.preview;

    const handleMouseLeave = () => state.hover(null);

    return (
        <section className={styles.month} title={monthLabel(month)}>
            {range && (
                <TypographyText tag="div" size={14} weight="semibold" className={styles.monthTitle}>
                    {monthLabel(month)}
                </TypographyText>
            )}
            <div className={styles.days} onMouseLeave={handleMouseLeave}>
                {getMonthDays(month).map((date, index) => {
                    if (!date) return <span key={`empty-${index}`} />;

                    const handleClick = () => state.select(date);

                    const handleMouseEnter = () => state.hover(date);

                    return (
                        <button
                            key={date}
                            type="button"
                            className={cn(styles.day, {
                                [styles.selected]: !range && date === from,
                                [styles.rangeStart]: range && date === from,
                                [styles.rangeEnd]: range && date === to,
                                [styles.oneDay]: range && date === from && date === to,
                                [styles.inRange]: range && from && end && date > from && date < end,
                                [styles.previewEnd]: range && !to && date === state.preview,
                            })}
                            title={date}
                            data-test-id={id(`day-${date}`)}
                            onClick={handleClick}
                            onMouseEnter={handleMouseEnter}
                        >
                            {Number(date.slice(-2))}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
