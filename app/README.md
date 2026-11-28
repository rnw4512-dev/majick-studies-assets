# Aetheria foundation preview

Read ../REBUILD_LOG.md before changes. This shell is not the replacement production app and does not access learner storage.

Node 22.12 or later is required. From the repository root:

    cd app
    npm install
    npm run check
    npm test
    npm run build
    npx playwright install chromium
    npm run test:browser
    npm run dev

Open the URL printed by Vite. Navigate between rooms, test the mobile menu, keyboard focus and reduced motion. Unfinished rooms are explicitly marked. Stop the dev server with Ctrl+C.

The dependency versions are pinned. A generated package-lock.json must be committed after a successful real npm resolution; then use npm ci for repeatable installs. Do not manually fabricate a lockfile.

No deployment, learner save migration, game engine, or artwork copying is included in this foundation checkpoint.
