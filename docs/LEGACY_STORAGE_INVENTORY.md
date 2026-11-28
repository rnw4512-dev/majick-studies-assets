# Aetheria legacy browser storage inventory

Phase 1 Step 2 — 2026-11-28. Source baseline: 5fe11569583bc859703930aa9f1a4c8502572464 (merged PR #304).
This is an inventory only, not an importer, migration, save schema, browser inspection or production release.

## Scope and method

The recursive Git tree was not truncated. Its 142 JavaScript files, 7 HTML files and 1 MJS file include two bundled third-party engines (sanctuary/phaser.min.js and vendor/pixi-8.6.6.min.js). All other 148 application-owned JS/HTML/MJS files were fetched at the exact baseline and text-scanned for localStorage, sessionStorage, indexedDB, createObjectStore, objectStore and MajickSaveSafety.records references. Relevant declarations, key construction, callers, wrapper records, recovery selection and iframe storage owners were examined. Empty source files were included. Source citations below use paths relative to current-site/ and line numbers at this baseline. Historical docs/audits/aetheria-recovery-source-storage-inventory.json was consulted as a cross-check, not treated as the current source of truth.

Limits: this is static first-party executable-source evidence, not an AST proof of every possible computed access or a runtime enumeration of a real browser. Third-party minified bundles, static JSON/text/CSS/assets, Python tooling and historical releases outside current-site/ were not independently audited as executable browser storage owners. No browser storage values were read. The frozen main tree differs from the previously deployed release because legacy cleanup 8e5d86a failed its Pages gate. A live-source comparison and read-only key/DB enumeration on a consenting user's device or exported test fixture are required before claiming migration coverage of every historical key. Never open an absent IndexedDB database in a manner that creates or upgrades it. Never print actual learner values, authentication credentials or artwork bytes to CI logs. Unknown data must not be discarded.

## Primary localStorage and recovery records

| Exact key | Source evidence | Value / purpose | Future disposition (not implemented) |
|---|---|---|---|
| moonlit_learning_v1 | save-safety.js:3,23-24,128-143; startup-core.20261114.js:4,29 | JSON main workspace S; courses, progress, legacy pets/eggs, account, campus and other feature state | Essential; reconcile with durable workspace, never assume newest |
| moonlit_learning_v1__recovery_previous | save-safety.js:3,24,142,237 | Previous validated workspace JSON | Recovery candidate; not additional progress |
| moonlit_learning_v1__before_restore | save-safety.js:3,24,203,213 | Pinned workspace before restore | Recovery candidate |
| moonlit_learning_v1__before_restore__council | save-safety.js:152,203,213 | Pinned auxiliary records object | Recovery candidate, preserve with associated workspace |
| moonlit_learning_v1__safety_meta | save-safety.js:3,49,112,120,143 | Schema, timestamp, revision, backup status and divergence marker | Conflict-detection metadata |
| moonlit_learning_v1__unreadable | save-safety.js:3,23 | Original unreadable raw string | Preserve for recovery, never silently treat as valid |
| moonlit_learning_v1__good_backup | save-safety.js:24,137,237 | Historical workspace backup | Recovery candidate |
| moonlit_learning_v1__known_good | startup-core.20261114.js:575,644; save-safety.js:137,237 | Historical known-good workspace backup | Recovery candidate |
| moonlit_learning_v1__session_backup | startup-core.20261114.js:574,644; save-safety.js:24,137,237 | Historical previous-session workspace | Recovery candidate |
| wguExpeditionV6State | startup-core.20261114.js:29 | Historical PMFC progress / attempts used if no current workspace | Preserve; avoid reimporting already migrated attempts |
| majick_v338_progress_seed_applied | startup-core.20261114.js:13,2804 | Seed identifier string | Historical migration marker, not earned progress |
| majick_campus_v3 | startup-core.20261114.js:1396-1419 | Declared MC_STATE_KEY, no other usage in that file; actual campus state S.campus | Historical candidate only; standalone payload/active writer not confirmed |
| __moonlit_test | startup-core.20261114.js:647 | Temporary storage availability probe | Exclude from new save |

Primary S includes distinct course progress, account rewards/receipt ledger, legacy roster and eggs, inventory/care/crafting and layout fields, campus and learning feature subtrees. The existing code's centralized save() delegates to MajickSaveSafety.write(S). Most feature modules do not create independent browser keys. Full nested schema mapping is a later step, not inferred from names.

## Auxiliary learner records (localStorage fallback OR durable workspace browserData)

save-safety.js:152-180 permits the exact STUDY_OWNERS keys below and any key starting with the Council prefix. records.getItem/setItem reads/writes the durable in-memory record map when IndexedDB is available; otherwise it uses localStorage. The durable checkpoint contains serialized browserData; it can be newer than localStorage. Preserve auxiliary values from the selected checkpoint and reconcile conflicts. These are not separate XP wallets.

| Exact key or prefix | Source evidence | Value / purpose |
|---|---|---|
| majick-d756-task2-rehearsal-v1 | d756-task2-meeting.js:6,392,400 | Rehearsal state, draft, records, mode, elapsed time |
| majick-d756-task2-rehearsal-v1-history | d756-task2-meeting.js:401,528,583,603 | JSON attempt history (up to 30), including abandoned attempts |
| majick-d756-task2-rehearsal-v1-replay | d756-task2-meeting.js:117-118,395 | Replay state/queue |
| majick-d756-task2-rehearsal-v1* | save-safety.js:152,162-172 | Prefix enumeration accepts other historical Council records; do not limit to the three observed literals |
| majick-learning-observatory-v1 | study-observatory.js:6-19,156 | Per-course lesson/question evidence, history, tickets spent, milestones, scenarios |
| majick-fragment-study-evidence-v1 | fragment-earnings.js:10-17 | Distinct evidence for fragment earning and replay protection |
| majick-universal-hands-on-v1 | universal-hands-on.js:38-41,73 | Saved hands-on practice records |
| majick-d772-mixed-exam-review-v1 | room-section-nav.js:250-253 | Mixed exam review history (up to 300 rows) |
| majick-study-materials-v1 | study-material/materialStoreModel.js:6,23-28,90; save-safety.js:178-180 | Imported source row array, fallback to separate sources database; row id/courseId/text/updatedAt |
| aetheria-experiences-v1 | aetheria-learning-experiences.js:6-13,539 | Journal memories, room decor, playRuns |
| aetheria-adventure-journal-v1 | aetheria-adventures.js:6-16,294 | Adventure progress/discoveries by record key |

All are preserve candidates. Retain exact evidence and receipt identifiers; do not rerun grading, grant rewards, or infer independent mastery from guided activity.

## Other persistent localStorage

| Exact key / dynamic expression | Source evidence | Value / purpose | Future disposition |
|---|---|---|---|
| majick-reward-sanctuary-v3411 | sanctuary/reward-sanctuary.js:25,28-29 | Reward placement/equipment state in Sanctuary JSON | Preserve and reconcile with main inventory/receipts |
| majick-sanctuary-furniture-v1 | sanctuary/sanctuary-customize.js:8,56,59 | Furniture customization snapshot | Preserve |
| majick-sanctuary-layout-v2 | sanctuary/Game.js:2706,2722-2750; app-runtime.js:206 | Object layout JSON | Preserve and reconcile renderer layouts |
| majick-sanctuary-object-interactions-v1 | sanctuary/Game.js:24,3116-3123 | Object interaction state | Preserve |
| majick-sanctuary-renderer | startup-core.20261114.js:2543; app-runtime.js:265 | pixi/phaser preference | Record historically; new renderer is Pixi only |
| majick-sitewide-response-mode-v1 | universal-hands-on.js:45-48 | Choice/written response preference | Preserve compatible preference |
| aetheria-learning-path-current-v2 | course-learning-path.js:4,8,15; connected-learning-path.js:4,7,14 | Current course/lesson selections JSON; shared literal | Preserve selections; avoid duplicate records |
| aetheria-d772-oa-focus-cs229-v1 | d772-oa-focus.html:47-51 | Separate OA practice state/index and answers | Preserve distinct practice record |
| majick_342_sprite_review_v2 | atelier-fit-review.html:6,14-15 | Artwork fit review, schemaVersion/frames/updatedAt | Preserve separately as asset review, not learner mastery |
| majick:workshop-sequence:<course>:<task.id> | solution-engine.js:64-67 | Numeric string sequence counter; course = String(S.activeCourse or task.course or D772) | Enumerate all matching keys, do not guess task IDs or reset rotation |

## Session storage

| Exact key / dynamic expression | Source evidence | Value / purpose |
|---|---|---|
| majick_nav_stack_v3329 | app-runtime.js:84-91 | JSON navigation history, up to 30 entries |
| majick-commons-tab | collegium-commons.js:6,40 | Selected commons tab |
| majick_d772_material_section | section-intake-shortcuts.js:5-10 | Selected D772 intake section |
| majick-written-<activeCourse>-<pack>-<row> | course-activity-player.js:103 | Written rehearsal text, derived from activeCourse, data-cap-pack, data-cap-activity; saved if length >=15 |

Session keys are tab-scoped, not durable academic mastery. Preserve draft text if explicitly available and approved, never grade it during import. Navigation preferences can be mapped or safely defaulted in the new app; do not delete old values.

## IndexedDB databases and records

### aetheria-recovery-v1 (version 1), store snapshots
Source: save-safety.js:5,30-72,198-214,234-258.

| Record key | Stored value |
|---|---|
| primary-workspace-v2 | JSON string envelope {format:1, revision, at, raw, browserData}; raw is full workspace JSON |
| previous-workspace | Previous durable envelope |
| pinned-workspace | Restore pin {raw,browserData} |
| primary-workspace | Transitional quota-overflow record; can be envelope or historical unversioned JSON {raw,browserData,at} |
| legacy-workspace-before-migration | Prior value preserved if current record could not be parsed as valid checkpoint |
| moonlit_learning_v1__recovery_previous | Compacted validated legacy snapshot |
| moonlit_learning_v1__session_backup | Compacted validated legacy snapshot |
| moonlit_learning_v1__known_good | Compacted validated legacy snapshot |
| moonlit_learning_v1__good_backup | Compacted validated legacy snapshot |

Observed authority: prepare() reads current, previous and transitional checkpoint in parallel. It selects valid current first, then previous, then transitional; validates schema and browserData, combines local auxiliary records with checkpoint records, detects legacy divergence via metadata. Older quota-only record considered if no valid modern checkpoint, with timestamp comparison. Revision floor is max valid revision. The new importer must not simply select highest XP or newest wall clock, or sum copies. Conflicting candidates need user-visible review and a recoverable backup. Do not call old prepare(), compact(), write(), replace() or cloud methods as part of read-only inventory.

### majick-studies-sources-v1 (version 1), store sources, keyPath id
Source: study-material/materialStoreModel.js:4-16,30-117. Dynamic record key is each source row's id. Values contain imported materials, course association, text and timestamps, plus additional fields. Legacy read merges database rows and fallback rows by id, choosing later updatedAt. Preserve unknown fields, distinguish missing/unreadable DB from empty DB, avoid resurrecting deleted materials. A fallback-only row is a valid candidate. Do not call existing write/delete methods.

### aetheria-personal-artwork (version 1), store packs
Source: animation-effects.js:5-35.
- active: artwork pack object {format:'aetheria-personal-artwork-v1',assets}; dynamic asset keys match loot/ui/pet/fx plus slash and alphanumeric/underscore/hyphen name, values are data:image/webp;base64 strings. Existing validation permits up to 200 images and enforces size/format. This can contain approved egg, loot and UI assets not present as repository image files. Actual contents not inspected; do not assume egg artwork exists without checking an authorized export.
- personal-music: File/Blob chosen by learner. Personal artwork/music deliberately stays device-local and is excluded from legacy Scholar saves.
Preserve these separately with explicit consent for any portable local backup; do not upload personal media to GitHub or cloud. No automatic copying or replacement.

## Cloud-related keys — never import into the local-only rebuild

| Key | Source | Purpose |
|---|---|---|
| aetheria-cloud-session-v1 | save-safety.js:265-268 | Auth session (may contain access/refresh tokens), revision and enabled |
| majick_cloud_ai_endpoint | startup-core.20261114.js:1188-1204,1344-1360 | Legacy endpoint configuration |
| majick_cloud_ai_publishable | same | Legacy cloud configuration |
| majick_cloud_ai_token | same | Legacy app token |
| majick_cloud_ai_client_id | same | Legacy client identifier |

Leave these legacy values untouched. Exclude credentials/session material from new saves, logs, backups and fixtures. No cloud access or paid service required.

## Iframe and other boundaries

Both Sanctuary paths use same-origin message bridging; sanctuary/bridge.js receives MAJICK_STATE, checks origin and sends readiness/roster signals. Phaser's direct localStorage layout, customization, reward and object-interaction records are listed above. The Pixi prototype had no direct storage API matches. The iframe paths do not isolate localStorage or IndexedDB from the same Pages origin. Session storage is additionally tied to the top-level browsing context. State messages are not another durable storage database.

## Validation and outstanding coverage

- 148 first-party JS/HTML/MJS files scanned for the named storage APIs, including standalone D772 OA/Atelier pages and both Sanctuary renderers. Relevant key declarations and read/write expressions reviewed; historical inventory cross-checked. This is a static source inventory, not an exhaustive runtime/AST analysis.
- Three IndexedDB databases, their store names, fixed and dynamic keys and storage authority identified. No live browser values read; no importer, tests that write saves, runtime migration or schema change.
- A distinct browser profile may contain additional historical keys from versions not in the frozen tree. Need read-only comparison with the actual deployed version and explicit runtime inventory/export before any migration is approved. Dynamic key values and arbitrary historical Council-prefix records cannot be enumerated from source alone.
- Before importer design: review with Claude; confirm complete storage coverage including historical/deployed source and any unknown keys, then define versioned schema and conflict/backup policies. Never reset data, compact/delete old records, contact cloud, or replay rewards as a migration side effect.

## Recovery

This document is non-executable. If a classification is wrong, correct the inventory with a source reference rather than modifying the frozen app. No user needs to clear browser data. Revert only the documentation commit if required.
