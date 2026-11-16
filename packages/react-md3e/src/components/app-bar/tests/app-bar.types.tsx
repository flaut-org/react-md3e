import { createRef } from 'react';
import { AppBar, IconButton } from '@flaut-org/react-md3e';

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
