import { MenuItemControl } from '../menu-item-control/menu-item-control.component';
import type { MenuItemProps } from '../menu.types';

export function MenuItem(props: MenuItemProps) {
  return <MenuItemControl {...props} kind="action" />;
}
