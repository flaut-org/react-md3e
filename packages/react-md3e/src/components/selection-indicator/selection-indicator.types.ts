export interface SelectionIndicatorProps {
  readonly variant: 'checkbox' | 'radio' | 'checkmark';
  readonly checked: boolean;
  readonly indeterminate?: boolean;
  readonly disabled?: boolean;
  readonly error?: boolean;
}
