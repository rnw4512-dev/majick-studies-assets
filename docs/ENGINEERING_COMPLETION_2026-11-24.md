# Aetheria completion and recovery record

Baseline: `08f47a2cba72184c8a9894b2c88ae144655b94f7`, existing `main`.
This record describes local verification. It does not certify deployment.

## Implemented

- `pages-release/current/`: shared strict inventory validator; missing, modified, unregistered, unsafe paths and symlinks fail together. Only explicit exact-digest approvals modify the manifest. Six negative/atomicity tests cover the gate.
- `.github/workflows/`: common validation, existing browser gates, D669/media/game coverage, read-only Atelier push audit, one reusable publisher, stale-main protection and public-commit verification.
- `current-site/room-section-nav.js`: Journal retains its own tabs. The outer navigator previously made the canonical Journal inert when supplemental memories appeared first, preventing keyboard focus. The original ArrowRight assertion remains unchanged.
- `current-site/course-packs/`, `course-content/`, `course-source-reader.js`, `course-learning-path.js`: extracted the unchanged D669 catalog, published seven supplied JSON references and exposed seven existing practice packs. References load on demand; learning/reward owners remain authoritative.
- `current-site/assets/licensed/`, existing animation/audio/wardrobe adapters and `licensed-assets.css`: actual uploaded effects, icons, textures, five optional clips and lightweight approved potion/human mesh renders. Four finite animations have reduced-motion posters. Source models stay outside deployment in `asset-sources/approved/`; reproduction tools are in `tools/asset-pipeline/`.

Authors, source-page licenses, transformations and output hashes are recorded in the licensed asset manifest and existing in-app `assets/IMMERSION-CREDITS.html`. CC BY human meshes preserve attribution. WomanBody13, superseded potions archive and colorful Poof were excluded.

## Local verification

Canonical validator/build passed: 974 locked/actual files, zero errors; initial candidate release key `5c35c9a8ad3d62b6`; image-load timing repair candidate `3d45c5038ac9c891`. Existing Node release checks, D756 classifications and six manifest tests passed. At 390, 820 and 1366px, browser suites passed for:

- Original startup/learning and Journal keyboard checks, transfer/resume and duplicate reward protection.
- All 15 routes, stable navigation listeners and no horizontal overflow.
- Seven D669 documents/packs, real feedback and preserved notes/academic progress.
- Licensed media, lazy effects/audio, reduced motion, mute, potion previews and model decoding.
- Communication Quest, investigations, constellation pairs and Oracle controls.
- Existing Sanctuary, Alchemy, Commons and complete D756 Council script/scenario/UX/meeting suites.

Six Playwright integration/lifecycle cases passed. Commons control-contrast checks found no failures. Source and compiled startup/Journal tests passed. Execution logs/screenshots remain under `/workspace/work/directive-*`; committed provenance and measurements are under `docs/audits/evidence/completion-2026-11-24/`. Live production verification remains required.

## Additional timing repair

Repeated final-media verification exposed a cold-image race: the 450ms reduced-motion overlay could expire before the poster decoded. The display timer now begins on image load/error, with a two-second bounded pending fallback and a stale-effect guard. The media regression deliberately delays the nature poster by 650ms and checks eventual automatic cleanup. Existing original effect/interaction tests remain unchanged. GitHub integration passed for `850cb4f`; the timing repair requires its own new run.

## Performance limits

Five alternating clean-context Chromium runs at 1366px, localhost, no throttling: median DOM ready 2020 to 1792ms; load 2403 to 2100ms; script CPU 826 to 772ms; total task CPU 2482 to 2269ms; heap 7.54 to 7.11MB. Render count stayed four; no iframe elements. Median transfer rose 8.86 to 9.21MB and observed long-task duration rose 1231 to 1363ms. These mixed results do not establish a universal speed improvement. Added bytes and long-task variability remain optimization work. Full observations/conditions are committed.

## Hosted artifact visibility

The `a9ebfd0` integration and complete publisher pre-deployment suites passed. Its deployment attempt reported no named Pages artifact while a subsequent API request showed the successfully uploaded `github-pages` artifact. The publisher now grants artifact-read access and waits up to 60 seconds for that same run’s nonexpired named artifact before its existing stale-main check and deployment. It fails closed if metadata stays unavailable; no test or approval gate is bypassed. A new run is required.

## Remaining asset blocker

The replacement blue-white Poof source page and CC0 license were identified, but its original PNGs/replacement ZIP are absent from downloadable attachments. Inline previews cannot establish original frame bytes/order. No replacement Poof is claimed integrated. Existing effects remain functional; certification must distinguish this incomplete requirement.

## Saved-data safety and recovery

No save schema, Guardian controller, scoring implementation or reward authority was replaced. Presentation/reference readers do not grant rewards. Existing replay, transaction, transfer and recovery suites passed. Required consolidation/release ancestors remain preserved; original workspace edits remain untouched.

Revert the specific implementation commit recorded in Git history, explicitly approve deliberately restored source digests, rerun shared/browser gates and publish through the existing workflow. Do not reset learner localStorage or restore an entire old repository. See [release workflow](ENGINEERING_RELEASE_WORKFLOW.md) for review and rollback steps.

## Supplemental precious-metal rings

User-supplied `rings_precious_metals.zip`: ten actual Clint Bellanger meshes; source-page CC BY 3.0 verified and attributed. `tools/asset-pipeline/render_rings.py` converts original materials for current Blender studio rendering with saved scripts disabled. The existing Accessories section shows a lazy read-only gallery (32,666 runtime bytes total). No equipment, inventory, prices, rewards or save schema were added. Sources/provenance remain outside deployment. Initial ring candidate `e7198b4569b5e4ec`; mobile-sizing candidate `55c05ed7213eedce`; final contrast candidate `9fc6e861f7113cc0`: 984 source files, zero audit errors, full shared validator passed. Browser verification covers all ten decoded images, no gallery overflow and unchanged learning/reward state at 390/820/1366px.

Ring before/after screenshots at 390, 820 and 1366px are execution artifacts under `/workspace/work/ring-screenshots/`. Review exposed an existing narrow-screen grid minimum that clipped the Atelier; the mobile track now uses `minmax(0,1fr)` and content columns can shrink. Browser coverage checks the controls’ viewport bounds as well as the gallery’s internal width.

Public repair release independently verified before the supplemental ring push: commit `e319f37d3f67e5996f5df47bfccf7c4619874142`, build `3d45c5038ac9c891`, with matching public entry point, D669 JSON and licensed media. Hosted production browser checks are recorded by publishing run 45448300504. This does not claim the later ring supplement is deployed.

## Supplemental gems, crystals and plants

Four original Clint Bellanger gem meshes (CC BY 3.0), three original rubberduck crystal meshes (CC0), and two Nobiax/Yughues plant meshes with their matching painted TGA textures (archive CC0 1.0 license retained) were rendered offline with saved-script execution disabled. Nine static 160px WebP derivatives total 27,128 bytes. CSS reuses room headings and existing crystal progress caps; values, reading text and control handlers are unchanged. Selected meshes/textures and reproduction tools remain outside deployment. Initial ornament candidate `88b65a76dbe8709d`; visible-heading/readability candidate `b6954d9655057df0`: 994 registered files, zero audit errors, full shared gate passed.

The supplied spell-book `grimoir.zip` cannot transfer through the executor’s 32 MiB limit. Its cached source page identifies CC BY-SA 3.0, piacenti and redheadstock attribution for circle textures. No original book file was inspected or integrated, and no derivative license claim is made. Smaller uploads of the model/selected textures are required to complete that pack. The missing original blue-white Poof remains a separate asset blocker.

## Dedicated Pages deployment job

Run 45452198509 passed integration and application browser gates but the same-job deploy action’s internal artifact service did not discover the uploaded Pages artifact even though REST did. REST visibility alone was insufficient. The publisher now uses the dedicated `deploy` job recommended by actions/deploy-pages, with `needs: build`, download of the completed certified artifact, explicit commit/build identity checks and unchanged stale-main/public browser gates. Production tests use that exact downloaded artifact rather than rebuilding. This revision requires a new hosted run before deployment certification.

Learn Lab intentionally hides its overview banner during tutoring. The emerald ornament now decorates its visible lesson navigator instead. Explicit full-width card sizing fixes auto-margin shrinkage that could leave its heading in a one-pixel column. Finite-media verification observes image decode in the same browser task that starts the effect, preserving real decode/connectedness assertions while avoiding transport polling races.

The final deployment helper binds the reviewed REST artifact ID to the same run, rechecks main, authenticates via GitHub OIDC and uses the standard Pages deployment REST endpoints. This avoids the separate artifact-results listing failure instead of assuming REST visibility implies its consistency. Build and deploy are separate jobs; CLI artifact download and commit/build checks precede creation. Unit cases cover stale main, missing/expired artifacts, OIDC log privacy, status retry, failure and bounded cancellation. The original application/browser gates remain required.

Final ornament media/legibility checks passed at all three widths, and all 15 room routes passed without overflow/runtime errors or accumulating listeners. Eighteen before/after screenshots for Study Hall, Learn Lab and Trial Chamber are retained under `/workspace/work/ornament-screenshots/`; the Learn Lab navigator width and actual visible emerald marker were inspected.

## User screenshot readability repair

Screenshots exposed pale-on-parchment text in the D669 Whispering Library, completed quests and Learning Observatory, plus squeezed room-section labels. The existing reusable `content-text-contract.css` was not linked by `index.html`. Restored it as the final stylesheet, removed mixed-ID selector specificity that defeated nested surface exceptions, bound painted WebKit text to its semantic color, and retained ivory on dark study-break/scenery controls with dark ink on their light feedback. The section ribbon now wraps full labels with 44px controls instead of conflicting nowrap/100%-title/max-height rules. No content, values, scoring, save schemas or reward owner was changed.

`tests/parchment-readability-browser.py` reproduces the real D669 3-answer story completion and Observatory, verifies painted text at >=4.5:1 against the paper palette, checks unclipped section labels and unchanged academic progress/XP, and exercises the actual dark Starfall renderer plus light feedback through the published practice owner. It runs at 390/820/1366px in integration, pre-publication and live verification. Screenshots are retained under `/tmp/aetheria-reading-evidence/` and uploaded by the publisher. Candidate `5a6c04376c8360dd`: 994 locked/actual source files, zero audit errors, shared gate passed.

The preceding asset/infrastructure release is independently verified live at commit `a949504c5b14f64a9ecf28a7b43eb85c10e25ef3`, build `b6954d9655057df0`; integration 45456123749 and publishing/live checks 45456123826 passed. This historical verification does not claim the later screenshot repair is already deployed.

## Optional uploaded music

Six supplied tracks were rights-checked against primary source records and normalized/re-encoded as full-length 44.1kHz stereo Vorbis (quality 2), totaling 4,946,093 bytes. The existing Sound settings now offers those tracks plus the existing Dreams Become Real default. Music stays off at startup; choosing a track while muted does not allocate a player or fetch music. One existing HTMLAudioElement is reused, with the existing volume/mute controls and artist-credits page. Selection is a presentation preference held in memory; no learner/save schema or Guardian controller was added. A stale play-promise guard prevents rapid changes from stopping the newer choice.

`tests/optional-music-browser.py` passed at 390/820/1366px: all six original-derived tracks decode/play, no pre-opt-in fetch, one player across changes, rapid selection and invalid-ID rejection, mute/zero-volume/restart, no overflow, and unchanged academic progress/XP/reward inventory. The shared gate passed at 1,000 locked/actual files, zero errors, candidate `edededd757f72b2d`. Five short spell effects retain their own exact count; the six music tracks have a separate count/provenance check. `tools/asset-pipeline/prepare_music.py` verifies original hashes and reproduces the derivatives without approving manifests automatically.

Attribution preserves Iwan Gabovitch/qubodup.net, Alexandr Zhelanov/SoundCloud, pixelsphere.org / The Cynic Project and cynicmusic.com, congusbongus for the seamless remix, and Music by Matthew Pablo / www.matthewpablo.com. CC BY 3.0 is selected where alternative licenses are offered; CC0 is retained for the applicable Cynic tracks. No third-party notifications were sent. The linked Fantasy Choir page lists CC0 and César da Rocha, but no original choir files are available locally; its advertised archive exceeds the transfer limit. Choir, original blue-white Poof and smaller spell-book inputs remain explicit asset blockers.

Screenshot repair independently verified live before this music supplement: commit `a5d42f693495e0c67ea6c0cfcd82bbd90eace6f8`, build `5a6c04376c8360dd`, integration 45459752017 and publisher/live checks 45459751861 successful. This historical record does not claim the music supplement is already deployed.

### Course-location exercises retired — user-requested scope expansion

The user requested removing section-location questions and their progress from all games and study. Rune Sort classified actual academic prompts by their course section; that activity is retired, its legacy handlers are harmless, and the remaining Realm path uses four trials. Original academic questions retain their section metadata for navigation. A shared question policy filters course-location prompts from study, registered practice packs, and adventure questions.

A targeted, idempotent cleanup removes Rune Sort completion records across courses, its synthetic question repair records, and matching question history. Dedicated retired adaptive rows are removed; mixed rows retain subject evidence. Course-scoped question IDs prevent deleting another course's legitimate answers. Notes, earned XP/crystals, account records, Guardians, inventory, and other game records are preserved. Cleanup writes through the existing save-safety owner before changing live state; failed writes retain the original state, and existing recovery snapshots remain available. No save schema or reward authority is added.

Validation: shared canonical release gate passed (1,001 locked/actual files, zero integrity errors); focused Node tests cover positive/negative question detection, course isolation, mixed evidence, idempotence and save failure/retry. Chromium checks passed at 390, 820 and 1366 pixels for study filtering, retired entry points, four-trial progress, protected state and reload persistence. The regression is included in integration and publishing gates. Candidate build: `57fd8847cfc870bb`. Deployment status will be recorded after publishing.

Recovery: revert the focused retirement commit to restore the activity code. Existing save-safety recovery copies can retain pre-cleanup state; reverting code alone does not recreate removed completion records. Earned rewards are never deducted. Optional music is a separate commit (`08a9708`) and retains the existing opt-in audio owner.

### Downloaded-asset visual depth — shared rooms and game introductions

Branch `visual/downloaded-asset-depth-20261124`, derived from current main `5ffde8db677ab99e6ac92b34446f00fe02d36e7a`, replaces the small, abstract room-ribbon treatment with static still lifes built from today's approved meshes. Study Hall uses antique metalwork and crystals; Learn Lab uses metalwork and a potion bottle; Trial Chamber uses crystal and gemstone studies. The existing library vignette uses a rendered candle holder and crystal on a shadowed shelf instead of its generic arch and star. All artwork stays outside reading and answer areas; room components, rewards and learning owners are unchanged. No new runtime dependency, audio behavior, loop or canvas is introduced.

The new rubberduck CC0 candle-holder derivative is rendered offline from the supplied 50-model Blender pack with saved scripts disabled; source/output hashes and license evidence are in `room-depth-intake.json`. Original source is retained outside the published app. This pass adds one small 160px WebP and reuses previously approved renders.

Before-and-after screenshots for Study Hall, Learn Lab and Trial Chamber at 390, 820 and 1366 pixels are committed under `docs/audits/evidence/completion-2026-11-24/room-depth/`. Initial visual review confirms no horizontal overflow and readable labels with decorations separated from text. Shared release validation passes: 1,002 locked/actual files, zero manifest errors, build `2168631d9b73a776`. Existing browser contrast/completion checks passed at all three widths. After those acceptance checks passed, the same ribbon was expanded to the remaining rooms, with botanical, archive and arcade variants. Four existing game introductions reuse plants, metal rings, crystals and bottles in place of their abstract shapes. Navigation across all 15 existing room links passes at all three widths, with stable listener counts (window 37/document 66), no horizontal overflow and no runtime errors. Four game-introduction captures also pass at 390 and 1366 pixels. Final lighting-adjusted canonical build: `15e9abdef3131619`.

Recovery: revert the focused visual commit; no saved-data restoration is needed because this pass changes only artwork/styles/credits. The separate course-location retirement is committed as `6d5b7935f2b6d313e9c2cb37cb386708d496913c`, with browser line-wrapping independence in `5ffde8db677ab99e6ac92b34446f00fe02d36e7a`. Its integration run `45465845112` and publishing run `45465845084` both passed. Independent live verification returned HTTP 200 with source commit `5ffde8db677ab99e6ac92b34446f00fe02d36e7a` and build `57fd8847cfc870bb`. The new visual branch is prepared separately for a focused PR; no new visual release is claimed live yet.

### Painted potion intake and brewing-dialog repair

The supplied `Potion_1.zip` is OwlishMedia's CC0 Potion Bottle pack (the exact `/potion-bottle-0` source page was verified). Five original painted albedo/alpha and emission texture variants were rendered from the FBX with Blender saved scripts disabled. Selected originals, source/output SHA-256 records, an offline reproduction script and credits are retained. Only five small static 192px WebP renders are published; no FBX or large texture is downloaded by the app.

The existing brewing renderer uses the finished bottle texture with SVG fallback and preserved aspect ratio. The dialog now includes its padding in viewport sizing so the heading and close control remain reachable. Keyboard focus stays inside the dialog, Escape cancels, and closing restores focus. Recipe ingredients, confirmation, idempotency, inventory, reward ownership and save schemas are unchanged.

Local evidence before merging newer main: all three widths pass dialog geometry, focus cycling, Escape/cancel, actual decoded painted bottle, single renderer, unchanged learning/Guardian state and duplicate-confirmation protection. The full existing alchemy suite also passes all three widths, including all five recipes, assisted boundaries, fragment/egg/hatch, export/import/recovery and save-failure rollback. Existing Sanctuary care/furniture/Phaser checks pass after scrolling the room iframe into view, preserving all original assertions and avoiding Chromium suspension of an offscreen canvas. The existing visual contrast suite passes unchanged (13 acceptance checks, 16 rendered contrast samples); its earlier CI failure has not reproduced locally. The old 19-task count is replaced with explicit IDs for all original activities and three restored D669 activities. Source validation passes (1,007 locked/actual files, zero errors), build `2e38f0c813f6d768`.

Newer `main` advanced to `1525418` with additional artwork mappings, ingredient layout and question-rotation changes. PR #294 must incorporate those updates and be retested before publishing. This paragraph records pre-merge results, not certification of the combined release. Rollback: revert the focused potion/UI change; existing save and reward records require no migration or restoration.

### Handoff reconciliation and app-wide icon implementation

The supplied handoff's complete repository references all exist. A recursive inventory records 646 published asset files (111,554,177 bytes total bundled, **not** startup transfer), 23 retained source files outside the published app and 88 quarantined preparation files. `handoff-inventory.json` includes hashes, directory counts, D669 lesson/sublesson/competency references and explicit source coverage limits. D669 currently has five catalog study sections, 78 aligned practice questions, seven supplied raw JSON source documents and seven registered practice packs. The seven documents remain transcribed/not independently verified; full original source-text coverage of the entire course is not established. The attachment ends mid-link in section 8.

Existing startup, render queue, navigation, source reader, course activity player and save-safety owners are retained. No second initializer, room registry, question bank or progress authority is introduced. Newer main `1525418` is merged at `73c9ac8`; its question rotation, approved artwork, recipe ingredient layout, bubbles and inventory mappings are preserved. The single existing cabinet-art map now points its five potion IDs to the new painted renders.

Downloaded skill icons now decorate the real classroom tabs, Learn Lab navigation, game action cards, Journal goals/repair tabs, Commons course headings and the Observatory medallion. Existing illustrated books, botanical models, metalwork, crystals, runestones and bags appear in shared room banners and Vault/cabinet headings. Icon colors are restrained; labels, progress values and instructional reading areas remain intact. Repeated ornamental room headers are hidden only where the existing ribbon already supplies the same identity. Missing route names were added to the existing ribbon-label map so Journal, Vault, Focus, Constellation, Trophies and Settings stop falling back to Home. No new rooms are created.

Implementation checks exposed two concrete presentation issues: recipe images were layered over duplicate CSS bottle backgrounds, and mobile heading compaction could hide a game button's title as a repeated heading. Duplicate image layers are removed. Heading compaction now clears stale flags and preserves headings inside interactive controls. The asset browser check verifies five distinct 192px bottle images, visible named game cards and decorative icon accessibility. Lazy images are scrolled into view before decode checks. The CSS-preservation test retains its complete-state/control/progress equality assertion but fetches the stylesheet before sampling and applies it atomically, preventing unrelated lazy room renders from crossing that assertion.

Validation before the final icon expansion: combined source gate passed with 1,068 locked/actual files, zero errors; full interactions, all three D669 content flows, all three alchemy workflows, all three brewing dialog flows and Sanctuary care/furniture/recovery passed locally. Merge-head CI passed all three Commons reviews, enchanted visual contrast, meeting, alchemy and Sanctuary checks; integration stopped at a stale expected old potion-image path, now updated to validate the requested new rendered images. Final canonical icon candidate: `2f6ad8b806efbaaf`; final asset, navigation and visual checks are in progress. PR #294 remains the release vehicle, and these new visual changes are not claimed live until its checks and publishing verification pass.

Rollback: revert the focused icon/visual commits. No data reset or schema migration is involved. The targeted section-location question retirement and its existing save-safety recovery mechanism are preserved. Unverified preparation files remain outside the published app.

### Final app-wide acceptance evidence

At `2d42498` the final runtime asset key is `2f6ad8b806efbaaf`. All three local asset checks now pass, including actual lazy-loaded painted bottle images, named game controls and their new decorative icons. All 15 room navigation checks pass at 390/820/1366, with window/document listener counts unchanged (37/66), no overflow and no runtime errors. The full rendered-contrast suite passes 13 acceptance checks and 16 samples. App-wide captures cover Arcade cards, Journal, Vault, Focus, Trophies and the actual classroom tab flow at all three widths; first-room after screenshots are refreshed. The existing source-data, question rotation, Guardian state, reward receipts and save/recovery owners remain unchanged by this icon pass.

`handoff-inventory.json` now includes the actual five-section D669 catalog, its lesson/sublesson/competency records and all seven raw source document statuses. Existing browser evidence confirms seven registered practice packs. Sections without complete supplied raw text remain a source-coverage limitation; no invented official course content is substituted.

PR #294 contains the combined implementation and recovery notes. Its final CI and production status must be checked before describing this upgrade as live. Reverting the eventual merge commit with mainline parent 1 removes this visual/UI delta while preserving the main-branch consolidation work; no student save reset is required.

### Study continuity, D669 crash and same-skill variety repair

The user's later requests expand this PR beyond visual polish. These changes repair the reported behavior without replacing source, save or reward owners:

- `game-realm.js`: D669's missing hard-question subset now falls back to its real eligible normal question pool; an unavailable current question renders a safe return action instead of reading `undefined.section`. Adaptive selection retains the chosen skill and prefers its least-seen existing examples. Eight original supplemental cases vary the existing four D669 reading-foundation skills; these are not represented as official source questions. Oracle remains four rounds with four distinct reading goals.
- `aetheria-learning-experiences.js`: rounds rotate through the selected course/section's eligible pool instead of always taking its first five items. Deep activities also rotate. Existing game answer handlers emit ungraded practice events, including vocabulary, comprehension and manipulatives. `aetheria-adventures.js` emits the same event from its guarded answer handler. Existing discovery/reward handling is preserved.
- `study-observatory.js`: headline totals now read existing saved course answers and source checks, plus guided game answers recorded by this existing owner. Source coverage, passes, official mastery and reward amounts retain their original separate authority. Existing discovery records are displayed; missing historic game answers cannot be reconstructed. A browser-local storage explanation and a button for the existing backup action make the storage boundary explicit.
- `save-safety.js`: the existing backup envelope includes the three existing separate study/game stores, with active-owner snapshots so a download can retain in-memory practice after a storage failure. Restore notifies the active owners to reload their caches immediately. Earlier backup files remain accepted. No main-state schema migration, cloud sync, reset or invented historic activity is introduced; existing later-earned reward/alchemy protection remains intact.
- Existing text/art styles fix gold/white text on paper game prompts and feedback; all six older learning tiles and eight shop controls use approved artwork. Celestial Dew receives crystal artwork, Silver Sage uses the herb illustration, Moonpetal is visually distinguished from Lavender, and duplicate cabinet heading decorations are removed. Prices and inventory actions are unchanged.

Local acceptance: `study-continuity-browser.py` passed at 390, 820 and 1366 pixels against candidate `ade8360ed8979c91`: actual wrong-answer repair and correct answers, reload durability, different next-round questions within the same section, same-skill case rotation, existing course-answer rollup, browser download/import and active-cache restoration, no guided mastery/ticket/reward writes, and Gauntlet fallback/empty state. Existing alchemy browser acceptance passed all three widths, including canceled/double crafting, fragment/egg/hatching, potion effects, backup/import/recovery, future-schema rejection and save-failure rollback. All seven D669 source documents and seven registered packs passed all three widths. The shared release gate passed 1,068 locked/actual files with zero errors and the existing learning/save/integrity suites.

The contrast test now collects text geometry and suppresses glyph paint atomically, rejects samples if a lazy render replaces the reading surface, and restores exact original inline styles. The existing contrast thresholds remain unchanged. Local verification passed 13 visual checks and 16 contrast samples. The new continuity regression is included in the existing integration and publishing checks, including the production route. Final candidate after extending guarded practice logging to deep/vocabulary/comprehension handlers: `d6c23a13537e9623`; final browser checks and PR CI must pass before release.

Recovery: use Settings → Progress safety → Download backup before changing browsers/devices. Import that JSON on the destination, or use Restore recovery copy for an unwanted import. Do not clear browser data as a repair. A zero source-coverage bar can still be correct after guided-only activity; the separate saved-practice totals now show that work. If storage fails, keep the page open and download a backup; no unverified cloud synchronization is claimed. For a code regression, revert the final repair commit or the PR merge with mainline parent 1, then publish through the normal workflow; preserve existing browser saves and protected earned rewards. The next acceptance owner is the normal PR/publisher CI, followed by independent live commit/build verification.
