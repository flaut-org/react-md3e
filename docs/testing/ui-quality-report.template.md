# UI QA report

Task / original requirements:
Component purpose and public contract in scope:
Commit or worktree identity (including relevant uncommitted changes):
Reviewer / independent session:

## UI Invariant Discovery — complete before testing

Initial inventory version / saved path / date-time:
First UI check date-time (fill during execution):
Prior exposure to implementation claims, test outcomes, images or traces / independence limitations:

Derive expectations independently before executing checks or analyzing results. Save the initial
inventory; keep observations in the later sections. Consult all six bases below. For each reference,
record exact URL/file/node/section, revision/date/platform, actual access and applicable adaptation.
Distinguish explicit requirements, derived UI invariants (with user-impact rationale) and open
hypotheses. Existing implementation, snapshots and passing tests do not establish correctness.

| Discovery basis                 | Sources actually consulted / derived expectations / gaps or conflicts |
| ------------------------------- | --------------------------------------------------------------------- |
| Official specification          |                                                                       |
| Component purpose               |                                                                       |
| Public contract                 |                                                                       |
| Spatial relationships           |                                                                       |
| Expected user interactions      |                                                                       |
| General UI quality requirements |                                                                       |

Anatomy / state ownership / transitions / input map:
Core user tasks, meaningful states and boundary conditions protected by the proposed invariants:
Legitimate counterexamples considered (supported variation the invariants must permit):

Assess every category; give a component-specific rationale for NOT APPLICABLE. This table records
discovery coverage, not test success. It must link actual invariants rather than repeat generic prompts.

| Invariant category | Applicable invariant IDs / NOT APPLICABLE rationale / unresolved discovery gaps |
| ------------------ | ------------------------------------------------------------------------------- |
| geometry           |                                                                                 |
| layout             |                                                                                 |
| motion             |                                                                                 |
| visual             |                                                                                 |
| state              |                                                                                 |
| interaction        |                                                                                 |
| integration        |                                                                                 |

Repeat this entry for every invariant. Use stable local IDs and link registry requirement IDs where
they actually match. Hypotheses with unresolved criteria cannot establish PASS or a confirmed defect.

- **ID / primary category / related categories / requirement IDs:**
- **Scenario, preconditions, affected elements and scope:** variants, states, content, viewport,
  theme/direction, input and lifecycle phase as applicable.
- **Expected constraint or outcome:** measurable range/relationship, visual criterion or event/state
  sequence; include reference geometry and predeclared tolerance with rationale/measurement limits.
- **Allowed exceptions and conditions / source or rationale:** write "none identified" if applicable.
- **Requirement source / explicit, derived or hypothesis / user consequence protected:**
- **Verification method / planned cases / required evidence / decision and adequacy criteria:**
- **Applicable component checklist rows:**

Planned scenario/environment matrix (including at least two boundary/exploratory cases):
Open criteria/source conflicts and checks that can proceed independently:
Pre-test spatial contracts per transition, if applicable: allowed envelope/overshoot, reference
viewport or parent, anchor edge, permitted gap/overlap and coupled movement (link invariant IDs):

Inventory amendments (append; preserve the dated initial version):

| Revision / date-time | Affected IDs | Before testing or discovered after observation / trigger | New source or rationale / correction or exception | Preserved prior failure / affected checks to rerun |
| -------------------- | ------------ | -------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------- |

## Execution and invariant results

Inventory version used for this run:
Browser versions / OS / viewport / themes / input emulation:
Commands executed and outcomes (retain failures, including invalid-oracle or recorder failures):
Images actually opened with vision tooling:
Source access or environment changes since discovery:

Use PASS, FAIL, NOT APPLICABLE with rationale, or UNVERIFIED. Compare the observed behavior with the
specified invariant; do not treat green assertions as sufficient evidence for uncovered behavior.

| Invariant ID / inventory version | Status | Expected vs observed / tested scope | Method / command / artifact / images viewed | Adequacy limits / related anomaly IDs |
| -------------------------------- | ------ | ----------------------------------- | ------------------------------------------- | ------------------------------------- |

Spatial evidence, if applicable: violating frame/time/max excursion, sampled violation interval,
rAF max gap, paired sample coverage, truncation, native frames/video viewed; no sub-frame certainty:

## Anomalies and investigation beyond assertions

Record unexplained deviations even when existing assertions pass. If none were observed, state the
observations/evidence actually examined. For each anomaly, record the following:

- **Anomaly ID / affected invariant IDs or discovery gap:**
- **Observation / conditions / potential user impact / raw artifact paths:**
- **Existing assertion outcome and what those assertions do not cover:**
- **Competing explanations:** intended behavior, implementation defect, wrong oracle, fixture or
  measurement artifact; identify the uncertainty that prevents a decision.
- **Additional investigation actually performed / discriminating controls / results / limits:**
- **Disposition and supporting source/evidence:** intended behavior, confirmed defect or unconfirmed
  anomaly. A demonstrated test/recorder artifact may be closed as such, with the affected check rerun;
  that alone does not establish component correctness. A known invariant violation remains a defect
  even when its root cause is unknown. A one-off observation is not silently discarded.
- **Affected claim status / next check if unresolved / fix and independent re-verification if needed:**

Unconfirmed anomalies leave affected claims UNVERIFIED; confirmed violations remain FAIL. Intended
behavior needs applicable source/rationale and evidence, not just an existing baseline or token.
Do not suppress a failed assertion when correcting an invalid oracle: preserve the original criteria,
failure, justified amendment and rerun outcome.

## Component checklist

Map invariant IDs and anomaly dispositions to each row. PASS requires adequate current evidence for
the applicable scope; unresolved relevant invariants/anomalies prevent PASS. Confirmed violations
make the affected row FAIL even if other checks remain UNVERIFIED. NOT APPLICABLE needs a rationale.

| Category               | Status     | Invariant/anomaly IDs / evidence / rationale / limitation |
| ---------------------- | ---------- | --------------------------------------------------------- |
| Functional correctness | UNVERIFIED |                                                           |
| Behavioral correctness | UNVERIFIED |                                                           |
| Visual correctness     | UNVERIFIED |                                                           |
| Motion correctness     | UNVERIFIED |                                                           |
| Layout stability       | UNVERIFIED |                                                           |
| Accessibility          | UNVERIFIED |                                                           |
| Keyboard interaction   | UNVERIFIED |                                                           |
| Touch interaction      | UNVERIFIED |                                                           |
| Responsive behavior    | UNVERIFIED |                                                           |
| Integration            | UNVERIFIED |                                                           |
| Theme compatibility    | UNVERIFIED |                                                           |
| RTL                    | UNVERIFIED |                                                           |
| SSR and hydration      | UNVERIFIED |                                                           |
| RSC compatibility      | UNVERIFIED |                                                           |
| Browser compatibility  | UNVERIFIED |                                                           |

## Findings and handoff

For each confirmed defect: severity, invariant/requirement ID, reproduction or captured transient,
expected behavior, actual behavior, user impact, artifact paths, fix identity and independent
re-verification outcome against the retained contract. Keep unconfirmed anomalies separately labeled.

Oracle/discovery gaps found in existing tests and follow-up regression requirements:
Baseline candidates and human image/diff review: UNVERIFIED.
Signoff route (independent Approve or PR-author maintainer confirmation), human identity, review URL
and matching head commit; maintainer confirmation must be labeled as such:
Remaining unverified requirements, unresolved anomalies and release/merge implications:
