(function(){
'use strict';
if(!window.MajickLearningLab||!window.MajickMaterialStore)return;

const VERSION='3.3.29';
const D772_SECTION_ONE={
  id:'d772-section-1',
  title:'Section 1: Assessing Research and Data Credibility',
  lessons:[
    {id:'d772-s1-l1',number:1,title:'Understanding Data Collection Methods',short:'Data Collection',keywords:['data collection','collect data','sample','sampling','population','random sample','survey','observation','experiment','census','selected','collected'],
      goal:'Understand how data is gathered, who is represented, and how the collection method affects what the data can tell you.',
      visual:['Population','Sample / participants','Collection method','Data','What can we conclude?'],
      thinking:['Who or what is the full population?','Who was actually measured?','How were people or items selected?','What collection method was used?','Does the method fit the question being asked?'],
      traps:['Treating a sample as if it were the whole population.','Ignoring how participants were selected.','Assuming every collection method supports the same kind of conclusion.']},
    {id:'d772-s1-l2',number:2,title:'Recognizing Bias in Data Collection',short:'Bias',keywords:['bias','biased','selection bias','response bias','nonresponse','undercoverage','voluntary response','convenience','wording','leading question'],
      goal:'Identify ways the collection process can systematically push results away from an accurate picture of the population.',
      visual:['Target population','Who can be selected?','Who responds?','How questions are asked','Bias risk'],
      thinking:['Who had a real chance to be included?','Who may have been left out?','Who may choose not to respond?','Could the wording influence the response?','Would the same process systematically favor one kind of answer?'],
      traps:['Calling ordinary random variation “bias.”','Looking only at sample size and ignoring selection.','Missing bias caused by wording or nonresponse.']},
    {id:'d772-s1-l3',number:3,title:'Unveiling Data Misrepresentations',short:'Misrepresentation',keywords:['misrepresentation','misleading','graph','axis','scale','truncated','visual','chart','interval','proportion','distort','display'],
      goal:'Evaluate whether a graph, table, or numerical display represents the underlying data fairly.',
      visual:['Original data','Axes / scale / labels','Displayed visual','Reader impression','Fair or misleading?'],
      thinking:['What values are actually in the data?','Where does the axis begin?','Are intervals consistent?','Are labels and units clear?','Does the visual exaggerate or hide a difference?'],
      traps:['Trusting a graph because the numbers are technically present.','Ignoring a truncated axis or inconsistent scale.','Confusing a dramatic visual difference with a large numerical difference.']},
    {id:'d772-s1-l4',number:4,title:'Conclusions About Data Findings',short:'Conclusions',keywords:['conclusion','conclusions','causation','causal','correlation','association','generalize','inference','evidence','claim','findings','relationship','limitation'],
      goal:'Decide what conclusions the evidence actually supports and where the limits of the study matter.',
      visual:['Study design','Evidence observed','Population represented','Limits','Supported conclusion'],
      thinking:['What did the study actually observe?','Who does the sample represent?','Is this association or evidence of cause?','What limitations narrow the conclusion?','Is the claim stronger than the evidence?'],
      traps:['Turning correlation into causation.','Generalizing beyond the population represented by the sample.','Ignoring limitations when judging a claim.']},
    {id:'d772-s1-review',number:null,title:'Section 1: Summary and Test',short:'Section 1 Review',review:true,keywords:[],
      goal:'Combine data collection, bias, representation, and conclusion skills in mixed evidence-based practice.',
      visual:['Collection','Bias','Representation','Conclusion','Credibility decision'],
      thinking:['How was the data collected?','What bias is possible?','Is the display fair?','What conclusion is supported?','What would make the evidence stronger?'],
      traps:['Solving only one part of a multi-step credibility problem.','Choosing the strongest-sounding conclusion instead of the best-supported conclusion.']}
  ]
};

const D772_SECTION_ONE_CONTENT={
  'd772-s1-l1':{
    overview:'Lesson 1 asks where the data came from and how the study was designed. Follow the chain: population and sample → sampling method → study type → experimental design.',
    teach:[
      {title:'Population, sample, individuals, variables, and data',text:'Population means the entire group of interest; sample means the smaller group actually studied. A parameter describes a population, while a statistic describes a sample. Individuals are the people or objects described by the data. Variables are characteristics measured on those individuals, and data are the recorded values. Quantitative variables are meaningful numerical measurements; categorical variables are labels or groups.'},
      {title:'Random sampling methods',text:'Simple random sampling selects entirely by chance. Stratified sampling takes SOME FROM ALL subgroups. Cluster sampling takes ALL FROM SOME randomly selected groups. Systematic sampling chooses a random starting point and then every nth individual. Random sampling decides WHO enters the sample.'},
      {title:'Observational studies, surveys, and experiments',text:'Observational studies measure variables as they naturally occur. A sample survey is an observational study based on self-reported answers. An experiment deliberately imposes a treatment. The explanatory variable may explain or predict the outcome; the response variable is the measured outcome.'},
      {title:'Strong experimental design',text:'Randomization assigns experimental units to treatments by chance. Replication uses enough observations or repeated studies. A control group gives a comparison baseline. A placebo is inactive; the placebo effect is a response caused by expectation. Single-blind means participants do not know treatment assignment; double-blind means participants and interacting researchers do not know. Random assignment decides WHERE participants go after they enter the study.'}
    ],
    vocab:[
      ['Population','The entire group of individuals or objects the researcher wants to study.'],
      ['Sample','A smaller group selected from the population to represent the larger group.'],
      ['Parameter','A numerical value describing a characteristic of a population.'],
      ['Statistic','A numerical value describing a characteristic of a sample.'],
      ['Individual','A person or object described by the data.'],
      ['Variable','A characteristic or measurement recorded on an individual.'],
      ['Quantitative variable','A variable whose values are meaningful numerical measurements.'],
      ['Categorical variable','A variable whose values are labels or categories.'],
      ['Simple random sample','A random sample in which every possible same-size subset has an equal chance of selection.'],
      ['Stratified sample','Divide into strata and randomly sample some individuals from every stratum.'],
      ['Cluster sample','Randomly select some natural groups and include everyone in the chosen groups.'],
      ['Systematic sample','Choose a random start and then select every nth individual.'],
      ['Observational study','Researchers observe variables without assigning a treatment.'],
      ['Sample survey','An observational study in which people self-report answers or opinions.'],
      ['Experiment','Researchers deliberately manipulate an explanatory variable and observe the response.'],
      ['Randomization','Assigning experimental units to treatment groups by chance.'],
      ['Replication','Using enough observations or repeating a study so results are not driven by a few unusual cases.'],
      ['Control group','A comparison group that does not receive the experimental treatment.'],
      ['Placebo','An inactive treatment.'],
      ['Blinding','Keeping participants and/or researchers unaware of treatment assignment.']
    ],
    memory:['Population = ALL; Sample = SOME.','Parameter → Population; Statistic → Sample.','Stratified = SOME FROM ALL; Cluster = ALL FROM SOME.','Random sampling = WHO enters; random assignment = WHERE they go.','Researcher changes something = experiment.']
  },
  'd772-s1-l2':{
    overview:'Lesson 2 asks whether the data-collection process systematically favored certain people, answers, or outcomes. The fastest way to diagnose bias is to identify WHERE the distortion entered the study.',
    teach:[
      {title:'Representative vs. non-representative samples',text:'A representative sample reasonably reflects the target population. A non-representative sample systematically misses or overrepresents important groups, weakening the credibility of conclusions about the larger population.'},
      {title:'Selection problems',text:'Sampling bias occurs when the selection method makes some population members more likely to be included. Convenience sampling chooses whoever is easiest to reach. A volunteer sample lets people choose themselves; voluntary response bias occurs because people with strong opinions are often more likely to participate. A sampling-frame error occurs when the list used to select people does not cover the full target population.'},
      {title:'Response problems',text:'Non-response bias happens after selection when people who refuse, fail to answer, or drop out differ systematically from those who respond. Response bias occurs when participants give inaccurate answers because of misunderstanding, memory, social pressure, embarrassment, interviewer effects, or fear. Perceived lack of anonymity is a response-bias problem caused by fear that answers can be traced back to the respondent.'},
      {title:'Wording and self-interest',text:'A loaded question nudges respondents toward a particular answer through wording. A self-interest study is a credibility concern when a researcher or sponsor has something to gain from a particular result. A conflict of interest is a reason for closer scrutiny, not automatic proof that the findings are false.'}
    ],
    vocab:[
      ['Representative sample','A sample that reasonably reflects the characteristics of the target population.'],
      ['Non-representative sample','A biased sample that does not accurately reflect the target population.'],
      ['Volunteer sample','A non-random sample in which people select themselves to participate.'],
      ['Voluntary response bias','Bias caused when people with strong opinions or special interest are especially likely to volunteer.'],
      ['Convenience sample','A sample chosen because the individuals are easy to reach.'],
      ['Sampling frame','The list of potential individuals from which a sample is selected.'],
      ['Sampling frame error','A problem in which the sampling frame does not cover the full target population.'],
      ['Sampling bias','A selection problem that gives some population members a systematically different chance of inclusion.'],
      ['Non-response bias','Bias caused when selected nonresponders differ systematically from responders.'],
      ['Response bias','Inaccurate answers caused by pressure, misunderstanding, memory, fear, or other response effects.'],
      ['Perceived lack of anonymity','Response bias caused by fear that an honest answer can be linked back to the respondent.'],
      ['Loaded question','Question wording that pushes respondents toward a particular answer.'],
      ['Self-interest study','A study in which the researcher or sponsor has a stake in a particular outcome.']
    ],
    memory:['Sampling bias = wrong/unbalanced PEOPLE. Response bias = inaccurate ANSWERS.','Voluntary response = people choose themselves IN. Non-response = selected people stay OUT.','Convenience = researcher chooses easy people. Volunteer = people choose themselves.','A random sample cannot fix a bad sampling frame.']
  },
  'd772-s1-l3':{
    overview:'Lesson 3 asks whether the display, sample size, significance claim, or reporting practice could mislead the reader—even when some of the underlying numbers are technically real.',
    teach:[
      {title:'Misleading graphical displays',text:'A truncated bar-chart axis can make a modest difference look enormous. Icons enlarged in both height and width exaggerate area. A tilted 3-D pie chart can make equal slices appear unequal because of perspective. Always compare the visual impression with the actual values, scale, labels, units, and intervals.'},
      {title:'Sample size and random variation',text:'Small samples are more vulnerable to random fluctuations and can produce extreme-looking results by chance. Larger samples generally provide more stable estimates when the sampling method itself is sound. A huge biased sample is still biased.'},
      {title:'Statistical significance',text:'In D772, statistical significance means the observed result is unlikely to be explained by random chance alone under the statistical method used. It does not automatically mean the effect is large, important, unbiased, ethical, or proven with certainty. Statistical significance and practical importance answer different questions.'},
      {title:'Misrepresentation, fabrication, and falsification',text:'Misrepresentation presents information in a way likely to produce an incorrect conclusion. Fabrication invents data or results that never existed. Falsification manipulates the research record by altering values, changing instruments without disclosure, misreporting subject counts, intentionally selecting a biased sample, omitting inconvenient valid data, or duplicating observations. Transparent pre-established exclusion rules are different from secretly deleting results because they hurt a preferred conclusion.'}
    ],
    vocab:[
      ['Statistical significance','Evidence that an observed result is unlikely to be explained by random chance alone under the statistical method used.'],
      ['Practical significance','Whether the size of an effect is large or meaningful enough to matter in the real world.'],
      ['Misrepresenting data','Presenting real or partly real data in a way likely to mislead viewers or encourage an incorrect conclusion.'],
      ['Fabricating data','Making up data or results that were never actually observed.'],
      ['Falsifying data','Changing, omitting, manipulating, or otherwise distorting the research record.'],
      ['Truncated axis','A graph axis that begins close to the observed values rather than an appropriate baseline, potentially exaggerating visual differences.'],
      ['Duplicating data','Counting copied observations as if they were new independent observations.']
    ],
    memory:['Statistically significant = unlikely to be chance; practically significant = large or meaningful enough to matter.','Misrepresentation can use real data misleadingly; falsification changes or invents the research record.','Small sample = more random bounce. Large sample does not cure bias.','Bars compare length; pictures can trick your eye into comparing area.']
  },
  'd772-s1-l4':{
    overview:'Lesson 4 connects the study design to the conclusion you are allowed to make. The central rule is that association is not the same as causation, and a scatterplot shows a relationship but not why it exists.',
    teach:[
      {title:'Association vs. causation',text:'Association means two variables are related. A causal relationship means a change in one variable directly produces an effect in the other. Observational studies can support association but cannot establish causation by themselves. A well-designed randomized experiment can support a causal conclusion when alternative explanations are appropriately controlled.'},
      {title:'Confounding variables',text:'A confounding variable is related to both the explanatory and response variables and can make them appear directly connected. Ask whether a third variable could explain why the two measured variables occur together. Examples include sun exposure in sunscreen/skin-cancer data and season or temperature in ice-cream-sales/shark-attack data.'},
      {title:'Scatterplot shape, trend, strength, and outliers',text:'A scatterplot displays the relationship between two quantitative variables. Describe SHAPE first: linear, nonlinear, or no pattern. For a linear relationship describe TREND as positive or negative. Describe STRENGTH by how tightly the points follow the pattern. Identify OUTLIERS that sit noticeably away from the overall pattern. Nonlinear does not mean no relationship.'},
      {title:'Correlation still does not prove cause',text:'Even a very strong positive or negative scatterplot pattern does not prove that one variable causes the other. Confounding, reverse direction, or coincidence can produce correlation. Causal reasoning comes from the study design, especially manipulation, comparison/control, and random assignment.'}
    ],
    vocab:[
      ['Association','A relationship between two variables.'],
      ['Causal relationship','A relationship in which a change in one variable directly produces an effect in another.'],
      ['Confounding variable','A variable associated with both the explanatory and response variables that can distort the apparent relationship.'],
      ['Scatterplot','A graph that displays the relationship between two quantitative variables.'],
      ['Linear relationship','A point pattern that roughly follows a straight line.'],
      ['Nonlinear relationship','A clear relationship whose pattern is curved or otherwise not well described by a straight line.'],
      ['Positive correlation','A linear pattern in which higher values of one variable tend to occur with higher values of the other.'],
      ['Negative correlation','A linear pattern in which higher values of one variable tend to occur with lower values of the other.'],
      ['Outlier','A point that lies noticeably away from the overall pattern.']
    ],
    memory:['OBSERVE → association only. EXPERIMENT → causation may be justified.','Scatterplot routine: SHAPE → TREND → STRENGTH → OUTLIERS.','Positive does not mean good; negative does not mean bad.','Strong correlation still does not prove causation.']
  },
  'd772-s1-review':{
    overview:'Section 1 Summary and Test combines the entire research-credibility chain. Start with who was studied and how they were selected, then identify study design and bias, inspect the display and significance claim, evaluate research integrity, and finish by deciding what conclusion the evidence supports.',
    teach:[
      {title:'Section 1 decision path',text:'1) Identify population, sample, individuals, variables, and variable type. 2) Determine the sampling method. 3) Identify observational study, survey, or experiment. 4) For experiments, inspect randomization, replication, control, placebo, and blinding. 5) Diagnose bias. 6) Inspect graphs for visual distortion. 7) Consider sample size and statistical significance. 8) Check whether data were honestly reported. 9) Decide whether the evidence supports association only or a causal conclusion and, when relevant, describe scatterplots by shape, trend, strength, and outliers.'},
      {title:'Master trap pairs',text:'Population vs. sample = entire group vs. smaller group studied. Parameter vs. statistic = population number vs. sample number. Stratified vs. cluster = some from all vs. all from some. Random sampling vs. random assignment = who enters vs. which treatment group they enter. Sampling bias vs. response bias = wrong people vs. wrong answers. Statistical significance vs. practical importance = unlikely due to chance vs. meaningful size. Association vs. causation = variables related vs. one directly causes the other.'},
      {title:'Math-anxiety strategy',text:'Section 1 is mainly reasoning and vocabulary, not heavy calculation. Translate a complicated prompt into one question: “What exactly is the study doing?” Then classify the situation. Read graph scales before trusting the picture, do not translate “statistically significant” into “large,” and never translate a strong correlation into causation.'}
    ],
    vocab:[],
    memory:['One Section 1. Four lessons. One final Summary and Test.','Follow the evidence from collection → bias → presentation → conclusion.']
  }
};

const D772_TUTOR_HELP={
  'd772-s1-l1':{
    simple:'Think of Lesson 1 as four questions: Who is the full group? Who actually got studied? How were they chosen? Did the researcher only observe, or did they assign a treatment? Those answers tell you whether the sample and study design are strong enough for the claim.',
    example:'A district wants to understand planning time for all 5,000 teachers. It divides teachers into elementary, middle, and high school groups and randomly chooses teachers from every group. The 5,000 teachers are the population, the selected teachers are the sample, and the method is stratified sampling because it takes SOME FROM ALL groups.',
    quickCheck:{prompt:'A researcher randomly chooses 5 schools and surveys every teacher in those schools. Which sampling method is this?',choices:['Simple random','Stratified','Cluster','Systematic'],answer:2,rationale:'Cluster sampling chooses some whole groups and includes everyone in the selected groups: ALL FROM SOME.'}
  },
  'd772-s1-l2':{
    simple:'Lesson 2 is about finding where the study became unfair. If the wrong people get selected, think sampling bias. If people choose themselves, think voluntary response. If selected people do not answer, think non-response. If people answer inaccurately, think response bias. If the wording pushes them, think loaded question.',
    example:'A school asks only students who are currently buying lunch whether students like the lunch program. The sample leaves out students who avoid school lunch, so it may overrepresent students who already like it. That is a non-representative sample and a sampling-bias problem.',
    quickCheck:{prompt:'A random sample is selected, but the people with the strongest negative experiences are much less likely to return the survey. What is the main bias?',choices:['Voluntary response bias','Non-response bias','Convenience sampling','Loaded question'],answer:1,rationale:'They were already selected. The distortion happens because selected people fail to respond, so this is non-response bias.'}
  },
  'd772-s1-l3':{
    simple:'Lesson 3 asks whether the story told by the numbers is fair. Check the graph scale, sample size, meaning of “statistically significant,” and whether anyone changed, invented, hid, or duplicated data. A result can be real and still be presented in a misleading way.',
    example:'Two schools have pass rates of 96% and 94%. A bar chart starts its y-axis at 92%, making one bar look dramatically taller. The numbers may be accurate, but the truncated axis exaggerates the visual difference and can mislead the reader.',
    quickCheck:{prompt:'A study reports a statistically significant 0.2-point increase in test scores. What can you conclude?',choices:['The effect must be large','The effect must be educationally important','The result is unlikely to be due to random chance alone under the method used','The study is automatically unbiased'],answer:2,rationale:'Statistical significance concerns chance/uncertainty. It does not automatically mean the effect is large, important, or unbiased.'}
  },
  'd772-s1-l4':{
    simple:'Lesson 4 asks what the evidence actually allows you to say. Observational studies can show association, but not causation by themselves. A well-designed randomized experiment can support a causal claim. For scatterplots, read SHAPE, then TREND, then STRENGTH, then OUTLIERS.',
    example:'Ice cream sales and shark attacks both rise in summer. That does not mean ice cream causes shark attacks. Warm weather is a confounding variable because it increases ice cream purchases and also increases swimming and beach activity.',
    quickCheck:{prompt:'An observational study finds that people who take vitamin D are healthier on average. Which conclusion is justified?',choices:['Vitamin D caused the better health','There is an association, but causation is not established','The variables have no relationship','The study is a randomized experiment'],answer:1,rationale:'Because no treatment was randomly assigned, the observational study can support association but cannot establish causation by itself.'}
  },
  'd772-s1-review':{
    simple:'For the Section 1 test, follow the research chain from beginning to end: identify population/sample → sampling method → study type → experimental design → bias → graph/significance → research integrity → association or causation. Do not jump straight to the conclusion.',
    example:'Suppose a company surveys volunteers, uses a truncated graph, and then claims its product causes improvement. You would question the voluntary-response sample, the misleading display, and the causal claim. Section 1 questions often stack several credibility problems in one scenario.',
    quickCheck:{prompt:'Which sequence best matches the Section 1 credibility check?',choices:['Conclusion → graph → sample → population','Population/sample → collection/design → bias/display → supported conclusion','Vocabulary → formula → calculator → conclusion','Correlation → causation → sampling'],answer:1,rationale:'Section 1 follows the evidence from who was studied and how data were collected through bias/presentation and finally to the conclusion the evidence supports.'}
  }
};

const cache={};
function E(s){try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}}
function cid(){return String(window.S?.activeCourse||'D755')}
function course(id=cid()){return window.S?.courses?.[id]||{questionBank:[]}}
function prog(id=cid()){return window.S?.progress?.[id]||{answers:[]}}
function tutorState(id=cid()){
  const s=MajickLearningLab.state(id);
  s.tutor=s.tutor&&typeof s.tutor==='object'?s.tutor:{};
  s.tutor.selectedLesson=s.tutor.selectedLesson||null;
  s.tutor.openSections=s.tutor.openSections||{};
  return s.tutor;
}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function uniqText(rows,selector=x=>x){
  const out=[],seen=new Set();
  for(const row of rows||[]){
    const value=selector(row);
    const key=norm(value);
    if(!key||seen.has(key))continue;
    seen.add(key);out.push(row);
  }
  return out;
}
function sourceText(row){return (String(row?.sourceName||'')+' '+String(row?.text||'')).toLowerCase()}
function headingInfo(row){
  const raw=String(row?.sourceName||'')+'\n'+String(row?.text||'').slice(0,1600);
  const section=raw.match(/\bSection\s+(\d+)\s*[:\-–]?\s*([^\n]{0,90})/i);
  const lesson=raw.match(/\bLesson\s+(\d+)\s*[:\-–]?\s*([^\n]{0,90})/i);
  return {
    sectionNumber:section?Number(section[1]):null,
    sectionTitle:section?.[2]?.trim()||'',
    lessonNumber:lesson?Number(lesson[1]):null,
    lessonTitle:lesson?.[2]?.trim()||''
  };
}
function escRx(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function lessonById(id){return D772_SECTION_ONE.lessons.find(l=>l.id===id)||null}
function classifyD772(row){
  if(row?.learningPath?.courseId==='D772'&&(row.learningPath.lessonId||row.learningPath.multiLesson))return row.learningPath;
  const text=sourceText(row),head=headingInfo(row);
  let best=null,bestScore=0;
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    let score=0;
    if(head.lessonNumber===lesson.number)score+=12;
    if(norm(head.lessonTitle).includes(norm(lesson.short)))score+=8;
    if(text.includes(norm(lesson.title)))score+=12;
    for(const k of lesson.keywords)if(text.includes(k))score+=1;
    if(score>bestScore){bestScore=score;best=lesson}
  }
  if(!best||bestScore<2)return null;
  return {
    courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,
    lessonId:best.id,lessonTitle:best.title,lessonNumber:best.number,confidence:bestScore>=10?'high':bestScore>=4?'medium':'low'
  };
}
function d772Segments(row){
  const raw=String(row?.text||'');
  if(!raw)return [];
  const marks=[];
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    const patterns=[
      new RegExp('\\bLesson\\s*'+lesson.number+'\\b[^\\n]{0,120}','ig'),
      new RegExp(escRx(lesson.title),'ig')
    ];
    for(const rx of patterns){
      let m;
      while((m=rx.exec(raw))){
        marks.push({at:m.index,lessonId:lesson.id,lessonTitle:lesson.title,lessonNumber:lesson.number});
        if(rx.lastIndex===m.index)rx.lastIndex++;
      }
    }
  }
  marks.sort((a,b)=>a.at-b.at);
  const unique=[];
  for(const mark of marks){
    const prev=unique[unique.length-1];
    if(prev&&prev.lessonId===mark.lessonId&&Math.abs(prev.at-mark.at)<160)continue;
    unique.push(mark);
  }
  return unique.map((mark,i)=>({...mark,text:raw.slice(mark.at,unique[i+1]?.at??raw.length)}));
}
function d772ItemText(item){
  return [item?.sourceExcerpt,item?.text,item?.keyIdea,item?.term,item?.definition,item?.explanation,item?.correction,item?.prompt,item?.why,item?.answer]
    .filter(Boolean).join(' ');
}
function scoreD772Item(text,lesson){
  const t=norm(text);
  if(!t)return 0;
  let score=0;
  if(t.includes(norm(lesson.title)))score+=20;
  if(t.includes('lesson '+lesson.number))score+=18;
  const strong={
    'd772-s1-l1':['data collection','collection method','random sample','sampling method','population','census','survey','observation','experiment'],
    'd772-s1-l2':['selection bias','response bias','nonresponse','undercoverage','voluntary response','convenience sample','leading question','biased wording','bias'],
    'd772-s1-l3':['truncated axis','misleading graph','misrepresentation','axis','scale','interval','distort','display'],
    'd772-s1-l4':['causation','causal','correlation','association','generalize','inference','supported conclusion','limitation','claim','findings']
  }[lesson.id]||lesson.keywords||[];
  for(const k of strong)if(t.includes(norm(k)))score+=k.includes(' ')?4:2;
  return score;
}
function classifyD772Item(row,item){
  if(item?.learningPathLessonId&&lessonById(item.learningPathLessonId))return item.learningPathLessonId;
  const text=d772ItemText(item),needle=norm(item?.sourceExcerpt||item?.text||'');
  const segments=d772Segments(row);
  if(needle.length>=18){
    const hit=segments.find(seg=>norm(seg.text).includes(needle.slice(0,Math.min(needle.length,180))));
    if(hit)return hit.lessonId;
  }
  let best=null,bestScore=0;
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    const score=scoreD772Item(text,lesson);
    if(score>bestScore){bestScore=score;best=lesson}
  }
  if(best&&bestScore>=3)return best.id;
  const lp=row?.learningPath;
  if(lp?.lessonId&&lessonById(lp.lessonId))return lp.lessonId;
  return null;
}
function tagD772Generated(row){
  if(!row||row.courseId!=='D772'||!row.generated)return {changed:false,lessonIds:[]};
  let changed=false;
  const buckets=['passages','vocabulary','explanations','misconceptionRepair','practiceQuestions'];
  const lessonIds=new Set();
  for(const bucket of buckets){
    for(const item of (row.generated[bucket]||[])){
      const id=classifyD772Item(row,item);
      if(!id)continue;
      const lesson=lessonById(id);lessonIds.add(id);
      if(item.learningPathLessonId!==id){item.learningPathLessonId=id;changed=true}
      if(item.learningPathLessonTitle!==lesson.title){item.learningPathLessonTitle=lesson.title;changed=true}
      if(item.learningPathSectionId!==D772_SECTION_ONE.id){item.learningPathSectionId=D772_SECTION_ONE.id;changed=true}
    }
  }
  const ids=[...lessonIds];
  if(ids.length>1){
    const next={courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,multiLesson:true,lessonIds:ids,confidence:'item-level'};
    if(JSON.stringify(row.learningPath)!==JSON.stringify(next)){row.learningPath=next;changed=true}
  }else if(ids.length===1){
    const lesson=lessonById(ids[0]);
    const next={courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,lessonId:lesson.id,lessonTitle:lesson.title,lessonNumber:lesson.number,confidence:'item-level'};
    if(JSON.stringify(row.learningPath)!==JSON.stringify(next)){row.learningPath=next;changed=true}
  }
  row.learningPathRepair={version:'3.3.27',mode:'item-level',lessonIds:ids,originalSourcePreserved:true};
  return {changed,lessonIds:ids};
}
function itemMatchesLesson(row,item,lessonId){
  if(row?.courseId!=='D772')return true;
  return classifyD772Item(row,item)===lessonId;
}
function classifyGeneric(row,id){
  const head=headingInfo(row);
  const sectionNo=head.sectionNumber||1;
  const title=head.lessonTitle||String(row?.sourceName||'Study Material').replace(/\.[a-z0-9]+$/i,'');
  return {
    courseId:id,sectionId:'auto-section-'+sectionNo,
    sectionTitle:head.sectionTitle?('Section '+sectionNo+': '+head.sectionTitle):('Section '+sectionNo),
    lessonId:'auto-'+sectionNo+'-'+(head.lessonNumber||norm(title).replace(/\s+/g,'-').slice(0,36)||'lesson'),
    lessonTitle:head.lessonNumber?('Lesson '+head.lessonNumber+': '+title):title,
    lessonNumber:head.lessonNumber||null,confidence:head.lessonNumber?'high':'generated'
  };
}
function classifySource(row,id=String(row?.courseId||cid())){
  if(id==='D772'){
    const fixed=classifyD772(row);
    if(fixed)return fixed;
  }
  return classifyGeneric(row,id);
}
function annotateSource(row,id=String(row?.courseId||cid())){
  if(!row)return row;
  if(id==='D772'&&row.courseId==='D772'){
    const tagged=tagD772Generated(row);
    if(tagged.lessonIds.length)return row;
  }
  const next=classifySource(row,id);
  if(next)row.learningPath=next;
  return row;
}
async function hydrate(id=cid()){
  const sourceRows=await MajickMaterialStore.list(id);
  let changed=false;
  for(const row of sourceRows){
    let rowChanged=false;
    if(id==='D772'){
      const repaired=tagD772Generated(row);
      rowChanged=repaired.changed||!row.learningPath;
      if(!row.learningPath)annotateSource(row,id);
    }else if(!row.learningPath?.lessonId){
      annotateSource(row,id);rowChanged=true;
    }
    if(rowChanged){
      try{await MajickMaterialStore.save(row);changed=true}catch(_){}
    }
  }
  cache[id]=sourceRows;
  if(changed&&id==='D772'){
    try{await MajickMaterialStore.syncQuestions(course(id),id)}catch(e){console.warn('D772 lesson bank repair',e)}
  }
  renderPath();renderTutor();
  return {rows:sourceRows,changed};
}
function rows(id=cid()){return (cache[id]||[]).filter(r=>r.active!==false)}
function dynamicSections(id,sourceRows){
  const groups={};
  for(const row of sourceRows){
    const lp=row.learningPath||classifySource(row,id);
    if(!lp)continue;
    if(id==='D772'&&lp.sectionId===D772_SECTION_ONE.id)continue;
    const key=lp.sectionId||'additional';
    groups[key]=groups[key]||{id:key,title:lp.sectionTitle||'Additional Course Material',lessons:[]};
    let lesson=groups[key].lessons.find(x=>x.id===lp.lessonId);
    if(!lesson){
      lesson={id:lp.lessonId,title:lp.lessonTitle||row.sourceName,number:lp.lessonNumber,short:lp.lessonTitle||row.sourceName,keywords:[],goal:'Learn the concepts in this uploaded course material.',visual:['Read','Explain','Practice','Apply','Review'],thinking:['What is the main idea?','What vocabulary do I need?','How would I recognize this concept in a scenario?','What mistake am I most likely to make?'],traps:['Memorizing a definition without understanding when to use it.']};
      groups[key].lessons.push(lesson);
    }
  }
  return Object.values(groups).sort((a,b)=>a.title.localeCompare(b.title)).map(sec=>({...sec,lessons:sec.lessons.sort((a,b)=>(a.number||99)-(b.number||99)||a.title.localeCompare(b.title))}));
}
function sections(id=cid()){
  const sourceRows=rows(id);
  // D772 has exactly one official course section: Section 1. There is no Section 2.
  // Uploaded material is sorted into Lessons 1–4 and the Section 1 Summary/Test only.
  if(id==='D772')return [JSON.parse(JSON.stringify(D772_SECTION_ONE))];
  return dynamicSections(id,sourceRows);
}
function rowHasLesson(row,lessonId,id=cid()){
  if(id==='D772'){
    if(row?.learningPath?.lessonId===lessonId)return true;
    if(row?.learningPath?.lessonIds?.includes?.(lessonId))return true;
    const buckets=['passages','vocabulary','explanations','misconceptionRepair','practiceQuestions'];
    return buckets.some(bucket=>(row?.generated?.[bucket]||[]).some(item=>itemMatchesLesson(row,item,lessonId)));
  }
  const lp=row.learningPath||classifySource(row,id);
  return lp?.lessonId===lessonId;
}
function sourcesForLesson(lesson,id=cid()){
  if(lesson.review){
    const section=sections(id).find(s=>s.lessons.some(l=>l.id===lesson.id));
    const ids=new Set((section?.lessons||[]).filter(l=>!l.review).flatMap(l=>sourcesForLesson(l,id).map(r=>r.id)));
    return rows(id).filter(r=>ids.has(r.id));
  }
  return rows(id).filter(r=>rowHasLesson(r,lesson.id,id));
}
function questionsForLesson(lesson,id=cid()){
  if(id==='D772'){
    if(lesson.review){
      const sec=sections(id).find(s=>s.lessons.some(l=>l.id===lesson.id));
      const lessonIds=new Set((sec?.lessons||[]).filter(l=>!l.review).map(l=>l.id));
      return (course(id).questionBank||[]).filter(q=>lessonIds.has(q.learningPathLessonId)||lessonIds.has(classifyD772Item(rows(id).find(r=>r.id===q.sourceId),q)));
    }
    return (course(id).questionBank||[]).filter(q=>{
      if(q.learningPathLessonId===lesson.id)return true;
      const row=rows(id).find(r=>r.id===q.sourceId);
      return row?classifyD772Item(row,q)===lesson.id:false;
    });
  }
  const srcIds=new Set(sourcesForLesson(lesson,id).map(r=>r.id));
  return (course(id).questionBank||[]).filter(q=>srcIds.has(q.sourceId));
}
function answersForQuestions(qs,id=cid()){
  const ids=new Set((qs||[]).map(q=>q.id));
  return (prog(id).answers||[]).filter(a=>ids.has(a.qid));
}
function officialD772Content(lesson,id=cid()){return id==='D772'&&lesson?D772_SECTION_ONE_CONTENT[lesson.id]||null:null}
function mastery(lesson,id=cid()){
  const src=sourcesForLesson(lesson,id),official=officialD772Content(lesson,id),qs=questionsForLesson(lesson,id),answers=answersForQuestions(qs,id);
  const byId=new Map(qs.map(q=>[q.id,q]));
  const attempts=answers.length,correct=answers.filter(a=>a.correct).length;
  const accuracy=attempts?Math.round(correct/attempts*100):0;
  const recent=answers.slice(-4),recentAccuracy=recent.length?recent.filter(a=>a.correct).length/recent.length:1;
  const rigorCorrect={1:0,2:0,3:0,4:0};
  answers.filter(a=>a.correct).forEach(a=>{
    const r=Number(byId.get(a.qid)?.rigorLevel||1);
    rigorCorrect[Math.max(1,Math.min(4,r))]++;
  });
  let targetRigor=1;
  if(attempts>=2&&accuracy>=55)targetRigor=2;
  if(attempts>=4&&accuracy>=70&&rigorCorrect[2]>=1)targetRigor=3;
  if(attempts>=6&&accuracy>=82&&rigorCorrect[3]>=2)targetRigor=4;
  if(recent.length>=3&&recentAccuracy<.5)targetRigor=Math.max(1,targetRigor-1);

  const sourceCount=src.length+(official?1:0);
  let status='Not Started';
  if(sourceCount){
    if(!attempts)status='Learning';
    else if(recent.length>=3&&recentAccuracy<.5)status='Needs Review';
    else if(attempts>=8&&accuracy>=85&&rigorCorrect[4]>=2)status='Mastered';
    else if(attempts>=5&&accuracy>=78&&rigorCorrect[3]>=2)status='Proficient';
    else status='Developing';
  }
  if(lesson.review&&!sourceCount)status='Not Started';
  return {status,attempts,correct,accuracy,targetRigor,rigorCorrect,recentAccuracy,sourceCount,questionCount:qs.length};
}
function sectionProgress(section,id=cid()){
  const lessons=section.lessons.filter(l=>!l.review);
  const rows=lessons.map(l=>mastery(l,id));
  const score=s=>s.status==='Mastered'?1:s.status==='Proficient'?.82:s.status==='Developing'?.55:s.status==='Learning'?.25:s.status==='Needs Review'?.42:0;
  const pct=rows.length?Math.round(rows.reduce((n,x)=>n+score(x),0)/rows.length*100):0;
  return {pct,ready:lessons.every(l=>mastery(l,id).sourceCount>0),lessons:rows};
}
function selectedLesson(id=cid()){
  const all=sections(id).flatMap(s=>s.lessons);
  const st=tutorState(id);
  let lesson=all.find(l=>l.id===st.selectedLesson);
  if(!lesson){
    lesson=all.find(l=>mastery(l,id).sourceCount>0)||all[0]||null;
    st.selectedLesson=lesson?.id||null;
  }
  return lesson;
}
function findSectionForLesson(lesson,id=cid()){return sections(id).find(s=>s.lessons.some(l=>l.id===lesson?.id))||null}
function lessonNumberLabel(lesson){return lesson.review?'SECTION REVIEW':lesson.number?('LESSON '+lesson.number):'LESSON'}
function lessonItems(sourceRows,bucket,lesson,id=cid()){
  const out=[];
  for(const row of sourceRows){
    for(const item of (row.generated?.[bucket]||[])){
      if(id==='D772'&&!itemMatchesLesson(row,item,lesson.id))continue;
      out.push({...item,sourceName:row.sourceName,sourceId:row.id});
    }
  }
  return out;
}
function dedupePassages(sourceRows,lesson,id=cid()){
  const out=[],seen=new Set();
  for(const p of lessonItems(sourceRows,'passages',lesson,id)){
    const key=norm(p.text);
    if(!key||seen.has(key))continue;
    seen.add(key);out.push(p);
  }
  return out;
}
function dedupeVocab(sourceRows,lesson,id=cid()){
  const out=[],byTerm=new Map();
  for(const v of lessonItems(sourceRows,'vocabulary',lesson,id)){
    const key=norm(v.term);
    if(!key)continue;
    const previous=byTerm.get(key);
    if(previous===undefined){byTerm.set(key,out.length);out.push(v);continue}
    const at=Number(previous);
    if(String(v.definition||'').length>String(out[at]?.definition||'').length)out[at]=v;
  }
  return out;
}
function teachingSentences(text){
  return String(text||'')
    .replace(/\r/g,'')
    .split(/(?<=[.!?])\s+|\n+/)
    .map(x=>x.replace(/^\s*[-*•]\s*/, '').replace(/\s+/g,' ').trim())
    .filter(x=>x.length>=22);
}
function wordSet(text){return new Set(norm(text).split(' ').filter(x=>x.length>2))}
function nearDuplicateTeaching(a,b){
  const na=norm(a),nb=norm(b);
  if(!na||!nb)return false;
  if(na===nb)return true;
  if(Math.min(na.length,nb.length)>=55&&(na.includes(nb)||nb.includes(na)))return true;
  const aa=wordSet(na),bb=wordSet(nb);
  if(!aa.size||!bb.size)return false;
  let shared=0;for(const word of aa)if(bb.has(word))shared++;
  return shared/Math.min(aa.size,bb.size)>=.82;
}
function mergeLessonTeaching(sourceRows,lesson,id=cid()){
  const raw=dedupePassages(sourceRows,lesson,id);
  if(id!=='D772'||lesson.review||!raw.length)return null;
  const sentences=[];
  for(const passage of raw){
    for(const sentence of teachingSentences(passage.text)){
      const similar=sentences.findIndex(existing=>nearDuplicateTeaching(existing,sentence));
      if(similar<0)sentences.push(sentence);
      else if(sentence.length>sentences[similar].length)sentences[similar]=sentence;
    }
  }
  const sourceNames=uniqText(raw.map(p=>p.sourceName).filter(Boolean));
  const text=sentences.slice(0,22).join(' ');
  if(!text)return null;
  return {
    id:'merged-'+lesson.id,
    title:'Complete Lesson '+lesson.number+' Teaching Notes',
    text,
    sourceName:'Merged from '+sourceNames.length+' saved source'+(sourceNames.length===1?'':'s'),
    sourceNames,
    merged:true,
    originalPassageCount:raw.length
  };
}
function chapter(lesson,id=cid()){
  const sourceRows=sourcesForLesson(lesson,id);
  const official=officialD772Content(lesson,id);
  const passages=dedupePassages(sourceRows,lesson,id);
  const mergedTeaching=mergeLessonTeaching(sourceRows,lesson,id);
  const uploadedVocab=dedupeVocab(sourceRows,lesson,id);
  const vocab=[];const vocabSeen=new Set();
  for(const v of [...(official?.vocab||[]).map(x=>({term:x[0],definition:x[1],sourceName:'D772 Section 1 Master Notes'})),...uploadedVocab]){const key=norm(v.term);if(!key||vocabSeen.has(key))continue;vocabSeen.add(key);vocab.push(v)}
  const explanations=uniqText(lessonItems(sourceRows,'explanations',lesson,id),x=>x.explanation);
  const repairs=uniqText(lessonItems(sourceRows,'misconceptionRepair',lesson,id),x=>x.correction);
  const m=mastery(lesson,id);
  return {lesson,section:findSectionForLesson(lesson,id),sourceRows,official,passages,mergedTeaching,vocab,explanations,repairs,mastery:m};
}
function nextStep(m){
  if(!m.sourceCount)return 'Add this lesson’s notes to unlock its tutor chapter.';
  if(!m.attempts)return 'Read the lesson, learn the vocabulary, then start Foundation practice.';
  if(m.status==='Needs Review')return 'Return to the explanation and common traps, then rebuild at a lower rigor.';
  if(m.status==='Learning')return 'Finish the lesson reading and start guided questions.';
  if(m.status==='Developing')return 'Keep practicing. Majick will increase rigor as your accuracy becomes consistent.';
  if(m.status==='Proficient')return 'Move into analysis and OA-style scenarios to prove mastery.';
  if(m.status==='Mastered')return 'Use spaced review and Section Review to keep this lesson retrieval-ready.';
  return 'Continue the learning path.';
}
function startPractice(lesson,id=cid()){
  const qs=questionsForLesson(lesson,id);
  const topics=[...new Set(qs.map(q=>q.topicId).filter(Boolean))];
  if(!topics.length){alert('Add or regenerate lesson notes first so Majick has lesson-specific questions.');return}
  const m=mastery(lesson,id);
  try{
    window.__majickTutorTarget={courseId:id,lessonId:lesson.id,rigor:m.targetRigor,at:Date.now()};
    window.session=null;
    window.startSession('topic',{label:lesson.title+' • Rigor '+m.targetRigor,topics,limit:lesson.review?15:12});
  }catch(e){console.warn('Majick Course Tutor practice',e)}
}
function statusClass(status){return norm(status).replace(/\s+/g,'-')}
function show(name){
  document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
  const panel=document.querySelector('.learnPanel[data-panel="'+name+'"]');if(panel)panel.hidden=false;
  document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-tutor-tab="'+name+'"]')?.classList.add('active');
  document.querySelector('.learnLab')?.classList.toggle('tutorFocus',name==='path'||name==='tutor');
  if(name==='path')renderPath();
  if(name==='tutor')renderTutor();
}
function renderPath(){
  const box=document.getElementById('courseTutorPath');if(!box)return;
  const id=cid(),secs=sections(id);
  const active=selectedLesson(id);
  const pathHero=id==='D772'
    ? '<div class="tutorHero tutorHeroCompact"><div><span>D772 • SECTION 1 • COMPLETE COURSE PATH</span><h3>Four lessons. One Section 1 Summary and Test. No Section 2.</h3><p>The complete Section 1 master notes are built into the Tutor. Extra uploads stay intact and are sorted into the correct lesson without creating duplicate sections.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>'
    : '<div class="tutorHero"><div><span>MAJICK COURSE TUTOR • '+E(id)+'</span><h3>Learn the course in order. Prove each lesson at higher rigor.</h3><p>Your uploaded notes automatically fill this path. Repeated material is deduplicated in the tutor chapter and the active question bank.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>';
  box.innerHTML=pathHero+
    secs.map(sec=>{
      const sp=sectionProgress(sec,id);
      return '<section class="pathSection"><div class="pathSectionHead"><div><span>LEARNING PATH</span><h3>'+E(sec.title)+'</h3></div><div class="pathProgress"><b>'+sp.pct+'%</b><small>'+ (sp.ready?'section material loaded':'add lesson notes as you go')+'</small></div></div><div class="pathRail">'+sec.lessons.map((lesson,i)=>{
        const m=mastery(lesson,id);
        const available=m.sourceCount>0||(lesson.review&&sp.ready);
        return '<button class="pathLesson '+statusClass(m.status)+' '+(lesson.id===active?.id?'selected':'')+'" data-tutor-lesson="'+E(lesson.id)+'"><i>'+(lesson.review?'✓':lesson.number||i+1)+'</i><div><small>'+E(lessonNumberLabel(lesson))+'</small><b>'+E(lesson.title)+'</b><span>'+E(m.status)+' • '+m.sourceCount+' source'+(m.sourceCount===1?'':'s')+' • '+m.attempts+' attempts</span></div><em>'+(available?'Open →':'Waiting for notes')+'</em></button>';
      }).join('')+'</div></section>';
    }).join('');
  document.getElementById('continueTutor')?.addEventListener('click',()=>show('tutor'));
  box.querySelectorAll('[data-tutor-lesson]').forEach(btn=>btn.addEventListener('click',()=>{
    tutorState(id).selectedLesson=btn.dataset.tutorLesson;try{save()}catch(_){}
    show('tutor');
  }));
}
function visualHtml(lesson){
  const v=lesson.visual||['Learn','Practice','Apply','Review'];
  return '<div class="tutorVisual">'+v.map((x,i)=>'<div><span>'+E(x)+'</span></div>'+(i<v.length-1?'<b>→</b>':'')).join('')+'</div>';
}
function helpFor(lesson){return D772_TUTOR_HELP[lesson?.id]||null}
function relatedMistakesHtml(lesson,id=cid()){
  const qs=questionsForLesson(lesson,id),byId=new Map(qs.map(q=>[q.id,q]));
  const wrong=(prog(id).answers||[]).filter(a=>a&&!a.correct&&byId.has(a.qid)).slice(-4).reverse();
  if(wrong.length){
    return '<div class="tutorAssistMistakes"><p>These are recent misses from this lesson. Re-read the clue that separates the concepts before answering again.</p>'+wrong.map((a,i)=>{const q=byId.get(a.qid)||{};return '<article><small>RECENT MISS '+(i+1)+'</small><b>'+E(q.prompt||'Lesson question')+'</b>'+(q.why?'<p>'+E(q.why)+'</p>':'')+'</article>'}).join('')+'</div>';
  }
  return '<div class="tutorAssistMistakes"><p>You do not have a recent wrong answer saved for this lesson yet. Watch these high-priority traps:</p><ul>'+(lesson.traps||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></div>';
}
function quickQuizHtml(lesson,id=cid()){
  const built=helpFor(lesson)?.quickCheck;
  if(built){
    return '<div class="tutorQuickQuiz"><p class="tutorQuickPrompt">'+E(built.prompt)+'</p><div class="tutorQuickChoices">'+built.choices.map((x,i)=>'<button type="button" data-tutor-quick-choice="'+i+'">'+String.fromCharCode(65+i)+'. '+E(x)+'</button>').join('')+'</div><div class="tutorQuickFeedback" aria-live="polite"></div></div>';
  }
  const q=questionsForLesson(lesson,id)[0];
  if(q&&Array.isArray(q.choices)&&q.choices.length){
    return '<div class="tutorQuickQuiz"><p class="tutorQuickPrompt">'+E(q.prompt||'Quick check')+'</p><div class="tutorQuickChoices">'+q.choices.map((x,i)=>'<button type="button" data-tutor-bank-choice="'+i+'">'+String.fromCharCode(65+i)+'. '+E(x)+'</button>').join('')+'</div><div class="tutorQuickFeedback" aria-live="polite"></div></div>';
  }
  return '<p>Lesson-specific adaptive questions will appear here after your question bank is available.</p>';
}
function renderTutorAssist(kind,lesson,ch,id=cid()){
  const panel=document.getElementById('tutorAssistPanel');if(!panel)return;
  const help=helpFor(lesson);
  let title='',body='';
  if(kind==='simple'){
    title='Explain it simpler';
    body='<p>'+E(help?.simple||lesson.goal||'Focus on the main idea, then identify the clue in the scenario that tells you which concept applies.')+'</p>';
  }else if(kind==='example'){
    title='Show me an example';
    body='<p>'+E(help?.example||'Use the current lesson goal and compare it with one concrete example from your uploaded notes.')+'</p>';
  }else if(kind==='mistakes'){
    title='Related mistakes';
    body=relatedMistakesHtml(lesson,id);
  }else if(kind==='quiz'){
    title='Quick check';
    body=quickQuizHtml(lesson,id);
  }
  panel.hidden=false;
  panel.innerHTML='<div class="tutorAssistHead"><div><small>MAJICK TUTOR • '+E(lessonNumberLabel(lesson))+'</small><h3>'+E(title)+'</h3></div><button type="button" id="tutorAssistClose" aria-label="Close tutor help">×</button></div><div class="tutorAssistBody">'+body+'</div>';
  document.getElementById('tutorAssistClose')?.addEventListener('click',()=>{panel.hidden=true;panel.innerHTML=''});
  if(kind==='quiz'&&help?.quickCheck){
    panel.querySelectorAll('[data-tutor-quick-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const picked=Number(btn.dataset.tutorQuickChoice),correct=picked===help.quickCheck.answer;
      panel.querySelectorAll('[data-tutor-quick-choice]').forEach(x=>x.disabled=true);
      const feedback=panel.querySelector('.tutorQuickFeedback');
      if(feedback)feedback.innerHTML='<b>'+(correct?'✓ Correct':'Not yet')+'</b><p>'+E(help.quickCheck.rationale)+'</p>';
      btn.classList.add(correct?'correct':'incorrect');
    }));
  }
  if(kind==='quiz'&&!help?.quickCheck){
    const q=questionsForLesson(lesson,id)[0];
    if(q&&Array.isArray(q.choices)){
      const correctIndex=q.choices.findIndex(x=>String(x)===String(q.answer));
      panel.querySelectorAll('[data-tutor-bank-choice]').forEach(btn=>btn.addEventListener('click',()=>{
        const picked=Number(btn.dataset.tutorBankChoice),correct=picked===correctIndex;
        panel.querySelectorAll('[data-tutor-bank-choice]').forEach(x=>x.disabled=true);
        const feedback=panel.querySelector('.tutorQuickFeedback');
        if(feedback)feedback.innerHTML='<b>'+(correct?'✓ Correct':'Not yet')+'</b>'+(q.why?'<p>'+E(q.why)+'</p>':'');
        btn.classList.add(correct?'correct':'incorrect');
      }));
    }
  }
}
function officialTeachingHtml(official){
  if(!official)return '';
  return '<article class="tutorOfficialTeaching"><small>AUTHORITATIVE D772 • SECTION 1 MASTER NOTES</small><h4>'+E(official.overview)+'</h4>'+(official.teach||[]).map(x=>'<div class="tutorOfficialTopic"><b>'+E(x.title)+'</b><p>'+E(x.text)+'</p></div>').join('')+((official.memory||[]).length?'<div class="tutorMemoryCues"><small>MEMORY CUES</small><ul>'+official.memory.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></div>':'')+'</article>';
}
function openLesson(lessonId,helpKind=null,id='D772'){
  try{
    if(window.S?.activeCourse!==id&&typeof window.switchCourse==='function')window.switchCourse(id);
    const lesson=sections(id).flatMap(s=>s.lessons).find(l=>l.id===lessonId)||selectedLesson(id);
    if(!lesson)return;
    const st=tutorState(id);
    st.selectedLesson=lesson.id;
    try{save()}catch(_){}
    if(typeof navigate==='function')navigate('learninglab');
    else {S.screen='learninglab';render()}
    setTimeout(()=>{
      show('tutor');
      if(helpKind){
        const ch=chapter(lesson,id);
        renderTutorAssist(helpKind,lesson,ch,id);
      }
    },120);
  }catch(e){console.warn('Open Majick Tutor lesson',e)}
}
function renderTutor(){
  const box=document.getElementById('courseTutorLesson');if(!box)return;
  const id=cid(),lesson=selectedLesson(id);
  if(!lesson){box.innerHTML='<div class="learnEmpty">Add course material to begin your tutor path.</div>';return}
  const ch=chapter(lesson,id),m=ch.mastery;
  const sourceNames=uniqText(ch.sourceRows.map(r=>r.sourceName));
  const deep=ch.mergedTeaching?[ch.mergedTeaching]:ch.passages.slice(0,5);
  const uploadedEvidence=!ch.official&&deep.length?deep.map((p,i)=>'<article class="'+(p.merged?'tutorMergedTeaching':'')+'"><small>'+(p.merged?'MERGED LESSON CHAPTER • '+p.originalPassageCount+' NOTE PASSAGES REVIEWED':'READING '+(i+1)+' • '+E(p.sourceName))+'</small><h4>'+E(p.title)+'</h4><p>'+E(p.text)+'</p>'+(p.merged?'<span class="tutorMergeNote">Repeated and overlapping material was combined here. Your original uploads were not rewritten.</span>':'')+'</article>').join(''):'';
  const sourceEvidence=officialTeachingHtml(ch.official)+uploadedEvidence||'<div class="tutorLocked">Upload notes for this lesson and Majick will build its teaching chapter here.</div>';
  box.innerHTML='<div class="tutorLessonHead"><div><button class="tutorBack" id="tutorBack">← Course Path</button><span>'+E(ch.section?.title||id)+' • '+E(lessonNumberLabel(lesson))+'</span><h2>'+E(lesson.title)+'</h2><p>'+E(lesson.goal||'Learn and apply this lesson.')+'</p></div><div class="masteryBadge '+statusClass(m.status)+'"><small>MASTERY</small><b>'+E(m.status)+'</b><span>'+m.accuracy+'% • target rigor '+m.targetRigor+'</span></div></div>'+
    '<div class="tutorNext"><b>What Majick wants you to do next:</b> '+E(nextStep(m))+'</div>'+
    '<section class="tutorHelpBar" aria-label="Majick Tutor help"><div><small>ASK MAJICK ABOUT THIS LESSON</small><b>Use help without leaving the page</b></div><div class="tutorHelpButtons"><button type="button" data-tutor-help="simple">Explain Simpler</button><button type="button" data-tutor-help="example">Give Me an Example</button><button type="button" data-tutor-help="quiz">Quiz Me on This Page</button><button type="button" data-tutor-help="mistakes">Related Mistakes</button></div></section><section id="tutorAssistPanel" class="tutorAssistPanel" hidden></section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>1</span><div><small>TEACH ME</small><h3>Build the idea before memorizing it</h3></div></div>'+sourceEvidence+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>2</span><div><small>SEE IT</small><h3>A visual thinking path</h3></div></div>'+visualHtml(lesson)+'</section>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>3</span><div><small>VOCABULARY IN CONTEXT</small><h3>Words you need to recognize</h3></div></div>'+(ch.vocab.length?'<div class="tutorVocab">'+ch.vocab.slice(0,14).map(v=>'<details><summary>'+E(v.term)+'</summary><p>'+E(v.definition)+'</p></details>').join('')+'</div>':'<p class="tutorMuted">Vocabulary will populate from this lesson’s notes.</p>')+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>4</span><div><small>HOW TO THINK THROUGH IT</small><h3>Use this when a question feels confusing</h3></div></div><ol class="thinkingSteps">'+(lesson.thinking||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></section></div>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock trapBlock"><div class="tutorBlockTitle"><span>5</span><div><small>COMMON TRAPS</small><h3>What Majick should catch you doing</h3></div></div><ul>'+[...(lesson.traps||[]),...ch.repairs.slice(0,3).map(r=>r.correction)].slice(0,6).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>6</span><div><small>PROVE IT</small><h3>Adaptive lesson practice</h3></div></div><div class="proveStats"><span><b>'+m.questionCount+'</b> lesson questions</span><span><b>'+m.attempts+'</b> attempts</span><span><b>'+m.accuracy+'%</b> accuracy</span><span><b>R'+m.targetRigor+'</b> next rigor</span></div><button class="btn primary" id="tutorPractice" '+(m.questionCount?'':'disabled')+'>'+ (m.status==='Needs Review'?'Repair this lesson':'Start adaptive lesson practice')+' →</button></section></div>'+
    '<section class="tutorSources"><div><b>Source coverage</b><span>'+E(ch.official?('D772 Section 1 Master Notes'+(sourceNames.length?' • '+sourceNames.join(' • '):'')):(sourceNames.length?sourceNames.join(' • '):'No lesson source uploaded yet'))+'</span></div><button class="tutorManageSources" id="tutorManageSources" type="button">Manage or delete source notes →</button></section>';
  document.getElementById('tutorBack')?.addEventListener('click',()=>show('path'));
  document.getElementById('tutorPractice')?.addEventListener('click',()=>startPractice(lesson,id));
  document.getElementById('tutorManageSources')?.addEventListener('click',()=>{try{navigate('addmaterial')}catch(_){}});
  box.querySelectorAll('[data-tutor-help]').forEach(btn=>btn.addEventListener('click',()=>renderTutorAssist(btn.dataset.tutorHelp,lesson,ch,id)));
}
const baseRender=MajickLearningLab.render;
MajickLearningLab.render=function(){
  let h=baseRender();
  h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-tutor-tab="path">Course Path</button><button type="button" data-tutor-tab="tutor">Course Tutor</button>');
  h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="path"><div id="courseTutorPath"></div></section><section class="learnPanel" data-panel="tutor" hidden><div id="courseTutorLesson"></div></section>');
  return h;
};
const baseBind=MajickLearningLab.bind;
MajickLearningLab.bind=function(){
  baseBind();
  document.querySelectorAll('[data-tutor-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.tutorTab)}));
  setTimeout(()=>hydrate().then(()=>show('path')),30);
};
const baseRefresh=MajickLearningLab.refresh;
MajickLearningLab.refresh=function(){baseRefresh();hydrate()};
window.MajickCourseTutor={VERSION,D772_SECTION_ONE,D772_SECTION_ONE_CONTENT,D772_TUTOR_HELP,hydrate,sections,classifySource,annotateSource,tagD772Generated,classifyD772Item,d772Segments,sourcesForLesson,questionsForLesson,mastery,sectionProgress,chapter,mergeLessonTeaching,officialD772Content,startPractice,show,renderPath,renderTutor,renderTutorAssist,openLesson,selectedLesson};
})();
