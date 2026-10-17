/* Collegium Commons — single owner for Home navigation only. Does not own academic data or rewards. */
(()=>{'use strict';if(window.MajickCollegiumCommons)return;
const TABS=[['overview','✦ Overview'],['today','☀ Today'],['review','☾ Review'],['guardians','✧ Guardians'],['sanctuary','⌂ Sanctuary']];
let selected='overview',updating=false;
const valid=id=>TABS.some(t=>t[0]===id);
function preferred(){try{const id=sessionStorage.getItem('majick-commons-tab');return valid(id)?id:'overview'}catch(_){return 'overview'}}
selected=preferred();
function classify(node){
 // Once an existing Home component has been placed, never move it because a
 // later feedback message happens to mention Guardian, Review or Sanctuary.
 if(node.dataset?.commonsOwner&&valid(node.dataset.commonsOwner))return node.dataset.commonsOwner;
 // Stable component identity wins over incidental words in buttons and descriptions.
 const identities=[
  ['today','#v3400DailyLoop,.v3400DailyLoop,.majDailyStudyLoop,.dailyStudyLoop,.v3327AcademicHall'],
  ['overview','#v3377CampusDoors,.v3377CampusDoors,.v3327PortalHero,.v3327StudentRecord,.majCommonsRecordShelf,#majickRoomRibbon'],
  ['review','.v3400MemoryQuest,#mjPreassessmentReview,#mjAdaptiveMastery,#mjD772WguHistory,#mjMisrepresentationLab,#mjD772AxisLab'],
  ['guardians','.v3327GuardianHall'],
  ['sanctuary','.v3317HomeSanctuary,.v3327CampusSanctuary']
 ];
 for(const [tab,selector] of identities)if(node.matches?.(selector))return tab;
 const id=(node.id||'').toLowerCase(),t=((node.textContent||'').slice(0,550)).toLowerCase(),c=(node.className&&typeof node.className==='string'?node.className:'').toLowerCase();
 if(/mjpreassessmentreview|mjadaptivemastery|mjd772wguhistory|mjmisrepresentationlab|mjd772axislab|mjmemor|review|preassessment|adaptive|misrepresentation|memory|recall|misconception/.test(id+' '+c+' '+t))return 'review';
 if(/sanctuary|dorm|atelier|furniture|decor|room collection/.test(id+' '+c+' '+t))return 'sanctuary';
 if(/guardian|egg|bond|solara|velora|aurelia|cascade|solstice|vesper/.test(id+' '+c+' '+t))return 'guardians';
 if(/daily study|continue d772|continue course|study loop|quick check|moon path|tonight/.test(id+' '+c+' '+t))return 'today';
 return 'overview';
}
const sanctuaryVisibility=new WeakMap();
function syncSanctuaryMotion(){
 document.querySelectorAll('#majCommonsHub .v3317SanctuaryFrame').forEach(frame=>{
  if(!frame.dataset.commonsLifecycle){frame.dataset.commonsLifecycle='true';frame.addEventListener('load',()=>{sanctuaryVisibility.delete(frame);syncSanctuaryMotion()})}
  const visible=selected==='sanctuary';
  // Hidden Phaser frames must never take keyboard focus from the selected Commons tab.
  // Keeping the frame mounted preserves in-session Sanctuary and Guardian state.
  frame.tabIndex=visible?0:-1;
  frame.inert=!visible;
  frame.style.pointerEvents=visible?'auto':'none';
  frame.setAttribute('aria-hidden',visible?'false':'true');
  if(!visible&&document.activeElement===frame){
    frame.blur();
    document.querySelector('#majCommonsHub [data-commons-tab="'+selected+'"]')?.focus({preventScroll:true});
  }
  try{const loop=frame.contentWindow?.majickPhaserGame?.loop;if(loop&&sanctuaryVisibility.get(frame)!==visible){if(visible)loop.wake();else loop.sleep();sanctuaryVisibility.set(frame,visible)}}catch(_){}
 });
}
function place(panel,node,tab){panel.append(node);if(node.dataset)node.dataset.commonsOwner=tab}
function navigateTab(next){
 if(!valid(next))return;
 selected=next;
 try{sessionStorage.setItem('majick-commons-tab',next)}catch(_){}
 const hub=document.getElementById('majCommonsHub');if(!hub)return;
 hub.querySelectorAll('[data-commons-tab]').forEach(b=>{const active=b.dataset.commonsTab===selected;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.setAttribute('aria-current',active?'page':'false')});
 hub.querySelectorAll('[data-commons-panel]').forEach(p=>{const active=p.dataset.commonsPanel===selected;p.hidden=!active;p.inert=!active;p.setAttribute('tabindex',active?'0':'-1')});
 syncSanctuaryMotion();
 const title=hub.querySelector('[data-commons-current]');if(title)title.textContent=TABS.find(t=>t[0]===selected)?.[1]||'Overview';
}
function attach(){
 if(updating||window.S?.screen!=='home')return;
 const root=document.querySelector('#content');if(!root)return;
 document.querySelectorAll('.nav button[data-nav]').forEach(b=>{const name=b.querySelector('.label')?.textContent?.trim();if(name){b.setAttribute('aria-label',name);b.title=name}});
 document.querySelector('.top select')?.setAttribute('aria-label','Active course');
 updating=true;
 try{
 let hub=root.querySelector(':scope > #majCommonsHub');
 if(!hub){
  hub=document.createElement('section');hub.id='majCommonsHub';hub.setAttribute('aria-label','Collegium Commons campus hub');
  hub.innerHTML='<div class="majCommonsWelcome"><span class="majCommonsEyebrow">✦ COLLEGIUM COMMONS · YOUR MAGICAL CAMPUS</span><h2>Welcome to the Commons</h2><p>Your next lesson, reflection desk, and Guardian residence—one quiet corner of your magical campus.</p><p class="majCommonsCourse"></p></div><div class="majCommonsTabs" role="tablist" aria-label="Campus hub sections"></div><div class="majCommonsStep"><strong data-commons-current>✦ Overview</strong><div class="majCommonsStepButtons"><button type="button" data-commons-previous aria-label="Previous campus tab">← Previous</button><button type="button" data-commons-next aria-label="Next campus tab">Next →</button></div></div><div class="majCommonsPanels"></div>';
  const list=hub.querySelector('.majCommonsTabs'),panels=hub.querySelector('.majCommonsPanels');
  TABS.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.role='tab';b.dataset.commonsTab=id;b.id='commons-tab-'+id;b.textContent=name;b.setAttribute('aria-controls','commons-panel-'+id);b.addEventListener('click',()=>navigateTab(id));list.append(b);const panel=document.createElement('div');panel.dataset.commonsPanel=id;panel.id='commons-panel-'+id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);panels.append(panel)});
  const delta=n=>{const i=TABS.findIndex(x=>x[0]===selected);navigateTab(TABS[(i+n+TABS.length)%TABS.length][0])};
  // Analytics belongs to the existing app-wide Observatory, never a duplicate Commons panel.
  const analyticsAccess=document.createElement('button');
  analyticsAccess.type='button';
  analyticsAccess.className='majCommonsAnalyticsAccess';
  analyticsAccess.textContent='◈ Open App-wide Analytics';
  analyticsAccess.setAttribute('aria-label','Open the app-wide Analytics Observatory');
  analyticsAccess.addEventListener('click',()=>{
    const navButton=document.querySelector('.nav button[data-nav="analytics"]');
    if(navButton){navButton.click();return}
    if(typeof navigate==='function')navigate('analytics');
  });
  hub.querySelector('.majCommonsStepButtons').append(analyticsAccess);
  hub.querySelector('[data-commons-previous]').addEventListener('click',()=>delta(-1));hub.querySelector('[data-commons-next]').addEventListener('click',()=>delta(1));
  // Keyboard handling is delegated once below, so rerendered tab buttons retain focus behavior.
  root.prepend(hub);
 }
 hub.querySelector('.majCommonsCourse').textContent='Currently studying · '+(document.querySelector('.top select')?.selectedOptions?.[0]?.textContent||window.S?.activeCourse||'Your course');
 const panels=Object.fromEntries([...hub.querySelectorAll('[data-commons-panel]')].map(p=>[p.dataset.commonsPanel,p]));
 // Preserve the original magical college renderers; redistribute their existing nodes rather than rebuilding features.
 const oldHome=[...root.children].find(n=>n.classList?.contains('v3327Home'));
 if(oldHome){
  for(const p of Object.values(panels))p.classList.add('v3327Home');
  [...oldHome.children].forEach(n=>{
   if(n.classList?.contains('v3327HallGrid')){
    const academic=n.querySelector('.v3327AcademicHall'),guardian=n.querySelector('.v3327GuardianHall');
    if(academic)place(panels.today,academic,'today');
    if(guardian)place(panels.guardians,guardian,'guardians');
    if(n.children.length)place(panels.overview,n,'overview');else n.remove();
   }else if(n.classList?.contains('v3327PortalHero')||n.classList?.contains('v3327StudentRecord'))place(panels.overview,n,'overview');
   else {const tab=classify(n);place(panels[tab],n,tab)}
  });
  oldHome.remove();
 }
 [...root.children].filter(n=>n!==hub&&n.nodeType===1).forEach(n=>{const tab=classify(n);place(panels[tab],n,tab)});
 // Keep the full existing record within reach without another long default stack.
 const record=panels.overview.querySelector(':scope > .v3327StudentRecord');
 if(record){const shelf=document.createElement('details');shelf.className='majCommonsRecordShelf';const summary=document.createElement('summary');summary.textContent='Open your Student Record · coursework and Majick progress';shelf.append(summary);record.before(shelf);shelf.append(record)}
 const hero=panels.overview.querySelector('.v3327PortalHero'),guardian=hero?.querySelector('.v3341GuardianHero');
 if(guardian){let shelf=hero.querySelector('.majCommonsGuardianShelf');if(!shelf){shelf=document.createElement('details');shelf.className='majCommonsGuardianShelf';const summary=document.createElement('summary');shelf.append(summary);guardian.before(shelf);shelf.append(guardian)}const name=guardian.querySelector('h3')?.textContent||'Your Guardian';const summary=shelf.querySelector('summary');const label=name+' is nearby · bond and study settings';if(summary.textContent!==label)summary.textContent=label}
 // Reconcile late additions inside existing panels as well as new root children.
 for(const [tab,panel] of Object.entries(panels))for(const node of [...panel.children]){
  const destination=classify(node);
  if(destination!==tab)place(panels[destination],node,destination);
 }
 navigateTab(selected);
 // The Commons can hydrate panels while a keyboard tab move is underway.
 // Keep the focused tab attached after reclassification, not the detached old button.
 if(window.S?.screen==='home'&&document.activeElement?.closest?.('#majCommonsHub [data-commons-tab]')){
   const activeId=document.activeElement.dataset.commonsTab;
   if(activeId!==selected)hub.querySelector('[data-commons-tab="'+selected+'"]')?.focus({preventScroll:true});
 }
 }catch(e){console.warn('Commons layout preserved original content:',e)}finally{updating=false}
}
// The Home hub can rehydrate after the learner selects a tab. Delegate from the
// document to survive button replacement and focus the currently mounted button.
let pendingKeyboardFocus=false;
document.addEventListener('keydown',e=>{
 if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
 const target=e.target?.closest?.('#majCommonsHub [data-commons-tab]');
 if(!target||window.S?.screen!=='home')return;
 e.preventDefault();pendingKeyboardFocus=true;
 const index=TABS.findIndex(t=>t[0]===selected),n=TABS.length;
 const next=e.key==='Home'?TABS[0][0]:e.key==='End'?TABS[n-1][0]:TABS[(index+(e.key==='ArrowRight'?1:-1)+n)%n][0];
 navigateTab(next);
 const focus=()=>document.querySelector('#majCommonsHub [data-commons-tab="'+next+'"]')?.focus({preventScroll:true});
 focus();queueMicrotask(focus);
},true);
document.addEventListener('keyup',e=>{
 if(!pendingKeyboardFocus||!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
 pendingKeyboardFocus=false;
 document.querySelector('#majCommonsHub [data-commons-tab="'+selected+'"]')?.focus({preventScroll:true});
},true);
function needsSync(){
 const root=document.querySelector('#content'),hub=root?.querySelector(':scope > #majCommonsHub');
 if(!root)return false;
 if(!hub||[...root.children].some(n=>n!==hub))return true;
 return [...hub.querySelectorAll('[data-commons-panel]')].some(p=>[...p.children].some(n=>classify(n)!==p.dataset.commonsPanel));
}
function sync(){if(window.S?.screen==='home')attach()}
window.MajickCollegiumCommons={attach,sync,select:n=>{if(TABS.some(t=>t[0]===n))navigateTab(n)},tabs:TABS.map(x=>x[0])};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('collegium-commons-home',sync,98);window.MajickRenderQueue.schedule()}
document.addEventListener('DOMContentLoaded',()=>{sync();const host=document.querySelector('#app')||document.body;const observer=new MutationObserver(()=>{if(window.S?.screen==='home'&&!updating&&needsSync())queueMicrotask(sync)});observer.observe(host,{childList:true,subtree:true})});
})();
