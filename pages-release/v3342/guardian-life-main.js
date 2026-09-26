(()=>{
'use strict';
const VERSION='3.3.42';
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const STAGE={'new-bond':'New Bond','apprentice':'Apprentice','guardian':'Guardian','ascendant':'Ascendant','celestial':'Celestial'};

function account(){try{return window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount||null}catch(_){return window.S?.majickAccount||null}}
function pets(){return (window.S?.legacy?.pets||[]).filter(Boolean)}
function petFor(d){return pets().find(p=>p.id===d.guardianId||p.type===d.guardianType)||null}
function save(){try{window.save?.()}catch(_){}}
function recordEvolution(d){
  const p=petFor(d);if(!p)return false;
  const a=account();if(!a)return false;
  a.guardianJourney=a.guardianJourney||{schemaVersion:1,guardians:{},memories:[]};
  a.guardianJourney.guardians=a.guardianJourney.guardians||{};
  a.guardianJourney.memories=Array.isArray(a.guardianJourney.memories)?a.guardianJourney.memories:[];
  const row=a.guardianJourney.guardians[p.id]||(a.guardianJourney.guardians[p.id]={questProgress:0,questTarget:5,questCompletions:0,studyMoments:0,courses:{}});
  row.evolutions=row.evolutions||{};
  const stage=String(d.stage||'');if(!stage||row.evolutions[stage])return false;
  const at=new Date().toISOString();row.evolutions[stage]=at;row.latestStage=stage;row.latestStageAt=at;
  const key=p.id+'|evolution|'+stage;
  a.guardianJourney.memories.unshift({key,petId:p.id,type:p.type,name:d.name||p.name||'Guardian',course:window.S?.activeCourse||'WGU',kind:'evolution',text:(d.name||p.name||'Guardian')+' evolved into '+(STAGE[stage]||stage)+'. A new Sanctuary behavior awakened.',at});
  a.guardianJourney.memories=a.guardianJourney.memories.slice(0,80);
  const care=a.guardianCare?.guardians?.[p.id];if(care)care.bond=Math.max(0,Number(care.bond||0)+10);
  save();
  try{window.rewardToast?.((d.name||p.name||'Guardian')+' evolved','✦ '+(STAGE[stage]||stage)+' • +10 Bond • New Sanctuary behavior unlocked')}catch(_){}
  try{window.MajickGuardianCore?.sound?.('course-pass',p.type);window.MajickGuardianCore?.sparks?.(document.querySelector('.v3341GuardianHeroPortrait,.v3341StudyGuardianPortrait'),34)}catch(_){}
  try{window.render?.()}catch(_){}
  setTimeout(decorate,40);
  return true;
}
function nookSummary(){
  const core=window.MajickGuardianCore,p=core?.activePet?.();if(!p)return null;
  const rows=pets(),idx=Math.max(0,rows.findIndex(x=>x.id===p.id));
  const snap=window.MajickGuardianCare?.snapshot?.()||{};
  const g=snap.guardians?.[p.id]||{},bed=g.preferredBed||(idx===0?'bed-west':idx===1?'bed-east':'guardian-bed-'+String(p.id).replace(/[^a-zA-Z0-9_-]/g,'-'));
  const bedLabel=bed==='bed-west'?'Moonstone Bed':bed==='bed-east'?'Amethyst Bed':'Personal Crystal Nest';
  return {bed:bedLabel,favorite:g.favoriteLabel||'Sanctuary Keepsake'};
}
function decorate(){
  const host=document.querySelector?.('.v3341GuardianHeroCopy');if(!host)return;
  let card=host.querySelector?.('.v3342NookSummary');const info=nookSummary();if(!info)return;
  if(!card){card=document.createElement('div');card.className='v3342NookSummary';const react=host.querySelector('.v3341ReactionLine');if(react)react.before(card);else host.appendChild(card)}
  card.innerHTML='<small>PERSONAL SANCTUARY NOOK</small><span>☾ '+E(info.bed)+'</span><span>✦ '+E(info.favorite)+'</span>';
}
window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};if(d.type==='MAJICK_GUARDIAN_EVOLUTION_V3342')recordEvolution(d);
});
const oldRender=window.render;
if(typeof oldRender==='function'&&!oldRender.__v3342){
  const fn=function(){const r=oldRender.apply(this,arguments);setTimeout(decorate,0);return r};fn.__v3342=true;window.render=fn;
}
setTimeout(decorate,0);
window.MajickGuardianLife={VERSION,recordEvolution,nookSummary,decorate};
document.documentElement.dataset.majickGuardianLife=VERSION;
})();