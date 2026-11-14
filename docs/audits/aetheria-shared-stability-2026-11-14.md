# Shared learning and navigation stability

Stacked after PR #273. Extracted two narrowly applicable fixes from PR #260 after reproducing failures against current code.

- Question repair: always include the uncertainty caveat, including when authored option coaching exists. A chosen distractor alone does not establish how a learner reasoned. Keep the eight-part framework and detailed rationale.
- Probability workshop: render the new form synchronously with stage selection; use one capture handler for pointer/keyboard stage navigation and Back. Remove replaced element handlers. Retain evidence/reward requirements and the current persistent drafts.
- Browser fixtures: wait for the actual restored probability submit button before replay testing; D756 acceptance uses the current visible Study Realm Council entry instead of the removed floating Hands-on launcher.

Verification: all 23 Node suites pass; strengthened authored-coaching regression passes. Full shared-repair browser journey passes (Study Now, Learn Lab, Game Realm, second-miss/reload/transfer, keyboard and mobile). Full probability browser journey passes (repair, fresh independent evidence, transfer, structured teaching, no replay awards, course isolation, state/Guardian/furniture preservation, phone layout, revocation after later miss). Raw before/after failures and outputs are retained in evidence/aetheria-2026-11-14. No scoring thresholds, reward rates or existing saved fields changed.

D756 full meeting and broader feature certification are separate; do not infer full-app readiness from these journeys. Production unchanged; rollback by reverting this focused change while preserving storage.
