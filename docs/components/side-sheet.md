# SideSheet

MD3 SideSheet on [Base UI Drawer](https://base-ui.com/react/components/drawer), exported from the
root and `/side-sheet`. BottomSheet and SideSheet share a private Sheet implementation for behavior.

```tsx
<SideSheet aria-label="Settings" trigger={<Button>Settings</Button>}>
  <Typography>Settings controls</Typography>
</SideSheet>
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

`anchor` is logical `end` (default) or `start`. Explicit or inherited RTL chooses the physical edge.
Modal panels have 16px inward corners, 360px default width, a 400px maximum and a viewport-safe
width on narrow screens. Standard panels occupy normal document layout.

Surfaces use theme roles surfaceContainerLow/onSurface. Portals inherit the nearest CSS theme scope.
Triggers render on the server; both modal and standard panel bodies mount through Base UI Portal
after hydration. This is a behavior boundary, with all appearance CSS compiled at build time.
CSS transforms follow Base UI swipe geometry and use the same spring curve as other library motion;
reduced motion disables transitions and forced colors retains contrast. Nested panels and
Autocomplete compose without closing their parent on the first Escape.

Reference: [MD3 SideSheet specs](https://m3.material.io/components/side-sheets/specs).
Snap points, swipe-to-open regions and native platform parity are outside this initial API.

Automated accessibility checks omit Base UI's empty focus guards, which redirect Tab through the
inline portal; the standard panel's focus entry/exit is covered by keyboard tests.
