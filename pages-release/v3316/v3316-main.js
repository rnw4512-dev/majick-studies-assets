(function(){
'use strict';
const STAGE_SLUGS=['new-bond','apprentice','guardian','ascendant','celestial'];
const STAGE_NAMES=['New Bond','Apprentice','Guardian','Ascendant','Celestial'];
const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'')}};
function levelOf(p){try{return Math.max(1,Number(masPetLevel(p))||1)}catch(_){return Math.max(1,Number(p?.level||1)||1)}}
function stageIndex(p){const n=levelOf(p);return n>=12?4:n>=8?3:n>=5?2:n>=3?1:0}
function approvedStageImage(type,index){
  const c=CANON[type]||type,i=Math.max(0,Math.min(4,Number(index)||0));
  return 'assets/familiars/evolution_stages/'+c+'-'+STAGE_SLUGS[i]+'.webp?v=3316';
}
const priorPortrait=window.v334Portrait;
window.v334Portrait=function(p,variant='card'){
  if(!p||!CANON[p.type])return priorPortrait?priorPortrait(p,variant):'';
  let c=null;try{c=typeof v338Canon==='function'?v338Canon(p.type):(window.V338_CANON||{})[p.type]}catch(_){}
  const i=stageIndex(p),name=c?.display||p.name,src=approvedStageImage(p.type,i),fallback=c?.portrait||'';
  const priority=(variant==='sidebar'||variant==='study')?'eager':'lazy';
  return '<div class="familiarPortrait '+variant+' v3316ApprovedPortrait" data-pet-type="'+E(p.type)+'" data-stage="'+STAGE_SLUGS[i]+'" style="--pet-accent:'+E(c?.accent||'#b99cff')+'" title="'+E(name+' • '+STAGE_NAMES[i])+'">'+
    '<img src="'+src+'" data-fallback="'+E(fallback)+'" loading="'+priority+'" decoding="async" '+(priority==='eager'?'fetchpriority="high"':'')+' onerror="this.onerror=null;if(this.dataset.fallback)this.src=this.dataset.fallback" alt="'+E(name+', '+STAGE_NAMES[i])+'">'+
    '<span class="v3313Stage">'+STAGE_NAMES[i]+'</span></div>';
};
window.v3312StageImage=(type,index)=>approvedStageImage(type,index);
window.v3312CurrentGuardianImage=p=>approvedStageImage(p?.type||'luna',stageIndex(p));
window.v3313CurrentImage=window.v3312CurrentGuardianImage;

function homeSanctuary(){
  if(!window.S||S.screen!=='home'||typeof window.phase4SanctuaryHTML!=='function')return;
  const habitat=document.querySelector('.masHabitat,.majHabitat');
  if(!habitat)return;
  const outer=habitat.closest('.masPanel,.majHabitatPanel')||habitat;
  if(outer.classList?.contains('v3316HomeSanctuary'))return;
  const wrap=document.createElement('section');
  wrap.className='v3316HomeSanctuary';
  let html=window.phase4SanctuaryHTML();
  html=html.replace(/context=companions/g,'context=home');
  wrap.innerHTML=html;
  outer.replaceWith(wrap);
  setTimeout(()=>window.v3314PushGuardianLevels?.(),160);
}
window.v3316UpgradeHomeSanctuary=homeSanctuary;

const priorRender=window.render;
window.render=function(){
  priorRender();
  try{window.MajickCourseManager?.decorateSelector();}catch(_){}
  if(window.S?.screen==='addmaterial')setTimeout(()=>window.MajickCourseManager?.bindPanel(),0);
  setTimeout(homeSanctuary,0);
  const pill=document.querySelector('.top .pill');if(pill)pill.textContent='Living Familiars • V3.3.16 Course Realms';
  document.title='Majick Studies — Course Realms';
};
const obs=new MutationObserver(()=>{if(window.S?.screen==='home'&&document.querySelector('.masHabitat,.majHabitat'))homeSanctuary()});
obs.observe(document.documentElement,{childList:true,subtree:true});
try{window.MajickCourseManager?.ensure();render()}catch(e){console.error('V3.3.16 boot',e)}
})();