import { CalendarIcon } from '@koslibs/icons/CalendarIcon';
import { CrossIcon } from '@koslibs/icons/CrossIcon';
import cn from 'classnames';
import { forwardRef, useId, useImperativeHandle, type MouseEvent } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Button } from '../Button';
import { TypographyText } from '../Typography/text';

import { DatepickerPanel } from './datepicker-panel';
import { DatepickerPopoverSurface } from './datepicker-popover';
import { useDatepickerState } from './hooks/use-datepicker-state';
import type {
    DatepickerChangePayload,
    DatepickerPanelProps,
    DatepickerProps,
    DatepickerRange,
} from './types';
import { formatDate } from './utils/date-utils';

import styles from './index.module.css';

const textSizes = { 40: 13, 48: 13, 56: 14, 64: 14, 72: 16 } as const;

export const Datepicker = forwardRef<HTMLButtonElement, DatepickerProps>((props, ref) => {
    const {
        mode,
        value: _value,
        defaultValue: _defaultValue,
        onChange: _onChange,
        view = 'primary',
        size = 40,
        label,
        labelView = 'outer',
        hint,
        error,
        block = false,
        hasOutline = false,
        clear = false,
        disabled = false,
        readOnly = false,
        placeholder = mode === 'range' ? 'Choose dates' : 'Choose date',
        open: _open,
        defaultOpen: _defaultOpen,
        onOpenChange: _onOpenChange,
        onClear: _onClear,
        id,
        name,
        form,
        className,
        style,
        labelClassName,
        messageClassName,
        panelClassName,
        getPortalContainer,
        dataTestId,
        ...buttonProps
    } = props;

    const generatedId = useId();

    const triggerId = id ?? generatedId;
    const labelId = `${triggerId}-label`;
    const messageId = `${triggerId}-message`;
    const panelId = `${triggerId}-panel`;

    const getId = useDataTestId(dataTestId);
    const state = useDatepickerState(props);

    useImperativeHandle(ref, () => state.buttonRef.current!, []);

    const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
    const innerLabel = hasLabel && labelView === 'inner';
    const message = (hint && typeof error !== 'boolean' ? error : undefined) || hint;
    let display = placeholder;

    if (typeof state.value === 'string') display = formatDate(state.value);
    else if (state.value)
        display = `${formatDate(state.value.from)} – ${formatDate(state.value.to)}`;

    const panelProps: DatepickerPanelProps =
        props.mode === 'range'
            ? {
                  mode: 'range' as const,
                  value: typeof state.value === 'object' ? state.value : null,
              }
            : {
                  mode: 'single' as const,
                  value: typeof state.value === 'string' ? state.value : null,
              };

    const handleClearMouseDown = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const handleClose = () => state.close();

    const handleCancel = () => state.close(true);

    const handleChange = (
        event: MouseEvent<HTMLButtonElement>,
        { value: nextValue }: DatepickerChangePayload<string | DatepickerRange | null>
    ) => state.apply(event, nextValue);

    return (
        <div
            className={cn(
                styles.component,
                styles[`size-${size}`],
                {
                    [styles.secondary]: view === 'secondary',
                    [styles.block]: block,
                    [styles.disabled]: disabled,
                    [styles.readOnly]: readOnly,
                    [styles.error]: Boolean(error),
                    [styles.hasOutline]: hasOutline,
                    [styles.open]: state.open,
                    [styles.hasInnerLabel]: innerLabel,
                    [styles.labelRaised]: state.raisedLabel,
                },
                className
            )}
            style={style}
            data-test-id={getId('form-control')}
        >
            {hasLabel && !innerLabel && (
                <label
                    id={labelId}
                    htmlFor={triggerId}
                    className={cn(styles.label, labelClassName)}
                    data-test-id={getId('label')}
                >
                    <TypographyText size={13} weight="medium">
                        {label}
                    </TypographyText>
                </label>
            )}
            <div
                ref={state.setAnchor}
                className={styles.field}
                data-test-id={getId('field')}
                onKeyDown={state.handleKeyDown}
            >
                <button
                    {...buttonProps}
                    {...state.triggerProps}
                    ref={state.buttonRef}
                    id={triggerId}
                    type="button"
                    form={form}
                    disabled={disabled}
                    className={styles.trigger}
                    data-test-id={dataTestId}
                >
                    <span className={styles.valueColumn}>
                        {innerLabel && (
                            <TypographyText
                                id={labelId}
                                size={state.raisedLabel ? 11 : textSizes[size]}
                                weight="medium"
                                rowLimit={1}
                                className={cn(styles.innerLabel, labelClassName)}
                                dataTestId={getId('label')}
                            >
                                {label}
                            </TypographyText>
                        )}
                        <TypographyText
                            size={textSizes[size]}
                            rowLimit={1}
                            className={cn(styles.value, !state.value && styles.placeholder)}
                            dataTestId={getId('value')}
                        >
                            {display}
                        </TypographyText>
                    </span>
                </button>
                {clear && state.value && !state.blocked && (
                    <Button
                        view="text"
                        size={32}
                        className={styles.clear}
                        title="Clear date"
                        onMouseDown={handleClearMouseDown}
                        onClick={state.clear}
                        dataTestId={getId('clear')}
                    >
                        <CrossIcon width={14} height={14} />
                    </Button>
                )}
                <CalendarIcon className={styles.icon} width={16} height={16} />
            </div>
            {message && (
                <TypographyText
                    tag="div"
                    size={12}
                    id={messageId}
                    className={cn(styles.message, messageClassName)}
                    dataTestId={getId(typeof error !== 'boolean' && error ? 'error' : 'hint')}
                >
                    {message}
                </TypographyText>
            )}
            {name &&
                (mode === 'range' ? (
                    <>
                        <input
                            type="hidden"
                            name={`${name}.from`}
                            value={typeof state.value === 'object' ? (state.value?.from ?? '') : ''}
                            disabled={disabled}
                            form={form}
                        />
                        <input
                            type="hidden"
                            name={`${name}.to`}
                            value={typeof state.value === 'object' ? (state.value?.to ?? '') : ''}
                            disabled={disabled}
                            form={form}
                        />
                    </>
                ) : (
                    <input
                        type="hidden"
                        name={name}
                        value={typeof state.value === 'string' ? state.value : ''}
                        disabled={disabled}
                        form={form}
                    />
                ))}
            <DatepickerPopoverSurface
                ref={state.popupRef}
                mode={state.mode}
                open={state.open}
                anchorElement={state.anchor}
                onClose={handleClose}
                escapeKeyDown={false}
                getPortalContainer={getPortalContainer}
                dataTestId={getId('popup')}
            >
                <DatepickerPanel
                    id={panelId}
                    key={`${state.mode}-${state.session}`}
                    {...panelProps}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    className={panelClassName}
                    dataTestId={getId('panel')}
                />
            </DatepickerPopoverSurface>
        </div>
    );
});

Datepicker.displayName = 'Datepicker';
