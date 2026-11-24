import { Navigation } from '../navigation/navigation.component';
import { navigationRail } from './navigation-rail.styles';
import type { NavigationRailProps } from './navigation-rail.types';

export function NavigationRail({
  variant = 'standard',
  appearance = 'expressive',
  expanded = false,
  hideWhenCollapsed = false,
  alignment = 'start',
  indicator = 'content',
  className,
  ...props
}: NavigationRailProps) {
  if (appearance === 'baseline' && expanded) {
    throw new TypeError('Baseline navigation rails do not expand. Use the expressive appearance.');
  }

  return (
    <Navigation
      {...props}
      kind="rail"
      modal={variant === 'modal'}
      className={[navigationRail, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-appearance={appearance}
      data-expanded={expanded || variant === 'modal'}
      data-hide-when-collapsed={hideWhenCollapsed}
      data-alignment={alignment}
      data-indicator={indicator}
    />
  );
}
