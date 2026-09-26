const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3342/guardian-life-main.js','utf8');

const account={
  guardianJourney:{schemaVersion:1,guardians:{},memories:[]},
  guardianCare:{guardians:{p3:{bond:20}}}
};
const ctx={
  console,Date,Math,JSON,
  location:{origin:'https://example.test'},
  setTimeout(fn){fn();return 1},clearTimeout(){},
  document:{
    documentElement:{dataset:{}},
    querySelector(){return null},
    createElement(){return {className:'',innerHTML:'',appendChild(){}}}
  },
  addEventListener(){},
  S:{
    activeCourse:'D755',screen:'home',
    legacy:{pets:[
      {id:'p1',type:'luna',name:'Velora'},
      {id:'p2',type:'ember',name:'Cascade'},
      {id:'p3',type:'nova',name:'Solstice'}
    ]},
    progress:{D755:{xp:4987}},
    majickAccount:account
  },
  MajickStateCore:{ensureAccount(){return account}},
  MajickGuardianCare:{
    snapshot(){return {guardians:{p3:{favoriteLabel:'Comet Ball'}}}}
  },
  MajickGuardianCore:{
    activePet(){return ctx.S.legacy.pets[2]},
    sound(){},
    sparks(){}
  },
  rewardToast(){},
  save(){},
  render(){}
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'guardian-life-main.js'});

const M=ctx.MajickGuardianLife;
assert(M&&M.VERSION==='3.3.42','Guardian Life version missing');
assert(ctx.document.documentElement.dataset.majickGuardianLife==='3.3.42','Guardian Life dataset marker missing');

const nook=M.nookSummary();
assert(nook.bed==='Personal Crystal Nest','Third Guardian should show an expandable personal bed on Home');
assert(nook.favorite==='Comet Ball','Guardian favorite item missing from nook summary');

const xpBefore=ctx.S.progress.D755.xp;
const ok=M.recordEvolution({guardianId:'p3',guardianType:'nova',name:'Solstice',previousStage:'apprentice',stage:'guardian'});
assert(ok===true,'Evolution was not recorded');
assert(account.guardianCare.guardians.p3.bond===30,'Evolution should award +10 Guardian bond');
assert(account.guardianJourney.guardians.p3.evolutions.guardian,'Evolution stage history missing');
assert(account.guardianJourney.memories.some(x=>x.kind==='evolution'&&/Guardian/.test(x.text)),'Evolution memory missing');
const count=account.guardianJourney.memories.length;
assert(M.recordEvolution({guardianId:'p3',guardianType:'nova',name:'Solstice',previousStage:'apprentice',stage:'guardian'})===false,'Evolution memory should be idempotent');
assert(account.guardianJourney.memories.length===count,'Duplicate evolution memory was added');
assert(ctx.S.progress.D755.xp===xpBefore,'Evolution reward must not change academic XP');

console.log('V3.3.42 GUARDIAN LIFE MAIN SMOKE PASSED');
console.log(JSON.stringify({version:M.VERSION,nook,bond:account.guardianCare.guardians.p3.bond,memories:count,xp:ctx.S.progress.D755.xp}));
