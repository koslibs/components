import { ChevronDownIcon } from '@koslibs/icons/ChevronDownIcon';
import cn from 'classnames';
import {
    forwardRef,
    type TransitionEvent,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

import styles from './index.module.css';

export type CollapseProps = Omit<HTMLAttributes<HTMLDivElement>, 'onTransitionEnd'> & {
    /**
     * Состояние controlled-компонента.
     */
    expanded?: boolean;

    /**
     * Начальное состояние uncontrolled-компонента.
     * @default false
     */
    defaultExpanded?: boolean;

    /**
     * Подпись кнопки, когда содержимое скрыто.
     */
    collapsedLabel?: ReactNode;

    /**
     * Подпись кнопки, когда содержимое раскрыто.
     */
    expandedLabel?: ReactNode;

    /**
     * Показывать шеврон справа от подписи: вниз при закрытии, вверх при раскрытии.
     * @default true
     */
    showRightChevron?: boolean;

    /**
     * Показывать шеврон слева от подписи: вправо при закрытии, вниз при раскрытии.
     * @default false
     */
    showLeftChevron?: boolean;

    /**
     * Запрос изменения состояния. В controlled-режиме обновите expanded.
     */
    onExpandedChange?: (expanded: boolean) => void;

    /**
     * Завершение раскрытия/сворачивания; без анимации вызывается сразу.
     */
    onTransitionEnd?: (expanded: boolean) => void;

    /**
     * Дополнительный класс внутреннего контейнера содержимого.
     */
    expandedContentClassName?: string;

    /**
     * Идентификатор корневого элемента для автоматизированных тестов.
     */
    dataTestId?: string;
};

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
    (
        {
            expanded,
            defaultExpanded = false,
            collapsedLabel,
            expandedLabel,
            showRightChevron = true,
            showLeftChevron = false,
            onExpandedChange,
            onTransitionEnd,
            expandedContentClassName,
            dataTestId,
            className,
            children,
            ...restProps
        },
        ref
    ) => {
        const [expandedState, setExpandedState] = useState(defaultExpanded);
        const isExpanded = expanded ?? expandedState;
        const contentId = `collapse-${useId()}`;
        const contentRef = useRef<HTMLDivElement>(null);
        const innerRef = useRef<HTMLDivElement>(null);
        const toggleRef = useRef<HTMLButtonElement>(null);
        const previousExpanded = useRef(isExpanded);
        const pendingTransition = useRef(false);
        const transitionCallback = useRef(onTransitionEnd);
        const label = isExpanded
            ? expandedLabel || collapsedLabel
            : collapsedLabel || expandedLabel;

        useLayoutEffect(() => {
            transitionCallback.current = onTransitionEnd;
        }, [onTransitionEnd]);

        useLayoutEffect(() => {
            const content = contentRef.current;
            if (!content) return;

            if (!isExpanded && content.contains(content.ownerDocument.activeElement)) {
                toggleRef.current?.focus();
            }

            // React 18 does not yet expose inert as a typed JSX attribute.
            content.inert = !isExpanded;

            if (previousExpanded.current === isExpanded) return;
            previousExpanded.current = isExpanded;
            pendingTransition.current = true;

            const transitionDuration =
                content.ownerDocument.defaultView?.getComputedStyle(content).transitionDuration;
            if (
                innerRef.current?.scrollHeight === 0 ||
                parseFloat(transitionDuration ?? '0') === 0
            ) {
                pendingTransition.current = false;
                transitionCallback.current?.(isExpanded);
            }
        }, [isExpanded]);

        const handleToggle = () => {
            const nextExpanded = !isExpanded;
            if (expanded === undefined) setExpandedState(nextExpanded);
            onExpandedChange?.(nextExpanded);
        };

        const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
            if (
                event.target === event.currentTarget &&
                event.propertyName === 'grid-template-rows' &&
                pendingTransition.current
            ) {
                pendingTransition.current = false;
                transitionCallback.current?.(isExpanded);
            }
        };

        return (
            <div
                {...restProps}
                ref={ref}
                className={cn(styles.component, className)}
                data-test-id={dataTestId}
            >
                {label && (
                    <button
                        ref={toggleRef}
                        type="button"
                        className={styles.toggle}
                        aria-expanded={isExpanded}
                        aria-controls={contentId}
                        onClick={handleToggle}
                        data-test-id={dataTestId ? `${dataTestId}-toggle` : undefined}
                    >
                        {showLeftChevron && (
                            <ChevronDownIcon
                                className={cn(styles.icon, styles.leftIcon, {
                                    [styles.rotated]: isExpanded,
                                })}
                                aria-hidden="true"
                            />
                        )}
                        <span>{label}</span>
                        {showRightChevron && (
                            <ChevronDownIcon
                                className={cn(styles.icon, { [styles.rotated]: isExpanded })}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                )}
                <div
                    ref={contentRef}
                    id={contentId}
                    className={cn(styles.content, { [styles.expanded]: isExpanded })}
                    aria-hidden={!isExpanded}
                    data-test-id={dataTestId ? `${dataTestId}-content` : undefined}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <div className={styles.clip}>
                        <div ref={innerRef} className={expandedContentClassName}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

Collapse.displayName = 'Collapse';
