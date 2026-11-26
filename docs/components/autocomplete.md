# Autocomplete

Autocomplete selects values through the existing TextField. It uses Base UI Combobox for selection,
virtual focus, keyboard navigation, form inputs, positioning and dismissal. Base UI's separately
named Autocomplete is a text-suggestion primitive without selected-value state; that is a different
contract from the selection component exposed here.

```tsx
'use client';

import { useState } from 'react';
import { Autocomplete, TextField } from '@flaut-travel/react-md3e';

const cities = [
  { code: 'PAR', name: 'Paris' },
  { code: 'ROM', name: 'Rome' },
];

export function Destination() {
  const [value, setValue] = useState<(typeof cities)[number] | null>(null);

  return (
    <Autocomplete
      options={cities}
      value={value}
      onChange={(_event, next) => setValue(next)}
      getOptionLabel={(city) => city.name}
      getOptionValue={(city) => city.code}
      getOptionKey={(city) => city.code}
      isOptionEqualToValue={(option, selected) => option.code === selected.code}
      name="destination"
      renderInput={(params) => <TextField {...params} label="Destination" helperText="Choose a city" />}
    />
  );
}
```

For the common case, omit renderInput and pass label, helperText, variant, error and placeholder to
Autocomplete directly. options must be a flat array of non-null values. Strings and objects with a
string label work by default; other object shapes require getOptionLabel. Supply getOptionKey for
stable IDs, particularly with duplicate display names. Use isOptionEqualToValue when externally
recreated objects identify the same option.

| Prop                                                 | Contract                                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| options                                              | Available strings/objects; caller owns fetching, grouping policy and ordering                          |
| multiple                                             | Enable array selection and removable input chips using the public Chip                                 |
| value / defaultValue                                 | Single: option or null; multiple: option array. Omitted value is uncontrolled                          |
| onChange(event, value, reason)                       | Native Event, typed selected value, selectOption/removeOption/clear                                    |
| inputValue / defaultInputValue                       | Independent controlled / initial uncontrolled search text                                              |
| onInputChange(event, text, reason)                   | Native Event, text and input/clear/selectOption/blur/reset                                             |
| getOptionLabel / getOptionKey                        | Display string / stable React key                                                                      |
| getOptionValue                                       | Form string; default string or object.value, then display label                                        |
| getOptionDisabled / isOptionEqualToValue             | Per-option disabling / identity comparison (default Object.is)                                         |
| filterOptions(options, state)                        | External filter receiving inputValue/getOptionLabel; its results replace local filtering               |
| filterSelectedOptions                                | Omit selected values from suggestions, including with an empty query                                   |
| renderInput(params)                                  | TextField composition; preserve id, slots, slotProps.htmlInput, inputRef and InputProps.ref/adornments |
| renderOption(props, option, state)                   | Return a single element spreading supplied props/ref; state contains selected/inputValue/index         |
| label/helperText/variant/error/placeholder/fullWidth | Shared TextField appearance and supporting text                                                        |
| name/form/required                                   | Submit/validate selected values through Base UI's native hidden inputs                                 |
| disabled/readOnly                                    | Reject interaction; readOnly keeps input focusable and chips unremovable                               |
| disableClearable                                     | Hide the clear action; direct text editing still follows Base UI input behavior                        |
| autoHighlight                                        | Automatically highlight the first matching option after typing                                         |
| openOnFocus                                          | Open on focus; default false. Clicking the input opens suggestions                                     |
| disableListWrap                                      | Stop arrow navigation at the list ends                                                                 |
| open/defaultOpen/onOpen/onClose                      | Controlled/initial popup state and native-event callbacks                                              |
| onClose reason                                       | escape/selectOption/blur/toggleInput                                                                   |
| loading/loadingText/noOptionsText                    | Busy state and empty-list messages; loading text replaces the empty message                            |
| clearText/openText/closeText                         | Accessible action labels; clearText also prefixes chip-removal names                                   |
| container                                            | Optional HTMLElement or callback; default portal stays in the nearest CSS theme/parent portal          |
| ref/inputRef                                         | Outer HTMLDivElement / visible input ref                                                               |
| dir/className/style/native div props                 | Root composition and explicit direction                                                                |

Native change events are passed through rather than inventing React.ChangeEvent or exposing Base UI
event-detail objects. Selected-value callbacks and query callbacks are independent. React generic
inference derives the option type from options and rejects mismatched single/multiple value shapes.

## Composition and interaction

TextField remains the actual input implementation. Autocomplete supplies container/control slots for
Base UI InputGroup or Chips and a private Combobox input adapter. The adapter leaves required
validation on the selected-value input: merely typing a matching label is not a valid required
selection. Multiple values submit repeated native field entries; use FormData.getAll(name).

When customizing renderInput, spread params and merge InputProps to keep its ref/end adornments:

```tsx
renderInput={(params) => (
  <TextField
    {...params}
    label="Destination"
    InputProps={{ ...params.InputProps, startAdornment: <span aria-hidden="true">✈</span> }}
  />
)}
```

A renderOption root owns the supplied role/id/events/ref. Keep custom option content non-interactive.
Default rows reuse MenuItemContent, its item styles, SelectionIndicator and ripple with their own
Combobox.Item semantics. MenuSurface supplies the same presentation as Menu without mounting a
Menu root or moving focus into menu items. A selectable List is not nested inside the popup.
Custom option roots retain their supplied props/ref; their children receive the same inverse-scale
body wrapper as default options so text does not stretch during unfolding. Private chips support keyboard/pointer
removal and inherit selection-control behavior from Base UI; they are not a public Chip component.
A small render adapter omits Base UI 1.9.0's unsupported aria-readonly attribute on generic chip divs;
readOnly behavior is owned by the Combobox root and removal controls.

DOM focus stays on the input; aria-activedescendant identifies the highlighted option. Arrows
navigate and skip disabled options; Enter selects; Escape closes the suggestions before a parent
Dialog; Tab leaves the control. Multiple selection keeps the popup open, and an empty input supports
Backspace removal. Selected values are not replaced by arrow navigation alone.

Uncommitted search text resets to the selected label on close, or clears when nothing is selected.
That is Base UI's selected-value behavior. Automatic cleanup reports reset, rather than a user clear.
For remote search, control inputValue and handle onInputChange reasons deliberately. The fixture
preserves typed text through result updates/blur by accepting input/clear/selectOption and ignoring
cleanup resets. Use filterOptions={(options) => options} with externally filtered results; do not
filter server results a second time. The library does not fetch data or own cancellation, debounce,
request ordering or caching. The AsyncSearch story demonstrates cancelling stale local timers.

## Theme, motion and server behavior

Filled/outlined fields inherit TextField tokens. The popup shares MenuSurface and MenuItemContent
with the Expressive Menu: surfaceContainerLow, large/16px corners, level-3 elevation, 4px padding,
2px option spacing and labelLarge (14/20) text. Rows have 48px minimum targets, 16px horizontal insets
and medium/12px selected corners. Selection uses tertiaryContainer/onTertiaryContainer and a leading
checkmark. Virtual focus keeps the shared 3px secondary focus ring while DOM focus stays in the input.
These presentation components live at the top component level because both families use them;
they are private and expose no new public API.

The menu stays aligned to the field width, including full-width fields wider than Menu's usual
280px maximum. Its surface scrolls within 480px and the available viewport, and keyboard navigation
scrolls the highlighted result into view. Text roles, shapes, RTL, light/dark and nested themes inherit
through CSS. Portals wait for the existing hook to resolve their nearest theme/parent portal after
refs mount; no styles or computed theme values are copied. Base UI still owns popup geometry,
filtering, selected values, form inputs and combobox accessibility.

The shared surface unfolds with fast spatial and fades with fast effects, just like Menu. Inherited
CSS progress and inverse option-body transforms keep default/custom option text at its natural size.
Empty/loading messages use the same compensation. Base UI retains the exiting popup until transitions
finish. CSS rules and transitions compile at build time. Reduced motion removes finite transitions;
forced colors retain virtual focus, selection and popup boundaries. Automatic CSS loading includes the shared presentation without loading Menu interaction,
its trigger/submenu styles or Popover.

Autocomplete/TextField hydrate for interaction; RSC can instantiate them with serializable options
and default values. Server HTML contains the styled labeled input and selected display label before
hydration; opening a popup is client behavior. Function props such as getOptionLabel/renderInput
belong in a consumer client boundary. There is no runtime CSS engine or client theme context.

/fields, streamed /streaming content and Components/Autocomplete stories cover these contracts.
Colocated tests verify object identity, callbacks, controlled/uncontrolled state, accents, disabled
options, keyboard/pointer selection, chips, remote/empty/loading results, native required selection,
serialized form values, nested Dialog focus, dark scoped portals, mobile bounds, RTL, system colors,
SSR and Storybook.

Base UI's typeable popup temporarily hides outside content from the accessibility tree while keeping
native Tab/outside-pointer dismissal. Automated checks cover the whole page with the popup closed
and the active popup while open; keyboard/focus tests cover transitions. Label IDs are explicitly
referenced so the input remains named even when its visible sibling label is temporarily hidden.
This is not a claim that an unscoped axe run on Base UI's transient hidden background reports no
aria-hidden-focus findings. No accessibility rule is globally disabled.

## References and limits

Read on 2026-11-15; Expressive presentation rechecked on 2026-11-20:

- [Material text fields](https://m3.material.io/components/text-fields/specs) and
  [menus](https://m3.material.io/components/menus/guidelines), adapted to a web combobox.
- [AndroidX MenuTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MenuTokens.kt),
  v0_210 at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e, plus [TextField references](text-field.md).
- The updated Expressive common token table and FastSpatial/FastEffects assignment recorded in
  [Menu](menu.md) supersede the old baseline popup appearance. Autocomplete reuses that implementation.
- The requested [m3e Autocomplete](https://matraic.github.io/m3e/components/autocomplete.html),
  [OptionPanelElement.ts](https://github.com/matraic/m3e/blob/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src/option/OptionPanelElement.ts)
  and [OptionElement.ts](https://github.com/matraic/m3e/blob/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src/option/OptionElement.ts)
  confirm menu-style listbox presentation, large panel corners, labelLarge option typography,
  tertiary selection and a leading checkmark. The official common token table takes precedence over
  m3e's surfaceContainer and panel height. Existing 48px web targets are retained.
- [Base UI Combobox](https://base-ui.com/react/components/combobox) and
  [Autocomplete](https://base-ui.com/react/components/autocomplete), documentation and installed 1.9.0 source.

No MUI/AndroidX implementation was copied; Figma parity is not claimed. This first selection adapter
has no freeSolo/create-option mode, grouped/virtualized results, public Chip API or full MUI prop/slot
compatibility. Those need separate behavior/design work; unsupported props
are rejected by TypeScript.

## Focus and Escape migration options

`selectOnFocus` (default false) selects the complete input text on focus, preserving selection
through the pointer's mouse-up. `clearOnEscape` (default false) clears selection/query only while
the listbox is closed; the first Escape closes an open listbox. disableClearable also prevents
Escape clearing. Input/selection callbacks report the clear reason. With clearing disabled a closed
Autocomplete preserves its value and lets Escape reach a parent Dialog, Popover or Sheet.

Controlled inputValue updates during the closing animation remain authoritative after the popup
unmounts. Deferred primitive cleanup does not emit an obsolete reset that overwrites that query.
