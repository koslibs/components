import { afterEach, beforeEach, expect, test } from '@koslibs/builder/rstest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Spinner } from '.';

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
    return container.querySelector('svg')!;
}

test('keeps SVG masks independent for multiple Spinner instances', () => {
    render(
        <>
            <Spinner visible />
            <Spinner visible />
        </>
    );
    const spinners = [...container.querySelectorAll('svg')];
    const maskIds = spinners.map((spinner) => spinner.querySelector('mask')!.id);
    expect(new Set(maskIds).size).toBe(2);
    for (const [index, spinner] of spinners.entries()) {
        expect(spinner.querySelector('foreignObject')!.getAttribute('mask')).toBe(
            `url(#${maskIds[index]})`
        );
    }
});

test('supports standalone color, className and DOM identifiers', () => {
    const spinner = render(
        <Spinner
            visible
            id="sync-spinner"
            dataTestId="sync"
            className="custom-spinner"
            style={{ color: '#1679a3', margin: 8 }}
        />
    );
    expect(spinner.id).toBe('sync-spinner');
    expect(spinner.dataset.testId).toBe('sync');
    expect(spinner.classList.contains('custom-spinner')).toBe(true);
    expect(spinner.style.color).toBe('#1679a3');
    expect(spinner.style.margin).toBe('8px');
});

test('renders SVG geometry for all supported sizes', () => {
    for (const [size, diameter] of [
        [16, 14],
        [24, 20],
        [48, 40],
    ] as const) {
        const spinner = render(<Spinner visible size={size} />);
        expect(spinner.getAttribute('viewBox')).toBe(`0 0 ${diameter} ${diameter}`);
        expect(spinner.style.width).toBe(`${diameter}px`);
        expect(spinner.style.height).toBe(`${diameter}px`);
    }
});
