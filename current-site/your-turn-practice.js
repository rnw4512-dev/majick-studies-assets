(()=>{'use strict';if(window.MajickYourTurn)return;
const E=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
// This is the existing activity state, stored in the course save rather than
// a page-lifetime Map. Draft, submission and completion have different owners.
function questionId(item){
 const text=JSON.stringify([item.prompt,item.parts||[],item.answer??item.correct]);
 let hash=2166136261;for(const char of text)hash=Math.imul(hash^char.charCodeAt(0),16777619);
 return 'your-turn-'+(hash>>>0).toString(36);
}
function activityState(course,lesson){
 const progress=window.S?.progress?.[course];if(!progress)return null;
 const book=progress.yourTurnPractice||(progress.yourTurnPractice={});
 const s=book[lesson.id]||(book[lesson.id]={courseId:course,lessonId:lesson.id,mode:'guided',currentQuestionId:null,answers:{},feedback:{},revealed:{}});
 for(const key of ['answers','feedback','revealed','errors','submitted','completed','attempts','feedbackOpen','shown'])s[key]=s[key]||{};
 return s;
}
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
function keyFor(id,lesson){let s=String(lesson?.id||'').toLowerCase();let m=s.match(/(d772|d756)-s([123])-l([1-4])/);if(m)return m[0];let text=String(lesson?.title||'').toLowerCase();const tasks=window.MajickLessonActivities?.tasks||[];return tasks.find(t=>t.course===id&&(text.includes(String(t.title).toLowerCase())||String(t.title).toLowerCase().includes(text)))?.lessonId||''}
function itemsFor(course,lesson){const key=keyFor(course,lesson),task=window.MajickLessonActivities?.tasks?.find(t=>t.course===course&&t.lessonId===key);
 if(extras[key])return {key,items:extras[key].map(q=>({...q,type:'number'})),objective:task?.objective||String(lesson?.goal||lesson?.title||'')};
 if(!task)return {key,items:[],objective:lesson?.goal||''};
 return {key,items:task.cases.slice(0,3).map((q,i)=>({type:'sequence',prompt:q.prompt,parts:q.parts,correct:q.correct,why:q.reason,difficulty:i+1})),objective:task.objective};
}
function mount(panel,lesson,course){if(!panel)return;const data=itemsFor(course,lesson),count=data.items.length;
 let container=panel.querySelector('.mjtYourTurn');if(!container){container=document.createElement('section');container.className='mjtYourTurn';panel.prepend(container)}
 if(!count){container.innerHTML='<h3>Practice this lesson</h3><p>Lesson-specific questions are not ready yet. Add the lesson material to create accurate practice rather than unrelated questions.</p>';return}
 const s=activityState(course,lesson);if(!s)return;
 const ids=data.items.map(questionId);s.questionIds=ids;
 s.sessionId=s.sessionId||('your-turn:'+course+':'+lesson.id+':'+Date.now());
 container.__majickYourTurnState=s;
 if(!ids.includes(s.currentQuestionId))s.currentQuestionId=ids[0];
 const persist=()=>{s.updatedAt=Date.now();window.save?.()};
 const active=idx=>window.S?.activeCourse===course&&s.currentQuestionId===idx&&container.__majickYourTurnState===s&&container.isConnected;
 const move=pos=>{s.currentQuestionId=ids[pos];persist();draw();container.querySelector('.mjtQuestion')?.focus({preventScroll:true});container.scrollIntoView({block:'start',behavior:'instant'})};
 const repairQ=(item,idx)=>({id:idx,courseId:course,lessonId:data.key,prompt:item.prompt,answer:item.type==='number'?String(item.answer):item.correct.map(i=>item.parts[i]).join(' → '),why:item.why});
 const repairChoice=(item,idx)=>item.type==='number'?String(s.answers[idx]??''):(s.answers[idx]||[]).map(i=>item.parts[i]).join(' → ');
 const draw=()=>{
 const pos=ids.indexOf(s.currentQuestionId),idx=ids[pos],item=data.items[pos],saved=s.answers[idx],checked=s.feedback[idx],correct=s.revealed[idx];
 let body=item.type==='number'?'<label class="mjtAnswerLabel">Your calculated answer <input type="number" step="any" data-number value="'+E(saved??'')+'" placeholder="Enter your result"></label>':'<p>Select each action in the right order:</p><div class="mjtTiles">'+item.parts.map((part,i)=>'<button type="button" data-pick="'+i+'" '+((saved||[]).includes(i)?'disabled':'')+'>'+E(part)+'</button>').join('')+'</div><div class="mjtBuilt">Your sequence: '+(saved||[]).map(i=>E(item.parts[i])).join(' → ')+'</div><button type="button" data-undo '+((saved||[]).length?'':'disabled')+'>Undo last</button>';
 container.innerHTML='<div class="mjtHeader"><div><small>YOUR TURN · '+E(course)+' · '+E(data.key)+'</small><h3>Try '+count+' new '+(item.type==='number'?'calculations':'scenarios')+'</h3><p>'+E(data.objective)+'</p></div><span>Question '+(pos+1)+' of '+count+'</span></div><nav class="mjtQuestionTabs" aria-label="Practice questions">'+data.items.map((_,i)=>'<button type="button" data-q="'+i+'" '+(i===pos?'aria-current="step"':'')+'>'+(i+1)+(s.completed[ids[i]]===true?' ✓':'')+'</button>').join('')+'</nav><div class="mjtQuestion" tabindex="-1"><p><b>'+E(item.prompt)+'</b></p>'+body+'</div><div class="mjtControls"><button type="button" data-check>'+(s.feedback[idx]&&s.revealed[idx]!==true?'Resubmit answer':'Check answer')+'</button><button type="button" data-clear>Clear answer</button><button type="button" data-why>Show worked reasoning</button><button type="button" data-next '+(pos===count-1?'disabled title="This is the last question"':'')+'>Next question →</button></div>'+(checked?'<details class="mjtFeedback" data-status="'+(correct===true?'correct':s.errors[idx]?'incorrect':'draft')+'" '+(s.feedbackOpen[idx]!==false?'open':'')+'><summary>'+E(correct===true?'Correct':s.errors[idx]?'Incorrect — review and repair':'Response update')+'</summary><div class="mjtFeedbackBody" role="status">'+E(checked)+(correct===true?'<p>Your answer: '+E(String(s.submitted[idx]??''))+'</p><p>'+E(item.why)+'</p>':'')+'</div></details>':'')+(s.shown?.[idx]?'<p class="mjtReason">'+E(item.why)+'</p>':'')+'<p class="mjtFoot">New examples reinforce this lesson before Study Realm and Game Realm. Guided answers are not independent mastery.</p>';
 if(checked&&s.revealed[idx]===false&&s.errors?.[idx])container.querySelector('.mjtFeedbackBody').innerHTML=window.MajickQuestionRepair.html(repairQ(item,idx),repairChoice(item,idx));
 container.querySelector('.mjtFeedback')?.addEventListener('toggle',e=>{if(!e.target.isConnected)return;s.feedbackOpen[idx]=e.target.open;persist()});
 container.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{if(active(idx))move(Number(b.dataset.q))});
 container.querySelector('[data-number]')?.addEventListener('input',e=>{if(!active(idx))return;s.answers[idx]=e.target.value;s.feedback[idx]='';s.revealed[idx]=false;s.errors[idx]=false;container.querySelector('.mjtFeedback')?.remove();persist()});
 container.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{if(!active(idx))return;let arr=s.answers[idx]||[];arr.push(Number(b.dataset.pick));s.answers[idx]=arr;s.feedback[idx]='';s.revealed[idx]=false;s.errors[idx]=false;persist();draw()});
 container.querySelector('[data-undo]')?.addEventListener('click',()=>{if(!active(idx))return;s.answers[idx]?.pop();s.feedback[idx]='';s.revealed[idx]=false;s.errors[idx]=false;persist();draw()});
 container.querySelector('[data-clear]').onclick=()=>{
  if(!active(idx))return;
  s.answers[idx]=item.type==='number'?'':[];
  s.revealed[idx]=false;if(s.errors)s.errors[idx]=false;
  s.feedback[idx]='Answer cleared. Enter a different response, then resubmit.';
  persist();draw();
 };
 container.querySelector('[data-check]').onclick=()=>{
 if(!active(idx))return;
 const response=repairChoice(item,idx);
 if(s.submitted[idx]===response&&s.feedback[idx]&&s.revealed[idx]===true)return;
 s.submitted[idx]=response;s.feedbackOpen[idx]=true;s.attempts[idx]=(s.attempts[idx]||0)+1;
 let ok=item.type==='number'?s.answers[idx]!==''&&s.answers[idx]!==undefined&&Math.abs(Number(s.answers[idx])-item.answer)<.00015:JSON.stringify(s.answers[idx]||[])===JSON.stringify(item.correct);
 s.revealed[idx]=ok;s.feedback[idx]=ok?'✓ Correct. Explain the reasoning aloud, then try the next problem.':'Incorrect. Revisit the steps or values, then check again.';
 s.errors=s.errors||{};s.errors[idx]=!ok;
 if(!ok)window.MajickQuestionRepair.recordWrong(repairQ(item,idx),repairChoice(item,idx),{assisted:true,room:'your-turn'});
 if(!ok)window.MajickLearningContinuity?.record?.({courseId:course,lessonTitle:lesson.title,term:data.key,correct:false,activity:'your-turn'});
 else if(!s.completed[idx]){s.completed[idx]=true;window.MajickLearningContinuity?.record?.({courseId:course,lessonTitle:lesson.title,term:data.key,correct:true,activity:'your-turn'});window.MajickInteractiveRewards?.award?.('yourturn-'+data.key+'-'+pos,'participation')}
 persist();draw();
 };
 container.querySelector('[data-why]').onclick=()=>{if(!active(idx))return;s.shown=s.shown||{};s.shown[idx]=!s.shown[idx];persist();draw()};
 container.querySelector('[data-next]').onclick=()=>{if(active(idx))move(Math.min(pos+1,count-1))};
 };
 draw();
}
const style=document.createElement('style');style.textContent='.mjtYourTurn{scroll-margin-top:90px}.mjtFeedback summary{cursor:pointer;font-weight:700;padding:8px}.mjtFeedback[data-status=correct]{border-color:#8fd3a7;background:#234b39;color:#fff}.mjtFeedback[data-status=incorrect]{border-color:#efb0a5;background:#5c2e39;color:#fff}.mjtFeedbackBody{max-height:55vh;overflow:auto;padding:8px}.mjtQuestion:focus-visible{outline:3px solid #f5d594;outline-offset:4px}'+'.mjtYourTurn{padding:17px;background:#302339;color:#fff1e7;border:1px solid #c4a475;border-radius:17px;margin:14px 0}.mjtHeader{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.mjtHeader h3{color:#f5d29b}.mjtQuestionTabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.mjtYourTurn button{background:#60476c;color:#fff2e8;border:1px solid #ab90af;border-radius:9px;padding:10px;cursor:pointer}.mjtYourTurn button[aria-current=step]{background:#a3799e;border:2px solid #f4d398}.mjtYourTurn button:focus-visible,.mjtYourTurn input:focus-visible{outline:3px solid #f5d594}.mjtYourTurn button:disabled{opacity:.55}.mjtTiles,.mjtControls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.mjtBuilt,.mjtReason,.mjtFeedback{background:#4b3854;border-left:3px solid #ecca83;padding:12px;margin:10px 0}.mjtQuestion{padding:8px 0}.mjtAnswerLabel{display:flex;flex-direction:column;gap:7px}.mjtAnswerLabel input{background:#fff9ed;color:#21182b;padding:12px;border-radius:8px;max-width:220px}.mjtFoot{font-size:.8rem;opacity:.85}.mjtYourTurn,.mjtYourTurn .mjtHeader,.mjtYourTurn .mjtQuestion,.mjtYourTurn .mjtHeader p,.mjtYourTurn .mjtHeader h3,.mjtYourTurn .mjtQuestion p,.mjtYourTurn .mjtQuestion b,.mjtYourTurn .mjtFoot{color:#fff3e2!important;opacity:1!important;text-shadow:none!important}.mjtYourTurn .mjtHeader h3{color:#f7d49b!important}.mjtYourTurn .mjtTiles button{color:#fff8ef!important;background:#684b76!important}.mjtYourTurn{isolation:isolate;opacity:1!important}';document.head.append(style);
window.MajickYourTurn={mount,version:'1.0'};
})();