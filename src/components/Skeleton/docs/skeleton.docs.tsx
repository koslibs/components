import { Controls, Description, Primary, Unstyled } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';
import { Space } from '../../Space';

import { Skeleton } from '..';

import changelog from '../CHANGELOG.md?raw';
import componentStyles from '../index.module.css?raw';
import variables from '../vars.css?raw';

import styles from './examples.module.css';

const compositionExample = `import { Skeleton } from '@koslibs/components/Skeleton';
import { Space } from '@koslibs/components/Space';

<Space size={24} fullWidth align="stretch" className={styles.card}>
    <Skeleton className={styles.media} />
    <Space size={12} fullWidth align="stretch">
        <Skeleton className={styles.title} />
        <Skeleton className={styles.line} />
        <Skeleton className={styles.lastLine} />
    </Space>
</Space>`;

const customExample = `.placeholder {
    --skeleton-background-color: #c4b9f6;
    width: 60%;
    height: 48px;
    border-radius: 12px;
}`;

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Skeleton рисует один пустой div. По умолчанию ширина 100%, радиус 8 px, фон #e0dbce.
                Высоту задайте через className или style. Запросы и переключение состояний загрузки
                остаются в приложении.
            </p>
            <Primary />
            <div className={styles.scroll}>
                <Controls />
            </div>
            <h2>Композиция</h2>
            <p>
                Пример из Figma состоит из четырёх Skeleton и двух Space. Отступы, фон карточки и
                размеры областей задаются в примере; они не входят в API Skeleton. Ширины строк
                пропорциональны контейнеру, а высоты сохраняются при сужении экрана.
            </p>
            <Unstyled>
                <Space
                    size={24}
                    fullWidth
                    align="stretch"
                    className={styles.card}
                    dataTestId="docs-skeleton-card"
                >
                    <Skeleton className={styles.media} />
                    <Space size={12} fullWidth align="stretch">
                        <Skeleton className={styles.title} />
                        <Skeleton className={styles.line} />
                        <Skeleton className={styles.lastLine} />
                    </Space>
                </Space>
            </Unstyled>
            <pre className={styles.scroll}>
                <code>{compositionExample}</code>
            </pre>
            <h2>Анимация</h2>
            <p>
                animated=true включает бесконечный цикл opacity 100% → 45% → 100% за 1,6 с с
                ease-in-out. animated=false отключает пульсацию; блок остаётся непрозрачным.
                Геометрия во время анимации не меняется.
            </p>
            <Unstyled>
                <Space size={16} fullWidth align="stretch" className={styles.examples}>
                    <Skeleton style={{ height: 48 }} dataTestId="docs-skeleton-animated" />
                    <Skeleton
                        animated={false}
                        style={{ height: 48 }}
                        dataTestId="docs-skeleton-static"
                    />
                </Space>
            </Unstyled>
            <h2>Размеры, скругление и фон</h2>
            <p>
                width, height и border-radius задаются через CSS или style. Цвет поверхности
                переопределяется переменной --skeleton-background-color на компоненте или его
                предке. Фон окружающей области задаёт приложение.
            </p>
            <Unstyled>
                <Space size={16} fullWidth align="stretch" className={styles.examples}>
                    <Skeleton className={styles.custom} dataTestId="docs-skeleton-custom" />
                    <Skeleton
                        style={{ width: 64, height: 64, borderRadius: '50%' }}
                        dataTestId="docs-skeleton-round"
                    />
                    <div className={styles.dark}>
                        <Skeleton style={{ height: 48 }} dataTestId="docs-skeleton-dark" />
                    </div>
                </Space>
            </Unstyled>
            <pre className={styles.scroll}>
                <code>{customExample}</code>
            </pre>
            <h2>Состояние запроса</h2>
            <p>
                После успешного ответа приложение заменяет композицию готовым контентом. Ошибка и
                пустой результат отображаются отдельными состояниями. Размеры заполнителей должны
                соответствовать будущему контенту.
            </p>
        </>
    );
}

export function SkeletonDocs() {
    return (
        <ComponentDocs
            componentName="Skeleton"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Skeleton/index.module.css', content: componentStyles },
                { name: 'Skeleton/vars.css', content: variables },
            ]}
        />
    );
}
