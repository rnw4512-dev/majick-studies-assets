(()=>{
'use strict';
const VERSION='3.3.61';
const tasks=new Map();
let frame=0;
const CAMPUS=new Set(['home','learninglab','livinggrimoire','games','companions','mission']);
const LABELS={home:'Grand Hall',learninglab:'Learn Lab',livinggrimoire:'Grimoire Library',games:'Game Realm',companions:'Guardian Residence',mission:'Practice Chamber'};
function reduced(){return document.documentElement?.dataset?.majickReduceMotion==='true'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}
function register(name,fn,priority=50){
 if(!name||typeof fn!=='function')return false;
 tasks.set(String(name),{fn,priority:Number(priority)||50});
 return true;
}
function unregister(name){tasks.delete(String(name))}
function flush(){
 frame=0;
 const ordered=[...tasks.entries()].sort((a,b)=>a[1].priority-b[1].priority);
 for(const [name,row] of ordered){try{row.fn()}catch(e){console.warn('Majick render task failed',name,e)}}
}
function schedule(){
 if(frame)return;
 frame=requestAnimationFrame(flush);
}
function ensurePortal(){
 let el=document.getElementById('majickCampusPortal');
 if(el)return el;
 el=document.createElement('div');el.id='majickCampusPortal';el.className='v3361Portal';el.setAttribute('aria-hidden','true');
 el.innerHTML='<div class="v3361PortalDoor"><span>✦</span><small>MOONLIT COLLEGIUM</small><b></b></div>';
 document.body?.append(el);return el;
}
function showPortal(target){
 const el=ensurePortal();if(!el)return;
 el.querySelector('b').textContent=LABELS[target]||'Campus';
 if(reduced()){el.classList.remove('active');return}
 el.classList.remove('active');void el.offsetWidth;el.classList.add('active');
 clearTimeout(showPortal._t);showPortal._t=setTimeout(()=>el.classList.remove('active'),420);
}
const baseRender=typeof window.render==='function'?window.render:null;
if(baseRender&&!baseRender.__v3361Queue){
 const wrapped=function(){
  const out=baseRender.apply(this,arguments);
  schedule();
  return out;
 };
 wrapped.__v3361Queue=true;wrapped.__v3361Base=baseRender;
 window.render=wrapped;
}
const baseNavigate=typeof window.navigate==='function'?window.navigate:null;
if(baseNavigate&&!baseNavigate.__v3361Portal){
 const nav=function(route){
  const current=window.S?.screen||'';
  const target=String(route||'');
  if(current!==target&&CAMPUS.has(current)&&CAMPUS.has(target))showPortal(target);
  const out=baseNavigate.apply(this,arguments);
  schedule();
  return out;
 };
 nav.__v3361Portal=true;nav.__v3361Base=baseNavigate;
 window.navigate=nav;
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MajickRenderQueue={VERSION,register,unregister,schedule,flush,reduced,showPortal,inspect(){return{version:VERSION,tasks:[...tasks.keys()],framePending:!!frame,renderWrapped:!!window.render?.__v3361Queue,navigateWrapped:!!window.navigate?.__v3361Portal}}};
schedule();
})();