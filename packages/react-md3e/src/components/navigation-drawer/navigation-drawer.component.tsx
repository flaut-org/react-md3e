import { Navigation } from '../navigation/navigation.component';
import { navigationDrawer } from './navigation-drawer.styles';
import type { NavigationDrawerProps } from './navigation-drawer.types';

export function NavigationDrawer({ variant = 'modal', className, ...props }: NavigationDrawerProps) {
  return (
    <Navigation
      {...props}
      kind="drawer"
      modal={variant === 'modal'}
      className={[navigationDrawer, className].filter(Boolean).join(' ')}
      data-variant={variant}
    />
  );
}
