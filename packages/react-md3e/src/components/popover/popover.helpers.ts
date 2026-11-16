import type { PopoverCloseReason, PopoverPlacement } from './popover.types';

export function getPopoverPlacement(placement: PopoverPlacement) {
  const [side, align = 'center'] = placement.split('-');

  return { side: side as 'top' | 'bottom' | 'left' | 'right', align: align as 'start' | 'center' | 'end' };
}

export function getPopoverCloseReason(reason: string): PopoverCloseReason {
  switch (reason) {
    case 'escape-key':
      return 'escapeKeyDown';
    case 'outside-press':
      return 'clickAway';
    case 'trigger-press':
      return 'triggerClick';
    case 'focus-out':
      return 'focusOut';
    case 'close-press':
      return 'closeButtonClick';
    default:
      return 'programmatic';
  }
}
