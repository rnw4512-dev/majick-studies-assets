/* UI adapter for the shared continuity tracker and generated probability engine. */
(()=>{'use strict';
if(window.MajickProbabilityWorkshop)return;
const C=()=>window.MajickLearningContinuity;
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const places={repair:'learninglab',reasoning:'mission',transfer:'games',teaching:'learninglab'};
const labels={repair:'1 · Repair with counters',reasoning:'2 · Independent OA reasoning',transfer:'3 · Classroom role transfer',teaching:'4 · Teacher application'};
function open(kind){
 if(S.activeCourse!=='D772')return;
 const t=C().probabilityTask(kind);if(!t){const box=document.querySelector('#connectedProbability [data-connected-task]');if(box)box.textContent='Complete the preceding evidence first. If all 42 fresh datasets have been used, your evidence is preserved; additional datasets are needed.';return;}
 const st=C().probabilityState();st.focus=kind;window.save?.();
 if(S.screen!==places[kind])window.navigate(places[kind]);else mount();
 setTimeout(()=>{
  const panel=document.getElementById('connectedProbability');
  if(!panel||S.screen!==places[kind])return;
  panel.scrollIntoView({block:'start',behavior:'instant'});
 },0);
}
// Handle Back at pointer-down capture, before a render-queue pass can detach it.
// Keyboard activation uses click; both paths share one synchronous navigation.
let backPressHandled=false;
function leaveConnectedProbability(event){
 const target=event.target?.closest?.('#connectedProbability [data-connected-back]');
 if(!target)return;
 if(event.type==='pointerdown'&&event.button!==0)return;
 if(event.type==='click'&&backPressHandled){event.preventDefault();return;}
 if(event.type==='pointerdown')backPressHandled=true;
 event.preventDefault();
 event.stopPropagation();
 if(window.S?.screen!=='home')window.navigate?.('home');
}
document.addEventListener('pointerdown',leaveConnectedProbability,true);
document.addEventListener('click',leaveConnectedProbability,true);
document.addEventListener('pointerup',()=>{backPressHandled=false},true);
document.addEventListener('pointercancel',()=>{backPressHandled=false},true);
let heldPointer=null;
document.addEventListener('pointerdown',event=>{
 const box=event.target.closest?.('#connectedProbability');
 if(box&&event.target.closest('button,input,select,textarea'))heldPointer=box;
},true);
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,()=>{
 if(!heldPointer)return;
 heldPointer=null;
 // Allow the native click to reach its original element before refreshing.
 setTimeout(()=>mount(),0);
},true);
function mount(){
 const content=document.getElementById('content');
 if(!content||window.S?.activeCourse!=='D772'||!['learninglab','mission','games'].includes(S.screen)){document.getElementById('connectedProbability')?.remove();return;}
 let box=document.getElementById('connectedProbability');
 if(!box){box=document.createElement('section');box.id='connectedProbability';box.className='connectedProbability';box.setAttribute('aria-label','Connected probability learning');content.prepend(box);}
 const st=C().probabilityState(false),m=C().probabilityMastery();
 // Repeated render-queue passes must not replace an unchanged form between
 // pointer-down and pointer-up or discard focus while a learner is typing.
 const view=JSON.stringify({screen:S.screen,focus:st?.focus,need:st?.need,mastery:m,task:st?.tasks[st?.focus]});
 if(heldPointer===box||box.__majickProbabilityView===view)return;
 box.__majickProbabilityView=view;
 const nav=Object.keys(labels).map(k=>{
 const unlocked=k==='repair'||m.repairVerified&&(k==='reasoning'||m.independentCorrect>=2&&(k==='transfer'||m.transferVerified));
 return '<button type="button" data-connected-open="'+k+'" '+(!unlocked?'disabled':'')+'>'+labels[k]+'</button>';
 }).join('');
 box.innerHTML='<button type="button" class="connectedBack" data-connected-back aria-label="Back to previous campus room">← Back</button><h2>Connected Learning · Probability</h2><p>Original simulated OA-style practice · D772 · Dependent events without replacement</p>'+(st?.need?'<p role="status">Practice recommendation from '+E(st.need.origin)+': recount the remaining favorable outcomes and sample space. This need follows you into Learn Lab, Study Now and Game Realm.</p>':'')+'<p data-connected-evidence>Repair: '+(m.repairVerified?'verified':'needed')+' · Independent reasoning: '+m.independentCorrect+'/2 · Transfer: '+(m.transferVerified?'verified':'needed')+' · Structured teach-back: '+(m.teachBackVerified?'verified':'needed')+' · '+(m.certified?'Probability skill certified':'Not yet certified')+'</p><nav aria-label="Probability learning flow">'+nav+'</nav><div data-connected-task></div><p>Guided work never counts as independent mastery. Written whiteboard and teaching explanations are saved for review; only the structured checks are automatically evaluated.</p>';
 // The Back control is recreated by mount(). Its action must not depend on
 // a listener attached to a node that may be detached between press and release.
 // Navigation is owned by the delegated document capture handler below.
 box.querySelectorAll('[data-connected-open]').forEach(b=>b.onclick=()=>open(b.dataset.connectedOpen));
 const kind=st?.focus,t=st?.tasks[kind];if(!t||places[kind]!==S.screen)return;
 const host=box.querySelector('[data-connected-task]'),draft=st.drafts[kind]||{},q=t.q,[g,p]=q.data,total=g+p;
 const field=(key,label)=>'<label>'+label+'<input data-prob-field="'+key+'" value="'+E(draft[key]||'')+'" autocomplete="off" inputmode="'+(key==='result'?'text':'numeric')+'" '+(t.submitted?'disabled':'')+'></label>';
 const select=(key,label,options)=>'<label>'+label+'<select data-prob-field="'+key+'" '+(t.submitted?'disabled':'')+'><option value="">Choose a response</option>'+options.map(([v,text])=>'<option value="'+v+'" '+(draft[key]===v?'selected':'')+'>'+text+'</option>').join('')+'</select></label>';
 let visual=q.visualHtml;
 if(kind==='repair'){
  const remaining=t.removed?g-1:g;
  visual='<p>Hands-on model: remove one green counter to represent the first successful draw.</p><div class="connectedCounters">'+Array.from({length:remaining},(_,i)=>'<button type="button" data-remove-green aria-label="Remove green counter '+(i+1)+'" '+(t.removed||t.submitted?'disabled':'')+'>G</button>').join('')+Array.from({length:p},()=>'<span aria-label="Purple counter">P</span>').join('')+'</div><p data-counter-status>'+remaining+' green and '+p+' purple remain.</p>';
 }
 host.innerHTML='<h3>'+labels[kind]+'</h3><p data-prob-prompt>'+E(q.prompt)+'</p>'+visual+(kind==='repair'?'<p>Guided calculation: after removing a green, multiply '+g+'/'+total+' × '+(g-1)+'/'+(total-1)+'. Both the green count and total shrink. Enter the updated counts and product below.</p>':'')+(kind==='teaching'?'<p>A student multiplies '+g+'/'+total+' by '+g+'/'+total+' for two green draws without replacement. Plan a correction and check whether the student can transfer it.</p>':'')+'<form data-prob-form><div class="connectedFields">'+field('first','First favorable outcomes')+field('total','First total outcomes')+field('second','Second favorable outcomes after the first green')+field('remaining','Second total outcomes')+field('result','Probability of the requested two-draw event (fraction)')+select('rule','Why does this method fit?', [['multiply-conditional','Multiply the first probability by the conditional second probability'],['add','Add the probabilities because there are two draws'],['unchanged','Use the unchanged first probability twice']])+'</div><label>Whiteboard: show your calculation and interpretation<textarea data-prob-field="whiteboard" rows="3" '+(t.submitted?'disabled':'')+'>'+E(draft.whiteboard||'')+'</textarea></label>'+(kind==='teaching'?select('diagnosis','Diagnose the student error',[['sample-space','The remaining sample space changes'],['rounding','The student rounded too early'],['addition','Multiplication is never appropriate']])+select('model','Choose a model to demonstrate the correction',[['remove','Physically remove one green counter before recounting'],['replace','Return the counter before the second draw'],['color','Change the colors but keep both counts unchanged']])+select('probe','Choose a diagnostic exit question',[['new-draw','Use new counts and ask for the second probability after a green is removed'],['repeat','Ask the student to copy the same answer'],['vocab','Ask the student to spell probability']])+'<label>Your classroom explanation (saved, not automatically graded)<textarea data-prob-field="teaching" rows="3" '+(t.submitted?'disabled':'')+'>'+E(draft.teaching||'')+'</textarea></label>':'')+'<button type="button" data-prob-clear '+(t.submitted?'disabled':'')+'>Clear answer</button><button type="submit" '+(t.submitted?'disabled':'')+'>Check '+(kind==='repair'?'guided repair':'independent response')+'</button></form><p data-prob-feedback role="status">'+E(t.feedback||'')+'</p>'+(t.submitted&&!t.completed?'<button type="button" data-prob-fresh>Try a fresh challenge after repair</button>':'')+(t.completed&&kind==='reasoning'&&m.independentCorrect<2?'<button type="button" data-prob-next>Next fresh independent question</button>':'');
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
  next.addEventListener('pointerup',advance);
  next.addEventListener('click',advance);
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
