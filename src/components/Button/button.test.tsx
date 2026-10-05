import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, type FormEvent, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Button } from '.';

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
    rstest.useRealTimers();
});

function render(children: ReactNode) {
    act(() => root.render(children));
    return container.querySelector('button')!;
}

test('forwards ref and HTML attributes without submitting a form by default', () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = rstest.fn();
    const onSubmit = rstest.fn((event: FormEvent) => event.preventDefault());
    const button = render(
        <form onSubmit={onSubmit}>
            <Button ref={ref} name="action" dataTestId="save" onClick={onClick}>
                Сохранить
            </Button>
        </form>
    );

    expect(ref.current).toBe(button);
    expect(button.type).toBe('button');
    expect(button.name).toBe('action');
    expect(button.dataset.testId).toBe('save');
    act(() => button.click());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();

    render(<Button type="submit">Отправить</Button>);
    expect(container.querySelector('button')!.type).toBe('submit');
});

test('disabled buttons do not invoke the click handler', () => {
    const onClick = rstest.fn();
    const button = render(
        <Button disabled onClick={onClick}>
            Сохранить
        </Button>
    );
    act(() => button.click());
    expect(button.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
});

test('shows hints only for supported sizes and preserves both addons', () => {
    render(
        <Button size={40} hint="Подпись">
            Кнопка
        </Button>
    );
    expect(container.textContent).not.toContain('Подпись');

    for (const size of [56, 64, 72] as const) {
        render(
            <Button
                size={size}
                hint="Подпись"
                leftAddon={<span>Слева</span>}
                rightAddon={<span>Справа</span>}
            >
                Кнопка
            </Button>
        );
        expect(container.textContent).toBe('СлеваКнопкаПодписьСправа');
    }
});

test('blocks clicks and keeps loading visible for at least 500 ms', () => {
    rstest.useFakeTimers();
    const onClick = rstest.fn();
    const button = render(
        <Button loading dataTestId="save" onClick={onClick}>
            Сохранить
        </Button>
    );
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('[data-test-id="save-loader"]')).not.toBeNull();
    expect(button.disabled).toBe(true);
    act(() => button.click());
    expect(onClick).not.toHaveBeenCalled();

    render(
        <Button loading={false} dataTestId="save" onClick={onClick}>
            Сохранить
        </Button>
    );
    act(() => rstest.advanceTimersByTime(499));
    expect(button.disabled).toBe(true);
    act(() => rstest.advanceTimersByTime(1));
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('false');
    expect(container.querySelector('[data-test-id="save-loader"]')).toBeNull();
    act(() => button.click());
    expect(onClick).toHaveBeenCalledTimes(1);
});

test('continues loading after 500 ms while the loading prop remains true', () => {
    rstest.useFakeTimers();
    const button = render(<Button loading>Сохранить</Button>);
    act(() => rstest.advanceTimersByTime(500));
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    render(<Button loading={false}>Сохранить</Button>);
    expect(button.disabled).toBe(false);
});
