# BottomSheet

MD3 BottomSheet on [Base UI Drawer](https://base-ui.com/react/components/drawer), exported from the
root and `/bottom-sheet`. BottomSheet and SideSheet share a private Sheet implementation for behavior.

```tsx
<BottomSheet aria-label="Passengers" trigger={<Button>Passengers</Button>}>
  <Typography>Passenger controls</Typography>
</BottomSheet>
```

An accessible name (`aria-label` or `aria-labelledby`) is required. `variant` is `modal` (default)
or `standard`. Modal sheets use a scrim, dialog semantics, focus containment and restoration,
scroll locking, outside/Escape dismissal, and swipe-to-dismiss. Standard sheets use complementary
semantics, stay in layout, and allow outside interaction without dismissing or trapping focus.

`open`/`defaultOpen`, `trigger`, `onOpenChange(open,event)`, `onOpenChangeComplete(open)`, and
`onClose(event,reason)` are supported. Close reasons: escapeKeyDown, backdropClick, closeButtonClick,
swipe, focusOut, programmatic. Returning false or newly preventing an event cancels the request.
A controlled parent must update open. `disableEscapeKeyDown`/`disableSwipe` opt out of those gestures.
A child interactive area can carry `data-base-ui-swipe-ignore=""` to keep its own pointer behavior.

`header`, `actions`, and children compose content. `showCloseButton` defaults true; localize it via
`closeText`. `keepMounted` preserves form state. `container` accepts an element or element-returning
callback. `initialFocus`/`finalFocus` accept booleans or HTMLElement refs. Native div props/ref apply
to the panel. Custom trigger components must forward props/ref.

`showDragHandle` defaults true. The decorative handle is 32×4px in a 48px region. The panel uses
28px top corners, full compact width, a 72px top clearance, and 56px margins above 640px.
Its content scrolls independently. Base UI keyboard handling is scoped inside the Drawer root.

Surfaces use theme roles surfaceContainerLow/onSurface. Portals inherit the nearest CSS theme scope.
Triggers render on the server; both modal and standard panel bodies mount through Base UI Portal
after hydration. This is a behavior boundary, with all appearance CSS compiled at build time.
CSS transforms follow Base UI swipe geometry and use the same spring curve as other library motion;
reduced motion disables transitions and forced colors retains contrast. Nested panels and
Autocomplete compose without closing their parent on the first Escape.

Reference: [MD3 BottomSheet specs](https://m3.material.io/components/bottom-sheets/specs).
Snap points, swipe-to-open regions and native platform parity are outside this initial API.
