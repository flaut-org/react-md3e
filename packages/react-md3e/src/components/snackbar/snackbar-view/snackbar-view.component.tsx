'use client';

import { useEffect, useId } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { IconButton } from '../../icon-button/icon-button.component';
import { snackbarPortal, snackbarViewport, snackbarRoot, snackbarMessage, snackbarActions } from '../snackbar.styles';
import type { SnackbarViewProps } from './snackbar-view.types';

export function SnackbarView({
  open,
  message,
  action,
  priority = 'polite',
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  showCloseButton = false,
  closeText = 'Close notification',
  notificationsLabel = 'Notifications',
  host,
  close,
  timer,
  dir,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: SnackbarViewProps) {
  const id = useId();
  const { toasts, add, close: closeToast } = BaseToast.useToastManager();

  useEffect(() => {
    if (open) {
      add({ id, title: message, priority: priority === 'assertive' ? 'high' : 'low', timeout: 0 });
    } else {
      closeToast(id);
    }
  }, [open, id, message, priority, add, closeToast]);

  return (
    <BaseToast.Portal container={host} className={snackbarPortal} dir={dir}>
      <BaseToast.Viewport
        className={snackbarViewport}
        aria-label={notificationsLabel}
        data-vertical={anchorOrigin.vertical}
        data-horizontal={anchorOrigin.horizontal}
        dir={dir}
      >
        {toasts.map((toast) => (
          <BaseToast.Root
            {...props}
            key={toast.id}
            toast={toast}
            swipeDirection={[]}
            role="group"
            aria-modal={undefined}
            className={[snackbarRoot, className].filter(Boolean).join(' ')}
            data-md3-snackbar=""
            dir={dir}
            onPointerEnter={(event) => {
              onPointerEnter?.(event);
              timer.pause('pointer');
            }}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              timer.resume('pointer');
            }}
            onFocus={(event) => {
              onFocus?.(event);
              timer.pause('focus');
            }}
            onBlur={(event) => {
              onBlur?.(event);

              if (!event.currentTarget.contains(event.relatedTarget)) {
                timer.resume('focus');
              }
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);

              if (!event.defaultPrevented && event.key === 'Escape') {
                event.stopPropagation();
                event.preventBaseUIHandler();
                close(event.nativeEvent, 'escapeKeyDown');
              }
            }}
          >
            <BaseToast.Title className={snackbarMessage}>{toast.title}</BaseToast.Title>
            {(action != null || showCloseButton) && (
              <div className={snackbarActions}>
                {action}
                {showCloseButton && (
                  <IconButton
                    variant="standard"
                    aria-label={closeText}
                    onClick={(event) => close(event.nativeEvent, 'closeButtonClick')}
                  >
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                      <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </IconButton>
                )}
              </div>
            )}
          </BaseToast.Root>
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}
