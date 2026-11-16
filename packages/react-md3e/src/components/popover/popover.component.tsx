'use client';

import { cloneElement, useId } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { getPopoverPlacement, getPopoverCloseReason } from './popover.helpers';
import { popoverPortal, popoverPositioner, popoverPopup, popoverDismiss } from './popover.styles';
import type { PopoverProps } from './popover.types';

export function Popover({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  onClose,
  placement = 'bottom-start',
  offset = 8,
  collisionPadding = 8,
  positionMethod = 'fixed',
  anchorEl,
  container,
  initialFocus,
  finalFocus,
  disabled = false,
  modal = false,
  keepMounted = false,
  matchAnchorWidth = false,
  disablePadding = false,
  disableEscapeKeyDown = false,
  closeText = 'Close popover',
  className,
  dir,
  children,
  ...props
}: PopoverProps) {
  const generatedId = useId();
  const triggerId = trigger.props.id ?? generatedId;
  const isDisabled = disabled || Boolean(trigger.props.disabled);
  const { anchorRef, host, direction } = usePortalContainer(container);
  const { side, align } = getPopoverPlacement(placement);
  const resolvedDirection = dir ?? direction;
  const handleOpenChange = (next: boolean, details: BasePopover.Root.ChangeEventDetails) => {
    const wasPrevented = details.event.defaultPrevented;

    if ((!next && disableEscapeKeyDown && details.reason === 'escape-key') || (next && isDisabled)) {
      details.cancel();
    } else {
      const closeCancelled = !next && onClose?.(details.event, getPopoverCloseReason(details.reason)) === false;

      if (closeCancelled || (!wasPrevented && details.event.defaultPrevented)) {
        details.cancel();
      } else {
        const changeCancelled = onOpenChange?.(next, details.event) === false;

        if (changeCancelled || (!wasPrevented && details.event.defaultPrevented)) {
          details.cancel();
        }
      }
    }
  };

  if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('Popover requires a non-empty aria-label or aria-labelledby.');
  }

  if (typeof trigger.type === 'string' && trigger.type !== 'button') {
    throw new TypeError('Popover trigger must be a native button or a component rendering one.');
  }

  return (
    <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
      <BasePopover.Root
        open={open}
        defaultOpen={defaultOpen}
        triggerId={triggerId}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        <span hidden ref={anchorRef} />
        <BasePopover.Trigger
          id={triggerId}
          disabled={isDisabled}
          render={cloneElement(trigger, { id: triggerId, disabled: isDisabled })}
        />
        <BasePopover.Portal
          container={host}
          keepMounted={keepMounted}
          className={popoverPortal}
          dir={resolvedDirection}
        >
          <BasePopover.Positioner
            anchor={anchorEl}
            side={side}
            align={align}
            sideOffset={offset}
            collisionPadding={collisionPadding}
            positionMethod={positionMethod}
            className={popoverPositioner}
          >
            <BasePopover.Popup
              {...props}
              role="dialog"
              aria-modal={modal || undefined}
              initialFocus={initialFocus}
              finalFocus={finalFocus}
              className={[popoverPopup, className].filter(Boolean).join(' ')}
              dir={resolvedDirection}
              data-md3-popover=""
              data-match-anchor-width={matchAnchorWidth}
              data-disable-padding={disablePadding}
            >
              {children}
              {modal && <BasePopover.Close className={popoverDismiss}>{closeText}</BasePopover.Close>}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    </DirectionProvider>
  );
}
