(()=>{'use strict';
if(window.MajickD772PreassessmentReview)return;
const SOURCE_ID='wgu-d772-preassessment-2026-10-15';
const origin=()=>window.MajickD772PreassessmentSource?.items||[];
const SUPPORT=[
{id:'representative-generalization',lessonId:'d772-s1-l1',prompt:'A district randomly selects 240 of its 2,400 teachers across schools and grade levels. The respondents closely reflect the district population. What can the district reasonably do?',choices:['Generalize cautiously to the district population, accounting for uncertainty','Assume the sample is too small to support any inference','Claim every individual teacher holds the sample average'],correct:0,why:'A representative sample supports inference about its larger population. Representativeness does not make sampling uncertainty disappear.',teacher:'How can I check whether the 240 teachers represent the larger district?'},
{id:'frame-error',lessonId:'d772-s1-l2',prompt:'A school asks only students who ate in the cafeteria on Monday whether they enjoy the cafeteria menu. Which limitation matters?',choices:['Possible undercoverage because students absent or never eating cafeteria meals are left out','A controlled randomized experiment occurred','All students had an equal chance to answer'],correct:0,why:'The sampling frame omitted students who did not use the cafeteria that Monday. Compare the frame with the target population.'},
{id:'axis-difference',lessonId:'d772-s1-l3',prompt:'A graph starts at 80% and compares school attendance of 92% and 96%. What must a careful teacher explain?',choices:['The increase is 4 percentage points; the shortened axis exaggerates it visually','The increase is 4 percent of the first group and proves a new policy worked','The attendance increased by 16 percentage points'],correct:0,why:'96 − 92 = 4 percentage points. Scale changes display appearance, not the data or evidence of cause.'},
{id:'association',lessonId:'d772-s1-l4',prompt:'A teacher finds students who attend tutoring also earn higher grades, without random assignment. What conclusion is justified?',choices:['Tutoring definitely caused the grades','There is an association; motivation or prior performance could confound the pattern','No relationship could exist'],correct:1,why:'Observational association alone does not show causation. Identify alternative causes.'},
{id:'quartile',lessonId:'d772-s2-l4',prompt:'Nine quiz scores are 12, 15, 17, 20, 22, 25, 28, 31, 36. Using the median-of-halves convention excluding the median, find Q1.',choices:['16','17','20'],correct:0,why:'Median is 22. Lower half = 12,15,17,20; Q1 = (15+17)/2 = 16. Check which quartile convention your course uses.'},
{id:'intersection',lessonId:'d772-s3-l2',prompt:'Outcomes are {1,2,3,4,5,6,7,8}. A={1,3,5,7} and B={2,3,5,8}. What is A AND B?',choices:['{1,2,3,5,7,8}','{3,5}','{1,7}'],correct:1,why:'Intersection means only the elements common to both sets: 3 and 5.'},
{id:'complement',lessonId:'d772-s3-l2',prompt:'Sample space is {A,B,C,D,E,F}. Event A={B,D,F}. Which set is NOT A?',choices:['{A,C,E}','{B,D,F}','{A,B,C,D,E,F}'],correct:0,why:'Complement means all outcomes in the sample space that are not in the event: A,C,E.'},
{id:'disjoint',lessonId:'d772-s3-l2',prompt:'On one fair die roll, event A is odd ({1,3,5}) and event B is less than 3 ({1,2}). Are A and B disjoint?',choices:['Yes, both are possible','No, they overlap at 1','Yes, because they have different numbers of outcomes'],correct:1,why:'Disjoint events have no shared outcomes. Both events contain 1, so they are not disjoint.'},
{id:'expected-value',lessonId:'d772-s3-l3',prompt:'A game pays $12 with probability 1/4 and loses $4 with probability 3/4. What is the expected gain or loss per play?',choices:['$8 gain','Break even ($0)','$4 loss'],correct:1,why:'Expected value = (1/4 × $12) + (3/4 × −$4) = $3 − $3 = $0. It is a long-run average, not a guaranteed result.'},
{id:'decision-ev',lessonId:'d772-s3-l3',prompt:'Game A awards 18 points with a 20% chance; game B awards 8 points with a 60% chance. All other outcomes award zero. Which has higher expected points?',choices:['A because 18 is larger','B, with 4.8 expected points versus 3.6','Equal expected points'],correct:1,why:'EV(A)=18×0.20=3.6; EV(B)=8×0.60=4.8. Compare probability-weighted payoffs, not only the prize size.'}
].map(q=>Object.freeze({...q,sourceLabel:'MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU',courseId:'D772'}));
function state(){const p=window.S?.progress?.D772;if(!p)return null;return p.preassessmentReview||(p.preassessmentReview={version:1,sourceId:SOURCE_ID,attempts:[],position:0,practiceIndex:0,importedAt:Date.now()})}
function save(){try{if(typeof window.save==='function')window.save();else if(typeof save==='function')save()}catch(e){console.warn('D772 preassessment review could not save',e)}}
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
 SUPPORT.forEach((q,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=(i+1)+'. '+q.id.replaceAll('-',' ');topic.append(opt)});
 function question(){return SUPPORT[Number(topic.value)]}
 function showPractice(){const q=question();pane.textContent=q.prompt;opts.replaceChildren();q.choices.forEach((c,i)=>{const lbl=document.createElement('label');lbl.style.cssText='display:block;margin:8px 0;color:#281d30';const radio=document.createElement('input');radio.type='radio';radio.name='mjPaPracticeChoice';radio.value=String(i);lbl.append(radio,document.createTextNode(' '+c));opts.append(lbl)});fb.textContent=''}
 topic.value=String(Math.min(st.practiceIndex||0,SUPPORT.length-1));topic.addEventListener('change',showPractice);
 section.querySelector('[data-mj-pa-check]').addEventListener('click',()=>{
  const selected=section.querySelector('input[name="mjPaPracticeChoice"]:checked');if(!selected){fb.textContent='Choose an answer first.';return}
  const q=question(),correct=Number(selected.value)===q.correct;
  st.attempts.push({id:q.id,lessonId:q.lessonId,selected:Number(selected.value),correct,source:'majick-oa-style-preassessment-repair',assisted:true,createdAt:Date.now()});
  fb.textContent=(correct?'Correct. ':'Not yet. ')+q.why+' Guided review only; no mastery or reward is automatically awarded.';
  window.MajickLearningContinuity?.record?.({courseId:'D772',lessonTitle:q.lessonId,correct,activity:'preassessment-guided-'+q.id});
  save();
 });
 section.querySelector('[data-mj-pa-next]').addEventListener('click',()=>{st.practiceIndex=(Number(topic.value)+1)%SUPPORT.length;topic.value=String(st.practiceIndex);save();showPractice()});
 showPractice();
}
window.MajickD772PreassessmentReview={sourceId:SOURCE_ID,questions:SUPPORT,source:origin,state,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-preassessment-review',render,81);window.MajickRenderQueue.schedule()}
else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1500)}
})();
