# Aetheria safe cleanup — first reviewable pass

Status: **INCOMPLETE; not merged or deployed.** Safe work has been executed on `maintenance/aetheria-safe-cleanup`; full cleanup certification has not passed.

## Baseline and rollback

Original commit: `31be7d10f31ebb71b66a2055ef0246d228aac9ce`. The live application and D756 simulator were verified before cleanup. Published build ID: `f2091057235fc98c`; deployed entry and meeting/studio/reward modules matched the canonical build byte for byte. Pages deployment run: https://github.com/rnw4512-dev/majick-studies-assets/actions/runs/43085156686 .

Published rollback tag: `backup/aetheria-pre-cleanup-20261111`. Archive extraction from the tag matches the baseline source entry SHA-256 `3a1d8ce2bbe947db8e2002f9929fed81dcb40619210c2c7b5c5050efe5f80d01`. No destructive rollback or history rewrite was performed.

Repair commit: `75ad8fa0ac67fb0204a5fc046af902d52a3668c7`. Mobile layout repair: `28d8c704281c4621369f4eca50a913c90f6ce308`. The separate inventory/documentation commit follows it; obtain the complete final branch SHA from the cleanup PR head. A document cannot contain its own resulting Git commit hash. PR status is recorded in the PR and delivery message.

## Changes

- Repaired unsupported-save-schema fallback to preserve newer learner data.
- Consolidated probability stage/Back activation in its existing owner and removed deferred stage rendering.
- Restored diagnostic caution for authored distractor coaching without losing detailed feedback.
- Repaired mobile Progress Safety grid sizing and import control clipping.
- Added source and actual-browser progress-safety regressions and CI coverage.
- Corrected historical release documentation to identify the canonical source/publisher.
- Added per-file machine inventory, dynamic templates, duplicate groups, storage-operation locations, feature ownership, GitHub hygiene inventory and reproducible reports/evidence.

Files archived: none. Files removed: none. Guardian art, identities, course content, progress structures, XP rules and mastery requirements were not changed. No obsolete code was declared removable solely from static reference absence.

## GitHub hygiene

`aetheria-github-inventory.json` records all 283 remote branches and 40 open PRs observed before creating the cleanup PR. Exact branch-tip comparison to baseline finds 223 with unmerged commits and 60 tips already contained in main. All unmerged work is kept; contained tips are only candidates for owner review and archive before deletion. No branch or PR was deleted/closed. Age alone does not establish abandonment. Review update dates and dependencies; the overlapping Task 2 PR #257 must not overwrite merged #258/#259. PR #243 already proposes legacy ownership changes; coordinate before migrating wrappers. PR #231 contains unmerged effort/reward-journal work.

Suggested destructive GitHub operations: none executed or requested in this pass. Any later deletion/closure needs separate approval and an archive reference where appropriate.

## Known gaps / release boundary

Confirmed test failures remain in Commons preassessment lookup and parchment visibility/contrast setup. Their causes need diagnosis; no claim they are repaired. Suspected separate-key rehearsal backup gap needs versioned export design. Unverified legacy code, dynamic assets, exhaustive button coverage, memory/CPU profiling, dependency security review and full appearance variants remain KEEP/deferred. Stable certification and cleanup deployment are blocked.

Live URL (unchanged baseline): https://rnw4512-dev.github.io/majick-studies-assets/ . New fixes are on the review branch only. No stable-release claim is made. The existing live version remains unchanged because required browser gates are not all passing.

Highest-priority continuation: resolve the two remaining existing browser failures, run full three-width critical workflows against a fixed commit, complete separate-key progress/appearance coverage, then integrate only passing approved changes and verify live build correspondence. No paid dependency or external service was added.
