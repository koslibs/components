import { createContext } from 'react';

import type { TabsProps } from './types';

type TabsContextValue = {
    selectedId?: string;
    size: NonNullable<TabsProps['size']>;
    dataTestId?: string;
    registerTab: (id: string, button: HTMLButtonElement | null) => void;
    selectTab: (id: string, event: Parameters<NonNullable<TabsProps['onChange']>>[0]) => void;
};

export const TabsContext = createContext<TabsContextValue | null>(null);
