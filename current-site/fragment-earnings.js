/* Shared Egg Fragment earning bridge: one existing RewardCore balance and ledger.
   Never writes XP, mastery, crystals, Guardian states or an alternate fragment wallet.
   Academic practice: 5 distinct correct source-linked questions = 1 fragment.
   Educational games: one fragment on first >=75% clear of a >=3-item game.
   Starfall: one fragment per newly earned ticket completed perfectly (3/3).
*/
(function(){
'use strict';
if(window.MajickFragmentEarnings)return;
const STORE_KEY='majick-fragment-study-evidence-v1';
let data={};
function restoreRecords(){try{const stored=JSON.parse((window.MajickSaveSafety?.records||localStorage).getItem(STORE_KEY)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))data=stored}catch(_){}}
restoreRecords();
document.addEventListener('majick:save-restored',restoreRecords);
const str=x=>String(x??'').trim();
const valid=x=>/^[A-Z0-9_-]{2,32}$/i.test(x);
function persist(){try{(window.MajickSaveSafety?.records||localStorage).setItem(STORE_KEY,JSON.stringify(data))}catch(_){}}
function receipt(type,key,course){
 const r=window.MajickRewardCore;
 if(!r||typeof r.award!=='function')return null;
 return r.award(type,{key,course,source:'study-and-play-fragments'});
}
function refresh(){
 try{window.MajickStudyObservatory?.refresh?.()}catch(_){}
 try{document.dispatchEvent(new CustomEvent('majick:fragment-balance',{detail:{count:balance()}}))}catch(_){}
}
function balance(){return Math.max(0,Number(window.MajickRewardCore?.inspect?.()?.eggFragments||0))}
function onStudy(e){
 const d=e?.detail||{},cid=str(d.courseId).toUpperCase(),lesson=str(d.lessonId),question=str(d.questionId);
 if(!valid(cid)||!lesson||!question||d.correct!==true||!/^https:\/\//.test(str(d.sourceUrl)))return;
 // No awarding from games, fabricated sources, or unsupported question formats.
 if(!['original_course_question','source_based_practice'].includes(str(d.sourceType)))return;
 const row=data[cid]||(data[cid]={questions:{},issued:0});
 const id=lesson+'|'+question;
 if(row.questions[id])return;
 row.questions[id]=true;
 const count=Object.keys(row.questions).length;
 persist();
 if(count%5!==0)return;
 const milestone=count/5;
 const outcome=receipt('study-fragment-earned','fragment:source:'+cid+':'+milestone,cid);
 if(outcome&&!outcome.rejected){row.issued=Math.max(Number(row.issued||0),milestone);persist();refresh()}
}
function onGame(e){
 const d=e?.detail||{},cid=str(d.courseId).toUpperCase(),game=str(d.gameId),score=Number(d.score),total=Number(d.total);
 if(!valid(cid)||!game||d.firstClear!==true||total<3||score/total<.75||cid==='D756')return;
 if(receipt('game-fragment-earned','fragment:game:'+cid+':'+game,cid))refresh();
}
function onStarfall(e){
 const d=e?.detail||{},cid=str(d.courseId).toUpperCase(),pass=Number(d.earnedPass);
 if(!valid(cid)||!Number.isInteger(pass)||pass<1||d.perfect!==true||Number(d.score)<3||Number(d.score)!==Number(d.total))return;
 if(receipt('starfall-fragment-earned','fragment:starfall:'+cid+':'+pass,cid))refresh();
}
document.addEventListener('majick:sourced-practice',onStudy);
document.addEventListener('majick:game-complete',onGame);
document.addEventListener('majick:starfall-complete',onStarfall);
window.MajickFragmentEarnings=Object.freeze({VERSION:'1.0',balance,studyCount:(cid)=>Object.keys(data[str(cid).toUpperCase()]?.questions||{}).length,refresh});
})();