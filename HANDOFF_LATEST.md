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

- **Core study app:** 92%
  - Main navigation, Study Now, course selection, Guardian/account progression, and most study flows exist.
  - Remaining work is mostly regression testing and making sure newer release layers do not overwrite older working screens.

- **Study Material / Notes Forge:** 88%
  - Upload/paste flow, parsing modules, source storage, question building, and course isolation are implemented.
  - Still needs full live testing with PDF/DOCX/paste inputs and confirmation that generated questions stay isolated to the selected course.

- **Course system / pass-a-class flow:** 90%
  - New-course creation, fresh per-course streaks, persistent account XP, and course completion logic are implemented.
  - Still needs live end-to-end testing after the shell/runtime issue is stable.

- **Living Sanctuary / Phaser 4:** 74%
  - Original Phase 4 movement system is preserved.
  - Object manifest, evolution manifest, furniture routing, stage resolver, and corrected 60 evolution action assets exist.
  - Biggest remaining work: make the live Sanctuary consistently load, confirm evolved visuals follow movement correctly, confirm play/sleep interactions, and eliminate shell/cache conflicts.

- **Guardian profile/evolution presentation:** 84%
  - Canon names, level bands, approved stage art, and larger profile presentation are implemented.
  - Still needs visual QA after cache/runtime repair.

- **Overall Majick Studies release readiness:** **85%**
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