# Flaut homepage migration

Status: audited inventory and plan. Button, IconButton, AppBar, Dialog, List/ListItem, and theme infrastructure are implemented; no Flaut
consumer migration has been performed.

## Source snapshot and method

The audit was recorded on 2026-11-14 against `flaut-org/flaut-nextjs` at commit
`b99a09ff403d9f1f499377f4e86bc2fa553cf44c`. Its declared versions were React 19.3.1, Next.js 16.4.3,
and MUI 9.4.0.

The roots are `src/app/[locale]/page.tsx` and its shared `layout.tsx`. The graph follows relative
value imports, re-exports, and literal dynamic imports after TypeScript's syntactic type-import
removal. Tests and generated type/import-map files are excluded. It does not model tree shaking,
execute modules, or resolve aliases.

This is a conservative source inventory, not a production bundle analysis. Imported files can
include unused exports and legacy implementations. Narrow the list to rendered parts before
designing each public component. The accompanying `homepage-inventory.json` records the imported
component names and source files for review.

## Scope

The complete homepage includes:

- Skip-to-content link and main landmark.
- App bar, desktop/mobile navigation, theme control, language and currency selection.
- Hero, form container, full search form, autocomplete, passenger/trip-class controls,
  desktop/mobile calendar shells, and validation/error feedback.
- Discover and advantages sections.
- Special offers, popular directions, origin-city selectors, and blog cards.
- Loading, empty, and error states under the existing Suspense boundaries.
- Footer, including asynchronously loaded entity links.
- Shared locale-layout UI, including the language suggestion toast and theme initialization.

Fetching, analytics, prices, search submission, and locale/currency application state stay in Flaut.
Preserve its existing calendar behavior while adapting presentation and overlays; adding React Aria
to the library is not a prerequisite.

## Conservative component inventory

The page import graph contains 120 MUI-using files, 43 files importing MUI `styled`, and 44
component names. Shared layout adds three more names. These are audited source names, not a
requirement to publish 47 replacements.

| Group                   | Existing MUI names                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Layout and text         | Box, Container, Grid, Stack, Typography, Link, Divider, Skeleton                                   |
| Surfaces                | Paper, Card, CardContent, CardMedia, Avatar                                                        |
| Actions                 | Button, ButtonBase, ButtonGroup, IconButton                                                        |
| Header and lists        | AppBar, Toolbar, List, ListItemButton, ListItemIcon, ListItemText                                  |
| Inputs                  | TextField, Input, InputAdornment, FormControl, FormControlLabel, Radio, RadioGroup, Autocomplete   |
| Overlays                | Dialog, DialogActions, DialogContent, DialogContentText, Drawer, SwipeableDrawer, Popover, Tooltip |
| Feedback                | Alert, Snackbar                                                                                    |
| Motion                  | Collapse, Grow, Slide                                                                              |
| Shared-layout functions | CssBaseline, InitColorSchemeScript, Unstable_TrapFocus                                             |

Some rows can become compositions, CSS motion, theme initialization, or Base UI behavior rather than
one public component for each MUI name. Main risks are autocomplete state and keyboard handling,
focus restoration, mobile overlay behavior, and existing DOM selectors.

No MUI X Charts import was found in this homepage graph. Charts remain separate work. The page graph
references 45 distinct MUI icons; an icon-package migration is not a prerequisite for preparing the
library foundation.

## Implementation and migration sequence

1. Complete the repository foundation and choose a styling compiler with recorded evidence.
2. Confirm APIs and implement the component families needed by the homepage, including interactive
   families and mobile states; avoid expanding to the full MUI catalog.
3. Migrate the page shell, form container, hero, and footer.
4. Migrate discover, advantages, blog, and offer/direction cards and their fallbacks.
5. Migrate header controls, navigation, theme preference, language, and currency overlays.
6. Migrate the full search form, autocomplete, calendar shells, and mobile panels.
7. Verify the whole route and shared layout before moving to the next page.

Preparing APIs and risky behavior can precede replacing the corresponding section. During migration,
old and new CSS may coexist; define their cascade and theme interoperability. Removing MUI/Emotion
globally is not a success criterion for the first section replacement.

## Homepage acceptance

- The shell and fallbacks remain available while offer/direction/blog data is pending.
- Static presentation does not gain client boundaries from styling.
- The production consumer uses compiled CSS without browser rule generation.
- Keyboard interaction, focus restoration, mobile dialogs/drawers, form selection, error feedback,
  locale switching, and theme behavior remain functional.
- MD3 roles and appearance are explicit; obsolete MD2 values are changed in the consumer.
- Existing integration and accessibility checks are updated to the new API and structure.
- Inspect the route's emitted JS/CSS; do not promise a bundle reduction from import counts.

The existing Flaut test `src/web/app/pages/home/homepage-streaming.test.tsx` checks streaming but
mocks MUI. Keep its behavioral intent and add production integration coverage with real library
styles once they exist.

The audited MUI Paper usage migrates to this library's Surface (`/surface`). The MUI inventory above
retains the original source component names. Shape is a separate decorative/morphing primitive.

## Implementation status — 2026-11-16

The missing UI primitives from this audit are implemented: Skeleton, Divider, Tooltip, BottomSheet,
SideSheet, Snackbar, ButtonGroup/ButtonGroupButton and Collapsible. Button now supports loading,
fullWidth, native href and custom routing-link components. Autocomplete supports selectOnFocus and
clearOnEscape. Component documentation and `/essentials`/Storybook show the public contracts.

The audited source inventory above remains a record of the MUI consumer. No Flaut route has been
migrated in this change. Next work is application composition and page-by-page replacement, with
calendar/price behavior, navigation, forms, data fetching and locale/currency state remaining in
flaut-nextjs. No extra layout library, chart package, icon catalog or React Aria dependency is needed
for this component milestone. Existing calendar integration requires consumer migration work.
