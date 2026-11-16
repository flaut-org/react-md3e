# Collapsible

A disclosure utility on [Base UI Collapsible](https://base-ui.com/react/components/collapsible),
exported from the root and `/collapsible`. MD3 has no standalone Collapsible visual catalog;
this wrapper supplies disclosure behavior and height/opacity motion using our existing spring curve.

```tsx
<Collapsible trigger={<Button variant="text">More details</Button>} keepMounted>
  <Typography>Additional information</Typography>
</Collapsible>
```

`open`/`defaultOpen` control expansion. `onOpenChange(open,event)` can return false or newly prevent
the event to cancel. `trigger` is an optional element forwarding props/ref; without it the consumer
controls open programmatically. `disabled` disables the disclosure trigger. `keepMounted` retains
child state after closing and removes closed content from the tab order. `panelProps` configures the
panel's native div attributes/ref; remaining native div props apply to the root.

The trigger receives expanded/controls semantics and names the panel region by default. Base UI
measures height; precompiled CSS animates it and opacity. It never generates style rules. Reduced
motion removes transitions. Client behavior hydrates; initial root/trigger markup renders on the server.
