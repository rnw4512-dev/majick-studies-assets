(()=>{
'use strict';
const VERSION='3.4.10-shared-adaptive';
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
const PREREQUISITES={
 D772:{
  'expected-value':[['probability','Understands probability'],['percent-decimal','Converts percent ↔ decimal'],['signs','Uses positive/negative values'],['multiply','Multiplies decimals'],['interpret','Interprets results in context']],
  'empirical-probability':[['numerator','Identifies target outcomes'],['denominator','Identifies total trials'],['divide','Divides'],['round','Rounds decimals']],
  'theoretical-probability':[['favorable','Counts favorable outcomes'],['total','Counts the sample space'],['divide','Divides'],['convert','Converts fraction/decimal/percent']],
  'union':[['recognize','Recognizes OR'],['overlap','Understands overlap']],
  'intersection':[['recognize','Recognizes AND'],['overlap','Understands overlap']],
  'complement':[['recognize','Recognizes NOT'],['whole','Understands probability whole = 1'],['subtract','Subtracts decimals']],
  'five-number-summary':[['order','Orders data'],['median','Finds median'],['quartiles','Finds quartiles']]
 }
};
const ASSESSMENT_LANGUAGE=[
 ['most appropriate','Choose the option that best fits the stated goal or condition, not merely one that could work.'],
 ['best supports','Look for the evidence or action that most directly supports the claim or need.'],
 ['most likely','Compare probabilities or evidence; do not treat it as certainty.'],
 ['not','Reverse the target: identify what does NOT fit.'],
 ['except','Most options fit; choose the one that does not.'],
 ['simultaneously','Both conditions must occur at the same time.'],
 ['on average','Think long-run mean or expected result, not one trial.'],
 ['approximately','A rounded or estimated answer is expected.']
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
 p.adaptiveLearning=p.adaptiveLearning||{lessonIndex:0,step:0,diagnostics:{},checks:{},support:{},currentQuestion:null,microSkills:{},path:{},workedErrors:{},confidence:{},supportEvents:[],branches:{},sessionSeen:[],lastVisit:0};
 const st=p.adaptiveLearning;
 for(const key of ['diagnostics','checks','support','microSkills','path','workedErrors','confidence','branches','currentQuestions']){
   if(!st[key]||typeof st[key]!=='object'||Array.isArray(st[key]))st[key]={};
 }
 for(const key of ['supportEvents','sessionSeen'])if(!Array.isArray(st[key]))st[key]=[];
 p.misconceptionMemory=p.misconceptionMemory&&typeof p.misconceptionMemory==='object'?p.misconceptionMemory:{};
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
 const ms=microState(),arr=Array.isArray(ids)?ids:[ids],at=Date.now(),conceptId=current().concept.id;
 arr.filter(Boolean).forEach(id=>{
   if(!ms[id])ms[id]={attempts:0,correct:0,support:0,lastAt:0};
   const before=ms[id].attempts>=2&&(ms[id].correct/ms[id].attempts)>=.85;
   ms[id].attempts++;if(correct)ms[id].correct++;if(support)ms[id].support++;ms[id].lastAt=at;
   const after=ms[id].attempts>=2&&(ms[id].correct/ms[id].attempts)>=.85;
   if(!before&&after)try{window.MajickRewardCore?.award?.('micro-skill-mastered',{key:'micro:'+cid()+':'+conceptId+':'+id,course:cid(),conceptId,microSkill:id})}catch(_){}
 });
 save();
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

function workedComparisonHtml(){
 const c=current().concept,examples=Array.isArray(c?.examples)?c.examples.filter(Boolean):[];
 const a=examples[0]||c?.worked?.scenario||c?.teach||current().lesson.goal;
 const b=examples[1]||('A second scenario uses the same underlying idea but changes the context or values.');
 if(!a)return '';
 return '<div class="v349CompareWorked"><small>COMPARE TWO EXAMPLES</small><div><article><b>Example A</b><p>'+E(a)+'</p></article><article><b>Example B</b><p>'+E(b)+'</p></article></div><section><button data-v349-compare="same">What stayed the same?</button><button data-v349-compare="changed">What changed?</button><button data-v349-compare="decision">Why could the answer/decision change?</button></section><p data-v349-compare-out></p></div>';
}
function compareWorkedAnswer(kind){
 if(kind==='same')return 'The underlying concept, relationship, or formula stays the same.';
 if(kind==='changed')return 'The numbers, context, wording, or conditions can change even when the strategy stays the same.';
 return 'A different probability, value, condition, or evidence can change the final result even when the method stays the same.';
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
 const seen=new Set((progress()?.answers||[]).map(a=>String(a.qid||'')));
 const fresh=pool.filter(q=>!seen.has(String(q.id||q.qid||'')));
 return shuffled(fresh).slice(0,n);
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
 const independent=rows.filter(x=>x.correct&&!x.assisted&&/adaptive-(turn|retrieve|mastery)/.test(x.source||x.mode||'')).length;
 const transfer=rows.filter(x=>x.correct&&!x.assisted&&(x.transfer===true||x.source==='adaptive-mix')).length;
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
 let misconception=null;
 if(!ok){
   const tag=inferError(q,choice);misconception=rememberMisconception(q,choice);
   progress().errorTags.push({conceptId:current().concept.id,tag,misconception,at,qid:q.id||q.qid});
 }else{
   repairMisconceptionIfEarned(q,choice,{assisted,transfer});
 }
 save();return {ok,misconception};
}
function inferError(q,choice){
 const c=current().concept,text=String(q?.why||'')+' '+String(c?.anchor?.trap||'');
 if(/formula|equation|calculate|probab|mean|median|range|expected|quartile|percent/i.test(text))return 'calculation/setup';
 if(/both|not|or|and|distinguish|difference|compare/i.test(text))return 'concept distinction';
 return 'scenario recognition';
}
function misconceptionKey(q,choice){
 const text=(String(q?.prompt||'')+' '+String(q?.why||'')+' '+String(choice||'')).toLowerCase();
 if(/denominator|total trials/.test(text))return 'wrong denominator';
 if(/expected value|lose|loss|negative/.test(text))return 'loss treated as positive';
 if(/\bor\b|union/.test(text))return 'union / OR confusion';
 if(/\band\b|intersection/.test(text))return 'intersection / AND confusion';
 if(/\bnot\b|complement/.test(text))return 'complement / NOT confusion';
 if(/round|hundredth/.test(text))return 'rounding too early / incorrectly';
 if(/percent|decimal/.test(text))return 'percent-decimal conversion';
 return inferError(q,choice);
}
function rememberMisconception(q,choice){
 const p=progress(),key=misconceptionKey(q,choice),row=p.misconceptionMemory[key]||{count:0,concepts:{},lastAt:0};
 row.count++;row.concepts[current().concept.id]=(row.concepts[current().concept.id]||0)+1;row.lastAt=Date.now();p.misconceptionMemory[key]=row;return key;
}
function repairMisconceptionIfEarned(q,choice,{assisted=false,transfer=false}={}){
 const p=progress(),key=misconceptionKey(q,choice),row=p.misconceptionMemory?.[key];
 if(!row||Number(row.count||0)<2||row.repairedAt||assisted)return null;
 const recent=conceptAnswers().slice(-5),independentCorrect=recent.filter(x=>x.correct&&!x.assisted).length;
 if(independentCorrect<2&&!transfer)return null;
 row.repairedAt=Date.now();row.repairedConcept=current().concept.id;
 try{window.MajickRewardCore?.award?.('misconception-repaired',{key:'repair:'+cid()+':'+key,course:cid(),conceptId:current().concept.id,misconception:key,independent:true,transfer})}catch(_){}
 return key;
}
function rewardMasteryMilestones(){
 const {lesson,concept}=current(),m=mastery();
 if(!m.ready)return;
 try{window.MajickRewardCore?.award?.('concept-mastered',{key:'concept:'+cid()+':'+concept.id,course:cid(),conceptId:concept.id,lessonId:lesson.id})}catch(_){}
 const ids=(lesson.concepts||[]).map(c=>typeof c==='string'?c:c?.id).filter(Boolean);
 if(ids.length){
   const ledger=window.S?.majickAccount?.rewardCore?.ledger||{};
   const all=ids.every(id=>ledger['concept:'+cid()+':'+id]);
   if(all)try{window.MajickRewardCore?.award?.('lesson-mastered',{key:'lesson:'+cid()+':'+lesson.id,course:cid(),lessonId:lesson.id})}catch(_){}
 }
}

function misconceptionMemoryHtml(){
 const rows=misconceptionSummary().slice(0,5);if(!rows.length)return '';
 return '<div class="v349MisMemory"><b>Misconception Memory</b><p>Majick remembers repeated error patterns across lessons.</p>'+rows.map(x=>'<span class="'+(x.count>=3?'hot':'')+'"><strong>'+E(x.key)+'</strong><small>'+x.count+' times across '+x.conceptCount+' concept'+(x.conceptCount===1?'':'s')+'</small></span>').join('')+'</div>';
}

function misconceptionSummary(){
 return Object.entries(progress().misconceptionMemory||{}).map(([key,v])=>({key,count:Number(v.count||0),conceptCount:Object.keys(v.concepts||{}).length,lastAt:v.lastAt||0})).sort((a,b)=>b.count-a.count);
}
function supportEvent(kind){
 const st=state();st.supportEvents=Array.isArray(st.supportEvents)?st.supportEvents:[];st.supportEvents.push({conceptId:current().concept.id,kind,at:Date.now()});st.supportEvents=st.supportEvents.slice(-160);save();
}
function supportLevel(){
 const m=mastery(),events=(state().supportEvents||[]).filter(x=>x.conceptId===current().concept.id),recent=events.filter(x=>Date.now()-x.at<14*86400000);
 const delayed=(conceptAnswers()||[]).filter(x=>x.correct&&!x.assisted&&x.source==='adaptive-retrieve').length;
 if(delayed>=1&&m.independent>=2)return {level:4,label:'Delayed no-help',pct:100};
 if(m.independent>=2&&recent.length<=1)return {level:3,label:'No help',pct:80};
 if(m.acc>=.75&&recent.length<=3)return {level:2,label:'Formula / cue only',pct:60};
 if(m.acc>=.55)return {level:1,label:'Partial scaffold',pct:40};
 return {level:0,label:'Full scaffold',pct:20};
}
function supportMeterHtml(){
 const x=supportLevel();
 return '<div class="v349SupportFade"><small>SUPPORT-FADING MASTERY</small><div><i style="width:'+x.pct+'%"></i></div><b>'+E(x.label)+'</b><span>Full scaffold → partial → formula/cue → no help → delayed no-help</span></div>';
}
function conceptKeyNorm(){return normId(current().concept?.id||current().concept?.title)}
function prereqDefs(){
 const key=conceptKeyNorm(),map=PREREQUISITES[cid()]||{};
 for(const [k,v] of Object.entries(map)){if(key.includes(k)||k.includes(key))return v}
 return [];
}
function prereqStatus(){
 const defs=prereqDefs(),ms=microState();
 return defs.map(([id,label])=>{const r=ms[id]||{},acc=r.attempts?r.correct/r.attempts:0;return{id,label,attempts:r.attempts||0,accuracy:acc,status:!r.attempts?'unknown':acc>=.75?'ready':'weak'}});
}
function prereqHtml(){
 const rows=prereqStatus();if(!rows.length)return '';
 const weak=rows.filter(x=>x.status==='weak'||x.status==='unknown');
 return '<div class="v349Prereq"><b>Prerequisite Map</b><p>These are the foundation skills feeding this concept.</p><div>'+rows.map(x=>'<span class="'+x.status+'"><i>'+(x.status==='ready'?'✓':x.status==='weak'?'!':'?')+'</i>'+E(x.label)+'</span>').join('')+'</div>'+
 (weak.length?'<aside><strong>Mini-reteach branch</strong><p>'+E(weak.slice(0,2).map(x=>x.label).join(' + '))+' needs a quick repair before the harder version.</p></aside>':'<aside class="ready"><strong>Prerequisites look ready.</strong><p>Majick can fade support faster.</p></aside>')+'</div>';
}
function diagnosticBranch(){
 const d=diagnostic(),done=d.answers.filter(Boolean);if(!done.length)return null;
 const correct=done.filter(x=>x.correct).length,total=d.questions.length||done.length,ratio=total?correct/total:0,pre=prereqStatus(),weak=pre.filter(x=>x.status==='weak');
 if(weak.length)return {to:2,label:'Prerequisite rescue',reason:'A foundation skill needs repair before this concept.'};
 if(ratio===1)return {to:6,label:'Fast track',reason:'Quick Check shows strong recognition. Skip directly to independent use.'};
 if(ratio>=.67)return {to:3,label:'Brief model',reason:'You mostly know this. Watch one model, then practice.'};
 return {to:2,label:'Full teaching path',reason:'The concept needs explicit teaching and guided practice.'};
}
function branchCardHtml(){
 const b=diagnosticBranch();if(!b)return '';
 return '<div class="v349Branch"><small>ADAPTIVE PATH</small><b>'+E(b.label)+'</b><p>'+E(b.reason)+'</p></div>';
}
function recordConfidence(level){
 const st=state(),p=st.pendingAnswer;if(!p)return;
 st.confidence=st.confidence||{};st.confidence[p.qid]=st.confidence[p.qid]||[];
 st.confidence[p.qid].push({level,correct:p.correct,conceptId:current().concept.id,at:Date.now()});
 if(p.correct&&level==='guessing')scheduleReview();
 if(!p.correct&&level==='very-sure'){const key=p.misconception||'high-confidence error';const row=progress().misconceptionMemory[key]||{count:0,concepts:{},lastAt:0};row.count+=2;row.concepts[current().concept.id]=(row.concepts[current().concept.id]||0)+1;row.lastAt=Date.now();progress().misconceptionMemory[key]=row}
 const scope=p.scope;st.pendingAnswer=null;save();
 if(p.correct&&['help','turn','mix','retrieve'].includes(scope)){delete st.currentQuestions[scope+':'+current().concept.id];next();return}
 renderAdaptive();
}
function confidenceHtml(){
 const p=state().pendingAnswer;if(!p)return '';
 return '<div class="v349Confidence"><b>How sure were you?</b><p>This changes what Majick reviews later.</p><div><button data-v349-confidence="guessing">Guessing</button><button data-v349-confidence="somewhat">Somewhat sure</button><button data-v349-confidence="very-sure">Very sure</button></div></div>';
}

function guardianPersona(){
 const name=String(guardian().name||'').toLowerCase();
 if(/velora/.test(name))return {style:'precise',opening:'Let’s identify the exact distinction before we answer.',success:'You named the rule and used it independently.'};
 if(/cascade/.test(name))return {style:'playful',opening:'Let’s turn the clue into a pattern you can spot again.',success:'You caught the pattern without me giving it away.'};
 if(/solstice/.test(name))return {style:'questioning',opening:'What evidence in the question tells you which path to take?',success:'You followed the evidence instead of guessing.'};
 if(/aurelia/.test(name))return {style:'steady',opening:'One step at a time: meaning first, then method.',success:'You kept the reasoning organized from start to finish.'};
 if(/vesper/.test(name))return {style:'minimal',opening:'Find the clue. Name the strategy. Then move.',success:'Clean recognition. No extra help needed.'};
 if(/briar/.test(name))return {style:'contrast',opening:'What tempting wrong answer is this question trying to pull you toward?',success:'You avoided the trap and chose from meaning.'};
 if(/zephyr/.test(name))return {style:'visual',opening:'Picture the relationship before calculating.',success:'The structure made sense before the numbers did.'};
 if(/prism/.test(name))return {style:'connections',opening:'Which earlier idea connects to this one?',success:'You connected the new problem to what you already know.'};
 if(/rook/.test(name))return {style:'strategy',opening:'What is the shortest correct route through this problem?',success:'Efficient and correct—strategy before arithmetic.'};
 if(/solara/.test(name))return {style:'encouraging',opening:'Use the support you need, then let it fade.',success:'You needed less support this time—that matters.'};
 return {style:'balanced',opening:'Name the strategy before you answer. Recognition comes before recall.',success:'You solved it with stronger independence.'};
}

function guardianMode(){
 const x=supportLevel(),m=mastery();
 if(x.level>=3&&m.independent>=2)return {silent:true,text:'I’m staying quiet unless you ask. Independence is the goal.'};
 if(x.level===2)return {silent:false,text:'I’ll give you a small cue, not the answer.'};
 if(x.level===1)return {silent:false,text:'I’ll ask a question that points you toward the next step.'};
 return {silent:false,text:'I’ll model the thinking and then hand more of it back to you.'};
}
function guardianCoachHtml(){
 const g=guardian(),gm=guardianMode(),m=mastery(),persona=guardianPersona();
 const line=m.recurring?'I recognize a repeated trap across your work. We are repairing that pattern, not just this question.':gm.silent?'I’m staying quiet unless you ask. Independence is the goal.':persona.opening;
 return '<div class="v346Guardian '+(gm.silent?'silent':'')+'" data-persona="'+E(persona.style)+'"><span>'+g.emoji+'</span><b>'+E(g.name)+'</b><small>'+E(persona.style.toUpperCase())+' TUTOR</small><p>'+E(line)+'</p></div>';
}
function languageHtml(q){
 if(!q)return '';
 const text=String(q.prompt||'').toLowerCase(),hits=ASSESSMENT_LANGUAGE.filter(([phrase])=>text.includes(phrase));
 if(!hits.length)return '';
 return '<div class="v349Language"><b>Assessment Language</b>'+hits.map(([p,x])=>'<p><strong>'+E(p)+'</strong><span>'+E(x)+'</span></p>').join('')+'</div>';
}
function deconstructHtml(q){
 if(!q)return '';
 const text=String(q.prompt||''),nums=text.match(/-?\$?\d+(?:\.\d+)?%?|(?:\d+\s*\/\s*\d+)/g)||[],clues=ASSESSMENT_LANGUAGE.map(x=>x[0]).filter(x=>text.toLowerCase().includes(x)).concat(['or','and','not','average','total','both'].filter(x=>text.toLowerCase().includes(x)));
 return '<details class="v349Deconstruct"><summary>Deconstruct this question</summary><div><span><b>Context</b>'+E(text.slice(0,180))+'</span><span><b>Important numbers</b>'+E([...new Set(nums)].join(', ')||'None')+'</span><span><b>Clue words</b>'+E([...new Set(clues)].join(', ')||'Read the task verb carefully')+'</span><span><b>Actual task</b>'+E((text.split(/[?.!]/).filter(Boolean).pop()||text).trim())+'</span></div></details>';
}
function explainBackHtml(){
 const c=current().concept,correct=c?.why||c?.teach||current().lesson.goal||'The strategy matches the relationship described in the scenario.';
 const opts=[correct,'Because it was the most recent rule practiced.','Because the largest number should usually be used.','Because every probability question uses the same operation.'];
 return '<div class="v349ExplainBack"><b>Explain-it-back check</b><p>Which explanation best captures WHY this strategy works?</p>'+opts.map((x,i)=>'<button data-v349-explain="'+(i===0?'correct':'wrong')+'">'+E(x)+'</button>').join('')+'<div data-v349-explain-out></div></div>';
}
function transferLadderHtml(){
 const m=mastery(),rows=[
  ['Familiar example',(state().step||0)>=4],
  ['New numbers',m.independent>=1],
  ['New context',m.independent>=2],
  ['Mixed concept',m.transfer>=1],
  ['Unfamiliar transfer',m.transfer>=2]
 ];
 return '<div class="v349Transfer"><b>Transfer Ladder</b>'+rows.map(([x,on])=>'<span class="'+(on?'done':'')+'"><i>'+(on?'✓':'○')+'</i>'+E(x)+'</span>').join('')+'</div>';
}
function microHeatmapHtml(){
 const rows=microReceipt();if(!rows.length)return '';
 return '<div class="v349Heatmap"><b>Micro-Skill Heatmap</b><div>'+rows.map(x=>'<span class="'+(x.status==='Strong'?'strong':x.status==='Developing'?'developing':x.status==='Needs support'?'weak':'unseen')+'"><i></i>'+E(x.label)+'<small>'+x.accuracy+'%</small></span>').join('')+'</div></div>';
}
function recoveryInfo(){
 const st=state(),days=Number(st.recoveryGapDays||0);
 return {due:days>=3,days};
}
function recoveryHtml(){
 const r=recoveryInfo();if(!r.due)return '';
 return '<div class="v349Recovery"><b>Welcome back • '+r.days+' days away</b><p>Before resuming, do a short recall check so Majick can decide whether to continue or refresh.</p><button data-v349-recovery="check">2-minute recall check</button><button data-v349-recovery="resume">Resume where I left off</button></div>';
}

function memorySweep(){
 const st=state();st.memorySweep=st.memorySweep||{};
 const key=current().lesson.id;
 if(!st.memorySweep[key]||!Array.isArray(st.memorySweep[key].ids)||!st.memorySweep[key].ids.length){
   st.memorySweep[key]={ids:qset(4,true).map(q=>q.id||q.qid),answers:{}};
 }
 return st.memorySweep[key];
}
function memorySweepHtml(){
 const sw=memorySweep(),qs=sw.ids.map(byId).filter(Boolean).slice(0,4);
 if(!qs.length)return '';
 return '<div class="v349Sweep"><b>End-of-Session Memory Sweep</b><p>Retrieve before you leave. At least one item may come from an older concept.</p>'+qs.map((q,i)=>'<section><strong>'+(i+1)+'. '+E(q.prompt)+'</strong><div>'+q.options.map(o=>'<button data-v349-sweep="'+E(q.id||q.qid)+'" data-value="'+E(o)+'" '+(sw.answers[q.id||q.qid]?'disabled':'')+'>'+E(o)+'</button>').join('')+'</div>'+(sw.answers[q.id||q.qid]?'<small class="'+(sw.answers[q.id||q.qid].correct?'ok':'bad')+'">'+(sw.answers[q.id||q.qid].correct?'✓ Retrieved':'Review: '+E(q.why||'Revisit this concept tomorrow.'))+'</small>':'')+'</section>').join('')+'</div>';
}

function tomorrowQueue(){
 const p=progress(),dueSoon=p.spacedQueue.filter(x=>x.dueAt&&x.dueAt<=Date.now()+36*3600000).length,weak=microReceipt().filter(x=>x.status==='Needs support').length,m=mastery();
 return {delayed:dueSoon,weak,mixed:m.transfer<1?1:0};
}
function tomorrowHtml(){
 const q=tomorrowQueue();
 return '<div class="v349Tomorrow"><b>Tomorrow Queue</b><span>'+q.delayed+' delayed recalls</span><span>'+q.weak+' weak micro-skills</span><span>'+q.mixed+' mixed transfer question'+(q.mixed===1?'':'s')+'</span></div>';
}

function competencyGroups(){
 const ls=lessons(),groups={};
 for(const l of ls){
   const id=String(l.id||''),m=id.match(/(?:section|sec|s)[-_ ]?(\d+)/i),name=m?'Section '+m[1]:(l.section||l.title||'Course');
   groups[name]=groups[name]||{lessons:[],answers:[]};groups[name].lessons.push(l);
 }
 const rows=progress().answers||[];
 for(const [name,g] of Object.entries(groups)){
   const keys=g.lessons.flatMap(l=>[String(l.id||'').toLowerCase(),String(l.title||'').toLowerCase()]).filter(Boolean);
   g.answers=rows.filter(a=>{const t=String(a.topicId||a.qid||'').toLowerCase();return keys.some(k=>k&&t.includes(k))});
 }
 return groups;
}
function competencyReadinessHtml(){
 const groups=competencyGroups(),rows=Object.entries(groups).slice(0,8).map(([name,g])=>{
   const recent=g.answers.slice(-20),acc=recent.length?recent.filter(x=>x.correct).length/recent.length:0,ind=recent.filter(x=>x.correct&&!x.assisted).length,mix=recent.filter(x=>x.correct&&/mix|sweep|retrieve/.test(x.source||'')).length;
   const score=Math.round((acc*.55+Math.min(1,ind/4)*.25+Math.min(1,mix/2)*.20)*100);
   return {name,score,evidence:recent.length};
 });
 if(!rows.length)return '';
 return '<div class="v349Competency"><b>OA Readiness by Competency</b><p>Readiness combines accuracy, independence, and mixed/delayed evidence—not completion alone.</p>'+rows.map(x=>'<div><span>'+E(x.name)+'</span><i><em style="width:'+x.score+'%"></em></i><strong>'+x.score+'%</strong><small>'+x.evidence+' evidence points</small></div>').join('')+'</div>';
}

function readinessHtml(){
 const m=mastery(),micro=microReceipt(),strong=micro.filter(x=>x.status==='Strong').length,total=micro.length||1,support=supportLevel(),score=Math.round((m.acc*.35+Math.min(1,m.independent/2)*.2+Math.min(1,m.transfer)*.2+(strong/total)*.15+(support.level>=3?1:.5)*.1)*100);
 const label=score>=85&&m.ready?'OA-ready evidence':'Still building OA evidence';
 return '<div class="v349Readiness"><small>OA READINESS • CURRENT CONCEPT</small><b>'+score+'% • '+E(label)+'</b><p>'+(m.ready?'You have accuracy, independence, transfer, and low recurring-error evidence.':'Majick still needs stronger independent or transfer evidence before calling this ready.')+'</p></div>';
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
 if(!q){const recent=new Set((progress()?.answers||[]).filter(a=>a.topicId==='adaptive:'+current().concept.id).map(a=>String(a.qid||'')));
 const candidates=(mixed?bank():bank().filter(matchesCurrent)).filter(x=>!recent.has(String(x.id||x.qid||'')));
 q=shuffled(candidates)[0]||(!st.recoveryActive?qset(1,mixed)[0]:null);if(q)st.currentQuestions[key]=q.id||q.qid}
 return q;
}
function stepBody(){
 const st=state(),step=Number(st.step||0),{lesson,concept}=current(),m=mastery();
 const recovery=step===0?recoveryHtml():'';
 const targeted=st.recoveryActive===concept.id?'<div class="v349Recovery"><b>Targeted recovery</b><p>Review the explanation and worked example. When ready, answer a new independent question; guided work will not award mastery.</p><button type="button" data-maj-reassess>Try a fresh independent question</button></div>':'';
 if(step===0)return recovery+'<small>① WHAT AM I LEARNING?</small><h2>'+E(concept.title||lesson.title)+'</h2><p class="lead">'+E(concept.teach||lesson.goal)+'</p>'+profileCard()+'<div class="v346GoalGrid"><span>Recognize it</span><span>Use it independently</span><span>Explain why</span><span>Avoid the trap</span><span>Retrieve it later</span></div><button class="btn primary" data-v346-next>Quick Check →</button>';
 if(step===1){
   const d=diagnostic(),qs=d.questions.map(byId).filter(Boolean);
   if(!qs.length)return '<small>② QUICK CHECK</small><h2>Diagnostic pending</h2><p>Add course questions and Majick will automatically create a 2–3 item diagnostic.</p><button class="btn primary" data-v346-next>Teach Me →</button>';
   return '<small>② QUICK CHECK • NOT GRADED</small><h2>What do you already know?</h2>'+prereqHtml()+qs.map((q,i)=>'<section class="v346Diag"><b>'+(i+1)+'. '+E(q.prompt)+'</b>'+q.options.map(o=>'<button data-v346-diag="'+i+'" data-choice="'+E(o)+'" '+(d.answers[i]?'disabled':'')+'>'+E(o)+'</button>').join('')+(d.answers[i]?'<p>'+E(q.why||'Use this feedback to decide what needs teaching.')+'</p>':'')+'</section>').join('')+(d.answers.filter(Boolean).length===qs.length?branchCardHtml()+'<button class="btn primary" data-v349-branch>Follow My Best Path →</button>':'');
 }
 if(step===2)return targeted+'<small>③ TEACH ME</small><h2>'+E(concept.title||lesson.title)+'</h2>'+prereqHtml()+'<p class="lead">'+E(concept.teach||lesson.goal)+'</p><div class="v347ProfileGuide"><b>Best learning strategy for this concept</b><p>'+E(profileGuide())+'</p></div>'+tutorButtons()+supportMeterHtml()+'<button class="btn primary" data-v346-next>Show Me →</button>';
 if(step===3){
   const ex=concept?.worked?.scenario||concept?.examples?.[0]||concept.teach||lesson.goal,steps=concept?.worked?.steps||['Identify what the scenario is asking.','Name the concept or strategy.','Apply the rule.','Check the answer against the scenario.'];
   return '<small>④ SHOW ME • WATCH FIRST</small><h2>Worked example</h2><div class="v346Worked"><p>'+E(ex)+'</p><ol>'+steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></div>'+workedComparisonHtml()+workedErrorHtml()+'<button class="btn primary" data-v346-next>Why does this work? →</button>';
 }
 if(step===4)return '<small>⑤ WHY DOES THIS WORK?</small><h2>Connect the rule to the meaning</h2><p class="lead">'+E(concept?.explain?.model||concept?.why||concept?.anchor?.trap||'Explain the reason the correct strategy fits this scenario, not just which answer is correct.')+'</p>'+explainBackHtml()+'<button class="btn primary" data-v346-next>Help Me Try →</button>';
 if(step===5)return '<small>⑥ HELP ME TRY</small><h2>Guided practice</h2>'+qHtml(ensureQuestion('help'),'help');
 if(step===6){const q=ensureQuestion('turn');return '<small>⑦ MY TURN</small><h2>Try it independently</h2>'+(noMathUnlocked(q)?qHtml(q,'turn'):noMathYetHtml(q));}
 if(step===7){
   const counts=m.counts,cat=course().misconceptionCatalog||[];
   return '<small>⑧ RELATED MISTAKES</small><h2>Learn the tempting wrong answer</h2>'+misconceptionMemoryHtml()+'<div class="v346Mistakes">'+(concept?.anchor?.trap?'<p>⚠ '+E(concept.anchor.trap)+'</p>':'')+cat.slice(0,3).map(x=>'<p>⚠ '+E(x.description||x.label||x.title||String(x))+'</p>').join('')+Object.entries(counts).map(([k,v])=>'<span>'+E(k)+' • '+v+'×</span>').join('')+'</div><button class="btn primary" data-v346-next>Mix It Up →</button>';
 }
 if(step===8){const q=ensureQuestion('mix',true);return '<small>⑨ MIX IT UP</small><h2>Choose the strategy from the scenario</h2><p>Majick does not tell you which lesson this came from.</p>'+transferLadderHtml()+languageHtml(q)+deconstructHtml(q)+(noMathUnlocked(q)?qHtml(q,'mix'):noMathYetHtml(q));}
 if(step===9){
   const due=progress().spacedQueue.filter(x=>x.dueAt<=Date.now()),q=due.length?bank().find(x=>questionTopic(x)===String(due[0].topicId).replace('adaptive:','')):ensureQuestion('retrieve',true);
   return '<small>⑩ RETRIEVE IT</small><h2>No notes first</h2><p>Recall before rereading.</p>'+supportMeterHtml()+qHtml(q||ensureQuestion('retrieve',true),'retrieve');
 }
 if(step===10){
   const ckey=current().concept.id,check=st.checks[ckey]||(st.checks[ckey]={ids:qset(3).map(q=>q.id||q.qid),index:0,answers:[],done:false});
   if(check.done)return '<small>⑪ MASTERY GATE</small><h2>'+(m.ready?'Ready to advance':'Continue with review active')+'</h2>'+pathMeterHtml()+supportMeterHtml()+microHeatmapHtml()+transferLadderHtml()+readinessHtml()+'<div class="v346Gate"><span><b>'+Math.round(m.acc*100)+'%</b> recent accuracy</span><span><b>'+m.independent+'</b> independent</span><span><b>'+m.transfer+'</b> transfer</span><span><b>'+(m.recurring?'Yes':'No')+'</b> recurring trap</span></div>'+masteryReceiptHtml()+'<p>'+(m.ready?'Mastery evidence is strong. The skill will still return later.':'You may continue. Majick will schedule more mixed and delayed retrieval instead of requiring 100%.')+'</p><button class="btn primary" data-v346-next>Schedule Review →</button>';
   const q=byId(check.ids[check.index]);
   return '<small>⑪ MASTERY CHECK • 3 ITEMS</small><h2>Prove it independently</h2>'+qHtml(q,'mastery');
 }
 const due=progress().spacedQueue.find(x=>x.topicId==='adaptive:'+current().concept.id);
 return '<small>⑫ SCHEDULE REVIEW</small><h2>Learning continues after the lesson</h2>'+pathMeterHtml()+tomorrowHtml()+readinessHtml()+competencyReadinessHtml()+memorySweepHtml()+'<p>Majick will bring this concept back in mixed practice and delayed retrieval.</p><div class="v346Review"><b>'+(due?'Next review '+new Date(due.dueAt).toLocaleDateString():'Schedule your first delayed review')+'</b><span>'+Math.round(m.acc*100)+'% recent accuracy • '+m.independent+' independent correct</span></div>'+masteryReceiptHtml()+'<button class="btn primary" data-v346-schedule>Schedule Review</button>';
}
function tutorButtons(){return '<div class="v346TutorButtons"><button data-v346-tutor="simple">Explain Simpler</button><button data-v346-tutor="example">Give Me an Example</button><button data-v346-tutor="quiz">Quiz Me on This Page</button><button data-v346-tutor="mistakes">Related Mistakes</button></div><div id="v346TutorOut"></div>'}
function panelHtml(){
 const {lesson,concept}=current(),g=guardian(),m=mastery();try{window.MajickLearningProfiles?.saveProfile?.(concept,lesson,cid())}catch(_){};try{rewardMasteryMilestones()}catch(_){}
 return '<section class="v346SharedAdaptive"><header><div><small>SHARED LEARNING ENGINE • '+E(cid())+'</small><h1>'+E(concept.title||lesson.title)+'</h1><p>'+E(course().title||cid())+'</p>'+pathMeterHtml()+supportMeterHtml()+'</div><select id="v346Lesson">'+lessons().map((l,i)=>'<option value="'+i+'" '+(i===state().lessonIndex?'selected':'')+'>'+E(l.title)+'</option>').join('')+'</select></header><div class="v346Grid"><nav>'+STEPS.map((x,i)=>'<button data-v346-step="'+i+'" class="'+(i===state().step?'active':'')+'"><i>'+(i+1)+'</i><span>'+E(x)+'</span></button>').join('')+'</nav><main>'+stepBody()+'</main><aside><div class="v346Guardian"><span>'+g.emoji+'</span><b>'+E(g.name)+'</b><p>'+(m.recurring?'“I see a repeated trap. We are repairing that exact distinction.”':m.independent>=2?'“You are showing independence. I will give fewer cues unless you ask.”':'“Name the strategy before you answer. Recognition comes before recall.”')+'</p></div><div class="v346Evidence"><small>SKILL EVIDENCE</small><b>'+Math.round(m.acc*100)+'%</b><span>'+m.independent+' independent • '+m.transfer+' transfer</span></div></aside></div></section>';
}
if(!document.getElementById('majSkillLibraryStyles')){const e=document.createElement('style');e.id='majSkillLibraryStyles';e.textContent="\n.majSkillLibrary{margin:12px 0;padding:12px;border:1px solid #a887b6;border-radius:14px;background:#251831;color:#f7ebff}.majSkillLibrary summary{cursor:pointer;font-weight:800}.majSkillLibrary p{line-height:1.4}.majSkillList{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px;max-height:460px;overflow:auto;margin-top:12px}.majSkillItem{padding:12px;border:1px solid #9b82a9;border-radius:10px;background:#392848;display:flex;flex-direction:column;justify-content:space-between;gap:10px}.majSkillItem small{display:block;color:#e8d4f3;margin-top:4px}.majSkillItem button{background:#f1d6a0;color:#2b1936;border-radius:8px;padding:10px;font-weight:800;cursor:pointer}.majSkillItem button:focus-visible{outline:3px solid #fff}\n";document.head.appendChild(e)}
function resolveD772Skill(q){
 if(cid()!=='D772'||!q)return null;
 const rows=lessons(),concepts=rows.flatMap((l,li)=>(l.concepts||[]).map((c,ci)=>({c,l,li,ci})));
 const ids=[q.conceptId,q.skillId,q.topicId,q.learningPathConceptId].filter(Boolean).map(v=>String(v).replace(/^adaptive:/,''));
 const exact=concepts.find(x=>ids.includes(String(x.c.id)));
 if(exact)return exact;
 const lessonId=String(q.learningPathLessonId||q.lessonId||'');
 const matching=concepts.filter(x=>String(x.l.id)===lessonId);
 return matching.length===1?matching[0]:null; // Never infer mastery from vague section labels.
}
function observeGameSkill(q,correct,mode){
 if(cid()!=='D772')return false;
 const found=resolveD772Skill(q);if(!found)return false;
 const p=progress(),key=String(q.id||q.qid||q.prompt||'').slice(0,180),stamp='game:'+String(mode||'practice')+':'+key;
 p.gameSkillEvidence=p.gameSkillEvidence||{};
 const rows=p.gameSkillEvidence[found.c.id]||[];
 if(rows.some(x=>x.key===stamp))return false;
 rows.push({key:stamp,correct:!!correct,mode:String(mode||'game'),at:Date.now(),assisted:true});
 p.gameSkillEvidence[found.c.id]=rows.slice(-100);
 if(!correct){
  p.errorTags.push({conceptId:found.c.id,tag:'game-reinforcement',at:Date.now(),qid:key,source:'game-realm'});
  p.adaptiveLearning.recoveryTargets=p.adaptiveLearning.recoveryTargets||{};
  p.adaptiveLearning.recoveryTargets[found.c.id]={at:Date.now(),qid:key,reason:'Missed Game Realm practice'};
 }
 save();return true;
}
function openSkillRecovery(conceptId){
 if(cid()!=='D772')return false;
 const found=lessons().flatMap((l,li)=>(l.concepts||[]).map((c,ci)=>({c,li,ci}))).find(x=>String(x.c.id)===String(conceptId));
 if(!found)return false;
 const st=state();st.lessonIndex=found.li;st.conceptIndex=found.ci;st.step=2;st.currentQuestions={};st.recoveryActive=conceptId;save();
 if(window.S?.screen!=='learninglab')window.navigate?.('learninglab');
 setTimeout(()=>{showAdaptive();renderAdaptive()},0);return true;
}
function skillLibraryHtml(){
 if(cid()!=='D772')return '';
 const st=state(),rows=lessons(),p=progress();
 const selected=current().concept.id;
 const entries=rows.flatMap((lesson,li)=>(lesson.concepts?.length?lesson.concepts:[{id:lesson.id,title:lesson.title,teach:lesson.teach}]).map((concept,ci)=>{
  const evidence=p.answers.filter(a=>a.topicId==='adaptive:'+concept.id);
  const independent=evidence.filter(a=>a.correct&&!a.assisted&&/adaptive-(turn|retrieve|mastery)/.test(a.source||a.mode||'')).length;
  const transfer=evidence.filter(a=>a.correct&&!a.assisted&&(a.transfer===true||a.source==='adaptive-mix')).length;
  const accuracy=evidence.length?Math.round(100*evidence.slice(-8).filter(a=>a.correct).length/Math.min(8,evidence.length)):null;
  const gameRows=p.gameSkillEvidence?.[concept.id]||[];
  const recovery=p.adaptiveLearning?.recoveryTargets?.[concept.id];
  const status=independent>=2&&transfer>=1&&accuracy!==null&&accuracy>=80?'Independent evidence met':independent?'Developing':'Not yet assessed';
  const example=concept.examples?.[0];const exampleText=typeof example==='string'?example:(example?.prompt||example?.question||'');
  return '<article class="majSkillItem"><div><strong>'+E(concept.title||lesson.title)+'</strong><small>'+E(lesson.title)+' · '+status+'</small><p>'+E(concept.teach||lesson.goal||'Explore this skill with worked examples and practice.')+'</p>'+(exampleText?'<p><b>Example:</b> '+E(exampleText)+'</p>':'')+'<small>Independent correct: '+independent+' · Transfer: '+transfer+' · Recent accuracy: '+(accuracy===null?'Not assessed':accuracy+'%')+' · Game reinforcement: '+gameRows.filter(x=>x.correct).length+'/'+gameRows.length+'</small>'+(recovery?'<small>Recommended: review this skill, then try a fresh independent question.</small><button type="button" data-maj-recover="'+E(concept.id)+'">Review &amp; recover</button>':'')+'</div><button type="button" data-maj-skill="'+li+':'+ci+'">'+(selected===concept.id?'Continue practice':'Practice skill')+'</button></article>';
 })).join('');
 return '<details class="majSkillLibrary"><summary>Skill Library · All D772 concepts</summary><p>Choose any skill to practice. Your personalized recommendations and existing evidence are preserved.</p><div class="majSkillList">'+entries+'</div></details>';
}
function renderAdaptive(){const box=document.getElementById('adaptiveLearningCore');if(!box)return;box.innerHTML=skillLibraryHtml()+panelHtml();bindAdaptive(box)}
function showAdaptive(){
 // Later D772 sections use the existing verified lesson owner, not Section 1's adaptive bank.
 const tutor=window.MajickCourseTutor,selected=cid()==='D772'?tutor?.selectedLesson?.('D772'):null;
 if(cid()==='D772'&&!state().recoveryActive&&selected&&typeof tutor?.show==='function'){
   const panel=document.querySelector('.learnPanel[data-panel="tutor"]');
   if(!panel||panel.hidden)tutor.show('tutor');
   return;
 }
 const st=state(),was=Number(st.lastVisit||0);st.recoveryGapDays=was?Math.floor((Date.now()-was)/86400000):0;st.lastVisit=Date.now();save();
 document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
 const panel=document.querySelector('.learnPanel[data-panel="adaptive"]');if(panel)panel.hidden=false;
 document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
 document.querySelector('[data-adaptive-tab="adaptive"]')?.classList.add('active');
 renderAdaptive();
}
function next(){state().step=Math.min(11,Number(state().step||0)+1);state().currentQuestions={};save();renderAdaptive()}
function assistedScope(scope){return scope==='help'}
function handleAnswer(scope,choice){
 const q=ensureQuestion(scope,scope==='mix'||scope==='retrieve');if(!q)return;
 const result=record(q,choice,'adaptive-'+scope,{assisted:scope==='help',transfer:scope==='mix'}),ok=result.ok;
 state().pendingAnswer={qid:q.id||q.qid,scope,correct:ok,misconception:result.misconception||null};
 if(ok&&state().recoveryActive===current().concept.id&&!assistedScope(scope)){delete state().recoveryTargets?.[current().concept.id];state().recoveryActive=null;}
 const fb=document.getElementById('v346Feedback');if(fb)fb.innerHTML='<div class="v346Feedback '+(ok?'ok':'repair')+'"><b>'+(ok?'✓ Correct':'Repair this reasoning')+'</b><p>'+E(q.why||'Compare the wording of the scenario to the definition or rule.')+'</p></div>'+confidenceHtml();
 if(scope==='mastery'){
   const ck=current().concept.id,c=state().checks[ck];c.answers.push(ok);if(c.index<2)c.index++;else c.done=true;save();return;
 }
 save();
}
function bindAdaptive(root){
 root.querySelectorAll('[data-maj-recover]').forEach(b=>b.addEventListener('click',()=>openSkillRecovery(b.dataset.majRecover)));
 root.querySelector('[data-maj-reassess]')?.addEventListener('click',()=>{const st=state(),key='turn:'+current().concept.id;delete st.currentQuestions[key];st.step=7;save();renderAdaptive()});
 root.querySelectorAll('[data-maj-skill]').forEach(b=>b.addEventListener('click',()=>{const [li,ci]=b.dataset.majSkill.split(':').map(Number);state().lessonIndex=li;state().conceptIndex=ci;state().step=0;save();renderAdaptive()}));
 root.querySelector('#v346Lesson')?.addEventListener('change',e=>{state().lessonIndex=Number(e.target.value)||0;state().conceptIndex=0;state().step=0;state().currentQuestions={};save();renderAdaptive()});
 root.querySelectorAll('[data-v346-step]').forEach(b=>b.addEventListener('click',()=>{state().step=Number(b.dataset.v346Step);save();renderAdaptive()}));
 root.querySelector('[data-v346-next]')?.addEventListener('click',next);
 root.querySelectorAll('[data-v346-answer]').forEach(b=>b.addEventListener('click',()=>handleAnswer(b.dataset.scope,b.dataset.v346Answer)));
 root.querySelectorAll('[data-v346-diag]').forEach(b=>b.addEventListener('click',()=>{const d=diagnostic(),i=Number(b.dataset.v346Diag),q=byId(d.questions[i]);if(d.answers[i])return;d.answers[i]={choice:b.dataset.choice,correct:String(b.dataset.choice)===String(q?.answer)};save();renderAdaptive()}));
 root.querySelectorAll('[data-v346-tutor]').forEach(b=>b.addEventListener('click',()=>{supportEvent(b.dataset.v346Tutor);const out=root.querySelector('#v346TutorOut');if(out)out.innerHTML='<div class="v346TutorCard">'+E(tutorText(b.dataset.v346Tutor))+'</div>';if(b.dataset.v346Tutor==='quiz'){state().step=5;save();renderAdaptive()}}));
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
 root.querySelectorAll('[data-v349-compare]').forEach(b=>b.addEventListener('click',()=>{const out=root.querySelector('[data-v349-compare-out]');if(out)out.textContent=compareWorkedAnswer(b.dataset.v349Compare)}));
 root.querySelector('[data-v349-branch]')?.addEventListener('click',()=>{const b=diagnosticBranch();if(!b)return;state().branches[current().concept.id]={...b,at:Date.now()};state().step=b.to;save();renderAdaptive()});
 root.querySelectorAll('[data-v349-confidence]').forEach(b=>b.addEventListener('click',()=>recordConfidence(b.dataset.v349Confidence)));
 root.querySelectorAll('[data-v349-explain]').forEach(b=>b.addEventListener('click',()=>{const out=root.querySelector('[data-v349-explain-out]'),ok=b.dataset.v349Explain==='correct';if(out)out.innerHTML=ok?'<b>✓ Yes — that explains the reasoning.</b>':'<b>Not quite. Choose the explanation tied to the actual relationship in the problem.</b>';creditMicro('interpret',ok);save()}));
 root.querySelectorAll('[data-v349-recovery]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.v349Recovery==='check'){state().step=9}else{state().step=Math.max(2,Number(state().step||2))}save();renderAdaptive()}));
 root.querySelectorAll('[data-v349-sweep]').forEach(b=>b.addEventListener('click',()=>{
   const sw=memorySweep(),q=byId(b.dataset.v349Sweep),ok=String(b.dataset.value)===String(q?.answer);sw.answers[b.dataset.v349Sweep]={choice:b.dataset.value,correct:ok,at:Date.now()};
   record(q,b.dataset.value,'adaptive-session-sweep',{assisted:false,transfer:true});save();renderAdaptive();
 }));

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
window.MajickAdaptiveLearning={openSkillRecovery,resolveD772Skill,observeGameSkill,skillLibraryHtml,VERSION,STEPS,lessons,current,mastery,microDefs,microReceipt,learningPath,activeProfile,prereqStatus,misconceptionSummary,supportLevel,tomorrowQueue,memorySweep,guardianPersona,competencyGroups,show:showAdaptive,render:renderAdaptive,state,progress};
document.documentElement.dataset.majickAdaptiveLearning=VERSION;
})();

