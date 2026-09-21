(function(){
'use strict';

const TARGET=100;
function sentenceList(text){
  return String(text||'')
    .replace(/\r/g,' ')
    .replace(/\s+/g,' ')
    .split(/(?<=[.!?])\s+/)
    .map(s=>s.trim())
    .filter(s=>s.length>=32&&s.length<=520);
}
function keyWords(text){
  const stop=new Set('the a an and or but if then than to of in on for from with by as at is are was were be been being this that these those it its their there can may might will would should could about into through during using use used which when where how why what who have has had also more most some any each other such not only very'.split(' '));
  const counts={};
  const found=String(text||'').toLowerCase().match(/[a-z][a-z-]{3,}/g)||[];
  found.forEach(w=>{if(!stop.has(w))counts[w]=(counts[w]||0)+1;});
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]||b[0].length-a[0].length).map(x=>x[0]);
}
function cap(s){return s?String(s).charAt(0).toUpperCase()+String(s).slice(1):''}
function escapeRx(s){return String(s).replace(/[.*+?^$()|[\]\\]/g,'\\$&')}
function hash(s){
  let h=2166136261;
  for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36);
}
function slug(s){return String(s||'concept').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,38)||'concept'}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

const D772_SECTION_ID='d772-section-1';
const D772_LESSONS={
  1:{id:'d772-s1-l1',title:'Understanding Data Collection Methods'},
  2:{id:'d772-s1-l2',title:'Recognizing Bias in Data Collection'},
  3:{id:'d772-s1-l3',title:'Unveiling Data Misrepresentations'},
  4:{id:'d772-s1-l4',title:'Conclusions About Data Findings'}
};
function d772Item(lesson,concept,rigor,prompt,options,answer,why,clue){
  const meta=D772_LESSONS[lesson];
  return {lesson,concept,rigor,prompt,options,answer,why,clue,lessonId:meta.id,lessonTitle:meta.title};
}
const D772_WGU_TERMS={
  'population vs. sample':'Population vs. sample',
  'parameter vs. statistic':'Parameter vs. statistic',
  'individual variable data':'Individuals vs. variables vs. data',
  'quantitative vs. categorical':'Quantitative variables vs. categorical variables',
  'stratified sampling':'Stratified sampling',
  'cluster sampling':'Cluster sampling',
  'systematic sampling':'Systematic sampling',
  'observational vs. experiment':'Observational study vs. experiment',
  'explanatory vs. response':'Explanatory variable vs. response variable',
  'random sampling vs. assignment':'Random sampling vs. randomization',
  'blinding':'Single-blind vs. double-blind',
  'placebo effect':'Placebo vs. placebo effect',
  'sampling bias':'Sampling bias',
  'voluntary response bias':'Volunteer sample vs. voluntary response bias',
  'convenience sample':'Convenience sample',
  'sampling frame error':'Sampling frame vs. sampling frame error',
  'non-response bias':'Non-response bias',
  'response bias':'Response bias',
  'lack of anonymity':'Perceived lack of anonymity',
  'loaded question':'Loaded question',
  'self-interest study':'Self-interest study',
  'systematic sampling nuance':'Systematic sampling',
  'truncated axis':'Misrepresenting data with a truncated axis',
  'two-dimensional icons':'Misrepresenting data with scaled pictures/icons',
  '3-D pie chart':'Misrepresenting data with a 3-D display',
  'sample size':'Sample size and random chance',
  'large biased sample':'Sample size vs. sampling bias',
  'statistical significance':'Statistical significance',
  'practical significance':'Statistical significance vs. practical significance',
  'fabrication':'Fabricating data sets',
  'falsification alteration':'Altering existing data / falsifying data',
  'subject count misrepresentation':'Misrepresenting the number of subjects',
  'intentional omission':'Intentionally omitting relevant data / falsifying data',
  'duplicating data':'Duplicating data / falsifying data',
  'secondary source misrepresentation':'Misrepresenting data',
  'association vs. causation':'Association vs. causal relationship',
  'confounding variable':'Confounding variable',
  'experiment and causation':'Well-designed experiment and causal conclusion',
  'scatterplot shape':'Scatterplot shape: linear, nonlinear, or no pattern/no correlation',
  'positive correlation':'Positive correlation',
  'negative correlation':'Negative correlation',
  'strength':'Strength of the relationship',
  'outlier':'Outlier',
  'correlation not causation':'Association does not imply causation'
};
function wguChoiceLabel(value){
  const exact={
    'Simple random':'Simple random sample',
    'Stratified':'Stratified sampling',
    'Cluster':'Cluster sampling',
    'Systematic':'Systematic sampling',
    'Convenience':'Convenience sample',
    'Loaded wording':'Loaded question',
    'Double blinding':'Double-blind',
    'Cluster bias':'Cluster sampling',
    'Causal':'Causal relationship',
    'Positive':'Positive correlation',
    'Negative':'Negative correlation',
    'Strong positive linear':'Strong positive relationship',
    'Weak positive linear':'Weak positive relationship',
    'Strong negative linear':'Strong negative relationship'
  };
  return exact[value]||value;
}
function wguQuestionLanguage(x){
  const copy=Object.assign({},x);
  copy.options=(x.options||[]).map(wguChoiceLabel);
  copy.answer=wguChoiceLabel(x.answer);
  copy.wguTerm=D772_WGU_TERMS[x.concept]||x.concept;
  return copy;
}
const D772_SCENARIO_BANK=[
  d772Item(1,'population vs. sample',1,'A district wants to study all 5,000 teachers and surveys 400 of them. What is the population?',['All 5,000 teachers','The 400 surveyed teachers','Only teachers who responded','The average planning time'],'All 5,000 teachers','WGU is testing whether you can separate the full group of interest from the smaller group actually studied. The population is the entire group the researcher wants to understand.','Look for the words all, entire, or full group.'),
  d772Item(1,'population vs. sample',1,'A university has 20,000 students and randomly surveys 600. What is the sample?',['All 20,000 students','The 600 surveyed students','Every student on the roster','The university itself'],'The 600 surveyed students','WGU is testing population versus sample. The sample is the smaller group from which data are actually collected.','Ask: Who was actually measured or surveyed?'),
  d772Item(1,'parameter vs. statistic',2,'A random sample of 400 teachers has an average planning time of 7.5 hours. What does 7.5 represent?',['A parameter','A statistic','A population','A categorical variable'],'A statistic','WGU is testing parameter versus statistic. A numerical summary calculated from a sample is a statistic.','Sample number = statistic. Population number = parameter.'),
  d772Item(1,'individual variable data',2,'Researchers record each student’s age, height, grade level, and favorite subject. What is “height” in this study?',['An individual','A variable','The population','A statistic'],'A variable','WGU is testing whether you can distinguish who is studied from what is measured about them. Height is a characteristic measured on each student, so it is a variable.','Individual = who/what. Variable = what about them.'),
  d772Item(1,'quantitative vs. categorical',2,'A dataset records student ID number 10023. How should student ID be classified?',['Quantitative because it contains digits','Categorical because it is a label','A parameter','A response variable'],'Categorical because it is a label','WGU is testing whether the numbers have meaningful arithmetic value. Student ID uses digits only as a label, so averaging IDs would be meaningless.','Ask whether arithmetic on the number would make sense.'),
  d772Item(1,'stratified sampling',2,'A district separates teachers into elementary, middle, and high school groups and randomly selects 40 teachers from each group. Which sampling method is used?',['Simple random sample','Stratified sampling','Cluster sampling','Systematic sampling'],'Stratified sampling','WGU is testing recognition of stratified sampling. The population is divided into groups and some people are randomly sampled from every group.','Stratified = SOME FROM ALL groups.'),
  d772Item(1,'cluster sampling',2,'Researchers randomly choose five schools and survey every teacher in those schools. Which sampling method is used?',['Simple random','Stratified','Cluster','Systematic'],'Cluster sampling','WGU is testing recognition of cluster sampling. Entire selected groups are included.','Cluster = ALL FROM SOME groups.'),
  d772Item(1,'systematic sampling',2,'A researcher chooses a random starting point on a roster and then selects every 15th person. Which sampling method is used?',['Simple random','Stratified','Cluster','Systematic'],'Systematic sampling','WGU is testing recognition of systematic sampling. The defining clue is a random start followed by every nth individual.','Every nth person = systematic.'),
  d772Item(1,'observational vs. experiment',3,'Researchers record participants’ usual caffeine intake and exam scores without assigning caffeine amounts. What type of study is this?',['Experiment','Observational study','Randomized controlled trial','Double-blind study'],'Observational study','WGU is testing whether the researcher imposed a treatment. Because caffeine intake was only observed, this is observational.','No assigned treatment = observational.'),
  d772Item(1,'observational vs. experiment',3,'Researchers randomly assign participants to receive a medication or placebo and then compare outcomes. What type of study is this?',['Sample survey','Observational study','Experiment','Convenience sample'],'Experiment','WGU is testing whether a treatment was deliberately imposed. Randomly assigning medication or placebo makes this an experiment.','Researcher changes something = experiment.'),
  d772Item(1,'explanatory vs. response',2,'Researchers study whether tutoring hours affect final math scores. Which variable is the response variable?',['Tutoring hours','Final math score','Student ID','Assignment group'],'Final math score','WGU is testing explanatory versus response variables. The response variable is the outcome being measured.','Response = the outcome that responds.'),
  d772Item(1,'random sampling vs. assignment',3,'A study randomly selects people from a city and then randomly assigns those selected people to treatment groups. Which statement is correct?',['Both steps are random sampling','Both steps are random assignment','Selection is random sampling; group placement is random assignment','Selection is random assignment; group placement is random sampling'],'Selection is random sampling; group placement is random assignment','WGU is testing two different uses of randomness. Sampling determines who enters the study; assignment determines which treatment group they enter.','Random sampling = WHO. Random assignment = WHERE.'),
  d772Item(1,'blinding',2,'Participants do not know whether they receive medication or placebo, but the researchers interacting with them do know. What design is this?',['Control group','Single-blind','Double-blind','Placebo'],'Single-blind','WGU is testing single-blind versus double-blind design. Only the participants are unaware of treatment assignment.','Single-blind = participants do not know.'),
  d772Item(1,'blinding',2,'Neither participants nor the researchers interacting with them know treatment assignments. What design is this?',['Single-blind','Double-blind','Observational','Systematic'],'Double-blind','WGU is testing blinding. In a double-blind study, both participants and interacting researchers are unaware of treatment assignment.','Double-blind = participants + interacting researchers do not know.'),
  d772Item(1,'placebo effect',3,'A participant reports feeling better after receiving an inactive pill because they expected treatment to help. What best explains the improvement?',['Sampling bias','Placebo effect','Non-response bias','Replication'],'Placebo effect','WGU is testing placebo versus placebo effect. The inactive pill is the placebo; the improvement caused by expectation is the placebo effect.','Placebo = inactive treatment. Placebo effect = response from expectation.'),

  d772Item(2,'sampling bias',3,'A city wants to estimate exercise habits of all adults but surveys people leaving a gym. What is the main problem?',['Response bias','Sampling bias','Double blinding','Random chance only'],'Sampling bias','WGU is testing whether the people selected represent the target population. Gym-goers are more likely to exercise than adults in general.','Wrong or unbalanced people entering the sample = sampling bias.'),
  d772Item(2,'voluntary response bias',3,'A news website posts an optional poll about a controversial policy. People with strong opinions are most likely to answer. What bias is most likely?',['Non-response bias','Voluntary response bias','Sampling frame error','Placebo effect'],'Voluntary response bias','WGU is testing self-selection. People choose themselves into the sample, and strong opinions may be overrepresented.','People choose themselves IN = voluntary response.'),
  d772Item(2,'convenience sample',2,'A professor surveys only students in her own class because they are easiest to reach. What type of sample is this?',['Cluster','Convenience','Stratified','Systematic'],'Convenience','WGU is testing how participants were selected. The researcher chose people because they were easy to access.','Researcher picks easy-to-reach people = convenience.'),
  d772Item(2,'sampling frame error',3,'A researcher wants to study all university students but randomly samples from a directory containing only students who live on campus. What is the main problem?',['The random selection was invalid','Sampling frame error','Response bias','Placebo effect'],'Sampling frame error','WGU is testing whether the list used for selection covers the target population. Commuter students are absent from the sampling frame.','A random draw cannot fix a list that leaves part of the population out.'),
  d772Item(2,'non-response bias',3,'A random sample of teachers is selected, but teachers with the lowest job satisfaction are much less likely to return the survey. What bias is present?',['Voluntary response bias','Non-response bias','Convenience bias','Loaded wording'],'Non-response bias','WGU is testing what happens after people are already selected. Selected people who do not respond differ systematically from those who do.','Selected people fail to respond = non-response.'),
  d772Item(2,'response bias',3,'Participants exaggerate how often they exercise because they want to appear healthier. What type of bias is this?',['Sampling bias','Response bias','Cluster sampling','Sampling frame error'],'Response bias','WGU is testing whether answers are accurate. The people are in the sample, but social pressure changes what they report.','Right people, inaccurate answers = response bias.'),
  d772Item(2,'lack of anonymity',3,'Employees are asked to rate their supervisor, but their names are printed on the surveys. Some employees give falsely positive ratings because they fear retaliation. What is the most specific problem?',['Convenience sampling','Perceived lack of anonymity','Systematic sampling','Random variation'],'Perceived lack of anonymity','WGU is testing a specific source of response bias. Fear that answers can be traced back to the respondent can distort responses.','No anonymity → fear → softened or dishonest answers.'),
  d772Item(2,'loaded question',3,'A survey asks, “Don’t you agree our excellent new program deserves more funding?” What is the primary problem?',['Non-response bias','Loaded question','Sampling frame error','Cluster sampling'],'Loaded question','WGU is testing whether wording pushes respondents toward an answer. Words such as “excellent” and “don’t you agree” signal biased wording.','Look for one-sided or emotionally loaded wording.'),
  d772Item(2,'self-interest study',4,'A supplement company funds its own study and reports that its supplement improves memory. What is the best evaluation?',['The result must be false','The study should be accepted without question','The financial stake is a credibility concern that calls for closer review of methods and reporting','The study is automatically an experiment'],'The financial stake is a credibility concern that calls for closer review of methods and reporting','WGU is testing how to interpret self-interest. A conflict of interest raises a credibility concern but does not automatically prove fraud.','Self-interest = reason for scrutiny, not automatic proof of false data.'),
  d772Item(2,'systematic sampling nuance',4,'A researcher selects every 20th person from a complete list after a random starting point. No repeating pattern in the list is described. What is the best conclusion?',['The sample is automatically biased','This is systematic sampling and is not automatically biased','This is cluster sampling','This is voluntary response sampling'],'This is systematic sampling and is not automatically biased','WGU is testing whether you can separate a sampling method from a bias claim. Systematic sampling is not biased unless the list pattern and interval create unequal representation.','Do not label systematic sampling biased unless the scenario gives a reason.'),

  d772Item(3,'truncated axis',3,'A bar chart compares pass rates of 96% and 94%, but the y-axis begins at 92%. The bars look dramatically different. What is misleading?',['The sample is too large','The truncated y-axis exaggerates the difference','The study is double-blind','The variables are categorical'],'The truncated y-axis exaggerates the difference','WGU is testing whether the graph’s visual impression matches the actual numerical difference. A bar chart with a truncated baseline can magnify a small change.','Read the axis before trusting the bar heights.'),
  d772Item(3,'two-dimensional icons',3,'An infographic represents twice as many customers by making a person-shaped icon twice as tall and twice as wide. Why is this misleading?',['The icon area grows much more than twice','The sample becomes biased','The data become categorical','The graph proves causation'],'The icon area grows much more than twice','WGU is testing visual scaling. Increasing both height and width makes area grow faster than the underlying value.','Pictures tempt the eye to compare area, not just length.'),
  d772Item(3,'3-D pie chart',2,'A 3-D pie chart shows four categories that are each 25%, but the front slice appears larger. What causes the distortion?',['Sampling bias','Perspective from the 3-D display','Random assignment','Statistical significance'],'Perspective from the 3-D display','WGU is testing misleading graphical presentation. Tilting a pie chart can make equal slices appear unequal.','3-D perspective can distort perceived size.'),
  d772Item(3,'sample size',3,'A study of six people finds that a treatment worked for all six and then claims the treatment works for everyone. What is the most obvious improvement?',['Use fewer participants','Substantially increase the sample size','Remove the control group','Use a 3-D graph'],'Substantially increase the sample size','WGU is testing the effect of sample size on random variation. Six observations are too few for a sweeping population claim.','Small samples bounce around more because chance has more influence.'),
  d772Item(3,'large biased sample',4,'A survey has 50,000 responses, but all respondents were recruited from a group that strongly supports the issue being studied. Which statement is best?',['The huge sample guarantees accuracy','The sample can still be biased despite its large size','Large samples eliminate sampling bias','The result must be statistically insignificant'],'The sample can still be biased despite its large size','WGU is testing the difference between random variation and systematic bias. A large sample reduces random fluctuation but cannot fix biased selection.','Large does not automatically mean representative.'),
  d772Item(3,'statistical significance',3,'A study reports a statistically significant result. What does that mean in D772?',['The effect is definitely large','The result is unlikely to be explained by random chance alone under the statistical method used','The study is automatically unbiased','The hypothesis is proven with certainty'],'The result is unlikely to be explained by random chance alone under the statistical method used','WGU is testing the technical meaning of statistical significance. It concerns how surprising the observed result would be under a chance-based model.','Statistically significant ≠ large, important, or certain.'),
  d772Item(3,'practical significance',4,'A very large study finds a statistically significant 0.2-point increase in test scores. What should you conclude about practical importance?',['The increase must be educationally important','Statistical significance alone does not show that the effect is large enough to matter','The result proves causation','The study must have a small sample'],'Statistical significance alone does not show that the effect is large enough to matter','WGU is testing statistical versus practical significance. A tiny effect can be statistically significant in a very large sample.','Ask two different questions: unlikely by chance? meaningful in real life?'),
  d772Item(3,'fabrication',3,'A researcher creates 50 survey responses for participants who never existed. What is this?',['Misleading graph design','Fabricating data','Non-response bias','Replication'],'Fabricating data','WGU is testing research-integrity vocabulary. Fabrication means inventing data or results that were never collected.','Fabrication = make it up.'),
  d772Item(3,'falsification alteration',3,'A researcher changes several collected scores because the original values contradict the preferred hypothesis. What is this?',['Legitimate exclusion','Altering or falsifying data','Sampling frame error','Practical significance'],'Altering or falsifying data','WGU is testing falsification. The observations existed, but the researcher deliberately changed the research record.','Fabrication invents; falsification changes or hides what happened.'),
  d772Item(3,'subject count misrepresentation',3,'A report claims that 2,500 participants were studied when only 250 actually participated. What is the problem?',['Misrepresenting the number of subjects','Non-response bias','Systematic sampling','A placebo effect'],'Misrepresenting the number of subjects','WGU is testing deliberate data misrepresentation or falsification. The reported sample size does not match the actual research record.','Check whether the reported number of subjects is truthful.'),
  d772Item(3,'intentional omission',4,'A researcher removes a valid trial solely because it showed no treatment effect and weakens the preferred conclusion. What is this?',['Transparent data cleaning','Intentional omission or falsification','Random variation','Stratified sampling'],'Intentional omission or falsification','WGU is testing the difference between legitimate exclusion and hidden removal of inconvenient data. A valid result cannot be deleted just because it hurts the hypothesis.','If the reason is “I do not like the result,” think falsification.'),
  d772Item(3,'duplicating data',4,'A researcher copies every observation four times and treats the copies as new participants. What is the main problem?',['The study now has stronger replication','The sample size is artificially inflated without new independent evidence','The data become categorical','The graph must start at zero'],'The sample size is artificially inflated without new independent evidence','WGU is testing why duplicated data are misleading. Copies do not add new independent information even though they make n look larger.','Repeated copies are not new observations.'),
  d772Item(3,'secondary source misrepresentation',4,'A study finds a tiny statistically significant difference, but an advertisement says “Science proves a huge benefit.” What is the main problem?',['The advertisement may be misrepresenting what the original study supports','The study is automatically fabricated','The sample must be a cluster sample','Statistical significance always means a huge effect'],'The advertisement may be misrepresenting what the original study supports','WGU is testing whether a secondary source makes a broader claim than the original evidence justifies.','Compare the headline with what the original study actually measured and found.'),

  d772Item(4,'association vs. causation',3,'An observational study finds that people who sleep more tend to have lower blood pressure. What conclusion is justified?',['More sleep definitely causes lower blood pressure','There is an association, but causation is not established','There is no relationship','The study is a randomized experiment'],'There is an association, but causation is not established','WGU is testing the limit of observational studies. They can show variables move together, but unmeasured factors may explain the relationship.','Observe = association. Experiment = causation may be justified.'),
  d772Item(4,'confounding variable',4,'People who use more sunscreen are also more likely to develop skin cancer in an observational study. Which factor could confound this association?',['Sun exposure','The color of the graph','Participant ID number','The sample mean'],'Sun exposure','WGU is testing confounding. People with more sun exposure may use more sunscreen and also have greater UV exposure, which affects skin-cancer risk.','Ask whether a third variable is connected to both measured variables.'),
  d772Item(4,'confounding variable',3,'Ice cream sales and shark attacks both rise during summer. Which variable best explains the association?',['Ice cream flavor','Temperature or season','Sampling frame','Placebo assignment'],'Temperature or season','WGU is testing whether a third variable can create an association. Warm weather increases both ice cream purchases and swimming activity.','A confounder can influence both variables without either causing the other.'),
  d772Item(4,'experiment and causation',4,'A gardener randomly assigns similar plants to receive coffee grounds or no coffee grounds while keeping water and sunlight similar. The treatment group grows more. What conclusion may be supported?',['Only an association may be supported','A causal conclusion may be supported','Coffee grounds are a confounding variable','The result proves the effect for every plant species'],'A causal conclusion may be supported','WGU is testing when causation may be justified. A treatment was imposed, groups were assigned, and other important conditions were controlled.','Manipulation + comparison + random assignment strengthens causal evidence.'),
  d772Item(4,'scatterplot shape',2,'A scatterplot forms a clear J-shaped curve. How should the shape be described?',['Linear','Nonlinear','No relationship','Negative because it curves downward'],'Nonlinear','WGU is testing scatterplot shape. A clear curved pattern is nonlinear, not “no relationship.”','Nonlinear still means there can be a strong relationship.'),
  d772Item(4,'positive correlation',2,'Points on a scatterplot generally rise from bottom-left to top-right. What is the trend?',['Positive correlation','Negative correlation','No correlation','Causal relationship'],'Positive correlation','WGU is testing direction of a linear relationship. Higher x-values tend to occur with higher y-values.','Positive = rises left to right.'),
  d772Item(4,'negative correlation',2,'Points on a scatterplot generally fall from top-left to bottom-right. What is the trend?',['Positive correlation','Negative correlation','Nonlinear','Causal relationship'],'Negative correlation','WGU is testing direction. As one variable increases, the other tends to decrease.','Negative = falls left to right.'),
  d772Item(4,'strength',3,'A scatterplot’s points lie very close to an upward-sloping line. How should the relationship be described?',['Weak positive relationship','Strong positive relationship','Strong negative relationship','No correlation'],'Strong positive relationship','WGU is testing both direction and strength. The upward trend is positive, and the tight clustering makes it strong.','Direction tells positive/negative; tightness tells strength.'),
  d772Item(4,'outlier',2,'Most points follow a clear pattern, but one point sits far away from the rest. What is that point called?',['A parameter','An outlier','A control group','A confounder'],'An outlier','WGU is testing scatterplot vocabulary. An outlier lies noticeably away from the overall pattern and is not automatically an error.','Outlier = unusual point, not automatically bad data.'),
  d772Item(4,'correlation not causation',4,'A scatterplot shows a very strong positive correlation between two variables. What can the graph alone prove?',['One variable causes the other','Only that the variables have a strong association','That no confounding variable exists','That the study was randomized'],'Only that the variables have a strong association','WGU is testing whether you confuse strength of correlation with causation. Even a very tight pattern does not reveal why the relationship exists.','Strong correlation still does not prove causation.')
];
function d772Questions(sourceId='d772-master-section-1'){
  return D772_SCENARIO_BANK.map((raw,i)=>{
    const x=wguQuestionLanguage(raw);
    const meta=D772_LESSONS[x.lesson];
    const why='WGU terminology: '+x.wguTerm+'. What WGU is testing: '+String(x.why||'').replace(/^WGU is testing\s*/i,'')+' WGU clue to notice: '+x.clue;
    return {
      id:'d772_wgu_'+x.lesson+'_'+slug(x.concept)+'_'+i,
      topicId:'d772-'+slug(x.concept),
      type:'mcq',
      prompt:x.prompt,
      options:[...x.options],
      answer:x.answer,
      why,
      wguSkill:x.wguTerm,
      wguTerm:x.wguTerm,
      wguClue:x.clue,
      testedConcept:x.wguTerm,
      sourceId,
      sourceExcerpt:'',
      passageId:null,
      difficulty:x.rigor<=1?'foundation':x.rigor===2?'understanding':x.rigor===3?'application':'challenge',
      rigorLevel:x.rigor,
      bloom:x.rigor===1?'remember':x.rigor===2?'understand':x.rigor===3?'apply':'analyze',
      oaStyle:true,
      adaptive:true,
      questionStyle:'wgu-concept-scenario',
      learningPathLessonId:meta.id,
      learningPathLessonTitle:meta.title,
      learningPathSectionId:D772_SECTION_ID
    };
  });
}
function isLowValueMetaQuestion(q){
  const p=norm(q?.prompt||'');
  return /according to your notes|from your notes|course material is the strongest evidence|concept and evidence pairing|best completes this statement/.test(p);
}
function deterministic(items,seed){
  return [...items].sort((a,b)=>hash(seed+'|'+String(a)).localeCompare(hash(seed+'|'+String(b))));
}
function vocabulary(text,limit=28){
  const out=[],seen=new Set();
  const patterns=[
    /\b([A-Z][A-Za-z -]{2,48})\s+(?:is|means|refers to|describes)\s+([^.!?]{12,220})/g,
    /\b([A-Za-z][A-Za-z -]{2,42})\s*:\s*([^\n.!?]{12,220})/g
  ];
  for(const rx of patterns){
    let m;
    while((m=rx.exec(text))&&out.length<limit){
      const term=m[1].trim(),key=term.toLowerCase();
      if(seen.has(key))continue;
      seen.add(key);
      out.push({term,definition:m[2].trim(),sourceExcerpt:m[0].trim()});
    }
  }
  const ss=sentenceList(text);
  for(const term of keyWords(text).slice(0,limit*5)){
    if(out.length>=limit||seen.has(term))continue;
    const s=ss.find(x=>new RegExp('\\b'+escapeRx(term)+'\\b','i').test(x));
    if(!s)continue;
    seen.add(term);
    out.push({term:cap(term),definition:s,sourceExcerpt:s});
  }
  return out;
}
function passages(text,sourceId){
  const ss=sentenceList(text);
  const terms=keyWords(text).slice(0,80);
  const size=ss.length<=8?3:ss.length<=20?4:5;
  const out=[];
  for(let i=0;i<ss.length;i+=size){
    const chunk=ss.slice(i,i+size);
    if(!chunk.length)continue;
    const found=terms.filter(t=>chunk.some(s=>new RegExp('\\b'+escapeRx(t)+'\\b','i').test(s))).slice(0,7);
    const title=found.length?found.slice(0,2).map(cap).join(' & '):'Course Reading '+(out.length+1);
    const textBlock=chunk.join(' ');
    out.push({
      id:'passage_'+sourceId+'_'+hash(textBlock),
      title,
      text:textBlock,
      keyTerms:found.map(cap),
      keyIdea:chunk[0],
      takeaways:chunk.slice(0,3),
      sourceId,
      sentenceStart:i,
      sentenceEnd:i+chunk.length-1
    });
  }
  return out.slice(0,18);
}
function distractorTerms(terms,answer,sentence,seed){
  const inSentence=new Set(terms.filter(t=>new RegExp('\\b'+escapeRx(t)+'\\b','i').test(sentence)));
  const pool=terms.filter(t=>t!==answer&&!inSentence.has(t));
  const out=deterministic(pool,seed).slice(0,3);
  for(const fallback of ['evidence','context','variable','pattern','sample','outcome']){
    if(out.length<3&&fallback!==answer&&!inSentence.has(fallback)&&!out.includes(fallback))out.push(fallback);
  }
  return out;
}
function distractorSentences(ss,correct,term,seed){
  const pool=ss.filter(s=>s!==correct&&!new RegExp('\\b'+escapeRx(term)+'\\b','i').test(s));
  return deterministic(pool,seed).slice(0,3);
}
function makeQ({sourceId,term,sentence,ss,terms,rigor,kind,passageId,seed}){
  const topicId='notes-'+slug(term);
  let prompt='',answer='',options=[],why='';
  const dt=distractorTerms(terms,term,sentence,seed);
  const ds=distractorSentences(ss,sentence,term,seed);
  if(kind==='cloze'){
    const blank=sentence.replace(new RegExp('\\b'+escapeRx(term)+'\\b','i'),'_____');
    if(blank===sentence||dt.length<3)return null;
    prompt='Which course term best completes this statement?\n'+blank;
    answer=cap(term); options=[answer,...dt.map(cap)];
    why='The source directly uses '+cap(term)+' in this idea: '+sentence;
  }else if(kind==='concept'){
    if(dt.length<3)return null;
    const context=sentence.replace(new RegExp('\\b'+escapeRx(term)+'\\b','ig'),'this concept');
    prompt='Which concept from your notes is most directly connected to this description?\n'+context;
    answer=cap(term); options=[answer,...dt.map(cap)];
    why=cap(term)+' is the concept linked to this description in your source: '+sentence;
  }else if(kind==='evidence'){
    if(ds.length<3)return null;
    prompt='Which statement from your course material is the strongest evidence for the concept '+cap(term)+'?';
    answer=sentence; options=[answer,...ds];
    why='This statement explicitly connects to '+cap(term)+'.';
  }else if(kind==='pair'){
    if(dt.length<3||ds.length<3)return null;
    prompt='Which concept-and-evidence pairing is correctly matched according to your notes?';
    answer=cap(term)+' — '+sentence;
    options=[answer,cap(dt[0])+' — '+ds[0],cap(dt[1])+' — '+ds[1],cap(dt[2])+' — '+ds[2]];
    why='The correct pairing keeps the concept with the statement in which your source actually explains or uses it.';
  }else return null;
  options=deterministic(options,sourceId+'|'+seed+'|'+kind);
  const difficulty=rigor<=1?'foundation':rigor===2?'understanding':rigor===3?'application':'challenge';
  const qid='notes_'+sourceId+'_'+hash(prompt+'|'+answer);
  return {
    id:qid,topicId,type:'mcq',prompt,options,answer,why,
    sourceId,sourceExcerpt:sentence,passageId,
    difficulty,rigorLevel:rigor,
    bloom:rigor===1?'remember':rigor===2?'understand':rigor===3?'apply':'analyze',
    oaStyle:rigor>=3,
    adaptive:true
  };
}
function questions(text,count,sourceId,passageRows){
  const ss=sentenceList(text);
  const terms=keyWords(text).slice(0,90);
  const pairs=[];
  ss.forEach((sentence,sentenceIndex)=>{
    let candidates=terms.filter(term=>new RegExp('\\b'+escapeRx(term)+'\\b','i').test(sentence)).slice(0,7);
    if(!candidates.length){
      const words=keyWords(sentence).slice(0,2);
      candidates=words.filter(Boolean);
    }
    candidates.forEach((term,termIndex)=>pairs.push({sentence,sentenceIndex,term,termIndex}));
  });
  const all=[],seen=new Set();
  const kinds=[
    {kind:'cloze',rigor:1},
    {kind:'concept',rigor:2}
  ];
  for(const pair of pairs){
    const passage=(passageRows||[]).find(p=>pair.sentenceIndex>=p.sentenceStart&&pair.sentenceIndex<=p.sentenceEnd);
    for(const spec of kinds){
      const q=makeQ({
        sourceId,term:pair.term,sentence:pair.sentence,ss,terms,
        rigor:spec.rigor,kind:spec.kind,passageId:passage?.id||null,
        seed:pair.sentenceIndex+'|'+pair.termIndex
      });
      if(!q)continue;
      const sig=norm(q.prompt)+'|'+norm(q.answer);
      if(seen.has(sig))continue;
      seen.add(sig);all.push(q);
    }
  }
  const target=Math.min(120,Math.max(20,Number(count||TARGET)));
  const quotas={1:Math.round(target*.20),2:Math.round(target*.30),3:Math.round(target*.30),4:Math.round(target*.20)};
  const chosen=[];
  for(const rigor of [1,2,3,4]){
    const bucket=all.filter(q=>q.rigorLevel===rigor);
    chosen.push(...bucket.slice(0,quotas[rigor]));
  }
  if(chosen.length<target){
    const ids=new Set(chosen.map(q=>q.id));
    chosen.push(...all.filter(q=>!ids.has(q.id)).slice(0,target-chosen.length));
  }
  return chosen.slice(0,target);
}
function build(text,opts){
  opts=opts||{};
  const ss=sentenceList(text);
  const sourceId=opts.sourceId||('temp_'+Date.now());
  const count=Math.min(120,Math.max(20,Number(opts.count||opts.targetCount||TARGET)));
  const vocab=opts.vocabulary===false?[]:vocabulary(text,30);
  const passageRows=passages(text,sourceId);
  const practice=opts.practiceQuestions===false?[]:(String(opts.courseId||'')==='D772'?d772Questions(sourceId):questions(text,count,sourceId,passageRows));
  const key=ss.slice(0,14);
  const explanations=opts.explanations===false?[]:key.slice(0,10).map((s,i)=>({
    concept:(vocab[i]&&vocab[i].term)||('Key Idea '+(i+1)),
    explanation:s,sourceExcerpt:s
  }));
  const misconceptionRepair=opts.misconceptionRepair===false?[]:key.slice(0,8).map((s,i)=>({
    prompt:'Misconception check '+(i+1),
    incorrectIdea:'A learner may confuse this idea with a related concept, apply it too broadly, or reverse the relationship.',
    correction:s,sourceExcerpt:s
  }));
  const review=opts.review===false?null:{
    summary:key.slice(0,6).join(' '),
    keyPoints:key.slice(0,10),
    quickRecall:vocab.slice(0,10).map(v=>'Explain '+v.term+' in your own words.')
  };
  return {
    targetCount:count,
    practiceQuestions:practice,
    passages:passageRows,
    explanations,
    vocabulary:vocab,
    misconceptionRepair,
    review,
    rigorMix:{
      foundation:practice.filter(q=>q.rigorLevel===1).length,
      understanding:practice.filter(q=>q.rigorLevel===2).length,
      application:practice.filter(q=>q.rigorLevel===3).length,
      analysis:practice.filter(q=>q.rigorLevel===4).length
    }
  };
}

window.MajickQuestionBuilder={TARGET,build,sentenceList,keyWords,vocabulary,passages,d772Questions,isLowValueMetaQuestion,D772_SCENARIO_BANK,D772_WGU_TERMS};
})();