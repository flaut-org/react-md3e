# ButtonGroup

Expressive standard and connected groups on
[Base UI ToggleGroup/Toggle](https://base-ui.com/react/components/toggle-group). Import ButtonGroup
and ButtonGroupButton from the root or `/button-group`.

```tsx
<ButtonGroup aria-label="Appearance" defaultValue="system">
  <ButtonGroupButton value="light">Light</ButtonGroupButton>
  <ButtonGroupButton value="dark">Dark</ButtonGroupButton>
  <ButtonGroupButton value="system">System</ButtonGroupButton>
</ButtonGroup>
```

Supply aria-label or aria-labelledby. `selectionMode` is `single` (default, string/null), `multiple`
(string array), or `none` (ordinary actions). Use value/defaultValue for selection and
`onChange(event,value)` to observe it; returning false or newly preventing the event cancels it.
`allowEmpty` defaults false for single selection; multiple selection can always be empty. No hidden
form field is provided; use the application state for submission.

`variant` is `connected` (default, 2px gaps and joined corners) or `standard` (12px gaps and independent
button shapes). `buttonVariant` is tonal (default), filled, outlined or elevated. Text buttons are
excluded because these groups require visible containers. `size` accepts all five Button sizes;
`orientation` is horizontal/vertical. disabled/fullWidth and native div props/ref are supported.
Explicit or inherited HTML dir="rtl" sets keyboard direction.

ButtonGroupButton requires a unique value and accepts Button props except component/href/variant/
size/selected. Selection remains group-owned; in none mode each child's onClick handles its action.
Base UI owns roving focus, arrow navigation, Enter/Space and pressed semantics. The group does not
pretend to be a radio form field. Selected connected buttons become round; standard groups respond
to presses by resizing the active/adjacent buttons. CSS spring motion honors reduced motion.

Reference: [MD3 Expressive Button groups](https://m3.material.io/components/button-groups/specs).
The web adapter uses explicit child composition rather than Android's platform-specific APIs.
