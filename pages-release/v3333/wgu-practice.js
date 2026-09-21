(()=>{
'use strict';
const VERSION='3.3.35';
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
}
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
  return '<div class="v3333Result"><section class="v3333ResultHero"><span class="v3333Eyebrow">SECTION 1 • OA SIMULATION COMPLETE</span><h2>'+score+'/'+total+' • '+acc+'%</h2><p>This is practice evidence, not a prediction of your OA score. Use the breakdown to decide what to review next.</p><div class="v3333ResultActions"><button class="btn primary" onclick="MajickWGUPractice.startOA()">Retake 30-question simulation</button><button class="btn ghost" onclick="session=null;navigate(\'learninglab\')">Return to Course Tutor</button></div></section><section class="v3333Readiness"><h3>Section 1 Practice Readiness by Lesson</h3><div class="v3333LessonGrid">'+lessons.map(r=>{const [label,cls]=statusFor(r.correct,r.total);const pct=r.total?Math.round(r.correct/r.total*100):0;return '<article><small>'+E(r.title)+'</small><b>'+r.correct+'/'+r.total+' • '+pct+'%</b><span class="'+cls+'">'+label+'</span></article>'}).join('')+'</div></section><section class="v3333Concepts"><h3>Concepts to Review</h3>'+(misses.length?misses.map(r=>'<article><div><b>'+E(r.term)+'</b><small>'+E(LESSON_NAMES[r.lessonId]||'Section 1')+'</small></div><span>'+r.correct+'/'+r.total+'</span></article>').join(''):'<p>No concepts were missed in this simulation.</p>')+'</section><details class="v3333Missed"><summary>Review missed questions ('+review.filter(x=>!x.correct).length+')</summary>'+review.filter(x=>!x.correct).map(x=>'<article><b>'+E(x.q.prompt)+'</b>'+visualHtml(x.q.visual)+'<p class="wrongText">You chose: '+E(x.chosen)+'</p><p><strong>Best answer:</strong> '+E(x.q.answer)+'</p><p>'+E(x.q.why||'')+'</p>'+whyList(x.q)+'</article>').join('')+'</details></div>';
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
const originalStartAdaptive=window.startAdaptive||startAdaptive;
const originalStartClueHunter=window.startClueHunter||startClueHunter;
const originalStartReason=window.startReason||startReason;
function startD772Mode(original,args){
  if(activeD772()){
    const count=ensureD772Bank();
    if(!count){
      try{rewardToast?.('D772 practice unavailable','The WGU question bank could not be loaded.')}catch(_){}
      return;
    }
  }
  return original.apply(this,args);
}
startAdaptive=function(){return startD772Mode(originalStartAdaptive,arguments)};
startClueHunter=function(){return startD772Mode(originalStartClueHunter,arguments)};
startReason=function(){return startD772Mode(originalStartReason,arguments)};
window.startAdaptive=startAdaptive;
window.startClueHunter=startClueHunter;
window.startReason=startReason;

function missionLanding(){
  return '<div class="v3333Mission"><div class="v3333MissionHead"><span class="v3333Eyebrow">D772 • SECTION 1</span><h2>WGU-Style Practice</h2><p>Every mode uses the same WGU-language concept bank. The difference is how much support you receive while practicing.</p></div><div class="v3333MissionGrid"><button onclick="startAdaptive()"><span>Adaptive Practice</span><b>12 WGU-style scenarios</b><small>Targets concepts that need more practice.</small></button><button onclick="startClueHunter()"><span>Clue Training</span><b>10 WGU-style scenarios</b><small>Practice finding the words that control the answer.</small></button><button onclick="startReason()"><span>Reasoning Practice</span><b>10 WGU-style scenarios</b><small>Answer, then explain why the correct choice wins.</small></button><button class="oa" onclick="MajickWGUPractice.startOA()"><span>Section 1 OA Simulation</span><b>30 mixed questions</b><small>No hints. No lesson labels. Readiness breakdown at the end.</small></button></div></div>';
}
const originalSessionHTML=window.sessionHTML||sessionHTML;
const originalResultHTML=window.resultHTML||resultHTML;
const originalMissionHTML=window.missionHTML||missionHTML;
const originalNextQuestion=window.nextQuestion||nextQuestion;
const originalStartMixed=window.startMixed||startMixed;
sessionHTML=function(){
  if(!activeD772()||!session)return originalSessionHTML();
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
window.MajickWGUPractice={VERSION,select,submit,startOA,visualHtml,whyList,balancedOA,isD772Question,ensureD772Bank,bootD772Practice};
document.documentElement.dataset.majickWguPractice='3.3.35';
bootD772Practice();
})();