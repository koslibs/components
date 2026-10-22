import { createContext } from 'react';

type SidepanelContextValue = {
    onClose?: VoidFunction;
    dataTestId?: string;
};

export const SidepanelContext = createContext<SidepanelContextValue>({});
