/* Aetheria Adventures — Guardian expeditions / course rune games / story chapters.
   Extends the existing Sanctuary, Game Realm and Study Hall. No new room, XP
   ledger, question bank, Guardian system, or independent mastery records.
*/
(()=>{'use strict';
if(window.MajickAetheriaAdventures)return;
const KEY='aetheria-adventure-journal-v1',VERSION='1.4.0';
const CHAPTER_GATES=[600,1000,1600];
const GATES={guardian:0,game:200,story:600};
let journal={};try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))journal=x}catch(_){}
let running=null,queued=false,selectedChapter=1,gameRotation={};
const E=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const course=()=>String(window.S?.activeCourse||'').toUpperCase();
const screen=()=>String(window.S?.screen||'').toLowerCase();
const xp=()=>Math.max(0,Number(window.MajickScholarProgression?.current?.()?.xp??window.MajickStateCore?.ensureAccount?.()?.xpHighWater??window.S?.majickAccount?.xpHighWater??0));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(journal))}catch(_){}};
function questions(id){
 const packs=Object.values(window.MajickCourseActivityPlayer?.packs||{}).filter(p=>String(p.courseId||'').toUpperCase()===id);
 const source=packs.flatMap(p=>(p.activities||[]).filter(a=>a._sourceVerified&&Array.isArray(a.options)&&a.options.length>=2&&Number.isInteger(a.correct)&&a.correct>=0&&a.correct<a.options.length).map(a=>({id:p.id+'|'+a.id,prompt:a.prompt,options:a.options,correct:a.correct,explanation:a.explanation,source:a.provenance?.source_url||'',title:p.title})));
 if(source.length)return source;
 const bank=window.S?.courses?.[id]?.questionBank||[];
 return bank.filter(q=>Array.isArray(q.options)&&q.options.length>=2).map((q,i)=>{
  const correct=Number.isInteger(q.answer)?q.answer:q.options.findIndex(o=>String(o)===String(q.answer));
  return {id:'bank|'+String(q.id||q.qid||i),prompt:q.prompt||q.question||q.stem,options:q.options,correct,explanation:q.why||q.explanation||'Review the lesson before trying another challenge.',source:'',title:window.S?.courses?.[id]?.title||id}
 }).filter(q=>q.prompt&&q.correct>=0&&q.correct<q.options.length);
}
function courseStory(id){
 const name=window.S?.courses?.[id]?.title||id;
 const custom={
  D669:{title:'The Whispering Library',scenes:['The spoken sounds have vanished from the enchanted books. Identify the clue to restore the first page.','A young apprentice needs the right teaching decision before the sound bridge will appear.','The first book opens when you apply a literacy concept to a classroom challenge.','The newly restored shelves whisper a warning about confusing sounds and print.','A novice librarian has mixed up two teaching routines. Choose the best explanation.','Restore the phoneme lantern with a stronger instructional decision.','The final wing of the library opens to a classroom mystery.','One difficult teaching choice determines which path the apprentice should take.','Complete the evidence-based literacy trial and seal the Whispering Library.']},
  D772:{title:'The Observatory of Uncertain Stars',scenes:['A star chart contains a misleading claim. Use your statistical reasoning to find the evidence.','The astronomer must distinguish reliable data from an enticing guess.','Complete the first evidence check to restore part of the celestial map.','A new orbit chart contains a suspicious sampling decision.','Two apprentices disagree about probability; test the reasoning before believing either one.','The telescope begins to stabilize as you repair the next data claim.','An ancient observatory map shows competing explanations of the same results.','Identify the strongest evidence while the stars align.','Restore the final coordinate by applying what the course taught you.']},
  D756:{title:'The Council of Four Voices',scenes:['The council awaits a thoughtful student-support decision.','A new stakeholder concern changes the conversation.','Use the evidence to guide the council toward its next step.','A new voice in the council challenges the proposed supports.','Use the details in the case to separate accommodations from modifications.','The council asks you to clarify the next collaborative action.','A difficult transition concern arises just before the meeting closes.','Weigh the evidence and the student’s goals before choosing a response.','Complete the final case-based decision and close the council chapter.']},
  D755:{title:'The Hall of Hidden Evidence',scenes:['An assessment scroll presents conflicting clues.','The academy needs a careful interpretation of the evidence.','Decide how the findings should guide support.','The assessment archive reveals a second set of contradictory measurements.','Determine which additional evidence is needed before making a judgment.','An instructor asks for the most appropriate interpretation.','A sealed assessment report contains a final difficult decision.','Compare the findings and their limitations before recommending next steps.','Complete the final evidence review and restore the Hall.']}
 };
 return custom[id]||{title:name+' — The Unfinished Grimoire',scenes:['The first page needs a concept from your current lesson.','A scholar has misunderstood a key idea; find the stronger explanation.','Resolve the first course challenge to restore the chapter.','The second volume opens to a new problem.','Search the existing lesson evidence for a reliable explanation.','Apply a fresh concept to lift the ward.','A final grimoire appears, waiting for careful reasoning.','Compare competing answers using what you learned.','Complete the final chapter and leave your own mark in the archives.']};
}
const entry=(id=course())=>journal[id]||(journal[id]={clears:{},chapters:{},guardianTrails:{}});
function unlockedChapter(){return CHAPTER_GATES.filter(n=>xp()>=n).length||1}
function chapterComplete(id,n){return !!entry(id).chapters['chapter-'+n]}
function chooseQuestions(id,m,chapter){const all=questions(id);if(m==='guardian')return all.slice(0,1);if(m==='story'){const start=(chapter-1)*3;return all.length>=3?Array.from({length:3},(_,i)=>all[(start+i)%all.length]):[]}const offset=(gameRotation[id]||0)%Math.max(1,all.length);gameRotation[id]=(gameRotation[id]||0)+3;return all.length>=3?Array.from({length:3},(_,i)=>all[(offset+i)%all.length]):[]}
function record(kind,key,id){
 const row=entry(id),group=kind==='guardian'?row.guardianTrails:kind==='game'?row.clears:row.chapters;
 if(group[key])return false;
 const reward=window.MajickRewardCore?.award?.('adventure-fragment-earned',{key:'aetheria:adventure:'+kind+':'+id+':'+key,course:id,source:'aetheria-adventure'});
 if(!reward||reward.rejected)return false;
 group[key]={at:Date.now(),fragmentGranted:Number(reward.eggFragments||0)>0};save();
 if(reward.eggFragments)try{window.MajickFragmentEarnings?.refresh?.()}catch(_){}
 try{document.dispatchEvent(new CustomEvent('majick:adventure-first-clear',{detail:{kind,key,course:id,guardian:running?.guardianName||''}}))}catch(_){}
 return true;
}
function guardian(){
 try{const snap=window.MajickGuardianCare?.snapshot?.();return snap?.roster?.find(p=>p.petId===snap.focusPetId)||snap?.roster?.[0]||null}catch(_){return null}
}
function portraitFor(g){
 if(!g)return {url:'',symbol:'🐾',hue:0};
 const pet=(window.S?.legacy?.pets||[]).find(p=>p?.id===g.petId);
 let meta=null;try{meta=pet?window.MajickGuardianCore?.meta?.(pet):null}catch(_){}
 const type=meta?.type||g.type||g.sourceType||'';
 const level=Number(meta?.level||pet?.level||1);
 let raw='';try{raw=String(meta?.image||window.MajickGuardianRegistry?.stageImage?.(type,level)||'').trim()}catch(_){}
 const safe=/^(?:https:\/\/[^\s"'<>]+|(?:\.\/)?assets\/[^\s"'<>]+)$/.test(raw)?raw:'';
 const hue=Number(meta?.hue??g.hue??0);
 return {url:safe,symbol:String(meta?.icon||g.icon||'🐾'),hue:Number.isFinite(hue)?Math.max(-180,Math.min(180,hue)):0};
}
function mode(){const room=screen();return room==='companions'?'guardian':room==='games'?'game':room==='mission'?'story':null}
function started(m,id){return running&&running.mode===m&&running.course===id}
function begin(m){
 const id=course(),chapter=m==='story'?selectedChapter:1,q=chooseQuestions(id,m,chapter),g=guardian();
 if(xp()<(m==='story'?CHAPTER_GATES[chapter-1]:GATES[m])||q.length<(m==='guardian'?1:3)||m==='guardian'&&!g)return;
 running={mode:m,course:id,chapter,questions:q,index:0,score:0,choice:null,locked:false,ended:false,trail:'moon',guardianId:g?.petId||'',guardianName:g?.name||'',guardianType:g?.species||g?.type||g?.name||'',firstTryCorrect:0,position:{x:0,y:1},portrait:portraitFor(g),lastMove:'idle',explorationEvent:'idle',clues:[],steps:0,explorationMessage:'',storyChoices:[],aiming:false,shot:null};
 redraw();
}
function answer(i){
 if(!running||running.ended||running.locked)return;
 if(running.mode==='guardian'&&(!atLandmark(running)||!allClues(running)))return;
 if(running.mode==='story'&&!running.storyChoices[running.index])return;
 if(running.mode==='game'&&running.aiming)return;
 const q=running.questions[running.index];if(!q||i<0||i>=q.options.length)return;
 running.choice=i;running.locked=true;running.shot=i===q.correct?'hit':'miss';
 if(i===q.correct){running.score++;running.firstTryCorrect++}
 redraw();
}
function advance(){
 if(!running||!running.locked)return;
 running.index++;
 running.locked=false;running.choice=null;running.shot=null;running.aiming=false;
 if(running.mode==='guardian')running.position={x:0,y:1};
 if(running.index>=running.questions.length)finish();
 redraw();
}
function finish(){
 if(!running||running.ended)return;
 running.ended=true;
 const m=running.mode,id=running.course;
 const perfect=running.score===running.questions.length;
 if(!perfect)return;
 let first=false;
 if(m==='guardian'){
  first=record('guardian',String(running.guardianId)+':'+running.trail,id);
  if(first)try{window.MajickGuardianCare?.performAction?.(running.guardianId,'play')}catch(_){}
 }else if(m==='game')first=record('game','rune-lantern',id);
 else first=record('story','chapter-'+running.chapter,id);
 running.firstClear=first;
}

const LANDMARK={x:4,y:1};
const TRAILS={
 moon:{obstacles:[[2,1],[3,0]],clues:[[1,0],[3,2]],names:['Silverleaf Sigil','Moonstone Rubbing']},
 moss:{obstacles:[[1,1],[2,0]],clues:[[0,2],[3,1]],names:['Mossbound Rune','Forest Echo']}
};
const tileId=(x,y)=>x+','+y;
function trailMap(a){return TRAILS[a?.trail]||TRAILS.moon}
function atLandmark(a){return !!a&&a.position?.x===LANDMARK.x&&a.position?.y===LANDMARK.y}
function allClues(a){const clues=trailMap(a).clues;return !!a&&clues.every(([x,y])=>a.clues?.includes(tileId(x,y)))}
function guardianReaction(a,event){
 const type=String(a.guardianType||a.guardianName||'').toLowerCase(),name=a.guardianName||'Your Guardian';
 const personality=/fox|solstice|kitsune|vesper/.test(type)?'flicks their tails with a knowing flourish':/dragon|cascade|water/.test(type)?'sends a cool shimmer across the path':/cat|velora/.test(type)?'perks up their ears and watches with bright eyes':/raven|rook/.test(type)?'tilts their head, considering the clue':/axolotl|prism/.test(type)?'wiggles with excitement':'glows with quiet curiosity';
 if(event==='obstacle')return name+' '+personality+'. The ancient stone blocks that tile; try another route.';
 if(event==='clue')return name+' '+personality+'. You recovered a collectible clue!';
 if(event==='gate')return name+' '+personality+'. The final ward stays sealed until both clues are collected.';
 if(event==='ready')return name+' '+personality+'. Both clues activate the gate. Your course challenge is ready.';
 return name+' '+personality+'. The trail is unfolding.';
}
function moveGuardian(direction){
 const a=running;if(!a||a.mode!=='guardian'||a.ended||a.locked)return false;
 const delta={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[direction];if(!delta)return false;
 const x=Math.max(0,Math.min(4,a.position.x+delta[0])),y=Math.max(0,Math.min(2,a.position.y+delta[1]));
 if(x===a.position.x&&y===a.position.y)return false;
 const trail=trailMap(a);
 if(trail.obstacles.some(([ox,oy])=>x===ox&&y===oy)){a.explorationEvent='obstacle';a.explorationMessage=guardianReaction(a,'obstacle');redraw(direction);return false}
 a.position={x,y};a.steps++;a.lastMove=direction;a.explorationEvent='step';
 const clue=trail.clues.find(([cx,cy])=>cx===x&&cy===y);
 if(clue&&!a.clues.includes(tileId(x,y))){a.clues.push(tileId(x,y));a.explorationEvent='clue';a.explorationMessage=guardianReaction(a,'clue')}
 else if(atLandmark(a)){a.explorationEvent=allClues(a)?'ready':'gate';a.explorationMessage=guardianReaction(a,allClues(a)?'ready':'gate')}
 else a.explorationMessage=guardianReaction(a,'move');
 redraw(direction);return true;
}
function chooseStoryRoute(route){
 const a=running;if(!a||a.mode!=='story'||a.ended||a.locked||a.storyChoices[a.index])return;
 if(route!=='evidence'&&route!=='companion')return;
 a.storyChoices[a.index]=route;redraw();
}
function branchingScene(a){
 const prior=a.storyChoices[a.index-1];
 if(!prior)return '';
 const title=window.S?.courses?.[a.course]?.title||a.course;
 return prior==='evidence'
  ?'You followed the evidence into a newly uncovered archive. A clue from '+title+' guides the next decision.'
  :'You consulted the academy companion, who uncovered a different route through '+title+'. A new clue awaits.';
}
function guardianPicture(a){
 const p=a.portrait||{},event=E(a.explorationEvent||'idle');
 const fallback='<span class="aeth-guardian-fallback" aria-hidden="true">'+E(p.symbol||'🐾')+'</span>';
 return '<span class="aeth-guardian-picture" data-reaction="'+event+'" data-facing="'+(a.lastMove==='left'?'left':'right')+'" aria-hidden="true">'+(p.url?'<img class="aeth-guardian-image" src="'+E(p.url)+'" alt="" decoding="async" style="filter:hue-rotate('+Number(p.hue||0)+'deg)">':fallback)+'</span>';
}
function movementScene(a){
 const p=a.position||{x:0,y:1},trail=trailMap(a),found=a.clues.length;
 const tiles=Array.from({length:15},(_,i)=>{
  const x=i%5,y=Math.floor(i/5),here=x===p.x&&y===p.y,goal=x===4&&y===1;
  const obstacle=trail.obstacles.some(([ox,oy])=>ox===x&&oy===y);
  const clue=trail.clues.some(([cx,cy])=>cx===x&&cy===y),collected=a.clues.includes(tileId(x,y));
  return '<span class="aeth-map-tile'+(here?' current':'')+(goal?' destination':'')+(obstacle?' blocked':'')+(clue?' clue':'')+(collected?' collected':'')+'" aria-hidden="true">'+(here?guardianPicture(a):obstacle?'▦':goal?'✧':clue?(collected?'✓':'◆'):'')+'</span>';
 }).join('');
 const instruction=atLandmark(a)&&allClues(a)?'✦ Both clues are collected and the gate is open. Solve the course challenge.':atLandmark(a)?'The final gate is sealed. Find both clues before solving the challenge.':'Explore around the blocked stones (▦), collect both glowing clues (◆), then reach the gate (✧).';
 return '<div class="aeth-expedition-map" role="img" aria-label="'+E(a.guardianName)+' at column '+(p.x+1)+' row '+(p.y+1)+' of five columns and three rows. '+found+' of 2 clues collected. Stone tiles block movement. Destination at column five row two.">'+tiles+'</div>'+
 '<div class="aeth-clue-progress" aria-label="Collected expedition clues">'+trail.clues.map(([x,y],i)=>'<span class="'+(a.clues.includes(tileId(x,y))?'found':'')+'">'+(a.clues.includes(tileId(x,y))?'✦':'◇')+' '+E(trail.names[i])+'</span>').join('')+'</div>'+
 '<div class="aeth-movement"><div class="aeth-movement-copy"><p>'+E(instruction)+'</p><p class="aeth-guardian-reaction" role="status" aria-live="polite">'+E(a.explorationMessage||guardianReaction(a,'move'))+'</p></div>'+
 '<div class="aeth-direction-controls" role="group" aria-label="Move Guardian">'+
 '<button type="button" data-aeth-move="left" aria-label="Move left">←</button>'+
 '<button type="button" data-aeth-move="up" aria-label="Move up">↑</button>'+
 '<button type="button" data-aeth-move="down" aria-label="Move down">↓</button>'+
 '<button type="button" data-aeth-move="right" aria-label="Move right">→</button></div></div>';
}

function headline(m){
 if(m==='guardian')return 'Guardian Moonpath Expedition';
 if(m==='game')return 'Rune Lantern Challenge';
 return courseStory(course()).title;
}
function description(m){
 if(m==='guardian')return 'Take a Guardian on a short course-linked expedition. First successful trail discovery earns a bond play and a fragment.';
 if(m==='game')return 'Aim at the correct glowing rune. Three consecutive course-based challenges light the lanterns.';
 return 'Advance through three illustrated chapters using your current course knowledge. Each chapter reveals more of the Collegium.';
}
function button(action,text,disabled=false){return '<button type="button" data-aeth-action="'+E(action)+'"'+(disabled?' disabled':'')+'>'+E(text)+'</button>'}

function scene(m,chapter,trail,lit){
 const variant=m==='guardian'?(trail==='moss'?'moss':'moon'):m==='game'?'runes':'library';
 const name=m==='guardian'?(trail==='moss'?'Mosswood Trail':'Moonpath Trail'):m==='game'?'Lantern Array':'Enchanted Library';
 let markup='<div class="aeth-scene" data-scene="'+variant+'" role="img" aria-label="'+E(name)+' illustrated using atmospheric decorative shapes">';
 markup+='<div class="aeth-scene-glow"></div><div class="aeth-scene-arch" aria-hidden="true"></div><div class="aeth-scene-ground"></div><div class="aeth-scene-symbol" aria-hidden="true">'+(m==='guardian'?'♧':m==='game'?'✧':'✦')+'</div>';
 if(m==='game')markup+='<div class="aeth-scene-lanterns" aria-label="'+lit+' of 3 lanterns lit">'+[0,1,2].map(i=>'<span class="'+(i<lit?'lit':'')+'">✧</span>').join('')+'</div>';
 if(m==='story')markup+='<div class="aeth-scene-pages" aria-label="Story chapter progress">'+[1,2,3].map(i=>'<span class="'+(i<chapter?'lit':i===chapter?'active':'')+'">✦</span>').join('')+'</div>';
 return markup+'<span class="aeth-scene-caption">'+E(name)+'</span></div>';
}
function storySelector(id){
 const completed=entry(id).chapters;
 return '<nav class="aeth-chapter-nav" aria-label="Story chapters">'+CHAPTER_GATES.map((threshold,i)=>{
  const n=i+1,locked=xp()<threshold,done=!!completed['chapter-'+n];
  return '<button type="button" data-aeth-action="chapter:'+n+'" aria-current="'+(selectedChapter===n?'step':'false')+'"'+(locked?' disabled':'')+' class="'+(selectedChapter===n?'selected ':'')+(done?'complete':'')+'"><span>Chapter '+n+'</span><small>'+(done?'✦ Completed':locked?'Unlock '+threshold+' XP':'Ready')+'</small></button>';
 }).join('')+'</nav>';
}
function view(){
 const m=mode(),id=course();if(!m||!id)return '';
 const level=xp(),gate=GATES[m],unlocked=level>=gate,q=questions(id),g=guardian();
 if(m==='story'&&selectedChapter>unlockedChapter())selectedChapter=unlockedChapter();
 const row=entry(id),completed=m==='guardian'?Object.keys(row.guardianTrails).length:m==='game'?Object.keys(row.clears).length:Object.keys(row.chapters).length;
 let h='<section id="aethAdventure" class="aeth-adventure" aria-label="Course-linked adventure" data-aeth-mode="'+m+'"><div class="aeth-adventure-head"><span class="aeth-glyph" aria-hidden="true">'+(m==='guardian'?'🐾':m==='game'?'✧':'📜')+'</span><div><small>MOONLIT COLLEGIUM • '+E(id)+' · SCHOLAR XP '+level.toLocaleString()+'</small><h2>'+E(headline(m))+'</h2><p>'+E(description(m))+'</p></div><span class="aeth-done">'+completed+' discovered</span></div>';
 if(m==='story'&&unlocked)h+=storySelector(id);
 if(!unlocked)h+='<div class="aeth-adventure-message"><b>Locked until '+gate+' lifetime Scholar XP</b><p>Earn '+(gate-level)+' more XP through your existing studies. Unlocking never spends your XP.</p></div>';
 else if(m==='guardian'&&!g)h+='<div class="aeth-adventure-message"><b>Meet your Guardian first</b><p>Hatch a Guardian in the existing Sanctuary to begin an expedition. No creature or egg will be created automatically.</p></div>';
 else if(q.length<(m==='guardian'?1:3))h+='<div class="aeth-adventure-message"><b>More course questions needed</b><p>Add supported course lessons or a question bank. This adventure will use those questions rather than invented curriculum content.</p></div>';
 else if(!started(m,id))h+='<div class="aeth-adventure-message"><b>'+(m==='guardian'?'Your companion: '+E(g.name):m==='story'?'Chapter '+selectedChapter+': '+['The Lost Page','The Apprentice’s Dilemma','The Final Seal'][selectedChapter-1]:'Three answer runes await')+'</b><p>Earn an Egg Fragment on a first perfect clear. This is game practice, not verified independent mastery, and grants no extra XP.</p>'+button('start','Begin adventure')+'</div>';
 else{
 const a=running;
 if(a.ended){
  h+=scene(m,a.chapter,a.trail,a.score);
  h+='<div class="aeth-adventure-message" role="status"><b>'+(a.score===a.questions.length?'✦ Quest completed!':'The chapter needs another attempt')+'</b><p>'+a.score+' / '+a.questions.length+' correct. '+(a.firstClear?'First clear recorded; Egg Fragment added through the existing reward ledger.':a.score===a.questions.length?'Already explored; repeated clears do not grant duplicate fragments.':'Review the feedback and try again.')+'</p>'+button('restart','Play again')+(m==='story'&&a.score===a.questions.length&&a.chapter<3?button('chapter:'+String(a.chapter+1),'Next chapter',level<CHAPTER_GATES[a.chapter]):'')+'</div>';
 }else{
  const item=a.questions[a.index],story=courseStory(id);
  const intro=m==='guardian'?E(a.guardianName)+' explores the '+(a.trail==='moon'?'Moonlit':'Mosswood')+' trail. A glowing clue stands in your path.':m==='story'?story.scenes[(a.chapter-1)*3+a.index]+' '+branchingScene(a):'Aim at the answer rune to light the lantern. Each target is a course question.';
  h+=scene(m,a.chapter,a.trail,a.score);
  h+='<div class="aeth-adventure-play"><div class="aeth-adventure-meta"><b>'+E(intro)+'</b><span>Challenge '+(a.index+1)+' / '+a.questions.length+'</span></div>';
  if(m==='guardian'&&a.index===0&&!a.locked)h+='<div class="aeth-trails" aria-label="Choose a Guardian trail"><button type="button" data-aeth-action="trail:moon" aria-pressed="'+(a.trail==='moon')+'">☾ Moonlit trail</button><button type="button" data-aeth-action="trail:moss" aria-pressed="'+(a.trail==='moss')+'">❧ Mosswood trail</button></div>';
  if(m==='guardian')h+=movementScene(a);
  if(m==='story')h+='<div class="aeth-story-decision"><h4>How will you investigate this scene?</h4><div class="aeth-story-choices"><button type="button" data-aeth-route="evidence"'+(a.storyChoices[a.index]?' disabled':'')+' aria-pressed="'+(a.storyChoices[a.index]==='evidence')+'">🔎 Examine the evidence</button><button type="button" data-aeth-route="companion"'+(a.storyChoices[a.index]?' disabled':'')+' aria-pressed="'+(a.storyChoices[a.index]==='companion')+'">✦ Consult the companion</button></div><p>'+(a.storyChoices[a.index]==='evidence'?'You chose the evidence trail. The next scene will reveal an archive clue.':a.storyChoices[a.index]==='companion'?'You chose the companion trail. The next scene will reveal a different clue.':'Choose a route to reveal the next challenge. Your choice affects the story, not the correct academic answer.')+'</p></div>';
  h+='<div class="aeth-adventure-pips" aria-label="'+a.score+' runes collected">'+a.questions.map((_,i)=>'<span class="'+(i<a.index?'passed':i===a.index?'active':'')+'" aria-hidden="true">'+(i<a.index?'✦':'✧')+'</span>').join('')+'</div>';
  const openQuestion=m==='guardian'?(atLandmark(a)&&allClues(a)):m==='story'?!!a.storyChoices[a.index]:true;
  if(openQuestion)h+='<h3>'+E(item.prompt)+'</h3><div class="aeth-runes" role="group" aria-label="'+(m==='game'?'Aim at the answer targets':'Choose a rune answer')+'">'+item.options.map((option,i)=>'<button type="button" data-aeth-answer="'+i+'"'+(a.locked?' disabled':'')+' class="'+(m==='game'?'aeth-target ':'')+(a.choice===i?(i===item.correct?'right':'wrong'):'')+'"><span aria-hidden="true">'+(m==='game'?'◎':'✧')+'</span>'+E(option)+'</button>').join('')+'</div>';
  if(m==='game')h+='<p class="aeth-target-note" role="status">'+(a.locked?(a.shot==='hit'?'✦ Target hit! The lantern responds.':'The rune flickered. Read the feedback and aim again next challenge.'):'Tap or click a rune target, or use Tab and Enter to fire. The targeting pulse pauses for reduced motion.')+'</p>';
  if(a.locked)h+='<div class="aeth-result" role="status"><b>'+(a.choice===item.correct?'Correct rune!':'That rune needs repair.')+'</b><p>'+E(item.explanation||'Review the course lesson, then try the next challenge.')+'</p>'+(item.source?'<a href="'+E(item.source)+'" target="_blank" rel="noopener noreferrer">Review the source lesson</a>':'<small>Existing course question bank practice</small>')+button('next',a.index+1===a.questions.length?'Complete quest':'Next challenge')+'</div>';
  h+='</div>';
 }
 }
 return h+'<p class="aeth-adventure-foot">XP unlocks activities; fragments come from the existing Guardian ledger. Guided game results do not change course mastery, OA readiness, or XP.</p></section>';
}
function redraw(restoreFocus=false){
 const el=document.getElementById('aethAdventure');
 if(el){const wrap=document.createElement('div');wrap.innerHTML=view();const next=wrap.firstElementChild;if(next){next.dataset.course=course();el.replaceWith(next);if(restoreFocus){const target=next.querySelector('[data-aeth-move="'+restoreFocus+'"]');target?.focus?.({preventScroll:true})}}}else sync();
}
function sync(){
 const root=document.getElementById('content'),m=mode(),id=course();
 if(!root||!m||!id){document.getElementById('aethAdventure')?.remove();return}
 const exists=document.getElementById('aethAdventure');
 if(exists&&exists.dataset.aethMode===m&&exists.dataset.course===id)return;
 exists?.remove();
 const wrap=document.createElement('div');wrap.innerHTML=view();const el=wrap.firstElementChild;
 if(!el)return;el.dataset.course=id;
 const arch=root.querySelector(':scope > .majRoomArchitecture'),path=root.querySelector(':scope > #majConnectedPath');
 if(path)path.insertAdjacentElement('afterend',el);
 else if(arch)arch.insertAdjacentElement('afterend',el);
 else root.prepend(el);
}
document.addEventListener('error',e=>{
 const img=e.target;if(!img?.matches?.('#aethAdventure .aeth-guardian-image'))return;
 const holder=img.closest('.aeth-guardian-picture');
 if(holder){const span=document.createElement('span');span.className='aeth-guardian-fallback';span.setAttribute('aria-hidden','true');span.textContent=running?.portrait?.symbol||'🐾';holder.replaceChildren(span)}
},true);
document.addEventListener('click',e=>{
 const el=e.target.closest('#aethAdventure');if(!el)return;
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-aeth-move')){moveGuardian(b.dataset.aethMove);return}
 if(b.hasAttribute('data-aeth-route')){chooseStoryRoute(b.dataset.aethRoute);return}
 if(b.hasAttribute('data-aeth-answer')){answer(Number(b.dataset.aethAnswer));return}
 const act=b.dataset.aethAction||'';
 if(act==='start'||act==='restart'){begin(mode());return}
 if(act==='next'){advance();return}
 if(act.startsWith('chapter:')){const n=Number(act.split(':')[1]);if(Number.isInteger(n)&&n>=1&&n<=3&&xp()>=CHAPTER_GATES[n-1]){selectedChapter=n;running=null;redraw()}return}
 if(act.startsWith('trail:')&&running&&!running.locked&&running.mode==='guardian'){running.trail=act.split(':')[1]==='moss'?'moss':'moon';running.position={x:0,y:1};running.clues=[];running.steps=0;running.explorationMessage='Trail changed. Collect both clues before reaching the gate.';redraw()}
});
document.addEventListener('keydown',e=>{
 const panel=e.target?.closest?.('#aethAdventure');
 if(!panel||!running||running.mode!=='guardian'||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.target?.matches?.('input,textarea,select,[contenteditable="true"]'))return;
 const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];
 if(direction){e.preventDefault();moveGuardian(direction)}
});
function schedule(){if(queued)return;queued=true;setTimeout(()=>{queued=false;sync()},60)}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('aetheria-adventures',schedule,101);
document.addEventListener('DOMContentLoaded',schedule);
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect')){running=null;schedule()}});
window.addEventListener('pageshow',schedule);
window.MajickAetheriaAdventures=Object.freeze({VERSION,refresh:schedule,unlocks:GATES,questions,courseStory,progress:(id)=>({...entry(String(id||course()).toUpperCase())})});
schedule();
})();