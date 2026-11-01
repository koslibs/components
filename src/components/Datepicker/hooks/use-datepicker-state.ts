import {
    useEffect,
    useRef,
    useState,
    type FocusEvent,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent,
} from 'react';

import type { DatepickerProps, DatepickerRange } from '../types';

import { useDatepickerValue } from './use-datepicker-value';

export function useDatepickerState(props: DatepickerProps) {
    const mode = props.mode ?? 'single';

    const selection = useDatepickerValue(props);
    const [localOpen, setLocalOpen] = useState(props.defaultOpen ?? false);
    const [focused, setFocused] = useState(false);
    const [session, setSession] = useState(0);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const value = selection.value;
    const blocked = Boolean(props.disabled || props.readOnly);
    const open = !blocked && (props.open ?? localOpen);

    function setOpen(next: boolean) {
        if ((next && blocked) || next === open) return;
        if (props.open === undefined) setLocalOpen(next);

        props.onOpenChange?.(next);
    }

    function close(restoreFocus = false) {
        setOpen(false);
        // Even if a controlled parent keeps open=true, a cancelled draft is discarded.
        setSession((current) => current + 1);

        if (restoreFocus) buttonRef.current?.focus();
    }

    function apply(event: MouseEvent<HTMLButtonElement>, next: string | DatepickerRange | null) {
        if (blocked || !selection.commit(event, next)) return;

        close(true);
    }

    useEffect(() => {
        if (!open) return;

        const ownerDocument = buttonRef.current?.ownerDocument;

        const escape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;

            event.preventDefault();
            event.stopPropagation();
            close(true);
        };

        ownerDocument?.addEventListener('keydown', escape);

        return () => ownerDocument?.removeEventListener('keydown', escape);
    });

    const resetRef = useRef<VoidFunction>();

    resetRef.current = () => {
        selection.reset();
        close();
    };

    useEffect(() => {
        const form = buttonRef.current?.form;
        let active = true;

        const reset = (event: Event) => {
            queueMicrotask(() => {
                if (active && !event.defaultPrevented) resetRef.current?.();
            });
        };

        form?.addEventListener('reset', reset);

        return () => {
            active = false;
            form?.removeEventListener('reset', reset);
        };
    }, [props.form]);

    return {
        mode,
        value,
        open,
        blocked,
        buttonRef,
        popupRef,
        anchor,
        setAnchor,
        session,
        close,
        apply,
        raisedLabel: Boolean(value || open || (focused && !blocked)),

        handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
            if (event.key !== 'Escape' || event.defaultPrevented || !open) return;

            event.preventDefault();
            event.stopPropagation();
            close(true);
        },

        triggerProps: {
            onClick(event: MouseEvent<HTMLButtonElement>) {
                props.onClick?.(event);

                if (event.defaultPrevented || blocked) return;
                if (open) close();
                else setOpen(true);
            },

            onFocus(event: FocusEvent<HTMLButtonElement>) {
                setFocused(true);
                props.onFocus?.(event);
            },

            onBlur(event: FocusEvent<HTMLButtonElement>) {
                setFocused(false);
                props.onBlur?.(event);
            },
        },

        clear(event: MouseEvent<HTMLButtonElement>) {
            if (blocked) return;

            selection.clear();
            close();
            props.onClear?.(event);
            buttonRef.current?.focus();
        },
    };
}
