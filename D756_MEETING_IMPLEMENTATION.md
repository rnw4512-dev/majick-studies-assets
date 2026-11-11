# D756 Task 2 meeting implementation and recovery

Repository: rnw4512-dev/majick-studies-assets. Integration branch: fix/d756-meeting-integration, based on main 2acf1f2. Reuses compatible dialogue, styling, launch integration, and reward definitions from PR #257; does not merge its stale index or add another studio.

## Use

Select D756, open Hands-on Studio, then Task 2 — IEP Meeting Practice. Select the student and mode. Open **IEP at a Glance** for present levels, measurable goals, supports, monitoring, postsecondary education/employment, and responsibilities. Maya and Jordan are distinct fictional cases, with fictional numeric baselines; Angela's numeric baselines are not invented. Angela's three annual goals come from the supplied task. Exact approved Task 1 support wording still needs comparison with that source document; it was not located in this checkout or connected Drive search. Current supports retain the PR's instructional approach.

Type a professional response and submit. Ask named participants for ideas; ask separately for clarification questions. Stakeholders answer through branching scripts, not live AI. Respond to their statements, then Continue agenda. Unanswered follow-ups and unresolved family disagreement block advancement. Guided coaching is hidden in independent/challenging modes. Reference IEP data remains available in every mode; no mode awards academic mastery.

Back / pause and Close preserve the draft, elapsed active time, transcript and pending stakeholder response. Resume restores them after reload. Begin / restart deliberately replaces an unfinished rehearsal while archiving it as abandoned with zero reward. Previous attempts show receipts and expandable transcripts. The report offers criterion-specific suggestions and transcript excerpts. Retry disagreement is a focused exercise with no reward eligibility.

## Owners and state

- `current-site/d756-task2-meeting.js`: sole meeting engine, scenario data, provisional rule-based indicators, renderer and isolated rehearsal persistence.
- `current-site/d756-hands-on.js`: existing studio; launch is attached to its current overlay through the meeting module. It remains the studio owner.
- `current-site/reward-core.js`: sole wallet and reward ledger owner; adds two practice reward definitions only. The meeting calls `inspect()` to let this owner initialize a fresh ledger before inspecting prior claims.
- `current-site/index.html`: loads meeting module once, after the studio.
- `pages-release/current/build.py`: resolves the release check from every nested index (including Pixi Sanctuary), avoiding its pre-existing missing nested release.json request.
- `current-site/source-manifest.json`: reviewed runtime byte hashes for canonical build/cache release.
- `tests/d756-meeting-browser.py` and `.github/workflows/d756-meeting.yml`: Chromium acceptance coverage against the real app and reward core.

Save key: `majick-d756-task2-rehearsal-v1`. History key: same plus `-history`, retaining the most recent 30 attempts. Existing PR saves are read conservatively; old records without current validation evidence do not automatically qualify for rewards. No established course, identity, Guardian, Sanctuary, wardrobe or mastery data is cleared.

First reward key is `d756:task2:meeting:first-success:v1` for every profile/mode: 30 XP / 5 crystals. Repeat keys are `d756:task2:meeting:repeat:YYYY-MM-DD` in the learner browser's local calendar: 8 XP / 1 crystal, maximum one repeat/day. No separate meeting wallet. Both reward types have zero mastery XP, egg fragments and loot chance; calls pass independent=false and masteryEligible=false. Existing reward-core may mirror shared wallet totals into course state; that is not course learning progress.

Qualification requires all 12 stages, five separate input turns, three separate clarification turns, direct student/parent/teacher invitations, three measured annual goals, strengths/needs, progress monitoring, education and employment, an addressed disagreement, meaningful distinct responses, next steps/closing and 900–1200 active seconds. Rule/keyword indicators are provisional and cannot establish professional competence or prevent deliberate semantic gaming. Browser-local ledgers are not a tamper-proof server assessment.

## Validation

Run the canonical build, then serve the build and execute:

```sh
python pages-release/current/build.py current-site /tmp/majick-meeting-build
python -m http.server 8765 --directory /tmp/majick-meeting-build
# In another shell, with Python Playwright and Chrome installed:
python -u tests/d756-meeting-browser.py
```

Reward duration tests use Playwright's virtual clock, explicitly not a real-time 15-minute human rehearsal. Browser contexts are fresh test accounts; tests do not modify the user's own browser save. Existing release checks and browser-interactions/browser-probability remain separate regression coverage. CI runs canonical build and full acceptance; existing Commons CI covers its three widths. Final commit/PR, check results, and publication status are reported in the release report.

## Break/fix and recovery

- Missing launch: select D756, inspect the loaded meeting script and `MajickD756Meeting.refresh()`. Check the studio overlay exists. Keep one script inclusion/owner.
- Participant mismatch: inspect `indicators()` participant matching; honorifics must not count as names. Inviting input and soliciting clarification are intentionally separate counters.
- Stuck follow-up: read the latest stakeholder reply and respond to its topic. Inspect `pending`, `awaitingReply`, `addressesPending()` and the transcript. Never fix by automatically agreeing or incrementing stages.
- Resume/timer issue: inspect the isolated save, preserve a copy, and compare elapsed/started/active/resumable/draft. Saved elapsed is a snapshot; started=0 on disk prevents counting a closed page. Do not clear all localStorage.
- No reward: inspect report criteria, then `MajickRewardCore.inspect()` and the authoritative account ledger. A short, late, abandoned, duplicate or incomplete meeting correctly earns zero. Do not manually credit XP or delete dedupe keys.
- CI canonical build rejects a source: update only reviewed changed file SHA-256 entries in source-manifest, then rebuild. Never bypass source integrity.
- Rollback: revert the integration commit (or its squash merge commit) and publish through deploy-majick-pages.yml. Retain rehearsal/history keys and shared reward ledger; rollback must not reset earned balances or unrelated progress.
