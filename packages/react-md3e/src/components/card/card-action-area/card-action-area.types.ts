import type { ComponentPropsWithRef } from 'react';

interface Common {
  readonly disabled?: boolean;
  readonly disableRipple?: boolean;
}
export type CardActionAreaProps = Common &
  (
    | (ComponentPropsWithRef<'button'> & { readonly href?: undefined })
    | (Omit<ComponentPropsWithRef<'a'>, 'href'> & { readonly href: string })
  );
