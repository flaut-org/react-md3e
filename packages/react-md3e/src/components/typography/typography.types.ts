import type { ComponentPropsWithRef, ElementType } from 'react';
import type { ColorRole, TypeScaleRole } from '../../theme/theme.types';

export type TypographyVariant = TypeScaleRole | 'inherit';
export type TypographyColor = ColorRole | 'inherit';
export type TypographyAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
interface OwnProps<C extends ElementType> {
  readonly component?: C | undefined;
  readonly variant?: TypographyVariant;
  readonly emphasized?: boolean;
  readonly color?: TypographyColor;
  readonly align?: TypographyAlign;
  readonly noWrap?: boolean;
}
export type TypographyProps<C extends ElementType = 'span'> = OwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof OwnProps<C>>;
