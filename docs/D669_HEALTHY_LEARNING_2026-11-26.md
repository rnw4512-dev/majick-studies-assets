# Supplied D669 material and study-chart icons — November 26, 2026

## Change and location

The learner's inline Lesson 2 review and Lesson 3 introduction/SEL excerpt, plus the uploaded 7,432-byte continuation, are integrated through the existing authoritative D669 course pack. The supplied material is a transcription, not independently verified original course coverage. LMS controls, drag/drop announcements and unrelated screen-reader fragments are excluded from the study summaries.

- Existing Lesson 2 review gains the three supplied review questions without removing its earlier questions.
- The Lesson 3 placeholder now contains its supplied introduction and Lesson 3.1 excerpt: five SEL competencies, oral-language foundations, instruction/social-interaction pathways, the communication-house diagram description and the provided Chapter 5/pages 69–72 reading reference.
- Nine source-aligned ungraded questions are added, including five matching definitions adapted to the existing single-answer format. All 97 earlier question objects and IDs remain byte-equivalent after JSON serialization, preserving their saved-answer meaning.
- The choose-three healthy-learning question retains all three correct responses in an explicitly ungraded guided-reference activity. It does not introduce a new multi-select scoring engine.
- The existing shared study anchor-chart renderer now uses approved book, crystal, milestone, runestone and skill-icon assets in place of emoji glyphs. The SEL topic has five distinct illustrated competency cards. The same existing chart component renders these cards; no duplicate component, room or renderer is added. Images have fixed dimensions, lazy loading, empty alternative text and an assistive-technology-hidden decorative parent. Visible labels carry meaning.

Existing asset attribution/license records remain intact. The supplied WGU figure references and copyright metadata are retained; proprietary diagram images are not copied into the asset packs. Later Lesson 3 content and the Section 3 summary remain explicitly unsupplied.

Files: `current-site/course-packs/d669-course.js`, `current-site/course-learning-path.js`, explicit reviewed hashes in `current-site/source-manifest.json`, the existing D669 browser test and a source-integrity regression. Intake hashes and prior question IDs are in `docs/audits/evidence/d669-healthy-learning-20261126.json`. The shared gate automatically discovers `pages-release/current/test-d669-healthy-learning.cjs`.

The branch is `content/d669-healthy-learning-20261126`, synchronized through main `a1cfdba`. It preserves the current sidebar/rune artwork from PR #296, the D669 Section 3/six-game work and the latest collapsed workshop notes/instructions/return control. Main's Classroom Quest completion test correction is retained rather than duplicated.

## Verification and status

The shared release gate passed all 1,068 locked/actual files with zero integrity errors, its existing learning/save checks and the new content invariants. Canonical runtime candidate: `1fea2045696ca487`. The content regression verifies all 97 previous question records, nine unique new ungraded records, the five SEL links, three healthy-learning responses and incomplete-source boundaries.

Existing browser coverage is expanded to open the actual new topics, decode their artwork, answer the new questions through the existing formative controls, check no overflow, and preserve academic records/XP/crystals. Final checks at 390/820/1366 are required before claiming release. Existing source documents and seven registered practice packs remain available.

The desktop probability regression previously missed a stage after a physical click immediately following scroll realization. Its click helper now waits two animation frames after scrolling, retaining real pointer events, the intervening repeated-mount challenge and all dataset, replay, progress and mastery assertions. The full flow passed locally with that stabilization; no probability learning/scoring code changes.

Publishing must use the established gated Pages workflow. A commit or build alone is not evidence that this content or artwork is live. Verify the final source SHA/build and production topic navigation after publication.

## Use and recovery

In D669's Athenaeum/Learn Lab, open the connected learning path and choose Section 3 → Lesson 2: Summary, Lesson 3: Introduction, or Lesson 3.1. Open detailed notes and the existing topic-practice disclosures; SEL matching definitions and correct healthy-learning factors are also retained as ungraded study references.

No save schema, reward amount, Guardian controller or independent mastery authority changes. If a source/art regression occurs, revert this focused merge with mainline parent 1 and publish normally. Preserve browser saves, existing answer IDs, earned inventory/rewards and course notes; do not clear storage or prune history to repair a lesson. The preceding sidebar/rune icon integration can remain in place. Download a progress backup before moving browsers or devices.

The next acceptance owner is the publisher and independent production verification. Additional Lesson 3 material should be added only when supplied, without marking the whole lesson/course complete from this excerpt.

## Same-context lesson-picker repair

The new real-browser coverage exposed an existing mount-lifecycle gap: a complete app redraw could replace `#content` without changing the course/room signature. The learning-path observer was attached to the previous content node, so the lesson picker could remain missing on reopening the same room. The existing learning-path owner now registers its existing `schedule` callback with `MajickRenderQueue`; its old per-content observer is retained only as the standalone fallback. No second initializer, observer in the normal app, grading owner or state store is introduced.

Candidate `3d3f2e1d81a1f93c` passed the full source/learning/save release gate, all new D669 topic/artwork/formative checks and all 15 real navigation routes at 390/820/1366. The content test explicitly calls the real app renderer twice, then verifies that the selected Lesson 3.1 and all five SEL illustrations remain present. Academic evidence, XP, crystals and course notes are preserved; document/window listener counts remain stable at 70/37. This follow-up changes only the existing renderer registration, its explicit manifest hash and the regression check. Reverting the follow-up merge removes that lifecycle correction without removing the supplied source material or icons; do not clear browser saves.
