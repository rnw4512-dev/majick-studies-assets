# Aetheria confirmed repairs

Baseline `31be7d10f31ebb71b66a2055ef0246d228aac9ce`; branch `maintenance/aetheria-safe-cleanup`.

## 1. Newer-schema save silently replaced by an older backup

Reproduction: seed a schema-2 primary plus a valid schema-1 PREVIOUS/PIN snapshot, then call the actual save owner's read(). Before repair it returned the older snapshot and overwrote primary storage. `evidence/baseline-future-schema-reproduction.log` records the failing regression.

Cause: every validation error was treated as corrupt data and entered recovery. Repair in `current-site/save-safety.js`: distinguish unsupported newer schemas and propagate that error before copying to BAD or restoring an older snapshot. Existing app load protection then blocks normal saves. No schema was changed, no migration was added, and unknown fields remain preserved.

Verification: `pages-release/current/test-save-schema-safety.cjs` passes against the actual module. It checks both recovery keys, byte preservation, corrupt-save recovery and unknown-field export/import. `tests/aetheria-cleanup-browser.py` passes on the built app at 390/820/1366, exercising real Save, Download, Import, Restore and Reload controls plus the actual storage API. These are isolated fixtures, not the learner's browser account.

## 2. Probability stage activation could retain the previous form

Baseline `browser-probability.cjs` failed after guided repair: newly selected reasoning had no saved reasoning whiteboard. The test uses real pointer press/release and intervening mount passes. Cause: navigation waited for a deferred mount and per-node click listeners could be detached by the campus render queue.

Repair in `current-site/probability-workshop.js`: synchronously mount an explicit stage selection and route stage/back activation through the existing document capture owner. Keyboard click remains supported; pointer click is not activated twice. No question grading, bank, evidence requirement or reward rule changed.

Verification: unchanged full probability browser suite passes: pointer navigation, typing/selection preservation, fresh independent questions, whiteboard reload, transfer, teach-back, replay safety, D755/D756 isolation and phone layout. Evidence: `evidence/probability-after.log`.

## 3. Option-specific diagnosis omitted its uncertainty caveat

Baseline shared-repair browser suite failed its existing diagnostic caution assertion. With authored option coaching, only the fallback branch said a selection does not establish the learner's reasoning. Repair in `current-site/question-repair.js`: append the caveat for both branches, retaining the detailed option coaching.

Verification: nine existing source checks and the unchanged shared-repair browser suite pass. Covers actual wrong-answer handlers in Study Now, Learn Lab and Game Realm, cross-room mandatory reconstruction, fresh independent transfer and keyboard details. Evidence: `evidence/shared-repair-after.log`.

## 4. Mobile Progress Safety panel clips text and import control

Visual inspection and a new real-browser bounds assertion reproduced the panel extending to x=414 in a 390px viewport. It was an unspanned child of the 12-column control grid, and the intrinsic-width file label also overflowed. The focused existing CSS in `current-site/index.html` now spans the panel across the grid, permits shrinking and bounds the file label/input. A before-fix browser assertion fails; after-fix testing is recorded separately in `evidence/mobile-after.log`. No global grid rule or visual theme was changed.

## Remaining findings

- Confirmed baseline browser failures: Commons preassessment panel lookup is null (`commons-interactions.cjs:38`); parchment contrast target fails its viewport visibility condition (`parchment-contrast.cjs:40`). Their root causes are not yet established. They block stable certification and deployment.
- Suspected progress gap: Task 2 rehearsals/history live outside S while the general backup exports S. This pass does not claim full rehearsal export/import coverage; separate-key backup compatibility needs a versioned design and tests before changing it.
- No claim that every visible button or every old save format is certified. Remaining defects are not hidden by skipping or weakening existing assertions.

## Recovery

Revert this focused repair commit and rebuild/publish through the existing workflow only if release gates pass. Do not clear localStorage, the reward ledger, rehearsal/history, Guardian state or wardrobe keys. Until the newer-schema guard is released, avoid opening a newer save in an older release; retain the original JSON separately. On a backup/restore failure, preserve KEY, PREVIOUS, PIN and BAD before diagnosis.
