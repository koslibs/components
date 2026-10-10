import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Textarea } from '.';

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
    return container.querySelector('textarea')!;
}

function change(textarea: HTMLTextAreaElement, value: string) {
    act(() => {
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(
            textarea,
            value
        );
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

test('forwards native ref and events, applies defaults and keeps component props off textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onChange = rstest.fn();
    const onFocus = rstest.fn();
    const onKeyDown = rstest.fn();
    const textarea = render(
        <Textarea
            ref={ref}
            name="comment"
            label="Комментарий"
            maxLength={200}
            showValueLength
            dataTestId="comment"
            onChange={onChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
        />
    );
    expect(ref.current).toBe(textarea);
    expect(textarea.name).toBe('comment');
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.maxLength).toBe(200);
    expect(textarea.dataset.testId).toBe('comment');
    expect(container.querySelector('label')!.htmlFor).toBe(textarea.id);
    expect(container.querySelector('[data-view]')!.getAttribute('data-view')).toBe('primary');
    for (const prop of [
        'view',
        'minRows',
        'maxRows',
        'autosize',
        'resize',
        'clear',
        'showValueLength',
        'label',
    ])
        expect(textarea.hasAttribute(prop)).toBe(false);
    expect(textarea.hasAttribute('aria-invalid')).toBe(false);
    expect(textarea.hasAttribute('aria-describedby')).toBe(false);
    expect(container.querySelector('[data-test-id="comment-counter"]')!.hasAttribute('id')).toBe(
        false
    );
    act(() => {
        textarea.focus();
        textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    change(textarea, 'Первая\nВторая');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual({ value: 'Первая\nВторая' });
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('13/200');
});

test('only shows a valid counter and counts uncontrolled UTF-16 edits', () => {
    const textarea = render(
        <Textarea
            defaultValue="AB"
            labelView="inner"
            maxLength={64}
            showValueLength
            dataTestId="comment"
        />
    );
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('2/64');
    change(textarea, '😀\n');
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('3/64');
    for (const maxLength of [undefined, -1, 1.5]) {
        render(<Textarea maxLength={maxLength} showValueLength dataTestId="comment" />);
        expect(container.querySelector('[data-test-id="comment-counter"]')).toBeNull();
    }
    render(<Textarea maxLength={0} showValueLength dataTestId="comment" />);
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('3/0');
    render(<Textarea maxLength={64} dataTestId="comment" />);
    expect(container.querySelector('[data-test-id="comment-counter"]')).toBeNull();
});

test('only replaces a nonempty hint with error and true preserves the hint', () => {
    render(<Textarea hint="Подсказка" error="Проверьте комментарий" dataTestId="comment" />);
    expect(container.querySelector('[data-test-id="comment-error"]')!.textContent).toBe(
        'Проверьте комментарий'
    );
    for (const hint of [undefined, null, false, '']) {
        render(<Textarea hint={hint} error="Проверьте комментарий" dataTestId="comment" />);
        expect(container.querySelector('[data-error]')).not.toBeNull();
        expect(container.querySelector('[data-test-id="comment-error"]')).toBeNull();
        expect(container.querySelector('[data-test-id="comment-hint"]')).toBeNull();
    }
    render(<Textarea hint="Подсказка" error dataTestId="comment" />);
    expect(container.querySelector('[data-test-id="comment-hint"]')!.textContent).toBe('Подсказка');
});

test('clears an uncontrolled field, returns focus and restores defaultValue on form reset', async () => {
    const onClear = rstest.fn();
    const onChange = rstest.fn();
    const onSubmit = rstest.fn();
    const textarea = render(
        <form onSubmit={onSubmit}>
            <Textarea
                name="comment"
                defaultValue={'AB\nCD'}
                clear
                onClear={onClear}
                onChange={onChange}
                maxLength={200}
                showValueLength
                dataTestId="comment"
            />
        </form>
    );
    change(textarea, 'Новое');
    act(() => container.querySelector('button')!.click());
    expect(textarea.value).toBe('');
    expect(document.activeElement).toBe(textarea);
    expect(container.querySelector('button')).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('0/200');
    await act(async () => {
        container.querySelector('form')!.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe('AB\nCD');
    expect(container.querySelector('button')).not.toBeNull();
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('5/200');
    expect(new FormData(container.querySelector('form')!).get('comment')).toBe('AB\nCD');
});

test('controlled edits, external value updates and clearing remain owned by the caller', () => {
    const onClear = rstest.fn();
    const textarea = render(
        <Textarea
            value="AB"
            onChange={rstest.fn()}
            onClear={onClear}
            clear
            maxLength={200}
            showValueLength
            dataTestId="comment"
        />
    );
    change(textarea, 'Другой текст');
    act(() => container.querySelector('button')!.click());
    expect(textarea.value).toBe('AB');
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('2/200');
    expect(onClear).toHaveBeenCalledTimes(1);
    render(
        <Textarea
            value="XYZ"
            onChange={rstest.fn()}
            maxLength={200}
            showValueLength
            dataTestId="comment"
        />
    );
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('3/200');
    function Controlled() {
        const [value, setValue] = useState('AB');
        return (
            <Textarea
                value={value}
                onChange={(_, payload) => setValue(payload.value)}
                onClear={() => setValue('')}
                clear
                maxLength={200}
                showValueLength
                dataTestId="controlled"
            />
        );
    }
    const controlled = render(<Controlled />);
    change(controlled, 'Новый\nТекст');
    expect(controlled.value).toBe('Новый\nТекст');
    act(() => container.querySelector('button')!.click());
    expect(controlled.value).toBe('');
    expect(container.querySelector('[data-test-id="controlled-counter"]')!.textContent).toBe(
        '0/200'
    );
});

test('preserves disabled/readonly form semantics and disables clear and resize', () => {
    render(
        <form>
            <Textarea name="disabled" defaultValue="Disabled" disabled clear resize />
            <Textarea name="readonly" defaultValue="Read only" readOnly clear resize />
        </form>
    );
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('[data-resize]')).toBeNull();
    const [disabled, readonly] = container.querySelectorAll('textarea');
    act(() => disabled.focus());
    expect(document.activeElement).not.toBe(disabled);
    act(() => readonly.focus());
    expect(document.activeElement).toBe(readonly);
    const data = new FormData(container.querySelector('form')!);
    // Happy DOM includes disabled textareas in FormData; exclusion is checked in the browser.
    expect(disabled.disabled).toBe(true);
    expect(data.get('readonly')).toBe('Read only');
});

test('focuses whitespace inside a focusable ancestor and supports test-id suffixes and callback refs', () => {
    const ref = rstest.fn();
    const textarea = render(
        <div tabIndex={0}>
            <Textarea
                ref={ref}
                id="comment"
                label="Комментарий"
                labelView="inner"
                hint="Подсказка"
                dataTestId="comment"
                defaultValue="AB"
                clear
                maxLength={200}
                showValueLength
            />
        </div>
    );
    expect(ref).toHaveBeenCalledWith(textarea);
    for (const suffix of ['form-control', 'field', 'label', 'hint', 'counter', 'clear'])
        expect(container.querySelector(`[data-test-id="comment-${suffix}"]`)).not.toBeNull();
    act(() => container.querySelector<HTMLElement>('[data-test-id="comment-field"]')!.click());
    expect(document.activeElement).toBe(textarea);
    render(<Textarea />);
    expect(ref).toHaveBeenCalledWith(null);
    expect(container.querySelector('[data-test-id]')).toBeNull();
});

test('normalizes row limits and makes autosize take precedence over manual resize', () => {
    let textarea = render(<Textarea minRows={6} resize />);
    expect(textarea.getAttribute('rows')).toBe('6');
    expect(container.querySelector('[data-resize]')).not.toBeNull();
    textarea = render(<Textarea minRows={-1} maxRows={0} autosize resize />);
    expect(textarea.getAttribute('rows')).toBe('1');
    expect(container.querySelector('[data-resize]')).toBeNull();
    textarea = render(<Textarea minRows={NaN} />);
    expect(textarea.getAttribute('rows')).toBe('3');
});

test('respects a cancelled reset on an externally associated form', async () => {
    const textarea = render(
        <>
            <form id="external" onReset={(event) => event.preventDefault()} />
            <Textarea
                form="external"
                defaultValue="AB"
                clear
                maxLength={200}
                showValueLength
                dataTestId="comment"
            />
        </>
    );
    act(() => container.querySelector('button')!.click());
    await act(async () => {
        container
            .querySelector('form')!
            .dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(textarea.value).toBe('');
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('0/200');
});

test('reads reset values after the browser default action, even if it runs after a microtask', async () => {
    const textarea = render(
        <form>
            <Textarea defaultValue="Initial" maxLength={200} showValueLength dataTestId="comment" />
        </form>
    );
    change(textarea, 'AB');
    await act(async () => {
        // Simulate the ordering of a native reset button: event, microtask checkpoint, default action.
        container.querySelector('form')!.dispatchEvent(new Event('reset', { cancelable: true }));
        await Promise.resolve();
        textarea.value = textarea.defaultValue;
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(container.querySelector('[data-test-id="comment-counter"]')!.textContent).toBe('7/200');
});
