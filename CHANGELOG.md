# @koslibs/components

## 1.10.0

### Minor Changes

- [#11](https://github.com/koslibs/components/pull/11) [`85e4c4b`](https://github.com/koslibs/components/commit/85e4c4b523847d339a773b63fcf7916098f28327) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен Space для горизонтальной и вертикальной раскладки: обязательные size и children, единый положительный отступ из --size-\*, align, wrap и fullWidth. Компонент использует CSS gap, сохраняет прямые дочерние элементы и доступен через @koslibs/components/Space. Добавлены Storybook Docs и Playground.

## 1.9.0

### Minor Changes

- [#10](https://github.com/koslibs/components/pull/10) [`01aa734`](https://github.com/koslibs/components/commit/01aa734718eb2b649cc8ec361368b825fc8432d6) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен Select по документации Figma: одиночный и множественный выбор, локальный поиск с внутренним состоянием запроса и сообщением при отсутствии совпадений, список на Popover, форма и примеры Storybook. Выбранные значения отображаются через запятую с однострочным многоточием. Выбранные строки отличаются от поиска и hover; внутренний label плавно перемещается по аналогии с Input. Очистка использует тонкий крестик 14×14 px с постоянным label «close».

## 1.8.0

### Minor Changes

- [#9](https://github.com/koslibs/components/pull/9) [`03ecceb`](https://github.com/koslibs/components/commit/03ecceb7d7f6831f6d4e6e85b80373aeb6ffd743) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен Status: размеры 20/24/32/40, формы rectangular/rounded, восемь цветов,
  декоративные аддоны, подпись message, uppercase (по умолчанию false),
  сокращение подписи при ограничении ширины и Storybook Docs/Playground.

## 1.7.0

### Minor Changes

- [#8](https://github.com/koslibs/components/pull/8) [`5b8e35c`](https://github.com/koslibs/components/commit/5b8e35cdfc7d0586b93d986661ff0ddcafa97452) Thanks [@holypower777](https://github.com/holypower777)! - Добавлены Tabs и дочерний Tab по документации Figma: selectedId/defaultSelectedId,
  onChange(event, { selectedId }), размеры 40/48, счётчики, controlled/uncontrolled,
  плавное перемещение активного индикатора. Ряд вкладок должен помещаться в доступную
  ширину; горизонтальная прокрутка и перенос не поддерживаются. Содержимое выбранной вкладки
  отображается отдельно в приложении.
  В документации показаны props обоих компонентов: Tabs и Tab.
  Tab отображает кнопку вкладки; Tabs управляет общим состоянием через внутренний контекст.

    Текст Tabs, Button и Collapse использует общий TypographyText. Добавлен размер
    18 px для TypographyText; сохранены размеры текста. Все размеры Typography используют
    line-height: normal по документации Figma Auto. Удалены локальные переопределения
    высоты строки в Tabs, Button, Collapse, а также подписях, подсказках и счётчиках
    Input и Textarea.

    Добавлен импорт @koslibs/components/variables.css со шкалами --size-_ и
    --border-radius-_. Общая тема включает переменные автоматически; отступы и
    скругления компонентов используют эти шкалы. Использование и переопределение
    задокументированы в README и Storybook.

## 1.6.0

### Minor Changes

- [#7](https://github.com/koslibs/components/pull/7) [`4e937d7`](https://github.com/koslibs/components/commit/4e937d7e18b3c7d592e3b8cb161817d482bf2c55) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен Textarea по документации Figma: primary/secondary, inner/outer label,
  Typography, hint/error, счётчик длины, очистка, autosize и вертикальный resize.
  Внутренний скроллбар оформлен без стрелок и фона, с тонким закруглённым ползунком.

## 1.5.0

### Minor Changes

- [#6](https://github.com/koslibs/components/pull/6) [`360f774`](https://github.com/koslibs/components/commit/360f7746facda771d84165a16caeb6fe56abcc4a) Thanks [@holypower777](https://github.com/holypower777)! - Добавлен Input по дизайну Figma с view primary/secondary, размерами 40–72,
  label внутри/снаружи, подсказками и ошибками, аддонами и очисткой.
  Размер по умолчанию — 40.
  Добавлен showValueLength для счётчика текущей длины и maxLength: внутри для inner,
  снаружи рядом с label для outer. Поддержаны ввод, очистка и сброс формы.
  Шрифт счётчика — 11 px; счётчик и label выровнены по базовой линии текста.
  Сообщение ошибки заменяет hint; без hint отображается только красная рамка.
  Поддержаны controlled/uncontrolled ввод, нативный ref и HTML-атрибуты,
  disabled/readOnly и сброс формы. Добавлены Storybook и отдельный импорт.
  Внутренний label поднимается при фокусе или заполнении поля; placeholder появляется
  при фокусе, а после blur пустого поля label возвращается в центр.
  Клики по отступам и декоративным аддонам фокусируют input, в том числе внутри
  контейнеров с tabIndex; интерактивные аддоны сохраняют собственный фокус.
  Формирование dataTestId частей Input и Modal унифицировано через общий внутренний
  хук useDataTestId; существующие идентификаторы и наследование в Modal сохранены.
  Убраны служебные ID сообщений и счётчика, автоматические aria-describedby и aria-invalid.
  Обновлена зависимость @koslibs/icons до 1.2.0. В примерах Input используется
  SearchIcon вместо локального SVG.

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
