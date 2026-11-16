'use client';

import type { ComponentPropsWithRef } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { cardActionArea } from './card-action-area.styles';
import type { CardActionAreaProps } from './card-action-area.types';

export function CardActionArea(props: CardActionAreaProps) {
  const { ref, handlers } = useRipple(Boolean(props.disabled || props.disableRipple));
  const content = <span ref={ref} className={rippleSurface} aria-hidden="true" />;
  let element;

  if (props.href !== undefined) {
    const { disabled = false, disableRipple = false, className, children, ...nativeProps } = props;

    const linkProps: ComponentPropsWithRef<'a'> = mergeProps<'a'>(handlers, nativeProps);

    element = (
      <a
        {...linkProps}
        href={disabled ? undefined : nativeProps.href}
        role={disabled ? 'link' : nativeProps.role}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : nativeProps.tabIndex}
        className={[cardActionArea, className].filter(Boolean).join(' ')}
        data-md3-card-action-area=""
        data-ripple={disableRipple ? 'disabled' : 'enabled'}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
          } else {
            linkProps.onClick?.(event);
          }
        }}
        onAuxClick={(event) => {
          if (disabled) {
            event.preventDefault();
          } else {
            linkProps.onAuxClick?.(event);
          }
        }}
      >
        {content}
        {children}
      </a>
    );
  } else {
    const { disabled = false, disableRipple = false, className, children, type = 'button', ...nativeProps } = props;

    element = (
      <BaseButton
        {...mergeProps<'button'>(handlers, nativeProps)}
        type={type}
        disabled={disabled}
        className={[cardActionArea, className].filter(Boolean).join(' ')}
        data-md3-card-action-area=""
        data-ripple={disableRipple ? 'disabled' : 'enabled'}
      >
        {content}
        {children}
      </BaseButton>
    );
  }

  return element;
}
