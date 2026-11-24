import { createRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { NavigationBar, NavigationItem } from '@flaut-travel/react-md3e/navigation-bar';
import type { NavigationValue, NavigationItemProps } from '@flaut-travel/react-md3e';

function RouterLink({ children, ...props }: ComponentPropsWithRef<'a'>) {
  return <a {...props}>{children}</a>;
}

export const navigationTypes = (
  <NavigationBar
    aria-label="Primary"
    defaultValue={0}
    ref={createRef<HTMLElement>()}
    onChange={(event, value: NavigationValue) => {
      event.preventDefault();

      return value !== 'locked';
    }}
  >
    <NavigationItem value={0} ref={createRef<HTMLButtonElement>()} label="Home" />
    <NavigationItem href="/saved" ref={createRef<HTMLAnchorElement>()} selected>
      Saved
    </NavigationItem>
    <NavigationItem component={RouterLink} href="/account" value="account">
      Account
    </NavigationItem>
  </NavigationBar>
);

// @ts-expect-error A navigation landmark requires a name.
export const missingNavigationName = <NavigationBar />;
// @ts-expect-error Item-level selection and group value must not compete.
export const ambiguousNavigationItem: NavigationItemProps = { selected: true, value: 'home' };
// @ts-expect-error Buttons remain navigation actions, not form submitters.
export const submitNavigationItem = <NavigationItem type="submit">Home</NavigationItem>;
// @ts-expect-error Do not silently alias legacy BottomNavigation variants.
export const legacyNavigationVariant = <NavigationBar aria-label="Primary" variant="contained" />;
