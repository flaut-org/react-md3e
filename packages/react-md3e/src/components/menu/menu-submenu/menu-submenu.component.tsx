'use client';

import { useContext, useId, useMemo } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { MenuContext } from '../contexts/menu.context';
import { MenuItemContent } from '../../menu-item-content/menu-item-content.component';
import { menuItem, menuItemBody } from '../../menu-item-content/menu-item-content.styles';
import { MenuPopup } from '../menu-popup/menu-popup.component';
import { changeMenuOpen, menuTextValue } from '../menu.helpers';
import { menuArrow } from '../menu.styles';
import type { MenuSubmenuProps } from '../menu.types';

export function MenuSubmenu({
  label,
  leading,
  textValue,
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  disabled = false,
  loopFocus = true,
  variant,
  density,
  ...props
}: MenuSubmenuProps) {
  const parent = useContext(MenuContext);
  const id = useId();
  const context = useMemo(
    () => ({
      variant: variant ?? parent.variant,
      density: density ?? parent.density,
      disabled: disabled || parent.disabled,
    }),
    [variant, density, disabled, parent],
  );
  const { ref: rippleRef, handlers } = useRipple(context.disabled);

  return (
    <BaseMenu.SubmenuRoot
      open={open}
      defaultOpen={defaultOpen}
      disabled={context.disabled}
      loopFocus={loopFocus}
      onOpenChange={(next, details) =>
        changeMenuOpen(next, details, { disabled: context.disabled, onOpenChange, onClose })
      }
    >
      <BaseMenu.SubmenuTrigger
        {...handlers}
        id={id}
        disabled={context.disabled}
        label={menuTextValue(label, textValue)}
        className={menuItem}
        data-md3-menu-item=""
        data-md3-menu-submenu-trigger=""
      >
        <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
        <span className={menuItemBody} data-md3-menu-item-body="">
          <MenuItemContent
            leading={leading}
            trailing={
              <svg
                className={menuArrow}
                data-md3-menu-arrow=""
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m7 5 5 5-5 5Z" />
              </svg>
            }
          >
            {label}
          </MenuItemContent>
        </span>
      </BaseMenu.SubmenuTrigger>
      <MenuContext.Provider value={context}>
        <MenuPopup
          {...props}
          variant={context.variant}
          density={context.density}
          labelledBy={id}
          side="inline-end"
          align="start"
          nested
        />
      </MenuContext.Provider>
    </BaseMenu.SubmenuRoot>
  );
}
