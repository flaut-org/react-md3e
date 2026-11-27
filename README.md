<h1 align="center">react-md3e</h1>

<div align="center">

![GitHub License](https://img.shields.io/github/license/flaut-org/react-md3e?style=for-the-badge&color=%232196f3)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/flaut-org/react-md3e/ci.yml?style=for-the-badge)

</div>

A modern React component library implementing Google's [Material Design 3 (Material You)](https://m3.material.io/) and Material Design 3 Expressive, built for the modern React ecosystem with performance, accessibility, and React Server Components in mind.

## Usage

> [!CAUTION]
> Currently in early alpha. The API is subject to breaking changes and may undergo a complete overhaul. Please wait for the public beta release.

Components load their precompiled CSS automatically, from root or subpath imports:

```tsx
import { Button, Checkbox, ThemeProvider } from '@flaut-travel/react-md3e';

<ThemeProvider>
  <Button>Continue</Button>
  <Checkbox aria-label="Accept terms" />
</ThemeProvider>;
```

Production bundlers retain used component styles and their dependencies. Next Webpack root imports
require `experimental.optimizePackageImports`; component subpaths (including `/theme-provider`),
Turbopack and Vite need no such setting. See [CSS loading](docs/css-loading.md)
for tree-shaking, native Node compatibility and migration from explicit stylesheet imports.

## Component support

Coverage follows Google's [Material 3 component catalog](https://m3.material.io/components), including
Material You and M3 Expressive. Component names link to the official guidance; public APIs link to
this library's documentation. Composition parts are listed with their owning component.

✅ Implemented · ⚠️ Partially implemented · ❌ Not implemented

Statuses describe the available public APIs and Material variants. Partial support includes missing
variants or interactions and functionality available only inside another component. Visual verification
and platform-specific adaptations are documented in the linked component notes.

| Material component                                                                           | Support | Implementation / missing support                                                         |
| -------------------------------------------------------------------------------------------- | :-----: | ---------------------------------------------------------------------------------------- |
| [App bars](https://m3.material.io/components/app-bars/overview)                              |   ✅    | Supported                                                                                |
| [Badges](https://m3.material.io/components/badges/overview)                                  |   ✅    | Supported                                                                                |
| [Bottom sheets](https://m3.material.io/components/bottom-sheets/overview)                    |   ⚠️    | Partially supported. Snap points and swipe-to-open are absent.                           |
| [Button groups](https://m3.material.io/components/button-groups/overview)                    |   ✅    | Supported                                                                                |
| [Buttons](https://m3.material.io/components/buttons/overview)                                |   ✅    | Supported                                                                                |
| [Cards](https://m3.material.io/components/cards/overview)                                    |   ✅    | Supported                                                                                |
| [Carousel](https://m3.material.io/components/carousel/overview)                              |   ❌    | Not supported                                                                            |
| [Checkbox](https://m3.material.io/components/checkbox/overview)                              |   ✅    | Supported                                                                                |
| [Chips](https://m3.material.io/components/chips/overview)                                    |   ✅    | [Supported                                                                               |
| [Date pickers](https://m3.material.io/components/date-pickers/overview)                      |   ✅    | [Calendar, fields and docked/modal/responsive pickers](docs/components/date-pickers.md). |
| [Dialogs](https://m3.material.io/components/dialogs/overview)                                |   ✅    | Supported                                                                                |
| [Divider](https://m3.material.io/components/divider/overview)                                |   ✅    | Supported                                                                                |
| [Extended FABs](https://m3.material.io/components/extended-fab/overview)                     |   ✅    | Supported                                                                                |
| [FAB menu](https://m3.material.io/components/fab-menu/overview)                              |   ✅    | Supported                                                                                |
| [Floating action buttons](https://m3.material.io/components/floating-action-button/overview) |   ✅    | Supported                                                                                |
| [Icon buttons](https://m3.material.io/components/icon-buttons/overview)                      |   ✅    | Supported                                                                                |
| [Lists](https://m3.material.io/components/lists/overview)                                    |   ✅    | Supported                                                                                |
| [Loading indicator](https://m3.material.io/components/loading-indicator/overview)            |   ✅    | Supported                                                                                |
| [Menus](https://m3.material.io/components/menus/overview)                                    |   ⚠️    | Partially supported. No context gestures, horizontal or baseline variant.                |
| [Navigation bar](https://m3.material.io/components/navigation-bar/overview)                  |   ✅    | Supported                                                                                |
| [Navigation drawer](https://m3.material.io/components/navigation-drawer/overview)            |   ✅    | Supported                                                                                |
| [Navigation rail](https://m3.material.io/components/navigation-rail/overview)                |   ✅    | Supported                                                                                |
| [Progress indicators](https://m3.material.io/components/progress-indicators/overview)        |   ✅    | Supported                                                                                |
| [Radio button](https://m3.material.io/components/radio-button/overview)                      |   ✅    | Supported                                                                                |
| [Scroll fields](https://m3.material.io/components/scroll-fields)                             |   ❌    | Not supported                                                                            |
| [Search](https://m3.material.io/components/search/overview)                                  |   ⚠️    | Partially supported. The divided search style is absent.                                 |
| [Segmented buttons](https://m3.material.io/components/segmented-buttons/overview)            |   ✅    | Supported                                                                                |
| [Side sheets](https://m3.material.io/components/side-sheets/overview)                        |   ✅    | Supported                                                                                |
| [Sliders](https://m3.material.io/components/sliders/overview)                                |   ✅    | Supported                                                                                |
| [Snackbar](https://m3.material.io/components/snackbar/overview)                              |   ⚠️    | Partially supported. Swipe dismissal is absent.                                          |
| [Split buttons](https://m3.material.io/components/split-button/overview)                     |   ✅    | Supported                                                                                |
| [Switch](https://m3.material.io/components/switch/overview)                                  |   ✅    | Supported                                                                                |
| [Tabs](https://m3.material.io/components/tabs/overview)                                      |   ✅    | Supported                                                                                |
| [Text fields](https://m3.material.io/components/text-fields/overview)                        |   ⚠️    | Partially supported. A built-in character counter and select mode are absent.            |
| [Time pickers](https://m3.material.io/components/time-pickers/overview)                      |   ❌    | Not supported                                                                            |
| [Toolbars](https://m3.material.io/components/toolbars/overview)                              |   ✅    | Supported                                                                                |
| [Tooltips](https://m3.material.io/components/tooltips/overview)                              |   ✅    | Supported                                                                                |

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
