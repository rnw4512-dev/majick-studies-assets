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
- Current deployment: GitHub Pages run #48, commit `b6f501b7eca6afd5bb6841fceccd5d37b0e080ad`, assembling V3.3.17 at last check.
