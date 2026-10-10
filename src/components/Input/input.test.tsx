import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, useState, type FormEvent, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Input } from '.';

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
    return container.querySelector('input')!;
}

function change(input: HTMLInputElement, value: string) {
    act(() => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
            input,
            value
        );
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

test('forwards the native ref, attributes and callbacks without leaking component props', () => {
    const ref = createRef<HTMLInputElement>();
    const onFocus = rstest.fn();
    const onBlur = rstest.fn();
    const onKeyDown = rstest.fn();
    const onClick = rstest.fn();
    const input = render(
        <Input
            ref={ref}
            name="name"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={30}
            dataTestId="email"
            label="Email"
            hint="Адрес"
            view="secondary"
            size={56}
            block
            clear
            className="wrapper"
            inputClassName="native"
            style={{ width: 250 }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onClick={onClick}
        />
    );
    expect(ref.current).toBe(input);
    expect(input.name).toBe('name');
    expect(input.type).toBe('email');
    expect(input.autocomplete).toBe('email');
    expect(input.inputMode).toBe('email');
    expect(input.required).toBe(true);
    expect(input.maxLength).toBe(30);
    expect(input.dataset.testId).toBe('email');
    expect(input.classList.contains('native')).toBe(true);
    expect(container.querySelector('.wrapper')?.getAttribute('style')).toContain('width: 250px');
    for (const attribute of ['view', 'size', 'block', 'clear', 'label', 'hint', 'dataTestId']) {
        expect(input.hasAttribute(attribute)).toBe(false);
    }
    act(() => {
        input.focus();
        input.click();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        input.blur();
    });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
});

test('connects unique labels and forwards native attributes unchanged', () => {
    render(
        <>
            <Input label="Первое" hint="Подсказка" aria-describedby="external" />
            <Input label="Второе" labelView="inner" hint="Описание" dataTestId="second" />
            <Input aria-label="Поиск" aria-invalid="grammar" />
        </>
    );
    const inputs = container.querySelectorAll('input');
    const labels = container.querySelectorAll('label');
    expect(inputs[0].id).not.toBe(inputs[1].id);
    expect(labels[0].htmlFor).toBe(inputs[0].id);
    expect(labels[1].htmlFor).toBe(inputs[1].id);
    expect(inputs[0].getAttribute('aria-describedby')).toBe('external');
    expect(container.querySelector('[data-test-id="second-hint"]')?.textContent).toBe('Описание');
    expect(container.querySelector('[data-test-id="second-hint"]')?.hasAttribute('id')).toBe(false);
    expect(inputs[2].getAttribute('aria-label')).toBe('Поиск');
    expect(inputs[2].getAttribute('aria-invalid')).toBe('grammar');
});

test('shows the counter only when enabled with a valid maxLength without adding IDs', () => {
    render(<Input maxLength={64} dataTestId="name" />);
    expect(container.querySelector('[data-test-id="name-counter"]')).toBeNull();
    for (const maxLength of [undefined, -1, 1.5]) {
        render(<Input maxLength={maxLength} showValueLength dataTestId="name" />);
        expect(container.querySelector('[data-test-id="name-counter"]')).toBeNull();
    }
    const input = render(
        <Input
            id="name"
            maxLength={0}
            showValueLength
            hint="Подсказка"
            aria-describedby="external"
            dataTestId="name"
        />
    );
    expect(input.maxLength).toBe(0);
    expect(input.hasAttribute('showValueLength')).toBe(false);
    const counter = container.querySelector('[data-test-id="name-counter"]');
    expect(counter?.textContent).toBe('0/0');
    expect(counter?.hasAttribute('id')).toBe(false);
    expect(input.getAttribute('aria-describedby')).toBe('external');
    render(
        <Input
            id="name"
            maxLength={64}
            showValueLength={false}
            hint="Подсказка"
            aria-describedby="external"
            dataTestId="name"
        />
    );
    expect(container.querySelector('[data-test-id="name-counter"]')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('external');
});

test('updates the uncontrolled counter on each edit and uses native UTF-16 length', () => {
    const input = render(
        <Input defaultValue="AB" maxLength={64} showValueLength dataTestId="name" />
    );
    const counter = () => container.querySelector('[data-test-id="name-counter"]')?.textContent;
    expect(counter()).toBe('2/64');
    change(input, 'ABCDE');
    expect(counter()).toBe('5/64');
    change(input, 'ABCD');
    expect(counter()).toBe('4/64');
    change(input, '😀');
    expect(counter()).toBe('2/64');
    render(<Input maxLength={10} showValueLength dataTestId="name" />);
    expect(counter()).toBe('2/10');
});

test('uses the controlled value for the counter, including external updates and clearing', () => {
    const input = render(
        <Input
            value="AB"
            onChange={rstest.fn()}
            maxLength={64}
            showValueLength
            clear
            dataTestId="name"
        />
    );
    const counter = () => container.querySelector('[data-test-id="name-counter"]')?.textContent;
    change(input, 'ABCDE');
    expect(counter()).toBe('2/64');
    act(() => container.querySelector('button')!.click());
    expect(counter()).toBe('2/64');
    render(
        <Input
            value="ABCDE"
            onChange={rstest.fn()}
            maxLength={64}
            showValueLength
            dataTestId="name"
        />
    );
    expect(counter()).toBe('5/64');
    render(
        <Input value="" onChange={rstest.fn()} maxLength={64} showValueLength dataTestId="name" />
    );
    expect(counter()).toBe('0/64');
});

test('replaces a hint with the error message without adding IDs or ARIA attributes', () => {
    const input = render(
        <Input
            id="name"
            label="Имя"
            hint="Подсказка"
            error="Проверьте имя"
            aria-describedby="external"
            dataTestId="name"
        />
    );
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('external');
    expect(container.querySelector('[data-test-id="name-error"]')?.hasAttribute('id')).toBe(false);
    expect(container.textContent).toBe('ИмяПроверьте имя');
    render(<Input id="name" label="Имя" error dataTestId="name" />);
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    render(<Input id="name" label="Имя" dataTestId="name" />);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(container.querySelector('[data-test-id="name-error"]')).toBeNull();
});

test('keeps the error state without adding a message when there is no hint', () => {
    const input = render(
        <Input
            id="name"
            hint="Подсказка"
            error="Проверьте имя"
            aria-describedby="external"
            dataTestId="name"
        />
    );
    expect(container.querySelector('[data-test-id="name-error"]')?.textContent).toBe(
        'Проверьте имя'
    );
    for (const hint of [undefined, null, false, '']) {
        render(
            <Input
                id="name"
                hint={hint}
                error="Проверьте имя"
                aria-describedby="external"
                dataTestId="name"
            />
        );
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(input.getAttribute('aria-describedby')).toBe('external');
        expect(
            container
                .querySelector('[data-test-id="name-form-control"]')
                ?.getAttribute('data-error')
        ).toBe('true');
        expect(container.querySelector('[data-test-id="name-error"]')).toBeNull();
        expect(container.querySelector('[data-test-id="name-hint"]')).toBeNull();
        expect(container.textContent).toBe('');
    }
    render(<Input id="name" hint="Подсказка" error dataTestId="name" />);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(container.querySelector('[data-test-id="name-hint"]')?.textContent).toBe('Подсказка');
});

test('reports native changes and clears an uncontrolled input without submitting the form', () => {
    const onChange = rstest.fn();
    const onClear = rstest.fn();
    const onSubmit = rstest.fn((event: FormEvent) => event.preventDefault());
    const input = render(
        <form onSubmit={onSubmit}>
            <Input defaultValue="Александр" clear onChange={onChange} onClear={onClear} />
        </form>
    );
    change(input, 'Мария');
    expect(input.value).toBe('Мария');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual({ value: 'Мария' });
    const button = container.querySelector('button')!;
    expect(button.type).toBe('button');
    expect(button.tabIndex).toBe(0);
    expect(button.getAttribute('aria-label')).toBe('Очистить поле');
    act(() => button.click());
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    expect(container.querySelector('button')).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    change(input, 'Новое значение');
    expect(container.querySelector('button')).not.toBeNull();
});

test('leaves controlled changes and clearing to the owner', () => {
    const onClear = rstest.fn();
    const input = render(
        <Input value="Александр" onChange={rstest.fn()} clear onClear={onClear} />
    );
    change(input, 'Мария');
    expect(input.value).toBe('Александр');
    act(() => container.querySelector('button')!.click());
    expect(input.value).toBe('Александр');
    expect(onClear).toHaveBeenCalledTimes(1);
    render(<Input value="" onChange={rstest.fn()} clear />);
    expect(input.value).toBe('');
    expect(container.querySelector('button')).toBeNull();
});

test('supports controlled editing and clearing when the owner updates value', () => {
    function Controlled() {
        const [value, setValue] = useState('Александр');
        return (
            <Input
                value={value}
                onChange={(_, payload) => setValue(payload.value)}
                onClear={() => setValue('')}
                clear
                maxLength={64}
                showValueLength
                dataTestId="name"
            />
        );
    }
    const input = render(<Controlled />);
    change(input, 'Мария');
    expect(input.value).toBe('Мария');
    expect(container.querySelector('[data-test-id="name-counter"]')?.textContent).toBe('5/64');
    act(() => container.querySelector('button')!.click());
    expect(input.value).toBe('');
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('[data-test-id="name-counter"]')?.textContent).toBe('0/64');
});

test('restores defaultValue and clear visibility on native form reset', async () => {
    const input = render(
        <form>
            <Input
                name="name"
                defaultValue="Александр"
                clear
                maxLength={64}
                showValueLength
                dataTestId="name"
            />
        </form>
    );
    act(() => container.querySelector('button')!.click());
    expect(input.value).toBe('');
    expect(container.querySelector('[data-test-id="name-counter"]')?.textContent).toBe('0/64');
    await act(async () => {
        container.querySelector('form')!.reset();
    });
    expect(input.value).toBe('Александр');
    expect(container.querySelector('[data-test-id="name-counter"]')?.textContent).toBe('9/64');
    expect(container.querySelector('button')).not.toBeNull();
    expect(new FormData(container.querySelector('form')!).get('name')).toBe('Александр');
});

test('respects a cancelled form reset and an externally associated form', async () => {
    const input = render(
        <>
            <form id="external-form" onReset={(event) => event.preventDefault()} />
            <Input form="external-form" defaultValue="Александр" clear />
        </>
    );
    act(() => container.querySelector('button')!.click());
    await act(async () => {
        // Happy DOM resets values before dispatching reset and ignores cancellation.
        // Exercise the cancelable event here; native cancellation is checked in the browser.
        const event = new Event('reset', { bubbles: true, cancelable: true });
        container.querySelector('form')!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });
    expect(input.value).toBe('');
    expect(container.querySelector('button')).toBeNull();
    render(
        <>
            <form id="external-form" />
            <Input form="external-form" defaultValue="Александр" clear />
        </>
    );
    await act(async () => {
        container.querySelector('form')!.reset();
    });
    expect(input.value).toBe('Александр');
    expect(container.querySelector('button')).not.toBeNull();
});

test('hides clear for disabled and readonly fields and preserves native form semantics', () => {
    render(
        <form>
            <Input name="disabled" defaultValue="Disabled" disabled clear />
            <Input name="readonly" defaultValue="Read only" readOnly clear />
        </form>
    );
    const [disabled, readonly] = container.querySelectorAll('input');
    expect(container.querySelector('button')).toBeNull();
    act(() => disabled.focus());
    expect(document.activeElement).not.toBe(disabled);
    act(() => readonly.focus());
    expect(document.activeElement).toBe(readonly);
    const data = new FormData(container.querySelector('form')!);
    expect(data.has('disabled')).toBe(false);
    expect(data.get('readonly')).toBe('Read only');
});

test('focuses on field whitespace but preserves interactive addon behaviour', () => {
    const onAddonClick = rstest.fn();
    const input = render(
        <Input
            dataTestId="name"
            leftAddon={<span>Декорация</span>}
            rightAddon={<button onClick={onAddonClick}>Открыть</button>}
        />
    );
    act(() => container.querySelector<HTMLElement>('[data-test-id="name-left-addon"]')!.click());
    expect(document.activeElement).toBe(input);
    const button = container.querySelector('button')!;
    act(() => {
        button.focus();
        button.click();
    });
    expect(document.activeElement).toBe(button);
    expect(onAddonClick).toHaveBeenCalledTimes(1);
    act(() => container.querySelector<HTMLElement>('[data-test-id="name-field"]')!.click());
    expect(document.activeElement).toBe(input);
});

test('focuses the field inside a focusable ancestor without stealing addon focus', () => {
    const input = render(
        <div tabIndex={0} role="tabpanel">
            <Input
                dataTestId="name"
                label="Имя"
                labelView="inner"
                leftAddon={<span>Декорация</span>}
                rightAddon={<button>Открыть</button>}
            />
        </div>
    );
    const panel = container.querySelector<HTMLElement>('[role="tabpanel"]')!;
    const field = container.querySelector<HTMLElement>('[data-test-id="name-field"]')!;
    const decoration = container.querySelector<HTMLElement>(
        '[data-test-id="name-left-addon"] span'
    )!;
    const button = container.querySelector('button')!;
    for (const target of [field, decoration]) {
        act(() => {
            panel.focus();
            target.click();
        });
        expect(document.activeElement).toBe(input);
    }
    act(() => {
        button.focus();
        button.click();
    });
    expect(document.activeElement).toBe(button);
});

test('supports callback refs, test id suffixes and an explicit id', () => {
    const callbackRef = rstest.fn();
    const input = render(
        <Input
            ref={callbackRef}
            id="profile"
            label="Имя"
            hint="Описание"
            dataTestId="profile"
            defaultValue="Александр"
            clear
            leftAddon={<span>Слева</span>}
            rightAddon={<span>Справа</span>}
        />
    );
    expect(callbackRef).toHaveBeenCalledWith(input);
    for (const suffix of [
        'form-control',
        'field',
        'label',
        'hint',
        'left-addon',
        'right-addon',
        'clear',
    ]) {
        expect(container.querySelector(`[data-test-id="profile-${suffix}"]`)).not.toBeNull();
    }
    expect(container.querySelector('label')!.htmlFor).toBe('profile');
    render(<Input />);
    expect(callbackRef).toHaveBeenCalledWith(null);
    expect(container.querySelector('[data-test-id]')).toBeNull();
});
