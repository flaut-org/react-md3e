# Components

Tabs owns TabList, Tab/TabContent and TabPanel with shared family styles and colocated tests.
Base UI supplies selection/focus/panels; geometry updates only label width and local row scrolling.
See docs/components/tabs.md.

SplitButton composes Button and Menu as a passive server-compatible group. Its own styles contain
connected geometry and a standard-motion chevron; Menu owns its popup, items, focus and selection.
The split-button CSS entry includes both families and their shared presentation dependencies.

Slider owns slider-track/ and slider-thumb/ children, shared family styles and validation helpers.
Its interaction uses Base UI Slider; numeric geometry supplies values to extracted CSS.

SegmentedButton owns ButtonSegment, contexts/segmented-button.context.ts and shared extracted styles.
Its baseline outlined selection uses Base UI ToggleGroup/Toggle with Material radio/checkbox roles;
the separate ButtonGroup owns the Expressive design. See docs/components/segmented-button.md.

Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Switch, Slider, Radio/RadioGroup, Avatar, TextField, Autocomplete, Search/SearchBar, Popover, Menu, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, SplitButton, SegmentedButton/ButtonSegment, Tabs/TabList/Tab/TabPanel, BottomSheet, SideSheet, Snackbar and the shared private ListItemContent are
implemented. API and provenance documents live in `docs/components`.

List action/expandable rows own a private ActionListControl; Base UI Button and Collapsible supply
interaction primitives. Independent action slots remain siblings of the main control. Static ul/li
rendering stays on the server; the action-navigation hook registers only through interactive rows.

Component files form an ownership tree. A component used only by one parent lives in a named child
directory; a component shared by several implementations lives at this top component level. Keep
its `*.component.tsx`, `*.styles.ts`, and `*.types.ts` files together. Keep family-wide definitions at
their common owner. Hoisting a shared implementation does not automatically make it public.

Contexts go in the owner's `contexts` directory; shared contexts use the nearest common owner.
Behavior and type tests go in the owner's `tests` directory. Private children do not need export
barrels. See `docs/component-structure.md` for the current tree and discovery configuration.

ListItemContent is shared presentation for static/selectable/action rows and Menu/Autocomplete adapters. Those adapters retain their own Base UI semantics. Static styles and
file nesting never add a client boundary.

Shape's sampler runs only during CSS extraction. Variant changes use native CSS transitions;
Surface and Shape remain server-compatible, and Card composes the renamed Surface primitive.

Skeleton and Divider are pure server presentation. Tooltip, Collapsible, ButtonGroup and Snackbar
compose Base UI interaction. BottomSheet and SideSheet share the private sheet/ feature, which owns
sheet-panel/. ButtonGroup owns its contexts/ and button-group-button/ child; Snackbar owns snackbar-view/.
Standard sheet portals wait for their actual container before mounting, preserving CSS theme
inheritance and inline document placement. Modal portals inherit the enclosing CSS theme. No style engine runs on the client.

Menu owns its public item/group/submenu parts and private popup/control adapters.
Its own context shares appearance and disabled state; Base UI owns interaction. MenuSurface and
MenuItemContent are shared private top-level presentation for Menu and Autocomplete, reusing
ListItemContent and SelectionIndicator. Their extracted styles stay with their owners; Menu retains
its trigger, grouped-surface and submenu styles. Autocomplete keeps Combobox semantics and virtual focus.
