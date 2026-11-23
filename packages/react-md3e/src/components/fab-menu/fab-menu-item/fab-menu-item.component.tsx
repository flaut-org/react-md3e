import { MenuItem } from '../../menu/menu-item/menu-item.component';
import { fabMenuItem } from '../fab-menu.styles';
import type { FabMenuItemProps } from '../fab-menu.types';

export function FabMenuItem({ icon, className, ...props }: FabMenuItemProps) {
  return (
    <MenuItem
      {...props}
      leading={icon}
      className={[fabMenuItem, className].filter(Boolean).join(' ')}
      data-md3-fab-menu-item=""
    />
  );
}
