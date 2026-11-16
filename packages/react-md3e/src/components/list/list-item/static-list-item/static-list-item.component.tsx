import { ListItemContent } from '../../../list-item-content/list-item-content.component';
import { getListItemLines } from '../../../list-item-content/get-list-item-lines.helper';
import { listItem } from '../list-item.styles';
import type { StaticListItemProps } from '../list-item.types';

export function StaticListItem(props: StaticListItemProps) {
  const {
    primary,
    secondary,
    overline,
    children,
    leading,
    leadingKind,
    trailing,
    trailingKind,
    lines,
    divider = false,
    className,
    ...domProps
  } = props;
  const content = { primary, secondary, overline, children, leading, leadingKind, trailing, trailingKind, lines };

  return (
    <li
      {...domProps}
      className={[listItem, className].filter(Boolean).join(' ')}
      data-md3-list-item=""
      data-divider={divider}
      data-lines={getListItemLines(content)}
      data-selectable="false"
    >
      <ListItemContent {...content} />
    </li>
  );
}
