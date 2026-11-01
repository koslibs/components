import cn from 'classnames';
import { forwardRef, useId, useImperativeHandle } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { TypographyText } from '../Typography/text';

import { useChipsState } from './hooks/use-chips-state';
import type { ChipsProps } from './types';

import styles from './index.module.css';

export const Chips = forwardRef<HTMLFieldSetElement, ChipsProps>((props, ref) => {
    const {
        items,
        multiselect = false,
        value: _value,
        defaultValue: _defaultValue,
        onChange: _onChange,
        disabled = false,
        form,
        className,
        listClassName,
        itemClassName,
        dataTestId,
        ...restProps
    } = props;

    const groupName = useId();
    const getId = useDataTestId(dataTestId);
    const state = useChipsState(props);

    useImperativeHandle(ref, () => state.groupRef.current!, []);

    return (
        <fieldset
            {...restProps}
            ref={state.groupRef}
            form={form}
            disabled={disabled}
            className={cn(styles.component, className)}
            data-test-id={dataTestId}
        >
            <div className={cn(styles.list, listClassName)}>
                {items.map((item) => (
                    <label key={item.value} className={styles.item}>
                        <input
                            type={multiselect ? 'checkbox' : 'radio'}
                            name={groupName}
                            form={groupName}
                            value={item.value}
                            checked={state.selected.has(item.value)}
                            disabled={disabled || item.disabled}
                            onChange={state.handleChange}
                            className={styles.input}
                            data-test-id={getId(item.value)}
                        />
                        <TypographyText size={14} className={cn(styles.chip, itemClassName)}>
                            {item.label}
                        </TypographyText>
                    </label>
                ))}
            </div>
        </fieldset>
    );
});

Chips.displayName = 'Chips';
