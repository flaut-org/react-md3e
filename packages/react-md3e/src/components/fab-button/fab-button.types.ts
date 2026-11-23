import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { FabAppearance, FabSize } from '../fab/fab.types';

interface Appearance extends FabAppearance {
  readonly children: ReactNode;
  readonly size?: FabSize;
  readonly startIcon?: ReactNode;
  readonly iconOnly?: boolean;
  readonly extended?: boolean;
}

export type FabButtonProps = Appearance &
  (
    | Omit<ComponentPropsWithRef<'button'>, keyof Appearance | 'aria-pressed'>
    | (Omit<ComponentPropsWithRef<'a'>, keyof Appearance | 'href' | 'aria-pressed'> & { readonly href: string })
  );
