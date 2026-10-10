import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes } from 'react';

import { ModalContext } from '../../context';

import styles from './index.module.css';

export type FooterProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Базовый идентификатор для автоматизированных тестов с суффиксом -footer.
     * По умолчанию наследуется от ближайшего Modal; явно заданный имеет приоритет.
     */
    dataTestId?: string;
};

export const Footer = forwardRef<HTMLDivElement, FooterProps>(
    ({ children, className, dataTestId, ...restProps }, ref) => {
        const { dataTestId: modalDataTestId } = useContext(ModalContext);
        const testId = dataTestId ?? modalDataTestId;

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, className)}
                data-test-id={testId ? `${testId}-footer` : undefined}
            >
                {children}
            </div>
        );
    }
);

Footer.displayName = 'ModalFooter';
