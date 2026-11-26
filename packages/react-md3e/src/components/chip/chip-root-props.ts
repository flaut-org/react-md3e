import { chipRoot } from './chip.styles';
import type { ChipProps } from './chip.types';

/** Shared static attributes; selection and deletion behavior belong to the interaction parts. */
export function chipRootProps(props: ChipProps, selected = props.selected ?? props.defaultSelected ?? false) {
  const {
    kind,
    label,
    icon,
    trailingIcon,
    avatar,
    variant = 'outlined',
    shape = 'standard',
    disabled = false,
    dragged = false,
    readOnly = false,
    disableRipple,
    onClick,
    'selected': controlledSelected,
    defaultSelected,
    onSelectedChange,
    selectedIcon,
    onDelete,
    removable = Boolean(onDelete),
    deleteIcon,
    deleteLabel,
    slots,
    slotProps,
    type,
    name,
    value,
    form,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rootProps
  } = props;

  return {
    ...rootProps,
    'className': [chipRoot, className].filter(Boolean).join(' '),
    'data-md3-chip': '',
    'data-kind': kind,
    'data-variant': variant,
    'data-shape': shape,
    'data-selected': selected,
    'data-disabled': disabled,
    'data-dragged': dragged,
    'data-read-only': readOnly,
    'data-removable': removable && !readOnly,
    'data-avatar': avatar != null,
    'data-leading-icon': icon != null || avatar != null,
    'data-trailing-icon': trailingIcon != null,
    'role': rootProps.role ?? (kind === 'input' || removable ? 'group' : undefined),
    'aria-label':
      kind === 'input' || removable ? (ariaLabel ?? (typeof label === 'string' ? label : undefined)) : undefined,
    'aria-labelledby': kind === 'input' || removable ? ariaLabelledBy : undefined,
    'aria-disabled': disabled || undefined,
  };
}

export function validateChip(props: ChipProps) {
  if (!['assist', 'filter', 'input', 'suggestion'].includes(props.kind)) {
    throw new TypeError('Chip kind must be assist, filter, input or suggestion.');
  }

  if (props.variant !== undefined && !['outlined', 'elevated'].includes(props.variant)) {
    throw new TypeError('Chip variant must be outlined or elevated.');
  }

  if (props.kind === 'input' && props.variant === ('elevated' as string)) {
    throw new TypeError('MD3 input chips do not have an elevated variant.');
  }

  if (
    (props.kind === 'input' || props.kind === 'filter') &&
    ((props.type && props.type !== ('button' as string)) ||
      props.name !== undefined ||
      props.value !== undefined ||
      props.form !== undefined)
  ) {
    throw new TypeError(
      'Native form actions belong to assist and suggestion chips. Serialize input/filter values in application-owned fields.',
    );
  }

  if (props.shape !== undefined && !['standard', 'expressive'].includes(props.shape)) {
    throw new TypeError('Chip shape must be standard or expressive.');
  }

  if (props.kind === 'assist' || props.kind === 'suggestion') {
    if (
      props.selected !== undefined ||
      props.defaultSelected !== undefined ||
      props.onSelectedChange !== undefined ||
      props.shape === ('expressive' as string)
    ) {
      throw new TypeError('Selection and Expressive state shapes belong to filter and input chips.');
    }
  }

  if (
    (props.removable ?? Boolean(props.onDelete)) &&
    !props.readOnly &&
    !props.deleteLabel &&
    typeof props.label !== 'string'
  ) {
    throw new TypeError('Removable chips with a complex label require deleteLabel.');
  }
}
