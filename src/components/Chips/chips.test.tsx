import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, type ReactNode, type SyntheticEvent } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Chips } from '.';

let container: HTMLDivElement;
let root: Root;

const items = [
    { value: 'all', label: 'All' },
    { value: 'co', label: 'CO' },
    { value: 'btn', label: 'BTN' },
    { value: 'unknown', label: 'Unknown (0)', disabled: true },
];

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

async function render(node: ReactNode) {
    await act(async () => root.render(node));
}

function input(value: string, scope: Element = container) {
    return scope.querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
}

function selected() {
    return Array.from(container.querySelectorAll<HTMLInputElement>('input:checked')).map(
        (element) => element.value
    );
}

async function click(value: string) {
    await act(async () => input(value).click());
}

test('single selection moves between items and a repeated click preserves its value', async () => {
    const onChange = rstest.fn();

    await render(<Chips items={items} defaultValue="co" onChange={onChange} />);
    expect(input('btn').type).toBe('radio');

    await click('btn');
    expect(selected()).toEqual(['btn']);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { value: 'btn' });

    await click('btn');
    expect(selected()).toEqual(['btn']);
    expect(onChange).toHaveBeenCalledTimes(1);
});

test('multiselect toggles independently and All is an ordinary value', async () => {
    const onChange = rstest.fn();

    await render(<Chips items={items} multiselect defaultValue={['co']} onChange={onChange} />);
    expect(input('btn').type).toBe('checkbox');

    await click('all');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { value: ['co', 'all'] });

    await click('btn');
    await click('co');
    expect(selected()).toEqual(['all', 'btn']);

    await click('all');
    await click('btn');
    expect(selected()).toEqual([]);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { value: [] });
});

test('controlled single and multiselect wait for caller updates, including empty values', async () => {
    const onChange = rstest.fn();

    await render(<Chips items={items} value={null} onChange={onChange} />);
    await click('co');
    expect(selected()).toEqual([]);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { value: 'co' });

    await render(<Chips items={items} value="btn" onChange={onChange} />);
    expect(selected()).toEqual(['btn']);

    await render(<Chips items={items} multiselect value={[]} onChange={onChange} />);
    await click('co');
    expect(selected()).toEqual([]);

    await render(<Chips items={items} multiselect value={['co']} onChange={onChange} />);
    expect(selected()).toEqual(['co']);
    expect(onChange).toHaveBeenCalledTimes(2);
});

test('disabled items retain selection and disabled groups cannot change', async () => {
    const onChange = rstest.fn();

    await render(
        <Chips items={items} multiselect defaultValue={['unknown']} onChange={onChange} />
    );
    expect(input('unknown').disabled).toBe(true);
    await click('unknown');
    expect(onChange).not.toHaveBeenCalled();

    await click('btn');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), { value: ['unknown', 'btn'] });

    await render(<Chips items={items} multiselect disabled onChange={onChange} />);
    expect(input('co').disabled).toBe(true);
    await click('co');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(selected()).toEqual(['btn', 'unknown']);
});

test('normalization excludes unknown and duplicate values without discarding disabled ones', async () => {
    const onChange = rstest.fn();

    await render(
        <Chips
            items={items}
            multiselect
            defaultValue={['missing', 'co', 'co', 'unknown']}
            onChange={onChange}
        />
    );
    expect(selected()).toEqual(['co', 'unknown']);

    await click('btn');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), {
        value: ['co', 'unknown', 'btn'],
    });

    await render(
        <Chips
            items={items.filter((item) => item.value !== 'co')}
            multiselect
            onChange={onChange}
        />
    );
    await click('all');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), {
        value: ['unknown', 'btn', 'all'],
    });
});

test('separate single groups do not interfere with each other', async () => {
    await render(
        <>
            <Chips items={items} defaultValue="co" />
            <Chips items={items} defaultValue="btn" />
        </>
    );
    const groups = container.querySelectorAll('fieldset');

    expect(input('co', groups[0]).name).not.toBe(input('btn', groups[1]).name);
    await act(async () => input('all', groups[1]).click());
    expect(input('co', groups[0]).checked).toBe(true);
    expect(input('all', groups[1]).checked).toBe(true);
});

test('uncontrolled reset restores selection without submitting internal input names', async () => {
    const onChange = rstest.fn();

    await render(
        <form>
            <Chips items={items} multiselect defaultValue={['co']} onChange={onChange} />
        </form>
    );
    await click('btn');
    const form = container.querySelector('form')!;

    expect([...new FormData(form)]).toEqual([]);
    await act(async () => form.reset());
    expect(selected()).toEqual(['co']);
    expect(onChange).toHaveBeenCalledTimes(1);
});

test('prevented reset retains the uncontrolled selection', async () => {
    const handleReset = (event: SyntheticEvent<HTMLFormElement>) => event.preventDefault();

    await render(
        <form onReset={handleReset}>
            <Chips items={items} defaultValue="co" />
        </form>
    );
    await click('btn');
    await act(async () => container.querySelector('form')!.reset());
    expect(selected()).toEqual(['btn']);
});

test('controlled form reset preserves the supplied value and external form is supported', async () => {
    await render(
        <>
            <form id="filters" />
            <Chips items={items} form="filters" value="btn" />
        </>
    );
    const form = container.querySelector('form')!;

    expect([...new FormData(form)]).toEqual([]);
    await act(async () => form.reset());
    expect(selected()).toEqual(['btn']);
});

test('forwards the group ref and native attributes without extra data or aria metadata', async () => {
    const ref = createRef<HTMLFieldSetElement>();

    await render(
        <Chips ref={ref} items={items} id="positions" title="Positions" dataTestId="chips" />
    );
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current?.id).toBe('positions');
    expect(ref.current?.title).toBe('Positions');
    expect(input('btn').getAttribute('data-test-id')).toBe('chips-btn');

    for (const element of container.querySelectorAll('*')) {
        expect(
            element
                .getAttributeNames()
                .filter(
                    (name) =>
                        name.startsWith('aria-') ||
                        (name.startsWith('data-') && name !== 'data-test-id')
                )
        ).toEqual([]);
    }
});
