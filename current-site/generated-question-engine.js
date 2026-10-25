/* Majick Studies · zero-cost, deterministic D772 question and SVG engine */
(()=>{'use strict';if(window.MajickGeneratedPractice)return;
const E=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let serial=0;const randint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const fraction=(a,b)=>{const gcd=(x,y)=>y?gcd(y,x%y):x,k=gcd(a,b);return (a/k)+'/'+(b/k)};
const median=a=>{const x=[...a].sort((m,n)=>m-n),n=x.length;return n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2};
const quartiles=a=>{const x=[...a].sort((m,n)=>m-n),n=x.length,half=Math.floor(n/2),q1=median(x.slice(0,half)),q3=median(x.slice(n-half));return [x[0],q1,median(x),q3,x[n-1]]};
const frame=(title,plot,alt)=>'<figure class="majickGeneratedFigure" style="background:#22162e;color:#fbeacd;padding:12px;border-radius:12px;border:1px solid #c9a97b"><figcaption><b>'+E(title)+'</b></figcaption><svg role="img" aria-label="'+E(alt)+'" viewBox="0 0 500 275" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:680px;margin:auto">'+plot+'</svg></figure>';
const tx=(x,y,v)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#fff1d6" font-size="13">'+E(v)+'</text>';
const axis='<path d="M55 20V225H475" fill="none" stroke="#fff1d6" stroke-width="2"/>';
function dots(vals){const lo=Math.min(...vals),hi=Math.max(...vals),span=hi-lo||1;let plot=axis;const seen={};vals.forEach(v=>{const x=65+(v-lo)/span*390,j=seen[v]||0;seen[v]=j+1;plot+='<circle cx="'+x+'" cy="'+(210-22*j)+'" r="8" fill="#bca0f0"/>'});plot+=tx(70,245,lo)+tx(455,245,hi)+tx(260,264,'Value');return frame('Dot plot',plot,'Dot plot of '+vals.join(', '))}
function box(vals){const five=quartiles(vals),lo=five[0],span=five[4]-lo||1,x=v=>65+(v-lo)/span*390;let plot=axis+'<path d="M'+x(five[0])+' 130H'+x(five[4])+'" stroke="#caa7f2" stroke-width="4"/><rect x="'+x(five[1])+'" y="94" width="'+Math.max(1,x(five[3])-x(five[1]))+'" height="72" fill="#784b9d" stroke="#f5dfa9" stroke-width="2"/><path d="M'+x(five[2])+' 94V166 M'+x(five[0])+' 112V148 M'+x(five[4])+' 112V148" stroke="#fff1d6" stroke-width="3"/>';five.forEach((v,i)=>plot+=tx(x(v),i%2?194:212,v));return frame('Box plot',plot,'Five-number summary minimum '+five.join(', Q1 median Q3 maximum in order: '))}
function histogram(counts){const max=Math.max(...counts,1),w=370/counts.length;let plot=axis+tx(29,14,'Frequency')+tx(267,268,'Quiz score intervals');counts.forEach((n,i)=>{const height=n/max*168,x=67+i*w;plot+='<rect x="'+x+'" y="'+(225-height)+'" width="'+w+'" height="'+height+'" stroke="#d9bf9a" fill="#8553ab"/>'+tx(x+w/2,243,(i*10)+'–'+(i*10+9))+tx(x+w/2,Math.max(18,216-height),n)});return frame('Histogram · equal-width intervals',plot,'Frequencies in successive equal-width groups: '+counts.join(', '))}
function scatter(points){let plot=axis;for(let n=0;n<=10;n+=2){plot+=tx(62+n*36,245,n)+tx(39,224-n*17,n)}points.forEach(([x,y])=>plot+='<circle cx="'+(62+x*36)+'" cy="'+(220-y*17)+'" r="6" fill="#e5b9e9"/>');plot+=tx(260,270,'Weekly practice hours (x)')+tx(250,15,'Performance score (y)');return frame('Scatterplot · association, not causation',plot,'Practice hours on x-axis and performance score on y-axis. Ordered pairs: '+points.map(p=>p.join(' comma ')).join('; '))}
function probability(green,purple){const circles=(count,y,color)=>Array.from({length:Math.min(count,12)},(_,i)=>'<circle cx="'+(50+i*35)+'" cy="'+y+'" r="18" fill="'+color+'" stroke="#fff1d6"/>').join('');const plot=tx(250,35,'Counters in a bag · without replacement')+circles(green,85,'#74bf8c')+circles(purple,155,'#b490d1')+tx(250,219,green+' green + '+purple+' purple = '+(green+purple)+' total')+tx(250,244,'Counts above are exact; dots show up to 12 counters per color');return frame('Probability counters',plot,green+' green counters and '+purple+' purple counters. The first draw is not replaced before the second.')}
function item(skill,values,difficulty){
 const id='gen-d772-'+skill+'-'+Date.now().toString(36)+'-'+(++serial),options=[],add=x=>{const t=String(x);if(!options.includes(t))options.push(t)};
 let prompt,answer,visualHtml,why,lessonId='d772-s2-l4-1',mistake;
 if(skill==='mean'){const sum=values.reduce((a,b)=>a+b,0),m=sum/values.length;answer=String(m);prompt='A teacher records independent reading minutes for '+values.length+' students: '+values.join(', ')+'. The principal asks for an equal-share estimate to compare class routines. First total the minutes, then divide by the number of students.\n\nWhat arithmetic mean should the teacher report?';visualHtml=dots(values);why='Add the '+values.length+' values ('+sum+') and divide by '+values.length+'.';mistake='Dividing by the wrong number of observations';add(answer);add(m+1);add(m-1);add(m+2)}
 if(skill==='median'){answer=String(median(values));prompt='A reading interventionist collected these screening scores, displayed in the dot plot. To report a center resistant to unusual scores, first arrange the observations from least to greatest, then locate the central position(s).\n\nWhat is the median screening score?';visualHtml=dots(values);why='Sort all values, then identify the middle observation(s).';mistake='Finding the middle before sorting';add(answer);add(Number(answer)+2);add(Number(answer)-2);add(values[0])}
 if(skill==='boxplot'){lessonId='d772-s2-l4-3';const five=quartiles(values),iqr=five[3]-five[1];answer=String(iqr);prompt='The box plot summarizes weekly reading minutes for a classroom. Determine the first and third quartiles from the ordered sample, then subtract to describe the variability of the middle half.\n\nWhat is the interquartile range (IQR) in minutes?';visualHtml=box(values);why='IQR = Q3 − Q1 = '+five[3]+' − '+five[1]+' = '+iqr+'. The median-of-halves convention excludes the median when n is odd.';mistake='Confusing the entire range with the middle 50%';add(answer);add(five[4]-five[0]);add(iqr+2);add(Math.max(0,iqr-2))}
 if(skill==='histogram'){lessonId='d772-s2-l3-1';const counts=values;const peak=Math.max(...counts);answer='Unimodal';prompt='A school counselor bins assessment scores into consecutive, equal-width intervals. Review the bars, locate the highest frequency, and count the distinct main peaks before naming the shape.\n\nWhich term best describes the modality of this distribution?';visualHtml=histogram(counts);why='Modality refers to the number of main peaks. This distribution has one main peak (frequency '+peak+'), so it is unimodal.';mistake='Confusing right skew with the number of peaks';add(answer);add('Bimodal');add('Uniform');add('Multimodal')}
 if(skill==='scatterplot'){lessonId='d772-s2-l2-3';answer='Positive association';prompt='Nine students report practice hours and receive performance scores. The scatterplot shows both numerical variables. Evaluate the direction of the relationship, then decide whether these observational pairs support a causal claim.\n\nWhich conclusion is supported by the data?';visualHtml=scatter(values);why='As x increases, y generally increases. Association does not establish causation.';mistake='Confusing direction with strength or causal proof';add(answer);add('Negative association');add('No association');add('Proven causation')}
 if(skill==='probability'){lessonId='d772-s3-l2-1';const [g,p]=values;answer=String(g*(g-1))+'/'+String((g+p)*(g+p-1));const num=g*(g-1),den=(g+p)*(g+p-1),gcd=(a,b)=>b?gcd(b,a%b):a,div=gcd(num,den);answer=(num/div)+'/'+(den/div);prompt='A teacher prepares '+g+' green discussion cards and '+p+' purple cards for random classroom roles. Two cards are drawn without replacement. Use the multiplication rule, updating the favorable and total counts after the first draw.\n\nWhat is the probability that both cards are green?';visualHtml=probability(g,p);why='Multiply '+g+'/'+(g+p)+' by '+(g-1)+'/'+(g+p-1)+' to obtain '+answer+'.';mistake='Forgetting the denominator and numerator change without replacement';add(answer);add(fraction(g,g+p));add(fraction(g*g,(g+p)*(g+p)));add(fraction(g-1,g+p-1))}
 if(!prompt||!answer)return null;
 for(let offset=1;options.length<4&&offset<30;offset++){const base=Number(answer);if(Number.isFinite(base)){add(base+offset);add(base-offset)}else if(skill==='probability'){add((offset+1)+'/'+(g=>g)(values[0]+values[1]+offset+2))}else add('Alternative '+offset)}
 const choices=options.slice(0,4);if(choices.length<4)return null;for(let i=choices.length-1;i>0;i--){const j=randint(0,i);[choices[i],choices[j]]=[choices[j],choices[i]]}
 const q={id,course:'D772',learningPathLessonId:lessonId,skill,difficulty,data:values,prompt,answer,options:choices,visualHtml,why,misconception:mistake,teachBackPrompt:'A student makes this mistake: '+mistake+'. Model a correction and check understanding.',generated:true,format:'single-best-answer',sourceLabel:'MAJICK ORIGINAL • SUPPLEMENTAL OA-STYLE PRACTICE — NOT OFFICIAL WGU',languageReference:'wgu-d772-preassessment-2026-10-15',source:'verified-local-generator'};
 return validate(q)?q:null;
}
function validate(q){
 if(!q||!q.visualHtml?.includes('<svg')||!q.options?.includes(q.answer)||!Array.isArray(q.data))return false;
 const expectedLesson={mean:'d772-s2-l4-1',median:'d772-s2-l4-1',boxplot:'d772-s2-l4-3',histogram:'d772-s2-l3-1',scatterplot:'d772-s2-l2-3',probability:'d772-s3-l2-1'};
 if(q.learningPathLessonId!==expectedLesson[q.skill])return false;
 if(!/<figure[^>]*>[\s\S]*<svg/.test(q.visualHtml)||new Set(q.options).size!==4)return false;
 const v=q.data;
 if(!v.every(x=>typeof x==='number'&&Number.isFinite(x)||Array.isArray(x)&&x.every(n=>typeof n==='number'&&Number.isFinite(n))))return false;
 let expected;
 switch(q.skill){
  case 'mean':expected=String(v.reduce((a,b)=>a+b,0)/v.length);break;
  case 'median':expected=String(median(v));break;
  case 'boxplot':{const five=quartiles(v);expected=String(five[3]-five[1]);break}
  case 'histogram':expected=String(v.filter((n,i)=>n===Math.max(...v)).length===1?'Unimodal':'Bimodal');break;
  case 'scatterplot':expected='Positive association';if(v.length<2||!v.every(p=>Array.isArray(p)&&p.length===2))return false;break;
  case 'probability':{const [g,p]=v;if(!(g>1&&p>0))return false;let a=g*(q.event==='green-purple'?p:g-1),b=(g+p)*(g+p-1);const gcd=(x,y)=>y?gcd(y,x%y):x,k=gcd(a,b);expected=(a/k)+'/'+(b/k);break}
  default:return false;
 }
 return expected===String(q.answer);
}
function generate(skill='boxplot',difficulty=2){
 const ordinal=window.MajickLearningContinuity?.nextGuidedSequence?.('generated:'+skill)||serial+1,k=ordinal+30,n=difficulty>=3?9:7,step=2+ordinal%3;
 let vals=Array.from({length:n},(_,i)=>k+i*step);
 if(skill==='mean')vals=[k-6,k-3,k,k+3,k+6];
 if(skill==='median')vals=[...vals.slice(1),vals[0]];
 if(skill==='histogram')vals=[8+k,5+(k%3),3+(k%2),2,1];
 if(skill==='scatterplot')vals=Array.from({length:9},(_,i)=>[i+1,(i+1)*(.6+.2*k/(k+20))]);
 if(skill==='probability')vals=[13+ordinal,12+2*ordinal];
 return item(skill,vals,difficulty);
}
// Persisted ordinal selects a new dataset; IDs alone do not establish freshness.
function probabilityCase(ordinal=0,transfer=false){
 if(!Number.isInteger(ordinal)||ordinal<0||ordinal>=180)return null;
 const g=3+ordinal%6,p=2+Math.floor(ordinal/6),q=item('probability',[g,p],3);
 q.id='connected-probability-'+ordinal;q.connectedProbability=true;q.event=transfer?'green-purple':'green-green';
 q.topicId=q.learningPathLessonId;q.section='Section 3 · Probability';q.misconceptionId='unchanged-sample-space';q.rigor='multi-step-conditional-reasoning';q.sourceLabel='Original simulated practice; not official WGU questions';
 if(transfer){
  const n=g*p,d=(g+p)*(g+p-1),gcd=(a,b)=>b?gcd(b,a%b):a,k=gcd(n,d);
  q.answer=(n/k)+'/'+(d/k);
  q.prompt='A teacher randomly assigns classroom roles using '+g+' green reader cards and '+p+' purple recorder cards. Two cards are drawn without replacement. What is P(reader first AND recorder second)?';
  q.why='Multiply '+g+'/'+(g+p)+' by '+p+'/'+(g+p-1)+'. Removing a green card leaves the purple count unchanged but reduces the total.';
  q.options=[q.answer,fraction(g,g+p),fraction(p,g+p-1),fraction(g*p,(g+p)*(g+p))];
  q.options=q.options.map((_,i,a)=>a[(i+ordinal%4)%4]);
  for(let i=2;q.options.length<4;i++)if(!q.options.includes('1/'+(g+p+i)))q.options.push('1/'+(g+p+i));
 }
 return q;
}
function batch(count=10,difficulty=2){const skills=['mean','median','boxplot','histogram','scatterplot','probability'],out=[];for(let i=0;i<count;i++){const q=generate(skills[i%skills.length],difficulty);if(q)out.push(q)}return out}
function mountLab(root,lessonText){
 if(!root||!window.S||window.S.activeCourse!=='D772')return;
 // The campus may invoke this after delayed renders. Never replace an active
 // learner's typed responses or attach duplicate event controls.
 const lessonKey=String(lessonText||'').trim();
 const prior=root.querySelector(':scope > .majickGeneratedLab');
 if(prior?.dataset.lessonKey===lessonKey)return;
 if(prior)prior.remove();
 const title=String(lessonText||'').toLowerCase();
 const skill=/probab|replacement|sample space/.test(title)?'probability':/scatter|association/.test(title)?'scatterplot':/histogram|distribution|skew|modality/.test(title)?'histogram':/quartile|box.plot|five.number/.test(title)?'boxplot':/median/.test(title)?'median':/mean|statistics|descriptive/.test(title)?'mean':null;
 if(!skill)return;
 const guided=generate(skill,2);if(!guided)return;
 let independent=null,completed=false;
 const section=document.createElement('section');section.className='majickGeneratedLab';section.dataset.lessonKey=lessonKey;
 section.style.cssText='border:1px solid #c1a476;border-radius:15px;background:#32253e;color:#fff0db;padding:16px;margin:16px 0';
 const field=(id,label,rows=0)=>'<label style="display:block;margin:12px 0">'+E(label)+(rows?'<textarea data-lab-field="'+id+'" rows="'+rows+'" style="display:block;width:100%;padding:10px;background:#fff8ed;color:#261b2e"></textarea>':'<input data-lab-field="'+id+'" style="display:block;width:100%;max-width:390px;padding:10px;background:#fff8ed;color:#261b2e" autocomplete="off">')+'</label>';
 section.innerHTML='<h4>✦ Generated Data Workshop · Worked example → Independent application → Teach-back</h4><p><b>1 · Study the scenario.</b> '+E(guided.prompt)+'</p>'+guided.visualHtml+'<p><b>2 · Whiteboard setup.</b> Identify the values or event, write the appropriate method and check that the displayed data agree with your calculation.</p><p><b>Worked solution:</b> '+E(guided.why)+' <b>Result:</b> '+E(guided.answer)+'.</p><p><b>3 · Guided reconstruction.</b> Solve the same scenario after studying the explanation. Guided work does not count as independent mastery.</p>'+field('guided','Recalculate the worked example')+field('reason','Explain why the method applies',3)+'<button type="button" data-lab-guided>Check guided reasoning</button><p data-lab-guided-feedback role="status"></p><hr><h4>4 · Fresh independent application</h4><p>Use a different data set, without consulting the worked solution. Submit before viewing the answer.</p><div data-lab-independent></div><button type="button" data-lab-new>Generate a different independent problem</button><hr><h4>5 · Teach the correction</h4><p>A student makes this error: '+E(guided.misconception)+'. Explain the misconception, model the correct method, and ask a different diagnostic question.</p>'+field('teach','Your explanation, visual/model, and exit question',4)+'<button type="button" data-lab-teach>Review my teaching plan</button><p data-lab-teach-feedback role="status"></p><p><small>Majick original supplemental practice, not official WGU material. Automatic feedback on writing checks structure, not the quality of your teaching. This workshop does not independently certify mastery.</small></p>';
 // Surface existing cross-room misconception evidence instead of opening a parallel tracker.
 const lessonNeed=window.MajickLearningContinuity?.needs?.('D772')?.find(x=>x.lessonId===guided.learningPathLessonId);
 if(lessonNeed){
  const notice=document.createElement('p');
  notice.className='majickGeneratedRemediation';
  notice.style.cssText='padding:12px;border-left:4px solid #e7bb74;background:#422b52;color:#fff3dc';
  const lastError=window.S?.progress?.D772?.adaptiveSkills?.[guided.learningPathLessonId]?.errors?.slice(-1)[0];
  const misconception=lastError?.kind==='calculation-or-formula'
    ?'Recheck the sample size, write the formula, and substitute the actual dataset before calculating.'
    :lastError?.kind==='visual-interpretation'
    ?'Identify both axes, their units and the plotted distribution before choosing an interpretation.'
    :'Read the scenario carefully and state what evidence supports the conclusion.';
  notice.textContent='Connected review: '+lessonNeed.struggles+' difficulty attempt(s) across your study areas. '+misconception+' Study the visual, then reconstruct the answer and try a fresh independent question. Guided work never certifies mastery.';
  section.insertBefore(notice,section.querySelector('[data-lab-independent]').previousElementSibling);
 }
 root.appendChild(section);
 // A physical data-building step belongs to this workshop owner, not a new game engine.
 if(skill==='boxplot'||skill==='median'){
  const ordered=[],numbers=guided.data.map((value,index)=>({value,index}));
  const work=document.createElement('div');
  work.className='majickHandsOnData';
  work.style.cssText='margin:12px 0;padding:12px;border:1px solid #d8b674;border-radius:12px;background:#241a31;color:#fff5e8';
  work.innerHTML='<h5>✦ Build the data display yourself</h5><p>Tap each observation from smallest to largest. Equal values must each be included. Then check your ordered data before interpreting the plot.</p><div data-sort-pool style="display:flex;flex-wrap:wrap;gap:8px"></div><p data-sort-built role="status">Ordered observations: none selected</p><button type="button" data-sort-check>Check ordered data</button> <button type="button" data-sort-clear>Clear selection</button><p data-sort-feedback role="status"></p>';
  const pool=work.querySelector('[data-sort-pool]'),built=work.querySelector('[data-sort-built]'),feedback=work.querySelector('[data-sort-feedback]');
  function updateSort(){
   pool.replaceChildren();
   numbers.forEach(n=>{
    const button=document.createElement('button');button.type='button';button.textContent=String(n.value);
    button.disabled=ordered.includes(n.index);button.setAttribute('aria-label','Add observation '+n.value);
    button.style.cssText='min-width:44px;min-height:44px;background:#594269;color:#fff8ef;border:1px solid #d8b674;border-radius:8px';
    button.onclick=()=>{ordered.push(n.index);feedback.textContent='';updateSort()};
    pool.append(button);
   });
   built.textContent='Ordered observations: '+(ordered.length?ordered.map(i=>numbers[i].value).join(', '):'none selected');
  }
  work.querySelector('[data-sort-clear]').onclick=()=>{ordered.length=0;feedback.textContent='Selection cleared. Try this same dataset again.';updateSort()};
  work.querySelector('[data-sort-check]').onclick=()=>{
   const given=ordered.map(i=>numbers[i].value),expected=[...guided.data].sort((a,b)=>a-b);
   const right=given.length===expected.length&&given.every((v,i)=>v===expected[i]);
   feedback.textContent=right
    ?'Correct ordering. '+(skill==='boxplot'?'Find Q1 and Q3 from the lower and upper halves, then subtract for IQR.':'Find the middle observation or average the two middle observations.')
    :'Not yet. Compare the smallest remaining values; every observation must appear exactly once. Clear and resubmit without losing your lesson.';
   if(right){
    if(!work.dataset.celebrated){
     work.dataset.celebrated='true';
     window.MajickAnimationEffects?.play?.('success',{target:work.querySelector('[data-sort-check]'),label:'Data ordered'});
    }
   }else window.MajickLearningContinuity?.record?.({courseId:'D772',term:guided.learningPathLessonId,lessonTitle:lessonText,correct:false,activity:'hands-on-sort-guided',question:guided});
  };
  updateSort();
  section.querySelector('[data-lab-guided]').before(work);
 }
 const input=name=>section.querySelector('[data-lab-field="'+name+'"]');
 section.querySelector('[data-lab-guided]').onclick=()=>{
  const correct=input('guided').value.trim()===String(guided.answer),reason=input('reason').value.trim();
  section.querySelector('[data-lab-guided-feedback]').textContent=(correct?'Correct reconstruction. ':'Check the result using the matching visual. ')+(reason.length>=35?'Compare your explanation with the worked solution above.':'Name the operation, the evidence, and why it fits this question.')+' Guided work is not independent mastery.';
  window.MajickLearningContinuity?.record?.({courseId:'D772',term:guided.learningPathLessonId,lessonTitle:lessonText,correct,activity:'generated-lab-guided',question:guided});
 };
 const host=section.querySelector('[data-lab-independent]');
 function fresh(){
  const previous=independent&&JSON.stringify(independent.data);
  let q=null;for(let n=0;n<35;n++){const candidate=generate(skill,3);if(candidate&&JSON.stringify(candidate.data)!==JSON.stringify(guided.data)&&JSON.stringify(candidate.data)!==previous){q=candidate;break}}
  independent=q;completed=false;
  if(!q){host.textContent='A different dataset could not be produced. Previous evidence is retained; try again later.';return}
  const recovery=window.MajickLearningContinuity?.practiceRecovery?.(q,false);
  if(recovery?.required&&recovery.source){
   if(!window.MajickSolutionEngine?.mountReconstruction?.(host,recovery.source,fresh))host.textContent='Guided reconstruction is loading. Your attempts are preserved.';
   return;
  }
  if(q.generated&&(recovery?.failedData||[]).includes(JSON.stringify(q.data))){host.textContent='A fresh dataset is required after guided repair. Select a new independent problem; your evidence is preserved.';return}
  host.innerHTML='<p>'+E(q.prompt)+'</p>'+q.visualHtml+field('independent','Your independent answer')+field('independent-why','Show your whiteboard reasoning and interpretation',3)+'<button type="button" data-lab-submit>Submit independent response</button><p data-lab-independent-feedback role="status"></p>';
  host.querySelector('[data-lab-submit]').onclick=()=>{
   if(completed)return;completed=true;
   const answer=host.querySelector('[data-lab-field="independent"]').value.trim(),explanation=host.querySelector('[data-lab-field="independent-why"]').value.trim(),correct=answer===String(q.answer);
   host.querySelector('[data-lab-independent-feedback]').textContent=(correct?'Correct. ':'Not yet. ')+(explanation.length<35?'Strengthen your written reasoning: name the method and explain the result in context. ':'Compare your interpretation against the scenario. ')+'Worked reasoning: '+q.why+' This is a formative independent attempt, not automatically certified mastery.';
   host.querySelector('[data-lab-submit]').disabled=true;
   if(!correct){
    const repair=document.createElement('button');repair.type='button';repair.dataset.labRepair='';
    repair.textContent='Repair this skill with guided steps';
    repair.onclick=()=>{
     section.querySelector('[data-lab-guided]')?.scrollIntoView({block:'center',behavior:'instant'});
     section.querySelector('[data-lab-field="guided"]')?.focus();
     host.querySelector('[data-lab-independent-feedback]').textContent='Your earlier attempt is saved. Rebuild the method using the worked visual and hands-on steps, then select a fresh independent problem. This repair will not award independent mastery.';
    };
    host.querySelector('[data-lab-independent-feedback]').after(repair);
   }
   window.MajickLearningContinuity?.record?.({courseId:'D772',term:q.learningPathLessonId,lessonTitle:lessonText,correct,activity:'generated-lab-independent-formative',question:q});
   // Share formative result with the existing adaptive skill tracker. The
   // origin is not independent-transfer, so this NEVER grants mastery.
   window.MajickLearningContinuity?.skillResult?.(q,correct,false,'generated-lab-independent-formative');
   window.save?.();
  };
 }
 section.querySelector('[data-lab-new]').onclick=fresh;
 section.querySelector('[data-lab-teach]').onclick=()=>{
  const text=input('teach').value.trim(),hasModel=/show|model|counter|sort|plot|draw|visual|calculate|demonstrate/i.test(text),hasCheck=/ask|check|exit|question|try|explain/i.test(text);
  section.querySelector('[data-lab-teach-feedback]').textContent='Teaching rubric: '+(text.length>=80?'✓ detailed explanation; ':'add a clear explanation; ')+(hasModel?'✓ proposed model; ':'name a specific visual or model; ')+(hasCheck?'✓ proposed understanding check.':'add a fresh diagnostic exit question.')+' Automatic checks cannot verify conceptual accuracy; compare with the worked solution. No mastery credit awarded.';
 };
 fresh();
}
window.MajickGeneratedPractice=Object.freeze({generate,batch,validate,probabilityCase,median,quartiles,render:{dots,box,histogram,scatter,probability},mountLab});
})();