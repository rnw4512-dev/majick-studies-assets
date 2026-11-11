# Sanctuary runtime recovery — 2026-11-11

## Existing owners retained

The parent account, `MajickSanctuaryState`, `MajickGuardianCare`, approved Guardian registry, existing Atelier player and Wardrobe Studio remain authoritative. Pixi remains a rendering adapter. Phaser remains available and shares the same saved room. No protected artwork, IDs, evolution thresholds, reward pipeline or saved coordinates were replaced.

## Verified repairs

- Reused the compatible selector repair from open PR #261: audits recognize both `#phase4SanctuaryFrame` and the legacy class. The PR's omitted source hashes are updated in this package. Audit status is read-only; a renderer reload now requires an explicit confirmation. Duplicate saved IDs are surfaced, never silently removed.
- Screenshot review exposed an actual mobile defect: the iframe's aspect ratio left the Sanctuary floor below the clipped viewport. The active same-origin Pixi frame reports its content height; the parent sizes that frame without changing the canvas geometry, saved room coordinates or Phaser fallback. Tests assert that the room fits within the embedded viewport.
- Sanctuary previously displayed no shared Scholar. The parent now presents the existing Atelier's approved layered avatar beside the saved Guardian room, using the same player object and Wardrobe Studio. Saved hair/robe changes refresh on closing the Studio and survive reload. Accessories remain saved and explicitly labeled as awaiting fitted artwork. This is a shared presentation, not a second avatar engine or a new movable floor character.
- Browser injection demonstrated older route bridges accepted messages from the parent window itself. Route handlers now require the active same-origin Sanctuary iframe. Existing real renderer routes remain valid.
- Existing one-app ticker and exact ID mapping were confirmed. Added read-only texture/bridge/spawn/ticker diagnostics, incomplete four-frame-cycle reporting, a slow/normal/fast control on that same ticker, and a visible saved-name fallback when texture loading fails. A missing image does not delete a Guardian or change its saved species/stage.

## Art inventory and generation handoff

`aetheria-missing-visual-assets.json` lists 50 incomplete species/stage walking cycles. Each entry records its actual approved source, exact proposed path template, reference canvas dimensions, transparency, required four-frame count and current status. `tools/aetheria-sanctuary-asset-gaps.py` reproduces this inventory using Pillow. It does not generate or overwrite art.

For each listed cycle, preserve the approved design/evolution silhouette, canvas, baseline and transparency. Create four distinct coherent gait frames numbered 1–4 at the recorded path template. Keep the existing approved pairs intact; do not repeat ABAB and label it four unique frames. Compare the whole cycle at slow/normal/fast speeds, left/right and all three viewport widths before wiring it into `artFor`. Six species' illustrated evolution cards remain in the profile, never used as opaque walking sprites. Existing portrait/still/pair fallbacks are labeled honestly. Fitted accessory artwork requires a specific approved accessory source before generation; no invented design is listed as approved.

## Verification and limits

The baseline existing Sanctuary browser suite passed: 11 exact identities including two distinct Briars, all five Velora stage pairs, frame geometry and floor bounds, repeated synchronization, sprite hit feedback, furniture store/place/drag/reload, exact-ID care and unavailable-resource rejection, Phaser fallback shared positions and stale room snapshot rejection.

The recovery acceptance test exercises 390/820/1366 using fresh fictitious storage: all ten species and duplicate individual identity, saved stage, walking gap reporting, one ticker, pause/reset/speed, shared avatar/wardrobe/outfit/accessory persistence, missing-texture injection, confirmation cancellation/acceptance and route-source isolation. Actual executable results and screenshots are recorded separately. No claim is made that unavailable four-frame cycles or fitted accessories have been delivered. Live production verification is required before calling the recovery deployed.

Remaining visual limitation: **P2** — complete approved four-frame walking cycles and fitted accessory images are unavailable. Functional renderer, saved care/room and avatar selections retain their working fallback. Unknown/future saved IDs are diagnosed rather than destructively repaired.
