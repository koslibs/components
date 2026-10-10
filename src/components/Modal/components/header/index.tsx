import { CrossHeavyMIcon } from '@koslibs/icons/CrossHeavyMIcon';
import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes } from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import { Button } from '../../../Button';
import { TypographyText } from '../../../Typography';
import { ModalContext } from '../../context';

import styles from './index.module.css';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClose' | 'children'> & {
    /**
     * Заголовок окна.
     */
    title?: string;

    /**
     * Описание под заголовком.
     */
    subtitle?: string;

    /**
     * Показывать кнопку закрытия.
     * Кнопка вызывает onClose ближайшего Modal.
     * @default true
     */
    hasCloser?: boolean;

    /**
     * Базовый идентификатор для автоматизированных тестов с суффиксом -header.
     * По умолчанию наследуется от ближайшего Modal; явно заданный имеет приоритет.
     */
    dataTestId?: string;
};

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
    ({ title, subtitle, hasCloser = true, className, dataTestId, ...restProps }, ref) => {
        const { onClose, dataTestId: modalDataTestId } = useContext(ModalContext);
        const getDataTestId = useDataTestId(dataTestId ?? modalDataTestId);

        const handleClick = () => {
            onClose?.();
        };

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, className)}
                data-test-id={getDataTestId('header')}
            >
                <div className={styles.content}>
                    {Boolean(title) && (
                        <TypographyText size={20} weight="semibold">
                            {title}
                        </TypographyText>
                    )}
                    {Boolean(subtitle) && (
                        <TypographyText size={14} color="secondary">
                            {subtitle}
                        </TypographyText>
                    )}
                </div>
                {hasCloser && (
                    <Button
                        size={32}
                        view="transparent"
                        className={styles.closer}
                        labelClassName={styles.closerLabel}
                        aria-label="Закрыть окно"
                        onClick={handleClick}
                    >
                        <CrossHeavyMIcon width={18} height={18} aria-hidden="true" />
                    </Button>
                )}
            </div>
        );
    }
);

Header.displayName = 'ModalHeader';
