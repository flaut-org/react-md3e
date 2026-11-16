import { createRef } from 'react';
import { IconButton } from '@flaut-org/react-md3e';
import type { IconButtonProps } from '@flaut-org/react-md3e';

export const named = (
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

export const labelled = (
  <IconButton aria-labelledby="save-label">
    <svg />
  </IconButton>
);

// @ts-expect-error An icon-only control requires an accessible name.
export const unnamed: IconButtonProps = { children: '★' };

// @ts-expect-error MD2 appearances are not accepted.
export const obsoleteIcon: IconButtonProps = { 'aria-label': 'Save', 'variant': 'contained', 'children': '★' };
