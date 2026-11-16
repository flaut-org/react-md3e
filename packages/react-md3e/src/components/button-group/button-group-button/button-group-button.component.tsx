'use client';

import { useContext } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { Toggle } from '@base-ui/react/toggle';
import { Button } from '../../button/button.component';
import { ButtonGroupContext } from '../contexts/button-group.context';
import type { ButtonGroupButtonProps } from '../button-group.types';

export function ButtonGroupButton({ value, disabled = false, loading = false, ...props }: ButtonGroupButtonProps) {
  const group = useContext(ButtonGroupContext);

  if (!group) {
    throw new TypeError('ButtonGroupButton must be inside ButtonGroup.');
  }

  const unavailable = disabled || group.disabled || loading;

  if (group.selectionMode === 'none') {
    return <Button {...props} size={group.size} variant={group.variant} disabled={unavailable} loading={loading} />;
  }

  return (
    <Toggle
      value={value}
      disabled={unavailable}
      render={(nativeProps, state) => (
        <Button
          {...mergeProps<'button'>(nativeProps, props)}
          size={group.size}
          variant={group.variant}
          disabled={state.disabled}
          loading={loading}
          selected={state.pressed}
        />
      )}
    />
  );
}
