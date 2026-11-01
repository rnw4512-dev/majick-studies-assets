# Permanent runtime owner migration — 2026-11-01

## Change summary

Repository: `rnw4512-dev/majick-studies-assets`. PR: #243. Starting cleanup snapshot: `3376797d0a134de9ea87753fa1d59976f6368b3d` (base main `a7890cfb60543503d11a82365da83883852c03dd`). Development branch: `refactor/permanent-runtime-owners`; delivery branch: `chore/safe-legacy-cleanup-20261101`.

Implementation commit: `ecbe03e731d6497ffa4a42fb5eed759fdd9e887c`. Parchment contrast/test follow-up: `afc33f9813740348ae0b33ed4eb0f3326c8d412a`.

The six listed legacy JavaScript files are removed from the live source and script graph. Live behaviors have named owners, while historical save keys, CSS selectors and global entry-point aliases remain compatible. Duplicate/overridden renderers, obsolete progress percentages and boot-time presentation overrides were discarded rather than copied into new files.

| Retired script | Permanent owner of its active behavior |
| --- | --- |
| `v3311-main.js` | `grimoire.js` owns book content, speech and page controls; `app-runtime.js` owns navigation/routing; `guardian-presentation.js` owns portraits/evolution presentation. |
| `v3311-plus.js` | `MajickStateCore.legacyExtensions()` in `majick-state-core.js` owns access to the retained save namespace; `grimoire.js` owns search, notes, bookmarks, remembered pages and feedback-only mini-quizzes; `guardian-presentation.js` updates the evolution cache. Current vault rendering belongs to `reward-core.js`. |
| `v339-main.js` | `question-scheduler.js` is the generic adaptive scheduler, exposed through `MajickAdaptiveLearning.scheduler`; `study-audio.js` owns study chimes/preferences and shares its context with `collegium-atmosphere.js`; `app-runtime.js` owns adaptive session metadata and the existing retired-lock policy; `sanctuary-ui.js` owns the DOM room presentation. Historical project completion overrides are removed. |
| `study-ui-compat.js` | `guardian-presentation.js`, exposed through `MajickGuardianCore.presentation`, owns the approved portrait, coach and evolution views; the current `app-runtime.js` Sanctuary bridge remains the iframe/route owner; `sanctuary-ui.js` owns realm presentation and `reward-core.js` the vault. Previously overridden iframe/shop/portrait implementations are retired. |
| `ui-compat.js` | Guardian dock presentation is in `guardian-presentation.js`; mini-habitat rendering is in `sanctuary-ui.js`. |
| `sanctuary/v3310-sanctuary.js` | `sanctuary/Game.js` directly owns the four original behavior selectors, depth handling, motion startup and watchdog; `sanctuary-runtime.js` remains the room presentation owner. The extra create/restart wrapper and already-overridden decorative implementations are removed. |

Pixi remains the default Sanctuary renderer. Phaser remains a supported fallback, with its active motion now in the permanent Game scene. This migration preserves that fallback rather than claiming new Pixi action/art parity. All 33 protected motion asset hashes are unchanged. Versioned inline code and retained stylesheet selectors outside the six-script scope remain separate architectural work.

Additional functional corrections found while exercising the migrated code:

- Page controls now update the page field actually read by the Grimoire. The prior main/plus pair wrote/read different fields, so the visible page did not turn.
- Grimoire page/search views are course-specific and additive. The pre-migration view is attributed to the restored active course, and the old fields are mirrored for rollback compatibility.
- Speech and mini-quiz markup safely handles apostrophes and markup-like source text; glossary terms containing regex metacharacters remain literal.
- The book has a stable panel ID, preventing collisions when delayed room panels insert ahead of it.
- Evolution close control is reachable above its heading; the dialog supports Escape, contained Tab focus and focus restoration, and repeated opens replace the existing dialog.
- Study-sound settings are available in the current sound-settings panel, including mobile.
- `grimoire.css` keeps the mobile header/search controls from competing for the same narrow row and places page arrows below the book. Non-cover parchment heading/lead text has explicit dark ink, with a 4.5:1 minimum contrast assertion against the darkest declared parchment stop.

## Data and behavior preserved

Saves still use the established save owner and schema. `S.v3311.grimoire` notes/bookmarks/remembered entries, `guardianEvolutionState`, `sanctuaryState`, `collectionState`, `S.v3311Page`, historical globals and unknown saved fields remain readable. Only additive `grimoire.courseViews` data is introduced. No question-bank answer keys, scoring rubrics, XP/crystal rates, egg balances, Guardian IDs or protected artwork are rewritten.

The browser fixture serializes an old-format save, reloads it through the normal save reader, edits notes/bookmarks, changes pages/search, switches D772/D756 and reloads again. It verifies saved answer histories, duplicate-species egg IDs/progress, XP, crystals, fragments, inventory, bed assignments, collection state and unknown fields. Mini-quizzes remain feedback-only with no independent mastery/currency credit.

## Verification

- Final canonical build: PASS, release fingerprint `ed277db110f99e21`.
- Source manifest: 875/875 SHA-256 entries match. All 33 protected motion PNG hashes match the untouched cleanup baseline.
- Committed deterministic/Node scripts: 22/22 PASS, including canonical release, academic coverage, recovery, Guardian/Sanctuary, reward replay and the new migration contract.
- Differential scheduler test: 120 seeded selection, target difficulty and recording-history comparisons match the baseline, including assisted/history rotation cases.
- Differential motion test: all 40 original Guardian behavior branches match; startup delays 650/1050/1450/1850ms and the 5200ms watchdog are retained. Scene shutdown removes its watchdog.
- Combined Playwright run: 11/11 PASS (five existing integration checks and six migration tests across 390/820/1366px).
- Final CSS-only contrast follow-up: three saved-state/Grimoire tests PASS at 390/820/1366px, including the new contrast assertion.
- Full interaction suite: PASS, including exact core-state JSON equivalence after reload, lesson/repair flows, course isolation, duplicate protection and rendered parchment checks.
- Full Sanctuary suite: PASS, including eleven identities, duplicate Guardians, all saved evolution stages, walking frames, local hit areas, pointer feedback, care, furniture store/place/drag, saved reload and Phaser fallback.
- Commons: responsive rendered audits ran at 390/820/1366px. The final 1366px interaction rerun PASS covers navigation, source questions, wrong-answer repair, Guardian care, furniture and reload.
- Connected probability: final end-to-end run PASS, including repair, two fresh independent responses, transfer, structured teaching, replay prevention, course isolation and certification revocation after a later independent miss.

The full functional runs used build `0f5abe2da2b7b72e`; the final `ed277db110f99e21` follow-up changes only scoped parchment ink CSS. Its targeted responsive/contrast checks passed. The 11-test integration run also covers that final JavaScript/state-owner implementation.

Two browser-fixture readiness corrections were necessary: Commons now waits for its delayed preassessment panel before opening it, and probability waits for the requested task's actual rendered prompt rather than only an eagerly updated focus value. The probability failure reproduced against the untouched application baseline. No answer/scoring assertions, contrast thresholds or independent mastery requirements were weakened.

Visual inspection: 390px and 1366px Grimoire captures were inspected; the cramped header and light-on-parchment heading issues were addressed in the scoped follow-up. Automated interaction/layout checks cover 820px as well. Tests use isolated synthetic profiles, never real student saves. Audible output quality and every browser/GPU combination are outside this local certification.

GitHub Review #488 belongs to the old cleanup snapshot. Fresh CI must evaluate the updated PR head. No merge or deployment occurred during this work; live deployment is unverified.

## How to inspect

1. Open Living Grimoire and select its book section from Explore this room. Turn pages, search, bookmark/remember a page, edit a margin note, use Read this page and answer a mini-quiz.
2. Reload and switch between D772 and D756; notes/bookmarks persist and page/search views remain separate.
3. Open a Guardian evolution view, close it using the button and Escape, then check Sound settings and reload the preference.
4. Open Sanctuary, exercise saved Guardian care and furniture, switch to the original Phaser fallback and check the existing motions and room state.

Reproduce the new tests with a server for current-site and `MIGRATION_URL` pointing to it, then run `npx playwright test tests/runtime-migration.spec.cjs tests/integration-regression.spec.cjs --workers 1`. CI installs Playwright's Chromium. Local system Chromium can be selected with `CHROMIUM_PATH=/usr/bin/chromium`.

## Break/fix guide

- Missing book/navigation: inspect script order in index.html and `MajickGrimoire`, then check the selected room panel. The state core must load before Guardian presentation and before the runtime initializes the saved book view.
- Missing notes/bookmarks: inspect `MajickStateCore.legacyExtensions().grimoire` and existing save-status/recovery tools. Keep legacy keys intact; export a backup before investigating storage problems.
- Unexpected question rotation: compare `MajickQuestionScheduler` with the differential baseline contract. Preserve `v339Family`, section history and assisted flags; never clear answer history to change rotation.
- Silent study sounds: check the persisted study sound preference separately from opt-in music, then browser audio permission/context state. Both current controls delegate to the same study audio owner.
- Missing original motion: inspect Game.startMotionDirector and scene readiness. Retain the existing Phaser fallback and protected assets; do not fabricate replacement frames.

Rollback: revert `afc33f9` and `ecbe03e` in that order, then rebuild through pages-release/current/build.py and the established release workflow. Keep the additive saved view data: old code can ignore it, and mirrored legacy page/search fields remain available. Reverting code requires no deletion or reset of student progress, eggs, balances, inventory, Guardian identity or Sanctuary state.

## Remaining work

The six-script owner migration is implemented and locally verified. The implementation owner should review fresh CI on the updated head before merge. Any production release requires the established deployment workflow and live verification. Phaser retirement remains a separate renderer-parity decision; historical CSS/inline-version cleanup can proceed independently while keeping saved-data contracts intact.
