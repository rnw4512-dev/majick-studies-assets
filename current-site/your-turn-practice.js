(()=>{'use strict';if(window.MajickYourTurn)return;
const E=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));

const extras={
'd772-s2-l4':[
 {prompt:'Four reading scores are 6, 10, 14, and 18. Calculate their mean.',answer:12,why:'6 + 10 + 14 + 18 = 48; 48 ÷ 4 = 12.'},
 {prompt:'The ordered values are 3, 6, 8, 12, 14, 17. Calculate their median.',answer:10,why:'The two middle values are 8 and 12; (8 + 12) ÷ 2 = 10.'},
 {prompt:'A fifth score of 30 is added to 6, 10, 14, 18. What is the new mean?',answer:15.6,why:'The total is 78; 78 ÷ 5 = 15.6.'}
],
'd772-s3-l1':[
 {prompt:'A fair six-sided die is rolled. What is the probability of rolling an even number? Give a decimal.',answer:.5,why:'Three of six faces are even: 3/6 = 0.5.'},
 {prompt:'A bag has four green and six purple counters. What is P(green) on one draw? Give a decimal.',answer:.4,why:'4 favorable out of 10 equally likely counters = 0.4.'},
 {prompt:'A spinner has eight equal spaces, three gold. What is P(gold)? Give a decimal.',answer:.375,why:'3 ÷ 8 = 0.375.'}
],
'd772-s3-l3':[
 {prompt:'A bag has 4 green and 2 purple counters. Without replacement, what is P(two greens)? Give a decimal.',answer:.4,why:'4/6 × 3/5 = 12/30 = 0.4.'},
 {prompt:'A bag has 3 blue and 2 red counters. With replacement, what is P(two blues)? Give a decimal.',answer:.36,why:'3/5 × 3/5 = 9/25 = 0.36.'},
 {prompt:'A bag has 5 yellow and 3 purple counters. Without replacement, what is P(two yellow)? Give a decimal to 4 places.',answer:.3571,why:'5/8 × 4/7 = 5/14 ≈ 0.3571.'}
]};
// Supplemental scenario explanations; original source questions and rationales remain unchanged.
const scenarioReasons={
  "d772-s1-l1": [
    "All district teachers are the population; drivers at one school are the sample. Establish the population first so you can compare who was included and excluded. Drivers at one school may have different commute times from teachers at other schools or teachers who use other transport.",
    "The target is all school families, while the sample includes only evening-event attendees. Define that target before evaluating the sample: families unable to attend may have different views, so attendance does not establish representativeness.",
    "The population is city residents; the sample is commuters at one downtown station. Identify both before judging coverage. Other stations, other travel times and people who do not use public transport are missing; broaden sampling across residents."
  ],
  "d772-s1-l2": [
    "Adults who volunteer through a gym website exclude many non-gym users and may have different nutrition habits. Identify that exclusion before naming voluntary-response and coverage bias. Sample from the intended adult population rather than relying only on gym volunteers.",
    "The wording assumes the policy is excellent and pressures agreement. Anonymity does not remove leading-question bias. Identify that influence first, then use neutral wording with balanced response options.",
    "Volunteering after a positive assembly can select enthusiastic students and prime favorable responses. Identify these influences before selecting a repair: use neutral wording and sample students independently of assembly enthusiasm."
  ],
  "d772-s1-l3": [
    "Attendance differs by 2 percentage points: 94 − 92 = 2. Starting the axis at 90 exaggerates the visible difference. Inspect the scale before interpreting bar heights; compare the stated values and use an appropriate, clearly labeled scale.",
    "Doubling both width and height multiplies the icon area by 2 × 2 = 4, although enrollment only doubled. Check both dimensions before interpreting size. For twice the area, scale each dimension by the square root of 2 or use equal-width bars.",
    "A three-dimensional illustration can change perceived area or volume independently of class size. Inspect how dimensions encode enrollment before comparing sizes; verify the counts with a clearly labeled two-dimensional display."
  ],
  "d772-s1-l4": [
    "This study is observational: students with tutors may differ in motivation, prior achievement or resources. Identify the design before evaluating the causal claim. The association alone cannot establish that tutoring caused every gain.",
    "A six-person trial supplies limited evidence about the wider student population. Examine who participated and how the trial was designed before generalizing. Report uncertainty and restrict conclusions to what the sampling and design support.",
    "The 28-student study observes an association between sleep and grades, not a guaranteed effect. Establish the design and sample before judging the headline; other variables may explain the relationship."
  ],
  "d772-s2-l1": [
    "Teacher certification category is categorical; years of experience is quantitative. Identify what each variable records before choosing its type: category labels are groups, while years measure an amount.",
    "Number of absences is a quantitative discrete count; service receipt is categorical yes/no. Identify each variable before classifying it. Numeric coding of yes/no would not turn service receipt into a measured quantity.",
    "Lunch choice is categorical, while age and weekly reading minutes are quantitative measurements. Identify each recorded attribute before choosing a display or summary; arithmetic on lunch labels has no numerical interpretation."
  ],
  "d772-s2-l2": [
    "The 90 quiz scores form one quantitative variable. Identify that structure before choosing a histogram to show frequencies across score intervals; a scatterplot would require two paired quantitative variables.",
    "Each student contributes paired study hours and score, two quantitative variables. Recognize the pairing first, then use a scatterplot with labeled axes to investigate association without claiming causation.",
    "Teacher experience and reading improvement are paired quantitative measurements. Identify each pair before plotting experience against improvement in a scatterplot; a histogram would lose the pairing."
  ],
  "d772-s2-l3": [
    "One peak indicates a unimodal distribution and the long right tail indicates right skew. Inspect shape and unusual values before comparing centers: high salaries can pull the mean above the median.",
    "Two distinct peaks indicate bimodality, while the very low value is a potential outlier. Describe both features before choosing a center; investigate possible subgroups and whether the outlier is valid rather than deleting it automatically.",
    "Similar averages can hide different shapes and spreads. Describe the long right tail and isolated high values first; they can raise the mean, so also compare medians, spread and context."
  ],
  "d772-s3-l2": [
    "Without replacement the first card is removed, so the second draw uses a different remaining deck. Identify this change before choosing the dependency rule; calculate the second probability conditional on the first draw.",
    "Odd outcomes are {1,3,5}; outcomes greater than four are {5,6}. Identify these sets first. Their intersection is {5}, so the events overlap and are not mutually exclusive.",
    "The intersection contains outcomes in both A and B; the union contains outcomes in A or B or both. Identify the shared region first so it is counted once, not twice, in P(A union B) = P(A) + P(B) − P(A intersection B)."
  ],
  "d756-s1-l1": [
    "The missing family perspective includes supports that work at home. Identify whose expertise is absent before planning participation; invite and support the family to share that evidence, then agree how the team will use it.",
    "The communication question requires relevant related-service expertise. Identify that need first, involve an appropriate specialist and connect their interpretation to the family and teacher observations before making support decisions.",
    "The team needs a member able to interpret the instructional implications of evaluation results. Identify the missing role before arranging participation and a shared review; a test score alone does not explain classroom needs."
  ],
  "d756-s1-l2": [
    "The caregiver reports previously being dismissed. Acknowledge and clarify that experience before proposing a solution; agree and document how their concerns will inform the IEP discussion and follow-up.",
    "The family is asking why the accommodation is proposed. Listen and clarify the disagreement first, explain the evidence in accessible terms, then document agreed next steps rather than treating disagreement as refusal.",
    "The home observations conflict with the proposed goal. Invite concrete examples first, compare them with school evidence and document how the team will investigate and respond before finalizing the goal."
  ],
  "d756-s2-l1": [
    "The professionals have conflicting reading observations. Establish shared evidence and contexts before selecting an intervention; agree a common measure, compare observations and review progress together.",
    "The family and general educator have different homework priorities. Clarify each priority and access barrier first, then agree a feasible support plan with a shared way to evaluate it.",
    "The specialist and teacher each hold incomplete progress data. Pool and interpret the evidence before deciding; agree who will collect missing information and when the team will review it."
  ],
  "d756-s2-l2": [
    "The family prefers a different language. Ask about language and communication needs first, arrange qualified interpretation and accessible materials, then check understanding and meaningful participation.",
    "The family and school have different meeting expectations. Ask about the family’s preferences without assuming all members of a cultural group are alike; agree a respectful format before reviewing decisions.",
    "The planned meeting does not meet the family’s communication needs. Clarify those needs first, arrange an accessible format and language supports, and confirm that the family can participate before proceeding."
  ],
  "d756-s3-l1": [
    "The team has classroom data but has not reviewed family concerns. Gather and reconcile both sources first so present levels, goals and services address the learner’s documented needs; then agree roles and monitoring.",
    "New services should respond to jointly reviewed present levels. Establish the learner’s baseline and needs before selecting services, then document how the team will check their effectiveness.",
    "The reading goals are being finalized without a shared baseline or family review. Bring that evidence together first, use it to select measurable goals and agree who will monitor progress."
  ],
  "d756-s3-l2": [
    "The current baseline is 4 of 10 main ideas under the stated passage conditions. Establish that starting evidence first, then specify a measurable target, conditions and progress measure; the scenario does not yet supply a defensible target.",
    "“Improve writing skills” lacks a measurable behavior, criterion and conditions. Identify the baseline and writing skill first, define how improvement will be measured and agree when the team will review the evidence.",
    "The writing baseline is 2 of 5 rubric elements. Clarify which elements and assessment conditions first, then choose a measurable target using a consistent rubric and agree a progress-review schedule."
  ],
  "d756-s3-l3": [
    "The learner needs classroom access and evidence that supports work. Identify the documented barrier first, select relevant supports and specify the measure, responsibility and review schedule before judging effectiveness.",
    "Service decisions must start with individual needs and supplementary aids, not a predetermined placement. Consider how the learner can participate in the least restrictive appropriate setting, then specify monitoring.",
    "The selected service lacks frequency, location and a family reporting plan. Check those implementation details against the learner’s documented need, then specify responsibilities and how progress will be communicated."
  ],
  "d756-s3-l4": [
    "The student’s culinary-arts interest supplies a starting point, not a complete transition plan. Gather student-centered assessment evidence first, then develop measurable postsecondary goals, relevant activities and responsible partners.",
    "The student wants community-college training. Clarify interests, strengths and transition assessment evidence first, then coordinate relevant goals and activities with responsible partners and follow-up.",
    "The automotive-technology interest needs age-appropriate transition assessment and measurable planning. Establish the student’s preferences and needs first, then connect postsecondary goals to activities, responsibilities and review."
  ]
};
function keyFor(id,lesson){let s=String(lesson?.id||'').toLowerCase();let m=s.match(/(d772|d756)-s([123])-l([1-4])/);if(m)return m[0];let text=String(lesson?.title||'').toLowerCase();const tasks=window.MajickLessonActivities?.tasks||[];return tasks.find(t=>t.course===id&&(text.includes(String(t.title).toLowerCase())||String(t.title).toLowerCase().includes(text)))?.lessonId||''}
function itemsFor(course,lesson){const key=keyFor(course,lesson),task=window.MajickLessonActivities?.tasks?.find(t=>t.course===course&&t.lessonId===key);
 if(extras[key])return {key,items:extras[key].map(q=>({...q,type:'number'})),objective:task?.objective||String(lesson?.goal||lesson?.title||'')};
 if(!task)return {key,items:[],objective:lesson?.goal||''};
 return {key,items:task.cases.slice(0,3).map((q,i)=>({type:'sequence',prompt:q.prompt,parts:q.parts,correct:q.correct,why:scenarioReasons[key]?.[i]||q.reason,difficulty:i+1})),objective:task.objective};
}
function cleanReason(text){
 const sentences=String(text||'').trim().split(/(?<=[.!?])\s+/);
 const seen=new Set();return sentences.filter(sentence=>{const key=sentence.trim().toLowerCase();if(seen.has(key))return false;seen.add(key);return true}).map(x=>x.trim()).join(' ');
}
function lessonReason(item){
 const reason=cleanReason(item.why);
 return item.type==='sequence'?'Use this order: '+item.correct.map((i,n)=>(n+1)+'. '+item.parts[i]).join(' → ')+'. '+reason:reason;
}
function teachFeedback(item,answer){
 const reason=cleanReason(item.why);
 if(item.type==='number')return 'Your answer was '+Number(answer)+'. '+reason+' Compare your setup with these values, then revise your calculation.';
 const step=answer.findIndex((v,i)=>v!==item.correct[i]);
 return 'Step '+(step+1)+' needs revision: you selected “'+item.parts[answer[step]]+'”. Begin this step with “'+item.parts[item.correct[step]]+'”. '+reason;
}
function practiceState(course,lesson,data){
 const progress=window.S?.progress?.[course];
 if(!progress||window.S.activeCourse!==course)return null;
 const drafts=progress.yourTurnPractice||(progress.yourTurnPractice={});
 const versions=drafts[lesson.id]||(drafts[lesson.id]={});
 // Content-keyed snapshots cannot restore old answers onto a different question set.
 const signature=JSON.stringify(data.items.map(({type,prompt,parts,correct,answer})=>({type,prompt,parts,correct,answer})));
 let state=versions[signature];
 if(!state||state.version!==1){state={version:1,index:0,answers:{},feedback:{},revealed:{},attempts:{},help:{}};versions[signature]=state;}
 for(const key of ['answers','feedback','revealed','attempts','help'])if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key]))state[key]={};
 state.index=Number.isInteger(state.index)&&state.index>=0&&state.index<data.items.length?state.index:0;
 data.items.forEach((item,i)=>{const a=state.answers[i];if(item.type==='sequence'&&(!Array.isArray(a)||a.some(v=>!Number.isInteger(v)||v<0||v>=item.parts.length)||new Set(a).size!==a.length)||item.type==='number'&&a!==undefined&&typeof a!=='string'){delete state.answers[i];delete state.feedback[i];delete state.revealed[i]}});
 return {state,progress};
}
function mount(panel,lesson,course){if(!panel)return;const data=itemsFor(course,lesson),count=data.items.length;
 let container=panel.querySelector('.mjtYourTurn');if(!container){container=document.createElement('section');container.className='mjtYourTurn';panel.prepend(container)}
 if(!count){container.innerHTML='<h3>Practice this lesson</h3><p>Lesson-specific questions are not ready yet. Add the lesson material to create accurate practice rather than unrelated questions.</p>';return}
 const owner=practiceState(course,lesson,data);if(!owner)return;
 const s=owner.state;
 const current=()=>window.S?.activeCourse===course&&window.S?.progress?.[course]===owner.progress;
 const persist=()=>{if(current())try{window.save?.()}catch(error){console.warn('Practice draft could not be saved',error)}};
 persist();
 const draw=()=>{
 const idx=Math.min(s.index,count-1),item=data.items[idx],saved=s.answers[idx],checked=s.feedback[idx],correct=s.revealed[idx];
 let body=item.type==='number'?'<label class="mjtAnswerLabel">Your calculated answer <input type="number" step="any" data-number value="'+E(saved??'')+'" placeholder="Enter your result"></label>':'<p>Select each action in the right order:</p><div class="mjtTiles">'+item.parts.map((part,i)=>'<button type="button" data-pick="'+i+'" '+((saved||[]).includes(i)?'disabled':'')+'>'+E(part)+'</button>').join('')+'</div><div class="mjtBuilt">Your sequence: '+(saved||[]).map(i=>E(item.parts[i])).join(' → ')+'</div><button type="button" data-undo '+((saved||[]).length?'':'disabled')+'>Undo last</button>';
 container.innerHTML='<div class="mjtHeader"><div><small>YOUR TURN · '+E(course)+' · '+E(data.key)+'</small><h3>Try '+count+' new '+(item.type==='number'?'calculations':'scenarios')+'</h3><p>'+E(data.objective)+'</p></div><span>Question '+(idx+1)+' of '+count+'</span></div><nav class="mjtQuestionTabs" aria-label="Practice questions">'+data.items.map((_,i)=>'<button type="button" data-q="'+i+'" '+(i===idx?'aria-current="step"':'')+'>'+(i+1)+(s.revealed[i]===true?' ✓':'')+'</button>').join('')+'</nav><div class="mjtQuestion"><p><b>'+E(item.prompt)+'</b></p>'+body+'</div><div class="mjtControls"><button type="button" data-check>'+(s.feedback[idx]&&s.revealed[idx]!==true?'Resubmit answer':'Check answer')+'</button><button type="button" data-next '+(idx===count-1?'disabled':'')+'>Next question →</button></div><details class="mjtHelp" '+(s.help[idx]?'open':'')+'><summary>Need help? See worked reasoning or reset</summary><p>'+E(lessonReason(item))+'</p><button type="button" data-clear>Clear answer</button></details>'+'<p class="mjtFeedback" role="status" '+(checked?'':'hidden')+'>'+E(checked||'')+'</p>'+'<p class="mjtFoot">New examples reinforce this lesson before the Scholar\'s Study Hall and the Enchanted Arcade. Guided answers are not independent mastery.</p>';
 const changed=()=>{
  s.feedback[idx]='';s.revealed[idx]=false;
  const feedback=container.querySelector('.mjtFeedback');feedback.textContent='';feedback.hidden=true;
  const tab=container.querySelector('[data-q="'+idx+'"]');tab.textContent=String(idx+1);
  container.querySelector('[data-check]').textContent='Check answer';
  persist();
 };
 container.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{if(!current())return;s.index=Number(b.dataset.q);persist();draw()});
 container.querySelector('[data-number]')?.addEventListener('input',e=>{if(!current())return;s.answers[idx]=e.target.value;changed()});
 container.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{if(!current())return;let arr=s.answers[idx]||[];const pick=Number(b.dataset.pick);if(arr.includes(pick))return;arr.push(pick);s.answers[idx]=arr;changed();draw();(container.querySelector('[data-pick]:not(:disabled)')||container.querySelector('[data-check]'))?.focus({preventScroll:true})});
 container.querySelector('[data-undo]')?.addEventListener('click',()=>{if(!current())return;s.answers[idx]?.pop();changed();draw();container.querySelector('[data-undo]')?.focus({preventScroll:true})});
 const help=container.querySelector('.mjtHelp');
 help.addEventListener('toggle',()=>{if(!current()||!help.isConnected)return;s.help[idx]=help.open;persist()});
 container.querySelector('[data-clear]').onclick=()=>{
  if(!current())return;
  s.answers[idx]=item.type==='number'?'':[];changed();draw();
  container.querySelector('[data-number], [data-pick]')?.focus({preventScroll:true});
 };
 container.querySelector('[data-check]').onclick=()=>{
  if(!current())return;
  const answer=s.answers[idx],field=container.querySelector('[data-number]');
  const complete=item.type==='number'?typeof answer==='string'&&answer.trim()!==''&&Number.isFinite(Number(answer))&&!field.validity.badInput:Array.isArray(answer)&&answer.length===item.correct.length;
  if(!complete){s.revealed[idx]=false;s.feedback[idx]=item.type==='number'?'Enter a valid numerical answer before checking. No attempt was recorded.':'Complete all actions in the sequence before checking. No attempt was recorded.';persist();draw();container.querySelector('[data-number], [data-pick]:not(:disabled)')?.focus({preventScroll:true});return;}
  const ok=item.type==='number'?Math.abs(Number(answer)-item.answer)<.00015:JSON.stringify(answer)===JSON.stringify(item.correct);
  s.revealed[idx]=ok;s.feedback[idx]=ok?'✓ Correct. '+cleanReason(item.why):teachFeedback(item,answer);
  const attempt=JSON.stringify([idx,item.type==='number'?Number(answer):answer]);
  if(!s.attempts[attempt]){
   // Mark before recording: the existing record owner calls save synchronously.
   s.attempts[attempt]=true;
   window.MajickLearningContinuity?.record?.({courseId:course,lessonTitle:lesson.title,term:data.key,correct:ok,activity:'your-turn'});
   if(ok)window.MajickInteractiveRewards?.award?.('yourturn-'+data.key+'-'+idx,'participation');
  }
  persist();draw();container.querySelector('[data-check]')?.focus({preventScroll:true});
 };
 container.querySelector('[data-next]').onclick=()=>{if(!current())return;s.index=Math.min(idx+1,count-1);persist();draw()};
 };
 draw();
}
const style=document.createElement('style');style.textContent='.mjtYourTurn{padding:17px;background:#302339;color:#fff1e7;border:1px solid #c4a475;border-radius:17px;margin:14px 0}.mjtHeader{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.mjtHeader h3{color:#f5d29b}.mjtQuestionTabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.mjtYourTurn button{background:#60476c;color:#fff2e8;border:1px solid #ab90af;border-radius:9px;padding:10px;cursor:pointer}.mjtYourTurn button[aria-current=step]{background:#a3799e;border:2px solid #f4d398}.mjtYourTurn button:focus-visible,.mjtYourTurn input:focus-visible{outline:3px solid #f5d594}.mjtYourTurn button:disabled{opacity:.55}.mjtTiles,.mjtControls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.mjtBuilt,.mjtReason,.mjtFeedback{background:#4b3854;border-left:3px solid #ecca83;padding:12px;margin:10px 0}.mjtQuestion{padding:8px 0}.mjtAnswerLabel{display:flex;flex-direction:column;gap:7px}.mjtAnswerLabel input{background:#fff9ed;color:#21182b;padding:12px;border-radius:8px;max-width:220px}.mjtFoot{font-size:.8rem;opacity:.85}.mjtYourTurn,.mjtYourTurn .mjtHeader,.mjtYourTurn .mjtQuestion,.mjtYourTurn .mjtHeader p,.mjtYourTurn .mjtHeader h3,.mjtYourTurn .mjtQuestion p,.mjtYourTurn .mjtQuestion b,.mjtYourTurn .mjtFoot{color:#fff3e2!important;opacity:1!important;text-shadow:none!important}.mjtYourTurn .mjtHeader h3{color:#f7d49b!important}.mjtYourTurn .mjtTiles button{color:#fff8ef!important;background:#684b76!important}.mjtYourTurn{isolation:isolate;opacity:1!important} .mjtHelp{margin:12px 0;padding:10px;border:1px solid #b89b72;border-radius:10px}.mjtHelp summary{cursor:pointer;font-weight:700}.mjtControls button[data-check]{background:#295e4b;color:#fff}.mjtYourTurn{max-height:none!important;overflow:visible!important}';document.head.append(style);
window.MajickYourTurn={mount,version:'1.2'};
})();