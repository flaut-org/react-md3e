# @flaut-travel/react-md3e

Material 3 Expressive React components with precompiled CSS and a token-based theme API.

Chip and ChipSet provide assist, filter, input and suggestion chips, optional Expressive selection
shapes, outlined/elevated variants, keyboard navigation and independent remove actions. Autocomplete
uses the same input Chip. Import from the root or `/chip`; CSS loads automatically. Passive input
chips remain server components. See the [Chip API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/chip.md).

AppBar supports search, small, mediumFlexible and largeFlexible variants. Compose the existing
Search as the direct child of `AppBar variant="search"` for docked/full-screen results, with inside
and outside actions, centered hints and scrolled colors. `/app-bar/styles.css` includes Search's
styles automatically. Opt-in `scrollBehavior` supports pinned surfaces, flexible collapse/expansion and quick
return, with automatic nested-container detection or an explicit `scrollTarget`. Static AppBar
remains server-compatible. See the
[AppBar API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/app-bar.md).

Tabs, TabList, Tab and TabPanel provide primary/secondary Material 3 tabs, fixed/scrollable rows,
icons and badges, controlled/uncontrolled selection, keyboard navigation, RTL and standard/Expressive
indicator springs. Import from the root or `/tabs` for automatic CSS loading. See the [Tabs API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/tabs.md).

Slider provides standard, centered and two-handle range selection, five Expressive sizes,
horizontal/vertical orientation, marks, value indicators and optional inset icons. Base UI owns
keyboard/pointer behavior and native form inputs. Import from the root or `/slider`, with automatic CSS loading. See the [Slider API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/slider.md).

SegmentedButton and ButtonSegment provide baseline Material 3 outlined single/multiple selection,
radio/checkbox semantics, keyboard navigation, selection indicators, native form values/reset and
RTL. Import from the root or `/segmented-button`, with automatic CSS loading. See the [SegmentedButton API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/segmented-button.md).
The separate ButtonGroup supplies the Expressive connected/standard design.

SplitButton pairs a primary Button with the existing Menu. It supports filled, tonal, outlined
and elevated colors, all five Button sizes, connected shape morphs and an inward menu chevron.
Its styles and Button/Menu dependencies load automatically.
See [SplitButton](https://github.com/flaut-org/react-md3e/blob/main/docs/components/split-button.md).

Fab and ExtendedFab supply current Expressive sizes, explicit tone/container colors, lowered
elevation, native buttons/links and extended-label motion. FabMenu/FabMenuItem reuse Menu for 2–6
related floating actions. Each family loads its styles and dependencies automatically. See [FAB family](https://github.com/flaut-org/react-md3e/blob/main/docs/components/fab.md).

Switch provides immediate on/off settings using Base UI, with native forms, optional handle icons,
keyboard activation, RTL-aware pointer dragging and standard/Expressive CSS springs. Import from the
root or `/switch` for automatic styles. See the
[Switch API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/switch.md).

Badge provides small notification dots and large counts/status labels, with RTL icon placement,
error/onError colors and CSS visibility springs. It remains server-compatible. Import Badge from
the package root or `/badge`; styles load automatically. Include the
visible count/status in the destination's accessible name; describe the full count when abbreviated. See the
[Badge API](https://github.com/flaut-org/react-md3e/blob/main/docs/components/badge.md).

Calendar and RangeCalendar provide inline date selection using native Temporal.PlainDate and Intl.
Use ISO strings or Temporal values, with `valueFormat="iso"` for string callbacks. Month navigation
uses a full-width MUI-style slide and respects reduced motion. CSS loads automatically, including Calendar dependencies for RangeCalendar. Both are
available from the package root and their kebab-case subpaths. Native Temporal and Temporal-aware
Intl are required; older runtimes need an application-installed compatible global polyfill.
See [Calendar documentation](https://github.com/flaut-org/react-md3e/blob/main/docs/components/calendar.md).
Implemented: Calendar, RangeCalendar, Button, Fab, ExtendedFab, FabMenu/FabMenuItem, IconButton, AppBar, Toolbar/ToolbarOverflow, Dialog, List/ListItem, Checkbox, Switch, Slider, Radio/RadioGroup, Avatar, Badge, TextField, Autocomplete, Chip/ChipSet, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, SplitButton, SegmentedButton/ButtonSegment, Tabs/TabList/Tab/TabPanel, BottomSheet, SideSheet, Snackbar, ThemeProvider, createTheme, and themeToCss. React 19 is required.

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({ sourceColor: '#386a20' });

export default function Page() {
  return (
    <ThemeProvider theme={theme} colorScheme="system">
      <Button variant="filled">Continue</Button>
    </ThemeProvider>
  );
}
```

Component and ThemeProvider CSS loads automatically with root or subpath imports. Production bundlers
tree-shake unrelated styles. Next Webpack requires
`experimental.optimizePackageImports: ['@flaut-travel/react-md3e']` for root named imports;
alternatively use only component subpaths, including `/theme-provider`. Existing explicit CSS exports remain available for compatibility. Native
Node selects an equivalent CSS-free ESM graph; CSS-aware bundlers select `module`/`browser` exports.
See [CSS loading](https://github.com/flaut-org/react-md3e/blob/main/docs/css-loading.md) for SSR conditions
and non-bundled Node rendering.

Call createTheme in server/build code. Its separate entry keeps color generation out of component
imports. ThemeProvider is a CSS scope without hooks or context. Button composes Base UI, is
server-rendered, and hydrates for interaction and the pointer/keyboard ripple. Its styling uses
precompiled classes and CSS keyframes. Event handlers use normal React client components. Modern CSS
light-dark(), color-mix(), and linear() support is required.

`createTheme({ motionScheme: 'standard' })` selects restrained MD3 motion; the default is
`expressive`. Motion is independent of the color `variant`. All six spatial/effects springs are
precomputed as CSS tokens; components inherit them through ThemeProvider, including portals and
nested scopes. Reduced-motion preferences override either scheme. The browser performs CSS
interpolation without a JavaScript spring engine. See the
[motion documentation](https://github.com/flaut-org/react-md3e/blob/main/docs/motion.md) for parameters
and approximation limits.

Button supports filled, tonal, outlined, text, and elevated appearances; five Expressive sizes;
round/square shapes; disabled state; leading/trailing icons; controlled toggle selection; and press
ripples with a disableRipple opt-out.

IconButton provides filled, tonal, outlined, and standard variants, five sizes, three widths,
round/square shapes, controlled selection, ripple, and required accessible names. Its actual
interaction target is at least 48×48px. AppBar remains server-compatible and provides small,
mediumFlexible, and largeFlexible layouts, titles/subtitles, navigation/actions, alignment, and
controlled scrolled elevation. Root and `/button`, `/icon-button`, `/app-bar` entries are available.

Dialog composes Base UI modal behavior with DialogTitle, DialogContent, DialogContentText, and
DialogActions. It supports basic/full-screen layouts, focus containment/restoration, controlled
dismissal, scrolling, and keepMounted. Its portal inherits the enclosing CSS theme by default and
mounts after hydration. A `/dialog` entry is available.

List/ListItem provide static server presentation, primary button/link actions, independent leading/trailing
controls, nested controlled/uncontrolled expansion, and selectable listboxes with single or multiple
selection. Standard/segmented layouts share compiled themes, state layers and ripple. Use `/list`
for direct imports. Base UI owns button, disclosure and selection primitives; the theme remains CSS
inheritance. Expansion is an inline web adaptation; full-screen container-transform/Figma parity is
not claimed. See [List API and references](https://github.com/flaut-org/react-md3e/blob/main/docs/components/list.md).

See the [repository documentation](https://github.com/flaut-org/react-md3e) for the API, static
theme export, Storybook, verification, and design references.

Original code is MIT. The separate theme bundle contains Google's Apache-2.0 Material Color
Utilities; see THIRD_PARTY_NOTICES.md and the included license.

Checkbox, Radio/RadioGroup and Avatar are also exported from the package root and their own
`/checkbox`, `/radio`, `/radio-group` and `/avatar` subpaths. Form controls compose Base UI;
initials-only avatars remain server-compatible. All component styles are precompiled.

TextField and Autocomplete are exported from the root and `/text-field` / `/autocomplete`.
TextField implements filled/outlined MD3 fields; Autocomplete composes it with Base UI Combobox
for single/multiple selection. See the workspace component documentation for exact APIs and limits.

Popover and PopoverClose are available from the root and `/popover`. Base UI owns anchoring,
collision handling, focus and dismissal; the precompiled surface inherits the enclosing CSS theme.
Use arbitrary interactive content such as passenger counters and cabin radios. Nonmodal by default;
modal mode, controlled state, keepMounted, custom positioning anchors and containers are supported.
The trigger renders on the server, while portal content mounts after hydration.

Surface is the server-compatible surface primitive (theme colors, corner roles and elevation 0–5).
Card composes it with filled/elevated/outlined appearances and CardContent/CardActions/CardMedia;
CardActionArea alone hydrates for primary actions and ripple. Shape is a separate decorative
component with all 35 official Expressive silhouettes and CSS morphing between variant values.
Use morph=false for exact static SVG masks; reduced motion disables transitions. All contours and
motion rules are prepared at build time and Shape remains server-compatible. Root and
`/surface`, `/shape`, `/card` imports are available. No geometry library is needed by consumers.

Search and SearchBar are available from the root and `/search`. Search expands a persistent bar into
a modal docked/fullscreen contained MD3 Expressive view, with CSS spring motion, freeform controlled
queries, native forms and application-owned results through children. SearchBar is independently usable.
Base UI owns modal/input behavior; styles remain precompiled and inherit the CSS theme scope.

Typography is exported from the root and `/typography`. Select one of 15 MD3 visual variants and
its emphasized counterpart independently of HTML semantics through component. It remains
server-compatible with precompiled CSS, inherited/theme-role colors, logical alignment and noWrap.
createTheme supports all 30 styles and independent per-role font/metric overrides.

Skeleton and Divider remain server-compatible; Tooltip, Collapsible, ButtonGroup/ButtonGroupButton,
BottomSheet, SideSheet and Snackbar compose Base UI behavior. Each is available from the root and
its kebab-case subpath. Button supports loading and native/custom link components. Autocomplete
supports selectOnFocus and clearOnEscape. See the repository's component documentation for exact
contracts, portal hydration boundaries and examples.

LoadingIndicator and ProgressIndicator are exported from the root and `/loading-indicator` /
`/progress-indicator`. They remain RSC-compatible and automatically load their precompiled CSS. LoadingIndicator morphs seven MD3 shapes (contained/uncontained)
and accepts controlled progress; ProgressIndicator provides linear/circular flat/wavy displays,
known/unknown progress, 4/8 thicknesses and accessible finite ranges. Both support themes,
reduced motion and forced colors. See the repository's docs/components/loading-indicator.md and
docs/components/progress-indicator.md; the fixture `/indicators` and Storybook have working examples.

Menu and its item, selection, grouping and submenu parts are available from `/menu` or the root.
Styles load automatically. Expressive standard/vibrant menus use
Base UI focus/typeahead/dismissal and support keyboard-accessible nested menus and grouped surfaces with gaps. See
[Menu documentation](https://github.com/flaut-org/react-md3e/blob/main/docs/components/menu.md).

Toolbar supports docked and horizontal/vertical floating panels with scoped Standard/Vibrant colors,
FAB composition, declarative responsive overflow, expansion and web scroll/keyboard behavior.
Its layout stays server-compatible; optional behavior and ToolbarOverflow own client boundaries.
Import from `/toolbar`; CSS loads automatically. See the
[Toolbar API and verification limits](https://github.com/flaut-org/react-md3e/blob/main/docs/components/toolbar.md).
