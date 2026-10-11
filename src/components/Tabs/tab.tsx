import cn from 'classnames';
import { useContext } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { TypographyText } from '../Typography/text';

import { TabsContext } from './context';
import type { TabProps } from './types';

import styles from './index.module.css';

/**
 * Кнопка вкладки с заголовком, счётчиком и состоянием выбора из Tabs.
 * Содержимое выбранной вкладки отображается отдельно в приложении.
 */
export const Tab = ({ id, title, count, disabled = false }: TabProps) => {
    const context = useContext(TabsContext);
    const getDataTestId = useDataTestId(context?.dataTestId);

    if (!context) {
        throw new Error('Tab must be rendered inside Tabs.');
    }

    const { selectedId, size, registerTab, selectTab } = context;

    const selected = id === selectedId;

    return (
        <button
            ref={(button) => registerTab(id, button)}
            type="button"
            disabled={disabled}
            className={cn(styles.tab, styles[`size${size}`], { [styles.selected]: selected })}
            onClick={(event) => selectTab(id, event)}
            data-test-id={getDataTestId(`tab-${id}`)}
        >
            <TypographyText size={14} weight="medium">
                {title}
            </TypographyText>
            {count !== undefined && Number.isInteger(count) && count >= 0 && (
                <TypographyText size={11} className={styles.counter}>
                    {count}
                </TypographyText>
            )}
        </button>
    );
};

Tab.displayName = 'Tab';
