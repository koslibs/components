import { afterEach, beforeEach, expect, test } from '@koslibs/builder/rstest';
import { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Skeleton } from '.';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

test('forwards layout, native attributes and ref', () => {
    const ref = createRef<HTMLDivElement>();
    act(() =>
        root.render(
            <Skeleton
                ref={ref}
                id="placeholder"
                className="custom"
                style={{ width: '60%', height: 176, borderRadius: 12 }}
                dataTestId="skeleton"
                data-region="media"
            />
        )
    );

    const element = container.firstElementChild as HTMLDivElement;
    expect(ref.current).toBe(element);
    expect(element.tagName).toBe('DIV');
    expect(element.id).toBe('placeholder');
    expect(element.classList.contains('custom')).toBe(true);
    expect(element.style.width).toBe('60%');
    expect(element.style.height).toBe('176px');
    expect(element.style.borderRadius).toBe('12px');
    expect(element.getAttribute('data-test-id')).toBe('skeleton');
    expect(element.getAttribute('data-region')).toBe('media');
    expect(element.childNodes.length).toBe(0);
    expect(element.hasAttribute('animated')).toBe(false);
    expect(element.hasAttribute('dataTestId')).toBe(false);

    act(() => root.render(<Skeleton ref={ref} animated={false} style={{ height: 24 }} />));
    expect(ref.current).toBe(element);
    expect(element.style.height).toBe('24px');
    expect(element.hasAttribute('animated')).toBe(false);
});
