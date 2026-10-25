---
'@koslibs/components': patch
---

Исправлен Sidepanel Footer: primary и secondary принимают готовые JSX-элементы кнопок вместо типов компонентов. Пропсы, обработчики и ref кнопок задаются снаружи и сохраняются. primary остаётся обязательным, secondary — необязательным; gap, layout и sticky работают как прежде. Обновлены типы, Storybook и тесты.
