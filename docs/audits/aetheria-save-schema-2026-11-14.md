# Save-schema regression report

Base: `3d5fa2889a91170a332eb9d70f9156934c032156` (fresh origin/main, 2026-11-14).
Source: PR #260 test-save-schema-safety.cjs; current runtime retained.

## Assertions reconciled

- Reused: future-primary rejection before recovery; byte preservation; no corrupt-data classification; malformed-primary recovery; unreadable original retention; unknown supported fields roundtrip.
- Expanded: all four snapshot keys, invalid/incompatible recovery candidates, explicit error status, full two-course histories, notes/bookmarks, Guardian ID/stage, eggs, inventory, XP/crystals, reward/alchemy transactions.
- Added for newer main behavior: D756 separate-key rehearsal transcript/history export/import; later-earned ledger/currency and hatched-egg protection; unsupported imports; quota failures; unavailable snapshots; partial auxiliary-key rollback.
- Superseded: PR #260 runtime replacement. Main already has schema rejection and newer Council/reward safeguards.
- Existing coverage retained: release-checks.cjs save migration, snapshots, quota and course isolation; Sanctuary state and reward replay suites.

## Reproduced defect and focused repair

The new partial-import test failed on current main: a successfully written new Council key remained after a later key failed. Rollback now restores overwritten keys and removes newly introduced incoming keys. It attempts each rollback operation independently and explains where the retained recovery copy is if rollback itself cannot finish. It preserves the established save owner, namespace, schema, backup UI and earned-reward merging.

## Verification

`node pages-release/current/test-save-schema-safety.cjs current-site`: reproduced FAIL before fix, PASS after fix.
All 22 canonical Node suites pass; exact commands/output in evidence/aetheria-2026-11-14/sprint1-tests.json. Integration workflow now runs on relevant pull requests and includes the schema suite. This does not authorize production publishing or claim browser certification. Tests use isolated synthetic storage only.

Rollback: revert this focused change; never clear learner storage. Current production publishes current-site on main pushes, so this branch must remain unmerged pending certification and deployment authorization.
