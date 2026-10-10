import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, StrictMode, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Content, Controls, Footer, Header, Modal, ModalComponent } from '.';

let container: HTMLDivElement;
let root: Root;
let originalShowModal: PropertyDescriptor | undefined;
let originalClose: PropertyDescriptor | undefined;
let originalBodyStyle: string;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    originalBodyStyle = document.body.style.cssText;
    originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
    // The DOM test environment does not implement the browser's dialog top layer.
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
        configurable: true,
        value(this: HTMLDialogElement) {
            this.open = true;
        },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
        configurable: true,
        value(this: HTMLDialogElement) {
            if (!this.open) return;
            this.open = false;
            this.dispatchEvent(new Event('close'));
        },
    });
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.body.style.cssText = originalBodyStyle;
    if (originalShowModal)
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
    rstest.restoreAllMocks();
});

function render(children: ReactNode) {
    act(() => root.render(children));
}

test('only mounts when open and a portal container exists', () => {
    const ref = createRef<HTMLDialogElement>();
    render(<Modal open={false} ref={ref} />);
    expect(ref.current).toBeNull();
    render(<Modal open ref={ref} getPortalContainer={() => null} />);
    expect(ref.current).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(ModalComponent).toBe(Modal);
});

test('opens a native dialog, forwards attributes and refs, and cleans up on controlled closing', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = rstest.fn();
    render(
        <Modal
            open
            ref={ref}
            onClose={onClose}
            aria-label="Details"
            dataTestId="modal"
            className="custom"
            size={480}
        >
            Content
        </Modal>
    );
    const dialog = ref.current!;
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-label')).toBe('Details');
    expect(dialog.getAttribute('data-test-id')).toBe('modal');
    expect(dialog.classList.contains('custom')).toBe(true);
    expect(dialog.textContent).toBe('Content');
    expect(document.body.style.overflow).toBe('hidden');
    render(<Modal open={false} ref={ref} onClose={onClose} />);
    expect(dialog.open).toBe(false);
    expect(ref.current).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
});

test('locks the portal owner document rather than the global document', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const body = iframe.contentDocument!.body;
    body.style.overflow = 'scroll';
    render(<Modal open getPortalContainer={() => body} />);
    expect(body.querySelector('dialog')?.open).toBe(true);
    expect(body.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).not.toBe('hidden');
    render(null);
    expect(body.style.overflow).toBe('scroll');
    iframe.remove();
});

test('prevents native Escape closing and requests a controlled update', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = rstest.fn();
    render(<Modal open ref={ref} onClose={onClose} />);
    const cancel = new Event('cancel', { cancelable: true });
    act(() => ref.current!.dispatchEvent(cancel));
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose.mock.calls).toEqual([[]]);
    expect(ref.current!.open).toBe(true);
    render(<Modal open ref={ref} onClose={onClose} escapeKeyDown={false} />);
    act(() => ref.current!.dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('only closes when both the press and click land outside dialog bounds', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = rstest.fn();
    render(
        <Modal open ref={ref} onClose={onClose}>
            <button>Inside</button>
        </Modal>
    );
    const dialog = ref.current!;
    rstest
        .spyOn(dialog, 'getBoundingClientRect')
        .mockReturnValue({ left: 100, right: 400, top: 100, bottom: 300 } as DOMRect);
    const press = (target: Element, x: number, y: number) =>
        act(() =>
            target.dispatchEvent(
                new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y })
            )
        );
    const click = (target: Element, x: number, y: number) =>
        act(() =>
            target.dispatchEvent(
                new MouseEvent('click', { bubbles: true, clientX: x, clientY: y, cancelable: true })
            )
        );
    press(dialog, 150, 150);
    click(dialog, 150, 150);
    press(dialog.querySelector('button')!, 150, 150);
    click(dialog, 50, 50);
    press(dialog, 50, 50);
    click(dialog, 150, 150);
    expect(onClose).not.toHaveBeenCalled();
    press(dialog, 50, 50);
    click(dialog, 50, 50);
    expect(onClose).toHaveBeenCalledTimes(1);
    render(<Modal open ref={ref} onClose={onClose} backdropClick={false} />);
    press(dialog, 50, 50);
    click(dialog, 50, 50);
    expect(onClose).toHaveBeenCalledTimes(1);
    render(<Modal open ref={ref} onClose={onClose} onClick={(event) => event.preventDefault()} />);
    press(dialog, 50, 50);
    click(dialog, 50, 50);
    expect(onClose).toHaveBeenCalledTimes(1);
    render(
        <Modal open ref={ref} onClose={onClose} onPointerDown={(event) => event.preventDefault()} />
    );
    press(dialog, 50, 50);
    click(dialog, 50, 50);
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('reports native close events without reporting cleanup as a close request', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = rstest.fn();
    render(<Modal open ref={ref} onClose={onClose} />);
    act(() => ref.current!.close());
    expect(onClose.mock.calls).toEqual([[]]);
    render(null);
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('restores original page styles only after the last modal releases its scroll lock', () => {
    document.body.style.overflow = 'scroll';
    document.body.style.paddingRight = '9px';
    const initialPadding = document.body.style.paddingRight;
    render(
        <>
            <Modal open />
            <Modal open />
        </>
    );
    expect(document.body.style.overflow).toBe('hidden');
    render(
        <>
            <Modal open />
            <Modal open={false} />
        </>
    );
    expect(document.body.style.overflow).toBe('hidden');
    render(<Modal open lockScroll={false} />);
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.body.style.paddingRight).toBe(initialPadding);
});

test('keeps nested close events local to the requested modal', () => {
    const onParentClose = rstest.fn();
    const onChildClose = rstest.fn();
    const childRef = createRef<HTMLDialogElement>();
    render(
        <Modal open onClose={onParentClose}>
            <Modal open ref={childRef} onClose={onChildClose} />
        </Modal>
    );
    act(() =>
        childRef.current!.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }))
    );
    expect(onChildClose).toHaveBeenCalledTimes(1);
    expect(onParentClose).not.toHaveBeenCalled();
});

for (const gutter of ['stable', 'stable both-edges']) {
    test(`does not double-compensate scrollbar space with ${gutter}`, () => {
        const rootElement = document.documentElement;
        const getComputedStyle = window.getComputedStyle.bind(window);
        rstest.spyOn(rootElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth - 15);
        rstest
            .spyOn(window, 'getComputedStyle')
            .mockImplementation((element) =>
                element === rootElement
                    ? ({ scrollbarGutter: gutter } as CSSStyleDeclaration)
                    : getComputedStyle(element)
            );
        document.body.style.paddingRight = '9px';
        render(<Modal open />);
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.paddingRight).toBe('9px');
        render(null);
        expect(document.body.style.paddingRight).toBe('9px');
    });
}

test('compensates a disappearing scrollbar once and restores the original padding', () => {
    const rootElement = document.documentElement;
    const getComputedStyle = window.getComputedStyle.bind(window);
    rstest.spyOn(rootElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth - 15);
    rstest
        .spyOn(window, 'getComputedStyle')
        .mockImplementation((element) =>
            element === rootElement
                ? ({ scrollbarGutter: 'auto' } as CSSStyleDeclaration)
                : getComputedStyle(element)
        );
    document.body.style.paddingRight = '9px';
    render(
        <>
            <Modal open />
            <Modal open />
        </>
    );
    expect(document.body.style.paddingRight).toBe('24px');
    render(
        <>
            <Modal open />
            <Modal open={false} />
        </>
    );
    expect(document.body.style.paddingRight).toBe('24px');
    render(null);
    expect(document.body.style.paddingRight).toBe('9px');
});

test('ignores stale close events after StrictMode reopens the dialog', () => {
    const onClose = rstest.fn();
    const ref = createRef<HTMLDialogElement>();
    render(
        <StrictMode>
            <Modal open ref={ref} onClose={onClose} />
        </StrictMode>
    );
    expect(ref.current!.open).toBe(true);
    act(() => ref.current!.dispatchEvent(new Event('close')));
    expect(onClose).not.toHaveBeenCalled();
    render(null);
    expect(onClose).not.toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
});

test('supports the parts, accessible close button and optional test IDs', () => {
    const onClose = rstest.fn();
    render(
        <Modal open onClose={onClose}>
            <Header title="Settings" subtitle="Details" />
            <Content dataTestId="settings">Body</Content>
            <Footer>
                <Controls secondary={<button>Cancel</button>} primary={<button>Save</button>} />
            </Footer>
        </Modal>
    );
    const dialog = document.body.querySelector('dialog')!;
    expect(dialog.textContent).toBe('SettingsDetailsBodyCancelSave');
    expect(dialog.querySelector('[data-test-id="settings-content"]')?.textContent).toBe('Body');
    expect(dialog.querySelector('[data-test-id^="undefined"]')).toBeNull();
    act(() => dialog.querySelector<HTMLButtonElement>('[aria-label="Закрыть окно"]')!.click());
    expect(onClose.mock.calls).toEqual([[]]);
    expect(dialog.open).toBe(true);
    render(
        <Modal open>
            <Header title="No closer" hasCloser={false} />
            <Controls primary="Ignored">Custom actions</Controls>
        </Modal>
    );
    expect(dialog.querySelector('button')).toBeNull();
    expect(dialog.textContent).toBe('No closerCustom actions');
});

test('Header uses the latest Modal close handler independently of Escape and backdrop settings', () => {
    const firstClose = rstest.fn();
    const nextClose = rstest.fn();
    const ref = createRef<HTMLDialogElement>();
    const header = (
        <div>
            <Header title="Settings" />
        </div>
    );
    render(
        <Modal open ref={ref} onClose={firstClose} escapeKeyDown={false} backdropClick={false}>
            {header}
        </Modal>
    );
    const closer = ref.current!.querySelector<HTMLButtonElement>('[aria-label="Закрыть окно"]')!;
    act(() => closer.click());
    expect(firstClose.mock.calls).toEqual([[]]);
    expect(ref.current!.open).toBe(true);

    render(
        <Modal open ref={ref} onClose={nextClose} escapeKeyDown={false} backdropClick={false}>
            {header}
        </Modal>
    );
    act(() => closer.click());
    expect(firstClose).toHaveBeenCalledTimes(1);
    expect(nextClose.mock.calls).toEqual([[]]);
    expect(ref.current!.open).toBe(true);
});

test('nested Headers request closing only their nearest Modal, even without a child handler', () => {
    const parentClose = rstest.fn();
    const childClose = rstest.fn();
    const parentRef = createRef<HTMLDialogElement>();
    const childRef = createRef<HTMLDialogElement>();
    const tree = (onChildClose?: VoidFunction) => (
        <Modal open ref={parentRef} onClose={parentClose}>
            <Header title="Parent" />
            <Modal open ref={childRef} onClose={onChildClose}>
                <Header title="Child" />
            </Modal>
        </Modal>
    );
    render(tree(childClose));
    const childCloser = childRef.current!.querySelector<HTMLButtonElement>(
        '[aria-label="Закрыть окно"]'
    )!;
    act(() => childCloser.click());
    expect(childClose.mock.calls).toEqual([[]]);
    expect(parentClose).not.toHaveBeenCalled();

    render(tree());
    act(() => childCloser.click());
    expect(childClose).toHaveBeenCalledTimes(1);
    expect(parentClose).not.toHaveBeenCalled();
    expect(childRef.current!.open).toBe(true);

    act(() =>
        parentRef.current!.querySelector<HTMLButtonElement>('[aria-label="Закрыть окно"]')!.click()
    );
    expect(parentClose.mock.calls).toEqual([[]]);
    expect(childClose).toHaveBeenCalledTimes(1);
    expect(parentRef.current!.open).toBe(true);
});

test('parts inherit the Modal test ID through wrappers and update when it changes', () => {
    const ref = createRef<HTMLDialogElement>();
    const parts = (
        <>
            <div>
                <Header title="Settings" />
            </div>
            <Content>Body</Content>
            <Footer>
                <Controls primary={<button>Save</button>} />
            </Footer>
        </>
    );
    for (const id of ['settings', 'updated', undefined]) {
        render(
            <Modal open ref={ref} dataTestId={id}>
                {parts}
            </Modal>
        );
        expect(ref.current!.getAttribute('data-test-id')).toBe(id ?? null);
        const ids = [...ref.current!.querySelectorAll('[data-test-id]')].map((node) =>
            node.getAttribute('data-test-id')
        );
        expect(ids).toEqual(
            id ? ['header', 'content', 'footer', 'controls'].map((part) => `${id}-${part}`) : []
        );
    }
});

test('explicit part test IDs override the Modal base and an empty ID suppresses the attribute', () => {
    const ref = createRef<HTMLDialogElement>();
    render(
        <Modal open ref={ref} dataTestId="settings">
            <Header dataTestId="heading" />
            <Content dataTestId="body" />
            <Footer dataTestId="actions">
                <Controls dataTestId="buttons" />
            </Footer>
        </Modal>
    );
    expect(
        [...ref.current!.querySelectorAll('[data-test-id]')].map((node) =>
            node.getAttribute('data-test-id')
        )
    ).toEqual(['heading-header', 'body-content', 'actions-footer', 'buttons-controls']);

    render(
        <Modal open ref={ref} dataTestId="settings">
            <Header dataTestId="" />
            <Content dataTestId="" />
            <Footer dataTestId="">
                <Controls />
            </Footer>
        </Modal>
    );
    expect(
        [...ref.current!.querySelectorAll('[data-test-id]')].map((node) =>
            node.getAttribute('data-test-id')
        )
    ).toEqual(['settings-controls']);
});

test('nested parts use only their nearest Modal test ID, including when it is absent', () => {
    const parentRef = createRef<HTMLDialogElement>();
    const childRef = createRef<HTMLDialogElement>();
    const parts = (
        <>
            <Header />
            <Content />
            <Footer>
                <Controls />
            </Footer>
        </>
    );
    for (const childId of ['child', undefined]) {
        render(
            <Modal open ref={parentRef} dataTestId="parent">
                {parts}
                <Modal open ref={childRef} dataTestId={childId}>
                    {parts}
                </Modal>
            </Modal>
        );
        const ids = (dialog: HTMLDialogElement) =>
            [...dialog.querySelectorAll('[data-test-id]')].map((node) =>
                node.getAttribute('data-test-id')
            );
        expect(ids(parentRef.current!)).toEqual([
            'parent-header',
            'parent-content',
            'parent-footer',
            'parent-controls',
        ]);
        expect(ids(childRef.current!)).toEqual(
            childId ? ['child-header', 'child-content', 'child-footer', 'child-controls'] : []
        );
    }
});
