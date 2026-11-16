import { SelectableListItem } from './selectable-list-item/selectable-list-item.component';
import { StaticListItem } from './static-list-item/static-list-item.component';
import type { ListItemProps } from './list-item.types';

export function ListItem(props: ListItemProps) {
  const { value } = props;

  return value !== undefined ? <SelectableListItem {...props} /> : <StaticListItem {...props} />;
}
