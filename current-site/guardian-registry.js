// Majick Studies Stability Reset — authoritative Guardian species + individual variant registry
(function(){
'use strict';

const GUARDIANS={
  luna:{type:'luna',canon:'velora',name:'Velora',species:'Moon Cat',role:'Focus Keeper',personality:'calm, observant, affectionate',accent:'#b79ad9',icon:'☾',favoriteItem:'velvet-moon-cushion',favoriteLabel:'Velvet Moon Cushion',hasProtectedMotion:true},
  ember:{type:'ember',canon:'cascade',name:'Cascade',species:'Pocket Dragon',role:'Persistence Keeper',personality:'bold, playful, stubbornly loyal',accent:'#e78c72',icon:'◇',favoriteItem:'rune-puzzle',favoriteLabel:'Rune Puzzle',hasProtectedMotion:true},
  nova:{type:'nova',canon:'solstice',name:'Solstice',species:'Star Fox',role:'Discovery Keeper',personality:'curious, quick, adventurous',accent:'#6fc7df',icon:'✦',favoriteItem:'comet-ball',favoriteLabel:'Comet Ball',hasProtectedMotion:true},
  mallow:{type:'mallow',canon:'aurelia',name:'Aurelia',species:'Winged Bunny',role:'Comfort Keeper',personality:'gentle, social, nurturing',accent:'#e7a9c9',icon:'♡',favoriteItem:'moonflower-plush',favoriteLabel:'Moonflower Plush',hasProtectedMotion:true},
  vesper:{type:'vesper',canon:'vesper',name:'Vesper',species:'Starlight Owl',role:'Insight Keeper',personality:'thoughtful, watchful, quietly magical',accent:'#8e70d6',icon:'✧',favoriteItem:'celestial-feather-wand',favoriteLabel:'Celestial Feather Wand',hasProtectedMotion:false},
  briar:{type:'briar',canon:'briar',name:'Briar',species:'Moonlit Fawn',role:'Curiosity Keeper',personality:'gentle, inquisitive, woodland-brave',accent:'#86b88d',icon:'❀',favoriteItem:'moonvine-plush',favoriteLabel:'Moonvine Plush',hasProtectedMotion:false},
  zephyr:{type:'zephyr',canon:'zephyr',name:'Zephyr',species:'Cloud Ferret',role:'Momentum Keeper',personality:'energetic, mischievous, encouraging',accent:'#9fb7ee',icon:'🔔',favoriteItem:'ribbon-comet',favoriteLabel:'Ribbon Comet Toy',hasProtectedMotion:false},
  prism:{type:'prism',canon:'prism',name:'Prism',species:'Crystal Axolotl',role:'Imagination Keeper',personality:'dreamy, inventive, fascinated by light',accent:'#8fd8d4',icon:'◇',favoriteItem:'crystal-bubble-orb',favoriteLabel:'Crystal Bubble Orb',hasProtectedMotion:false},
  rook:{type:'rook',canon:'rook',name:'Rook',species:'Twilight Raven',role:'Strategy Keeper',personality:'clever, deliberate, slightly dramatic',accent:'#52668f',icon:'🪶',favoriteItem:'strategy-rune-tokens',favoriteLabel:'Strategy Rune Tokens',hasProtectedMotion:false},
  solara:{type:'solara',canon:'solara',name:'Solara',species:'Sunrise Hedgehog',role:'Courage Keeper',personality:'warm, fearless, optimistic',accent:'#efa06f',icon:'☀',favoriteItem:'sunburst-ball',favoriteLabel:'Sunburst Ball',hasProtectedMotion:false}
};

const VARIANTS={
  luna:{
    names:['Velora','Nyelle','Selene','Elowen','Mira'],
    accents:['#b79ad9','#8eb7e8','#d59ed8','#9fcbb8','#cab0ef'],
    personalities:['calm, observant, affectionate','mischievous, curious, cuddly','quiet, dreamy, deeply loyal','gentle, clever, routine-loving','boldly affectionate, playful, moon-chasing']
  },
  ember:{
    names:['Cascade','Cinder','Pyra','Saffron','Brim'],
    accents:['#e78c72','#d96d62','#f0a85f','#c86f8d','#d4a45a'],
    personalities:['bold, playful, stubbornly loyal','fiery, competitive, secretly soft','fearless, excitable, praise-loving','clever, dramatic, puzzle-obsessed','steady, protective, determined']
  },
  nova:{
    names:['Solstice','Astra','Comet','Lyric','Novae'],
    accents:['#6fc7df','#7fa6eb','#8bd5c1','#b79ce8','#69b9d9'],
    personalities:['curious, quick, adventurous','bright, social, discovery-driven','restless, playful, fast-thinking','gentle, imaginative, pattern-loving','independent, alert, stargazing']
  },
  mallow:{
    names:['Aurelia','Pippa','Lumi','Clover','Fable'],
    accents:['#e7a9c9','#f0b5d8','#d6b5ec','#a9cfb7','#e5c08d'],
    personalities:['gentle, social, nurturing','bouncy, affectionate, attention-loving','soft-spoken, dreamy, comforting','cheerful, curious, garden-loving','shy, sweet, unexpectedly brave']
  },
  vesper:{
    names:['Vesper','Noctis','Orla','Miri','Echo'],
    accents:['#8e70d6','#6654ad','#a67ad8','#7f8bd8','#9c6fb8'],
    personalities:['thoughtful, watchful, quietly magical','serious, patient, night-loving','curious, scholarly, talkative','gentle, perceptive, easily fascinated','mysterious, playful, sound-attentive']
  },
  briar:{
    names:['Briar','Fern','Thistle','Willow','Moss'],
    accents:['#86b88d','#6ea47a','#b19b72','#83b6a4','#73986f'],
    personalities:['gentle, inquisitive, woodland-brave','shy, observant, plant-loving','bold, stubborn, protective','calm, social, comfort-seeking','quiet, silly, snack-motivated']
  },
  zephyr:{
    names:['Zephyr','Gale','Nimbus','Skye','Whirl'],
    accents:['#9fb7ee','#85b6d9','#b6a8ed','#83c7d5','#c0a7de'],
    personalities:['energetic, mischievous, encouraging','fast, fearless, game-loving','fluffy, dramatic, nap-then-sprint','bright, social, always exploring','chaotic, affectionate, toy-obsessed']
  },
  prism:{
    names:['Prism','Opal','Glimmer','Luma','Iris'],
    accents:['#8fd8d4','#b6a5e7','#86c7e2','#e1a6cf','#92d0b2'],
    personalities:['dreamy, inventive, fascinated by light','gentle, curious, treasure-loving','bubbly, social, easily delighted','quiet, artistic, reflection-loving','playful, observant, color-obsessed']
  },
  rook:{
    names:['Rook','Corvin','Quill','Onyx','Sable'],
    accents:['#52668f','#4f5878','#6f5f92','#44506e','#745c7d'],
    personalities:['clever, deliberate, slightly dramatic','serious, loyal, tactical','chatty, analytical, object-curious','quiet, intense, lookout-loving','wry, independent, secretly affectionate']
  },
  solara:{
    names:['Solara','Dawn','Marigold','Ray','Sola'],
    accents:['#efa06f','#efb27e','#e7a66c','#f1c06b','#e98c72'],
    personalities:['warm, fearless, optimistic','bright, gentle, morning-loving','social, bold, flower-loving','energetic, encouraging, fearless','cozy, brave, affection-seeking']
  }
};

const STAGES=[
  {slug:'new-bond',name:'New Bond',min:1,max:2},
  {slug:'apprentice',name:'Apprentice',min:3,max:4},
  {slug:'guardian',name:'Guardian',min:5,max:7},
  {slug:'ascendant',name:'Ascendant',min:8,max:11},
  {slug:'celestial',name:'Celestial',min:12,max:Infinity}
];

function cleanIdentity(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'')}
function canonIndex(){
  const out={};
  for(const [type,g] of Object.entries(GUARDIANS)){
    [type,g.type,g.canon].forEach(v=>{const k=cleanIdentity(v);if(k)out[k]=type});
  }
  return out;
}
function resolveType(raw){
  if(raw==null)return '';
  const idx=canonIndex();
  if(typeof raw==='string')return idx[cleanIdentity(raw)]||String(raw).toLowerCase();
  // Species/type identity is separate from an individual Guardian's custom name.
  for(const value of [raw.guardianType,raw.speciesType,raw.canon,raw.slug,raw.type]){
    const hit=idx[cleanIdentity(value)];if(hit)return hit;
  }
  return String(raw.type||raw.guardianType||'').toLowerCase();
}
function hash(v){
  const s=String(v||'guardian');let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function duplicateIndex(raw,type){
  const rows=Array.isArray(window.S?.legacy?.pets)?window.S.legacy.pets.filter(Boolean):[];
  const same=rows.filter(p=>resolveType(p)===type);
  const i=same.findIndex(p=>String(p.id||'')===String(raw?.id||raw?.petId||''));
  return i>=0?i:0;
}
function individualFor(raw){
  if(!raw)return null;
  const type=resolveType(raw);
  const base=GUARDIANS[type]||dynamicSources()[type]||normalizeExtra(type,raw)||null;
  if(!base)return null;
  const variants=VARIANTS[type]||{};
  const idx=Math.max(0,duplicateIndex(raw,type));
  const names=variants.names||[base.name],accents=variants.accents||[base.accent||'#b79ad9'],personalities=variants.personalities||[base.personality||'curious and bonded'];
  const existingName=String(raw.individualName||raw.customName||raw.name||'').trim();
  const duplicateName=(Array.isArray(window.S?.legacy?.pets)?window.S.legacy.pets:[]).filter(p=>resolveType(p)===type&&String(p.name||'').trim()===existingName).length>1;
  const generatedName=names[idx%names.length]||base.name;
  const name=existingName&&(!duplicateName||idx===0)?existingName:generatedName;
  const accent=raw.accent||raw.color||accents[idx%accents.length]||base.accent||'#b79ad9';
  const personality=raw.personality||personalities[idx%personalities.length]||base.personality;
  const hue=idx===0?0:((hash(raw.id||raw.petId||name)%5)+1)*24;
  return {...base,type,name,accent,personality,variantIndex:idx,hue,individualId:String(raw.id||raw.petId||''),isDuplicate:idx>0};
}
function getFor(raw){return individualFor(raw)}
function normalizeExtra(type,raw={}){
  const key=String(type||raw.type||'').toLowerCase();
  if(!key)return null;
  return {
    type:key,
    canon:String(raw.canon||raw.slug||key).toLowerCase().replace(/[^a-z0-9-]+/g,'-'),
    name:raw.name||raw.display||key,
    species:raw.species||'Guardian',
    icon:raw.icon||raw.sigil||'✦',
    favoriteItem:raw.favoriteItem||raw.favorite||null,
    favoriteLabel:raw.favoriteLabel||raw.favorite||'Sanctuary treasure',
    role:raw.role||'Study Keeper',
    personality:raw.personality||'curious and bonded',
    accent:raw.accent||raw.color||'#b79ad9',
    hasProtectedMotion:!!raw.hasProtectedMotion
  };
}
function dynamicSources(){
  const out={};
  const canon=window.V338_CANON||{};
  for(const [type,raw] of Object.entries(canon))if(!GUARDIANS[type])out[type]=normalizeExtra(type,raw);
  for(const pet of (window.S?.legacy?.pets||[])){
    const type=String(pet?.type||'').toLowerCase();
    if(type&&!GUARDIANS[type]&&!out[type])out[type]=normalizeExtra(type,pet);
  }
  for(const egg of (window.S?.legacy?.eggs||[])){
    const type=String(egg?.type||'').toLowerCase();
    if(type&&!GUARDIANS[type]&&!out[type])out[type]=normalizeExtra(type,egg);
  }
  return out;
}
function register(type,meta){
  const normalized=normalizeExtra(type,meta);
  if(!normalized)return null;
  GUARDIANS[normalized.type]={...(GUARDIANS[normalized.type]||{}),...normalized,...meta,type:normalized.type};
  return GUARDIANS[normalized.type];
}
function get(type){
  const key=resolveType(type);
  return GUARDIANS[key]||dynamicSources()[key]||null;
}
function all(){
  const merged={...dynamicSources(),...GUARDIANS};
  return Object.values(merged).filter(Boolean);
}
function protectedMotionTypes(){return all().filter(x=>x.hasProtectedMotion).map(x=>x.type)}
function stage(level){
  const n=Math.max(1,Number(level)||1);
  const index=n>=12?4:n>=8?3:n>=5?2:n>=3?1:0;
  return {...STAGES[index],index,level:n};
}
function stageImage(type,levelOrIndex){
  const g=get(type);
  if(!g)return '';
  const i=Number.isInteger(levelOrIndex)&&levelOrIndex>=0&&levelOrIndex<=4?levelOrIndex:stage(levelOrIndex).index;
  return 'assets/familiars/evolution_stages/'+g.canon+'-'+STAGES[i].slug+'.webp';
}
window.MajickGuardianRegistry={version:4,guardians:GUARDIANS,variants:VARIANTS,stages:STAGES,get,getFor,individualFor,resolveType,all,register,normalizeExtra,protectedMotionTypes,stage,stageImage};
})();