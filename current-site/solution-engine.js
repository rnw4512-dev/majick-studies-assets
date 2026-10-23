(()=>{
'use strict';
if(window.MajickSolutionEngine)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const BANK={
 D772:[
 {id:'mean',section:2,lesson:'d772-s2-l4',title:'Mean: rebuild the calculation',kind:'math',formula:'sum / count',alternatives:['sum / count','sum × count','count / sum'],cases:[
 {numbers:[8,12,16,20],known:'8, 12, 16, 20',unknown:'mean',slots:[56,4],answer:14,interpret:'The mean is 14, the equal-share value for these four observations.',why:'Add all values (56) and divide by four.'},
 {numbers:[11,17,23,29,35],known:'11, 17, 23, 29, 35',unknown:'mean',slots:[115,5],answer:23,interpret:'The five measurements have a mean of 23.',why:'The sum is 115 and there are five observations.'},
 {numbers:[9,13,17,21,25],known:'9, 13, 17, 21, 25',unknown:'mean',slots:[85,5],answer:17,interpret:'The mean is 17, representing the equal-share value of the five observations.',why:'The sum is 85 and there are five observations.'}
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
// Extend the existing task/case owner with new datasets and formula placement.
BANK.D772.push({id:'weighted-mean',section:2,lesson:'d772-s2-l4-1',title:'Weighted mean: combine unequal groups',kind:'math',formula:'(group total 1 + group total 2) / combined count',alternatives:['(group total 1 + group total 2) / combined count','(mean 1 + mean 2) / 2','group count / combined total'],slotLabels:['First group total','Second group total','Combined count'],cases:[
 {known:'20 trips average 60 minutes; 80 trips average 80 minutes',unknown:'combined mean',slots:[1200,6400,100],answer:76,interpret:'The combined mean trip time is 76 minutes.',why:'20 × 60 + 80 × 80 = 7600 total minutes; divide by 100 trips.'},
 {known:'30 orders average 12 dollars; 70 orders average 22 dollars',unknown:'combined mean',slots:[360,1540,100],answer:19,interpret:'The combined mean order value is 19 dollars.',why:'30 × 12 + 70 × 22 = 1900 dollars; divide by 100 orders.'},
 {known:'40 packages average 5 kilograms; 60 packages average 10 kilograms',unknown:'combined mean',slots:[200,600,100],answer:8,interpret:'The combined mean package mass is 8 kilograms.',why:'40 × 5 + 60 × 10 = 800 kilograms; divide by 100 packages.'}
]});
BANK.D772.find(t=>t.id==='histogram').cases.push({labels:['0–9','10–19','20–29','30–39'],freq:[3,4,5,2],mode:'20–29',total:14,rawData:[1,4,8,10,12,15,19,20,21,24,26,29,32,38],interpret:'The modal interval is 20–29 with 5 of 14 observations.'});
function probabilityTree(ex){
 const [g,n,,remaining]=ex.slots,other=n-g;
 const branch=(x1,y1,x2,y2,label)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#efd5ad"/><text x="'+((x1+x2)/2)+'" y="'+((y1+y2)/2-6)+'" fill="#fff3dd" font-size="12">'+label+'</text>';
 return '<figure class="majExamEvidence"><figcaption>Build a two-draw tree · without replacement. Follow the green → green path.</figcaption><svg viewBox="0 0 560 220" role="img" aria-label="First draw green '+g+'/'+n+' or other '+other+'/'+n+'. After green: green '+(g-1)+'/'+remaining+' or other '+other+'/'+remaining+'. After other: green '+g+'/'+remaining+' or other '+(other-1)+'/'+remaining+'.">'+branch(25,110,235,55,'G: '+g+'/'+n)+branch(25,110,235,170,'Other: '+other+'/'+n)+branch(235,55,525,22,'G: '+(g-1)+'/'+remaining)+branch(235,55,525,92,'Other: '+other+'/'+remaining)+branch(235,170,525,140,'G: '+g+'/'+remaining)+branch(235,170,525,210,'Other: '+(other-1)+'/'+remaining)+'</svg></figure>';
}
const STATES=new WeakMap();
// Preserve an in-progress six-stage response when the campus replaces its host.
// Keep separate records for each course/task; never touch saved course progress.
const ACTIVE_STATES=new Map();
function stageTitle(t,s){return t.kind==='math'?['Identify the knowns and unknown','Choose a formula','Place values into slots','Calculate your answer','Interpret your result','Independent transfer'][s]:t.kind==='graph'?['Read the target frequencies','Build the graph','Find the modal interval','Count total frequency','Explain the pattern','Independent graph challenge'][s]:['Read the scenario','Choose the first step','Arrange the full response','Explain your decision','Review your construction','Independent reconstruction'][s]}
const numeric=(a,b)=>a!==''&&a!=null&&Number.isFinite(Number(a))&&Math.abs(Number(a)-Number(b))<=Math.max(.0002,Math.abs(b)*.00005);
function knownsValid(task,ex,known,unknown){
 const text=String(known||'').toLowerCase(),need=String(unknown||'').toLowerCase();
 const expected=task.id.includes('mean')?/mean|average/:task.id==='median'?/median|middle/:/probab|chance|likelihood|p\(/;
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
function setup(host,task){if(host.dataset.engineTask!==task.id||host.dataset.engineCourse!==window.S.activeCourse){host.dataset.engineTask=task.id;host.dataset.engineCourse=window.S.activeCourse;STATES.set(host,ACTIVE_STATES.get(window.S.activeCourse+':'+task.id)||{stage:0,answers:{},caseIndex:0,feedback:'',error:false,hint:false,finished:false,verified:{0:[],1:[]}});ACTIVE_STATES.set(window.S.activeCourse+':'+task.id,STATES.get(host))}}
function render(host,task){const topBefore=host.isConnected?host.getBoundingClientRect().top:null;setup(host,task);const st=STATES.get(host),ex=task.cases[st.caseIndex],independent=st.caseIndex===task.cases.length-1,step=st.stage;let body='',a=st.answers;
const input=(id,label,placeholder='Your answer')=>'<label class="mjSeLabel">'+esc(label)+'<input data-field="'+id+'" value="'+esc(a[id]||'')+'" placeholder="'+esc(placeholder)+'" autocomplete="off"></label>';
if(task.kind==='math'){
 const known=ex.known||ex.numbers?.join(', ')||'';
 if(step===0)body='<p><b>Scenario:</b> '+esc(known)+'</p>'+input('known','Copy the known values or counts')+input('unknown','What are you finding?');
 if(step===1)body='<p>Choose the formula before substituting values.</p>'+task.alternatives.map((v,i)=>'<button data-choice="'+i+'" aria-pressed="'+(a.formula===v)+'">'+esc(v)+'</button>').join('');
 if(step===2)body='<p>Fill every formula slot. Select the correct numerators, denominators, or totals.</p><div class="mjSeGrid">'+ex.slots.map((v,i)=>'<label class="mjSeLabel">'+esc(task.slotLabels?.[i]||(task.id==='probability'?['First favorable','First total','Second favorable','Second total'][i]:'Formula slot '+(i+1)))+'<select data-field="slot'+i+'"><option value="">Choose a value</option>'+[...new Set([...ex.slots,0,1,...(ex.numbers||[])])].sort((a,b)=>a-b).map(n=>'<option value="'+n+'" '+(String(a['slot'+i])===String(n)?'selected':'')+'>'+n+'</option>').join('')+'</select></label>').join('')+'</div>';
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
if(task.id==='probability')body=probabilityTree(ex)+body;
const canHint=!independent;const taskPicker=host.querySelector('.mjSeTaskSelect');
const mixed=window.S?.screen==='reasoning';
host.innerHTML='<div class="mjSeHead"><strong>✦ Reasoning Workshop · Optional Parchment Practice</strong><small>'+esc(window.S.activeCourse)+' · '+esc(task.title)+'</small></div><nav class="mjSeSteps" aria-label="Solution steps">'+Array.from({length:6},(_,i)=>'<button type="button" data-stage="'+i+'" '+(i===step?'aria-current="step"':'')+' '+(i>step||!(st.verified?.[st.caseIndex]||[]).includes(i)?'disabled':'')+' class="'+(i===step?'active':'')+'" title="'+esc(stageTitle(task,i))+'">'+(i+1)+'</button>').join('')+'</nav><div class="mjSeStage"><h3>'+esc(stageTitle(task,step))+'</h3>'+body+'</div><div class="mjSeActions"><button type="button" data-check>'+(st.error?'Resubmit answer':'Check step')+'</button><button type="button" data-clear>Clear answer</button>'+(canHint?'<button data-hint>Hint</button>':'')+'<button data-reset>Restart scenario</button>'+(mixed?'<button type="button" data-mixed-next>Next mixed skill →</button>':'')+'</div>'+(st.hint?'<p class="mjSeHelp">Think about what information the situation provides and what you must determine before computing or acting.</p>':'')+(st.feedback?'<p class="mjSeFeedback" role="status">'+esc(st.feedback)+'</p>':'')+'<p class="mjSeFoot">Objective: '+esc(task.objective||'Apply this lesson concept')+'. Hands-on participation can earn XP. Completing an unassisted transfer can earn a one-time XP/crystal bonus. Neither replaces validated course mastery.</p>';
if(taskPicker&&!mixed)host.prepend(taskPicker);
if(mixed){const next=host.querySelector('[data-mixed-next]');if(next)next.onclick=()=>{const upcoming=nextMixed(host,true);if(upcoming)render(host,upcoming)}}
if(topBefore!==null&&host.isConnected){const delta=host.getBoundingClientRect().top-topBefore;if(Math.abs(delta)>2)window.scrollBy(0,delta)}
host.querySelectorAll('[data-stage]').forEach(button=>button.onclick=()=>{const dest=Number(button.dataset.stage);if(dest<st.stage&&(st.verified?.[st.caseIndex]||[]).includes(dest)){st.verified[st.caseIndex]=st.verified[st.caseIndex].filter(n=>n<dest);st.stage=dest;st.finished=false;st.feedback='Review this step, then check it again to continue.';render(host,task)}});
host.querySelectorAll('[data-field]').forEach(el=>{const capture=()=>{a[el.dataset.field]=el.value;st.feedback=''};el.oninput=capture;el.onchange=capture});
host.querySelectorAll('[data-bar]').forEach(el=>el.oninput=()=>{a['bar'+el.dataset.bar]=Math.max(0,Math.min(10,Number(el.value)));render(host,task)});
host.querySelectorAll('[data-delta]').forEach(el=>el.onclick=()=>{let i=el.dataset.i;a['bar'+i]=Math.max(0,Math.min(10,Number(a['bar'+i]||0)+Number(el.dataset.delta)));render(host,task)});
host.querySelectorAll('[data-focus]').forEach(el=>el.onclick=()=>{a.focus=el.textContent;render(host,task)});
host.querySelectorAll('[data-meaning]').forEach(el=>el.onclick=()=>{a.meaning=el.textContent;render(host,task)});
host.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{a.formula=task.alternatives[Number(el.dataset.choice)];render(host,task)});
host.querySelectorAll('[data-add]').forEach(el=>el.onclick=()=>{a.order=a.order||[];let n=Number(el.dataset.add);if(step===1)a.order=[n];else if(!a.order.includes(n))a.order.push(n);render(host,task)});
host.querySelector('[data-undo]')?.addEventListener('click',()=>{a.order?.pop();render(host,task)});
host.querySelector('[data-clear]').onclick=()=>{
 // Clear only this step's answer; keep earlier verified steps and scenario.
 if(task.kind==='sequence'){
  if(step===0)delete a.focus;
  else if(step===1||step===2||step===5)delete a.order;
  else delete a.meaning;
 }else if(task.kind==='graph'){
  if(step===0)delete a.identified;
  else if(step===1||step===5){for(let i=0;i<ex.freq.length;i++)delete a['bar'+i]}
  else if(step===2)delete a.mode;
  else if(step===3)delete a.total;
  else delete a.meaning;
 }else{
  const fields={0:['known','unknown'],1:['formula'],2:ex.slots.map((_,i)=>'slot'+i),3:['result'],4:['meaning'],5:['transfer']};
  for(const key of fields[step]||[])delete a[key];
 }
 st.feedback='Answer cleared. Choose a new response, then check again.';
 st.error=false;render(host,task);
};
host.querySelector('[data-reset]').onclick=()=>{const nextCase=(st.caseIndex+1)%task.cases.length;STATES.set(host,{stage:0,answers:{},caseIndex:nextCase,feedback:'New scenario selected. Practice the same WGU skill using different evidence.',error:false,hint:false,verified:{}});ACTIVE_STATES.set(window.S.activeCourse+':'+task.id,STATES.get(host));render(host,task)};
host.querySelector('[data-hint]')?.addEventListener('click',()=>{st.hint=true;render(host,task)});
host.querySelector('[data-check]').onclick=()=>{let good=false,reason='';
 if(task.kind==='math'){if(step===0)good=knownsValid(task,ex,a.known,a.unknown);else if(step===1)good=a.formula===task.formula;else if(step===2)good=ex.slots.every((v,i)=>numeric(a['slot'+i],v));else if(step===3||step===5)good=numeric(a[step===5?'transfer':'result'],ex.answer);else {const review=reasoningCheck(task,ex,a.meaning);good=review.ok;reason=review.feedback}if(step!==4)reason=ex.why}
 else if(task.kind==='graph'){if(step===0)good=numeric(a.identified,ex.freq.length);else if(step===1||step===5)good=ex.freq.every((v,i)=>numeric(a['bar'+i],v));else if(step===2)good=String(a.mode||'').trim()===ex.mode;else if(step===3)good=numeric(a.total,ex.total);else {const review=reasoningCheck(task,ex,a.meaning);good=review.ok;reason=review.feedback}if(step!==4)reason=ex.interpret}
 else{if(step===0){good=window.S.activeCourse==='D772'?String(a.focus||'')===(/surveys only|only reaches|only staff|only families|one school|evening event|downtown station|gym website|volunteer/i.test(ex.prompt||'')?'Selection bias':'Association is not causation'):!!a.focus}else if(step===3||step===4){const text=String(a.meaning||'');const scenario=String(ex.prompt||'');const causal=/observational|caused|causation|correlation|association/i.test(scenario),sampling=/surveys only|samples only|sample|population|one school|one homeroom|only staff|only families|only reaches|evening event|downtown station|gym website|volunteer|commuters at one/i.test(scenario);good=!!text&&(causal?/observational study can show association|evidence supports a cautious conclusion/i.test(text):sampling?/sampled group differ|selection bias and limit generalizability/i.test(text):window.S.activeCourse==='D756'&&/family and student input|document team decisions/i.test(text));reason=good?'The selected justification matches the evidence and the WGU concept.': 'Choose a justification that matches this specific study design or sampling limitation. Association alone does not establish causation.'}else if(step===1)good=a.order?.[0]===ex.correct[0];else good=JSON.stringify(a.order)===JSON.stringify(ex.correct);if(step!==3&&step!==4)reason=ex.reason}
 if(!good){st.error=true;if(independent)st.transferHintUsed=true;st.feedback=task.kind==='sequence'&&step===0&&window.S.activeCourse==='D772'?'Not yet. This scenario calls for recognizing selection bias or limits of observational inference. Identify the specific source of the problem before moving on.':((step===4|| (task.kind==='sequence'&&step===3))?reason:'Incorrect at step '+(step+1)+'. '+(reason||ex.why||ex.interpret||ex.reason||'Review the scenario and identify which evidence supports the answer.')+' Clear or revise your answer, then select Resubmit answer.');render(host,task);return}
 if(step===5){
  if(st.finished){st.feedback='This transfer has already been completed.';render(host,task);return}
  const full=[0,1,2,3,4].every(n=>(st.verified?.[st.caseIndex]||[]).includes(n));
  if(!full){st.feedback='Complete stages 1–5 on this scenario before stage 6.';render(host,task);return}
  if(!independent){st.caseIndex++;st.stage=0;st.answers={};st.hint=false;st.transferHintUsed=false;st.feedback='Guided reconstruction completed. Now try a different case; previous progress remains intact.';render(host,task);return}
  st.finished=true;
  const mastered=window.MajickInteractiveMastery?.record?.({taskId:task.id,lessonId:task.lesson,kind:task.kind,allStagesVerified:full,hintFreeTransfer:!st.transferHintUsed&&task.kind!=='sequence'});
  const reward=!st.transferHintUsed?window.MajickInteractiveRewards?.award?.(task.id,'transfer'):null;
  st.feedback='Transfer complete. '+(mastered?.recorded?'Independently verified calculation recorded. ':'Practice completed; mastery is not asserted. ')+reason+(st.transferHintUsed?' This was a corrected attempt; retry on a fresh independent case to earn unassisted transfer credit.':reward?.awarded?' Reward: +'+reward.xp+' XP and +'+reward.crystals+' crystal.':' Reward already earned.');
  render(host,task);return
}
 st.error=false;(st.verified[st.caseIndex]||(st.verified[st.caseIndex]=[])).push(step);
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
const SELECTED_TASK=new Map();
const MIXED_QUEUES=new Map();
function mixedQueue(cid){
 const tasks=(BANK[cid]||[]).filter(t=>t.cases?.length&&t.section);
 const groups=[...new Set(tasks.map(t=>t.section))].sort().map(section=>tasks.filter(t=>t.section===section));
 const deck=[];while(groups.some(g=>g.length))for(const group of groups)if(group.length)deck.push(group.shift().id);
 return deck;
}
function nextMixed(host,advance=false){
 const cid=window.S?.activeCourse||'D772',deck=mixedQueue(cid);
 if(!deck.length)return null;
 let state=MIXED_QUEUES.get(cid);
 if(!state||state.deck.join('|')!==deck.join('|'))state={deck,index:0};
 else if(advance)state.index=(state.index+1)%deck.length;
 MIXED_QUEUES.set(cid,state);
 const id=deck[state.index];host.dataset.selectedTask=id;SELECTED_TASK.set(cid,id);
 return (BANK[cid]||[]).find(t=>t.id===id)||null;
}

function mount(){const root=document.getElementById('content');if(!root)return;const screen=window.S?.screen,cid=window.S?.activeCourse;if(!['guide','mission','games','reasoning'].includes(screen))return;
 const all=BANK[cid]||[];
 let cards=screen==='guide'?[...root.querySelectorAll('.studyCard')]:screen==='reasoning'?[...root.querySelectorAll('.mjReasoningPage')]:[root];
 for(const card of cards){
  let host=screen==='reasoning'?card.querySelector('.mjReasoningActivity > .mjSolutionEngine'):card.querySelector(':scope > .mjSolutionEngine');
  if(!host){host=document.createElement('section');host.className='mjSolutionEngine';if(screen==='guide')card.append(host);else if(screen==='reasoning')(card.querySelector('.mjReasoningActivity')||card).append(host);else (root.querySelector('.sectionTitle')||root).after(host)}
  if(screen!=='guide'){
   const mixed=screen==='reasoning';
   let picker=host.querySelector('.mjSeTaskSelect'),picked=picker?.value||SELECTED_TASK.get(cid)||'';
   if(mixed){const task=nextMixed(host);if(task)render(host,task);else host.textContent='No mapped reasoning activities are available for this course.';continue}
   if(!picker){picker=document.createElement('select');picker.className='mjSeTaskSelect';picker.setAttribute('aria-label','Choose course lesson activity')}
   picker.innerHTML='<option value="">Choose lesson activity</option>'+all.filter(x=>x.lessonId||x.lesson).map(x=>'<option value="'+esc(x.id)+'">'+esc((x.lessonId||x.lesson)+' — '+x.title)+'</option>').join('');
   const need=window.MajickLearningContinuity?.recommend?.(cid);const target=need&&all.find(x=>x.lessonId===need.lessonId||x.lesson===need.lessonId);if(picked&&all.some(x=>x.id===picked))picker.value=picked;else if(target)picker.value=target.id;else if(all.length)picker.value=all.find(x=>x.lessonId)?.id||all[0].id;
   host.dataset.selectedTask=picker.value;
   if(picker.value)SELECTED_TASK.set(cid,picker.value);
   const task=choose(host);
   if(task)render(host,task);else host.textContent='No curriculum activities available for this course.';
   host.prepend(picker);picker.onchange=()=>{host.dataset.selectedTask=picker.value;if(picker.value)SELECTED_TASK.set(cid,picker.value);const choice=choose(host);if(choice)render(host,choice);else host.textContent='No mapped activity available.';host.prepend(picker)};
  }else{
   const task=choose(host);if(task)render(host,task);else host.remove();
  }
 }
}

function legacyReconstructionPlan(q){
 const skill=window.MajickLearningContinuity?.practiceSkill?.(q)||q.skill||'',d=q.data||{};
 const rules={
 'probability':'Update the favorable and total counts after removal, then multiply the first and second branch probabilities.',
 'weighted-mean':'Multiply each mean by its group count; divide the combined total by the combined count.',
 'mean':'Recover the total and divide by the observation count; use a target total for a missing value.',
 'median':'Order the observations and locate the middle; average the two middle values when needed.',
 'iqr-outlier':'Subtract Q1 from Q3, then compare the new value with Q3 + 1.5 × IQR.',
 'exactly-one-without-replacement':'Multiply conditional branch probabilities for each qualifying order, then add the orders.',
 'dependent-probability':'Update the favorable and total counts after removal, then multiply conditional probabilities.',
 'complement-multistage':'Find the probability of no successes across independent trials and subtract from one.',
 'conditional-denominator':'Restrict the denominator to the given group and count the qualifying overlap.',
 'expected-net-value':'Weight payouts by their probabilities, add them, then subtract the entry cost.',
 'expected-value':'Multiply each outcome value by its probability and add the weighted outcomes.',
 'sampling-generalization':'Compare the target population, sampling frame and actual respondents before generalizing.',
 'sampling':'Check how the sample was selected and who responded or was excluded.',
 'association-causation':'Distinguish assigned treatments from observations, then consider confounding and generalization.',
 'causation':'Check random assignment and confounding before making a causal claim.',
 'venn-sets':'Identify AND, OR or NOT and count only the corresponding outcomes.',
 'histogram':'Read interval boundaries and frequencies; compare heights and sum counts.',
 'boxplot':'Use the ordered five-number summary; IQR is Q3 minus Q1.',
 'scatterplot':'Describe the overall association and unusual points; a plot alone cannot establish causation.'
 };
 const rule=rules[skill]||'Use the stated statistical evidence and the requested event or quantity; avoid unsupported assumptions.';
 let fields=null;
 if(Array.isArray(d)&&d.length&&d.every(Number.isFinite)){
  const sorted=[...d].sort((a,b)=>a-b),mid=sorted.length/2;
  if(skill==='mean')fields=[{label:'Sum of observations',value:d.reduce((a,b)=>a+b,0)},{label:'Observation count',value:d.length}];
  if(skill==='median')fields=[{label:'Middle value (or left middle)',value:sorted[Math.floor((d.length-1)/2)]},{label:'Middle value (or right middle)',value:sorted[Math.floor(d.length/2)]}];
  if(skill==='probability')fields=[{label:'Initial total',value:d[0]+d[1]},{label:'Total after removal',value:d[0]+d[1]-1},{label:'Green remaining after green removed',value:d[0]-1}];
  if(skill==='histogram')fields=[{label:'Total frequency',value:d.reduce((a,b)=>a+b,0)},{label:'Highest frequency',value:Math.max(...d)}];
 }

 if(d.counts&&d.means)fields=[{label:'First group total',value:d.counts[0]*d.means[0]},{label:'Second group total',value:d.counts[1]*d.means[1]},{label:'Combined observation count',value:d.counts[0]+d.counts[1]}];
 if(skill==='iqr-outlier'&&d.values){const v=d.values;fields=[{label:'Q1 (median of lower half)',value:(v[1]+v[2])/2},{label:'Q3 (median of upper half)',value:(v[5]+v[6])/2},{label:'IQR',value:8}]}
 if(d.red&&d.blue)fields=[{label:'Initial total',value:d.red+d.blue},{label:'Total after first removal',value:d.red+d.blue-1},{label:'Number of orders giving exactly one red',value:2}];
 if(d.rate!=null)fields=[{label:'Probability of no detection in one trial',value:1-d.rate},{label:'Probability of no detection in all trials',value:(1-d.rate)**d.trials}];
 if(d.deliveryOnly!=null)fields=[{label:'Qualifying overlap (numerator)',value:d.both},{label:'Delivery users (conditional denominator)',value:d.both+d.deliveryOnly}];
 if(d.prize!=null)fields=[{label:'Probability of winning',value:1/d.sectors},{label:'Expected gross payout',value:d.prize/d.sectors},{label:'Cost to subtract',value:d.cost}];
 const options=(answer,wrong)=>[answer,...wrong].map((text,i)=>({text,order:(i+(String(q.id).length%4))%4})).sort((a,b)=>a.order-b.order).map(x=>x.text);
 const evidence='Use the observations, counts and study design stated in this scenario.';
 const setup='Apply the selected rule only to the stated evidence; distinguish the requested group or event from the whole population.';
 return [
 {title:'1 · Identify the evidence',text:q.prompt,answer:evidence,choices:options(evidence,['Treat the sample result as the exact population value.','Use the largest number and ignore the study design.','Assume missing observations are identical to the observed group.'])},
 {title:'2 · Choose the method',text:'Which method fits the requested statistical task?',answer:rule,choices:options(rule,['Always divide the smaller number by the larger, regardless of the event.','Add all probabilities even when the outcomes overlap.','Use the observed association as proof of a causal effect.'])},
 fields?{title:'3 · Place the values',text:'Rebuild each quantity from the original data. Decimal answers are accepted.',fields}:{title:'3 · Connect evidence to the rule',text:'Which setup avoids an unsupported assumption?',answer:setup,choices:options(setup,['Use a convenient denominator even if the question specifies a conditional group.','Ignore overlapping outcomes or excluded respondents.','Replace the reported observations with an assumed population result.'])},
 {title:'4 · Reconstruct the result',text:'Use the worked reasoning to check your result. '+q.why,answer:q.answer,choices:q.options||q.choices},
 {title:'5 · Interpret and verify',text:'Which explanation ties the result back to the scenario?',answer:q.why,choices:options(q.why,['The result guarantees the same outcome for each individual trial or person.','A larger number always establishes a causal relationship.','The calculation is valid even if the sample space or denominator is changed.'])}
 ];
}
// Versioned plans preserve paused legacy repairs; new repairs use two original scenarios.
function reconstructionPlan(q){
 const recovery=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
 if(recovery?.planVersion!==2)return legacyReconstructionPlan(q);
 let skill=String(window.MajickLearningContinuity?.practiceSkill?.(q)||q.skill||'').toLowerCase();
 const original=String(q.prompt||'').toLowerCase();
 if(/exactly one/.test(original)&&/independent/.test(original))skill='exactly-one-independent';
 else if(/at least one/.test(original)&&!/without replacement/.test(original))skill='complement-multistage';
 else if(/vertical axis|misleading/.test(original))skill='misleading-axis';
 const field=(label,value)=>({label,value});
 function example(second){
  const a=second?6:4,b=second?9:7,n=a+b;
  let prompt,formula,givens,work,result,interpret;
  if(skill==='exactly-one-independent'){
   const prob=second?.4:.2;prompt=`An independent spinner lands gold with probability ${prob}. Find the probability of exactly one gold in two spins.`;formula='P(exactly one gold) = p × (1−p) + (1−p) × p';givens=[field('p: gold probability',prob),field('1 − p: other probability',1-prob)];work=[field('P(gold then other)',prob*(1-prob)),field('P(other then gold)',(1-prob)*prob)];result=2*prob*(1-prob);interpret='Add the two qualifying orders; independence keeps each spin’s probability unchanged.';
  }else if(/weighted[- ]mean/.test(skill)){
   const c=second?8:5,d=second?12:15,x=second?30:20,y=second?50:40;
   prompt=`A workshop has ${c} learners averaging ${x} minutes of practice and ${d} learners averaging ${y} minutes. Find the combined mean practice time.`;
   formula='Combined mean = (n₁ × mean₁ + n₂ × mean₂) ÷ (n₁ + n₂)';givens=[field('n₁: first group count',c),field('mean₁: first group mean',x),field('n₂: second group count',d),field('mean₂: second group mean',y)];work=[field('n₁ × mean₁',c*x),field('n₂ × mean₂',d*y),field('n₁ + n₂',c+d)];result=(c*x+d*y)/(c+d);interpret='The combined mean weights each group by its number of learners.';
  }else if(/iqr|boxplot/.test(skill)){
   const lo=second?12:10,hi=second?20:16;
   prompt=`A practice-time distribution has Q1 = ${lo} minutes and Q3 = ${hi} minutes. Find the upper outlier fence.`;formula='IQR = Q3 − Q1; upper fence = Q3 + 1.5 × IQR';givens=[field('Q1',lo),field('Q3',hi),field('Fence multiplier',1.5)];work=[field('IQR = Q3 − Q1',hi-lo),field('1.5 × IQR',1.5*(hi-lo))];result=hi+1.5*(hi-lo);interpret='Only values strictly above this upper fence are high outliers under the 1.5 × IQR rule.';
  }else if(/exactly-one/.test(skill)){
   prompt=`A bag holds ${a} red and ${b} blue counters. Draw two without replacement. What is the probability of exactly one red?`;formula='P(exactly one red) = (R/N) × (B/(N−1)) + (B/N) × (R/(N−1))';givens=[field('R: red count',a),field('B: blue count',b),field('N: starting total',n),field('N − 1: second-draw total',n-1)];work=[field('P(red then blue)',a/n*b/(n-1)),field('P(blue then red)',b/n*a/(n-1))];result=2*a*b/(n*(n-1));interpret='The two qualifying orders are mutually exclusive, so add their branch probabilities.';
  }else if(/venn|intersection|union|not \/|complement and remainder/.test(skill)){
   const both=second?5:4,left=second?7:6,right=second?8:10,neither=second?10:5,total=both+left+right+neither;
   const intersection=/intersection|and \/|venn/.test(skill),outside=/not \/|remainder/.test(skill);
   prompt=`Of ${total} learners, ${left} attend art only, ${right} attend music only, ${both} attend both and ${neither} attend neither. Find the probability a learner ${intersection?'attends both':outside?'attends neither':'attends art or music (including both)'}.`;
   formula=intersection?'P(art AND music) = overlap ÷ total':outside?'P(neither) = neither count ÷ total':'P(art OR music) = (art only + music only + both) ÷ total';
   givens=[field('Art only',left),field('Music only',right),field('Both',both),field('Neither',neither)];work=[field('Total learners',total),field('Qualifying learners',intersection?both:outside?neither:left+right+both)];result=(intersection?both:outside?neither:left+right+both)/total;interpret='Count each learner in the requested event once, then divide by all learners.';
  }else if(/independence/.test(skill)){
   prompt=`Two independent spinners land green with probabilities ${second?'0.4 and 0.5':'0.2 and 0.6'}. Find the probability both land green.`;const x=second?.4:.2,y=second?.5:.6;formula='For independent events: P(A AND B) = P(A) × P(B)';givens=[field('P(A): first spinner',x),field('P(B): second spinner',y)];work=[field('P(B | A), unchanged because independent',y)];result=x*y;interpret='Independence means the first result does not change the probability of the second result.';
  }else if(/complement/.test(skill)){
   const rate=second?.3:.2,trials=second?2:3;
   prompt=`Each independent sensor detects a fault with probability ${rate}. With ${trials} sensors, find the probability at least one detects it.`;formula='P(at least one) = 1 − (1 − p)ⁿ';givens=[field('p: detection probability',rate),field('n: independent sensors',trials)];work=[field('1 − p: one sensor misses',1-rate),field('(1 − p)ⁿ: all sensors miss',(1-rate)**trials)];result=1-(1-rate)**trials;interpret='Subtracting the probability of no detections includes every outcome with one or more detections.';
  }else if(/conditional/.test(skill)){
   const both=second?18:12,only=second?12:28,total=second?90:100;
   prompt=`Of ${total} customers, ${both} use both pickup and delivery, and ${only} use delivery only. Given that a customer uses delivery, find the probability they also use pickup.`;formula='P(pickup | delivery) = count(both) ÷ count(delivery)';givens=[field('Count using both',both),field('Count using delivery only',only)];work=[field('Conditional denominator: both + delivery only',both+only)];result=both/(both+only);interpret='The denominator includes delivery users only; the full customer count is irrelevant to this condition.';
  }else if(/expected|interpret ev|compare decisions/.test(skill)){
   const sectors=second?8:10,prize=second?24:30,cost=second?4:5;
   prompt=`A fair spinner has ${sectors} equal sectors. One pays $${prize}; the others pay $0. A spin costs $${cost}. Find the expected net gain.`;formula='Expected net gain = Σ(probability × payout) − cost';givens=[field('Winning sectors',1),field('Total sectors',sectors),field('Winning payout ($)',prize),field('Cost ($)',cost)];work=[field('Probability of winning',1/sectors),field('Expected gross payout ($)',prize/sectors)];result=prize/sectors-cost;interpret='A negative expected net gain is a long-run average loss per play, not a guaranteed loss on every spin.';
  }else if(/probability/.test(skill)){
   prompt=`A bag contains ${a} green and ${b} purple counters. Draw two without replacement. Find the probability both are green.`;formula='P(two green) = (G/N) × ((G−1)/(N−1))';givens=[field('G: initial green count',a),field('N: initial total',n),field('G − 1: green after a green draw',a-1),field('N − 1: remaining total',n-1)];work=[field('First green probability',a/n),field('Second green probability given first green',(a-1)/(n-1))];result=a/n*(a-1)/(n-1);interpret='The first green draw removes a green counter and reduces the total before the second draw.';
  }else if(/median/.test(skill)){
   const v=second?[18,8,14,10,16,12]:[11,3,9,5,13,7],sorted=[...v].sort((x,y)=>x-y);
   prompt=`Practice times are ${v.join(', ')} minutes. Find the median.`;formula='For an even count: median = (left middle + right middle) ÷ 2';givens=sorted.map((x,i)=>field('Ordered value '+(i+1),x));work=[field('Left middle',sorted[2]),field('Right middle',sorted[3]),field('Sum of middle values',sorted[2]+sorted[3])];result=(sorted[2]+sorted[3])/2;interpret='Ordering the data locates the two central observations; averaging those gives the median.';
  }else if(/mean/.test(skill)){
   const v=second?[8,12,16,20]:[6,10,14,18];prompt=`Four students practiced for ${v.join(', ')} minutes. Find the mean practice time.`;formula='Mean = sum of observation values ÷ observation count';givens=v.map((x,i)=>field('Observation '+(i+1),x));work=[field('Sum of practice times',v.reduce((x,y)=>x+y,0)),field('Observation count',v.length)];result=v.reduce((x,y)=>x+y,0)/v.length;interpret='The mean redistributes the total practice time equally among the four students.';
  }else if(/histogram/.test(skill)){
   const v=second?[2,4,6]:[3,5,2];prompt=`A histogram of practice minutes has intervals 0–9, 10–19 and 20–29, with frequencies ${v.join(', ')}. What fraction of learners practiced at least 10 minutes?`;formula='Relative frequency = qualifying frequency ÷ total frequency';givens=v.map((x,i)=>field(['0–9 frequency','10–19 frequency','20–29 frequency'][i],x));work=[field('Qualifying frequency (last two bins)',v[1]+v[2]),field('Total frequency',v.reduce((x,y)=>x+y,0))];result=(v[1]+v[2])/v.reduce((x,y)=>x+y,0);interpret='Add the frequencies of qualifying bins and divide by all observations, rather than by the number of bins.';
  }else{
   if(/mutually exclusive|misleading-axis/.test(skill)){
    const exclusive=/mutually/.test(skill),answer=exclusive?(second?'These events are mutually exclusive: one roll cannot be both 2 and 5.':'These events overlap at 6, so they are not mutually exclusive.'):'The truncated axis exaggerates the visual difference; compare the actual values and the axis baseline.';
    const scenario=exclusive?(second?'Roll one six-sided die. Compare “roll 2” with “roll 5.”':'Roll one six-sided die. Compare “roll even” with “roll greater than 4.”'):(second?'A bar chart compares 72% and 76% with an axis starting at 71%.':'A bar chart compares 32% and 36% with an axis starting at 31%.');
    return [{title:'Read the similar scenario',text:scenario+' Strategy: '+(exclusive?'list outcomes and check for overlap.':'read the baseline before comparing heights.'),answer:answer,choices:[answer,'A larger-looking bar or event label proves the conclusion.']},{title:'Construct the evidence',text:scenario,fields:[field(exclusive?'Number of outcomes shared by the two events':'Actual difference in percentage points',exclusive?(second?0:1):4)]},{title:'Explain the check',text:scenario,answer:answer,choices:['Ignore overlap and axis labels.',answer]}];
   }
   const causal=/caus|scatter/.test(skill),random=second;
   prompt=causal?(random?'Researchers randomly assign 80 volunteers to two reading strategies and compare comprehension scores.':'A survey finds that students who choose extra reading practice have higher scores. Motivation was not controlled.'):(random?'A school randomly samples learners from every grade to estimate schoolwide study time.':'A school surveys only volunteers from its after-school math club to estimate study time for every learner.');
   const answer=causal?(random?'Random assignment supports a causal comparison for these volunteers; broader generalization needs sampling evidence.':'The study shows association; self-selection and motivation can confound a causal claim.'):(random?'Including every grade through random sampling supports a schoolwide estimate.':'Club volunteers may differ from other learners, so schoolwide generalization is limited.');
   return [{title:'Read the similar scenario',text:prompt,answer:causal?'Check assignment, confounding and sampling.':'Check the target population, sampling frame and selection.',choices:causal?['Check assignment, confounding and sampling.','Use a larger sample to prove causation.']:['Check the target population, sampling frame and selection.','Assume volunteers represent everyone.']},{title:'Build the evidence checklist',text:prompt+' Strategy: separate what was observed from what the design can support.',answer:answer,choices:[answer,'A large group guarantees an unbiased sample and proves causation.']},{title:'Hands-on strategy check',text:'Apply the design checklist to the scenario. '+prompt,answer:random?'The design includes random selection or assignment.':'Selection was voluntary; important differences can remain.',choices:['The design includes random selection or assignment.','Selection was voluntary; important differences can remain.']}];
  }
  return [
   {title:'Identify and place the numbers',text:prompt+'\nFormula: '+formula,fields:givens,hint:'Match each symbol or slot to the quantity it represents in the scenario. '+givens.map(f=>f.label+' = '+f.value).join('; ')},
   {title:'Work through the intermediate steps',text:prompt+'\nFormula: '+formula,fields:work,hint:work.map(f=>f.label+' = '+Number(f.value.toFixed(6))).join('; ')},
   {title:'Calculate the result',text:prompt+'\nFormula: '+formula+'\nUse your verified intermediate values. Choose the decimal result from the menu (displayed to six decimal places if needed).',fields:[field('Final result',result)],hint:'Use '+work.map(f=>f.label+' = '+Number(f.value.toFixed(6))).join('; ')+' in the formula. Final result: '+Number(result.toFixed(6))},
   {title:'Explain and check',text:prompt,answer:interpret,choices:[interpret,'Changing the denominator or ignoring the study conditions does not change the meaning.']}
  ];
 }
 return [false,true].flatMap(second=>example(second).map((step,i)=>({...step,title:(second?'Hands-on practice':'Guided example')+' · '+(i+1)+' · '+step.title})));
}
function reconstructionNumbers(plan,stage){
 const current=plan[stage],group=current.title.startsWith('Hands-on practice')?'Hands-on practice':current.title.startsWith('Guided example')?'Guided example':null;
 const steps=plan.slice(0,stage+1).filter(step=>!group||step.title.startsWith(group));
 const numbers=steps.flatMap(step=>[...(step.fields||[]).map(f=>f.value),...(step.text.split('Formula:')[0].match(/-?\d+(?:\.\d+)?/g)||[]).map(Number)]);
 return [...new Set(numbers.filter(Number.isFinite))].sort((a,b)=>a-b);
}
function mountReconstruction(host,q,onComplete){
 const api=window.MajickLearningContinuity,r=api?.practiceRecovery?.(q,false);if(!host||!r)return false;
 const plan=reconstructionPlan(q);
 if(!r.required){host.innerHTML='<p>Guided reconstruction saved. Independent mastery has not been awarded.</p>';const b=document.createElement('button');b.type='button';b.textContent='Continue to fresh independent practice';let continued=false;b.onclick=()=>{if(continued)return;continued=true;onComplete?.()};host.append(b);return true}
 const step=plan[r.stage];if(!step){host.textContent='This reconstruction cannot load. Your saved work is preserved.';return false}
 host.innerHTML='<h3>'+esc(step.title)+'</h3><p>Guided repair · '+r.stage+' of '+plan.length+' stages verified · no independent mastery credit</p><p>'+esc(step.text)+'</p><div data-reconstruction-fields></div><p role="status" data-reconstruction-status></p>';
 const form=host.querySelector('[data-reconstruction-fields]'),values=r.draft.values||[];
 if(step.hint){const help=document.createElement('details'),summary=document.createElement('summary'),body=document.createElement('p');summary.textContent='Show this step’s breakdown';body.textContent=step.hint;help.append(summary,body);form.before(help)}
 const persist=()=>{r.draft={values};try{window.save?.()}catch(_){}};
 if(step.fields){
  const numbers=reconstructionNumbers(plan,r.stage);
  const instruction=document.createElement('p');instruction.textContent='Choose a number for each formula slot. The menu includes the problem’s numbers and every value needed for this step.';form.append(instruction);
  step.fields.forEach((f,i)=>{
   const label=document.createElement('label');label.className='mjSeLabel';label.textContent=f.label;
   const input=document.createElement('select'),blank=document.createElement('option');blank.value='';blank.textContent='Choose a number…';input.append(blank);
   const options=[...new Set([...numbers,...(values[i]!=null&&String(values[i]).trim()!==''&&Number.isFinite(Number(values[i]))?[Number(values[i])]:[])])].sort((a,b)=>a-b);
   options.forEach(number=>{const option=document.createElement('option');option.value=String(number);option.textContent=String(Number(number.toFixed(6)));input.append(option)});
   input.value=values[i]??'';input.onchange=()=>{values[i]=input.value;persist()};label.append(input);form.append(label);
  });
 }
 else step.choices.forEach(choice=>{const label=document.createElement('label');label.className='majExamChoice';const input=document.createElement('input');input.type='radio';input.name='reconstruction-'+r.stage;input.checked=values[0]===choice;input.onchange=()=>{values[0]=choice;persist()};label.append(input,document.createTextNode(choice));form.append(label)});
 const check=document.createElement('button');check.type='button';check.textContent='Verify reconstruction step';const expectedStage=r.stage;check.onclick=()=>{if(r.stage!==expectedStage)return;const result=api.reconstructionCheck(q,values);if(result.ok)mountReconstruction(host,q,onComplete);else host.querySelector('[data-reconstruction-status]').textContent=result.message};host.append(check);return true;
}
function mountLesson(host,lessonId){
 if(!host||!lessonId)return false;
 const cid=window.S?.activeCourse||'D772',task=(BANK[cid]||[]).find(x=>(x.lessonId||x.lesson)===lessonId);
 if(!task){host.innerHTML='<p>There is not yet a mapped Reasoning Workshop for this lesson. Use the guided tasks and visual charts in the other tabs.</p>';return false}
 host.classList.add('mjSolutionEngine');render(host,task);return true;
}
let style=document.createElement('style');style.textContent='.mjSeStage{min-height:170px;color:#fff4e5!important}.mjSeStage p,.mjSeStage h3,.mjSeStage label,.mjSeStage strong{color:#fff4e5!important;opacity:1!important}.mjSeBank{display:flex;gap:8px;flex-wrap:wrap}.mjSeBank button{max-width:100%;text-align:left;line-height:1.4}.mjSeStage input,.mjSeLabel select{font-size:16px;min-height:44px}.mjSeOption.chosen,.mjSolutionEngine button[aria-pressed="true"]{background:#a7789e!important;border:2px solid #f4d494!important;box-shadow:0 0 0 2px #3b2843 inset}.mjSeSelection{color:#f6dbab;font-weight:700}.mjSeSteps button{min-width:36px;margin:2px}.mjSeSteps button[disabled]{opacity:.4;cursor:default}.mjSolutionEngine{background:#2b2139;border:1px solid #c4a673;color:#fff0eb;margin:16px 0;padding:16px;border-radius:16px}.mjSolutionEngine h3{color:#f0cf98}.mjSeHead{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.mjSeHead strong{color:#f2d095}.mjSeSteps{display:flex;gap:6px;margin:12px 0}.mjSeSteps span{padding:5px 10px;border:1px solid #947e95;border-radius:50%}.mjSeSteps .active{background:#9972aa}.mjSeLabel{display:flex;flex-direction:column;gap:5px;margin:9px 0}.mjSeLabel input,.mjSeLabel select,.mjSeBar input{background:#fff8ed;color:#1f1829;border-radius:7px;padding:10px;max-width:100%}.mjSeActions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.mjSolutionEngine button{background:#695277;color:#fff0da;border:1px solid #bfa17b;border-radius:8px;padding:9px;margin:4px;cursor:pointer}.mjSolutionEngine button:focus-visible,.mjSolutionEngine input:focus-visible,.mjSolutionEngine select:focus-visible{outline:3px solid #f7cf7d}.mjSeGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px}.mjSeGraph{display:flex;align-items:end;gap:10px;min-height:210px;overflow-x:auto}.mjSeBar{display:flex;flex-direction:column;align-items:center;min-width:85px}.mjSeTower{width:42px;background:linear-gradient(#f0cd84,#aa7dbe);min-height:3px}.mjSeBar input{width:72px}.mjSeFoot{font-size:12px;opacity:.8}.mjSeFeedback,.mjSeHelp{background:#493851;border-left:3px solid #f2cc88;padding:11px}';document.head.append(style);
const old=window.render;if(typeof old==='function')window.render=function(){let value=old.apply(this,arguments);setTimeout(mount,50);return value};setTimeout(mount,500);window.MajickSolutionEngine={version:'1.0',refresh:mount,mountLesson,mountReconstruction,reconstructionPlan,activities:Object.values(BANK).flat().length};
})();