# Majick Studies — Current V3.4.2

Updated: 2026-10-04

- Canonical runnable source: `current-site/`. Edit this source for future app changes.
- Publishing: `.github/workflows/deploy-majick-pages.yml` runs `pages-release/current/build.py current-site _site` only. No historical archive fetches, branch restoration, golden-build assembly, or version-folder overlays.
- V3.4.2 is live at https://rnw4512-dev.github.io/majick-studies-assets/.
- Runtime and Sanctuary share release cache keys. The release manifest is checked without browser caching; obsolete Majick worker caches are retired without clearing localStorage or IndexedDB.
- Removed the stale 3.3.52 document marker; unified visible release badges; renamed version-numbered runtime files to semantic current names while preserving function APIs and save schemas.
- The 33 original movement PNGs are hash-locked. Never replace them.
- `current-site/source-manifest.json` hash-locks the reviewed current source. After intentional source edits, update affected hashes in this manifest before publishing; preserve the protected motion hashes. The build refuses unreviewed source mismatches.
- Current source was frozen from the verified assembled V3.4.2 once; normal publishing never reconstructs it from old releases. Historical modules and save migrations remain where current behavior depends on them; this was a release/source consolidation, not a wholesale render-engine rewrite.
- Verified: current-source hash/asset checks, JavaScript and inline-script syntax, duplicate/local runtime URLs, ten targeted current-source Guardian/product/D772/Game Realm smoke checks, successful current-only Pages deployment, and browser navigation from Home into Sanctuary.
- No learner saves, XP, crystals, eggs, courses, or stored progress were intentionally reset. Browser verification used a separate browser world.
- Next reliability milestone: end-to-end browser release gate covering Learn → Practice → reward → Guardian/egg → reload; save export/recovery; current render-owner consolidation; then multi-user account isolation and sync before public onboarding.

## 2026-10-14 — Contrast gate repair (milestone prerequisite)

- Changed `current-site/readability-guard.css` to use explicit high-contrast surfaces for lesson badges, lesson navigation, chart controls, Guardian sidebar metadata/reward chips, Game Realm Guardian metadata, and the current lesson title badge. Updated only its hash in `current-site/source-manifest.json`.
- Base: `984430497cc09558b0d03296b13e82d1dbdb32be`, review branch `phase2-connected-probability`; no deployment. Build ID: `ac29da174a745b3e`.
- Verified canonical release checks, source-integrity/syntax build, and existing browser interaction assertions including full learner/world state equality after reload. Sampled mobile (390px) and desktop (1365px) solid-surface contrast gate now passes. Two gradient/image-backed lesson trap text samples remain unverified by the automatic audit; no claim of universal WCAG compliance or manual visual acceptance.
- See changes in Learn Lab lesson headings/navigation, sidebar Guardian labels, and Game Realm. Local verification: `node pages-release/current/release-checks.cjs current-site`; `python3 pages-release/current/build.py current-site /workspace/majick-dev/contrast-final`; `node pages-release/current/browser-interactions.cjs /workspace/majick-dev/contrast-final`.
- Recovery: if these elements become unreadable, inspect computed styles and whether readability-guard.css loaded; rebuild from current source to clear stale generated output. To roll back this change, remove only the added contrast blocks at the end of readability-guard.css and restore that file's previous manifest hash from the base commit. Do not reset unrelated work or learner storage. Motion assets, save schemas, XP, inventory and course separation are unchanged.
- Next: review remaining gradient-backed lesson text visually, then publish through the established Pages workflow after review. Acceptance: readable lesson content on mobile/desktop, unchanged release/browser checks and retained learner saves.

## 2026-10-14 — Phase 2 connected probability milestone (review branch)

- Extended the existing continuity tracker, generated probability engine, native Study Now/Game Realm answer reporting and reward bridge. Added one shared probability UI adapter across Learn Lab, Study Now and Game Realm.
- Flow: hands-on guided repair → two fresh independent OA-style responses with persisted whiteboard → changed-event classroom-role transfer → structured teacher diagnosis/model/exit question. Guided work cannot certify independence; written prose is saved but not semantically graded. New misconceptions revoke certification until repaired with fresh evidence.
- D755/D756 academic records and previous D772 history remain isolated. Account XP/crystals/chests remain global; existing Guardians, eggs and Sanctuary are preserved. No save reset or schema replacement.
- See `PHASE2_PROBABILITY.md` for exact changed files, source-manifest hashes, test commands, limits and safe recovery. New `browser-probability.cjs` is a required pre-deployment workflow gate. Protected motion hashes are unchanged. Preserved on `phase2-connected-probability` for PR review; no merge or deployment. Earlier contrast repair retained as a prerequisite for browser certification.
- Verified final build `ab702a34384ff656`: nine grouped release checks, canonical integrity/syntax build, established browser gate and new full probability browser gate passed. New browser coverage includes physical mouse events, native misses in all three environments, distinct data from the original miss, academic isolation and reload/replay checks.
- Remaining parchment accessibility checks are closed: actual mobile/desktop background-pixel measurements passed AA (initial manual minima 8.14:1 / 8.25:1). The complete browser gate now includes mandatory `parchment-contrast.cjs` assertions for both instances; no visual change, skipped check or waiver.
- Scope: probability is the first end-to-end milestone. Other requested skills and broad Phase 2 completion remain outstanding.

## Historical notes below — reference only; not current deployment instructions

# Majick Studies — LATEST HANDOFF

Updated: 2026-09-19
Current release target: V3.3.16 + Phase 4 motion/portrait hotfix

## Resume instruction
In a new chat, say:

**Continue Majick Studies from HANDOFF_LATEST.md and CURRENT_BUILD.md in rnw4512-dev/majick-studies-assets.**

Those two files are the source of truth. Do not rebuild from memory.

## Permanent handoff rule
Every meaningful change to Majick Studies must update this file before the work session ends.

Each handoff must include:
1. what changed
2. files changed
3. current deployment/build state
4. protected systems
5. known issues
6. what the user needs to do manually, if anything
7. exact next step

## What changed in this work session

### Guardian / Phaser repair
- Disabled the flawed V3.3.15 stage-action overlay that was hiding the original moving Phase 4 companions.
- Restored the original Phase 4 Guardian sprites as the authoritative live movement visuals.
- The original 33 files in `sanctuary/assets/motion/` remain protected and untouched.
- The old generated evolution walk/play/sleep art is NOT trusted for live movement because it was created from large sheets with excess transparent margins and neighboring fragments.
- Approved Guardian stage portrait art is used for profile/sidebar/evolution UI.
- UI portrait sizing was enlarged.
- A build-time upscaler was added so approved stage portraits deploy at 640×1000.
- The old art-sync ZIP is now used for finished furniture only; its flawed evolution-action sheets are ignored by the build.

### Course isolation
- Academic progress is isolated by WGU course.
- Each class has separate notes, generated questions, answers, mistakes, mastery, readiness, review queues, Grimoire state, and streak.
- Starting a new class begins a fresh class streak.
- Account-level Majick XP, Guardian growth, crystals/chests, and completed-course history persist across classes.
- Study Material includes a Course Center for creating a new course.
- Passing a course records completion and awards completion XP once.

### Notes Forge
- Add Study Material accepts PDF, DOCX, TXT, MD, and pasted text.
- Generated material is saved under the selected course only.
- Generated questions/vocabulary are injected only into that course.
- Moonlit Study Desk routes to Add Study Material.

## Files changed this session
- `pages-release/v3315/v3315-sanctuary.js`
- `pages-release/v3315/study-material/AddStudyMaterialPage.js`
- `pages-release/v3316/courseManager.js`
- `pages-release/v3316/v3316-main.js`
- `pages-release/v3316/v3316-main.css`
- `pages-release/v3316/v3316-apply.py`
- `pages-release/v3316/enlarge-approved-stage-art.py`
- `.github/workflows/deploy-majick-pages.yml`
- `CURRENT_BUILD.md`
- `HANDOFF_LATEST.md`

## Protected systems
Do not edit or replace:
- original 33 Guardian movement PNGs in `sanctuary/assets/motion/`
- known-good movement methods for luna/ember/nova/mallow
- the base Pages archive unless a deliberate full rebuild is approved

Internal Guardian IDs remain:
- luna = Velora
- ember = Cascade
- nova = Solstice
- mallow = Aurelia

Evolution stages:
- New Bond: levels 1–2
- Apprentice: levels 3–4
- Guardian: levels 5–7
- Ascendant: levels 8–11
- Celestial: level 12+

## Current known issue
True stage-specific moving Guardian art is NOT finished yet.

The previous shortcut of slicing evolution sheets was rejected because it produced small/broken sprites. Do not reuse those files for movement.

When stage-specific moving art is rebuilt, it must be:
- one Guardian at a time
- one stage at a time
- one action at a time
- transparent background
- tightly cropped around the Guardian
- no neighboring Guardian fragments
- no poster text
- sized consistently for Phaser
- reviewed before being wired into live movement

Until then, live Sanctuary movement must use the protected original Phase 4 sprites.

## User manual action
No manual code editing is required.

Do not edit `Preloader.js` manually.
Do not move anything into `sanctuary/assets/motion/`.

The user may upload approved art bundles only when explicitly instructed.

## Current next step
1. Verify the newest Pages build succeeds.
2. Confirm original Phase 4 walking Guardians are restored in the live Sanctuary.
3. Confirm approved stage portraits are large and visible in sidebar/profile cards.
4. Confirm Home uses the real Phaser Sanctuary.
5. Only after those are stable, rebuild true individual evolved motion art correctly instead of using sliced poster sheets.

## Latest deployment checkpoint
- Workflow YAML indentation error was found and fixed in commit `3a041132c3f5e64db0508703a4321be99026055a`.
- GitHub Pages run #40 is the current repair deployment and was **pending** at the last check because an older run was still occupying the Pages deployment queue.
- Do not judge the live app until run #40 completes.
- The old V3.3.15 evolution-action files are ignored for live movement.
- The protected original Phase 4 movers are restored as the live Sanctuary movement source.
- Approved stage portraits are enlarged to 640×1000 at build time for UI/profile cards.

## V3.3.17 Guardian evolution repair
- Corrected repair ZIP created: `majick-v3317-evolution-repair.zip`.
- Contains 60 true individual files: 4 Guardians × 5 stages × walk/play/sleep.
- Every asset is a 1024×1024 transparent WebP with one Guardian only, centered and enlarged for Phaser.
- New deployment support added for `sanctuary/assets/majick-v3317-evolution-repair.zip`.
- New Phaser layer: `pages-release/v3317/v3317-sanctuary.js`.
- The V3.3.17 layer uses the existing protected Phase 4 movement coordinates and overlays the correct evolved Guardian stage/action art.
- If the V3.3.17 assets are missing or fail to load, the original protected Phase 4 sprite remains the fallback.
- The user only needs to upload the single repair ZIP to `sanctuary/assets/`; do not unzip manually and do not touch `sanctuary/assets/motion/`.

## V3.3.17 corrected Guardian asset repair
- User uploaded: `sanctuary/assets/majick-v3317-evolution-repair-small.zip`.
- This is now the ONLY evolution-action ZIP the deployment should use.
- It contains 60 individual transparent WebPs: 4 Guardians × 5 stages × walk/play/sleep.
- Deployment extracts those files into `sanctuary/assets/evolutions/<guardian>/<stage>/<action>.webp`.
- V3.3.17 uses original Phase 4 movement coordinates/behavior as the controller and overlays the correct stage-specific visual.
- V3.3.15 emergency restore now yields when V3.3.17 is active so the two layers do not fight over sprite opacity.
- V3.3.17 Guardian visual size target was increased to approximately 230–360 px high in the Sanctuary.
- The build now verifies at least 60 evolution WebPs plus representative files from Velora, Cascade, Solstice, and Aurelia before deployment.
- Deployment SUCCESS: GitHub Pages run #48, commit `b6f501b7eca6afd5bb6841fceccd5d37b0e080ad`.
- The uploaded `majick-v3317-evolution-repair-small.zip` was accepted by the build and V3.3.17 deployed successfully.
- User can now hard-refresh the live Majick Studies app and test Guardian size, stage visuals, Phase 4 walking, play/sleep interactions, Home Sanctuary, and Notes Forge.

## V3.3.17 authoritative shell fix
- Added `pages-release/v3317/v3317-main.js`.
- Added `pages-release/v3317/v3317-apply.py`.
- The main app shell now owns the visible release badge: `Living Familiars • V3.3.17 Guardian Repair`.
- The shell reapplies that badge after every app render and after DOM mutations so older V3.3.8/V3.3.16 labels cannot overwrite it.
- The service-worker cache is now bumped to `majick-studies-v3-3-17-guardian-repair`.
- `app-progress.json` is updated to V3.3.17 during deployment.
- Workflow now verifies `v3317-main.js`, the V3.3.17 app-progress marker, and the V3.3.17 service-worker cache before Pages can publish.
- Deployment SUCCESS: GitHub Pages run #52 (`98dd087d11739b1c48f88de71eaccc17b939ccea`) completed successfully. V3.3.17 is now the authoritative main shell and Sanctuary release.

- Run #52 passed assembly, Pages configuration, artifact upload, and GitHub Pages deployment.

## V3.3.17 cache-reset launcher
- GitHub Pages run #54 completed successfully.
- Deployed launcher: `/refresh-v3317.html`.
- The launcher unregisters old service workers, deletes all `majick-studies-*` browser caches, then redirects to a fresh V3.3.17 URL.
- Use this launcher when the browser still shows V3.3.8 or V3.3.15 after a successful deployment.
- Screenshot at 2026-09-20 00:08 showed a mixed cached shell: V3.3.15 Notes Forge header plus the legacy Conservatory and runtime snag modal.
- Next action: open `https://rnw4512-dev.github.io/majick-studies-assets/refresh-v3317.html` once, let it redirect, then test the live app before changing more code.

## V3.3.17 fail-safe reset launcher repair
- Screenshot showed `refresh-v3317.html` stuck indefinitely on "Preparing V3.3.17…".
- Root cause addressed by removing dependence on long-running service-worker/cache promises before redirect.
- Launcher now starts a hard JavaScript redirect timer immediately.
- Launcher has a 4-second HTML meta refresh as a second independent fallback.
- Launcher includes a visible "Open V3.3.17 Now" link as a third fallback.
- Service-worker unregister and cache deletion are attempted with short timeouts and cannot block navigation.
- Current deployment: GitHub Pages run #55, commit `1df9af87ff07a765e377b170661741726c470da7`, assembling at last check.

## How close are we to done?
These numbers are release-readiness estimates, not marketing numbers.

- **Core study app:** 93%
  - Main navigation, Study Now, course selection, Guardian/account progression, and most study flows exist.
  - Remaining work is mostly regression testing and making sure newer release layers do not overwrite older working screens.

- **Study Material / Notes Forge:** 88%
  - Upload/paste flow, parsing modules, source storage, question building, and course isolation are implemented.
  - Still needs full live testing with PDF/DOCX/paste inputs and confirmation that generated questions stay isolated to the selected course.

- **Course system / pass-a-class flow:** 90%
  - New-course creation, fresh per-course streaks, persistent account XP, and course completion logic are implemented.
  - Still needs live end-to-end testing after the shell/runtime issue is stable.

- **Living Sanctuary / Phaser 4:** 84%
  - Original Phase 4 movement system is preserved.
  - Object manifest, evolution manifest, furniture routing, stage resolver, and corrected 60 evolution action assets exist.
  - Biggest remaining work: make the live Sanctuary consistently load, confirm evolved visuals follow movement correctly, confirm play/sleep interactions, and eliminate shell/cache conflicts.

- **Guardian profile/evolution presentation:** 91%
  - Canon names, level bands, approved stage art, and larger profile presentation are implemented.
  - Still needs visual QA after cache/runtime repair.

- **Overall Majick Studies release readiness:** **89%**
  - We are past the foundation/build stage.
  - The remaining work is mainly **stability, visual QA, and integration testing**, not rebuilding the app from scratch.
  - The project should not be called finished until the live site opens cleanly, reports the current version, Sanctuary works without a snag modal, evolved Guardians display correctly, and Notes Forge passes live document tests.

### Definition of “done”
Majick Studies is ready to call finished when all of these are true:
1. Live app opens cleanly with the current release label.
2. No old service-worker/shell version takes over.
3. Home and Companions both show the real Phaser Sanctuary.
4. Original Phase 4 movement remains stable.
5. Current-stage Guardian visuals display at the correct size.
6. Walk/play/sleep interactions work without hiding or shrinking Guardians.
7. Study Material accepts PDF, DOCX, TXT, MD, and pasted notes in the live app.
8. Generated questions, vocabulary, explanations, and repair material save only to the selected course.
9. New courses start a fresh streak while overall XP/Guardian growth persists.
10. Passing a course records completion and awards completion XP once.
11. All major screens pass one complete click-through regression test.
12. HANDOFF_LATEST.md and CURRENT_BUILD.md match the deployed release.

## Latest stability checkpoint
- GitHub Pages run #58 completed **successfully**.
- Published artifact verification:
  - old service-worker registration count: 0
  - old `Moonlit V5.2 runtime error` handler count: 0
  - new `Majick V3.3.17 runtime error` handler count: 1
  - `v3317-main.js?v=3317` is present in the published index
  - service worker is a retired/non-intercepting worker and unregisters itself
  - app-progress reports `V3.3.17 Guardian Repair + Course Realms + Stability Hotfix`
- This is the first published build in this repair sequence that removes the stale-shell mechanism from the built app itself, rather than only trying to clear it from the browser.

## Guardian action-art status
- The build contains all 60 expected evolution action WebPs, but visual inspection found that the previously uploaded V3.3.17 ZIP still contains bad crops in some files.
- Example inspected: `velora/ascendant/walk.webp` still included neighboring-sheet artwork before cleanup.
- Do NOT mark the stage-specific motion art finished yet.
- A clean extraction method from the original four action sheets has now been validated locally:
  - Velora: all 15 states clean
  - Cascade: all 15 states clean
  - Aurelia: all 15 states clean
  - Solstice: essentially clean, with one tiny residual fragment identified for final cleanup
- The protected original 33 Phase 4 motion PNGs remain untouched and continue to be the movement controller.

## Final clean Guardian bundle prepared
- A new binary bundle was rebuilt from the original four Guardian action sheets using adaptive stage/action extraction and stray-fragment cleanup.
- File prepared for user upload: `majick-v3317-evolution-final-clean.zip`.
- Size: about 7.21 MB.
- Contents: 60 individual 1024×1024 WebPs at `sanctuary/assets/evolutions/<guardian>/<stage>/<walk|play|sleep>.webp`.
- This bundle replaces the visually flawed `majick-v3317-evolution-repair-small.zip` once uploaded.
- Deployment workflow now automatically prefers `sanctuary/assets/majick-v3317-evolution-final-clean.zip` when present and falls back to the older repair ZIP only if the final-clean bundle is absent.
- Solstice Celestial play received a final manual bottom-fragment trim before the ZIP was repacked.
- No files in `sanctuary/assets/motion/` are changed.

## Run #60 final-clean Guardian deployment
- User successfully uploaded `sanctuary/assets/majick-v3317-evolution-final-clean.zip`.
- GitHub Pages run #60 completed **successfully**.
- Published artifact was downloaded and inspected.
- Exact verification:
  - final-clean ZIP contains 60 evolution WebPs
  - published Pages artifact contains 60 evolution WebPs
  - **all 60 published files match the final-clean ZIP byte-for-byte**
  - no mismatches found
- Representative published files verified:
  - `velora/ascendant/walk.webp`
  - `cascade/celestial/sleep.webp`
  - `solstice/celestial/play.webp`
  - `aurelia/apprentice/play.webp`
- Visual inspection of deployed Velora Ascendant walk shows one clean Guardian on transparent background with no neighboring poster fragments.
- Published shell verification remains clean:
  - `v3317-main.js?v=3317` present
  - old service-worker registration absent
  - old V5.2 crash handler absent
  - V3.3.17 runtime handler present
  - app-progress reports `V3.3.17 Guardian Repair + Course Realms + Stability Hotfix`
- The final-clean Guardian bundle is now the deployed source of truth for stage-specific evolution action art.
- Protected original 33 Phase 4 movement PNGs remain untouched and remain the movement controller.

## Run #74 Phaser freeze-prevention release
- GitHub Pages run #74 completed **successfully** and deployed.
- This release added permanent anti-freeze and anti-regression gates before Pages publication.
- The release verifier passed with these exact results:
  - 33 protected Phase 4 motion PNGs are byte-for-byte identical to the repository originals.
  - Phaser runtime motion bundle: **2,205,848 bytes** (~2.10 MiB).
  - Phaser runtime furniture bundle: **399,500 bytes** (~0.38 MiB).
  - Total startup image budget: **2,858,424 bytes** (~2.73 MiB).
  - Previous full-size motion preload was ~53 MiB compressed and ~198 MiB decoded; Phaser no longer loads those originals at startup.
  - Runtime motion uses 33 derived 512x512 WebPs under the same Phaser texture keys.
  - Final-clean Guardian evolution action WebPs remain in `assets/evolutions/` and load on demand; they are no longer rebuilt during CI.
  - Only 9 placed/preloaded Sanctuary objects are generated for startup. The full ~95-object manifest remains the source of truth, and uploaded final art still passes through unchanged.
- Exact published Sanctuary script chain verified:
  1. `phaser.min.js`
  2. `Boot.js`
  3. `MainMenu.js`
  4. `Preloader.js`
  5. `Game.js`
  6. `v3310-sanctuary.js?v=3310`
  7. `v3317-sanctuary.js?v=3317-clean`
  8. `bridge.js`
- V3.3.11–V3.3.15 Sanctuary wrappers remain prohibited from the published runtime.
- The V3.3.17 release badge now writes only when its value actually changes, preventing a MutationObserver feedback loop.
- The old V3.3.10 live-scene startup restart was removed from the published copy; all movement methods remain.
- GitHub Pages deploy occurs only after the full release verifier passes. A failed future verification cannot replace the last successfully deployed live site.
- This freeze-prevention rule is now permanent for future Sanctuary work.

## DESIGN NORTH STAR — Adult Magical College Fantasy

Majick Studies should feel like the user is attending a **dark, high-fantasy adult magical college** while completing real WGU coursework.

The experience target is:
- **Adult Hogwarts / magical university**, not a children's school.
- **Dark academia + high fantasy + adult magical-girl energy**.
- Elegant, moody, romantic, celestial, slightly sexy, polished, and immersive without becoming explicit.
- The Sanctuary should feel like a **magical dorm / familiar residence**: beds, study furniture, moonlight, books, crystals, celestial objects, and lived-in personal space.
- The four Guardians are **pets/familiars the user cares for**, not just profile icons.
- Guardians should be fed, rested, played with, brushed/cared for, given treats, and given furniture/toys/items.
- XP, crystals, streaks, course progress, and achievements should feed a visible **game economy** that lets the user unlock/buy/craft Sanctuary objects and Guardian-care items.
- The study experience should feel like **playing a fantasy game that happens to teach the course**:
  - trivia / challenge games
  - adaptive questions
  - matching / recall / boss-style study
  - vocabulary and misconception repair
  - Notes Forge from the user's real course materials
  - visible progression, rewards, Guardian growth, and world unlocks
- Real academic data must remain course-specific, while account-level XP/Guardian growth and long-term magical-world progression persist across classes.
- The visual tone should stay whimsical and cute where the Guardians are concerned, while the world itself feels mature, mysterious, magical, and academically prestigious.
- Avoid generic SaaS/dashboard feeling whenever a more immersive in-world interaction can serve the same function.
- Avoid childish classroom styling.
- Avoid flat placeholder art or furniture that does not feel like it belongs in the same world.
- Every new feature should answer: **Does this make Majick Studies feel more like living and studying inside this magical college, or is it just another app screen?**

### Experience completion score
Track this separately from technical release readiness.

Current estimate:
- Dark magical-college visual identity: **88%**
- Sanctuary / dorm-room atmosphere: **82%**
- Guardian pet-care fantasy: **58%**
- Study-game / trivia fantasy integration: **82%**
- XP / crystals / rewards economy: **68%**
- Course-world continuity and progression: **84%**
- Adult magical-girl / high-fantasy polish across all screens: **74%**
- Overall fantasy-world experience realization: **77%**

### Biggest experience gaps
1. **Guardian care loop** is not complete enough yet.
   - feeding
   - water
   - treats
   - brushing/grooming
   - play/toys
   - sleep/rest
   - affection/bond reactions
   - visible needs/status
2. **Crystal economy** needs a stronger spend loop.
   - buy/unlock Sanctuary objects
   - buy Guardian food/treats/toys
   - cosmetic/decor rewards
   - meaningful reasons to earn crystals through study
3. **Sanctuary needs to feel more lived-in and customizable.**
   - reliable furniture dragging/saving
   - object inventory / placement
   - more final-quality decor
   - Guardian-object interactions
   - room upgrades / unlockable zones
4. **Study screens need more in-world framing.**
   - make quizzes feel like trials, classes, duels, rituals, constellations, archives, or exams inside the magical college
   - reduce generic dashboard moments
5. **Magical college progression needs stronger ceremony.**
   - entering a new WGU course should feel like enrolling in a new magical class
   - passing a course should feel like completing a term/course rite
   - unlocks, badges, dorm upgrades, and Guardian evolution should reinforce progression
6. **Adult magical-girl polish** is not yet consistently expressed on every screen.
   - more celestial fashion/editorial elegance
   - richer dark-academia textures and ornament
   - refined typography, lighting, and transitions
   - keep Guardians cute/fluffy against the mature environment

## Run #80 — Study Now XP snag + Guardian Care release
- GitHub Pages run #80 completed **successfully** and deployed.
- Root cause of the Study Now snag was identified exactly:
  - legacy inline `prog()` returned `S.progress[S.activeCourse]` with no fallback;
  - during first render of a newly initialized/switched course, that record could briefly be undefined;
  - Study Now then read `prog().xp`, causing `Cannot read properties of undefined (reading 'xp')`;
  - Reload appeared to fix it because the course-progress record existed by the second render.
- Permanent fix:
  - assembled `prog()` now synchronously creates/normalizes the active course progress object before XP, crystals, streaks, answers, inventory or chests are read;
  - release verification fails if the unsafe legacy `prog(){return S.progress[S.activeCourse]}` implementation ever returns.
- Run #80 verifier explicitly passed:
  - `Study progress state hardening verified: XP/crystal reads cannot see undefined progress`
  - `Guardian care + Moon Crystal economy contract verified`
  - owned-roster model: `pet.id`
  - egg model: incubator until hatch
  - 6 care stations verified
- Guardian Care release now includes roster-driven hatched Guardians and separate incubating eggs.
- Phaser freeze protections remain intact:
  - protected 33 motion originals unchanged;
  - runtime motion: 2,205,848 bytes;
  - runtime furniture: 449,014 bytes;
  - total startup image budget: 2,907,938 bytes (~2.77 MiB).
- This is now the active verified live build.

## Run #82 — Old-save migration repair
- GitHub Pages run #82 completed **successfully** and deployed.
- Fixed two user-visible runtime errors from older saved state:
  - `Cannot read properties of undefined (reading 'xp')`
  - `a.guardianOwned is not iterable`
- Root cause of remaining XP error:
  - some legacy course-progress entries could be null/undefined before V4/V5 and `courseManager.js` mirrored shared XP;
  - startup now normalizes **every** saved course progress row before any XP/crystal/streak access;
  - `courseManager.js` also normalizes malformed rows before mirroring shared account values.
- Guardian ownership migration:
  - old arrays remain arrays;
  - Set/string/old boolean-map ownership formats are converted safely;
  - truthy old purchases are preserved;
  - false old-map entries are discarded;
  - old array-style Guardian inventory is converted into quantity counts.
- Added a permanent Node migration smoke test using:
  - malformed PMFC/D772/GHOST progress,
  - 1511 XP / 200 crystals,
  - old Guardian ownership map,
  - old inventory array,
  - two hatched Guardians (Velora + Solstice),
  - one incubating egg.
- Run #82 verified:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Study progress state hardening verified`
  - `Legacy save migration verified`
  - `Guardian care + Moon Crystal economy contract verified`
  - `Single V3.3.17 recovery surface verified`
- Removed stacked legacy error surfaces. Runtime failures now route to the single V3.3.17 recovery dialog.
- Phaser startup budget remains safe at **2,907,938 bytes (~2.77 MiB)**.

## Run #83 — Single render owner repair
- GitHub Pages run #83 completed **successfully** and deployed.
- Fixed fatal startup error: `oldRender is not a function`.
- Root cause:
  - V3.3.11 main and V3.3.11 plus were still wrapping `window.render`;
  - CourseManager also wrapped the Study Material renderer;
  - V3.3.17 already owns final rendering, so the legacy render-hijack chain was brittle and could capture a non-function reference during startup.
- Repair:
  - removed the obsolete V3.3.11 main render hijack;
  - removed the obsolete V3.3.11 plus render hijack;
  - kept Living Grimoire/evolution functionality without re-wrapping global render;
  - CourseManager now wraps Study Material only when the previous renderer is actually a function;
  - V3.3.17 now guards its base renderer before installing the final render bridge.
- Permanent verifier rule added: published builds fail if legacy `oldRender()` global-render hijacks return.
- Run #83 verifier explicitly passed:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Single render owner verified: V3.3.17 only`
  - `Guardian care + Moon Crystal economy contract verified`
  - `Study progress state hardening verified`
  - `Legacy save migration verified`
- Phaser startup budget remains safe at 2,907,938 bytes (~2.77 MiB).

## Run #84 — Base renderer / inline-script repair
- GitHub Pages run #84 completed **successfully** and deployed.
- Fixed fatal startup error: `Base render function is unavailable.`
- Exact root cause:
  - V3.3.17 clean sanitizer removed legacy error UIs with regex replacements;
  - two replacement strings accidentally restored only one closing brace instead of the original two;
  - this left the base inline app script and the V5 inline script with `SyntaxError: Unexpected end of input`;
  - because the base inline script could not parse, its `render()` function never existed.
- Repair:
  - restored the two missing closing braces in `v3317-clean-sanitize.py`;
  - retained the single V3.3.17 recovery boundary;
  - retained removal of obsolete render hijacks;
  - added mandatory final-artifact inline-script syntax verification.
- Permanent release gate now:
  - extracts every inline `<script>` from final assembled `index.html`;
  - runs `node --check` on every classic inline script;
  - fails deployment if any inline script is invalid;
  - proves the base `render()` declaration occurs before `v3317-main.js` loads.
- Run #84 explicitly passed:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Single render owner verified: V3.3.17 only`
  - `Inline JavaScript syntax verified: 17 scripts`
  - `Base render order verified: inline script 0 before V3.3.17 script 28`
  - `Majick Studies V3.3.17 assembled successfully.`
- This is now the active verified live build.

## 2026-09-30 — D755 law/referral continuation
- Resumed from main commit 3febecc54b1d33c20532f0f46631d5a497ec7d80 (130 D755 questions, 56 assessment-identification scenarios, 10 law/case questions and 10 referral-stage questions).
- Corrected Law + Referral drill intro button to name the drill instead of Mock OA.
- Each 12-question round keeps six law/case and six referral-stage questions and prioritizes questions absent from the preceding round. Two consecutive rounds cover all 20 questions. Some overlap is necessary because each category has ten questions and each round uses six.
- Files changed: pages-release/v3339/d755-retake.js and d755-retake-smoke.js; HANDOFF_LATEST.md; CURRENT_BUILD.md.
- Verification: JavaScript syntax and complete D755 smoke passed; bank remains 130, diagnostic 30, mock 40, section check 8; existing XP 4987 preserved by smoke. Added checks for the correct start label and two-round coverage.
- Deployment state: local verification complete; this checkpoint does not assert Pages deployment success. Check the GitHub Actions run for this change before calling it live.
- Protected: original Guardian motion assets, single render owner, course-isolated progress, existing XP/crystals and question bank.
- User manual action: none.
- Next step: verify Pages deployment and live Law + Referral drill, then continue Guardian/Sanctuary integration and game visuals from current repository code.

## 2026-09-30 — D755 visual sorter and fresh-scenario repair
- Added six fully specified scenarios with four independent classifications (24 decisions): data type, administration, purpose, comparison. Cards explain the exact scenario evidence after submission; saved results show each dimension.
- Added Why I Missed It feedback in diagnostic/drill modes. Assessment misses offer three different same-dimension scenarios; three correct transfer answers resolve the original mistake. Mock OA still withholds teaching feedback during the simulation.
- Assessment mistakes from diagnostic and mock now join the existing D755 repair queue.
- Existing 130-question bank and XP preserved. Sorter evidence is stored separately from existing mastery ladder.
- Changed D755 JS/CSS, smoke, build/cache keys and release gates; handoff/build notes.
- Syntax and complete D755 smoke passed, including 24 sorter decisions, same-dimension transfer, source exclusion, original diagnostic preservation, mistake resolution, XP preservation.
- Deployment pending at this checkpoint; verify the Pages run and published files before stating live.
- Protected motion assets/render owner and course-isolated saves untouched. User manual action: none.
- Next: verify live sorter and feedback; expand spaced review/confidence tracking later.

### Sorter live-navigation repair checkpoint
- Browser click-through exposed an existing mode-handler scope error (st undefined); fixed in 496547638979d9d8732f9774501c714a8d102f69.
- Added smoke coverage for the actual bound mode-button callback; all D755 smoke assertions pass.
- Initial feature and navigation-fix Pages runs passed. Browser retained the earlier script, so the script cache key is now 3340-study-repair-sorter-navfix with matching release gates.
- Final browser verification must include opening Visual Assessment Sorter, starting a case, selecting four labels and viewing feedback. Final cache-key deployment pending at this checkpoint.

### Final visual verification checkpoint
- Cache-refresh deployment passed; live browser opened Visual Assessment Sorter, started a case, selected all four labels and received all four evidence explanations without the navigation error.
- Visual check found unused tutor-column space and dimmed disabled labels. CSS now gives the sorter the full main area and preserves white submitted labels; mobile remains one column. CSS cache key: 3340-study-sorter-readable.
- Existing bank remains 130 plus six sorter scenarios (24 separate classification decisions). Sorter/state/transfer and real navigation callback smoke passed.
- Final readability CSS deployment pending at this checkpoint; verify screenshot and Pages run. No user code editing needed.


## 2026-09-30 — Timelines, behavior process, and study comfort
Added 16 federal IDEA timeline scenarios and 12 behavior/IEP scenarios (158 total), with dedicated 12-question drills and official-source feedback. Diagnostic/mock deliberately include both areas. Added per-course return-to-study and course selection shelf plus persisted reduced-motion/larger-text preferences. D755 and Living Collegium smoke tests passed; publication verification pending.


## 2026-09-30 — Process guide and review enhancements
Prior timelines/behavior/comfort deployment 66ee322 passed full Pages workflow and live UI checks. Added timeline comparison table, behavior step guide, readable official links, optional in-drill reminders, saved missed-answer review across D755 exam modes, and resume of unfinished drills. Fixed existing incorrect variable in missed-trap counts, which crashed result completion after wrong answers. New wrong-answer, legacy-result, and resume smoke coverage passed; Golden build and stability verifier passed.


## 2026-09-30 — Process practice progress and focused review
Previous guide/resume/review build 7c2afe3 passed Pages deployment and live UI checks. Added timeline and behavior evidence cards on D755 home/results, using latest per-question answers including mixed practice. New submissions persist bounded per-question evidence. Six-question focused reviews prioritize missed decisions and other practice, and cannot replace paused rounds. Narrow-panel timeline comparisons become labeled stacked cards instead of clipped columns. Process evidence, separation, latest-answer resolution, six-question completion, and paused-round preservation tests passed, along with existing D755 smoke and Golden build verification.


## 2026-09-30 — Saved question shelf
Previous process progress build 5616a42 passed deployment and live card/guide checks. Added D755 question bookmarks across drills, diagnostic, mock, and section checks; saved-question shelf with optional explanation details; up-to-10-question saved review; and home resume list for unfinished exam modes. Unsave preserves ongoing review IDs. Added duplicate-submit guards to exam and section-check handlers. Empty shelf, exact review limit, wrong-answer results, unchanged bookmarks after completion, invalid IDs, paused review preservation, and unchanged lifetime XP tests passed. Golden build/stability verifier passed.


## 2026-09-30 — App-wide course resume and reading comfort
Previous saved shelf build 0d9da93 passed deployment and live save/reload/unsave checks. Added Home Continue studying card, per-course Learn Lab tool memory (retake/tutor/plan/instruction/vocab/tools/etc), safe restore after navigation with course/screen guards, per-course toolkit expansion memory, toolbar Page top action respecting reduced motion, visible comfort summary, default-settings reset, and larger text for tables. Capture-phase tool listener handles existing stopPropagation callbacks. Tests cover course isolation, stale restore guards, valid tool parsing, unchanged-location save deduplication, comfort reset preserving course location, and scroll behavior; Golden build and stability verification passed.


### Course resume follow-up verification
Live D772 testing caught delayed Tutor hydration switching Vocabulary back to Course Path after restore. Tutor startup now skips its default switch when a course has a saved tool and stops after course/screen changes. Added actual delayed-hydration bind regression cases for saved tool, course switch, leaving Learn Lab, and default path. Toolbar labels refresh immediately after selecting a tool. Smoke/build/verifier passed.


### Startup panel coordination
Additional live checking found Learn Mode also reopening its default classroom after navigation. Both D772 Learn Mode and D755 Retake startup callbacks now respect another saved tool and stop after course/screen changes. Added actual bind callback regression tests for both modules; smoke and full build verification passed. This completes coordination across Tutor, Learn Mode, and Retake startup.

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

## 2026-10-24 — Screenshot fixes: native menu contrast and wardrobe mirror
- Native option menus explicitly set dark text, WebKit text fill and a light background instead of inheriting ivory text on the OS white popup. Guided select surfaces use the same readable palette.
- Wardrobe preview notice was a sibling inside the horizontal figure flex container, shrinking the scholar. Existing renderer now keeps only artwork in the figure and moves notes into collapsed Preview details below the tools. Removed duplicate mirror pseudo-heading and corrected the Wardrobe title. Existing art layers, saved appearance and approved proportional transforms are unchanged.
- Corrected the screenshot’s instructional mismatch: without-replacement source scenarios choose dependent-draw recovery rather than the broad Independence label; already-paused independent-spinner examples show independent-event guidance without rewriting their saved question/answers.
- Development update: canonical hashes/syntax and targeted preservation/academic checks required; full three-width stable certification pending. Work isolated from unrelated local image edits. Rollback by scoped revert/rebuild, never clear saves.

- Release follow-up: the mandatory mastery fixture still submitted the same item five times, conflicting with the recently strengthened distinct-question requirement on main. Updated the fixture to five distinct, valid median datasets and added an explicit repeat-cannot-certify assertion; no runtime mastery protection was weakened.


## 2026-10-24 — PixiJS Atelier development update

- Active screen is scholar-wardrobe-studio.js, reached through the existing Atelier launcher. Added local pinned PixiJS 8.6.6 (MIT license included), loaded only on opening the mirror, with room/scholar/magic render groups inspired by the requested PixiJS rendering example.
- Larger responsive mirror, lit ellipse platform, gentle ambient motes, full/closer view controls, mobile preview before selectors, improved selected/focus states. Existing fitted image geometry drives sprite placement, keeping the current approved art. DOM image fallback remains visible until all textures load; approved pose/walk composition remains with the existing approval owner.
- No save schema, reward, XP, crystal, academic, Guardian or Sanctuary changes. GPU application, resize observer and listeners are disposed on close/rerender. Reduced motion and hidden-tab pausing are supported. No substitute walking frames or artwork were introduced.
- Files: current-site/atelier-pixi-scene.js, scholar-wardrobe-studio.js, index.html, vendor/pixi-8.6.6.min.js, vendor/PIXI-LICENSE.txt, source-manifest.json.
- Development release only; full responsive stable certification pending. Verify live mirror rendering, appearance switches, approved pose fallback and reload before stable promotion. Rollback: revert this focused commit, leaving learner storage untouched.

- QA: canonical release checks pass; browser confirmed fitted hair switching, numeric zoom state and all image loads. Test browser has no WebGL (Pixi reports CanvasRenderer not implemented); graceful image/CSS room fallback verified. GPU render path and full 390/820/1366 certification remain unverified.


## 2026-10-24 — Atelier recovery and compact fitting room
- Screenshot showed missing avatar/thumbnails; exact remote image failure was not reproduced. Added automatic single image retry, visible loading/failure status, manual Retry artwork and a session-only simple mirror switch. Restores image visibility after a successful retry; no save reset. Pixi now renders before hiding the image fallback and returns to it on context loss.
- Fixed confirmed async races: stale pose/walk requests cannot overwrite a newer outfit; a composed still frame is decoded before replacing the current fitted preview. Static approved frames are labelled honestly, without implying dedicated Study/Sit/Celebrate animation. Removed stage-wide click binding accidentally inherited from the direction selector.
- Desktop controls scroll independently while the mirror and save actions fit the viewport. Smaller robe cards in a two-column grid, reduced sidebar, current robe/hair caption. Mobile retains preview-first ordering.
- Added mandatory test-atelier-preview-recovery.cjs for stale pose/walk, image decode failure and atomic replacement. Browser checked simple mirror, rapid Study→robe change, caption accuracy and all fitted image loads. Current browser has no WebGL; GPU path and full three-width stable certification pending.
- No artwork, WGU content, academic/reward owner, XP/crystals, Guardian/Sanctuary or saved appearance schema changes. Development publication after mandatory checks. Rollback via scoped revert; never clear storage.


## 2026-10-24 — Persistent avatar and lighted boutique vanity
- User reported the avatar disappearing while Pixi platform remained. Removed the character handoff entirely: existing fitted DOM/approved-pose renderer is the sole avatar owner; Pixi owns scenery/motes behind it and cannot hide/remove avatar images. Zoom/facing remain with the character owner, including approved frames.
- Added warm vanity bulbs, session-only lights on/off, champagne/blush mirror and wardrobe surfaces, rose-velvet sidebar, darker readable typography and current-look caption. Preserved art, stored outfit, reward and academic owners, Guardian/Sanctuary and motion assets.
- Mandatory tests include scenery isolation (no avatar/learner-state access), resize/context-loss cleanup and existing async pose regression. Browser reproduced screenshot choices (Waves/Sanctuary/Face left) with fitted avatar visible, plus light switch and image-load checks. GPU path/full stable responsive certification remain unverified; user explicitly authorizes development deployment without certificates.
- Rollback: scoped revert of this change; never clear learner saves. Publish through the existing workflow after canonical mandatory checks.


## 2026-10-24 — Readable probability table cells
- User screenshot: cream SVG question table body cells were visible only when selected. The renderer uses XHTML table cells inside SVG foreignObject; dark-room ivory text/glyph fill leaked into the cells while headers kept dark ink.
- Scoped readability-guard.css rule gives all shared question-table cells explicit dark ink (#253246), matching WebKit text fill, full opacity and cream surfaces (#fffdf7). No blanket changes to SVG data colors, answer keys, progress or room themes. Source hash updated.
- Mandatory canonical build and preservation checks required before development deployment. Full stable certification remains waived by user for development updates. Rollback via scoped revert; never clear learner storage.


## 2026-10-24 — Without-replacement anchor reminder
- Added a dedicated Without replacement reference on the existing Professor’s Anchor Wall, plus automatic focused chart routing for without-replacement questions. Uses the learner’s 3-green/2-purple example: dropdown order 3,5,2,4; 3/5 × 2/4 = 3/10 = 30%. Explains conditional multiplication, both count changes, dependent draws and the with-replacement contrast.
- Visual counters show before/after a green draw; collapsed calculator and whiteboard steps use the same scenario. No new renderer/state/progress owner, question record edits or independent mastery credit. Chart is reference/guided support.
- Targeted math/routing/no-state-access checks passed. Canonical integrity and preservation checks required before publishing; development update authorized without full certificates. Rollback with scoped revert; never clear saves.
