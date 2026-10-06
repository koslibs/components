import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, StrictMode, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Collapse } from '.';

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
    rstest.restoreAllMocks();
});

function render(children: ReactNode) {
    act(() => root.render(children));
    return container.querySelector('button')!;
}

function content(button: HTMLButtonElement) {
    return document.getElementById(button.getAttribute('aria-controls')!)!;
}

function transitionEnd(element: Element, propertyName = 'grid-template-rows') {
    const event = new Event('transitionend', { bubbles: true });
    Object.defineProperty(event, 'propertyName', { value: propertyName });
    act(() => element.dispatchEvent(event));
}

function setContentHeight(element: HTMLElement, height: number) {
    Object.defineProperty(element.firstElementChild!.firstElementChild!, 'scrollHeight', {
        configurable: true,
        value: height,
    });
}

test('toggles internal state while preserving hidden content and its input value', () => {
    const onChange = rstest.fn();
    const button = render(
        <Collapse
            collapsedLabel="Показать подробности"
            expandedLabel="Скрыть подробности"
            onExpandedChange={onChange}
        >
            <input defaultValue="Initial note" />
        </Collapse>
    );
    const panel = content(button);
    const input = panel.querySelector('input')!;
    expect(button.textContent).toBe('Показать подробности');
    expect(button.type).toBe('button');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.inert).toBe(true);

    act(() => button.click());
    expect(button.textContent).toBe('Скрыть подробности');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(panel.inert).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    input.value = 'Updated note';
    act(() => button.click());
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel.inert).toBe(true);
    expect(panel.querySelector('input')).toBe(input);
    expect(input.value).toBe('Updated note');
    expect(onChange.mock.calls).toEqual([[true], [false]]);
});

test('requests controlled changes and returns focus on an externally applied collapse', () => {
    const onChange = rstest.fn();
    const example = (expanded: boolean) => (
        <Collapse collapsedLabel="Details" expanded={expanded} onExpandedChange={onChange}>
            <input aria-label="Details" />
        </Collapse>
    );
    const button = render(example(false));
    act(() => button.click());
    expect(onChange.mock.calls).toEqual([[true]]);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    render(example(true));
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const input = container.querySelector('input')!;
    input.focus();
    expect(document.activeElement).toBe(input);
    render(example(false));
    expect(document.activeElement).toBe(button);
    expect(content(button).inert).toBe(true);
});

test('uses defaultExpanded only initially and supports changing content without remounting', () => {
    const example = (defaultExpanded: boolean, text: string) => (
        <Collapse collapsedLabel="Details" defaultExpanded={defaultExpanded}>
            <p>{text}</p>
        </Collapse>
    );
    const button = render(example(true, 'First row'));
    const panel = content(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    render(example(false, 'New content with several rows'));
    expect(content(button)).toBe(panel);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(panel.textContent).toBe('New content with several rows');
});

test('forwards root attributes and ref while keeping content IDs unique', () => {
    const ref = createRef<HTMLDivElement>();
    render(
        <>
            <Collapse
                collapsedLabel="First details"
                ref={ref}
                id="first-collapse"
                className="custom-root"
                expandedContentClassName="custom-content"
                dataTestId="details"
                style={{ color: 'red' }}
                aria-label="Additional details"
            >
                Details
            </Collapse>
            <Collapse collapsedLabel="Other details">Other details</Collapse>
        </>
    );
    expect(ref.current?.id).toBe('first-collapse');
    expect(ref.current?.dataset.testId).toBe('details');
    expect(ref.current?.classList.contains('custom-root')).toBe(true);
    expect(ref.current?.style.color).toBe('red');
    expect(ref.current?.getAttribute('aria-label')).toBe('Additional details');
    expect(ref.current?.querySelector('.custom-content')?.textContent).toBe('Details');
    const buttons = [...container.querySelectorAll('button')];
    expect(content(buttons[0]).id).not.toBe(content(buttons[1]).id);
    expect(content(buttons[0]).dataset.testId).toBe('details-content');
    expect(buttons[0].dataset.testId).toBe('details-toggle');
    expect(buttons[0].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
});

test('supports external control without an internal trigger', () => {
    const example = (expanded: boolean) => (
        <Collapse expanded={expanded} dataTestId="external">
            <input defaultValue="Saved content" />
        </Collapse>
    );
    render(example(false));
    expect(container.querySelector('button')).toBeNull();
    const panel = container.querySelector<HTMLDivElement>('[data-test-id="external-content"]')!;
    expect(panel.inert).toBe(true);
    render(example(true));
    expect(panel.inert).toBe(false);
    expect(panel.querySelector('input')?.value).toBe('Saved content');
});

test('reports only its own height transition once and uses the latest callback', () => {
    rstest.spyOn(window, 'getComputedStyle').mockReturnValue({
        transitionDuration: '0.2s',
    } as CSSStyleDeclaration);
    const previousCallback = rstest.fn();
    const currentCallback = rstest.fn();
    const example = (onTransitionEnd: (expanded: boolean) => void) => (
        <Collapse collapsedLabel="Details" onTransitionEnd={onTransitionEnd}>
            <div>Animated child</div>
        </Collapse>
    );
    const button = render(example(previousCallback));
    const panel = content(button);
    setContentHeight(panel, 100);
    act(() => button.click());
    expect(previousCallback).not.toHaveBeenCalled();
    render(example(currentCallback));
    transitionEnd(panel.querySelector('div')!);
    transitionEnd(panel, 'visibility');
    expect(currentCallback).not.toHaveBeenCalled();
    transitionEnd(panel);
    transitionEnd(panel);
    expect(previousCallback).not.toHaveBeenCalled();
    expect(currentCallback.mock.calls).toEqual([[true]]);
    act(() => button.click());
    transitionEnd(panel);
    expect(currentCallback.mock.calls).toEqual([[true], [false]]);
});

test('reports changes immediately without animation and avoids initial callbacks in StrictMode', () => {
    rstest.spyOn(window, 'getComputedStyle').mockReturnValue({
        transitionDuration: '0s',
    } as CSSStyleDeclaration);
    const onTransitionEnd = rstest.fn();
    const example = (expanded: boolean) => (
        <StrictMode>
            <Collapse
                collapsedLabel="Details"
                expanded={expanded}
                onTransitionEnd={onTransitionEnd}
            >
                Content
            </Collapse>
        </StrictMode>
    );
    const button = render(example(false));
    setContentHeight(content(button), 100);
    expect(onTransitionEnd).not.toHaveBeenCalled();
    render(example(true));
    expect(onTransitionEnd.mock.calls).toEqual([[true]]);
    render(example(false));
    expect(onTransitionEnd.mock.calls).toEqual([[true], [false]]);
});

test('has no default labels and does not render a trigger just for chevrons', () => {
    render(
        <Collapse expanded showLeftChevron showRightChevron>
            Visible content
        </Collapse>
    );
    expect(container.querySelector('button')).toBeNull();
    expect(container.textContent).toBe('Visible content');
    expect(container.querySelector('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('false');
});

test('uses either provided label in both states and preserves explicitly empty labels', () => {
    for (const labelProps of [{ collapsedLabel: 'Details' }, { expandedLabel: 'Details' }]) {
        const button = render(<Collapse {...labelProps}>Content</Collapse>);
        expect(button.textContent).toBe('Details');
        act(() => button.click());
        expect(button.textContent).toBe('Details');
        act(() => button.click());
    }
    render(
        <Collapse collapsedLabel="" expandedLabel="">
            Content
        </Collapse>
    );
    expect(container.querySelector('button')).toBeNull();
});

test('shows only the right chevron by default and toggles with every chevron combination', () => {
    const defaultButton = render(<Collapse collapsedLabel="Details">Content</Collapse>);
    expect(defaultButton.querySelectorAll('svg').length).toBe(1);
    expect(defaultButton.firstElementChild?.tagName).toBe('SPAN');
    expect(defaultButton.lastElementChild?.tagName.toLowerCase()).toBe('svg');

    for (const showLeftChevron of [false, true]) {
        for (const showRightChevron of [false, true]) {
            const button = render(
                <Collapse
                    collapsedLabel="Closed"
                    expandedLabel="Opened"
                    showLeftChevron={showLeftChevron}
                    showRightChevron={showRightChevron}
                >
                    Content
                </Collapse>
            );
            const icons = [...button.querySelectorAll('svg')];
            expect(icons.length).toBe(Number(showLeftChevron) + Number(showRightChevron));
            expect(button.firstElementChild?.tagName.toLowerCase()).toBe(
                showLeftChevron ? 'svg' : 'span'
            );
            expect(button.lastElementChild?.tagName.toLowerCase()).toBe(
                showRightChevron ? 'svg' : 'span'
            );
            for (const icon of icons) expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(container.firstElementChild?.hasAttribute('showLeftChevron')).toBe(false);
            expect(container.firstElementChild?.hasAttribute('showRightChevron')).toBe(false);
            act(() => button.click());
            expect(button.textContent).toBe('Opened');
            expect(button.getAttribute('aria-expanded')).toBe('true');
            expect(content(button).inert).toBe(false);
            expect(button.querySelectorAll('svg').length).toBe(icons.length);
            act(() => button.click());
            expect(button.textContent).toBe('Closed');
            expect(button.getAttribute('aria-expanded')).toBe('false');
        }
    }
});
