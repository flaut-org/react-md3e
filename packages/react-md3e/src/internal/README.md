# Internal

Private composition and interaction helpers belong here when needed by implemented components. Do
not export them from the package without a deliberate public API decision. Keep pure/server-safe
helpers independent of browser hooks and client-only primitives.

React hooks live in `hooks/` with kebab-case `*.hook.ts` filenames, such as
`hooks/use-ripple.hook.ts`. Hook function names use React conventions (`useRipple`). Component-specific
extracted styles remain in their own directories, such as `ripple/ripple.styles.ts`.
