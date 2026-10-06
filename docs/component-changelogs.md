# Истории компонентов

У каждого компонента есть `CHANGELOG.md` рядом с реализацией. Этот Markdown-файл —
единственный источник его истории: его можно прочитать в GitHub и импортировать
в Storybook Docs без копирования текста.

## Как вести историю

В начале файла используйте `# Button` (имя компонента), затем разделы версий от новых
к старым и группы «Добавлено», «Изменено», «Исправлено», «Удалено». Пишите о поведении,
API и миграции для пользователя компонента.

У библиотеки одна общая версия. Заголовок версии в истории компонента означает
«компонент изменился в этой версии библиотеки», а не отдельную версию компонента.
Добавляйте раздел только для релиза, в котором изменился этот компонент.
Пропуски версий допустимы: не добавляйте пустые разделы или записи «Без изменений»
и не переименовывайте последний раздел вслед за повышением версии библиотеки.

Распределяйте записи так:

- В `src/components/<Name>/CHANGELOG.md` описывайте изменения API, поведения,
  стилей, примеров и документации конкретного компонента.
- Если изменение зависимости влияет на поведение или оформление компонента,
  обновите и его историю. Например, изменение Spinner, которое меняет состояние
  загрузки Button, затрагивает оба компонента.
- Изменения сборки, зависимостей и инфраструктуры, а также общих элементов
  Storybook описывайте в общем `CHANGELOG.md` через changeset. Не дублируйте
  общий фикс вкладок Docs в историях всех компонентов.

Например, если в релизе `1.2.0` изменён только Typography и исправлены общие вкладки Docs:

| История | Что добавляем |
| --- | --- |
| Общий `CHANGELOG.md` | Раздел `1.2.0` с изменениями Typography и исправлением вкладок |
| Typography | Раздел `1.2.0` с изменениями Typography |
| Button и Spinner | Сохраняем прежние записи, раздел `1.2.0` не добавляем |

Используйте один changeset на PR и обновляйте его при дополнительных правках.
Changesets создаёт общую историю релиза; истории компонентов ведутся вручную.

Во время разработки изменения можно собирать в `## Unreleased`. Перед релизом
замените этот заголовок на ожидаемую версию пакета и дату. Changesets вычисляет версию
по самому сильному типу среди всех ожидающих изменений: major → minor → patch.
Общий чейнджлог пакета и SemVer ведёт Changesets.
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
и не описывают реализованный компонент. В примере после `0.1.0` идёт `0.3.0`:
в версии библиотеки `0.2.0` компонент не менялся, поэтому отдельного раздела нет.
