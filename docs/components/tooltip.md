# Tooltip

`Tooltip` is exported from the root and `/tooltip`. `variant="plain"` (default) provides a short,
noninteractive description. `variant="rich"` provides a longer explanation with an optional headline
and up to two relevant text actions. JSX never selects a visual variant automatically. Forms and
general interactive panels belong in Popover.

```tsx
<Tooltip title={<>Delete <strong>selected items</strong></>}>
  <IconButton aria-label="Delete">…</IconButton>
</Tooltip>

<Tooltip
  variant="rich"
  headline="Baggage allowance"
  title={<Typography variant="bodyMedium">Carry-on baggage: 8 kg.</Typography>}
  actions={<Button variant="text" onClick={reviewAllowance}>Review allowance</Button>}
>
  <IconButton aria-label="Baggage information">…</IconButton>
</Tooltip>
```

## Content and API

`title` is a ReactNode: strings, numbers (including zero), elements, fragments, arrays and consumer
components render directly through React. Portals preserve React context. Open content can update
synchronously or asynchronously; Base UI observes size changes and recalculates positioning.
`null`, `undefined`, booleans, empty strings and recursively empty arrays/fragments disable the popup,
including when `open` is true. Consumer components are not executed to inspect their output; if a
component renders nothing, pass a null `title` to disable the tooltip explicitly.

| Prop                                 | Contract                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `variant`                            | `'plain'` (default) or `'rich'`; independent of content type                             |
| `title`                              | Required ReactNode supporting text/content; retains the existing meaning                 |
| `children`                           | One element forwarding received props and ref                                            |
| `headline`                           | Rich-only ReactNode, rendered with titleSmall and used as the dialog name                |
| `actions`                            | Rich-only ReactNode; at most two short text buttons or a relevant link                   |
| `persistent`                         | Rich-only; click/tap activation, no hover/focus activation or mouseout dismissal         |
| `open`, `defaultOpen`                | Controlled state or initial uncontrolled state                                           |
| `onOpenChange(open, event)`          | Returning false or newly preventing the native event cancels a transition                |
| `placement`                          | top/bottom/left/right, optionally `-start`/`-end`; plain defaults top, rich bottom-start |
| `offset`                             | Anchor gap in CSS pixels; default 4 for bounded controls, use 8 for unbounded text       |
| `arrow`                              | Optional Material 16 × 8 caret; default false, as in AndroidX                            |
| `enterDelay`, `leaveDelay`           | Hover delays; retain the existing 500ms / 100ms defaults                                 |
| `enterTouchDelay`, `leaveTouchDelay` | Long press threshold 700ms; plain release delay 1500ms                                   |
| `disableTouchListener`               | Disables long press activation                                                           |
| `disableInteractive`                 | Plain-only opt-out from hoverable content; default false                                 |
| `disableHoverablePopup`              | Existing plain alias; explicit disableInteractive takes precedence                       |
| `disabled`                           | Disables the hint without disabling its child action                                     |
| `container`                          | HTMLElement or resolver; nearest CSS theme/portal scope by default                       |

Native div attributes and ref apply to the popup. `TooltipProps`, `TooltipPlacement` and
`TooltipVariant` are public types. Rich tooltips require a nonempty headline, `aria-label` or
`aria-labelledby`. TypeScript checks that a naming option is supplied; runtime validation rejects
structurally empty names. A JSX headline is rendered and referenced by ID, never converted to text.
Use an explicit ARIA name when `title` contains a custom heading instead of the headline slot.

## Interaction and accessibility

Plain uses Base UI Tooltip, `role="tooltip"` and `aria-describedby`, preserving the trigger's
accessible name and existing description. Focus stays on the trigger. Do not place links, buttons or
other focusable elements in plain content. `disableInteractive` also removes pointer events; this
opt-out does not meet the hoverability part of WCAG 1.4.13 for information available only in the hint.

Rich uses Base UI Popover internally with `role="dialog"`, `aria-haspopup="dialog"`, `aria-expanded`
and `aria-controls`. This follows APG nonmodal semantics for a hover containing focusable elements.
There is no focus trap or focus transfer on hover/focus activation. Tab/Shift+Tab reach actions and
the surrounding document. Escape dismisses it and restores focus when it was inside; leaving by Tab
or clicking elsewhere retains outside focus. Rich cannot disable interactivity. Text is selectable;
actions do not implicitly dismiss the tooltip. Close a controlled tooltip in an action if desired.

Hover opening is applied through controlled Root state: Base UI 1.9.0's own hover transition disables
its focus manager while retaining a trigger Tab guard. Cancelling that primitive transition after
accepting our state change keeps Base UI's nonmodal focus navigation active with initialFocus false.
This also makes switching from pointer input to keyboard input reach real content rather than a guard.

Transient rich opens on hover, visible keyboard focus or long press. The pointer can cross the gap
using Base UI's safe hover region. Focus inside the trigger or popup keeps it open. For touch, rich
content stays available after release until outside interaction, focus departure or Escape so an
action is reachable without a reading deadline. Quick taps retain the anchor's action; a long press
suppresses its following click/context menu. Movement over 10 CSS pixels or pointer cancellation
cancels a pending long press; the threshold is a web gesture tolerance.

Persistent rich opens only by click/tap (or controlled/default state). It stays open after mouseout,
and dismisses on Escape, focus departure or outside interaction. Avoid persistent rich tooltips on
icon buttons, as Material recommends. Wrap disabled native controls in a focusable, named element
with `aria-disabled` when descriptions must be reachable by keyboard.

## Appearance and positioning

| Attribute          | Plain                                | Rich                                                     |
| ------------------ | ------------------------------------ | -------------------------------------------------------- |
| Container / text   | inverseSurface / inverseOnSurface    | surfaceContainer / onSurfaceVariant                      |
| Corners            | extraSmall (4px)                     | medium (12px)                                            |
| Typography         | bodySmall                            | titleSmall headline, bodyMedium body, labelLarge actions |
| Elevation          | 0                                    | 2                                                        |
| Padding            | 4px vertical / 8px horizontal        | 12px top / 16px sides / 8px bottom                       |
| Min width / height | 40px / 24px, constrained by viewport | 40px / 24px, constrained by viewport                     |
| Max width          | 200px                                | 320px                                                    |

Dimensions map Material/AndroidX dp to CSS pixels. Theme variables supply colors, type, corners and
elevation, including custom/light/dark/dynamic palettes. Rich uses a 4px headline/body gap, 16px
body/action separation and a 36px minimum action row. CSS gaps adapt AndroidX baseline distances to
browser line boxes; custom child typography changes those baselines. Actions wrap when needed for
narrow viewports or zoom. Use slots for the prescribed layout; arbitrary JSX retains its own styles.
Body overflow scrolls when viewport space is exhausted.

Both variants use fixed Base UI positioning, flip/shift collisions, an 8px viewport margin, logical
start/end alignment and tracked anchor/content geometry. Scroll containers do not clip the default
portal. Caller-supplied containers or theme scopes can still introduce clipping or transformed
containing blocks; place custom hosts outside those ancestors. Direction is inherited when the host
resolves; pass `dir` explicitly for an independently changing direction. The trigger renders on the
server; portal content mounts after hydration.

The 0.8 → 1 scale uses shared fast spatial motion; opacity uses fast effects, following AndroidX.
CSS extraction owns every rule. Reduced motion removes finite transitions; forced colors supplies
a system border/surface. No styling runtime, dependency, client theme provider or additional server
boundary is introduced.

## Sources, adaptations and audit (2026-11-26)

The requested [Material overview](https://m3.material.io/components/tooltips/overview),
[guidelines](https://m3.material.io/components/tooltips/guidelines),
[specs](https://m3.material.io/components/tooltips/specs) and
[accessibility](https://m3.material.io/components/tooltips/accessibility) return a JavaScript-only shell
to the text reader. The supplied [specification mirror](https://www.getbook.com/en/book/material-design-3/components/tooltips/specs)
and [guidelines mirror](https://www.getbook.com/en/book/material-design-3/components/tooltips/guidelines)
were readable; mirror accessibility was unavailable. The mirror confirms rich colors, padding,
headline/body/actions, placement and persistent activation.

Primary implementation evidence is AndroidX revision `009564af4f3f92df06e213711cb5327ceabc4e47`:

- [PlainTooltipTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/PlainTooltipTokens.kt): colors, shape, bodySmall.
- [RichTooltipTokens.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/RichTooltipTokens.kt), v0_210: colors, medium shape, elevation 2 and typography.
- [Tooltip.kt](https://github.com/androidx/androidx/blob/009564af4f3f92df06e213711cb5327ceabc4e47/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Tooltip.kt): dimensions, optional caret, anchor gap, layout metrics and fast spatial/effects motion.
- [Compose guide](https://developer.android.com/develop/ui/compose/components/tooltip): optional rich title/actions and hover/long press input.
- [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and
  [WCAG 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html): description semantics,
  nonmodal dialog for focusable content, dismissal, hoverability and persistence.
- [MUI guide](https://mui.com/material-ui/react-tooltip/) and [API](https://mui.com/material-ui/api/tooltip/):
  ReactNode title, disableInteractive and touch delay conventions only. No MUI visual style or source is copied.
- Installed Base UI 1.9.0 [Tooltip](https://base-ui.com/react/components/tooltip) and
  [Popover](https://base-ui.com/react/components/popover) source/types: safe hover regions, portals,
  ResizeObserver positioning, dismissal and nonmodal focus. No primitive implementation is copied.

Web decisions: all rich tooltips use dialog semantics so consumer components can contain actions
without DOM inspection; the name is explicit. Existing hover delays are retained instead of Material's
1.5s departure delay. Touch rich has no timeout. Base UI shifts continuously for collisions instead
of quantizing to 8dp. These are browser/accessibility adaptations. `title` describes rather than
replacing the child's name (MUI describeChild behavior); MD2 styles and Popper/slot APIs are absent.

The audit covers both variants' tokens, DOM semantics, motion configuration and Chromium interaction.
Figma access, frame/pixel parity, manual screen-reader and other-browser verification are not claimed.
Tests attach screenshots and assert computed styles; there is no existing whole-tooltip screenshot
baseline suite. Colocated tests and `/tooltips` / Storybook demonstrate reproducible cases. README
retains a partial verification status.
