# Chips

## 1.17.0

- Добавлен Chips с items формата `{ value, label, disabled? }` и режимом multiselect. Заголовок группы размещается снаружи в приложении.
- В одиночном режиме повторное нажатие сохраняет выбор; в multiselect пункты переключаются независимо. All является обычным значением без специального сброса.
- Поддерживаются value/defaultValue, onChange(event, { value }), disabled для группы и пунктов, ref, form и reset неуправляемой формы. Значения доступны через value/onChange.
- Реализованы default/hover/active/disabled для выбранных и невыбранных пунктов из Figma: 32px, Inter Regular 14/20, отступы 6/12px, pill, gap 8px.
- Фон и цвет текста плавно меняются за 100ms с ease-in-out, как у Button. При prefers-reduced-motion переходы отключены.
- Подписи сохраняются полностью, пункты переносятся на следующую строку. Добавлены CSS-переменные, Storybook, тесты и root/subpath-экспорты.
