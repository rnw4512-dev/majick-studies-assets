(()=>{
'use strict';
const VERSION='3.4.4-math-support';
const COURSE='D772';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FORMULAS=[
 {test:/empirical|relative frequency|experimental probability/i,label:'Empirical probability',formula:'P(A) = times A occurred ÷ total trials',plain:'Count how many times the event actually happened. Divide by the total number of trials.',parts:[['times A occurred','the successful/target outcomes you observed'],['total trials','every trial, not just the target category']],template:'P(A) = ___ successful outcomes ÷ ___ total trials',trap:'The denominator must be ALL trials.'},
 {test:/theoretical|classical probability|probability$/i,label:'Theoretical probability',formula:'P(A) = favorable outcomes ÷ total equally likely outcomes',plain:'Count the outcomes you want, then divide by all equally likely outcomes.',parts:[['favorable outcomes','the outcomes that satisfy the event'],['total outcomes','every equally likely outcome in the sample space']],template:'P(A) = ___ favorable ÷ ___ total',trap:'Use this only when the outcomes are equally likely.'},
 {test:/complement/i,label:'Complement rule',formula:'P(not A) = 1 − P(A)',plain:'Start with the whole probability, 1, and subtract the probability of A.',parts:[['1','the whole sample space / 100%'],['P(A)','the probability of the event happening']],template:'P(not A) = 1 − ___',trap:'Do not repeat P(A); subtract it from 1.'},
 {test:/union/i,label:'Union rule',formula:'P(A or B) = P(A) + P(B) − P(A and B)',plain:'Add A and B, then subtract the overlap once because it was counted twice.',parts:[['P(A)','probability of A'],['P(B)','probability of B'],['P(A and B)','the overlap shared by both events']],template:'P(A or B) = ___ + ___ − ___',trap:'OR includes the overlap, but the overlap can only be counted once.'},
 {test:/intersection/i,label:'Intersection',formula:'P(A and B) = shared outcomes ÷ total outcomes',plain:'Keep only the outcomes that belong to both events, then divide by the whole sample space.',parts:[['shared outcomes','the overlap / outcomes in both A and B'],['total outcomes','all equally likely outcomes']],template:'P(A and B) = ___ shared ÷ ___ total',trap:'AND means overlap only.'},
 {test:/expected value/i,label:'Expected value',formula:'EV = Σ[P(outcome) × value(outcome)]',plain:'For every possible result, multiply its probability by its value. Then add all of those products.',parts:[['P(outcome)','how likely that result is'],['value(outcome)','what you gain or lose if it occurs'],['Σ','add every probability × value product']],template:'EV = (___)(___) + (___)(___) + ...',trap:'Losses are negative numbers. Expected value is a long-run average, not the next result.'},
 {test:/five-number|box plot|quartile|iqr/i,label:'Interquartile range',formula:'IQR = Q3 − Q1',plain:'Subtract the first quartile from the third quartile to measure the spread of the middle 50%.',parts:[['Q3','75th percentile / right edge of the box'],['Q1','25th percentile / left edge of the box']],template:'IQR = ___ − ___',trap:'A longer box-plot section means more spread, not more data.'},
 {test:/mean/i,label:'Mean',formula:'Mean = sum of all values ÷ number of values',plain:'Add every data value, then divide by how many values there are.',parts:[['sum','add every value'],['number of values','count how many data points there are']],template:'Mean = ___ total ÷ ___ values',trap:'Do not divide by the range or by the number of different values.'}
];
function current(){
 try{
  const x=window.MajickInstruction?.current?.();
  const title=[x?.concept?.title,x?.concept?.teach,x?.lesson?.title].filter(Boolean).join(' ');
  return {phase:Number(x?.st?.phase||0),concept:x?.concept,title};
 }catch(_){return {phase:0,concept:null,title:''}}
}
function formulaFor(){
 const x=current(),text=x.title||'';
 return FORMULAS.find(f=>f.test.test(text))||null;
}
function level(){
 const p=current().phase;
 if(p<=3)return 'easy';
 if(p<=4)return 'medium';
 return 'hard';
}
function panel(){
 const f=formulaFor(); if(!f)return '';
 const lvl=level(),show=lvl==='easy';
 return '<aside class="v343MathCoach '+lvl+'">'+
 '<header><div><small>MATH SUPPORT • SAME RIGOR, MORE STRUCTURE</small><h3>🧮 Formula Coach</h3></div><span>'+lvl.toUpperCase()+' RIGOR</span></header>'+
 '<p class="v343MathRule">'+(lvl==='easy'?'Formula shown automatically while you learn the procedure.':lvl==='medium'?'Choose the strategy first; formula available if you need it.':'OA-style support faded: formula hidden unless you ask for it.')+'</p>'+
 (show?formulaCard(f):'<button class="v343Reveal" type="button" data-v343-reveal>Show Formula / Help Me Set It Up</button><div data-v343-slot></div>')+
 '<div class="v343MathActions"><button type="button" data-v343-action="read">Read the formula in plain English</button><button type="button" data-v343-action="slots">What goes where?</button><button type="button" data-v343-action="template">Show substitution template</button><button type="button" data-v343-action="organize">Break the problem down</button></div>'+
 '<div data-v343-help></div></aside>';
}
function formulaCard(f){
 return '<div class="v343FormulaCard"><small>'+E(f.label)+'</small><strong>'+E(f.formula)+'</strong><p>'+E(f.plain)+'</p><em>Watch out: '+E(f.trap)+'</em></div>';
}
function mathState(){
 const p=window.S?.progress?.[COURSE];if(!p)return {};
 p.mathWork=p.mathWork||{};
 const id=current().concept?.id||formulaFor()?.label||'general';
 p.mathWork[id]=p.mathWork[id]||{given:'',find:'',formula:'',substitute:'',solve:'',interpret:''};
 return p.mathWork[id];
}
function organizer(){
 const f=formulaFor(),w=mathState();if(!f)return '';
 return '<div class="v343Organizer"><b>Problem Setup Board</b><p>Do not calculate yet. First organize what the question is telling you.</p>'+
 [['given','1. What do I know?','List the numbers, outcomes, probabilities, or data the problem gives you.'],
  ['find','2. What am I finding?','Write the exact quantity the question asks for.'],
  ['formula','3. Which formula/rule fits?','Name the formula or decision rule before using numbers.'],
  ['substitute','4. Substitute','Put the given numbers into the formula.'],
  ['solve','5. Solve','Do the arithmetic one step at a time.'],
  ['interpret','6. Interpret','Write what the answer means in the situation, including units or percent.']]
 .map(x=>'<label><span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></span><textarea data-v343-work="'+x[0]+'" placeholder="'+E(x[2])+'">'+E(w[x[0]]||'')+'</textarea></label>').join('')+
 '<div class="v343OrganizerTip">Guardian rule: if you are stuck, identify which box is the problem. Is it the story, the formula, number placement, signs, arithmetic, or interpretation?</div></div>';
}
function help(kind){
 const f=formulaFor(); if(!f)return '';
 if(kind==='read')return '<div class="v343Help"><b>Say it like this:</b><p>'+E(f.plain)+'</p></div>';
 if(kind==='slots')return '<div class="v343Help"><b>What each part means</b>'+f.parts.map(x=>'<p><strong>'+E(x[0])+'</strong> = '+E(x[1])+'</p>').join('')+'</div>';
 if(kind==='organize')return organizer();
 return '<div class="v343Help"><b>Set it up before calculating</b><code>'+E(f.template)+'</code><p>Fill the blanks from the story first. Then calculate. Do not do both steps in your head at once.</p></div>';
}
function decorate(){
 if(window.S?.screen!=='learninglab'||window.S?.activeCourse!==COURSE)return;
 const stage=document.querySelector('.v3338Stage,.v3338Opening,.v3338Checkpoint>article');
 if(!stage||stage.querySelector('.v343MathCoach'))return;
 const html=panel(); if(!html)return;
 stage.insertAdjacentHTML('beforeend',html);
 const root=stage.querySelector('.v343MathCoach');
 root?.querySelector('[data-v343-reveal]')?.addEventListener('click',()=>{
   const slot=root.querySelector('[data-v343-slot]');if(slot)slot.innerHTML=formulaCard(formulaFor());
   try{window.S.progress[COURSE].answers=window.S.progress[COURSE].answers||[];window.S.progress[COURSE].mathSupportUse=(window.S.progress[COURSE].mathSupportUse||0)+1;window.save?.()}catch(_){}
 });
 root?.querySelectorAll('[data-v343-action]').forEach(b=>b.addEventListener('click',()=>{
   const box=root.querySelector('[data-v343-help]'); if(box)box.innerHTML=help(b.dataset.v343Action);
   root.querySelectorAll('[data-v343-work]').forEach(t=>t.addEventListener('input',()=>{
     const w=mathState();w[t.dataset.v343Work]=t.value;try{window.save?.()}catch(_){}
   }));
 }));
}
if(window.MajickRenderQueue?.register){
 window.MajickRenderQueue.register('v343-math-support',decorate,220);
 window.MajickRenderQueue.schedule();
}else{
 const prev=window.render;
 if(typeof prev==='function'&&!prev.__v343MathSupport){
   const wrapped=function(){const out=prev.apply(this,arguments);setTimeout(decorate,0);return out};
   wrapped.__v343MathSupport=true;window.render=wrapped;
 }
 setTimeout(decorate,180);
}
window.MajickMathSupport={VERSION,FORMULAS,decorate,formulaFor,level};
document.documentElement.dataset.majickMathSupport=VERSION;
})();