# Avatar

Avatar owns the image/initials presentation previously embedded in the List leading slot. It is
available from the package root and /avatar. List can allocate its avatar slot without owning the
avatar's colors, shape, typography or image loading.

```tsx
import { Avatar, List, ListItem } from '@flaut-org/react-md3e';

export function Travelers() {
  return (
    <List>
      <ListItem
        primary="Alex Morgan"
        secondary="Trip organizer"
        leading={<Avatar src="/alex.jpg">AM</Avatar>}
        leadingKind="avatar"
      />
    </List>
  );
}
```

This image is decorative because the adjacent list text names the person. For a standalone meaningful
avatar, set alt="Alex Morgan". The visible avatar root owns one role=img accessible name throughout
loading, failure and success; the inner img/fallback do not create duplicate names. Empty alt defaults
to decorative aria-hidden=true. Explicit aria-hidden is respected; aria-label or aria-labelledby can supply the root name as well.

| Prop                                        | Contract                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| children                                    | Fallback initials or icon, visible when src is absent or fails/loading                        |
| src / srcSet                                | Image sources; Base UI Avatar manages their lifecycle                                         |
| alt                                         | Root accessible name; empty means decorative                                                  |
| size                                        | small=32px, medium=40px (default), large=56px                                                 |
| variant                                     | circular (default), rounded (theme small corner), square                                      |
| imgProps                                    | Native img props except src/srcSet/alt/children; supports loading, sizes, ref, onLoad/onError |
| ref / className / style / native span props | Apply to the outer HTMLSpanElement                                                            |

Without children, the first Unicode code point of trimmed alt is the fallback; with no name, a
simple person silhouette is used. Small/large sizes and rounded/square variants are library
conveniences with familiar API names, not additional official Material avatar variants. The circular
40px default comes from the Material List avatar slot. Colors use primaryContainer/onPrimaryContainer
and titleMedium typography from the nearest theme. Forced colors retain a visible boundary.

Avatar's wrapper and initials-only path stay server-compatible without hooks or hydration. Image
loading uses a nested private AvatarImage client boundary based on Base UI Avatar. keepMounted puts
the real img in the server HTML, so loading begins before hydration and native lazy/srcSet behavior
works. Native img onLoad/onError callbacks observe events after hydration; already-completed server
image requests are resolved by Base UI without replaying native callbacks. Fallback remains visible until hydration determines load status. Loading/error images use
visibility:hidden, preserving lazy-load intersection and the avatar's dimensions. No style rules
are generated or inserted at runtime.

Components/Avatar stories cover initials, image, failure, automatic initial, sizes, shapes and List
composition. /selection-controls exercises actual load/error/source replacement and server-created
themes. Colocated tests cover pre-JavaScript HTML, streaming, stable loading dimensions, lazy image
callbacks, failure/recovery, decorative/meaningful names, dark themes, system colors and accessibility.

## References

- [Material List specifications](https://m3.material.io/components/lists/specs) and the List token
  research documented in [List](list.md), for the default 40px leading avatar. Material does not have
  a separate avatar component specification in this library's recorded component references.
- [Base UI Avatar](https://base-ui.com/react/components/avatar), including its keepMounted, stacking,
  server-rendering and loading/error guidance; documentation and installed 1.9.0 source inspected on
  2026-11-15. The CSS and fallback silhouette are independently authored. Figma parity is not claimed.
