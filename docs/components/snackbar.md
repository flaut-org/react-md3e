# Snackbar

Transient messages on [Base UI Toast](https://base-ui.com/react/components/toast), exported from the
root or `/snackbar`. Each Snackbar owns a Toast provider; no mandatory application provider is needed.

```tsx
<Snackbar
  open={saved}
  message="Preferences saved"
  onClose={() => setSaved(false)}
  autoHideDuration={6000}
  action={
    <Button variant="text" onClick={undo}>
      Undo
    </Button>
  }
/>
```

`message` is required. `open`/`defaultOpen` control visibility; default closed. `onClose(event,reason)`
reports timeout, escapeKeyDown or closeButtonClick. `onOpenChange(false,event)` follows an accepted
close request. Either callback can return false or newly prevent the event to veto. A timeout has a
null event. A controlled parent must update open; the primitive never dismisses around its veto.

`autoHideDuration` is a non-negative millisecond value or null (default: persistent). Pointer hover,
focus inside and window blur pause the remaining duration. `disableWindowBlurListener` opts out of
window pausing. Localize the region with notificationsLabel and close action with closeText.
`showCloseButton` defaults false; `action` accepts application-owned actions. `priority` is polite
(default) or assertive; reserve assertive for urgent information. `anchorOrigin` selects top/bottom
and left/center/right, default bottom-center. `container` overrides the nearest CSS theme host.
Native div props/ref apply to the message container.

The live region announces without taking focus. Escape from the focused message/actions requests
close. Swipe dismissal and queue management are deliberately outside the public API. Render one
active notification per application position; multiple independent instances do not arrange a stack.
Keep critical information available elsewhere and provide sufficient time or persistent dismissal
for actions. Button actions are regular library components, with inversePrimary text in the Snackbar.

Precompiled appearance follows inverseSurface/inverseOnSurface, 4px corners, 48px minimum height,
viewport-safe width, and reduced-motion/forced-colors behavior. The portal body mounts after hydration
and inherits the CSS theme. Reference: [MD3 Snackbar specs](https://m3.material.io/components/snackbar/specs).
