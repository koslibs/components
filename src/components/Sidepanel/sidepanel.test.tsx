import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, StrictMode, useState, type ReactNode, type Ref } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Button } from '../Button';
import { Modal } from '../Modal';

import { Content, Footer, Header, Sidepanel, type SidepanelProps } from '.';

let container: HTMLDivElement;
let root: Root;
let originalShow: PropertyDescriptor | undefined;
let originalClose: PropertyDescriptor | undefined;
let originalStyle: string;
let originalRootStyle: string;
let frames: Map<number, Parameters<typeof window.requestAnimationFrame>[0]>;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    originalStyle = document.body.style.cssText;
    originalRootStyle = document.documentElement.style.cssText;
    originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
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
    frames = new Map();
    let frameId = 0;
    rstest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        frameId += 1;
        frames.set(frameId, callback);
        return frameId;
    });
    rstest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => frames.delete(id));
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.body.style.cssText = originalStyle;
    document.documentElement.style.cssText = originalRootStyle;
    if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShow);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
    rstest.useRealTimers();
    rstest.restoreAllMocks();
});

function render(children: ReactNode) {
    act(() => root.render(children));
}

function animateIn() {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((callback) => callback(0)));
}

function endTransition(element: Element, propertyName = 'transform', bubbles = true) {
    const event = new Event('transitionend', { bubbles });
    Object.defineProperty(event, 'propertyName', { value: propertyName });
    act(() => element.dispatchEvent(event));
}

function SaveButton() {
    return <Button>Save</Button>;
}

function CancelButton() {
    return <Button view="secondary">Cancel</Button>;
}

function panel(props: Partial<SidepanelProps> & { ref?: Ref<HTMLDialogElement> } = {}) {
    return (
        <Sidepanel open style={{ transitionDuration: '200ms' }} dataTestId="panel" {...props}>
            <Header title="Настройки" />
            <Content>
                <input defaultValue="Initial" />
            </Content>
            <Footer primary={<SaveButton />} />
        </Sidepanel>
    );
}

test('only mounts with open and an available portal container, forwarding native attributes and refs', () => {
    const ref = createRef<HTMLDialogElement>();
    render(panel({ open: false, ref }));
    expect(ref.current).toBeNull();
    render(panel({ getPortalContainer: () => null }));
    expect(document.querySelector('dialog')).toBeNull();
    render(panel({ ref, 'aria-label': 'Settings', className: 'custom' }));
    const dialog = ref.current!;
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-label')).toBe('Settings');
    expect(dialog.classList.contains('custom')).toBe(true);
    expect(dialog.dataset.state).toBe('closed');
    expect(document.body.style.overflow).toBe('hidden');
    animateIn();
    expect(dialog.dataset.state).toBe('open');
});

test('keeps dialog, form values and scroll lock until its own transform transition ends', () => {
    const onClose = rstest.fn();
    render(panel({ onClose }));
    animateIn();
    const dialog = document.querySelector('dialog')!;
    const input = dialog.querySelector('input')!;
    input.value = 'Edited';
    render(panel({ open: false, onClose }));
    expect(dialog.open).toBe(true);
    expect(dialog.dataset.state).toBe('closed');
    expect(document.body.style.overflow).toBe('hidden');
    expect(input.value).toBe('Edited');
    endTransition(input);
    endTransition(dialog, 'opacity');
    expect(dialog.isConnected).toBe(true);
    endTransition(dialog);
    expect(dialog.isConnected).toBe(false);
    expect(dialog.open).toBe(false);
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(onClose).not.toHaveBeenCalled();
    render(panel());
    expect(document.querySelector<HTMLInputElement>('dialog input')!.value).toBe('Initial');
});

test('cancels exit on rapid reopening without remounting content or releasing scroll lock', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(panel());
    animateIn();
    const dialog = document.querySelector('dialog')!;
    const input = dialog.querySelector('input')!;
    input.value = 'Preserved';
    render(panel({ open: false }));
    render(panel());
    animateIn();
    act(() => rstest.advanceTimersByTime(500));
    endTransition(dialog);
    expect(document.querySelector('dialog')).toBe(dialog);
    expect(input.value).toBe('Preserved');
    expect(dialog.dataset.state).toBe('open');
    expect(document.body.style.overflow).toBe('hidden');
});

test('has an exit fallback if no transition event arrives', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    render(panel());
    animateIn();
    const dialog = document.querySelector('dialog')!;
    expect(dialog.dataset.state).toBe('open');
    expect(window.getComputedStyle(dialog).transitionDuration).toBe('200ms');
    render(panel({ open: false }));
    act(() => rstest.advanceTimersByTime(199));
    expect(document.querySelector('dialog')).not.toBeNull();
    act(() => rstest.advanceTimersByTime(51));
    expect(document.querySelector('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
});

test('finishes closing immediately with zero duration or before the entering frame runs', () => {
    render(panel({ style: { transitionDuration: '0s' } }));
    animateIn();
    render(panel({ open: false, style: { transitionDuration: '0s' } }));
    expect(document.querySelector('dialog')).toBeNull();
    render(panel());
    render(panel({ open: false }));
    animateIn();
    expect(document.querySelector('dialog')).toBeNull();
});

test('Escape and the closer request controlled closing and respect escapeKeyDown', () => {
    const onClose = rstest.fn();
    render(panel({ onClose }));
    animateIn();
    const dialog = document.querySelector('dialog')!;
    const cancel = new Event('cancel', { bubbles: true, cancelable: true });
    act(() => dialog.dispatchEvent(cancel));
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);
    expect(onClose.mock.calls).toEqual([[]]);
    render(panel({ onClose, escapeKeyDown: false }));
    act(() => dialog.dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => dialog.querySelector<HTMLButtonElement>('[data-test-id="panel-closer"]')!.click());
    expect(onClose).toHaveBeenCalledTimes(2);
    render(panel({ open: false, onClose }));
    act(() => dialog.dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(onClose).toHaveBeenCalledTimes(2);
});

test('onExited runs once after the dialog closes, independently of onClose', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const onClose = rstest.fn();
    const ref = createRef<HTMLDialogElement>();
    const onExited = rstest.fn(() => expect(ref.current!.open).toBe(false));
    render(panel({ ref, onClose, onExited }));
    animateIn();
    const dialog = ref.current!;
    act(() => dialog.querySelector<HTMLButtonElement>('[data-test-id="panel-closer"]')!.click());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onExited).not.toHaveBeenCalled();
    render(panel({ open: false, ref, onClose, onExited }));
    expect(onExited).not.toHaveBeenCalled();
    endTransition(dialog.querySelector('input')!);
    endTransition(dialog, 'opacity');
    expect(onExited).not.toHaveBeenCalled();
    endTransition(dialog);
    endTransition(dialog);
    act(() => rstest.advanceTimersByTime(500));
    expect(onExited.mock.calls).toEqual([[]]);
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('onExited uses the latest callback without restarting the exit fallback', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const previous = rstest.fn();
    const dialogRef = createRef<HTMLDialogElement>();
    const current = rstest.fn(() => expect(dialogRef.current!.open).toBe(false));
    render(panel({ ref: dialogRef, onExited: previous }));
    animateIn();
    render(panel({ open: false, ref: dialogRef, onExited: previous }));
    act(() => rstest.advanceTimersByTime(150));
    render(panel({ open: false, ref: dialogRef, onExited: current }));
    act(() => rstest.advanceTimersByTime(100));
    expect(previous).not.toHaveBeenCalled();
    expect(current).toHaveBeenCalledTimes(1);
    act(() => rstest.advanceTimersByTime(500));
    expect(current).toHaveBeenCalledTimes(1);
});

test('onExited follows dialog.close immediately when reduced motion sets duration to zero', () => {
    const ref = createRef<HTMLDialogElement>();
    const onExited = rstest.fn(() => expect(ref.current!.open).toBe(false));
    // jsdom does not apply media queries; emulate the reduced-motion CSS duration.
    const props = { ref, onExited, style: { transitionDuration: '0s' } };
    render(panel(props));
    animateIn();
    render(panel({ ...props, open: false }));
    expect(onExited.mock.calls).toEqual([[]]);
    expect(document.querySelector('dialog')).toBeNull();
});

test('onExited ignores initial closed state, rerenders and forced unmounts', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const onExited = rstest.fn();
    render(panel({ open: false, onExited }));
    render(panel({ open: false, onExited }));
    render(panel({ onExited }));
    animateIn();
    render(panel({ onExited }));
    render(null);
    expect(onExited).not.toHaveBeenCalled();
    render(panel({ onExited }));
    animateIn();
    render(panel({ open: false, onExited }));
    render(null);
    act(() => rstest.advanceTimersByTime(500));
    expect(onExited).not.toHaveBeenCalled();
});

test('onExited cancels the previous exit on reopening and completes only the next exit', () => {
    rstest.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const previous = rstest.fn();
    const current = rstest.fn();
    render(panel({ onExited: previous }));
    animateIn();
    const dialog = document.querySelector('dialog')!;
    render(panel({ open: false, onExited: previous }));
    act(() => rstest.advanceTimersByTime(100));
    render(panel({ onExited: current }));
    animateIn();
    endTransition(dialog);
    render(panel({ open: false, onExited: current }));
    // The old fallback would fire here, before the new exit finishes.
    act(() => rstest.advanceTimersByTime(150));
    expect(dialog.open).toBe(true);
    expect(previous).not.toHaveBeenCalled();
    expect(current).not.toHaveBeenCalled();
    endTransition(dialog);
    act(() => rstest.advanceTimersByTime(500));
    expect(previous).not.toHaveBeenCalled();
    expect(current).toHaveBeenCalledTimes(1);
});

test('onExited reports each real closing once in StrictMode and ignores effect cleanup', () => {
    const onExited = rstest.fn();
    const strictPanel = (open: boolean) => <StrictMode>{panel({ open, onExited })}</StrictMode>;
    render(strictPanel(false));
    render(strictPanel(true));
    animateIn();
    expect(onExited).not.toHaveBeenCalled();
    render(strictPanel(false));
    endTransition(document.querySelector('dialog')!);
    expect(onExited).toHaveBeenCalledTimes(1);
    render(strictPanel(false));
    render(strictPanel(true));
    animateIn();
    render(strictPanel(false));
    endTransition(document.querySelector('dialog')!);
    expect(onExited).toHaveBeenCalledTimes(2);
    render(strictPanel(true));
    render(null);
    expect(onExited).toHaveBeenCalledTimes(2);
});

test('onExited lets a manager remove the panel instance after closing', () => {
    function Manager() {
        const [present, setPresent] = useState(true);
        const [open, setOpen] = useState(true);
        return present ? (
            <Sidepanel
                open={open}
                onClose={() => setOpen(false)}
                onExited={() => setPresent(false)}
                style={{ transitionDuration: '200ms' }}
            >
                <Header title="Managed panel" />
            </Sidepanel>
        ) : (
            <span>Instance removed</span>
        );
    }
    render(
        <StrictMode>
            <Manager />
        </StrictMode>
    );
    animateIn();
    const dialog = document.querySelector('dialog')!;
    act(() => dialog.querySelector<HTMLButtonElement>('button')!.click());
    expect(container.textContent).not.toContain('Instance removed');
    expect(dialog.open).toBe(true);
    endTransition(dialog);
    expect(dialog.open).toBe(false);
    expect(container.textContent).toBe('Instance removed');
});

test('requires both pointerdown and click on the backdrop and respects prevented events', () => {
    const onClose = rstest.fn();
    render(panel({ onClose }));
    animateIn();
    const dialog = document.querySelector('dialog')!;
    rstest.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        right: 600,
        top: 0,
        bottom: 600,
    } as DOMRect);
    const press = (x: number) =>
        act(() =>
            dialog.dispatchEvent(
                new PointerEvent('pointerdown', {
                    clientX: x,
                    clientY: 50,
                    bubbles: true,
                    cancelable: true,
                })
            )
        );
    const click = (x: number) =>
        act(() =>
            dialog.dispatchEvent(
                new MouseEvent('click', {
                    clientX: x,
                    clientY: 50,
                    bubbles: true,
                    cancelable: true,
                })
            )
        );
    press(200);
    click(50);
    expect(onClose).not.toHaveBeenCalled();
    press(50);
    click(50);
    expect(onClose).toHaveBeenCalledTimes(1);
    render(panel({ onClose, backdropClick: false }));
    press(50);
    click(50);
    expect(onClose).toHaveBeenCalledTimes(1);
    render(panel({ onClose, onClick: (event) => event.preventDefault() }));
    press(50);
    click(50);
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('does not report StrictMode cleanup or stale close events as close requests', () => {
    const onClose = rstest.fn();
    render(<StrictMode>{panel({ onClose })}</StrictMode>);
    animateIn();
    const dialog = document.querySelector('dialog')!;
    act(() => dialog.dispatchEvent(new Event('close')));
    expect(onClose).not.toHaveBeenCalled();
    render(null);
    expect(onClose).not.toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
});

test('shares the scroll lock with Modal and preserves it until the last overlay closes', () => {
    render(
        <>
            {panel()}
            <Modal open />
        </>
    );
    animateIn();
    render(
        <>
            {panel({ open: false })}
            <Modal open />
        </>
    );
    endTransition(document.querySelector('[data-test-id="panel"]')!);
    expect(document.body.style.overflow).toBe('hidden');
    render(null);
    expect(document.body.style.overflow).not.toBe('hidden');
});

test('uses the portal owner document and supports opting out of scroll locking', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const body = iframe.contentDocument!.body;
    // Apply the existing dialog test double to the iframe's separate DOM realm.
    Object.defineProperties(Object.getPrototypeOf(body.ownerDocument.createElement('dialog')), {
        showModal: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')!,
        close: Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')!,
    });
    render(panel({ getPortalContainer: () => body }));
    expect(body.querySelector('dialog')!.open).toBe(true);
    expect(body.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).not.toBe('hidden');
    render(panel({ getPortalContainer: () => body, lockScroll: false }));
    expect(body.style.overflow).not.toBe('hidden');
    render(null);
    iframe.remove();
});

for (const gutter of ['stable', 'stable both-edges']) {
    test(`removes ${gutter} without shifting page content and restores it after the last overlay`, () => {
        const html = document.documentElement;
        html.style.setProperty('scrollbar-gutter', gutter, 'important');
        document.body.style.paddingLeft = '3px';
        document.body.style.paddingRight = '9px';
        rstest.spyOn(html, 'getBoundingClientRect').mockImplementation(
            () =>
                ({
                    left:
                        html.style.getPropertyValue('scrollbar-gutter') !== 'auto' &&
                        gutter.includes('both-edges')
                            ? 15
                            : 0,
                    right: html.style.getPropertyValue('scrollbar-gutter') === 'auto' ? 1024 : 1009,
                }) as DOMRect
        );
        render(
            <>
                <Modal open />
                {false}
            </>
        );
        expect(html.style.getPropertyValue('scrollbar-gutter')).toBe(gutter);
        render(
            <>
                <Modal open />
                {panel()}
            </>
        );
        animateIn();
        expect(html.style.getPropertyValue('scrollbar-gutter')).toBe('auto');
        expect(document.body.style.paddingLeft).toBe(
            gutter.includes('both-edges') ? '18px' : '3px'
        );
        expect(document.body.style.paddingRight).toBe('24px');
        render(
            <>
                <Modal open />
                {panel({ open: false })}
            </>
        );
        endTransition(document.querySelector('[data-test-id="panel"]')!);
        expect(html.style.getPropertyValue('scrollbar-gutter')).toBe('auto');
        expect(document.body.style.overflow).toBe('hidden');
        render(null);
        expect(html.style.getPropertyValue('scrollbar-gutter')).toBe(gutter);
        expect(html.style.getPropertyPriority('scrollbar-gutter')).toBe('important');
        expect(document.body.style.paddingLeft).toBe('3px');
        expect(document.body.style.paddingRight).toBe('9px');
    });
}

test('parts inherit and override test IDs and omit an empty Header', () => {
    render(
        <Sidepanel open dataTestId="panel">
            <Header hasCloser={false} />
            <Content dataTestId="body">Content</Content>
            <Footer
                dataTestId="actions"
                layout="column"
                secondary={<CancelButton />}
                primary={<SaveButton />}
            />
        </Sidepanel>
    );
    expect(document.querySelector('[data-test-id="panel-header"]')).toBeNull();
    expect(document.querySelector('[data-test-id="panel-closer"]')).toBeNull();
    expect(document.querySelector('[data-test-id="body-content"]')!.textContent).toBe('Content');
    expect(document.querySelectorAll('[data-test-id="actions-footer"] button').length).toBe(2);
});

test('Header renders when either title or closer is present, and omits blank titles without a closer', () => {
    render(<Header title="Заголовок" hasCloser={false} dataTestId="header" />);
    expect(container.textContent).toBe('Заголовок');
    render(<Header dataTestId="header" />);
    expect(container.querySelector('[data-test-id="header-closer"]')).not.toBeNull();
    render(<Header title="  " hasCloser={false} />);
    expect(container.childElementCount).toBe(0);
});

test('Footer consumes layout props without adding a sticky data attribute to the DOM', () => {
    for (const sticky of [true, false]) {
        render(<Footer sticky={sticky} primary={<SaveButton />} gap={24} layout="center" />);
        const footer = container.firstElementChild!;
        for (const attribute of [
            'sticky',
            'gap',
            'layout',
            'primary',
            'data-sidepanel-footer-sticky',
        ]) {
            expect(footer.hasAttribute(attribute)).toBe(false);
        }
    }
});

test('Footer accepts JSX buttons with caller handlers, styling and refs', () => {
    const handleSubmit = rstest.fn();
    const handleClose = rstest.fn();
    const buttonRef = createRef<HTMLButtonElement>();
    render(
        <Footer
            primary={
                <Button
                    ref={buttonRef}
                    onClick={handleSubmit}
                    view="accent"
                    style={{ borderRadius: 24 }}
                >
                    Create profile
                </Button>
            }
            secondary={<Button onClick={handleClose}>Cancel</Button>}
        />
    );
    const buttons = container.querySelectorAll('button');
    expect([...buttons].map((button) => button.textContent)).toEqual(['Cancel', 'Create profile']);
    expect(buttonRef.current).toBe(buttons[1]);
    expect(buttons[1].style.borderRadius).toBe('24px');
    act(() => buttons[0].click());
    act(() => buttons[1].click());
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test('Footer renders supplied components in order and preserves primary state when layout changes', () => {
    const onSave = rstest.fn();
    const onCancel = rstest.fn();
    const ref = createRef<HTMLDivElement>();
    function Primary() {
        const [clicks, setClicks] = useState(0);
        return (
            <Button
                block
                dataTestId="save"
                onClick={() => {
                    setClicks((value) => value + 1);
                    onSave();
                }}
            >
                Save {clicks}
            </Button>
        );
    }
    function Secondary() {
        return (
            <Button view="accent" disabled onClick={onCancel}>
                Cancel
            </Button>
        );
    }
    render(<Footer ref={ref} id="actions" primary={<Primary />} secondary={<Secondary />} />);
    const buttons = container.querySelectorAll('button');
    expect([...buttons].map((button) => button.textContent)).toEqual(['Cancel', 'Save 0']);
    expect(ref.current?.id).toBe('actions');
    expect([...ref.current!.children].map((element) => element.tagName)).toEqual([
        'BUTTON',
        'BUTTON',
    ]);
    expect(buttons[0].disabled).toBe(true);
    act(() => buttons[0].click());
    expect(onCancel).not.toHaveBeenCalled();
    expect(buttons[1].getAttribute('data-test-id')).toBe('save');
    expect(buttons[1].getAttribute('data-block')).toBe('true');
    act(() => buttons[1].click());
    expect(onSave).toHaveBeenCalledTimes(1);
    render(<Footer primary={<Primary />} layout="center" gap={32} />);
    expect(container.querySelectorAll('button').length).toBe(1);
    expect(container.querySelector('button')?.textContent).toBe('Save 1');
});
