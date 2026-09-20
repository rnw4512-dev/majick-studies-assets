// Majick Studies Stability Reset — authoritative Guardian registry
(function(){
'use strict';
const GUARDIANS={
  luna:{type:'luna',canon:'velora',name:'Velora',species:'Moon Cat',icon:'☾',favoriteItem:'velvet-moon-cushion',favoriteLabel:'Velvet Moon Cushion',hasProtectedMotion:true},
  ember:{type:'ember',canon:'cascade',name:'Cascade',species:'Pocket Dragon',icon:'◇',favoriteItem:'rune-puzzle',favoriteLabel:'Rune Puzzle',hasProtectedMotion:true},
  nova:{type:'nova',canon:'solstice',name:'Solstice',species:'Star Fox',icon:'✦',favoriteItem:'comet-ball',favoriteLabel:'Comet Ball',hasProtectedMotion:true},
  mallow:{type:'mallow',canon:'aurelia',name:'Aurelia',species:'Winged Bunny',icon:'♡',favoriteItem:'moonflower-plush',favoriteLabel:'Moonflower Plush',hasProtectedMotion:true},
  vesper:{type:'vesper',canon:'vesper',name:'Vesper',species:'Starlight Owl',icon:'✧',favoriteItem:'celestial-feather-wand',favoriteLabel:'Celestial Feather Wand',hasProtectedMotion:false},
  briar:{type:'briar',canon:'briar',name:'Briar',species:'Moonlit Fawn',icon:'❀',favoriteItem:'moonvine-plush',favoriteLabel:'Moonvine Plush',hasProtectedMotion:false},
  zephyr:{type:'zephyr',canon:'zephyr',name:'Zephyr',species:'Cloud Ferret',icon:'🔔',favoriteItem:'ribbon-comet',favoriteLabel:'Ribbon Comet Toy',hasProtectedMotion:false},
  prism:{type:'prism',canon:'prism',name:'Prism',species:'Crystal Axolotl',icon:'◇',favoriteItem:'crystal-bubble-orb',favoriteLabel:'Crystal Bubble Orb',hasProtectedMotion:false},
  rook:{type:'rook',canon:'rook',name:'Rook',species:'Twilight Raven',icon:'🪶',favoriteItem:'strategy-rune-tokens',favoriteLabel:'Strategy Rune Tokens',hasProtectedMotion:false},
  solara:{type:'solara',canon:'solara',name:'Solara',species:'Sunrise Hedgehog',icon:'☀',favoriteItem:'sunburst-ball',favoriteLabel:'Sunburst Ball',hasProtectedMotion:false}
};
const STAGES=[
  {slug:'new-bond',name:'New Bond',min:1,max:2},
  {slug:'apprentice',name:'Apprentice',min:3,max:4},
  {slug:'guardian',name:'Guardian',min:5,max:7},
  {slug:'ascendant',name:'Ascendant',min:8,max:11},
  {slug:'celestial',name:'Celestial',min:12,max:Infinity}
];
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
window.MajickGuardianRegistry={version:2,guardians:GUARDIANS,stages:STAGES,get,all,register,normalizeExtra,protectedMotionTypes,stage,stageImage};
})();