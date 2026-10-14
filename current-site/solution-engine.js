(()=>{
'use strict';
if(window.MajickSolutionEngine)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const BANK={
 D772:[
 {id:'mean',section:2,lesson:'d772-s2-l4',title:'Mean: rebuild the calculation',kind:'math',formula:'sum / count',alternatives:['sum / count','sum × count','count / sum'],cases:[
 {numbers:[8,12,16,20],known:'8, 12, 16, 20',unknown:'mean',slots:[56,4],answer:14,interpret:'The mean is 14, the equal-share value for these four observations.',why:'Add all values (56) and divide by four.'},
 {numbers:[11,17,23,29,35],known:'11, 17, 23, 29, 35',unknown:'mean',slots:[115,5],answer:23,interpret:'The five measurements have a mean of 23.',why:'The sum is 115 and there are five observations.'}
 ]},
 {id:'median',section:2,lesson:'d772-s2-l4',title:'Median: solve the center',kind:'math',formula:'(middle A + middle B) / 2',alternatives:['(middle A + middle B) / 2','sum / count','largest − smallest'],cases:[
 {numbers:[3,7,11,19],known:'sorted values: 3, 7, 11, 19',unknown:'median',slots:[7,11],answer:9,interpret:'Half the ordered observations are at or below the median of 9.',why:'For four numbers average the two middle values.'},
 {numbers:[4,6,10,20,26,30],known:'sorted values: 4, 6, 10, 20, 26, 30',unknown:'median',slots:[10,20],answer:15,interpret:'The median is 15, midway between 10 and 20.',why:'Six values: use the third and fourth ordered values.'}
 ]},
 {id:'probability',section:3,lesson:'d772-s3-l1',title:'Probability: dependent draws',kind:'math',formula:'(first favorable / first total) × (second favorable / second total)',alternatives:['(first favorable / first total) × (second favorable / second total)','first favorable / first total','first favorable + second favorable'],cases:[
 {known:'5 green and 3 purple counters; draw two greens without replacement',unknown:'P(two greens)',slots:[5,8,4,7],answer:5/14,interpret:'About 35.7% of two-draw sequences produce two green counters.',why:'After one green is drawn, there are four green counters among seven total.'},
 {known:'4 green and 2 purple counters; draw two greens without replacement',unknown:'P(two greens)',slots:[4,6,3,5],answer:0.4,interpret:'There is a 40% probability of two greens without replacement.',why:'After the first green is removed, 3 of 5 remain green.'}
 ]},
 {id:'histogram',section:2,lesson:'d772-s2-l2',title:'Histogram: build and interpret',kind:'graph',cases:[
 {labels:['0–9','10–19','20–29'],freq:[2,5,3],mode:'10–19',total:10,interpret:'10–19 is the modal interval; the total frequency is 10.'},
 {labels:['0–9','10–19','20–29'],freq:[4,3,6],mode:'20–29',total:13,interpret:'20–29 is the modal interval; the total frequency is 13.'}
 ]}
 ],
 D756:[
 {id:'meeting',section:1,lesson:'d756-s1-l2',title:'Collaborative meeting response',kind:'sequence',cases:[
 {prompt:'A caregiver worries the team has ignored their observations.',parts:['Acknowledge the concern','Invite the caregiver to explain','Summarize and agree on next steps'],correct:[0,1,2],reason:'Acknowledge, seek information, then agree on actions.'},
 {prompt:'A colleague disagrees about an instructional support.',parts:['Listen to the different perspective','Review student evidence together','Record the agreed next step'],correct:[0,1,2],reason:'Start by understanding, examine evidence, and document the outcome.'}
 ]},
 {id:'goal',section:3,lesson:'d756-s3-l2',title:'Construct a measurable IEP goal',kind:'sequence',cases:[
 {prompt:'Construct a model measurable reading goal.',parts:['Given a grade-level passage','Identify the main idea','At least 8 of 10 times across three probes'],correct:[0,1,2],reason:'Condition, observable behavior, and measurable criterion.'},
 {prompt:'Construct a model writing goal.',parts:['Given a writing prompt','Write a complete paragraph','Include 4 of 5 rubric elements on three samples'],correct:[0,1,2],reason:'Specify conditions, behavior, and a measurable criterion.'}
 ]}
 ]
};
for(const task of window.MajickLessonActivities?.tasks||[]){if(BANK[task.course]&&!BANK[task.course].some(x=>x.id===task.id))BANK[task.course].push(task)}
BANK.D772.find(x=>x.id==='mean').cases.push({numbers:[9,13,17,21,25],known:'9, 13, 17, 21, 25',unknown:'mean',slots:[85,5],answer:17,interpret:'The mean is 17 across five measurements.',why:'Sum 85 divided by five.'});
BANK.D772.find(x=>x.id==='median').cases.push({numbers:[2,6,8,12,14,18],known:'sorted values: 2, 6, 8, 12, 14, 18',unknown:'median',slots:[8,12],answer:10,interpret:'The median is 10, between 8 and 12.',why:'Average the third and fourth values.'});
BANK.D772.find(x=>x.id==='probability').cases.push({known:'6 green and 4 purple counters; draw two greens without replacement',unknown:'P(two greens)',slots:[6,10,5,9],answer:1/3,interpret:'The probability of two greens is one-third.',why:'6/10 multiplied by 5/9 = 1/3.'});
BANK.D772.find(x=>x.id==='histogram').cases.push({labels:['0–9','10–19','20–29','30–39'],freq:[2,6,4,3],mode:'10–19',total:15,rawData:[2,8,10,11,12,15,16,19,20,22,25,29,30,34,38],interpret:'The modal interval is 10–19 (6 of 15 observations).'});
const STATES=new WeakMap();
function stageTitle(t,s){return t.kind==='math'?['Identify the knowns and unknown','Choose a formula','Place values into slots','Calculate your answer','Interpret your result','Independent transfer'][s]:t.kind==='graph'?['Read the target frequencies','Build the graph','Find the modal interval','Count total frequency','Explain the pattern','Independent graph challenge'][s]:['Read the scenario','Choose the first step','Arrange the full response','Explain your decision','Review your construction','Independent reconstruction'][s]}
const numeric=(a,b)=>a!==''&&a!=null&&Number.isFinite(Number(a))&&Math.abs(Number(a)-Number(b))<=Math.max(.0002,Math.abs(b)*.00005);
function knownsValid(task,ex,known,unknown){
 const text=String(known||'').toLowerCase(),need=String(unknown||'').toLowerCase();
 const expected=task.id==='mean'?/mean|average/:task.id==='median'?/median|middle/:/probab|chance|likelihood|p\(/;
 if(!expected.test(need))return false;
 const source=(ex.known||ex.numbers?.join(', ')||'').match(/\d+(?:\.\d+)?/g)||[];
 return source.length>0&&source.every(n=>new RegExp('(^|\\D)'+n.replace('.','\\.')+'(\\D|$)').test(text));
}
function reasoningCheck(task,ex,answer){
 const text=String(answer||'').toLowerCase().trim(),result=task.kind==='math'?ex.answer:ex.total;
 if(text.split(/\s+/).filter(Boolean).length<9)return {ok:false,feedback:'Give a complete explanation: state the answer, the relevant evidence, and why the method fits this situation.'};
 const hasNumber=new RegExp('(^|\\D)'+String(Number(result).toFixed(task.id==='probability'?2:0)).replace('.','\\.')+'(\\D|$)').test(text)||text.includes(String(Number(result)))||task.kind==='graph'&&text.includes(String(ex.total));
 if(!hasNumber)return {ok:false,feedback:'Include the actual calculated result or total from this specific problem.'};
 if(task.id==='mean'&&!(/divide|divided|sum|total|add|plus|\/|equal|share/.test(text)))return {ok:false,feedback:'Explain the calculation: add the observations and divide by the number of observations.'};
 if(task.id==='probability'&&!(/without|replacement|remain|second|first|draw|dependent/.test(text)))return {ok:false,feedback:'Describe why the second draw uses updated counts after the first.'};
 if(task.kind==='graph'&&!(/most|highest|tallest|modal|total|greater|fewer/.test(text)))return {ok:false,feedback:'Compare frequencies or identify the tallest bar and total.'};
 if(task.id==='mean'&&!/mean|average/.test(text))return {ok:false,feedback:'Identify the mean and explain how the total was divided by the number of observations.'};
 if(task.id==='median'&&!/median|middle/.test(text))return {ok:false,feedback:'Identify the median and describe the ordered middle values.'};
 if(task.id==='probability'&&!/probab|chance|likelihood|percent|%/.test(text))return {ok:false,feedback:'Interpret the result as a probability or chance in the context of the draws.'};
 if(task.kind==='graph'&&!/frequen|interval|bar|histogram|count/.test(text))return {ok:false,feedback:'Describe what the bar heights or frequency intervals represent.'};
 return {ok:true,feedback:'Your response identifies the result and relevant statistical context. This automated check is limited; compare your interpretation with the model.'};
}
function setup(host,task){if(host.dataset.engineTask!==task.id||host.dataset.engineCourse!==window.S.activeCourse){host.dataset.engineTask=task.id;host.dataset.engineCourse=window.S.activeCourse;STATES.set(host,{stage:0,answers:{},caseIndex:0,feedback:'',error:false,hint:false,finished:false,verified:{0:[],1:[]}})}}
function render(host,task){const topBefore=host.isConnected?host.getBoundingClientRect().top:null;setup(host,task);const st=STATES.get(host),ex=task.cases[st.caseIndex],independent=st.caseIndex===task.cases.length-1,step=st.stage;let body='',a=st.answers;
const input=(id,label,placeholder='Your answer')=>'<label class="mjSeLabel">'+esc(label)+'<input data-field="'+id+'" value="'+esc(a[id]||'')+'" placeholder="'+esc(placeholder)+'" autocomplete="off"></label>';
if(task.kind==='math'){
 const known=ex.known||ex.numbers?.join(', ')||'';
 if(step===0)body='<p><b>Scenario:</b> '+esc(known)+'</p>'+input('known','Copy the known values or counts')+input('unknown','What are you finding?');
 if(step===1)body='<p>Choose the formula before substituting values.</p>'+task.alternatives.map((v,i)=>'<button data-choice="'+i+'" aria-pressed="'+(a.formula===v)+'">'+esc(v)+'</button>').join('');
 if(step===2)body='<p>Fill every formula slot. Select the correct numerators, denominators, or totals.</p><div class="mjSeGrid">'+ex.slots.map((v,i)=>input('slot'+i,'Formula slot '+(i+1))).join('')+'</div>';
 if(step===3)body='<p>Calculate the result using your completed formula. Enter a number or decimal.</p>'+input('result','Calculated value');
 if(step===4)body='<p>Interpret the answer in the context of the original scenario.</p>'+input('meaning','What does your answer mean?','Write a sentence');
 if(step===5)body='<p>Now use different numbers with <b>no hints</b>. Start by identifying the values, then solve the new problem independently.</p><p>'+esc(known)+'</p>'+input('transfer','Final solution');
}
if(task.kind==='graph'){
 if(step===0)body='<p>'+(independent&&ex.rawData?'Raw observations: '+ex.rawData.join(', '):'Target frequencies: '+ex.labels.map((l,i)=>esc(l)+': '+ex.freq[i]).join(' · '))+'</p>'+input('identified','How many intervals are given?');
 if(step===1||step===5){body='<p>'+(independent&&ex.rawData?'Count the observations per interval.':'Use the buttons or number inputs to set bar heights accurately.')+'</p><div class="mjSeGraph">'+ex.labels.map((l,i)=>{let n=Number(a['bar'+i]??0);return '<div class="mjSeBar"><div class="mjSeTower" style="height:'+(Math.max(0,Math.min(10,n))*13)+'px"></div><small>'+esc(l)+'</small><input data-bar="'+i+'" type="number" min="0" max="10" value="'+n+'" aria-label="Frequency '+esc(l)+'"><div><button data-delta="-1" data-i="'+i+'">−</button><button data-delta="1" data-i="'+i+'">+</button></div></div>'}).join('')+'</div>'}
 if(step===2)body='<p>Which interval has the highest frequency?</p>'+input('mode','Modal interval');
 if(step===3)body=input('total','Total frequency');
 if(step===4)body=input('meaning','Describe the frequency distribution','Write a sentence');
}
if(task.kind==='sequence'){
 body='<p>'+esc(ex.prompt)+'</p>';let order=a.order||[];
 if(step===0){const bank=task.course==='D772'||window.S.activeCourse==='D772'?['Population of interest','Sample / sampling frame','Observational study','Association is not causation','Selection bias','Generalizability limitation']:['Family input','Student strengths and needs','Measurable annual goal','Team collaboration'];body+='<p>Select the academic concept that describes the issue. Use the WGU terminology bank.</p><div class="mjSeBank">'+bank.map((term,i)=>'<button type="button" data-focus="'+i+'" aria-pressed="'+(a.focus===term)+'">'+esc(term)+'</button>').join('')+'</div><p class="mjSeSelection">'+esc(a.focus||'Choose the concept that needs attention')+'</p>'}
 else if(step===1)body+='<p class="mjSeChoiceHelp">Choose the first action. Your selected answer will remain highlighted.</p>'+ex.parts.map((p,i)=>'<button type="button" data-add="'+i+'" aria-pressed="'+(order[0]===i)+'" class="mjSeOption '+(order[0]===i?'chosen':'')+'">'+esc(p)+'</button>').join('')+(order.length?'<p class="mjSeSelection" role="status">Selected: '+esc(ex.parts[order[0]])+'</p>':'');
 else if(step===2||step===5)body+='<p>'+(step===5?'Independent transfer: rebuild the reasoning sequence without hints. ':'')+'Tap each piece in the order you would use it.</p>'+ex.parts.map((p,i)=>'<button type="button" data-add="'+i+'" class="mjSeOption '+(order.includes(i)?'chosen':'')+'" aria-pressed="'+order.includes(i)+'" '+(order.includes(i)?'disabled':'')+'>'+esc(p)+'</button>').join('')+'<p>Built sequence: '+order.map(i=>esc(ex.parts[i])).join(' → ')+'</p><button data-undo>Undo</button>';
 else{const bank=window.S.activeCourse==='D772'?['The target population and sampled group differ, so representativeness must be evaluated.','An observational study can show association, but cannot by itself establish causation.','Convenience or voluntary sampling can introduce selection bias and limit generalizability.','The evidence supports a cautious conclusion, not a universal causal claim.']:['Use family and student input to select measurable, individualized supports.','Document team decisions and identify a measurable follow-up.'];body+='<p>Select the best WGU-aligned justification. The choice must match the scenario, not just sound academic.</p><div class="mjSeBank">'+bank.map((line,i)=>'<button type="button" data-meaning="'+i+'" aria-pressed="'+(a.meaning===line)+'">'+esc(line)+'</button>').join('')+'</div><p class="mjSeSelection">'+esc(a.meaning||'Choose a supported explanation')+'</p>'}
}
const canHint=!independent;const taskPicker=host.querySelector('.mjSeTaskSelect');
host.innerHTML='<div class="mjSeHead"><strong>✦ Reasoning Workshop · Optional Parchment Practice</strong><small>'+esc(window.S.activeCourse)+' · '+esc(task.title)+'</small></div><nav class="mjSeSteps" aria-label="Solution steps">'+Array.from({length:6},(_,i)=>'<button type="button" data-stage="'+i+'" '+(i===step?'aria-current="step"':'')+' '+(i>step||!(st.verified?.[st.caseIndex]||[]).includes(i)?'disabled':'')+' class="'+(i===step?'active':'')+'" title="'+esc(stageTitle(task,i))+'">'+(i+1)+'</button>').join('')+'</nav><div class="mjSeStage"><h3>'+esc(stageTitle(task,step))+'</h3>'+body+'</div><div class="mjSeActions"><button data-check>Check step</button>'+(canHint?'<button data-hint>Hint</button>':'')+'<button data-reset>Restart scenario</button></div>'+(st.hint?'<p class="mjSeHelp">Think about what information the situation provides and what you must determine before computing or acting.</p>':'')+(st.feedback?'<p class="mjSeFeedback" role="status">'+esc(st.feedback)+'</p>':'')+'<p class="mjSeFoot">Objective: '+esc(task.objective||'Apply this lesson concept')+'. Hands-on participation can earn XP. Completing an unassisted transfer can earn a one-time XP/crystal bonus. Neither replaces validated course mastery.</p>';
if(taskPicker)host.prepend(taskPicker);
if(topBefore!==null&&host.isConnected){const delta=host.getBoundingClientRect().top-topBefore;if(Math.abs(delta)>2)window.scrollBy(0,delta)}
host.querySelectorAll('[data-stage]').forEach(button=>button.onclick=()=>{const dest=Number(button.dataset.stage);if(dest<st.stage&&(st.verified?.[st.caseIndex]||[]).includes(dest)){st.verified[st.caseIndex]=st.verified[st.caseIndex].filter(n=>n<dest);st.stage=dest;st.finished=false;st.feedback='Review this step, then check it again to continue.';render(host,task)}});
host.querySelectorAll('[data-field]').forEach(el=>el.oninput=()=>{a[el.dataset.field]=el.value;st.feedback=''});
host.querySelectorAll('[data-bar]').forEach(el=>el.oninput=()=>{a['bar'+el.dataset.bar]=Math.max(0,Math.min(10,Number(el.value)));render(host,task)});
host.querySelectorAll('[data-delta]').forEach(el=>el.onclick=()=>{let i=el.dataset.i;a['bar'+i]=Math.max(0,Math.min(10,Number(a['bar'+i]||0)+Number(el.dataset.delta)));render(host,task)});
host.querySelectorAll('[data-focus]').forEach(el=>el.onclick=()=>{a.focus=el.textContent;render(host,task)});
host.querySelectorAll('[data-meaning]').forEach(el=>el.onclick=()=>{a.meaning=el.textContent;render(host,task)});
host.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{a.formula=task.alternatives[Number(el.dataset.choice)];render(host,task)});
host.querySelectorAll('[data-add]').forEach(el=>el.onclick=()=>{a.order=a.order||[];let n=Number(el.dataset.add);if(step===1)a.order=[n];else if(!a.order.includes(n))a.order.push(n);render(host,task)});
host.querySelector('[data-undo]')?.addEventListener('click',()=>{a.order?.pop();render(host,task)});
host.querySelector('[data-reset]').onclick=()=>{const nextCase=(st.caseIndex+1)%task.cases.length;STATES.set(host,{stage:0,answers:{},caseIndex:nextCase,feedback:'New scenario selected. Practice the same WGU skill using different evidence.',error:false,hint:false,verified:{}});render(host,task)};
host.querySelector('[data-hint]')?.addEventListener('click',()=>{st.hint=true;render(host,task)});
host.querySelector('[data-check]').onclick=()=>{let good=false,reason='';
 if(task.kind==='math'){if(step===0)good=knownsValid(task,ex,a.known,a.unknown);else if(step===1)good=a.formula===task.formula;else if(step===2)good=ex.slots.every((v,i)=>numeric(a['slot'+i],v));else if(step===3||step===5)good=numeric(a[step===5?'transfer':'result'],ex.answer);else {const review=reasoningCheck(task,ex,a.meaning);good=review.ok;reason=review.feedback}if(step!==4)reason=ex.why}
 else if(task.kind==='graph'){if(step===0)good=numeric(a.identified,ex.freq.length);else if(step===1||step===5)good=ex.freq.every((v,i)=>numeric(a['bar'+i],v));else if(step===2)good=String(a.mode||'').trim()===ex.mode;else if(step===3)good=numeric(a.total,ex.total);else {const review=reasoningCheck(task,ex,a.meaning);good=review.ok;reason=review.feedback}if(step!==4)reason=ex.interpret}
 else{if(step===0){good=window.S.activeCourse==='D772'?String(a.focus||'')===(/surveys only|only reaches|only staff|only families|one school|evening event|downtown station|gym website|volunteer/i.test(ex.prompt||'')?'Selection bias':'Association is not causation'):!!a.focus}else if(step===3||step===4){const text=String(a.meaning||'');const scenario=String(ex.prompt||'');const causal=/observational|caused|causation|correlation|association/i.test(scenario),sampling=/surveys only|samples only|sample|population|one school|one homeroom|only staff|volunteer/i.test(scenario);good=!!text&&(causal?/observational study can show association|evidence supports a cautious conclusion/i.test(text):sampling?/sampled group differ|selection bias and limit generalizability/i.test(text):window.S.activeCourse==='D756'&&/family and student input|document team decisions/i.test(text));reason=good?'The selected justification matches the evidence and the WGU concept.': 'Choose a justification that matches this specific study design or sampling limitation. Association alone does not establish causation.'}else if(step===1)good=a.order?.[0]===ex.correct[0];else good=JSON.stringify(a.order)===JSON.stringify(ex.correct);if(step!==3&&step!==4)reason=ex.reason}
 if(!good){st.feedback=task.kind==='sequence'&&step===0&&window.S.activeCourse==='D772'?'Not yet. This scenario calls for recognizing selection bias or limits of observational inference. Identify the specific source of the problem before moving on.':((step===4|| (task.kind==='sequence'&&step===3))?reason:'Not yet. Revisit this step and try again.');render(host,task);return}
 if(step===5){
  if(st.finished){st.feedback='This transfer has already been completed.';render(host,task);return}
  const full=[0,1,2,3,4].every(n=>(st.verified?.[st.caseIndex]||[]).includes(n));
  if(!full){st.feedback='Complete stages 1–5 on this scenario before stage 6.';render(host,task);return}
  if(!independent){st.caseIndex++;st.stage=0;st.answers={};st.hint=false;st.feedback='Guided reconstruction completed. Now try a different case; previous progress remains intact.';render(host,task);return}
  st.finished=true;
  const mastered=window.MajickInteractiveMastery?.record?.({taskId:task.id,lessonId:task.lesson,kind:task.kind,allStagesVerified:full,hintFreeTransfer:!st.transferHintUsed&&task.kind!=='sequence'});
  const reward=window.MajickInteractiveRewards?.award?.(task.id,'transfer');
  st.feedback='Transfer complete. '+(mastered?.recorded?'Independently verified calculation recorded. ':'Practice completed; mastery is not asserted. ')+reason+(reward?.awarded?' Reward: +'+reward.xp+' XP and +'+reward.crystals+' crystal.':' Reward already earned.');
  render(host,task);return
}
 (st.verified[st.caseIndex]||(st.verified[st.caseIndex]=[])).push(step);
 if(step===4){if(!independent&&task.kind!=='sequence'){st.caseIndex++;st.stage=0;st.answers={};st.hint=false;st.feedback='';render(host,task);return}st.stage=5;st.answers={};st.feedback='Stage 6 unlocked: rebuild the answer without copying the guided work. This is a practice check, not automatic mastery.';render(host,task);return}
 if(step===0&&!independent)window.MajickInteractiveRewards?.award?.(task.id,'participation');st.stage++;st.feedback='Step correct. '+(step===3?reason:'Continue to the next step.');render(host,task)
 };
}
const OBJECTIVES={
 D772:[
 {match:/section 2.*lesson 2|graphical displays|choosing graphical|histogram/i,task:'histogram',objective:'Build and interpret a frequency distribution using correctly labeled numerical intervals.'},
 {match:/section 2.*lesson 4|descriptive statistics|single-variable descriptive/i,task:'mean',objective:'Calculate and interpret a mean from observed values.'},
 {match:/section 3.*lesson 1|probability|independent.*dependent/i,task:'probability',objective:'Calculate dependent probabilities, accounting for outcomes removed.'}
 ],
 D756:[
 {match:/section 1.*lesson 2|responsive communication/i,task:'meeting',objective:'Respond to stakeholder concerns with listening, collaboration and documented next steps.'},
 {match:/section 3.*lesson 2|plaafp|annual goals/i,task:'goal',objective:'Construct a measurable annual goal from a stated condition, behavior and criterion.'}
 ]
};
function choose(host){
 const cid=window.S?.activeCourse,items=BANK[cid];if(!items?.length)return null;
 const card=host.closest('.studyCard'),title=card?.querySelector('h3')?.textContent||'';
 const selected=host.dataset.selectedTask;
 if(selected){const found=items.find(x=>x.id===selected);if(found)return found}
 if(!card)return items.find(t=>t.lessonId)||items[0];
 const numbered=title.match(/Section\\s*([123])[^\\n]*Lesson\\s*(\\d+)/i);
 if(numbered){const lesson=cid.toLowerCase()+'-s'+numbered[1]+'-l'+numbered[2];
 const exact=items.find(x=>x.lessonId===lesson);if(exact)return exact}
 const match=OBJECTIVES[cid]?.find(x=>x.match.test(title));
 if(match)return items.find(x=>x.id===match.task)||null;
 return null;
}

function rubric(task,ex,answer,stage){
 const response=String(answer||'').toLowerCase().trim();
 const tokens=response.split(/\s+/).filter(Boolean);
 if(tokens.length<7)return {ok:false,feedback:'Explain your reasoning in a complete sentence. State what the result means for the scenario, not just the number.'};
 const rules=task.kind==='math'
 ?[[/mean|average|median|middle|probab|chance|likely|percent|%/, 'Name the statistic or probability you calculated.'],[/\d|value|score|observation|counter|draw|data/, 'Connect your explanation to the numerical results or observations.']]
 :task.kind==='graph'
 ?[ [/interval|range|bar|frequency|distribution/, 'Identify the interval or frequency pattern you observed.'],[/highest|most|more|less|modal|total|count/, 'Explain what the bar heights show, such as highest frequency or total.']]
 :[ [/parent|family|caregiver|team|student|colleague|meeting|goal/, 'Identify the family, team or student need being addressed.'],[/listen|ask|invite|collaborat|respect|share|agree|support|measure|criterion|progress|communicat/, 'Explain the action and why it supports collaboration or a measurable goal.']];
 const missing=rules.filter(([pattern])=>!pattern.test(response)).map(([,message])=>message);
 if(missing.length)return {ok:false,feedback:'Your explanation needs stronger evidence: '+missing.join(' ')};
 return {ok:true,feedback:'Your explanation addresses the key ideas. This is rule-based guidance, not a teacher-graded semantic assessment; compare your explanation with the model reasoning: '+String(ex.interpret||ex.why||ex.reason||'')};
}
function mount(){const root=document.getElementById('content');if(!root)return;const screen=window.S?.screen,cid=window.S?.activeCourse;if(!['guide','mission','games'].includes(screen))return;
 const all=BANK[cid]||[];
 let cards=screen==='guide'?[...root.querySelectorAll('.studyCard')]:[root];
 for(const card of cards){
  let host=card.querySelector(':scope > .mjSolutionEngine');
  if(!host){host=document.createElement('section');host.className='mjSolutionEngine';if(screen==='guide')card.append(host);else (root.querySelector('.sectionTitle')||root).after(host)}
  if(screen!=='guide'){
   let picker=host.querySelector('.mjSeTaskSelect'),picked=picker?.value||'';
   if(!picker){picker=document.createElement('select');picker.className='mjSeTaskSelect';picker.setAttribute('aria-label','Choose course lesson activity')}
   picker.innerHTML='<option value="">Choose lesson activity</option>'+all.filter(x=>x.lessonId||x.lesson).map(x=>'<option value="'+esc(x.id)+'">'+esc((x.lessonId||x.lesson)+' — '+x.title)+'</option>').join('');
   const need=window.MajickLearningContinuity?.recommend?.(cid);const target=need&&all.find(x=>x.lessonId===need.lessonId||x.lesson===need.lessonId);if(picked&&all.some(x=>x.id===picked))picker.value=picked;else if(target)picker.value=target.id;else if(all.length)picker.value=all.find(x=>x.lessonId)?.id||all[0].id;
   host.dataset.selectedTask=picker.value;
   const task=choose(host);
   if(task)render(host,task);else host.textContent='No curriculum activities available for this course.';
   host.prepend(picker);picker.onchange=()=>{host.dataset.selectedTask=picker.value;const choice=choose(host);if(choice)render(host,choice);else host.textContent='No mapped activity available.';host.prepend(picker)};
  }else{
   const task=choose(host);if(task)render(host,task);else host.remove();
  }
 }
}

function mountLesson(host,lessonId){
 if(!host||!lessonId)return false;
 const cid=window.S?.activeCourse||'D772',task=(BANK[cid]||[]).find(x=>(x.lessonId||x.lesson)===lessonId);
 if(!task){host.innerHTML='<p>There is not yet a mapped Reasoning Workshop for this lesson. Use the guided tasks and visual charts in the other tabs.</p>';return false}
 host.classList.add('mjSolutionEngine');render(host,task);return true;
}
let style=document.createElement('style');style.textContent='.mjSeStage{min-height:170px;color:#fff4e5!important}.mjSeStage p,.mjSeStage h3,.mjSeStage label,.mjSeStage strong{color:#fff4e5!important;opacity:1!important}.mjSeBank{display:flex;gap:8px;flex-wrap:wrap}.mjSeBank button{max-width:100%;text-align:left;line-height:1.4}.mjSeStage input{font-size:16px}.mjSeOption.chosen,.mjSolutionEngine button[aria-pressed="true"]{background:#a7789e!important;border:2px solid #f4d494!important;box-shadow:0 0 0 2px #3b2843 inset}.mjSeSelection{color:#f6dbab;font-weight:700}.mjSeSteps button{min-width:36px;margin:2px}.mjSeSteps button[disabled]{opacity:.4;cursor:default}.mjSolutionEngine{background:#2b2139;border:1px solid #c4a673;color:#fff0eb;margin:16px 0;padding:16px;border-radius:16px}.mjSolutionEngine h3{color:#f0cf98}.mjSeHead{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.mjSeHead strong{color:#f2d095}.mjSeSteps{display:flex;gap:6px;margin:12px 0}.mjSeSteps span{padding:5px 10px;border:1px solid #947e95;border-radius:50%}.mjSeSteps .active{background:#9972aa}.mjSeLabel{display:flex;flex-direction:column;gap:5px;margin:9px 0}.mjSeLabel input,.mjSeBar input{background:#fff8ed;color:#1f1829;border-radius:7px;padding:10px;max-width:100%}.mjSeActions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.mjSolutionEngine button{background:#695277;color:#fff0da;border:1px solid #bfa17b;border-radius:8px;padding:9px;margin:4px;cursor:pointer}.mjSolutionEngine button:focus-visible,.mjSolutionEngine input:focus-visible{outline:3px solid #f7cf7d}.mjSeGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px}.mjSeGraph{display:flex;align-items:end;gap:10px;min-height:210px;overflow-x:auto}.mjSeBar{display:flex;flex-direction:column;align-items:center;min-width:85px}.mjSeTower{width:42px;background:linear-gradient(#f0cd84,#aa7dbe);min-height:3px}.mjSeBar input{width:72px}.mjSeFoot{font-size:12px;opacity:.8}.mjSeFeedback,.mjSeHelp{background:#493851;border-left:3px solid #f2cc88;padding:11px}';document.head.append(style);
const old=window.render;if(typeof old==='function')window.render=function(){let value=old.apply(this,arguments);setTimeout(mount,50);return value};setTimeout(mount,500);window.MajickSolutionEngine={version:'1.0',refresh:mount,mountLesson,activities:Object.values(BANK).flat().length};
})();