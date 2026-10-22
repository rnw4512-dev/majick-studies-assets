/* Compact navigation for rooms other than Home. No academic DOM is moved or hidden. */
(()=>{'use strict';if(window.MajickRoomSections)return;
const MAX=8;
const ROOM_NAMES={mission:'Study Now',learninglab:'Learn Lab',games:'Game Realm',journal:'My Journal',grimoire:'Grimoire'};
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
   el.id!=='majickRoomSections'&&el.getClientRects().length&&!el.hidden&&
   !el.closest('[hidden]')&&el.scrollHeight>220);
  const rows=nodes.map((el,i)=>{
   const h=el.querySelector('h2,h3,[role="heading"]');
   const text=h?.textContent?.replace(/\s+/g,' ').trim();
   return text&&text.length>=3?{el,label:text.slice(0,46),i}:null
  }).filter(Boolean).slice(0,MAX);
  if(rows.length<3){old?.remove();return}
  let nav=old;
  if(!nav){nav=document.createElement('nav');nav.id='majickRoomSections';nav.className='majickRoomSections';nav.setAttribute('aria-label','Jump to page section');root.prepend(nav)}
  const signature=room+':'+rows.map(x=>x.label).join('|');
  if(nav.dataset.signature===signature)return;
  nav.dataset.signature=signature;
  nav.replaceChildren();
  const title=document.createElement('strong');title.textContent='On this page';nav.append(title);
  rows.forEach(({el,label},i)=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;
   button.setAttribute('aria-label','Jump to '+label);
   button.onclick=()=>el.scrollIntoView({block:'start',behavior:'instant'});
   nav.append(button);
  });
 }finally{updating=false}
}
function schedule(){if(pending)return;pending=true;setTimeout(()=>{pending=false;refresh()},85)}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('room-section-shortcuts',schedule,97);
document.addEventListener('DOMContentLoaded',()=>{schedule()});
// A dedicated workshop view within Study Now. The existing Solution Engine
// remains the sole owner of questions, progress, and mastery.
let workshopOpen=false;
function showReasoningWorkshop(){
 const root=document.getElementById('content');
 if(window.S?.screen!=='mission'||!root)return;
 let host=root.querySelector(':scope > .mjSolutionEngine');
 if(!host){window.MajickSolutionEngine?.refresh?.();host=root.querySelector(':scope > .mjSolutionEngine')}
 if(!host)return;
 root.querySelectorAll(':scope > *').forEach(el=>{
  if(el===host)return;
  if(workshopOpen){
   if(!el.hasAttribute('data-maj-reasoning-hidden'))el.dataset.majReasoningHidden=el.hidden?'already':'shown';
   el.hidden=true;
  }else if(el.hasAttribute('data-maj-reasoning-hidden')){
   el.hidden=el.dataset.majReasoningHidden==='already';
   delete el.dataset.majReasoningHidden;
  }
 });
 host.hidden=false;
 host.classList.toggle('majReasoningDedicated',workshopOpen);
 let heading=host.querySelector(':scope > [data-maj-reasoning-heading]');
 if(workshopOpen&&!heading){
  heading=document.createElement('h2');heading.dataset.majReasoningHeading='true';
  heading.textContent='Reasoning Workshop · Independent Practice';
  host.prepend(heading);
 }else if(!workshopOpen)heading?.remove();
}
function installReasoningEntry(){
 const nav=document.querySelector('.nav');
 if(!nav)return;
 const study=nav.querySelector('[data-nav="mission"]');
 if(!study)return;
 let button=nav.querySelector('[data-maj-reasoning]');
 if(!button){
  button=document.createElement('button');button.type='button';
  button.dataset.majReasoning='true';
  button.innerHTML='<span aria-hidden="true">✦</span> <span class="label">Reasoning Workshop</span>';
  button.setAttribute('aria-label','Open Reasoning Workshop');
  button.addEventListener('click',()=>{
   workshopOpen=true;
   window.navigate?.('mission');
   showReasoningWorkshop();
  });
  study.after(button);
 }
 if(!study.dataset.majReasoningExit){
  study.dataset.majReasoningExit='true';
  study.addEventListener('click',()=>{workshopOpen=false;showReasoningWorkshop()});
 }
 for(const other of nav.querySelectorAll('button:not([data-maj-reasoning]):not([data-nav="mission"])')){
  if(other.dataset.majReasoningExit)continue;
  other.dataset.majReasoningExit='true';
  other.addEventListener('click',()=>{workshopOpen=false});
 }
 if(window.S?.screen==='mission')showReasoningWorkshop();
 else workshopOpen=false;
}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('reasoning-sidebar-entry',installReasoningEntry,98);
document.addEventListener('DOMContentLoaded',installReasoningEntry);

window.MajickRoomSections=Object.freeze({refresh,schedule});
})();
