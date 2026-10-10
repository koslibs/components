import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

// Layout measurement is only needed in the browser.
const useBrowserLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function useAutosize(
    ref: RefObject<HTMLTextAreaElement>,
    autosize: boolean,
    minRows: number,
    maxRows?: number,
    formId?: string
) {
    const updateRef = useRef<VoidFunction>();
    useBrowserLayoutEffect(() => {
        if (!autosize) return;
        const textarea = ref.current;
        if (!textarea) return;
        const doc = textarea.ownerDocument;
        const view = doc.defaultView;
        if (!view) return;

        // Measure a separate element so the focused field never collapses or loses its scroll.
        const measure = doc.createElement('textarea');
        measure.tabIndex = -1;
        Object.assign(measure.style, {
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            height: '0',
            minHeight: '0',
            maxHeight: 'none',
            padding: '0',
            border: '0',
            boxSizing: 'content-box',
            overflow: 'hidden',
            top: '0',
            left: '0',
        });
        doc.body.append(measure);

        const update = () => {
            const computed = view.getComputedStyle(textarea);
            const width = textarea.clientWidth;
            if (!width) return;
            Object.assign(measure.style, {
                width: `${width}px`,
                fontFamily: computed.fontFamily,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                fontStyle: computed.fontStyle,
                lineHeight: computed.lineHeight,
                letterSpacing: computed.letterSpacing,
                textIndent: computed.textIndent,
                textTransform: computed.textTransform,
                wordBreak: computed.wordBreak,
                overflowWrap: computed.overflowWrap,
            });
            measure.wrap = textarea.wrap;
            const lineHeight = parseFloat(computed.lineHeight);
            if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;
            measure.value = textarea.value || textarea.placeholder || ' ';
            const height = Math.min(
                Math.max(measure.scrollHeight, minRows * lineHeight),
                maxRows === undefined ? Infinity : maxRows * lineHeight
            );
            textarea.style.height = `${height}px`;
        };

        update();
        updateRef.current = update;
        const handleInput = () => {
            // React may restore a controlled value after the native input event.
            queueMicrotask(() => {
                if (measure.isConnected) update();
            });
        };
        textarea.addEventListener('input', handleInput);
        const handleReset = (event: Event) => {
            setTimeout(() => {
                if (measure.isConnected && !event.defaultPrevented) update();
            }, 0);
        };
        const form = textarea.form;
        form?.addEventListener('reset', handleReset);
        // Width changes can come from a parent layout or the clear button, not just the window.
        let previousWidth = textarea.clientWidth;
        const observer =
            typeof ResizeObserver === 'undefined'
                ? undefined
                : new ResizeObserver(() => {
                      const width = textarea.clientWidth;
                      if (width !== previousWidth) {
                          previousWidth = width;
                          update();
                      }
                  });
        observer?.observe(textarea);
        view.addEventListener('resize', update);
        doc.fonts?.addEventListener('loadingdone', update);
        return () => {
            observer?.disconnect();
            view.removeEventListener('resize', update);
            textarea.removeEventListener('input', handleInput);
            form?.removeEventListener('reset', handleReset);
            doc.fonts?.removeEventListener('loadingdone', update);
            measure.remove();
            updateRef.current = undefined;
        };
    }, [ref, autosize, minRows, maxRows, formId]);

    // Controlled updates and changes to label/placeholder can occur without an input event.
    useBrowserLayoutEffect(() => {
        updateRef.current?.();
    });

    useBrowserLayoutEffect(() => {
        if (!autosize) ref.current?.style.removeProperty('height');
    }, [ref, autosize, minRows]);
}
