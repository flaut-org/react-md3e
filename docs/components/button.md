# Button

Button composes `@base-ui/react/button` and adds MD3 Expressive appearance, shape motion, and a
bounded press ripple. It is a client component because Base UI and the ripple need interaction
logic. Server Components may import it; HTML is server-rendered and the button then hydrates. The
compiled styles and ThemeProvider do not introduce a client boundary.

```tsx
import { Button } from '@flaut-travel/react-md3e';
import '@flaut-travel/react-md3e/styles.css';

<Button variant="filled" size="medium" shape="round">
  Continue
</Button>;
```

Alternatively import Button from `@flaut-travel/react-md3e/button`. The stylesheet is required once at
the application root. CSS-variable fallbacks provide the default appearance even without a
ThemeProvider; use a provider for scoped or system-mode themes.

## API

| Prop                                   | Values / behavior                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `variant`                              | filled (default), tonal, outlined, text, elevated                                   |
| `size`                                 | extraSmall, small (default), medium, large, extraLarge                              |
| `shape`                                | round (default), square                                                             |
| `selected`                             | Controlled toggle state; omit for an ordinary button. Not supported by text buttons |
| `startIcon`, `endIcon`                 | Decorative leading/trailing icons, hidden from assistive technology                 |
| `disableRipple`                        | Disable press animation; keyboard focus ring remains. Default false                 |
| `type`                                 | Native type; defaults to button to avoid accidental form submission                 |
| `disabled`, `ref`, DOM and event props | Native button behavior; React 19 ref forwarding                                     |
| `className`, `style`                   | Normal React composition                                                            |

There is no MD2 `contained` alias, runtime `sx`, synthetic loading UI, link polymorphism, or
component-specific theme override registry in this implementation.

Toggle state is owned by the consumer:

```tsx
'use client';
import { useState } from 'react';
import { Button } from '@flaut-travel/react-md3e';

export function FavoriteButton() {
  const [selected, setSelected] = useState(false);
  return (
    <Button variant="tonal" selected={selected} onClick={() => setSelected(!selected)}>
      Favorite
    </Button>
  );
}
```

`aria-pressed` is derived from `selected`, and changing selection also changes the color roles and
resting shape. React event handlers still require the usual client boundary in the consumer. Styling
never adds that boundary.

## Token behavior

| Size       | Visual height | Icon | Padding | Square corner     | Pressed corner |
| ---------- | ------------- | ---- | ------- | ----------------- | -------------- |
| extraSmall | 32px          | 20px | 16px    | medium / 12px     | small / 8px    |
| small      | 40px          | 20px | 16px    | medium / 12px     | small / 8px    |
| medium     | 56px          | 24px | 24px    | large / 16px      | medium / 12px  |
| large      | 96px          | 32px | 48px    | extraLarge / 28px | large / 16px   |
| extraLarge | 136px         | 40px | 64px    | extraLarge / 28px | large / 16px   |

Corner tokens, color roles, and typography follow the enclosing theme. Small visual buttons extend
their pointer target to at least 48px vertically. Round buttons use the effective half-height radius
so transitions can visibly morph from round to square.

Filled uses primary/onPrimary; tonal uses secondaryContainer/onSecondaryContainer; elevated uses
surfaceContainerLow/primary; outlined uses outlineVariant/onSurfaceVariant; text uses primary.
Toggle selections use the role pairs in the current specification. Disabled, hovered, focused, and
pressed states have static CSS state layers. Focus has a visible ring.

Shape motion uses the themed fast spatial CSS `linear()` approximation, sampled from the selected MD3
scheme (expressive defaults: stiffness 800, damping 0.6). It has no animation JavaScript and does not model
velocity-preserving spring retargeting. Reduced motion disables transitions; forced colors retain
visible boundaries and focus.

## Ripple

Pressing starts a bounded ripple from the pointer position; keyboard and assistive activations start
at the center. A 450ms CSS keyframe expands the ink toward the center. Quick presses remain visible
for at least 225ms before a 150ms opacity fade; held presses remain until release. Touch input waits
150ms to avoid flashing during scrolling; quick taps still animate, and pointer cancellation clears
the press. Disabled buttons and `disableRipple` suppress it. Reduced motion and forced colors use
static state/focus feedback instead.

The private hook creates transient spans inside an aria-hidden layer and sets only predeclared CSS
variables for geometry. React owns the layer; the hook exclusively owns its empty subtree and cleans
it up on disable/unmount. Base UI's mergeProps composes consumer and internal handlers. No style
element, stylesheet rule, animation library, or frame-by-frame JavaScript is created.

This is a web ripple, not an Android sparkle shader. State layers and the keyboard focus ring remain
independent of ripple.

## Source provenance

Read on 2026-11-15:

- [Official button specification](https://m3.material.io/components/buttons/specs), rendered in a
  browser, including configuration, selected roles, measurements, and shape morphs.
- [Base UI Button](https://base-ui.com/react/components/button) and installed 1.9.0 source: client
  boundary, native button semantics, disabled behavior, and ref/event composition.
- [Google Material Web ripple reference](https://github.com/material-components/material-web/blob/main/ripple/internal/ripple.ts):
  pointer-origin/centered activation, ink growth, 225ms minimum press, and 150ms touch delay. Our
  React controller and static CSS are independently implemented; no Lit runtime is used.
- [Official Android button guide](https://github.com/material-components/material-components-android/blob/master/docs/components/CommonButton.md).
- AndroidX revision `89d9aa6a5b9fc6e4847002be42f3c6891b091c9e`:
  [button size tokens](https://github.com/androidx/androidx/tree/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens),
  `TypeScaleTokens.kt` v0_11_0, and `ExpressiveMotionTokens.kt` v0_14_0.

Numeric measurements are adapted to CSS px and rem. Figma was not read; pixel-perfect visual parity
with a particular Figma node is not claimed. No MUI source was copied.

## Loading and navigation

`loading` disables activation and exposes aria-busy while preserving the button's accessible name
and layout width. The default indicator is a private compiled CSS circular spinner;
`loadingIndicator` can supply an application-owned visual (the wrapper is aria-hidden). This is a
web loading state, not an implementation of the separate Expressive LoadingIndicator shape catalog.
`fullWidth` fills its containing block.

`href` renders a native anchor with link semantics. `component="a"` is supported, as are custom
routing links such as `component={Link}` with href. Custom components must forward DOM attributes,
events and refs. Native button/link props and refs follow the selected component's TypeScript type.
Disabled/loading links remove href, expose aria-disabled and leave the tab order. Import
ButtonLinkProps for the native href shorthand, or ButtonProps<typeof Link> for a routing component.

Current motion token mapping and web adaptation are documented in [Motion](../motion.md).
