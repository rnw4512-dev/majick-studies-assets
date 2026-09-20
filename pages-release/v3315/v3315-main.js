(function(){
'use strict';

const STAGE_ORDER=['new-bond','apprentice','guardian','ascendant','celestial'];
const STAGE_NAMES={'new-bond':'New Bond','apprentice':'Apprentice','guardian':'Guardian','ascendant':'Ascendant','celestial':'Celestial'};
const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'')}};

function levelOf(p){
  let n=Math.max(1,Number(p?.level||1)||1);
  try{if(typeof masPetLevel==='function')n=Math.max(1,Number(masPetLevel(p))||1)}catch(_){}
  return n;
}
function resolveStage(level){
  const n=Math.max(1,Number(level)||1);
  if(n>=12)return {slug:'celestial',name:'Celestial',index:4,min:12,max:null};
  if(n>=8)return {slug:'ascendant',name:'Ascendant',index:3,min:8,max:11};
  if(n>=5)return {slug:'guardian',name:'Guardian',index:2,min:5,max:7};
  if(n>=3)return {slug:'apprentice',name:'Apprentice',index:1,min:3,max:4};
  return {slug:'new-bond',name:'New Bond',index:0,min:1,max:2};
}
function canonId(type){return CANON[type]||type}
function evolutionAsset(type,level,action){
  const c=canonId(type),st=resolveStage(level),a=action||'walk';
  return 'sanctuary/assets/evolutions/'+c+'/'+st.slug+'/'+a+'.webp?v=3315';
}
function approvedFallback(type,level){
  const c=canonId(type),st=resolveStage(level);
  return 'assets/familiars/evolution_stages/'+c+'-'+st.slug+'.webp?v=3315';
}
function stateForPet(p){
  const level=levelOf(p),stage=resolveStage(level);
  return {
    type:p?.type||'',
    canon:canonId(p?.type||''),
    level,
    stageIndex:stage.index,
    stage:stage.name,
    stageSlug:stage.slug,
    assets:{
      walk:evolutionAsset(p?.type,level,'walk'),
      play:evolutionAsset(p?.type,level,'play'),
      sleep:evolutionAsset(p?.type,level,'sleep')
    },
    fallback:approvedFallback(p?.type,level)
  };
}
window.v3315ResolveStage=resolveStage;
window.v3315GuardianStageState=stateForPet;
window.v3315EvolutionAsset=evolutionAsset;

const oldPortrait=window.v334Portrait;
window.v334Portrait=function(p,variant='card'){
  if(!p||!CANON[p.type])return oldPortrait?oldPortrait(p,variant):'';
  let c=null;try{c=typeof v338Canon==='function'?v338Canon(p.type):(window.V338_CANON||{})[p.type]}catch(_){}
  const st=stateForPet(p);
  const fallback=c?.portrait||st.fallback;
  const priority=(variant==='sidebar'||variant==='study')?'eager':'lazy';
  return '<div class="familiarPortrait '+variant+' v3315StagePortrait" data-pet-type="'+E(p.type)+'" data-stage="'+E(st.stageSlug)+'" title="'+E((c?.display||p.name)+' • '+st.stage)+'">'+
    '<img src="'+st.assets.walk+'" data-stage-fallback="'+st.fallback+'" data-fallback="'+E(fallback)+'" loading="'+priority+'" decoding="async" '+(priority==='eager'?'fetchpriority="high"':'')+
    ' onerror="if(this.dataset.stageFallback){const x=this.dataset.stageFallback;this.dataset.stageFallback=\'\';this.src=x}else if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" alt="'+E((c?.display||p.name)+', '+st.stage)+'">'+
    '<span class="v3313Stage">'+E(st.stage)+'</span></div>';
};

window.v3312StageImage=function(type,index){
  const fakeLevel=[1,3,5,8,12][Math.max(0,Math.min(4,Number(index)||0))];
  return evolutionAsset(type,fakeLevel,'walk');
};
window.v3312CurrentGuardianImage=function(p){return evolutionAsset(p?.type||'luna',levelOf(p),'walk')};
window.v3313CurrentImage=window.v3312CurrentGuardianImage;

const oldScreen=window.screenHTML;
window.screenHTML=function(){
  if(window.S?.screen==='addmaterial'&&window.AddStudyMaterialPage)return AddStudyMaterialPage.render();
  return oldScreen();
};

const oldSide=window.sideHTML;
window.sideHTML=function(){
  let h=oldSide();
  if(!h.includes('data-nav="addmaterial"')){
    const button='<button data-nav="addmaterial" class="'+(window.S?.screen==='addmaterial'?'active':'')+'" onclick="navigate(\'addmaterial\')"><span>✦</span><span class="label">Study Material</span></button>';
    const target='<button data-nav="livinggrimoire"';
    const at=h.indexOf(target);
    if(at>=0)h=h.slice(0,at)+button+h.slice(at);else h+=button;
  }
  return h;
};

window.v3314PushGuardianLevels=function(){
  const out={};
  for(const p of (window.S?.legacy?.pets||[])){
    if(!CANON[p.type])continue;
    out[p.type]=stateForPet(p);
  }
  const payload={type:'MAJICK_GUARDIAN_LEVELS_V3314',guardians:out,resolverVersion:'3315'};
  document.querySelectorAll('.v3314SanctuaryFrame').forEach(f=>{
    try{f.contentWindow?.postMessage(payload,location.origin)}catch(_){}
  });
};

async function hydrateGeneratedQuestions(){
  try{
    if(!window.MajickMaterialStore||typeof course!=='function')return;
    const c=course();if(c?.id)await MajickMaterialStore.injectQuestions(c,c.id);
  }catch(e){console.warn('V3.3.15 notes hydration',e)}
}

const oldRender=window.render;
window.render=function(){
  oldRender();
  if(window.S?.screen==='addmaterial')setTimeout(()=>window.v3315BindStudyMaterialPage?.(),0);
  hydrateGeneratedQuestions();
  try{setTimeout(()=>window.v3314PushGuardianLevels?.(),120)}catch(_){}
  const pill=document.querySelector('.top .pill');if(pill)pill.textContent='Living Familiars • V3.3.15 Notes Forge';
  document.title='Majick Studies — Notes Forge';
};

try{hydrateGeneratedQuestions();render()}catch(e){console.error('V3.3.15 main',e)}
})();