import { createElement, forwardRef } from 'react';

import { getClassName, type TextElement, type TextProps } from './shared';

export const TypographyText = forwardRef<TextElement, TextProps>(
    (
        {
            size = 13,
            tag = 'span',
            weight = 'regular',
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

TypographyText.displayName = 'TypographyText';
