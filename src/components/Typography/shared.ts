import cn from 'classnames';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import colorStyles from './colors.module.css';
import styles from './index.module.css';
import presetStyles from './preset.module.css';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyColor =
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'inverse'
    | 'positive'
    | 'negative';

export type BaseProps = Omit<
    HTMLAttributes<HTMLElement>,
    'color' | 'children' | 'className' | 'style'
> & {
    /**
     * Содержимое текста или заголовка.
     */
    children?: ReactNode;

    /**
     * Дополнительный CSS-класс корневого элемента.
     */
    className?: string;

    /**
     * Инлайн-стили корневого элемента.
     */
    style?: CSSProperties;

    /**
     * Цвет текста. По умолчанию наследуется от родителя.
     */
    color?: TypographyColor;

    /**
     * Толщина шрифта.
     */
    weight?: TypographyWeight;

    /**
     * Преобразовать текст в верхний регистр.
     */
    caps?: boolean;

    /**
     * Сделать цифры одинаковой ширины для таблиц и показателей.
     */
    monospaceNumbers?: boolean;

    /**
     * Ограничить число видимых строк, сохранив полный текст в DOM.
     */
    rowLimit?: 1 | 2 | 3;

    /**
     * Идентификатор для автоматизированных тестов.
     */
    dataTestId?: string;
};

export type TextProps = BaseProps & {
    /**
     * Размер шрифта в пикселях.
     * @default 13
     */
    size?: 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 20;

    /**
     * HTML-тег, определяющий семантику текста.
     * @default span
     */
    tag?: 'span' | 'p' | 'div' | 'li';
};

export type TitleProps = BaseProps & {
    /**
     * Размер шрифта в пикселях.
     * @default 28
     */
    size?: 13 | 14 | 16 | 20 | 24 | 28 | 32;

    /**
     * Уровень заголовка выбирается независимо от визуального размера.
     */
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
};

export type TextElement = HTMLSpanElement | HTMLParagraphElement | HTMLDivElement | HTMLLIElement;
export type TitleElement = HTMLHeadingElement | HTMLDivElement;

export const getClassName = ({
    size,
    weight,
    color,
    caps,
    monospaceNumbers,
    rowLimit,
    className,
}: BaseProps & { size: number }) =>
    cn(
        styles.component,
        presetStyles[`size-${size}`],
        weight && styles[`weight-${weight}`],
        color && colorStyles[color],
        {
            [styles.caps]: caps,
            [styles.monospaceNumbers]: monospaceNumbers,
            [styles[`rowLimit${rowLimit}`]]: rowLimit,
        },
        className
    );
