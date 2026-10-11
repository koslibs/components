# Typography

## 1.7.0

- В TypographyText добавлен размер 18 px для текста больших кнопок.
- Для всех размеров Text и Title высота строки задана внутри Typography как normal
  по документации Figma Auto. Удалена переменная --typography-line-height и её
  переопределения в компонентах библиотеки.

## 1.1.0

- Перенесён Typography из core-components GullEye: Text и Title с независимым
  выбором размера и HTML-тега, четырьмя начертаниями и шестью цветами.
- Сохранены caps, monospaceNumbers, ограничение до 1–3 строк, ref, стандартные
  HTML-атрибуты и dataTestId.
- Доступны `Typography.Text`, `Typography.Title`, именованные компоненты и типы
  через `@koslibs/components/Typography`.
- CSS Modules подключаются автоматически. Для отступов и семейства шрифта
  добавлены fallback-значения; глобальные стили GullEye не требуются.
- Inter включён в библиотеку как локальные WOFF2-файлы и подключается вместе
  со стилями. Общая переменная `--font-primary` задаёт `'Inter', sans-serif`
  по умолчанию и переопределяется в CSS приложения или контейнера.
- Перенесены Docs и Playground. Вкладка «Разработчику» содержит импорт, Props
  обоих компонентов и CSS-переменные.
