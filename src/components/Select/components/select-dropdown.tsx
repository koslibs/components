import { SearchIcon } from '@koslibs/icons/SearchIcon';
import { TickIcon } from '@koslibs/icons/TickIcon';
import cn from 'classnames';
import { useEffect, useRef } from 'react';

import { useDataTestId } from '../../../hooks/use-data-test-id';
import { Input } from '../../Input';
import { TypographyText } from '../../Typography/text';
import type { SelectState } from '../hooks/use-select-state';
import type { SelectProps } from '../types';

import styles from '../index.module.css';

type Props = Pick<
    SelectProps,
    'multiple' | 'searchable' | 'searchPlaceholder' | 'noResultsText' | 'dataTestId'
> & {
    state: SelectState;
};

export function SelectDropdown({
    state,
    multiple,
    searchable,
    searchPlaceholder = 'Поиск по списку',
    noResultsText = 'Ничего не найдено',
    dataTestId,
}: Props) {
    const getDataTestId = useDataTestId(dataTestId);
    const { options, selectedIds, search, activeId, setSearch, handleKeyDown, select } = state;
    const activeOptionRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        activeOptionRef.current?.scrollIntoView?.({ block: 'nearest' });
    }, [activeId]);

    return (
        <>
            {searchable && (
                <Input
                    block
                    autoFocus
                    size={40}
                    view="secondary"
                    value={search}
                    placeholder={searchPlaceholder}
                    leftAddon={<SearchIcon width={16} height={16} aria-hidden="true" />}
                    clear
                    clearLabel="close"
                    onChange={(_, { value }) => setSearch(value)}
                    onClear={() => setSearch('')}
                    onKeyDown={handleKeyDown}
                    className={styles.search}
                    dataTestId={getDataTestId('search')}
                />
            )}
            {options.length === 0 && (
                <div
                    className={cn(styles.listState, styles.listHint)}
                    data-test-id={getDataTestId('empty')}
                >
                    <TypographyText>{noResultsText}</TypographyText>
                    {search.trim() && (
                        <TypographyText size={12}>Измените поисковый запрос</TypographyText>
                    )}
                </div>
            )}
            {options.length > 0 && (
                <div className={styles.options} data-test-id={getDataTestId('options')}>
                    {options.map((option) => {
                        const selected = selectedIds.includes(option.id);
                        return (
                            <button
                                key={option.id}
                                type="button"
                                tabIndex={-1}
                                ref={
                                    option.id === activeId && !option.disabled
                                        ? activeOptionRef
                                        : undefined
                                }
                                className={cn(styles.option, {
                                    [styles.selected]: selected,
                                    [styles.active]: option.id === activeId && !option.disabled,
                                })}
                                disabled={option.disabled}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={(event) => select(option, event)}
                                data-test-id={getDataTestId(`option-${option.id}`)}
                                title={option.label}
                            >
                                <TypographyText
                                    size={13}
                                    rowLimit={1}
                                    className={styles.optionLabel}
                                >
                                    {option.label}
                                </TypographyText>
                                {(multiple || selected) && (
                                    <span
                                        className={cn(styles.marker, multiple && styles.checkbox)}
                                    >
                                        {selected && (
                                            <TickIcon
                                                width={multiple ? 14 : 18}
                                                height={multiple ? 14 : 18}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}
