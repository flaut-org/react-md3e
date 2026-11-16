'use client';

import { useContext } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { useRipple } from '../../../../internal/hooks/use-ripple.hook';
import { rippleSurface } from '../../../../internal/ripple/ripple.styles';
import { ListSelectionContext } from '../../contexts/list-selection.context';
import { ListItemContent } from '../../../list-item-content/list-item-content.component';
import { getListItemLines } from '../../../list-item-content/get-list-item-lines.helper';
import { listItem } from '../list-item.styles';
import { listControl } from './selectable-list-item.styles';
import { SelectionIndicator } from '../../../selection-indicator/selection-indicator.component';
import type { SelectableListItemProps } from '../list-item.types';

export function SelectableListItem({
  value,
  disabled = false,
  readOnly = false,
  disableRipple = false,
  textValue,
  primary,
  secondary,
  overline,
  children,
  leading,
  leadingKind,
  trailing,
  trailingKind,
  lines,
  divider = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SelectableListItemProps) {
  const group = useContext(ListSelectionContext);
  const isDisabled = disabled || Boolean(group?.disabled);
  const isReadOnly = readOnly || Boolean(group?.readOnly);
  const { ref: rippleRef, handlers } = useRipple(isDisabled || isReadOnly || disableRipple);
  const content = { primary, secondary, overline, children, leading, leadingKind, trailing, trailingKind, lines };
  const label = primary ?? children;
  const searchLabel = textValue ?? (typeof label === 'string' || typeof label === 'number' ? String(label) : undefined);

  if (!value.trim()) {
    throw new TypeError('A selectable ListItem requires a non-empty, stable value.');
  }

  if (!group) {
    throw new TypeError('A ListItem with value must be inside a single- or multiple-selection List.');
  }

  return (
    <li
      {...props}
      role="presentation"
      className={[listItem, className].filter(Boolean).join(' ')}
      data-md3-list-item=""
      data-divider={divider}
      data-selectable="true"
      data-lines={getListItemLines(content)}
      data-disabled={isDisabled}
      data-readonly={isReadOnly}
    >
      <Toggle
        {...handlers}
        value={value}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={isDisabled}
        onPressedChange={(_pressed, details) => {
          if (isReadOnly) {
            details.cancel();
          }
        }}
        className={listControl}
        render={(controlProps, state) => (
          <button
            {...controlProps}
            type="button"
            role="option"
            aria-pressed={undefined}
            aria-selected={state.pressed}
            aria-disabled={state.disabled || (readOnly && !group.readOnly) || undefined}
            data-md3-list-item-control=""
            data-text-value={searchLabel}
          >
            <span ref={rippleRef} className={rippleSurface} aria-hidden="true" />
            <ListItemContent
              {...content}
              controlPosition={group.controlPosition}
              indicator={<SelectionIndicator variant={group.indicator} checked={state.pressed} disabled={isDisabled} />}
            />
          </button>
        )}
      />
    </li>
  );
}
