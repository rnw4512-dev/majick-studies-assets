(()=>{
'use strict';

const VERSION='3.3.40';
const COURSE='D755';
const PHASES=['Teach','Anchor','Worked Example','Your Turn','New Scenario','Explain Why','Complete'];
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const clone=x=>JSON.parse(JSON.stringify(x));
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

const SECTIONS=[
{
 id:'d755-s1',number:1,title:'Assessment Foundations, Data Sources, and MTSS',
 competency:'Analyze a variety of data sources to inform the selection and development of formal, informal, and standardized measures that assess and monitor individuals with possible exceptionalities.',
 bigIdea:'Use the right assessment information, look for patterns, intervene early, monitor response, and individualize support instead of relying on one score or one label.',
 concepts:[
  {
   id:'s1-assessment-types',title:'Choose the Right Kind of Assessment',
   terms:['Qualitative assessment','Quantitative assessment','Informal assessment','Formal assessment','Formative assessment','Summative assessment','Criterion-referenced assessment','Curriculum-based assessment'],
   teach:'Assessment terms describe different dimensions of measurement. Qualitative assessment focuses on characteristics, qualities, and experiences; quantitative assessment uses numerical data. Informal assessment is flexible and embedded in everyday instruction, while formal assessment follows predetermined procedures and may be standardized. Formative assessment guides learning during instruction; summative assessment evaluates learning at a defined point. Criterion-referenced results are compared with a standard, and curriculum-based assessments provide frequent, brief measures tied directly to taught skills.',
   mental:'Ask PURPOSE first: describe, quantify, guide instruction, judge an endpoint, compare to a standard, or monitor a curriculum skill?',
   example:'A teacher uses a two-minute reading probe every Friday to see whether decoding instruction is working. The measure is brief, repeated, tied to the curriculum, and used formatively.',
   anchor:['QUALITATIVE = qualities / experiences','QUANTITATIVE = numbers','FORMATIVE = during learning','SUMMATIVE = endpoint','CRITERION-REFERENCED = against a standard','CURRICULUM-BASED = brief + frequent + tied to instruction'],
   trap:'WGU trap: one assessment can fit more than one description. Choose the term that answers the specific question being asked.',
   compare:['Formative','changes instruction while learning is happening','Summative','judges learning at a defined endpoint'],
   check:{prompt:'A teacher gives brief weekly reading probes tied to the phonics skills currently being taught and uses the results to adjust instruction. Which description best fits the purpose?',options:['Curriculum-based formative assessment','Summative standardized assessment','Age-equivalent assessment','Three-year reevaluation'],answer:'Curriculum-based formative assessment',why:'The measure is brief, repeated, curriculum-linked, and used during instruction to guide teaching.'},
   transfer:{prompt:'At the end of a unit, a teacher gives a structured test to evaluate what students learned. Which assessment purpose is primary?',options:['Summative assessment','Formative assessment','Universal screening','Functional behavior assessment'],answer:'Summative assessment',why:'The assessment evaluates learning at a defined endpoint rather than guiding instruction during the learning process.'},
   explain:'Explain why “formal” and “summative” are not synonyms.'
  },
  {
   id:'s1-data-sources',title:'Use Multiple Sources, Not One Score',
   terms:['Direct observation','Behavior checklist','Functional Behavior Assessment (FBA)','Student self-assessment','Anecdotal records','Progress monitoring'],
   teach:'A comprehensive picture comes from multiple sources. Direct observation records behavior in real time. Behavior checklists quantify frequency, intensity, or duration. An FBA systematically identifies the function of behavior. Student self-assessment adds the learner’s perspective. Anecdotal records provide narrative details about specific incidents. Progress monitoring provides repeated evidence about whether instruction or intervention is working over time.',
   mental:'One score answers one question. Educational decisions require a pattern across relevant evidence.',
   example:'A student has low reading scores, but the teacher also reviews work samples, observes the student during reading, speaks with the family, and examines weekly progress-monitoring data before deciding what support is needed.',
   anchor:['STANDARDIZED SCORE = one data source','OBSERVATION = what happens in context','ANECDOTAL RECORD = narrative incident evidence','PROGRESS MONITORING = response over time','FBA = function of behavior','BEST DECISIONS = relevant evidence combined'],
   trap:'WGU trap: the most comprehensive answer usually combines relevant data rather than relying solely on standardized scores, intuition, or one recent result.',
   compare:['Direct observation','real-time behavior in context','Behavior checklist','quantified ratings of behavior'],
   check:{prompt:'A teacher is trying to understand why a student repeatedly leaves their seat during independent work. Which tool is designed to identify the underlying function of the behavior?',options:['Functional Behavior Assessment (FBA)','Summative test','Percentile rank','Universal screening'],answer:'Functional Behavior Assessment (FBA)',why:'An FBA systematically examines patterns around behavior to identify its likely function.'},
   transfer:{prompt:'A team is planning support for a student with mixed academic and behavioral concerns. Which approach gives the most complete picture?',options:['Combine assessment scores, observations, progress data, and relevant family/student information','Use only the most recent standardized score','Use the disability label to select an intervention','Use teacher intuition without assessment evidence'],answer:'Combine assessment scores, observations, progress data, and relevant family/student information',why:'Multiple relevant data sources reveal patterns, strengths, needs, and context that a single score cannot provide.'},
   explain:'Why is relying on one standardized score weaker than examining a pattern across multiple relevant sources?'
  },
  {
   id:'s1-mtss',title:'MTSS / RTI: Screen → Support → Monitor → Adjust',
   terms:['MTSS','RTI','Universal screening','Progress monitoring','Targeted intervention','Intensive individualized intervention','Data-driven instruction'],
   teach:'MTSS is a framework for providing increasingly intensive academic and behavioral supports. Universal screening checks all students for risk. Students receive instruction or intervention matched to need. Progress monitoring shows whether support is working. Teachers then use the data to maintain, intensify, change, or fade support. RTI emphasizes students’ response to targeted intervention within this process.',
   mental:'SCREEN everyone → INTERVENE based on need → MONITOR response → ADJUST using data.',
   example:'A teacher screens the class, provides a targeted reading intervention to students below benchmark, checks progress weekly, and intensifies support for a student who does not respond adequately.',
   anchor:['UNIVERSAL SCREENING = WHO MAY NEED SUPPORT?','INTERVENTION = WHAT SUPPORT WILL WE TRY?','PROGRESS MONITORING = IS IT WORKING?','DATA-DRIVEN INSTRUCTION = WHAT SHOULD WE CHANGE?','INTENSIVE SUPPORT = more individualized when earlier support is insufficient'],
   trap:'WGU trap: MTSS helps identify and respond to need early; it does not allow a classroom teacher to diagnose a disability without a formal evaluation.',
   compare:['Universal screening','broad check of all students','Progress monitoring','repeated check of response to instruction/intervention'],
   check:{prompt:'A teacher assesses all students at the beginning of the term to identify who may need additional reading support. Which MTSS component is this?',options:['Universal screening','Progress monitoring','Three-year reevaluation','Prior Written Notice'],answer:'Universal screening',why:'Universal screening is administered broadly to identify students who may be at risk and need additional support.'},
   transfer:{prompt:'A student receives a targeted intervention for several weeks. The teacher collects weekly data and changes the intervention because growth is too slow. What is the teacher demonstrating?',options:['Progress monitoring and data-driven instruction','Summative testing only','A disability diagnosis','A permanent placement decision'],answer:'Progress monitoring and data-driven instruction',why:'Repeated data are being used to judge response and adjust instruction.'},
   explain:'Explain the difference between universal screening and progress monitoring in one sentence each.'
  },
  {
   id:'s1-prereferral',title:'Pre-Referral, IAT, and Early Intervention',
   terms:['Pre-referral process','Intervention Assistance Team (IAT)','PBIS','SEL','Discrepancy approach'],
   teach:'The pre-referral process addresses academic or behavioral difficulty before a formal special-education referral. An intervention team reviews concerns, supports, and student response. PBIS emphasizes proactive positive behavior supports; SEL develops skills such as emotion management, empathy, relationships, and responsible decision-making. A discrepancy approach focuses on a gap between expected and actual performance.',
   mental:'Concern → targeted support → collect response data → collaborate → decide whether more support or formal evaluation is needed.',
   example:'A second-grade teacher provides small-group math intervention, tracks progress, and brings the student’s response data to the intervention team before a formal referral.',
   anchor:['PRE-REFERRAL = support before formal referral','IAT = collaborative problem-solving team','INTERVENE + MONITOR before assuming disability','PBIS = proactive behavior support','SEL = social-emotional skills'],
   trap:'WGU trap: targeted pre-referral intervention is not the same as conducting a formal special-education evaluation.',
   compare:['Pre-referral intervention','support + data before formal referral','Formal evaluation','evaluation used for eligibility decisions'],
   check:{prompt:'A teacher is providing targeted small-group math instruction, tracking progress, and adjusting support before any formal special-education evaluation. Which stage best describes the work?',options:['Pre-referral targeted intervention','Initial placement','Annual IEP review','Three-year reevaluation'],answer:'Pre-referral targeted intervention',why:'The teacher is implementing and monitoring support before a formal special-education referral/evaluation.'},
   transfer:{prompt:'A student has not responded adequately to earlier supports, so the school team designs more intensive, individualized intervention and monitors the response closely. What is the most appropriate description?',options:['Intensive individualized MTSS support','Universal instruction only','A completed special-education eligibility decision','Summative assessment'],answer:'Intensive individualized MTSS support',why:'Support is becoming more intensive and individualized because earlier intervention was insufficient.'},
   explain:'Why should a team examine response to intervention before assuming that persistent difficulty automatically means a disability?'
  },
  {
   id:'s1-quality-law',title:'Reliability, Bias, and Legal Guardrails',
   terms:['Reliability','Internal consistency','Test-retest reliability','Inter-rater reliability','Bias','Cultural bias','Language bias','Disability bias','Child Find','Parental consent','Section 504','FERPA','ADA','LEA'],
   teach:'Reliable assessment produces consistent information. Internal consistency concerns whether items measure the same construct coherently; test-retest reliability concerns stability across time; inter-rater reliability concerns agreement across examiners. Bias can systematically advantage or disadvantage students because of culture, language, disability, or other characteristics. Child Find requires public schools to identify, locate, and evaluate children who may need special education. FERPA protects educational-record privacy; Section 504 and the ADA protect access and nondiscrimination. Parental consent is required for an initial special-education evaluation.',
   mental:'Before using a result, ask: Is the tool consistent? Is it fair for this student? Is the process legally appropriate?',
   example:'If two trained evaluators score the same performance very differently, the concern is inter-rater reliability. If an English-heavy assessment measures language proficiency more than the target skill, language bias may distort the result.',
   anchor:['RELIABILITY = consistency','TEST-RETEST = same test across time','INTER-RATER = different scorers agree','BIAS = systematic advantage/disadvantage','CHILD FIND = identify + locate + evaluate','INITIAL EVALUATION = informed parental consent first'],
   trap:'WGU trap: legal protections and assessment quality are not side issues; they determine whether results can be used fairly and appropriately.',
   compare:['Test-retest reliability','consistency across time','Inter-rater reliability','consistency across scorers'],
   check:{prompt:'Two evaluators observe the same student performance but assign very different scores. Which assessment-quality concern is most directly implicated?',options:['Inter-rater reliability','Test-retest reliability','Internal consistency','Universal screening'],answer:'Inter-rater reliability',why:'Inter-rater reliability concerns whether different examiners score the same performance consistently.'},
   transfer:{prompt:'A referral team has decided that a comprehensive initial special-education evaluation is needed. What must occur before the formal evaluation proceeds?',options:['Obtain informed parental consent','Write the final IEP','Assign a disability category immediately','Wait until the annual IEP meeting'],answer:'Obtain informed parental consent',why:'Informed written parental consent is required before conducting an initial special-education evaluation.'},
   explain:'Why must a teacher consider both reliability and potential bias when interpreting an assessment result?'
  }
 ]
},
{
 id:'d755-s2',number:2,title:'Interpreting Assessment Results and Making Educational Decisions',
 competency:'Interpret assessment results to inform educational decisions for individuals with exceptionalities.',
 bigIdea:'Do not read scores in isolation. Interpret the pattern, compare it with appropriate expectations, combine quantitative and qualitative evidence, and connect findings to individualized goals and interventions.',
 concepts:[
  {
   id:'s2-score-types',title:'Raw, Scaled, Standard, Percentile, and Equivalent Scores',
   terms:['Raw score','Scaled score','Standard score','Percentile rank','Grade-level equivalent','Age-level equivalent','Composite score','Subtest score','IQ score'],
   teach:'A raw score is the initial number of correct responses or points earned. A scaled score converts the raw score to a common scale. A standard score places performance on a distribution with a specified mean and standard deviation. Percentile rank reports the percentage of the norm group scoring at or below the student. Grade- and age-level equivalents indicate the grade or age corresponding to a raw-score performance level; they are not statements that the student has all skills of that grade or age. Composite scores combine multiple subtests, while subtest scores reveal performance in specific components. IQ scores are norm-referenced measures of intellectual ability, commonly centered at 100 with a standard deviation of 15.',
   mental:'Ask what the score is comparing: raw points, transformed scale, norm position, equivalent level, one subskill, or a combined profile.',
   example:'A student can have an average composite score while one reading-related subtest is substantially weaker. The subtest pattern may reveal a specific instructional need that the overall composite hides.',
   anchor:['RAW = points earned','SCALED = raw converted to common scale','STANDARD = position on defined distribution','PERCENTILE = % of norm group at or below','COMPOSITE = several subtests combined','SUBTEST = one specific component'],
   trap:'WGU trap: an average overall score does not erase a meaningful weakness in a specific subtest.',
   compare:['Composite score','combined performance across subtests','Subtest score','performance on one specific component'],
   check:{prompt:'A student earns 37 points on a test, and that result is converted to a score on a common scale so different test forms can be compared. What is the converted score called?',options:['Scaled score','Raw score','Percentile rank','Grade-level equivalent'],answer:'Scaled score',why:'A scaled score converts the raw result to a common scale that supports comparison across forms or versions.'},
   transfer:{prompt:'A student’s overall composite is average, but a reading-decoding subtest is substantially lower than the other subtests. What is the most useful interpretation?',options:['The specific subtest weakness deserves closer instructional attention','The average composite proves there is no area of need','Only the highest subtest should guide planning','The low subtest should be ignored because composites are always more important'],answer:'The specific subtest weakness deserves closer instructional attention',why:'Patterns across composite and subtest scores can reveal specific strengths and needs that an overall score can mask.'},
   explain:'Why should an educator examine both composite and subtest scores rather than relying on only the composite?'
  },
  {
   id:'s2-norms',title:'Bell Curve, Norm-Referenced, Criterion-Referenced, and Standard Deviation',
   terms:['Bell curve','Norm-referenced score','Criterion-referenced score','Mean','Median','Mode','Range','Standard deviation'],
   teach:'A bell curve represents a normal distribution with many scores near the average and fewer at the extremes. Norm-referenced scores compare a student with a representative peer group. Criterion-referenced scores compare performance with a predetermined standard. Mean is the arithmetic average, median is the middle ordered value, mode is the most frequent value, and range is highest minus lowest. Standard deviation describes how spread out scores are around the mean; a smaller standard deviation means scores cluster more tightly.',
   mental:'NORM = compare to people. CRITERION = compare to a standard. STANDARD DEVIATION = how spread out.',
   example:'A percentile rank is norm-referenced because it locates a student relative to the norm group. A mastery test showing whether a student met a defined reading standard is criterion-referenced.',
   anchor:['NORM-REFERENCED = student vs. norm group','CRITERION-REFERENCED = student vs. standard','MEAN = arithmetic average','MEDIAN = middle','MODE = most frequent','STANDARD DEVIATION = spread around mean'],
   trap:'WGU trap: percentile rank is a position in a norm group, not the percentage of test items answered correctly.',
   compare:['Norm-referenced','compares with peers/norm group','Criterion-referenced','compares with a defined standard'],
   check:{prompt:'A score reports that a student performed as well as or better than 42% of the norm group. Which score is being described?',options:['Percentile rank','Raw score','Range','Grade-level equivalent'],answer:'Percentile rank',why:'Percentile rank indicates the percentage of the norm group scoring at or below the student’s score.'},
   transfer:{prompt:'A reading assessment reports whether a student met a predetermined grade-level skill standard rather than comparing the student with peers. What kind of interpretation is this?',options:['Criterion-referenced','Norm-referenced','Age-equivalent','IQ-based'],answer:'Criterion-referenced',why:'Criterion-referenced scores compare performance with a defined standard or criterion.'},
   explain:'Explain why percentile rank and percentage correct are not the same thing.'
  },
  {
   id:'s2-domains',title:'What Domain Is Being Assessed?',
   terms:['Behavior rating scale','Emotional quotient (EQ)','Receptive language','Expressive language','Adaptive behavior','Social skills','Fine motor skills','Gross motor skills','Health assessment','Physical assessment'],
   teach:'Different tools answer different questions. Behavior rating scales quantify behavior patterns using ratings from teachers, family, or the student. Receptive language concerns understanding spoken or written language; expressive language concerns using language to communicate. Adaptive behavior includes everyday functioning such as communication, self-care, social skills, and community living. Fine motor measures small-muscle dexterity and coordination; gross motor measures large-muscle movement. Health and physical assessments address medical/overall health or physical abilities.',
   mental:'Match the tool to the concern: understand language, express language, function independently, regulate behavior, move small muscles, move large muscles, or evaluate health.',
   example:'A student follows spoken directions poorly but speaks in complete sentences. The concern points more directly toward receptive than expressive language.',
   anchor:['RECEPTIVE = understand language','EXPRESSIVE = use language','ADAPTIVE = daily functioning','FINE MOTOR = hands/fingers','GROSS MOTOR = large-muscle movement','BEHAVIOR RATING = frequency/intensity patterns'],
   trap:'WGU trap: choose the assessment domain that directly matches the observed concern instead of selecting a broad test just because it is standardized.',
   compare:['Receptive language','understands language','Expressive language','uses language to communicate'],
   check:{prompt:'A student can explain ideas clearly but often cannot follow spoken multi-step directions. Which domain most directly matches the concern?',options:['Receptive language','Expressive language','Fine motor skills','Gross motor skills'],answer:'Receptive language',why:'Receptive language concerns understanding spoken or written language.'},
   transfer:{prompt:'A team wants information about a student’s communication, self-care, social functioning, and everyday independence. Which assessment domain fits best?',options:['Adaptive behavior','Fine motor','IQ only','Summative achievement'],answer:'Adaptive behavior',why:'Adaptive behavior scales assess daily living and functioning across areas such as communication, self-care, social skills, and community living.'},
   explain:'Why is it important to match the assessment domain to the specific concern rather than simply choosing the broadest test available?'
  },
  {
   id:'s2-multiple-data',title:'Interpret Patterns Across Multiple Data Sources',
   terms:['Observation','Student interview','Parent report','Work sample','Standardized test','Screening assessment','Progress monitoring','Diagnostic assessment','Basal data','Ceiling data'],
   teach:'Interpretation should integrate quantitative and qualitative information. Observations show performance in context; interviews and parent reports provide perspectives and developmental/contextual information; work samples show authentic performance over time; standardized tests provide consistently administered comparisons. Screening identifies possible risk, progress monitoring tracks response over time, and diagnostic assessment pinpoints specific areas needing additional instruction. Basal data identify a level of secure performance; ceiling data identify the point at which difficulty exceeds the student’s current capacity.',
   mental:'PATTERN > single point. Ask what multiple sources agree on, where they disagree, and what additional information is needed.',
   example:'A student’s standardized reading score is low, weekly work samples show persistent decoding errors, and progress-monitoring growth is flat. Together, the pattern supports targeted investigation and intervention more strongly than any one source alone.',
   anchor:['OBSERVATION = context','WORK SAMPLE = authentic performance over time','SCREENING = identify risk','PROGRESS MONITORING = track response','DIAGNOSTIC = pinpoint skill need','INTERPRETATION = patterns + trends + error types'],
   trap:'WGU trap: the strongest educational decision is rarely “use only the standardized test score.”',
   compare:['Screening','who may be at risk?','Diagnostic','what specific skill needs instruction?'],
   check:{prompt:'A teacher wants to identify the specific reading skill causing a student’s persistent difficulty after screening showed risk. Which assessment purpose is most appropriate?',options:['Diagnostic assessment','Universal screening','Summative assessment','Annual IEP meeting'],answer:'Diagnostic assessment',why:'Diagnostic assessment is used to pinpoint the specific area needing additional instruction.'},
   transfer:{prompt:'A teacher is interpreting a student’s evaluation results. Which approach is most appropriate?',options:['Examine patterns across test scores, observations, work samples, and progress data','Use only the highest score to identify strengths','Use only the most recent result','Ignore qualitative information because it is not numerical'],answer:'Examine patterns across test scores, observations, work samples, and progress data',why:'Combining quantitative and qualitative evidence gives a more complete picture of strengths, needs, and performance patterns.'},
   explain:'Why can error patterns across work samples and progress data be more instructionally useful than simply knowing a total score?'
  },
  {
   id:'s2-decisions',title:'Turn Assessment Results Into Individualized Decisions',
   terms:['Strengths','Areas of need','Grade-level expectations','Individualized goals','Intervention','Learning profile'],
   teach:'Assessment results should guide decisions, not define a student’s overall potential. Effective interpretation identifies strengths, areas of need, patterns, trends, and specific error types. Recommendations should be individualized to the student’s learning profile and aligned with the assessment evidence. Comparing academic performance with relevant grade-level expectations can help identify the size and nature of an instructional gap.',
   mental:'DATA → PATTERN → STRENGTHS + NEEDS → INDIVIDUALIZED DECISION.',
   example:'If a fifth-grade reader shows decoding and comprehension difficulty with grade-level text, first identify how current performance compares with grade-level expectations, then target the specific gaps rather than selecting a generic “reading intervention.”',
   anchor:['LOOK FOR PATTERNS + TRENDS','BALANCE STRENGTHS + NEEDS','COMPARE WITH APPROPRIATE EXPECTATIONS','INDIVIDUALIZE THE PLAN','INTERVENTION MUST MATCH THE DATA'],
   trap:'WGU trap: reject one-size-fits-all recommendations, generic disability-label interventions, and choices based mainly on convenience.',
   compare:['Data-based intervention','matches this student’s demonstrated need','Generic intervention','chosen because it worked for someone else'],
   check:{prompt:'A student’s assessment profile shows strong oral vocabulary but persistent decoding errors. What should the teacher prioritize when planning support?',options:['Target decoding while using the student’s oral-language strength to support instruction','Use the same plan given to every student with a reading disability','Ignore the strength and focus only on deficits','Choose the intervention that is easiest to schedule'],answer:'Target decoding while using the student’s oral-language strength to support instruction',why:'Effective planning uses both strengths and needs and aligns intervention with this student’s data.'},
   transfer:{prompt:'A teacher reviews individual and class-wide assessment results. What is the most useful next step for a student showing a consistent pattern of one error type?',options:['Adjust the student’s learning plan to target the specific error pattern','Wait for the student to request help','Use only the class average to make the decision','Replace the plan with a generic intervention'],answer:'Adjust the student’s learning plan to target the specific error pattern',why:'Specific error patterns provide actionable information for individualized instructional planning.'},
   explain:'Why should assessment results guide individualized support without being treated as a fixed definition of the student’s ability or potential?'
  },
  {
   id:'s2-eligibility',title:'Eligibility, Placement, and Procedural Decisions',
   terms:['Multidisciplinary Team (MDT)','Least Restrictive Environment (LRE)','Free Appropriate Public Education (FAPE)','2-pronged test','Individualized Assessment Plan (IAP)','Prior Written Notice','Parental consent','Intellectual disability','Autism','Specific learning disability','Other health impairment'],
   teach:'Special-education decisions are made through multidisciplinary processes and legal safeguards. The MDT evaluates information and determines eligibility. LRE means educating students with disabilities with nondisabled peers to the maximum extent appropriate. FAPE guarantees appropriate educational services at no cost to the family. Prior Written Notice communicates proposed or refused evaluation/placement actions. Parental consent is required before an initial evaluation and initial provision of special-education services. Eligibility is based on criteria and educational impact, not merely on a diagnosis or label.',
   mental:'Eligibility and placement are TEAM + DATA + PROCEDURE decisions.',
   example:'A medical diagnosis of ADHD can be relevant, but special-education decisions still require evaluation of educational impact and eligibility criteria; the diagnosis alone does not automatically dictate placement.',
   anchor:['MDT = collaborative evaluation + eligibility decision','LRE = maximum appropriate participation with nondisabled peers','FAPE = appropriate services at no family cost','PWN = communicate proposed/refused action','CONSENT = required before initial evaluation','LABEL ≠ automatic placement'],
   trap:'WGU trap: do not choose a more restrictive placement simply because a student has a disability label.',
   compare:['FAPE','appropriate services at no cost','LRE','education with nondisabled peers to maximum extent appropriate'],
   check:{prompt:'A team has completed its review and wants to conduct an initial comprehensive special-education evaluation. What procedural step is required first?',options:['Obtain informed written parental consent','Write the final IEP before evaluation','Choose the most restrictive placement','Wait for a three-year reevaluation'],answer:'Obtain informed written parental consent',why:'Parental consent is required before the initial formal evaluation proceeds.'},
   transfer:{prompt:'A student has a disability and can succeed in general education with appropriate supplementary supports. Which IDEA principle most directly guides placement?',options:['Least Restrictive Environment (LRE)','Percentile rank','Inter-rater reliability','Universal screening'],answer:'Least Restrictive Environment (LRE)',why:'LRE directs schools to educate students with disabilities alongside nondisabled peers to the maximum extent appropriate.'},
   explain:'Why should a disability label never be used by itself to select a placement or intervention?'
  }
 ]
},
{
 id:'d755-s3',number:3,title:'Evaluation Communication and Measurable Outcomes',
 competency:'Communicate the results of the student evaluation process related to measurable outcomes.',
 bigIdea:'Communicate complete, understandable, data-based findings so families and professionals can make informed decisions, set measurable goals, monitor progress, and adjust support.',
 concepts:[
  {
   id:'s3-timeline',title:'Initial Evaluation → Annual IEP → Three-Year Re-evaluation',
   terms:['Initial evaluation','Annual IEP meeting','Three-year re-evaluation'],
   teach:'The initial evaluation identifies areas of concern and plans assessment across relevant domains. The annual IEP meeting reviews progress toward goals and adjusts the IEP using current assessment data and classroom observations. The three-year re-evaluation is a major checkpoint for reviewing progress and determining whether the student continues to meet eligibility requirements.',
   mental:'INITIAL = identify and assess. ANNUAL = review progress and adjust. 3-YEAR = reassess eligibility and overall need.',
   example:'A team preparing to evaluate a student for the first time discusses concerns, assessment domains, and parental consent. A year later, the IEP team reviews goal progress. At reevaluation, the team determines whether eligibility and needs continue.',
   anchor:['INITIAL EVALUATION = identify concerns + areas to assess','ANNUAL IEP = progress toward goals + adjust plan','3-YEAR RE-EVALUATION = eligibility + progress checkpoint'],
   trap:'WGU trap: do not begin writing an initial IEP before the initial evaluation and eligibility process are complete.',
   compare:['Annual IEP meeting','review progress and adjust IEP','Three-year reevaluation','reassess eligibility and current needs'],
   check:{prompt:'A team is meeting to review a student’s progress toward existing IEP goals and revise supports based on current data. Which meeting is this?',options:['Annual IEP meeting','Initial evaluation planning','Universal screening','Pre-referral meeting only'],answer:'Annual IEP meeting',why:'The annual IEP meeting reviews progress toward goals and adjusts the plan using current evidence.'},
   transfer:{prompt:'A team is conducting a major review to determine whether a student continues to meet special-education eligibility requirements. Which process best fits?',options:['Three-year re-evaluation','Daily progress monitoring','Universal screening','Formative classroom assessment'],answer:'Three-year re-evaluation',why:'The three-year reevaluation is a formal checkpoint for reassessing eligibility and reviewing progress.'},
   explain:'Explain the different decision each of the three evaluation checkpoints is designed to support.'
  },
  {
   id:'s3-communication',title:'Communicate Findings for Understanding and Action',
   terms:['Stakeholders','Transparency','Accountability','Limitations','Accessible communication'],
   teach:'The purpose of communicating evaluation findings is to give stakeholders a clear, complete picture of student progress, strengths, needs, and implications so they can make informed decisions about support. Transparency means sharing relevant data, interpretations, and limitations openly. Accountability is strengthened when information is clear, specific, and open to questions. Communication should be accessible without hiding important information or drowning families in unnecessary jargon.',
   mental:'CLEAR + COMPLETE + ACCESSIBLE + QUESTIONS WELCOME.',
   example:'Instead of saying “the standard score is low,” explain what the score suggests, connect it with classroom evidence, note relevant limitations, and invite questions about what the result means for instruction.',
   anchor:['CLEAR = understandable language','COMPLETE = relevant strengths + needs + data','TRANSPARENT = interpretations + limitations','ACCESSIBLE = visuals when useful','ACCOUNTABLE = invite questions + clarify next steps'],
   trap:'WGU trap: simplifying communication does not mean hiding concerns, omitting limitations, or sharing only positive findings.',
   compare:['Accessible communication','makes complete information understandable','Oversimplification','removes important meaning or limitations'],
   check:{prompt:'Which communication approach best supports transparency when sharing evaluation results with a family?',options:['Explain relevant findings, interpretations, limitations, and invite questions','Share only positive findings to protect morale','Use technical jargon without explanation','Provide only a total score with no context'],answer:'Explain relevant findings, interpretations, limitations, and invite questions',why:'Transparent communication shares relevant evidence and limitations clearly while giving stakeholders a chance to ask questions.'},
   transfer:{prompt:'Why should a teacher communicate assessment findings to stakeholders?',options:['To clarify student progress and inform decisions about support and intervention','To make the data appear more scientific','To replace collaborative discussion','To avoid discussing areas of need'],answer:'To clarify student progress and inform decisions about support and intervention',why:'Communication is useful when it helps stakeholders understand progress and make informed educational decisions.'},
   explain:'How can an educator make evaluation results easier to understand without leaving out important limitations or areas of concern?'
  },
  {
   id:'s3-visuals',title:'Match the Visual to the Message',
   terms:['Line graph','Bar graph','Pie chart','Data visualization'],
   teach:'Visual aids can make evaluation results clearer and more accessible. Choose the visual that matches the communication goal. A line graph is especially useful for change or trends across time. A bar graph is useful for comparing categories or discrete results. A pie chart can communicate parts of a whole when proportions are the message. The visual should clarify the data, not decorate or distort it.',
   mental:'TIME → line. CATEGORIES → bars. PARTS OF A WHOLE → pie.',
   example:'To show a student’s reading and math scores across six assessment dates, use a line graph with separate lines so the family can see growth trends in both subjects.',
   anchor:['LINE = change over time','BAR = compare categories','PIE = parts of a whole','GOOD VISUAL = clearer understanding, not decoration'],
   trap:'WGU trap: choose the graph based on the communication purpose, not because it looks attractive.',
   compare:['Line graph','trend/change over time','Bar graph','category comparison'],
   check:{prompt:'A teacher wants to show how reading fluency changed across eight weekly progress-monitoring checks. Which visual is most effective?',options:['Line graph','Pie chart','Venn diagram','Single bar showing only the final score'],answer:'Line graph',why:'A line graph clearly displays change and trends across repeated measurements over time.'},
   transfer:{prompt:'A teacher wants to compare current performance in reading, writing, and math on the same reporting date. Which visual is most appropriate?',options:['Bar graph','Line graph requiring multiple time points','Pie chart of unrelated totals','Narrative only with no visual'],answer:'Bar graph',why:'A bar graph is well suited for comparing discrete categories at a particular point.'},
   explain:'Why is a line graph usually more informative than a single bar when the key question is whether a student is improving over time?'
  },
  {
   id:'s3-goals',title:'From Evaluation Results to Measurable Goals',
   terms:['Measurable outcome','Specific goal','Attainable goal','Intervention strategy','Progress monitoring'],
   teach:'Evaluation results should lead to specific, attainable, measurable goals tied to the student’s current performance and needs. Interventions should be chosen because they address the identified need, not because they worked for another student or are easiest to implement. Progress monitoring then shows whether the student is moving toward the measurable outcome so the team can adjust support.',
   mental:'CURRENT DATA → SPECIFIC NEED → MEASURABLE GOAL → MATCHED INTERVENTION → MONITOR → ADJUST.',
   example:'If data show a student loses accuracy on multi-step directions during independent work, a goal should specify an observable improvement target and the team should select supports related to that need rather than simply assigning a generic behavior goal.',
   anchor:['GOAL = specific + attainable + measurable','INTERVENTION = matched to demonstrated need','MONITOR = collect repeated evidence','ADJUST = respond to growth or lack of growth'],
   trap:'WGU trap: reject generic goals based only on a disability label or goals chosen because they are convenient.',
   compare:['Individualized measurable goal','tied to current data and trackable','Generic goal','not linked to the student’s demonstrated need'],
   check:{prompt:'Assessment data show a student with ADHD has difficulty sustaining attention during independent work and routinely needs extra time. What is the strongest approach to goal planning?',options:['Develop specific, attainable goals tied to the student’s current performance data','Use the same goals given to every student with ADHD','Choose the most restrictive setting first','Set a vague long-term goal without a measurable target'],answer:'Develop specific, attainable goals tied to the student’s current performance data',why:'Effective goals are individualized, measurable, and grounded in the student’s current performance and needs.'},
   transfer:{prompt:'A student’s intervention has produced little growth across several progress-monitoring checks. What should the team do?',options:['Adjust the intervention based on the response data','Continue indefinitely because changing support would reduce consistency','Ignore the progress data and wait for the annual meeting','Give every student the same level of support'],answer:'Adjust the intervention based on the response data',why:'Ongoing progress monitoring is used to determine whether intervention should be maintained or changed.'},
   explain:'Why must measurable goals be anchored to current assessment data rather than to the disability label alone?'
  },
  {
   id:'s3-eval-meeting',title:'Initial Evaluation Meetings: Consent + Areas to Assess',
   terms:['Parental consent','Areas of concern','Multidisciplinary Team','Initial evaluation'],
   teach:'Before an initial formal special-education evaluation, the team must obtain informed written parental consent. The team and family should also identify the specific areas of concern so the evaluation addresses relevant cognitive, academic, communication, behavioral, physical, or other needs. The purpose is to build an appropriate evaluation plan—not to pre-decide eligibility or write an IEP before evaluation is completed.',
   mental:'BEFORE INITIAL EVALUATION: consent + decide what needs to be assessed.',
   example:'After RTI interventions and monitoring, a team suspects persistent reading and direction-following difficulties. At the initial evaluation meeting, the team obtains consent and plans assessment of the relevant academic and language/cognitive areas.',
   anchor:['INITIAL EVALUATION STARTS WITH CONCERNS','DISCUSS RELEVANT AREAS TO ASSESS','OBTAIN INFORMED WRITTEN PARENTAL CONSENT','DO NOT PRE-JUDGE ELIGIBILITY OR PLACEMENT'],
   trap:'WGU trap: “start the evaluation immediately” is wrong when parental consent has not yet been obtained.',
   compare:['Evaluation planning','identify concerns + assessment areas + consent','IEP development','occurs after eligibility when special education is appropriate'],
   check:{prompt:'A multidisciplinary team and a student’s parents are preparing for the student’s first special-education evaluation. What should they do before formal testing begins?',options:['Obtain written parental consent and identify the areas that need assessment','Create the final IEP immediately','Select a disability category before collecting evaluation data','Choose a restrictive placement to reduce distractions'],answer:'Obtain written parental consent and identify the areas that need assessment',why:'Initial evaluation requires informed parental consent, and the evaluation plan should address the student’s relevant areas of concern.'},
   transfer:{prompt:'Why should a team discuss specific areas of concern before selecting evaluation tools?',options:['So the evaluation gathers relevant evidence about the student’s actual needs','So the team can guarantee a disability category','So the school can avoid family participation','So only one broad standardized test is needed'],answer:'So the evaluation gathers relevant evidence about the student’s actual needs',why:'Assessment selection should be driven by the concerns and questions the evaluation needs to answer.'},
   explain:'Why is it inappropriate to write the final IEP before the initial evaluation and eligibility decision are complete?'
  }
 ]
}
];

const TRAPS=[
 {id:'one-score',title:'One Score Is Not the Whole Student',wrong:'Rely on one standardized score, one recent result, or one disability label.',right:'Combine relevant quantitative and qualitative evidence and look for patterns across sources.'},
 {id:'screen-progress',title:'Screening ≠ Progress Monitoring',wrong:'Treat screening as ongoing evidence of intervention response.',right:'Screening identifies risk broadly; progress monitoring tracks response repeatedly over time.'},
 {id:'four-point',title:'Read the Data Pattern Before Acting',wrong:'Change intervention because of one unusual data point.',right:'Use the recent pattern: four points below the goal line calls for an instructional change; four above suggests raising the goal; points around the line support continuing the plan.'},
 {id:'process-order',title:'Know Where the Student Is in the Journey',wrong:'Jump directly from concern to special-education eligibility or placement.',right:'Follow the sequence: concern → data/differentiation → IAT/intervention → progress monitoring/review → referral if needed → MDT evaluation → eligibility → IEP.'},
 {id:'mtss-diagnosis',title:'MTSS Does Not Diagnose',wrong:'Assume intervention data alone lets a classroom teacher diagnose a disability.',right:'MTSS supports early identification and intervention; formal eligibility requires an appropriate multidisciplinary evaluation and team decision.'},
 {id:'pbis-sel',title:'PBIS ≠ SEL',wrong:'Treat behavior-system data and social-emotional skill instruction as the same thing.',right:'PBIS uses behavior data to adjust supports; SEL develops and assesses skills such as self-awareness, regulation, relationships, and decision-making.'},
 {id:'rti-discrepancy',title:'RTI ≠ Discrepancy Model',wrong:'Use responsiveness to intervention and IQ-achievement discrepancy as interchangeable evidence.',right:'RTI examines response to instruction/intervention; the discrepancy model compares intellectual and achievement performance.'},
 {id:'validity-reliability',title:'Validity ≠ Reliability',wrong:'Assume a consistent test automatically measures the right construct.',right:'Reliability is consistency. Validity asks whether the assessment supports the intended interpretation or use.'},
 {id:'bias',title:'Assessment Fairness Matters',wrong:'Use an assessment result without considering language, cultural, or disability-related barriers.',right:'Check whether the tool and administration are appropriate and mitigate sources of bias before using the result for decisions.'},
 {id:'mastery-gom',title:'Mastery ≠ General Outcome Measurement',wrong:'Use a micro-skill mastery check as if it measures broad long-term growth.',right:'Mastery measures targeted skills; GOM samples broader performance repeatedly to monitor overall growth.'},
 {id:'strengths-needs',title:'Strengths AND Needs',wrong:'Focus exclusively on deficits or only on the highest score.',right:'Build a balanced profile of strengths, needs, patterns, and instructional implications.'},
 {id:'consent',title:'Consent Before Initial Evaluation',wrong:'Proceed immediately once the team thinks evaluation is needed.',right:'Obtain informed written parental consent before the initial formal evaluation.'},
 {id:'eligibility',title:'Eligibility Requires Both Prongs',wrong:'Treat meeting a disability category as automatically sufficient for special education.',right:'The student must meet disability criteria AND need special education/related services or specially designed instruction; determinant factors must also be considered.'},
 {id:'label-plan',title:'Label ≠ Individualized Plan',wrong:'Use the same intervention or placement for everyone with the same disability label.',right:'Match goals, interventions, services, and placement decisions to this student’s data and educational needs.'},
 {id:'significant-score',title:'Composite ≠ Complete Profile',wrong:'Let an average composite erase an important subtest weakness.',right:'Interpret the pattern across composite and subtest scores and connect it to functional and academic evidence.'},
 {id:'plaaft',title:'PLAAFP Drives the IEP',wrong:'Write goals before describing current performance, strengths, concerns, and educational impact.',right:'Use qualitative and quantitative baseline data in the PLAAFP to identify the needs the IEP must address.'},
 {id:'goal',title:'Measurable Goals Need C-B-C',wrong:'Write a vague goal such as “will improve reading.”',right:'Use a condition, a measurable/observable behavior, and mastery criteria tied to current data.'},
 {id:'communication',title:'Clear Does Not Mean Incomplete',wrong:'Hide limitations, omit concerns, or use vague summaries to keep communication simple.',right:'Present relevant findings, interpretations, limitations, and next steps in understandable language while inviting family questions.'}
];

function realmTopic(section,concept){
 const t=String(concept||'').toLowerCase();
 if(section===1){
   if(/assessment purpose|formal informal|criterion cbm/.test(t))return 's1-assessment-types';
   if(/data sources|qualitative quantitative/.test(t))return 's1-data-sources';
   if(/screening|tier movement|rti discrepancy/.test(t))return 's1-mtss';
   if(/pre-referral|pbis sel/.test(t))return 's1-prereferral';
   return 's1-quality-law';
 }
 if(section===2){
   if(/percentile|standard score|score profile/.test(t))return 's2-score-types';
   if(/mastery gom|multiple data|family collaboration/.test(t))return 's2-multiple-data';
   if(/referral|mdt|consent|eligibility|assessment plan/.test(t))return 's2-eligibility';
   return 's2-decisions';
 }
 if(/plaaft|goal writing|progress reporting/.test(t))return 's3-goals';
 if(/services|lre|accommodations|services schedule|iep team/.test(t))return 's3-eval-meeting';
 if(/communication|collaboration|ethics|law/.test(t))return 's3-communication';
 if(/visual|graph/.test(t))return 's3-visuals';
 return 's3-timeline';
}
function q(id,section,concept,prompt,options,answer,why,trap,visual){
 const topicId=realmTopic(section,concept);
 return {id:'d755_wgu_'+id,course:COURSE,section,concept,topicId,difficulty:visual?4:3,format:'scenario',prompt,options,answer,why,keyClue:why,trap:trap||'',visual:visual||'',teacherFocus:true,style:'wgu-course-scenario',source:'d755-teacher-focus-2026-09-26'};
}
const BANK=[
 // SECTION 1 — DATA ANALYSIS, PRE-REFERRAL, MTSS/RTI, ASSESSMENT QUALITY
 q('tf_s1_01',1,'data sources','Mason’s weekly progress-monitoring scores vary sharply from week to week. What should the teacher do before deciding the intervention is ineffective?',['Move Mason immediately to Tier 3','Compare the progress data with work samples, observations, and other relevant evidence','Use only the lowest score because it shows the greatest need','Refer Mason immediately for special education'],'Compare the progress data with work samples, observations, and other relevant evidence','Inconsistent data should be investigated using multiple relevant sources so the team can determine whether the pattern reflects skill, context, measurement, or intervention factors.','one-score'),
 q('tf_s1_02',1,'qualitative quantitative','Jordan performs well on multiple-choice tests but struggles to explain reasoning in open-ended tasks. Which additional evidence would best help the team understand the discrepancy?',['Another percentile rank from the same test','Only the class average','Work samples and observation of Jordan completing open-ended tasks','A disability label from a prior year'],'Work samples and observation of Jordan completing open-ended tasks','Qualitative evidence can reveal the processes, strategies, and errors that a numerical score may not show.','one-score'),
 q('tf_s1_03',1,'assessment purpose','During instruction, a teacher uses an exit ticket and changes tomorrow’s lesson because most students missed the same concept. Which type of assessment use is this?',['Summative','Formative','Norm-referenced','Three-year reevaluation'],'Formative','Formative assessment occurs during instruction and is used to make instructional decisions.',''),
 q('tf_s1_04',1,'formal informal','A school psychologist administers a standardized achievement test using fixed directions and scoring rules. Which description best fits the assessment?',['Informal and flexible','Formal and structured','Formative only','Anecdotal only'],'Formal and structured','Formal assessments follow structured administration and scoring procedures.',''),
 q('tf_s1_05',1,'screening child find','All students complete a brief reading measure in fall, winter, and spring so the school can identify who may need additional support. What is the primary purpose?',['Universal screening','Special-education eligibility determination','Annual IEP review','Functional behavior assessment'],'Universal screening','Universal screening is a broad check used to flag students who may need support; it is not itself an eligibility decision.','screen-progress'),
 q('tf_s1_06',1,'child find','A teacher and parent both report persistent concerns that may indicate a disability. Which legal responsibility requires the school to identify, locate, and evaluate students who may need special education?',['FERPA','Child Find','PBIS','General Outcome Measurement'],'Child Find','Child Find is the school’s obligation to identify, locate, and evaluate children who may have disabilities.','process-order'),
 q('tf_s1_07',1,'criterion cbm','A teacher wants a brief measure aligned to current reading instruction that can be repeated frequently to track growth. Which tool best fits?',['Curriculum-Based Measurement (CBM)','End-of-year summative exam','One-time IQ test','Three-year reevaluation'],'Curriculum-Based Measurement (CBM)','CBMs are brief, frequent, instruction-aligned measures used to monitor growth.','screen-progress'),
 q('tf_s1_08',1,'four point rule','The four most recent progress-monitoring points are all below the goal line. What is the strongest next instructional decision?',['Keep the plan unchanged because one more point is needed','Lower the goal so the student appears on track','Change or intensify the instructional approach and continue collecting data','Stop collecting progress data'],'Change or intensify the instructional approach and continue collecting data','A consistent run of recent points below the goal line indicates the current plan is not producing the expected progress and should be adjusted.','four-point','four-below'),
 q('tf_s1_09',1,'four point rule','The four most recent data points are consistently above the goal line and the student is exceeding the expected rate of growth. What should the team consider?',['Increasing the goal to make it more appropriately ambitious','Making the intervention less effective','Referring immediately for special education','Ignoring the pattern because only scores below the goal line matter'],'Increasing the goal to make it more appropriately ambitious','When recent performance consistently exceeds the goal line, the goal can be raised to match the student’s stronger rate of progress.','four-point','four-above'),
 q('tf_s1_10',1,'four point rule','A student’s recent progress-monitoring points vary slightly above and below the goal line but remain generally on target. What is the best decision?',['Continue the current plan and keep monitoring','Automatically move the student to Tier 3','Change instruction immediately because every point must be above the line','End all monitoring'],'Continue the current plan and keep monitoring','Points clustered around the goal line suggest the current approach is generally producing expected progress.','four-point','four-around'),
 q('tf_s1_11',1,'pre-referral sequence','A concern has been identified, relevant data have been gathered, and the IAT has met to review findings. What should happen next in the pre-referral process?',['Determine and document the intervention plan','Write the IEP','Conduct the three-year reevaluation','Make a final eligibility decision'],'Determine and document the intervention plan','After concern, data gathering, and the IAT/problem-solving meeting, the team determines which intervention will be implemented.','process-order','journey'),
 q('tf_s1_12',1,'tier movement','A student receives a Tier 2 reading intervention for a semester. Progress data show minimal growth despite implementation as planned. What is the best next step?',['Review intervention fidelity and the data, then intensify or revise support based on the evidence','Return to Tier 1 without reviewing the data','Assume the student has a disability','Keep the intervention unchanged indefinitely'],'Review intervention fidelity and the data, then intensify or revise support based on the evidence','Tier movement should be driven by the student’s response to intervention and the quality of implementation, not by time alone.','mtss-diagnosis'),
 q('tf_s1_13',1,'pbis sel','Office referrals and behavior checklists show that a schoolwide behavior support is not reducing problem behavior. Which framework is most directly using those data to adjust interventions?',['SEL','PBIS','Discrepancy Model','FERPA'],'PBIS','PBIS uses behavior data such as office discipline referrals and checklists to select and adjust behavior supports.','pbis-sel'),
 q('tf_s1_14',1,'pbis sel','A teacher uses student surveys and ratings to identify weaknesses in self-awareness, emotional regulation, and decision-making. Which area is being assessed?',['PBIS system fidelity','SEL skills','IQ-achievement discrepancy','Child Find compliance'],'SEL skills','SEL focuses on social-emotional competencies such as self-awareness, regulation, relationships, and responsible decision-making.','pbis-sel'),
 q('tf_s1_15',1,'rti discrepancy','A team asks whether a student improves when provided high-quality targeted instruction and increasingly intensive intervention. Which model is this reasoning most aligned with?',['Discrepancy Model','RTI','Summative assessment','Age-equivalent interpretation'],'RTI','RTI emphasizes the student’s responsiveness to instruction and intervention.','rti-discrepancy'),
 q('tf_s1_16',1,'rti discrepancy','A team compares a student’s intellectual ability score with achievement performance to examine whether a substantial gap exists. Which model is being used?',['RTI','Discrepancy Model','PBIS','Universal screening'],'Discrepancy Model','The discrepancy model focuses on a difference between intellectual ability and achievement.','rti-discrepancy'),
 q('tf_s1_17',1,'validity','A math assessment samples the full range of skills that the course standards say should be measured. Which type of validity is most directly supported?',['Predictive validity','Content validity','Inter-rater reliability','Test-retest reliability'],'Content validity','Content validity concerns whether the assessment adequately represents the content domain it is intended to measure.','validity-reliability'),
 q('tf_s1_18',1,'quality bias','An assessment gives stable results across repeated administrations, but its language demands disadvantage multilingual learners in a way unrelated to the skill being measured. What should the team conclude?',['The test is appropriate because reliability eliminates bias','The result should be interpreted cautiously because reliability does not remove language bias','The assessment automatically has construct validity','No additional data are needed'],'The result should be interpreted cautiously because reliability does not remove language bias','Consistency and fairness are different issues. A reliable measure can still contain linguistic or cultural bias that distorts interpretation.','bias'),

 // SECTION 2 — EVALUATION, SCORE INTERPRETATION, REFERRAL, ELIGIBILITY
 q('tf_s2_01',2,'referral','A student has received differentiated instruction and targeted interventions, but progress remains inadequate. The IAT has documented the interventions and outcomes. What is the most appropriate next step if the team suspects a disability?',['Begin the formal referral process for a special-education evaluation','Write the final IEP immediately','Assign a disability category based on the intervention data','Stop collecting data because referral makes prior data irrelevant'],'Begin the formal referral process for a special-education evaluation','When well-documented interventions have not produced adequate progress and disability is suspected, the process can move toward formal referral and evaluation.','process-order'),
 q('tf_s2_02',2,'referral','Which information should accompany a written referral for a special-education evaluation?',['Only the student’s most recent test score','The reason for referral and relevant pre-referral outcomes/data','A final IEP placement decision','Only the parent’s opinion without school data'],'The reason for referral and relevant pre-referral outcomes/data','The referral should communicate the concern and what occurred during pre-referral so the evaluation team has documented context.','process-order'),
 q('tf_s2_03',2,'mdt consent','After a referral is accepted, the multidisciplinary team identifies the suspected areas that need formal evaluation. What must occur before initial testing begins?',['The IEP must be signed','Informed parental consent must be obtained','The student must be placed in special education','The annual review must occur'],'Informed parental consent must be obtained','The parent consents to the evaluation plan before the initial formal assessment process proceeds.','consent'),
 q('tf_s2_04',2,'assessment plan','A student is referred because of concerns in reading, expressive language, and adaptive functioning. What is the best evaluation approach?',['Test every possible disability area regardless of the concern','Select assessment areas that address the suspected needs and use a comprehensive variety of relevant sources','Use one intelligence test only','Use only classroom grades because they are easiest to collect'],'Select assessment areas that address the suspected needs and use a comprehensive variety of relevant sources','The evaluation should be tailored to suspected needs and use multiple appropriate, unbiased sources rather than testing indiscriminately or relying on one measure.','one-score'),
 q('tf_s2_05',2,'eligibility','A student meets criteria for a disability category, but the evaluation shows the student does not need specially designed instruction or related special-education services. What does the two-pronged test indicate?',['The student is automatically eligible because the disability criterion is enough','The student does not meet both prongs for special-education eligibility','The school should skip eligibility and write an IEP','The student must be placed in a separate setting'],'The student does not meet both prongs for special-education eligibility','Eligibility requires both meeting disability criteria and demonstrating a need for special education/related services or specially designed instruction.','eligibility'),
 q('tf_s2_06',2,'eligibility rule out','A multilingual student has weak reading performance, but records show inconsistent access to appropriate reading instruction and limited English proficiency may explain part of the difficulty. What should the MDT do before determining eligibility?',['Rule out these determinant factors as the primary cause of the deficits','Ignore instructional history because the low score is sufficient','Use the disability label that best matches the score','Skip family input to avoid bias'],'Rule out these determinant factors as the primary cause of the deficits','The process deck emphasizes ruling out lack of appropriate reading/math instruction and limited English proficiency as determinant factors before eligibility is established.','eligibility'),
 q('tf_s2_07',2,'percentile','A student’s report shows a percentile rank of 21 in Word Attack. What does the percentile most directly communicate?',['The student answered exactly 21% of items correctly','The student scored as well as or better than about 21% of the norm group','The student is functioning at grade 2.1','The student is 21 standard-score points below average'],'The student scored as well as or better than about 21% of the norm group','Percentile rank describes relative standing in the norm group; it is not percentage correct or a grade-equivalent score.',''),
 q('tf_s2_08',2,'score profile','A student’s score profile is mostly average, but Math Fluency is much lower than the other academic areas. What is the strongest interpretation?',['The overall average pattern means the low fluency score should be ignored','The specific Math Fluency weakness should be examined with other evidence and error patterns','The lowest score alone proves a disability','Only the highest score should guide instruction'],'The specific Math Fluency weakness should be examined with other evidence and error patterns','A profile should be interpreted for patterns. A specific low area can identify an instructional need even when many other scores are average.','significant-score','score-profile'),
 q('tf_s2_09',2,'standard score','On a standard-score scale with a mean of 100 and standard deviation of 15, which score is one standard deviation below the mean?',['70','85','100','115'],'85','One standard deviation below a mean of 100 is 100 − 15 = 85.',''),
 q('tf_s2_10',2,'multiple data','Brian’s percentile rank improved, but classroom work still shows major difficulty applying the skill independently. How should the team respond?',['Conclude that the intervention is successful because percentile growth overrides all other evidence','Examine classroom performance, progress-monitoring trends, intervention fidelity, and other relevant data before deciding next steps','Ignore the classroom evidence because it is informal','End support immediately'],'Examine classroom performance, progress-monitoring trends, intervention fidelity, and other relevant data before deciding next steps','Growth in one metric should be interpreted alongside functional classroom performance and other evidence.','one-score'),
 q('tf_s2_11',2,'mastery gom','A teacher gives a short weekly probe that samples broad grade-level reading performance to see whether the student’s overall growth trajectory is improving. Which measurement approach best fits?',['Mastery measurement of one micro-skill','General Outcome Measurement (GOM)','Summative state testing','One-time diagnostic assessment'],'General Outcome Measurement (GOM)','GOM repeatedly samples broad performance to track overall long-term growth, unlike a narrow mastery check of one micro-skill.','mastery-gom'),
 q('tf_s2_12',2,'reliability','Two examiners score the same student’s performance very differently despite using the same rubric. Which technical issue is most directly involved?',['Test-retest reliability','Inter-rater reliability','Predictive validity','Content validity'],'Inter-rater reliability','Inter-rater reliability concerns consistency across different raters or scorers.','validity-reliability'),
 q('tf_s2_13',2,'reliability','The same stable skill is measured twice within a short period, but the student receives very different scores without any reasonable explanation. Which issue is most direct?',['Internal consistency','Test-retest reliability','Content validity','Cultural bias only'],'Test-retest reliability','Test-retest reliability concerns the stability of scores across repeated administrations.','validity-reliability'),
 q('tf_s2_14',2,'reliability','Items on a scale intended to measure one construct do not appear to work together consistently. Which reliability type is most directly questioned?',['Inter-rater reliability','Internal consistency','Predictive validity','Test-retest reliability'],'Internal consistency','Internal consistency concerns whether items intended to measure the same construct function coherently together.','validity-reliability'),
 q('tf_s2_15',2,'validity','A screening measure is evaluated by whether it accurately forecasts which students later experience reading difficulty. Which type of validity is most relevant?',['Content validity','Predictive validity','Inter-rater reliability','Internal consistency'],'Predictive validity','Predictive validity concerns how well assessment results forecast later outcomes.','validity-reliability'),
 q('tf_s2_16',2,'validity','A new rating scale claims to measure executive functioning. The team examines whether the scores actually represent executive functioning rather than an unrelated trait. Which validity question is this?',['Construct validity','Content validity only','Test-retest reliability','Inter-rater reliability'],'Construct validity','Construct validity asks whether the assessment meaningfully measures the theoretical construct it claims to measure.','validity-reliability'),
 q('tf_s2_17',2,'bias','A behavior rating form assumes cultural norms that do not match the student’s community and may systematically affect ratings. What is the most appropriate response?',['Use the result without concern because it is formal','Recognize possible cultural bias, gather additional culturally responsive evidence, and interpret cautiously','Discard all behavioral information permanently','Automatically assign a disability category'],'Recognize possible cultural bias, gather additional culturally responsive evidence, and interpret cautiously','Potential cultural bias should be mitigated with appropriate tools, context, and multiple sources before high-stakes decisions are made.','bias'),
 q('tf_s2_18',2,'family collaboration','A parent reports that a student avoids homework and becomes frustrated at home but is unsure how to document it. What should the team do?',['Exclude the information because it is not a standardized score','Help the parent use a simple log or checklist and combine that information with school data','Ask the parent to diagnose the problem','Wait until the next annual review'],'Help the parent use a simple log or checklist and combine that information with school data','Family observations are a valuable data source. Structured logs or checklists can make the information more usable alongside school evidence.','one-score'),

 // SECTION 3 — IEP, GOALS, PROGRESS, COMMUNICATION, COLLABORATION
 q('tf_s3_01',3,'iep team','Which group best reflects required perspectives on an IEP team for a student participating in general education?',['Parent, general education teacher, special education teacher/provider, public-agency representative, and someone able to interpret evaluation results','Only the special education teacher and principal','Only the parent and school psychologist','Only staff members who administered standardized tests'],'Parent, general education teacher, special education teacher/provider, public-agency representative, and someone able to interpret evaluation results','The IEP team combines family, general education, special education, agency, and evaluation-interpretation perspectives.','process-order'),
 q('tf_s3_02',3,'plaaft','Which information belongs in a strong PLAAFP for a reading concern?',['Current baseline performance, strengths, concerns supported by qualitative and quantitative data, and impact on progress in general education','Only the disability label','Only the annual goal with no current data','Only standardized scores with no functional description'],'Current baseline performance, strengths, concerns supported by qualitative and quantitative data, and impact on progress in general education','The PLAAFP describes present performance and educational impact using both qualitative and quantitative evidence.','plaaft'),
 q('tf_s3_03',3,'goal writing','Which annual goal is most measurable and aligned with the C-B-C structure?',['Mark will improve reading significantly this year','When given a third-grade passage, Mark will read aloud at 115 correct words per minute by the end of the IEP year','Mark will try harder during reading','Mark will receive reading services every week'],'When given a third-grade passage, Mark will read aloud at 115 correct words per minute by the end of the IEP year','The goal includes a condition, observable behavior/performance, measurable criterion, and timeframe.','goal','cbc'),
 q('tf_s3_04',3,'goal writing','Timmy’s baseline data show he cannot independently solve two-digit multiplication problems. Which goal element identifies the context in which performance will be measured?',['Condition','Behavior','Mastery criterion','Service provider'],'Condition','The condition describes the circumstance or context in which the target behavior will occur.','goal','cbc'),
 q('tf_s3_05',3,'goal writing','In the goal “Given 10 double-digit multiplication problems, Timmy will solve at least 8 correctly,” what is “8 out of 10” primarily describing?',['The condition','The mastery criterion','The disability category','The service location'],'The mastery criterion','The mastery criterion defines the performance level that shows the student has achieved the target.','goal','cbc'),
 q('tf_s3_06',3,'progress reporting','An IEP goal is being monitored with a CBM. What else should the IEP specify about progress reporting?',['How often progress will be reported and how the information will be communicated to parents','Only the student’s disability category','A guarantee that every score will improve','That progress data are confidential from the family'],'How often progress will be reported and how the information will be communicated to parents','The IEP should identify how progress is measured, the reporting frequency, and the method of communication.','communication'),
 q('tf_s3_07',3,'services','Which IEP component identifies the special education, related services, supplementary aids, and services that will help the student make progress toward annual goals?',['Services and supplementary aids statement','Percentile-rank table','Child Find notice','Universal screening plan'],'Services and supplementary aids statement','The IEP specifies the services and supports to be provided to advance toward the student’s annual goals.','label-plan'),
 q('tf_s3_08',3,'lre','An IEP team is deciding where a student will receive support and the extent to which the student will participate with nondisabled peers. Which principle is most directly involved?',['Least Restrictive Environment (LRE)','Predictive validity','Universal screening','Test-retest reliability'],'Least Restrictive Environment (LRE)','LRE guides decisions about participation with nondisabled peers and where services will be delivered based on individual need.','label-plan'),
 q('tf_s3_09',3,'accommodations','Which IEP component addresses changes needed so a student can appropriately access state or districtwide assessments?',['Individual assessment accommodations','Annual eligibility category','Universal screening schedule','Inter-rater reliability'],'Individual assessment accommodations','The IEP identifies individual accommodations needed to measure academic achievement and functional performance on large-scale assessments.','label-plan'),
 q('tf_s3_10',3,'services schedule','Why must an IEP identify the projected start date, frequency, location, and duration of services?',['To make the service plan specific enough to implement and monitor','To replace measurable annual goals','To determine the student’s percentile rank','To eliminate the need for parent participation'],'To make the service plan specific enough to implement and monitor','The IEP needs concrete service details so the team knows what will be delivered, where, how often, and for how long.','communication'),
 q('tf_s3_11',3,'collaboration','A student struggles in both mathematics and expressive language. What is the strongest first team response?',['Have one teacher select an intervention without additional data','Use interdisciplinary collaboration to gather relevant academic, language, classroom, and family data before deciding the root cause','Assume the math problem causes the language problem','Choose the disability category before collecting more information'],'Use interdisciplinary collaboration to gather relevant academic, language, classroom, and family data before deciding the root cause','Multiple professional perspectives and data sources help distinguish overlapping needs and identify a more accurate instructional response.','one-score'),
 q('tf_s3_12',3,'ethics consent','Parents say they fear that evaluation will permanently “label” their child. What is the best educator response?',['Dismiss the concern because the school makes the final decision','Acknowledge the concern, explain the purpose and safeguards of evaluation, emphasize individualized decision-making, and invite questions','Promise that evaluation will always produce eligibility','Avoid discussing assessment options'],'Acknowledge the concern, explain the purpose and safeguards of evaluation, emphasize individualized decision-making, and invite questions','Respectful, transparent communication addresses family concerns without pre-judging the evaluation outcome.','communication'),
 q('tf_s3_13',3,'law','A teacher wants to discuss a student’s assessment report with someone who has no legitimate educational role. Which federal law most directly protects the confidentiality of the education record?',['IDEA','FERPA','ESSA','PBIS'],'FERPA','FERPA protects privacy and access rights for student education records.','communication'),
 q('tf_s3_14',3,'law','A student with a disability needs equal access and appropriate accommodations but does not require specially designed instruction. Which legal framework is most directly associated with equal access?',['Section 504','FERPA','PBIS','Discrepancy Model'],'Section 504','The teacher review associates Section 504 with equal access and accommodations.','label-plan'),
 q('tf_s3_15',3,'law','Which law in the teacher review is most directly linked with accessibility of assessments for individuals with disabilities?',['ADA','FERPA','ESSA','RTI'],'ADA','The review links the ADA with assessment accessibility and nondiscrimination.','bias'),
 q('tf_s3_16',3,'evidence based','A school is choosing an intervention and asks which option has credible research support for improving the targeted skill. Which law in the teacher review is connected with evidence-based practices?',['ESSA','FERPA','Section 504','Child Find'],'ESSA','The teacher review links ESSA with the use of evidence-based practices.',''),
 q('tf_s3_17',3,'multi-source next steps','A student continues to fail Tier 3 despite intensive support delivered as planned. Which next step best matches the teacher’s review?',['Use multiple data sources, verify intervention response and implementation, collaborate with the team and family, and consider referral/evaluation if disability is suspected','Refer based only on the latest score','Continue the same intervention forever because Tier 3 cannot be changed','Choose a disability label before reviewing data'],'Use multiple data sources, verify intervention response and implementation, collaborate with the team and family, and consider referral/evaluation if disability is suspected','Persistent difficulty after intensive support calls for a data-based, collaborative review and may support referral when the full evidence suggests possible disability.','process-order'),
 q('tf_s3_18',3,'student journey','Which sequence best represents the overall student journey emphasized in the process materials?',['Concern → immediate IEP → universal screening → referral','Universal screening/concern → differentiation and data → IAT/intervention → progress monitoring/review → referral if needed → MDT evaluation/consent → eligibility → IEP','Referral → eligibility → intervention → Child Find','IEP → evaluation → pre-referral → universal screening'],'Universal screening/concern → differentiation and data → IAT/intervention → progress monitoring/review → referral if needed → MDT evaluation/consent → eligibility → IEP','The process moves from general-education identification and intervention through formal referral/evaluation only when needed, followed by eligibility and IEP development.','process-order','journey'),

 // ASSESSMENT IDENTIFICATION EXPANSION — qualitative/quantitative, formal/informal, formative/summative, and "what assessment is this?"
 q('assess_id_01',1,'qualitative quantitative','A teacher writes detailed notes describing how a student approaches a difficult reading task, including hesitation, self-correction, and strategies used. What type of data is this?',['Qualitative data','Quantitative data','Norm-referenced data','Standard score data'],'Qualitative data','The evidence is descriptive and focuses on characteristics, behaviors, and strategies rather than numerical measurement.','assessment-type'),
 q('assess_id_02',1,'qualitative quantitative','A behavior chart shows that a student left their seat 14 times during a 30-minute lesson. What type of data is this?',['Quantitative data','Qualitative data','Anecdotal-only data','Criterion-referenced data'],'Quantitative data','The information is numerical and measures frequency, so it is quantitative.','assessment-type'),
 q('assess_id_03',1,'qualitative quantitative','A team reviews a student interview, teacher observations, and narrative work-sample notes. Which description best fits these sources?',['Primarily qualitative','Primarily quantitative','Norm-referenced','Standardized only'],'Primarily qualitative','Interviews, observations, and narrative notes primarily describe qualities, experiences, and patterns rather than numerical scores.','assessment-type'),
 q('assess_id_04',1,'qualitative quantitative','A team reviews percentile ranks, standard scores, weekly words-correct-per-minute scores, and frequency counts. Which description best fits these sources?',['Primarily quantitative','Primarily qualitative','Informal only','Anecdotal only'],'Primarily quantitative','Percentiles, standard scores, rates, and frequency counts are numerical measures and therefore quantitative.','assessment-type'),

 q('assess_id_05',1,'formal informal','A school psychologist administers an achievement test using a manual, fixed directions, time limits, and standardized scoring procedures. What type of assessment is this?',['Formal assessment','Informal assessment','Anecdotal record','Student self-assessment'],'Formal assessment','Fixed administration and scoring procedures make this a formal assessment.','assessment-type'),
 q('assess_id_06',1,'formal informal','During guided reading, a teacher listens to a student read and keeps flexible notes about decoding errors to decide what to reteach tomorrow. What type of assessment is this?',['Informal assessment','Formal assessment','Summative standardized assessment','Norm-referenced assessment'],'Informal assessment','The teacher is gathering flexible, instruction-embedded evidence without standardized administration procedures.','assessment-type'),
 q('assess_id_07',1,'formal informal','A teacher-created checklist is used during classroom work without standardized directions or norms. Which assessment category best fits?',['Informal assessment','Formal standardized assessment','Norm-referenced assessment','Summative assessment only'],'Informal assessment','A flexible classroom checklist without standardized administration or norms is an informal assessment.','assessment-type'),

 q('assess_id_08',1,'assessment purpose','A teacher gives a three-question check halfway through a lesson and immediately reteaches a missed concept. What type of assessment use is this?',['Formative assessment','Summative assessment','Norm-referenced assessment','Three-year reevaluation'],'Formative assessment','The assessment occurs during learning and directly changes instruction, which is the defining purpose of formative assessment.','assessment-type'),
 q('assess_id_09',1,'assessment purpose','Students take a final unit exam after instruction is complete, and the teacher uses it to evaluate what they learned. What type of assessment use is this?',['Summative assessment','Formative assessment','Progress monitoring','Universal screening'],'Summative assessment','The assessment evaluates learning at a defined endpoint after instruction.','assessment-type'),
 q('assess_id_10',1,'assessment purpose','A teacher uses exit tickets every day to decide whether the next lesson should review, reteach, or advance. What kind of assessment is this primarily?',['Formative assessment','Summative assessment','Norm-referenced assessment','Eligibility evaluation'],'Formative assessment','The evidence is being used during instruction to guide the next teaching decision.','assessment-type'),
 q('assess_id_11',1,'assessment purpose','At the end of the semester, students complete a cumulative exam used to report final achievement. What kind of assessment is this primarily?',['Summative assessment','Formative assessment','Universal screening','Functional behavior assessment'],'Summative assessment','A cumulative endpoint measure used to judge final achievement is summative.','assessment-type'),

 q('assess_id_12',1,'criterion cbm','A reading assessment reports how a student performed compared with a national sample of same-age peers. What type of assessment interpretation is this?',['Norm-referenced','Criterion-referenced','Informal','Anecdotal'],'Norm-referenced','Norm-referenced results compare the student with a norm group or peer sample.','assessment-type'),
 q('assess_id_13',1,'criterion cbm','A math assessment reports whether a student mastered 80% of the skills in the current unit. What type of interpretation is this?',['Criterion-referenced','Norm-referenced','Anecdotal','Functional behavior assessment'],'Criterion-referenced','Criterion-referenced assessment compares performance with a defined standard or mastery criterion rather than with peers.','assessment-type'),
 q('assess_id_14',1,'criterion cbm','A teacher gives a one-minute oral-reading probe every Friday using passages tied to the reading curriculum and graphs growth over time. What type of assessment is this?',['Curriculum-Based Measurement (CBM)','Summative assessment','Anecdotal record','One-time norm-referenced test'],'Curriculum-Based Measurement (CBM)','A CBM is brief, repeated, curriculum-linked, and designed to monitor growth over time.','assessment-type'),

 q('assess_id_15',1,'screening child find','Every student in the school takes the same brief reading screener in September to identify who may be at risk. What assessment purpose is this?',['Universal screening','Progress monitoring','Summative testing','Functional behavior assessment'],'Universal screening','Universal screening is a broad assessment of all students used to identify who may need additional support.','assessment-type'),
 q('assess_id_16',1,'screening tier movement','A student receiving Tier 2 reading intervention completes a brief fluency probe each week so the teacher can see whether the intervention is working. What assessment purpose is this?',['Progress monitoring','Universal screening','Summative assessment','Eligibility determination'],'Progress monitoring','Repeated measures during intervention are used to judge response and guide instructional adjustments.','assessment-type'),

 q('assess_id_17',1,'data sources','A teacher records the exact events that occur before and after a student throws materials during independent work to determine why the behavior occurs. Which assessment process best fits?',['Functional Behavior Assessment (FBA)','Summative assessment','Universal screening','Norm-referenced testing'],'Functional Behavior Assessment (FBA)','An FBA systematically examines antecedents, behavior, consequences, and patterns to identify the likely function of behavior.','assessment-type'),
 q('assess_id_18',1,'data sources','A teacher watches a student during math centers and records exactly what the student does in real time. What data source is this?',['Direct observation','Anecdotal record only','Standardized test','Percentile rank'],'Direct observation','Direct observation records behavior or performance as it occurs in the natural context.','assessment-type'),
 q('assess_id_19',1,'data sources','After a playground incident, a teacher writes a short narrative describing what happened, who was present, and how the student responded. What data source is this?',['Anecdotal record','Standard score','Universal screening','Criterion-referenced test'],'Anecdotal record','An anecdotal record is a narrative description of a specific event or incident.','assessment-type'),
 q('assess_id_20',1,'data sources','A teacher rates how often a student displays several classroom behaviors using Never, Sometimes, Often, and Always. What assessment tool is this?',['Behavior checklist or rating scale','Functional Behavior Assessment only','Summative exam','Norm-referenced achievement test'],'Behavior checklist or rating scale','A checklist or rating scale converts observations of behavior into structured frequency or intensity ratings.','assessment-type'),

 q('assess_id_21',1,'assessment purpose','A teacher-made quiz has fixed questions and scoring, but the teacher gives it halfway through the unit and uses the results to reteach. Which label best answers the question about PURPOSE?',['Formative assessment','Formal assessment','Summative assessment','Norm-referenced assessment'],'Formative assessment','Although the quiz may be structured, the question asks about purpose. It is formative because the results are used during instruction to adjust teaching.','assessment-type'),
 q('assess_id_22',1,'formal informal','A standardized benchmark test is given at the end of a grading period. Which label best answers the question about ADMINISTRATION?',['Formal assessment','Summative assessment','Qualitative assessment','Anecdotal record'],'Formal assessment','The question asks about administration. Standardized directions and scoring make it formal, even though it may also serve a summative purpose.','assessment-type'),
 q('assess_id_23',1,'assessment purpose','A standardized benchmark test is given at the end of a grading period to judge how much students learned. Which label best answers the question about PURPOSE?',['Summative assessment','Formal assessment','Informal assessment','Qualitative assessment'],'Summative assessment','The question asks about purpose. Because the test evaluates learning at an endpoint, summative is the best answer.','assessment-type'),
 q('assess_id_24',1,'qualitative quantitative','A teacher combines a percentile rank with notes from an interview and classroom observation. What is the strongest description of the evidence set?',['It combines quantitative and qualitative data','It is entirely quantitative','It is entirely qualitative','It is only norm-referenced'],'It combines quantitative and qualitative data','The percentile rank is quantitative, while the interview and observation notes provide qualitative information.','assessment-type'),

 q('assess_id_25',1,'qualitative quantitative','During a parent interview, a family describes when homework frustration usually begins, what the student says, and which supports seem to help. What type of data is this primarily?',['Qualitative data','Quantitative data','Norm-referenced data','Standard score data'],'Qualitative data','The information is descriptive and captures experiences, patterns, and observations rather than numerical measurements.','assessment-type'),
 q('assess_id_26',1,'qualitative quantitative','A teacher measures the number of seconds it takes a student to begin a task after a direction is given and records the latency across five days. What type of data is this?',['Quantitative data','Qualitative data','Anecdotal-only data','Interview data'],'Quantitative data','Latency measured in seconds is numerical, so the evidence is quantitative.','assessment-type'),

 q('assess_id_27',1,'formal informal','A speech-language pathologist administers a normed language test using scripted prompts, exact start and stop rules, and standardized scoring. What type of assessment is this based on ADMINISTRATION?',['Formal assessment','Informal assessment','Formative assessment','Anecdotal record'],'Formal assessment','Scripted administration, fixed rules, and standardized scoring indicate a formal assessment.','assessment-type'),
 q('assess_id_28',1,'formal informal','A teacher uses a running record during independent reading, marking miscues and self-corrections and adjusting follow-up questions as needed. What type of assessment is this based on ADMINISTRATION?',['Informal assessment','Formal assessment','Norm-referenced assessment','Summative assessment'],'Informal assessment','The running record is flexible, classroom-based, and adjusted by the teacher rather than administered under standardized procedures.','assessment-type'),

 q('assess_id_29',1,'assessment purpose','Midway through a math lesson, students hold up mini whiteboards. The teacher notices a common error and immediately reteaches the step. What type of assessment use is this?',['Formative assessment','Summative assessment','Norm-referenced assessment','Universal screening'],'Formative assessment','The evidence is collected during instruction and immediately changes the teaching response.','assessment-type'),
 q('assess_id_30',1,'assessment purpose','At the end of a grading period, a portfolio is scored with a rubric and used as part of the student’s final course grade. What type of assessment use is this primarily?',['Summative assessment','Formative assessment','Progress monitoring','Functional Behavior Assessment'],'Summative assessment','The portfolio is being judged at an endpoint to evaluate accumulated learning.','assessment-type'),

 q('assess_id_31',1,'criterion cbm','A student receives a percentile rank showing that their reading performance is higher than 62% of same-age students in the test’s norm group. What type of interpretation is this?',['Norm-referenced','Criterion-referenced','Informal','Curriculum-based only'],'Norm-referenced','A percentile rank compares the student with a defined norm group of peers.','assessment-type'),
 q('assess_id_32',1,'criterion cbm','A student correctly demonstrates 9 of 10 required steps on a task-analysis rubric, and mastery is defined as at least 8 correct steps. What type of interpretation is this?',['Criterion-referenced','Norm-referenced','Anecdotal','Standard score'],'Criterion-referenced','Performance is compared with a defined mastery criterion rather than with other students.','assessment-type'),

 q('assess_id_33',1,'screening child find','All kindergarten students complete the same brief phonological-awareness check in the fall so the school can identify students who may need additional reading support. What assessment purpose is this?',['Universal screening','Progress monitoring','Summative assessment','Eligibility determination'],'Universal screening','The assessment is administered broadly to identify which students may be at risk and need further support.','assessment-type'),
 q('assess_id_34',1,'screening tier movement','After a student begins a Tier 3 intervention, the interventionist gives a brief curriculum-based probe every week and graphs the student’s growth. What assessment purpose is this?',['Progress monitoring','Universal screening','Summative testing','Norm-referenced eligibility testing'],'Progress monitoring','Repeated measures are being used to judge whether the intervention is producing adequate growth.','assessment-type'),

 q('assess_id_35',1,'data sources','A behavior team collects antecedent-behavior-consequence data across several classes and times of day, then looks for patterns to determine whether work avoidance is maintaining the behavior. Which assessment process best fits?',['Functional Behavior Assessment (FBA)','Anecdotal record only','Summative assessment','Universal screening'],'Functional Behavior Assessment (FBA)','The team is systematically analyzing behavior patterns and context to identify the likely function of the behavior.','assessment-type'),
 q('assess_id_36',1,'data sources','A general education teacher and a parent each complete the same structured scale rating attention, impulsivity, and task persistence across settings. What assessment tool is this?',['Behavior checklist or rating scale','Direct observation only','Anecdotal record','Curriculum-Based Measurement (CBM)'],'Behavior checklist or rating scale','A structured scale completed by informants uses ratings to summarize the frequency or intensity of behaviors across settings.','assessment-type')
];

const REPAIRS=Object.fromEntries(TRAPS.map(t=>[t.id,t]));

function active(){return window.S?.activeCourse===COURSE}
function prog(){
 if(!window.S)return null;
 S.progress=S.progress||{};S.progress[COURSE]=S.progress[COURSE]||{answers:[],mistakes:[],xp:0,crystals:0,chests:0};
 const p=S.progress[COURSE];
 p.d755Retake=p.d755Retake||{
  mode:'home',sectionId:SECTIONS[0].id,conceptIndex:0,phase:0,
  completed:{},anchors:{},responses:{},explanations:{},confusions:{},
  sectionChecks:{},diagnostic:null,mock:null,tutorTurns:{}
 };
 const st=p.d755Retake;
 for(const k of ['completed','anchors','responses','explanations','confusions','sectionChecks','tutorTurns'])st[k]=st[k]||{};
 return st;
}
function save(){try{window.save?.()}catch(e){console.warn('D755 retake save',e)}}
function sectionById(id){return SECTIONS.find(s=>s.id===id)||SECTIONS[0]}
function current(){
 const st=prog(),section=sectionById(st.sectionId),idx=Math.max(0,Math.min(section.concepts.length-1,Number(st.conceptIndex)||0));
 return {st,section,concept:section.concepts[idx],idx};
}
function sectionQuestions(n){return BANK.filter(x=>x.section===n)}
function ensureBank(){
 if(!window.S?.courses?.[COURSE])return 0;
 S.courses[COURSE].questionBank=clone(BANK);
 S.courses[COURSE].concepts=SECTIONS.flatMap(s=>s.concepts.map(c=>({id:c.id,title:c.title,section:'section-'+s.number,priority:'core'})));
 S.courses[COURSE].glossary=S.courses[COURSE].glossary||{};
 for(const s of SECTIONS)for(const c of s.concepts)for(const t of c.terms)if(!S.courses[COURSE].glossary[t])S.courses[COURSE].glossary[t]=c.teach.split('.')[0]+'.';
 S.courses[COURSE].misconceptionCatalog=TRAPS.map(t=>({id:'d755-trap-'+t.id,label:t.title,topics:[...new Set(BANK.filter(q=>q.trap===t.id).map(q=>q.topicId))],repair:t.right})).filter(x=>x.topics.length);
 return BANK.length;
}
function go(mode){const st=prog();st.mode=mode;st.feedback=null;save();render()}
function selectSection(id){const st=prog();st.sectionId=sectionById(id).id;st.conceptIndex=0;st.phase=0;st.mode='sectionOpening';st.feedback=null;save();render()}
function beginSection(){const st=prog();st.mode='learn';st.phase=0;save();render()}
function setPhase(n){const {st,concept}=current();st.phase=Math.max(0,Math.min(PHASES.length-1,Number(n)||0));st.feedback=null;if(st.phase>=1)st.anchors[concept.id]=true;save();render()}
function key(kind,c){return c.id+':'+kind}
function answer(kind,choice){
 const {st,concept}=current(),item=kind==='transfer'?concept.transfer:concept.check;
 const correct=choice===item.answer;
 const at=Date.now();
 st.responses[key(kind,concept)]={choice,correct,at};
 st.feedback={kind,correct,why:item.why,answer:item.answer};
 window.MajickStudyProgress?.creditAnswer?.({key:'D755:learn:'+key(kind,concept)+':'+at,course:'D755',source:'d755-learn',qid:'d755_learn_'+concept.id+'_'+kind,topicId:concept.id,correct,difficulty:3,chosen:choice,answer:item.answer,at});
 if(!correct){
   const trap=(BANK.find(q=>q.concept===concept.id)?.trap)||concept.repair||'';
   if(trap)st.confusions[trap]=Number(st.confusions[trap]||0)+1;
 }
 save();render();
}
function explainChoice(text){
 const {st,concept}=current();st.explanations[concept.id]={text:String(text||''),at:Date.now()};save();render()
}
function explainTyped(){
 const v=String(document.getElementById('d755Explain')?.value||'').trim();if(v)explainChoice(v)
}
function completeConcept(){
 const {st,section,concept,idx}=current();st.completed[concept.id]=true;st.anchors[concept.id]=true;
 if(idx<section.concepts.length-1){st.conceptIndex=idx+1;st.phase=0;st.feedback=null;save();render()}
 else startSectionCheck();
}
function tutor(kind){
 const {st,concept}=current();const n=Number(st.tutorTurns[concept.id+':'+kind]||0);st.tutorTurns[concept.id+':'+kind]=n+1;
 let h='';
 if(kind==='different'){
   const approaches=[
    concept.mental,
    'Strip away the story details. Ask which decision the educator is making and which evidence is needed for that decision.',
    'Use contrast: '+concept.compare[0]+' means '+concept.compare[1]+'; '+concept.compare[2]+' means '+concept.compare[3]+'.'
   ];
   h='<b>Explain This Differently</b><p>'+E(approaches[n%approaches.length])+'</p>';
 }else if(kind==='example')h='<b>Another Example</b><p>'+E(concept.example)+'</p>';
 else if(kind==='wgu')h='<b>What Would WGU Ask?</b><p>Expect a teacher/team scenario. Identify the decision being made, then choose the answer that is most individualized, data-based, collaborative, measurable, and procedurally appropriate.</p>';
 else if(kind==='compare')h='<b>Compare These Two</b><div class="d755Compare"><span><strong>'+E(concept.compare[0])+'</strong>'+E(concept.compare[1])+'</span><span><strong>'+E(concept.compare[2])+'</strong>'+E(concept.compare[3])+'</span></div>';
 else h='<b>I Still Don’t Get It — New Lens '+((n%3)+1)+'</b><p>'+E([concept.mental,'Ask what the educator should DO next, not merely which vocabulary word appears in the story.','Look for the distractor that is generic, one-score-only, label-based, overly restrictive, or skips a required process.'][n%3])+'</p>';
 st.tutorResponse=h;save();render();
}
function repairHtml(concept){
 const st=prog();const hit=Object.entries(st.confusions||{}).filter(([,n])=>Number(n)>=2).map(([id])=>REPAIRS[id]).find(Boolean);
 if(!hit)return '';
 return '<aside class="d755Repair"><small>ADAPTIVE REPAIR INSERTED</small><h4>'+E(hit.title)+'</h4><p><b>Watch for:</b> '+E(hit.wrong)+'</p><p><b>Use instead:</b> '+E(hit.right)+'</p></aside>';
}
function anchor(c,section){
 return '<article class="d755Anchor"><div class="pin">✦</div><small>ARCANE ANCHOR CHART • SECTION '+section.number+'</small><h4>'+E(c.title)+'</h4>'+c.anchor.map(x=>'<b>'+E(x)+'</b>').join('')+'<p>'+E(c.trap)+'</p></article>';
}
function diagram(c){
 const items=c.anchor.slice(0,Math.min(6,c.anchor.length));
 return '<div class="d755Diagram"><div class="sigil">✦</div>'+items.map((x,i)=>'<div><i>'+String(i+1).padStart(2,'0')+'</i><span>'+E(x)+'</span></div>').join('')+'</div>';
}
function opening(section){
 return '<section class="d755Opening"><small>SECTION '+section.number+' • WHAT AM I LEARNING?</small><h1>'+E(section.title)+'</h1><p>'+E(section.competency)+'</p><div class="d755BigIdea"><small>THE BIG IDEA</small><b>'+E(section.bigIdea)+'</b></div><div class="d755SkillGrid">'+section.concepts.map((c,i)=>'<div><i>'+String(i+1).padStart(2,'0')+'</i><span><b>'+E(c.title)+'</b><small>'+c.terms.slice(0,4).map(E).join(' • ')+'</small></span></div>').join('')+'</div><button class="btn primary" data-d755-begin>Begin Section '+section.number+' →</button></section>';
}
function phaseBar(st){return '<nav class="d755Phases">'+PHASES.map((p,i)=>'<span class="'+(i===st.phase?'active':i<st.phase?'done':'')+'"><i>'+(i<st.phase?'✓':i+1)+'</i>'+E(p)+'</span>').join('')+'</nav>'}
function teach(c){return '<section class="d755Stage"><div class="stageTag">I TEACH • WGU LANGUAGE FIRST</div><h2>'+E(c.title)+'</h2><div class="d755Terms">'+c.terms.map(x=>'<span>'+E(x)+'</span>').join('')+'</div><p class="teach">'+E(c.teach)+'</p><div class="mental"><small>HOW TO THINK ABOUT IT</small><b>'+E(c.mental)+'</b></div><footer><button class="btn primary" data-d755-phase="1">Open anchor chart →</button></footer></section>'}
function anchorStage(c,s){return '<section class="d755Stage"><div class="stageTag">ANCHOR • SEE THE DECISION PATTERN</div><h2>'+E(c.title)+'</h2>'+diagram(c)+anchor(c,s)+'<footer><button class="btn ghost" data-d755-phase="0">← Teach</button><button class="btn primary" data-d755-phase="2">Worked example →</button></footer></section>'}
function worked(c){return '<section class="d755Stage"><div class="stageTag">WE DO • WORKED EXAMPLE</div><h2>Walk through the evidence</h2><blockquote>'+E(c.example)+'</blockquote><div class="workedReason"><small>DECISION LENS</small><b>'+E(c.mental)+'</b></div><footer><button class="btn ghost" data-d755-phase="1">← Anchor</button><button class="btn primary" data-d755-phase="3">Your turn →</button></footer></section>'}
function questionStage(item,kind,c){
 const st=prog(),r=st.responses[key(kind,c)],done=!!r;
 return '<section class="d755Stage"><div class="stageTag">'+(kind==='check'?'YOU DO • CHECK YOUR UNDERSTANDING':'TRANSFER • NEW SCENARIO')+'</div><h2>'+E(item.prompt)+'</h2><div class="d755Choices">'+item.options.map((o,i)=>'<button '+(done?'disabled':'')+' class="'+(done?(o===item.answer?'correct':o===r.choice?'wrong':''):'')+'" data-d755-answer="'+kind+'" data-choice="'+E(o)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(o)+'</span></button>').join('')+'</div>'+(done?'<div class="d755Feedback '+(r.correct?'correct':'repair')+'"><b>'+(r.correct?'✓ Correct':'Repair the decision')+'</b><p>'+E(item.why)+'</p></div>':'')+repairHtml(c)+'<footer><button class="btn ghost" data-d755-phase="'+(kind==='check'?2:3)+'">← Back</button>'+(done?(kind==='check'?'<button class="btn primary" data-d755-phase="4">New scenario →</button>':r.correct?'<button class="btn primary" data-d755-phase="5">Explain why →</button>':''):'')+'</footer></section>';
}
function explainStage(c){
 const st=prog(),done=!!st.explanations[c.id];
 return '<section class="d755Stage"><div class="stageTag">EXPLAIN WHY • TEACH IT BACK</div><h2>'+E(c.explain)+'</h2><textarea id="d755Explain" placeholder="The best decision is ___ because the evidence/process shows ___...">'+E(done?st.explanations[c.id].text:'')+'</textarea><div class="explainActions"><button class="btn ghost" data-d755-explain>Save my explanation</button><button class="btn ghost" data-d755-aloud>I explained it aloud</button></div>'+(done?'<div class="model"><small>MODEL REASONING</small><p>'+E(c.mental)+' '+E(c.trap)+'</p></div>':'')+'<footer><button class="btn ghost" data-d755-phase="4">← Scenario</button>'+(done?'<button class="btn primary" data-d755-phase="6">Lock in concept →</button>':'')+'</footer></section>';
}
function completeStage(c,s,idx){return '<section class="d755Stage complete"><div class="orb">✦</div><small>CONCEPT COMPLETE • ACADEMIC MASTERY ONLY</small><h2>'+E(c.title)+'</h2><p>You interpreted the concept, applied it to a fresh scenario, and explained the reasoning. The anchor chart is now part of your D755 study wall.</p>'+anchor(c,s)+'<button class="btn primary" data-d755-complete>'+(idx<s.concepts.length-1?'Next concept →':'Section mastery check →')+'</button></section>'}
function tutorPanel(c,st){return '<aside class="d755Tutor"><header><div class="orb">✦</div><div><small>MAJICK TUTOR</small><b>Assessment Professor</b></div></header><p>Use a different teaching route without leaving the concept.</p><div class="buttons"><button data-d755-tutor="different">Explain This Differently</button><button data-d755-tutor="example">Show Me Another Example</button><button data-d755-tutor="wgu">What Would WGU Ask?</button><button data-d755-tutor="compare">Compare These Two</button><button data-d755-tutor="still">I Still Don’t Get It</button></div><div class="response">'+(st.tutorResponse||'<small>WGU questions in this course usually ask what an educator should do with the evidence, not merely which term you memorized.</small>')+'</div></aside>'}
function rail(st,section){
 return '<aside class="d755Rail"><div class="railHead"><small>D755 • RETAKE PREP</small><b>Assessment for Special Education</b></div>'+SECTIONS.map(s=>{const n=s.concepts.filter(c=>st.completed[c.id]).length;return '<button class="'+(s.id===section.id?'active':'')+'" data-d755-section="'+s.id+'"><i>'+s.number+'</i><span><b>'+E(s.title)+'</b><small>'+n+'/'+s.concepts.length+' concepts</small></span></button>'}).join('')+'<hr><button data-d755-mode="diagnostic"><i>✦</i><span><b>Retake Diagnostic</b><small>30 mixed WGU-style scenarios</small></span></button><button data-d755-mode="traps"><i>⚠</i><span><b>WGU Trap Library</b><small>'+TRAPS.length+' decision traps</small></span></button><button data-d755-mode="mock"><i>☾</i><span><b>Mock OA</b><small>40-question mixed simulation</small></span></button><button data-d755-mode="anchors"><i>✧</i><span><b>Anchor Wall</b><small>'+Object.keys(st.anchors).length+' unlocked</small></span></button></aside>';
}
function home(){
 const st=prog();
 const total=SECTIONS.flatMap(s=>s.concepts).length,done=Object.keys(st.completed).filter(k=>st.completed[k]).length;
 const diag=st.diagnosticResult;
 return '<section class="d755Home"><small>D755 • TEACHER-FOCUS RETAKE STUDIO</small><h1>Assessment for Special Education</h1><p>This retake course now follows your instructor’s OA review and Student Journey process: interpret data, identify the student’s stage, choose the next educational decision, and explain why. Vocabulary is tested inside decisions—not by itself.</p><div class="d755HomeStats"><div><b>'+done+' / '+total+'</b><span>concepts completed</span></div><div><b>'+Object.keys(st.anchors).length+'</b><span>anchor charts unlocked</span></div><div><b>'+(diag?diag.score+'/'+diag.total:'—')+'</b><span>diagnostic</span></div></div>'+retakeEvidenceSnapshotHTML()+assessmentMasteryHTML()+assessmentNextPracticeHTML()+assessmentMistakeQueueHTML()+'<div class="d755CourseCycle"><span>Collect evidence</span><i>→</i><span>Interpret patterns</span><i>→</i><span>Individualize</span><i>→</i><span>Intervene</span><i>→</i><span>Monitor</span><i>→</i><span>Communicate</span></div><div class="d755HomeActions"><button class="btn primary" data-d755-section="'+st.sectionId+'">Continue Learning</button><button class="btn ghost" data-d755-mode="diagnostic">Start / Retake Diagnostic</button><button class="btn ghost" data-d755-mode="assessmentDrill">Assessment Type Drill</button><button class="btn ghost" data-d755-smart-review>Smart 10-Question Review</button><button class="btn ghost" data-d755-mode="dimensionDetective">Assessment Dimension Detective</button><button class="btn ghost" data-d755-mode="contrastRepair">Confusing Pairs Repair</button><button class="btn ghost" data-d755-mode="mock">Mock OA</button></div><div class="d755SectionCards">'+SECTIONS.map(s=>'<button data-d755-section="'+s.id+'"><span>SECTION '+s.number+'</span><b>'+E(s.title)+'</b><small>'+E(s.bigIdea)+'</small></button>').join('')+'</div></section>';
}
function retakeEvidenceSnapshot(){
 const st=prog(),rows=assessmentMasteryRows();
 const practiced=rows.filter(x=>x.possible>0),mastered=rows.filter(x=>x.status==='Mastered').length;
 const sectionRows=[1,2,3].map(n=>st.sectionChecks?.['s'+n]||null);
 const sectionReady=sectionRows.filter(r=>r?.status==='Ready to move on').length;
 const diag=st.diagnosticResult||null,mock=st.mockResult||null;
 return {
   sectionReady,sectionTotal:3,
   assessmentMastered:mastered,assessmentPracticed:practiced.length,assessmentTotal:rows.length,
   mistakes:assessmentMistakeIds().length,
   diagnostic:diag?{score:Number(diag.score||0),total:Number(diag.total||0),pct:Number(diag.pct||0)}:null,
   mock:mock?{score:Number(mock.score||0),total:Number(mock.total||0),pct:Number(mock.pct||0)}:null
 };
}
function retakeEvidenceSnapshotHTML(){
 const x=retakeEvidenceSnapshot();
 return '<section class="d755EvidenceSnapshot"><header><div><small>RETAKE EVIDENCE SNAPSHOT</small><h3>What your saved practice shows</h3></div><span>Evidence, not prediction</span></header>'+
  '<div class="d755EvidenceGrid">'+
   '<article><b>'+x.sectionReady+' / '+x.sectionTotal+'</b><span>section checks ready to move on</span><small>Based on your saved section mastery checks.</small></article>'+
   '<article><b>'+x.assessmentMastered+' / '+x.assessmentTotal+'</b><span>assessment dimensions mastered</span><small>'+x.assessmentPracticed+' of '+x.assessmentTotal+' dimensions have practice evidence.</small></article>'+
   '<article class="'+(x.mistakes?'attention':'clear')+'"><b>'+x.mistakes+'</b><span>unresolved assessment mistakes</span><small>'+(x.mistakes?'Use Mistake Repair before adding more of the same type.':'No assessment mistakes are currently waiting in the repair queue.')+'</small></article>'+
   '<article><b>'+(x.diagnostic?x.diagnostic.score+' / '+x.diagnostic.total:'—')+'</b><span>latest diagnostic</span><small>'+(x.diagnostic?x.diagnostic.pct+'% saved practice evidence.':'No diagnostic result saved yet.')+'</small></article>'+
   '<article><b>'+(x.mock?x.mock.score+' / '+x.mock.total:'—')+'</b><span>latest mock OA</span><small>'+(x.mock?x.mock.pct+'% saved practice evidence.':'No mock OA result saved yet.')+'</small></article>'+
  '</div>'+
  '<p>This snapshot summarizes practice completed inside Majick Studies. It does not predict or guarantee your WGU OA result.</p>'+
 '</section>';
}
function assessmentEvidence(kind){
 const st=prog(),saved=st?.assessmentTypeEvidence?.[kind]||{};
 if(Object.keys(saved).length)return saved;
 if(kind==='drill')return st?.assessmentDrillResult?.familyStats||{};
 if(kind==='detective')return st?.dimensionDetectiveResult?.familyStats||{};
 return {};
}
function mergeAssessmentEvidence(kind,stats){
 const st=prog();
 st.assessmentTypeEvidence=st.assessmentTypeEvidence||{drill:{},detective:{},pairs:{}};
 const target=st.assessmentTypeEvidence[kind]||(st.assessmentTypeEvidence[kind]={});
 if(!Object.keys(target).length){
   const prior=kind==='drill'?(st?.assessmentDrillResult?.familyStats||{}):kind==='detective'?(st?.dimensionDetectiveResult?.familyStats||{}):{};
   for(const [label,row] of Object.entries(prior)){
     target[label]={};
     for(const [key,val] of Object.entries(row||{}))if(typeof val==='number')target[label][key]=Number(val||0);
   }
 }
 for(const [label,row] of Object.entries(stats||{})){
   target[label]=target[label]||{};
   for(const [key,val] of Object.entries(row||{})){
     if(typeof val==='number')target[label][key]=Number(target[label][key]||0)+Number(val||0);
   }
 }
 return target;
}
function assessmentMasteryRows(){
 const drill=assessmentEvidence('drill'),detective=assessmentEvidence('detective'),pairs=assessmentEvidence('pairs');
 return ASSESSMENT_DIMENSIONS.map(label=>{
   const d=drill[label]||{},x=detective[label]||{},p=pairs[label]||{};
   const drillCorrect=Number(d.correct||0),drillTotal=Number(d.total||0);
   const dimCorrect=Number(x.dimensionCorrect||0),classCorrect=Number(x.classificationCorrect||0),detectiveTotal=Number(x.total||0);
   const pairCorrect=Number(p.correct||0),pairTotal=Number(p.total||0);
   const earned=drillCorrect+dimCorrect+classCorrect+pairCorrect;
   const possible=drillTotal+(detectiveTotal*2)+pairTotal;
   const pct=possible?Math.round(earned/possible*100):0;
   const status=!possible?'Not practiced':pct>=85?'Mastered':pct>=70?'Developing':'Needs practice';
   return {label,pct,status,possible,drillTotal,detectiveTotal,pairTotal};
 });
}
function assessmentMasteryHTML(){
 const rows=assessmentMasteryRows(),practiced=rows.filter(x=>x.possible>0),mastered=rows.filter(x=>x.status==='Mastered').length;
 return '<section class="d755AssessmentMastery"><header><div><small>ASSESSMENT TYPE MASTERY LADDER</small><h3>'+mastered+' / '+rows.length+' dimensions mastered</h3></div><span>'+Math.round(mastered/rows.length*100)+'%</span></header>'+
  '<div class="d755MasteryRows">'+rows.map(row=>'<article class="'+row.status.toLowerCase().replace(/\s+/g,'-')+'"><div><b>'+E(row.label)+'</b><span>'+E(row.status)+'</span><em>'+(row.possible?row.pct+'%':'—')+'</em></div><i><u style="width:'+(row.possible?row.pct:0)+'%"></u></i><small>'+(row.possible?'Evidence from '+row.drillTotal+' drill item'+(row.drillTotal===1?'':'s')+', '+row.detectiveTotal+' detective case'+(row.detectiveTotal===1?'':'s')+', and '+row.pairTotal+' pair-repair case'+(row.pairTotal===1?'':'s'):'Complete the drill or Detective to begin this row.')+'</small><button type="button" data-d755-focus-family="'+E(row.label)+'">Practice this type →</button></article>').join('')+'</div>'+
  (practiced.length?'<p>Mastery combines <b>classification accuracy</b>, <b>dimension recognition</b>, and your ability to separate <b>confusing pairs</b>.</p>':'<p>Complete the Assessment Type Drill or Assessment Dimension Detective to start building mastery evidence.</p>')+
 '</section>';
}
function assessmentMistakeIds(){
 const st=prog();
 return Array.isArray(st.assessmentMistakeIds)?st.assessmentMistakeIds:[];
}
function updateAssessmentMistake(id,correct){
 if(!id)return;
 const st=prog(),rows=assessmentMistakeIds().filter(x=>x!==id);
 if(!correct)rows.push(id);
 st.assessmentMistakeIds=rows.slice(-40);
}
function assessmentMistakeSummary(){
 const byId=new Map(BANK.map(q=>[q.id,q])),summary={};
 for(const id of assessmentMistakeIds()){
   const q=byId.get(id);
   if(!q||q.section!==1||q.trap!=='assessment-type')continue;
   const family=assessmentFamily(q);
   summary[family]=(summary[family]||0)+1;
 }
 return summary;
}
function startAssessmentMistakeRepair(family){
 const st=prog(),byId=new Map(BANK.map(q=>[q.id,q]));
 let qs=assessmentMistakeIds().map(id=>byId.get(id)).filter(q=>q&&q.section===1&&q.trap==='assessment-type');
 if(family)qs=qs.filter(q=>assessmentFamily(q)===family);
 if(!qs.length)return;
 st.assessmentDrill={
   index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id),
   startedAt:Date.now(),mistakeRepair:true,mistakeFamily:family||''
 };
 st.mode='assessmentDrill';save();render();
}
function assessmentMistakeQueueHTML(){
 const n=assessmentMistakeIds().length;
 if(!n)return '';
 const summary=assessmentMistakeSummary();
 return '<section class="d755MistakeQueue"><div class="d755MistakeQueueCopy"><small>MISTAKE REPAIR QUEUE</small><h3>'+n+' assessment question'+(n===1?'':'s')+' waiting</h3><p>Retry only the assessment questions you missed. A correct retry clears that question from the queue.</p><div class="d755MistakeFamilies">'+Object.entries(summary).sort((a,b)=>b[1]-a[1]).map(([family,count])=>'<button type="button" data-d755-mistake-family="'+E(family)+'"><b>'+count+'</b><span>'+E(family)+'</span></button>').join('')+'</div></div><button class="btn primary" data-d755-mistake-repair>Repair all missed questions →</button></section>';
}
function assessmentRecentIds(){
 const st=prog();
 return Array.isArray(st.assessmentRecentIds)?st.assessmentRecentIds:[];
}
function rememberAssessmentQuestion(id){
 if(!id)return;
 const st=prog(),rows=assessmentRecentIds().filter(x=>x!==id);
 rows.push(id);
 st.assessmentRecentIds=rows.slice(-24);
}
function freshAssessmentRows(rows){
 const recent=new Set(assessmentRecentIds());
 const fresh=shuffle(rows.filter(q=>!recent.has(q.id)));
 const recycled=shuffle(rows.filter(q=>recent.has(q.id)));
 return fresh.concat(recycled);
}
function assessmentNextPractice(){
 const mistakes=assessmentMistakeIds();
 if(mistakes.length){
   return {kind:'mistakes',count:mistakes.length,title:'Repair your missed assessment questions',detail:mistakes.length+' unresolved assessment question'+(mistakes.length===1?' is':'s are')+' waiting. Clear these before adding more new practice.'};
 }
 const rows=assessmentMasteryRows();
 const practiced=rows.filter(x=>x.possible>0);
 const detective=prog()?.dimensionDetectiveResult||null;
 if(!practiced.length){
   return {kind:'drill',title:'Start with Assessment Type Drill',detail:'Build a baseline across the six assessment dimensions before targeting a weakness.'};
 }
 if(detective&&detective.total){
   const dimPct=Math.round(Number(detective.dimensionScore||0)/Math.max(1,Number(detective.total||1))*100);
   const classPct=Math.round(Number(detective.classificationScore||0)/Math.max(1,Number(detective.total||1))*100);
   if(classPct-dimPct>=15){
     return {kind:'detective',title:'Practice reading the stem first',detail:'Your classification is stronger than your dimension recognition. Use Assessment Dimension Detective next.'};
   }
 }
 const pairEvidence=assessmentEvidence('pairs');
 const pairWeak=rows.filter(row=>Number(pairEvidence[row.label]?.total||0)>0)
   .map(row=>({row,pct:Math.round(Number(pairEvidence[row.label]?.correct||0)/Math.max(1,Number(pairEvidence[row.label]?.total||1))*100)}))
   .sort((a,b)=>a.pct-b.pct)[0];
 if(pairWeak&&pairWeak.pct<70){
   return {kind:'pairs',title:'Repair a confusing pair',detail:pairWeak.row.label+' is your weakest two-choice contrast right now.'};
 }
 const weak=[...practiced].filter(x=>x.status!=='Mastered').sort((a,b)=>a.pct-b.pct)[0];
 if(weak){
   return {kind:'family',family:weak.label,title:'Practice '+weak.label,detail:'This is currently your weakest mastery row at '+weak.pct+'%.'};
 }
 return {kind:'maintenance',title:'Keep mastery fresh',detail:'All practiced assessment dimensions are at mastery level. Use a mixed Assessment Type Drill for maintenance.'};
}
function assessmentNextPracticeHTML(){
 const rec=assessmentNextPractice();
 const action=rec.kind==='mistakes'
   ?'<button class="btn primary" data-d755-mistake-repair>Repair '+Number(rec.count||0)+' missed question'+(Number(rec.count||0)===1?'':'s')+' →</button>'
   :rec.kind==='family'
    ?'<button class="btn primary" data-d755-focus-family="'+E(rec.family)+'">Practice this type →</button>'
    :rec.kind==='detective'
    ?'<button class="btn primary" data-d755-start-detective>Open Dimension Detective →</button>'
    :rec.kind==='pairs'
     ?'<button class="btn primary" data-d755-start-contrast>Open Confusing Pairs →</button>'
     :'<button class="btn primary" data-d755-mode="assessmentDrill">'+(rec.kind==='maintenance'?'Mixed maintenance drill →':'Start Assessment Type Drill →')+'</button>';
 return '<section class="d755NextPractice"><div><small>RECOMMENDED NEXT PRACTICE</small><h3>'+E(rec.title)+'</h3><p>'+E(rec.detail)+'</p></div>'+action+'</section>';
}
function weakestAssessmentFamilies(){
 const stats=assessmentEvidence('drill');
 return Object.entries(stats)
  .filter(([,row])=>Number(row?.total||0)>0)
  .map(([label,row])=>({label,pct:Number(row.correct||0)/Number(row.total||1)}))
  .sort((a,b)=>a.pct-b.pct)
  .slice(0,2)
  .map(x=>x.label);
}
function startAssessmentFamilyPractice(family){
 const st=prog(),pool=freshAssessmentRows(BANK.filter(q=>q.section===1&&q.trap==='assessment-type'&&assessmentFamily(q)===family));
 if(!pool.length)return;
 const qs=pool.slice(0,Math.min(6,pool.length));
 st.assessmentDrill={
   index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id),
   startedAt:Date.now(),focusedFamily:family
 };
 st.mode='assessmentDrill';save();render();
}
function smartReviewQuestions(count=10){
 const byId=new Map(BANK.map(q=>[q.id,q]));
 const assessmentPool=BANK.filter(q=>q.section===1&&q.trap==='assessment-type');
 const out=[],used=new Set();
 const add=q=>{if(q&&!used.has(q.id)&&out.length<count){used.add(q.id);out.push(q)}};
 for(const id of assessmentMistakeIds().slice(-4))add(byId.get(id));
 const weak=assessmentMasteryRows().filter(x=>x.possible>0&&x.status!=='Mastered').sort((a,b)=>a.pct-b.pct).slice(0,2).map(x=>x.label);
 const weakPool=freshAssessmentRows(assessmentPool.filter(q=>weak.includes(assessmentFamily(q))));
 for(const q of weakPool){if(out.length>=Math.min(count,8))break;add(q)}
 const fresh=freshAssessmentRows(assessmentPool.filter(q=>!used.has(q.id)));
 for(const q of fresh){if(out.length>=count)break;add(q)}
 if(out.length<count){
   for(const q of shuffle(assessmentPool)){if(out.length>=count)break;add(q)}
 }
 return out.slice(0,count);
}
function startSmartReview(){
 const st=prog(),qs=smartReviewQuestions(10);
 if(!qs.length)return;
 const weakBefore=assessmentMasteryRows().filter(x=>x.possible>0&&x.status!=='Mastered').sort((a,b)=>a.pct-b.pct).slice(0,2).map(x=>x.label);
 st.assessmentDrill={
   index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id),
   startedAt:Date.now(),smartReview:true,
   smartReviewStartMistakes:[...assessmentMistakeIds()],
   smartReviewTargetFamilies:weakBefore
 };
 st.mode='assessmentDrill';save();render();
}
function sampleQuestions(count,mode){
 const assessmentPool=freshAssessmentRows(BANK.filter(q=>q.section===1&&q.trap==='assessment-type'));
 if(mode==='assessmentDrill'){
   const weak=weakestAssessmentFamilies();
   if(!weak.length)return shuffle(assessmentPool).slice(0,count);
   const priority=assessmentPool.filter(q=>weak.includes(assessmentFamily(q)));
   const targeted=shuffle(priority).slice(0,Math.min(6,priority.length));
   const used=new Set(targeted.map(q=>q.id));
   const fill=shuffle(assessmentPool.filter(q=>!used.has(q.id))).slice(0,Math.max(0,count-targeted.length));
   return shuffle([...targeted,...fill]).slice(0,count);
 }
 const per=mode==='diagnostic'?[10,10,10]:[14,13,13];
 const focus=shuffle(assessmentPool).slice(0,mode==='diagnostic'?6:8);
 const focusIds=new Set(focus.map(q=>q.id));
 let out=[...focus];
 for(let i=0;i<3;i++){
   const target=Math.max(0,per[i]-out.filter(q=>q.section===i+1).length);
   out.push(...shuffle(sectionQuestions(i+1).filter(q=>!focusIds.has(q.id))).slice(0,target));
 }
 return shuffle(out).slice(0,count);
}
function startExam(mode){
 const st=prog(),count=mode==='assessmentDrill'?12:mode==='diagnostic'?30:40,qs=sampleQuestions(count,mode);
 st[mode]={index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id),startedAt:Date.now()};
 st.mode=mode;save();render();
}
function examObj(mode){const st=prog();return st[mode]}
function examQuestions(obj){const by=new Map(BANK.map(q=>[q.id,q]));return (obj?.ids||[]).map(id=>by.get(id)).filter(Boolean)}
function examSelect(mode,v){const o=examObj(mode);if(!o||o.submitted)return;o.selected=v;render()}
function examSubmit(mode){const st=prog(),o=st[mode],qs=examQuestions(o),item=qs[o.index];if(!o||!item||!o.selected)return;const correct=o.selected===item.answer,at=Date.now();o.submitted=true;o.answers.push({id:item.id,section:item.section,concept:item.concept,trap:item.trap,chosen:o.selected,correct,at});if(mode==='assessmentDrill'){rememberAssessmentQuestion(item.id);updateAssessmentMistake(item.id,correct)}window.MajickStudyProgress?.creditAnswer?.({key:'D755:'+mode+':'+item.id+':'+at,course:'D755',source:'d755-'+mode,qid:item.id,topicId:item.topicId||realmTopic(item.section,item.concept),correct,difficulty:item.difficulty||4,chosen:o.selected,answer:item.answer,at});save();render()}
function assessmentContrast(answer){
 const a=String(answer||'');
 const pairs=[
  [/Qualitative/i,'Quantitative evidence would be numerical: scores, counts, rates, percentages, or other measured values.'],
  [/Quantitative/i,'Qualitative evidence would be descriptive: observations, interviews, characteristics, experiences, or narrative notes.'],
  [/\bInformal\b/i,'A formal assessment would use predetermined procedures, fixed directions, structured scoring, or standardized administration.'],
  [/\bFormal\b/i,'An informal assessment would be flexible and embedded in everyday classroom instruction rather than tightly standardized.'],
  [/Formative/i,'A summative assessment judges learning at an endpoint; formative evidence is used while learning is still happening to adjust instruction.'],
  [/Summative/i,'A formative assessment is used during instruction to guide the next teaching move; summative assessment evaluates learning at a defined endpoint.'],
  [/Norm-referenced/i,'Criterion-referenced results compare performance with a defined skill or standard rather than with a norm group.'],
  [/Criterion-referenced/i,'Norm-referenced results compare the student with a peer or norm group rather than with a fixed mastery standard.'],
  [/Universal screening/i,'Progress monitoring is repeated for students receiving support to see whether intervention is working; universal screening broadly identifies who may be at risk.'],
  [/Progress monitoring/i,'Universal screening checks a broad group to identify risk; progress monitoring repeatedly measures response to instruction or intervention.'],
  [/Curriculum-Based Measurement|CBM/i,'CBM is brief, repeated, curriculum-linked measurement used to track growth; it is not a one-time endpoint test.'],
  [/Functional Behavior Assessment|FBA/i,'An FBA is a process for identifying the likely function of behavior; a single observation or checklist is only one possible data source within that process.'],
  [/Direct observation/i,'Direct observation records behavior as it happens; an anecdotal record is a narrative write-up of a specific event, often after or around the event.'],
  [/Anecdotal record/i,'An anecdotal record is a narrative description of an event; direct observation emphasizes recording performance or behavior as it occurs.'],
  [/Behavior checklist|rating scale/i,'A checklist or rating scale structures observations into categories or ratings; it is different from an open narrative anecdotal record.']
 ];
 const hit=pairs.find(([re])=>re.test(a));
 return hit?hit[1]:'Compare the purpose, administration, data form, or comparison group in the stem with the definition of the tempting alternative.';
}
function assessmentFamilyRule(label){
 const rules={
  'Data type':'Look for what kind of evidence is being described: words/qualities versus numbers/measures.',
  'Administration':'Look for how the assessment is given: standardized/structured versus flexible/classroom-based.',
  'Purpose':'Look for why the assessment is being used: adjust instruction now versus evaluate learning at an endpoint.',
  'Comparison / CBM':'Look for what performance is compared with, or whether the measure is a brief repeated curriculum-linked probe.',
  'Screening / monitoring':'Look for whether the goal is to identify risk broadly or repeatedly track response to intervention.',
  'Assessment tools':'Look for the specific evidence-gathering tool: FBA, direct observation, anecdotal record, checklist, or rating scale.'
 };
 return rules[label]||'Use the wording of the stem to identify what dimension is being classified.';
}
function assessmentFamily(q){
 const c=String(q?.concept||'').toLowerCase();
 if(/qualitative quantitative/.test(c))return 'Data type';
 if(/formal informal/.test(c))return 'Administration';
 if(/assessment purpose/.test(c))return 'Purpose';
 if(/criterion cbm/.test(c))return 'Comparison / CBM';
 if(/screening|tier movement/.test(c))return 'Screening / monitoring';
 if(/data sources/.test(c))return 'Assessment tools';
 return 'Other';
}
function examNext(mode){
 const st=prog(),o=st[mode],qs=examQuestions(o);if(!o)return;
 if(o.index<qs.length-1){o.index++;o.selected=null;o.submitted=false;save();render();return}
 const score=o.answers.filter(x=>x.correct).length,total=qs.length;
 const bySection=[1,2,3].map(n=>{const rows=o.answers.filter(x=>x.section===n);return {section:n,correct:rows.filter(x=>x.correct).length,total:rows.length,pct:rows.length?Math.round(rows.filter(x=>x.correct).length/rows.length*100):0}});
 const trapCounts={};for(const a of o.answers.filter(x=>!x.correct&&x.trap))trapCounts[x.trap]=(trapCounts[x.trap]||0)+1;
 const familyStats={};
 if(mode==='assessmentDrill'){
   const byId=new Map(BANK.map(q=>[q.id,q]));
   for(const a of o.answers){
     const family=assessmentFamily(byId.get(a.id));
     familyStats[family]=familyStats[family]||{correct:0,total:0};
     familyStats[family].total++;
     if(a.correct)familyStats[family].correct++;
   }
 }
 if(mode==='assessmentDrill')mergeAssessmentEvidence('drill',familyStats);
 let smartReviewSummary=null;
 if(mode==='assessmentDrill'&&o.smartReview){
   const startMistakes=Array.isArray(o.smartReviewStartMistakes)?o.smartReviewStartMistakes:[];
   const remainingMistakes=assessmentMistakeIds();
   const cleared=startMistakes.filter(id=>!remainingMistakes.includes(id));
   const practiced=Object.keys(familyStats);
   const weakestRemaining=assessmentMasteryRows().filter(x=>x.possible>0&&x.status!=='Mastered').sort((a,b)=>a.pct-b.pct)[0]||null;
   smartReviewSummary={
     startedMistakes:startMistakes.length,
     clearedMistakes:cleared.length,
     remainingMistakes:remainingMistakes.length,
     targetFamilies:Array.isArray(o.smartReviewTargetFamilies)?o.smartReviewTargetFamilies:[],
     practicedFamilies:practiced,
     weakestRemaining:weakestRemaining?{label:weakestRemaining.label,pct:weakestRemaining.pct,status:weakestRemaining.status}:null
   };
 }
 const result={score,total,pct:total?Math.round(score/total*100):0,bySection,trapCounts,familyStats,focusedFamily:o.focusedFamily||'',mistakeRepair:!!o.mistakeRepair,smartReview:!!o.smartReview,smartReviewSummary,at:Date.now(),status:score/total>=.85?'Ready for final review':score/total>=.7?'Targeted repair needed':'Needs another teaching pass'};
 st[mode+'Result']=result;st.mode=mode+'Result';save();render();
}
function teacherVisual(item){
 if(!item?.visual)return '';
 if(item.visual==='four-below'||item.visual==='four-above'||item.visual==='four-around'){
   const ys=item.visual==='four-below'?[76,72,70,67]:item.visual==='four-above'?[48,43,37,31]:[62,55,58,47];
   return '<div class="d755QuestionVisual"><small>READ THE DATA BEFORE CHOOSING</small><svg viewBox="0 0 420 170" role="img" aria-label="Progress monitoring graph with goal line and four recent data points"><line x1="35" y1="140" x2="390" y2="140" class="axis"/><line x1="35" y1="140" x2="35" y2="20" class="axis"/><line x1="45" y1="125" x2="380" y2="38" class="goal"/><text x="300" y="45">GOAL LINE</text>'+ys.map((y,i)=>'<circle cx="'+(220+i*48)+'" cy="'+y+'" r="6" class="point"/>').join('')+'<polyline points="'+ys.map((y,i)=>(220+i*48)+','+y).join(' ')+'" class="dataLine"/></svg><b>Four most recent data points</b></div>';
 }
 if(item.visual==='journey')return '<div class="d755QuestionVisual journey"><small>STUDENT JOURNEY</small><div><span>Concern / Screening</span><i>→</i><span>Data + Differentiation</span><i>→</i><span>IAT + Intervention</span><i>→</i><span>Monitor + Review</span><i>→</i><span>Referral / Evaluation if needed</span><i>→</i><span>Eligibility</span><i>→</i><span>IEP</span></div></div>';
 if(item.visual==='score-profile')return '<div class="d755QuestionVisual profile"><small>ASSESSMENT PROFILE</small><table><tr><th>Area</th><th>Standard score</th><th>Range</th></tr><tr><td>Reading Fluency</td><td>101</td><td>Average</td></tr><tr><td>Calculation</td><td>101</td><td>Average</td></tr><tr class="focus"><td>Math Fluency</td><td>67</td><td>Low</td></tr><tr><td>Broad Math</td><td>94</td><td>Average</td></tr></table></div>';
 if(item.visual==='cbc')return '<div class="d755QuestionVisual cbc"><small>MEASURABLE ANNUAL GOAL • C-B-C</small><div><span><b>C</b>Condition<em>When / under what circumstance?</em></span><span><b>B</b>Behavior<em>What observable skill?</em></span><span><b>C</b>Criteria<em>How well / how often?</em></span></div></div>';
 return '';
}
function assessmentTypeChart(){
 return '<section class="d755AssessmentTypeChart"><header><small>ASSESSMENT TYPE ANCHOR CHART</small><h3>Ask what the question is classifying.</h3><p>One assessment can fit more than one label. Choose the label that matches the dimension the question asks about.</p></header>'+
  '<div class="d755AssessmentTypeGrid">'+
   '<article><small>DATA TYPE</small><b>Qualitative</b><span>qualities, experiences, descriptions, interviews, narrative observations</span><b>Quantitative</b><span>numbers, scores, frequency, rate, percentile, standard score</span></article>'+
   '<article><small>ADMINISTRATION</small><b>Formal</b><span>structured procedures, fixed directions, standardized scoring</span><b>Informal</b><span>flexible classroom evidence embedded in instruction</span></article>'+
   '<article><small>PURPOSE</small><b>Formative</b><span>during learning; used to adjust instruction</span><b>Summative</b><span>at an endpoint; used to evaluate learning</span></article>'+
   '<article><small>COMPARISON</small><b>Norm-referenced</b><span>student compared with a norm group</span><b>Criterion-referenced</b><span>student compared with a defined standard or mastery criterion</span></article>'+
   '<article><small>MTSS / MONITORING</small><b>Universal screening</b><span>broad check to identify who may need support</span><b>Progress monitoring</b><span>repeated checks to see whether intervention is working</span></article>'+
   '<article><small>COMMON TOOLS</small><b>CBM</b><span>brief, frequent, curriculum-linked growth measure</span><b>FBA</b><span>identifies the likely function of behavior</span><b>Observation / anecdotal / checklist</b><span>different ways to capture behavior or performance in context</span></article>'+
  '</div>'+
  '<div class="d755AssessmentRule"><b>WGU decision rule:</b> if the stem says “what type based on purpose?” choose formative/summative; if it says “how was it administered?” choose formal/informal; if it asks “what kind of data?” choose qualitative/quantitative.</div>'+
 '</section>';
}
const ASSESSMENT_DIMENSIONS=['Data type','Administration','Purpose','Comparison / CBM','Screening / monitoring','Assessment tools'];

const ASSESSMENT_CONTRAST_PAIRS=[
 {label:'Qualitative vs Quantitative',answers:['Qualitative data','Quantitative data']},
 {label:'Formal vs Informal',answers:['Formal assessment','Informal assessment']},
 {label:'Formative vs Summative',answers:['Formative assessment','Summative assessment']},
 {label:'Norm vs Criterion',answers:['Norm-referenced','Criterion-referenced']},
 {label:'Screening vs Progress Monitoring',answers:['Universal screening','Progress monitoring']},
 {label:'Direct Observation vs Anecdotal Record',answers:['Direct observation','Anecdotal record']}
];
function contrastPairFor(q){
 return ASSESSMENT_CONTRAST_PAIRS.find(p=>p.answers.includes(q?.answer))||null;
}
function contrastPairFamily(label){
 const map={
  'Qualitative vs Quantitative':'Data type',
  'Formal vs Informal':'Administration',
  'Formative vs Summative':'Purpose',
  'Norm vs Criterion':'Comparison / CBM',
  'Screening vs Progress Monitoring':'Screening / monitoring',
  'Direct Observation vs Anecdotal Record':'Assessment tools'
 };
 return map[label]||'Other';
}
function startContrastRepair(){
 const st=prog(),pool=freshAssessmentRows(BANK.filter(q=>q.section===1&&q.trap==='assessment-type'&&contrastPairFor(q)));
 const picked=[];
 for(const pair of ASSESSMENT_CONTRAST_PAIRS){
   const rows=freshAssessmentRows(pool.filter(q=>contrastPairFor(q)?.label===pair.label)).slice(0,2);
   picked.push(...rows);
 }
 const qs=shuffle(picked).slice(0,12);
 st.contrastRepair={index:0,ids:qs.map(q=>q.id),selected:null,submitted:false,answers:[],startedAt:Date.now()};
 st.mode='contrastRepair';save();render();
}
function contrastRepairObj(){return prog()?.contrastRepair}
function contrastRepairQuestions(o){return examQuestions(o)}
function contrastRepairSelect(v){
 const o=contrastRepairObj();if(!o||o.submitted)return;o.selected=v;render();
}
function contrastRepairSubmit(){
 const st=prog(),o=st.contrastRepair,q=contrastRepairQuestions(o)[o?.index];
 if(!o||!q||!o.selected)return;
 const correct=o.selected===q.answer,at=Date.now();
 o.submitted=true;
 o.answers.push({id:q.id,pair:contrastPairFor(q)?.label||'',chosen:o.selected,answer:q.answer,correct,at});
 rememberAssessmentQuestion(q.id);
 updateAssessmentMistake(q.id,correct);
 window.MajickStudyProgress?.creditAnswer?.({
   key:'D755:contrast-repair:'+q.id+':'+at,course:'D755',source:'d755-contrast-repair',
   qid:q.id,topicId:q.topicId||realmTopic(q.section,q.concept),correct,difficulty:q.difficulty||4,
   chosen:o.selected,answer:q.answer,at
 });
 save();render();
}
function contrastRepairNext(){
 const st=prog(),o=st.contrastRepair,qs=contrastRepairQuestions(o);if(!o||!o.submitted)return;
 if(o.index<qs.length-1){
   o.index++;o.selected=null;o.submitted=false;save();render();return;
 }
 const total=qs.length,score=o.answers.filter(x=>x.correct).length;
 const pairStats={},familyStats={};
 for(const a of o.answers){
   pairStats[a.pair]=pairStats[a.pair]||{correct:0,total:0};
   pairStats[a.pair].total++;
   if(a.correct)pairStats[a.pair].correct++;
   const family=contrastPairFamily(a.pair);
   familyStats[family]=familyStats[family]||{correct:0,total:0};
   familyStats[family].total++;
   if(a.correct)familyStats[family].correct++;
 }
 mergeAssessmentEvidence('pairs',familyStats);
 st.contrastRepairResult={score,total,pct:total?Math.round(score/total*100):0,pairStats,familyStats,at:Date.now()};
 st.mode='contrastRepairResult';save();render();
}
function contrastRepairView(){
 const st=prog(),o=st.contrastRepair;
 if(!o)return '<section class="d755ExamIntro d755ContrastIntro"><small>CONFUSING PAIRS REPAIR</small><h1>Practice the two labels that look almost right.</h1><p>Each case removes extra distractors so you can focus on the exact distinction: qualitative/quantitative, formal/informal, formative/summative, norm/criterion, or screening/progress monitoring.</p><button class="btn primary" data-d755-start-contrast>Start 12-Case Repair</button></section>';
 const qs=contrastRepairQuestions(o),q=qs[o.index];if(!q)return '<div class="d755Empty">Contrast-repair question set unavailable.</div>';
 const pair=contrastPairFor(q),correct=o.selected===q.answer;
 return '<section class="d755Exam d755ContrastRepair"><header><div><small>CONFUSING PAIRS REPAIR</small><h2>'+E(pair?.label||'Assessment contrast')+'</h2></div><span>'+(o.index+1)+' / '+qs.length+'</span></header><article>'+
  '<h3>'+E(q.prompt)+'</h3>'+
  '<div class="d755ContrastChoices">'+(pair?.answers||[]).map(x=>'<button '+(o.submitted?'disabled':'')+' class="'+(o.submitted?(x===q.answer?'correct':x===o.selected?'wrong':''):o.selected===x?'selected':'')+'" data-d755-contrast-choice="'+E(x)+'">'+E(x)+'</button>').join('')+'</div>'+
  (!o.submitted?'<footer><button class="btn primary" '+(o.selected?'':'disabled')+' data-d755-contrast-submit>Lock answer</button></footer>':
   '<div class="d755Feedback '+(correct?'correct':'repair')+'"><b>'+(correct?'✓ You separated the pair':'Repair this pair')+'</b><p>'+E(q.why)+'</p><div class="d755ContrastWhy"><small>WHY NOT THE OTHER ONE?</small><span>'+E(assessmentContrast(q.answer))+'</span></div></div><footer><button class="btn primary" data-d755-contrast-next>'+(o.index<qs.length-1?'Next pair →':'See repair results →')+'</button></footer>')+
 '</article></section>';
}
function contrastRepairResultView(){
 const st=prog(),r=st.contrastRepairResult;if(!r)return contrastRepairView();
 return '<section class="d755Result d755ContrastResult"><small>CONFUSING PAIRS REPAIR • RESULTS</small><h1>'+r.score+' / '+r.total+'</h1><div class="score">'+r.pct+'%</div><div class="d755AssessmentBreakdown">'+Object.entries(r.pairStats||{}).map(([label,row])=>{const pct=row.total?Math.round(row.correct/row.total*100):0;return '<article><div><b>'+E(label)+'</b><span>'+row.correct+'/'+row.total+' • '+pct+'%</span></div><i><em style="width:'+pct+'%"></em></i></article>'}).join('')+'</div>'+assessmentMasteryHTML()+'<div class="resultActions"><button class="btn primary" data-d755-start-contrast>Try new pairs</button><button class="btn ghost" data-d755-mode="assessmentDrill">Assessment Type Drill</button><button class="btn ghost" data-d755-home>Retake Studio Home</button></div></section>';
}
function startDimensionDetective(){
 const st=prog(),pool=freshAssessmentRows(BANK.filter(q=>q.section===1&&q.trap==='assessment-type'));
 const picked=[],seen=new Set();
 for(const q of pool){
   const fam=assessmentFamily(q);
   if(!seen.has(fam)){picked.push(q);seen.add(fam)}
   if(picked.length>=6)break;
 }
 for(const q of pool){
   if(picked.length>=8)break;
   if(!picked.some(x=>x.id===q.id))picked.push(q);
 }
 st.dimensionDetective={
   index:0,ids:picked.map(q=>q.id),phase:'dimension',
   dimensionChoice:null,answerChoice:null,dimensionSubmitted:false,answerSubmitted:false,
   answers:[],startedAt:Date.now()
 };
 st.mode='dimensionDetective';save();render();
}
function detectiveObj(){return prog()?.dimensionDetective}
function detectiveQuestions(o){return examQuestions(o)}
function detectiveChooseDimension(v){
 const o=detectiveObj();if(!o||o.dimensionSubmitted)return;
 o.dimensionChoice=v;render();
}
function detectiveSubmitDimension(){
 const o=detectiveObj(),q=detectiveQuestions(o)[o?.index];
 if(!o||!q||!o.dimensionChoice)return;
 o.dimensionSubmitted=true;
 o.phase='classification';
 save();render();
}
function detectiveChooseAnswer(v){
 const o=detectiveObj();if(!o||!o.dimensionSubmitted||o.answerSubmitted)return;
 o.answerChoice=v;render();
}
function detectiveSubmitAnswer(){
 const st=prog(),o=st.dimensionDetective,q=detectiveQuestions(o)[o?.index];
 if(!o||!q||!o.answerChoice)return;
 const dimension=assessmentFamily(q);
 const dimensionCorrect=o.dimensionChoice===dimension;
 const answerCorrect=o.answerChoice===q.answer;
 const at=Date.now();
 o.answerSubmitted=true;
 rememberAssessmentQuestion(q.id);
 updateAssessmentMistake(q.id,answerCorrect);
 o.answers.push({
   id:q.id,dimension,dimensionChoice:o.dimensionChoice,dimensionCorrect,
   chosen:o.answerChoice,answer:q.answer,correct:answerCorrect,at
 });
 window.MajickStudyProgress?.creditAnswer?.({
   key:'D755:dimension-detective:'+q.id+':'+at,course:'D755',source:'d755-dimension-detective',
   qid:q.id,topicId:q.topicId||realmTopic(q.section,q.concept),correct:answerCorrect,
   difficulty:q.difficulty||4,chosen:o.answerChoice,answer:q.answer,at
 });
 save();render();
}
function detectiveNext(){
 const st=prog(),o=st.dimensionDetective,qs=detectiveQuestions(o);if(!o||!o.answerSubmitted)return;
 if(o.index<qs.length-1){
   o.index++;o.phase='dimension';o.dimensionChoice=null;o.answerChoice=null;
   o.dimensionSubmitted=false;o.answerSubmitted=false;save();render();return;
 }
 const total=qs.length;
 const dimensionScore=o.answers.filter(x=>x.dimensionCorrect).length;
 const classificationScore=o.answers.filter(x=>x.correct).length;
 const familyStats={};
 for(const a of o.answers){
   familyStats[a.dimension]=familyStats[a.dimension]||{dimensionCorrect:0,classificationCorrect:0,total:0};
   familyStats[a.dimension].total++;
   if(a.dimensionCorrect)familyStats[a.dimension].dimensionCorrect++;
   if(a.correct)familyStats[a.dimension].classificationCorrect++;
 }
 mergeAssessmentEvidence('detective',familyStats);
 st.dimensionDetectiveResult={
   total,dimensionScore,classificationScore,familyStats,at:Date.now()
 };
 st.mode='dimensionDetectiveResult';save();render();
}
function dimensionDetectiveView(){
 const st=prog(),o=st.dimensionDetective;
 if(!o)return '<section class="d755ExamIntro dimensionDetectiveIntro"><small>ASSESSMENT DIMENSION DETECTIVE</small><h1>First identify what the stem is asking.</h1><p>One scenario can be formal, summative, quantitative, and norm-referenced at the same time. This mode trains you to identify the dimension the question wants before choosing the label.</p><div class="d755DetectiveSteps"><span><b>1</b>Name the dimension</span><i>→</i><span><b>2</b>Classify the assessment</span><i>→</i><span><b>3</b>Explain the contrast</span></div><button class="btn primary" data-d755-start-detective>Start 8-Scenario Detective</button></section>';
 const qs=detectiveQuestions(o),q=qs[o.index];if(!q)return '<div class="d755Empty">Detective question set unavailable.</div>';
 const family=assessmentFamily(q),dimensionCorrect=o.dimensionChoice===family,answerCorrect=o.answerChoice===q.answer;
 return '<section class="d755Exam d755Detective"><header><div><small>ASSESSMENT DIMENSION DETECTIVE</small><h2>Read the stem before naming the assessment.</h2></div><span>'+(o.index+1)+' / '+qs.length+'</span></header><article>'+
  '<div class="d755DetectivePhase"><span class="'+(o.phase==='dimension'?'active':'done')+'">1 • What dimension?</span><span class="'+(o.phase==='classification'?'active':'')+'">2 • What type?</span></div>'+
  '<h3>'+E(q.prompt)+'</h3>'+
  (!o.dimensionSubmitted?
    '<div class="d755DetectivePrompt"><small>STEP 1</small><b>What is this stem asking you to classify?</b></div><div class="d755DimensionChoices">'+ASSESSMENT_DIMENSIONS.map(x=>'<button '+(o.dimensionChoice===x?'class="selected"':'')+' data-d755-detective-dimension="'+E(x)+'">'+E(x)+'</button>').join('')+'</div><footer><button class="btn primary" '+(o.dimensionChoice?'':'disabled')+' data-d755-detective-submit-dimension>Lock dimension →</button></footer>'
   :
    '<div class="d755DimensionReveal '+(dimensionCorrect?'correct':'repair')+'"><small>STEP 1 • '+(dimensionCorrect?'CORRECT':'REPAIR')+'</small><b>'+E(family)+'</b><p>'+E(assessmentFamilyRule(family))+'</p></div>'+
    '<div class="d755DetectivePrompt"><small>STEP 2</small><b>Now classify the assessment.</b></div>'+
    '<div class="d755Choices">'+q.options.map((x,i)=>'<button '+(o.answerSubmitted?'disabled':'')+' class="'+(o.answerSubmitted?(x===q.answer?'correct':x===o.answerChoice?'wrong':''):o.answerChoice===x?'selected':'')+'" data-d755-detective-answer="'+E(x)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(x)+'</span></button>').join('')+'</div>'+
    (!o.answerSubmitted?
      '<footer><button class="btn primary" '+(o.answerChoice?'':'disabled')+' data-d755-detective-submit-answer>Submit classification</button></footer>'
     :
      '<div class="d755Feedback '+(answerCorrect?'correct':'repair')+'"><b>'+(answerCorrect?'✓ Classification correct':'Repair the classification')+'</b><p>'+E(q.why)+'</p><div class="d755ClassificationLens"><small>WHY THE OTHER DIMENSION/LABEL CAN TEMPT YOU</small><b>'+E(family)+'</b><span>'+E(assessmentFamilyRule(family))+'</span><em><b>Why not the tempting opposite?</b> '+E(assessmentContrast(q.answer))+'</em></div></div><footer><button class="btn primary" data-d755-detective-next>'+(o.index<qs.length-1?'Next case →':'See detective results →')+'</button></footer>')
  )+
 '</article></section>';
}
function dimensionDetectiveResultView(){
 const st=prog(),r=st.dimensionDetectiveResult;if(!r)return dimensionDetectiveView();
 const dimensionPct=Math.round(r.dimensionScore/r.total*100),classPct=Math.round(r.classificationScore/r.total*100);
 return '<section class="d755Result d755DetectiveResult"><small>ASSESSMENT DIMENSION DETECTIVE • RESULTS</small><h1>Separate the question from the label.</h1><div class="d755DetectiveScores"><div><b>'+r.dimensionScore+' / '+r.total+'</b><span>dimension recognition</span><em>'+dimensionPct+'%</em></div><div><b>'+r.classificationScore+' / '+r.total+'</b><span>assessment classification</span><em>'+classPct+'%</em></div></div><div class="d755AssessmentBreakdown">'+Object.entries(r.familyStats||{}).map(([label,row])=>'<article><div><b>'+E(label)+'</b><span>Dimension '+row.dimensionCorrect+'/'+row.total+' • Type '+row.classificationCorrect+'/'+row.total+'</span></div></article>').join('')+'</div><p class="evidenceNote">If your type score is higher than your dimension score, slow down and identify what the stem is asking before reading the answer choices.</p>'+assessmentMasteryHTML()+'<div class="resultActions"><button class="btn primary" data-d755-start-detective>Try 8 new cases</button><button class="btn ghost" data-d755-mode="assessmentDrill">Assessment Type Drill</button><button class="btn ghost" data-d755-home>Retake Studio Home</button></div></section>';
}

function examView(mode){
 const st=prog(),o=st[mode];
 const isDrill=mode==='assessmentDrill';
 const title=isDrill?(o?.smartReview?'10-Question Smart Review':'12-Question Assessment Type Drill'):mode==='diagnostic'?'30-Question Retake Diagnostic':'40-Question Mock OA';
 const weak=isDrill?weakestAssessmentFamilies():[];
 const intro=isDrill?'Practice identifying qualitative/quantitative, formal/informal, formative/summative, norm-/criterion-referenced, CBM, screening, progress monitoring, FBA, observation, anecdotal records, and behavior checklists.':mode==='diagnostic'?'Find the concepts that actually need reteaching before you spend time reviewing everything again.':'Mixed, unlabeled scenarios across all three sections. No tutor prompts during the simulation.';
 if(!o)return '<section class="d755ExamIntro"><small>'+E(isDrill?'ASSESSMENT TYPE DRILL':mode.toUpperCase())+'</small><h1>'+E(title)+'</h1><p>'+E(intro)+'</p>'+(isDrill&&weak.length?'<div class="d755AdaptiveFocus"><small>ADAPTIVE FOCUS THIS ROUND</small><b>'+E(weak.join(' + '))+'</b><span>More questions will come from your two weakest categories.</span></div>':'')+(isDrill?assessmentTypeChart():'')+'<button class="btn primary" data-d755-start-exam="'+mode+'">Start '+E(isDrill?'Drill':mode==='diagnostic'?'Diagnostic':'Mock OA')+'</button></section>';
 const qs=examQuestions(o),item=qs[o.index];if(!item)return '<div class="d755Empty">Question set unavailable.</div>';
 return '<section class="d755Exam"><header><div><small>'+E(mode==='assessmentDrill'?(o?.smartReview?'SMART REVIEW':'ASSESSMENT TYPE DRILL'):mode==='diagnostic'?'RETAKE DIAGNOSTIC':'MOCK OA')+'</small><h2>Assessment for Special Education</h2></div><span>'+(o.index+1)+' / '+qs.length+'</span></header><article>'+(isDrill?'<details class="d755AssessReminder"><summary>Need a reminder? Open the Assessment Type Anchor Chart</summary>'+assessmentTypeChart()+'</details>':'')+'<h3>'+E(item.prompt)+'</h3>'+teacherVisual(item)+'<div class="d755Choices">'+item.options.map((x,i)=>'<button '+(o.submitted?'disabled':'')+' class="'+(o.submitted?(x===item.answer?'correct':x===o.selected?'wrong':''):o.selected===x?'selected':'')+'" data-d755-exam-choice="'+E(mode)+'" data-choice="'+E(x)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(x)+'</span></button>').join('')+'</div>'+(o.submitted&&(mode==='diagnostic'||mode==='assessmentDrill')?'<div class="d755Feedback '+(o.selected===item.answer?'correct':'repair')+'"><b>'+(o.selected===item.answer?'✓ Correct':'Repair this decision')+'</b><p>'+E(item.why)+'</p>'+(mode==='assessmentDrill'?'<div class="d755ClassificationLens"><small>THIS STEM IS ASKING ABOUT</small><b>'+E(assessmentFamily(item))+'</b><span>'+E(assessmentFamilyRule(assessmentFamily(item)))+'</span><em><b>Why not the tempting opposite?</b> '+E(assessmentContrast(item.answer))+'</em></div>':'')+'</div>':'')+'<footer>'+(!o.submitted?'<button class="btn primary" '+(o.selected?'':'disabled')+' data-d755-exam-submit="'+mode+'">Submit</button>':'<button class="btn primary" data-d755-exam-next="'+mode+'">'+(o.index<qs.length-1?'Next →':'See results →')+'</button>')+'</footer></article></section>';
}
function smartReviewSummaryHTML(r){
 const x=r?.smartReviewSummary;if(!r?.smartReview||!x)return '';
 const target=x.targetFamilies?.length?x.targetFamilies.join(' + '):'Mixed assessment review';
 const practiced=x.practicedFamilies?.length?x.practicedFamilies.join(', '):'Mixed dimensions';
 const weakest=x.weakestRemaining;
 return '<section class="d755SmartReviewSummary"><header><small>SMART REVIEW • WHAT CHANGED</small><h3>Your repair snapshot</h3></header>'+
  '<div class="d755SmartReviewStats">'+
   '<article><b>'+Number(x.clearedMistakes||0)+'</b><span>mistakes cleared</span><small>started with '+Number(x.startedMistakes||0)+'</small></article>'+
   '<article><b>'+Number(x.remainingMistakes||0)+'</b><span>mistakes still queued</span><small>correct retries clear them</small></article>'+
   '<article><b>'+Number(x.practicedFamilies?.length||0)+'</b><span>dimensions practiced</span><small>'+E(practiced)+'</small></article>'+
  '</div>'+
  '<div class="d755SmartReviewFocus"><div><small>REVIEW TARGET</small><b>'+E(target)+'</b></div>'+
   (weakest?'<div><small>WEAKEST REMAINING</small><b>'+E(weakest.label)+' • '+Number(weakest.pct||0)+'%</b><span>'+E(weakest.status)+'</span></div>':'<div><small>WEAKEST REMAINING</small><b>No practiced dimension below mastery</b></div>')+
  '</div>'+
 '</section>';
}
function resultView(mode){
 const st=prog(),r=st[mode+'Result'];if(!r)return examView(mode);
 const isDrill=mode==='assessmentDrill';
 const traps=Object.entries(r.trapCounts||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
 return '<section class="d755Result"><small>'+E(isDrill?(r.smartReview?'SMART REVIEW RESULTS':'ASSESSMENT TYPE DRILL RESULTS'):mode==='diagnostic'?'DIAGNOSTIC RESULTS':'MOCK OA RESULTS')+'</small><h1>'+E(r.status)+'</h1><div class="score">'+r.score+' / '+r.total+'<span>'+r.pct+'%</span></div>'+(isDrill?'<p class="evidenceNote">'+(r.mistakeRepair?'<b>Mistake Repair Queue:</b> '+assessmentMistakeIds().length+' item'+(assessmentMistakeIds().length===1?'':'s')+' still waiting. ':r.smartReview?'<b>Smart Review:</b> mistakes, weak dimensions, and fresh questions were mixed into this set. ':r.focusedFamily?'Focused practice: <b>'+E(r.focusedFamily)+'</b>. ':'')+'Use the question wording to decide whether it is asking about data type, administration, purpose, comparison, or monitoring.</p>'+smartReviewSummaryHTML(r)+'<div class="d755AssessmentBreakdown">'+Object.entries(r.familyStats||{}).map(([label,row])=>{const pct=row.total?Math.round(row.correct/row.total*100):0;return '<article><div><b>'+E(label)+'</b><span>'+row.correct+'/'+row.total+' • '+pct+'%</span></div><i><em style="width:'+pct+'%"></em></i></article>'}).join('')+'</div>'+assessmentMasteryHTML()+assessmentTypeChart():'<div class="sectionResults">'+r.bySection.map(x=>'<div><b>Section '+x.section+'</b><span>'+x.correct+'/'+x.total+' • '+x.pct+'%</span><i><em style="width:'+x.pct+'%"></em></i></div>').join('')+'</div>')+(traps.length?'<div class="d755Weak"><h3>Highest-priority decision traps</h3>'+traps.map(([id,n])=>'<article><b>'+E(REPAIRS[id]?.title||id)+'</b><span>'+n+' miss'+(n===1?'':'es')+'</span><p>'+E(REPAIRS[id]?.right||'Review the related concept.')+'</p></article>').join('')+'</div>':'')+'<div class="resultActions">'+(isDrill?'':'<button class="btn primary" data-d755-repair-result="'+mode+'">Study my weakest area</button>')+'<button class="btn ghost" data-d755-start-exam="'+mode+'">'+E(isDrill?'Practice weak types next':'Retake with new mix')+'</button><button class="btn ghost" data-d755-home>Retake Studio Home</button></div><p class="evidenceNote">This is practice evidence for your retake preparation, not a prediction of your WGU OA result.</p></section>';
}
function repairFromResult(mode){
 const st=prog(),r=st[mode+'Result'];if(!r)return go('home');
 const weakest=[...r.bySection].sort((a,b)=>a.pct-b.pct)[0];const sec=SECTIONS[weakest.section-1];
 st.sectionId=sec.id;st.conceptIndex=0;st.phase=0;st.mode='sectionOpening';save();render();
}
function startSectionCheck(){
 const {st,section}=current(),qs=shuffle(sectionQuestions(section.number)).slice(0,8);
 st.sectionCheck={section:section.number,index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id)};
 st.mode='sectionCheck';save();render();
}
function checkView(){
 const st=prog(),o=st.sectionCheck,section=SECTIONS[(o?.section||1)-1];if(!o)return opening(section);
 const qs=examQuestions(o),item=qs[o.index];
 return '<section class="d755Exam"><header><div><small>SECTION '+section.number+' • CAN I DO THIS?</small><h2>Section Mastery Check</h2></div><span>'+(o.index+1)+' / '+qs.length+'</span></header><article><h3>'+E(item.prompt)+'</h3>'+teacherVisual(item)+'<div class="d755Choices">'+item.options.map((x,i)=>'<button '+(o.submitted?'disabled':'')+' class="'+(o.submitted?(x===item.answer?'correct':x===o.selected?'wrong':''):o.selected===x?'selected':'')+'" data-d755-check-choice data-choice="'+E(x)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(x)+'</span></button>').join('')+'</div>'+(o.submitted?'<div class="d755Feedback '+(o.selected===item.answer?'correct':'repair')+'"><b>'+(o.selected===item.answer?'✓ Correct':'Review this decision')+'</b><p>'+E(item.why)+'</p></div>':'')+'<footer>'+(!o.submitted?'<button class="btn primary" '+(o.selected?'':'disabled')+' data-d755-check-submit>Submit</button>':'<button class="btn primary" data-d755-check-next>'+(o.index<qs.length-1?'Next →':'See mastery result →')+'</button>')+'</footer></article></section>';
}
function checkSelect(v){const st=prog(),o=st.sectionCheck;if(!o||o.submitted)return;o.selected=v;render()}
function checkSubmit(){const st=prog(),o=st.sectionCheck,qs=examQuestions(o),item=qs[o.index];if(!o||!item||!o.selected)return;const correct=o.selected===item.answer,at=Date.now();o.submitted=true;o.answers.push({id:item.id,section:item.section,concept:item.concept,trap:item.trap,chosen:o.selected,correct,at});window.MajickStudyProgress?.creditAnswer?.({key:'D755:section-check:'+o.section+':'+item.id+':'+at,course:'D755',source:'d755-section-check',qid:item.id,topicId:item.topicId||realmTopic(item.section,item.concept),correct,difficulty:item.difficulty||4,chosen:o.selected,answer:item.answer,at});save();render()}
function checkNext(){
 const st=prog(),o=st.sectionCheck,qs=examQuestions(o);if(o.index<qs.length-1){o.index++;o.selected=null;o.submitted=false;save();render();return}
 const score=o.answers.filter(x=>x.correct).length,total=qs.length,status=score>=7?'Ready to move on':score>=6?'One distinction to repair':'Needs another teaching pass';
 st.sectionChecks['s'+o.section]={score,total,status,answers:clone(o.answers),at:Date.now()};st.mode='sectionResult';save();render();
}
function checkResult(){
 const {st,section}=current(),r=st.sectionChecks['s'+section.number]||{score:0,total:0,status:'Needs another teaching pass',answers:[]};
 return '<section class="d755Result section"><small>SECTION '+section.number+' • CAN I DO THIS?</small><h1>'+E(r.status)+'</h1><div class="score">'+r.score+' / '+r.total+'</div><p>'+(r.status==='Ready to move on'?'Your evidence supports moving to the next section.':r.status==='One distinction to repair'?'Repair the missed distinction, then move forward.':'Return to the teaching cycle before advancing.')+'</p><div class="resultActions">'+(r.status==='Ready to move on'?'<button class="btn primary" data-d755-next-section>'+(section.number<3?'Start Section '+(section.number+1)+' →':'Return to Retake Studio →')+'</button>':'<button class="btn primary" data-d755-repair-section>Repair this section →</button>')+'<button class="btn ghost" data-d755-retake-section>Retake section check</button></div></section>';
}
function trapsView(){return '<section class="d755Library"><header><small>D755 • WGU TRAP LIBRARY</small><h1>Learn the distractor patterns</h1><p>These are the decision errors that repeatedly appear in the section quizzes you supplied.</p></header><div class="trapGrid">'+TRAPS.map(t=>'<article><span>WGU TRAP</span><h3>'+E(t.title)+'</h3><p class="wrong"><b>Tempting mistake:</b> '+E(t.wrong)+'</p><p class="right"><b>Better reasoning:</b> '+E(t.right)+'</p></article>').join('')+'</div></section>'}
function anchorsView(){
 const st=prog(),rows=[];for(const s of SECTIONS)for(const c of s.concepts)if(st.anchors[c.id])rows.push([s,c]);
 return '<section class="d755Library"><header><small>D755 • ARCANE ANCHOR WALL</small><h1>Your Retake Memory Wall</h1><p>Charts unlock as you reach each concept. They use the course terminology first and memory cues second.</p></header>'+(rows.length?'<div class="anchorGrid">'+rows.map(([s,c])=>anchor(c,s)).join('')+'</div>':'<div class="d755Empty">No charts unlocked yet. Begin a section and reach the Anchor stage.</div>')+'</section>';
}
function grimoireWall(){
 const st=prog(),rows=[];for(const s of SECTIONS)for(const c of s.concepts)if(st.anchors[c.id])rows.push([s,c]);
 return '<section class="d755GrimoireWall"><header><small>THE ARCANE STACKS • D755</small><h2>Assessment Anchor Wall</h2><p>Your unlocked Assessment for Special Education charts travel with you into the Living Grimoire.</p></header>'+(rows.length?'<div class="anchorGrid">'+rows.map(([s,c])=>anchor(c,s)).join('')+'</div>':'<div class="d755Empty">No D755 anchor charts unlocked yet.</div>')+'</section>';
}
function learnView(){
 const {st,section,concept,idx}=current();
 if(st.mode==='sectionOpening')return opening(section);
 if(st.mode==='sectionCheck')return checkView();
 if(st.mode==='sectionResult')return checkResult();
 const main=st.phase===0?teach(concept):st.phase===1?anchorStage(concept,section):st.phase===2?worked(concept):st.phase===3?questionStage(concept.check,'check',concept):st.phase===4?questionStage(concept.transfer,'transfer',concept):st.phase===5?explainStage(concept):completeStage(concept,section,idx);
 return '<div class="d755ConceptHead"><div><small>SECTION '+section.number+' • CONCEPT '+(idx+1)+' OF '+section.concepts.length+'</small><h1>'+E(concept.title)+'</h1></div><span>'+section.concepts.filter(c=>st.completed[c.id]).length+'/'+section.concepts.length+' complete</span></div>'+phaseBar(st)+main;
}
function shell(){
 const {st,section,concept}=current();
 let center=st.mode==='home'?home():st.mode==='diagnostic'?examView('diagnostic'):st.mode==='diagnosticResult'?resultView('diagnostic'):st.mode==='assessmentDrill'?examView('assessmentDrill'):st.mode==='assessmentDrillResult'?resultView('assessmentDrill'):st.mode==='dimensionDetective'?dimensionDetectiveView():st.mode==='dimensionDetectiveResult'?dimensionDetectiveResultView():st.mode==='contrastRepair'?contrastRepairView():st.mode==='contrastRepairResult'?contrastRepairResultView():st.mode==='mock'?examView('mock'):st.mode==='mockResult'?resultView('mock'):st.mode==='traps'?trapsView():st.mode==='anchors'?anchorsView():learnView();
 const quiet=['home','diagnostic','diagnosticResult','assessmentDrill','assessmentDrillResult','dimensionDetective','dimensionDetectiveResult','contrastRepair','contrastRepairResult','mock','mockResult','traps','anchors','sectionOpening','sectionCheck','sectionResult'].includes(st.mode);
 return '<section class="d755Retake"><header class="d755Header"><div><small>THE MOONLIT COLLEGIUM • D755</small><h2>Assessment for Special Education • Retake Studio</h2><p>Evidence → Interpretation → Individualized Decision → Intervention → Monitoring → Communication</p></div><button class="btn ghost" data-d755-home>Retake Studio Home</button></header><div class="d755Grid">'+rail(st,section)+'<main>'+center+'</main>'+(quiet?'':tutorPanel(concept,st))+'</div></section>';
}
function show(){
 if(!active())return;
 document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
 const panel=document.querySelector('.learnPanel[data-panel="d755retake"]');if(panel)panel.hidden=false;
 document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
 document.querySelector('[data-d755-tab="d755retake"]')?.classList.add('active');
 ensureBank();render();
}
function render(){const box=document.getElementById('d755RetakeRoot');if(box&&active()){box.innerHTML=shell();bindInside(box)}}
function bindInside(root){
 root.querySelectorAll('[data-d755-home]').forEach(b=>b.addEventListener('click',()=>go('home')));
 root.querySelectorAll('[data-d755-section]').forEach(b=>b.addEventListener('click',()=>selectSection(b.dataset.d755Section)));
 root.querySelectorAll('[data-d755-mode]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.d755Mode;if(m==='diagnostic'||m==='mock'||m==='assessmentDrill'){const st=prog();st[m]=null;st.mode=m}else if(m==='dimensionDetective'){const st=prog();st.dimensionDetective=null;st.mode=m}else if(m==='contrastRepair'){const st=prog();st.contrastRepair=null;st.mode=m}else st.mode=m;save();render()}));
 root.querySelector('[data-d755-begin]')?.addEventListener('click',beginSection);
 root.querySelectorAll('[data-d755-phase]').forEach(b=>b.addEventListener('click',()=>setPhase(Number(b.dataset.d755Phase))));
 root.querySelectorAll('[data-d755-answer]').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.d755Answer,b.dataset.choice)));
 root.querySelector('[data-d755-explain]')?.addEventListener('click',explainTyped);
 root.querySelector('[data-d755-aloud]')?.addEventListener('click',()=>explainChoice('Explained aloud'));
 root.querySelectorAll('[data-d755-tutor]').forEach(b=>b.addEventListener('click',()=>tutor(b.dataset.d755Tutor)));
 root.querySelector('[data-d755-complete]')?.addEventListener('click',completeConcept);
 root.querySelectorAll('[data-d755-start-exam]').forEach(b=>b.addEventListener('click',()=>startExam(b.dataset.d755StartExam)));
 root.querySelectorAll('[data-d755-smart-review]').forEach(b=>b.addEventListener('click',startSmartReview));
 root.querySelectorAll('[data-d755-focus-family]').forEach(b=>b.addEventListener('click',()=>startAssessmentFamilyPractice(b.dataset.d755FocusFamily)));
 root.querySelectorAll('[data-d755-mistake-repair]').forEach(b=>b.addEventListener('click',()=>startAssessmentMistakeRepair()));
 root.querySelectorAll('[data-d755-mistake-family]').forEach(b=>b.addEventListener('click',()=>startAssessmentMistakeRepair(b.dataset.d755MistakeFamily)));
 root.querySelectorAll('[data-d755-start-detective]').forEach(b=>b.addEventListener('click',startDimensionDetective));
 root.querySelectorAll('[data-d755-start-contrast]').forEach(b=>b.addEventListener('click',startContrastRepair));
 root.querySelectorAll('[data-d755-contrast-choice]').forEach(b=>b.addEventListener('click',()=>contrastRepairSelect(b.dataset.d755ContrastChoice)));
 root.querySelector('[data-d755-contrast-submit]')?.addEventListener('click',contrastRepairSubmit);
 root.querySelector('[data-d755-contrast-next]')?.addEventListener('click',contrastRepairNext);
 root.querySelectorAll('[data-d755-detective-dimension]').forEach(b=>b.addEventListener('click',()=>detectiveChooseDimension(b.dataset.d755DetectiveDimension)));
 root.querySelector('[data-d755-detective-submit-dimension]')?.addEventListener('click',detectiveSubmitDimension);
 root.querySelectorAll('[data-d755-detective-answer]').forEach(b=>b.addEventListener('click',()=>detectiveChooseAnswer(b.dataset.d755DetectiveAnswer)));
 root.querySelector('[data-d755-detective-submit-answer]')?.addEventListener('click',detectiveSubmitAnswer);
 root.querySelector('[data-d755-detective-next]')?.addEventListener('click',detectiveNext);
 root.querySelectorAll('[data-d755-exam-choice]').forEach(b=>b.addEventListener('click',()=>examSelect(b.dataset.d755ExamChoice,b.dataset.choice)));
 root.querySelectorAll('[data-d755-exam-submit]').forEach(b=>b.addEventListener('click',()=>examSubmit(b.dataset.d755ExamSubmit)));
 root.querySelectorAll('[data-d755-exam-next]').forEach(b=>b.addEventListener('click',()=>examNext(b.dataset.d755ExamNext)));
 root.querySelectorAll('[data-d755-repair-result]').forEach(b=>b.addEventListener('click',()=>repairFromResult(b.dataset.d755RepairResult)));
 root.querySelectorAll('[data-d755-check-choice]').forEach(b=>b.addEventListener('click',()=>checkSelect(b.dataset.choice)));
 root.querySelector('[data-d755-check-submit]')?.addEventListener('click',checkSubmit);
 root.querySelector('[data-d755-check-next]')?.addEventListener('click',checkNext);
 root.querySelector('[data-d755-next-section]')?.addEventListener('click',()=>{const {section}=current();if(section.number<3)selectSection(SECTIONS[section.number].id);else go('home')});
 root.querySelector('[data-d755-repair-section]')?.addEventListener('click',()=>{const st=prog();st.mode='learn';st.conceptIndex=0;st.phase=0;save();render()});
 root.querySelector('[data-d755-retake-section]')?.addEventListener('click',startSectionCheck);
}
const previousScreenHTML=window.screenHTML;
if(typeof previousScreenHTML==='function'&&!previousScreenHTML.__d755Grimoire){
 const wrapped=function(){
   const h=previousScreenHTML.apply(this,arguments);
   if(window.S?.screen==='livinggrimoire'&&active())return h+'<div class="d755GrimoireInline">'+grimoireWall()+'</div>';
   return h;
 };
 wrapped.__d755Grimoire=true;
 window.screenHTML=wrapped;
}
const oldRender=window.MajickLearningLab?.render;
if(typeof oldRender==='function'){
 window.MajickLearningLab.render=function(){
   let h=oldRender();
   if(active()){
     h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-d755-tab="d755retake">Retake Studio</button>');
     h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="d755retake" hidden><div id="d755RetakeRoot"></div></section>');
   }
   return h;
 };
}
const oldBind=window.MajickLearningLab?.bind;
if(typeof oldBind==='function'){
 window.MajickLearningLab.bind=function(){
   oldBind();
   if(!active())return;
   document.querySelector('[data-d755-tab="d755retake"]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show()});
   setTimeout(show,120);
 };
}
ensureBank();
window.MajickD755Retake={VERSION,COURSE,SECTIONS,TRAPS,BANK,ensureBank,show,render,shell,state:prog,current,startExam,examSubmit,examNext,assessmentFamily,retakeEvidenceSnapshot,assessmentEvidence,assessmentMasteryRows,assessmentNextPractice,assessmentMistakeIds,assessmentMistakeSummary,updateAssessmentMistake,startAssessmentMistakeRepair,smartReviewQuestions,startSmartReview,assessmentRecentIds,rememberAssessmentQuestion,freshAssessmentRows,startAssessmentFamilyPractice,contrastPairFor,contrastPairFamily,startContrastRepair,contrastRepairSelect,contrastRepairSubmit,contrastRepairNext,startDimensionDetective,detectiveChooseDimension,detectiveSubmitDimension,detectiveChooseAnswer,detectiveSubmitAnswer,detectiveNext,startSectionCheck,checkSubmit,checkNext,anchorsView,grimoireWall,teacherVisual};
document.documentElement.dataset.majickD755Retake=VERSION;
})();