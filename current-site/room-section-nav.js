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
// Dedicated sidebar entry for the existing Study Now Reasoning Workshop.
// Reuse its live renderer and saved state; never clone academic content.
function installReasoningEntry(){
 const nav=document.querySelector('.nav');
 if(!nav||nav.querySelector('[data-maj-reasoning]'))return;
 const study=nav.querySelector('[data-nav="mission"]');
 if(!study)return;
 const button=document.createElement('button');
 button.type='button';button.dataset.majReasoning='true';
 button.innerHTML='<span aria-hidden="true">✦</span> <span class="label">Reasoning Workshop</span>';
 button.setAttribute('aria-label','Open Reasoning Workshop');
 button.addEventListener('click',()=>{
   if(typeof window.navigate==='function')window.navigate('mission');
   window.setTimeout(()=>{
     const root=document.getElementById('content');
     const workshop=[...root?.querySelectorAll('.mjSolutionEngine')||[]].find(n=>!n.closest('.classroomStage'));
     if(!workshop){window.MajickSolutionEngine?.mount?.();return}
     if(workshop.parentElement===root)root.prepend(workshop);
     workshop.scrollIntoView({block:'start',behavior:'instant'});
     workshop.setAttribute('tabindex','-1');workshop.focus({preventScroll:true});
   },180);
 });
 study.after(button);
}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('reasoning-sidebar-entry',installReasoningEntry,98);
document.addEventListener('DOMContentLoaded',()=>{installReasoningEntry()});

window.MajickRoomSections=Object.freeze({refresh,schedule});
})();
