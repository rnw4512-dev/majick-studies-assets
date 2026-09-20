'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=(ok,msg)=>{if(!ok)throw new Error('MIGRATION SMOKE FAILED: '+msg)};

global.window=global;
global.document={querySelectorAll:()=>[],getElementById:()=>null};
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
global.session=null;
global.save=()=>{};
global.activePet=()=>global.S?.legacy?.pets?.[0]||null;
global.V338_CANON={};

global.S={
  activeCourse:'PMFC',
  screen:'mission',
  courses:{
    PMFC:{id:'PMFC',title:'Assessment for Special Education',questionBank:[{id:'legacy-assessment-q',prompt:'Legacy assessment question'}]},
    D772:{id:'D772',title:'Statistical Data Literacy'},
    GHOST:{id:'GHOST',title:'Old Imported Course'}
  },
  progress:{
    PMFC:{answers:[{qid:'q1'}],xp:1511,crystals:200,streak:3},
    D772:undefined,
    GHOST:null
  },
  majickAccount:{
    xp:1511,crystals:200,chests:0,
    guardianOwned:{'comet-ball':true,'old-false-item':false},
    guardianInventory:['moonberry-meal','moonberry-meal','starlight-treat']
  },
  legacy:{
    activePetId:'luna',
    pets:[
      {id:'luna',type:'luna',name:'Velora',bond:121},
      {id:'pet_solstice',type:'nova',name:'Solstice',bond:78}
    ],
    eggs:[
      {id:'egg_next',type:'vesper',progress:7,goal:20,source:'study'}
    ]
  }
};

function run(path){
  const code=fs.readFileSync(path,'utf8');
  vm.runInThisContext(code,{filename:path});
}

run('pages-release/v3316/courseManager.js');

assert(!S.courses.PMFC,'legacy PMFC course key was not retired');
assert(!S.progress.PMFC,'legacy PMFC progress key was not retired');
assert(S.courses.D755?.id==='D755','Assessment course was not migrated to D755');
assert(S.courses.D755?.title==='Assessment for Special Education','D755 title is incorrect');
assert(S.courses.D755.questionBank?.some(q=>q.id==='legacy-assessment-q'),'existing assessment question bank was lost during D755 migration');
assert(S.activeCourse==='D755','active legacy Assessment course did not follow migration to D755');
assert(S.progress.D755&&typeof S.progress.D755==='object','D755 progress disappeared');
assert(S.progress.D755.answers?.some(a=>a.qid==='q1'),'existing Assessment answer history was lost during D755 migration');
assert(Number(S.progress.D755.streak)===3,'existing Assessment streak was lost during D755 migration');
assert(S.progress.D772&&typeof S.progress.D772==='object','undefined D772 progress was not repaired');
assert(S.progress.GHOST&&typeof S.progress.GHOST==='object','null course progress was not repaired');
assert(Number(S.progress.D772.xp)===1511,'repaired course did not receive account XP safely');
assert(Array.isArray(S.progress.D772.answers),'repaired course answers is not an array');
assert(MajickCourseManager.COURSE_CATALOG.D755?.title==='Assessment for Special Education','D755 missing from course catalog');
assert(MajickCourseManager.COURSE_CATALOG.D772?.title==='Statistical Data Literacy','D772 missing from course catalog');
assert(typeof window.MajickCourseManager?.normalizeAllProgress==='function','course progress normalizer not exported');

run('pages-release/v3317/guardian-care-economy.js');

const snap=window.MajickGuardianCare.snapshot();
assert(Array.isArray(S.majickAccount.guardianOwned),'guardianOwned was not normalized to an array');
assert(snap.owned.includes('comet-ball'),'old true-map purchase was not preserved');
assert(!snap.owned.includes('old-false-item'),'false old-map item was incorrectly preserved');
assert(snap.owned.includes('starter-ribbon-toy'),'starter toy migration missing');
assert(snap.inventory['moonberry-meal']===2,'array inventory did not preserve duplicate meal quantity');
assert(snap.inventory['starlight-treat']===1,'array inventory did not preserve treat quantity');
assert(snap.roster.length===2,'owned Guardian roster should contain exactly two hatched Guardians');
assert(snap.eggs.length===1,'incubator should contain exactly one egg');
assert(snap.guardians.luna||snap.guardians['luna'],'Velora care state missing');
assert(snap.guardians.pet_solstice,'Solstice care state missing');

console.log('V3.3.17 migration smoke passed');
console.log('courses repaired:',Object.keys(S.progress).join(', '));
console.log('owned Guardians:',snap.roster.length);
console.log('incubating eggs:',snap.eggs.length);
console.log('owned care items:',snap.owned.join(', '));
