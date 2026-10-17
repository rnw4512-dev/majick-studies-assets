# Majick Studies — ChatGPT Project Synchronization Contract

**Authority:** GitHub repository `rnw4512-dev/majick-studies-assets`, branch `main` after merge. During development, also inspect relevant open PR branches.

**Master tracker:** `PROJECT_BOARD.md`. Never create a second board to replace it.

## Every new Majick Studies development session

1. Fetch `PROJECT_BOARD.md` from the connected GitHub repository. If the board is still in PR #141, fetch its feature branch `master-project-board-20261017`. Prefer the merged main-board once available.
2. Inspect relevant open PRs, changed files, CI, and latest deployment before deciding what to build. Never assume a draft or a green unit test means production is updated.
3. Compare the requested work with existing canonical modules and assets; reuse authoritative owners and preserve user progress.
4. Work in a feature branch; make a real fix, add tests, update canonical `current-site/source-manifest.json` hashes for app changes, and run the complete available release gate.
5. Update **the same** `PROJECT_BOARD.md` with the work-session log, completed/in-progress/broken items, discovered assets, exact test results, blocking issues, and next actionable fix. Each feature PR must either include a synchronized board update or link to a board-update PR.
6. Report what changed, how, tests actually run, what remains broken, repair path, and deployed/not deployed.

## Before deleting old Majick Studies chats

Preserve unique assets, source uploads, user-approved character references, unresolved defects, and decisions in the board or attached handoff first. Never delete chats automatically.

## Limits and synchronization

GitHub's ChatGPT app provides on-demand repository access, not a continuously synced index. ChatGPT Project file uploads are snapshots. New sessions should explicitly fetch the latest GitHub board; do not rely on an uploaded copy being fresh.

An automated GitHub-triggered Work task may be available depending on the account and app surface; a scheduled summary is a fallback, not equivalent to after-every-session synchronization. Never claim an automatic Project-file rewrite unless an actual supported workflow has been connected and tested.

## Ownership and safety

Only GitHub is authoritative for code and current board revision. The ChatGPT Project stores instructions, discussions and optional historical snapshots. Do not overwrite source code to resolve document-only conflicts. Never duplicate XP/mastery engines, Guardian renderers, Scholar identity or rewards owners.

## Enforcement now configured

- GitHub Actions workflow `.github/workflows/majick-board-gate.yml` requires `PROJECT_BOARD.md` to change in every pull request that modifies executable files in `current-site/` or `pages-release/current/`. It is pending merge of board PR #141.
- The hourly Majick Studies PR Watch condition-check task checks for new or materially updated PRs and board discrepancies, and notifies only on meaningful changes. It monitors; it does not silently write GitHub or ChatGPT Project files.
- There is **no native GitHub event-triggered Project-file auto-refresh** in the connected tools. In the Project, use these instructions to fetch latest GitHub directly at the beginning of each development session.
