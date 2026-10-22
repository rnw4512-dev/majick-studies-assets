(()=>{'use strict';if(window.MajickLearningContinuity)return;
const RULES={
 D772:[
 [/population|sample|sampling|survey|experiment|observational|random/i,'d772-s1-l1'],
 [/bias|response|voluntary|convenience|nonresponse|non-response|loaded question/i,'d772-s1-l2'],
 [/mislead|visual distortion|axis|scale|falsif|misrepresent/i,'d772-s1-l3'],
 [/conclusion|significance|causation|generaliz|correlation|evidence/i,'d772-s1-l4'],
 [/categorical|quantitative|variable|type of data/i,'d772-s2-l1'],
 [/graph|histogram|bar chart|scatterplot|plot|display/i,'d772-s2-l2'],
 [/skew|distribution|unimodal|bimodal|outlier|symmetr|spread/i,'d772-s2-l3'],
 [/mean|median|mode|standard deviation|variance|quartile|five.number|box plot|descriptive/i,'d772-s2-l4'],
 [/theoretical|empirical|sample space|probability basics/i,'d772-s3-l1'],
 [/independent|dependent|disjoint|complement|union|intersection/i,'d772-s3-l2'],
 [/probability|chance|odds|replacement|random event/i,'d772-s3-l3']
 ],
 D756:[
 [/iep team|stakeholder|participants|evaluation team/i,'d756-s1-l1'],
 [/responsive|communicat|listen|consensus/i,'d756-s1-l2'],
 [/family|colleague|collaboration|advocacy|resources/i,'d756-s2-l1'],
 [/cultural|linguistic|language access|interpret/i,'d756-s2-l2'],
 [/create.*iep|writing.*iep|develop.*iep/i,'d756-s3-l1'],
 [/plaafp|present level|annual goal|measurab|baseline/i,'d756-s3-l2'],
 [/service|support|lre|least restrictive|progress monitor/i,'d756-s3-l3'],
 [/transition|postsecondary|vocational/i,'d756-s3-l4']
 ]
};
const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function course(){return String(window.S?.activeCourse||'')}
function identify(terms='',courseId=course()){
 const text=String(terms||'');
 const rule=(RULES[courseId]||[]).find(([regex])=>regex.test(text));
 return rule?.[1]||null;
}
function record({courseId=course(),lessonTitle='',term='',correct=false,activity='vocab',question=null}={}){
 if(!window.S?.progress?.[courseId]||courseId!==course())return null;
 const p=S.progress[courseId];p.learningNeeds=p.learningNeeds||{};
 const explicit=[term,lessonTitle].map(v=>String(v||'').trim().toLowerCase()).find(v=>/^(?:d772-s[123]-l[1-4]|d756-s[123]-l[1-4])(?:-[1-9][0-9]*)?$/.test(v));
 const exact=explicit||null;
 const lessonId=exact||identify(lessonTitle+' '+term,courseId);
 if(!lessonId)return null;const old=p.learningNeeds[lessonId]||{struggles:0,successes:0,activities:[],updated:0,lessonId};
 if(correct){old.successes=(old.successes||0)+1}else old.struggles=(old.struggles||0)+1;
 if(!old.activities.includes(activity))old.activities.push(activity);
 old.updated=Date.now();p.learningNeeds[lessonId]=old;
 if(courseId==='D772'&&!correct&&(lessonId===PROBABILITY_ID||/without replacement|dependent|conditional/i.test(lessonTitle+' '+term)))probabilityNeed(activity,question);
 try{if(typeof save==='function')save()}catch(_){}
 return {lessonId,...old};
}
function needs(courseId=course()){
 const p=window.S?.progress?.[courseId];
 return Object.values(p?.learningNeeds||{}).filter(x=>x.struggles>x.successes).sort((a,b)=>(b.struggles-b.successes)-(a.struggles-a.successes)||b.updated-a.updated);
}
function recommend(courseId=course()){return needs(courseId)[0]||null}
function learned({courseId=course(),lessonId,independent=false}={}){
 if(!independent||!lessonId||!window.S?.progress?.[courseId])return;
 const row=S.progress[courseId].learningNeeds?.[lessonId];if(!row)return;
 row.successes=Math.max(row.successes||0,row.struggles||0);row.updated=Date.now();
 try{if(typeof save==='function')save()}catch(_){}
}
function skillResult(q,correct,assisted=false,origin='practice'){
 const id=String(q?.learningPathLessonId||q?.lessonId||'')||identify([q?.prompt,q?.section,q?.wguTerm].join(' '));
 const p=window.S?.progress?.[course()];if(!p||!id||((q?.course||q?.courseId)&&String(q.course||q.courseId)!==course()))return null;
 const book=p.adaptiveSkills||(p.adaptiveSkills={});
 const row=book[id]||(book[id]={lessonId:id,attempts:[],cycles:0,status:'practice',errors:[]});
 // Technical failures and incomplete visual evidence are not learner attempts.
 if(q?.technicalFailure||q?.invalidVisual||q?.unscorable||q?.visualEvidenceOk===false)return row;
 const guided=!!assisted||origin==='guided-reconstruction'||origin==='guided-repair';
 row.attempts.push({correct:!!correct,assisted:guided,origin,verified:origin==='independent-transfer'&&!!correct&&!guided,time:Date.now()});
 row.attempts=row.attempts.slice(-5);
 // Durable misconception history is separate from the rolling five-attempt diagnostic.
 row.misconceptionHistory=row.misconceptionHistory||{incorrect:0,assisted:0,independentCorrect:0,recoveryRequired:false,recoveryCompleted:false};
 const history=row.misconceptionHistory;
 if(!correct&&!guided){history.incorrect++;if(history.incorrect>=2)history.recoveryRequired=true;}
 else if(guided)history.assisted++;
 else if(correct)history.independentCorrect++;
 // A completed guided reconstruction unlocks transfer but cannot erase the need
 // for independent demonstration. An unsuccessful transfer restores recovery.
 if(origin==='guided-reconstruction'&&correct&&q?.reconstructionVerified===true){history.recoveryCompleted=true;history.recoveryRequired=false;history.awaitingIndependentTransfer=true;}
 if(origin==='independent-transfer'&&!guided&&history.awaitingIndependentTransfer){
  if(correct){history.awaitingIndependentTransfer=false;history.incorrect=0;history.recoveryCompleted=false;}
  else {history.recoveryRequired=true;history.recoveryCompleted=false;history.awaitingIndependentTransfer=false;}
 }

 if(!correct)row.errors.push({prompt:String(q?.prompt||'').slice(0,240),answer:String(q?.answer||''),kind:/mean|median|probability|calculate/i.test(q?.prompt||'')?'calculation-or-formula':/graph|histogram|plot|chart/i.test(q?.prompt||'')?'visual-interpretation':'concept-or-misconception'});
 row.errors=row.errors.slice(-8);
 const count=row.attempts.length,wrong=row.attempts.filter(x=>!x.correct&&!x.assisted).length,independent=row.attempts.filter(x=>x.correct&&!x.assisted).length;
 if(history.recoveryRequired||history.awaitingIndependentTransfer||(count>=3&&wrong>=2)||(count===5&&independent<4))row.status='review-needed';
 if(count===5&&independent>=4&&!history.recoveryRequired&&!history.awaitingIndependentTransfer)row.status='ready-for-teachback';
 // Readiness for a teaching check is not certification. Require separate independent
 // transfer evidence and an evaluated teach-back before the mastery flag can be true.
 row.masteryCertified=false;
 row.masteryEvidence={independentCorrect:independent,attempts:count,transferVerified:false,teachBackVerified:false};
 if(course()==='D772'&&!correct&&(q?.skill==='probability'||/^d772-s3-/.test(id)&&/without replacement/i.test(q?.prompt||'')))probabilityNeed(origin,q);
 if(course()==='D772'&&id===PROBABILITY_ID&&row.connectedProbability){probabilitySeen(q);syncProbabilityEvidence();}
 row.updated=Date.now();try{window.save?.()}catch(_){}
 return row;
}
function masteryStatus(id){
 if(course()==='D772'&&id===PROBABILITY_ID&&probabilityState(false))return probabilityMastery();
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];
 if(!row)return {certified:false,reason:'No independently demonstrated skill evidence'};
 const independent=(row.attempts||[]).filter(x=>x.correct&&!x.assisted);
 const transfer=independent.some(x=>x.origin==='independent-transfer'&&x.verified===true);
 const teaching=row.teachBackAssessment?.evaluated===true&&row.teachBackAssessment?.passed===true;
 const recovery=row.misconceptionHistory||{};
 const certified=independent.length>=4&&transfer&&teaching&&!recovery.recoveryRequired&&!recovery.awaitingIndependentTransfer;
 return {certified,independentCorrect:independent.length,transferVerified:transfer,teachBackVerified:teaching,recoveryRequired:!!recovery.recoveryRequired,awaitingIndependentTransfer:!!recovery.awaitingIndependentTransfer,status:row.status};
}
function skillNeeds(){return Object.values(window.S?.progress?.[course()]?.adaptiveSkills||{}).filter(x=>x.status==='review-needed')}
function skillReview(id){
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];if(!row)return;
 const styles=['explain','simpler','example','quiz'];
 row.status='reviewing';row.method=styles[row.cycles%styles.length];row.cycles++;
 try{window.save?.()}catch(_){}
 window.MajickCourseTutor?.openLesson?.(id,row.method,course());
}
function skillRetry(id){
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];if(!row)return;
 row.status='retry';try{window.save?.()}catch(_){}
 window.MajickWGUPractice?.startSkillRetry?.(id);
}
// Phase 2 extends the existing course-scoped skill record, not account state.
const PROBABILITY_ID='d772-s3-l2-1';
function persist(){try{window.save?.()}catch(_){}}
function probabilityState(create=true){
 if(course()!=='D772')return null;
 const p=window.S?.progress?.D772;if(!p)return null;
 if(!create)return p.adaptiveSkills?.[PROBABILITY_ID]?.connectedProbability||null;
 const book=p.adaptiveSkills||(p.adaptiveSkills={});
 const row=book[PROBABILITY_ID]||(book[PROBABILITY_ID]={lessonId:PROBABILITY_ID,attempts:[],cycles:0,status:'practice',errors:[]});
 return row.connectedProbability||(row.connectedProbability={version:1,next:0,tasks:{},evidence:[],drafts:{},need:null});
}
function probabilitySeen(q){
 const st=probabilityState(false);if(!st||q?.skill!=='probability'||!Array.isArray(q.data))return;
 st.seenDatasets=st.seenDatasets||[];const key=JSON.stringify(q.data);
 if(!st.seenDatasets.includes(key))st.seenDatasets.push(key);
}
function probabilityNeed(origin,q){
 const st=probabilityState();if(!st)return;
 probabilitySeen(q);
 st.need={misconception:'unchanged-sample-space',origin,at:Date.now()};
 syncProbabilityEvidence();
 persist();
}
function probabilityMastery(){
 const st=probabilityState(false),e=st?.evidence||[];
 const lastRepair=e.map(x=>x.kind==='repair'&&x.correct).lastIndexOf(true);
 const repaired=lastRepair>=0,recent=e.slice(lastRepair+1);
 const reasoning=recent.filter(x=>x.kind==='reasoning'&&x.correct&&!x.assisted);
 const transfer=recent.some(x=>x.kind==='transfer'&&x.correct&&!x.assisted);
 const teaching=recent.some(x=>x.kind==='teaching'&&x.correct&&!x.assisted);
 const unresolved=!!st?.need;
 return {certified:repaired&&reasoning.length>=2&&transfer&&teaching&&!unresolved,repairVerified:repaired&&!unresolved,independentCorrect:reasoning.length,transferVerified:transfer,teachBackVerified:teaching,needsRepair:unresolved};
}
function probabilityTask(kind){
 const st=probabilityState();if(!st||!['repair','reasoning','transfer','teaching'].includes(kind))return null;
 const m=probabilityMastery();
 if(kind!=='repair'&&!m.repairVerified||kind==='transfer'&&m.independentCorrect<2||kind==='teaching'&&!m.transferVerified)return null;
 const old=st.tasks[kind];if(old&&!old.completed)return old;
 if(kind==='repair'&&m.repairVerified||kind==='reasoning'&&m.independentCorrect>=2||kind==='transfer'&&m.transferVerified||kind==='teaching'&&m.teachBackVerified)return old||null;
 let q;
 while(st.next<42){
  const candidate=window.MajickGeneratedPractice?.probabilityCase(st.next++,kind==='transfer');
  if(candidate&&!(st.seenDatasets||[]).includes(JSON.stringify(candidate.data))){q=candidate;break;}
 }
 if(!q){persist();return null;}
 probabilitySeen(q);const task={id:q.id,kind,q,removed:false,completed:false,submitted:false,at:Date.now()};st.tasks[kind]=task;persist();return task;
}
function probabilityDraft(kind,values){
 const st=probabilityState();if(!st)return;
 st.drafts[kind]={...(st.drafts[kind]||{}),...values};persist();
}
function probabilityRemove(){
 const t=probabilityState(false)?.tasks.repair;if(!t||t.completed)return false;
 t.removed=true;persist();return true;
}
function syncProbabilityEvidence(){
 const status=probabilityMastery(),row=window.S?.progress?.D772?.adaptiveSkills?.[PROBABILITY_ID];
 if(!row)return status;
 row.masteryCertified=status.certified;row.masteryEvidence={...status};
 row.status=status.certified?'mastered':status.needsRepair?'review-needed':status.transferVerified?'ready-for-teachback':'practice';
 return status;
}
function probabilityCheck(kind,values={}){
 const st=probabilityState(false),t=st?.tasks[kind];
 if(!st||!t||t.submitted||t.completed)return {ok:false,message:'This response is already recorded. Use a fresh challenge.'};
 const m=probabilityMastery();
 if(kind!=='repair'&&!m.repairVerified||kind==='transfer'&&m.independentCorrect<2||kind==='teaching'&&!m.transferVerified)return {ok:false,message:'Complete the preceding evidence first.'};
 const [g,p]=t.q.data,total=g+p,second=t.q.event==='green-purple'?p:g-1;
 const number=(v,w)=>String(v??'').trim()!==''&&Number.isFinite(Number(v))&&Number(v)===w;
 const fraction=v=>{const parts=String(v||'').trim().split('/');return parts.length===2&&parts.every(x=>x.trim()!==''&&Number.isFinite(Number(x)))&&Number(parts[1])!==0?Number(parts[0])/Number(parts[1]):Number.NaN};
 const expected=g*second/(total*(total-1));
 let correct=number(values.first,g)&&number(values.total,total)&&number(values.second,second)&&number(values.remaining,total-1)&&Math.abs(fraction(values.result)-expected)<1e-9&&values.rule==='multiply-conditional';
 if(kind==='repair')correct=correct&&t.removed;
 if(kind==='teaching')correct=correct&&values.diagnosis==='sample-space'&&values.model==='remove'&&values.probe==='new-draw';
 const assisted=kind==='repair';t.submitted=true;t.completed=correct;
 st.drafts[kind]={...values};
 st.evidence.push({id:t.id,kind,correct,assisted,origin:S.screen,at:Date.now(),values:{...values},rubric:'conditional-counts-product-v1'});
 // Existing adaptive tracker and existing idempotent reward bridge remain owners.
 skillResult(t.q,correct,assisted,kind==='transfer'?'independent-transfer':kind==='repair'?'connected-guided':kind==='teaching'?'structured-teachback':'independent-reasoning');
 if(correct&&kind!=='teaching')window.MajickStudyProgress?.creditAnswer?.({key:'connected:D772:'+t.id,course:'D772',qid:t.id,topicId:PROBABILITY_ID,chosen:String(values.result),answer:t.q.answer,correct:true,assisted,source:'connected-'+kind,difficulty:3,transfer:kind==='transfer'});
 if(!correct){st.need={misconception:'unchanged-sample-space',origin:S.screen,at:Date.now()};}
 if(correct&&kind==='repair')st.need=null;
 syncProbabilityEvidence();
 persist();
 return {ok:correct,message:correct?(kind==='repair'?'Guided repair recorded; no independent mastery credit.':kind==='teaching'?'Structured teaching model and diagnostic probe verified. Written explanation saved for review.':'Independent conditional reasoning verified.'):'Not yet. Recount the sample space after the first draw. This attempt is saved; repair and then use a fresh challenge.'};
}
function probabilityAdvanceReasoning(expectedId){
 const st=probabilityState(false),current=st?.tasks?.reasoning;
 if(!current||current.id!==expectedId||!current.submitted||!current.completed)return null;
 if(probabilityMastery().independentCorrect>=2)return null;
 // Do not discard a verified answer or its dataset history; only replace the
 // completed task slot. A second pointer/click event cannot advance it twice.
 delete st.tasks.reasoning;
 delete st.drafts.reasoning;
 const fresh=probabilityTask('reasoning');
 if(!fresh){st.tasks.reasoning=current;persist();return null;}
 persist();return fresh;
}
function probabilityFresh(kind){
 const st=probabilityState(false),t=st?.tasks[kind];if(!t||!t.submitted||t.completed)return null;
 delete st.tasks[kind];delete st.drafts[kind];return probabilityTask(kind);
}
window.MajickLearningContinuity={version:'2.0-probability',identify,record,needs,recommend,learned,skillResult,masteryStatus,skillNeeds,skillReview,skillRetry,probabilityState,probabilityNeed,probabilityTask,probabilityMastery,probabilityDraft,probabilityRemove,probabilityCheck,probabilityFresh,probabilityAdvanceReasoning};
})();