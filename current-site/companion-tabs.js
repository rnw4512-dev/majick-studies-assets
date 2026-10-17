(()=>{
'use strict';
if(window.MajickCompanionTabs)return;
// Presentation-only grouping of existing Companion content. No Guardian or reward state owner.
const VIEWS=[['guardians','Guardians'],['eggs','Eggs'],['sanctuary','Sanctuary'],['wardrobe','Wardrobe & Décor']];
const MAP={'Your Guardians':'guardians','Egg Incubator':'eggs','Magical Habitat':'sanctuary','Dress-Up Drawer':'wardrobe','Sanctuary Decor':'wardrobe'};
let selected='guardians',pending=false;
function mount(){
 const root=document.getElementById('content');
 if(!root||window.S?.screen!=='companions'||root.querySelector('.majCompTabs'))return;
 const titles=[...root.children].filter(x=>x.classList?.contains('sectionTitle'));
 const groups=titles.map(x=>({element:x,title:x.querySelector('h2')?.textContent?.trim()||''}));
 if(!groups.some(x=>x.title==='Your Guardians')||!groups.some(x=>x.title==='Egg Incubator'))return;
 const head=groups.find(x=>x.title==='Companion Sanctuary')?.element;
 const nodes=[...root.children],partitions=new Map(VIEWS.map(([id])=>[id,[]]));
 let current=null;
 for(const node of nodes){
  if(node===head)continue;
  const title=node.classList?.contains('sectionTitle')?node.querySelector('h2')?.textContent?.trim():null;
  if(title&&MAP[title])current=MAP[title];
  if(current&&partitions.has(current))partitions.get(current).push(node);
  // Legacy 'Active realm' banner duplicates the active selection in the main app.
  else if(node.classList?.contains('miniRealmBanner'))node.hidden=true;
 }
 const nav=document.createElement('nav');nav.className='majCompTabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Companions sections');
 const panels=new Map();
 for(const [id,label] of VIEWS){
  const btn=document.createElement('button');btn.type='button';btn.id='majCompTab-'+id;btn.setAttribute('role','tab');btn.setAttribute('aria-controls','majCompPanel-'+id);btn.textContent=label;btn.dataset.companionTab=id;nav.append(btn);
  const panel=document.createElement('section');panel.id='majCompPanel-'+id;panel.className='majCompPanel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',btn.id);
  for(const node of partitions.get(id))panel.append(node);panels.set(id,panel);
 }
 // Keep original Guardian actions and state; only reshape their presentation.
 const nameByType={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia',vesper:'vesper',briar:'briar',zephyr:'zephyr',prism:'prism',rook:'rook',solara:'solara'};
 const cards=[...panels.get('guardians').querySelectorAll('.petCard')];
 cards.forEach((card,i)=>{
  const pet=window.S?.legacy?.pets?.[i];if(!pet)return;
  const key=nameByType[String(pet.type||'').toLowerCase()];
  const portrait=card.querySelector('.petAvatar');
  if(portrait&&key){const original=portrait.textContent;const img=document.createElement('img');img.src='./assets/familiars/canon/'+key+'-guardian.webp';img.alt=String(pet.name||key)+' canonical portrait';img.loading='lazy';img.onerror=()=>{img.remove();portrait.textContent=original};portrait.textContent='';portrait.append(img)}
  const species=card.querySelector('h3 + p');if(species){const text=species.textContent.split(' • ');species.textContent=text[0]||''}
  const tip=card.querySelector('.tiny');if(tip){const detail=document.createElement('details');detail.className='majCompDetail';const summary=document.createElement('summary');summary.textContent='Ability & personality';detail.append(summary,tip);card.append(detail)}
  const bond=card.querySelector('.petProgress');if(bond){bond.setAttribute('role','progressbar');bond.setAttribute('aria-label','Guardian bond progress');bond.setAttribute('aria-valuemin','0');bond.setAttribute('aria-valuemax','100');const w=parseFloat(bond.querySelector('i')?.style.width||'0');bond.setAttribute('aria-valuenow',String(Math.min(100,Math.max(0,Math.round(w)))))}
  card.classList.add('majCompPortraitCard');
 });
 const insert=head?.nextSibling||root.firstChild;root.insertBefore(nav,insert);
 for(const panel of panels.values())nav.after(panel);
 // Re-establish stable tab order, since after() always inserts immediately after the nav.
 for(const [id] of VIEWS)root.append(panels.get(id));
 function show(id,focus=false){selected=panels.has(id)?id:'guardians';for(const btn of nav.children){const on=btn.dataset.companionTab===selected;btn.setAttribute('aria-selected',String(on));btn.tabIndex=on?0:-1;if(on&&focus)btn.focus()};for(const [key,panel] of panels)panel.hidden=key!==selected}
 nav.addEventListener('click',e=>{const t=e.target.closest('[data-companion-tab]');if(t)show(t.dataset.companionTab)});
 nav.addEventListener('keydown',e=>{const pos=VIEWS.findIndex(x=>x[0]===selected);const delta=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(delta){e.preventDefault();show(VIEWS[(pos+delta+VIEWS.length)%VIEWS.length][0],true)}else if(e.key==='Home'||e.key==='End'){e.preventDefault();show(VIEWS[e.key==='Home'?0:VIEWS.length-1][0],true)}});
 show(selected);
}
function queue(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;mount()})}
const css=document.createElement('style');css.textContent='.majCompTabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px;margin:14px 0 20px;background:#251d33;border:1px solid #c6a676;border-radius:15px}.majCompTabs button{font:700 14px/1.4 system-ui;color:#f7e8cc;background:#43304f;border:1px solid #a68b9d;border-radius:10px;padding:11px 15px;cursor:pointer}.majCompTabs button[aria-selected="true"]{color:#21172c;background:#f1d49e;border-color:#f1d49e}.majCompTabs button:focus-visible{outline:3px solid #ffdf83;outline-offset:3px}.majCompPortraitCard{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;min-width:0}.majCompPortraitCard .petAvatar{width:min(100%,190px);height:190px;display:grid;place-items:center;overflow:hidden;border-radius:18px;background:radial-gradient(ellipse at 50% 30%,#6e4d74,#24172e 75%);border:1px solid #c4a474}.majCompPortraitCard .petAvatar img{width:100%;height:100%;object-fit:contain}.majCompPortraitCard .petProgress{width:100%;max-width:220px}.majCompPortraitCard .majCompDetail{width:100%;margin-top:7px;text-align:left;border-top:1px solid #816f82;padding:9px 0;color:#f8e4c6}.majCompPortraitCard .majCompDetail summary{cursor:pointer;font-weight:700}.majCompPortraitCard .majCompDetail p{line-height:1.5;margin:8px 0 0}.majCompPortraitCard button{min-height:38px}.majCompPanel[hidden]{display:none!important}.majCompPanel{min-height:160px}.majCompPanel>.sectionTitle:first-child{margin-top:0}@media(max-width:520px){.majCompTabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.majCompTabs button{padding:10px 7px}}';document.head.append(css);
const app=document.getElementById('app');if(app)new MutationObserver(queue).observe(app,{childList:true,subtree:false});
document.addEventListener('click',e=>{if(e.target.closest('[data-nav]'))queueMicrotask(queue)},true);
window.MajickCompanionTabs={refresh:queue,version:'3.4.2-companion-tabs-1'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{const host=document.getElementById('app');if(host)new MutationObserver(queue).observe(host,{childList:true,subtree:false});queue()},{once:true});else queue();
})();
