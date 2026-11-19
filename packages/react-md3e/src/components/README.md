# Components

SegmentedButton owns ButtonSegment, contexts/segmented-button.context.ts and shared extracted styles.
Its baseline outlined selection uses Base UI ToggleGroup/Toggle with Material radio/checkbox roles;
the separate ButtonGroup owns the Expressive design. See docs/components/segmented-button.md.

Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Switch, Radio/RadioGroup, Avatar, TextField, Autocomplete, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, SegmentedButton/ButtonSegment, BottomSheet, SideSheet, Snackbar and the shared private ListItemContent are
implemented. API and provenance documents live in `docs/components`.

Component files form an ownership tree. A component used only by one parent lives in a named child
directory; a component shared by several implementations lives at this top component level. Keep
its `*.component.tsx`, `*.styles.ts`, and `*.types.ts` files together. Keep family-wide definitions at
their common owner. Hoisting a shared implementation does not automatically make it public.

Contexts go in the owner's `contexts` directory; shared contexts use the nearest common owner.
Behavior and type tests go in the owner's `tests` directory. Private children do not need export
barrels. See `docs/component-structure.md` for the current tree and discovery configuration.

ListItemContent is shared presentation for the static/selectable row implementations and future
Menu/Autocomplete adapters. Those adapters retain their own Base UI semantics. Static styles and
file nesting never add a client boundary.

Shape's sampler runs only during CSS extraction. Variant changes use native CSS transitions;
Surface and Shape remain server-compatible, and Card composes the renamed Surface primitive.

Skeleton and Divider are pure server presentation. Tooltip, Collapsible, ButtonGroup and Snackbar
compose Base UI interaction. BottomSheet and SideSheet share the private sheet/ feature, which owns
sheet-panel/. ButtonGroup owns its contexts/ and button-group-button/ child; Snackbar owns snackbar-view/.
Standard sheet portals wait for their actual container before mounting, preserving CSS theme
inheritance and inline document placement. Modal portals inherit the enclosing CSS theme. No style engine runs on the client.
