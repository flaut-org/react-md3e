import { Children, Fragment, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

/** RSC may already have resolved passive FabMenuItem wrappers to Menu's client controls. */
export function fabMenuItems(children: ReactNode): ReactElement[] {
  const items: ReactElement[] = [];

  Children.toArray(children).forEach((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) {
      throw new TypeError('FabMenu children must be FabMenuItem elements.');
    }

    if (child.type === Fragment) {
      items.push(
        ...fabMenuItems(child.props.children).map((item) => cloneElement(item, { key: `${child.key}/${item.key}` })),
      );
    } else {
      items.push(child);
    }
  });

  return items;
}

export function indexFabMenuItems(items: readonly ReactElement[]) {
  return items.map((item, index) =>
    cloneElement(item as ReactElement<{ 'data-fab-index'?: number }>, {
      'key': item.key ?? index,
      'data-fab-index': index,
    }),
  );
}
