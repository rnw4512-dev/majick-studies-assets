/* Aetheria Adventures — Guardian expeditions / course rune games / story chapters.
   Extends the existing Sanctuary, Game Realm and Study Hall. No new room, XP
   ledger, question bank, Guardian system, or independent mastery records.
*/
(()=>{'use strict';
if(window.MajickAetheriaAdventures)return;
const KEY='aetheria-adventure-journal-v1',VERSION='1.1.0';
const CHAPTER_GATES=[600,1000,1600];
const GATES={guardian:0,game:200,story:600};
let journal={};try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');if(x&&typeof x==='object'&&!Array.isArray(x))journal=x}catch(_){}
let running=null,queued=false,selectedChapter=1;
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
  D669:{title:'The Whispering Library',scenes:['The spoken sounds have vanished from the enchanted books. Identify the clue to restore the first page.','A young apprentice needs the right teaching decision before the sound bridge will appear.','The last book opens only when you apply the lesson to a new classroom challenge.']},
  D772:{title:'The Observatory of Uncertain Stars',scenes:['A star chart contains a misleading claim. Use your statistical reasoning to find the evidence.','The astronomer must distinguish reliable data from an enticing guess.','Complete the final evidence check to restore the celestial map.']},
  D756:{title:'The Council of Four Voices',scenes:['The council awaits a thoughtful student-support decision.','A new stakeholder concern changes the conversation.','Use the evidence to guide the council toward its next step.']},
  D755:{title:'The Hall of Hidden Evidence',scenes:['An assessment scroll presents conflicting clues.','The academy needs a careful interpretation of the evidence.','Decide how the findings should guide support.']}
 };
 return custom[id]||{title:name+' — The Unfinished Grimoire',scenes:['The first page needs a concept from your current lesson.','A scholar has misunderstood a key idea; find the stronger explanation.','Resolve the final course challenge to restore this chapter.']};
}
const entry=(id=course())=>journal[id]||(journal[id]={clears:{},chapters:{},guardianTrails:{}});
function unlockedChapter(){return CHAPTER_GATES.filter(n=>xp()>=n).length||1}
function chapterComplete(id,n){return !!entry(id).chapters['chapter-'+n]}
function chooseQuestions(id,m,chapter){const all=questions(id);if(m==='guardian')return all.slice(0,1);if(m==='story'){const start=(chapter-1)*3;return all.length>=3?Array.from({length:3},(_,i)=>all[(start+i)%all.length]):[]}return all.slice(0,3)}
function record(kind,key,id){
 const row=entry(id),group=kind==='guardian'?row.guardianTrails:kind==='game'?row.clears:row.chapters;
 if(group[key])return false;
 const reward=window.MajickRewardCore?.award?.('adventure-fragment-earned',{key:'aetheria:adventure:'+kind+':'+id+':'+key,course:id,source:'aetheria-adventure'});
 if(!reward||reward.rejected)return false;
 group[key]={at:Date.now(),fragmentGranted:Number(reward.eggFragments||0)>0};save();
 if(reward.eggFragments)try{window.MajickFragmentEarnings?.refresh?.()}catch(_){}
 return true;
}
function guardian(){
 try{const snap=window.MajickGuardianCare?.snapshot?.();return snap?.roster?.find(p=>p.petId===snap.focusPetId)||snap?.roster?.[0]||null}catch(_){return null}
}
function mode(){const room=screen();return room==='companions'?'guardian':room==='games'?'game':room==='mission'?'story':null}
function started(m,id){return running&&running.mode===m&&running.course===id}
function begin(m){
 const id=course(),chapter=m==='story'?selectedChapter:1,q=chooseQuestions(id,m,chapter),g=guardian();
 if(xp()<(m==='story'?CHAPTER_GATES[chapter-1]:GATES[m])||q.length<(m==='guardian'?1:3)||m==='guardian'&&!g)return;
 running={mode:m,course:id,chapter,questions:q,index:0,score:0,choice:null,locked:false,ended:false,trail:'moon',guardianId:g?.petId||'',guardianName:g?.name||'',firstTryCorrect:0};
 redraw();
}
function answer(i){
 if(!running||running.ended||running.locked)return;
 const q=running.questions[running.index];if(!q||i<0||i>=q.options.length)return;
 running.choice=i;running.locked=true;
 if(i===q.correct){running.score++;running.firstTryCorrect++}
 redraw();
}
function advance(){
 if(!running||!running.locked)return;
 running.index++;
 running.locked=false;running.choice=null;
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
function view(){
 const m=mode(),id=course();if(!m||!id)return '';
 const level=xp(),gate=GATES[m],unlocked=level>=gate,q=questions(id),g=guardian();
 if(m==='story'&&selectedChapter>unlockedChapter())selectedChapter=unlockedChapter();
 const row=entry(id),completed=m==='guardian'?Object.keys(row.guardianTrails).length:m==='game'?Object.keys(row.clears).length:Object.keys(row.chapters).length;
 let h='<section id="aethAdventure" class="aeth-adventure" aria-label="Course-linked adventure" data-aeth-mode="'+m+'"><div class="aeth-adventure-head"><span class="aeth-glyph" aria-hidden="true">'+(m==='guardian'?'🐾':m==='game'?'✧':'📜')+'</span><div><small>MOONLIT COLLEGIUM • '+E(id)+' · SCHOLAR XP '+level.toLocaleString()+'</small><h2>'+E(headline(m))+'</h2><p>'+E(description(m))+'</p></div><span class="aeth-done">'+completed+' discovered</span></div>';
 if(!unlocked)h+='<div class="aeth-adventure-message"><b>Locked until '+gate+' lifetime Scholar XP</b><p>Earn '+(gate-level)+' more XP through your existing studies. Unlocking never spends your XP.</p></div>';
 else if(m==='guardian'&&!g)h+='<div class="aeth-adventure-message"><b>Meet your Guardian first</b><p>Hatch a Guardian in the existing Sanctuary to begin an expedition. No creature or egg will be created automatically.</p></div>';
 else if(q.length<(m==='guardian'?1:3))h+='<div class="aeth-adventure-message"><b>More course questions needed</b><p>Add supported course lessons or a question bank. This adventure will use those questions rather than invented curriculum content.</p></div>';
 else if(!started(m,id))h+='<div class="aeth-adventure-message"><b>'+(m==='guardian'?'Your companion: '+E(g.name):m==='story'?'Chapter '+selectedChapter+': '+['The Lost Page','The Apprentice’s Dilemma','The Final Seal'][selectedChapter-1]:'Three answer runes await')+'</b><p>Earn an Egg Fragment on a first perfect clear. This is game practice, not verified independent mastery, and grants no extra XP.</p>'+button('start','Begin adventure')+'</div>';
 else{
 const a=running;
 if(a.ended){
  h+='<div class="aeth-adventure-message" role="status"><b>'+(a.score===a.questions.length?'✦ Quest completed!':'The chapter needs another attempt')+'</b><p>'+a.score+' / '+a.questions.length+' correct. '+(a.firstClear?'First clear recorded; Egg Fragment added through the existing reward ledger.':a.score===a.questions.length?'Already explored; repeated clears do not grant duplicate fragments.':'Review the feedback and try again.')+'</p>'+button('restart','Play again')+(m==='story'&&a.score===a.questions.length&&a.chapter<3?button('chapter:'+String(a.chapter+1),'Next chapter',level<CHAPTER_GATES[a.chapter]):'')+'</div>';
 }else{
  const item=a.questions[a.index],story=courseStory(id);
  const intro=m==='guardian'?E(a.guardianName)+' explores the '+(a.trail==='moon'?'Moonlit':'Mosswood')+' trail. A glowing clue stands in your path.':m==='story'?story.scenes[a.index]:'Aim for the correct rune to light the lantern.';
  h+='<div class="aeth-adventure-play"><div class="aeth-adventure-meta"><b>'+E(intro)+'</b><span>Challenge '+(a.index+1)+' / '+a.questions.length+'</span></div>';
  if(m==='guardian'&&a.index===0&&!a.locked)h+='<div class="aeth-trails" aria-label="Choose a Guardian trail">'+button('trail:moon','☾ Moonlit trail')+button('trail:moss','❧ Mosswood trail')+'</div>';
  h+='<h3>'+E(item.prompt)+'</h3><div class="aeth-runes" role="group" aria-label="Choose a rune answer">'+item.options.map((option,i)=>'<button type="button" data-aeth-answer="'+i+'"'+(a.locked?' disabled':'')+' class="'+(a.choice===i?(i===item.correct?'right':'wrong'):'')+'"><span aria-hidden="true">✧</span>'+E(option)+'</button>').join('')+'</div>';
  if(a.locked)h+='<div class="aeth-result" role="status"><b>'+(a.choice===item.correct?'Correct rune!':'That rune needs repair.')+'</b><p>'+E(item.explanation||'Review the course lesson, then try the next challenge.')+'</p>'+(item.source?'<a href="'+E(item.source)+'" target="_blank" rel="noopener noreferrer">Review the source lesson</a>':'<small>Existing course question bank practice</small>')+button('next',a.index+1===a.questions.length?'Complete quest':'Next challenge')+'</div>';
  h+='</div>';
 }
 }
 return h+'<p class="aeth-adventure-foot">XP unlocks activities; fragments come from the existing Guardian ledger. Guided game results do not change course mastery, OA readiness, or XP.</p></section>';
}
function redraw(){
 const el=document.getElementById('aethAdventure');
 if(el){const wrap=document.createElement('div');wrap.innerHTML=view();const next=wrap.firstElementChild;if(next){next.dataset.course=course();el.replaceWith(next)}}else sync();
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
document.addEventListener('click',e=>{
 const el=e.target.closest('#aethAdventure');if(!el)return;
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-aeth-answer')){answer(Number(b.dataset.aethAnswer));return}
 const act=b.dataset.aethAction||'';
 if(act==='start'||act==='restart'){begin(mode());return}
 if(act==='next'){advance();return}
 if(act.startsWith('chapter:')){const n=Number(act.split(':')[1]);if(Number.isInteger(n)&&n>=1&&n<=3&&xp()>=CHAPTER_GATES[n-1]){selectedChapter=n;running=null;redraw()}return}
 if(act.startsWith('trail:')&&running&&!running.locked){running.trail=act.split(':')[1]==='moss'?'moss':'moon';redraw()}
});
function schedule(){if(queued)return;queued=true;setTimeout(()=>{queued=false;sync()},60)}
if(window.MajickRenderQueue?.register)window.MajickRenderQueue.register('aetheria-adventures',schedule,101);
document.addEventListener('DOMContentLoaded',schedule);
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect')){running=null;schedule()}});
window.addEventListener('pageshow',schedule);
window.MajickAetheriaAdventures=Object.freeze({VERSION,refresh:schedule,unlocks:GATES,questions,courseStory,progress:(id)=>({...entry(String(id||course()).toUpperCase())})});
schedule();
})();