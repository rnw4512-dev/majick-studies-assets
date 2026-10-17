# Majick Studies — Master Working Project Board

Updated: 2026-10-17. Canonical source: `current-site/`. Live: https://rnw4512-dev.github.io/majick-studies-assets/

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

- **Companions page condensation** — development branch `companions-focused-tabs-20261017`: original Guardian cards, eggs, habitat, outfit/accessory drawer and room décor grouped into four keyboard tabs; canonical Guardian portraits with compact information under each card; personality/ability in optional expandable details. No Guardian or reward state owner changed. Needs visual/browser QA before merge.


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

- Audit obsolete copies, duplicate render/credit paths, and all current scripts' loading order.
- Lock an actual layer registry: body/face/hair/outfit/shoes/accessory slots and anchors by pose; no filename-based loose layer overrides.
- Ensure saved appearance immediately propagates to Companion, Commons, Learn Lab, Study Now, Game Realm, Grimoire, Sanctuary, Atelier and rewards.
- Extend existing Sanctuary Phaser action selection once canonical approved walk/play/sleep art exists.
- Fix fresh-question advancement, histogram focus regression and other confirmed broken classroom tasks before merge.
- Preserve independently validated academic records, cosmetics, room placements and Guardians across reload and course changes.

## Needs Browser Certification

- [ ] 390px / 820px / 1366px: Home tabs, keyboard focus, text contrast, reduced motion and no scroll jump
- [ ] All six hairstyles on each supported skin/outfit: head fit, collision and clipping; screenshots required
- [ ] Scholar save/reload/course switch/room switch; equipped layers do not disappear
- [ ] Existing four Guardian motion frames unchanged and working; six new Guardians stage/action correct
- [ ] Every histogram stage displays same scenario/dataset; incorrect/cleared/retried/fresh cases and calculations correct
- [ ] Connected probability wrong → guided repair → fresh independent question, including actual interaction and persistence
- [ ] XP/crystals/inventory/Guardian Sanctuary persistence after all operations

## Ready for Deployment

**None of PR #137–140.** They are all drafts. Do not merge or deploy until the complete release gate, reviewer screenshot verification and user-reported probability failure are resolved.

## Blocked / Needs Your Review

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

| 2026-10-17 | Companions page UX | Added presentation-only `companion-tabs.js`, loaded by `index.html`, with focused tabs, canonical Guardian portrait cards, optional extended details and responsive styling | Source structure and canonical portrait-file presence checked; regression assertions added; browser QA still pending | Draft; no deploy; verify cards/actions, tab focus, duplicated status panels and persistence on 390/820/1366 |

| 2026-10-17 | Canonical Guardian transparent upload review | Inspected 17 user-supplied transparent RGBA PNGs, including Vesper/Solara variants, Briar/Zephyr/Prism/Rook portraits, and original four motion references; prepared named staging ZIP and hash manifest | Confirmed 1254×1254 RGBA with transparency on all 17; runtime mapping and browser tests not run | Staged outside GitHub; must upload with correct canonical names, obtain visual approval, and integrate without touching protected 33 animations |

| 2026-10-17 | Additional Guardian motion intake | Staged 19 unique RGBA 1254×1254 PNGs for Aurelia (legacy Mallow, 10 actions) and Solstice (legacy Nova, 9 actions) in a downloadable checksum manifest ZIP; skipped duplicate filename variants | Local alpha, dimensions and SHA-256 inspection passed; GitHub comparison and live Phaser/browser movement not completed | Protected 33 motion originals unchanged; staged only, not deployed; next reconcile checksum/path ownership then implement and certify |

| 2026-10-17 | Protected motion reconciliation | Compared all 33 named protected Sanctuary PNG paths against the original transparent motion uploads; identified 5 missing actions (ember-fly, ember-wave, luna-paw, luna-sit, luna-sleep), built a verified 12 MB ZIP with correct canonical repository destinations and SHA256 manifest | Local 1254×1254 RGBA/alpha and checksums verified for all five; existing originals excluded; browser Phaser tests not run | Binary PNGs in downloadable staging patch, not GitHub or live app; require binary ingestion + existing renderer hookup + certification |

| 2026-10-17 | Real Guardian movement + mixed Study Realm | Reused protected alternate walk frames (luna, ember, nova and mallow) in current Phaser runtime; copied existing Cascade flight image blob into correct folder; Study Now now houses Reasoning Workshop as adjacent panel tab and mixes D772 Sections 1/2/3 | Module syntax and static regression assertions prepared; responsive/full Phaser interaction certification not yet verified | 4 genuine uploaded pose PNGs still staged outside GitHub (legacy root files are 2-byte placeholders, not actual art); preserve originals; do not deploy pending missing images and real browser gates |
