Демо: <https://koslibs.github.io/components/>

## Добавление компонента

Рекомендуемая структура:

```text
src/components/Button/
    index.ts
    button.tsx
    button.module.css
    button.stories.tsx
    button.docs.tsx
    CHANGELOG.md
```

1. Перенесите компонент в `src/components/<Name>`; имя папки — PascalCase, например `Button`.
   Регистр пути важен, в том числе на Linux. Стили храните в CSS Modules.
2. Экспортируйте публичный API из его `index.ts`. Для удобного импорта из корня можно
   также добавить реэкспорт в `src/index.ts`; отдельный импорт компонента его не использует.
3. Общий шаблон в `package.json` → `exports` уже связывает каждый компонент с его файлами:

    ```json
    {
        "./*": {
            "types": "./dist/components/*/index.d.ts",
            "import": "./dist/components/*/index.js"
        }
    }
    ```

4. Добавьте Docs, Playground и `CHANGELOG.md` по [примеру документации](https://github.com/koslibs/components/blob/main/docs/component-changelogs.md).
5. Добавьте тесты поведения. `npm run test:unit` запускает unit-тесты через
   `koslibs-builder lib:test`; `npm test` также проверяет отдельные импорты.
6. Выполните сборку и проверьте реальные пути JS, деклараций и CSS в `dist`.

После публикации предполагается такой импорт:

```tsx
import { Button } from '@koslibs/components/Button';
```

Этот путь ведёт прямо к `dist/components/Button/index.js`, минуя общий `dist/index.js`.
Входной файл компонента должен экспортировать только свой API и импортировать только
нужные ему зависимости; не импортируйте внутри компонента общий barrel библиотеки.
Builder сохраняет отдельные JS-модули и отдельные CSS-файлы для каждого компонента.
Поэтому приложение подключает выбранный компонент, его стили и необходимые зависимости.
Соседние независимые компоненты не входят в его граф импортов.

При установке npm скачивает весь пакет; отдельные импорты ограничивают состав бандла
приложения. React, общие утилиты и другие зависимости используемого компонента
по-прежнему могут входить в бандл.

Тест `tests/component-imports.test.mjs` запускается через Node.js test runner командой
`npm test` (или отдельно `npm run test:imports`) и проверяет схему через builder:
собирает временную библиотеку с настоящим Button и независимым тестовым Spinner,
затем приложение с импортом только `@koslibs/components/Button`.
Проверка подтверждает наличие Button, его внутреннего спиннера загрузки и их CSS
и отсутствие независимого Spinner в production-бандле.
Временная библиотека находится в `.cache` и не публикуется.

Пакет выпускается в ESM. CSS помечен как side effect, чтобы оптимизация потребителя
не удаляла стили. Builder сохраняет структуру модулей; Docs, stories и Markdown
исключены из npm-сборки. Storybook загружает Markdown как текст через `?raw`.
