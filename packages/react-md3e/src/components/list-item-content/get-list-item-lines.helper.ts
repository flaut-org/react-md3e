import type { ListItemContentProps } from './list-item-content.types';

export function getListItemLines({ lines, secondary, overline }: ListItemContentProps) {
  let inferred: 1 | 2 | 3 = 1;

  if (secondary != null || overline != null) {
    inferred = 2;
  }

  if (secondary != null && overline != null) {
    inferred = 3;
  }

  return lines ?? inferred;
}
