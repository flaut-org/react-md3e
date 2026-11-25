import { createRef } from 'react';
import { AppBar, IconButton, Search } from '@flaut-travel/react-md3e';
import { AppBar as StandaloneAppBar } from '@flaut-travel/react-md3e/app-bar';
import type { AppBarScrollBehavior, AppBarScrollTarget, AppBarVariant } from '@flaut-travel/react-md3e/app-bar';

const named = (
  <IconButton
    aria-label="Save"
    variant="standard"
    width="wide"
    size="extraSmall"
    selected={false}
    ref={createRef<HTMLButtonElement>()}
  >
    <svg />
  </IconButton>
);

export const bar = (
  <AppBar
    title={<h1>Library</h1>}
    subtitle="Saved"
    variant="mediumFlexible"
    titleAlign="center"
    position="sticky"
    scrolled
    ref={createRef<HTMLElement>()}
    actions={named}
  />
);

// @ts-expect-error Flexible MD3 Expressive variants replace the older medium/large variants.
export const obsoleteBar = <AppBar variant="medium" />;

export const searchVariant: AppBarVariant = 'search';
export const searchBar = (
  <StandaloneAppBar
    variant={searchVariant}
    position="sticky"
    titleAlign="center"
    navigationIcon={named}
    actions={named}
    ref={createRef<HTMLElement>()}
  >
    <Search
      label="Search collection"
      leading={null}
      value="query"
      onChange={(_event, value) => value}
      layout="auto"
      name="q"
    >
      <a href="/results">Search result</a>
    </Search>
  </StandaloneAppBar>
);

export const scrollMode: AppBarScrollBehavior = 'exitUntilCollapsed';
export const scrollTarget: AppBarScrollTarget = () => document.getElementById('scroll-container');
export const scrollBar = (
  <AppBar variant="largeFlexible" scrollBehavior={scrollMode} scrollTarget={scrollTarget} title={<h1>Collection</h1>} />
);
export const noScrollBar = <AppBar scrollBehavior="none" scrolled={false} />;
export const quickReturn = <StandaloneAppBar scrollBehavior="enterAlways" />;
export const pinned = <StandaloneAppBar scrollBehavior="pinned" />;
// @ts-expect-error Scroll behaviors use Material names, not arbitrary CSS scroll behavior values.
export const invalidScroll = <AppBar scrollBehavior="smooth" />;
// @ts-expect-error A scroll target must be a scrollable element/window or a client resolver.
export const invalidTarget = <AppBar scrollBehavior="pinned" scrollTarget="#scroll-container" />;
