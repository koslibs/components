import cn from 'classnames';
import React, {
    forwardRef,
    useEffect,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type ReactNode,
} from 'react';

import { Spinner } from '../Spinner';

import colorStyles from './colors.module.css';
import styles from './index.module.css';

type ButtonOwnProps = {
    /**
     * Тип кнопки
     * @default 'primary'
     */
    view?: 'primary' | 'secondary' | 'accent' | 'outlined' | 'transparent' | 'text';

    /**
     * Скругление кнопки
     * @default 'rectangular'
     */
    shape?: 'rectangular' | 'rounded';

    /**
     * Размер кнопки
     * @default 40
     */
    size?: 32 | 40 | 48 | 56 | 64 | 72;

    /**
     * Аддон слева от лейбла
     */
    leftAddon?: ReactNode;

    /**
     * Аддон справа от лейбла
     */
    rightAddon?: ReactNode;

    /**
     * Подпись под основным текстом
     */
    hint?: string;

    /**
     * Заставляет кнопку растянуться на ширину контейнера.
     * @default false
     */
    block?: boolean;

    /**
     * Показать лоадер
     * @default false
     */
    loading?: boolean;

    /**
     * Айди для автотестов.
     */
    dataTestId?: string;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для label
     */
    labelClassName?: string;

    /**
     * Дополнительный класс для hint
     */
    hintClassName?: string;

    /**
     * Дополнительный класс для спиннера
     */
    spinnerClassName?: string;

    /**
     * Текст кнопки
     */
    children?: ReactNode;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonOwnProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            view = 'primary',
            shape = 'rectangular',
            size = 40,
            leftAddon,
            rightAddon,
            hint,
            block = false,
            loading = false,
            dataTestId,
            className,
            labelClassName,
            hintClassName,
            spinnerClassName,
            children,
            onClick,
            ...restProps
        },
        ref
    ) => {
        const [loaderTimePassed, setLoaderTimePassed] = useState(true);

        const timerId = useRef(0);

        const showLoader = loading || !loaderTimePassed;

        const showHint = hint && [56, 64, 72].includes(size);

        const { disabled, type = 'button', ...restButtonProps } = restProps;

        const buttonChildren = (
            <React.Fragment>
                {leftAddon && <span className={styles.addons}>{leftAddon}</span>}
                {children && (
                    <span
                        className={cn(styles.label, labelClassName, {
                            [styles.stretchText]: !(leftAddon || rightAddon),
                        })}
                    >
                        {children}
                        {showHint && (
                            <span className={cn(styles.hint, colorStyles.hint, hintClassName)}>
                                {hint}
                            </span>
                        )}
                    </span>
                )}

                {showLoader && (
                    <Spinner
                        size={24}
                        dataTestId={dataTestId ? `${dataTestId}-loader` : undefined}
                        visible={true}
                        className={cn(styles.loader, colorStyles.loader, spinnerClassName)}
                    />
                )}

                {rightAddon && <span className={styles.addons}>{rightAddon}</span>}
            </React.Fragment>
        );

        useEffect(() => {
            if (loading) {
                window.clearTimeout(timerId.current);
                setLoaderTimePassed(false);

                timerId.current = window.setTimeout(() => {
                    setLoaderTimePassed(true);
                }, 500);
            }
        }, [loading]);

        useEffect(
            () => () => {
                window.clearTimeout(timerId.current);
            },
            []
        );

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled || showLoader) {
                e.preventDefault();
                e.stopPropagation();

                return;
            }
            onClick?.(e);
        };

        return (
            <button
                {...restButtonProps}
                className={cn(
                    styles.component,
                    styles[view],
                    styles[`size-${size}`],
                    styles[shape],
                    colorStyles.component,
                    colorStyles[view],
                    {
                        [styles.block]: block,
                        [styles.loading]: showLoader,
                        [styles.withRightAddon]: Boolean(rightAddon),
                        [styles.withLeftAddon]: Boolean(leftAddon),
                        [colorStyles.loading]: showLoader,
                    },
                    className
                )}
                data-test-id={dataTestId}
                data-block={block || undefined}
                type={type}
                disabled={disabled || showLoader}
                aria-busy={showLoader}
                onClick={handleClick}
                ref={ref}
            >
                {buttonChildren}
            </button>
        );
    }
);

Button.displayName = 'Button';
