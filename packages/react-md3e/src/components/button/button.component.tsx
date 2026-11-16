'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';

import { createElement } from 'react';
import type { ComponentPropsWithRef, ElementType, MouseEvent, ReactElement } from 'react';
import { ButtonLoadingIndicator } from './button-loading-indicator/button-loading-indicator.component';
import type { ButtonProps, ButtonLinkProps } from './button.types';
import { buttonRoot, buttonIcon, buttonLabel } from './button.styles';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { useRipple } from '../../internal/hooks/use-ripple.hook';

/** Base UI owns button semantics; our client behavior adds the MD3 press ripple. */
export function Button(props: ButtonLinkProps): ReactElement;
export function Button<C extends ElementType = 'button'>(props: ButtonProps<C>): ReactElement;

export function Button<C extends ElementType = 'button'>({
  component,
  variant = 'filled',
  size = 'small',
  shape = 'round',
  selected,
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  loadingIndicator,
  fullWidth = false,
  disableRipple = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps<C> | ButtonLinkProps) {
  const { ref: rippleRef, handlers } = useRipple(disabled || loading || disableRipple);

  if (variant === 'text' && selected !== undefined) {
    throw new TypeError('MD3 text buttons do not support toggle selection.');
  }

  const unavailable = disabled || loading;
  const link = ('href' in props && typeof props.href === 'string') || component === 'a';
  const classNames = [buttonRoot, className].filter(Boolean).join(' ');
  const content = (
    <>
      <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
      {startIcon != null && (
        <span className={buttonIcon} data-md3-icon="start" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className={buttonLabel}>{children}</span>
      {endIcon != null && (
        <span className={buttonIcon} data-md3-icon="end" aria-hidden="true">
          {endIcon}
        </span>
      )}
      {loading && <ButtonLoadingIndicator>{loadingIndicator}</ButtonLoadingIndicator>}
    </>
  );
  const attributes = {
    'className': classNames,
    'data-md3-button': '',
    'data-variant': variant,
    'data-size': size,
    'data-shape': shape,
    'data-ripple': disableRipple ? 'disabled' : 'enabled',
    'data-loading': loading,
    'data-full-width': fullWidth,
    'aria-pressed': selected,
    'aria-busy': loading || undefined,
  } as const;

  if (link) {
    const nativeProps: ComponentPropsWithRef<'a'> = mergeProps<'a'>(handlers, props as ComponentPropsWithRef<'a'>);

    return createElement(
      component ?? 'a',
      {
        ...nativeProps,
        ...attributes,
        'href': unavailable ? undefined : nativeProps.href,
        'role': unavailable ? 'link' : nativeProps.role,
        'aria-disabled': unavailable || undefined,
        'tabIndex': unavailable ? -1 : nativeProps.tabIndex,
        'onClick': (event: MouseEvent<HTMLAnchorElement>) => {
          if (unavailable) {
            event.preventDefault();
          } else {
            nativeProps.onClick?.(event);
          }
        },
        'onAuxClick': (event: MouseEvent<HTMLAnchorElement>) => {
          if (unavailable) {
            event.preventDefault();
          } else {
            nativeProps.onAuxClick?.(event);
          }
        },
      },
      content,
    );
  }

  return (
    <BaseButton
      {...mergeProps<'button'>(handlers, props as ComponentPropsWithRef<'button'>)}
      {...attributes}
      nativeButton={!component || component === 'button' || typeof component !== 'string'}
      type={type as 'button' | 'submit' | 'reset'}
      disabled={unavailable}
      render={component ? createElement(component) : undefined}
    >
      {content}
    </BaseButton>
  );
}
