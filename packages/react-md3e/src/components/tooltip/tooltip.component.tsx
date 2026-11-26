'use client';

import { cloneElement, useId } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { usePortalContainer } from '../../internal/hooks/use-portal-container.hook';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { useTooltipController } from '../../internal/hooks/use-tooltip-controller.hook';
import { hasTooltipContent } from './tooltip.helpers';
import {
  tooltipPortal,
  tooltipPositioner,
  tooltipPopup,
  tooltipHeadline,
  tooltipBody,
  tooltipActions,
  tooltipArrow,
} from './tooltip.styles';
import type { TooltipProps } from './tooltip.types';

export function Tooltip({
  title,
  children,
  open,
  defaultOpen,
  onOpenChange,
  variant = 'plain',
  headline,
  actions,
  persistent = false,
  placement = variant === 'rich' ? 'bottom-start' : 'top',
  enterDelay = 500,
  leaveDelay = 100,
  enterTouchDelay = 700,
  leaveTouchDelay = 1500,
  disableTouchListener = false,
  disableInteractive,
  disableHoverablePopup = false,
  arrow = false,
  offset = 4,
  disabled = false,
  container,
  dir,
  className,
  ref,
  ...props
}: TooltipProps) {
  const generatedId = useId();
  const popupId = props.id ?? generatedId;
  const child = children as ReactElement<Pick<ComponentPropsWithRef<'button'>, 'id' | 'aria-describedby'>>;
  const triggerId = child.props.id ?? `${generatedId}-trigger`;
  const rich = variant === 'rich';
  const hasHeadline = hasTooltipContent(headline);
  const hasActions = hasTooltipContent(actions);
  const isDisabled = disabled || !hasTooltipContent(title);
  const {
    isOpen,
    requestChange,
    popupRef: internalPopupRef,
    setTriggerRef,
    clearTimers,
    triggerProps,
    onTriggerFocus,
    hasFocus,
  } = useTooltipController({
    open,
    defaultOpen,
    onOpenChange,
    disabled: isDisabled,
    enterTouchDelay,
    leaveTouchDelay,
    disableTouchListener,
    rich,
    persistent,
  });
  const popupRef = useMergedRefs(ref, internalPopupRef);
  const trigger = cloneElement(child, {
    'aria-describedby':
      [child.props['aria-describedby'], !isDisabled && popupId].filter(Boolean).join(' ') || undefined,
  });
  const { anchorRef, host, direction } = usePortalContainer(container, isOpen);
  const [side, edge] = placement.split('-');
  const align = edge ?? 'center';
  const resolvedDirection = dir ?? direction;
  const positionerProps = {
    'side': side as 'top' | 'bottom' | 'left' | 'right',
    'align': align as 'start' | 'end' | 'center',
    'sideOffset': offset + (arrow ? 8 : 0),
    'collisionPadding': 8,
    'positionMethod': 'fixed' as const,
    'className': tooltipPositioner,
    'data-variant': variant,
  };
  const popupProps = {
    ...props,
    'id': popupId,
    'ref': popupRef,
    'className': [tooltipPopup, className].filter(Boolean).join(' '),
    'dir': resolvedDirection,
    'data-md3-tooltip': '',
    'data-variant': variant,
  };
  const handleChange = (
    next: boolean,
    details: BaseTooltip.Root.ChangeEventDetails | BasePopover.Root.ChangeEventDetails,
  ) => {
    if (
      rich &&
      ((!persistent && details.reason === 'trigger-press') ||
        (!next && details.reason === 'trigger-hover' && hasFocus()))
    ) {
      details.cancel();
    } else if (!requestChange(next, details.event)) {
      details.cancel();
    } else if (rich && next && details.reason === 'trigger-hover') {
      // Base UI's hover-open transition disables its nonmodal focus manager, leaving its trigger
      // Tab guard without a content target. Open through our controlled state instead; initialFocus
      // remains false, while Base UI can manage the later keyboard transition into this dialog.
      details.cancel();
    }
  };

  if (rich && !hasHeadline && !props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('Rich Tooltip requires a non-empty headline, aria-label or aria-labelledby.');
  }

  if (rich) {
    return (
      <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
        <BasePopover.Root open={isOpen} triggerId={triggerId} onOpenChange={handleChange} modal={false}>
          <span hidden ref={anchorRef} />
          <BasePopover.Trigger
            {...triggerProps}
            ref={setTriggerRef}
            id={triggerId}
            render={child}
            nativeButton={typeof child.type !== 'string' || child.type === 'button'}
            openOnHover={!persistent && !isDisabled}
            delay={enterDelay}
            closeDelay={leaveDelay}
            onFocus={onTriggerFocus}
          />
          <BasePopover.Portal container={host} className={tooltipPortal} dir={resolvedDirection}>
            <BasePopover.Positioner {...positionerProps}>
              <BasePopover.Popup
                {...popupProps}
                role="dialog"
                aria-labelledby={props['aria-labelledby'] ?? (hasHeadline ? `${popupId}-headline` : undefined)}
                initialFocus={false}
                onPointerDown={(event) => {
                  clearTimers();
                  props.onPointerDown?.(event);
                }}
              >
                {arrow && <BasePopover.Arrow className={tooltipArrow} data-variant={variant} />}
                {hasHeadline && (
                  <div id={`${popupId}-headline`} className={tooltipHeadline} data-md3-tooltip-headline="">
                    {headline}
                  </div>
                )}
                <div className={tooltipBody} data-md3-tooltip-body="">
                  {title}
                </div>
                {hasActions && (
                  <div className={tooltipActions} data-md3-tooltip-actions="">
                    {actions}
                  </div>
                )}
              </BasePopover.Popup>
            </BasePopover.Positioner>
          </BasePopover.Portal>
        </BasePopover.Root>
      </DirectionProvider>
    );
  }

  return (
    <DirectionProvider direction={resolvedDirection === 'rtl' ? 'rtl' : 'ltr'}>
      <BaseTooltip.Root
        open={isOpen}
        triggerId={triggerId}
        disabled={isDisabled}
        disableHoverablePopup={disableInteractive ?? disableHoverablePopup}
        onOpenChange={handleChange}
      >
        <span hidden ref={anchorRef} />
        <BaseTooltip.Trigger
          {...triggerProps}
          ref={setTriggerRef}
          id={triggerId}
          render={trigger}
          delay={enterDelay}
          closeDelay={leaveDelay}
        />
        <BaseTooltip.Portal container={host} className={tooltipPortal} dir={resolvedDirection}>
          <BaseTooltip.Positioner {...positionerProps}>
            <BaseTooltip.Popup
              {...popupProps}
              role="tooltip"
              data-disable-interactive={disableInteractive ?? disableHoverablePopup}
            >
              {arrow && <BaseTooltip.Arrow className={tooltipArrow} data-variant={variant} />}
              <div className={tooltipBody}>{title}</div>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </DirectionProvider>
  );
}
