import { Navigation } from '../navigation/navigation.component';
import { navigationBar } from './navigation-bar.styles';
import type { NavigationBarProps } from './navigation-bar.types';

export function NavigationBar({
  variant = 'flexible',
  iconPosition = 'auto',
  position = 'static',
  className,
  ...props
}: NavigationBarProps) {
  return (
    <Navigation
      {...props}
      kind="bar"
      className={[navigationBar, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-icon-position={variant === 'baseline' ? 'top' : iconPosition}
      data-position={position}
    />
  );
}
