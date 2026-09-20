# Majick Studies — CURRENT BUILD SOURCE OF TRUTH

Last updated: 2026-09-19
Current target release: V3.3.16 / hotfix V3317

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
