# Aetheria Alchemy recovery — 2026-11-11

## Ownership and preservation

Existing `reward-core.js` owns ingredients, potions, fragments, reward ledger and egg spending. The new `rewardCore.alchemyTransactions` records spending receipts in the same main save; it is not a new wallet. No saves, academic records, earned rewards or protected art are reset. Existing recipe IDs/costs, Guardian IDs and reward keys remain valid. Council auxiliary saves are included in the existing Save Safety export/import, without a competing backup UI.

## Verified defects and changes

Before repair, repeating a conjure invocation spent 20 fragments and created two eggs. Potion use outside a learning context consumed inventory without displaying the advertised learning effect. Clarity, Recall and Crystal Sight had no consumers; Starlight charges never expired and Moonfocus had no functioning consumer.

Crafting, kit collection, egg conjuring and potion use now validate requirements, commit once, save one receipt, and roll back on save failure. Cancellation spends nothing. A repeated transaction key returns its saved receipt, including after reload. A pending egg for the selected species prevents another pending duplicate. Existing already-owned Guardians are preserved. Starlight cannot spend charges on an already-ready egg. Ordinary guided/correct-answer clicks do not grant fragments; explicitly assisted mastery/fragment events are rejected without claiming the independent reward key.

The Workshop shows fragment progress, ingredient costs/ownership, active durations, last transaction and routes to learning/Sanctuary. All five recipes retain their original costs. Clarity shows an authored key clue on the current Oracle Lens/Gauntlet item. Crystal Sight displays the existing item-specific distractor explanation. Both flag the answer as assisted through the existing learning owner. Recall selects an actual previous independent question from existing question memory, persists the retrieval, awards four practice XP at most once per course/item/day, and never awards mastery or fragments. Visual-dependent prompts are excluded from text-only retrieval. Moonfocus grants +25% bond for five independent correct answers; Starlight adds one moonlight to the focused unready egg for three independent correct answers. Unavailable contexts explain the requirement and preserve the potion. Previously unused legacy instant-effect counters refund the corresponding potion once; no independent academic proof is inferred.

Save Safety includes the existing Council main/history/replay keys in exported bundles. Older backups cannot refund later spending, remove earned ledger keys, or resurrect a hatched egg. Import keeps current earned wallet/world state if the incoming ledger predates current transactions; academic progress can still be restored. A future-schema main save remains byte-for-byte intact instead of falling back and overwriting it. This compatible guard was reused from open PR #260; that PR's unrelated changes remain separate.

## Executed checks

`python -u tests/aetheria-alchemy-browser.py current-site` passed at 390, 820 and 1366 pixels using Chromium, actual UI brewing/learning/hatching/download/file import, and fresh fictitious browser storage. Tests exercise all five recipes/effects, insufficient costs, cancellation, repeated commits, ten unique verified-event fragment fixtures (not assertions of real human mastery), one egg, focused incubation, one hatch, assisted boundaries, daily Recall limits, export/import/previous-save recovery, pre-hatch backup restoration, reload, legacy migration, future schemas and injected save failure. No JavaScript errors or missing static assets occurred. Screenshots are in `evidence/alchemy-recovery/`.

These are local browser results. Merge/deployment/live verification are reported separately; this document does not assert production deployment.
