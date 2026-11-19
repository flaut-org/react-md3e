# Architecture

Status: Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Switch, Slider, Radio/RadioGroup, Avatar, Badge, TextField, Autocomplete, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, SegmentedButton/ButtonSegment, BottomSheet, SideSheet, Snackbar, and theme infrastructure implemented, 2026-11-19.

## Ownership and boundaries

Slider composes Base UI Slider for native inputs, keyboard/pointer behavior and commit lifecycle.
It owns private slider-track/ and slider-thumb/ children, shared family styles and validation helpers.
Three Material variants, five sizes and icon placement use extracted CSS; current values supply only
geometry variables. Its explicit `/slider/styles.css` entry has no Tooltip/Shape/ripple dependency.
See [Slider](components/slider.md) for API, provenance and web adaptations.

SegmentedButton owns ButtonSegment and their selection context. Its Base UI ToggleGroup/Toggle
adapter provides baseline outlined radio/checkbox selection with roving focus, hidden form values
and native reset. Both preserve interactive client boundaries and server-rendered markup; the explicit
`/segmented-button/styles.css` entry includes only family and ripple styles. See
[SegmentedButton](components/segmented-button.md) for API, provenance and web adaptations.

Switch composes Base UI Switch for state, keyboard/label accessibility and native form input. Its
private gesture hook adds direct pointer dragging through a geometry variable; CSS owns handle
position/size, state colors, ripple and motion. See [Switch](components/switch.md).

Badge is passive server presentation: small notification dots and large count/status labels use
compiled CSS, logical icon anchoring and the shared visibility springs. It has no client boundary,
interaction primitive or runtime dependency. See [Badge](components/badge.md).

Calendar and RangeCalendar add inline Temporal-based date selection. RangeCalendar composes Calendar;
Calendar owns its day, month/year-choice and transition children. Both are interactive client entries
with server-rendered markup and explicit `/calendar/styles.css` / `/range-calendar/styles.css` exports.
Date formatting uses native Intl on Temporal.PlainDate without a default timezone or adapter runtime.
See [Calendar](components/calendar.md) for compatibility and runtime requirements.

`@flaut-travel/react-md3e` owns its MD3 Expressive appearance and public API. Base UI is the intended
behavior foundation for interactive primitives. Button composes the Base UI Button and is a client
component for semantics and press ripple behavior. IconButton shares those primitives and the
private ripple controller. AppBar is a native header layout and stays server-compatible; its
actions can contain independent client controls. Scroll elevation is controlled by the consumer.
Button and IconButton render HTML on the server and hydrate for interaction; AppBar itself needs
no hydration when used from RSC. ThemeProvider and style modules remain server-compatible without
client context.

MUI conventions may be reused where appropriate, but there is no runtime/type dependency or promise
of MD2 compatibility. Linear indeterminate progress adapts MUI's numerical animation parameters under MIT, recorded
in the package's THIRD_PARTY_NOTICES.md; it has no runtime coupling to MUI.

Flaut search, fetching, analytics, routing, currency, and calendar-price logic remain in the
application. The first migration target is the complete homepage.

## Workspace

| Path                                                   | Responsibility                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| `packages/react-md3e`                                  | The single publishable package                                    |
| `.storybook`, `stories`                                | Storybook consumer of the built package and precomputed themes    |
| `apps/next-fixture`                                    | Production Next.js RSC/client and streaming consumer              |
| `scripts`                                              | Artifact validation, build housekeeping, and theme precomputation |
| Component/module `tests` directories                   | Colocated unit, type and Chromium browser checks                  |
| `packages/react-md3e/tests`, `apps/next-fixture/tests` | Package consumer and application integration checks               |
| `docs`                                                 | Contracts, decisions, references, API, and migration status       |

Use npm workspaces and one lockfile. `.tool-versions` pins Node.js 26 LTS; use asdf locally. CI
reads that file through `actions/setup-node`. Both Storybook and Next consume `dist` through package
exports without aliases to source.

## Source and API

- `src/tokens/material-tokens.ts`: role names, tones, and baseline type-scale measurements.
- `src/theme`: generator, serializable types, CSS scope, and ThemeProvider.
- `src/components/button`, `src/components/icon-button`: Base UI composition, types, and styles.
- `src/components/list`: server wrappers/static ul-li presentation, shared item content, and a
  Base UI ToggleGroup/Toggle listbox adapter for single/multiple selection. Only interaction adds
  a client boundary; selection metadata context does not provide theme values.
- `src/components/app-bar`: server-compatible header layout, types, and styles.
- `src/components/dialog`: Base UI modal, accessible title/description, server-compatible content
  and actions, and extracted appearance.
- `src/components/surface`: server-compatible themed surfaces, corners and elevation.
- `src/components/loading-indicator`, `src/components/progress-indicator`: passive RSC progress semantics, build-time geometry and CSS-only timelines; shared range logic in `src/internal/indicators`.
- `src/components/shape`: build-time Expressive masks and compatible morph contours, independent
  of ordinary surface corners.
- `src/components/card`: Surface-based static composition with an isolated client action area.
- `src/components/popover`: Base UI anchored interactive panel, a nested PopoverClose action,
  typed positioning/focus contracts and compiled theme-aware appearance.
- `src/internal/hooks/use-portal-container.hook.ts`: resolves the nearest CSS theme/portal host
  from a hidden DOM anchor without copying or computing theme styles.
- `src/styles/theme-tokens.ts`: shared build-time color/typography references and spring sampling;
  evaluated during extraction and absent from the distributed UI runtime graph.
- `src/internal/hooks`: private React hooks, including the input/geometry controller in
  `use-ripple.hook.ts`.
- `src/internal/ripple`: geometry measurement helper and extracted ripple styles.
- `src/styles/style-object.types.ts`: author-time CSS property, variable, nesting, and keyframe
  types.

Component implementations form an ownership tree: a private child is nested under its parent;
shared components live at the top component level. List owns ListItem and its static/selectable
variants. ListItemContent is shared by both row implementations and lives in its own top-level
component directory. Dialog owns its title/content/actions parts, and DialogContent owns its text
part. Popover owns its PopoverClose composition action. ThemeProvider has its own directory under the theme feature.

Each implementation uses `component-name.component.tsx`; its types and styles stay in that directory.
Contexts live in the owner's `contexts` directory, using the nearest common owner for shared child
branches. Tests live beside the component/module in `tests`; package and application integration
checks use their respective package/application `tests` directories.

See [component structure](component-structure.md) for the concrete tree and test discovery. Framework
route files keep their reserved names. Internal hooks remain in `src/internal/hooks` as `*.hook.ts`.

Public exports:

| Entry               | Exports                                                                                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| package root        | Button, IconButton, AppBar, Dialog, List/ListItem, Checkbox, Switch, Slider, Radio/RadioGroup, Avatar, Badge, TextField, Autocomplete, Search/SearchBar, Popover, Surface, Shape, Card, Typography, Skeleton, Divider, Tooltip, Collapsible, ButtonGroup, SegmentedButton/ButtonSegment, BottomSheet, SideSheet, Snackbar, ThemeProvider, and public UI/theme types |
| `/button`           | Button and its types                                                                                                                                                                                                                                                                                                                                                |
| `/icon-button`      | IconButton and its types                                                                                                                                                                                                                                                                                                                                            |
| `/app-bar`          | AppBar and its types                                                                                                                                                                                                                                                                                                                                                |
| `/dialog`           | Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, and types                                                                                                                                                                                                                                                                                     |
| `/list`             | List, ListItem and public presentation/selection types                                                                                                                                                                                                                                                                                                              |
| `/checkbox`         | Checkbox and its types                                                                                                                                                                                                                                                                                                                                              |
| `/switch`           | Switch and typed state, native form and handle-icon props                                                                                                                                                                                                                                                                                                           |
| `/slider`           | Slider and typed Material variants, sizes, range, marks and value-label contracts                                                                                                                                                                                                                                                                                   |
| `/radio`            | Radio and its types                                                                                                                                                                                                                                                                                                                                                 |
| `/radio-group`      | RadioGroup and its types                                                                                                                                                                                                                                                                                                                                            |
| `/avatar`           | Avatar, size/shape types and native image props                                                                                                                                                                                                                                                                                                                     |
| `/badge`            | Badge, Material small/large variants and native span slot props                                                                                                                                                                                                                                                                                                     |
| `/text-field`       | TextField and its typed input/container slot contracts                                                                                                                                                                                                                                                                                                              |
| `/autocomplete`     | Generic Autocomplete, selected-value types and render contracts                                                                                                                                                                                                                                                                                                     |
| `/typography`       | Typography and its polymorphic semantic/style/color/alignment types                                                                                                                                                                                                                                                                                                 |
| `/surface`          | Surface and typed surface/corner/elevation contracts                                                                                                                                                                                                                                                                                                                |
| `/shape`            | Shape, the 35-variant catalog and its types                                                                                                                                                                                                                                                                                                                         |
| `/card`             | Card, CardContent, CardActions, CardMedia, CardActionArea and their types                                                                                                                                                                                                                                                                                           |
| `/search`           | Search, SearchBar and own query/view/layout types                                                                                                                                                                                                                                                                                                                   |
| `/popover`          | Popover, PopoverClose and own positioning/focus/state types                                                                                                                                                                                                                                                                                                         |
| `/skeleton`         | Server-compatible loading placeholders and types                                                                                                                                                                                                                                                                                                                    |
| `/divider`          | Server-compatible separators and types                                                                                                                                                                                                                                                                                                                              |
| `/tooltip`          | Plain Base UI Tooltip and types                                                                                                                                                                                                                                                                                                                                     |
| `/collapsible`      | Base UI disclosure and types                                                                                                                                                                                                                                                                                                                                        |
| `/button-group`     | ButtonGroup, ButtonGroupButton and selection types                                                                                                                                                                                                                                                                                                                  |
| `/segmented-button` | SegmentedButton, ButtonSegment and discriminated single/multiple selection types                                                                                                                                                                                                                                                                                    |
| `/bottom-sheet`     | BottomSheet and own panel/state types                                                                                                                                                                                                                                                                                                                               |
| `/side-sheet`       | SideSheet and own panel/state types                                                                                                                                                                                                                                                                                                                                 |
| `/snackbar`         | Snackbar and notification types                                                                                                                                                                                                                                                                                                                                     |
| `/calendar`         | Calendar, CalendarDay and Temporal date/view/slot types                                                                                                                                                                                                                                                                                                             |
| `/range-calendar`   | RangeCalendar and range/position types                                                                                                                                                                                                                                                                                                                              |
| `/theme`            | createTheme, themeToCss, and generation/token types                                                                                                                                                                                                                                                                                                                 |
| `/styles.css`       | Optional compatibility stylesheet for the entire catalog; prefer `/theme/styles.css` and `/<component>/styles.css`                                                                                                                                                                                                                                                  |

Keep generation in `/theme`. A UI import must never pull that entry or a CSS compiler into the
browser. `scripts/check-package.mjs` follows the actual emitted UI import graph.

## Build

1. Clean the package output.
2. Build the independent theme entry, bundling official Material Color Utilities so it also works in
   Node despite upstream extensionless ESM imports.
3. Generate default theme data for static CSS interpolation.
4. Compile UI with Vite 7, Linaria 8, and WyW 2. Preserve ESM modules and client directives; extract
   CSS into private module assets; dependency-aware public `dist/<component>.css` entries and `dist/theme.css` reference them. `dist/styles.css` remains an explicit compatibility opt-in.
5. Emit declarations with TypeScript, then normalize relative module paths with the declaration
   finalizer. TypeScript resolution supplies the actual file or directory index; published imports
   use explicit `.js` paths.
6. The root postbuild generates Storybook theme JSON and the fixture's custom theme CSS.

Vite 7 is a supported Storybook 10/WyW integration. The color bundle is distinct from the small UI
modules. Compilers and color utilities are build dependencies, not runtime package dependencies.
React/React DOM are peers; React 19 is the initial range.

Author rules as objects with `satisfies StyleObject`, backed by csstype, including nested selectors,
media queries, and keyframes. Linaria tags only mark the object for compile-time extraction. Types
and complete style objects are erased from UI JavaScript.

Source imports omit JS/TS extensions. Vite resolves them during development and writes explicit ESM
paths in distributed JS; the declaration finalizer does the same for `.d.ts`. CSS/JSON imports retain
their extensions. See [module resolution](module-resolution.md).

Normal consumers import built JS and CSS without installing a compiler. Consumer-authored `styled`
extensions need a separate compiler integration; no public styled factory has been implemented. Do
not claim that path is validated by the current class-based components.

## Theme and runtime behavior

ThemeProvider renders a div containing a compiled CSS scope. A server-created theme can provide
values in its style attribute; static `themeToCss` export can deliver those values in a stylesheet
instead. No context, registry, effect, or CSS rule insertion is involved.

CSS color-scheme and light-dark select modes. DOM attributes and pseudo-classes select Button
states, sizes, and shapes. A sampled Expressive spring is compiled to CSS linear; it does not
require animation JavaScript or promise velocity-preserving retargeting.

Button adds a bounded pointer-origin ripple and centered keyboard/assistive ripple. A private
controller manages transient DOM spans, coordinates, touch delay, and cleanup. Geometry measurement
and calculation live in `ripple-geometry.ts`; node setup is isolated in `createRippleInk`, while
`start` orchestrates the optional effect inside positive conditional blocks. All animations live
in compiled CSS; the only dynamic style values are coordinates and dimensions passed to existing CSS
variables. No React render loop or CSS rule insertion drives animation.

Dialog adds a Base UI client boundary for modal focus, portals, scroll locking, and dismissal.
Its title and short description use client context; content/actions remain server-compatible.
The portal mounts after hydration inside the nearest theme/portal scope by default, preserving
CSS inheritance. See `components/dialog.md` for custom containers and rendering semantics.

Client event handlers belong in consumer client components. The Next fixture verifies hydration,
keyboard/touch input, state changes, and streaming alongside server-rendered themes.

## Verification and limits

Checks cover complete package artifacts and notices, ordinary/react-server imports, NodeNext and
Bundler consumers with `skipLibCheck: false`, and absence of
generators from the UI graph, theme generation, public prop types, actual Next/Storybook production
builds, streamed styled content, native behavior, themed CSS, and accessibility.

Chromium is covered; other browser engines and Figma parity are not claimed. CSS modern features are
part of the support contract. Consumer-authored styled factories, dynamic image extraction,
variable-font axes and Android-specific sparkle shaders remain unimplemented.

Checkbox and Radio share SelectionIndicator presentation with selectable ListItem, while Base UI
owns their separate form-control semantics. RadioGroup owns radio selection and native form naming.
The Avatar wrapper/initials path stays server-compatible; only its nested image-loading branch uses
Base UI's client state. Each component has a public subpath, Storybook stories and colocated tests.
See [Checkbox](components/checkbox.md), [Radio](components/radio.md), and [Avatar](components/avatar.md).

TextField owns the shared filled/outlined input, label, helper and adornment layout. Autocomplete
composes it through slots, with private input/option/chip children and Base UI Combobox behavior.
Its popup inherits the nearest theme scope and parent portal. See [TextField](components/text-field.md)
and [Autocomplete](components/autocomplete.md) for API, form and accessibility details.

Popover uses the shared portal host resolver to preserve theme inheritance and composes Base UI
positioning, nonmodal/modal focus and dismissal. Its trigger is server-rendered; portal content mounts
after hydration. Arbitrary form content remains application-owned. See [Popover](components/popover.md)
for rendering semantics, API, nested interactions and custom anchor/container behavior.

Surface and Card use the full MD3/Expressive corner scale through theme CSS variables. Shape's abstract
silhouettes are separate static masks derived from pinned AndroidX definitions. `scripts/shapes`
contains a maintainer-only offline exporter; regular Node/asdf builds consume checked-in paths and
extract them into CSS. A private build-only sampler creates matching polygon contours for native
CSS morph transitions. The geometry generator, sampler and path data do not enter the UI JavaScript
graph; Shape keeps its server boundary even when morphing is enabled.
Card's content/actions/media remain server components; only its primary action area is interactive.
See [Surface](components/surface.md), [Shape](components/shape.md) and [Card](components/card.md).

Search owns a public nested SearchBar (Base UI Input), private SearchView (Base UI Dialog), and
private search icons. Its query is independent of selected-item Autocomplete behavior. The portal
resolver preserves CSS themes; the anchor hook supplies only measured geometry variables to compiled
CSS rectangle/scale transitions. Search/SearchBar hydrate for input/overlay behavior, while theme and
styles stay server-compatible. See [Search](components/search.md).

Typography is a server-compatible presentation primitive with independent HTML semantics and MD3
visual variants. createTypography resolves 15 baseline and 15 emphasized styles only in the isolated
theme bundle. The shared typography helper expands paired CSS variable references during extraction;
component JS receives no token table or generator. Per-style theme overrides preserve the existing
baseline token names and add canonical emphasized prefixes. See [Typography](components/typography.md).

The homepage primitives add no runtime dependency. Skeleton and Divider are pure server presentation.
Tooltip, Collapsible, ButtonGroup and Snackbar wrap Base UI interaction primitives. BottomSheet and
SideSheet share the private top-level Sheet implementation because both use it. It owns sheet-panel/
and Drawer keyboard/portal/viewport composition; public panel bodies mount after hydration, including
standard inline sheets. ButtonGroup owns its context and ButtonGroupButton; Snackbar owns SnackbarView.
The toast timer and input selection controller live in internal/hooks. Styling stays extracted and
portals inherit CSS scopes without React theme context or generated rules.

Release tooling uses Changesets 3 outside the UI dependency graph. A single public npm workspace
is versioned; the private fixture follows its exact version. The wrapper starts new alpha/beta
channels at .1, keeps the lockfile synchronized and explicitly selects dist-tags through a packed
publish plan. CI-gated GitHub automation creates release PRs and GitHub Releases, with OIDC for
registry publication. See [Releases](releases.md) for setup and recovery boundaries.
