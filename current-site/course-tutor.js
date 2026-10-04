(function(){
'use strict';
if(!window.MajickLearningLab||!window.MajickMaterialStore)return;

const VERSION='3.3.32';
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
      {title:'WGU case question 1 — Identify the flaws',text:'Which is a significant flaw: lack of a control group, relatively small sample size, failure to account for individual differences, or all of the above? WGU answer: All of the above. Each listed problem weakens the evidence. Do not stop at the first valid flaw when the question offers a choice that includes every valid flaw.'},
      {title:'WGU case question 2 — Improve the study',text:'Among the supplied choices, the best improvement is to substantially increase the sample size. A larger well-selected sample reduces the influence of random variation and generally gives more stable estimates. Shortening the study, hiding results, or making results more extreme does not repair the study. Increasing sample size alone still does not fix the missing control group or selection bias.'},
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
    "courseStructure": "User-provided WGU D772 Section 3 outline; teaching material pending"
  },
  "lessons": [
    {
      "id": "d772-s3-l1",
      "number": 1,
      "title": "Theoretical and Empirical Probability",
      "short": "Theoretical and Empirical Probability",
      "outlineOnly": true,
      "keywords": [],
      "goal": "Course outline reserved for your upcoming material.",
      "visual": [],
      "thinking": [],
      "traps": [],
      "sublessons": [
        {
          "id": "d772-s3-l1-1",
          "number": 1.1,
          "title": "Terminology and Notation",
          "short": "Terminology and Notation",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l1-2",
          "number": 1.2,
          "title": "Theoretical (Classical) Probability",
          "short": "Theoretical (Classical) Probability",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l1-3",
          "number": 1.3,
          "title": "Empirical (Experimental) Probability and the Law of Large Numbers",
          "short": "Empirical (Experimental) Probability and the Law of Large Numbers",
          "parentLessonId": "d772-s3-l1",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l1-summary",
          "number": null,
          "title": "Lesson 1: Summary",
          "short": "Lesson 1: Summary",
          "parentLessonId": "d772-s3-l1",
          "unitType": "summary",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l1-quiz",
          "number": null,
          "title": "Lesson 1: Quiz",
          "short": "Lesson 1: Quiz",
          "parentLessonId": "d772-s3-l1",
          "unitType": "quiz",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        }
      ]
    },
    {
      "id": "d772-s3-l2",
      "number": 2,
      "title": "Independent, Dependent, and Disjoint Events",
      "short": "Independent, Dependent, and Disjoint Events",
      "outlineOnly": true,
      "keywords": [],
      "goal": "Course outline reserved for your upcoming material.",
      "visual": [],
      "thinking": [],
      "traps": [],
      "sublessons": [
        {
          "id": "d772-s3-l2-1",
          "number": 2.1,
          "title": "Independent and Dependent Events",
          "short": "Independent and Dependent Events",
          "parentLessonId": "d772-s3-l2",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l2-2",
          "number": 2.2,
          "title": "Disjoint Events (Mutually Exclusive)",
          "short": "Disjoint Events (Mutually Exclusive)",
          "parentLessonId": "d772-s3-l2",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l2-summary",
          "number": null,
          "title": "Lesson 2: Summary",
          "short": "Lesson 2: Summary",
          "parentLessonId": "d772-s3-l2",
          "unitType": "summary",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l2-quiz",
          "number": null,
          "title": "Lesson 2: Quiz",
          "short": "Lesson 2: Quiz",
          "parentLessonId": "d772-s3-l2",
          "unitType": "quiz",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        }
      ]
    },
    {
      "id": "d772-s3-l3",
      "number": 3,
      "title": "Unions, Intersections, and Complements",
      "short": "Unions, Intersections, and Complements",
      "outlineOnly": true,
      "keywords": [],
      "goal": "Course outline reserved for your upcoming material.",
      "visual": [],
      "thinking": [],
      "traps": [],
      "sublessons": [
        {
          "id": "d772-s3-l3-1",
          "number": 3.1,
          "title": "Venn Diagrams",
          "short": "Venn Diagrams",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l3-2",
          "number": 3.2,
          "title": "Unions",
          "short": "Unions",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l3-3",
          "number": 3.3,
          "title": "Intersections",
          "short": "Intersections",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l3-4",
          "number": 3.4,
          "title": "Complements",
          "short": "Complements",
          "parentLessonId": "d772-s3-l3",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l3-summary",
          "number": null,
          "title": "Lesson 3: Summary",
          "short": "Lesson 3: Summary",
          "parentLessonId": "d772-s3-l3",
          "unitType": "summary",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l3-quiz",
          "number": null,
          "title": "Lesson 3: Quiz",
          "short": "Lesson 3: Quiz",
          "parentLessonId": "d772-s3-l3",
          "unitType": "quiz",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        }
      ]
    },
    {
      "id": "d772-s3-l4",
      "number": 4,
      "title": "Expected Value",
      "short": "Expected Value",
      "outlineOnly": true,
      "keywords": [],
      "goal": "Course outline reserved for your upcoming material.",
      "visual": [],
      "thinking": [],
      "traps": [],
      "sublessons": [
        {
          "id": "d772-s3-l4-1",
          "number": 4.1,
          "title": "Calculating Expected Value",
          "short": "Calculating Expected Value",
          "parentLessonId": "d772-s3-l4",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l4-2",
          "number": 4.2,
          "title": "Applications of Expected Value",
          "short": "Applications of Expected Value",
          "parentLessonId": "d772-s3-l4",
          "unitType": "lesson",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l4-summary",
          "number": null,
          "title": "Lesson 4: Summary",
          "short": "Lesson 4: Summary",
          "parentLessonId": "d772-s3-l4",
          "unitType": "summary",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        },
        {
          "id": "d772-s3-l4-quiz",
          "number": null,
          "title": "Lesson 4: Quiz",
          "short": "Lesson 4: Quiz",
          "parentLessonId": "d772-s3-l4",
          "unitType": "quiz",
          "outlineOnly": true,
          "keywords": [],
          "goal": "Course outline reserved for your upcoming material.",
          "visual": [],
          "thinking": [],
          "traps": []
        }
      ]
    },
    {
      "id": "d772-s3-review",
      "number": null,
      "title": "Section 3: Summary and Test",
      "short": "Section 3 Review",
      "review": true,
      "outlineOnly": true,
      "keywords": [],
      "goal": "Section summary and test reserved for your upcoming material.",
      "visual": [],
      "thinking": [],
      "traps": []
    }
  ]
};
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
function questionsForLesson(lesson,id=cid()){
  if(id==='D772'){
    const official=officialD772Content(lesson,id);
    const officialPractice=(official?.practice||[]).map((q,i)=>({
      id:q.id||('official-'+lesson.id+'-'+i),
      prompt:q.prompt,
      choices:q.options||[],
      answer:(q.options||[])[Number(q.answer)],
      why:q.rationale||'',
      rationale:q.rationale||'',
      learningPathLessonId:lesson.id,
      topicId:lesson.id+'-role-type',
      testedConcept:lesson.title,
      rigorLevel:i<2?1:i<6?2:3,
      sourceName:official.sourceLabel||'D772 course-provided material'
    }));
    if(lesson.review){
      const sec=sections(id).find(s=>sectionUnits(s).some(l=>l.id===lesson.id));
      const lessonIds=new Set(sectionUnits(sec).filter(l=>!l.review).map(l=>l.id));
      return (course(id).questionBank||[]).filter(q=>lessonIds.has(q.learningPathLessonId)||lessonIds.has(classifyD772Item(rows(id).find(r=>r.id===q.sourceId),q)));
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
function officialD772Content(lesson,id=cid()){return id==='D772'&&lesson?(D772_SECTION_ONE_CONTENT[lesson.id]||D772_SECTION_TWO_CONTENT[lesson.id]||null):null}
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
  for(const v of [...(official?.vocab||[]).map(x=>({term:x[0],definition:x[1],sourceName:'D772 verified/course-provided notes'})),...uploadedVocab]){const key=norm(v.term);if(!key||vocabSeen.has(key))continue;vocabSeen.add(key);vocab.push(v)}
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
  if(name==='tutor'){document.querySelector('.learnLab')?.classList.remove('instructionFocus');renderTutor();}
}
function renderPath(){
  const box=document.getElementById('courseTutorPath');if(!box)return;
  const id=cid(),secs=sections(id);
  const active=selectedLesson(id);
  const pathHero=id==='D772'
    ? '<div class="tutorHero tutorHeroCompact"><div><span>D772 • MULTI-SECTION COURSE PATH</span><h3>Sections 1–3 have their course structure in place.</h3><p>Teaching expands as you add material. Section 3 probability units are reserved for your upcoming notes, summaries, and quizzes.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>'
    : '<div class="tutorHero"><div><span>MAJICK COURSE TUTOR • '+E(id)+'</span><h3>Learn the course in order. Prove each lesson at higher rigor.</h3><p>Your uploaded notes automatically fill this path. Repeated material is deduplicated in the tutor chapter and the active question bank.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>';
  box.innerHTML=pathHero+
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
function lessonExperienceHtml(official){
  if(!official)return '';
  const objectives=(official.objectives||[]).length?'<section class="tutorChapterBlock v3401Objectives"><div class="tutorBlockTitle"><span>✦</span><div><small>LEARNING OBJECTIVES</small><h3>What you should be able to do</h3></div></div><ul>'+official.objectives.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></section>':'';
  const visuals=(official.visuals||[]).length?'<section class="tutorChapterBlock"><small>ILLUSTRATIVE HISTOGRAMS • NOT WGU DATA</small><div class="v3401AnchorGrid">'+official.visuals.map(v=>'<figure><img style="width:100%;max-width:310px" src="'+E(v.src)+'" alt="'+E(v.alt)+'"><figcaption>'+E(v.title)+'</figcaption></figure>').join('')+'</div></section>':'';
  const a=official.anchorChart;
  const anchor=a?'<section class="tutorChapterBlock v3401Anchor"><div class="tutorBlockTitle"><span>⚯</span><div><small>VISUAL ANCHOR CHART</small><h3>'+E(a.title)+'</h3></div></div><div class="v3401Rule">'+E(a.rule)+'</div><div class="v3401AnchorGrid">'+(a.columns||[]).slice(1).map(row=>'<article><b>'+E(row[0])+'</b><p>'+E(row[1])+'</p></article>').join('')+'</div><div class="v3401RoleExamples">'+(a.examples||[]).map(row=>'<span><b>'+E(row[0])+'</b> → '+E(row[1])+'</span>').join('')+'</div></section>':'';
  const we=official.weDo?'<section class="tutorChapterBlock v3401WeDo"><div class="tutorBlockTitle"><span>2</span><div><small>WE DO</small><h3>Work one together</h3></div></div><p class="v3401Prompt">'+E(official.weDo.prompt)+'</p><ol>'+official.weDo.steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></section>':'';
  const practice=(official.practice||[]).length?'<section class="tutorChapterBlock v3401YouDo"><div class="tutorBlockTitle"><span>3</span><div><small>YOU DO</small><h3>Apply this lesson’s skills</h3></div></div><div class="v3401Practice">'+official.practice.map((q,i)=>'<article data-v3401-q="'+E(q.id||i)+'"><small>QUESTION '+(i+1)+'</small><b>'+E(q.prompt)+'</b><div>'+q.options.map((o,j)=>'<button type="button" data-v3401-answer="'+j+'">'+String.fromCharCode(65+j)+'. '+E(o)+'</button>').join('')+'</div><p class="v3401Feedback" aria-live="polite"></p></article>').join('')+'</div></section>':'';
  return objectives+visuals+anchor+we+practice;
}
function bindLessonExperience(official,lessonId,courseId=cid()){
  if(!official?.practice?.length)return;
  document.querySelectorAll('[data-v3401-q]').forEach((card,i)=>{
    const q=official.practice[i];if(!q)return;
    card.querySelectorAll('[data-v3401-answer]').forEach(btn=>btn.addEventListener('click',()=>{
      const pick=Number(btn.dataset.v3401Answer),correct=pick===Number(q.answer);
      card.querySelectorAll('[data-v3401-answer]').forEach(x=>x.disabled=true);
      btn.classList.add(correct?'correct':'incorrect');
      const fb=card.querySelector('.v3401Feedback');
      if(fb)fb.innerHTML='<b>'+(correct?'✓ Correct':'Not yet')+'</b> '+E(q.rationale);
      try{
        const p=prog(courseId);p.answers=Array.isArray(p.answers)?p.answers:[];
        p.answers.push({qid:q.id,chosen:q.options[pick],correct,at:Date.now(),source:'lesson-you-do',lessonId});
        if(p.answers.length>1200)p.answers=p.answers.slice(-1200);
        save();
      }catch(_){}
      try{window.MajickProductCore?.record?.('concept-complete',{course:courseId,lessonId,qid:q.id,correct})}catch(_){}
    }));
  });
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
  const groups=[['opening','Opening'],['teach','Teach'],['visual','Anchor Charts'],['example','Worked Example'],['turn','Your Turn'],['review','Review & Tutor']];
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
    const key=n.matches('.v3401Objectives,.tutorNext')?'opening':n.matches('.v3401Anchor')||n.querySelector('.v3401AnchorGrid')||text.includes('SEE IT')?'visual':n.matches('.v3401WeDo')?'example':n.matches('.v3401YouDo')?'turn':text.includes('TEACH ME')?'teach':'review';
    panels[key].append(n);
  });
  if(!panels.opening.querySelector('.v3401Objectives'))panels.opening.insertAdjacentHTML('afterbegin','<h3>What am I learning?</h3><p>'+E(lesson.goal||lesson.title)+'</p><h4>Lesson skills</h4><ul>'+(lesson.thinking||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>');
  panels.opening.insertAdjacentHTML('beforeend','<h4>What to watch for in questions</h4><ul>'+(lesson.traps||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>');
  if(!panels.example.children.length)panels.example.innerHTML='<p>'+E(helpFor(lesson)?.example||'A worked example has not been supplied for this lesson yet. Check the teaching notes and source coverage in Review.')+'</p>';
  if(!panels.turn.children.length)panels.turn.innerHTML='<p>Open Review & Tutor to use the lesson quick check or start adaptive practice.</p>';
  const footer=document.createElement('div');footer.className='classroomNavigation';footer.innerHTML='<button type="button" class="classroomPrevious">← Previous</button><span aria-live="polite"></span><button type="button" class="classroomNext">Next →</button>';
  const scrollTools=document.createElement('div');scrollTools.className='classroomScrollTools';scrollTools.setAttribute('aria-label','Parchment scrolling');
  scrollTools.innerHTML='<span>Lesson parchment</span><button type="button" aria-label="Scroll lesson up">↑ Up</button><button type="button" aria-label="Scroll lesson down">↓ Down</button><button type="button" aria-label="Return to top of lesson parchment">↑ Top</button>';
  scrollTools.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';if(i===2)stage.scrollTo({top:0,behavior:motion});else stage.scrollBy({top:(i===0?-1:1)*Math.max(150,stage.clientHeight*.65),behavior:motion})}));
  stage.tabIndex=0;stage.setAttribute('aria-label','Scrollable lesson parchment');
  box.append(nav,scrollTools,stage,footer);
  const classroomState=tutorState(cid());const remembered=classroomState.classroomSteps?.[lesson.id];
  let active=0;
  function select(index){active=index;classroomState.classroomSteps=classroomState.classroomSteps||{};classroomState.classroomSteps[lesson.id]=active;try{save()}catch(_){};groups.forEach(([key],i)=>{panels[key].hidden=i!==active;const b=nav.children[i];b.setAttribute('aria-selected',String(i===active));b.tabIndex=i===active?0:-1});footer.querySelector('span').textContent=(active+1)+' / '+groups.length+' · '+groups[active][1];footer.querySelector('.classroomPrevious').disabled=active===0;footer.querySelector('.classroomNext').disabled=active===groups.length-1}
  nav.querySelectorAll('button').forEach((b,i)=>{b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowRight'?1:-1)+groups.length)%groups.length;select(next);nav.children[next].focus()}})});
  footer.querySelector('.classroomPrevious').onclick=()=>select(active-1);footer.querySelector('.classroomNext').onclick=()=>select(active+1);
  function paginate(parent,nodes,label){if(nodes.length<2)return;let current=0;const controls=document.createElement('div');controls.className='classroomNavigation';const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('span');prev.type=next.type='button';prev.textContent='← '+label;next.textContent=label+' →';status.setAttribute('aria-live','polite');controls.append(prev,status,next);parent.append(controls);const update=()=>{nodes.forEach((n,i)=>n.hidden=i!==current);prev.disabled=current===0;next.disabled=current===nodes.length-1;status.textContent=label+' '+(current+1)+' of '+nodes.length};prev.onclick=()=>{current--;update()};next.onclick=()=>{current++;update()};update()}
  const teaching=panels.teach.querySelector('.tutorOfficialTeaching');if(teaching){paginate(teaching,Array.from(teaching.querySelectorAll('.tutorOfficialTopic')),'Concept');teaching.querySelectorAll('.tutorMemoryCues,.tutorSourceRefs').forEach(n=>panels.review.append(n))}
  const practice=panels.turn.querySelector('.v3401Practice');if(practice)paginate(practice,Array.from(practice.children),'Question');
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
  h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="path"><div id="courseTutorPath"></div></section><section class="learnPanel" data-panel="tutor" hidden><div id="courseTutorLesson"></div></section>');
  return h;
};
const baseBind=MajickLearningLab.bind;
MajickLearningLab.bind=function(){
  baseBind();
  document.querySelectorAll('[data-tutor-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.tutorTab)}));
  const bindingCourse=cid();
  setTimeout(()=>hydrate(bindingCourse).then(()=>{
    if(cid()!==bindingCourse||window.S?.screen!=='learninglab')return;
    show('tutor');
  }),30);
};
const baseRefresh=MajickLearningLab.refresh;
MajickLearningLab.refresh=function(){baseRefresh();hydrate()};
window.MajickCourseTutor={VERSION,D772_SECTION_ONE,D772_SECTION_TWO,D772_SECTION_THREE,D772_SECTION_ONE_CONTENT,D772_SECTION_TWO_CONTENT,D772_TUTOR_HELP,sectionUnits,allOfficialLessons,hydrate,sections,classifySource,annotateSource,tagD772Generated,classifyD772Item,d772Segments,sourcesForLesson,questionsForLesson,mastery,sectionProgress,chapter,mergeLessonTeaching,officialD772Content,startPractice,show,renderPath,renderTutor,renderTutorAssist,openLesson,selectedLesson};
})();
