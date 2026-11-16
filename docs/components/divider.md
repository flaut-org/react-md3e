# Divider

A server-compatible MD3 separator, exported from the root and `/divider`.

```tsx
<Divider variant="middle" />
<Divider orientation="vertical" flexItem />
```

`variant`: `fullWidth` (default), `inset` (16px at the logical start), `middle` (16px on both ends).
`orientation`: `horizontal` (default) or `vertical`. `flexItem` stretches a vertical divider across
its flex row. Without flexItem, give a vertical divider a containing block with a definite height.
Native hr attributes, style and ref are supported. `decorative` removes separator semantics.

The one-pixel rule uses `outlineVariant`; semantic dividers expose `aria-orientation`. No JS or
hydration is required. Forced colors uses CanvasText. Dimensions are web adaptations of the
[MD3 Divider specifications](https://m3.material.io/components/divider/specs).
