// Majick Studies Stability Reset — authoritative state compatibility layer
(function(){
'use strict';
const SHARED=['xp','crystals','chests'];
function stateRef(){
  try{
    if(typeof S!=='undefined'&&S&&typeof S==='object')return S;
  }catch(_){}
  return (window.S&&typeof window.S==='object')?window.S:null;
}
function exposeState(){
  const st=stateRef();
  if(st&&!window.S){
    try{window.S=st}catch(_){}
  }
  return st;
}
function blankProgress(){
  return {
    answers:[],explanations:[],repair:[],spacedQueue:[],charms:[],cosmetics:[],
    questionMemory:[],sessionHistory:[],masteryRewarded:[],helpHistory:[],familyMemory:[],
    urgentRepair:[],v5SessionHistory:[],errorTags:[],strategyHistory:[],
    distractorHistory:{},flaggedQuestions:{},masteryProofs:{},sourceCoverage:{},
    questionExposure:{},aiCache:{},
    streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,chests:0,bestCombo:0,
    aiGeneratedCount:0,petAbilityUses:0,eliminationWins:0,voicePractices:0,
    dailyClaimed:'',weeklyClaimed:'',
    inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0}
  };
}
function plainNumber(v){v=Number(v);return Number.isFinite(v)?v:0}
function ensureCourses(){
  const st=exposeState();
  if(!st)return null;
  st.courses=(st.courses&&typeof st.courses==='object'&&!Array.isArray(st.courses))?st.courses:{};
  st.progress=(st.progress&&typeof st.progress==='object'&&!Array.isArray(st.progress))?st.progress:{};
  if(!st.activeCourse||!st.courses[st.activeCourse])st.activeCourse=Object.keys(st.courses)[0]||st.activeCourse||'PMFC';
  return st;
}
function initialSharedValue(key){
  const st=exposeState();
  const account=st?.majickAccount;
  if(account&&Object.prototype.hasOwnProperty.call(account,key)){
    const n=Number(account[key]);
    if(Number.isFinite(n))return n;
  }
  let best=0;
  for(const row of Object.values(st?.progress||{})){
    if(row&&typeof row==='object')best=Math.max(best,plainNumber(row[key]));
  }
  return best;
}
function ensureAccount(){
  const st=exposeState();
  if(!st)return null;
  st.majickAccount=(st.majickAccount&&typeof st.majickAccount==='object'&&!Array.isArray(st.majickAccount))?st.majickAccount:{};
  for(const key of SHARED)st.majickAccount[key]=initialSharedValue(key);
  st.majickAccount.schemaVersion=Math.max(2,plainNumber(st.majickAccount.schemaVersion));
  return st.majickAccount;
}
function bindSharedField(row,key){
  const desc=Object.getOwnPropertyDescriptor(row,key);
  if(desc?.get&&desc?.set&&desc.get.__majickSharedGetter)return;
  const getter=function(){return plainNumber(exposeState()?.majickAccount?.[key])};
  getter.__majickSharedGetter=true;
  Object.defineProperty(row,key,{
    enumerable:true,configurable:true,
    get:getter,
    set(v){const a=ensureAccount();if(a)a[key]=plainNumber(v)}
  });
}
function normalizeProgressRow(row,cid=''){
  const p=(row&&typeof row==='object'&&!Array.isArray(row))?row:blankProgress();

  const arrays=[
    'answers','explanations','repair','spacedQueue','charms','cosmetics',
    'questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory',
    'urgentRepair','v5SessionHistory','errorTags','strategyHistory'
  ];
  for(const key of arrays)p[key]=Array.isArray(p[key])?p[key]:[];

  const objects=['distractorHistory','flaggedQuestions','masteryProofs','sourceCoverage','questionExposure','aiCache'];
  for(const key of objects)p[key]=(p[key]&&typeof p[key]==='object'&&!Array.isArray(p[key]))?p[key]:{};

  p.inventory=(p.inventory&&typeof p.inventory==='object'&&!Array.isArray(p.inventory))
    ?p.inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  p.inventory=Object.assign({streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},p.inventory);

  const numeric=['streak','bossWins','bestCombo','aiGeneratedCount','petAbilityUses','eliminationWins','voicePractices'];
  for(const key of numeric)p[key]=plainNumber(p[key]);

  p.lastDay=typeof p.lastDay==='string'?p.lastDay:'';
  p.dailyClaimed=typeof p.dailyClaimed==='string'?p.dailyClaimed:'';
  p.weeklyClaimed=typeof p.weeklyClaimed==='string'?p.weeklyClaimed:'';

  if(cid)p.courseId=cid;
  for(const key of SHARED)bindSharedField(p,key);
  return p;
}
function normalizeAll(){
  const st=ensureCourses();
  if(!st)return null;
  ensureAccount();
  for(const [cid,row] of Object.entries(st.progress||{}))st.progress[cid]=normalizeProgressRow(row,cid);
  for(const cid of Object.keys(st.courses||{}))st.progress[cid]=normalizeProgressRow(st.progress[cid],cid);
  if(st.activeCourse&&!st.progress[st.activeCourse])st.progress[st.activeCourse]=normalizeProgressRow(null,st.activeCourse);
  return st;
}
function safeCourse(){
  const st=normalizeAll();
  return st?.courses?.[st.activeCourse]||window.BUILTIN||null;
}
function safeProg(){
  const st=normalizeAll();
  if(!st)return blankProgress();
  st.progress[st.activeCourse]=normalizeProgressRow(st.progress[st.activeCourse],st.activeCourse);
  return st.progress[st.activeCourse];
}
function install(){
  const st=exposeState();
  if(!st)return false;
  normalizeAll();
  // One compatibility surface for all legacy code. Shared values route to majickAccount.
  window.prog=safeProg;
  window.course=safeCourse;
  window.MajickStateCore={version:2,SHARED,stateRef,exposeState,blankProgress,normalizeProgressRow,normalizeAll,ensureAccount,safeProg,safeCourse,install};
  document.documentElement.dataset.majickStateCore='2';
  return true;
}
if(!install())window.addEventListener('DOMContentLoaded',install,{once:true});
})();