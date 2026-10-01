(()=>{
'use strict';
const VERSION='3.3.36';
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const LESSON_NAMES={
  'd772-s1-l1':'Lesson 1 — Understanding Data Collection Methods',
  'd772-s1-l2':'Lesson 2 — Recognizing Bias in Data Collection',
  'd772-s1-l3':'Lesson 3 — Unveiling Data Misrepresentations',
  'd772-s1-l4':'Lesson 4 — Conclusions About Data Findings'
};
function activeD772(){return window.S?.activeCourse==='D772'}
function isD772Question(q){return !!q&&String(q.id||'').startsWith('d772_wgu_')}
function shuffleCopy(arr){
  const a=[...(arr||[])];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function circles(points){
  return points.map(([x,y,r=4])=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" />').join('');
}
function scatterSvg(kind){
  let pts=[];
  if(kind==='positive')pts=[[26,118],[42,110],[57,103],[73,96],[88,86],[105,80],[120,70],[136,63],[151,54],[166,47],[181,39]];
  else if(kind==='negative')pts=[[27,38],[43,45],[59,53],[75,61],[91,70],[107,78],[123,86],[139,96],[156,104],[173,113],[188,119]];
  else if(kind==='strong-positive')pts=[[27,116],[43,108],[59,101],[75,92],[91,84],[107,76],[123,68],[139,59],[155,51],[171,43],[187,35]];
  else if(kind==='nonlinear')pts=[[25,42],[42,61],[59,78],[76,92],[93,103],[110,108],[127,104],[144,93],[161,75],[178,52],[190,35]];
  else if(kind==='outlier')pts=[[26,116],[43,108],[59,99],[76,92],[93,83],[110,75],[127,66],[144,58],[161,49],[178,41],[155,116,5]];
  return '<svg viewBox="0 0 220 150" role="img" aria-label="Scatterplot"><line x1="20" y1="130" x2="205" y2="130"/><line x1="20" y1="15" x2="20" y2="130"/><g class="v3333Dots">'+circles(pts)+'</g></svg>';
}
function visualHtml(v){
  if(!v)return '';
  if(v.type==='scatter')return '<figure class="v3333Visual"><div class="v3333VisualLabel">Scatterplot</div>'+scatterSvg(v.pattern)+'</figure>';
  if(v.type==='truncated-bar'){
    return '<figure class="v3333Visual"><div class="v3333VisualLabel">Bar graph</div><svg viewBox="0 0 260 170" role="img" aria-label="Bar chart with vertical axis beginning at 92 percent"><line x1="42" y1="142" x2="244" y2="142"/><line x1="42" y1="20" x2="42" y2="142"/><g class="v3333Grid"><line x1="42" y1="142" x2="244" y2="142"/><line x1="42" y1="112" x2="244" y2="112"/><line x1="42" y1="81" x2="244" y2="81"/><line x1="42" y1="51" x2="244" y2="51"/><line x1="42" y1="20" x2="244" y2="20"/></g><g class="v3333AxisText"><text x="13" y="146">92%</text><text x="13" y="116">94%</text><text x="13" y="85">96%</text><text x="13" y="55">98%</text><text x="8" y="24">100%</text></g><rect class="v3333Bar" x="78" y="112" width="52" height="30" rx="4"/><rect class="v3333Bar" x="158" y="81" width="52" height="61" rx="4"/><text x="91" y="160">94%</text><text x="171" y="160">96%</text></svg></figure>';
  }
  if(v.type==='icons'){
    return '<figure class="v3333Visual"><div class="v3333VisualLabel">Two-dimensional icon display</div><svg viewBox="0 0 300 165" role="img" aria-label="One icon doubled in both height and width"><g class="v3333Icon"><circle cx="72" cy="51" r="14"/><rect x="58" y="67" width="28" height="50" rx="12"/></g><text x="52" y="145">100</text><g class="v3333Icon v3333IconLarge"><circle cx="202" cy="38" r="28"/><rect x="174" y="70" width="56" height="62" rx="22"/></g><text x="190" y="154">200</text></svg><figcaption>The value doubles, but both dimensions of the icon were enlarged.</figcaption></figure>';
  }
  return '';
}
function whyList(q){
  const coach=q.choiceCoach||{};
  return '<details class="v3333Why"><summary>Why each answer is right or wrong</summary><div class="v3333ChoiceWhy">'+(q.options||[]).map(o=>{
    const ok=o===q.answer;
    const txt=ok?'This is the best answer for this scenario. '+String(q.wguClue||'Use the defining feature in the stem.'):coach[o]||'This term does not match the defining feature described in this scenario.';
    return '<div class="'+(ok?'isCorrect':'')+'"><b>'+(ok?'✓ ':'')+E(o)+'</b><p>'+E(txt)+'</p></div>';
  }).join('')+'</div></details>';
}
function practiceFeedback(q){
  const wrong=session?.chosen!==q.answer;
  const reason=String(q.why||'').replace(/\s+/g,' ').trim();
  let reasonBox='';
  if(session?.type==='reason'){
    reasonBox='<div class="v3333Reason"><b>Explain it in one sentence</b><p>Use the WGU term and the clue from the scenario.</p><textarea id="reasonText" placeholder="The best answer is ___ because the scenario says ___..."></textarea><div><button class="btn ghost" onclick="saveReason(false)">Save explanation</button><button class="btn ghost" onclick="saveReason(true)">I explained it aloud</button></div></div>';
  }
  return '<section class="v3333Feedback '+(wrong?'needsRepair':'correct')+'"><div class="v3333FeedbackTitle">'+(wrong?'Review the distinction':'Correct')+'</div><p><b>Best answer:</b> '+E(q.answer)+'</p><p>'+E(reason)+'</p>'+whyList(q)+reasonBox+'<button class="btn primary v3333Next" onclick="continueSession()">Next question →</button></section>';
}
function confidenceHtml(){
  if(session?.opts?.kind==='d772-section1-oa')return '';
  const items=[['guess','Guess'],['50','50/50'],['sure','Sure'],['certain','Certain']];
  return '<div class="v3333Confidence"><span>How sure are you?</span>'+items.map(([v,l])=>'<button type="button" class="'+(session.confidence===v?'sel':'')+'" onclick="setConfidence(\''+v+'\')">'+l+'</button>').join('')+'</div>';
}
function questionHtml(q){
  const oa=session?.opts?.kind==='d772-section1-oa';
  const clue=session?.type==='clue'&&!oa&&!session.answered;
  const selected=session?.pendingChoice;
  const options=(q.options||[]).map((o,i)=>{
    const cls=['v3333Option'];
    if(selected===o&&!session.answered)cls.push('selected');
    if(session.answered&&o===q.answer)cls.push('correct');
    if(session.answered&&o===session.chosen&&o!==q.answer)cls.push('wrong');
    return '<button type="button" class="'+cls.join(' ')+'" '+(session.answered?'disabled':'')+' onclick=\'MajickWGUPractice.select('+JSON.stringify(o)+')\'><span class="v3333Letter">'+String.fromCharCode(65+i)+'</span><span>'+E(o)+'</span></button>';
  }).join('');
  const label=oa?'Section 1 OA Simulation':E(session?.opts?.label||'D772 Practice');
  const progress=(session?.index||1)+(session?.opts?.limit?'/'+session.opts.limit:'');
  return '<div class="v3333QuestionShell '+(oa?'oaMode':'practiceMode')+'"><div class="v3333QTop"><div><span class="v3333Eyebrow">D772 • STATISTICAL DATA LITERACY</span><h2>'+label+'</h2></div><div class="v3333QCount">Question '+progress+'</div></div>'+(oa?'<div class="v3333OANote">No hints or lesson labels during the simulation.</div>':'')+'<article class="v3333QuestionCard"><div class="v3333Prompt">'+E(q.prompt)+'</div>'+visualHtml(q.visual)+(clue?'<div class="v3333ClueTraining">'+clueHTML(cleanPrompt(q.prompt))+'</div>':'')+confidenceHtml()+'<div class="v3333Options">'+options+'</div>'+(!session.answered?'<button type="button" class="btn primary v3333Submit" '+(selected?'':'disabled')+' onclick="MajickWGUPractice.submit()">Submit</button>':'')+(!oa&&session.answered?practiceFeedback(q):'')+'</article></div>';
}
function select(choice){
  if(!session||session.answered)return;
  session.pendingChoice=choice;
  render();
}
function submit(){
  if(!session||session.answered||!session.pendingChoice)return;
  const choice=session.pendingChoice;
  session.pendingChoice=null;
  answerQ(choice);
  if(fixedPractice())session.review.push({q:session.current,chosen:choice,correct:choice===session.current.answer});
}
const SAMPLING_REASONS={
 'Stratified':'The population is divided into groups, and some individuals are randomly selected from every group. Equal numbers from the groups are not required.',
 'Cluster':'Entire groups are randomly selected, and every individual in the selected groups is included.',
 'Systematic':'After a random starting point, individuals are selected at a fixed interval.',
 'Simple Random':'Individuals are randomly selected from the complete population list, with every possible sample of the stated size equally likely.'
};
const SAMPLING_ROWS=[["A university would like to determine the average textbook cost for undergraduate students. Students are separated into freshman, sophomore, junior, and senior groups. Twenty students are randomly selected from each group.", "Stratified"], ["A hospital would like to determine nurses\u2019 average weekly work hours. After randomly selecting a starting name from its complete nurse list, it selects every 12th name.", "Systematic"], ["A school district would like to determine the proportion of fifth-grade students who eat breakfast. Five fifth-grade classrooms are randomly selected, and every student in those classrooms is surveyed.", "Cluster"], ["An insurer would like to determine the proportion of policyholders who filed claims. A computer selects 200 distinct policyholder IDs from the complete list, with every possible set of 200 equally likely.", "Simple Random"], ["A college would like to determine average commuting time. Students are divided into full-time and part-time groups. Sixty full-time students and forty part-time students are randomly selected.", "Stratified"], ["A manufacturer would like to determine the proportion of defective bulbs in a shipment of 80 boxes. Six boxes are randomly selected, and every bulb in those boxes is tested.", "Cluster"], ["A library would like to determine average visitor satisfaction. A number from 1 through 15 is randomly selected as the first visitor position. That visitor and every 15th visitor afterward are surveyed.", "Systematic"], ["A university would like to determine average tuition paid. A computer randomly selects 75 distinct names from the complete undergraduate list, with every possible set of 75 equally likely.", "Simple Random"]];
function startSampling(){
 if(!activeD772())return;
 const questions=shuffleCopy(SAMPLING_ROWS.map(([prompt,answer],i)=>({id:'d772_wgu_sampling_drill_'+i,prompt:prompt+' What type of sampling is used?',answer,options:shuffleCopy(Object.keys(SAMPLING_REASONS)),why:SAMPLING_REASONS[answer],wguClue:SAMPLING_REASONS[answer],choiceCoach:Object.fromEntries(Object.entries(SAMPLING_REASONS).filter(([term])=>term!==answer).map(([term,why])=>[term,why+' That selection rule is not described in this study.'])),learningPathLessonId:'d772-s1-l1',topicId:'sampling-methods',difficulty:2})));
 session={type:'adaptive',opts:{label:'Sampling Method Drill',limit:questions.length,kind:'d772-sampling-drill'},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
const DESIGN_REASONS={
 'Experiment':'Researchers assign a treatment or condition and measure the outcome. Random assignment is a strong clue in this scenario.',
 'Observational study':'Researchers record existing conditions or outcomes without assigning a treatment. This scenario uses observations or records rather than a questionnaire.',
 'Sample Survey':'Researchers ask a sample of people questions. A survey is observational, but Sample Survey is the most specific design described here.'
};
const DESIGN_ROWS=[["Researchers want to compare three reading programs. Participating students are randomly assigned to one of the programs, and their reading scores are compared after eight weeks.", "Experiment"], ["Researchers want to compare starting salaries of university graduates. They examine existing employment records for graduates of public and private universities without assigning graduates to universities.", "Observational study"], ["A college wants to estimate the proportion of students who prefer online classes. A random sample of 200 students is asked to complete a questionnaire about their preferences.", "Sample Survey"], ["Researchers want to determine whether a fertilizer affects plant growth. Plants are randomly assigned to receive the fertilizer or no fertilizer, and their heights are measured.", "Experiment"], ["Researchers want to investigate the relationship between daily walking and blood pressure. They record participants\u2019 existing walking habits and blood pressure without asking anyone to change activity.", "Observational study"], ["A city wants to estimate residents\u2019 satisfaction with public transportation. Interviewers ask a random sample of 300 residents a set of questions about satisfaction.", "Sample Survey"], ["Researchers want to compare two headache treatments. Participants are randomly assigned to receive one treatment, and their reported pain levels are compared.", "Experiment"], ["Researchers want to compare traffic volume on weekdays and weekends. They count vehicles passing an intersection on selected days without changing traffic conditions.", "Observational study"], ["A university wants to estimate how much its students spend on textbooks. A random sample of students is asked to report textbook spending through an online questionnaire.", "Sample Survey"]];
function startStudyDesign(){
 if(!activeD772())return;
 const questions=shuffleCopy(DESIGN_ROWS.map(([prompt,answer],i)=>({id:'d772_wgu_design_drill_'+i,prompt:prompt+' Which term most specifically describes the study design used?',answer,options:shuffleCopy(Object.keys(DESIGN_REASONS)),why:DESIGN_REASONS[answer],wguClue:DESIGN_REASONS[answer],choiceCoach:Object.fromEntries(Object.entries(DESIGN_REASONS).filter(([term])=>term!==answer).map(([term,why])=>[term,term==='Observational study'&&answer==='Sample Survey'?'A sample survey is observational, but Sample Survey is the more specific answer because researchers ask a sample of people questions.':why+' This is not the most specific design described.'])),learningPathLessonId:'d772-s1-l1',topicId:'study-design',difficulty:2})));
 session={type:'adaptive',opts:{label:'Lesson 1.3 Study Design Drill',limit:questions.length,kind:'d772-study-design-drill'},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
const LABEL_REASONS={Population:'The population is the entire group the study is interested in.',Parameter:'A parameter is a numerical summary of the entire population.',Sample:'The sample is the smaller group actually selected for the study.',Statistic:'A statistic is a numerical summary calculated from the sample.',Variable:'The variable is the characteristic measured or recorded for each individual.',Data:'The data are the observed values recorded for that variable.'};
const LABEL_ROWS=[["A college studies the proportion of its 2,000 undergraduate students who use tutoring. It randomly selects 120 students and records whether each uses tutoring.", ["All 2,000 undergraduate students at the college", "The proportion of all 2,000 students who use tutoring", "The 120 selected students", "The proportion of the 120 selected students who use tutoring", "Whether an individual student uses tutoring", "The recorded yes and no responses"]], ["A clinic studies the average waiting time of all patients seen during September. It randomly selects 80 of those patients and records each waiting time in minutes.", ["All patients seen at the clinic during September", "The average waiting time of all patients seen during September", "The 80 selected patients", "The average waiting time of the 80 selected patients", "An individual patient\u2019s waiting time in minutes", "The recorded waiting times, such as 8, 12, and 19 minutes"]], ["A library studies the proportion of all its adult members who borrow e-books. It randomly selects 150 adult members and records whether each borrowed an e-book this year.", ["All adult members of the library", "The proportion of all adult members who borrowed an e-book this year", "The 150 selected adult members", "The proportion of the 150 selected members who borrowed an e-book this year", "Whether an individual adult member borrowed an e-book this year", "The recorded yes and no responses"]]];
function startLabelStudy(){
 if(!activeD772())return;
 const [scenario,parts]=LABEL_ROWS[Math.floor(Math.random()*LABEL_ROWS.length)];
 const terms=Object.keys(LABEL_REASONS);
 const questions=parts.map((part,i)=>({id:'d772_wgu_label_'+LABEL_ROWS.findIndex(row=>row[0]===scenario)+'_'+i,prompt:scenario+' Identify the term for: '+part+'.',answer:terms[i],options:shuffleCopy(terms),why:LABEL_REASONS[terms[i]],wguClue:LABEL_REASONS[terms[i]],choiceCoach:Object.fromEntries(terms.filter(t=>t!==terms[i]).map(t=>[t,LABEL_REASONS[t]+' That definition does not describe the highlighted part.'])),topicId:'population-sample-terms',learningPathLessonId:'d772-s1-l1',difficulty:2}));
 const bank=window.S.courses.D772.questionBank||(window.S.courses.D772.questionBank=[]);
 for(const q of questions)if(!bank.some(old=>old.id===q.id))bank.push(q);
 session={type:'adaptive',opts:{label:'Lesson 1.2 Label the Study',limit:6,kind:'d772-label-study'},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
function fixedPractice(){return ['d772-focused-review','d772-sampling-drill','d772-study-design-drill','d772-label-study'].includes(session?.opts?.kind)}
function balancedOA(){
  const all=window.MajickQuestionBuilder?.d772Questions?.('d772-master-section-1')||[];
  const ids=['d772-s1-l1','d772-s1-l2','d772-s1-l3','d772-s1-l4'];
  const quotas=[8,8,7,7],chosen=[];
  ids.forEach((id,i)=>chosen.push(...shuffleCopy(all.filter(q=>q.learningPathLessonId===id)).slice(0,quotas[i])));
  return shuffleCopy(chosen);
}
function startOA(){
  if(!activeD772())return typeof startTest==='function'?startTest(30):null;
  const arr=balancedOA();
  session={type:'test',opts:{label:'Section 1 OA Simulation',limit:arr.length,hideMeta:true,kind:'d772-section1-oa'},index:1,score:0,questions:arr,current:arr[0]||null,answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
  S.screen='mission';
  render();
}
function startFocusedReview(){
  if(!activeD772()||!session?.finished)return;
  const missed=(session.review||[]).filter(x=>!x.correct);
  const lessons=new Set(missed.map(x=>x.q?.learningPathLessonId).filter(Boolean));
  if(!lessons.size)return;
  const seen=new Set((session.review||[]).map(x=>x.q?.id));
  const pool=(window.MajickQuestionBuilder?.d772Questions?.('d772-master-section-1')||[]).filter(q=>lessons.has(q.learningPathLessonId));
  const fresh=shuffleCopy(pool.filter(q=>!seen.has(q.id)));
  const repeated=shuffleCopy(pool.filter(q=>seen.has(q.id)));
  const arr=[...fresh,...repeated].slice(0,10);
  if(!arr.length)return;
  session={type:'adaptive',opts:{label:'Section 1 Focused Review',limit:arr.length,kind:'d772-focused-review'},index:1,score:0,combo:0,questions:arr,current:arr[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
  S.screen='mission';render();
}
function lessonSummary(review){
  const rows={};
  Object.entries(LESSON_NAMES).forEach(([id,title])=>rows[id]={id,title,total:0,correct:0});
  (review||[]).forEach(x=>{const id=x.q?.learningPathLessonId;if(rows[id]){rows[id].total++;if(x.correct)rows[id].correct++}});
  return Object.values(rows);
}
function statusFor(correct,total){
  if(!total)return ['Not sampled',''];
  const p=correct/total;
  if(p>=.8)return ['Strong','strong'];
  if(p>=.6)return ['Review','review'];
  return ['Priority review','priority'];
}
function oaResult(){
  const review=session?.review||[];
  const score=review.filter(x=>x.correct).length,total=review.length,acc=total?Math.round(score/total*100):0;
  const lessons=lessonSummary(review);
  const concepts={};
  review.forEach(x=>{
    const key=x.q?.wguTerm||x.q?.testedConcept||'Section 1 concept';
    concepts[key]=concepts[key]||{term:key,total:0,correct:0,lessonId:x.q?.learningPathLessonId};
    concepts[key].total++;if(x.correct)concepts[key].correct++;
  });
  const conceptRows=Object.values(concepts).sort((a,b)=>(a.correct/a.total)-(b.correct/b.total)||a.term.localeCompare(b.term));
  const misses=conceptRows.filter(x=>x.correct<x.total);
  return '<div class="v3333Result"><section class="v3333ResultHero"><span class="v3333Eyebrow">SECTION 1 • OA SIMULATION COMPLETE</span><h2>'+score+'/'+total+' • '+acc+'%</h2><p>This is practice evidence, not a prediction of your OA score. Use the breakdown to decide what to review next.</p><div class="v3333ResultActions">'+(review.some(x=>!x.correct)?'<button class="btn primary" onclick="MajickWGUPractice.startFocusedReview()">Practice my missed lessons →</button>':'')+'<button class="btn primary" onclick="MajickWGUPractice.startOA()">Retake 30-question simulation</button><button class="btn ghost" onclick="session=null;navigate(\'learninglab\')">Return to Course Tutor</button></div></section><section class="v3333Readiness"><h3>Section 1 Practice Readiness by Lesson</h3><div class="v3333LessonGrid">'+lessons.map(r=>{const [label,cls]=statusFor(r.correct,r.total);const pct=r.total?Math.round(r.correct/r.total*100):0;return '<article><small>'+E(r.title)+'</small><b>'+r.correct+'/'+r.total+' • '+pct+'%</b><span class="'+cls+'">'+label+'</span></article>'}).join('')+'</div></section><section class="v3333Concepts"><h3>Concepts to Review</h3>'+(misses.length?misses.map(r=>'<article><div><b>'+E(r.term)+'</b><small>'+E(LESSON_NAMES[r.lessonId]||'Section 1')+'</small></div><span>'+r.correct+'/'+r.total+'</span></article>').join(''):'<p>No concepts were missed in this simulation.</p>')+'</section><details class="v3333Missed"><summary>Review missed questions ('+review.filter(x=>!x.correct).length+')</summary>'+review.filter(x=>!x.correct).map(x=>'<article><b>'+E(x.q.prompt)+'</b>'+visualHtml(x.q.visual)+'<p class="wrongText">You chose: '+E(x.chosen)+'</p><p><strong>Best answer:</strong> '+E(x.q.answer)+'</p><p>'+E(x.q.why||'')+'</p>'+whyList(x.q)+'</article>').join('')+'</details></div>';
}
function ensureD772Bank(){
  try{
    const builder=window.MajickQuestionBuilder;
    if(!builder?.d772Questions)return 0;
    if(!window.S?.courses?.D772)return 0;
    const course=window.S.courses.D772;
    const curated=builder.d772Questions('d772-master-section-1')
      .filter(q=>!builder.isLowValueMetaQuestion?.(q));
    course.questionBank=[...curated];
    return curated.length;
  }catch(e){
    console.warn('D772 WGU bank ensure',e);
    return 0;
  }
}
const originalStartAdaptive=typeof window.startAdaptive==='function'?window.startAdaptive:null;
const originalStartClueHunter=typeof window.startClueHunter==='function'?window.startClueHunter:null;
const originalStartReason=typeof window.startReason==='function'?window.startReason:null;
function startD772Mode(original,args){
  if(activeD772()){
    const count=ensureD772Bank();
    if(!count){
      try{window.rewardToast?.('D772 practice unavailable','The WGU question bank could not be loaded.')}catch(_){}
      return;
    }
  }
  if(typeof original!=='function')throw new Error('Legacy practice engine is unavailable.');
  return original.apply(window,args);
}
const wguStartAdaptive=function(){return startD772Mode(originalStartAdaptive,arguments)};
const wguStartClueHunter=function(){return startD772Mode(originalStartClueHunter,arguments)};
const wguStartReason=function(){return startD772Mode(originalStartReason,arguments)};
window.startAdaptive=wguStartAdaptive;
window.startClueHunter=wguStartClueHunter;
window.startReason=wguStartReason;

function fixedResult(){
 const review=session.review||[],missed=review.filter(x=>!x.correct);
 return '<div class="v3333Result"><section class="v3333ResultHero"><h2>'+E(session.opts.label)+' complete</h2><p>You scored '+session.score+'/'+review.length+'.</p><div class="v3333ResultActions">'+(session.opts.kind==='d772-label-study'?'<button class="btn primary" onclick="MajickWGUPractice.startLabelStudy()">Label another study</button>':session.opts.kind==='d772-study-design-drill'?'<button class="btn primary" onclick="MajickWGUPractice.startStudyDesign()">Play study design drill again</button>':session.opts.kind==='d772-sampling-drill'?'<button class="btn primary" onclick="MajickWGUPractice.startSampling()">Play sampling drill again</button>':missed.length?'<button class="btn primary" onclick="MajickWGUPractice.startFocusedReview()">Practice my missed lessons →</button>':'')+'<button class="btn ghost" onclick="session=null;navigate(\'mission\')">Return to Practice Lab</button></div></section><details class="v3333Missed"><summary>Review missed questions ('+missed.length+')</summary>'+missed.map(x=>'<article><b>'+E(x.q.prompt)+'</b><p>You chose: '+E(x.chosen)+'</p><p>Best answer: '+E(x.q.answer)+'</p><p>'+E(x.q.why)+'</p>'+whyList(x.q)+'</article>').join('')+'</details></div>';
}
function missionLanding(){
  return '<div class="v3333Mission"><div class="v3333MissionHead"><span class="v3333Eyebrow">D772 • SECTION 1</span><h2>WGU-Style Practice</h2><p>Practice course concepts with scenarios, focused drills, and different levels of support.</p></div><div class="v3333MissionGrid"><button onclick="MajickWGUPractice.startLabelStudy()"><span>Lesson 1.2 Label the Study</span><b>One scenario · six labels</b><small>Population, sample, parameter, statistic, variable, and data.</small></button><button onclick="MajickWGUPractice.startStudyDesign()"><span>Lesson 1.3 Study Design Drill</span><b>9 fresh study scenarios</b><small>Experiment, observational study, or sample survey. Identify the most specific design.</small></button><button onclick="MajickWGUPractice.startSampling()"><span>Sampling Method Drill</span><b>8 fresh study scenarios</b><small>Stratified, cluster, systematic, and simple random. Feedback stays until you choose Next.</small></button><button onclick="startAdaptive()"><span>Adaptive Practice</span><b>12 WGU-style scenarios</b><small>Targets concepts that need more practice.</small></button><button onclick="startClueHunter()"><span>Clue Training</span><b>10 WGU-style scenarios</b><small>Practice finding the words that control the answer.</small></button><button onclick="startReason()"><span>Reasoning Practice</span><b>10 WGU-style scenarios</b><small>Answer, then explain why the correct choice wins.</small></button><button class="oa" onclick="MajickWGUPractice.startOA()"><span>Section 1 OA Simulation</span><b>30 mixed questions</b><small>No hints. No lesson labels. Readiness breakdown at the end.</small></button></div></div>';
}
const originalSessionHTML=window.sessionHTML||sessionHTML;
const originalResultHTML=window.resultHTML||resultHTML;
const originalMissionHTML=window.missionHTML||missionHTML;
const originalNextQuestion=window.nextQuestion||nextQuestion;
const originalStartMixed=window.startMixed||startMixed;
sessionHTML=function(){
  if(!activeD772()||!session)return originalSessionHTML();
  if(session.finished&&fixedPractice())return fixedResult();
  if(session.finished&&session.opts?.kind==='d772-section1-oa')return oaResult();
  if(isD772Question(session.current))return questionHtml(session.current);
  return originalSessionHTML();
};
resultHTML=function(){
  if(activeD772()&&session?.opts?.kind==='d772-section1-oa')return oaResult();
  return originalResultHTML();
};
missionHTML=function(){
  if(activeD772()){
    ensureD772Bank();
    if(!session)return missionLanding();
  }
  return originalMissionHTML();
};
nextQuestion=function(){
  if(fixedPractice()){
    if(session.index>=session.questions.length){finishSession();return;}
    session.current=session.questions[session.index++];session.answered=false;session.chosen=null;session.pendingChoice=null;session.confidence='sure';return;
  }
  const out=originalNextQuestion.apply(this,arguments);
  if(session)session.pendingChoice=null;
  return out;
};
startMixed=function(){
  if(activeD772())return startOA();
  return originalStartMixed.apply(this,arguments);
};
function bootD772Practice(){
  try{
    if(!activeD772())return;
    // A saved pre-Practice-Lab mission can otherwise keep rendering the old Study Now UI forever.
    if(window.session&&(!isD772Question(window.session.current)||window.session.opts?.kind==='legacy-d772')){
      try{session=null}catch(_){}
      try{window.session=null}catch(_){}
    }
    ensureD772Bank();
    try{window.v3331RefreshD772Practice?.()}catch(_){}
    if(window.S?.screen==='mission'){
      setTimeout(()=>{
        try{if(typeof window.render==='function')window.render()}catch(e){console.warn('D772 Practice Lab boot render',e)}
      },0);
    }
  }catch(e){console.warn('D772 Practice Lab boot',e)}
}
window.MajickWGUPractice={VERSION,select,submit,startOA,startFocusedReview,startSampling,startStudyDesign,startLabelStudy,visualHtml,whyList,balancedOA,isD772Question,ensureD772Bank,bootD772Practice};
document.documentElement.dataset.majickWguPractice='3.3.36';
bootD772Practice();
})();