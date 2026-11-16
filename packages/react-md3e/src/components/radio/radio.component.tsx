'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { selectionControl, selectionRipple } from '../../internal/selection-control/selection-control.styles';
import { SelectionIndicator } from '../selection-indicator/selection-indicator.component';
import type { RadioProps } from './radio.types';

export function Radio({
  disabled = false,
  readOnly = false,
  error = false,
  disableRipple = false,
  className,
  ...props
}: RadioProps) {
  const { ref: rippleRef, handlers } = useRipple(disabled || readOnly || disableRipple);

  return (
    <BaseRadio.Root
      {...props}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={error || props['aria-invalid']}
      data-error={error}
      data-md3-radio=""
      className={[selectionControl, className].filter(Boolean).join(' ')}
      render={(rootProps, state) => (
        <span {...mergeProps<'span'>(state.disabled || state.readOnly ? {} : handlers, rootProps)}>
          <span ref={rippleRef} className={[rippleSurface, selectionRipple].join(' ')} aria-hidden="true" />
          <SelectionIndicator variant="radio" checked={state.checked} disabled={state.disabled} error={error} />
        </span>
      )}
    />
  );
}
