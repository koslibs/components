type Lock = {
    count: number;
    overflow: string;
    paddingRight: string;
    paddingLeft: string;
    gutter?: { value: string; priority: string };
};

const locks = new WeakMap<Document, Lock>();

export function lockScroll(document: Document, removeScrollbarGutter = false) {
    const { body, documentElement, defaultView } = document;
    const existing = locks.get(document);

    if (existing) {
        existing.count += 1;
    } else {
        locks.set(document, {
            count: 1,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
            paddingLeft: body.style.paddingLeft,
        });

        const scrollbarWidth = (defaultView?.innerWidth ?? 0) - documentElement.clientWidth;
        const hasStableGutter = defaultView
            ?.getComputedStyle(documentElement)
            .scrollbarGutter?.split(/\s+/)
            .includes('stable');

        // A stable root gutter keeps its space when scrolling is locked.
        if (scrollbarWidth > 0 && defaultView && !hasStableGutter) {
            const paddingRight = parseFloat(defaultView.getComputedStyle(body).paddingRight) || 0;
            body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
        }

        body.style.overflow = 'hidden';
    }

    const gutterLock = locks.get(document)!;
    if (
        removeScrollbarGutter &&
        !gutterLock.gutter &&
        defaultView?.getComputedStyle(documentElement).scrollbarGutter?.includes('stable')
    ) {
        // Native dialogs are clipped by the root gutter. Remove it for an edge-to-edge
        // panel while preserving the page's content position, including both-edges.
        const before = documentElement.getBoundingClientRect();
        const paddingLeft = parseFloat(defaultView.getComputedStyle(body).paddingLeft) || 0;
        const paddingRight = parseFloat(defaultView.getComputedStyle(body).paddingRight) || 0;
        gutterLock.gutter = {
            value: documentElement.style.getPropertyValue('scrollbar-gutter'),
            priority: documentElement.style.getPropertyPriority('scrollbar-gutter'),
        };
        documentElement.style.setProperty('scrollbar-gutter', 'auto', 'important');
        const after = documentElement.getBoundingClientRect();
        body.style.paddingLeft = `${paddingLeft + Math.max(0, before.left - after.left)}px`;
        body.style.paddingRight = `${paddingRight + Math.max(0, after.right - before.right)}px`;
    }

    return () => {
        const lock = locks.get(document);

        if (!lock) return;

        lock.count -= 1;

        if (lock.count === 0) {
            body.style.overflow = lock.overflow;
            body.style.paddingRight = lock.paddingRight;
            body.style.paddingLeft = lock.paddingLeft;
            if (lock.gutter) {
                if (lock.gutter.value) {
                    documentElement.style.setProperty(
                        'scrollbar-gutter',
                        lock.gutter.value,
                        lock.gutter.priority
                    );
                } else {
                    documentElement.style.removeProperty('scrollbar-gutter');
                }
            }
            locks.delete(document);
        }
    };
}
