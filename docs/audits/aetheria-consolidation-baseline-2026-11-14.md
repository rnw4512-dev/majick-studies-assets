# Aetheria consolidation baseline — 2026-11-14

> Status: **initial repository reconciliation only**. This document does not certify source cleanup, runtime tests, builds, production equivalence or commercial launch. No production code, saves, assets, branches, PRs or deployment workflows are changed in this phase.

## Fresh GitHub inventory
- Repository: `rnw4512-dev/majick-studies-assets`, default branch `main`, public.
- Branch search paginated to exhaustion (four pages): **294 branches**.
- Open pull-request search: **45 PRs**.
- Branches are not shipped to users merely because they exist; assess *deployed script graph* before claiming performance gains from branch cleanup.

## Audited PR branches against `main`
| PR | Topic | Ahead | Behind | Diverged? | Initial decision |
|---|---|---:|---:|---|---|
| [#260](https://github.com/rnw4512-dev/majick-studies-assets/pull/260) | Safe cleanup, save safety, probability and UI | 6 | 112 | yes | RECONCILE individual fixes against current main, preserve its tests and reports |
| [#243](https://github.com/rnw4512-dev/majick-studies-assets/pull/243) | Six legacy script migrations | 7 | 126 | yes | RECONCILE owner contracts and tests, do not copy outdated index/runtime files |
| [#270](https://github.com/rnw4512-dev/majick-studies-assets/pull/270) | D756 multi-scenario Council Chamber | 29 | 90 | yes | RECONCILE with current meeting engine before integration |
| [#266](https://github.com/rnw4512-dev/majick-studies-assets/pull/266) | Pixi four-frame Guardian controller | 19 | 92 | yes | RECONCILE against current single-ticker renderer and verify approved art |

These are snapshots from connector comparisons; rerun before any merge.

## Specific overlap confirmed: PR #261
The current `main/current-site/sanctuary-audit.js` **already queries both** `#phase4SanctuaryFrame` and `.v3317SanctuaryFrame` through a shared `frames()` helper. Its current implementation additionally renders a Scholar card, detects duplicate IDs and asks for confirmation before reloading. PR #261's branch has the two-selector fix but lacks these newer behaviors.

**Disposition:** PR #261 appears **SUPERSEDED for its stated selector fix**. Do **not** merge the older file wholesale. Test the main-branch handshake and roster logic in a real browser before closing PR #261; do not mistake source inspection for runtime verification.

## Existing engineering evidence to preserve
- PR #260's `docs/audits/aetheria-cleanup-summary.md` says its cleanup was **not merged or deployed**, and stable certification was blocked. It documents save-schema safety, probability navigation, mobile controls and test evidence.
- PR #243's `RUNTIME_OWNER_MIGRATION_REPORT_2026-11-01.md` describes a verified *branch-local* migration of six scripts; no merge or deployment was claimed. Preserve its migration tests and save fixtures when reconciling.
- Current `.github/workflows/deploy-majick-pages.yml` identifies `publish-aetheria.yml` as the routine `main` publisher. The inspected legacy workflow is manually dispatched; do not conflate them or trigger publishing as part of cleanup.
- PR #231 is explicitly WIP; reward integration and duplicate-protection testing remain needed.

## Canonical ownership candidates (verification pending)
| Responsibility | Candidate owner(s) / evidence | Next verification |
|---|---|---|
| Navigation and routing | `app-runtime.js` per PR #243 | inspect live import/script order and navigation event writers |
| Grimoire | `grimoire.js`, `grimoire.css` per PR #243 | assess current main and saved legacy data compatibility |
| Adaptive question selection | `question-scheduler.js` per PR #243 | compare output against existing scheduler behavior |
| Guardian presentation | `guardian-presentation.js` per PR #243 | inspect saved identities and approved art paths |
| Sanctuary audit | `sanctuary-audit.js` on main | browser-ready/roster handshake at 390/820/1366 |
| Pixi Guardian walking | PR #266 controller candidate | verify single ticker, disposal, fallback, manifest |
| Reward ledger | unresolved / PR #231 WIP | trace all XP emitters and idempotency |
| Learning Observatory | PR #263 candidate | verify no invented historical learning data |
| D756 meeting | existing main implementation + PR #270 | preserve independent/guide/challenge distinctions |

These are candidates, *not* certified authoritative owners.

## Execution queue and acceptance gates

### P0 — Data safety and live baseline
1. Capture exact `main` SHA, deployed `release.json` build and publisher workflow run; prove correspondence.
2. Export synthetic legacy/newer-schema save fixtures and test read/write/rollback without touching real user data.
3. Reconcile PR #260's **smallest independently testable** save-schema repair first; rerun source, Node and browser checks, including 390/820/1366.
4. Document failures; no deployment until stable release gates pass.

### P1 — Canonical runtime ownership and branches
5. Compare *current main* script and manifest graph against each of PR #243's six retired wrappers. Reuse its differential scheduler and Sanctuary fallback tests.
6. Migrate only needed behavior into existing owners; remove wrappers only after references, dynamic loaders, rollback, tests and save compatibility pass.
7. Compare the remaining 44 open PRs and all 294 branch tips for unique commits. Classify MERGE, RECONCILE, SUPERSEDED, INCOMPLETE, HISTORICAL, DELETION CANDIDATE, or INVESTIGATE; record evidence, never delete automatically.
8. Verify PR #261's specific fix in a browser; then propose superseding/closing rather than merge-overwriting newer code.

### P1/P2 — Complete the educational experience
9. Reconcile #270 and #245 without a second D756 meeting engine; verify fully spoken clickable responses, IEP facts, five input and three clarifying questions, timed rehearsal, guided/independent/challenge, saved replay.
10. Reconcile #266 Guardian controller against currently approved four-frame manifests; maintain the existing asset fallback and single-ticker architecture.
11. Validate #263 Observatory's distinction between game engagement and independent mastery.
12. Complete or supersede #231 reward journal only with repeat-event/idempotency tests and intact balances.

### P2/P3 — Performance and market readiness
13. Measure loaded scripts, JS payload, Pixi texture usage, listeners, render work, CPU and memory before pruning anything.
14. Remove demonstrated dead code only after runtime and dynamic-manifest reference checks.
15. Test room navigation, accessibility, responsiveness, licensing, onboarding and course isolation. Publish a room acceptance matrix and before/after metrics.
16. Open focused implementation PRs; do not bulk-merge divergent branches, bypass CI, delete history or deploy unverified fixes.

## Definition of done for **this** initial branch
- Verified inventory and specific conflict findings are recorded.
- Clear first implementation candidates and test gates are documented.
- Production remains untouched.
- **Not done:** full branch-tip analysis, remediation, verified performance gains, browser certification, merging, production release.

## Next implementation PR
**PR #260 save-schema preservation on current main**, with its relevant regression fixture and no unrelated UI changes. Do not assume the fix is missing until comparing current main implementation and tests. If already present, mark it superseded and select the next verified P0 gap.
