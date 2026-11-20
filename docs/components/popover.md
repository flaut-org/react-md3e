# Popover

Popover is an anchored interactive panel built on Base UI Popover. It can contain fields, counters,
radio groups, or other application content. Its surface uses Material 3 theme roles and precompiled
CSS. PopoverClose is an optional Button composition part that requests closure of its parent.

This is a web composition with MD3 tokens, not a separately standardized MD3 Expressive component.
Use Dialog for a blocking task, Autocomplete for searchable choices, and Menu for commands.
The passenger/cabin example lives in the consumers; travel-specific state and limits are not part of
Popover.

## Usage

Import the stylesheet once at the application root. The package root and `/popover` export both
parts and their own public types; Base UI stays an implementation detail.

```tsx
import { Button, Popover, PopoverClose, TextField } from '@flaut-travel/react-md3e';

export default function Page() {
  return (
    <Popover trigger={<Button variant="tonal">Travel preferences</Button>} aria-label="Travel preferences">
      <TextField label="Booking note" fullWidth />
      <PopoverClose variant="text">Done</PopoverClose>
    </Popover>
  );
}
```

This composition can live in a Server Component. Event callbacks, controlled state, and application
counters belong in consumer client components. A trigger must be a native button or a component
that renders a button and forwards native button props and ref, such as Button or IconButton. It
retains its own children, styling, events and ref; no extra button is wrapped around it. A disabled
trigger stays disabled even when the Popover disabled prop is false.

## Public API

| Prop                                                           | Behavior                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `trigger`                                                      | Required button React element, owning the interaction and default positioning anchor             |
| `aria-label` / `aria-labelledby`                               | At least one nonempty accessible name is required for the popup dialog                           |
| `open`, `defaultOpen`                                          | Controlled or initially open uncontrolled state; closed by default                               |
| `onOpenChange(open, event)`                                    | Opening/closing request with its native Event; controlled consumers update open themselves       |
| `onClose(event, reason)`                                       | Called before onOpenChange for closing requests                                                  |
| `placement`                                                    | top/bottom/left/right, optionally suffixed -start/-end; default bottom-start                     |
| `offset`                                                       | Gap between anchor and surface, default 8px                                                      |
| `collisionPadding`                                             | Viewport collision inset, default 8px                                                            |
| `positionMethod`                                               | fixed by default; absolute is available for an appropriate containing block                      |
| `anchorEl`                                                     | Optional Element, ref, or callback for a separate positioning anchor; trigger is still required  |
| `container`                                                    | Optional portal HTMLElement or callback returning one; null uses the default scope               |
| `matchAnchorWidth`                                             | Match positioning anchor width, constrained to available space; default false                    |
| `disablePadding`                                               | Remove the default 16px surface inset; default false                                             |
| `initialFocus`, `finalFocus`                                   | Boolean or HTMLElement ref; otherwise Base UI chooses initial focus and returns it appropriately |
| `disabled`                                                     | Disable trigger activation; default false                                                        |
| `modal`                                                        | Contain focus and lock page scrolling; default false                                             |
| `keepMounted`                                                  | Preserve hidden browser DOM/state after closing; default false                                   |
| `disableEscapeKeyDown`                                         | Suppress Escape closing requests; default false                                                  |
| `closeText`                                                    | Accessible modal fallback-close label, default Close popover; localize when modal is true        |
| `children`, `ref`, `className`, `style`, native div/ARIA props | Apply to the popup surface; role is always dialog                                                |

Start/end alignment follows text direction. Base UI flips or shifts the actual placement when the
requested side has insufficient room. The popup scrolls internally when content exceeds available
height. The default surface width is 320px, capped at 560px and the available viewport width; style
can choose a different width while preserving the available-space constraint.

onClose reasons are escapeKeyDown, clickAway, triggerClick, focusOut, closeButtonClick and
programmatic. Updating a controlled open prop directly does not synthesize a callback. Calling
preventDefault on a cancelable callback event cancels a request; returning false from either
callback also cancels it, including noncancelable focus events or events already handled by Base UI.
Otherwise uncontrolled state updates automatically. A controlled consumer may also veto by retaining
its open value. Moving focus to an outside button can report focusOut before its click is dispatched;
use both focusOut and clickAway when vetoing all outside interaction.

```tsx
'use client';

import { useState } from 'react';
import { Button, Popover, PopoverClose } from '@flaut-travel/react-md3e';

export function Preferences() {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      trigger={<Button>Preferences</Button>}
      aria-label="Preferences"
      open={open}
      onOpenChange={(next) => setOpen(next)}
    >
      <p>Application-owned interactive content.</p>
      <PopoverClose variant="text">Done</PopoverClose>
    </Popover>
  );
}
```

PopoverClose accepts ButtonProps, including MD3 variants, icons, disabled state and ref. Its default
appearance is the same as Button (filled); specify text for a trailing text action. It closes through
the parent state contract and works without a consumer state hook in uncontrolled popovers. Use it
inside Popover; its click handler can preventDefault to cancel that close action.

The API deliberately has no MUI anchorOrigin/transformOrigin mapping, slots, runtime sx, hover
activation, arbitrary virtual anchors, or public positioning-engine types. anchorEl changes geometry;
it does not replace the trigger or its focus/ARIA relationship.

## Focus, dismissal and accessibility

Clicking the trigger toggles the panel; Enter/Space use native button activation. Base UI connects
aria-haspopup, aria-expanded and aria-controls. Focus enters the first enabled interactive element
for keyboard/mouse activation; touch activation may focus the popup itself. Use initialFocus for a
particular field or title with tabIndex=-1; false keeps automatic focus disabled.

The default is nonmodal: background interaction and page scrolling remain available, and Tab may
leave the popup. Escape, an outside press, focus leaving the interaction, another trigger press, or
PopoverClose can request closure. Inside fields, counters, and radios do not close it automatically.
Focus returns to the trigger on keyboard/close-action dismissal unless finalFocus specifies another
target; an outside press can retain focus on the clicked outside control. False disables automatic
focus restoration. Give the panel a concise accessible name, and use aria-describedby only for a
short introductory description rather than announcing its entire interactive contents.

With modal=true, Base UI contains focus, makes background content unavailable and locks scrolling.
An accessible fallback close button is included; it becomes visible on keyboard focus. Provide a
clear visible application close action too. Use Dialog when a larger blocking workflow is intended.
Nested Popovers, Autocomplete suggestions and Dialog share Base UI layer/focus handling; Escape
closes the active layer first.

## Theme, appearance and server boundary

The portal mounts inside the nearest ThemeProvider scope or parent Base UI portal, falling back
to document.body. CSS inheritance preserves theme colors, font/shape overrides, color-scheme and
nested light/dark modes without a client theme context or computed style copying. Explicit dir
wins over an ancestor dir attribute. A custom container inherits its own DOM scope: place it under
the intended theme. A transformed, clipped or contained scope can constrain positioned descendants;
use an unconstrained themed portal host when necessary. The default portal layer is 1400, above
AppBar and Dialog.

The surface uses surfaceContainerHigh/onSurface, bodyLarge typography, large themed corners
(default 16px), a level-2-style shadow and a 16px inset. These choices are this library's MD3-token
adaptation for a general anchored form panel; they do not claim an official Google Popover spec.
Opacity uses the themed fast effects spring; scale/translation use fast spatial, compiled to CSS transitions. Reduced motion removes
transitions; forced colors adds a system-color surface boundary.

Popover and PopoverClose are client components for Base UI interaction and context. The trigger
renders as server HTML; the portal contents mount in the browser after hydration, including when
open/defaultOpen is initially true. keepMounted retains browser DOM and does not render a portal on
the server. Server pages and streamed content can compose both parts without a client ThemeProvider.
Styling never adds a client boundary: Linaria/WyW extracts typed style objects at build time. Base
UI performs runtime positioning/focus work, while the styling compiler and theme generator stay out
of the UI graph. No new runtime dependency is added for Popover; Base UI already contains its
positioning implementation.

## Examples and verification

Storybook's Components/Popover includes passenger counters and cabin radios, controlled state,
placement, retained content, modal mode, trigger-width matching, disabled state, and RTL. Its theme
toolbar applies to portal content too. The Next fixture's `/popovers` route exercises server
composition, refs, custom anchors/containers, dismissal policies and nested layers. `/streaming`
composes another Popover after request-time Suspense.

Colocated browser tests cover keyboard/pointer operation, accessible naming/relationships, controlled
and uncontrolled state, dismissal reasons/veto, explicit focus, retained inputs, disabled triggers,
geometry/collisions, theme inheritance, nested interaction, modal behavior, mobile/RTL, reduced
motion, forced colors, axe checks, SSR triggers without JS, streaming and Storybook. Public types
are checked through root/subpath imports and both NodeNext and Bundler consumers. Chromium is
verified; other engines and Figma parity are outside current evidence.

## Sources

Read on 2026-11-15:

- [Base UI Popover](https://base-ui.com/react/components/popover) and installed @base-ui/react 1.9.0
  sources: click activation, portals, collision handling, focus, dismissal, modal/retained modes.
- [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): focusable popup
  content belongs to a nonmodal dialog pattern rather than tooltip semantics.
- [Material 3 design tokens](https://m3.material.io/foundations/design-tokens/overview) and the
  library's existing [theme contract](../theming.md): color roles, type scale and shape references.

No upstream implementation source was copied. The custom panel layout/motion is independently
implemented; the passenger example is application composition.
