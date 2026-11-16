'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { dialogPortal, dialogBackdrop, dialogViewport, dialogPopup } from './dialog.styles';
import type { DialogProps } from './dialog.types';

export function Dialog({
  open,
  onClose,
  fullScreen = false,
  fullWidth = false,
  maxWidth,
  scroll = 'paper',
  keepMounted = false,
  disableEscapeKeyDown = false,
  container,
  initialFocus,
  finalFocus,
  role = fullScreen ? 'dialog' : 'alertdialog',
  className,
  dir,
  children,
  ...props
}: DialogProps) {
  const { anchorRef, host, direction } = usePortalContainer(container);
  const scrollMode = fullScreen ? 'paper' : scroll;

  const handleOpenChange = (nextOpen: boolean, details: BaseDialog.Root.ChangeEventDetails) => {
    if (!nextOpen) {
      if (details.reason === 'escape-key') {
        if (disableEscapeKeyDown) {
          details.cancel();
        } else {
          onClose?.(details.event, 'escapeKeyDown');
        }
      }

      if (details.reason === 'outside-press') {
        onClose?.(details.event, 'backdropClick');
      }
    }
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange}>
      <span hidden ref={anchorRef} data-md3-dialog-anchor="" />
      <BaseDialog.Portal container={host} keepMounted={keepMounted} className={dialogPortal} dir={dir ?? direction}>
        <BaseDialog.Backdrop className={dialogBackdrop} data-md3-dialog-backdrop="" />
        <BaseDialog.Viewport
          className={dialogViewport}
          data-full-screen={fullScreen}
          data-scroll={scrollMode}
          data-md3-dialog-viewport=""
        >
          <BaseDialog.Popup
            {...props}
            role={role}
            aria-modal="true"
            dir={dir ?? direction}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={[dialogPopup, className].filter(Boolean).join(' ')}
            data-md3-dialog=""
            data-full-screen={fullScreen}
            data-full-width={fullWidth}
            data-max-width={maxWidth}
            data-scroll={scrollMode}
          >
            {children}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
