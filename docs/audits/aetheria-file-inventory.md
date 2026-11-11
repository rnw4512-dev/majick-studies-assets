# Aetheria repository inventory — first safe cleanup pass

Baseline: `31be7d10f31ebb71b66a2055ef0246d228aac9ce`, 2026-11-11.

The baseline has 1,174 tracked files. The first machine scan includes the new inventory tool (1,175 entries), 889 canonical resources, 255,687,204 tracked bytes, 97 exact-byte duplicate groups and 12 repeated CSS rules. These are search findings, not deletion approvals. The JSON is regenerated with the final staged report/tool files before committing, so its final entry count includes the cleanup additions.

`aetheria-file-inventory.json` contains one row per tracked file: exact path, purpose, runtime status, potential references, risk, KEEP recommendation, evidence, size and identical files. It also records dynamic templates, storage-operation locations and identical CSS rules. Reproduce with `python tools/aetheria-inventory.py`. Reference search uses quoted basenames and may over-report consumers; it does not establish reachability. Except for the browser-verified main entry, runtime status defaults to unknown. Never infer disuse from an empty reference list.

## Structure and entry points

- `current-site/index.html`: canonical campus, embedded academic banks, shared S and legacy adapters.
- `current-site/sanctuary/index.html`: Phaser scene and safe fallback; contains its own rendering runtime.
- `current-site/pixi-sanctuary/index.html`: Pixi scene connected to shared parent state.
- `current-site/atelier-fit-review.html`: independently addressable art review gate; retain unapproved art.
- `current-site/d772-oa-focus.html`: independently addressable D772 practice; preserve saved links.
- `current-site/refresh-v3317.html`: compatibility redirect; old external bookmarks are unverified.
- `current-site/source-manifest.json`: reviewed canonical file hashes. The build verifies these before copying.
- `pages-release/current/`: canonical builder and source/browser regression tools.
- `pages-release/v*/`, patch archives and root legacy art: historical sources and recovery material. Canonical publishing does not overlay them.
- `.github/workflows/deploy-majick-pages.yml`: established publisher. Other workflows include art generation/review, Commons, integration and meeting checks. Art workflows can commit generated changes; do not dispatch them as cleanup.

## Classification and dependency findings

KEEP all assets and compatibility modules. Historical runtime files often exactly match a canonical file, but old patches and independently addressable asset URLs are possible consumers. Empty Guardian-named files are not evidence that their identities/art may be removed. Twelve identical CSS declarations are retained because selector order, media queries and cascade are not proven equivalent.

REPAIR: save schema handling, probability stage navigation, shared answer diagnosis and stale publication documentation. No modules, course banks or renderers were retired. No Guardian files were changed.

ARCHIVE/REMOVE: none proven safe in this pass. No source or asset deletion is proposed.

## Dependencies, performance and security

No package.json/lockfile governs this static application. Pixi is vendored as `vendor/pixi-8.6.6.min.js`; Phaser is separately vendored under Sanctuary. No dependency upgrades were attempted without rendering equivalence tests. The canonical entry is a large inline source (~775 KB before publication); startup bundle splitting and image conversion are deferred to avoid changing script order or protected artwork. Source build checks all script syntax and referenced HTML scripts/styles; dynamic references need browser coverage.

A full credential/secret audit, memory-leak profile, all dynamic-asset audit and every-visible-button audit remain incomplete. No external synchronization or external model service was configured by this cleanup.
