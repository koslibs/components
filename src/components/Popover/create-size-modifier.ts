import { detectOverflow, type Modifier } from '@popperjs/core';

type Options = {
    availableHeight: boolean;
    useAnchorWidth: boolean;
    viewportPadding: number;
};

export const createSizeModifier = (options: Options): Modifier<'availableSize', Options> => ({
    name: 'availableSize',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    options,
    fn({ state }) {
        const { availableHeight, useAnchorWidth, viewportPadding } = options;
        const documentElement = state.elements.popper.ownerDocument.documentElement;
        const overflow = detectOverflow(state, { boundary: [], padding: viewportPadding });
        const side = state.placement.split('-')[0];
        const height =
            side === 'top' || side === 'bottom'
                ? state.rects.popper.height - overflow[side]
                : documentElement.clientHeight - viewportPadding * 2;

        Object.assign(state.styles.popper, {
            '--popover-viewport-padding': `${viewportPadding}px`,
            '--popover-available-height': availableHeight ? `${Math.max(0, height)}px` : 'none',
        });

        if (useAnchorWidth) state.styles.popper.width = `${state.rects.reference.width}px`;
    },
});
