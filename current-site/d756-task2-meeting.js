/* D756 Task 2: adds a rehearsal room to the EXISTING Hands-on Learning Studio. */
(function(){
'use strict';
if(window.MajickD756Meeting)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='majick-d756-task2-rehearsal-v1';
const people=[['Elena Kahale','Mother'],['Angela Madina','Student'],['Mr. Mehta','Principal / LEA'],['Mr. Moore','English teacher']];
const scenes=[
[2,'Welcome the team, introduce the purpose and invite everyone to participate.','Thank you for bringing us together. Can you start by sharing today’s purpose?'],
[3,'Summarize strengths and needs; seek classroom input.','Angela shares creative ideas in class, but inferencing and extended writing are challenging. What should we focus on?'],
[0,'Explain goals in family-friendly language; solicit parent input.','I want specifics. How will we know she is making progress?'],
[1,'Ask Angela about helpful supports.','I like art and math. I get discouraged when writing takes a long time.'],
[3,'Cover all three annual goals.','How do the reading, writing and organization goals translate into classroom work?'],
[0,'Explain progress monitoring and parent notification.','What happens if the strategies aren’t working? How often will I hear from you?'],
[1,'Discuss college plans and student preferences.','I want to study graphic design after high school. Can I really do that?'],
[0,'Listen to family concerns; build consensus without overriding Angela.','I want her to have a secure career. She is so strong in math—why not accounting?'],
[3,'Link writing supports with postsecondary readiness.','A three-paragraph goal is useful, but our class expects five paragraphs. What is the bridge?'],
[2,'Ask about responsibilities, resources and next steps.','We have limited time left. What are the next actions and who will do them?'],
[1,'Check Angela’s understanding and preferences again.','I want everyone to listen to what I would like for my future.'],
[0,'Solicit final questions and close the meeting.','Can you summarize our agreement and invite any final questions?']
];
const challenges=[
[0,'I disagree with focusing on art. I’m worried about her financial future.'],
[3,'How is an 80% rubric score enough if Angela still struggles independently?'],
[1,'Sometimes teachers correct me in front of everyone and it makes me want to stop trying.'],
[2,'Four minutes left. How will you make sure every voice is heard before we close?']
];
const coaching=[
'Welcome the team, provide a short agenda, and ask whether anyone needs clarification.',
'Name art and mathematics strengths, literacy and executive-functioning needs. Invite Mr. Moore’s observations.',
'Reading: infer and cite two details, 4/5 rubric points on 4/5 assessments. Ask Elena what she sees at home.',
'Ask Angela how writing, visual checklists and private feedback could help.',
'Writing: three-paragraph response, 8/10 on 4/5 samples; executive function: initiate within five minutes, complete 3–5 steps, self-check on 4/5 opportunities for three weeks.',
'Weekly reading checks, writing samples every two weeks, classroom task logs, quarterly family reporting.',
'Postsecondary goal: associate-degree graphic design program; compare three programs and practice self-advocacy.',
'Acknowledge Elena’s concern. Center Angela’s choice. Explore practical connections between art, math, technology and business.',
'Explain three paragraphs as scaffold, not permanent limit on grade-level five-paragraph expectations.',
'Assign student, counselor, ELA and special educator next steps; ask for questions.',
'Reflect Angela’s stated preferences and invite concrete suggestions.',
'Review agreement, solicit questions for clarification, thank each participant.'
];
let s={mode:'guided',step:0,records:[],started:0,elapsed:0,active:false,done:false,last:''},tick;
try{let saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.mode)s={...s,...saved,active:false};}catch(_){}
function persist(){try{localStorage.setItem(key,JSON.stringify({...s,active:false}));}catch(_){}}
function meter(){
 const answers=s.records.map(x=>x.answer.toLowerCase());
 let input=0,clarify=0,who=new Set();
 for(let i=0;i<answers.length;i++){
  let a=answers[i];
  if(/[?]/.test(a)&&/(share|thought|input|perspective|feel|concern|suggest|prefer|notice|ideas|what would|what do you)/.test(a))input++;
  if(/[?]/.test(a)&&/(question|clarif|explain|understand|clear|make sense)/.test(a))clarify++;
  if(a.includes('angela'))who.add('Angela');
  if(/elena|kahale/.test(a))who.add('Elena');
  if(/moore/.test(a))who.add('Moore');
 }
 return {input,clarify,stakeholders:who.size,turns:answers.length};
}
function activeScene(){if(s.mode==='challenge'&&s.step>=7&&s.step<=10)return challenges[(s.step-7)%challenges.length];return scenes[Math.min(s.step,11)];}
function timer(){let n=s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function end(){if(s.active)s.elapsed+=Math.floor((Date.now()-s.started)/1000);s.active=false;s.done=true;persist();paint();}
function close(){clearInterval(tick);document.getElementById('d756MeetingRoom')?.remove();}
function paint(){
 const root=document.getElementById('d756MeetingRoom');if(!root)return;
 let m=meter(),scene=activeScene(),speaker=people[scene[0]];
 let stats='<div class="dmStats"><span>Stakeholder input <b>'+m.input+'/5</b></span><span>Clarification prompts <b>'+m.clarify+'/3</b></span><span>Stakeholders named <b>'+m.stakeholders+'/3</b></span><span>Time <b id="dmTime">'+timer()+'</b></span></div>';
 let content='';
 if(s.done){
 content='<h3>Rehearsal review</h3>'+stats+'<p>Check whether you discussed all three annual goals, student strengths and needs, postsecondary education, employment, disagreement resolution and next steps.</p><p>This keyword tracker is a practice aid, not official Mursion scoring or certified independent mastery.</p><button data-action="reset">Practice again</button>';
 }else if(!s.active){
 content='<p>Lead a meeting as Angela’s special education teacher. Four role-play stakeholders respond through scenario prompts. Rehearse aloud, then type what you said. Practice records stay separate from your other course progress.</p><label for="dmMode">Practice mode</label><select id="dmMode"><option value="guided">Guided coaching</option><option value="independent">Independent, no hints</option><option value="challenge">Challenging disagreements</option></select><button data-action="start">Begin rehearsal</button>';
 }else{
 content='<div class="dmPeople">'+people.map((p,i)=>'<div class="dmPerson '+(i===scene[0]?'active':'')+'"><span class="dmFace">'+esc(p[0].split(' ').map(x=>x[0]).join(''))+'</span><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></div>').join('')+'</div>'+stats+'<p><b>Scene '+(s.step+1)+' of 12:</b> '+esc(scenes[s.step][1])+'</p><div class="dmPrompt"><b>'+esc(speaker[0])+':</b><p>'+esc(scene[2])+'</p></div>'+(s.mode==='guided'?'<div class="dmHint"><b>Coach</b><p>'+esc(coaching[s.step])+'</p></div>':'')+'<label for="dmAnswer">Your spoken response (type or summarize it):</label><textarea id="dmAnswer" rows="5"></textarea><div class="dmBtns"><button data-action="submit">Submit response</button><button data-action="finish">Finish and review</button></div>'+(s.last?'<div class="dmHint"><b>Feedback on previous turn</b><p>'+esc(s.last)+'</p></div>':'');
 }
 let transcript=s.records.length?'<details><summary>Practice transcript ('+s.records.length+' turns)</summary><div class="dmTranscript">'+s.records.map(x=>'<p><b>'+esc(x.speaker)+':</b> '+esc(x.line)+'</p><p><b>You:</b> '+esc(x.answer)+'</p>').join('')+'</div></details>':'';
 root.innerHTML='<section class="dmPanel" role="dialog" aria-modal="true" aria-label="D756 meeting practice"><header><div><small>D756 · Hands-on Learning Studio · Task 2</small><h2>Angela Madina — IEP Meeting Rehearsal</h2></div><button data-action="close">Close ✕</button></header>'+content+transcript+'<small>15–20 minutes is the Mursion target. This local rehearsal does not record or submit a Mursion video, and awards no XP or mastery credit.</small></section>';
 root.querySelector('[data-action=close]').onclick=close;
 const start=root.querySelector('[data-action=start]');if(start)start.onclick=()=>{s={mode:root.querySelector('#dmMode').value,step:0,records:[],started:Date.now(),elapsed:0,active:true,done:false,last:''};persist();paint();};
 const submit=root.querySelector('[data-action=submit]');if(submit)submit.onclick=()=>{let el=root.querySelector('#dmAnswer'),a=el.value.trim();if(!a){el.focus();return;}let previous=meter();s.records.push({speaker:speaker[0],line:scene[2],answer:a});let after=meter();s.last=(after.input>previous.input?'Stakeholder input invitation detected. ':'Invite a team member to contribute an idea. ')+(after.clarify>previous.clarify?'Clarification invitation detected. ':'Remember to invite clarification questions at three different points. ')+(s.mode==='guided'?'Continue to reflect what the stakeholder said before changing topics.':'');s.step++;if(s.step>=12){end();return;}persist();paint();};
 const finish=root.querySelector('[data-action=finish]');if(finish)finish.onclick=end;
 const reset=root.querySelector('[data-action=reset]');if(reset)reset.onclick=()=>{s={mode:s.mode,step:0,records:[],started:0,elapsed:0,active:false,done:false,last:''};persist();paint();};
}
function open(){
 if(window.S?.activeCourse!=='D756'){alert('Select the D756 course first.');return;}
 if(!document.getElementById('d756MeetingRoom')){let root=document.createElement('div');root.id='d756MeetingRoom';document.body.append(root);}
 paint();clearInterval(tick);tick=setInterval(()=>{let x=document.getElementById('dmTime');if(x&&s.active)x.textContent=timer();},1000);
}
let style=document.createElement('style');style.textContent='#d756MeetingRoom{position:fixed;inset:0;z-index:1500;background:#110c18df;display:grid;place-items:center;padding:12px;color:#fff4e7}#d756MeetingRoom .dmPanel{background:#23182e;border:2px solid #c9a56b;border-radius:18px;width:min(1000px,100%);max-height:95vh;overflow:auto;padding:20px}#d756MeetingRoom header,#d756MeetingRoom .dmBtns,#d756MeetingRoom .dmStats{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin:12px 0}#d756MeetingRoom h2,#d756MeetingRoom h3{color:#f6d89c}#d756MeetingRoom button,#d756MeetingRoom select{background:#533c58;color:#fff3e2;border:1px solid #c8aa78;padding:10px;border-radius:9px;cursor:pointer}#d756MeetingRoom button:focus-visible,#d756MeetingRoom textarea:focus-visible{outline:3px solid #ffdc95}#d756MeetingRoom textarea{display:block;width:100%;font:inherit;background:#fffaf4;color:#211526;border-radius:10px;padding:12px;margin:9px 0}#d756MeetingRoom .dmPeople{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}#d756MeetingRoom .dmPerson{background:#35263e;border:1px solid #7e6878;border-radius:10px;text-align:center;padding:10px;font-size:13px}#d756MeetingRoom .dmPerson.active{border-color:#f4c77d}#d756MeetingRoom .dmFace{display:block;margin:0 auto 5px;background:#6f5069;border-radius:50%;padding:12px;width:48px}#d756MeetingRoom small{display:block;opacity:.85}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{background:#3d2c45;border-left:4px solid #dbb77c;padding:12px;border-radius:8px;margin:12px 0}#d756MeetingRoom .dmStats span{border:1px solid #987a94;border-radius:18px;padding:7px}#d756MeetingRoom .dmTranscript{max-height:200px;overflow:auto}@media(max-width:600px){#d756MeetingRoom .dmPanel{padding:12px}#d756MeetingRoom .dmPeople{grid-template-columns:repeat(2,1fr)}}';document.head.append(style);
function attach(){if(window.S?.activeCourse!=='D756')return;let studio=document.getElementById('majickHandsOnOverlay');if(!studio||studio.querySelector('#d756Task2Launch'))return;let b=document.createElement('button');b.id='d756Task2Launch';b.textContent='🎓 Task 2 — IEP Meeting Practice';b.onclick=open;(studio.querySelector('.mhTabs')||studio.querySelector('header')||studio).appendChild(b);}
let observer=new MutationObserver(()=>{if(document.getElementById('majickHandsOnOverlay')&&!document.getElementById('d756Task2Launch'))attach();});observer.observe(document.body,{childList:true,subtree:true});
setTimeout(attach,500);
window.MajickD756Meeting={version:'1.0',open,close,refresh:attach,summary:meter};
})();