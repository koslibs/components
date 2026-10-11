import { afterEach, beforeEach, expect, test } from '@koslibs/builder/rstest';
import { act, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Status } from '.';

import styles from './index.module.css';

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

function render(children: ReactNode) {
    act(() => root.render(children));
    return container.firstElementChild as HTMLSpanElement;
}

test('static status preserves its full label without adding focus or live-region semantics', () => {
    const label = 'Ожидает подтверждения администратором';
    const element = render(<Status message={label} />);
    expect(element.tagName).toBe('SPAN');
    expect(element.textContent).toBe(label);
    expect(element.classList.contains(styles['size-24'])).toBe(true);
    expect(element.classList.contains(styles.rectangular)).toBe(true);
    expect(element.classList.contains(styles.grey)).toBe(true);
    expect(element.children.length).toBe(1);
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('aria-live')).toBeNull();
    expect(element.getAttribute('tabindex')).toBeNull();
});

test('forwards the span ref and native attributes while consuming component props', () => {
    const ref = createRef<HTMLSpanElement>();
    const element = render(
        <Status
            ref={ref}
            size={40}
            shape="rounded"
            color="sand"
            id="result"
            className="custom"
            labelClassName="custom-label"
            dataTestId="status"
            title="Complete"
            role="status"
            aria-live="polite"
            style={{ maxWidth: 220 }}
            message="Complete"
            uppercase
        />
    );
    expect(ref.current).toBe(element);
    expect(element.id).toBe('result');
    expect(element.getAttribute('data-test-id')).toBe('status');
    expect(element.getAttribute('title')).toBe('Complete');
    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
    expect(element.style.maxWidth).toBe('220px');
    expect(element.classList.contains('custom')).toBe(true);
    expect(element.firstElementChild?.classList.contains('custom-label')).toBe(true);
    expect(element.textContent).toBe('Complete');
    for (const prop of [
        'size',
        'shape',
        'color',
        'message',
        'uppercase',
        'labelClassName',
        'dataTestId',
    ])
        expect(element.hasAttribute(prop)).toBe(false);
});

test('renders independent decorative addons in order and removes them on update', () => {
    let element = render(
        <Status
            message="Ready"
            leftAddon={<svg aria-label="Check" />}
            rightAddon={<span>Icon</span>}
        />
    );
    expect(element.children.length).toBe(3);
    expect(element.children[0].getAttribute('aria-hidden')).toBe('true');
    expect(element.children[1].textContent).toBe('Ready');
    expect(element.children[2].getAttribute('aria-hidden')).toBe('true');
    element = render(<Status message="Ready" leftAddon={null} rightAddon={false} />);
    expect(element.children.length).toBe(1);
    element = render(<Status message="Ready" rightAddon={0} />);
    expect(element.children.length).toBe(2);
    expect(element.lastElementChild?.textContent).toBe('0');
    element = render(<Status message="Ready" leftAddon={true} rightAddon={undefined} />);
    expect(element.children.length).toBe(1);
});
