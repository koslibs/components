import { CalendarIcon } from '@koslibs/icons/CalendarIcon';
import { ChevronLeftIcon } from '@koslibs/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@koslibs/icons/ChevronRightIcon';
import cn from 'classnames';
import { useId, type KeyboardEvent, type MouseEvent } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Button } from '../Button';
import { Input, type InputProps } from '../Input';
import { TypographyText } from '../Typography/text';

import { CalendarMonth, Weekdays } from './components/calendar-month';
import { RangeCalendar } from './components/range-calendar';
import { useDatepickerDraft } from './hooks/use-datepicker-draft';
import { useDatepickerValue } from './hooks/use-datepicker-value';
import type { DatepickerPanelProps } from './types';
import { LAST_MONTH, monthLabel } from './utils/date-utils';

import styles from './panel.module.css';

export function DatepickerPanel(props: DatepickerPanelProps) {
    const { mode = 'single', className, style, dataTestId, onCancel, id: panelId } = props;

    const selection = useDatepickerValue(props);
    const state = useDatepickerDraft(mode, selection.value);
    const id = useDataTestId(dataTestId);
    const titleId = useId();

    const range = mode === 'range';
    let countLabel = range ? 'Choose dates' : 'Choose date';

    if (range && state.draft.from) countLabel = 'Choose an end date';
    if (state.count) countLabel = `${state.count} ${state.count === 1 ? 'day' : 'days'}`;

    function cancel() {
        state.reset();
        onCancel?.();
    }

    function apply(event: MouseEvent<HTMLButtonElement>) {
        selection.commit(event, state.value);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
            cancel();
        }
    };

    const handlePreviousMonth = () => state.navigate(state.month - 1);

    const handleNextMonth = () => state.navigate(state.month + 1);

    return (
        <div
            id={panelId}
            className={cn(styles.panel, range && styles.range, className)}
            style={style}
            role="dialog"
            data-test-id={dataTestId}
            onKeyDown={handleKeyDown}
        >
            <TypographyText
                tag="div"
                size={16}
                weight="semibold"
                id={titleId}
                className={styles.title}
            >
                {range ? 'Choose dates' : 'Choose date'}
            </TypographyText>
            <div className={styles.fields}>
                {(range ? (['from', 'to'] as const) : (['from'] as const)).map((field) => {
                    const inputId = `${titleId}-${field}`;
                    const error = state.errors[field];
                    const errorMessage = error ? (
                        <span id={`${inputId}-error`}>{error}</span>
                    ) : undefined;
                    const inputLabel = range ? { from: 'From', to: 'To' }[field] : 'Date';

                    const handleChange: NonNullable<InputProps['onChange']> = (_, { value }) =>
                        state.input(field, value);

                    return (
                        <Input
                            key={field}
                            id={inputId}
                            block
                            view="secondary"
                            size={40}
                            label={inputLabel}
                            placeholder="Choose date"
                            value={state.draft[field]}
                            onChange={handleChange}
                            error={errorMessage}
                            hint={errorMessage}
                            messageClassName={styles.inputError}
                            labelClassName={styles.inputLabel}
                            className={styles.input}
                            fieldClassName={styles.inputField}
                            rightAddon={<CalendarIcon width={16} height={16} />}
                            dataTestId={id(range ? field : 'date')}
                            autoComplete="off"
                            maxLength={10}
                        />
                    );
                })}
            </div>
            <div className={styles.body}>
                {range ? (
                    <RangeCalendar state={state} dataTestId={dataTestId} />
                ) : (
                    <div className={styles.singleCalendar} data-test-id={id('calendar')}>
                        <div className={styles.navigation}>
                            <button
                                type="button"
                                className={styles.arrow}
                                title="Previous month"
                                disabled={state.month === 0}
                                onClick={handlePreviousMonth}
                                data-test-id={id('previous')}
                            >
                                <ChevronLeftIcon width={16} height={16} />
                            </button>
                            <TypographyText size={14} weight="semibold">
                                {monthLabel(state.month)}
                            </TypographyText>
                            <button
                                type="button"
                                className={styles.arrow}
                                title="Next month"
                                disabled={state.month === LAST_MONTH}
                                onClick={handleNextMonth}
                                data-test-id={id('next')}
                            >
                                <ChevronRightIcon width={16} height={16} />
                            </button>
                        </div>
                        <Weekdays />
                        <CalendarMonth
                            month={state.month}
                            state={state}
                            range={false}
                            dataTestId={dataTestId}
                        />
                    </div>
                )}
            </div>
            <div className={styles.footer}>
                <TypographyText
                    size={12}
                    color="secondary"
                    className={styles.count}
                    dataTestId={id('count')}
                >
                    {countLabel}
                </TypographyText>
                <Button
                    view="text"
                    size={40}
                    className={styles.cancel}
                    onClick={cancel}
                    dataTestId={id('cancel')}
                >
                    Cancel
                </Button>
                <Button
                    view="secondary"
                    size={40}
                    disabled={!state.value}
                    onClick={apply}
                    dataTestId={id('apply')}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
