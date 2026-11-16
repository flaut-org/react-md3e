import { createRef } from 'react';
import { SideSheet } from '@flaut-travel/react-md3e/side-sheet';

export const panel = (
  <SideSheet
    aria-label="Options"
    ref={createRef<HTMLDivElement>()}
    initialFocus={createRef<HTMLInputElement>()}
    onClose={(_event, reason) => (reason === 'escapeKeyDown' ? false : undefined)}
  >
    Options
  </SideSheet>
);
export const inline = <SideSheet aria-labelledby="title" variant="standard" defaultOpen />;
// @ts-expect-error Sheets require an accessible name.
export const unnamed = <SideSheet />;
// @ts-expect-error Panel refs refer to div elements.
export const invalid = <SideSheet aria-label="Options" ref={createRef<HTMLButtonElement>()} />;
