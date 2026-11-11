# Aetheria regression evidence — first cleanup pass

Baseline: `31be7d10f31ebb71b66a2055ef0246d228aac9ce`. Tests run against the actual canonical build in isolated Chromium contexts; source/VM checks are separately described.

| Check | Result / boundary |
|---|---|
| 21 pre-existing Node source suites | All PASS at baseline; module/VM tests, not full browser certification |
| 22 source suites after repairs (21 existing + schema regression) | All PASS; full output in `evidence/final-node-results.json` |
| Canonical builder / syntax / manifest / local HTML script/style references | PASS before and after repairs |
| New schema safety module regression | FAIL before repair; PASS after repair |
| New actual backup/import/restore browser suite | PASS at 390, 820, 1366; unknown fields and course isolation preserved |
| Mobile Progress Safety bounds assertion | FAIL before layout fix; after-fix result in `evidence/mobile-after.log` |
| Existing full probability browser suite | FAIL before; PASS after synchronous stage rendering and shared activation repair |
| Existing full shared-repair browser suite | FAIL before; PASS after shared diagnostic caution repair |
| Existing Sanctuary browser suite | PASS baseline: identities, duplicate instances, five Velora stages, movement, care, furniture, persistence, Phaser fallback |
| Existing immersion browser suite | PASS baseline: audio preferences, reduced motion, mobile layout, protected state |
| Existing full interactions browser suite | Core learning, XP, course isolation, exact full-state reload and sampled contrast PASS; final parchment target visibility condition FAIL |
| Existing Commons browser suite | Many navigation/control-state checks PASS; preassessment lookup FAIL. Overall suite FAIL |
| D756 meeting browser suite on deployed baseline | PASS earlier in this session across 390/820/1366; cases/modes, +30/+8/0 XP, replay, save, disagreement and no runtime errors/assets. Virtual time explicitly used for duration |
| Every visible button / all legacy saves / all Guardian clothing variants | INCOMPLETE; no full certification claim |

Reproduce focused checks:

```sh
node pages-release/current/test-save-schema-safety.cjs current-site
python pages-release/current/build.py current-site /tmp/aetheria-build
python -m http.server 8875 --directory /tmp/aetheria-build
# Separate shell; Python Playwright and system Chromium required:
MAJICK_URL=http://127.0.0.1:8875/ python tests/aetheria-cleanup-browser.py
node pages-release/current/browser-probability.cjs /tmp/aetheria-build
node pages-release/current/browser-shared-repair.cjs /tmp/aetheria-build
```

`.github/workflows/aetheria-cleanup.yml` runs these focused checks in CI and retains progress-safety screenshots. The canonical deployment now also requires the newer-schema source regression. Existing failing browser assertions were not weakened, bypassed or removed.

Evidence is in `evidence/`. Screenshots from the new tests are emitted under CLEANUP_QA_DIR (default `/tmp/aetheria-cleanup-qa`) and retained by the new CI artifact. Logs report automated interactions, not manual visual approval or comprehensive WCAG certification.

Stable cleanup release and deployment are blocked until the Commons and parchment failures are diagnosed, fixed and re-run, and remaining critical coverage gaps are resolved. Existing passing live simulator publication does not certify this cleanup branch.
