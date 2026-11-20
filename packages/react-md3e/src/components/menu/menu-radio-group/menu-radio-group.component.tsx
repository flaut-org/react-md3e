'use client';

import { useContext, useMemo } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { MenuContext } from '../contexts/menu.context';
import { menuGroup, menuGroupLabel, menuItemBody } from '../menu.styles';
import type { MenuRadioGroupProps } from '../menu.types';

export function MenuRadioGroup({
  label,
  value,
  defaultValue,
  disabled = false,
  onChange,
  className,
  children,
  ...props
}: MenuRadioGroupProps) {
  const parent = useContext(MenuContext);
  const context = useMemo(() => ({ ...parent, disabled: disabled || parent.disabled }), [parent, disabled]);

  return (
    <MenuContext.Provider value={context}>
      <BaseMenu.RadioGroup
        {...props}
        value={value}
        defaultValue={defaultValue}
        disabled={context.disabled}
        className={[menuGroup, className].filter(Boolean).join(' ')}
        data-md3-menu-group=""
        onValueChange={(next: string, details) => {
          const prevented = details.event.defaultPrevented;

          if (onChange?.(details.event, next) === false || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          }
        }}
      >
        {label != null && (
          <BaseMenu.GroupLabel className={menuGroupLabel}>
            <span className={menuItemBody}>{label}</span>
          </BaseMenu.GroupLabel>
        )}
        {children}
      </BaseMenu.RadioGroup>
    </MenuContext.Provider>
  );
}
