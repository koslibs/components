import { Controls, Description, Primary } from '@koslibs/builder/storybook/blocks';
import type { ReactNode } from 'react';

import { ComponentDocs } from '../../../docs/component-docs';
import changelog from '../CHANGELOG.md?raw';
import colors from '../colors.module.css?raw';
import spinnerStyles from '../index.module.css?raw';
import presets from '../preset.module.css?raw';
import variables from '../vars.css?raw';

import { Spinner } from '..';

function Example({
    name,
    title,
    description,
    children,
}: {
    name: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section id={name} style={{ marginTop: 32 }}>
            <h2>{title}</h2>
            <p style={{ margin: '12px 0 20px' }}>{description}</p>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 32,
                    width: 'fit-content',
                    maxWidth: '100%',
                    padding: 16,
                }}
            >
                {children}
            </div>
        </section>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Меняйте visible, size и style в Controls. Для изменения цвета передайте в style
                объект с полем color, например {'{ "color": "#1679a3" }'}.
            </p>
            <Primary />
            <h2>Параметры</h2>
            <p>
                visible управляет показом, size выбирает размер, а style и className позволяют
                настроить оформление. id и dataTestId относятся к корневому SVG-элементу.
            </p>
            <Controls />
            <Example
                name="sizes"
                title="Размеры"
                description="Размеры 16, 24 и 48 px включают внутренние отступы. Диаметр самого SVG — 14, 20 и 40 px соответственно. По умолчанию используется размер 24."
            >
                {([16, 24, 48] as const).map((size) => (
                    <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                        <Spinner visible size={size} />
                        <span>{size} px</span>
                    </div>
                ))}
            </Example>
            <Example
                name="hidden"
                title="Видимость"
                description="Без visible или при visible=false индикатор скрыт через display: none и не занимает места. Чтобы проверить переключение, измените visible в Playground."
            >
                <span>При visible=false индикатор не занимает места</span>
                <Spinner visible={false} />
            </Example>
            <Example
                name="custom-color"
                title="Цвет"
                description="Градиент индикатора использует currentColor. Задайте style.color или собственный CSS-класс, чтобы изменить цвет под контекст действия."
            >
                <Spinner visible style={{ color: '#1679a3' }} />
            </Example>
            <Example
                name="on-dark"
                title="Тёмный фон"
                description="На тёмном фоне задайте светлый цвет, чтобы индикатор оставался различимым. В примере используется белый спиннер на фоне #121212."
            >
                <div style={{ background: '#121212', padding: 32, borderRadius: 8 }}>
                    <Spinner visible style={{ color: '#ffffff' }} />
                </div>
            </Example>
        </>
    );
}

export function SpinnerDocs() {
    return (
        <ComponentDocs
            componentName="Spinner"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Spinner/colors.module.css', content: colors },
                { name: 'Spinner/index.module.css', content: spinnerStyles },
                { name: 'Spinner/preset.module.css', content: presets },
                { name: 'Spinner/vars.css', content: variables },
            ]}
        />
    );
}
