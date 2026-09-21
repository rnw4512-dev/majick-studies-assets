## V3.3.38 — Learn Mode Instruction Cycle
- Rebuilt D772 Learn Mode around an actual instruction cycle:
  **Teach → Visual → Worked Example → Your Turn → Feedback → New Scenario → Explain Why → Mastery Check**.
- Learn Mode opens each lesson with **What am I learning?**, a WGU-aligned lesson goal, mental model, and 3–5 explicit skills.
- D772 Section 1 is broken into **16 concept modules** across Lessons 1–4 so learners work one idea at a time rather than scrolling a notes dump.
- Added meaningful instructional diagrams for sampling, study design, bias, misleading graphs, significance, research integrity, causation, confounders, and scatterplots.
- Added a persistent **Majick Tutor** beside the lesson with:
  - Explain This Differently
  - Show Me Another Example
  - What Would WGU Ask?
  - Compare These Two
  - I Still Don’t Get It
- “I Still Don’t Get It” rotates teaching approaches instead of repeating the same paragraph.
- Added tiny concept checks and transfer scenarios inside teaching.
- Added **Explain Why** responses by typed explanation, reasoning choice, or explain-aloud acknowledgement, followed by a model explanation.
- Added themed **Arcane Anchor Charts** / Stop & Remember cards that unlock during learning and automatically appear in the Living Grimoire Anchor Wall.
- Repeated confusion on high-priority trap pairs inserts an adaptive comparison/repair lesson before continuing.
- Every lesson ends with a **6-question WGU-style Can I Do This? checkpoint** and returns:
  - Ready to move on
  - One distinction to repair
  - Needs another teaching pass
- Learn Mode academic completion state is separate from Majick XP/crystals; the regression explicitly verifies that completing teaching does not alter lifetime XP.
- Course Path, Course Tutor, Study Now, and the existing WGU Practice Lab remain available; Learn Mode becomes the default D772 Learning Lab experience.
- Guardian/Sanctuary protected motion assets remain untouched.

## V3.3.37 — Self-Paced Course Clock
- Removed fixed-Sunday academic framing from the WGU experience.
- Replaced **Sunday Readiness & Thinking Analytics** with **Course Readiness & Thinking Analytics**.
- Replaced **Before Sunday** with **Before Your OA**.
- Course pacing now defaults to a flexible **4–6 week window**:
  - Week 4 = earliest preferred finish zone when mastery supports testing;
  - Week 5 = normal target pace;
  - Week 6 = efficiency guardrail, not a deadline.
- The dashboard now shows a **Self-Paced Course Clock** based on the course start record.
- If a learner is ready sooner, Majick explicitly encourages acceleration rather than waiting for the calendar.
- If a course moves beyond the preferred 6-week window, Majick focuses the learner on remaining weak concepts without labeling the course late.
- Weekly Guardian gameplay is labeled as a **7-Day Bonus** so it does not imply an academic due date.
- Course pace defaults are stored per course so future pacing controls can be personalized without rewriting the course model.
- Pages regression fails if the old Sunday wording returns or the self-paced clock is missing.

## V3.3.36 — Render Loop Fix
- Fixed the Chrome **Page Unresponsive** failure reproduced on D772 Study Now.
- Root cause: the universal Back button was managed from a page-wide `MutationObserver`; `ensureBackButton()` rewrote the existing button's `innerHTML` on every observer callback, which triggered the observer again and created an infinite DOM-mutation loop.
- `ensureBackButton()` is now idempotent:
  - existing Back button is returned without DOM mutation;
  - new markup is written only when the button is first created;
  - Home still removes the button normally.
- The deployment gate now fails if the recursion guard is missing or if the old `existing || createElement` mutation pattern returns.
- V3.3.35 D772 self-populating WGU question-bank protection remains in force.
- WGU Practice runtime and cache-busting advanced to V3.3.36.

# Majick Studies — CURRENT BUILD SOURCE OF TRUTH

Last updated: 2026-09-20
Current target release: V3.3.33 — WGU Practice Lab

## How to resume in a new ChatGPT chat
Say: **"Continue Majick Studies from CURRENT_BUILD.md in rnw4512-dev/majick-studies-assets."**
Do not re-explain the project unless something changed.

## User workflow — KEEP THIS SIMPLE
- Do **not** edit files inside `pages-release/` manually.
- Do **not** edit `sanctuary/assets/motion/`.
- The original 33 Phase 4 motion PNGs are protected and remain the authoritative live movement system.
- When code changes are needed, ChatGPT updates GitHub directly.
- When new art is needed, use one clearly named asset bundle only when instructed.
- `pages-release/majick-pages-site.zip` is the base build archive. Leave it alone.
- Old patch ZIPs in `pages-release/` are implementation history; the user does not need to open or upload them.

## Current Guardian canon
- luna (internal) = Velora
- ember (internal) = Cascade
- nova (internal) = Solstice
- mallow (internal) = Aurelia

Evolution levels:
- New Bond: 1–2
- Apprentice: 3–4
- Guardian: 5–7
- Ascendant: 8–11
- Celestial: 12+

## HARD RULE — movement
Never rewrite or replace the original movement methods/files for Velora, Cascade, Solstice, or Aurelia.
The attempted V3.3.15 stage-action overlay was disabled because the generated action assets contained excessive transparent padding and neighboring image fragments.
Until true individual transparent motion assets are approved, Phaser must show the protected original moving sprites.

## UI Guardian art
Profile/sidebar/evolution UI uses the approved stage portraits under:
`assets/familiars/evolution_stages/`
These should fill the portrait frames and must not use the flawed V3.3.15 walk/play/sleep sheets.

## Sanctuary object system
Manifest:
`sanctuary/assets/objects/objects-manifest.json`
Finished object filenames:
- magic-mirror.webp
- moonlit-study-desk.webp
- celestial-telescope.webp
- enchanted-bookstack.webp
- moonstone-canopy-bed.webp

Moonlit Study Desk route: `addmaterial`

## Study Material / Notes Forge
Files:
- `pages-release/v3315/study-material/AddStudyMaterialPage.js`
- `pages-release/v3315/study-material/materialParser.js`
- `pages-release/v3315/study-material/materialStoreModel.js`
- `pages-release/v3315/study-material/questionBuilder.js`

Accepted sources:
PDF, DOCX, TXT, MD, pasted notes.

Outputs:
practice questions, explanations, vocabulary, misconception repair, review.

## Course isolation rule
Each WGU course owns its own:
- uploaded notes/sources
- generated questions
- answers
- mistakes
- mastery/readiness
- repair/review queues
- Living Grimoire course state
- streak

A new course starts its own streak at 0.
Account-level Majick XP, Guardian growth, crystals/chests, and completed-course history persist across courses.
Passing a course records completion and awards completion XP once.

Course manager:
`pages-release/v3316/courseManager.js`

## Current repair in progress
1. Restore original Phase 4 moving Guardians.
2. Enlarge approved stage portraits in UI cards.
3. Do NOT use V3.3.15 generated action sheets for movement.
4. Rebuild true individual stage/action art later from approved Guardian references — one Guardian/action asset at a time, not sprite-sheet slicing shortcuts.


## V3.3.33 — WGU Practice Lab
- D772 practice now uses a WGU-style **select answer → Submit** interaction instead of treating a choice click as the final answer.
- Added seven instructional visual-question surfaces grounded in Section 1 material:
  - truncated-axis bar graph
  - two-dimensional icon scaling
  - nonlinear scatterplot
  - positive-correlation scatterplot
  - negative-correlation scatterplot
  - strong positive relationship
  - outlier
- Every D772 answer choice now has **why-this-would-fit** coaching. After practice questions, the learner can expand **Why each answer is right or wrong** rather than seeing only the correct-answer rationale.
- D772 Study Now modes all draw from the same curated WGU-language Section 1 scenario bank.
- Added a **30-question Section 1 OA Simulation**:
  - mixed across Lessons 1–4
  - 30 unique questions
  - no lesson labels
  - no clues/hints during the simulation
  - no crystal-confidence UI during the simulation
  - WGU-style Submit interaction
- OA results now show:
  - overall practice score
  - Section 1 practice readiness by lesson
  - concepts to review
  - missed-question review with answer-choice coaching
- Practice readiness is explicitly described as practice evidence, not a prediction of the learner's OA score.
- Browser regression now blocks deployment if visual questions, choice coaching, the 30-question mix, no-hint OA surface, or readiness breakdown disappear.

## V3.3.32 — WGU Terminology Lock
- D772 now preserves the terminology used in the learner-provided WGU Section 1 course notes instead of substituting Majick synonyms.
- Official terminology is primary in prompts, answer choices, Tutor vocabulary, and rationales.
- Memory cues remain secondary aids and must never replace the WGU term.
- Every curated D772 question now carries a `wguTerm` field and explains:
  - **WGU terminology**
  - **What WGU is testing**
  - **WGU clue to notice**
- Locked examples include:
  - Random sampling vs. **randomization**
  - Representative sample / non-representative sample
  - Sampling frame / sampling frame error
  - Non-response bias / response bias / voluntary response bias
  - Perceived lack of anonymity
  - Statistical significance
  - Misrepresenting data / falsifying data
  - Association / causal relationship / confounding variable
  - Linear / nonlinear / no pattern-no correlation
  - Positive correlation / negative correlation / strength / outlier
- Non-course labels such as “convenience bias,” “cluster bias,” and “randomized controlled trial” are blocked from the D772 curated bank.
- Browser regression fails if WGU terminology metadata is missing or blocked substitute language returns.

## V3.3.31 — WGU Concept Practice
- Retired the old D772 Notes Forge question style that asked meta-memory prompts such as:
  - “according to your notes”
  - “concept-and-evidence pairing”
  - “strongest evidence for the concept”
  - generic sentence-completion prompts
- D772 Study Now now uses one authoritative **Section 1 WGU concept/scenario bank** built from the learner-provided course material.
- Current curated D772 bank: 48 quality-first questions across Lessons 1–4.
- Questions focus on decisions WGU expects the learner to make: identify the concept, diagnose the flaw/bias, interpret the study design or graph, and choose the conclusion justified by the evidence.
- Every D772 rationale explicitly includes:
  - **What WGU is testing**
  - **Clue to notice**
- Every curated question carries lesson, concept, rigor, OA-style, and learning-path metadata.
- Generic Notes Forge questions are no longer mixed into D772.
- A synchronous pre-render bank refresh removes old D772 questions before Study Now can render them.
- If an in-progress D772 session still contains a retired note-matching prompt, the stale session is cleared and the learner is returned to the refreshed learning flow.
- Browser regression fails if any retired meta-question prompt reappears or if D772 contains non-curated active questions.
- Screenshot evidence from the learner showed the live app was still on V3.3.27 when this issue was reported; V3.3.31 is the corrected target.

## V3.3.30 — XP High-Water Repair
- Fixed regression where overall Majick XP could collapse to a small current-course value (for example, 7) even when the learner had thousands of lifetime XP.
- Root cause: shared-account initialization trusted an existing low `majickAccount.xp` before comparing it with higher persisted course/history values.
- Lifetime XP now uses a monotonic **high-water** model:
  - recover the highest legitimate value from account XP, persisted course XP, prior recovery records, and stored XP high-water fields;
  - course switching/saving cannot lower lifetime XP;
  - future XP writes can increase lifetime XP but cannot reduce it.
- Moon Crystals and chests remain spendable; monotonic protection applies only to lifetime XP.
- Successful XP recovery is immediately persisted and surfaces a **Majick XP Restored** notice.
- State schema advanced to version 5.
- Added a regression simulation for the exact failure: account XP = 7, persisted XP = 4,987; expected result = 4,987 and a later stale write cannot lower it.
- Fixed the Pages workflow's stale V3.3.27 version gate so current overlays can deploy.

## V3.3.29 — Tutor Navigation + In-Page Help
- Added a universal **Back** button on every non-Home main-app screen.
- Back uses a session navigation stack instead of blindly returning Home.
- Inside Course Tutor, Back returns **Tutor → Course Path** before leaving Learning Lab.
- **Alt + Left Arrow** triggers the same Back behavior for keyboard users.
- Home's **Enter Course Tutor** route now participates in navigation history.
- Added four contextual Majick Tutor actions on lesson pages:
  - **Explain Simpler**
  - **Give Me an Example**
  - **Quiz Me on This Page**
  - **Related Mistakes**
- D772 Lessons 1–4 and the Section 1 Summary/Test have lesson-specific simple explanations, examples, and built-in quick checks.
- Related Mistakes uses actual recent incorrect lesson answers when available; otherwise it shows the lesson's high-priority OA traps.
- Browser regression coverage now verifies the universal Back button and all four Tutor help actions.
- Protected Guardian movement and Sanctuary motion assets remain unchanged.

## V3.3.28 — D772 Section 1 Master Tutor
- D772 has **exactly one course section**: **Section 1: Assessing Research and Data Credibility**.
- There is **no Section 2** in the current D772 course structure.
- Section 1 contains:
  - Lesson 1 — Understanding Data Collection Methods
  - Lesson 2 — Recognizing Bias in Data Collection
  - Lesson 3 — Unveiling Data Misrepresentations
  - Lesson 4 — Conclusions About Data Findings
  - Section 1: Summary and Test
- The final Summary/Test is a section review, **not Lesson 5**; its internal lesson number is null.
- Authoritative Section 1 master teaching content is built directly into the Course Tutor for all four lessons plus the final review.
- Supplemental uploaded notes remain course-isolated and de-duplicated; they cannot create additional D772 sections.
- Built-in Tutor content includes the major course concepts, vocabulary, reasoning cues, memory aids, and Section 1 evidence-evaluation path from the learner-provided complete Section 1 notes.
- Regression coverage now fails if:
  - more than one D772 section appears,
  - a Section 2 appears,
  - the review is numbered Lesson 5,
  - the built-in Section 1 master content is missing.
- Guardian/Sanctuary movement remains protected and unchanged.

## DESIGN NORTH STAR — Adult Magical College Fantasy

Majick Studies should feel like the user is attending a **dark, high-fantasy adult magical college** while completing real WGU coursework.

The experience target is:
- **Adult Hogwarts / magical university**, not a children's school.
- **Dark academia + high fantasy + adult magical-girl energy**.
- Elegant, moody, romantic, celestial, slightly sexy, polished, and immersive without becoming explicit.
- The Sanctuary should feel like a **magical dorm / familiar residence**: beds, study furniture, moonlight, books, crystals, celestial objects, and lived-in personal space.
- The four Guardians are **pets/familiars the user cares for**, not just profile icons.
- Guardians should be fed, rested, played with, brushed/cared for, given treats, and given furniture/toys/items.
- XP, crystals, streaks, course progress, and achievements should feed a visible **game economy** that lets the user unlock/buy/craft Sanctuary objects and Guardian-care items.
- The study experience should feel like **playing a fantasy game that happens to teach the course**:
  - trivia / challenge games
  - adaptive questions
  - matching / recall / boss-style study
  - vocabulary and misconception repair
  - Notes Forge from the user's real course materials
  - visible progression, rewards, Guardian growth, and world unlocks
- Real academic data must remain course-specific, while account-level XP/Guardian growth and long-term magical-world progression persist across classes.
- The visual tone should stay whimsical and cute where the Guardians are concerned, while the world itself feels mature, mysterious, magical, and academically prestigious.
- Avoid generic SaaS/dashboard feeling whenever a more immersive in-world interaction can serve the same function.
- Avoid childish classroom styling.
- Avoid flat placeholder art or furniture that does not feel like it belongs in the same world.
- Every new feature should answer: **Does this make Majick Studies feel more like living and studying inside this magical college, or is it just another app screen?**

### Experience completion score
Track this separately from technical release readiness.

Current estimate:
- Dark magical-college visual identity: **88%**
- Sanctuary / dorm-room atmosphere: **82%**
- Guardian pet-care fantasy: **58%**
- Study-game / trivia fantasy integration: **82%**
- XP / crystals / rewards economy: **68%**
- Course-world continuity and progression: **84%**
- Adult magical-girl / high-fantasy polish across all screens: **74%**
- Overall fantasy-world experience realization: **77%**

### Biggest experience gaps
1. **Guardian care loop** is not complete enough yet.
   - feeding
   - water
   - treats
   - brushing/grooming
   - play/toys
   - sleep/rest
   - affection/bond reactions
   - visible needs/status
2. **Crystal economy** needs a stronger spend loop.
   - buy/unlock Sanctuary objects
   - buy Guardian food/treats/toys
   - cosmetic/decor rewards
   - meaningful reasons to earn crystals through study
3. **Sanctuary needs to feel more lived-in and customizable.**
   - reliable furniture dragging/saving
   - object inventory / placement
   - more final-quality decor
   - Guardian-object interactions
   - room upgrades / unlockable zones
4. **Study screens need more in-world framing.**
   - make quizzes feel like trials, classes, duels, rituals, constellations, archives, or exams inside the magical college
   - reduce generic dashboard moments
5. **Magical college progression needs stronger ceremony.**
   - entering a new WGU course should feel like enrolling in a new magical class
   - passing a course should feel like completing a term/course rite
   - unlocks, badges, dorm upgrades, and Guardian evolution should reinforce progression
6. **Adult magical-girl polish** is not yet consistently expressed on every screen.
   - more celestial fashion/editorial elegance
   - richer dark-academia textures and ornament
   - refined typography, lighting, and transitions
   - keep Guardians cute/fluffy against the mature environment

## Run #80 — Study Now XP snag + Guardian Care release
- GitHub Pages run #80 completed **successfully** and deployed.
- Root cause of the Study Now snag was identified exactly:
  - legacy inline `prog()` returned `S.progress[S.activeCourse]` with no fallback;
  - during first render of a newly initialized/switched course, that record could briefly be undefined;
  - Study Now then read `prog().xp`, causing `Cannot read properties of undefined (reading 'xp')`;
  - Reload appeared to fix it because the course-progress record existed by the second render.
- Permanent fix:
  - assembled `prog()` now synchronously creates/normalizes the active course progress object before XP, crystals, streaks, answers, inventory or chests are read;
  - release verification fails if the unsafe legacy `prog(){return S.progress[S.activeCourse]}` implementation ever returns.
- Run #80 verifier explicitly passed:
  - `Study progress state hardening verified: XP/crystal reads cannot see undefined progress`
  - `Guardian care + Moon Crystal economy contract verified`
  - owned-roster model: `pet.id`
  - egg model: incubator until hatch
  - 6 care stations verified
- Guardian Care release now includes roster-driven hatched Guardians and separate incubating eggs.
- Phaser freeze protections remain intact:
  - protected 33 motion originals unchanged;
  - runtime motion: 2,205,848 bytes;
  - runtime furniture: 449,014 bytes;
  - total startup image budget: 2,907,938 bytes (~2.77 MiB).
- This is now the active verified live build.

## Run #82 — Old-save migration repair
- GitHub Pages run #82 completed **successfully** and deployed.
- Fixed two user-visible runtime errors from older saved state:
  - `Cannot read properties of undefined (reading 'xp')`
  - `a.guardianOwned is not iterable`
- Root cause of remaining XP error:
  - some legacy course-progress entries could be null/undefined before V4/V5 and `courseManager.js` mirrored shared XP;
  - startup now normalizes **every** saved course progress row before any XP/crystal/streak access;
  - `courseManager.js` also normalizes malformed rows before mirroring shared account values.
- Guardian ownership migration:
  - old arrays remain arrays;
  - Set/string/old boolean-map ownership formats are converted safely;
  - truthy old purchases are preserved;
  - false old-map entries are discarded;
  - old array-style Guardian inventory is converted into quantity counts.
- Added a permanent Node migration smoke test using:
  - malformed PMFC/D772/GHOST progress,
  - 1511 XP / 200 crystals,
  - old Guardian ownership map,
  - old inventory array,
  - two hatched Guardians (Velora + Solstice),
  - one incubating egg.
- Run #82 verified:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Study progress state hardening verified`
  - `Legacy save migration verified`
  - `Guardian care + Moon Crystal economy contract verified`
  - `Single V3.3.17 recovery surface verified`
- Removed stacked legacy error surfaces. Runtime failures now route to the single V3.3.17 recovery dialog.
- Phaser startup budget remains safe at **2,907,938 bytes (~2.77 MiB)**.

## Run #83 — Single render owner repair
- GitHub Pages run #83 completed **successfully** and deployed.
- Fixed fatal startup error: `oldRender is not a function`.
- Root cause:
  - V3.3.11 main and V3.3.11 plus were still wrapping `window.render`;
  - CourseManager also wrapped the Study Material renderer;
  - V3.3.17 already owns final rendering, so the legacy render-hijack chain was brittle and could capture a non-function reference during startup.
- Repair:
  - removed the obsolete V3.3.11 main render hijack;
  - removed the obsolete V3.3.11 plus render hijack;
  - kept Living Grimoire/evolution functionality without re-wrapping global render;
  - CourseManager now wraps Study Material only when the previous renderer is actually a function;
  - V3.3.17 now guards its base renderer before installing the final render bridge.
- Permanent verifier rule added: published builds fail if legacy `oldRender()` global-render hijacks return.
- Run #83 verifier explicitly passed:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Single render owner verified: V3.3.17 only`
  - `Guardian care + Moon Crystal economy contract verified`
  - `Study progress state hardening verified`
  - `Legacy save migration verified`
- Phaser startup budget remains safe at 2,907,938 bytes (~2.77 MiB).

## Run #84 — Base renderer / inline-script repair
- GitHub Pages run #84 completed **successfully** and deployed.
- Fixed fatal startup error: `Base render function is unavailable.`
- Exact root cause:
  - V3.3.17 clean sanitizer removed legacy error UIs with regex replacements;
  - two replacement strings accidentally restored only one closing brace instead of the original two;
  - this left the base inline app script and the V5 inline script with `SyntaxError: Unexpected end of input`;
  - because the base inline script could not parse, its `render()` function never existed.
- Repair:
  - restored the two missing closing braces in `v3317-clean-sanitize.py`;
  - retained the single V3.3.17 recovery boundary;
  - retained removal of obsolete render hijacks;
  - added mandatory final-artifact inline-script syntax verification.
- Permanent release gate now:
  - extracts every inline `<script>` from final assembled `index.html`;
  - runs `node --check` on every classic inline script;
  - fails deployment if any inline script is invalid;
  - proves the base `render()` declaration occurs before `v3317-main.js` loads.
- Run #84 explicitly passed:
  - `V3.3.17 migration smoke passed`
  - `V3.3.17 RELEASE VERIFIER PASSED`
  - `Single render owner verified: V3.3.17 only`
  - `Inline JavaScript syntax verified: 17 scripts`
  - `Base render order verified: inline script 0 before V3.3.17 script 28`
  - `Majick Studies V3.3.17 assembled successfully.`
- This is now the active verified live build.
