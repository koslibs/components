import { useCallback } from 'react';

/**
 * Создаёт идентификаторы частей компонента с суффиксом.
 * Без базового dataTestId или при пустой строке возвращает undefined.
 */
export function useDataTestId(dataTestId?: string) {
    return useCallback(
        (suffix: string) => (dataTestId ? `${dataTestId}-${suffix}` : undefined),
        [dataTestId]
    );
}
