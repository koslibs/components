import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, StrictMode, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Tab, Tabs, type TabProps } from '.';

import styles from './index.module.css';

let container: HTMLDivElement;
let root: Root;
const items: TabProps[] = [
    { id: 'first', title: 'First', count: 0 },
    { id: 'disabled', title: 'Disabled', count: 3, disabled: true },
    { id: 'second', title: 'Second', count: 2 },
    { id: 'last', title: 'Last' },
];

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    rstest.restoreAllMocks();
    rstest.unstubAllGlobals();
});

function render(children: ReactNode) {
    act(() => root.render(children));
}

function tabs(nextItems: readonly TabProps[]) {
    return nextItems.map((props) => <Tab key={props.id} {...props} />);
}

function tab(id: string) {
    return container.querySelector<HTMLButtonElement>(`[data-test-id="tabs-tab-${id}"]`)!;
}

function selected() {
    return container.querySelector(`button.${styles.selected}`)?.textContent;
}

test('selects on click and ignores disabled/repeated clicks', () => {
    const onChange = rstest.fn();
    render(<Tabs children={tabs(items)} dataTestId="tabs" onChange={onChange} />);
    expect(selected()).toBe('First0');
    act(() => tab('first').click());
    act(() => tab('disabled').click());
    expect(onChange).not.toHaveBeenCalled();
    act(() => tab('second').dispatchEvent(new MouseEvent('pointerdown', { bubbles: true })));
    expect(selected()).toBe('First0');
    act(() => tab('second').click());
    expect(selected()).toBe('Second2');
    act(() => tab('first').click());
    expect(onChange.mock.calls.map(([, payload]) => [payload.selectedId])).toEqual([
        ['second'],
        ['first'],
    ]);
});

test('controlled requests wait for the parent and use the latest callback', () => {
    const previous = rstest.fn();
    const current = rstest.fn();
    render(
        <Tabs children={tabs(items)} selectedId="first" dataTestId="tabs" onChange={previous} />
    );
    act(() => tab('second').click());
    expect(selected()).toBe('First0');
    expect(previous.mock.calls.map(([, payload]) => [payload.selectedId])).toEqual([['second']]);
    render(
        <Tabs children={tabs(items)} selectedId="second" dataTestId="tabs" onChange={current} />
    );
    expect(selected()).toBe('Second2');
    act(() => tab('last').click());
    expect(current.mock.calls.map(([, payload]) => [payload.selectedId])).toEqual([['last']]);
});

test('falls forward then backward when selection is removed or disabled without callbacks', () => {
    const onChange = rstest.fn();
    const example = (nextItems: TabProps[]) => (
        <Tabs
            children={tabs(nextItems)}
            defaultSelectedId="second"
            dataTestId="tabs"
            onChange={onChange}
        />
    );
    render(example(items));
    expect(selected()).toBe('Second2');
    render(example(items.filter((item) => item.id !== 'second')));
    expect(selected()).toBe('Last');
    render(example(items));
    expect(selected()).toBe('Last');
    render(example(items.map((item) => (item.id === 'last' ? { ...item, disabled: true } : item))));
    expect(selected()).toBe('Second2');
    expect(onChange).not.toHaveBeenCalled();
});

test('first enabled/default/unknown values and empty sets have deterministic fallbacks', () => {
    const disabledFirst = items.map((item) =>
        item.id === 'first' ? { ...item, disabled: true } : item
    );
    render(<Tabs children={tabs(disabledFirst)} defaultSelectedId="disabled" />);
    expect(selected()).toBe('Second2');
    render(<Tabs children={tabs(items)} selectedId="unknown" />);
    expect(selected()).toBe('Second2');
    render(<Tabs children={tabs([])} emptyState="No tabs" dataTestId="tabs" />);
    expect(container.textContent).toBe('No tabs');
    expect(container.querySelector('[data-test-id="tabs-list"]')).toBeNull();
    render(
        <Tabs
            children={tabs(items.map((item) => ({ ...item, disabled: true })))}
            emptyState="No enabled tabs"
        />
    );
    expect(container.textContent).toBe('No enabled tabs');
    render(<Tabs children={tabs(items)} />);
    expect(selected()).toBe('First0');
});

test('forwards DOM props/ref and hides invalid counters', () => {
    const ref = createRef<HTMLDivElement>();
    render(
        <StrictMode>
            <Tabs
                ref={ref}
                id="profiles"
                className="custom"
                title="Profiles"
                children={tabs([
                    { id: 'with space', title: 'Zero', count: 0 },
                    ...[-1, 1.5, NaN, Infinity].map((count, index) => ({
                        id: String(index),
                        title: 'Unknown',
                        count,
                    })),
                ])}
                dataTestId="tabs"
            />
            <Tabs children={tabs(items)} />
        </StrictMode>
    );
    expect(ref.current?.id).toBe('profiles');
    expect(ref.current?.classList.contains('custom')).toBe(true);
    expect(ref.current?.getAttribute('title')).toBe('Profiles');
    expect(tab('with space').textContent).toBe('Zero0');
    for (let index = 0; index < 4; index += 1)
        expect(tab(String(index)).textContent).toBe('Unknown');
});

test('leaves external content and its focus under the parent control', () => {
    const example = (selectedId: string) => (
        <>
            <Tabs selectedId={selectedId} dataTestId="tabs">
                {tabs(items)}
            </Tabs>
            <input defaultValue="External content" />
        </>
    );
    render(example('first'));
    const input = container.querySelector('input')!;
    input.value = 'Edited';
    act(() => input.focus());
    render(example('second'));
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('Edited');
    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
});

test('keeps the next surviving neighbor when earlier items are removed in the same update', () => {
    render(<Tabs children={tabs(items)} defaultSelectedId="second" dataTestId="tabs" />);
    render(
        <Tabs
            children={tabs(items.filter((item) => item.id === 'disabled' || item.id === 'last'))}
            dataTestId="tabs"
        />
    );
    expect(selected()).toBe('Last');
    // A controlled invalid value keeps the same fallback on subsequent renders.
    render(<Tabs children={tabs(items)} selectedId="second" dataTestId="tabs" />);
    const survivors = items.filter((item) => item.id === 'first' || item.id === 'last');
    render(<Tabs children={tabs(survivors)} selectedId="second" dataTestId="tabs" />);
    expect(selected()).toBe('Last');
    render(<Tabs children={tabs([...survivors])} selectedId="second" dataTestId="tabs" />);
    expect(selected()).toBe('Last');
});

test('supports an empty string id in click selection', () => {
    const nextItems = [{ id: '', title: 'Empty id' }, ...items];
    const onChange = rstest.fn();
    render(
        <Tabs children={tabs(nextItems)} selectedId="first" dataTestId="tabs" onChange={onChange} />
    );
    act(() => tab('').click());
    expect(selected()).toBe('First0');
    expect(onChange.mock.calls[0][1]).toEqual({ selectedId: '' });
    render(<Tabs children={tabs(nextItems)} selectedId="" dataTestId="tabs" onChange={onChange} />);
    expect(selected()).toBe('Empty id');
    act(() => tab('second').click());
    expect(onChange.mock.calls[1][1]).toEqual({ selectedId: 'second' });
});

test('supports the JSX API with header-only tabs and a mouse event payload', () => {
    const onChange = rstest.fn();
    render(
        <Tabs selectedId="active" onChange={onChange} dataTestId="tabs">
            <Tab id="active" title="Active" count={5} />
            <Tab id="archived" title={<strong>Archived</strong>} />
            <Tab id="disabled" title="Disabled" disabled />
        </Tabs>
    );
    expect(selected()).toBe('Active5');
    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
    act(() => tab('archived').click());
    expect(selected()).toBe('Active5');
    const [event, payload] = onChange.mock.calls[0];
    expect(event.type).toBe('click');
    expect(event.target).toBe(tab('archived'));
    expect(payload).toEqual({ selectedId: 'archived' });
    act(() => tab('disabled').click());
    expect(onChange).toHaveBeenCalledTimes(1);
});

test('supports arrays, conditions and nested fragments with stable ids through reorder', () => {
    const example = (showSecond: boolean) => (
        <Tabs dataTestId="tabs">
            <>
                {null}
                <Tab id="first" title="First" />
                {showSecond && (
                    <>
                        <Tab id="second" title="Second" />
                    </>
                )}
                {[<Tab key="last" id="last" title="Last" />]}
            </>
        </Tabs>
    );
    render(example(true));
    act(() => tab('second').click());
    render(
        <Tabs dataTestId="tabs">
            <Tab id="last" title="Last" />
            <Tab id="second" title="Second" />
            <Tab id="first" title="First" />
        </Tabs>
    );
    expect(selected()).toBe('Second');
    render(example(false));
    expect(selected()).toBe('First');
});

test('positions one shared indicator and waits for controlled selection before moving it', () => {
    rstest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (
        this: HTMLElement
    ) {
        return this.getAttribute('data-test-id') === 'tabs-tab-second' ? 210 : 0;
    });
    rstest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
        this: HTMLElement
    ) {
        return this.getAttribute('data-test-id') === 'tabs-tab-second' ? 140 : 90;
    });
    render(
        <Tabs selectedId="first" dataTestId="tabs">
            {tabs(items)}
        </Tabs>
    );
    const indicator = container.querySelector<HTMLDivElement>('[data-test-id="tabs-indicator"]')!;
    expect(indicator.style.transform).toBe('translateX(0px)');
    expect(indicator.style.width).toBe('90px');
    expect(indicator.style.transition).toBe('none');
    act(() => tab('second').click());
    expect(indicator.style.transform).toBe('translateX(0px)');
    render(
        <Tabs selectedId="second" dataTestId="tabs">
            {tabs(items)}
        </Tabs>
    );
    expect(container.querySelector('[data-test-id="tabs-indicator"]')).toBe(indicator);
    expect(indicator.style.transform).toBe('translateX(210px)');
    expect(indicator.style.width).toBe('140px');
    expect(indicator.style.transition).toBe('');
    expect(selected()).toBe('Second2');
});

test('tracks title resizing without interrupting transitions on identical resize notifications', () => {
    const callbacks: VoidFunction[] = [];
    const observed: Element[] = [];
    const disconnect = rstest.fn();
    rstest.stubGlobal(
        'ResizeObserver',
        class {
            constructor(callback: VoidFunction) {
                callbacks.push(callback);
            }
            observe(element: Element) {
                observed.push(element);
            }
            disconnect = disconnect;
        }
    );
    let left = 210;
    let width = 140;
    rstest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (
        this: HTMLElement
    ) {
        return this.getAttribute('data-test-id') === 'tabs-tab-second' ? left : 0;
    });
    rstest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
        this: HTMLElement
    ) {
        return this.getAttribute('data-test-id') === 'tabs-tab-second' ? width : 90;
    });
    render(<Tabs dataTestId="tabs">{tabs(items)}</Tabs>);
    expect(observed).toContain(tab('first'));
    expect(observed).toContain(tab('second'));
    act(() => tab('second').click());
    const indicator = container.querySelector<HTMLDivElement>('[data-test-id="tabs-indicator"]')!;
    const resize = callbacks.at(-1)!;
    act(resize);
    expect(indicator.style.transition).toBe('');
    left = 250;
    width = 170;
    act(resize);
    expect(indicator.style.transform).toBe('translateX(250px)');
    expect(indicator.style.width).toBe('170px');
    expect(indicator.style.transition).toBe('none');
    render(<Tabs dataTestId="tabs" emptyState="No tabs" />);
    expect(disconnect).toHaveBeenCalled();
    render(
        <Tabs selectedId="second" dataTestId="tabs">
            {tabs(items)}
        </Tabs>
    );
    const remounted = container.querySelector<HTMLDivElement>('[data-test-id="tabs-indicator"]')!;
    expect(remounted.style.transform).toBe('translateX(250px)');
    expect(remounted.style.transition).toBe('none');
});
