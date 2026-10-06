import { createElement, forwardRef } from 'react';

import { getClassName, type TitleElement, type TitleProps } from './shared';

export const TypographyTitle = forwardRef<TitleElement, TitleProps>(
    (
        {
            size = 28,
            tag,
            weight = 'bold',
            color = 'inherit',
            caps = false,
            monospaceNumbers = false,
            rowLimit,
            className,
            dataTestId,
            children,
            ...restProps
        },
        ref
    ) =>
        createElement(
            tag,
            {
                ...restProps,
                ref,
                className: getClassName({
                    size,
                    weight,
                    color,
                    caps,
                    monospaceNumbers,
                    rowLimit,
                    className,
                }),
                'data-test-id': dataTestId,
            },
            children
        )
);

TypographyTitle.displayName = 'TypographyTitle';
