/* UI adapter for the shared continuity tracker and generated probability engine. */
(()=>{'use strict';
if(window.MajickProbabilityWorkshop)return;
const C=()=>window.MajickLearningContinuity;
if(!document.getElementById('majickProbabilityCompactStyles')){const style=document.createElement('style');style.id='majickProbabilityCompactStyles';style.textContent="\n/* Compact, readable connected probability practice; scoped to this workshop. */\n.connectedProbability{max-width:100%;box-sizing:border-box}.connectedProbability nav{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.connectedProbability nav button{flex:1 1 190px;min-width:0;white-space:normal}.connectedProbability [data-prob-continue]{margin:12px 0;padding:12px 18px;background:#efd5a0;color:#291a32;border-radius:10px;font-weight:800;cursor:pointer}\n.connectedProbability [data-connected-task] [data-prob-prompt]{max-width:76ch;line-height:1.45}\n.connectedProbability [data-connected-task] svg,.connectedProbability [data-connected-task] img{max-width:100%;height:auto;max-height:280px;object-fit:contain}\n.connectedProbability [data-connected-task] .connectedCounters{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:12px 0}\n.connectedProbability [data-connected-task] .connectedCounters button,.connectedProbability [data-connected-task] .connectedCounters span{display:inline-grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border-radius:50%;font-weight:800;font-size:18px;border:2px solid #e6d7a7;box-shadow:inset 0 2px 5px #0004,0 2px 5px #0003;color:#fff}\n.connectedProbability [data-connected-task] .connectedCounters button{background:#21664a!important;color:#fff!important}\n.connectedProbability [data-connected-task] .connectedCounters span.connectedPurpleCounter{background:#74428d!important;color:#fff!important}\n.connectedProbability [data-connected-task] .connectedCounters button:disabled{opacity:.65}\n.connectedProbability [data-connected-task] .connectedCounterLegend{display:flex;gap:18px;flex-wrap:wrap;font-weight:700;margin:8px 0}\n.connectedProbability .connectedLegendGreen{color:#b5f0cf}.connectedProbability .connectedLegendPurple{color:#ead0ff}\n.connectedProbability [data-connected-task] .connectedFields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px}\n.connectedProbability [data-connected-task] .connectedFields label{min-width:0}\n.connectedProbability [data-connected-task] select{max-width:100%;color:#24192f;background:#fffaf2}\n@media(max-width:600px){.connectedProbability [data-connected-task] svg,.connectedProbability [data-connected-task] img{max-height:190px}.connectedProbability [data-connected-task] .connectedCounters button,.connectedProbability [data-connected-task] .connectedCounters span{flex-basis:40px;width:40px;height:40px}}\n";document.head.appendChild(style);}
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const places={repair:'learninglab',reasoning:'mission',transfer:'games',teaching:'learninglab'};
const workroom='probability';
const nextStage={repair:'reasoning',reasoning:'transfer',transfer:'teaching'};
const labels={repair:'1 · Repair with counters',reasoning:'2 · Independent OA reasoning',transfer:'3 · Classroom role transfer',teaching:'4 · Teacher application'};
function open(kind){
 if(S.activeCourse!=='D772')return;
 const t=C().probabilityTask(kind);if(!t){if(S.screen!==workroom)window.navigate(workroom);setTimeout(()=>{const box=document.querySelector('#connectedProbability [data-connected-task]');if(box){const m=C().probabilityMastery();const reason=kind==='reasoning'&&!m.repairVerified?'Complete the guided counter repair first.':kind==='transfer'&&m.independentCorrect<2?'Complete two correct independent OA questions first.':kind==='teaching'&&!m.transferVerified?'Complete the classroom transfer first.':'No unused verified dataset is available for this step. Your progress is saved.';box.textContent=reason;}},80);return;}
 const st=C().probabilityState();st.focus=kind;window.save?.();
 if(S.screen!==workroom)window.navigate(workroom);else mount();
 setTimeout(mount,0);
 setTimeout(()=>{
  const panel=document.getElementById('connectedProbability');
  if(!panel||S.screen!==workroom)return;
  panel.scrollIntoView({block:'start',behavior:'instant'});
 },0);
}
// One stable navigation owner: document capture sees the real pointer press
// before any campus renderer can replace the button. Keyboard uses click.
function onProbabilityBack(event){
 const back=event.target?.closest?.('#connectedProbability [data-connected-back]');
 if(!back||event.type==='pointerdown'&&event.button!==0)return;
 if(event.type==='click'&&event.detail!==0)return; // pointer activation already navigated
 event.preventDefault();
 event.stopPropagation();
 if(window.S?.screen!=='home'){
  if(typeof window.majickBack==='function')window.majickBack();
  else window.navigate?.('home');
 }
}
document.addEventListener('pointerdown',onProbabilityBack,true);
document.addEventListener('click',onProbabilityBack,true);
function mount(){
 const content=document.getElementById('content');
 if(!content||window.S?.activeCourse!=='D772'||S.screen!==workroom){document.getElementById('connectedProbability')?.remove();return;}
 let box=document.getElementById('connectedProbability');
 if(!box){box=document.createElement('section');box.id='connectedProbability';box.className='connectedProbability';box.setAttribute('aria-label','Connected probability learning');content.prepend(box);}
 const st=C().probabilityState(false),m=C().probabilityMastery();
 // Repeated render-queue passes must not replace an unchanged form between
 // pointer-down and pointer-up or discard focus while a learner is typing.
 const view=JSON.stringify({screen:S.screen,focus:st?.focus,need:st?.need,mastery:m,task:st?.tasks[st?.focus]});
 if(box.__majickProbabilityView===view)return;
 // Do not replace a focused form control during a background render pass.
 // Explicit task changes can still render after submission/advancement.
 if(box.contains(document.activeElement)&&document.activeElement?.matches?.('[data-prob-field]')&&box.__majickProbabilityView&&st?.tasks[st?.focus]?.submitted!==true)return;
 box.__majickProbabilityView=view;
 const nav=Object.keys(labels).map(k=>{
 const unlocked=k==='repair'||m.repairVerified&&(k==='reasoning'||m.independentCorrect>=2&&(k==='transfer'||m.transferVerified));
 return '<button type="button" data-connected-open="'+k+'" aria-disabled="'+(!unlocked)+'" title="'+(unlocked?'Open activity':'See prerequisite for this activity')+'">'+labels[k]+(unlocked?'':' · prerequisite needed')+'</button>';
 }).join('');
 box.innerHTML='<h2>Probability Workshop · Four Learning Stages</h2><p>Original simulated OA-style practice · D772 · Dependent events without replacement</p>'+(st?.need?'<p role="status">Practice recommendation from '+E(st.need.origin)+': recount the remaining favorable outcomes and sample space. This learning path keeps your guided work separate from independent mastery.</p>':'')+'<p data-connected-evidence>Repair: '+(m.repairVerified?'verified':'needed')+' · Independent reasoning: '+m.independentCorrect+'/2 · Transfer: '+(m.transferVerified?'verified':'needed')+' · Structured teach-back: '+(m.teachBackVerified?'verified':'needed')+' · '+(m.certified?'Probability skill certified':'Not yet certified')+'</p><nav aria-label="Probability learning flow">'+nav+'</nav><div data-connected-task></div><p>Guided work never counts as independent mastery. Written whiteboard and teaching explanations are saved for review; only the structured checks are automatically evaluated.</p>';
 box.querySelectorAll('[data-connected-open]').forEach(b=>b.onclick=()=>open(b.dataset.connectedOpen));
 const kind=st?.focus,t=st?.tasks[kind];if(!t)return;
 const host=box.querySelector('[data-connected-task]'),draft=st.drafts[kind]||{},q=t.q,[g,p]=q.data,total=g+p;
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 const frac=(a,b)=>{const d=gcd(a,b);return (a/d)+'/'+(b/d)};
 const second=q.event==='green-purple'?p:g-1;
 const fractions=[frac(g*second,total*(total-1)),frac(g*second,total*total),frac(g+second,total*(total-1)),frac(g*g,total*total),frac(second,total-1)]
  .filter((v,i,a)=>a.indexOf(v)===i);
 const numbers=[g,p,total,g-1,total-1,second,Math.max(0,p-1)]
  .filter((v,i,a)=>v>=0&&a.indexOf(v)===i).map(String);
 const field=(key,label)=>{
  const choices=key==='result'?fractions:numbers;
  const shift=[...String(t.id||'')].reduce((n,c)=>n+c.charCodeAt(0),0)%choices.length;
  const ordered=choices.slice(shift).concat(choices.slice(0,shift));
  return '<label>'+label+'<select data-prob-field="'+key+'" '+(t.submitted?'disabled':'')+
   '><option value="">Select an answer</option>'+ordered.map(v=>'<option value="'+E(v)+'" '+(String(draft[key]??'')===String(v)?'selected':'')+'>'+E(v)+'</option>').join('')+'</select></label>';
 };
 const select=(key,label,options)=>'<label>'+label+'<select data-prob-field="'+key+'" '+(t.submitted?'disabled':'')+'><option value="">Choose a response</option>'+options.map(([v,text])=>'<option value="'+v+'" '+(draft[key]===v?'selected':'')+'>'+text+'</option>').join('')+'</select></label>';
 let visual=q.visualHtml;
 if(kind==='repair'){
  const remaining=t.removed?g-1:g;
  visual='<p class="connectedCounterLegend"><span class="connectedLegendGreen">● Green ('+remaining+')</span><span class="connectedLegendPurple">● Purple ('+p+')</span></p><p>Hands-on model: remove one green counter to represent the first successful draw.</p><div class="connectedCounters">'+Array.from({length:remaining},(_,i)=>'<button type="button" data-remove-green aria-label="Remove green counter '+(i+1)+'" '+(t.removed||t.submitted?'disabled':'')+' title="Green counter">G</button>').join('')+Array.from({length:p},()=>'<span class="connectedPurpleCounter" role="img" aria-label="Purple counter" title="Purple counter">P</span>').join('')+'</div><p data-counter-status>'+remaining+' green and '+p+' purple remain.</p>';
 }
 host.innerHTML='<h3>'+labels[kind]+'</h3><p data-prob-prompt>'+E(q.prompt)+'</p>'+visual+(kind==='repair'?'<p>Guided calculation: after removing a green, multiply '+g+'/'+total+' × '+(g-1)+'/'+(total-1)+'. Both the green count and total shrink. Enter the updated counts and product below.</p>':'')+(kind==='teaching'?'<p>A student multiplies '+g+'/'+total+' by '+g+'/'+total+' for two green draws without replacement. Plan a correction and check whether the student can transfer it.</p>':'')+'<form data-prob-form><div class="connectedFields">'+field('first','First favorable outcomes')+field('total','First total outcomes')+field('second','Second favorable outcomes after the first green')+field('remaining','Second total outcomes')+field('result','Probability of the requested two-draw event (fraction)')+select('rule','Why does this method fit?', [['multiply-conditional','Multiply the first probability by the conditional second probability'],['add','Add the probabilities because there are two draws'],['unchanged','Use the unchanged first probability twice']])+'</div><details class="connectedOptionalWork"><summary>Optional whiteboard · Explain your reasoning</summary><label>Show your calculation and interpretation<textarea data-prob-field="whiteboard" rows="3" '+(t.submitted?'disabled':'')+'>'+E(draft.whiteboard||'')+'</textarea></label></details>'+(kind==='teaching'?select('diagnosis','Diagnose the student error',[['sample-space','The remaining sample space changes'],['rounding','The student rounded too early'],['addition','Multiplication is never appropriate']])+select('model','Choose a model to demonstrate the correction',[['remove','Physically remove one green counter before recounting'],['replace','Return the counter before the second draw'],['color','Change the colors but keep both counts unchanged']])+select('probe','Choose a diagnostic exit question',[['new-draw','Use new counts and ask for the second probability after a green is removed'],['repeat','Ask the student to copy the same answer'],['vocab','Ask the student to spell probability']])+'<label>Your classroom explanation (saved, not automatically graded)<textarea data-prob-field="teaching" rows="3" '+(t.submitted?'disabled':'')+'>'+E(draft.teaching||'')+'</textarea></label>':'')+'<button type="button" data-prob-clear '+(t.submitted?'disabled':'')+'>Clear answer</button><button type="submit" '+(t.submitted?'disabled':'')+'>Check '+(kind==='repair'?'guided repair':'independent response')+'</button></form><p data-prob-feedback role="status">'+E(t.feedback||'')+'</p>'+(t.submitted&&!t.completed?'<button type="button" data-prob-fresh>Try a fresh challenge after repair</button>':'')+(t.completed&&kind==='reasoning'&&m.independentCorrect<2?'<button type="button" data-prob-next>Next fresh independent question</button>':'')+(t.completed&&nextStage[kind]&&!(kind==='reasoning'&&m.independentCorrect<2)?'<button type="button" data-prob-continue>Continue to '+E(labels[nextStage[kind]])+' →</button>':'');
 host.querySelectorAll('[data-remove-green]').forEach(b=>b.onclick=()=>{C().probabilityRemove();mount();});
 host.querySelectorAll('[data-prob-field]').forEach(el=>el.addEventListener('input',()=>C().probabilityDraft(kind,{[el.dataset.probField]:el.value})));
 host.querySelector('[data-prob-clear]')?.addEventListener('click',()=>{
  if(t.submitted)return;
  const fields=[...host.querySelectorAll('[data-prob-field]')];
  const cleared={};
  fields.forEach(el=>{el.value='';cleared[el.dataset.probField]=''});
  C().probabilityDraft(kind,cleared);
  const feedback=host.querySelector('[data-prob-feedback]');
  if(feedback)feedback.textContent='Answer cleared. Rework this same problem and submit when ready.';
 });
 host.querySelector('form').onsubmit=e=>{
  e.preventDefault();const values=Object.fromEntries([...host.querySelectorAll('[data-prob-field]')].map(el=>[el.dataset.probField,el.value]));
  const result=C().probabilityCheck(kind,values);t.feedback=result.message;window.save?.();mount();if(result.ok)window.MajickAnimationEffects?.play(kind==='teaching'?'mastery':kind==='repair'?'success':kind==='transfer'?'lesson':'success');
 };
 host.querySelector('[data-prob-continue]')?.addEventListener('click',()=>open(nextStage[kind]));
 host.querySelector('[data-prob-fresh]')?.addEventListener('click',()=>{const next=C().probabilityFresh(kind);if(next)mount();else open('repair');});
 // Both pointer activation and keyboard click must advance exactly once, even if
 // the campus render queue detaches the original button during pointer release.
 const next=host.querySelector('[data-prob-next]');
 if(next){
  const fromId=t.id;
  const advance=()=>{
   const current=C().probabilityState(false)?.tasks.reasoning;
   if(current?.id!==fromId||!current.completed)return;
   const fresh=C().probabilityAdvanceReasoning?.(fromId);
   if(fresh)mount();
  };
  // One activation owner: pointerup plus click could race with campus re-render.
  // Capture the press before a stale button is detached; keyboard uses click.
  next.addEventListener('pointerdown',e=>{if(e.button===0){e.preventDefault();advance();}});
  next.addEventListener('click',e=>{if(e.detail===0)advance();});
 }
}
window.MajickProbabilityWorkshop={mount,open};
setTimeout(mount,0);
// The main campus can rebuild #content after a saved-screen reload.
// Observe only the root's direct replacement, not every form input or child.
const appRoot=document.getElementById('content');
const parent=appRoot?.parentElement;
if(parent&&window.MutationObserver){
 const hydrationObserver=new MutationObserver(records=>{
  if(records.some(record=>[...record.addedNodes].some(node=>node.id==='content'||node.querySelector?.('#content'))))setTimeout(mount,0);
 });
 hydrationObserver.observe(parent,{childList:true});
}
window.addEventListener('pageshow',()=>setTimeout(mount,0));
})();
