# Majick Studies — Permanent GitHub Pages App

Permanent app:
https://rnw4512-dev.github.io/majick-studies-assets/

## Current live release
**Majick Studies V3.3.9 — Dark Collegium + Adaptive Stability**

The permanent site keeps the V3.3.8 base package and applies the V3.3.9 patch during GitHub Actions deployment. This lets future updates preserve the same public URL and browser origin instead of requiring a new local ZIP every release.

### V3.3.9 deployment pieces
- `majick-pages-site.zip` — stable V3.3.8 site base
- `v339-patch.b64.part01` through `part05` — V3.3.9 patch payload
- `.github/workflows/deploy-majick-pages.yml` — assembles and deploys the current site

### V3.3.9 focus
- stronger adaptive question rotation and difficulty escalation
- Test Week lock disabled
- persistent browser audio unlock
- canon Guardian portraits in study coaching
- darker magical-college sanctuary presentation
- crystal beds and interactive sanctuary furnishings
- existing Phase 4 moving familiar art/routines preserved
- existing moving art served from the same GitHub Pages origin for stability

Normal future updates should continue publishing to this same Pages URL. Browser progress should remain attached to the same origin across code updates.
