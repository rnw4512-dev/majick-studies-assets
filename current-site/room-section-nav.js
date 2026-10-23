/* Compact navigation for rooms other than Home. No academic DOM is moved or hidden. */
(()=>{'use strict';if(window.MajickRoomSections)return;
// No arbitrary section cap: every substantial room panel remains reachable.
const ROOM_NAMES={reasoning:'Reasoning Workshop',mission:'Study Now',learninglab:'Learn Lab',games:'Game Realm',journal:'My Journal',grimoire:'Grimoire',companions:'Companions',livinggrimoire:'Grimoire',guide:'Study Guide',vault:'Magic Vault',analytics:'Analytics',addmaterial:'Notes Forge'};
// Preserve every academic renderer and form. The nonacademic rooms use one
// visible section at a time; academic rooms keep their non-destructive jumps.
const TABBED_ROOMS=new Set(['reasoning','mission','learninglab','games','journal','grimoire','livinggrimoire','companions','guide','vault','analytics','addmaterial']);
const selections=new Map();
let pending=false,updating=false;
function refresh(){
 if(updating)return;updating=true;
 try{
  const root=document.getElementById('content');
  const room=window.S?.screen;
  const old=document.getElementById('majickRoomSections');
  if(!root||!room||room==='home'||!ROOM_NAMES[room]){old?.remove();return}
  // Tabs only change visibility: activity nodes, answers, and academic renderers
  // stay mounted in their original positions.
  // A panel is eligible when it has meaningful content. Do not turn tiny
  // toolbars, Back buttons, or floating rewards into empty tabs.
  const nodes=[...root.children].filter(el=>
   el!==old&&!el.hidden&&!el.matches('nav,#majReasoningToolbar,.majReasoningToolbar,.mjReasoningPage')&&
   el.matches('section,article,div,main')&&
   (el.classList.contains('majRoomInactive')||el.scrollHeight>180)&&
   (el.querySelector('h2,h3,[role="heading"],[aria-label],input,button,select,textarea')||el.textContent.trim().length>140));
  const rows=nodes.map((el,i)=>{
   const h=el.querySelector('h2,h3,[role="heading"]');
   const heading=h?.textContent?.replace(/\\s+/g,' ').trim();
   const label=(heading||el.getAttribute('aria-label')||el.dataset.tabLabel||
     (el.classList.contains('mjSolutionEngine')?'Reasoning practice':'Activity '+(i+1))).slice(0,52);
   return {el,label,i};
  });
  if(rows.length<2){old?.remove();nodes.forEach(el=>{el.classList.remove('majRoomInactive','majRoomActive');el.removeAttribute('inert')});return}
  let nav=old;
  if(!nav){nav=document.createElement('nav');nav.id='majickRoomSections';nav.className='majickRoomSections';nav.setAttribute('aria-label','Jump to page section');root.prepend(nav)}
  const tabbed=TABBED_ROOMS.has(room);
  const key=room+':'+(window.S?.activeCourse||'');
  const current=selections.get(key)||0;
  const active=Math.min(current,rows.length-1);
  selections.set(key,active);
  if(tabbed){
   rows.forEach(({el},i)=>{
    el.classList.toggle('majRoomInactive',i!==active);
    el.classList.toggle('majRoomActive',i===active);
    el.dataset.majRoomPanel=String(i);
    if(i!==active)el.setAttribute('inert','');else el.removeAttribute('inert');
   });
  }else{
   nodes.forEach(el=>{el.classList.remove('majRoomInactive','majRoomActive');el.removeAttribute('inert');delete el.dataset.majRoomPanel});
  }
  const signature=room+':'+(window.S?.activeCourse||'')+':'+rows.map(x=>x.label).join('|')+':'+tabbed;
  if(nav.dataset.signature===signature){
   if(tabbed)nav.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===active));b.classList.toggle('majRoomSelected',i===active)});
   return;
  }
  nav.dataset.signature=signature;
  nav.setAttribute('aria-label',tabbed?'Page sections (one at a time)':'Jump to page section');
  nav.replaceChildren();
  const title=document.createElement('strong');title.textContent=tabbed?'Explore this room':'On this page';nav.append(title);
  rows.forEach(({el,label},i)=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;
   button.setAttribute('aria-label',(tabbed?'Show ':'Jump to ')+label);
   if(tabbed){
    button.setAttribute('aria-controls',el.id||(el.id='majRoomPanel-'+room+'-'+i));
    el.setAttribute('role','tabpanel');
    button.setAttribute('aria-pressed',String(i===active));
    button.classList.toggle('majRoomSelected',i===active);
    button.onclick=()=>{
     selections.set(key,i);
     rows.forEach(({el:panel},j)=>{panel.classList.toggle('majRoomInactive',j!==i);panel.classList.toggle('majRoomActive',j===i);if(j!==i)panel.setAttribute('inert','');else panel.removeAttribute('inert')});
     nav.querySelectorAll('button').forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===i));b.classList.toggle('majRoomSelected',j===i)});
     nav.scrollIntoView({block:'start',behavior:'instant'});
    };
   }else button.onclick=()=>el.scrollIntoView({block:'start',behavior:'instant'});
   nav.append(button);
  });
 }finally{updating=false}
}
function schedule(){if(pending)return;pending=true;setTimeout(()=>{pending=false;refresh()},85)}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('room-section-shortcuts',schedule,97);
document.addEventListener('DOMContentLoaded',()=>{schedule()});
// Reasoning Workshop is its own Study Realm destination. It shares the
// Solution Engine and course data, but never mounts Study Hall content.
const examState=new Map();
function examQuestions(){
 const banks=[window.MajickD772SharedQuestions?.questions||[],window.MajickD772PreassessmentDeepPractice?.questions||[]];
 const ids=new Set();
 return banks.flat().filter(q=>{
  const choices=q.options||q.choices||[];
  const lesson=String(q.lessonId||'');
  const section=Number(String(q.section||'').match(/Section\\s*([123])/i)?.[1]||lesson.match(/d772-s([123])-/)?.[1]);
  if(!section||choices.length!==4||!choices.includes(q.answer)||ids.has(q.id)||!q.why||!q.prompt)return false;
  ids.add(q.id);return true;
 }).map(q=>({...q,examSection:Number(String(q.section||'').match(/Section\\s*([123])/i)?.[1]||String(q.lessonId).match(/d772-s([123])-/)?.[1])}));
}
// Schedule only unseen evidence for the missed skill; never recycle a failed item.
function queueExamFollowup(state,question){
 const remaining=state.deck.slice(state.index+1);
 const matches=q=>q.id!==question.id&&(question.skill?q.skill===question.skill:q.lessonId===question.lessonId);
 const offset=remaining.findIndex(matches);
 if(offset<0)return false;
 const [fresh]=state.deck.splice(state.index+1+offset,1);
 state.deck.splice(state.index+1,0,fresh);
 state.followupId=fresh.id;
 return true;
}
function examDeck(){
 const by=[1,2,3].map(n=>examQuestions().filter(q=>q.examSection===n));
 by.forEach(group=>{for(let i=group.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[group[i],group[j]]=[group[j],group[i]]}});
 const deck=[];while(by.some(g=>g.length))for(const group of by)if(group.length)deck.push(group.shift());
 return deck;
}
function renderMixedExam(panel){
 if(!panel)return;
 let state=examState.get('D772');
 if(!state){state={deck:examDeck(),index:0,selected:'',submitted:false,correct:0,attempted:0};examState.set('D772',state)}
 const q=state.deck[state.index];
 panel.replaceChildren();
 if(!q){panel.textContent='No valid mixed-section questions are currently available.';return}
 const heading=document.createElement('div');heading.className='majExamTop';
 const count=document.createElement('strong');count.textContent='Question '+(state.index+1)+' of '+state.deck.length;
 const score=document.createElement('span');score.textContent=state.attempted+' answered · '+state.correct+' correct';
 heading.append(count,score);panel.append(heading);
 if(state.followupId===q.id){const note=document.createElement('p');note.textContent='Fresh follow-up · apply the skill you just reviewed to new evidence.';panel.append(note)}
 const prompt=document.createElement('h3');prompt.className='majExamPrompt';prompt.textContent=q.prompt;panel.append(prompt);
 const form=document.createElement('div');form.className='majExamChoices';form.setAttribute('role','radiogroup');form.setAttribute('aria-label','Choose the best answer');
 (q.options||q.choices).forEach((choice,i)=>{
  const label=document.createElement('label');label.className='majExamChoice';
  const radio=document.createElement('input');radio.type='radio';radio.name='majMixedExamAnswer';radio.value=choice;radio.checked=state.selected===choice;radio.disabled=state.submitted;
  radio.onchange=()=>{state.selected=choice;renderMixedExam(panel)};
  const span=document.createElement('span');span.textContent=String.fromCharCode(65+i)+'. '+choice;label.append(radio,span);form.append(label);
 });panel.append(form);
 const actions=document.createElement('div');actions.className='majExamActions';
 if(!state.submitted){
  const submit=document.createElement('button');submit.type='button';submit.textContent='Check answer';submit.disabled=!state.selected;
  submit.onclick=()=>{
   if(!state.selected)return;
   if(state.submitted)return;
   state.submitted=true;if(state.selected!==q.answer)queueExamFollowup(state,q);state.attempted++;if(state.selected===q.answer)state.correct++;
   // Do not award mastery for a single exam-style response. Keep a separate
   // course-scoped review log for missed skills and instructor feedback.
   try{
    const key='majick-d772-mixed-exam-review-v1';
    const rows=JSON.parse(localStorage.getItem(key)||'[]');
    rows.push({id:q.id,lessonId:q.lessonId,skill:q.skill||q.lessonId,revision:q.revision||'original',correct:state.selected===q.answer,at:Date.now()});
    localStorage.setItem(key,JSON.stringify(rows.slice(-300)));
   }catch(_){}
   renderMixedExam(panel);
  };actions.append(submit);
 }else{
  const feedback=document.createElement('section');feedback.className='majExamFeedback';
  const verdict=document.createElement('h4');verdict.textContent=state.selected===q.answer?'Correct · Well reasoned':'Review this reasoning';
  const answer=document.createElement('p');answer.textContent='Correct answer: '+q.answer;
  const why=document.createElement('p');why.textContent=q.why;
  if(state.selected!==q.answer&&q.distractorRationales?.[state.selected])why.textContent+=' '+q.distractorRationales[state.selected];
  feedback.append(verdict,answer,why);
  if(state.selected!==q.answer){const selected=document.createElement('p');selected.textContent='You chose: '+state.selected+'. Compare that choice with the deciding evidence in the explanation.';feedback.append(selected)}
  const source=document.createElement('small');source.textContent=q.sourceLabel||'MAJICK ORIGINAL · OA-STYLE PRACTICE — NOT OFFICIAL WGU ITEMS';feedback.append(source);
  panel.append(feedback);
  const next=document.createElement('button');next.type='button';next.textContent=state.index===state.deck.length-1?'Start a fresh mixed round':'Next question →';
  next.onclick=()=>{if(state.index===state.deck.length-1){state.deck=examDeck();state.index=0;state.attempted=0;state.correct=0}else state.index++;state.selected='';state.submitted=false;renderMixedExam(panel)};
  actions.append(next);
 }
 panel.append(actions);
}
function renderReasoning(){
 if(window.S?.screen!=='reasoning')return;
 const root=document.getElementById('content');if(!root)return;
 const cid=window.S?.activeCourse||'D772';
 if(root.dataset.majReasoningCourse!==cid||!root.querySelector(':scope > .mjReasoningPage')){
  root.replaceChildren();
  const page=document.createElement('main');
  page.className='mjReasoningPage';
  const header=document.createElement('header');
  header.className='majReasoningToolbar';
  const title=document.createElement('div');
  const h=document.createElement('h2');h.textContent='✦ Reasoning Workshop';
  const desc=document.createElement('p');desc.textContent='Mixed-section reasoning for OA preparation. One question at a time.';
  title.append(h,desc);
  const back=document.createElement('button');back.type='button';back.textContent='← Study Realm';back.onclick=()=>window.navigate?.('mission');
  header.append(title,back);
  const tabs=document.createElement('nav');tabs.className='mjReasoningTabs';tabs.setAttribute('aria-label','Reasoning Workshop sections');
  const activity=document.createElement('section');activity.className='mjReasoningActivity';
  const host=document.createElement('section');host.className='mjSolutionEngine';host.setAttribute('aria-label','Reasoning Workshop activities');activity.append(host);
  const about=document.createElement('section');about.className='mjReasoningAbout';about.hidden=true;
  about.innerHTML='<h3>Your reasoning practice</h3><p>Work through a scenario, identify what is known, choose a strategy, calculate or interpret, and explain your reasoning. The final transfer task checks independent understanding.</p><p>Guided steps support learning; they do not independently certify mastery.</p>';
  const exam=document.createElement('section');exam.className='majMixedExam';exam.setAttribute('aria-label','Mixed D772 multiple-choice exam practice');
  const views=[{label:'✦ Mixed OA Questions',panel:exam},{label:'Reasoning Steps',panel:activity},{label:'How it works',panel:about}];
  activity.hidden=true;about.hidden=true;
  views.forEach(({label,panel},i)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.setAttribute('aria-pressed',String(i===0));btn.onclick=()=>{views.forEach((v,j)=>{v.panel.hidden=j!==i;tabs.children[j].setAttribute('aria-pressed',String(j===i))})};tabs.append(btn)});
  page.append(header,tabs,exam,activity,about);root.append(page);
  if(cid==='D772')renderMixedExam(exam);else exam.textContent='Mixed OA questions are currently available for D772 only.';
  page.dataset.practiceMode='mixed';
  root.dataset.majReasoningCourse=cid;
 }
 const host=root.querySelector('.mjReasoningActivity > .mjSolutionEngine');
 if(host&&!host.querySelector('.mjSeTaskSelect'))window.MajickSolutionEngine?.refresh?.();
 const nav=document.querySelector('.nav');
 nav?.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav==='reasoning'));
}
function installReasoningEntry(){
 const nav=document.querySelector('.nav');if(!nav)return;
 const study=nav.querySelector('[data-nav="mission"]');if(!study)return;
 let button=nav.querySelector('[data-maj-reasoning]');
 if(!button){
  button=document.createElement('button');button.type='button';
  button.dataset.majReasoning='true';button.dataset.nav='reasoning';
  button.innerHTML='<span aria-hidden="true">✦</span> <span class="label">Reasoning Workshop</span>';
  button.setAttribute('aria-label','Open Reasoning Workshop');
  button.addEventListener('click',()=>window.navigate?.('reasoning'));
  study.after(button);
 }
 if(window.S?.screen==='reasoning')renderReasoning();
}
function installReasoningRoute(){
 if(typeof window.navigate!=='function'||window.navigate.__majReasoningRoute)return;
 const original=window.navigate;
 function routed(destination){
  if(destination==='reasoning'){
   if(!window.S)return;
   window.S.screen='reasoning';
   const root=document.getElementById('content');
   if(root&&root.dataset.majReasoningCourse!==String(window.S.activeCourse||'D772'))delete root.dataset.majReasoningCourse;
   renderReasoning();
   return;
  }
  const value=original.apply(this,arguments);
  const root=document.getElementById('content');
  if(root)delete root.dataset.majReasoningCourse;
  return value;
 }
 routed.__majReasoningRoute=true;
 window.navigate=routed;
}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('reasoning-dedicated-room',()=>{installReasoningRoute();installReasoningEntry();if(window.S?.screen==='reasoning')renderReasoning()},98);
document.addEventListener('DOMContentLoaded',()=>{installReasoningRoute();installReasoningEntry()});
installReasoningRoute();

window.MajickRoomSections=Object.freeze({refresh,schedule});
})();
