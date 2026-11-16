'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { iconButtonRoot, iconButtonContainer, iconButtonIcon } from './icon-button.styles';
import type { IconButtonProps } from './icon-button.types';

export function IconButton({
  variant = 'filled',
  size = 'small',
  shape = 'round',
  width = 'default',
  selected,
  disabled = false,
  disableRipple = false,
  type = 'button',
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: IconButtonProps) {
  const { ref: rippleRef, handlers } = useRipple(disabled || disableRipple);

  if (!ariaLabel?.trim() && !ariaLabelledBy?.trim()) {
    throw new TypeError('IconButton requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <BaseButton
      {...mergeProps<'button'>(handlers, props)}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-pressed={selected}
      className={[iconButtonRoot, className].filter(Boolean).join(' ')}
      data-md3-icon-button=""
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-width={width}
    >
      <span className={iconButtonContainer} data-md3-icon-button-container="" aria-hidden="true">
        <span ref={rippleRef} className={rippleSurface} />
        <span className={iconButtonIcon}>{children}</span>
      </span>
    </BaseButton>
  );
}
