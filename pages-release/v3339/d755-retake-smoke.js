const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3339/d755-retake.js','utf8');

const ctx={
 console,Date,Math,setTimeout(fn){fn();return 1},clearTimeout(){},
 S:{
   activeCourse:'D755',screen:'learninglab',
   courses:{D755:{id:'D755',title:'Assessment for Special Education',questionBank:[],concepts:[],glossary:{}}},
   progress:{D755:{xp:4987,crystals:200,chests:3,answers:[],mistakes:[]}}
 },
 save(){},
 document:{
   documentElement:{dataset:{}},
   querySelector(){return null},
   querySelectorAll(){return []},
   getElementById(){return null}
 },
 MajickLearningLab:{
   render(){return '<section class="learnLab"><nav class="learnTabs" aria-label="Learning Lab"></nav><div class="learnPanels"></div></section>'},
   bind(){}
 }
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'d755-retake.js'});

const M=ctx.MajickD755Retake;
assert(M&&M.VERSION==='3.3.40','D755 runtime/version missing');
assert(ctx.document.documentElement.dataset.majickD755Retake==='3.3.40','dataset marker missing');
assert(M.SECTIONS.length===3,'D755 must contain exactly three sections');
assert(M.SECTIONS.reduce((n,s)=>n+s.concepts.length,0)===16,'D755 instructional concept count changed');
assert(M.BANK.length===78,'D755 teacher-focus bank must contain 78 questions');
assert(M.BANK.filter(q=>q.section===1).length===42,'Section 1 must include the expanded assessment-identification bank');
assert(M.BANK.filter(q=>q.section===2).length===18,'Section 2 must retain 18 teacher-focus questions');
assert(M.BANK.filter(q=>q.section===3).length===18,'Section 3 must retain 18 teacher-focus questions');
assert(new Set(M.BANK.map(q=>q.id)).size===78,'Question IDs must be unique');
assert(M.BANK.every(q=>Array.isArray(q.options)&&q.options.length===4&&q.options.includes(q.answer)),'Every question must have four choices and a valid answer');
assert(M.BANK.every(q=>q.style==='wgu-course-scenario'&&q.source==='d755-teacher-focus-2026-09-26'&&q.teacherFocus===true),'Teacher-focus question metadata missing');
assert(M.BANK.every(q=>q.topicId&&Number(q.difficulty)>=1&&q.format==='scenario'),'Game Realm question metadata missing');
const realmTopics=new Set(ctx.S.courses.D755.concepts.map(x=>x.id));
assert(M.BANK.every(q=>realmTopics.has(q.topicId)),'A D755 question points to a Game Realm topic that does not exist');
assert(Array.isArray(ctx.S.courses.D755.misconceptionCatalog)&&ctx.S.courses.D755.misconceptionCatalog.length>=8,'D755 Game Realm misconception catalog missing');
assert(ctx.S.courses.D755.questionBank.length===78,'Teacher-focus D755 bank did not self-install');
assert(M.BANK.some(q=>/four most recent progress-monitoring points/.test(q.prompt)&&q.visual==='four-below'),'Four-point rule data question missing');
assert(M.BANK.some(q=>/Predictive validity/.test(q.answer)),'Predictive validity question missing');
assert(M.BANK.some(q=>/General Outcome Measurement/.test(q.answer)),'GOM question missing');
assert(M.BANK.some(q=>/PLAAFP/.test(q.prompt)||/PLAAFP/.test(q.why)),'PLAAFP question missing');
assert(M.BANK.some(q=>q.visual==='cbc'),'C-B-C measurable goal visual question missing');
assert(M.BANK.some(q=>/Universal screening\/concern/.test(q.answer)),'Student Journey sequencing question missing');
const assessmentTypeQs=M.BANK.filter(q=>q.trap==='assessment-type');
assert(assessmentTypeQs.length===24,'Assessment-identification expansion must contain 24 focused questions');
assert(assessmentTypeQs.some(q=>q.answer==='Qualitative data'),'Qualitative assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Quantitative data'),'Quantitative assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Formal assessment'),'Formal assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Informal assessment'),'Informal assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Formative assessment'),'Formative assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Summative assessment'),'Summative assessment identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Norm-referenced'),'Norm-referenced identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Criterion-referenced'),'Criterion-referenced identification question missing');
assert(assessmentTypeQs.some(q=>/Curriculum-Based Measurement/.test(q.answer)),'CBM identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Universal screening'),'Universal screening identification question missing');
assert(assessmentTypeQs.some(q=>q.answer==='Progress monitoring'),'Progress-monitoring identification question missing');
assert(assessmentTypeQs.some(q=>/Functional Behavior Assessment/.test(q.answer)),'FBA identification question missing');
assert(M.teacherVisual({visual:'four-below'}).includes('<svg'),'Four-point visual renderer missing');
assert(M.teacherVisual({visual:'cbc'}).includes('MEASURABLE ANNUAL GOAL'),'C-B-C visual renderer missing');

const shell=ctx.MajickLearningLab.render();
assert(/data-d755-tab="d755retake"/.test(shell),'Retake Studio tab not injected');
assert(/data-panel="d755retake"/.test(shell),'Retake Studio panel not injected');

const xpBefore=ctx.S.progress.D755.xp;
let st=M.state();
assert(st.mode==='home','D755 should enter Retake Studio at home');
assert(/TEACHER-FOCUS RETAKE STUDIO/.test(M.shell()),'Teacher-focus home label missing');
assert(/Retake Diagnostic/.test(M.shell())&&/30 mixed WGU-style scenarios/.test(M.shell()),'Retake Studio does not expose the 30-question diagnostic entry point');
assert(/Assessment Type Drill/.test(M.shell()),'Retake Studio does not expose the Assessment Type Drill entry point');

M.startExam('diagnostic');
st=M.state();
assert(st.diagnostic.ids.length===30,'Diagnostic must contain 30 questions');
const diagQs=st.diagnostic.ids.map(id=>M.BANK.find(q=>q.id===id));
for(const n of [1,2,3])assert(diagQs.filter(q=>q.section===n).length===10,'Diagnostic section '+n+' quota must be 10');
assert(diagQs.filter(q=>q.trap==='assessment-type').length>=6,'Diagnostic should regularly include focused assessment-type questions');

for(let i=0;i<30;i++){
  const o=M.state().diagnostic;
  const q=M.BANK.find(x=>x.id===o.ids[o.index]);
  o.selected=q.answer;
  M.examSubmit('diagnostic');
  M.examNext('diagnostic');
}
st=M.state();
assert(st.mode==='diagnosticResult','Diagnostic did not reach result state');
assert(st.diagnosticResult.score===30&&st.diagnosticResult.total===30,'Perfect diagnostic score incorrect');
assert(st.diagnosticResult.bySection.every(x=>x.pct===100),'Diagnostic section breakdown incorrect');

M.startExam('assessmentDrill');
st=M.state();
assert(st.assessmentDrill.ids.length===12,'Assessment Type Drill must contain 12 questions');
const drillQs=st.assessmentDrill.ids.map(id=>M.BANK.find(q=>q.id===id));
assert(drillQs.every(q=>q.trap==='assessment-type'),'Assessment Type Drill must contain only focused assessment-identification questions');
assert(/ASSESSMENT TYPE DRILL/.test(M.shell()),'Assessment Type Drill screen label missing');
assert(/ASSESSMENT TYPE ANCHOR CHART/.test(M.shell()),'Assessment Type Anchor Chart missing from drill');
assert(/WGU decision rule/.test(M.shell()),'Assessment Type Drill decision rule missing');
for(let i=0;i<12;i++){
  const o=M.state().assessmentDrill;
  const q=M.BANK.find(x=>x.id===o.ids[o.index]);
  o.selected=q.answer;
  M.examSubmit('assessmentDrill');
  if(i===0){
    assert(/THIS STEM IS ASKING ABOUT/.test(M.shell()),'Assessment Type Drill classification lens missing after submission');
    assert(/d755ClassificationLens/.test(M.shell()),'Assessment Type Drill classification lens markup missing');
    assert(/Why not the tempting opposite\?/.test(M.shell()),'Assessment Type Drill contrast explanation missing');
  }
  M.examNext('assessmentDrill');
}
st=M.state();
assert(st.mode==='assessmentDrillResult','Assessment Type Drill did not reach result state');
assert(st.assessmentDrillResult.score===12&&st.assessmentDrillResult.total===12,'Assessment Type Drill score/result incorrect');
assert(Object.keys(st.assessmentDrillResult.familyStats||{}).length>=3,'Assessment Type Drill category breakdown missing');
st.assessmentDrillResult.familyStats={
  'Purpose':{correct:0,total:3},
  'Administration':{correct:1,total:3},
  'Data type':{correct:3,total:3},
  'Assessment tools':{correct:3,total:3}
};
M.startExam('assessmentDrill');
const adaptiveQs=M.state().assessmentDrill.ids.map(id=>M.BANK.find(q=>q.id===id));
const adaptiveFocusCount=adaptiveQs.filter(q=>/assessment purpose|formal informal/.test(String(q.concept))).length;
assert(adaptiveFocusCount>=6,'Adaptive Assessment Type Drill should target the two weakest categories');
M.state().assessmentDrill=null;
M.state().mode='home';

M.startExam('mock');
st=M.state();
assert(st.mock.ids.length===40,'Mock OA must contain 40 questions');
const mockQs=st.mock.ids.map(id=>M.BANK.find(q=>q.id===id));
assert(mockQs.filter(q=>q.section===1).length===14,'Mock Section 1 quota must be 14');
assert(mockQs.filter(q=>q.section===2).length===13,'Mock Section 2 quota must be 13');
assert(mockQs.filter(q=>q.section===3).length===13,'Mock Section 3 quota must be 13');
assert(mockQs.filter(q=>q.trap==='assessment-type').length>=8,'Mock OA should regularly include focused assessment-type questions');

st.mode='learn';st.sectionId='d755-s1';st.conceptIndex=0;st.phase=1;
const html=M.shell();
assert(/ARCANE ANCHOR CHART/.test(html),'Anchor chart missing from learning cycle');
assert(/MAJICK TUTOR/.test(html),'Persistent tutor missing from learning cycle');

M.startSectionCheck();
st=M.state();
assert(st.sectionCheck.ids.length===8,'Section mastery check must contain 8 questions');

assert(ctx.S.progress.D755.xp===xpBefore,'D755 academic work changed lifetime XP');
console.log('V3.3.40 D755 TEACHER-FOCUS SMOKE PASSED');
console.log(JSON.stringify({
 version:M.VERSION,
 sections:M.SECTIONS.length,
 concepts:M.SECTIONS.reduce((n,s)=>n+s.concepts.length,0),
 bank:M.BANK.length,
 diagnostic:30,
 mock:40,
 sectionCheck:8,
 xp:ctx.S.progress.D755.xp
}));
