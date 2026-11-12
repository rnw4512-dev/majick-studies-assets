/* D756 Task 2: adds a rehearsal room to the EXISTING Hands-on Learning Studio. */
(function(){
'use strict';
if(window.MajickD756Meeting)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='majick-d756-task2-rehearsal-v1';
const profiles={
angela:{student:'Angela Madina',age:15,grade:10,parent:'Elena Kahale',principal:'Mr. Mehta',teacher:'Mr. Moore',career:'graphic design',option:'a mathematics-related career',strengths:'Mathematics and art',needs:'Specific Learning Disability in reading comprehension and written expression; task initiation, organization and self-monitoring',goals:[['Reading','Make an inference, identify two relevant supporting details, and explain the connection; at least 4/5 rubric points across four of five consecutive assessments.'],['Writing','Develop an organized three-paragraph response with supporting details, transitions and conclusion; at least 8/10 rubric points across four of five writing samples.'],['Executive functioning','Start a three-to-five-step assignment within five minutes, complete the steps and independently check work; successful in four of five opportunities across three consecutive weeks.']],supports:'Visual checklists, graphic organizers, modeling, chunked assignments and private feedback.',transition:'Explore postsecondary graphic design education, compare program requirements, build a portfolio and practice requesting disability supports; explore graphic design employment.'},
maya:{student:'Maya Rivera',age:16,grade:11,parent:'Sofia Rivera',principal:'Dr. Bennett',teacher:'Ms. Patel',career:'animation',option:'engineering',strengths:'Visual storytelling, oral discussion and digital illustration',needs:'Reading technical vocabulary, explaining evidence in writing and managing project deadlines',goals:[['Reading','Use context and a reference tool to explain eight of ten technical terms on four consecutive weekly probes.'],['Writing','Write a storyboard rationale with a claim and three cited examples, earning 9/12 rubric points on four of five monthly samples.'],['Executive functioning','Plan four project milestones and meet each deadline using a digital planner in four of five projects over one semester.']],supports:'Vocabulary previews, illustrated reference sheets, speech-to-text drafts and a shared digital planner.',transition:'Visit two animation certificate or college programs, create a six-piece portfolio and interview a working animator about entry-level employment.'},
jordan:{student:'Jordan Ellis',age:17,grade:12,parent:'Marcus Ellis',principal:'Ms. Chen',teacher:'Mr. Harris',career:'web design',option:'business',strengths:'Coding, visual layout and troubleshooting',needs:'Evaluating source credibility, client communication and independent revision',goals:[['Reading','Compare two online sources and justify credibility with three criteria, earning 5/6 rubric points on four of five biweekly probes.'],['Writing','Write an accessible client proposal containing audience, scope, timeline and revision plan, earning 10/12 points on four consecutive samples.'],['Executive functioning','Use an accessibility checklist to identify and repair four of five website defects independently in three consecutive projects.']],supports:'Source-evaluation templates, client-proposal models, accessibility checklists and scheduled project check-ins.',transition:'Apply to a community-college web development program, contact disability services and complete a supervised web-design internship toward employment.'}
};
function person(){return profiles[s.profile]||profiles.angela}
function peopleNow(){let p=person();return [[p.parent,'Parent/guardian'],[p.student,'Student, grade '+p.grade],[p.principal,'Principal / LEA'],[p.teacher,'General education teacher']]}
function localize(t){let p=person();return t.replace(/Angela/g,p.student.split(' ')[0]).replace(/Elena/g,p.parent.split(' ')[0]).replace(/Mr. Moore/g,p.teacher).replace(/graphic design/gi,p.career).replace(/accounting/gi,p.option)}
const iepDetails={
angela:{baseline:'Qualitative case information: mathematics and art strengths; difficulty making inferences, organizing multiparagraph writing, initiating assignments and checking work. Numeric baseline scores were not supplied; establish baseline using the goal rubrics.',monitor:'Reading inference rubric on repeated assessments; writing rubric on consecutive samples; assignment initiation/completion/self-check logs across three consecutive weeks. Review patterns with the family and team.',roles:'Special educator coordinates instruction and data; Mr. Moore supplies classroom work samples and implements supports; Angela selects useful strategies and explores graphic design; Elena shares home observations; Mr. Mehta coordinates resources.'},
maya:{baseline:'Fictional present levels: explains 4/10 unfamiliar production terms; storyboard rationale scores 5/12; meets two of four project milestones with adult reminders. Oral storytelling and digital illustration are strong.',monitor:'Weekly vocabulary probes; monthly storyboard rationale samples; dated digital planner milestone logs. Send a family summary monthly and review teaching after six weeks of stalled progress.',roles:'Special educator teaches vocabulary and written evidence; Ms. Patel collects rationale samples; Maya curates six portfolio pieces and updates the planner; Sofia reviews program costs; Dr. Bennett coordinates a program visit.'},
jordan:{baseline:'Fictional present levels: source credibility rubric 2/6; client proposal rubric 6/12; independently repairs 2/5 accessibility defects. Coding and visual layout are strong; client communication needs explicit instruction.',monitor:'Biweekly source-comparison probes; rubric-scored client proposals; accessibility checklists across consecutive projects. Share monthly reports and convene a review if progress stalls.',roles:'Special educator models source evaluation and client communication; Mr. Harris collects proposal and accessibility samples; Jordan contacts disability services and chooses internship goals; Marcus supports applications; Ms. Chen coordinates internship access.'}
};
function caseCard(){const p=person(),d=iepDetails[s.profile];return '<details class="dmGlance" '+(typeof matchMedia==='function'&&matchMedia('(max-width:850px)').matches?'':'open')+'><summary>IEP at a Glance — '+esc(s.profile==='angela'?'WGU Angela Madina Practice Meeting':p.student+' · fictional IEP')+'</summary><p><b>'+esc(p.student)+'</b> · Age '+p.age+' · Grade '+p.grade+' · Interest: '+esc(p.career)+'</p><p><b>Strengths:</b> '+esc(p.strengths)+'</p><p><b>Needs:</b> '+esc(p.needs)+'</p><p><b>Present levels:</b> '+esc(d.baseline)+'</p>'+p.goals.map(g=>'<p data-goal><b>'+esc(g[0])+':</b> '+esc(g[1])+'</p>').join('')+'<p><b>Supports:</b> '+esc(p.supports)+'</p><p><b>Progress monitoring:</b> '+esc(d.monitor)+'</p><p><b>Education and employment:</b> '+esc(p.transition)+'</p><p><b>Team responsibilities:</b> '+esc(d.roles)+'</p></details>'}


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
'Welcome the team, give a short agenda, and invite specific input. Once a participant shares a concern, ask a contextual follow-up question.',
'Name art and mathematics strengths, literacy and executive-functioning needs. Invite Mr. Moore’s observations.',
'Reading: infer and cite two details, 4/5 rubric points across four of five consecutive assessments. Ask Elena what she sees at home.',
'Ask Angela how writing, visual checklists and private feedback could help.',
'Writing: three-paragraph response, 8/10 on 4/5 samples; executive function: initiate within five minutes, complete 3–5 steps, self-check on four of five opportunities across three consecutive weeks.',
'Weekly reading checks, writing samples every two weeks, classroom task logs, quarterly family reporting.',
'Postsecondary goal: associate-degree graphic design program; compare three programs and practice self-advocacy.',
'Acknowledge Elena’s concern. Center Angela’s choice. Explore practical connections between art, math, technology and business.',
'Explain three paragraphs as scaffold, not permanent limit on grade-level five-paragraph expectations.',
'Assign student, counselor, ELA and special educator next steps; clarify any specific uncertainty a participant has already raised.',
'Reflect Angela’s stated preferences and invite concrete suggestions.',
'Review agreement, seek clarification about a specific stakeholder statement if needed, and thank each participant.'
];

// Practice storyline: authored from a realistic rehearsal of Angela's classroom writing barriers.
// These are fictional stakeholder statements for rehearsal, not additional official WGU case facts.
const classroomStory={
  0:[0,'Parent perspective','At previous meetings, I left unsure what decisions were being made. Are we reviewing how Angela is doing now, or deciding which goals and services she needs going forward?'],
  1:[3,'Strengths, written expression and classroom access','Angela contributes creative ideas during discussions and makes connections with visual concepts. However, she sometimes cannot get started turning ideas into writing, and some assignments remain unfinished. I give reminders, but I do not want her to depend on constant prompting.'],
  2:[0,'Home-school perspective','Angela can work for hours on drawing, but she sometimes leaves writing assignments unfinished. I do not want her to lose confidence or require an adult beside her for every assignment.'],
  3:[1,'Student voice and dignity','When I draw, I can see where to start. With an essay, all the ideas feel tangled, and after explaining them aloud, writing feels like starting over. Graphic organizers help. When teachers repeatedly come to my desk, I feel embarrassed, like everyone knows I am struggling.'],
  4:[3,'Evaluate independence without removing access','I can provide a digital organizer and use a discreet help signal, but how will we measure whether Angela works more independently? If she needs four reminders to open her checklist, does that count as independence?'],
  5:[0,'Family input on monitoring','I want to know when and how progress will be shared. Please do not reduce something helping her just because a month has passed.'],
  8:[3,'Bridge supports and grade-level writing','I can teach her to plan and draft using an organizer, but I need a way to assess independently initiated work and how her writing approaches grade-level expectations.']
};
function classroomResponse(a,who,step){
 if(s.profile!=='angela'||s.storyline!=='classroom-writing'||step>5)return null;
 const t=a.toLowerCase(), asks=/\?|please (share|describe|tell)/.test(t);
 if(!asks)return null;
 if(who===1){
  if(/timer|time limit|timed|pacing/.test(t))return 'Timers make me rush and my writing gets worse. Could we use a check-in or flexible milestone instead?';
  if(/support|accommod|graphic organ|checklist|independen|remove|fade/.test(t))return 'A digital checklist I create myself would feel more private. I can signal when I need help, but I worry that if I am not ready in two months someone will take away my graphic organizer.';
  if(/writ|start|essay|idea|oral|record/.test(t))return 'I have ideas when we talk, but I cannot choose the first one for an essay. I would like to talk or record my ideas and then organize them into paragraphs. I still want to write the final assignment myself.';
  return 'Please ask me about what works for me before adults choose or change my supports.';
 }
 if(who===0){
  if(/home|routine|checklist|remind|prompt/.test(t))return 'At home, a small checklist and talking through the assignment help. But I cannot sit beside Angela for every assignment. How can she start independently?';
  if(/support|independen|fade|remove|month/.test(t))return 'I support greater independence, but I do not want her supports removed simply because time passes. Can we review her actual work and confidence first?';
  return 'I see her confidence in art and math. I want the team to explain how writing supports will carry over to her classes.';
 }
 if(who===3){
  if(/independen|prompt|checklist|monitor|data|measure/.test(t))return 'We can document whether she starts her checklist herself, the number of prompts, whether she completes each step, and the quality of her written work. What data threshold would show she is ready for fewer prompts?';
  if(/graphic|organizer|written|writing|oral|record/.test(t))return 'I can make the digital organizer available, and have Angela select her ideas before drafting. I would like to agree on how we will assess the final writing, not just whether she used the tool.';
  return 'I see creative participation during discussions, but starting and finishing written responses remain difficult. I want her to feel supported without public attention.';
 }
 return null;
}
function classroomResponsivePrompt(a,scene){
 if(s.profile!=='angela'||s.storyline!=='classroom-writing')return null;
 const t=a.toLowerCase(),speaker=scene[0];
 if(speaker===1&&/tim(er|ed)|minute|deadline/.test(t))return {who:1,kind:'concern',line:'A timer can make me anxious and rush my writing. Can we agree on a way to keep track without putting me under pressure?'};
 if(speaker===1&&/remove|take away|fade|month/.test(t))return {who:1,kind:'concern',line:'If I still need my organizer after a month or two, will I be allowed to keep using it?'};
 if(speaker===3&&/gradual|fade|independen|checklist|prompt/.test(t))return {who:3,kind:'concern',line:'How will we know the checklist is helping me work independently rather than just helping me finish after reminders?'};
 if(speaker===0&&/reduce|remove|independen|fade/.test(t))return {who:0,kind:'concern',line:'I support Angela developing independence, but I want support changes tied to her progress data, not just a calendar date.'};
 return null;
}

const councilPhases=['Opening Ceremony',"Scholar’s Portrait",'Three Goal Scrolls','Crossroads of Tomorrow','Final Accord'];
const phaseFor=stage=>[0,1,1,1,2,2,3,3,3,4,4,4][Math.min(11,stage)];
let replay=null;try{const value=JSON.parse(localStorage.getItem(key+'-replay'));if(value?.active&&Array.isArray(value.queue))replay=value}catch(_){}
function saveReplay(){try{localStorage.setItem(key+'-replay',JSON.stringify(replay))}catch(_){}}
function councilHeading(){const phase=phaseFor(s.step);return '<nav aria-label="Council phases"><ol class="dmCouncilPhases">'+councilPhases.map((name,i)=>'<li '+(i===phase?'aria-current="step"':'')+'><span>'+String(i+1)+'/5</span> '+esc(name)+'</li>').join('')+'</ol></nav>';}
function replayChoices(){const unique=[];for(const stage of [7,8,10,5,3,2]){const r=s.records.findIndex(x=>x.stage===stage);if(r>=0)unique.push(r)}if(unique.length<2)return '<p>Replay Chamber becomes available after two different exchanges have been recorded.</p>';return '<fieldset class="dmReplayChoices"><legend>Replay Chamber · choose 2–3 exchanges</legend>'+unique.map(i=>'<label><input type="checkbox" data-replay-choice="'+i+'"> '+esc(s.records[i].speaker)+' · '+esc(scenes[s.records[i].stage][1])+'</label>').join('')+'<button data-action="replay-start" disabled>Practice selected exchanges · no XP</button></fieldset>';}
function replayVariant(record,n){const p=person(),v={7:['I want to support '+p.student.split(' ')[0]+' but I still worry about stable employment. What evidence could help us compare options?','We may not agree on a career today. How can we leave with an actionable plan that respects the student?'],8:['I have a full classroom. How will these supports fit into our shared routine?','What should I collect to know whether the accommodation is helping?'],10:['I am not sure how my views changed the plan. Could you check my understanding?','Could you explain who I should contact if the plan is not working?'],5:['I thought one passing score meant support would stop. Is that correct?','What will you do if the progress data do not improve?'],3:['I want to help choose the supports. How will you include my preference?','I am reluctant to speak when adults interrupt. Can you make room for me?']};return (v[record.stage]||['How will you listen to my perspective and record the next action?','What evidence and next steps should the team agree to review?'])[n%2];}
function replayView(){const item=replay.queue[replay.index];if(!item)return '<h3>Replay Chamber complete</h3><p>Your original meeting, feedback and reward receipt are unchanged. These coached exchanges earn no completion XP.</p><button data-action="replay-exit">Return to original review</button>';return '<h3>Replay Chamber · '+(replay.index+1)+' / '+replay.queue.length+'</h3><p>Practice only · original evidence remains unchanged · no XP or mastery credit</p><blockquote><b>'+esc(item.record.speaker)+':</b> '+esc(item.variant)+'</blockquote><p>Reflect the concern, refer to this student’s plan, and propose a concrete next action. Try: “I hear your concern. Let us review the evidence together and agree who will follow up.”</p><label for="dmReplayAnswer">Rehearsed response</label><textarea id="dmReplayAnswer" rows="4"></textarea><button data-action="replay-submit">Rehearse this exchange</button><button data-action="replay-exit">Return to original review</button>'+(replay.feedback?'<p role="status">'+esc(replay.feedback)+'</p><button data-action="replay-next">Next selected exchange</button>':'');}
function repairView(){const r=s.repair;return '<h3>Pause-and-Repair · guided practice</h3><p>The active meeting clock is paused. Coached replies remain practice evidence and do not demonstrate independent mastery.</p><blockquote>'+esc(r.line)+'</blockquote><p>'+esc(r.reason)+'</p><p><b>Sentence starter:</b> '+esc(r.starter)+'</p><p>'+esc(s.profile==='angela'?localize(coaching[s.step]):person().goals.map(g=>g[1]).join(' '))+'</p><label for="dmRepairAnswer">Retry the exchange</label><textarea id="dmRepairAnswer" rows="4">'+esc(s.draft||'')+'</textarea><button data-action="repair-submit">Use rehearsed reply and resume</button><button data-action="repair-cancel">Resume without changing original reply</button>';}


function professionalConcern(answer){
 const t=String(answer||'').toLowerCase();
 // Narrow, transparent practice heuristics; not a definitive assessment of intent.
 if(/(?:don't|do not|shouldn't|should not|never)\s+(?:call|label|say|tell).{0,35}(?:lazy|stupid)/.test(t))return '';
 if(/(?:you are|you're|she is)\s+(?:lazy|stupid|incapable|not trying)/.test(t))return 'blaming-label';
 if(/(?:stop complaining|just try harder|shut up|no excuses?|you're overreacting|grow up)/.test(t))return 'dismissal';
 if(/(?:we will|i will|must|we should)\s+(?:remove|take away|stop|end)\s+(?:all\s+)?(?:her\s+|your\s+)?(?:supports?|accommodations?|graphic organizers?)/.test(t))return 'support-removal';
 return '';
}
function professionalRepairPrompt(kind){
 if(kind==='support-removal')return {who:1,kind:'respect-repair',line:'I am scared I will lose the organizer that helps me write. Could we decide about supports using my progress and my input instead?'};
 return {who:1,kind:'respect-repair',line:'That made me feel blamed. I am trying, and I want the team to understand what is difficult without making me embarrassed.'};
}
function professionalFeedback(answer,clarified,assisted,scene){
 if(professionalConcern(answer))return 'Professional-language repair: this wording could feel blaming, dismissive, or threatening to remove accommodations. Acknowledge the impact; ask how the student experiences the problem; restate the need without blame; and propose a measurable support plan. A response repair is needed.';
 if(s.toneOpen)return 'The relationship still needs repair. Acknowledge Angela’s feelings, apologize for the wording if needed, and affirm that she will help decide next steps.';
 if(clarified)return 'Clarifying follow-up credited: you asked about the meaning of a stakeholder statement. Listen to the answer and confirm your understanding before recommending a change.';
 if(indicators(answer).input)return 'Meaningful input credited: you invited a participant’s specific perspective. Use their response to refine the IEP instead of moving straight to another question.';
 if(/month|fade|remove|independen/.test(answer.toLowerCase())&&/checklist|organizer|support/.test(answer.toLowerCase())&&!/data|evidence|progress|review|monitor/.test(answer.toLowerCase()))return 'Independence strategy needs a safeguard: review prompt counts, independent initiation, work completion and writing quality before adjusting scaffolds. Do not remove accommodations just because time passes.';
 if(assisted)return 'You practiced with a guided example. This is coached rehearsal, not independent demonstration; try a fresh response without options next.';
 if(/thank|hear|understand|appreciate|concern/.test(answer.toLowerCase()))return 'Respectful acknowledgment noted. Next, connect the concern to an actual goal, clarify the student’s perspective, and identify a data-informed follow-up.';
 return 'Practice one response at a time: describe the observable issue, acknowledge the participant, and ask one specific question or propose a clear next step.';
}

function responseChoices(){
 const line=activeScene()[2].toLowerCase();
 if(/timer|timed|rush|remove|take away|accommod|organizer/.test(line))return [
 'Angela, when you say timed writing makes you rush, what changes in your writing and confidence?',
 'Your accommodations will not be removed on a fixed date. We will review evidence and make changes with you.',
 'Mr. Moore, which data show independent initiation and writing quality while Angela still uses her organizer?'
 ];
 if(/writing|essay|start|prompt|checklist|embarrass|class/.test(line))return [
 'Angela, when you say starting is difficult, which part of organizing your ideas feels hardest?',
 'Elena, what helps Angela begin a writing assignment at home without repeated verbal reminders?',
 'Mr. Moore, what have you noticed about Angela’s writing after she first talks through her ideas?'
 ];
 if(/goal|rubric|progress|monitor|data/.test(line))return [
 'Let me explain the annual goal in plain language, including what we measure and how often we monitor progress.',
 'Elena, which part of this goal or progress reporting would you like us to explain with an example?',
 'Mr. Moore, what weekly writing samples and task initiation logs can the team review?'
 ];
 if(/college|career|future|design|graduat/.test(line))return [
 'Angela, what interests you most about graphic design and what training would you like to explore?',
 'Elena, when you mention career security, what specific costs or employment concerns worry you?',
 'We can compare postsecondary options together and keep Angela’s wishes central.'
 ];
 return [
 'Thank you for attending. We will review Angela’s strengths, needs, annual goals, transition plan, progress and next steps.',
 'Angela, what strengths would you like the team to recognize before we begin reviewing goals?',
 'Elena, what concern would you most like the team to address today?'
 ];
}
function coachedOptions(){
 if(!s.active||s.mode!=='guided')return '';
 return '<section class="dmChoices" aria-label="Guided sample responses"><b>Optional response examples</b><p>Speak one aloud, then edit it. Selecting an example labels this turn as coached rather than independent.</p><div class="dmChoiceList">'+responseChoices().map((x,i)=>'<button type="button" data-response-choice="'+i+'">'+esc(x)+'</button>').join('')+'</div></section>';
}
function typingPause(){if(s.active&&s.pacing==='typing'&&!s.typingPausedAt)s.typingPausedAt=Date.now();}
function typingResume(){if(s.active&&s.typingPausedAt){s.started+=Date.now()-s.typingPausedAt;s.typingPausedAt=null;}}

function meaningfulResponse(a){const i=indicators(a),words=a.trim().split(/\s+/).length,unique=new Set(norm(a).split(' ')).size,clarify=contextualClarification(a,activeScene()[2]);return ((i.input&&words>=5&&unique>=4)||(clarify&&words>=7&&unique>=6)||(words>=10&&unique>=8)||!!professionalConcern(a))&&!s.records.some(r=>norm(r.answer)===norm(a));}
function commitTurn(a,assisted=false){typingResume();const scene=activeScene(),people=peopleNow(),isFollow=!!s.pending,pending=s.pending;const clarified=contextualClarification(a,localize(scene[2]));const tone=professionalConcern(a);if(tone)s.toneOpen=true;else if(s.toneOpen&&/(i'm sorry|i apologize|sorry|i hear|i understand|thank you)/i.test(a)&&/(support|listen|respect|together|choice|help|plan)/i.test(a))s.toneOpen=false;const contextMatch=!!pending&&!clarified&&!indicators(a).input&&addressesPending(a,pending);s.draft='';s.records.push({speaker:people[scene[0]][0],line:localize(scene[2]),answer:a,core:!isFollow,stage:s.step,valid:true,assisted,contextMatch,professionalToneFlag:tone||null,clarifyingFollowUp:clarified,responseTo:pending?.line||null,at:Date.now()});
 if(s.step===7&&resolves(a)){s.concernResolved=true;s.concernStatus=/disagree|unresolved|not agree|differ|remain/i.test(a)?'follow-up scheduled':'options acknowledged';}
 s.last=professionalFeedback(a,clarified,assisted,scene);
 s.pending=tone?professionalRepairPrompt(tone):clarified?{who:scene[0],line:'To clarify what I shared: '+localize(scene[2])+' I would appreciate a specific plan that addresses that concern.',kind:'clarification-response'}:isFollow&&!indicators(a).input&&!addressesPending(a,pending)?pending:classroomResponsivePrompt(a,scene)||followUp(a,s.step);s.awaitingReply=!!s.pending;s.reply=s.pending?null:[scene[0],'Stakeholder response',s.step===7&&s.concernResolved?'Thank you for hearing my concern. We can keep our differing views and compare practical options through the follow-up plan while keeping the student’s preference central.':'I have heard your proposal. Please document the responsibilities and the point when we will review this together.'];persist();paint();}
function badges(){const m=meter(),all=s.records.map(r=>r.answer).join(' ');return [m.stakeholders===3?'Voice of the Council':null,m.clarify>=3?'Seeker of Clarity':null,s.concernResolved?'Bridge Builder':null,/(college|postsecondary|training)/i.test(all)&&/(employ|career)/i.test(all)?'Keeper of Futures':null].filter(Boolean);}
let s={mode:'guided',profile:'angela',storyline:'standard',pacing:'normal',typingPausedAt:null,toneOpen:false,step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null},tick,returnFocus;
try{let saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.mode)s={...s,...saved,typingPausedAt:null,active:false,resumable:saved.mode==='guided'&&!saved.done&&(saved.resumable||saved.elapsed>0||saved.records?.length>0||!!saved.draft)};}catch(_){}
function elapsed(){return s.elapsed+(s.active?Math.floor(((s.typingPausedAt||Date.now())-s.started)/1000):0)}
function persist(){try{localStorage.setItem(key,JSON.stringify({...s,elapsed:elapsed(),started:0,active:false}));}catch(_){s.storageError=true;}}
function history(){try{return JSON.parse(localStorage.getItem(key+'-history')||'[]')}catch(_){return []}}
function pause(){typingResume();const draft=document.getElementById('dmAnswer');if(draft)s.draft=draft.value;if(s.active){s.elapsed=elapsed();s.active=false;s.resumable=true;}persist();}
window.addEventListener('pagehide',()=>{if(s.active&&s.mode!=='guided'){s.interrupted=true;end();}else pause();});
function norm(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function indicators(a){
 const t=a.toLowerCase(),question=/\?/.test(a)||/^please (share|tell|ask)/.test(t);
 // Instructor rule: generic "any questions?" and "anything to add?" are neither clarification nor substantive input.
 const generic=/(?:anyone|everybody|everyone).{0,45}(?:questions|add|thoughts)|any (?:questions|clarification)|does (?:anyone|somebody) have/i.test(t);
 const substantive=/(goal|iep|plan|transition|education|career|writing|reading|math|strength|need|support|accommod|progress|class|home|routine|future|graduat|program|assignment|student|angela|maya|jordan|feedback|instruction|schedule|participat)/i.test(t);
 const input=question&&!generic&&substantive&&/(how do you feel|what do you think|what are your (thoughts|concerns|ideas)|what would (you|help)|what (do you|have you) (notice|observ|prefer|suggest|recommend)|tell (me|us) (about|what)|describe (what|how)|share (your|what)|what.{0,30}(want|hope|plan|interest|goal)|how.{0,40}(doing|perform|class|work|progress)|how is.{0,40}(doing|perform)|what (?:ideas|concerns|suggestions|observations|thoughts) would you (?:like to )?share|what (?:supports|accommodations|tools|strategies) do you (?:prefer|need|find helpful))/i.test(t);
 const who=/^\s*(team|everyone|all of you)[,:]/i.test(t)?[]:peopleNow().map((p,i)=>{const positions=p[0].toLowerCase().split(' ').filter(n=>n.length>2&&!['mr.','ms.','mrs.','dr.'].includes(n)).map(n=>t.search(new RegExp('\\b'+n+'\\b'))).filter(n=>n>=0);return {i,at:positions.length?Math.min(...positions):Infinity};}).filter(x=>Number.isFinite(x.at)).sort((a,b)=>a.at-b.at).map(x=>x.i);
 return {input,clarify:false,generic,who};
}
function contextualClarification(answer,statement){
 const t=answer.toLowerCase(),speaker=String(statement||'').toLowerCase();
 if(!speaker||!/\?/.test(answer)||/(?:anyone|everyone|everybody).{0,45}(?:questions|add)|any (?:questions|clarification)/i.test(t))return false;
 // Follow-up must seek the meaning, evidence, example or deeper explanation of a specific stakeholder statement.
 const probe=/(when you (say|said|mention|mentioned|describe)|you (said|mentioned|noted|shared)|do you mean|what do you mean|what does.{0,45}look like|could you (describe|explain|give (?:me |us )?an example|tell (?:me |us )?more)|can you (clarify|explain|give (?:me |us )?an example)|is your concern|am i understanding|help me understand|what specifically|which (part|aspect|situation))/i.test(t);
 if(!probe)return false;
 const stop=new Set(['about','after','again','along','before','could','every','first','from','have','help','into','just','like','more','much','need','other','really','some','that','their','them','there','these','they','this','those','what','when','where','which','while','with','would','your','youre','because','question','questions','explain','describe','example','understand','clarify','mentioned','shared','specific','specifically','student']);
 const tokens=[...new Set(speaker.match(/[a-z]{5,}/g)||[])].filter(w=>!stop.has(w));
 const anchored=tokens.some(w=>t.includes(w));
 return anchored;
}
function meter(){
 let input=0,clarify=0,who=new Set(),seen=new Set();
 for(const r of s.records){
  if(!r.valid||seen.has(norm(r.answer)))continue;seen.add(norm(r.answer));
  const i=indicators(r.answer);
  if(i.input){input++;i.who.filter(x=>[0,1,3].includes(x)).forEach(x=>who.add(x));}
  if(r.clarifyingFollowUp===true)clarify++;
 }
 return {input,clarify,stakeholders:who.size,turns:s.records.length};
}
function activeScene(){if(s.reply&&!s.pending)return s.reply;if(s.pending)return [s.pending.who,'Follow-up question',s.pending.line];if(s.profile==='angela'&&s.storyline==='classroom-writing'&&classroomStory[s.step])return classroomStory[s.step];if(s.step===7&&!s.financialDiscovered)return [0,'Listen to the family perspective','I am not comfortable with this pathway yet. I would like to talk before we decide.'];if(s.mode==='challenge'){const p=person(),complications={2:[0,'I disagree with this proposed goal. Why is it appropriate for my child?'],3:[1,'I feel unheard when adults choose my supports without asking me.'],5:[0,'Sorry to interrupt. Does meeting one rubric score mean all support ends?'],7:[0,'I prefer '+p.option+'; '+p.career+' worries me financially.'],8:[3,'I question whether we can implement these accommodations during every classroom lesson.'],9:[2,'We have four minutes left. How will we preserve time for student voice and next steps?'],10:[3,'If progress stalls, what evidence would lead us to revise the teaching approach?']};if(complications[s.step])return [complications[s.step][0],"Meeting complication",complications[s.step][1]];}let scene=[...scenes[Math.min(s.step,11)]];if(s.profile!=='angela'){const p=person();const lines={1:p.strengths+'. We need support with '+p.needs+'.',3:p.supports+' Which supports can I help choose?',4:'How will we measure these goals? '+p.goals.map(g=>g[1]).join(' '),7:'I want to understand the costs and employment prospects for '+p.career+'. Can we compare that pathway with '+p.option+' while hearing the student’s view?',8:'How can we make these supports practical in our classroom?'};scene[2]=lines[s.step]||scene[2];}return scene;}
function followUp(a,step){const t=a.toLowerCase(),p=person(),i=indicators(a);const future=/after|graduat|college|postsecondary|career|future|interest|want.{0,20}do/i.test(t)||(step>=6&&!/support|help|accommod|class|work|writing|reading/i.test(t));
 if(contextualClarification(a,activeScene()[2]))return null;
 if(i.input){const who=i.who.length?i.who[0]:[1,0,3][(s.records.length+s.variant)%3];if(who===0&&future)s.financialDiscovered=true;const classroomLine=classroomResponse(a,who,step);if(classroomLine)return {who,line:classroomLine,kind:'input'};const lines={
  0:!future?['At home, getting started is difficult. Can we coordinate a routine?', 'I would like regular updates with examples of the work.']:['I worry about financial stability. How can we compare career options?', 'I want to support this choice and understand the training costs.'],
  1:!future?['I want to choose which supports help me. '+p.supports,'Private feedback helps me stay confident. Please ask me before changing my plan.']:['I want to pursue '+p.career+'. '+p.transition,'My preference is '+p.career+'. I feel unheard when that interest is dismissed. Can we explore my preference?'],
  3:['In class, I notice strengths in '+p.strengths+'. '+p.needs+'.','I notice difficulty with '+p.needs+'. I can collect classroom work samples, but need a practical schedule for these supports.'],
  2:['We can coordinate resources. Who will take responsibility for the follow-up?']};return {who,line:lines[who][(s.records.length+s.variant)%lines[who].length],kind:'input'};
 }
 if(step===7&&!s.financialDiscovered)return {who:0,line:'I am uncomfortable with this pathway. Could you ask me what is worrying me before we decide on next steps?',kind:'concern'};
 if(step===7&&!s.concernResolved)return {who:0,line:'My concern is financial stability and training costs. We may not agree today, but can you hear my concern, include the student’s preference and record who will compare options and follow up?',kind:'concern'};
 return null;
}
function addressesPending(answer,pending){if(!pending)return true;const t=pending.line.toLowerCase();if(/blamed|embarrassed|feel blamed|lose the organizer|scared i will lose/.test(t))return /apolog|sorry|understand|hear|listen|support|respect|together|review|data|progress/i.test(answer);if(/progress|rubric|updates|measure|score|support ends/.test(t))return /data|progress|rubric|sample|measure|report|review|support|continue/i.test(answer);if(/career|financial|cost|training|college/.test(t))return /career|cost|education|training|college|employ|explore|compare|choice/i.test(answer);if(/unheard|choice|dismiss|prefer/.test(t))return /hear|voice|choice|prefer|ask|listen|student/i.test(answer);if(/class|support|routine|feedback|organize|planner/.test(t))return /support|routine|model|plan|organ|feedback|strategy|strategies|schedule|checklist/i.test(answer);return /review|plan|coordinate|responsib|follow.up|contact|teach|data|support|clarif/i.test(answer);}
function resolves(a){return s.financialDiscovered===true&&/(hear|understand|appreciate|concern|worr)/i.test(a)&&/(choice|prefer|want|voice|student)/i.test(a)&&/(compare|explore|research|review|follow.up|options)/i.test(a)&&/(we will|I will|counselor|teacher|team|week|next|together)/i.test(a)}
function timer(){let n=elapsed();return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function goalEvidence(){const rules={
angela:[[/inferen/i,/two|2/i,/detail/i,/connect|explain/i,/4\s*\/\s*5|four.{0,8}five/i,/consecutive/i], [/three|3/i,/paragraph/i,/detail/i,/transition/i,/conclusion/i,/8\s*\/\s*10|eight.{0,8}ten/i,/four.{0,8}five|4\s*\/\s*5/i], [/five minutes|5 minutes/i,/three.{0,8}five|3.{0,3}5/i,/check/i,/four.{0,8}five|4\s*\/\s*5/i,/three consecutive weeks|3 consecutive weeks/i]],
maya:[[/term|vocab/i,/eight|8/i,/ten|10/i,/four|4/i,/weekly/i], [/storyboard|rationale/i,/claim/i,/three|3/i,/9\s*\/\s*12|nine.{0,8}twelve/i,/four|4/i], [/milestone/i,/four|4/i,/deadline/i,/five|5/i,/semester/i]],
jordan:[[/source/i,/two|2/i,/three|3/i,/5\s*\/\s*6|five.{0,8}six/i,/biweekly/i], [/proposal/i,/audience/i,/scope/i,/timeline/i,/revision/i,/10\s*\/\s*12|ten.{0,8}twelve/i,/four|4/i], [/accessibility/i,/checklist/i,/four|4/i,/five|5/i,/three consecutive|3 consecutive/i]]};return rules[s.profile||'angela'].map(group=>s.records.filter(r=>r.valid&&group.every(rx=>rx.test(r.answer))));}
function grade(){
 const m=meter(),responses=s.records.map(x=>x.answer.trim()),all=responses.join(' ').toLowerCase();
 const duration=elapsed();
 const goals=/(reading|comprehension|inferen)/.test(all)&&/(writing|paragraph|written expression)/.test(all)&&/(executive|organiza|multi.step|task initiation|checklist)/.test(all);
 const transition=(all.includes(person().career)||/(design|art|creative)/.test(all))&&/(college|postsecondary|degree|training)/.test(all)&&/(employ|career|job|workplace)/.test(all);
 const respect=s.concernResolved===true;
 const nontrivial=s.records.filter(x=>x.valid).length>=12;
 const distinct=new Set(responses.map(x=>x.toLowerCase().replace(/\s+/g,' '))).size===responses.length;
 const checks=[
  ['All 12 core meeting stages completed',s.step>=12&&new Set(s.records.filter(x=>x.valid).map(x=>x.stage)).size===12],
  ['At least five separate stakeholder input invitations',m.input>=5],
  ['At least three contextual clarifying follow-up questions',m.clarify>=3],
  ['Student, parent and general education teacher directly invited to contribute',m.stakeholders>=3],
  ['All three annual goal areas discussed',goals],
  ['Postsecondary education and employment discussed',transition],
  ['Family concern heard; choices or a clear follow-up plan recorded',respect],
  ['Meaningful, non-repeated responses throughout',nontrivial&&distinct],
  ['Unassisted facilitation included; not an assisted-only rehearsal',s.records.some(r=>r.valid&&r.core&&!r.assisted)],
  ['Active listening responds to an actual stakeholder statement',s.records.some(r=>r.contextMatch&&/(hear|understand|you said|it sounds|thank|appreciate|concern)/i.test(r.answer))],
  ['Uninterrupted independent/trial attempt',!s.interrupted],
  ['Any harmful phrasing was repaired respectfully',!s.toneOpen],
  ['Strengths and needs explained',s.records.some(r=>r.valid&&/(strength|math|art|coding|storytelling)/i.test(r.answer))&&s.records.some(r=>r.valid&&/(need|support|challenge|difficult)/i.test(r.answer))],
  ['Progress monitoring and family updates',s.records.some(r=>r.valid&&/(monitor|probe|sample|log|data)/i.test(r.answer)&&/(weekly|quarter|report|update|every|family)/i.test(r.answer))],
  ['Next steps and professional closing',s.records.some(r=>r.stage===11&&r.valid&&/(next|follow.up|responsib)/i.test(r.answer)&&/(thank|adjourn|close)/i.test(r.answer))],
  ['All three measurable goal criteria explained',goalEvidence().every(x=>x.length>0)],
  ['Meeting lasted at least 15 and no more than 20 minutes',duration>=900&&duration<=1200]
 ];
 return {passed:checks.every(x=>x[1]),checks,duration};
}
function advice(label){if(/clarif/i.test(label))return 'Ask three genuine follow-up questions about what a person just shared. Example: “Mr. Moore, when you say Angela needs frequent prompts, what does that look like during written assignments?” Generic “Any questions?” does not count.';if(/input|invited/i.test(label))return 'Ask for ideas on five separate turns and directly address the student, parent and teacher. Example: “'+person().student.split(' ')[0]+', what would help you start your work?”';if(/goal/i.test(label))return 'Explain each behavior, measurement, threshold and consistency period from this case reference. Example: “'+person().goals[0][1]+'”';if(/closing/i.test(label))return 'Assign responsibilities and a review time, then thank the team. Example: “Next, I will share the plan and meet with you in four weeks to review data. Thank you for your ideas.”';if(/monitor/i.test(label))return 'Name the evidence, collection schedule and family reporting schedule. Example: “We will collect weekly work samples and share progress reports each quarter.”';if(/Postsecondary/i.test(label))return person().transition;if(/concern/i.test(label))return 'Reflect the actual concern and preserve student choice. Example: “I hear your concern about career security. Let us explore training costs and employment options together while honoring the student’s preference.”';if(/lasted/i.test(label))return 'Complete a 15–20-minute active rehearsal; Back and Close pause the clock. Time alone never earns a reward.';return 'Use the agenda and transcript to identify an omitted topic; give a specific explanation and invite a relevant stakeholder response.';}
function evidenceFor(label){
 const rows=s.records.filter(r=>r.valid);
 if(/measurable goal/.test(label))return [...new Set(goalEvidence().flat())];
 let matches;
 if(/12 core/.test(label))matches=rows.filter((r,i)=>rows.findIndex(x=>x.stage===r.stage)===i);
 else if(/input invitations/.test(label))matches=rows.filter(r=>indicators(r.answer).input);
 else if(/clarifying follow-up/.test(label))matches=rows.filter(r=>r.clarifyingFollowUp===true);
 else if(/directly invited/.test(label))matches=rows.filter(r=>indicators(r.answer).input&&indicators(r.answer).who.length);
 else if(/annual goal areas/.test(label))matches=rows.filter(r=>/reading|writing|executive|organization/i.test(r.answer));
 else if(/Postsecondary/.test(label))matches=rows.filter(r=>/college|postsecondary|education|employ|career|program/i.test(r.answer));
 else if(/concern/.test(label))matches=rows.filter(r=>r.stage===7&&resolves(r.answer));
 else if(/Strengths/.test(label))matches=rows.filter(r=>/strength|math|art|coding|storytelling|need|challenge/i.test(r.answer));
 else if(/monitoring/.test(label))matches=rows.filter(r=>/monitor|probe|sample|log|data/i.test(r.answer)&&/weekly|quarter|report|update|every|family/i.test(r.answer));
 else if(/closing/.test(label))matches=rows.filter(r=>r.stage===11&&/next|follow.up|responsib/i.test(r.answer)&&/thank|adjourn|close/i.test(r.answer));
 else if(/lasted/.test(label))return [];
 else matches=rows;
 return matches;
}
function issueReward(result){
 if(!result.passed||s.retryOnly||s.interrupted)return {status:'not-earned',xp:0,crystals:0};
 const reward=window.MajickRewardCore;
 reward?.inspect?.(); // Initialize the ledger through its authoritative owner before reading it.
 const account=window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount;
 if(!reward?.award||!account?.rewardCore?.ledger)return {status:'unavailable',xp:0,crystals:0};
 const ledger=account.rewardCore.ledger;
 const firstKey='d756:task2:meeting:first-success:v1';
 const firstDone=Boolean(ledger[firstKey]);
 const day=new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0');
 const key=firstDone?'d756:task2:meeting:repeat:'+day:firstKey;
 if(ledger[key])return {status:'already-awarded',xp:0,crystals:0};
 const type=firstDone?'d756-meeting-repeat-practice':'d756-meeting-first-pass';
 const receipt=reward.award(type,{key,course:'D756',source:'d756-task2-meeting',independent:false,masteryEligible:false});
 if(!receipt)return {status:'unavailable',xp:0,crystals:0};
 return {status:firstDone?'repeat-success':'first-success',xp:receipt.xp||0,crystals:receipt.crystals||0};
}
function end(){
 typingResume();if(s.active)s.elapsed+=Math.floor((Date.now()-s.started)/1000);
 s.active=false;s.done=true;
 s.assessment=grade();
 s.reward=issueReward(s.assessment);
 s.completedAt=Date.now();s.badges=badges();try{localStorage.setItem(key+'-history',JSON.stringify([...history(),{...s,active:false}].slice(-30)))}catch(_){}
 persist();paint();
}
function close(){if(s.active&&s.mode!=='guided'&&!s.done){s.interrupted=true;end();}else pause();if(replay){replay.active=false;saveReplay();replay=null;}returnFocus?.focus();clearInterval(tick);document.getElementById('d756MeetingRoom')?.remove();}
function paint(){
 const root=document.getElementById('d756MeetingRoom');if(!root)return;
 let m=meter(),scene=activeScene(),people=peopleNow(),speaker=people[scene[0]],p=person();
 let stats='<p><strong>Meeting Compass</strong><small>Scripted branching dialogue · provisional rule-based practice indicators</small></p><div class="dmStats"><span>Stakeholder input <b>'+m.input+'/5</b></span><span>Clarifying follow-ups <b>'+m.clarify+'/3</b></span><span>Stakeholders named <b>'+m.stakeholders+'/3</b></span><span>Time <b id="dmTime">'+timer()+'</b></span></div>';
 let content='';
 if(replay?.active){content=replayView();}
 else if(s.repair){content=repairView();}
 else if(s.done){
 const assessment=s.assessment||grade(),receipt=s.reward||{status:'not-earned',xp:0,crystals:0};
 content='<h3>Rehearsal review</h3><p>Provisional practice indicators: rule and keyword checks, not a validated assessment or academic mastery.</p>'+stats+'<p><b>'+(assessment.passed?'Practice criteria met':'Practice criteria not yet met')+'</b></p><p>'+esc(receipt.status==='first-success'?'First successful meeting: +30 Scholar XP and +5 crystals':receipt.status==='repeat-success'?'Successful repeat: +8 Scholar XP and +1 crystal':receipt.status==='already-awarded'?'Today’s practice reward was already granted; no duplicate XP':receipt.status==='unavailable'?'Reward system unavailable; no XP granted':'No XP awarded until all criteria are satisfied')+'</p><ul>'+assessment.checks.map(x=>'<li>'+(x[1]?'✓ ':'○ ')+esc(x[0])+'</li>').join('')+'</ul><p>Automated rehearsal checks are not official Mursion evaluation or verified independent academic mastery. A repeat reward is available at most once per calendar day.</p><button data-action="reset">Practice again</button>'+replayChoices()+'<p>Cosmetic badges · no extra XP: '+esc((s.badges||[]).join(' · ')||'Keep practicing the Council skills')+'</p>'+s.assessment.checks.map(c=>'<details><summary>'+esc(c[0])+' — '+(c[1]?'Met':'Not met')+'</summary><p>'+esc(c[1]?'The transcript contains the practice indicators below.':'Review the transcript and add specific evidence for this requirement.')+'</p><p>'+esc(advice(c[0]))+'</p>'+evidenceFor(c[0]).map(r=>'<blockquote>'+esc(r.answer)+'</blockquote>').join('')+'</details>').join('');
 }else if(!s.active){
 content=(s.resumable?'<button data-action="resume">Resume saved meeting</button>':'')+'<p>Conduct a full meeting with stakeholder follow-ups and an end-of-meeting rubric check. Speak aloud before typing your response.</p><label for="dmProfile">Scenario</label><select id="dmProfile">'+Object.entries(profiles).map(([id,p])=>'<option value="'+id+'" '+(s.profile===id?'selected':'')+'>'+esc(p.student)+' — age '+p.age+(id==='angela'?' (WGU case)':' (fictional case)')+'</option>').join('')+'</select><p><small>Only Angela’s profile matches your official WGU assignment. The responsive writing-support dialogue is fictional practice, not new official case evidence. Other characters and ages are fictional practice variations.</small></p><label for="dmStoryline">Meeting conversation</label><select id="dmStoryline"><option value="standard">Core WGU IEP rehearsal</option><option value="classroom-writing" >Responsive classroom writing &amp; independence</option></select><label for="dmMode">Practice mode</label><select id="dmMode"><option value="guided" '+(s.mode==='guided'?'selected':'')+'>Guided coaching</option><option value="independent" '+(s.mode==='independent'?'selected':'')+'>Independent rehearsal</option><option value="challenge" '+(s.mode==='challenge'?'selected':'')+'>Final Council Trial · challenging meeting</option></select><label for="dmPacing">Meeting clock</label><select id="dmPacing"><option value="normal">Real-time meeting rehearsal</option><option value="typing" '+(s.pacing==='typing'?'selected':'')+'>Typing-friendly: pause the clock while composing</option></select><p><small>Typing-friendly pacing is for keyboard practice, not the official Mursion timer.</small></p><button data-action="start">Begin / restart full meeting</button>';
 }else{
 content='<div class="dmPeople">'+people.map((p,i)=>'<div class="dmPerson '+(i===scene[0]?'active':'')+'"><span class="dmFace">'+esc(p[0].split(' ').map(x=>x[0]).join(''))+'</span><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></div>').join('')+'</div>'+stats+'<p><small>'+(s.storyline==='classroom-writing'?'Responsive writing-support scenario · simulated stakeholder dialogue':'Core IEP scenario')+'</small></p><p><b>'+esc(councilPhases[phaseFor(s.step)])+' · Agenda '+(s.step+1)+' / 12'+(s.pending?' · Adaptive follow-up':'')+':</b> '+esc(localize(scenes[s.step][1]))+'</p>'+(s.mode==='challenge'&&[2,3,5,7,8,9,10].includes(s.step)?'<p class="dmCurveball">Curveball Card · '+esc(['Different perspectives','A voice needs space','Clarify the plan'][s.step%3])+'</p>':'')+'<div class="dmPrompt"><b>'+esc(speaker[0])+':</b><p>'+esc(localize(scene[2]))+'</p></div>'+(s.mode==='guided'?'<div class="dmHint"><small>Guided practice · optional coaching; coached turns are labeled.</small><button data-action="repair">Pause-and-Repair</button></div>':'')+coachedOptions()+'<label for="dmAnswer">Your spoken response (type or summarize it):</label><div class="dmSpeak"><button data-action="dictate" type="button">🎙 Dictate</button><small>Voice input requires browser support. Windows + H can also dictate into the box.</small></div><textarea id="dmAnswer" rows="4">'+esc(s.draft||'')+'</textarea><div class="dmBtns"><button data-action="submit">Submit response</button><button data-action="next">Continue agenda</button>'+(s.mode==='guided'?'<button data-action="back">Back / pause</button>':'')+'<button data-action="finish">Finish and review</button></div>'+(s.last&&s.mode==='guided'?'<div class="dmHint"><b>Feedback on previous turn</b><p>'+esc(s.last)+'</p></div>':'');
 }
 if(s.storageError)content+='<p role="alert">Browser storage is unavailable. Keep this meeting open; it cannot be resumed after reload.</p>';
 if(!s.active)content+='<details><summary>Previous attempts and earned rewards</summary>'+history().reverse().map((r,i)=>'<p>'+esc(profiles[r.profile]?.student)+' · '+esc(r.mode)+' · '+new Date(r.completedAt).toLocaleString()+' · '+esc(r.reward?.status)+' · '+(r.reward?.xp||0)+' XP, '+(r.reward?.crystals||0)+' crystals <button data-history="'+i+'">Review transcript</button></p>').join('')+'</details>';
 let transcript=s.records.length?'<details><summary>Practice transcript ('+s.records.length+' turns)</summary><div class="dmTranscript">'+s.records.map(x=>'<p><b>'+esc(x.speaker)+':</b> '+esc(x.line)+'</p><p><b>You:</b> '+esc(x.answer)+(x.assisted?' <small>Coached practice turn</small>':'')+'</p>').join('')+'</div></details>':'';
 root.innerHTML='<section class="dmPanel dmCouncil" role="dialog" aria-modal="true" aria-label="D756 meeting practice"><header><div><small>D756 · Hands-on Learning Studio · Task 2</small><h2>Council Chamber · '+esc(s.profile==='angela'?'WGU Angela Madina Practice Meeting':p.student+' — Fictional IEP Meeting Rehearsal')+'</h2></div><button data-action="close">Close ✕</button></header><div class="dmWorkspace"><aside class="dmReference" aria-label="IEP reference panel">'+caseCard()+'</aside><div class="dmBody">'+councilHeading()+'<details><summary>Meeting agenda</summary><ol>'+scenes.map((x,i)=>'<li'+(i===s.step?' aria-current="step"':'')+'>'+esc(localize(x[1]))+'</li>').join('')+'</ol></details>'+content+transcript+'<small>15–20 minutes is the Mursion target. Qualified rehearsals earn +30 XP and +5 crystals the first time; later qualifying practice earns +8 XP and +1 crystal, at most once a day. No mastery credit or official Mursion recording.</small></div></div></section>';
 root.querySelector('[data-action=close]').onclick=close;
 root.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const els=[...root.querySelectorAll('button,textarea,select,summary')].filter(x=>x.getClientRects().length&&!x.disabled);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
 root.querySelector('#dmAnswer, [data-action=resume], [data-action=start], [data-action=reset]')?.focus({preventScroll:true});
 root.querySelectorAll('[data-history]').forEach(b=>b.onclick=()=>{const r=history().reverse()[Number(b.dataset.history)];const area=document.createElement('section');area.innerHTML='<h3>Previous attempt transcript</h3>'+r.records.map(t=>'<p><b>'+esc(t.speaker)+':</b> '+esc(t.line)+'</p><blockquote>'+esc(t.answer)+'</blockquote>').join('');b.parentElement.after(area);b.disabled=true;});
 const start=root.querySelector('[data-action=start]');if(start)start.onclick=()=>{if(s.records.length&&!s.done){const old={...s,elapsed:elapsed(),active:false,completedAt:Date.now(),reward:{status:'abandoned',xp:0,crystals:0}};try{localStorage.setItem(key+'-history',JSON.stringify([...history(),old].slice(-30)))}catch(_){}}s={mode:root.querySelector('#dmMode').value,pacing:root.querySelector('#dmPacing').value,typingPausedAt:null,toneOpen:false,profile:root.querySelector('#dmProfile').value,storyline:root.querySelector('#dmProfile').value==='angela'?root.querySelector('#dmStoryline').value:'standard',step:0,records:[],draft:'',started:Date.now(),elapsed:0,active:true,done:false,last:'',pending:null,assessment:null,reward:null,variant:Math.floor(Math.random()*3),concernResolved:false};persist();paint();};
 root.querySelectorAll('[data-response-choice]').forEach(btn=>btn.onclick=()=>{const chosen=responseChoices()[Number(btn.dataset.responseChoice)],area=root.querySelector('#dmAnswer');if(area&&chosen){area.value=chosen;s.draft=chosen;s.assistedStage=true;persist();area.focus();}});
 const dictate=root.querySelector('[data-action=dictate]');if(dictate)dictate.onclick=()=>{const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){alert('Voice recognition is unavailable. On Windows use Win + H when the response box is focused.');return;}const recog=new Speech();recog.lang='en-US';recog.onresult=e=>{const area=root.querySelector('#dmAnswer');if(!area)return;area.value=(area.value.trim()?area.value.trim()+' ':'')+Array.from(e.results).map(r=>r[0].transcript).join(' ');s.draft=area.value;persist();};recog.onend=()=>{dictate.textContent='🎙 Dictate';};recog.onerror=()=>{dictate.textContent='🎙 Dictate';};dictate.textContent='Listening…';recog.start();};
 const submit=root.querySelector('[data-action=submit]');if(submit)submit.onclick=()=>{
 let el=root.querySelector('#dmAnswer'),a=el.value.trim();if(!a){el.focus();return;}
 if(!meaningfulResponse(a)){el.setCustomValidity('Use a complete, specific invitation or a professional explanation of at least ten words; avoid repeating an earlier response.');el.reportValidity();return;}
 commitTurn(a,s.assistedStage===true);
};
 const answer=root.querySelector('#dmAnswer');if(answer){answer.onfocus=typingPause;answer.onblur=typingResume;answer.oninput=()=>{s.draft=answer.value;answer.setCustomValidity('');persist();};}
 const next=root.querySelector('[data-action=next]');if(next)next.onclick=()=>{if(s.awaitingReply){s.last='Respond to the stakeholder’s latest statement before continuing.';paint();return;}if(s.step===7&&!s.concernResolved){s.last='The family concern is unresolved. Acknowledge it, center student preferences and propose a collaborative comparison.';paint();return;}if(!s.records.some(r=>r.stage===s.step&&r.valid))return;s.pending=null;s.reply=null;s.step++;s.assistedStage=false;s.draft='';if(s.step>=12)end();else{persist();paint();}};
 const resume=root.querySelector('[data-action=resume]');if(resume)resume.onclick=()=>{s.active=true;s.started=Date.now();s.resumable=false;paint();};
 const repair=root.querySelector('[data-action=repair]');if(repair)repair.onclick=()=>{if(s.mode!=='guided')return;const scene=activeScene();pause();s.resumable=false;s.assistedStage=true;s.repair={line:localize(scene[2]),reason:s.pending?'The stakeholder has raised a question or concern. Reflect its specific meaning and address it before continuing.':'Check whose voice is missing and whether the response explains the case in family-friendly language.',starter:s.step===7?'I hear your concern. What is worrying you most about the student’s preferred pathway?':'I hear what you are saying about ____. Let us review ____ and agree who will follow up.'};persist();paint();};
 const repairSubmit=root.querySelector('[data-action=repair-submit]');if(repairSubmit)repairSubmit.onclick=()=>{const el=root.querySelector('#dmRepairAnswer'),a=el.value.trim();if(!meaningfulResponse(a)){el.setCustomValidity('Offer a complete, specific revised reply. Original evidence will be retained.');el.reportValidity();return;}s.repair=null;s.active=true;s.started=Date.now();commitTurn(a,true);};
 const repairCancel=root.querySelector('[data-action=repair-cancel]');if(repairCancel)repairCancel.onclick=()=>{s.repair=null;s.active=true;s.started=Date.now();persist();paint();};
 const replayStart=root.querySelector('[data-action=replay-start]');root.querySelectorAll('[data-replay-choice]').forEach(box=>box.onchange=()=>{const n=root.querySelectorAll('[data-replay-choice]:checked').length;replayStart.disabled=n<2||n>3;});if(replayStart)replayStart.onclick=()=>{const chosen=[...root.querySelectorAll('[data-replay-choice]:checked')].map(x=>Number(x.dataset.replayChoice));if(chosen.length<2||chosen.length>3)return;replay={active:true,sourceAttempt:s.completedAt,profile:s.profile,index:0,records:[],queue:chosen.map((i,n)=>({record:{...s.records[i]},variant:replayVariant(s.records[i],(s.variant||0)+n+1)}))};saveReplay();paint();};
 const replaySubmit=root.querySelector('[data-action=replay-submit]');if(replaySubmit)replaySubmit.onclick=()=>{const el=root.querySelector('#dmReplayAnswer'),a=el.value.trim();if(a.split(/\s+/).length<10){el.setCustomValidity('Rehearse a specific professional response of at least ten words.');el.reportValidity();return;}replay.records.push({index:replay.index,prompt:replay.queue[replay.index].variant,answer:a,assisted:true,at:Date.now()});replay.feedback='Practice indicator: '+(addressesPending(a,{line:replay.queue[replay.index].variant})?'your reply addresses this topic. Consider a specific responsibility and review point.':'name the actual concern and propose an evidence-based next action.')+' Your original report and reward remain unchanged.';saveReplay();paint();};
 const replayNext=root.querySelector('[data-action=replay-next]');if(replayNext)replayNext.onclick=()=>{replay.index++;replay.feedback='';saveReplay();paint();};
 const replayExit=root.querySelector('[data-action=replay-exit]');if(replayExit)replayExit.onclick=()=>{replay.active=false;saveReplay();replay=null;paint();};
 const back=root.querySelector('[data-action=back]');if(back)back.onclick=()=>{pause();paint();};
 const finish=root.querySelector('[data-action=finish]');if(finish)finish.onclick=end;
 const reset=root.querySelector('[data-action=reset]');if(reset)reset.onclick=()=>{s={mode:s.mode,pacing:s.pacing,storyline:s.storyline,toneOpen:false,profile:s.profile,step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null,assessment:null,reward:null,variant:Math.floor(Math.random()*3),concernResolved:false};persist();paint();};
}

const d756KnowledgeItems=[
 {topic:'Family partnership',prompt:'During an IEP meeting, Elena says she often leaves confused about what was decided. What is the strongest response?',choices:[
  'Tell Elena the team will send the paperwork and continue.',
  'Explain the meeting purpose, check which decisions confused Elena previously, and invite her priorities.',
  'Ask whether anyone has any questions and move to annual goals.'
 ],correct:1,why:'A productive response validates the concern, clarifies its meaning, and shares decision-making. Generic “Any questions?” is not one of the required substantive input or clarifying questions.'},
 {topic:'Student voice and accommodations',prompt:'Angela says frequent desk-side reminders embarrass her. What should the team try first?',choices:[
  'Remove all reminders immediately so she becomes independent.',
  'Require Angela to ask for help publicly every time.',
  'Ask Angela what private signals or digital checklists work for her and monitor independent initiation.'
 ],correct:2,why:'Angela’s own preference matters. A discreet signal and optional organizer can support access while the team tracks progress; independence does not mean removing useful accommodations.'},
 {topic:'Measuring independence',prompt:'Mr. Moore asks whether finishing an assignment after four adult prompts counts as independent initiation. What data are most useful?',choices:[
  'Time on task, prompt count, independent start, work quality, and completion across several observations.',
  'Only the final grade on the assignment.',
  'Whether Angela finishes the work before the bell on one day.'
 ],correct:0,why:'Use repeated, observable data to distinguish starting independently from completing work with adult support. Keep accommodations separate from judgments about mastery.'},
 {topic:'Annual goals',prompt:'Which explanation makes an annual IEP goal understandable to the family?',choices:[
  'Angela will become a much stronger writer this year.',
  'The goal describes what Angela will do, the success criterion, how progress is measured, and when it is checked.',
  'The goal uses technical terminology because specialists understand it.'
 ],correct:1,why:'A measurable goal names the skill, conditions or supports when relevant, how success is determined, and the monitoring evidence. Plain-language explanation promotes family participation.'},
 {topic:'Clarifying follow-up',prompt:'Elena says she worries about taking away supports before Angela is ready. Which question truly clarifies her concern?',choices:[
  'Does anyone have any questions?',
  'Do we all agree on the plan?',
  'Elena, when you say “before she is ready,” which tasks or recent experiences concern you most?'
 ],correct:2,why:'A real clarifying follow-up refers to something the stakeholder said and seeks a more precise meaning or example.'},
 {topic:'Professional response repair',prompt:'A teacher says, “Angela is just lazy about writing.” What is the best facilitation response?',choices:[
  'Ask the team to describe specific initiation barriers and work samples, affirm Angela’s efforts, and discuss helpful supports.',
  'Agree so the team can finish within 20 minutes.',
  'Ignore the statement to avoid embarrassing anyone.'
 ],correct:0,why:'Replace labels with observable learning needs. Protect the student’s dignity, invite her voice and plan supports. If your own language caused harm, acknowledge and repair it.'}
];
let checkState={index:0,selected:null,score:0};
function checkPaint(){
 const box=document.getElementById('d756QuickCheck');if(!box)return;
 const q=d756KnowledgeItems[checkState.index],done=checkState.index>=d756KnowledgeItems.length;
 if(done){box.innerHTML='<section class="dmCheckPanel" role="dialog" aria-modal="true" aria-label="D756 knowledge check"><header><h2>IEP Communication Knowledge Check</h2><button data-kclose>Close ✕</button></header><h3>Practice complete</h3><p>'+checkState.score+' / '+d756KnowledgeItems.length+' decisions correct.</p><p>These are fictional rehearsal items with coaching, not an official WGU OA or verified independent mastery. No XP or crystals awarded.</p><button data-krestart>Practice again</button></section>';box.querySelector('[data-krestart]').onclick=()=>{checkState={index:0,selected:null,score:0};checkPaint()};box.querySelector('[data-kclose]').onclick=()=>box.remove();return;}
 box.innerHTML='<section class="dmCheckPanel" role="dialog" aria-modal="true" aria-label="D756 knowledge check"><header><div><small>D756 · scenario-based practice</small><h2>IEP Communication Knowledge Check</h2></div><button data-kclose>Close ✕</button></header><div class="dmCheckBody"><p><strong>Question '+(checkState.index+1)+' / '+d756KnowledgeItems.length+'</strong> · '+esc(q.topic)+'</p><h3>'+esc(q.prompt)+'</h3><div class="dmCheckOptions">'+q.choices.map((answer,i)=>'<button type="button" data-kanswer="'+i+'" '+(checkState.selected!==null?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+esc(answer)+'</button>').join('')+'</div>'+(checkState.selected!==null?'<div role="status" class="dmCheckFeedback"><b>'+(checkState.selected===q.correct?'Correct decision':'Needs revision')+'</b><p>'+esc(q.why)+'</p><p>Best response: '+esc(q.choices[q.correct])+'</p><button data-knext>'+(checkState.index+1===d756KnowledgeItems.length?'View results':'Next situation')+'</button></div>':'<p>Choose the most supportive, accurate response. You will receive specific feedback after submitting.</p>')+'</div></section>';
 box.querySelector('[data-kclose]').onclick=()=>box.remove();
 box.querySelectorAll('[data-kanswer]').forEach(b=>b.onclick=()=>{if(checkState.selected!==null)return;checkState.selected=Number(b.dataset.kanswer);if(checkState.selected===q.correct)checkState.score++;checkPaint()});
 const next=box.querySelector('[data-knext]');if(next)next.onclick=()=>{checkState.index++;checkState.selected=null;checkPaint()};
}
function openKnowledgeCheck(){
 if(window.S?.activeCourse!=='D756'){alert('Select the D756 course before starting the knowledge check.');return;}
 document.getElementById('d756QuickCheck')?.remove();
 const box=document.createElement('div');box.id='d756QuickCheck';document.body.append(box);
 checkState={index:0,selected:null,score:0};checkPaint();
}
function openReference(){
 open();const panel=document.querySelector('#d756MeetingRoom .dmGlance');if(panel)panel.open=true;
}

function open(){returnFocus=document.activeElement;
 if(window.S?.activeCourse!=='D756'){alert('Select the D756 course first.');return;}
 if(!document.getElementById('d756MeetingRoom')){let root=document.createElement('div');root.id='d756MeetingRoom';document.body.append(root);}
 paint();clearInterval(tick);tick=setInterval(()=>{let x=document.getElementById('dmTime');if(x&&s.active)x.textContent=timer();},1000);
}
let style=document.createElement('style');style.textContent='#d756MeetingRoom{position:fixed;inset:0;z-index:1500;background:#110c18df;display:grid;place-items:center;padding:12px;color:#fff4e7}#d756MeetingRoom .dmPanel{background:#23182e;border:2px solid #c9a56b;border-radius:18px;width:min(1000px,100%);max-height:95vh;overflow:auto;padding:20px}#d756MeetingRoom header,#d756MeetingRoom .dmBtns,#d756MeetingRoom .dmStats{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin:12px 0}#d756MeetingRoom h2,#d756MeetingRoom h3{color:#f6d89c}#d756MeetingRoom button,#d756MeetingRoom select{background:#533c58;color:#fff3e2;border:1px solid #c8aa78;padding:10px;border-radius:9px;cursor:pointer}#d756MeetingRoom button:focus-visible,#d756MeetingRoom textarea:focus-visible{outline:3px solid #ffdc95}#d756MeetingRoom textarea{display:block;width:100%;font:inherit;background:#fffaf4;color:#211526;border-radius:10px;padding:12px;margin:9px 0}#d756MeetingRoom .dmPeople{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}#d756MeetingRoom .dmPerson{background:#35263e;border:1px solid #7e6878;border-radius:10px;text-align:center;padding:10px;font-size:13px}#d756MeetingRoom .dmPerson.active{border-color:#f4c77d}#d756MeetingRoom .dmFace{display:block;margin:0 auto 5px;background:#6f5069;border-radius:50%;padding:12px;width:48px}#d756MeetingRoom small{display:block;opacity:.85}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{background:#3d2c45;border-left:4px solid #dbb77c;padding:12px;border-radius:8px;margin:12px 0}#d756MeetingRoom .dmStats span{border:1px solid #987a94;border-radius:18px;padding:7px}#d756MeetingRoom .dmTranscript{overflow:visible}@media(max-width:600px){#d756MeetingRoom .dmPanel{padding:12px}#d756MeetingRoom .dmPeople{grid-template-columns:repeat(2,1fr)}}';style.textContent+='#d756MeetingRoom *{box-sizing:border-box}#d756MeetingRoom select:focus-visible{outline:3px solid #ffdc95}';style.textContent+='#d756MeetingRoom select{display:block;max-width:100%;margin:6px 0 16px}#d756MeetingRoom .dmPanel{line-height:1.5}';style.textContent+='#d756MeetingRoom header{align-items:flex-start}#d756MeetingRoom header>div{flex:1;min-width:0}#d756MeetingRoom h2{margin:8px 0}#d756MeetingRoom .dmPerson:nth-child(2) .dmFace{background:#405b57}#d756MeetingRoom .dmPerson:nth-child(3) .dmFace{background:#66582e}#d756MeetingRoom .dmPerson:nth-child(4) .dmFace{background:#475170}#d756MeetingRoom #dmAnswer{background:#fffaf4!important;color:#211526!important}@media(max-width:600px){#d756MeetingRoom header{margin:0 0 8px;gap:6px}#d756MeetingRoom h2{font-size:19px;line-height:1.3}#d756MeetingRoom header small{font-size:10px}#d756MeetingRoom header button{padding:7px;font-size:12px}#d756MeetingRoom .dmPerson{padding:5px;font-size:11px}#d756MeetingRoom .dmFace{display:none}#d756MeetingRoom .dmStats{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}#d756MeetingRoom .dmStats span{padding:5px;font-size:11px}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{padding:8px;margin:8px 0}#d756MeetingRoom .dmPrompt p,#d756MeetingRoom .dmHint p{margin:5px 0}#d756MeetingRoom #dmAnswer{height:100px}#d756MeetingRoom .dmPanel{font-size:14px}}';style.textContent+='#d756MeetingRoom .dmPanel{width:min(1500px,100%);height:min(95dvh,1050px);max-height:95dvh;overflow:hidden;display:flex;flex-direction:column}#d756MeetingRoom .dmPanel>header{flex:0 0 auto;align-items:center;margin:0 0 10px;padding:0 0 8px;border-bottom:1px solid #876d75}#d756MeetingRoom .dmPanel>header button{flex:0 0 auto}#d756MeetingRoom .dmWorkspace{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,32%);grid-template-areas:"body reference";gap:12px;overflow:hidden}#d756MeetingRoom .dmReference{grid-area:reference;overflow:auto;border:1px solid #8d7390;border-radius:12px;padding:12px;background:#30213a;min-height:0}#d756MeetingRoom .dmBody{grid-area:body;min-height:0;overflow:auto;padding-right:8px}#d756MeetingRoom .dmGlance{font-size:14px}#d756MeetingRoom .dmGlance summary{font-weight:800;color:#ffe0a3;cursor:pointer;position:sticky;top:0;background:#30213a;padding:10px 0;z-index:1}#d756MeetingRoom .dmGlance [data-goal]{border-top:1px solid #725b78;padding-top:10px}#d756MeetingRoom .dmBtns{gap:8px;justify-content:flex-start}#d756MeetingRoom .dmBtns button{flex:1 1 155px}@media(max-width:850px){#d756MeetingRoom .dmWorkspace{display:flex;flex-direction:column;overflow:auto}#d756MeetingRoom .dmReference{flex:0 0 auto;overflow:visible}#d756MeetingRoom .dmBody{flex:0 0 auto;overflow:visible;padding:0}#d756MeetingRoom .dmPanel{padding:12px}#d756MeetingRoom .dmPanel>header{position:sticky;top:0;background:#23182e;z-index:5}}';style.textContent+='#d756MeetingRoom .dmChoices{padding:12px;margin:12px 0;border:1px solid #9379a0;border-radius:12px;background:#352640}#d756MeetingRoom .dmChoices p{font-size:13px;margin:4px 0 10px}#d756MeetingRoom .dmChoiceList{display:grid;gap:8px}#d756MeetingRoom .dmChoiceList button{text-align:left;line-height:1.45;background:#4e3857}#d756MeetingRoom .dmSpeak{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:8px 0}';style.textContent+='#d756QuickCheck{position:fixed;inset:0;z-index:1700;background:#110c18e8;display:grid;place-items:center;padding:12px;color:#fff4e7}#d756QuickCheck .dmCheckPanel{width:min(800px,100%);max-height:95dvh;overflow:auto;padding:20px;background:#24182f;border:2px solid #d9b47c;border-radius:16px}#d756QuickCheck header{display:flex;justify-content:space-between;align-items:center;gap:12px}#d756QuickCheck h2,#d756QuickCheck h3{color:#f6d89c}#d756QuickCheck button{border:1px solid #c8aa78;border-radius:9px;padding:12px;background:#533c58;color:#fff3e2;cursor:pointer}#d756QuickCheck .dmCheckOptions{display:grid;gap:10px}#d756QuickCheck .dmCheckOptions button{text-align:left}#d756QuickCheck .dmCheckFeedback{background:#382b44;padding:15px;border-radius:10px;margin-top:14px;line-height:1.5}';document.head.append(style);
function attach(){return !!document.getElementById('d756Task2Launch')}
setInterval(()=>{if(s.active)persist()},5000);
if(new URLSearchParams(location.search).get('room')==='council'){let attempts=0;const launch=setInterval(()=>{if(++attempts>100){clearInterval(launch);return;}if(window.S&&window.switchCourse&&window.MajickHandsOnStudio){clearInterval(launch);window.switchCourse('D756');window.MajickHandsOnStudio.refresh();window.MajickHandsOnStudio.open();open();}},100);}
window.MajickD756Meeting={version:'2.1-council',open,openReference,openKnowledgeCheck,close,refresh:attach,summary:meter,assessment:grade,profiles:()=>Object.keys(profiles)};
})();