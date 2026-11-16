# @flaut-travel/react-md3e

Material 3 Expressive React components with precompiled CSS and a token-based theme API.
Implemented: Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Radio/RadioGroup, Avatar, TextField, Autocomplete, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, BottomSheet, SideSheet, Snackbar, ThemeProvider, createTheme, and themeToCss. React 19 is required.

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import '@flaut-travel/react-md3e/styles.css';

const theme = createTheme({ sourceColor: '#386a20' });

export default function Page() {
  return (
    <ThemeProvider theme={theme} colorScheme="system">
      <Button variant="filled">Continue</Button>
    </ThemeProvider>
  );
}
```

Call createTheme in server/build code. Its separate entry keeps color generation out of component
imports. ThemeProvider is a CSS scope without hooks or context. Button composes Base UI, is
server-rendered, and hydrates for interaction and the pointer/keyboard ripple. Its styling uses
precompiled classes and CSS keyframes. Event handlers use normal React client components. Modern CSS
light-dark(), color-mix(), and linear() support is required.

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

List/ListItem provide static server presentation and selectable listboxes with single or multiple
values, radio/checkbox/checkmark indicators, roving focus, typeahead, ripple, and Expressive
standard/segmented layouts. Use `/list` for direct imports. Selection uses Base UI ToggleGroup/Toggle
with web listbox semantics; the theme remains CSS inheritance.

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
