# Phase 2 probability milestone — V3.4.2

This is the first end-to-end slice of Phase 2, not completion of the whole phase. It covers conditional probability for two draws without replacement. Mean, median, ratio/proportion, graph interpretation and box plots remain the next priorities; their existing implementations are retained.

## Existing owners and extension

- `learning-continuity.js` owns course-scoped learning needs, adaptive attempts and mastery status. The new probability evidence lives in the existing `S.progress.D772.adaptiveSkills['d772-s3-l2-1'].connectedProbability` record. No learner history is reset or migrated away.
- `generated-question-engine.js` owns mathematical questions and SVGs. `probabilityCase` adds 42 distinct counter datasets and a different-event classroom-role transfer. Datasets observed in native generated misses are also excluded from follow-up tasks. Exhaustion stops generation rather than silently recycling data.
- `probability-workshop.js` is one UI adapter displayed in Learn Lab, Study Now and Game Realm. It uses those existing owners and `MajickStudyProgress.creditAnswer`; it has no separate reward or course-state engine.
- `wgu-practice.js` reports submitted assessment answers as well as assisted practice to the shared tracker, once per response. Assisted practice is tagged assisted. `game-realm.js` tags its clue-supported game answers assisted; the new no-hint transfer has separate objectively checked evidence.
- `app-runtime.js` mounts the adapter through its existing render path. `index.html` loads it. `readability-guard.css` supplies explicit readable surfaces, keyboard focus and responsive fields.

## Demonstrate the flow

Build and serve the canonical source using the commands below, select D772, and open **Connected Learning · Probability** in any of the three environments. An incorrect without-replacement answer in native Oracle Lens, native Study Now, or the Learn Lab generated workshop also creates a recommendation that follows the learner between environments.

1. **Learn Lab — Repair with counters:** remove one green counter, recount favorable and total outcomes, enter both conditional fractions and their product. The worked calculation is visible. This records guided repair with zero independent mastery credit.
2. **Study Now — Independent OA reasoning:** solve two fresh datasets without hints. Enter both conditional counts, the product and a justified rule selection. Save calculation/interpretation in the whiteboard. Drafts survive navigation and reload. Numeric checks accept equivalent fractions.
3. **Game Realm — Classroom role transfer:** solve a new reader-then-recorder scenario. Unlike two green draws, the second favorable count stays unchanged while the total falls. This tests a changed event and context, not just an identical prompt with new numbers.
4. **Learn Lab — Teacher application:** diagnose a student's unchanged-sample-space error, select a physical correction model, solve a fresh case, and select an exit question that checks transfer. Save a classroom explanation separately.

Repair, independent reasoning, transfer and structured teaching are separate evidence categories. Certification requires all four, including two independent reasoning responses after the latest repair. A later relevant error revokes current certification until repair and fresh evidence are completed. A failed task cannot be retried for independent credit using a revealed answer; the next task has a fresh dataset. Completed responses cannot replay rewards.

Automatic teaching assessment covers the chosen diagnosis, model, numerical solution and diagnostic probe. Free-text teaching and whiteboard prose are saved for human/self-review, not semantically graded; this does not certify unrestricted classroom teaching ability. The example is original simulated OA-style practice, not official WGU questions.

## Verification

From `/workspace/majick-studies-assets`:

```sh
node pages-release/current/release-checks.cjs current-site
python3 pages-release/current/build.py current-site /workspace/majick-dev/phase2-final
node pages-release/current/browser-interactions.cjs /workspace/majick-dev/phase2-final
node pages-release/current/browser-probability.cjs /workspace/majick-dev/phase2-final
python3 -m http.server 8001 --bind 127.0.0.1 --directory /workspace/majick-dev/phase2-final
```

Final local build: `ab702a34384ff656`. The nine grouped release checks, source-integrity/syntax build, existing browser gate, and new complete probability browser gate all passed (exit 0). The latter uses physical mouse events for the connected stage controls.

The browser test uses an isolated temporary Chrome profile and its own HTTP server. It clicks a native Oracle Lens wrong answer, traverses the complete four-stage flow, checks whiteboard and certification reload persistence, verifies duplicate reward prevention, then checks native Study Now and Learn Lab misses propagate recommendations. It seeds separate D755/D756 histories and compares their academic records, existing D772 history, Guardian identities and Sanctuary placement. XP, crystals and chests are intentionally global getters in `majick-state-core.js`; they are checked as shared balances, not isolated academics. Phone layout is checked at 390px. The established browser suite separately checks core learner/world JSON equivalence after reload.

The source manifest updates hashes for `app-runtime.js`, `game-realm.js`, `generated-question-engine.js`, `index.html`, `learning-continuity.js`, `readability-guard.css`, `wgu-practice.js`, and new `probability-workshop.js`. Protected motion hashes remain unchanged. Release checks cover all 42 datasets in both event forms, guarded evidence ordering, course isolation, replay safety, rejection of prose-only teaching claims, exhaustion, and renewed misconceptions.

The new browser gate is registered in `.github/workflows/deploy-majick-pages.yml`, before Pages deployment. Review branch: `phase2-connected-probability`, based on `984430497cc09558b0d03296b13e82d1dbdb32be`. This branch preserves the complete verified milestone, including the prerequisite readability repairs needed by the unchanged browser contrast assertions. No workflow dispatch, merge, or deployment is authorized or performed. Commit and PR references are reported separately after publication of the branch.

## Recovery and remaining scope

Before any deployment or learner migration, export the existing save through Progress Safety. No save schema or key is replaced by this change.

- If the panel is absent, verify D772 is selected, inspect `probability-workshop.js` loading, and rebuild current source. Check browser console and release manifest rather than clearing localStorage or IndexedDB.
- If mastery appears premature, inspect the four evidence categories under the existing D772 adaptive skill. Guided evidence must have `assisted: true`; independent/transfer/teaching must be distinct fresh tasks. Retain the evidence and correct the rubric separately; do not erase history to make checks pass.
- If rewards appear twice, inspect `S.majickAccount.studyProgressBridge.events` for `connected:D772:<task-id>` and the reward ledger. Do not manually add balances or replay completed events.
- To roll back code, reverse only the Phase 2 changes: remove the adapter load/mount hook and new adapter, restore the Phase 2 hunks in continuity, generation, native tracking, CSS, tests and CI, and restore the corresponding manifest hashes. Preserve the earlier contrast repair. Rebuild and rerun the established gates. Keep the additive `connectedProbability` save data; older code can ignore it. Do not reset courses, account rewards, Guardians, eggs, inventory or Sanctuary.
- Existing academic coverage gaps remain reported separately. The remaining parchment warning samples are now certified against rendered pixels as described below. Cloud sync, live deployment, and general human assessment of teaching prose have not been verified.

Next milestone: extend this verified shared flow to the requested mean, median, ratio/proportion, graph interpretation and box-plot skills, with their own misconception rubrics and browser demonstrations.

## Files changed in this milestone

- Runtime: `current-site/app-runtime.js`, `current-site/game-realm.js`, `current-site/generated-question-engine.js`, `current-site/index.html`, `current-site/learning-continuity.js`, `current-site/probability-workshop.js`, `current-site/readability-guard.css`, `current-site/wgu-practice.js`.
- Integrity: `current-site/source-manifest.json`.
- Gates: `pages-release/current/release-checks.cjs`, `pages-release/current/browser-probability.cjs`, `pages-release/current/browser-interactions.cjs`, `pages-release/current/parchment-contrast.cjs`, `.github/workflows/deploy-majick-pages.yml`.
- Reports: `PHASE2_PROBABILITY.md`, `CURRENT_BUILD.md`, `HANDOFF_LATEST.md`.

## Rendered parchment accessibility certification

The previously flagged samples are the mobile and desktop instances of “Calculating correctly but interpreting the statistic incorrectly.” Both were opened and visually inspected in the actual D772 lesson at 390×844 and 1365×900. The text is dark ink (`rgb(62,48,48)`) on the existing light parchment gradient, not on the dark container behind it. The coarse audit had stopped at the container's background color without resolving the opaque gradient painted above it.

Direct measurement of background pixels underneath the text found minimum contrast **8.14:1 mobile** and **8.25:1 desktop**, exceeding WCAG AA's 4.5:1 threshold. No visual styling change was necessary, preserving the approved magical appearance. Screenshots were inspected with both warnings fully visible, after transient overlays and scrolling settled.

`pages-release/current/parchment-contrast.cjs` now adds a mandatory check to the complete `browser-interactions.cjs` run. It opens that exact lesson, brings the warning into view at both sizes, temporarily makes only the text paint transparent, captures the actual gradient/texture/particle background, restores the original inline style, decodes lossless screenshot pixels with Node's built-in zlib, and asserts at least 4.5:1 against every sampled background pixel in the text rectangles. It fails if the target is missing, offscreen, unsampled, transparent, unsupported, or below AA. The original general contrast and save-state assertions remain unchanged. This closes the two manual-review items without waiving or weakening a test.

The updated complete certification includes release checks, canonical integrity/syntax build, the established browser gate plus both rendered parchment assertions, and the full probability browser gate. All browser tests use isolated temporary profiles; no real learner save is imported or modified.
