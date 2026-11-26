import { SelectableListItem } from './selectable-list-item/selectable-list-item.component';
import { StaticListItem } from './static-list-item/static-list-item.component';
import { ActionListItem } from './action-list-item/action-list-item.component';
import type { ListItemProps } from './list-item.types';

export function ListItem(props: ListItemProps) {
  const { value, action, expansion } = props;

  if (action !== undefined || expansion !== undefined) {
    return <ActionListItem {...props} />;
  }

  return value !== undefined ? <SelectableListItem {...props} /> : <StaticListItem {...props} />;
}
