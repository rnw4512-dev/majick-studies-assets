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

function q(id,section,concept,prompt,options,answer,why,trap,visual){
 return {id:'d755_wgu_'+id,course:COURSE,section,concept,prompt,options,answer,why,trap:trap||'',visual:visual||'',teacherFocus:true,style:'wgu-course-scenario',source:'d755-teacher-focus-2026-09-26'};
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
 q('tf_s3_18',3,'student journey','Which sequence best represents the overall student journey emphasized in the process materials?',['Concern → immediate IEP → universal screening → referral','Universal screening/concern → differentiation and data → IAT/intervention → progress monitoring/review → referral if needed → MDT evaluation/consent → eligibility → IEP','Referral → eligibility → intervention → Child Find','IEP → evaluation → pre-referral → universal screening'],'Universal screening/concern → differentiation and data → IAT/intervention → progress monitoring/review → referral if needed → MDT evaluation/consent → eligibility → IEP','The process moves from general-education identification and intervention through formal referral/evaluation only when needed, followed by eligibility and IEP development.','process-order','journey')
]

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
 st.responses[key(kind,concept)]={choice,correct,at:Date.now()};
 st.feedback={kind,correct,why:item.why,answer:item.answer};
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
 return '<section class="d755Home"><small>D755 • TEACHER-FOCUS RETAKE STUDIO</small><h1>Assessment for Special Education</h1><p>This retake course now follows your instructor’s OA review and Student Journey process: interpret data, identify the student’s stage, choose the next educational decision, and explain why. Vocabulary is tested inside decisions—not by itself.</p><div class="d755HomeStats"><div><b>'+done+' / '+total+'</b><span>concepts completed</span></div><div><b>'+Object.keys(st.anchors).length+'</b><span>anchor charts unlocked</span></div><div><b>'+(diag?diag.score+'/'+diag.total:'—')+'</b><span>diagnostic</span></div></div><div class="d755CourseCycle"><span>Collect evidence</span><i>→</i><span>Interpret patterns</span><i>→</i><span>Individualize</span><i>→</i><span>Intervene</span><i>→</i><span>Monitor</span><i>→</i><span>Communicate</span></div><div class="d755HomeActions"><button class="btn primary" data-d755-section="'+st.sectionId+'">Continue Learning</button><button class="btn ghost" data-d755-mode="diagnostic">Start / Retake Diagnostic</button><button class="btn ghost" data-d755-mode="mock">Mock OA</button></div><div class="d755SectionCards">'+SECTIONS.map(s=>'<button data-d755-section="'+s.id+'"><span>SECTION '+s.number+'</span><b>'+E(s.title)+'</b><small>'+E(s.bigIdea)+'</small></button>').join('')+'</div></section>';
}
function sampleQuestions(count,mode){
 const per=mode==='diagnostic'?[10,10,10]:[14,13,13];
 let out=[];
 for(let i=0;i<3;i++)out.push(...shuffle(sectionQuestions(i+1)).slice(0,per[i]));
 return shuffle(out).slice(0,count);
}
function startExam(mode){
 const st=prog(),count=mode==='diagnostic'?30:40,qs=sampleQuestions(count,mode);
 st[mode]={index:0,selected:null,submitted:false,answers:[],ids:qs.map(q=>q.id),startedAt:Date.now()};
 st.mode=mode;save();render();
}
function examObj(mode){const st=prog();return st[mode]}
function examQuestions(obj){const by=new Map(BANK.map(q=>[q.id,q]));return (obj?.ids||[]).map(id=>by.get(id)).filter(Boolean)}
function examSelect(mode,v){const o=examObj(mode);if(!o||o.submitted)return;o.selected=v;render()}
function examSubmit(mode){const st=prog(),o=st[mode],qs=examQuestions(o),item=qs[o.index];if(!o||!item||!o.selected)return;o.submitted=true;o.answers.push({id:item.id,section:item.section,concept:item.concept,trap:item.trap,chosen:o.selected,correct:o.selected===item.answer});save();render()}
function examNext(mode){
 const st=prog(),o=st[mode],qs=examQuestions(o);if(!o)return;
 if(o.index<qs.length-1){o.index++;o.selected=null;o.submitted=false;save();render();return}
 const score=o.answers.filter(x=>x.correct).length,total=qs.length;
 const bySection=[1,2,3].map(n=>{const rows=o.answers.filter(x=>x.section===n);return {section:n,correct:rows.filter(x=>x.correct).length,total:rows.length,pct:rows.length?Math.round(rows.filter(x=>x.correct).length/rows.length*100):0}});
 const trapCounts={};for(const a of o.answers.filter(x=>!x.correct&&x.trap))trapCounts[x.trap]=(trapCounts[x.trap]||0)+1;
 const result={score,total,pct:total?Math.round(score/total*100):0,bySection,trapCounts,at:Date.now(),status:score/total>=.85?'Ready for final review':score/total>=.7?'Targeted repair needed':'Needs another teaching pass'};
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
function examView(mode){
 const st=prog(),o=st[mode];if(!o)return '<section class="d755ExamIntro"><small>'+E(mode.toUpperCase())+'</small><h1>'+(mode==='diagnostic'?'30-Question Retake Diagnostic':'40-Question Mock OA')+'</h1><p>'+(mode==='diagnostic'?'Find the concepts that actually need reteaching before you spend time reviewing everything again.':'Mixed, unlabeled scenarios across all three sections. No tutor prompts during the simulation.')+'</p><button class="btn primary" data-d755-start-exam="'+mode+'">Start '+(mode==='diagnostic'?'Diagnostic':'Mock OA')+'</button></section>';
 const qs=examQuestions(o),item=qs[o.index];if(!item)return '<div class="d755Empty">Question set unavailable.</div>';
 return '<section class="d755Exam"><header><div><small>'+E(mode==='diagnostic'?'RETAKE DIAGNOSTIC':'MOCK OA')+'</small><h2>Assessment for Special Education</h2></div><span>'+(o.index+1)+' / '+qs.length+'</span></header><article><h3>'+E(item.prompt)+'</h3>'+teacherVisual(item)+'<div class="d755Choices">'+item.options.map((x,i)=>'<button '+(o.submitted?'disabled':'')+' class="'+(o.submitted?(x===item.answer?'correct':x===o.selected?'wrong':''):o.selected===x?'selected':'')+'" data-d755-exam-choice="'+E(mode)+'" data-choice="'+E(x)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(x)+'</span></button>').join('')+'</div>'+(o.submitted&&mode==='diagnostic'?'<div class="d755Feedback '+(o.selected===item.answer?'correct':'repair')+'"><b>'+(o.selected===item.answer?'✓ Correct':'Repair this decision')+'</b><p>'+E(item.why)+'</p></div>':'')+'<footer>'+(!o.submitted?'<button class="btn primary" '+(o.selected?'':'disabled')+' data-d755-exam-submit="'+mode+'">Submit</button>':'<button class="btn primary" data-d755-exam-next="'+mode+'">'+(o.index<qs.length-1?'Next →':'See results →')+'</button>')+'</footer></article></section>';
}
function resultView(mode){
 const st=prog(),r=st[mode+'Result'];if(!r)return examView(mode);
 const traps=Object.entries(r.trapCounts||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
 return '<section class="d755Result"><small>'+E(mode==='diagnostic'?'DIAGNOSTIC RESULTS':'MOCK OA RESULTS')+'</small><h1>'+E(r.status)+'</h1><div class="score">'+r.score+' / '+r.total+'<span>'+r.pct+'%</span></div><div class="sectionResults">'+r.bySection.map(x=>'<div><b>Section '+x.section+'</b><span>'+x.correct+'/'+x.total+' • '+x.pct+'%</span><i><em style="width:'+x.pct+'%"></em></i></div>').join('')+'</div>'+(traps.length?'<div class="d755Weak"><h3>Highest-priority decision traps</h3>'+traps.map(([id,n])=>'<article><b>'+E(REPAIRS[id]?.title||id)+'</b><span>'+n+' miss'+(n===1?'':'es')+'</span><p>'+E(REPAIRS[id]?.right||'Review the related concept.')+'</p></article>').join('')+'</div>':'')+'<div class="resultActions"><button class="btn primary" data-d755-repair-result="'+mode+'">Study my weakest area</button><button class="btn ghost" data-d755-start-exam="'+mode+'">Retake with new mix</button><button class="btn ghost" data-d755-home>Retake Studio Home</button></div><p class="evidenceNote">This is practice evidence for your retake preparation, not a prediction of your WGU OA result.</p></section>';
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
function checkSubmit(){const st=prog(),o=st.sectionCheck,qs=examQuestions(o),item=qs[o.index];if(!o||!item||!o.selected)return;o.submitted=true;o.answers.push({id:item.id,section:item.section,concept:item.concept,trap:item.trap,chosen:o.selected,correct:o.selected===item.answer});save();render()}
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
 let center=st.mode==='home'?home():st.mode==='diagnostic'?examView('diagnostic'):st.mode==='diagnosticResult'?resultView('diagnostic'):st.mode==='mock'?examView('mock'):st.mode==='mockResult'?resultView('mock'):st.mode==='traps'?trapsView():st.mode==='anchors'?anchorsView():learnView();
 const quiet=['home','diagnostic','diagnosticResult','mock','mockResult','traps','anchors','sectionOpening','sectionCheck','sectionResult'].includes(st.mode);
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
 root.querySelectorAll('[data-d755-mode]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.d755Mode;if(m==='diagnostic'||m==='mock'){const st=prog();st[m]=null;st.mode=m}else st.mode=m;save();render()}));
 root.querySelector('[data-d755-begin]')?.addEventListener('click',beginSection);
 root.querySelectorAll('[data-d755-phase]').forEach(b=>b.addEventListener('click',()=>setPhase(Number(b.dataset.d755Phase))));
 root.querySelectorAll('[data-d755-answer]').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.d755Answer,b.dataset.choice)));
 root.querySelector('[data-d755-explain]')?.addEventListener('click',explainTyped);
 root.querySelector('[data-d755-aloud]')?.addEventListener('click',()=>explainChoice('Explained aloud'));
 root.querySelectorAll('[data-d755-tutor]').forEach(b=>b.addEventListener('click',()=>tutor(b.dataset.d755Tutor)));
 root.querySelector('[data-d755-complete]')?.addEventListener('click',completeConcept);
 root.querySelectorAll('[data-d755-start-exam]').forEach(b=>b.addEventListener('click',()=>startExam(b.dataset.d755StartExam)));
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
window.MajickD755Retake={VERSION,COURSE,SECTIONS,TRAPS,BANK,ensureBank,show,render,shell,state:prog,current,startExam,examSubmit,examNext,startSectionCheck,checkSubmit,checkNext,anchorsView,grimoireWall,teacherVisual};
document.documentElement.dataset.majickD755Retake=VERSION;
})();