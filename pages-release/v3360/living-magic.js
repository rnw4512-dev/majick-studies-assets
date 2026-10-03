(()=>{
'use strict';
const VERSION='3.3.60';
const ROOM_LABELS={
 home:{name:'Moonlit Collegium',detail:'Grand Hall • D772 Academic Wing',sigil:'✦'},
 learninglab:{name:'Candlelit Classroom',detail:'Learn Lab • instruction before practice',sigil:'☾'},
 livinggrimoire:{name:'Research Library',detail:'Grimoire Archives • notes, references & anchor charts',sigil:'❦'},
 games:{name:'Game Realm',detail:'Practice halls • Guardian trials',sigil:'✧'},
 companions:{name:'Guardian Residence',detail:'Sanctuary Dormitory • care, rest & play',sigil:'◇'}
};
let raf=0,lastRoom='';
function room(){
 const s=window.S?.screen||document.body?.dataset?.majickRoom||'home';
 return ROOM_LABELS[s]?s:(s==='mission'?'games':'home');
}
function reduced(){
 return document.documentElement?.dataset?.majickReduceMotion==='true'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
function ensureMagicLayer(){
 if(!document.body)return null;
 let layer=document.getElementById('majickLivingMagic');
 if(!layer){
  layer=document.createElement('div');
  layer.id='majickLivingMagic';layer.className='v3360MagicLayer';layer.setAttribute('aria-hidden','true');
  layer.innerHTML='<i class="mote m1"></i><i class="mote m2"></i><i class="mote m3"></i><i class="mote m4"></i><i class="mote m5"></i><i class="mote m6"></i><span class="v3360Glow g1"></span><span class="v3360Glow g2"></span>';
  document.body.prepend(layer);
 }
 return layer;
}
function ensureRoomRibbon(r){
 const content=document.querySelector('.content');if(!content)return;
 let ribbon=document.getElementById('majickRoomRibbon');
 const cfg=ROOM_LABELS[r]||ROOM_LABELS.home;
 if(!ribbon){
  ribbon=document.createElement('aside');ribbon.id='majickRoomRibbon';ribbon.className='v3360RoomRibbon';
  ribbon.innerHTML='<span class="v3360RoomSigil"></span><div><small>MAJICK STUDIES • CAMPUS LOCATION</small><b></b><em></em></div>';
  content.prepend(ribbon);
 }
 ribbon.querySelector('.v3360RoomSigil').textContent=cfg.sigil;
 ribbon.querySelector('b').textContent=cfg.name;
 ribbon.querySelector('em').textContent=cfg.detail;
}
function markHeavySections(){
 document.querySelectorAll('.content > section,.content > div,.learnLab > section,.learnLab > div').forEach(el=>{
  if(el.id==='majickRoomRibbon'||el.id==='majickLivingMagic')return;
  if(!el.classList.contains('v3360Contained'))el.classList.add('v3360Contained');
 });
}
function decorate(){
 raf=0;
 const r=room();
 document.documentElement.dataset.majickSmooth='3360';
 document.body.dataset.majickPolishRoom=r;
 ensureMagicLayer();
 ensureRoomRibbon(r);
 markHeavySections();
 if(lastRoom!==r){
  document.body.classList.remove('v3360RoomPulse');
  if(!reduced()){
   requestAnimationFrame(()=>document.body.classList.add('v3360RoomPulse'));
   setTimeout(()=>document.body.classList.remove('v3360RoomPulse'),650);
  }
  lastRoom=r;
 }
}
function schedule(){
 if(raf)return;
 raf=requestAnimationFrame(decorate);
}
function start(){
 if(!document.body)return setTimeout(start,50);
 const queue=window.MajickRenderQueue;
 if(queue?.register){
  queue.register('living-magic',decorate,90);
  queue.schedule();
 }else{
  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{childList:true,subtree:true});
  schedule();
 }
 window.addEventListener('resize',()=>window.MajickRenderQueue?.schedule?.()||schedule(),{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)(window.MajickRenderQueue?.schedule?.()||schedule())});
}
start();
window.MajickLivingMagic={VERSION,ROOM_LABELS,room,reduced,decorate,schedule,inspect(){return{version:VERSION,room:room(),layer:!!document.getElementById('majickLivingMagic'),ribbon:!!document.getElementById('majickRoomRibbon'),reduced:reduced(),sharedQueue:!!window.MajickRenderQueue}}};
})();