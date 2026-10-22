# Universal instructional integrity contract — Majick Studies

Status: required acceptance criteria for all course content, new or existing. This document is a specification; it does not itself implement runtime enforcement.

## Preserve existing records
- Never overwrite or relabel original WGU-provided questions, answers, feedback, IDs, rationales, lesson sources, or previously earned progress.
- Preserve the distinction between source material, supplemental generated practice, guided attempts, and independent assessment.
- Ingest new concepts into the existing course-specific academic owner and make them available to Learn Lab, Study Now, Reasoning Workshop, and Game Realm without cross-course leakage or duplicate renderers.

## Every instructional skill must have
1. A real scenario, objective, WGU terminology, and explanation of *why* the method fits.
2. A verified worked example with intermediate calculations or evidence.
3. An accessible visual or manipulable model appropriate to the skill (counters, number line, histogram, probability tree, chart, or equivalent).
4. A learner-operated guided reconstruction: identify givens and unknowns; choose a rule; place values; calculate or construct; interpret and check.
5. A fresh, unassisted question testing the same skill with different evidence, not merely a reordered answer selection.
6. Classroom transfer: explain how to diagnose and teach a learner's misconception.
7. Feedback specific to each error, and a skill-level history of attempts across sessions, with durable save/reload and course isolation.

## Repeated errors
- After two independently recorded incorrect attempts for a skill, require a guided reconstruction the next time that skill is practiced.
- The learner must actually complete each reconstruction stage; simply opening an explanation or clicking through cannot count.
- Follow guided reconstruction with a *new*, verified independent item. Do not repeat the failed item as the independent mastery check.
- Assisted work, hints, explanations, Guardian protection, and guided reconstruction are recorded separately and never count toward independent mastery.
- Technical/render failures must not count as wrong answers.
- If no verified fresh item is available, preserve progress and show a clear message; never award mastery or silently recycle an item.

## Content and release gates
- Validate numerical answer keys, formulas, visual datasets, distractors, and explanation against the same scenario.
- Verify navigation and real interactions at 390px, 820px, and 1366px; test rapid clicks, typing, retry, back, reload, course switching, and saved progress.
- Regression-test existing WGU content and Guardian/Sanctuary continuity. Update source-manifest SHA256 for every modified file in current-site/.
- Report code changes, root cause, tests, known gaps, and deployment status. Do not merge/deploy with failed or incomplete certification.
