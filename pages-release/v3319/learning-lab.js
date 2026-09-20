(function(){
'use strict';

const VERSION='3.3.19';
const STARTERS={
  D755:{
    vocab:[
      ['assessment','A process for collecting information to make educational decisions.'],
      ['screening','A brief check used to identify students who may need closer evaluation or support.'],
      ['diagnostic assessment','An assessment used to identify specific strengths, needs, and skill gaps.'],
      ['formative assessment','Ongoing assessment used during instruction to guide what happens next.'],
      ['summative assessment','Assessment used after instruction to evaluate what a learner has achieved.'],
      ['progress monitoring','Repeated measurement used to determine whether an intervention is working.'],
      ['norm-referenced','A score interpreted by comparing a student with a reference group.'],
      ['criterion-referenced','A score interpreted by comparing performance with a defined skill or standard.'],
      ['validity','The degree to which an assessment measures what it is intended to measure.'],
      ['reliability','The degree to which assessment results are consistent.'],
      ['accommodation','A change in how a student accesses learning or demonstrates knowledge without changing the target skill.'],
      ['modification','A change to what a student is expected to learn or demonstrate.'],
      ['IEP','An Individualized Education Program describing eligible special education services, goals, and supports.'],
      ['eligibility','The determination that a student meets requirements for special education services.']
    ],
    lessons:[
      {title:'Assessment Has a Purpose',type:'path',explain:'Different assessments answer different questions. Screening asks who may need support. Diagnostic assessment asks what the specific need is. Formative assessment guides instruction while learning is happening. Summative assessment evaluates learning after instruction.'},
      {title:'Validity and Reliability',type:'target',explain:'A useful assessment needs both. Reliability is about consistency. Validity is about whether the assessment actually measures the intended skill. A test can be reliable without being valid.'},
      {title:'Progress Monitoring',type:'trend',explain:'Progress monitoring uses repeated measurements over time. The important question is not only the latest score, but whether the pattern shows enough growth to continue, adjust, intensify, or change support.'},
      {title:'Accommodation vs. Modification',type:'compare',explain:'An accommodation changes access or response conditions while keeping the learning target. A modification changes the learning expectation itself. Ask: did the target change, or only the way the student accesses or shows it?'}
    ]
  },
  D772:{
    vocab:[
      ['population','The entire group a study wants to understand.'],
      ['sample','The smaller group actually observed or measured.'],
      ['parameter','A numerical value that describes a population.'],
      ['statistic','A numerical value calculated from a sample.'],
      ['representative sample','A sample that reflects important characteristics of the population.'],
      ['random sample','A sample selected using chance so members have a known opportunity to be chosen.'],
      ['convenience sample','A sample selected because participants are easy to reach.'],
      ['voluntary response bias','Bias that can occur when people choose for themselves whether to participate.'],
      ['nonresponse bias','Bias that can occur when selected people do not respond and responders differ from nonresponders.'],
      ['response bias','Bias caused when answers do not accurately reflect the truth, often because of wording, pressure, memory, or social expectations.'],
      ['mean','The arithmetic average: add all values and divide by the number of values.'],
      ['median','The middle value after the data are ordered.'],
      ['mode','The value or values that occur most often.'],
      ['range','Maximum minus minimum.'],
      ['outlier','A value unusually far from the rest of the data.'],
      ['distribution','The pattern of values in a data set, including center, spread, and shape.'],
      ['probability','A number from 0 to 1 describing how likely an event is.'],
      ['correlation','A statistical relationship showing how two variables change together.'],
      ['causation','A relationship in which changing one factor actually produces a change in another.'],
      ['variable','A characteristic that can take different values.']
    ],
    lessons:[
      {title:'Population, Sample, Parameter, Statistic',type:'sample',explain:'Start by asking what group the study wants to understand. That is the population. The people or items actually measured are the sample. A number describing the population is a parameter; a number calculated from the sample is a statistic.'},
      {title:'Representative Samples and Bias',type:'sampleBias',explain:'A large sample is not automatically a good sample. The selection process matters. Random selection helps reduce selection bias. Convenience and voluntary response samples can overrepresent certain people.'},
      {title:'Mean vs. Median',type:'center',explain:'Mean uses every value and is pulled by extreme values. Median depends on the ordered middle position and is more resistant to outliers. When a distribution is strongly skewed, median often describes the typical value better.'},
      {title:'Reading Graphs Fairly',type:'bars',explain:'Before trusting a graph, inspect the title, labels, intervals, axis starting points, scale, and whether visual size matches the actual numbers. A truncated axis can make a small difference appear dramatic.'},
      {title:'Probability',type:'probability',explain:'Probability ranges from 0 to 1. For equally likely outcomes, probability is favorable outcomes divided by total outcomes. The same probability can be written as a fraction, decimal, or percent.'},
      {title:'Correlation Is Not Causation',type:'scatter',explain:'Correlation means variables are associated. It does not prove that one caused the other. A lurking variable, reverse direction, coincidence, or study design can explain an association.'}
    ]
  }
};
const FORMULAS=[
  ['Mean','x̄ = Σx ÷ n','Add every value, then divide by the number of values.'],
  ['Range','max − min','Subtract the smallest value from the largest.'],
  ['Probability','P(event) = favorable ÷ total','Use when outcomes are equally likely.'],
  ['Percent','part ÷ whole × 100','Convert a proportion to a percent.'],
  ['IQR','Q3 − Q1','Measures the spread of the middle 50% of the data.']
];
const BIAS=[
  {q:'A news website asks readers to click a poll about whether they love or hate a new policy.',a:'Voluntary response bias',why:'People choose whether to respond, and people with strong opinions may be more likely to participate.'},
  {q:'A student surveys only people sitting near the campus coffee shop.',a:'Convenience sampling bias',why:'The sample is selected because it is easy to reach, not because it represents the population.'},
  {q:'A survey asks: “Do you agree with the obviously wasteful new program?”',a:'Loaded question',why:'The wording pushes respondents toward a particular answer.'},
  {q:'A mailed survey has a very low return rate, and people who returned it may differ from those who did not.',a:'Nonresponse bias',why:'The people who respond may systematically differ from the people who do not.'},
  {q:'Employees are asked about their manager while the manager stands nearby.',a:'Response bias / lack of anonymity',why:'People may change their answers because they do not feel safe answering honestly.'}
];
const cache={};
let game=null,timer=null,timerLeft=0;

function E(s){
  try{return esc(String(s??''))}
  catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
}
function cid(){return String(window.S?.activeCourse||'D755')}
function cobj(id=cid()){return window.S?.courses?.[id]||{id,title:id,glossary:{},questionBank:[],concepts:[]}}
function pstate(id=cid()){
  if(!window.S)return {};
  S.majickLearningLab=(S.majickLearningLab&&typeof S.majickLearningLab==='object')?S.majickLearningLab:{};
  S.majickLearningLab[id]=S.majickLearningLab[id]||{knownVocab:[],lessonIndex:0,vocabBest:0,scratch:'',focusMinutes:0,reviewTags:[]};
  return S.majickLearningLab[id];
}
function persist(){try{save()}catch(_){}}
function starter(id=cid()){return STARTERS[id]||{vocab:[],lessons:[]}}

function vocab(id=cid()){
  const map=new Map();
  for(const [term,definition] of starter(id).vocab)map.set(String(term).toLowerCase(),{term,definition,source:'Majick starter'});
  const course=cobj(id);
  for(const [term,value] of Object.entries(course.glossary||{})){
    const definition=typeof value==='string'?value:(value?.definition||value?.meaning||String(value||''));
    if(term&&definition)map.set(String(term).toLowerCase(),{term,definition,source:id+' course'});
  }
  for(const row of (cache[id]?.sources||[])){
    for(const item of (row.generated?.vocabulary||[])){
      if(item?.term&&item?.definition)map.set(String(item.term).toLowerCase(),{term:item.term,definition:item.definition,source:row.sourceName||'Uploaded notes'});
    }
  }
  return [...map.values()];
}
function lessons(id=cid()){
  const out=starter(id).lessons.map(x=>({...x,source:'Majick starter'}));
  for(const row of (cache[id]?.sources||[])){
    for(const item of (row.generated?.explanations||[])){
      if(item?.concept&&item?.explanation)out.push({title:item.concept,type:'notes',explain:item.explanation,source:row.sourceName||'Uploaded notes'});
    }
    if(row.generated?.review?.summary)out.push({title:row.sourceName||'Uploaded Review',type:'notes',explain:row.generated.review.summary,source:row.sourceName||'Uploaded notes'});
  }
  const seen=new Set();
  return out.filter(x=>{const k=(x.title+'|'+x.explain).toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
}
async function hydrate(id=cid()){
  try{
    cache[id]=cache[id]||{};
    cache[id].sources=window.MajickMaterialStore?await MajickMaterialStore.list(id):[];
  }catch(_){cache[id]={sources:[]}}
  if(document.querySelector('.learnLab'))refresh();
  return cache[id];
}
function answers(id=cid()){try{return window.S?.progress?.[id]?.answers||[]}catch(_){return[]}}
function questionById(id,qid){return (cobj(id).questionBank||[]).find(q=>q.id===qid||q.qid===qid)||null}
function mastery(id=cid()){
  const rows=answers(id),by={};
  for(const a of rows){
    const q=questionById(id,a.qid||a.id);
    const topic=q?.topicId||a.topicId||'mixed-practice';
    by[topic]=by[topic]||{attempts:0,correct:0};
    by[topic].attempts++;
    if(a.correct===true)by[topic].correct++;
  }
  const topics=Object.entries(by).map(([topic,v])=>({topic,...v,accuracy:v.attempts?Math.round(v.correct/v.attempts*100):0}));
  return {attempts:rows.length,correct:rows.filter(a=>a.correct===true).length,topics};
}
function mistakes(id=cid()){
  return answers(id).filter(a=>a.correct===false).slice(-12).reverse().map(a=>{
    const q=questionById(id,a.qid||a.id);
    return {qid:a.qid||a.id,prompt:q?.prompt||a.prompt||'Review this missed question',given:a.given??a.selected??a.answerGiven??'',correct:q?.answer??a.answer??'',why:q?.why||a.why||''};
  });
}
function recommendation(id=cid()){
  const m=mastery(id),v=vocab(id),st=pstate(id);
  const unknown=v.filter(x=>!st.knownVocab.includes(x.term));
  const weak=m.topics.filter(x=>x.attempts>=2&&x.accuracy<75).sort((a,b)=>a.accuracy-b.accuracy);
  if(weak.length)return 'Review '+weak[0].topic+' — '+weak[0].accuracy+'% accuracy so far.';
  if(unknown.length)return 'Learn '+Math.min(5,unknown.length)+' vocabulary terms, then play the vocab game.';
  if(m.attempts<10)return 'Try a short guided practice set to build evidence of mastery.';
  return 'Use mixed practice to keep mastered ideas fresh.';
}

function calculateExpression(expr){
  const raw=String(expr||'').trim();
  if(!raw||raw.length>120||!/^[0-9+\-*/().\s]+$/.test(raw))return {ok:false,message:'Use numbers, parentheses, +, −, ×, or ÷ only.'};
  try{
    const value=Function('"use strict";return ('+raw+')')();
    if(!Number.isFinite(value))throw new Error('not finite');
    return {ok:true,value:Number(value.toFixed(10))};
  }catch(_){return {ok:false,message:'That calculation could not be evaluated.'}}
}
function numberList(value){
  const arr=Array.isArray(value)?value:String(value||'').split(/[\s,;]+/).filter(Boolean).map(Number);
  return arr.filter(Number.isFinite).slice(0,300);
}
function median(arr){
  const a=[...arr].sort((x,y)=>x-y),n=a.length;
  return n?n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2:null;
}
function stats(value){
  const a=numberList(value);
  if(!a.length)return {ok:false,message:'Enter at least one number.'};
  const sorted=[...a].sort((x,y)=>x-y),n=a.length,sum=a.reduce((x,y)=>x+y,0),mean=sum/n;
  const counts={};a.forEach(x=>counts[x]=(counts[x]||0)+1);
  const maxCount=Math.max(...Object.values(counts));
  const modes=maxCount>1?Object.entries(counts).filter(([,c])=>c===maxCount).map(([x])=>Number(x)):[];
  const lower=sorted.slice(0,Math.floor(n/2)),upper=sorted.slice(Math.ceil(n/2));
  const q1=lower.length?median(lower):sorted[0],q3=upper.length?median(upper):sorted[sorted.length-1];
  const popSD=Math.sqrt(a.reduce((s,x)=>s+(x-mean)**2,0)/n);
  const sampleSD=n>1?Math.sqrt(a.reduce((s,x)=>s+(x-mean)**2,0)/(n-1)):0;
  return {ok:true,n,sum:Number(sum.toFixed(4)),mean:Number(mean.toFixed(4)),median:Number(median(a).toFixed(4)),mode:modes,minimum:sorted[0],maximum:sorted[n-1],range:Number((sorted[n-1]-sorted[0]).toFixed(4)),q1:Number(q1.toFixed(4)),q3:Number(q3.toFixed(4)),iqr:Number((q3-q1).toFixed(4)),populationSD:Number(popSD.toFixed(4)),sampleSD:Number(sampleSD.toFixed(4)),sorted};
}
function gcd(a,b){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b)[a,b]=[b,a%b];return a||1}
function probability(favorable,total){
  const f=Number(favorable),t=Number(total);
  if(!Number.isFinite(f)||!Number.isFinite(t)||t<=0||f<0||f>t)return {ok:false,message:'Use 0 ≤ favorable outcomes ≤ total outcomes.'};
  const g=gcd(f,t),decimal=f/t;
  return {ok:true,fraction:(f/g)+'/'+(t/g),decimal:Number(decimal.toFixed(4)),percent:Number((decimal*100).toFixed(2))};
}

function visual(type){
  if(type==='sample')return '<div class="learnVisual sampleVisual"><div class="populationDots">'+Array.from({length:20},(_,i)=>'<i class="'+(i%5===0?'chosen':'')+'"></i>').join('')+'</div><div><b>Population</b><span>whole group</span></div><div class="arrow">→</div><div class="sampleDots">'+Array.from({length:4},()=>'<i></i>').join('')+'</div><div><b>Sample</b><span>measured group</span></div></div>';
  if(type==='sampleBias')return '<div class="learnVisual compareVisual"><div><b>Random</b><div class="miniPeople">● ○ ● ○ ● ○ ● ○</div><span>chance-based selection</span></div><div><b>Convenience</b><div class="miniPeople">● ● ● ● ○ ○ ○ ○</div><span>easy-to-reach cluster</span></div></div>';
  if(type==='center')return '<div class="learnVisual centerVisual"><div class="numberLine"><span>2</span><span>3</span><span>4</span><span>5</span><span>26</span></div><div class="centerMarks"><b>Median = 4</b><b>Mean = 8</b></div><small>The outlier pulls the mean farther than the median.</small></div>';
  if(type==='bars')return '<div class="learnVisual barsVisual"><div class="axis"><i style="height:24%"></i><i style="height:31%"></i><i style="height:36%"></i><i style="height:42%"></i></div><div class="axis truncated"><i style="height:44%"></i><i style="height:58%"></i><i style="height:72%"></i><i style="height:88%"></i></div><small>Same pattern, different visual impression when the scale changes.</small></div>';
  if(type==='probability')return '<div class="learnVisual probabilityVisual"><div class="tiles"><i class="hit"></i><i class="hit"></i><i></i><i></i><i></i><i></i></div><b>2 favorable ÷ 6 total = 1/3 ≈ 0.333 = 33.3%</b></div>';
  if(type==='scatter')return '<div class="learnVisual scatterVisual">'+[[12,78],[24,70],[36,63],[48,56],[60,45],[70,42],[82,31],[90,23]].map(p=>'<i style="left:'+p[0]+'%;top:'+p[1]+'%"></i>').join('')+'<span>Association ≠ proof of cause</span></div>';
  if(type==='target')return '<div class="learnVisual targetVisual"><div class="rings"><i></i><i></i><i></i><b>VALID?</b></div><div class="repeat">Result 1 → Result 2 → Result 3<br><b>RELIABLE?</b></div></div>';
  if(type==='trend')return '<div class="learnVisual trendVisual"><svg viewBox="0 0 300 110" role="img" aria-label="Progress trend"><polyline points="15,90 60,78 105,72 150,53 195,46 240,29 285,20"></polyline><line x1="15" y1="85" x2="285" y2="35"></line></svg><small>Repeated scores show whether growth is sufficient over time.</small></div>';
  if(type==='compare')return '<div class="learnVisual compareVisual"><div><b>Accommodation</b><span>HOW access or response changes</span></div><div><b>Modification</b><span>WHAT learning expectation changes</span></div></div>';
  return '<div class="learnVisual notesVisual"><b>From your course material</b><span>Read → connect → explain → practice</span></div>';
}

function render(){
  const id=cid(),c=cobj(id),rec=recommendation(id);
  return '<section class="learnLab" data-course="'+E(id)+'">'+
    '<header class="learnHero"><div><div class="eyebrow">MAJICK LEARNING INTELLIGENCE • '+E(id)+'</div><h2 id="learnCourseTitle">Learn '+E(c.title||id)+'</h2><p>Learn it first. Play with the vocabulary. See it. Practice it. Then prove you know it.</p></div><div class="learnHeroSigil">✦</div></header>'+
    '<div class="learnRecommendation"><b>What should I study now?</b><span>'+E(rec)+'</span><button class="btn primary" data-learn-jump="learn">Start learning</button></div>'+
    '<nav class="learnTabs" aria-label="Learning Lab">'+
      [['learn','Learn'],['vocab','Vocabulary'],['game','Vocab Game'],['practice','Guided Practice'],['tools','Tools'],['notes','My Notes'],['mastery','Mastery']].map(x=>'<button type="button" data-learn-tab="'+x[0]+'">'+x[1]+'</button>').join('')+
    '</nav>'+
    '<div class="learnPanels">'+
      '<section class="learnPanel" data-panel="learn"><div id="learnLesson"></div></section>'+
      '<section class="learnPanel" data-panel="vocab" hidden><div id="learnVocab"></div></section>'+
      '<section class="learnPanel" data-panel="game" hidden><div id="learnGame"></div></section>'+
      '<section class="learnPanel" data-panel="practice" hidden><div id="learnPractice"></div></section>'+
      '<section class="learnPanel" data-panel="tools" hidden><div id="learnTools"></div></section>'+
      '<section class="learnPanel" data-panel="notes" hidden><div id="learnNotes"></div></section>'+
      '<section class="learnPanel" data-panel="mastery" hidden><div id="learnMastery"></div></section>'+
    '</div></section>';
}
function showTab(name){
  document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=p.dataset.panel!==name);
  document.querySelectorAll('[data-learn-tab]').forEach(b=>b.classList.toggle('active',b.dataset.learnTab===name));
  if(name==='vocab')renderVocab();
  if(name==='game')renderGame();
  if(name==='practice')renderPractice();
  if(name==='tools')renderTools();
  if(name==='notes')renderNotes();
  if(name==='mastery')renderMastery();
}
function renderLesson(){
  const box=document.getElementById('learnLesson');if(!box)return;
  const rows=lessons(),st=pstate(),i=Math.max(0,Math.min(rows.length-1,Number(st.lessonIndex)||0)),l=rows[i];
  if(!l){
    box.innerHTML='<div class="learnEmpty"><h3>No lesson cards yet</h3><p>Upload course notes in Study Material and Majick will turn explanations and vocabulary into Learn Mode.</p><button class="btn primary" data-go-material>Add Study Material</button></div>';
    box.querySelector('[data-go-material]')?.addEventListener('click',()=>navigate('addmaterial'));
    return;
  }
  box.innerHTML='<div class="learnStepHeader"><div><span>STEP 3 • EXPLAIN + SEE IT</span><h3>'+E(l.title)+'</h3><small>'+E(l.source||'Course lesson')+'</small></div><div class="lessonCount">'+(i+1)+' / '+rows.length+'</div></div>'+
    '<div class="lessonGrid"><article class="lessonExplain"><h4>What it means</h4><p>'+E(l.explain)+'</p><div class="lessonActions"><button class="btn ghost" id="learnPrevLesson" '+(i===0?'disabled':'')+'>← Previous</button><button class="btn primary" id="learnNextLesson">'+(i===rows.length-1?'Guided question →':'Next lesson →')+'</button></div></article>'+visual(l.type)+'</div>';
  document.getElementById('learnPrevLesson')?.addEventListener('click',()=>{st.lessonIndex=Math.max(0,i-1);persist();renderLesson()});
  document.getElementById('learnNextLesson')?.addEventListener('click',()=>{if(i<rows.length-1){st.lessonIndex=i+1;persist();renderLesson()}else showTab('practice')});
}
function renderVocab(){
  const box=document.getElementById('learnVocab');if(!box)return;
  const rows=vocab(),st=pstate();
  if(!rows.length){box.innerHTML='<div class="learnEmpty">No vocabulary yet. Add class notes to Notes Forge.</div>';return}
  box.innerHTML='<div class="learnStepHeader"><div><span>STEP 1 • LEARN THE WORDS</span><h3>Vocabulary Deck</h3><small>'+rows.length+' terms for '+E(cid())+'</small></div><button class="btn primary" id="learnStartVocabGame">Play vocab game →</button></div>'+
    '<div class="vocabGrid">'+rows.map(v=>'<article class="vocabCard '+(st.knownVocab.includes(v.term)?'known':'')+'" data-term="'+E(v.term)+'"><div class="vocabTerm">'+E(v.term)+'</div><p>'+E(v.definition)+'</p><small>'+E(v.source)+'</small><button type="button" class="vocabKnow">'+(st.knownVocab.includes(v.term)?'✓ I know this':'Mark as known')+'</button></article>').join('')+'</div>';
  box.querySelectorAll('.vocabKnow').forEach(btn=>btn.addEventListener('click',()=>{
    const term=btn.closest('[data-term]')?.dataset.term;if(!term)return;
    const at=st.knownVocab.indexOf(term);if(at>=0)st.knownVocab.splice(at,1);else st.knownVocab.push(term);
    persist();renderVocab();
  }));
  document.getElementById('learnStartVocabGame')?.addEventListener('click',()=>{startVocabGame();showTab('game')});
}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function startVocabGame(){
  const rows=vocab();
  if(rows.length<4){game={done:true,score:0,round:0,total:0};return game}
  game={pool:shuffled(rows).slice(0,Math.min(10,rows.length)),round:0,score:0,total:Math.min(10,rows.length),current:null,last:null};
  nextGameRound();return game;
}
function nextGameRound(){
  if(!game||game.round>=game.total){if(game){game.done=true;const st=pstate();st.vocabBest=Math.max(Number(st.vocabBest||0),game.score);persist()}renderGame();return}
  const correct=game.pool[game.round],all=vocab().filter(x=>x.term!==correct.term),wrong=shuffled(all).slice(0,3);
  game.current={correct:correct.term,definition:correct.definition,options:shuffled([correct,...wrong]).map(x=>x.term)};
  game.last=null;renderGame();
}
function chooseVocab(answer){
  if(!game?.current)return false;
  const ok=answer===game.current.correct;
  if(ok)game.score++;
  game.last={ok,chosen:answer,correct:game.current.correct};
  game.round++;
  renderGame();return ok;
}
function gameSnapshot(){return game?JSON.parse(JSON.stringify(game)):null}
function renderGame(){
  const box=document.getElementById('learnGame');if(!box)return;
  if(!game){box.innerHTML='<div class="gameIntro"><span>STEP 2 • PLAY WITH THE WORDS</span><h3>Vocab Constellation</h3><p>Match the definition to the correct term. Ten quick rounds, no penalty to your class grade.</p><button class="btn primary" id="gameStart">Start game</button></div>';document.getElementById('gameStart')?.addEventListener('click',()=>{startVocabGame();renderGame()});return}
  if(game.done){box.innerHTML='<div class="gameDone"><div class="gameScore">'+game.score+' / '+game.total+'</div><h3>Vocab round complete</h3><p>Best score: '+pstate().vocabBest+' / '+game.total+'</p><button class="btn primary" id="gameAgain">Play again</button> <button class="btn ghost" id="gameLearn">Continue to explanation</button></div>';document.getElementById('gameAgain')?.addEventListener('click',()=>{startVocabGame();renderGame()});document.getElementById('gameLearn')?.addEventListener('click',()=>showTab('learn'));return}
  const cur=game.current;
  box.innerHTML='<div class="gameTop"><b>Round '+(game.round+1)+' of '+game.total+'</b><span>Score '+game.score+'</span></div><article class="gameQuestion"><span>Which term matches this definition?</span><h3>'+E(cur.definition)+'</h3><div class="gameOptions">'+cur.options.map(x=>'<button type="button" data-vocab-answer="'+E(x)+'">'+E(x)+'</button>').join('')+'</div><div id="gameFeedback" aria-live="polite"></div></article>';
  box.querySelectorAll('[data-vocab-answer]').forEach(btn=>btn.addEventListener('click',()=>{
    const correct=cur.correct,ok=chooseVocab(btn.dataset.vocabAnswer);
    const fb=document.getElementById('gameFeedback');
    if(fb)fb.innerHTML='<b class="'+(ok?'right':'wrong')+'">'+(ok?'✓ Correct':'Not yet — '+E(correct))+'</b>';
    setTimeout(nextGameRound,550);
  }));
}
function renderPractice(){
  const box=document.getElementById('learnPractice');if(!box)return;
  const bank=(cobj().questionBank||[]).filter(q=>Array.isArray(q.options)&&q.options.length>=2);
  if(!bank.length){box.innerHTML='<div class="learnEmpty"><h3>No guided questions yet</h3><p>Add notes and forge questions for this class first.</p><button class="btn primary" id="practiceAddNotes">Add Study Material</button></div>';document.getElementById('practiceAddNotes')?.addEventListener('click',()=>navigate('addmaterial'));return}
  const q=bank[Math.floor(Math.random()*bank.length)];
  box.innerHTML='<div class="learnStepHeader"><div><span>STEP 4 • TRY IT WITH ME</span><h3>Guided Question</h3><small>This check does not count against your practice record.</small></div></div><article class="guidedQuestion"><h3>'+E(q.prompt)+'</h3><div>'+q.options.map(o=>'<button class="guidedOption" type="button" data-guide-answer="'+E(o)+'">'+E(o)+'</button>').join('')+'</div><div id="guidedFeedback"></div></article><div class="independentCall"><span>STEP 5 • PROVE IT</span><b>Ready to practice independently?</b><button class="btn primary" id="goIndependent">Start Study Now</button></div>';
  box.querySelectorAll('[data-guide-answer]').forEach(btn=>btn.addEventListener('click',()=>{
    const ok=String(btn.dataset.guideAnswer)===String(q.answer);
    const f=document.getElementById('guidedFeedback');if(f)f.innerHTML='<div class="'+(ok?'guideRight':'guideWrong')+'"><b>'+(ok?'✓ Yes':'Try again')+'</b><p>'+E(ok?(q.why||'That matches the course material.'):'Look back at the explanation, eliminate choices, and try again.')+'</p></div>';
  }));
  document.getElementById('goIndependent')?.addEventListener('click',()=>navigate('mission'));
}
function graphSVG(values){
  const a=numberList(values);if(!a.length)return '<div class="toolEmpty">Enter data to draw a graph.</div>';
  const max=Math.max(...a),min=Math.min(...a),range=max-min||1,w=420,h=170,pad=24,bw=Math.max(8,(w-pad*2)/a.length-6);
  return '<svg class="dataGraph" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Bar graph of entered values"><line x1="'+pad+'" y1="10" x2="'+pad+'" y2="'+(h-pad)+'"></line><line x1="'+pad+'" y1="'+(h-pad)+'" x2="'+(w-8)+'" y2="'+(h-pad)+'"></line>'+a.map((v,i)=>{const bh=((v-min)/range*.7+.2)*(h-pad-20);return '<rect x="'+(pad+8+i*(bw+6))+'" y="'+(h-pad-bh)+'" width="'+bw+'" height="'+bh+'"></rect><text x="'+(pad+8+i*(bw+6)+bw/2)+'" y="'+(h-6)+'">'+E(v)+'</text>'}).join('')+'</svg>';
}
function renderTools(){
  const box=document.getElementById('learnTools');if(!box)return;
  const isStats=cid()==='D772',st=pstate();
  box.innerHTML='<div class="learnStepHeader"><div><span>STUDY TOOLS</span><h3>'+E(cid())+' Toolkit</h3><small>Use the tools without leaving your class.</small></div></div>'+
    '<div class="toolGrid"><article class="toolCard"><h4>🧮 Calculator</h4><input id="calcInput" inputmode="decimal" placeholder="(12 + 8) / 4"><button class="btn primary" id="calcRun">Calculate</button><div id="calcResult" class="toolResult"></div></article>'+
    (isStats?'<article class="toolCard wide"><h4>📊 Data Set Explorer</h4><textarea id="statsInput" rows="3" placeholder="12, 14, 14, 18, 22"></textarea><button class="btn primary" id="statsRun">Analyze data</button><div id="statsResult" class="toolResult"></div><div id="statsGraph"></div></article><article class="toolCard"><h4>🎲 Probability</h4><div class="probInputs"><input id="probFav" type="number" min="0" placeholder="Favorable"><input id="probTotal" type="number" min="1" placeholder="Total"></div><button class="btn primary" id="probRun">Calculate</button><div id="probResult" class="toolResult"></div></article><article class="toolCard"><h4>📐 Formula Guide</h4>'+FORMULAS.map(x=>'<div class="formulaRow"><b>'+E(x[0])+'</b><code>'+E(x[1])+'</code><small>'+E(x[2])+'</small></div>').join('')+'</article><article class="toolCard"><h4>🕵🏾 Bias Detective</h4><div id="biasGame"></div></article>':'')+
    '<article class="toolCard wide"><h4>✎ Scratch Pad</h4><textarea id="learnScratch" rows="5" placeholder="Work out a problem, write a reminder, or explain a concept in your own words...">'+E(st.scratch||'')+'</textarea><small>Saved only inside '+E(cid())+'.</small></article>'+
    '<article class="toolCard"><h4>⏱ Focus Potion</h4><div class="focusButtons">'+[10,15,25,45].map(n=>'<button type="button" data-focus="'+n+'">'+n+' min</button>').join('')+'</div><div id="learnTimer">Choose a focus time.</div></article></div>';
  document.getElementById('calcRun')?.addEventListener('click',()=>{const r=calculateExpression(document.getElementById('calcInput')?.value);document.getElementById('calcResult').textContent=r.ok?'= '+r.value:r.message});
  if(isStats){
    document.getElementById('statsRun')?.addEventListener('click',()=>{const raw=document.getElementById('statsInput')?.value,r=stats(raw),out=document.getElementById('statsResult'),g=document.getElementById('statsGraph');if(!r.ok){out.textContent=r.message;g.innerHTML='';return}out.innerHTML='<b>n '+r.n+'</b> • Mean '+r.mean+' • Median '+r.median+' • Mode '+(r.mode.length?r.mode.join(', '):'none')+' • Range '+r.range+' • Q1 '+r.q1+' • Q3 '+r.q3+' • IQR '+r.iqr+'<br><small>Population SD '+r.populationSD+' • Sample SD '+r.sampleSD+'</small>';g.innerHTML=graphSVG(raw)});
    document.getElementById('probRun')?.addEventListener('click',()=>{const r=probability(document.getElementById('probFav')?.value,document.getElementById('probTotal')?.value);document.getElementById('probResult').textContent=r.ok?r.fraction+' = '+r.decimal+' = '+r.percent+'%':r.message});
    renderBias();
  }
  document.getElementById('learnScratch')?.addEventListener('input',e=>{st.scratch=e.target.value;persist()});
  box.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click',()=>startTimer(Number(b.dataset.focus))));
}
function renderBias(){
  const box=document.getElementById('biasGame');if(!box)return;
  const item=BIAS[Math.floor(Math.random()*BIAS.length)];
  const choices=shuffled([item.a,...BIAS.map(x=>x.a).filter(x=>x!==item.a)]).slice(0,4);
  if(!choices.includes(item.a))choices[0]=item.a;
  box.innerHTML='<p>'+E(item.q)+'</p><div class="biasChoices">'+shuffled(choices).map(x=>'<button type="button" data-bias="'+E(x)+'">'+E(x)+'</button>').join('')+'</div><div id="biasFeedback"></div>';
  box.querySelectorAll('[data-bias]').forEach(b=>b.addEventListener('click',()=>{const ok=b.dataset.bias===item.a;document.getElementById('biasFeedback').innerHTML='<b>'+(ok?'✓ Correct':'Answer: '+E(item.a))+'</b><p>'+E(item.why)+'</p><button type="button" id="biasNext">Next scenario</button>';document.getElementById('biasNext')?.addEventListener('click',renderBias)}));
}
function startTimer(minutes){
  clearInterval(timer);timerLeft=Math.max(1,minutes)*60;
  const tick=()=>{const box=document.getElementById('learnTimer');if(box)box.textContent=Math.floor(timerLeft/60)+':'+String(timerLeft%60).padStart(2,'0');if(timerLeft--<=0){clearInterval(timer);const st=pstate();st.focusMinutes=Number(st.focusMinutes||0)+minutes;persist();if(box)box.textContent='✓ Focus session complete'}};
  tick();timer=setInterval(tick,1000);
}
async function renderNotes(){
  const box=document.getElementById('learnNotes');if(!box)return;
  const rows=cache[cid()]?.sources||[];
  box.innerHTML='<div class="learnStepHeader"><div><span>MY CLASS SOURCES</span><h3>Search My Notes</h3><small>Searches only '+E(cid())+' material.</small></div><button class="btn primary" id="notesAdd">Add Study Material</button></div><div class="notesSearch"><input id="notesQuery" placeholder="Search this class: bias, validity, mean..."><button class="btn ghost" id="notesSearchBtn">Search</button></div><div id="notesResults">'+(rows.length?rows.map(r=>'<article><b>'+E(r.sourceName)+'</b><small>'+E(r.sourceType||'notes')+' • '+(r.generated?.practiceQuestions?.length||0)+' questions</small></article>').join(''):'<div class="learnEmpty">No uploaded sources in this class yet.</div>')+'</div>';
  document.getElementById('notesAdd')?.addEventListener('click',()=>navigate('addmaterial'));
  const run=()=>{const q=String(document.getElementById('notesQuery')?.value||'').trim().toLowerCase(),out=document.getElementById('notesResults');if(!q){renderNotes();return}const hits=[];for(const r of rows){const text=String(r.text||''),at=text.toLowerCase().indexOf(q);if(at>=0)hits.push({name:r.sourceName,excerpt:text.slice(Math.max(0,at-110),Math.min(text.length,at+q.length+180))})}out.innerHTML=hits.length?hits.map(h=>'<article><b>'+E(h.name)+'</b><p>…'+E(h.excerpt)+'…</p></article>').join(''):'<div class="learnEmpty">No matches in '+E(cid())+' notes.</div>'};
  document.getElementById('notesSearchBtn')?.addEventListener('click',run);
  document.getElementById('notesQuery')?.addEventListener('keydown',e=>{if(e.key==='Enter')run()});
}
function renderMastery(){
  const box=document.getElementById('learnMastery');if(!box)return;
  const m=mastery(),miss=mistakes(),st=pstate(),known=vocab().filter(x=>st.knownVocab.includes(x.term)).length,total=vocab().length;
  box.innerHTML='<div class="learnStepHeader"><div><span>STEP 6 • MASTER + REVIEW</span><h3>'+E(cid())+' Mastery Map</h3><small>Academic progress stays inside this class.</small></div></div><div class="masterySummary"><article><b>'+m.attempts+'</b><span>questions answered</span></article><article><b>'+(m.attempts?Math.round(m.correct/m.attempts*100):0)+'%</b><span>overall accuracy</span></article><article><b>'+known+' / '+total+'</b><span>vocab known</span></article><article><b>'+Number(st.focusMinutes||0)+'</b><span>focus minutes</span></article></div><div class="masteryGrid"><section><h4>Concept mastery</h4>'+(m.topics.length?m.topics.map(t=>'<div class="masteryRow"><span>'+E(t.topic)+'</span><div><i style="width:'+Math.min(100,t.accuracy)+'%"></i></div><b>'+t.accuracy+'%</b></div>').join(''):'<p class="tiny">Answer questions to build a mastery map.</p>')+'</section><section><h4>Mistake Journal</h4>'+(miss.length?miss.map(x=>'<article class="mistakeCard"><b>'+E(x.prompt)+'</b><small>Your answer: '+E(x.given||'—')+'</small><small>Correct: '+E(x.correct||'—')+'</small>'+(x.why?'<p>'+E(x.why)+'</p>':'')+'</article>').join(''):'<p class="tiny">No recorded mistakes yet.</p>')+'</section></div>';
}
async function refresh(){
  renderLesson();
  const visible=document.querySelector('.learnPanel:not([hidden])')?.dataset.panel;
  if(visible==='vocab')renderVocab();
  if(visible==='game')renderGame();
  if(visible==='practice')renderPractice();
  if(visible==='tools')renderTools();
  if(visible==='notes')renderNotes();
  if(visible==='mastery')renderMastery();
}
function bind(){
  const root=document.querySelector('.learnLab');if(!root||root.__bound)return;
  root.__bound=true;
  root.querySelectorAll('[data-learn-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.learnTab)));
  root.querySelectorAll('[data-learn-jump]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.learnJump)));
  showTab('learn');renderLesson();hydrate(cid());
}
function setScratchpad(id,text){const st=pstate(id);st.scratch=String(text||'');persist();return st.scratch}
function model(id=cid()){return {courseId:id,title:cobj(id).title||id,vocab:vocab(id),lessons:lessons(id),mastery:mastery(id),recommendation:recommendation(id),state:{...pstate(id)}}}

window.MajickLearningLab={VERSION,render,bind,refresh,hydrate,vocab,lessons,mastery,mistakes,recommendation,calculateExpression,stats,probability,startVocabGame,chooseVocab,gameSnapshot,setScratchpad,state:pstate,model,showTab};
})();