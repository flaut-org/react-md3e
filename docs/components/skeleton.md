# Skeleton

A decorative loading placeholder, available from the root or `/skeleton`. It is a Server Component:
no hooks, hydration, or style calculation. MD3 does not specify a separate Skeleton catalog; this is
a web loading utility using the theme's `onSurface` tint and corner roles.

```tsx
<Skeleton variant="rounded" width="100%" height={120} animation="wave" />
```

`variant`: `text` (default), `rectangular`, `rounded`, `circular`. `animation`: `pulse` (default),
`wave`, or `false`. `width`/`height` accept native CSS sizing values. Native span attributes and ref
are supported. Sizing uses ordinary inline width/height, with no generated rules. Other styling is
precompiled; reduced motion disables animation and forced colors preserves the boundary.

Skeleton is `aria-hidden` and `inert`; optional children are hidden while supplying intrinsic size.
Put `aria-busy` and an accessible loading message on the surrounding application region. A placeholder
never supplies loading status by itself. See `/essentials`, Storybook, and colocated tests.
