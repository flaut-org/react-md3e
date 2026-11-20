import { MenuItemControl } from '../menu-item-control/menu-item-control.component';
import type { MenuCheckboxItemProps } from '../menu.types';

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  return <MenuItemControl {...props} kind="checkbox" />;
}
