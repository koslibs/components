import cn from 'classnames';
import { forwardRef } from 'react';

import type { SkeletonProps } from './types';

import styles from './index.module.css';

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ animated = true, className, dataTestId, ...restProps }, ref) => (
        <div
            {...restProps}
            ref={ref}
            className={cn(styles.component, { [styles.animated]: animated }, className)}
            data-test-id={dataTestId}
        />
    )
);

Skeleton.displayName = 'Skeleton';
