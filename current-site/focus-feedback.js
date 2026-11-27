(()=>{
'use strict';
const VERSION='3.3.63';
let lastCelebration='';
function account(){
 if(!window.S)return null;
 return window.S.majickAccount||(window.S.majickAccount={});
}
function prefs(){
 const a=account();if(!a)return {focus:true};
 a.uiPolish=a.uiPolish||{};
 if(typeof a.uiPolish.focus!=='boolean')a.uiPolish.focus=true;
 return a.uiPolish;
}
function save(){try{window.save?.()}catch(_){}}
function applyFocus(){
 document.documentElement.dataset.majickFocus=String(prefs().focus!==false);
}
function toggleFocus(){
 prefs().focus=prefs().focus===false?true:false;save();applyFocus();decorateDensity();decorateComfortButton();
}
function decorateComfortButton(){
 const box=document.querySelector('.lcComfortChoices');if(!box)return;
 let b=box.querySelector('[data-v3363-focus]');
 if(!b){
  b=document.createElement('button');b.type='button';b.dataset.v3363Focus='true';
  const reset=box.querySelector('[data-lc-reset]');(reset||box.firstChild)?.before?.(b);if(!b.isConnected)box.prepend(b);
  b.addEventListener('click',toggleFocus);
 }
 b.textContent='Focus layout: '+(prefs().focus!==false?'on':'off');
 b.setAttribute('aria-pressed',String(prefs().focus!==false));
}
function installArchiveControl(){
 const sec=document.querySelector('.v3356ArchiveIndex');if(!sec)return;
 let b=sec.querySelector('.v3363ArchiveToggle');
 if(!b){
  b=document.createElement('button');b.type='button';b.className='v3363ArchiveToggle';
  b.addEventListener('click',()=>{
   sec.classList.toggle('v3363Expanded');
   b.setAttribute('aria-expanded',String(sec.classList.contains('v3363Expanded')));
   b.textContent=sec.classList.contains('v3363Expanded')?'Hide concept shelves':'Show concept shelves';
  });
  sec.querySelector('header')?.append(b);
 }
 const collapsed=prefs().focus!==false&&!sec.classList.contains('v3363Expanded');
 sec.classList.toggle('v3363FocusCollapsed',collapsed);
 b.setAttribute('aria-expanded',String(!collapsed));
 b.textContent=collapsed?'Show concept shelves':'Hide concept shelves';
}
// Only active question surfaces trigger focus. Never hide question-required evidence.
const ACTIVE_PROMPT='.guidedQuestion>h3,.v3333Prompt,.qwrap .question,.majExamPrompt';
let focusedRoot=null,previousPrompt='',queuedFocus=false;
function clearQuestionFocus(root){
 if(!root)return;
 root.classList.remove('majQuestionFirst');
 root.querySelectorAll('.majQuestionPrimary').forEach(el=>el.classList.remove('majQuestionPrimary'));
 root.querySelectorAll('.majQuestionSecondary').forEach(el=>el.classList.remove('majQuestionSecondary'));
}
function questionFirst(){
 const root=document.getElementById('content');
 if(focusedRoot&&focusedRoot!==root)clearQuestionFocus(focusedRoot);
 focusedRoot=root;if(!root)return;
 const prompt=[...root.querySelectorAll(ACTIVE_PROMPT)].find(el=>!el.closest('[hidden]')&&el.getClientRects().length);
 if(!prompt||prefs().focus===false){clearQuestionFocus(root);previousPrompt='';return;}
 root.classList.add('majQuestionFirst');
 // Retain all live nodes, event handlers, and their parent selectors.
 // Only the branch containing the active question gets priority.
 let primary=prompt;while(primary.parentElement&&primary.parentElement!==root)primary=primary.parentElement;
 for(const el of root.children)el.classList.toggle('majQuestionPrimary',el===primary);
 for(const el of root.querySelectorAll('.learnLab,.majMixedExam,.qwrap,.v3333QuestionShell')){
  if(!el.contains(prompt))continue;
  let branch=prompt;while(branch.parentElement&&branch.parentElement!==el)branch=branch.parentElement;
  for(const child of el.children){
   if(child===branch)continue;
   if(child.matches('.learnHero,.learnRecommendation,details,.rewardStrip'))child.classList.add('majQuestionSecondary');
  }
 }
 // Keep the existing learning path and room navigation reachable below the question.
 // Native disclosures remain operable and existing explicit opens are preserved.
 const key=(window.S?.activeCourse||'')+'|'+(window.S?.screen||'')+'|'+prompt.textContent.trim();
 if(previousPrompt!==key){
  const advance=!!previousPrompt;previousPrompt=key;
  if(advance)requestAnimationFrame(()=>{if(prompt.isConnected&&prompt.getClientRects().length){prompt.scrollIntoView({block:'start',behavior:'instant'});if(!prompt.hasAttribute('tabindex'))prompt.tabIndex=-1;prompt.focus({preventScroll:true});}});
 }
}
function scheduleQuestionFocus(){if(queuedFocus)return;queuedFocus=true;requestAnimationFrame(()=>{queuedFocus=false;questionFirst()})}
function decorateDensity(){applyFocus();installArchiveControl();questionFirst()}
function decorateEmptyStates(){
 const selectors=['.learnEmpty','.tutorLocked','.v3338Empty'];
 document.querySelectorAll(selectors.join(',')).forEach(el=>{
  if(el.querySelector('.v3363StateSigil'))return;
  el.classList.add('v3363ArcaneState');
  const s=document.createElement('span');s.className='v3363StateSigil';s.setAttribute('aria-hidden','true');s.textContent='✦';el.prepend(s);
 });
 document.querySelectorAll('.v3338Stage').forEach(el=>{
  if(!/loading/i.test(el.textContent||'')||el.querySelector('.v3363StateSigil'))return;
  el.classList.add('v3363ArcaneState','loading');
  const s=document.createElement('span');s.className='v3363StateSigil';s.setAttribute('aria-hidden','true');s.textContent='☾';el.prepend(s);
 });
}
function guardian(){
 try{
  const core=window.MajickGuardianCore,p=core?.activePet?.();return p?core.meta?.(p):null;
 }catch(_){return null}
}
function guardianChip(target,line){
 const g=guardian();if(!g||!target)return null;
 let chip=target.querySelector(':scope > .v3363GuardianNod');
 if(!chip){
  chip=document.createElement('aside');chip.className='v3363GuardianNod';
  target.append(chip);
 }
 chip.innerHTML=(g.image?'<img src="'+String(g.image).replace(/"/g,'&quot;')+'" alt="">':'<span>'+String(g.icon||'✦')+'</span>')+
   '<div><small>'+String(g.name||'Guardian')+'</small><b>'+line+'</b></div>';
 return chip;
}
function celebrate(target,kind){
 if(!target)return;
 const title=(target.querySelector('h1,h2')?.textContent||target.textContent||'').trim().slice(0,100);
 const sig=(window.S?.screen||'')+'|'+kind+'|'+title;
 const line=kind==='section'?'The hall remembers this victory.':kind==='mastery'?'Your Guardian marks the lesson as mastered.':'Your Guardian noticed that win.';
 const chip=guardianChip(target,line);
 if(sig===lastCelebration)return;
 lastCelebration=sig;
 target.classList.remove('v3363SuccessMoment','v3363SectionMoment');void target.offsetWidth;
 target.classList.add(kind==='section'?'v3363SectionMoment':'v3363SuccessMoment');
 if(!window.MajickRenderQueue?.reduced?.())try{window.MajickGuardianCore?.sparks?.(chip,kind==='section'?24:12)}catch(_){}
}
function decorateSuccess(){
 const ready=document.querySelector('.v3338CheckpointResult.ready');
 if(ready)celebrate(ready,'mastery');
 const realm=document.querySelector('.realmResultHero');
 if(realm){
  const text=realm.textContent||'';
  if(/D772 Section 1 Review/i.test(text))celebrate(realm,'section');
  else if(/TRIAL CLEARED|NEW REALM BEST/i.test(text))celebrate(realm,'win');
 }
}
function decorate(){
 document.documentElement.dataset.majickFocusFeedback='3363';
 decorateComfortButton();decorateDensity();decorateEmptyStates();decorateSuccess();
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('focus-feedback',decorate,100);q.schedule()}else setTimeout(decorate,160);
const focusObserver=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName==='hidden'))scheduleQuestionFocus()});
focusObserver.observe(document.getElementById('app')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
window.MajickFocusFeedback={VERSION,prefs,applyFocus,toggleFocus,decorateDensity,decorateEmptyStates,guardian,decorateSuccess,decorate,questionFirst};
})();