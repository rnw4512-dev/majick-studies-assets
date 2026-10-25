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
 row.attempts.push({correct:!!correct,assisted:!!assisted,origin,questionKey:String(q?.id||'')+'|'+JSON.stringify(q?.data||q?.prompt||''),verified:origin==='independent-transfer'&&!!correct&&!assisted,time:Date.now()});
 row.attempts=row.attempts.slice(-5);
 // Durable misconception history is separate from the rolling five-attempt diagnostic.
 row.misconceptionHistory=row.misconceptionHistory||{incorrect:0,assisted:0,independentCorrect:0,recoveryRequired:false,recoveryCompleted:false};
 const history=row.misconceptionHistory;
 if(!correct&&origin!=='guided-reconstruction'){history.incorrect++;if(history.incorrect>=2)history.recoveryRequired=true;}
 else if(assisted)history.assisted++;
 else history.independentCorrect++;
 if(origin==='guided-reconstruction'&&correct&&q?.reconstructionVerified===true){history.recoveryCompleted=true;history.recoveryRequired=false;history.awaitingIndependentTransfer=true;}
 if(origin==='independent-transfer'&&correct&&!assisted&&history.awaitingIndependentTransfer){history.awaitingIndependentTransfer=false;history.incorrect=0;history.recoveryCompleted=false;}

 if(!correct)row.errors.push({prompt:String(q?.prompt||'').slice(0,240),answer:String(q?.answer||''),kind:/mean|median|probability|calculate/i.test(q?.prompt||'')?'calculation-or-formula':/graph|histogram|plot|chart/i.test(q?.prompt||'')?'visual-interpretation':'concept-or-misconception'});
 row.errors=row.errors.slice(-8);
 const count=row.attempts.length,wrong=row.attempts.filter(x=>!x.correct).length,independent=row.attempts.filter(x=>x.correct&&!x.assisted).length;
 if(history.recoveryRequired||(count>=3&&wrong>=2)||(count===5&&independent<4))row.status='review-needed';
 if(count===5&&independent>=4&&!history.recoveryRequired&&!history.awaitingIndependentTransfer)row.status='ready-for-teachback';
 // Readiness for a teaching check is not certification. Require separate independent
 // transfer evidence and an evaluated teach-back before the mastery flag can be true.
 row.masteryCertified=false;
 row.masteryEvidence={independentCorrect:independent,attempts:count,transferVerified:false,teachBackVerified:false};
 if(course()==='D772'&&!correct&&(q?.skill==='probability'||/^d772-s3-/.test(id)&&/without replacement/i.test(q?.prompt||'')))probabilityNeed(origin,q);
 if(course()==='D772'&&id===PROBABILITY_ID&&row.connectedProbability){probabilitySeen(q);syncProbabilityEvidence();}
 if(course()==='D772'&&!assisted&&origin!=='mixed-exam-independent'&&origin!=='guided-reconstruction')practiceAnswer(q,correct,true);
 row.updated=Date.now();try{window.save?.()}catch(_){}
 return row;
}
// Mixed formative practice shares this academic owner; reconstruction is
// assisted evidence and cannot certify mastery or emit a reward.
function practiceSkill(q){
 if(q?.skill)return String(q.skill);
 const text=String(q?.id||'')+' '+String(q?.prompt||'');
 const match=[['median',/median/i],['mean',/mean|average/i],['expected-value',/expected|ev-/i],['dependent-probability',/dependent|without replacement/i],['venn-sets',/venn|union|intersection|complement|exclusive|disjoint|not-/i],['sampling',/rep-|sample|population|nonresponse/i],['causation',/causation|observational|causal/i],['histogram',/histogram/i],['boxplot',/box.plot|quartile/i],['scatterplot',/scatterplot/i]].find(([,r])=>r.test(text));
 return match?.[0]||String(q?.lessonId||'reasoning');
}
function practiceRecovery(q,create=true){
 if(course()!=='D772'||q?.courseId&&q.courseId!=='D772')return null;
 const p=window.S?.progress?.D772,id=q?.learningPathLessonId||q?.lessonId;
 if(!p||!id)return null;
 const book=p.adaptiveSkills||(create?(p.adaptiveSkills={}):{});
 const row=book[id]||(create?(book[id]={lessonId:id,attempts:[],cycles:0,status:'practice',errors:[]}):null);
 if(!row)return null;
 const map=row.reconstructionBySkill||(create?(row.reconstructionBySkill={}):{}),key=practiceSkill(q);
 return map[key]||(create?(map[key]={misses:0,required:false,awaitingTransfer:false,stage:0,verified:[],draft:{},failedIds:[],seenIds:[],source:null}):null);
}
function guidedQuestionKey(q){return JSON.stringify([String(q.prompt||q.question||'').replace(/\s+/g,' ').trim(),q.data||q.visual||q.visualHtml||null])}
function guidedQuestionCourse(q){return [q.courseId,q.course,q.learningPathLessonId,q.lessonId].map(value=>String(value||'').match(/^d\d+/i)?.[0]?.toUpperCase()).find(Boolean)}
function guidedQuestionAvailable(q){const owner=guidedQuestionCourse(q);if(owner&&owner!==course())return false;return !(window.S?.progress?.[course()]?.guidedQuestionHistory||[]).includes(guidedQuestionKey(q))}
function rememberGuidedQuestion(q){const owner=guidedQuestionCourse(q);if(owner&&owner!==course())return;const p=window.S?.progress?.[course()];if(!p)return;const history=p.guidedQuestionHistory||(p.guidedQuestionHistory=[]),key=guidedQuestionKey(q);if(!history.includes(key))history.push(key);try{window.save?.()}catch(_){}}
function nextGuidedSequence(key){
 const p=window.S?.progress?.[course()];if(!p)return null;
 const sequences=p.guidedExampleSequences||(p.guidedExampleSequences={});
 const next=(Number.isSafeInteger(sequences[key])?sequences[key]:0)+1;
 if(!Number.isSafeInteger(next))return null;sequences[key]=next;try{window.save?.()}catch(_){}return next;
}
function diagnosePracticeMistake(q,selected){
 const text=String(q.prompt||'').toLowerCase(),d=q.data||{},value=Number(String(selected??'').replace(/[^0-9.−-]/g,'').replace('−','-'));
 const close=n=>selected!=null&&Number.isFinite(n)&&Math.abs(value-n)<.001;
 if(/at least one/.test(text)){
  const exactly=d.rate!=null?d.trials*d.rate*(1-d.rate)**(d.trials-1):NaN;
  return {code:close(exactly)?'exactly-one-for-at-least-one':'complement-event',message:close(exactly)?'You calculated exactly one success. At least one includes one, two and every larger possible success count.':'Separate at least one success from no successes; subtract the no-success probability from 1.'};
 }
 if(/exactly one/.test(text))return {code:'exactly-one-event',message:'Exactly one requires one success and one failure in the qualifying orders. It excludes outcomes with two successes.'};
 if(/given that|conditional/.test(text)||d.deliveryOnly!=null)return {code:'conditional-denominator',message:'Given restricts the sample space. Use the size of the named group as the denominator, rather than everyone surveyed.'};
 if(/without replacement/.test(text))return {code:'remaining-denominator',message:'A draw removes one outcome. Rebuild the second branch with a total one smaller and update the favorable count only when that type was removed.'};
 return {code:'method-and-evidence',message:'Identify the requested quantity and match the method to the evidence before substituting numbers.'};
}
function practiceReadiness(q){
 const r=practiceRecovery(q,false),count=(r?.recentIndependentIds||[]).length;
 return {label:r?.required?'Needs guidance':count>=2&&!r?.awaitingTransfer?'Demonstrated independently':r?'Practicing independently':'Needs guidance',independentCount:count,certified:false};
}
function practiceReadinessList(){
 const rows=window.S?.progress?.[course()]?.adaptiveSkills||{};return Object.values(rows).flatMap(row=>Object.entries(row.reconstructionBySkill||{}).map(([skill])=>({skill,lessonId:row.lessonId,...practiceReadiness({skill,lessonId:row.lessonId})})));
}
function practiceAnswer(q,correct,alreadyRecorded=false,selected=null){
 const r=practiceRecovery(q);if(!r)return null;
 // Retries/replayed submissions of the same item cannot manufacture evidence.
 const evidenceKey=q.generated?practiceSkill(q)+'|'+JSON.stringify(q.data):String(q.id);
 r.seenKeys=r.seenKeys||r.seenIds.slice();if(r.seenKeys.includes(evidenceKey))return r;r.seenKeys.push(evidenceKey);r.seenKeys=r.seenKeys.slice(-300);
 r.seenIds.push(q.id);r.seenIds=r.seenIds.slice(-300);
 if(!alreadyRecorded)skillResult(q,correct,false,'mixed-exam-independent');
 if(!correct){r.failedData=r.failedData||[];if(q.generated)r.failedData.push(JSON.stringify(q.data));r.misses++;if(!r.failedIds.includes(q.id))r.failedIds.push(q.id);if(r.misses>=1){r.required=true;r.awaitingTransfer=false;r.stage=0;r.verified=[];r.draft={};r.planVersion=4;r.exampleSequence=nextGuidedSequence('repair');r.planSnapshot=null;r.solvedSteps=[];r.recentIndependentIds=[];r.coaching=diagnosePracticeMistake(q,selected);r.source=JSON.parse(JSON.stringify(q))}}
 else {r.recentIndependentIds=r.recentIndependentIds||[];if(!r.required&&!(q.generated?(r.failedData||[]).includes(JSON.stringify(q.data)):r.failedIds.includes(q.id)))r.recentIndependentIds.push(evidenceKey);
 if(r.awaitingTransfer&&!(q.generated?(r.failedData||[]).includes(JSON.stringify(q.data)):r.failedIds.includes(q.id))){r.awaitingTransfer=false;r.misses=0;r.transferId=q.id;r.stage=0;r.verified=[];r.draft={}}}
 try{window.save?.()}catch(_){}return r;
}
function reconstructionCheck(q,values){
 const r=practiceRecovery(q,false),plan=window.MajickSolutionEngine?.reconstructionPlan?.(q);
 if(!r?.required||!plan||r.stage<0||r.stage>=plan.length)return {ok:false,message:'No active guided reconstruction.'};
 const step=plan[r.stage];let ok=false;
 const matches=(f,value)=>value!=null&&String(value).trim()!==''&&Number.isFinite(Number(value))&&(r.planVersion===4?Number(value)===f.value:Math.abs(Number(value)-f.value)<=Math.max(.0002,Math.abs(f.value)*.0001));
 if(step.regions)ok=step.regions.every((region,i)=>Boolean(values[i])===region.selected);
 else if(step.fields)ok=step.fields.every((f,i)=>matches(f,values[i]));
 else ok=String(values[0])===String(step.answer);
 if(!ok){const missing=step.fields?.filter((f,i)=>!matches(f,values[i])).map(f=>f.label);return {ok:false,message:(step.explanations?.[values[0]]|| (missing?.length?'Recheck '+missing.join(', ')+'. Match the scenario to the formula; open this step’s breakdown for help.':'Recheck the study conditions and what the evidence supports.'))+' Guided corrections do not count as independent errors.'}}
 r.solvedSteps=r.solvedSteps||[];r.solvedSteps.push({stage:r.stage,title:step.title,formula:step.formula||'',entries:step.fields?step.fields.map((f,i)=>f.label+' = '+Number(Number(values[i]).toFixed(6))):step.regions?step.regions.filter((_,i)=>values[i]).map(region=>region.label):[String(values[0]),...(step.justification?['Why: '+step.justification]:[])]});
 r.verified.push(r.stage);r.stage++;r.draft={};
 if(r.stage===plan.length){if(r.verified.length!==plan.length)return {ok:false,message:'Complete every reconstruction step.'};r.required=false;r.awaitingTransfer=true;skillResult({...q,reconstructionVerified:true},true,true,'guided-reconstruction')}
 try{window.save?.()}catch(_){}return {ok:true,complete:!r.required,message:r.required?'Step verified. Continue reconstructing.':'Guided reconstruction saved. A fresh unassisted question is next; this did not award mastery.'};
}
function masteryStatus(id){
 if(course()==='D772'&&id===PROBABILITY_ID&&probabilityState(false))return probabilityMastery();
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];
 if(!row)return {certified:false,reason:'No independently demonstrated skill evidence'};
 const independent=[...new Map((row.attempts||[]).filter(x=>x.correct&&!x.assisted).map((x,i)=>[x.questionKey||('legacy-'+i),x])).values()];
 const transfer=independent.some(x=>x.origin==='independent-transfer'&&x.verified===true);
 const teaching=row.teachBackAssessment?.evaluated===true&&row.teachBackAssessment?.passed===true;
 const recovery=row.misconceptionHistory||{};
 const repairs=Object.values(row.reconstructionBySkill||{});
 const blockedRepair=repairs.some(r=>r.required||r.awaitingTransfer);
 const certified=independent.length>=4&&transfer&&teaching&&!recovery.recoveryRequired&&!recovery.awaitingIndependentTransfer&&!blockedRepair;
 return {certified,independentCorrect:independent.length,transferVerified:transfer,teachBackVerified:teaching,recoveryRequired:!!recovery.recoveryRequired||repairs.some(r=>r.required),awaitingIndependentTransfer:!!recovery.awaitingIndependentTransfer||repairs.some(r=>r.awaitingTransfer),status:row.status};
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
 // Reconcile older saves before selecting a new dataset. A saved task may
 // predate seenDatasets; it must never be selected again after a reload.
 for(const saved of Object.values(st.tasks||{}))probabilitySeen(saved?.q);
 for(const receipt of st.evidence||[]){
  const match=/^connected-probability-(\\d+)$/.exec(String(receipt.id||''));
  if(match){const previous=window.MajickGeneratedPractice?.probabilityCase(Number(match[1]),receipt.kind==='transfer');if(previous)probabilitySeen(previous);}
 }
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
window.MajickLearningContinuity={version:'2.0-probability',identify,record,needs,recommend,learned,skillResult,masteryStatus,skillNeeds,skillReview,skillRetry,practiceSkill,practiceRecovery,practiceAnswer,reconstructionCheck,nextGuidedSequence,guidedQuestionAvailable,rememberGuidedQuestion,practiceReadiness,practiceReadinessList,diagnosePracticeMistake,probabilityState,probabilityNeed,probabilityTask,probabilityMastery,probabilityDraft,probabilityRemove,probabilityCheck,probabilityFresh,probabilityAdvanceReasoning};
})();