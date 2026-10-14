/* Majick Studies · zero-cost, deterministic D772 question and SVG engine */
(()=>{'use strict';if(window.MajickGeneratedPractice)return;
const E=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let serial=0;const randint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const median=a=>{const x=[...a].sort((m,n)=>m-n),n=x.length;return n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2};
const quartiles=a=>{const x=[...a].sort((m,n)=>m-n),n=x.length,half=Math.floor(n/2),q1=median(x.slice(0,half)),q3=median(x.slice(n-half));return [x[0],q1,median(x),q3,x[n-1]]};
const frame=(title,plot,alt)=>'<figure class="majickGeneratedFigure" style="background:#22162e;color:#fbeacd;padding:12px;border-radius:12px;border:1px solid #c9a97b"><figcaption><b>'+E(title)+'</b></figcaption><svg role="img" aria-label="'+E(alt)+'" viewBox="0 0 500 275" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:680px;margin:auto">'+plot+'</svg></figure>';
const tx=(x,y,v)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#fff1d6" font-size="13">'+E(v)+'</text>';
const axis='<path d="M55 20V225H475" fill="none" stroke="#fff1d6" stroke-width="2"/>';
function dots(vals){const lo=Math.min(...vals),hi=Math.max(...vals),span=hi-lo||1;let plot=axis;const seen={};vals.forEach(v=>{const x=65+(v-lo)/span*390,j=seen[v]||0;seen[v]=j+1;plot+='<circle cx="'+x+'" cy="'+(210-22*j)+'" r="8" fill="#bca0f0"/>'});plot+=tx(70,245,lo)+tx(455,245,hi)+tx(260,264,'Value');return frame('Dot plot',plot,'Dot plot of '+vals.join(', '))}
function box(vals){const five=quartiles(vals),lo=five[0],span=five[4]-lo||1,x=v=>65+(v-lo)/span*390;let plot=axis+'<path d="M'+x(five[0])+' 130H'+x(five[4])+'" stroke="#caa7f2" stroke-width="4"/><rect x="'+x(five[1])+'" y="94" width="'+Math.max(1,x(five[3])-x(five[1]))+'" height="72" fill="#784b9d" stroke="#f5dfa9" stroke-width="2"/><path d="M'+x(five[2])+' 94V166 M'+x(five[0])+' 112V148 M'+x(five[4])+' 112V148" stroke="#fff1d6" stroke-width="3"/>';five.forEach((v,i)=>plot+=tx(x(v),i%2?194:212,v));return frame('Box plot',plot,'Five-number summary minimum '+five.join(', Q1 median Q3 maximum in order: '))}
function histogram(counts){const max=Math.max(...counts,1),w=370/counts.length;let plot=axis;counts.forEach((n,i)=>{const height=n/max*168,x=67+i*w;plot+='<rect x="'+x+'" y="'+(225-height)+'" width="'+w+'" height="'+height+'" stroke="#d9bf9a" fill="#8553ab"/>'+tx(x+w/2,243,(i*10)+'–'+(i*10+9))+tx(x+w/2,Math.max(18,216-height),n)});return frame('Histogram · equal-width intervals',plot,'Frequencies in successive equal-width groups: '+counts.join(', '))}
function scatter(points){let plot=axis;points.forEach(([x,y])=>plot+='<circle cx="'+(62+x*36)+'" cy="'+(220-y*17)+'" r="6" fill="#e5b9e9"/>');plot+=tx(260,260,'x')+tx(25,20,'y');return frame('Scatterplot',plot,'Ordered pairs: '+points.map(p=>p.join(' comma ')).join('; '))}
function probability(green,purple){const circles=(count,y,color)=>Array.from({length:count},(_,i)=>'<circle cx="'+(90+i*52)+'" cy="'+y+'" r="18" fill="'+color+'" stroke="#fff1d6"/>').join('');const plot=circles(green,80,'#74bf8c')+circles(purple,150,'#b490d1')+tx(250,230,green+' green + '+purple+' purple = '+(green+purple)+' total');return frame('Probability counters',plot,green+' green counters and '+purple+' purple counters')}
function item(skill,values,difficulty){
 const id='gen-d772-'+skill+'-'+Date.now().toString(36)+'-'+(++serial),options=[],add=x=>{const t=String(x);if(!options.includes(t))options.push(t)};
 let prompt,answer,visualHtml,why,lessonId='d772-s2-l4',mistake;
 if(skill==='mean'){const sum=values.reduce((a,b)=>a+b,0),m=sum/values.length;answer=String(m);prompt='A teacher records these scores: '+values.join(', ')+'. What is the mean?';visualHtml=dots(values);why='Add the '+values.length+' values ('+sum+') and divide by '+values.length+'.';mistake='Dividing by the wrong number of observations';add(answer);add(m+1);add(m-1);add(m+2)}
 if(skill==='median'){answer=String(median(values));prompt='Use the dot plot. What is the median of these scores?';visualHtml=dots(values);why='Sort all values, then identify the middle observation(s).';mistake='Finding the middle before sorting';add(answer);add(Number(answer)+2);add(Number(answer)-2);add(values[0])}
 if(skill==='boxplot'){const five=quartiles(values),iqr=five[3]-five[1];answer=String(iqr);prompt='Using the displayed box plot, calculate the interquartile range (IQR).';visualHtml=box(values);why='IQR = Q3 − Q1 = '+five[3]+' − '+five[1]+' = '+iqr+'. The median-of-halves convention excludes the median when n is odd.';mistake='Confusing the entire range with the middle 50%';add(answer);add(five[4]-five[0]);add(iqr+2);add(Math.max(0,iqr-2))}
 if(skill==='histogram'){lessonId='d772-s2-l3';const counts=values;const peak=Math.max(...counts);answer='Unimodal';prompt='Examine this histogram. How many meaningful peaks (modes) does the displayed distribution have?';visualHtml=histogram(counts);why='There is one main peak (frequency '+peak+'), so the distribution is unimodal.';mistake='Confusing right skew with the number of peaks';add(answer);add('Bimodal');add('Uniform');add('Multimodal')}
 if(skill==='scatterplot'){lessonId='d772-s2-l2';answer='Positive association';prompt='What direction of association does the scatterplot show?';visualHtml=scatter(values);why='As x increases, y generally increases. Association does not establish causation.';mistake='Confusing direction with strength or causal proof';add(answer);add('Negative association');add('No association');add('Proven causation')}
 if(skill==='probability'){lessonId='d772-s3-l3';const [g,p]=values;answer=String(g*(g-1))+'/'+String((g+p)*(g+p-1));const num=g*(g-1),den=(g+p)*(g+p-1),gcd=(a,b)=>b?gcd(b,a%b):a,div=gcd(num,den);answer=(num/div)+'/'+(den/div);prompt='A bag contains the displayed counters. What is the probability of drawing two green counters without replacement?';visualHtml=probability(g,p);why='Multiply '+g+'/'+(g+p)+' by '+(g-1)+'/'+(g+p-1)+' to obtain '+answer+'.';mistake='Forgetting the denominator and numerator change without replacement';add(answer);add((g+'/'+(g+p)));add('1/2');add('1/'+(g+p))}
 if(!prompt||!answer)return null;
 for(let offset=1;options.length<4&&offset<30;offset++){const base=Number(answer);if(Number.isFinite(base)){add(base+offset);add(base-offset)}else if(skill==='probability'){add((offset+1)+'/'+(g=>g)(values[0]+values[1]+offset+2))}else add('Alternative '+offset)}
 const choices=[...options];if(choices.length<4)return null;for(let i=choices.length-1;i>0;i--){const j=randint(0,i);[choices[i],choices[j]]=[choices[j],choices[i]]}
 const q={id,course:'D772',learningPathLessonId:lessonId,skill,difficulty,data:values,prompt,answer,options:choices,visualHtml,why,misconception:mistake,teachBackPrompt:'A student makes this mistake: '+mistake+'. Model a correction and check understanding.',generated:true,source:'verified-local-generator'};
 return validate(q)?q:null;
}
function validate(q){
 if(!q||!q.visualHtml?.includes('<svg')||!q.options?.includes(q.answer)||!Array.isArray(q.data))return false;
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
  case 'probability':{const [g,p]=v;if(!(g>1&&p>0))return false;let a=g*(g-1),b=(g+p)*(g+p-1);const gcd=(x,y)=>y?gcd(y,x%y):x,k=gcd(a,b);expected=(a/k)+'/'+(b/k);break}
  default:return false;
 }
 return expected===String(q.answer);
}
function generate(skill='boxplot',difficulty=2){const n=difficulty>=3?9:7,base=randint(3,9),step=randint(2,4);let vals=Array.from({length:n},(_,i)=>base+i*step);if(skill==='mean'){const m=randint(8,16);vals=[m-6,m-3,m,m+3,m+6]}if(skill==='median')vals=vals.sort(()=>Math.random()-.5);
 if(skill==='histogram')vals=[randint(8,13),randint(5,7),randint(3,4),2,1];
 if(skill==='scatterplot')vals=Array.from({length:9},(_,i)=>[i+1,Math.min(10,i+1+randint(-1,1))]);
 if(skill==='probability')vals=[randint(3,5),randint(2,4)];
 return item(skill,vals,difficulty)
}
function batch(count=10,difficulty=2){const skills=['mean','median','boxplot','histogram','scatterplot','probability'],out=[];for(let i=0;i<count;i++){const q=generate(skills[i%skills.length],difficulty);if(q)out.push(q)}return out}
function mountLab(root,lessonText){
 if(!root||!window.S||window.S.activeCourse!=='D772')return;
 const text=String(lessonText||'').toLowerCase();
 let skill=/probab|replacement|sample space/.test(text)?'probability':/scatter|association/.test(text)?'scatterplot':/histogram|distribution|skew|modality/.test(text)?'histogram':/quartile|box.plot|five.number/.test(text)?'boxplot':/median/.test(text)?'median':/mean|statistics|descriptive/.test(text)?'mean':null;
 if(!skill)return;
 const q=generate(skill,2);if(!q)return;
 const section=document.createElement('section');section.className='majickGeneratedLab';section.style.cssText='border:1px solid #c1a476;border-radius:15px;background:#32253e;color:#fff0db;padding:16px;margin:16px 0';
 section.innerHTML='<h4>✦ Generated Data Workshop · Five Learning Stages</h4><p><b>1 · Observe:</b> Read the complete graph and describe what the axes, values, or counters show.</p>'+q.visualHtml+'<p><b>2 · Interpret:</b> '+E(q.prompt)+'</p><label>Independent answer <input data-answer style="display:block;width:100%;max-width:340px;padding:10px;margin:8px 0" autocomplete="off"></label><p><b>3 · Explain:</b> Show your method or whiteboard steps.</p><textarea data-reason rows="3" style="width:100%;padding:10px" placeholder="I used the values because…"></textarea><p><b>4 · Transfer:</b> Create a new data set and solve without hints.</p><button type="button" data-fresh class="btn ghost">Generate new data →</button><p><b>5 · Teach:</b> A student is struggling with this mistake: '+E(q.misconception)+'. How would you model and check a correction?</p><textarea data-teach rows="3" style="width:100%;padding:10px" placeholder="I would show my student…"></textarea><div><button type="button" data-check class="btn primary">Check calculation and coach me</button></div><p data-feedback role="status" aria-live="polite">Written reasoning and teaching are coaching tasks, not automatically certified mastery.</p>';
 root.appendChild(section);
 section.querySelector('[data-fresh]').onclick=()=>{section.remove();mountLab(root,lessonText)};
 section.querySelector('[data-check]').onclick=()=>{
  const answer=section.querySelector('[data-answer]').value.trim(),correct=answer===String(q.answer);
  const reason=section.querySelector('[data-reason]').value.trim(),teach=section.querySelector('[data-teach]').value.trim();
  const feedback=section.querySelector('[data-feedback]');
  feedback.textContent=(correct?'Correct calculation. ':'Check the calculation again. ')+(reason.length<25?'Explain the evidence and steps in more detail. ':'Your reasoning has been saved for self-review. ')+(teach.length<35?'Describe what you would model and how you would check understanding. ':'Compare your teaching strategy with the misconception and worked solution. ')+ 'Worked reasoning: '+q.why+' This guided workshop does not count as independent mastery.';
  try{window.MajickLearningContinuity?.record?.({courseId:'D772',lessonTitle:lessonText,term:q.learningPathLessonId,correct:correct&&reason.length>=25,activity:'generated-lab-guided'})}catch(_){}
 };
}
window.MajickGeneratedPractice=Object.freeze({generate,batch,validate,median,quartiles,render:{dots,box,histogram,scatter,probability},mountLab});
})();