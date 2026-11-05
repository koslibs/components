import cn from 'classnames';
import { forwardRef, type MouseEvent } from 'react';

import { useDataTestId } from '../../hooks/use-data-test-id';
import { Popover, type PopoverProps } from '../Popover';

import { DatepickerPanel } from './datepicker-panel';
import { useDatepickerValue } from './hooks/use-datepicker-value';
import type {
    DatepickerChangePayload,
    DatepickerPopoverProps,
    DatepickerRange,
    DatepickerValueProps,
} from './types';

import styles from './index.module.css';

const offset: [number, number] = [0, 8];

export const DatepickerPopoverSurface = forwardRef<
    HTMLDivElement,
    Omit<PopoverProps, 'className' | 'offset'> & Pick<DatepickerValueProps, 'mode'>
>(({ mode, children, ...props }, ref) => (
    <Popover
        {...props}
        ref={ref}
        offset={offset}
        className={cn(styles.popup, mode === 'range' && styles.rangePopup)}
    >
        <div className={styles.panelContainer}>{children}</div>
    </Popover>
));

export const DatepickerPopover = forwardRef<HTMLDivElement, DatepickerPopoverProps>(
    (props, ref) => {
        const {
            open,
            anchorElement,
            position,
            getPortalContainer,
            outsideClick,
            onClose,
            onCancel,
            dataTestId,
            id,
            className,
            style,
        } = props;
        const selection = useDatepickerValue(props);
        const getId = useDataTestId(dataTestId);

        const handleChange = (
            event: MouseEvent<HTMLButtonElement>,
            { value }: DatepickerChangePayload<string | DatepickerRange | null>
        ) => {
            selection.commit(event, value);
        };

        const valueProps: DatepickerValueProps =
            props.mode === 'range'
                ? {
                      mode: 'range',
                      value: typeof selection.value === 'object' ? selection.value : null,
                      onChange: handleChange,
                  }
                : {
                      mode: 'single',
                      value: typeof selection.value === 'string' ? selection.value : null,
                      onChange: handleChange,
                  };

        return (
            <DatepickerPopoverSurface
                ref={ref}
                mode={props.mode}
                open={open}
                anchorElement={anchorElement}
                position={position}
                getPortalContainer={getPortalContainer}
                outsideClick={outsideClick}
                onClose={onClose}
                dataTestId={dataTestId}
            >
                <DatepickerPanel
                    key={props.mode ?? 'single'}
                    {...valueProps}
                    id={id}
                    className={className}
                    style={style}
                    onCancel={onCancel ?? onClose}
                    dataTestId={getId('panel')}
                />
            </DatepickerPopoverSurface>
        );
    }
);

DatepickerPopover.displayName = 'DatepickerPopover';
