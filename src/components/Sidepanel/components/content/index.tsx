import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes } from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import { SidepanelContext } from '../../context';

import layoutStyles from '../../index.module.css';
import scrollbarStyles from '../../scrollbar.module.css';
import styles from './index.module.css';

export type ContentProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Базовый идентификатор части -content. По умолчанию наследуется от Sidepanel.
     */
    dataTestId?: string;
};

export const Content = forwardRef<HTMLDivElement, ContentProps>(
    ({ className, dataTestId, children, ...restProps }, ref) => {
        const { dataTestId: panelDataTestId } = useContext(SidepanelContext);
        const getDataTestId = useDataTestId(dataTestId ?? panelDataTestId);

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(
                    styles.component,
                    layoutStyles.content,
                    scrollbarStyles.scrollbar,
                    className
                )}
                data-test-id={getDataTestId('content')}
            >
                {children}
            </div>
        );
    }
);

Content.displayName = 'SidepanelContent';
