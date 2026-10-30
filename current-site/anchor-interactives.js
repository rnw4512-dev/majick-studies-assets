(()=>{'use strict';
if(window.MajickAnchorInteractives)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const el=(tag,props={},value='')=>{const x=document.createElement(tag);Object.entries(props).forEach(([k,v])=>x.setAttribute(k,v));if(value)x.textContent=value;return x};
function addBox(host){
 const q=window.MajickGeneratedPractice?.generate('boxplot',2);if(!q)return;
 const truth=window.MajickGeneratedPractice.quartiles(q.data),card=el('section',{'class':'mjConstructActivity'});
 card.append(el('h4',{},'Construct the five-number summary'),el('p',{},'Order the values and place the five markers on the number line: '+q.data.join(', ')));
 const fig=el('div',{'class':'mjConstructFigure'});card.append(fig);
 const entries=el('div',{'class':'mjConstructInputs'}),labels=['Minimum','Q1','Median','Q3','Maximum'],inputs=[];
 for(let i=0;i<5;i++){const lab=el('label',{},labels[i]+' '),inp=el('input',{type:'number',step:'0.5','aria-label':labels[i]});lab.append(inp);entries.append(lab);inputs.push(inp)}
 card.append(entries);
 const feedback=el('p',{role:'status'}),check=el('button',{type:'button'},'Check my construction'),refresh=el('button',{type:'button'},'New dataset');
 const render=()=>{const v=inputs.map(x=>x.value===''?null:Number(x.value)),a=truth[0],span=truth[4]-a||1;const xx=t=>40+(t-a)/span*420;const points=v.map((t,i)=>t===null?'': '<circle cx="'+Math.max(30,Math.min(470,xx(t)))+'" cy="78" r="7" fill="#ead0fb"/><text x="'+Math.max(30,Math.min(470,xx(t)))+'" y="108" text-anchor="middle" fill="#fff3de" font-size="12">'+esc(labels[i])+'</text>').join('');fig.innerHTML='<svg viewBox="0 0 500 128" role="img" aria-label="Your editable five-number summary"><path d="M35 78H475" stroke="#fff3de" stroke-width="3"/>'+points+'</svg>'};
 inputs.forEach(x=>x.addEventListener('input',render));check.onclick=()=>{const valid=inputs.every((x,i)=>x.value!==''&&Math.abs(Number(x.value)-truth[i])<.001);feedback.textContent=valid?'Correct: all five markers are placed. IQR = '+(truth[3]-truth[1])+'. Now explain what the middle 50% represents.':'Check the sorted values and calculate the median of each half; no grade was recorded.'};
 refresh.onclick=()=>{card.remove();addBox(host)};card.append(check,refresh,feedback);host.append(card);render();
}
function addCounters(host){
 const g=3+Math.floor(Math.random()*3),p=2+Math.floor(Math.random()*3),card=el('section',{'class':'mjConstructActivity'});
 card.append(el('h4',{},'Probability cauldron · without replacement'),el('p',{},'Draw two counters. Observe how the sample space changes after the first draw.'));
 let available=Array(g).fill('green').concat(Array(p).fill('purple')),draws=[];
 const display=el('div',{'class':'mjCounters'}),feedback=el('p',{role:'status'});
 const paint=()=>{display.replaceChildren();available.forEach((c,i)=>{const b=el('button',{type:'button','aria-label':'Draw '+c+' counter','class':'mjCounter '+c},'●');b.onclick=()=>{if(draws.length>=2)return;draws.push(c);available.splice(i,1);paint()};display.append(b)});feedback.textContent=draws.length?'Draws: '+draws.join(' → ')+'. Remaining: '+available.length+'.':'Start: '+g+' green and '+p+' purple counters.'};
 const reset=el('button',{type:'button'},'Reset counters'),work=el('button',{type:'button'},'Show probability tree & whiteboard');
 reset.onclick=()=>{available=Array(g).fill('green').concat(Array(p).fill('purple'));draws=[];paint()};
 work.onclick=()=>{const fraction=(g*(g-1))+'/'+((g+p)*(g+p-1));feedback.textContent='P(two greens without replacement) = '+g+'/'+(g+p)+' × '+(g-1)+'/'+(g+p-1)+' = '+fraction+'. The denominator changes because one counter was removed.'};
 card.append(display,reset,work,feedback);host.append(card);paint()
}
function addGraphLanguage(host,key){
 const card=el('section',{'class':'mjConstructActivity'}),title=el('h4',{},'WGU graph interpretation · academic vocabulary');
 card.append(title);
 const prompt=key==='histogram'?'Choose the complete interpretation of a frequency histogram.':'Choose the defensible interpretation of an upward-trending scatterplot.';
 card.append(el('p',{},prompt));
 const choices=key==='histogram'?['Read equal-width quantitative intervals, examine modality, skewness, center, spread and outliers.','The tallest bar always identifies the mean.','A histogram is a display of two categorical variables.']:['Positive association between explanatory and response variables does not establish causation.','Any positive association proves the explanatory variable causes the response.','Positive means the points have no trend.'];
 const box=el('div'),feedback=el('div',{role:'status'});choices.forEach((t,i)=>{const b=el('button',{type:'button'},t);b.onclick=()=>{if(i===0)feedback.textContent='Correct WGU terminology. '+choices[0];else{const q={id:'graph-language:'+key,courseId:window.S?.activeCourse,lessonId:key,prompt,options:choices,answer:choices[0],why:choices[0]};window.MajickQuestionRepair.recordWrong(q,t,{assisted:true,room:'anchor-graph'});feedback.innerHTML=window.MajickQuestionRepair.html(q,t)}};box.append(b)});card.append(box,feedback);host.append(card)
}
function mount(host,key){if(!host)return;host.replaceChildren();if(key==='boxplot'||key==='median')addBox(host);else if(key==='probability')addCounters(host);else if(key==='histogram'||key==='graph')addGraphLanguage(host,key);else host.append(el('p',{},'Use the worked examples and whiteboard setup above.'))}
const css=el('style');css.textContent='.mjConstructActivity{margin:14px 0;padding:14px;background:#392846;border:1px solid #cbb28a;border-radius:14px;color:#fff5e3}.mjConstructActivity p,.mjConstructActivity h4,.mjConstructActivity label{color:#fff5e3!important}.mjConstructActivity button{margin:5px;padding:9px 12px;background:#765a87;color:white;border:1px solid #e6cc9e;border-radius:9px;cursor:pointer}.mjConstructInputs{display:flex;gap:12px;flex-wrap:wrap}.mjConstructInputs label{display:grid;gap:5px}.mjConstructInputs input{width:95px;padding:8px;background:#fff8ea;color:#241831;border-radius:6px}.mjCounters{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.mjCounters .mjCounter{font-size:26px;border-radius:50%;width:54px;height:54px}.mjCounter.green{background:#367b5c}.mjCounter.purple{background:#7952aa}.mjConstructFigure svg{max-width:100%;width:100%}';document.head.append(css);
window.MajickAnchorInteractives={mount};
})();