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
