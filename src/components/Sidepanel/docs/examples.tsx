import { useRef, useState } from 'react';

import { useDataTestId } from '../../../hooks/use-data-test-id';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { TypographyText } from '../../Typography';

import { Content, Footer, Header, Sidepanel, type FooterProps, type SidepanelProps } from '..';

import styles from './examples.module.css';

export type DemoProps = SidepanelProps & {
    title?: string;
    hasCloser?: boolean;
    footerLayout?: FooterProps['layout'];
    footerGap?: FooterProps['gap'];
    footerBlock?: boolean;
    hasSecondary?: boolean;
    footerSticky?: boolean;
    longContent?: boolean;
    form?: boolean;
};

export function DemoPanel({
    title = 'Заголовок панели',
    hasCloser = true,
    footerLayout = 'space-between',
    footerGap = 12,
    footerBlock = false,
    hasSecondary = true,
    footerSticky = true,
    longContent = false,
    form = false,
    onClose,
    ...props
}: DemoProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const getDataTestId = useDataTestId(props.dataTestId);
    return (
        <Sidepanel {...props} ref={ref} onClose={onClose} aria-label={title || 'Боковая панель'}>
            <Header title={title} hasCloser={hasCloser} />
            <Content>
                <TypographyText size={16} weight="bold">
                    Content
                </TypographyText>
                <TypographyText tag="p" size={16} className={styles.paragraph}>
                    Основная область панели. Здесь размещаются текст, формы и другие элементы
                    интерфейса.
                </TypographyText>
                <TypographyText tag="p" size={16} color="secondary" className={styles.paragraph}>
                    Содержимое определяется задачей приложения.
                </TypographyText>
                {form && (
                    <>
                        <Input
                            label="Название профиля"
                            defaultValue="Александр"
                            block
                            dataTestId={getDataTestId('name')}
                        />
                        <Select
                            label="Формат игры"
                            options={[
                                { id: 'cash', label: 'Кэш' },
                                { id: 'tournaments', label: 'Турниры' },
                            ]}
                            searchable
                            block
                            getPortalContainer={() => ref.current}
                            dataTestId={getDataTestId('select')}
                        />
                    </>
                )}
                {longContent &&
                    Array.from({ length: 35 }, (_, index) => (
                        <TypographyText tag="p" size={16} className={styles.paragraph} key={index}>
                            Раздел {index + 1}. Header остаётся на месте;{' '}
                            {footerSticky
                                ? 'Footer виден при прокрутке.'
                                : 'Footer находится в конце содержимого.'}
                        </TypographyText>
                    ))}
            </Content>
            <Footer
                sticky={footerSticky}
                layout={footerLayout}
                gap={footerGap}
                primary={
                    <Button
                        block={footerBlock}
                        onClick={onClose}
                        dataTestId={getDataTestId('save')}
                    >
                        Сохранить
                    </Button>
                }
                secondary={
                    hasSecondary ? (
                        <Button
                            view="secondary"
                            block={footerBlock}
                            onClick={onClose}
                            dataTestId={getDataTestId('cancel')}
                        >
                            Отмена
                        </Button>
                    ) : undefined
                }
            />
        </Sidepanel>
    );
}

export function PanelExample({ label, ...props }: Omit<DemoProps, 'open'> & { label: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button view="secondary" onClick={() => setOpen(true)}>
                {label}
            </Button>
            <DemoPanel {...props} open={open} onClose={() => setOpen(false)} />
        </>
    );
}
