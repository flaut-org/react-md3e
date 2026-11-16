import { dividerRoot } from './divider.styles';
import type { DividerProps } from './divider.types';

export function Divider({
  orientation = 'horizontal',
  variant = 'fullWidth',
  flexItem = false,
  decorative = false,
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      {...props}
      className={[dividerRoot, className].filter(Boolean).join(' ')}
      role={decorative ? 'presentation' : 'separator'}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      data-md3-divider=""
      data-orientation={orientation}
      data-variant={variant}
      data-flex-item={flexItem}
    />
  );
}
