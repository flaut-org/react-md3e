'use client';

import { ToggleGroup } from '@base-ui/react/toggle-group';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { ButtonGroupContext } from './contexts/button-group.context';
import { buttonGroupRoot } from './button-group.styles';
import type { ButtonGroupProps } from './button-group.types';

const values = (value: string | readonly string[] | null | undefined) =>
  typeof value === 'string' ? [value] : (value ?? []);

export function ButtonGroup({
  variant = 'connected',
  size = 'small',
  buttonVariant = 'tonal',
  disabled = false,
  allowEmpty = false,
  fullWidth = false,
  orientation = 'horizontal',
  className,
  ...props
}: ButtonGroupProps) {
  const { selectionMode = 'single', value, defaultValue, onChange, ...domProps } = props;
  const { anchorRef, direction } = useInheritedDirection(domProps.dir);
  const config = { size, variant: buttonVariant, disabled, selectionMode };
  const attributes = {
    'className': [buttonGroupRoot, className].filter(Boolean).join(' '),
    'data-md3-button-group': '',
    'data-group-variant': variant,
    'data-orientation': orientation,
    'data-full-width': fullWidth,
  } as const;

  if (!domProps['aria-label']?.trim() && !domProps['aria-labelledby']?.trim()) {
    throw new TypeError('ButtonGroup requires an accessible name.');
  }

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <span hidden ref={anchorRef} />
      <ButtonGroupContext value={config}>
        {selectionMode === 'none' ? (
          <div {...domProps} {...attributes} role="group" />
        ) : (
          <ToggleGroup
            {...domProps}
            {...attributes}
            value={value === undefined ? undefined : values(value)}
            defaultValue={values(defaultValue)}
            multiple={selectionMode === 'multiple'}
            disabled={disabled}
            orientation={orientation}
            onValueChange={(next, details) => {
              if (!allowEmpty && selectionMode === 'single' && next.length === 0) {
                details.cancel();
              } else {
                const prevented = details.event.defaultPrevented;
                let cancelled = false;

                if (onChange) {
                  if (props.selectionMode === 'multiple') {
                    cancelled = props.onChange?.(details.event, next) === false;
                  } else {
                    cancelled = props.onChange?.(details.event, next[0] ?? null) === false;
                  }
                }

                if (cancelled || (!prevented && details.event.defaultPrevented)) {
                  details.cancel();
                }
              }
            }}
          />
        )}
      </ButtonGroupContext>
    </DirectionProvider>
  );
}
