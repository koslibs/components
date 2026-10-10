import { createContext } from 'react';

type ModalContextValue = {
    onClose?: VoidFunction;
    dataTestId?: string;
};

export const ModalContext = createContext<ModalContextValue>({});
