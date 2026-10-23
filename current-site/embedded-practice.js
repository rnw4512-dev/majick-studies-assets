(()=>{
'use strict';
if(window.MajickEmbeddedPractice)return;
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const D756=[
 {id:'team',section:1,prompt:'A family describes useful communication supports at home. Whose perspective should the IEP team actively invite?',options:['The parent or caregiver','Only the principal','Only the special education teacher'],answer:'The parent or caregiver',why:'Families contribute vital knowledge of the student across settings.'},
 {id:'listen',section:1,prompt:'A parent says their concerns have been dismissed. Which response best opens a collaborative conversation?',options:['We have already decided.','Tell me what has been working at home so we can consider it together.','We cannot discuss that here.'],answer:'Tell me what has been working at home so we can consider it together.',why:'Open questions and respectful listening build shared understanding.'},
 {id:'culture',section:2,prompt:'A family requests an interpreter for an IEP meeting. What is the most responsive next step?',options:['Provide meaningful language access through appropriate interpretation.','Ask the student to interpret.','Continue without interpretation.'],answer:'Provide meaningful language access through appropriate interpretation.',why:'Families need meaningful access to participate in educational decisions.'},
 {id:'goal',section:3,prompt:'Which fictional IEP goal is measurable?',options:['Will improve reading.','Will try harder in class.','Given a passage, identifies 8 of 10 main ideas across three weekly probes.'],answer:'Given a passage, identifies 8 of 10 main ideas across three weekly probes.',why:'A measurable goal describes conditions, observable skill, criterion, and how progress is checked.'}
];
const FORMULAS=[
{id:'mean',section:2,title:'Mean workbench',prompt:'Scores: 62, 70, 76, 82, 90. Complete each part of mean = sum / count.',labels:['Sum of scores','Number of scores','Mean'],answers:[380,5,76],why:'62 + 70 + 76 + 82 + 90 = 380. The count is 5, so 380 / 5 = 76.'},
{id:'median',section:2,title:'Median workbench',prompt:'Sorted values: 4, 7, 9, 12, 13, 17. Find both middle values and their average.',labels:['Left middle','Right middle','Median'],answers:[9,12,10.5],why:'Six values means take positions 3 and 4: (9 + 12) / 2 = 10.5.'},
{id:'probability',section:3,title:'Probability workbench',prompt:'Five green and three purple counters: two greens without replacement. Enter the fractions and final decimal.',labels:['First green','First total','Second green','Second total','Probability'],answers:[5,8,4,7,0.3571],why:'(5/8) × (4/7) = 5/14, about 0.3571. Without replacement the second draw has 7 counters and 4 green.'}
];
let state=new Map(),courseId='';
function persist(){const p=window.S?.progress?.[window.S.activeCourse];if(p){p.embeddedGuided=Object.fromEntries(state);try{window.save?.()}catch(_){}}}
function formulaActivity(section,offset){
 const serial=window.MajickLearningContinuity?.nextGuidedSequence?.('embedded-formula');if(!serial)return null;
 const k=serial+10;
 if(section===3){const g=3+k,p=2+2*k,n=g+p,answers=[g,n,g-1,n-1,g/n*(g-1)/(n-1)];return {kind:'formula',item:{id:'probability-'+serial,prompt:g+' green and '+p+' purple counters: draw two greens without replacement. Formula: (first green / first total) × (second green / second total).',labels:FORMULAS[2].labels,answers,why:'('+g+'/'+n+') × ('+(g-1)+'/'+(n-1)+') = '+Number(answers[4].toFixed(6))+'. Both favorable and total counts change after removing a green.'}}}
 const median=offset%2===1,values=(median?[2,6,8,12,16,20]:[3,7,11,15,19]).map(n=>n+k),sum=values.reduce((a,b)=>a+b,0),answers=median?[values[2],values[3],(values[2]+values[3])/2]:[sum,values.length,sum/values.length];return {kind:'formula',item:{id:(median?'median-':'mean-')+serial,prompt:'Values: '+values.join(', ')+'. Formula: '+(median?'median = (left middle + right middle) / 2.':'mean = sum / count.'),labels:FORMULAS[median?1:0].labels,answers,why:median?'Average the third and fourth ordered values: '+answers[0]+' and '+answers[1]+'.':'Add the values to get '+sum+'; divide by '+values.length+'.'}};
}

function questions(){
 const cid=window.S?.activeCourse,c=window.S?.courses?.[cid]||{};
 const b=[...(Array.isArray(c.questionBank)?c.questionBank:[]),...(cid==='D772'?(window.MajickD772SharedQuestions?.practiceQuestions?.()||window.MajickD772SharedQuestions?.questions||[]):[])];
 const seen=new Set();
 return b.map(q=>{let options=q.options||q.choices||[],ans=typeof q.answer==='number'?options[q.answer]:q.answer;return {...q,id:String(q.id||q.prompt),section:String(q.section||''),prompt:String(q.prompt||q.question||''),options,answer:ans,why:String(q.why||q.rationale||q.explanation||'Review the lesson explanation.')}}).filter(q=>{if(!q.prompt||q.options.length<(cid==='D772'?4:2)||q.answer===undefined||(window.MajickVisualEvidence&&!window.MajickVisualEvidence.evidence(q).ok)||!q.options.includes(q.answer)||seen.has(q.id))return false;seen.add(q.id);return true});
}
function unusedChoice(pool){
 const p=window.S?.progress?.[window.S.activeCourse];if(!p)return null;
 const used=p.embeddedGuidedUsed||(p.embeddedGuidedUsed=[]),signature=q=>JSON.stringify([q.prompt,q.data||q.visual||q.visualHtml||null]);
 const item=pool.find(q=>!used.includes(signature(q)));if(!item)return null;used.push(signature(item));try{window.save?.()}catch(_){}return {kind:'choice',item};
}
function selectActivity(section,offset=0){
 const cid=window.S?.activeCourse;
 if(cid==='D772'&&section===2)return formulaActivity(section,offset);
 if(cid==='D772'&&section===3)return formulaActivity(section,offset);
 if(cid==='D756'){let pool=D756.filter(q=>!section||q.section===section);return unusedChoice(pool)}
 const bank=questions();let scoped=section?bank.filter(q=>new RegExp('Section\\s*'+section+'\\b','i').test(q.section)||new RegExp('-s'+section+'-').test(q.id)):bank;
 if(!scoped.length)scoped=bank;
 return unusedChoice(scoped);
}
function sectionOf(card){const cid=window.S?.activeCourse,txt=card?.querySelector('h3')?.textContent||'';const match=txt.match(/Section\s*([123])/i);if(match)return Number(match[1]);if(cid==='D772'){let a=txt.match(/s([123])-l/);if(a)return Number(a[1])}return null}
function renderActivity(container,key,section,variant){
 const st=state.get(key)||{offset:0,values:[],choice:-1,checked:false,hint:false};state.set(key,st);
 const a=st.activity||(st.activity=selectActivity(section,st.offset));persist();
 const heading=variant==='game'?'✦ Play this challenge':variant==='study'?'✦ Solve it yourself':'✦ Your turn';
 if(!a){container.innerHTML='<div class="mjActiveTitle">'+heading+'</div><p>No unused verified example is available here. Your work is saved. Choose another activity; completed questions will not silently repeat.</p>';return}
 let item=a.item,correct=false,feedback='';
 if(a.kind==='formula'){
  correct=item.answers.every((n,i)=>st.values[i]!==''&&st.values[i]!==undefined&&Math.abs(Number(st.values[i])-n)<0.00015);
  feedback=item.labels.map((l,i)=>E(l)+': '+(st.values[i]!==''&&st.values[i]!==undefined&&Math.abs(Number(st.values[i])-item.answers[i])<0.00015?'✓':'Try again')).join(' · ');
 }else{correct=st.choice>=0&&String(item.options[st.choice])===String(item.answer);feedback=correct?'Correct choice!':'Compare the responses and try another approach.'}
 const evidence=a.kind==='choice'?window.MajickVisualEvidence?.evidence(item):null;
 let body=a.kind==='formula'?'<div class="mjFields">'+item.labels.map((label,i)=>'<label>'+E(label)+'<select data-value="'+i+'"><option value="">Choose a number…</option>'+[...new Set([...item.answers,...(item.prompt.match(/\d+(?:\.\d+)?/g)||[]).map(Number)])].sort((a,b)=>a-b).map(n=>'<option value="'+n+'" '+(String(st.values[i])===String(n)?'selected':'')+'>'+Number(n.toFixed(6))+'</option>').join('')+'</select></label>').join('')+'</div>':'<div class="mjOptions">'+item.options.map((v,i)=>'<button type="button" data-choice="'+i+'" aria-pressed="'+(st.choice===i)+'">'+E(typeof v==='string'?v:v?.text||String(v))+'</button>').join('')+'</div>';
 container.innerHTML='<div class="mjActiveTitle">'+heading+' <small>'+E(window.S.activeCourse)+' · '+(a.kind==='formula'?'Build the formula':'Make a decision')+'</small></div><p class="mjPrompt">'+E(evidence?.prompt||item.prompt)+'</p>'+(evidence?.html||'')+body+'<div class="mjActions"><button type="button" data-check>Check my work</button><button type="button" data-hint>Hint</button><button type="button" data-reset>Retry</button><button type="button" data-next>New example →</button></div>'+(st.hint?'<p class="mjHint">Hint: '+E(a.kind==='formula'?'Start by identifying the known quantities and what changes between steps.':'Find the response that directly addresses the question and includes the other person in the process.')+'</p>':'')+(st.checked?'<div role="status" class="mjFeedback"><b>'+(correct?'✓ Well done':'↻ Keep working')+'</b><p>'+feedback+'</p><details><summary>Explain why / worked steps</summary><p>'+E(item.why)+'</p></details></div>':'')+'<p class="mjSmall">Guided practice only · independent mastery and saved XP are not changed</p>';
 container.querySelectorAll('[data-value]').forEach(input=>input.onchange=()=>{st.values[Number(input.dataset.value)]=input.value;st.checked=false;persist()});
 container.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{st.choice=Number(b.dataset.choice);st.checked=false;renderActivity(container,key,section,variant)});
 container.querySelector('[data-check]').onclick=()=>{if(a.kind==='choice'&&window.MajickVisualEvidence&&!window.MajickVisualEvidence.evidence(item).ok){st.checked=false;return}st.checked=true;renderActivity(container,key,section,variant)};
 container.querySelector('[data-hint]').onclick=()=>{st.hint=true;renderActivity(container,key,section,variant)};
 container.querySelector('[data-reset]').onclick=()=>{state.set(key,{offset:st.offset,activity:st.activity,values:[],choice:-1,checked:false,hint:false});renderActivity(container,key,section,variant)};
 container.querySelector('[data-next]').onclick=()=>{state.set(key,{offset:st.offset+1,values:[],choice:-1,checked:false,hint:false});renderActivity(container,key,section,variant)}
}
function create(key,section,variant){const c=document.createElement('section');c.className='mjEmbeddedPractice';c.dataset.interactiveKey=key;c.setAttribute('aria-label','Interactive guided practice');renderActivity(c,key,section,variant);return c}
function mount(){const c=document.getElementById('content'),cid=window.S?.activeCourse,screen=window.S?.screen;if(!c||!cid)return;
 if(cid!==courseId){courseId=cid;state=new Map(Object.entries(window.S?.progress?.[cid]?.embeddedGuided||{}))}
 if(screen==='guide'){const cards=[...c.querySelectorAll('.studyCard')];cards.forEach((card,i)=>{if(card.querySelector('.mjEmbeddedPractice'))return;card.append(create(cid+'-guide-'+i,sectionOf(card),'learn'))})}
 if(screen==='mission'&&c.querySelector('.sectionTitle')&&!c.querySelector('.mjEmbeddedPractice')){let insert=create(cid+'-study',null,'study');c.querySelector('.sectionTitle').after(insert)}
 if(screen==='games'&&!c.querySelector('.mjEmbeddedPractice')){let insert=create(cid+'-game',null,'game');c.prepend(insert)}
}
const css='.mjEmbeddedPractice{background:linear-gradient(135deg,#30243d,#46304b);color:#f9eef3;border:1px solid #c5a56d;border-radius:17px;padding:20px;margin:16px 0;clear:both}.mjActiveTitle{font-weight:800;color:#f7d69e;font-size:1.1rem}.mjActiveTitle small{margin-left:10px;color:#e9d4d9;font-size:.76rem}.mjPrompt{line-height:1.55;font-weight:600}.mjOptions,.mjFields{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:13px 0}.mjFields label{display:flex;flex-direction:column;gap:7px}.mjFields input,.mjFields select{background:#fffaed;color:#23182a;padding:11px;border:2px solid #ceb987;border-radius:8px;width:100%}.mjEmbeddedPractice button{color:#fff7ee;background:#694e72;border:1px solid #aa8c9d;border-radius:9px;padding:10px 12px;cursor:pointer}.mjEmbeddedPractice button[aria-pressed=true]{background:#93678c;border-color:#fbd69b;border-width:2px}.mjEmbeddedPractice button:focus-visible,.mjFields input:focus-visible,.mjFields select:focus-visible{outline:3px solid #ffe39f;outline-offset:2px}.mjActions{display:flex;gap:9px;flex-wrap:wrap}.mjHint,.mjFeedback{background:#4d3d58;padding:12px;border-left:3px solid #f1d49b;border-radius:6px}.mjSmall{font-size:.78rem;opacity:.9;margin-bottom:0}@media(max-width:650px){.mjEmbeddedPractice{padding:14px}.mjOptions,.mjFields{grid-template-columns:1fr}}';
const style=document.createElement('style');style.textContent=css;document.head.append(style);
const prior=window.render;if(typeof prior==='function')window.render=function(){const result=prior.apply(this,arguments);setTimeout(mount,0);return result};
setTimeout(mount,400);
window.MajickEmbeddedPractice={version:'1.0',refresh:mount,activities:{D756:D756.length,D772:FORMULAS.length}};
})();