(()=>{'use strict';
if(window.MajickD772MisrepresentationLab)return;
const LESSON='d772-s1-l3';
const TYPES=['truncated','icons','pie','significance'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function state(){
 const p=window.S?.progress?.D772;if(!p)return null;
 return p.misrepresentationLab||(p.misrepresentationLab={version:1,cases:{},attempts:[],teacherDraft:'',teacherResponses:[]});
}
function persist(){try{if(typeof window.save==='function')window.save();else if(typeof save==='function')save()}catch(e){console.warn('D772 lab save failed',e)}}
function problem(kind,index){
 const n=Math.max(0,index|0);
 if(kind==='truncated'){
  const a=81+(n*7)%13,b=a+2+(n%3),axis=a-2;
  return {kind,index:n,a,b,axis,answer:'points',prompt:'A school reports attendance of '+a+'% before and '+b+'% after. A chart begins its vertical axis at '+axis+'%. What does the evidence show?',choices:[(b-a)+'% relative increase','An increase of '+(b-a)+' percentage points; the shortened scale exaggerates the visual difference','The attendance intervention caused the increase'],correct:1,explanation:'Subtract the two percentages: '+b+' − '+a+' = '+(b-a)+' percentage points. The truncated axis changes apparent bar heights but not the data. The graph alone does not establish cause.'};
 }
 if(kind==='icons'){
  const a=10+(n%4)*5,b=a+5;return {kind,index:n,a,b,answer:'area',prompt:'Two classes have '+a+' and '+b+' library books. The designer scales both the width and height of each book icon in proportion to the counts. What is misleading?',choices:['Scaling both dimensions makes area change quadratically, exaggerating the difference','The numbers become different when drawn as icons','Book counts must always be shown in a pie chart'],correct:0,explanation:'When both height and width are enlarged, the area grows by the scale factor squared. Compare values with equal-width bars or icons of equal size, using length or count—not overall pictorial area.'};
 }
 if(kind==='pie'){
  const a=25+(n%3)*5,b=35+(n%2)*5,c=100-a-b;
  return {kind,index:n,a,b,c,answer:'pie',prompt:'A school survey has three categories totaling 100%: '+a+'%, '+b+'%, and '+c+'%. A 3-D pie chart tilts the near slice toward the viewer. What is the concern?',choices:['The percentages stop summing to 100%','Perspective can make the front slice look larger than its percentage warrants','3-D pie charts establish the cause of the results'],correct:1,explanation:'A 3-D perspective distorts perceived slice area. Keep a flat 2-D pie with labeled percentages or use a bar chart to compare categories more accurately.'};
 }
 const p=[0.01,0.03,0.04][n%3],improvement=[0.2,0.3,0.4][n%3];
 return {kind,index:n,p,improvement,answer:'significance',prompt:'A large study reports p = '+p.toFixed(2)+' for a teaching intervention, with an average improvement of just '+improvement.toFixed(1)+' test-score points. Which conclusion is best supported?',choices:['It is statistically significant at the 5% level, but whether the effect matters in practice needs further judgment','A p-value below 0.05 proves that the effect is large and important','A p-value tells us the probability that the teaching intervention is true'],correct:0,explanation:'p < 0.05 is statistically significant under the stated analysis; that alone does not show a large or practically meaningful effect, prove causation, or give the probability a hypothesis is true.'};
}
function visual(q){
 if(q.kind==='truncated'){const y=v=>162-(v-q.axis)/(100-q.axis)*117;return '<svg viewBox="0 0 340 200" role="img" aria-label="Attendance '+q.a+' and '+q.b+' percent with truncated axis starting at '+q.axis+'" style="width:min(100%,420px);background:#fff;border:1px solid #bcae9c;border-radius:5px"><line x1="52" y1="24" x2="52" y2="163" stroke="#33243c" stroke-width="2"/><line x1="52" y1="163" x2="322" y2="163" stroke="#33243c" stroke-width="2"/><text x="44" y="165" font-size="14" text-anchor="end" fill="#271b2d">'+q.axis+'%</text><rect x="88" y="'+y(q.a)+'" width="70" height="'+(162-y(q.a))+'" fill="#54416e"/><rect x="210" y="'+y(q.b)+'" width="70" height="'+(162-y(q.b))+'" fill="#967446"/><text x="123" y="'+(y(q.a)-5)+'" text-anchor="middle" fill="#271b2d">'+q.a+'%</text><text x="245" y="'+(y(q.b)-5)+'" text-anchor="middle" fill="#271b2d">'+q.b+'%</text><text x="123" y="182" text-anchor="middle" fill="#271b2d">Before</text><text x="245" y="182" text-anchor="middle" fill="#271b2d">After</text></svg>';}
 if(q.kind==='icons'){const scale=q.b/q.a,side=42*scale;return '<svg viewBox="0 0 340 175" role="img" aria-label="Pictograms for '+q.a+' and '+q.b+' books are scaled in two dimensions, exaggerating their relative areas" style="width:min(100%,420px);background:#fff;border:1px solid #bcae9c;border-radius:5px"><rect x="58" y="'+(130-42)+'" width="42" height="42" rx="4" fill="#554171"/><rect x="196" y="'+(130-side)+'" width="'+side+'" height="'+side+'" rx="4" fill="#967446"/><text x="80" y="148" text-anchor="middle" fill="#271b2d">'+q.a+' books</text><text x="230" y="148" text-anchor="middle" fill="#271b2d">'+q.b+' books</text><text x="170" y="20" text-anchor="middle" fill="#271b2d">Compare symbol area carefully</text></svg>';}
 if(q.kind==='pie'){
  const values=[q.a,q.b,q.c],colors=['#554171','#967446','#548075'];
  const wedge=(cx,cy,rx,ry,start,fraction,color)=>{
   const end=start+fraction*Math.PI*2;
   const point=t=>[(cx+rx*Math.cos(t)).toFixed(2),(cy+ry*Math.sin(t)).toFixed(2)];
   const x=point(start),y=point(end);
   return '<path d="M '+cx+' '+cy+' L '+x.join(' ')+' A '+rx+' '+ry+' 0 '+(fraction>0.5?1:0)+' 1 '+y.join(' ')+' Z" fill="'+color+'" stroke="#fff" stroke-width="1.5"/>';
  };
  let t=-Math.PI/2,flat='',tilted='';
  values.forEach((v,i)=>{flat+=wedge(81,83,49,49,t,v/100,colors[i]);tilted+=wedge(247,91,61,27,t,v/100,colors[i]);t+=v/100*Math.PI*2});
  return '<svg viewBox="0 0 340 176" role="img" aria-label="Accurate flat pie chart next to a visually distorted perspective pie, both representing '+q.a+', '+q.b+', and '+q.c+' percent" style="width:min(100%,440px);background:#fff;border:1px solid #bcae9c;border-radius:5px">'+
  '<text x="82" y="19" text-anchor="middle" fill="#271b2d" font-size="14">Flat 2-D</text>'+
  '<text x="247" y="19" text-anchor="middle" fill="#271b2d" font-size="14">Tilted perspective</text>'+
  flat+'<ellipse cx="247" cy="103" rx="61" ry="27" fill="#493747" opacity=".75"/>'+tilted+
  '<text x="170" y="153" text-anchor="middle" fill="#271b2d" font-size="13">'+q.a+'% + '+q.b+'% + '+q.c+'% = 100%</text>'+
  '<text x="170" y="169" text-anchor="middle" fill="#271b2d" font-size="11">Same shares, different visual impression</text></svg>';
 }

 return '<div style="padding:12px;background:#fff;border:1px solid #bcae9c;border-radius:5px;color:#271b2d">p = <strong>'+q.p.toFixed(2)+'</strong> | Average improvement = <strong>'+q.improvement.toFixed(1)+' points</strong><p>Statistical evidence and practical importance answer different questions.</p></div>';
}
function render(){
 if(window.S?.activeCourse!=='D772'||window.S?.screen!=='home')return;
 const host=document.querySelector('#mjD772WguHistory');if(!host||host.querySelector('#mjMisrepresentationLab'))return;
 const st=state();if(!st)return;
 const section=document.createElement('section');section.id='mjMisrepresentationLab';
 section.style.cssText='margin-top:18px;padding:15px;border:2px solid #9d8062;border-radius:10px;background:#fff7e9;color:#271b2d';
 section.innerHTML='<h4>Professor practice · Spot the misleading evidence</h4><p>New scenarios each round. Read the data, choose the supported conclusion, and explain why. This is targeted practice, not automatic mastery.</p><label for="mjMisleadType">Choose the misconception</label> <select id="mjMisleadType"><option value="truncated">Truncated axis</option><option value="icons">Distorted 2-D icons</option><option value="pie">3-D pie chart perspective</option><option value="significance">Statistical vs practical significance</option></select><div data-mislead-case></div><fieldset style="border:0;padding:8px 0"><legend>What conclusion is supported?</legend><div data-mislead-choices></div></fieldset><button type="button" data-mislead-check>Check my reasoning</button> <button type="button" data-mislead-next>Try a fresh case</button><p data-mislead-feedback role="status" aria-live="polite"></p><details><summary>Independent teacher-application challenge</summary><label for="mjMisleadTeach">Explain to a student why the representation could mislead, how you would correct it, and one question you would ask to check understanding.</label><textarea id="mjMisleadTeach" rows="5" style="display:block;width:100%;background:#fff;color:#271b2d"></textarea><button type="button" data-mislead-save>Save my explanation for review</button><p data-mislead-teach-status role="status"></p><p>Saved writing is a draft for review. It is not automatically graded as mastery.</p></details>';
 host.append(section);
 section.querySelectorAll('h4,p,legend,label,summary,button').forEach(x=>x.style.setProperty('color',x.tagName==='BUTTON'?'#fff9e9':'#271b2d','important'));
 section.querySelectorAll('button').forEach(x=>{x.style.background='#332041';x.style.border='2px solid #9b7eaa';x.style.borderRadius='6px';x.style.padding='8px 10px';x.style.margin='4px'});
 const type=section.querySelector('#mjMisleadType'),frame=section.querySelector('[data-mislead-case]'),choices=section.querySelector('[data-mislead-choices]'),feedback=section.querySelector('[data-mislead-feedback]'),draft=section.querySelector('#mjMisleadTeach');
 draft.value=st.teacherDraft||'';draft.addEventListener('input',()=>{st.teacherDraft=draft.value;persist()});
 function show(){
  const kind=type.value,n=st.cases[kind]||0,q=problem(kind,n);section.dataset.kind=kind;section.dataset.caseIndex=n;
  frame.innerHTML='<p><strong>Scenario:</strong> '+esc(q.prompt)+'</p>'+visual(q);
  choices.replaceChildren();
  q.choices.forEach((choice,i)=>{const label=document.createElement('label');label.style.cssText='display:block;margin:8px 0;color:#271b2d';const radio=document.createElement('input');radio.type='radio';radio.name='mjMisleadAnswer';radio.value=String(i);label.append(radio,document.createTextNode(' '+choice));choices.append(label)});
  feedback.textContent='';
 }
 type.addEventListener('change',show);
 section.querySelector('[data-mislead-check]').addEventListener('click',()=>{
  const selected=section.querySelector('input[name="mjMisleadAnswer"]:checked');if(!selected){feedback.textContent='Please choose a conclusion first.';return}
  const q=problem(type.value,Number(section.dataset.caseIndex)),correct=Number(selected.value)===q.correct;
  st.attempts.push({kind:q.kind,index:q.index,correct,at:Date.now(),assisted:true,source:'guided-misrepresentation-lab'});
  feedback.textContent=(correct?'Correct. ':'Not yet. ')+q.explanation+' This answer is guided practice, not independent mastery.';
  window.MajickLearningContinuity?.record?.({courseId:'D772',lessonTitle:LESSON,correct,activity:'guided-misrepresentation-'+q.kind});
  persist();
 });
 section.querySelector('[data-mislead-next]').addEventListener('click',()=>{st.cases[type.value]=(st.cases[type.value]||0)+1;persist();show()});
 section.querySelector('[data-mislead-save]').addEventListener('click',()=>{const v=draft.value.trim();if(v.length<60){section.querySelector('[data-mislead-teach-status]').textContent='Add at least a few sentences explaining the distortion, a correction, and a checking question.';return}st.teacherDraft=v;st.teacherResponses.push({kind:type.value,index:Number(section.dataset.caseIndex),text:v,at:Date.now(),status:'awaiting-review',masteryVerified:false});persist();section.querySelector('[data-mislead-teach-status]').textContent='Saved for review. No mastery or reward was awarded.'});
 show();
}
window.MajickD772MisrepresentationLab={problem,state,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-misrepresentation-lab',render,79);window.MajickRenderQueue.schedule()}
else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1200)}
})();