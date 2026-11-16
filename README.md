# react-md3e

An independent React library for Material 3 Expressive, with server-compatible components,
build-time CSS, and a token-based theme API inspired by Google's Material Theme Builder.

Implemented: Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Radio/RadioGroup, Avatar, TextField, Autocomplete, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, BottomSheet, SideSheet, Snackbar, ThemeProvider, createTheme, static theme export, and Storybook. The first
consumer milestone remains Flaut's complete homepage; it has not been migrated yet.

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
light/dark/system modes. Stories cover all Button appearances, sizes, shapes, disabled state,
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
import '@flaut-travel/react-md3e/styles.css';

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
stylesheet once at the application root. Event handlers belong in consumer client components.

`createTheme` runs in server/build code and returns serializable light/dark color roles, tonal
palettes, harmonized custom colors, typography, shape, and CSS variables. Its separate entry keeps
color generation out of component imports. `themeToCss` can export custom themes as build-time CSS.
See [theming](docs/theming.md), [Button](docs/components/button.md),
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
for CI-first 1.0.0-alpha.1 publishing, npm Trusted Publishing, and the exact GitHub/npm UI steps.
No package has been published by this setup.
