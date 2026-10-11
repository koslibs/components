import cn from 'classnames';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { TypographyText } from '../Typography/text';

import styles from './index.module.css';

export type StatusProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> & {
    /**
     * Высота плашки в пикселях.
     * @default 24
     */
    size?: 20 | 24 | 32 | 40;

    /**
     * Форма плашки.
     * @default 'rectangular'
     */
    shape?: 'rounded' | 'rectangular';

    /**
     * Цвет фона, подписи и аддонов.
     * @default 'grey'
     */
    color?: 'green' | 'orange' | 'red' | 'blue' | 'grey' | 'teal' | 'purple' | 'sand';

    /**
     * Короткая подпись статуса. При ограничении ширины сокращается многоточием.
     */
    message: string;

    /**
     * Отображать подпись заглавными буквами.
     * @default false
     */
    uppercase?: boolean;

    /**
     * Декоративный элемент слева от подписи, скрытый от скринридера.
     */
    leftAddon?: ReactNode;

    /**
     * Декоративный элемент справа от подписи, скрытый от скринридера.
     */
    rightAddon?: ReactNode;

    /**
     * Дополнительный CSS-класс подписи.
     */
    labelClassName?: string;

    /**
     * Идентификатор корневого элемента для тестов.
     */
    dataTestId?: string;
};

function hasAddon(addon: ReactNode) {
    return addon !== null && addon !== undefined && typeof addon !== 'boolean';
}

export const Status = forwardRef<HTMLSpanElement, StatusProps>(
    (
        {
            size = 24,
            shape = 'rectangular',
            color = 'grey',
            leftAddon,
            rightAddon,
            message,
            uppercase = false,
            className,
            labelClassName,
            dataTestId,
            ...restProps
        },
        ref
    ) => (
        <span
            {...restProps}
            ref={ref}
            className={cn(
                styles.component,
                styles[`size-${size}`],
                styles[shape],
                styles[color],
                className
            )}
            data-test-id={dataTestId}
        >
            {hasAddon(leftAddon) && (
                <span className={styles.addon} aria-hidden="true">
                    {leftAddon}
                </span>
            )}
            <TypographyText
                size={size <= 24 ? 12 : 14}
                weight="medium"
                caps={uppercase}
                className={cn(styles.label, labelClassName)}
            >
                {message}
            </TypographyText>
            {hasAddon(rightAddon) && (
                <span className={styles.addon} aria-hidden="true">
                    {rightAddon}
                </span>
            )}
        </span>
    )
);

Status.displayName = 'Status';
