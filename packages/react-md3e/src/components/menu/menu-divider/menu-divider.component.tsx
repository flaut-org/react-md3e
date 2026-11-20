'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { menuDivider } from '../menu.styles';
import type { MenuDividerProps } from '../menu.types';

export function MenuDivider({ className, ...props }: MenuDividerProps) {
  return <BaseMenu.Separator {...props} className={[menuDivider, className].filter(Boolean).join(' ')} />;
}
