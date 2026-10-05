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
5. Добавьте тесты поведения. Unit-тесты можно запускать через `koslibs-builder lib:test`;
   в каркасе unit-suite отсутствует, потому что runtime-компонентов пока нет.
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
собирает временную библиотеку с Button
и Spinner, затем приложение с импортом только `@koslibs/components/Button`.
Проверка подтверждает наличие Button и его CSS и отсутствие Spinner и его CSS
в production-бандле. Временные компоненты находятся в `.cache` и не публикуются.

Пакет выпускается в ESM. CSS помечен как side effect, чтобы оптимизация потребителя
не удаляла стили. Builder сохраняет структуру модулей; Docs, stories и Markdown
исключены из npm-сборки. Storybook загружает Markdown как текст через `?raw`.
