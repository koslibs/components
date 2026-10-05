import cn from 'classnames';
import React, { useId } from 'react';

import colorStyles from './colors.module.css';
import styles from './index.module.css';
import presetStyles from './preset.module.css';

export type SpinnerProps = {
    /**
     * Управление видимостью компонента
     * @default false
     */
    visible?: boolean;

    /**
     * Размер спиннера
     *
     * @default 24
     */
    size?: 16 | 24 | 48;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор компонента в DOM
     */
    id?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Дополнительные инлайн стили для cпиннера
     */
    style?: React.CSSProperties;
};

const PRESET_CONFIG = {
    16: [2, 14, 'preset16'],
    24: [2, 20, 'preset24'],
    48: [4, 40, 'preset48'],
} as const;

export const Spinner = ({ visible, size = 24, className, id, dataTestId, style }: SpinnerProps) => {
    const [lineWidth, presetSize, styleKey] = PRESET_CONFIG[size];
    const presetClassname = presetStyles[styleKey];

    const uniqId = useId();

    const radius = presetSize / 2 - lineWidth / 2;
    const rotationAngle /* deg */ = Math.ceil((Math.asin(lineWidth / 2 / radius) * 180) / Math.PI);
    const gap /* deg */ = 90;
    const pathLength /* deg */ = 360;
    const strokeDasharray = `${pathLength - gap - rotationAngle} ${gap + rotationAngle}`;
    const gradient = `conic-gradient(from ${rotationAngle}deg, transparent ${
        gap - rotationAngle * 2
    }deg, currentColor)`;

    return (
        <svg
            aria-hidden="true"
            viewBox={`0 0 ${presetSize} ${presetSize}`}
            style={{ ...style, height: presetSize, width: presetSize }}
            className={cn(styles.spinner, colorStyles.component, presetClassname, className, {
                [styles.visible]: visible,
            })}
            data-test-id={dataTestId}
            id={id}
        >
            <defs>
                <mask id={uniqId}>
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        strokeWidth={lineWidth}
                        strokeLinecap="round"
                        stroke="#fff"
                        strokeDashoffset={-rotationAngle}
                        strokeDasharray={strokeDasharray}
                        pathLength={pathLength}
                    />
                </mask>
            </defs>
            <foreignObject
                x="0"
                y="0"
                width={presetSize}
                height={presetSize}
                mask={`url(#${uniqId})`}
            >
                <div className={styles.gradient} style={{ backgroundImage: gradient }} />
            </foreignObject>
        </svg>
    );
};
