/* Collegium Commons — single owner for Home navigation only. Does not own academic data or rewards. */
(()=>{'use strict';if(window.MajickCollegiumCommons)return;
const TABS=[['overview','✦ Overview'],['today','☀ Today'],['review','☾ Review'],['guardians','✧ Guardians'],['sanctuary','⌂ Sanctuary']];
let selected='overview',updating=false;
const valid=id=>TABS.some(t=>t[0]===id);
function preferred(){try{const id=sessionStorage.getItem('majick-commons-tab');return valid(id)?id:'overview'}catch(_){return 'overview'}}
selected=preferred();
function classify(node){
 // Stable component identity wins over incidental words in buttons and descriptions.
 const identities=[
  ['today','#v3400DailyLoop,.v3400DailyLoop,.majDailyStudyLoop,.dailyStudyLoop,.v3327AcademicHall'],
  ['overview','#v3377CampusDoors,.v3377CampusDoors,.v3327PortalHero,.v3327StudentRecord,#majickRoomRibbon'],
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
function navigateTab(next){
 if(!valid(next))return;
 selected=next;
 try{sessionStorage.setItem('majick-commons-tab',next)}catch(_){}
 const hub=document.getElementById('majCommonsHub');if(!hub)return;
 hub.querySelectorAll('[data-commons-tab]').forEach(b=>{const active=b.dataset.commonsTab===selected;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.setAttribute('aria-current',active?'page':'false')});
 hub.querySelectorAll('[data-commons-panel]').forEach(p=>{p.hidden=p.dataset.commonsPanel!==selected;p.setAttribute('tabindex','0')});
 const title=hub.querySelector('[data-commons-current]');if(title)title.textContent=TABS.find(t=>t[0]===selected)?.[1]||'Overview';
}
function attach(){
 if(updating||window.S?.screen!=='home')return;
 const root=document.querySelector('#content');if(!root)return;
 updating=true;
 try{
 let hub=root.querySelector(':scope > #majCommonsHub');
 if(!hub){
  hub=document.createElement('section');hub.id='majCommonsHub';hub.setAttribute('aria-label','Collegium Commons campus hub');
  hub.innerHTML='<div class="majCommonsWelcome"><span class="majCommonsEyebrow">✦ COLLEGIUM COMMONS · YOUR MAGICAL CAMPUS</span><h2>Welcome to the Commons</h2><p>Settle beside the enchanted hearth. Choose where you want to focus: your coursework, today’s study path, your learning reflections, or the companions who make the journey magical.</p><p class="majCommonsCourse"></p></div><div class="majCommonsTabs" role="tablist" aria-label="Campus hub sections"></div><div class="majCommonsStep"><strong data-commons-current>✦ Overview</strong><div class="majCommonsStepButtons"><button type="button" data-commons-previous aria-label="Previous campus tab">← Previous</button><button type="button" data-commons-next aria-label="Next campus tab">Next →</button></div></div><div class="majCommonsPanels"></div>';
  const list=hub.querySelector('.majCommonsTabs'),panels=hub.querySelector('.majCommonsPanels');
  TABS.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.role='tab';b.dataset.commonsTab=id;b.id='commons-tab-'+id;b.textContent=name;b.setAttribute('aria-controls','commons-panel-'+id);b.addEventListener('click',()=>navigateTab(id));list.append(b);const panel=document.createElement('div');panel.dataset.commonsPanel=id;panel.id='commons-panel-'+id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);panels.append(panel)});
  const delta=n=>{const i=TABS.findIndex(x=>x[0]===selected);navigateTab(TABS[(i+n+TABS.length)%TABS.length][0])};
  hub.querySelector('[data-commons-previous]').addEventListener('click',()=>delta(-1));hub.querySelector('[data-commons-next]').addEventListener('click',()=>delta(1));
  list.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();if(e.key==='Home')navigateTab(TABS[0][0]);else if(e.key==='End')navigateTab(TABS[TABS.length-1][0]);else delta(e.key==='ArrowRight'?1:-1);list.querySelector('[aria-selected="true"]')?.focus()}});
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
    if(academic)panels.today.append(academic);
    if(guardian)panels.guardians.append(guardian);
    if(n.children.length)panels.overview.append(n);else n.remove();
   }else if(n.classList?.contains('v3327PortalHero')||n.classList?.contains('v3327StudentRecord'))panels.overview.append(n);
   else panels[classify(n)].append(n);
  });
  oldHome.remove();
 }
 [...root.children].filter(n=>n!==hub&&n.nodeType===1).forEach(n=>panels[classify(n)].append(n));
 // Reconcile late additions inside existing panels as well as new root children.
 for(const [tab,panel] of Object.entries(panels))for(const node of [...panel.children]){
  const destination=classify(node);
  if(destination!==tab)panels[destination].append(node);
 }
 navigateTab(selected);
 }catch(e){console.warn('Commons layout preserved original content:',e)}finally{updating=false}
}
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
