# Checkbox

Checkbox is a standalone MD3 form control built on Base UI Checkbox. List selection reuses its
private SelectionIndicator presentation; a ListItem remains one listbox option, with no nested
checkbox input or extra tab stop.

```tsx
'use client';

import { useState } from 'react';
import { Checkbox } from '@flaut-org/react-md3e/checkbox';

export function TravelUpdates() {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <Checkbox
        name="updates"
        value="yes"
        checked={checked}
        onChange={(_event, nextChecked) => setChecked(nextChecked)}
      />
      Travel updates
    </label>
  );
}
```

| Prop                           | Contract                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| checked / defaultChecked       | Controlled / initial uncontrolled boolean state                                                               |
| onChange(event, checked)       | Native DOM Event and next boolean; event.preventDefault() vetoes the change                                   |
| indeterminate                  | Controlled mixed appearance and aria-checked=mixed; the consumer clears this flag after activation            |
| disabled / readOnly            | Block changes; readOnly keeps the control focusable                                                           |
| error                          | Error/onError colors and aria-invalid; supply an error message via aria-describedby                           |
| required / name / value / form | Native hidden input validation, association and successful form values                                        |
| disableRipple                  | Suppress press ripple; retain keyboard focus feedback                                                         |
| ref / inputRef                 | Visible HTMLSpanElement / native HTMLInputElement                                                             |
| id                             | Label association with the hidden input; native span events/style/className/ARIA apply to the visible control |

Use a wrapping label, htmlFor/id, aria-label, or aria-labelledby. Labels are consumer composition;
there is no implicit label text prop. Unchecked and disabled fields are omitted from FormData.
Indeterminate is a visual/ARIA state independent of checked, which determines submission. Keep
application reset policy explicit with controlled state and the form's onReset when needed.

The callback uses a native Event from Base UI rather than fabricating a React.ChangeEvent. This is
an intentional API difference from MUI. Base UI types/event-detail objects are not public props.
There are no legacy color/size/icon or MD2 variant aliases in this slice.

The visual box is 18px with 2px corners/outline; its state layer is 40px inside a 48px interaction
target. Selected colors are primary/onPrimary, unselected outline onSurfaceVariant, and disabled
colors onSurface at 38% with surface for the selected mark. Mixed state uses a horizontal mark.
Focus uses secondary. Hover/press layers, check/mixed drawing and transitions compile to CSS.
The shared ripple hook only handles input coordinates/lifetime; reduced motion disables ripple and
transitions, and forced colors use system colors. Theme roles inherit through CSS in light/dark and
nested scopes, without a theme context.

Checkbox is a client boundary for Base UI behavior and ripple. Server HTML includes the styled
control and native input before hydration. Styling adds no runtime CSS engine. The /selection-controls
fixture and Components/Checkbox stories cover mixed, checked, error, disabled, readOnly and controlled
examples. Colocated tests exercise labels, Space, event veto, refs, native required validation and
FormData, themes, ripple, accessibility, streaming and pre-hydration HTML.

## References

- [Material checkbox specifications](https://m3.material.io/components/checkbox/specs).
- [AndroidX CheckboxTokens.kt, revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/CheckboxTokens.kt),
  version 14_1_0, read from the reference captured for List. Values are independently adapted to CSS;
  no AndroidX implementation code is copied.
- [Base UI Checkbox](https://base-ui.com/react/components/checkbox), documentation and installed 1.9.0
  source inspected on 2026-11-15. Figma parity is not claimed.

Wrapping-label names are synchronized by Base UI during hydration. Supply explicit aria-label or
aria-labelledby when the custom control must already have its accessible name in server-only HTML.
