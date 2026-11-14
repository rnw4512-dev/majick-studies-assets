/* Single adaptive question-selection owner. Existing answer/family keys stay readable. */
(()=>{'use strict';if(window.MajickQuestionScheduler)return;
 function normalize(s=''){return promptTokens(String(s)).slice(0,10).sort().join('|')}
 function scenarioFamily(q){return `${q?.topicId||'mixed'}::${normalize(q?.answer||'')}::${normalize(q?.keyClue||q?.why||q?.prompt||'')}`}
 function targetDifficulty(){
   const a=(prog().answers||[]).filter(x=>!x.assisted).slice(-24);if(a.length<4)return 2;
   const acc=a.filter(x=>x.correct).length/a.length;
   let streak=0;for(let i=a.length-1;i>=0&&a[i].correct;i--)streak++;
   let target=2;
   if(a.length>=6&&acc>=.60)target=3;
   if(a.length>=8&&acc>=.72)target=4;
   if(a.length>=12&&acc>=.84)target=5;
   // Three or more independent correct answers in a row should feel like a real level-up.
   if(streak>=3)target=Math.min(5,target+1);
   return target;
 }

 function topicDifficulty(topicId){
   const base=targetDifficulty(),a=(prog().answers||[]).filter(x=>x.topicId===topicId&&!x.assisted).slice(-12);
   if(!a.length)return base;
   const acc=a.filter(x=>x.correct).length/a.length;
   if(a.length>=6&&acc>=.84)return Math.max(base,5);
   if(a.length>=5&&acc>=.74)return Math.max(base,4);
   if(acc<.50)return Math.min(base,2);
   return base;
 };
 function pick(pool=questionPool()){
   if(!pool?.length)return null;
   const p=prog(),answers=p.answers||[],recent=answers.slice(-56),sessionIds=new Set((session?.questions||[]).map(x=>typeof x==='string'?x:x?.id).filter(Boolean));
   const veryRecentIds=new Set(recent.slice(-40).map(a=>a.qid));
   const byId=new Map((questionPool()||[]).map(q=>[q.id,q]));
   const recentFamilies=new Set(recent.slice(-28).map(a=>a.v339Family||(byId.get(a.qid)?scenarioFamily(byId.get(a.qid)):a.family)).filter(Boolean));
   const recentQs=recent.slice(-14).map(a=>byId.get(a.qid)).filter(Boolean);
   const target=targetDifficulty();
   let candidates=pool.filter(q=>!sessionIds.has(q.id)&&!veryRecentIds.has(q.id));
   if(candidates.length<10)candidates=pool.filter(q=>!sessionIds.has(q.id)&&!recent.slice(-22).some(a=>a.qid===q.id));
   if(candidates.length<6)candidates=pool.filter(q=>!sessionIds.has(q.id)&&!recent.slice(-10).some(a=>a.qid===q.id));
   if(!candidates.length)candidates=pool.filter(q=>!sessionIds.has(q.id));
   if(!candidates.length)candidates=pool.slice();

   // Same conceptual/scenario family stays out while enough alternatives exist.
   let familyFresh=candidates.filter(q=>!recentFamilies.has(scenarioFamily(q)));
   if(familyFresh.length>=6)candidates=familyFresh;

   // Near-duplicate wording also stays out. This prevents the same scenario being recycled with tiny wording changes.
   if(typeof qFingerprint==='function'&&typeof jaccard==='function'&&recentQs.length){
     const freshByMeaning=candidates.filter(q=>{
       const fp=qFingerprint(q);return !recentQs.some(r=>jaccard(fp,qFingerprint(r))>=.48);
     });
     if(freshByMeaning.length>=6)candidates=freshByMeaning;
   }

   // Repairs use a DIFFERENT question/scenario from the missed item whenever possible.
   const urgent=(p.urgentRepair||[]).slice(-10).reverse();
   if(urgent.length&&!session?.currentWasRepair&&Math.random()<.24){
     const u=urgent[0],r=candidates.filter(q=>q.topicId===u.topicId&&q.id!==u.qid);
     if(r.length){const hi=Math.max(...r.map(q=>q.difficulty||1));const rr=r.filter(q=>(q.difficulty||1)>=Math.max(2,hi-1));if(rr.length)candidates=rr;else candidates=r;}
   }

   // Once the learner is performing strongly, prefer actual application/hard items.
   let challenging=candidates.filter(q=>(q.difficulty||1)>=target);
   if(challenging.length>=5)candidates=challenging;
   else {
     let close=candidates.filter(q=>(q.difficulty||1)>=Math.max(2,target-1));
     if(close.length>=5)candidates=close;
   }

   const recentTopic={},recentSection={},recentFormat={};
   for(const a of recent.slice(-18)){recentTopic[a.topicId]=(recentTopic[a.topicId]||0)+1;recentSection[a.section||'']=(recentSection[a.section||'']||0)+1;recentFormat[a.format||'scenario']=(recentFormat[a.format||'scenario']||0)+1}
   const hist=new Set(answers.map(a=>a.qid));
   const scored=candidates.map(q=>{
     const d=q.difficulty||1,fmt=q.format||'scenario',sec=q.section||'';
     let score=12-Math.abs(d-target)*2.15;
     if(d>=4)score+=target>=4?3.1:.4;if(d===5&&target===5)score+=3.0;
     if(!hist.has(q.id))score+=3.2;
     score-=Math.min(3,recentTopic[q.topicId]||0)*1.15;
     score-=Math.min(3,recentSection[sec]||0)*.55;
     score-=Math.min(3,recentFormat[fmt]||0)*.38;
     if(['transfer','error_analysis','discrimination'].includes(fmt))score+=1.35;
     if(recentFamilies.has(scenarioFamily(q)))score-=4.5;
     score+=Math.random()*.85;
     return [q,score];
   }).sort((a,b)=>b[1]-a[1]);
   const top=scored.slice(0,Math.min(4,scored.length));
   return (top.length?top[Math.floor(Math.random()*top.length)][0]:candidates[0])||pool[0];
 };

 // Record stronger family signature and section for future rotation without changing existing save schema.
 const baseRecord=record;
 function recordAnswer(q,chosen,correct,confidence,mode){
   baseRecord(q,chosen,correct,confidence,mode);
   const a=prog().answers?.at(-1);if(a){a.v339Family=scenarioFamily(q);a.section=q.section||'';}
   try{save()}catch(_){ }
 };


window.MajickQuestionScheduler=Object.freeze({normalize,scenarioFamily,targetDifficulty,topicDifficulty,pick,record:recordAnswer});
window.v339GlobalTargetDifficulty=targetDifficulty;
window.topicTargetDifficulty=topicDifficulty;window.pickAdaptive=pick;window.record=recordAnswer;
})();
