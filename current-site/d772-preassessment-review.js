(()=>{'use strict';
if(window.MajickD772PreassessmentReview)return;
const SOURCE_ID='wgu-d772-preassessment-2026-10-15';
const origin=()=>window.MajickD772PreassessmentSource?.items||[];
const SUPPORT=[
  {
    "id": "representative-generalization",
    "lessonId": "d772-s1-l1",
    "prompt": "A district randomly selects 240 of its 2,400 teachers across schools and grade levels. The sample closely reflects the characteristics of the district teacher population.\n\nWhat is one implication of using this representative sample?",
    "choices": [
      "Generalize cautiously to the district population, accounting for uncertainty",
      "Assume the sample is too small to support any inference",
      "Claim every individual teacher holds the sample average",
      "The survey establishes a causal relationship between school assignment and teacher preferences."
    ],
    "correct": 0,
    "why": "A representative sample supports inference about its larger population. Representativeness does not make sampling uncertainty disappear. Exam-language connection: Generalize means use sample results to estimate a characteristic of the population; it does not establish cause and effect.",
    "teacher": "How can I check whether the 240 teachers represent the larger district?",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "Generalize cautiously to the district population, accounting for uncertainty",
      "Assume the sample is too small to support any inference",
      "Claim every individual teacher holds the sample average",
      "The survey establishes a causal relationship between school assignment and teacher preferences."
    ],
    "answer": "Generalize cautiously to the district population, accounting for uncertainty",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "representative sample; population; generalization",
      "meaning": "Generalize means use sample results to estimate a characteristic of the population; it does not establish cause and effect."
    }
  },
  {
    "id": "frame-error",
    "lessonId": "d772-s1-l2",
    "prompt": "A school wants to describe the opinions of all its students about the cafeteria menu. A researcher surveys only students who ate in the cafeteria on Monday.\n\nWhich statement describes a limitation of the sampling method?",
    "choices": [
      "A large number of cafeteria respondents eliminates any sampling bias.",
      "Possible undercoverage because students absent or never eating cafeteria meals are left out",
      "A controlled randomized experiment occurred",
      "All students had an equal chance to answer"
    ],
    "correct": 1,
    "why": "The sampling frame omitted students who did not use the cafeteria that Monday. Compare the frame with the target population. Exam-language connection: The sampling frame is the group that can actually be selected. Leaving out part of the target population can create sampling bias.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "A large number of cafeteria respondents eliminates any sampling bias.",
      "Possible undercoverage because students absent or never eating cafeteria meals are left out",
      "A controlled randomized experiment occurred",
      "All students had an equal chance to answer"
    ],
    "answer": "Possible undercoverage because students absent or never eating cafeteria meals are left out",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "sampling frame; sampling bias; undercoverage",
      "meaning": "The sampling frame is the group that can actually be selected. Leaving out part of the target population can create sampling bias."
    }
  },
  {
    "id": "axis-difference",
    "lessonId": "d772-s1-l3",
    "prompt": "A bar chart compares school attendance rates of 92% and 96%. The scale of the vertical axis starts at 80%.\n\nWhich statement correctly describes the difference and the effect of the graphical display?",
    "choices": [
      "The attendance increased by 16 percentage points",
      "The shortened vertical axis reduces the apparent difference to zero.",
      "The increase is 4 percentage points; the shortened axis exaggerates it visually",
      "The increase is 4 percent of the first group and proves a new policy worked"
    ],
    "correct": 2,
    "why": "96 − 92 = 4 percentage points. Scale changes display appearance, not the data or evidence of cause. Exam-language connection: A difference in percentage points is found by subtraction. A truncated vertical axis can exaggerate the visual difference without changing the data.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "The attendance increased by 16 percentage points",
      "The shortened vertical axis reduces the apparent difference to zero.",
      "The increase is 4 percentage points; the shortened axis exaggerates it visually",
      "The increase is 4 percent of the first group and proves a new policy worked"
    ],
    "answer": "The increase is 4 percentage points; the shortened axis exaggerates it visually",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "vertical axis; scale; percentage points",
      "meaning": "A difference in percentage points is found by subtraction. A truncated vertical axis can exaggerate the visual difference without changing the data."
    }
  },
  {
    "id": "association",
    "lessonId": "d772-s1-l4",
    "prompt": "A researcher records tutoring attendance and course grades without assigning students to attend tutoring. Students who attend tutoring tend to earn higher grades.\n\nWhat is a valid conclusion, based on this observational study?",
    "choices": [
      "No relationship could exist",
      "Random assignment has eliminated all potential confounding variables.",
      "Tutoring definitely caused the grades",
      "There is an association; motivation or prior performance could confound the pattern"
    ],
    "correct": 3,
    "why": "Observational association alone does not show causation. Identify alternative causes. Exam-language connection: An association means variables are related. Without control through experimental assignment, another variable may explain the pattern.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "No relationship could exist",
      "Random assignment has eliminated all potential confounding variables.",
      "Tutoring definitely caused the grades",
      "There is an association; motivation or prior performance could confound the pattern"
    ],
    "answer": "There is an association; motivation or prior performance could confound the pattern",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "observational study; association; causation; confounding variable",
      "meaning": "An association means variables are related. Without control through experimental assignment, another variable may explain the pattern."
    }
  },
  {
    "id": "quartile",
    "lessonId": "d772-s2-l4",
    "prompt": "The following data are nine quiz scores: 12, 15, 17, 20, 22, 25, 28, 31, 36. Use the median-of-halves convention, excluding the overall median when finding the lower and upper halves.\n\nWhat is the first quartile (Q1) of this data set?",
    "choices": [
      "16",
      "17",
      "20",
      "22"
    ],
    "correct": 0,
    "why": "Median is 22. Lower half = 12,15,17,20; Q1 = (15+17)/2 = 16. Check which quartile convention your course uses. Exam-language connection: The first quartile is the median of the lower half of the ordered data under the stated convention.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "16",
      "17",
      "20",
      "22"
    ],
    "answer": "16",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "first quartile; ordered data; median-of-halves convention",
      "meaning": "The first quartile is the median of the lower half of the ordered data under the stated convention."
    }
  },
  {
    "id": "intersection",
    "lessonId": "d772-s3-l2",
    "prompt": "The sample space for a random experiment is {1, 2, 3, 4, 5, 6, 7, 8}. Event A is {1, 3, 5, 7}, and event B is {2, 3, 5, 8}.\n\nWhich outcomes correspond to the event \"A and B\"?",
    "choices": [
      "{1,2,3,5,7,8}",
      "{3,5}",
      "{1,7}",
      "{2, 8}"
    ],
    "correct": 1,
    "why": "Intersection means only the elements common to both sets: 3 and 5. Exam-language connection: The event A and B contains only outcomes common to both events.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "{1,2,3,5,7,8}",
      "{3,5}",
      "{1,7}",
      "{2, 8}"
    ],
    "answer": "{3,5}",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "sample space; outcomes; intersection",
      "meaning": "The event A and B contains only outcomes common to both events."
    }
  },
  {
    "id": "complement",
    "lessonId": "d772-s3-l2",
    "prompt": "A random experiment has the sample space {A, B, C, D, E, F}. Event R is {B, D, F}.\n\nWhich outcomes correspond to the event \"not R\"?",
    "choices": [
      "{A,B,C,D,E,F}",
      "{A, B, C}",
      "{A,C,E}",
      "{B,D,F}"
    ],
    "correct": 2,
    "why": "Complement means all outcomes in the sample space that are not in the event: A,C,E. Exam-language connection: The event not R contains every outcome in the sample space that is not in event R.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "{A,B,C,D,E,F}",
      "{A, B, C}",
      "{A,C,E}",
      "{B,D,F}"
    ],
    "answer": "{A,C,E}",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "sample space; event; complement",
      "meaning": "The event not R contains every outcome in the sample space that is not in event R."
    }
  },
  {
    "id": "disjoint",
    "lessonId": "d772-s3-l2",
    "prompt": "A fair die is rolled once. Event A is {1, 3, 5}, and event B is {1, 2}.\n\nWhich statement describes whether events A and B are mutually exclusive?",
    "choices": [
      "Yes, because they have different numbers of outcomes",
      "They are complementary because their union contains all six outcomes.",
      "Yes, both are possible",
      "No, they overlap at 1"
    ],
    "correct": 3,
    "why": "Disjoint events have no shared outcomes. Both events contain 1, so they are not disjoint. Exam-language connection: Mutually exclusive or disjoint events cannot both occur on the same trial. An outcome in both events shows that they are not mutually exclusive.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "Yes, because they have different numbers of outcomes",
      "They are complementary because their union contains all six outcomes.",
      "Yes, both are possible",
      "No, they overlap at 1"
    ],
    "answer": "No, they overlap at 1",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "mutually exclusive; disjoint; intersection",
      "meaning": "Mutually exclusive or disjoint events cannot both occur on the same trial. An outcome in both events shows that they are not mutually exclusive."
    }
  },
  {
    "id": "expected-value",
    "lessonId": "d772-s3-l3",
    "prompt": "A game results in a net gain of $12 with probability 1/4 or a net loss of $4 with probability 3/4.\n\nWhat is the expected value of the net return for one play?",
    "choices": [
      "Break even ($0)",
      "$4 loss",
      "$3 gain",
      "$8 gain"
    ],
    "correct": 0,
    "why": "Expected value = (1/4 × $12) + (3/4 × −$4) = $3 − $3 = $0. It is a long-run average, not a guaranteed result. Exam-language connection: Expected value is a probability-weighted long-run average, not a promised result on one trial.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "Break even ($0)",
      "$4 loss",
      "$3 gain",
      "$8 gain"
    ],
    "answer": "Break even ($0)",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "expected value; probability; gain; loss",
      "meaning": "Expected value is a probability-weighted long-run average, not a promised result on one trial."
    }
  },
  {
    "id": "decision-ev",
    "lessonId": "d772-s3-l3",
    "prompt": "In a game of chance, move A awards 18 points with probability 0.20 and 0 points otherwise. Move B awards 8 points with probability 0.60 and 0 points otherwise.\n\nWhich move should a player choose to maximize expected points, and why?",
    "choices": [
      "A because 18 is larger",
      "B, with 4.8 expected points versus 3.6",
      "Equal expected points",
      "Move A, because a greater possible payoff always produces a greater expected value."
    ],
    "correct": 1,
    "why": "EV(A)=18×0.20=3.6; EV(B)=8×0.60=4.8. Compare probability-weighted payoffs, not only the prize size. Exam-language connection: Expected value is a probability-weighted long-run average, not a promised result on one trial.",
    "sourceLabel": "MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU",
    "courseId": "D772",
    "options": [
      "A because 18 is larger",
      "B, with 4.8 expected points versus 3.6",
      "Equal expected points",
      "Move A, because a greater possible payoff always produces a greater expected value."
    ],
    "answer": "B, with 4.8 expected points versus 3.6",
    "revision": 2,
    "format": "single-best-answer",
    "languageReference": "wgu-d772-preassessment-2026-10-15",
    "examLanguage": {
      "term": "expected value; probability; gain; loss",
      "meaning": "Expected value is a probability-weighted long-run average, not a promised result on one trial."
    }
  }
].map(q=>Object.freeze(q)).concat(window.MajickD772PreassessmentDeepPractice?.questions||[]);
function state(){const p=window.S?.progress?.D772;if(!p)return null;return p.preassessmentReview||(p.preassessmentReview={version:1,sourceId:SOURCE_ID,attempts:[],position:0,practiceIndex:0,importedAt:Date.now()})}
function save(){try{if(typeof window.save==='function')window.save();else if(typeof save==='function')save()}catch(e){console.warn('D772 preassessment review could not save',e)}}
const asPractice=q=>({...q,course:'D772',courseId:'D772',learningPathLessonId:q.lessonId,topicId:q.lessonId,section:q.lessonId.includes('-s1-')?'Section 1 · Research credibility':q.lessonId.includes('-s2-')?'Section 2 · Statistics and graphs':'Section 3 · Probability',options:q.choices,choices:q.choices,answer:q.choices[q.correct],sourceName:q.sourceLabel,source:q.sourceLabel,rigorLevel:3,independentMastery:true,whiteboard:'Identify what the question asks, show the evidence or calculation, and justify the best answer.',generated:true});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function render(){
 if(window.S?.activeCourse!=='D772'||window.S?.screen!=='home')return;
 const root=document.querySelector('.content');if(!root||root.querySelector('#mjPreassessmentReview'))return;
 const data=origin(),st=state();if(data.length!==58||!st)return;
 const section=document.createElement('section');section.id='mjPreassessmentReview';section.setAttribute('aria-label','D772 preassessment review and practice');
 section.style.cssText='margin:18px 0;padding:17px;border:2px solid #b69877;border-radius:11px;background:#fcf1e0;color:#281d30;line-height:1.55';
 section.innerHTML='<h3>WGU D772 · Pre-assessment review</h3><p><strong>58 questions captured:</strong> 47 correct · 2 answered incorrectly (9 and 49) · 9 unanswered (50–58). <strong>Only answered questions count as attempts.</strong></p>'+
 '<p>Priority 1: representative samples (Q9) and mutually exclusive events (Q49). Priority 2: unfinished Venn diagrams, intersections, complements, and expected value (Q50–58). Some equations were lost when WGU exported the page; those source items are reference only until the missing math is supplied.</p>'+
 '<details><summary>Browse all 58 original pre-assessment questions</summary>'+
 '<label for="mjPaOriginal">Question</label> <select id="mjPaOriginal"></select><div data-mj-pa-source></div></details>'+
 '<div style="margin-top:13px;padding:12px;border:1px solid #a78c76;border-radius:8px;background:#fff9ef"><h4>OA-style practice · New questions based on your pre-assessment</h4>'+
 '<label for="mjPaPracticeTopic">Practice topic</label> <select id="mjPaPracticeTopic"></select>'+
 '<div data-mj-pa-practice></div><fieldset style="border:0;padding:0"><legend>Choose the best answer</legend><div data-mj-pa-options></div></fieldset>'+
 '<button type="button" data-mj-pa-check>Check and explain</button> <button type="button" data-mj-pa-next>Next practice question</button>'+
 '<p data-mj-pa-feedback role="status" aria-live="polite"></p>'+
 '<p>These are original Majick OA-style questions, not copies of the WGU exam. Results are saved as targeted practice, not official pre-assessment scores or automatic mastery.</p></div>';
 root.prepend(section);
 section.querySelectorAll('h3,h4,p,summary,label,legend,option,strong').forEach(el=>el.style.setProperty('color','#281d30','important'));
 section.querySelectorAll('button').forEach(el=>el.style.cssText='padding:9px 12px;margin:5px 5px 5px 0;background:#382349;color:#fff9ef!important;border:2px solid #ac8fae;border-radius:7px;cursor:pointer');
 const origSelect=section.querySelector('#mjPaOriginal'),src=section.querySelector('[data-mj-pa-source]');
 data.forEach(q=>{const opt=document.createElement('option');opt.value=String(q.number);opt.textContent='Q'+q.number+' · '+q.sourceStatus+(q.mathOrImageGap?' · incomplete math':'');origSelect.append(opt)});
 const statusNote={correct:'You answered this correctly',incorrect:'You selected an incorrect answer',unanswered:'No answer was selected; not counted as a mistake'};
 function showOriginal(){
  const q=data.find(x=>String(x.number)===origSelect.value);if(!q)return;
  src.replaceChildren();
  const title=document.createElement('p');title.textContent='Original WGU question '+q.number+' — '+statusNote[q.sourceStatus];src.append(title);
  const prompt=document.createElement('p');prompt.style.whiteSpace='pre-wrap';prompt.textContent=q.prompt;src.append(prompt);
  q.choices.forEach((choice,i)=>{const p=document.createElement('p');p.style.cssText='border-bottom:1px solid #d0bda8;padding:4px;color:#281d30';p.textContent=String.fromCharCode(65+i)+'. '+(choice||'[Missing from exported WGU math]')+(q.correctIndex===i?' — WGU marked correct':'')+(q.chosenIndex===i?' — Your selected answer':'');src.append(p)});
  if(q.mathOrImageGap){const p=document.createElement('p');p.textContent='Some original mathematical expressions or choices were lost in the export. Do not use this damaged item as a scored test.';src.append(p)}
  q.assetLinks.forEach(url=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open source chart or diagram';a.style.display='block';src.append(a)});
 }
 origSelect.value='9';origSelect.addEventListener('change',showOriginal);showOriginal();
 const topic=section.querySelector('#mjPaPracticeTopic'),pane=section.querySelector('[data-mj-pa-practice]'),opts=section.querySelector('[data-mj-pa-options]'),fb=section.querySelector('[data-mj-pa-feedback]');
 SUPPORT.forEach((q,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=(i+1)+'. '+(q.skill||q.id.replaceAll('-',' '));topic.append(opt)});
 function question(){return SUPPORT[Number(topic.value)]}
 function showPractice(){const q=question();pane.textContent=q.prompt;opts.replaceChildren();q.choices.forEach((c,i)=>{const lbl=document.createElement('label');lbl.style.cssText='display:block;margin:8px 0;color:#281d30';const radio=document.createElement('input');radio.type='radio';radio.name='mjPaPracticeChoice';radio.value=String(i);lbl.append(radio,document.createTextNode(' '+String.fromCharCode(65+i)+'. '+c));opts.append(lbl)});fb.textContent=''}
 topic.value=String(Math.min(st.practiceIndex||0,SUPPORT.length-1));topic.addEventListener('change',showPractice);
 section.querySelector('[data-mj-pa-check]').addEventListener('click',()=>{
  const selected=section.querySelector('input[name="mjPaPracticeChoice"]:checked');if(!selected){fb.textContent='Choose an answer first.';return}
  const q=question(),correct=Number(selected.value)===q.correct;
  st.attempts.push({id:q.id,lessonId:q.lessonId,selected:Number(selected.value),correct,questionRevision:q.revision||1,source:'majick-oa-style-preassessment-repair',assisted:true,createdAt:Date.now()});
  fb.textContent=(correct?'Correct. ':'Not yet. ')+q.why+' Guided review only; no mastery or reward is automatically awarded.';
  window.MajickLearningContinuity?.record?.({courseId:'D772',lessonTitle:q.lessonId,correct,activity:'preassessment-guided-'+q.id});
  save();
 });
 section.querySelector('[data-mj-pa-next]').addEventListener('click',()=>{st.practiceIndex=(Number(topic.value)+1)%SUPPORT.length;topic.value=String(st.practiceIndex);save();showPractice()});
 showPractice();
}
window.MajickD772PreassessmentReview={sourceId:SOURCE_ID,questions:SUPPORT,practiceQuestions:()=>SUPPORT.map(asPractice),forLesson:id=>SUPPORT.filter(q=>q.lessonId===id||q.lessonId.startsWith(id+'-')).map(asPractice),source:origin,state,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-preassessment-review',render,81);window.MajickRenderQueue.schedule()}
else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1500)}
})();
