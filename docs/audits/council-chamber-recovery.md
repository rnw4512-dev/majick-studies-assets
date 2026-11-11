# Council Chamber recovery — package A

Baseline main and deployed commit: `31be7d10f31ebb71b66a2055ef0246d228aac9ce`; baseline live build `f2091057235fc98c`. Restorable local branch: `recovery/aetheria-pre-council-20261111`. Read-only source/storage inventory was made from the immutable canonical baseline copy, not a modified application. It contains 2,012 literal references and 64 storage operations; dynamically assembled artwork remains subject to the Sanctuary runtime audit.

## Implementation and ownership

- Extends `d756-task2-meeting.js`; no second simulation engine or wallet. `d756-hands-on.js` owns the single Council launch button and all pre-existing lesson/quiz tabs.
- Five presentation phases wrap the existing twelve-item professional agenda. Angela's supplied facts and three measurable Task 1 goals remain intact; Maya and Jordan retain their distinct fictional cases. No independent-living requirement was added.
- Meeting Compass separately tracks invitations and clarification checks, direct engagement, actual-statement listening, goal measurement, education/employment, timing and closure. Indicators remain explicitly provisional rules, not validated professional assessment.
- Parent financial concerns are disclosed through an invitation about the student's future. Differing views may remain when acknowledged, student voice is respected, and an options-review/follow-up plan is recorded. The engine does not require guaranteed agreement.
- Guided Pause-and-Repair pauses the active clock, preserves original turns, adds labeled coached evidence, and resumes the same exchange. An assisted-only meeting earns zero completion XP. No rehearsal grants academic mastery.
- Independent rehearsal and Final Council Trial have no pause or coaching controls and no submitted-turn editing. Closing/leaving interrupts and archives the trial with zero completion XP; guided meetings can resume after reload.
- Replay Chamber selects two or three recorded difficult exchanges and uses fresh variants. Its own practice records are saved under the existing Task 2 prefix; original attempt/history, first-award key, wallet and mastery evidence remain unchanged.
- Cosmetic badges derive from meeting evidence and add no reward event or XP.
- `?room=council` selects D756 and opens the existing Studio/Council room. It never resets course progress.

## Persistence and recovery

Existing save key `majick-d756-task2-rehearsal-v1`, history key and reward-core keys remain authoritative and unchanged. New optional fields include `assisted`, `responseTo`, `contextMatch`, `financialDiscovered`, `concernStatus`, `interrupted`, and `repair`; old records are preserved. Replay is isolated at the same prefix plus `-replay`. Independent in-progress saves from older versions remain viewable but do not resume as uninterrupted trial evidence.

Rollback the package A integration commit and publish through `deploy-majick-pages.yml`; retain all learner storage and reward ledgers. No Guardian, egg, potion, XP, wardrobe or course save is deleted.

## Evidence and limits

Before/after screenshots and baseline runtime results are in `docs/audits/evidence/council-recovery/`. The browser suite covers scenario/mode/viewport launch combinations, full meetings, short participant questions, hidden concern discovery, disagreement with follow-up, first/repeat/day rewards, saved guided drafts, interrupted trials, immutable two-exchange replay, and assisted-only zero rewards. Duration/calendar checks use a virtual clock in fresh test contexts, not the user's browser account.

Baseline alchemy reproduced duplicate same-key conjuring and consumption of all five potions outside learning; package B repairs these separately. Baseline Pixi initialized and its reported roster matched in the observed scene; this does not certify every active iframe selector, wardrobe or animation. Package C retains the Phaser fallback and investigates independently.

Exact approved Task 1 support wording remains unverified against its source document; the supplied goals and existing support approach are preserved. No live AI backend or paid dependency is introduced.
