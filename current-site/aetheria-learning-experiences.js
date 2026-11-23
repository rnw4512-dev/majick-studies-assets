/* Aetheria course mini-games, Guardian coaching, Journal memories and Study Hall decoration.
   Single presentation owner. Existing course packs own curricular answers; existing reward
   core owns XP/fragments. These activities DO NOT write grades or grant currencies. */
(()=>{'use strict';
if(window.MajickLearningExperiences)return;
const VERSION='1.3.0',KEY='aetheria-experiences-v1';
let journal={version:1,memories:[],decor:'desk',playRuns:{}},session=null,deep=null,vocabRun=null,selectedSection=1,scheduled=false,lastRoom='';
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

function catalog(id){return window.MajickCourseManager?.COURSE_CATALOG?.[id]||window.S?.courses?.[id]||null}
function sectionRows(id,n){
 const c=catalog(id),sec=(c?.studySections||[]).find(x=>x.id===id.toLowerCase()+'-section-'+n);
 if(!sec)return {section:null,lessons:[],questions:[]};
 const lessons=(sec.lessons||[]).flatMap(l=>(l.sublessons?.length?l.sublessons:[l]).map(t=>({id:String(t.id||l.title),title:String(t.title||l.title),ideas:Array.isArray(t.keyIdeas)?t.keyIdeas:[]})));
 const questions=(c?.questionBank||[]).filter(q=>q.section==='Section '+n&&Array.isArray(q.options)&&q.options.length>=2).map(q=>{
 const index=q.options.findIndex(o=>String(o)===String(q.answer));
 return {id:'catalog|'+q.id,lesson:'Section '+n,prompt:String(q.prompt||''),options:q.options.map(String),correct:index,explanation:String(q.why||''),source:'',title:'Course catalog review'}
 }).filter(q=>q.prompt&&q.correct>=0);
 return {section:sec,lessons,questions};
}
function sectionQuestions(id,n){
 if(id!=='D669')return sourced(id);
 const row=sectionRows(id,n),packs=n===2?sourced(id):[];
 const seen=new Set();return [...row.questions,...packs].filter(q=>{if(seen.has(q.id))return false;seen.add(q.id);return true});
}
function sectionOverview(id){
 if(id!=='D669')return '';
 const row=sectionRows(id,selectedSection),all=[1,2,3].map(n=>({n,data:sectionRows(id,n),count:sectionQuestions(id,n).length}));
 let s='<div class="aeth-section-picker"><h3>Study Sections 1–3</h3><div class="aeth-section-buttons" role="group" aria-label="D669 sections">';
 s+=all.map(x=>'<button type="button" data-exp-section="'+x.n+'" aria-pressed="'+(x.n===selectedSection)+'"><b>Section '+x.n+'</b><small>'+E((x.data.section?.title||'').replace(/^Section \d+:?\s*/,''))+'</small><em>'+x.data.lessons.length+' topics · '+x.count+' practice questions</em></button>').join('');
 s+='</div><div class="aeth-section-outline"><h4>'+E(row.section?.title||'Section '+selectedSection)+'</h4><p>Open a topic for its existing course notes. The games below use the practice questions available for this section.</p><div class="aeth-section-lessons">';
 s+=row.lessons.map(l=>'<details><summary>'+E(l.title)+'</summary>'+(l.ideas.length?'<ul>'+l.ideas.slice(0,4).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>':'<p>See the course Learning Path for the full topic content.</p>')+'</details>').join('');
 if(!row.lessons.length)s+='<div class="aeth-section-pending"><b>Section outline available — detailed lessons still needed</b><p>The course catalog identifies this as '+E(row.section?.title||'Section '+selectedSection)+'. Its lesson-by-lesson content has not been loaded, so the game will not invent questions or claim completion.</p></div>';
 return s+'</div></div></div>';
}

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
 const questions=sectionQuestions(id,selectedSection),terms=id==='D669'&&selectedSection!==2?[]:concepts(id);
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

/* Original supplemental practice derived from the D669 sourced lesson examples.
   These are learning manipulatives, not WGU assessment items or official grading. */
const DEEP_MODES=[
 {id:'forge',title:'Phoneme Forge',icon:'🔮',desc:'Build spoken words by arranging phoneme stones.'},
 {id:'sequence',title:'Spell Sequence',icon:'🪄',desc:'Arrange teaching and decoding steps in the right order.'},
 {id:'scenario',title:'Classroom Quest',icon:'🎭',desc:'Make teaching decisions and see how the student responds.'}
];
const D669_FORGE=[
 {id:'map',word:'map',parts:['/m/','/ă/','/p/'],extras:['/s/'],clue:'The student hears three individual sounds. Build the spoken word map.',tip:'Three sounds blend to make map. Phonemic awareness can work entirely with speech.'},
 {id:'sun',word:'sun',parts:['/s/','/ŭ/','/n/'],extras:['/m/'],clue:'Blend the sounds /s/ /ŭ/ /n/ to make sun.',tip:'Segment and blend the three spoken phonemes in sun.'},
 {id:'hop',word:'hop',parts:['/h/','/ŏ/','/p/'],extras:['/t/'],clue:'Change the first sound in top to make hop; assemble the new word.',tip:'Replacing an initial phoneme changes top to hop.'},
 {id:'pat',word:'pat',parts:['/p/','/ă/','/t/'],extras:['/b/'],clue:'Replace the beginning sound in bat to make pat.',tip:'Phoneme substitution changes bat to pat.'},
 {id:'ship',word:'ship',parts:['/sh/','/ĭ/','/p/'],extras:['/s/'],clue:'Put the three spoken sounds in ship in order. /sh/ is one phoneme.',tip:'The grapheme sh represents one sound, /sh/.'}
];
const D669_SEQUENCE=[
 {id:'cvc',title:'Model and blend CVC words',parts:['Hear /m/ /ă/ /p/','Blend the sounds together','Say map','Check the spoken word'],tip:'Modeling the sounds before blending helps demonstrate phonemic blending.'},
 {id:'substitution',title:'Transform bat into pat',parts:['Say bat','Identify its first phoneme /b/','Replace /b/ with /p/','Say pat'],tip:'Substitution changes one phoneme while the other sounds stay the same.'},
 {id:'deletion',title:'Remove a sound from ground',parts:['Say ground','Identify the initial /g/','Remove /g/','Say round'],tip:'Phoneme deletion works with individual speech sounds.'},
 {id:'wordchain',title:'Build a phonics word chain',parts:['Read a known word','Change one grapheme','Blend the new letter-sound pattern','Read and check the new word'],tip:'Word chains make letter-sound connections explicit and cumulative.'},
 {id:'diagnostic',title:'Respond to a vowel reading error',parts:['Listen to the student read','Notice the recurring vowel error','Model the needed vowel pattern','Have the student apply and check it'],tip:'Diagnostic teaching adjusts instruction using student responses.'}
];
function shuffleDeterministically(rows,seed){
 const list=rows.slice();let n=(seed+1)*7919;
 for(let i=list.length-1;i>0;i--){n=(n*48271)%2147483647;const j=n%(i+1);[list[i],list[j]]=[list[j],list[i]]}
 return list;
}
function deepPool(cid,kind){
 if(cid==='D669'&&kind==='forge')return selectedSection===2?D669_FORGE:[];
 if(cid==='D669'&&kind==='sequence')return selectedSection===2?D669_SEQUENCE:[];
 if(kind==='scenario'){
  return sectionQuestions(cid,selectedSection).filter(q=>q.options.length>=2).map(q=>({
   id:q.id,title:q.lesson||'Classroom case',prompt:q.prompt,
   options:q.options,correct:q.correct,explanation:q.explanation,
   consequence:'The student needs a response based on the teaching evidence, not a guess.',
   source:q.source
  }));
 }
 // Non-D669 courses may use verified course concepts in a configurable
 // matching mode, but should not receive invented phoneme/sequence lessons.
 return [];
}
function deepStart(kind){
 const cid=course(),pool=deepPool(cid,kind);
 if(!DEEP_MODES.some(m=>m.id===kind)||pool.length<3)return;
 session=null;vocabRun=null;
 const runs=journal.playRuns||{},cycle=Number(runs[cid+':'+kind]||0);
 const ordered=shuffleDeterministically(pool,cycle);
 const items=ordered.slice(0,Math.min(4,ordered.length));
 journal.playRuns={...runs,[cid+':'+kind]:cycle+1};save();
 deep={kind,course:cid,items,index:0,tiles:[],feedback:null,repairs:0,completed:false,firstTry:0,outcomes:[],turn:0,usedCoach:false,
    optionOrder:[],stage:'choose'};
 deepReset();redraw();
}
function deepReset(){
 if(!deep||deep.completed)return;
 const q=deep.items[deep.index],pool=deep.kind==='forge'?[...q.parts,...q.extras]:deep.kind==='sequence'?q.parts:q.options;
 const seeded=deep.index+(journal.playRuns?.[deep.course+':'+deep.kind]||1)*13;
 deep.optionOrder=deep.kind==='scenario'?pool.map((x,i)=>({id:i,label:x})):shuffleDeterministically(pool.map((label,i)=>({id:i,label})),seeded);
 deep.tiles=[];deep.feedback=null;deep.stage='choose';
}
function deepTile(index){
 if(!deep||deep.completed||deep.feedback)return false;
 const choice=deep.optionOrder.find(x=>x.id===index);
 if(!choice)return false;
 if(deep.kind==='scenario'){
  deep.tiles=[index];
  const q=deep.items[deep.index],right=index===q.correct;
  deep.feedback={right,explanation:q.explanation||'Compare this decision to the source lesson.'};
  if(!right){deep.repairs++;deep.usedCoach=true;deep.outcomes[deep.index]='The student applies this approach but still needs support with: '+q.prompt+' Your Guardian recommends reviewing the explanation and choosing a more targeted teaching response.'}
  else{deep.outcomes[deep.index]='The student now has a clearer next step for: '+q.prompt+' The teaching response can be checked against the cited course explanation.';if(!deep.usedCoach)deep.firstTry++}
 }else{
  if(deep.tiles.includes(index))return false;
  deep.tiles.push(index);
 }
 redraw();return true;
}
function deepUndo(){if(!deep||deep.completed||deep.feedback||deep.kind==='scenario')return;deep.tiles.pop();redraw()}
function deepCheck(){
 if(!deep||deep.completed||deep.feedback||deep.kind==='scenario')return;
 const q=deep.items[deep.index],needed=(deep.kind==='forge'?q.parts:q.parts).length;
 if(deep.tiles.length!==needed)return;
 const solution=q.parts,selected=deep.tiles.map(i=>deep.optionOrder.find(x=>x.id===i)?.label);
 const right=selected.every((v,i)=>v===solution[i]);
 deep.feedback={right,explanation:right?q.tip:'Compare the arrangement carefully. '+q.tip};
 if(right&&!deep.usedCoach)deep.firstTry++;
 if(!right){deep.repairs++;deep.usedCoach=true}
 redraw();
}
function deepRetry(){if(!deep||!deep.feedback||deep.feedback.right)return;deep.feedback=null;deep.tiles=[];deep.usedCoach=true;redraw()}
function deepNext(){
 if(!deep?.feedback?.right)return;
 deep.index++;
 if(deep.index>=deep.items.length){
  deep.completed=true;
  deep.firstClear=addMemory('deep:'+deep.course+':'+deep.kind,'First '+(DEEP_MODES.find(m=>m.id===deep.kind)?.title||'challenge')+' completion',
   'Finished '+deep.items.length+' interactive learning challenges.'+(deep.repairs?' Used Guardian-guided repairs.':'')+' Practice does not certify independent mastery.');
 }else{deep.usedCoach=false;deepReset()}
 redraw();
}
function deepMarkup(){
 if(!deep||deep.course!==course())return '';
 const mode=DEEP_MODES.find(m=>m.id===deep.kind);
 if(deep.completed)return '<section class="aeth-deep-stage" aria-label="Completed interactive game" role="status"><h3>✦ '+E(mode.title)+' complete</h3><p>Finished '+deep.items.length+' puzzles; '+deep.repairs+' guided repairs. '+(deep.firstClear?'A first-clear memory was added to your Journal.':'This replay did not create another memory.')+'</p><button type="button" data-deep-mode="'+deep.kind+'">Play another set</button></section>';
 const q=deep.items[deep.index],arr=deep.tiles.map(id=>deep.optionOrder.find(x=>x.id===id)?.label).filter(Boolean);
 let s='<section class="aeth-deep-stage" aria-label="'+E(mode.title)+'"><div class="aeth-mini-progress"><b>'+E(mode.title)+'</b><span>Round '+(deep.index+1)+' / '+deep.items.length+'</span></div>';
 s+='<div class="aeth-mini-track"><i style="width:'+Math.round(100*deep.index/deep.items.length)+'%"></i></div>';
 if(deep.kind==='forge'){
  s+='<div class="aeth-word-forge" role="img" aria-label="Spoken-word phoneme building station"><span>◌</span><b>'+E(q.word)+'</b><span>✧</span></div>';
  s+='<h3>'+E(q.clue)+'</h3><p>Tap the sound stones in order to build the word. Each stone represents a spoken phoneme.</p>';
 }else if(deep.kind==='sequence'){
  s+='<h3>'+E(q.title)+'</h3><p>Arrange the teaching steps in their logical sequence. Tap a step to add it to your plan.</p>';
 }else{
  s+='<h3>'+E(q.title)+'</h3><p>'+E(q.prompt)+'</p><div class="aeth-classroom-visual"><span aria-hidden="true">🧒🏽</span><b>Student response</b><p>'+E(deep.outcomes[deep.index]||'Your student is waiting for a teaching decision. What would you do next?')+'</p></div>';
 }
 if(deep.kind!=='scenario')s+='<div class="aeth-assembly" aria-label="Assembled answer">'+(arr.length?arr.map((x,i)=>'<span><small>'+(i+1)+'</small>'+E(x)+'</span>').join(''):'<span class="aeth-empty-slot">Your selections appear here</span>')+'</div>';
 s+='<div class="aeth-deep-options" role="group" aria-label="'+(deep.kind==='forge'?'Phoneme stones':deep.kind==='sequence'?'Sequence tiles':'Classroom actions')+'">'+deep.optionOrder.map(t=>'<button type="button" data-deep-tile="'+t.id+'"'+(deep.kind!=='scenario'&&!deep.feedback?' draggable="true"':'')+(deep.feedback||deep.tiles.includes(t.id)?' disabled':'')+' class="'+(deep.tiles.includes(t.id)?'placed':'')+'"><span aria-hidden="true">'+(deep.kind==='forge'?'◈':deep.kind==='sequence'?'▣':'✦')+'</span>'+E(t.label)+'</button>').join('')+'</div>'+(deep.kind!=='scenario'&&!deep.feedback?'<div class="aeth-drop-target" data-deep-drop="true" aria-label="Drop a tile to append it to your sequence">✦ Drop the next tile here, or tap it above</div>':'');
 if(!deep.feedback&&deep.kind!=='scenario'){
  s+='<div class="aeth-deep-actions"><button type="button" data-deep-undo'+(!deep.tiles.length?' disabled':'')+'>Undo last</button><button type="button" data-deep-check'+(deep.tiles.length!==q.parts.length?' disabled':'')+'>Check my '+(deep.kind==='forge'?'word':'sequence')+'</button></div>';
 }
 if(deep.feedback){
  const g=guardian(),right=deep.feedback.right;
  s+='<div class="aeth-mini-coach" role="status"><div class="aeth-mini-guardian"><span>'+E(g.icon)+'</span><b>'+E(g.name)+' · '+(right?'Discovery made!':'Repair together')+'</b></div><p>'+E(deep.feedback.explanation)+'</p>';
  if(!right)s+='<p>'+(deep.kind==='scenario'?'Your initial response has a consequence; consider the course evidence and select a better next action.':'Your arrangement needs reconstructing. Compare each position before retrying.')+'</p><button type="button" data-deep-retry>Repair with Guardian help</button>';
  else s+='<button type="button" data-deep-next>Continue the adventure</button>';
  if(deep.kind==='scenario'&&q.source)s+='<a href="'+E(q.source)+'" target="_blank" rel="noopener noreferrer">Check lesson source</a>';
  s+='</div>';
 }
 return s+'<p class="aeth-game-evidence">Supplemental guided game practice • No XP, crystals, fragments, or independent mastery earned here.</p></section>';
}


function vocabQuestions(){
 const pack=sourcePacks('D669').find(p=>p.id==='lesson-3-8');if(!pack)return [];
 return ['tier-1','tier-2','tier-3','graves-rich','graves-individual','graves-strategies','graves-consciousness']
 .map(key=>pack.activities.find(a=>a.id===key&&a._sourceVerified)).filter(Boolean)
 .map(a=>({id:a.id,prompt:a.prompt,answer:String(a.options[a.correct]),reason:a.explanation,source:a.provenance.source_url}));
}
const VOCAB_LABELS={
 tiers:['Tier One','Tier Two','Tier Three'],
 plan:['Provide Rich and Varied Language Experiences','Teach Individual Words','Teach Word-Learning Strategies','Foster Word Consciousness']
};
function vocabStart(){
 const q=vocabQuestions();if(q.length!==7)return;
 session=null;deep=null;
 vocabRun={items:q,index:0,feedback:null,wrong:0,complete:false,firstClear:false};redraw();
}
function vocabChoose(label){
 if(!vocabRun||vocabRun.complete||vocabRun.feedback)return;
 const q=vocabRun.items[vocabRun.index],right=String(label)===q.answer;
 vocabRun.feedback={right};
 if(!right)vocabRun.wrong++;
 redraw();
}
function vocabRetry(){if(!vocabRun?.feedback||vocabRun.feedback.right)return;vocabRun.feedback=null;redraw()}
function vocabNext(){
 if(!vocabRun?.feedback?.right)return;
 vocabRun.index++;vocabRun.feedback=null;
 if(vocabRun.index>=vocabRun.items.length){
  vocabRun.complete=true;
  vocabRun.firstClear=addMemory('deep:D669:vocabulary-3-8','Lesson 3.8 Vocabulary Lab complete',
   'Practiced vocabulary tiers and Graves’s four-part plan. '+vocabRun.wrong+' guided repairs; no independent mastery claimed.');
 }
 redraw();
}
function vocabMarkup(){
 if(!vocabRun)return '';
 if(vocabRun.complete)return '<section class="aeth-deep-stage aeth-vocab-game" role="status"><h3>Vocabulary Lab restored!</h3><p>All seven clues matched. '+vocabRun.wrong+' Guardian repairs. '+(vocabRun.firstClear?'New discovery recorded in your Journal.':'Replay completed; no duplicate discovery.')+'</p><button type="button" data-vocab-start>Play again</button></section>';
 const q=vocabRun.items[vocabRun.index],tier=q.id.startsWith('tier-'),g=guardian();
 let s='<section class="aeth-deep-stage aeth-vocab-game"><div class="aeth-mini-progress"><b>Lesson 3.8 · '+(tier?'Vocabulary Tier Cake':'Graves Four-Part Plan')+'</b><span>'+(vocabRun.index+1)+' / 7</span></div>';
 s+='<div class="aeth-vocab-visual" aria-hidden="true">'+(tier?'<span>Tier 3 · Specific</span><span>Tier 2 · Across texts</span><span>Tier 1 · Everyday</span>':'<span>Rich language</span><span>Individual words</span><span>Strategies</span><span>Word curiosity</span>')+'</div>';
 s+='<h3>'+E(q.prompt)+'</h3><p>Choose the matching category. Drag it into the drop zone or tap the card.</p><div class="aeth-deep-options" role="group" aria-label="Vocabulary categories">';
 s+=VOCAB_LABELS[tier?'tiers':'plan'].map(label=>'<button type="button" data-vocab-choice="'+E(label)+'"'+(!vocabRun.feedback?' draggable="true"':' disabled')+'><span aria-hidden="true">◈</span>'+E(label)+'</button>').join('')+'</div>';
 if(!vocabRun.feedback)s+='<div class="aeth-drop-target" data-vocab-drop>✦ Drop the matching category here</div>';
 if(vocabRun.feedback){
  s+='<div class="aeth-mini-coach" role="status"><div class="aeth-mini-guardian"><span>'+E(g.icon)+'</span><b>'+E(g.name)+' · '+(vocabRun.feedback.right?'Clue restored!':'Guided vocabulary repair')+'</b></div><p>'+E(q.reason)+'</p>';
  s+=vocabRun.feedback.right?'<button type="button" data-vocab-next>Next clue</button>':'<button type="button" data-vocab-retry>Try again with Guardian help</button>';
  s+='<a href="'+E(q.source)+'" target="_blank" rel="noopener noreferrer">Review WGU source figure</a></div>';
 }
 return s+'<p class="aeth-game-evidence">Ungraded guided practice · no XP, fragments or independent mastery</p></section>';
}

function start(kind){
 if(!MODES.some(m=>m.id===kind))return;
 deep=null;vocabRun=null;
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
 const id=course(),mode=room(),p=sectionQuestions(id,selectedSection),terms=id==='D669'&&selectedSection!==2?[]:concepts(id);
 const count=journal.memories.filter(m=>m.course===id&&(m.key.startsWith('game:')||m.key.startsWith('deep:'))).length;
 let s='<section id="aethCourseGames" class="aeth-experience" data-experience-room="'+E(mode)+'" data-course="'+E(id)+'" aria-label="Course-specific interactive mini-games"><header><small>✦ COURSE GAME WORKSHOP · '+E(id)+'</small><h2>Play your course knowledge</h2><p>Real lesson concepts, interactive practice, and Guardian-guided repairs. No duplicate XP or mastery.</p></header>';
 s+=sectionOverview(id);
 if(id==='D669'&&selectedSection===2)s+='<div class="aeth-vocab-entry"><b>📚 Lesson 3.8 · Vocabulary Lab</b><p>Sort three vocabulary tiers and match the four parts of Graves’s vocabulary plan.</p><button type="button" data-vocab-start'+(vocabQuestions().length!==7?' disabled':'')+'>Open Vocabulary Lab</button></div>';
 s+='<div class="aeth-mini-menu">'+MODES.map(m=>'<button type="button" data-exp-mode="'+m.id+'"'+((m.id==='match'?terms.length<3:p.length<3)?' disabled':'')+'><span>'+m.icon+'</span><b>'+E(m.title)+'</b><small>'+E(m.desc)+'</small></button>').join('')+'</div>';
 s+='<div class="aeth-mini-menu aeth-deep-menu">'+DEEP_MODES.map(m=>'<button type="button" data-deep-mode="'+m.id+'"'+(deepPool(id,m.id).length<3?' disabled':'')+'><span>'+m.icon+'</span><b>'+E(m.title)+'</b><small>'+E(m.desc)+'</small></button>').join('')+'</div>';
 s+='<p class="aeth-exp-summary">'+count+' game discoveries recorded in your Journal.'+(p.length<3?' This section has fewer than 3 available review questions. Its lessons remain visible above; more verified practice is needed to unlock additional games.':'')+'</p>';
 if(deep&&deep.course===id)s+=deepMarkup();
 if(vocabRun&&id==='D669'&&selectedSection===2)s+=vocabMarkup();
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
 const b=e.target?.closest?.('#aethCourseGames [data-vocab-choice][draggable="true"]');
 if(b&&!vocabRun?.feedback)e.dataTransfer?.setData?.('application/x-vocabulary-category',b.dataset.vocabChoice);
});
document.addEventListener('dragover',e=>{
 if(e.target?.closest?.('#aethCourseGames [data-vocab-drop]'))e.preventDefault();
});
document.addEventListener('drop',e=>{
 if(!e.target?.closest?.('#aethCourseGames [data-vocab-drop]'))return;
 e.preventDefault();const label=e.dataTransfer?.getData?.('application/x-vocabulary-category');
 if(label)vocabChoose(label);
});
document.addEventListener('dragstart',e=>{
 const tile=e.target?.closest?.('#aethCourseGames button[draggable="true"][data-deep-tile]');
 if(!tile||!deep||deep.feedback||deep.completed)return;
 e.dataTransfer?.setData?.('application/x-aetheria-tile',String(tile.dataset.deepTile));
 if(e.dataTransfer)e.dataTransfer.effectAllowed='move';
});
document.addEventListener('dragover',e=>{
 if(e.target?.closest?.('#aethCourseGames [data-deep-drop]'))e.preventDefault();
});
document.addEventListener('drop',e=>{
 if(!e.target?.closest?.('#aethCourseGames [data-deep-drop]'))return;
 e.preventDefault();
 const tile=e.dataTransfer?.getData?.('application/x-aetheria-tile')||'';
 if(/^\d{1,2}$/.test(tile))deepTile(Number(tile));
});
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
 if(btn.hasAttribute('data-vocab-start')){vocabStart();return}
 if(btn.hasAttribute('data-vocab-choice')){vocabChoose(btn.dataset.vocabChoice);return}
 if(btn.hasAttribute('data-vocab-retry')){vocabRetry();return}
 if(btn.hasAttribute('data-vocab-next')){vocabNext();return}
 if(btn.hasAttribute('data-deep-mode')){deepStart(btn.dataset.deepMode);return}
 if(btn.hasAttribute('data-deep-tile')){deepTile(Number(btn.dataset.deepTile));return}
 if(btn.hasAttribute('data-deep-undo')){deepUndo();return}
 if(btn.hasAttribute('data-deep-check')){deepCheck();return}
 if(btn.hasAttribute('data-deep-retry')){deepRetry();return}
 if(btn.hasAttribute('data-deep-next')){deepNext();return}
 if(btn.hasAttribute('data-exp-section')){const n=Number(btn.dataset.expSection);if(course()==='D669'&&[1,2,3].includes(n)){selectedSection=n;session=null;deep=null;vocabRun=null;redraw()}return}
 if(btn.hasAttribute('data-exp-mode')){start(btn.dataset.expMode);return}
 if(btn.hasAttribute('data-exp-answer')){answer(Number(btn.dataset.expAnswer));return}
 if(btn.hasAttribute('data-exp-retry')){retryGuided();return}
 if(btn.hasAttribute('data-exp-next')){next();return}
 if(btn.hasAttribute('data-exp-decor')){
  const choice=decor.find(d=>d.id===btn.dataset.expDecor);if(!choice||xp()<choice.xp)return;
  journal.decor=choice.id;save();document.documentElement.dataset.aetheriaDecor=choice.id;redraw();
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
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect')){session=null;deep=null;vocabRun=null;schedule()}});
window.addEventListener('pageshow',schedule);
window.MajickLearningExperiences=Object.freeze({VERSION,refresh:schedule,courseGames:activity,deepPool,sectionRows,sectionQuestions,vocabQuestions,memories:()=>journal.memories.slice(),decorations:()=>decor.slice()});
schedule();
})();