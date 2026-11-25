/* Course organization is navigation, never a study objective. */
(()=>{'use strict';
const rune=x=>typeof x==='string'&&(/(?:^|\|)rune-sort:/.test(x)||x==='game-realm-rune-sort');
function excluded(q){
 if(!q)return false;
 if(rune(q.id)||rune(q.questionKey)||rune(q.origin)||rune(q.room))return true;
 const prompt=String(q.prompt||q.question||q.stem||'').trim();
 if(/^Classify the skill requested in:/i.test(prompt))return true;
 return /\b(?:which|what)\s+(?:course\s+)?(?:section|unit|chapter|module)\b/i.test(prompt)&&(
 /\b(?:of (?:this|the|your) course|course (?:outline|section|unit|chapter|module)|(?:topic|concept)\b.{0,60}\b(?:belongs?|located|found|covered)|(?:covers?|contains?|includes?)\b|\b(?:is|does)\b.{0,80}\b(?:topic|concept)\b)/i.test(prompt))&&
 !/\b(?:IEP|report|graph|chart|assessment|novel|story|textbook)\b/i.test(prompt);
}
function clean(state){
 let changed=false;
 const remove=(obj,key)=>{delete obj[key];changed=true};
 for(const courseId of new Set([...Object.keys(state.courses||{}),...Object.keys(state.progress||{})])){
  const course=state.courses?.[courseId]||{};
  const ids=new Set((course.questionBank||[]).filter(excluded).map(q=>q.id).filter(Boolean));
  if(ids.size){course.questionBank=course.questionBank.filter(q=>!excluded(q));changed=true}
  const p=state.progress?.[courseId];if(!p)continue;
  if(p.realmRecords&&Object.hasOwn(p.realmRecords,'runesort'))remove(p.realmRecords,'runesort');
  const retired=x=>typeof x==='string'?rune(x)||ids.has(x):excluded(x)||ids.has(x?.qid)||ids.has(x?.questionId);
  for(const key of ['answers','guidedQuestionHistory'])if(Array.isArray(p[key])){
   const next=p[key].filter(x=>!retired(x)&&!(key==='guidedQuestionHistory'&&typeof x==='string'&&x.includes('Classify the skill requested in:')));
   if(next.length!==p[key].length){p[key]=next;changed=true}
  }
  for(const [id,row] of Object.entries(p.adaptiveSkills||{})){
   let touched=false;
   for(const [skill,repair] of Object.entries(row.reconstructionBySkill||{})){
    if(excluded(repair.source)||(skill.startsWith('classify:')&&(repair.failedIds||[]).some(rune))){remove(row.reconstructionBySkill,skill);touched=true}
   }
   for(const key of ['attempts','errors'])if(Array.isArray(row[key])){
    const next=row[key].filter(x=>!retired(x));if(next.length!==row[key].length){row[key]=next;changed=true;touched=true}
   }
   // Dedicated retired rows have no remaining subject evidence. Mixed rows keep it.
   if(touched&&!row.attempts?.length&&!Object.keys(row.reconstructionBySkill||{}).length&&!row.errors?.length)remove(p.adaptiveSkills,id);
  }
 }
 return changed;
}
/* Fairness is derived from existing answer history, never a second progress ledger. */
function leastSeen(pool,answers=[]){
 if(!Array.isArray(pool)||!pool.length)return [];
 const counts=new Map();for(const a of answers||[]){const id=String(a?.qid??a?.id??'');if(id)counts.set(id,(counts.get(id)||0)+1)}
 const count=q=>counts.get(String(q.id||''))||0,min=Math.min(...pool.map(count));
 return pool.filter(q=>count(q)===min);
}
function skillKey(q){return String(q?.rotationSkill||q?.skill||q?.learningPathLessonId||q?.topicId||q?.lessonId||q?.section||'course')}
const processed=new WeakSet();
function run(){
 const state=window.S;if(!state||processed.has(state)||!window.MajickSaveSafety)return false;
 const candidate=JSON.parse(JSON.stringify(state));
 if(!clean(candidate)){processed.add(state);return false}
 // The existing save owner retains its recovery copy; failed writes leave live data intact.
 try{window.MajickSaveSafety.write(candidate)}catch(_){return false}
 state.courses=candidate.courses;state.progress=candidate.progress;processed.add(state);
 queueMicrotask(()=>window.render?.());return true;
}
window.MajickCourseQuestionPolicy={excluded,clean,run,leastSeen,skillKey};
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{
 window.MajickRenderQueue?.register?.('course-question-policy',run,1);run();
},{once:true});
})();
