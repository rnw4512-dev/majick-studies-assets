# Majick Studies — Project Board
Updated: 2026-10-21
Canonical application: `current-site/` · Version: 3.4.2
Source of truth: this board is proposed on a development branch and is **not** on `main` until merged.

## Canonical Source of Truth
- Repository: `rnw4512-dev/majick-studies-assets`; production via existing GitHub Pages workflow.
- Preserve one owner per feature, original Guardian artwork, independent mastery boundaries, and source-manifest integrity.

## Done
- 2026-10-21: Inspected `main` probability progression and located reasoning advancement in `learning-continuity.js` and the UI handoff in `probability-workshop.js`.
- On this branch: added explicit transfer continuation after the second correct independent reasoning response; forced a new render after fresh advancement; provided an exhausted-dataset explanation without clearing earned evidence.
- Static source assertions passed during the edit; **no browser certification or full regression suite has passed yet**.

## In Progress
- Probability reasoning → fresh question → independent transfer end-to-end regression.
- Reconcile active PRs, including historical #135, #141, #142, #143 and #144; statuses require fresh GitHub confirmation.

## Broken
- Previous desktop probability advancement failure reported in PR #144; current branch patch requires real-browser verification.
- PR #145 first browser run: 390px Commons keyboard focus FAILED; 1366px Sanctuary Commons button contrast FAILED (measured ~1.26–1.27:1); 820px browser review PASSED.
- Second run #39596930313: 390px PASS, 820px PASS, 1366px FAIL (ArrowRight keyboard focus). Desktop failure remains open until the next rerun passes.

## Needs Assets
- Previous audit reported 94 Guardian action assets missing (90 for six newer Guardians and four for originals). Re-run strict asset audit; do not assume this historical count is current.

## Needs Code Repair
- Desktop keyboard repair committed on PR #145: bind ArrowRight/ArrowLeft/Home/End handling directly to each Commons tab and remove duplicate parent handler; rerun rendered audits before closing this defect.
- Sanctuary button contrast repair remains subject to clean browser certification.
- Investigate any failures found in browser regression, persistence and course switching. Avoid duplicate learning or progress engines.

## Needs Browser Certification
- Initial run #39594925645: 390px FAIL, 820px PASS, 1366px FAIL; 390px and 820px connected probability browser steps SKIPPED, 1366px probability browser step PASSED.
- Second run #39596930313: 390px PASS, 820px PASS, 1366px FAIL (Commons ArrowRight focus). Require clean three-width rerun after latest keyboard repair, including probability and persistence gates.
- Wrong answer → guided repair → fresh independent reasoning → transfer → teaching.
- Fast pointer and keyboard interactions, typing, clear/retry, scroll/focus stability, reload and course switch.
- Guardian movement/interaction for all ten, Scholar wardrobe/hair continuity, XP and rewards persistence, accessibility and contrast.

## Ready for Deployment
- None. Do not publish until all release gates pass.

## Blocked / Needs Your Review
- **Do not merge PR #145** until PR #141 board reconciliation, strict Guardian certification, progress/XP/Scholar persistence tests, and every release gate pass. This board is not yet on `main`.
- GitHub Actions browser certification, strict assets, manifest integrity and deployment gates remain unverified.

## Session Log
### 2026-10-21 — Probability progression release-gate repair
- Changed: `current-site/probability-workshop.js` (explicit transfer handoff, render invalidation, exhausted-dataset feedback).
- How: reused `MajickLearningContinuity` and existing task/progress ownership; no new engine.
- Tests: initial GitHub Actions run #39594925645 completed with 390px and 1366px rendered Commons failures, 820px pass; desktop connected probability passed, other widths skipped. Fresh rerun pending.
- Additional repairs: Commons keyboard focus guard and Sanctuary Commons button ink opacity/contrast; source manifest updated.
- Remaining: fresh CI and all-width browser evidence; board reconciliation; strict assets and persistence certification.
- Deployment: **blocked; not deployed**.

### 2026-10-21 — Desktop keyboard focus follow-up
- Changed: direct Commons tab keydown listeners, removed duplicate tablist listener; synchronized `collegium-commons.js` source hash.
- Evidence: run #39596930313 390px PASS, 820px PASS, 1366px FAIL ArrowRight focus.
- Tests: new patch not yet browser-certified; full three-width rerun required.
- Deployment: blocked; PR #145 remains draft and unmerged.
