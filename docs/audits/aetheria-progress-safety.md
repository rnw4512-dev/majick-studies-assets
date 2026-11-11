# Aetheria progress safety

## Existing structures

`moonlit_learning_v1` is the primary JSON S object. Its current save schema is 1. `courses` holds course definitions; `progress[courseId]` holds answers, guided/independent/mastery evidence, error history and course-specific state; `majickAccount` holds shared XP/crystals, identity, reward ledger, furniture and appearance; `legacy` holds Guardian and egg instances. Unknown fields are retained by JSON cloning rather than filtered out.

`save-safety.js` reads, validates, migrates, writes, exports and restores that snapshot. `index.html` owns S and its get/set/render attachment; `majick-state-core.js` owns normalization/shared balances. Course and feature modules mutate their owned subtrees and call the established save wrapper. The machine inventory includes storage-operation source locations; it is not a full dynamic writer trace.

Recovery keys: `moonlit_learning_v1__recovery_previous`, `__before_restore`, `__safety_meta`, `__unreadable`, plus legacy `__good_backup` and `__session_backup`. Do not remove any because a newer key exists.

Task 2 also uses `majick-d756-task2-rehearsal-v1` and its `-history` companion. Material libraries use separate storage; see inventoried IndexedDB references. Appearance and legacy preferences may have additional keys. These are retained. Complete all-key export/import is not yet certified.

## Change and safety boundary

No stored-data structure or schema was changed. The repair refuses to downgrade a valid newer primary to an older backup. It does not mutate the unsupported save or label it corrupt. Existing corruption recovery still works, and malformed imports still reject. No migration, reset or manual reward credit was introduced.

Regression fixtures exercise unknown fields, course sentinels, shared account and legacy object equality, JSON backup download/import, before-restore recovery and reload. API tests cover schema rejection, both older fallback keys and corrupt-save recovery. Existing suites cover storage-quota failures, academic course isolation, Guardian/Sanctuary migration and reward replay prevention. Meeting duration tests use a virtual clock, not a human 15-minute rehearsal.

The learner's real browser storage was never opened or modified. Automated tests use fresh contexts. No browser fixture or seeded progress is shipped in application code.

## Rollback and failure handling

Published rollback tag: `backup/aetheria-pre-cleanup-20261111` at `31be7d10f31ebb71b66a2055ef0246d228aac9ce`. A Git archive extraction of its entry point was checked against the baseline source SHA-256. The tag is a code/asset recovery reference, not a backup of browser progress. No rollback deployment was performed.

Before a rollback, export progress and separately retain rehearsal/history and any material-library data. Revert focused cleanup commits on a new branch, rebuild through `pages-release/current/build.py`, run relevant gates and publish using the established workflow. Never reset storage to fix appearance or navigation.
