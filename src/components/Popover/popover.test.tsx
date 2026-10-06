import { afterEach, beforeEach, expect, test } from '@koslibs/builder/rstest';
import { act, createRef, StrictMode, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Popover } from '.';

let container: HTMLDivElement;
let anchor: HTMLButtonElement;
let root: Root;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    anchor = document.createElement('button');
    container.append(anchor);
    document.body.append(container);
    root = createRoot(document.createElement('div'));
});

afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
});

async function render(children: ReactNode) {
    await act(async () => root.render(children));
}

test('does not render without an open flag, anchor or portal container', async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
        <Popover open={false} anchorElement={anchor} ref={ref}>
            Content
        </Popover>
    );
    expect(ref.current).toBeNull();
    await render(
        <Popover open anchorElement={null} ref={ref}>
            Content
        </Popover>
    );
    expect(ref.current).toBeNull();
    await render(
        <Popover open anchorElement={anchor} getPortalContainer={() => null} ref={ref}>
            Content
        </Popover>
    );
    expect(ref.current).toBeNull();
});

test('portals to body, forwards ref and attributes, and leaves focus on the anchor', async () => {
    const ref = createRef<HTMLDivElement>();
    anchor.focus();
    await render(
        <Popover
            open
            anchorElement={anchor}
            ref={ref}
            role="dialog"
            aria-label="Details"
            dataTestId="popover"
            className="custom"
            style={{ width: 240, color: 'red' }}
        >
            <button className="content" data-test-id="custom-content">
                Action
            </button>
        </Popover>
    );
    expect(ref.current?.parentElement).toBe(document.body);
    expect(ref.current?.getAttribute('role')).toBe('dialog');
    expect(ref.current?.getAttribute('aria-label')).toBe('Details');
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.getAttribute('data-test-id')).toBe('popover');
    expect(ref.current?.children.length).toBe(1);
    expect(ref.current?.firstElementChild?.tagName).toBe('BUTTON');
    expect(ref.current?.firstElementChild?.getAttribute('data-test-id')).toBe('custom-content');
    expect(ref.current?.style.width).toBe('240px');
    expect(ref.current?.style.color).toBe('red');
    expect(document.activeElement).toBe(anchor);
});

test('uses a supplied portal container', async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
        <Popover open anchorElement={anchor} getPortalContainer={() => container} ref={ref}>
            Custom portal
        </Popover>
    );
    expect(ref.current?.parentElement).toBe(container);
});

test('requests controlled closing only for outside presses', async () => {
    let closes = 0;
    const ref = createRef<HTMLDivElement>();
    await render(
        <Popover
            open
            anchorElement={anchor}
            ref={ref}
            onClose={() => {
                closes += 1;
            }}
        >
            <button>Inside</button>
        </Popover>
    );
    anchor.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    ref.current!.querySelector('button')!.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true })
    );
    expect(closes).toBe(0);
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(closes).toBe(1);
    expect(ref.current?.isConnected).toBe(true);
    await render(<Popover open={false} anchorElement={anchor} ref={ref} />);
    expect(ref.current).toBeNull();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(closes).toBe(1);
});

test('respects disabled closing and already handled Escape events', async () => {
    let closes = 0;
    const onClose = () => {
        closes += 1;
    };
    await render(
        <Popover
            open
            anchorElement={anchor}
            onClose={onClose}
            outsideClick={false}
            escapeKeyDown={false}
        />
    );
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(closes).toBe(0);
    await render(<Popover open anchorElement={anchor} onClose={onClose} />);
    const handled = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
    });
    handled.preventDefault();
    document.body.dispatchEvent(handled);
    expect(closes).toBe(0);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(closes).toBe(0);
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.body.dispatchEvent(escape);
    expect(closes).toBe(1);
    expect(escape.defaultPrevented).toBe(true);
});

test('updates positioning options and clears forced anchor width', async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
        <Popover
            open
            anchorElement={anchor}
            ref={ref}
            position="top-start"
            preventFlip
            useAnchorWidth
            style={{ width: 240 }}
        />
    );
    expect(ref.current?.getAttribute('data-popper-placement')).toBe('top-start');
    expect(ref.current?.style.width).toBe('0px');
    await render(
        <Popover
            open
            anchorElement={anchor}
            ref={ref}
            position="bottom-end"
            preventFlip
            availableHeight={false}
            style={{ width: 240 }}
        />
    );
    expect(ref.current?.getAttribute('data-popper-placement')).toBe('bottom-end');
    expect(ref.current?.style.width).toBe('240px');
    expect(ref.current?.style.getPropertyValue('--popover-available-height')).toBe('none');
});

test('does not duplicate close listeners in StrictMode', async () => {
    let closes = 0;
    await render(
        <StrictMode>
            <Popover
                open
                anchorElement={anchor}
                onClose={() => {
                    closes += 1;
                }}
            />
        </StrictMode>
    );
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(closes).toBe(1);
    await render(null);
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(closes).toBe(1);
});
