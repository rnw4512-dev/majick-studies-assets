# Majick Studies V3.4.2 — proposed Phases 6–8 scope
Status: **Proposed for approval, not previously locked or certified.** Phase 2–4C instructional verification and Phase 5 reliability remain active in their separate PRs.

## Phase 6 — Magical experience and reward presentation
Goal: richer **visual-only** lesson, course, Guardian, egg, match and Sanctuary celebrations, and interactive feedback without duplicating reward ownership.

Acceptance:
- One `animation-effects.js` owner, no course/XP/Guardian/egg/inventory mutation, no competing animation managers.
- Unique SVG/WebP assets registered with canonical hashes, confirmed loaded or gracefully degraded; no GIF/video performance dependency.
- Real valid completion triggers; no effects firing merely because content rerendered; no replayed rewards.
- Mobile 390px / tablet 820px / desktop 1366px screenshots; `pointer-events:none`, finite duration, reduced-motion equivalent.
- Each effect appears only after a verified underlying event and cleanup leaves the same active controls and saved progress intact.

## Phase 7 — Readability, accessibility and navigation across the entire campus
Goal: every student-facing screen is legible, navigable and usable during mistakes and retries.

Acceptance:
- WCAG AA actual rendered contrast (including gradients, selected, focus, disabled states) across all screens, not just Commons.
- Keyboard/focus and touch testing on all interactive controls; no decorations covering hit targets; accessible labels and status messages.
- Clear Answer / Resubmit consistency audit across *every* practice owner; preserve current scenario, allow wrong-answer correction and avoid duplicate mastery/rewards.
- Course switching, Back/Home, page reload, and delayed mounting never lose draft input or escape content below tabs.
- Verify responsive screenshots at 390px, 820px, and 1366px, with reduced motion and narrow-height cases.

## Phase 8 — Release certification, persistence and course scalability
Goal: verified, recoverable published builds and safe course expansion.

Acceptance:
- Reconcile every uploaded lesson, example, quiz, misconception and explanation to a single course-scoped source record; preserve provenance and prevent duplicate imports.
- For D772 and D756, verify academic records and weak skills remain course-specific while global identity, Guardians, XP, inventory and Sanctuary remain shared without duplication.
- Physical browser end-to-end: correct/wrong/clear/resubmit/hint/feedback/retry/advance/fresh question, progress/reward count, reload and course switching; validate data/plot/rationale consistency.
- Canonical source manifest and build checks; full CI responsive browser suite plus Pages deploy workflow all green **on the exact published commit**.
- Confirm live GitHub Pages URL loads current build, previous cache versions do not override it, and backups/restore are available. Publish only after gates pass.

## Change management
Phases 6–8 are **recommendations requiring user confirmation**, not retroactively approved feature definitions. Phase 5 is the active safe reliability slice. Stacked branches are kept off production until all required tests pass.

## Current Phase 5 implementation
`solution-engine.js`: Clear current step / Resubmit after a miss; do not erase earlier verification. `your-turn-practice.js`: Clear the current calculation/ordered response and resubmit. `inline-lesson-practice.js`: Clear answers and use the existing check handler for resubmission. `probability-workshop.js`: Clear an unsubmitted draft; already graded attempts remain locked and use the existing fresh challenge path. All retain existing reward/mastery owners.
