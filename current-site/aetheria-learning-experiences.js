/* Aetheria course mini-games, Guardian coaching, Journal memories and Study Hall decoration.
   Single presentation owner. Existing course packs own curricular answers; existing reward
   core owns XP/fragments. These activities DO NOT write grades or grant currencies. */
(()=>{'use strict';
if(window.MajickLearningExperiences)return;
const VERSION='1.0.0',KEY='aetheria-experiences-v1';
let journal={version:1,memories:[],decor:'desk'},session=null,scheduled=false,lastRoom='';
try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw)){journal={...journal,...raw};if(!Array.isArray(journal.memories))journal.memories=[]}}catch(_){}
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const course=()=>String(window.S?.activeCourse||'').toUpperCase();
const room=()=>String(window.S?.screen||'').toLowerCase();
const xp=()=>Math.max(0,Number(window.MajickScholarProgression?.current?.()?.xp??window.MajickStateCore?.ensureAccount?.()?.xpHighWater??window.S?.majickAccount?.xpHighWater??0));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(journal))}catch(_){}};
const decor=[
 {id:'desk',title:'The Scholar Desk',xp:0,icon:'📖',message:'Your dependable study corner'},
 {id:'lamp',title:'Moonlit Reading Lamp',xp:200,icon:'🕯',message:'Warm lamplight for deep study'},
 {id:'books',title:'Enchanted Bookshelf',xp:600,icon:'📚',message:'A shelf of treasured lessons'},
 {id:'window',title:'Celestial Window Seat',xp:1400,icon:'☾',message:'Study beside the night sky'},
 {id:'botanical',title:'Forest Scholar Nook',xp:3000,icon:'🌿',message:'Greenery and quiet magic'}
];
function sourcePacks(id){return Object.values(window.MajickCourseActivityPlayer?.packs||{}).filter(p=>String(p.courseId||'').toUpperCase()===id)}
function sourced(id){return sourcePacks(id).flatMap(p=>(p.activities||[]).filter(a=>a._sourceVerified&&Array.isArray(a.options)&&a.options.length>1&&Number.isInteger(a.correct)&&a.correct>=0&&a.correct<a.options.length).map(a=>({
 id:p.id+'|'+a.id,lesson:p.title,prompt:String(a.prompt||a.title||''),options:a.options.map(String),correct:a.correct,
 explanation:String(a.explanation||''),source:a.provenance?.source_url||'',title:a.title||''
}))).filter(a=>a.prompt)}
function concepts(id){return sourcePacks(id).flatMap(p=>(p.concepts||[]).filter(c=>c.term&&c.text).map(c=>({term:String(c.term),text:String(c.text),lesson:p.title})))}
function guardian(){try{const c=window.MajickGuardianCore,pet=c?.activePet?.(),meta=pet?c?.meta?.(pet):null;return {name:meta?.name||'Your Guardian',icon:meta?.icon||'✦',image:meta?.image||''}}catch(_){return{name:'Your Guardian',icon:'✦',image:''}}}
function addMemory(id,title,details){
 const key=String(id);if(journal.memories.some(m=>m.key===key))return false;
 journal.memories.unshift({key,title:String(title),details:String(details),course:course(),date:new Date().toISOString()});
 journal.memories=journal.memories.slice(0,80);save();return true;
}
const MODES=[
 {id:'sort',title:'Sound Sorting',icon:'🧩',desc:'Sort each classroom clue into the matching sound or literacy concept.'},
 {id:'match',title:'Phonics Matching',icon:'🔤',desc:'Connect a course concept with its correct meaning.'},
 {id:'classroom',title:'Classroom Decisions',icon:'🏫',desc:'Help a student by choosing the strongest instructional response.'}
];
function activity(id,kind){
 const questions=sourced(id),terms=concepts(id);
 if(kind==='match'){
  const distinct=[],seen=new Set();
  for(const c of terms){const k=c.term.toLowerCase();if(!seen.has(k)){seen.add(k);distinct.push(c)}}
  if(distinct.length<3)return [];
  const selected=distinct.slice(0,5);
  return selected.map((x,i)=>({id:'concept|'+x.term,prompt:'Match this meaning to its course concept: '+x.text,options:selected.map(z=>z.term),correct:i,explanation:x.term+' — '+x.text,source:'',title:x.lesson}));
 }
 if(kind==='sort')return questions.slice(0,5).map(q=>({...q,prompt:'Sort this classroom clue: '+q.prompt}));
 return questions.slice(0,5);
}
function start(kind){
 if(!MODES.some(m=>m.id===kind))return;
 const id=course(),items=activity(id,kind);if(items.length<3){session=null;redraw();return}
 session={kind,course:id,items,index:0,correct:0,firstTry:0,choice:null,assisted:false,feedback:null,complete:false,awarded:false};
 redraw();
}
function answer(index){
 if(!session||session.complete||session.feedback||!Number.isInteger(index))return;
 const q=session.items[session.index];if(!q||index<0||index>=q.options.length)return;
 const right=index===q.correct;
 session.choice=index;session.feedback={right,explanation:q.explanation||'Return to the course reading and compare the options.'};
 if(right){session.correct++;if(!session.assisted)session.firstTry++}
 else session.assisted=true;
 redraw();
}
function retryGuided(){
 if(!session||!session.feedback||session.feedback.right)return;
 session.feedback=null;session.choice=null;session.assisted=true;redraw();
}
function next(){
 if(!session?.feedback?.right)return;
 session.index++;session.choice=null;session.feedback=null;
 if(session.index>=session.items.length){
  session.complete=true;
  if(session.correct===session.items.length){
   const kind=session.kind,cid=session.course;
   const memoryId='game:'+cid+':'+kind;
   session.awarded=addMemory(memoryId,MODES.find(x=>x.id===kind)?.title||'Course Game','First clear; reviewed '+session.items.length+' course concepts. '+(session.assisted?'Guided repair used; no independent mastery claimed.':'Practice-only result; no independent mastery claimed.'));
  }
 }
 redraw();
}
function viewGame(){
 const id=course(),mode=room(),p=sourced(id),terms=concepts(id);
 const count=journal.memories.filter(m=>m.course===id&&m.key.startsWith('game:')).length;
 let s='<section id="aethCourseGames" class="aeth-experience" data-experience-room="'+E(mode)+'" data-course="'+E(id)+'" aria-label="Course-specific interactive mini-games"><header><small>✦ COURSE GAME WORKSHOP · '+E(id)+'</small><h2>Play your course knowledge</h2><p>Real lesson concepts, interactive practice, and Guardian-guided repairs. No duplicate XP or mastery.</p></header>';
 s+='<div class="aeth-mini-menu">'+MODES.map(m=>'<button type="button" data-exp-mode="'+m.id+'"'+((m.id==='match'?terms.length<3:p.length<3)?' disabled':'')+'><span>'+m.icon+'</span><b>'+E(m.title)+'</b><small>'+E(m.desc)+'</small></button>').join('')+'</div>';
 s+='<p class="aeth-exp-summary">'+count+' of 3 game discoveries recorded in your Journal.'+(p.length<3?' This course needs at least 3 verified practice questions for question-based games.':'')+'</p>';
 if(session&&session.course===id){
  const m=MODES.find(x=>x.id===session.kind);
  if(session.complete){s+='<div class="aeth-mini-result" role="status"><h3>✦ '+E(m?.title||'Challenge')+' complete!</h3><p>'+session.correct+'/'+session.items.length+' correct by completion. '+(session.assisted?'Guardian-guided repairs were used.':'All answers were correct on the first attempt.')+'</p><p>'+(session.awarded?'A new first-clear memory was added to your Scholar Journal.':'You can replay for practice; no duplicate rewards are created.')+'</p><button type="button" data-exp-mode="'+session.kind+'">Play again</button></div>'}
  else{
   const q=session.items[session.index],g=guardian(),feedback=session.feedback;
   s+='<div class="aeth-mini-stage"><div class="aeth-mini-progress"><b>'+E(m?.title||'Game')+'</b><span>'+(session.index+1)+' / '+session.items.length+'</span></div><div class="aeth-mini-track"><i style="width:'+Math.round(100*session.index/session.items.length)+'%"></i></div><h3>'+E(q.prompt)+'</h3><div class="aeth-mini-answers" role="group" aria-label="Course answer options">'+q.options.map((o,i)=>'<button type="button" data-exp-answer="'+i+'"'+(session.kind!=='classroom'&&!feedback?' draggable="true"':'')+(feedback?' disabled':'')+' class="'+(feedback&&i===session.choice?(feedback.right?'right':'wrong'):'')+'"><span aria-hidden="true">'+(session.kind==='sort'?'◇':session.kind==='match'?'✦':'▣')+'</span>'+E(o)+'</button>').join('')+'</div>'+(session.kind!=='classroom'&&!feedback?'<div class="aeth-drop-target" data-exp-drop="true" aria-label="Drop the correct concept here">✦ Drag the correct answer here, or tap a card</div>':'');
   if(feedback){
    s+='<div class="aeth-mini-coach" role="status"><div class="aeth-mini-guardian"><span>'+E(g.icon)+'</span><b>'+E(g.name)+' · '+(feedback.right?'Great observation!':'Guided Repair')+'</b></div><p>'+E(feedback.explanation)+'</p>';
    if(q.source)s+='<a href="'+E(q.source)+'" target="_blank" rel="noopener noreferrer">Check the original lesson source</a>';
    s+=feedback.right?'<button type="button" data-exp-next>Next challenge</button>':'<p>Use the explanation to try again. This will be recorded as guided practice, never independent mastery.</p><button type="button" data-exp-retry>Try with Guardian help</button>';
    s+='</div>';
   }
   s+='</div>';
  }
 }
 return s+'</section>';
}
function viewDecor(){
 const total=xp(),active=decor.find(d=>d.id===journal.decor&&total>=d.xp)||decor[0];
 let s='<section id="aethAcademyDecor" class="aeth-experience" data-experience-room="'+E(room())+'" data-course="'+E(course())+'" aria-label="Study Hall decoration"><header><small>✦ MOONLIT COLLEGIUM · SCHOLAR XP '+total+'</small><h2>Your Study Hall details</h2><p>Use earned lifetime XP to choose the atmosphere of your existing Study Hall. XP is not spent.</p></header>';
 s+='<div class="aeth-decor-preview"><span>'+active.icon+'</span><div><b>'+E(active.title)+'</b><small>'+E(active.message)+'</small></div></div>';
 s+='<div class="aeth-decor-choices">'+decor.map(d=>'<button type="button" data-exp-decor="'+d.id+'"'+(total<d.xp?' disabled':'')+' aria-pressed="'+(active.id===d.id)+'"><span>'+d.icon+'</span><b>'+E(d.title)+'</b><small>'+(total<d.xp?'Unlocks at '+d.xp+' lifetime XP':active.id===d.id?'Displayed in Study Hall':'Unlocked · Select')+'</small></button>').join('')+'</div></section>';
 return s;
}
function viewJournal(){
 let s='<section id="aethJournalMemories" class="aeth-experience" data-experience-room="'+E(room())+'" aria-label="Adventure and game memories"><header><small>✦ SCHOLAR JOURNAL</small><h2>Discoveries and Guardian memories</h2><p>One record for each first achievement, with no invented grades, XP or mastery.</p></header>';
 const memories=journal.memories.slice(0,24);
 s+=memories.length?'<div class="aeth-memory-list">'+memories.map(m=>'<article><span>✦</span><div><b>'+E(m.title)+'</b><small>'+E(m.course)+' · '+E((m.date||'').slice(0,10))+'</small><p>'+E(m.details)+'</p></div></article>').join('')+'</div>':'<p class="aeth-exp-summary">Your first course-game discoveries will appear here.</p>';
 return s+'</section>';
}
function sync(){
 const root=document.getElementById('content'),r=room(),id=course();if(!root||!id)return;
 document.documentElement.dataset.aetheriaDecor=journal.decor||'desk';
 const wanted=r==='games'?{key:'aethCourseGames',html:viewGame()}:r==='mission'?{key:'aethAcademyDecor',html:viewDecor()}:r==='journal'?{key:'aethJournalMemories',html:viewJournal()}:null;
 for(const key of ['aethCourseGames','aethAcademyDecor','aethJournalMemories'])if(key!==wanted?.key)document.getElementById(key)?.remove();
 if(!wanted){lastRoom=r;return}
 const existing=document.getElementById(wanted.key);
 if(existing&&existing.dataset?.experienceRoom===r&&existing.dataset.course===id)return;
 existing?.remove();
 const holder=document.createElement('div');holder.innerHTML=wanted.html;const panel=holder.firstElementChild;if(!panel)return;
 const legacy=root.querySelector(':scope > #aethAdventure')||root.querySelector(':scope > .majRoomArchitecture');
 if(legacy)legacy.insertAdjacentElement('afterend',panel);else root.prepend(panel);lastRoom=r;
}
function redraw(){
 const target=document.getElementById('aethCourseGames')||document.getElementById('aethAcademyDecor')||document.getElementById('aethJournalMemories');
 if(!target){sync();return}
 const html=room()==='games'?viewGame():room()==='mission'?viewDecor():viewJournal();
 const holder=document.createElement('div');holder.innerHTML=html;if(holder.firstElementChild)target.replaceWith(holder.firstElementChild);
}

document.addEventListener('dragstart',e=>{
 const b=e.target?.closest?.('#aethCourseGames button[draggable="true"][data-exp-answer]');
 if(!b||!session||session.feedback)return;
 e.dataTransfer?.setData?.('text/plain',String(b.dataset.expAnswer));
 if(e.dataTransfer)e.dataTransfer.effectAllowed='move';
});
document.addEventListener('dragover',e=>{
 if(e.target?.closest?.('#aethCourseGames [data-exp-drop]'))e.preventDefault();
});
document.addEventListener('drop',e=>{
 if(!e.target?.closest?.('#aethCourseGames [data-exp-drop]'))return;
 e.preventDefault();
 const chosen=e.dataTransfer?.getData?.('text/plain')||'';
 if(/^\d{1,2}$/.test(chosen))answer(Number(chosen));
});
document.addEventListener('click',e=>{
 const btn=e.target?.closest?.('button');if(!btn||!btn.closest('.aeth-experience'))return;
 if(btn.hasAttribute('data-exp-mode')){start(btn.dataset.expMode);return}
 if(btn.hasAttribute('data-exp-answer')){answer(Number(btn.dataset.expAnswer));return}
 if(btn.hasAttribute('data-exp-retry')){retryGuided();return}
 if(btn.hasAttribute('data-exp-next')){next();return}
 if(btn.hasAttribute('data-exp-decor')){
  const choice=decor.find(d=>d.id===btn.dataset.expDecor);if(!choice||xp()<choice.xp)return;
  journal.decor=choice.id;save();redraw();
 }
});

document.addEventListener('majick:adventure-first-clear',e=>{
 const d=e.detail||{},id=String(d.course||'').toUpperCase(),kind=String(d.kind||''),key=String(d.key||'');
 if(!id||!['guardian','story','game'].includes(kind)||!key)return;
 const title=kind==='guardian'?'Guardian expedition discovery':kind==='story'?'Story chapter restored':'Rune Lantern cleared';
 const details=kind==='guardian'?String(d.guardian||'Your Guardian')+' explored the '+key.split(':').pop()+' trail and returned with a memory.':kind==='story'?'Completed '+key.replace(/^chapter-/,'chapter ')+' through course practice.':'Completed the interactive rune challenge.';
 const memoryKey='adventure:'+kind+':'+id+':'+key;
 if(!journal.memories.some(m=>m.key===memoryKey)){
  journal.memories.unshift({key:memoryKey,title,details,course:id,date:new Date().toISOString()});
  journal.memories=journal.memories.slice(0,80);save();
 }
 if(room()==='journal')redraw();
});
document.addEventListener('majick:sourced-practice',e=>{
 const d=e.detail||{};if(!d.correct||!d.courseId||!d.lessonId||!d.questionId)return;
 const id=String(d.courseId).toUpperCase();
 // Only sourced practice milestones; no duplicate reward; never call RewardCore.
 const first=window.MajickStudyObservatory?.summary?.(id)?.uniqueCorrect||0;
 if(first>0&&first%5===0)addMemory('sourced:'+id+':'+first,'Five new study discoveries','Reached '+first+' distinct source-linked correct practice answers.');
});
function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;sync()},80)}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('aetheria-experiences',schedule,105);
document.addEventListener('DOMContentLoaded',schedule);
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect')){session=null;schedule()}});
window.addEventListener('pageshow',schedule);
window.MajickLearningExperiences=Object.freeze({VERSION,refresh:schedule,courseGames:activity,memories:()=>journal.memories.slice(),decorations:()=>decor.slice()});
schedule();
})();