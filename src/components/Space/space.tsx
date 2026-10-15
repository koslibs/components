import cn from 'classnames';
import { Children, forwardRef, type CSSProperties } from 'react';

import type { SpaceProps } from './types';

import styles from './index.module.css';

export const Space = forwardRef<HTMLDivElement, SpaceProps>(
    (
        {
            children,
            direction = 'vertical',
            size,
            align = 'start',
            wrap = false,
            fullWidth = false,
            className,
            style,
            dataTestId,
            ...restProps
        },
        ref
    ) => {
        if (Children.toArray(children).length === 0) {
            return null;
        }

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(
                    styles.component,
                    styles[direction],
                    styles[align],
                    {
                        [styles.wrap]: wrap,
                        [styles.fullWidth]: fullWidth,
                    },
                    className
                )}
                style={
                    {
                        '--space-gap': `var(--size-${size})`,
                        ...style,
                    } as CSSProperties
                }
                data-test-id={dataTestId}
            >
                {children}
            </div>
        );
    }
);

Space.displayName = 'Space';
