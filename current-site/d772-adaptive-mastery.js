(()=>{'use strict';if(window.MajickD772AdaptiveMastery)return;
const B=()=>window.MajickD772PreassessmentReview?.questions||[];
const topics=[
{id:'representative',label:'Q9 · Representative samples',test:q=>q.id.includes('representative')||q.id.includes('rep-')||q.id.includes('generalization')||q.id.includes('frame-error')||q.id.includes('nonresponse'),misconception:'A large sample automatically represents the population.',repair:'Identify the target population, the selection frame, and who was excluded. A sample can be large but biased.',teacher:'A student says: “120 honors students is a big sample, so we can describe all 900 students.” What is the misconception and how would you teach the correction?',words:['sample','population','bias']},
{id:'exclusive',label:'Q49 · Mutually exclusive events',test:q=>/exclusive|disjoint|overlap|intersection|complement/.test(q.id),misconception:'Two events are mutually exclusive if they have different names or probabilities.',repair:'List outcomes in both sets. Mutually exclusive means their intersection is empty. Complements are disjoint and together cover the entire sample space.',teacher:'A student thinks two events are mutually exclusive because they have different labels, even though both contain outcome 4. Teach using a two-circle Venn model.',words:['overlap','event','intersection']},
{id:'venn',label:'Q50–53 · Venn, AND, OR, NOT',test:q=>/venn|intersection|union|not-|complement/.test(q.id),misconception:'AND, OR, and NOT all mean collecting the same outcomes.',repair:'AND = intersection (both), OR = union (either), NOT = complement (outside). Place outcomes in each Venn region before calculating.',teacher:'Explain how you would help a student sort outcomes into left-only, both, right-only, and neither regions.',words:['both','union','intersection']},
{id:'expected',label:'Q54–58 · Expected value',test:q=>/ev-|expected|decision|crust/.test(q.id),misconception:'The largest prize or the most likely outcome necessarily gives the best expected value.',repair:'Make an outcome table, multiply every value by its probability, and sum. Expected value is a long-run average, not a promised single result.',teacher:'A student chooses the highest prize without considering the odds. Demonstrate a probability-weighted calculation and a fair comparison.',words:['probability','multiply','average']},
{id:'dependent',label:'Q46–47 · Dependent events',test:q=>/dependent/.test(q.id),misconception:'The second draw has the same denominator after an item is removed.',repair:'After drawing without replacement, recount the remaining total and favorable outcomes. Multiply first-stage and conditional second-stage probabilities.',teacher:'Explain how the sample space changes after one marble is removed, then ask a transfer question.',words:['remaining','without','probability']}
];
const state=()=>{const p=window.S?.progress?.D772;if(!p)return null;return p.preassessmentAdaptiveMastery||(p.preassessmentAdaptiveMastery={version:1,topic:topics[0].id,cycles:{},history:[]})};
const save=()=>{try{if(typeof window.save==='function')window.save()}catch(e){console.warn('Adaptive mastery persistence:',e)}};
function bank(topic){const q=B().filter(topic.test);return q.length>=3?q:B().filter(x=>x.lessonId===({representative:'d772-s1-l1',exclusive:'d772-s3-l2',venn:'d772-s3-l2',expected:'d772-s3-l3',dependent:'d772-s3-l2'}[topic.id]))}
function cycle(topic){const s=state();if(!s)return null;return s.cycles[topic.id]||(s.cycles[topic.id]={stage:'diagnostic',attempts:[],serial:0,first:null,independent:null,transfer:null,teaching:null,status:'not-started'})}
function pick(topic,phase,c){const arr=bank(topic);if(!arr.length)return null;const excluded=new Set([c.first,c.independent,c.transfer]);const candidates=phase==='diagnostic'?arr:arr.filter(q=>!excluded.has(q.id));if(!candidates.length)return null;const offset=phase==='diagnostic'?0:phase==='independent'?1:2;return candidates[(c.serial+offset)%candidates.length]}
function reset(topic){const s=state(),prior=cycle(topic);if(!s||!prior)return;const serial=prior.serial+1;s.cycles[topic.id]={stage:'diagnostic',attempts:prior.attempts,serial,first:null,independent:null,transfer:null,teaching:null,status:'in-progress'};save()}
function answer(topic,selected){
 const c=cycle(topic),phase=c?.stage;if(!c||!['diagnostic','independent','transfer'].includes(phase))return null;
 const q=pick(topic,phase,c);if(!q)return {error:'No distinct question available for this step; please choose a different topic.'};
 const correct=Number(selected)===q.correct;
 const item={topic:topic.id,stage:phase,qid:q.id,selected:Number(selected),correct,questionRevision:q.revision||1,at:Date.now(),assisted:phase==='diagnostic'};
 c.attempts.push(item);state().history.push(item);
 if(phase==='diagnostic'){c.first=q.id;c.stage='repair';c.status='in-progress'}
 else if(!correct){c.stage='repair';c.status='needs-repair';c.independent=null;c.transfer=null;c.teaching=null;c.serial++;}
 else if(phase==='independent'){c.independent=q.id;c.stage='transfer'}
 else{c.transfer=q.id;c.stage='teaching'}
 save();return {correct,why:q.why,stage:c.stage,phase};
}
function next(topic){const c=cycle(topic);if(!c)return;if(c.stage==='repair'){c.stage='independent';c.status='in-progress';save()} }
function submitTeach(topic,text,diagnosis,action,probe){
 const c=cycle(topic);if(!c||c.stage!=='teaching')return {error:'Complete independent and transfer practice first.'};
 if(text.trim().length<100||!diagnosis||!action||!probe)return {error:'Write at least 100 characters and complete all three classroom reasoning checks.'};
 const correct=diagnosis==='misconception'&&action==='model-and-recheck'&&probe==='new-case';
 c.teaching={text:text.trim(),diagnosis,action,probe,checksCorrect:correct,at:Date.now(),status:correct?'evidence-awaiting-review':'revision-needed'};
 if(correct){c.stage='review';c.status='evidence-awaiting-review'}else{c.stage='teaching';c.status='revision-needed'}
 save();return {correct,why:correct?'Your independent responses, transfer result, and teaching evidence are saved. The written explanation awaits review; mastery is not automatically certified.':'Check your instructional response: diagnose the error, model a correction, and use a fresh independent exit question.'};
}
function render(){
 if(window.S?.activeCourse!=='D772'||window.S?.screen!=='home')return;
 const parent=document.querySelector('#mjPreassessmentReview');if(!parent||parent.querySelector('#mjAdaptiveMastery'))return;
 const s=state();if(!s)return;
 const el=document.createElement('section');el.id='mjAdaptiveMastery';el.style.cssText='padding:16px;margin-top:18px;background:#fff9ee;color:#271b2d;border:2px solid #917158;border-radius:10px';
 el.innerHTML='<h4>Adaptive mastery · Diagnose → Repair → Prove → Teach</h4><p>Guided explanations never earn independent mastery. Each new independent answer uses a different question from the diagnostic. After mistakes, repair the reasoning and retry on a fresh question.</p><label for="mjAdaptiveTopic">Choose a skill from your actual pre-assessment</label><select id="mjAdaptiveTopic"></select><p data-am-status role="status" aria-live="polite"></p><div data-am-work></div>';
 parent.append(el);const select=el.querySelector('select'),work=el.querySelector('[data-am-work]'),status=el.querySelector('[data-am-status]');
 topics.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.label;select.append(o)});
 select.value=topics.some(t=>t.id===s.topic)?s.topic:topics[0].id;
 const button=(label,cb)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='padding:10px 12px;margin:8px 8px 8px 0;border-radius:7px;border:2px solid #9f84a0;background:#392748;color:#fffaf0;cursor:pointer';b.addEventListener('click',cb);work.append(b);return b};
 const line=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;e.style.cssText='color:#271b2d;line-height:1.6';work.append(e);return e};
 const topic=()=>topics.find(t=>t.id===select.value)||topics[0];
 function draw(){
  const t=topic(),c=cycle(t);work.replaceChildren();
  status.textContent='Current step: '+c.stage+' · '+c.attempts.length+' saved attempts · '+c.status;
  if(['diagnostic','independent','transfer'].includes(c.stage)){
   const q=pick(t,c.stage,c);if(!q){line('p','Not enough distinct practice cases for this cycle. Select another skill.');return}
   line('h5',c.stage==='diagnostic'?'Diagnose the starting skill':c.stage==='independent'?'Independent reasoning · no hints':'Transfer to a different case · no hints');
   line('p',q.prompt);
   const group=document.createElement('fieldset');group.setAttribute('aria-label',q.prompt);group.style.cssText='border:0;padding:0';work.append(group);
   q.choices.forEach((choice,i)=>{const label=document.createElement('label');label.style.cssText='display:block;padding:6px;color:#271b2d';const radio=document.createElement('input');radio.type='radio';radio.name='mjAdaptiveChoice';radio.value=String(i);label.append(radio,document.createTextNode(' '+String.fromCharCode(65+i)+'. '+choice));group.append(label)});
   button('Submit '+c.stage+' answer',()=>{const v=group.querySelector('input:checked');if(!v){status.textContent='Choose an answer before submitting.';return}const r=answer(t,v.value);if(r?.error){status.textContent=r.error;return}draw();const p=line('p',(r.correct?'Correct. ':'Not yet. ')+r.why);p.setAttribute('role','status')});
  }else if(c.stage==='repair'){
   line('h5','Guided misconception repair');
   line('p','Common trap: '+t.misconception);line('p','Professor walkthrough: '+t.repair);
   const example=bank(t).find(q=>q.id===c.first)||bank(t)[0];
   if(example)line('p','Worked example: '+example.why);
   button('I understand · try a NEW independent question',()=>{next(t);draw()});
  }else if(c.stage==='teaching'){
   line('h5','Teach it back to a future student');line('p',t.teacher);
   const label=line('label','Write how you would diagnose the mistake, model the correction, and check transfer (at least 100 characters):');
   const ta=document.createElement('textarea');ta.id='mjAdaptiveTeaching';label.htmlFor=ta.id;ta.rows=6;ta.style.cssText='display:block;width:100%;padding:8px;background:#fff;color:#271b2d;border:1px solid #735a70';ta.value=c.teaching?.text||'';work.append(ta);
   const selects=[['diagnosis',[['','Identify the type of error'],['misconception','Diagnose the underlying misconception'],['ignore','Ignore the error']]],['action',[['','Choose instructional response'],['model-and-recheck','Model a worked example and recheck'],['repeat-answer','Tell them the correct option']]],['probe',[['','Choose transfer check'],['new-case','Ask a new independent case'],['same-answer','Repeat the memorized answer']]]].map(([key,items])=>{const se=document.createElement('select');se.setAttribute('aria-label',key);se.style.cssText='display:block;margin:8px 0;max-width:100%;color:#271b2d;background:#fff';items.forEach(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;se.append(o)});se.value=c.teaching?.[key]||'';work.append(se);return se});
   button('Save teaching evidence',()=>{const r=submitTeach(t,ta.value,...selects.map(x=>x.value));if(r.error){status.textContent=r.error;return}draw();line('p',r.why)});
  }else{
   line('h5','Evidence collected · awaiting review');
   line('p','Independent reasoning, transfer, and classroom explanation are saved. This is NOT certified mastery until the quality of your written teaching is reviewed. Start another cycle for extra practice.');
   button('Start another fresh cycle',()=>{reset(t);draw()});
  }
 }
 select.addEventListener('change',()=>{s.topic=select.value;save();draw()});draw();
}
window.MajickD772AdaptiveMastery={version:'1.0',topics,state,cycle,bank,pick,answer,next,submitTeach,reset,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-adaptive-mastery',render,82);window.MajickRenderQueue.schedule()}else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1400)}
})();
