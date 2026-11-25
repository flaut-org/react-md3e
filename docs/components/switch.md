# Switch

Switch toggles an immediate, standalone setting. It composes Base UI Switch for checked state,
keyboard activation, labels, native form participation and accessibility. Import it from the package
root or `/switch`, with automatic CSS loading.

```tsx
'use client';

import { useState } from 'react';
import { Switch } from '@flaut-travel/react-md3e/switch';

export function Notifications() {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <Switch
        checked={checked}
        onChange={(_event, nextChecked) => setChecked(nextChecked)}
        name="notifications"
        value="enabled"
      />{' '}
      Notifications
    </label>
  );
}
```

Keep a short, stable label beside the switch, describing what is enabled. Allow room for its focus
ring; the examples use an inline-flex label with a 16px gap. Use Checkbox for related
choices that require submitting, and RadioGroup or a connected ButtonGroup for mutually exclusive
options. The component does not own a label, supporting text or application side effects.

## API

| Prop                                                | Contract                                                                            |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `checked` / `defaultChecked`                        | Controlled or initial uncontrolled boolean state                                    |
| `onChange(event, checked)`                          | Native DOM Event and next boolean; event.preventDefault() vetoes the change         |
| `disabled`                                          | Prevent changes and keyboard focus; disabled Material colors                        |
| `readOnly`                                          | Prevent changes, retaining focus and the current appearance                         |
| `required`, `name`, `value`, `form`                 | Native checkbox input validation, submission and external form association          |
| `icon` / `checkedIcon`                              | Optional decorative content inside the unselected/selected handle, sized to 16px    |
| `disableRipple`                                     | Suppress press ink while retaining state layers, handle feedback and keyboard focus |
| `ref` / `inputRef`                                  | Visible HTMLSpanElement / native HTMLInputElement                                   |
| `id`                                                | Applied to the native input for htmlFor label association                           |
| Native span attributes, events, className and style | Apply to the visible role=switch control                                            |

Prop conventions follow Checkbox and familiar MUI names. onChange receives Base UI's native Event,
not a fabricated React.ChangeEvent. Base UI event details and render primitives remain private.
Material defines one track size; there are no MD2 size/color aliases, mixed state or error appearance.
Use aria-invalid/aria-describedby to associate application validation feedback when necessary.

Use a wrapping label, htmlFor/id, aria-labelledby or aria-label. Base UI associates wrapping labels
after hydration; supply an explicit aria-label or aria-labelledby if the switch needs its accessible
name in server-only HTML. Icons are decorative and do not change that name. Prefer an unambiguous
check/cross rather than text or an icon unrelated to the selected state. Supply only checkedIcon for
the selected-icon configuration, or both props for icons in both states; neither is present by default.

Checked enabled inputs submit value (default `on`). Unchecked and disabled inputs are omitted;
readOnly does not disable submission. required uses native checkbox validation. Application reset
policy remains explicit: reset controlled state in the form's onReset, and remount uncontrolled
controls if their initial values must be restored. There is no internal uncheckedValue or form library.

## Material presentation and interactions

The visual track is 52×32px with a 2px outline and full corners, inside a 52×48px target. The handle
is 16px unselected without an icon, 24px selected or containing an icon, and 28px while pressed or
dragged. Its center moves 20px between track ends; a 40px state layer and focus ring follow it.
These dimensions are shared by standard and Expressive themes.

Selected track/handle colors are primary/onPrimary. The unselected track uses surfaceContainerHighest,
outline and an outline-colored handle. Hover/focus/press update the handle to primaryContainer or
onSurfaceVariant. Icons use onPrimaryContainer or surfaceContainerHighest. Disabled colors follow
the distinct Material handle/icon/track opacity roles (38% and 12%) rather than fading the entire
control. Color variables inherit light/dark/nested themes without a React theme context.

Tab focuses the switch, Space/Enter toggles it, and clicking the associated label activates it.
Horizontal pointer dragging follows the handle directly, then commits at release using the track
midpoint. Small drags can retain the current value. Pointer cancellation or blur restores the current
state. A completed drag suppresses its following click, so one gesture cannot toggle twice. RTL is
inherited through logical CSS and checked when a drag starts. Vertical touch movement is left to
scrolling through touch-action: pan-y. The gesture helper sets only a geometry variable; it does not
own checked state or generate style rules. Native input activation goes through Base UI and onChange,
including change vetoes.

Handle position/size use the shared fast spatial spring; color/state-layer transitions use fast
effects. Direct dragging has no position transition. On release, CSS settles to the committed value.
Reduced motion disables finite transitions and ripple. Forced colors use Canvas, ButtonText,
Highlight/HighlightText and GrayText, while keeping the track boundary and focus outline visible.
The shared ripple hook handles only press timing/coordinates; no animation loop or CSS insertion is used.

The component is a client entry for Base UI behavior, pointer gestures and ripple. Its styled HTML,
checked state and native input render on the server and in request-time streams. Styling itself
adds no client requirement and no runtime dependency.

## Sources and verification

Read on 2026-11-19:

- Official Material [overview](https://m3.material.io/components/switch/overview),
  [specifications](https://m3.material.io/components/switch/specs),
  [guidelines](https://m3.material.io/components/switch/guidelines) and
  [accessibility](https://m3.material.io/components/switch/accessibility), inspected in the rendered site.
- AndroidX [SwitchTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SwitchTokens.kt)
  (token v0_210) and
  [Switch.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Switch.kt)
  at commit `009564af4f3f92df06e213711cb5327ceabc4e47`, for numeric measurements, state colors,
  optional icons and the fast spatial motion role. CSS, pointer handling and React code are independently
  authored; no AndroidX implementation is copied.
- [Base UI Switch](https://base-ui.com/react/components/switch), installed 1.9.0 source and docs,
  for labels, state, event cancellation and native input integration.
- [MUI Switch API](https://mui.com/material-ui/api/switch/) for familiar public prop names only.

CSS pixels adapt Android dp measurements. Pointer dragging uses a web midpoint threshold and does
not implement Android velocity-based fling decisions. Springs inherit the approximation and
interruption limits documented in [motion](../motion.md). Figma parity is not claimed.

Components/Switch stories demonstrate plain/selected-icon/both-icon configurations, controlled state,
disabled/readOnly, RTL and ripple opt-out. The Next `/switches` fixture adds refs, change vetoes,
forms/required validation, application reset, inherited RTL and nested standard/Expressive themes.
Colocated type/browser checks cover these contracts, pointer/touch cancellation, keyboard focus,
server-only/streamed HTML, accessibility, reduced motion and system colors. Browser verification
uses Chromium.
