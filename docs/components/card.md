# Card

Card displays content and actions about one subject. It composes [Surface](surface.md) with the MD3
filled, elevated or outlined surface. The container is noninteractive and server-compatible.
CardContent, CardActions and CardMedia also remain server components; only CardActionArea adds a
client boundary for primary actions and ripple.

```tsx
import { Button, Card, CardContent, CardActions, CardMedia } from '@flaut-org/react-md3e';

export function TripCard() {
  return (
    <Card component="article" variant="elevated">
      <CardMedia src="/lake.jpg" alt="An alpine lake" />
      <CardContent>
        <h2>Mountain escape</h2>
        <p>A quiet weekend above the clouds.</p>
      </CardContent>
      <CardActions>
        <Button variant="text">Explore</Button>
      </CardActions>
    </Card>
  );
}
```

Import `/styles.css` once at the application root. The root and `/card` entry export all five parts
and their own public types. A container is the only required part; layouts/headings are owned by the
consumer. Media and action parts are optional.

## Container and parts

| Card prop                                             | Behavior                                                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `variant`                                             | filled, elevated or outlined; default filled                                                    |
| `shape`                                               | Surface corner role; default medium, normally 12px or the theme override                        |
| `component`                                           | Same structural native tags as Surface; default div; article/section are available              |
| `dragged`                                             | Controlled elevated drag appearance; default false. The application owns actual drag/reordering |
| `children`, `ref`, `className`, `style`, native props | Forwarded to the surface; ref follows component                                                 |

| Variant  | Container color         | Resting elevation | Outline            |
| -------- | ----------------------- | ----------------- | ------------------ |
| filled   | surfaceContainerHighest | level 0           | none               |
| elevated | surfaceContainerLow     | level 1           | none               |
| outlined | surface                 | level 0           | 1px outlineVariant |

All use onSurface content. Card lets the variant own color and elevation; use Surface for a generic
surface with independent values. Media is clipped to the themed corners. No fixed height, internal
scroll area or automatic heading is installed. Place mobile content in the page's scroll flow.

| Part           | API and presentation                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| CardContent    | Native div props/ref, 16px padding, wrapping content                                                                |
| CardActions    | Native div props/ref, 16px padding, trailing alignment, 8px gap, wrapping; disableSpacing removes the gap           |
| CardMedia      | Native img props/ref; alt is required, including empty alt for decorative media. Full width, object-fit cover       |
| CardActionArea | Native button props/ref, or native anchor props/ref when href is supplied; disabled and disableRipple are available |

CardMedia uses src/srcSet and native image attributes. It does not implement a CSS background-image
alias, video player, polymorphic component or Next Image integration. Consumers can compose their own
media element instead. CardContent does not apply typography to arbitrary descendant headings;
choose MD3 type roles in consumer classes. CardActions does not add toolbar semantics to unrelated
buttons.

## Primary actions and independent controls

```tsx
'use client';

import { Button, Card, CardActionArea, CardContent, CardActions } from '@flaut-org/react-md3e';

export function InteractiveTrip({ onOpen, onSave }: { onOpen: () => void; onSave: () => void }) {
  return (
    <Card variant="filled">
      <CardActionArea onClick={onOpen} aria-label="Open mountain escape">
        <CardContent>Mountain escape</CardContent>
      </CardActionArea>
      <CardActions>
        <Button variant="text" onClick={onSave}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
```

A default CardActionArea uses Base UI Button and defaults to type=button, preventing accidental form
submission. Enter/Space activate it; type=submit and native name/value can be supplied deliberately.
With href it renders a native link: Enter navigates, Space retains browser scrolling, and link
features such as target/download/modified-click remain native. Using Base UI Button for that branch
would introduce button role/Space activation, so it is intentionally a native anchor with the shared
ripple controller. Public types retain the correct button/anchor ref and attributes.

Keep other buttons, links, checkboxes and controls outside CardActionArea. Use a static Card for a
card containing independent controls, or make CardActions a sibling of the primary area as above.
Do not wrap an entire card containing buttons in another button/link. The container itself has no
role, tab stop or click handler installed. Primary action names come from their content or supplied
ARIA names; media that only decorates that action should have empty alt.

Disabled primary buttons use native disabled. Disabled link areas remove href, set aria-disabled
and leave the tab order; they prevent click/auxiliary activation. Disabled applies to that area,
not every independent sibling control. disableRipple only removes the effect, preserving action
behavior. Press ripple reuses the existing pointer/keyboard/touch controller and compiled CSS.

Only enabled direct-child primary areas affect container hover/focus elevation. Hover raises filled
and outlined cards to level 1 and elevated cards to level 2. Focus/press retain resting elevation;
outlined focus uses onSurface at the border. The area has a visible inset secondary focus outline,
which stays inside the clipped card. Controlled dragged raises filled/outlined to level 3 and
elevated to level 4; it does not install gesture listeners or accessible reorder commands. The
application must provide alternatives if it implements dragging/swiping.

Reduced motion removes shadow/state transitions and suppresses ripple through the existing hook.
Forced colors keeps system-color boundaries/focus feedback and removes shadows. Logical alignment
supports RTL. Arbitrary child content must still maintain its own contrast and accessible semantics.

## Server, CSS and verification

Surface, Card, CardContent, CardActions and CardMedia have no client directive or hooks. They render
styled server HTML and can arrive in a streamed Suspense response without hydration. An action area
is server-rendered and hydrates independently for behavior. Event callbacks belong in consumer
client components. Colors, corners, elevation and state selectors are compiled CSS, inherited from
ThemeProvider; there is no client theme provider or runtime style generation.

Colocated tests cover variants, theme overrides, media, keyboard/pointer actions, focus/ripple,
disabled states, native links, separate controls, default form behavior, DOM refs, responsive/RTL,
forced colors, reduced motion, dragging appearance, axe, SSR/streaming and Storybook. Package checks
verify the actual Surface composition and server/client boundaries. Chromium is covered; Figma parity,
other engines, container-transform navigation and gestures are outside current evidence.

Read on 2026-11-15:

- [Official Card specs](https://m3.material.io/components/cards/specs),
  [guidelines](https://m3.material.io/components/cards/guidelines) and
  [accessibility](https://m3.material.io/components/cards/accessibility), rendered in a browser:
  three variants, medium corners, content blocks and separation of actionable surfaces/controls.
- AndroidX [FilledCardTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledCardTokens.kt),
  [ElevatedCardTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevatedCardTokens.kt)
  (v0_210), [OutlinedCardTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedCardTokens.kt)
  (v0_192), at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e: colors, corners and elevation states.
- [Base UI Button](https://base-ui.com/react/components/button), installed 1.9.0: primary button
  interaction; native HTML semantics are used for navigation links.

No MUI/AndroidX Card implementation source was copied. Shadow rendering and composition APIs are
web adaptations; Shape's separate derived geometry has its own Apache-2.0 provenance.
