import { Fab } from '@flaut-travel/react-md3e';
import { Fab as StandaloneFab } from '@flaut-travel/react-md3e/fab';

const named = { 'aria-label': 'Create', 'children': '+' };

export const button = (
  <Fab
    aria-label="Create"
    size="medium"
    color="tertiaryContainer"
    type="submit"
    name="intent"
    value="create"
    ref={(element) => element?.focus()}
  >
    +
  </Fab>
);
export const link = (
  <StandaloneFab
    href="/create"
    aria-labelledby="create-label"
    target="_blank"
    rel="noopener"
    ref={(element) => element?.focus()}
  >
    +
  </StandaloneFab>
);
export const tone = (
  <Fab aria-label="Create" color="primary" lowered disableRipple>
    +
  </Fab>
);
// @ts-expect-error Icon-only floating actions need an accessible name.
export const missingName = <Fab>+</Fab>;
// @ts-expect-error MD2 aliases are not FAB variants.
export const contained = <Fab {...named} variant="contained" />;
// @ts-expect-error Button's sizes are not FAB sizes.
export const extraLarge = <Fab {...named} size="extraLarge" />;
// @ts-expect-error Tone and container roles use explicit MD3 names.
export const invalidColor = <Fab {...named} color="success" />;
// @ts-expect-error A FAB is an action, not a selectable toggle.
export const selected = <Fab {...named} selected />;
