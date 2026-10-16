import type { HTMLAttributes } from 'react';

export type SkeletonProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML'
> & {
    /**
     * Включает пульсацию.
     * @default true
     */
    animated?: boolean;

    /**
     * Skeleton не содержит дочерних элементов.
     */
    children?: never;

    /**
     * Идентификатор корневого элемента для тестов.
     */
    dataTestId?: string;
};
