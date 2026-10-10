# @koslibs/components

## 1.4.0

### Minor Changes

- [#5](https://github.com/koslibs/components/pull/5) [`68d3460`](https://github.com/koslibs/components/commit/68d34608d599582acf4115d31f64fb0168213edb) Thanks [@holypower777](https://github.com/holypower777)! - Перенесён Modal из GullEye core-components с Header, Content, Footer и Controls.
  Добавлены прямой импорт `@koslibs/components/Modal`, размеры 480/600/720/960/fullscreen,
  управляемое закрытие, блокировка прокрутки и поддержка вложенных окон.
  Docs содержат вкладки документации, Props, CSS-переменных и истории изменений,
  а также примеры длинного контента и Popover внутри нативного dialog.
  Блокировка прокрутки учитывает `scrollbar-gutter: stable`, чтобы контент страницы
  не смещался из-за двойной компенсации места под скроллбар.

    Modal синхронизирован с документацией Figma: типографика Header 20 px semibold /
    14 px regular, крестик 18 px в области 48 × 32 px, Header без нижнего и Footer
    без верхнего отступа. В строковых Controls две Button с block=true делят ширину
    одной строки поровну с учётом gap; column растягивает кнопки по ширине вертикально.

    Убран `Header.onClose`: крестик вызывает общий `Modal.onClose` через внутренний
    React Context. Вложенный Header использует обработчик ближайшего Modal;
    обработчик больше не нужно передавать отдельно в заголовок.

    Header, Content, Footer и Controls наследуют `Modal.dataTestId` с суффиксами
    `-header`, `-content`, `-footer`, `-controls`. Явный dataTestId части имеет приоритет;
    вложенные окна используют только свой базовый идентификатор.

    Добавлен отдельный Portal с `getPortalContainer`, `immediateMount`, ref на контейнер
    и немедленным монтированием по умолчанию (`immediateMount=true`). Значение false
    позволяет дождаться DOM-контейнера из ref. Modal и Popover используют
    общий Portal; прямой импорт доступен через `@koslibs/components/Portal`.

## 1.3.0

### Minor Changes

- [#4](https://github.com/koslibs/components/pull/4) [`b37f3b0`](https://github.com/koslibs/components/commit/b37f3b008be8ffea80908557c13ea77d6d55c792) Thanks [@holypower777](https://github.com/holypower777)! - Перенесён Collapse из core-components GullEye с отдельным импортом
  `@koslibs/components/Collapse`, внутренним и внешним управлением, сохранением
  содержимого, анимацией и поддержкой reduced motion. Проп `colors` убран:
  оформление кнопки настраивается через CSS-переменные. Добавлены документация
  с тремя вкладками, Playground и история компонента. Стрелка подключается
  отдельным импортом из `@koslibs/icons`.

    Подписи `collapsedLabel` и `expandedLabel` не имеют дефолтных значений.
    Добавлены `showRightChevron` (по умолчанию `true`) и `showLeftChevron`
    (по умолчанию `false`): можно независимо показывать шевроны или скрыть оба.
    Левый шеврон смотрит вправо в закрытом состоянии и вниз в раскрытом,
    правый сохраняет поворот вниз → вверх.

    Комментарии публичных пропсов приведены к единому многострочному формату JSDoc
    с отдельной строкой для `@default`.

## 1.2.0

### Minor Changes

- [#3](https://github.com/koslibs/components/pull/3) [`a618f52`](https://github.com/koslibs/components/commit/a618f526010adc6203a708e73fac3906b555ac78) Thanks [@holypower777](https://github.com/holypower777)! - Перенесён Popover из GullEye с отдельным импортом `@koslibs/components/Popover`,
  стилями, Docs и Playground. Сохранены управляемая видимость, позиционирование,
  ограничение размеров и способы закрытия. Портал и позиционирование адаптированы
  для самостоятельного использования в React 18 и 19.

    Popover управляет позицией и размерами и рендерит children напрямую. Оформление
    и прокрутка содержимого задаются вызывающим компонентом; colors и contentClassName
    не входят в API. Прежнее оформление Storybook-примеров сохранено в их содержимом.
    Тень задаёт сам Popover через CSS-переменную --popover-shadow.
    Offset по умолчанию равен `[0, 0]`, без смещения и зазора между якорем и содержимым.

    Документация каждого компонента собрана в его папке docs: stories, страницы Docs
    и стили примеров. Папки документации исключены из JS-сборки и деклараций npm-пакета.

## 1.1.0

### Minor Changes

- [#2](https://github.com/koslibs/components/pull/2) [`b09aeff`](https://github.com/koslibs/components/commit/b09aeffe06d9267aad1f689deb91a19412ff8448) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен публичный Typography из GullEye: Text и Title, типы, CSS Modules,
  Docs и Playground. Импорт из `@koslibs/components/Typography` подключает
  только Typography и его стили.

    Исправлены отступы содержимого вкладок Docs и сдвиг страницы при появлении
    или исчезновении полосы прокрутки.

    Закреплены правила историй компонентов: запись добавляется только для изменённого
    компонента; общие изменения инфраструктуры и Storybook описываются в истории пакета.

    Добавлена общая тема с `--font-primary: 'Inter', sans-serif` и локальными
    WOFF2-файлами Inter. Typography и подпись Button подключают её автоматически;
    приложение может переопределить семейство шрифта через CSS.

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
