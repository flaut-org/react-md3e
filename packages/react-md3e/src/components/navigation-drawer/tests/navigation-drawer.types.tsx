import { createRef } from 'react';
import { NavigationDrawer, NavigationItem } from '@flaut-travel/react-md3e/navigation-drawer';

export const drawerType = (
  <NavigationDrawer
    aria-labelledby="navigation-title"
    variant="standard"
    ref={createRef<HTMLElement>()}
    header={<h2 id="navigation-title">Mail</h2>}
    defaultValue="inbox"
  >
    <NavigationItem value="inbox" badge="24">
      Inbox
    </NavigationItem>
  </NavigationDrawer>
);
export const modalDrawerType = (
  <NavigationDrawer
    aria-label="Mail"
    defaultOpen
    initialFocus={createRef<HTMLButtonElement>()}
    onOpenChange={(_open, event) => !event.defaultPrevented}
  />
);
// @ts-expect-error Anchors are logical start-edge navigation, not supplementary side sheets.
export const wrongDrawerAnchor = <NavigationDrawer aria-label="Mail" anchor="end" />;
