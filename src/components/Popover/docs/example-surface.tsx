import cn from 'classnames';
import type { ReactNode } from 'react';

import styles from './examples.module.css';

export type ExampleAppearance = 'default' | 'inverted';

// Decoration belongs to the example's content, independently of Popover.
export function ExampleSurface({
    children,
    appearance = 'default',
    dataTestId,
}: {
    children: ReactNode;
    appearance?: ExampleAppearance;
    dataTestId?: string;
}) {
    return (
        <div
            className={cn(styles.surface, appearance === 'inverted' && styles.inverted)}
            data-test-id={dataTestId}
        >
            {children}
        </div>
    );
}
