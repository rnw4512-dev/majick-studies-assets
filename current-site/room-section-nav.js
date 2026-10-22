/* Compact navigation for rooms other than Home. No academic DOM is moved or hidden. */
(()=>{'use strict';if(window.MajickRoomSections)return;
const MAX=8;
const ROOM_NAMES={mission:'Study Now',learninglab:'Learn Lab',games:'Game Realm',journal:'My Journal',grimoire:'Grimoire',companions:'Companions',livinggrimoire:'Grimoire',guide:'Study Guide',vault:'Magic Vault',analytics:'Analytics',addmaterial:'Notes Forge'};
// Preserve every academic renderer and form. The nonacademic rooms use one
// visible section at a time; academic rooms keep their non-destructive jumps.
const TABBED_ROOMS=new Set(['journal','grimoire','livinggrimoire','companions','guide','vault','analytics','addmaterial']);
const selections=new Map();
let pending=false,updating=false;
function refresh(){
 if(updating)return;updating=true;
 try{
  const root=document.getElementById('content');
  const room=window.S?.screen;
  const old=document.getElementById('majickRoomSections');
  if(!root||!room||room==='home'||!ROOM_NAMES[room]){old?.remove();return}
  // Only substantial, *visible* sections with headings qualify. Never move,
  // clone or hide academic widgets: existing render ownership is preserved.
  const nodes=[...root.querySelectorAll(':scope > section,:scope > article,:scope > div')].filter(el=>
   el.id!=='majickRoomSections'&&(el.getClientRects().length||el.classList.contains('majRoomInactive'))&&!el.hidden&&
   !el.closest('[hidden]')&&(el.scrollHeight>220||el.classList.contains('majRoomInactive')));
  const rows=nodes.map((el,i)=>{
   const h=el.querySelector('h2,h3,[role="heading"]');
   const text=h?.textContent?.replace(/\s+/g,' ').trim();
   return text&&text.length>=3?{el,label:text.slice(0,46),i}:null
  }).filter(Boolean).slice(0,MAX);
  if(rows.length<2){old?.remove();return}
  let nav=old;
  if(!nav){nav=document.createElement('nav');nav.id='majickRoomSections';nav.className='majickRoomSections';nav.setAttribute('aria-label','Jump to page section');root.prepend(nav)}
  const tabbed=TABBED_ROOMS.has(room);
  const key=room+':'+(window.S?.activeCourse||'');
  const current=selections.get(key)||0;
  const active=Math.min(current,rows.length-1);
  if(tabbed){
   rows.forEach(({el},i)=>{
    el.classList.toggle('majRoomInactive',i!==active);
    el.classList.toggle('majRoomActive',i===active);
    el.dataset.majRoomPanel=String(i);
   });
  }else{
   nodes.forEach(el=>{el.classList.remove('majRoomInactive','majRoomActive');delete el.dataset.majRoomPanel});
  }
  const signature=room+':'+rows.map(x=>x.label).join('|')+':'+tabbed;
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
    button.setAttribute('aria-pressed',String(i===active));
    button.classList.toggle('majRoomSelected',i===active);
    button.onclick=()=>{
     selections.set(key,i);
     rows.forEach(({el:panel},j)=>{panel.classList.toggle('majRoomInactive',j!==i);panel.classList.toggle('majRoomActive',j===i)});
     nav.querySelectorAll('button').forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===i));b.classList.toggle('majRoomSelected',j===i)});
     el.scrollIntoView({block:'start',behavior:'instant'});
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
let reasoningCourse=null;
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
  const desc=document.createElement('p');desc.textContent='Focus on explaining, interpreting, and independently transferring your course skills.';
  title.append(h,desc);
  const back=document.createElement('button');back.type='button';back.textContent='← Study Realm';back.onclick=()=>window.navigate?.('mission');
  header.append(title,back);
  const host=document.createElement('section');host.className='mjSolutionEngine';host.setAttribute('aria-label','Reasoning Workshop activities');
  page.append(header,host);root.append(page);
  root.dataset.majReasoningCourse=cid;
 }
 const host=root.querySelector('.mjReasoningPage > .mjSolutionEngine');
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
   if(root)delete root.dataset.majReasoningCourse;
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
