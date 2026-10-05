import { Controls, Description, Primary } from '@koslibs/builder/storybook/blocks';
import type { CSSProperties, ReactNode } from 'react';

import { ComponentDocs } from '../../docs/component-docs';
import spinnerColors from '../Spinner/colors.module.css?raw';
import spinnerStyles from '../Spinner/index.module.css?raw';
import spinnerPresets from '../Spinner/preset.module.css?raw';
import spinnerVars from '../Spinner/vars.css?raw';

import changelog from './CHANGELOG.md?raw';
import colors from './colors.module.css?raw';
import buttonStyles from './index.module.css?raw';
import variables from './vars.css?raw';

import { Button } from '.';

const sizes = [32, 40, 48, 56, 64, 72] as const;
const views = ['primary', 'secondary', 'accent', 'outlined', 'transparent', 'text'] as const;
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 };
const addon = <span aria-hidden="true">★</span>;

function Example({
    name,
    title,
    description,
    children,
}: {
    name: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section id={name} style={{ marginTop: 32 }}>
            <h2>{title}</h2>
            <p style={{ margin: '12px 0 20px' }}>{description}</p>
            <div style={{ ...row, width: 'fit-content', maxWidth: '100%', padding: 16 }}>
                {children}
            </div>
        </section>
    );
}

function Documentation() {
    return (
        <>
            <Description />
            <h2>Playground</h2>
            <p>
                Настройте кнопку в Controls: оформление, размер, форму, состояние и содержимое.
                Нажатия отображаются в Actions на странице Playground.
            </p>
            <Primary />
            <h2>Параметры</h2>
            <p>
                Помимо параметров ниже, кнопка принимает стандартные HTML-атрибуты и ref на
                HTMLButtonElement. Для кнопки с одной иконкой задайте aria-label.
            </p>
            <Controls />
            <Example
                name="views"
                title="Оформление"
                description="primary — основное действие, secondary — дополнительное, accent — акцентное. outlined использует контур, transparent — прозрачный фон, text — текст без горизонтальных отступов. Наведите курсор или нажмите кнопку, чтобы посмотреть состояния."
            >
                {views.map((view) => (
                    <Button key={view} view={view}>
                        {view}
                    </Button>
                ))}
            </Example>
            <Example
                name="sizes"
                title="Размеры"
                description="Размеры 32, 40, 48, 56, 64 и 72 задают минимальную высоту и внутренние отступы. Размер по умолчанию — 40. У text компактная высота зависит от текста; размеры 48 и 56 сохраняют минимум 24 px."
            >
                {sizes.map((size) => (
                    <Button key={size} size={size}>
                        {size} px
                    </Button>
                ))}
            </Example>
            <Example
                name="shapes"
                title="Форма"
                description="rectangular задаёт скругление углов 8 px. rounded превращает кнопку в капсулу. Форма выбирается независимо от размера и оформления."
            >
                <Button>rectangular</Button>
                <Button shape="rounded">rounded</Button>
            </Example>
            <Example
                name="states"
                title="Недоступность и загрузка"
                description="disabled блокирует нажатие и меняет оформление. loading показывает спиннер, скрывает текст и аддоны без изменения ширины и тоже блокирует нажатие. Спиннер виден не менее 500 мс, даже если действие завершилось быстрее; aria-busy сообщает о загрузке."
            >
                <div style={{ display: 'grid', gap: 24 }}>
                    <div style={row}>
                        {views.map((view) => (
                            <Button key={view} view={view} disabled>
                                {view}
                            </Button>
                        ))}
                    </div>
                    <div style={row}>
                        {views.map((view) => (
                            <Button key={view} view={view} loading>
                                {view}
                            </Button>
                        ))}
                    </div>
                </div>
            </Example>
            <Example
                name="addons"
                title="Аддоны"
                description="leftAddon и rightAddon добавляют иконки или другие элементы по сторонам текста. Отступы подстраиваются под размер кнопки. Декоративные иконки следует скрывать от скринридера через aria-hidden."
            >
                <Button leftAddon={addon}>Слева</Button>
                <Button rightAddon={addon}>Справа</Button>
                <Button leftAddon={addon} rightAddon={addon}>
                    С двух сторон
                </Button>
            </Example>
            <Example
                name="with-hint"
                title="Подпись"
                description="hint выводит дополнительную строку под основным текстом только в размерах 56, 64 и 72. В размерах 32, 40 и 48 подпись не отображается."
            >
                {views.map((view) => (
                    <Button key={view} view={view} size={56} hint="Выберите файлы раздач">
                        {view}
                    </Button>
                ))}
            </Example>
            <Example
                name="block"
                title="Ширина"
                description="Обычно ширина определяется содержимым и минимальной шириной выбранного размера. block растягивает кнопку на всю ширину родительского контейнера."
            >
                <div style={{ width: 420, maxWidth: '100%' }}>
                    <Button block>Импортировать</Button>
                </div>
            </Example>
        </>
    );
}

export function ButtonDocs() {
    return (
        <ComponentDocs
            componentName="Button"
            documentation={<Documentation />}
            changelog={changelog}
            cssSources={[
                { name: 'Button/colors.module.css', content: colors },
                { name: 'Button/index.module.css', content: buttonStyles },
                { name: 'Button/vars.css', content: variables },
                { name: 'Spinner/colors.module.css', content: spinnerColors },
                { name: 'Spinner/index.module.css', content: spinnerStyles },
                { name: 'Spinner/preset.module.css', content: spinnerPresets },
                { name: 'Spinner/vars.css', content: spinnerVars },
            ]}
        />
    );
}
