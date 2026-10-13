(()=>{'use strict';if(window.MajickTeachBack)return;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tips={
'd772-s1-l1':['Population = EVERYONE you want to understand; sample = SOMEONE you actually measure.','Ask: Who do we want answers about? Who did we actually ask?'],
'd772-s1-l2':['BIAS check: Who is missing? Who benefits? How was the question worded?','Teach students to redesign an unfair poll, not just name its bias.'],
'd772-s1-l3':['Look at AXES before adjectives: zero, intervals, units, and area.','Have students redraw misleading displays to scale.'],
'd772-s1-l4':['Association is not a cause-and-effect permission slip.','Ask: What can the evidence support, and what remains unknown?'],
'd772-s2-l1':['Categorical = labels; quantitative = amounts.','First classify the variable, then choose the display.'],
'd772-s2-l2':['One category → bar; one quantitative variable → histogram; two quantitative variables → scatterplot.','Make students sketch why a graph fits before choosing it.'],
'd772-s2-l3':['SOCS: Shape, Outliers, Center, Spread.','A right-skewed distribution has a longer tail to the right, not a higher bar on the right.'],
'd772-s2-l4':['MEAN = total ÷ count. MEDIAN = middle AFTER sorting.','Whiteboard routine: list knowns → write formula → substitute → compute → interpret with units.'],
'd772-s3-l1':['Probability = favorable outcomes ÷ possible outcomes.','A model with counters makes the sample space visible.'],
'd772-s3-l2':['Independent: one outcome does not change the other. Without replacement: recount!','“OR” suggests union; “AND” suggests intersection; “NOT” suggests complement.'],
'd772-s3-l3':['Draw a tree: each branch is one conditional path; multiply along a path.','Before solving, state exactly which event the question asks about.'],
'd756-s1-l1':['TEAM: each voice gives a different view of student needs.','Invite and document what the caregiver and all required professionals contribute.'],
'd756-s1-l2':['LISTEN → CLARIFY → SUMMARIZE → AGREE on next steps.','Practice saying an open-ended question rather than immediately defending a decision.'],
'd756-s2-l1':['One student; one shared plan; many perspectives.','Model co-planning with family and colleagues and a clear follow-up.'],
'd756-s2-l2':['Access before assumptions: language, culture, schedule and participation.','Ask the family how they prefer to communicate.'],
'd756-s3-l1':['START with the student, not the blank form.','Bring strengths, assessment data and family priorities together first.'],
'd756-s3-l2':['PLAAFP gives the starting point; the annual goal identifies the measurable destination.','Goal recipe: given WHAT → student DOES WHAT → HOW WELL → measured HOW OFTEN.'],
'd756-s3-l3':['Services answer WHO, WHAT, WHERE, WHEN; monitoring answers HOW WILL WE KNOW.','Always connect supports back to individual student need and LRE.'],
'd756-s3-l4':['Transition planning starts with the student’s interests and postsecondary direction.','Work backward from an outcome to measurable steps and responsible partners.']
};
const scenarios={
'd772-s1-l1':['A survey asks only one homeroom but generalizes to an entire school. What is the issue?',['The sample may not represent the school.','It is automatically representative.','A large school makes sampling unnecessary.'],0,'Distinguish the target population from the sampled homeroom.'],
'd772-s1-l2':['Students volunteer for a poll advertised by one club. What must you check?',['Whether self-selection excludes other perspectives.','Whether the response has enough decimal places.','Whether the chart is colorful.'],0,'Voluntary response can overrepresent people motivated to answer.'],
'd772-s1-l3':['A bar chart starts at 95% and compares 96% with 98%. What could mislead viewers?',['The truncated axis makes a small difference appear larger.','The presence of percentages.','Two bars instead of three.'],0,'Check the axis before interpreting visual effect size.'],
'd772-s1-l4':['An observational study connects hours of sleep to scores. Can it prove sleep caused better scores?',['No; association alone does not establish causation.','Yes, any pattern proves a cause.','Yes, if the graph has enough points.'],0,'Consider confounding variables and research design.'],
'd772-s2-l1':['A teacher records favorite genre and reading minutes. Which pairing is correct?',['Genre categorical; minutes quantitative.','Both quantitative.','Both categorical.'],0,'Identify the type of each variable.'],
'd772-s2-l2':['A teacher wants to show the distribution of 80 quiz scores. Which display fits?',['Histogram.','Pie chart.','Map.'],0,'Quantitative frequency distributions use histograms.'],
'd772-s2-l3':['A salary graph has a long tail toward high values. What shape is it?',['Right-skewed.','Left-skewed.','Uniform.'],0,'Name skew by the direction of the tail.'],
'd772-s2-l4':['Scores 4, 8, 12 and 16 have what mean?',['10.','8.','12.'],0,'Sum 40 and divide by four observations.'],
'd772-s3-l1':['A fair die has six outcomes. What is P(rolling a 2)?',['1/6.','2/6.','1/2.'],0,'Count one favorable outcome among six equally likely outcomes.'],
'd772-s3-l2':['Two cards are drawn without replacement. Why are the events generally dependent?',['The second sample space changes after the first card.','Because there are always two draws.','Because cards have colors.'],0,'The remaining favorable outcomes and total can change.'],
'd772-s3-l3':['A bag has 3 green and 2 purple. What is P(two green without replacement)?',['3/10.','9/25.','3/5.'],0,'Multiply 3/5 by 2/4 to get 6/20 = 3/10.'],
'd756-s1-l1':['A caregiver brings information about home communication. How should the team respond?',['Invite it into the student discussion.','Ignore it until after the meeting.','Allow only staff to speak.'],0,'Caregivers bring essential knowledge about their student.'],
'd756-s1-l2':['A parent says they were not heard. What should you do first?',['Acknowledge the concern and ask for specifics.','Defend the plan immediately.','End the conversation.'],0,'Listen before proposing a solution.'],
'd756-s2-l1':['Two colleagues disagree about a support. What next?',['Compare student evidence and agree on a follow-up.','Choose the most senior teacher automatically.','Avoid documenting the disagreement.'],0,'Collaboration uses evidence and shared responsibility.'],
'd756-s2-l2':['A family needs interpretation for an IEP meeting. What is appropriate?',['Arrange meaningful language access.','Ask their child to interpret.','Proceed without interpretation.'],0,'Meaningful participation requires accessible communication.'],
'd756-s3-l1':['What should happen before completing an IEP goal?',['Review present levels, strengths, needs and team input.','Pick a generic goal.','Copy another student’s plan.'],0,'Individualization starts with current evidence.'],
'd756-s3-l2':['Which goal is more measurable?',['Given a passage, identify 8 of 10 main ideas across three probes.','Improve reading.','Work harder.'],0,'Specify condition, action and criterion.'],
'd756-s3-l3':['What should accompany an IEP service recommendation?',['Specific service details and progress monitoring.','An assumption that it will work.','No schedule.'],0,'Connect services to needs and evidence.'],
'd756-s3-l4':['What starts appropriate transition planning?',['Student interests and age-appropriate transition information.','The same plan for every student.','Only a teacher preference.'],0,'Student-centered transition planning is individualized.']
};
let memory=new Map();
function mount(_box,lesson,index){
 const root=document.getElementById('learnInlinePractice');if(!root)return;
 let id=window.MajickLearningContinuity?.identify?.(lesson.title+' '+lesson.explain,window.S?.activeCourse);
 if(!id){const c=String(window.S?.activeCourse||'');const options=Object.keys(scenarios).filter(x=>x.startsWith(c.toLowerCase()));id=options[Math.min(index,options.length-1)]}
 const challenge=scenarios[id],tip=tips[id];if(!challenge)return;
 const key=String(window.S?.activeCourse)+':'+index+':'+id;
 let st=memory.get(key);if(!st){st={answer:-1,attempts:0,explain:'',feedback:'',showModel:false};memory.set(key,st)}
 const draw=()=>{
 const html='<section class="mjtCoach"><header><small>YOUR PROFESSOR’S PRACTICE DESK</small><h4>✦ Explain · Apply · Teach it</h4><p>Use the concept in a realistic example before you leave this lesson.</p></header><div class="mjtTip"><b>Memory spell</b><p>'+E(tip?.[0]||'State the idea, give evidence, and connect it to a classroom example.')+'</p><small>'+E(tip?.[1]||'Explain it as though a student is hearing it for the first time.')+'</small></div><h5>Try a classroom challenge</h5><p>'+E(challenge[0])+'</p><div class="mjtChoices">'+challenge[1].map((option,i)=>'<button type="button" data-pick="'+i+'" aria-pressed="'+(st.answer===i)+'">'+E(option)+'</button>').join('')+'</div><h5>Teach it back</h5><p>Explain why your answer makes sense, then say how you would teach or apply the concept in your own classroom.</p><textarea rows="3" aria-label="Explain this concept as a teacher" placeholder="I would explain this to my students by…">'+E(st.explain)+'</textarea><div class="mjtControls"><button type="button" data-check>Check and coach me</button><button type="button" data-model>Professor example</button><button type="button" data-reset>Try again</button></div>'+(st.feedback?'<p class="mjtFeedback" role="status">'+E(st.feedback)+'</p>':'')+(st.showModel?'<div class="mjtModel"><b>Model reasoning</b><p>'+E(challenge[3])+'</p><p>Teaching move: '+E(tip?.[1]||'Model the reasoning and ask students to explain it back in their own words.')+'</p></div>':'')+'</section>';
 let existing=root.querySelector('.mjtCoach');if(existing)existing.outerHTML=html;else root.insertAdjacentHTML('beforeend',html);
 const area=root.querySelector('.mjtCoach');
 area.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{st.answer=Number(b.dataset.pick);st.feedback='';draw()});
 area.querySelector('textarea').oninput=e=>{st.explain=e.target.value};
 area.querySelector('[data-model]').onclick=()=>{st.showModel=!st.showModel;draw()};
 area.querySelector('[data-reset]').onclick=()=>{st.answer=-1;st.explain='';st.feedback='';st.showModel=false;draw()};
 area.querySelector('[data-check]').onclick=()=>{
 st.attempts++;const correct=st.answer===challenge[2];const words=st.explain.trim().split(/\s+/).filter(Boolean);
 const hasExplanation=words.length>=12&&/because|since|therefore|means|shows|indicat|reason|evidence|first|then/i.test(st.explain);
 const hasClassroom=/student|learner|teach|class|family|parent|iep|model|show|demonstrat|practice|group|example|instruction/i.test(st.explain);
 const reflective=hasExplanation&&hasClassroom;
 st.feedback=(correct?'✓ Your decision matches this example.':'Reconsider the decision. '+challenge[3])+' '+(!hasExplanation?'Explain the WHY using evidence or a step-by-step reason. ':'')+(!hasClassroom?'Describe how you would teach or apply this in a classroom. ':'')+(reflective?'Your teach-back includes reasoning and a classroom connection. Check it against the model; this is coaching, not verified mastery.':'');
 window.MajickLearningContinuity?.record?.({courseId:window.S?.activeCourse,lessonTitle:lesson.title,term:id,correct:correct&&reflective,activity:'learn-lab-teach-back'});
 if(correct&&reflective){const p=window.MajickInteractiveRewards?.award?.('learn-teachback-'+id,'participation');if(p?.awarded)st.feedback+=' ✦ +'+p.xp+' XP for practice.'}
 draw();
 };
 };draw();
}
const style=document.createElement('style');style.textContent='.mjtCoach{margin-top:16px;padding:16px;border:1px solid #bba06f;border-radius:15px;background:#35283c;color:#fff0ed}.mjtCoach h4,.mjtCoach h5{color:#f7d59c;margin:8px 0}.mjtCoach h4{font-size:1.25rem}.mjtCoach h5{font-size:1rem}.mjtCoach p{line-height:1.5}.mjtCoach button{padding:10px 12px;margin:4px;border-radius:9px;border:1px solid #b995ae;background:#5d4569;color:#fff4e5;cursor:pointer}.mjtChoices{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:6px}.mjtChoices button[aria-pressed=true]{background:#a47797;border:2px solid #ffe1a2}.mjtCoach button:focus-visible,.mjtCoach textarea:focus-visible{outline:3px solid #ffda93}.mjtCoach textarea{width:100%;background:#fff9ef;color:#201827;padding:10px;border-radius:9px}.mjtTip,.mjtModel,.mjtFeedback{background:#4a3950;padding:12px;border-left:3px solid #edd1a0;margin:12px 0}.mjtTip b{color:#ffdc98}.mjtCoach small{color:#f6dfe8}@media(max-width:600px){.mjtChoices{grid-template-columns:1fr}}';document.head.append(style);
window.MajickTeachBack={mount,version:'1.0'};
})();