# Component ownership and test placement

The filesystem follows component ownership. A component used only by its parent lives in that
parent's subtree. A component shared by multiple implementations lives at the top component level
in its own directory. Use actual reuse to decide when to hoist; planned future reuse alone is not
a reason. Public composition parts such as ListItem or DialogTitle follow their semantic owner,
even when the consumer passes them through children.

Keep `component-name.component.tsx`, `component-name.styles.ts`, and `component-name.types.ts`
together. A private variant may reuse its parent's styles/types. Shared family contracts stay at
the common owner. Use an index only for an intentional export boundary; moving a private component
upward does not expose it from the package.

The current library includes:

```text
src/components/
  surface/
    surface.component.tsx
    surface.types.ts
    surface.styles.ts
    index.ts
    tests/
      surface.browser.spec.ts
      surface.types.tsx
  shape/
    shape.component.tsx
    shape.types.ts
    shape.styles.ts
    index.ts
    tests/
      shape.browser.spec.ts
      shape.types.tsx
  card/
    card.component.tsx
    card.types.ts
    card.styles.ts
    index.ts
    card-content/
      card-content.component.tsx
      card-content.types.ts
      card-content.styles.ts
    card-actions/
      card-actions.component.tsx
      card-actions.types.ts
      card-actions.styles.ts
    card-media/
      card-media.component.tsx
      card-media.types.ts
      card-media.styles.ts
    card-action-area/
      card-action-area.component.tsx
      card-action-area.types.ts
      card-action-area.styles.ts
    tests/
      card.browser.spec.ts
      card.types.tsx
  popover/
    popover.component.tsx
    popover.types.ts
    popover.styles.ts
    popover.helpers.ts
    index.ts
    popover-close/
      popover-close.component.tsx
      popover-close.types.ts
    tests/
      popover.browser.spec.ts
      popover.types.tsx
  list/
    list.component.tsx
    list.styles.ts
    list.types.ts
    index.ts
    contexts/
      list-selection.context.ts
    static-list/
      static-list.component.tsx
    selectable-list/
      selectable-list.component.tsx
    list-item/
      list-item.component.tsx
      list-item.styles.ts
      list-item.types.ts
      static-list-item/
        static-list-item.component.tsx
      selectable-list-item/
        selectable-list-item.component.tsx
        selectable-list-item.styles.ts
      tests/
        list-item.browser.spec.ts
        list-item.types.tsx
    tests/
      list.browser.spec.ts
      list.types.tsx
  list-item-content/
    list-item-content.component.tsx
    list-item-content.styles.ts
    list-item-content.types.ts
    get-list-item-lines.helper.ts
  dialog/
    dialog.component.tsx
    dialog.styles.ts
    dialog.types.ts
    index.ts
    dialog-title/
      dialog-title.component.tsx
      dialog-title.styles.ts
      dialog-title.types.ts
    dialog-content/
      dialog-content.component.tsx
      dialog-content.styles.ts
      dialog-content.types.ts
      dialog-content-text/
        dialog-content-text.component.tsx
        dialog-content-text.styles.ts
        dialog-content-text.types.ts
    dialog-actions/
      dialog-actions.component.tsx
      dialog-actions.styles.ts
      dialog-actions.types.ts
    tests/
      dialog.browser.spec.ts
      dialog.types.tsx
```

ListItemContent is shared by StaticListItem and SelectableListItem, so it lives outside the List
subtree. The selection context belongs to List, the common owner of its selectable list/row branches.
ThemeProvider has the same component layout under `src/theme/theme-provider`; its generator remains
in `src/theme`. Internal hooks retain the agreed `src/internal/hooks/*.hook.ts` convention.

Contexts live in `contexts/*.context.ts` next to their owner. A context shared by sibling branches
belongs to their nearest common component owner. Styling modules remain ordinary server-importable
modules; directory placement does not justify a client directive.

## Tests and verification

Slider owns slider-track/ and slider-thumb/ children. Track segment geometry stays with slider-track;
family validation, types and shared styles live under slider/. Tests remain in slider/tests, and
the fixture and Storybook demonstrations live beneath their respective sliders/slider owners.

SegmentedButton follows the same ownership tree: segmented-button.component.tsx owns
button-segment/button-segment.component.tsx, contexts/segmented-button.context.ts and shared family
styles/types. Its behavior and type checks live in segmented-button/tests; the fixture demonstration
lives beneath the segmented-buttons route and imports only the built package.

Place component behavior and type tests in that component's `tests` directory. Tests exercising a
whole family can live at the family root; a focused child test belongs next to the child. Hook,
style-authoring and theme-generator tests likewise live in their module's `tests` directory.
There is no central repository-level tests directory.

- `*.browser.spec.ts`: Playwright integration against built Next/Storybook consumers. The root
  config discovers `**/tests/**/*.browser.spec.ts`, including nested child directories.
- `*.types.tsx`: compile-time public/component and style-contract checks, included by the tooling
  TypeScript project. They are not browser tests or distributed declarations.
- `*.test.mjs`: Node tests, such as the theme generator checks in `src/theme/tests`.
- `packages/react-md3e/tests/types-consumer`: package-wide NodeNext/Bundler consumer profiles with
  skipLibCheck disabled; these check the built package, rather than one component implementation.
- `apps/next-fixture/app/components/tests`: cross-component route behavior. Application-wide HTTP
  checks belong in `apps/next-fixture/tests`.

Library and fixture production TypeScript projects exclude source tests. Tooling/lint projects
include them separately. Library build and declaration emission exclude every source tests directory,
and package validation rejects test paths in the packed files. Existing scripts run all colocated browser/type checks and the theme/HTTP Node scenarios.

The fixture and extracted Storybook demo components follow the same private-child/shared-component
placement. Next page/layout filenames and Storybook metadata/render callbacks keep their framework
conventions. Public package root and subpath imports remain unchanged.

Checkbox, Radio, RadioGroup and Avatar have their own top-level component directories and colocated
`tests` directories. The private shared `selection-indicator` lives at the same component level
because Checkbox, Radio and selectable ListItem all use it. Avatar's `avatar-image` child owns Base UI
image loading and is its only client boundary. Shared form-control styles live under
`src/internal/selection-control`; they contain no React context or runtime style generation.

TextField and Autocomplete are separate top-level components because the input is used independently
and by Autocomplete. Autocomplete's `autocomplete-input`, `autocomplete-option` and `autocomplete-chip`
children live inside its subtree; their tests are part of the parent's integration scenarios.
`use-merged-refs.hook.ts` lives in `src/internal/hooks`, preserves React 19 callback cleanup and is
shared by TextField/Autocomplete. No theme context or flat sibling component files are introduced.

Popover owns its PopoverClose action; the family tests exercise their state/focus contract together.
Consumer-only passenger examples live beneath the Popover story and fixture route. They do not add
travel-specific components or state to the library.

Surface is a public surface primitive shared by Card and application compositions. Shape is an
independent decorative feature, not a Card child. Card owns its content, actions, media and primary
action area. Color pairing and shadow helpers live under styles and are evaluated only by the CSS
compiler. The offline shape exporter belongs to scripts/shapes and is not a runtime hook/component.

Shape's morph sampler is a build-time helper within the Shape feature. Its transition tests stay
in Shape/tests. Storybook's interactive morph demo lives beneath stories/shape; the Next demo
belongs to the surfaces route. Neither demo is part of the distributed library.

Search follows the same ownership rule: search.component.tsx owns search-bar/, search-view/ and
search-icons/. SearchBar is a public composition part within that feature; SearchView and icons
remain private. Search and SearchBar keep their tests in their respective tests/ directories.

Homepage essentials follow the same tree. Skeleton, Divider, Tooltip, Collapsible, BottomSheet,
SideSheet and Snackbar are top-level features with tests/ beside their implementation. Shared
sheet/ is private and owns sheet-panel/. ButtonGroup owns contexts/button-group.context.ts and
button-group-button/. Snackbar owns snackbar-view/. Button's loading visual lives in its private
button-loading-indicator/ directory. Timing/selection hooks remain in internal/hooks/*.hook.ts.

Shape and LoadingIndicator share the official shape catalog in `src/tokens/shape-variants.ts` and
`src/tokens/shape-paths.generated.ts`. Their build-time contour sampler lives in
`src/styles/shape-morph.ts`. LoadingIndicator compiles only its required silhouettes and does not
import the complete Shape stylesheet. LoadingIndicator's private loading-indicator-geometry.ts
normalizes silhouette bounds and aligns morph vertices only during CSS extraction. ProgressIndicator owns private linear-progress and
circular-progress child components; range normalization is shared with LoadingIndicator under
`src/internal/indicators`, with its own tests directory.
