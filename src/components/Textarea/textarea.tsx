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
    type CSSProperties,
    type MouseEvent,
} from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Button } from '../Button';
import { TypographyText } from '../Typography/text';

import { useAutosize } from './hooks/use-autosize';
import type { TextareaProps } from './types';

import styles from './index.module.css';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            view = 'primary',
            block = false,
            label,
            labelView = 'outer',
            hint,
            error,
            minRows = 3,
            maxRows,
            autosize = false,
            resize = false,
            clear = false,
            value,
            defaultValue,
            maxLength,
            showValueLength = false,
            onChange,
            onClear,
            disabled = false,
            readOnly = false,
            id,
            className,
            style,
            fieldClassName,
            textareaClassName,
            labelClassName,
            messageClassName,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        const generatedId = useId();
        const textareaId = id ?? generatedId;
        const textareaRef = useRef<HTMLTextAreaElement>(null);
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
        const errorMessage = hint && typeof error !== 'boolean' ? error : undefined;
        const message = errorMessage || hint;
        const showClear = clear && hasValue && !disabled && !readOnly;
        const rows = Number.isFinite(minRows) ? Math.max(1, Math.floor(minRows)) : 3;
        const limit =
            maxRows !== undefined && Number.isFinite(maxRows)
                ? Math.max(rows, Math.floor(maxRows))
                : undefined;
        const getDataTestId = useDataTestId(dataTestId);

        useImperativeHandle(ref, () => textareaRef.current!, []);
        useAutosize(textareaRef, autosize, rows, limit, restProps.form);

        useEffect(() => {
            const textarea = textareaRef.current;
            const form = textarea?.form;
            let active = true;
            const handleReset = (event: Event) => {
                // A microtask may run before the browser's reset default action on button clicks.
                setTimeout(() => {
                    if (active && !event.defaultPrevented)
                        setUncontrolledLength(textarea?.value.length ?? 0);
                }, 0);
            };
            form?.addEventListener('reset', handleReset);
            return () => {
                active = false;
                form?.removeEventListener('reset', handleReset);
            };
        }, [restProps.form]);

        const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const nextValue = event.target.value;
            if (!controlled) setUncontrolledLength(nextValue.length);
            onChange?.(event, { value: nextValue });
        };

        const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
            const textarea = textareaRef.current;
            if (!textarea || !showClear) return;
            if (!controlled) {
                textarea.value = '';
                setUncontrolledLength(0);
            }
            onClear?.(event);
            textarea.focus();
        };

        const handleFieldClick = (event: MouseEvent<HTMLDivElement>) => {
            if (disabled || event.defaultPrevented || !(event.target instanceof Element)) return;
            const target = event.target.closest(
                'textarea, button, a, label, input, select, [contenteditable], [tabindex]'
            );
            if (target && event.currentTarget.contains(target)) return;
            textareaRef.current?.focus();
        };

        const labelElement = hasLabel && (
            <label
                htmlFor={textareaId}
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
                className={cn(styles.component, className)}
                style={{ '--textarea-rows': rows, ...style } as CSSProperties}
                data-view={view}
                data-block={block || undefined}
                data-disabled={disabled || undefined}
                data-read-only={readOnly || undefined}
                data-error={Boolean(error) || undefined}
                data-label-view={labelView}
                data-inner-label={(labelView === 'inner' && hasLabel) || undefined}
                data-inner-header={
                    (labelView === 'inner' && (hasLabel || showCounter)) || undefined
                }
                data-filled={hasValue || undefined}
                data-resize={(resize && !autosize && !disabled && !readOnly) || undefined}
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
                    <div className={styles.value}>
                        {labelView === 'inner' && (hasLabel || showCounter) && (
                            <div className={cn(styles.header, styles.innerHeader)}>
                                {labelElement}
                                {counterElement}
                            </div>
                        )}
                        <textarea
                            {...restProps}
                            ref={textareaRef}
                            id={textareaId}
                            value={value}
                            defaultValue={defaultValue}
                            rows={rows}
                            maxLength={maxLength}
                            disabled={disabled}
                            readOnly={readOnly}
                            onChange={handleChange}
                            className={cn(styles.textarea, textareaClassName)}
                            data-test-id={dataTestId}
                        />
                    </div>
                    {showClear && (
                        <Button
                            view="text"
                            size={32}
                            className={styles.clear}
                            title="Очистить поле"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={handleClear}
                            dataTestId={getDataTestId('clear')}
                        >
                            <CrossHeavyMIcon width={16} height={16} />
                        </Button>
                    )}
                </div>
                {Boolean(message) && (
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

Textarea.displayName = 'Textarea';
