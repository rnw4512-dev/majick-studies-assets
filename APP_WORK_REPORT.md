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
