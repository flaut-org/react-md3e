'use client';

import { useContext } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { SegmentedButtonContext } from '../contexts/segmented-button.context';
import {
  buttonSegmentRoot,
  buttonSegmentContainer,
  buttonSegmentContent,
  buttonSegmentIcon,
  buttonSegmentIconSlot,
  buttonSegmentSelectedIcon,
  buttonSegmentUnselectedIcon,
  buttonSegmentLabel,
} from '../segmented-button.styles';
import type { ButtonSegmentProps } from '../segmented-button.types';

export function ButtonSegment({
  value,
  icon,
  disabled = false,
  disableRipple = false,
  className,
  children,
  ...props
}: ButtonSegmentProps) {
  const group = useContext(SegmentedButtonContext);
  const unavailable = disabled || Boolean(group?.disabled);
  const { ref: rippleRef, handlers } = useRipple(unavailable || Boolean(group?.readOnly) || disableRipple);
  const iconOnly = children == null;
  const leadingIcon = icon != null && !iconOnly;

  if (!group) {
    throw new TypeError('ButtonSegment must be inside SegmentedButton.');
  }

  if (!value.trim()) {
    throw new TypeError('ButtonSegment requires a non-empty, stable value.');
  }

  if (iconOnly && !props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('An icon-only ButtonSegment requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <Toggle
      {...mergeProps<'button'>(handlers, props)}
      value={value}
      disabled={unavailable}
      onPressedChange={(_pressed, details) => {
        if (details.event.defaultPrevented) {
          details.cancel();
        }
      }}
      className={[buttonSegmentRoot, className].filter(Boolean).join(' ')}
      render={(nativeProps, state) => (
        <button
          {...nativeProps}
          type="button"
          role={group.multiple ? 'checkbox' : 'radio'}
          aria-pressed={undefined}
          aria-checked={state.pressed}
          aria-readonly={(group.multiple && group.readOnly) || undefined}
          data-md3-button-segment=""
          data-with-icon={leadingIcon}
          data-icon-only={iconOnly}
          data-selection-indicator={!group.hideSelectionIndicator}
          data-readonly={group.readOnly}
        >
          <span className={buttonSegmentContainer} data-md3-segment-container="">
            <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
            <span className={buttonSegmentContent} data-md3-segment-content="">
              {(!group.hideSelectionIndicator || leadingIcon) && (
                <span className={buttonSegmentIconSlot} aria-hidden="true">
                  {!group.hideSelectionIndicator && (
                    <span className={buttonSegmentSelectedIcon} data-md3-segment-check="">
                      {group.selectedIcon === undefined ? (
                        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m3 9 4 4 8-8" />
                        </svg>
                      ) : (
                        group.selectedIcon
                      )}
                    </span>
                  )}
                  {leadingIcon && (
                    <span className={buttonSegmentUnselectedIcon} data-md3-segment-icon="">
                      {icon}
                    </span>
                  )}
                </span>
              )}
              {iconOnly ? (
                <span className={buttonSegmentIcon} aria-hidden="true" data-md3-segment-icon="">
                  {icon}
                </span>
              ) : (
                <span className={buttonSegmentLabel}>{children}</span>
              )}
            </span>
          </span>
          {group.name !== undefined && (
            <input
              type="hidden"
              name={group.name}
              form={group.form}
              value={value}
              disabled={!state.pressed || unavailable}
            />
          )}
        </button>
      )}
    />
  );
}
