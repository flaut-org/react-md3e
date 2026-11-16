# TextField

TextField provides MD3 filled and outlined fields. Autocomplete composes the same component through
its input/container slots; labels, helper text, colors, adornments and outlines have one implementation.

```tsx
'use client';

import { useState } from 'react';
import { TextField } from '@flaut-org/react-md3e/text-field';

export function Traveler() {
  const [name, setName] = useState('');

  return (
    <TextField
      label="Traveler name"
      name="traveler"
      value={name}
      onChange={(event) => setName(event.target.value)}
      helperText="Name shown on your booking"
      required
    />
  );
}
```

| Prop                                                        | Contract                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| variant                                                     | outlined (default) or filled; no standard/MD2 alias                                             |
| label                                                       | Visible floating label; without one, supply aria-label or aria-labelledby                       |
| helperText / error                                          | Supporting text linked by aria-describedby; error applies error roles and aria-invalid          |
| value / defaultValue / onChange                             | Standard controlled/uncontrolled native input behavior; onChange is a React change event        |
| disabled / readOnly / required                              | Native control restrictions/validation; only disabled omits the field from submission           |
| name / form / type / autoComplete / native input attributes | Passed to the actual control; native constraints such as email, pattern and maxLength apply     |
| multiline / rows                                            | Native textarea with a fixed initial number of rows (default 3) and vertical browser resizing   |
| InputProps.startAdornment / endAdornment                    | Leading/trailing content; decorative icons should be aria-hidden                                |
| InputProps.ref and native div props                         | Input container ref/events, separate from the whole field root                                  |
| InputLabelProps.shrink                                      | Force a floating (true) or resting (false) label; omitted follows focus/value/autofill          |
| inputProps / slotProps.htmlInput                            | Native control props; slotProps.htmlInput takes precedence over inputProps                      |
| slots.input / slots.htmlInput                               | Replacement container/control components forwarding native props and refs; used by Autocomplete |
| fullWidth                                                   | Fill available inline width; otherwise 280px, constrained by the parent                         |
| ref / inputRef                                              | Outer HTMLDivElement / HTMLInputElement or HTMLTextAreaElement                                  |
| className / style / dir                                     | Root styling/direction; native input events and ARIA target the control                         |

TextFieldInputProps and onChange use the input/textarea element union. Narrow the actual element if
consumer code requires input-only methods. Ref composition supports object refs and React 19 callback
cleanup. id identifies the input, not the outer root. Container/control slot components must forward
refs and the supplied native input props. Reserve controlled value, id, disabled, required and
readOnly for the field's own props.

The label has an explicit htmlFor/input id link and aria-labelledby reference; helper text IDs are
also connected in server HTML. Explicit input aria-label/aria-labelledby is respected. The label
reference continues to work when a popup's focus manager temporarily hides neighboring label nodes.
Input/helper associations do not wait for effects. Placeholder is supplementary text, not a label.

A native input composes Base UI Input. The multiline branch is a native textarea; Base UI has no
textarea primitive in the installed release. Each supports normal form values and browser validation.
External validation supplies error/helperText; TextField does not automatically turn every initially
required empty field red. Reset controlled state in the consumer's onReset; uncontrolled values use
the native reset behavior.

## Appearance and server boundaries

The default single-line minimum container is 56px with 16px inline insets and the theme's extra-small
corner (default 4px). Outlined uses a 1px outline and 2px focused outline; filled uses
surfaceContainerHighest with a 1px/2px bottom indicator. Filled bottom corners are square. BodyLarge
styles the input/resting label and adornment text, BodySmall the floating label/helper. Leading and
trailing decorative icons are 24px. Input text is onSurface, ordinary label/helper onSurfaceVariant,
focus primary and error error. Disabled foreground is onSurface at 38%; outlines/containers follow
the pinned tokens. Colors, font families and shape inherit the nearest CSS theme.

CSS focus/placeholder/autofill selectors drive floating labels. Placeholder visibility inherits a
CSS variable from that state; combining placeholder-shown selectors directly with ::placeholder
would trigger an incorrect prefixed selector in the current CSS compiler. The outline notch uses a fieldset and
legend with the same label typography; browser layout supplies its width. There is no JS text/style
measurement, animation loop or CSS rule insertion. Fixed-row textareas grow the container through
native layout. Label position, transform, font size, line height and letter spacing transition
together so focus/blur and interrupted transitions do not introduce geometry jumps. Reduced motion
removes label transitions; forced colors retain outlines and focus.

TextField is a client boundary for Base UI Input, generated accessible IDs and refs. It can be
instantiated from RSC and arrives as styled input/label/helper HTML before hydration. Styling itself
has no client provider or runtime CSS dependency. /fields and /streaming exercise the built package;
Components/TextField has interactive, filled, outlined, required, error, disabled, readOnly, adornment,
multiline and RTL stories.

Colocated browser/type tests cover label/helper relationships, floating/notch states, controlled and
uncontrolled values, form constraints/FormData, textarea input, refs, slot forwarding, themes, RTL,
forced colors, reduced motion, pre-JavaScript HTML, streaming and Storybook.

## References and limits

Read on 2026-11-15:

- [Material text-field specifications](https://m3.material.io/components/text-fields/specs).
- [OutlinedTextFieldTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/OutlinedTextFieldTokens.kt),
  v0_103, and [FilledTextFieldTokens.kt](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilledTextFieldTokens.kt),
  v0_210, at revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e. Tokens were read directly; values were
  independently adapted to CSS. No AndroidX or MUI implementation was copied.
- [Base UI Input](https://base-ui.com/react/components/input), documentation and installed 1.9.0 source.

This slice has no select mode, JS textarea autosizing/minRows/maxRows, density/legacy size aliases,
counter, MUI System/sx or complete MUI slot API. Figma visual parity is not claimed.
