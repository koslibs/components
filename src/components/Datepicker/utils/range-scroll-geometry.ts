export type MonthPosition = { month: number; fraction: number };

type MonthRow = {
    month: number;
    start: number;
    contentEnd: number;
    end: number;
};

export type MonthGeometry = readonly MonthRow[];

export function measureMonths(elements: ReadonlyMap<number, HTMLElement>): MonthGeometry {
    const measured = Array.from(elements, ([month, element]) => {
        const start = element.offsetTop;

        return {
            month,
            start,
            contentEnd: start + element.offsetHeight,
        };
    }).sort((first, second) => first.month - second.month);

    if (!measured.length || measured[0].contentEnd <= measured[0].start) return [];

    return measured.map((row, index) => ({
        ...row,
        end: measured[index + 1]?.start ?? row.contentEnd,
    }));
}

export function positionAt(geometry: MonthGeometry, offset: number): MonthPosition | null {
    const index = Math.max(
        0,
        geometry.findLastIndex((row) => row.start <= offset)
    );
    const row = geometry[index];

    if (!row || row.end <= row.start) return null;

    return {
        month: row.month,
        fraction: Math.max(0, Math.min(1, (offset - row.start) / (row.end - row.start))),
    };
}

export function offsetFor(geometry: MonthGeometry, position: MonthPosition): number | null {
    const row = geometry.find((candidate) => candidate.month === position.month);

    // Include gaps/year captions in each span to keep the mapping continuous at boundaries.
    return row ? row.start + position.fraction * (row.end - row.start) : null;
}
