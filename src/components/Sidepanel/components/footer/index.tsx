import cn from 'classnames';
import { forwardRef, useContext, type ComponentType, type HTMLAttributes } from 'react';

import { useDataTestId } from '../../../../hooks/use-data-test-id';
import type { ButtonProps } from '../../../Button';
import { SidepanelContext } from '../../context';

import layoutStyles from '../../index.module.css';
import styles from './index.module.css';

export type FooterProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML'
> & {
    /**
     * Компонент основной кнопки. Обязателен; располагается после secondary (справа в строке).
     * Внешний вид и обработчики задаются внутри переданного компонента.
     */
    primary: ComponentType<ButtonProps>;

    /**
     * Компонент вторичной кнопки. Располагается перед primary (слева в строке).
     * Не выводится, если проп не передан.
     */
    secondary?: ComponentType<ButtonProps>;

    /**
     * Минимальное расстояние между кнопками в пикселях из общей шкалы отступов.
     * @default 12
     */
    gap?: 12 | 16 | 24 | 32;

    /**
     * Оставляет кнопки видимыми при прокрутке. При false Footer прокручивается с Content.
     * @default true
     */
    sticky?: boolean;

    /**
     * Выравнивание кнопок. В space-between кнопки находятся у противоположных краёв,
     * единственная primary — справа. В column secondary находится над primary.
     * @default 'space-between'
     */
    layout?: 'start' | 'end' | 'center' | 'space-between' | 'column';

    /**
     * Базовый идентификатор части -footer. По умолчанию наследуется от Sidepanel.
     */
    dataTestId?: string;
};

export const Footer = forwardRef<HTMLDivElement, FooterProps>(
    (
        {
            primary: Primary,
            secondary: Secondary,
            gap = 12,
            sticky = true,
            layout = 'space-between',
            className,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        const { dataTestId: panelDataTestId } = useContext(SidepanelContext);
        const getDataTestId = useDataTestId(dataTestId ?? panelDataTestId);

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(
                    styles.component,
                    styles[layout],
                    styles[`gap-${gap}`],
                    { [layoutStyles.nonStickyFooter]: !sticky },
                    className
                )}
                data-test-id={getDataTestId('footer')}
            >
                {Secondary && <Secondary />}
                <Primary />
            </div>
        );
    }
);

Footer.displayName = 'SidepanelFooter';
