import { afterEach, beforeEach, expect, rstest, test } from '@koslibs/builder/rstest';
import { act, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Datepicker, DatepickerPopover } from '.';

import styles from './index.module.css';

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

async function render(node: ReactNode) {
    await act(async () => root.render(node));
}

function part<T extends HTMLElement = HTMLElement>(suffix = '') {
    return document.querySelector<T>(`[data-test-id="picker${suffix ? `-${suffix}` : ''}"]`)!;
}

async function click(suffix = '') {
    await act(async () => part(suffix).click());
}

test('standalone popover requests dismissal and waits for the parent to close it', async () => {
    const anchor = container;
    const onClose = rstest.fn();

    await render(
        <DatepickerPopover open anchorElement={anchor} onClose={onClose} dataTestId="picker" />
    );
    await click('panel-cancel');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(part('panel')).not.toBeNull();

    await act(async () =>
        part('panel-date').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        )
    );
    expect(onClose).toHaveBeenCalledTimes(2);

    await act(async () => document.body.dispatchEvent(new Event('pointerdown', { bubbles: true })));
    expect(onClose).toHaveBeenCalledTimes(3);
    expect(part('panel')).not.toBeNull();

    await render(
        <DatepickerPopover
            open={false}
            anchorElement={anchor}
            onClose={onClose}
            dataTestId="picker"
        />
    );
    expect(part('panel')).toBeNull();
});

test('standalone popover retains applied values and discards drafts on external close', async () => {
    const anchor = container;
    const onChange = rstest.fn();

    const renderPopover = (open: boolean) =>
        render(
            <DatepickerPopover
                open={open}
                anchorElement={anchor}
                defaultValue="2026-10-25"
                onChange={onChange}
                dataTestId="picker"
            />
        );

    await renderPopover(true);
    await click('panel-day-2026-10-26');
    expect(onChange).not.toHaveBeenCalled();
    await click('panel-apply');
    expect(onChange.mock.calls[0][1]).toEqual({ value: '2026-10-26' });
    expect(part('panel')).not.toBeNull();

    await click('panel-day-2026-10-27');
    await renderPopover(false);
    await renderPopover(true);
    expect(part<HTMLInputElement>('panel-date').value).toBe('2026-10-26');
    expect(onChange).toHaveBeenCalledTimes(1);
});

test('field forwards ref and native attributes and renders labels and dialog', async () => {
    const ref = createRef<HTMLButtonElement>();

    await render(
        <Datepicker
            ref={ref}
            id="date"
            label="Date"
            hint="Help"
            dataTestId="picker"
            defaultOpen
            size={56}
            labelView="inner"
            hasOutline
            panelClassName="custom-panel"
        />
    );
    expect(ref.current).toBe(part());
    expect(part().tagName).toBe('BUTTON');
    expect(part('form-control').classList.contains(styles.open)).toBe(true);
    expect(part().id).toBe('date');
    expect(part('label').id).toBeTruthy();
    expect(part('label').textContent).toBe('Date');
    expect(part('panel').getAttribute('role')).toBe('dialog');
    expect(part('panel').classList.contains('custom-panel')).toBe(true);

    for (const attr of ['mode', 'defaultOpen', 'hasOutline', 'clear', 'panelClassName'])
        expect(part().hasAttribute(attr)).toBe(false);
});

test('field-owned markup only exposes data-test-id metadata', async () => {
    await render(<Datepicker dataTestId="picker" label="Date" />);

    for (const element of [part('form-control'), part('field'), part(), part('label')]) {
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

test('only Apply commits, Cancel and repeated trigger close discard draft', async () => {
    const onChange = rstest.fn();

    await render(<Datepicker defaultValue="2026-10-25" dataTestId="picker" onChange={onChange} />);
    await click();
    await click('panel-day-2026-10-26');
    expect(part('value').textContent).toBe('25/10/2026');
    expect(onChange).not.toHaveBeenCalled();
    await click('panel-cancel');
    expect(part('panel')).toBeNull();
    expect(document.activeElement).toBe(part());
    await click();
    expect(part<HTMLInputElement>('panel-date').value).toBe('2026-10-25');
    await click('panel-day-2026-10-26');
    await click();
    await click();
    expect(part<HTMLInputElement>('panel-date').value).toBe('2026-10-25');
    await click('panel-day-2026-10-26');
    await click('panel-apply');
    expect(part('value').textContent).toBe('26/10/2026');
    expect(onChange.mock.calls[0][1]).toEqual({ value: '2026-10-26' });
    expect(part('panel')).toBeNull();
    expect(document.activeElement).toBe(part());
});

test('controlled value and visibility wait for caller updates', async () => {
    const onChange = rstest.fn();
    const onOpenChange = rstest.fn();

    await render(
        <Datepicker
            value="2026-10-25"
            open
            onChange={onChange}
            onOpenChange={onOpenChange}
            dataTestId="picker"
        />
    );
    await click('panel-day-2026-10-26');
    await click('panel-apply');
    expect(part('value').textContent).toBe('25/10/2026');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(part('panel')).not.toBeNull();
    await render(
        <Datepicker
            value="2027-02-08"
            open
            onChange={onChange}
            onOpenChange={onOpenChange}
            dataTestId="picker"
        />
    );
    expect(part<HTMLInputElement>('panel-date').value).toBe('2027-02-08');
    expect(part('value').textContent).toBe('08/02/2027');
});

test('Escape restores trigger focus, outside pointer preserves outside focus and cancels', async () => {
    await render(
        <>
            <Datepicker defaultValue="2026-10-25" defaultOpen dataTestId="picker" />
            <button id="outside">Outside</button>
        </>
    );
    await click('panel-day-2026-10-26');
    await act(async () =>
        part('panel').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        )
    );
    expect(part('panel')).toBeNull();
    expect(document.activeElement).toBe(part());
    await click();
    await click('panel-day-2026-10-26');

    const outside = document.getElementById('outside')!;

    await act(async () => {
        outside.focus();
        outside.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    });
    expect(part('panel')).toBeNull();
    expect(document.activeElement).toBe(outside);
    await click();
    expect(part<HTMLInputElement>('panel-date').value).toBe('2026-10-25');
});

test('disabled and readOnly hide panels, forbid changes and clearing', async () => {
    await render(
        <Datepicker defaultOpen disabled clear defaultValue="2026-10-25" dataTestId="picker" />
    );
    expect(part<HTMLButtonElement>().disabled).toBe(true);
    expect(part('panel')).toBeNull();
    expect(part('clear')).toBeNull();
    await render(<Datepicker open readOnly clear defaultValue="2026-10-25" dataTestId="picker" />);
    await click();
    expect(part('panel')).toBeNull();
    expect(part('clear')).toBeNull();
    await render(<Datepicker open defaultValue="2026-10-25" dataTestId="picker" />);
    expect(part('panel')).not.toBeNull();
    await render(<Datepicker open disabled defaultValue="2026-10-25" dataTestId="picker" />);
    expect(part('panel')).toBeNull();
});

test('clear reports only onClear and controlled clear waits for update', async () => {
    const onClear = rstest.fn();
    const onChange = rstest.fn();

    await render(
        <Datepicker
            clear
            defaultValue="2026-10-25"
            onClear={onClear}
            onChange={onChange}
            dataTestId="picker"
        />
    );
    await click('clear');
    expect(part('value').textContent).toBe('Choose date');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    await render(<Datepicker clear value="2026-10-25" onClear={onClear} dataTestId="picker" />);
    await click('clear');
    expect(part('value').textContent).toBe('25/10/2026');
});

test('native forms serialize single and range and reset uncontrolled values and open state', async () => {
    await render(
        <form id="form">
            <Datepicker name="date" defaultValue="2026-10-25" dataTestId="picker" />
        </form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(new FormData(form).get('date')).toBe('2026-10-25');
    await click();
    await click('panel-day-2026-10-26');
    await click('panel-apply');
    await click();
    await act(async () => form.reset());
    expect(part('value').textContent).toBe('25/10/2026');
    expect(part('panel')).toBeNull();
    await render(
        <form id="form">
            <Datepicker
                key="range"
                mode="range"
                name="period"
                defaultValue={{ from: '2026-12-28', to: '2027-01-04' }}
                dataTestId="picker"
            />
        </form>
    );
    expect([...new FormData(document.getElementById('form') as HTMLFormElement)]).toEqual([
        ['period.from', '2026-12-28'],
        ['period.to', '2027-01-04'],
    ]);
    await render(
        <form id="form">
            <Datepicker mode="range" name="period" value={null} dataTestId="picker" />
        </form>
    );
    expect([...new FormData(document.getElementById('form') as HTMLFormElement)]).toEqual([
        ['period.from', ''],
        ['period.to', ''],
    ]);
    await render(
        <form id="form">
            <Datepicker name="date" disabled defaultValue="2026-10-25" dataTestId="picker" />
        </form>
    );
    expect(new FormData(document.getElementById('form') as HTMLFormElement).has('date')).toBe(
        false
    );
});

test('Escape also closes when focus is on the trigger', async () => {
    await render(<Datepicker defaultOpen dataTestId="picker" />);
    await act(async () => {
        part().focus();
        part().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        );
    });
    expect(part('panel')).toBeNull();
});

test('Escape on a second trigger closes its calendar and preserves the first draft', async () => {
    await render(
        <>
            <Datepicker defaultOpen defaultValue="2026-10-25" dataTestId="first" />
            <Datepicker defaultOpen defaultValue="2026-10-25" dataTestId="picker" />
        </>
    );
    await act(async () =>
        document.querySelector<HTMLElement>('[data-test-id="first-panel-day-2026-10-27"]')!.click()
    );
    await click('panel-day-2026-10-26');
    await act(async () => {
        part().focus();
        part().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        );
    });
    expect(part('panel')).toBeNull();
    expect(document.querySelector('[data-test-id="first-panel"]')).not.toBeNull();
    expect(
        document.querySelector<HTMLInputElement>('[data-test-id="first-panel-date"]')!.value
    ).toBe('2026-10-27');
    expect(document.activeElement).toBe(part());
});

test('a trigger handler can prevent Escape from cancelling its draft', async () => {
    await render(
        <Datepicker
            defaultOpen
            defaultValue="2026-10-25"
            dataTestId="picker"
            onKeyDown={(event) => event.preventDefault()}
        />
    );
    await click('panel-day-2026-10-26');
    await act(async () =>
        part().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        )
    );
    expect(part('panel')).not.toBeNull();
    expect(part<HTMLInputElement>('panel-date').value).toBe('2026-10-26');
});

test('Escape on a second clear button cancels its calendar and preserves the first draft', async () => {
    await render(
        <>
            <Datepicker defaultOpen clear defaultValue="2026-10-25" dataTestId="first" />
            <Datepicker defaultOpen clear defaultValue="2026-10-25" dataTestId="picker" />
        </>
    );
    await act(async () =>
        document.querySelector<HTMLElement>('[data-test-id="first-panel-day-2026-10-27"]')!.click()
    );
    await click('panel-day-2026-10-26');
    await act(async () => {
        part('clear').focus();
        part('clear').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        );
    });
    expect(part('panel')).toBeNull();
    expect(document.querySelector('[data-test-id="first-panel"]')).not.toBeNull();
    expect(
        document.querySelector<HTMLInputElement>('[data-test-id="first-panel-date"]')!.value
    ).toBe('2026-10-27');
    expect(document.activeElement).toBe(part());
    expect(part('value').textContent).toBe('25/10/2026');
});

test('external form works and prevented reset retains committed value and draft', async () => {
    await render(
        <>
            <form id="form" onReset={(event) => event.preventDefault()} />
            <Datepicker form="form" name="date" defaultValue="2026-10-25" dataTestId="picker" />
        </>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    await click();
    await click('panel-day-2026-10-26');
    await click('panel-apply');
    await click();
    await act(async () => form.reset());
    expect(new FormData(form).get('date')).toBe('2026-10-26');
    expect(part('panel')).not.toBeNull();
});
