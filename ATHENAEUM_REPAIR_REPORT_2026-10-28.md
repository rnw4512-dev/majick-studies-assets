# Athenaeum feedback and saved-practice repairs — 2026-10-28

## Change summary

Repository: rnw4512-dev/majick-studies-assets. PR: #230. Starting snapshot: 49a4ada123be0fe2e4ae926b73dbd8e1b9667331. Implementation commit: 9681da4f0b7880d4c5b1b001aef3b4e32d0e9970, developed on fix/athenaeum-review-repairs for the existing PR branch fix/athenaeum-feedback-flow-20261028. A subsequent test/report commit strengthens the scroll-control assertion. No merge or deployment.

Files:

- current-site/wgu-practice.js: repair over-escaped fraction, mean and range regex literals. The fraction regex previously prevented the entire script from parsing.
- current-site/course-tutor.css: remove the classroomStage height cap and vertical scrollbar, keeping lesson panels in the page layout.
- current-site/course-tutor.js: route Up/Down/Top controls to the actual scrollable ancestor or document, respecting reduced motion.
- current-site/your-turn-practice.js: reject blank/invalid numbers and incomplete sequences without recording an attempt; deduplicate normalized question/answer submissions; invalidate correctness and displayed feedback as soon as an answer changes; preserve input focus; save drafts, selected question, help state and deduplication receipts under existing course progress through window.save(). Content-keyed snapshots prevent restoring answers against different questions. Both course identity and progress-owner identity guard stale handlers.
- That same renderer adds 48 supplemental, scenario-specific explanations for sequence exercises and removes repeated explanation sentences. Original question-bank records, answers, source rationales and IDs remain unchanged. Numeric feedback retains the verified calculation, and correct answers also show reasoning. Guided practice remains separate from independent mastery.
- current-site/source-manifest.json: regenerate all four changed source entries.
- tests/athenaeum-repairs.spec.cjs and .github/workflows/integration-regression.yml: cover responsive practice and economy regressions, and run them on PR #230's branch alongside existing integration tests.

## How to use and inspect

Open The Athenaeum, D772, Section 2 Lesson 4, then Your Turn. Checking a blank answer must not add a struggle. Submit 10 twice: one struggle. Submit 12 twice: one success and one existing 3-XP participation reward, with zero crystals. Edit the answer: the old feedback/checkmark disappears immediately. Reload to recover the draft and selected question. In Section 1 Lesson 1, an incomplete sequence is not recorded; a complete wrong order explains all district teachers versus drivers at one school and the risk to representativeness.

All seven classroom panels should grow with their contents. Up/Down/Top operate the page scroll owner; the parchment itself has no nested vertical scrollbar.

## Verification

- Canonical build: PASS; final release fingerprint 64cd32386f3b1129. This build checks script syntax, manifest hashes, referenced files and release-stamped assets.
- Source manifest: all 871 registered files match SHA-256.
- Additional strengthened scroll-control run: 3/3 PASS. Down physically advances the page scroll owner at every required width, and the classroom stage stays at scrollTop 0. The assertion includes document/body/main offsets and waits for scrolling to settle.
- Deterministic release checks plus all 17 existing Node regression scripts: PASS.
- Existing Playwright integration assertions: 5/5 PASS against the final rebuilt site. Local execution adapted only the runner import, source-root path and server port; assertions were unchanged.
- Final responsive practice suite: 12/12 PASS at 390/820/1366px. It covers blank/duplicate submissions, exact 3-XP participation, correct-state invalidation, reload, question selection, course isolation, saved ordering, feedback, all seven tabs of all 11 D772 lesson exercise groups (231 tab/width combinations), reward replay and fragment conversion at 390/820/1366px.
- Reward calculation check: difficulty 4 correct-answer reward with independent, delayed and transfer flags is 41 XP and 3 crystals, no fragments. Replaying its key changes nothing, including after reload. Focused existing egg gains 4 moonlight; the other egg retains its 9. Two explicit fragment conversions turn 25 fragments into 5 and add exactly two eggs, preserving both existing eggs. Below 10 fragments no conjuring dialog opens. Balances and roster survive reload.
- D756 course isolation uses a real course switch plus the public practice renderer in a synthetic host. Its built-in outline has no uploaded Tutor classroom, so actual D756 classroom navigation is not certified. No uploaded material was invented to make that test pass.
- All tests use synthetic browser profiles and synthetic balances, never actual learner saves.

Full existing browser gates were run on the first repaired build f2699a5fa47e0938 before the final draft-fingerprint/focus refinement:

| Suite | Result |
| --- | --- |
| Sanctuary | PASS: eleven Guardians, duplicates, furniture, care, reload, currency/progress isolation and Phaser fallback |
| Interactions | FAIL: waits for missing .mjCompactSkillDetails button[onclick*=skillReview]; WGU owner startup and preceding lesson/chart/reasoning assertions now pass |
| Probability | FAIL: waits for missing #connectedProbability after Game Realm navigation |
| Commons | FAIL: contrast violations and an existing missing drawer in commons-interactions.cjs:38; responsive tab/control audits and earlier navigation checks ran |

These unresolved gates still block stable certification. The final focused suite runs against final build 64cd32386f3b1129; no full-release pass is claimed. Chart text contrast and the fixed Scholar overlay also remain visual limitations outside these six repairs. No production or cloud-sync verification.

## Break/fix guide

If drafts do not restore, check the existing save-status indicator and browser storage quota/recovery status first. Data lives under S.progress[course].yourTurnPractice[lessonId][contentSignature]; a changed question set intentionally uses a different snapshot. Do not clear storage or alter other course records. Export a backup through the existing save-safety tools before investigating.

If record counts increase twice, inspect the persisted attempts receipt for that normalized answer and confirm the handler still has the active course/progress owner. If scrolling regresses, inspect computed classroomStage max-height/overflow and the actual page scroller rather than adding another practice-only override. If WGU practice fails to load, start with node --check current-site/wgu-practice.js and console errors.

Rollback with a scoped revert of implementation commit 9681da4 and the associated test/report follow-up, then rebuild through pages-release/current/build.py. The new saved namespace is additive and can remain intact during rollback; never reset progress, XP, crystals, egg balances, inventory, Guardian identity or Sanctuary state. A full implementation revert also restores the old regex failure, so prefer a minimal follow-up fix when possible.

## Remaining work

Implementation owner: resolve the existing Skill Growth/Commons drawer selectors and probability route failure, investigate chart/Commons contrast and fixed-overlay placement, rerun the complete browser release gates, then verify deployment before stable promotion. PR #230 stays draft and unmerged while those gates fail.
