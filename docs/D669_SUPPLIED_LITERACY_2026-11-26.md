# Supplied D669 literacy material — 2026-11-26

## Change summary

Repository: rnw4512-dev/majick-studies-assets. Branch: content/d669-supplied-literacy-20261126. The commit containing this report identifies the precise revision; publication must be checked separately.

Added the supplied Lesson 3.2 representation material, Lesson 3 summary/review, literacy and communication competency self-check, and Section 4 / Lesson 1 introductions. Seven supplied ungraded questions bring the canonical bank to 123, retaining the ten professional scenarios already added on main. The digital communication written response is an ungraded reflection with a supplied model explanation; it is not automatically scored or saved as a new response type.

The existing course-learning-path anchor charts reuse approved image assets for representation, communication, and text genres. Optional source links open normally in a new tab; no video embed, autoplay, or copyrighted figure download was added. The CCBC 2023 counts and percentages remain distinct for books by and about each listed group, with the supplied April 1, 2024 update date. External video and transcript contents were not independently verified.

Runtime changes: current-site/course-packs/d669-course.js, current-site/course-learning-path.js, and their explicit reviewed source-manifest hashes. Evidence is in docs/audits/evidence/d669-{healthy-learning,representation,section4-intro}-20261126.json. Related Node tests are under pages-release/current/test-d669-*.cjs; browser checks are tests/d669-content-browser.py and tests/room-navigation-browser.py.

To use: choose D669, open the existing course learning path, and select the supplied Lesson 3.2, summary/review, competency self-check, or Section 4 introduction topics. Read the illustrated anchor chart and notes, then use the supplied guided questions. No section-location recall questions were added.

## Verification and status

The full release validation passed, producing build d9638846a0a1a1c3 in the local certified artifact. Browser tests passed at 390, 820, and 1366 pixels: all 15 room routes, all six game completion/continuity flows, supplied content, image decoding, reference links, reward isolation, and selected-topic persistence after repeated full rendering. New chart screenshots were captured at all three widths; the desktop genres chart was visually inspected for legible text and clear image layout. This report initially records a local certified candidate, not a deployment claim; the pull request records subsequent CI and publication evidence.

Historical question identity checks retain IDs, topic/section association, prompts, choices, answers, difficulty and mapping. They now permit the two explanation-only corrections already reviewed in main commit c9429e33cc9d5ae7054d242f620e2156279f0747. The full runtime manifest continues to protect every byte. Navigation tests protect all earned and academic state while separately checking expected resume-bookmark and monotonic visit-time updates. They do not freeze legitimate navigation bookkeeping.

## Break/fix guide

If a new topic is missing, first verify the public deployment/release build identifiers and selected D669 course; compare against the published PR rather than assuming a successful local build is live. If a source link fails, retain the supplied notes and repair that reference URL; do not substitute unverified content. If rendering fails, inspect the browser error and source manifest and revert the specific source commit through a normal reviewed pull request, regenerating only explicitly reviewed changed hashes. Do not clear browser storage or reset a course to repair presentation.

Existing saves, rewards, inventory, identities, Guardian controllers, course separation and score authority remain intact. No save schema or reward logic changes were made. Export the existing backup before any separate data recovery operation. Previously unrecorded answers cannot be reconstructed by adding source content.

## Remaining work

Only supplied Section 4 introductions and two questions are covered; the rest of the lesson and Section 5 are not invented or marked complete. The written self-check remains a reflection. Next owner: implementation agent, complete normal PR checks and publisher, then verify exact public build/source identity and browser behavior. Acceptance requires public content and asset checks to pass without changing earned state.
