(()=>{
'use strict';
const VERSION='3.4.5-math-support';
const COURSE='D772';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FAMILY_CARDS=[
 ['OR','Union','P(A or B)','Combine A, B, and the overlap once.'],
 ['AND','Intersection','P(A and B)','Keep only outcomes shared by both events.'],
 ['NOT','Complement','P(not A)','Subtract the event probability from 1.'],
 ['OBSERVED TRIALS','Empirical probability','observed ÷ total trials','Use actual results from repeated trials.'],
 ['EQUALLY LIKELY','Theoretical probability','favorable ÷ total','Use the structure of an equally likely sample space.'],
 ['PROBABILITY × VALUE','Expected value','Σ[P × value]','Weight each outcome by its probability, then add.']
];
const LOST_OPTIONS=[
 ['words','I don’t understand the words','Translate the story into plain language and identify the clue words.'],
 ['formula','I don’t know the formula','Show the formula family and explain why this formula fits.'],
 ['placement','I don’t know where the numbers go','Map each number to a role before calculating.'],
 ['arithmetic','I can’t do the calculation','Keep the setup and use the calculator for the arithmetic only.'],
 ['interpret','I don’t understand the answer','Rewrite the result in a complete sentence with units or percent.']
];
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
 '<div class="v343MathActions"><button type="button" data-v343-action="read">Read the formula in plain English</button><button type="button" data-v343-action="slots">What goes where?</button><button type="button" data-v343-action="template">Show substitution template</button><button type="button" data-v343-action="organize">Break the problem down</button><button type="button" data-v343-action="translator">Math Translator</button><button type="button" data-v343-action="mapping">Map the Numbers</button><button type="button" data-v343-action="family">Formula Families</button><button type="button" data-v343-action="calculator">Calculator + Test Steps</button><button type="button" data-v343-action="lost">Where did I get lost?</button></div>'+
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

function progressState(){
 const p=window.S?.progress?.[COURSE];if(!p)return {};
 p.mathSupport=p.mathSupport||{issues:{},numberRoles:{},estimates:{},calculatorUses:0,guardianNotes:[]};
 return p.mathSupport;
}
function conceptKey(){return current().concept?.id||formulaFor()?.label||'general'}
function visibleProblemText(){
 const stage=document.querySelector('.v3338Stage,.v3338Opening,.v3338Checkpoint>article');
 if(!stage)return current().title||'';
 const nodes=[...stage.querySelectorAll('h2,h3,.question,.v3338Choices,.workedSteps')];
 return nodes.map(n=>n.innerText||'').join(' ').replace(/\s+/g,' ').trim().slice(0,1400)||current().title||'';
}
function translator(){
 const text=visibleProblemText(),rules=[
  [/\bor\b/i,'OR → union: include A, B, and both.'],
  [/\band\b/i,'AND → intersection: keep the overlap / both events.'],
  [/\bnot\b|does not|doesn’t|doesn't/i,'NOT → complement: subtract from the whole probability.'],
  [/observed|times|trials|flips|draws|experimental/i,'Observed results → empirical probability.'],
  [/fair|equally likely|sample space/i,'Equally likely outcomes → theoretical probability.'],
  [/average result|on average|expected value|win|lose|payoff|prize/i,'Probability paired with gains/losses → expected value.'],
  [/middle 50|quartile|q1|q3|box plot/i,'Middle 50% / Q1 / Q3 → IQR or box-plot reasoning.'],
  [/nearest hundredth|round/i,'Do not round until the final calculation.']
 ];
 const hits=rules.filter(r=>r[0].test(text)).map(r=>r[1]);
 return '<div class="v343Translator"><b>Math Translator</b><p class="v343ProblemEcho">'+E(text.slice(0,360))+'</p>'+
 (hits.length?hits.map(x=>'<span>✦ '+E(x)+'</span>').join(''):'<span>✦ No automatic clue found. Ask: what is the question asking me to find?</span>')+
 '<small>These clue translations fade as rigor increases so you learn to spot them yourself.</small></div>';
}
function extractNumbers(){
 const text=visibleProblemText(),m=text.match(/-?\$?\d+(?:\.\d+)?%?|(?:\d+\s*\/\s*\d+)/g)||[];
 return [...new Set(m)].slice(0,10);
}
function roleOptions(){
 const f=formulaFor(),base=['successful/favorable outcomes','total trials/outcomes','probability','outcome value/payoff','Q1','Q3','sample size','mean/center','not needed'];
 const from=(f?.parts||[]).map(x=>x[0]);
 return [...new Set([...from,...base])];
}
function numberMapping(){
 const nums=extractNumbers(),ps=progressState(),key=conceptKey();ps.numberRoles[key]=ps.numberRoles[key]||{};
 if(!nums.length)return '<div class="v343Mapping"><b>Number-to-Formula Mapping</b><p>No problem numbers were detected on this screen. You can use the Problem Setup Board instead.</p></div>';
 return '<div class="v343Mapping"><b>Number-to-Formula Mapping</b><p>Assign each number a job before you calculate. Not every number must be used.</p>'+
 nums.map(n=>'<label><strong>'+E(n)+'</strong><select data-v343-map="'+E(n)+'"><option value="">Choose its role…</option>'+roleOptions().map(r=>'<option '+(ps.numberRoles[key][n]===r?'selected':'')+'>'+E(r)+'</option>').join('')+'</select></label>').join('')+
 '<div class="v343GuardianCue">Guardian check: if you know the formula but the answer is wrong, look here first. A misplaced denominator, probability, or negative sign is a setup error—not an arithmetic error.</div></div>';
}
function familyCards(){
 return '<div class="v343Families"><b>Formula Family Cards</b><p>Learn the clue family first; the equation is the second step.</p><div>'+FAMILY_CARDS.map(x=>'<article><small>'+E(x[0])+'</small><strong>'+E(x[1])+'</strong><code>'+E(x[2])+'</code><span>'+E(x[3])+'</span></article>').join('')+'</div></div>';
}
function signCoach(){
 const f=formulaFor();if(!/expected value/i.test(f?.label||''))return '';
 const w=mathState();
 return '<div class="v343SignCoach"><b>± Sign Coach • Expected Value</b><p>Before multiplying, decide whether each money amount is a gain or a loss.</p>'+
 [1,2,3].map(i=>'<label><span>Outcome '+i+'</span><input inputmode="decimal" data-v343-ev-value="'+i+'" placeholder="amount"><select data-v343-ev-sign="'+i+'"><option value="+">+ gain</option><option value="-">− loss</option></select></label>').join('')+
 '<small>A loss must enter the EV formula as a negative value. An entry fee usually reduces every outcome by that fee.</small></div>';
}
function estimateCoach(){
 const f=formulaFor(),ps=progressState(),key=conceptKey(),prob=/probability|union|intersection|complement/i.test(f?.label||''),ev=/expected value/i.test(f?.label||'');
 const choices=prob?['Closer to 0','Around 0.5','Closer to 1']:ev?['Negative','About 0 / fair','Positive']:['Smaller than the given values','Between the main values','Larger than the given values'];
 return '<div class="v343Estimate"><b>Estimate Before Calculate</b><p>Choose a reasonable range or direction first. This gives you a way to catch calculator mistakes.</p><div>'+choices.map(c=>'<button data-v343-estimate="'+E(c)+'" class="'+(ps.estimates[key]===c?'selected':'')+'">'+E(c)+'</button>').join('')+'</div></div>';
}
function calcInstructions(){
 const f=formulaFor();
 if(/empirical|theoretical|intersection/i.test(f?.label||''))return ['Type the numerator.','Press ÷.','Type the denominator.','Press =.','Round only if the question tells you to.'];
 if(/complement/i.test(f?.label||''))return ['Type 1.','Press −.','Type P(A) as a decimal.','Press =.','Convert to a percent only if requested.'];
 if(/expected value/i.test(f?.label||''))return ['Enter each probability × signed outcome value.','Use parentheses for negative amounts, such as 0.30 × (−3).','Add the products.','Press =.','Interpret the result as the long-run average per play.'];
 if(/interquartile/i.test(f?.label||''))return ['Type Q3.','Press −.','Type Q1.','Press =.','The result is the spread of the middle 50%.'];
 if(/mean/i.test(f?.label||''))return ['Add all values first.','Use parentheses if needed.','Press ÷.','Enter the number of data values.','Press =.'];
 if(/union/i.test(f?.label||''))return ['Enter P(A) + P(B).','Subtract P(A and B).','Press =.','Check that the result stays between 0 and 1.'];
 return ['Write the equation setup first.','Then use the calculator only for the arithmetic.','Check whether the answer has the correct units and reasonable size.'];
}
function safeCalc(expr){
 const raw=String(expr||'').replace(/[×]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-').trim();
 if(!raw||raw.length>160||!/^[0-9+\-*/().\s]+$/.test(raw))return {ok:false,msg:'Use numbers, parentheses, +, −, ×, and ÷ only.'};
 try{const v=Function('"use strict";return ('+raw+')')();if(!Number.isFinite(v))throw Error();return {ok:true,value:Number(v.toFixed(10))}}catch(_){return {ok:false,msg:'Check the equation entry and parentheses.'}}
}
function calculatorPanel(){
 const w=mathState(),ready=String(w.substitute||'').trim().length>0;
 return '<div class="v343Calculator"><b>Calculator With Learning Guardrails</b><p>On an assessment where a calculator is permitted, use it for arithmetic—not for deciding what the problem means. Majick unlocks the calculator after you write the equation setup.</p>'+
 '<ol>'+calcInstructions().map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>'+
 '<div class="v343SetupCheck"><small>YOUR EQUATION SETUP</small><code>'+E(w.substitute||'Complete “4. Substitute” in the Problem Setup Board first.')+'</code></div>'+
 '<div class="v343CalcRow"><input id="v343CalcInput" '+(ready?'':'disabled')+' placeholder="'+(ready?'Example: (38/80)*100':'Calculator locked until setup is written')+'"><button id="v343CalcRun" '+(ready?'':'disabled')+'>Calculate</button></div><div id="v343CalcResult"></div>'+
 '<small>Test habit: after pressing =, compare the calculator result with your estimate before choosing an answer.</small></div>';
}
function lostPanel(){
 return '<div class="v343Lost"><b>Where did I get lost?</b><p>Pick the exact point of difficulty. Majick will track math calculation problems separately from concept problems.</p>'+
 LOST_OPTIONS.map(x=>'<button data-v343-lost="'+x[0]+'"><strong>'+E(x[1])+'</strong><span>'+E(x[2])+'</span></button>').join('')+'<div id="v343LostResponse"></div></div>';
}
function recordIssue(kind){
 const ps=progressState(),key=conceptKey();ps.issues[key]=ps.issues[key]||{words:0,formula:0,placement:0,arithmetic:0,interpret:0};
 ps.issues[key][kind]=(ps.issues[key][kind]||0)+1;
 const label=kind==='arithmetic'?'math calculation error':'concept/setup error';
 ps.guardianNotes.push({concept:key,kind,label,at:Date.now()});ps.guardianNotes=ps.guardianNotes.slice(-80);
 try{window.save?.()}catch(_){}
 return label;
}
function guardianResponse(kind){
 const f=formulaFor(),lines={
  words:'Let’s translate the wording before touching the numbers. Look for OR, AND, NOT, observed trials, equally likely, or probability × value.',
  formula:'You do not need to guess. Match the clue family first, then choose the formula.',
  placement:'Your formula may be right. Now verify the job of every number—especially the denominator, probability, and any overlap.',
  arithmetic:'Your setup can still be correct even if the arithmetic went wrong. Keep the equation and use the calculator carefully, one operation at a time.',
  interpret:'The calculation is only part of the answer. Say what the number means in the context and include dollars, percent, points, or probability.'
 };
 if(kind==='placement'&&/empirical/i.test(f?.label||''))return 'You chose the right kind of formula. Check the denominator: it must be every trial, not only the target category.';
 if(kind==='placement'&&/expected value/i.test(f?.label||''))return 'Check the signs and pairing: each probability must multiply its own outcome value, and losses must be negative.';
 return lines[kind]||'Let’s identify the exact step that needs repair.';
}

function help(kind){
 const f=formulaFor(); if(!f)return '';
 if(kind==='read')return '<div class="v343Help"><b>Say it like this:</b><p>'+E(f.plain)+'</p></div>';
 if(kind==='slots')return '<div class="v343Help"><b>What each part means</b>'+f.parts.map(x=>'<p><strong>'+E(x[0])+'</strong> = '+E(x[1])+'</p>').join('')+'</div>';
 if(kind==='organize')return organizer()+signCoach()+estimateCoach();
 if(kind==='translator')return translator();
 if(kind==='mapping')return numberMapping()+signCoach();
 if(kind==='family')return familyCards();
 if(kind==='calculator')return calculatorPanel();
 if(kind==='lost')return lostPanel();
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
   root.querySelectorAll('[data-v343-map]').forEach(s=>s.addEventListener('change',()=>{
     const ps=progressState(),key=conceptKey();ps.numberRoles[key]=ps.numberRoles[key]||{};ps.numberRoles[key][s.dataset.v343Map]=s.value;try{window.save?.()}catch(_){}
   }));
   root.querySelectorAll('[data-v343-estimate]').forEach(b=>b.addEventListener('click',()=>{
     const ps=progressState();ps.estimates[conceptKey()]=b.dataset.v343Estimate;try{window.save?.()}catch(_){}
     b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
   }));
   root.querySelectorAll('[data-v343-lost]').forEach(b=>b.addEventListener('click',()=>{
     const kind=b.dataset.v343Lost,label=recordIssue(kind),out=root.querySelector('#v343LostResponse');
     if(out)out.innerHTML='<div class="v343GuardianMath"><b>Guardian math coaching</b><p>'+E(guardianResponse(kind))+'</p><small>Tracked as: '+E(label)+'</small></div>';
   }));
   const run=root.querySelector('#v343CalcRun');
   if(run)run.addEventListener('click',()=>{
     const input=root.querySelector('#v343CalcInput'),out=root.querySelector('#v343CalcResult'),r=safeCalc(input?.value);
     progressState().calculatorUses=(progressState().calculatorUses||0)+1;try{window.save?.()}catch(_){}
     if(out)out.innerHTML=r.ok?'<b>= '+E(r.value)+'</b><small>Now compare this with your estimate and interpret it in context.</small>':'<span>'+E(r.msg)+'</span>';
   });
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
window.MajickMathSupport={VERSION,FORMULAS,FAMILY_CARDS,decorate,formulaFor,level,translator,numberMapping,familyCards,calculatorPanel,lostPanel,progressState};
document.documentElement.dataset.majickMathSupport=VERSION;
})();