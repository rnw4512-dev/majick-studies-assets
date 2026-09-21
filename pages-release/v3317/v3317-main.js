// Majick Studies V3.3.32 WGU Terminology Lock — AUTHORITATIVE MAIN APP BRIDGE
(function(){
'use strict';

const RELEASE_LABEL='Moonlit Collegium • V3.3.32';
const RELEASE_TITLE='Majick Studies — V3.3.32 Moonlit Collegium';
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

// Learning Lab and Notes Forge belong to the main study app.
const previousScreenHTML=window.screenHTML;
if(typeof previousScreenHTML==='function'){
  window.screenHTML=function(){
    if(window.S?.screen==='learninglab'&&window.MajickLearningLab)return window.MajickLearningLab.render();
    if(window.S?.screen==='addmaterial'&&window.AddStudyMaterialPage)return window.AddStudyMaterialPage.render();
    return previousScreenHTML();
  };
}
const previousSideHTML=window.sideHTML;
if(typeof previousSideHTML==='function'){
  window.sideHTML=function(){
    let h=previousSideHTML();
    if(!h.includes('data-nav="learninglab"')){
      const learn='<button data-nav="learninglab" class="'+(window.S?.screen==='learninglab'?'active':'')+'" onclick="navigate(\'learninglab\')"><span>✦</span><span class="label">Learn Lab</span></button>';
      const target='<button data-nav="livinggrimoire"';
      const at=h.indexOf(target);
      if(at>=0)h=h.slice(0,at)+learn+h.slice(at);else h+=learn;
    }
    if(!h.includes('data-nav="addmaterial"')){
      const button='<button data-nav="addmaterial" class="'+(window.S?.screen==='addmaterial'?'active':'')+'" onclick="navigate(\'addmaterial\')"><span>✦</span><span class="label">Study Material</span></button>';
      const target='<button data-nav="livinggrimoire"';
      const at=h.indexOf(target);
      if(at>=0)h=h.slice(0,at)+button+h.slice(at);else h+=button;
    }
    return h;
  };
}

const NAV_STACK_KEY='majick_nav_stack_v3329';
let suppressNavHistory=false;
function readNavStack(){
  try{const value=JSON.parse(sessionStorage.getItem(NAV_STACK_KEY)||'[]');return Array.isArray(value)?value.filter(Boolean).slice(-30):[]}
  catch(_){return []}
}
function writeNavStack(stack){
  try{sessionStorage.setItem(NAV_STACK_KEY,JSON.stringify((stack||[]).filter(Boolean).slice(-30)))}catch(_){}
}
function tutorPanelOpen(){
  return !!document.querySelector('.learnPanel[data-panel="tutor"]:not([hidden])');
}
const previousNavigate=typeof window.navigate==='function'?window.navigate:null;
if(previousNavigate&&!previousNavigate.__v3329Navigation){
  const majickNavigate=function(route){
    const current=window.S?.screen||null;
    const next=String(route||'');
    if(!suppressNavHistory&&current&&next&&current!==next){
      const stack=readNavStack();
      if(stack[stack.length-1]!==current)stack.push(current);
      writeNavStack(stack);
    }
    return previousNavigate.apply(this,arguments);
  };
  majickNavigate.__v3329Navigation=true;
  window.navigate=majickNavigate;
}
window.majickBack=function(){
  if(window.S?.screen==='learninglab'&&tutorPanelOpen()&&window.MajickCourseTutor?.show){
    window.MajickCourseTutor.show('path');
    ensureBackButton();
    return;
  }
  const current=window.S?.screen||'home';
  const stack=readNavStack();
  let target=null;
  while(stack.length&&!target){
    const candidate=stack.pop();
    if(candidate&&candidate!==current)target=candidate;
  }
  writeNavStack(stack);
  target=target||'home';
  try{
    suppressNavHistory=true;
    if(previousNavigate)previousNavigate(target);
    else if(window.S){S.screen=target;save?.();render?.()}
  }catch(e){console.warn('Majick back navigation',e)}
  finally{suppressNavHistory=false}
};
function ensureBackStyles(){
  if(document.getElementById('v3329BackStyles'))return;
  const style=document.createElement('style');
  style.id='v3329BackStyles';
  style.textContent='#majickBackButton{position:fixed;z-index:95;top:70px;left:268px;display:inline-flex;align-items:center;gap:7px;cursor:pointer;border:1px solid rgba(198,160,214,.34);border-radius:999px;background:rgba(20,12,28,.94);color:#eadff0;padding:8px 12px;font:750 11px/1 Arial,sans-serif;box-shadow:0 12px 30px rgba(3,1,8,.28);backdrop-filter:blur(10px)}#majickBackButton:hover,#majickBackButton:focus-visible{border-color:#c09bd2;background:#2a1934;outline:none;box-shadow:0 0 0 2px rgba(192,155,210,.15),0 12px 30px rgba(3,1,8,.28)}#majickBackButton span{color:#d6b66e}@media(max-width:900px){#majickBackButton{left:14px;top:66px;padding:7px 10px}}';
  document.head.appendChild(style);
}
function ensureBackButton(){
  ensureBackStyles();
  const existing=document.getElementById('majickBackButton');
  if(window.S?.screen==='home'){
    existing?.remove();
    return;
  }
  const btn=existing||document.createElement('button');
  btn.id='majickBackButton';
  btn.type='button';
  btn.setAttribute('aria-label','Go back');
  btn.innerHTML='<span>←</span> Back';
  btn.onclick=window.majickBack;
  if(!existing)document.body.appendChild(btn);
}
window.addEventListener('keydown',ev=>{
  if(ev.altKey&&ev.key==='ArrowLeft'){
    ev.preventDefault();
    window.majickBack?.();
  }
});

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
function furnitureAccountState(){
  try{return window.MajickStateCore?.ensureAccount?.()?.sanctuaryFurniture||window.S?.majickAccount?.sanctuaryFurniture||null}catch(_){return null}
}
window.v3321PushFurnitureState=function(target){
  const state=furnitureAccountState();
  if(!state)return;
  const payload={type:'MAJICK_SANCTUARY_FURNITURE_SYNC_V3321',state};
  if(target){
    try{target.postMessage(payload,location.origin)}catch(_){}
    return;
  }
  document.querySelectorAll('.v3317SanctuaryFrame').forEach(f=>{
    try{f.contentWindow?.postMessage(payload,location.origin)}catch(_){}
  });
};

function sanctuaryMarkup(context){
  if(location.protocol==='file:'){
    return '<section class="phase4Wrap"><div class="phase4Top"><b>✦ Phaser 4 Living Sanctuary</b><br><span>Open Majick Studies through GitHub Pages so Phaser can load.</span></div></section>';
  }
  const q='?v=3325-guardian-visual&context='+encodeURIComponent(context||'app');
  return '<section class="phase4Wrap v3317Phase" aria-label="Phaser 4 Living Sanctuary">'+
    '<div class="phase4Top"><div><b>✦ Living Sanctuary • V3.3.25</b><br><span>Protected Guardian movement • personalized nooks • furniture storage</span></div>'+
    '<div class="phase4Actions"><button class="btn ghost" onclick="phase4OpenFullscreen()">Full Sanctuary</button><button class="btn primary" onclick="navigate(\'addmaterial\')">Add Study Material</button></div></div>'+
    '<iframe class="phase4Frame v3317SanctuaryFrame" src="sanctuary/index.html'+q+'" title="Majick Studies Living Sanctuary" loading="eager" allow="fullscreen" onload="setTimeout(()=>{v3317PushGuardianLevels();v3321PushFurnitureState();},120)"></iframe>'+
    '<div class="phase4Help">Personal Guardian nooks • feeding + play zones • store/place owned furniture • Cozy Dorm layout preset.</div>'+
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
      try{navigate(d.route)}catch(e){console.error('V3.3.18 route bridge',e)}
    }
    if(d.type==='MAJICK_CONTINUE_STUDYING'){
      try{navigate('mission')}catch(_){}
    }
    if(d.type==='MAJICK_SANCTUARY_READY_V3317'){
      window.v3317PushGuardianLevels();
      window.v3321PushFurnitureState(ev.source);
    }
    if(d.type==='MAJICK_SANCTUARY_FURNITURE_REQUEST_V3321'){
      window.v3321PushFurnitureState(ev.source);
    }
    if(d.type==='MAJICK_SANCTUARY_FURNITURE_STATE_V3321'&&d.state){
      try{
        const account=window.MajickStateCore?.ensureAccount?.()||(S.majickAccount=S.majickAccount||{});
        account.sanctuaryFurniture={
          schemaVersion:1,
          version:'3.3.21',
          owned:[...new Set((d.state.owned||[]).filter(Boolean).map(String))],
          stored:[...new Set((d.state.stored||[]).filter(Boolean).map(String))],
          preset:d.state.preset||null,
          updatedAt:Number(d.state.updatedAt||Date.now())
        };
        save();
      }catch(e){console.warn('V3.3.21 furniture state bridge',e)}
    }
  });
}


function lowValueD772Prompt(q){
  const p=String(q?.prompt||'').toLowerCase();
  return /according to your notes|from your notes|concept-and-evidence pairing|concept and evidence pairing|strongest evidence for the concept|best completes this statement/.test(p);
}
function sessionContainsLowValueD772(){
  try{
    if(!window.session)return false;
    const text=JSON.stringify(window.session);
    return /according to your notes|from your notes|concept-and-evidence pairing|concept and evidence pairing|strongest evidence for the concept|best completes this statement/i.test(text);
  }catch(_){return false}
}
function refreshD772PracticeSync(){
  try{
    if(window.S?.activeCourse!=='D772')return {changed:false,reason:'not-d772'};
    const c=window.S?.courses?.D772;
    const builder=window.MajickQuestionBuilder;
    if(!c||!Array.isArray(c.questionBank)||!builder?.d772Questions)return {changed:false,reason:'bank-unavailable'};
    const before=c.questionBank.length;
    const curated=builder.d772Questions('d772-master-section-1')
      .filter(q=>!builder.isLowValueMetaQuestion?.(q));
    c.questionBank=[...curated];
    let clearedSession=false;
    if(sessionContainsLowValueD772()){
      try{window.session=null}catch(_){}
      try{session=null}catch(_){}
      clearedSession=true;
      if(window.S?.screen==='mission')window.S.screen='learninglab';
      window.__majickD772PracticeRefreshNotice=true;
    }
    return {changed:true,removed:before,added:curated.length,clearedSession};
  }catch(e){console.warn('D772 concept-bank refresh',e);return {changed:false,error:String(e)}}
}
window.v3331RefreshD772Practice=refreshD772PracticeSync;

async function hydrateGeneratedQuestions(){
  try{
    if(!window.MajickMaterialStore||typeof course!=='function')return;
    const c=course();
    if(c?.id)await window.MajickMaterialStore.injectQuestions(c,c.id);
  }catch(e){console.warn('V3.3.18 notes hydration',e)}
}

async function retireOldMajickCaches(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map(r=>r.unregister()));
    }
  }catch(e){console.warn('V3.3.18 service-worker cleanup',e)}
  try{
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.allSettled(keys.filter(k=>String(k).startsWith('majick-studies-')).map(k=>caches.delete(k)));
    }
  }catch(e){console.warn('V3.3.18 cache cleanup',e)}
}

function applyReleaseBadge(){
  const pill=document.querySelector('.top .pill');
  if(pill&&pill.textContent!==RELEASE_LABEL)pill.textContent=RELEASE_LABEL;
  if(document.title!==RELEASE_TITLE)document.title=RELEASE_TITLE;
  if(document.documentElement.dataset.majickVersion!=='3.3.32-wgu-terminology-lock'){
    document.documentElement.dataset.majickVersion='3.3.32-wgu-terminology-lock';
  }
}

function showRuntimeNotice(error){
  const message=String(error?.message||error||'Unknown runtime error');
  console.error('Majick V3.3.32 runtime error',error);
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
    const practiceRefresh=refreshD772PracticeSync();
    const result=previousRender.apply(this,arguments);
    try{window.MajickCourseManager?.decorateSelector?.()}catch(_){}
    if(window.S?.screen==='addmaterial'){
      setTimeout(()=>window.MajickCourseManager?.bindPanel?.(),0);
      setTimeout(()=>window.v3315BindStudyMaterialPage?.(),0);
    }
    if(window.S?.screen==='learninglab'){
      setTimeout(()=>window.MajickLearningLab?.bind?.(),0);
    }
    if(window.S?.screen==='home')setTimeout(()=>window.lfUpgradeHomeHabitat(),0);
    setTimeout(()=>{window.v3317PushGuardianLevels();window.v3321PushFurnitureState();},140);
    hydrateGeneratedQuestions();
    applyReleaseBadge();
    setTimeout(ensureBackButton,0);
    if(window.__majickD772PracticeRefreshNotice){
      window.__majickD772PracticeRefreshNotice=false;
      setTimeout(()=>{try{rewardToast('✦ D772 Practice Refreshed','Old note-matching questions were removed. Practice now tests the statistical concept and the clue WGU wants you to recognize.')}catch(_){}},0);
    }
    if(window.__majickXpRecoveryPending&&!window.__majickXpRecoveryPersisting){
      const repair=window.__majickXpRecoveryPending;
      window.__majickXpRecoveryPending=null;
      window.__majickXpRecoveryPersisting=true;
      setTimeout(()=>{
        try{
          if(typeof save==='function')save();
          if(typeof rewardToast==='function')rewardToast('✦ Majick XP Restored',Math.round(Number(repair.restoredTo)||0)+' lifetime XP recovered and protected.');
        }catch(e){console.warn('Majick XP recovery persistence',e)}
        finally{window.__majickXpRecoveryPersisting=false}
      },0);
    }
    return result;
  };
}else{
  console.error('Majick V3.3.22: base render function was missing; refusing to install a broken wrapper.');
}

const observer=new MutationObserver(()=>{
  applyReleaseBadge();
  ensureBackButton();
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