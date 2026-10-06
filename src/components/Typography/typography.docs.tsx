import {
    ArgTypes,
    Controls,
    Description,
    Primary,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import type { CSSProperties, ReactNode } from 'react';

import { ComponentDocs } from '../../docs/component-docs';
import theme from '../../styles/theme.css?raw';

import changelog from './CHANGELOG.md?raw';
import colors from './colors.module.css?raw';
import typographyStyles from './index.module.css?raw';
import presets from './preset.module.css?raw';
import variables from './vars.css?raw';

import {
    TypographyText,
    TypographyTitle,
    type TextProps,
    type TypographyColor,
    type TypographyWeight,
} from '.';

const figmaPresets: { size: NonNullable<TextProps['size']>; weight: TypographyWeight }[] = [
    { size: 8, weight: 'regular' },
    { size: 8, weight: 'bold' },
    { size: 9, weight: 'semibold' },
    { size: 10, weight: 'regular' },
    { size: 10, weight: 'medium' },
    { size: 10, weight: 'semibold' },
    { size: 11, weight: 'regular' },
    { size: 11, weight: 'bold' },
    { size: 12, weight: 'regular' },
    { size: 12, weight: 'bold' },
    { size: 13, weight: 'medium' },
    { size: 13, weight: 'semibold' },
    { size: 13, weight: 'bold' },
    { size: 14, weight: 'bold' },
];

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
            <Unstyled>
                <div style={{ display: 'grid', gap: 16, padding: 16 }}>{children}</div>
            </Unstyled>
        </section>
    );
}

const longText =
    'История раздач помогает разбирать решения за столом, отслеживать результаты и сравнивать показатели игроков за выбранный период.';

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>Меняйте текст, размер, вес, цвет и число строк в Controls.</p>
            <Primary />
            <h2>Использование</h2>
            <pre>
                <code>{`import { Typography } from '@koslibs/components/Typography';

<Typography.Text size={13} weight="medium">Overview</Typography.Text>
<Typography.Title tag="h2" size={14}>Winrate dynamics</Typography.Title>
<Typography.Text color="positive" monospaceNumbers>+24.8%</Typography.Text>`}</code>
            </pre>
            <p>
                TypographyText по умолчанию рендерит span размером 13 px с весом regular;
                TypographyTitle — 28 px с весом bold. Для TypographyTitle явно передайте tag: h1–h6
                или div. Уровень заголовка выбирайте по структуре страницы. Оба компонента наследуют
                цвет и не добавляют отступов.
            </p>
            <p>
                Общие параметры: size, weight, color, caps, monospaceNumbers, rowLimit, className,
                style, dataTestId. Поддерживаются ref и стандартные HTML-атрибуты, включая aria-*.
                Inter входит в библиотеку и подключается автоматически вместе со стилями. Семейство
                шрифта задаётся общей переменной --font-primary; её можно переопределить в CSS
                приложения или контейнера. По умолчанию используется 'Inter', sans-serif.
            </p>
            <Controls />
            <Example
                name="font-primary"
                title="Основной шрифт"
                description="По умолчанию используется локальный Inter. Переменная --font-primary наследуется от контейнера: переопределите её, чтобы использовать другой шрифт в отдельном блоке или во всём приложении."
            >
                <TypographyText color="primary">Inter — основной шрифт библиотеки</TypographyText>
                <div style={{ '--font-primary': 'Georgia, serif' } as CSSProperties}>
                    <TypographyText color="primary">
                        Georgia — шрифт этого контейнера
                    </TypographyText>
                </div>
            </Example>
            <Example
                name="figma-presets"
                title="Стили из Figma"
                description="Начертания из макета Overview: размеры 8–14 px, нулевой letter-spacing и автоматическая высота строки. Для бренда используется 15 px / bold, для значения метрики — 28 px / bold."
            >
                {figmaPresets.map(({ size, weight }) => (
                    <div
                        key={`${size}-${weight}`}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            gap: 16,
                        }}
                    >
                        <TypographyText color="secondary" style={{ width: 110 }}>
                            {size} px / {weight}
                        </TypographyText>
                        <TypographyText size={size} weight={weight} color="primary">
                            GullEye — статистика раздач
                        </TypographyText>
                    </div>
                ))}
                <TypographyText size={15} weight="bold" color="primary">
                    GullEye
                </TypographyText>
                <TypographyTitle tag="div" size={28} color="primary" monospaceNumbers>
                    6.8 bb/100
                </TypographyTitle>
            </Example>
            <Example
                name="text-sizes"
                title="Размеры текста"
                description="Полный набор размеров TypographyText. Размеры 16 и 20 px дополняют компактные стили макета для обычного текста."
            >
                {([8, 9, 10, 11, 12, 13, 14, 15, 16, 20] as const).map((size) => (
                    <TypographyText key={size} size={size} color="primary">
                        {size} px — История раздач / Hand history
                    </TypographyText>
                ))}
            </Example>
            <Example
                name="titles"
                title="Заголовки"
                description="TypographyTitle поддерживает 13, 14, 16, 20, 24, 28 и 32 px. Стили 13, 14 и 28 px встречаются в макете; остальные размеры доступны для более крупных заголовков. Все примеры ниже имеют один семантический уровень h3."
            >
                {([13, 14, 16, 20, 24, 28, 32] as const).map((size) => (
                    <TypographyTitle key={size} tag="h3" size={size} color="primary">
                        {size} px — Статистика / Statistics
                    </TypographyTitle>
                ))}
            </Example>
            <Example
                name="weights"
                title="Начертания"
                description="Inter: regular 400, medium 500, semibold 600 и bold 700."
            >
                {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
                    <TypographyText key={weight} size={16} weight={weight} color="primary">
                        {weight} — GullEye, статистика 1234567890
                    </TypographyText>
                ))}
            </Example>
            <Example
                name="colors"
                title="Цвета"
                description="Основной, вторичный, инверсный текст и цвета результатов взяты из макета. inherit позволяет использовать цвет родителя."
            >
                {(
                    ['inherit', 'primary', 'secondary', 'inverse', 'positive', 'negative'] as const
                ).map((color: TypographyColor) => (
                    <div
                        key={color}
                        style={{
                            padding: 12,
                            color: '#ff5722',
                            background: color === 'inverse' ? '#1c1a18' : '#f5f3ec',
                        }}
                    >
                        <TypographyText color={color}>{color} — Результат сессии</TypographyText>
                    </div>
                ))}
            </Example>
            <Example
                name="numbers-and-caps"
                title="Цифры и верхний регистр"
                description="monospaceNumbers включает табличные цифры Inter для выравнивания показателей; caps меняет только визуальный регистр текста."
            >
                <TypographyText caps weight="bold" color="primary">
                    Session summary
                </TypographyText>
                <div style={{ display: 'grid', justifyItems: 'end', width: 100 }}>
                    <TypographyText monospaceNumbers color="primary">
                        111.11
                    </TypographyText>
                    <TypographyText monospaceNumbers color="primary">
                        888.88
                    </TypographyText>
                </div>
            </Example>
            <Example
                name="row-limit"
                title="Ограничение строк"
                description="rowLimit ограничивает отображение до 1, 2 или 3 строк и добавляет многоточие. Полный текст остаётся в DOM. Родитель должен ограничивать ширину."
            >
                {([1, 2, 3] as const).map((rowLimit) => (
                    <div key={rowLimit} style={{ width: 240, maxWidth: '100%' }}>
                        <TypographyText color="secondary">rowLimit={rowLimit}</TypographyText>
                        <TypographyText tag="p" color="primary" rowLimit={rowLimit}>
                            {longText}
                        </TypographyText>
                    </div>
                ))}
            </Example>
        </>
    );
}

export function TypographyDocs() {
    return (
        <ComponentDocs
            componentName="Typography"
            documentation={<Documentation />}
            props={
                <>
                    <h3>Typography.Text</h3>
                    <ArgTypes of={TypographyText} />
                    <h3>Typography.Title</h3>
                    <ArgTypes of={TypographyTitle} />
                </>
            }
            changelog={changelog}
            cssSources={[
                { name: 'Typography/colors.module.css', content: colors },
                { name: 'Typography/index.module.css', content: typographyStyles },
                { name: 'Typography/preset.module.css', content: presets },
                { name: 'Typography/vars.css', content: variables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
