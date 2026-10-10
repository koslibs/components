import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import {
    act,
    createContext,
    createRef,
    StrictMode,
    useContext,
    useLayoutEffect,
    useRef,
    type ReactNode,
} from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { Portal } from '.';

let container: HTMLDivElement;
let destination: HTMLDivElement;
let root: Root;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    destination = document.createElement('div');
    document.body.append(container, destination);
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    destination.remove();
    rstest.restoreAllMocks();
});

async function render(children: ReactNode) {
    await act(async () => root.render(children));
}

test('renders in body without a wrapper and cleans up only its own content', async () => {
    await render(
        <Portal>
            <span data-test-id="portal-content">Content</span>
        </Portal>
    );
    const child = document.querySelector('[data-test-id="portal-content"]')!;
    expect(child.parentElement).toBe(document.body);
    expect(container.children.length).toBe(0);
    await render(null);
    expect(document.querySelector('[data-test-id="portal-content"]')).toBeNull();
    expect(document.body.contains(destination)).toBe(true);
});

test('resolves a DOM ref assigned during the same commit with immediateMount=false', async () => {
    function Example() {
        const target = useRef<HTMLDivElement>(null);
        return (
            <>
                <div ref={target} />
                <Portal getPortalContainer={() => target.current} immediateMount={false}>
                    <span>Resolved ref</span>
                </Portal>
            </>
        );
    }
    await render(<Example />);
    expect(container.firstElementChild?.textContent).toBe('Resolved ref');
    expect(container.children.length).toBe(1);
});

test('mounts in the first layout effect by default and defers only with immediateMount=false', async () => {
    const observed: boolean[] = [];
    function Example({ immediateMount }: { immediateMount?: boolean }) {
        useLayoutEffect(() => {
            observed.push(destination.children.length > 0);
        }, []);
        return (
            <Portal getPortalContainer={() => destination} immediateMount={immediateMount}>
                <span>Child</span>
            </Portal>
        );
    }
    await render(<Example immediateMount={false} />);
    expect(observed).toEqual([false]);
    await render(null);
    await render(<Example />);
    expect(observed).toEqual([false, true]);
});

test('null and undefined do not fall back to body and ref follows the selected container', async () => {
    const ref = createRef<Element>();
    for (const immediateMount of [false, true]) {
        for (const target of [null, undefined, destination]) {
            await render(
                <Portal ref={ref} immediateMount={immediateMount} getPortalContainer={() => target}>
                    <span>Selected</span>
                </Portal>
            );
            expect(ref.current).toBe(target ?? null);
            expect(destination.textContent).toBe(target ? 'Selected' : '');
        }
        await render(null);
        expect(ref.current).toBeNull();
    }
});

test('updates an unchanged getter reading a DOM ref and resets children on container change', async () => {
    let selected: Element | null = destination;
    const getPortalContainer = () => selected;
    const ref = createRef<Element>();
    const example = () => (
        <Portal getPortalContainer={getPortalContainer} ref={ref}>
            <input defaultValue="Initial" />
        </Portal>
    );
    await render(example());
    const input = destination.querySelector('input')!;
    input.value = 'Edited';
    await render(example());
    expect(destination.querySelector('input')).toBe(input);
    expect(input.value).toBe('Edited');
    selected = container;
    await render(example());
    expect(ref.current).toBe(container);
    expect(destination.children.length).toBe(0);
    expect(container.querySelector('input')?.value).toBe('Initial');
    selected = null;
    await render(example());
    expect(ref.current).toBeNull();
    expect(container.children.length).toBe(0);
});

test('keeps React context and event bubbling across the portal boundary', async () => {
    const Context = createContext('Default');
    const onClick = rstest.fn();
    function Child() {
        return <button>{useContext(Context)}</button>;
    }
    await render(
        <Context.Provider value="Provided">
            <div onClick={onClick}>
                <Portal getPortalContainer={() => destination}>
                    <Child />
                </Portal>
            </div>
        </Context.Provider>
    );
    expect(destination.textContent).toBe('Provided');
    act(() => destination.querySelector('button')!.click());
    expect(onClick).toHaveBeenCalledTimes(1);
});

test('supports an iframe container and callback ref cleanup in StrictMode', async () => {
    const iframe = document.createElement('iframe');
    destination.append(iframe);
    const body = iframe.contentDocument!.body;
    const ref = rstest.fn();
    await render(
        <StrictMode>
            <Portal ref={ref} getPortalContainer={() => body}>
                <span>Iframe</span>
            </Portal>
        </StrictMode>
    );
    expect(body.textContent).toBe('Iframe');
    expect(body.children.length).toBe(1);
    expect(ref.mock.calls.at(-1)).toEqual([body]);
    await render(null);
    expect(body.textContent).toBe('');
    expect(ref.mock.calls.at(-1)).toEqual([null]);
});

test('renders no portal on the server and hydrates with a target created by the same React tree', async () => {
    const errors: unknown[] = [];
    function Example() {
        const target = useRef<HTMLDivElement>(null);
        return (
            <>
                <div ref={target} id="ssr-target" />
                <Portal getPortalContainer={() => target.current} immediateMount={false}>
                    <span>Hydrated</span>
                </Portal>
            </>
        );
    }
    expect(renderToString(<Portal immediateMount={false}>Server</Portal>)).toBe('');
    await act(async () => root.unmount());
    container.innerHTML = renderToString(<Example />);
    expect(container.textContent).toBe('');
    await act(async () => {
        root = hydrateRoot(container, <Example />, {
            onRecoverableError: (error) => errors.push(error),
        });
    });
    expect(errors).toEqual([]);
    expect(container.querySelector('#ssr-target')?.textContent).toBe('Hydrated');
});
