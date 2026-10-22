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
// A dedicated workshop view within Study Now. The existing Solution Engine
// remains the sole owner of questions, progress, and mastery.
let workshopOpen=false;
function showReasoningWorkshop(){
 const root=document.getElementById('content');
 if(window.S?.screen!=='mission'||!root)return;
 let host=root.querySelector(':scope > .mjSolutionEngine');
 if(!host){window.MajickSolutionEngine?.refresh?.();host=root.querySelector(':scope > .mjSolutionEngine')}
 if(!host)return;
 // Preserve all existing academic controls. The workshop is a sidebar
 // destination and focus target, not a second renderer or DOM owner.
 host.classList.toggle('majReasoningDedicated',workshopOpen);
 if(workshopOpen){
  host.setAttribute('tabindex','-1');
  host.scrollIntoView({block:'start',behavior:'instant'});
  host.focus({preventScroll:true});
 }
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
