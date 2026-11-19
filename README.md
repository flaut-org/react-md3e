# react-md3e

An independent React library for Material 3 Expressive, with server-compatible components,
build-time CSS, and a token-based theme API inspired by Google's Material Theme Builder.

Calendar and RangeCalendar provide inline Temporal-based date selection with animated month changes,
keyboard navigation, Intl localization and one-to-three-panel ranges. Import `/calendar/styles.css`
or `/range-calendar/styles.css` at the composition boundary. See [Calendar](docs/components/calendar.md)
for the MUI-style API, ISO/Temporal values and native-runtime requirements. Working examples are at
`/calendars` in the Next fixture and Components/Calendar and Components/RangeCalendar in Storybook.

## Component support

Coverage follows Google's [Material 3 component catalog](https://m3.material.io/components), including
Material You and M3 Expressive. Component names link to the official guidance; public APIs link to
this library's documentation. Composition parts are listed with their owning component.

✅ Implemented · ⚠️ Partially implemented · ❌ Not implemented

Statuses describe the available public APIs and Material variants. Partial support includes missing
variants or interactions and functionality available only inside another component. Visual verification
and platform-specific adaptations are documented in the linked component notes.

| Material component                                                                           | Support | Implementation / missing support                                                                                                                                                             |
| -------------------------------------------------------------------------------------------- | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [App bars](https://m3.material.io/components/app-bars/overview)                              |   ⚠️    | [AppBar](docs/components/app-bar.md) provides small, mediumFlexible and largeFlexible top bars. Search app bars and built-in scroll collapse/expansion are absent.                           |
| [Badges](https://m3.material.io/components/badges/overview)                                  |   ✅    | [Badge](docs/components/badge.md): small dots and large counts/status labels, RTL icon placement, count limits and visibility springs.                                                       |
| [Bottom sheets](https://m3.material.io/components/bottom-sheets/overview)                    |   ⚠️    | [BottomSheet](docs/components/bottom-sheet.md) provides modal/standard sheets and swipe dismissal; snap points and swipe-to-open are absent.                                                 |
| [Button groups](https://m3.material.io/components/button-groups/overview)                    |   ✅    | [ButtonGroup / ButtonGroupButton](docs/components/button-group.md): Expressive standard and connected groups, single/multiple selection and ordinary actions.                                |
| [Buttons](https://m3.material.io/components/buttons/overview)                                |   ✅    | [Button](docs/components/button.md): filled, tonal, outlined, elevated and text; five Expressive sizes, shapes, loading and links.                                                           |
| [Cards](https://m3.material.io/components/cards/overview)                                    |   ✅    | [Card](docs/components/card.md): filled, elevated and outlined, with CardContent, CardActions, CardMedia and CardActionArea.                                                                 |
| [Carousel](https://m3.material.io/components/carousel/overview)                              |   ❌    | No carousel component or Material carousel layouts.                                                                                                                                          |
| [Checkbox](https://m3.material.io/components/checkbox/overview)                              |   ✅    | [Checkbox](docs/components/checkbox.md): checked, unchecked and indeterminate states, labels and native form behavior.                                                                       |
| [Chips](https://m3.material.io/components/chips/overview)                                    |   ⚠️    | [Autocomplete](docs/components/autocomplete.md) renders removable input chips internally. No public Chip API or assist, filter and suggestion variants.                                      |
| [Date pickers](https://m3.material.io/components/date-pickers/overview)                      |   ⚠️    | [Calendar / RangeCalendar](docs/components/calendar.md) provide inline date selection. No DatePicker/DateRangePicker field, docked popup, modal picker or date-entry mode.                   |
| [Dialogs](https://m3.material.io/components/dialogs/overview)                                |   ✅    | [Dialog](docs/components/dialog.md): basic/full-screen layouts, DialogTitle, DialogContent, DialogContentText and DialogActions, with modal focus/dismissal behavior.                        |
| [Divider](https://m3.material.io/components/divider/overview)                                |   ✅    | [Divider](docs/components/divider.md): horizontal/vertical, full-width, inset and middle variants.                                                                                           |
| [Extended FABs](https://m3.material.io/components/extended-fab/overview)                     |   ❌    | No extended floating action button component.                                                                                                                                                |
| [FAB menu](https://m3.material.io/components/fab-menu/overview)                              |   ❌    | No FAB menu or coordinated expansion into related floating actions.                                                                                                                          |
| [Floating action buttons](https://m3.material.io/components/floating-action-button/overview) |   ❌    | No floating action button component or its Material size variants.                                                                                                                           |
| [Icon buttons](https://m3.material.io/components/icon-buttons/overview)                      |   ✅    | [IconButton](docs/components/icon-button.md): filled, tonal, outlined and standard; five sizes, three widths, shapes and toggle states.                                                      |
| [Lists](https://m3.material.io/components/lists/overview)                                    |   ⚠️    | [List / ListItem](docs/components/list.md) provide standard/segmented rows and static/single/multiple selection. Dedicated action rows, expansion and swipe actions are absent.              |
| [Loading indicator](https://m3.material.io/components/loading-indicator/overview)            |   ✅    | [LoadingIndicator](docs/components/loading-indicator.md): contained/uncontained Expressive shape morphing and controlled progress.                                                           |
| [Menus](https://m3.material.io/components/menus/overview)                                    |   ❌    | No public Menu/MenuItem API with menu-item keyboard and selection semantics.                                                                                                                 |
| [Navigation bar](https://m3.material.io/components/navigation-bar/overview)                  |   ❌    | No navigation bar or navigation destination components.                                                                                                                                      |
| [Navigation drawer](https://m3.material.io/components/navigation-drawer/overview)            |   ❌    | No navigation drawer or drawer-item API; SideSheet is a generic supplementary panel.                                                                                                         |
| [Navigation rail](https://m3.material.io/components/navigation-rail/overview)                |   ❌    | No navigation rail, including the Expressive expanded rail.                                                                                                                                  |
| [Progress indicators](https://m3.material.io/components/progress-indicators/overview)        |   ✅    | [ProgressIndicator](docs/components/progress-indicator.md): linear/circular, determinate/indeterminate and flat/wavy appearances.                                                            |
| [Radio button](https://m3.material.io/components/radio-button/overview)                      |   ✅    | [Radio / RadioGroup](docs/components/radio.md): controlled/uncontrolled selection, keyboard navigation and native forms.                                                                     |
| [Scroll fields](https://m3.material.io/components/scroll-fields)                             |   ❌    | No Expressive scroll-field component for selecting measurement values.                                                                                                                       |
| [Search](https://m3.material.io/components/search/overview)                                  |   ⚠️    | [Search / SearchBar](docs/components/search.md) provide contained search with docked/full-screen views. The divided search style is absent.                                                  |
| [Segmented buttons](https://m3.material.io/components/segmented-buttons/overview)            |   ❌    | No baseline Material segmented-button component. ButtonGroup implements the separate Expressive button-group design.                                                                         |
| [Side sheets](https://m3.material.io/components/side-sheets/overview)                        |   ✅    | [SideSheet](docs/components/side-sheet.md): modal/standard panels, logical start/end placement, focus handling and dismissal.                                                                |
| [Sliders](https://m3.material.io/components/sliders/overview)                                |   ❌    | No slider or range-slider component.                                                                                                                                                         |
| [Snackbar](https://m3.material.io/components/snackbar/overview)                              |   ⚠️    | [Snackbar](docs/components/snackbar.md) provides messages, actions, timeout/pause and positioning. Swipe dismissal is absent.                                                                |
| [Split buttons](https://m3.material.io/components/split-button)                              |   ❌    | No combined primary action and secondary menu-trigger component.                                                                                                                             |
| [Switch](https://m3.material.io/components/switch/overview)                                  |   ✅    | [Switch](docs/components/switch.md): native forms, controlled/uncontrolled state, optional icons, keyboard and RTL-aware dragging, with Material state colors and motion.                    |
| [Tabs](https://m3.material.io/components/tabs/overview)                                      |   ❌    | No primary/secondary tabs, tab list or tab-panel API.                                                                                                                                        |
| [Text fields](https://m3.material.io/components/text-fields/overview)                        |   ⚠️    | [TextField](docs/components/text-field.md) provides filled/outlined inputs and textareas, labels, helper/error text and adornments. A built-in character counter and select mode are absent. |
| [Time pickers](https://m3.material.io/components/time-pickers/overview)                      |   ❌    | No dial or text-entry time picker.                                                                                                                                                           |
| [Toolbars](https://m3.material.io/components/toolbars/overview)                              |   ❌    | No Material toolbar component or its Expressive layouts.                                                                                                                                     |
| [Tooltips](https://m3.material.io/components/tooltips/overview)                              |   ⚠️    | [Tooltip](docs/components/tooltip.md) implements plain tooltips. Rich tooltips with structured content/actions are absent.                                                                   |

### Additional library APIs

These are library primitives or Material foundations, rather than separate entries in the
component catalog above.

| Library API                                                           | Support | Implementation                                                                                                                     |
| --------------------------------------------------------------------- | :-----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Autocomplete](docs/components/autocomplete.md)                       |   ✅    | Public single/multiple selection combobox composed with TextField; its documented API is independent of a standalone Menu or Chip. |
| [Avatar](docs/components/avatar.md)                                   |   ✅    | Images, initials and fallback presentation, with circular/rounded/square shapes.                                                   |
| [Calendar / CalendarDay / RangeCalendar](docs/components/calendar.md) |   ✅    | Standalone inline calendars with Temporal/ISO values, localization, keyboard navigation, range selection and month paging.         |
| [Collapsible](docs/components/collapsible.md)                         |   ✅    | Controlled/uncontrolled disclosure with a trigger, retained content and animated expansion.                                        |
| [Popover / PopoverClose](docs/components/popover.md)                  |   ✅    | Anchored interactive panels with positioning, focus handling and dismissal.                                                        |
| [Shape](docs/components/shape.md)                                     |   ✅    | All 35 Expressive silhouettes, decorative masks and CSS shape morphing.                                                            |
| [Skeleton](docs/components/skeleton.md)                               |   ✅    | Loading placeholders with text/rectangular/rounded/circular shapes and pulse/wave animations.                                      |
| [Surface](docs/components/surface.md)                                 |   ✅    | Themed surfaces, shape roles, filled/outlined presentation and elevation.                                                          |
| [Typography](docs/components/typography.md)                           |   ✅    | All 15 baseline and 15 emphasized Material type roles, independent of HTML semantics.                                              |
| [ThemeProvider / createTheme / themeToCss](docs/theming.md)           |   ✅    | CSS theme scopes and server/build theme generation for colors, typography, shape, motion and breakpoints.                          |

[partial-support]: docs/assets/component-support-partial.svg

The first consumer milestone remains Flaut's complete homepage; it has not been migrated yet.

## Local development

Install the exact Node.js 26 LTS version in `.tool-versions` through asdf. CI uses
`actions/setup-node` with `node-version-file: .tool-versions`.

Add the plugin once if needed:

```sh
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
```

```sh
asdf install
asdf exec npm ci
asdf exec npm exec -- playwright install chromium
asdf exec npm run check
```

Start Storybook at `http://localhost:6006`:

```sh
asdf exec npm run storybook
```

Use the toolbar to switch between precomputed Material, forest, and expressive themes and
light/dark/system modes, plus independent standard/expressive motion. Stories cover all Button appearances, sizes, shapes, disabled state,
leading/trailing icons, controlled selection, ripple opt-out, and nested theme comparisons.
AppBar and IconButton have dedicated stories covering flexible layouts, subtitles, RTL, scrolling
composition, icon widths, accessible names, and minimum interaction targets. Dialog stories cover
basic/full-screen layouts, icons, long content, forms, nested confirmations, and retained state.

Start the Next.js RSC/streaming fixture at `http://localhost:3000` with `npm run dev`. Both commands
first build the package. Run `npm run dev:library` in a second terminal to watch UI
implementation/style changes. After changing theme generation or public types, run a full
`npm run build` to regenerate the theme bundle, declarations, and example theme data.

## Use the package

```tsx
import { Button, ThemeProvider } from '@flaut-travel/react-md3e';
import { createTheme } from '@flaut-travel/react-md3e/theme';
import '@flaut-travel/react-md3e/theme/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';

const theme = createTheme({ sourceColor: '#386a20' });

export default function Page() {
  return (
    <ThemeProvider theme={theme} colorScheme="system">
      <Button variant="filled">Continue</Button>
      <Button variant="tonal" shape="square">
        Learn more
      </Button>
    </ThemeProvider>
  );
}
```

The example is usable from a Server Component. Button composes Base UI and is a client component for
button behavior and the pointer/keyboard ripple; it is server-rendered and then hydrated.
ThemeProvider is a CSS scope without hooks or React context and stays server-compatible. Import the
theme stylesheet once and component styles at their route or composition boundary. Composite CSS entries
include their internal dependencies. Event handlers belong in consumer client components. See
[CSS loading](docs/css-loading.md) for route-level imports and migration from the full stylesheet.

`createTheme` runs in server/build code and returns serializable light/dark color roles, tonal
palettes, harmonized custom colors, typography, shape, and CSS variables. Its separate entry keeps
color generation out of component imports. `themeToCss` can export custom themes as build-time CSS.
See [theming](docs/theming.md), [motion schemes](docs/motion.md), [Button](docs/components/button.md),
[IconButton](docs/components/icon-button.md), [AppBar](docs/components/app-bar.md), and
[Dialog](docs/components/dialog.md), [List/ListItem](docs/components/list.md),
[Checkbox](docs/components/checkbox.md), [Radio/RadioGroup](docs/components/radio.md), and [Avatar](docs/components/avatar.md), [TextField](docs/components/text-field.md), and
[Autocomplete](docs/components/autocomplete.md), [Search/SearchBar](docs/components/search.md), and [Popover](docs/components/popover.md), [Surface](docs/components/surface.md),
[Shape](docs/components/shape.md), [Typography](docs/components/typography.md), and [Card](docs/components/card.md).
AppBar stays server-compatible; IconButton composes Base UI and hydrates for interaction. The
Next fixture exposes them at `/components`, and Dialog at `/dialog`; streamed content exercises
the same built package and client boundaries. `/lists` demonstrates static RSC lists, radio/checkbox
selection and a language/currency Dialog. Matching examples are available in Storybook. `/selection-controls` demonstrates native Checkbox/RadioGroup
form behavior and Avatar image fallback. `/fields` adds TextField and Autocomplete, including
forms, object/multiple selection and nested Dialog composition. Each has dedicated Storybook examples. `/popovers` demonstrates anchored interactive panels,
including passenger/cabin selection and nested Dialog/Autocomplete composition. `/surfaces` adds
Surface tokens, the complete 35-shape gallery with CSS morphing, and server/interactive Cards.
Shape morphs when variant changes, supports morph={false}, and honors reduced motion while
remaining server-compatible. Surface is the renamed Paper API; imports use `/surface`.

## Commands

| Command                   | Purpose                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `npm run build`           | Build the package and precompute example themes                             |
| `npm run dev:library`     | Watch the UI module/CSS build after an initial full build                   |
| `npm run storybook`       | Build the package, then run Storybook on port 6006                          |
| `npm run build:storybook` | Build static Storybook; build the package first                             |
| `npm run dev`             | Build the package, then start the Next.js fixture                           |
| `npm run build:fixture`   | Production Next/Turbopack build; build the package first                    |
| `npm run typecheck`       | Check library, fixtures, stories, tooling, and public API examples          |
| `npm run lint`            | Airbnb Extended, React hooks, and library dependency restrictions           |
| `npm run format`          | Format source and documentation                                             |
| `npm run check:package`   | Validate exports, packed files, server imports, and UI runtime isolation    |
| `npm test`                | Theme unit tests and HTTP production fixture tests                          |
| `npm run test:browser`    | Chromium interaction, theme, accessibility, streaming, and Storybook checks |
| `npm run check`           | Run all checks in dependency order                                          |
| `npm run pack`            | Create a local npm tarball without publication                              |

Browser tests require built Next and Storybook outputs. CI installs Chromium with `--with-deps`. No
fonts, credentials, external API, or backend are needed by the examples.

## Architecture

Linaria/WyW extracts typed style objects from colocated `*.styles.ts`. TypeScript checks properties
and nested rules through `satisfies StyleObject` (csstype). Distributed UI modules use compiled
class strings. Ripple JavaScript handles press coordinates and lifetime, with precompiled CSS
keyframes; it never inserts CSS rules. The isolated theme entry bundles Google's official color
utilities; it is not part of the component import graph.

Modern CSS support for `light-dark()`, `color-mix()`, and `linear()` is required. Native MD3 values
are used instead of MD2 aliases. `sx`, MUI System compatibility, a public `styled` factory, and
image-based seed extraction are not implemented in this slice.

See [architecture](docs/architecture.md), [component structure](docs/component-structure.md), [styling](docs/styling-contract.md),
[design sources](docs/design-sources.md), [source imports](docs/module-resolution.md), and
[homepage migration](docs/migration/homepage.md). Formatting and linting are documented in [tooling](docs/tooling.md). Development rules are in [AGENTS.md](AGENTS.md)
and [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT for original code. The bundled Material Color Utilities retains its Apache-2.0 notices and
license in the distributed package.

`/search` demonstrates contained Search/SearchBar with docked/fullscreen motion, native forms,
application-owned results, keyboard navigation and nested themes. Dedicated Storybook entries are available.

`/typography` demonstrates all 30 baseline/emphasized styles, semantic/custom elements, theme
overrides, inherited rich text and truncation. Components/Typography in Storybook uses the same built package.

`/essentials` demonstrates the remaining homepage primitives: Skeleton, Divider, Tooltip,
Collapsible, ButtonGroup, BottomSheet, SideSheet and Snackbar. Each has Storybook examples,
colocated type/behavior tests and [API documentation](docs/components/skeleton.md).
See also [Divider](docs/components/divider.md), [Tooltip](docs/components/tooltip.md),
[Collapsible](docs/components/collapsible.md), [ButtonGroup](docs/components/button-group.md),
[BottomSheet](docs/components/bottom-sheet.md), [SideSheet](docs/components/side-sheet.md), and
[Snackbar](docs/components/snackbar.md). Button now supports loading and native/routing links;
Autocomplete adds selectOnFocus/clearOnEscape. The Flaut homepage migration remains a separate task.

## Releases

Changesets prepares release PRs and changelogs for the public npm package. Alpha and beta use their
own npm channels and GitHub prereleases; stable versions use latest. Read [release instructions](docs/releases.md)
for token-free npm releases, channel transitions, and the exact GitHub/npm UI steps.
Publication runs through the verified Release workflow.

LoadingIndicator and ProgressIndicator are exported from the root and `/loading-indicator` /
`/progress-indicator`. They remain RSC-compatible and use precompiled CSS: import the corresponding
`/<component>/styles.css` entries. LoadingIndicator morphs seven MD3 shapes (contained/uncontained)
and accepts controlled progress; ProgressIndicator provides linear/circular flat/wavy displays,
known/unknown progress, 4/8 thicknesses and accessible finite ranges. Both support themes,
reduced motion and forced colors. See the repository's docs/components/loading-indicator.md and
docs/components/progress-indicator.md; the fixture `/indicators` and Storybook have working examples.
