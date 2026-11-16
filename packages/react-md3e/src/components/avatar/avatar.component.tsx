import { AvatarImage } from './avatar-image/avatar-image.component';
import { avatarRoot } from './avatar.styles';
import type { AvatarProps } from './avatar.types';

export function Avatar({
  src,
  srcSet,
  alt = '',
  size = 'medium',
  variant = 'circular',
  imgProps,
  className,
  children,
  ...props
}: AvatarProps) {
  const fallback =
    children ??
    (Array.from(alt.trim())[0] || (
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22v-2a8 8 0 0 1 16 0v2z" />
      </svg>
    ));
  const accessibleName = props['aria-label'] ?? alt;
  const named = Boolean(accessibleName || props['aria-labelledby']);
  const rootProps = {
    ...props,
    'className': [avatarRoot, className].filter(Boolean).join(' '),
    'data-md3-avatar': '',
    'data-size': size,
    'data-variant': variant,
    'role': named ? 'img' : undefined,
    'aria-label': accessibleName || undefined,
    'aria-hidden': props['aria-hidden'] ?? (!named || undefined),
  } as const;

  return src || srcSet ? (
    <AvatarImage {...rootProps} src={src} srcSet={srcSet} imgProps={imgProps}>
      {fallback}
    </AvatarImage>
  ) : (
    <span {...rootProps}>{fallback}</span>
  );
}
