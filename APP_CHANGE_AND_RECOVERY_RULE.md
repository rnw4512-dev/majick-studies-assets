# Mandatory App Change + Recovery Rule

**Status: HARD RULE — applies to every future feature, fix, asset, release, and migration.**

Every app-building task MUST end with an accurate implementation and recovery report. This applies to Majick Studies and is the template to follow for every other app project going forward.

## Required change report

1. **What I changed:** exact features, behavior and code/assets modified; identify new work versus pre-existing functionality.
2. **Where:** repository, branch, precise file paths and commit SHA (or say explicitly that nothing was committed).
3. **How to see/use it:** user-facing location and actual steps to test it.
4. **Verification and status:** checks performed and their results; explicitly distinguish committed, built, deployed, manually tested, visually validated, and not tested. Never infer successful use from a passing build.
5. **Known issues and unfinished work:** failures, unsupported combinations, risks, and anything awaiting approval.
6. **If something breaks — actionable recovery:** describe symptoms, likely failure points, how to diagnose each issue, minimal safe fix or fallback, and how to revert the specific change without wiping unrelated data.
7. **Safety:** identify existing systems and user data that must remain intact; never overwrite progress, earned rewards, inventory, identity, or course separation to repair appearance or UX.
8. **Next step:** concrete highest-priority follow-up, owner, and acceptance criteria.

## Release requirements

- Inspect current source and existing behavior before modifying code; preserve the current canonical branch.
- Prefer one owner for each state/rendering system; no duplicate engines.
- Validate functionality and content coverage; do not use placeholder features to claim completion.
- Run appropriate source integrity, unit/integration and browser/visual tests when feasible.
- Publish only through the project's established workflow.
- If a release fails, state so plainly and provide the exact recovery action and source of truth.
- Any unverified asset must remain gated behind the existing safe fallback.
- Do not claim a fix is done unless implemented and verified to the stated degree.
- Preserve relevant before/after checks and rollback steps for migrations.

## Mandatory report template

### Change summary
- What was added, fixed, or removed:
- Files changed and commit:
- Where to find it:

### Verification
- Automated checks:
- Browser or manual checks:
- Deployment:
- Not yet verified:

### Break/fix guide
- Symptoms and likely cause:
- Diagnostic steps:
- Fix or safe fallback:
- Rollback method:
- Data and features protected:

### Remaining work
- Open issues:
- Next action and pass criteria:

For projects without a Git repository, substitute exact file/version identifiers and clearly state that no GitHub commit or deployment occurred.
