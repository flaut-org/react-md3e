'use client';

import { Toolbar } from '@base-ui/react/toolbar';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { mergeProps } from '@base-ui/react/merge-props';
import { useInheritedDirection } from '../../../internal/hooks/use-inherited-direction.hook';
import { ChipSetContext } from '../contexts/chip-set.context';
import { chipSet } from '../chip.styles';
import type { ChipSetProps } from '../chip.types';

export function ChipSet({ className, children, dir, disabled = false, ...props }: ChipSetProps) {
  const { anchorRef, direction } = useInheritedDirection(dir);

  if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) {
    throw new TypeError('ChipSet requires a non-empty aria-label or aria-labelledby.');
  }

  const rootProps = mergeProps<'div'>(
    {
      onKeyDown(event) {
        if (!event.defaultPrevented && (event.key === 'Home' || event.key === 'End')) {
          const controls = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
              '[data-md3-chip-action], [data-md3-chip-delete]',
            ),
          ].filter(
            (control) =>
              !control.disabled &&
              control.getAttribute('aria-disabled') !== 'true' &&
              control.closest('[data-md3-chip-set]') === event.currentTarget,
          );
          const target = event.key === 'Home' ? controls[0] : controls.at(-1);

          if (target) {
            event.preventDefault();
            target.focus();
          }
        }
      },
    },
    props,
  );

  return (
    <DirectionProvider direction={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <ChipSetContext value={{ disabled }}>
        <Toolbar.Root
          {...rootProps}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          dir={dir}
          className={[chipSet, className].filter(Boolean).join(' ')}
          data-md3-chip-set=""
        >
          <span hidden ref={anchorRef} />
          {children}
        </Toolbar.Root>
      </ChipSetContext>
    </DirectionProvider>
  );
}
