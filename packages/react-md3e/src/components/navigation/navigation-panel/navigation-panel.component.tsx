'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { ReactNode } from 'react';
import { usePortalContainer } from '../../../internal/hooks/use-portal-container.hook';
import { sheetCloseReason } from '../../sheet/sheet.helpers';
import type { NavigationModalOptions } from '../navigation.types';
import { navigationPortal, navigationBackdrop, navigationViewport, navigationPopup } from './navigation-panel.styles';

type Props = NavigationModalOptions & {
  readonly 'kind': 'bar' | 'rail' | 'drawer';
  readonly 'children': ReactNode;
  readonly 'aria-label': string | undefined;
  readonly 'aria-labelledby': string | undefined;
  readonly 'dir': string | undefined;
};

/** Base UI owns modal focus, scroll locking, dismissal, swipe and exit retention. */
export function NavigationPanel({
  kind,
  children,
  dir,
  container,
  open,
  defaultOpen,
  trigger,
  onOpenChange,
  onOpenChangeComplete,
  onClose,
  keepMounted = false,
  disableEscapeKeyDown = false,
  disableSwipe = false,
  initialFocus,
  finalFocus,
  ...name
}: Props) {
  const { anchorRef, host, direction } = usePortalContainer(container);
  const resolvedDirection = dir ?? direction;
  const edge = resolvedDirection === 'rtl' ? 'right' : 'left';

  return (
    <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        swipeDirection={edge}
        onOpenChangeComplete={onOpenChangeComplete}
        onOpenChange={(next, details) => {
          const reason = sheetCloseReason(details.reason);
          const prevented = details.event.defaultPrevented;

          if (!next && ((disableEscapeKeyDown && reason === 'escapeKeyDown') || (disableSwipe && reason === 'swipe'))) {
            details.cancel();
          } else {
            const canceled = !next && onClose?.(details.event, reason) === false;

            if (canceled || (!prevented && details.event.defaultPrevented)) {
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
        {trigger && <BaseDrawer.Trigger render={trigger} />}
        <BaseDrawer.Portal
          container={host}
          keepMounted={keepMounted}
          className={navigationPortal}
          dir={resolvedDirection}
        >
          <BaseDrawer.Backdrop className={navigationBackdrop} data-md3-navigation-backdrop="" />
          <BaseDrawer.Viewport className={navigationViewport} data-edge={edge}>
            <BaseDrawer.Popup
              {...name}
              role="dialog"
              aria-modal="true"
              initialFocus={initialFocus ?? true}
              finalFocus={finalFocus ?? true}
              dir={resolvedDirection}
              className={navigationPopup}
              data-md3-navigation-popup={kind}
              data-edge={edge}
              data-base-ui-swipe-ignore={disableSwipe ? '' : undefined}
            >
              <BaseDrawer.Content data-md3-navigation-content="">{children}</BaseDrawer.Content>
            </BaseDrawer.Popup>
          </BaseDrawer.Viewport>
        </BaseDrawer.Portal>
      </BaseDrawer.Root>
    </DirectionProvider>
  );
}
