(()=>{
'use strict';
if(window.MajickCurriculumLab)return;
const safe=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TASKS=[
{id:'mean',course:'D772',lesson:'d772-s2-l4',section:2,title:'Mean: Construct a complete solution',levels:[
{values:[5,7,9,11],sum:32,count:4,result:8},
{values:[62,70,76,82,90],sum:380,count:5,result:76},
{values:[62,70,76,82,90],sum:380,count:6,result:88,missing:true,target:78}],goal:'Determine the mean by identifying the total and number of observations.',interpret:'The mean represents the total distributed equally among all observations.'},
{id:'median',course:'D772',lesson:'d772-s2-l4',section:2,title:'Median: Sort and solve',levels:[
{values:[8,2,5],sorted:'2,5,8',result:5},
{values:[12,4,17,9,7,13],sorted:'4,7,9,12,13,17',result:10.5},
{values:[3,8,8,10,14,2],sorted:'2,3,8,8,10,14',result:8}],goal:'Order values before finding the middle observation or averaging the two middle values.',interpret:'The median is the center of an ordered distribution and is resistant to extreme values.'},
{id:'histogram',course:'D772',lesson:'d772-s2-l2',section:2,title:'Histogram: Build the frequency distribution',levels:[
{target:[2,4,3],labels:['0–9','10–19','20–29']},
{target:[3,6,2,4],labels:['0–9','10–19','20–29','30–39']},
{target:[1,5,7,4,2],labels:['0–9','10–19','20–29','30–39','40–49']}],goal:'Match the frequencies of quantitative intervals and interpret the tallest bar.',interpret:'Histogram bars represent adjacent quantitative intervals; tallest bar is the modal interval.'},
{id:'probability',course:'D772',lesson:'d772-s3',section:3,title:'Probability: Track changing counts',levels:[
{green:3,other:2,p:0.3},
{green:5,other:3,p:5/14},
{green:7,other:5,p:7/22}],goal:'Determine the chance of two green draws without replacement.',interpret:'For dependent draws without replacement, update favorable and total outcomes before multiplying.'},
{id:'iep-goal',course:'D756',lesson:'d756-s3-l2',section:3,title:'Build a measurable annual goal',levels:[
{parts:['Given a reading passage','identify the main idea','8 of 10 opportunities'],answer:[0,1,2]},
{parts:['Across three weekly probes','identify the main idea','Given a reading passage'],answer:[2,1,0]},
{parts:['80% accuracy across three probes','Given grade-level passages','identify the main idea'],answer:[1,2,0]}],goal:'Order the condition, observable behavior, and measurable criterion.',interpret:'IEP goals connect documented needs to observable outcomes. These are invented practice examples.'},
{id:'family',course:'D756',lesson:'d756-s1-l2',section:1,title:'Responsive communication',levels:[
{prompt:'A caregiver feels unheard.',options:['Tell them the team already decided.','Ask what strategies work at home and listen.','Move to the next agenda item.'],correct:1},
{prompt:'Two team members disagree about a support.',options:['Summarize each concern and return to student evidence.','End the meeting.','Choose the louder speaker.'],correct:0},
{prompt:'A family needs an interpreter.',options:['Ask the student to interpret.','Proceed without interpretation.','Arrange meaningful language access.'],correct:2}],goal:'Choose responses that support shared decision-making and meaningful participation.',interpret:'Responsive collaboration starts with listening and respecting families as partners.'}
];
let uid=0;
function levelData(t,n){return t.levels[Math.max(0,Math.min(t.levels.length-1,n))]}
function hostFor(card,slot){let el=card.querySelector('.mjCurriculumLab');if(el)return el;el=document.createElement('section');el.className='mjCurriculumLab';el.setAttribute('aria-label','Interactive curriculum laboratory');el.dataset.uid=String(++uid);card.append(el);return el}
function choose(host){let cid=window.S?.activeCourse;let title=host.closest('.studyCard')?.querySelector('h3')?.textContent||'';let section=Number(title.match(/Section\s*([123])/i)?.[1]||0);
if(cid==='D756'){if(/PLAAFP|Goals/i.test(title))return TASKS[4];if(/Responsive/i.test(title))return TASKS[5];return TASKS[section===3?4:5]}
if(cid!=='D772')return null;
if(/probability|section 3/i.test(title))return TASKS[3];
if(/median/i.test(title))return TASKS[1];
if(/graph|histogram|display/i.test(title))return TASKS[2];
if(/statistic|mean|descriptive/i.test(title))return TASKS[0];
return TASKS[host.closest('.studyCard')?2:0];
}
function create(host){const task=choose(host);if(!task){host.remove();return}if(host.dataset.taskId!==task.id){host.dataset.taskId=task.id;host._lab={level:0,values:[],done:false,hint:false,stage:0,placed:[]}}let s=host._lab,t=levelData(task,s.level);
let main='';
if(task.id==='histogram'){const heights=s.values.length?s.values:[...t.target].map(()=>0);main='<div class="mjLabBars">'+t.target.map((v,i)=>'<div class="mjLabCol"><strong>'+safe(t.labels[i])+'</strong><div class="mjLabBarArea"><div class="mjLabBar" style="height:'+(Math.max(0,Math.min(10,heights[i]))*13)+'px"></div></div><input type="number" min="0" max="10" data-i="'+i+'" value="'+heights[i]+'" aria-label="Frequency '+safe(t.labels[i])+'"><div class="mjLabAdjust"><button data-change="'+i+'" data-delta="-1">−</button><button data-change="'+i+'" data-delta="1">+</button></div></div>').join('')+'</div><p>Construct the bars to match the target frequencies: '+t.target.join(', ')+' (left to right).</p>'}
else if(task.id==='iep-goal'){main='<p>Tap the phrase tiles in the correct order:</p><div class="mjLabPieces">'+t.parts.map((p,i)=>'<button data-pick="'+i+'" '+(s.placed.includes(i)?'disabled':'')+'>'+safe(p)+'</button>').join('')+'</div><p>Your goal: '+s.placed.map(i=>safe(t.parts[i])).join(' → ')+'</p><button data-undo>Undo last piece</button>'}
else if(task.id==='family'){main='<p>'+safe(t.prompt)+'</p>'+t.options.map((o,i)=>'<button class="mjLabOption" data-pick="'+i+'" aria-pressed="'+(s.placed[0]===i)+'">'+safe(o)+'</button>').join('')}
else{let values=task.id==='mean'?t.values:t.id==='median'?t.values:[t.green,t.other];main='<p>Given values: <strong>'+values.join(', ')+'</strong></p>';if(task.id==='mean')main+='<p>Formula: mean = total ÷ count'+(t.missing?'; required total = target mean × count':'')+'</p>';if(task.id==='probability')main+='<p>Formula: (green ÷ total) × (remaining green ÷ remaining total)</p>';const fields=task.id==='mean'?['Identify total','Identify count'+(t.missing?' including missing observation':''),'Calculate '+(t.missing?'missing score':'mean')]:task.id==='median'?['Sort values (comma-separated)','Calculate median']:['First green count','First total','Second green count','Second total','Final decimal probability'];main+='<div class="mjLabFields">'+fields.map((label,i)=>'<label>'+label+'<input data-i="'+i+'" '+(task.id==='median'&&i===0?'type="text"':'type="number" step="any"')+' value="'+safe(s.values[i]??'')+'"></label>').join('')+'</div>'}
host.innerHTML='<div class="mjLabHeader"><h3>✦ '+safe(task.title)+'</h3><span>Difficulty '+(s.level+1)+' / 3</span></div><p><strong>Objective:</strong> '+safe(task.goal)+'</p>'+main+'<div class="mjLabActions"><button data-check>Check my solution</button><button data-hint>Hint</button><button data-retry>Reset</button><button data-next>Next difficulty →</button></div>'+(s.hint?'<p class="mjLabNote">Hint: '+safe(task.interpret)+'</p>':'')+(s.done?'<div class="mjLabResult" role="status">'+(s.correct?'✓ Correct solution':'↻ Check the highlighted steps and try again')+'<p>'+safe(s.feedback||'')+'</p></div>':'')+'<p class="mjLabFine">Guided practice. No independent mastery or XP awarded.</p>';
const evaluate=()=>{let correct=false,feedback='';if(task.id==='histogram'){correct=t.target.every((v,i)=>Number(s.values[i]||0)===v);feedback='Target frequencies: '+t.target.join(', ')+'. '+task.interpret}
else if(task.id==='iep-goal'){correct=JSON.stringify(s.placed)===JSON.stringify(t.answer);feedback='Construct condition → behavior → criterion. '+task.interpret}
else if(task.id==='family'){correct=s.placed[0]===t.correct;feedback=task.interpret}
else if(task.id==='mean'){const ans=[t.sum,t.count,t.result];correct=ans.every((v,i)=>s.values[i]!==''&&Math.abs(Number(s.values[i])-v)<.0001);feedback='Expected: '+ans.join(', ')+'. '+(t.missing?'Target sum = 78 × 6 = 468; missing score = 468 − 380 = 88.':task.interpret)}
else if(task.id==='median'){correct=String(s.values[0]||'').replace(/\s/g,'')===t.sorted&&Math.abs(Number(s.values[1])-t.result)<.0001;feedback='Sorted: '+t.sorted+'; median = '+t.result+'.'}
else {let total=t.green+t.other;let ans=[t.green,total,t.green-1,total-1,t.p];correct=ans.every((v,i)=>s.values[i]!==''&&Math.abs(Number(s.values[i])-v)<.0002);feedback='First '+t.green+'/'+total+'; second '+(t.green-1)+'/'+(total-1)+'; answer '+t.p.toFixed(4)+'.'}
s.correct=correct;s.done=true;s.feedback=feedback;create(host)};
host.querySelectorAll('input[data-i]').forEach(input=>input.oninput=()=>{s.values[Number(input.dataset.i)]=input.value;s.done=false;if(task.id==='histogram')create(host)});
host.querySelectorAll('[data-change]').forEach(b=>b.onclick=()=>{let i=Number(b.dataset.change);s.values[i]=Math.max(0,Math.min(10,Number(s.values[i]??0)+Number(b.dataset.delta)));s.done=false;create(host)});
host.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{let i=Number(b.dataset.pick);if(task.id==='iep-goal'){if(!s.placed.includes(i))s.placed.push(i)}else s.placed=[i];s.done=false;create(host)});
host.querySelector('[data-undo]')?.addEventListener('click',()=>{s.placed.pop();create(host)});
host.querySelector('[data-check]').onclick=evaluate;
host.querySelector('[data-hint]').onclick=()=>{s.hint=true;create(host)};
host.querySelector('[data-retry]').onclick=()=>{host._lab={level:s.level,values:[],done:false,hint:false,placed:[]};create(host)};
host.querySelector('[data-next]').onclick=()=>{host._lab={level:(s.level+1)%3,values:[],done:false,hint:false,placed:[]};create(host)};
}
function mount(){let course=window.S?.activeCourse,screen=window.S?.screen,root=document.getElementById('content');if(!course||!root)return;
if(screen==='guide'){root.querySelectorAll('.studyCard').forEach(card=>{let shell=hostFor(card);if(shell.dataset.course!==course){shell.dataset.course=course;delete shell.dataset.taskId}create(shell)})}
if(screen==='mission'||screen==='games'){let region=root.querySelector('.sectionTitle')||root;if(!root.querySelector('.mjCurriculumLab')){let shell=document.createElement('section');shell.className='mjCurriculumLab';shell.dataset.course=course;region.after(shell);create(shell)}}}
const css='.mjCurriculumLab{background:#2c2038;color:#faecf0;border:1px solid #c7a86c;border-radius:16px;padding:16px;margin:18px 0}.mjLabHeader{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#f3d299}.mjLabHeader h3{color:inherit;margin:0}.mjLabFields{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px}.mjLabFields label{display:grid;gap:7px}.mjLabFields input,.mjLabCol input{padding:9px;width:100%;background:#fff8ee;color:#24182c;border-radius:8px}.mjCurriculumLab button{background:#695072;color:#fff6e5;border:1px solid #cba978;border-radius:9px;padding:9px;cursor:pointer}.mjCurriculumLab button:focus-visible,.mjCurriculumLab input:focus-visible{outline:3px solid #ffe2a1}.mjLabActions,.mjLabPieces{display:flex;flex-wrap:wrap;gap:8px;margin:15px 0}.mjLabBars{display:flex;align-items:end;gap:10px;overflow-x:auto;min-height:190px;padding:10px}.mjLabCol{flex:1;min-width:65px;text-align:center}.mjLabBarArea{height:136px;display:flex;align-items:end;justify-content:center}.mjLabBar{width:70%;background:linear-gradient(#eacb83,#9672b5)}.mjLabAdjust{display:flex;justify-content:center;gap:3px}.mjLabOption{display:block;width:100%;margin:8px 0;text-align:left}.mjLabResult,.mjLabNote{background:#4a3656;padding:12px;border-left:3px solid #efcc87}.mjLabFine{font-size:12px;opacity:.8}';let style=document.createElement('style');style.textContent=css;document.head.append(style);
let prior=window.render;if(typeof prior==='function')window.render=function(){let value=prior.apply(this,arguments);setTimeout(mount,40);return value};setTimeout(mount,400);window.MajickCurriculumLab={version:'1.0',refresh:mount,taskCount:TASKS.length};
})();