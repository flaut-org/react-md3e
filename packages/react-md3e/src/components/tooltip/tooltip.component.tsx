'use client';

import { cloneElement, useId } from 'react';
import type { ReactElement } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { tooltipPortal, tooltipPositioner, tooltipPopup } from './tooltip.styles';
import type { TooltipProps } from './tooltip.types';

export function Tooltip({
  title,
  children,
  open,
  defaultOpen,
  onOpenChange,
  placement = 'top',
  enterDelay = 500,
  leaveDelay = 100,
  disableHoverablePopup = false,
  disabled = false,
  container,
  dir,
  className,
  ...props
}: TooltipProps) {
  const generatedId = useId();
  const popupId = props.id ?? generatedId;
  const child = children as ReactElement<{ 'aria-describedby'?: string }>;
  const trigger = cloneElement(child, {
    'aria-describedby': [child.props['aria-describedby'], popupId].filter(Boolean).join(' '),
  });
  const { anchorRef, host, direction } = usePortalContainer(container);
  const [side, edge] = placement.split('-');
  const align = edge ?? 'center';
  const resolvedDirection = dir ?? direction;
  const isDisabled = disabled || title == null || title === false || title === '';

  return (
    <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        disabled={isDisabled}
        disableHoverablePopup={disableHoverablePopup}
        onOpenChange={(next, details) => {
          const prevented = details.event.defaultPrevented;

          if (onOpenChange?.(next, details.event) === false || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          }
        }}
      >
        <span hidden ref={anchorRef} />
        <BaseTooltip.Trigger render={trigger} delay={enterDelay} closeDelay={leaveDelay} />
        <BaseTooltip.Portal container={host} className={tooltipPortal} dir={resolvedDirection}>
          <BaseTooltip.Positioner
            side={side as 'top' | 'bottom' | 'left' | 'right'}
            align={align as 'start' | 'end' | 'center'}
            sideOffset={8}
            collisionPadding={8}
            className={tooltipPositioner}
          >
            <BaseTooltip.Popup
              {...props}
              id={popupId}
              role="tooltip"
              className={[tooltipPopup, className].filter(Boolean).join(' ')}
              dir={resolvedDirection}
              data-md3-tooltip=""
            >
              {title}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </DirectionProvider>
  );
}
