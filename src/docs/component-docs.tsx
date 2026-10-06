import { ArgTypes, Markdown, Source, Title } from '@koslibs/builder/storybook/blocks';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import styles from './component-docs.module.css';

type CssSource = { name: string; content: string };
type ComponentDocsProps = {
    componentName: string;
    documentation: ReactNode;
    props?: ReactNode;
    changelog: string;
    cssSources: CssSource[];
};

const tabs = ['Документация', 'Разработчику', 'Обновления'];

function cssVariables(sources: CssSource[]) {
    const defaults = new Map<string, string>();
    const used = new Map<string, { fallback: string; sources: Set<string> }>();

    for (const source of sources) {
        for (const match of source.content.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
            defaults.set(match[1], match[2].trim());
        }
        for (const match of source.content.matchAll(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g)) {
            const value = used.get(match[1]) ?? {
                fallback: match[2]?.trim() ?? '—',
                sources: new Set<string>(),
            };
            value.sources.add(source.name);
            used.set(match[1], value);
        }
    }

    return [...used]
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([name, value]) => ({
            name,
            value: defaults.get(name) ?? value.fallback,
            sources: [...value.sources].join(', '),
        }));
}

export function ComponentDocs({
    componentName,
    documentation,
    props,
    changelog,
    cssSources,
}: ComponentDocsProps) {
    const [activeTab, setActiveTab] = useState(0);
    const id = useId();
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);
    const variables = cssVariables(cssSources);

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        let next: number;
        switch (event.key) {
            case 'ArrowRight':
                next = (index + 1) % tabs.length;
                break;
            case 'ArrowLeft':
                next = (index + tabs.length - 1) % tabs.length;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = tabs.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        setActiveTab(next);
        buttons.current[next]?.focus();
    }

    return (
        <>
            <Title />
            <div
                className={styles.tabs}
                role="tablist"
                aria-label={`Разделы документации ${componentName}`}
            >
                {tabs.map((label, index) => (
                    <button
                        key={label}
                        ref={(element) => {
                            buttons.current[index] = element;
                        }}
                        className={styles.tab}
                        type="button"
                        role="tab"
                        id={`${id}-tab-${index}`}
                        aria-selected={activeTab === index}
                        aria-controls={`${id}-panel-${index}`}
                        tabIndex={activeTab === index ? 0 : -1}
                        onClick={() => setActiveTab(index)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {[
                documentation,
                <>
                    <h2>Подключение</h2>
                    <Source
                        code={`import { ${componentName} } from '@koslibs/components/${componentName}';`}
                        language="tsx"
                    />
                    <h2>Props</h2>
                    {props ?? <ArgTypes />}
                    <h2>CSS-переменные</h2>
                    <p>
                        Используемые переменные и значения по умолчанию. Их можно переопределить в
                        стилях приложения.
                        {componentName === 'Button' &&
                            ' Для Button также показаны переменные Spinner, который отображает загрузку.'}
                    </p>
                    <div className={styles.tableWrapper}>
                        <table className={styles.variables}>
                            <thead>
                                <tr>
                                    <th>Переменная</th>
                                    <th>По умолчанию</th>
                                    <th>Используется в</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variables.map((variable) => (
                                    <tr key={variable.name}>
                                        <td>
                                            <code>{variable.name}</code>
                                        </td>
                                        <td>
                                            <code>{variable.value}</code>
                                        </td>
                                        <td>{variable.sources}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>,
                <Markdown>{changelog}</Markdown>,
            ].map((content, index) => (
                <div
                    key={tabs[index]}
                    className={styles.panel}
                    role="tabpanel"
                    id={`${id}-panel-${index}`}
                    aria-labelledby={`${id}-tab-${index}`}
                    hidden={activeTab !== index}
                    tabIndex={0}
                >
                    {content}
                </div>
            ))}
        </>
    );
}
