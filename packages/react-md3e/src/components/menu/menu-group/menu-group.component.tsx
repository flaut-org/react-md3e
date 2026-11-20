'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { menuItemBody } from '../../menu-item-content/menu-item-content.styles';
import { menuGroup, menuGroupLabel } from '../menu.styles';
import type { MenuGroupProps } from '../menu.types';

export function MenuGroup({ label, className, children, ...props }: MenuGroupProps) {
  return (
    <BaseMenu.Group {...props} className={[menuGroup, className].filter(Boolean).join(' ')} data-md3-menu-group="">
      {label != null && (
        <BaseMenu.GroupLabel className={menuGroupLabel}>
          <span className={menuItemBody}>{label}</span>
        </BaseMenu.GroupLabel>
      )}
      {children}
    </BaseMenu.Group>
  );
}
