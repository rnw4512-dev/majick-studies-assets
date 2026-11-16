# Aetheria startup, learning and rendering repair — November 15, 2026

Implementation is substantial but **the entire ten-phase directive is not certified complete**. This report distinguishes new repairs from existing features verified in this session. The supplied Visual Design Bible is a reference for later visual batches, not authorization to replace active systems or create its proposed assets.

## Integration and source

- Repository: `rnw4512-dev/majick-studies-assets`; user explicitly selected **main**. No branches, rooms, learning engines, XP services, Journal databases, or animation loops were created. Existing branches were not deleted or merged in bulk.
- Starting main: `a16d0dfed93762b95935e054a3efb0ef863ae62b`.
- `7827bbe`: remove intermediate legacy startup renders, prevent hidden Home Sanctuary initialization, defer/idempotently prepare furniture, persist question-specific Your Turn state, and add browser regression coverage.
- `220dadc`: persistent vocabulary drafts; stale delayed-test-session guard; compact mobile navigation; existing Journal tabs; lossless/responsive scene artwork; compact accessible XP receipt; certified Pages publisher.
- `7e534c7`: prevent the Atelier integrity workflow from unconditionally dispatching the legacy publisher. It now requests the canonical publisher only after an actual manifest repair.
- Rendering lifecycle follow-up: stop/start the **existing Pixi app ticker** with document visibility, viewport intersection and existing room-panel visibility. No second animation owner.
- PR #282 is **merged** and its enchanted-collegium styling is retained. PR #280 and the older feature/draft PRs remain unmerged; no competing implementation was imported. Council improvements already present on main were preserved.
- Ordinary pushes to main were accepted. No force push, admin merge or check bypass was used. Reading branch-protection settings returned HTTP 403; no claim is made about unseen settings.

## Phase delivery matrix

| Phase | Status | Evidence and remaining work |
|---|---|---|
| 1. Startup | **Partially complete — remaining work** | Actual bottleneck repaired: repeated root renders and an invisible Home Sanctuary iframe. Immediate HTML shell; first requested room; deferred furniture. Controlled profiling below. Full dependency-based splitting of the 96 legacy root scripts is still outstanding. No idle preload queue was added merely to move blocking work elsewhere. |
| 2. Question state / feedback | **Partially complete — remaining work** | Your Turn uses stable content-derived IDs within the saved course/lesson, separate draft/submitted/completion/feedback maps, a persistent session ID and guarded handlers. Vocabulary snapshots and drafts survive reload. A delayed legacy test callback cannot modify a newer session/course/room. Actual Q1→Q2, wrong→repair→correct, feedback collapse, replay and reload tests pass. These are the repaired flows, not certification of every legacy question mode or optional AI request. |
| 3. Scrolling / guided navigation | **Partially complete — remaining work** | Question progression focuses and reveals only the active question; explanations collapse. Compact 72px mobile navigation replaces oversized inherited room navigation; buttons remain 56px high. Journal uses keyboard tabs and bounded notes. All 16 existing room links pass smoke checks at 390/820/1366 with no document overflow. A complete instructional/layout review of every lesson is still outstanding. |
| 4. Artwork / rendering | **Partially complete — remaining work** | Five large existing background families now have pixel-identical lossless WebP and 820px responsive derivatives; originals preserved. Existing Pixi ticker pauses when offscreen/hidden and resumes without a new loop. No Guardian PNG conversion or identity change. Full repository-wide duplicate/unused-art cleanup and long-duration GPU-memory profiling remain outstanding. |
| 5. Council Chamber | **Complete — verified** | Existing illustrated speaker scene, professional responses, scripted dialogues, guided model, independent isolation, three profiles, input/clarification tracking, transcript/replay, timer, persistence and shared reward rules pass full browser journeys. These features were largely pre-existing, not newly invented here. No Guardian or stakeholder portrait redesign. |
| 6. Sanctuary | **Partially complete — remaining work** | Browser tests verify eleven saved identities (including duplicate names), correct stages, selection, pause/speed, furniture, saved avatar layers, missing-art fallback, safe repair, route-source isolation and hidden ticker stop/resume. **Blocked — exact reason:** the approved four-frame manifest lacks the complete stage frame sets. Existing one/two-frame walking/portrait fallbacks remain; no unapproved artwork is substituted. |
| 7. XP / mastery | **Partially complete — remaining work** | Existing receipt is compact, nonblocking, numerical and announced as status; reduced motion disables the entrance effect. Ledger replay and completion replay do not award twice. Journal labels supported completions and explicitly unassisted responses separately; guided reconstruction is not mastery. Legacy reward policy is retained; a full consolidation/audit of every older award entry point is not claimed. |
| 8. Atmosphere | **Partially complete — remaining work** | Existing parchment/plum/gold styling and illustrated room identities retained. Static scene conversions improve delivery; no extra particles, loop, autoplay music or new sound files. The attached design bible's new portraits, badges and proposed visual treatments are not implemented or approved by this repair. |
| 9. Scholar Journal | **Complete — verified** | Existing Journal now has Achievements, Recent Lessons, Mistakes Repaired, Next Learning Goals and preserved My Notes. Reads course saves, canonical account/ledger and reconstruction records directly. Actual completed reconstruction and fresh-transfer state remain visible. Keyboard tab changes preserve draft notes; save and resume links work at all three widths. No shadow progress store. |
| 10. Regression / accessibility / deployment | **Partially complete — remaining work** | 21 canonical Node suites, release checks, four Council classification tests, canonical build and the documented browser journeys pass. Keyboard and reduced-motion behavior are verified. Full manual screen-reader, 200% zoom, exhaustive contrast and long-duration memory/CPU certification remain outstanding. Exact production status is recorded below. |

## Reproducible performance evidence

Baseline is original main `a16d0df`; local Chromium `/usr/bin/chromium`, 1366×900, fresh isolated browser contexts, localhost without throttling. Five alternating baseline/candidate runs; 1,500ms observation after load. No concurrent local browser suites during this controlled comparison. Do not compare these numbers to mobile hardware or a throttled public network.

| Metric (median except deterministic render count) | Before | After |
|---|---:|---:|
| Script execution (CDP ScriptDuration) | 826 ms | 371 ms |
| Observed long-task duration | 830 ms | 368 ms |
| DOM content loaded | 1,032 ms | 907 ms |
| Window load | 1,563 ms | 1,084 ms |
| Root application HTML replacements | 21 | 4 |
| Home Sanctuary iframes | 1, invisible | 0 |
| Top-document resource transfer | 9,598,393 bytes | 8,451,537 bytes |

This is a **55% reduction in measured script/long-task work**, not a claim that all startup work is eliminated. Four root replacements remain as current render adapters install. The initial root script count is still 96; source JS grew from 3,205,829 to approximately 3,222,104 bytes to support the repairs and Journal. Single-load heap metrics are retained in raw evidence but do not establish stable long-term memory. Room-loop document/window listeners remained 29/35 across repeated navigation; this does not count every descendant DOM listener.

Reproduce without creating a branch:

```sh
mkdir -p work/baseline
# Extract committed source into scratch space; do not check out a feature branch.
git archive a16d0df current-site | tar -x -C work/baseline
python tools/profile-startup.py work/baseline/current-site current-site /tmp/aetheria-startup-profile.json
```

Raw measurements: [controlled-performance.json](evidence/startup-learning-2026-11-15/controlled-performance.json). The earlier exploratory runs are also retained; a run contaminated by concurrent browser tests is excluded from the controlled results.

## Artwork evidence

Full-size WebP conversions were compared to decoded original RGB pixels with `ImageChops.difference`; each comparison was empty (pixel identical). Mobile derivatives preserve aspect ratio at up to 820px width. They are not replacement character artwork.

| Existing scene | PNG bytes | Full-size lossless WebP | Mobile WebP |
|---|---:|---:|---:|
| Guardian dorm | 2,341,414 | 1,854,636 | 369,326 |
| Ancient study library | 2,826,015 | 2,231,428 | 524,704 |
| Learn classroom v1 | 2,804,493 | 2,193,378 | 578,992 |
| Learn classroom v2 | 2,731,635 | 2,163,088 | 586,858 |
| Game observatory | 2,944,385 | 2,299,476 | 519,450 |
| **Total** | **13,647,942** | **10,742,006 (−21%)** | **2,579,330 (−81%)** |

Source manifest hashes were updated for every changed runtime, stylesheet and new derivative. Original PNGs, approved Guardian frames and evolution art remain intact.

## Verification and how to use the changes

- Home: navigation works without creating a Sanctuary iframe. Select **Companions / Visit Sanctuary** to load the existing scene.
- Learn Lab / Your Turn: answer the first question, advance, answer the second incorrectly, collapse/reopen feedback, repair it, reload and resume. Each question retains its own state; a detached handler cannot submit another question.
- Vocabulary: match a pair, leave/reload the activity, return; the existing saved course owner retains the matching draft and vocabulary snapshot.
- Scholar's Chronicle / Journal: switch the five native tabs using arrows, Home/End or pointer; notes remain typed while changing tabs. Recent Lessons resumes the matching Tutor lesson. Repairs read the actual reconstruction trail and retain fresh-transfer confirmation.
- Sanctuary: select another room-section tab while the scene is mounted; its Pixi ticker stops, and starts once on return. Leaving Companions destroys the iframe document naturally. Selection, furniture and avatar saves continue through the existing owners.
- XP: confirmed receipts display the numerical award; a replay does not create another ledger award. Reduced-motion display has no entrance animation.

Checks and retained logs are under [evidence/startup-learning-2026-11-15](evidence/startup-learning-2026-11-15/):

- `node pages-release/current/release-checks.cjs current-site`
- All `pages-release/current/test-*.cjs` suites, including the new session guard.
- `node --test tests/d756-question-classification.test.cjs`
- `python pages-release/current/build.py current-site <output>`
- `tests/startup-learning-browser.py`: 390/820/1366, question identity/state, stale handler, numeric feedback, keyboard collapse, XP replay, draft/reload, vocabulary, Journal notes/repair/transfer/resume, responsive image requests and reduced-motion receipts.
- `tests/room-navigation-browser.py`: all 16 existing room links at all three widths, nonempty content, no document overflow, no runtime errors, stable document/window listener counts.
- `tests/aetheria-sanctuary-browser.py`: eleven identities/stages, real wardrobe save, furniture, renderer lifecycle, fallback and confirmed repair.
- `tests/d756-full-script-browser.py` and `tests/d756-meeting-browser.py`: guided model and independent isolation, real complete meetings, contextual inputs/clarifications, rewards +30/+8/0, persisted ledger, next-day limits, replay and repair-only zero rewards, no runtime/asset failures. The optional legacy `/health` AI endpoint is offline locally; scripted Council does not depend on it.
- Integration Actions also run the existing Playwright lifecycle, ceremony/reduced-motion and saved-avatar regression tests.

Screenshots: [390px Journal](evidence/startup-learning-2026-11-15/journal-390.png), [820px Journal](evidence/startup-learning-2026-11-15/journal-820.png), [1366px Journal](evidence/startup-learning-2026-11-15/journal-1366.png). Journal screenshots were visually inspected on phone and desktop; screenshots alone are not treated as functional verification.

## Deployment

PENDING FINAL EXACT-SOURCE VERIFICATION.

The existing `publish-aetheria.yml` remains the canonical publisher. It runs the canonical build and real learning/Journal/navigation/Guardian/Council browser checks before publishing, preserves `/current-site/`, stamps `release.json`, and verifies an exact deployed `deployment.json` commit rather than HTTP 200 alone.

An existing integrity workflow had automatically dispatched the legacy publisher. That legacy run finished before cancellation could take effect; it is not the final production verification for this repair. Commit `7e534c7` removes unconditional duplicate dispatch. The canonical publisher must finish and both public entry paths must be checked after it.

Production entry: https://rnw4512-dev.github.io/majick-studies-assets/current-site/

## Break/fix and recovery

- **Old/incorrect artwork after deployment:** compare `current-site/release.json` and `current-site/deployment.json` with the passing publisher run. Check current stylesheet URLs for the stamped release key. Use the existing image fallback; do not reset saves or Guardian identities.
- **Sanctuary unavailable:** use the existing original-renderer fallback, or the room's explicit Retry/Repair action. Missing four-frame art is not saved-data corruption. For a rendering-lifecycle fault, inspect `MajickPixiSanctuary.inspect().diagnostics.tickerStarted`, selected parent panel and frame visibility; restore the previous lifecycle code without touching the account save.
- **Question appears stale:** inspect the active course, saved lesson/currentQuestionId and draft/submitted maps. Reproduce in a fresh test context. Do not clear the learner's completion ledger to hide a UI defect.
- **Journal count differs from a legacy screen:** supported completions and explicitly unassisted canonical answers are intentionally separate. Old records with unknown assistance are not inferred to be independent. Inspect the source records; never manufacture mastery or migrate by erasing historical data.
- **Build fails after a code edit:** run the named Node/browser checks and recompute the existing SHA-256 source-manifest entry only for reviewed changes. Do not disable integrity validation.
- **Rollback:** revert the specific repair commit on main using normal Git review rules, retain unrelated later changes, rerun the existing publisher. Reverting UI code does not require clearing browser localStorage; newly saved practice fields are additive and can remain safely in the course save. Roll back source and its corresponding manifest entries together. Never force-push or restore an older learner snapshot as an appearance fix.

Next implementation owner: existing maintainers/Codex on main. Highest remaining priorities are dependency-aware legacy bundle splitting, exhaustive lesson-mode/assist audit and long-duration accessibility/performance certification. Complete four-frame Guardian walking only after approved, aligned stage artwork exists. New visual-bible asset batches remain separate design work after the critical repairs are certified.
