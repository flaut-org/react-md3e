import { ChipContent } from './chip-content/chip-content.component';
import { ChipDelete } from './chip-delete/chip-delete.component';
import { ChipInteractive } from './chip-interactive/chip-interactive.component';
import { chipRootProps, validateChip } from './chip-root-props';
import { chipAction } from './chip.styles';
import type { ChipProps } from './chip.types';

/** Passive input tokens stay on the server. Actions and selection delegate to client primitives. */
export function Chip(props: ChipProps) {
  const { kind, readOnly, onClick, selected, defaultSelected, onSelectedChange, removable, onDelete, slotProps, type } =
    props;
  const primaryAction =
    onClick ||
    slotProps?.action ||
    (type && type !== 'button') ||
    selected !== undefined ||
    defaultSelected !== undefined ||
    onSelectedChange;

  validateChip(props);

  if (kind === 'input' && (readOnly || !primaryAction)) {
    return (
      <div {...chipRootProps(props)}>
        <span className={chipAction} data-md3-chip-passive="">
          <ChipContent {...props} />
        </span>
        {!readOnly && (removable ?? Boolean(onDelete)) && <ChipDelete {...props} />}
      </div>
    );
  }

  return <ChipInteractive {...props} />;
}
