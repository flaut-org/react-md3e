'use client';

import { useEffect, useRef, useState } from 'react';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useInheritedDirection } from '../../internal/hooks/use-inherited-direction.hook';
import { SegmentedButtonContext } from './contexts/segmented-button.context';
import { segmentedButtonRoot } from './segmented-button.styles';
import type { SegmentedButtonProps } from './segmented-button.types';

const toValues = (value: string | readonly string[] | null | undefined): string[] =>
  typeof value === 'string' ? [value] : [...(value ?? [])];

/** Base UI owns roving focus and activation; Material's selection roles are applied by the adapter. */
export function SegmentedButton({
  disabled = false,
  readOnly = false,
  allowEmpty = false,
  fullWidth = false,
  hideSelectionIndicator = false,
  selectedIcon,
  name,
  form,
  className,
  children,
  ...props
}: SegmentedButtonProps) {
  const { selectionMode = 'single', value, defaultValue, onChange, ...domProps } = props;
  const [internalValue, setInternalValue] = useState(() => toValues(defaultValue));
  const formAnchor = useRef<HTMLInputElement>(null);
  const { anchorRef, direction } = useInheritedDirection(domProps.dir);
  const multiple = selectionMode === 'multiple';
  const config = { disabled, readOnly, multiple, hideSelectionIndicator, selectedIcon, name, form };

  useEffect(() => {
    const owner = formAnchor.current?.form;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      // A browser-dispatched event can flush microtasks between listeners. Wait for all vetoes.
      const timer = setTimeout(() => {
        timers.delete(timer);

        if (!event.defaultPrevented && value === undefined) {
          setInternalValue(toValues(defaultValue));
        }
      }, 0);

      timers.add(timer);
    };

    owner?.addEventListener('reset', reset);

    return () => {
      owner?.removeEventListener('reset', reset);

      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, [defaultValue, form, value]);

  if (!domProps['aria-label']?.trim() && !domProps['aria-labelledby']?.trim()) {
    throw new TypeError('SegmentedButton requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <SegmentedButtonContext value={config}>
        <ToggleGroup
          {...domProps}
          role={multiple ? 'group' : 'radiogroup'}
          aria-disabled={disabled || undefined}
          aria-readonly={!multiple && readOnly ? true : undefined}
          className={[segmentedButtonRoot, className].filter(Boolean).join(' ')}
          data-md3-segmented-button=""
          data-full-width={fullWidth}
          data-selection-mode={selectionMode}
          value={value === undefined ? internalValue : toValues(value)}
          multiple={multiple}
          disabled={disabled}
          orientation="horizontal"
          onValueChange={(next, details) => {
            if (readOnly || (!multiple && !allowEmpty && next.length === 0)) {
              details.cancel();
            } else {
              const prevented = details.event.defaultPrevented;
              const cancelled =
                onChange &&
                (props.selectionMode === 'multiple'
                  ? props.onChange?.(details.event, next)
                  : props.onChange?.(details.event, next[0] ?? null));

              if (cancelled === false || (!prevented && details.event.defaultPrevented)) {
                details.cancel();
              } else if (value === undefined) {
                setInternalValue(next);
              }
            }
          }}
        >
          <span hidden ref={anchorRef} />
          {children}
          <input ref={formAnchor} type="hidden" form={form} disabled />
        </ToggleGroup>
      </SegmentedButtonContext>
    </DirectionProvider>
  );
}
