import { menuSurface } from './menu-surface.styles';
import type { MenuSurfaceElementProps } from './menu-surface.types';

/** Shared menu presentation; the owning primitive supplies roles, focus and dismissal. */
export function MenuSurface({
  variant = 'standard',
  density = 0,
  layout = 'standard',
  className,
  ...props
}: MenuSurfaceElementProps) {
  return (
    <div
      {...props}
      className={[menuSurface, className].filter(Boolean).join(' ')}
      data-md3-menu-surface=""
      data-variant={variant}
      data-density={density}
      data-layout={layout}
    />
  );
}
