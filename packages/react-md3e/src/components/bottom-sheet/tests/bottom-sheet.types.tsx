import { createRef } from 'react';
import { BottomSheet } from '@flaut-org/react-md3e/bottom-sheet';

export const panel = (
  <BottomSheet
    aria-label="Options"
    ref={createRef<HTMLDivElement>()}
    initialFocus={createRef<HTMLInputElement>()}
    onClose={(_event, reason) => (reason === 'escapeKeyDown' ? false : undefined)}
  >
    Options
  </BottomSheet>
);
export const inline = <BottomSheet aria-labelledby="title" variant="standard" defaultOpen />;
// @ts-expect-error Sheets require an accessible name.
export const unnamed = <BottomSheet />;
// @ts-expect-error Panel refs refer to div elements.
export const invalid = <BottomSheet aria-label="Options" ref={createRef<HTMLButtonElement>()} />;
