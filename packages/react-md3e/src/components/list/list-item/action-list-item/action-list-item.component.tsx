'use client';

import { useContext, useId } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { useListActionNavigation } from '../../../../internal/hooks/use-list-action-navigation.hook';
import { ListSelectionContext } from '../../contexts/list-selection.context';
import { ListItemContent } from '../../../list-item-content/list-item-content.component';
import { getListItemLines } from '../../../list-item-content/get-list-item-lines.helper';
import { listItem } from '../list-item.styles';
import { ActionListControl } from './action-list-control/action-list-control.component';
import {
  listActionRow,
  listActionSlot,
  listExpandIcon,
  listExpandPanel,
  listExpandContent,
} from './action-list-item.styles';
import type { ActionListItemProps, ExpandableListItemProps } from '../list-item.types';

export function ActionListItem({
  action,
  expansion,
  leadingAction,
  trailingAction,
  disabled = false,
  disableRipple = false,
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
  ...domProps
}: ActionListItemProps | ExpandableListItemProps) {
  const group = useContext(ListSelectionContext);
  const generatedId = useId();
  const navigationRef = useListActionNavigation();
  const content = { primary, secondary, overline, children, leading, leadingKind, trailing, trailingKind, lines };
  const triggerId = `${domProps.id ?? generatedId}-trigger`;
  const panelId = expansion?.panelProps?.id ?? `${domProps.id ?? generatedId}-panel`;
  const primaryAction = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...action,
    ...(expansion ? { id: triggerId } : {}),
  };

  if (group) {
    throw new TypeError('Action and expandable ListItem rows require a List without selection.');
  }

  const row = (
    <div
      ref={navigationRef}
      className={listActionRow}
      data-md3-list-item-actions=""
      data-lines={getListItemLines(content)}
    >
      {leadingAction != null && (
        <span className={listActionSlot} data-action-position="start" inert={disabled}>
          {leadingAction}
        </span>
      )}
      <ActionListControl
        action={primaryAction}
        expanding={Boolean(expansion)}
        controlsId={expansion ? panelId : undefined}
        disabled={disabled}
        disableRipple={disableRipple}
      >
        <ListItemContent
          {...content}
          indicator={
            expansion ? (
              <span className={listExpandIcon} aria-hidden="true" data-md3-list-expand-icon="">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              </span>
            ) : undefined
          }
        />
      </ActionListControl>
      {trailingAction != null && (
        <span className={listActionSlot} data-action-position="end" inert={disabled}>
          {trailingAction}
        </span>
      )}
    </div>
  );
  const attributes = {
    'className': [listItem, className].filter(Boolean).join(' '),
    'data-md3-list-item': '',
    'data-actionable': 'true',
    'data-divider': divider,
    'data-lines': getListItemLines(content),
    'data-disabled': disabled,
  } as const;

  if (expansion) {
    const { panelProps = {} } = expansion;

    return (
      <Collapsible.Root
        render={<li {...domProps} />}
        {...attributes}
        open={expansion.open}
        defaultOpen={expansion.defaultOpen}
        disabled={disabled}
        data-expandable="true"
        onOpenChange={(open, details) => {
          const prevented = details.event.defaultPrevented;

          if (
            expansion.onOpenChange?.(open, details.event) === false ||
            (!prevented && details.event.defaultPrevented)
          ) {
            details.cancel();
          }
        }}
      >
        {row}
        <Collapsible.Panel
          {...panelProps}
          id={panelId}
          keepMounted={expansion.keepMounted}
          className={[listExpandPanel, panelProps.className].filter(Boolean).join(' ')}
          data-md3-list-expand-panel=""
          render={(props, state) => <div {...props} inert={!state.open} aria-hidden={!state.open || undefined} />}
        >
          <div className={listExpandContent}>{expansion.content}</div>
        </Collapsible.Panel>
      </Collapsible.Root>
    );
  }

  return (
    <li {...domProps} {...attributes}>
      {row}
    </li>
  );
}
