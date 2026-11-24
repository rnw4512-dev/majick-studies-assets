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
