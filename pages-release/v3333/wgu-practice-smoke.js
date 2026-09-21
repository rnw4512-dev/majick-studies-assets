const fs=require('fs');
const vm=require('vm');

function assert(cond,msg){if(!cond)throw new Error(msg)}
const root=process.cwd();
const qsrc=fs.readFileSync(root+'/pages-release/v3315/study-material/questionBuilder.js','utf8');
const wsrc=fs.readFileSync(root+'/pages-release/v3333/wgu-practice.js','utf8');

const ctx={
  console,
  Math,
  Date,
  setTimeout,
  clearTimeout,
  document:{documentElement:{dataset:{}}},
  S:{activeCourse:'D772',screen:'mission',courses:{D772:{questionBank:[]}},progress:{D772:{answers:[],mistakes:[]}}},
  session:null
};
ctx.render=()=>{};
ctx.navigate=screen=>{ctx.S.screen=screen};
ctx.startTest=()=>{throw new Error('legacy startTest should not be used for D772 OA')};
ctx.startMixed=()=> 'legacy-mixed';
ctx.sessionHTML=()=>'<div>legacy session</div>';
ctx.resultHTML=()=>'<div>legacy result</div>';
ctx.missionHTML=()=>'<div>legacy mission</div>';
ctx.nextQuestion=()=>{
  if(!ctx.session)return;
  const idx=(ctx.session.index||1);
  if(idx>=ctx.session.questions.length){ctx.session.finished=true;return}
  ctx.session.index=idx+1;
  ctx.session.current=ctx.session.questions[idx];
  ctx.session.answered=false;
  ctx.session.chosen=null;
  ctx.session.pendingChoice=null;
};
ctx.answerQ=choice=>{
  const q=ctx.session.current;
  ctx.session.chosen=choice;
  ctx.session.answered=true;
  ctx.session.review=ctx.session.review||[];
  ctx.session.review.push({q,chosen:choice,correct:choice===q.answer});
  if(choice===q.answer)ctx.session.score=(ctx.session.score||0)+1;
};
ctx.continueSession=()=>ctx.nextQuestion();
ctx.setConfidence=v=>{if(ctx.session)ctx.session.confidence=v};
ctx.saveReason=()=>{};
ctx.cleanPrompt=s=>String(s||'');
ctx.clueHTML=()=>'<div>clue</div>';
ctx.stats=()=>({});
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(qsrc,ctx,{filename:'questionBuilder.js'});
assert(ctx.MajickQuestionBuilder,'question builder missing');

const questions=ctx.MajickQuestionBuilder.d772Questions('smoke');
ctx.S.courses.D772.questionBank=[...questions];
assert(questions.length>=40,'D772 bank too small');
assert(questions.filter(q=>q.visual).length>=7,'visual question metadata missing');
assert(questions.every(q=>(q.options||[]).every(o=>q.choiceCoach&&typeof q.choiceCoach[o]==='string'&&q.choiceCoach[o].length>20)),'answer-choice coaching incomplete');

vm.runInContext(wsrc,ctx,{filename:'wgu-practice.js'});
assert(ctx.MajickWGUPractice?.VERSION==='3.3.33','WGU practice runtime version wrong');

const oa=ctx.MajickWGUPractice.balancedOA();
assert(oa.length===30,'OA must contain exactly 30 questions');
assert(new Set(oa.map(q=>q.id)).size===30,'OA questions must be unique');
assert(new Set(oa.map(q=>q.learningPathLessonId)).size===4,'OA must mix all four lessons');

ctx.MajickWGUPractice.startOA();
assert(ctx.session?.opts?.kind==='d772-section1-oa','OA session did not start');
assert(ctx.session.questions.length===30,'OA session count wrong');
let html=ctx.sessionHTML();
assert(/Section 1 OA Simulation/.test(html),'OA heading missing');
assert(/v3333Submit/.test(html),'select then Submit interaction missing');
assert(/No hints or lesson labels/.test(html),'OA no-hint notice missing');
assert(!/How sure are you\?|WGU clue to notice|Clue Charm/.test(html),'OA leaked practice support');

const visualQ=questions.find(q=>q.visual);
assert(visualQ,'no visual question found');
const visual=ctx.MajickWGUPractice.visualHtml(visualQ.visual);
assert(/<svg/.test(visual),'visual renderer did not produce SVG');

const practiceQ=questions.find(q=>(q.options||[]).length>=3);
ctx.session={type:'adaptive',opts:{label:'Adaptive Practice',limit:1,kind:'adaptive'},index:1,score:0,questions:[practiceQ],current:practiceQ,answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
ctx.MajickWGUPractice.select(practiceQ.answer);
assert(ctx.session.pendingChoice===practiceQ.answer,'choice selection did not persist');
ctx.MajickWGUPractice.submit();
assert(ctx.session.answered===true&&ctx.session.chosen===practiceQ.answer,'Submit did not grade selected answer');
html=ctx.sessionHTML();
assert(/Why each answer is right or wrong/.test(html),'answer-choice explanation panel missing');
assert(/Best answer:/.test(html),'post-submit best-answer feedback missing');

const two=oa.slice(0,2);
ctx.session={type:'test',opts:{label:'Section 1 OA Simulation',limit:2,hideMeta:true,kind:'d772-section1-oa'},index:2,score:1,questions:two,current:two[1],answered:false,confidence:'sure',review:[
  {q:two[0],chosen:two[0].answer,correct:true},
  {q:two[1],chosen:two[1].options.find(x=>x!==two[1].answer),correct:false}
],start:Date.now(),finished:true,pendingChoice:null};
const result=ctx.resultHTML();
assert(/Section 1 Practice Readiness by Lesson/.test(result),'lesson readiness missing');
assert(/Concepts to Review/.test(result),'concept review breakdown missing');
assert(/practice evidence, not a prediction/i.test(result),'readiness limitation missing');

assert(ctx.document.documentElement.dataset.majickWguPractice==='3.3.33','runtime dataset marker missing');
console.log('V3.3.33 WGU PRACTICE SMOKE PASSED');
console.log(JSON.stringify({questions:questions.length,visuals:questions.filter(q=>q.visual).length,oa:oa.length,lessons:new Set(oa.map(q=>q.learningPathLessonId)).size}));
