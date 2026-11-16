import { Button } from '@flaut-travel/react-md3e';

export const valid = <Button variant="tonal" size="extraLarge" shape="square" selected />;
// @ts-expect-error MD2 aliases are not part of the public API.
export const obsolete = <Button variant="contained" />;
// @ts-expect-error MD3 text buttons have no toggle state.
export const textToggle = <Button variant="text" selected />;

export const icons = <Button startIcon={<svg />} endIcon={<svg />} disableRipple />;

export const link = (
  <Button href="/articles" target="_blank" ref={(element: HTMLAnchorElement | null) => element?.focus()}>
    Articles
  </Button>
);
export const typedLink = <Button component="a" href="/articles" />;
export const busy = (
  <Button loading loadingIndicator={<span>Working</span>} fullWidth>
    Search
  </Button>
);
// @ts-expect-error Native button refs cannot reference anchors.
export const wrongRef = <Button ref={(element: HTMLAnchorElement | null) => element?.focus()} />;
