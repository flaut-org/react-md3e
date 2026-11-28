# UI quality assurance

This workflow extends the existing Playwright, built Storybook and production Next.js fixtures.
It does not replace behavioral, accessibility, RSC, HTTP, package or bundler checks. Start with the
original task requirements and the affected component's design document. The first automated visual
inventory covers DatePicker, DateRangePicker and Button; it is not coverage of the entire catalog.

## UI Invariant Discovery (mandatory before testing)

For **every component audit**, first define what correct behavior means, then observe the component.
The QA agent must independently create and save a component-specific invariant inventory before
executing automated or exploratory UI checks and before examining implementer conclusions, test
outcomes, screenshots or traces. Use the discovery section of [the report template](ui-quality-report.template.md)
under `test-results/ui-review/<review>/`. Record the date/time, reviewer, worktree identity and scope.
If results were already disclosed, record that exposure and derive expectations from independent
sources; do not retrospectively claim blind discovery or pre-test criteria. A new audit or changed
scope requires this step even if regression tests already exist. For a fix re-verification, retain
the original inventory and record any scope/source amendments before rerunning affected checks.

An invariant is a falsifiable requirement that holds under stated preconditions: a relationship,
permitted range, visual property, state rule or input/output sequence. It may be conditional and may
allow intended movement or variation. "Looks correct", "matches the current screenshot", "uses the
right token" and "existing tests pass" are not sufficient oracles. This stage addresses the **Test
Oracle Problem**: collecting accurate observations does not establish how to judge them.

### Derive expectations independently

Consult and record all six bases. Neither the existing test list nor the known reported defect limits
discovery. Implementation internals may explain behavior later; they cannot by themselves justify it.

| Basis                      | Questions and source evidence                                                                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Official specification     | Which anatomy, variants, states, dimensions and behavior apply? Record exact URL/node, revision/date, accessible content and platform. Identify web adaptations and inaccessible references; do not imply Figma access.                                    |
| Component purpose          | What task must remain possible, what information must stay understandable, and what failure would obstruct that purpose? Explain derived expectations.                                                                                                     |
| Public contract            | Which props, defaults, native semantics, values, events and controlled/uncontrolled guarantees are promised by public docs/types and the original task? Distinguish a promise from a description of current internals.                                     |
| Spatial relationships      | Which elements align, contain, cover, avoid or move with each other? Identify viewport/parent references, clipping, layering and hit regions in resting and changing states.                                                                               |
| Expected user interactions | What should keyboard, pointer, touch, cancellation, repetition and interruption do to focus, state, events and other surfaces? Include unavailable/disabled states where applicable.                                                                       |
| General UI quality         | Which readability, accessibility, perceivability, responsive layout, operability and consistency requirements apply? Cite a relevant standard when available or label and explain a derived usability expectation. Avoid unsupported universal thresholds. |

Build a small anatomy/state/input map from these sources: name the parts, state owner, supported
transitions and surrounding components. Walk through successful use, cancellation, unavailable/error
states and boundary conditions. For each step ask what must hold, what may change and what must stay
related. Vary content, available space, theme, direction and input to discover relationships beyond
one happy-path screenshot. Before accepting an invariant, challenge it with a legitimate counterexample:
would it incorrectly prohibit supported wrapping, scrolling, state changes or expressive motion?
Refine its preconditions/exceptions from source and purpose, and identify a concrete observation that
would falsify it. If a core user task or meaningful state has no protecting invariant, revisit discovery.

Separate **explicit requirements**, **derived UI invariants** and **open hypotheses** in the source
field. A derived invariant needs a concrete rationale tied to purpose or user impact; it need not be
verbatim in a platform specification. A hypothesis whose expected behavior is still unresolved cannot
establish PASS or a confirmed defect. Record conflicting sources, versions or platform assumptions
and seek a discriminating source/check; continue independent checks while affected claims remain
UNVERIFIED. Follow the original task and repository's documented adaptations when applicable, but
report any conflict with an official conformance claim instead of silently choosing convenient rules.
Existing implementation, snapshots, helper defaults and developer explanations are evidence to examine,
not authority for an exception.

### Classify and make each invariant testable

Consider all seven categories. Give each invariant a primary category and optional cross-category
links. Record a component-specific reason for any inapplicable category. The prompts below generate
questions; they are not universal requirements or substitutes for a component-specific inventory.

| Category      | Relationships and outcomes to consider                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `geometry`    | Element dimensions, edge positions, alignment, containment, spacing, allowed overlap and actual hit bounds within a defined coordinate system.                                             |
| `layout`      | Composition, wrapping/truncation, content growth, zoom/larger text, responsive reflow, scrolling, clipping, reserved space and stability of surrounding content.                           |
| `motion`      | Allowed intermediate trajectories and changing relationships, continuity, completion, retargeting/interruption and reduced motion; intentional overshoot may be allowed.                   |
| `visual`      | Typography, readable content, color/contrast, shape, elevation, state layers, focus visibility and visual distinction of meaningful states across themes.                                  |
| `state`       | Valid states and transitions, selection/value ownership, disabled/readOnly/loading/error behavior, cancellation, persistence, reset and correspondence between rendered and exposed state. |
| `interaction` | Input actions, event count/order, native semantics, keyboard paths, focus movement, dismissal, hit testing and prevention of unintended activation.                                        |
| `integration` | Nested components, portals, constrained/scrolling/transformed ancestors, forms, theme scope, RTL/localization, browser behavior, SSR/hydration and server/client boundaries.               |

For **each invariant**, write these fields before the run:

- Stable local ID, category, affected elements, scenario/preconditions and applicable variants/states.
  Link an existing requirement ID where it actually matches; use a new local ID for newly discovered
  requirements rather than forcing them into the seed inventory.
- Expected constraint or observable outcome, including reference geometry, lifecycle phase or
  event/state sequence. Specify applicable theme, direction, viewport/content and input conditions.
  Explain any numeric tolerance and measurement uncertainty in advance; do not derive allowed bounds
  from current output or accept a generic helper tolerance without checking its suitability.
- Allowed exceptions and their conditions with supporting source/rationale. Write "none identified"
  when appropriate. An exception is not permission to discard inconvenient samples.
- Requirement source, exact location/revision/access and explicit/derived/hypothesis designation.
  For inferred UI quality, state the user consequence the invariant protects.
- Verification method, scenario matrix, required evidence and decision criteria. Include how to detect
  a violation and what makes evidence inadequate. Use actual images/input/geometry/events appropriate
  to the claim; separate endpoint checks from intermediate or transient behavior.

For example, [TextField's public contract](../components/text-field.md) supports investigating whether
a resting label avoids trailing controls in narrow RTL/larger-text layouts: truncation is allowed
where documented, while the accessible name and controls must remain usable. Check actual text/control
geometry, viewed images, names and real activation rather than only the field's outer width. Separately,
[Button's controlled selection contract](../components/button.md) yields a state invariant: activation
alone cannot change the controlled `selected` value when the consumer keeps the prop unchanged;
`aria-pressed` and the visible state must correspond to that prop. Test with a non-updating consumer,
real input and event/state evidence. These examples illustrate derivation, not a complete component audit.

Save the initial inventory as a dated version before the first UI check. Assess all seven categories,
plan at least two boundary/exploratory cases and make unresolved expectations visible. Discovery is
complete enough to begin testing when applicable expectations have decision criteria and a method,
and gaps are explicitly recorded; missing evidence must not block unrelated checks. Do not require
user approval for ordinary derivation or routine checks.

Preserve the initial version. If exploration reveals a missing invariant or an invalid assumption,
append a revision with discovery time, trigger, new source/rationale, affected IDs and checks to rerun.
Mark it as **discovered after observation**. Independently validate the expectation before judging
the observation. Do not silently relax thresholds, add post-hoc exceptions or rewrite the original
plan to make observed behavior pass. A justified oracle correction must preserve the original failure
and explain why its expectation was wrong; rerun affected scenarios against the corrected criteria.

### Investigate anomalies beyond assertions

During every audit, actively inspect observations that assertions do not cover: unexpected geometry,
clipping, visual discontinuities, unreadable text, state/event inconsistencies, focus changes, console
messages and interference with neighboring components. A green suite does not resolve an unexplained
observation. Register it with a local anomaly ID, affected invariant IDs or a discovery gap, conditions,
raw evidence and potential user impact. If none were observed, state what evidence was actually examined.

1. Reproduce and isolate the deviation using the original conditions; retain transient/one-off evidence
   even if a repeat does not reproduce it. Compare relevant states, variants or environments and verify
   that the fixture and recorder represent the claimed scenario.
2. Revisit the applicable source and predeclared exception. List competing explanations, including
   intended behavior, implementation defect, wrong oracle and test/measurement artifact. Do not assume
   any explanation from a token name, baseline match or assertion outcome.
3. Perform a targeted check that can distinguish those explanations: for example paired hit testing,
   event/focus tracing, a minimal consumer or a real-clock/native-frame control. Record actual outcomes,
   adequacy limits and what remains unknown. No unexecuted proposed check counts as verification.
4. Classify the observation below and link its evidence. If unresolved, record the next discriminating
   check and the affected signoff limit instead of silently accepting or reporting it as a proven bug.

| Classification      | Required basis                                                                                                                                                                                                                      | Effect on the affected claim                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intended behavior   | Accessible source or independently justified UI rationale supports this behavior; any applicable exception is limited to evidenced conditions.                                                                                      | May support PASS only for that invariant and tested scope; retain the explanation.                                                                            |
| Confirmed defect    | Adequate evidence demonstrates violation of an explicit or well-founded derived invariant. Identify reproduction or a sufficiently captured transient, expected/actual behavior and user consequence. Root cause need not be known. | FAIL, even if existing assertions pass. Add a regression when feasible and require independent re-verification after the fix.                                 |
| Unconfirmed anomaly | Expected behavior, evidence adequacy, reproducibility or attribution remains unresolved. State which uncertainty matters; an unknown root cause alone does not demote a demonstrated violation.                                     | Affected claims remain UNVERIFIED unless a violation is already confirmed (FAIL). Preserve evidence, impact and follow-up; no clean signoff for those claims. |

These are observation classifications, **not additional checklist statuses**. An assertion failure
still stays visible; it may reveal a defect, an invalid oracle or a measurement failure. A demonstrated
test/recorder artifact can be closed as such with evidence and the affected check rerun; it does not
establish intended component behavior or earn PASS by itself. Missing official wording does not
invalidate a reasoned UI invariant, and an unusual appearance alone does not establish a defect.

## Commands and environments

Use the Node version in `.tool-versions`, `npm ci`, and the lockfile's exact Playwright version.
Roboto is bundled through the existing pinned `@fontsource/roboto`; tests prohibit external requests.

| Command                                                             | Purpose                                                                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run test:ui:container`                                         | Canonical Linux x64 screenshot comparisons and fast behavior checks                      |
| `npm run test:ui:container -- --grep DP-003`                        | One requirement, with all its intermediate assertions                                    |
| `npm run test:ui:container -- date-picker --project=chromium-light` | One component/project                                                                    |
| `npm run test:ui:update -- --grep DP-008`                           | Explicitly generate baseline **candidates**, locally in the canonical container          |
| `npm run test:ui`                                                   | Direct local run after package/Storybook builds; snapshots require the matching platform |
| `npm run test:ui:extended:container`                                | Chromium/Firefox/WebKit, normal/reduced motion and emulated touch                        |
| `npm run test:ui:review -- --grep DP-003`                           | Headed browser, retained trace/video and frame artifacts for interactive review          |
| `npm run check:ui-contract`                                         | Validate requirement references and reject focused/skipped/expected-failure UI tests     |
| `npm exec -- playwright show-report playwright-report/ui`           | Inspect assertions and expected/actual/diff attachments                                  |

`npm run test:ui:mutations:container` additionally proves the five known-defect regressions can reject
isolated browser-only faults. Each fault first requires a passing healthy control; only its named
defect-specific assertion counts as detection. Setup failures, missing baselines and generic timeouts
cannot earn PASS. Reports and actual/expected/diff images are retained under `test-results/ui-mutations`.
Component source, build assets and baseline files are unchanged by fault injection. The mutations
reproduce each mechanism; they do not claim to restore an unavailable historical buggy revision.

The container wrapper builds `scripts/ui-quality/Dockerfile`, uses `linux/amd64`, a digest-pinned
Playwright 1.64.1 Noble image and Node 26.13.1, installs dependencies into a separate Docker volume,
and builds the package and Storybook. It leaves the host's node_modules intact. The workspace is
mounted read/write for generated assets and diagnostics. CI uses the same Playwright image digest,
architecture, pinned Node, fonts and dependency lock. Rebuild/update them together when upgrading.
Host macOS/Windows screenshots are useful evidence but are not interchangeable with Linux baselines.

On Apple Silicon, the extended container command uses native Linux arm64 browser engines from the
same pinned image/version and a separate dependency volume. Screenshot and mutation commands retain
Linux x64 so their pixels match CI. The report records each browser version, Node version, OS and
architecture. Native Linux x64 CI remains separately verifiable.

The toolchain pins stable Playwright 1.64.1 and its matching image because 1.65.x's Firefox has a
[documented ARIA reflection crash](https://github.com/microsoft/playwright/issues/44135), reproduced
here on both native arm64 and emulated x64. Separating scans from keyboard tests did not reliably
avoid that browser crash. No axe rules, ARIA attributes or checks were disabled. Upgrade the pinned
version and matching image together only after verifying the full matrix. DP-017 keeps its static
axe scan separate from DP-007's real keyboard/focus/dismissal interaction.

Direct runs need `npm run build && npm run build:storybook` and
`npm exec -- playwright install chromium`; extended direct runs also need `firefox webkit`.
Playwright serves the static Storybook on 127.0.0.1:6106 and owns/stops that server. For exploratory
work start `npm run storybook` in a persistent terminal (port 6006). Do not run both test suites on
6106 concurrently. New utilities live in `packages/react-md3e/tests/browser/ui-quality`, outside src.
Component scenarios and snapshots remain in each component owner's `tests` directory and are
excluded from the published package.

Tests fix locale to en-US, timezone to UTC, device scale to 1 and wall time to 2024-02-29T12:00Z.
Stories explicitly supply `today`, `referenceDate`, values and locale where needed: fixed Date alone
does not replace Temporal.Now. `page.clock.setFixedTime` preserves real timers, performance.now and
requestAnimationFrame. Stories wait for local fonts and a rendered root, with no network-idle sleeps.
No test retries are configured in the UI suites.

## Baseline review

Ordinary runs use `updateSnapshots: 'none'`: a missing or mismatching image fails. CI rejects snapshot
update modes. Pixel comparisons allow zero differing pixels after a 0.1 per-pixel color threshold;
there is no percentage allowance. Never raise thresholds or add retries to hide a defect.
Static screenshot assertions finish finite animations and hide the caret; **motion tests** keep native
animations running and capture with `animations: 'allow'`. Their evidence is separate.

1. Diagnose actual/expected/diff images before requesting an update.
2. Make the implementation correct and rerun functional/motion/integration checks.
3. Run the explicit update command for the smallest affected component. Inspect every candidate.
4. Submit new/changed/deleted images with the reason, original requirements and supporting evidence.
5. A human reviews the images/diffs and signs off on the current PR head through one of the routes
   below. Neither the implementation agent nor the QA agent may submit baseline signoff.
6. Rerun comparisons without update flags. The equality result establishes regression stability;
   human image/diff review establishes whether the candidate should become an accepted reference.

The `UI baseline approval` workflow requires human signoff for PNG changes under `tests/baselines`
(including deletion/rename). It accepts either:

- **Independent review:** a non-author human collaborator's Approve of the current PR head. A later
  dismissal or request for changes by that reviewer invalidates their approval.
- **Maintainer confirmation on their own PR:** the human PR author with repository write/admin access
  opens **Files changed → Review changes**, enters only `/approve-ui-baselines` in the summary,
  selects **Comment** and clicks **Submit review**, after actually inspecting all changed images/diffs.
  Maintain/custom roles are accepted when GitHub reports their base permission as write. The latest
  submitted author review must contain that exact command and reference the current head commit.

The second route supports a sole maintainer: GitHub prevents authors from approving their own PRs,
but allows Comment reviews. The review's `commit_id` binds either route to the reviewed head, so
every new push requires fresh signoff. No manually copied hash, persistent label or separate repository
setting is needed. To withdraw maintainer confirmation, edit its summary to remove the command or
submit a later author review without it. Pending drafts do not count. Ordinary conversation comments,
bot accounts, outdated reviews and read-only authors cannot provide maintainer confirmation.
The gate's log distinguishes independent review from maintainer confirmation; report the actual route.
Agents must not post the command or an Approve on a human's behalf to make the check pass.

Configure this check and `UI Quality Gate` as required checks. Review submission, editing and dismissal
rerun the signoff check; they do not rerun the browser matrix. The workflow uses only read permissions
and does not change reviews, PRs or baseline files. GitHub can check account/commit/permission data;
it cannot prove that a person actually viewed the images or distinguish an agent using that person's
credentials. Human inspection and the prohibition on agent signoff remain explicit obligations.
The initial baseline set delivered by this work is **pending human approval**, not agent-approved.

Sources: [GitHub review restrictions](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews),
[review actions and commit binding](https://docs.github.com/en/rest/pulls/reviews#create-a-review-for-a-pull-request),
[repository permissions](https://docs.github.com/en/rest/collaborators/collaborators#get-repository-permissions-for-a-user)
and [review workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_review).

## Interactive agent workflow

Use **Implementation → Independent QA (UI Invariant Discovery → Testing → Anomaly investigation →
Report) → Fixes → QA Re-verification** for substantial UI changes. The same discovery, testing and
investigation stages apply to audits without implementation changes and to components without motion.

After saving the discovery inventory, choose relevant stories and specification IDs, then interact
through actual keyboard, pointer and touch events in a real browser. Compare observations with the
declared invariants and investigate additional anomalies. Audit existing tests for missing or invalid
oracles. Review the console, focus handoff, repeated interactions and integration with another component.
Capture important states and intermediate animation frames, not just the final surface.

**Actually open the images with available vision tooling**, for example `view_image` on an absolute
artifact path. Record which images were viewed. Inspect geometry, typography, colors, shapes,
spacing, clipping, focus rings, hover/press state layers and intermediate motion. Compare accessible
official references with the documented web adaptations. Image creation or a passing test alone
does not satisfy this step. Fix findings and repeat the affected checks after rebuilding Storybook.

The official [Playwright Interactive skill](https://github.com/openai/skills/blob/main/skills/.curated/playwright-interactive/SKILL.md)
was inspected on 2026-11-27. It requires a persistent `js_repl` tool and currently documents an
unsandboxed session prerequisite. This environment has shell Playwright and local image viewing,
but no `js_repl`; it uses the existing runner and vision tools as the equivalent workflow. The skill
is not installed automatically, and this repository does not relax sandbox settings. Where `js_repl`
is already available and authorized, reuse its persistent handles for exploratory browser work.
If a session lacks browser or image-viewing tools, record the affected checks as UNVERIFIED.

The project custom agent is [`.codex/agents/ui-qa.toml`](../../.codex/agents/ui-qa.toml), using the
official [standalone custom agent format](https://developers.openai.com/codex/subagents#custom-agents).
Ask Codex to spawn `ui-qa` with the original requirements and worktree identity. The role intentionally
inherits model/effort and permissions; instructions prohibiting source edits do not create a separate
read-only sandbox. Reviewers can write diagnostics under `test-results/ui-review` but cannot modify
component code, tests or baselines. If custom agents/subagents are unavailable, open a separate Codex
session with those same instructions. Give it the original task and source links before the developer's
report. Return its findings to the implementation session, then ask it to verify fixes independently
against the retained invariant inventory and any justified amendments, with exploration beyond the fix.

## Motion and integration utilities

### Motion spatial constraints

As part of UI Invariant Discovery, before reading implementation claims or recording a transition,
define its spatial contract from the component's purpose and accessible specification. Ask: where may
each element be at every stage; is
overshoot allowed; which edge must stay covered; which gaps, overlaps, clipping and relative offsets
are permitted? Record the chosen envelope and reference viewport/parent in the QA report. Endpoints,
spring tokens and a correct transform do not establish that a surface follows a usable physical path.
If the specification is silent, label the constraint as a web-specific UI invariant, with rationale.

`spatial.ts` reuses the actual rectangles in `recordMotion`:

- `range` constrains x/y/right/bottom/width/height to an explicit envelope. This can permit deliberate
  overshoot and undershoot; there is no global monotonicity or zero-overshoot policy.
- `attachment` compares an edge with the viewport or another recorded element. `allowOutside: true`
  permits the outward displacement needed for an entering/exiting sheet while rejecting detachment
  into the content. Pair it with a `range` to bound the allowed outward travel too.
- `containment` requires a rectangle to stay within its recorded viewport/parent boundary.
- `gap` measures the signed separation from target end to other start on x/y. Positive values are
  gaps, negative values overlaps; min/max declare whether either is allowed.
- `relative` bounds the difference between two geometry metrics, protecting coupled movement.

For a left edge sheet, for example, define attachment to viewport left with outward travel allowed,
plus x in `[-sheetWidth, 0]`. For right entry use right attachment and x in
`[viewportWidth - sheetWidth, viewportWidth]`. An elastic inline indicator can instead declare an
envelope beyond its endpoints. Container and child motion must use paired samples from the same frame.
These are contract examples, not default constraints for every overlay.

Arm the existing recorder before real input, stop it after the transition, then call
`expectSpatialConstraints(recording, rules, options)`. `analyzeSpatialConstraints` returns every sampled
violation with rule ID, timestamp, signed value and excess, plus coverage and maximum rAF gap.
The assertion rejects truncated records, missing paired geometry, nonmonotonic timestamps and inadequate
sampling. Defaults are 0.5 CSS px numerical tolerance, two paired samples per rule and a 100ms maximum
rAF gap; set component-appropriate stricter contracts before the run, never relax them after a failure.
Two samples alone do not prove normal-motion interpolation: separately require native animation and
intermediate coverage appropriate to its duration. Reduced motion repeats the spatial/input contract
without inventing an interpolation requirement.
An apparently adequate rAF cadence is not sufficient either: clock fixtures can report small callback
gaps while the native animation/paint timeline skips intermediate poses. If timing and visible motion
disagree, retain the failure, inspect native frames/video and compare a real-clock control before
attributing the problem to the component or its spring tokens.

Recorder frames include the viewport and element/ancestor scroll offsets so reviewers can compare
actual movement with transform and identify autofocus/scroll compensation. Rectangles do not fully
describe rounded masks, shadows or partial occlusion: use hit testing and actually inspect native
frames/video as well. Capture the peak excursion, its observed timestamps and the duration between
violating samples; rAF sampling does not establish exact continuous duration or absence of sub-frame
violations. Large gaps mean motion evidence is inadequate, not that geometry was necessarily frozen;
inspect retained video and report limits explicitly. Screenshot equality and zero CLS are not substitutes.

Every discovered motion defect needs a failing pre-fix regression followed by the same passing contract
after correction. Cover both directions, applicable schemes, normal/reduced, representative dimensions,
entry/exit and interruption/repeat. Independent QA must derive additional relationships beyond the known
regression and actually view intermediate frames. Keep baseline review separate and never auto-approve it.

`recordMotion(page, selectors)` arms recording **before** the action. It samples bounding rectangles,
opacity, visibility, transform, running animations, activeElement, viewport/ancestor clipping and
scrollbar conditions every requestAnimationFrame. ResizeObserver records size changes; focusin/out
records even brief focus transfers. PerformanceObserver records layout shifts where supported and
explicitly reports support. It keeps input-associated shifts instead of automatically dismissing them.
Call `stop(testInfo)` to attach JSON; assert that recording was not truncated. Selectors can match
elements mounted during recording. `captureFrames` attaches animation-enabled screenshot sequences;
these are diagnostic samples, not a claim to capture every video frame. Headed review retains video.

Assertions belong to each component's contract. A popup entering or a slider moving is expected;
an inline calendar doubling its height during a view switch is not. Check intermediate trajectories,
not a universal rule of zero movement or a generic CLS threshold. Transformed ancestors, rounded
clipping paths and partial occlusion can require additional targeted probes and image review.
Synchronize scripted input with the expected focus handoff. An assertion of an already-present state
does not prove a pending scroll or focus event was processed. Measure final precision geometry after
finite native animations finish; keep intermediate-motion assertions separate and enabled.
`expectUsableOverlay` combines viewport geometry, visible/enabled controls and browser hit testing;
tests then perform an actual content interaction. DOM presence alone does not prove usability.

The opt-in `withUiStress` Storybook decorator accepts `parameters.uiQuality` or URL globals:
`qaLayout` (normal/narrow/short/scroll/hidden), `qaEdge` (all four corners), `qaDirection` and
`qaFontScale`. `QA/DatePicker` adds localized labels, fixed dates, nested Dialog/Popover and dynamic
content. These are reusable consumer fixtures, not new library runtime behavior. Combine them with
`page.setViewportSize` while an overlay is open, repeated opening/closing and real keyboard/touch
input. Enlarged typography is a separate check from viewport size and device scale.

`interruptOpenClose` waits for actual native entry motion to begin, asserts that it is still running
and interrupts it through real pointer input. Dismissal may intentionally be instant; the helper
does not invent an exit-animation requirement. Reduced motion repeats the same interactions without
requiring an animation. Tests never alter CSS to extend, pause or disable this motion.

## Component checklist

Use exactly **PASS**, **FAIL**, **NOT APPLICABLE**, or **UNVERIFIED**. PASS requires current evidence;
NOT APPLICABLE requires a component-specific rationale. Missing tools/time/platform evidence means
UNVERIFIED. Record the project, command, artifact and any limitation for each row.

| Category               | Evidence to obtain                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Functional correctness | Values, validation, events, controlled/uncontrolled state and forms                   |
| Behavioral correctness | Focus handoff, interruption, cancellation and repeated interaction                    |
| Visual correctness     | Actually viewed state images, reviewed baseline differences and accessible references |
| Motion correctness     | Intermediate normal/reduced-motion frames and expected trajectory                     |
| Layout stability       | Per-frame dimensions, expected movement, clipping, overflow and scrollbar checks      |
| Accessibility          | Semantics, accessible names, automated axe plus applicable manual checks              |
| Keyboard interaction   | Tab, arrows, selection, dismissal, focus containment/restoration                      |
| Touch interaction      | Emulated touch actions; explicitly distinguish physical devices/keyboards             |
| Responsive behavior    | Compact/large/short viewport, orientation and resizing with open overlays             |
| Integration            | Constrained/scrolling/hidden parent and nested Dialog/Popover                         |
| Theme compatibility    | Light/dark and applicable brand/motion schemes                                        |
| RTL                    | Directional navigation, logical alignment and localized content                       |
| SSR and hydration      | Production Next fixture, server HTML and hydration console                            |
| RSC compatibility      | Preserved server/client module graph, streaming and package validation                |
| Browser compatibility  | Name/version of every actually tested browser/OS; emulation is not real iOS           |

Copy [the report template](ui-quality-report.template.md) into review artifacts before testing any
component. Retain the pre-test inventory, per-invariant results and anomaly investigation/dispositions.
Findings need severity, invariant/requirement ID, reproduction, expected/actual behavior and evidence.
Map invariants to applicable checklist rows; the seven discovery categories and this cross-cutting
checklist serve different purposes. A row cannot be PASS while an applicable invariant is unverified
or a relevant anomaly is unresolved. A confirmed violation makes its affected row FAIL; retain any
additional verification gaps. Do not assign a blanket PASS from one screenshot or test command.

## Specification traceability

[`ui-requirements.json`](ui-requirements.json) is a seed inventory with unique IDs, descriptions,
official URLs or explicit web contracts, categories, verification methods and exact file/title links.
Inventory statuses stay UNVERIFIED. The Playwright reporter derives current statuses from actual
results and emits JSON/Markdown reports with the invocation's project scope. Filtered-out, skipped,
interrupted and never-run tests cannot provide PASS; any observed failure survives later retries.
Manual review and external HTTP/RSC checks remain UNVERIFIED in that report until evidenced in a
separate review report. Add requirements before implementing a component's substantial changes.

The discovery inventory is broader than this seed registry and must not be limited to registered
assertions. Link stable applicable invariants to registry IDs where available; the implementation
session promotes new reusable requirements/regressions into the registry. The QA agent records local
IDs without editing tests or the registry. Preserve the registry's existing categories and reporter
semantics; discovery categories do not change automated coverage calculations. `check:ui-contract`
checks links and test policy, not whether an oracle is valid or discovery preceded testing. A passing
automated report does not replace discovery, anomaly investigation or independent UI signoff.

Linked tests use literal titles. The validator checks test-registration strings, not an ID appearing
elsewhere in a source file. Every collected project/test instance starts UNVERIFIED, so an unstarted
project cannot inherit another project's PASS. Baseline-generation runs cannot provide visual-comparison
PASS. Skipped UI checks also fail the reporter's quality policy.

**Functional Coverage** = PASS applicable functional requirements / all registered applicable functional
requirements. **Behavioral Coverage** uses the analogous behavioral set. UNVERIFIED and FAIL remain in
the denominator; justified NOT APPLICABLE items are excluded. These percentages describe the explicit
inventory and invocation scope, not implementation completeness, code coverage, visual fidelity or
the full Material catalog. A filtered component run will naturally leave other requirements UNVERIFIED.
No precise Figma-conformance percentage is computed or claimed.

## Web-specific design contracts

- DP-001: native textbox sections are a web entry contract documented in [Date pickers](../components/date-pickers.md),
  not a claim that Android mandates this DOM or field behavior.
- DP-002: activating the calendar icon on an empty field must not focus the textbox even briefly;
  the resting label must retain its geometry throughout opening.
- DP-003: Calendar's view transition uses an absolutely positioned inert outgoing frame; the calendar
  height remains stable while year selection changes to a six-row day grid.
- DP-004/006: docked overlays escape constrained/hidden ancestors, fit viewport gutters and preserve
  clickable days. When the viewport cannot fit a calendar, the documented modal input fallback applies.
- DP-005: range-preview top/bottom dashes continue uniformly across intermediate cells at fractional
  widths. The existing pixel-run test and new strict preview snapshots protect the documented adaptation.
- DP-009/010: localization, larger text, RTL and nested portals must preserve meaningful interactive
  controls. Intentional parent scrolling is permitted; clipping the active popup is not.

The readable [official Android date-picker guidance](https://developer.android.com/develop/ui/compose/components/datepickers)
provides anatomy and mode references. Existing design documents retain exact AndroidX revisions and
adaptations. Material's JavaScript-only pages or unavailable Figma nodes must be reported honestly;
this infrastructure does not require Figma access or establish full Figma parity.

## CI and verification limits

The existing CI builds package/Storybook once and shares them with the fast UI job. `UI Quality Gate`
is a stable required-check candidate; existing architecture, RSC, publishing and bundler jobs remain.
Extended cross-browser/reduced-motion/touch checks run on their own manual/scheduled workflow.
Reports, traces, videos, screenshots, visual diffs, motion JSON and specification coverage are uploaded
even after failures. Baseline images live in git; initial candidates require human image/diff review
and current-head signoff through one of the documented routes.

`npm run check` retains its existing browser/bundler scope and adds only the inexpensive contract
validation. Use the separate UI commands for snapshot/extended work. CI execution, physical touch
devices, assistive technologies, Figma parity and unexecuted browsers must remain UNVERIFIED until
actual evidence is available. See the dated implementation verification report for this change.
