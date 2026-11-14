# Reward Journal and integrity reconciliation

PR #231 proposed a separate effort-event journal that also writes wallet balances and fragments. That parallel award system is not imported. Its useful journal responsibility now reads the existing reward-core ledger inside Magic Vault, with escaped labels, recorded dates, a bounded recent list and no writes on view.

Focused defects reproduced and repaired in the existing authority:

- Contradictory flags (`assisted:true` plus independent/delayed/transfer flags) still added 19 mastery XP in the regression fixture. Assistance and ineligibility now override all such bonus flags, and independent/mastery reward types reject assisted input.
- Legacy game awards used fresh timestamps as event keys and read window.session rather than the real lexical game session. Keys now identify the session, question and round; replaying the same attempt cannot create a new ledger reward. The Game Realm already records this practice as assisted, so its reward adapter now agrees rather than granting independent mastery bonuses. Existing base participation rewards and historical receipts remain intact.

Tests exercise the actual award function, adapter and journal renderer: contradictory flags, zero guided mastery/fragments, replay, stable keys with an advancing clock, distinct rounds, escaping and read-only rendering. Three real-browser journal checks pass at 390/820/1366, including unchanged ledger/balances after viewing and replay. All 24 canonical Node scripts pass. Raw evidence is committed under evidence/aetheria-2026-11-14.

PR #231 disposition: journal superseded by this existing-owner implementation; its separate effort currency/economy remains deliberately unintegrated. No second ledger, retroactive deductions, renamed save keys or erased learner history.
