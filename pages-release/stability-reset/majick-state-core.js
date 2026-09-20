// Majick Studies Stability Reset — authoritative state compatibility layer
(function(){
'use strict';
const SHARED=['xp','crystals','chests'];
function blankProgress(){
  return {answers:[],explanations:[],repair:[],spacedQueue:[],streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,charms:[],chests:0,inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},cosmetics:[],eliminationWins:0,voicePractices:0};
}
function plainNumber(v){v=Number(v);return Number.isFinite(v)?v:0}
function ensureCourses(){
  if(!window.S)return;
  S.courses=(S.courses&&typeof S.courses==='object'&&!Array.isArray(S.courses))?S.courses:{};
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
  if(!S.activeCourse||!S.courses[S.activeCourse])S.activeCourse=Object.keys(S.courses)[0]||S.activeCourse||'PMFC';
}
function initialSharedValue(key){
  let best=plainNumber(S?.majickAccount?.[key]);
  for(const row of Object.values(S?.progress||{})){
    if(row&&typeof row==='object')best=Math.max(best,plainNumber(row[key]));
  }
  return best;
}
function ensureAccount(){
  if(!window.S)return null;
  S.majickAccount=(S.majickAccount&&typeof S.majickAccount==='object'&&!Array.isArray(S.majickAccount))?S.majickAccount:{};
  for(const key of SHARED)S.majickAccount[key]=initialSharedValue(key);
  S.majickAccount.schemaVersion=Math.max(2,plainNumber(S.majickAccount.schemaVersion));
  return S.majickAccount;
}
function bindSharedField(row,key){
  const desc=Object.getOwnPropertyDescriptor(row,key);
  if(desc?.get&&desc?.set&&desc.get.__majickSharedGetter)return;
  const getter=function(){return plainNumber(S?.majickAccount?.[key])};
  getter.__majickSharedGetter=true;
  Object.defineProperty(row,key,{
    enumerable:true,configurable:true,
    get:getter,
    set(v){ensureAccount();S.majickAccount[key]=plainNumber(v)}
  });
}
function normalizeProgressRow(row,cid=''){
  const p=(row&&typeof row==='object'&&!Array.isArray(row))?row:blankProgress();
  p.answers=Array.isArray(p.answers)?p.answers:[];
  p.explanations=Array.isArray(p.explanations)?p.explanations:[];
  p.repair=Array.isArray(p.repair)?p.repair:[];
  p.spacedQueue=Array.isArray(p.spacedQueue)?p.spacedQueue:[];
  p.charms=Array.isArray(p.charms)?p.charms:[];
  p.inventory=(p.inventory&&typeof p.inventory==='object'&&!Array.isArray(p.inventory))?p.inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  p.streak=plainNumber(p.streak);p.bossWins=plainNumber(p.bossWins);
  if(cid)p.courseId=cid;
  for(const key of SHARED)bindSharedField(p,key);
  return p;
}
function normalizeAll(){
  ensureCourses();ensureAccount();
  for(const [cid,row] of Object.entries(S.progress||{}))S.progress[cid]=normalizeProgressRow(row,cid);
  for(const cid of Object.keys(S.courses||{}))S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
  if(S.activeCourse&&!S.progress[S.activeCourse])S.progress[S.activeCourse]=normalizeProgressRow(null,S.activeCourse);
}
function safeCourse(){
  normalizeAll();
  return S.courses?.[S.activeCourse]||window.BUILTIN||null;
}
function safeProg(){
  normalizeAll();
  S.progress[S.activeCourse]=normalizeProgressRow(S.progress[S.activeCourse],S.activeCourse);
  return S.progress[S.activeCourse];
}
function install(){
  if(!window.S)return false;
  normalizeAll();
  // One compatibility surface for all legacy code. Shared values route to majickAccount.
  window.prog=safeProg;
  window.course=safeCourse;
  window.MajickStateCore={version:1,SHARED,blankProgress,normalizeProgressRow,normalizeAll,ensureAccount,safeProg,safeCourse,install};
  document.documentElement.dataset.majickStateCore='1';
  return true;
}
if(!install())window.addEventListener('DOMContentLoaded',install,{once:true});
})();