'use client';

import { createElement, useContext } from 'react';
import type { ComponentPropsWithRef, ElementType, KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../internal/ripple/ripple.styles';
import { NavigationSelectionContext } from '../navigation/contexts/navigation.context';
import { moveNavigationFocus } from './navigation-item-focus';
import {
  navigationItem,
  navigationItemSurface,
  navigationItemIndicator,
  navigationItemIcon,
  navigationItemInlineLabel,
  navigationItemBottomLabel,
  navigationItemBadge,
  navigationItemFocus,
  navigationItemInlineFocus,
} from './navigation-item.styles';
import type { NavigationItemProps, NavigationItemLinkProps } from './navigation-item.types';

export function NavigationItem(props: NavigationItemLinkProps): ReactElement;
export function NavigationItem<C extends ElementType = 'button'>(props: NavigationItemProps<C>): ReactElement;

export function NavigationItem<C extends ElementType = 'button'>({
  component,
  value,
  selected,
  label,
  icon,
  selectedIcon,
  badge,
  children,
  disabled = false,
  disableRipple = false,
  className,
  ...props
}: NavigationItemProps<C> | NavigationItemLinkProps) {
  const selection = useContext(NavigationSelectionContext);
  const active = selected ?? (value !== undefined && selection?.value === value);
  const { ref: rippleRef, handlers } = useRipple(disabled || disableRipple);
  const text = label ?? children;
  const link = ('href' in props && typeof props.href === 'string') || component === 'a';

  const names: readonly unknown[] = [props['aria-label'], props['aria-labelledby']];
  const named = names.some((name) => typeof name === 'string' && name.trim());
  const labelValue: unknown = text;

  if ((labelValue == null || (typeof labelValue === 'string' && !labelValue.trim())) && !named) {
    throw new TypeError('An icon-only NavigationItem requires a non-empty aria-label or aria-labelledby.');
  }

  const attributes = {
    'className': [navigationItem, className].filter(Boolean).join(' '),
    'data-md3-navigation-item': '',
    'data-selected': Boolean(active),
    'data-with-icon': icon != null || selectedIcon != null,
    'data-with-label': text != null,
    'data-ripple': disableRipple ? 'disabled' : 'enabled',
    'aria-current': active ? 'page' : undefined,
  } as const;
  const content = (
    <>
      <span className={navigationItemFocus} data-md3-navigation-focus-ring="" aria-hidden="true" />
      <span className={navigationItemSurface} data-md3-navigation-surface="">
        <span className={navigationItemInlineFocus} data-md3-navigation-inline-focus-ring="" aria-hidden="true" />
        <span className={navigationItemIndicator} data-md3-navigation-indicator="" aria-hidden="true" />
        <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
        {(icon != null || selectedIcon != null) && (
          <span className={navigationItemIcon} data-md3-navigation-icon="" aria-hidden="true">
            {active ? (selectedIcon ?? icon) : (icon ?? selectedIcon)}
          </span>
        )}
        {text != null && (
          <span className={navigationItemInlineLabel} data-md3-navigation-inline-label="">
            <span>{text}</span>
          </span>
        )}
        {badge != null && (
          <span className={navigationItemBadge} data-md3-navigation-badge="">
            {badge}
          </span>
        )}
      </span>
      {text != null && (
        <span className={navigationItemBottomLabel} data-md3-navigation-bottom-label="" aria-hidden="true">
          <span>{text}</span>
        </span>
      )}
    </>
  );

  function select(event: MouseEvent<HTMLElement>) {
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    const anchor = event.currentTarget;
    const external =
      link && ((anchor.getAttribute('target') ?? '_self') !== '_self' || anchor.hasAttribute('download'));

    if (
      !event.defaultPrevented &&
      !modified &&
      !external &&
      value !== undefined &&
      selection &&
      !selection.select(event.nativeEvent, value)
    ) {
      event.preventDefault();
    }
  }

  if (link) {
    const nativeProps: ComponentPropsWithRef<'a'> = mergeProps<'a'>(handlers, props as ComponentPropsWithRef<'a'>);

    return createElement(
      component ?? 'a',
      {
        ...nativeProps,
        ...attributes,
        'href': disabled ? undefined : nativeProps.href,
        'role': disabled ? 'link' : undefined,
        'aria-disabled': disabled || undefined,
        'tabIndex': disabled ? -1 : nativeProps.tabIndex,
        'onClick': (event: MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            event.preventDefault();
          } else {
            nativeProps.onClick?.(event);
            select(event);
          }
        },
        'onAuxClick': (event: MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            event.preventDefault();
          } else {
            nativeProps.onAuxClick?.(event);
          }
        },
        'onKeyDown': (event: KeyboardEvent<HTMLAnchorElement>) => {
          nativeProps.onKeyDown?.(event);

          if (!event.defaultPrevented) {
            moveNavigationFocus(event);
          }
        },
      },
      content,
    );
  }

  const nativeProps = mergeProps<'button'>(handlers, props as ComponentPropsWithRef<'button'>);

  return (
    <BaseButton
      {...nativeProps}
      {...attributes}
      type="button"
      disabled={disabled}
      nativeButton={!component || component === 'button' || typeof component !== 'string'}
      render={component ? createElement(component) : undefined}
      onClick={(event) => {
        nativeProps.onClick?.(event);
        select(event);
      }}
      onKeyDown={(event) => {
        nativeProps.onKeyDown?.(event);

        if (!event.defaultPrevented) {
          moveNavigationFocus(event);
        }
      }}
    >
      {content}
    </BaseButton>
  );
}
