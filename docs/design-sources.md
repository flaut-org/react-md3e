# Design and implementation sources

Reference inventory recorded on 2026-11-14. Component-specific references and implementation status
are recorded in `components/button.md`, `components/icon-button.md`, `components/app-bar.md`,
`components/dialog.md`, `components/list.md`, `components/checkbox.md`, `components/radio.md`,
`components/avatar.md`, `components/text-field.md`, `components/autocomplete.md`, `components/popover.md`, `components/search.md`, `components/surface.md`, `components/shape.md`, `components/card.md`, `components/typography.md`, and `theming.md`.

## Primary references

Calendar and RangeCalendar use pinned AndroidX DatePickerModalTokens v0_210 and the requested
MUI/m3e full-width page-slide choreography. [Calendar documentation](components/calendar.md) records the exact revision,
MUI API references, native Temporal/Intl adaptation and the unverified Figma access.

| Reference                                                                                                                                                                | Purpose                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [Material 3 components](https://m3.material.io/components)                                                                                                               | Overview, specs, guidelines, and accessibility per component    |
| [Buttons specification](https://m3.material.io/components/buttons/specs)                                                                                                 | Example of concrete component appearance and state requirements |
| [Material 3 design tokens](https://m3.material.io/foundations/design-tokens/overview)                                                                                    | Reference/system/component token model                          |
| [Material motion](https://m3.material.io/styles/motion)                                                                                                                  | Expressive motion and token guidance                            |
| [Google Material 3 Figma kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)                                                            | Visual variants, dimensions, and variables                      |
| [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)                                                                        | Official Material 3 Expressive implementation context           |
| [AndroidX Material3 tokens](https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens) | Implementation values to pin by commit when adopted             |
| [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)                                                                              | Build-time color generation candidate                           |
| [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)                                                                                                                | Browser keyboard and accessibility patterns                     |
| [Base UI](https://base-ui.com/react/overview/quick-start)                                                                                                                | Applicable interaction primitives and integration requirements  |
| [MUI source](https://github.com/mui/material-ui)                                                                                                                         | Familiar API conventions and adaptable implementation patterns  |
| [Google Material Symbols](https://github.com/google/material-design-icons)                                                                                               | Official SVG/icon source for later icon work                    |

The Figma kit has not been read in this foundation. Direct Figma access must be confirmed before
attributing dimensions or implementation decisions to a specific node.

## Google Design MCP

The official endpoint is `https://design.googleapis.com/mcp`.
[Its published reference](https://developers.google.com/design-mcp/reference/mcp) lists
`generate_color_scheme`, `search_icons`, `icons_instructions`, `search_fonts`, and `describe_font`.

These tools assist with colors, fonts, and icons. They do not replace complete component
specifications, Figma inspection, or browser interaction tests. An expressive color scheme does not
by itself implement Material 3 Expressive components.

No MCP server, credentials, or external design connection is required for the repository's local
checks. Integrations can be added when they are actually used.

## Provenance when implementing

Navigation bar/rail/drawer use the rendered official specifications and expanded token tables,
AndroidX revision 0fb269260ea4c1e7b27b58500699ab07cefdca83, and M3E revision
e8bf648be92ae30ca11f51645d4d9d0167730a5c. [Navigation](components/navigation.md) records
exact source paths, baseline/Expressive distinctions, the Figma 403, web adaptations and the
normalized width trajectory measured from the official Guidelines 27 expansion recording.

SplitButton uses the rendered official split-button specifications, AndroidX SplitButton and its
five size token sets (18_0_18) at 33b3d2d28722bf91670634ab0e707192330de497, and the m3e reference
at 54bb59c2a8270dd6fde905b68761d3e968cad81a. See [SplitButton](components/split-button.md) for exact
URLs, optical offsets, the required standard-motion rotation, web hit targets and reuse of Menu.

Menu uses the rendered November 2025 Expressive menu specifications and expanded common token
table, baseline AndroidX MenuTokens v0_210 at 33b3d2d28722bf91670634ab0e707192330de497, and
the related m3e Menu/Autocomplete reference at 54bb59c2a8270dd6fde905b68761d3e968cad81a.
See [Menu](components/menu.md) for exact paths, CSS/web adaptations, the verified Figma 403 and
frame-by-frame analysis of the requested Guidelines 20/22 recordings (555 frames at 60fps).

Autocomplete shares that Expressive Menu presentation, independently of its Combobox interactions.
The requested m3e Autocomplete and OptionPanelElement/OptionElement sources at the same pinned
revision confirm large panel corners, labelLarge typography, tertiary selection and leading checks.
See [Autocomplete](components/autocomplete.md) for exact URLs and the retained web adaptations.

Slider combines the rendered official MD3 slider specifications, AndroidX SliderTokens v2_3_5 at
009564af4f3f92df06e213711cb5327ceabc4e47 and the requested M3E CSS reference at
f5bf147ce86c68ee7f8aec15767042a907028a22. See [Slider](components/slider.md) for exact source paths,
independent CSS adaptations, all-size measurements and Figma access limits.

SegmentedButton uses the rendered official MD3 segmented-button specifications, AndroidX token
version v0_162 at 009564af4f3f92df06e213711cb5327ceabc4e47 and the requested M3E CSS reference at
aa2f9ad252c06301e8874d3188d486464e8cc170. See [SegmentedButton](components/segmented-button.md)
for exact paths, independent CSS adaptations and Figma access limits.

For each adopted component or token family, record the official page, source revision or Figma
file/node version when available, and any web-specific adaptation. Branch links above are discovery
links, not pinned specifications.

For copied code, record the upstream path and commit and retain its copyright/license notice. Add
third-party notices to the distributed package when such source is adopted. No MUI or icon source has been copied. Shape now includes derived Apache-2.0 AndroidX geometry,
with pinned provenance, a reproducible offline exporter and a bundled license; see components/shape.md.

Google's icon repository contains official assets. Its README distinguishes those from the
third-party npm distributions it lists. The icon distribution strategy is not selected yet.

Search uses official MD3 Expressive contained-search specifications and the requested M3E motion
reference pinned at ea07174df53e40e723431fa7df2fa5d0e3a37ab1. See components/search.md for exact URLs
and web/CSS adaptations. No code was copied from that reference.

Typography's 15 emphasized metric sets use pinned AndroidX TypeScaleTokens v0_103 at
160825094a81825468a95b115bfb1b541e549856; components/typography.md records the original sources and
the independent HTML/CSS adaptation. Numerical token data is transcribed without implementation code.

## Homepage primitives (2026-11-16)

Tooltip's 2026-11-26 plain/rich audit adds the supplied Material mirror, pinned AndroidX Tooltip.kt /
PlainTooltipTokens / RichTooltipTokens at `009564af4f3f92df06e213711cb5327ceabc4e47`, WAI-ARIA and
MUI API references. [Tooltip](components/tooltip.md) records exact sources, browser adaptations and
the outstanding Figma/manual assistive-technology verification.

Official rendered specifications consulted for [Divider](https://m3.material.io/components/divider/specs),
[Tooltip](https://m3.material.io/components/tooltips/specs),
[Button groups](https://m3.material.io/components/button-groups/specs),
[Bottom sheets](https://m3.material.io/components/bottom-sheets/specs),
[Side sheets](https://m3.material.io/components/side-sheets/specs) and
[Snackbar](https://m3.material.io/components/snackbar/specs). These are living web references with no
pinned revision. Interaction contracts were checked against installed Base UI 1.9.0 source/types
(Drawer, Tooltip, ToggleGroup/Toggle, Collapsible and Toast); no implementation was copied.

Skeleton and Collapsible are web utilities rather than claims of separate MD3 visual specifications.
Button loading uses a circular web progress visual; the separate Expressive LoadingIndicator catalog
is not included. See each component document for exact adaptations and intentionally bounded APIs.
No Google Figma access or pixel-perfect conformance is claimed. Motion uses the library's existing
precomputed CSS spring curve; native gesture geometry comes from Base UI.

## Toolbar

[Toolbar](components/toolbar.md) records official MD3 diagrams, Android Material Components v34.0.0
tokens at ca5b9e4ca22b23adc8f50e178f267793ac741ca4, and AndroidX defaults at
1b7fa70578d3045e52d699228a6c9e4d6490cb87. Chromium rendered the official specs on 2026-11-26.
Figma listed Toolbars page 58295:22726, then the account quota rejected the detailed read.
Color-reference differences, density/placement/overflow/focus adaptations and unverified Figma parity
are explicit in the component document.
