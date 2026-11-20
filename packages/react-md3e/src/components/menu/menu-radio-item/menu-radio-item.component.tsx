import { MenuItemControl } from '../menu-item-control/menu-item-control.component';
import type { MenuRadioItemProps } from '../menu.types';

export function MenuRadioItem(props: MenuRadioItemProps) {
  return <MenuItemControl {...props} kind="radio" />;
}
