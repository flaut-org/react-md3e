'use client';

import { useContext } from 'react';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { Button } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { Toolbar } from '@base-ui/react/toolbar';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRipple } from '../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../internal/ripple/ripple.styles';
import { ChipSetContext } from '../contexts/chip-set.context';
import { chipDeleteSurface } from '../chip.styles';

interface ChipControlProps extends ComponentPropsWithRef<'button'> {
  readonly disableRipple?: boolean | undefined;
  readonly pressed?: boolean | undefined;
  readonly onPressedChange?: Toggle.Props['onPressedChange'];
  readonly control?: ElementType | undefined;
  readonly iconButton?: boolean;
  readonly children?: ReactNode;
}

/** One DOM button, with Base UI behavior and the shared ripple. Slots replace the primitive. */
export function ChipControl({
  disableRipple = false,
  pressed,
  onPressedChange,
  control: Control,
  iconButton = false,
  children,
  disabled = false,
  className,
  onClick,
  ...props
}: ChipControlProps) {
  const set = useContext(ChipSetContext);
  const unavailable = disabled || Boolean(set?.disabled);
  const { ref, handlers } = useRipple(unavailable || disableRipple);
  const attributes = mergeProps<'button'>(handlers, props, {
    disabled: unavailable,
    className,
    onClick(event) {
      onClick?.(event);

      if (event.defaultPrevented) {
        event.preventBaseUIHandler();
      }
    },
  });
  const ripple = <span ref={ref} className={rippleSurface} data-md3-chip-ripple-surface="" aria-hidden="true" />;
  const content = iconButton ? (
    <span className={chipDeleteSurface} data-md3-chip-delete-surface="" aria-hidden="true">
      {ripple}
      {children}
    </span>
  ) : (
    <>
      {ripple}
      {children}
    </>
  );

  if (Control) {
    return <Control {...attributes}>{content}</Control>;
  }

  const render = set ? <Toolbar.Button focusableWhenDisabled={false} /> : undefined;

  if (pressed !== undefined) {
    return (
      <Toggle
        {...attributes}
        value={attributes.value === undefined ? undefined : String(attributes.value)}
        pressed={pressed}
        onPressedChange={onPressedChange}
        render={render}
      >
        {content}
      </Toggle>
    );
  }

  return (
    <Button {...attributes} render={render}>
      {content}
    </Button>
  );
}
