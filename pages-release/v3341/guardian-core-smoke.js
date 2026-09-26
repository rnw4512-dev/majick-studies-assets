const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3341/guardian-core.js','utf8');

function node(tag='div'){
  return {
    tagName:String(tag).toUpperCase(),className:'',textContent:'',innerHTML:'',
    style:{setProperty(){},display:''},children:[],
    appendChild(x){this.children.push(x);return x},remove(){this.removed=true},
    querySelector(){return null},querySelectorAll(){return []},
    getBoundingClientRect(){return {left:100,top:100,width:80,height:80}},
    setAttribute(){},classList:{add(){},remove(){}},offsetWidth:1
  };
}
const body=node('body');
const document={
  documentElement:{dataset:{}},body,
  addEventListener(){},
  createElement:node,
  querySelector(){return null},
  querySelectorAll(){return []},
  getElementById(){return null}
};
class MutationObserver{constructor(fn){this.fn=fn}observe(){}}
class Element{}

const account={
  guardianCare:{focusPetId:'p1',guardians:{p1:{bond:10}}},
  guardianAudio:{enabled:true,guardian:true,magic:true,volume:.58},
  studyPreferences:{finishDebriefEnabled:true}
};
const ctx={
  console,Date,Math,JSON,WeakSet,MutationObserver,Element,document,
  location:{origin:'https://example.test'},
  setTimeout(fn){fn();return 1},clearTimeout(){},
  innerWidth:1200,innerHeight:800,
  S:{
    activeCourse:'D755',screen:'home',
    legacy:{activePetId:'p1',pets:[{id:'p1',type:'luna',name:'Velora',xp:100}]},
    majickAccount:account,
    progress:{D755:{xp:4987}}
  },
  MajickStateCore:{ensureAccount(){return account}},
  MajickGuardianCare:{
    snapshot(){return {focusPetId:'p1',guardians:{p1:{bond:10,mood:{label:'Bright'},icon:'☾'}}}},
    broadcastState(){}
  },
  MajickGuardianRegistry:{get(){return {name:'Velora',icon:'☾'}}},
  v338Canon(){return {display:'Velora',portrait:'assets/familiars/canon/velora-guardian.webp'}},
  v3312CurrentGuardianImage(){return 'assets/familiars/canon/velora-guardian.webp'},
  masPetLevel(){return 5},
  save(){},
  render(){},
  navigate(){},
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'guardian-core.js'});

const M=ctx.MajickGuardianCore;
assert(M&&M.VERSION==='3.3.41','Guardian Core version missing');
assert(document.documentElement.dataset.majickGuardianCore==='3.3.41','Guardian Core dataset missing');
assert(M.activePet().id==='p1','Active Study Guardian not resolved');
assert(/ACTIVE STUDY GUARDIAN/.test(M.guardianHeroHtml()),'Guardian is not central in Home hero');
assert(/Study with Velora/.test(M.guardianHeroHtml()),'Home hero study action missing');
assert(/Debrief on/.test(M.guardianHeroHtml()),'Debrief toggle missing from Home hero');
assert(/STUDYING WITH/.test(M.studyDockHtml()),'Study Guardian dock missing');

const xpBefore=ctx.S.progress.D755.xp;
assert(M.debriefEnabled()===true,'Debrief should default on');
M.toggleDebrief();
assert(M.debriefEnabled()===false,'Debrief did not toggle off');
assert(/Debrief off/.test(M.guardianHeroHtml()),'Home hero did not reflect debrief off state');
M.toggleDebrief();
assert(M.debriefEnabled()===true,'Debrief did not toggle back on');

M.react('correct');
M.react('concept');
M.react('mastery');
const g=M.journey();
assert(g.questCompletions>=1,'Study Guardian Bond Quest did not complete');
assert(g.studyMoments===3,'Study moments were not tracked');
assert(account.guardianCare.guardians.p1.bond>10,'Guardian bond did not grow from study activity');
assert(M.recentMemories(10).some(x=>x.kind==='bond-quest'),'Bond Quest memory missing');
assert(M.recentMemories(10).some(x=>x.kind==='concept'),'Concept study memory missing');
assert(ctx.S.progress.D755.xp===xpBefore,'Guardian rewards changed academic/lifetime XP');

console.log('V3.3.41 GUARDIAN CORE SMOKE PASSED');
console.log(JSON.stringify({
  version:M.VERSION,
  guardian:M.meta(M.activePet()).name,
  questCompletions:g.questCompletions,
  studyMoments:g.studyMoments,
  bond:account.guardianCare.guardians.p1.bond,
  debrief:M.debriefEnabled(),
  xp:ctx.S.progress.D755.xp
}));
