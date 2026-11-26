import type { ListItemProps } from '@flaut-travel/react-md3e';

// @ts-expect-error Individual disabled state requires an interactive value.
export const disabledStatic: ListItemProps = { primary: 'Static', disabled: true };

// @ts-expect-error Selected state comes from the parent value.
export const contradictoryState: ListItemProps = { value: 'en', selected: true };

export const buttonAction: ListItemProps = {
  primary: 'Open',
  action: { onClick: (event) => event.currentTarget.focus() },
};
export const linkAction: ListItemProps = {
  primary: 'Visit',
  action: { href: '/journey', target: '_blank', onClick: (event) => event.currentTarget.href },
};
export const expansion: ListItemProps = {
  primary: 'Folder',
  expansion: {
    content: 'Details',
    defaultOpen: true,
    onOpenChange: (open, event) => {
      event.preventDefault();

      return open;
    },
  },
};

// @ts-expect-error A primary action is incompatible with row selection.
export const actionSelection: ListItemProps = { value: 'en', action: {} };

// @ts-expect-error Expansion owns the primary action.
export const expansionAction: ListItemProps = { expansion: { content: 'Details' }, action: { href: '/' } };

// @ts-expect-error Supplemental actions are not supported inside selectable options.
export const selectionActions: ListItemProps = { value: 'en', trailingAction: 'Control' };

// @ts-expect-error Expanding is not a selection state.
export const expansionSelection: ListItemProps = { value: 'en', expansion: { content: 'Details' } };

// @ts-expect-error A link cannot receive a native button-only prop.
export const invalidActionLink: ListItemProps = { action: { href: '/', formAction: '/submit' } };

// @ts-expect-error Persistent pressed selection does not belong to primary list actions.
export const selectedAction: ListItemProps = { action: { 'aria-pressed': true } };
