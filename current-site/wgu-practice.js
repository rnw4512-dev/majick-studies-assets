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
function boardStore(){const c=String(window.S?.activeCourse||'D772');window.S.progress=window.S.progress||{};const p=window.S.progress[c]=window.S.progress[c]||{};return p.questionWhiteboards=p.questionWhiteboards||{}}
function saveBoard(id,field,value){if(!['clue','setup','work','check'].includes(field))return;const store=boardStore(),r=store[id]||{};r[field]=String(value).slice(0,6000);r.updatedAt=Date.now();store[id]=r;try{window.save?.()}catch(_){}}
function questionBoard(q){
 const id=String(q.id||q.qid||q.prompt||'unknown').slice(0,220),row=boardStore()[id]||{};
 const fields=[['clue','What does the question ask?'],['setup','Formula or diagram setup'],['work','Calculations and reasoning'],['check','Estimate and answer with units']];
 return '<details class="v342Whiteboard" style="padding:1rem;margin:1rem 0;border:1px solid #ad8c55;border-radius:12px;background:#fff7e8;color:#342944"><summary>✎ My whiteboard · autosaved</summary><p>Saved with this question. Notes never award mastery.</p>'+fields.map(([k,l])=>'<label style="display:block;margin:.5rem 0"><b>'+E(l)+'</b><textarea style="width:100%;min-height:68px;display:block" data-v342-field="'+k+'" data-v342-key="'+encodeURIComponent(id)+'">'+E(row[k]||'')+'</textarea></label>').join('')+'</details>';
}
function specificRepair(q,chosen){
 const prompt=String(q.prompt||''),lower=prompt.toLowerCase(),id=String(q.misconceptionId||'').toLowerCase();
 const counts=prompt.match(/(?:using|with)\s+(\d+)\s+green[^.]*?and\s+(\d+)\s+purple/i);
 if((id.includes('sample-space')||/without replacement/.test(lower))&&counts){
  const green=Number(counts[1]),purple=Number(counts[2]),total=green+purple;
  const secondPurple=/recorder second|purple second|green.*purple/.test(lower);
  const second=secondPurple?purple:green-1;
  const numerator=green*second,denominator=total*(total-1);
  return {clue:'The cards are drawn without replacement. The first draw changes the number of cards available for the second draw.',rule:'For dependent events, multiply the first probability by the conditional probability of the second event.',worked:['Before the first draw: '+green+' green and '+purple+' purple cards; '+total+' total.','P(green first) = '+green+'/'+total+'.','After removing a green: '+(green-1)+' green, '+purple+' purple, '+(total-1)+' total.','P('+(secondPurple?'purple':'green')+' second | green first) = '+second+'/'+(total-1)+'.','Multiply: '+green+'/'+total+' × '+second+'/'+(total-1)+' = '+numerator+'/'+denominator+'. Reduce if needed and compare with the answer choices.'],mistake:'Keeping the original denominator on the second draw incorrectly treats dependent draws as independent.'};
 }
 if(/\bmedian\b/.test(lower))return {clue:'The question asks for the median, not the mean.',rule:'Order the observations and select the middle value; for an even count average the two middle values.',mistake:'Adding all values and dividing by the count answers a mean question instead.'};
 if(/\bmean\b|\baverage\b/.test(lower))return {clue:'The question asks for the arithmetic mean.',rule:'Add every observed value and divide by the number of observations.',mistake:'Selecting the middle value would calculate the median, not the mean.'};
 if(/\bsampling\b|\bselection bias\b|\bconvenience sample\b/.test(lower))return {clue:'Identify how participants entered the sample and who had no chance to be selected.',rule:'A sampling method is judged by its selection process, not merely by the number of respondents.',mistake:'A large sample can still be biased if the selection process excludes part of the population.'};
 if(/\bscatterplot\b|\bcorrelation\b/.test(lower))return {clue:'Look for the direction and strength of the association between two quantitative variables.',rule:'Association alone does not establish that one variable causes the other.',mistake:'A trend in a scatterplot cannot independently prove causation.'};
 return null;
}
function exactWorked(q){
 const tailored=specificRepair(q,'');
 if(tailored?.worked?.length)return '<ol>'+tailored.worked.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>';
 const verified=q?.workedExample;
 if(verified&&Array.isArray(verified.steps)&&verified.steps.length&&verified.steps.every(x=>typeof x==='string'))return '<ol>'+verified.steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>';
 const prompt=String(q?.prompt||''),m=prompt.match(/(?:data set|data values|values are|numbers are)\s*:?\s*(-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){2,})(?=[.?!\s]|$)/i);
 if(!m)return '<p>This question needs a verified list of numbers before a question-specific calculation can be generated. Copy the givens to your whiteboard and choose a method.</p>';
 const nums=m[1].split(',').map(Number);
 if(nums.some(x=>!Number.isFinite(x))||nums.length>30)return '<p>Use the whiteboard to verify the data set before calculating.</p>';
 const sorted=[...nums].sort((a,b)=>a-b),sum=nums.reduce((a,b)=>a+b,0),n=nums.length,txt=prompt.toLowerCase();
 let steps=[];
 if(/\bmedian\b/.test(txt)){const v=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;steps=['Sort the values: '+sorted.join(', '),'Identify '+(n%2?'the middle position':'the two middle positions'),'Median = '+v]}
 else if(/\bmean\b|\baverage\b/.test(txt))steps=['Add values: '+nums.join(' + ')+' = '+sum,'Count the values: '+n,'Mean = '+sum+' ÷ '+n+' = '+Number((sum/n).toFixed(5))];
 else if(/\brange\b/.test(txt))steps=['Smallest = '+sorted[0]+'; largest = '+sorted[n-1],'Range = largest − smallest','Range = '+(sorted[n-1]-sorted[0])];
 else return '<p>These data have been identified, but this question needs an explicit verified formula template. Write the setup first.</p>';
 return '<ol>'+steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>';
}
function mistakeType(q){const reason=String(q.choiceCoach?.[String(session?.chosen??'')]||'').toLowerCase();if(/formula|equation|method|rule/.test(reason))return 'Formula-selection';if(/arithmetic|multiply|divide|subtract|add|round|decimal|calculat/.test(reason))return 'Calculation';if(/misread|question asks|instead|not asking/.test(reason))return 'Question interpretation';return 'Concept distinction or interpretation (provisional)'}
document.addEventListener('input',e=>{const n=e.target,key=n?.dataset?.v342Key,field=n?.dataset?.v342Field;if(key&&field)saveBoard(decodeURIComponent(key),field,n.value)});
function repairLesson(q){
 if(!session||session.type==='test')return '';
 const chosen=String(session.chosen??''),correct=String(q.answer??''),coach=q.choiceCoach||{};
 const wrongReason=String(coach[chosen]||'This answer does not match the defining evidence in the question.');
 const clue=String(q.wguClue||q.keyClue||q.why||'Identify the details that distinguish the correct concept.');
 const questionId=String(q.id||q.qid||q.prompt||''), encoded=encodeURIComponent(questionId);
 const optionReason=String(coach[correct]||q.why||'Compare the correct answer with the key evidence.');
 const tailored=specificRepair(q,chosen);
 const distinctRule=optionReason.trim()===clue.trim()?'Use the clue to select the relevant rule. Check the answer against that rule and identify what the first choice overlooked.':optionReason;
 const hasWorked=!!tailored?.worked?.length||!!q?.workedExample?.steps?.length||/(?:data set|data values|values are|numbers are)\s*:?\s*-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){2,}/i.test(String(q.prompt||''));
 const steps=hasWorked?'<details class="v342MatchedWork"><summary>Show the calculations using these exact values</summary>'+exactWorked(q)+'</details>':'<p>This question tests a concept or an interpretation. Use its actual clue and answer comparison below rather than an unrelated numerical example.</p>';
 return '<section class="v342Repair" data-repair-question="'+E(questionId)+'" style="padding:1rem;border:1px solid #ad8c55;border-radius:12px;margin:.8rem 0;background:#f6ebd9;color:#30233d">'+
 '<h3>Professor’s Repair · Your Actual Question</h3>'+
 '<p><b>Question:</b> '+E(q.prompt||'')+'</p>'+
 '<p><b>You selected:</b> '+E(chosen)+'</p><p><b>Correct answer:</b> '+E(correct)+'</p>'+
 '<p><b>Why your answer needs revision:</b> '+E(wrongReason)+'</p>'+
 '<div class="v342RepairSteps"><div><b>1 · Find the deciding clue</b><p>'+E(tailored?.clue||clue)+'</p></div>'+
 '<div><b>2 · Connect the clue to the rule</b><p>'+E(tailored?.rule||distinctRule)+'</p><p><b>Why the original choice fails:</b> '+E(tailored?.mistake||wrongReason)+'</p></div>'+
 '<div><b>3 · Work it through</b>'+steps+'</div>'+
 '<div><b>4 · Explain your thinking</b><p>What in the question made your first answer tempting? Which detail changes your reasoning?</p>'+
 '<textarea data-repair-thinking rows="3" style="width:100%;min-height:84px" placeholder="I chose ___ because ___. Now I see ___ in this question, which means ___..."></textarea>'+
 '<button type="button" class="btn ghost" data-repair-check>Check my explanation</button>'+
 '<p data-repair-feedback role="status" aria-live="polite"></p></div></div>'+
 '<button type="button" class="btn primary" data-repair-transfer disabled>Try a different question on this same lesson →</button>'+
 '<small style="display:block">Repair is guided support, not independently verified mastery. The next problem is a separate transfer challenge.</small></section>';
}
function checkRepairExplanation(box){
 const q=session?.current;if(!box||!q)return;
 const input=box.querySelector('[data-repair-thinking]'),feedback=box.querySelector('[data-repair-feedback]'),transfer=box.querySelector('[data-repair-transfer]');
 const text=String(input?.value||'').trim(),words=text.split(/\s+/).filter(Boolean);
 const reasonWords=/because|since|instead|rather|clue|evidence|shows|indicat|means|therefore|first|now|mistake|thought/i.test(text);
 const contrast=/but|instead|however|now|rather|correct|actually|should|different/i.test(text);
 const supplied=words.length>=15&&reasonWords&&contrast;
 feedback.textContent=supplied?'You have compared your original thinking with new reasoning. Read the model explanation above and check that your claim matches this exact scenario.':'Add why you chose the original answer AND what evidence in this question changes your thinking. Aim for a full explanation, not a single word.';
 transfer.disabled=!supplied;
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-repair-check],[data-repair-transfer]');
 if(!button)return;
 const box=button.closest('.v342Repair');if(!box)return;
 if(button.matches('[data-repair-check]')){checkRepairExplanation(box);return}
 if(button.matches('[data-repair-transfer]')&&!button.disabled){
  const id=box.dataset.repairQuestion;
  startRepairTransfer(id);
 }
});
function startRepairTransfer(id){
 const original=String(id||'');
 // The current repaired item can come from a generated/inline pool, not just Study Now's fixed bank.
 const source=session?.current&&String(session.current.id||session.current.qid||session.current.prompt||'')===original?session.current:practicePool('mixed').find(q=>String(q.id||q.qid||q.prompt||'')===original);
 if(!source)return window.rewardToast?.('Review unavailable','Original question not found.');
 const lesson=String(source.learningPathLessonId||source.lessonId||source.topicId||'');
 const api=window.MajickLearningContinuity;
 const history=api?.practiceRecovery?.(source,false);
 const seen=new Set([original,...(history?.seenIds||[]),...(session?.review||[]).map(x=>String(x.q?.id||''))]);
 const sourceSkill=api?.practiceSkill?.(source)||String(source.skill||'');
 const valid=q=>{
  if(!q||seen.has(String(q.id||q.qid||q.prompt||'')))return false;
  const candidateLesson=String(q.learningPathLessonId||q.lessonId||q.topicId||'');
  if(lesson&&candidateLesson!==lesson)return false;
  if(sourceSkill&&api?.practiceSkill?.(q)!==sourceSkill)return false;
  return Array.isArray(q.options)&&q.options.includes(q.answer)&&(!window.MajickVisualEvidence||window.MajickVisualEvidence.evidence(q).ok);
 };
 let candidates=shuffleCopy(practicePool('mixed').filter(valid));
 if(!candidates.length&&window.MajickGeneratedPractice){
  const gen=window.MajickGeneratedPractice;
  if(/probab|sample.space|dependent/i.test(sourceSkill+' '+lesson+' '+source.prompt)){
   for(let ordinal=0;ordinal<180&&!candidates.length;ordinal++){
    for(const transfer of [false,true]){
     const q=gen.probabilityCase?.(ordinal,transfer);
     if(q&&gen.validate?.(q)&&valid(q)){candidates=[q];break}
    }
   }
  }
  if(!candidates.length&&source.skill&&gen.generate){
   const generated=Array.from({length:24},()=>gen.generate(source.skill,2));
   candidates=generated.filter(q=>q&&gen.validate?.(q)&&valid(q));
  }
 }
 if(!candidates.length)return window.rewardToast?.('No unused verified question','This skill has no unused verified transfer item yet. Your guided repair is saved; no completed question will be recycled.');
 const q=candidates[0];
 session={type:'test',opts:{label:'Independent Transfer Check',limit:1,kind:'d772-diagnostic',hideMeta:true,assessmentOnly:true},index:1,score:0,combo:0,questions:[q],current:q,answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
function trackSkillAnswer(q){
 if(!session?.answered||session.current!==q||session.adaptiveTracked)return;
 session.adaptiveTracked=true;
 const assisted=session.type!=='test'||!!(session.mathCoachAssisted||session.chartUsed||session.revealedClue||session.usedPetAbility);
 if(assisted)window.MajickLearningContinuity?.rememberGuidedQuestion?.(q);
 try{window.MajickLearningContinuity?.skillResult(q,session.chosen===q.answer,assisted,session.opts?.label==='Independent Transfer Check'?'independent-transfer':'study-now')}catch(_){}
}
function practiceFeedback(q){
  trackSkillAnswer(q);

  const wrong=session?.chosen!==q.answer;
  const skillId=q.learningPathLessonId||q.lessonId||window.MajickLearningContinuity?.identify?.(q.prompt);
  const skillRow=window.S?.progress?.[window.S.activeCourse]?.adaptiveSkills?.[skillId];
  const adaptivePanel=skillRow?.status==='review-needed'?'<section role="status" style="padding:12px;margin:12px 0;border:1px solid #d7ad75;border-radius:12px"><b>Professor recommends a targeted review</b><p>You have struggled on several questions about this concept. Review the skill using a different explanation, then try fresh questions.</p><button type="button" class="btn primary" onclick="MajickLearningContinuity.skillReview('+E(JSON.stringify(skillId))+')">Open Learning Hub →</button></section>':'';

  const reason=String(q.why||'').replace(/\s+/g,' ').trim();
  let reasonBox='';
  if(session?.type==='reason'){
    reasonBox='<div class="v3333Reason"><b>Explain it in one sentence</b><p>Use the WGU term and the clue from the scenario.</p><textarea id="reasonText" placeholder="The best answer is ___ because the scenario says ___..."></textarea><div><button class="btn ghost" onclick="saveReason(false)">Save explanation</button><button class="btn ghost" onclick="saveReason(true)">I explained it aloud</button></div></div>';
  }
  return '<section class="v3333Feedback '+(wrong?'needsRepair':'correct')+'"><div class="v3333FeedbackTitle">'+(wrong?'Review the distinction':'Correct')+'</div><p><b>Best answer:</b> '+E(q.answer)+'</p><p>'+E(reason)+'</p>'+whyList(q)+(wrong?repairLesson(q):'')+reasonBox+adaptivePanel+'<button class="btn primary v3333Next" onclick="continueSession()">Next question →</button></section>';
}
function confidenceHtml(){
  if(session?.opts?.kind==='d772-section1-oa')return '';
  const items=[['guess','Guess'],['50','50/50'],['sure','Sure'],['certain','Certain']];
  return '<div class="v3333Confidence"><span>How sure are you?</span>'+items.map(([v,l])=>'<button type="button" class="'+(session.confidence===v?'sel':'')+'" onclick="setConfidence(\''+v+'\')">'+l+'</button>').join('')+'</div>';
}
function openRequiredRecovery(){
 const q=session?.current,r=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
 if(!q||!r)return;
 S.progress.D772.requiredReconstructionQuestion=JSON.parse(JSON.stringify(r.source||q));window.save?.();window.navigate?.('reasoning');
}
function finishRequiredRecovery(source){
 const api=window.MajickLearningContinuity,r=api?.practiceRecovery?.(source,false);if(!r||r.required)return;
 const fresh=practicePool('mixed').find(q=>api.practiceSkill(q)===api.practiceSkill(source)&&!r.seenIds.includes(q.id)&&window.MajickVisualEvidence?.evidence(q).ok);
 if(!fresh){window.rewardToast?.('Repair saved','No unused same-skill case remains. Independent recovery is still pending.');window.navigate?.('mission');return}
 if(session){const old=session.current;const i=session.questions?.findIndex(q=>q.id===old?.id);if(i>=0)session.questions[i]=fresh;session.current=fresh;session.answered=false;session.pendingChoice=null;session.adaptiveTracked=false;session.mathCoachAssisted=false;session.chartUsed=false;session.revealedClue=false;session.usedPetAbility=false}
 window.navigate?.('mission');
}
function questionHtml(q){
 const recovery=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
 if(session?.type==='test'&&!session.answered&&recovery&&(recovery.required||recovery.awaitingTransfer&&recovery.failedIds.includes(q.id)))return '<section class="majExamFeedback"><h3>Guided reconstruction required</h3><p>A missed independent question needs guided repair before another independent response for this skill. Your exam score and previous answers are preserved.</p><button onclick="MajickWGUPractice.openRequiredRecovery()">Complete guided reconstruction</button></section>';
  const oa=session?.type==='test';
  const clue=session?.type==='clue'&&!oa&&!session.answered;
  const selected=session?.pendingChoice;
  const ev=globalThis.MajickVisualEvidence?.evidence(q,x=>visualHtml(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'');
  const evidenceOk=!!ev?.ok;
  const options=(q.options||[]).map((o,i)=>{
    const cls=['v3333Option'];
    if(selected===o&&!session.answered)cls.push('selected');
    if(session.answered&&o===q.answer)cls.push('correct');
    if(session.answered&&o===session.chosen&&o!==q.answer)cls.push('wrong');
    return '<button type="button" class="'+cls.join(' ')+'" '+(session.answered?'disabled':'')+' onclick=\'MajickWGUPractice.select('+E(JSON.stringify(o))+')\'><span class="v3333Letter">'+String.fromCharCode(65+i)+'</span><span>'+E(o)+'</span></button>';
  }).join('');
  const label=E(session?.opts?.label||'D772 Practice');
  const progress=(session?.index||1)+(session?.opts?.limit?'/'+session.opts.limit:'');
  return '<div class="v3333QuestionShell '+(oa?'oaMode':'practiceMode')+'"><div class="v3333QTop"><div><span class="v3333Eyebrow">D772 • STATISTICAL DATA LITERACY</span><h2>'+label+'</h2></div><div class="v3333QCount">Question '+progress+'</div><button class="btn ghost" onclick="session=null;navigate(\'mission\')">Choose section</button></div>'+(oa?'<div class="v3333OANote">No hints or lesson labels during the simulation.</div>':'')+(session?.opts?.timeLimitMs?'<div id="v342AssessClock" role="timer">Time remaining: '+Math.max(0,Math.ceil((session.opts.timeLimitMs-(Date.now()-session.start))/1000))+' seconds</div>':'')+'<article class="v3333QuestionCard"><div class="v3333Prompt">'+E(ev?.prompt||q.prompt)+'</div>'+(evidenceOk?ev.html:(globalThis.MajickVisualEvidence?.blockedHtml()||'<p role="alert">Visual evidence unavailable; do not answer.</p>')+'<button type="button" class="btn ghost" onclick="MajickWGUPractice.skipBrokenVisual()">Replace broken question without penalty →</button>')+(!oa&&evidenceOk?'<button class="btn ghost" '+(session.answered?'disabled':'')+' onclick="toggleAnchorChart()">'+(session.chartOpen?'Hide':'Open')+' skill anchor chart</button>':'')+(!oa&&session.chartOpen?anchorChartHTML(q):'')+(clue?'<div class="v3333ClueTraining">'+clueHTML(cleanPrompt(q.prompt))+'</div>':'')+confidenceHtml()+questionBoard(q)+'<div class="v3333Options">'+(evidenceOk?options:'')+'</div>'+(!session.answered&&evidenceOk?'<button type="button" class="btn primary v3333Submit" '+(selected?'':'disabled')+' onclick="MajickWGUPractice.submit()">Submit</button>':'')+(!oa&&session.answered?practiceFeedback(q):'')+'</article></div>';
}
function preserveAnswerScroll(action){
 const screen=window.S?.screen,docY=window.scrollY||0;
 const stage=document.querySelector('.classroomStage');const stageY=stage?.scrollTop||0;
 const result=action();
 const restore=()=>{if(window.S?.screen!==screen)return;window.scrollTo({top:docY,behavior:'instant'});const current=document.querySelector('.classroomStage');if(current)current.scrollTop=stageY};
 restore();if(typeof requestAnimationFrame==='function')requestAnimationFrame(restore);
 return result;
}
function select(choice){
  if(!session||session.answered||!globalThis.MajickVisualEvidence?.evidence(session.current,x=>visualHtml(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'')?.ok)return;
  session.pendingChoice=choice;
  preserveAnswerScroll(()=>render());
}
function skipBrokenVisual(){
  if(!session||session.answered||globalThis.MajickVisualEvidence?.evidence(session.current,x=>visualHtml(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'')?.ok)return;
  const current=session.current,used=new Set((session.questions||[]).map(x=>String(x?.id||x?.qid||x?.prompt||'')));
  const candidates=shuffleCopy(practicePool('mixed').filter(x=>x?.prompt&&x?.options?.length&&sectionNumber(x)===sectionNumber(current)&&!used.has(String(x.id||x.qid||x.prompt||''))));
  const next=candidates.find(x=>globalThis.MajickVisualEvidence?.evidence(x,v=>visualHtml(v.visual)||window.MajickCourseTutor?.questionVisualHtml?.(v)||'')?.ok);
  if(!next){window.rewardToast?.('Graph missing','No valid replacement in this section. Return to Choose section. Nothing was graded.');return}
  session.current=next;session.pendingChoice=null;session.chosen=null;session.answered=false;
  if(Array.isArray(session.questions)&&session.index>0)session.questions[session.index-1]=next;
  session.chartOpen=false;session.chartUsed=false;render();
}
function submit(){
  if(!session||session.answered||!session.pendingChoice||!globalThis.MajickVisualEvidence?.evidence(session.current,x=>visualHtml(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'')?.ok)return;
  const choice=session.pendingChoice;
  session.pendingChoice=null;
  preserveAnswerScroll(()=>answerQ(choice));
  if(fixedPractice()&&session.type!=='test'&&session.answered)session.review.push({q:session.current,chosen:choice,correct:choice===session.current.answer});
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
const EXPERIMENT_ROWS=[["Researchers randomly assign adults to take a new medication or a placebo. They measure headache severity after treatment. What is the explanatory variable?", ["The assigned medication or placebo", "Headache severity after treatment", "The number of participants", "The participants\u2019 ages"], "The assigned medication or placebo", "The explanatory variable is the treatment researchers assign. Headache severity is the response they measure."], ["Researchers randomly assign plants to receive fertilizer or no fertilizer. They measure plant height after six weeks. What is the response variable?", ["The assigned fertilizer condition", "Plant height after six weeks", "The number of groups", "The random assignment procedure"], "Plant height after six weeks", "The response variable is the measured outcome. Here researchers measure plant height."], ["Participants are randomly assigned to receive a new medication or an inactive pill that looks identical. What is the inactive pill called?", ["A placebo", "A response variable", "A random sample", "A treatment effect"], "A placebo", "A placebo resembles the treatment but does not contain the active treatment being tested."], ["Researchers compare a new tutoring method with the usual tutoring method. Students are randomly assigned to one of the methods. Which group serves as the control group?", ["Students receiving the usual method", "Students receiving the new method", "All students combined", "Students with the highest final scores"], "Students receiving the usual method", "The control group provides the comparison condition. It can receive usual practice rather than no service at all."], ["Participants do not know whether they receive a medication or a placebo. Researchers interacting with them know their assignments. What type of blinding is described?", ["Single-blind", "Double-blind", "No blinding", "Random sampling"], "Single-blind", "Participants do not know their assignments, but the researchers do. This is the single-blind arrangement described in the course material."], ["Neither participants nor the researchers administering treatment and assessing outcomes know who receives the medication or placebo. What type of blinding is described?", ["Double-blind", "Single-blind", "No blinding", "Stratified sampling"], "Double-blind", "Both participants and the researchers administering or assessing treatment are unaware of the assignments."], ["A researcher randomly assigns participants to a treatment group or a control group. What is the main purpose of random assignment?", ["Reduce systematic differences between groups", "Guarantee identical outcomes in both groups", "Guarantee a representative population sample", "Ensure the treatment is effective"], "Reduce systematic differences between groups", "Random assignment helps balance other characteristics across groups and reduces assignment bias. It does not guarantee perfect balance or effectiveness. Random sampling addresses population representation."], ["Researchers randomly assign participants to four exercise programs and compare fitness outcomes. Which statement best describes this study?", ["It is an experiment because programs are assigned", "It cannot be an experiment because it has four groups", "It is a sample survey because fitness is measured", "It is observational because no placebo is used"], "It is an experiment because programs are assigned", "Researchers assign treatments and compare outcomes. Experiments can have more than two groups, and a placebo is not required in every experiment."]];
function startExperiments(){
 if(!activeD772())return;
 const questions=shuffleCopy(EXPERIMENT_ROWS.map(([prompt,options,answer,why],i)=>({id:'d772_wgu_experiment_drill_'+i,prompt,options:shuffleCopy(options),answer,why,wguClue:why,topicId:'designed-experiments',learningPathLessonId:'d772-s1-l1',difficulty:2})));
 const bank=window.S.courses.D772.questionBank||(window.S.courses.D772.questionBank=[]);
 for(const q of questions)if(!bank.some(old=>old.id===q.id))bank.push(q);
 session={type:'adaptive',opts:{label:'Designed Experiments Drill',limit:questions.length,kind:'d772-experiments-drill'},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
function fixedPractice(){return ['d772-diagnostic','d772-mixed-oa','d772-section-practice','d772-focused-review','d772-sampling-drill','d772-study-design-drill','d772-label-study','d772-experiments-drill'].includes(session?.opts?.kind)}
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
  const lessons=new Set(missed.map(x=>x.q?.learningPathLessonId||x.q?.lessonId).filter(Boolean));
  if(!lessons.size)return;
  const seen=new Set((session.review||[]).map(x=>String(x.q?.id||'')));
  // Use the same verified practice intake as Study Now instead of the legacy Section 1-only bank.
  const gate=window.MajickVisualEvidence;
  const pool=practicePool('mixed').filter(q=>{
    const key=String(q.learningPathLessonId||q.lessonId||'');
    if(![...lessons].some(id=>key===id||key.startsWith(id+'-')))return false;
    if(!Array.isArray(q.options)||q.options.length<2||!q.options.includes(q.answer))return false;
    return !gate||gate.evidence(q,v=>visualHtml(v.visual)||window.MajickCourseTutor?.questionVisualHtml?.(v)||'').ok;
  });
  const fresh=shuffleCopy(pool.filter(q=>!seen.has(String(q.id||''))));
  const repeated=shuffleCopy(pool.filter(q=>seen.has(String(q.id||''))));
  const arr=[...fresh,...repeated].slice(0,10);
  if(!arr.length){window.rewardToast?.('Review unavailable','No valid questions were found for the missed skills. Your results are preserved.');return}
  session={type:'adaptive',opts:{label:'D772 Missed-Skill Focused Review',limit:arr.length,kind:'d772-focused-review'},index:1,score:0,combo:0,questions:arr,current:arr[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
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
 return '<div class="v3333Result"><section class="v3333ResultHero"><h2>'+E(session.opts.label)+' complete</h2><p>You scored '+session.score+'/'+review.length+'.</p><div class="v3333ResultActions">'+(session.opts.kind==='d772-section-practice'?'<button class="btn primary" onclick="MajickWGUPractice.startSection(\''+E(session.opts.scope)+'\','+(session.type==='test')+')">Practice this selection again</button>':session.opts.kind==='d772-experiments-drill'?'<button class="btn primary" onclick="MajickWGUPractice.startExperiments()">Practice designed experiments again</button>':session.opts.kind==='d772-label-study'?'<button class="btn primary" onclick="MajickWGUPractice.startLabelStudy()">Label another study</button>':session.opts.kind==='d772-study-design-drill'?'<button class="btn primary" onclick="MajickWGUPractice.startStudyDesign()">Play study design drill again</button>':session.opts.kind==='d772-sampling-drill'?'<button class="btn primary" onclick="MajickWGUPractice.startSampling()">Play sampling drill again</button>':missed.length?'<button class="btn primary" onclick="MajickWGUPractice.startFocusedReview()">Practice my missed lessons →</button>':'')+'<button class="btn ghost" onclick="session=null;navigate(\'mission\')">Return to Practice Lab</button></div></section><details class="v3333Missed"><summary>Review missed questions ('+missed.length+')</summary>'+missed.map(x=>'<article><b>'+E(x.q.prompt)+'</b><p>You chose: '+E(x.chosen)+'</p><p>Best answer: '+E(x.q.answer)+'</p><p>'+E(x.q.why)+'</p>'+whyList(x.q)+'</article>').join('')+'</details></div>';
}
function sectionNumber(q){return Number(String(q.learningPathLessonId||q.topicId||'').match(/d772-s([123])(?:-|$)/)?.[1]||String(q.section||'').match(/section\s*([123])/i)?.[1]||1)}
function practicePool(scope){
 const base=questionPool();
 const source=activeD772()?[...(window.MajickD772VerifiedSource?.questions?.()||[]),...(window.MajickD772PreassessmentReview?.practiceQuestions?.()||[])]:[];
 const seen=new Set(base.map(q=>String(q.id)));
 const rows=base.concat(source.filter(q=>!seen.has(String(q.id))));
 if(scope==='mixed')return rows;
 if(scope==='2c')scope='2'; // Legacy Section 2C is the same academic section as Section 2.
 return rows.filter(q=>sectionNumber(q)===Number(scope));
}
function skillGrowthDashboard(){
 const rows=Object.values(window.S?.progress?.[window.S.activeCourse]?.adaptiveSkills||{});
 if(!rows.length)return '<section class="v3333Scope"><h3>Skill growth</h3><p>Your concept-by-concept growth and review recommendations will appear as you practice.</p></section>';
 const e=x=>E(String(x||''));
 const reviewCount=rows.filter(x=>x.status==='review-needed').length;
 return '<details class="v3333Scope mjSkillGrowthDrawer"><summary><strong>Skill growth and review</strong><span>'+rows.length+' skills tracked · '+reviewCount+' need review · Expand</span></summary><div class="mjSkillGrowthBody"><p>Assisted practice builds understanding; only independent practice counts toward readiness.</p>'+rows.map(x=>{
 const n=x.attempts.length,correct=x.attempts.filter(a=>a.correct&&!a.assisted).length,percent=n?Math.round(100*correct/n):0;
 const label=x.status==='review-needed'?'Review recommended':x.status==='ready-for-teachback'?'Teaching check next':x.status==='reviewing'?'Review underway':x.status==='retry'?'Retry practice':'Developing';
 return '<details class="mjCompactSkill"><summary><strong>'+e(x.lessonId)+'</strong><span>'+e(label)+' · '+correct+'/'+n+' correct · '+percent+'%</span></summary><div class="mjCompactSkillDetails"><p>'+correct+'/'+n+' independent correct · '+(x.cycles||0)+' reteaching cycles. Guided work does not establish mastery.</p><button type="button" onclick="MajickWGUPractice.startSkillRetry('+E(JSON.stringify(x.lessonId))+')">Practice this skill</button>'+(x.status==='review-needed'?'<button type="button" onclick="MajickLearningContinuity.skillReview('+E(JSON.stringify(x.lessonId))+')">Review lesson</button>':'')+'</div></details>';
 }).join('')+'</div></details>';
}
function startSkillRetry(id){
 if(!activeD772())return;
 const gate=window.MajickVisualEvidence;
 const learned=window.S?.progress?.D772?.adaptiveSkills?.[id];
 const retrySkills={
  'd772-s2-l4':['mean','median','boxplot'],
  'd772-s2-l4-1':['mean','median'],
  'd772-s2-l4-3':['boxplot'],
  'd772-s2-l3':['histogram'],
  'd772-s2-l3-1':['histogram'],
  'd772-s2-l2':['scatterplot'],
  'd772-s2-l2-3':['scatterplot'],
  'd772-s3-l2':['probability'],
  'd772-s3-l2-1':['probability']
 };
 const skills=retrySkills[id]||[];
 const generated=skills.length?Array.from({length:18},(_,i)=>window.MajickGeneratedPractice?.generate?.(skills[i%skills.length],2)).filter(q=>q&&(q.learningPathLessonId===id||q.learningPathLessonId?.startsWith(id+'-'))):[];
 const matchesLesson=q=>{const lesson=String(q.learningPathLessonId||q.lessonId||window.MajickLearningContinuity?.identify?.(q.prompt)||'');return lesson===id||lesson.startsWith(id+'-')};
 const rows=shuffleCopy(practicePool('mixed').concat(generated).filter(q=>matchesLesson(q)&&q.options?.length>=2&&(!gate||gate.evidence(q,v=>visualHtml(v.visual)||window.MajickCourseTutor?.questionVisualHtml?.(v)||'').ok)));
 if(!rows.length){window.rewardToast?.('More practice needed','No verified new questions for this lesson yet.');return}
 const fresh=rows.filter(q=>!(learned?.seen||[]).includes(String(q.id||q.prompt)));
 const complexity=q=>Number(q.difficulty||1);
 const accuracy=learned?.attempts?.length?learned.attempts.filter(x=>x.correct&&!x.assisted).length/learned.attempts.length:0.5;
 const targetLevel=accuracy>=.8?3:accuracy<.4?1:2;
 const ordered=(fresh.length?fresh:rows).sort((a,b)=>Math.abs(complexity(a)-targetLevel)-Math.abs(complexity(b)-targetLevel));
 const signatures=new Set();
 const questions=ordered.filter(q=>{
  const sign=(q.generated?String(q.skill||'')+'|'+JSON.stringify(q.data):String(q.prompt||'').toLowerCase().replace(/\d+(?:\.\d+)?/g,'#').replace(/\s+/g,' ').trim());
  if(signatures.has(sign))return false;signatures.add(sign);return true;
 }).slice(0,5);
 session={type:'test',opts:{label:'Independent skill recovery · '+id,limit:questions.length,kind:'d772-section-practice',scope:'retry',hideMeta:true},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null,adaptiveTracked:false};
 if(learned){learned.status='retry';learned.seen=(learned.seen||[]).concat(questions.map(q=>String(q.id||q.prompt))).slice(-70);}
 S.screen='mission';try{save()}catch(_){}render();
}
function selectVariedQuestions(rows,limit){
 const seen=new Set(),ordered=[];
 for(const q of rows){
  const key=q.generated?String(q.skill||'')+'|'+JSON.stringify(q.data):String(q.prompt||'').toLowerCase().replace(/\d+(?:\.\d+)?/g,'#').replace(/\s+/g,' ').trim();
  if(!key||seen.has(key))continue;
  if(window.MajickVisualEvidence&&!window.MajickVisualEvidence.evidence(q,x=>visualHtml(x.visual)||window.MajickCourseTutor?.questionVisualHtml?.(x)||'').ok)continue;
  seen.add(key);ordered.push(q);
  if(ordered.length>=limit)break;
 }
 return ordered;
}
function startSection(scope,independent=false){
 if(!activeD772())return;
 const generated=(scope==='2'||scope==='2c'||scope==='3'||scope==='mixed')?(window.MajickGeneratedPractice?.batch?.(24,independent?3:2)||[]):[];
 const pool=practicePool(scope).concat(generated.filter(q=>scope==='mixed'||scope==='2'&&sectionNumber(q)===2||scope==='2c'&&sectionNumber(q)===2||scope==='3'&&sectionNumber(q)===3)),groups=[1,2,3].map(n=>selectVariedQuestions(shuffleCopy(pool.filter(q=>sectionNumber(q)===n&&(independent||!window.MajickLearningContinuity?.guidedQuestionAvailable||window.MajickLearningContinuity.guidedQuestionAvailable(q)))),15));
 const questions=[];
 // Round-robin section quotas guarantee that mixed practice reaches every available section.
 while(questions.length<15&&groups.some(g=>g.length))for(const group of groups)if(group.length&&questions.length<15)questions.push(group.pop());
 if(!questions.length){window.rewardToast?.('No practice available','This section has no usable questions yet.');return;}
 const label=scope==='mixed'?'Mixed · Sections 1, 2 and 3':scope==='2c'?'Section 2C · Distributions and descriptive statistics':'Section '+scope;
 session={type:independent?'test':'adaptive',opts:{label:label+(independent?' · Independent OA practice':' · Assisted practice'),limit:questions.length,kind:'d772-section-practice',scope,hideMeta:independent},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
// Assessments reuse the renderer and report learning needs without awarding rewards.
const originalAssessmentAnswer=answerQ;
answerQ=function(choice){
 if(!session?.opts?.assessmentOnly){const q=session?.current;const out=originalAssessmentAnswer(choice);trackSkillAnswer(q);return out;}
 if(session.answered||session.finished)return;
 const q=session.current,correct=String(choice)===String(q.answer);
 session.chosen=choice;session.answered=true;session.score+=correct?1:0;
 session.review.push({q,chosen:choice,correct});
 trackSkillAnswer(q);
 setTimeout(()=>{
  if(!session||session.finished||!session.opts?.assessmentOnly)return;
  if(session.index>=session.questions.length)finishSession();
  else{session.current=session.questions[session.index++];session.answered=false;session.chosen=null;render()}
 },120);
};
let assessmentClock=null;
function tickAssessmentClock(){
 const s=session;
 if(!s?.opts?.assessmentOnly||s.finished){if(assessmentClock){clearInterval(assessmentClock);assessmentClock=null}return}
 const limit=s.opts.timeLimitMs;
 if(!limit)return;
 const remaining=Math.max(0,limit-(Date.now()-s.start));
 const el=document.getElementById('v342AssessClock');
 if(el)el.textContent='Time remaining: '+Math.floor(remaining/60000)+':'+String(Math.floor(remaining/1000)%60).padStart(2,'0');
 if(!remaining){
  if(!s.answered&&s.current)s.review.push({q:s.current,chosen:null,correct:false});
  for(const q of s.questions.slice(s.index))s.review.push({q,chosen:null,correct:false});
  finishSession();
 }
}
function launchAssessmentClock(){
 if(assessmentClock)clearInterval(assessmentClock);
 assessmentClock=setInterval(tickAssessmentClock,1000);
 tickAssessmentClock();
}
function balancedMixedAssessment(limit=30){
 const pool=practicePool('mixed'),sets=[1,2,3].map(n=>selectVariedQuestions(shuffleCopy(pool.filter(q=>sectionNumber(q)===n&&(independent||!window.MajickLearningContinuity?.guidedQuestionAvailable||window.MajickLearningContinuity.guidedQuestionAvailable(q)))),limit)),chosen=[],used=new Set();
 for(let i=0;i<limit&&sets.some(a=>a.length);){
  for(const group of sets){if(i>=limit)break;while(group.length){const q=group.pop(),key=String(q.id||q.qid||q.prompt);if(used.has(key))continue;used.add(key);chosen.push(q);i++;break}}
 }
 return chosen;
}
function startDiagnostic(){
 if(!activeD772())return;
 const questions=balancedMixedAssessment(12);
 if(!questions.length)return window.rewardToast?.('Diagnostic unavailable','No D772 question pool found.');
 session={type:'test',opts:{label:'D772 Starting Diagnostic',limit:questions.length,kind:'d772-diagnostic',hideMeta:true,assessmentOnly:true},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();
}
function startMixedOA(){
 if(!activeD772())return;
 const questions=balancedMixedAssessment(30);
 if(!questions.length)return window.rewardToast?.('Simulation unavailable','No D772 question pool found.');
 const coverage=new Set(questions.map(sectionNumber));
 if(coverage.size!==3)return window.rewardToast?.('Full simulation not ready','All three sections need questions before this simulation can claim full-course coverage.');
 session={type:'test',opts:{label:'D772 Full-Course OA Simulation',limit:questions.length,kind:'d772-mixed-oa',hideMeta:true,assessmentOnly:true,timeLimitMs:questions.length*90000},index:1,score:0,combo:0,questions,current:questions[0],answered:false,confidence:'sure',review:[],start:Date.now(),pendingChoice:null};
 S.screen='mission';render();launchAssessmentClock();
}
function assessmentReport(){
 const rows=session.review||[],total=rows.length,correct=rows.filter(x=>x.correct).length;
 const groups=[1,2,3].map(n=>{const r=rows.filter(x=>sectionNumber(x.q)===n);return {n,count:r.length,correct:r.filter(x=>x.correct).length}});
 const elapsed=Math.max(0,Date.now()-session.start),mins=Math.floor(elapsed/60000),secs=String(Math.floor(elapsed/1000)%60).padStart(2,'0');
 return '<div class="v3333Result"><section class="v3333ResultHero"><h2>'+E(session.opts.label)+' complete</h2><p>'+correct+' / '+total+' correct · '+(total?Math.round(correct/total*100):0)+'% · '+mins+':'+secs+' elapsed</p><p>Practice evidence only, not a prediction of your official WGU result. Diagnostic results are not mastery credit.</p></section>'+
 '<section class="v3333Readiness"><h3>Performance by section</h3><div class="v3333LessonGrid">'+groups.map(g=>'<article><b>Section '+g.n+'</b><p>'+g.correct+' / '+g.count+' correct</p><small>'+(g.count?Math.round(g.correct/g.count*100)+'%':'No questions included')+'</small></article>').join('')+'</div></section>'+
 '<details open class="v3333Missed"><summary>Answer review ('+total+' questions)</summary>'+rows.map((x,i)=>'<article><b>Question '+(i+1)+': '+E(x.q?.prompt||'')+'</b><p>Your answer: '+E(x.chosen??'Not answered')+'</p><p>Correct answer: '+E(x.q?.answer||'')+'</p><p>'+E(x.q?.why||'Check the related lesson for an explanation.')+'</p></article>').join('')+'</details><button class="btn primary" onclick="session=null;navigate(\'mission\')">Return to Study Now</button></div>';
}
function missionLanding(){
 const scopes=[['1','Section 1','Credibility, sampling, bias and study design'],['2','Section 2','Data, graphs and descriptive statistics'],['2c','Section 2C','Distributions, measures of center, spread and box plots'],['3','Section 3','Probability, events and probability rules'],['mixed','Mixed · All three sections','Balanced questions from each available section']];
 return '<div class="v3333Mission">'+skillGrowthDashboard()+'<section class="v3333Scope"><h3>Four assessment paths</h3><p>Diagnostic checks your starting knowledge; guided practice teaches; independent mastery removes hints; the full OA simulation mixes Sections 1–3.</p><div><button onclick="MajickWGUPractice.startDiagnostic()">Starting diagnostic</button><button onclick="MajickWGUPractice.startMixedOA()">Timed full-course OA simulation</button></div></section><div class="v3333MissionHead"><span class="v3333Eyebrow">D772 · SECTIONS 1, 2 AND 3</span><h2>Study Now</h2><p>Choose your section. Assisted practice offers anchor charts; independent OA practice keeps support closed.</p></div><div class="v3333MissionGrid">'+scopes.map(([id,title,detail])=>{const n=practicePool(id).length;return '<article class="v3333Scope"><h3>'+title+'</h3><p>'+detail+'</p><small>'+n+' available questions</small><div><button '+(!n?'disabled':'')+' onclick="MajickWGUPractice.startSection(\''+id+'\')"><span>Assisted practice</span><small>Anchor charts and worked examples</small></button><button '+(!n?'disabled':'')+' onclick="MajickWGUPractice.startSection(\''+id+'\',true)"><span>Independent OA practice</span><small>No hints or support</small></button></div></article>'}).join('')+'</div><details><summary>Section 1 focused drills</summary><div class="v3333MissionGrid"><button onclick="MajickWGUPractice.startExperiments()">Designed experiments</button><button onclick="MajickWGUPractice.startLabelStudy()">Label the study</button><button onclick="MajickWGUPractice.startStudyDesign()">Study design</button><button onclick="MajickWGUPractice.startSampling()">Sampling methods</button></div></details></div>';
}
const originalSessionHTML=window.sessionHTML||sessionHTML;
const originalResultHTML=window.resultHTML||resultHTML;
const originalMissionHTML=window.missionHTML||missionHTML;
const originalNextQuestion=window.nextQuestion||nextQuestion;
const originalStartMixed=window.startMixed||startMixed;
sessionHTML=function(){
  if(!activeD772()||!session)return originalSessionHTML();
  if(session.finished&&['d772-diagnostic','d772-mixed-oa'].includes(session.opts?.kind))return assessmentReport();
  if(session.finished&&fixedPractice())return fixedResult();
  if(session.finished&&session.opts?.kind==='d772-section1-oa')return oaResult();
  if(session.opts?.kind==='d772-section-practice'||isD772Question(session.current)||activeD772()&&/^d772-(oa-|pa-deep)/.test(session.current?.id||''))return questionHtml(session.current);
  return originalSessionHTML();
};
resultHTML=function(){
  if(activeD772()&&['d772-diagnostic','d772-mixed-oa'].includes(session?.opts?.kind))return assessmentReport();
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
    if(session.type!=='test'&&session.answered&&!session.review.some(x=>x.q.id===session.current.id))session.review.push({q:session.current,chosen:session.chosen,correct:session.chosen===session.current.answer});
    if(session.index>=session.questions.length){finishSession();return;}
    session.current=session.questions[session.index++];session.chartUsed=false;session.chartOpen=false;session.petHint=null;session.petEliminated=null;session.revealedClue=false;session.usedPetAbility=false;session.usedClueCharm=false;session.mathCoachAssisted=false;session.mathCoachHelpTypes=[];session.questionStartedAt=Date.now();session.answered=false;session.chosen=null;session.pendingChoice=null;session.adaptiveTracked=false;session.confidence='sure';return;
  }
  const out=originalNextQuestion.apply(this,arguments);
  if(session)session.pendingChoice=null;
  return out;
};
startMixed=function(){
  if(activeD772())return startSection('mixed',true);
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
window.MajickWGUPractice={VERSION,select,submit,openRequiredRecovery,finishRequiredRecovery,skipBrokenVisual,startSection,startSkillRetry,startDiagnostic,startMixedOA,startRepairTransfer,balancedMixedAssessment,practicePool,sectionNumber,startOA,startFocusedReview,startSampling,startStudyDesign,startLabelStudy,startExperiments,visualHtml,whyList,balancedOA,isD772Question,ensureD772Bank,bootD772Practice};
document.documentElement.dataset.majickWguPractice='3.3.36';
bootD772Practice();
})();