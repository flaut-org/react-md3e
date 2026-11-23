import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { FabAppearance } from '../fab/fab.types';

export type ExtendedFabSize = 'small' | 'medium' | 'large';
type Content = FabAppearance & {
  readonly size?: ExtendedFabSize;
  readonly children: ReactNode;
} & (
    | { readonly extended?: true; readonly startIcon?: ReactNode }
    | { readonly extended: false; readonly startIcon: NonNullable<ReactNode> }
  );

export type ExtendedFabProps = Content & Omit<ComponentPropsWithRef<'button'>, keyof Content | 'aria-pressed'>;
export type ExtendedFabLinkProps = Content &
  Omit<ComponentPropsWithRef<'a'>, keyof Content | 'href' | 'aria-pressed'> & { readonly href: string };
