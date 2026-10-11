import {
    Controls,
    Description,
    Primary,
    Source,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';
import { TickIcon } from '@koslibs/icons/TickIcon';
import { useState, type ReactNode } from 'react';

import styles from './examples.module.css';

import { ComponentDocs } from '../../../docs/component-docs';
import theme from '../../../styles/theme.css?raw';
import { Button } from '../../Button';
import { Spinner } from '../../Spinner';
import typographyStyles from '../../Typography/index.module.css?raw';
import typographyPresets from '../../Typography/preset.module.css?raw';
import typographyVariables from '../../Typography/vars.css?raw';
import changelog from '../CHANGELOG.md?raw';
import statusStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import { Status } from '..';

const colors = ['green', 'orange', 'red', 'blue', 'grey', 'teal', 'purple', 'sand'] as const;
const sizes = [40, 32, 24, 20] as const;
const shapes = ['rectangular', 'rounded'] as const;

const example = `import { Status } from '@koslibs/components/Status';
import { TickIcon } from '@koslibs/icons/TickIcon';

<Status message="Неизвестно" />
<Status size={32} shape="rounded" color="green" message="Готово"
    leftAddon={<TickIcon width={16} height={16} />} />
<Status color="sand" message="Черновик" />
<Status message="Активен" uppercase />

// Полный текст сохраняется в DOM. title доступен при наведении.
<Status style={{ maxWidth: 220 }} title="Ожидает подтверждения администратором"
    message="Ожидает подтверждения администратором" />`;

function Example({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section style={{ marginTop: 'var(--size-32)' }}>
            <h2>{title}</h2>
            <p>{description}</p>
            <Unstyled>
                <div className={styles.preview}>{children}</div>
            </Unstyled>
        </section>
    );
}

function ProcessExample() {
    const [complete, setComplete] = useState(false);
    return (
        <div className={styles.process}>
            <div role="status" aria-live="polite" aria-atomic="true">
                <Status
                    color={complete ? 'green' : 'blue'}
                    leftAddon={
                        complete ? (
                            <TickIcon width={12} height={12} />
                        ) : (
                            <Spinner visible size={16} className={styles.spinner} />
                        )
                    }
                    dataTestId="process-status"
                    message={complete ? 'Готово' : 'В обработке'}
                />
            </div>
            <Button size={32} view="secondary" onClick={() => setComplete((current) => !current)}>
                {complete ? 'Начать снова' : 'Завершить'}
            </Button>
        </div>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <Primary />
            <h2>Использование</h2>
            <Source code={example} language="tsx" />
            <Controls />
            <Example
                title="Размеры, формы и цвета"
                description="Высота — 20/24/32/40 px; горизонтальные отступы — 8/12/16/20 px. Inter Medium: 12 px для размеров 20/24, 14 px для 32/40. Цвет sand использует фон #EDE9DE."
            >
                <div className={styles.matrix} data-test-id="status-matrix">
                    {sizes.flatMap((size) =>
                        shapes.map((shape) => (
                            <div key={`${size}-${shape}`} className={styles.row}>
                                <span className={styles.rowLabel}>
                                    {size} / {shape}
                                </span>
                                {colors.map((color) => (
                                    <Status
                                        key={color}
                                        size={size}
                                        shape={shape}
                                        color={color}
                                        dataTestId={`status-${size}-${shape}-${color}`}
                                        message={color}
                                    />
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </Example>
            <Example
                title="Аддоны"
                description="leftAddon и rightAddon независимы. Зазор между элементами — 6 px; без аддона нет обёртки и лишнего зазора. Для иконок используйте 12 px в размерах 20/24 и 16 px в 32/40. Аддоны наследуют цвет плашки, скрыты от скринридера и не должны содержать интерактивные элементы."
            >
                <Status
                    color="green"
                    leftAddon={<span className={styles.dot} />}
                    dataTestId="addon-left"
                    message="Активен"
                />
                <Status
                    color="green"
                    rightAddon={<TickIcon width={12} height={12} />}
                    dataTestId="addon-right"
                    message="Готово"
                />
                <Status
                    size={32}
                    color="teal"
                    leftAddon={<span className={styles.dot} />}
                    rightAddon={<TickIcon width={16} height={16} />}
                    dataTestId="addon-both"
                    message="Синхронизировано"
                />
            </Example>
            <Example
                title="Заглавные буквы"
                description="message задаёт текст подписи. По умолчанию регистр сохраняется. uppercase=true отображает текст заглавными буквами через TypographyText, сохраняя исходную строку в DOM. Размер и насыщенность шрифта соответствуют Figma: Inter Medium, 12 px для 20/24 и 14 px для 32/40."
            >
                <Status message="Активен" color="green" dataTestId="status-case-default" />
                <Status
                    message="Активен"
                    color="green"
                    uppercase
                    dataTestId="status-case-uppercase"
                />
            </Example>
            <Example
                title="Ограничение ширины"
                description="По умолчанию ширина зависит от содержимого. При ограничении ширины подпись остаётся в одну строку и сокращается многоточием. Высота, отступы и аддоны сохраняются. Полный текст остаётся в DOM; здесь он также передан в title."
            >
                <Status
                    className={styles.constrained}
                    color="sand"
                    leftAddon={<span className={styles.dot} />}
                    rightAddon={<TickIcon width={12} height={12} />}
                    title="Ожидает подтверждения администратором"
                    dataTestId="status-overflow"
                    message="Ожидает подтверждения администратором"
                />
            </Example>
            <Example
                title="Обновление статуса"
                description="Приложение управляет подписью, цветом и аддонами. Для объявления изменения скринридеру используйте отдельную область role=status с aria-live=polite. Статические плашки не создают live region и не входят в порядок Tab."
            >
                <ProcessExample />
            </Example>
            <p>
                Status рендерит span и передаёт ref и его HTML-атрибуты. Используйте короткую
                осмысленную подпись: цвет и декоративная иконка дополняют текст.
            </p>
        </>
    );
}

export function StatusDocs() {
    return (
        <ComponentDocs
            componentName="Status"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Status/index.module.css', content: statusStyles },
                { name: 'Status/vars.css', content: variables },
                { name: 'Typography/index.module.css', content: typographyStyles },
                { name: 'Typography/preset.module.css', content: typographyPresets },
                { name: 'Typography/vars.css', content: typographyVariables },
                { name: 'styles/theme.css', content: theme },
            ]}
        />
    );
}
