# Radio and RadioGroup

Radio composes Base UI Radio; RadioGroup composes Base UI RadioGroup. They are real form controls.
List's radio-style selection shares their private SelectionIndicator drawing but keeps its own
listbox/option semantics and keyboard behavior.

```tsx
'use client';

import { useState } from 'react';
import { Radio } from '@flaut-travel/react-md3e/radio';
import { RadioGroup } from '@flaut-travel/react-md3e/radio-group';

export function Cabin() {
  const [value, setValue] = useState('economy');

  return (
    <RadioGroup aria-label="Cabin" name="cabin" value={value} onChange={(_event, next) => setValue(next)}>
      <label>
        <Radio value="economy" /> Economy
      </label>
      <label>
        <Radio value="business" /> Business
      </label>
    </RadioGroup>
  );
}
```

| RadioGroup prop                                         | Contract                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| value / defaultValue                                    | Controlled string or null (nothing selected) / initial uncontrolled string   |
| onChange(event, value)                                  | Native Event and selected string; event.preventDefault() cancels the change  |
| name / form / required                                  | Shared native form field name/association and required validation            |
| disabled / readOnly                                     | Group restrictions apply to all descendant radios                            |
| row                                                     | Horizontal wrapping layout; default is vertical                              |
| dir                                                     | Explicit ltr/rtl synchronizes layout and Base UI horizontal arrow navigation |
| ref, children, className, style, native div ARIA/events | Visible div root; provide aria-label or aria-labelledby                      |

| Radio prop                                    | Contract                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| value                                         | Required string, unique within its RadioGroup                                |
| disabled / readOnly / required                | Per-control restrictions, in addition to group restrictions                  |
| error                                         | Error role and aria-invalid; associate supporting text with aria-describedby |
| disableRipple                                 | Suppress press ink while retaining focus feedback                            |
| ref / inputRef                                | Visible HTMLSpanElement / native HTMLInputElement                            |
| id, className, style, native span ARIA/events | Label association / visible control props                                    |

Always render Radio inside RadioGroup. The group owns checked state and its callback; Radio has no
independent checked/defaultChecked or onChange. This focused API does not implement standalone MUI
radio state. Changes report a native DOM Event, not a fabricated React.ChangeEvent. Form reset of
controlled application state belongs to the consumer's onReset.

Label each Radio with a wrapping label, htmlFor/id, aria-label or aria-labelledby, and label the group
separately. Each group is one Tab stop; arrows move focus and select while skipping disabled items,
and Space selects without clearing the current choice. This differs from the List listbox, where
arrow navigation only moves focus until activation. Required validation and FormData use Base UI's
real hidden radio inputs; the selected enabled value is submitted under the group name.

The ring is 20px with a 10px dot, within a 40px state layer and a 48px hit target. Colors inherit
primary, onSurfaceVariant, secondary focus and disabled onSurface at 38%. Error uses the theme error
role. Compiled hover/press layers, focus, dot transitions, ripple geometry CSS, reduced motion and
system forced colors follow the same control presentation as Checkbox. No theme context or runtime
CSS rule insertion is needed. Radio/RadioGroup hydrate for interaction; server HTML is already styled.

Components/Radio and Components/RadioGroup stories include controlled, disabled, readOnly, horizontal
and RTL examples. /selection-controls adds form values/validation, forwarded refs, server-created
light/dark themes and nested image/avatar examples. Colocated browser tests cover arrow selection,
skipping, group restrictions, one tab stop, RTL, ripple opt-outs through reduced motion, accessible
names, Storybook, pre-hydration and streaming output. Checkbox's form test also submits RadioGroup.

## References

- [Material radio button specifications](https://m3.material.io/components/radio-button/specs).
- [AndroidX RadioButtonTokens.kt, revision 89d9aa6a5b9fc6e4847002be42f3c6891b091c9e](https://github.com/androidx/androidx/blob/89d9aa6a5b9fc6e4847002be42f3c6891b091c9e/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/RadioButtonTokens.kt),
  v0_117 from the captured List reference; independently adapted to CSS, without implementation copying.
- [Base UI Radio Group](https://base-ui.com/react/components/radio-group), documentation and installed
  1.9.0 source read on 2026-11-15. Figma parity is not claimed.

Wrapping-label names are synchronized by Base UI during hydration. Supply explicit aria-label or
aria-labelledby when the custom control must already have its accessible name in server-only HTML.
