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
