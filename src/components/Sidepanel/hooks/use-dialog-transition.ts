import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';

function milliseconds(value: string) {
    return (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000);
}

function transitionTime(dialog: HTMLDialogElement) {
    const style = dialog.ownerDocument.defaultView?.getComputedStyle(dialog);
    const durations = style?.transitionDuration.split(',').map(milliseconds) ?? [0];
    const delays = style?.transitionDelay.split(',').map(milliseconds) ?? [0];

    return Math.max(
        0,
        ...durations.map((duration, index) => duration + delays[index % delays.length])
    );
}

export function useDialogTransition(
    dialogRef: RefObject<HTMLDialogElement>,
    open: boolean,
    onExited: VoidFunction
) {
    const [active, setActive] = useState(open);
    const latest = useRef({ open, onExited });

    useLayoutEffect(() => {
        latest.current = { open, onExited };
    }, [open, onExited]);

    const finishClosing = useCallback(() => {
        const dialog = dialogRef.current;
        if (!dialog || latest.current.open) return;
        if (dialog.open) dialog.close();
        setActive(false);
        latest.current.onExited();
    }, [dialogRef]);

    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        const view = dialog?.ownerDocument.defaultView;
        if (!dialog || !view) return;

        let frame: number | undefined;
        let timeout: number | undefined;

        if (open) {
            if (!dialog.open) {
                dialog.dataset.state = 'closed';
                dialog.showModal();
                // Commit the offscreen position before starting the CSS transition.
                dialog.getBoundingClientRect();
            }
            setActive(true);
            frame = view.requestAnimationFrame(() => {
                dialog.dataset.state = 'open';
            });
        } else if (dialog.open && dialog.dataset.state === 'open') {
            dialog.dataset.state = 'closed';
            const duration = transitionTime(dialog);
            if (duration === 0) finishClosing();
            // Also finish if transitionend is suppressed, e.g. in a background tab.
            else timeout = view.setTimeout(finishClosing, duration + 50);
        } else {
            finishClosing();
        }

        return () => {
            if (frame !== undefined) view.cancelAnimationFrame(frame);
            if (timeout !== undefined) view.clearTimeout(timeout);
        };
    }, [dialogRef, finishClosing, open]);

    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        return () => {
            if (dialog?.open) dialog.close();
        };
    }, [dialogRef]);

    return { active, finishClosing };
}
