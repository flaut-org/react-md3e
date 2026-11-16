import { Snackbar } from '@flaut-travel/react-md3e/snackbar';

export const notice = (
  <Snackbar
    message="Saved"
    autoHideDuration={6000}
    priority="polite"
    onClose={(_event, reason) => reason !== 'timeout'}
    action={<button type="button">Undo</button>}
  />
);
// @ts-expect-error Messages are required.
export const invalid = <Snackbar open />;
// @ts-expect-error Supported anchor axes are explicit.
export const invalidAnchor = <Snackbar message="Saved" anchorOrigin={{ vertical: 'middle', horizontal: 'left' }} />;
