import {
    ArgTypes,
    Controls,
    Description,
    Primary,
    Unstyled,
} from '@koslibs/builder/storybook/blocks';

import { ComponentDocs } from '../../../docs/component-docs';
import modalVariables from '../../Modal/vars.css?raw';

import { Content, Footer, Header, Sidepanel } from '..';

import changelog from '../CHANGELOG.md?raw';
import contentStyles from '../components/content/index.module.css?raw';
import footerStyles from '../components/footer/index.module.css?raw';
import headerStyles from '../components/header/index.module.css?raw';
import componentStyles from '../index.module.css?raw';
import scrollbarStyles from '../scrollbar.module.css?raw';
import variables from '../vars.css?raw';

import { PanelExample } from './examples';

import styles from './examples.module.css';

const example = `import { useState } from 'react';
import { Sidepanel, Header, Content, Footer } from '@koslibs/components/Sidepanel';
import { Button } from '@koslibs/components/Button';

const [open, setOpen] = useState(false);
const handleClose = () => setOpen(false);

<Button onClick={() => setOpen(true)}>Открыть</Button>
<Sidepanel open={open} onClose={handleClose} aria-label="Настройки профиля">
    <Header title="Настройки профиля" hasCloser={true} />
    <Content>{children}</Content>
    <Footer
        primary={() => <Button onClick={handleSubmit}>Сохранить</Button>}
        secondary={() => <Button view="secondary" onClick={handleClose}>Отмена</Button>}
    />
</Sidepanel>`;

function Documentation() {
    return (
        <>
            <Description />
            <p>
                Реализация следует{' '}
                <a href="https://www.figma.com/design/t0Rt80WSw13rbT7CWvB4Nn/kosti4eg?node-id=2560-21147">
                    документации Sidepanel в Figma
                </a>
                . Ширина — 500 px, на экране уже 500 px — вся ширина. Панель занимает высоту окна,
                без скруглений и дивайдеров. Отступы — 24 px; бекдроп, как у Modal: чёрный 70%, blur
                2 px.
            </p>
            <Primary />
            <div className={styles.scroll}>
                <Controls />
            </div>
            <h2>Использование</h2>
            <pre className={styles.scroll}>
                <code>{example}</code>
            </pre>
            <p>
                open — управляемый проп. onClose только запрашивает закрытие: обновите open на
                false. Сохраняйте Sidepanel в дереве React, пока он закрывается; условный рендер по
                open удалит его сразу и прервёт анимацию. После завершения ухода содержимое
                размонтируется, поэтому неуправляемая форма при следующем открытии начинается
                заново.
            </p>
            <h2>Header</h2>
            <p>
                title необязателен; hasCloser по умолчанию true. Если нет ни заголовка, ни крестика,
                Header не выводится и не занимает места. Заголовок или крестик сохраняют область
                высотой не менее 80 px. Доступное имя панели задаётся через aria-label или
                aria-labelledby.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PanelExample label="С заголовком и крестиком" dataTestId="header-both" />
                    <PanelExample label="Без заголовка" title="" dataTestId="header-closer" />
                    <PanelExample
                        label="Без крестика"
                        hasCloser={false}
                        dataTestId="header-title"
                    />
                    <PanelExample
                        label="Без заголовка и крестика"
                        title=""
                        hasCloser={false}
                        dataTestId="header-empty"
                    />
                </div>
            </Unstyled>
            <h2>Content и прокрутка</h2>
            <p>
                По умолчанию прокручивается Content; Header и Footer остаются видимыми. При
                sticky=false у Footer кнопки находятся в конце содержимого и прокручиваются вместе с
                ним, а Header остаётся видимым. У скроллбара нет стрелок и фона — только тонкий
                скруглённый слайдер. Высота адаптируется к окну, длинные слова переносятся.
                Прокрутка страницы по умолчанию заблокирована до завершения анимации закрытия;
                lockScroll=false отключает блокировку.
            </p>
            <Unstyled>
                <div className={styles.examples}>
                    <PanelExample
                        label="Длинный контент, sticky Footer"
                        longContent
                        dataTestId="long-panel"
                    />
                    <PanelExample
                        label="Длинный контент, Footer в конце"
                        longContent
                        footerSticky={false}
                        dataTestId="long-flow-panel"
                    />
                </div>
            </Unstyled>
            <h2>Footer: только кнопки</h2>
            <p>
                primary — обязательный компонент кнопки, secondary — необязательный. Оба имеют тип
                ComponentType&lt;ButtonProps&gt;: передавайте компоненты, а внешний вид, текст и
                обработчики задавайте внутри них. Footer не назначает view. children у Footer
                отсутствует. В строке secondary находится слева от primary; в column — над ним.
                Компоненты со своим состоянием объявляйте стабильно, чтобы изменение настроек
                раскладки не пересоздавало их.
            </p>
            <p>
                gap принимает 12, 16, 24 или 32; по умолчанию 12. layout по умолчанию space-between:
                кнопки находятся у противоположных краёв, а единственная primary — справа. start,
                end и center выравнивают пару по началу, концу или центру строки. column располагает
                кнопки вертикально во всю ширину. block у кнопок растягивает их поровну в строке.
                sticky по умолчанию true; sticky=false отключает закрепление.
            </p>
            <pre className={styles.scroll}>
                <code>{`function PrimaryButton() {
    return <Button view="accent" size={48} onClick={handleSubmit}>Сохранить</Button>;
}

function SecondaryButton() {
    return <Button view="outlined" size={48} onClick={handleClose}>Отмена</Button>;
}

<Footer primary={PrimaryButton} secondary={SecondaryButton} />

<Footer
    layout="center"
    gap={24}
    primary={PrimaryButton}
    secondary={SecondaryButton}
/>

<Footer
    layout="column"
    primary={PrimaryButton}
    secondary={SecondaryButton}
/>`}</code>
            </pre>
            <pre className={styles.scroll}>
                <code>{`<Footer
    sticky={false}
    primary={PrimaryButton}
    secondary={SecondaryButton}
/>`}</code>
            </pre>
            <Unstyled>
                <div className={styles.examples}>
                    <PanelExample
                        label="Обычные кнопки справа"
                        footerLayout="end"
                        dataTestId="footer-end"
                    />
                    <PanelExample
                        label="Две кнопки на всю ширину в один ряд"
                        footerBlock
                        dataTestId="footer-row"
                    />
                    <PanelExample
                        label="Две кнопки в два ряда"
                        footerLayout="column"
                        dataTestId="footer-column"
                    />
                    <PanelExample label="Кнопки у разных краёв" dataTestId="footer-between" />
                    <PanelExample
                        label="Кнопки слева"
                        footerLayout="start"
                        dataTestId="footer-start"
                    />
                    <PanelExample
                        label="Кнопки по центру, gap 24"
                        footerLayout="center"
                        footerGap={24}
                        dataTestId="footer-center"
                    />
                    <PanelExample
                        label="Только primary"
                        hasSecondary={false}
                        dataTestId="footer-primary"
                    />
                </div>
            </Unstyled>
            <h2>Анимация и закрытие</h2>
            <p>
                Выезд и уход вправо занимают 200 мс, бекдроп плавно появляется и исчезает вместе с
                панелью. Быстрое повторное открытие отменяет закрытие. При prefers-reduced-motion
                движение отключается. Escape, клик на бекдроп и крестик вызывают onClose без
                аргументов. escapeKeyDown=false и backdropClick=false независимо отключают первые
                два способа. Нажатие внутри панели и отпускание на бекдропе не закрывает панель.
            </p>
            <p>
                Нативный dialog удерживает фокус внутри открытой панели. После закрытия фокус
                возвращается на элемент, с которого панель открыли. Вложенные Modal и Sidepanel
                разделяют блокировку прокрутки.
            </p>
            <h2>Форма и выпадающие списки</h2>
            <p>
                Для Select или Popover внутри панели передайте dialog из ref в их
                getPortalContainer, как в Modal. Так выпадающий список останется в верхнем слое
                панели.
            </p>
            <pre className={styles.scroll}>
                <code>{`const panelRef = useRef<HTMLDialogElement>(null);

<Sidepanel ref={panelRef} open={open} onClose={handleClose} aria-label="Форма">
    <Header title="Форма" />
    <Content>
        <Select options={options} getPortalContainer={() => panelRef.current} />
    </Content>
    <Footer primary={() => <Button onClick={handleClose}>Готово</Button>} />
</Sidepanel>`}</code>
            </pre>
            <Unstyled>
                <PanelExample
                    label="Форма с Input и Select"
                    title="Настройки профиля"
                    form
                    dataTestId="form-panel"
                />
            </Unstyled>
            <h2>Настройка</h2>
            <p>
                ref указывает на HTMLDialogElement; className и style относятся к нему. Части
                поддерживают собственные className, style, ref и dataTestId. getPortalContainer
                задаёт контейнер портала. Параметры цветов, отступов и длительности приведены во
                вкладке «Разработчику».
            </p>
        </>
    );
}

export function SidepanelDocs() {
    return (
        <ComponentDocs
            componentName="Sidepanel"
            importNames={['Sidepanel', 'Header', 'Content', 'Footer']}
            documentation={<Documentation />}
            props={
                <>
                    <h3>Sidepanel</h3>
                    <ArgTypes of={Sidepanel} />
                    <h3>Header</h3>
                    <ArgTypes of={Header} />
                    <h3>Content</h3>
                    <ArgTypes of={Content} />
                    <h3>Footer</h3>
                    <ArgTypes of={Footer} />
                </>
            }
            changelog={changelog}
            cssSources={[
                { name: 'Sidepanel/index.module.css', content: componentStyles },
                { name: 'Sidepanel/vars.css', content: variables },
                { name: 'Sidepanel/scrollbar.module.css', content: scrollbarStyles },
                { name: 'Modal/vars.css', content: modalVariables },
                { name: 'Sidepanel/Header', content: headerStyles },
                { name: 'Sidepanel/Content', content: contentStyles },
                { name: 'Sidepanel/Footer', content: footerStyles },
            ]}
        />
    );
}
