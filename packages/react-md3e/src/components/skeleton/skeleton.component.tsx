import { skeletonRoot } from './skeleton.styles';
import type { SkeletonProps } from './skeleton.types';

/** A decorative, inert placeholder. Loading announcements belong to the surrounding region. */
export function Skeleton({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  style,
  className,
  ...props
}: SkeletonProps) {
  return (
    <span
      {...props}
      role="presentation"
      aria-hidden="true"
      inert
      className={[skeletonRoot, className].filter(Boolean).join(' ')}
      data-md3-skeleton=""
      data-variant={variant}
      data-animation={animation}
      style={{ width, height, ...style }}
    />
  );
}
