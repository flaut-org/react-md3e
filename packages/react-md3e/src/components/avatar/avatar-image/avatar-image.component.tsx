'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { AvatarProps } from '../avatar.types';
import { avatarImage, avatarFallback } from './avatar-image.styles';

export function AvatarImage({
  src,
  srcSet,
  imgProps,
  children,
  ...props
}: Omit<AvatarProps, 'size' | 'variant' | 'alt'>) {
  return (
    <BaseAvatar.Root {...props}>
      <BaseAvatar.Fallback className={avatarFallback} aria-hidden="true">
        {children}
      </BaseAvatar.Fallback>
      <BaseAvatar.Image
        {...imgProps}
        keepMounted
        src={src}
        srcSet={srcSet}
        alt=""
        className={[avatarImage, imgProps?.className].filter(Boolean).join(' ')}
      />
    </BaseAvatar.Root>
  );
}
