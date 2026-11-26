'use client';

import { useState } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { ChipControl } from '../chip-control/chip-control.component';
import { ChipDelete, deleteChip } from '../chip-delete/chip-delete.component';
import { ChipContent } from '../chip-content/chip-content.component';
import { chipAction } from '../chip.styles';
import { chipRootProps } from '../chip-root-props';
import type { ChipProps } from '../chip.types';

export function ChipInteractive(props: ChipProps) {
  const {
    kind,
    'selected': controlled,
    defaultSelected,
    onSelectedChange,
    onClick,
    disabled = false,
    disableRipple,
    onDelete,
    removable = Boolean(onDelete),
    slotProps,
    type,
    name,
    value,
    form,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  } = props;
  const [internal, setInternal] = useState(defaultSelected ?? false);
  const selected = controlled ?? internal;
  const selectable =
    kind === 'filter' ||
    (kind === 'input' && (controlled !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined));

  return (
    <div {...chipRootProps(props, selected)}>
      <ChipControl
        {...mergeProps<'button'>(
          {
            onKeyDown(event) {
              if (
                !event.defaultPrevented &&
                removable &&
                onDelete &&
                (event.key === 'Backspace' || event.key === 'Delete')
              ) {
                deleteChip(event, onDelete);
                event.preventDefault();
                event.stopPropagation();
              }
            },
          },
          slotProps?.action ?? {},
          onClick ? { onClick } : {},
        )}
        className={[chipAction, slotProps?.action?.className].filter(Boolean).join(' ')}
        data-md3-chip-action=""
        type={type ?? 'button'}
        name={name}
        value={value}
        form={form}
        disabled={disabled}
        disableRipple={disableRipple}
        aria-label={ariaLabel ?? slotProps?.action?.['aria-label']}
        aria-labelledby={ariaLabelledBy ?? slotProps?.action?.['aria-labelledby']}
        pressed={selectable ? selected : undefined}
        onPressedChange={(next, details) => {
          const prevented = details.event.defaultPrevented;
          const result = onSelectedChange?.(details.event, next);

          if (result === false || (!prevented && details.event.defaultPrevented)) {
            details.cancel();
          } else if (controlled === undefined) {
            setInternal(next);
          }
        }}
      >
        <ChipContent {...props} />
      </ChipControl>
      {removable && <ChipDelete {...props} />}
    </div>
  );
}
