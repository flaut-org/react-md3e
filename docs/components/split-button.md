# SplitButton

SplitButton pairs a primary Button with a trailing Button opening the existing Menu. Import it
from the package root or `/split-button`, and load `/split-button/styles.css` at the composition
boundary. Its CSS closure includes Button, Menu, shared menu presentation and ripple; no separate
Button or Menu stylesheet import is required.

```tsx
<SplitButton
  menuButtonLabel="More send options"
  onClick={send}
  menu={
    <>
      <MenuItem onClick={schedule}>Schedule send</MenuItem>
      <MenuItem onClick={saveDraft}>Save draft</MenuItem>
    </>
  }
>
  Send
</SplitButton>
```

The wrapper is passive server-compatible composition. Button and Menu keep their existing client
boundaries. RSC can supply serializable labels and MenuItem children; callbacks belong in a client
consumer. SplitButton adds no state store, interaction primitive or theme provider.

## Contract

`children` supplies the primary label, `menu` contains ordinary Menu parts, and `menuButtonLabel`
is the required accessible name of the trailing button. `onClick` belongs only to the primary
button. Activating the trailing button or a menu item does not invoke it. Menu actions and any
subsequent primary-label changes remain application-owned.

`variant` is filled (default), tonal, outlined or elevated. Text styling and toggle selection are
not split-button variants. `size` uses Button's extraSmall, small (default), medium, large and
extraLarge names. `startIcon`, `disabled`, `loading`, `disableRipple` and `fullWidth` apply to the
pair; loading renders Button's existing indicator and disables both actions.

`buttonProps` forwards native button props/ref, form type/name/value, a loading indicator, and
individual disabling to the primary button. `menuButtonProps` supplies native button props/ref
and individual disabling to the trailing button. Its type, accessible name and expanded/menu
semantics remain owned by SplitButton/Menu. The prescribed chevron is not replaceable.

`open`, `defaultOpen`, `onOpenChange` and `onClose` follow Menu's controlled/uncontrolled and
cancelable callback contract. `menuProps` supplies the remaining Menu surface/position options,
including variant, density, grouped layout, placement, container and finalFocus. Default placement
is bottom-end, 4px from the trailing button, with Menu's normal collision handling. MenuGroup,
checkbox/radio items, dividers and submenus compose without an alternative option API.

Native div attributes/ref, className, style, direction and ARIA naming apply to the group. Plain
text children or the primary button's aria-label provide its default group name. Supply an explicit
group name for complex labels if desired; an icon-only primary button needs buttonProps.aria-label.
Both buttons are separate Tab stops, in leading-then-trailing order in LTR and RTL. Enter/Space
activate the focused button; ArrowDown/ArrowUp on the trailing button open Menu. Escape dismisses
the active menu level and restores focus through the existing Menu behavior.

## Geometry and motion

The two buttons share Button's colors, typography, disabled state, focus ring, ripple and 48px hit
area. They have 2px spacing, full outer corners, and size-dependent inner corners. Both trailing
width and primary-action geometry remain stable while the menu opens.

| Size       | Height | Primary start / end inset | Trailing icon | Trailing inset | Inner resting / interactive | Closed icon offset, LTR |
| ---------- | ------ | ------------------------- | ------------- | -------------- | --------------------------- | ----------------------- |
| extraSmall | 32px   | 12 / 10px                 | 22px          | 13px           | 4 / 8px                     | -1px                    |
| small      | 40px   | 16 / 12px                 | 22px          | 13px           | 4 / 12px                    | -1px                    |
| medium     | 56px   | 24 / 24px                 | 26px          | 15px           | 4 / 12px                    | -2px                    |
| large      | 96px   | 48 / 48px                 | 38px          | 29px           | 8 / 20px                    | -3px                    |
| extraLarge | 136px  | 64 / 64px                 | 50px          | 43px           | 12 / 20px                   | -6px                    |

Insets include the existing Button border in CSS box sizing. Theme shape roles can customize the
inner corners. Hover, keyboard focus and press morph the inner corners; the outer corners remain
full. When open, the trailing button becomes round and keeps its Button color with Menu's pressed
state layer. A held press takes precedence over the open shape. CSS logical layout and a mirrored
rotation/optical offset implement RTL without measuring the DOM.

The official guidelines require standard motion for the inward 180-degree chevron rotation, even
under an expressive theme. Its fast standard spatial curve is sampled through create-motion.ts
at build time and scoped through the existing spring token names on the chevron only. Corner
morphs and Menu unfolding use the inherited fast spatial spring; opacity uses fast effects.
There is no runtime spring solver or rule insertion. Reduced motion disables these transitions;
forced colors retain both buttons' boundaries/focus and Menu selection.

## Sources and verification

Read on 2026-11-20:

- Official [overview](https://m3.material.io/components/split-button/overview),
  [specs](https://m3.material.io/components/split-button/specs),
  [guidelines](https://m3.material.io/components/split-button/guidelines) and
  [accessibility](https://m3.material.io/components/split-button/accessibility), rendered in Chromium.
  These provide the standard-motion rotation, optical offsets, shape states, placement and Tab order.
- AndroidX [SplitButton.kt](https://github.com/androidx/androidx/blob/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt)
  and SplitButtonXSmall/Small/Medium/Large/XLargeTokens.kt under
  [tokens](https://github.com/androidx/androidx/tree/33b3d2d28722bf91670634ab0e707192330de497/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens),
  version 18_0_18. Only numerical data and semantic assignments were transcribed.
- [m3e Split Button](https://matraic.github.io/m3e/components/split-button.html) and
  [SplitButtonElement.ts](https://github.com/matraic/m3e/blob/54bb59c2a8270dd6fde905b68761d3e968cad81a/packages/web/src/split-button/SplitButtonElement.ts)
  informed the independent connected-button presentation. Official size tokens take precedence.
- [Button](button.md), [Menu](menu.md) and [motion](../motion.md) provide the existing implementation,
  source provenance, spring adaptation and Figma access limits.

No AndroidX/m3e implementation or icon source was copied. Exact Figma/video parity and physical
velocity preservation are not claimed. Alternative non-menu panels are outside this Menu-based API.

Colocated behavior/type tests cover independent actions, native forms/refs, controlled cancellation,
two Tab stops, submenu/checkbox persistence, all size/color geometries, standard rotation in both
motion schemes, RTL, reduced motion, forced colors, accessibility, SSR and streaming. Package checks
verify extracted CSS closure, reuse of Menu assets and the passive wrapper boundary. Browser
verification uses Chromium.
