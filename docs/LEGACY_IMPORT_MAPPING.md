# Phase 3 legacy progress mapping

Use the frozen source inventory for exact key names, owner modules and database stores. This checkpoint exercises author-created JSON fixtures and an in-memory destination. Production migration requires separate approval and review of actual deployed storage coverage.

## Source selection

1. For modern recovery envelopes, test `primary-workspace-v2`, `previous-workspace`, then `primary-workspace` in that order. Validate format, revision, workspace payload and auxiliary values. Preserve distinct valid copies for review. An unsupported newer schema blocks import.
2. Local workspace order is `moonlit_learning_v1`, then its recovery-previous, before-restore, good-backup and session-backup records. A selected modern recovery envelope overlays its auxiliary values on the permitted standalone auxiliary keys. A pinned workspace must use its paired Council auxiliary data. Replace values per key. Never concatenate parallel copies of progress or receipts.
3. The historical unversioned quota envelope competes with the local workspace using the legacy metadata timestamp rule. Flag explicit divergence and materially different valid copies in the preview. The suggested source follows legacy precedence. The user chooses one complete candidate before confirming replacement.
4. Other archives and the PMFC fallback need dedicated fixtures and historical source review before promotion to mapped progress. Keep unreadable records in source storage. Never load an opaque raw string into a new portable backup.

## Destination mapping

| Legacy source | Workspace destination and rule |
|---|---|
| `S.courses`, `S.progress` | Copy course-keyed records, preserving attempts, modes, evidence and course-local balances. No grading, deduplication by question ID or reward replay. |
| `S.legacy.pets`, `S.legacy.eggs` | Key by existing stable ID, preserving stage, aliases, bond, care and hatch metadata. Reject ambiguous IDs. Preserve remaining roster/world metadata in the legacy extension. |
| Wallet and receipt owners | Preserve historical wallet and receipt fields verbatim in their source context. Validate the account wallet precedence, fragment counters and receipt equivalence before activating them in the new reward engine. Never add together account, course and mirrored legacy balances. |
| Council prefix, observatory, fragment evidence, hands-on and exam review | Preserve allowed auxiliary records keyed by exact source name. Feature-specific normalization follows the relevant course parity work. |
| Imported materials | Preserve fallback rows for review. Future separate database reader reconciles by exact row ID and later valid updatedAt, flags ties with unequal payloads, and accounts for deletions before promoting rows. |
| Sanctuary, furniture, objects, layout, journal, experiences, response mode and path selections | Preserve under source keys for later feature adapters. Keep renderer preferences as history. Preserve unknown safe JSON in a versioned extension. |
| Session drafts, navigation, personal artwork/music, artwork review | Session drafts require explicit scope. Media needs a separate device-local transfer. Artwork review and transient state are outside learner mastery. |
| Cloud session and configuration | Exclude known cloud keys and credential-shaped fields recursively. Unknown opaque values and malformed JSON remain at their source. Do not include tokens or source payloads in logs. |

## Synthetic checkpoint

Fixture coverage starts with modern checkpoint precedence, local workspace recovery, auxiliary overlay, materially different copies, version validation and known credential exclusions. No source adapter is registered. No real browser or database reads are part of this checkpoint. PMFC, separate materials, device metadata and feature-specific wallet normalization remain before release.

Preview binds reviewed candidates to the destination owner and exact revision. Applying an approved selection retains the destination checkpoint before replacement and uses atomic compare-and-swap. Stale previews, failed retention and cloud-linked destinations block replacement. A retry of the same mapped state is a no-op, and a changed destination requires renewed review. The previous legacy workspace stays available at its original source. Before any live use, review the mapping with Claude and obtain explicit approval for the device/browser and actual import.
