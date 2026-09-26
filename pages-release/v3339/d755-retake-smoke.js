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
assert(M.BANK.length===54,'D755 teacher-focus bank must contain 54 questions');
for(const n of [1,2,3])assert(M.BANK.filter(q=>q.section===n).length===18,'Section '+n+' must have 18 teacher-focus questions');
assert(new Set(M.BANK.map(q=>q.id)).size===54,'Question IDs must be unique');
assert(M.BANK.every(q=>Array.isArray(q.options)&&q.options.length===4&&q.options.includes(q.answer)),'Every question must have four choices and a valid answer');
assert(M.BANK.every(q=>q.style==='wgu-course-scenario'&&q.source==='d755-teacher-focus-2026-09-26'&&q.teacherFocus===true),'Teacher-focus question metadata missing');
assert(ctx.S.courses.D755.questionBank.length===54,'Teacher-focus D755 bank did not self-install');
assert(M.BANK.some(q=>/four most recent progress-monitoring points/.test(q.prompt)&&q.visual==='four-below'),'Four-point rule data question missing');
assert(M.BANK.some(q=>/Predictive validity/.test(q.answer)),'Predictive validity question missing');
assert(M.BANK.some(q=>/General Outcome Measurement/.test(q.answer)),'GOM question missing');
assert(M.BANK.some(q=>/PLAAFP/.test(q.prompt)||/PLAAFP/.test(q.why)),'PLAAFP question missing');
assert(M.BANK.some(q=>q.visual==='cbc'),'C-B-C measurable goal visual question missing');
assert(M.BANK.some(q=>/Universal screening\/concern/.test(q.answer)),'Student Journey sequencing question missing');
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

M.startExam('diagnostic');
st=M.state();
assert(st.diagnostic.ids.length===30,'Diagnostic must contain 30 questions');
const diagQs=st.diagnostic.ids.map(id=>M.BANK.find(q=>q.id===id));
for(const n of [1,2,3])assert(diagQs.filter(q=>q.section===n).length===10,'Diagnostic section '+n+' quota must be 10');

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

M.startExam('mock');
st=M.state();
assert(st.mock.ids.length===40,'Mock OA must contain 40 questions');
const mockQs=st.mock.ids.map(id=>M.BANK.find(q=>q.id===id));
assert(mockQs.filter(q=>q.section===1).length===14,'Mock Section 1 quota must be 14');
assert(mockQs.filter(q=>q.section===2).length===13,'Mock Section 2 quota must be 13');
assert(mockQs.filter(q=>q.section===3).length===13,'Mock Section 3 quota must be 13');

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
