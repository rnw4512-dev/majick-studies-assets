# Learning Observatory recovery, 2026-11-11

## Task 1 — supplied PR #263 patch

Applied the supplied mail patch on the specified `a9de0d20a24d09699e76611d8e4ac35f3bd3caa4` head with `git am`. Result: `ebb7a0e5643598e08887d9048c1f6a5daeb26d3e`, pushed to `feature/learning-progress-observatory`. Only four files changed in this commit: `current-site/learning-observatory.js`, `current-site/source-manifest.json`, `current-site/tests/learning-observatory.test.cjs`, `current-site/tests/learning_observatory_browser.py`. The three supplied SHA-256 values match exactly. `index.html`, `reward-core.js`, `study-progress-bridge.js` and protected movement PNGs were unchanged by this patch.

Executed from the branch worktree:

```bash
node --check current-site/learning-observatory.js
node --check current-site/game-realm.js
node --check current-site/solution-engine.js
node --test current-site/tests/learning-observatory.test.cjs
node pages-release/current/release-checks.cjs current-site
python pages-release/current/build.py current-site _site
python -m http.server 8766 --directory _site
AETHERIA_BASE_URL=http://127.0.0.1:8766/ python -u /workspace/work/observatory-20261111/run-browser-with-system-chromium.py current-site/tests/learning_observatory_browser.py
```

Results: syntax passed; Node **8 passed / 0 failed**; release checks passed; canonical build `1050fc88845c7aa3`; browser printed PASS at **390, 820, 1366**. The browser test source was unchanged. The environment blocks downloads from `cdn.playwright.dev` with HTTP 403. An external runner selected `/usr/bin/chromium` for Playwright's `BrowserType.launch`, adding `--no-sandbox --enable-unsafe-swiftshader`. It changed no assertions or application code. CI installs its own browser normally. All contexts were fresh fictitious test profiles; no existing learner storage was opened or cleared.

## Task 2 — integrate current main before CI/release

PR #263 was conflicting after the Council, Alchemy and Sanctuary recovery merged. Integrated current `main` (`96e66cafdbaf5ba9d79a5a5be667f5c381a7446a`) into the feature branch. `index.html` and `game-realm.js` merged automatically, keeping the recovery plus the existing Observatory script hook and unscored completion summaries. The only conflict was the reviewed source manifest. Resolved it by retaining all current main hashes, adding Observatory entries, and hashing the exact merged `index.html`/`game-realm.js` bytes; no build guard was changed. The three supplied Observatory hashes still match.

Repeated the complete command set above against the integrated build: Node **8/8**, syntax/release checks passed, browser PASS **390/820/1366**, canonical build `f7b531cd14916c54`. These are local results. CI, merge, deployment and live results are tracked in PR #263; this document does not claim an unobserved deployment.

The existing Game Realm session scores and guided Solution Workshop completion summaries remain unscored context, separate from answer trends and independent mastery. This integration does not add a wallet, answer ledger or mastery award. Producer gaps remain visible in coverage until Task 3 instruments and verifies them. Old saved rows are not rewritten.
