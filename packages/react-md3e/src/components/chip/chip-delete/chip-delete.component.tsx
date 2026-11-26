'use client';

import type { SyntheticEvent } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { ChipControl } from '../chip-control/chip-control.component';
import { chipDelete, chipGlyph } from '../chip.styles';
import type { ChipProps } from '../chip.types';

export function deleteChip(event: SyntheticEvent<HTMLElement>, onDelete: ChipProps['onDelete']) {
  const root = event.currentTarget.closest('[data-md3-chip]');
  const set = root?.closest<HTMLElement>('[data-md3-chip-set]');
  const chips = set ? [...set.querySelectorAll<HTMLElement>('[data-md3-chip]')] : [];
  const index = root ? chips.indexOf(root as HTMLElement) : -1;
  const neighbors = [...chips.slice(index + 1), ...chips.slice(0, index).reverse()];

  onDelete?.(event);

  if (set && root && !event.defaultPrevented && onDelete) {
    queueMicrotask(() => {
      if (!root.isConnected) {
        const target = neighbors
          .filter((chip) => chip.isConnected)
          .map((chip) => chip.querySelector<HTMLElement>('button:not(:disabled):not([aria-disabled="true"]), a[href]'))
          .find(Boolean);

        if (target) {
          target.focus();
        } else {
          set.tabIndex = -1;
          set.focus();
        }
      }
    });
  }
}

export function ChipDelete({
  label,
  deleteLabel,
  deleteIcon,
  onDelete,
  slots,
  slotProps,
  disabled,
  disableRipple,
}: ChipProps) {
  return (
    <ChipControl
      {...mergeProps<'button'>(
        {
          onClick(event) {
            if (!event.defaultPrevented) {
              event.stopPropagation();
              deleteChip(event, onDelete);
            }
          },
          onKeyDown(event) {
            if (!event.defaultPrevented && onDelete && (event.key === 'Delete' || event.key === 'Backspace')) {
              event.stopPropagation();
              deleteChip(event, onDelete);
              event.preventDefault();
            }
          },
        },
        slotProps?.deleteButton ?? {},
      )}
      className={[chipDelete, slotProps?.deleteButton?.className].filter(Boolean).join(' ')}
      type="button"
      iconButton
      control={slots?.deleteButton}
      disabled={disabled}
      disableRipple={disableRipple}
      aria-label={deleteLabel ?? slotProps?.deleteButton?.['aria-label'] ?? `Remove ${label as string}`}
      data-md3-chip-delete=""
    >
      <span className={chipGlyph} aria-hidden="true">
        {deleteIcon ?? (
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </span>
    </ChipControl>
  );
}
