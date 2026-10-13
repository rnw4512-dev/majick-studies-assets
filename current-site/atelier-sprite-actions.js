(()=>{
'use strict';
if(window.MajickSpriteActions)return;
// This module owns activity controls only. The Atelier owns scholar identity/rendering;
// MajickGuardianCare owns Guardian effects and Sanctuary owns Guardian entities.
const ROOT='./assets/atelier/v2/fitted/poses/';
const POSES=Object.freeze({study:'studying_read.webp',write:'writing.webp',feed:'feeding_pets.webp',play:'playing.webp',sleep:'sleeping.webp'});
const LABELS={study:'Study',write:'Write',feed:'Feed Guardian',play:'Play with Guardian',sleep:'Rest'};
const EXPECTED=new Set(Object.keys(POSES));
let mode='idle',message='',revision=0,host=null;
const state=()=>window.MajickAtelier?.player?.()||null;
function compatible(){
 const p=state();
 return !!p && Number(p.hair)===0 && Number(p.robe)===1 && ![0,5].includes(Number(p.skin));
}
function panel(){return document.querySelector('#majickScholarCompanion .mscPanel')}
function original(){
 const el=panel()?.querySelector('.mscLarge');
 el?.classList.remove('mscSpritePose');
 window.MajickScholarCompanion?.refresh?.(true);
}
function status(text){message=String(text||'');const el=host?.querySelector('[data-sprite-message]');if(el)el.textContent=message;}
function renderControls(){
 const p=panel();
 if(!p){host=null;return}
 if(host && host.parentElement!==p)host=null;
 if(!host){host=document.createElement('section');host.className='mscSpriteActions';host.setAttribute('aria-label','Scholar activity controls');p.append(host)}
 const supports=compatible();
 host.innerHTML='<div class="mscActionHeader"><strong>Scholar activities</strong><small>'+(supports?'Fixed-look V2 poses · Midnight Velvet + Locs':'Your current appearance is preserved; matched V2 poses are pending')+'</small></div><div class="mscActionButtons">'+
 Object.keys(POSES).map(k=>'<button type="button" data-action-pose="'+k+'" aria-pressed="'+(mode===k)+'">'+LABELS[k]+'</button>').join('')+
 '<button type="button" data-action-pose="idle" aria-pressed="'+(mode==='idle')+'">Return to idle</button>'+
 '<button type="button" disabled title="Waiting on registered and visually validated hair, outfit, and walk frames">Walk · art pending</button></div><p data-sprite-message role="status" class="mscSpriteStatus"></p>';
 host.querySelector('[data-sprite-message]').textContent=message||'Your fitted Atelier avatar stays the default. The V2 poses have a fixed appearance.';
 host.querySelectorAll('[data-action-pose]').forEach(el=>el.addEventListener('click',()=>activate(el.dataset.actionPose)));
}
function applyPose(k,token){
 if(!compatible()){status((message?message+' ':'')+'Kept your selected appearance because this action has no matching fitted layers.');return}
 const target=panel()?.querySelector('.mscLarge');
 if(!target)return;
 const image=new Image();
 image.alt=LABELS[k]+' — fixed-look scholar activity illustration';
 image.decoding='async';
 image.onload=()=>{
   if(revision!==token || mode!==k || !compatible() || !target.isConnected)return;
   target.replaceChildren(image);target.classList.add('mscSpritePose');
 };
 image.onerror=()=>{
   if(revision!==token)return;
   mode='idle';original();renderControls();
   status('Action artwork failed to load. Your fitted avatar was restored.');
 };
 image.src=ROOT+POSES[k];
}
function performGuardianAction(action){
 const care=window.MajickGuardianCare;
 const snap=care?.snapshot?.();
 const pet=snap?.roster?.find(g=>g.petId===snap.focusPetId)||snap?.roster?.[0];
 if(!pet||!care?.performAction)return {ok:false,message:'No bonded Guardian is available. Open Sanctuary to bond with a Guardian first.'};
 // Invoke the authoritative care function once. Never add separate XP, inventory, or bond updates.
 const result=care.performAction(pet.petId,action,{objectId:action==='feed'?'guardian-food-bowl':'guardian-play-rug'});
 if(result?.ok){care.broadcastState?.();try{window.render?.()}catch(_){}}
 return result||{ok:false,message:'Guardian action did not complete.'};
}
function activate(action){
 if(action!=='idle'&&!EXPECTED.has(action))return false;
 const token=++revision;
 if(action==='idle'){mode='idle';message='';original();renderControls();return true}
 if(action==='feed'||action==='play'){
   const result=performGuardianAction(action);
   message=result.message||'Guardian interaction could not be completed.';
   if(!result.ok){mode='idle';original();renderControls();return false}
 }
 mode=action;
 if(action==='study'||action==='write'||action==='sleep'){
   // Trigger existing companion state without creating a duplicate render loop.
   window.MajickScholarCompanion?.react?.(action==='sleep'?'sleeping':'studying');
 }else{
   window.MajickScholarCompanion?.react?.('guardian-bonding');
 }
 renderControls();
 applyPose(action,token);
 return true;
}
function refresh(){
 const el=panel();
 if(!el){host=null;return}
 if(!host || !host.isConnected)renderControls();
}
const style=document.createElement('style');style.textContent=`
.mscSpriteActions{padding:11px 13px;border-top:1px solid #70536f;background:#241b2b;color:#f5e5d2}
.mscActionHeader{display:flex;flex-direction:column;gap:4px}.mscActionHeader strong{font:700 14px Georgia,serif}
.mscActionHeader small{font:11px/1.45 system-ui;color:#e9c9bf}
.mscActionButtons{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.mscActionButtons button{font:11px system-ui;padding:7px 8px;border:1px solid #ab8a72;border-radius:7px;color:#fff2dd;background:#47304c}
.mscActionButtons button[aria-pressed="true"]{outline:2px solid #e8c18c}
.mscActionButtons button:disabled{opacity:.52;cursor:not-allowed}
.mscSpriteStatus{font:11px/1.4 system-ui;color:#d8c7d5;margin:7px 0 0}
.mscLarge.mscSpritePose img{display:block;width:100%;height:100%;object-fit:contain}
`;document.head.append(style);
window.MajickSpriteActions={activate,refresh,available:Object.keys(POSES),get mode(){return mode},version:'3.4.2-unified-action-2'};
function start(){
 refresh();
 document.addEventListener('click',e=>{if(e.target instanceof Element && e.target.closest('.mscToggle'))queueMicrotask(refresh)},true);
 window.addEventListener('majick-save-status',()=>{
   if(mode!=='idle'&&!compatible()){++revision;mode='idle';original();renderControls()}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();