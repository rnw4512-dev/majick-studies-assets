# Council Chamber reconciliation

Source PR #270 (d6da37ba075bc9660ffb7f8e85e2708cc1987791), reconciled on the current runtime after shared-learning PR #274.

Retains the existing D756 engine, three profiles, 20-minute rehearsal, five input/three contextual clarification requirements, transcript/replay and reward owner. Adds eight named scenario launchers, distinct scenario dialogue, full professional spoken-response choices and a twelve-turn complete teacher model. Models are guided-only; choosing one marks the turn assisted. Independent talking points remain editable reminders rather than supplied responses. Five supplemental 15-minute guided drills use the same IEP checklist and cannot earn independent rehearsal rewards.

Seven merge conflicts were reconciled individually. Preserved newer current-main IEP reference details, content-responsive stakeholder replies, immediate eight-part feedback/revision, stakeholder speech controls, illustrated Pixi stage, pacing and speaker accessibility announcements. The old branch's simpler replies, old case sidebar and old active-dialog markup did not replace them.

Adapted tests for current navigation, actual rendered goal cards, pagehide-save behavior in isolated fixtures, and asynchronous setup rendering. A drill setup now visibly states its 15-minute limit before starting.

Verification so far: syntax and four instructor-classification tests pass; complete guided script and independent-mode isolation PASS at 390/820/1366; all eight scenarios/full spoken responses PASS at all three widths. Longer full-meeting, responsive-writing and fifteen-minute drill suites are pending at the first draft revision. Final evidence will be appended; this draft is not release certification.

No learner saves, scoring thresholds, approved artwork or reward rates are replaced. No merge or deployment. Rollback: revert this feature change while retaining rehearsal/history and the main save.

## Full-journey follow-up

GitHub Actions run 43624861723 completed the full original meeting journey, including all viewport/profile/mode launches, substantive input and clarification, three complete meetings, exact shared XP +30/+8/0, history/ledger reload, next-day repeat limits, replay, repair-only zero rewards and no runtime/asset errors. The job failed subsequently on the stale `.dmGlance` UX test selector; the current sidebar is `.dmReferenceQuick` with three `.dmGoalCard` entries. Assertions are updated to that actual UI. The failure log is retained as evidence, not reported as a green job.

All new eight-scenario and complete-model tests, five short-drill presets and responsive-writing checks pass at 390/820/1366. All 23 canonical Node suites and canonical build pass. A separate lifecycle regression reproduced canvas replacement on each dialogue repaint; a focused scene-reuse performance follow-up is required before final release certification.
