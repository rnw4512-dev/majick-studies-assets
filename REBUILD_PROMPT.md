# Aetheria Rebuild — Starting Prompt

Saved 2026-11-28. This is how the clean rebuild started.

**How to use:** paste everything inside the box below at the start of every new chat (Claude or ChatGPT), then add one line saying which step you're on, e.g. "We're on Phase 1, step 2." Progress is tracked in `REBUILD_LOG.md`.

```
You are helping me rebuild my learning app "Aetheria | Moonlit Collegium" (repo: rnw4512-dev/majick-studies-assets, live at https://rnw4512-dev.github.io/majick-studies-assets/).

## Who I am (read this first)
- I am ONE person, not a company. I have little to no money. Everything must be FREE: no paid services, subscriptions, paid APIs, paid hosting, or paid databases. If something would cost money, stop and tell me, and give me a free alternative.
- I am not an expert programmer. Explain things in plain words. Give exact commands to copy and paste, and complete files rather than partial snippets, and tell me exactly where each file goes.
- I use BOTH Claude and ChatGPT on this project. Neither AI remembers past chats. The file REBUILD_LOG.md in the repo is our shared memory. Read it before doing anything, and update it at the end of every session.

## The problem we are fixing
The current app (folder `current-site/`) was built by stacking fixes on top of fixes:
- 114 script files and 65 stylesheets loaded in a fixed order (~5.6 MB of our own code)
- old versions still loading underneath new ones (v339-main.js, v3311-main.js, v3312/v3313/v3314-main.css)
- 44 places where one file overwrites another file's functions (`render` alone is replaced 14 times)
- 1,630 `!important` rules in the CSS
- 220 timers and 16 MutationObservers waiting on other code, which cause startup race bugs
- progress saved in ~18 separate localStorage buckets with version numbers in their names
- course questions and lessons mixed into giant code files
- two game engines kept (Pixi and Phaser)
We are NOT patching this anymore. We are building a clean new app next to it.

## Free tools we will use (do not substitute paid tools)
- Vite (build tool), Svelte (screens), TypeScript (catches mistakes early)
- PixiJS (the only game engine; no Phaser)
- Vitest (unit tests) and Playwright (browser tests)
- GitHub + GitHub Pages + GitHub Actions for free hosting and automatic deploys
- Saves stay in the browser (IndexedDB, with a localStorage fallback) plus an "Export backup / Import backup" file button. No server, no accounts, no cloud database.
- Where to work: my own computer with Node.js installed, or GitHub Codespaces on the free monthly hours.

## Hard rules
1. NEVER edit, move, or delete anything in `current-site/`. It stays live until the new app fully replaces it. The new app lives in a new folder: `app/`.
2. NEVER delete or reset learner saves, XP, crystals, Guardians, eggs, inventory, or course progress.
3. Reuse the existing art, sprites, music, and question content. Copy them into the new app; never modify the originals. The 33 original movement PNGs are protected and must stay byte-for-byte identical.
4. No version numbers in file names. No file longer than about 400 lines. No `!important` unless truly unavoidable (and then explain why).
5. No feature reaches into another feature and replaces its code. Features share data only through the save store and simple events.
6. No timers or MutationObservers used to "wait for" other code. Use proper startup order and events instead.
7. Course content (questions, lessons, explanations) lives in data files (JSON or Markdown), not inside code.
8. Every feature gets at least one test before it counts as done.
9. Do ONE step per session. Keep changes small enough that I can understand and check them.
10. If you are unsure, or a decision is big or can't be undone, ask me first. Never guess about my saves.

## New app structure
app/
  src/
    core/         save store (one versioned save record), importer for old saves, events, router
    features/
      learn/      lessons
      practice/   questions, feedback, mastery tracking
      rewards/    XP, crystals, chests, Guardians, eggs
      sanctuary/  Pixi Sanctuary
      game-realm/ Pixi Game Realm
    ui/           shared buttons, panels, layout, theme
  content/
    courses/      d669/, d755/, d756/, d772/ (data files only)
  public/assets/  copied art, sprites, audio
  tests/

## Old save keys the importer must read (one time, read-only, never delete them)
majick_campus_v3, majick-reward-sanctuary-v3411, majick-sanctuary-furniture-v1, majick-sanctuary-layout-v2, majick-sanctuary-renderer, majick-study-materials-v1, majick-learning-observatory-v1, majick-fragment-study-evidence-v1, majick-sitewide-response-mode-v1, majick_d772_material_section, majick_nav_stack_v3329, majick_v338_progress_seed_applied, moonlit_learning_v1, aetheria-adventure-journal-v1, aetheria-cloud-session-v1, aetheria-experiences-v1, aetheria-learning-path-current-v2, wguExpeditionV6State.
Before writing the importer, search `current-site/` for any other localStorage or IndexedDB keys and add them to this list.

## Phases (finish and test each before starting the next)
Phase 1 – Foundation: create app/ with Vite + Svelte + TypeScript; set up the theme, navigation, and save store; build the old-save importer and Export/Import backup; add a GitHub Action that deploys app/ to a test path (e.g. /majick-studies-assets/next/) without touching the live site.
  Done when: the app loads, imports my old progress, survives a reload, and the backup round-trips.
Phase 2 – One course end to end (D772 first): Learn → Practice → feedback → reward → reload, with nothing lost.
Phase 3 – Rewards: XP, crystals, chests, Guardians, eggs, hatching.
Phase 4 – Sanctuary in Pixi: furniture, layout, Guardian care.
Phase 5 – Game Realm in Pixi.
Phase 6 – Move the remaining courses (D669, D755, D756) into content packs.
Phase 7 – Switchover: once I confirm everything works, the new app becomes the main site and current-site/ is kept as an archive.

## Every session, do this
1. Read REBUILD_LOG.md and tell me in 2–3 sentences where we are.
2. Confirm which step we are doing today.
3. Do the step, with complete files and exact commands.
4. Tell me how to test it myself in plain words ("open X, click Y, you should see Z").
5. Update REBUILD_LOG.md with: what was done, which files changed, what was tested, any problems, and the exact next step.
If REBUILD_LOG.md doesn't exist yet, create it first.
```
