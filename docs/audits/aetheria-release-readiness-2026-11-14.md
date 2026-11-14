# Aetheria combined release candidate

User authorized publishing passing work on 2026-11-14. This promotion branch assembles the separately reviewable implementation PRs #272–#279; it does not merge historical feature branches wholesale. Base main remains 3d5fa2889a91170a332eb9d70f9156934c032156. No old branch is deleted and no unresolved historical PR is closed.

## Feature and room matrix

| Area | Candidate behavior and evidence |
| --- | --- |
| Save safety | Future-schema primary bytes protected; corruption recovery; separate Council backup/import; partial-key rollback; later-earned rewards protected. VM suite and actual download/file-import at 390/820/1366. |
| Council Chamber | Existing engine; eight scenarios, three modes, complete spoken models, 20-minute rehearsal, 5 input/3 clarification requirements, transcript/replay, current IEP reference/coaching/speech/Pixi preserved. Full journey verified in Actions; updated UX/new scenario/drill tests pass locally. |
| Council rendering | One application across dialogue updates; speaker updates in place; explicit cleanup on Close. Measured 2 → 1 application for startup plus one response. |
| Guardian/Sanctuary | One ticker, canonical IDs, all saved stages, care, furniture, approved walking pairs, texture-safe controller disposal, Phaser fallback. Full browser suite passes. Four-frame sets remain unavailable; approved fallback is intentional. |
| Atelier/Scholar | Existing appearance owner and saved-outfit integration retained. Existing integration, Sanctuary and full interaction/release suites verify preservation. No artwork is manufactured. |
| Observatory | Existing answer arrays/bridge/history; explicit guided/unknown/independent distinctions; canonical mastery owner; no invented dates/freshness; legacy analytics route uses this owner. Ten unit checks and three-width browser checks. |
| Rewards/Vault/Alchemy | Journal reads existing ledger; assisted bonus rejection; stable repeated-attempt keys; original unassisted gameplay/potion behavior retained. Reward tests, three-width journal checks and full Alchemy acceptance. |
| Home/Commons, Study Now, Learn Lab, Grimoire, Game Realm, tools and other routes | Existing source/navigation maintained; full Commons, interactions, shared repair, probability and immersion release suites are required on the exact candidate. |

## Release gate

The former routine publisher copied current-site after existence checks and emitted no release metadata. The candidate publisher waits for the complete `Aetheria release certification` workflow on the exact main commit, then builds canonical sources with source-manifest validation and release cache stamps. Both `/release.json` and `/current-site/release.json` identify the deployed build. Manual publishing requires the same successful push certification. No failing tests are bypassed.

The release workflow runs all canonical Node suites, instructor classification, Guardian and Observatory tests, full build/syntax/manifest checks, complete browser journeys, required three-width matrices, actual backup/file-import, keyboard/reduced-motion checks and scene lifecycle tests. CI and deployment URLs/head SHAs are recorded in the release PR and Actions artifacts.

## Verified baseline and rollback

Five live source samples (entry point, save safety, app runtime, Council engine and Pixi Sanctuary) match fetched main exactly; both live release.json routes returned 404 before this release. The previous successful publisher run was 43354129901, head b9a8ea8a7a4ba3df056cd808844ac20ad66cf73f. Keep base main 3d5fa2889a91170a332eb9d70f9156934c032156 as the pre-consolidation reference.

Rollback restores reviewed code/artifacts, never learner storage. Prefer focused reverts of the responsible implementation and its matching tests/manifest, then rerun the release gate. The raw old main has three known stale manifest digests and baseline regression defects, so it must not be described as a newly certified release merely because its Git ref exists. Keep all save namespaces, reward ledgers and Council histories during rollback.

## Limits

Universal four-frame walking is blocked by absent approved sets; the tested existing pairs/fallback remain active. Observatory does not fabricate missing historical timestamps, ambiguous assistance, or fresh transfer. Local cloud startup measurements are indicative, not a speed guarantee. Final publication is contingent on a green exact-commit release gate and verified live build; this document does not claim an unobserved deployment.

## Exact-build fixture correction

The first complete release run passed 12 of 13 certification jobs; probability failed in its test helper's initial unguarded `querySelector(...).scrollIntoView()` before the helper's existing guarded readiness loop. Removed that redundant early dereference. Physical hit-testing, pointer/remount checks and every learning/reward assertion remain unchanged. The failure is retained in evidence, and the exact-head full workflow is rerun before publication.
