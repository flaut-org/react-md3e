'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { IconButton } from '../../icon-button/icon-button.component';
import { sheetPopup, sheetHandle, sheetHeader, sheetContent, sheetActions, sheetClose } from '../sheet.styles';
import type { SheetInternalProps } from '../sheet.types';

export function SheetPanel({
  edge,
  variant = 'modal',
  header,
  actions,
  children,
  showCloseButton = true,
  showDragHandle = false,
  closeText = 'Close sheet',
  initialFocus,
  finalFocus,
  disableSwipe = false,
  className,
  ...props
}: SheetInternalProps) {
  const modal = variant === 'modal';

  return (
    <BaseDrawer.Popup
      {...props}
      role={modal ? 'dialog' : 'complementary'}
      aria-modal={modal || undefined}
      initialFocus={initialFocus ?? modal}
      finalFocus={finalFocus ?? modal}
      className={[sheetPopup, className].filter(Boolean).join(' ')}
      data-md3-sheet=""
      data-edge={edge}
      data-variant={variant}
      data-base-ui-swipe-ignore={disableSwipe || !modal ? '' : undefined}
    >
      {showDragHandle && (
        <div className={sheetHandle} aria-hidden="true" data-md3-sheet-handle="">
          <span />
        </div>
      )}
      {(header != null || showCloseButton) && (
        <div className={sheetHeader}>
          <div>{header}</div>
          {showCloseButton && (
            <BaseDrawer.Close
              render={
                <IconButton variant="standard" className={sheetClose} aria-label={closeText}>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </IconButton>
              }
            />
          )}
        </div>
      )}
      <BaseDrawer.Content className={sheetContent} data-md3-sheet-content="">
        {children}
      </BaseDrawer.Content>
      {actions != null && <div className={sheetActions}>{actions}</div>}
    </BaseDrawer.Popup>
  );
}
