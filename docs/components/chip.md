# Chip and ChipSet

Chip implements Material 3 assist, filter, input and suggestion chips. Import Chip and ChipSet from
the package root or `/chip`; CSS, including the shared ripple, loads automatically. ThemeProvider
loads theme defaults. `/chip/styles.css` remains available for explicit CSS consumers.

```tsx
import { Chip, ChipSet } from '@flaut-travel/react-md3e';

<ChipSet aria-label="Flight filters">
  <Chip kind="filter" label="Nonstop" defaultSelected shape="expressive" />
  <Chip kind="filter" label="Baggage" />
</ChipSet>;
```

Keep labels short. A chip represents an action, a suggested response, a filter or a discrete input
token. Use Badge for counts and Button for general actions. Chip labels and decorative icon/avatar
slots must not contain interactive descendants.

Input chip is the Material type for user-entered tokens. "Removable" describes an optional removal
action, not a fifth chip type; filter chips can also expose that action. Storybook's Input and
Input chips with removal examples use `kind="input"`; Read Only Input demonstrates passive tokens.

## Types and API

| Prop                                | Contract                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kind`                              | Required: `assist`, `filter`, `input` or `suggestion`. No MD2 aliases.                                                                                                               |
| `label`                             | Required text or a noninteractive ReactNode.                                                                                                                                         |
| `icon`, `trailingIcon`              | Optional decorative 18px icons. Filter selection replaces the leading icon with a check. Suggestions conventionally use only a leading icon.                                         |
| `avatar`                            | Input chips only; a 24px circular avatar. Use either avatar or leading icon.                                                                                                         |
| `variant`                           | `outlined` by default; assist, filter and suggestion also accept `elevated`. Input chips have no elevated variant.                                                                   |
| `shape`                             | `standard` by default (8px corners). Filter/input support `expressive`: 12px unselected, 16px selected and 8px pressed.                                                              |
| `selected`, `defaultSelected`       | Controlled or initial uncontrolled filter/input selection. Filter is always selectable; input becomes selectable when selection props are supplied.                                  |
| `onSelectedChange(event, selected)` | Observes attempted selection. Return false or newly call preventDefault() to veto the change. An onClick handler can also prevent selection.                                         |
| `selectedIcon`                      | Replaces the decorative filter checkmark. Preserve a non-color selection cue.                                                                                                        |
| `onClick`                           | Primary native button action. Removal never invokes it.                                                                                                                              |
| `onDelete`                          | Displays an independent remove button. The application removes the token from its state. Receives the originating click/keyboard event.                                              |
| `deleteIcon`, `deleteLabel`         | Override the close icon and its accessible label. Default label is `Remove <label>`; complex labels require an explicit deleteLabel. Localize it in translated applications.         |
| `removable`                         | Defaults to Boolean(onDelete). Allows composition with a removal primitive through slots.deleteButton. Assist/suggestion are not removable.                                          |
| `readOnly`                          | Input chips only; passive text with no primary/remove controls, even if callbacks are present.                                                                                       |
| `disabled`, `disableRipple`         | Disable interactions, or just the compiled ripple.                                                                                                                                   |
| `dragged`                           | Apply the MD3 dragged elevation/state layer. The application owns actual drag-and-drop behavior.                                                                                     |
| `type`, `name`, `value`, `form`     | Native assist/suggestion button attributes. Default type is button; submit/reset work with a surrounding or external form. Input/filter chips are not submit actions or form fields. |

Native div attributes, className, style and ref belong to the chip container. Native primary/remove
button attributes and refs go in slotProps.action and slotProps.deleteButton. Public selection,
disabled and form-action props own the corresponding button state. Primary handlers belong to onClick or
slotProps.action; root keyboard handlers observe bubbled events. Native data attributes are allowed.

A passive input chip renders text directly. Supplying onClick, selection props or slotProps.action
enables a primary button. With only onDelete, the label stays passive and only
the remove button is interactive. For example:

```tsx
<Chip kind="assist" label="Set reminder" onClick={openReminder} />;
<Chip kind="suggestion" label="Show nearby airports" onClick={showNearby} />;
<Chip kind="input" label="Alex Morgan" avatar="AM" onDelete={() => removeRecipient('alex')} />;
<Chip kind="input" label="Archived recipient" readOnly />;
```

Use individual controlled selected values to implement exclusive filtering. ChipSet does not own
selection or silently convert filters into radio buttons. Native hidden inputs can serialize an
application's selected filters when needed.

## Grouping, removal and accessibility

ChipSet is a wrapping Base UI Toolbar with one roving tab stop and a required nonempty aria-label
or aria-labelledby. Arrow keys navigate without selecting; Home/End reach the first/last control.
Disabled chips are skipped. Horizontal sets follow explicit or inherited RTL; orientation="vertical"
uses Up/Down. loopFocus defaults to true. disabled disables the entire set.

Each primary/remove action is its own native button; buttons are never nested. Enter/Space invoke
the focused action once. Filter/selectable input buttons expose aria-pressed. Remove buttons have
independent accessible names. Delete/Backspace removes a focused removable chip; after the
application removes it synchronously, focus moves to the next enabled chip, the preceding enabled
chip or the empty ChipSet. A callback that prevents the event and retains the token leaves focus
and content intact. Keep asynchronous removal focus management in the application.

The visual container is 32px high. Interactive controls extend their hit area vertically to 48px;
ChipSet reserves 8px above/below rows and 16px between wrapped rows to avoid overlapping rows. Its
inline gap is 8px. Compound remove buttons retain distinct targets inside the chip. Supply equivalent
spacing when laying out individual Chip instances yourself. Long labels ellipsize inside an explicit
max-width while preserving their complete accessible text.

The trailing remove control is a compact icon button: its state layer, ripple clip and focus-ring
surface are **24×24px circles**, centered around the **18×18px** icon. The invisible button/touch
target keeps its 48px vertical reach; it does not paint a rectangular hover segment. The 8px
label-to-icon and icon-to-edge spacing leaves 5px between the 24px circle and both text and edge.
Logical padding preserves these distances in RTL. Hover/press affects only this circle. Focus
adds the circular secondary ring and the whole chip's focus state layer. The primary action's
hover/ripple and focus indicator span the complete chip, including its trailing-icon region.

Focus indicators use secondary with 3px outlines and a 2px offset on the primary container; the compact circular remove ring has no extra
outline offset so it fits within the chip. Hover/pressed/focus layers, disabled text and
outlines, forced colors, RTL and prefers-reduced-motion are implemented in static CSS. Expressive
shape/selection transitions use existing fast spatial/effects spring tokens; labels are never scaled.

## Server and CSS architecture

Chip is a server-compatible dispatcher. Passive input chips, including readOnly selected inputs,
add no library client references of their own; callers can still supply client components in label/avatar slots. ChipInteractive owns Base UI Button/Toggle and selection;
ChipDelete owns removal; ChipSet owns Toolbar focus. Rendering an action/selection/remove control
adds only the required interaction boundaries. ThemeProvider remains a server CSS scope.

Autocomplete retains its Base UI Combobox chip navigation, value removal, hidden form inputs and
input-focus restoration. Its private AutocompleteChip is only a composition adapter: public Chip
provides all input-token presentation and the remove control, with Combobox.ChipRemove supplied
through the generic delete-button slot. There is no separate Autocomplete chip stylesheet. The
repository audit found no other bespoke chip implementation in examples or Storybook.

Both root named and subpath imports use the existing WyW/Linaria extraction and Vite metadata
imports. Chip and Autocomplete share canonical CSS assets; unrelated Chip CSS is tree-shaken from
Button/Checkbox consumers. The root barrel has no global CSS imports. See [CSS loading](../css-loading.md)
for Next Webpack's package-import optimization and the explicit CSS-free native Node condition.
Raw Node with react-server cannot interpret interactive React client references; as with Avatar,
use the Next RSC checks for the dispatcher and keep native checks for pure presentation modules.

## Design sources and adaptations

- Official [MD3 overview](https://m3.material.io/components/chips/overview),
  [specifications](https://m3.material.io/components/chips/specs) and
  [guidelines](https://m3.material.io/components/chips/guidelines).
- AndroidX Material 3 [Chip.kt](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt),
  revision `4d63fdedaa182525b5db9d25976cfd638d2ec35b`, including the Expressive ChipShapes overloads.
  Stable defaults remain small corners; Expressive medium/full/small state shapes are explicit opt-in here.
- AndroidX token version **41.1.19** at that revision:
  [AssistChipTokens](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/AssistChipTokens.kt),
  [FilterChipTokens](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilterChipTokens.kt),
  [InputChipTokens](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/InputChipTokens.kt),
  [SuggestionChipTokens](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SuggestionChipTokens.kt)
  and [ChipsTokens](https://github.com/androidx/androidx/blob/4d63fdedaa182525b5db9d25976cfd638d2ec35b/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ChipsTokens.kt).
- Google Material Web [chip documentation](https://github.com/material-components/material-web/blob/875a8b6b8827de2efdd51fc0c387c90b9954404a/docs/components/chip.md)
  [input-chip implementation](https://github.com/material-components/material-web/blob/875a8b6b8827de2efdd51fc0c387c90b9954404a/chips/internal/input-chip.ts),
  [trailing icon styles](https://github.com/material-components/material-web/blob/875a8b6b8827de2efdd51fc0c387c90b9954404a/chips/internal/_trailing-icon.scss)
  and [remove-button composition](https://github.com/material-components/material-web/blob/875a8b6b8827de2efdd51fc0c387c90b9954404a/chips/internal/trailing-icons.ts),
  revision `875a8b6b8827de2efdd51fc0c387c90b9954404a`, for separate web primary/remove actions and toolbar grouping.

Measurements are CSS pixels corresponding to MD3 dp: height 32, icons 18, avatar 24, labelLarge
14/20/500, 16px outer text padding for assist/filter/suggestion, 12px for input, 8px icon-side padding
and icon gaps, 4px avatar-side padding. Current MD3 measurement tables supply the 16px values;
the Input Chip measurement diagram supplies 12px. The chip-specific 24px circular trailing-action
surface follows Material Web; its standalone IconButton has a different size scale.
Selected filter/input containers use secondaryContainer/onSecondaryContainer. Assist labels use
onSurface; other labels use onSurfaceVariant. Elevated chips use surfaceContainerLow with elevation
1, hover 2 and dragged 4. Disabled text/icons/avatar use 38%; disabled outlines/containers use 12%.
The component reuses existing theme tokens, SVG check/close geometry and ripple rather than copying
Android/Material Web runtime code. Separate DOM buttons, callback cancellation and the CSS-only
shape/check transitions adapt native behavior to React and Base UI.

Google's kit Chips page is node `55141:14174` in file `069YnUCbHFX6TEmu4G6aLS`. Direct Figma metadata
access was attempted on 2026-11-26 and rejected by the MCP account quota. Pixel parity with the kit
is **not verified**. Source measurements, color/state tokens and Expressive shape values are pinned
above; browser geometry/state checks and rendered fixture inspection verify the web implementation.
The official MD3 specs page was also rendered in Chromium on 2026-11-26. Its Input Chip measurements
and 33-state light/dark diagram were inspected directly, including the local circular removal
states shown below the whole-chip hover/focus/press states. This verifies the documented measurements
and interaction anatomy, not pixel parity with every Figma variant.

## Verification

Owner type/browser tests cover all four types, selection and cancellation, independent deletion,
focus restoration, native forms and refs, roving navigation, disabled/readOnly states, RTL,
elevation, dark themes, geometry, Expressive spring frames, reduced motion, forced colors and axe.
Next fixtures exercise root/subpath imports and passive RSC output before JavaScript, under both
production bundlers. Package checks validate boundaries, source maps and CSS closures. Vite cases
compare root/subpath payloads, shared Autocomplete CSS, exclusion of unrelated styles and existing
bundle budgets. Storybook includes all types, elevation, Expressive shapes, removal and controlled
exclusive filtering. These checks cover Chromium; other browser engines remain unverified.

An isolated Vite 7.3.8 production comparison against `efc26351687a` used the same ThemeProvider and
multiple Autocomplete (Paris/Rome, Paris initially selected), with automatic root imports:

| Payload    | Before                       | With shared Chip             | Gzip change  |
| ---------- | ---------------------------- | ---------------------------- | ------------ |
| CSS        | 66,612 bytes / 8,375 gzip    | 83,753 bytes / 10,240 gzip   | +1,865 bytes |
| JavaScript | 379,321 bytes / 124,663 gzip | 388,197 bytes / 127,516 gzip | +2,853 bytes |

Autocomplete now includes the shared Chip's full state/variant styling and interaction adapters.
This is an intentional payload increase; the test budget is 85,000 uncompressed CSS bytes.
The existing root Button/Checkbox consumer remains byte-identical to the baseline: 37,642 CSS
bytes and 244,169 JavaScript bytes. Its production CSS excludes Chip entirely. Shared Chip/ripple
styles appear once when Autocomplete and standalone Chip are used together.
