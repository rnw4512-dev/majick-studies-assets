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
