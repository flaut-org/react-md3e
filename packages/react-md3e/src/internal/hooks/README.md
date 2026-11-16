# Internal hooks

Private React hooks live in this directory. Use kebab-case filenames ending in `*.hook.ts`,
for example `use-ripple.hook.ts`, and React function names such as `useRipple`.

Keep hooks out of public package exports unless a public hook API is explicitly introduced.
Hooks that use state, effects, or browser interaction retain their client boundary; their CSS
rules remain in separate build-time `*.styles.ts` modules. `use-ripple.hook.ts` imports the
compiled ripple classes from `../ripple/ripple.styles.ts`.

Keep optional behavior inside clear positive conditional blocks. Separate calculations and DOM
creation from lifecycle orchestration: `use-ripple.hook.ts` delegates measurement to
`../ripple/ripple-geometry.ts` and creates ink through a focused `createRippleInk` helper.

`use-portal-container.hook.ts` resolves a themed portal container and inherited direction from a
hidden DOM anchor. It reads DOM ancestry only, not computed style values; it does not create a
client theme context or insert CSS rules.

`use-list-typeahead.hook.ts` adds accent-insensitive label-prefix navigation to the public Base UI
ToggleGroup composite. It has no timers or rendering state; Base UI owns roving arrow-key focus.

`use-list-entry-focus.hook.ts` synchronizes the external listbox tab stop after selection/filtering
changes and on focus exit. It leaves Base UI's in-group navigation intact, forwards the public root
ref, and disconnects its observer when unmounted. It does not compute or mutate styles.

`use-merged-refs.hook.ts` combines internal/consumer object and callback refs and retains React 19
callback cleanup; TextField and Autocomplete use it without reading refs during rendering.
