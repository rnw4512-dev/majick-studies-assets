(()=>{'use strict';if(window.MajickInlineLessonPractice)return;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const states=new Map();
function model(lesson,index){
 const course=String(window.S?.activeCourse||''),all=window.MajickLearningLab?.vocab?.(course)||[];
 const terms=all.filter(v=>v?.term&&v?.definition&&String(v.definition).length>10);
 const context=(String(lesson.title||'')+' '+String(lesson.explain||'')).toLowerCase();
 const words=new Set(context.match(/[a-z]+/g)||[]);
 const scored=terms.map(v=>{const term=String(v.term).toLowerCase();let rank=context.includes(term)?10:0;rank+=term.split(/\s+/).filter(w=>w.length>3&&words.has(w)).length*2;return {v,rank}}).sort((a,b)=>b.rank-a.rank);
 const relevant=scored.filter(x=>x.rank>0).map(x=>x.v);
 const pool=(relevant.length>=3?relevant:scored.map(x=>x.v)).slice(0,Math.min(4,terms.length));
 return {course,key:course+':'+index+':'+String(lesson.title||''),pool,relevant:relevant.length>0,lesson};
}
function fillSentence(row,lesson){
 const text=String(lesson.explain||'').replace(/\s+/g,' ').trim();
 const term=String(row.term),idx=text.toLowerCase().indexOf(term.toLowerCase());
 if(idx>=0){const start=Math.max(0,text.lastIndexOf('.',idx-1)+1),end0=text.indexOf('.',idx+term.length),end=end0>=0?end0+1:Math.min(text.length,idx+term.length+110);const seg=text.slice(start,end).trim();return seg.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'_____')}
 return '_____ : '+String(row.definition).replace(/[.!?]$/,'')+'.';
}
function mount(_box,lesson,index){
 const outer=document.getElementById('learnInlinePractice');if(!outer)return;
 let host=outer.querySelector('.mliVocabularyPanel');if(!host){host=document.createElement('section');host.className='mliVocabularyPanel';outer.appendChild(host)}
 const m=model(lesson,index);
 if(m.pool.length<2){host.innerHTML='<h4>✦ Practice this concept</h4><p>Vocabulary practice will appear here when at least two terms and definitions from this course are available. Add lesson notes or key terms to unlock it.</p>';return}
 let st=states.get(m.key);if(!st){st={mode:'match',picked:-1,matched:{},fills:{},feedback:'',hint:false};states.set(m.key,st)}
 const draw=()=>{
 const rows=m.pool,used=new Set(Object.values(st.matched));
 const definitions=rows.map((v,i)=>({i,text:v.definition})).sort((a,b)=>((a.i+1)*7)%5-((b.i+1)*7)%5);
 let content='';
 if(st.mode==='match'){
 content='<p class="mliIntro">Tap a vocabulary term, then tap the matching definition. Complete all pairs before checking.</p><div class="mliMatchColumns"><div><b>Terms</b>'+rows.map((r,i)=>'<button type="button" data-term="'+i+'" '+(used.has(i)?'disabled':'')+' aria-pressed="'+(st.picked===i)+'">'+esc(r.term)+(used.has(i)?' ✓':'')+'</button>').join('')+'</div><div><b>Definitions</b>'+definitions.map(r=>'<button type="button" data-definition="'+r.i+'" class="'+(st.matched[r.i]!==undefined?'placed':'')+'">'+esc(r.text)+'<small>'+(st.matched[r.i]!==undefined?' ↳ '+esc(rows[st.matched[r.i]]?.term):'')+'</small></button>').join('')+'</div></div>';
 }else{
 const challenges=rows.slice(0,Math.min(3,rows.length));
 content='<p class="mliIntro">Use the word bank to complete each sentence. Click a word, then a blank.</p><div class="mliBank">'+rows.map((r,i)=>'<button type="button" data-term="'+i+'" aria-pressed="'+(st.picked===i)+'">'+esc(r.term)+'</button>').join('')+'</div><div class="mliBlanks">'+challenges.map((r,i)=>'<div class="mliSentence"><span>'+esc(fillSentence(r,m.lesson))+'</span><button type="button" data-blank="'+i+'">'+(st.fills[i]===undefined?'Choose word':esc(rows[st.fills[i]]?.term))+'</button></div>').join('')+'</div>';
 }
 host.innerHTML='<div class="mliHead"><div><small>LEARN LAB · TRY IT HERE</small><h4>✦ Hands-on vocabulary</h4><p>'+(m.relevant?'Words connected to this lesson':'Course vocabulary warm-up')+'</p></div><div class="mliTabs"><button type="button" data-mode="match" aria-selected="'+(st.mode==='match')+'">Match terms</button><button type="button" data-mode="fill" aria-selected="'+(st.mode==='fill')+'">Word-bank blanks</button></div></div>'+content+'<div class="mliControls"><button type="button" data-check>Check answers</button><button type="button" data-reset>Try again</button><button type="button" data-hint>Hint</button></div>'+(st.hint?'<p class="mliFeedback">Hint: '+esc(st.mode==='match'?rows[0].term+' — '+rows[0].definition:'Look for the definition that describes the selected vocabulary word.')+'</p>':'')+(st.feedback?'<p class="mliFeedback" role="status">'+esc(st.feedback)+'</p>':'')+'<p class="mliFoot">Practice here first. Study Realm and Game Realm will challenge you again with less help. Guided work does not count as independent mastery.</p>';
 host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.mode;st.picked=-1;st.feedback='';st.hint=false;draw()});
 host.querySelectorAll('[data-term]').forEach(b=>b.onclick=()=>{st.picked=Number(b.dataset.term);st.feedback='';draw()});
 host.querySelectorAll('[data-definition]').forEach(b=>b.onclick=()=>{if(st.picked<0){st.feedback='Choose a term first.';draw();return}const i=Number(b.dataset.definition);st.matched[i]=st.picked;st.picked=-1;st.feedback='';draw()});
 host.querySelectorAll('[data-blank]').forEach(b=>b.onclick=()=>{if(st.picked<0){st.feedback='Choose a word from the bank first.';draw();return}st.fills[Number(b.dataset.blank)]=st.picked;st.picked=-1;st.feedback='';draw()});
 host.querySelector('[data-reset]').onclick=()=>{st.picked=-1;if(st.mode==='match')st.matched={};else st.fills={};st.feedback='';st.hint=false;draw()};
 host.querySelector('[data-hint]').onclick=()=>{st.hint=true;draw()};
 host.querySelector('[data-check]').onclick=()=>{
 let right,total;
 if(st.mode==='match'){total=rows.length;right=rows.filter((_,i)=>st.matched[i]===i).length}
 else{total=Math.min(3,rows.length);right=rows.slice(0,total).filter((_,i)=>st.fills[i]===i).length}
 st.feedback=right===total?'✓ All '+total+' correct! Try the other tab or continue the lesson.':'You matched '+right+' of '+total+'. Review the definitions and adjust your choices.';
 window.MajickLearningContinuity?.record?.({courseId:m.course,lessonTitle:lesson.title,term:lesson.title,correct:right===total,activity:'learn-lab-'+st.mode});
 if(right<total)st.feedback+=' This skill will also be prioritized in Study Realm and Game Realm.';
 if(right===total){const reward=window.MajickInteractiveRewards?.award?.('learn-vocab-'+index+'-'+st.mode,'participation');if(reward?.awarded)st.feedback+=' +'+reward.xp+' XP earned through the existing reward system.'}
 draw();
 };
 };draw();
 window.MajickInlineLessonTabs?.refresh?.();
}
const css='.learnInlinePractice{margin:20px 0;padding:18px;border:1px solid #c8a877;border-radius:18px;background:#291e37;color:#f7edf1}.mliHead{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}.mliHead h4{font-size:1.35rem;color:#f3d29a;margin:4px 0}.mliHead small{color:#dec6e2;letter-spacing:.08em}.mliHead p,.mliIntro,.mliFoot{color:#f1dfeb}.mliTabs,.mliControls,.mliBank{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.learnInlinePractice button{cursor:pointer;background:#654b6b;color:#fff1dc;border:1px solid #ab8ea4;border-radius:9px;padding:10px;text-align:left}.learnInlinePractice button:focus-visible{outline:3px solid #f5d99a;outline-offset:2px}.learnInlinePractice button[aria-pressed=true],.mliTabs button[aria-selected=true]{background:#a67898;border:2px solid #f7d593}.learnInlinePractice button:disabled{opacity:.65}.mliMatchColumns{display:grid;grid-template-columns:minmax(120px,.8fr) minmax(180px,1.2fr);gap:12px}.mliMatchColumns>div{display:flex;flex-direction:column;gap:8px}.mliMatchColumns b{color:#f3d29a}.mliMatchColumns button{min-height:56px}.mliMatchColumns button small{display:block;color:#ffe3a6;margin-top:6px}.mliMatchColumns button.placed{border-color:#f5d99a}.mliBlanks{display:grid;gap:12px}.mliSentence{padding:12px;border:1px solid #a68b9c;border-radius:10px;display:flex;flex-wrap:wrap;align-items:center;gap:10px}.mliSentence span{flex:1;min-width:160px}.mliFeedback{padding:10px;background:#483652;border-left:3px solid #eed09b}.mliFoot{font-size:.82rem}.mliControls{margin-top:18px}@media(max-width:600px){.mliMatchColumns{grid-template-columns:1fr}.learnInlinePractice{padding:12px}.mliHead{align-items:stretch}}';
const style=document.createElement('style');style.textContent=css;document.head.append(style);
window.MajickInlineLessonPractice={mount,version:'1.0'};
})();