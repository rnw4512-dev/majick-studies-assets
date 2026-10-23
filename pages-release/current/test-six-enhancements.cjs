'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync('current-site/'+f,'utf8');
const ctx={console,setTimeout:()=>0,clearTimeout(){},document:{createElement:()=>({}),head:{append(){}},addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},save(){}};ctx.window=ctx;ctx.S={activeCourse:'D772',progress:{D772:{},D756:{sentinel:42}},majickAccount:{xp:1234,crystals:56},legacy:{pets:[{id:'p',type:'luna'}],eggs:[{id:'e'}]}};vm.createContext(ctx);
for(const f of ['learning-continuity.js','solution-engine.js','visual-evidence-gate.js','d772-shared-oa-questions.js','d772-preassessment-deep-practice.js'])vm.runInContext(read(f),ctx);
const C=ctx.MajickLearningContinuity,bank=ctx.MajickD772SharedQuestions.practiceQuestions();assert.equal(bank.length,60);assert.equal([1,2,3].reduce((n,s)=>n+ctx.MajickD772SharedQuestions.forSection(s).length,0),60);
const trio=bank.filter(q=>q.skill==='weighted-mean');const unrelated=JSON.stringify({account:ctx.S.majickAccount,legacy:ctx.S.legacy,other:ctx.S.progress.D756});
let r=C.practiceAnswer(trio[0],false);assert.equal(r.required,true);r=C.practiceAnswer(trio[1],false);assert(r.required);C.practiceAnswer(trio[1],false);assert.equal(r.misses,2,'replayed miss is not new evidence');
assert(!C.reconstructionCheck(trio[1],['wrong']).ok);assert.equal(r.stage,0);
for(let i=0;i<ctx.MajickSolutionEngine.reconstructionPlan(trio[1]).length;i++){
 const step=ctx.MajickSolutionEngine.reconstructionPlan(trio[1])[i];const result=C.reconstructionCheck(trio[1],step.regions?step.regions.map(region=>region.selected):step.fields?step.fields.map(f=>String(f.value)):[step.answer]);assert(result.ok);if(i===1){ctx.S=JSON.parse(JSON.stringify(ctx.S));r=C.practiceRecovery(trio[1]);assert.equal(r.stage,2,'reconstruction survives reload')}
}
r=C.practiceRecovery(trio[1]);assert(!r.required&&r.awaitingTransfer);assert.equal(ctx.S.progress.D772.adaptiveSkills[trio[1].lessonId].masteryCertified,false);C.practiceAnswer(trio[0],true);assert(r.awaitingTransfer,'old failed question cannot clear transfer');C.practiceAnswer(trio[2],true);assert(!r.awaitingTransfer);assert.equal(r.transferId,trio[2].id);
assert.equal(JSON.stringify({account:ctx.S.majickAccount,legacy:ctx.S.legacy,other:ctx.S.progress.D756}),unrelated);
ctx.S.activeCourse='D756';assert.equal(C.practiceRecovery(trio[0]),null);ctx.S.activeCourse='D772';
const room=read('room-section-nav.js');vm.runInContext(room.slice(room.indexOf('function examProgress'),room.indexOf('function renderMixedExam')),ctx);
let nonCyclic=false;for(let n=0;n<20;n++){const deck=ctx.examDeck();assert.equal(deck.length,60);assert.equal(new Set(deck.map(q=>q.id)).size,60);if(deck.some((q,i)=>i&&q.examSection===deck[i-1].examSection))nonCyclic=true}assert(nonCyclic,'mixing must not enforce a 1-2-3 cycle');
const embedded=read('embedded-practice.js');vm.runInContext(embedded.slice(embedded.indexOf('function questions(){'),embedded.indexOf('function selectActivity')),ctx);const pool=ctx.questions();for(const q of bank.filter(q=>q.visual||q.visualHtml)){const found=pool.find(x=>x.id===q.id);assert(found,'shared intake missing '+q.id);assert.equal(found.revision,q.revision);assert.equal(JSON.stringify(found.visual||found.visualHtml),JSON.stringify(q.visual||q.visualHtml));assert.equal(found.sourceLabel,q.sourceLabel)}
const solution=read('solution-engine.js');vm.runInContext(solution.slice(solution.indexOf('const BANK='),solution.indexOf('const STATES='))+';globalThis.tasks=BANK.D772',ctx);const weighted=ctx.tasks.find(t=>t.id==='weighted-mean');assert.equal(weighted.cases.length,3);for(const c of weighted.cases)assert.equal((c.slots[0]+c.slots[1])/c.slots[2],c.answer);for(const c of ctx.tasks.find(t=>t.id==='histogram').cases.filter(c=>c.rawData)){const counts=c.labels.map(l=>{const [a,b]=l.match(/\d+/g).map(Number);return c.rawData.filter(x=>x>=a&&x<=b).length});assert.equal(JSON.stringify(counts),JSON.stringify(c.freq));assert.equal(c.freq.reduce((a,b)=>a+b),c.total)}
assert(ctx.probabilityTree({slots:[5,8,4,7]}).includes('After green: green 4/7 or other 3/7'));
// Ledger replay must never trigger a second animation or alter currencies again.
const rewards=read('reward-core.js');let effects=0;const account={xp:100,crystals:5,chests:0,rewardCore:{ledger:{},stats:{},masteryXp:0,eggFragments:0}};
const rewardCtx={account:()=>account,rewardKey:(_t,c)=>c.key,baseFor:()=>({xp:45,crystals:6}),treasureDrop:()=>null,save(){},pushRewardState(){},showReceipt(){},window:{MajickAnimationEffects:{play:()=>effects++}}};vm.createContext(rewardCtx);vm.runInContext(rewards.slice(rewards.indexOf('function award('),rewards.indexOf('function receiptLines')),rewardCtx);rewardCtx.award('lesson-mastered',{key:'D772:lesson:1'});const saved=JSON.stringify(account);rewardCtx.award('lesson-mastered',{key:'D772:lesson:1'});assert.equal(effects,1);assert.equal(JSON.stringify(account),saved);
const html=read('index.html');const activeRoster=html.slice(html.indexOf('lfDetailedRoster=function(){'),html.indexOf('masDetailedRoster=lfDetailedRoster;',html.indexOf('lfDetailedRoster=function(){')));assert(activeRoster.includes('<details class="majGuardianDetails">'));const compat=read('study-ui-compat.js');assert(compat.includes('filter(type=>!pets.some(p=>p.type===type))'));assert(compat.includes('Personality and evolution'));assert(html.includes('<details class="majGuardianDetails"><summary>Personality, progress and wardrobe</summary>'));assert(html.includes('V336_EVOLUTION_FAMILIARS.filter(f=>!v336PetForType(f.id))'));assert(!html.includes('html.replace(marker,`<h3 class="lfSubhead">Future Academy Familiars'));
console.log('PASS first-miss two-example recovery, save/reload, fresh-only transfer, no mastery/XP leakage, shared visual revisions, full-pool mixing, hands-on math/data, compact existing cards and ledger replay-safe celebrations');
// New plans cover every eligible skill and every required value is present in its dropdown.
vm.runInContext(solution.slice(solution.indexOf('function reconstructionNumbers('),solution.indexOf('function mountReconstruction(')),ctx);
for(const q of bank){
 ctx.S.progress.D772.adaptiveSkills={};const repair=C.practiceAnswer(q,false);assert(repair.required,'first miss must open practice');
 const plan=ctx.MajickSolutionEngine.reconstructionPlan(q);assert(plan.length>=6);assert(plan[0].text!==q.prompt);assert(plan.some(s=>s.title.startsWith('Hands-on practice')));
 assert(!C.reconstructionCheck(q,[]).ok,'missing values cannot become zero');
 for(const [stage,step] of plan.entries()){if(step.fields)for(const f of step.fields){assert(Number.isFinite(f.value));assert(ctx.reconstructionNumbers(plan,stage).includes(f.value),q.id+' missing formula option '+f.label)}const result=C.reconstructionCheck(q,step.regions?step.regions.map(region=>region.selected):step.fields?step.fields.map(f=>String(f.value)):[step.answer]);assert(result.ok,q.id+' '+step.title)}
 assert(repair.awaitingTransfer&&!repair.required);assert.equal(repair.misses,1,'guided corrections cannot add independent misses');
}
ctx.S.progress.D772.adaptiveSkills={};const legacy=C.practiceRecovery(trio[0]);Object.assign(legacy,{required:true,stage:2,verified:[0,1]});assert.equal(ctx.MajickSolutionEngine.reconstructionPlan(trio[0]).length,5,'paused legacy plan retains its stages');
console.log('PASS all 60 first-miss plans, separate hands-on evidence, finite formula values, blank rejection and legacy recovery migration');

// Freshness is based on new evidence, with deterministic snapshots surviving reload.
vm.runInContext(solution.slice(solution.indexOf('function workshopCases('),solution.indexOf('function newWorkshopState(')),ctx);
for(const task of ctx.tasks.filter(t=>['mean','median','probability','weighted-mean','histogram'].includes(t.id))){
 const seen=new Set();for(let sequence=1;sequence<=60;sequence++)for(const c of ctx.workshopCases(task,sequence)){
  const signature=JSON.stringify(c.numbers||c.rawData||c.slots);assert(!seen.has(signature),task.id+' repeated native evidence');seen.add(signature);
  if(task.id==='mean')assert.equal(c.answer,c.numbers.reduce((a,b)=>a+b,0)/c.numbers.length);
  if(task.id==='median')assert.equal(c.answer,(c.numbers[2]+c.numbers[3])/2);
  if(task.id==='probability')assert.equal(c.answer,c.slots[0]/c.slots[1]*c.slots[2]/c.slots[3]);
  if(task.id==='weighted-mean')assert.equal(c.answer,(c.slots[0]+c.slots[1])/c.slots[2]);
  if(task.id==='histogram'){assert.equal(c.total,c.freq.reduce((a,b)=>a+b,0));assert.equal(c.rawData.length,c.total);for(let i=0;i<c.labels.length;i++){const [lo,hi]=c.labels[i].match(/\d+/g).map(Number);assert.equal(c.rawData.filter(n=>n>=lo&&n<=hi).length,c.freq[i])}}
 }
}
const seenRepairs=new Map(),modelTypes=new Set(),individualExamples=new Set();
for(let cycle=0;cycle<8;cycle++)for(const original of bank){
 const q={...original,id:original.id+'-fresh-test-'+cycle};const r=C.practiceAnswer(q,false,false,'wrong');const plan=ctx.MajickSolutionEngine.reconstructionPlan(q);assert(plan.length>=6);
 const signature=JSON.stringify(plan.map(step=>step.text));const key=q.skill||C.practiceSkill(q),seen=seenRepairs.get(key)||new Set();assert(!seen.has(signature),'Repeated guided evidence for '+key);seen.add(signature);seenRepairs.set(key,seen);
 const snapshot=JSON.stringify(plan);ctx.S=JSON.parse(JSON.stringify(ctx.S));assert.equal(JSON.stringify(ctx.MajickSolutionEngine.reconstructionPlan(q)),snapshot,'plan changed after reload');
 for(const step of plan){if(step.title.includes('Which formula fits?')){const example=step.text;assert(!individualExamples.has(example),'An individual guided or hands-on example repeated');individualExamples.add(example)}if(step.model)modelTypes.add(step.model.type);if(step.title.includes('Which formula fits?')){assert(step.choices.includes(step.answer));assert(step.justification);for(const wrong of step.choices.filter(c=>c!==step.answer))assert(step.explanations[wrong],'missing formula-specific rationale')}}
}
assert.deepEqual([...modelTypes].sort(),['boxplot','histogram','tree','venn']);
const complement=bank.find(q=>q.skill==='complement-multistage'),d=complement.data;assert.equal(C.diagnosePracticeMistake(complement,String(d.trials*d.rate*(1-d.rate)**(d.trials-1))).code,'exactly-one-for-at-least-one');
const conditional=bank.find(q=>q.skill==='conditional-denominator');assert.equal(C.diagnosePracticeMistake(conditional,'wrong').code,'conditional-denominator');
ctx.S.progress.D772.adaptiveSkills={};const readinessQ={...trio[0],id:'readiness-miss'};let readinessR=C.practiceAnswer(readinessQ,false);assert.equal(C.practiceReadiness(readinessQ).label,'Needs guidance');
for(const step of ctx.MajickSolutionEngine.reconstructionPlan(readinessQ)){const values=step.regions?step.regions.map(r=>r.selected):step.fields?step.fields.map(f=>String(f.value)):[step.answer];assert(C.reconstructionCheck(readinessQ,values).ok)}
assert.equal(C.practiceReadiness(readinessQ).label,'Practicing independently');assert(readinessR.solvedSteps.some(step=>step.entries.some(entry=>entry.includes('Why:'))),'verified rationale missing from trail');
C.practiceAnswer({...trio[1],id:'readiness-first'},true);assert.equal(C.practiceReadiness(readinessQ).label,'Practicing independently');C.practiceAnswer({...trio[2],id:'readiness-second'},true);assert.equal(C.practiceReadiness(readinessQ).label,'Demonstrated independently');assert.equal(C.practiceReadiness(readinessQ).certified,false);
assert.equal(JSON.stringify({account:ctx.S.majickAccount,legacy:ctx.S.legacy,other:ctx.S.progress.D756}),unrelated);
const ownerBefore=JSON.stringify(ctx.S.progress.D772);ctx.S.activeCourse='D756';C.nextGuidedSequence('test-only');assert.equal(JSON.stringify(ctx.S.progress.D772),ownerBefore);ctx.S.activeCourse='D772';
console.log('PASS 480 fresh repair snapshots, 900 native datasets, formula rationales, four construction models, targeted diagnoses, calculation trails and two-item readiness without mastery/currency leakage');

// The same academic owner reserves guided evidence across sessions without inventing fresh IDs.
const historyQ={prompt:'One fixed scenario',data:[1,2,3]};assert(C.guidedQuestionAvailable(historyQ));C.rememberGuidedQuestion(historyQ);assert(!C.guidedQuestionAvailable({...historyQ,id:'different-id'}));assert(C.guidedQuestionAvailable({...historyQ,data:[2,3,4]}));
ctx.esc=String;vm.runInContext(solution.slice(solution.indexOf('function reconstructionVisual('),solution.indexOf('function mountReconstruction(')),ctx);
for(const q of bank){C.practiceAnswer({...q,id:q.id+'-visual-audit'},false);for(const step of ctx.MajickSolutionEngine.reconstructionPlan(q).filter(s=>s.model))for(const values of [[],step.regions?step.regions.map(r=>r.selected):step.fields.map(f=>String(f.value))]){const html=ctx.reconstructionVisual(step,values);assert(html.includes('<svg'));assert(!/NaN|undefined/.test(html),'invalid live visual geometry')}}
vm.runInContext(read('generated-question-engine.js'),ctx);
for(const skill of ['mean','median','boxplot','histogram','scatterplot','probability']){
 let generator=ctx.MajickGeneratedPractice;const datasets=new Set();for(let n=0;n<100;n++){if(n===50){ctx.S=JSON.parse(JSON.stringify(ctx.S));const freshRuntime={window:{S:ctx.S,MajickLearningContinuity:C},Math,Date,Array,Object,Number,String,JSON,Set};vm.runInNewContext(read('generated-question-engine.js'),freshRuntime);generator=freshRuntime.window.MajickGeneratedPractice}const q=generator.generate(skill,3);assert(generator.validate(q));const signature=JSON.stringify(q.data);assert(!datasets.has(signature),'generated data repeats across reload for '+skill);datasets.add(signature)}
}
// A native workbench retains its exact scenario and draft, then reserves a new set on restart.
vm.runInContext(solution.slice(solution.indexOf('function newWorkshopState('),solution.indexOf('const STATES=')),ctx);ctx.STATES=new WeakMap();ctx.ACTIVE_STATES=new Map();vm.runInContext(solution.slice(solution.indexOf('function setup('),solution.indexOf('function render(')),ctx);
const meanTask=ctx.tasks.find(t=>t.id==='mean'),host={dataset:{}};ctx.setup(host,meanTask);let native=ctx.STATES.get(host);native.answers.slot0='123';ctx.saveWorkshopState(meanTask,native);const savedCases=JSON.stringify(native.sessionCases);ctx.S=JSON.parse(JSON.stringify(ctx.S));ctx.STATES=new WeakMap();ctx.ACTIVE_STATES=new Map();const reloaded={dataset:{}};ctx.setup(reloaded,meanTask);assert.equal(ctx.STATES.get(reloaded).answers.slot0,'123');assert.equal(JSON.stringify(ctx.STATES.get(reloaded).sessionCases),savedCases);assert.notEqual(JSON.stringify(ctx.newWorkshopState(meanTask,native).sessionCases),savedCases);
assert.equal(JSON.stringify({account:ctx.S.majickAccount,legacy:ctx.S.legacy,other:ctx.S.progress.D756.sentinel}),JSON.stringify({account:JSON.parse(unrelated).account,legacy:JSON.parse(unrelated).legacy,other:42}));
console.log('PASS six generators: 600 nonrepeating datasets across reload, native scenario/draft persistence, cross-room guided evidence and all four visual models with empty/correct selections');
// Finite sources must stop instead of wrapping, and Tutor's unanswered snapshot must resume.
const finiteTask={id:'finite-test',cases:[{prompt:'Scenario A'},{prompt:'Scenario B'}]};const finite=ctx.newWorkshopState(finiteTask);assert.equal(finite.sessionCases.length,2);assert(ctx.newWorkshopState(finiteTask,finite).exhausted);
const tutorSource=read('course-tutor.js');const tutorRows=[{prompt:'Unused tutor A',choices:['a','b'],answer:'a',why:'Reason A'},{prompt:'Unused tutor B',choices:['c','d'],answer:'d',why:'Reason B'}];ctx.prog=id=>ctx.S.progress[id];ctx.cid=()=>ctx.S.activeCourse;ctx.helpFor=()=>null;ctx.adaptiveCheck=()=>null;ctx.questionsForLesson=()=>tutorRows;ctx.save=()=>{};vm.runInContext(tutorSource.slice(tutorSource.indexOf('function tutorGuidedQuestion('),tutorSource.indexOf('function quickQuizHtml(')),ctx);
const tutorLesson={id:'d772-s1-l1'};let tq=ctx.tutorGuidedQuestion(tutorLesson,'D772');assert(tq);assert.equal(ctx.tutorGuidedQuestion(tutorLesson,'D772'),tq);C.rememberGuidedQuestion(tq);ctx.S.progress.D772.tutorGuidedQuestions[tutorLesson.id].answered=true;let tq2=ctx.tutorGuidedQuestion(tutorLesson,'D772');assert.notEqual(tq2.prompt,tq.prompt);C.rememberGuidedQuestion(tq2);ctx.S.progress.D772.tutorGuidedQuestions[tutorLesson.id].answered=true;assert.equal(ctx.tutorGuidedQuestion(tutorLesson,'D772'),null);
console.log('PASS finite-source exhaustion and Tutor snapshot/unused-question selection without rewriting source records');

const otherHistory=JSON.stringify(ctx.S.progress.D756);ctx.S.activeCourse='D756';assert(!C.guidedQuestionAvailable({courseId:'D772',prompt:'Other course'}));C.rememberGuidedQuestion({courseId:'D772',prompt:'Other course'});assert.equal(JSON.stringify(ctx.S.progress.D756),otherHistory);assert.equal(ctx.tutorGuidedQuestion(tutorLesson,'D772'),null);ctx.S.activeCourse='D772';console.log('PASS stale guided callbacks cannot write another course’s history');
