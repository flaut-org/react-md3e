import { ExtendedFab } from '@flaut-travel/react-md3e';
import { ExtendedFab as StandaloneExtendedFab } from '@flaut-travel/react-md3e/extended-fab';

export const button = (
  <ExtendedFab type="submit" startIcon="+" size="large" color="secondary" ref={(element) => element?.focus()}>
    Compose
  </ExtendedFab>
);
export const link = (
  <StandaloneExtendedFab href="/compose" target="_blank" ref={(element) => element?.focus()}>
    Compose
  </StandaloneExtendedFab>
);
export const collapsed = (
  <ExtendedFab extended={false} startIcon="+">
    Compose
  </ExtendedFab>
);
// @ts-expect-error A collapsed ExtendedFab needs an icon.
export const noCollapsedIcon = <ExtendedFab extended={false}>Compose</ExtendedFab>;
// @ts-expect-error ExtendedFab has no legacy 40px or regular variant.
export const regular = <ExtendedFab size="regular">Compose</ExtendedFab>;
// @ts-expect-error ExtendedFab requires its label.
export const missingLabel = <ExtendedFab startIcon="+" />;
// @ts-expect-error This component exposes native buttons and links, not arbitrary component internals.
export const component = <ExtendedFab component="div">Compose</ExtendedFab>;
