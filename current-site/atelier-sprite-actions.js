(()=>{
'use strict';
if(window.MajickSpriteActions)return;
const ROOT='./assets/atelier/v2/sprites/';
const POSES=Object.freeze({idle:'standing.webp',study:'studying_read.webp',write:'writing.webp',feed:'feeding_pets.webp',play:'playing.webp',sleep:'sleeping.webp'});
const LABELS={idle:'Stand',study:'Read',write:'Write',feed:'Feed Guardian',play:'Play with Guardian',sleep:'Rest'};
const DEFAULT_MSG='The original fitted scholar remains your saved appearance. These fixed-look poses are separate action sprites.';
let mode='idle',timer=null,frame=0,live=false,lastCareMessage='';
let pane=null;
const poseSrc=k=>ROOT+'poses/'+POSES[k];
function p(){return window.MajickAtelier?.player?.()||{}}
function compatible(){const s=p();return Number(s.hair)===0&&Number(s.robe)===1&&![0,5].includes(Number(s.skin))}
function dock(){return document.querySelector('#majickScholarCompanion .mscPanel')}
function stop(){if(timer){clearInterval(timer);timer=null}frame=0}
function draw(){
 const d=dock();if(!d)return;
 if(!pane){pane=document.createElement('section');pane.className='mscSpriteActions';pane.setAttribute('aria-label','Scholar activity controls');d.append(pane)}
 const okay=compatible();
 pane.innerHTML='<div class="mscActionHeader"><strong>Scholar activities</strong><small>'+ (okay?'Fixed-look activity illustrations available':'Activity illustrations do not match your current outfit or hairstyle')+'</small></div><div class="mscActionButtons">'+Object.keys(POSES).map(k=>'<button type="button" data-action-pose="'+k+'" aria-pressed="'+(mode===k)+'">'+LABELS[k]+'</button>').join('')+'<button type="button" disabled title="Awaiting validated fitted walk-cycle frames">Walk · artwork pending</button></div><p class="mscSpriteStatus" role="status">'+DEFAULT_MSG+'</p>';
 pane.querySelector('.mscSpriteStatus').textContent=lastCareMessage||DEFAULT_MSG;
 pane.querySelectorAll('[data-action-pose]').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.actionPose)));
}
function showAction(k){
 const panel=dock();const target=panel?.querySelector('.mscLarge');if(!target)return;
 if(k==='idle'){window.MajickScholarCompanion?.refresh?.(true);return}
 // The generated pose illustrations are complete characters, not fitted wearable layers.
 // Never override someone else's equipped appearance without disclosing the mismatch.
 if(!compatible()){
   window.MajickScholarCompanion?.react?.(k==='feed'||k==='play'?'guardian-bonding':'studying');
   const status=pane?.querySelector('.mscSpriteStatus');if(status)status.textContent=(lastCareMessage?lastCareMessage+' ':'')+'Kept your equipped appearance; a matching layered pose for this outfit is not ready.';
   return;
 }
 const source=poseSrc(k==='walk'?'idle':k);
 const image=new Image();image.alt=LABELS[k]||'Scholar';image.decoding='async';
 image.onerror=()=>{window.MajickScholarCompanion?.refresh?.(true);const status=pane?.querySelector('.mscSpriteStatus');if(status)status.textContent='This action sprite did not load; your usual avatar was restored.'};
 image.src=source;
 image.onload=()=>{if(mode!==k)return;target.replaceChildren(image);target.classList.add('mscSpritePose')};
}
function activate(action){
 stop();
 lastCareMessage='';
 mode=action;
 if(action==='feed'||action==='play'){
  const care=window.MajickGuardianCare;
  const snap=care?.snapshot?.();
  const guardian=snap?.roster?.find(g=>g.petId===snap.focusPetId)||snap?.roster?.[0];
  if(!guardian||!care?.performAction){
   lastCareMessage='No bonded Guardian is available. Open Sanctuary to bond with a Guardian first.';
   mode='idle';draw();return;
  }
  const result=care.performAction(guardian.petId,action,{objectId:action==='feed'?'guardian-food-bowl':'guardian-play-rug'});
  lastCareMessage=result?.message||'Guardian care could not be completed.';
  if(!result?.ok){
   mode='idle';draw();return;
  }
  care.broadcastState?.();
  try{window.render?.()}catch(_){}
 }
 if(action==='walk'){
  const target=dock()?.querySelector('.mscLarge');
  if(!compatible()){
   window.MajickScholarCompanion?.react?.('walking');
   mode='idle';draw();return;
  }
  const frames=['standing.webp','studying_read.webp'];
  // No two validated, matching walk frames currently exist; retain the fitted idle avatar.
  mode='idle';window.MajickScholarCompanion?.refresh?.(true);draw();
  const status=pane?.querySelector('.mscSpriteStatus');if(status)status.textContent='Walking requires two matching, fitted frames. Existing movement is preserved; the extracted body frames are not safe to equip.';
  return;
 }
 if(action==='feed'||action==='play')window.MajickScholarCompanion?.react?.('guardian-bonding');
 else if(action==='study'||action==='write')window.MajickScholarCompanion?.react?.('studying');
 else if(action==='sleep')window.MajickScholarCompanion?.react?.('sleeping');
 draw();showAction(action);
}
function refresh(){
 if(!dock()){pane=null;return}
 if(pane&&!pane.isConnected)pane=null;
 if(!pane)draw();
}
const style=document.createElement('style');style.textContent=`
.mscSpriteActions{padding:11px 13px;border-top:1px solid #70536f;background:#241b2b;color:#f5e5d2}
.mscActionHeader{display:flex;flex-direction:column;gap:4px}.mscActionHeader strong{font:700 14px Georgia,serif}.mscActionHeader small{font:11px/1.45 system-ui;color:#e9c9bf}
.mscActionButtons{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.mscActionButtons button{font:11px system-ui;padding:7px 8px;border:1px solid #ab8a72;border-radius:7px;color:#fff2dd;background:#47304c}
.mscActionButtons button[aria-pressed="true"]{outline:2px solid #e8c18c}
.mscSpriteStatus{font:11px/1.4 system-ui;color:#d8c7d5;margin:7px 0 0}
.mscLarge.mscSpritePose img{display:block;width:100%;height:100%;object-fit:contain}
`;document.head.append(style);
window.MajickSpriteActions={activate,refresh,available:Object.keys(POSES),get mode(){return mode},version:'3.4.2-activity-gated-1'};
function start(){refresh();const root=document.getElementById('majickScholarCompanion');if(root)new MutationObserver(refresh).observe(root,{childList:true,subtree:false});document.addEventListener('click',ev=>{const t=ev.target;if(!(t instanceof Element))return;if(t.closest('.mscToggle'))queueMicrotask(refresh)},true);document.addEventListener('majick-scholar-react',()=>{if(mode!=='idle'){mode='idle';refresh()}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();