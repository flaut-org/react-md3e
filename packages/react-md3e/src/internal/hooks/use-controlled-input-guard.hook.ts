import { useRef } from 'react';

/** A close-animation cleanup must not overwrite a newer value supplied by the consumer. */
export function useControlledInputGuard(value: string | undefined, open: boolean) {
  const acceptedValue = useRef(value);

  return {
    isStaleReset(cleanup: boolean) {
      return cleanup && !open && value !== undefined && value !== acceptedValue.current;
    },
    accept(next: string) {
      acceptedValue.current = next;
    },
  };
}
