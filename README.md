<h1 align="center">react-md3e</h1>

<div align="center">

![GitHub License](https://img.shields.io/github/license/flaut-org/react-md3e?style=for-the-badge&color=%232196f3)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/flaut-org/react-md3e/ci.yml?style=for-the-badge)

</div>

A modern React component library implementing Google's [Material Design 3 (Material You)](https://m3.material.io/) and Material Design 3 Expressive, built for the modern React ecosystem with performance, accessibility, and React Server Components in mind.

## Usage

> [!CAUTION]
> Currently in early alpha. The API is subject to breaking changes and may undergo a complete overhaul. Please wait for the public beta release.

## Component support

Coverage follows Google's [Material 3 component catalog](https://m3.material.io/components), including
Material You and M3 Expressive. Component names link to the official guidance; public APIs link to
this library's documentation. Composition parts are listed with their owning component.

✅ Implemented · ⚠️ Partially implemented · ❌ Not implemented

Statuses describe the available public APIs and Material variants. Partial support includes missing
variants or interactions and functionality available only inside another component. Visual verification
and platform-specific adaptations are documented in the linked component notes.

| Material component                                                                           | Support | Implementation / missing support                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [App bars](https://m3.material.io/components/app-bars/overview)                              |   ⚠️    | [AppBar](docs/components/app-bar.md) provides small, mediumFlexible and largeFlexible top bars. Search app bars and built-in scroll collapse/expansion are absent.                                                        |
| [Badges](https://m3.material.io/components/badges/overview)                                  |   ✅    | [Badge](docs/components/badge.md): small dots and large counts/status labels, RTL icon placement, count limits and visibility springs.                                                                                    |
| [Bottom sheets](https://m3.material.io/components/bottom-sheets/overview)                    |   ⚠️    | [BottomSheet](docs/components/bottom-sheet.md) provides modal/standard sheets and swipe dismissal; snap points and swipe-to-open are absent.                                                                              |
| [Button groups](https://m3.material.io/components/button-groups/overview)                    |   ✅    | [ButtonGroup / ButtonGroupButton](docs/components/button-group.md): Expressive standard and connected groups, single/multiple selection and ordinary actions.                                                             |
| [Buttons](https://m3.material.io/components/buttons/overview)                                |   ✅    | [Button](docs/components/button.md): filled, tonal, outlined, elevated and text; five Expressive sizes, shapes, loading and links.                                                                                        |
| [Cards](https://m3.material.io/components/cards/overview)                                    |   ✅    | [Card](docs/components/card.md): filled, elevated and outlined, with CardContent, CardActions, CardMedia and CardActionArea.                                                                                              |
| [Carousel](https://m3.material.io/components/carousel/overview)                              |   ❌    | No carousel component or Material carousel layouts.                                                                                                                                                                       |
| [Checkbox](https://m3.material.io/components/checkbox/overview)                              |   ✅    | [Checkbox](docs/components/checkbox.md): checked, unchecked and indeterminate states, labels and native form behavior.                                                                                                    |
| [Chips](https://m3.material.io/components/chips/overview)                                    |   ⚠️    | [Autocomplete](docs/components/autocomplete.md) renders removable input chips internally. No public Chip API or assist, filter and suggestion variants.                                                                   |
| [Date pickers](https://m3.material.io/components/date-pickers/overview)                      |   ⚠️    | [Calendar / RangeCalendar](docs/components/calendar.md) provide inline date selection. No DatePicker/DateRangePicker field, docked popup, modal picker or date-entry mode.                                                |
| [Dialogs](https://m3.material.io/components/dialogs/overview)                                |   ✅    | [Dialog](docs/components/dialog.md): basic/full-screen layouts, DialogTitle, DialogContent, DialogContentText and DialogActions, with modal focus/dismissal behavior.                                                     |
| [Divider](https://m3.material.io/components/divider/overview)                                |   ✅    | [Divider](docs/components/divider.md): horizontal/vertical, full-width, inset and middle variants.                                                                                                                        |
| [Extended FABs](https://m3.material.io/components/extended-fab/overview)                     |   ❌    | No extended floating action button component.                                                                                                                                                                             |
| [FAB menu](https://m3.material.io/components/fab-menu/overview)                              |   ❌    | No FAB menu or coordinated expansion into related floating actions.                                                                                                                                                       |
| [Floating action buttons](https://m3.material.io/components/floating-action-button/overview) |   ❌    | No floating action button component or its Material size variants.                                                                                                                                                        |
| [Icon buttons](https://m3.material.io/components/icon-buttons/overview)                      |   ✅    | [IconButton](docs/components/icon-button.md): filled, tonal, outlined and standard; five sizes, three widths, shapes and toggle states.                                                                                   |
| [Lists](https://m3.material.io/components/lists/overview)                                    |   ⚠️    | [List / ListItem](docs/components/list.md) provide standard/segmented rows and static/single/multiple selection. Dedicated action rows, expansion and swipe actions are absent.                                           |
| [Loading indicator](https://m3.material.io/components/loading-indicator/overview)            |   ✅    | [LoadingIndicator](docs/components/loading-indicator.md): contained/uncontained Expressive shape morphing and controlled progress.                                                                                        |
| [Menus](https://m3.material.io/components/menus/overview)                                    |   ⚠️    | [Menu](docs/components/menu.md): Expressive standard/vibrant menus, command/link items, checkbox/radio selection, groups with gaps, dividers and cascading submenus. No context gestures, horizontal or baseline variant. |
| [Navigation bar](https://m3.material.io/components/navigation-bar/overview)                  |   ❌    | No navigation bar or navigation destination components.                                                                                                                                                                   |
| [Navigation drawer](https://m3.material.io/components/navigation-drawer/overview)            |   ❌    | No navigation drawer or drawer-item API; SideSheet is a generic supplementary panel.                                                                                                                                      |
| [Navigation rail](https://m3.material.io/components/navigation-rail/overview)                |   ❌    | No navigation rail, including the Expressive expanded rail.                                                                                                                                                               |
| [Progress indicators](https://m3.material.io/components/progress-indicators/overview)        |   ✅    | [ProgressIndicator](docs/components/progress-indicator.md): linear/circular, determinate/indeterminate and flat/wavy appearances.                                                                                         |
| [Radio button](https://m3.material.io/components/radio-button/overview)                      |   ✅    | [Radio / RadioGroup](docs/components/radio.md): controlled/uncontrolled selection, keyboard navigation and native forms.                                                                                                  |
| [Scroll fields](https://m3.material.io/components/scroll-fields)                             |   ❌    | No Expressive scroll-field component for selecting measurement values.                                                                                                                                                    |
| [Search](https://m3.material.io/components/search/overview)                                  |   ⚠️    | [Search / SearchBar](docs/components/search.md) provide contained search with docked/full-screen views. The divided search style is absent.                                                                               |
| [Segmented buttons](https://m3.material.io/components/segmented-buttons/overview)            |   ✅    | [SegmentedButton / ButtonSegment](docs/components/segmented-button.md): baseline outlined single/multiple selection, indicators, keyboard navigation and native form values.                                              |
| [Side sheets](https://m3.material.io/components/side-sheets/overview)                        |   ✅    | [SideSheet](docs/components/side-sheet.md): modal/standard panels, logical start/end placement, focus handling and dismissal.                                                                                             |
| [Sliders](https://m3.material.io/components/sliders/overview)                                |   ✅    | [Slider](docs/components/slider.md): standard, centered and range, five Expressive sizes, horizontal/vertical layouts, stops, value indicators and inset icons.                                                           |
| [Snackbar](https://m3.material.io/components/snackbar/overview)                              |   ⚠️    | [Snackbar](docs/components/snackbar.md) provides messages, actions, timeout/pause and positioning. Swipe dismissal is absent.                                                                                             |
| [Split buttons](https://m3.material.io/components/split-button)                              |   ❌    | No combined primary action and secondary menu-trigger component.                                                                                                                                                          |
| [Switch](https://m3.material.io/components/switch/overview)                                  |   ✅    | [Switch](docs/components/switch.md): native forms, controlled/uncontrolled state, optional icons, keyboard and RTL-aware dragging, with Material state colors and motion.                                                 |
| [Tabs](https://m3.material.io/components/tabs/overview)                                      |   ❌    | No primary/secondary tabs, tab list or tab-panel API.                                                                                                                                                                     |
| [Text fields](https://m3.material.io/components/text-fields/overview)                        |   ⚠️    | [TextField](docs/components/text-field.md) provides filled/outlined inputs and textareas, labels, helper/error text and adornments. A built-in character counter and select mode are absent.                              |
| [Time pickers](https://m3.material.io/components/time-pickers/overview)                      |   ❌    | No dial or text-entry time picker.                                                                                                                                                                                        |
| [Toolbars](https://m3.material.io/components/toolbars/overview)                              |   ❌    | No Material toolbar component or its Expressive layouts.                                                                                                                                                                  |
| [Tooltips](https://m3.material.io/components/tooltips/overview)                              |   ⚠️    | [Tooltip](docs/components/tooltip.md) implements plain tooltips. Rich tooltips with structured content/actions are absent.                                                                                                |

## Motivation

The primary motivation behind react-md3e is to provide a modern alternative to [@mui/material](https://github.com/mui/material-ui), addressing several long-standing limitations in both its design system and underlying architecture.

### Material Design 3 and Material Design 3 Expressive

Despite being one of the most popular React component libraries, Material UI still relies on the Material Design 2 specification.

The [issue requesting Material Design 3 support](https://github.com/mui/material-ui/issues/29345) has been open since October 2021. Years later, Material Design 3 remains unsupported, with no publicly announced release timeline. Meanwhile, Google has continued to evolve its design system with the introduction of Material Design 3 Expressive.

react-md3e aims to bridge this gap by embracing the latest Material Design specifications from the ground up, rather than adapting a legacy implementation.

### React Server Components as a first-class citizen

Although Material UI supports server-side rendering and is compatible with the Next.js App Router, its components are shipped with the 'use client' directive.

This means that even purely presentational components that do not require client-side interactivity must be included in the client-side JavaScript bundle and participate in hydration.

This architecture limits the benefits of React Server Components, increases the amount of JavaScript delivered to the browser, and introduces unnecessary runtime overhead.

react-md3e takes a server-first approach: components should remain Server Components whenever possible, with client-side boundaries introduced only where interactivity genuinely requires them.

### Styling without runtime CSS-in-JS

Material UI continues to use Emotion as its default styling engine. While CSS-in-JS offers flexibility, runtime style generation comes with architectural and performance trade-offs:

1. Increased client-side JavaScript bundle size.
2. Runtime style generation and injection.
3. Additional server-side styling infrastructure.
4. Increased hydration and rendering overhead.
5. Limitations when working with React Server Components.

react-md3e aims to eliminate these costs by relying on static CSS, native browser capabilities, CSS custom properties, and design tokens instead of runtime CSS-in-JS.

### Familiar API and easy migration

Adopting a new component library should not require rewriting an entire application.

One of the core goals of react-md3e is to maintain API compatibility with @mui/material wherever reasonably possible. This includes familiar component names, prop conventions, composition patterns, event handling, and TypeScript interfaces.

By preserving established API conventions, react-md3e aims to:

- Reduce the effort required to migrate existing Material UI applications.
- Enable gradual, component-by-component migration instead of a complete rewrite.
- Minimize the learning curve for developers already familiar with Material UI.
- Make modern Material Design specifications and React Server Components accessible to existing React applications.
- While full drop-in compatibility is not guaranteed, API differences should be intentional and justified by the Material Design specification, architectural improvements, or performance considerations.

Compatibility should never come at the expense of modern architecture.

## Design principles

- **Material Design 3 native** — built around the latest Material Design specifications rather than retrofitted onto Material Design 2.
- **Expressive by design** — support for Material Design 3 Expressive shapes, typography, motion, and component patterns.
- **Server-first architecture** — React Server Components wherever possible, Client Components only where necessary.
- **Zero-runtime styling** — no Emotion, styled-components, or runtime CSS-in-JS dependencies.
- **Performance-oriented** — minimal JavaScript, efficient rendering, and tree-shakable components.
- **MUI-compatible API** — familiar component APIs and conventions designed to simplify migration from @mui/material.
- **Framework-agnostic** — designed to work with modern React frameworks without unnecessary framework-specific dependencies.
- **Accessibility** — accessible components by design, with proper semantics and keyboard interactions.
- **TypeScript-first** — strongly typed component APIs.

## Local development

Install the exact Node.js version in `.tool-versions` through asdf. CI uses
`actions/setup-node` with `node-version-file: .tool-versions`.

Add the plugin once if needed:

```sh
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
```

```sh
asdf install
npm ci
npm exec -- playwright install chromium
npm run check
```

Start Storybook at `http://localhost:6006`:

```sh
npm run storybook
```

Use the toolbar to switch between precomputed Material, forest, and expressive themes and
light/dark/system modes, plus independent standard/expressive motion.

Start the Next.js RSC/streaming fixture at `http://localhost:3000` with `npm run dev`. Both commands
first build the package. Run `npm run dev:library` in a second terminal to watch UI
implementation/style changes. After changing theme generation or public types, run a full
`npm run build` to regenerate the theme bundle, declarations, and example theme data.

## Releases

Changesets prepares release PRs and changelogs for the public npm package. `alpha` and `beta` use their
own npm channels and GitHub prereleases; stable versions use latest. Read [release instructions](docs/releases.md)
for token-free npm releases, channel transitions, and the exact GitHub/npm UI steps.
Publication runs through the verified Release workflow.

## License

MIT for original code. The bundled Material Color Utilities retains its Apache-2.0 notices and
license in the distributed package.
