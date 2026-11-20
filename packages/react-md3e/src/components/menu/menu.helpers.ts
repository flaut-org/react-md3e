import type { MouseEvent } from 'react';
import type { Menu as BaseMenu } from '@base-ui/react/menu';
import type { MenuCloseReason, MenuItemBaseProps, MenuProps } from './menu.types';

function closeReason(reason: string, event: Event): MenuCloseReason {
  switch (reason) {
    case 'escape-key':
      return 'escapeKeyDown';
    case 'outside-press':
      return 'clickAway';
    case 'trigger-press':
      return 'triggerClick';
    case 'focus-out':
      return 'focusOut';
    case 'item-press':
      return 'itemClick';
    case 'list-navigation':
      return 'key' in event && event.key === 'Tab' ? 'tabKeyDown' : 'programmatic';
    default:
      return 'programmatic';
  }
}

export function changeMenuOpen(
  next: boolean,
  details: BaseMenu.Root.ChangeEventDetails,
  {
    disabled,
    onClose,
    onOpenChange,
  }: { disabled: boolean; onClose: MenuProps['onClose']; onOpenChange: MenuProps['onOpenChange'] },
) {
  const prevented = details.event.defaultPrevented;
  const closeCancelled = !next && onClose?.(details.event, closeReason(details.reason, details.event)) === false;

  if ((next && disabled) || closeCancelled || (!prevented && details.event.defaultPrevented)) {
    details.cancel();
  } else {
    const changeCancelled = onOpenChange?.(next, details.event) === false;

    if (changeCancelled || (!prevented && details.event.defaultPrevented)) {
      details.cancel();
    }
  }
}

/** Keep Base UI event helpers private while accepting ordinary React click callbacks. */
export function clickMenuItem(
  event: MouseEvent<HTMLElement> & { preventBaseUIHandler?: () => void },
  onClick: MenuItemBaseProps['onClick'],
) {
  if (onClick?.(event) === false) {
    event.preventDefault();
  }

  if (event.defaultPrevented) {
    event.preventBaseUIHandler?.();
  }
}

export function menuTextValue(children: unknown, textValue?: string) {
  return textValue ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : undefined);
}
