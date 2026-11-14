# Current-main runtime migration and cleanup

Base main: 3d5fa2889a91170a332eb9d70f9156934c032156. Stacked on save-safety PR #272. Source material: PR #243, reconciled file by file; no whole-branch cherry-pick.

| Retired live script | Verified permanent responsibilities |
| --- | --- |
| v3311-main.js | Grimoire pages/speech in grimoire.js; navigation/message routing in app-runtime.js; evolution/portraits in guardian-presentation.js |
| v3311-plus.js | Retained v3311 save namespace in MajickStateCore.legacyExtensions; notes/bookmarks/search/course views in grimoire.js; evolution cache in guardian-presentation.js; vault in reward-core.js |
| v339-main.js | Seed-equivalent question selection/history in question-scheduler.js; audio/preferences in study-audio.js; navigation/session/retired-lock policy in app-runtime.js; DOM habitat in sanctuary-ui.js |
| study-ui-compat.js | Approved portraits, coach, evolution dialog in guardian-presentation.js; realms in sanctuary-ui.js; existing app-runtime iframe bridge retained |
| ui-compat.js | Guardian dock in guardian-presentation.js; mini habitat in sanctuary-ui.js |
| sanctuary/v3310-sanctuary.js | Original motion actions, depth, startup and watchdog in sanctuary/Game.js; sanctuary-runtime remains the room owner |

## Newer-main reconciliation

Preserved current D756 script loading, latest course catalog tags, responsive Sanctuary viewport message handling, same-origin AND renderer-source navigation validation, direct user-gesture music playback and current music errors/status. Migrated bed assignments and Guardian focus additionally require a trusted renderer source. Removed the extra legacy route listener. Music and study chimes share a context; stopping music no longer suspends study effects. Pixi, its sole ticker, current approved assets and Phaser fallback remain intact.

The old fabricated completion overrides are not migrated. Legacy CSS selectors and global aliases still called by inline code remain; this is not a full historical-inline cleanup. Save identifiers are unchanged. Grimoire notes/bookmarks and unknown v3311 fields survive; remembered page/search is additive per course and mirrors old fields for rollback.

## Evidence

- Baseline: all 21 original canonical Node scripts pass on current main. Three pre-existing stale source-manifest digests prevented canonical build (collegium atmosphere and two D756 scripts). Exact existing source hashes were reconciled, not bypassed.
- Candidate: all 23 Node scripts pass, including save safety and runtime migration.
- `node pages-release/current/test-runtime-migration.cjs current-site /workspace/work/aetheria/baseline/current-site`: 120 seeded scheduler/history comparisons; all 40 original Phaser branches; startup delays/watchdog; single shared context and music stop PASS.
- Six legacy-save/Grimoire/Guardian/audio browser tests PASS at 390, 820, 1366px. Five existing integration checks PASS in a separate run after correcting the stale frame-validation literal and selecting installed Chromium. Initial failures are retained in raw evidence.
- Canonical build passes with all manifest hashes checked. Full Sanctuary integration additionally exercises live Pixi identities, duplicate Guardian IDs, all stages, furniture, saved reload, care and Phaser fallback.
- No retired script references remain anywhere in current-site apart from historical saved namespace identifiers (which are retained). Dynamic/iframe loaders were searched, not only the top-level HTML.

Evidence files are under docs/audits/evidence/aetheria-2026-11-14. Browser scripts use fresh synthetic contexts. No learner saves, protected artwork, branch deletions, PR closures, merge or production publication.

## Limits and rollback

This certifies the focused migration paths, not all rooms or remaining feature PRs. Existing CI must pass on the final head. Revert migration commits and rebuild canonical sources to roll back code; retain learner storage and reward history. Production main publishing is automatic, so merging remains a release action requiring authorization.
