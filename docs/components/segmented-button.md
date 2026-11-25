# SegmentedButton

Baseline Material 3 outlined segmented selection, exported as SegmentedButton and ButtonSegment from
the package root or `/segmented-button`. Component styles, including shared ripple, load automatically. ThemeProvider loads theme defaults.

```tsx
import { ButtonSegment, SegmentedButton } from '@flaut-travel/react-md3e/segmented-button';

<SegmentedButton aria-label="Calendar view" defaultValue="week" name="view">
  <ButtonSegment value="day">Day</ButtonSegment>
  <ButtonSegment value="week">Week</ButtonSegment>
  <ButtonSegment value="month">Month</ButtonSegment>
</SegmentedButton>;
```

Use two to five direct ButtonSegment children, optionally through fragments. Each needs a unique,
nonempty string value. Keep labels short and consistent; avoid mixing text and icon-only labels.
The horizontal row does not wrap. Icons are decorative; icon-only segments require aria-label or
aria-labelledby, and the group always requires one of those accessible names.

## API

| Prop                     | Default   | Contract                                                                                                             |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------- |
| `selectionMode`          | `single`  | Single uses string/null values; multiple uses string arrays.                                                         |
| `value`, `defaultValue`  | unset     | Controlled selection or initial uncontrolled selection. Supply an initial value when a choice should start selected. |
| `onChange(event, value)` | unset     | Observes an attempted change. Returning false or newly preventing the event cancels it.                              |
| `allowEmpty`             | false     | Allows deselecting the current single choice. Multiple selection always permits all or none.                         |
| `disabled`               | false     | Disables the entire group; individual ButtonSegment children also accept disabled.                                   |
| `readOnly`               | false     | Keeps focus/navigation available while preventing changes and ripple.                                                |
| `hideSelectionIndicator` | false     | Hides the checkmark; provide another non-color selection cue when using this option.                                 |
| `selectedIcon`           | checkmark | Replaces the decorative checkmark.                                                                                   |
| `fullWidth`              | false     | Fills the containing pane while preserving equal segment widths. Prefer a constrained container on large screens.    |
| `name`, `form`           | unset     | Submit selected, enabled values through hidden inputs; form can identify an external form.                           |

Native div attributes/ref belong to SegmentedButton. Native button attributes/ref belong to
ButtonSegment, except selection roles, form naming and button type, which the group owns.
ButtonSegment adds `icon` and `disableRipple`. Its native type is always button, so activation does
not submit a surrounding form. A segment's onClick can prevent selection with preventDefault().

With text and an icon, selection crossfades the icon to a checkmark. Without a leading icon, the
checkmark enters beside the text; reserved space avoids changing the group's width. Icon-only
segments keep their identifying icon and add a checkmark alongside it.

Uncontrolled groups restore defaultValue on native form reset, including external form ownership;
a prevented reset leaves selection intact. Controlled values stay application-owned, including on
reset. Reset does not invoke onChange. Disabled values are excluded from submission. Hidden inputs
provide form data, without native required-field validation or a public input-ref API.

## Interaction and rendering

Base UI 1.9.0 ToggleGroup/Toggle own roving focus, wrapping arrows, Home/End, disabled-item skipping
and native Enter/Space activation. The adapter applies radiogroup/radio roles for single selection
and group/checkbox roles for multiple selection, using aria-checked rather than aria-pressed.
Initial Tab entry is the first enabled segment. Arrows move focus; Enter/Space commit selection.
This follows the segmented-button keyboard guidance rather than changing selection on every arrow.
Explicit or inherited HTML dir controls logical corners and arrow direction.

Both components are interactive client entries with server-rendered HTML, usable from an RSC.
ThemeProvider remains a server-compatible CSS scope. Styles are extracted at build time; the browser
only interpolates inherited CSS spring tokens and transient ripple geometry. Color/opacity use fast
effects and indicator/content transforms use fast spatial motion. Reduced motion disables transitions
and ripple animation; forced colors use system outlines, selection colors and visible checkmarks.

## Design sources and adaptations

Read on 2026-11-19:

- Official [overview](https://m3.material.io/components/segmented-buttons/overview),
  [specs](https://m3.material.io/components/segmented-buttons/specs),
  [guidelines](https://m3.material.io/components/segmented-buttons/guidelines) and
  [accessibility](https://m3.material.io/components/segmented-buttons/accessibility), rendered in Chromium.
  These living references have no revision identifier.
- AndroidX [OutlinedSegmentedButtonTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedSegmentedButtonTokens.kt),
  token version v0_162, and [SegmentedButton.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SegmentedButton.kt).
  Numerical/color references: 40px visual height, 48px target, 1px outline, full outer corners,
  labelLarge, 18px icons, 12px minimum inline padding and 8px content spacing. Selected colors are
  secondaryContainer/onSecondaryContainer, unselected content is onSurface, borders use outline.
  Disabled content uses 38% onSurface and borders 12% onSurface; selected fill remains visible.
- Requested [M3E CSS reference](https://matraic.github.io/m3e/#/components/segmented-button.html),
  inspected through [ButtonSegmentElement.ts](https://github.com/matraic/m3e/blob/aa2f9ad252c06301e8874d3188d486464e8cc170/packages/web/src/segmented-button/ButtonSegmentElement.ts)
  and [SegmentedButtonElement.ts](https://github.com/matraic/m3e/blob/aa2f9ad252c06301e8874d3188d486464e8cc170/packages/web/src/segmented-button/SegmentedButtonElement.ts).
  Shared outlines, logical corners, icon replacement and a separate visual/touch area informed the
  independent object-CSS implementation. No upstream implementation or icon asset was copied.
- Google's [Material 3 Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)
  is identified as a design reference; its nodes were not accessible or inspected. No Figma parity
  or pixel-perfect conformance is claimed.

The official May 2025 Expressive update recommends connected button groups for new Expressive UI.
This component intentionally supplies the requested baseline segmented design; the existing
ButtonGroup retains its separate Expressive appearance and API.

Web adaptations include CSS grid for equal segment widths, one shared divider instead of doubled
borders, explicit composition, hidden form values and precomputed theme springs. There are no MD2
aliases, density presets, vertical layouts or Expressive size variants on this baseline component.

The Next fixture `/segmented-buttons`, Storybook Components/SegmentedButton and colocated browser/type
tests cover the public contract. Browser evidence is Chromium only.
