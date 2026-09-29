// Majick Studies Stability Reset — authoritative Guardian registry
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
    [type,g.type,g.canon,g.name].forEach(v=>{const k=cleanIdentity(v);if(k)out[k]=type});
  }
  return out;
}
function resolveType(raw){
  if(raw==null)return '';
  const idx=canonIndex();
  if(typeof raw==='string')return idx[cleanIdentity(raw)]||String(raw).toLowerCase();
  // Canon name/display is more trustworthy than a stale legacy type.
  for(const value of [raw.name,raw.display,raw.canon,raw.slug]){
    const hit=idx[cleanIdentity(value)];if(hit)return hit;
  }
  const direct=idx[cleanIdentity(raw.type)];
  return direct||String(raw.type||'').toLowerCase();
}
function getFor(raw){
  const type=resolveType(raw);
  return GUARDIANS[type]||dynamicSources()[type]||normalizeExtra(type,raw||{})||null;
}
function normalizeExtra(type,raw={}){
  const key=String(type||raw.type||'').toLowerCase();
  if(!key)return null;
  return {
    type:key,
    canon:String(raw.canon||raw.slug||raw.name||key).toLowerCase().replace(/[^a-z0-9-]+/g,'-'),
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
  for(const [type,raw] of Object.entries(canon)){
    if(!GUARDIANS[type])out[type]=normalizeExtra(type,raw);
  }
  for(const pet of (window.S?.legacy?.pets||[])){
    if(pet?.type&&!GUARDIANS[pet.type]&&!out[pet.type])out[pet.type]=normalizeExtra(pet.type,pet);
  }
  for(const egg of (window.S?.legacy?.eggs||[])){
    if(egg?.type&&!GUARDIANS[egg.type]&&!out[egg.type])out[egg.type]=normalizeExtra(egg.type,egg);
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
  const key=String(type||'').toLowerCase();
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
window.MajickGuardianRegistry={version:3,guardians:GUARDIANS,stages:STAGES,get,getFor,resolveType,all,register,normalizeExtra,protectedMotionTypes,stage,stageImage};
})();