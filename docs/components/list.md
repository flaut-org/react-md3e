# List and ListItem

MD3 Expressive lists support non-interactive presentation, single selection, and multiple selection.
Standard and segmented are visual styles, independent of selection behavior. Static lists render
server-compatible ul/li; selection alone introduces a client implementation. Theme colors,
typography, shapes, states, and motion are precompiled CSS.

```tsx
import { List, ListItem } from '@flaut-travel/react-md3e';

<List>
  <ListItem primary="Lisbon" secondary="Portugal" leading="L" leadingKind="avatar" />
  <ListItem primary="Saved journey" overline="Recently added" secondary="A weekend away" lines={3} />
</List>;
```

The `/list` entry also exports both components and their types. Supply a visible primary label via
primary or inline children. Give every selectable item a unique, stable, nonempty string value.

## Choosing the Base UI primitive

Google's current web accessibility spec requires selectable lists to use **listbox/option**, for
both single and multiple selection. Radio and checkbox use the shared private SelectionIndicator presentation; additional
interactive form controls must not be nested inside options. They are different platform roles in
the Android columns of Google's table.

The implementation adapts **Base UI ToggleGroup + Toggle** through their render API. This pair
provides single/multiple state, native press behavior, vertical roving focus, Home/End, looping and
disabled-item handling without requiring a popup or combobox input. The adapter replaces group/
pressed semantics with listbox, option and aria-selected, suppressing aria-pressed. A radio-style
single selection cannot be cleared by activating its selected item again.

RadioGroup/Radio and CheckboxGroup/Checkbox are appropriate for actual form-control groups, but
their native roles and keyboard behavior differ from this web listbox pattern. Select requires its
popup/positioner context, and Combobox uses input-based virtual focus. Neither is used as a fake
inline list. No Base UI internals are imported.

A small entry-focus adapter keeps one external tab stop on the first enabled selected option,
including after filtering or programmatic value changes. Base UI retains focus navigation while
inside the group. The adapter observes option state/tab-stop attributes, disconnects on unmount,
and neither reads styles nor uses private Base UI attributes/imports.

## Selection

```tsx
'use client';

import { useState } from 'react';
import { List, ListItem } from '@flaut-travel/react-md3e';

export function Currencies() {
  const [currency, setCurrency] = useState('EUR');

  return (
    <List
      selectionMode="single"
      value={currency}
      onValueChange={setCurrency}
      selectionIndicator="checkmark"
      aria-label="Currency"
    >
      <ListItem value="EUR" primary="Euro" secondary="EUR" leading="€" />
      <ListItem value="USD" primary="US dollar" secondary="USD" leading="$" />
    </List>
  );
}
```

| List prop                              | Values / contract                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| selectionMode                          | none (default), single, multiple                                                       |
| variant                                | segmented (default), standard; both use current Expressive tokens                      |
| disablePadding                         | Remove the default 8px web list block padding; default false                           |
| value / defaultValue                   | Single: string or null; multiple: readonly string array; omitted value is uncontrolled |
| onValueChange                          | Single: string; multiple: string array; no Base UI event details leak into the API     |
| selectionIndicator                     | Single: radio (default) or checkmark; multiple: checkbox                               |
| controlPosition                        | end (default), start                                                                   |
| disabled                               | Disable all options and remove them from keyboard navigation                           |
| readOnly                               | Keep selection visible and focusable, but reject changes                               |
| aria-label / aria-labelledby           | A nonempty accessible name is required for selectable lists                            |
| ref, className, style, native ul props | Apply to the ul root; ref is HTMLUListElement                                          |

The type union rejects values on static lists, mismatched single/multiple value shapes, and checkbox
visuals on single selection. Grouping labels and search fields belong outside the listbox; all its
items should be selectable ListItem rows with values. Do not mix static items into a selectable
listbox. A selected item can be temporarily filtered out without discarding its value.

selectionMode="none" is a plain informational list. readOnly on a selectable list instead presents
locked selection with aria-readonly on the listbox. They have different semantics and server costs.

| ListItem prop                          | Behavior                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| primary / children                     | Inline primary label; primary takes precedence                                              |
| secondary, overline                    | Optional supporting text and overline                                                       |
| leading, leadingKind                   | Decorative leading slot; icon (default), avatar, image, video                               |
| trailing, trailingKind                 | Trailing text (default) or decorative icon                                                  |
| lines                                  | 1, 2, 3 minimum-height/alignment configuration; inferred from secondary/overline if omitted |
| value                                  | Opts the row into its parent selection group; required for selectable rows                  |
| disabled, readOnly                     | Individual interaction restrictions; only supported on selectable rows                      |
| disableRipple                          | Suppress press ripple without removing focus feedback                                       |
| textValue                              | Plain typeahead label for custom primary markup; ordinary text is inferred                  |
| divider                                | Optional decorative divider with 16px logical insets                                        |
| ref, className, style, native li props | Apply to the li surface; ref is HTMLLIElement                                               |

Selected state comes from the parent value, not a second selected/checked prop on ListItem. The
interactive option is a native type=button inside a presentation li. Name/description ARIA props
on ListItem are forwarded to that option. Each row has one selection interaction; the indicator is
aria-hidden. Keep slots non-interactive and include any meaningful icon/image information in the
visible label or accessible name. Flags used solely as visual hints should be decorative.

List is an application selection component, not a native radio/checkbox form field. Read its
selected values through callbacks; form submission, validation and resetting application state stay
in the consumer. There is no automatic locale navigation, fetching, sorting, filtering, or currency
policy in the package. The examples demonstrate those composition boundaries.

## Appearance and interaction

Current ListTokens 29.0.0 use surface for item containers and secondaryContainer/onSecondaryContainer
for selected rows. Other primary text uses onSurface, supporting/overline/trailing text and icons
use onSurfaceVariant. Disabled foregrounds use onSurface at 38%; disabled surfaces and state layers
follow the pinned tokens. Shapes and type roles inherit the nearest CSS theme, including nested
light/dark/system scopes.

| Measurement                                 | Current default                                          |
| ------------------------------------------- | -------------------------------------------------------- |
| Minimum one/two/three-line height           | 56 / 72 / 88px                                           |
| Inline / block inset                        | 16 / 10px                                                |
| Content gaps / segment gap                  | 12 / 2px                                                 |
| Segmented corners                           | 4px inner, 16px outer; selected rows use 16px all around |
| Standard corners                            | Rectangular unselected, 16px selected                    |
| Expressive icon / avatar                    | 20 / 40px                                                |
| Image / small video                         | 56×56 / 100×56px; themed small (8px) corners             |
| Label / supporting / overline+trailing type | bodyLarge / bodyMedium / labelSmall                      |

Three-line rows align content to the top. Text can wrap and increase height; it is not silently
clipped or measured by JavaScript. The whole selectable row exceeds the 48px minimum target.
Selection is indicated by shape, color, and a radio dot, checkbox tick or checkmark.

Tab enters a selected option, or the first enabled option when nothing is selected. Up/Down move
focus; Home/End jump to the first/last enabled option; Space/Enter commit selection. Arrows do not
change the value on their own. Typing finds primary labels, with accent-insensitive prefix matching
and repeated-character cycling. Native Tab leaves the group; disabled options are skipped.

Hover/press state layers and an inset focus ring use compiled CSS. The existing private ripple
controller is shared with Button; geometry/lifetime work inserts no CSS rules. Shape transitions use
the sampled Expressive fast spatial spring. Reduced motion disables ripple/transitions; forced
colors retain selected contrast and visible focus. Modern :has() support is required alongside the
existing light-dark/color-mix/linear support contract.

## Reuse and boundaries

List/ListItem wrappers, their nested static implementations, shared SelectionIndicator, and ListItemContent presentation
remain server modules. SelectableList and SelectableListItem are client boundaries for interaction,
with an interaction-only context. ThemeProvider remains a server CSS scope.

Menu and Autocomplete can reuse the private content layout, slots, typography and token helpers.
Their future adapters must keep their own menuitem/option, highlighting, popup and keyboard
semantics; nesting this listbox inside a menu or autocomplete list is not the reuse mechanism.
Action lists, multi-action rows, expansion, swiping, tree/select-all behavior and virtualization are
outside this slice.

The Next fixture provides /lists, including a responsive two-column language/currency Dialog with
independent values and a currency filter. Storybook includes Components/List, Components/ListItem,
and Examples/Language and currency. These examples use local data; Flaut has not been migrated.

## Provenance and verification

Read on 2026-11-15:

- [MD3 Lists specs](https://m3.material.io/components/lists/specs), including the expanded common
  token table, [guidelines](https://m3.material.io/components/lists/guidelines), and
  [accessibility](https://m3.material.io/components/lists/accessibility), rendered in a browser.
- [AndroidX ListTokens.kt revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ListTokens.kt),
  version 29.0.0; CheckboxTokens.kt, RadioButtonTokens.kt and ListItem.kt at the same revision.
  Current selected secondary-container roles take precedence over older baseline diagrams.
- [Base UI ToggleGroup](https://base-ui.com/react/components/toggle-group),
  [Toggle render API](https://base-ui.com/react/components/toggle), and installed 1.9.0 source.

Measurements are independently adapted to CSS px/rem. No MUI/AndroidX implementation source was
copied; Figma parity is not claimed. Checks cover NodeNext/Bundler declarations, static modules
under react-server, pre-hydration HTML, streaming, real Next/Storybook builds, keyboard interaction,
controlled/uncontrolled selection, filtering, ripple, themes, RTL and automated accessibility in
Chromium.

The standalone [Checkbox](checkbox.md) and [Radio/RadioGroup](radio.md) own form semantics. List
reuses their decorative indicator without creating form controls. Use [Avatar](avatar.md) in an
avatar leading slot (`leading={<Avatar>AB</Avatar>}`, `leadingKind="avatar"`); plain text in that slot
is also wrapped in Avatar. List only reserves the default 40px slot.
