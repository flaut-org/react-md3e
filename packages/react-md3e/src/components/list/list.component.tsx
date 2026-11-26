import { SelectableList } from './selectable-list/selectable-list.component';
import { StaticList } from './static-list/static-list.component';
import type { ListProps } from './list.types';

/** Static layout stays on the server; interaction belongs to selectable lists or individual action rows. */
export function List(props: ListProps) {
  const { selectionMode } = props;

  return selectionMode === 'single' || selectionMode === 'multiple' ? (
    <SelectableList {...props} />
  ) : (
    <StaticList {...props} />
  );
}
