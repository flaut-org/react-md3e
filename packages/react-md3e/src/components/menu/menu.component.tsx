'use client';

import { cloneElement, useId, useMemo } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { MenuContext } from './contexts/menu.context';
import { MenuPopup } from './menu-popup/menu-popup.component';
import { changeMenuOpen } from './menu.helpers';
import { menuTrigger } from './menu.styles';
import type { MenuProps } from './menu.types';

export function Menu({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  disabled = false,
  loopFocus = true,
  modal = true,
  variant = 'standard',
  density = 0,
  placement = 'bottom-start',
  anchorEl,
  dir,
  ...props
}: MenuProps) {
  const id = useId();
  const triggerId = trigger.props.id ?? id;
  const isDisabled = disabled || Boolean(trigger.props.disabled);
  const { anchorRef, direction } = useInheritedDirection(dir);
  const [side, align = 'center'] = placement.split('-');
  const context = useMemo(() => ({ variant, density, disabled: isDisabled }), [variant, density, isDisabled]);

  if (typeof trigger.type === 'string' && trigger.type !== 'button') {
    throw new TypeError('Menu trigger must be a native button or a component rendering one.');
  }

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <MenuContext.Provider value={context}>
        <BaseMenu.Root
          open={open}
          defaultOpen={defaultOpen}
          triggerId={triggerId}
          defaultTriggerId={triggerId}
          modal={modal}
          disabled={isDisabled}
          loopFocus={loopFocus}
          onOpenChange={(next, details) =>
            changeMenuOpen(next, details, { disabled: isDisabled, onOpenChange, onClose })
          }
        >
          <span hidden ref={anchorRef} />
          <BaseMenu.Trigger
            id={triggerId}
            disabled={isDisabled}
            className={menuTrigger}
            render={cloneElement(trigger, { id: triggerId, disabled: isDisabled })}
          />
          <MenuPopup
            {...props}
            dir={direction}
            variant={variant}
            density={density}
            labelledBy={triggerId}
            anchorEl={anchorEl}
            side={side as 'top' | 'bottom' | 'left' | 'right'}
            align={align as 'start' | 'end' | 'center'}
          />
        </BaseMenu.Root>
      </MenuContext.Provider>
    </DirectionProvider>
  );
}
