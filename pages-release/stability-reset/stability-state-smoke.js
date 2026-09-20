'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=(ok,msg)=>{if(!ok)throw new Error('STABILITY STATE SMOKE FAILED: '+msg)};

global.window=global;
global.document={documentElement:{dataset:{}},addEventListener:()=>{},querySelectorAll:()=>[],getElementById:()=>null};
global.location={origin:'https://example.test'};
global.addEventListener=()=>{};
global.setTimeout=()=>0;
global.clearTimeout=()=>{};
global.esc=s=>String(s??'');
global.confirm=()=>true;
global.alert=()=>{};
global.rewardToast=()=>{};
global.glitterBurst=()=>{};
global.navigate=()=>{};
global.render=()=>{};
global.save=()=>{};
global.activePet=()=>global.S?.legacy?.pets?.[0]||null;
global.V338_CANON={
  nyx:{display:'Nyx',species:'Nebula Lynx',sigil:'✺',favorite:'nebula-thread-ball',portrait:'nyx.webp'}
};

global.S={
  activeCourse:'D772',
  courses:{
    D772:{id:'D772',title:'Statistical Data Literacy'},
    PMFC:{id:'PMFC',title:'Assessment for Special Education'}
  },
  progress:{
    D772:{answers:[],xp:1200,crystals:155,chests:1,streak:4},
    PMFC:{answers:[{qid:'x'}],xp:900,crystals:120,chests:0,streak:2}
  },
  majickAccount:{xp:1511,crystals:200,chests:2,schemaVersion:1},
  legacy:{
    activePetId:'pet_velora',
    pets:[
      {id:'pet_velora',type:'luna',name:'Velora',bond:100},
      {id:'pet_nyx',type:'nyx',name:'Nyx',bond:12}
    ],
    eggs:[{id:'egg_future',type:'aurora-moth',progress:2,goal:20}]
  }
};

function run(path){vm.runInThisContext(fs.readFileSync(path,'utf8'),{filename:path});}
run('pages-release/stability-reset/guardian-registry.js');
run('pages-release/stability-reset/majick-state-core.js');

assert(MajickGuardianRegistry.get('luna')?.name==='Velora','baseline Guardian missing');
assert(MajickGuardianRegistry.get('nyx')?.name==='Nyx','future Guardian from V338_CANON not discovered');
assert(MajickGuardianRegistry.get('aurora-moth')?.type==='aurora-moth','future egg Guardian type not discovered');

MajickStateCore.normalizeAll();
assert(prog()===S.progress.D772,'safe prog does not return active course');
assert(S.majickAccount.crystals===200,'account crystal migration chose wrong value');
assert(S.progress.D772.crystals===200,'D772 did not mirror account crystals');
assert(S.progress.PMFC.crystals===200,'PMFC did not mirror account crystals');

prog().crystals=173;
assert(S.majickAccount.crystals===173,'writing active progress crystals did not update account');
assert(S.progress.PMFC.crystals===173,'other course did not reflect shared account crystals');

S.progress.D772=undefined;
MajickStateCore.normalizeAll();
assert(S.progress.D772&&Array.isArray(S.progress.D772.answers),'undefined active course was not repaired');
assert(S.progress.D772.crystals===173,'repaired course lost account crystals');

run('pages-release/v3317/guardian-care-economy.js');
const snap=MajickGuardianCare.snapshot();
assert(snap.roster.length===2,'care roster must use actual two hatched Guardians');
assert(snap.roster.some(g=>g.type==='nyx'),'future Guardian missing from care roster');
assert(snap.eggs.length===1&&snap.eggs[0].type==='aurora-moth','future egg missing from incubator snapshot');

MajickGuardianRegistry.register('ember-whale',{
  name:'Cetus',species:'Ember Whale',canon:'cetus',favoriteItem:'star-kelp'
});
assert(MajickGuardianRegistry.get('ember-whale')?.name==='Cetus','explicit future Guardian register() failed');

console.log('STABILITY STATE SMOKE PASSED');
console.log('registry size:',MajickGuardianRegistry.all().length);
console.log('shared crystals:',S.majickAccount.crystals);
console.log('care roster:',snap.roster.map(x=>x.name).join(', '));
console.log('eggs:',snap.eggs.map(x=>x.type).join(', '));
