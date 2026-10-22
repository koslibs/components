import { CrossHeavyMIcon } from '@koslibs/icons/CrossHeavyMIcon';
import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes } from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import { Button } from '../../../Button';
import { TypographyText } from '../../../Typography';
import { SidepanelContext } from '../../context';

import layoutStyles from '../../index.module.css';
import styles from './index.module.css';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
    /**
     * Необязательный заголовок панели. Без заголовка и крестика Header не выводится.
     */
    title?: string;

    /**
     * Показывает крестик, который вызывает onClose ближайшего Sidepanel.
     * @default true
     */
    hasCloser?: boolean;

    /**
     * Базовый идентификатор частей -header и -closer.
     * По умолчанию наследуется от Sidepanel.
     */
    dataTestId?: string;
};

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
    ({ title, hasCloser = true, className, dataTestId, ...restProps }, ref) => {
        const { onClose, dataTestId: panelDataTestId } = useContext(SidepanelContext);
        const getDataTestId = useDataTestId(dataTestId ?? panelDataTestId);

        if (!title?.trim() && !hasCloser) {
            return null;
        }

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, layoutStyles.header, className)}
                data-test-id={getDataTestId('header')}
            >
                <div className={styles.title}>
                    {title && (
                        <TypographyText size={20} weight="semibold">
                            {title}
                        </TypographyText>
                    )}
                </div>
                {hasCloser && (
                    <Button
                        size={32}
                        view="transparent"
                        className={styles.closer}
                        labelClassName={styles.closerLabel}
                        onClick={onClose}
                        dataTestId={getDataTestId('closer')}
                    >
                        <CrossHeavyMIcon width={24} height={24} />
                    </Button>
                )}
            </div>
        );
    }
);

Header.displayName = 'SidepanelHeader';
