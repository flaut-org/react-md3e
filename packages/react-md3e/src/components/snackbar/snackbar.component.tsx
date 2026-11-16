'use client';

import { useState } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { useSnackbarTimer } from '../../internal/hooks/use-snackbar-timer.hook';
import { SnackbarView } from './snackbar-view/snackbar-view.component';
import type { SnackbarProps, SnackbarCloseReason } from './snackbar.types';

export function Snackbar({
  open,
  defaultOpen = false,
  onOpenChange,
  onClose,
  autoHideDuration = null,
  disableWindowBlurListener = false,
  container,
  dir,
  ...props
}: SnackbarProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const shown = open ?? localOpen;
  const { anchorRef, host, direction } = usePortalContainer(container);
  const close = (event: Event | null, reason: SnackbarCloseReason) => {
    const prevented = event?.defaultPrevented ?? false;
    const cancelled = onClose?.(event, reason) === false;

    if (!cancelled && (prevented || !event?.defaultPrevented)) {
      const changeCancelled = onOpenChange?.(false, event) === false;

      if (!changeCancelled && (prevented || !event?.defaultPrevented) && open === undefined) {
        setLocalOpen(false);
      }
    }
  };
  const timer = useSnackbarTimer(shown, autoHideDuration, disableWindowBlurListener, () => close(null, 'timeout'));

  if (autoHideDuration !== null && (!Number.isFinite(autoHideDuration) || autoHideDuration < 0)) {
    throw new TypeError('autoHideDuration must be null or a non-negative duration.');
  }

  return (
    <BaseToast.Provider timeout={0} limit={1}>
      <span hidden ref={anchorRef} />
      <SnackbarView {...props} open={shown} host={host} dir={dir ?? direction} close={close} timer={timer} />
    </BaseToast.Provider>
  );
}
