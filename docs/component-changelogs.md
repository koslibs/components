# Истории компонентов

У каждого компонента есть `CHANGELOG.md` рядом с реализацией. Этот Markdown-файл —
единственный источник его истории: его можно прочитать в GitHub и импортировать
в Storybook Docs без копирования текста.

## Как вести историю

В начале файла используйте `# Button` (имя компонента), затем разделы версий от новых
к старым и группы «Добавлено», «Изменено», «Исправлено», «Удалено». Пишите о поведении,
API и миграции для пользователя компонента. Номера версий совпадают с версией пакета.
Не добавляйте запись компоненту, который в релизе не изменялся.

Во время разработки изменения можно собирать в `## Unreleased`. Перед релизом
замените этот заголовок на ожидаемую версию пакета и дату. Changesets вычисляет версию
по самому сильному типу среди всех ожидающих изменений: major → minor → patch.
Истории компонентов ведутся вручную; общий чейнджлог пакета и SemVer ведёт Changesets.
Ветка релиза не должна оставлять описания выпущенных изменений в Unreleased.

## Как показать историю в Docs

Для каждого компонента используйте общую оболочку `ComponentDocs` из
`src/docs/component-docs.tsx`. Она создаёт вкладки «Документация», «Разработчику»
и «Обновления» с доступным переключением мышью и клавиатурой.
Файлы размещаются в `src/components/Button`: `button.docs.tsx`, `button.stories.tsx`
и `CHANGELOG.md`. Публичный импорт компонента — `@koslibs/components/Button`.

```tsx
// button.docs.tsx
import { Description, Primary } from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../docs/component-docs';
import changelog from './CHANGELOG.md?raw';
import colors from './colors.module.css?raw';
import styles from './index.module.css?raw';
import variables from './vars.css?raw';

export function ButtonDocs() {
    return (
        <ComponentDocs
            componentName="Button"
            documentation={
                <>
                    <Description />
                    <Primary />
                    {/* Варианты и дополнительные примеры показывайте здесь. */}
                </>
            }
            changelog={changelog}
            cssSources={[
                { name: 'Button/colors.module.css', content: colors },
                { name: 'Button/index.module.css', content: styles },
                { name: 'Button/vars.css', content: variables },
            ]}
        />
    );
}
```

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from '@koslibs/builder/storybook';

import { Button } from './button';
import { ButtonDocs } from './button.docs';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: { docs: { page: ButtonDocs } },
    args: { children: 'Продолжить' },
} satisfies Meta<typeof Button>;

export default meta;

export const Playground: StoryObj<typeof meta> = {};
```

Вкладка «Разработчику» автоматически показывает импорт с регистром `componentName`,
таблицу Props из Storybook и CSS-переменные, которые используются в `cssSources`.
Передавайте все CSS-файлы компонента: стили и определения переменных. Если компонент
использует другой компонент (как Button использует Spinner), передавайте и его CSS,
чтобы таблица показывала все настройки. Значения по умолчанию берутся из определений
переменных и fallback-значений в `var()`.

История отображается во вкладке «Обновления» внутри Docs, поэтому дополнительных
stories и пунктов навигации для неё не требуется. Блоки Docs и типы stories импортируются из builder,
который управляет версией и подключением addon-docs.

## Пример Markdown

Ниже показан файл `docs/examples/CHANGELOG.md`. Все записи демонстрационные
и не описывают реализованный компонент.
