'use client';

import { useRef } from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { mergeProps } from '@base-ui/react/merge-props';
import { useMergedRefs } from '../../internal/hooks/use-merged-refs.hook';
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import { useSwitchDrag } from '../../internal/hooks/use-switch-drag.hook';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { switchRoot, switchTrack, switchHandlePosition, switchHandle, switchRipple, switchIcon } from './switch.styles';
import type { SwitchProps } from './switch.types';

export function Switch({
  disabled = false,
  readOnly = false,
  disableRipple = false,
  icon,
  checkedIcon,
  inputRef,
  onChange,
  className,
  ...props
}: SwitchProps) {
  const nativeInput = useRef<HTMLInputElement>(null);
  const mergedInputRef = useMergedRefs(nativeInput, inputRef);
  const { ref: rippleRef, handlers: rippleHandlers } = useRipple(disabled || readOnly || disableRipple);
  const dragHandlers = useSwitchDrag(nativeInput, disabled || readOnly);

  return (
    <BaseSwitch.Root
      {...props}
      disabled={disabled}
      readOnly={readOnly}
      inputRef={mergedInputRef}
      className={[switchRoot, className].filter(Boolean).join(' ')}
      data-md3-switch=""
      onCheckedChange={(checked, details) => {
        onChange?.(details.event, checked);

        if (details.event.defaultPrevented) {
          details.cancel();
        }
      }}
      render={(rootProps, state) => {
        const content = state.checked ? checkedIcon : icon;
        const hasIcon = content != null && typeof content !== 'boolean';
        const interactive = !state.disabled && !state.readOnly;

        return (
          <span {...mergeProps<'span'>(interactive ? dragHandlers : {}, interactive ? rippleHandlers : {}, rootProps)}>
            <span className={switchTrack} aria-hidden="true" data-md3-switch-track="" />
            <span className={switchHandlePosition} aria-hidden="true" data-md3-switch-position="">
              <span ref={rippleRef} className={[rippleSurface, switchRipple].join(' ')} />
              <BaseSwitch.Thumb className={switchHandle} data-has-icon={hasIcon} data-md3-switch-handle="">
                {hasIcon && <span className={switchIcon}>{content}</span>}
              </BaseSwitch.Thumb>
            </span>
          </span>
        );
      }}
    />
  );
}
