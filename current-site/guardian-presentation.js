/* Guardian presentation owner. Saved IDs and historical API aliases remain compatible. */
(()=>{'use strict';if(window.MajickGuardianPresentation)return;
const registry=()=>window.MajickGuardianRegistry;
const canonOf=type=>registry()?.get?.(type)?.canon||String(type||'').toLowerCase();
const STAGE_SLUGS=['new-bond','apprentice','guardian','ascendant','celestial'];
const STAGE_NAMES=['New Bond','Apprentice','Guardian','Ascendant','Celestial'];

function E(s){
  try{return esc(String(s??''))}
  catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
}
function levelOf(p){
  try{return Math.max(1,Number(masPetLevel(p))||1)}
  catch(_){return Math.max(1,Number(p?.level||1)||1)}
}
function stageIndexFromLevel(level){
  const n=Math.max(1,Number(level)||1);
  return n>=12?4:n>=8?3:n>=5?2:n>=3?1:0;
}
function stageForPet(p){
  const level=levelOf(p),index=stageIndexFromLevel(level);
  return {level,index,slug:STAGE_SLUGS[index],name:STAGE_NAMES[index]};
}
function approvedStageImage(type,index){
  const canon=canonOf(type);
  const i=Math.max(0,Math.min(4,Number(index)||0));
  return 'assets/familiars/evolution_stages/'+canon+'-'+STAGE_SLUGS[i]+'.webp?v=3317-clean';
}

window.v3317StageForPet=stageForPet;
window.v3312StageImage=(type,index)=>approvedStageImage(type,index);
window.v3312CurrentGuardianImage=p=>approvedStageImage(p?.type||'luna',stageForPet(p).index);
window.v3313CurrentImage=window.v3312CurrentGuardianImage;

// Approved UI portraits only. Walk/play/sleep art stays inside Phaser.
const priorPortrait=window.v334Portrait;
window.v334Portrait=function(p,variant='card'){
  if(!p||!registry()?.get?.(p.type))return priorPortrait?priorPortrait(p,variant):'';
  let c=null;
  try{c=typeof v338Canon==='function'?v338Canon(p.type):(window.V338_CANON||{})[p.type]}catch(_){}
  const st=stageForPet(p),name=p.name||c?.display||registry()?.get?.(p.type)?.name||canonOf(p.type);
  // Evolution sheets contain several panels and captions. Use the single-character art in compact portraits.
  const fallback=c?.portrait||'assets/familiars/canon/'+canonOf(p.type)+'-guardian.webp';
  const src=variant==='evolution'?approvedStageImage(p.type,st.index):fallback;
  const priority=(variant==='sidebar'||variant==='study')?'eager':'lazy';
  return '<div class="familiarPortrait '+variant+' v3317ApprovedPortrait" data-pet-type="'+E(p.type)+'" data-stage="'+st.slug+'" style="--pet-accent:'+E(c?.accent||'#b99cff')+'" title="'+E(name+' • '+st.name)+'">'+
    '<img src="'+src+'" data-fallback="'+E(fallback)+'" loading="'+priority+'" decoding="async" '+(priority==='eager'?'fetchpriority="high"':'')+' onerror="this.onerror=null;if(this.dataset.fallback)this.src=this.dataset.fallback" alt="'+E(name+', '+st.name)+'">'+
    '<span class="v3313Stage">'+st.name+'</span></div>';
};


const STAGES=['New Bond','Apprentice','Guardian','Ascendant','Celestial'],STAGE_SLUG=['new-bond','apprentice','guardian','ascendant','celestial'],STAGE_MIN=[1,3,5,8,12];
const esc12=E,canon12=t=>{try{return v338Canon(t)}catch(_){return window.V338_CANON?.[t]||null}},level12=levelOf,stageIndex12=p=>stageForPet(p).index,stageName12=p=>stageForPet(p).name;
const stageImage12=approvedStageImage,currentImage12=p=>approvedStageImage(p?.type||'luna',stageForPet(p).index);
const C=canon12,LV=levelOf,SI=stageIndex12,ST=STAGES,IMG=approvedStageImage;
function canonForPet(p){return canon12(p?.type||'luna')}
function syncEvo(){let v=window.MajickStateCore.legacyExtensions();for(const p of S.legacy?.pets||[]){let c=C(p.type);if(c)v.guardianEvolutionState[p.type]={displayName:c.display,level:LV(p),stage:ST[SI(p)],stageIndex:SI(p),image:IMG(p.type,SI(p)),updatedAt:Date.now()}}}
function coachHTML(){if(!session||session.finished||!session.current||session.focus)return '';const p=activePet(),c=canon12(p.type),d=petDef(p),text=session.answered?(p.familiar?.lastSpeech||lfStudyReaction(p,session.chosen===session.current.answer,session.current)):petTip(session.current),m=typeof lfMood==='function'?lfMood(p):{icon:'✦',label:'Ready'};return `<div class="lfStudyBuddy unifiedStudyBuddy v3312Coach" style="--pet-accent:${esc12(c?.accent||'#b99cff')}"><div>${v334Portrait(p,'study')}</div><div class="lfBuddyText"><div class="familiarIdentityLine">${esc12(c?.sigil||'✦')} ${esc12(c?.title||'Guardian')} • ${stageName12(p)} • Level ${level12(p)}</div><b>${esc12(c?.display||p.name)} • ${m.icon} ${esc12(m.label)}</b><p>${esc12(text)}</p><div class="lfBuddyActions">${!session.answered?`<button class="btn ghost" onclick="usePetAbility()">✦ ${esc12(d.abilityName)}</button>`:''}<button class="btn ghost" onclick="navigate('companions')">Evolution tree</button></div></div></div>`};

let closeEvolution=null;
function openEvolution(type){closeEvolution?.();const previousFocus=document.activeElement;const c=canon12(type);if(!c)return;const p=(S.legacy?.pets||[]).find(x=>x.type===type),ci=p?stageIndex12(p):2;const modal=document.createElement('div');modal.className='v3312Modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Guardian evolution');modal.innerHTML=`<div class="v3312ModalCard" style="--evo:${esc12(c.accent)}"><button type="button" class="v3312Close" aria-label="Close Guardian evolution" style="z-index:3">×</button><div class="eyebrow">GUARDIAN EVOLUTION TREE</div><h2>${esc12(c.display)} • ${esc12(c.title)}</h2><p>${esc12(c.species)}${p?` • Level ${level12(p)} • ${STAGES[ci]}`:''}</p><div class="v3312Tree">${STAGES.map((s,i)=>`<article class="${i===ci?'current':''}"><img src="${stageImage12(type,i)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${c.portrait}'"><b>${s}</b><small>Level ${STAGE_MIN[i]}+</small></article>`).join('')}</div><div class="v3312BannerFold"><details><summary>View the original approved five-stage banner</summary><img src="${c.banner}" loading="lazy" decoding="async"></details></div></div>`;const close=()=>{modal.remove();document.removeEventListener('keydown',onKey);closeEvolution=null;previousFocus?.focus?.({preventScroll:true})};
const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,summary,a,input,select,textarea,[tabindex]')].filter(n=>n.tabIndex>=0&&n.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.v3312Close'))close()});document.body.appendChild(modal);document.addEventListener('keydown',onKey);closeEvolution=close;modal.querySelector('.v3312Close').focus()};
function evoCard12(type,p){const c=canon12(type);if(!c)return'';const ci=p?stageIndex12(p):2;return `<article class="v3312EvoCard" style="--evo:${esc12(c.accent)}"><img src="${p?stageImage12(type,ci):c.portrait}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${c.portrait}'" alt="${esc12(c.display)}"><div><div class="eyebrow">${esc12(c.title)}</div><h3>${esc12(c.display)}</h3><p>${esc12(c.species)}${p?` • ${STAGES[ci]} • Lv ${level12(p)}`:' • Future bond'}</p><details class="majGuardianDetails"><summary>Personality and evolution</summary><p>${esc12(c.personality||c.studyRole||c.title)}</p><button class="btn ghost" onclick="v3312OpenEvolution('${esc12(type)}')">View 5 forms</button></details></div></article>`}
function companionHTML(){const base=typeof lfCompanionHTML==='function'?lfCompanionHTML():'';const pets=S.legacy?.pets||[];const types=Object.keys(V338_CANON||{}).filter(type=>!pets.some(p=>p.type===type));return base+`<section class="v3312EvolutionWrap"><div class="sectionTitle"><div><h2>Discover More Guardians</h2><p>The picture now changes automatically with the Guardian's actual level. Only the current forms load here to keep the page fast.</p></div></div><div class="v3312EvoGrid">${types.map(t=>evoCard12(t,pets.find(p=>p.type===t))).join('')}</div></section>`};
 // Replace the older emoji guardian dock with the approved canon art.
 if(typeof v523GuardianDockHTML==='function'){
   v523GuardianDockHTML=function(){
     if(S.screen!=='mission'||!session||session.finished||!session.current||session.focus||session.finalTransformation)return '';
     const pet=activePet(),c=canonForPet(pet),d=petDef(pet),stage=petStage(pet),tip=petTip(session.current);
     const img=c?.icon||c?.portrait||'';
     return `<div class="v523GuardianDock v3310CanonDock" id="v523GuardianDock"><div class="v3310PortraitStage">${img?`<img class="v3310Portrait" src="${img}" alt="${esc(c?.display||pet.name)}">`:`<span>${d.emoji||'✦'}</span>`}</div><div class="v523GuardianCopy"><b>${esc(c?.display||pet.name)} • ${esc(stage)} ${esc(c?.species||d.species)}</b><p>${esc(tip)}</p><span class="v523GuardianTag">${esc(typeof v523GuardianTag==='function'?v523GuardianTag(session.current):'Guardian tip')}</span>${!session.answered?`<button class="v523GuardianAbility" onclick="usePetAbility()">✦ ${esc(d.abilityName)}</button>`:''}</div></div>`;
   };
 }

function stageSlice(type,index,cls=''){const c=canon12(type);if(!c)return '';return '<div class="v3311Slice '+E(cls)+'" style="--slice-img:url(\''+c.banner+'\');--slice-pos:'+([0,25,50,75,100][index])+'%;--slice-accent:'+c.accent+'"><span>'+STAGES[index]+'</span></div>'}
window.MajickGuardianPresentation=Object.freeze({stageForPet,approvedStageImage,portrait:window.v334Portrait,coachHTML,companionHTML,openEvolution,syncEvolution:syncEvo,stageSlice,canon:canon12});
window.petCoachHTML=coachHTML;window.lfPetCoachHTML=coachHTML;window.companionHTML=companionHTML;
window.masPetImage=p=>canon12(p?.type)?.portrait||'';
window.v3312CoachHTML=coachHTML;window.v3312OpenEvolution=openEvolution;window.v3311SyncEvolution=syncEvo;window.v3311StageImage=approvedStageImage;window.v3311StageSlice=stageSlice;
syncEvo();
})();
