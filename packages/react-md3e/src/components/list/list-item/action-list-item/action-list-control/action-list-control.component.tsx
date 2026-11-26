'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Collapsible } from '@base-ui/react/collapsible';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../../../internal/ripple/ripple.styles';
import { listAction } from '../action-list-item.styles';
import type { ListItemActionProps } from '../../list-item.types';

export function ActionListControl({
  action = {},
  expanding = false,
  controlsId,
  disabled,
  disableRipple,
  children,
}: {
  readonly action?: ListItemActionProps | undefined;
  readonly expanding?: boolean;
  readonly controlsId?: string | undefined;
  readonly disabled: boolean;
  readonly disableRipple: boolean;
  readonly children: ReactNode;
}) {
  const { ref, handlers } = useRipple(disabled || disableRipple);
  const attributes = {
    'className': [listAction, action.className].filter(Boolean).join(' '),
    'data-md3-list-action': '',
    'data-ripple': disableRipple ? 'disabled' : 'enabled',
  } as const;
  const content = (
    <>
      <span ref={ref} className={rippleSurface} aria-hidden="true" />
      {children}
    </>
  );

  if (action.href !== undefined) {
    const props: ComponentPropsWithRef<'a'> = mergeProps<'a'>(handlers, action);

    return (
      <a
        {...props}
        {...attributes}
        href={disabled ? undefined : action.href}
        role={disabled ? 'link' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
          } else {
            props.onClick?.(event);
          }
        }}
        onAuxClick={(event) => {
          if (disabled) {
            event.preventDefault();
          } else {
            props.onAuxClick?.(event);
          }
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);

          if (!disabled && !event.defaultPrevented && event.key === ' ') {
            event.preventDefault();
          }
        }}
        onKeyUp={(event) => {
          props.onKeyUp?.(event);

          if (!disabled && !event.defaultPrevented && event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
      >
        {content}
      </a>
    );
  }

  const props: ComponentPropsWithRef<'button'> = mergeProps<'button'>(handlers, action);

  if (expanding) {
    return (
      <Collapsible.Trigger {...props} {...attributes} aria-controls={controlsId} type="button" disabled={disabled}>
        {content}
      </Collapsible.Trigger>
    );
  }

  return (
    <BaseButton {...props} {...attributes} type={props.type ?? 'button'} disabled={disabled}>
      {content}
    </BaseButton>
  );
}
