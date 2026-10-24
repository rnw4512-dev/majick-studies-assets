# Sanctuary and learning repairs — 2026-10-24

## Change summary

Repository: `rnw4512-dev/majick-studies-assets`. Repair branch: `fix/sanctuary-learning-certification`. Review: https://github.com/rnw4512-dev/majick-studies-assets/pull/195 . The Study Realm changes merged through #194 are retained.

- Removed the four-species filter from the Sanctuary payload. Saved IDs, custom names and both Briars survive; species aliases resolve through the authoritative Guardian registry rather than substring matches or arbitrary IDs.
- Pixi creates one entity per saved ID, selects its saved evolution level, handles late texture responses safely and keeps feet within the floor. Velora uses the existing five stage-specific walking pairs. No existing assets were modified.
- Both renderers use the existing `majickAccount.sanctuaryFurniture` record. Legacy positions/storage are imported once, unknown inventory is retained, coordinates map reversibly between the two renderers, and stale initial snapshots cannot undo newer edits. Pixi store/place awaits the account response; Phaser controls wait for initial account sync.
- Care calls the existing exact-ID Guardian care API. Feed consumes an existing meal; an empty inventory produces the existing out-of-stock message. Physical furniture interactions use the same care API and travel target. No replacement reward, inventory or progress system was introduced.
- Restored the missing Phaser game bootstrap and retained its fallback button; the renderer preference survives reloads.
- Academic sections remain mounted and visible so charts and probability controls can be reached. Nonacademic section selection follows the selected panel label across delayed insertions. Probability Back uses shared navigation history; Back follows current route adapters for session cleanup.
- Browser tests now use the actual generated mean cases and current selects, open the optional whiteboard before typing, and correctly reject guided-workshop mastery credit. No assertions were disabled.

## Files changed

Runtime and integrity:
- `current-site/app-runtime.js`
- `current-site/guardian-registry.js`
- `current-site/index.html`
- `current-site/pixi-sanctuary/index.html`
- `current-site/pixi-sanctuary/prototype.js`
- `current-site/probability-workshop.js`
- `current-site/room-section-nav.js`
- `current-site/sanctuary/Game.js`
- `current-site/sanctuary/index.html`
- `current-site/sanctuary/sanctuary-customize.js`
- `current-site/sanctuary/sanctuary-roster.js`
- `current-site/source-manifest.json`

Certification:
- `.github/workflows/deploy-majick-pages.yml`
- `pages-release/current/browser-interactions.cjs`
- `pages-release/current/browser-probability.cjs`
- `pages-release/current/commons-interactions.cjs`
- `pages-release/current/browser-sanctuary.cjs` (new)
- `pages-release/current/test-sanctuary-state.cjs` (new)

Documentation:
- `HANDOFF_LATEST.md`
- `CURRENT_BUILD.md`
- `REPAIR_REPORT_2026-10-24.md` (this report)

The source manifest records new SHA-256 values for all 11 changed runtime files. All 33 protected movement hashes and all existing Guardian assets remain unchanged.

## How to use and verify

Open Companions → Sanctuary. Choose each individual Guardian in the care selector; duplicate Briars have separate saved IDs. The selected profile shows that individual's current evolution card. Use Arrange furniture to drag an item, Store/Place to change storage, then reload. Use the physical water basin, food bowl, brush, play area or bed for the selected Guardian. Use “Use original Sanctuary (Phaser)” to switch renderer; saved furniture and learner progress remain with the account.

Open Learn Lab → Graphical Displays → Visuals & Charts. The charts must have nonzero visible size. Open Connected Learning · Probability in Game Realm and use Back: return through the shared route history without rewriting academic progress.

Local validation artifacts are under `/workspace/majick-dev/logs`; build output is outside the checkout. These browser tests use isolated test profiles and an 11-Guardian fixture, not the user's live browser save.

## Verification and deployment

Local build `798095a4810566cc` passed source integrity, all 33 protected motion hashes, and JavaScript/inline-script syntax. All 18 Node runners (the canonical release checks plus 17 test suites) passed. Learning and probability browser flows passed after retaining #194. The new Sanctuary browser gate passed fresh-account Phaser startup, all five Velora walking pairs, an 11-ID roster including duplicate Briars, visible/stable room selection, floor movement, drag/store/place/reload, exact-ID care, food availability, fallback sharing and stale-snapshot rejection. Earlier complete Commons runs passed responsive layout/contrast/control/navigation and care checks, then exposed the initialization races now covered by the fresh-account regression. The complete stable GitHub browser workflow is the final publication gate; its outcome must be checked in PR #195.

The canonical build checks source hashes, protected motion assets and JavaScript/inline-script syntax. Certification runs the release checks, every `test-*.cjs` suite, the learning/reward/save browser flow, probability browser flow, responsive Commons flow, and the new Pixi/Phaser Sanctuary browser flow. The new Sanctuary gate is registered in the existing stable Pages workflow.

The recovery and publication result, exact commit SHA, passed/failed test outcomes and deployed build are recorded in PR #195 and the final implementation report accompanying this work. Do not infer deployment or new-task restoration from a local build alone.

## Known asset limitations

Full Pixi artwork parity is not claimed. Vesper, Briar, Zephyr, Prism, Rook and Solara have illustrated evolution cards but no transparent stage-specific walking pairs. They use their existing transparent canonical portrait on the floor, and the correct evolution card is shown separately in the selected profile. Cascade, Solstice and Aurelia have existing new-bond walking pairs; higher stages use the existing stage walk artwork where no approved pair exists. Velora has five approved stage-specific pairs. No opaque evolution cards, fabricated raster deformations or unreviewed replacements are presented as walking frames. Phaser remains available.

## Break/fix guide

- Missing Guardian: compare `S.legacy.pets` IDs with `phase4StudyState().pets` and the Pixi inspection roster. Check the registry's resolved species and texture request. Preserve the saved ID and name; never deduplicate by species or manufacture a replacement pet.
- Wrong artwork: inspect the saved study XP/level and resolved canonical identity. Check the selected stage card and frame source. Keep the canonical transparent fallback until approved stage sprites are available.
- Furniture edit disappears: compare account and renderer `updatedAt`, stored IDs and positions. Wait for account sync and reject older snapshots. Do not clear localStorage or inventory as a repair.
- Hidden lesson/control: inspect inactive outer panels, not just whether SVG/form nodes exist. Academic sections must remain visible.
- Back returns to a stale game: verify that shared Back invokes the current navigation chain. Compare academic state before and after navigation.
- Safe fallback: switch to the original Phaser Sanctuary using its existing button. This changes only the renderer preference.
- Rollback: revert this PR's code changes in a new reviewed commit, retaining any later unrelated changes. Restore source-manifest hashes from the corresponding source revision and use the established Pages workflow. Do not reset learner saves, browser storage, earned XP/crystals, Guardian IDs, inventory or course records. Keep the enriched furniture record; unknown fields are not a reason to erase it.

The remaining artwork work is to supply and review transparent, stage-correct walking pairs for unsupported species/stages. Passing state/browser checks does not replace that visual acceptance.
