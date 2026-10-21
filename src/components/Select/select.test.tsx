import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Select, type SelectOption } from '.';

import styles from './index.module.css';

const options: SelectOption[] = [
    { id: 'cash', label: 'Кэш' },
    { id: 'tournaments', label: 'Турниры' },
    { id: 'spin', label: 'Турниры Spin & Go' },
    { id: 'other', label: 'Другое', disabled: true },
];
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
});

async function render(children: ReactNode) {
    await act(async () => root.render(children));
}

function part<T extends HTMLElement = HTMLElement>(suffix = '') {
    return document.querySelector<T>(`[data-test-id="select${suffix && `-${suffix}`}"]`)!;
}

async function click(suffix = '') {
    await act(async () => part(suffix).click());
}

async function search(value: string) {
    await act(async () => {
        const input = part<HTMLInputElement>('search');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
            input,
            value
        );
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

async function key(value: string, target: HTMLElement = part()) {
    await act(async () =>
        target.dispatchEvent(
            new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })
        )
    );
}

test('forwards the button ref and native attributes without exposing internal props', async () => {
    const ref = createRef<HTMLButtonElement>();
    await render(
        <Select
            ref={ref}
            options={options}
            dataTestId="select"
            id="format"
            label="Формат игры"
            aria-describedby="help"
            accessKey="f"
            hasOutline={true}
            className="wrapper"
        />
    );
    expect(ref.current).toBe(part());
    expect(part().tagName).toBe('BUTTON');
    expect(part().getAttribute('type')).toBe('button');
    expect(part().getAttribute('aria-describedby')).toBe('help');
    expect(part().getAttribute('accesskey')).toBe('f');
    expect(container.querySelector('label')?.htmlFor).toBe('format');
    expect(part('form-control').classList.contains('wrapper')).toBe(true);
    for (const name of [
        'options',
        'view',
        'size',
        'multiple',
        'searchable',
        'readOnly',
        'hasOutline',
        'dataTestId',
    ])
        expect(part().hasAttribute(name)).toBe(false);
});

test('keeps the search outline in sync with the Select while the portal stays open', async () => {
    await render(<Select options={options} searchable defaultOpen dataTestId="select" />);
    expect(part('search-form-control').hasAttribute('data-has-outline')).toBe(false);
    await render(
        <Select options={options} searchable defaultOpen hasOutline={true} dataTestId="select" />
    );
    expect(part('search-form-control').hasAttribute('data-has-outline')).toBe(true);
    expect(part('search').hasAttribute('hasOutline')).toBe(false);
    await render(
        <Select options={options} searchable defaultOpen hasOutline={false} dataTestId="select" />
    );
    expect(part('search-form-control').hasAttribute('data-has-outline')).toBe(false);
});

test('single selection reports ids and options, closes and preserves a repeated selection', async () => {
    const onChange = rstest.fn();
    await render(<Select options={options} dataTestId="select" onChange={onChange} />);
    await click();
    expect(part('dropdown')?.parentElement).toBe(document.body);
    await click('option-tournaments');
    expect(part('value').textContent).toBe('Турниры');
    expect(part('dropdown')).toBeNull();
    expect(onChange.mock.calls[0][1]).toEqual({
        value: 'tournaments',
        selectedOptions: [options[1]],
    });
    await click();
    await click('option-tournaments');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(part('dropdown')).toBeNull();
});

test('controlled selection waits for an external value update', async () => {
    const onChange = rstest.fn();
    await render(<Select options={options} dataTestId="select" value="cash" onChange={onChange} />);
    await click();
    await click('option-spin');
    expect(part('value').textContent).toBe('Кэш');
    expect(onChange.mock.calls[0][1].value).toBe('spin');
    await render(<Select options={options} dataTestId="select" value="spin" onChange={onChange} />);
    expect(part('value').textContent).toBe('Турниры Spin & Go');
});

test('multiple selection is unique, keeps selection order, and never reorders rows', async () => {
    const onChange = rstest.fn();
    await render(
        <Select
            multiple
            options={options}
            defaultValue={['other', 'other']}
            dataTestId="select"
            onChange={onChange}
        />
    );
    await click();
    await click('option-tournaments');
    await click('option-cash');
    await click('option-other');
    expect(part('value').textContent).toBe('Другое, Турниры, Кэш');
    expect(onChange.mock.calls[1][1]).toEqual({
        value: ['other', 'tournaments', 'cash'],
        selectedOptions: [options[3], options[1], options[0]],
    });
    expect([...part('options').children].map((element) => element.textContent)).toEqual(
        options.map((option) => option.label)
    );
    await click('option-tournaments');
    expect(part('value').textContent).toBe('Другое, Кэш');
    expect(part('dropdown')).not.toBeNull();
});

test('search is case-insensitive and does not remove selections outside results', async () => {
    await render(
        <Select multiple searchable options={options} defaultValue={['cash']} dataTestId="select" />
    );
    await click();
    await search('ТУР');
    expect(part('option-cash')).toBeNull();
    expect(part('option-tournaments')).not.toBeNull();
    await click('option-spin');
    expect(part('value').textContent).toBe('Кэш, Турниры Spin & Go');
    await search('Омаха');
    expect(part('empty').textContent).toContain('Ничего не найдено');
    await click('search-clear');
    expect(part('option-cash').classList.contains(styles.selected)).toBe(true);
});

test('outside click and Escape close the popover and reset only the query', async () => {
    await render(<Select searchable options={options} defaultValue="cash" dataTestId="select" />);
    await click();
    await search('Spin');
    await act(async () => document.body.dispatchEvent(new Event('pointerdown', { bubbles: true })));
    expect(part('dropdown')).toBeNull();
    await click();
    expect(part<HTMLInputElement>('search').value).toBe('');
    expect(part('value').textContent).toBe('Кэш');
    await key('Escape', part('search'));
    expect(part('dropdown')).toBeNull();
    expect(document.activeElement).toBe(part());
});

test('clear matches Input: only onClear, no automatic controlled update or opening', async () => {
    const onChange = rstest.fn();
    const onClear = rstest.fn();
    await render(
        <Select
            options={options}
            value="cash"
            clear
            onChange={onChange}
            onClear={onClear}
            dataTestId="select"
        />
    );
    expect(part('clear').getAttribute('aria-label')).toBe('close');
    await click('clear');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    expect(part('value').textContent).toBe('Кэш');
    expect(part('dropdown')).toBeNull();
    await render(
        <Select
            key="uncontrolled"
            multiple
            options={options}
            defaultValue={['cash', 'spin']}
            clear
            dataTestId="select"
        />
    );
    await click();
    await click('clear');
    expect(part('value').textContent).toBe('Выберите значение');
    expect(part('clear')).toBeNull();
    expect(part('dropdown')).not.toBeNull();
});

test('disabled and readOnly block interaction and hide clear, including controlled open', async () => {
    for (const blocked of [{ disabled: true }, { readOnly: true }]) {
        await render(
            <Select options={options} value="cash" clear open dataTestId="select" {...blocked} />
        );
        await click();
        expect(part('value').textContent).toBe('Кэш');
        expect(part('clear')).toBeNull();
        expect(part('dropdown')).toBeNull();
    }
});

test('updating options retains selected labels without choosing a replacement', async () => {
    const onChange = rstest.fn();
    await render(
        <Select
            options={options}
            multiple
            value={['cash', 'spin']}
            open
            onChange={onChange}
            dataTestId="select"
        />
    );
    await render(
        <Select
            options={[options[1]]}
            multiple
            value={['cash', 'spin']}
            open
            onChange={onChange}
            dataTestId="select"
        />
    );
    expect(part('value').textContent).toBe('Кэш, Турниры Spin & Go');
    expect(part('option-tournaments')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
});

test('controlled disclosure keeps search internal and resets it when closed', async () => {
    const onOpenChange = rstest.fn();
    await render(
        <Select options={options} open={false} onOpenChange={onOpenChange} dataTestId="select" />
    );
    await click();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(part('dropdown')).toBeNull();
    await render(<Select options={options} open searchable dataTestId="select" />);
    await search('Кэш');
    expect(part('option-cash')).not.toBeNull();
    expect(part('option-tournaments')).toBeNull();
    await search('Тур');
    expect(part<HTMLInputElement>('search').value).toBe('Тур');
    expect(part('option-cash')).toBeNull();
    expect(part('option-tournaments')).not.toBeNull();
    await render(<Select options={options} open={false} searchable dataTestId="select" />);
    expect(part('dropdown')).toBeNull();
    await render(<Select options={options} open searchable dataTestId="select" />);
    expect(part<HTMLInputElement>('search').value).toBe('');
    expect(part('option-cash')).not.toBeNull();
});

test('keyboard navigation skips disabled options and selects without form submission', async () => {
    await render(
        <Select options={[options[3], options[0], options[1]]} searchable dataTestId="select" />
    );
    await key('ArrowDown');
    expect(part('option-cash').classList.contains(styles.active)).toBe(true);
    await key('ArrowDown', part('search'));
    await key('Enter', part('search'));
    expect(part('value').textContent).toBe('Турниры');
    expect(part('dropdown')).toBeNull();
});

test('form data contains ids and reset restores uncontrolled defaults', async () => {
    await render(
        <form>
            <Select
                name="formats"
                multiple
                options={options}
                defaultValue={['cash']}
                clear
                dataTestId="select"
            />
        </form>
    );
    const form = container.querySelector('form')!;
    await click();
    await click('option-spin');
    expect(new FormData(form).getAll('formats')).toEqual(['cash', 'spin']);
    await act(async () => form.reset());
    expect(new FormData(form).getAll('formats')).toEqual(['cash']);
    expect(part('dropdown')).toBeNull();
    await render(
        <form>
            <Select name="formats" options={options} value="cash" disabled dataTestId="select" />
        </form>
    );
    expect(new FormData(container.querySelector('form')!).getAll('formats')).toEqual([]);
});

test('field errors follow Input hint rules and do not replace options', async () => {
    await render(
        <Select
            options={options}
            error="Проверьте формат"
            hint="Выберите формат"
            dataTestId="select"
        />
    );
    expect(part('error').textContent).toBe('Проверьте формат');
    await click();
    expect(part('options')).not.toBeNull();
    await render(<Select options={options} error="Проверьте формат" dataTestId="select" />);
    expect(part('error')).toBeNull();
    expect(part('form-control').classList.contains(styles.error)).toBe(true);
});

test('empty options show the no-results message with a hint only for a search query', async () => {
    await render(<Select options={[]} searchable open dataTestId="select" />);
    expect(part('empty').textContent).toBe('Ничего не найдено');
    await search('Омаха');
    expect(part('empty').textContent).toBe('Ничего не найденоИзмените поисковый запрос');
    expect(part('form-control').classList.contains(styles.error)).toBe(false);
});

for (const size of [40, 48, 56, 64, 72] as const) {
    test(`inner label stays mounted through focus, selection and clear at size ${size}`, async () => {
        await render(
            <Select
                options={options}
                size={size}
                label="Формат игры"
                labelView="inner"
                clear
                dataTestId="select"
            />
        );
        const label = part('label');
        expect(label.textContent).toBe('Формат игры');
        expect(part('form-control').classList.contains(styles.labelRaised)).toBe(false);
        await act(async () => part().focus());
        expect(part('label')).toBe(label);
        expect(part('form-control').classList.contains(styles.labelRaised)).toBe(true);
        await act(async () => part().blur());
        expect(part('form-control').classList.contains(styles.labelRaised)).toBe(false);
        await click();
        expect(part('label')).toBe(label);
        await click('option-cash');
        expect(part('value').textContent).toBe('Кэш');
        expect(part('label')).toBe(label);
        await click('clear');
        await act(async () => part().blur());
        expect(part('label')).toBe(label);
        expect(part('form-control').classList.contains(styles.labelRaised)).toBe(false);
        expect(part('value').textContent).toBe('Выберите значение');
    });
}

test('clicking field padding opens the dropdown', async () => {
    await render(<Select options={options} dataTestId="select" />);
    await click('field');
    expect(part('dropdown')).not.toBeNull();
});

test('native handlers keep focus callbacks and can cancel opening and navigation', async () => {
    const onClick = rstest.fn((event) => event.preventDefault());
    const onKeyDown = rstest.fn((event) => event.preventDefault());
    const onFocus = rstest.fn();
    const onBlur = rstest.fn();
    await render(
        <Select
            options={options}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            dataTestId="select"
        />
    );
    await click();
    await key('ArrowDown');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(part('dropdown')).toBeNull();
    await act(async () => part().focus());
    await act(async () => part().blur());
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
});

test('external form reset respects cancellation and restores selection and search', async () => {
    const renderForm = (cancel: boolean) =>
        render(
            <>
                <form
                    id="formats"
                    onReset={cancel ? (event) => event.preventDefault() : undefined}
                />
                <Select
                    form="formats"
                    options={options}
                    multiple
                    defaultValue={['cash']}
                    searchable
                    dataTestId="select"
                />
            </>
        );
    await renderForm(true);
    await click();
    await search('Тур');
    await click('option-spin');
    await act(async () => container.querySelector('form')!.reset());
    expect(part('value').textContent).toBe('Кэш, Турниры Spin & Go');
    expect(part<HTMLInputElement>('search').value).toBe('Тур');
    await renderForm(false);
    await act(async () => container.querySelector('form')!.reset());
    expect(part('value').textContent).toBe('Кэш');
    expect(part('dropdown')).toBeNull();
    await click();
    expect(part<HTMLInputElement>('search').value).toBe('');
});
