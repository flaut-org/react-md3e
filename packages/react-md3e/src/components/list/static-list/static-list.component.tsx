import { listRoot } from '../list.styles';
import type { ReadOnlyListProps } from '../list.types';

export function StaticList(props: ReadOnlyListProps) {
  const { selectionMode = 'none', variant = 'segmented', disablePadding = false, className, ...domProps } = props;

  return (
    <ul
      {...domProps}
      className={[listRoot, className].filter(Boolean).join(' ')}
      data-md3-list=""
      data-variant={variant}
      data-selection-mode={selectionMode}
      data-disable-padding={disablePadding}
    />
  );
}
