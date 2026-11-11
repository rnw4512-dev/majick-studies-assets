/* D756 Task 2: adds a rehearsal room to the EXISTING Hands-on Learning Studio. */
(function(){
'use strict';
if(window.MajickD756Meeting)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='majick-d756-task2-rehearsal-v1';
const profiles={angela:{student:'Angela Madina',age:15,parent:'Elena Kahale',principal:'Mr. Mehta',teacher:'Mr. Moore',career:'graphic design',option:'accounting'},maya:{student:'Maya Rivera',age:16,parent:'Sofia Rivera',principal:'Dr. Bennett',teacher:'Ms. Patel',career:'animation',option:'engineering'},jordan:{student:'Jordan Ellis',age:17,parent:'Marcus Ellis',principal:'Ms. Chen',teacher:'Mr. Harris',career:'web design',option:'business'}};
function person(){return profiles[s.profile]||profiles.angela}
function peopleNow(){let p=person();return [[p.parent,'Parent/guardian'],[p.student,'Student, age '+p.age],[p.principal,'Principal / LEA'],[p.teacher,'English teacher']]}
function localize(t){let p=person();if(s.profile==='angela')return t;return t.replace(/\bAngela\b/g,p.student.split(' ')[0]).replace(/graphic design/gi,p.career).replace(/accounting/gi,p.option)}

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
let s={mode:'guided',profile:'angela',step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null},tick;
try{let saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.mode)s={...s,...saved,active:false};}catch(_){}
function persist(){try{localStorage.setItem(key,JSON.stringify({...s,active:false}));}catch(_){}}
function meter(){
 const answers=s.records.map(x=>x.answer.toLowerCase());
 const p=person(),names=[p.student,p.parent,p.teacher].map(x=>x.toLowerCase().split(' ').slice(-1)[0]);
 let input=0,clarify=0,who=new Set();
 for(let i=0;i<answers.length;i++){
  let a=answers[i];
  if(/[?]/.test(a)&&/(share|thought|input|perspective|feel|concern|suggest|prefer|notice|ideas|what would|what do you)/.test(a))input++;
  if(/[?]/.test(a)&&/(question|clarif|explain|understand|clear|make sense)/.test(a))clarify++;
  if(/[?]/.test(a)&&a.includes(names[0]))who.add('student');
  if(/[?]/.test(a)&&a.includes(names[1]))who.add('parent');
  if(/[?]/.test(a)&&a.includes(names[2]))who.add('teacher');
 }
 return {input,clarify,stakeholders:who.size,turns:answers.length};
}
function activeScene(){if(s.pending)return [s.pending.who,'Follow-up question',s.pending.line];if(s.mode==='challenge'&&s.step>=7&&s.step<=10)return challenges[(s.step-7)%challenges.length];return scenes[Math.min(s.step,11)];}
function followUp(a,step){let t=a.toLowerCase(),p=person();
 if(step===0&&!/(purpose|agenda|meeting|today)/.test(t))return {who:2,line:'Could you explain the purpose and agenda before we begin?'};
 if(step===2&&!/(progress|data|report|monitor|measur)/.test(t))return {who:0,line:'Can you give a concrete example of how you will measure progress?'};
 if(step===4&&!(/read|inferen/.test(t)&&/writ|paragraph/.test(t)&&/organiz|executive|task/.test(t)))return {who:3,line:'Can you explain all three annual goals and how we will measure them?'};
 if(step===6&&!/(college|program|postsecondary|training)/.test(t))return {who:1,line:'What would I do first to pursue '+p.career+' after high school?'};
 if(step===7&&!/(hear|understand|concern|respect|appreciate|both|together)/.test(t))return {who:0,line:'I feel like my concerns about the future haven’t been addressed. Can we discuss them?'};
 if(step===8&&!/(scaffold|step|progress|build|paragraph|gradual|model)/.test(t))return {who:3,line:'How will these supports move the student toward grade-level writing expectations?'};
 if(step===11&&!/(next|summary|summar|thank|question|clarif)/.test(t))return {who:2,line:'Can you summarize next steps and invite final questions before we adjourn?'};
 return null;
}
function timer(){let n=s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function grade(){
 const m=meter(),responses=s.records.map(x=>x.answer.trim()),all=responses.join(' ').toLowerCase();
 const duration=s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0);
 const goals=/(reading|comprehension|inferen)/.test(all)&&/(writing|paragraph|written expression)/.test(all)&&/(executive|organiza|multi.step|task initiation|checklist)/.test(all);
 const transition=(all.includes(person().career)||/(design|art|creative)/.test(all))&&/(college|postsecondary|degree|training)/.test(all)&&/(employ|career|job|workplace)/.test(all);
 const respect=/(hear|understand|appreciate|respect|thank you|concern)/.test(all)&&/(explore|compare|choice|options|collaborat|together)/.test(all);
 const nontrivial=responses.filter(x=>x.length>=65).length>=10;
 const distinct=new Set(responses.map(x=>x.toLowerCase().replace(/\s+/g,' '))).size===responses.length;
 const checks=[
  ['All 12 core meeting stages completed',s.step>=12&&s.records.filter(x=>x.core!==false).length===12],
  ['At least five separate stakeholder input invitations',m.input>=5],
  ['At least three separate clarification invitations',m.clarify>=3],
  ['Student, parent and English teacher directly invited to contribute',m.stakeholders>=3],
  ['All three annual goal areas discussed',goals],
  ['Postsecondary education and employment discussed',transition],
  ['Family concern acknowledged and choices considered',respect],
  ['Meaningful, non-repeated responses throughout',nontrivial&&distinct],
  ['Meeting lasted at least 15 and no more than 20 minutes',duration>=900&&duration<=1200]
 ];
 return {passed:checks.every(x=>x[1]),checks,duration};
}
function issueReward(result){
 if(!result.passed)return {status:'not-earned',xp:0,crystals:0};
 const reward=window.MajickRewardCore;
 const account=window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount;
 if(!reward?.award||!account?.rewardCore?.ledger)return {status:'unavailable',xp:0,crystals:0};
 const ledger=account.rewardCore.ledger;
 const firstKey='d756:task2:meeting:first-success:v1';
 const firstDone=Boolean(ledger[firstKey]);
 const day=new Date().toISOString().slice(0,10);
 const key=firstDone?'d756:task2:meeting:repeat:'+day:firstKey;
 if(ledger[key])return {status:'already-awarded',xp:0,crystals:0};
 const type=firstDone?'d756-meeting-repeat-practice':'d756-meeting-first-pass';
 const receipt=reward.award(type,{key,course:'D756',source:'d756-task2-meeting',independent:false,masteryEligible:false});
 if(!receipt)return {status:'unavailable',xp:0,crystals:0};
 return {status:firstDone?'repeat-success':'first-success',xp:receipt.xp||0,crystals:receipt.crystals||0};
}
function end(){
 if(s.active)s.elapsed+=Math.floor((Date.now()-s.started)/1000);
 s.active=false;s.done=true;
 s.assessment=grade();
 s.reward=issueReward(s.assessment);
 persist();paint();
}
function close(){clearInterval(tick);document.getElementById('d756MeetingRoom')?.remove();}
function paint(){
 const root=document.getElementById('d756MeetingRoom');if(!root)return;
 let m=meter(),scene=activeScene(),people=peopleNow(),speaker=people[scene[0]],p=person();
 let stats='<div class="dmStats"><span>Stakeholder input <b>'+m.input+'/5</b></span><span>Clarification prompts <b>'+m.clarify+'/3</b></span><span>Stakeholders named <b>'+m.stakeholders+'/3</b></span><span>Time <b id="dmTime">'+timer()+'</b></span></div>';
 let content='';
 if(s.done){
 const assessment=s.assessment||grade(),receipt=s.reward||{status:'not-earned',xp:0,crystals:0};
 content='<h3>Rehearsal review</h3>'+stats+'<p><b>'+(assessment.passed?'Practice criteria met':'Practice criteria not yet met')+'</b></p><p>'+esc(receipt.status==='first-success'?'First successful meeting: +30 Scholar XP and +5 crystals':receipt.status==='repeat-success'?'Successful repeat: +8 Scholar XP and +1 crystal':receipt.status==='already-awarded'?'Today’s practice reward was already granted; no duplicate XP':receipt.status==='unavailable'?'Reward system unavailable; no XP granted':'No XP awarded until all criteria are satisfied')+'</p><ul>'+assessment.checks.map(x=>'<li>'+(x[1]?'✓ ':'○ ')+esc(x[0])+'</li>').join('')+'</ul><p>Automated rehearsal checks are not official Mursion evaluation or verified independent academic mastery. A repeat reward is available at most once per calendar day.</p><button data-action="reset">Practice again</button>';
 }else if(!s.active){
 content='<p>Conduct a full meeting with stakeholder follow-ups and an end-of-meeting rubric check. Speak aloud before typing your response.</p><label for="dmProfile">Scenario</label><select id="dmProfile">'+Object.entries(profiles).map(([id,p])=>'<option value="'+id+'" '+(s.profile===id?'selected':'')+'>'+esc(p.student)+' — age '+p.age+(id==='angela'?' (WGU case)':' (fictional case)')+'</option>').join('')+'</select><p><small>Only Angela’s profile matches your official WGU assignment. Other characters and ages are fictional practice variations.</small></p><label for="dmMode">Practice mode</label><select id="dmMode"><option value="guided" '+(s.mode==='guided'?'selected':'')+'>Guided coaching</option><option value="independent" '+(s.mode==='independent'?'selected':'')+'>Independent rehearsal</option><option value="challenge" '+(s.mode==='challenge'?'selected':'')+'>Challenging disagreements</option></select><button data-action="start">Begin full meeting</button>';
 }else{
 content='<div class="dmPeople">'+people.map((p,i)=>'<div class="dmPerson '+(i===scene[0]?'active':'')+'"><span class="dmFace">'+esc(p[0].split(' ').map(x=>x[0]).join(''))+'</span><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></div>').join('')+'</div>'+stats+'<p><b>Stage '+(s.step+1)+' of 12'+(s.pending?' · Adaptive follow-up':'')+':</b> '+esc(scenes[s.step][1])+'</p><div class="dmPrompt"><b>'+esc(speaker[0])+':</b><p>'+esc(localize(scene[2]))+'</p></div>'+(s.mode==='guided'?'<div class="dmHint"><b>Coach</b><p>'+esc(localize(coaching[s.step]))+'</p></div>':'')+'<label for="dmAnswer">Your spoken response (type or summarize it):</label><textarea id="dmAnswer" rows="5"></textarea><div class="dmBtns"><button data-action="submit">Submit response</button><button data-action="finish">Finish and review</button></div>'+(s.last?'<div class="dmHint"><b>Feedback on previous turn</b><p>'+esc(s.last)+'</p></div>':'');
 }
 let transcript=s.records.length?'<details><summary>Practice transcript ('+s.records.length+' turns)</summary><div class="dmTranscript">'+s.records.map(x=>'<p><b>'+esc(x.speaker)+':</b> '+esc(x.line)+'</p><p><b>You:</b> '+esc(x.answer)+'</p>').join('')+'</div></details>':'';
 root.innerHTML='<section class="dmPanel" role="dialog" aria-modal="true" aria-label="D756 meeting practice"><header><div><small>D756 · Hands-on Learning Studio · Task 2</small><h2>'+esc(p.student)+' — Full IEP Meeting Rehearsal</h2></div><button data-action="close">Close ✕</button></header>'+content+transcript+'<small>15–20 minutes is the Mursion target. Qualified rehearsals earn +30 XP and +5 crystals the first time; later qualifying practice earns +8 XP and +1 crystal, at most once a day. No mastery credit or official Mursion recording.</small></section>';
 root.querySelector('[data-action=close]').onclick=close;
 const start=root.querySelector('[data-action=start]');if(start)start.onclick=()=>{s={mode:root.querySelector('#dmMode').value,profile:root.querySelector('#dmProfile').value,step:0,records:[],started:Date.now(),elapsed:0,active:true,done:false,last:'',pending:null,assessment:null,reward:null};persist();paint();};
 const submit=root.querySelector('[data-action=submit]');if(submit)submit.onclick=()=>{
 let el=root.querySelector('#dmAnswer'),a=el.value.trim();if(!a){el.focus();return;}
 let prev=meter(),isFollow=Boolean(s.pending);
 s.records.push({speaker:speaker[0],line:localize(scene[2]),answer:a,core:!isFollow,stage:s.step});
 let after=meter();
 s.last=(after.input>prev.input?'Stakeholder input invitation detected. ':'Invite a specific stakeholder to contribute an idea. ')+(after.clarify>prev.clarify?'Clarification question invitation detected. ':'Remember three separate clarification checks.');
 if(isFollow){s.pending=null;s.step++;}else{s.pending=followUp(a,s.step);if(!s.pending)s.step++;}
 if(s.step>=12){end();return;}persist();paint();
};
 const finish=root.querySelector('[data-action=finish]');if(finish)finish.onclick=end;
 const reset=root.querySelector('[data-action=reset]');if(reset)reset.onclick=()=>{s={mode:s.mode,profile:s.profile,step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null,assessment:null,reward:null};persist();paint();};
}
function open(){
 if(window.S?.activeCourse!=='D756'){alert('Select the D756 course first.');return;}
 if(!document.getElementById('d756MeetingRoom')){let root=document.createElement('div');root.id='d756MeetingRoom';document.body.append(root);}
 paint();clearInterval(tick);tick=setInterval(()=>{let x=document.getElementById('dmTime');if(x&&s.active)x.textContent=timer();},1000);
}
let style=document.createElement('style');style.textContent='#d756MeetingRoom{position:fixed;inset:0;z-index:1500;background:#110c18df;display:grid;place-items:center;padding:12px;color:#fff4e7}#d756MeetingRoom .dmPanel{background:#23182e;border:2px solid #c9a56b;border-radius:18px;width:min(1000px,100%);max-height:95vh;overflow:auto;padding:20px}#d756MeetingRoom header,#d756MeetingRoom .dmBtns,#d756MeetingRoom .dmStats{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin:12px 0}#d756MeetingRoom h2,#d756MeetingRoom h3{color:#f6d89c}#d756MeetingRoom button,#d756MeetingRoom select{background:#533c58;color:#fff3e2;border:1px solid #c8aa78;padding:10px;border-radius:9px;cursor:pointer}#d756MeetingRoom button:focus-visible,#d756MeetingRoom textarea:focus-visible{outline:3px solid #ffdc95}#d756MeetingRoom textarea{display:block;width:100%;font:inherit;background:#fffaf4;color:#211526;border-radius:10px;padding:12px;margin:9px 0}#d756MeetingRoom .dmPeople{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}#d756MeetingRoom .dmPerson{background:#35263e;border:1px solid #7e6878;border-radius:10px;text-align:center;padding:10px;font-size:13px}#d756MeetingRoom .dmPerson.active{border-color:#f4c77d}#d756MeetingRoom .dmFace{display:block;margin:0 auto 5px;background:#6f5069;border-radius:50%;padding:12px;width:48px}#d756MeetingRoom small{display:block;opacity:.85}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{background:#3d2c45;border-left:4px solid #dbb77c;padding:12px;border-radius:8px;margin:12px 0}#d756MeetingRoom .dmStats span{border:1px solid #987a94;border-radius:18px;padding:7px}#d756MeetingRoom .dmTranscript{max-height:200px;overflow:auto}@media(max-width:600px){#d756MeetingRoom .dmPanel{padding:12px}#d756MeetingRoom .dmPeople{grid-template-columns:repeat(2,1fr)}}';style.textContent+='#d756MeetingRoom select{display:block;max-width:100%;margin:6px 0 16px}#d756MeetingRoom .dmPanel{line-height:1.5}';document.head.append(style);
function attach(){if(window.S?.activeCourse!=='D756')return;let studio=document.getElementById('majickHandsOnOverlay');if(!studio||studio.querySelector('#d756Task2Launch'))return;let b=document.createElement('button');b.id='d756Task2Launch';b.textContent='🎓 Task 2 — IEP Meeting Practice';b.onclick=open;(studio.querySelector('.mhTabs')||studio.querySelector('header')||studio).appendChild(b);}
let observer=new MutationObserver(()=>{if(document.getElementById('majickHandsOnOverlay')&&!document.getElementById('d756Task2Launch'))attach();});observer.observe(document.body,{childList:true,subtree:true});
setTimeout(attach,500);
window.MajickD756Meeting={version:'1.2',open,close,refresh:attach,summary:meter,profiles:()=>Object.keys(profiles)};
})();