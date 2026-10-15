import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';
import { Button } from '../../Button';
import { TypographyText } from '../../Typography/text';

import { Space } from '..';

import changelog from '../CHANGELOG.md?raw';
import componentStyles from '../index.module.css?raw';

import styles from './examples.module.css';

const example = `import { Space } from '@koslibs/components/Space';

<Space direction="horizontal" size={12} align="center" wrap>
    <Button>Сохранить</Button>
    <Button view="secondary">Отмена</Button>
</Space>`;

function Documentation() {
    return (
        <>
            <Description />
            <p>
                size и children обязательны. По умолчанию direction="vertical" и align="start".
                Space использует inline-flex; fullWidth включает flex и ширину 100%.
            </p>
            <Primary />
            <div className={styles.scroll}>
                <Controls />
            </div>
            <h2>Использование</h2>
            <pre className={styles.scroll}>
                <code>{example}</code>
            </pre>
            <Unstyled>
                <Space direction="horizontal" size={12} align="center" wrap>
                    <Button>Сохранить</Button>
                    <Button view="secondary">Отмена</Button>
                </Space>
            </Unstyled>
            <h2>Отступы</h2>
            <p>
                size задаётся явно положительным числом из общей шкалы --size-*: 2, 4, 6, 8, 12, 16,
                20, 22, 24, 28, 30, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 128. Например,
                <code>{'size={16}'}</code> использует var(--size-16), поэтому переопределение
                переменной в приложении изменяет и отступ Space. Ноль, отрицательные значения и
                строковые названия размеров не поддерживаются.
            </p>
            <h2>Перенос</h2>
            <p>
                wrap разрешает перенос при ограничении ширины. size задаёт одинаковый отступ между
                элементами и строками: в примере 16 px.
            </p>
            <Unstyled>
                <Space
                    direction="horizontal"
                    size={16}
                    wrap
                    className={styles.wrapped}
                    dataTestId="docs-space-wrap"
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <TypographyText key={value} className={styles.item}>
                            {value}
                        </TypographyText>
                    ))}
                </Space>
            </Unstyled>
            <h2>Выравнивание и вложенные раскладки</h2>
            <p>
                align управляет поперечной осью: start, center, end, stretch или baseline. fullWidth
                растягивает контейнер; align="stretch" растягивает элементы вертикального Space по
                ширине.
            </p>
            <Unstyled>
                <Space
                    size={20}
                    fullWidth
                    align="stretch"
                    className={styles.panel}
                    dataTestId="docs-space-full"
                >
                    <TypographyText weight="medium">Настройки</TypographyText>
                    <Space direction="horizontal" align="center" size={12}>
                        <TypographyText className={styles.item}>Первый</TypographyText>
                        <TypographyText className={`${styles.item} ${styles.tall}`}>
                            Второй
                        </TypographyText>
                    </Space>
                    <Space direction="horizontal" size={8}>
                        <Button size={32}>Применить</Button>
                        <Button size={32} view="text">
                            Отмена
                        </Button>
                    </Space>
                </Space>
            </Unstyled>
            <h2>Структура и настройка</h2>
            <p>
                Space рендерит один div и передаёт детей напрямую, включая массивы и Fragment.
                Условные null/false не создают промежутков. Текстовые элементы оформляйте через
                Typography; произвольное содержимое Space не оборачивает. Пустой набор детей не
                создаёт контейнер.
            </p>
            <p>
                ref указывает на div. Нативные атрибуты, обработчики, className и style передаются
                контейнеру; dataTestId задаёт его data-test-id. Направление и выравнивание
                используют CSS-классы. CSS gap работает без отдельного режима совместимости.
            </p>
            <p>
                API направления, размера и переноса основан на{' '}
                <a href="https://github.com/core-ds/core-components/tree/master/packages/space">
                    Space из Core DS
                </a>
                .
            </p>
        </>
    );
}

export function SpaceDocs() {
    return (
        <ComponentDocs
            componentName="Space"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[{ name: 'Space/index.module.css', content: componentStyles }]}
        />
    );
}
