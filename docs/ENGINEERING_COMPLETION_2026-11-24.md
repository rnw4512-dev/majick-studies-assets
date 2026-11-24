# Aetheria completion and recovery record

Baseline: `08f47a2cba72184c8a9894b2c88ae144655b94f7`, existing `main`.
This record describes local verification. It does not certify deployment.

## Implemented

- `pages-release/current/`: shared strict inventory validator; missing, modified, unregistered, unsafe paths and symlinks fail together. Only explicit exact-digest approvals modify the manifest. Six negative/atomicity tests cover the gate.
- `.github/workflows/`: common validation, existing browser gates, D669/media/game coverage, one reusable publisher, stale-main protection and public-commit verification.
- `current-site/room-section-nav.js`: Journal retains its own tabs. The outer navigator previously made the canonical Journal inert when supplemental memories appeared first, preventing keyboard focus. The original ArrowRight assertion remains unchanged.
- `current-site/course-packs/`, `course-content/`, `course-source-reader.js`, `course-learning-path.js`: extracted the unchanged D669 catalog, published seven supplied JSON references and exposed seven existing practice packs. References load on demand; learning/reward owners remain authoritative.
- `current-site/assets/licensed/`, existing animation/audio/wardrobe adapters and `licensed-assets.css`: actual uploaded effects, icons, textures, five optional clips and lightweight approved potion/human mesh renders. Four finite animations have reduced-motion posters. Source models stay outside deployment in `asset-sources/approved/`; reproduction tools are in `tools/asset-pipeline/`.

Authors, source-page licenses, transformations and output hashes are recorded in the licensed asset manifest and existing in-app `assets/IMMERSION-CREDITS.html`. CC BY human meshes preserve attribution. WomanBody13, superseded potions archive and colorful Poof were excluded.

## Local verification

Canonical validator/build passed: 974 locked/actual files, zero errors; candidate release key `5c35c9a8ad3d62b6`. Existing Node release checks, D756 classifications and six manifest tests passed. At 390, 820 and 1366px, browser suites passed for:

- Original startup/learning and Journal keyboard checks, transfer/resume and duplicate reward protection.
- All 15 routes, stable navigation listeners and no horizontal overflow.
- Seven D669 documents/packs, real feedback and preserved notes/academic progress.
- Licensed media, lazy effects/audio, reduced motion, mute, potion previews and model decoding.
- Communication Quest, investigations, constellation pairs and Oracle controls.
- Existing Sanctuary, Alchemy, Commons and complete D756 Council script/scenario/UX/meeting suites.

Six Playwright integration/lifecycle cases passed. Commons control-contrast checks found no failures. Source and compiled startup/Journal tests passed. Execution logs/screenshots remain under `/workspace/work/directive-*`; committed provenance and measurements are under `docs/audits/evidence/completion-2026-11-24/`. Live production verification remains required.

## Performance limits

Five alternating clean-context Chromium runs at 1366px, localhost, no throttling: median DOM ready 2020 to 1792ms; load 2403 to 2100ms; script CPU 826 to 772ms; total task CPU 2482 to 2269ms; heap 7.54 to 7.11MB. Render count stayed four; no iframe elements. Median transfer rose 8.86 to 9.21MB and observed long-task duration rose 1231 to 1363ms. These mixed results do not establish a universal speed improvement. Added bytes and long-task variability remain optimization work. Full observations/conditions are committed.

## Remaining asset blocker

The replacement blue-white Poof source page and CC0 license were identified, but its original PNGs/replacement ZIP are absent from downloadable attachments. Inline previews cannot establish original frame bytes/order. No replacement Poof is claimed integrated. Existing effects remain functional; certification must distinguish this incomplete requirement.

## Saved-data safety and recovery

No save schema, Guardian controller, scoring implementation or reward authority was replaced. Presentation/reference readers do not grant rewards. Existing replay, transaction, transfer and recovery suites passed. Required consolidation/release ancestors remain preserved; original workspace edits remain untouched.

Revert the specific implementation commit recorded in Git history, explicitly approve deliberately restored source digests, rerun shared/browser gates and publish through the existing workflow. Do not reset learner localStorage or restore an entire old repository. See [release workflow](ENGINEERING_RELEASE_WORKFLOW.md) for review and rollback steps.
