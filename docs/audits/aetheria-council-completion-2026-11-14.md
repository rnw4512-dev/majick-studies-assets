# Council Chamber reconciliation

Source PR #270 (d6da37ba075bc9660ffb7f8e85e2708cc1987791), reconciled on the current runtime after shared-learning PR #274.

Retains the existing D756 engine, three profiles, 20-minute rehearsal, five input/three contextual clarification requirements, transcript/replay and reward owner. Adds eight named scenario launchers, distinct scenario dialogue, full professional spoken-response choices and a twelve-turn complete teacher model. Models are guided-only; choosing one marks the turn assisted. Independent talking points remain editable reminders rather than supplied responses. Five supplemental 15-minute guided drills use the same IEP checklist and cannot earn independent rehearsal rewards.

Seven merge conflicts were reconciled individually. Preserved newer current-main IEP reference details, content-responsive stakeholder replies, immediate eight-part feedback/revision, stakeholder speech controls, illustrated Pixi stage, pacing and speaker accessibility announcements. The old branch's simpler replies, old case sidebar and old active-dialog markup did not replace them.

Adapted tests for current navigation, actual rendered goal cards, pagehide-save behavior in isolated fixtures, and asynchronous setup rendering. A drill setup now visibly states its 15-minute limit before starting.

Verification so far: syntax and four instructor-classification tests pass; complete guided script and independent-mode isolation PASS at 390/820/1366; all eight scenarios/full spoken responses PASS at all three widths. Longer full-meeting, responsive-writing and fifteen-minute drill suites are pending at the first draft revision. Final evidence will be appended; this draft is not release certification.

No learner saves, scoring thresholds, approved artwork or reward rates are replaced. No merge or deployment. Rollback: revert this feature change while retaining rehearsal/history and the main save.
