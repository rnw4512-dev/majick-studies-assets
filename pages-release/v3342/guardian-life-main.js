(()=>{
'use strict';
const VERSION='3.3.50-celebration';
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const STAGE={'new-bond':'New Bond','apprentice':'Apprentice','guardian':'Guardian','ascendant':'Ascendant','celestial':'Celestial'};
const STAGE_ORDER=['new-bond','apprentice','guardian','ascendant','celestial'];
const STAGE_ROMAN={'new-bond':'I','apprentice':'II','guardian':'III','ascendant':'IV','celestial':'V'};

function account(){try{return window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount||null}catch(_){return window.S?.majickAccount||null}}
function pets(){return (window.S?.legacy?.pets||[]).filter(Boolean)}
function petFor(d){return pets().find(p=>p.id===d.guardianId||p.type===d.guardianType)||null}
function save(){try{window.save?.()}catch(_){}}
function stageImage(p,stage){
  try{
    const idx=Math.max(0,STAGE_ORDER.indexOf(stage));
    return window.v3312StageImage?.(p.type,idx)||window.v3312CurrentGuardianImage?.(p)||'';
  }catch(_){return ''}
}
function personalityLine(p,stage){
  const name=p?.name||'Your Guardian';
  const map={
    briar:'Curiosity is blooming into confidence. Expect more exploring, investigating, and quiet discoveries.',
    vesper:'Insight has sharpened. Expect more watchful pauses, magical reactions, and thoughtful curiosity.',
    zephyr:'Momentum is building. Expect more energetic roaming, playful movement, and quick reactions.',
    prism:'Imagination is awakening. Expect more fascination with crystals, light, and unusual Sanctuary objects.',
    rook:'Strategy is taking shape. Expect more observant pauses, deliberate movement, and favorite lookout spots.',
    solara:'Courage is glowing brighter. Expect warmer reactions, bold exploration, and cheerful bursts of energy.'
  };
  return map[String(p?.type||'').toLowerCase()] || (name+' has awakened new Sanctuary behavior at the '+(STAGE[stage]||stage)+' stage.');
}
function stagePath(stage){
  return STAGE_ORDER.map(s=>{
    const active=s===stage,done=STAGE_ORDER.indexOf(s)<STAGE_ORDER.indexOf(stage);
    return '<div class="majEvoStage '+(active?'active ':done?'done ':'')+'"><span>'+(done?'✓':active?'✦':'')+'</span><b>'+E(STAGE[s])+'</b></div>';
  }).join('<i>→</i>');
}
function showEvolutionCeremony(d,p){
  const stage=String(d.stage||''); if(!stage)return;
  document.getElementById('majEvolutionCelebration')?.remove();

  const name=String(d.name||p?.name||'Guardian');
  const img=stageImage(p,stage);
  const oldStage=STAGE[d.previousStage]||'New Bond';

  const host=document.createElement('div');
  host.id='majEvolutionCelebration';
  host.className='majEvoBackdrop';
  host.innerHTML=
    '<div class="majEvoStars" aria-hidden="true">'+Array.from({length:28},(_,i)=>'<i style="--i:'+i+'">✦</i>').join('')+'</div>'+
    '<section class="majEvoCard" role="dialog" aria-modal="true" aria-labelledby="majEvoTitle">'+
      '<div class="majEvoAura" aria-hidden="true"></div>'+
      '<p class="majEvoKicker">✦ GUARDIAN EVOLUTION ✦</p>'+
      '<div class="majEvoArtWrap">'+(img?'<img class="majEvoArt" src="'+E(img)+'" alt="'+E(name+', '+(STAGE[stage]||stage))+'">':'<div class="majEvoFallback">✦</div>')+'</div>'+
      '<div class="majEvoBadge"><span>☾ '+E(STAGE[stage]||stage)+' ☾</span><small>STAGE '+E(STAGE_ROMAN[stage]||'')+' AWAKENED</small></div>'+
      '<h2 id="majEvoTitle">'+E(name)+' became '+((stage==='apprentice'||stage==='ascendant')?'an ':'a ')+E(STAGE[stage]||stage)+'!</h2>'+
      '<p class="majEvoLead">Your studies strengthened '+E(name)+"'s bond enough to awaken a new form.</p>"+
      '<div class="majEvoPath">'+stagePath(stage)+'</div>'+
      '<div class="majEvoRewards">'+
        '<div><span>✦</span><b>+10 Bond</b><small>your connection deepened</small></div>'+
        '<div><span>✧</span><b>New Behavior</b><small>new Sanctuary personality unlocked</small></div>'+
        '<div><span>☾</span><b>New Reactions</b><small>more ways to respond and interact</small></div>'+
        '<div><span>◇</span><b>Codex Updated</b><small>'+E(oldStage)+' → '+E(STAGE[stage]||stage)+'</small></div>'+
      '</div>'+
      '<p class="majEvoFlavor">'+E(personalityLine(p,stage))+'</p>'+
      '<p class="majEvoGentle">Growth comes from the studying you already do — no care debt and no streak punishment.</p>'+
      '<button type="button" class="majEvoWelcome">Welcome Home ✦</button>'+
    '</section>';
  document.body.appendChild(host);

  requestAnimationFrame(()=>host.classList.add('show'));
  const btn=host.querySelector('.majEvoWelcome');
  btn?.focus();
  btn?.addEventListener('click',()=>{
    host.classList.add('closing');
    setTimeout(()=>host.remove(),420);
  },{once:true});
}
function recordEvolution(d){
  const p=petFor(d);if(!p)return false;
  const a=account();if(!a)return false;
  a.guardianJourney=a.guardianJourney||{schemaVersion:1,guardians:{},memories:[]};
  a.guardianJourney.guardians=a.guardianJourney.guardians||{};
  a.guardianJourney.memories=Array.isArray(a.guardianJourney.memories)?a.guardianJourney.memories:[];
  const row=a.guardianJourney.guardians[p.id]||(a.guardianJourney.guardians[p.id]={questProgress:0,questTarget:5,questCompletions:0,studyMoments:0,courses:{}});
  row.evolutions=row.evolutions||{};
  const stage=String(d.stage||'');if(!stage)return false;
  const already=!!row.evolutions[stage];
  if(!already){
    const at=new Date().toISOString();row.evolutions[stage]=at;row.latestStage=stage;row.latestStageAt=at;
    const key=p.id+'|evolution|'+stage;
    a.guardianJourney.memories.unshift({key,petId:p.id,type:p.type,name:d.name||p.name||'Guardian',course:window.S?.activeCourse||'WGU',kind:'evolution',text:(d.name||p.name||'Guardian')+' evolved into '+(STAGE[stage]||stage)+'. A new Sanctuary behavior awakened.',at});
    a.guardianJourney.memories=a.guardianJourney.memories.slice(0,80);
    const care=a.guardianCare?.guardians?.[p.id];if(care)care.bond=Math.max(0,Number(care.bond||0)+10);
    save();
  }
  showEvolutionCeremony(d,p);
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
window.MajickGuardianLife={VERSION,recordEvolution,nookSummary,decorate,showEvolutionCeremony};
document.documentElement.dataset.majickGuardianLife=VERSION;
})();