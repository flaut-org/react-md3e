import type { SnackbarProps, SnackbarCloseReason } from '../snackbar.types';

export type SnackbarViewProps = Omit<SnackbarProps, 'onOpenChange' | 'onClose' | 'container'> & {
  readonly host: HTMLElement | null;
  readonly close: (event: Event | null, reason: SnackbarCloseReason) => void;
  readonly timer: { pause: (reason: string) => void; resume: (reason: string) => void };
};
