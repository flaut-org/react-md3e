import { createRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@flaut-travel/react-md3e';
import type { DialogProps, DialogCloseReason } from '@flaut-travel/react-md3e';

const popup = createRef<HTMLDivElement>();

export const valid = (
  <Dialog
    open
    fullScreen
    fullWidth
    scroll="body"
    keepMounted
    initialFocus={popup}
    finalFocus={false}
    container={() => document.body}
    ref={popup}
    onClose={(event, reason) => {
      const typed: DialogCloseReason = reason;

      event.preventDefault();

      return typed;
    }}
  >
    <DialogTitle icon={<svg />} ref={createRef<HTMLHeadingElement>()}>
      Save changes?
    </DialogTitle>
    <DialogContent dividers ref={createRef<HTMLDivElement>()}>
      <DialogContentText ref={createRef<HTMLParagraphElement>()}>Review your collection.</DialogContentText>
    </DialogContent>
    <DialogActions stacked ref={createRef<HTMLDivElement>()}>
      <Button>Save</Button>
    </DialogActions>
  </Dialog>
);
// @ts-expect-error Open state is deliberately controlled.
export const missingState: DialogProps = {};
// @ts-expect-error Scroll values follow the public composition contract.
export const invalidScroll: DialogProps = { open: true, scroll: 'viewport' };
// @ts-expect-error Arbitrary ARIA roles are not valid modal roles.
export const invalidRole: DialogProps = { open: true, role: 'menu' };
// @ts-expect-error Base UI event details do not leak into our close callback.
export const invalidReason: DialogCloseReason = 'outside-press';
