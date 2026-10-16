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


## 2026-10-15 — Probability room-aware reload verification
- Run [38831001037](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38831001037): 390px/820px fully green; desktop Commons and full interactions green; probability Back, typing, fresh independent questions, transfer and teaching all passed, but its post-certification reload assertion still expected `#connectedProbability` immediately with no navigation. This course-specific panel is only mounted inside `learninglab`, `mission`, or `games`, not on Home.
- Updated `pages-release/current/browser-probability.cjs` in commit `b588ee1e`: after reload, enter the actual D772 learning room, then require the panel, exact serialized saved probability state, certified mastery, disabled-response replay prevention, isolation and mobile fitting. The later return after D755/D756 switching now enters the learning room rather than expecting a Home panel. No production state owner or academic grading changed.
- Must rerun the full release matrix on this commit; do not merge or publish without a green probability regression including the final incorrect-answer remediation.
- Recovery: revert `b588ee1e` if a product requirement establishes that the probability panel must be displayed on Home; otherwise its prior assumption conflicts with the existing room-scoped mount. No learner data reset.


## 2026-10-15 — Production deployment failed and isolated Back pointer race
- **Successful review:** [38831716073](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38831716073) had all three browser jobs green. PR #131 merged to `main` at `1b761e20ca62bcc3ee841be83db8797ae1251989`.
- **Production blocker:** [38832322100](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/38832322100) failed the connected probability regression on `S.screen!=="games"` after physical in-card Back click following reload. The Pages workflow did not publish this commit. Previous push-triggered run `38832300850` was superseded/cancelled.
- **New fix on review branch only:** `current-site/probability-workshop.js` commit `c09d2c67`: Back also handles actual `pointerdown`, which reaches the original control before render-queue remount can detach it between press and release. Pointerup and keyboard click stay wired with a guard against double navigation. No academic state, rewards or Guardian state touched.
- **Manifest:** workshop SHA-256 `7c2f8a5de384dd7b707428f55578c9121fb20c06b4020edfce725f1c1d2b3e52` in commit `7b0b7046`.
- **Release gate:** new review PR and full desktop/tablet/mobile review must pass, then a new main merge must pass the production Pages workflow including connected probability. Do not imply prior main merge means the deployed page changed.
- **Recovery:** revert only `c09d2c67` and the matching manifest hash if physical Back press triggers unwanted navigation; restore without touching learner saves or Sanctuary.


## 2026-10-15 — D772 Phases 2–4C: first cross-room remediation implementation
- Branch: `d772-phases-2-4c-instruction`, isolated from the previously merged/production version.
- `current-site/generated-question-engine.js`: Before the instructional generated workshop, surface existing D772 `MajickLearningContinuity.needs('D772')` for the same lesson, making weak skills visible without adding a duplicate state system. After a fresh independent formative answer, send the result to both existing `record` and `skillResult`, so Learn Lab, Study Now, and Game Realm can recognize the same misconception via course-scoped adaptive skills.
- **Mastery safety:** `skillResult` origin is `generated-lab-independent-formative`, not `independent-transfer`; this is a formative attempt and cannot automatically certify transfer mastery. Existing WGU question sources, correct answers, progress, XP, inventory, Guardians and Sanctuary are unchanged.
- Updated `current-site/source-manifest.json` SHA256: `generated-question-engine.js` = `2a1f9dca7b1880a14be948c923d14f5ce40c561a9e1186fb2443a698d37ecc21`.
- Verification required: full PR review, actual weak-skill remediation in all three rooms, no duplicate achievements, course isolation, fresh dataset accuracy, teacher rubric and persistence. Do not claim Phases 2–4C fully complete.
- Recovery: revert instructional integration and its manifest edit only. Do not reset existing course progress or global rewards.


## 2026-10-15 — D772 lesson reconciliation and reasoning depth follow-up
- **Source reconciliation:** `D772_PHASES_2_TO_4_COVERAGE.md` now records all twelve lesson slots by known source concepts, existing implementation owner, and remaining gaps. This is a taxonomy and provenance reconciliation, **not** an assertion that unseen textbook examples or S3 L4 source material have been fully verified. No original user-provided or WGU-labeled questions were modified.
- **Multi-step OA-style reasoning:** `current-site/generated-question-engine.js` now situates mean, median, box plot/IQR, histogram, scatter association, and probability questions in concrete classroom/study scenarios. Prompts ask for first identifying the relevant data/model and then interpreting the statistical result. The existing SVG plots remain tied to those exact datasets; arithmetic, answer choices and `validate()` remain in their existing owner.
- **Cross-room integration:** Continued from previous commit: formative generated wrong answers are passed into existing `MajickLearningContinuity.skillResult`; a matching existing weakness is surfaced in the workshop without opening another XP or mastery engine.
- **Automated test:** `pages-release/current/test-d772-cross-room.cjs` simulates one lesson weakness recorded in Learn Lab, Study Now and Game Realm, verifies the shared D772 lesson record, false independent certification, `review-needed` after repeated misses, untouched D755/D756 progress, and save-path calls. Added to the three-width Commons CI matrix via `.github/workflows/commons-review.yml`. This unit-style test **does not replace** physical clicks in each screen.
- **Manifest:** updated `generated-question-engine.js` SHA256 to `c4ef0a3a32585140e5d3b73d501d9343129683357fe6eeb6c8f09249257a09b6`.
- **Still required before declaring Phases 2–4C complete:** source-by-source comparison with every uploaded lesson/assessment; specific S3 L4 title/content; extensive new datasets and distractor validation; real browser screen-to-screen wrong/retry/mastery flow; check Guardian/reward/course records after reload; teacher-response quality rubric that checks mathematical meaning, not only length.
- **Recovery:** revert these supplemental prompt/bridge changes plus matching manifest, test and workflow additions. Do not reset progress, XP, Guardians, eggs, inventory or Sanctuary.


## 2026-10-15 — Parallel Phase 5 reliability start
- Scope: duplicate-mount prevention for existing generated D772 workshop, stacked on Phase 2–4C branch to preserve its academic changes. No new reward or learning state owner.
- `current-site/generated-question-engine.js` now leaves a lesson's existing mounted DOM and typed fields untouched when the campus calls `mountLab` again for the same lesson. When the lesson actually changes, it removes only the prior generated workshop and creates the new lesson's workshop. Correctness logic and the learner's persisted academic state are not rewritten.
- `current-site/source-manifest.json` updated SHA256 of the changed engine to `9bfed0d008d3a62672750d3c84f113ad4cc6a61b2372af11ab26fa87e6ca1ded`.
- Parallel Phase 2–4C academic regression tests include cross-room misconception/misclassification and randomized generated-question correctness; these remain required before merge.
- **Verification pending:** desktop/tablet/mobile review, repeated mount with actual typed text, course switch, and source manifest checks. Phase 5 is in progress; Phases 6–8 are not yet scoped as authoritative product requirements.
- **Recovery:** revert this single workshop-mount patch and corresponding manifest entry. Do not clear any progress, XP, Guardian, egg, inventory or Sanctuary saves.


## 2026-10-15 — Compact Home tabs and page navigation, plus retry controls
- **User report:** Home had become an endlessly scrolling stack, with sections apparently escaping/reordering despite the existing Commons tabs. Study Now and other rooms were difficult to navigate without scrolling.
- **Root repair:** `current-site/collegium-commons.js` now records `data-commons-owner` on each moved Home feature and respects that stable owner on later layout passes. Dynamic text like “Guardian,” “Review” or “Sanctuary” can no longer reclassify an already placed feature. Existing tab rendering, source DOM nodes, and saved selection remain the single Home owner; no duplicate renderer.
- **Compact visual:** `current-site/collegium-commons.css` reduces Home welcome height, makes the five Home tabs sticky and horizontally scrollable on phones, and keeps inactive Home panels hidden.
- **Other rooms:** New `current-site/room-section-nav.js` and `.css` provide a lightweight sticky “On this page” quick-jump index for eligible long screens. It intentionally does **not** move, replace or hide academic forms; this is navigation improvement, not blanket pagination of every screen.
- **Retry controls:** `solution-engine.js` now offers Clear Answer and Resubmit on wrong steps; `your-turn-practice.js` offers scoped clear/resubmit; `inline-lesson-practice.js` labels its existing reset as Clear Answers; `probability-workshop.js` can clear an unsubmitted draft while already submitted evidence still needs a new fresh challenge. Independent transfer with a wrong attempt is marked assisted for bonus purposes. Existing state and reward engines remain authoritative.
- **Load and integrity:** `current-site/index.html` loads the room-nav module; `source-manifest.json` hashes all changed/new production files.
- **Checks:** `pages-release/current/test-compact-navigation.cjs` static safety checks and `test-practice-retry-controls.cjs` are required in responsive CI. Real screenshots and real click/retry/reload checks at 390px, 820px, 1366px must still pass; no publish on pending/red CI.
- **Still open:** All-screen true pagination (as opposed to safe quick-jump), short-page IA design for each room, real user acceptance of collapsed content, and any broken control observed during Phase 5 browser review. Do not describe this partial work as complete app-wide pagination.
- **Rollback:** Revert Commons ownership/classification, room-nav stylesheet/script includes/module, retry-control changes and their matching manifest SHA256 in a dedicated revert. Do not delete course histories, XP, Guardians, eggs, inventory or Sanctuary saves.


## 2026-10-15 — Atmosphere polish without any version rollback
- User clarified previous visual references are **guides**, never instructions to revert Home or learning rooms to an older version.
- Inspected current `main` history and existing five-tab Commons owner. Kept all existing Home tabs, DOM placement, student records, Guardian care, Sanctuary links, Learn Lab, and Study Now renderers.
- `current-site/collegium-commons.css`: added static celestial gold/plum lounge framing, compact greeting, academic-first spacing, tighter portal and expandable shelves; never moves, removes, or animates student content.
- `current-site/learning-lab.css`: tightened oversized header/cards, made original lesson tabs horizontally usable on mobile, improved dark-panel text and focus rings; no new lesson renderer.
- `current-site/collegium-immersion.css`: brought Study Now typography and static candle-gold ambiance into agreement with Commons; ensured visible focus indicators and responsive control containment. No moving scene behind study text.
- SHA256 for three changed CSS files updated in `current-site/source-manifest.json`. No learner saves/progress, XP, Guardian, egg, inventory or Sanctuary state changed.
- **Verification outstanding:** 390/820/1366 browser screenshots, actual WCAG contrast on gradients, tab/keyboard/lesson/retry behavior. Earlier review run covers prior head only; newest CSS requires rerun and green status.
- **Repair:** adjust the final additive CSS rules if a layout/contrast failure is observed. **Do not restore old layouts or reset any learner records.** If necessary, revert only these latest additive style blocks with their matching manifest entries, leaving all feature owners and newer screen content in place.

## 2026-10-15 — Sparse ambient motion (no rollback, no second engine)
- Current Home decorative moon circle and star ornament receive slow CSS opacity/brightness variation, cycling at 18 and 23 seconds. Learn Lab and Study Now decorative pseudo-elements receive sparse static-position opacity variation at 28 and 34 seconds. Study text and backgrounds remain stationary; decorations capture no clicks. No GIF, new renderer, JavaScript interval, or second animation owner.
- Files: `current-site/collegium-commons.css`, `current-site/collegium-immersion.css`, updated `current-site/source-manifest.json`. Existing `animation-effects.js` remains the sole event-effect controller. All motion is disabled by `prefers-reduced-motion: reduce`.
- Required verification: canonical release SHA checks, actual 1366/820/390 screen rendering and readability/contrast, and focus/click preservation. PR review is required before merging; production deployment is not inferred from commits.
- Repair: adjust or remove only the appended keyframes/pseudo-element animation rules and update their hashes if CSS overlay impacts readability or performance. Do not restore old Home/Lab layouts and do not touch learner data.

## 2026-10-15 — Four-priority continuation and actual mobile contrast repair
- Kept Home organization, Learn Lab interactions, shared misconception evidence and Guardian/Sanctuary persistence as four active priorities, without making a second owner or restoring an old layout.
- Examined real CI `38840194474`: 820px passed, 390px failed the Commons rendered contrast audit. The measured Commons eyebrow was 4.20–4.27:1 in each tab, below the 4.5:1 normal-text gate. Its background is the existing moonlit plum gradient.
- **Actual repair:** `current-site/collegium-commons.css` now sets the eyebrow to higher-luminance `#fff4dc` rather than `#efd29e`. No layout, controls or learning state touched. The exact changed source hash was updated in `current-site/source-manifest.json` to `1df0af1ff055ee7e0c48c0dbff1346ceba43f879f2535883cf33a85018d4cf2a`.
- **Verification:** queued new 390/820/1366 Commons review on exact corrected commit, including pixel-based WCAG contrast. Do not relax contrast assertions or merge before green.
- **Rollback/repair:** if text is still too pale against a lighter gradient sample, increase foreground luminance further or darken the header gradient only. Recalculate corresponding manifest hash. Do not revert to an earlier UI, delete Home tabs, or clear learner records.

## 2026-10-16 — Hands-on Learn Lab numeric ordering and safe error recovery
- Reused the existing `MajickGeneratedPractice.mountLab` and `MajickLearningContinuity` owners. No new Guardian, Sanctuary, XP, or academic engine and no change to the five-tab Commons.
- `current-site/generated-question-engine.js`: Added an interactive ordered-data exercise for median and box-plot lessons. Every actual observation is an independently clickable tile, so duplicate values remain distinct. Students select smallest-to-largest, receive feedback, clear their selection, and retry the **same dataset**. Incorrect guided selections are tracked as assisted practice, not independent mastery.
- After an incorrect fresh independent formative response, added `Repair this skill with guided steps` to return focus to the existing worked example and guided controls. The incorrect attempt remains recorded and the existing `Generate a different independent problem` control supplies a new problem. Assisted repair does not certify mastery or award duplicate rewards.
- `pages-release/current/test-d772-hands-on.cjs` checks exercise and recovery contracts, syntax and 150 generated math cases. Added it to `.github/workflows/commons-review.yml`. **Outstanding:** actual browser clicks, sorting with duplicates, repeated mounts, fresh-data checks, wrong→repair→new problem, save/reload, course switches and Guardian/Sanctuary regression.
- `current-site/source-manifest.json` records the changed engine hash `117bb85df146db836048ae6830759ae29391197837506fc7b11dd1358b6b20a1`.
- **Recovery:** Correct any wrong instructional feedback or layout in the current controls. To isolate a regression, revert only this exercise and repair-link addition, along with its manifest entry, test and workflow step; do not roll back an older layout or delete student data.
- This is an initial interactive median/box-plot slice; it is **not** certification that every D772 lesson or all cross-room misconception transfers work end-to-end.

## 2026-10-16 — Real Chromium recovery, save/reload and isolation certification
- Reused the existing `pages-release/current/browser-commons.cjs` Chrome DevTools Protocol browser session rather than adding a browser engine or duplicate instructional renderer.
- Added `pages-release/current/browser-hands-on-recovery.cjs` and invoked it from the existing 1366px Commons browser audit (390/820 still run their existing full Commons audits). The test physically creates the real `MajickGeneratedPractice.mountLab` DOM, submits a wrong answer, confirms feedback and existing `MajickLearningContinuity` weakness/attempt tracking, clicks the guided-repair action, clicks/clears a sortable data tile, creates a fresh independent problem with different plotted SVG, and checks correction did not certify mastery.
- Confirms the unrelated `D756` progress, account/Guardian and legacy Sanctuary records are unchanged after D772 activity and a course switch, then reloads the real Chromium page and asserts the error and skill need remain saved with no false mastery. All of these operations use current app owners; no new XP/Guardian/Sanctuary systems were introduced.
- This targeted browser path is additive. The wider 390/820/1366 Home audit, full interactions, probability regression and actual publication gate remain required.
- If a test is blocked, identify the exact failed interaction with the emitted browser assertion, keep the app usable for manual verification and continue other instructional work without silently weakening the test.
- Recovery: revert only `pages-release/current/browser-hands-on-recovery.cjs` and its invocation in `browser-commons.cjs` if the *test implementation* is incorrect. Fix actual app failures at their existing owner, and never clear real learner progress.

## 2026-10-16 — Phase 5 closure gate and Phase 6 initial visual feedback
- Phase 5 has a green 390/820/1366 browser review at commit `c50dacb7e545d426d82eb2e75a3708421ec6f517`; subsequent browser-recovery additions and current latest source still require their own green checks. Therefore Phase 5 **cannot yet be certified closed**.
- Phase 6 **started**, not completed: `current-site/generated-question-engine.js` calls the existing `MajickAnimationEffects.play('success')` only after verifying a completely correct ordered dataset. The visual event is limited to one occurrence per physical lesson activity using the activity's DOM dataset marker. It awards **no XP**, creates no state owner, and never runs on wrong/cleared attempts.
- Existing animation owner supports reduced motion and nonblocking overlay; no new animation system is created. `pages-release/current/test-d772-hands-on.cjs` now asserts one-shot usage of that owner. The matching SHA-256 is updated in `current-site/source-manifest.json`: `21475c68a53cb04c77aa34871a2d3aed73d7da9bf20aa796ca73f3111605863b`.
- **Final Phase 5 gate:** latest desktop/tablet/mobile review including real Chromium wrong→repair→fresh task→reload, responsive Commons and independent probability tests all green; saved cross-course state unchanged; no duplicate rewards or browser input loss. This is a factual gate, not waived by partial green results.
- **Recovery:** If success visuals distract or test fails, correct or disable only this one new `play` call in the workshop, update canonical hash, and leave all existing Home, rooms, academic/Guardian/Sanctuary state untouched. Keep older versions as design reference only; never restore their layouts.

## 2026-10-16 — Phase 5 release gate and Phase 6 guardian/sanctuary visuals
- Latest pre-Phase-6 review `38889250943` reached successful 390px/820px reviews while desktop review was still running at check time; full Phase 5 closure must await desktop and any newest exact-commit regression. Do not claim Phase 5 complete or live deployment from partial checks.
- Phase 6: `current-site/guardian-care-economy.js` now requests the existing `MajickAnimationEffects.play('guardian')` after a **successful** Feed/Water/Treat/Groom/Play/Affection action. Existing `performAction`, toast, save and bond rules remain the only owners; no effect on failed care or costs.
- `current-site/sanctuary/sanctuary-customize.js`: after the existing owned-furniture placement is committed, requests `MajickAnimationEffects.play('sanctuary')` as a visual-only celebration (only if the existing effect API is visible from that window); storage/removal does not celebrate. Does not duplicate furniture, save or inventory engines.
- Added `pages-release/current/test-phase6-owner.cjs` and wired into `.github/workflows/commons-review.yml` for all widths. It validates parseability, distinct existing animation assets, guarded triggers, ordering of state commit and visual call, and lack of animation-owned progress. This is a static contract test, not yet certification of real Guardian/Sanctuary interactions.
- Canonical hashes updated in `current-site/source-manifest.json`: guardian-care-economy.js `709e7fbfa62517334edef37e381724e9e4f6b5ac3f8f0dc28daf9701a5b32fde`; sanctuary/sanctuary-customize.js `78f927da4de3bc379e6ce635bed0cabcee3dfc68fd6e6c37eef65e071156be0f`.
- Recovery: adjust or revert only guarded visual calls and corresponding hashes. Never undo care/inventory state logic, change ownership, restore old layouts, or reset learner records. Verify live deployment separately after release gate.

## 2026-10-16 — Release-blocking production-only Commons paragraph contrast
- After PR #133 and #134 passed responsive PR CI and were merged into main (`8877d82b2ed56994f367fb0fb7d8f1eb3d1c7108`), production Pages workflow `38890775565` failed **before deployment**, at the sequential full-width Commons rendered contrast test. The 820px Sanctuary tab measured the existing welcome paragraph against a lighter background pixel `rgb(144,116,97)`; text `rgb(255,242,229)` yielded **3.93:1**, below WCAG AA 4.5:1. Do not claim the merge deployed.
- **Repair:** the existing welcome paragraph's deep-plum reading surface changes from intrinsic `display:table` layout to a full-width `display:block!important;width:100%!important` background, so all wrapped line boxes remain on dark ink rather than crossing the ornamental gradient. No renderer, academic, Guardian or Sanctuary storage logic is changed.
- `current-site/collegium-commons.css` hash updated in `current-site/source-manifest.json` to `8fe3ba727dd1734a02130bf2fdde4e8644fbdd7e7a944ba5d84cb7dab2922739`.
- **Verification needed:** existing 390/820/1366 PR browser suite must pass, then production Pages workflow must pass every interaction, probability, contrast, artifact and live-version step for the new exact commit.
- **Recovery:** adjust only paragraph background coverage/contrast and regenerate the corresponding canonical manifest hash. Keep current tabs, source records, rewards, motion, Guardian state, eggs, and Sanctuary unchanged. Do not restore older UI versions or relax contrast acceptance criteria.
