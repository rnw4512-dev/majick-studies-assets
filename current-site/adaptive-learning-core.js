(()=>{
'use strict';
const VERSION='3.4.7-shared-adaptive';
const STEPS=['What am I learning?','Quick Check','Teach Me','Show Me','Why Does This Work?','Help Me Try','My Turn','Related Mistakes','Mix It Up','Retrieve It','Mastery Check','Schedule Review'];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MICRO_SKILLS={
 D772:{
  'expected-value':[
   ['recognize','Recognizes an expected-value situation'],
   ['percent-decimal','Converts percentages to decimals'],
   ['probabilities','Identifies outcome probabilities'],
   ['signs','Assigns positive/negative signs'],
   ['substitution','Substitutes values correctly'],
   ['multiply','Performs probability × value multiplication'],
   ['sum','Adds weighted outcomes'],
   ['interpret','Interprets expected value in context'],
   ['compare','Compares two decisions using expected value']
  ],
  'empirical-probability':[
   ['recognize','Recognizes observed-trial data'],
   ['numerator','Identifies successful/target outcomes'],
   ['denominator','Uses total trials as denominator'],
   ['divide','Performs division'],
   ['round','Rounds only at the end'],
   ['interpret','Interprets relative frequency']
  ],
  'theoretical-probability':[
   ['recognize','Recognizes equally likely outcomes'],
   ['favorable','Counts favorable outcomes'],
   ['total','Counts the sample space'],
   ['divide','Computes favorable ÷ total'],
   ['convert','Converts fraction/decimal/percent']
  ],
  'union':[
   ['recognize','Recognizes OR / union wording'],
   ['regions','Includes A only, B only, and overlap'],
   ['overlap','Avoids double-counting overlap'],
   ['calculate','Calculates union probability']
  ],
  'intersection':[
   ['recognize','Recognizes AND / intersection wording'],
   ['overlap','Finds outcomes shared by both events'],
   ['calculate','Calculates intersection probability']
  ],
  'complement':[
   ['recognize','Recognizes NOT / complement wording'],
   ['whole','Understands the whole probability is 1'],
   ['subtract','Uses 1 − P(A)'],
   ['convert','Converts the final form when needed']
  ],
  'five-number-summary':[
   ['order','Orders data correctly'],
   ['median','Finds the median'],
   ['quartiles','Finds Q1 and Q3'],
   ['iqr','Computes Q3 − Q1'],
   ['interpret','Interprets spread versus count']
  ]
 }
};
const GENERIC_MICRO=[
 ['recognize','Recognizes what the question is asking'],
 ['select','Selects the correct rule or strategy'],
 ['apply','Applies the rule correctly'],
 ['interpret','Explains the answer in context'],
 ['transfer','Uses the skill in a new scenario']
];

const cid=()=>String(window.S?.activeCourse||'');
const course=()=>window.S?.courses?.[cid()]||{id:cid(),title:cid(),questionBank:[],concepts:[],misconceptionCatalog:[]};
function progress(){
 const id=cid();if(!id||!window.S)return null;
 S.progress=S.progress||{};S.progress[id]=S.progress[id]||{answers:[],spacedQueue:[],errorTags:[]};
 const p=S.progress[id];
 p.answers=Array.isArray(p.answers)?p.answers:[];
 p.spacedQueue=Array.isArray(p.spacedQueue)?p.spacedQueue:[];
 p.errorTags=Array.isArray(p.errorTags)?p.errorTags:[];
 p.adaptiveLearning=p.adaptiveLearning||{lessonIndex:0,step:0,diagnostics:{},checks:{},support:{},currentQuestion:null,microSkills:{},path:{},workedErrors:{}};
 return p;
}
function state(){return progress()?.adaptiveLearning||{}}
function save(){try{window.save?.()}catch(_){}}
function genericLessons(){
 const rows=window.MajickLearningLab?.lessons?.(cid())||[];
 return rows.map((x,i)=>({id:x.id||('lesson-'+i),title:x.title||('Lesson '+(i+1)),goal:x.explain||'',teach:x.explain||'',source:x.source||'Course material',skills:[],concepts:[]}));
}
function d772Lessons(){
 if(cid()!=='D772'||!window.MajickInstruction?.LESSONS)return null;
 return window.MajickInstruction.LESSONS.map(l=>({
   id:l.id,title:l.title,goal:l.goal||'',teach:l.mental||l.goal||'',source:'D772 course material',skills:l.skills||[],concepts:l.concepts||[]
 }));
}
function lessons(){return d772Lessons()||genericLessons()}
function current(){
 const ls=lessons(),st=state(),li=Math.max(0,Math.min(ls.length-1,Number(st.lessonIndex)||0)),lesson=ls[li]||{id:'course',title:course().title,goal:'Learn the current course material.',teach:'Use the course material and practice to build mastery.',skills:[],concepts:[]};
 let concept=null;
 if(lesson.concepts?.length){
   const ci=Math.max(0,Math.min(lesson.concepts.length-1,Number(st.conceptIndex)||0));concept=lesson.concepts[ci];
 }else{
   concept={id:lesson.id,title:lesson.title,teach:lesson.teach||lesson.goal,different:[lesson.teach||lesson.goal],examples:[],wguAsk:'Recognize the concept from a new scenario.',anchor:{trap:'Watch for distractors that use related but incorrect terms.'}};
 }
 return {lesson,concept,li};
}
function bank(){return Array.isArray(course().questionBank)?course().questionBank.filter(q=>Array.isArray(q.options)&&q.options.length>=2):[]}
function normId(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function microDefs(){
 const c=current().concept,key=normId(c?.id||c?.title),map=MICRO_SKILLS[cid()]||{};
 for(const [k,v] of Object.entries(map)){if(key.includes(k)||k.includes(key))return v}
 return GENERIC_MICRO;
}
function microState(){
 const st=state(),key=current().concept.id;st.microSkills=st.microSkills||{};st.microSkills[key]=st.microSkills[key]||{};
 const obj=st.microSkills[key];for(const [id] of microDefs())obj[id]=obj[id]||{attempts:0,correct:0,support:0,lastAt:0};
 return obj;
}
function creditMicro(ids,correct,{support=false}={}){
 const ms=microState(),arr=Array.isArray(ids)?ids:[ids],at=Date.now();
 arr.filter(Boolean).forEach(id=>{if(!ms[id])ms[id]={attempts:0,correct:0,support:0,lastAt:0};ms[id].attempts++;if(correct)ms[id].correct++;if(support)ms[id].support++;ms[id].lastAt=at});save();
}
function microReceipt(){
 const ms=microState();
 return microDefs().map(([id,label])=>{const r=ms[id]||{},acc=r.attempts?Math.round(r.correct/r.attempts*100):0;return{id,label,attempts:r.attempts||0,correct:r.correct||0,support:r.support||0,accuracy:acc,status:!r.attempts?'Not yet':acc>=85&&r.attempts>=2?'Strong':acc>=65?'Developing':'Needs support'}})
}
function inferMicro(q,choice,ok){
 const text=(String(q?.prompt||'')+' '+String(q?.why||'')+' '+String(current().concept?.title||'')).toLowerCase(),defs=microDefs(),ids=[];
 for(const [id,label] of defs){const t=(id+' '+label).toLowerCase();if(t.split(/\s+/).some(w=>w.length>5&&text.includes(w)))ids.push(id)}
 if(!ids.length)ids.push(defs[0]?.[0],defs[1]?.[0]);
 if(!ok&&/percent|decimal/.test(text))ids.push('percent-decimal','convert');
 if(!ok&&/loss|negative|win|expected value/.test(text))ids.push('signs');
 if(!ok&&/denominator|total trials/.test(text))ids.push('denominator');
 if(!ok&&/round|hundredth/.test(text))ids.push('round');
 return [...new Set(ids.filter(Boolean))];
}
function learningPath(){
 const m=mastery(),p=progress(),topic='adaptive:'+current().concept.id,due=p.spacedQueue.find(x=>x.topicId===topic);
 return [
  ['Understand',(state().step||0)>=4],
  ['Guided',(state().step||0)>=6],
  ['Independent',m.independent>=2],
  ['Mixed',m.transfer>=1],
  ['Delayed Recall',!!due&&due.stage>=2]
 ];
}
function masteryReceiptHtml(){
 const m=mastery(),micro=microReceipt(),path=learningPath();
 const delayed=progress().spacedQueue.filter(x=>x.topicId==='adaptive:'+current().concept.id&&x.stage>=2).length;
 return '<div class="v347Receipt"><b>Mastery Receipt</b><p>This is why Majick considers this skill '+(m.ready?'ready':'still developing')+'.</p><div class="v347ReceiptGrid">'+
  '<span>✓ '+Math.round(m.acc*100)+'% recent accuracy</span><span>✓ '+m.independent+' correct without help</span><span>✓ '+m.transfer+' mixed/transfer correct</span><span>✓ '+delayed+' delayed recall evidence</span>'+
  (m.recurring?'<span class="warn">⚠ recurring misconception remains</span>':'<span>✓ no recurring critical misconception</span>')+
 '</div><details><summary>Micro-skill evidence</summary>'+micro.map(x=>'<div class="v347MicroRow"><span>'+E(x.label)+'</span><b class="'+normId(x.status)+'">'+E(x.status)+'</b><small>'+x.correct+'/'+x.attempts+' correct'+(x.support?' • '+x.support+' with support':'')+'</small></div>').join('')+'</details></div>';
}
function pathMeterHtml(){
 return '<div class="v347PathMeter">'+learningPath().map(([label,on],i)=>'<span class="'+(on?'done':'')+'"><i>'+(on?'●':'○')+'</i>'+E(label)+'</span>').join('<b>→</b>')+'</div>';
}
function noMathUnlocked(q){const k=q?.id||q?.qid;return !!(k&&state().noMath?.[k]?.unlocked)}
function noMathChoices(q){
 const p=String(q?.prompt||'').toLowerCase(),c=current().concept,title=String(c?.title||'').toLowerCase();
 let testing=['Probability','Expected value','Graph interpretation','Bias / credibility'];
 if(/expected value|win|lose|payoff|average result/.test(p+title))testing=['Expected value','Complement','Empirical probability','Mean'];
 else if(/not|complement/.test(p+title))testing=['Complement','Union','Intersection','Expected value'];
 else if(/or|union/.test(p+title))testing=['Union','Intersection','Complement','Theoretical probability'];
 else if(/and|intersection/.test(p+title))testing=['Intersection','Union','Complement','Empirical probability'];
 else if(/observed|trials|times/.test(p+title))testing=['Empirical probability','Theoretical probability','Complement','Expected value'];
 else if(/equally likely|fair die|sample space/.test(p+title))testing=['Theoretical probability','Empirical probability','Union','Expected value'];
 const info=['The counts / probabilities given','The final answer choices only','Every number even if unrelated','Only the largest number'];
 const strategy=['Use the matching rule or formula','Start calculating immediately','Pick the answer that looks reasonable','Use the last formula practiced'];
 return {testing,info,strategy};
}
function noMathWordBank(){
 return ['OR','AND','NOT','observed trials','equally likely','probability × value','total trials','favorable outcomes','overlap','long-run average'];
}
function noMathYetHtml(q){
 if(!q)return '';
 const st=state();st.noMath=st.noMath||{};const key=q.id||q.qid;st.noMath[key]=st.noMath[key]||{testing:'',info:'',strategy:'',unlocked:false,mode:'choice'};
 const x=st.noMath[key],choices=noMathChoices(q),bank=noMathWordBank();
 return '<div class="v347NoMath"><small>NO MATH YET</small><h3>Understand the problem before touching the numbers</h3>'+
 '<section><b>1. What is this problem testing?</b><div class="v347ChoiceGrid">'+choices.testing.map(v=>'<button data-v347-nomath-choice="testing" data-value="'+E(v)+'" class="'+(x.testing===v?'selected':'')+'">'+E(v)+'</button>').join('')+'</div></section>'+
 '<section><b>2. Which information matters?</b><div class="v347ChoiceGrid">'+choices.info.map(v=>'<button data-v347-nomath-choice="info" data-value="'+E(v)+'" class="'+(x.info===v?'selected':'')+'">'+E(v)+'</button>').join('')+'</div></section>'+
 '<section><b>3. Which strategy fits?</b><div class="v347ChoiceGrid">'+choices.strategy.map(v=>'<button data-v347-nomath-choice="strategy" data-value="'+E(v)+'" class="'+(x.strategy===v?'selected':'')+'">'+E(v)+'</button>').join('')+'</div></section>'+
 '<section class="v347WordBank"><b>Clue-word bank</b><p>Tap any clue words that match this problem.</p><div>'+bank.map(v=>'<button data-v347-word="'+E(v)+'">'+E(v)+'</button>').join('')+'</div></section>'+
 '<button class="btn primary" data-v347-unlock '+(x.testing&&x.info&&x.strategy?'':'disabled')+'>Unlock the math</button></div>';
}
function workedErrorHtml(){
 const c=current().concept,title=String(c?.title||'').toLowerCase();
 let ex=null;
 if(/empirical/.test(title))ex={work:'P(A) = 20/20 = 1',q:'What went wrong?',a:'The denominator used only the successful outcomes instead of all trials.'};
 else if(/expected/.test(title))ex={work:'EV = (.30)(3) + (.70)(2)',q:'What went wrong?',a:'A $3 loss must be entered as −3, not +3.'};
 else if(/union/.test(title))ex={work:'P(A or B)=P(A)+P(B)',q:'What could be wrong?',a:'If A and B overlap, the intersection must be subtracted once.'};
 if(!ex)return '';
 return '<div class="v347WorkedError"><small>WORKED ERROR</small><code>'+E(ex.work)+'</code><b>'+E(ex.q)+'</b><button data-v347-show-error>Reveal the repair</button><p data-v347-error hidden>'+E(ex.a)+'</p></div>';
}

function questionTopic(q){return String(q?.topicId||q?.learningPathLessonId||q?.sectionId||q?.conceptId||'mixed')}
function matchesCurrent(q){
 const {lesson,concept}=current(),t=questionTopic(q).toLowerCase(),hay=[lesson.id,lesson.title,concept?.id,concept?.title].filter(Boolean).join(' ').toLowerCase();
 return t&&hay&&(hay.includes(t)||t.includes(String(lesson.id).toLowerCase())||t.includes(String(concept?.id||'').toLowerCase()));
}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function qset(n=3,mixed=false){
 const b=bank();if(!b.length)return [];
 let pool=mixed?b:b.filter(matchesCurrent);if(pool.length<n)pool=b;
 return shuffled(pool).slice(0,n);
}
function diagnostic(){
 const st=state(),key=current().concept.id;
 if(!st.diagnostics[key])st.diagnostics[key]={questions:qset(3).map(q=>q.id),answers:[]};
 return st.diagnostics[key];
}
function byId(id){return bank().find(q=>q.id===id||q.qid===id)}
function guardian(){
 try{const z=window.activePet?.(),d=window.petDef?.(z);return {name:z?.name||'Your Guardian',emoji:d?.emoji||'✦'}}catch(_){return {name:'Your Guardian',emoji:'✦'}}
}
function conceptAnswers(){
 const key=current().concept.id,ls=current().lesson.id;
 return progress().answers.filter(a=>String(a.topicId||'').includes(key)||String(a.topicId||'').includes(ls));
}
function mastery(){
 const rows=conceptAnswers().slice(-12),recent=rows.slice(-8);
 const acc=recent.length?recent.filter(x=>x.correct).length/recent.length:0;
 const independent=rows.filter(x=>x.correct&&!x.assisted&&/adaptive-(turn|retrieve|mastery)/.test(x.source||'')).length;
 const transfer=rows.filter(x=>x.correct&&x.source==='adaptive-mix').length;
 const tags=progress().errorTags.filter(x=>x.conceptId===current().concept.id);
 const counts={};tags.forEach(x=>counts[x.tag]=(counts[x.tag]||0)+1);
 const recurring=Object.values(counts).some(n=>n>=2);
 return {acc,independent,transfer,recurring,counts,ready:recent.length>=4&&acc>=.80&&independent>=2&&transfer>=1&&!recurring};
}
function scheduleReview(){
 const p=progress(),topicId='adaptive:'+current().concept.id,old=p.spacedQueue.find(x=>x.topicId===topicId),stage=old?.stage||0,days=[2,5,10,21][Math.min(stage,3)];
 p.spacedQueue=p.spacedQueue.filter(x=>x.topicId!==topicId);
 p.spacedQueue.push({topicId,stage:stage+1,dueAt:Date.now()+days*86400000,source:'shared-adaptive',at:Date.now()});
 save();return days;
}
function record(q,choice,source,{assisted=false,transfer=false}={}){
 const ok=String(choice)===String(q.answer),at=Date.now(),topicId='adaptive:'+current().concept.id;
 if(window.MajickStudyProgress?.creditAnswer){
   window.MajickStudyProgress.creditAnswer({key:cid()+':'+source+':'+(q.id||q.qid)+':'+at,course:cid(),source,qid:q.id||q.qid,topicId,correct:ok,difficulty:source==='adaptive-mastery'?5:source==='adaptive-mix'?4:3,chosen:choice,answer:q.answer,at,assisted,transfer});
 }else progress().answers.push({qid:q.id||q.qid,topicId,correct:ok,chosen:choice,answer:q.answer,source,assisted,transfer,at});
 const mids=inferMicro(q,choice,ok);creditMicro(mids,ok,{support:assisted});
 if(!ok){
   const tag=inferError(q,choice);
   progress().errorTags.push({conceptId:current().concept.id,tag,at,qid:q.id||q.qid});
 }
 save();return ok;
}
function inferError(q,choice){
 const c=current().concept,text=String(q?.why||'')+' '+String(c?.anchor?.trap||'');
 if(/formula|equation|calculate|probab|mean|median|range|expected|quartile|percent/i.test(text))return 'calculation/setup';
 if(/both|not|or|and|distinguish|difference|compare/i.test(text))return 'concept distinction';
 return 'scenario recognition';
}

function activeProfile(){
 try{return window.MajickLearningProfiles?.profileFor?.(current().concept,current().lesson,cid())||null}catch(_){return null}
}
function profileCard(){
 try{return window.MajickLearningProfiles?.cardHtml?.(current().concept,current().lesson,cid())||''}catch(_){return ''}
}
function profileGuide(){
 const p=activeProfile();if(!p)return '';
 const map={
  definition:'Compare the concept with its closest look-alike, then test it in scenarios and study the tempting wrong answer.',
  procedure:'Recognize the problem type, set up the rule or formula, substitute carefully, calculate, then interpret.',
  interpretation:'Read the visual or result first, describe the pattern, then explain what it means in context.',
  application:'Identify the decision, compare the possible actions, apply the relevant evidence, and justify the best choice.',
  memory:'Retrieve before rereading, match terms to meanings, and revisit them later with spaced recall.'
 };
 return map[p.primary]||'Use the support pattern that best matches this concept.';
}
function tutorText(kind){
 const c=current().concept;
 if(kind==='simple')return c?.different?.[0]||c?.teach||current().lesson.goal||'Focus on the single idea this question is testing.';
 if(kind==='example')return c?.examples?.[0]||'Use a new scenario and identify the clue that points to this concept.';
 if(kind==='mistakes')return c?.anchor?.trap||'Look for a distractor that uses a related term but does not match the scenario.';
 if(kind==='quiz')return 'Use the guided-practice stage to try a fresh question without affecting the mastery gate.';
 return '';
}
function qHtml(q,scope){
 if(!q)return '<div class="v346Empty">No question bank is available yet. Add study material and forge practice questions for this course.</div>';
 return '<article class="v346Question"><h3>'+E(q.prompt)+'</h3><div class="v346Options">'+q.options.map((o,i)=>'<button data-v346-answer="'+E(o)+'" data-scope="'+scope+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(o)+'</span></button>').join('')+'</div><div id="v346Feedback"></div></article>';
}
function ensureQuestion(scope,mixed=false){
 const st=state(),key=scope+':'+current().concept.id;
 st.currentQuestions=st.currentQuestions||{};
 let id=st.currentQuestions[key];
 let q=id&&byId(id);
 if(!q){q=qset(1,mixed)[0];if(q)st.currentQuestions[key]=q.id||q.qid}
 return q;
}
function stepBody(){
 const st=state(),step=Number(st.step||0),{lesson,concept}=current(),m=mastery();
 if(step===0)return '<small>① WHAT AM I LEARNING?</small><h2>'+E(concept.title||lesson.title)+'</h2><p class="lead">'+E(concept.teach||lesson.goal)+'</p>'+profileCard()+'<div class="v346GoalGrid"><span>Recognize it</span><span>Use it independently</span><span>Explain why</span><span>Avoid the trap</span><span>Retrieve it later</span></div><button class="btn primary" data-v346-next>Quick Check →</button>';
 if(step===1){
   const d=diagnostic(),qs=d.questions.map(byId).filter(Boolean);
   if(!qs.length)return '<small>② QUICK CHECK</small><h2>Diagnostic pending</h2><p>Add course questions and Majick will automatically create a 2–3 item diagnostic.</p><button class="btn primary" data-v346-next>Teach Me →</button>';
   return '<small>② QUICK CHECK • NOT GRADED</small><h2>What do you already know?</h2>'+qs.map((q,i)=>'<section class="v346Diag"><b>'+(i+1)+'. '+E(q.prompt)+'</b>'+q.options.map(o=>'<button data-v346-diag="'+i+'" data-choice="'+E(o)+'" '+(d.answers[i]?'disabled':'')+'>'+E(o)+'</button>').join('')+(d.answers[i]?'<p>'+E(q.why||'Use this feedback to decide what needs teaching.')+'</p>':'')+'</section>').join('')+(d.answers.filter(Boolean).length===qs.length?'<button class="btn primary" data-v346-next>Teach Me →</button>':'');
 }
 if(step===2)return '<small>③ TEACH ME</small><h2>'+E(concept.title||lesson.title)+'</h2><p class="lead">'+E(concept.teach||lesson.goal)+'</p><div class="v347ProfileGuide"><b>Best learning strategy for this concept</b><p>'+E(profileGuide())+'</p></div>'+tutorButtons()+'<button class="btn primary" data-v346-next>Show Me →</button>';
 if(step===3){
   const ex=concept?.worked?.scenario||concept?.examples?.[0]||concept.teach||lesson.goal,steps=concept?.worked?.steps||['Identify what the scenario is asking.','Name the concept or strategy.','Apply the rule.','Check the answer against the scenario.'];
   return '<small>④ SHOW ME • WATCH FIRST</small><h2>Worked example</h2><div class="v346Worked"><p>'+E(ex)+'</p><ol>'+steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></div>'+workedErrorHtml()+'<button class="btn primary" data-v346-next>Why does this work? →</button>';
 }
 if(step===4)return '<small>⑤ WHY DOES THIS WORK?</small><h2>Connect the rule to the meaning</h2><p class="lead">'+E(concept?.explain?.model||concept?.why||concept?.anchor?.trap||'Explain the reason the correct strategy fits this scenario, not just which answer is correct.')+'</p><button class="btn primary" data-v346-next>Help Me Try →</button>';
 if(step===5)return '<small>⑥ HELP ME TRY</small><h2>Guided practice</h2>'+qHtml(ensureQuestion('help'),'help');
 if(step===6){const q=ensureQuestion('turn');return '<small>⑦ MY TURN</small><h2>Try it independently</h2>'+(noMathUnlocked(q)?qHtml(q,'turn'):noMathYetHtml(q));}
 if(step===7){
   const counts=m.counts,cat=course().misconceptionCatalog||[];
   return '<small>⑧ RELATED MISTAKES</small><h2>Learn the tempting wrong answer</h2><div class="v346Mistakes">'+(concept?.anchor?.trap?'<p>⚠ '+E(concept.anchor.trap)+'</p>':'')+cat.slice(0,3).map(x=>'<p>⚠ '+E(x.description||x.label||x.title||String(x))+'</p>').join('')+Object.entries(counts).map(([k,v])=>'<span>'+E(k)+' • '+v+'×</span>').join('')+'</div><button class="btn primary" data-v346-next>Mix It Up →</button>';
 }
 if(step===8){const q=ensureQuestion('mix',true);return '<small>⑨ MIX IT UP</small><h2>Choose the strategy from the scenario</h2><p>Majick does not tell you which lesson this came from.</p>'+(noMathUnlocked(q)?qHtml(q,'mix'):noMathYetHtml(q));}
 if(step===9){
   const due=progress().spacedQueue.filter(x=>x.dueAt<=Date.now()),q=due.length?bank().find(x=>questionTopic(x)===String(due[0].topicId).replace('adaptive:','')):ensureQuestion('retrieve',true);
   return '<small>⑩ RETRIEVE IT</small><h2>No notes first</h2><p>Recall before rereading.</p>'+qHtml(q||ensureQuestion('retrieve',true),'retrieve');
 }
 if(step===10){
   const ckey=current().concept.id,check=st.checks[ckey]||(st.checks[ckey]={ids:qset(3).map(q=>q.id||q.qid),index:0,answers:[],done:false});
   if(check.done)return '<small>⑪ MASTERY GATE</small><h2>'+(m.ready?'Ready to advance':'Continue with review active')+'</h2>'+pathMeterHtml()+'<div class="v346Gate"><span><b>'+Math.round(m.acc*100)+'%</b> recent accuracy</span><span><b>'+m.independent+'</b> independent</span><span><b>'+m.transfer+'</b> transfer</span><span><b>'+(m.recurring?'Yes':'No')+'</b> recurring trap</span></div>'+masteryReceiptHtml()+'<p>'+(m.ready?'Mastery evidence is strong. The skill will still return later.':'You may continue. Majick will schedule more mixed and delayed retrieval instead of requiring 100%.')+'</p><button class="btn primary" data-v346-next>Schedule Review →</button>';
   const q=byId(check.ids[check.index]);
   return '<small>⑪ MASTERY CHECK • 3 ITEMS</small><h2>Prove it independently</h2>'+qHtml(q,'mastery');
 }
 const due=progress().spacedQueue.find(x=>x.topicId==='adaptive:'+current().concept.id);
 return '<small>⑫ SCHEDULE REVIEW</small><h2>Learning continues after the lesson</h2>'+pathMeterHtml()+'<p>Majick will bring this concept back in mixed practice and delayed retrieval.</p><div class="v346Review"><b>'+(due?'Next review '+new Date(due.dueAt).toLocaleDateString():'Schedule your first delayed review')+'</b><span>'+Math.round(m.acc*100)+'% recent accuracy • '+m.independent+' independent correct</span></div>'+masteryReceiptHtml()+'<button class="btn primary" data-v346-schedule>Schedule Review</button>';
}
function tutorButtons(){return '<div class="v346TutorButtons"><button data-v346-tutor="simple">Explain Simpler</button><button data-v346-tutor="example">Give Me an Example</button><button data-v346-tutor="quiz">Quiz Me on This Page</button><button data-v346-tutor="mistakes">Related Mistakes</button></div><div id="v346TutorOut"></div>'}
function panelHtml(){
 const {lesson,concept}=current(),g=guardian(),m=mastery();try{window.MajickLearningProfiles?.saveProfile?.(concept,lesson,cid())}catch(_){}
 return '<section class="v346SharedAdaptive"><header><div><small>SHARED LEARNING ENGINE • '+E(cid())+'</small><h1>'+E(concept.title||lesson.title)+'</h1><p>'+E(course().title||cid())+'</p>'+pathMeterHtml()+'</div><select id="v346Lesson">'+lessons().map((l,i)=>'<option value="'+i+'" '+(i===state().lessonIndex?'selected':'')+'>'+E(l.title)+'</option>').join('')+'</select></header><div class="v346Grid"><nav>'+STEPS.map((x,i)=>'<button data-v346-step="'+i+'" class="'+(i===state().step?'active':'')+'"><i>'+(i+1)+'</i><span>'+E(x)+'</span></button>').join('')+'</nav><main>'+stepBody()+'</main><aside><div class="v346Guardian"><span>'+g.emoji+'</span><b>'+E(g.name)+'</b><p>'+(m.recurring?'“I see a repeated trap. We are repairing that exact distinction.”':m.independent>=2?'“You are showing independence. I will give fewer cues unless you ask.”':'“Name the strategy before you answer. Recognition comes before recall.”')+'</p></div><div class="v346Evidence"><small>SKILL EVIDENCE</small><b>'+Math.round(m.acc*100)+'%</b><span>'+m.independent+' independent • '+m.transfer+' transfer</span></div></aside></div></section>';
}
function renderAdaptive(){const box=document.getElementById('adaptiveLearningCore');if(!box)return;box.innerHTML=panelHtml();bindAdaptive(box)}
function showAdaptive(){
 document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
 const panel=document.querySelector('.learnPanel[data-panel="adaptive"]');if(panel)panel.hidden=false;
 document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
 document.querySelector('[data-adaptive-tab="adaptive"]')?.classList.add('active');
 renderAdaptive();
}
function next(){state().step=Math.min(11,Number(state().step||0)+1);state().currentQuestions={};save();renderAdaptive()}
function handleAnswer(scope,choice){
 const q=ensureQuestion(scope,scope==='mix'||scope==='retrieve');if(!q)return;
 const ok=record(q,choice,'adaptive-'+scope,{assisted:scope==='help',transfer:scope==='mix'});
 const fb=document.getElementById('v346Feedback');if(fb)fb.innerHTML='<div class="v346Feedback '+(ok?'ok':'repair')+'"><b>'+(ok?'✓ Correct':'Repair this reasoning')+'</b><p>'+E(q.why||'Compare the wording of the scenario to the definition or rule.')+'</p></div>';
 if(scope==='mastery'){
   const ck=current().concept.id,c=state().checks[ck];c.answers.push(ok);if(c.index<2)c.index++;else c.done=true;save();setTimeout(renderAdaptive,350);return;
 }
 if(ok&&['help','turn','mix','retrieve'].includes(scope)){delete state().currentQuestions[scope+':'+current().concept.id];save();setTimeout(next,350)}
}
function bindAdaptive(root){
 root.querySelector('#v346Lesson')?.addEventListener('change',e=>{state().lessonIndex=Number(e.target.value)||0;state().conceptIndex=0;state().step=0;state().currentQuestions={};save();renderAdaptive()});
 root.querySelectorAll('[data-v346-step]').forEach(b=>b.addEventListener('click',()=>{state().step=Number(b.dataset.v346Step);save();renderAdaptive()}));
 root.querySelector('[data-v346-next]')?.addEventListener('click',next);
 root.querySelectorAll('[data-v346-answer]').forEach(b=>b.addEventListener('click',()=>handleAnswer(b.dataset.scope,b.dataset.v346Answer)));
 root.querySelectorAll('[data-v346-diag]').forEach(b=>b.addEventListener('click',()=>{const d=diagnostic(),i=Number(b.dataset.v346Diag),q=byId(d.questions[i]);if(d.answers[i])return;d.answers[i]={choice:b.dataset.choice,correct:String(b.dataset.choice)===String(q?.answer)};save();renderAdaptive()}));
 root.querySelectorAll('[data-v346-tutor]').forEach(b=>b.addEventListener('click',()=>{const out=root.querySelector('#v346TutorOut');if(out)out.innerHTML='<div class="v346TutorCard">'+E(tutorText(b.dataset.v346Tutor))+'</div>';if(b.dataset.v346Tutor==='quiz'){state().step=5;save();renderAdaptive()}}));
 root.querySelector('[data-v346-schedule]')?.addEventListener('click',()=>{const days=scheduleReview();root.querySelector('[data-v346-schedule]').textContent='✓ Review scheduled in '+days+' days'});
 root.querySelectorAll('[data-v347-nomath-choice]').forEach(b=>b.addEventListener('click',()=>{
   const q=ensureQuestion(state().step===8?'mix':'turn',state().step===8),k=q?.id||q?.qid;if(!k)return;state().noMath=state().noMath||{};state().noMath[k]=state().noMath[k]||{testing:'',info:'',strategy:'',unlocked:false};
   const field=b.dataset.v347NomathChoice;state().noMath[k][field]=b.dataset.value;
   b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
   const btn=root.querySelector('[data-v347-unlock]'),x=state().noMath[k];if(btn)btn.disabled=!(x.testing&&x.info&&x.strategy);save();
 }));
 root.querySelectorAll('[data-v347-word]').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('selected')));
 root.querySelector('[data-v347-unlock]')?.addEventListener('click',()=>{
   const q=ensureQuestion(state().step===8?'mix':'turn',state().step===8),k=q?.id||q?.qid;if(!k)return;state().noMath[k].unlocked=true;creditMicro(['recognize','select'],true);save();renderAdaptive();
 });
 root.querySelector('[data-v347-show-error]')?.addEventListener('click',()=>{const p=root.querySelector('[data-v347-error]');if(p)p.hidden=false});
}
function patch(){
 if(!window.MajickLearningLab||window.MajickLearningLab.__sharedAdaptive)return;
 const baseRender=window.MajickLearningLab.render;
 window.MajickLearningLab.render=function(){
   let h=baseRender();
   h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-adaptive-tab="adaptive">Adaptive Learn</button>');
   h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="adaptive" hidden><div id="adaptiveLearningCore"></div></section>');
   return h;
 };
 const baseBind=window.MajickLearningLab.bind;
 window.MajickLearningLab.bind=function(){
   baseBind();
   document.querySelector('[data-adaptive-tab="adaptive"]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();showAdaptive()});
   setTimeout(()=>{if(window.S?.screen==='learninglab')showAdaptive()},180);
 };
 window.MajickLearningLab.__sharedAdaptive=true;
}
patch();
window.MajickAdaptiveLearning={VERSION,STEPS,lessons,current,mastery,microDefs,microReceipt,learningPath,activeProfile,show:showAdaptive,render:renderAdaptive,state,progress};
document.documentElement.dataset.majickAdaptiveLearning=VERSION;
})();