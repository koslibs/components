import { forwardRef } from 'react';

import { Portal } from '../Portal';

import { ModalSurface } from './components/modal-surface';
import type { ModalProps } from './types';

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    ({ open, getPortalContainer, ...restProps }, ref) => {
        return open ? (
            <Portal getPortalContainer={getPortalContainer}>
                <ModalSurface {...restProps} ref={ref} />
            </Portal>
        ) : null;
    }
);

Modal.displayName = 'Modal';
