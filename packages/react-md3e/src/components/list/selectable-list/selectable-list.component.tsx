'use client';

import { useMemo } from 'react';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { useListEntryFocus } from '../../../internal/hooks/use-list-entry-focus.hook';
import { useListTypeahead } from '../../../internal/hooks/use-list-typeahead.hook';
import { ListSelectionContext } from '../contexts/list-selection.context';
import { listRoot } from '../list.styles';
import type { SelectableListProps } from '../list.types';

const toValues = (selection: string | readonly string[] | null | undefined) =>
  typeof selection === 'string' ? [selection] : (selection ?? []);

export function SelectableList({
  variant = 'segmented',
  disablePadding = false,
  disabled = false,
  readOnly = false,
  controlPosition = 'end',
  selectionIndicator,
  className,
  ref,
  ...props
}: SelectableListProps) {
  const { selectionMode, value, defaultValue, onValueChange, ...domProps } = props;
  const multiple = selectionMode === 'multiple';
  const typeahead = useListTypeahead();
  const { ref: entryRef, onBlur: handleBlur } = useListEntryFocus(ref);
  const config = useMemo(
    () => ({ disabled, readOnly, controlPosition, indicator: selectionIndicator ?? (multiple ? 'checkbox' : 'radio') }),
    [disabled, readOnly, controlPosition, selectionIndicator, multiple],
  );
  const selected = value === undefined ? undefined : toValues(value);
  const initial = toValues(defaultValue);
  const handleValueChange = (next: string[], details: ToggleGroup.ChangeEventDetails) => {
    if (readOnly || (!multiple && next.length === 0)) {
      details.cancel();
    } else if (selectionMode === 'multiple') {
      onValueChange?.(next);
    } else if (next[0] !== undefined) {
      onValueChange?.(next[0]);
    }
  };

  if (!domProps['aria-label']?.trim() && !domProps['aria-labelledby']?.trim()) {
    throw new TypeError('A selectable List requires a non-empty aria-label or aria-labelledby.');
  }

  return (
    <ListSelectionContext value={config}>
      <ToggleGroup
        onKeyDown={typeahead}
        onBlur={handleBlur}
        render={<ul {...domProps} ref={entryRef} />}
        value={selected}
        defaultValue={initial}
        onValueChange={handleValueChange}
        disabled={disabled}
        multiple={multiple}
        orientation="vertical"
        role="listbox"
        aria-disabled={disabled || undefined}
        aria-orientation="vertical"
        aria-multiselectable={multiple || undefined}
        aria-readonly={readOnly || undefined}
        className={[listRoot, className].filter(Boolean).join(' ')}
        data-md3-list=""
        data-variant={variant}
        data-selection-mode={selectionMode}
        data-disable-padding={disablePadding}
      />
    </ListSelectionContext>
  );
}
