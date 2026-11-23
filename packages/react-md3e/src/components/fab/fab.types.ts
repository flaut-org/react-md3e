import type { ComponentPropsWithRef, ReactNode } from 'react';

/** `small` is the legacy 40px FAB; new designs should use regular, medium or large. */
export type FabSize = 'small' | 'regular' | 'medium' | 'large';
export type FabColor =
  'primaryContainer' | 'secondaryContainer' | 'tertiaryContainer' | 'primary' | 'secondary' | 'tertiary' | 'surface';

export interface FabAppearance {
  readonly color?: FabColor;
  readonly lowered?: boolean;
  readonly disabled?: boolean;
  readonly disableRipple?: boolean;
}

type AccessibleName =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: string }
  | { readonly 'aria-label'?: string; readonly 'aria-labelledby': string };
interface FabContent extends FabAppearance {
  readonly size?: FabSize;
  readonly children: ReactNode;
}

export type FabProps = FabContent &
  AccessibleName &
  Omit<ComponentPropsWithRef<'button'>, keyof FabContent | 'aria-label' | 'aria-labelledby' | 'aria-pressed'>;
export type FabLinkProps = FabContent &
  AccessibleName &
  Omit<ComponentPropsWithRef<'a'>, keyof FabContent | 'href' | 'aria-label' | 'aria-labelledby' | 'aria-pressed'> & {
    readonly href: string;
  };
