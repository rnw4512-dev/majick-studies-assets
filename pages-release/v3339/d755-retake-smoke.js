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
let st;
assert(M&&M.VERSION==='3.3.40','D755 runtime/version missing');
assert(ctx.document.documentElement.dataset.majickD755Retake==='3.3.40','dataset marker missing');
assert(M.SECTIONS.length===3,'D755 must contain exactly three sections');
assert(M.SECTIONS.reduce((n,s)=>n+s.concepts.length,0)===16,'D755 instructional concept count changed');
assert(M.BANK.length===90,'D755 teacher-focus bank must contain 90 questions');
assert(M.BANK.filter(q=>q.section===1).length===54,'Section 1 must include the expanded 36-question assessment-identification bank');
assert(M.BANK.filter(q=>q.section===2).length===18,'Section 2 must retain 18 teacher-focus questions');
assert(M.BANK.filter(q=>q.section===3).length===18,'Section 3 must retain 18 teacher-focus questions');
assert(new Set(M.BANK.map(q=>q.id)).size===90,'Question IDs must be unique');
assert(M.BANK.every(q=>Array.isArray(q.options)&&q.options.length===4&&q.options.includes(q.answer)),'Every question must have four choices and a valid answer');
assert(M.BANK.every(q=>q.style==='wgu-course-scenario'&&q.source==='d755-teacher-focus-2026-09-26'&&q.teacherFocus===true),'Teacher-focus question metadata missing');
assert(M.BANK.every(q=>q.topicId&&Number(q.difficulty)>=1&&q.format==='scenario'),'Game Realm question metadata missing');
const realmTopics=new Set(ctx.S.courses.D755.concepts.map(x=>x.id));
assert(M.BANK.every(q=>realmTopics.has(q.topicId)),'A D755 question points to a Game Realm topic that does not exist');
assert(Array.isArray(ctx.S.courses.D755.misconceptionCatalog)&&ctx.S.courses.D755.misconceptionCatalog.length>=8,'D755 Game Realm misconception catalog missing');
assert(ctx.S.courses.D755.questionBank.length===90,'Teacher-focus D755 bank did not self-install');
assert(M.BANK.some(q=>/four most recent progress-monitoring points/.test(q.prompt)&&q.visual==='four-below'),'Four-point rule data question missing');
assert(M.BANK.some(q=>/Predictive validity/.test(q.answer)),'Predictive validity question missing');
assert(M.BANK.some(q=>/General Outcome Measurement/.test(q.answer)),'GOM question missing');
assert(M.BANK.some(q=>/PLAAFP/.test(q.prompt)||/PLAAFP/.test(q.why)),'PLAAFP question missing');
assert(M.BANK.some(q=>q.visual==='cbc'),'C-B-C measurable goal visual question missing');
assert(M.BANK.some(q=>/Universal screening\/concern/.test(q.answer)),'Student Journey sequencing question missing');
const assessmentTypeQs=M.BANK.filter(q=>q.trap==='assessment-type');
assert(assessmentTypeQs.length===36,'Assessment-identification expansion must contain 36 focused questions');
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
const rotationProbe=assessmentTypeQs.slice(0,4);
M.rememberAssessmentQuestion(rotationProbe[0].id);
const rotated=M.freshAssessmentRows(rotationProbe);
assert(rotated.length===rotationProbe.length,'Assessment question rotation must preserve the full pool');
assert(rotated[0].id!==rotationProbe[0].id,'Recently used assessment question should move behind unseen questions');
assert(rotated.some(q=>q.id===rotationProbe[0].id),'Recently used assessment question must remain available as fallback');
st=M.state();
const purposeMistakes=assessmentTypeQs.filter(q=>M.assessmentFamily(q)==='Purpose').slice(0,2);
assert(purposeMistakes.length===2,'Mistake Queue breakdown test needs two Purpose questions');
purposeMistakes.forEach(q=>M.updateAssessmentMistake(q.id,false));
assert(purposeMistakes.every(q=>M.assessmentMistakeIds().includes(q.id)),'Wrong assessment answers should enter Mistake Repair Queue');
const mistakeSummary=M.assessmentMistakeSummary();
assert(mistakeSummary.Purpose===2,'Mistake Repair Queue should count misses by assessment dimension');
const smartPreview=M.smartReviewQuestions(10);
assert(smartPreview.length===10,'D755 Smart Review should contain 10 assessment questions');
assert(new Set(smartPreview.map(q=>q.id)).size===smartPreview.length,'D755 Smart Review should not duplicate questions inside a set');
assert(purposeMistakes.every(q=>smartPreview.some(x=>x.id===q.id)),'D755 Smart Review should include unresolved mistake-queue questions first');
const smartStartMistakes=M.assessmentMistakeIds().length;
M.startSmartReview();
st=M.state();
assert(st.mode==='assessmentDrill'&&st.assessmentDrill.smartReview===true,'D755 Smart Review should launch in assessment drill mode');
assert(Array.isArray(st.assessmentDrill.smartReviewStartMistakes),'Smart Review should capture its starting mistake queue');
while(M.state().assessmentDrill&&M.state().mode==='assessmentDrill'){
  const o=M.state().assessmentDrill;
  const item=M.BANK.find(q=>q.id===o.ids[o.index]);
  o.selected=item.answer;
  M.examSubmit('assessmentDrill');
  M.examNext('assessmentDrill');
}
st=M.state();
assert(st.mode==='assessmentDrillResult'&&st.assessmentDrillResult.smartReview===true,'Smart Review should finish with a Smart Review result');
assert(st.assessmentDrillResult.smartReviewSummary,'Smart Review repair summary missing from results');
assert(st.assessmentDrillResult.smartReviewSummary.startedMistakes===smartStartMistakes,'Smart Review starting mistake count incorrect');
assert(st.assessmentDrillResult.smartReviewSummary.remainingMistakes===M.assessmentMistakeIds().length,'Smart Review remaining mistake count incorrect');
assert(Array.isArray(st.assessmentDrillResult.smartReviewSummary.practicedFamilies),'Smart Review practiced-dimension summary missing');
assert(/SMART REVIEW • WHAT CHANGED/.test(M.smartReviewSummaryHTML(st.assessmentDrillResult)),'Smart Review repair snapshot HTML missing');
st.mode='home';
purposeMistakes.forEach(q=>M.updateAssessmentMistake(q.id,false));
const mistakeRec=M.assessmentNextPractice();
assert(mistakeRec.kind==='mistakes'&&mistakeRec.count>=2,'Recommended Next Practice should prioritize unresolved assessment mistakes');
assert(/Repair your missed assessment questions/.test(mistakeRec.title),'Mistake-priority recommendation title missing');
assert(/Purpose/.test(M.shell()),'Mistake Repair Queue should show its assessment-dimension breakdown');
M.startAssessmentMistakeRepair('Purpose');
st=M.state();
assert(st.mode==='assessmentDrill'&&st.assessmentDrill.mistakeRepair===true,'Mistake Repair Queue should launch in assessment drill mode');
assert(st.assessmentDrill.mistakeFamily==='Purpose','Dimension-filtered Mistake Repair should remember the chosen family');
assert(st.assessmentDrill.ids.length===2,'Purpose Mistake Repair should contain only queued Purpose questions');
assert(st.assessmentDrill.ids.every(id=>M.assessmentFamily(M.BANK.find(q=>q.id===id))==='Purpose'),'Dimension-filtered Mistake Repair should contain only the chosen assessment family');
while(M.state().assessmentDrill&&M.state().mode==='assessmentDrill'){
  const o=M.state().assessmentDrill;
  const repairItem=M.BANK.find(q=>q.id===o.ids[o.index]);
  o.selected=repairItem.answer;
  M.examSubmit('assessmentDrill');
  M.examNext('assessmentDrill');
}
assert(purposeMistakes.every(q=>!M.assessmentMistakeIds().includes(q.id)),'Correct retries should clear repaired Purpose questions from Mistake Repair Queue');
assert(M.assessmentNextPractice().kind!=='mistakes','Recommendation should leave Mistake Repair mode after the queue is cleared');
st=M.state();st.mode='home';
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_25'&&/parent interview/i.test(q.prompt)),'New qualitative parent-interview scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_26'&&/seconds/i.test(q.prompt)&&q.answer==='Quantitative data'),'New quantitative latency scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_28'&&/running record/i.test(q.prompt)&&q.answer==='Informal assessment'),'New informal running-record scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_29'&&/mini whiteboards/i.test(q.prompt)&&q.answer==='Formative assessment'),'New formative whiteboard scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_30'&&/portfolio/i.test(q.prompt)&&q.answer==='Summative assessment'),'New summative portfolio scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_31'&&/percentile rank/i.test(q.prompt)&&q.answer==='Norm-referenced'),'New norm-referenced percentile scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_32'&&/9 of 10/i.test(q.prompt)&&q.answer==='Criterion-referenced'),'New criterion-referenced mastery scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_33'&&/kindergarten/i.test(q.prompt)&&q.answer==='Universal screening'),'New kindergarten screening scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_34'&&/Tier 3/i.test(q.prompt)&&q.answer==='Progress monitoring'),'New Tier 3 progress-monitoring scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_35'&&/several classes/i.test(q.prompt)&&/Functional Behavior Assessment/.test(q.answer)),'New across-settings FBA scenario missing');
assert(M.BANK.some(q=>q.id==='d755_wgu_assess_id_36'&&/parent each complete/i.test(q.prompt)&&/rating scale/.test(q.answer)),'New multi-informant rating-scale scenario missing');
assert(M.teacherVisual({visual:'four-below'}).includes('<svg'),'Four-point visual renderer missing');
assert(M.teacherVisual({visual:'cbc'}).includes('MEASURABLE ANNUAL GOAL'),'C-B-C visual renderer missing');

const shell=ctx.MajickLearningLab.render();
assert(/data-d755-tab="d755retake"/.test(shell),'Retake Studio tab not injected');
assert(/data-panel="d755retake"/.test(shell),'Retake Studio panel not injected');

const xpBefore=ctx.S.progress.D755.xp;
st=M.state();
assert(st.mode==='home','D755 should enter Retake Studio at home');
assert(/TEACHER-FOCUS RETAKE STUDIO/.test(M.shell()),'Teacher-focus home label missing');
assert(/Retake Diagnostic/.test(M.shell())&&/30 mixed WGU-style scenarios/.test(M.shell()),'Retake Studio does not expose the 30-question diagnostic entry point');
assert(/Assessment Type Drill/.test(M.shell()),'Retake Studio does not expose the Assessment Type Drill entry point');
assert(/Smart 10-Question Review/.test(M.shell()),'Retake Studio does not expose Smart Review');
assert(/Assessment Dimension Detective/.test(M.shell()),'Retake Studio does not expose the Assessment Dimension Detective entry point');

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
st.assessmentTypeEvidence=st.assessmentTypeEvidence||{drill:{},detective:{}};
st.assessmentTypeEvidence.drill={
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

st=M.state();
st.dimensionDetective=null;
st.mode='dimensionDetective';
assert(/First identify what the stem is asking/.test(M.shell()),'Assessment Dimension Detective intro/teaching frame missing');
M.startDimensionDetective();
st=M.state();
assert(st.mode==='dimensionDetective','Assessment Dimension Detective did not start');
assert(st.dimensionDetective.ids.length===8,'Assessment Dimension Detective must contain 8 cases');
const detectiveQs=st.dimensionDetective.ids.map(id=>M.BANK.find(q=>q.id===id));
const detectiveFamilies=new Set(detectiveQs.map(q=>M.assessmentFamily(q)));
assert(detectiveFamilies.size>=6,'Assessment Dimension Detective should cover every major assessment dimension');
assert(/What is this stem asking you to classify/.test(M.shell()),'Assessment Dimension Detective first-case prompt missing');

for(let i=0;i<8;i++){
  const o=M.state().dimensionDetective;
  const q=M.BANK.find(x=>x.id===o.ids[o.index]);
  const fam=M.assessmentFamily(q);
  M.detectiveChooseDimension(fam);
  M.detectiveSubmitDimension();
  assert(o.dimensionSubmitted===true&&o.phase==='classification','Detective did not advance from dimension to classification');
  M.detectiveChooseAnswer(q.answer);
  M.detectiveSubmitAnswer();
  assert(o.answerSubmitted===true,'Detective classification did not submit');
  M.detectiveNext();
}
st=M.state();
assert(st.mode==='dimensionDetectiveResult','Assessment Dimension Detective did not reach result state');
assert(st.dimensionDetectiveResult.dimensionScore===8,'Detective dimension score incorrect');
assert(st.dimensionDetectiveResult.classificationScore===8,'Detective classification score incorrect');
assert(Object.keys(st.dimensionDetectiveResult.familyStats||{}).length>=6,'Detective family result breakdown missing');
assert(/dimension recognition/.test(M.shell())&&/assessment classification/.test(M.shell()),'Detective result comparison missing');
assert(/ASSESSMENT TYPE MASTERY LADDER/.test(M.shell()),'Assessment Type Mastery Ladder missing from Detective results');
const masteryRows=M.assessmentMasteryRows();
assert(masteryRows.length===6,'Assessment Type Mastery Ladder must contain all six dimensions');
assert(masteryRows.some(x=>x.possible>0),'Assessment Type Mastery Ladder should include accumulated evidence');
assert(masteryRows.every(x=>['Mastered','Developing','Needs practice','Not practiced'].includes(x.status)),'Assessment Type Mastery Ladder status invalid');
const nextPractice=M.assessmentNextPractice();
assert(['drill','detective','pairs','family','maintenance'].includes(nextPractice.kind),'D755 next-practice recommendation kind invalid');
st.mode='home';
assert(/RECOMMENDED NEXT PRACTICE/.test(M.shell()),'D755 Recommended Next Practice card missing from home');
const purposeBefore=Number(M.assessmentEvidence('drill').Purpose?.total||0);
M.startAssessmentFamilyPractice('Purpose');
st=M.state();
assert(st.mode==='assessmentDrill','Focused mastery practice should use Assessment Type Drill mode');
assert(st.assessmentDrill.focusedFamily==='Purpose','Focused mastery practice should remember its selected family');
const focusQs=st.assessmentDrill.ids.map(id=>M.BANK.find(q=>q.id===id));
assert(focusQs.length>0&&focusQs.every(q=>M.assessmentFamily(q)==='Purpose'),'Focused mastery practice should contain only the selected assessment family');
for(let i=0;i<focusQs.length;i++){
  const o=M.state().assessmentDrill;
  const q=M.BANK.find(x=>x.id===o.ids[o.index]);
  o.selected=q.answer;
  M.examSubmit('assessmentDrill');
  M.examNext('assessmentDrill');
}
const purposeAfter=Number(M.assessmentEvidence('drill').Purpose?.total||0);
assert(purposeAfter===purposeBefore+focusQs.length,'Focused practice should add to cumulative Purpose evidence instead of replacing it');
assert(Object.keys(M.assessmentEvidence('drill')).length>=4,'Cumulative drill evidence should preserve previously practiced assessment dimensions');
st=M.state();
st.mode='home';

const pairEvidenceBefore=Object.values(M.assessmentEvidence('pairs')).reduce((n,row)=>n+Number(row.total||0),0);
M.startContrastRepair();
st=M.state();
assert(st.mode==='contrastRepair','Confusing Pairs Repair did not start');
assert(st.contrastRepair.ids.length===12,'Confusing Pairs Repair should include 12 cases across six contrast pairs');
const repairQs=st.contrastRepair.ids.map(id=>M.BANK.find(q=>q.id===id));
assert(repairQs.every(q=>M.contrastPairFor(q)),'Confusing Pairs Repair should only use known contrast-pair questions');
const repairFamilies=new Set(repairQs.map(q=>M.contrastPairFamily(M.contrastPairFor(q).label)));
assert(repairFamilies.size===6,'Confusing Pairs Repair should cover all six mastery dimensions');
for(let i=0;i<repairQs.length;i++){
  const o=M.state().contrastRepair;
  const q=M.BANK.find(x=>x.id===o.ids[o.index]);
  M.contrastRepairSelect(q.answer);
  M.contrastRepairSubmit();
  assert(M.state().contrastRepair.submitted===true,'Confusing Pairs Repair answer did not submit');
  M.contrastRepairNext();
}
st=M.state();
assert(st.mode==='contrastRepairResult','Confusing Pairs Repair did not reach results');
const pairEvidenceAfter=Object.values(M.assessmentEvidence('pairs')).reduce((n,row)=>n+Number(row.total||0),0);
assert(pairEvidenceAfter===pairEvidenceBefore+12,'Confusing Pairs Repair should add 12 cumulative mastery evidence cases');
assert(Object.keys(M.assessmentEvidence('pairs')).length===6,'Confusing Pairs Repair mastery evidence should cover all six dimensions');
assert(/ASSESSMENT TYPE MASTERY LADDER/.test(M.shell()),'Confusing Pairs results should show the mastery ladder');
st.mode='home';

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
