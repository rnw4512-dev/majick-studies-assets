# Majick Studies — Master Working Project Board

Updated: 2026-10-21. Reconciled with PR #145 development board; preserve PR #141 historical details. Canonical source: `current-site/`. Live: https://rnw4512-dev.github.io/majick-studies-assets/

**Vision:** An adult dark-academia witchy college where the learner adds real courses and studies through an integrated game world. Academic mastery remains course-specific; Scholar identity, avatar, Guardians, crystals, rewards, eggs and Sanctuary persist globally.

**Status contract:** Existing ≠ tested; committed ≠ merged; passing CI ≠ visual certification; merged ≠ live deployment. Update this board after each development change. No automatic background updater is configured.

## Canonical Source of Truth

| Concern | Existing owner / asset source | Protect |
|---|---|---|
| Release | `current-site/`, `current-site/source-manifest.json`, `pages-release/current/`, Pages workflow | Rehash changed/new files, certify before publishing |
| Courses and mastery | Existing Learn Mode / study-progress bridge / learning continuity | No cross-course mastery, no assisted mastery |
| Histogram workshop | `current-site/solution-engine.js` | Same scenario/dataset visible at all steps |
| Scholar identity | `current-site/enchanted-atelier.js` and `current-site/scholar-companion.js` | One saved avatar, same appearance across rooms |
| Scholar art | `current-site/assets/atelier/avatars/`, `current-site/assets/atelier/v2/fitted/` | Transparent registered layers; head/neck/feet anchors |
| Guardian identity | `guardian-registry.js`, `assets/familiars/canon/`, `assets/familiars/evolution_stages/` | Ten canonical appearances, five established stages |
| Sanctuary animation | Existing Phaser Sanctuary roster and runtime | Protect all 33 original movement PNGs; no duplicate owner |
| Rewards | `reward-core.js`, existing art/collections | One ledger, one currency balance, one item inventory |
| UX | Existing Collegium Commons and its tab renderer | 390/820/1366px contrast/navigation/persistence gates |

## Done

- Four original Guardian identities, protected 33 motion PNGs; ten canonical Guardian portraits and five portrait stages each exist.
- Scholar appearance and single companion system, wardrobe layers, existing six hairstyle categories and robe variants exist in source.
- Existing crystal earning, reward ledger, potion recipes, Guardian accessories, Sanctuary furniture and many reward images exist.
- Existing course/learning/quiz/game systems, compact Home work and verified academic events exist, but not all are fully certified.
- Repository review: prior developer branch PR #138 (Guardian stage-safe selector) CI passed; PR #139 (Scholar hair fit, companion reactions, six potion/crystal SVGs) CI passed. Both remain drafts, not deployed.

## In Progress

- [PR #145](https://github.com/rnw4512-dev/majick-studies-assets/pull/145) — draft probability progression, Commons keyboard/contrast repairs, verified three-width browser review #39667511859. **Not merged or deployed**.
- [PR #144](https://github.com/rnw4512-dev/majick-studies-assets/pull/144) — Guardian/Scholar integration and strict certification workflows proposed; asset/movement gates require separate verification.


| Item | PR | Verified state |
|---|---|---|
| Phase 7 graduated magical atmosphere | [#137](https://github.com/rnw4512-dev/majick-studies-assets/pull/137) | Draft; latest 390 success, 820 Commons fail, 1366 probability fail |
| Six additional Guardians stage-safe selector | [#138](https://github.com/rnw4512-dev/majick-studies-assets/pull/138) | Draft; latest full workflow succeeded; action art still missing |
| Hair fit and shared Scholar presence | [#139](https://github.com/rnw4512-dev/majick-studies-assets/pull/139) | Draft; latest workflow succeeded; visual hair fit still needs review |
| Histogram real datasets/scenario | [#140](https://github.com/rnw4512-dev/majick-studies-assets/pull/140) | Draft; desktop/tablet passed, mobile 390 Commons keyboard focus failed |
| Stable transparent Scholar starter kit | This board's Sprint 1–2 | Inventory known; fit templates, metadata and pose certification pending |

## Broken

- Histogram workshop previously displayed step controls with no actual dataset; PR #140 repairs content but latest mobile release gate failed.
- Fresh independent probability question reported non-advancing in real user session despite prior CI/publishing; must reproduce with saved-state and browser click trace.
- Hair misalignment in actual avatar; PR #139 adds adjustment controls but is not yet visually approved.
- Incomplete action art for Vesper/Briar/Zephyr/Prism/Rook/Solara; do not mislabel static portraits as sprites.
- Phase 7 and histogram draft workflows have failing review tests (see In Progress).

## Needs Assets

**Scholar base asset kit (must be standalone transparent assets and stable registered fit):**
- [ ] Base body layers across skin tone variants — inspect/approve existing warm/deep layers and expand only missing tones
- [ ] Head/face base — inspect existing face and anchor fit
- [ ] Hair starter set — reuse existing locs, braids, curls, afro, twists, waves; QA at forehead/scalp/neck
- [ ] Robe/uniform — reuse existing plum/midnight/emerald/silver layers; certify slot positioning
- [ ] Casual/dorm outfit — make a distinct approved transparent outfit compatible with same body template
- [ ] Accessories — define slots head/hair, ears, neck, wrist, back, hand, footwear with anchor template
- [ ] Pose variants — idle, study, celebrate, walk, seated/desk, Sanctuary visit, reward/crafting, companion interaction

**Companion presence kit:** study, idle, celebrate, thinking, reward/crafting. Same saved appearance, no flattened incompatible pose substitution.

**Starter wearable set:** 3–5 approved hair options, 2–3 robes/outfits, 2 accessories, one magical study prop, one dorm prop. Reuse existing art when valid, derive missing pieces.

**Guardian starter item set:** charm, collar/ribbon, toy, room-linked affinity object. Reuse original item art if present; require transparent standalone dimensions and placements.

**Reward art kit:** existing vault artwork + five potion SVGs and crystal SVG in PR #139; evaluate individual transparency and missing items before any new generation.

## Needs Code Repair

- **Reasoning Workshop mean-validation ([PR #167](https://github.com/rnw4512-dev/majick-studies-assets/pull/167)): repair deployed; browser behavior unverified.** PR merged into `main` (commit `eebd8c45`); publishing workflow [#40093212873](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/40093212873) succeeded. Prior responsive/interaction review failures remain unverified; do not mark browser-certified.

- Audit obsolete copies, duplicate render/credit paths, and all current scripts' loading order.
- Lock an actual layer registry: body/face/hair/outfit/shoes/accessory slots and anchors by pose; no filename-based loose layer overrides.
- Ensure saved appearance immediately propagates to Companion, Commons, Learn Lab, Study Now, Game Realm, Grimoire, Sanctuary, Atelier and rewards.
- Extend existing Sanctuary Phaser action selection once canonical approved walk/play/sleep art exists.
- Fix fresh-question advancement, histogram focus regression and other confirmed broken classroom tasks before merge.
- Preserve independently validated academic records, cosmetics, room placements and Guardians across reload and course changes.

## Needs Browser Certification

- [x] PR #145 Commons browser review at 390px, 820px and 1366px: [run #39667511859](https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/39667511859), all jobs PASS. Desktop full interaction and connected probability regressions PASS; mobile/tablet connected probability steps were skipped.
- [ ] Strict all-ten Guardian assets and actual Phaser movement; certify approved action frames, never substitute portraits for movement.
- [ ] Scholar appearance plus Guardian, XP, crystals and inventory persistence across reload, retries and course switches, with evidence.


- [ ] 390px / 820px / 1366px: Home tabs, keyboard focus, text contrast, reduced motion and no scroll jump
- [ ] All six hairstyles on each supported skin/outfit: head fit, collision and clipping; screenshots required
- [ ] Scholar save/reload/course switch/room switch; equipped layers do not disappear
- [ ] Existing four Guardian motion frames unchanged and working; six new Guardians stage/action correct
- [ ] Every histogram stage displays same scenario/dataset; incorrect/cleared/retried/fresh cases and calculations correct
- [ ] Connected probability wrong → guided repair → fresh independent question, including actual interaction and persistence
- [ ] XP/crystals/inventory/Guardian Sanctuary persistence after all operations

## Ready for Deployment

- PR #145: **NOT READY**; passing Commons browser checks do not clear strict asset/movement, Scholar/persistence, and production gates.


**None of PR #137–140.** They are all drafts. Do not merge or deploy until the complete release gate, reviewer screenshot verification and user-reported probability failure are resolved.

## Blocked / Needs Your Review

- PR #145 and PR #141 board histories reconciled on PR #145 branch only; **PR #141 remains the source for historical sprint/asset/synchronization rules**. Resolve overlapping board PRs deliberately before merging. Do not merge PR #145 until all remaining release gates pass.


- Approve actual fitted avatar look on screenshots (especially hair/head, body proportion, skin and garment fit).
- Approve each new Guardian action pose against exact canonical image; no invented species or altered identity.
- Approve new transparent modular avatar pieces and wardrobe outfit art before adding unlock conditions.
- Confirm any changes in progression/reward economy; do not invent pricing or debit crystals without approval.

---

## Immediate Next Build Order

### Sprint 1 — stabilization and base character system
1. Audit old/broken code paths.
2. Lock canonical sources.
3. Finish scholar identity continuity.
4. Repair hair fit and avatar render sizing.
5. Define clothing slots, layer order and anchor rules.

**Exit gate:** single authoritative avatar registry, fitting/pose template, no duplicated owners, visible hair fitting and reload/cross-room verification.

### Sprint 2 — transparent asset foundation
1. Transparent avatar body and skin variants; reusable head/face.
2. Starter hair and clothing/uniform + dorm/study outfits.
3. Scholar accessory slots and starter transparent accessories.
4. Guardian companion wearables, toy and room link.
5. Existing and missing magical reward icons.

**Exit gate:** individual actual files with transparent backgrounds, dimensions and alignment metadata; compositing/screenshots for supported combinations.

### Sprint 3 — Guardian and Sanctuary expansion
1. Preserve protected original four motion system.
2. Derive faithful action images from six canonical Guardians.
3. Certify stage/action image mapping.
4. Certify Phaser movement, save/reload, and no cross-character substitutions.
5. Trigger restrained Sanctuary visual reactions only for verified academic milestones.

**Exit gate:** no protected file modifications, all 10 correct identities and stages, observable action motion and persistence.

### Sprint 4 — learning + magical polish
1. Repair incomplete lesson interaction/scenario content.
2. Connect same Scholar across academic and game rooms.
3. Trigger celebrations from verified achievements (no unearned mastery).
4. Polish Commons, Learn Lab and Grimoire together without breaking readability.

**Exit gate:** end-to-end academic correctness, learn/retry/transfer, magical reward continuity and responsive release checks.

## GitHub ↔ ChatGPT Project synchronization

- **Authoritative tracker:** this same `PROJECT_BOARD.md` in GitHub; do not fork another project board.
- **Workflow rules:** [PROJECT_SYNC.md](PROJECT_SYNC.md).
- **Copy into ChatGPT Project Settings:** [CHATGPT_PROJECT_INSTRUCTIONS.txt](CHATGPT_PROJECT_INSTRUCTIONS.txt).
- **Every development session:** fetch latest board/open PRs, perform verified work, append one record here, update item statuses and tests, and commit this board change (or create a board PR). Do not claim a session is complete without this step, unless GitHub write fails and the limitation is reported.
- **Automated enforcement:** `.github/workflows/majick-board-gate.yml` rejects pull requests that change executable `current-site/` or `pages-release/current/` files without also changing `PROJECT_BOARD.md`. This takes effect once PR #141 merges; it is not a substitute for accurate log entries.
- **Monitoring:** hourly Majick Studies PR Watch checks for new/updated PRs and board discrepancies and notifies on meaningful changes. This is a scheduled condition check, *not* a native GitHub event-triggered ChatGPT Project file sync.
- **Current integration limit:** Projects do not auto-replace uploaded GitHub file snapshots. Connected GitHub provides live on-demand reads, not automatic project indexing. A Work PR-triggered task could supplement this if available/configured.
- **Merge condition:** PR #141 must be merged for `main/PROJECT_BOARD.md` to become the default board; until then use the `master-project-board-20261017` branch.

## Mandatory work-session log

Every change must append **date / area / commit or PR / what changed / how / actual tests / failure and repair / deployment state**. Never call something fixed without saying what was verified.

| Date | Scope | Changed | Tested | Outcome |
|---|---|---|---|---|
| 2026-10-17 | Board creation | Consolidated verified status, exact four sprint plan, transparent asset checklist and release gates | GitHub PR #137–140 and workflow result inspection | Planning artifact only; no live app deployment |\n| 2026-10-17 | Project synchronization | Added PROJECT_SYNC.md and CHATGPT_PROJECT_INSTRUCTIONS.txt, same-board update contract, CI board gate and hourly PR discrepancy watch | Verified connected GitHub reads/writes; created scheduled condition watch; PR gate committed, not yet merged | Project Settings still requires user paste; CI gate activates after merging #141; no native Project-file auto-refresh and no app deployment |

| 2026-10-21 | PR #145 board reconciliation | Preserved PR #141 master board sections, historical sprint details and synchronization contract; added PR #145 browser results and blockers | Fetched PR #141 source board and PR #145 proposed board; checked GitHub Actions #39667511859 (390/820/1366 PASS) | Board synchronized on development branch only; Guardian strict certification, complete persistence and production deployment remain blocked |

## Release gate clarification — 2026-10-21
- **Guardian assets:** PR #144 includes proposed roster/runtime certification but its stage image loader currently uses `assets/familiars/evolution_stages/<guardian>-<stage>.webp` for displayed sprites; this is portrait-stage art, not proof of approved walk/play/sleep action art. Strict action asset test requires distinct `sanctuary/assets/evolutions/<guardian>/<stage>/{walk,play,sleep}.webp` for each of the six additional Guardians and five stages. Do not pass by substituting portraits, tinting, or procedural bobbing.
- **Original movement:** preserve all 33 protected original motion PNGs and verify frame integrity and actual Phaser movement without rewriting the images.
- **Persistence:** require real browser reload/course-switch/room-switch certification for Scholar fitted hair/wardrobe, all Guardian identities and care, XP/crystals/inventory and independent academic progress. No assisted-to-independent mastery leakage.
- **Merge/deployment:** PR #145 remains blocked pending these gates, board history is reconciled here; `main` board establishment does not authorize app deployment.

### 2026-10-21 — Main board establishment and Guardian asset verification
- Main board created at commit `b19076b204d19ec0c3a30bf0a2ec73abcae7f0dd` from reconciled PR #141/#145 history.
- Checked PR #144 Sanctuary roster: additional Guardians load evolution-stage portraits and animate with procedural movement, not approved distinct action frames. The requested `sanctuary/assets/evolutions/vesper/new-bond/walk.webp` was not found on either PR #144 or main via GitHub contents lookup. This is a **missing-asset blocker**, not a certification pass.
- Checked protected original `sanctuary/assets/motion/luna-walk-1.png`: same Git blob SHA (`e96b4dc4c42457a33e0bbe700ef5dac90eb5321a`) on main and PR #144. Full 33-image integrity audit still required.
- Next repair: locate or provide approved six-Guardian stage/action art, install exact per-stage files, map runtime animation to those frames, then run strict completeness and actual Phaser browser movement tests. Do not fabricate approvals or replace portraits with fake walking frames.
- Deployment: blocked. No production app changes made in this board-only commit.

## 2026-10-22 — Expanded mixed D772 bank
- Added 24 supplemental four-option questions (three cases for each of eight skills) in the existing shared bank. Fresh datasets cover weighted means, IQR/outliers, two-order draws, complements, conditional denominators, expected net value, nonresponse bias and confounding. Original WGU source records are unchanged.
- Reasoning Workshop now promotes an unseen remaining same-skill item after a miss (lesson fallback for legacy items), preserving the mixed deck and recording skill/revision in the existing review log. It never reuses an already attempted item within the round or grants mastery.
- Changed: current-site/d772-shared-oa-questions.js, room-section-nav.js, source-manifest.json; pages-release/current/test-d772-bank-expansion.cjs.
- Verified: new bank/routing checks, preassessment preservation and cross-room continuity. Canonical build and release checks recorded in the session result. Full rendered browser certification remains pending.
- Protected: academic save owners, XP/crystals, Guardian identities and Sanctuary/motion assets untouched. No save migration/reset.
- Deployment: review branch only; not a certified stable release. Next: rendered wrong-answer → fresh follow-up checks at 390/820/1366 and publish through the existing workflow after release gates.
- Recovery: revert this scoped commit and rebuild; do not clear learner storage. No manual user steps.

### Publication verified — PR #158
- Merged as 5f76056eb59b739879b5764f6b58df868d2bff6a. Published development build aa36e558a5a47c04 at https://rnw4512-dev.github.io/majick-studies-assets/.
- Live release.json and both changed JavaScript SHA256 values match the tested artifact. Actions run 39879455700 completed its live-verification step successfully (overall run later marked cancelled).
- Actual live browser: D772 selected and retained after reload; Reasoning Workshop displays 60 mixed items. Wrong answer shows worked feedback; Next opens a distinct 160-adult case after a 140-adult case, marked Fresh follow-up, with 1 answered retained.
- Development update only: full three-width stable certification remains pending.

## 2026-10-22 — Saved mixed practice and reasoning transfer
- Mixed exam round now lives in the existing D772 progress owner: question order/snapshots, selection, submitted feedback, score and queued follow-up survive save/reload and course switching. Validate round shape before resuming; corrupted rounds restart without altering other academic records. Storage failures show a keep-page-open message.
- Added Clear selection, preserved radio focus by avoiding full rerender on selection, blocked duplicate submissions, and a collapsed missed-skills summary. Formative work still cannot award mastery or XP.
- Diversified research follow-ups into online nonresponse, selective customer response, randomized volunteer treatment and fire-severity confounding; added reasoning guidance for every distractor in the 24-item expansion.
- Changed existing room-section-nav.js/shared question bank plus manifest. Added test-d772-exam-resume.cjs; existing bank, source, cross-room and adaptive checks rerun.
- Save tests cover selection/submission reload, course isolation, immutable in-progress answer snapshots, invalid round recovery and storage failure. Full responsive browser certification pending; development release only.
- Recovery: revert this scoped change and rebuild without clearing learner saves. Existing WGU records, Guardian/Sanctuary/motion assets, XP/crystals and mastery owners untouched.

### Live verification — PR #159
- Merged 275e80d58960d9612824bc70df632e5ec1810a3f; Pages run 39881423375 succeeded, including live release verification.
- Live browser confirmed selection survives reload, submitted feedback/score survives reload, fresh same-skill follow-up uses a different scenario, Clear selection removes the choice, and D755 → D772 restores Question 2 of 60 with 1 answered and no selection.
- Build 846768f733883d4c; published development update. Three-width stable certification and broader Guardian/learning enhancement backlog remain open.

## 2026-10-22 — Small Reasoning Workshop comfort improvements
- Added a compact accessible answered-question progress bar. Clear selection returns keyboard focus to choices; submitting focuses the feedback heading; advancing focuses the new prompt without forced scrolling.
- Answer selection no longer changes border thickness/layout. Added visible focus outlines, readable disabled buttons, neatly stacked mobile actions, and compact styling for save status/missed-skills details.
- Tightened invalid submitted-round recovery and save-unavailable reporting; null review rows no longer break rendering. Existing D772 save/review owners and source questions remain intact.
- Files: room-section-nav.js/.css and source-manifest.json. Existing resume/bank checks passed; canonical build and release checks run before publishing. Full three-width stable certification remains pending.
- Guardian/Sanctuary/XP/crystals unchanged. Rollback is a scoped revert and rebuild; never clear learner storage.

### Comfort pass live verification — PR #160
- Merged 853bf637bc9e7321b7f18afefed6e8364a6ed1f1; Pages run 39881912498 completed successfully including live release verification. Build 1df5b15255b4b416.
- Actual live browser confirmed accessible progress changed from 1/60 to 2/60; Clear selection focused the first radio with no selected choice; submission focused the feedback heading; Next focused the new Question 3 prompt. Saved round remained intact. Full three-width certification remains pending; development update.

## 2026-10-23 — Mixed-practice visual evidence and no-penalty recovery
- Found the mixed workshop bypassed the existing shared visual gate; the 60-item audit flagged one scatterplot item without its required plot. Connected the existing gate instead of adding a second rendering/state owner.
- Added matching accessible visuals to three Majick-authored supplemental scatterplot, box-plot and histogram items. Histogram intervals now explicitly describe its dataset. Original WGU source records are unchanged. Saved question text/keys are preserved; visual metadata can enrich a snapshot only when prompt/options/answer exactly match.
- Missing evidence blocks selection/grading and offers an unused verified replacement without changing answered count, correct count, prior answers, XP or mastery. A zero-size or unloaded rendered visual also cannot be scored. No unused valid item produces an explicit preserved-progress message.
- New test-d772-exam-visuals.cjs audits all 60 items, numerical plot agreement, blocked scoring, zero-size diagram handling, replacement/no-replacement and unrelated account/course preservation; added as a mandatory deployment workflow gate. Existing save/resume and bank tests pass.
- Changed shared bank, room-section-nav.js/.css, source manifest, deployment workflow and visual regression test. Development update only; full three-width stable certification remains pending.
- Protected Guardian/Sanctuary/motion assets, source questions and all existing mastery/reward/save owners. Rollback: scoped revert/rebuild; never clear saves.

## 2026-10-23 — Six requested enhancements, integrated development pass
- Recovery: existing learning-continuity owner now retains distinct independent misses by skill, requires all five guided reconstruction stages, persists draft/stage evidence and awaits a fresh unassisted case. Existing Solution Engine renders reconstruction; mixed exam, Study Now and generated Learn Lab route to it. No guided/mastery/XP shortcut. Existing question snapshots/paused round remain in their owners.
- Shared rigor: existing shared bank exposes one deduplicated 60-item intake; Learn Lab lesson intake, native Study Now, mixed Reasoning, embedded guided practice and Game Realm retain supplemental revisions/provenance/visual metadata. Embedded adapter no longer drops visual fields and applies shared visual validation. Source items are not rewritten.
- Mixing: full eligible-pool shuffle removes the predictable section 1→2→3 cycle; saved in-progress decks retain order. Targeted follow-ups still use a matching skill.
- Hands-on: existing Solution Engine adds a two-draw probability tree, selectable formula slots, three weighted-mean datasets and another raw-data histogram construction case. All math/data checked.
- Companions: existing owned cards keep portrait/identity/actions, with personality/progress/wardrobe in details. Moods/friendship/memory sections collapse. Removed duplicate six-Guardian registry insertion; discovery codex excludes already-owned types and collapses evolution detail. No roster changes or motion edits.
- Milestones: existing reward ledger emits tiered visual feedback after a new receipt commits; replayed receipts cannot trigger another animation/reward. Existing animation owner and reduced-motion behavior retained.
- Added mandatory test-six-enhancements.cjs: two distinct misses, five validated stages/reload, old-item transfer rejection, unchanged other course/account/Guardian state, shared metadata, noncyclic mixing, weighted calculations/histogram bins, compact existing cards and replay-safe milestone effects. Existing regression/build gates rerun. Full responsive and full app browser certification pending; development release only.
- Work isolated from an unrelated local reward-art edit using a clean canonical checkout. Source-manifest hashes updated only for intended files. No manual user edits needed. Rollback via scoped revert/rebuild; never clear learner storage.

### Companion runtime certification follow-up
- Live testing found study-ui-compat.js supplied the active discovery renderer and a later inline lfDetailedRoster assignment supplied owned cards. Updated those existing active owners directly: collapsible owned details, unowned-only discovery cards and expandable evolution information.
- Companion room tabs now identify Sanctuary, Your Guardians, Egg Incubator, Dress-Up Drawer and Decor rather than generic Activity labels. Added assertions against the actual final renderer, not an earlier overridden function.
- PR #162 is live (120172bdb2f24a21a2e8a4e0998e0d4053854902, build 46bdb705426ae5b4), Pages run 40020538375 succeeded. Actual browser verified two misses, all five reconstruction stages, reload resumption and a third distinct independent scenario with unchanged guided score. Full three-width certification still pending.

### Final live checks — PRs #162 and #163
- PR #162 merged 120172bdb2f24a21a2e8a4e0998e0d4053854902, build 46bdb705426ae5b4. PR #163 merged 7fb0731d15a0c394a8114b0076c71c523fcf6f55, build ced8c9d6daa2b13a.
- Browser verified two distinct association/causation misses, required guided repair, all five stages, stage persistence across reload/reconnection, and a third distinct unassisted scenario. Guided score stayed at 2 attempted/0 correct; fresh answer recorded independently.
- Browser verified mean formula dropdown placement (56 and 4) advances to calculation and probability tree shows updated 5/8 → 4/7 green branch. Weighted/histogram dataset correctness and ledger replay effects verified in automated checks.
- Browser verified active Companion renderer: named tabs, compact owned portrait, expanding personality/progress/wardrobe controls, nine unowned discovery cards excluding the one owned Guardian. No Guardian roster or art changes.
- Full three-width stable browser certification, exhaustive per-room control checks and lesson-by-lesson rigor/content audit remain pending. Published development updates only. Use this clean checkout for review; unrelated original-workspace reward art remains untouched.

## 2026-10-23 — First-miss guided workshop sequence (development)
- A first distinct independent mistake now routes to a similar original example, followed by a second hands-on scenario, before fresh independent practice. Existing continuity owner tracks all stages/drafts; guided work never awards independent mastery or changes the mixed score. Two-miss recovery remains covered by the earlier first-miss requirement.
- Numerical examples display the formula, require learner-entered quantities, intermediate calculations, final result and interpretation; optional step breakdowns and field-specific correction feedback support retries. Separate scenarios cover means, medians, weighted means, IQR fences, dependent/independent probability, exactly-one events, complements, conditional probability, expected net value, sets and histogram frequencies. Design questions use an evidence checklist rather than an invented numerical formula.
- Versioned plans preserve already-paused five-stage repairs. Source records, saved round order, account balances, Guardians, Sanctuary and protected assets are unchanged. Blank/missing inputs cannot be treated as zero.
- Verification: all 60 eligible items exercise first-miss routing and complete both examples; finite formula values, blank rejection, save/reload, legacy-plan retention, independent transfer isolation and existing regression/release gates checked. Full responsive browser certification pending; development update only.
- Claude handoff: review current-site/solution-engine.js reconstructionPlan and learning-continuity.js practiceAnswer/reconstructionCheck first. Verify the first-miss → similar guided example → second hands-on scenario → fresh independent route at all three widths; do not clear learner storage or add a second academic owner. Rollback by scoped revert/rebuild.

### Live confirmation — PR #164
- Merged 09b6a204f2627840924e6effbcf616c115c8dc94; development build 07c8f515ba83a5aa. Pages run 40024203722 passed all mandatory gates and live verification.
- Live browser verified: one complement mistake → similar 0.2 / 3-sensor guided case → field-specific correction → saved step and numeric drafts after reload → second 0.3 / 2-sensor hands-on case → all eight verified stages → fresh independent 0.4 / 3-sensor case. Mixed score remained 4 answered / 1 correct throughout guided work. Full three-width stable certification remains pending.

## 2026-10-23 — Guided formula number dropdowns (development)
- Replaced guided reconstruction numeric typing with labeled dropdowns populated with scenario numbers, earlier verified quantities and all values needed for the current formula/calculation step. Blank prompt requires a deliberate selection; existing saved numeric drafts are retained, including previously typed values. Both similar and second hands-on examples use the same existing renderer/state owner.
- Extended existing all-60-item regression to assert every expected field value appears in its dropdown. Preserved guided/independent separation, course/account/Guardian state and paused repairs. Updated source hash. Targeted checks and canonical build run; full three-width stable certification remains pending.

## 2026-10-23 — Fresh guided practice and strategy-building (development)
- Root cause: recovery used the same fixed pair, optional workbenches wrapped small case arrays, embedded exercises reset offsets on reload, and Tutor quick checks reused the first question. New recovery sequences use saved per-skill ordinals plus complete plan snapshots; generated Learn Lab questions and core workbenches use fresh numerical evidence. Snapshots preserve an unfinished scenario, selections and verified trail across reload. Finite authored banks stop with a clear no-unused-example message instead of wrapping. Original WGU records remain intact.
- Added “Which formula fits?” before substitution, formula-specific distractor explanations, targeted event/denominator checks, and an expandable verified calculation trail. Both similar and second hands-on scenarios retain dropdown values. Existing Solution Engine renders selectable Venn regions and editable probability trees, box plots and histogram heights. No second renderer or academic owner.
- Readiness derives from the existing course/skill records: Needs guidance during repair, Practicing independently until two distinct recent unassisted correct items, then Demonstrated independently. These are formative labels; course mastery still requires existing transfer/teaching criteria. Guided corrections and completions do not add independent evidence or currencies.
- Assisted Study Now filters previously answered guided evidence; Tutor quick checks retain an unanswered snapshot and choose unused verified items next, with supported same-skill generated fallbacks. Embedded guided exercises retain offsets/snapshots across courses and refuse completed choice-bank repeats. Existing source banks/IDs/rationales are preserved.
- Targeted regression covers 480 new repair snapshots, 900 computed native datasets, 600 generated datasets across runtime reload, complete dropdown options, four visual models with blank/correct selections, formula rationales, event/denominator diagnoses, native draft persistence, guided history, two-item readiness and unchanged account/Guardian/other-course data. Canonical hashes and build checked; full stable three-width and exhaustive per-room browser certification remain pending. Development release only.
- Claude handoff: inspect learning-continuity.js sequence/history/readiness functions and solution-engine.js version-4 plan snapshots, model rendering and verified trail. Preserve paused version-2/legacy plans. Verify actual rapid-click/select/reload/course-switch paths at 390/820/1366px. Rollback by scoped revert/rebuild; never clear learner saves.
