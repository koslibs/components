import { CrossHeavyMIcon } from '@koslibs/icons/CrossHeavyMIcon';
import cn from 'classnames';
import {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Button } from '../Button';
import { TypographyText } from '../Typography/text';

import type { InputProps } from './types';

import styles from './index.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            view = 'primary',
            size = 40,
            block = false,
            label,
            labelView = 'outer',
            hint,
            error,
            leftAddon,
            rightAddon,
            clear = false,
            clearLabel = 'Очистить поле',
            value,
            defaultValue,
            maxLength,
            showValueLength = false,
            onChange,
            onClear,
            disabled = false,
            readOnly = false,
            type = 'text',
            id,
            className,
            style,
            fieldClassName,
            inputClassName,
            labelClassName,
            messageClassName,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const inputRef = useRef<HTMLInputElement>(null);
        const [uncontrolledLength, setUncontrolledLength] = useState(defaultValue?.length ?? 0);
        const controlled = value !== undefined;
        const valueLength = controlled ? value.length : uncontrolledLength;
        const hasValue = valueLength > 0;
        const showCounter =
            showValueLength &&
            maxLength !== undefined &&
            Number.isInteger(maxLength) &&
            maxLength >= 0;
        const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
        const hasError = Boolean(error);
        const errorMessage = hint && typeof error !== 'boolean' ? error : undefined;
        const message = errorMessage || hint;
        const hasMessage = Boolean(message);
        const showClear = clear && hasValue && !disabled && !readOnly;
        const getDataTestId = useDataTestId(dataTestId);

        useImperativeHandle(ref, () => inputRef.current!, []);

        useEffect(() => {
            const input = inputRef.current;
            const form = input?.form;
            let active = true;
            const handleReset = (event: Event) => {
                // The browser restores defaultValue after dispatching the reset event.
                queueMicrotask(() => {
                    if (active && !event.defaultPrevented)
                        setUncontrolledLength(input?.value.length ?? 0);
                });
            };
            form?.addEventListener('reset', handleReset);
            return () => {
                active = false;
                form?.removeEventListener('reset', handleReset);
            };
        }, [restProps.form]);

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const nextValue = event.target.value;
            if (!controlled) setUncontrolledLength(nextValue.length);
            onChange?.(event, { value: nextValue });
        };

        const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
            const input = inputRef.current;
            if (!input || !showClear) return;
            if (!controlled) {
                input.value = '';
                setUncontrolledLength(0);
            }
            onClear?.(event);
            input.focus();
        };

        const handleFieldClick = (event: MouseEvent<HTMLDivElement>) => {
            if (disabled || event.defaultPrevented || !(event.target instanceof Element)) return;
            const interactiveTarget = event.target.closest(
                'input, button, a, label, select, textarea, [role="button"], [contenteditable], [tabindex]'
            );
            if (interactiveTarget && event.currentTarget.contains(interactiveTarget)) {
                return;
            }
            inputRef.current?.focus();
        };

        const labelElement = hasLabel && (
            <label
                htmlFor={inputId}
                className={cn(styles.label, labelClassName)}
                data-test-id={getDataTestId('label')}
            >
                <TypographyText
                    size={labelView === 'inner' ? 12 : 13}
                    weight={labelView === 'inner' ? 'regular' : 'medium'}
                >
                    {label}
                </TypographyText>
            </label>
        );

        const counterElement = showCounter && (
            <TypographyText
                tag="span"
                size={11}
                className={styles.counter}
                style={{ minWidth: `${String(maxLength).length * 2 + 1}ch` }}
                dataTestId={getDataTestId('counter')}
            >
                {valueLength}/{maxLength}
            </TypographyText>
        );

        return (
            <div
                className={cn(styles.component, styles[`size-${size}`], className)}
                style={style}
                data-view={view}
                data-block={block || undefined}
                data-disabled={disabled || undefined}
                data-read-only={readOnly || undefined}
                data-error={hasError || undefined}
                data-label-view={labelView}
                data-inner-label={(labelView === 'inner' && hasLabel) || undefined}
                data-inner-counter={(labelView === 'inner' && showCounter) || undefined}
                data-filled={hasValue || undefined}
                data-test-id={getDataTestId('form-control')}
            >
                {labelView === 'outer' && (hasLabel || showCounter) && (
                    <div className={styles.header}>
                        {labelElement}
                        {counterElement}
                    </div>
                )}
                <div
                    className={cn(styles.field, fieldClassName)}
                    onClick={handleFieldClick}
                    data-test-id={getDataTestId('field')}
                >
                    {leftAddon && (
                        <div className={styles.addon} data-test-id={getDataTestId('left-addon')}>
                            {leftAddon}
                        </div>
                    )}
                    <div className={styles.value}>
                        {labelView === 'inner' && (hasLabel || showCounter) && (
                            <div className={cn(styles.header, styles.innerHeader)}>
                                {labelElement}
                                {counterElement}
                            </div>
                        )}
                        <input
                            {...restProps}
                            ref={inputRef}
                            id={inputId}
                            type={type}
                            value={value}
                            defaultValue={defaultValue}
                            maxLength={maxLength}
                            disabled={disabled}
                            readOnly={readOnly}
                            onChange={handleChange}
                            className={cn(styles.input, inputClassName)}
                            data-test-id={dataTestId}
                        />
                    </div>
                    {showClear && (
                        <Button
                            view="text"
                            size={32}
                            className={styles.clear}
                            aria-label={clearLabel}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={handleClear}
                            dataTestId={getDataTestId('clear')}
                        >
                            <CrossHeavyMIcon width={16} height={16} aria-hidden="true" />
                        </Button>
                    )}
                    {rightAddon && (
                        <div className={styles.addon} data-test-id={getDataTestId('right-addon')}>
                            {rightAddon}
                        </div>
                    )}
                </div>
                {hasMessage && (
                    <TypographyText
                        tag="div"
                        size={12}
                        className={cn(styles.message, messageClassName)}
                        dataTestId={getDataTestId(errorMessage ? 'error' : 'hint')}
                    >
                        {message}
                    </TypographyText>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
