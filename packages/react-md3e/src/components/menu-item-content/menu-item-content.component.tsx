import { ListItemContent } from '../list-item-content/list-item-content.component';
import { SelectionIndicator } from '../selection-indicator/selection-indicator.component';
import { menuTrailing } from './menu-item-content.styles';
import type { MenuItemContentProps } from './menu-item-content.types';

export function MenuItemContent({
  children,
  leading,
  trailing,
  supportingText,
  checked = false,
  labelId,
  descriptionId,
}: MenuItemContentProps & { readonly checked?: boolean; readonly labelId?: string; readonly descriptionId?: string }) {
  return (
    <ListItemContent
      primary={<span id={labelId}>{children}</span>}
      secondary={supportingText != null ? <span id={descriptionId}>{supportingText}</span> : undefined}
      leading={checked ? <SelectionIndicator variant="checkmark" checked /> : leading}
      trailing={trailing != null ? <span className={menuTrailing}>{trailing}</span> : undefined}
    />
  );
}
