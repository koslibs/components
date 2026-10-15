import { ChevronDownIcon } from '@koslibs/icons/ChevronDownIcon';
import { CrossIcon } from '@koslibs/icons/CrossIcon';
import cn from 'classnames';
import { forwardRef, useId, useImperativeHandle } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Button } from '../Button';
import { Popover } from '../Popover';
import { TypographyText } from '../Typography/text';

import { SelectDropdown } from './components/select-dropdown';
import { useSelectState } from './hooks/use-select-state';
import type { SelectProps } from './types';

import styles from './index.module.css';

const textSizes = { 40: 13, 48: 13, 56: 14, 64: 14, 72: 16 } as const;
const dropdownOffset: [number, number] = [0, 8];

export const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
    const {
        view = 'primary',
        size = 40,
        label,
        labelView = 'outer',
        block = false,
        placeholder = 'Выберите значение',
        hint,
        error,
        clear = false,
        disabled = false,
        readOnly = false,
        className,
        style,
        labelClassName,
        messageClassName,
        dropdownClassName,
        dataTestId,
        id,
        name,
        form,
        onClear: _onClear,
        getPortalContainer,
        options: _options,
        multiple,
        value: _value,
        defaultValue: _defaultValue,
        onChange: _onChange,
        searchable,
        searchPlaceholder,
        open: _open,
        defaultOpen: _defaultOpen,
        onOpenChange: _onOpenChange,
        noResultsText,
        ...buttonProps
    } = props;
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const getDataTestId = useDataTestId(dataTestId);
    const state = useSelectState(props);
    const { buttonRef, raisedLabel } = state;
    const hasValue = state.selectedIds.length > 0;
    const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
    const innerLabel = labelView === 'inner' && hasLabel;
    const selectedText = state.selectedOptions.map((option) => option.label).join(', ');
    const displayValue = hasValue ? selectedText : placeholder;
    const message = (hint && typeof error !== 'boolean' ? error : undefined) || hint;
    const showClear = clear && hasValue && !state.blocked;

    useImperativeHandle(ref, () => buttonRef.current!, []);

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
                    [styles.open]: state.open,
                    [styles.withInnerLabel]: innerLabel,
                    [styles.labelRaised]: innerLabel && raisedLabel,
                },
                className
            )}
            style={style}
            data-test-id={getDataTestId('form-control')}
        >
            {hasLabel && labelView === 'outer' && (
                <label
                    htmlFor={triggerId}
                    className={cn(styles.label, labelClassName)}
                    data-test-id={getDataTestId('label')}
                >
                    <TypographyText size={13} weight="medium">
                        {label}
                    </TypographyText>
                </label>
            )}
            <div
                ref={state.setAnchor}
                className={styles.field}
                data-test-id={getDataTestId('field')}
                onClick={(event) => {
                    if (
                        !state.blocked &&
                        !event.defaultPrevented &&
                        event.target === event.currentTarget
                    )
                        buttonRef.current?.click();
                }}
            >
                <button
                    {...buttonProps}
                    {...state.triggerProps}
                    ref={buttonRef}
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
                                size={raisedLabel ? 11 : textSizes[size]}
                                weight="medium"
                                rowLimit={1}
                                className={cn(styles.innerLabel, labelClassName)}
                                dataTestId={getDataTestId('label')}
                            >
                                {label}
                            </TypographyText>
                        )}
                        <TypographyText
                            size={textSizes[size]}
                            rowLimit={1}
                            className={cn(styles.value, !hasValue && styles.placeholder)}
                            dataTestId={getDataTestId('value')}
                        >
                            {displayValue}
                        </TypographyText>
                    </span>
                </button>
                {showClear && (
                    <Button
                        view="text"
                        size={32}
                        className={styles.clear}
                        aria-label="close"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={state.clear}
                        dataTestId={getDataTestId('clear')}
                    >
                        <CrossIcon width={14} height={14} aria-hidden="true" />
                    </Button>
                )}
                <span className={styles.chevron}>
                    <ChevronDownIcon aria-hidden="true" />
                </span>
            </div>
            {message && (
                <TypographyText
                    tag="div"
                    size={12}
                    className={cn(styles.message, messageClassName)}
                    dataTestId={getDataTestId(
                        typeof error !== 'boolean' && error ? 'error' : 'hint'
                    )}
                >
                    {message}
                </TypographyText>
            )}
            {name &&
                state.selectedIds.map((value) => (
                    <input
                        key={value}
                        type="hidden"
                        name={name}
                        value={value}
                        disabled={disabled}
                        form={form}
                    />
                ))}
            <Popover
                ref={state.popupRef}
                open={state.open}
                anchorElement={state.anchor}
                offset={dropdownOffset}
                useAnchorWidth
                onClose={state.close}
                getPortalContainer={getPortalContainer}
                className={cn(styles.dropdown, dropdownClassName)}
                dataTestId={getDataTestId('dropdown')}
            >
                <SelectDropdown
                    state={state}
                    multiple={multiple}
                    searchable={searchable}
                    searchPlaceholder={searchPlaceholder}
                    noResultsText={noResultsText}
                    dataTestId={dataTestId}
                />
            </Popover>
        </div>
    );
});

Select.displayName = 'Select';
