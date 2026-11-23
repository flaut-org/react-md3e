'use client';

import { useState } from 'react';
import { FabButton } from '../fab-button/fab-button.component';
import { Menu } from '../menu/menu.component';
import { fabMenuItems, indexFabMenuItems } from './fab-menu.helpers';
import { fabMenuRoot, fabMenuToggle, fabMenuIcons, fabMenuPopup } from './fab-menu.styles';
import type { FabMenuProps } from './fab-menu.types';

export function FabMenu({
  children,
  icon,
  label,
  closeLabel = 'Close menu',
  color = 'primary',
  size = 'regular',
  lowered = false,
  disabled = false,
  fabProps,
  menuProps,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onClose,
  dir,
  className,
  ...props
}: FabMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = (controlledOpen ?? uncontrolledOpen) && !disabled;
  const items = fabMenuItems(children);

  if (items.length < 2 || items.length > 6) {
    throw new RangeError('FabMenu requires two to six FabMenuItem actions.');
  }

  return (
    <div
      {...props}
      dir={dir}
      className={[fabMenuRoot, className].filter(Boolean).join(' ')}
      data-md3-fab-menu=""
      data-fab-size={size}
      data-open={open}
    >
      <Menu
        modal={false}
        offset={8}
        collisionPadding={16}
        {...menuProps}
        placement="top-end"
        dir={dir}
        disabled={disabled}
        open={open}
        {...(onClose && { onClose })}
        onOpenChange={(next, event) => {
          const prevented = event.defaultPrevented;
          const cancelled = onOpenChange?.(next, event) === false;

          if (cancelled || (!prevented && event.defaultPrevented)) {
            return false;
          }

          if (controlledOpen === undefined) {
            setUncontrolledOpen(next);
          }

          return true;
        }}
        aria-label={menuProps?.['aria-label'] ?? label}
        className={[fabMenuPopup, menuProps?.className].filter(Boolean).join(' ')}
        data-md3-fab-menu-popup=""
        data-fab-menu-color={color}
        data-item-count={items.length}
        trigger={
          <FabButton
            {...fabProps}
            type="button"
            iconOnly
            size={size}
            color={`${color}Container`}
            lowered={lowered}
            disabled={disabled}
            aria-label={open ? closeLabel : label}
            className={[fabMenuToggle, fabProps?.className].filter(Boolean).join(' ')}
            data-md3-fab-menu-toggle=""
            data-fab-menu-color={color}
          >
            <span className={fabMenuIcons}>
              <span data-fab-menu-icon="action">{icon}</span>
              <svg data-fab-menu-icon="close" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z" />
              </svg>
            </span>
          </FabButton>
        }
      >
        {indexFabMenuItems(items)}
      </Menu>
    </div>
  );
}
