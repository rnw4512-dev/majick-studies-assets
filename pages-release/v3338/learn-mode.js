(()=>{
'use strict';

const VERSION='3.3.38';
const COURSE='D772';
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const PHASES=['Teach','Visual','Worked Example','Your Turn','New Scenario','Explain Why','Complete'];

const LESSONS=[
{
 id:'d772-s1-l1',number:1,title:'Understanding Data Collection Methods',
 goal:'By the end of this lesson, you should be able to identify a study design, distinguish sampling methods, separate population/sample/parameter/statistic, and tell random sampling from randomization.',
 mental:'WHO are we studying? → HOW were they selected? → WHAT kind of study was done? → HOW strong is the experimental design?',
 skills:['Identify population, sample, parameter, statistic, individuals, variables, and data.','Distinguish simple random, stratified, cluster, and systematic sampling.','Classify observational studies, sample surveys, and experiments.','Recognize randomization, replication, control, placebo, and blinding.'],
 concepts:[
  {
   id:'l1-foundations',title:'Population → Sample → Parameter → Statistic',
   terms:['Population','Sample','Parameter','Statistic','Individuals','Variables','Data','Quantitative variables','Categorical variables'],
   teach:'Start with the group. The population is the entire group you want to study; the sample is the smaller group actually studied. A parameter is a number describing the population. A statistic is a number describing the sample. Individuals are the people or objects described by the data; variables are what researchers measure about them; data are the recorded values.',
   different:['Think of a school photo. The population is everyone who could be in the photo; the sample is the smaller group actually photographed. A number about everyone is a parameter; a number calculated from the photographed group is a statistic.','Ask three questions in order: WHO is the full group? WHO actually gave data? Is the number describing ALL or SOME?','Do not memorize four isolated words. Build the chain: population → take a sample → calculate a statistic → use it to learn about the population.'],
   examples:['A district has 5,000 teachers and surveys 400. Population = 5,000 teachers; sample = 400 surveyed teachers.','Student ID 10023 contains digits but is categorical because arithmetic on the ID has no meaningful interpretation.'],
   visual:'foundation',
   worked:{scenario:'A university wants to know the average commute time of all 20,000 students. It surveys 600 students, whose average commute is 28 minutes.',steps:['All 20,000 students are the population.','The 600 surveyed students are the sample.','28 minutes describes the sample, so it is a statistic.']},
   check:{prompt:'A district has 4,200 teachers. A random sample of 350 teachers reports an average of 6.8 planning hours. What is 6.8 hours?',options:['Population','Parameter','Statistic','Variable'],answer:'Statistic',why:'The 6.8 hours were calculated from the 350-person sample. A numerical value describing a sample is a statistic.',repair:'parameter-statistic'},
   transfer:{prompt:'All 4,200 teachers average 6.5 planning hours. What is 6.5 hours?',options:['Parameter','Statistic','Sample','Data value'],answer:'Parameter',why:'This number describes the entire population, so it is a parameter.'},
   explain:{prompt:'Explain why a statistic and a parameter are not interchangeable.',model:'A statistic describes a sample. A parameter describes a population. The clue is whether the number summarizes SOME of the group or ALL of the group.',choices:['A statistic describes a sample; a parameter describes a population.','A statistic is always larger than a parameter.','A parameter is only used in experiments.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Population vs. Sample',lines:['POPULATION = ALL','SAMPLE = SOME','PARAMETER → POPULATION','STATISTIC → SAMPLE'],trap:'WGU TRAP: a number can look important, but first ask whether it describes the full population or the sample.'},
   compare:{left:['Population','Entire group of interest'],right:['Sample','Smaller group actually studied']},
   wguAsk:'WGU may give you a full group, a surveyed subgroup, and one numerical average. Identify whether that average describes the population or the sample.'
  },
  {
   id:'l1-sampling',title:'Random Sampling Methods',
   terms:['Simple random sample','Stratified sampling','Cluster sampling','Systematic sampling'],
   teach:'Random sampling uses chance to select individuals. Simple random sampling chooses entirely by chance. Stratified sampling takes some individuals from every subgroup. Cluster sampling randomly selects some natural groups and includes everyone in those selected groups. Systematic sampling uses a random start and then selects every nth individual.',
   different:['Picture four houses. Stratified means take a few people from every house. Cluster means choose a few whole houses and take everyone inside.','The fastest distinction is quantity from groups: STRATIFIED = SOME FROM ALL. CLUSTER = ALL FROM SOME.','If you see “every 15th” after a random start, think systematic. If the whole selection is done by chance with no grouping rule, think simple random.'],
   examples:['Randomly select 40 teachers from each school level → stratified sampling.','Randomly select five schools and survey every teacher in those schools → cluster sampling.','Choose a random start and then every 15th name → systematic sampling.'],
   visual:'sampling',
   worked:{scenario:'A district separates teachers into elementary, middle, and high school groups, then randomly selects 40 teachers from each group.',steps:['The population is divided into strata.','Some teachers are selected from every stratum.','Therefore the method is stratified sampling.']},
   check:{prompt:'A district randomly chooses three schools and surveys every teacher in those schools. Which sampling method is used?',options:['Stratified sampling','Cluster sampling','Systematic sampling','Simple random sample'],answer:'Cluster sampling',why:'The district selected some whole groups and included everyone in each selected group: ALL FROM SOME.',repair:'stratified-cluster'},
   transfer:{prompt:'A district randomly selects 25 teachers from every school. Which method is used?',options:['Cluster sampling','Stratified sampling','Systematic sampling','Convenience sample'],answer:'Stratified sampling',why:'Some individuals are selected from every group: SOME FROM ALL.'},
   explain:{prompt:'Why is choosing three whole schools cluster sampling rather than stratified sampling?',model:'Cluster sampling includes everyone from some selected groups. Stratified sampling selects some individuals from every group.',choices:['Cluster = all from some; stratified = some from all.','Cluster always uses every school.','Stratified means choosing the easiest groups.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Stratified vs. Cluster',lines:['STRATIFIED = SOME FROM ALL','CLUSTER = ALL FROM SOME','SYSTEMATIC = RANDOM START + EVERY nth','SIMPLE RANDOM = CHANCE-BASED SELECTION'],trap:'WGU TRAP: both stratified and cluster use groups. The difference is whether you take SOME FROM ALL groups or ALL FROM SOME groups.'},
   compare:{left:['Stratified','Some people from every subgroup'],right:['Cluster','Everyone from selected groups']},
   wguAsk:'WGU commonly describes schools, grade levels, or departments and asks you to distinguish stratified from cluster sampling.'
  },
  {
   id:'l1-studytypes',title:'Observational Study → Sample Survey → Experiment',
   terms:['Observational study','Sample survey','Experiment','Explanatory variable','Response variable'],
   teach:'An observational study measures variables as they naturally occur. A sample survey is an observational study in which people self-report information. An experiment intentionally imposes a treatment and observes the response. The explanatory variable may explain or predict the outcome; the response variable is the outcome being measured.',
   different:['Ask one question first: DID THE RESEARCHER CHANGE SOMETHING? If yes, experiment. If no, observational. If people simply answer questions, sample survey.','Observe = watch what already exists. Survey = ask. Experiment = change something.','Explanatory variable is the possible predictor or cause. Response variable is what responds or is measured as the outcome.'],
   examples:['Record caffeine intake and exam scores without assigning caffeine → observational study.','Ask adults about exercise and screen use → sample survey.','Randomly assign medication or placebo → experiment.'],
   visual:'studytypes',
   worked:{scenario:'Researchers record participants’ usual sleep hours and blood pressure without changing anyone’s sleep.',steps:['No treatment is assigned.','Researchers measure naturally occurring values.','This is an observational study.']},
   check:{prompt:'Researchers randomly assign participants to a medication or placebo and compare outcomes. What type of study is this?',options:['Observational study','Sample survey','Experiment','Systematic sample'],answer:'Experiment',why:'The researchers deliberately impose different treatments, so this is an experiment.',repair:'observe-experiment'},
   transfer:{prompt:'A researcher asks participants a series of questions about exercise habits and screen use. What type of study is this?',options:['Experiment','Sample survey','Cluster sample','Double-blind study'],answer:'Sample survey',why:'Participants are self-reporting information by answering questions.'},
   explain:{prompt:'Explain the clue that separates an observational study from an experiment.',model:'An experiment deliberately imposes a treatment or condition. An observational study records variables as they naturally occur without assigning treatment.',choices:['Experiment = treatment imposed; observational = no treatment imposed.','Observational studies always use surveys.','Experiments never compare groups.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Study Type',lines:['RESEARCHER WATCHES/MEASURES → OBSERVATIONAL','RESEARCHER ASKS → SAMPLE SURVEY','RESEARCHER CHANGES SOMETHING → EXPERIMENT'],trap:'WGU TRAP: “randomly selected” does not automatically mean experiment. Look for a treatment being assigned.'},
   compare:{left:['Observational','No treatment assigned'],right:['Experiment','Treatment intentionally imposed']},
   wguAsk:'WGU usually describes what researchers did. Your job is to decide whether they watched, asked, or imposed a treatment.'
  },
  {
   id:'l1-design',title:'Strong Experimental Design',
   terms:['Treatment','Experimental unit','Randomization','Replication','Control group','Placebo','Placebo effect','Single-blind','Double-blind'],
   teach:'Randomization assigns experimental units to groups by chance. Replication uses enough observations or repeated studies. A control group provides a comparison baseline. A placebo is inactive; the placebo effect is a response caused by expectation. Single-blind means participants do not know treatment assignment. Double-blind means participants and interacting researchers do not know.',
   different:['Random sampling and randomization happen at different moments. Sampling decides WHO enters the study. Randomization decides WHERE participants go after they enter.','Think of a fair test: comparable groups, enough observations, a baseline for comparison, and as little expectation influence as possible.','Placebo = the inactive treatment. Placebo effect = the change caused by expectation. They are not the same thing.'],
   examples:['Random sampling chooses people from the population; randomization places study participants into treatment groups.','Neither participants nor interacting researchers know treatment assignments → double-blind.'],
   visual:'design',
   worked:{scenario:'A researcher selects a random sample of adults and then randomly places those adults into treatment and control groups.',steps:['Random sampling determined WHO entered the study.','Randomization determined WHERE selected participants were placed.','The two random processes have different jobs.']},
   check:{prompt:'Which statement correctly distinguishes random sampling from randomization?',options:['Random sampling decides who enters; randomization decides which group they enter.','Randomization decides who enters; random sampling decides treatment.','They are two names for the same process.','Random sampling is used only after treatment.'],answer:'Random sampling decides who enters; randomization decides which group they enter.',why:'WGU separates selection from group placement: RANDOM SAMPLING = WHO? RANDOMIZATION = WHERE?',repair:'sampling-randomization'},
   transfer:{prompt:'Participants do not know whether they receive medication or placebo, but interacting researchers do know. What design feature is this?',options:['Double-blind','Single-blind','Replication','Control'],answer:'Single-blind',why:'Only the participants are unaware of treatment assignment.'},
   explain:{prompt:'Why can random sampling and randomization both appear in the same experiment?',model:'They solve different problems. Random sampling helps choose who enters the study; randomization places participants into experimental groups by chance.',choices:['They occur at different stages and solve different problems.','They both mean selecting every nth person.','Randomization replaces the need for a sample.'],correct:0},
   anchor:{title:'WGU TRAP • Random Sampling ≠ Randomization',lines:['RANDOM SAMPLING = WHO enters','RANDOMIZATION = WHERE participants are placed','CONTROL = comparison baseline','REPLICATION = enough observations / repeated evidence'],trap:'Do not let the word “random” make these processes look interchangeable.'},
   compare:{left:['Random sampling','Who enters the sample'],right:['Randomization','Which treatment group they enter']},
   wguAsk:'WGU may include both random selection and random group assignment in one scenario. Identify which random process is doing which job.'
  }
 ]
},
{
 id:'d772-s1-l2',number:2,title:'Recognizing Bias in Data Collection',
 goal:'By the end of this lesson, you should be able to locate where bias entered data collection and distinguish selection problems from inaccurate-response problems.',
 mental:'Wrong people selected? → sampling bias. People chose themselves? → voluntary response. Selected people did not respond? → non-response. Answers inaccurate? → response bias.',
 skills:['Judge whether a sample is representative.','Distinguish sampling bias, convenience sampling, voluntary response, and sampling-frame error.','Separate non-response bias from response bias and perceived lack of anonymity.','Recognize loaded questions and self-interest studies.'],
 concepts:[
  {
   id:'l2-representative',title:'Representative vs. Non-Representative Samples',
   terms:['Representative sample','Non-representative sample','Sampling bias'],
   teach:'A representative sample accurately reflects the larger population. A non-representative sample fails to reflect it accurately. Sampling bias occurs when the selection method makes some population members systematically more likely to be included than others.',
   different:['Before trusting the result, ask whether the people in the sample look like the population the researcher wants to talk about.','Sampling bias begins before anyone answers: the wrong mix of people gets into the sample.','A large sample is not automatically representative. A huge biased sample is still biased.'],
   examples:['Surveying only students currently buying school lunch may overrepresent students who like school lunch.','Surveying people leaving a gym to represent all adults overrepresents regular exercisers.'],
   visual:'representative',
   worked:{scenario:'A city wants to estimate exercise habits of all adults but surveys only people leaving a gym.',steps:['The target population is all adults in the city.','Gym-goers are more likely to exercise than adults in general.','The selection method creates sampling bias.']},
   check:{prompt:'A school wants opinions from all students but surveys only students currently eating school lunch. What is the main concern?',options:['Sampling bias','Response bias','Non-response bias','Double-blinding'],answer:'Sampling bias',why:'The selection method overrepresents students who already use the lunch program.',repair:'sampling-response'},
   transfer:{prompt:'A researcher surveys 10,000 people from a group that strongly supports the issue being studied. What should you conclude?',options:['The large sample removes bias.','The sample can still be biased.','The study is automatically an experiment.','The result must be statistically insignificant.'],answer:'The sample can still be biased.',why:'A large sample reduces random variation, but it does not repair systematic selection bias.'},
   explain:{prompt:'Why can a very large sample still be non-representative?',model:'Sample size does not fix a biased selection process. If some groups are systematically overrepresented or missing, the sample can remain non-representative even when it is large.',choices:['Large size does not correct systematic selection bias.','Any sample over 1,000 is representative.','Bias only occurs when people answer inaccurately.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Sampling Bias',lines:['ASK: WHO HAD A FAIR CHANCE TO GET IN?','SAMPLING BIAS = WRONG / UNBALANCED PEOPLE','LARGE SAMPLE ≠ AUTOMATICALLY REPRESENTATIVE'],trap:'WGU TRAP: sample size and sample representativeness are different questions.'},
   compare:{left:['Sampling bias','Problem with who gets selected'],right:['Response bias','Problem with what selected people report']},
   wguAsk:'WGU often gives a target population and a sample source. Ask whether the sample reasonably reflects the population.'
  },
  {
   id:'l2-selection',title:'Volunteer, Convenience, and Sampling Frame',
   terms:['Volunteer sample','Voluntary response bias','Convenience sample','Sampling frame','Sampling frame error'],
   teach:'A volunteer sample lets individuals select themselves. Voluntary response bias can result because people with strong opinions are especially likely to participate. A convenience sample is chosen because people are easy for the researcher to reach. The sampling frame is the list from which a sample is drawn; sampling-frame error occurs when that list does not represent the whole target population.',
   different:['Volunteer = participants choose themselves. Convenience = researcher chooses whoever is easy to reach.','Sampling frame error means the list is incomplete before selection even begins. Random selection cannot fix a list that leaves part of the population out.','Voluntary response describes the distortion; volunteer sample describes the participation method.'],
   examples:['Optional online poll → voluntary response bias.','Professor surveys only students in her own class → convenience sample.','University directory lists only on-campus students → sampling-frame error.'],
   visual:'selection',
   worked:{scenario:'A university wants to study all students but samples from a housing directory containing only students who live on campus.',steps:['The sampling frame is the housing directory.','Commuter students are missing from the list.','The sampling frame does not represent the full target population, so this is sampling-frame error.']},
   check:{prompt:'A news site posts an optional poll and people with strong opinions are most likely to answer. Which problem is most likely?',options:['Voluntary response bias','Non-response bias','Convenience sample','Sampling frame error'],answer:'Voluntary response bias',why:'People choose themselves into the responding sample, and strong opinions can be overrepresented.',repair:'voluntary-nonresponse'},
   transfer:{prompt:'A researcher asks only people sitting in the nearest coffee shop because they are easy to reach. What type of sample is this?',options:['Volunteer sample','Convenience sample','Cluster sample','Systematic sample'],answer:'Convenience sample',why:'The researcher chose people because they were easy to access.'},
   explain:{prompt:'Explain the difference between a volunteer sample and a convenience sample.',model:'In a volunteer sample, participants choose themselves. In a convenience sample, the researcher chooses people who are easy to reach.',choices:['Volunteer = people choose themselves; convenience = researcher chooses easy-to-reach people.','Both mean selected people refused to respond.','Convenience sampling requires randomization.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Selection Traps',lines:['VOLUNTEER = PEOPLE CHOOSE THEMSELVES','CONVENIENCE = RESEARCHER CHOOSES EASY PEOPLE','SAMPLING FRAME ERROR = BAD / INCOMPLETE LIST'],trap:'WGU TRAP: random selection cannot repair an incomplete sampling frame.'},
   compare:{left:['Volunteer sample','People choose themselves'],right:['Convenience sample','Researcher chooses easy-to-reach people']},
   wguAsk:'WGU may ask where the problem occurred: self-selection, researcher convenience, or an incomplete list.'
  },
  {
   id:'l2-response',title:'Non-Response vs. Response Bias',
   terms:['Non-response bias','Response bias','Perceived lack of anonymity'],
   teach:'Non-response bias occurs when selected people who fail or refuse to respond are systematically different from those who do respond. Response bias occurs when people in the sample provide inaccurate answers because of pressure, misunderstanding, memory, embarrassment, interviewer effects, or fear. Perceived lack of anonymity is a specific response-bias problem caused by fear that answers can be traced back to the respondent.',
   different:['Non-response = no answer arrives. Response bias = an answer arrives, but it may be inaccurate.','Ask whether the person was selected first. If selected people disappear from the study, think non-response. If they answer but distort the truth, think response bias.','Fear of identification does not mean the person was never sampled; it changes what they are willing to say.'],
   examples:['Dissatisfied employees are less likely to return a survey → non-response bias.','Participants exaggerate exercise habits to look healthier → response bias.','Named employee survey about a supervisor → perceived lack of anonymity.'],
   visual:'response',
   worked:{scenario:'A random sample of employees is selected, but workers with the lowest job satisfaction are much less likely to return the survey.',steps:['The workers were already selected.','A systematic group fails to respond.','This is non-response bias.']},
   check:{prompt:'Participants exaggerate how often they exercise because they want to appear healthier. Which bias is present?',options:['Sampling bias','Response bias','Non-response bias','Voluntary response bias'],answer:'Response bias',why:'The people are in the sample and do answer, but their answers are inaccurate.',repair:'sampling-response'},
   transfer:{prompt:'Selected participants with the strongest negative experiences are much less likely to return a survey. Which bias is present?',options:['Voluntary response bias','Non-response bias','Response bias','Loaded question'],answer:'Non-response bias',why:'The people were selected but failed or refused to respond.'},
   explain:{prompt:'Why is non-response bias different from voluntary response bias?',model:'Non-response bias starts with people who were already selected and then fail to respond. Voluntary response bias occurs when people choose themselves into the responding sample.',choices:['Non-response = selected people do not respond; voluntary response = people choose themselves in.','They are the same bias with two names.','Voluntary response happens only in experiments.'],correct:0},
   anchor:{title:'WGU TRAP • Voluntary Response vs. Non-Response',lines:['VOLUNTARY RESPONSE = PEOPLE CHOOSE THEMSELVES IN','NON-RESPONSE = SELECTED PEOPLE STAY OUT','RESPONSE BIAS = ANSWER IS INACCURATE'],trap:'The key question is what happened before the response: self-selection, failure to respond, or inaccurate responding.'},
   compare:{left:['Non-response bias','Selected people fail/refuse to answer'],right:['Response bias','Selected people answer inaccurately']},
   wguAsk:'WGU often gives a scenario with people who were selected. Watch whether they fail to answer or answer inaccurately.'
  },
  {
   id:'l2-wording',title:'Loaded Questions, Anonymity, and Self-Interest',
   terms:['Loaded question','Perceived lack of anonymity','Self-interest study'],
   teach:'A loaded question uses wording that pushes respondents toward an answer. Perceived lack of anonymity can distort responses when people fear identification. A self-interest study creates a credibility concern when the researcher or sponsor has something to gain from a particular result. Self-interest is a reason for scrutiny, not automatic proof of fraud.',
   different:['Loaded question = the words are doing the pushing. Lack of anonymity = fear is doing the pushing. Self-interest = the sponsor has something to gain.','Ask WHO or WHAT is applying pressure: wording, identification, or the researcher’s stake in the outcome.','Conflict of interest raises concern; it does not by itself prove the data are false.'],
   examples:['“Don’t you agree our excellent program deserves more funding?” → loaded question.','Supervisor stands in the room during an employee survey → perceived lack of anonymity.','Supplement company funds a study of its own product → self-interest concern.'],
   visual:'wording',
   worked:{scenario:'A survey asks, “Don’t you agree that our excellent new program deserves more funding?”',steps:['The wording praises the program before asking for an opinion.','The question nudges respondents toward agreement.','This is a loaded question.']},
   check:{prompt:'A company that sells a weight-loss supplement conducts a study and concludes that its own product is highly effective. What concern is most likely?',options:['Self-interest study','Non-response bias','Loaded question','Sampling frame error'],answer:'Self-interest study',why:'The sponsor has a financial stake in a favorable outcome.',repair:'selfinterest-fraud'},
   transfer:{prompt:'Employees evaluate their supervisor while the supervisor is present in the room. What concern is most specific?',options:['Perceived lack of anonymity','Sampling bias','Self-interest study','Non-response bias'],answer:'Perceived lack of anonymity',why:'Fear that the response can be linked to the employee can distort what the employee reports.'},
   explain:{prompt:'Why does a self-interest study raise concern without automatically proving fraud?',model:'A personal or financial stake can create incentives that affect design or reporting, so the study deserves closer scrutiny. But the conflict alone does not prove the data were fabricated or falsified.',choices:['It creates a credibility concern but is not automatic proof of false data.','Any funded study is automatically fraudulent.','Self-interest only matters when nobody responds.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Where Is the Pressure?',lines:['WORDING PUSHES → LOADED QUESTION','FEAR OF IDENTIFICATION → PERCEIVED LACK OF ANONYMITY','RESEARCHER BENEFITS → SELF-INTEREST CONCERN'],trap:'WGU TRAP: self-interest is a reason for scrutiny, not automatic proof of fraud.'},
   compare:{left:['Loaded question','Wording influences response'],right:['Perceived lack of anonymity','Fear influences response']},
   wguAsk:'WGU may ask for the most specific bias term. Prefer the specific cause when the scenario clearly gives it.'
  }
 ]
},
{
 id:'d772-s1-l3',number:3,title:'Unveiling Data Misrepresentations',
 goal:'By the end of this lesson, you should be able to evaluate whether a graph, sample-size claim, significance statement, or reporting practice creates a misleading impression.',
 mental:'Is the visual fair? → Is the sample large enough? → Is significance interpreted correctly? → Were data honestly reported?',
 skills:['Identify truncated axes and misleading icon/3-D displays.','Explain why small samples have more random variation and why large samples do not fix bias.','Separate statistical significance from practical importance.','Distinguish misleading presentation from fabrication and falsification.'],
 concepts:[
  {
   id:'l3-graphs',title:'Misleading Graphical Displays',
   terms:['Truncated axis','Misrepresenting data','2-D icon scaling','3-D display'],
   teach:'Graphs can create a false impression even when the printed numbers are real. In bar charts, a truncated vertical axis can magnify a modest difference. Enlarging pictures in both height and width exaggerates area. Three-dimensional perspective can make equal slices appear unequal.',
   different:['Read the numbers before believing the picture. If the picture looks dramatic, inspect the scale, baseline, labels, and dimensions.','Bar charts communicate magnitude through length, so a nonzero baseline can make small differences look huge.','If an icon is doubled in height and width, the area grows much more than two times. Your eye sees area, not just the printed number.'],
   examples:['94% vs. 96% can look enormous if a bar chart starts near 92%.','A person icon doubled in height and width visually grows in area far more than the data value doubled.'],
   visual:'graphs',
   worked:{scenario:'A bar chart compares 94% and 96%, but its y-axis begins at 92%.',steps:['The numerical difference is only 2 percentage points.','The shortened baseline makes the bar-length difference look much larger.','The display can misrepresent the magnitude of the difference.']},
   check:{prompt:'A bar graph makes 94% and 96% look dramatically different because the vertical axis starts at 92%. What is the main problem?',options:['Truncated axis','Sampling-frame error','Non-response bias','Replication'],answer:'Truncated axis',why:'The scale begins close to the data values, magnifying the visual difference.',repair:'graph-scale'},
   transfer:{prompt:'An infographic represents twice as many customers by making an icon twice as tall and twice as wide. Why is this misleading?',options:['The icon area grows much more than twice.','The sample becomes biased.','The result becomes causal.','The data become categorical.'],answer:'The icon area grows much more than twice.',why:'Scaling both dimensions exaggerates the visual area relative to the data.'},
   explain:{prompt:'Why can a technically correct graph still be misleading?',model:'A graph can print accurate values but use scale, baseline, area, or perspective in a way that creates a distorted visual impression.',choices:['Accurate numbers can still be presented with a distorted visual scale.','Any nonzero number makes a graph false.','Graphs are misleading only when data are fabricated.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Graph Red Flags',lines:['READ THE AXIS BEFORE THE BARS','TRUNCATED BASELINE CAN MAGNIFY DIFFERENCES','PICTURES CAN EXAGGERATE AREA','3-D PERSPECTIVE CAN DISTORT SIZE'],trap:'WGU TRAP: “the numbers are present” does not automatically mean the display is fair.'},
   compare:{left:['Misrepresentation','Real data presented misleadingly'],right:['Falsification','Research record deliberately altered/manipulated']},
   wguAsk:'WGU may show a modest numerical difference with a dramatic-looking graph. Inspect the y-axis before judging the magnitude.'
  },
  {
   id:'l3-size',title:'Sample Size and Random Variation',
   terms:['Sample size','Random variation','Representative sample'],
   teach:'Small samples are more vulnerable to random fluctuations and can produce extreme-looking results by chance. Larger samples generally give more stable estimates when the sampling method is sound. But increasing sample size does not repair systematic bias.',
   different:['Small sample = more random bounce. Large sample = less random bounce. Bias is a different problem.','Imagine scooping a few candies from a huge mixed bag. A tiny scoop can look unusually one-colored just by chance; a larger scoop tends to stabilize.','Do not let “50,000 responses” distract you from a biased recruitment method.'],
   examples:['A study of six people makes a sweeping population claim → sample size is an obvious weakness.','50,000 respondents from one strongly partisan group can still be biased.'],
   visual:'samplesize',
   worked:{scenario:'A study of six participants gets the same result for all six and claims the treatment works for everyone.',steps:['Six observations are highly vulnerable to random variation.','The claim is far broader than the evidence supports.','A substantially larger sample would make the estimate more stable.']},
   check:{prompt:'A study of six people makes a broad claim about an entire population. What improvement is most obvious?',options:['Increase the sample size.','Use a 3-D graph.','Remove the control group.','Use fewer participants.'],answer:'Increase the sample size.',why:'A larger sample reduces the influence of random fluctuation when the main problem is an extremely small sample.',repair:'sample-size'},
   transfer:{prompt:'A survey has 50,000 responses, but every respondent came from a group that strongly favors the issue. Which statement is best?',options:['The huge sample guarantees accuracy.','The sample can still be biased.','Large samples eliminate sampling bias.','The result must be insignificant.'],answer:'The sample can still be biased.',why:'Large sample size does not repair systematic selection bias.'},
   explain:{prompt:'Why does a larger sample reduce random variation without automatically fixing bias?',model:'A larger sample gives chance less influence on the estimate, but bias comes from a systematic problem in who was selected or how data were collected. More biased observations remain biased.',choices:['Larger samples reduce random fluctuation, but systematic bias can remain.','A large sample automatically becomes representative.','Bias and random variation mean the same thing.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Size ≠ Fairness',lines:['SMALL SAMPLE = MORE RANDOM BOUNCE','LARGER SAMPLE = MORE STABLE ESTIMATE','LARGE SAMPLE DOES NOT CURE BIAS'],trap:'WGU TRAP: sample size addresses random variation; representativeness addresses bias.'},
   compare:{left:['Small sample','More random fluctuation'],right:['Biased sample','Systematic distortion regardless of size']},
   wguAsk:'WGU may give a huge sample with a biased recruitment method. Do not let sample size distract you from selection quality.'
  },
  {
   id:'l3-significance',title:'Statistical vs. Practical Significance',
   terms:['Statistical significance','Practical significance'],
   teach:'In D772, statistical significance means an observed result is unlikely to have occurred by random chance under the statistical method used. It does not mean the effect is large, important, unbiased, ethical, or certain. Practical significance asks whether the effect is large or meaningful enough to matter in practice.',
   different:['Two separate questions: Could chance reasonably explain this result? That is statistical significance. Is the effect big enough to matter? That is practical significance.','A tiny effect can be statistically significant in a very large study. Significant does not mean dramatic.','Treat “statistically significant” as a statement about chance, not a synonym for important.'],
   examples:['A 0.2-point score increase can be statistically significant in a huge sample but educationally trivial.','A statistically significant result can still come from a biased study design.'],
   visual:'significance',
   worked:{scenario:'A very large study finds a statistically significant 0.2-point increase on a 100-point exam.',steps:['The result may be unlikely to be due to chance.','The observed effect is only 0.2 points.','Statistical significance alone does not show practical importance.']},
   check:{prompt:'A result is statistically significant. What does that mean in this course?',options:['It is unlikely to be explained by random chance alone.','The effect must be large.','The study must be unbiased.','The hypothesis is proven with certainty.'],answer:'It is unlikely to be explained by random chance alone.',why:'Statistical significance concerns chance, not effect size, importance, bias, or certainty.',repair:'statistical-practical'},
   transfer:{prompt:'A huge study finds a statistically significant 0.2-point improvement. What additional question should you ask?',options:['Is the effect practically meaningful?','Was every participant in the population?','Did the graph use 3-D perspective?','Is the variable categorical?'],answer:'Is the effect practically meaningful?',why:'Practical significance asks whether the effect is large enough to matter in the real world.'},
   explain:{prompt:'Explain why “statistically significant” does not mean “important.”',model:'Statistical significance addresses whether chance is a plausible explanation under the method used. Practical importance depends on the size and real-world meaning of the effect.',choices:['Statistical significance concerns chance; practical significance concerns meaningful effect size.','Statistical significance always means a large effect.','Practical significance means the sample was random.'],correct:0},
   anchor:{title:'WGU TRAP • Significant ≠ Important',lines:['STATISTICAL SIGNIFICANCE → UNLIKELY DUE TO CHANCE','PRACTICAL SIGNIFICANCE → LARGE / MEANINGFUL ENOUGH TO MATTER'],trap:'Do not translate “statistically significant” into “large,” “important,” “unbiased,” or “certain.”'},
   compare:{left:['Statistical significance','Chance explanation'],right:['Practical significance','Real-world importance']},
   wguAsk:'WGU may give a tiny effect from a huge sample. Decide whether statistical significance is being confused with practical importance.'
  },
  {
   id:'l3-integrity',title:'Misrepresentation, Fabrication, and Falsification',
   terms:['Misrepresenting data','Fabricating data sets','Falsifying data','Duplicating data','Intentional omission'],
   teach:'Misrepresentation presents information in a way likely to cause an incorrect conclusion. Fabrication invents data that were never collected. Falsification deliberately changes, omits, duplicates, or otherwise manipulates the research record. Transparent, pre-established exclusion rules are different from removing valid data only because the results are inconvenient.',
   different:['Misrepresentation can leave the underlying numbers intact but tell a misleading story. Fabrication makes data up. Falsification changes the research record.','Ask whether the problem is presentation or the data record itself.','“I do not like this result” is never a valid reason to secretly remove a trial.'],
   examples:['Inventing 50 participants → fabrication.','Changing collected scores to fit a preferred hypothesis → falsification.','Removing a valid unfavorable trial because it weakens the conclusion → intentional omission/falsification.'],
   visual:'integrity',
   worked:{scenario:'A researcher creates 50 survey responses for people who never existed.',steps:['The observations were never collected.','The researcher invented the data.','This is fabrication of a data set.']},
   check:{prompt:'A researcher changes several collected scores because the original values contradict the preferred hypothesis. What occurred?',options:['Falsifying data','Sampling-frame error','Replication','Practical significance'],answer:'Falsifying data',why:'The observations existed, but the researcher deliberately changed the research record.',repair:'fabrication-falsification'},
   transfer:{prompt:'A researcher removes a valid trial only because it weakens the preferred conclusion. What is this?',options:['Intentional omission / falsification','Legitimate exclusion','Random variation','Stratified sampling'],answer:'Intentional omission / falsification',why:'Valid data were removed because they were inconvenient, not because of a transparent methodological rule.'},
   explain:{prompt:'Explain the difference between misleading presentation and falsifying the research record.',model:'Misrepresentation can present real data in a misleading way. Falsification deliberately changes, omits, duplicates, or manipulates the research record itself.',choices:['Misrepresentation concerns presentation; falsification manipulates the research record.','They are always identical.','Falsification means the sample was small.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Research Integrity',lines:['MISREPRESENTATION = MISLEADING PRESENTATION','FABRICATION = MAKE DATA UP','FALSIFICATION = CHANGE / OMIT / DUPLICATE / MANIPULATE'],trap:'WGU TRAP: distinguish a misleading display from deliberate manipulation of the research record.'},
   compare:{left:['Misrepresentation','Presentation can mislead'],right:['Falsification','Research record intentionally manipulated']},
   wguAsk:'WGU may describe invented participants, altered values, omitted trials, or duplicated observations. Decide what happened to the research record.'
  }
 ]
},
{
 id:'d772-s1-l4',number:4,title:'Conclusions About Data Findings',
 goal:'By the end of this lesson, you should be able to decide what conclusions the study design supports and interpret scatterplots using shape, trend, strength, and outliers.',
 mental:'What was the study design? → Association or causal evidence? → Could a confounder explain it? → What does the scatterplot actually show?',
 skills:['Distinguish association from a causal relationship.','Explain why observational studies do not establish causation by themselves.','Identify confounding variables.','Describe scatterplots by shape, trend, strength, and outliers.'],
 concepts:[
  {
   id:'l4-association',title:'Association vs. Causal Relationship',
   terms:['Association','Causal relationship','Observational study','Experiment'],
   teach:'Association means two variables are related. A causal relationship means a change in one variable directly produces an effect in the other. Observational studies can support association, but they cannot establish causation by themselves. A well-designed experiment may support a causal conclusion when alternative explanations are controlled.',
   different:['Observe = association. Experiment = causation may be justified.','A relationship tells you WHAT moves together. Causation tells you WHY one changed because of the other. Those are not the same claim.','Before accepting a causal statement, look backward at the study design—not forward at how strong the relationship looks.'],
   examples:['More sleep is associated with lower blood pressure in an observational study → association only.','Randomly assigned treatment and control groups with other conditions held similar → causal conclusion may be supported.'],
   visual:'causation',
   worked:{scenario:'Researchers record sleep hours and blood pressure but do not change anyone’s sleep.',steps:['No treatment is imposed, so the study is observational.','A relationship between sleep and blood pressure may be observed.','The observational study alone cannot establish that sleep caused the blood-pressure difference.']},
   check:{prompt:'An observational study finds that adults who sleep more tend to have lower blood pressure. Which conclusion is most appropriate?',options:['There is an association, but causation is not established.','More sleep definitely causes lower blood pressure.','There is no relationship.','The study is a randomized experiment.'],answer:'There is an association, but causation is not established.',why:'Observational studies can support association but cannot establish a causal relationship by themselves.',repair:'association-causation'},
   transfer:{prompt:'Plants are randomly assigned to receive coffee grounds or no coffee grounds while water and sunlight are kept similar. The treatment group grows more. Which conclusion may be supported?',options:['A causal conclusion may be supported.','Only an association may be supported.','There is no relationship.','The treatment is a confounding variable.'],answer:'A causal conclusion may be supported.',why:'A treatment was imposed, groups were randomly assigned, and important alternative conditions were controlled.'},
   explain:{prompt:'Why does the study design matter more than the strength of a relationship when deciding causation?',model:'A strong relationship can still be caused by confounding, reverse direction, or coincidence. Causal evidence depends on how the study was designed, especially manipulation, comparison/control, and random assignment.',choices:['Causation depends on study design, not merely a strong pattern.','Any strong relationship proves causation.','Observational studies always prove cause if the sample is large.'],correct:0},
   anchor:{title:'WGU TRAP • Association ≠ Causation',lines:['OBSERVATIONAL STUDY → ASSOCIATION MAY BE SUPPORTED','WELL-DESIGNED EXPERIMENT → CAUSATION MAY BE SUPPORTED','STRONG RELATIONSHIP ≠ PROOF OF CAUSE'],trap:'Always return to the study design before accepting a causal claim.'},
   compare:{left:['Association','Variables are related'],right:['Causal relationship','One variable produces an effect in the other']},
   wguAsk:'WGU frequently gives an observational relationship and asks what conclusion is justified. Association is usually the ceiling unless the design is experimental.'
  },
  {
   id:'l4-confounders',title:'Confounding Variables',
   terms:['Confounding variable','Explanatory variable','Response variable'],
   teach:'A confounding variable was not properly accounted for but is associated with both the explanatory and response variables. It can make two measured variables appear directly related even when a third factor partly or completely explains the pattern.',
   different:['Ask: “Could a third variable explain why these two things occur together?”','A confounder touches both sides of the relationship. It is connected to the possible predictor and the outcome.','Do not just name any third variable. It has to plausibly relate to both measured variables.'],
   examples:['Sunscreen use and skin cancer → sun exposure can be a confounder.','Ice cream sales and shark attacks → temperature/season can influence both.','Vitamin-D users and better health → exercise, diet, smoking, and other behaviors may confound the association.'],
   visual:'confounder',
   worked:{scenario:'People who use more sunscreen also have higher rates of skin cancer in an observational study.',steps:['Sunscreen use and skin cancer are associated.','People with greater sun exposure may use more sunscreen.','Greater sun exposure also affects skin-cancer risk, making sun exposure a possible confounding variable.']},
   check:{prompt:'Ice cream sales and shark attacks both rise during summer. What is a likely confounding variable?',options:['Temperature / season','Ice cream flavor','Sampling frame','Placebo effect'],answer:'Temperature / season',why:'Warm weather can increase both ice cream purchases and swimming/beach activity.',repair:'confounder'},
   transfer:{prompt:'An observational study finds vitamin-D users are healthier. Which is the best interpretation?',options:['Other health behaviors may confound the association.','Vitamin D definitely caused better health.','No relationship can exist.','Randomization removed all confounding.'],answer:'Other health behaviors may confound the association.',why:'Exercise, diet, smoking, and other behaviors may be associated with both supplement use and health.'},
   explain:{prompt:'What makes a third variable a confounding variable rather than just another variable?',model:'A confounding variable is associated with both the explanatory variable and the response variable, so it can distort the apparent relationship between them.',choices:['It is connected to both the explanatory and response variables.','It must be the largest variable in the study.','It is always caused by the response variable.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Confounder Test',lines:['ASK: COULD A THIRD VARIABLE EXPLAIN BOTH?','CONFOUNDER ↔ EXPLANATORY VARIABLE','CONFOUNDER ↔ RESPONSE VARIABLE'],trap:'The third variable must plausibly connect to both measured variables.'},
   compare:{left:['Explanatory variable','Possible predictor / cause'],right:['Confounding variable','Third factor tied to both sides']},
   wguAsk:'WGU may give a surprising observational association. Look for a plausible third variable connected with both measured variables.'
  },
  {
   id:'l4-scatter',title:'Read a Scatterplot in Four Moves',
   terms:['Scatterplot','Linear','Nonlinear','No pattern / no correlation','Positive correlation','Negative correlation','Strong relationship','Weak relationship','Outlier'],
   teach:'A scatterplot displays the relationship between two quantitative variables. Read it in four moves: SHAPE → TREND → STRENGTH → OUTLIERS. Shape can be linear, nonlinear, or no pattern. For a linear pattern, trend can be positive or negative. Strength describes how tightly points follow the pattern. An outlier lies noticeably away from the overall pattern.',
   different:['Do not jump straight to positive or negative. First ask whether the pattern is linear.','Positive and negative describe direction, not good and bad. Strong and weak describe how tightly points follow the pattern.','Nonlinear does not mean no relationship. A clear curve can be a strong relationship even though it is not linear.'],
   examples:['Clear J-shaped curve → nonlinear.','Points rise left to right and hug a line → strong positive linear relationship.','Points fall left to right but are widely scattered → weak negative linear relationship.'],
   visual:'scatter',
   worked:{scenario:'A scatterplot rises from bottom-left to top-right and the points lie close to a straight line.',steps:['The shape is linear.','The trend is positive.','The points tightly follow the pattern, so the relationship is strong.','Overall: strong positive linear relationship.']},
   check:{prompt:'A scatterplot forms a clear J-shaped curve. How should the shape be described?',options:['Nonlinear','No correlation','Positive correlation','Negative correlation'],answer:'Nonlinear',why:'A clear curved pattern is a relationship, but it is not well described by a straight line.',repair:'nonlinear-none'},
   transfer:{prompt:'Points run from top-left to bottom-right and are widely scattered. Which description is best?',options:['Weak negative linear relationship','Strong positive linear relationship','No relationship','Nonlinear relationship'],answer:'Weak negative linear relationship',why:'The downward direction is negative, and the wide spread makes the relationship weak.'},
   explain:{prompt:'Why should you identify scatterplot shape before calling a relationship positive or negative?',model:'Positive and negative describe the direction of a linear pattern. If the relationship is nonlinear or there is no pattern, those direction labels may not be appropriate.',choices:['Direction labels make sense after deciding the pattern is linear.','Every nonlinear graph is positive.','Strength determines whether the graph is linear.'],correct:0},
   anchor:{title:'STOP & REMEMBER • Scatterplot Routine',lines:['1. SHAPE → LINEAR / NONLINEAR / NO PATTERN','2. TREND → POSITIVE / NEGATIVE','3. STRENGTH → STRONG / WEAK','4. OUTLIERS → POINTS AWAY FROM THE PATTERN'],trap:'WGU TRAP: nonlinear does NOT mean no relationship.'},
   compare:{left:['Positive correlation','Rises left to right'],right:['Negative correlation','Falls left to right']},
   wguAsk:'WGU can ask for shape, trend, strength, or an outlier separately. Read the graph in the same four-step order every time.'
  },
  {
   id:'l4-correlation',title:'Strong Correlation Still Does Not Prove Cause',
   terms:['Correlation','Association','Causal relationship'],
   teach:'A scatterplot can show a very strong relationship between two quantitative variables, but the graph alone does not explain why the relationship exists. Confounding variables, reverse direction of influence, or coincidence can produce correlation. Causal reasoning comes from the study design.',
   different:['A tight cloud of points answers “How strongly are these variables related?” It does not answer “Did one cause the other?”','Correlation is evidence of association. Causation is a stronger claim that needs stronger design evidence.','The prettier the line looks, the more tempting the causal mistake becomes. Resist it and check the design.'],
   examples:['A very strong positive correlation between two variables still cannot establish cause without appropriate study design.','A horizontal pattern may be described as no correlation because y does not meaningfully change as x changes.'],
   visual:'correlation',
   worked:{scenario:'A scatterplot shows a very strong positive correlation between two variables in an observational study.',steps:['The graph supports a strong association.','The study is observational, so alternative explanations remain.','The graph alone does not prove a causal relationship.']},
   check:{prompt:'A scatterplot shows a very strong positive correlation. What can the graph alone establish?',options:['A strong association','A causal relationship','That no confounding variable exists','That randomization was used'],answer:'A strong association',why:'The graph shows how strongly variables move together, not why the relationship exists.',repair:'association-causation'},
   transfer:{prompt:'What evidence should you look for before supporting a causal conclusion?',options:['A well-designed experiment with manipulation and appropriate control/randomization.','A very tight scatterplot alone.','A large correlation coefficient alone.','A graph with no outliers.'],answer:'A well-designed experiment with manipulation and appropriate control/randomization.',why:'Causal conclusions depend on study design, not merely the strength of correlation.'},
   explain:{prompt:'Explain why a strong correlation is not enough to prove causation.',model:'Correlation shows that variables are related, but confounding, reverse direction, or coincidence may explain the relationship. Causation requires stronger evidence from study design.',choices:['Strong correlation shows association, but causal explanation still depends on study design.','Strong correlation always proves cause.','Only weak correlations can have confounders.'],correct:0},
   anchor:{title:'FINAL WGU TRAP • Strong ≠ Causal',lines:['STRONG CORRELATION = TIGHT PATTERN','TIGHT PATTERN = STRONG ASSOCIATION','CAUSATION STILL DEPENDS ON STUDY DESIGN'],trap:'Never promote a relationship from association to causation just because the scatterplot looks convincing.'},
   compare:{left:['Strong correlation','Tight association pattern'],right:['Causal relationship','Cause supported by appropriate study design']},
   wguAsk:'WGU may deliberately give you a very strong scatterplot to tempt you into a causal conclusion. The graph alone is not enough.'
  }
 ]
}
];

const REPAIRS={
 'parameter-statistic':{title:'Repair Lesson • Parameter vs. Statistic',body:'A parameter is a numerical value describing the population. A statistic is a numerical value describing the sample. Ask whether the number summarizes ALL or the smaller group actually studied.'},
 'stratified-cluster':{title:'Repair Lesson • Stratified vs. Cluster',body:'Both methods begin with groups. Stratified takes SOME FROM ALL groups. Cluster takes ALL FROM SOME selected groups.'},
 'observe-experiment':{title:'Repair Lesson • Observational Study vs. Experiment',body:'An observational study records variables as they naturally occur. An experiment deliberately imposes a treatment. Ask whether the researcher changed or assigned something.'},
 'voluntary-nonresponse':{title:'Repair Lesson • Voluntary Response vs. Non-Response',body:'Voluntary response: people choose themselves into the sample. Non-response: people were selected first, then fail or refuse to respond.'},
 'sampling-response':{title:'Repair Lesson • Sampling Bias vs. Response Bias',body:'Sampling bias changes WHO gets into the sample. Response bias changes WHAT people in the sample report.'},
 'statistical-practical':{title:'Repair Lesson • Statistical vs. Practical Significance',body:'Statistical significance asks whether chance is a plausible explanation. Practical significance asks whether the effect is large or meaningful enough to matter.'},
 'association-causation':{title:'Repair Lesson • Association vs. Causation',body:'Association means variables are related. Causation means one produces an effect in the other. Observational evidence alone does not establish causation.'},
 'sampling-randomization':{title:'Repair Lesson • WHO vs. WHERE',body:'Random sampling decides WHO enters the study. Randomization decides WHERE participants are placed after entering.'},
 'fabrication-falsification':{title:'Repair Lesson • Fabrication vs. Falsification',body:'Fabrication invents observations. Falsification changes, omits, duplicates, or manipulates the research record.'},
 'selfinterest-fraud':{title:'Repair Lesson • Self-Interest vs. Proof of Fraud',body:'Self-interest creates a credibility concern because a researcher or sponsor has something to gain. It does not automatically prove that data were fabricated or falsified.'},
 'graph-scale':{title:'Repair Lesson • Read the Scale Before the Picture',body:'A bar chart can print correct values yet exaggerate their visual difference when the axis begins close to the data instead of an appropriate baseline. Inspect the axis before judging magnitude.'},
 'sample-size':{title:'Repair Lesson • Sample Size vs. Bias',body:'A small sample is more vulnerable to random variation. A larger sample can make estimates more stable, but it cannot repair systematic bias in who was selected or how data were collected.'},
 'confounder':{title:'Repair Lesson • Confounding Variable',body:'A confounding variable is associated with both the explanatory variable and the response variable. Ask whether a third factor could plausibly influence why the two measured variables occur together.'},
 'nonlinear-none':{title:'Repair Lesson • Nonlinear vs. No Relationship',body:'A nonlinear scatterplot can show a clear curved relationship. No pattern/no correlation means the points do not follow a discernible overall pattern. Curved does not mean unrelated.'}
};

function active(){return window.S?.activeCourse===COURSE}
function lessonById(id){return LESSONS.find(l=>l.id===id)||LESSONS[0]}
function progress(){
 const p=window.S?.progress?.[COURSE];
 if(!p)return null;
 p.learnModeV3338=p.learnModeV3338||{
   lessonId:LESSONS[0].id,mode:'opening',conceptIndex:0,phase:0,
   completedConcepts:{},confusions:{},responses:{},explanations:{},anchors:{},checkpoints:{},tutorTurns:{}
 };
 const st=p.learnModeV3338;
 st.completedConcepts=st.completedConcepts||{};st.confusions=st.confusions||{};st.responses=st.responses||{};
 st.explanations=st.explanations||{};st.anchors=st.anchors||{};st.checkpoints=st.checkpoints||{};st.tutorTurns=st.tutorTurns||{};
 return st;
}
function persist(){try{if(typeof window.save==='function')window.save()}catch(e){console.warn('Learn Mode save',e)}}
function current(){
 const st=progress(),lesson=lessonById(st?.lessonId),idx=Math.max(0,Math.min(lesson.concepts.length-1,Number(st?.conceptIndex)||0));
 return {st,lesson,concept:lesson.concepts[idx],idx};
}
function selectLesson(id){
 const st=progress();if(!st)return;
 st.lessonId=lessonById(id).id;st.mode='opening';st.conceptIndex=0;st.phase=0;st.currentFeedback=null;st.tutorResponse=null;
 persist();render();
}
function beginLesson(){
 const st=progress();st.mode='concept';st.phase=0;st.currentFeedback=null;persist();render();
}
function setPhase(n){
 const {st,concept}=current();
 const next=Math.max(0,Math.min(PHASES.length-1,Number(n)||0));
 st.phase=next;st.currentFeedback=null;
 if(next>=1){st.anchors[concept.id]=true}
 persist();render();
}
function completeConcept(){
 const {st,lesson,concept,idx}=current();
 st.completedConcepts[concept.id]=true;st.anchors[concept.id]=true;
 if(idx<lesson.concepts.length-1){st.conceptIndex=idx+1;st.phase=0;st.currentFeedback=null}
 else{startCheckpoint()}
 persist();render();
}
function startCheckpoint(){
 const {st,lesson}=current();
 const bank=window.MajickQuestionBuilder?.d772Questions?.('d772-learn-check')||[];
 const qs=bank.filter(q=>q.learningPathLessonId===lesson.id).slice(0,6);
 st.mode='checkpoint';st.checkpoint={lessonId:lesson.id,index:0,selected:null,submitted:false,answers:[],questionIds:qs.map(q=>q.id)};
 persist();render();
}
function checkpointQuestions(lesson,cp){
 const bank=window.MajickQuestionBuilder?.d772Questions?.('d772-learn-check')||[];
 const byId=new Map(bank.map(q=>[q.id,q]));
 let qs=(cp?.questionIds||[]).map(id=>byId.get(id)).filter(Boolean);
 if(qs.length<5)qs=bank.filter(q=>q.learningPathLessonId===lesson.id).slice(0,6);
 return qs;
}
function checkpointSelect(v){const st=progress();if(!st?.checkpoint||st.checkpoint.submitted)return;st.checkpoint.selected=v;render()}
function checkpointSubmit(){
 const {st,lesson}=current(),cp=st.checkpoint;if(!cp||cp.submitted||!cp.selected)return;
 const qs=checkpointQuestions(lesson,cp),q=qs[cp.index];if(!q)return;
 cp.submitted=true;cp.answers.push({qid:q.id,chosen:cp.selected,correct:cp.selected===q.answer,wguTerm:q.wguTerm||q.testedConcept||''});
 persist();render();
}
function checkpointNext(){
 const {st,lesson}=current(),cp=st.checkpoint,qs=checkpointQuestions(lesson,cp);if(!cp)return;
 if(cp.index<qs.length-1){cp.index++;cp.selected=null;cp.submitted=false;persist();render();return}
 const score=cp.answers.filter(a=>a.correct).length,total=qs.length;
 const status=score>=Math.max(5,total-1)?'Ready to move on':score>=Math.max(4,total-2)?'One distinction to repair':'Needs another teaching pass';
 st.checkpoints[lesson.id]={score,total,status,answers:[...cp.answers],at:Date.now()};
 st.mode='checkpointResult';persist();render();
}
function repairCheckpoint(){
 const {st,lesson}=current(),result=st.checkpoints[lesson.id];
 const wrong=(result?.answers||[]).find(a=>!a.correct);
 let idx=0;
 if(wrong?.wguTerm){
   const term=String(wrong.wguTerm).toLowerCase();
   const hit=lesson.concepts.findIndex(c=>(c.terms||[]).some(t=>term.includes(String(t).toLowerCase())||String(t).toLowerCase().includes(term)));
   if(hit>=0)idx=hit;
 }
 st.mode='concept';st.conceptIndex=idx;st.phase=0;st.currentFeedback=null;persist();render();
}
function nextLesson(){
 const {st,lesson}=current(),i=LESSONS.findIndex(l=>l.id===lesson.id);
 if(i<LESSONS.length-1){selectLesson(LESSONS[i+1].id)}
 else{try{window.MajickCourseTutor?.show?.('path')}catch(_){}}
}
function responseKey(kind,concept){return concept.id+':'+kind}
function answer(kind,choice){
 const {st,concept}=current(),q=kind==='transfer'?concept.transfer:concept.check,key=responseKey(kind,concept);
 const correct=choice===q.answer;
 st.responses[key]={choice,correct,at:Date.now()};
 st.currentFeedback={kind,correct,answer:q.answer,why:q.why};
 if(!correct&&concept.check?.repair){
   const rk=concept.check.repair;st.confusions[rk]=Number(st.confusions[rk]||0)+1;
 }
 persist();render();
}
function clearAnswer(kind){const {st,concept}=current();delete st.responses[responseKey(kind,concept)];st.currentFeedback=null;persist();render()}
function explainChoice(index){
 const {st,concept}=current(),ex=concept.explain;
 st.explanations[concept.id]={method:'choice',text:ex.choices[index],correct:Number(index)===Number(ex.correct),at:Date.now()};
 persist();render();
}
function saveExplanation(){
 const {st,concept}=current();
 const value=String(document.getElementById('v3338ExplainText')?.value||'').trim();
 if(!value)return;
 st.explanations[concept.id]={method:'typed',text:value,correct:null,at:Date.now()};persist();render();
}
function explainAloud(){
 const {st,concept}=current();st.explanations[concept.id]={method:'aloud',text:'Explained aloud',correct:null,at:Date.now()};persist();render();
}
function tutorAction(kind){
 const {st,concept}=current();
 let html='';
 if(kind==='different'){
   const n=Number(st.tutorTurns[concept.id+':different']||0),text=concept.different[n%concept.different.length];
   st.tutorTurns[concept.id+':different']=n+1;
   html='<b>Explain This Differently</b><p>'+E(text)+'</p>';
 }else if(kind==='example'){
   const n=Number(st.tutorTurns[concept.id+':example']||0),text=concept.examples[n%concept.examples.length];
   st.tutorTurns[concept.id+':example']=n+1;
   html='<b>Another Example</b><p>'+E(text)+'</p>';
 }else if(kind==='wgu'){
   html='<b>What Would WGU Ask?</b><p>'+E(concept.wguAsk)+'</p><small>Use the WGU term first; use the memory cue only to help you recognize it.</small>';
 }else if(kind==='compare'){
   html='<b>Compare These Two</b><div class="v3338TutorCompare"><span><strong>'+E(concept.compare.left[0])+'</strong>'+E(concept.compare.left[1])+'</span><span><strong>'+E(concept.compare.right[0])+'</strong>'+E(concept.compare.right[1])+'</span></div>';
 }else if(kind==='still'){
   const n=Number(st.tutorTurns[concept.id+':still']||0);
   const lenses=[
     'Strip the problem down to one decision. '+concept.different[(n)%concept.different.length],
     'Ignore the extra story details and look for the defining action. '+concept.anchor.lines[0]+'; '+(concept.anchor.lines[1]||''),
     'Use contrast instead of memorization: '+concept.compare.left[0]+' means '+concept.compare.left[1]+'. '+concept.compare.right[0]+' means '+concept.compare.right[1]+'.'
   ];
   st.tutorTurns[concept.id+':still']=n+1;
   html='<b>I Still Don’t Get It — New Approach '+((n%lenses.length)+1)+'</b><p>'+E(lenses[n%lenses.length])+'</p>';
 }
 st.tutorResponse=html;persist();render();
}
function repairHtml(concept){
 const st=progress(),key=concept.check?.repair,count=Number(st?.confusions?.[key]||0),r=REPAIRS[key];
 if(!r||count<2)return '';
 return '<aside class="v3338Repair"><small>ADAPTIVE REPAIR INSERTED • '+count+' MISSES</small><h4>'+E(r.title)+'</h4><p>'+E(r.body)+'</p></aside>';
}

function dots(points){return points.map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="4"></circle>').join('')}
function visual(type){
 if(type==='foundation')return '<div class="v3338Diagram foundation"><div class="pop"><b>POPULATION • ALL</b><div>'+Array.from({length:18},(_,i)=>'<i class="'+([1,5,8,13].includes(i)?'picked':'')+'"></i>').join('')+'</div><small>5,000 teachers</small></div><div class="arrow">→ sample →</div><div class="sample"><b>SAMPLE • SOME</b><div>'+Array.from({length:4},()=>'<i></i>').join('')+'</div><small>400 surveyed</small></div><div class="numberLinks"><span>Population number → <strong>PARAMETER</strong></span><span>Sample number → <strong>STATISTIC</strong></span></div></div>';
 if(type==='sampling')return '<div class="v3338Diagram sampling"><section><h5>STRATIFIED</h5><div class="groups">'+['A','B','C'].map(g=>'<div><b>'+g+'</b><i></i><i class="pick"></i><i></i><i class="pick"></i></div>').join('')+'</div><strong>SOME FROM ALL</strong></section><section><h5>CLUSTER</h5><div class="groups">'+['A','B','C'].map((g,i)=>'<div class="'+(i!==1?'chosen':'')+'"><b>'+g+'</b><i></i><i></i><i></i><i></i></div>').join('')+'</div><strong>ALL FROM SOME</strong></section></div>';
 if(type==='studytypes')return '<div class="v3338Diagram studytypes"><div class="question">WHAT DID THE RESEARCHER DO?</div><div class="branches"><span><b>WATCH / MEASURE</b>Observational study</span><span><b>ASK QUESTIONS</b>Sample survey</span><span><b>CHANGE / ASSIGN</b>Experiment</span></div></div>';
 if(type==='design')return '<div class="v3338Diagram design"><div><small>POPULATION</small><b>WHO?</b><strong>Random sampling</strong></div><span>→</span><div><small>SELECTED PARTICIPANTS</small><b>WHERE?</b><strong>Randomization</strong></div><span>→</span><div><small>GROUPS</small><b>COMPARE</b><strong>Control + treatment</strong></div></div>';
 if(type==='representative')return '<div class="v3338Diagram representative"><section><b>Target population</b><div>● ○ ● ○ ● ○ ● ○</div></section><span>→ fair selection? →</span><section class="warn"><b>Gym-only sample</b><div>● ● ● ● ● ○</div><small>exercise-heavy group overrepresented</small></section></div>';
 if(type==='selection')return '<div class="v3338Diagram selection"><div><b>Who chose participation?</b><span>People choose themselves → <strong>VOLUNTEER</strong></span><span>Researcher chooses easy people → <strong>CONVENIENCE</strong></span></div><div class="frame"><b>Sampling frame</b><span class="in">on-campus</span><span class="in">on-campus</span><span class="missing">commuters missing</span><strong>FRAME ERROR</strong></div></div>';
 if(type==='response')return '<div class="v3338Diagram response"><div class="start">SELECTED PERSON</div><div class="fork"><span><b>NO ANSWER</b>Non-response bias</span><span><b>INACCURATE ANSWER</b>Response bias</span><span><b>FEARS IDENTIFICATION</b>Perceived lack of anonymity</span></div></div>';
 if(type==='wording')return '<div class="v3338Diagram wording"><blockquote>“Don’t you agree our <em>excellent</em> program deserves more funding?”</blockquote><div><span>emotion / praise</span><span>pushes agreement</span><strong>LOADED QUESTION</strong></div></div>';
 if(type==='graphs')return '<div class="v3338Diagram graphs"><svg viewBox="0 0 320 180" role="img" aria-label="Truncated-axis bar graph"><line x1="45" y1="150" x2="300" y2="150"/><line x1="45" y1="20" x2="45" y2="150"/><text x="8" y="154">92%</text><text x="8" y="103">94%</text><text x="8" y="52">96%</text><rect x="95" y="100" width="62" height="50"/><rect x="205" y="50" width="62" height="100"/><text x="111" y="170">94%</text><text x="221" y="170">96%</text></svg><strong>2 points apart • visually looks much larger</strong></div>';
 if(type==='samplesize')return '<div class="v3338Diagram samplesize"><section><b>SMALL SAMPLE</b><div class="marbles">● ● ○ ● ○ ○</div><small>more random bounce</small></section><span>→ more observations →</span><section><b>LARGER SAMPLE</b><div class="marbles">● ○ ● ○ ● ○ ● ○ ● ○ ● ○ ● ○</div><small>more stable estimate</small></section><em>But bias does not disappear just because n is large.</em></div>';
 if(type==='significance')return '<div class="v3338Diagram significance"><section><b>STATISTICAL</b><span>Could random chance reasonably explain it?</span><strong>unlikely by chance</strong></section><div class="notEqual">≠</div><section><b>PRACTICAL</b><span>Is the effect large enough to matter?</span><strong>meaningful effect</strong></section></div>';
 if(type==='integrity')return '<div class="v3338Diagram integrity"><section><b>MISREPRESENT</b><span>real data</span><span>misleading story</span></section><section><b>FABRICATE</b><span>no observation</span><span>invent data</span></section><section><b>FALSIFY</b><span>change / omit / duplicate</span><span>research record</span></section></div>';
 if(type==='causation')return '<div class="v3338Diagram causation"><section><b>OBSERVE</b><span>variables move together</span><strong>ASSOCIATION</strong></section><div class="notEqual">≠</div><section><b>EXPERIMENT</b><span>manipulate + compare + randomize</span><strong>CAUSATION MAY BE SUPPORTED</strong></section></div>';
 if(type==='confounder')return '<div class="v3338Diagram confounder"><svg viewBox="0 0 360 190"><line x1="180" y1="45" x2="90" y2="135"/><line x1="180" y1="45" x2="270" y2="135"/><line x1="90" y1="135" x2="270" y2="135"/><circle cx="180" cy="45" r="36"/><circle cx="90" cy="135" r="42"/><circle cx="270" cy="135" r="42"/><text x="154" y="42">SUN</text><text x="145" y="57">EXPOSURE</text><text x="63" y="139">SUNSCREEN</text><text x="243" y="132">SKIN</text><text x="239" y="147">CANCER</text></svg><strong>Third variable touches BOTH sides.</strong></div>';
 if(type==='scatter')return '<div class="v3338Diagram scatter"><section><b>POSITIVE</b><svg viewBox="0 0 150 100">'+dots([[15,83],[30,75],[48,68],[63,56],[81,48],[97,37],[118,25],[135,16]])+'</svg></section><section><b>NEGATIVE</b><svg viewBox="0 0 150 100">'+dots([[15,17],[30,26],[48,34],[63,45],[81,54],[97,64],[118,73],[135,84]])+'</svg></section><section><b>NONLINEAR</b><svg viewBox="0 0 150 100">'+dots([[15,18],[30,38],[48,56],[63,70],[81,78],[97,69],[118,48],[135,22]])+'</svg></section></div>';
 if(type==='correlation')return '<div class="v3338Diagram correlation"><div class="tight"><svg viewBox="0 0 220 130">'+dots([[20,105],[38,95],[56,86],[74,76],[92,67],[110,58],[128,49],[146,39],[164,30],[182,21]])+'</svg><b>STRONG ASSOCIATION</b></div><div class="lock">≠<strong>CAUSATION</strong><small>Check study design.</small></div></div>';
 return '<div class="v3338Diagram"><strong>Use the WGU term, then connect it to the scenario clue.</strong></div>';
}
function anchorHtml(a,id){
 return '<article class="v3338Anchor" data-anchor="'+E(id)+'"><div class="pin">✦</div><small>ARCANE ANCHOR CHART • SAVED TO GRIMOIRE</small><h4>'+E(a.title)+'</h4><div class="anchorLines">'+a.lines.map(x=>'<b>'+E(x)+'</b>').join('')+'</div><p>'+E(a.trap)+'</p></article>';
}
function unlockedAnchors(){
 const st=progress();if(!st)return[];
 const out=[];for(const l of LESSONS)for(const c of l.concepts)if(st.anchors[c.id])out.push({lesson:l,concept:c});
 return out;
}
function anchorWallHtml(){
 const rows=unlockedAnchors();
 return '<section class="v3338AnchorWall"><header><div><small>THE ARCANE STACKS • D772</small><h2>Arcane Anchor Wall</h2><p>Charts unlock automatically as you reach them in Learn Mode. WGU terminology stays primary; memory cues sit underneath it.</p></div><span>'+rows.length+' unlocked</span></header>'+(rows.length?'<div class="v3338AnchorGrid">'+rows.map(x=>'<div><small>LESSON '+x.lesson.number+' • '+E(x.concept.title)+'</small>'+anchorHtml(x.concept.anchor,x.concept.id)+'</div>').join('')+'</div>':'<div class="v3338Empty">Open Learn Mode and reach the Visual stage of a concept to add its anchor chart here.</div>')+'</section>';
}
function lessonRail(lesson,st){
 return '<aside class="v3338LessonRail"><div class="railTitle"><small>D772 • SECTION 1</small><b>Learning Path</b></div>'+LESSONS.map(l=>{
   const done=l.concepts.filter(c=>st.completedConcepts[c.id]).length;
   return '<button type="button" data-v3338-lesson="'+l.id+'" class="'+(l.id===lesson.id?'active':'')+'"><i>'+l.number+'</i><span><b>'+E(l.title)+'</b><small>'+done+'/'+l.concepts.length+' concepts complete</small></span></button>';
 }).join('')+'<button type="button" class="anchorWallButton" data-v3338-anchor-wall><i>✦</i><span><b>Anchor Chart Wall</b><small>'+unlockedAnchors().length+' charts in your Grimoire</small></span></button></aside>';
}
function openingHtml(lesson){
 return '<section class="v3338Opening"><div class="openingSigil">✦</div><small>LESSON '+lesson.number+' • WHAT AM I LEARNING?</small><h1>'+E(lesson.title)+'</h1><p class="openingGoal">'+E(lesson.goal)+'</p><div class="mentalModel"><small>WGU MENTAL MODEL</small><b>'+E(lesson.mental)+'</b></div><div class="skillList"><h3>By the end of this lesson, you should be able to:</h3>'+lesson.skills.map((x,i)=>'<div><i>'+String(i+1).padStart(2,'0')+'</i><span>'+E(x)+'</span></div>').join('')+'</div><div class="openingNote"><b>This is a teaching path, not a notes dump.</b><span>You will work through one concept at a time. Your Turn and Explain Why must be completed before the concept closes.</span></div><button type="button" class="btn primary v3338Begin" data-v3338-begin>Begin Lesson '+lesson.number+' →</button></section>';
}
function phaseBar(st){
 return '<nav class="v3338PhaseBar" aria-label="Instruction cycle">'+PHASES.map((p,i)=>'<span class="'+(i===st.phase?'active':i<st.phase?'done':'')+'"><i>'+(i<st.phase?'✓':i+1)+'</i>'+E(p)+'</span>').join('')+'</nav>';
}
function teachStage(concept){
 return '<section class="v3338Stage"><div class="stageTag">I TEACH • WGU LANGUAGE FIRST</div><h2>'+E(concept.title)+'</h2><div class="termChips">'+concept.terms.map(t=>'<span>'+E(t)+'</span>').join('')+'</div><p class="teachText">'+E(concept.teach)+'</p><div class="stageFooter"><button class="btn primary" data-v3338-phase="1">Show me the visual →</button></div></section>';
}
function visualStage(concept){
 return '<section class="v3338Stage"><div class="stageTag">SEE IT • ANCHOR THE IDEA</div><h2>'+E(concept.title)+'</h2>'+visual(concept.visual)+anchorHtml(concept.anchor,concept.id)+'<div class="stageFooter"><button class="btn ghost" data-v3338-phase="0">← Teach</button><button class="btn primary" data-v3338-phase="2">Walk me through an example →</button></div></section>';
}
function workedStage(concept){
 return '<section class="v3338Stage"><div class="stageTag">WE DO • WORKED EXAMPLE</div><h2>'+E(concept.worked.scenario)+'</h2><div class="workedSteps">'+concept.worked.steps.map((x,i)=>'<div><i>'+String(i+1)+'</i><p>'+E(x)+'</p></div>').join('')+'</div><div class="workedConclusion"><small>WHAT TO NOTICE</small><b>'+E(concept.anchor.lines[0])+'</b></div><div class="stageFooter"><button class="btn ghost" data-v3338-phase="1">← Visual</button><button class="btn primary" data-v3338-phase="3">Now I try →</button></div></section>';
}
function questionCard(q,kind,concept){
 const st=progress(),r=st.responses[responseKey(kind,concept)],answered=!!r;
 return '<section class="v3338Stage"><div class="stageTag">'+(kind==='transfer'?'TRANSFER • NEW SCENARIO':'YOU DO • CHECK YOUR UNDERSTANDING')+'</div><h2>'+E(q.prompt)+'</h2><div class="v3338Choices">'+q.options.map((o,i)=>{
   const cls=answered?(o===q.answer?'correct':o===r.choice?'wrong':''):'';
   return '<button type="button" class="'+cls+'" '+(answered?'disabled':'')+' data-v3338-answer="'+E(kind)+'" data-choice="'+E(o)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(o)+'</span></button>';
 }).join('')+'</div>'+(answered?'<div class="v3338Feedback '+(r.correct?'correct':'repair')+'"><b>'+(r.correct?'✓ Correct':'Not yet')+'</b><p>'+E(q.why)+'</p>'+(r.correct?'':'<button type="button" class="textBtn" data-v3338-retry="'+E(kind)+'">Try this question again</button>')+'</div>':'')+
 repairHtml(concept)+'<div class="stageFooter">'+(kind==='transfer'?'<button class="btn ghost" data-v3338-phase="3">← First check</button>':'<button class="btn ghost" data-v3338-phase="2">← Worked example</button>')+
 (answered?(kind==='transfer'?(r.correct?'<button class="btn primary" data-v3338-phase="5">Explain why →</button>':''):'<button class="btn primary" data-v3338-phase="4">Try a new scenario →</button>'):'')+'</div></section>';
}
function explainStage(concept){
 const st=progress(),saved=st.explanations[concept.id];
 return '<section class="v3338Stage"><div class="stageTag">EXPLAIN WHY • MAKE THE REASONING YOURS</div><h2>'+E(concept.explain.prompt)+'</h2><div class="explainMethods"><div class="typed"><label>Type it in your own words</label><textarea id="v3338ExplainText" placeholder="The best answer is ___ because the scenario tells me ___...">'+E(saved?.method==='typed'?saved.text:'')+'</textarea><button class="btn ghost" data-v3338-save-explain>Save my explanation</button></div><div class="reasoningChoices"><label>Or choose the reasoning statement that best explains it</label>'+concept.explain.choices.map((x,i)=>'<button type="button" class="'+(saved?.method==='choice'&&saved.text===x?(saved.correct?'correct':'wrong'):'')+'" data-v3338-explain-choice="'+i+'">'+E(x)+'</button>').join('')+'</div><div class="aloud"><label>Or explain it aloud</label><button class="btn ghost" data-v3338-aloud>I explained it aloud</button></div></div>'+(saved?'<div class="modelAnswer"><small>MODEL EXPLANATION</small><p>'+E(concept.explain.model)+'</p></div>':'')+'<div class="stageFooter"><button class="btn ghost" data-v3338-phase="4">← New scenario</button>'+(saved?'<button class="btn primary" data-v3338-phase="6">Lock in this concept →</button>':'')+'</div></section>';
}
function completeStage(concept,lesson,idx){
 return '<section class="v3338Stage conceptComplete"><div class="completeSigil">✦</div><small>CONCEPT COMPLETE • ACADEMIC MASTERY ONLY</small><h2>'+E(concept.title)+'</h2><p>You taught it back, applied it to a new scenario, and unlocked its anchor chart. No game XP is being used to decide whether you understand this concept.</p>'+anchorHtml(concept.anchor,concept.id)+'<button class="btn primary" data-v3338-complete>'+ (idx<lesson.concepts.length-1?'Continue to next concept →':'Take the lesson checkpoint →')+'</button></section>';
}
function tutorPanel(concept,st){
 return '<aside class="v3338Tutor"><div class="tutorProfessor"><div class="orb">✦</div><div><small>MAJICK TUTOR</small><b>Professor at your side</b></div></div><p>Ask for a different teaching approach without leaving the concept.</p><div class="tutorButtons"><button data-v3338-tutor="different">Explain This Differently</button><button data-v3338-tutor="example">Show Me Another Example</button><button data-v3338-tutor="wgu">What Would WGU Ask?</button><button data-v3338-tutor="compare">Compare These Two</button><button data-v3338-tutor="still">I Still Don’t Get It</button></div><div class="tutorResponse">'+(st.tutorResponse||'<small>Choose an option above. “I Still Don’t Get It” changes the teaching approach instead of repeating the same paragraph.</small>')+'</div><div class="tutorAnchorMini"><small>CURRENT ANCHOR</small><b>'+E(concept.anchor.title)+'</b><span>'+E(concept.anchor.lines[0])+'</span></div></aside>';
}
function checkpointHtml(lesson,st){
 const cp=st.checkpoint||{};const qs=checkpointQuestions(lesson,cp),q=qs[cp.index||0];
 if(!q)return '<section class="v3338Stage"><h2>Checkpoint questions are loading.</h2><button class="btn ghost" data-v3338-repair-checkpoint>Return to teaching</button></section>';
 const submitted=!!cp.submitted;
 return '<section class="v3338Checkpoint"><div class="checkpointHead"><div><small>CAN I DO THIS? • LESSON '+lesson.number+'</small><h2>Lesson Checkpoint</h2><p>Six carefully chosen WGU-style scenarios. This changes academic mastery only; it does not affect game XP.</p></div><span>'+(Number(cp.index||0)+1)+' / '+qs.length+'</span></div><article><h3>'+E(q.prompt)+'</h3>'+(q.visual&&window.MajickWGUPractice?.visualHtml?window.MajickWGUPractice.visualHtml(q.visual):'')+'<div class="v3338Choices">'+q.options.map((o,i)=>'<button type="button" class="'+(submitted?(o===q.answer?'correct':o===cp.selected?'wrong':''):cp.selected===o?'selected':'')+'" '+(submitted?'disabled':'')+' data-v3338-cp-choice="'+E(o)+'"><i>'+String.fromCharCode(65+i)+'</i><span>'+E(o)+'</span></button>').join('')+'</div>'+(submitted?'<div class="v3338Feedback '+(cp.selected===q.answer?'correct':'repair')+'"><b>'+(cp.selected===q.answer?'✓ Correct':'Review this distinction')+'</b><p>'+E(q.why||'Use the defining WGU clue in the scenario.')+'</p></div>':'')+'<div class="stageFooter">'+(!submitted?'<button class="btn primary" data-v3338-cp-submit '+(cp.selected?'':'disabled')+'>Submit</button>':'<button class="btn primary" data-v3338-cp-next>'+((cp.index||0)<qs.length-1?'Next question →':'See lesson readiness →')+'</button>')+'</div></article></section>';
}
function checkpointResultHtml(lesson,st){
 const r=st.checkpoints[lesson.id]||{score:0,total:0,status:'Needs another teaching pass',answers:[]};
 const wrong=(r.answers||[]).filter(a=>!a.correct);
 return '<section class="v3338CheckpointResult '+(r.status==='Ready to move on'?'ready':r.status==='One distinction to repair'?'repair':'reteach')+'"><small>LESSON '+lesson.number+' • CAN I DO THIS?</small><h1>'+E(r.status)+'</h1><div class="scoreOrb">'+r.score+' / '+r.total+'</div><p>'+(r.status==='Ready to move on'?'Your checkpoint evidence supports moving forward. You do not need to wait for the calendar.':r.status==='One distinction to repair'?'Most of the lesson is secure. Repair the missed distinction, then move forward.':'Return to the teaching cycle for the missed concepts before you move on.')+'</p>'+(wrong.length?'<div class="missedTerms"><b>Concepts to repair</b>'+wrong.map(x=>'<span>'+E(x.wguTerm||'Lesson concept')+'</span>').join('')+'</div>':'')+'<div class="checkpointActions">'+(r.status==='Ready to move on'?'<button class="btn primary" data-v3338-next-lesson>'+ (lesson.number<4?'Start next lesson →':'Return to Section 1 path →')+'</button>':'<button class="btn primary" data-v3338-repair-checkpoint>Repair missed concept →</button>')+'<button class="btn ghost" data-v3338-retake>Retake checkpoint</button></div></section>';
}
function classroomHtml(){
 const {st,lesson,concept,idx}=current();if(!st)return '<div class="v3338Empty">D772 progress is not available yet.</div>';
 const main=st.mode==='opening'?openingHtml(lesson):st.mode==='checkpoint'?checkpointHtml(lesson,st):st.mode==='checkpointResult'?checkpointResultHtml(lesson,st):'<div class="v3338ConceptHead"><div><small>LESSON '+lesson.number+' • CONCEPT '+(idx+1)+' OF '+lesson.concepts.length+'</small><h1>'+E(concept.title)+'</h1></div><div class="conceptCompletion">'+lesson.concepts.filter(c=>st.completedConcepts[c.id]).length+'/'+lesson.concepts.length+' complete</div></div>'+phaseBar(st)+(st.phase===0?teachStage(concept):st.phase===1?visualStage(concept):st.phase===2?workedStage(concept):st.phase===3?questionCard(concept.check,'check',concept):st.phase===4?questionCard(concept.transfer,'transfer',concept):st.phase===5?explainStage(concept):completeStage(concept,lesson,idx));
 return '<section class="v3338Classroom"><header class="v3338ClassHeader"><div><small>THE MOONLIT COLLEGIUM • D772</small><h2>Learn Mode</h2><p>Teach → Visual → Worked Example → Your Turn → Feedback → New Scenario → Explain Why → Mastery Check</p></div><div class="classStatus"><b>Lesson '+lesson.number+'</b><span>'+E(lesson.title)+'</span></div></header><div class="v3338ClassGrid">'+lessonRail(lesson,st)+'<main>'+main+'</main>'+(st.mode==='concept'?tutorPanel(concept,st):'<aside class="v3338Tutor quiet"><div class="tutorProfessor"><div class="orb">✦</div><div><small>MAJICK TUTOR</small><b>Classroom guide</b></div></div><p>'+(st.mode==='opening'?'Review the learning goals, then begin when you are ready.':st.mode==='checkpoint'?'No tutoring clues during the lesson checkpoint. Use what you learned.':'Your checkpoint result tells you whether to move on or repair a distinction.')+'</p></aside>')+'</div></section>';
}
function anchorWallScreen(){
 return '<section class="v3338Classroom"><header class="v3338ClassHeader"><div><small>MAGICAL CLASSROOM • MEMORY WALL</small><h2>Arcane Anchor Charts</h2><p>Every chart here has already been encountered in Learn Mode and is also copied into the Living Grimoire.</p></div><button class="btn ghost" data-v3338-back-class>← Back to class</button></header>'+anchorWallHtml()+'</section>';
}
let wallOpen=false;
function render(){
 const box=document.getElementById('instructionClassroom');if(!box||!active())return;
 box.innerHTML=wallOpen?anchorWallScreen():classroomHtml();
 bindInside(box);
}
function show(){
 if(!active())return;
 document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
 const panel=document.querySelector('.learnPanel[data-panel="instruction"]');if(panel)panel.hidden=false;
 document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
 document.querySelector('[data-instruction-tab="instruction"]')?.classList.add('active');
 document.querySelector('.learnLab')?.classList.add('instructionFocus');
 render();
}
function bindInside(box){
 box.querySelectorAll('[data-v3338-lesson]').forEach(b=>b.addEventListener('click',()=>{wallOpen=false;selectLesson(b.dataset.v3338Lesson)}));
 box.querySelector('[data-v3338-begin]')?.addEventListener('click',beginLesson);
 box.querySelectorAll('[data-v3338-phase]').forEach(b=>b.addEventListener('click',()=>setPhase(Number(b.dataset.v3338Phase))));
 box.querySelectorAll('[data-v3338-answer]').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.v3338Answer,b.dataset.choice)));
 box.querySelectorAll('[data-v3338-retry]').forEach(b=>b.addEventListener('click',()=>clearAnswer(b.dataset.v3338Retry)));
 box.querySelector('[data-v3338-save-explain]')?.addEventListener('click',saveExplanation);
 box.querySelector('[data-v3338-aloud]')?.addEventListener('click',explainAloud);
 box.querySelectorAll('[data-v3338-explain-choice]').forEach(b=>b.addEventListener('click',()=>explainChoice(Number(b.dataset.v3338ExplainChoice))));
 box.querySelectorAll('[data-v3338-tutor]').forEach(b=>b.addEventListener('click',()=>tutorAction(b.dataset.v3338Tutor)));
 box.querySelector('[data-v3338-complete]')?.addEventListener('click',completeConcept);
 box.querySelector('[data-v3338-anchor-wall]')?.addEventListener('click',()=>{wallOpen=true;render()});
 box.querySelector('[data-v3338-back-class]')?.addEventListener('click',()=>{wallOpen=false;render()});
 box.querySelectorAll('[data-v3338-cp-choice]').forEach(b=>b.addEventListener('click',()=>checkpointSelect(b.dataset.v3338CpChoice)));
 box.querySelector('[data-v3338-cp-submit]')?.addEventListener('click',checkpointSubmit);
 box.querySelector('[data-v3338-cp-next]')?.addEventListener('click',checkpointNext);
 box.querySelector('[data-v3338-repair-checkpoint]')?.addEventListener('click',repairCheckpoint);
 box.querySelector('[data-v3338-next-lesson]')?.addEventListener('click',nextLesson);
 box.querySelector('[data-v3338-retake]')?.addEventListener('click',startCheckpoint);
}
function decorateGrimoire(){
 if(!active()||window.S?.screen!=='livinggrimoire')return;
 const root=document.querySelector('.v3311BookShell')?.parentElement||document.querySelector('main')||document.body;
 if(!root||root.querySelector('.v3338GrimoireAnchors'))return;
 const sec=document.createElement('section');sec.className='v3338GrimoireAnchors';sec.innerHTML=anchorWallHtml();root.appendChild(sec);
}
function patchScreenHTML(){
 if(typeof window.screenHTML!=='function'||window.screenHTML.__v3338Anchors)return;
 const prev=window.screenHTML;
 const wrapped=function(){
   const h=prev.apply(this,arguments);
   if(window.S?.screen==='livinggrimoire'&&active())return h+'<div class="v3338GrimoireInline">'+anchorWallHtml()+'</div>';
   return h;
 };
 wrapped.__v3338Anchors=true;window.screenHTML=wrapped;
}
const baseRender=window.MajickLearningLab?.render;
if(typeof baseRender==='function'){
 window.MajickLearningLab.render=function(){
   let h=baseRender();
   if(active()){
     h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-instruction-tab="instruction">Learn Mode</button>');
     h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="instruction" hidden><div id="instructionClassroom"></div></section>');
   }
   return h;
 };
}
const baseBind=window.MajickLearningLab?.bind;
if(typeof baseBind==='function'){
 window.MajickLearningLab.bind=function(){
   baseBind();
   if(!active())return;
   document.querySelector('[data-instruction-tab="instruction"]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show()});
   setTimeout(show,110);
 };
}
patchScreenHTML();
window.MajickInstruction={
 VERSION,LESSONS,PHASES,show,render,selectLesson,beginLesson,setPhase,answer,saveExplanation,explainAloud,tutorAction,completeConcept,
 startCheckpoint,checkpointSelect,checkpointSubmit,checkpointNext,repairCheckpoint,nextLesson,anchorWallHtml,decorateGrimoire,
 classroomHtml,openingHtml,checkpointHtml,checkpointResultHtml,unlockedAnchors,state:progress,current
};
document.documentElement.dataset.majickLearnMode=VERSION;
})();