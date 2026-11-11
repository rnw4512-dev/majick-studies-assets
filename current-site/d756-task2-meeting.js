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
function caseCard(){const p=person(),d=iepDetails[s.profile];return '<details class="dmGlance" '+(!s.active?'open':'')+'><summary>IEP at a Glance — '+esc(s.profile==='angela'?'WGU Angela Madina Practice Meeting':p.student+' · fictional IEP')+'</summary><p><b>'+esc(p.student)+'</b> · Age '+p.age+' · Grade '+p.grade+' · Interest: '+esc(p.career)+'</p><p><b>Strengths:</b> '+esc(p.strengths)+'</p><p><b>Needs:</b> '+esc(p.needs)+'</p><p><b>Present levels:</b> '+esc(d.baseline)+'</p>'+p.goals.map(g=>'<p data-goal><b>'+esc(g[0])+':</b> '+esc(g[1])+'</p>').join('')+'<p><b>Supports:</b> '+esc(p.supports)+'</p><p><b>Progress monitoring:</b> '+esc(d.monitor)+'</p><p><b>Education and employment:</b> '+esc(p.transition)+'</p><p><b>Team responsibilities:</b> '+esc(d.roles)+'</p></details>'}


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
'Reading: infer and cite two details, 4/5 rubric points across four of five consecutive assessments. Ask Elena what she sees at home.',
'Ask Angela how writing, visual checklists and private feedback could help.',
'Writing: three-paragraph response, 8/10 on 4/5 samples; executive function: initiate within five minutes, complete 3–5 steps, self-check on four of five opportunities across three consecutive weeks.',
'Weekly reading checks, writing samples every two weeks, classroom task logs, quarterly family reporting.',
'Postsecondary goal: associate-degree graphic design program; compare three programs and practice self-advocacy.',
'Acknowledge Elena’s concern. Center Angela’s choice. Explore practical connections between art, math, technology and business.',
'Explain three paragraphs as scaffold, not permanent limit on grade-level five-paragraph expectations.',
'Assign student, counselor, ELA and special educator next steps; ask for questions.',
'Reflect Angela’s stated preferences and invite concrete suggestions.',
'Review agreement, solicit questions for clarification, thank each participant.'
];
let s={mode:'guided',profile:'angela',step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null},tick,returnFocus;
try{let saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.mode)s={...s,...saved,active:false,resumable:!saved.done&&(saved.resumable||saved.elapsed>0||saved.records?.length>0||!!saved.draft)};}catch(_){}
function elapsed(){return s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0)}
function persist(){try{localStorage.setItem(key,JSON.stringify({...s,elapsed:elapsed(),started:0,active:false}));}catch(_){s.storageError=true;}}
function history(){try{return JSON.parse(localStorage.getItem(key+'-history')||'[]')}catch(_){return []}}
function pause(){const draft=document.getElementById('dmAnswer');if(draft)s.draft=draft.value;if(s.active){s.elapsed=elapsed();s.active=false;s.resumable=true;}persist();}
window.addEventListener('pagehide',pause);
function norm(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function indicators(a){const t=a.toLowerCase();const question=/[?]/.test(t)||/^please (share|tell|ask)/.test(t);const clarify=question&&/(any|what|which|do you have|does anyone have|please ask).{0,45}(questions?|clarification)|what.{0,25}(unclear|clarify)/.test(t);const input=question&&!clarify&&/(share|thought|input|perspective|feel|concern|suggest|prefer|notice|ideas|what would|what do you|what are your|tell us|tell me|how do you|describe|observe|think|what.*after graduation|what.{0,30}(want|hope|plan|interest|goal)|how.{0,40}(doing|perform|class|work|progress)|tell (me|us))/.test(t);const who=peopleNow().map((p,i)=>({i,match:p[0].toLowerCase().split(' ').filter(n=>n.length>2&&!['mr.','ms.','mrs.','dr.'].includes(n)).some(n=>new RegExp('\\b'+n+'\\b').test(t))})).filter(x=>x.match).sort((a,b)=>{const first=i=>Math.min(...peopleNow()[i][0].toLowerCase().split(' ').filter(n=>n.length>2&&!['mr.','ms.','mrs.','dr.'].includes(n)).map(n=>t.indexOf(n)).filter(n=>n>=0));return first(a.i)-first(b.i)}).slice(0,1).map(x=>x.i);return {input,clarify,who};}

function meter(){let input=0,clarify=0,who=new Set(),seen=new Set();for(const r of s.records){if(!r.valid||seen.has(norm(r.answer)))continue;seen.add(norm(r.answer));const i=indicators(r.answer);if(i.input){input++;i.who.filter(x=>[0,1,3].includes(x)).forEach(x=>who.add(x));}if(i.clarify)clarify++;}return {input,clarify,stakeholders:who.size,turns:s.records.length};}
function activeScene(){if(s.reply&&!s.pending)return s.reply;if(s.pending)return [s.pending.who,'Follow-up question',s.pending.line];if(s.mode==='challenge'){const p=person(),complications={2:[0,'I disagree with this proposed goal. Why is it appropriate for my child?'],3:[1,'I feel unheard when adults choose my supports without asking me.'],5:[0,'Sorry to interrupt. Does meeting one rubric score mean all support ends?'],7:[0,'I prefer '+p.option+'; '+p.career+' worries me financially.'],8:[3,'I question whether we can implement these accommodations during every classroom lesson.'],9:[2,'We have four minutes left. How will we preserve time for student voice and next steps?'],10:[3,'If progress stalls, what evidence would lead us to revise the teaching approach?']};if(complications[s.step])return [complications[s.step][0],"Meeting complication",complications[s.step][1]];}let scene=[...scenes[Math.min(s.step,11)]];if(s.profile!=='angela'){const p=person();const lines={1:p.strengths+'. We need support with '+p.needs+'.',3:p.supports+' Which supports can I help choose?',4:'How will we measure these goals? '+p.goals.map(g=>g[1]).join(' '),7:'I want to understand the costs and employment prospects for '+p.career+'. Can we compare that pathway with '+p.option+' while hearing the student’s view?',8:'How can we make these supports practical in our classroom?'};scene[2]=lines[s.step]||scene[2];}return scene;}
function followUp(a,step){const t=a.toLowerCase(),p=person(),i=indicators(a);const future=/after|graduat|college|postsecondary|career|future|interest|want.{0,20}do/i.test(t)||(step>=6&&!/support|help|accommod|class|work|writing|reading/i.test(t));
 if(i.clarify)return {who:0,line:['How will you tell us whether progress is on track?','Does meeting the goal mean supports stop immediately?','Who should I contact if we need to review the plan?'][(s.records.length+s.variant)%3],kind:'question'};
 if(i.input){const who=i.who.length?i.who[0]:[1,0,3][(s.records.length+s.variant)%3];const lines={
  0:!future?['At home, getting started is difficult. Can we coordinate a routine?', 'I would like regular updates with examples of the work.']:['I worry about financial stability. How can we compare career options?', 'I want to support this choice and understand the training costs.'],
  1:!future?['I want to choose which supports help me. '+p.supports,'Private feedback helps me stay confident. Please ask me before changing my plan.']:['I want to pursue '+p.career+'. '+p.transition,'My preference is '+p.career+'. I feel unheard when that interest is dismissed. Can we explore my preference?'],
  3:['In class, I notice strengths in '+p.strengths+'. '+p.needs+'.','I notice difficulty with '+p.needs+'. I can collect classroom work samples, but need a practical schedule for these supports.'],
  2:['We can coordinate resources. Who will take responsibility for the follow-up?']};return {who,line:lines[who][(s.records.length+s.variant)%lines[who].length],kind:'input'};
 }
 if(step===7&&!s.concernResolved)return {who:0,line:'I am still concerned about career security. Please acknowledge that concern, invite the student’s choice and propose how we can compare practical options together.',kind:'concern'};
 return null;
}
function addressesPending(answer,pending){if(!pending)return true;const t=pending.line.toLowerCase();if(/progress|rubric|updates|measure|score|support ends/.test(t))return /data|progress|rubric|sample|measure|report|review|support|continue/i.test(answer);if(/career|financial|cost|training|college/.test(t))return /career|cost|education|training|college|employ|explore|compare|choice/i.test(answer);if(/unheard|choice|dismiss|prefer/.test(t))return /hear|voice|choice|prefer|ask|listen|student/i.test(answer);if(/class|support|routine|feedback|organize|planner/.test(t))return /support|routine|model|plan|organ|feedback|strategy|strategies|schedule|checklist/i.test(answer);return /review|plan|coordinate|responsib|follow.up|contact|teach|data|support|clarif/i.test(answer);}
function resolves(a){return /(hear|understand|appreciate|concern|worr)/i.test(a)&&/(choice|prefer|want|voice)/i.test(a)&&/(compare|explore|together|research|options)/i.test(a)}
function timer(){let n=s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function goalEvidence(){const rules={
angela:[[/inferen/i,/two|2/i,/detail/i,/connect|explain/i,/4\s*\/\s*5|four.{0,8}five/i,/consecutive/i], [/three|3/i,/paragraph/i,/detail/i,/transition/i,/conclusion/i,/8\s*\/\s*10|eight.{0,8}ten/i,/four.{0,8}five|4\s*\/\s*5/i], [/five minutes|5 minutes/i,/three.{0,8}five|3.{0,3}5/i,/check/i,/four.{0,8}five|4\s*\/\s*5/i,/three consecutive weeks|3 consecutive weeks/i]],
maya:[[/term|vocab/i,/eight|8/i,/ten|10/i,/four|4/i,/weekly/i], [/storyboard|rationale/i,/claim/i,/three|3/i,/9\s*\/\s*12|nine.{0,8}twelve/i,/four|4/i], [/milestone/i,/four|4/i,/deadline/i,/five|5/i,/semester/i]],
jordan:[[/source/i,/two|2/i,/three|3/i,/5\s*\/\s*6|five.{0,8}six/i,/biweekly/i], [/proposal/i,/audience/i,/scope/i,/timeline/i,/revision/i,/10\s*\/\s*12|ten.{0,8}twelve/i,/four|4/i], [/accessibility/i,/checklist/i,/four|4/i,/five|5/i,/three consecutive|3 consecutive/i]]};return rules[s.profile||'angela'].map(group=>s.records.filter(r=>r.valid&&group.every(rx=>rx.test(r.answer))));}
function grade(){
 const m=meter(),responses=s.records.map(x=>x.answer.trim()),all=responses.join(' ').toLowerCase();
 const duration=s.elapsed+(s.active?Math.floor((Date.now()-s.started)/1000):0);
 const goals=/(reading|comprehension|inferen)/.test(all)&&/(writing|paragraph|written expression)/.test(all)&&/(executive|organiza|multi.step|task initiation|checklist)/.test(all);
 const transition=(all.includes(person().career)||/(design|art|creative)/.test(all))&&/(college|postsecondary|degree|training)/.test(all)&&/(employ|career|job|workplace)/.test(all);
 const respect=s.concernResolved===true;
 const nontrivial=s.records.filter(x=>x.valid).length>=12;
 const distinct=new Set(responses.map(x=>x.toLowerCase().replace(/\s+/g,' '))).size===responses.length;
 const checks=[
  ['All 12 core meeting stages completed',s.step>=12&&new Set(s.records.filter(x=>x.valid).map(x=>x.stage)).size===12],
  ['At least five separate stakeholder input invitations',m.input>=5],
  ['At least three separate clarification invitations',m.clarify>=3],
  ['Student, parent and general education teacher directly invited to contribute',m.stakeholders>=3],
  ['All three annual goal areas discussed',goals],
  ['Postsecondary education and employment discussed',transition],
  ['Family concern acknowledged and choices considered',respect],
  ['Meaningful, non-repeated responses throughout',nontrivial&&distinct],
  ['Strengths and needs explained',s.records.some(r=>r.valid&&/(strength|math|art|coding|storytelling)/i.test(r.answer))&&s.records.some(r=>r.valid&&/(need|support|challenge|difficult)/i.test(r.answer))],
  ['Progress monitoring and family updates',s.records.some(r=>r.valid&&/(monitor|probe|sample|log|data)/i.test(r.answer)&&/(weekly|quarter|report|update|every|family)/i.test(r.answer))],
  ['Next steps and professional closing',s.records.some(r=>r.stage===11&&r.valid&&/(next|follow.up|responsib)/i.test(r.answer)&&/(thank|adjourn|close)/i.test(r.answer))],
  ['All three measurable goal criteria explained',goalEvidence().every(x=>x.length>0)],
  ['Meeting lasted at least 15 and no more than 20 minutes',duration>=900&&duration<=1200]
 ];
 return {passed:checks.every(x=>x[1]),checks,duration};
}
function advice(label){if(/clarification/i.test(label))return 'Invite questions at three distinct points. Example: “What questions do you have about how we will measure progress?”';if(/input|invited/i.test(label))return 'Ask for ideas on five separate turns and directly address the student, parent and teacher. Example: “'+person().student.split(' ')[0]+', what would help you start your work?”';if(/goal/i.test(label))return 'Explain each behavior, measurement, threshold and consistency period from this case reference. Example: “'+person().goals[0][1]+'”';if(/closing/i.test(label))return 'Assign responsibilities and a review time, then thank the team. Example: “Next, I will share the plan and meet with you in four weeks to review data. Thank you for your ideas.”';if(/monitor/i.test(label))return 'Name the evidence, collection schedule and family reporting schedule. Example: “We will collect weekly work samples and share progress reports each quarter.”';if(/Postsecondary/i.test(label))return person().transition;if(/concern/i.test(label))return 'Reflect the actual concern and preserve student choice. Example: “I hear your concern about career security. Let us explore training costs and employment options together while honoring the student’s preference.”';if(/lasted/i.test(label))return 'Complete a 15–20-minute active rehearsal; Back and Close pause the clock. Time alone never earns a reward.';return 'Use the agenda and transcript to identify an omitted topic; give a specific explanation and invite a relevant stakeholder response.';}
function evidenceFor(label){
 const rows=s.records.filter(r=>r.valid);
 if(/measurable goal/.test(label))return [...new Set(goalEvidence().flat())];
 let matches;
 if(/12 core/.test(label))matches=rows.filter((r,i)=>rows.findIndex(x=>x.stage===r.stage)===i);
 else if(/input invitations/.test(label))matches=rows.filter(r=>indicators(r.answer).input);
 else if(/clarification invitations/.test(label))matches=rows.filter(r=>indicators(r.answer).clarify);
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
 if(!result.passed||s.retryOnly)return {status:'not-earned',xp:0,crystals:0};
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
 if(s.active)s.elapsed+=Math.floor((Date.now()-s.started)/1000);
 s.active=false;s.done=true;
 s.assessment=grade();
 s.reward=issueReward(s.assessment);
 s.completedAt=Date.now();try{localStorage.setItem(key+'-history',JSON.stringify([...history(),{...s,active:false}].slice(-30)))}catch(_){}
 persist();paint();
}
function close(){pause();returnFocus?.focus();clearInterval(tick);document.getElementById('d756MeetingRoom')?.remove();}
function paint(){
 const root=document.getElementById('d756MeetingRoom');if(!root)return;
 let m=meter(),scene=activeScene(),people=peopleNow(),speaker=people[scene[0]],p=person();
 let stats='<p><small>Scripted branching dialogue · provisional rule-based practice indicators</small></p><div class="dmStats"><span>Stakeholder input <b>'+m.input+'/5</b></span><span>Clarification prompts <b>'+m.clarify+'/3</b></span><span>Stakeholders named <b>'+m.stakeholders+'/3</b></span><span>Time <b id="dmTime">'+timer()+'</b></span></div>';
 let content='';
 if(s.done){
 const assessment=s.assessment||grade(),receipt=s.reward||{status:'not-earned',xp:0,crystals:0};
 content='<h3>Rehearsal review</h3><p>Provisional practice indicators: rule and keyword checks, not a validated assessment or academic mastery.</p>'+stats+'<p><b>'+(assessment.passed?'Practice criteria met':'Practice criteria not yet met')+'</b></p><p>'+esc(receipt.status==='first-success'?'First successful meeting: +30 Scholar XP and +5 crystals':receipt.status==='repeat-success'?'Successful repeat: +8 Scholar XP and +1 crystal':receipt.status==='already-awarded'?'Today’s practice reward was already granted; no duplicate XP':receipt.status==='unavailable'?'Reward system unavailable; no XP granted':'No XP awarded until all criteria are satisfied')+'</p><ul>'+assessment.checks.map(x=>'<li>'+(x[1]?'✓ ':'○ ')+esc(x[0])+'</li>').join('')+'</ul><p>Automated rehearsal checks are not official Mursion evaluation or verified independent academic mastery. A repeat reward is available at most once per calendar day.</p><button data-action="reset">Practice again</button><button data-action="retry">Retry disagreement (no reward)</button>'+s.assessment.checks.map(c=>'<details><summary>'+esc(c[0])+' — '+(c[1]?'Met':'Not met')+'</summary><p>'+esc(c[1]?'The transcript contains the practice indicators below.':'Review the transcript and add specific evidence for this requirement.')+'</p><p>'+esc(advice(c[0]))+'</p>'+evidenceFor(c[0]).map(r=>'<blockquote>'+esc(r.answer)+'</blockquote>').join('')+'</details>').join('');
 }else if(!s.active){
 content=(s.resumable?'<button data-action="resume">Resume saved meeting</button>':'')+'<p>Conduct a full meeting with stakeholder follow-ups and an end-of-meeting rubric check. Speak aloud before typing your response.</p><label for="dmProfile">Scenario</label><select id="dmProfile">'+Object.entries(profiles).map(([id,p])=>'<option value="'+id+'" '+(s.profile===id?'selected':'')+'>'+esc(p.student)+' — age '+p.age+(id==='angela'?' (WGU case)':' (fictional case)')+'</option>').join('')+'</select><p><small>Only Angela’s profile matches your official WGU assignment. Other characters and ages are fictional practice variations.</small></p><label for="dmMode">Practice mode</label><select id="dmMode"><option value="guided" '+(s.mode==='guided'?'selected':'')+'>Guided coaching</option><option value="independent" '+(s.mode==='independent'?'selected':'')+'>Independent rehearsal</option><option value="challenge" '+(s.mode==='challenge'?'selected':'')+'>Challenging disagreements</option></select><button data-action="start">Begin / restart full meeting</button>';
 }else{
 content='<div class="dmPeople">'+people.map((p,i)=>'<div class="dmPerson '+(i===scene[0]?'active':'')+'"><span class="dmFace">'+esc(p[0].split(' ').map(x=>x[0]).join(''))+'</span><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></div>').join('')+'</div>'+stats+'<p><b>Stage '+(s.step+1)+' of 12'+(s.pending?' · Adaptive follow-up':'')+':</b> '+esc(localize(scenes[s.step][1]))+'</p><div class="dmPrompt"><b>'+esc(speaker[0])+':</b><p>'+esc(localize(scene[2]))+'</p></div>'+(s.mode==='guided'?'<div class="dmHint"><b>Coach</b><p>'+esc(s.profile==='angela'?localize(coaching[s.step]):'Use this case’s reference goals and supports. Invite the student and family to help choose next steps. Try: “What would help you participate?”')+'</p></div>':'')+'<label for="dmAnswer">Your spoken response (type or summarize it):</label><textarea id="dmAnswer" rows="5">'+esc(s.draft||'')+'</textarea><div class="dmBtns"><button data-action="submit">Submit response</button><button data-action="next">Continue agenda</button><button data-action="back">Back / pause</button><button data-action="finish">Finish and review</button></div>'+(s.last&&s.mode==='guided'?'<div class="dmHint"><b>Feedback on previous turn</b><p>'+esc(s.last)+'</p></div>':'');
 }
 if(s.storageError)content+='<p role="alert">Browser storage is unavailable. Keep this meeting open; it cannot be resumed after reload.</p>';
 if(!s.active)content+='<details><summary>Previous attempts and earned rewards</summary>'+history().reverse().map((r,i)=>'<p>'+esc(profiles[r.profile]?.student)+' · '+esc(r.mode)+' · '+new Date(r.completedAt).toLocaleString()+' · '+esc(r.reward?.status)+' · '+(r.reward?.xp||0)+' XP, '+(r.reward?.crystals||0)+' crystals <button data-history="'+i+'">Review transcript</button></p>').join('')+'</details>';
 let transcript=s.records.length?'<details><summary>Practice transcript ('+s.records.length+' turns)</summary><div class="dmTranscript">'+s.records.map(x=>'<p><b>'+esc(x.speaker)+':</b> '+esc(x.line)+'</p><p><b>You:</b> '+esc(x.answer)+'</p>').join('')+'</div></details>':'';
 root.innerHTML='<section class="dmPanel" role="dialog" aria-modal="true" aria-label="D756 meeting practice"><header><div><small>D756 · Hands-on Learning Studio · Task 2</small><h2>'+esc(s.profile==='angela'?'WGU Angela Madina Practice Meeting':p.student+' — Fictional IEP Meeting Rehearsal')+'</h2></div><button data-action="close">Close ✕</button></header>'+caseCard()+'<details><summary>Meeting agenda</summary><ol>'+scenes.map((x,i)=>'<li'+(i===s.step?' aria-current="step"':'')+'>'+esc(localize(x[1]))+'</li>').join('')+'</ol></details>'+content+transcript+'<small>15–20 minutes is the Mursion target. Qualified rehearsals earn +30 XP and +5 crystals the first time; later qualifying practice earns +8 XP and +1 crystal, at most once a day. No mastery credit or official Mursion recording.</small></section>';
 root.querySelector('[data-action=close]').onclick=close;
 root.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const els=[...root.querySelectorAll('button,textarea,select,summary')].filter(x=>x.getClientRects().length&&!x.disabled);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
 root.querySelector('#dmAnswer, [data-action=resume], [data-action=start], [data-action=reset]')?.focus({preventScroll:true});
 root.querySelectorAll('[data-history]').forEach(b=>b.onclick=()=>{const r=history().reverse()[Number(b.dataset.history)];const area=document.createElement('section');area.innerHTML='<h3>Previous attempt transcript</h3>'+r.records.map(t=>'<p><b>'+esc(t.speaker)+':</b> '+esc(t.line)+'</p><blockquote>'+esc(t.answer)+'</blockquote>').join('');b.parentElement.after(area);b.disabled=true;});
 const start=root.querySelector('[data-action=start]');if(start)start.onclick=()=>{if(s.records.length&&!s.done){const old={...s,elapsed:elapsed(),active:false,completedAt:Date.now(),reward:{status:'abandoned',xp:0,crystals:0}};try{localStorage.setItem(key+'-history',JSON.stringify([...history(),old].slice(-30)))}catch(_){}}s={mode:root.querySelector('#dmMode').value,profile:root.querySelector('#dmProfile').value,step:0,records:[],draft:'',started:Date.now(),elapsed:0,active:true,done:false,last:'',pending:null,assessment:null,reward:null,variant:Math.floor(Math.random()*3),concernResolved:false};persist();paint();};
 const submit=root.querySelector('[data-action=submit]');if(submit)submit.onclick=()=>{
 let el=root.querySelector('#dmAnswer'),a=el.value.trim();if(!a){el.focus();return;}
 const intent=indicators(a),words=a.split(/\s+/).length,unique=new Set(norm(a).split(' ')).size;
 const meaningfulInvitation=(intent.input&&words>=5&&unique>=4)||(intent.clarify&&words>=4&&unique>=4);
 const valid=(meaningfulInvitation||(words>=10&&unique>=8))&&!s.records.some(r=>norm(r.answer)===norm(a));
 if(!valid){s.last='Please revise: use a specific professional explanation (at least ten words) or a complete invitation for input/questions; avoid repeating an earlier response.';el.setCustomValidity(s.last);el.reportValidity();return;}
 s.draft='';const isFollow=Boolean(s.pending);
 s.records.push({speaker:speaker[0],line:localize(scene[2]),answer:a,core:!isFollow,stage:s.step,valid:true});
 if(s.step===7&&resolves(a))s.concernResolved=true;
 s.last='Consider whose voice is missing. Invite ideas separately from questions for clarification.';
 s.pending=isFollow&&!indicators(a).input&&!indicators(a).clarify&&!addressesPending(a,s.pending)?s.pending:followUp(a,s.step);s.awaitingReply=!!s.pending;s.reply=s.pending?null:[scene[0],'Stakeholder response',s.step===7&&s.concernResolved?'Thank you for hearing my concern. Let us compare practical education and employment options while keeping the student’s preference central; I want us to review the information together.':'I have heard your proposal. Please document the responsibilities and the point when we will review this together.'];persist();paint();
};
 const answer=root.querySelector('#dmAnswer');if(answer)answer.oninput=()=>{s.draft=answer.value;answer.setCustomValidity('');persist();};
 const next=root.querySelector('[data-action=next]');if(next)next.onclick=()=>{if(s.awaitingReply){s.last='Respond to the stakeholder’s latest statement before continuing.';paint();return;}if(s.step===7&&!s.concernResolved){s.last='The family concern is unresolved. Acknowledge it, center student preferences and propose a collaborative comparison.';paint();return;}if(!s.records.some(r=>r.stage===s.step&&r.valid))return;s.pending=null;s.reply=null;s.step++;s.draft='';if(s.step>=12)end();else{persist();paint();}};
 const resume=root.querySelector('[data-action=resume]');if(resume)resume.onclick=()=>{s.active=true;s.started=Date.now();s.resumable=false;paint();};
 const retry=root.querySelector('[data-action=retry]');if(retry)retry.onclick=()=>{s={...s,done:false,active:true,started:Date.now(),elapsed:0,step:7,records:[],pending:null,reply:null,awaitingReply:false,concernResolved:false,retryOnly:true,assessment:null,reward:null};persist();paint();};
 const back=root.querySelector('[data-action=back]');if(back)back.onclick=()=>{pause();paint();};
 const finish=root.querySelector('[data-action=finish]');if(finish)finish.onclick=end;
 const reset=root.querySelector('[data-action=reset]');if(reset)reset.onclick=()=>{s={mode:s.mode,profile:s.profile,step:0,records:[],started:0,elapsed:0,active:false,done:false,last:'',pending:null,assessment:null,reward:null,variant:Math.floor(Math.random()*3),concernResolved:false};persist();paint();};
}
function open(){returnFocus=document.activeElement;
 if(window.S?.activeCourse!=='D756'){alert('Select the D756 course first.');return;}
 if(!document.getElementById('d756MeetingRoom')){let root=document.createElement('div');root.id='d756MeetingRoom';document.body.append(root);}
 paint();clearInterval(tick);tick=setInterval(()=>{let x=document.getElementById('dmTime');if(x&&s.active)x.textContent=timer();},1000);
}
let style=document.createElement('style');style.textContent='#d756MeetingRoom{position:fixed;inset:0;z-index:1500;background:#110c18df;display:grid;place-items:center;padding:12px;color:#fff4e7}#d756MeetingRoom .dmPanel{background:#23182e;border:2px solid #c9a56b;border-radius:18px;width:min(1000px,100%);max-height:95vh;overflow:auto;padding:20px}#d756MeetingRoom header,#d756MeetingRoom .dmBtns,#d756MeetingRoom .dmStats{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin:12px 0}#d756MeetingRoom h2,#d756MeetingRoom h3{color:#f6d89c}#d756MeetingRoom button,#d756MeetingRoom select{background:#533c58;color:#fff3e2;border:1px solid #c8aa78;padding:10px;border-radius:9px;cursor:pointer}#d756MeetingRoom button:focus-visible,#d756MeetingRoom textarea:focus-visible{outline:3px solid #ffdc95}#d756MeetingRoom textarea{display:block;width:100%;font:inherit;background:#fffaf4;color:#211526;border-radius:10px;padding:12px;margin:9px 0}#d756MeetingRoom .dmPeople{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}#d756MeetingRoom .dmPerson{background:#35263e;border:1px solid #7e6878;border-radius:10px;text-align:center;padding:10px;font-size:13px}#d756MeetingRoom .dmPerson.active{border-color:#f4c77d}#d756MeetingRoom .dmFace{display:block;margin:0 auto 5px;background:#6f5069;border-radius:50%;padding:12px;width:48px}#d756MeetingRoom small{display:block;opacity:.85}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{background:#3d2c45;border-left:4px solid #dbb77c;padding:12px;border-radius:8px;margin:12px 0}#d756MeetingRoom .dmStats span{border:1px solid #987a94;border-radius:18px;padding:7px}#d756MeetingRoom .dmTranscript{overflow:visible}@media(max-width:600px){#d756MeetingRoom .dmPanel{padding:12px}#d756MeetingRoom .dmPeople{grid-template-columns:repeat(2,1fr)}}';style.textContent+='#d756MeetingRoom *{box-sizing:border-box}#d756MeetingRoom select:focus-visible{outline:3px solid #ffdc95}';style.textContent+='#d756MeetingRoom select{display:block;max-width:100%;margin:6px 0 16px}#d756MeetingRoom .dmPanel{line-height:1.5}';style.textContent+='#d756MeetingRoom header{align-items:flex-start}#d756MeetingRoom header>div{flex:1;min-width:0}#d756MeetingRoom h2{margin:8px 0}#d756MeetingRoom .dmPerson:nth-child(2) .dmFace{background:#405b57}#d756MeetingRoom .dmPerson:nth-child(3) .dmFace{background:#66582e}#d756MeetingRoom .dmPerson:nth-child(4) .dmFace{background:#475170}#d756MeetingRoom #dmAnswer{background:#fffaf4!important;color:#211526!important}@media(max-width:600px){#d756MeetingRoom header{margin:0 0 8px;gap:6px}#d756MeetingRoom h2{font-size:19px;line-height:1.3}#d756MeetingRoom header small{font-size:10px}#d756MeetingRoom header button{padding:7px;font-size:12px}#d756MeetingRoom .dmPerson{padding:5px;font-size:11px}#d756MeetingRoom .dmFace{display:none}#d756MeetingRoom .dmStats{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}#d756MeetingRoom .dmStats span{padding:5px;font-size:11px}#d756MeetingRoom .dmPrompt,#d756MeetingRoom .dmHint{padding:8px;margin:8px 0}#d756MeetingRoom .dmPrompt p,#d756MeetingRoom .dmHint p{margin:5px 0}#d756MeetingRoom #dmAnswer{height:100px}#d756MeetingRoom .dmPanel{font-size:14px}}';document.head.append(style);
function attach(){if(window.S?.activeCourse!=='D756')return;let studio=document.getElementById('majickHandsOnOverlay');if(!studio||studio.querySelector('#d756Task2Launch'))return;let b=document.createElement('button');b.id='d756Task2Launch';b.textContent='🎓 Task 2 — IEP Meeting Practice';b.onclick=open;(studio.querySelector('.mhTabs')||studio.querySelector('header')||studio).appendChild(b);}
let observer=new MutationObserver(()=>{if(document.getElementById('majickHandsOnOverlay')&&!document.getElementById('d756Task2Launch'))attach();});observer.observe(document.body,{childList:true,subtree:true});
setTimeout(attach,500);setInterval(()=>{if(s.active)persist()},5000);
window.MajickD756Meeting={version:'1.2',open,close,refresh:attach,summary:meter,assessment:grade,profiles:()=>Object.keys(profiles)};
})();