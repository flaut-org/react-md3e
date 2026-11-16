import type { ComponentPropsWithRef } from 'react';

export type AvatarSize = 'small' | 'medium' | 'large';
export type AvatarVariant = 'circular' | 'rounded' | 'square';
export type AvatarProps = ComponentPropsWithRef<'span'> & {
  readonly src?: string | undefined;
  readonly srcSet?: string | undefined;
  /** Accessible name for the whole avatar; empty means decorative. */
  readonly alt?: string;
  readonly size?: AvatarSize;
  readonly variant?: AvatarVariant;
  readonly imgProps?: Omit<ComponentPropsWithRef<'img'>, 'src' | 'srcSet' | 'alt' | 'children'> | undefined;
};
