import cn from 'classnames';
import { forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react';
import React from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import { ModalContext } from '../../context';

import styles from './index.module.css';

export type ControlsProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Основное действие, отображается после дополнительного.
     */
    primary?: ReactNode;

    /**
     * Дополнительное действие.
     */
    secondary?: ReactNode;

    /**
     * Выравнивание действий.
     * В строковых раскладках block-кнопки делят свободную ширину поровну.
     * В column кнопки занимают всю ширину и располагаются друг под другом.
     * @default 'end'
     */
    layout?: 'start' | 'end' | 'center' | 'space-between' | 'column';

    /**
     * Расстояние между действиями.
     * @default 12
     */
    gap?: 8 | 12 | 16 | 24;

    /**
     * Базовый идентификатор для автоматизированных тестов с суффиксом -controls.
     * По умолчанию наследуется от ближайшего Modal; явно заданный имеет приоритет.
     */
    dataTestId?: string;
};

export const Controls = forwardRef<HTMLDivElement, ControlsProps>(
    (
        {
            primary,
            secondary,
            layout = 'end',
            gap = 12,
            className,
            children,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        const { dataTestId: modalDataTestId } = useContext(ModalContext);
        const getDataTestId = useDataTestId(dataTestId ?? modalDataTestId);

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, styles[layout], styles[`gap-${gap}`], className)}
                data-test-id={getDataTestId('controls')}
            >
                {children ?? (
                    <React.Fragment>
                        {secondary}
                        {primary}
                    </React.Fragment>
                )}
            </div>
        );
    }
);

Controls.displayName = 'ModalControls';
