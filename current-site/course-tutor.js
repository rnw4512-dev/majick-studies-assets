(function(){
'use strict';
if(!window.MajickLearningLab||!window.MajickMaterialStore)return;

const VERSION='3.4.2-visible-learning-hub';
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

const D772_SECTION_TWO={
  id:'d772-s2',
  title:'Section 2: Interpreting Data with Statistics and Graphs',
  competency:'Interpret data using statistical methods and graphical representations.',
  provenance:{
    courseStructure:'User-provided WGU D772 Section 2 introduction and assessment-prep prompts',
    corroboration:[
      {source:'OpenStax Introductory Statistics',url:'https://openstax.org/books/introductory-statistics/pages/2-introduction',supports:'graphical displays, distributions, measures of location/center/spread and descriptive statistics'},
      {source:'NIST/SEMATECH e-Handbook of Statistical Methods',url:'https://www.nist.gov/publications/nistsematech-e-handbook-statistical-methods-chapter-1-exploratory-data-analysis',supports:'graphical analysis for structure, patterns and outliers'},
      {source:'OpenStax Introductory Statistics',url:'https://openstax.org/books/introductory-statistics/pages/1-3-frequency-frequency-tables-and-levels-of-measurement',supports:'classification and levels of measurement'}
    ]
  },
  assessmentPrep:[
    'Can I identify different classifications of data?',
    'Can I select an appropriate graphical display based on data type(s)?',
    'Can I describe the distribution of data given a graphical display?',
    'Can I calculate single-variable descriptive statistics?'
  ],
  lessons:[
    {id:'d772-s2-l1',number:1,title:'Exploring Various Types of Data',short:'Types of Data',keywords:['data type','classification','classifications','categorical','quantitative','qualitative','numerical','variable'],
      goal:'Identify and distinguish the data classifications required by the Section 2 competency.',
      visual:['Observe the variable','Identify how values are recorded','Classify the data','Choose valid interpretations'],
      thinking:['What kind of values are recorded?','Are the values categories or numerical measurements?','Does the classification affect what summaries or graphs make sense?'],
      traps:['Choosing a graph or statistic before identifying the data type.'],
      sublessons:[
        {id:'d772-s2-l1-2',number:1.2,parentLessonId:'d772-s2-l1',title:'Explanatory and Response Variables',short:'Explanatory & Response',keywords:['explanatory variable','response variable','predict','prediction','influence','related to','relationship','role','data type'],
          goal:'Identify explanatory and response variables, determine the possible direction of influence, and classify each variable’s role separately from whether it is categorical or quantitative.',
          visual:['Research question','Does X explain / predict / influence Y?','X = explanatory','Y = response','Classify each variable’s data type separately'],
          thinking:['What are the two variables?','Which variable is being used to explain, predict, or possibly influence the other?','Which variable is the measured or observed response?','Now separately ask whether each variable is categorical or quantitative.'],
          traps:['Assuming explanatory means quantitative.','Assuming response means quantitative.','Choosing the first variable named instead of reading the relationship.','Treating explanatory as proof of causation in an observational study.']}
      ]},
    {id:'d772-s2-l2',number:2,title:'Choosing Graphical Displays',short:'Graphical Displays',keywords:['graph','graphical display','bar graph','histogram','box plot','dot plot','display','chart'],
      goal:'Select an appropriate graphical display based on the data type or types in the problem.',
      visual:['Data type','Question being asked','Candidate displays','Best display','Interpret'],
      thinking:['What data type is present?','What comparison or pattern needs to be visible?','Which display matches that purpose?'],
      traps:['Selecting a display because it looks familiar instead of because it matches the data.']},
    {id:'d772-s2-l3',number:3,title:'Data Distribution Interpretation',short:'Distributions',keywords:['distribution','shape','center','spread','outlier','skew','symmetric','graphical display'],
      goal:'Describe the distribution of data from a graphical display using the features required by the course.',
      visual:['Graph','Shape / pattern','Center','Spread','Unusual values'],
      thinking:['What overall pattern do I see?','Where are values concentrated?','How variable are they?','Are there unusual values or features?'],
      traps:['Describing one bar or point instead of the distribution as a whole.']},
    {id:'d772-s2-l4',number:4,title:'Calculating Single-Variable Descriptive Statistics',short:'Descriptive Statistics',keywords:['descriptive statistic','mean','median','mode','range','variance','standard deviation','quartile','percentile','single variable'],
      goal:'Calculate and interpret the single-variable descriptive statistics required by the Section 2 competency.',
      visual:['Single variable','Organize values','Choose statistic','Calculate','Interpret in context'],
      thinking:['Which statistic is requested?','What values belong in the calculation?','What does the result mean for this variable?'],
      traps:['Calculating correctly but interpreting the statistic incorrectly.']},
    {id:'d772-s2-review',number:null,title:'Section 2: Summary and Test',short:'Section 2 Review',review:true,keywords:[],
      goal:'Combine data classification, graphical-display selection, distribution interpretation, and single-variable descriptive statistics.',
      visual:['Classify','Choose display','Describe distribution','Calculate','Interpret'],
      thinking:['What type of data is this?','Which display fits?','What does the distribution show?','Which descriptive statistic is needed?'],
      traps:['Skipping the data-type step before choosing a graph or statistic.']}
  ]
};

// Course structure supplied by the learner. Outline entries contain no invented teaching,
// assessment questions, completion flags, or mastery evidence.
const D772_SECTION_TWO_OUTLINE={
  'd772-s2-l2':[
    ['d772-s2-l2-1',2.1,'One Variable Categorical','lesson'],
    ['d772-s2-l2-2',2.2,'One Variable Quantitative','lesson'],
    ['d772-s2-l2-3',2.3,'Two Variable Displays','lesson'],
    ['d772-s2-l2-summary',null,'Lesson 2: Summary','summary'],
    ['d772-s2-l2-quiz',null,'Lesson 2: Quiz','quiz']
  ],
  'd772-s2-l3':[
    ['d772-s2-l3-1',3.1,'Describing Distributions','lesson'],
    ['d772-s2-l3-summary',null,'Lesson 3: Summary','summary'],
    ['d772-s2-l3-quiz',null,'Lesson 3: Quiz','quiz']
  ],
  'd772-s2-l4':[
    ['d772-s2-l4-1',4.1,'Measures of Center','lesson'],
    ['d772-s2-l4-2',4.2,'Measures of Spread','lesson'],
    ['d772-s2-l4-3',4.3,'The Five-number Summary and Box Plots','lesson'],
    ['d772-s2-l4-summary',null,'Lesson 4: Summary','summary'],
    ['d772-s2-l4-quiz',null,'Lesson 4: Quiz','quiz']
  ],
  'd772-s2-review':[
    ['d772-s2-summary',null,'Section 2: Summary','summary'],
    ['d772-s2-test',null,'Section 2: Test','test']
  ]
};
for(const lesson of D772_SECTION_TWO.lessons){
  const outline=D772_SECTION_TWO_OUTLINE[lesson.id];
  if(!outline)continue;
  lesson.sublessons=outline.map(([id,number,title,unitType])=>({
    id,number,title,short:title,parentLessonId:lesson.id,unitType,outlineOnly:true,
    keywords:[],goal:'Course outline reserved for your upcoming material.',
    visual:[],thinking:[],traps:[]
  }));
}

const twoVariableUnit=D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l2').sublessons.find(l=>l.id==='d772-s2-l2-3');
Object.assign(twoVariableUnit,{outlineOnly:false,keywords:['role-type','two-way table','side-by-side boxplot','scatterplot','two variable','two-variable'],goal:'Classify both variable roles and types, then select and justify a two-variable display.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l2').sublessons.find(l=>l.id==='d772-s2-l2-summary'),{outlineOnly:false,goal:'Review display selection across one-variable and two-variable data, then prepare for interpreting distributions.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l2').sublessons.find(l=>l.id==='d772-s2-l2-quiz'),{outlineOnly:false,goal:'Review your reported 10/10 Quiz 1 result and retry display-selection questions.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l3').sublessons.find(l=>l.id==='d772-s2-l3-1'),{outlineOnly:false,keywords:['modality','unimodal','bimodal','multimodal','uniform','skewed','normal distribution','symmetry'],goal:'Describe histogram symmetry, modality, and skewness, and identify approximately normal shapes.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l3').sublessons.find(l=>l.id==='d772-s2-l3-quiz'),{outlineOnly:false,goal:'Review your reported 9/10 Quiz 1 result and repair normal-versus-uniform confusion.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l4').sublessons.find(l=>l.id==='d772-s2-l4-1'),{outlineOnly:false,keywords:['mean','median','mode','measures of center','average','middle value'],goal:'Calculate and interpret mean, median, and raw-data modes.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l4').sublessons.find(l=>l.id==='d772-s2-l4-2'),{outlineOnly:false,keywords:['quartile','interquartile','iqr','range','measures of spread'],goal:'Calculate quartiles, range, and IQR with the course median-of-halves convention.'});

Object.assign(D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l4').sublessons.find(l=>l.id==='d772-s2-l4-3'),{outlineOnly:false,keywords:['five-number summary','box plot','box-and-whisker','whiskers'],goal:'Construct and interpret a scaled box plot from the five-number summary.',traps:['Longer segment does not mean more observations.','The axis endpoint need not be a data extreme.','The median line need not be centered in the box.']});

const D772_SECTION_ONE_CONTENT={
  'd772-s1-l1':{
    overview:'Lesson 1 asks where the data came from and how the study was designed. Follow the chain: population and sample → sampling method → study type → experimental design.',
    teach:[
      {title:'Population, sample, individuals, variables, and data',text:'Population means the entire group of interest; sample means the smaller group actually studied. A parameter describes a population, while a statistic describes a sample. Individuals are the people or objects described by the data. Variables are characteristics measured on those individuals, and data are the recorded values. Quantitative variables are meaningful numerical measurements; categorical variables are labels or groups.'},
      {title:'Random sampling methods',text:'Simple random sampling selects entirely by chance. Stratified sampling takes SOME FROM ALL subgroups. Cluster sampling takes ALL FROM SOME randomly selected groups. Systematic sampling chooses a random starting point and then every nth individual. Random sampling decides WHO enters the sample.'},
      {title:'Observational studies, surveys, and experiments',text:'Observational studies measure variables as they naturally occur. A sample survey is an observational study based on self-reported answers. An experiment deliberately imposes a treatment. The explanatory variable may explain or predict the outcome; the response variable is the measured outcome.'},
      {title:'Strong experimental design',text:'Randomization assigns experimental units to treatments by chance. Replication uses enough observations or repeated studies. A control group gives a comparison baseline. A placebo is inactive; the placebo effect is a response caused by expectation. Single-blind means participants do not know treatment assignment; double-blind means participants and interacting researchers do not know. Randomization (random assignment) decides WHERE participants go after they enter the study.'}
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
      ['Stratified sampling','Divide the population into strata based on characteristics, then take a random sample from each stratum.'],
      ['Cluster sampling','Divide the population into naturally occurring clusters, randomly choose a few clusters, then include everyone in the selected clusters.'],
      ['Systematic sampling','Choose a random starting point, then select every nth individual.'],
      ['Observational study','Researchers observe variables without assigning a treatment.'],
      ['Sample survey','An observational study in which people self-report answers or opinions.'],
      ['Experiment','Researchers deliberately manipulate an explanatory variable and observe the response.'],
      ['Randomization','Assigning experimental units to groups by chance.'],
      ['Replication','Using a sufficiently large sample and/or reproducing the study to confirm findings.'],
      ['Control group','A comparison group that does not receive the experimental treatment.'],
      ['Placebo','An inactive treatment.'],
      ['Blinding','Keeping participants and/or researchers unaware of treatment assignment.']
    ],
    memory:['Population = ALL; Sample = SOME.','Parameter → Population; Statistic → Sample.','Stratified = SOME FROM ALL; Cluster = ALL FROM SOME.','RANDOM SAMPLING = WHO? RANDOMIZATION = WHERE?','Researcher changes something = experiment.']
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
      ['Representative sample','A subset that accurately reflects characteristics of the larger population.'],
      ['Non-representative sample','A biased sample that fails to accurately reflect the population.'],
      ['Volunteer sample','A non-random sample in which individuals select themselves to participate.'],
      ['Voluntary response bias','Bias caused when people with strong opinions or special interest are especially likely to volunteer.'],
      ['Convenience sample','A sample chosen because the individuals are easy to reach.'],
      ['Sampling frame','The list of potential individuals from which the sample is drawn.'],
      ['Sampling frame error','Occurs when the sampling frame does not represent the entire target population.'],
      ['Sampling bias','A selection problem that gives some population members a systematically different chance of inclusion.'],
      ['Non-response bias','Bias caused when selected nonresponders differ systematically from responders.'],
      ['Response bias','Inaccurate answers caused by pressure, misunderstanding, memory, fear, or other response effects.'],
      ['Perceived lack of anonymity','Response bias caused by fear that an honest answer can be linked back to the respondent.'],
      ['Loaded question','Question wording that pushes respondents toward a particular answer.'],
      ['Self-interest study','Potential bias when researchers have a personal stake or interest in the outcome.']
    ],
    memory:['Sampling bias = wrong/unbalanced PEOPLE. Response bias = inaccurate ANSWERS.','Voluntary response = people choose themselves IN. Non-response = selected people stay OUT.','Convenience = researcher chooses easy people. Volunteer = people choose themselves.','A random sample cannot fix a bad sampling frame.']
  },
  'd772-s1-l3':{
    overview:'Lesson 3 asks whether the display, sample size, significance claim, or reporting practice could mislead the reader—even when some of the underlying numbers are technically real.',
    teach:[
      {title:'Misleading graphical displays',text:'A truncated bar-chart axis can make a modest difference look enormous. Icons enlarged in both height and width exaggerate area. A tilted 3-D pie chart can make equal slices appear unequal because of perspective. Always compare the visual impression with the actual values, scale, labels, units, and intervals.'},
      {title:'Sample size and random variation',text:'Small samples are more vulnerable to random fluctuations and can produce extreme-looking results by chance. Larger samples generally provide more stable estimates when the sampling method itself is sound. A huge biased sample is still biased.'},
      {title:'Lesson 3.2 case study — The Miracle Hair Growth Elixir',text:'A company tested its hair-growth elixir on only 6 participants for 30 days. It reported noticeable growth for all six and advertised the product for everyone. Most later customers did not report the same results. The study lacked a control group, had a relatively small sample, and failed to adequately account for individual differences and other factors affecting hair growth. Without a comparison group, ordinary hair growth or other influences could explain the change. Six participants cannot support a broad claim about all people.'},
      {title:'WGU case question 1 — Identify the flaws',text:'CASE SCENARIO: A company tested a hair-growth elixir on 6 participants for 30 days, observed growth in all six, and advertised that the product works for everyone. There was no control group, and individual differences and other causes of hair growth were not adequately considered. QUESTION: Which major flaw weakens the company’s claim: (A) no control group, (B) small sample size, (C) failure to account for individual differences, or (D) all of the above? PAUSE AND DECIDE BEFORE READING: Answer D — all of the above. Without a comparison group, a larger representative sample, and attention to confounding factors, the results do not establish causation or broad generalizability.'},
      {title:'WGU case question 2 — Improve the study',text:'CASE SCENARIO: A company studied its hair-growth elixir using only 6 participants over 30 days, without a control group, then advertised the result to everyone. Other possible influences on hair growth were not controlled. QUESTION: If you must choose among (A) increasing the sample size, (B) shortening the study, (C) hiding unfavorable results, or (D) exaggerating the effects, which is the best improvement? PAUSE AND DECIDE BEFORE READING: Answer A — substantially increase the sample size, provided sampling is appropriate. A larger well-selected sample generally reduces sampling variability. IMPORTANT WGU LIMITATION: This is only the best of these four choices; it does NOT independently fix selection bias, confounding, or the missing control group. A stronger overall study would also use an appropriate comparison group and control other factors.'},
      {title:'Lesson 3.2 conclusion check',text:'All six participants improving does not by itself establish statistical significance, prove the elixir caused improvement, or justify generalizing to everyone. Statistical significance requires an appropriate analysis; practical significance asks whether the effect matters. Ask: How many participants? How were they selected? What comparison group was used? What other factors could explain the result? Is the company reporting evidence transparently despite its financial interest?'},
      {title:'Lesson 3 Quiz 1 repair • 7/10',text:'Three distinctions need targeted repair: (1) a histogram can mislead when class intervals on the x-axis are not comparable, such as fixed-width age groups followed by an open-ended >40 group; (2) statistical significance is about the observed effect relative to sampling variation, so a large sample and a clear difference can contribute to significance, while “important advancement” is a separate judgment; and (3) 3-D pie-chart perspective can make nearer slices look larger than their actual percentage. These repair points come from your WGU Lesson 3 Quiz 1 and were corroborated with NIST histogram guidance, the American Statistical Association’s significance statements, and quantitative-literacy guidance on 3-D chart distortion.'},      {title:'Statistical significance',text:'In D772, statistical significance means the observed result is unlikely to be explained by random chance alone under the statistical method used. It does not automatically mean the effect is large, important, unbiased, ethical, or proven with certainty. Statistical significance and practical importance answer different questions.'},
      {title:'Misrepresentation, fabrication, and falsification',text:'Misrepresentation presents information in a way likely to produce an incorrect conclusion. Fabrication invents data or results that never existed. Falsification manipulates the research record by altering values, changing instruments without disclosure, misreporting subject counts, intentionally selecting a biased sample, omitting inconvenient valid data, or duplicating observations. Transparent pre-established exclusion rules are different from secretly deleting results because they hurt a preferred conclusion.'}
    ],
    vocab:[
      ['Statistical significance','A claim that a set of observed data or an event is unlikely to have occurred by chance.'],
      ['Practical significance','Whether the effect is large or meaningful enough to matter in practice.'],
      ['Misrepresenting data','Presenting real or partly real data in a way likely to mislead viewers or encourage an incorrect conclusion.'],
      ['Fabricating data sets','Making up data without actually obtaining those observations.'],
      ['Falsifying data','Deliberately creating, changing, omitting, duplicating, or otherwise manipulating the research record.'],
      ['Truncated axis','A graph axis that begins close to the observed values rather than an appropriate baseline, potentially exaggerating visual differences.'],
      ['Duplicating data','Copying observations and counting them multiple times to artificially inflate sample size.']
    ],
    quizRepair:{source:'WGU D772 Section 1 Lesson 3 — Unveiling Data Misrepresentations Quiz 1',score:'7/10',missed:[7,8,9],weakAreas:['Inconsistent x-axis/class intervals','Statistical significance: sample size + difference relative to sampling variation','3-D pie-chart perspective distortion'],corroboration:[
      {source:'NIST/SEMATECH Histogram guidance',url:'https://www.itl.nist.gov/div898/handbook/eda/section3/eda33e.htm'},
      {source:'American Statistical Association Task Force Statement',url:'https://magazine.amstat.org/blog/2021/08/01/task-force-statement-p-value/'},
      {source:'ASA Statement on Statistical Significance and P-Values',url:'https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf'},
      {source:'Quantitative Literacy Across the Curriculum',url:'https://citeseerx.ist.psu.edu/document?doi=e9166faddaf61e56da9b900fa2efaa8bfd10b505&repid=rep1&type=pdf'}
    ]},
    memory:['Statistical significance is evidence relative to sampling variation; practical significance asks whether the effect matters.','Large sample + a clear difference can contribute to statistical significance; importance to the field is a separate question.','Misrepresentation can use real data misleadingly; falsification changes or invents the research record.','Small sample = more random bounce. Large sample does not cure bias.','Histogram class intervals should be comparable when bar heights are compared directly.','3-D perspective can distort apparent pie-slice size.','Bars compare length; pictures can trick your eye into comparing area.']
  },
  'd772-s1-l4':{
    overview:'Lesson 4 connects the study design to the conclusion you are allowed to make. The central rule is that association is not the same as causation, and a scatterplot shows a relationship but not why it exists.',
    teach:[
      {title:'Association vs. causation',text:'Association means two variables are related. A causal relationship means a change in one variable directly produces an effect in the other. Observational studies can support association but cannot establish causation by themselves. A well-designed experiment can support a causal conclusion when the experiment controls alternative explanations.'},
      {title:'Confounding variables',text:'A confounding variable is related to both the explanatory and response variables and can make them appear directly connected. Ask whether a third variable could explain why the two measured variables occur together. Examples include sun exposure in sunscreen/skin-cancer data and season or temperature in ice-cream-sales/shark-attack data.'},
      {title:'Scatterplot shape, trend, strength, and outliers',text:'A scatterplot displays the relationship between two quantitative variables. Describe SHAPE first: linear, nonlinear, or no pattern. For a linear relationship describe TREND as positive or negative. Describe STRENGTH by how tightly the points follow the pattern. Identify OUTLIERS that sit noticeably away from the overall pattern. Nonlinear does not mean no relationship.'},
      {title:'Correlation still does not prove cause',text:'Even a very strong positive or negative scatterplot pattern does not prove that one variable causes the other. Confounding, reverse direction, or coincidence can produce correlation. Causal reasoning comes from the study design, especially manipulation, comparison/control, and random assignment.'}
    ],
    vocab:[
      ['Association','A relationship between two variables.'],
      ['Causal relationship','A relationship in which one event or variable causes an effect on the other.'],
      ['Confounding variable','A variable not accounted for that may influence the relationship because it is associated with both the explanatory and response variable.'],
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

const D772_SECTION_TWO_CONTENT={
  'd772-s2-l1':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 LESSON 1 • CORROBORATED',
    overview:'Lesson 1 begins with the distinction between categorical and quantitative data. Your course examples classify counts and measurements as quantitative and labels such as architectural style as categorical. OpenStax independently corroborates the same distinction: numerical variables represent numerical measurements or counts, while categorical variables place observations into categories.',
    teach:[
      {title:'Categorical data',text:'Categorical data identify a label, type, group, or category. The value tells you what kind of thing an observation is, not how much of a quantity it has. Your course example “architectural style” is categorical because colonial, ranch, mid-century modern, and Victorian are category labels.'},
      {title:'Quantitative data',text:'Quantitative data are numerical values that represent amounts, counts, or measurements. Your course examples—number of workout machines, lawn area in square feet, and number of cars in a parking lot—are quantitative because the recorded numbers represent quantities.'},
      {title:'Fast decision rule',text:'Ask: “Does this value tell me HOW MUCH/HOW MANY, or WHAT KIND?” HOW MUCH/HOW MANY usually points to quantitative data. WHAT KIND points to categorical data. A number can still be categorical when it is only acting as a label, so always ask what the number means.'},
      {title:'Course examples',text:'Five gyms with 12, 15, 10, 22, and 20 machines → quantitative. Lawn areas such as 1440, 1600, and 2100 square feet → quantitative. House architectural styles such as colonial, ranch, and Victorian → categorical. Number of cars in a parking lot → quantitative.'}
    ],
    vocab:[
      ['Categorical data','Data whose values identify groups, labels, or types rather than numerical amounts.'],
      ['Quantitative data','Data whose values are numerical quantities such as counts or measurements.'],
      ['Count','A quantitative value describing how many items or events there are.'],
      ['Measurement','A quantitative value obtained by measuring an amount such as area, distance, time, or weight.']
    ],
    practiceEvidence:{
      source:'WGU D772 Section 2 Lesson 1 practice questions 4–7',
      examples:[
        {prompt:'Number of workout machines at gyms',answer:'Quantitative'},
        {prompt:'Area of lawns in square feet',answer:'Quantitative'},
        {prompt:'Architectural style of houses',answer:'Categorical'},
        {prompt:'Number of cars in a parking lot',answer:'Quantitative'}
      ],
      corroboration:[
        {source:'OpenStax Introductory Statistics 2e §1.1',url:'https://openstax.org/books/introductory-statistics-2e/pages/1-1-definitions-of-statistics-probability-and-key-terms',supports:'numerical variables versus categorical variables'},
        {source:'OpenStax Introductory Statistics §1.2',url:'https://openstax.org/books/introductory-statistics/pages/1-2-data-sampling-and-variation-in-data-and-sampling',supports:'counts as quantitative discrete and types/categories as qualitative/categorical'}
      ]
    },
    memory:['HOW MANY / HOW MUCH = usually quantitative.','WHAT KIND = categorical.','Counts are quantitative.','Measurements are quantitative.','A number used only as a label can still be categorical.']
  },
  'd772-s2-l2':{
    simple:'Start with the variable type and the goal. If you are comparing categories, think BAR. If you are showing how mutually exclusive categories make up one whole, think PIE. If categories can overlap, do not use a pie chart. Histogram = quantitative distribution; scatterplot = relationship between two quantitative variables; line graph = change over time.',
    example:'A survey asks students to choose ONE favorite campus event: concert 40%, sports 30%, theater 20%, other 10%. A bar graph can compare the categories, and a pie chart can show their parts of the whole because each student belongs to one category and the percentages total 100%.',
    quickCheck:{prompt:'Students may join any number of four clubs, so the club percentages total 145%. Which graph is more appropriate?',choices:['Bar graph','Pie chart','Histogram','Scatterplot'],answer:0,rationale:'The categories overlap, so the percentages do not partition one whole. A bar graph can compare them without implying they sum to 100%.'}
  },
  'd772-s2-l1-2':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 • LESSON 1.2 • CORROBORATED',
    overview:'Lesson 1.2 separates two different questions about a variable: WHAT TYPE of data is it, and WHAT ROLE does it play in the research question? Categorical/quantitative describes the data type. Explanatory/response describes the variable’s role in the relationship being studied.',
    objectives:[
      'Distinguish categorical variables from quantitative variables.',
      'Identify explanatory and response variables.',
      'Determine which variable may predict or influence the other.',
      'Identify a variable’s role separately from its data type.'
    ],
    teach:[
      {title:'I Teach • Two labels can describe the same variable',text:'A variable has a data type and can also have a research role. “Categorical” or “quantitative” tells you what kind of values the variable takes. “Explanatory” or “response” tells you how that variable is being used in the research question. These are separate characteristics.'},
      {title:'I Teach • The direction rule',text:'Ask: “Does X help explain, predict, or influence Y?” If yes, X is the explanatory variable and Y is the response variable. In an observational study, this identifies the direction of the research question; it does not by itself prove that X causes Y.'},
      {title:'I Teach • Explanatory variable',text:'The explanatory variable is the variable being used to explain or predict differences in the response, or the variable that may influence the response. It can be categorical or quantitative.'},
      {title:'I Teach • Response variable',text:'The response variable is the outcome being observed or measured—the variable that may differ in response to the explanatory variable. It can also be categorical or quantitative.'},
      {title:'We Do • Guided example',text:'Question: “Is weekly exercise time related to resting heart rate?” Step 1: variables = weekly exercise time and resting heart rate. Step 2: ask whether exercise time may help explain or predict heart rate. Yes. Step 3: explanatory = exercise time; response = resting heart rate. Step 4: both are quantitative because each is a numerical measurement.'},
      {title:'Course examples',text:'Age → smoking habits: age is explanatory; smoking habits are response. Driver age → sign-legibility distance: driver age is explanatory; sign-legibility distance is response. Driving-practice time → driving-test result: practice time is explanatory; pass/fail result is response. IQ level → favorite type of music: IQ level is explanatory; music preference is response.'},
      {title:'Role and type are separate',text:'Examples: smoking habits can be categorical + response. Driver age can be quantitative + explanatory. Driving-test result can be categorical + response. Sign-legibility distance can be quantitative + response. Do not use data type to guess the research role.'}
    ],
    anchorChart:{
      title:'ROLE ≠ DATA TYPE',
      rule:'Does X help explain, predict, or influence Y? → X = EXPLANATORY • Y = RESPONSE',
      columns:[
        ['Question','What it tells you'],
        ['Categorical or quantitative?','DATA TYPE: labels/categories vs. numerical counts/measurements'],
        ['Explanatory or response?','ROLE: possible predictor/influence vs. observed outcome']
      ],
      examples:[
        ['Driver age','Quantitative + Explanatory'],
        ['Sign-legibility distance','Quantitative + Response'],
        ['Driving-test result','Categorical + Response'],
        ['Favorite music type','Categorical + Response']
      ]
    },
    weDo:{
      prompt:'A school studies whether the type of tutoring program (online, small-group, or one-to-one) is related to the number of points gained on a posttest.',
      steps:[
        'Identify the two variables: tutoring-program type and points gained.',
        'Ask: Does tutoring-program type help explain or predict points gained? That is the direction being studied.',
        'Tutoring-program type = explanatory variable.',
        'Points gained = response variable.',
        'Tutoring-program type is categorical; points gained is quantitative.'
      ]
    },
    practice:[
      {id:'s2l12-p1',prompt:'A researcher asks whether daily screen time is related to hours of sleep per night. Which pairing is most natural?',options:['Screen time = explanatory; sleep hours = response','Sleep hours = explanatory; screen time = response','Both are categorical','Both must be response variables'],answer:0,rationale:'The research question treats screen time as the possible predictor or influence and sleep hours as the observed outcome.'},
      {id:'s2l12-p2',prompt:'A study compares preferred study location (library, home, café) with exam score. How should preferred study location be classified?',options:['Categorical + explanatory','Quantitative + explanatory','Categorical + response','Quantitative + response'],answer:0,rationale:'Study location consists of category labels, and the question uses location to explain or predict differences in exam score.'},
      {id:'s2l12-p3',prompt:'A study asks whether commute distance predicts whether an employee works remotely. How should remote-work status be classified?',options:['Categorical + response','Quantitative + response','Categorical + explanatory','Quantitative + explanatory'],answer:0,rationale:'Remote-work status is a category such as yes/no and is the outcome being predicted, so it is categorical + response.'},
      {id:'s2l12-p4',prompt:'A researcher asks whether medication dose is related to change in blood pressure. How should medication dose be classified?',options:['Quantitative + explanatory','Categorical + explanatory','Quantitative + response','Categorical + response'],answer:0,rationale:'Dose is a numerical amount and is being used as the possible influence, so it is quantitative + explanatory.'},
      {id:'s2l12-p5',prompt:'Which statement is correct?',options:['Explanatory variables must be quantitative','Response variables must be quantitative','A variable’s data type and research role are separate characteristics','Categorical variables cannot predict quantitative variables'],answer:2,rationale:'Categorical/quantitative describes the kind of values. Explanatory/response describes the variable’s role in the research question.'},
      {id:'s2l12-p6',prompt:'An observational study uses neighborhood type to predict whether residents use public transit. Does calling neighborhood type “explanatory” prove it causes transit use?',options:['No; the role identifies the direction being studied, not causation by itself','Yes; explanatory always means causal','Yes, if both variables are categorical','No, because categorical variables cannot be explanatory'],answer:0,rationale:'An explanatory variable may be used to explain or predict a response in observational data without establishing a causal effect.'},
      {id:'s2l12-p7',prompt:'A study asks whether number of practice problems completed predicts final-exam score. What are the data types and roles?',options:['Practice problems = quantitative explanatory; exam score = quantitative response','Practice problems = categorical response; exam score = quantitative explanatory','Both are categorical explanatory variables','Both are quantitative response variables'],answer:0,rationale:'Both variables are numerical, but their roles differ: practice amount is the predictor and exam score is the outcome.'},
      {id:'s2l12-p8',prompt:'A researcher asks whether meal-plan type predicts whether a student renews the plan next semester. Which answer correctly classifies both variables?',options:['Meal-plan type = categorical explanatory; renewal status = categorical response','Meal-plan type = quantitative explanatory; renewal status = categorical response','Meal-plan type = categorical response; renewal status = categorical explanatory','Both are quantitative'],answer:0,rationale:'Both variables are categorical, while their roles are different: plan type is explanatory and renewal status is the response.'}
    ],
    vocab:[
      ['Categorical variable','A variable whose values are names, labels, or categories.'],
      ['Quantitative variable','A variable whose values are numerical counts or measurements.'],
      ['Explanatory variable','The variable used to explain or predict the response, or the variable that may influence it.'],
      ['Response variable','The observed or measured outcome that may be affected by or associated with the explanatory variable.']
    ],
    provenance:{
      courseStructure:'User-provided WGU D772 Section 2 Lesson 1.2 learning objectives, terms, rule, and four course examples',
      corroboration:[
        {source:'OpenStax Statistics • Ch. 1 Key Terms',url:'https://openstax.org/books/statistics/pages/1-key-terms',supports:'categorical, quantitative/numerical, explanatory, and response variable definitions'},
        {source:'OpenStax Introductory Statistics 2e §1.2',url:'https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling',supports:'categorical/qualitative versus quantitative data'},
        {source:'OpenStax Introductory Statistics §1.4',url:'https://openstax.org/books/introductory-statistics/pages/1-4-experimental-design-and-ethics',supports:'explanatory variable as possible influence and response variable as measured outcome'}
      ]
    },
    memory:['ROLE ≠ DATA TYPE.','Ask: Does X explain, predict, or influence Y? X = explanatory; Y = response.','Categorical variables can be explanatory or response.','Quantitative variables can be explanatory or response.','Explanatory does not automatically mean causal in an observational study.']
  },
  'd772-s2-l2':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 • LESSON 2 • CORROBORATED',
    overview:'Lesson 2 teaches you to choose a graphical display by matching the display to the data type and the question you want the graph to answer. For categorical proportions, bar graphs and pie charts can both work, but they communicate different things and have different restrictions.',
    objectives:[
      'Choose an appropriate graph for categorical data.',
      'Distinguish when a bar graph or pie chart is more appropriate.',
      'Recognize when a pie chart is invalid because categories overlap or do not represent the full whole.',
      'Identify when a missing Other/Unknown category causes percentages to fall short of 100%.'
    ],
    teach:[
      {title:'I Teach • Start with the data type',text:'Categorical data are commonly displayed with bar graphs or pie charts. Quantitative distributions are commonly shown with displays such as histograms. Scatterplots are used to show relationships between two quantitative variables, while line graphs are often used for change over time.'},
      {title:'I Teach • Bar graph',text:'A bar graph compares categories using bar length or height. The bars can represent counts or percentages. Bar graphs are especially useful when you want to compare categories directly, and they can still be appropriate when categories overlap.'},
      {title:'I Teach • Pie chart',text:'A pie chart shows how one whole is divided among categories. Each slice represents a proportion of the total. Because the circle represents the whole, the categories should be mutually exclusive for the intended comparison and the percentages should total about 100%, allowing for small rounding error.'},
      {title:'I Teach • Missing category check',text:'If category percentages should describe one complete whole but total less than 100%, look for an omitted category such as “Other/Unknown.” Do not automatically recalculate the listed percentages when the more likely problem is that some observations were left out of the representation.'},
      {title:'I Teach • Overlapping categories',text:'If people can belong to more than one category, the percentages may add to more than 100%. A pie chart is then misleading because its slices imply mutually exclusive pieces of one whole. A bar graph can compare the category percentages without requiring them to form one pie.'},
      {title:'Course examples',text:'Your WGU practice confirms: pie charts and bar graphs can display categorical proportions; bar graphs compare category counts/percentages while pie charts emphasize proportions of the whole; a missing Other/Unknown category can explain totals below 100%; and a pie chart is inappropriate when students may participate in multiple activities and percentages exceed 100%.'}
    ],
    anchorChart:{
      title:'CHOOSE THE DISPLAY BY PURPOSE',
      rule:'CATEGORIES? → BAR compares • PIE shows parts of ONE whole',
      columns:[
        ['Display','Best use'],
        ['Bar graph','Compare counts or percentages across categories'],
        ['Pie chart','Show mutually exclusive category proportions that make one whole'],
        ['Histogram','Show a quantitative distribution across intervals/bins'],
        ['Scatterplot','Show the relationship between two quantitative variables'],
        ['Line graph','Show change or trend over time']
      ],
      examples:[
        ['Favorite school subject percentages','Bar or pie'],
        ['Students in overlapping clubs','Bar, not pie'],
        ['Exam-score distribution','Histogram'],
        ['Study hours vs. exam score','Scatterplot']
      ]
    },
    weDo:{
      prompt:'A survey asks 200 employees which ONE commuting method they use most often. Results are: subway 40%, bus 25%, car 20%, walk 10%, other 5%. Which displays are appropriate?',
      steps:[
        'The variable is categorical: commuting method.',
        'The categories are intended to be mutually exclusive because each person gives one main method.',
        'The percentages total 100%.',
        'A bar graph can compare the categories.',
        'A pie chart can show each category as part of the whole.',
        'Therefore both a bar graph and pie chart are appropriate.'
      ]
    },
    practice:[
      {id:'s2l2-p1',prompt:'A school reports the percentage of students choosing each of five mutually exclusive lunch plans. Which two displays are appropriate for showing the category proportions?',options:['Bar graph and pie chart','Histogram and scatterplot','Line graph and histogram','Scatterplot and pie chart'],answer:0,rationale:'The variable is categorical, and the categories form one whole. A bar graph can compare the categories and a pie chart can show their proportions of the whole.'},
      {id:'s2l2-p2',prompt:'A survey asks employees to select every benefit they use. The percentages total 168%. Which display is the better choice?',options:['Bar graph','Pie chart','Histogram','Scatterplot'],answer:0,rationale:'The categories overlap because employees may select multiple benefits. A pie chart would wrongly imply mutually exclusive pieces totaling one whole; a bar graph can compare the category percentages.'},
      {id:'s2l2-p3',prompt:'A table of mutually exclusive household expense categories totals 92%. What should you check first?',options:['Whether an Other/Unknown category was omitted','Whether every percentage should be multiplied by 2','Whether the graph must become a scatterplot','Whether categories should overlap'],answer:0,rationale:'If the categories should represent the entire whole but total less than 100%, an omitted remainder category such as Other/Unknown is a natural first check.'},
      {id:'s2l2-p4',prompt:'Which statement best distinguishes a bar graph from a pie chart for categorical data?',options:['Bar graphs emphasize category comparison; pie charts emphasize parts of one whole','Bar graphs are only for quantitative data','Pie charts can represent overlapping categories without restriction','Bar graphs must be vertical'],answer:0,rationale:'Bar length/height is useful for category comparison. Pie slices emphasize each category as a proportion of the whole.'},
      {id:'s2l2-p5',prompt:'You want to display the distribution of 500 exam scores grouped into score intervals. Which graph is most appropriate?',options:['Histogram','Pie chart','Bar graph of category labels','Scatterplot'],answer:0,rationale:'Exam scores are quantitative, and a histogram displays the distribution of quantitative values across intervals or bins.'},
      {id:'s2l2-p6',prompt:'You want to examine whether weekly study hours are related to final-exam score. Which graph is most appropriate?',options:['Scatterplot','Pie chart','Single bar graph','Histogram of categories'],answer:0,rationale:'Both variables are quantitative, so a scatterplot is appropriate for examining their relationship.'},
      {id:'s2l2-p7',prompt:'Monthly website visits are recorded for two years, and you want to show the trend over time. Which display is most appropriate?',options:['Line graph','Pie chart','Histogram','Single-category bar graph'],answer:0,rationale:'A line graph is well suited for showing change or trend over time.'},
      {id:'s2l2-p8',prompt:'A pie chart shows participation in sports 45%, band 35%, theater 30%, and debate 20%. Students may join more than one activity. What is the main problem?',options:['The categories overlap, so the percentages do not represent mutually exclusive parts of one whole','Pie charts can never show categorical data','The chart needs a second y-axis','Every slice must be the same size'],answer:0,rationale:'Because students can appear in multiple categories, the total can exceed 100%. A pie chart falsely implies the categories partition one whole.'}
    ],
    vocab:[
      ['Bar graph','A graph that uses separated bars to compare counts or percentages across categories.'],
      ['Pie chart','A circular graph whose slices represent category proportions of one whole.'],
      ['Histogram','A graph showing the distribution of quantitative data across intervals or bins.'],
      ['Scatterplot','A graph of paired quantitative values used to examine their relationship.'],
      ['Line graph','A graph often used to show how a quantity changes over time.'],
      ['Other/Unknown','A remainder category used when observations do not fit the named categories and the representation is intended to cover the full whole.']
    ],
    provenance:{
      courseStructure:'User-provided WGU D772 Section 2 Lesson 2 practice questions 1–4 and feedback',
      corroboration:[
        {source:'OpenStax Introductory Business Statistics §1.2',url:'https://openstax.org/books/introductory-business-statistics/pages/1-2-data-sampling-and-variation-in-data-and-sampling',supports:'bar graphs and pie charts for categorical data; pie slices represent percentages; bar lengths represent counts or percentages'},
        {source:'OpenStax Introductory Statistics 2e §1.2',url:'https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling',supports:'pie charts cannot appropriately represent overlapping categories whose percentages exceed 100%; missing Other/Unknown category example'},
        {source:'OpenStax Principles of Finance 2e §13.6',url:'https://openstax.org/books/principles-finance-2e/pages/13-6-data-visualization-and-graphical-displays',supports:'bar charts for categorical distributions, histograms for continuous distributions, scatterplots for relationships, time-series graphs for time'}
      ]
    },
    memory:['BAR = compare categories.','PIE = parts of ONE whole.','Overlapping categories → avoid pie chart.','Whole should total about 100% for a pie chart; small rounding differences are possible.','If a complete categorical table totals well below 100%, check for a missing Other/Unknown category.','Histogram = quantitative distribution. Scatterplot = two quantitative variables. Line graph = trend over time.']
  },
  'd772-s2-l3':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 STRUCTURE',
    overview:'Lesson 3 is Data Distribution Interpretation. The course assessment target is: “Can I describe the distribution of data given a graphical display?” Detailed distribution vocabulary will be added from verified lesson material.',
    teach:[{title:'Assessment target',text:'Describe the distribution shown in a graphical display. Majick should require the description to be supported by visible features of the data.'}],
    vocab:[],
    memory:['Describe what the distribution actually shows; do not infer beyond the graph.']
  },
  'd772-s2-l4':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 STRUCTURE',
    overview:'Lesson 4 is Calculating Single-Variable Descriptive Statistics. The course assessment target is: “Can I calculate single-variable descriptive statistics?” Detailed formulas and interpretation rules will be added from verified lesson material.',
    teach:[{title:'Assessment target',text:'Calculate the requested descriptive statistic for one variable and interpret the result in context. Specific formulas and calculator procedures should be verified before they are promoted into trusted notes.'}],
    vocab:[],
    memory:['Know what statistic is requested, calculate it correctly, then interpret it in context.']
  },
  'd772-s2-review':{
    sourceLabel:'COURSE-PROVIDED D772 • SECTION 2 ASSESSMENT PREP',
    overview:'Section 2 review aligns directly to four competency questions supplied in the course.',
    teach:[
      {title:'Assessment Prep 1',text:'Can I identify different classifications of data?'},
      {title:'Assessment Prep 2',text:'Can I select an appropriate graphical display based on data type(s)?'},
      {title:'Assessment Prep 3',text:'Can I describe the distribution of data given a graphical display?'},
      {title:'Assessment Prep 4',text:'Can I calculate single-variable descriptive statistics?'}
    ],
    vocab:[],
    memory:['Classify → choose display → describe distribution → calculate and interpret descriptive statistics.']
  }
};
D772_SECTION_TWO_CONTENT['d772-s2-l4-2']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 4.2",
  "overview": "Use ordered data and the course\u2019s median-of-halves method to calculate quartiles. Range describes the full span; IQR describes the span of the middle 50%. For odd n, leave the overall median out of both halves.",
  "objectives": [
    "Find Q1, Q2, and Q3 using the supplied median-of-halves convention.",
    "Calculate range = maximum \u2212 minimum.",
    "Calculate IQR = Q3 \u2212 Q1 and interpret the middle 50%.",
    "Distinguish spread in values from number of observations."
  ],
  "teach": [
    {
      "title": "Quartiles and percentiles",
      "text": "Q1 corresponds to the 25th percentile, Q2 to the median (50th percentile), and Q3 to the 75th percentile. Quartiles divide ordered observations into four roughly equal-count portions; the numerical distances between quartiles do not need to be equal. Ties can complicate statements about exactly 25% being strictly below a value."
    },
    {
      "title": "Course method: sort, split, take medians",
      "text": "First sort all observations. Find Q2 with the median procedure from Lesson 4.1. Split into lower and upper halves. When n is odd, exclude the single overall median observation from both halves. Then Q1 is the lower-half median and Q3 is the upper-half median. Use this convention consistently with the supplied WGU examples; other software may use different percentile conventions."
    },
    {
      "title": "Even-n worked source example",
      "text": "Sorted data: {1,1,2,2,4,6,6.8,7.2,8,8.3,9,10,10,11.5}. Q2 = (6.8+7.2)/2 = 7. The seven lower observations have median 2, so Q1=2. The seven upper observations have median 9, so Q3=9. IQR = 9\u22122 = 7."
    },
    {
      "title": "Odd-n worked source example",
      "text": "Sort {8,2,13,15,5,10,5} into {2,5,5,8,10,13,15}. Q2=8. Exclude that observation when splitting: lower {2,5,5}, upper {10,13,15}. Their medians give Q1=5 and Q3=13. IQR=13\u22125=8."
    },
    {
      "title": "Range: the full span",
      "text": "Range = maximum \u2212 minimum. The supplied community-event ages run from 12 to 50 years, so range = 50\u221212 = 38 years. Range is a difference, not the largest value or the pair of endpoints."
    },
    {
      "title": "IQR: the middle span",
      "text": "IQR = Q3 \u2212 Q1. It measures the width containing the middle half of ordered observations. Its units match the data\u2019s units; it is not 50% of the numerical range. The box of the next lesson\u2019s boxplot runs from Q1 to Q3. Outlier-fence formulas are outside the scope stated in this upload."
    },
    {
      "title": "Airline fees: repeated values still count",
      "text": "The historical 15-fee example sorts to {60,69,75,75,100,100,100,100,100,100,125,125,125,125,150}. Keep every repeated observation. Q2 is the eighth value, $100. Exclude only that one middle observation, not every $100. The lower half has seven observations and Q1=$75; the upper half has seven and Q3=$125. IQR=$50; range=$90."
    }
  ],
  "anchorChart": {
    "title": "SORT \u2022 SPLIT \u2022 SUMMARIZE SPREAD",
    "rule": "Q1 = median of lower half; Q2 = overall median; Q3 = median of upper half",
    "columns": [
      [
        "Statistic",
        "Meaning or formula"
      ],
      [
        "Q1 / Q2 / Q3",
        "25th / 50th / 75th percentiles"
      ],
      [
        "Odd n",
        "Exclude the overall median from both halves"
      ],
      [
        "Range",
        "Maximum \u2212 minimum: full span"
      ],
      [
        "IQR",
        "Q3 \u2212 Q1: middle 50% span"
      ]
    ],
    "examples": [
      [
        "{2,5,5,8,10,13,15}",
        "Q1=5, Q2=8, Q3=13; IQR=8"
      ],
      [
        "Event ages 12 through 50",
        "Range=38 years"
      ]
    ]
  },
  "weDo": {
    "prompt": "Find quartiles, range and IQR for {1,2,3,4,5,6,7,8,9} using the course convention.",
    "steps": [
      "The data are ordered; Q2 is the fifth value, 5.",
      "Exclude the median 5 from both halves.",
      "Lower half {1,2,3,4}: Q1=(2+3)/2=2.5.",
      "Upper half {6,7,8,9}: Q3=(7+8)/2=7.5.",
      "Range=9\u22121=8.",
      "IQR=7.5\u22122.5=5."
    ]
  },
  "vocab": [
    [
      "Quartiles",
      "Ordered-data cut points corresponding to the 25th, 50th, and 75th percentiles."
    ],
    [
      "Range",
      "Maximum minus minimum, measuring the full numerical span."
    ],
    [
      "Interquartile range (IQR)",
      "Q3 minus Q1, measuring the span of the middle half of ordered observations."
    ]
  ],
  "memory": [
    "Sort before splitting.",
    "Odd n: remove the overall median from both halves.",
    "Range uses extremes; IQR uses quartiles.",
    "Middle 50% describes observations, not half the numerical range."
  ],
  "provenance": {
    "courseStructure": "User-provided Lesson 4.2 quartiles, range, IQR and worked examples, 2026-10-04.",
    "quartileConvention": "Median of halves excluding the overall median when n is odd, as explicitly supplied.",
    "reference": {
      "source": "WGU Figure 4.1, Box Plot Components and IQR",
      "url": "https://assets.wgu.edu/225013c4fb08d105aca2c4d0880850e1",
      "note": "User-provided description; visual in Majick is an original labeled example, not the original asset."
    },
    "coursePractice": "Five additional user-provided ungraded airline-fee questions, 2026-10-04. Questions 1,2,4,5 include supplied correct feedback; question 3 has no supplied answer and its $125 key is independently calculated. Correct/unanswered labels are source metadata, not imported Majick attempts or mastery."
  },
  "practice": [
    {
      "id": "s2l42-p1",
      "prompt": "For {2,5,5,8,10,13,15}, which halves should you use to find Q1 and Q3?",
      "options": [
        "{2,5,5} and {10,13,15}",
        "{2,5,5,8} and {8,10,13,15}",
        "{2,5} and {13,15}",
        "Do not sort the data"
      ],
      "answer": 0,
      "rationale": "The overall median is 8. The supplied course method excludes it from both halves.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-p2",
      "prompt": "For {2,5,5,8,10,13,15}, what is the IQR?",
      "options": [
        "13",
        "8",
        "5",
        "7"
      ],
      "answer": 1,
      "rationale": "Q1=5 and Q3=13, so IQR=13\u22125=8.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-p3",
      "prompt": "Ages run from 12 to 50 years. What is the range?",
      "options": [
        "62 years",
        "50 years",
        "38 years",
        "12 years"
      ],
      "answer": 2,
      "rationale": "Range is maximum minus minimum: 50\u221212=38 years.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-p4",
      "prompt": "For the supplied 14-value example, Q1=2 and Q3=9. What is the IQR?",
      "options": [
        "11",
        "4.5",
        "9",
        "7"
      ],
      "answer": 3,
      "rationale": "IQR=Q3\u2212Q1=9\u22122=7; do not average or add the quartiles.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-p5",
      "prompt": "What does an IQR of 8 minutes describe?",
      "options": [
        "The middle 50% of observations spans 8 minutes",
        "Exactly 8 observations",
        "Half of the entire numerical range",
        "The maximum is 8 minutes"
      ],
      "answer": 0,
      "rationale": "IQR is the numerical width from Q1 to Q3, in the data\u2019s units.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-p6",
      "prompt": "Why can you not assume a calculator\u2019s quartiles match this lesson?",
      "options": [
        "Quartiles never require sorted data",
        "Software can use a different percentile convention",
        "Q2 is never a median",
        "All quartile algorithms are identical"
      ],
      "answer": 1,
      "rationale": "This lesson explicitly uses median-of-halves excluding the overall median for odd n. Other percentile conventions can differ.",
      "provenance": "Majick-authored practice using supplied course methods"
    },
    {
      "id": "s2l42-course-airline-1",
      "prompt": "In the supplied historical June 2009 example, airline pet fees (dollars) are {69,100,75,100,125,150,100,60,100,125,75,100,125,100,125}. What is the median?",
      "options": [
        "$105",
        "$110",
        "$100",
        "$95"
      ],
      "answer": 2,
      "rationale": "Sort all 15 observations. The median position is (15+1)/2=8; the eighth value is $100.",
      "provenance": "User-provided WGU ungraded practice; answer supported by supplied correct feedback"
    },
    {
      "id": "s2l42-course-airline-2",
      "prompt": "In the supplied historical June 2009 example, airline pet fees (dollars) are {69,100,75,100,125,150,100,60,100,125,75,100,125,100,125}. What is the first quartile (Q1)?",
      "options": [
        "$60",
        "$75",
        "$100",
        "$125"
      ],
      "answer": 1,
      "rationale": "Exclude the eighth observation (the overall median). The lower seven values are {60,69,75,75,100,100,100}; their middle, fourth value is $75.",
      "provenance": "User-provided WGU ungraded practice; answer supported by supplied correct feedback"
    },
    {
      "id": "s2l42-course-airline-3",
      "prompt": "In the supplied historical June 2009 example, airline pet fees (dollars) are {69,100,75,100,125,150,100,60,100,125,75,100,125,100,125}. What is the third quartile (Q3)?",
      "options": [
        "$90",
        "$125",
        "$150",
        "$100"
      ],
      "answer": 1,
      "rationale": "Calculated with the supplied course convention: exclude the overall median. The upper seven values are {100,100,125,125,125,125,150}; their fourth value is $125. This answer was calculated by Majick; the pasted WGU item was unanswered.",
      "provenance": "User-provided WGU ungraded practice; answer independently calculated, no supplied key"
    },
    {
      "id": "s2l42-course-airline-4",
      "prompt": "In the supplied historical June 2009 example, airline pet fees (dollars) are {69,100,75,100,125,150,100,60,100,125,75,100,125,100,125}. What is the interquartile range (IQR)?",
      "options": [
        "$20",
        "$50",
        "$40",
        "$60"
      ],
      "answer": 1,
      "rationale": "IQR = Q3 \u2212 Q1 = $125 \u2212 $75 = $50. It measures the span of the middle 50%, not the full span.",
      "provenance": "User-provided WGU ungraded practice; answer supported by supplied correct feedback"
    },
    {
      "id": "s2l42-course-airline-5",
      "prompt": "In the supplied historical June 2009 example, airline pet fees (dollars) are {69,100,75,100,125,150,100,60,100,125,75,100,125,100,125}. What is the range?",
      "options": [
        "$60",
        "$90",
        "$50",
        "$100"
      ],
      "answer": 1,
      "rationale": "Range = maximum \u2212 minimum = $150 \u2212 $60 = $90. The minimum $60 is an endpoint, not the range.",
      "provenance": "User-provided WGU ungraded practice; answer supported by supplied correct feedback"
    }
  ],
  "visuals": [
    {
      "title": "Middle 50%: IQR spans Q1 to Q3",
      "src": "lesson-visuals/iqr-middle-half.svg",
      "alt": "Example boxplot: minimum 1, Q1 2, median 7, Q3 9, maximum 11.5. IQR equals 7."
    }
  ]
};
D772_SECTION_TWO_CONTENT['d772-s2-l4']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 4",
  "overview": "Single-variable descriptive statistics summarize one variable. This lesson covers measures of center (mean, median, mode), measures of spread (range and interquartile range), and the five-number summary and box plots.",
  "objectives": [
    "Calculate single-variable descriptive statistics."
  ],
  "teach": [
    {
      "title": "Lesson skills",
      "text": "Calculate and interpret a summary in context. Begin with mean, median, and mode in Lesson 4.1. Measures of spread and five-number summaries have their own reserved units; their detailed teaching will expand as material is supplied."
    }
  ],
  "vocab": [],
  "memory": [
    "Center describes a typical or middle value. Spread describes variability."
  ],
  "provenance": {
    "courseStructure": "User-provided Lesson 4 introduction and objective, 2026-10-04."
  }
};
D772_SECTION_TWO_CONTENT['d772-s2-l4-1']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 4.1",
  "overview": "Calculate mean, median, and mode, then explain what each tells you. Repeated observations count separately. Sort before finding a median, and keep a position number separate from the value at that position.",
  "objectives": [
    "Calculate mean as sum divided by observation count.",
    "Find medians for odd and even sample sizes.",
    "Distinguish median location from median value.",
    "Find one or several tied most-frequent values.",
    "Explain why a median is often preferable for skewed quantitative data."
  ],
  "teach": [
    {
      "title": "Mean: total divided by count",
      "text": "Mean = (sum of all values) / n. Count every observation, including repeats. For {1,1,1,2,2,3,4,4,4,4,4}, the sum is 30 and n is 11, giving 30/11 \u2248 2.73. Divide by 11 observations, not by the four distinct values."
    },
    {
      "title": "Median: sort, locate, then read",
      "text": "Order the values from smallest to largest. The middle position is (n+1)/2 using positions counted from 1. For odd n, read the value at that position. For even n, average the values at positions n/2 and n/2+1. The position formula does not give the median\u2019s numerical value."
    },
    {
      "title": "Location versus value",
      "text": "With n=97, the middle position is 49, so read the 49th ordered value. With n=100, position 50.5 means average the 50th and 51st values; it does not mean the median is 50.5. In the supplied 40-person museum example, positions 20 and 21 contain ages 23 and 24: median = (23+24)/2 = 23.5 years."
    },
    {
      "title": "Mode: highest frequency, ties allowed",
      "text": "Find the value or category occurring most often. In the supplied 20-score example, 72 occurs five times and is the mode. In {430,430,480,480,495}, both 430 and 480 occur twice and tie for the highest frequency, so both are modes. A lower-frequency repeated value is not another mode."
    },
    {
      "title": "Choosing a useful summary",
      "text": "Extreme quantitative values influence the mean more than the median, so a median is often a better summary of a skewed data set. The mode can summarize categorical data, such as the most common color. A numerical mode may be correct yet poorly represent the center of the full distribution."
    },
    {
      "title": "Mode here versus histogram peaks",
      "text": "For raw data, modes are the exact values tied for highest frequency. In Lesson 3.1, histogram modality counts meaningful local peaks of intervals, even when their heights differ. Do not apply the tied-frequency rule for raw-data modes to histogram peak counting."
    }
  ],
  "anchorChart": {
    "title": "CENTER: TOTAL \u2022 MIDDLE \u2022 MOST OFTEN",
    "rule": "Mean: sum/n. Median: sort \u2192 locate \u2192 read or average. Mode: highest frequency.",
    "columns": [
      [
        "Measure",
        "Procedure and trap"
      ],
      [
        "Mean",
        "Count repeated observations; divide by n"
      ],
      [
        "Median, odd n",
        "Read ordered value at (n+1)/2"
      ],
      [
        "Median, even n",
        "Average ordered values at n/2 and n/2+1"
      ],
      [
        "Mode",
        "All values tied for highest frequency count"
      ],
      [
        "Interpretation",
        "Give the statistic in the variable\u2019s units; position is not value"
      ]
    ],
    "examples": [
      [
        "30 total over 11 observations",
        "Mean \u2248 2.73"
      ],
      [
        "Middle ages 23 and 24",
        "Median = 23.5 years"
      ],
      [
        "430 and 480 each occur twice",
        "Two modes: 430 and 480"
      ],
      [
        "{1,1,1,3,6,6}",
        "Mean 3; median 2; mode 1"
      ],
      [
        "{2,3,5,5,7,8,8,9}",
        "Mean 5.875; modes 5 and 8"
      ]
    ]
  },
  "weDo": {
    "prompt": "Calculate mean, median, and mode for {2,4,4,6,9}.",
    "steps": [
      "Sum: 2+4+4+6+9 = 25; five observations.",
      "Mean = 25/5 = 5.",
      "The data are sorted. Middle position = (5+1)/2 = 3.",
      "The third value is 4, so median = 4; the position 3 is not the median value.",
      "The value 4 occurs twice, more than every other value, so mode = 4."
    ]
  },
  "vocab": [
    [
      "Mean",
      "Sum of quantitative observations divided by their count."
    ],
    [
      "Median",
      "Middle ordered value, or average of the two middle ordered values."
    ],
    [
      "Mode (raw data)",
      "Value or category with the greatest frequency; ties can produce multiple modes."
    ]
  ],
  "memory": [
    "Count observations, not distinct values.",
    "Sort before finding the median.",
    "A position is a place in the ordered list, not the median itself.",
    "For even n, average the two central VALUES."
  ],
  "provenance": {
    "courseStructure": "User-provided Lesson 4 introduction and mean/median/mode teaching and examples, 2026-10-04.",
    "formulas": "Missing pasted SVG formulas reconstructed as mean=sum/n and median position=(n+1)/2, consistent with the supplied 97-, 100-, and 40-observation examples.",
    "practice": "Majick-authored checks derived from supplied methods; not claimed as WGU assessment items.",
    "coursePractice": "Six user-provided ungraded questions with correct feedback. This is source answer-key evidence, not an imported graded quiz result or a Majick attempt."
  },
  "practice": [
    {
      "id": "s2l41-p1",
      "prompt": "For {1,1,1,2,2,3,4,4,4,4,4}, what is the mean?",
      "options": [
        "2.73 approximately",
        "7.5",
        "4",
        "11"
      ],
      "answer": 0,
      "rationale": "The sum is 30 and there are 11 observations, including repeats. Mean = 30/11 \u2248 2.73."
    },
    {
      "id": "s2l41-p2",
      "prompt": "For 100 sorted values, the middle position is 50.5. What should you do?",
      "options": [
        "Report 50.5 as the median",
        "Average the 50th and 51st values",
        "Read only the 50th value",
        "Divide the sum by 50.5"
      ],
      "answer": 1,
      "rationale": "50.5 indicates a position between observations, not a data value. Average the two central values."
    },
    {
      "id": "s2l41-p3",
      "prompt": "The 20th and 21st ages in a sorted 40-person data set are 23 and 24. What is the median age?",
      "options": [
        "20.5 years",
        "23 years",
        "23.5 years",
        "24 years"
      ],
      "answer": 2,
      "rationale": "The position is 20.5, but the median value is (23+24)/2 = 23.5 years."
    },
    {
      "id": "s2l41-p4",
      "prompt": "What are the modes of {430,430,480,480,495}?",
      "options": [
        "430 only",
        "480 only",
        "495",
        "430 and 480"
      ],
      "answer": 3,
      "rationale": "430 and 480 tie for the highest frequency: two appearances each."
    },
    {
      "id": "s2l41-p5",
      "prompt": "For {9,1,5,3,7}, what is the median?",
      "options": [
        "5",
        "3",
        "7",
        "9"
      ],
      "answer": 0,
      "rationale": "Sort to {1,3,5,7,9}. The third value is 5."
    },
    {
      "id": "s2l41-p6",
      "prompt": "Most salaries are moderate, with a few exceptionally high salaries. Which measure is generally less affected by those extreme salaries?",
      "options": [
        "Mean",
        "Median",
        "Sum",
        "Maximum"
      ],
      "answer": 1,
      "rationale": "The median depends on ordered middle values and is less sensitive to extreme high values than the mean."
    },
    {
      "id": "s2l41-p7",
      "prompt": "The most common survey response is red. Which measure of center applies to the color categories?",
      "options": [
        "Mean",
        "Median calculated numerically",
        "Mode",
        "Range"
      ],
      "answer": 2,
      "rationale": "Mode identifies the most frequent category. Arbitrary color labels do not provide meaningful numerical amounts to average."
    },
    {
      "id": "s2l41-course-p1",
      "prompt": "What is the mean of {1,1,1,3,6,6}?",
      "options": [
        "2",
        "2.5",
        "3",
        "3.5"
      ],
      "answer": 2,
      "rationale": "The six observations total 18. Mean = 18/6 = 3. Count each repeated observation.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    },
    {
      "id": "s2l41-course-p2",
      "prompt": "What is the median of {1,1,1,3,6,6}?",
      "options": [
        "2",
        "3.5",
        "3",
        "2.5"
      ],
      "answer": 0,
      "rationale": "The data are sorted and n=6. The third and fourth values are 1 and 3, so median = (1+3)/2 = 2. Average the values, not their position numbers.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    },
    {
      "id": "s2l41-course-p3",
      "prompt": "What is the mode of {1,1,1,3,6,6}?",
      "options": [
        "There is no mode",
        "1",
        "6",
        "1 and 6"
      ],
      "answer": 1,
      "rationale": "1 occurs three times, 6 twice, and 3 once. Only 1 has the greatest frequency. Repetition alone does not make 6 another mode.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    },
    {
      "id": "s2l41-course-p4",
      "prompt": "What is the mean of {2,3,5,5,7,8,8,9}?",
      "options": [
        "5.5",
        "5.75",
        "6",
        "5.875"
      ],
      "answer": 3,
      "rationale": "The total is 47 over eight observations. Mean = 47/8 = 5.875; keep the exact result when it appears among the choices.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    },
    {
      "id": "s2l41-course-p5",
      "prompt": "What is the median of {6,1,12,13,4,9,4}?",
      "options": [
        "6",
        "5",
        "7",
        "13"
      ],
      "answer": 0,
      "rationale": "Sort first: {1,4,4,6,9,12,13}. With seven observations, the fourth value is the median: 6.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    },
    {
      "id": "s2l41-course-p6",
      "prompt": "What are the modes of {2,3,5,5,7,8,8,9}?",
      "options": [
        "5",
        "5 and 8",
        "8",
        "There is no mode"
      ],
      "answer": 1,
      "rationale": "5 and 8 each occur twice, tying for the highest frequency. Both are modes.",
      "provenance": "User-provided Lesson 4.1 ungraded course question and correct-answer feedback, 2026-10-04"
    }
  ]
};
D772_SECTION_TWO_CONTENT['d772-s2-l3-quiz']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 3 \u2022 QUIZ 1",
  "overview": "Imported result: 9/10 on Data Distribution Interpretation Quiz 1. Question 3 was incorrect. The focused repair is distinguishing a normal bell-shaped distribution from a flat uniform distribution; this report does not establish whole-lesson mastery. Retries begin unanswered.",
  "objectives": [
    "Distinguish normal and uniform shapes using peak structure, not symmetry alone.",
    "Describe symmetry and modality separately.",
    "Name skew using the longer tail."
  ],
  "teach": [
    {
      "title": "Repair Question 3: bell versus flat",
      "text": "Both normal and uniform distributions can be symmetric. Look at frequency heights: normal has one central peak with frequencies decreasing toward both tails; uniform has approximately equal frequencies across intervals. Use the two visuals below to compare their silhouettes."
    },
    {
      "title": "Explain why",
      "text": "If you call a graph normal, point to its central peak, mirror balance, and bell-shaped taper. If its bars stay roughly level, say uniform and explain that no clear peak appears. A symmetric two-peak graph is bimodal, not normal."
    }
  ],
  "visuals": [
    {
      "title": "Normal: central peak and balanced taper",
      "src": "lesson-visuals/distribution-approximately-normal.svg",
      "alt": "Illustrative normal-shaped histogram: one central peak and shorter balanced bars toward both ends."
    },
    {
      "title": "Uniform: approximately level frequencies",
      "src": "lesson-visuals/distribution-uniform.svg",
      "alt": "Illustrative uniform histogram: equal-height bars across the value intervals with no central peak."
    }
  ],
  "weDo": {
    "prompt": "A histogram has nearly equal frequencies across all intervals and its two sides are mirror images. A classmate calls it normal because it is symmetric. Repair that reasoning.",
    "steps": [
      "Symmetry checks left-right balance. Both normal and uniform shapes can pass that check.",
      "The bars are approximately level, not concentrated around one central peak.",
      "The distribution is uniform.",
      "Normal requires a single central peak and a roughly bell-shaped taper as well as symmetry.",
      "Now change the scenario: one central peak, balanced taper toward both ends. That description is approximately normal."
    ]
  },
  "vocab": [],
  "memory": [
    "Normal = balanced bell with one central peak. Uniform = approximately flat.",
    "Symmetry alone does not establish normality."
  ],
  "practice": [
    {
      "id": "s2l3quiz1-p1",
      "prompt": "What is the shape when values are evenly spread out and there is no clear peak?",
      "options": [
        "Skewed right",
        "Skewed left",
        "Unimodal",
        "Uniform"
      ],
      "answer": 3,
      "rationale": "Uniform distributions have approximately equal frequencies and no clear peaks.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p2",
      "prompt": "What describes a distribution with a long tail on the right?",
      "options": [
        "Symmetric",
        "Skewed right",
        "Skewed left",
        "Uniform"
      ],
      "answer": 1,
      "rationale": "Skew follows the longer tail. The tail points toward larger values on the right, even when the bulk of observations is on the left.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p3",
      "prompt": "What characterizes a normal distribution?",
      "options": [
        "A long tail on one side",
        "Multiple peaks",
        "A bell-shaped curve symmetric around the mean",
        "Uniform distribution of values"
      ],
      "answer": 2,
      "rationale": "Normal means symmetric, unimodal, and bell-shaped around the mean. Uniform means approximately flat. Both can be symmetric, so symmetry alone cannot distinguish them.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p4",
      "prompt": "A histogram has bars of approximately equal height. Which description fits?",
      "options": [
        "Skewed left",
        "Skewed right",
        "Uniform",
        "Normal"
      ],
      "answer": 2,
      "rationale": "Approximately equal bar heights form a flat, uniform distribution; they do not form a central bell-shaped peak.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p5",
      "prompt": "Most observations are on the right, with a long tail on the left. Which description fits?",
      "options": [
        "Skewed left",
        "Skewed right",
        "Uniform",
        "Symmetric"
      ],
      "answer": 0,
      "rationale": "Name skew by the longer tail, not by the tallest bars: the left tail indicates negative or left skew.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p6",
      "prompt": "A histogram has peaks at the left and right edges, a valley in the middle, and mirror-image sides. Which description fits?",
      "options": [
        "Symmetric and uniform",
        "Normal and symmetric",
        "Symmetric and bimodal",
        "Normal and bimodal"
      ],
      "answer": 2,
      "rationale": "Mirror balance makes it symmetric. Two peaks make it bimodal. A normal distribution has one central peak.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p7",
      "prompt": "A histogram has a higher peak on the left and a smaller prominent peak on the right. Which description best fits?",
      "options": [
        "Unimodal and symmetric",
        "Bimodal and symmetric",
        "Unimodal but not symmetric",
        "Bimodal but not symmetric"
      ],
      "answer": 3,
      "rationale": "Each meaningful local peak counts, even when their heights differ. The unequal left and right peaks in this described display do not form mirror images.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p8",
      "prompt": "A histogram is symmetric, has one central peak, and is roughly bell-shaped. Which description fits?",
      "options": [
        "Skewed left",
        "Uniform",
        "Normal",
        "Bimodal"
      ],
      "answer": 2,
      "rationale": "This description meets all three features of an approximately normal shape: symmetry, one peak, and a bell-shaped profile.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p9",
      "prompt": "Most observations are on the left, with a long tail on the right. Which description fits?",
      "options": [
        "Skewed left",
        "Skewed right",
        "Uniform",
        "Symmetric"
      ],
      "answer": 1,
      "rationale": "The sparse tail stretches toward larger values, so the distribution is skewed right.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    },
    {
      "id": "s2l3quiz1-p10",
      "prompt": "A histogram has two peaks near its center separated by a small valley, and its sides are mirror images. Which description fits?",
      "options": [
        "Unimodal and symmetric",
        "Unimodal and uniform",
        "Bimodal and symmetric",
        "Bimodal and uniform"
      ],
      "answer": 2,
      "rationale": "Two distinct peaks separated by a valley indicate bimodality; mirror-image sides indicate symmetry. Two peaks do not become one just because they are close.",
      "provenance": "User-provided quiz item and feedback, paraphrased"
    }
  ],
  "provenance": {
    "courseStructure": "User-provided D772 Section 2 Lesson 3 \u2014 Data Distribution Interpretation Quiz 1 report, 2026-10-04.",
    "reportedResult": {
      "correct": 9,
      "total": 10,
      "incorrectQuestionNumbers": [
        3
      ],
      "selectedAnswerForQuestion3": "Not explicitly supplied",
      "origin": "User-provided completed quiz report",
      "scope": "Quiz result only; no automatic mastery, reward, or invented attempt record."
    },
    "visuals": "Reuses labeled Majick illustrative histograms from Lesson 3.1; originals were described in text, not supplied as images."
  }
};
D772_SECTION_TWO_CONTENT['d772-s2-l3-1']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 3.1",
  "overview": "Describe a histogram\u2019s shape using symmetry, modality, and skewness. These describe different features: a distribution can be both unimodal and skewed right, or symmetric and bimodal.",
  "objectives": [
    "Read values or intervals horizontally and frequencies vertically.",
    "Identify approximate symmetry and count local peaks.",
    "Distinguish unimodal, bimodal, multimodal, and uniform shapes.",
    "Recognize an approximately normal distribution.",
    "Name skew by the longer tail, not by the location of the tallest bars."
  ],
  "visuals": [
    {
      "title": "Approximately normal",
      "src": "lesson-visuals/distribution-approximately-normal.svg",
      "alt": "Illustrative histogram of a approximately normal distribution. Frequency bar heights: 1, 3, 7, 12, 16, 12, 7, 3, 1."
    },
    {
      "title": "Symmetric bimodal",
      "src": "lesson-visuals/distribution-symmetric-bimodal.svg",
      "alt": "Illustrative histogram of a symmetric bimodal distribution. Frequency bar heights: 1, 6, 12, 6, 2, 6, 12, 6, 1."
    },
    {
      "title": "Uniform",
      "src": "lesson-visuals/distribution-uniform.svg",
      "alt": "Illustrative histogram of a uniform distribution. Frequency bar heights: 8, 8, 8, 8, 8, 8, 8, 8, 8."
    },
    {
      "title": "Skewed right",
      "src": "lesson-visuals/distribution-skewed-right.svg",
      "alt": "Illustrative histogram of a skewed right distribution. Frequency bar heights: 14, 18, 12, 8, 5, 3, 2, 1, 1."
    },
    {
      "title": "Skewed left",
      "src": "lesson-visuals/distribution-skewed-left.svg",
      "alt": "Illustrative histogram of a skewed left distribution. Frequency bar heights: 1, 1, 2, 3, 5, 8, 12, 18, 14."
    }
  ],
  "teach": [
    {
      "title": "Read the axes before describing shape",
      "text": "The histogram\u2019s horizontal axis contains quantitative value intervals. Its bar heights show how many observations fall within each interval. Shape concerns the pattern across the entire distribution, not just the tallest bar."
    },
    {
      "title": "Symmetry is approximate mirror balance",
      "text": "Imagine a vertical line through the middle. If the two sides have roughly matching shape and tail lengths, the distribution is approximately symmetric. Small irregularities do not automatically make it asymmetric."
    },
    {
      "title": "Modality counts local peaks",
      "text": "A peak is higher than the neighboring regions, not necessarily the tallest region in the whole graph. Unimodal means one peak, bimodal two, and multimodal three or more in this course. Peaks can have different heights. A uniform distribution is approximately flat with no clear peaks; tiny fluctuations do not count as meaningful modes."
    },
    {
      "title": "Normal requires more than symmetry",
      "text": "An approximately normal distribution is symmetric, unimodal, and roughly bell-shaped around its center. A symmetric bimodal or uniform distribution is not normal. Real measurements may be approximately normal, but a variable\u2019s name alone does not guarantee that shape."
    },
    {
      "title": "Skew follows the long tail",
      "text": "Skewed right (positive skew) has a longer tail toward larger values; most observations may be toward the left. Skewed left (negative skew) has a longer tail toward smaller values; most observations may be toward the right. Follow the horizontal extent of the sparse tail, not the tall bars."
    },
    {
      "title": "Salary example: combine descriptors",
      "text": "The supplied salary histogram and feedback describe one peak near lower salaries and a long tail toward higher salaries. Its modality is unimodal and its shape is skewed right. Both labels apply because they describe different features."
    }
  ],
  "anchorChart": {
    "title": "BALANCE \u2022 PEAKS \u2022 TAIL",
    "rule": "Check symmetry \u2192 count meaningful peaks \u2192 follow the longer tail",
    "columns": [
      [
        "Check",
        "Interpretation"
      ],
      [
        "Symmetry",
        "Approximate mirror images; not necessarily normal"
      ],
      [
        "Modality",
        "1 peak: unimodal; 2: bimodal; 3+: multimodal; flat: uniform"
      ],
      [
        "Normal",
        "Symmetric + unimodal + roughly bell-shaped"
      ],
      [
        "Right skew",
        "Long tail toward larger values"
      ],
      [
        "Left skew",
        "Long tail toward smaller values"
      ]
    ],
    "examples": [
      [
        "One peak near low salaries + high-salary tail",
        "Unimodal and skewed right"
      ],
      [
        "Two balanced peaks",
        "Symmetric and bimodal, not normal"
      ],
      [
        "Approximately equal frequencies across intervals",
        "Uniform, possibly symmetric, not normal"
      ]
    ]
  },
  "weDo": {
    "prompt": "Most repair jobs finish quickly, but a few take much longer. The histogram has one peak near the shorter durations and a long tail toward larger durations. Describe it.",
    "steps": [
      "Read the horizontal variable: repair duration.",
      "Find the number of meaningful local peaks: one, so unimodal.",
      "Follow the longer tail: toward large durations on the right.",
      "The shape is skewed right, even though the tallest bars are on the left.",
      "It is not approximately normal because the two tails are not balanced."
    ]
  },
  "vocab": [
    [
      "Frequency",
      "Number of observations of a value, or in a histogram interval."
    ],
    [
      "Peak/mode",
      "A locally high-frequency region compared with neighboring regions."
    ],
    [
      "Modality (peakedness)",
      "Number of meaningful peaks in a distribution."
    ],
    [
      "Symmetric distribution",
      "Approximately mirror-balanced shape around its middle."
    ],
    [
      "Unimodal",
      "One meaningful peak."
    ],
    [
      "Bimodal",
      "Two meaningful peaks."
    ],
    [
      "Multimodal",
      "Three or more meaningful peaks in the terminology of this course."
    ],
    [
      "Uniform",
      "Approximately equal frequencies with no clear peaks."
    ],
    [
      "Skewness",
      "Asymmetry with one tail extending substantially farther than the other."
    ],
    [
      "Skewed right (positive skew)",
      "Longer tail toward larger values."
    ],
    [
      "Skewed left (negative skew)",
      "Longer tail toward smaller values."
    ],
    [
      "Approximately normal",
      "Symmetric, unimodal, roughly bell-shaped distribution."
    ]
  ],
  "memory": [
    "Name skew by the TAIL.",
    "Count local peaks; their heights can differ.",
    "Symmetric does not automatically mean normal.",
    "Modality and skew can both describe the same graph."
  ],
  "provenance": {
    "courseStructure": "User-provided WGU D772 Lesson 3.1 text, figure descriptions, questions 1\u20133 and correct-answer feedback, 2026-10-04.",
    "visuals": "Majick-authored illustrative equal-width-bin histograms. These are not copies of WGU figures and do not reproduce their measured values. Original asset links could not be opened for independent inspection.",
    "references": [
      {
        "source": "WGU Figure 3.10/3.11 salary histogram",
        "url": "https://assets.wgu.edu/96fdd440689ff89c3ed2734b85213aae"
      },
      {
        "source": "WGU Figure 3.1/3.12 comparison",
        "url": "https://assets.wgu.edu/e34328724d5683a13a728e1de657a0ec"
      },
      {
        "source": "Panopto: Data Distributions (supplied attribution, not independently reviewed)",
        "url": "https://wgu.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=2ad9a886-ac6e-4551-9148-b1bf0010cccc"
      }
    ]
  },
  "practice": [
    {
      "id": "s2l31-p1",
      "prompt": "The supplied salary histogram has most salaries in lower ranges and a long tail toward higher salaries. What is its shape?",
      "options": [
        "Skewed right",
        "Symmetric",
        "Skewed left"
      ],
      "answer": 0,
      "rationale": "The longer tail extends toward higher values on the right. The location of the tallest bars does not name the skew.",
      "provenance": "Course question and supplied feedback, description-based"
    },
    {
      "id": "s2l31-p2",
      "prompt": "The supplied salary histogram has one meaningful peak near the lower salaries. What is its modality?",
      "options": [
        "Uniform",
        "Multimodal",
        "Bimodal",
        "Unimodal"
      ],
      "answer": 3,
      "rationale": "One meaningful local peak makes the distribution unimodal. It can also be skewed right.",
      "provenance": "Course question and supplied feedback, description-based"
    },
    {
      "id": "s2l31-p3",
      "prompt": "Histogram A has a substantially longer left tail. Histogram B is symmetric, unimodal, and bell-shaped. Which is approximately normal?",
      "options": [
        "Histogram A",
        "Histogram B"
      ],
      "answer": 1,
      "rationale": "Histogram B meets all three shape requirements. This question uses the supplied descriptions rather than unseen numerical values.",
      "provenance": "Course question and supplied feedback, description-based"
    },
    {
      "id": "s2l31-p4",
      "prompt": "A histogram has two peaks of different heights, each above its neighboring regions. How many modes does it have?",
      "options": [
        "One: only the tallest counts",
        "Two: each local peak counts",
        "None: the peaks must match",
        "Three: count the valley too"
      ],
      "answer": 1,
      "rationale": "Both local peaks count even if one is taller. A valley is not a peak.",
      "provenance": "Majick-authored transfer/repair scenario"
    },
    {
      "id": "s2l31-p5",
      "prompt": "A symmetric histogram is nearly flat across its intervals. Which description fits?",
      "options": [
        "Normal because it is symmetric",
        "Uniform and not normal",
        "Skewed right",
        "Unimodal and bell-shaped"
      ],
      "answer": 1,
      "rationale": "Flat frequencies mean uniform. Symmetry alone does not imply a normal bell shape.",
      "provenance": "Majick-authored transfer/repair scenario"
    },
    {
      "id": "s2l31-p6",
      "prompt": "Most scores are high, but a few very low scores form a long tail toward smaller values. What is the skew?",
      "options": [
        "Skewed right",
        "Skewed left",
        "Normal",
        "Uniform"
      ],
      "answer": 1,
      "rationale": "The longer tail points left toward smaller values, even though most observations are toward the right.",
      "provenance": "Majick-authored transfer/repair scenario"
    },
    {
      "id": "s2l31-p7",
      "prompt": "A distribution has three distinct meaningful peaks. Which modality term does this course use?",
      "options": [
        "Unimodal",
        "Bimodal",
        "Multimodal",
        "Uniform"
      ],
      "answer": 2,
      "rationale": "This course calls distributions with three or more meaningful peaks multimodal.",
      "provenance": "Majick-authored transfer/repair scenario"
    },
    {
      "id": "s2l31-p8",
      "prompt": "Why can a salary histogram be both unimodal and skewed right?",
      "options": [
        "The labels describe different features: peak count and tail direction",
        "Every unimodal distribution is normal",
        "Skew counts the peaks",
        "The labels are contradictory"
      ],
      "answer": 0,
      "rationale": "Unimodal counts one peak; skewed right describes the long right tail. Both can apply.",
      "provenance": "Majick-authored transfer/repair scenario"
    }
  ]
};
D772_SECTION_TWO_CONTENT['d772-s2-l2-quiz']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 2 \u2022 QUIZ 1",
  "overview": "Imported result: 10/10 correct on Choosing Graphical Displays Quiz 1. This is evidence from the supplied quiz report, not a claim of whole-course mastery. Retry questions below start unanswered; feedback appears after a selection.",
  "objectives": [
    "Select a display from the variable types and purpose.",
    "Recognize stem-and-leaf limitations and quantitative dot plots.",
    "Distinguish a categorical bar graph from a histogram."
  ],
  "teach": [],
  "vocab": [],
  "memory": [],
  "practice": [
    {
      "id": "s2l2quiz1-p1",
      "prompt": "Which display is best for one-variable categorical data among these choices?",
      "options": [
        "Pie chart",
        "Dot plot",
        "Histogram",
        "Scatterplot"
      ],
      "answer": 0,
      "rationale": "A pie chart shows category proportions of one whole. It is the categorical display among these options; a bar graph can also be appropriate when offered.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p2",
      "prompt": "Which display shows the distribution of heights for a large class?",
      "options": [
        "Histogram",
        "Pie chart",
        "Bar graph",
        "Two-way table"
      ],
      "answer": 0,
      "rationale": "Height is one quantitative variable. A histogram groups its values into intervals and shows frequency, making a large data set manageable.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p3",
      "prompt": "What is a key limitation of stem-and-leaf plots?",
      "options": [
        "They are not useful for large data sets",
        "They cannot display quantitative data",
        "They are difficult to create",
        "They cannot show individual data points"
      ],
      "answer": 0,
      "rationale": "Stem-and-leaf plots preserve individual quantitative values, but become cumbersome with large data sets. The course answer contrasts large data sets with smaller sets where individual values remain easy to read.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p4",
      "prompt": "Which display compares college students\u2019 degree programs with their quiz scores?",
      "options": [
        "Scatterplot",
        "Side-by-side boxplot",
        "Two-way table",
        "Dot plot"
      ],
      "answer": 1,
      "rationale": "Degree program is categorical; score is quantitative. Compare score distributions by program with side-by-side boxplots.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p5",
      "prompt": "Which display analyzes practice-problem counts and final-exam scores?",
      "options": [
        "Pie chart",
        "Histogram",
        "Bar graph",
        "Scatterplot"
      ],
      "answer": 3,
      "rationale": "Both variables are quantitative. A scatterplot displays each paired count and score; it does not by itself establish causation.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p6",
      "prompt": "Which display fits C\u2192C (categorical explanatory and categorical response)?",
      "options": [
        "Two-way table",
        "Scatterplot",
        "Histogram",
        "Dot plot"
      ],
      "answer": 0,
      "rationale": "A two-way table cross-classifies the frequencies of combinations of two categorical variables.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p7",
      "prompt": "Which display relates relationship status (in a relationship or not) to restaurant spending?",
      "options": [
        "Two-way table",
        "Scatterplot",
        "Side-by-side boxplot",
        "Histogram"
      ],
      "answer": 2,
      "rationale": "Relationship status is categorical and spending is quantitative: C\u2192Q. Side-by-side boxplots compare spending distributions across the status groups.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p8",
      "prompt": "When should you use a dot plot?",
      "options": [
        "Comparing two categorical variables",
        "Displaying one-variable quantitative data",
        "Displaying one-variable categorical data",
        "Displaying the relationship between two quantitative variables"
      ],
      "answer": 1,
      "rationale": "A dot plot places individual quantitative values on a number line; stacked dots show repeated values and make the distribution visible.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p9",
      "prompt": "Which is a reason to use a bar graph instead of a pie chart?",
      "options": [
        "The data are quantitative",
        "The percentages add up to more than 100%",
        "Pie charts cannot show percentages",
        "Bar graphs are the only categorical display"
      ],
      "answer": 1,
      "rationale": "A pie chart represents mutually exclusive pieces of one complete whole. Overlapping categories can total more than 100%, so compare them using bars. Totals below 100% require checking coverage or missing categories; small rounding differences are possible.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    },
    {
      "id": "s2l2quiz1-p10",
      "prompt": "A chart titled Favorite Pizza Topping has four bars labeled Pepperoni, Cheese, Sausage, and Veggie. What type of graph is it?",
      "options": [
        "Bar graph",
        "Histogram",
        "Stem-and-leaf plot",
        "Side-by-side boxplot"
      ],
      "answer": 0,
      "rationale": "The horizontal labels identify categories, and each bar represents a category frequency. A histogram instead uses quantitative intervals.",
      "provenance": "User-provided quiz item and correct-answer feedback; wording condensed and explanation clarified"
    }
  ],
  "provenance": {
    "courseStructure": "User-provided D772 Section 2 Lesson 2 \u2014 Choosing Graphical Displays Quiz 1 report, 2026-10-04.",
    "reportedResult": {
      "correct": 10,
      "total": 10,
      "origin": "User-provided completed quiz report",
      "scope": "This quiz only; not a Majick attempt, XP reward, or mastery promotion."
    },
    "sourceImage": "Question 10 uses the supplied textual description; original graphic was not attached."
  }
};
D772_SECTION_TWO_CONTENT['d772-s2-l2-summary']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 2 SUMMARY",
  "overview": "Choose a display by identifying how many variables you have, classifying their types, and deciding what you want to compare or describe. This summary revisits the existing lessons rather than adding duplicate definitions.",
  "objectives": [
    "Select displays for one categorical variable, one quantitative variable, or a pair of variables.",
    "Explain the purpose and limitations of the selected display.",
    "Prepare to interpret distributions in Lesson 3."
  ],
  "teach": [
    {
      "title": "One categorical variable",
      "text": "Review pie charts and bar graphs from Lesson 2.1. Decide whether the goal is category comparison or parts of one complete whole; check for overlapping or missing categories."
    },
    {
      "title": "One quantitative variable",
      "text": "Review stem-and-leaf plots, dot plots, and histograms from Lesson 2.2. Choose according to the amount of data, whether individual values should remain visible, and whether a grouped distribution is useful."
    },
    {
      "title": "Two variables",
      "text": "Review Lesson 2.3: C\u2192C uses a two-way table; C\u2192Q uses side-by-side boxplots; Q\u2192Q uses a scatterplot. Identify explanatory and response roles separately from categorical and quantitative types."
    },
    {
      "title": "Apply the selection process",
      "text": "For a new data set, identify the variables, classify their types, state the comparison or relationship of interest, and justify the display. A familiar graph is not automatically the right graph."
    },
    {
      "title": "Next: Data Distribution Interpretation",
      "text": "Lesson 3 moves from choosing a display to describing what it shows. You will build on the graph-selection foundation to interpret data distributions using statistical concepts and graphical features."
    }
  ],
  "vocab": [],
  "memory": [
    "How many variables? \u2192 What types? \u2192 What purpose? \u2192 Which display?",
    "One categorical: bar or pie. One quantitative: stem-and-leaf, dot plot, or histogram.",
    "C\u2192C: two-way table. C\u2192Q: side-by-side boxplots. Q\u2192Q: scatterplot."
  ],
  "provenance": {
    "courseStructure": "User-provided WGU D772 Lesson 2 Summary and Next Step, 2026-10-04.",
    "scope": "Synthesis of existing coverage; no new vocabulary definitions, assessment results, or completion state."
  }
};
D772_SECTION_TWO_CONTENT['d772-s2-l2-3']={
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 2.3",
  "overview": "Classify the explanatory and response variables separately, then select a display for the pair. The arrow runs from explanatory type to response type; it does not establish causation.",
  "objectives": [
    "Identify explanatory and response roles separately from data type.",
    "Classify variable pairs as C\u2192C, C\u2192Q, Q\u2192C, or Q\u2192Q.",
    "Choose a two-way table, side-by-side boxplot, or scatterplot for the course-tested combinations.",
    "Explain why a one-variable display does not answer a two-variable relationship question."
  ],
  "teach": [
    {
      "title": "First: role, then type",
      "text": "Identify what may explain or predict the outcome and what outcome is measured. Then classify each variable as categorical (C) or quantitative (Q). The notation C\u2192Q means a categorical explanatory variable and a quantitative response variable. Study design determines whether a causal conclusion is justified."
    },
    {
      "title": "C\u2192C: two-way table",
      "text": "When both variables are categories, a two-way table cross-classifies their counts or percentages. Taking notes (yes/no) and exam outcome (pass/fail) is C\u2192C. A two-way table is a tabular display, although the course groups it with graphical-display choices."
    },
    {
      "title": "C\u2192Q: side-by-side boxplots",
      "text": "Compare the distribution of quantitative outcomes across categorical groups. Enrollment status (full-time/part-time) and test score is C\u2192Q. Each group gets a boxplot on the same quantitative scale, allowing comparison of medians, spread, and unusual values."
    },
    {
      "title": "Q\u2192Q: scatterplot",
      "text": "Each point represents a paired observation of two quantitative variables. Number of tutoring sessions and test score is Q\u2192Q. Both counts and measurements can be quantitative; the values need not be continuous."
    },
    {
      "title": "The fourth role-type combination",
      "text": "Q\u2192C is a quantitative explanatory variable paired with a categorical response, such as study hours predicting pass/fail. It belongs in the classification table. The supplied Lesson 2.3 questions do not give a required display for this combination, so do not force it into a Q\u2192Q scatterplot rule."
    }
  ],
  "anchorChart": {
    "title": "TWO VARIABLES: ROLE \u2192 TYPE \u2192 DISPLAY",
    "rule": "Arrow = explanatory type \u2192 response type; C = category, Q = quantity",
    "columns": [
      [
        "Role-type pair",
        "Display or scope"
      ],
      [
        "C\u2192C",
        "Two-way table: category \u00d7 category"
      ],
      [
        "C\u2192Q",
        "Side-by-side boxplots: quantitative distributions by group"
      ],
      [
        "Q\u2192Q",
        "Scatterplot: paired quantitative values"
      ],
      [
        "Q\u2192C",
        "Valid role-type pair; display not specified in this upload"
      ]
    ],
    "examples": [
      [
        "Notes taken \u2192 pass/fail",
        "C\u2192C"
      ],
      [
        "Handedness \u2192 longevity",
        "C\u2192Q"
      ],
      [
        "Number of beers \u2192 BAC",
        "Q\u2192Q"
      ],
      [
        "Study hours \u2192 pass/fail",
        "Q\u2192C"
      ]
    ]
  },
  "weDo": {
    "prompt": "Compare final-exam scores for students attending an evening class versus a daytime class. Which display fits?",
    "steps": [
      "The explanatory variable is class schedule: evening or daytime.",
      "Schedule is categorical (C).",
      "The response variable is final-exam score, a quantitative measurement (Q).",
      "The pair is C\u2192Q.",
      "Use side-by-side boxplots to compare score distributions on one shared scale."
    ]
  },
  "vocab": [
    [
      "Role-type classification",
      "Classify the explanatory and response variables separately as categorical or quantitative."
    ],
    [
      "Two-way table",
      "A table cross-classifying two categorical variables using counts or percentages."
    ],
    [
      "Side-by-side boxplot",
      "Boxplots on a shared quantitative scale comparing distributions across categorical groups."
    ]
  ],
  "memory": [
    "Identify role before writing the arrow.",
    "Numeric counts are quantitative, even when only whole numbers are possible.",
    "Pass/fail is categorical; a numerical exam score is quantitative.",
    "C\u2192C: two-way table. C\u2192Q: side-by-side boxplots. Q\u2192Q: scatterplot.",
    "Association in a display does not itself prove causation."
  ],
  "provenance": {
    "courseStructure": "User-provided WGU D772 Lesson 2.3 questions 1\u20135, correct-answer feedback, key terms, and Figure 2.19 description. Uploaded 2026-10-04.",
    "courseReference": {
      "source": "WGU Figure 2.19: Role-type Classification Table",
      "note": "Original image was not supplied; Majick anchor chart is a text reconstruction of the role-type relationships."
    },
    "references": [
      {
        "source": "Panopto: Pie Charts and Bar Graphs",
        "url": "https://wgu.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=a0cb4ad2-5874-4c46-bde6-b1bf000f9fc9",
        "note": "Attribution provided in the upload; video was not independently reviewed."
      }
    ]
  },
  "practice": [
    {
      "id": "s2l23-p1",
      "prompt": "A study explores the relationship between number of beers consumed and blood alcohol content (BAC percentage). What is the role-type classification?",
      "options": [
        "C\u2192C",
        "Q\u2192Q",
        "Q\u2192C",
        "C\u2192Q"
      ],
      "answer": 1,
      "rationale": "Beer count and BAC percentage are both quantitative. The explanatory count leads to the quantitative response: Q\u2192Q.",
      "provenance": "Course-provided question and feedback (paraphrased)"
    },
    {
      "id": "s2l23-p2",
      "prompt": "A study asks whether longevity is related to handedness (right-handed or left-handed). What is the role-type classification?",
      "options": [
        "Q\u2192C",
        "Q\u2192Q",
        "C\u2192C",
        "C\u2192Q"
      ],
      "answer": 3,
      "rationale": "Handedness is the categorical explanatory variable. Longevity is the quantitative response, so C\u2192Q.",
      "provenance": "Course-provided question and feedback (paraphrased)"
    },
    {
      "id": "s2l23-p3",
      "prompt": "Which display compares students\u2019 enrollment status (full-time or part-time) with their test scores?",
      "options": [
        "Scatterplot",
        "Dot plot",
        "Side-by-side boxplot",
        "Two-way table"
      ],
      "answer": 2,
      "rationale": "Enrollment status is categorical and test score is quantitative. Side-by-side boxplots compare score distributions across the groups.",
      "provenance": "Course-provided question and feedback (paraphrased)"
    },
    {
      "id": "s2l23-p4",
      "prompt": "Which display shows whether students took notes (yes/no) and their final-exam outcome (pass/fail)?",
      "options": [
        "Scatterplot",
        "Side-by-side boxplot",
        "Histogram",
        "Two-way table"
      ],
      "answer": 3,
      "rationale": "Both variables are categorical, so cross-classify them in a two-way table. Pass/fail is different from a numeric score.",
      "provenance": "Course-provided question and feedback (paraphrased)"
    },
    {
      "id": "s2l23-p5",
      "prompt": "Which display shows the number of tutoring sessions and corresponding test scores?",
      "options": [
        "Two-way table",
        "Side-by-side boxplot",
        "Scatterplot",
        "Histogram"
      ],
      "answer": 2,
      "rationale": "Tutoring-session count and test score are quantitative. Each paired observation becomes one point on a scatterplot.",
      "provenance": "Course-provided question and feedback (paraphrased)"
    },
    {
      "id": "s2l23-p6",
      "prompt": "A researcher uses weekly study hours to predict whether students pass or fail. Which role-type pair fits?",
      "options": [
        "C\u2192Q",
        "Q\u2192C",
        "Q\u2192Q",
        "C\u2192C"
      ],
      "answer": 1,
      "rationale": "Study hours are a quantitative explanatory variable; pass/fail is a categorical response. The pair is Q\u2192C, even though this upload supplies no required display for it.",
      "provenance": "Majick-authored transfer scenario based on uploaded concepts"
    },
    {
      "id": "s2l23-p7",
      "prompt": "Why is a histogram of all test scores insufficient for comparing full-time versus part-time students?",
      "options": [
        "It combines the scores without showing a separate distribution for each enrollment group",
        "A histogram cannot display scores",
        "Enrollment status is continuous",
        "Every two-variable display must be a two-way table"
      ],
      "answer": 0,
      "rationale": "A histogram shows one quantitative distribution. Combining groups loses the group comparison; side-by-side boxplots keep the categorical groups visible.",
      "provenance": "Majick-authored transfer scenario based on uploaded concepts"
    },
    {
      "id": "s2l23-p8",
      "prompt": "Students\u2019 scores are changed from numeric percentages to pass/fail. Enrollment status remains full-time/part-time. How does the display choice change?",
      "options": [
        "Side-by-side boxplots become a two-way table",
        "Two-way table becomes a scatterplot",
        "Scatterplot becomes a histogram",
        "The role-type pair stays C\u2192Q"
      ],
      "answer": 0,
      "rationale": "Turning scores into pass/fail changes the response from quantitative to categorical. C\u2192Q becomes C\u2192C, so use a two-way table.",
      "provenance": "Majick-authored transfer scenario based on uploaded concepts"
    }
  ]
};
D772_SECTION_TWO_CONTENT['d772-s2-l4-3']={
  "visualLabel": "ORIGINAL SCALED BOX PLOTS • SUPPLIED COURSE DATA",
  "sourceLabel": "COURSE-PROVIDED D772 \u2022 SECTION 2 \u2022 LESSON 4.3",
  "overview": "Summarize one quantitative variable with five values, place them on a scaled box plot, and interpret center, spread, and approximate quarters of observations. Reuse the Lesson 4.2 quartile method.",
  "objectives": [
    "Calculate the ordered five-number summary.",
    "Construct and read a scaled box plot.",
    "Read range and IQR from a summary or plot.",
    "Distinguish equal shares of observations from unequal distances on the number line.",
    "Use a sample summary as evidence without claiming it proves a cause or an intervention\u2019s effectiveness."
  ],
  "teach": [
    {
      "title": "Five values in order",
      "text": "Minimum \u2192 Q1 \u2192 median (Q2) \u2192 Q3 \u2192 maximum. The median describes center. The extremes give range; Q1 and Q3 give IQR. Use the median-of-halves method from Lesson 4.2, excluding the overall median when n is odd."
    },
    {
      "title": "Read the box and whiskers",
      "text": "In this lesson\u2019s five-number box plot, the box starts at Q1 and ends at Q3. Its internal line marks the median. Whiskers connect the box to the minimum and maximum. Modified box plots can handle outliers differently; that convention is not used in these examples."
    },
    {
      "title": "Construct with a scaled axis",
      "text": "Draw a number line with equal spacing for equal numerical differences. Mark the five values. Draw the box from Q1 to Q3, the median line at Q2, and whiskers to the observed extremes. A median need not sit at the geometric center of the box."
    },
    {
      "title": "Quarter of observations is not quarter of distance",
      "text": "Consecutive five-number landmarks describe approximately quarters of the ordered observations. A longer segment means values are more spread out; it does not imply more observations there. Tied values and finite samples make exact percentage statements unreliable."
    },
    {
      "title": "Fitness grant: evidence and limits",
      "text": "For the 15 surveyed students, the sorted exercise minutes yield {0,20,40,60,130}. About a quarter are in the lowest segment, 0\u201320 minutes, and the median is 40 minutes. The summary can support a grant proposal about surveyed students\u2019 activity, but does not prove new equipment will increase activity or represent every student."
    },
    {
      "title": "Heights: reading spread from five values",
      "text": "The 40 supplied heights have summary {59,64.5,66,70,77}. Range = 77\u221259 = 18; IQR = 70\u221264.5 = 5.5. The box contains approximately the middle 50%, despite covering much less than half the numerical range."
    },
    {
      "title": "Phone example: trust calculations over conflicting captions",
      "text": "The 25 supplied battery times give {250,325,390,520,730}. Use Q3=520, not 525, and maximum=730, not 750. The axis can extend to 750 without making it the maximum. The median is 390, not the center of the drawn box."
    }
  ],
  "visuals": [
    {
      "title": "Student exercise \u00b7 scaled plot",
      "src": "./assets/boxplot-exercise.svg",
      "alt": "Student exercise: minimum 0, Q1 20, median 40, Q3 60, maximum 130. Original plot from supplied data."
    },
    {
      "title": "Student heights \u00b7 scaled plot",
      "src": "./assets/boxplot-heights.svg",
      "alt": "Student heights: minimum 59, Q1 64.5, median 66, Q3 70, maximum 77. Original plot from supplied data."
    },
    {
      "title": "Smartphone battery life \u00b7 scaled plot",
      "src": "./assets/boxplot-phones.svg",
      "alt": "Smartphone battery life: minimum 250, Q1 325, median 390, Q3 520, maximum 730. Original plot from supplied data."
    }
  ],
  "anchorChart": {
    "title": "FIVE LANDMARKS \u2022 ONE SCALED PLOT",
    "rule": "Min \u2014 Q1 [ median ] Q3 \u2014 Max \u00b7 Box = middle \u224850%",
    "columns": [
      [
        "Part",
        "Meaning"
      ],
      [
        "Left whisker endpoint",
        "Minimum (course convention)"
      ],
      [
        "Left box edge",
        "Q1"
      ],
      [
        "Inside line",
        "Median / Q2"
      ],
      [
        "Right box edge",
        "Q3"
      ],
      [
        "Right whisker endpoint",
        "Maximum (course convention)"
      ],
      [
        "Box width",
        "IQR = Q3 \u2212 Q1"
      ]
    ],
    "examples": [
      [
        "Phones",
        "250 \u00b7 325 \u00b7 390 \u00b7 520 \u00b7 730"
      ],
      [
        "Heights",
        "59 \u00b7 64.5 \u00b7 66 \u00b7 70 \u00b7 77"
      ],
      [
        "Exercise",
        "0 \u00b7 20 \u00b7 40 \u00b7 60 \u00b7 130"
      ]
    ]
  },
  "weDo": {
    "prompt": "Construct the smartphone battery-life box plot from the 25 supplied times.",
    "steps": [
      "Sort: {250,260,280,290,300,320,330,340,350,360,370,380,390,430,440,470,490,520,520,520,530,530,550,550,730}.",
      "The 13th value is the median: 390. Exclude it from both halves.",
      "Lower 12 observations: Q1=(320+330)/2=325. Upper 12: Q3=(520+520)/2=520.",
      "Summary: minimum 250, Q1 325, median 390, Q3 520, maximum 730.",
      "Draw an equally scaled 250\u2013750 axis. Box from 325 to 520, median line at 390, whiskers to 250 and 730.",
      "Range=730\u2212250=480 minutes. IQR=520\u2212325=195 minutes."
    ]
  },
  "vocab": [
    [
      "Five-number summary",
      "Minimum, Q1, median (Q2), Q3, maximum, in that order."
    ],
    [
      "Box plot / box-and-whisker plot",
      "Display of the five-number summary using a scaled axis, quartile box, median line, and whiskers."
    ]
  ],
  "memory": [
    "Longer segment \u2260 more observations.",
    "Box edges are Q1 and Q3; inside line is the median.",
    "Axis endpoint \u2260 data maximum."
  ],
  "provenance": {
    "courseStructure": "User-provided Lesson 4.3 teaching, examples, figure descriptions and four ungraded practice questions, 2026-10-04.",
    "reused": "Quartile convention and range/IQR definitions from Lesson 4.2; center terms from Lesson 4.1.",
    "discrepancies": "Phone captions mention Q3 525 and maximum 750; raw data and explicit calculations give 520 and 730. Figure 4.10 short caption mentions outliers at 2 and 13, but detailed description and keyed dataset give {2,4,6,8,11}. Original diagrams follow verified calculations.",
    "practice": "Source Q1 and Q4 have supplied correct feedback; Q2 and Q3 are unanswered and keys derived from supplied teaching. Remaining questions are Majick-authored transfer checks. No imported mastery or attempts."
  },
  "practice": [
    {
      "id": "s2l43-p1",
      "prompt": "A scaled course box plot has minimum 2, Q1 4, median 6, Q3 8, maximum 11. Which dataset matches?",
      "options": [
        "{3,3,5,5,6,7,8,9,11}",
        "{2,3,5,5,6,7,8,10,11}",
        "{2,3,5,5,6,7,8,8,11}",
        "{2,3,5,5,7,7,8,10,11}"
      ],
      "answer": 2,
      "rationale": "For the matching set, exclude the middle 6: Q1=(3+5)/2=4; Q3=(8+8)/2=8. The extremes are 2 and 11.",
      "provenance": "Supplied WGU correct feedback"
    },
    {
      "id": "s2l43-p2",
      "prompt": "Which part of a box plot identifies the median (Q2)?",
      "options": [
        "The right edge of the box",
        "The farthest point on the left whisker",
        "The left edge of the box",
        "The line inside the box"
      ],
      "answer": 3,
      "rationale": "The internal line represents Q2. Box edges represent Q1 and Q3.",
      "provenance": "Supplied unanswered WGU item; key derived from teaching"
    },
    {
      "id": "s2l43-p3",
      "prompt": "How do you determine IQR from a box plot?",
      "options": [
        "Distance between farthest whisker points",
        "Distance between median and right whisker",
        "Distance between box edges",
        "Distance between left whisker and median"
      ],
      "answer": 2,
      "rationale": "Read Q3 and Q1 on the scale, then subtract. The box spans Q1 to Q3.",
      "provenance": "Supplied unanswered WGU item; key derived from teaching"
    },
    {
      "id": "s2l43-p4",
      "prompt": "Approximately what percent of observations lies between Q1 and Q3?",
      "options": [
        "75%",
        "50%",
        "25%",
        "100%"
      ],
      "answer": 1,
      "rationale": "Q1 and Q3 bound the middle approximately 50%; ties and sample size can affect exact counts.",
      "provenance": "Supplied WGU correct feedback"
    },
    {
      "id": "s2l43-p5",
      "prompt": "A box plot\u2019s upper whisker segment is longer than its lower whisker segment. What does that tell you?",
      "options": [
        "More observations lie in the upper quarter",
        "The upper-quarter values are more spread out",
        "The median must be the mean",
        "The upper quarter contains 50%"
      ],
      "answer": 1,
      "rationale": "Segments represent approximately quarters of observations. Length shows numerical spread, not count.",
      "provenance": "Majick-authored transfer"
    },
    {
      "id": "s2l43-p6",
      "prompt": "For the phone summary {250,325,390,520,730}, what is the IQR?",
      "options": [
        "480 minutes",
        "195 minutes",
        "65 minutes",
        "200 minutes"
      ],
      "answer": 1,
      "rationale": "IQR=520\u2212325=195 minutes. Full range is 480; 525 is an inconsistent pasted caption.",
      "provenance": "Majick-authored transfer"
    },
    {
      "id": "s2l43-p7",
      "prompt": "A phone plot axis ends at 750 but its right whisker ends at 730. What is the maximum?",
      "options": [
        "750",
        "520",
        "730",
        "390"
      ],
      "answer": 2,
      "rationale": "Read the whisker endpoint: 730. The axis extends beyond the greatest observation.",
      "provenance": "Majick-authored transfer"
    },
    {
      "id": "s2l43-p8",
      "prompt": "Does the exercise summary prove purchasing equipment will increase exercise?",
      "options": [
        "Yes, the minimum is zero",
        "Yes, the median is 40",
        "No; it describes surveyed activity, not an equipment experiment",
        "No; summaries cannot provide evidence"
      ],
      "answer": 2,
      "rationale": "It can support a needs argument but does not test whether equipment causes improvement.",
      "provenance": "Majick-authored transfer"
    }
  ]
};
Object.values(D772_SECTION_TWO_CONTENT).forEach(x=>{if(!x.provenance)x.provenance=D772_SECTION_TWO.provenance});

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
  },
  'd772-s2-l1-2':{
    simple:'First find the two variables. Then ask: “Does X help explain, predict, or influence Y?” X is explanatory; Y is response. After that, classify each variable separately: labels/categories = categorical; numerical counts/measurements = quantitative. ROLE and DATA TYPE are two different labels.',
    example:'Does type of breakfast predict the number of minutes a student can sustain attention? Breakfast type is categorical + explanatory. Attention minutes are quantitative + response.',
    quickCheck:{prompt:'A study asks whether school transportation type (bus, walk, car) predicts arrival time in minutes. How is transportation type classified?',choices:['Categorical + explanatory','Quantitative + explanatory','Categorical + response','Quantitative + response'],answer:0,rationale:'Transportation type consists of categories and is the predictor in the research question, so it is categorical + explanatory.'}
  },
  'd772-s2-l4-1':{
    simple:'Center is three different questions. Mean asks for the fair-share total: add every observation and divide by how many observations there are. Median asks for the middle after sorting. Mode asks what occurs most often. Keep the procedure separate from the answer value.',
    example:'For {2,2,5,7,9}, mean = 25/5 = 5, median = 5, and mode = 2. The same data can have three different center values because each measure answers a different question.',
    quickCheck:{prompt:'For {1,3,3,4,9}, which statement is correct?',choices:['Mean=4, median=3, mode=3','Mean=3, median=4, mode=9','Mean=5, median=3, no mode','Mean=4, median=4, mode=3'],answer:0,rationale:'The total is 20 across five observations, so mean=4. The sorted middle value is 3, and 3 occurs most often.'},
    repairs:[
      {ids:['s2l41-p1','s2l41-course-p1','s2l41-course-p4'],variants:[
        {simple:'Your last miss points to the mean calculation. Count observations, not distinct values. Repeated values still occupy separate spots in the data set and each one contributes to the total and to n.',example:'For {2,2,2,8}, the sum is 14 and n=4, so the mean is 3.5. Dividing by the two distinct values would be the wrong denominator.',cue:'MEAN = total of every observation ÷ number of observations.',check:{prompt:'What is the mean of {4,4,7,9}?',choices:['6','6.5','7','24'],answer:0,rationale:'The total is 24 and there are four observations, so 24/4=6.'}},
        {simple:'Try a balance idea: imagine redistributing the total equally across every data point. The mean is the equal share. That is why duplicate observations must stay in the count.',example:'For {1,1,6,8}, the total 16 shared equally across four observations gives a mean of 4.',cue:'Do not compress duplicates before averaging.',check:{prompt:'The values {5,5,5,9,11} total 35. What is the mean?',choices:['5','7','8.75','35'],answer:1,rationale:'There are five observations, so 35/5=7.'}}
      ]},
      {ids:['s2l41-p2','s2l41-p3','s2l41-p5','s2l41-course-p2','s2l41-course-p5'],variants:[
        {simple:'Your last miss is about median position versus median value. First sort. Then locate the middle position. Finally read the value there—or average the two middle values for even n. A position number is not automatically the median.',example:'With six sorted values {1,4,6,10,11,20}, the middle positions are 3 and 4, but the median is (6+10)/2=8.',cue:'SORT → LOCATE → READ/AVERAGE VALUES.',check:{prompt:'For sorted {2,5,8,12,13,20}, what is the median?',choices:['8','10','12','3.5'],answer:1,rationale:'Average the 3rd and 4th values: (8+12)/2=10.'}},
        {simple:'Think of the median as a data value sitting at the center of an ordered line. The formula tells you where to look; it does not replace the value you find there.',example:'For 9 observations, (9+1)/2=5 tells you to read the 5th ordered observation. If that value is 42, the median is 42—not 5.',cue:'Position tells WHERE. Median tells WHAT VALUE.',check:{prompt:'A sorted set has 7 observations and its 4th value is 18. What is the median?',choices:['4','7','18','21'],answer:2,rationale:'For seven observations, the 4th value is the middle observation, so the median is 18.'}}
      ]},
      {ids:['s2l41-p4','s2l41-p7','s2l41-course-p3','s2l41-course-p6'],variants:[
        {simple:'Your last miss is about mode. Count frequencies and identify the greatest frequency. Every value tied at that highest frequency is a mode. A value that merely repeats is not automatically a mode.',example:'In {2,2,3,3,4,4,4}, only 4 is the mode because frequency 3 is higher than frequency 2.',cue:'MODE = highest frequency, including ties for highest.',check:{prompt:'What are the modes of {1,1,2,3,3,4}?',choices:['1 only','3 only','1 and 3','No mode'],answer:2,rationale:'1 and 3 each occur twice, tying for the greatest frequency.'}},
        {simple:'For categorical data, mode is often the only measure of center that makes sense. You can count which label appears most; you cannot meaningfully average arbitrary labels.',example:'If shirt colors are blue, blue, green, red, blue, the mode is blue. A mean or numerical median is not meaningful for the color names.',cue:'Categories can have a mode without having a numerical mean.',check:{prompt:'Survey choices are tea, coffee, tea, water, tea. Which measure identifies the most common choice?',choices:['Mean','Median','Mode','Range'],answer:2,rationale:'Mode identifies the most frequent category: tea.'}}
      ]}
    ]
  },
  'd772-s2-l4-2':{
    simple:'Spread tells how far values are separated. For this course, sort first, find Q2, split the data, and for odd n remove only the one overall median observation from both halves. Then Q1 and Q3 are the half-medians. Range uses max−min; IQR uses Q3−Q1.',
    example:'For {1,3,5,7,9,11,13}, Q2=7. Exclude that one 7. Lower {1,3,5} gives Q1=3; upper {9,11,13} gives Q3=11. IQR=8 and range=12.',
    quickCheck:{prompt:'Using the course convention, what is Q1 for {2,4,6,8,10,12,14}?',choices:['4','5','6','8'],answer:0,rationale:'Q2=8 is excluded. The lower half is {2,4,6}, whose median is 4.'},
    repairs:[
      {ids:['s2l42-p1','s2l42-p6','s2l42-course-airline-1','s2l42-course-airline-2','s2l42-course-airline-3'],variants:[
        {simple:'Your last miss points to the split step. With odd n, remove the single middle observation after sorting, then build the lower and upper halves. Do not remove every value equal to the median.',example:'For {1,2,4,4,4,7,9}, the middle observation is the fourth 4. Remove that one position only; the other 4s remain where they belong.',cue:'Odd n: exclude ONE middle observation, not every matching value.',check:{prompt:'For {2,4,4,4,8,10,12}, what is the lower half after finding the median?',choices:['{2,4,4}','{2,4}','{2,4,4,4}','{4,8,10}'],answer:0,rationale:'The fourth observation is the overall median and is excluded; the first three observations form the lower half.'}},
        {simple:'Quartiles are found from positions in the ordered list, so duplicate values still count as separate observations. Keep the full sorted list intact until you remove only the one overall median position when n is odd.',example:'In the airline-fee list, several $100 values remain in both halves even though Q2 is $100. The median is one observation position, not a command to delete all $100s.',cue:'Preserve duplicates; split by position.',check:{prompt:'Why do repeated $100 values remain in the halves when the median is $100?',choices:['Because only the single middle observation is excluded','Because duplicates do not count','Because Q2 must be removed twice','Because quartiles ignore order'],answer:0,rationale:'The course method excludes the one overall median observation, not every observation with the same value.'}}
      ]},
      {ids:['s2l42-p2','s2l42-p4','s2l42-p5','s2l42-course-airline-4'],variants:[
        {simple:'Your last miss is about IQR. The IQR is a distance on the number line: Q3−Q1. It describes the numerical width containing the middle roughly 50% of observations.',example:'If Q1=12 and Q3=20, IQR=8 units. It does not mean there are eight observations and it is not half of the full range.',cue:'IQR = RIGHT BOX EDGE − LEFT BOX EDGE.',check:{prompt:'If Q1=18 and Q3=31, what is the IQR?',choices:['13','49','24.5','31'],answer:0,rationale:'IQR=31−18=13.'}},
        {simple:'Picture the box in a box plot. Its left edge is Q1 and right edge is Q3. The width of that box—measured in the variable’s units—is the IQR.',example:'A box from 75 dollars to 125 dollars has IQR 50 dollars, even if the entire data range is larger.',cue:'The box width is the middle-50% span.',check:{prompt:'A box plot has Q1=40 and Q3=70. Which statement is correct?',choices:['IQR=30','Range=30','There are exactly 30 observations','Median=30'],answer:0,rationale:'The box spans 70−40=30 units, so IQR=30.'}}
      ]},
      {ids:['s2l42-p3','s2l42-course-airline-5'],variants:[
        {simple:'Your last miss is about range. Range measures only the full endpoint span: maximum minus minimum. Do not report either endpoint itself.',example:'If ages run from 14 to 52, the range is 38 years.',cue:'RANGE = MAX − MIN.',check:{prompt:'Values run from 60 to 150. What is the range?',choices:['90','150','60','210'],answer:0,rationale:'150−60=90.'}},
        {simple:'Use range when the question asks for the total numerical spread from the smallest observed value to the largest observed value.',example:'A temperature data set from 48°F to 83°F has a range of 35°F.',cue:'Endpoints are inputs; their difference is the range.',check:{prompt:'The minimum is 7 and maximum is 19. What is the range?',choices:['12','26','19','7'],answer:0,rationale:'19−7=12.'}}
      ]}
    ]
  },
  'd772-s2-l4-3':{
    simple:'A box plot is the five-number summary placed on a scale: minimum, Q1, median, Q3, maximum. The box runs from Q1 to Q3, the line inside is the median, and these course examples use whiskers at the observed minimum and maximum.',
    example:'For {10,20,30,40,50,60,70}, the five-number summary is 10,20,40,60,70. The box goes 20→60, the median line is at 40, and whiskers reach 10 and 70.',
    quickCheck:{prompt:'A box plot has Q1=25, median=40, Q3=55. Which distance is the IQR?',choices:['15','30','40','55'],answer:1,rationale:'IQR is the distance from Q1 to Q3: 55−25=30.'},
    repairs:[
      {ids:['s2l43-p1'],variants:[
        {simple:'Your last miss is about matching a data set to a five-number summary. Sort the candidate data, find the median, then apply the course median-of-halves rule for Q1 and Q3. Check the endpoints last.',example:'For {1,2,4,4,5,8,9}, summary = 1,2,4,8,9: median 4; lower-half median 2; upper-half median 8.',cue:'Verify Q2, then Q1/Q3, then min/max.',check:{prompt:'Using the course rule, what is the five-number summary of {1,2,3,4,5,6,7}?',choices:['1,2,4,6,7','1,3,4,5,7','1,2.5,4,5.5,7','1,2,3,6,7'],answer:0,rationale:'Median=4; lower {1,2,3} gives Q1=2; upper {5,6,7} gives Q3=6.'}},
        {simple:'Treat the five numbers as five checkpoints rather than judging a box plot by appearance. A candidate must satisfy all five checkpoints on the same scale.',example:'If a plot claims min=2 and max=11, any dataset beginning above 2 or ending below 11 can be rejected immediately before checking quartiles.',cue:'Five checkpoints beat visual guessing.',check:{prompt:'A claimed summary is {2,4,6,8,11}. Which fact must be true?',choices:['The median is 6','The mean is 6','There are exactly 9 observations','No value repeats'],answer:0,rationale:'The third number in the five-number summary is the median (Q2).'}}
      ]},
      {ids:['s2l43-p2','s2l43-p3','s2l43-p6','s2l43-p7'],variants:[
        {simple:'Your last miss is about reading the parts of the plot. Box edges are Q1 and Q3. The line inside the box is the median. Under this course convention, whisker endpoints are the observed minimum and maximum.',example:'If the axis continues to 100 but the right whisker stops at 92, the maximum is 92. The axis is only a ruler; it can extend beyond the data.',cue:'Read the MARK, not the edge of the ruler.',check:{prompt:'A box plot axis ends at 80, but the right whisker ends at 74. What is the maximum?',choices:['80','74','Q3','Cannot tell'],answer:1,rationale:'The observed maximum is at the whisker endpoint: 74.'}},
        {simple:'Use the geometry as labels: left box wall = Q1, inside line = median, right box wall = Q3. The distance between the two box walls is the IQR.',example:'If the box edges sit at 30 and 65, IQR=35 no matter where the median line falls inside that box.',cue:'BOX = Q1 to Q3; INNER LINE = Q2.',check:{prompt:'Which two marks determine IQR directly from a box plot?',choices:['Two whisker endpoints','Q1 and Q3 box edges','Minimum and median','Median and maximum'],answer:1,rationale:'IQR=Q3−Q1, so use the two box edges.'}}
      ]},
      {ids:['s2l43-p4','s2l43-p5'],variants:[
        {simple:'Your last miss is about what segment length means. Quartile sections contain roughly equal portions of the observations, but their numerical widths can differ. A longer segment means those values are more spread out, not that it contains more observations.',example:'Two quartile segments may each contain about 25% of the data while one spans 5 points and the other spans 30 points.',cue:'COUNT is roughly equal by quartile; LENGTH shows spread.',check:{prompt:'Two adjacent quartile segments contain roughly the same share of observations, but one is much longer. What differs?',choices:['Numerical spread','Number of quartiles','Sample size must double','The longer segment contains 50%'],answer:0,rationale:'Longer length shows a wider numerical span for that quarter, not more observations.'}},
        {simple:'Do not read a box plot like a bar chart. The length of a box or whisker segment is measured in data units. It is not a visual count of people or observations.',example:'A long 60→130 whisker can still represent about one quarter of the ordered observations, just spread across 70 units.',cue:'Box-plot length = distance in values.',check:{prompt:'A very short Q1→median segment most directly means what?',choices:['That quarter is tightly clustered in value','Few observations are in that quarter','The median is wrong','The mean equals Q1'],answer:0,rationale:'A short segment means the values in that quartile occupy a small numerical interval.'}}
      ]},
      {ids:['s2l43-p8'],variants:[
        {simple:'Your last miss is about evidence, not plotting. A box plot describes a distribution. It does not by itself show that an intervention caused the distribution to change.',example:'A school can use a low exercise-time summary to describe need, but it would need an appropriate study comparing outcomes to test whether new equipment causes improvement.',cue:'DESCRIPTION ≠ CAUSATION.',check:{prompt:'A box plot shows low baseline reading minutes. What can it establish by itself?',choices:['The distribution of observed reading minutes','That a new program will increase reading','That low minutes cause low grades','That every student is below average'],answer:0,rationale:'The plot summarizes observed values; it does not test a causal intervention.'}},
        {simple:'Separate “what the data look like” from “why they look that way.” Five-number summaries answer the first question only.',example:'A salary box plot can show center and spread, but it cannot prove which policy caused those salaries.',cue:'Plots summarize outcomes; study design supports causal claims.',check:{prompt:'What extra ingredient is needed before claiming an intervention caused improvement?',choices:['A larger axis','An appropriate causal study design','A centered median line','Equal whisker lengths'],answer:1,rationale:'Causal claims require evidence from an appropriate study design, not just a descriptive plot.'}}
      ]}
    ]
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
  const lesson=raw.match(/\bLesson\s+(\d+(?:\.\d+)?)\s*[:\-–]?\s*([^\n]{0,90})/i);
  return {
    sectionNumber:section?Number(section[1]):null,
    sectionTitle:section?.[2]?.trim()||'',
    lessonNumber:lesson?Number(lesson[1]):null,
    lessonTitle:lesson?.[2]?.trim()||''
  };
}
function escRx(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
const D772_SECTION_THREE={
  "id": "d772-s3",
  "title": "Section 3: Applying Principles of Probability",
  "provenance": {
    "courseStructure": "User-provided full D772 course outline verified 2026-10-12; existing lesson IDs and learner mastery preserved.",
    "teaching": "User-provided Lesson 4.2 practice, video transcript, Lesson 4 and Section 3 summaries; other lesson explanations remain supplemental.",
    "corroboration": [
      {
        "source": "OpenStax Introductory Statistics 2e",
        "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"
      },
      {
        "source": "OpenStax Introductory Statistics 2e",
        "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"
      },
      {
        "source": "OpenStax Introductory Statistics 2e",
        "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"
      },
      {
        "source": "OpenStax Introductory Statistics 2e",
        "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"
      }
    ]
  },
  "lessons": [
    {
      "id": "d772-s3-l1",
      "number": 1,
      "title": "Theoretical and Empirical Probability",
      "short": "Theoretical and Empirical Probability",
      "outlineOnly": false,
      "keywords": [
        "theoretical and empirical probability"
      ],
      "goal": "Theoretical and Empirical Probability.",
      "visual": [
        "Identify the event",
        "Read conditions",
        "Choose a justified rule",
        "Calculate",
        "Interpret"
      ],
      "thinking": [],
      "traps": [
        "Do not confuse disjoint events with independent events.",
        "Read whether a question asks for payout or net value."
      ],
      "sublessons": [
        {
          "id": "d772-s3-l1-1",
          "number": 1.1,
          "title": "Terminology and Notation",
          "short": "Terminology and Notation",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "terminology and notation"
          ],
          "goal": "Read probability notation.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l1-2",
          "number": 1.2,
          "title": "Theoretical (Classical) Probability",
          "short": "Theoretical (Classical) Probability",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "theoretical (classical) probability"
          ],
          "goal": "Use equally likely outcomes.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l1-3",
          "number": 1.3,
          "title": "Empirical (Experimental) Probability and the Law of Large Numbers",
          "short": "Empirical (Experimental) Probability and the Law of Large Numbers",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "empirical (experimental) probability and the law of large numbers"
          ],
          "goal": "Estimate from observations.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l1-summary",
          "number": null,
          "title": "Lesson 1: Summary",
          "short": "Lesson 1: Summary",
          "parentLessonId": "d772-s3-l1",
          "unitType": "summary",
          "outlineOnly": false,
          "keywords": [
            "lesson 1: summary"
          ],
          "goal": "Lesson 1: Summary: Theoretical and Empirical Probability",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l1-quiz",
          "number": null,
          "title": "Lesson 1: Quiz",
          "short": "Lesson 1: Quiz",
          "parentLessonId": "d772-s3-l1",
          "unitType": "quiz",
          "outlineOnly": false,
          "keywords": [
            "lesson 1: quiz"
          ],
          "goal": "Lesson 1: Quiz: Theoretical and Empirical Probability",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        }
      ]
    },
    {
      "id": "d772-s3-l2",
      "number": 2,
      "title": "Independent, Dependent, and Disjoint Events",
      "short": "Independent, Dependent, and Disjoint Events",
      "outlineOnly": false,
      "keywords": [
        "independent, dependent, and disjoint events"
      ],
      "goal": "Independent, Dependent, and Disjoint Events.",
      "visual": [
        "Identify the event",
        "Read conditions",
        "Choose a justified rule",
        "Calculate",
        "Interpret"
      ],
      "thinking": [],
      "traps": [
        "Do not confuse disjoint events with independent events.",
        "Read whether a question asks for payout or net value."
      ],
      "sublessons": [
        {
          "id": "d772-s3-l2-1",
          "number": 2.1,
          "title": "Independent and Dependent Events",
          "short": "Independent and Dependent Events",
          "parentLessonId": "d772-s3-l2",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "independent and dependent events"
          ],
          "goal": "Separate independent from dependent.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l2-2",
          "number": 2.2,
          "title": "Disjoint Events (Mutually Exclusive)",
          "short": "Disjoint Events (Mutually Exclusive)",
          "parentLessonId": "d772-s3-l2",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "disjoint events (mutually exclusive)"
          ],
          "goal": "Disjoint does not mean independent.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l2-summary",
          "number": null,
          "title": "Lesson 2: Summary",
          "short": "Lesson 2: Summary",
          "parentLessonId": "d772-s3-l2",
          "unitType": "summary",
          "outlineOnly": false,
          "keywords": [
            "lesson 2: summary"
          ],
          "goal": "Lesson 2: Summary: Independent, Dependent, and Disjoint Events",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l2-quiz",
          "number": null,
          "title": "Lesson 2: Quiz",
          "short": "Lesson 2: Quiz",
          "parentLessonId": "d772-s3-l2",
          "unitType": "quiz",
          "outlineOnly": false,
          "keywords": [
            "lesson 2: quiz"
          ],
          "goal": "Lesson 2: Quiz: Independent, Dependent, and Disjoint Events",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        }
      ]
    },
    {
      "id": "d772-s3-l3",
      "number": 3,
      "title": "Unions, Intersections, and Complements",
      "short": "Unions, Intersections, and Complements",
      "outlineOnly": false,
      "keywords": [
        "unions, intersections, and complements"
      ],
      "goal": "Unions, Intersections, and Complements.",
      "visual": [
        "Identify the event",
        "Read conditions",
        "Choose a justified rule",
        "Calculate",
        "Interpret"
      ],
      "thinking": [],
      "traps": [
        "Do not confuse disjoint events with independent events.",
        "Read whether a question asks for payout or net value."
      ],
      "sublessons": [
        {
          "id": "d772-s3-l3-1",
          "number": 3.1,
          "title": "Venn Diagrams",
          "short": "Venn Diagrams",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "venn diagrams"
          ],
          "goal": "Read all four Venn regions.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l3-2",
          "number": 3.2,
          "title": "Unions",
          "short": "Unions",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "unions"
          ],
          "goal": "OR is the inclusive union.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l3-3",
          "number": 3.3,
          "title": "Intersections",
          "short": "Intersections",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "intersections"
          ],
          "goal": "AND is the intersection.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l3-4",
          "number": 3.4,
          "title": "Complements",
          "short": "Complements",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "complements"
          ],
          "goal": "NOT is the complement.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l3-summary",
          "number": null,
          "title": "Lesson 3: Summary",
          "short": "Lesson 3: Summary",
          "parentLessonId": "d772-s3-l3",
          "unitType": "summary",
          "outlineOnly": false,
          "keywords": [
            "lesson 3: summary"
          ],
          "goal": "Lesson 3: Summary: Unions, Intersections, and Complements",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        },
        {
          "id": "d772-s3-l3-quiz",
          "number": null,
          "title": "Lesson 3: Quiz",
          "short": "Lesson 3: Quiz",
          "parentLessonId": "d772-s3-l3",
          "unitType": "quiz",
          "outlineOnly": false,
          "keywords": [
            "lesson 3: quiz"
          ],
          "goal": "Lesson 3: Quiz: Unions, Intersections, and Complements",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ]
        }
      ]
    },
    {
      "id": "d772-s3-l4",
      "number": 4,
      "title": "Expected Value",
      "short": "Expected Value",
      "outlineOnly": false,
      "keywords": [
        "expected value"
      ],
      "goal": "Expected Value.",
      "visual": [
        "Identify the event",
        "Read conditions",
        "Choose a justified rule",
        "Calculate",
        "Interpret"
      ],
      "thinking": [],
      "traps": [
        "Do not confuse disjoint events with independent events.",
        "Read whether a question asks for payout or net value."
      ],
      "sublessons": [
        {
          "id": "d772-s3-l4-1",
          "number": 4.1,
          "title": "Calculating Expected Value",
          "short": "Calculating Expected Value",
          "parentLessonId": "d772-s3-l4",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "calculating expected value"
          ],
          "goal": "Calculate a probability-weighted mean.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ],
          "sourceUrl": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@9395188784a64ab6ba54e54c82346db8"
        },
        {
          "id": "d772-s3-l4-2",
          "number": 4.2,
          "title": "Applications of Expected Value",
          "short": "Applications of Expected Value",
          "parentLessonId": "d772-s3-l4",
          "unitType": "lesson",
          "outlineOnly": false,
          "keywords": [
            "applications of expected value"
          ],
          "goal": "Interpret long-run value and risk.",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ],
          "sourceUrl": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@f3a635cdeda84c40ab910112078f3326"
        },
        {
          "id": "d772-s3-l4-summary",
          "number": null,
          "title": "Lesson 4: Summary",
          "short": "Lesson 4: Summary",
          "parentLessonId": "d772-s3-l4",
          "unitType": "summary",
          "outlineOnly": false,
          "keywords": [
            "lesson 4: summary"
          ],
          "goal": "Lesson 4: Summary: Expected Value",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ],
          "sourceUrl": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@6bfe6ccb9f96416ab0fa3103b258531d"
        },
        {
          "id": "d772-s3-l4-quiz",
          "number": null,
          "title": "Lesson 4: Quiz",
          "short": "Lesson 4: Quiz",
          "parentLessonId": "d772-s3-l4",
          "unitType": "quiz",
          "outlineOnly": false,
          "keywords": [
            "lesson 4: quiz"
          ],
          "goal": "Lesson 4: Quiz: Expected Value",
          "visual": [
            "Identify the event",
            "Read conditions",
            "Choose a justified rule",
            "Calculate",
            "Interpret"
          ],
          "thinking": [],
          "traps": [
            "Do not confuse disjoint events with independent events.",
            "Read whether a question asks for payout or net value."
          ],
          "sourceUrl": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@618232d4f0494e909e6f4bbd804e4df5"
        }
      ],
      "sourceUrl": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@236466364f844030b1dd347a7bffa37b"
    },
    {
      "id": "d772-s3-review",
      "number": null,
      "title": "Section 3: Summary and Test",
      "short": "Section 3 Review",
      "review": true,
      "outlineOnly": false,
      "keywords": [
        "section 3: summary and test"
      ],
      "goal": "Combine probability types, event relationships, set operations, and expected value.",
      "visual": [
        "Identify the event",
        "Read conditions",
        "Choose a justified rule",
        "Calculate",
        "Interpret"
      ],
      "thinking": [],
      "traps": [
        "Do not confuse disjoint events with independent events.",
        "Read whether a question asks for payout or net value."
      ]
    }
  ]
};
const D772_SECTION_THREE_CONTENT={"d772-s3-l1-1": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Read probability notation.", "objectives": ["Read probability notation", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Read probability notation", "text": "An outcome is one result. The sample space S lists all possible results; an event A is a set of results. P(A) is between 0 and 1. A probability of 0.25 means 25%, not 25 successes guaranteed in every 100 trials."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Read probability notation", "rule": "An outcome is one result.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "For one fair die, S={1,2,3,4,5,6}. Event A={2,4,6} means an even result.", "steps": ["List all six outcomes.", "Identify the three outcomes in A.", "Write P(A)=3/6=0.5."]}, "practice": [{"id": "d772-s3-l1-1-practice-1", "prompt": "What is the sample space for one toss of a coin?", "options": ["{heads, tails}", "{heads}", "0.5", "The number of tosses"], "answer": 0, "rationale": "The sample space includes every possible outcome.", "learningPathLessonId": "d772-s3-l1-1", "topicId": "d772-s3-l1-1"}, {"id": "d772-s3-l1-1-practice-2", "prompt": "A probability is 0.35. What percentage is equivalent?", "options": ["3.5%", "35%", "350%", "0.35%"], "answer": 1, "rationale": "Multiply a probability by 100 to express it as a percentage.", "learningPathLessonId": "d772-s3-l1-1", "topicId": "d772-s3-l1-1"}, {"id": "d772-s3-l1-1-practice-3", "prompt": "Which value cannot be a probability?", "options": ["0", "0.45", "1", "1.2"], "answer": 3, "rationale": "Probabilities cannot exceed 1 or fall below 0.", "learningPathLessonId": "d772-s3-l1-1", "topicId": "d772-s3-l1-1"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Outcome", "One result of a chance process."], ["Sample space", "The set of all possible outcomes."], ["Event", "A set of outcomes from the sample space."], ["Probability", "A measure of likelihood from 0 to 1."]]}, "d772-s3-l1-2": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Use equally likely outcomes.", "objectives": ["Use equally likely outcomes", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Use equally likely outcomes", "text": "For equally likely outcomes, P(A)=favorable outcomes / total outcomes. Count the same kind of outcome in numerator and denominator. This counting rule needs equally likely outcomes; a biased spinner needs its actual sector probabilities."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Use equally likely outcomes", "rule": "For equally likely outcomes, P(A)=favorable outcomes / total outcomes.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "A fair eight-sector spinner has three red sectors.", "steps": ["Eight sectors are equally likely.", "Three satisfy red.", "P(red)=3/8=0.375=37.5%."]}, "practice": [{"id": "d772-s3-l1-2-practice-1", "prompt": "A fair die is rolled once. What is P(result greater than 4)?", "options": ["1/6", "1/3", "1/2", "2/3"], "answer": 1, "rationale": "The favorable outcomes are 5 and 6: 2/6=1/3.", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2"}, {"id": "d772-s3-l1-2-practice-2", "prompt": "A bag has 4 red and 6 green tokens. One token is selected uniformly. What is P(red)?", "options": ["4/6", "6/10", "4/10", "1/4"], "answer": 2, "rationale": "The total is 10, so 4 favorable tokens give 4/10.", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2"}, {"id": "d772-s3-l1-2-practice-3", "prompt": "When does favorable outcomes divided by total outcomes apply directly?", "options": ["Whenever two outcomes are named", "When outcomes are equally likely", "Only after 100 trials", "Only for independent events"], "answer": 1, "rationale": "Counting outcomes directly assumes equal probabilities.", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Theoretical probability", "A probability calculated from an assumed model rather than observed counts."], ["Equally likely", "Outcomes having the same probability."]]}, "d772-s3-l1-3": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Estimate from observations.", "objectives": ["Estimate from observations", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Estimate from observations", "text": "Empirical probability is observed successes / trials. With many independent repetitions under the same conditions, relative frequency tends toward the underlying probability. More trials do not force an exact match or make a losing streak require a win next."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Estimate from observations", "rule": "Empirical probability is observed successes / trials.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "A machine produces 14 defective parts among 200 inspected parts.", "steps": ["Count 14 observed defects.", "Use all 200 inspections as the denominator.", "Estimated P(defect)=14/200=0.07."]}, "practice": [{"id": "d772-s3-l1-3-practice-1", "prompt": "A player succeeds in 18 of 60 attempts. What is the empirical probability of success?", "options": ["0.18", "0.30", "0.60", "3.33"], "answer": 1, "rationale": "18/60=0.30.", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3"}, {"id": "d772-s3-l1-3-practice-2", "prompt": "A fair coin has just landed tails five times. What is P(heads on the next independent toss)?", "options": ["1/6", "0", "1", "1/2"], "answer": 3, "rationale": "Earlier independent tosses do not change the next probability.", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3"}, {"id": "d772-s3-l1-3-practice-3", "prompt": "What does the law of large numbers suggest?", "options": ["Each short run must balance exactly", "Relative frequency tends toward the underlying probability as trials accumulate", "The next result corrects the last result", "A large number of trials makes events independent"], "answer": 1, "rationale": "It concerns long-run proportions, not compensation on the next trial.", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Empirical probability", "Observed event occurrences divided by the number of trials."], ["Law of large numbers", "Under suitable repeated-trial conditions, observed proportions tend toward the underlying probability."]]}, "d772-s3-l2-1": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Separate independent from dependent.", "objectives": ["Separate independent from dependent", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Separate independent from dependent", "text": "Independent events do not change each other\u2019s probability: P(B|A)=P(B). For independent events, P(A and B)=P(A)P(B). Drawing without replacement usually changes the next draw\u2019s probability because the bag\u2019s contents change."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Separate independent from dependent", "rule": "Independent events do not change each other\u2019s probability: P(B|A)=P(B).", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "A bag has 3 red and 2 blue tokens. Draw two without replacement.", "steps": ["P(first red)=3/5.", "After red is removed, 2 red remain among 4 tokens.", "P(two red)=(3/5)(2/4)=3/10."]}, "practice": [{"id": "d772-s3-l2-1-practice-1", "prompt": "Two fair dice are rolled independently. What is P(two sixes)?", "options": ["1/6", "1/12", "1/36", "1/3"], "answer": 2, "rationale": "Multiply 1/6 by 1/6.", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1"}, {"id": "d772-s3-l2-1-practice-2", "prompt": "A bag has 3 red and 2 blue tokens. After a red token is removed, what is P(red on the next draw)?", "options": ["3/5", "2/4", "2/5", "3/4"], "answer": 1, "rationale": "There are now 2 red tokens among 4 total tokens.", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1"}, {"id": "d772-s3-l2-1-practice-3", "prompt": "Which statement defines independence?", "options": ["The events cannot occur together", "Knowing one event occurred does not change the probability of the other", "The probabilities must be equal", "Both events must be rare"], "answer": 1, "rationale": "Independence is about unchanged conditional probability.", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Independent events", "Events for which learning that one occurred does not change the probability of the other."], ["Dependent events", "Events whose probabilities change when another event is known to occur."], ["Conditional probability", "The probability of an event within the group specified by a condition."]]}, "d772-s3-l2-2": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Disjoint does not mean independent.", "objectives": ["Disjoint does not mean independent", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Disjoint does not mean independent", "text": "Disjoint, or mutually exclusive, events cannot occur together: P(A and B)=0. If both have positive probability, they are not independent: learning that one occurred rules out the other."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Disjoint does not mean independent", "rule": "Disjoint, or mutually exclusive, events cannot occur together: P(A and B)=0.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "For one die roll, A={1,3,5} and B={2,4,6}.", "steps": ["No outcome is in both sets.", "P(A and B)=0.", "If A happened, B is impossible on that roll."]}, "practice": [{"id": "d772-s3-l2-2-practice-1", "prompt": "On one die roll, are getting a 1 and getting a 6 disjoint?", "options": ["Yes, one roll cannot have both results", "No, both are possible in the sample space", "Only if the die is biased", "Only across two rolls"], "answer": 0, "rationale": "A single outcome cannot simultaneously be 1 and 6.", "learningPathLessonId": "d772-s3-l2-2", "topicId": "d772-s3-l2-2"}, {"id": "d772-s3-l2-2-practice-2", "prompt": "Two disjoint events each have positive probability. Are they independent?", "options": ["Always", "Yes if their probabilities are equal", "No", "Only when their sum is 1"], "answer": 2, "rationale": "Occurrence of one changes the probability of the other to zero.", "learningPathLessonId": "d772-s3-l2-2", "topicId": "d772-s3-l2-2"}, {"id": "d772-s3-l2-2-practice-3", "prompt": "A and B are disjoint with P(A)=0.2 and P(B)=0.3. What is P(A and B)?", "options": ["0.06", "0.5", "0.1", "0"], "answer": 3, "rationale": "Disjoint events have no overlap.", "learningPathLessonId": "d772-s3-l2-2", "topicId": "d772-s3-l2-2"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Disjoint events", "Events that cannot happen together; also called mutually exclusive."]]}, "d772-s3-l3-1": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Read all four Venn regions.", "objectives": ["Read all four Venn regions", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Read all four Venn regions", "text": "A Venn diagram separates A only, both, B only, and neither. The rectangle represents the full sample space. Include the overlap when counting all of A or all of B; count it once for the union."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Read all four Venn regions", "rule": "A Venn diagram separates A only, both, B only, and neither.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "Among 40 students, 18 take math, 12 take science, and 5 take both.", "steps": ["Math only=18\u22125=13. Science only=12\u22125=7.", "Either subject=13+5+7=25.", "Neither=40\u221225=15."]}, "practice": [{"id": "d772-s3-l3-1-practice-1", "prompt": "18 students take math and 5 of them also take science. How many take math only?", "options": ["23", "18", "13", "5"], "answer": 2, "rationale": "Remove the overlap: 18\u22125=13.", "learningPathLessonId": "d772-s3-l3-1", "topicId": "d772-s3-l3-1"}, {"id": "d772-s3-l3-1-practice-2", "prompt": "A Venn diagram has A-only=9, both=4, B-only=7, neither=10. How many are in A?", "options": ["9", "13", "20", "30"], "answer": 1, "rationale": "All of A includes A-only and the overlap: 9+4=13.", "learningPathLessonId": "d772-s3-l3-1", "topicId": "d772-s3-l3-1"}, {"id": "d772-s3-l3-1-practice-3", "prompt": "In that same diagram, how many are outside both circles?", "options": ["10", "20", "4", "7"], "answer": 0, "rationale": "Neither is the region outside both circles.", "learningPathLessonId": "d772-s3-l3-1", "topicId": "d772-s3-l3-1"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "visuals": [{"src": "lesson-visuals/probability-venn.svg", "title": "40 students: 13 math only, 5 both, 7 science only, 15 neither", "alt": "Two overlapping circles inside a rectangle: math only 13, both 5, science only 7, neither 15. Total 40."}], "visualLabel": "ILLUSTRATIVE VENN DIAGRAM \u2022 ORIGINAL PRACTICE DATA", "vocab": [["Venn diagram", "A diagram showing event membership and overlap within a sample space."]]}, "d772-s3-l3-2": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "OR is the inclusive union.", "objectives": ["OR is the inclusive union", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "OR is the inclusive union", "text": "A union B, written A \u222a B, includes A, B, or both. P(A or B)=P(A)+P(B)\u2212P(A and B). Subtract the overlap once because adding both probabilities counts it twice."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "OR is the inclusive union", "rule": "A union B, written A \u222a B, includes A, B, or both.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "P(A)=0.45, P(B)=0.30, and P(both)=0.10.", "steps": ["Add 0.45+0.30=0.75.", "Subtract the repeated overlap 0.10.", "P(A or B)=0.65."]}, "practice": [{"id": "d772-s3-l3-2-practice-1", "prompt": "P(A)=0.4, P(B)=0.3, and P(both)=0.1. What is P(A or B)?", "options": ["0.12", "0.8", "0.6", "0.7"], "answer": 2, "rationale": "0.4+0.3\u22120.1=0.6.", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2"}, {"id": "d772-s3-l3-2-practice-2", "prompt": "In probability, inclusive OR means:", "options": ["A or B, but never both", "A, B, or both", "Only the overlap", "Neither event"], "answer": 1, "rationale": "Union includes outcomes in either event, including the overlap.", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2"}, {"id": "d772-s3-l3-2-practice-3", "prompt": "Disjoint events have probabilities 0.25 and 0.35. What is the probability of either?", "options": ["0.0875", "0.10", "0.60", "0.35"], "answer": 2, "rationale": "No overlap is subtracted, so 0.25+0.35=0.60.", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "visuals": [{"src": "lesson-visuals/probability-venn.svg", "title": "40 students: 13 math only, 5 both, 7 science only, 15 neither", "alt": "Two overlapping circles inside a rectangle: math only 13, both 5, science only 7, neither 15. Total 40."}], "visualLabel": "ILLUSTRATIVE VENN DIAGRAM \u2022 ORIGINAL PRACTICE DATA", "vocab": [["Union", "Outcomes in A, B, or both; the inclusive OR event."]]}, "d772-s3-l3-3": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "AND is the intersection.", "objectives": ["AND is the intersection", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "AND is the intersection", "text": "A intersection B, written A \u2229 B, contains the overlap. In general P(A and B)=P(A)P(B|A). Use P(A)P(B) only when independence is justified; without replacement usually requires the changed second probability."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "AND is the intersection", "rule": "A intersection B, written A \u2229 B, contains the overlap.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "Of 40 students, 5 take both math and science.", "steps": ["The overlap contains 5 students.", "The sample space contains 40 students.", "P(math and science)=5/40=0.125."]}, "practice": [{"id": "d772-s3-l3-3-practice-1", "prompt": "A fair coin and a fair die are independent. What is P(heads and a 6)?", "options": ["1/2", "1/6", "1/12", "1/8"], "answer": 2, "rationale": "Multiply 1/2 by 1/6.", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3"}, {"id": "d772-s3-l3-3-practice-2", "prompt": "A bag has 2 gold and 3 silver tokens. Draw two without replacement. What is P(two gold)?", "options": ["4/25", "1/10", "2/5", "1/5"], "answer": 1, "rationale": "(2/5)(1/4)=2/20=1/10.", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3"}, {"id": "d772-s3-l3-3-practice-3", "prompt": "Which Venn region represents A \u2229 B?", "options": ["Both circles including their outer regions", "Outside both circles", "The overlap only", "A only"], "answer": 2, "rationale": "Intersection means membership in both events.", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "visuals": [{"src": "lesson-visuals/probability-venn.svg", "title": "40 students: 13 math only, 5 both, 7 science only, 15 neither", "alt": "Two overlapping circles inside a rectangle: math only 13, both 5, science only 7, neither 15. Total 40."}], "visualLabel": "ILLUSTRATIVE VENN DIAGRAM \u2022 ORIGINAL PRACTICE DATA", "vocab": [["Intersection", "Outcomes belonging to both events; the AND event."]]}, "d772-s3-l3-4": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "NOT is the complement.", "objectives": ["NOT is the complement", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "NOT is the complement", "text": "The complement A\u1d9c contains every outcome not in A. P(not A)=1\u2212P(A). For at least one success, the complementary event is no successes. Multiply failure probabilities only if the trials are independent."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "NOT is the complement", "rule": "The complement A\u1d9c contains every outcome not in A.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "A shipment arrives on time with probability 0.82.", "steps": ["On time and not on time cover all outcomes.", "Subtract the on-time probability from 1.", "P(not on time)=1\u22120.82=0.18."]}, "practice": [{"id": "d772-s3-l3-4-practice-1", "prompt": "P(A)=0.72. What is P(not A)?", "options": ["0.72", "0.28", "1.72", "0.18"], "answer": 1, "rationale": "1\u22120.72=0.28.", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4"}, {"id": "d772-s3-l3-4-practice-2", "prompt": "Two independent trials each succeed with probability 0.2. What is P(at least one success)?", "options": ["0.04", "0.40", "0.36", "0.80"], "answer": 2, "rationale": "P(no successes)=0.8\u00d70.8=0.64; complement is 0.36.", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4"}, {"id": "d772-s3-l3-4-practice-3", "prompt": "What is the complement of at least one head in three coin tosses?", "options": ["Three heads", "Exactly one head", "At least one tail", "No heads"], "answer": 3, "rationale": "The only way to fail to get at least one head is to get no heads.", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "visuals": [{"src": "lesson-visuals/probability-venn.svg", "title": "40 students: 13 math only, 5 both, 7 science only, 15 neither", "alt": "Two overlapping circles inside a rectangle: math only 13, both 5, science only 7, neither 15. Total 40."}], "visualLabel": "ILLUSTRATIVE VENN DIAGRAM \u2022 ORIGINAL PRACTICE DATA", "vocab": [["Complement", "All outcomes in the sample space that are not in the event."]]}, "d772-s3-l4-1": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Calculate a probability-weighted mean.", "objectives": ["Calculate a probability-weighted mean", "Explain the denominator, relationship, or net value before calculating."], "teach": [{"title": "Calculate a probability-weighted mean", "text": "Expected value is E(X)=\u03a3 xP(x): multiply each outcome value by its probability, then add. A valid discrete distribution has nonnegative probabilities totaling 1. Do not use an unweighted average unless all outcomes are equally likely."}], "memory": ["Read the event and conditions before choosing a rule."], "anchorChart": {"title": "Calculate a probability-weighted mean", "rule": "Expected value is E(X)=\u03a3 xP(x): multiply each outcome value by its probability, then add.", "columns": [["Cue", "Interpretation"], ["Count", "Define the sample space or conditioning group."], ["Rule", "Justify the rule; do not multiply or add automatically."]]}, "weDo": {"prompt": "A game pays $20 with probability 0.10 and $0 otherwise. A ticket costs $3.", "steps": ["Use net values: $17 when winning and \u2212$3 otherwise.", "Multiply: 17(0.10)=1.70 and \u22123(0.90)=\u22122.70.", "Expected net value=\u2212$1 per play."]}, "practice": [{"id": "d772-s3-l4-1-practice-1", "prompt": "X is 0 with probability 0.75 and 8 with probability 0.25. What is E(X)?", "options": ["4", "6", "2", "8"], "answer": 2, "rationale": "0(0.75)+8(0.25)=2.", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1"}, {"id": "d772-s3-l4-1-practice-2", "prompt": "Which is a valid probability distribution?", "options": ["Probabilities \u22120.1 and 1.1", "Probabilities 0.4 and 0.4", "Probabilities 0.7 and 0.5", "Probabilities 0.3 and 0.7"], "answer": 3, "rationale": "Both probabilities are nonnegative and total 1.", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1"}, {"id": "d772-s3-l4-1-practice-3", "prompt": "A ticket costs $2 and pays $10 with probability 0.2, otherwise $0. What is the expected NET value?", "options": ["$0", "$2", "$8", "\u2212$2"], "answer": 0, "rationale": "Expected payout is $2; subtract the $2 cost to get $0.", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1"}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Expected value", "A probability-weighted average of numerical outcomes."], ["Discrete probability distribution", "Possible discrete values with nonnegative probabilities that total 1."]]}, "d772-s3-l4-2": {"sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "overview": "Use expected net value to judge fairness, find an unknown loss, and compare games, protection plans, investments, and repair choices.", "objectives": ["Calculate expected net value from every outcome.", "Identify a fair activity by E = 0 and solve for an unknown outcome.", "Compare larger expected returns or smaller expected costs.", "Interpret results as long-run averages from the stated viewpoint."], "teach": [{"title": "Calculate and interpret expected net value", "text": "E(X) = \u03a3 xP(x). List all outcomes, make losses negative, subtract fees from each applicable outcome, multiply by probabilities, and add. Probabilities must total 1. A fair activity has expected net value 0; positive and negative values indicate average gain and loss."}, {"title": "Choose the viewpoint before comparing", "text": "Use the same person\u2019s gains and losses throughout. A customer\u2019s payment is a loss to the customer and revenue to the store. Compare the larger expected net return when maximizing gains, or the smaller expected total cost when minimizing costs. Expected value describes a long-run average, not a guaranteed single outcome."}, {"title": "Video example 1 \u2014 A 20-sided die game", "text": "Win $50 for 1 or 20; lose $10 for 2\u201310; lose $5 for 11\u201315; gain $0 for 16\u201319. The probabilities are 2/20, 9/20, 5/20, and 4/20. E = (2/20)(50) + (9/20)(\u221210) + (5/20)(\u22125) + (4/20)(0) = 5 \u2212 4.50 \u2212 1.25 = \u2212$0.75. The game loses $0.75 per play on average."}, {"title": "Video example 2 \u2014 Compare investments", "text": "Option A: 0.84(1,000) + 0.16(\u22121,000) = $680. Option B: 0.61(2,000) + 0.39(\u22121,000) = $830. Option B has the higher expected return even though its chance of a gain is lower. The higher average does not mean an identical risk or guaranteed next result."}, {"title": "Video example 3 \u2014 A store\u2019s protection plan", "text": "An oven store collects $100 for a plan and replaces a $1,400 oven for 5% of plan holders. From the store\u2019s viewpoint, no replacement gives +$100; replacement gives $100 \u2212 $1,400 = \u2212$1,300. E = 0.95(100) + 0.05(\u22121,300) = 95 \u2212 65 = +$30 per plan before other costs."}], "memory": ["Net value includes every fee or cost once.", "E > 0: favorable average; E < 0: unfavorable average; E = 0: fair.", "For costs, choose the smaller positive expected cost."], "anchorChart": {"title": "Calculate expected net value", "rule": "E = sum of each signed net outcome multiplied by its probability.", "columns": [["Step", "Action"], ["Net values", "Include fees once; make losses negative."], ["Weighted sum", "Multiply each net value by its probability and add."], ["Interpret", "E > 0 gain; E < 0 loss; E = 0 fair."]]}, "weDo": {"prompt": "Use the video\u2019s fair 20-sided die to decide whether the game is profitable on average.", "steps": ["Count the four disjoint groups: 2, 9, 5, and 4 labels; they total 20.", "Use probabilities 2/20, 9/20, 5/20, 4/20 and signed values +50, \u221210, \u22125, 0.", "Multiply and add: 5 \u2212 4.50 \u2212 1.25 + 0 = \u2212$0.75.", "Interpret: a long-run average loss of $0.75 per play, not a profitable game."]}, "practice": [{"id": "d772-s3-l4-2-practice-1", "prompt": "A game has expected net value \u2212$0.50. What does this mean?", "options": ["Every play loses exactly $0.50", "The long-run average loss is $0.50 per play", "A win becomes due after losses", "Winning is impossible"], "answer": 1, "rationale": "Individual plays vary; the expectation describes the average over repetitions.", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2"}, {"id": "d772-s3-l4-2-practice-2", "prompt": "One fair die has expected value 3.5. Is 3.5 possible on a single roll?", "options": ["Yes, on a fair die", "No; an expected value need not be an individual outcome", "Only after an odd number of rolls", "The expected value must be wrong"], "answer": 1, "rationale": "The mean can fall between possible outcomes.", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2"}, {"id": "d772-s3-l4-2-practice-3", "prompt": "Plan A has expected net value $4; Plan B has $2. Which statement is supported?", "options": ["A guarantees more money on the next trial", "A has a higher long-run average under the stated models", "B cannot ever outperform A", "The plans have identical risk"], "answer": 1, "rationale": "A higher expectation alone does not determine one-trial results or variability.", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2"}, {"id": "d772-s3-l4-2-course-q1", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "A raffle ticket costs $2. The prizes are $50 with probability 0.02, $20 with probability 0.05, and no prize with probability 0.93. Is this raffle fair? Why or why not?", "options": ["Yes, because the expected value is $0.", "No, because the expected value is $23.33.", "Cannot be determined from the given information.", "Yes, because the better prizes have a lower probability."], "answer": 0, "rationale": "Subtract the $2 ticket cost from every prize: net outcomes are $48, $18, and \u2212$2. E = 0.02(48) + 0.05(18) + 0.93(\u22122) = 0.96 + 0.90 \u2212 1.86 = $0. A fair game has expected net value $0. $23.33 is an unweighted average of the prizes and ignores the fee; rare large prizes alone do not establish fairness.", "hint": "Use net winnings, including the ticket cost when there is no prize.", "skill": "fair-game", "anchorChart": {"type": "fair-game"}, "visual": {"type": "table", "headers": ["Prize", "Probability"], "rows": [["$50", "0.02"], ["$20", "0.05"], ["$0", "0.93"]], "caption": "Raffle payout distribution \u00b7 ticket cost $2", "alt": "Raffle payout distribution \u00b7 ticket cost $2: $50, 0.02; $20, 0.05; $0, 0.93"}}, {"id": "d772-s3-l4-2-course-q2", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "In a game, you win $50 with probability 0.2 or lose an unknown amount Z with probability 0.8. If the game is fair, what is Z?", "options": ["$6.25", "$12.50", "$15.00", "$10.00"], "answer": 1, "rationale": "A fair game satisfies E = 0. Use a negative sign for the loss: 0.2(50) + 0.8(\u2212Z) = 0, so 10 \u2212 0.8Z = 0. Therefore Z = 10/0.8 = $12.50. The loss is $12.50, so its signed net value is \u2212$12.50. $10 is the winning contribution, not the loss amount.", "hint": "Set the probability-weighted net gain equal to zero, then solve for the loss.", "skill": "fair-game", "anchorChart": {"type": "fair-game"}, "visual": {"type": "table", "headers": ["Net outcome", "Probability"], "rows": [["+$50", "0.2"], ["\u2212Z", "0.8"]], "caption": "Fair game with an unknown loss", "alt": "Fair game with an unknown loss: +$50, 0.2; \u2212Z, 0.8"}}, {"id": "d772-s3-l4-2-course-q3", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "Roll a fair ten-sided die labeled 1 through 10. Rolling 8, 9, or 10 wins $25; rolling 4, 5, 6, or 7 loses $5; rolling 1, 2, or 3 loses $15. Will this game be profitable on average? Why or why not?", "options": ["No, because the expected value is negative.", "Yes, because the expected value is negative.", "No, because the expected value is positive.", "Yes, because the expected value is positive."], "answer": 3, "rationale": "Count the labels in each group: 3/10, 4/10, and 3/10. E = 0.3(25) + 0.4(\u22125) + 0.3(\u221215) = 7.50 \u2212 2.00 \u2212 4.50 = +$1 per play. A positive expected net value means a profit on average over many plays, not a guaranteed win on one roll.", "hint": "Convert each group of die labels to a probability before multiplying.", "skill": "expected-value", "anchorChart": {"type": "expected-value"}, "visual": {"type": "table", "headers": ["Die labels", "Net gain", "Probability"], "rows": [["8, 9, 10", "+$25", "3/10"], ["4, 5, 6, 7", "\u2212$5", "4/10"], ["1, 2, 3", "\u2212$15", "3/10"]], "caption": "Ten-sided die \u00b7 no additional entry fee stated", "alt": "Ten-sided die \u00b7 no additional entry fee stated: 8, 9, 10, +$25, 3/10; 4, 5, 6, 7, \u2212$5, 4/10; 1, 2, 3, \u2212$15, 3/10"}}, {"id": "d772-s3-l4-2-course-q4", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "A phone costs $500. A protection plan costs $150 and replaces the phone if it is lost or damaged. The probability of loss or damage is 20%. Based on expected monetary value, is buying the plan a good idea?", "options": ["Yes, because the expected value is positive.", "No, because the expected value is positive.", "Yes, because the expected value is negative.", "No, because the expected value is negative."], "answer": 3, "rationale": "From the customer\u2019s perspective, net values are $500 \u2212 $150 = +$350 if replacement is needed, and \u2212$150 otherwise. E = 0.2(350) + 0.8(\u2212150) = 70 \u2212 120 = \u2212$50. Equivalently, expected benefit $100 minus plan cost $150 is \u2212$50. By expected monetary value, the plan loses money on average; this does not predict the outcome for a particular customer.", "hint": "Choose the customer\u2019s viewpoint and subtract the plan price in both outcomes.", "skill": "expected-value", "anchorChart": {"type": "expected-value"}, "visual": {"type": "table", "headers": ["Replacement benefit", "Probability"], "rows": [["$500", "0.20"], ["$0", "0.80"]], "caption": "Customer\u2019s protection plan \u00b7 cost $150", "alt": "Customer\u2019s protection plan \u00b7 cost $150: $500, 0.20; $0, 0.80"}}, {"id": "d772-s3-l4-2-course-q5", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "Investment A has a 60% chance of gaining $10,000 and a 40% chance of losing $3,000. Investment B has a 70% chance of gaining $8,000 and a 30% chance of losing $2,000. Which investment makes more money on average?", "options": ["Cannot be determined from this information", "Investment B", "Investment A", "They have the same average return."], "answer": 1, "rationale": "E(A) = 0.6(10,000) + 0.4(\u22123,000) = 6,000 \u2212 1,200 = $4,800. E(B) = 0.7(8,000) + 0.3(\u22122,000) = 5,600 \u2212 600 = $5,000. Investment B has a $200 higher expected return. A larger possible win does not necessarily mean a larger average, and neither investment guarantees its expected return.", "hint": "Calculate each expected net return separately, then compare the results.", "skill": "expected-value-compare", "anchorChart": {"type": "expected-value-compare"}, "visual": {"type": "table", "headers": ["Investment", "Gain", "P(gain)", "Loss", "P(loss)"], "rows": [["A", "$10,000", "0.60", "\u2212$3,000", "0.40"], ["B", "$8,000", "0.70", "\u2212$2,000", "0.30"]], "caption": "Compare expected investment returns", "alt": "Compare expected investment returns: A, $10,000, 0.60, \u2212$3,000, 0.40; B, $8,000, 0.70, \u2212$2,000, 0.30"}}, {"id": "d772-s3-l4-2-course-q6", "lessonId": "d772-s3-l4-2", "learningPathLessonId": "d772-s3-l4-2", "topicId": "d772-s3-l4-2", "sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "prompt": "A mechanic chooses between two engine parts. Brand A costs $200 and has a 0.01 probability of malfunctioning. Brand B costs $100 and has a 0.05 probability of malfunctioning. A malfunction causes an additional $3,000 repair cost. Which brand costs less on average?", "options": ["Cannot be determined from this information", "Brand B", "They will cost the same on average.", "Brand A"], "answer": 3, "rationale": "Expected cost A = 200 + 0.01(3,000) = $230. Expected cost B = 100 + 0.05(3,000) = $250. Brand A costs $20 less on average. Using signed money changes gives 0.99(\u2212200)+0.01(\u22123,200)=\u2212$230 and 0.95(\u2212100)+0.05(\u22123,100)=\u2212$250. Include the part price even when it malfunctions; the lowest purchase price alone does not decide the lowest expected cost.", "hint": "Add the certain part price to the probability-weighted additional repair cost.", "skill": "expected-cost", "anchorChart": {"type": "expected-cost"}, "visual": {"type": "table", "headers": ["Brand", "Part price", "P(malfunction)", "Additional damage"], "rows": [["A", "$200", "0.01", "$3,000"], ["B", "$100", "0.05", "$3,000"]], "caption": "Compare total expected costs", "alt": "Compare total expected costs: A, $200, 0.01, $3,000; B, $100, 0.05, $3,000"}}], "references": [{"source": "WGU D772 Lesson 4.2 Applications of Expected Value", "url": "https://apps.cgp-oex.wgu.edu/learning/course/course-v1:WGUx+OEX0516+v01/block-v1:WGUx+OEX0516+v01+type@sequential+block@24f1530cc8d94cf9ad06493024268f62/block-v1:WGUx+OEX0516+v01+type@vertical+block@f3a635cdeda84c40ab910112078f3326"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Expected value", "The long-term average found by summing each outcome value multiplied by its probability."], ["Fair", "An activity with expected net value 0."], ["Net value", "Money gained or lost after including the costs."]], "sourceMetadata": {"courseMaterial": "User-provided Lesson 4.2 practice and Lesson 4/Section 3 summaries, 2026-10-12", "videoTranscript": "User-provided D772 Expected Value Applications Video Transcript", "question3Repair": "Restored the omitted probability factors 3/10, 4/10, 3/10 in the explanation."}}, "d772-s3-l1": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Theoretical and Empirical Probability.", "objectives": ["Read probability notation.", "Use equally likely outcomes.", "Estimate from observations."], "teach": [{"title": "Read probability notation", "text": "An outcome is one result. The sample space S lists all possible results; an event A is a set of results. P(A) is between 0 and 1. A probability of 0.25 means 25%, not 25 successes guaranteed in every 100 trials."}, {"title": "Use equally likely outcomes", "text": "For equally likely outcomes, P(A)=favorable outcomes / total outcomes. Count the same kind of outcome in numerator and denominator. This counting rule needs equally likely outcomes; a biased spinner needs its actual sector probabilities."}, {"title": "Estimate from observations", "text": "Empirical probability is observed successes / trials. With many independent repetitions under the same conditions, relative frequency tends toward the underlying probability. More trials do not force an exact match or make a losing streak require a win next."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "For one fair die, S={1,2,3,4,5,6}. Event A={2,4,6} means an even result.", "steps": ["List all six outcomes.", "Identify the three outcomes in A.", "Write P(A)=3/6=0.5."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Outcome", "One result of a chance process."], ["Sample space", "The set of all possible outcomes."], ["Event", "A set of outcomes from the sample space."], ["Probability", "A measure of likelihood from 0 to 1."], ["Theoretical probability", "A probability calculated from an assumed model rather than observed counts."], ["Equally likely", "Outcomes having the same probability."], ["Empirical probability", "Observed event occurrences divided by the number of trials."], ["Law of large numbers", "Under suitable repeated-trial conditions, observed proportions tend toward the underlying probability."]], "practiceLessonIds": ["d772-s3-l1-1", "d772-s3-l1-2", "d772-s3-l1-3"]}, "d772-s3-l1-summary": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 1: Summary: Theoretical and Empirical Probability", "objectives": ["Read probability notation.", "Use equally likely outcomes.", "Estimate from observations."], "teach": [{"title": "Read probability notation", "text": "An outcome is one result. The sample space S lists all possible results; an event A is a set of results. P(A) is between 0 and 1. A probability of 0.25 means 25%, not 25 successes guaranteed in every 100 trials."}, {"title": "Use equally likely outcomes", "text": "For equally likely outcomes, P(A)=favorable outcomes / total outcomes. Count the same kind of outcome in numerator and denominator. This counting rule needs equally likely outcomes; a biased spinner needs its actual sector probabilities."}, {"title": "Estimate from observations", "text": "Empirical probability is observed successes / trials. With many independent repetitions under the same conditions, relative frequency tends toward the underlying probability. More trials do not force an exact match or make a losing streak require a win next."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "For one fair die, S={1,2,3,4,5,6}. Event A={2,4,6} means an even result.", "steps": ["List all six outcomes.", "Identify the three outcomes in A.", "Write P(A)=3/6=0.5."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Outcome", "One result of a chance process."], ["Sample space", "The set of all possible outcomes."], ["Event", "A set of outcomes from the sample space."], ["Probability", "A measure of likelihood from 0 to 1."], ["Theoretical probability", "A probability calculated from an assumed model rather than observed counts."], ["Equally likely", "Outcomes having the same probability."], ["Empirical probability", "Observed event occurrences divided by the number of trials."], ["Law of large numbers", "Under suitable repeated-trial conditions, observed proportions tend toward the underlying probability."]], "practiceLessonIds": ["d772-s3-l1-1", "d772-s3-l1-2", "d772-s3-l1-3"]}, "d772-s3-l1-quiz": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 1: Quiz: Theoretical and Empirical Probability", "objectives": ["Read probability notation.", "Use equally likely outcomes.", "Estimate from observations."], "teach": [{"title": "Read probability notation", "text": "An outcome is one result. The sample space S lists all possible results; an event A is a set of results. P(A) is between 0 and 1. A probability of 0.25 means 25%, not 25 successes guaranteed in every 100 trials."}, {"title": "Use equally likely outcomes", "text": "For equally likely outcomes, P(A)=favorable outcomes / total outcomes. Count the same kind of outcome in numerator and denominator. This counting rule needs equally likely outcomes; a biased spinner needs its actual sector probabilities."}, {"title": "Estimate from observations", "text": "Empirical probability is observed successes / trials. With many independent repetitions under the same conditions, relative frequency tends toward the underlying probability. More trials do not force an exact match or make a losing streak require a win next."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "For one fair die, S={1,2,3,4,5,6}. Event A={2,4,6} means an even result.", "steps": ["List all six outcomes.", "Identify the three outcomes in A.", "Write P(A)=3/6=0.5."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Outcome", "One result of a chance process."], ["Sample space", "The set of all possible outcomes."], ["Event", "A set of outcomes from the sample space."], ["Probability", "A measure of likelihood from 0 to 1."], ["Theoretical probability", "A probability calculated from an assumed model rather than observed counts."], ["Equally likely", "Outcomes having the same probability."], ["Empirical probability", "Observed event occurrences divided by the number of trials."], ["Law of large numbers", "Under suitable repeated-trial conditions, observed proportions tend toward the underlying probability."]], "practiceLessonIds": ["d772-s3-l1-1", "d772-s3-l1-2", "d772-s3-l1-3"]}, "d772-s3-l2": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Independent, Dependent, and Disjoint Events.", "objectives": ["Separate independent from dependent.", "Disjoint does not mean independent."], "teach": [{"title": "Separate independent from dependent", "text": "Independent events do not change each other\u2019s probability: P(B|A)=P(B). For independent events, P(A and B)=P(A)P(B). Drawing without replacement usually changes the next draw\u2019s probability because the bag\u2019s contents change."}, {"title": "Disjoint does not mean independent", "text": "Disjoint, or mutually exclusive, events cannot occur together: P(A and B)=0. If both have positive probability, they are not independent: learning that one occurred rules out the other."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "A bag has 3 red and 2 blue tokens. Draw two without replacement.", "steps": ["P(first red)=3/5.", "After red is removed, 2 red remain among 4 tokens.", "P(two red)=(3/5)(2/4)=3/10."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Independent events", "Events for which learning that one occurred does not change the probability of the other."], ["Dependent events", "Events whose probabilities change when another event is known to occur."], ["Conditional probability", "The probability of an event within the group specified by a condition."], ["Disjoint events", "Events that cannot happen together; also called mutually exclusive."]], "practiceLessonIds": ["d772-s3-l2-1", "d772-s3-l2-2"]}, "d772-s3-l2-summary": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 2: Summary: Independent, Dependent, and Disjoint Events", "objectives": ["Separate independent from dependent.", "Disjoint does not mean independent."], "teach": [{"title": "Separate independent from dependent", "text": "Independent events do not change each other\u2019s probability: P(B|A)=P(B). For independent events, P(A and B)=P(A)P(B). Drawing without replacement usually changes the next draw\u2019s probability because the bag\u2019s contents change."}, {"title": "Disjoint does not mean independent", "text": "Disjoint, or mutually exclusive, events cannot occur together: P(A and B)=0. If both have positive probability, they are not independent: learning that one occurred rules out the other."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "A bag has 3 red and 2 blue tokens. Draw two without replacement.", "steps": ["P(first red)=3/5.", "After red is removed, 2 red remain among 4 tokens.", "P(two red)=(3/5)(2/4)=3/10."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Independent events", "Events for which learning that one occurred does not change the probability of the other."], ["Dependent events", "Events whose probabilities change when another event is known to occur."], ["Conditional probability", "The probability of an event within the group specified by a condition."], ["Disjoint events", "Events that cannot happen together; also called mutually exclusive."]], "practiceLessonIds": ["d772-s3-l2-1", "d772-s3-l2-2"]}, "d772-s3-l2-quiz": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 2: Quiz: Independent, Dependent, and Disjoint Events", "objectives": ["Separate independent from dependent.", "Disjoint does not mean independent."], "teach": [{"title": "Separate independent from dependent", "text": "Independent events do not change each other\u2019s probability: P(B|A)=P(B). For independent events, P(A and B)=P(A)P(B). Drawing without replacement usually changes the next draw\u2019s probability because the bag\u2019s contents change."}, {"title": "Disjoint does not mean independent", "text": "Disjoint, or mutually exclusive, events cannot occur together: P(A and B)=0. If both have positive probability, they are not independent: learning that one occurred rules out the other."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "A bag has 3 red and 2 blue tokens. Draw two without replacement.", "steps": ["P(first red)=3/5.", "After red is removed, 2 red remain among 4 tokens.", "P(two red)=(3/5)(2/4)=3/10."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Independent events", "Events for which learning that one occurred does not change the probability of the other."], ["Dependent events", "Events whose probabilities change when another event is known to occur."], ["Conditional probability", "The probability of an event within the group specified by a condition."], ["Disjoint events", "Events that cannot happen together; also called mutually exclusive."]], "practiceLessonIds": ["d772-s3-l2-1", "d772-s3-l2-2"]}, "d772-s3-l3": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Unions, Intersections, and Complements.", "objectives": ["Read all four Venn regions.", "OR is the inclusive union.", "AND is the intersection.", "NOT is the complement."], "teach": [{"title": "Read all four Venn regions", "text": "A Venn diagram separates A only, both, B only, and neither. The rectangle represents the full sample space. Include the overlap when counting all of A or all of B; count it once for the union."}, {"title": "OR is the inclusive union", "text": "A union B, written A \u222a B, includes A, B, or both. P(A or B)=P(A)+P(B)\u2212P(A and B). Subtract the overlap once because adding both probabilities counts it twice."}, {"title": "AND is the intersection", "text": "A intersection B, written A \u2229 B, contains the overlap. In general P(A and B)=P(A)P(B|A). Use P(A)P(B) only when independence is justified; without replacement usually requires the changed second probability."}, {"title": "NOT is the complement", "text": "The complement A\u1d9c contains every outcome not in A. P(not A)=1\u2212P(A). For at least one success, the complementary event is no successes. Multiply failure probabilities only if the trials are independent."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "Among 40 students, 18 take math, 12 take science, and 5 take both.", "steps": ["Math only=18\u22125=13. Science only=12\u22125=7.", "Either subject=13+5+7=25.", "Neither=40\u221225=15."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Venn diagram", "A diagram showing event membership and overlap within a sample space."], ["Union", "Outcomes in A, B, or both; the inclusive OR event."], ["Intersection", "Outcomes belonging to both events; the AND event."], ["Complement", "All outcomes in the sample space that are not in the event."]], "practiceLessonIds": ["d772-s3-l3-1", "d772-s3-l3-2", "d772-s3-l3-3", "d772-s3-l3-4"]}, "d772-s3-l3-summary": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 3: Summary: Unions, Intersections, and Complements", "objectives": ["Read all four Venn regions.", "OR is the inclusive union.", "AND is the intersection.", "NOT is the complement."], "teach": [{"title": "Read all four Venn regions", "text": "A Venn diagram separates A only, both, B only, and neither. The rectangle represents the full sample space. Include the overlap when counting all of A or all of B; count it once for the union."}, {"title": "OR is the inclusive union", "text": "A union B, written A \u222a B, includes A, B, or both. P(A or B)=P(A)+P(B)\u2212P(A and B). Subtract the overlap once because adding both probabilities counts it twice."}, {"title": "AND is the intersection", "text": "A intersection B, written A \u2229 B, contains the overlap. In general P(A and B)=P(A)P(B|A). Use P(A)P(B) only when independence is justified; without replacement usually requires the changed second probability."}, {"title": "NOT is the complement", "text": "The complement A\u1d9c contains every outcome not in A. P(not A)=1\u2212P(A). For at least one success, the complementary event is no successes. Multiply failure probabilities only if the trials are independent."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "Among 40 students, 18 take math, 12 take science, and 5 take both.", "steps": ["Math only=18\u22125=13. Science only=12\u22125=7.", "Either subject=13+5+7=25.", "Neither=40\u221225=15."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Venn diagram", "A diagram showing event membership and overlap within a sample space."], ["Union", "Outcomes in A, B, or both; the inclusive OR event."], ["Intersection", "Outcomes belonging to both events; the AND event."], ["Complement", "All outcomes in the sample space that are not in the event."]], "practiceLessonIds": ["d772-s3-l3-1", "d772-s3-l3-2", "d772-s3-l3-3", "d772-s3-l3-4"]}, "d772-s3-l3-quiz": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 3: Quiz: Unions, Intersections, and Complements", "objectives": ["Read all four Venn regions.", "OR is the inclusive union.", "AND is the intersection.", "NOT is the complement."], "teach": [{"title": "Read all four Venn regions", "text": "A Venn diagram separates A only, both, B only, and neither. The rectangle represents the full sample space. Include the overlap when counting all of A or all of B; count it once for the union."}, {"title": "OR is the inclusive union", "text": "A union B, written A \u222a B, includes A, B, or both. P(A or B)=P(A)+P(B)\u2212P(A and B). Subtract the overlap once because adding both probabilities counts it twice."}, {"title": "AND is the intersection", "text": "A intersection B, written A \u2229 B, contains the overlap. In general P(A and B)=P(A)P(B|A). Use P(A)P(B) only when independence is justified; without replacement usually requires the changed second probability."}, {"title": "NOT is the complement", "text": "The complement A\u1d9c contains every outcome not in A. P(not A)=1\u2212P(A). For at least one success, the complementary event is no successes. Multiply failure probabilities only if the trials are independent."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "Among 40 students, 18 take math, 12 take science, and 5 take both.", "steps": ["Math only=18\u22125=13. Science only=12\u22125=7.", "Either subject=13+5+7=25.", "Neither=40\u221225=15."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Venn diagram", "A diagram showing event membership and overlap within a sample space."], ["Union", "Outcomes in A, B, or both; the inclusive OR event."], ["Intersection", "Outcomes belonging to both events; the AND event."], ["Complement", "All outcomes in the sample space that are not in the event."]], "practiceLessonIds": ["d772-s3-l3-1", "d772-s3-l3-2", "d772-s3-l3-3", "d772-s3-l3-4"]}, "d772-s3-l4": {"sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "overview": "Calculate expected value and apply it to fairness, long-run profit, protection plans, investments, and costs.", "objectives": ["Calculate a probability-weighted mean.", "Interpret long-run value and risk."], "teach": [{"title": "Multiply, then add", "text": "Expected value is the sum of every outcome\u2019s probability multiplied by its signed value. Include fees and costs when calculating net outcomes."}, {"title": "Interpret the average", "text": "Expected value quantifies the long-run average. A positive expected net value favors a gain; a negative one indicates a loss. Compare the appropriate averages when choosing between alternatives."}, {"title": "Check fairness", "text": "A game or activity is fair when its expected net value is 0. This means neither an average gain nor an average loss over many repetitions."}], "memory": ["E(X) = \u03a3 xP(x).", "Fair means expected net value = 0."], "weDo": {"prompt": "A game pays $20 with probability 0.10 and $0 otherwise. A ticket costs $3.", "steps": ["Use net values: $17 when winning and \u2212$3 otherwise.", "Multiply: 17(0.10)=1.70 and \u22123(0.90)=\u22122.70.", "Expected net value=\u2212$1 per play."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Expected value", "The long-term average found by summing each outcome value multiplied by its probability."], ["Fair", "An activity with expected net value 0."], ["Net value", "Money gained or lost after including the costs."]], "practiceLessonIds": ["d772-s3-l4-1", "d772-s3-l4-2"]}, "d772-s3-l4-summary": {"sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 \u00b7 LESSON 4.2", "overview": "Calculate expected value, use it to compare average outcomes, and test whether a scenario is fair.", "objectives": ["Calculate expected value by multiplying and summing.", "Use expected value to identify favorable and unfavorable average outcomes.", "Check fairness by testing whether expected net value equals 0."], "teach": [{"title": "Multiply, then add", "text": "Expected value is the sum of every outcome\u2019s probability multiplied by its signed value. Include fees and costs when calculating net outcomes."}, {"title": "Interpret the average", "text": "Expected value quantifies the long-run average. A positive expected net value favors a gain; a negative one indicates a loss. Compare the appropriate averages when choosing between alternatives."}, {"title": "Check fairness", "text": "A game or activity is fair when its expected net value is 0. This means neither an average gain nor an average loss over many repetitions."}], "memory": ["E(X) = \u03a3 xP(x).", "Fair means expected net value = 0."], "weDo": {"prompt": "A game pays $20 with probability 0.10 and $0 otherwise. A ticket costs $3.", "steps": ["Use net values: $17 when winning and \u2212$3 otherwise.", "Multiply: 17(0.10)=1.70 and \u22123(0.90)=\u22122.70.", "Expected net value=\u2212$1 per play."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Expected value", "The long-term average found by summing each outcome value multiplied by its probability."], ["Fair", "An activity with expected net value 0."], ["Net value", "Money gained or lost after including the costs."]], "practiceLessonIds": ["d772-s3-l4-1", "d772-s3-l4-2"]}, "d772-s3-l4-quiz": {"sourceLabel": "CORROBORATED PROBABILITY STUDY NOTES", "overview": "Lesson 4: Quiz: Expected Value", "objectives": ["Calculate a probability-weighted mean.", "Interpret long-run value and risk."], "teach": [{"title": "Calculate a probability-weighted mean", "text": "Expected value is E(X)=\u03a3 xP(x): multiply each outcome value by its probability, then add. A valid discrete distribution has nonnegative probabilities totaling 1. Do not use an unweighted average unless all outcomes are equally likely."}, {"title": "Interpret long-run value and risk", "text": "Expected value is a long-run average, not a promised result on the next trial; it may not be a possible single outcome. For a decision, compare net values consistently and consider variability, affordability, and model assumptions."}], "memory": ["Explain the event, then choose the rule."], "weDo": {"prompt": "A game pays $20 with probability 0.10 and $0 otherwise. A ticket costs $3.", "steps": ["Use net values: $17 when winning and \u2212$3 otherwise.", "Multiply: 17(0.10)=1.70 and \u22123(0.90)=\u22122.70.", "Expected net value=\u2212$1 per play."]}, "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Expected value", "A probability-weighted average of numerical outcomes."], ["Discrete probability distribution", "Possible discrete values with nonnegative probabilities that total 1."], ["Net value", "Payout or benefit after subtracting the cost."], ["Variability", "How much individual outcomes differ; expectation alone does not describe this risk."]], "practiceLessonIds": ["d772-s3-l4-1", "d772-s3-l4-2"]}, "d772-s3-review": {"sourceLabel": "COURSE-PROVIDED D772 \u00b7 SECTION 3 SUMMARY", "overview": "Apply principles of probability to make informed decisions: probability models, event relationships and set operations, and expected value.", "objectives": ["Distinguish theoretical and empirical probability and explain the Law of Large Numbers.", "Identify independent, dependent, and disjoint events and calculate unions, intersections, and complements.", "Calculate expected value and use it to evaluate fairness and compare average outcomes."], "teach": [{"title": "Probability models and repeated trials", "text": "Use probability terminology and notation, distinguish theoretical probability from observed empirical proportions, and apply the Law of Large Numbers: observed proportions tend toward the modeled probabilities over many suitable repetitions."}, {"title": "Event relationships and operations", "text": "Distinguish independent, dependent, and disjoint events. Union means OR, intersection means AND, and complement means NOT. Choose the rule from the relationship and avoid double-counting overlap."}, {"title": "Expected value and decisions", "text": "Multiply every signed outcome value by its probability and sum. Include costs, state the viewpoint, check fairness with E = 0, and compare larger expected returns or smaller expected costs. Interpret the result as an average over the long run."}], "references": [{"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"}, {"source": "OpenStax Introductory Statistics 2e", "url": "https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation"}], "vocab": [["Outcome", "One result of a chance process."], ["Sample space", "The set of all possible outcomes."], ["Event", "A set of outcomes from the sample space."], ["Probability", "A measure of likelihood from 0 to 1."], ["Theoretical probability", "A probability calculated from an assumed model rather than observed counts."], ["Equally likely", "Outcomes having the same probability."], ["Empirical probability", "Observed event occurrences divided by the number of trials."], ["Law of large numbers", "Under suitable repeated-trial conditions, observed proportions tend toward the underlying probability."], ["Independent events", "Events for which learning that one occurred does not change the probability of the other."], ["Dependent events", "Events whose probabilities change when another event is known to occur."], ["Conditional probability", "The probability of an event within the group specified by a condition."], ["Disjoint events", "Events that cannot happen together; also called mutually exclusive."], ["Venn diagram", "A diagram showing event membership and overlap within a sample space."], ["Union", "Outcomes in A, B, or both; the inclusive OR event."], ["Intersection", "Outcomes belonging to both events; the AND event."], ["Complement", "All outcomes in the sample space that are not in the event."], ["Expected value", "A probability-weighted average of numerical outcomes."], ["Discrete probability distribution", "Possible discrete values with nonnegative probabilities that total 1."], ["Net value", "Payout or benefit after subtracting the cost."], ["Variability", "How much individual outcomes differ; expectation alone does not describe this risk."]], "practiceLessonIds": ["d772-s3-l1-1", "d772-s3-l1-2", "d772-s3-l1-3", "d772-s3-l2-1", "d772-s3-l2-2", "d772-s3-l3-1", "d772-s3-l3-2", "d772-s3-l3-3", "d772-s3-l3-4", "d772-s3-l4-1", "d772-s3-l4-2"]}};
const D772_OFFICIAL_SECTIONS=[D772_SECTION_ONE,D772_SECTION_TWO,D772_SECTION_THREE];
function sectionUnits(section){
  const out=[];
  for(const lesson of section?.lessons||[]){
    out.push(lesson);
    for(const sub of lesson.sublessons||[])out.push({...sub,parentTitle:lesson.title});
  }
  return out;
}
function allOfficialLessons(){return D772_OFFICIAL_SECTIONS.flatMap(sectionUnits)}

function d772SectionForRow(row){
  const sid=String(row?.sectionId||row?.learningPath?.sectionId||'');
  if(sid==='d772-s2')return D772_SECTION_TWO;
  if(sid==='d772-s3')return D772_SECTION_THREE;
  return D772_SECTION_ONE;
}
function lessonById(id){return allOfficialLessons().find(l=>l.id===id)||null}
function classifyD772(row){
  if(row?.learningPath?.courseId==='D772'&&(row.learningPath.lessonId||row.learningPath.multiLesson))return row.learningPath;
  const section=d772SectionForRow(row);
  const text=sourceText(row),head=headingInfo(row);
  let best=null,bestScore=0;
  for(const lesson of sectionUnits(section).filter(x=>!x.review)){
    let score=0;
    if(head.lessonNumber===lesson.number)score+=12;
    if(norm(head.lessonTitle).includes(norm(lesson.short)))score+=8;
    if(text.includes(norm(lesson.title)))score+=12;
    for(const k of lesson.keywords)if(text.includes(k))score+=1;
    if(score>bestScore){bestScore=score;best=lesson}
  }
  if(!best||bestScore<2)return null;
  return {
    courseId:'D772',sectionId:section.id,sectionTitle:section.title,
    lessonId:best.id,lessonTitle:best.title,lessonNumber:best.number,confidence:bestScore>=10?'high':bestScore>=4?'medium':'low'
  };
}
function d772Segments(row){
  const raw=String(row?.text||'');
  if(!raw)return [];
  const marks=[];
  const section=d772SectionForRow(row);
  for(const lesson of sectionUnits(section).filter(x=>!x.review)){
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
    'd772-s1-l4':['causation','causal','correlation','association','generalize','inference','supported conclusion','limitation','claim','findings'],
    'd772-s2-l1-2':['explanatory variable','response variable','predict','prediction','influence','relationship','categorical explanatory','quantitative explanatory','categorical response','quantitative response']
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
  const section=d772SectionForRow(row);
  for(const lesson of sectionUnits(section).filter(x=>!x.review)){
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
      const section=d772SectionForRow(row);if(item.learningPathSectionId!==section.id){item.learningPathSectionId=section.id;changed=true}
    }
  }
  const ids=[...lessonIds];
  if(ids.length>1){
    const section=d772SectionForRow(row);const next={courseId:'D772',sectionId:section.id,sectionTitle:section.title,multiLesson:true,lessonIds:ids,confidence:'item-level'};
    if(JSON.stringify(row.learningPath)!==JSON.stringify(next)){row.learningPath=next;changed=true}
  }else if(ids.length===1){
    const lesson=lessonById(ids[0]);
    const section=d772SectionForRow(row);const next={courseId:'D772',sectionId:section.id,sectionTitle:section.title,lessonId:lesson.id,lessonTitle:lesson.title,lessonNumber:lesson.number,confidence:'item-level'};
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

// Original targeted practice. These are not official WGU assessment items.
const HUB_SKILL_PRACTICE=[{"id": "hub-mean-1", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 1, 2, 2, 4, 6 minutes for five sessions. Which value is the mean study time?", "options": ["2", "15", "3.75", "3.0"], "answer": 3, "rationale": "Add all five values: 1 + 2 + 2 + 4 + 6 = 15. Divide by five sessions: 15/5 = 3.0 minutes. 2 is the median, 15 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [1, 2, 2, 4, 6], "min": 0, "max": 7, "xLabel": "Study time (minutes)", "alt": "Dot plot: 1, 2, 2, 4, 6. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-1", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 9, 1, 11, 5, 3, and 7 minutes. What is the median waiting time?", "options": ["5", "7", "36", "6"], "answer": 3, "rationale": "First sort: 1, 3, 5, 7, 9, 11. Six observations give two middle positions, 3 and 4. Average 5 and 7: (5+7)/2 = 6 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [1, 3, 5, 7, 9, 11], "min": 0, "max": 12, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 1, 3, 5, 7, 9, 11. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-2", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 2, 3, 3, 5, 7 minutes for five sessions. Which value is the mean study time?", "options": ["20", "5.0", "4.0", "3"], "answer": 2, "rationale": "Add all five values: 2 + 3 + 3 + 5 + 7 = 20. Divide by five sessions: 20/5 = 4.0 minutes. 3 is the median, 20 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [2, 3, 3, 5, 7], "min": 1, "max": 8, "xLabel": "Study time (minutes)", "alt": "Dot plot: 2, 3, 3, 5, 7. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-2", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 10, 2, 12, 6, 4, and 8 minutes. What is the median waiting time?", "options": ["8", "42", "7", "6"], "answer": 2, "rationale": "First sort: 2, 4, 6, 8, 10, 12. Six observations give two middle positions, 3 and 4. Average 6 and 8: (6+8)/2 = 7 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [2, 4, 6, 8, 10, 12], "min": 1, "max": 13, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 2, 4, 6, 8, 10, 12. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-3", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 3, 4, 4, 6, 8 minutes for five sessions. Which value is the mean study time?", "options": ["6.25", "5.0", "4", "25"], "answer": 1, "rationale": "Add all five values: 3 + 4 + 4 + 6 + 8 = 25. Divide by five sessions: 25/5 = 5.0 minutes. 4 is the median, 25 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [3, 4, 4, 6, 8], "min": 2, "max": 9, "xLabel": "Study time (minutes)", "alt": "Dot plot: 3, 4, 4, 6, 8. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-3", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 11, 3, 13, 7, 5, and 9 minutes. What is the median waiting time?", "options": ["48", "8", "7", "9"], "answer": 1, "rationale": "First sort: 3, 5, 7, 9, 11, 13. Six observations give two middle positions, 3 and 4. Average 7 and 9: (7+9)/2 = 8 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [3, 5, 7, 9, 11, 13], "min": 2, "max": 14, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 3, 5, 7, 9, 11, 13. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-4", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 4, 5, 5, 7, 9 minutes for five sessions. Which value is the mean study time?", "options": ["6.0", "5", "30", "7.5"], "answer": 0, "rationale": "Add all five values: 4 + 5 + 5 + 7 + 9 = 30. Divide by five sessions: 30/5 = 6.0 minutes. 5 is the median, 30 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [4, 5, 5, 7, 9], "min": 3, "max": 10, "xLabel": "Study time (minutes)", "alt": "Dot plot: 4, 5, 5, 7, 9. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-4", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 12, 4, 14, 8, 6, and 10 minutes. What is the median waiting time?", "options": ["9", "8", "10", "54"], "answer": 0, "rationale": "First sort: 4, 6, 8, 10, 12, 14. Six observations give two middle positions, 3 and 4. Average 8 and 10: (8+10)/2 = 9 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [4, 6, 8, 10, 12, 14], "min": 3, "max": 15, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 4, 6, 8, 10, 12, 14. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-5", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 5, 6, 6, 8, 10 minutes for five sessions. Which value is the mean study time?", "options": ["6", "35", "8.75", "7.0"], "answer": 3, "rationale": "Add all five values: 5 + 6 + 6 + 8 + 10 = 35. Divide by five sessions: 35/5 = 7.0 minutes. 6 is the median, 35 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [5, 6, 6, 8, 10], "min": 4, "max": 11, "xLabel": "Study time (minutes)", "alt": "Dot plot: 5, 6, 6, 8, 10. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-5", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 13, 5, 15, 9, 7, and 11 minutes. What is the median waiting time?", "options": ["9", "11", "60", "10"], "answer": 3, "rationale": "First sort: 5, 7, 9, 11, 13, 15. Six observations give two middle positions, 3 and 4. Average 9 and 11: (9+11)/2 = 10 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [5, 7, 9, 11, 13, 15], "min": 4, "max": 16, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 5, 7, 9, 11, 13, 15. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-6", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 6, 7, 7, 9, 11 minutes for five sessions. Which value is the mean study time?", "options": ["40", "10.0", "8.0", "7"], "answer": 2, "rationale": "Add all five values: 6 + 7 + 7 + 9 + 11 = 40. Divide by five sessions: 40/5 = 8.0 minutes. 7 is the median, 40 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [6, 7, 7, 9, 11], "min": 5, "max": 12, "xLabel": "Study time (minutes)", "alt": "Dot plot: 6, 7, 7, 9, 11. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-6", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 14, 6, 16, 10, 8, and 12 minutes. What is the median waiting time?", "options": ["12", "66", "11", "10"], "answer": 2, "rationale": "First sort: 6, 8, 10, 12, 14, 16. Six observations give two middle positions, 3 and 4. Average 10 and 12: (10+12)/2 = 11 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [6, 8, 10, 12, 14, 16], "min": 5, "max": 17, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 6, 8, 10, 12, 14, 16. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-7", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 7, 8, 8, 10, 12 minutes for five sessions. Which value is the mean study time?", "options": ["11.25", "9.0", "8", "45"], "answer": 1, "rationale": "Add all five values: 7 + 8 + 8 + 10 + 12 = 45. Divide by five sessions: 45/5 = 9.0 minutes. 8 is the median, 45 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [7, 8, 8, 10, 12], "min": 6, "max": 13, "xLabel": "Study time (minutes)", "alt": "Dot plot: 7, 8, 8, 10, 12. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-7", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 15, 7, 17, 11, 9, and 13 minutes. What is the median waiting time?", "options": ["72", "12", "11", "13"], "answer": 1, "rationale": "First sort: 7, 9, 11, 13, 15, 17. Six observations give two middle positions, 3 and 4. Average 11 and 13: (11+13)/2 = 12 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [7, 9, 11, 13, 15, 17], "min": 6, "max": 18, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 7, 9, 11, 13, 15, 17. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-8", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student records study times of 8, 9, 9, 11, 13 minutes for five sessions. Which value is the mean study time?", "options": ["10.0", "9", "50", "12.5"], "answer": 0, "rationale": "Add all five values: 8 + 9 + 9 + 11 + 13 = 50. Divide by five sessions: 50/5 = 10.0 minutes. 9 is the median, 50 is the total, and dividing by 4 uses the wrong number of observations. Repeated values each count.", "hint": "Mean means total divided by the number of observations. Count every dot.", "visual": {"type": "dots", "values": [8, 9, 9, 11, 13], "min": 7, "max": 14, "xLabel": "Study time (minutes)", "alt": "Dot plot: 8, 9, 9, 11, 13. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-8", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "A clinic records waiting times of 16, 8, 18, 12, 10, and 14 minutes. What is the median waiting time?", "options": ["13", "12", "14", "78"], "answer": 0, "rationale": "First sort: 8, 10, 12, 14, 16, 18. Six observations give two middle positions, 3 and 4. Average 12 and 14: (12+14)/2 = 13 minutes. Neither middle value alone is the median; adding every value gives a total, not a median.", "hint": "Sort first. With an even number of observations, average the two middle values.", "visual": {"type": "dots", "values": [8, 10, 12, 14, 16, 18], "min": 7, "max": 19, "xLabel": "Waiting time (minutes)", "alt": "Dot plot: 8, 10, 12, 14, 16, 18. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-9", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "The five study times shown have a mean of 3.4 minutes. A sixth session lasting 25 minutes is added. Which statement describes the new mean?", "options": ["It decreases", "It stays the same", "It must equal the median", "It increases"], "answer": 3, "rationale": "The added time (25) exceeds the old mean (3.4), so it pulls the mean upward. New mean = 42/6 = 7. A mean uses every value and is sensitive to unusually large observations.", "hint": "Compare the added value with the old mean.", "visual": {"type": "dots", "values": [2, 3, 3, 4, 5, 25], "min": 1, "max": 26, "xLabel": "Study time (minutes)", "alt": "Dot plot: 2, 3, 3, 4, 5, 25. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-9", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "The dot plot shows five delivery times in minutes. Which summary best describes a typical delivery time when the largest value is unusually high?", "options": ["Mean: 7.6 minutes", "Maximum: 26 minutes", "Total: 38 minutes", "Median: 3 minutes"], "answer": 3, "rationale": "The sorted middle observation is 3. The high outlier pulls the mean to 7.6, so the median better describes the center here. The maximum is an extreme and the total depends on how many deliveries were recorded.", "hint": "Choose a measure of center that resists the unusually high value.", "visual": {"type": "dots", "values": [2, 3, 3, 4, 26], "min": 1, "max": 27, "xLabel": "Delivery time (minutes)", "alt": "Dot plot: 2, 3, 3, 4, 26. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-10", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "The five study times shown have a mean of 4.4 minutes. A sixth session lasting 26 minutes is added. Which statement describes the new mean?", "options": ["It stays the same", "It must equal the median", "It increases", "It decreases"], "answer": 2, "rationale": "The added time (26) exceeds the old mean (4.4), so it pulls the mean upward. New mean = 48/6 = 8. A mean uses every value and is sensitive to unusually large observations.", "hint": "Compare the added value with the old mean.", "visual": {"type": "dots", "values": [3, 4, 4, 5, 6, 26], "min": 2, "max": 27, "xLabel": "Study time (minutes)", "alt": "Dot plot: 3, 4, 4, 5, 6, 26. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-10", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "The dot plot shows five delivery times in minutes. Which summary best describes a typical delivery time when the largest value is unusually high?", "options": ["Maximum: 27 minutes", "Total: 43 minutes", "Median: 4 minutes", "Mean: 8.6 minutes"], "answer": 2, "rationale": "The sorted middle observation is 4. The high outlier pulls the mean to 8.6, so the median better describes the center here. The maximum is an extreme and the total depends on how many deliveries were recorded.", "hint": "Choose a measure of center that resists the unusually high value.", "visual": {"type": "dots", "values": [3, 4, 4, 5, 27], "min": 2, "max": 28, "xLabel": "Delivery time (minutes)", "alt": "Dot plot: 3, 4, 4, 5, 27. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-11", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "The five study times shown have a mean of 5.4 minutes. A sixth session lasting 27 minutes is added. Which statement describes the new mean?", "options": ["It must equal the median", "It increases", "It decreases", "It stays the same"], "answer": 1, "rationale": "The added time (27) exceeds the old mean (5.4), so it pulls the mean upward. New mean = 54/6 = 9. A mean uses every value and is sensitive to unusually large observations.", "hint": "Compare the added value with the old mean.", "visual": {"type": "dots", "values": [4, 5, 5, 6, 7, 27], "min": 3, "max": 28, "xLabel": "Study time (minutes)", "alt": "Dot plot: 4, 5, 5, 6, 7, 27. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-11", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "The dot plot shows five delivery times in minutes. Which summary best describes a typical delivery time when the largest value is unusually high?", "options": ["Total: 48 minutes", "Median: 5 minutes", "Mean: 9.6 minutes", "Maximum: 28 minutes"], "answer": 1, "rationale": "The sorted middle observation is 5. The high outlier pulls the mean to 9.6, so the median better describes the center here. The maximum is an extreme and the total depends on how many deliveries were recorded.", "hint": "Choose a measure of center that resists the unusually high value.", "visual": {"type": "dots", "values": [4, 5, 5, 6, 28], "min": 3, "max": 29, "xLabel": "Delivery time (minutes)", "alt": "Dot plot: 4, 5, 5, 6, 28. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-12", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "The five study times shown have a mean of 6.4 minutes. A sixth session lasting 28 minutes is added. Which statement describes the new mean?", "options": ["It increases", "It decreases", "It stays the same", "It must equal the median"], "answer": 0, "rationale": "The added time (28) exceeds the old mean (6.4), so it pulls the mean upward. New mean = 60/6 = 10. A mean uses every value and is sensitive to unusually large observations.", "hint": "Compare the added value with the old mean.", "visual": {"type": "dots", "values": [5, 6, 6, 7, 8, 28], "min": 4, "max": 29, "xLabel": "Study time (minutes)", "alt": "Dot plot: 5, 6, 6, 7, 8, 28. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-median-12", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "The dot plot shows five delivery times in minutes. Which summary best describes a typical delivery time when the largest value is unusually high?", "options": ["Median: 6 minutes", "Mean: 10.6 minutes", "Maximum: 29 minutes", "Total: 53 minutes"], "answer": 0, "rationale": "The sorted middle observation is 6. The high outlier pulls the mean to 10.6, so the median better describes the center here. The maximum is an extreme and the total depends on how many deliveries were recorded.", "hint": "Choose a measure of center that resists the unusually high value.", "visual": {"type": "dots", "values": [5, 6, 6, 7, 29], "min": 4, "max": 30, "xLabel": "Delivery time (minutes)", "alt": "Dot plot: 5, 6, 6, 7, 29. Each dot is one observation.", "caption": "Each dot represents one observation; stacked dots show repeated values"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-1", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 4 online learners and 6 in-person learners. What is the ratio of online to in-person learners in simplest form?", "options": ["2:5", "3:2", "5:2", "2:3"], "answer": 3, "rationale": "Online:in person is 4:6. Divide both counts by their greatest common factor, 2, to get 2:3. Keep the requested order. Online:all compares a different pair; reversing the ratio compares in person with online.", "hint": "Identify the first and second groups before simplifying.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 4], ["In person", 6], ["Total", 10]], "alt": "Enrollment counts: Online 4; In person 6; Total 10.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-2", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 6 online learners and 9 in-person learners. What proportion of all learners study online?", "options": ["3/5", "5/2", "2/5", "2/3"], "answer": 2, "rationale": "All learners = 6+9 = 15. Online/all = 6/15 = 2/5. Online/in person uses the wrong denominator; in person/all answers the opposite group; all/online reverses the requested proportion.", "hint": "A proportion uses the part divided by the whole.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 6], ["In person", 9], ["Total", 15]], "alt": "Enrollment counts: Online 6; In person 9; Total 15.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-3", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A student answers 5 practice questions in 30 minutes at a constant rate. How many minutes per question is this?", "options": ["1/6 minute per question", "6 minutes per question", "30 minutes per question", "5 minutes per question"], "answer": 1, "rationale": "Divide minutes by questions: 30/5 = 6 minutes/question. Reversing the division gives questions per minute, the wrong unit. Total minutes and total questions are not unit rates.", "hint": "Check the units: minutes \u00f7 questions.", "visual": {"type": "table", "headers": ["Questions", "Minutes"], "rows": [[5, 30]], "alt": "Practice rate: 5, 30", "caption": "Practice rate"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-4", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 2 online learners and 6 in-person learners. What is the ratio of online to in-person learners in simplest form?", "options": ["1:3", "1:4", "3:1", "4:1"], "answer": 0, "rationale": "Online:in person is 2:6. Divide both counts by their greatest common factor, 2, to get 1:3. Keep the requested order. Online:all compares a different pair; reversing the ratio compares in person with online.", "hint": "Identify the first and second groups before simplifying.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 2], ["In person", 6], ["Total", 8]], "alt": "Enrollment counts: Online 2; In person 6; Total 8.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-5", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 4 online learners and 9 in-person learners. What proportion of all learners study online?", "options": ["4/9", "9/13", "13/4", "4/13"], "answer": 3, "rationale": "All learners = 4+9 = 13. Online/all = 4/13 = 4/13. Online/in person uses the wrong denominator; in person/all answers the opposite group; all/online reverses the requested proportion.", "hint": "A proportion uses the part divided by the whole.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 4], ["In person", 9], ["Total", 13]], "alt": "Enrollment counts: Online 4; In person 9; Total 13.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-6", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A student answers 8 practice questions in 32 minutes at a constant rate. How many minutes per question is this?", "options": ["8 minutes per question", "1/4 minute per question", "4 minutes per question", "32 minutes per question"], "answer": 2, "rationale": "Divide minutes by questions: 32/8 = 4 minutes/question. Reversing the division gives questions per minute, the wrong unit. Total minutes and total questions are not unit rates.", "hint": "Check the units: minutes \u00f7 questions.", "visual": {"type": "table", "headers": ["Questions", "Minutes"], "rows": [[8, 32]], "alt": "Practice rate: 8, 48", "caption": "Practice rate"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-7", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 8 online learners and 6 in-person learners. What is the ratio of online to in-person learners in simplest form?", "options": ["7:4", "4:3", "4:7", "3:4"], "answer": 1, "rationale": "Online:in person is 8:6. Divide both counts by their greatest common factor, 2, to get 4:3. Keep the requested order. Online:all compares a different pair; reversing the ratio compares in person with online.", "hint": "Identify the first and second groups before simplifying.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 8], ["In person", 6], ["Total", 14]], "alt": "Enrollment counts: Online 8; In person 6; Total 14.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-8", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 2 online learners and 9 in-person learners. What proportion of all learners study online?", "options": ["2/11", "2/9", "9/11", "11/2"], "answer": 0, "rationale": "All learners = 2+9 = 11. Online/all = 2/11 = 2/11. Online/in person uses the wrong denominator; in person/all answers the opposite group; all/online reverses the requested proportion.", "hint": "A proportion uses the part divided by the whole.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 2], ["In person", 9], ["Total", 11]], "alt": "Enrollment counts: Online 2; In person 9; Total 11.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-9", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A student answers 11 practice questions in 77 minutes at a constant rate. How many minutes per question is this?", "options": ["77 minutes per question", "11 minutes per question", "1/7 minute per question", "7 minutes per question"], "answer": 3, "rationale": "Divide minutes by questions: 77/11 = 7 minutes/question. Reversing the division gives questions per minute, the wrong unit. Total minutes and total questions are not unit rates.", "hint": "Check the units: minutes \u00f7 questions.", "visual": {"type": "table", "headers": ["Questions", "Minutes"], "rows": [[11, 77]], "alt": "Practice rate: 11, 66", "caption": "Practice rate"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-10", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 6 online learners and 6 in-person learners. What is the ratio of online to in-person learners in simplest form?", "options": ["2:1", "0", "1:1", "1:2"], "answer": 2, "rationale": "Online:in person is 6:6. Divide both counts by their greatest common factor, 6, to get 1:1. Keep the requested order. Online:all compares a different pair; reversing the ratio compares in person with online.", "hint": "Identify the first and second groups before simplifying.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 6], ["In person", 6], ["Total", 12]], "alt": "Enrollment counts: Online 6; In person 6; Total 12.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-11", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A training program has 8 online learners and 9 in-person learners. What proportion of all learners study online?", "options": ["17/8", "8/17", "8/9", "9/17"], "answer": 1, "rationale": "All learners = 8+9 = 17. Online/all = 8/17 = 8/17. Online/in person uses the wrong denominator; in person/all answers the opposite group; all/online reverses the requested proportion.", "hint": "A proportion uses the part divided by the whole.", "visual": {"type": "table", "headers": ["Group", "Count"], "rows": [["Online", 8], ["In person", 9], ["Total", 17]], "alt": "Enrollment counts: Online 8; In person 9; Total 17.", "caption": "Enrollment counts"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-ratio-12", "lessonId": "d772-s2-l4-ratios", "learningPathLessonId": "d772-s2-l4-ratios", "topicId": "d772-s2-l4-ratios", "skill": "ratio", "prompt": "A student answers 14 practice questions in 70 minutes at a constant rate. How many minutes per question is this?", "options": ["5 minutes per question", "70 minutes per question", "14 minutes per question", "1/5 minute per question"], "answer": 0, "rationale": "Divide minutes by questions: 70/14 = 5 minutes/question. Reversing the division gives questions per minute, the wrong unit. Total minutes and total questions are not unit rates.", "hint": "Check the units: minutes \u00f7 questions.", "visual": {"type": "table", "headers": ["Questions", "Minutes"], "rows": [[14, 70]], "alt": "Practice rate: 14, 84", "caption": "Practice rate"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-1", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 2 red and 8 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["4/5", "1/4", "1/10", "1/5"], "answer": 3, "rationale": "There are 2 favorable tokens out of 2+8=10 total tokens. P(red) = 2/10 = 1/5. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [2, 8], "labels": ["Red", "Green"], "alt": "2 red tokens and 8 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-2", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 3 red and 7 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["3/7", "1/3", "3/10", "7/10"], "answer": 2, "rationale": "There are 3 favorable tokens out of 3+7=10 total tokens. P(red) = 3/10 = 3/10. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [3, 7], "labels": ["Red", "Green"], "alt": "3 red tokens and 7 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-3", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 4 red and 6 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["1/4", "2/5", "3/5", "2/3"], "answer": 1, "rationale": "There are 4 favorable tokens out of 4+6=10 total tokens. P(red) = 4/10 = 2/5. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [4, 6], "labels": ["Red", "Green"], "alt": "4 red tokens and 6 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-4", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 5 red and 5 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["1/2", "1", "1/5", "0"], "answer": 0, "rationale": "There are 5 favorable tokens out of 5+5=10 total tokens. P(red) = 5/10 = 1/2. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [5, 5], "labels": ["Red", "Green"], "alt": "5 red tokens and 5 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-5", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 6 red and 4 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["2/5", "3/2", "1/6", "3/5"], "answer": 3, "rationale": "There are 6 favorable tokens out of 6+4=10 total tokens. P(red) = 6/10 = 3/5. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [6, 4], "labels": ["Red", "Green"], "alt": "6 red tokens and 4 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-6", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 7 red and 3 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["7/3", "1/7", "7/10", "3/10"], "answer": 2, "rationale": "There are 7 favorable tokens out of 7+3=10 total tokens. P(red) = 7/10 = 7/10. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [7, 3], "labels": ["Red", "Green"], "alt": "7 red tokens and 3 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-7", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 8 red and 2 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["1/8", "4/5", "1/5", "4"], "answer": 1, "rationale": "There are 8 favorable tokens out of 8+2=10 total tokens. P(red) = 8/10 = 4/5. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [8, 2], "labels": ["Red", "Green"], "alt": "8 red tokens and 2 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-8", "lessonId": "d772-s3-l1-2", "learningPathLessonId": "d772-s3-l1-2", "topicId": "d772-s3-l1-2", "skill": "probability", "prompt": "A bag contains 9 red and 1 green tokens. One token is selected at random, with each token equally likely. What is the probability of selecting a red token?", "options": ["9/10", "1/10", "9", "1/9"], "answer": 0, "rationale": "There are 9 favorable tokens out of 9+1=10 total tokens. P(red) = 9/10 = 9/10. Use all tokens in the denominator. Green/10 answers a different event, and red/green is a part-to-part ratio rather than this probability.", "hint": "Probability = favorable equally likely outcomes \u00f7 all equally likely outcomes.", "visual": {"type": "tokens", "values": [9, 1], "labels": ["Red", "Green"], "alt": "9 red tokens and 1 green tokens. Ten tokens total.", "caption": "One token is drawn uniformly; each token is equally likely"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-9", "lessonId": "d772-s3-l1-3", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3", "skill": "probability", "prompt": "A quality inspector observes 12 defective parts among 48 inspected parts. Based on these observations, what is the empirical probability that a part is defective?", "options": ["0.75", "4", "0.12", "0.25"], "answer": 3, "rationale": "Empirical probability uses observed counts: 12/48 = 0.25, or 25%. 0.75 is the probability of a nondefective part. 4 reverses the fraction, and dividing by 100 assumes an unstated total.", "hint": "Use observed defects divided by all inspected parts.", "visual": {"type": "table", "headers": ["Observed result", "Count"], "rows": [["Defective", 12], ["Nondefective", 36], ["Total inspected", 48]], "alt": "Inspection results: Defective, 12; Nondefective, 36; Total inspected, 48", "caption": "Inspection results"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-10", "lessonId": "d772-s3-l1-3", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3", "skill": "probability", "prompt": "A quality inspector observes 13 defective parts among 52 inspected parts. Based on these observations, what is the empirical probability that a part is defective?", "options": ["4", "0.13", "0.25", "0.75"], "answer": 2, "rationale": "Empirical probability uses observed counts: 13/52 = 0.25, or 25%. 0.75 is the probability of a nondefective part. 4 reverses the fraction, and dividing by 100 assumes an unstated total.", "hint": "Use observed defects divided by all inspected parts.", "visual": {"type": "table", "headers": ["Observed result", "Count"], "rows": [["Defective", 13], ["Nondefective", 39], ["Total inspected", 52]], "alt": "Inspection results: Defective, 13; Nondefective, 39; Total inspected, 52", "caption": "Inspection results"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-11", "lessonId": "d772-s3-l1-3", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3", "skill": "probability", "prompt": "A quality inspector observes 14 defective parts among 56 inspected parts. Based on these observations, what is the empirical probability that a part is defective?", "options": ["0.14", "0.25", "0.75", "4"], "answer": 1, "rationale": "Empirical probability uses observed counts: 14/56 = 0.25, or 25%. 0.75 is the probability of a nondefective part. 4 reverses the fraction, and dividing by 100 assumes an unstated total.", "hint": "Use observed defects divided by all inspected parts.", "visual": {"type": "table", "headers": ["Observed result", "Count"], "rows": [["Defective", 14], ["Nondefective", 42], ["Total inspected", 56]], "alt": "Inspection results: Defective, 14; Nondefective, 42; Total inspected, 56", "caption": "Inspection results"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-12", "lessonId": "d772-s3-l1-3", "learningPathLessonId": "d772-s3-l1-3", "topicId": "d772-s3-l1-3", "skill": "probability", "prompt": "A quality inspector observes 15 defective parts among 60 inspected parts. Based on these observations, what is the empirical probability that a part is defective?", "options": ["0.25", "0.75", "4", "0.15"], "answer": 0, "rationale": "Empirical probability uses observed counts: 15/60 = 0.25, or 25%. 0.75 is the probability of a nondefective part. 4 reverses the fraction, and dividing by 100 assumes an unstated total.", "hint": "Use observed defects divided by all inspected parts.", "visual": {"type": "table", "headers": ["Observed result", "Count"], "rows": [["Defective", 15], ["Nondefective", 45], ["Total inspected", 60]], "alt": "Inspection results: Defective, 15; Nondefective, 45; Total inspected, 60", "caption": "Inspection results"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-13", "lessonId": "d772-s3-l3-2", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2", "skill": "probability", "prompt": "One of the 25 students shown is selected uniformly. What is the probability that the student belongs to the math club OR the science club, including students in both clubs?", "options": ["4/5", "4/25", "12/25", "16/25"], "answer": 3, "rationale": "The union includes math only (5), both (4), and science only (7). Count 5+4+7=16, then divide by all 25 students: 16/25. Adding both complete club totals double-counts the overlap; using only 4 gives AND; excluding both misses the inclusive OR.", "hint": "OR means either club or both. Count each student once.", "visual": {"type": "venn", "labels": ["Math club", "Science club"], "values": [5, 4, 7, 9], "alt": "Venn diagram: math only 5, both 4, science only 7, neither 9. Total 25.", "caption": "Four disjoint regions; count the overlap only once"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-14", "lessonId": "d772-s3-l3-2", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2", "skill": "probability", "prompt": "One of the 26 students shown is selected uniformly. What is the probability that the student belongs to the math club OR the science club, including students in both clubs?", "options": ["2/13", "1/2", "17/26", "21/26"], "answer": 2, "rationale": "The union includes math only (6), both (4), and science only (7). Count 6+4+7=17, then divide by all 26 students: 17/26. Adding both complete club totals double-counts the overlap; using only 4 gives AND; excluding both misses the inclusive OR.", "hint": "OR means either club or both. Count each student once.", "visual": {"type": "venn", "labels": ["Math club", "Science club"], "values": [6, 4, 7, 9], "alt": "Venn diagram: math only 6, both 4, science only 7, neither 9. Total 26.", "caption": "Four disjoint regions; count the overlap only once"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-15", "lessonId": "d772-s3-l3-2", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2", "skill": "probability", "prompt": "One of the 27 students shown is selected uniformly. What is the probability that the student belongs to the math club OR the science club, including students in both clubs?", "options": ["14/27", "2/3", "22/27", "4/27"], "answer": 1, "rationale": "The union includes math only (7), both (4), and science only (7). Count 7+4+7=18, then divide by all 27 students: 2/3. Adding both complete club totals double-counts the overlap; using only 4 gives AND; excluding both misses the inclusive OR.", "hint": "OR means either club or both. Count each student once.", "visual": {"type": "venn", "labels": ["Math club", "Science club"], "values": [7, 4, 7, 9], "alt": "Venn diagram: math only 7, both 4, science only 7, neither 9. Total 27.", "caption": "Four disjoint regions; count the overlap only once"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-16", "lessonId": "d772-s3-l3-2", "learningPathLessonId": "d772-s3-l3-2", "topicId": "d772-s3-l3-2", "skill": "probability", "prompt": "One of the 28 students shown is selected uniformly. What is the probability that the student belongs to the math club OR the science club, including students in both clubs?", "options": ["19/28", "23/28", "1/7", "15/28"], "answer": 0, "rationale": "The union includes math only (8), both (4), and science only (7). Count 8+4+7=19, then divide by all 28 students: 19/28. Adding both complete club totals double-counts the overlap; using only 4 gives AND; excluding both misses the inclusive OR.", "hint": "OR means either club or both. Count each student once.", "visual": {"type": "venn", "labels": ["Math club", "Science club"], "values": [8, 4, 7, 9], "alt": "Venn diagram: math only 8, both 4, science only 7, neither 9. Total 28.", "caption": "Four disjoint regions; count the overlap only once"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-17", "lessonId": "d772-s3-l3-3", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3", "skill": "probability", "prompt": "A bag contains 5 red and 4 green tokens. Two tokens are drawn without replacement. What is the probability that BOTH are red?", "options": ["25/81", "5/9", "1/2", "5/18"], "answer": 3, "rationale": "First red: 5/9. If that happens, 4 red remain among 8 tokens. Multiply: (5/9)\u00d7(4/8) = 5/18. Squaring the first fraction assumes replacement/independence. Each single fraction covers only one draw.", "hint": "Without replacement changes both the favorable count and the total on the second draw.", "visual": {"type": "table", "headers": ["Draw", "Red remaining", "Total remaining"], "rows": [["Before first draw", 5, 9], ["After first red is kept", 4, 8]], "alt": "Two draws without replacement: Before first draw, 5, 9; After first red is kept, 4, 8", "caption": "Two draws without replacement"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-18", "lessonId": "d772-s3-l3-3", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3", "skill": "probability", "prompt": "A bag contains 6 red and 4 green tokens. Two tokens are drawn without replacement. What is the probability that BOTH are red?", "options": ["3/5", "5/9", "1/3", "9/25"], "answer": 2, "rationale": "First red: 6/10. If that happens, 5 red remain among 9 tokens. Multiply: (6/10)\u00d7(5/9) = 1/3. Squaring the first fraction assumes replacement/independence. Each single fraction covers only one draw.", "hint": "Without replacement changes both the favorable count and the total on the second draw.", "visual": {"type": "table", "headers": ["Draw", "Red remaining", "Total remaining"], "rows": [["Before first draw", 6, 10], ["After first red is kept", 5, 9]], "alt": "Two draws without replacement: Before first draw, 6, 10; After first red is kept, 5, 9", "caption": "Two draws without replacement"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-19", "lessonId": "d772-s3-l3-3", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3", "skill": "probability", "prompt": "A bag contains 7 red and 4 green tokens. Two tokens are drawn without replacement. What is the probability that BOTH are red?", "options": ["3/5", "21/55", "49/121", "7/11"], "answer": 1, "rationale": "First red: 7/11. If that happens, 6 red remain among 10 tokens. Multiply: (7/11)\u00d7(6/10) = 21/55. Squaring the first fraction assumes replacement/independence. Each single fraction covers only one draw.", "hint": "Without replacement changes both the favorable count and the total on the second draw.", "visual": {"type": "table", "headers": ["Draw", "Red remaining", "Total remaining"], "rows": [["Before first draw", 7, 11], ["After first red is kept", 6, 10]], "alt": "Two draws without replacement: Before first draw, 7, 11; After first red is kept, 6, 10", "caption": "Two draws without replacement"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-probability-20", "lessonId": "d772-s3-l3-3", "learningPathLessonId": "d772-s3-l3-3", "topicId": "d772-s3-l3-3", "skill": "probability", "prompt": "A bag contains 8 red and 4 green tokens. Two tokens are drawn without replacement. What is the probability that BOTH are red?", "options": ["14/33", "4/9", "2/3", "7/11"], "answer": 0, "rationale": "First red: 8/12. If that happens, 7 red remain among 11 tokens. Multiply: (8/12)\u00d7(7/11) = 14/33. Squaring the first fraction assumes replacement/independence. Each single fraction covers only one draw.", "hint": "Without replacement changes both the favorable count and the total on the second draw.", "visual": {"type": "table", "headers": ["Draw", "Red remaining", "Total remaining"], "rows": [["Before first draw", 8, 12], ["After first red is kept", 7, 11]], "alt": "Two draws without replacement: Before first draw, 8, 12; After first red is kept, 7, 11", "caption": "Two draws without replacement"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE"}, {"id": "hub-mean-13", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student\u2019s mean score across four practice checks is 5. Three scores are 3, 5, 6. What is the missing fourth score?", "rationale": "A mean of 5 across four scores requires a total of 5\u00d74=20. The known scores total 14. Missing score = 20\u221214=6. The mean itself is not necessarily the missing observation; use the required total.", "hint": "Mean \u00d7 count gives the required total. Subtract the known values.", "visual": {"type": "table", "headers": ["Check", "Score"], "rows": [["1", 3], ["2", 5], ["3", 6], ["4", "?"]], "caption": "Mean of all four scores: 5", "alt": "Mean of all four scores: 5: 1, 3; 2, 5; 3, 6; 4, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["5", "20", "14", "6"], "answer": 3}, {"id": "hub-median-13", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "Five students report 11, 3, 8, 4, and 6 completed lessons. What is the median number of completed lessons?", "rationale": "Sort the observations: 3, 4, 6, 8, 11. Five values have one middle position: (5+1)/2=3. The third value is 6. Use an observation\u2019s position after sorting, rather than averaging the adjacent values or summing the whole set.", "hint": "For an odd count, the median is the single middle observation after sorting.", "visual": {"type": "dots", "values": [3, 4, 6, 8, 11], "min": 2, "max": 12, "xLabel": "Completed lessons", "alt": "Dot plot: 3, 4, 6, 8, 11. Five observations.", "caption": "Each dot is one student\u2019s count"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["4", "8", "32", "6"], "answer": 3}, {"id": "hub-mean-14", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student\u2019s mean score across four practice checks is 6. Three scores are 4, 6, 7. What is the missing fourth score?", "rationale": "A mean of 6 across four scores requires a total of 6\u00d74=24. The known scores total 17. Missing score = 24\u221217=7. The mean itself is not necessarily the missing observation; use the required total.", "hint": "Mean \u00d7 count gives the required total. Subtract the known values.", "visual": {"type": "table", "headers": ["Check", "Score"], "rows": [["1", 4], ["2", 6], ["3", 7], ["4", "?"]], "caption": "Mean of all four scores: 6", "alt": "Mean of all four scores: 6: 1, 4; 2, 6; 3, 7; 4, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["24", "17", "7", "6"], "answer": 2}, {"id": "hub-median-14", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "Five students report 12, 4, 9, 5, and 7 completed lessons. What is the median number of completed lessons?", "rationale": "Sort the observations: 4, 5, 7, 9, 12. Five values have one middle position: (5+1)/2=3. The third value is 7. Use an observation\u2019s position after sorting, rather than averaging the adjacent values or summing the whole set.", "hint": "For an odd count, the median is the single middle observation after sorting.", "visual": {"type": "dots", "values": [4, 5, 7, 9, 12], "min": 3, "max": 13, "xLabel": "Completed lessons", "alt": "Dot plot: 4, 5, 7, 9, 12. Five observations.", "caption": "Each dot is one student\u2019s count"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["9", "37", "7", "5"], "answer": 2}, {"id": "hub-mean-15", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student\u2019s mean score across four practice checks is 7. Three scores are 5, 7, 8. What is the missing fourth score?", "rationale": "A mean of 7 across four scores requires a total of 7\u00d74=28. The known scores total 20. Missing score = 28\u221220=8. The mean itself is not necessarily the missing observation; use the required total.", "hint": "Mean \u00d7 count gives the required total. Subtract the known values.", "visual": {"type": "table", "headers": ["Check", "Score"], "rows": [["1", 5], ["2", 7], ["3", 8], ["4", "?"]], "caption": "Mean of all four scores: 7", "alt": "Mean of all four scores: 7: 1, 5; 2, 7; 3, 8; 4, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["20", "8", "7", "28"], "answer": 1}, {"id": "hub-median-15", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "Five students report 13, 5, 10, 6, and 8 completed lessons. What is the median number of completed lessons?", "rationale": "Sort the observations: 5, 6, 8, 10, 13. Five values have one middle position: (5+1)/2=3. The third value is 8. Use an observation\u2019s position after sorting, rather than averaging the adjacent values or summing the whole set.", "hint": "For an odd count, the median is the single middle observation after sorting.", "visual": {"type": "dots", "values": [5, 6, 8, 10, 13], "min": 4, "max": 14, "xLabel": "Completed lessons", "alt": "Dot plot: 5, 6, 8, 10, 13. Five observations.", "caption": "Each dot is one student\u2019s count"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["42", "8", "6", "10"], "answer": 1}, {"id": "hub-mean-16", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "mean", "prompt": "A student\u2019s mean score across four practice checks is 8. Three scores are 6, 8, 9. What is the missing fourth score?", "rationale": "A mean of 8 across four scores requires a total of 8\u00d74=32. The known scores total 23. Missing score = 32\u221223=9. The mean itself is not necessarily the missing observation; use the required total.", "hint": "Mean \u00d7 count gives the required total. Subtract the known values.", "visual": {"type": "table", "headers": ["Check", "Score"], "rows": [["1", 6], ["2", 8], ["3", 9], ["4", "?"]], "caption": "Mean of all four scores: 8", "alt": "Mean of all four scores: 8: 1, 6; 2, 8; 3, 9; 4, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["9", "8", "32", "23"], "answer": 0}, {"id": "hub-median-16", "lessonId": "d772-s2-l4-1", "learningPathLessonId": "d772-s2-l4-1", "topicId": "d772-s2-l4-1", "skill": "median", "prompt": "Five students report 14, 6, 11, 7, and 9 completed lessons. What is the median number of completed lessons?", "rationale": "Sort the observations: 6, 7, 9, 11, 14. Five values have one middle position: (5+1)/2=3. The third value is 9. Use an observation\u2019s position after sorting, rather than averaging the adjacent values or summing the whole set.", "hint": "For an odd count, the median is the single middle observation after sorting.", "visual": {"type": "dots", "values": [6, 7, 9, 11, 14], "min": 5, "max": 15, "xLabel": "Completed lessons", "alt": "Dot plot: 6, 7, 9, 11, 14. Five observations.", "caption": "Each dot is one student\u2019s count"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["9", "7", "11", "47"], "answer": 0}, {"id": "hub-probability-21", "lessonId": "d772-s3-l3-4", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4", "skill": "probability", "prompt": "A machine\u2019s probability of producing a defective part is 1/5. What is the probability that the next part is NOT defective?", "rationale": "Defective and not defective are complements, so their probabilities total 1. P(not defective)=1\u22121/5=4/5. Repeating the defect probability answers the wrong event; adding or taking a reciprocal does not form a complement.", "hint": "NOT indicates the complement: subtract the event probability from 1.", "visual": {"type": "table", "headers": ["Event", "Probability"], "rows": [["Defective", "1/5"], ["Not defective", "?"]], "caption": "Complementary events", "alt": "Complementary events: Defective, 1/5; Not defective, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["1/5", "6/5", "5", "4/5"], "answer": 3}, {"id": "hub-probability-22", "lessonId": "d772-s3-l3-4", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4", "skill": "probability", "prompt": "A machine\u2019s probability of producing a defective part is 3/10. What is the probability that the next part is NOT defective?", "rationale": "Defective and not defective are complements, so their probabilities total 1. P(not defective)=1\u22123/10=7/10. Repeating the defect probability answers the wrong event; adding or taking a reciprocal does not form a complement.", "hint": "NOT indicates the complement: subtract the event probability from 1.", "visual": {"type": "table", "headers": ["Event", "Probability"], "rows": [["Defective", "3/10"], ["Not defective", "?"]], "caption": "Complementary events", "alt": "Complementary events: Defective, 3/10; Not defective, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["13/10", "10/3", "7/10", "3/10"], "answer": 2}, {"id": "hub-probability-23", "lessonId": "d772-s3-l3-4", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4", "skill": "probability", "prompt": "A machine\u2019s probability of producing a defective part is 2/5. What is the probability that the next part is NOT defective?", "rationale": "Defective and not defective are complements, so their probabilities total 1. P(not defective)=1\u22122/5=3/5. Repeating the defect probability answers the wrong event; adding or taking a reciprocal does not form a complement.", "hint": "NOT indicates the complement: subtract the event probability from 1.", "visual": {"type": "table", "headers": ["Event", "Probability"], "rows": [["Defective", "2/5"], ["Not defective", "?"]], "caption": "Complementary events", "alt": "Complementary events: Defective, 2/5; Not defective, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["5/2", "3/5", "2/5", "7/5"], "answer": 1}, {"id": "hub-probability-24", "lessonId": "d772-s3-l3-4", "learningPathLessonId": "d772-s3-l3-4", "topicId": "d772-s3-l3-4", "skill": "probability", "prompt": "A machine\u2019s probability of producing a defective part is 1/2. What is the probability that the next part is NOT defective?", "rationale": "Defective and not defective are complements, so their probabilities total 1. P(not defective)=1\u22121/2=1/2. Repeating the defect probability answers the wrong event; adding or taking a reciprocal does not form a complement.", "hint": "NOT indicates the complement: subtract the event probability from 1.", "visual": {"type": "table", "headers": ["Event", "Probability"], "rows": [["Defective", "1/2"], ["Not defective", "?"]], "caption": "Complementary events", "alt": "Complementary events: Defective, 1/2; Not defective, ?"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["1/2", "3/2", "2", "0"], "answer": 0}, {"id": "hub-probability-25", "lessonId": "d772-s3-l2-1", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1", "skill": "probability", "prompt": "Two learners work independently. The probability that the first completes a lesson today is 1/2, and the probability that the second does is 1/5. What is the probability that BOTH complete the lesson?", "rationale": "Independence allows multiplication: P(both)=(1/2)\u00d7(1/5)=1/10. Adding probabilities does not calculate this AND event. Either single probability describes only one learner. Without independence, the second probability would need to be conditioned on the first event.", "hint": "BOTH means AND. Independence is the condition that lets you multiply the two individual probabilities.", "visual": {"type": "table", "headers": ["Learner", "Completion probability"], "rows": [["First", "1/2"], ["Second", "1/5"]], "caption": "Independent completion events", "alt": "Independent completion events: First, 1/2; Second, 1/5"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["7/10", "1/5", "1/2", "1/10"], "answer": 3}, {"id": "hub-probability-26", "lessonId": "d772-s3-l2-1", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1", "skill": "probability", "prompt": "Two learners work independently. The probability that the first completes a lesson today is 1/2, and the probability that the second does is 3/10. What is the probability that BOTH complete the lesson?", "rationale": "Independence allows multiplication: P(both)=(1/2)\u00d7(3/10)=3/20. Adding probabilities does not calculate this AND event. Either single probability describes only one learner. Without independence, the second probability would need to be conditioned on the first event.", "hint": "BOTH means AND. Independence is the condition that lets you multiply the two individual probabilities.", "visual": {"type": "table", "headers": ["Learner", "Completion probability"], "rows": [["First", "1/2"], ["Second", "3/10"]], "caption": "Independent completion events", "alt": "Independent completion events: First, 1/2; Second, 3/10"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["3/10", "1/2", "3/20", "4/5"], "answer": 2}, {"id": "hub-probability-27", "lessonId": "d772-s3-l2-1", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1", "skill": "probability", "prompt": "Two learners work independently. The probability that the first completes a lesson today is 1/2, and the probability that the second does is 2/5. What is the probability that BOTH complete the lesson?", "rationale": "Independence allows multiplication: P(both)=(1/2)\u00d7(2/5)=1/5. Adding probabilities does not calculate this AND event. Either single probability describes only one learner. Without independence, the second probability would need to be conditioned on the first event.", "hint": "BOTH means AND. Independence is the condition that lets you multiply the two individual probabilities.", "visual": {"type": "table", "headers": ["Learner", "Completion probability"], "rows": [["First", "1/2"], ["Second", "2/5"]], "caption": "Independent completion events", "alt": "Independent completion events: First, 1/2; Second, 2/5"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["1/2", "1/5", "9/10", "2/5"], "answer": 1}, {"id": "hub-probability-28", "lessonId": "d772-s3-l2-1", "learningPathLessonId": "d772-s3-l2-1", "topicId": "d772-s3-l2-1", "skill": "probability", "prompt": "Two learners work independently. The probability that the first completes a lesson today is 1/2, and the probability that the second does is 1/2. What is the probability that BOTH complete the lesson?", "rationale": "Independence allows multiplication: P(both)=(1/2)\u00d7(1/2)=1/4. Adding probabilities does not calculate this AND event. Either single probability describes only one learner. Without independence, the second probability would need to be conditioned on the first event.", "hint": "BOTH means AND. Independence is the condition that lets you multiply the two individual probabilities.", "visual": {"type": "table", "headers": ["Learner", "Completion probability"], "rows": [["First", "1/2"], ["Second", "1/2"]], "caption": "Independent completion events", "alt": "Independent completion events: First, 1/2; Second, 1/2"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["1/4", "1", "1/2", "0"], "answer": 0}, {"id": "hub-probability-29", "lessonId": "d772-s3-l4-1", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1", "skill": "probability", "prompt": "A game pays $12 with probability 1/4 and $0 with probability 3/4. It costs $2 to play once. What is the expected NET gain per play?", "rationale": "Expected payout = (12\u00d71/4)+(0\u00d73/4)=$3. Subtract the $2 cost: expected net gain = $1. Gross expected payout ignores the fee; the winning net outcome is not an average; an unweighted mean treats unequal probabilities as equal. Expected value describes a long-run average, not a guaranteed single outcome.", "hint": "Multiply each payout by its probability, add, then subtract the cost once.", "visual": {"type": "table", "headers": ["Payout", "Probability"], "rows": [["$12", "1/4"], ["$0", "3/4"]], "caption": "Payout distribution; cost $2 per play", "alt": "Payout distribution; cost $2 per play: $12, 1/4; $0, 3/4"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["$3", "$10", "$4", "$1"], "answer": 3}, {"id": "hub-probability-30", "lessonId": "d772-s3-l4-1", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1", "skill": "probability", "prompt": "A game pays $16 with probability 1/4 and $0 with probability 3/4. It costs $2 to play once. What is the expected NET gain per play?", "rationale": "Expected payout = (16\u00d71/4)+(0\u00d73/4)=$4. Subtract the $2 cost: expected net gain = $2. Gross expected payout ignores the fee; the winning net outcome is not an average; an unweighted mean treats unequal probabilities as equal. Expected value describes a long-run average, not a guaranteed single outcome.", "hint": "Multiply each payout by its probability, add, then subtract the cost once.", "visual": {"type": "table", "headers": ["Payout", "Probability"], "rows": [["$16", "1/4"], ["$0", "3/4"]], "caption": "Payout distribution; cost $2 per play", "alt": "Payout distribution; cost $2 per play: $16, 1/4; $0, 3/4"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["$14", "$6", "$2", "$4"], "answer": 2}, {"id": "hub-probability-31", "lessonId": "d772-s3-l4-1", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1", "skill": "probability", "prompt": "A game pays $20 with probability 1/4 and $0 with probability 3/4. It costs $2 to play once. What is the expected NET gain per play?", "rationale": "Expected payout = (20\u00d71/4)+(0\u00d73/4)=$5. Subtract the $2 cost: expected net gain = $3. Gross expected payout ignores the fee; the winning net outcome is not an average; an unweighted mean treats unequal probabilities as equal. Expected value describes a long-run average, not a guaranteed single outcome.", "hint": "Multiply each payout by its probability, add, then subtract the cost once.", "visual": {"type": "table", "headers": ["Payout", "Probability"], "rows": [["$20", "1/4"], ["$0", "3/4"]], "caption": "Payout distribution; cost $2 per play", "alt": "Payout distribution; cost $2 per play: $20, 1/4; $0, 3/4"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["$8", "$3", "$5", "$18"], "answer": 1}, {"id": "hub-probability-32", "lessonId": "d772-s3-l4-1", "learningPathLessonId": "d772-s3-l4-1", "topicId": "d772-s3-l4-1", "skill": "probability", "prompt": "A game pays $24 with probability 1/4 and $0 with probability 3/4. It costs $2 to play once. What is the expected NET gain per play?", "rationale": "Expected payout = (24\u00d71/4)+(0\u00d73/4)=$6. Subtract the $2 cost: expected net gain = $4. Gross expected payout ignores the fee; the winning net outcome is not an average; an unweighted mean treats unequal probabilities as equal. Expected value describes a long-run average, not a guaranteed single outcome.", "hint": "Multiply each payout by its probability, add, then subtract the cost once.", "visual": {"type": "table", "headers": ["Payout", "Probability"], "rows": [["$24", "1/4"], ["$0", "3/4"]], "caption": "Payout distribution; cost $2 per play", "alt": "Payout distribution; cost $2 per play: $24, 1/4; $0, 3/4"}, "sourceLabel": "MAJICK ORIGINAL \u00b7 WGU-STYLE SKILL PRACTICE", "options": ["$4", "$6", "$22", "$10"], "answer": 0}];
const ratioUnit={id:'d772-s2-l4-ratios',number:'4.R',unitType:'lesson',title:'Ratios, Proportions and Unit Rates',goal:'Distinguish part-to-part ratios from part-to-whole proportions and keep the requested units.',thinking:['Which groups are compared?','What is the whole?','Which unit belongs on top?'],traps:['Using the second group as the denominator when the question asks for all.','Reversing the ratio or units.']};
D772_SECTION_TWO.lessons.find(l=>l.id==='d772-s2-l4').sublessons.push(ratioUnit);
D772_SECTION_TWO_CONTENT[ratioUnit.id]={sourceLabel:'MAJICK ORIGINAL · TARGETED SKILL LESSON',overview:ratioUnit.goal,objectives:ratioUnit.thinking,teach:[{title:'Ratios compare two named quantities',text:'A ratio of 4 red to 6 green is 4:6 = 2:3. Divide both quantities by the same nonzero factor. Reversing the order gives a different ratio.'},{title:'A proportion compares a part with the whole',text:'Four red and six green give ten total. Red/all = 4/10 = 2/5 = 40%. The part belongs inside the whole; red/green answers a different question.'},{title:'A unit rate keeps the requested units',text:'Thirty minutes for five questions is 30/5 = 6 minutes per question. Questions per minute uses the reciprocal, 5/30. Write the units before calculating.'}],weDo:{prompt:'A group has 8 online and 12 in-person learners. Compare online with in-person, then online with all learners.',steps:['Online:in-person = 8:12 = 2:3.','Online/all = 8/(8+12) = 8/20 = 2/5 = 40%.','The denominator changes because the question asks for a different comparison.']},practice:[]};
for(const q of HUB_SKILL_PRACTICE){const content=D772_SECTION_TWO_CONTENT[q.lessonId]||D772_SECTION_THREE_CONTENT[q.lessonId];content.practice=content.practice||[];}
for(const lessonId of new Set(HUB_SKILL_PRACTICE.map(q=>q.lessonId))){const content=D772_SECTION_TWO_CONTENT[lessonId]||D772_SECTION_THREE_CONTENT[lessonId];content.practice=[...HUB_SKILL_PRACTICE.filter(q=>q.lessonId===lessonId),...content.practice];}

function sections(id=cid()){
  const sourceRows=rows(id);
  // D772 official structure currently includes Sections 1 and 2. Section 2 lesson detail expands only as verified material is added.
  if(id==='D772')return D772_OFFICIAL_SECTIONS.map(sec=>JSON.parse(JSON.stringify(sec)));
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
    const section=sections(id).find(s=>sectionUnits(s).some(l=>l.id===lesson.id));
    const ids=new Set(sectionUnits(section).filter(l=>!l.review).flatMap(l=>sourcesForLesson(l,id).map(r=>r.id)));
    return rows(id).filter(r=>ids.has(r.id));
  }
  return rows(id).filter(r=>rowHasLesson(r,lesson.id,id));
}
function officialPracticeRows(official){
 if(!official)return [];
 const rows=[...(official.practice||[])];
 for(const id of official.practiceLessonIds||[])rows.push(...(D772_SECTION_THREE_CONTENT[id]?.practice||[]));
 const seen=new Set();return rows.filter(q=>{if(seen.has(q.id))return false;seen.add(q.id);return true});
}
function questionsForLesson(lesson,id=cid()){
  if(id==='D772'){
    const official=officialD772Content(lesson,id);
    const sharedPractice=(window.MajickD772SharedQuestions?.forLesson?.(lesson.id)||[]).map(q=>({...q,sourceName:q.sourceLabel}));
    const officialPractice=[...officialPracticeRows(official).map((q,i)=>({
      id:q.id||('official-'+lesson.id+'-'+i),
      prompt:q.prompt,
      choices:q.options||[],
      answer:(q.options||[])[Number(q.answer)],
      why:q.rationale||'',
      rationale:q.rationale||'',
      learningPathLessonId:q.learningPathLessonId||lesson.id,
      topicId:q.topicId||lesson.id+'-role-type',
      testedConcept:lesson.title,
      anchorChart:q.anchorChart||(q.skill?{type:q.skill}:undefined),
      rigorLevel:i<2?1:i<6?2:3,
      visual:q.visual||null,
      sourceName:q.sourceLabel||official.sourceLabel||'D772 course-provided material'
    })),...sharedPractice];
    if(lesson.review){
      const sec=sections(id).find(s=>sectionUnits(s).some(l=>l.id===lesson.id));
      const lessonIds=new Set(sectionUnits(sec).filter(l=>!l.review).map(l=>l.id));
      const reviewBank=(course(id).questionBank||[]).filter(q=>lessonIds.has(q.learningPathLessonId)||lessonIds.has(classifyD772Item(rows(id).find(r=>r.id===q.sourceId),q)));
      const seen=new Set(reviewBank.map(q=>q.id));return [...reviewBank,...officialPractice.filter(q=>!seen.has(q.id))];
    }
    const bank=(course(id).questionBank||[]).filter(q=>{
      if(q.learningPathLessonId===lesson.id)return true;
      const row=rows(id).find(r=>r.id===q.sourceId);
      return row?classifyD772Item(row,q)===lesson.id:false;
    });
    const seen=new Set(bank.map(q=>q.id));
    return [...bank,...officialPractice.filter(q=>!seen.has(q.id))];
  }
  const srcIds=new Set(sourcesForLesson(lesson,id).map(r=>r.id));
  return (course(id).questionBank||[]).filter(q=>srcIds.has(q.sourceId));
}
function answersForQuestions(qs,id=cid()){
  const ids=new Set((qs||[]).map(q=>q.id));
  return (prog(id).answers||[]).filter(a=>ids.has(a.qid));
}
function officialD772Content(lesson,id=cid()){return id==='D772'&&lesson?(D772_SECTION_ONE_CONTENT[lesson.id]||D772_SECTION_TWO_CONTENT[lesson.id]||D772_SECTION_THREE_CONTENT[lesson.id]||null):null}
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
  const lessons=section.lessons.filter(l=>!l.review); // sublessons contribute to their parent lesson but do not create a fifth official Section 2 lesson
  const rows=lessons.map(l=>mastery(l,id));
  const score=s=>s.status==='Mastered'?1:s.status==='Proficient'?.82:s.status==='Developing'?.55:s.status==='Learning'?.25:s.status==='Needs Review'?.42:0;
  const pct=rows.length?Math.round(rows.reduce((n,x)=>n+score(x),0)/rows.length*100):0;
  return {pct,ready:lessons.every(l=>mastery(l,id).sourceCount>0),lessons:rows};
}
function selectedLesson(id=cid()){
  const all=sections(id).flatMap(sectionUnits);
  const st=tutorState(id);
  let lesson=all.find(l=>l.id===st.selectedLesson);
  if(!lesson){
    lesson=all.find(l=>mastery(l,id).sourceCount>0)||all[0]||null;
    st.selectedLesson=lesson?.id||null;
  }
  return lesson;
}
function findSectionForLesson(lesson,id=cid()){return sections(id).find(s=>sectionUnits(s).some(l=>l.id===lesson?.id))||null}
function lessonNumberLabel(lesson){if(lesson.unitType&&lesson.unitType!=='lesson')return lesson.unitType.toUpperCase();return lesson.review?'SECTION REVIEW':lesson.number?('LESSON '+lesson.number):'LESSON'}
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
  for(const v of [...(official?.vocab||[]).map(x=>({term:x[0],definition:x[1],sourceName:official.sourceLabel||'D772 verified/course-provided notes'})),...uploadedVocab]){const key=norm(v.term);if(!key||vocabSeen.has(key))continue;vocabSeen.add(key);vocab.push(v)}
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
  if(id==='D772'){
    const c=course(id);c.questionBank=Array.isArray(c.questionBank)?c.questionBank:[];
    const existing=new Set(c.questionBank.map(q=>q.id));
    for(const q of qs)if(!existing.has(q.id)){c.questionBank.push({...q,options:q.choices||q.options||[],courseId:id,managedBy:'course-tutor-official'});existing.add(q.id)}
  }
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

function renderCourseNavigator(){
 const host=document.getElementById('courseLessonNavigator');if(!host)return;
 const id=cid(),secs=sections(id),active=selectedLesson(id),sec=secs.find(x=>sectionUnits(x).some(l=>l.id===active?.id))||secs[0];
 if(!sec){host.innerHTML='<h3>Course lessons</h3><p>Add your course notes in Study Material to build this course’s lessons.</p>';return}
 const units=sectionUnits(sec);
 host.innerHTML='<small>LEARNING HUB · '+E(id)+'</small><h3>Choose your section and lesson</h3><p>Teach → Visuals → Worked Example → Your Turn. Your saved progress stays with each lesson.</p><nav aria-label="Course sections">'+secs.map((x,i)=>'<button type="button" data-hub-section="'+E(x.id)+'" aria-pressed="'+String(x.id===sec.id)+'">Section '+(i+1)+'</button>').join('')+'</nav><h4>'+E(sec.title)+'</h4><div class="hubLessonRows">'+sec.lessons.map(l=>'<button type="button" data-hub-lesson="'+E(l.id)+'" aria-pressed="'+String(l.id===active?.id||(l.sublessons||[]).some(x=>x.id===active?.id))+'">'+E(l.number?'Lesson '+l.number+': '+l.title:l.title)+'</button>').join('')+'</div><label for="hubLessonSelect">All lessons, focused units and quizzes in this section</label><select id="hubLessonSelect">'+units.map(l=>'<option value="'+E(l.id)+'" '+(l.id===active?.id?'selected':'')+'>'+E(lessonNumberLabel(l)+' · '+l.title)+(officialD772Content(l,id)?'':' · notes needed')+'</option>').join('')+'</select><div class="hubNavigatorActions"><button type="button" id="hubOpenLesson">Open selected lesson →</button><button type="button" id="hubFullPath">View full course outline</button></div>';
 const choose=lessonId=>{tutorState(id).practiceFocus=null;tutorState(id).selectedLesson=lessonId;try{save()}catch(_){}show('tutor')};
 host.querySelectorAll('[data-hub-section]').forEach(b=>b.onclick=()=>choose(secs.find(x=>x.id===b.dataset.hubSection).lessons[0].id));
 host.querySelectorAll('[data-hub-lesson]').forEach(b=>b.onclick=()=>choose(b.dataset.hubLesson));
 host.querySelector('#hubOpenLesson').onclick=()=>choose(host.querySelector('select').value);
 host.querySelector('#hubLessonSelect').onchange=()=>choose(host.querySelector('select').value);
 host.querySelector('#hubFullPath').onclick=()=>show('path');
 if(id==='D772'){const practice=document.createElement('div');practice.className='hubSkillShortcuts';practice.innerHTML='<b>Extra help · choose a skill</b>'+[['mean','Mean','d772-s2-l4-1'],['median','Median','d772-s2-l4-1'],['ratio','Ratios & Rates','d772-s2-l4-ratios'],['probability','Probability','d772-s3-review']].map(([skill,label,lesson])=>'<button type="button" data-skill="'+skill+'" data-lesson="'+lesson+'">'+label+'</button>').join('');host.append(practice);practice.querySelectorAll('button').forEach(b=>b.onclick=()=>{tutorState(id).selectedLesson=b.dataset.lesson;tutorState(id).practiceFocus=b.dataset.skill;try{save()}catch(_){}show('tutor');document.querySelector('[data-classroom-tab="turn"]')?.click()})}
}
function questionVisualHtml(q){
 if(!q.visual)return '';
 const v=q.visual;let plot='';const text=(x,y,t)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle">'+E(t)+'</text>';
 if(v.type==='bars'){
  for(let n=0;n<=v.max;n+=v.step){const y=230-n/v.max*160;plot+='<path d="M70 '+y+'H540" stroke="#cbd5df"/>'+text(45,y+5,n)}
  v.values.forEach((n,i)=>{const x=100+i*440/v.values.length,h=n/v.max*160;plot+='<rect x="'+x+'" y="'+(230-h)+'" width="'+Math.min(70,300/v.values.length)+'" height="'+h+'" fill="#24788a"/>'+text(x+Math.min(70,300/v.values.length)/2,255,v.labels[i])+text(x+Math.min(70,300/v.values.length)/2,222-h,n)});
  plot+=text(300,285,v.xLabel)+text(300,45,v.yLabel);
 }else if(v.type==='dots'){
  plot+='<path d="M60 230H540" stroke="#42536a"/>';
  for(let n=v.min;n<=v.max;n++){const x=70+(n-v.min)/(v.max-v.min)*460;if(v.max-v.min<=15||n===v.min||n===v.max||n%5===0)plot+=text(x,255,n);const count=v.values.filter(x=>x===n).length;for(let j=0;j<count;j++)plot+='<circle cx="'+x+'" cy="'+(210-j*28)+'" r="9" fill="#24788a"/>'}
  plot+=text(300,285,v.xLabel);
 }else if(v.type==='venn'){
  plot='<rect x="30" y="60" width="540" height="210" rx="10" fill="#f5f8fc" stroke="#42536a"/><circle cx="230" cy="160" r="85" fill="#2690a030" stroke="#24788a"/><circle cx="365" cy="160" r="85" fill="#e39a4130" stroke="#a85e10"/>'+text(205,90,v.labels[0])+text(390,90,v.labels[1])+text(205,170,v.values[0])+text(298,170,v.values[1])+text(390,170,v.values[2])+text(485,245,'Neither: '+v.values[3])+text(300,40,'Total: '+v.values.reduce((a,b)=>a+b,0));
 }else if(v.type==='tokens'){
  v.values.forEach((n,i)=>{for(let j=0;j<n;j++)plot+='<circle cx="'+(100+j*38)+'" cy="'+(100+i*70)+'" r="14" fill="'+['#be433c','#327a58'][i]+'"/>';plot+=text(300,135+i*70,v.labels[i]+': '+n)});
 }else if(v.type==='table'){
  plot='<foreignObject x="30" y="65" width="540" height="220"><table xmlns="http://www.w3.org/1999/xhtml" style="width:100%;border-collapse:collapse;font:18px system-ui;color:#253246"><thead><tr>'+v.headers.map(x=>'<th style="padding:10px;border:1px solid #8e9baa">'+E(x)+'</th>').join('')+'</tr></thead><tbody>'+v.rows.map(row=>'<tr>'+row.map(x=>'<td style="padding:10px;text-align:center;border:1px solid #8e9baa">'+E(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></foreignObject>';
 }
 return '<figure class="questionDataVisual"><svg viewBox="0 0 600 310" role="img" aria-label="'+E(v.alt)+'" xmlns="http://www.w3.org/2000/svg"><title>'+E(v.alt)+'</title><rect width="600" height="310" rx="12" fill="#fffdf7"/><g fill="#253246" font-family="system-ui" font-size="16">'+plot+'</g></svg><figcaption>'+E(v.caption)+' · Exact data for this question.</figcaption></figure>';
}

function show(name){
  renderCourseNavigator();
  document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
  const panel=document.querySelector('.learnPanel[data-panel="'+name+'"]');if(panel)panel.hidden=false;
  document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-tutor-tab="'+name+'"]')?.classList.add('active');
  document.querySelector('.learnLab')?.classList.toggle('tutorFocus',name==='path'||name==='tutor');
  if(name==='path')renderPath();
  if(name==='tutor'){document.querySelector('.learnLab')?.classList.remove('instructionFocus');renderTutor();}
}
if(typeof document!=='undefined'&&typeof document.createElement==='function'&&document.head){const recoveryStyle=document.createElement('style');recoveryStyle.textContent='.mjCourseRecovery{padding:16px;margin:18px 0;border:2px solid #d5b276;background:#30233d;color:#fff3df;border-radius:16px}.mjCourseRecovery h3,.mjCourseRecovery h4,.mjCourseRecovery p{color:#fff3df!important}.mjCourseRecovery article{padding:12px;margin:10px 0;border:1px solid #ae8da9;border-radius:10px}.mjCourseRecovery button{background:#70517d;border:1px solid #e3be89;color:#fff9ec;padding:9px;border-radius:8px;cursor:pointer}';document.head.append(recoveryStyle);}
function courseRecoveryItems(id=cid()){
 const lessons=sections(id).flatMap(sectionUnits).filter(l=>!l.review&&l.unitType!=='quiz'&&l.unitType!=='test');
 const skills=window.S?.progress?.[id]?.adaptiveSkills||{};
 return lessons.map(lesson=>{const m=mastery(lesson,id),a=skills[lesson.id],wrong=(a?.errors||[]).slice(-3);return {lesson,mastery:m,adaptive:a,wrong}}).filter(row=>row.mastery.status==='Needs Review'||row.mastery.status==='Developing'||row.mastery.status==='Learning'||row.adaptive?.status==='review-needed'||row.wrong.length>0).sort((a,b)=>{const score=x=>(x.adaptive?.status==='review-needed'?0:x.mastery.status==='Needs Review'?1:x.mastery.status==='Developing'?2:3);return score(a)-score(b)});
}
function renderCourseRecovery(id=cid()){
 const rows=courseRecoveryItems(id);
 if(!rows.length)return '<section class="mjCourseRecovery"><h3>✦ Mastery Recovery Circle</h3><p>No low-mastery skills have been identified from your current results. You can still revisit lessons and take independent practice.</p></section>';
 return '<section class="mjCourseRecovery" aria-label="Mastery Recovery Circle"><h3>✦ Mastery Recovery Circle</h3><p>Return to skills that need strengthening. Review the misconception, then solve fresh questions on the same concept. Guided answers never count as independent mastery.</p>'+rows.map(row=>'<article><h4>'+E(row.lesson.title)+'</h4><p>'+E(row.mastery.status)+' · '+row.mastery.accuracy+'% accuracy · '+row.mastery.attempts+' recorded attempts</p>'+(row.wrong.length?'<p><b>Review:</b> '+E(row.wrong[row.wrong.length-1].kind||'Revisit your recent errors')+'</p>':'')+'<button type="button" data-recovery-review="'+E(row.lesson.id)+'">Reteach this lesson</button> <button type="button" data-recovery-retry="'+E(row.lesson.id)+'">Fresh same-skill questions</button></article>').join('')+'</section>';
}
function renderPath(){
  const box=document.getElementById('courseTutorPath');if(!box)return;
  const id=cid(),secs=sections(id);
  const active=selectedLesson(id);
  const pathHero=id==='D772'
    ? '<div class="tutorHero tutorHeroCompact"><div><span>D772 • MULTI-SECTION COURSE PATH</span><h3>Sections 1–3 have their course structure in place.</h3><p>Teaching expands as you add material. Section 3 probability lessons include explanations, worked examples, and practice.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>'
    : '<div class="tutorHero"><div><span>MAJICK COURSE TUTOR • '+E(id)+'</span><h3>Learn the course in order. Prove each lesson at higher rigor.</h3><p>Your uploaded notes automatically fill this path. Repeated material is deduplicated in the tutor chapter and the active question bank.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>';
  box.innerHTML=pathHero+renderCourseRecovery(id)+
    secs.map(sec=>{
      const sp=sectionProgress(sec,id);
      return '<section class="pathSection"><div class="pathSectionHead"><div><span>LEARNING PATH</span><h3>'+E(sec.title)+'</h3></div><div class="pathProgress"><b>'+sp.pct+'%</b><small>'+ (sp.ready?'section material loaded':'add lesson notes as you go')+'</small></div></div><div class="pathRail">'+sec.lessons.map((lesson,i)=>{
        const m=mastery(lesson,id);
        const available=m.sourceCount>0||(lesson.review&&sp.ready);
        const main='<button class="pathLesson '+statusClass(m.status)+' '+(lesson.id===active?.id?'selected':'')+'" data-tutor-lesson="'+E(lesson.id)+'"><i>'+(lesson.review?'✓':lesson.number||i+1)+'</i><div><small>'+E(lessonNumberLabel(lesson))+'</small><b>'+E(lesson.title)+'</b><span>'+E(m.status)+' • '+m.sourceCount+' source'+(m.sourceCount===1?'':'s')+' • '+m.attempts+' attempts</span></div><em>'+(available?'Open →':'Waiting for notes')+'</em></button>';
        const subs=(lesson.sublessons||[]).map(sub=>{
          const sm=mastery(sub,id),subAvailable=sm.sourceCount>0;
          return '<button class="pathLesson pathSublesson '+statusClass(sm.status)+' '+(sub.id===active?.id?'selected':'')+'" data-tutor-lesson="'+E(sub.id)+'"><i>'+E(sub.number??(sub.unitType==='quiz'?'?':sub.unitType==='test'?'✓':'•'))+'</i><div><small>'+E(lessonNumberLabel(sub))+' • INSIDE LESSON '+E(lesson.number)+'</small><b>'+E(sub.title)+'</b><span>'+E(sm.status)+' • focused mastery unit</span></div><em>'+(subAvailable?'Open →':'Waiting for notes')+'</em></button>';
        }).join('');
        return main+subs;
      }).join('')+'</div></section>';
    }).join('');
  box.querySelectorAll('[data-recovery-review]').forEach(b=>b.addEventListener('click',()=>openLesson(b.dataset.recoveryReview,'simpler',id)));
  box.querySelectorAll('[data-recovery-retry]').forEach(b=>b.addEventListener('click',()=>{const lid=b.dataset.recoveryRetry;if(id==='D772'&&window.MajickWGUPractice?.startSkillRetry)window.MajickWGUPractice.startSkillRetry(lid);else window.MajickLearningContinuity?.skillRetry?.(lid)}));
  document.getElementById('continueTutor')?.addEventListener('click',()=>enterClassroom());
  box.querySelectorAll('[data-tutor-lesson]').forEach(btn=>btn.addEventListener('click',()=>{
    tutorState(id).selectedLesson=btn.dataset.tutorLesson;try{save()}catch(_){}
    show('tutor');
  }));
}
function visualHtml(lesson){
  const v=lesson.visual||['Learn','Practice','Apply','Review'];
  return '<div class="tutorVisual">'+v.map((x,i)=>'<div><span>'+E(x)+'</span></div>'+(i<v.length-1?'<b>→</b>':'')).join('')+'</div>';
}
function visiblePracticeRows(official){const qs=officialPracticeRows(official),focus=tutorState(cid()).practiceFocus;return focus&&qs.some(q=>q.skill===focus)?qs.filter(q=>q.skill===focus):qs}
function lessonExperienceHtml(official){
  if(!official)return '';
  const objectives=(official.objectives||[]).length?'<section class="tutorChapterBlock v3401Objectives"><div class="tutorBlockTitle"><span>✦</span><div><small>LEARNING OBJECTIVES</small><h3>What you should be able to do</h3></div></div><ul>'+official.objectives.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></section>':'';
  const visuals=(official.visuals||[]).length?'<section class="tutorChapterBlock"><small>'+E(official.visualLabel||'ILLUSTRATIVE HISTOGRAMS • NOT WGU DATA')+'</small><div class="v3401AnchorGrid">'+official.visuals.map(v=>'<figure><img style="width:100%;max-width:310px" src="'+E(v.src)+'" alt="'+E(v.alt)+'"><figcaption>'+E(v.title)+'</figcaption></figure>').join('')+'</div></section>':'';
  const a=official.anchorChart;
  const anchor=a?'<section class="tutorChapterBlock v3401Anchor"><div class="tutorBlockTitle"><span>⚯</span><div><small>VISUAL ANCHOR CHART</small><h3>'+E(a.title)+'</h3></div></div><div class="v3401Rule">'+E(a.rule)+'</div><div class="v3401AnchorGrid">'+(a.columns||[]).slice(1).map(row=>'<article><b>'+E(row[0])+'</b><p>'+E(row[1])+'</p></article>').join('')+'</div><div class="v3401RoleExamples">'+(a.examples||[]).map(row=>'<span><b>'+E(row[0])+'</b> → '+E(row[1])+'</span>').join('')+'</div></section>':'';
  const we=official.weDo?'<section class="tutorChapterBlock v3401WeDo"><div class="tutorBlockTitle"><span>2</span><div><small>WE DO</small><h3>Work one together</h3></div></div><p class="v3401Prompt">'+E(official.weDo.prompt)+'</p><ol>'+official.weDo.steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></section>':'';
  const practice=visiblePracticeRows(official).length?'<section class="tutorChapterBlock v3401YouDo"><div class="tutorBlockTitle"><span>3</span><div><small>YOU DO</small><h3>Apply this lesson’s skills</h3></div></div><div class="v3401Practice">'+visiblePracticeRows(official).map((q,i)=>'<article data-v3401-q="'+E(q.id||i)+'"><small>QUESTION '+(i+1)+(q.skill?' · ORIGINAL WGU-STYLE PRACTICE':'')+'</small><b>'+E(q.prompt)+'</b>'+questionVisualHtml(q)+(q.visual?'<p class="questionReadingCue">Read the labels and units, identify the group or event, then choose the claim supported by the data.</p>':'')+'<details class="questionHint"><summary>Need a hint?</summary><p>'+E(q.hint||'Identify what the question asks before choosing a rule. Refer to the worked example.')+'</p></details><label class="questionWork">My working / reasoning<textarea rows="3" aria-label="My working for question '+(i+1)+'" placeholder="Write the total, sorted values, ratio, or probability rule you will use."></textarea></label><div>'+q.options.map((o,j)=>'<button type="button" data-v3401-answer="'+j+'">'+String.fromCharCode(65+j)+'. '+E(o)+'</button>').join('')+'</div><p class="v3401Feedback" aria-live="polite"></p></article>').join('')+'</div></section>':'';
  const linked=visiblePracticeRows(official).filter(q=>q.visual);
  const dataVisuals=linked.length?'<section class="tutorChapterBlock"><small>QUESTION-LINKED VISUALS · ORIGINAL WGU-STYLE PRACTICE</small>'+linked.map(q=>'<article><b>'+E(q.prompt)+'</b>'+questionVisualHtml(q)+'</article>').join('')+'</section>':'';
  return objectives+visuals+dataVisuals+anchor+we+practice;
}
function bindLessonExperience(official,lessonId,courseId=cid()){
 const questions=visiblePracticeRows(official);
 if(!questions.length)return;
 document.querySelectorAll('[data-v3401-q]').forEach((card,i)=>{
  const q=questions[i];if(!q)return;
  const work=card.querySelector('textarea'),st=tutorState(courseId);
  let assisted=false,answered=false;
  const hint=card.querySelector('.questionHint');
  const status=document.createElement('p');
  status.className='v3401AttemptStatus';
  status.setAttribute('role','status');
  status.textContent='Independent attempt — no hints used';
  card.querySelector('.v3401Feedback')?.before(status);
  hint?.addEventListener('toggle',()=>{if(hint.open&&!answered){assisted=true;status.textContent='Assisted Practice — hint viewed; this answer will not count as independent mastery.'}});
  if(work){work.maxLength=3000;work.value=st.workDrafts?.[q.id]||'';work.addEventListener('input',()=>{st.workDrafts=st.workDrafts||{};st.workDrafts[q.id]=work.value;try{save()}catch(_){}})}
  card.querySelectorAll('[data-v3401-answer]').forEach(btn=>btn.addEventListener('click',()=>{
   if(answered)return;
   answered=true;
   const pick=Number(btn.dataset.v3401Answer),correct=pick===Number(q.answer);
   card.querySelectorAll('[data-v3401-answer]').forEach(x=>x.disabled=true);
   btn.classList.add(correct?'correct':'incorrect');
   const fb=card.querySelector('.v3401Feedback');
   if(fb)fb.innerHTML='<b>'+(correct?'✓ Correct':'Not yet')+'</b> '+E(q.rationale||'Review the exact data and try a different question.');
   status.textContent=assisted?(correct?'Assisted correct — practice credit only':'Assisted attempt — review needed'):(correct?'Independent correct — saved as evidence, not automatic mastery':'Independent attempt — review needed');
   const at=Date.now();
   try{
    if(window.MajickStudyProgress?.creditAnswer){
     window.MajickStudyProgress.creditAnswer({key:courseId+':lesson-you-do:'+String(q.id||i)+':'+at,course:courseId,source:'lesson-you-do',qid:q.id||String(i),topicId:q.topicId||lessonId,correct,assisted,chosen:q.options[pick],answer:q.options[Number(q.answer)],difficulty:Number(q.difficulty||3),at});
    }else{
     const p=prog(courseId);p.answers=Array.isArray(p.answers)?p.answers:[];
     p.answers.push({qid:q.id,topicId:q.topicId||lessonId,chosen:q.options[pick],correct,assisted,at,source:'lesson-you-do',lessonId});
     if(p.answers.length>1200)p.answers=p.answers.slice(-1200);save();
    }
   }catch(_){}
   try{window.MajickProductCore?.record?.('concept-complete',{course:courseId,lessonId,qid:q.id,correct})}catch(_){}
   const next=document.createElement('button');
   next.type='button';next.className='btn primary';
   next.textContent=i<questions.length-1?'Next question →':'More independent practice →';
   next.addEventListener('click',()=>{
    if(i<questions.length-1){
     const target=document.querySelectorAll('[data-v3401-q]')[i+1];
     if(target){target.scrollIntoView({behavior:'smooth',block:'start'});target.querySelector('[data-v3401-answer]')?.focus()}
    }else startPractice(selectedLesson(courseId)||{id:lessonId,title:'D772 practice',review:false},courseId);
   });
   card.append(next);
  }));
 });
}

function helpFor(lesson){return D772_TUTOR_HELP[lesson?.id]||null}
function recentWrongForLesson(lesson,id=cid()){
  const qs=questionsForLesson(lesson,id),byId=new Map(qs.map(q=>[q.id,q]));
  const wrong=(prog(id).answers||[]).filter(a=>a&&!a.correct&&byId.has(a.qid));
  const last=wrong[wrong.length-1]||null;
  if(!last)return null;
  return {attempt:last,question:byId.get(last.qid),sameQuestionMisses:wrong.filter(a=>a.qid===last.qid).length};
}
function repairFor(lesson,id=cid()){
  const help=helpFor(lesson),miss=recentWrongForLesson(lesson,id);
  if(!help?.repairs?.length||!miss)return null;
  const repair=help.repairs.find(r=>(r.ids||[]).includes(miss.question?.id));
  if(!repair)return null;
  const variants=repair.variants||[];
  const variant=variants.length?variants[(Math.max(1,miss.sameQuestionMisses)-1)%variants.length]:repair;
  return {miss,...repair,...variant};
}
function relatedMistakesHtml(lesson,id=cid()){
  const qs=questionsForLesson(lesson,id),byId=new Map(qs.map(q=>[q.id,q]));
  const wrong=(prog(id).answers||[]).filter(a=>a&&!a.correct&&byId.has(a.qid)).slice(-4).reverse();
  const repair=repairFor(lesson,id);
  const repairLead=repair?'<div class="tutorRepairLead"><b>Current repair target</b><p>'+E(repair.cue||repair.simple||'Use the lesson clue before retrying.')+'</p></div>':'';
  if(wrong.length){
    return '<div class="tutorAssistMistakes">'+repairLead+'<p>These are recent misses from this lesson. The newest miss changes the repair explanation and transfer check so you are not simply seeing the same question again.</p>'+wrong.map((a,i)=>{const q=byId.get(a.qid)||{};return '<article><small>RECENT MISS '+(i+1)+'</small><b>'+E(q.prompt||'Lesson question')+'</b>'+(q.why?'<p>'+E(q.why)+'</p>':'')+'</article>'}).join('')+'</div>';
  }
  return '<div class="tutorAssistMistakes"><p>You do not have a recent wrong answer saved for this lesson yet. Watch these high-priority traps:</p><ul>'+(lesson.traps||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></div>';
}
function adaptiveCheck(lesson,id=cid()){
  const repair=repairFor(lesson,id);
  if(repair?.check)return {check:repair.check,adaptive:true,repair};
  const built=helpFor(lesson)?.quickCheck;
  return built?{check:built,adaptive:false,repair:null}:null;
}
function quickQuizHtml(lesson,id=cid()){
  const adaptive=adaptiveCheck(lesson,id);
  if(adaptive?.check){
    const built=adaptive.check;
    return '<div class="tutorQuickQuiz">'+(adaptive.adaptive?'<p class="tutorRepairBadge">New transfer scenario based on your latest miss</p>':'')+'<p class="tutorQuickPrompt">'+E(built.prompt)+'</p><div class="tutorQuickChoices">'+built.choices.map((x,i)=>'<button type="button" data-tutor-quick-choice="'+i+'">'+String.fromCharCode(65+i)+'. '+E(x)+'</button>').join('')+'</div><div class="tutorQuickFeedback" aria-live="polite"></div></div>';
  }
  const q=questionsForLesson(lesson,id)[0];
  if(q&&Array.isArray(q.choices)&&q.choices.length){
    return '<div class="tutorQuickQuiz"><p class="tutorQuickPrompt">'+E(q.prompt||'Quick check')+'</p><div class="tutorQuickChoices">'+q.choices.map((x,i)=>'<button type="button" data-tutor-bank-choice="'+i+'">'+String.fromCharCode(65+i)+'. '+E(x)+'</button>').join('')+'</div><div class="tutorQuickFeedback" aria-live="polite"></div></div>';
  }
  return '<p>Lesson-specific adaptive questions will appear here after your question bank is available.</p>';
}
function renderTutorAssist(kind,lesson,ch,id=cid()){
  const panel=document.getElementById('tutorAssistPanel');if(!panel)return;
  const help=helpFor(lesson),repair=repairFor(lesson,id);
  let title='',body='';
  if(kind==='simple'){
    title=repair?'Repair this idea':'Explain it simpler';
    body='<p>'+E(repair?.simple||help?.simple||lesson.goal||'Focus on the main idea, then identify the clue in the scenario that tells you which concept applies.')+'</p>'+(repair?.cue?'<div class="tutorRepairCue"><b>Use this cue</b><span>'+E(repair.cue)+'</span></div>':'');
  }else if(kind==='example'){
    title=repair?'Try a different example':'Show me an example';
    body='<p>'+E(repair?.example||help?.example||'A lesson-specific worked example is not available yet. Use the worked example in this classroom and the source coverage in Review.')+'</p>';
  }else if(kind==='mistakes'){
    title='Related mistakes';
    body=relatedMistakesHtml(lesson,id);
  }else if(kind==='quiz'){
    title=repair?'Transfer check':'Quick check';
    body=quickQuizHtml(lesson,id);
  }
  panel.hidden=false;
  panel.innerHTML='<div class="tutorAssistHead"><div><small>MAJICK TUTOR • '+E(lessonNumberLabel(lesson))+'</small><h3>'+E(title)+'</h3></div><button type="button" id="tutorAssistClose" aria-label="Close tutor help">×</button></div><div class="tutorAssistBody">'+body+'</div>';
  document.getElementById('tutorAssistClose')?.addEventListener('click',()=>{panel.hidden=true;panel.innerHTML=''});
  if(kind==='quiz'){
    const adaptive=adaptiveCheck(lesson,id);
    if(adaptive?.check){
      const built=adaptive.check;
      panel.querySelectorAll('[data-tutor-quick-choice]').forEach(btn=>btn.addEventListener('click',()=>{
        const picked=Number(btn.dataset.tutorQuickChoice),correct=picked===built.answer;
        panel.querySelectorAll('[data-tutor-quick-choice]').forEach(x=>x.disabled=true);
        const feedback=panel.querySelector('.tutorQuickFeedback');
        if(feedback)feedback.innerHTML='<b>'+(correct?'✓ Correct':'Not yet')+'</b><p>'+E(built.rationale)+'</p>';
        btn.classList.add(correct?'correct':'incorrect');
      }));
    }else{
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
}
function officialTeachingHtml(official){
  if(!official)return '';
  const refs=official.provenance?.corroboration||[];
  const refHtml=refs.length?'<div class="tutorSourceRefs"><small>REFERENCES USED TO CORROBORATE THIS SECTION</small><ul>'+refs.map(r=>'<li><b>'+E(r.source)+'</b><span>'+E(r.supports||'')+'</span><code>'+E(r.url||'')+'</code></li>').join('')+'</ul></div>':'';
  return '<article class="tutorOfficialTeaching"><small>'+E(official.sourceLabel||'VERIFIED D772 COURSE NOTES')+'</small><h4>'+E(official.overview)+'</h4>'+(official.teach||[]).map(x=>'<div class="tutorOfficialTopic"><b>'+E(x.title)+'</b><p>'+E(x.text)+'</p></div>').join('')+((official.memory||[]).length?'<div class="tutorMemoryCues"><small>MEMORY CUES</small><ul>'+official.memory.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></div>':'')+refHtml+'</article>';
}
function enterClassroom(){
  show('tutor');
  const box=document.getElementById('courseTutorLesson');if(!box)return;
  const selected=box.querySelector('[role="tab"][aria-selected="true"]');
  if(selected?.dataset.classroomTab==='opening')box.querySelector('[data-classroom-tab="teach"]')?.click();
  box.classList.remove('classroomArriving');void box.offsetWidth;box.classList.add('classroomArriving');
  let cue=box.querySelector('.classroomArrivalCue');if(!cue){cue=document.createElement('p');cue.className='classroomArrivalCue';cue.setAttribute('role','status');box.prepend(cue)}
  cue.textContent='✦ Lesson opened · '+(selectedLesson(cid())?.title||'Your classroom');
  box.querySelector('[role="tab"][aria-selected="true"]')?.focus({preventScroll:true});
  box.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function openLesson(lessonId,helpKind=null,id='D772'){
  try{
    if(window.S?.activeCourse!==id&&typeof window.switchCourse==='function')window.switchCourse(id);
    const lesson=sections(id).flatMap(sectionUnits).find(l=>l.id===lessonId)||selectedLesson(id);
    if(!lesson)return;
    const st=tutorState(id);
    st.selectedLesson=lesson.id;
    try{save()}catch(_){}
    if(typeof navigate==='function')navigate('learninglab');
    else {S.screen='learninglab';render()}
    setTimeout(()=>{
      enterClassroom();
      if(helpKind){
        const ch=chapter(lesson,id);
        renderTutorAssist(helpKind,lesson,ch,id);
      }
    },120);
  }catch(e){console.warn('Open Majick Tutor lesson',e)}
}
function compactClassroom(box,ch,lesson){
  // Move the existing lesson nodes into one classroom; preserve their bindings and data owners.
  box.classList.add('compactClassroom');
  const groups=[['opening','Opening'],['teach','Teach'],['visual','Visuals & Charts'],['example','Worked Example'],['turn','Your Turn'],['workshop','Reasoning Workshop'],['review','Review & Tutor']];
  const nav=document.createElement('nav');nav.className='classroomTabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Lesson parts');
  const stage=document.createElement('div');stage.className='classroomStage';
  const panels={};
  groups.forEach(([key,label])=>{
    const b=document.createElement('button');b.type='button';b.textContent=label;b.id='classroom-tab-'+key;b.setAttribute('role','tab');b.dataset.classroomTab=key;b.setAttribute('aria-controls','classroom-panel-'+key);nav.append(b);
    const panel=document.createElement('section');panel.id='classroom-panel-'+key;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);panel.tabIndex=0;panels[key]=panel;stage.append(panel);
  });
  const head=box.querySelector('.tutorLessonHead');
  const children=Array.from(box.children).filter(n=>n!==head);
  children.forEach(n=>{
    if(n.classList.contains('tutorTwoCol')){Array.from(n.children).forEach(part=>panels.review.append(part));return}
    const text=n.textContent;
    const key=n.matches('.v3401Objectives,.tutorNext')?'opening':n.matches('.v3401Anchor')||n.querySelector('.questionDataVisual')&&!n.matches('.v3401YouDo')||n.querySelector('.v3401AnchorGrid')||text.includes('SEE IT')?'visual':n.matches('.v3401WeDo')?'example':n.matches('.v3401YouDo')?'turn':text.includes('TEACH ME')?'teach':'review';
    panels[key].append(n);
  });
  const workshop=document.createElement('section');workshop.className='mjParchmentWorkshop';panels.workshop.append(workshop);window.MajickSolutionEngine?.mountLesson?.(workshop,lesson.id);
  if(!panels.opening.querySelector('.v3401Objectives'))panels.opening.insertAdjacentHTML('afterbegin','<h3>What am I learning?</h3><p>'+E(lesson.goal||lesson.title)+'</p><h4>Lesson skills</h4><ul>'+(lesson.thinking||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>');
  panels.opening.insertAdjacentHTML('beforeend','<h4>What to watch for in questions</h4><ul>'+(lesson.traps||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>');
  if(!panels.example.children.length)panels.example.innerHTML='<p>'+E(helpFor(lesson)?.example||'A worked example has not been supplied for this lesson yet. Check the teaching notes and source coverage in Review.')+'</p>';
  if(!panels.turn.children.length&&!window.MajickYourTurn)panels.turn.innerHTML='<p>Practice is being prepared for this lesson. Open Review & Tutor for an adaptive check.</p>';
  const courseId=cid(),courseLessons=sections(courseId).flatMap(sectionUnits),lessonPosition=courseLessons.findIndex(item=>item.id===lesson.id);
  const upcomingLesson=lessonPosition>=0?courseLessons[lessonPosition+1]:null;
  const reviewContinue=document.createElement('div');reviewContinue.className='classroomReviewContinue';
  const reviewNextButton=document.createElement('button');reviewNextButton.type='button';reviewNextButton.className='btn primary';
  reviewNextButton.textContent=upcomingLesson?'Continue to Next Lesson →':'Review Course Skills →';
  reviewNextButton.setAttribute('aria-label',upcomingLesson?'Continue to '+upcomingLesson.title:'Review course skills and misconceptions');
  reviewNextButton.addEventListener('click',()=>{
    if(cid()!==courseId)return;
    if(upcomingLesson){const state=tutorState(courseId);state.classroomSteps=state.classroomSteps||{};state.classroomSteps[upcomingLesson.id]=0;openLesson(upcomingLesson.id,null,courseId)}
    else show('path');
  });
  reviewContinue.append(reviewNextButton);
  panels.review.append(reviewContinue);
  const footer=document.createElement('div');footer.className='classroomNavigation';footer.innerHTML='<button type="button" class="classroomPrevious">← Previous</button><span aria-live="polite"></span><button type="button" class="classroomNext">Next →</button>';
  const scrollTools=document.createElement('div');scrollTools.className='classroomScrollTools';scrollTools.setAttribute('aria-label','Parchment scrolling');
  scrollTools.innerHTML='<span>Lesson parchment</span><button type="button" aria-label="Scroll lesson up">↑ Up</button><button type="button" aria-label="Scroll lesson down">↓ Down</button><button type="button" aria-label="Return to top of lesson parchment">↑ Top</button>';
  scrollTools.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';if(i===2)stage.scrollTo({top:0,behavior:motion});else stage.scrollBy({top:(i===0?-1:1)*Math.max(150,stage.clientHeight*.65),behavior:motion})}));
  stage.tabIndex=0;stage.setAttribute('aria-label','Scrollable lesson parchment');
  box.append(nav,scrollTools,stage,footer);
  const classroomState=tutorState(cid());const remembered=classroomState.classroomSteps?.[lesson.id];
  let active=0;
  function select(index){active=index;classroomState.classroomSteps=classroomState.classroomSteps||{};classroomState.classroomSteps[lesson.id]=active;try{save()}catch(_){};groups.forEach(([key],i)=>{panels[key].hidden=i!==active;const b=nav.children[i];b.setAttribute('aria-selected',String(i===active));b.tabIndex=i===active?0:-1});footer.querySelector('span').textContent=(active+1)+' / '+groups.length+' · '+groups[active][1];footer.querySelector('.classroomPrevious').disabled=active===0;const nextButton=footer.querySelector('.classroomNext');nextButton.disabled=false;nextButton.textContent=active===groups.length-1?(upcomingLesson?'Next Lesson →':'Course Path →'):'Next →'}
  nav.querySelectorAll('button').forEach((b,i)=>{b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowRight'?1:-1)+groups.length)%groups.length;select(next);nav.children[next].focus()}})});
  footer.querySelector('.classroomPrevious').onclick=()=>select(active-1);footer.querySelector('.classroomNext').onclick=()=>active===groups.length-1?reviewNextButton.click():select(active+1);
  function paginate(parent,nodes,label){if(nodes.length<2)return;let current=0;const controls=document.createElement('div');controls.className='classroomNavigation';const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('span');prev.type=next.type='button';prev.textContent='← '+label;next.textContent=label+' →';status.setAttribute('aria-live','polite');controls.append(prev,status,next);parent.append(controls);const update=()=>{nodes.forEach((n,i)=>n.hidden=i!==current);prev.disabled=current===0;next.disabled=current===nodes.length-1;status.textContent=label+' '+(current+1)+' of '+nodes.length};prev.onclick=()=>{current--;update()};next.onclick=()=>{current++;update()};update()}
  const teaching=panels.teach.querySelector('.tutorOfficialTeaching');if(teaching){paginate(teaching,Array.from(teaching.querySelectorAll('.tutorOfficialTopic')),'Concept');teaching.querySelectorAll('.tutorMemoryCues,.tutorSourceRefs').forEach(n=>panels.review.append(n))}
  const practice=panels.turn.querySelector('.v3401Practice');if(practice)paginate(practice,Array.from(practice.children),'Question');
  window.MajickYourTurn?.mount?.(panels.turn,lesson,cid());
  paginate(panels.visual,Array.from(panels.visual.children),'Chart');
  const visualGrid=panels.visual.querySelector('.v3401AnchorGrid');if(visualGrid&&visualGrid.querySelector('figure'))paginate(visualGrid,Array.from(visualGrid.querySelectorAll('figure')),'Visual');
  const anchors=document.createElement('div');anchors.className='classroomFloatingCharts';anchors.setAttribute('aria-label','Classroom reference charts');
  const chartButton=document.createElement('button');chartButton.type='button';chartButton.textContent='✧ '+(ch.official?.anchorChart?.title||'Lesson Anchor');chartButton.onclick=()=>{select(2);nav.children[2].focus()};anchors.append(chartButton);head?.after(anchors);
  select(Number.isInteger(remembered)&&remembered>=0&&remembered<groups.length?remembered:0);
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
    lessonExperienceHtml(ch.official)+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>1</span><div><small>TEACH ME</small><h3>Build the idea before memorizing it</h3></div></div>'+sourceEvidence+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>2</span><div><small>SEE IT</small><h3>A visual thinking path</h3></div></div>'+visualHtml(lesson)+'</section>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>3</span><div><small>VOCABULARY IN CONTEXT</small><h3>Words you need to recognize</h3></div></div>'+(ch.vocab.length?'<div class="tutorVocab">'+ch.vocab.slice(0,14).map(v=>'<details><summary>'+E(v.term)+'</summary><p>'+E(v.definition)+'</p></details>').join('')+'</div>':'<p class="tutorMuted">Vocabulary will populate from this lesson’s notes.</p>')+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>4</span><div><small>HOW TO THINK THROUGH IT</small><h3>Use this when a question feels confusing</h3></div></div><ol class="thinkingSteps">'+(lesson.thinking||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></section></div>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock trapBlock"><div class="tutorBlockTitle"><span>5</span><div><small>COMMON TRAPS</small><h3>What Majick should catch you doing</h3></div></div><ul>'+[...(lesson.traps||[]),...ch.repairs.slice(0,3).map(r=>r.correction)].slice(0,6).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>6</span><div><small>PROVE IT</small><h3>Adaptive lesson practice</h3></div></div><div class="proveStats"><span><b>'+m.questionCount+'</b> lesson questions</span><span><b>'+m.attempts+'</b> attempts</span><span><b>'+m.accuracy+'%</b> accuracy</span><span><b>R'+m.targetRigor+'</b> next rigor</span></div><button class="btn primary" id="tutorPractice" '+(m.questionCount?'':'disabled')+'>'+ (m.status==='Needs Review'?'Repair this lesson':'Start adaptive lesson practice')+' →</button></section></div>'+
    '<section class="tutorSources"><div><b>Source coverage</b><span>'+E(ch.official?('D772 verified/course-provided notes'+(sourceNames.length?' • '+sourceNames.join(' • '):'')):(sourceNames.length?sourceNames.join(' • '):'No lesson source uploaded yet'))+'</span></div><button class="tutorManageSources" id="tutorManageSources" type="button">Manage or delete source notes →</button></section>';
  document.getElementById('tutorBack')?.addEventListener('click',()=>show('path'));
  document.getElementById('tutorPractice')?.addEventListener('click',()=>startPractice(lesson,id));
  document.getElementById('tutorManageSources')?.addEventListener('click',()=>{try{navigate('addmaterial')}catch(_){}});
  box.querySelectorAll('[data-tutor-help]').forEach(btn=>btn.addEventListener('click',()=>renderTutorAssist(btn.dataset.tutorHelp,lesson,ch,id)));
  compactClassroom(box,ch,lesson);
  bindLessonExperience(ch.official,lesson.id,id);
}
const baseRender=MajickLearningLab.render;
MajickLearningLab.render=function(){
  let h=baseRender();
  h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-tutor-tab="path">Course Path</button><button type="button" data-tutor-tab="tutor">Course Tutor</button>');
  h=h.replace('<div class="learnPanels">','<section id="courseLessonNavigator" class="courseLessonNavigator" aria-label="Section and lesson navigator"></section><div class="learnPanels">');
  h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="path"><div id="courseTutorPath"></div></section><section class="learnPanel" data-panel="tutor" hidden><div id="courseTutorLesson"></div></section>');
  return h;
};
const baseBind=MajickLearningLab.bind;
MajickLearningLab.bind=function(){
  baseBind();
  renderCourseNavigator();
  document.querySelectorAll('[data-tutor-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.tutorTab)}));
  const bindingCourse=cid();
  setTimeout(()=>hydrate(bindingCourse).then(()=>{
    if(cid()!==bindingCourse||window.S?.screen!=='learninglab')return;
    show('tutor');
  }),30);
};
const baseRefresh=MajickLearningLab.refresh;
MajickLearningLab.refresh=function(){baseRefresh();hydrate()};
function sourceVerifiedD772Questions(){
 const selected=D772_SECTION_TWO_CONTENT['d772-s2-l4-1']?.practice||[];
 return selected.filter(q=>/^s2l41-course-p[1-6]$/.test(String(q.id))&&q.provenance&&Array.isArray(q.options)&&Number.isInteger(q.answer)&&q.options[q.answer]&&q.rationale).map(q=>({id:q.id,courseId:'D772',section:'Section 2 · Statistics',lessonId:'d772-s2-l4-1',learningPathLessonId:'d772-s2-l4-1',topicId:'d772-s2-l4-1',prompt:q.prompt,options:[...q.options],answer:q.options[q.answer],why:q.rationale,rationale:q.rationale,sourceLabel:q.provenance,sourceProvenance:'user-provided-wgu-lesson-question',assistedPractice:true,independentMastery:true}));
}
window.MajickD772VerifiedSource=Object.freeze({questions:sourceVerifiedD772Questions});
window.MajickCourseTutor={VERSION,questionVisualHtml,D772_SECTION_ONE,D772_SECTION_TWO,D772_SECTION_THREE,D772_SECTION_ONE_CONTENT,D772_SECTION_TWO_CONTENT,D772_SECTION_THREE_CONTENT,D772_TUTOR_HELP,sectionUnits,allOfficialLessons,hydrate,sections,classifySource,annotateSource,tagD772Generated,classifyD772Item,d772Segments,sourcesForLesson,questionsForLesson,mastery,sectionProgress,chapter,mergeLessonTeaching,officialD772Content,startPractice,show,renderPath,renderTutor,renderTutorAssist,openLesson,selectedLesson};
})();

