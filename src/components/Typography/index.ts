import { TypographyText } from './text';
import { TypographyTitle } from './title';

export { TypographyText, TypographyText as Text, TypographyTitle, TypographyTitle as Title };
export type { TextProps, TitleProps, TypographyColor, TypographyWeight } from './shared';

export const Typography = { Text: TypographyText, Title: TypographyTitle };
