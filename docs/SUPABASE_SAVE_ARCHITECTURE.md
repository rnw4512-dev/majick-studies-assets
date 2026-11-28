# Aetheria — Supabase-first save architecture

User-approved architecture revision, 2026-11-28. This supersedes the local-only storage rule in the original rebuild plan; all other freeze, design, learning integrity, single-editor and free-only requirements remain. ChatGPT implements; Claude independently reviews/tests.

## Verified existing project (read-only audit)
Project qxknfupnmtghyxwzydap, connected account "study app", organization plan free, ACTIVE_HEALTHY. Never use the separate Brooklyn Scholars project. SQL metadata inspection confirmed 0 auth.users rows and 0 public.aetheria_saves rows at audit time. No cloud copy of learner progress is available from this table. No user identities or saved payloads read.

Existing public.aetheria_saves: user_id uuid PK/FK auth.users(id), payload jsonb not null (object with object state), revision bigint default 1 check >0, updated_at timestamptz default now(). RLS enabled. SELECT/INSERT/UPDATE grants to authenticated only among inspected client roles; policies aetheria_read_own, aetheria_insert_own, aetheria_update_own enforce auth.uid()=user_id; UPDATE has both USING and WITH CHECK. No public functions identified. Security advisor returned no lints; this does not substitute for behavior tests.

Existing buckets: aetheria-artwork, aetheria-guardians, aetheria-ui public; aetheria-study-media, aetheria-backups private. No storage.objects policies found. Private client access not yet configured or tested. Public buckets must never hold private learner files. Do not upload or change bucket visibility during this audit.

## Target architecture
- Supabase Auth for persistent learner account. Use existing project and public publishable key only in client; never service role, secret keys, refresh tokens or legacy auth data in exports/GitHub/test logs.
- Supabase database primary confirmed persistent record in a separate additive public.aetheria_workspaces table, never public.aetheria_saves. Owner-only RLS and revision compare-and-swap. Legacy table read-only with explicit consent during migration.
- New app IndexedDB namespaced by account, offline write-ahead/outbox and last confirmed checkpoint; namespaced localStorage fallback only if safe and validated. Do not share learner data across accounts. Clear only transient UI/auth state on signout, protect unsynced progress.
- Single save owner, serialized/coalesced writes, revision compare-and-swap and explicit conflict resolution; never blind upsert, highest-XP merge, last-write-wins, silent rollback or duplicate rewards. Stable receipt IDs; guided and independent evidence distinct.
- Preserve course progress, assessments, rewards, Guardian identity/stages, eggs/fragments, inventory/crafting, layout/care, journal, settings and materials. Public approved assets remain in GitHub; private media/backups may use existing private buckets after ownership policies and capacity checks. Separate media from JSON save payload; explicit consent for personal artwork/music transfer.
- Local export/import backup independent of cloud availability. Free plan only; verify current limits before upload, keep data compact, avoid unnecessary network polling, no paid upgrade, no paid API or billing change. Cloud downtime must not lose local learning.
- Browser diagnostic is optional/deferred for development; use reviewed static inventory and synthetic fixtures. Before actual migration, offer normal in-app preview/transfer flow, discover same-origin historical records read-only with consent; preserve original values, unknown data (excluding credentials), and media; no console task required by default. Since cloud save table is empty, browser-local progress still needs transfer at some point. Never silently overwrite or reset old data.
- current-site/ frozen byte-for-byte, no weakening deployment gates; existing site stays live until explicit switchover. No isolated Pages artifact that removes existing site.

## Revised ordered implementation and gates
1. Foundation certified; legacy static inventory and checker certified (run 46158067621). Step 2b runtime check deferred, not claimed complete.
2. Step 3a (next): design and test versioned workspace schema and local adapter using synthetic fixtures, define legacy/cloud compatibility and revision conflict rules. Review legacy save-safety.js cloud contract and current Supabase documentation. No live data writes or schema changes until isolated migration plan and policy tests are reviewed.
3. Step 3b: implement local Export/Import backup and gentle export reminder before enabling cloud sync; then implement Supabase Auth/session and remote adapter with exact pinned SDK dependency and genuine lockfile; test with mocks then isolated authorized test account. Verify no cross-user reads/writes, denied anon access, stale revision rejection, offline retry idempotency, logout isolation. Any new tables additive and RLS protected; use existing resources where compatible. Test storage ownership before enabling uploads.
4. Step 4: in-app legacy migration preview/validation/idempotence, cloud reconciliation and offline round-trip. User approval before importing real saves. Unknown historical keys tracked and resolved, no credential migration. 
5. Continue original feature phases D772, rewards/Guardians, Sanctuary, Game Realm, other courses and safe preview/switchover. All existing educational and magical design requirements remain.

This audit made no database, auth, storage, or legacy-site mutations. No new dependencies or deployment. No paid resources authorized. Claude should review the architecture and compatibility plan, not implement in parallel.

## Required safeguards from Claude review, 2026-11-28
- Verified current-site/save-safety.js:263-294 already uses this project with a public sb_publishable key, password sign-in through /auth/v1/token, direct REST aetheria_saves reads and revision-filtered PATCH/initial POST, and refresh-token session in localStorage aetheria-cloud-session-v1. Do not reuse or export that token.
- New app MUST NOT write public.aetheria_saves. Future additive public.aetheria_workspaces uses owner-only RLS, atomic compare-and-swap revision, no anonymous access. Legacy app owns its old table; consented migration may read it only.
- Free projects may pause after about a week of low database activity and require dashboard resume (warning email may precede pause). Treat unreachable or paused cloud as offline. Continue saving and learning locally, queue pending changes, display "Cloud save is paused. Your progress is safe on this device." only when local persistence confirmed. No keepalive pings or scheduled anti-pause jobs unless explicitly requested.
- Free plan lacks managed automatic backups; local Export/Import is the primary safety net and MUST ship before cloud sync is enabled. Gentle regular export reminder, no interruption during study.
- Two free projects already in use. Never create a third project. No plan upgrades.
- Step 3a is only a schema and local adapter prototype with synthetic data. No production DB writes, migrations, authentication setup, real learner import or deployment.
