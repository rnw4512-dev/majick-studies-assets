# Aetheria feature ownership and consolidation

This is a source ownership map, not certification of every feature. Runtime tests are separately identified in the regression report. No compatibility module has been removed or replaced. No new wallet, course system or Hands-on Studio was introduced.

| Feature | Existing authority / adapters | Competing or compatibility concerns |
|---|---|---|
| Course Manager / course switching | courseManager.js, MajickCourseManager; majick-state-core.js normalizes course progress | Embedded PMFC/D755 names and historical migrations retained |
| D755 | index.html academic bank, d755-retake.js, wgu-practice.js | Historical source aliases retained |
| D772 content / lessons | course-tutor.js; d772-course-map.js; d772-shared-oa-questions.js | Preassessment source/review/deep-practice are distinct adapters, not interchangeable banks |
| D756 lessons / studio | index.html content; d756-hands-on.js / MajickHandsOnStudio | One existing studio; no duplicate |
| Task 2 simulator | d756-task2-meeting.js / MajickD756Meeting | Independent local rehearsal/history keys; PR #257 overlaps merged #258/#259, keep branch until comparison |
| Scholar Study Hall / Learn Lab | learning-lab.js, learn-mode.js, course-tutor.js | Inline lesson adapters, classroom-library-life.js and legacy wrappers retain consumers |
| Hands-on learning / guided reasoning | generated-question-engine.js, solution-engine.js, manipulatives.js, lesson-activity-bank.js | Guided results never confer independent mastery |
| Professor Repair / Mistake Grimoire | question-repair.js; learning-continuity.js; index.html Grimoire UI | app-recovery.js wraps older practice/grimoire entry points; retain |
| Independent Practice / Trial Chamber | wgu-practice.js, d772-adaptive-mastery.js, adaptive-learning-core.js | Separate assisted, independent, transfer and teach-back evidence |
| Game Realm | game-realm.js | Learning needs shared via learning-continuity.js; game scores are not mastery |
| Progress monitoring / adaptive learning | learning-continuity.js, d772-adaptive-mastery.js, adaptive-learning-core.js, learning-plan.js | Different evidence/readiness responsibilities; no broad consolidation justified |
| Course learning profiles | course-learning-profiles.js | Per-course profile ownership retained |
| Scholar identity / XP high-water / course wallet mirrors | majick-state-core.js / MajickStateCore | Historical balance recovery signatures are data migrations, not dead code |
| XP / crystals / reward receipts / milestones | reward-core.js / MajickRewardCore; scholar-progression.js; study-progress-bridge.js | Ledger keys dedupe reward events. Legacy reward entry points remain unverified; not all writers are migrated |
| Study effort / streaks / journals | scholar-progression.js, reward-core.js and embedded index progress | PR #231 has unmerged effort/journal work; do not delete or silently replace |
| Save / restore | save-safety.js owns main snapshot persistence; index.html attaches S adapter | material IndexedDB, rehearsal keys and legacy backups remain separate; no structure rewrite |
| Guardian registry / identity / evolution | guardian-registry.js, guardian-core.js, guardian-life-main.js | Canonical portraits and stage art retained |
| Guardian inventory / bond / care | guardian-care-economy.js, reward-core.js, shared account/legacy roster | Exact instance IDs matter for duplicate species |
| Sanctuary placement / movement | app-runtime.js / MajickSanctuaryState; pixi-sanctuary/prototype.js; sanctuary/index.html fallback | Pixi and Phaser are intentional renderers sharing state; do not remove fallback |
| Walking frames / animation | Pixi prototype plus stage registries; Phaser fallback | Frame alignment, ticker sync and approved masks retained |
| Ceremony / reduced motion | verified-milestone-ceremony.js presentation listener; reward-core.js authoritative receipt | milestone-particles.js / animation-effects.js retained until consumer coverage proves removal safe |
| Scholar avatar / outfit / accessories | scholar-wardrobe-studio.js, enchanted-atelier.js, atelier-sprite-actions.js | Approved art gate in atelier-v2-approval-gate.js; unapproved fitted art remains gated |
| Pixi avatar scene / Atelier | atelier-pixi-scene.js / MajickAtelierScene | Scene isolation and preview fallback covered by existing source checks |
| Navigation / rooms | index.html navigation; campus-runtime.js render queue; room-section-nav.js; product-core.js | ui-compat.js, study-ui-compat.js and versioned wrappers remain consumers |
| Responsive layouts / mobile controls | mobile-cleanup.js/css, compact component rules | Scoped fixes preferred over global cascade rewrites |
| Accessibility / focus / loading / errors | focus-feedback.js, readability-guard.css, component modal handlers, save-safety.js, build release guard | No single owner for all cross-cutting UI behavior; complete keyboard/contrast review still required |

## Consolidation performed

Probability stage and Back navigation now share the existing capture activation owner instead of mixing per-node click listeners with capture. Explicit stage changes render immediately. Full existing probability browser tests pass without assertion changes.

The shared diagnostic uncertainty sentence is assembled once for both coaching paths. No educational distinction changed.

The 97 exact-byte groups and 12 identical CSS rules in the JSON are candidates only. Identical files in old release folders remain recoverable material. Cascade order and dynamic asset consumers have not been proven removable, so no files or CSS rules were deleted.
