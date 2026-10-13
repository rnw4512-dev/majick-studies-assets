# Majick Studies — current development handoff (2026-10-13)

## Baseline
Repository rnw4512-dev/majick-studies-assets, branch main. Canonical application is current-site/ only, version V3.4.2. Live at https://rnw4512-dev.github.io/majick-studies-assets/. Never restore outdated builds or overwrite learner progress.

## Latest D756 course work
D756 — Individualized Education Plan (IEP) Collaboration and Communication with Parents and School Staff — has an Add Class starter button in index.html (commit 03d2ce1). It creates an empty, isolated course. No D756 outline or lesson material has been supplied yet; do not fabricate official course content. Its startup, reload, and class switching require browser testing.

## Existing D772 functionality
d772-shared-oa-questions.js contains original OA-style Section 2/3 multistep items with worked reasoning and whiteboard/calculator guidance. game-realm.js contains an all-section D772 gauntlet and shared-bank intake. These features are present in code; full browser gameplay and answer accuracy have not been independently verified in this handoff. Preserve D772 questions and progress, and D755 passed-course history.

## Required academic behavior
Any academic information supplied in chat or the application must be deduplicated against coverage, then distributed to every relevant lesson, Study Now, Learn Lab, assisted practice, independent mastery, quiz, review, and Game Realm. Each new concept should have varied OA-style scenarios, worked reasoning, misconceptions, exact-matching visuals and whiteboard/calculator instructions when appropriate. Help-assisted performance must not count as independent mastery. D772 Study Now and games must use all three sections. Courses isolate all academic content, mastery and history. Only global identity, XP, crystals, Guardian roster/eggs, Sanctuary and collectibles are shared.

## Scholar and world work
Keep the adult whimsical celestial dark-academia theme. Four hairstyles times twelve avatar walking frames equals 48 planned masters, NOT 48 accepted art assets. Rejected V2 art stays disabled; preserve fitted V1 fallback. Do not enable V3 motion until individual frame reviews, composite layer completeness and realistic motion testing pass. Do not duplicate renderer, Guardian, XP or Sanctuary owners.

## Next tests and changes
1. Run D756 starter, switch D756/D772, refresh and confirm independent saves and no data leakage.
2. Test D772 question distribution for all three sections in Study Now and Game Realm, multi-step accuracy, visuals, whiteboard use, help/mastery rules and replay.
3. Confirm live deployment, manifests, cache behavior, Guardian and Sanctuary regressions.
4. Continue V3 avatar production assets with contact sheet approval before enabling movement.

## Mandatory change and recovery report for EVERY app update
Record exact completed work, files and commit, visible behavior, pass/fail/untested results, known breakages, troubleshooting and rollback, protected data and remaining work. Clearly distinguish written, committed, deployed, browser-tested, and verified working.

## Safe recovery
D756 issue: inspect startD756Course and save/render in index.html and D756 course/progress records; revert only the broken change without clearing storage. D772 issue: verify shared question script inclusion and lesson/section filters in game-realm.js; preserve answer history. V3 avatar issue: fall back to the fitted avatar and repair layers/registry/animation before approving. Stale build: check GitHub Pages run, current-site/source-manifest.json, service worker cache and browser reload without clearing local data.

## Follow-up repairs (2026-10-13)
- Game Realm: Section 1 selection now recognizes explicit Section 1 tags as well as legacy topic labels; the completed D772 review says Sections 1–3, and exhausted review queues finish safely rather than repeating a random question.
- Sanctuary: unanswered iframe status requests expose a safe Check again button instead of falsely marking Guardians missing or forcing an iframe reload.
- Avatar V3 artwork remains ON HOLD by user decision. Do not create, approve, or activate new avatar art until revised design direction is approved.
- Files updated in GitHub; browser visual and runtime tests remain pending. Preserve all learner saves.
