# @koslibs/components

## 1.0.0

### Major Changes

- [#1](https://github.com/koslibs/components/pull/1) [`8954b64`](https://github.com/koslibs/components/commit/8954b64becb19165000479731114463317438bcd) Thanks [@holypower777](https://github.com/holypower777)! - Первый стабильный выпуск 1.0.0 с Button и Spinner, перенесёнными из core-components GullEye.

    Компонент доступен через `import { Button } from '@koslibs/components/Button'` вместе с типом ButtonProps. Поддерживает шесть вариантов оформления, размеры 32–72, формы rectangular и rounded, левый и правый аддоны, подпись, полную ширину, disabled и loading. Сохранены ref, стандартные HTML-атрибуты и минимальное время отображения загрузки 500 мс.

    Spinner доступен отдельно через `import { Spinner } from '@koslibs/components/Spinner'` вместе с типом SpinnerProps. Поддерживает размеры 16, 24 и 48, управление видимостью, настройку цвета через style.color, className, id и dataTestId. Button использует этот же публичный Spinner для отображения загрузки.

    CSS Modules подключаются вместе с используемыми компонентами. Добавлены значения по умолчанию для CSS-переменных размеров, скруглений и шрифтов, чтобы компоненты работали без глобальных стилей GullEye. Отдельный импорт Spinner не включает Button и его стили. Для обоих компонентов в Storybook доступны Docs и Playground.

    Docs каждого компонента разделены на вкладки «Документация», «Разработчику» и «Обновления». Во вкладке разработчика доступны публичный импорт, Props и CSS-переменные из исходных стилей; обновления отображают CHANGELOG конкретного компонента.

    Проверка отдельных импортов разделена на общий fixture и декларативные сценарии: JS и типы всех публичных компонентов проверяются автоматически, библиотека собирается один раз, а выбранные production-потребители — одним запуском builder в независимых environments с общей установленной копией пакета и отдельными выходными папками.

## 0.1.0

### Minor Changes

- [`ee39a5b`](https://github.com/koslibs/components/commit/ee39a5bb32f94a3a76e4367ec6b14d9cbe4d41b2) Thanks [@holypower777](https://github.com/holypower777)! - Подготовлен каркас @koslibs/components для React 18/19 и TypeScript: сборка ESM, деклараций и CSS Modules через @koslibs/builder@1.0.0, общие настройки и release-инструменты @koslibs/configs@1.0.0, Storybook и workflow деплоя на GitHub Pages.

    Настроены отдельные импорты вида @koslibs/components/Button. Тест production-сборки проверяет, что в бандл потребителя входят выбранный компонент и его CSS, а независимые соседние компоненты исключаются. Добавлены CI, Changesets и документация по переносу компонентов и ведению их историй изменений. Runtime-компоненты будут перенесены отдельно.

Опубликованных версий пока нет. После первого релиза Changesets добавит сюда историю пакета.
