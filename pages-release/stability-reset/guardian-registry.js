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
function get(type){return GUARDIANS[String(type||'').toLowerCase()]||null}
function all(){return Object.values(GUARDIANS)}
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
window.MajickGuardianRegistry={version:1,guardians:GUARDIANS,stages:STAGES,get,all,protectedMotionTypes,stage,stageImage};
})();