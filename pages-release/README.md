# Majick Studies — Permanent GitHub Pages App

Permanent app:
https://rnw4512-dev.github.io/majick-studies-assets/

## Current publication source
The canonical application is `current-site/` on `main`. The current publication
pipeline uses `pages-release/current/build.py` to verify source-manifest SHA-256
hashes, copy those sources, check script syntax and local references, and stamp
release cache keys. `.github/workflows/deploy-majick-pages.yml` runs the source
regressions and publishes that build to GitHub Pages. `release.json` identifies
the build; verify it against the build from the expected commit.

The V3.3.8 base ZIP, V3.3.9 payload parts and versioned directories below this
folder are historical release/recovery material. The canonical deployment does
not overlay them. They remain in place because external/recovery consumers have
not been fully ruled out. Do not edit a historical patch to change the live app.

### Historical V3.3.9 focus
- stronger adaptive question rotation and difficulty escalation
- Test Week lock disabled
- persistent browser audio unlock
- canon Guardian portraits in study coaching
- darker magical-college sanctuary presentation
- crystal beds and interactive sanctuary furnishings
- existing Phase 4 moving familiar art/routines preserved
- existing moving art served from the same GitHub Pages origin for stability

Normal future updates should continue publishing to this same Pages URL. Browser progress should remain attached to the same origin across code updates.
