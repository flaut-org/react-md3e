# UI QA infrastructure verification — 2026-11-27

The independent-only baseline gate described in this dated report was subsequently extended to
support explicit PR-author maintainer confirmation. See the current [baseline review policy](ui-quality.md#baseline-review).
Historical verification results below remain unchanged.

## Audit and delivered scope

The audit covered AGENTS.md, architecture/design/tooling documents, package scripts, Playwright,
GitHub Actions, the Storybook preview and production Next.js fixtures. The existing suite had 71
colocated browser-spec files, production HTTP/RSC/streaming/package checks and 53 Storybook story
files before the new QA story group. It already contained regressions for all five reported date
defects, including pixel-run checks for range dashes. Several checks observed only settled state or
sampled paused animations; screenshots were diagnostic artifacts rather than reviewed comparisons.
The browser suite used Chromium, a list reporter and failure traces.

The implementation preserves that stack and adds strict Storybook screenshot comparisons, 22 initial
Linux x64 baseline candidates, real-frame motion/focus/resize/clipping probes, constrained and nested
fixtures, cross-browser and touch projects, console checks, a requirement inventory/report and policy
tests. The fast UI suite contains 25 checks. The expanded suite contains 103 checks across three
engines in normal and reduced motion plus Chromium touch. Their scopes and exact versions are
recorded in artifacts. The traceability inventory contains 21 significant initial requirements.
No package runtime dependency, styling runtime or client boundary was added.

## Commands and CI

See [the workflow guide](ui-quality.md) for complete commands and review instructions. The main commands
are `test:ui:container`, `test:ui:extended:container`, `test:ui:review`, `test:ui:update`,
`test:ui:mutations:container` and `check:ui-contract`. Component paths, project names and `--grep`
can narrow a run. Updates are explicit candidate generation; regular tests and CI never update images.

CI reuses existing package/Storybook builds for a new fast UI job and the stable `UI Quality Gate`.
The expanded matrix runs manually, weekly or for a PR labeled `ui-extended`. Reports, traces, videos,
screenshots, visual diffs, motion data and specification coverage are uploaded. A separate baseline
approval check requires an independent human collaborator's current-head approval. Branch protection
must require both that check and the quality gate. Repository settings were not changed.

Existing architecture, package, HTTP/RSC, bundler and release checks remain. `npm run check` adds only
the inexpensive specification/policy validation; it does not include the expanded UI matrix. General
browser output now has its own directory so it cannot erase UI or independent-review artifacts.

## Known-defect regression evidence

| Requirement                | Healthy regression | Injected defect and detection                                                                 |
| -------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| DP-001: section entry      | PASS               | PASS: bypassing section input handling fails the next-section assertion                       |
| DP-002: icon focus/label   | PASS               | PASS: brief pointerdown focus is captured and fails the unwanted-input-focus assertion        |
| DP-003: calendar height    | PASS               | PASS: outgoing frame placed in flow produces a 336px excursion and fails the height assertion |
| DP-004: nested clipping    | PASS               | PASS: constrained scrollable picker content fails the per-frame clipping/scrollbar assertion  |
| DP-005: preview dash joins | PASS               | PASS: per-cell dash restart produces an actual/expected/diff mismatch                         |

Each sensitivity proof runs an unchanged healthy control first, then injects only browser-local
DOM/event/CSS faults. No component source, built asset or baseline is changed by injection. Only a
failure at the named defect assertion earns detection; startup failures and missing baselines are
rejected. Policy unit tests also reject those false-positive cases. These are mechanism reproductions,
not claims of checking out unavailable historical revisions.

## Independent review and real defect found

The independent QA agent received the original task and read the specification itself. It reviewed
the infrastructure, exercised Storybook through a separate real browser driver and actually viewed
state and intermediate-motion images. Its findings led to regression-tested corrections for incomplete
project results incorrectly receiving PASS, stale test-title links and unrelated failures incorrectly
counting as successful fault detection. It also verified the native-entry synchronization and the
distinction between hidden inert reduced-motion frames and completed animated-frame removal.

The reviewer found a real visible collision: in a narrow RTL field with 150% typography, a long
resting label overlapped the calendar icon while the original operability check passed. TF-001 was
added and failed at its intended geometry assertion against the old built assets. TextField now uses
native grid areas that reserve the actual trailing adornment space. The label spans leading+input
tracks to preserve existing floating-label coordinates and motion. Multiple Autocomplete retains its
wrapping flex composition through its own adapter. A patch changeset records this package fix.

Independent re-verification in host Chromium 159 passed 18 scenario groups with zero browser diagnostics, including the
corrected label, currency adornments in both directions/variants, label blur frames, multiline,
multiple Autocomplete selection/removal, date entry, normal/reduced motion, nested overlays, keyboard,
axe, viewport resize and emulated touch. Root review also opened the corrected label and intermediate
calendar frame, plus representative light/dark, focus, pressed and fractional-width range images.
Image inspection is evidence for those states, not approval of baseline candidates or full Figma parity.

## Verification record and limits

The final pinned toolchain is Playwright 1.64.1, including an explicit matching development-only
`playwright-core` dependency for axe's peer resolution. npm's dependency graph resolves every
Playwright entry to that version. The digest-pinned Docker image contains matching browsers:
Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2 on Linux. Canonical screenshot runs used Linux
x64; the expanded matrix ran with native Linux arm64 engines on this Apple Silicon host.

The regular, non-update fast run passed **25/25** checks against 22 candidate images. The expanded
matrix passed **103/103**, with no skips, expected failures or retries. Three specification/policy
tests passed, as did all five healthy/fault sensitivity pairs on the final toolchain. Five candidates
changed when moving from Playwright 1.65.1 to 1.64.1; each changed image was actually opened for visual
inspection, then an ordinary comparison run passed. Candidate generation remains distinct from
independent human approval. Native Firefox and WebKit calendar frames in both normal and reduced
motion were also opened and inspected. Detailed local evidence is under `test-results`,
with independent traces/videos/images under `test-results/ui-review`.

Build, lint, consumer type checks and package validation passed. The Autocomplete/Chip Vite consumer
CSS is 84,950 bytes, below the unchanged 85,000-byte budget. An initial 85,032-byte result was corrected by
shortening two private CSS variable names, without changing their values or raising the budget.

The final **`npm run check` completed successfully** after the synchronization fixes below. It includes
formatting, package build, lint, both public type-resolution modes, contract/policy checks, package
validation, Next Turbopack/Webpack, Vite and Storybook production builds, 49 unit tests, 14 HTTP tests
under each Next bundler, 5 release-tooling tests, **474/474 Chromium tests under each bundler**, Webpack
subpath checks and the final restored Turbopack build. There were no test retries or skipped cases.
The verified terminal logs are retained under `test-results/ui-verification/`.

Specification coverage remains scoped to each invocation. For example, the fast report records
Functional Coverage 1/2 and Behavioral Coverage 3/3; the other functional requirement belongs to the
existing production browser suite. Reports do not silently merge separate runs or infer manual/RSC
approval. These fractions describe the registered seed inventory, not implementation completeness.

Diagnostic failures were retained rather than hidden:

- Playwright 1.65.x Firefox crashed during axe with the upstream
  [ARIA reflection defect](https://github.com/microsoft/playwright/issues/44135). It reproduced on
  native arm64 as well as emulated x64. Isolating axe did not reliably avoid it. Pinning the matching
  stable 1.64.1 toolchain resolved it; no accessibility rule or test was disabled.
- The stress decorator initially forced LTR on ordinary stories, caught by the existing Search RTL
  test. It now inherits direction unless the story explicitly requests an override, and only changes
  typography tokens for an explicit font scale. The existing Search RTL test passes.
- A full run exposed an existing Toolbar test race: asserting the already-visible state did not wait
  for the focused scroll event. Moving focus could let native scroll coalescing consume subsequent
  directions. The test now awaits that real event before changing focus and additionally asserts
  retained focus. All hide/reveal/inert/layout assertions remain; Toolbar implementation is unchanged.
  The targeted check passes, and its original failing trace is preserved in
  `test-results/browser-before-scroll-event-sync`.
- A subsequent Webpack run exposed an existing Switch geometry race: computed inset/width had rounded
  to their targets while the native spring still placed the handle at 4.015625px instead of 4px.
  The test now waits for finite native animations to finish and reads both rectangles in one browser
  evaluation. Expected offsets and precision are unchanged, and motion remains enabled. The targeted
  check passes; the original failing trace is preserved in `test-results/browser-before-switch-settle-sync`.
- A later range-input run began filling endpoints before the documented mode-switch focus handoff
  on requestAnimationFrame. Its final snapshot showed the end-date text in the start field, while the
  end field retained its previous value. The test now asserts start-field focus after each mode change,
  verifies both entered values and explicitly checks acceptance is enabled. Existing validation,
  cancellation and accepted-range assertions remain. The failing trace is retained in
  `test-results/browser-before-range-focus-sync`.

| Remaining verification                           | Status     | Evidence / limitation                                             |
| ------------------------------------------------ | ---------- | ----------------------------------------------------------------- |
| Native extended browser matrix                   | PASS       | 103/103 checks, three engines, both motion preferences and touch  |
| Full existing npm run check                      | PASS       | Completed successfully; 474/474 Chromium cases under each bundler |
| GitHub-hosted workflow execution                 | UNVERIFIED | Workflows configured locally; no remote run triggered             |
| Human baseline approval                          | UNVERIFIED | Initial candidates require independent human image/diff review    |
| Physical touch devices / keyboards               | UNVERIFIED | Chromium touch emulation is distinct from hardware testing        |
| Figma parity / exhaustive assistive technologies | UNVERIFIED | Out of this task's verified scope                                 |

Use the [checklist/report template](ui-quality-report.template.md) for future component changes.
Register significant requirements first, run the appropriate fast checks, inspect images, obtain
independent review, fix findings and request independent re-verification. Keep missing evidence
UNVERIFIED and keep baseline acceptance separate from screenshot equality.
