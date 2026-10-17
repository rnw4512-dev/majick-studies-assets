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
const css=document.createElement('style');css.textContent='.majCompTabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px;margin:14px 0 20px;background:#251d33;border:1px solid #c6a676;border-radius:15px}.majCompTabs button{font:700 14px/1.4 system-ui;color:#f7e8cc;background:#43304f;border:1px solid #a68b9d;border-radius:10px;padding:11px 15px;cursor:pointer}.majCompTabs button[aria-selected="true"]{color:#21172c;background:#f1d49e;border-color:#f1d49e}.majCompTabs button:focus-visible{outline:3px solid #ffdf83;outline-offset:3px}.majCompPanel[hidden]{display:none!important}.majCompPanel{min-height:160px}.majCompPanel>.sectionTitle:first-child{margin-top:0}@media(max-width:520px){.majCompTabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.majCompTabs button{padding:10px 7px}}';document.head.append(css);
const content=document.getElementById('content');if(content)new MutationObserver(queue).observe(content,{childList:true});
document.addEventListener('click',e=>{if(e.target.closest('[data-nav]'))queueMicrotask(queue)},true);
window.MajickCompanionTabs={refresh:queue,version:'3.4.2-companion-tabs-1'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{const host=document.getElementById('content');if(host)new MutationObserver(queue).observe(host,{childList:true});queue()},{once:true});else queue();
})();
