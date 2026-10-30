/* Shared question-aware teaching. Existing continuity/reconstruction own progress. */
(()=>{'use strict';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TITLES=['Your Answer','Correct Answer','Mistake Diagnosis','Remember','Reconstruct','Visualize','Fix Your Approach','Try Again'];
function choice(q,value){const options=q.options||q.choices||[];return String(typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<options.length?options[value]:value??'No answer recorded')}
function normalize(q){const answer=q.answer??q.correctIndex??q.correct;return {...q,prompt:String(q.prompt||q.question||''),answer:choice(q,answer),why:q.why||q.rationale||'',lessonId:q.learningPathLessonId||q.lessonId||q.topicId||window.MajickLearningContinuity?.identify?.(q.prompt||q.question||'')}}
function numbers(q){
 const raw=Array.isArray(q.data)?q.data:q.data?.values||q.data?.numbers||q.numbers;
 if(Array.isArray(raw)&&raw.length&&raw.every(x=>typeof x==='number'&&Number.isFinite(x)))return raw;
 if(/after|added|raises?|missing|should have|change|corrected|sixth|fifth/i.test(q.prompt))return null;
 const m=q.prompt.match(/(?:data set|data values|values are|numbers are|scores are|minutes[^:]*:)\s*:?\s*(-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){1,})/i);
 return m?m[1].split(',').map(Number):null;
}
function median(values){const a=[...values].sort((a,b)=>a-b),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2}
function specificRepair(raw,selected){
 const q=normalize(raw),prompt=q.prompt,text=(q.skill||'')+' '+prompt,nums=numbers(q),correct=choice(q,q.answer),chosen=choice(q,selected);
 let rule='',worked=[],result=null,visual='',givens=null;
 const data=q.data||{},count=prompt.match(/(?:prepares|using|with|contains|has)\s+(\d+)\s+green[^.]*?and\s+(\d+)\s+purple/i);
 if(['green-green','green-purple'].includes(q.event)&&/without replacement|dependent-probability/i.test(text)&&((Array.isArray(data)&&data.length===2)||count)){
  const [g,p]=Array.isArray(data)?data:[Number(count[1]),Number(count[2])],n=g+p;
  const purple=q.event==='green-purple'||/green (?:first|and then|then).*purple|recorder second|purple second/i.test(prompt.replace(/^.*?\?/,''));
  const second=purple?p:g-1;
  if(g>=1&&p>=0&&n>1){
   rule='P(A and B) = P(A) × P(B | A). Without replacement, update the second sample space.';
   worked=[`${g} green + ${p} purple = ${n} total.`,`P(green first) = ${g}/${n}.`,`After a green is removed: ${g-1} green + ${p} purple = ${n-1} total.`,`P(${purple?'purple':'green'} second | green first) = ${second}/${n-1}.`,`${g}/${n} × ${second}/${n-1} = ${g*second}/${n*(n-1)} = ${g*second/(n*(n-1))}.`];
   result=g*second/(n*(n-1));givens=[g,p];
   visual=`<table><caption>Sample spaces in this question</caption><tr><th scope="col">Stage</th><th scope="col">Green</th><th scope="col">Purple</th><th scope="col">Total</th></tr><tr><th scope="row">Before first draw</th><td>${g}</td><td>${p}</td><td>${n}</td></tr><tr><th scope="row">After removing green</th><td>${g-1}</td><td>${p}</td><td>${n-1}</td></tr></table>`;
  }
 }else if(nums&&(!q.skill||['mean','median','range','boxplot'].includes(q.skill))&&/mean|average|median|range|boxplot|quartile|IQR/i.test(text)){
  const sorted=[...nums].sort((a,b)=>a-b),sum=nums.reduce((a,b)=>a+b,0),n=nums.length;givens=nums;
  if(q.skill==='median'||!q.skill&&/median/i.test(text)){result=median(nums);rule='Order every observation; use the middle value, or average the two middle values.';worked=[`Ordered observations: ${sorted.join(', ')}.`,n%2?`Position (${n} + 1) ÷ 2 = ${(n+1)/2}; median = ${result}.`:`Middle values: ${sorted[n/2-1]} and ${sorted[n/2]}; median = (${sorted[n/2-1]} + ${sorted[n/2]}) ÷ 2 = ${result}.`]}
  else if((q.skill==='boxplot'||!q.skill&&/boxplot|quartile|IQR/i.test(text))&&n>=4){const half=Math.floor(n/2),q1=median(sorted.slice(0,half)),q3=median(sorted.slice(n-half));result=q3-q1;rule='IQR = Q3 − Q1. Use median-of-halves, excluding the middle observation for odd sample sizes.';worked=[`Ordered observations: ${sorted.join(', ')}.`,`Q1 = ${q1}; Q3 = ${q3}.`,`IQR = ${q3} − ${q1} = ${result}.`]}
  else if(q.skill==='range'||!q.skill&&/range/i.test(text)){result=sorted[n-1]-sorted[0];rule='Range = maximum − minimum.';worked=[`Minimum = ${sorted[0]}; maximum = ${sorted[n-1]}.`,`Range = ${sorted[n-1]} − ${sorted[0]} = ${result}.`]}
  else {result=sum/n;rule='Arithmetic mean = sum of all observations ÷ number of observations.';worked=[`${nums.join(' + ')} = ${sum}.`,`Count = ${n}.`,`Mean = ${sum} ÷ ${n} = ${result}.`]}
  visual=`<table><caption>Actual observations, in order</caption><tr><th scope="col">Position</th>${sorted.map((_,i)=>`<th scope="col">${i+1}</th>`).join('')}</tr><tr><th scope="row">Value</th>${sorted.map(v=>`<td>${v}</td>`).join('')}</tr></table>`;
 }else if(/icon|pictograph|symbol/i.test(prompt)&&/twice|doubl/i.test(prompt)&&/height|tall/i.test(prompt)&&/width|wide/i.test(prompt)){
  rule='Area = height × width; compare the area multiplier with the reported data multiplier.';result=4;givens=[1,1,2,2];worked=['Original relative area = 1 × 1 = 1.','Doubled height and width: (2 × 1) × (2 × 1) = 4.','The data doubled (×2), but the area quadrupled (×4): the picture exaggerates the change.'];
  visual='<svg role="img" aria-label="Original relative area one square; doubled height and width create four squares" viewBox="0 0 300 140"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="45" width="40" height="40"/><rect x="130" y="25" width="80" height="80"/><path d="M170 25V105M130 65H210"/></g><g fill="currentColor"><text x="15" y="125">1 unit²</text><text x="130" y="125">4 units², not 2</text></g></svg>';
 }
 const authored=q.workedExample?.steps;
 if(!worked.length&&Array.isArray(authored)&&authored.every(s=>typeof s==='string'))worked=authored;
 if(!rule)rule=q.rule||q.formula||q.wguClue||q.keyClue||q.why;
 if(!worked.length)worked=[`Question: ${prompt}`,`Correct conclusion: ${correct}.`,q.why].filter(Boolean);
 const optionCoach=q.choiceCoach?.[chosen]||q.distractorRationales?.[chosen];
 const diagnosis=optionCoach?`For the selected option “${chosen}”: ${optionCoach}`:`“${chosen}” does not match “${correct}”. The selection alone does not establish how you reasoned.`;
 const diagnostic=`In “${prompt}”, which ${givens?'values and operation':'specific words or graph features'} led you to choose “${chosen}”? ${givens?'Write your setup before calculating.':'Identify the evidence you used, then compare it with the conclusion.'}`;
 if(!visual){const evidence=window.MajickVisualEvidence?.evidence?.(q,x=>window.MajickWGUPractice?.visualHtml?.(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'');visual=evidence?.ok&&evidence.html?evidence.html:q.visualHtml||''}
 if(!visual)visual=`<table><caption>Evidence map for the actual question</caption><tr><th scope="row">Scenario</th><td>${E(prompt)}</td></tr><tr><th scope="row">Supported conclusion</th><td>${E(correct)}</td></tr><tr><th scope="row">Evidence to inspect</th><td>${E(q.why||q.keyClue||q.wguClue||diagnostic)}</td></tr></table>`;
 return {question:q,chosen,correct,clue:q.keyClue||q.wguClue||prompt,rule,worked,result,givens,visual,diagnosis,diagnostic,diagnosisConfirmed:false,reviewNeeded:!q.why&&!rule};
}
function evidenceKey(raw){const q=normalize(raw),m=specificRepair(q,'');let data=q.data??q.transferEvidence??q.scenarioEvidence??m.givens??q.visual;const numeric=q.prompt.match(/-?\d+(?:\.\d+)?/g);if(data==null&&numeric?.length)data=numeric.map(Number).sort((a,b)=>a-b);if(data==null)return null;if(Array.isArray(data)&&/^(mean|median|range|boxplot)$/.test(q.skill||'')&&data.every(Number.isFinite))data=[...data].sort((a,b)=>a-b);const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).filter(k=>!['id','wording','prompt','serial','questionId'].includes(k)).sort().map(k=>[k,stable(x[k])])):x;return JSON.stringify(stable(data))}
function isFresh(source,candidate){const a=evidenceKey(source),b=evidenceKey(candidate);return !!a&&!!b&&a!==b&&String(source.id)!==String(candidate.id)}
let attemptSequence=0;
function recordWrong(raw,selected,{assisted=false,alreadyRecorded=false,room='practice'}={}){
 const q=normalize(raw);window.MajickLearningContinuity?.practiceAnswer?.(q,false,alreadyRecorded,choice(q,selected),{assisted,origin:room,attemptId:Date.now()+':'+(++attemptSequence)});
 return q;
}
function html(raw,selected){
 const m=specificRepair(raw,selected),q=m.question,id=String(q.id||q.qid||''),recovery=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
 const work=m.worked.map(s=>`<li>${E(s)}</li>`).join('');
 const result=m.result==null?'':`<label>Reconstruct the result using this question’s givens<input data-shared-result inputmode="decimal" aria-label="Your guided calculation" /></label><button type="button" data-shared-check="${E(m.result)}">Check this guided calculation</button><p data-shared-status role="status" aria-live="polite"></p>`;
 const parts=[`<p>${E(m.chosen)}</p>`,`<p>${E(m.correct)}</p><p>${E(q.why)}</p>`,`<p>${E(m.diagnosis)}</p><label>${E(m.diagnostic)}<textarea rows="2" aria-label="Explain the evidence behind your choice"></textarea></label><p>Your reasoning is not automatically diagnosed or graded from prose.</p>`,`<p>${E(m.rule||m.diagnostic)}</p>`,`<ol>${work}</ol>${result}<p>Guided reconstruction never awards independent mastery.</p>`,m.visual,`<p>Compare your setup with ${E(m.worked[0])} Then check ${E(m.rule||q.why)} Conclude ${E(m.correct)} using the question’s units and conditions.</p>`,`<p>${recovery?.required?'Two mistakes on this skill require guided reconstruction before independent transfer.':'Use changed numbers, graph data or scenario evidence for the next independent challenge.'}</p><button type="button" data-shared-retry="${E(encodeURIComponent(id))}">${recovery?.required?'Complete mandatory reconstruction':'Try a fresh independent challenge'}</button><p>Repeating the explanation or rewording the same givens cannot establish mastery.</p>`];
 return `<section class="aetheriaQuestionRepair v342Repair majTrialGuided" data-repair-question="${E(id)}" aria-label="Question-specific eight-step repair"><h4 tabindex="-1">Repair this question</h4><p>${E(q.prompt)}</p>${parts.map((p,i)=>`<details${i===0?' open':''}><summary>${i+1} · ${TITLES[i]}</summary>${p}</details>`).join('')}</section>`;
}
function sourceFor(id){try{if(typeof session!=='undefined'&&String(session?.current?.id)===id)return normalize(session.current)}catch(_){}const p=window.S?.progress?.[window.S.activeCourse];return Object.values(p?.adaptiveSkills||{}).flatMap(r=>Object.values(r.reconstructionBySkill||{})).map(r=>r.source).find(q=>q&&String(q.id||q.qid||'')===id)}
document.addEventListener('click',event=>{
 const check=event.target.closest?.('[data-shared-check]');
 if(check){const pane=check.closest('.aetheriaQuestionRepair'),value=pane.querySelector('[data-shared-result]').value.trim(),fraction=value.split('/'),actual=fraction.length===2?Number(fraction[0])/Number(fraction[1]):Number(value),expected=Number(check.dataset.sharedCheck);pane.querySelector('[data-shared-status]').textContent=value&&Number.isFinite(actual)&&Math.abs(actual-expected)<1e-9?'The result matches this question’s reconstructed calculation. This is guided practice, not mastery.':`Your result “${value}” does not match the displayed calculation. Rebuild its substitutions and compare with ${expected}.`;return}
 const button=event.target.closest?.('[data-shared-retry]');if(!button)return;
 const q=sourceFor(decodeURIComponent(button.dataset.sharedRetry));if(!q)return;
 const r=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
 if(r?.required){window.MajickWGUPractice?.openRequiredRecovery?.(q)}else window.MajickWGUPractice?.startRepairTransfer?.(q);
});
function workshopQuestion(task,ex,stage,answers){
 let expected;
 if(task.kind==='math')expected=stage===0?(task.id==='mean'?`sum=${ex.numbers.reduce((a,b)=>a+b,0)}; count=${ex.numbers.length}; statistic=mean`:ex.known):stage===1?task.formula:stage===2?ex.slots.join('; '):stage===3||stage===5?String(ex.answer):ex.interpret;
 else if(task.kind==='graph')expected=stage===0?String(ex.freq.length):stage===1||stage===5?ex.freq.join('; '):stage===2?ex.mode:stage===3?String(ex.total):ex.interpret;
 else expected=stage===1?ex.parts[ex.correct[0]]:stage===2||stage===5?ex.correct.map(i=>ex.parts[i]).join(' → '):ex.reason||ex.interpret||task.objective;
 return {id:'workshop:'+task.id+':'+JSON.stringify(ex)+':'+stage,courseId:window.S?.activeCourse,lessonId:task.lessonId||task.lesson,skill:task.id,prompt:`${ex.prompt||ex.known||task.title} · Step ${stage+1}: ${task.title}`,answer:String(expected),why:ex.why||ex.interpret||ex.reason||task.objective,rule:task.formula,data:ex.numbers||ex.slots||{frequencies:ex.freq,parts:ex.parts},selected:Object.entries(answers).map(([k,v])=>k+'='+String(v)).join('; ')};
}
function reconstructionPlan(raw){const m=specificRepair(raw,'');if(!m.question.why)return [];return [{title:'Reconstruct the evidence in this actual question',text:m.question.prompt,answer:m.question.why,choices:[m.question.why,'The answer follows from the topic label alone.']},{title:'Connect that evidence to the conclusion',text:m.worked.join(' '),answer:m.correct,choices:[...new Set([m.correct,...(m.question.options||m.question.choices||[]).map(String)])]}]}
// Legacy Study Hall questions retain their existing session/progress owner.
// Only the incorrect-answer presentation is redirected to the shared teacher.
if(typeof feedbackHTML==='function'){
 const previousFeedback=feedbackHTML;
 feedbackHTML=function(){
  if(typeof session!=='undefined'&&session?.answered&&session.current&&session.chosen!==session.current.answer)return html(session.current,session.chosen)+'<button type="button" class="btn primary" onclick="MajickWGUPractice.continueAfterRepair()">Continue after repair →</button>';
  return previousFeedback.apply(this,arguments);
 };
}
window.MajickQuestionRepair=Object.freeze({workshopQuestion,reconstructionPlan,specificRepair,html,normalize,choice,evidenceKey,isFresh,recordWrong,titles:TITLES});
})();
