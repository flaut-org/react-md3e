import { selectionIndicator } from './selection-indicator.styles';
import type { SelectionIndicatorProps } from './selection-indicator.types';

/** Shared presentation only. The owning form control or list option supplies semantics. */
export function SelectionIndicator({
  variant,
  checked,
  indeterminate = false,
  disabled = false,
  error = false,
}: SelectionIndicatorProps) {
  return (
    <span
      className={selectionIndicator}
      data-indicator={variant}
      data-selected={checked || indeterminate}
      data-mixed={indeterminate}
      data-disabled={disabled}
      data-error={error}
      aria-hidden="true"
    >
      {variant !== 'radio' && (
        <svg viewBox="0 0 24 24" focusable="false">
          <path d={indeterminate ? 'M5 12h14' : 'm5 12 4 4L19 6'} />
        </svg>
      )}
    </span>
  );
}
