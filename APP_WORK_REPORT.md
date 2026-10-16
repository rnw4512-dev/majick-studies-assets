# Majick Studies app work report — 2026-10-15

## What I changed

This is the four-priority Collegium Commons completion pass. Existing Home, course progress, reward, Guardian care, egg and Phaser Sanctuary owners are reused.

Implemented repairs on review branch `commons-rendered-certification` (PR #131):

- Stable section identities place Daily Study Loop in Today, Memory Quest in Review, campus destinations/Student Record in Overview, and actual Sanctuary content in Sanctuary. The observer now reconciles delayed additions inside panels as well as beneath Home.
- Restored Student Record and Sanctuary content hidden by the former compact-Home CSS. Student Record and the existing full study-Guardian card use expandable summaries to keep Overview short.
- Paired dark Academic Hall/record ink with explicit parchment surfaces, including nested cards; repaired Daily Loop foreground/background pairings; increased small labels and constrained long question/select content on mobile.
- Paused the existing Phaser loop while its Home tab is hidden and resumed it on entry, avoiding background scene work while reading.
- Shortened the welcome; preserved stationary plum/velvet, parchment, antique gold, moonlight and existing campus art. Removed drifting decorations over Home reading surfaces. Corrected cramped tablet header and oversized mobile chrome.
- Reused the existing real egg-incubator renderer in Guardian House. No new egg, Guardian, XP or mastery store.
- Removed the hard-coded D772 lesson from the global release badge and made the room ribbon reflect the selected course.
- Associated adaptive teaching text with its label and identified question groups for screen readers; supplied names for the active-course selector and icon-only Home navigation.
- Repaired malformed HTML action attributes in WGU Study Now review/retry controls and answer choices by escaping serialized JavaScript arguments for HTML attributes.
- Added actual rendered-pixel contrast/viewport/interaction checks, visual artifacts and independent desktop/tablet/mobile review jobs. Tests now click the formerly malformed Review/Try new questions buttons.

## WGU-language alignment and in-card Back

- Revised all 30 original D772 preassessment-based supplements to scenario/task stems, four plausible responses, one best answer, and WGU terminology grounded in the supplied 58-item preassessment. The original 58 source items remain unchanged, including flagged missing mathematics.
- Explanations connect exam terms to plain English after answering. Correct positions vary. Generated probability distractors now use distinct mathematical values instead of equivalent fractions.
- One normalized question adapter supplies Learn Lab, Study Now and Game Realm. Revision metadata distinguishes new attempts without rewriting prior history. Future writing rules: `D772_WGU_LANGUAGE_STANDARD.md`.
- Added a visible Back control inside Connected Learning · Probability, as requested in the screenshot. It reuses existing campus navigation history and preserves drafts/evidence; browser coverage clicks it and checks academic state.
- Removed literal escaped newline characters between HTML imports that rendered a stray pale strip above the app.
- Fixed final header height overrides that allowed the course/ambience controls to overlap the reading area.

If wording or an answer fails: identify the question ID/revision, check its four alternatives against its worked rationale, repair that canonical item and update the manifest hash. Keep original source and learner history intact. If the in-card Back fails, check `probability-workshop.js` binding to `majickBack` and existing session navigation history; do not clear course saves.

## How I did it / exact locations

Canonical runtime files: `current-site/collegium-commons.js`, `collegium-commons.css`, `product-core.js`, `magical-college-home.js`, `app-runtime.js`, `living-magic.js`, `d772-adaptive-mastery.js`, `guardian-core.js`, `wgu-practice.js`, and affected hashes in `source-manifest.json`.

Verification files: `pages-release/current/browser-commons.cjs`, `commons-contrast.cjs`, `commons-control-states.cjs`, `commons-interactions.cjs`, `browser-interactions.cjs`, `test-collegium-commons.cjs`, and `.github/workflows/commons-review.yml`.

The tab coordinator moves existing DOM nodes and their handlers. It does not clone feature renderers. The Guardian/record summaries wrap existing nodes. The egg view calls the existing Guardian-care renderer. Retry repairs escape existing inline-handler arguments without replacing practice logic.

## Where to see it

Once deployment is verified: Home → Overview/Today/Review/Guardians/Sanctuary. Expand Student Record and the nearby Guardian summary in Overview. Study Now → Skill growth and review → Review lesson / Try new questions exercises the repaired handlers.

## Verification and deployment status

This report is a working checkpoint, not a completion claim.

Passed locally: canonical release checks, Commons contract/classifier tests, D772 preassessment/adaptive tests, JavaScript syntax and canonical hash/syntax build. Existing instructional-gap inventory remains reported; passing release checks do not mean all D772 lessons are instructionally complete.

Passed in earlier review runs: real delayed-render placement, keyboard selection/focus, five-tab ownership, existing full interaction suite, connected probability end-to-end suite, course/world persistence, and focused adaptive-review/care flows. Earlier screenshots identified additional contrast/overflow problems, which were repaired in later commits. Previous passes do not automatically certify later commits.

Latest review is still running. Full final responsive/contrast/control-state/inventory verification and GitHub Pages publication are not yet certified. Local Chrome could not open a session because this workspace blocks its socket; browser evidence comes from GitHub Actions on the actual built source.

PR: https://github.com/rnw4512-dev/majick-studies-assets/pull/131 . No merge or deployment is claimed at this checkpoint.

## If something breaks — diagnosis, minimal fix and rollback

| Symptom | Diagnosis and repair | Safe rollback |
| --- | --- | --- |
| Daily Loop/Memory Quest in wrong tab; late content escapes | Check stable selectors, `needsSync()` and existing render-queue ordering in `collegium-commons.js`; run Commons classifier/browser placement cases. | Revert only the relevant coordinator change and restore its manifest hash; preserve all saves. |
| Student Record/Sanctuary missing | Inspect computed `display`, old `home-focus.css` hiding rules and Commons overrides. Check expandable record summary before assuming content is lost. | Revert the wrapper/visibility rule together; keep the underlying original node and renderer. |
| Paper/velvet text unreadable | Inspect actual foreground, nearest painted background, overlays and final scoped Commons rules. Use the failing viewport/state JSON and screenshot artifact. | Revert the scoped surface/ink pair together, not only one color; restore corresponding hash. |
| Narrow text spills outside paper | Check panel/grid minimum widths, fieldset min-inline-size, native select width and wrapping rules. Run each panel at 390px. | Revert only the narrow-layout block if it causes a regression; do not change course content. |
| Review/Try new questions or answer selection does nothing | Inspect parsed `onclick` and browser console in `wgu-practice.js`; serialized strings must be HTML-escaped. Rerun the actual-button regression. | Revert only the affected handler-generation hunk, never learner attempt history. |
| Eggs duplicated or missing | Check there is one Commons incubator and that it uses `MajickGuardianCare.snapshot()`/`eggIncubatorHTML()`; inspect existing care stores before changing data. | Remove only the Commons view call; never reset eggs, roster or rewards. |
| Header shows wrong course or overlaps text | Check release badge constants, live room ribbon text, and scoped Home header wrapping rules. | Revert only badge/ribbon/layout changes; do not replace the app runtime or restore an old build. |
| Furniture or care fails to persist | Inspect existing Guardian-care save and Sanctuary `postMessage` bridge. Browser tests exercise live UI handlers and reload. | Revert the specific failing change; never clear localStorage/IndexedDB, inventory or academic records. |
| Build integrity fails | Recalculate SHA-256 only for intentionally changed canonical files in `source-manifest.json`; rerun `build.py`. | Restore the matching file and hash from the same known-good commit. |
| Browser test fails or screenshot times out | Inspect its failed assertion/artifacts first. CI screenshots may need sufficient capture time; errors must not be bypassed or assertions weakened. | Keep publication blocked until repaired. |

For full release rollback, revert the merged PR through Git and republish using the existing Pages workflow. Do not reset user data, replace protected motion assets, or restore historical version overlays.

## Data protected and next acceptance criteria

No save reset, account-store replacement, reward engine, duplicate Guardian renderer, or Sanctuary motion replacement. Academic course records remain separate; shared identity, earned rewards, Guardians, eggs and inventory remain shared through existing stores.

Next: finish the latest review, repair any genuine failures, inspect desktop/tablet/mobile screenshots, then merge and publish through the established Pages workflow. Acceptance requires passing current source, browser, contrast, course/world preservation checks and verified live build identity. Update this report with final commit, run IDs, deployment result and any remaining limits before completion.


## Probability render stability follow-up

- Change: completed the pending unchanged-view guard in `current-site/probability-workshop.js`. Repeated mounts reuse the existing form when screen, task, recommendation and mastery are unchanged; drafts are deliberately excluded so each keystroke does not rebuild its own input. Actual task changes still refresh counters, feedback and locks. No extra state owner or save migration.
- Regression: `pages-release/current/browser-probability.cjs` now mounts twice between pointer-down and pointer-up for real pointer clicks, and types with browser input events while asserting form identity, focus, selection and persisted draft after 20 mounts. The existing full sequence still checks repair, two independent questions, transfer, teaching, reload, Back, course isolation, reward replay and shared misconceptions.
- Verification: canonical build, release checks and test syntax passed locally. Local browser rerun blocked by Chrome socket permission failure; GitHub PR #131 rerun is pending. Not deployed or visually certified by this follow-up.
- Location: D772 → Connected Learning · Probability → Repair / Independent OA reasoning; type in Whiteboard and use the task buttons.
- Recovery: if inputs lose focus or clicks vanish, run `node pages-release/current/browser-probability.cjs _site` against a canonical build and inspect DOM identity assertions. If feedback becomes stale, ensure new rendered state is included in the view key; do not include drafts in that key. Revert only the view-guard hunk and its matching manifest hash to undo this fix. Never reset learner progress, rewards, Guardian or Sanctuary stores.
- Next: obtain passing full browser sequence on the review commit, then record its run and result. Broader Commons and WGU work remains in PR #131.


## 2026-10-15 — Probability CI failure follow-up

- **Confirmed run:** [38821912593](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38821912593), on `198fbd0`. Desktop 1366px failed in `browser-probability.cjs:104` when the next independent task retained a previously seen dataset. Earlier pointer-retention, typing, guided-repair and Commons interaction tests passed. Tablet 820px and mobile 390px review jobs passed but did not run the full probability sequence.
- **Changed:** `pages-release/current/browser-probability.cjs` (commit `a18e16eb`) waits for the task ID to change after a real click before testing dataset freshness. This does not weaken the dataset assertion.
- **Changed:** `current-site/probability-workshop.js` (commit `cd9a7abf`) defers render-queue replacement of a pressed probability control until after the browser completes its native click. Existing draft, focus and task-change protections remain intact.
- **Integrity:** `current-site/source-manifest.json` updated (commit `1ac4b857`), new SHA-256 for probability workshop `096ed4f0f2ff68c4fd9b3cb199d7df98338ac465432394ec1a93b9e51eaef83e`.
- **Verification:** The initial CI run was inspected. **The new full sequence is not yet confirmed passing.** Inspect the new review run for HEAD `1ac4b857`; do not merge or deploy until the complete probability suite, browser matrix and screenshot evidence are verified.
- **Recovery:** If pointer events interfere with task controls, revert the `cd9a7abf` code change and restore its matching canonical manifest hash. If the wait assertion fails, investigate whether the native click reaches the Next handler; never relax dataset uniqueness. Do not clear or overwrite academic state, XP, crystals, Guardian/egg state, inventory or Sanctuary saves.
- **Remaining:** Full sequence confirmation, 1366/820/390 screenshot inspection, lesson-by-lesson instructional coverage and targeted mean/median/graph/probability upgrades.


## 2026-10-15 — Phases 1–4 continuation
- **Observed CI:** run [38823269557](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38823269557) failed desktop-only suites: `browser-interactions.cjs` waited for `[data-meaning]`; `browser-probability.cjs` confirmed task ID `connected-probability-2` did not advance after Next mouse activation. Other deterministic checks, build, Commons screenshots, and 820/390px matrix jobs passed. Do not call Phase 1 complete.
- **Repair:** `current-site/probability-workshop.js` commit `9b97e769`: advance a completed reasoning task on actual `pointerup` or keyboard `click`, guarded by originating task ID so a single action cannot double-advance. Existing general pointer protection remains. No academic or reward records were cleared.
- **Manifest:** `current-site/source-manifest.json` commit `ae93321a`, workshop SHA-256 `a9ae1c169015c3c73fd42578b6f07c998c9ef84c128233d031618a2806e9399d`.
- **Phase 2–4 work:** `D772_PHASES_2_TO_4_COVERAGE.md` commit `672ad8e1` records a lesson-by-lesson source-grounded audit and acceptance gates for complete scenarios, worked examples, visuals, independent cases, teaching rubrics, and shared misconception recovery without duplicating supplied source items.
- **Validation still required:** rerun complete desktop probability repair→reasoning×2→transfer→teaching and browser interaction suite; test widths 1366/820/390 and inspect screenshots. The `[data-meaning]` failure remains open pending root-cause investigation. The new probability code has not yet been certified by a green CI run.
- **Recovery:** Revert commit `9b97e769` and accompanying manifest hash if activating Next twice or another pointer regression occurs; preserve learner data. If the new browser run fails, log originating/new task IDs and event dispatch around the exact click before making additional changes. Keep unmerged until all release gates pass.


## 2026-10-15 — Immediate repairs, not deferred backlog
- **Fixed probability activation path:** `current-site/probability-workshop.js` commit `9b97e769`: when a completed independent reasoning task's Next control receives pointer release, the task advances once; keyboard click remains supported and the originating task ID prevents double advance. Manifest hash in commit `ae93321a`.
- **Fixed workshop remount state loss:** `current-site/solution-engine.js` commits `25bbc9ae` and `09bde810`: in-progress six-stage answers, stage and scenario selection are reattached by course/task after host replacement; Restart scenario also updates the active state. Canonical manifest hash updated in `daa49383` to `e4f7f81e53ce8c9605bfcdb9977b10b75a896d02dc78502db6e73e283473708b`.
- **Verification:** CI started for previous head `0591c0c` ([run 38826948104](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38826948104)); its tablet and phone jobs were green when checked, desktop still running. The new workshop remount change is later than that run and must be exercised by its own new CI. Do not claim end-to-end verification yet.
- **Recovery:** If a newly mounted workshop inherits an incorrect scenario, inspect `ACTIVE_STATES` keyed by course/task and its replacement-host setup. Revert only the state-retention commits and accompanying manifest edits, leaving academic progress, rewards and Sanctuary storage untouched. If probability Next fires twice, inspect origin-task guard before altering the freshness assertion.


## 2026-10-15 — Phases 2 and 3 instructional implementation
- **Code:** `current-site/generated-question-engine.js` commit `e2810c77` upgrades the existing D772 generated lab workshop instead of creating a duplicate: displays one mathematically matched worked example and whiteboard setup; checks guided reconstruction; presents a genuinely different generated independent dataset; checks and records one formative independent response; supplies a realistic student misconception and three-part teacher response rubric (explanation, visual/model, fresh diagnostic question).
- **Integrity:** `current-site/source-manifest.json` commit `54faf2a3` now hashes the revised engine as `ec0a28608347763129388e85651fdf00ba2074aed99f51ced74a05926dfa6290`.
- **Academic ownership:** existing generated-question engine remains the single owner of mean, median, box plot, histogram, scatterplot and probability samples. Guided responses and auto-scored formative independent attempts cannot certify mastery. Original WGU-source questions remain untouched. The teacher rubric uses keyword/length checks only, and explicitly does not grade conceptual accuracy.
- **Testing:** latest GitHub PR Actions required for release/build/browser checks. This change is not claimed as fully certified until a new workflow is green and worked examples are visually reviewed.
- **Recovery:** revert the generated-question-engine change and restore its preceding manifest hash; never wipe course progress, account awards, Guardian state, inventory or Sanctuary saves.
- **Remaining:** verify all 12 lessons against source uploads and teach-back fidelity, check incorrect answer and reroll buttons in an actual browser, confirm end-to-end learning/misconception continuity.


## 2026-10-15 — Visual effects first safe implementation
- **New visual-only owner:** `current-site/animation-effects.js` and `animation-effects.css`, with one noninteractive overlay, automatic removal, viewport-responsive sizing, reduced-motion fallback, no persistence or reward mutation. Public API `MajickAnimationEffects.play(type)` and `majick:celebrate` event. Effect types: success, mastery, lesson, course, guardian, reward, egg, match, sanctuary. Unwired types are available for future integration but **do not fire by themselves**.
- **New individual SVG assets:** `assets/effects/celebrations/celebration-starburst.svg`, `celebration-constellation-ring.svg`, `assets/effects/guardians/guardian-heart-sigil.svg`. These scale without large GIF/video downloads. Other proposed WebP/PNG assets not created yet; do not claim the full 28-asset pack is complete.
- **Existing integration:** `current-site/index.html` loads the CSS and owner before probability workshop; `current-site/probability-workshop.js` triggers success, transfer and structured teaching effects **after** existing valid checks. No duplicate grading, XP owner, save engine or guardian owner.
- **Manifest:** SHA-256 records updated for all seven new/changed canonical files in `current-site/source-manifest.json`. Related commit `b4762e5c`.
- **Tests:** GitHub PR review matrix and canonical release checks must run on this exact head before deployment; check animations do not block buttons, alter focus, break pointer-up tests or change persistent data. Reduced-motion and cleanup should be exercised. Do not infer completion merely from file creation.
- **Rollback:** Remove only animation CSS/JS includes in `index.html` and the cosmetic call from `probability-workshop.js`, then restore both manifest hashes. Assets can stay inert. Do not clear XP, crystals, progress, Guardians, eggs, furniture, inventory or Sanctuary.


## 2026-10-15 — Distinct lesson, course, and Guardian celebrations
- **New individual assets:** `current-site/assets/effects/celebrations/lesson-complete-seal.svg` (illuminated open-book seal), `course-complete-sigil.svg` (large constellation hexagon and check), plus the existing Guardian heart sigil. SVG assets are static/scalable; CSS supplies motion without heavyweight animation libraries.
- **Expanded single effects owner:** `current-site/animation-effects.js` and `.css` add per-type effects/particle choreography, a replay throttle, automatic cleanup, smaller phone visuals and reduced-motion particle suppression. The effects module does not write any academic, XP, currency, Guardian or Sanctuary state.
- **Verified event ownership:** `current-site/guardian-core.js` calls existing cosmetic API after an actual successful `majickCareAction` (`r.ok`); its existing DOM completion observer requests `lesson` only for `.d755Stage.complete`, `course` only for `.v3316PassOverlay`, and `mastery` only for `.v3338CheckpointResult.ready`. General `.conceptComplete` does NOT claim a whole lesson complete. Existing study Guardian reaction/account mutations remain in their original owner.
- **Tests added:** `pages-release/current/test-animation-effects.cjs` executes isolated controller checks at 1366, 820 and 390 widths, including static asset availability, one active overlay, particle counts, auto-cleanup, replay suppression, pointer-events-none CSS and reduced motion. `.github/workflows/commons-review.yml` runs it in each matrix job. Existing full visual/browser checks remain intact.
- **Manifest:** updated `current-site/source-manifest.json` integrity hashes for five changed/new canonical files. Commit `05c73b49`. The current branch remains review-only until all GitHub CI checks, actual browser interaction suites, and screenshot review pass.
- **Recovery:** if any overlay interferes, remove the two animation stylesheet/script includes from `index.html`, and delete only cosmetic `MajickAnimationEffects?.play` hooks from `guardian-core.js` and `probability-workshop.js`; restore matching canonical manifest hashes. Keep all learner saves/XP/crystals/Guardians/eggs/inventory/Sanctuary untouched. If effects duplicate, inspect the 700ms replay guard and source completion-node observer rather than touching the reward system.
- **Unfinished:** Browser confirmation on newest commit; independent review of completion-trigger semantics at all course ends; richer egg/hatch, inventory and Sanctuary event wiring; additional requested illustrations.

- **Actual rendered browser coverage added:** `pages-release/current/browser-commons.cjs` commit `3e2f601d` now mounts a real course sigil at each viewport (1366, 820, 390) and asserts one noninteractive overlay, 22 actual particles, visible dimensions, zero academic-progress mutation, and reduced-motion Guardian effect containing no particles. It cleans each visual before continuing Commons checks. The latest commit must pass CI before calling this complete.


## 2026-10-15 — Phase 1 browser release-gate continuation
- Reviewed workflow [38829093924](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38829093924): 820px and 390px jobs passed; desktop screenshot/Commons review still running when checked. This is not a complete green release gate.
- Updated `pages-release/current/browser-probability.cjs` in commit `74f45a92`. The last documented probability failure was a real Next button whose center point left the hittable viewport during delayed campus rendering. The browser helper now scrolls the **actual** control to center on each hit-check, verifies viewport bounds and `elementFromPoint`, then uses real CDP mouse-down / mouse-up. It retains the intentionally adversarial intervening `MajickProbabilityWorkshop.mount()` calls and unique dataset assertions. No scripted `.click()` substitutes for the user event.
- Does not change grading, question generation, production UI, saved progress, XP, Guardians or Sanctuary state.
- Verification required on commit `74f45a92` or a descendant: canonical checks, full Commons browser matrix and desktop-only probability and interaction suites; inspect screenshot artifacts before merge.
- Recovery: revert only the browser helper change `74f45a92` if it masks a legitimate overlap/scroll issue. Do not weaken task freshness, button hit-test, or state-persistence assertions.


## 2026-10-15 — Publication gate and Back fallback
- **Fix:** `current-site/probability-workshop.js` commit `a7cffdf1` now ensures the visible in-card Back control leaves the probability room if the shared `majickBack()` finds no history entry (common after a reload/deep link). Existing history navigation takes priority; home is only the fallback. Academic progress is not modified. Manifest rehashed in commit `d29f068c` (SHA-256 `d1fe0cc6f1de343b4c6110ca7bc16fae985f55664f993160b584e482a02060dc`).
- **Release blocker:** prior review `38829419398` had green tablet/phone jobs but desktop still running at inspection. The **exact final commit** must pass all three responsive jobs, full desktop interactions, probability click/Back/unique-data/misconception/mastery/persistence, canonical hashes/build, and celebration/reduced-motion tests. Do not merge PR #131 or publish until green.
- **Recovery:** revert only Back fallback commit `a7cffdf1` with matching manifest restoration if it navigates somewhere unexpectedly. No save deletion or reset.


## 2026-10-15 — Publication gate recheck and probability Back activation
- **CI evidence:** run [38829726957](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38829726957) completed with green 390px and 820px review jobs, plus successful 1366px Commons screenshot audit and full interaction regression. Desktop-only connected probability still failed waiting for `S.screen!=="games"` after an in-card Back click following reload.
- **Production repair:** `current-site/probability-workshop.js` commit `948ac0a8`: wire physical `pointerup` and standard `click` to one guarded Back action; delegate first to existing history, fall back to Home if still in same room. This preserves keyboard click and avoids double-navigation after a pointer click. No academic/save/Guardian state modified.
- **Manifest:** commit `a57a32db`, workshop SHA-256 `f23e7e5f708e815c580efb446cbd6dc362dfd458ea52dc1716292519fa2dcc45`.
- **Still required:** all three jobs fully green on final head, especially probability Back/unique datasets/repair/transfer/teach-back, before merging and publishing. Do not describe as verified until CI completes.
- **Recovery:** revert `948ac0a8` and its manifest hash if Back double-navigates; do not clear saved progress, Guardian care, eggs, inventory or Sanctuary.


## 2026-10-15 — Certification reached; reload hydration uncovered
- **CI** [38830421953](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38830421953): 390px and 820px fully green; desktop rendered Commons and entire general interaction suite green. Probability test passed in-card Back, Oracle Lens misconception, focus-safe typing, guided repair, two fresh independent questions, transfer and structured teaching mastery. It then failed waiting for `#connectedProbability` after reloading the completed certified state.
- **Fix** `current-site/probability-workshop.js` commit `65f497d5`: add pageshow mount and root-hydration observer for the probability panel, without duplicating a renderer, altering saved state or writing rewards. Canonical manifest SHA-256 `f7447896e7b354050522b21b63bd836ebe5305a26a8090d1391de62e4abf6fd0` updated in commit `1f2f5a47`.
- **Regression compatibility** `pages-release/current/browser-probability.cjs` commit `3a70719b` updates the generated-lab follow-up step to the new `data-lab-guided` and `data-lab-field` controls already shipped by Phase 2; the wrong answer and cross-screen recommendation assertions are retained.
- **Gate** still strictly requires a new all-green full matrix on the exact commit, including post-certification reload, course isolation, saved rewards, misconception reopening and responsive fitting. Not yet merged/published.
- **Recovery** revert `65f497d5` and corresponding manifest change if it causes excess mounts; the previous guard retains controls while the page is unchanged. Never delete save files, XP, crystals, Guardians, eggs, furniture or Sanctuary state.
