# Aetheria enchanted Collegium visual polish

## Change summary

Implemented on `visual/enchanted-collegium`, derived from main `3d5fa2889a91170a332eb9d70f9156934c032156`. Visual implementation commit: `8aec0094ecaed6d3c3646a52f82bfd173701e8d0`. Not merged or deployed.

The new `current-site/enchanted-collegium.css` supplies one reusable parchment-and-corner treatment with manuscript, laboratory and trial color variants. It uses existing containers and state classes; it creates no DOM components, event handlers or state owners. Main reading surfaces get dark ink, thin gold margins, quiet grain outside the text, academic headings and engraved plum controls. Native exam progress retains its value, maximum and accessible label, with a small inline SVG crystal at the filled end. Existing success classes and the verified ceremony get a finite 650ms acknowledgment; both system and app reduced-motion settings disable it.

Initial implementation and acceptance covered Study Hall (`mission`), Learn Lab / Athenaeum (`learninglab`), and Trial Chamber (`reasoning`). After that acceptance passed, shared `.card`, `.majCommonsWelcome`, `.majickRoomSections` and existing room-banner edges received the same restrained border treatment. Their established backgrounds, imagery and colors remain in place. Existing botanical, library, celestial and artifact room motifs remain authoritative.

### Files and ownership

- `current-site/enchanted-collegium.css`: presentation only; no external font or texture downloads and no infinite animation.
- `current-site/index.html`: one stylesheet link at the end of the existing stylesheet order.
- `current-site/source-manifest.json`: exact hashes for the changed index, the new sheet and three reviewed stale main entries described below.
- `pages-release/current/browser-collegium-polish.cjs`: isolated Chromium acceptance and rendered-background contrast sampling.
- `pages-release/current/capture-collegium-polish.cjs`: reproducible before/after capture with seeded question ordering.
- `tests/d756-meeting-browser.py`, `tests/d756-ux-browser.py`: retain existing assertions; selectors now follow the retained sidebar entrance and current reference/goal cards.
- `docs/audits/enchanted-collegium/`: 24 screenshots and machine-readable evidence.
- `.github/workflows/` and the canonical build script are unchanged. No room rebuild, runtime learning-code edit, save migration, reward-authority change, academic-scoring change or Guardian-controller change.

### How to see it

Serve `current-site`, choose D772, then open Scholar’s Study Hall, The Athenaeum, or Scholar’s Trial Chamber. In the Athenaeum, choose a lesson, open it, and select Teach to see the reading treatment. In Study Hall, switch Skill Library / Guided Practice; in the Trial Chamber, select and clear an answer, check it, and switch to Guided Reasoning. Keyboard focus remains visible.

## Verification

- Passed the visual acceptance script on raw source and the canonical built output: 13 check groups, 16 rendered contrast sampling passes (176 text runs in the built-output audit; minimum sampled ratio 7.14:1) across 390px, 820px and 1366px, with no sampled AA failures or JavaScript exceptions. Sampling uses real screenshot background pixels with glyph paint temporarily hidden, not an assumed flat card color. This is a targeted visual audit, not a claim that every screen in the app has a complete accessibility certification.
- CSS-only application preserved serialized `S`, control count, progress value/max and accessible progress labels exactly. Tested real Study Hall tabs, lesson opening/Teach, selected lesson distinction, Trial selection/clear/submit, guided-mode switching and keyboard focus.
- Verified unverified ceremony receipts are ignored, the presentation listener does not award progress, animation is finite and both reduced-motion settings produce a static emblem. These synthetic receipts existed only in an isolated browser account.
- Seven additional routes (`home`, `guide`, `games`, `analytics`, `vault`, `sources`, `journal`) mounted without horizontal overflow at all three widths.
- Passed existing Commons, interaction magic, shared repair, D772 cross-room and canonical release-check suites; release checks still report pre-existing instructional coverage gaps without marking them complete.
- Passed Node syntax checks and `git diff --check`.
- Captured all before/after screenshots using the same source and question seed, with only the new stylesheet blocked for the before captures. Reading-stage captures are separate from the Learn Lab navigator captures.

### Manifest unblock

The first canonical build stopped at `collegium-atmosphere.js`. An audit of baseline main identified three stale digests. The source bytes were already committed on main and remain unchanged on this branch:

| Source | Reviewed main change |
| --- | --- |
| `collegium-atmosphere.js` | `511a7a0`: user-gesture music playback and error feedback |
| `d756-hands-on.js` | `9a33181`: remove overlapping floating launcher, retain sidebar |
| `d756-task2-meeting.js` | `1673ed4`: immediate meeting coaching and corrected-response retry |

At the user's request to unblock these, refreshed those exact three manifest entries after history review and syntax checks. Canonical build passed: `0eaa5222d9537a77`. No manifest gate was removed, bypassed or relaxed. The original expected and actual digests are retained in `source-integrity.json`. Unblock commit: `efbc048c29a90461ec367af5d40421b0618d02f0`. All 881 manifest entries now match the source.

The D756 browser tests also referred to the removed floating launcher and superseded `.dmGlance` / `[data-goal]` markup. Their entry and reference selectors were aligned to the current interface; the substantive qualification, reward, replay, persistence and course-isolation assertions remain in place.

Passed four D756 question-classification tests, responsive classroom-writing checks at 390/820/1366px, and course-study / Council UX / knowledge-check / reward-safety checks at all three widths. A Chromium audio smoke check also verified no autoplay, playback on user activation, mute and zero-volume guidance on the reviewed main source. The existing full D756 meeting/reward suite remains enabled in GitHub Actions; its per-commit result is reported on [PR #282](https://github.com/rnw4512-dev/majick-studies-assets/pull/282). Its qualification, daily reward limits, replay protection and unrelated-course assertions have not been removed.

### Reproduce

Use Node with Playwright and pngjs, Python Playwright, and installed Chromium. Start an HTTP server on 8765 for source or 8766 for the canonical build.

```sh
node pages-release/current/browser-collegium-polish.cjs
node pages-release/current/capture-collegium-polish.cjs before
node pages-release/current/capture-collegium-polish.cjs after
python pages-release/current/build.py current-site /tmp/aetheria-visual-build
node --test tests/d756-question-classification.test.cjs
```

`COLLEGIUM_URL`, `COLLEGIUM_QA_DIR`, `COLLEGIUM_CAPTURE_DIR`, `MAJICK_URL` and `CHROMIUM_PATH` allow alternate local ports and output directories. Run the three existing `tests/d756-*-browser.py` scripts against the built output, as in the unchanged D756 GitHub Actions workflow.

## Screenshot review

Each link is a real Chromium viewport capture; width is in CSS pixels and height is 1000px. No new asset downloads are required by the product stylesheet.

| Surface | Width | Before | After |
| --- | ---: | --- | --- |
| Study Hall | 390 | [Before](enchanted-collegium/before-mission-390.png) | [After](enchanted-collegium/after-mission-390.png) |
| Study Hall | 820 | [Before](enchanted-collegium/before-mission-820.png) | [After](enchanted-collegium/after-mission-820.png) |
| Study Hall | 1366 | [Before](enchanted-collegium/before-mission-1366.png) | [After](enchanted-collegium/after-mission-1366.png) |
| Learn Lab navigator | 390 | [Before](enchanted-collegium/before-learninglab-390.png) | [After](enchanted-collegium/after-learninglab-390.png) |
| Learn Lab navigator | 820 | [Before](enchanted-collegium/before-learninglab-820.png) | [After](enchanted-collegium/after-learninglab-820.png) |
| Learn Lab navigator | 1366 | [Before](enchanted-collegium/before-learninglab-1366.png) | [After](enchanted-collegium/after-learninglab-1366.png) |
| Learn Lab reading | 390 | [Before](enchanted-collegium/before-learninglab-reading-390.png) | [After](enchanted-collegium/after-learninglab-reading-390.png) |
| Learn Lab reading | 820 | [Before](enchanted-collegium/before-learninglab-reading-820.png) | [After](enchanted-collegium/after-learninglab-reading-820.png) |
| Learn Lab reading | 1366 | [Before](enchanted-collegium/before-learninglab-reading-1366.png) | [After](enchanted-collegium/after-learninglab-reading-1366.png) |
| Trial Chamber | 390 | [Before](enchanted-collegium/before-reasoning-390.png) | [After](enchanted-collegium/after-reasoning-390.png) |
| Trial Chamber | 820 | [Before](enchanted-collegium/before-reasoning-820.png) | [After](enchanted-collegium/after-reasoning-820.png) |
| Trial Chamber | 1366 | [Before](enchanted-collegium/before-reasoning-1366.png) | [After](enchanted-collegium/after-reasoning-1366.png) |

## Break/fix guide

- Pale copy on a paper card: inspect the changed card selector and its computed `color` / `-webkit-text-fill-color`. The paper and ink must be kept paired. Embedded simulations and charts keep their own palette; do not blanket recolor them.
- Missing focus: inspect competing `:focus-visible` rules. Keep the dark green outline and ivory outer ring; do not replace native button/tab behavior.
- Missing styling after release: verify the single stylesheet link, its manifest digest and the canonical release cache key. Rebuild with the existing build script and reload normally. Do not clear localStorage, reset progress or recreate accounts.
- Canonical build mismatch: compare the named file against reviewed source history and calculate its actual SHA-256. Update only an intentionally reviewed manifest entry; never switch off the check or rehash arbitrary unrelated files.
- Revert the visual implementation with `git revert 8aec0094ecaed6d3c3646a52f82bfd173701e8d0`. If later consolidation touches the entry or manifest, remove only the visual stylesheet link, its manifest entry and file, then recalculate the index digest under the repository's normal process. Keep the reviewed three-hash unblock separate so reverting appearance does not reintroduce known build failures.
- Source tests, browser checks and screenshots are independent of learner accounts. Existing saves, course separation, XP, crystals, inventory, earned rewards, identity, Guardian control and academic evidence remain untouched by the implementation.

## Remaining work and release status

- Local checks and captured Chromium evidence are distinct from remote GitHub Actions results and deployment. This branch has not been merged or deployed.
- No physical-device, Firefox, Safari or assistive-technology certification; no performance benchmark. The stylesheet adds only a small local CSS response and an inline SVG ornament; no runtime dependency was introduced.
- Existing course-content coverage gaps and inconsistent pre-existing room ribbon naming remain outside this visual scope.
- Next owner: repository maintainer. Review the screenshot pairs, ensure existing PR Actions pass, merge through the established workflow, and smoke-test the three pilot rooms on the deployed release. Acceptance: clear reading surfaces, functional controls, no horizontal overflow and preserved learner data.
