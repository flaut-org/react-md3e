# Tooltip

Plain MD3 tooltips on [Base UI Tooltip](https://base-ui.com/react/components/tooltip), exported from
the root and `/tooltip`. Interactive panels belong in Popover; Tooltip supplies a description.

```tsx
<Tooltip title="Change language" placement="bottom">
  <IconButton aria-label="Language">…</IconButton>
</Tooltip>
```

`title` is the description; `children` must be one element forwarding the received props and ref.
A button keeps its accessible name and receives `aria-describedby`. Wrap a disabled control in a
focusable element with an appropriate accessible name/disabled semantics if keyboard access is needed.

`placement` supports top/bottom/left/right and `-start`/`-end`; default top. `enterDelay` defaults to
500ms, `leaveDelay` to 100ms. `disableHoverablePopup` defaults false so a pointer can enter the tip.
`open`, `defaultOpen`, `onOpenChange(open,event)`, `disabled`, and `container` are supported. Returning
false from onOpenChange or newly preventing its event cancels the transition. Empty titles disable it.
Native div props/ref apply to the popup.

Base UI owns hover/focus, Escape and collision handling. Content portals into the nearest CSS theme
scope after hydration; the trigger renders on the server. Plain tooltip appearance uses inverse
surface roles, bodySmall, a 4px corner, 4/8px padding and 24px minimum height. CSS motion respects
reduced motion; forced colors is supported. Reference:
[MD3 Tooltip specs](https://m3.material.io/components/tooltips/specs). Rich tooltips are outside this API.
