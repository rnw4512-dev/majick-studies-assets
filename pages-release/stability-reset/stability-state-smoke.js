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
    D755:{id:'D755',title:'Assessment for Special Education'}
  },
  progress:{
    D772:{answers:[],xp:1200,crystals:155,chests:1,streak:4},
    D755:{answers:[{qid:'x'}],xp:900,crystals:120,chests:0,streak:2}
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
assert(S.progress.D755.crystals===200,'D755 did not mirror account crystals');

prog().crystals=173;
assert(S.majickAccount.crystals===173,'writing active progress crystals did not update account');
assert(S.progress.D755.crystals===173,'other course did not reflect shared account crystals');

S.progress.D772=undefined;
MajickStateCore.normalizeAll();
assert(S.progress.D772&&Array.isArray(S.progress.D772.answers),'undefined active course was not repaired');
assert(S.progress.D772.crystals===173,'repaired course lost account crystals');

const repaired=S.progress.D772;
for(const key of ['answers','explanations','repair','spacedQueue','charms','cosmetics','questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory','urgentRepair','v5SessionHistory','errorTags','strategyHistory']){
  assert(Array.isArray(repaired[key]),'repaired progress missing array '+key);
}
for(const key of ['distractorHistory','flaggedQuestions','masteryProofs','sourceCoverage','questionExposure','aiCache']){
  assert(repaired[key]&&typeof repaired[key]==='object'&&!Array.isArray(repaired[key]),'repaired progress missing object '+key);
}

run('pages-release/v3317/guardian-care-economy.js');
const snap=MajickGuardianCare.snapshot();
assert(snap.roster.length===2,'care roster must use actual two hatched Guardians');

const beforeBuy=S.majickAccount.crystals;
const purchased=MajickGuardianCare.buy('moonberry-meal');
assert(purchased.ok,'care shop purchase failed');
assert(S.majickAccount.crystals===beforeBuy-6,'care shop charged crystals more than once or wrong amount');
assert(S.progress.D772.crystals===beforeBuy-6,'active course did not mirror post-purchase balance');
assert(S.progress.D755.crystals===beforeBuy-6,'other course did not mirror post-purchase balance');
assert(snap.roster.some(g=>g.type==='nyx'),'future Guardian missing from care roster');
assert(snap.eggs.length===3&&snap.eggs.some(e=>e.type==='aurora-moth'),'future egg missing from incubator snapshot or restoration failed');

// V3.3.22 one-time user balance recovery: only the affected two-Guardian + Pocket Dragon egg
// save signature is eligible, and the marker prevents later spending from being refilled.
S.legacy={
  activePetId:'pet_velora',
  pets:[
    {id:'pet_velora',type:'luna',name:'Velora',bond:100},
    {id:'pet_solstice',type:'nova',name:'Solstice',bond:78}
  ],
  eggs:[{id:'egg_ember',type:'ember',progress:0,goal:20}]
};
S.majickAccount={xp:0,crystals:0,chests:0,schemaVersion:2};
const recovered=MajickStateCore.ensureAccount();
assert(recovered.xp===4000,'lost Majick XP was not restored to 4000');
assert(recovered.crystals===150,'lost Moon Crystals were not restored to 150');

S.legacy={
  activePetId:'pet_cascade',
  pets:[
    {id:'pet_velora',type:'luna',name:'Velora',bond:122,level:8},
    {id:'pet_solstice',type:'nova',name:'Solstice',bond:78,level:5},
    {id:'pet_cascade',type:'ember',name:'Cascade',bond:4,level:1}
  ],
  eggs:[{id:'stale_ember_egg',type:'ember',progress:20,goal:20}]
};
S.majickAccount={xp:275,crystals:42,chests:0,schemaVersion:3};
const merged=MajickStateCore.ensureAccount();
assert(merged.xp===4275,'old and new XP were not merged together after Cascade hatched');
assert(merged.crystals===42,'nonzero current crystal balance was incorrectly refilled');
assert(merged.progressMergeV3323?.applied===true,'progress merge marker missing');
assert(S.legacy.eggs.length===3,'one-time egg restoration should bring the incubator to three eggs');
assert(S.legacy.eggs.some(e=>e.id==='stale_ember_egg'),'an earned egg with the same species as a Guardian must be preserved');
assert(merged.eggRestorationV3344?.added.length===2,'only the missing eggs should be granted');
const eggIds=S.legacy.eggs.map(e=>e.id);
merged.xp=4301;
MajickStateCore.ensureAccount();
assert(JSON.stringify(S.legacy.eggs.map(e=>e.id))===JSON.stringify(eggIds),'reload must not duplicate restored eggs');
S.legacy.eggs[0].progress=9;
MajickStateCore.ensureAccount();
assert(S.legacy.eggs.length===3&&S.legacy.eggs[0].progress===9,'existing egg moonlight must remain intact');
const newlyEarned={id:'egg_newly_earned_after_restore',type:'zephyr',progress:4,goal:22,source:'earned'};
S.legacy.eggs.push(newlyEarned);
const fourEggIds=S.legacy.eggs.map(e=>e.id);
MajickStateCore.ensureAccount();
assert(S.legacy.eggs.length===4,'a newly earned egg must never be removed by restoration or reconciliation');
assert(JSON.stringify(S.legacy.eggs.map(e=>e.id))===JSON.stringify(fourEggIds),'reload changed or reordered the earned egg inventory');
assert(S.legacy.eggs.find(e=>e.id==='egg_newly_earned_after_restore')?.progress===4,'newly earned egg moonlight progress was not preserved');
assert(merged.xp===4301,'progress merge ran more than once');
assert(recovered.balanceRecoveryV3322?.applied===true,'balance recovery marker was not stored');
recovered.crystals=90;
recovered.xp=3900;
MajickStateCore.ensureAccount();
assert(recovered.crystals===90,'one-time recovery incorrectly refilled spent crystals');
assert(recovered.xp===3900,'one-time recovery incorrectly refilled spent XP');

MajickGuardianRegistry.register('ember-whale',{
  name:'Cetus',species:'Ember Whale',canon:'cetus',favoriteItem:'star-kelp'
});
assert(MajickGuardianRegistry.get('ember-whale')?.name==='Cetus','explicit future Guardian register() failed');

console.log('STABILITY STATE SMOKE PASSED');
console.log('registry size:',MajickGuardianRegistry.all().length);
console.log('shared crystals:',S.majickAccount.crystals);
console.log('care roster:',snap.roster.map(x=>x.name).join(', '));
console.log('eggs:',snap.eggs.map(x=>x.type).join(', '));
