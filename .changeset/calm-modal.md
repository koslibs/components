---
'@koslibs/components': minor
---

Перенесён Modal из GullEye core-components с Header, Content, Footer и Controls.
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
