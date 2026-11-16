import type { ComponentPropsWithRef } from 'react';

export type DividerVariant = 'fullWidth' | 'inset' | 'middle';
export interface DividerProps extends Omit<
  ComponentPropsWithRef<'hr'>,
  'children' | 'role' | 'aria-orientation' | 'aria-hidden'
> {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly variant?: DividerVariant;
  readonly flexItem?: boolean;
  readonly decorative?: boolean;
}
