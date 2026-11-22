/* Aetheria: course-aware low-pressure speaking inside the existing Hands-on Studio.
   No new room, no XP or mastery claims, opt-in speech transcription. */
(function(){
'use strict';
if(window.MajickSpeakingPractice)return;
const E=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
const prompts={
 D669:[
  {title:'Explain a reading concept',ask:'Explain the difference between phonological awareness, phonemic awareness, and phonics to a colleague.',clues:['Give your main point','Describe the difference','Give a classroom example','Finish with what you would teach next']},
  {title:'Talk through student evidence',ask:'A student can rhyme but struggles to blend individual sounds. Explain what you notice and your next instructional move.',clues:['State the observation','Identify the likely skill need','Describe one teaching move','Name how you would check progress']},
  {title:'Speak with a family',ask:'Explain why pointing to words during a read-aloud helps a young reader develop print awareness.',clues:['Start with a friendly explanation','Give one concrete example','Explain the benefit','Invite a question']}
 ],
 D756:[
  {title:'Explain an IEP recommendation',ask:'In a meeting, explain why a reading goal should be measurable and connected to present levels.',clues:['State your recommendation','Reference evidence','Explain the benefit','Invite team input']},
  {title:'Respond to a concern',ask:'A parent is worried that their child is not making progress. Respond with empathy and a clear next step.',clues:['Acknowledge the concern','Share relevant evidence','Propose a next step','Ask for the parent’s perspective']}
 ],
 D772:[
  {title:'Explain a statistical conclusion',ask:'Explain to a colleague why correlation alone does not demonstrate causation.',clues:['State the distinction','Give an example','Explain an alternative cause','Summarize']},
  {title:'Explain an investigation',ask:'Explain the difference between independent and dependent events using an everyday example.',clues:['Define the distinction','Give an example','Explain your reasoning','Close clearly']}
 ]
};
const tiers=[{seconds:30,label:'30 sec',name:'One clear point'},{seconds:60,label:'60 sec',name:'Point + evidence + example'},{seconds:120,label:'2 min',name:'Full explanation + follow-up'}];
let chosen=0,tier=0,seconds=0,running=false,clock=null,transcript='',notes='',recognizer=null,listening=false,shownCourse='';
const active=()=>String(window.S?.activeCourse||'');
const material=()=>{
 const cid=active(),c=window.S?.courses?.[cid]||{},base=prompts[cid];
 if(base)return base;
 const concepts=(Array.isArray(c.concepts)?c.concepts:[]).filter(x=>x?.title).slice(0,3);
 return concepts.length?concepts.map(x=>({title:'Explain '+x.title,ask:'Explain '+x.title+' to a colleague who is new to '+(c.title||cid)+'. Give an example of how you would use or recognize it.',clues:['State your main point','Explain it in everyday language','Give a course-related example','Summarize']})):[{title:'Explain what you learned',ask:'Choose one concept from your current '+(c.title||cid||'course')+' lesson. Explain it to someone who is new to the topic and give one example.',clues:['Name the concept','Explain it simply','Give an example','Finish with a summary']}];
};
const getCourseStore=()=>{
 if(!window.S)return null;
 S.speakingPractice=S.speakingPractice&&typeof S.speakingPractice==='object'?S.speakingPractice:{};
 const id=active();S.speakingPractice[id]=S.speakingPractice[id]||{attempts:[]};return S.speakingPractice[id];
};
function stopClock(){running=false;if(clock){clearInterval(clock);clock=null;}updateStatus();}
function stopMic(){if(recognizer){try{recognizer.stop()}catch(_){}}recognizer=null;listening=false;}
function resetForCourse(){const c=active();if(c!==shownCourse){stopClock();stopMic();chosen=0;tier=0;seconds=0;transcript='';notes='';shownCourse=c;}}
function updateStatus(){const el=document.querySelector('[data-sp-time]');if(el)el.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');const state=document.querySelector('[data-sp-running]');if(state)state.textContent=running?'Practicing · timer counts up':'Paused · take your time';const action=document.querySelector('[data-sp-clock]');if(action)action.textContent=running?'Pause timer':'Start timer';const mic=document.querySelector('[data-sp-mic]');if(mic)mic.textContent=listening?'Stop microphone':'Use microphone (optional)';}
function render(){
 resetForCourse();const c=active(),p=material()[Math.min(chosen,material().length-1)],goal=tiers[tier];
 const stored=getCourseStore(),completed=stored?.attempts?.length||0;
 return '<section class="sp-panel" aria-label="Speaking practice" id="speakingPractice"><div class="sp-head"><div><span class="sp-kicker">✦ SPEAKING STUDIO · '+E(c)+'</span><h3>Build your speaking confidence</h3><p>Practice privately. No audience, no graded performance, no forced timer. You can start over as often as you like.</p></div><span class="sp-record">'+completed+' saved reflections</span></div>'+
 '<div class="sp-controls"><label>Practice scenario<select data-sp-prompt>'+material().map((x,i)=>'<option value="'+i+'" '+(i===chosen?'selected':'')+'>'+E(x.title)+'</option>').join('')+'</select></label><label>Suggested speaking length<select data-sp-tier>'+tiers.map((x,i)=>'<option value="'+i+'" '+(i===tier?'selected':'')+'>'+E(x.label+' — '+x.name)+'</option>').join('')+'</select></label></div>'+
 '<div class="sp-scenario"><strong>What you will explain</strong><p>'+E(p.ask)+'</p></div>'+
 '<details class="sp-guide"><summary>Show my speaking outline</summary><ol>'+p.clues.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol><p>Try: “My main point is…”, “For example…”, “This matters because…”, “To summarize…”</p></details>'+
 '<div class="sp-timing"><div><strong data-sp-time>'+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+'</strong><span data-sp-running>'+(running?'Practicing · timer counts up':'Paused · take your time')+'</span><small>Suggested goal: '+E(goal.label)+'. You can stop whenever you want.</small></div><div class="sp-actions"><button type="button" data-sp-clock>'+(running?'Pause timer':'Start timer')+'</button><button type="button" data-sp-reset>Reset time</button></div></div>'+
 '<label class="sp-note-label">Optional notes or transcript<textarea data-sp-notes rows="4" placeholder="Speak aloud first, then jot down your main point. Or type here if you prefer.">'+E(notes)+'</textarea></label>'+
 '<div class="sp-actions"><button type="button" data-sp-mic>'+(listening?'Stop microphone':'Use microphone (optional)')+'</button><span class="sp-muted">Speech recognition depends on your browser and may send audio to its speech service. No recording is stored by Aetheria. Your notes are saved only if you choose Save reflection.</span></div>'+
 '<fieldset class="sp-reflect"><legend>Quick self-check (not a grade)</legend><label><input type="checkbox" data-sp-check="point"> I made one clear main point</label><label><input type="checkbox" data-sp-check="example"> I gave an example or evidence</label><label><input type="checkbox" data-sp-check="close"> I finished with a summary or next step</label></fieldset>'+
 '<div class="sp-actions"><button type="button" data-sp-save>Save reflection</button><button type="button" data-sp-new>Try another prompt</button></div><p class="sp-message" data-sp-message role="status" aria-live="polite">Speaking is a skill you practice—not a test you must pass.</p></section>';
}
function message(t){const e=document.querySelector('[data-sp-message]');if(e)e.textContent=t;}
function startClock(){if(running)return;running=true;clock=setInterval(()=>{if(!document.querySelector('.sp-panel')||active()!==shownCourse){stopClock();stopMic();return;}seconds++;updateStatus();},1000);updateStatus();}
function toggleMicrophone(){
 if(listening){stopMic();updateStatus();message('Microphone stopped. Review your transcript before saving.');return;}
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){message('This browser does not support speech-to-text. You can still speak aloud and type optional notes.');return;}
 try{
  const rec=new SR();recognizer=rec;rec.lang='en-US';rec.continuous=true;rec.interimResults=false;listening=true;
  rec.onresult=ev=>{for(let i=ev.resultIndex;i<ev.results.length;i++){if(ev.results[i].isFinal){transcript+=(transcript?' ':'')+ev.results[i][0].transcript;}}
    const field=document.querySelector('[data-sp-notes]');if(field){notes=transcript;field.value=notes;}};
  rec.onerror=ev=>{message('Speech recognition ended ('+String(ev.error||'unavailable')+'). You can continue speaking without it.');listening=false;updateStatus();};
  rec.onend=()=>{listening=false;recognizer=null;updateStatus();};
  rec.start();startClock();updateStatus();message('Listening. Speak naturally; you can pause, restart, or stop at any time.');
 }catch(_){stopMic();updateStatus();message('Microphone unavailable. Please use spoken practice without transcription.');}
}
function saveReflection(){
 stopClock();stopMic();
 const store=getCourseStore();if(!store){message('Your app progress is not ready. Please try again.');return;}
 const checks=[...document.querySelectorAll('[data-sp-check]:checked')].map(x=>x.dataset.spCheck);
 const p=material()[chosen]||material()[0];const n=document.querySelector('[data-sp-notes]')?.value||notes;
 store.attempts.push({promptTitle:p.title,scenario:p.ask,goalSeconds:tiers[tier].seconds,elapsedSeconds:seconds,selfChecks:checks,notes:String(n).slice(0,5000),savedAt:new Date().toISOString(),mode:'self-reflection',graded:false});
 if(store.attempts.length>50)store.attempts=store.attempts.slice(-50);
 try{window.save?.()}catch(_){}
 message('Reflection saved to this course. No grade or XP awarded. Try another prompt whenever you like.');
 const count=document.querySelector('.sp-record');if(count)count.textContent=store.attempts.length+' saved reflections';
}
document.addEventListener('change',e=>{
 if(!e.target.closest('.sp-panel'))return;
 if(e.target.matches('[data-sp-prompt]')){stopClock();stopMic();chosen=Number(e.target.value)||0;seconds=0;notes='';transcript='';refresh();}
 if(e.target.matches('[data-sp-tier]')){tier=Number(e.target.value)||0;refresh();}
});
document.addEventListener('input',e=>{if(e.target.matches('.sp-panel [data-sp-notes]'))notes=e.target.value;});
document.addEventListener('click',e=>{
 const b=e.target.closest('.sp-panel button');if(!b)return;
 if(b.matches('[data-sp-clock]'))running?stopClock():startClock();
 else if(b.matches('[data-sp-reset]')){stopClock();seconds=0;updateStatus();}
 else if(b.matches('[data-sp-mic]'))toggleMicrophone();
 else if(b.matches('[data-sp-save]'))saveReflection();
 else if(b.matches('[data-sp-new]')){stopClock();stopMic();chosen=(chosen+1)%material().length;notes='';transcript='';seconds=0;refresh();}
});
function refresh(){
 const section=document.querySelector('.sp-panel');if(!section)return;
 section.outerHTML=render();updateStatus();
}
const css=document.createElement('style');css.textContent=`
.sp-panel{margin:18px 0;padding:20px;border:1px solid #b99b68;border-radius:18px;background:#30283c;color:#fff4e2;line-height:1.5}
.sp-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.sp-head h3{margin:4px 0 8px;color:#f5d49c}.sp-head p{max-width:65ch;margin:0 0 14px}
.sp-kicker{font-size:.72rem;font-weight:800;letter-spacing:.07em;color:#f7d397}.sp-record{font-size:.8rem;color:#f7dbad}
.sp-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
.sp-panel label{font-weight:600;display:block}.sp-panel select,.sp-panel textarea{display:block;width:100%;max-width:100%;padding:11px;margin-top:6px;border:1px solid #a392b2;border-radius:9px;background:#fffdf8;color:#292039;font:inherit;box-sizing:border-box}
.sp-scenario,.sp-guide,.sp-timing,.sp-reflect{border:1px solid #8e7b98;background:#392d45;border-radius:11px;padding:14px;margin:12px 0}.sp-scenario p{margin:8px 0 0;font-size:1.04rem}.sp-guide summary{cursor:pointer;font-weight:700}.sp-guide ol{padding-left:22px}.sp-guide li{margin:8px 0}
.sp-timing{display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between;align-items:center}
.sp-timing strong{font-size:2rem;font-variant-numeric:tabular-nums;display:block}.sp-timing span,.sp-timing small{display:block}
.sp-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:10px 0}.sp-panel button{min-height:44px;cursor:pointer;border:1px solid #efcf8b;border-radius:9px;padding:9px 13px;background:#675078;color:#fff9e7;font-weight:700}.sp-panel button:hover{background:#79648c}
.sp-note-label{margin-top:12px}.sp-panel textarea{min-height:95px}
.sp-muted{font-size:.77rem;opacity:.9;flex:1 1 260px}.sp-reflect legend{font-weight:800}.sp-reflect label{display:flex;align-items:center;gap:9px;margin:9px 0;font-weight:500}.sp-reflect input{width:18px;height:18px}.sp-message{min-height:24px;color:#ffe2a7}
.sp-panel button:focus-visible,.sp-panel input:focus-visible,.sp-panel select:focus-visible,.sp-panel textarea:focus-visible{outline:3px solid #ffdf92;outline-offset:2px}
@media(max-width:620px){.sp-panel{padding:13px}.sp-controls{grid-template-columns:1fr}}
`;document.head.appendChild(css);
window.MajickSpeakingPractice={render,stop:()=>{stopClock();stopMic();},getCourseStore};
})();
