'use client';

import { useId, useState } from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { sheetCloseReason } from './sheet.helpers';
import { SheetPanel } from './sheet-panel/sheet-panel.component';
import { sheetPortal, sheetBackdrop, sheetViewport, sheetInline } from './sheet.styles';
import type { SheetInternalProps } from './sheet.types';

/** Shared interaction owner for both public sheet components. */
export function Sheet({
  edge,
  variant = 'modal',
  open,
  defaultOpen,
  trigger,
  onOpenChange,
  onClose,
  onOpenChangeComplete,
  keepMounted = false,
  disableEscapeKeyDown = false,
  disableSwipe = false,
  container,
  dir,
  ...props
}: SheetInternalProps) {
  const { anchorRef, host, direction } = usePortalContainer(container);
  const generatedId = useId();
  const [inlineHost, setInlineHost] = useState<HTMLDivElement | null>(null);
  const modal = variant === 'modal';
  const resolvedDirection = dir ?? direction;
  const panel = (
    <SheetPanel {...props} edge={edge} variant={variant} dir={resolvedDirection} disableSwipe={disableSwipe} />
  );

  const content = modal ? (
    <BaseDrawer.Portal container={host} keepMounted={keepMounted} className={sheetPortal} dir={resolvedDirection}>
      <BaseDrawer.Backdrop className={sheetBackdrop} data-md3-sheet-backdrop="" />
      <BaseDrawer.Viewport className={sheetViewport} data-edge={edge}>
        {panel}
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  ) : (
    <div ref={setInlineHost} className={sheetInline}>
      {inlineHost && (
        <BaseDrawer.Portal container={inlineHost} keepMounted={keepMounted} className={sheetInline}>
          <BaseDrawer.Viewport className={sheetInline}>{panel}</BaseDrawer.Viewport>
        </BaseDrawer.Portal>
      )}
    </div>
  );

  return (
    <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        disablePointerDismissal={!modal}
        swipeDirection={edge === 'bottom' ? 'down' : edge}
        onOpenChangeComplete={onOpenChangeComplete}
        onOpenChange={(next, details) => {
          const reason = sheetCloseReason(details.reason);
          const prevented = details.event.defaultPrevented;

          if (!next && ((disableEscapeKeyDown && reason === 'escapeKeyDown') || (disableSwipe && reason === 'swipe'))) {
            details.cancel();
          } else {
            const cancelled = !next && onClose?.(details.event, reason) === false;

            if (cancelled || (!prevented && details.event.defaultPrevented)) {
              details.cancel();
            } else if (
              onOpenChange?.(next, details.event) === false ||
              (!prevented && details.event.defaultPrevented)
            ) {
              details.cancel();
            }
          }
        }}
      >
        <span hidden ref={anchorRef} />
        {trigger && <BaseDrawer.Trigger render={trigger} id={generatedId} />}
        {edge === 'bottom' ? (
          <BaseDrawer.VirtualKeyboardProvider>{content}</BaseDrawer.VirtualKeyboardProvider>
        ) : (
          content
        )}
      </BaseDrawer.Root>
    </DirectionProvider>
  );
}
