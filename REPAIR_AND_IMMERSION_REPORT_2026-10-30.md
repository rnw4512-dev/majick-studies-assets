# Aetheria repair and immersion report · 2026-10-30

## Change summary

Repository: `rnw4512-dev/majick-studies-assets`. Branch: `fix/shared-eight-step-repair`.
Runtime build: `579d066118a6c07a`.

Implementation is on the repair branch. All 20 local Node runners and six browser workflows pass; the Commons run covers 1366/820/390 widths with no contrast failures. GitHub certification, merge and publication outcomes are recorded in the PR and delivery report; local tests alone do not establish deployment.

### Learning repairs

- Added `question-repair.js` as the shared question-aware explanation owner, extending the existing WGU `specificRepair()` adapter. Removed the obsolete parallel WGU worked-answer/interactive-feedback implementation, including its malformed legacy regular expression.
- Incorrect-answer adapters in Study Hall, Trial Chamber, Course Tutor, Learn Mode/checkpoints, Professor workshops, embedded practice, Your Turn, preassessment review, adaptive review, and Game Realm use the same eight ordered expandable teaching steps.
- The model references the selected answer and actual prompt, uses authored option rationales when available, and asks a diagnostic question when the selected answer does not establish the learner’s reasoning. It does not claim to infer intent from an answer alone.
- Supported numerical models show substitutions/calculations and actual observations/sample spaces. Other questions use their authored rationale and actual question evidence; unrelated decorative lesson diagrams are not substituted as question evidence.
- The course-scoped continuity tracker owns the two-mistake threshold across rooms and lesson aliases. Guided work cannot certify independent mastery. Actual deliberate retries count as attempts; rendering and replay do not create additional mistakes. Fixed a duplicate count between `skillResult()` and explicit repair recording.
- Fresh transfer selection rejects reused data, reordered descriptive observations, cosmetic object fields, and new IDs with unchanged evidence. If a verified independent case is unavailable, the app retains recovery and reports the shortage instead of recycling a failed question or fabricating mastery.
- Submitted OA mistakes remain visible for teaching rather than disappearing after a 120 ms auto-advance. The existing compact Skill Growth drawer is reachable again in the four-tab Study Hall.
- Asynchronous Course Tutor source hydration and delayed classroom startup preserve an already-mounted question, typed work and feedback. Newly loaded material is available at the next explicit lesson selection.
- Probability has its dedicated workshop route and a working local Back button using the existing navigation/history owner. Browser checks cover actual pointer Back, drafts, independent work, transfer, teaching, replay prevention, reload and course isolation.

### Immersion and presentation

- Replaced the home castle emoji with Kathrin Polikeit’s human-painted fortified castle landscape. Added moonlit purple lighting, a readable welcome panel, three bounded fairy lights, responsive cropping and a visible artist-credit link. Corrected Commons’ relocation of the banner and an old compact-header height cap that hid the artwork.
- Extended the existing visual effects owner with bounded activation sparkles and shared hover/focus glows. Larger celebrations retain priority. Decoration cannot intercept pointer events, award rewards, change grades or alter layout.
- Extended the existing six ambient motes into small winged lights. System and in-app reduced-motion preferences suppress movement and transient interaction particles.
- Integrated Kevin MacLeod’s human-created “Dreams Become Real” recording into the existing ambience owner. Music starts only on an explicit user action, has volume/mute controls, pauses in hidden tabs, persists volume, and stays off on reload. Rapid start/stop requests cannot restart muted music. Existing legacy ambience entry points delegate to this owner.
- Music is CC BY 3.0; the castle painting is GPL 2 or later. Original files are bundled unmodified, source revisions are pinned, credits are linked in the app, and the image’s GPL license is included. See `current-site/assets/IMMERSION-CREDITS.html`.
- Applied the Pixi examples to existing Guardian/furniture sprites: local-coordinate hit areas, hover/press/release tint, reveal glows, a tiled floor constellation using the bundled Pixi 8.6 API, and existing-ticker cleanup. No GSAP dependency, replacement renderer, extra persistence owner or remote runtime asset was introduced.
- Visible prose and accessible instructions remove em dashes through the existing presentation layer. Canvas/iframe text is also updated. Archived learner snapshots and parser punctuation are preserved.

The earlier Sanctuary identity/furniture and chart/navigation repairs were already present after PR #195 and subsequent upstream merges. This change preserves them and extends their regression coverage; it does not claim them as newly implemented here.

## How to see it

1. Home → Overview: the castle entrance, moon, fairy lights and credits replace the emoji banner.
2. Hover or keyboard-focus an enabled control; activate it to see a bounded light response.
3. Choose **Enable ethereal music** in the top bar. **Sound settings** controls music volume and links artist credits. The same button mutes music.
4. Answer a question incorrectly in Study Hall, Trial Chamber, Learn Lab or the Arcade. Open the eight teaching steps. Two mistakes on one skill require guided reconstruction before independent transfer.
5. Open Sanctuary. Hover/select a Guardian or furniture item, place/store furniture, and use existing care controls. The original Phaser Sanctuary remains the fallback.

## Verification

- Source-manifest SHA-256 entries cover every modified/new runtime file, including bundled assets/licenses. All 33 protected original motion assets remain unchanged. Build includes JavaScript parsing and current-source integrity verification.
- Twenty current Node runners pass, including nine shared-repair assertion groups, mathematical cases, freshness/replay checks, cross-room recovery, rewards/progress isolation, Sanctuary migration, and interaction/reduced-motion safety.
- Browser certification includes the existing interactions, Commons desktop/tablet/mobile and contrast, Sanctuary, and Probability flows plus new shared-teaching and immersion flows. New tests exercise real controls, keyboard expansion, recorded audio decoding/playback, mute, mobile width, reduced motion, saved reload and state isolation.
- Runtime exceptions/failures are investigated from `/workspace/majick-dev/logs`. Intermediate failed runs are retained there. A prior stable run `40139804213` failed in the Commons browser step; a later passing certification is required to supersede it.
- Final local and GitHub workflow outcomes are recorded in the PR/delivery report. No claim is made that every authored question has undergone independent human academic review, or that automated prose checking can certify teaching quality.

## Known issues and unfinished work

- Six species still lack transparent stage-specific walking pairs; three original species lack some higher-stage pairs. Existing artwork, evolution cards and the Phaser fallback remain available. New Guardian art was not invented, replaced or deleted.
- The castle is a human-painted medieval landscape, not a photograph of a named historical castle.
- Conceptual skills without verified changed evidence may have no fresh transfer available. Such cases stay pending rather than receiving false independent mastery.
- Written diagnostic/teach-back prose remains reviewable evidence, not automatically certified understanding. Browser audio requires user activation and a browser-supported decoder; failures show a recoverable message.
- Tests use isolated fixture saves, including eleven distinct saved Guardian IDs and duplicate Briars. They do not inspect or overwrite a learner’s private browser save.

## Break/fix guide

- Missing music: check the top-bar music setting, browser activation restrictions and the local `.ogg` request. Mute and retry playback. Keep the recording and attribution together; do not replace it with an unlicensed file.
- Missing castle/low contrast: inspect `room-identities.css`, the Commons-owned banner and `screenshot-learning-repairs.css`’s exemption for the castle entrance. Keep the opaque purple copy panel. The image is decorative; academic controls remain usable if it cannot load.
- Feedback disappears: inspect `course-tutor.js` hydration/startup guards and the current DOM lesson key. Do not rebuild a mounted answer form to refresh source metadata.
- Recovery loops or early mandatory repair: inspect the existing course’s `adaptiveSkills[*].reconstructionBySkill` record, attempt IDs and `skillResult` recovery ownership. Do not reset progress to bypass it.
- Pixi cannot load/render: use the existing **original Sanctuary** fallback. Check the registry, asset request, current renderer and saved IDs. Never deduplicate by species or replace custom names to fix rendering.
- Furniture fails to save: inspect the existing action acknowledgement and account furniture record. Preserve saved positions/inventory and reject stale snapshots; do not create another room-state store.
- Deployment/integrity fails: use the failed workflow log and intentional source diff, recompute only reviewed hashes, rerun the build and affected tests, then rerun the established Pages workflow.
- Rollback: revert this repair’s merge commit through Git, rebuild and republish through the existing workflow. This reverses source/assets only. Never clear localStorage/IndexedDB, factory-reset the account, delete Guardians, or overwrite study progress, XP, crystals or inventory.

## Exact files changed

- `.github/workflows/deploy-majick-pages.yml`
- `CURRENT_BUILD.md`
- `HANDOFF_LATEST.md`
- `REPAIR_AND_IMMERSION_REPORT_2026-10-30.md`
- `current-site/aetheria-brand.js`
- `current-site/anchor-interactives.js`
- `current-site/animation-effects.js`
- `current-site/assets/IMMERSION-CREDITS.html`
- `current-site/assets/audio/dreams-become-real.ogg`
- `current-site/assets/rooms/landscape-castle.webp`
- `current-site/assets/rooms/licenses/GPL-2.0.txt`
- `current-site/collegium-atmosphere.css`
- `current-site/collegium-atmosphere.js`
- `current-site/collegium-commons.js`
- `current-site/course-tutor.js`
- `current-site/d772-adaptive-mastery.js`
- `current-site/d772-misrepresentation-lab.js`
- `current-site/d772-preassessment-review.js`
- `current-site/embedded-practice.js`
- `current-site/game-realm.js`
- `current-site/generated-question-engine.js`
- `current-site/index.html`
- `current-site/learn-mode.js`
- `current-site/learning-continuity.js`
- `current-site/living-magic.css`
- `current-site/pixi-sanctuary/index.html`
- `current-site/pixi-sanctuary/prototype.js`
- `current-site/probability-workshop.js`
- `current-site/question-repair.js`
- `current-site/room-identities.css`
- `current-site/room-identities.js`
- `current-site/room-section-nav.js`
- `current-site/sanctuary/Game.js`
- `current-site/screenshot-learning-repairs.css`
- `current-site/solution-engine.js`
- `current-site/source-manifest.json`
- `current-site/teach-back.js`
- `current-site/v339-main.js`
- `current-site/wgu-practice.css`
- `current-site/wgu-practice.js`
- `current-site/your-turn-practice.js`
- `pages-release/current/browser-hands-on-recovery.cjs`
- `pages-release/current/browser-immersion.cjs`
- `pages-release/current/browser-interactions.cjs`
- `pages-release/current/browser-probability.cjs`
- `pages-release/current/browser-sanctuary.cjs`
- `pages-release/current/browser-shared-repair.cjs`
- `pages-release/current/commons-interactions.cjs`
- `pages-release/current/test-d772-bank-expansion.cjs`
- `pages-release/current/test-d772-hands-on.cjs`
- `pages-release/current/test-interaction-magic.cjs`
- `pages-release/current/test-shared-repair.cjs`
- `pages-release/current/test-six-enhancements.cjs`
