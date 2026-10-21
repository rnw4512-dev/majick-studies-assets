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

## Needs Assets
- Previous audit reported 94 Guardian action assets missing (90 for six newer Guardians and four for originals). Re-run strict asset audit; do not assume this historical count is current.

## Needs Code Repair
- Investigate any failures found in browser regression, persistence and course switching. Avoid duplicate learning or progress engines.

## Needs Browser Certification
- 390px mobile, 820px tablet and 1366px desktop.
- Wrong answer → guided repair → fresh independent reasoning → transfer → teaching.
- Fast pointer and keyboard interactions, typing, clear/retry, scroll/focus stability, reload and course switch.
- Guardian movement/interaction for all ten, Scholar wardrobe/hair continuity, XP and rewards persistence, accessibility and contrast.

## Ready for Deployment
- None. Do not publish until all release gates pass.

## Blocked / Needs Your Review
- This branch's board is not yet on `main`; existing PR #141 board must be reconciled before merge to avoid overwriting richer project history.
- GitHub Actions browser certification, strict assets, manifest integrity and deployment gates remain unverified.

## Session Log
### 2026-10-21 — Probability progression release-gate repair
- Changed: `current-site/probability-workshop.js` (explicit transfer handoff, render invalidation, exhausted-dataset feedback).
- How: reused `MajickLearningContinuity` and existing task/progress ownership; no new engine.
- Tests: static assertions during source edit passed; full browser and Actions checks not yet run.
- Remaining: manifest hash synchronization; fresh CI and 390/820/1366 browser evidence; board reconciliation; strict assets and persistence certification.
- Deployment: **blocked; not deployed**.
