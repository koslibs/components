type Lock = { count: number; overflow: string; paddingRight: string };

const locks = new WeakMap<Document, Lock>();

export function lockScroll(document: Document) {
    const { body, documentElement, defaultView } = document;
    const existing = locks.get(document);

    if (existing) {
        existing.count += 1;
    } else {
        locks.set(document, {
            count: 1,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
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

    return () => {
        const lock = locks.get(document);

        if (!lock) return;

        lock.count -= 1;

        if (lock.count === 0) {
            body.style.overflow = lock.overflow;
            body.style.paddingRight = lock.paddingRight;
            locks.delete(document);
        }
    };
}
