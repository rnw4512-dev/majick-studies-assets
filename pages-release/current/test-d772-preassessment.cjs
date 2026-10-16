'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(process.argv[2]||'current-site');
const names=['d772-preassessment-source.js','d772-preassessment-deep-practice.js','d772-preassessment-review.js'];
const window={MajickRenderQueue:{register(){},schedule(){}},S:{progress:{D772:{}}}};
const context=vm.createContext({window,document:{addEventListener(){}},console});
for(const n of names)vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),context,{filename:n});
const items=window.MajickD772PreassessmentSource.items,practice=window.MajickD772PreassessmentReview.questions;
assert.equal(items.length,58,'all source items present');
assert.deepEqual(Array.from(items,q=>q.number),Array.from({length:58},(_,i)=>i+1));
const counts=items.reduce((acc,q)=>(acc[q.sourceStatus]=(acc[q.sourceStatus]||0)+1,acc),{});
assert.deepEqual({...counts},{correct:47,incorrect:2,unanswered:9});
for(const n of [9,49])assert.equal(items[n-1].sourceStatus,'incorrect');
for(let n=50;n<=58;n++)assert.equal(items[n-1].sourceStatus,'unanswered');
for(const q of items){
 assert.equal(q.choices.length,4,'source option count Q'+q.number);
 assert(q.correctIndex>=0&&q.correctIndex<4,'marked source correct index Q'+q.number);
 if(q.sourceStatus==='unanswered')assert.equal(q.chosenIndex,-1,'no answer was chosen Q'+q.number);
 if(q.mathOrImageGap)assert.notEqual(q.mathOrImageGap,null);
}
for(let n=53;n<=58;n++)assert(items[n-1].mathOrImageGap,'do not falsely certify incomplete math Q'+n);
assert.equal(practice.length,30,'targeted supplement count');
assert.equal(new Set(practice.map(q=>q.id)).size,30,'unique practice identifiers');
for(const q of practice){
 assert.equal(q.sourceLabel.includes('NOT OFFICIAL WGU'),true,q.id);
 assert(q.choices[q.correct],'valid answer for '+q.id);
 assert.equal(q.choices.length,4,'four WGU-aligned options '+q.id);
 assert.equal(new Set(q.choices).size,4,'distinct response options '+q.id);
 assert.equal(q.format,'single-best-answer');
 assert.equal(q.revision,2);
 assert(q.examLanguage?.meaning,'plain-English exam-language connection '+q.id);
 assert(q.prompt.includes('\n\n'),'scenario and task separated '+q.id);
 assert(q.why.length>20,'worked rationale for '+q.id);
}
assert.equal(window.S.progress.D772.answers,undefined,'no official answer history rewritten');
assert.equal(window.S.majickAccount,undefined,'no reward/global state created');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const n of names)assert(index.includes('./'+n),'the app loads '+n);
const game=fs.readFileSync(path.join(root,'game-realm.js'),'utf8');
assert(game.includes('MajickD772PreassessmentReview?.practiceQuestions'),'Game Realm uses the existing practice bank');
console.log('PASS D772 preassessment: 58 original source items, 47 correct, 2 incorrect, 9 unanswered, 30 separated four-option OA-style questions, safe app loading, intact learner and reward state');

const normalized=window.MajickD772PreassessmentReview.practiceQuestions();
assert.equal(normalized.length,30);
for(const q of normalized){assert.equal(q.answer,q.options[q.correct]);assert.equal(q.sourceName,q.sourceLabel)}
for(const n of [1,2,3])assert(normalized.some(q=>q.lessonId.startsWith('d772-s'+n+'-')));
for(const file of ['course-tutor.js','wgu-practice.js'])assert(fs.readFileSync(path.join(root,file),'utf8').includes('MajickD772PreassessmentReview?.'),'Shared wording intake '+file);
