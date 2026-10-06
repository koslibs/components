import { afterEach, beforeEach, expect, test } from '@koslibs/builder/rstest';
import { act, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Typography, TypographyText, TypographyTitle, Text, Title } from '.';

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
    return container.firstElementChild!;
}

test('exposes the same Text and Title through namespace and named imports', () => {
    expect(Typography.Text).toBe(TypographyText);
    expect(Text).toBe(TypographyText);
    expect(Typography.Title).toBe(TypographyTitle);
    expect(Title).toBe(TypographyTitle);
});

test('defaults to inline text and supports semantic paragraph and list item tags', () => {
    expect(render(<Typography.Text>Inline text</Typography.Text>).tagName).toBe('SPAN');
    expect(render(<Typography.Text tag="p">Paragraph</Typography.Text>).tagName).toBe('P');
    render(
        <ul>
            <Typography.Text tag="li">List item</Typography.Text>
        </ul>
    );
    expect(container.querySelector('ul > li')?.textContent).toBe('List item');
});

test('keeps heading semantics independent of visual size and forwards refs', () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const heading = render(
        <Typography.Title tag="h2" size={13} ref={headingRef}>
            Small heading
        </Typography.Title>
    );
    expect(heading.tagName).toBe('H2');
    expect(headingRef.current).toBe(heading);

    const paragraphRef = createRef<HTMLParagraphElement>();
    const paragraph = render(
        <Typography.Text tag="p" size={20} ref={paragraphRef}>
            Large paragraph
        </Typography.Text>
    );
    expect(paragraphRef.current).toBe(paragraph);
});

test('passes HTML attributes, custom styles and events to the root element', () => {
    let clicks = 0;
    const text = render(
        <Typography.Text
            tag="div"
            id="session-result"
            dataTestId="result"
            className="custom-text"
            style={{ color: '#1679a3', margin: 8 }}
            aria-label="Session result"
            onClick={() => {
                clicks += 1;
            }}
        >
            +24.8%
        </Typography.Text>
    ) as HTMLElement;
    expect(text.id).toBe('session-result');
    expect(text.dataset.testId).toBe('result');
    expect(text.classList.contains('custom-text')).toBe(true);
    expect(text.style.color).toBe('#1679a3');
    expect(text.style.margin).toBe('8px');
    expect(text.getAttribute('aria-label')).toBe('Session result');
    act(() => text.click());
    expect(clicks).toBe(1);
});

test('keeps full text in DOM when limiting lines and changing visual case', () => {
    const content = 'Session summary with the full text available to assistive technology';
    for (const rowLimit of [1, 2, 3] as const) {
        const text = render(
            <Typography.Text caps monospaceNumbers rowLimit={rowLimit}>
                {content}
            </Typography.Text>
        );
        expect(text.textContent).toBe(content);
        expect(text.hasAttribute('rowLimit')).toBe(false);
        expect(text.hasAttribute('caps')).toBe(false);
        expect(text.hasAttribute('monospaceNumbers')).toBe(false);
    }
});
