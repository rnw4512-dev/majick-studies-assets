# Aetheria | Moonlit Collegium — shared rebuild log

## 2026-11-28 — Phase 1, Step 0: safety boundary and shared plan

Status: planning checkpoint only. No new app scaffold yet. No current-site changes in this session. Existing app remains the production application; no switchover authorized.

User supplied Claude's rebuild specification in ChatGPT and agreed to bring both AI workflows together. Treat this file as the shared checkpoint. Read it before editing; update it at the end of each session. One independently testable step per session. Use only free tools; stop before enabling anything billable. Do not run multiple independent writers concurrently.

### Non-negotiable requirements
- New code in app/ using Vite, Svelte, TypeScript; PixiJS only for game rendering. Vitest and Playwright for verification. No paid APIs, hosting, database, subscriptions or account infrastructure.
- current-site/ is frozen, read-only throughout rebuild. Preserve the 33 original movement PNGs byte-for-byte. Copy approved assets rather than edit originals. Preserve licenses and provenance.
- Keep all old learner data intact: XP, crystals, chests, Guardians, eggs, inventory, furniture, layout, study materials, academic evidence, course progress and preferences.
- New save store: one versioned logical record, separate IndexedDB database and namespaced localStorage fallback; export/import backup; read-only, idempotent legacy importer. Same-origin GitHub Pages paths share storage; a path is not isolation. Never delete legacy keys. Validate and preview migrations before writing; retain raw unknown data in a recoverable export.
- No versioned filenames, target <400 lines per source file, no cross-feature monkey-patching, no startup polling or MutationObservers waiting for dependencies. Course content in reviewed JSON/Markdown data. Every feature tested.
- Keep the deep-purple, gold, forest-green and parchment magical-school design. Meaningful animations, accessible reduced motion, enchanted next arrows, approved egg stages (actual existing artwork, not invented placeholders), Guardian interactions and functional room assets. Question-first layout, optional resources collapsible, required evidence visible, feedback next to answers. Test 390/820/1366 widths. Preserve educational depth, guided versus independent mastery and reward idempotency.
- Feature parity before switch: existing D669/D755/D756/D772 learning paths, 50-question assessments, Council simulations and speaking practice, games, journal, reward/crafting/egg/Guardian systems, Sanctuary care and approved artwork. Inventory actual existing behavior; do not silently retire features.
- No production switch without explicit user acceptance. Preview at /majick-studies-assets/next/ must be published with the existing production tree in one coordinated Pages artifact; never independently deploy an artifact that removes the live app. Verify current-site bytes and live routing. Review deployment workflow before changing it.

### Legacy save keys supplied by user (not yet audited)
majick_campus_v3
majick-reward-sanctuary-v3411
majick-sanctuary-furniture-v1
majick-sanctuary-layout-v2
majick-sanctuary-renderer
majick-study-materials-v1
majick-learning-observatory-v1
majick-fragment-study-evidence-v1
majick-sitewide-response-mode-v1
majick_d772_material_section
majick_nav_stack_v3329
majick_v338_progress_seed_applied
moonlit_learning_v1
aetheria-adventure-journal-v1
aetheria-cloud-session-v1
aetheria-experiences-v1
aetheria-learning-path-current-v2
wguExpeditionV6State

Audit all localStorage/sessionStorage/IndexedDB references, including dynamic keys, iframe storage, fallback and migration keys, before designing importer. Do not migrate cloud credentials/session tokens into backups; preserve legacy storage untouched and document intentional exclusions.

### Ordered phases
1. Foundation: scaffold/theme/navigation; storage audit and save schema; read-only importer; backup round trip; safe combined preview deployment.
2. D772 end to end: learn, practice, feedback, rewards, reload.
3. Rewards, Guardians, egg stages and hatching.
4. Pixi Sanctuary and furniture/layout/care.
5. Pixi Game Realm.
6. Remaining D669, D755, D756 course packs and feature parity.
7. User-approved switchover; retain current-site archive.

### Evidence and next action
Repository root inspected: current-site/, tests/, curriculum-intake/, asset-sources/, asset-review/, docs/, pages-release/ exist. app/ and REBUILD_LOG.md did not exist before this checkpoint. Existing recovery and design documentation remains authoritative for feature requirements: HANDOFF_LATEST.md, APP_CHANGE_AND_RECOVERY_RULE.md, DESIGN_DIRECTION.md, INSTRUCTIONAL_INTEGRITY_RULES.md.
Prior cleanup commit 8e5d86abc2dabf570ab4e8ab5df438dca54aa08c is historical; its production status is not certified by this session. Do not continue editing legacy code under this rebuild plan.
Changed file: REBUILD_LOG.md only. Tests: repository existence inspection, not application tests. No deployment, no dependency installation, no save migration.
NEXT: Phase 1 Step 1 — create the minimal app/ Vite+Svelte+TypeScript scaffold with a dark magical accessible shell, navigation, pinned lockfile and a smoke test. Run npm ci, typecheck, build and tests in a free local environment or GitHub Actions. Do not implement migration or preview deployment in this step. Inspect legacy storage in a separate subsequent step before designing the importer.

## 2026-11-28 — Phase 1 Step 1: scaffold checkpoint (certification outstanding)

Created app/ with a minimal Svelte 5, TypeScript and Vite shell, hash-based room routing, responsive accessible navigation, keyboard focus on room change, deep-purple/gold/forest-green theme and lightweight enchanted arrow hover/focus effects. Unimplemented rooms are explicitly marked; no fabricated learner balances or activities. Reduced motion toggle is session-only and OS reduced motion is respected. No legacy assets copied yet; symbolic decoration is CSS/text only and not a claim of approved egg art integration.

Files: app/package.json, .gitignore, index.html, vite.config.ts, vitest.config.ts, tsconfig.json, playwright.config.ts, README.md, src/main.ts, src/App.svelte, src/core/router.ts, src/ui/{RoomNavigation.svelte,PortalArrow.svelte,theme.css}, tests/router.test.ts, tests/browser/navigation.spec.ts; new independent .github/workflows/aetheria-next-check.yml; this log. No current-site/ files or existing Pages workflow changed.

Verification: local Node 22.16/npm 10.9 available, but npm registry DNS failed (EAI_AGAIN); therefore cannot generate genuine lockfile or run local build/tests in this environment. Exact direct dependency versions pinned; separate read-only public-repository CI check added, with no deployment or paid services. CI must generate lockfile, typecheck, unit tests, build, browser smoke tests at 390/820/1366; archive lockfile for recovery. Do not mark step complete before checks pass and generated lockfile is committed. No storage migration, cloud, production deployment or switchover.

NEXT: finish Phase 1 Step 1 by inspecting foundation workflow results, fixing any failures and committing genuine generated package-lock.json; repeat npm ci and checks. Only after passing proceed to legacy storage inventory. Local recovery: cd app; npm install; npm run check; npm test; npm run build; npx playwright install chromium; npm run test:browser. Rollback only this scaffold commit if necessary; never reset legacy storage or current-site.

## 2026-11-28 — Phase 1 Step 1 certification correction

Claude independently tested a copy of commit 6d1d0ac without editing the repository. User reports npm install, Vitest 2/2, build (~32 KB JS, 5.7 KB CSS), and browser 3/3 at 390/820/1366 all passed, with legacy save untouched. Typecheck failed on PortalArrow.svelte; Claude verified adding an empty TypeScript script block yields zero errors. GitHub run 46151332543 also failed at typecheck. Applied that exact fix.

Recovered the genuine npm-generated package-lock.json artifact from run 46151332543 (artifact 15265683410; lockfile v3, 137 package entries, matching the pinned package.json). The file is available in the assistant's execution container; GitHub connector requires text input, so added a temporary conditional CI log export of the generated public dependency lockfile to allow exact transfer into the repository. No credential or learner data is printed. Once lockfile is committed, use npm ci and remove the temporary export step. Certification is still outstanding until the committed lockfile and all GitHub checks pass.

Legacy freeze: Pages run 46150328401 for 8e5d86a failed at real learning/Journal/Council/Guardian browser verification, so that cleanup was not deployed. Do not repair or modify current-site/ under this rebuild. Existing live version remains prior to that failed release.

Only one AI edits the repo at a time. Claude tests/reviews only unless user explicitly changes that rule. This correction touched PortalArrow.svelte, the isolated foundation-check workflow and this log only; no production deployment or legacy save access.

NEXT: retrieve exact generated lockfile from CI output, commit app/package-lock.json, enforce npm ci, verify green foundation workflow, then mark Step 1 complete. Next phase thereafter is Phase 1 Step 2 — read-only inventory of every localStorage, sessionStorage and IndexedDB key in current-site/, including dynamic keys. Inventory only; do not build importer.
