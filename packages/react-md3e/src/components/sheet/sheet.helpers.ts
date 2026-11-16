import type { SheetCloseReason } from './sheet.types';

export function sheetCloseReason(reason: string): SheetCloseReason {
  switch (reason) {
    case 'escape-key':
    case 'close-watcher':
      return 'escapeKeyDown';
    case 'outside-press':
      return 'backdropClick';
    case 'close-press':
      return 'closeButtonClick';
    case 'swipe':
      return 'swipe';
    case 'focus-out':
      return 'focusOut';
    default:
      return 'programmatic';
  }
}
