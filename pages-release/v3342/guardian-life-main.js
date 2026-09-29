(()=>{
'use strict';
const VERSION='3.3.42';
const CELEBRATION_VERSION='3.3.50';
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const STAGE={'new-bond':'New Bond','apprentice':'Apprentice','guardian':'Guardian','ascendant':'Ascendant','celestial':'Celestial'};
const STAGE_ORDER=['new-bond','apprentice','guardian','ascendant','celestial'];
const STAGE_ROMAN={'new-bond':'I','apprentice':'II','guardian':'III','ascendant':'IV','celestial':'V'};
const STAGE_CELEBRATION={
  'new-bond':{headline:'A New Bond Begins',lead:'A new magical companion has answered your call.',stars:18,mark:'✦'},
  apprentice:{headline:'Potential Awakened',lead:'Study and bond have awakened a stronger form.',stars:28,mark:'☾'},
  guardian:{headline:'Guardian Form Unlocked',lead:'Your shared work has forged a true Guardian bond.',stars:36,mark:'✦'},
  ascendant:{headline:'Ascendant Power Awakened',lead:'Your Guardian has crossed into a rare and radiant form.',stars:46,mark:'✧'},
  celestial:{headline:'Celestial Form Achieved',lead:'A brilliant milestone — your Guardian has reached its highest known form.',stars:60,mark:'★'}
};
const CELEBRATION={
  luna:{display:'Velora',sigil:'☾',role:'Moon Cat',line:'Velora’s quiet confidence has deepened. Expect more thoughtful pauses, cozy routines, and calm companionship.'},
  ember:{display:'Cascade',sigil:'◇',role:'Pocket Dragon',line:'Cascade’s spark has grown steadier. Expect bolder play, focused curiosity, and more energetic Sanctuary reactions.'},
  nova:{display:'Solstice',sigil:'✦',role:'Star Fox',line:'Solstice’s star-sense has brightened. Expect more exploration, telescope curiosity, and quick bursts of discovery.'},
  mallow:{display:'Aurelia',sigil:'♡',role:'Winged Bunny',line:'Aurelia’s gentle magic has opened further. Expect warmer affection, cozy nesting, and more playful social moments.'},
  vesper:{display:'Vesper',sigil:'✧',role:'Insight Keeper',line:'Vesper’s insight has sharpened. Expect more watchful pauses, magical reactions, and thoughtful curiosity.'},
  briar:{display:'Briar',sigil:'❀',role:'Moonlit Fawn',line:'Briar’s curiosity is blooming into confidence. Expect more exploring, investigating, and quiet discoveries.'},
  zephyr:{display:'Zephyr',sigil:'☾',role:'Momentum Keeper',line:'Zephyr’s momentum is building. Expect more energetic roaming, playful movement, and quick reactions.'},
  prism:{display:'Prism',sigil:'◇',role:'Crystal Axolotl',line:'Prism’s imagination is awakening. Expect more fascination with crystals, light, and unusual Sanctuary objects.'},
  rook:{display:'Rook',sigil:'✦',role:'Strategy Keeper',line:'Rook’s strategy is taking shape. Expect more observant pauses, deliberate movement, and favorite lookout spots.'},
  solara:{display:'Solara',sigil:'☀',role:'Courage Keeper',line:'Solara’s courage is glowing brighter. Expect warmer reactions, bold exploration, and cheerful bursts of energy.'}
};

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
function fitEvolutionArt(img){
  if(!img)return;
  const w=Number(img.naturalWidth||0),h=Number(img.naturalHeight||0);
  img.classList.remove('portrait','landscape','square');
  if(!w||!h)return;
  const ratio=w/h;
  img.classList.add(ratio>1.18?'landscape':ratio<.84?'portrait':'square');
}
function celebrationFor(p){
  const type=String(p?.type||'').toLowerCase();
  const reg=window.MajickGuardianRegistry?.get?.(type)||{};
  return CELEBRATION[type]||{display:p?.name||reg.name||'Guardian',sigil:reg.icon||'✦',role:reg.species||'Guardian',line:(p?.name||reg.name||'Your Guardian')+' has awakened a new layer of personality and Sanctuary behavior.'};
}
function personalityLine(p,stage){
  const c=celebrationFor(p);
  return c.line+' '+c.display+' has reached '+(STAGE[stage]||stage)+'.';
}
function stagePath(stage){
  return STAGE_ORDER.map(s=>{
    const active=s===stage,done=STAGE_ORDER.indexOf(s)<STAGE_ORDER.indexOf(stage);
    return '<div class="majEvoStage '+(active?'active ':done?'done ':'')+'"><span>'+(done?'✓':active?'✦':'')+'</span><b>'+E(STAGE[s])+'</b></div>';
  }).join('<i>→</i>');
}
function showEvolutionCeremony(d,p){
  const stage=String(d.stage||''); if(!stage)return;
  if(typeof document==='undefined'||!document.body||typeof document.createElement!=='function')return;
  document.getElementById?.('majEvolutionCelebration')?.remove();

  const name=String(d.name||p?.name||'Guardian');
  const img=stageImage(p,stage);
  const oldStage=STAGE[d.previousStage]||'New Bond';
  const celebration=celebrationFor(p);
  const stageCelebration=STAGE_CELEBRATION[stage]||STAGE_CELEBRATION.apprentice;

  const host=document.createElement('div');
  host.id='majEvolutionCelebration';
  host.className='majEvoBackdrop majEvo-'+stage;
  host.innerHTML=
    '<div class="majEvoStars" aria-hidden="true">'+Array.from({length:stageCelebration.stars},(_,i)=>'<i style="--i:'+i+'">'+E(i%7===0?stageCelebration.mark:'✦')+'</i>').join('')+'</div>'+
    '<section class="majEvoCard" role="dialog" aria-modal="true" aria-labelledby="majEvoTitle">'+
      '<div class="majEvoAura" aria-hidden="true"></div>'+
      '<p class="majEvoKicker">'+E(celebration.sigil)+' GUARDIAN EVOLUTION '+E(celebration.sigil)+'</p>'+
      '<div class="majEvoStageHeadline">'+E(stageCelebration.headline)+'</div>'+
      '<div class="majEvoArtStage">'+
        '<div class="majEvoHalo majEvoHaloOne" aria-hidden="true"></div>'+
        '<div class="majEvoHalo majEvoHaloTwo" aria-hidden="true"></div>'+
        '<div class="majEvoSigil" aria-hidden="true">'+E(celebration.sigil)+'</div>'+
        '<div class="majEvoArtWrap">'+(img?'<img class="majEvoArt" src="'+E(img)+'" alt="'+E(name+', '+(STAGE[stage]||stage))+'">':'<div class="majEvoFallback">✦</div>')+'</div>'+
        '<div class="majEvoArtCaption"><strong>'+E(name)+'</strong><span>'+E(celebration.role)+'</span></div>'+
      '</div>'+
      '<div class="majEvoBadge"><span>'+E(celebration.sigil)+' '+E(STAGE[stage]||stage)+' '+E(celebration.sigil)+'</span><small>'+E(celebration.role)+' • STAGE '+E(STAGE_ROMAN[stage]||'')+' AWAKENED</small></div>'+
      '<h2 id="majEvoTitle">'+E(name)+' became '+((stage==='apprentice'||stage==='ascendant')?'an ':'a ')+E(STAGE[stage]||stage)+'!</h2>'+
      '<p class="majEvoLead">'+E(stageCelebration.lead)+' Your studies strengthened '+E(name)+"'s bond enough to awaken this form.</p>"+
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
  const art=host.querySelector('.majEvoArt');
  if(art){
    const fit=()=>fitEvolutionArt(art);
    if(art.complete)fit(); else art.addEventListener('load',fit,{once:true});
  }

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
  if(already)return false;
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
window.MajickGuardianLife={VERSION,CELEBRATION_VERSION,recordEvolution,nookSummary,decorate,showEvolutionCeremony,profiles:CELEBRATION,stageCelebrations:STAGE_CELEBRATION};
document.documentElement.dataset.majickGuardianLife=VERSION;
})();