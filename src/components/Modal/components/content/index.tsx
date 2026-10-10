import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes } from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import { ModalContext } from '../../context';

import styles from './index.module.css';

export type ContentProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Базовый идентификатор для автоматизированных тестов с суффиксом -content.
     * По умолчанию наследуется от ближайшего Modal; явно заданный имеет приоритет.
     */
    dataTestId?: string;
};

export const Content = forwardRef<HTMLDivElement, ContentProps>(
    ({ children, className, dataTestId, ...restProps }, ref) => {
        const { dataTestId: modalDataTestId } = useContext(ModalContext);
        const getDataTestId = useDataTestId(dataTestId ?? modalDataTestId);

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, className)}
                data-test-id={getDataTestId('content')}
            >
                {children}
            </div>
        );
    }
);

Content.displayName = 'ModalContent';
