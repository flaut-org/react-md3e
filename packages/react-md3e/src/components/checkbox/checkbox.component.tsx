'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { selectionControl, selectionRipple } from '../../internal/selection-control/selection-control.styles';
import { SelectionIndicator } from '../selection-indicator/selection-indicator.component';
import type { CheckboxProps } from './checkbox.types';

export function Checkbox({
  disabled = false,
  readOnly = false,
  error = false,
  disableRipple = false,
  onChange,
  className,
  ...props
}: CheckboxProps) {
  const { ref: rippleRef, handlers } = useRipple(disabled || readOnly || disableRipple);

  return (
    <BaseCheckbox.Root
      {...props}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={error || props['aria-invalid']}
      data-error={error}
      data-md3-checkbox=""
      className={[selectionControl, className].filter(Boolean).join(' ')}
      onCheckedChange={(checked, details) => {
        onChange?.(details.event, checked);

        if (details.event.defaultPrevented) {
          details.cancel();
        }
      }}
      render={(rootProps, state) => (
        <span {...mergeProps<'span'>(state.disabled || state.readOnly ? {} : handlers, rootProps)}>
          <span ref={rippleRef} className={[rippleSurface, selectionRipple].join(' ')} aria-hidden="true" />
          <SelectionIndicator
            variant="checkbox"
            checked={state.checked}
            indeterminate={state.indeterminate}
            disabled={state.disabled}
            error={error}
          />
        </span>
      )}
    />
  );
}
