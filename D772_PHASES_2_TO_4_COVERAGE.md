# D772 Phases 2–4: instructional coverage and mastery audit

Updated 2026-10-15. This is a source-grounded work queue, **not** a claim that all content has been manually or browser-certified.

## Evidence already in the branch
- `current-site/course-tutor.js` includes lesson-specific goals, visuals, thinking prompts and misconception traps for the eight Section 1–2 lessons listed below.
- `current-site/d772-preassessment-deep-practice.js` houses revised supplemental four-choice questions, preserving original supplied source records separately.
- `current-site/d772-adaptive-mastery.js` provides targeted preassessment misconception clusters and teaching prompts.
- `current-site/learning-continuity.js` shares course-scoped needs and probability repair/independent/transfer/teach-back evidence. Guided probability repair is explicitly not independent mastery.
- `pages-release/current/browser-interactions.cjs` and `browser-probability.cjs` exercise real browser paths. CI for newest changes is still required.

## Lesson-by-lesson follow-up (do not duplicate existing materials)

| Lesson | Existing topic map observed | Instructional acceptance test still needed |
|---|---|---|
| S1 L1 | Population, sample, methods | Source-example matching, valid generalization, classroom sampling demonstration |
| S1 L2 | Response, selection and nonresponse bias | Differentiate each type on independent scenarios; diagnose a student's claim |
| S1 L3 | Axes, scales and distortion | Render values against real graph; student repair of misleading display |
| S1 L4 | Evidence, generalization, association, causation | Distinguish observational/experiment conclusions; teach-back rubric |
| S2 L1 | Categorical versus quantitative variables | Classify ambiguous-looking numeric labels with explicit measurement contexts |
| S2 L2 | Choosing displays | Match number/type of variables to dot, bar, pie, histogram, box and scatter displays |
| S2 L3 | Distribution shape, center, spread, outliers | Visuals with correct skew, modality, and student error analysis |
| S2 L4 | Mean, median, quartiles and spread | Prioritize multi-step worked examples, exact plotted values, fresh independent calculations, and explanation of resistance to outliers |
| S3 L1 | Theoretical and empirical probability | Confirm complete lesson source mapping, sample-space model, fresh practice and teacher application |
| S3 L2 | Independent/dependent, disjoint/overlap | Audit union/intersection/complement, without-replacement modeling and distractors |
| S3 L3 | Probability applications | Verify multi-step scenarios and full explanation, not term recall alone |
| S3 L4 | Section 3 lesson slot | Verify the exact current source title and content before claiming coverage; do not infer from regex alone |

## Phase 3 acceptance standard
For **each** lesson: complete scenario → explanation → accurate visual based on the same numbers → worked solution → meaningful learner interaction → independent new-data practice → realistic misconception → structured teaching task with rubric. For mean, median, graph interpretation and probability, prioritize whiteboard setup and teaching language.

## Phase 4 acceptance standard
1. A wrong answer records a course- and lesson-scoped misconception, identifies the reasoning gap, and offers guided repair in Learn Lab.
2. Study Now supplies a fresh independent item; Game Realm supplies distinct practice or transfer without sharing answer credit.
3. Guided/hinted work remains assisted. No mastery credit until independently correct answers plus separate transfer and assessed teaching evidence.
4. Repeated question identity or dataset must not count as fresh evidence.
5. Progress, rewards and Guardian/Sanctuary state survive reloads and switching D772/D755/D756.
6. Revoked probability certification after a new genuine misconception must reopen repair without deleting earlier evidence.

## Release blocker
CI run 38823269557: desktop Full interaction failed waiting for `[data-meaning]`; probability Next task ID remained `connected-probability-2` after pointer test. Newly patched Next pointer handling must be checked on a subsequent review run. Tablet and mobile review jobs passed, but did not execute either desktop-only suite.

## Provenance
Original 58 supplied preassessment records are never relabeled as generated practice; the 30 revised supplements remain distinct and must retain four plausible, single-best-answer options and original-style exam terminology.