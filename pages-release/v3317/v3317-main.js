// Majick Studies V3.3.17 — AUTHORITATIVE MAIN APP BRIDGE
(function(){
'use strict';

const RELEASE_LABEL='Living Familiars • V3.3.18 Stability Reset';
const RELEASE_TITLE='Majick Studies — V3.3.18 Stability Reset';
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
  const st=stageForPet(p),name=c?.display||p.name||registry()?.get?.(p.type)?.name||canonOf(p.type),src=approvedStageImage(p.type,st.index);
  const fallback=c?.portrait||'';
  const priority=(variant==='sidebar'||variant==='study')?'eager':'lazy';
  return '<div class="familiarPortrait '+variant+' v3317ApprovedPortrait" data-pet-type="'+E(p.type)+'" data-stage="'+st.slug+'" style="--pet-accent:'+E(c?.accent||'#b99cff')+'" title="'+E(name+' • '+st.name)+'">'+
    '<img src="'+src+'" data-fallback="'+E(fallback)+'" loading="'+priority+'" decoding="async" '+(priority==='eager'?'fetchpriority="high"':'')+' onerror="this.onerror=null;if(this.dataset.fallback)this.src=this.dataset.fallback" alt="'+E(name+', '+st.name)+'">'+
    '<span class="v3313Stage">'+st.name+'</span></div>';
};

// Notes Forge belongs to the main study app.
const previousScreenHTML=window.screenHTML;
if(typeof previousScreenHTML==='function'){
  window.screenHTML=function(){
    if(window.S?.screen==='addmaterial'&&window.AddStudyMaterialPage)return window.AddStudyMaterialPage.render();
    return previousScreenHTML();
  };
}
const previousSideHTML=window.sideHTML;
if(typeof previousSideHTML==='function'){
  window.sideHTML=function(){
    let h=previousSideHTML();
    if(!h.includes('data-nav="addmaterial"')){
      const button='<button data-nav="addmaterial" class="'+(window.S?.screen==='addmaterial'?'active':'')+'" onclick="navigate(\'addmaterial\')"><span>✦</span><span class="label">Study Material</span></button>';
      const target='<button data-nav="livinggrimoire"';
      const at=h.indexOf(target);
      if(at>=0)h=h.slice(0,at)+button+h.slice(at);else h+=button;
    }
    return h;
  };
}

function guardianPayload(){
  const out={};
  for(const p of (window.S?.legacy?.pets||[])){
    const meta=registry()?.get?.(p.type);
    if(!meta)continue;
    const st=stageForPet(p);
    out[p.type]={
      type:p.type,
      canon:meta.canon,
      level:st.level,
      stageIndex:st.index,
      stageSlug:st.slug,
      stageName:st.name
    };
  }
  return {type:'MAJICK_GUARDIAN_LEVELS_V3317',guardians:out,resolverVersion:'3318-stability'};
}
window.v3317PushGuardianLevels=function(){
  const payload=guardianPayload();
  document.querySelectorAll('.v3317SanctuaryFrame').forEach(f=>{
    try{f.contentWindow?.postMessage(payload,location.origin)}catch(_){}
  });
};

function sanctuaryMarkup(context){
  if(location.protocol==='file:'){
    return '<section class="phase4Wrap"><div class="phase4Top"><b>✦ Phaser 4 Living Sanctuary</b><br><span>Open Majick Studies through GitHub Pages so Phaser can load.</span></div></section>';
  }
  const q='?v=3318-stability&context='+encodeURIComponent(context||'app');
  return '<section class="phase4Wrap v3317Phase" aria-label="Phaser 4 Living Sanctuary">'+
    '<div class="phase4Top"><div><b>✦ Living Sanctuary • V3.3.18</b><br><span>Protected Phase 4 movement • final-clean evolution art • manifest furniture</span></div>'+
    '<div class="phase4Actions"><button class="btn ghost" onclick="phase4OpenFullscreen()">Full Sanctuary</button><button class="btn primary" onclick="navigate(\'addmaterial\')">Add Study Material</button></div></div>'+
    '<iframe class="phase4Frame v3317SanctuaryFrame" src="sanctuary/index.html'+q+'" title="Majick Studies Living Sanctuary" loading="eager" allow="fullscreen" onload="setTimeout(()=>v3317PushGuardianLevels(),120)"></iframe>'+
    '<div class="phase4Help">Click furniture to use it • Edit Sanctuary lets you drag objects • Guardians keep the protected Phase 4 movement engine.</div>'+
  '</section>';
}
window.phase4SanctuaryHTML=function(){return sanctuaryMarkup('companions')};

window.phase4OpenFullscreen=function(){
  const f=document.querySelector('.v3317SanctuaryFrame');
  if(f?.requestFullscreen)f.requestFullscreen().catch(()=>{});
};

window.lfUpgradeHomeHabitat=function(){
  if(!window.S||S.screen!=='home')return;
  if(document.querySelector('.v3317HomeSanctuary'))return;
  const target=document.querySelector('.masHabitat,.majHabitat,.v3313Portal,.v3314HomeSanctuary,.v3316HomeSanctuary');
  if(!target)return;
  const wrap=document.createElement('section');
  wrap.className='v3317HomeSanctuary';
  wrap.innerHTML=sanctuaryMarkup('home');
  target.replaceWith(wrap);
  setTimeout(window.v3317PushGuardianLevels,150);
};

if(!window.__v3317Bridge){
  window.__v3317Bridge=true;
  window.addEventListener('message',ev=>{
    if(ev.origin!==location.origin)return;
    const d=ev.data||{};
    if((d.type==='MAJICK_OPEN_ROUTE_V3311'||d.type==='MAJICK_OPEN_ROUTE')&&d.route){
      try{navigate(d.route)}catch(e){console.error('V3.3.17 route bridge',e)}
    }
    if(d.type==='MAJICK_CONTINUE_STUDYING'){
      try{navigate('mission')}catch(_){}
    }
    if(d.type==='MAJICK_SANCTUARY_READY_V3317'){
      window.v3317PushGuardianLevels();
    }
  });
}

async function hydrateGeneratedQuestions(){
  try{
    if(!window.MajickMaterialStore||typeof course!=='function')return;
    const c=course();
    if(c?.id)await window.MajickMaterialStore.injectQuestions(c,c.id);
  }catch(e){console.warn('V3.3.17 notes hydration',e)}
}

async function retireOldMajickCaches(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map(r=>r.unregister()));
    }
  }catch(e){console.warn('V3.3.17 service-worker cleanup',e)}
  try{
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.allSettled(keys.filter(k=>String(k).startsWith('majick-studies-')).map(k=>caches.delete(k)));
    }
  }catch(e){console.warn('V3.3.17 cache cleanup',e)}
}

function applyReleaseBadge(){
  const pill=document.querySelector('.top .pill');
  if(pill&&pill.textContent!==RELEASE_LABEL)pill.textContent=RELEASE_LABEL;
  if(document.title!==RELEASE_TITLE)document.title=RELEASE_TITLE;
  if(document.documentElement.dataset.majickVersion!=='3.3.18-stability'){
    document.documentElement.dataset.majickVersion='3.3.18-stability';
  }
}

function showRuntimeNotice(error){
  const message=String(error?.message||error||'Unknown runtime error');
  console.error('Majick V3.3.17 runtime error',error);
  if(document.getElementById('v3317RuntimeNotice'))return;
  try{
    const n=document.createElement('div');
    n.id='v3317RuntimeNotice';
    n.className='v5Safe card';
    n.style.cssText='position:fixed;z-index:120;left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,90vw);box-shadow:0 30px 80px #33224b55';
    n.innerHTML='<h2>🌙 A study screen hit a snag</h2><p>Your progress is still stored.</p><p class="tiny">Runtime error: '+E(message)+'</p><button class="btn violet" id="v3317Reload">Reload screen</button> <button class="btn ghost" id="v3317Guide">Safe Study Guide</button>';
    document.body.appendChild(n);
    n.querySelector('#v3317Reload')?.addEventListener('click',()=>{n.remove();try{render()}catch(e){console.error(e)}});
    n.querySelector('#v3317Guide')?.addEventListener('click',()=>{n.remove();try{window.session=null;S.screen='guide';save();render()}catch(e){console.error(e)}});
  }catch(e){console.error('Could not show V3.3.17 runtime notice',e)}
}
window.addEventListener('error',ev=>{
  if(!ev.error){
    console.warn('Majick resource warning',ev.target?.src||ev.target?.href||ev.message||'unknown resource');
    return;
  }
  showRuntimeNotice(ev.error);
});
window.addEventListener('unhandledrejection',ev=>console.warn('Majick promise warning',ev.reason));

const previousRender=typeof window.render==='function'?window.render:null;
if(previousRender){
  window.render=function(){
    const result=previousRender.apply(this,arguments);
    try{window.MajickCourseManager?.decorateSelector?.()}catch(_){}
    if(window.S?.screen==='addmaterial'){
      setTimeout(()=>window.MajickCourseManager?.bindPanel?.(),0);
      setTimeout(()=>window.v3315BindStudyMaterialPage?.(),0);
    }
    if(window.S?.screen==='home')setTimeout(()=>window.lfUpgradeHomeHabitat(),0);
    setTimeout(()=>window.v3317PushGuardianLevels(),140);
    hydrateGeneratedQuestions();
    applyReleaseBadge();
    return result;
  };
}else{
  console.error('Majick V3.3.17: base render function was missing; refusing to install a broken wrapper.');
}

const observer=new MutationObserver(()=>{
  applyReleaseBadge();
  if(window.S?.screen==='home'&&!document.querySelector('.v3317HomeSanctuary')){
    try{window.lfUpgradeHomeHabitat()}catch(_){}
  }
});
observer.observe(document.documentElement,{childList:true,subtree:true});

retireOldMajickCaches();
applyReleaseBadge();
try{
  if(typeof window.render==='function')window.render();
  else throw new Error('Base render function is unavailable.');
}catch(e){showRuntimeNotice(e)}

})();