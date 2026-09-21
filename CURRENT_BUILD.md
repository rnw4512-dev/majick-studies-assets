# Majick Studies — CURRENT BUILD SOURCE OF TRUTH

Last updated: 2026-09-20
Current target release: V3.3.30 — XP High-Water Repair

## How to resume in a new ChatGPT chat
Say: **"Continue Majick Studies from CURRENT_BUILD.md in rnw4512-dev/majick-studies-assets."**
Do not re-explain the project unless something changed.

## User workflow — KEEP THIS SIMPLE
- Do **not** edit files inside `pages-release/` manually.
- Do **not** edit `sanctuary/assets/motion/`.
- The original 33 Phase 4 motion PNGs are protected and remain the authoritative live movement system.
- When code changes are needed, ChatGPT updates GitHub directly.
- When new art is needed, use one clearly named asset bundle only when instructed.
- `pages-release/majick-pages-site.zip` is the base build archive. Leave it alone.
- Old patch ZIPs in `pages-release/` are implementation history; the user does not need to open or upload them.

## Current Guardian canon
- luna (internal) = Velora
- ember (internal) = Cascade
- nova (internal) = Solstice
- mallow (internal) = Aurelia

Evolution levels:
- New Bond: 1–2
- Apprentice: 3–4
- Guardian: 5–7
- Ascendant: 8–11
- Celestial: 12+

## HARD RULE — movement
Never rewrite or replace the original movement methods/files for Velora, Cascade, Solstice, or Aurelia.
The attempted V3.3.15 stage-action overlay was disabled because the generated action assets contained excessive transparent padding and neighboring image fragments.
Until true individual transparent motion assets are approved, Phaser must show the protected original moving sprites.

## UI Guardian art
Profile/sidebar/evolution UI uses the approved stage portraits under:
`assets/familiars/evolution_stages/`
These should fill the portrait frames and must not use the flawed V3.3.15 walk/play/sleep sheets.

## Sanctuary object system
Manifest:
`sanctuary/assets/objects/objects-manifest.json`
Finished object filenames:
- magic-mirror.webp
- moonlit-study-desk.webp
- celestial-telescope.webp
- enchanted-bookstack.webp
- moonstone-canopy-bed.webp

Moonlit Study Desk route: `addmaterial`

## Study Material / Notes Forge
Files:
- `pages-release/v3315/study-material/AddStudyMaterialPage.js`
- `pages-release/v3315/study-material/materialParser.js`
- `pages-release/v3315/study-material/materialStoreModel.js`
- `pages-release/v3315/study-material/questionBuilder.js`

Accepted sources:
PDF, DOCX, TXT, MD, pasted notes.

Outputs:
practice questions, explanations, vocabulary, misconception repair, review.

## Course isolation rule
Each WGU course owns its own:
- uploaded notes/sources
- generated questions
- answers
- mistakes
- mastery/readiness
- repair/review queues
- Living Grimoire course state
- streak

A new course starts its own streak at 0.
Account-level Majick XP, Guardian growth, crystals/chests, and completed-course history persist across courses.
Passing a course records completion and awards completion XP once.

Course manager:
`pages-release/v3316/courseManager.js`

## Current repair in progress
1. Restore original Phase 4 moving Guardians.
2. Enlarge approved stage portraits in UI cards.
3. Do NOT use V3.3.15 generated action sheets for movement.
4. Rebuild true individual stage/action art later from approved Guardian references — one Guardian/action asset at a time, not sprite-sheet slicing shortcuts.


## V3.3.30 — XP High-Water Repair
- Fixed regression where overall Majick XP could collapse to a small current-course value (for example, 7) even when the learner had thousands of lifetime XP.
- Root cause: shared-account initialization trusted an existing low `majickAccount.xp` before comparing it with higher persisted course/history values.
- Lifetime XP now uses a monotonic **high-water** model:
  - recover the highest legitimate value from account XP, persisted course XP, prior recovery records, and stored XP high-water fields;
  - course switching/saving cannot lower lifetime XP;
  - future XP writes can increase lifetime XP but cannot reduce it.
- Moon Crystals and chests remain spendable; monotonic protection applies only to lifetime XP.
- Successful XP recovery is immediately persisted and surfaces a **Majick XP Restored** notice.
- State schema advanced to version 5.
- Added a regression simulation for the exact failure: account XP = 7, persisted XP = 4,987; expected result = 4,987 and a later stale write cannot lower it.
- Fixed the Pages workflow's stale V3.3.27 version gate so current overlays can deploy.

## V3.3.29 — Tutor Navigation + In-Page Help
- Added a universal **Back** button on every non-Home main-app screen.
- Back uses a session navigation stack instead of blindly returning Home.
- Inside Course Tutor, Back returns **Tutor → Course Path** before leaving Learning Lab.
- **Alt + Left Arrow** triggers the same Back behavior for keyboard users.
- Home's **Enter Course Tutor** route now participates in navigation history.
- Added four contextual Majick Tutor actions on lesson pages:
  - **Explain Simpler**
  - **Give Me an Example**
  - **Quiz Me on This Page**
  - **Related Mistakes**
- D772 Lessons 1–4 and the Section 1 Summary/Test have lesson-specific simple explanations, examples, and built-in quick checks.
- Related Mistakes uses actual recent incorrect lesson answers when available; otherwise it shows the lesson's high-priority OA traps.
- Browser regression coverage now verifies the universal Back button and all four Tutor help actions.
- Protected Guardian movement and Sanctuary motion assets remain unchanged.

## V3.3.28 — D772 Section 1 Master Tutor
- D772 has **exactly one course section**: **Section 1: Assessing Research and Data Credibility**.
- There is **no Section 2** in the current D772 course structure.
- Section 1 contains:
  - Lesson 1 — Understanding Data Collection Methods
  - Lesson 2 — Recognizing Bias in Data Collection
  - Lesson 3 — Unveiling Data Misrepresentations
  - Lesson 4 — Conclusions About Data Findings
  - Section 1: Summary and Test
- The final Summary/Test is a section review, **not Lesson 5**; its internal lesson number is null.
- Authoritative Section 1 master teaching content is built directly into the Course Tutor for all four lessons plus the final review.
- Supplemental uploaded notes remain course-isolated and de-duplicated; they cannot create additional D772 sections.
- Built-in Tutor content includes the major course concepts, vocabulary, reasoning cues, memory aids, and Section 1 evidence-evaluation path from the learner-provided complete Section 1 notes.
- Regression coverage now fails if:
  - more than one D772 section appears,
  - a Section 2 appears,
  - the review is numbered Lesson 5,
  - the built-in Section 1 master content is missing.
- Guardian/Sanctuary movement remains protected and unchanged.

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
