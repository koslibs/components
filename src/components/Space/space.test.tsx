import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Space } from '.';

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

test('forwards ref, native attributes, handlers and custom styles without leaking layout props', () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = rstest.fn();
    act(() =>
        root.render(
            <Space
                ref={ref}
                direction="horizontal"
                align="center"
                size={12}
                wrap
                fullWidth
                id="actions"
                title="Actions"
                role="group"
                className="custom"
                style={{ width: 240 }}
                dataTestId="space"
                onClick={onClick}
            >
                <button type="button">Action</button>
            </Space>
        )
    );
    const element = container.firstElementChild as HTMLDivElement;
    expect(ref.current).toBe(element);
    expect(element.id).toBe('actions');
    expect(element.getAttribute('data-test-id')).toBe('space');
    expect(element.getAttribute('role')).toBe('group');
    expect(element.classList.contains('custom')).toBe(true);
    expect(element.style.width).toBe('240px');
    act(() => element.querySelector('button')!.click());
    expect(onClick).toHaveBeenCalledTimes(1);
    for (const prop of ['direction', 'align', 'size', 'wrap', 'fullWidth', 'dataTestId'])
        expect(element.hasAttribute(prop)).toBe(false);
});

test('preserves direct children through fragments, arrays and conditional rendering', () => {
    act(() =>
        root.render(
            <Space size={16}>
                <>
                    <span>First</span>
                    {false}
                    {null}
                </>
                {[<button key="second">Second</button>]}
                {0}
            </Space>
        )
    );
    const element = container.firstElementChild!;
    expect([...element.children].map((child) => child.tagName)).toEqual(['SPAN', 'BUTTON']);
    expect(element.textContent).toBe('FirstSecond0');
});

test('removes the container when all children are absent and restores it on update', () => {
    act(() =>
        root.render(
            <Space size={16}>
                {null}
                {false}
                {undefined}
            </Space>
        )
    );
    expect(container.childNodes.length).toBe(0);
    act(() =>
        root.render(
            <Space size={16}>
                <span>Ready</span>
            </Space>
        )
    );
    expect(container.firstElementChild?.firstElementChild?.textContent).toBe('Ready');
});
