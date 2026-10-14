(()=>{
'use strict';
if(window.MajickVisualAnchors)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette={line:'#795e91',gold:'#b08444',ink:'#2b2340',soft:'#eaddf2'};
const svg=(body,w=480,h=235)=>'<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Worked mathematical illustration" style="max-width:100%;height:auto;border:1px solid #d9c5a3;border-radius:12px;background:#fffaf0"><title>Visual worked example</title>'+body+'</svg>';
const txt=(x,y,t,size=15,fill=palette.ink)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+fill+'" font-family="Arial,sans-serif">'+esc(t)+'</text>';
const line=(x,y,u,v,color=palette.line,width=3)=>'<line x1="'+x+'" y1="'+y+'" x2="'+u+'" y2="'+v+'" stroke="'+color+'" stroke-width="'+width+'"/>';
const rect=(x,y,w,h,color)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="5" fill="'+color+'"/>';
function renderMeanWorkedExample(){const nums=[4,6,8],bars=nums.map((n,i)=>rect(90+i*100,165-n*14,60,n*14,['#a68cca','#ceb279','#8dbcb5'][i])+txt(109+i*100,183,n));return svg(txt(22,30,'Balance the values: 4, 6, 8',19)+line(60,169,425,169)+bars+line(80,65,392,65,palette.gold,2)+txt(154,56,'sum = 18, count = 3',14)+txt(137,215,'Mean = 18 ÷ 3 = 6',19));}
function renderRangeWorkedExample(){return svg(txt(20,30,'Range measures the full span of the data',18)+line(90,120,390,120)+[4,6,8].map((n,i)=>'<circle cx="'+(90+i*150)+'" cy="120" r="8" fill="#795e91"/>'+txt(83+i*150,155,n,18)).join('')+txt(65,90,'minimum',14)+txt(355,90,'maximum',14)+txt(105,208,'Range = maximum − minimum = 8 − 4 = 4',15));}
function renderMedianWorkedExample(){const v=[3,5,7,10,15];return svg(txt(20,30,'Order the data',18)+v.map((n,i)=>rect(28+i*90,70,70,60,i===2?'#d7bf86':'#eadcf1')+txt(52+i*90,107,n,23)).join('')+txt(191,157,'↑ median',17)+txt(32,206,'Five values → middle is position 3 → 7',16));}
function renderRatioModel(){return svg(txt(16,32,'Keep the units in the same order',18)+rect(28,53,178,93,'#e8d7f4')+rect(271,53,180,93,'#eeddae')+txt(45,90,'3 notebooks',18)+txt(45,125,'12 students',18)+txt(292,90,'x notebooks',18)+txt(292,125,'20 students',18)+txt(219,106,'=',22)+txt(28,185,'3 / 12 = x / 20',18)+txt(270,185,'12x = 60 → x = 5',17));}
function renderProbabilityTree(){return svg(txt(15,27,'Two independent coin flips',18)+line(75,121,215,65)+line(75,121,215,180)+line(215,65,373,45)+line(215,65,373,95)+line(215,180,373,149)+line(215,180,373,215)+txt(97,79,'H ½')+txt(97,176,'T ½')+txt(234,46,'H ½')+txt(234,95,'T ½')+txt(234,148,'H ½')+txt(234,217,'T ½')+txt(381,50,'HH')+txt(381,99,'HT')+txt(381,154,'TH')+txt(381,220,'TT')+txt(20,224,'P(HH) = ½ × ½ = ¼',16));}
function renderBoxPlotExample(){const vals=[2,4,6,8,10,12,14],x=n=>50+n*25;return svg(txt(20,30,'Ordered: 2, 4, 6, 8, 10, 12, 14',17)+line(x(2),126,x(14),126)+line(x(4),80,x(4),170)+line(x(12),80,x(12),170)+rect(x(4),91,x(12)-x(4),69,'#e2d4ef')+line(x(8),91,x(8),160,palette.gold,5)+line(x(2),106,x(2),145)+line(x(14),106,x(14),145)+[2,4,8,12,14].map((n,i)=>txt(x(n)-9,191,n,14)+txt(x(n)-19,75,['min','Q1','med','Q3','max'][i],12)).join('')+txt(50,218,'IQR = Q3 − Q1 = 12 − 4 = 8',16));}
function renderHistogramExample(){const counts=[2,5,8,5,2,1],bw=54,base=184;return svg(txt(16,27,'Histogram: one quantitative variable',18)+line(50,base,438,base)+line(50,base,50,40)+counts.map((v,i)=>rect(62+i*bw,base-v*15,bw-2,v*15,'#8d75aa')+txt(75+i*bw,base+21,i+1,13)).join('')+txt(10,87,'count',12)+txt(188,228,'value (bins)',13)+txt(260,48,'One main peak: unimodal',13));}
function renderGraphExample(){return svg(txt(18,27,'Two variables: look for a pattern',17)+line(57,186,433,186)+line(57,186,57,44)+[[90,165],[140,151],[194,130],[247,109],[310,79],[375,65]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="6" fill="#8062a0"/>').join('')+txt(145,222,'Explanatory variable (x)',13)+txt(10,39,'y',14)+txt(185,52,'Positive association ≠ causation',13));}
function renderCalculatorSteps(type){const d={range:['Identify maximum 8 and minimum 4','Enter 8 − 4','Range: 4 in the original units'],mean:['Enter (4 + 6 + 8) ÷ 3','Press =','Result: 6'],median:['Sort: 3, 5, 7, 10, 15','Five numbers → third is middle','Median: 7'],ratio:['Enter (3 × 20) ÷ 12','Press =','Result: 5 notebooks'],probability:['Enter (1 ÷ 2) × (1 ÷ 2)','Press =','Result: 0.25 or 25%'],boxplot:['Sort 2, 4, 6, 8, 10, 12, 14','Q3 − Q1 = 12 − 4','IQR = 8'],histogram:['Read bar counts and axis scales','Check peak, tail, center and spread','Do not average category labels'],graph:['Read labels and units first','Look for trend and outliers','Association does not prove causation']};return (d[type]||d.graph).map(x=>'<li>'+esc(x)+'</li>').join('')}
function renderWhiteboardSetup(type){const x={range:'Write maximum − minimum. Use every observation when finding the extremes.',mean:'Write Σx ÷ n. Add values, then divide by the count.',median:'Sort the numbers. Mark the central position(s).',ratio:'Draw equivalent fractions. Keep units aligned.',probability:'Draw branches; multiply along AND paths, add nonoverlapping OR paths.',boxplot:'List minimum, Q1, median, Q3, maximum. Draw a number line.',histogram:'Label axes; note bin widths, peaks, tails, and range.',graph:'Label x and y variables, direction, form and unusual points.'};return esc(x[type]||x.graph)}
const MAP={range:renderRangeWorkedExample,mean:renderMeanWorkedExample,median:renderMedianWorkedExample,ratio:renderRatioModel,probability:renderProbabilityTree,boxplot:renderBoxPlotExample,histogram:renderHistogramExample,graph:renderGraphExample};
function kind(q={}){const m=q.anchorChart?.type;if(m&&MAP[m])return m;const t=[q.prompt,q.topicId,q.keyClue].join(' ').toLowerCase();if(/five.number|box.plot|quartile|iqr/.test(t))return 'boxplot';if(/median/.test(t))return 'median';if(/mean|average/.test(t))return 'mean';if(/\brange\b/.test(t))return 'range';if(/probab|complement|union|intersection|p\(|dependent|independent|disjoint|coin|dice/.test(t))return 'probability';if(/ratio|proportion|percent|rate/.test(t))return 'ratio';if(/histogram|distribution|skew|modal|long tail/.test(t)||/^d772-s2-l3(?:-|$)/.test(q.learningPathLessonId||''))return 'histogram';return 'graph'}
// Each card teaches one decision or calculation; extra tools stay collapsed.
function focusedSkill(q={}){
 const explicit=q.anchorChart?.type;
 if(explicit&&Object.prototype.hasOwnProperty.call(CARDS,explicit))return explicit;
 const t=String(q.prompt||'').toLowerCase(),family=kind(q);
 if(/expected\s+(?:value|net|payout|return|cost)|\be\(x\)/.test(t)||/^d772-s3-l4(?:-|$)/.test(q.learningPathLessonId||'')){
  if(/cost.*less|less.*cost|expected.*cost/.test(t))return 'expected-cost';
  if(/fair|unknown.*amount|unknown.*loss/.test(t)&&!/fair.*(?:die|dice)/.test(t))return 'fair-game';
  if(/which.*investment|compare|plan a.*plan b/.test(t))return 'expected-value-compare';
  return 'expected-value';
 }
 if(/bias|voluntary response|convenience|loaded question|non.?response/.test(t))return 'bias';
 if(/sampling method|stratified|cluster|systematic|simple random/.test(t))return 'sampling';
 if(/experiment|observational|placebo|blinding|random assignment/.test(t))return 'design';
 if(/population|sample|parameter|statistic/.test(t)&&family==='graph')return 'data';
 if(/significan|p.value/.test(t))return 'significance';
 if(/mean/.test(t)&&/added|outlier|extreme|increas|decreas|pull/.test(t))return 'mean-effect';
 if(/median/.test(t)&&/outlier|extreme|resist|skew/.test(t))return 'median-effect';
 if(/iqr|interquartile/.test(t))return 'iqr';
 if(/quartile|percentile|25%|50%|75%/.test(t)&&family==='boxplot')return 'quartiles';
 if(/explanatory|response variable/.test(t))return 'variables';
 if(family==='probability'){
  if(/complement|at least one|probability.*not|p\(not|neither/.test(t))return 'complement';
  if(/disjoint|mutually exclusive/.test(t))return 'disjoint';
  if(/independent|dependent/.test(t)&&!/probability.*both|probability.*and|probability.*two/.test(t))return 'independence';
  if(/empirical|observed|relative frequency/.test(t))return 'empirical';
  if(/union|\bor\b/.test(t))return 'union';
  if(/intersection|\bboth\b|\band\b|two.*flips/.test(t))return 'intersection';
  return 'simple-probability';
 }
 if(family==='histogram'){
  if(/tail|skew/.test(t))return 'skew';
  if(/peak|modal|modality|uniform/.test(t))return 'modality';
  if(/symmetric|symmetry|normal|bell/.test(t))return 'symmetry';
  return 'histogram';
 }
 if(/explanatory|response variable/.test(t))return 'variables';
 if(/categorical|quantitative|best.*graph|graph.*best|display.*appropriate/.test(t))return 'choose-graph';
 if(/scatter|correlation|association/.test(t))return 'association';
 return family==='graph'?'read-question':family;
}
const CARDS={
 'expected-value':['Calculate expected net value','E = sum of (signed net outcome × its probability).',['Include costs once; use a negative sign for losses.','Multiply each outcome by its probability, then add; interpret the sign as a long-run average.'],'Net outcomes +$8 (0.25) and −$2 (0.75): E = 2 − 1.50 = +$0.50.'],
 'fair-game':['Check whether a game is fair','A fair game has expected net value E = 0.',['Use signed net gains and losses, including the entry cost.','For an unknown amount, set the weighted sum equal to 0 and solve.'],'Win $12 with chance 0.25 or lose Z with chance 0.75: 3 − 0.75Z = 0, so Z = $4.'],
 'expected-value-compare':['Compare expected returns','Choose the larger expected net return for the higher long-run average.',['Calculate each option with the same viewpoint and consistent costs.','Compare the two averages; a larger possible prize or win probability alone is not enough.'],'A: 0.6(100) + 0.4(−20) = $52. B: 0.8(70) + 0.2(−10) = $54; B has the larger average.'],
 'expected-cost':['Compare expected costs','Expected total cost = certain price + probability × additional damage cost.',['Include the purchase price whether or not failure happens.','Choose the smaller positive expected cost.'],'A: 150 + 0.02(2,000) = $190. B: 80 + 0.06(2,000) = $200; A costs less on average.'],
 mean:['Calculate the mean','Mean = total ÷ number of values.',['Add every value, including repeats.','Divide by how many values there are.'],'For 4, 6, 8: 18 ÷ 3 = 6.','mean'],
 'mean-effect':['How an added value affects the mean','Compare the new value with the old mean.',['Above the old mean → mean rises.','Below the old mean → mean falls; equal → unchanged.'],'If the old mean is 6, adding 20 pulls it upward.'],
 median:['Find the median','Sort first, then find the middle.',['Odd count: use the single middle value.','Even count: average the two middle values.'],'For 3, 5, 7, 10, 15: the middle value is 7.','median'],
 'median-effect':['Median and extreme values','The median depends on position in the sorted list.',['Find the middle position(s).','An extreme value often changes the mean more than the median.'],'In 2, 4, 6, replacing 6 with 60 leaves the median at 4.'],
 range:['Calculate the range','Range = maximum − minimum.',['Find the largest and smallest values.','Subtract; keep the original units.'],'For 4, 6, 8: range = 8 − 4 = 4.','range'],
 iqr:['Calculate the IQR','IQR = Q3 − Q1.',['Use the upper quartile and lower quartile.','Subtract to find the spread of the middle 50%.'],'If Q1 = 4 and Q3 = 12, IQR = 8.'],
 quartiles:['Read quartiles','Quartiles divide ordered observations into four groups.',['Q1, median and Q3 mark about 25%, 50% and 75%.','Each consecutive box-plot segment contains about 25%, even when lengths differ.'],'A longer segment means more spread, not more observations.'],
 boxplot:['Read a box plot','Locate minimum, Q1, median, Q3 and maximum.',['Read each position against the number-line scale.','The box covers the middle 50% of observations.'],'The line inside the box marks the median.','boxplot'],
 ratio:['Set up the proportion','Keep the same quantities in the same order.',['Label what each numerator and denominator represents.','Scale both quantities by the same factor.'],'3 notebooks for 12 students → 5 notebooks for 20 students.','ratio'],
 complement:['Find the complement','P(not A) = 1 − P(A).',['Identify the event being excluded.','Subtract its probability from 1.'],'If P(A) = 0.30, P(not A) = 0.70.'],
 union:['Find “A or B”','P(A or B) = P(A) + P(B) − P(A and B).',['Add the two event probabilities.','Subtract the overlap so it is counted once.'],'0.40 + 0.30 − 0.10 = 0.60.'],
 intersection:['Find “A and B”','Use the probability of both events happening.',['Multiply P(A) by P(B given A).','For independent events, P(B given A) = P(B).'],'For independent fair coin flips: ½ × ½ = ¼.','probability'],
 independence:['Independent or dependent?','Ask whether the first outcome changes the next probability.',['Unchanged probability → independent.','Changed probability → dependent.'],'Drawing without replacement changes the available objects.'],
 disjoint:['Disjoint events','Disjoint events cannot happen together.',['Check whether the events overlap.','If they are disjoint, P(A and B) = 0.'],'One die roll cannot be both 2 and 5.'],
 empirical:['Empirical probability','Use observed successes ÷ total trials.',['Count the outcomes of interest.','Divide by every trial, not just successes.'],'8 successes in 20 trials gives 8/20 = 0.40.'],
 'simple-probability':['Calculate a simple probability','For equally likely outcomes: favorable ÷ total.',['Count the outcomes that satisfy the event.','Count all possible outcomes.'],'On a fair die, rolling 1 or 2 gives 2 favorable outcomes out of 6: 2/6 = 1/3.'],
 skew:['Identify skew','Name the direction of the long tail.',['Long right tail → skewed right.','Long left tail → skewed left.'],'Most values can sit on the left while the distribution is skewed right.'],
 modality:['Count the peaks','Modality describes the number of meaningful peaks.',['One peak → unimodal; two → bimodal.','Uniform means roughly equal heights, without a main peak.'],'Two peaks can have different heights and still be bimodal.'],
 symmetry:['Check symmetry','Compare the left and right sides of the distribution.',['Mirror-like sides → approximately symmetric.','A normal distribution is symmetric with one bell-shaped peak.'],'A flat uniform distribution can be symmetric without being normal.'],
 histogram:['Read a histogram','Each bar counts observations in a numerical interval.',['Read the interval on the horizontal axis.','Read its count on the vertical axis.'],'A bar of height 5 represents five observations in that interval.','histogram'],
 association:['Read association','Look at the overall direction of the points.',['Rising left to right → positive; falling → negative.','Association alone does not establish causation.'],'Higher x paired with higher y suggests positive association.','graph'],
 variables:['Identify the variable roles','The explanatory variable may help explain the response.',['Ask which variable is used to predict or explain.','The outcome being explained is the response.'],'Study time may explain an exam score.'],
 'choose-graph':['Choose the display','Match the display to the variable type.',['One categorical variable: bar chart or pie chart.','One quantitative variable: histogram, dot plot or stem-and-leaf; two quantitative variables: scatterplot.'],'Heights are quantitative, so a histogram can show their distribution.'],
 sampling:['Recognize the sampling method','Focus on how individuals are selected.',['Some individuals from every group → stratified.','Whole selected groups → cluster; every kth individual → systematic.'],'Selecting five students from every grade is stratified.'],
 design:['Recognize the study design','Look for researcher-assigned treatments.',['Assigned treatments → experiment.','No assigned treatment → observational study or survey.'],'Random assignment helps support a causal conclusion.'],
 bias:['Recognize the bias','Find the feature that can systematically distort the result.',['Check who was included or left out.','Check whether wording or incentives could influence responses.'],'An optional online poll can attract people with unusually strong opinions.'],
 data:['Population, sample, parameter or statistic','First decide whether the statement describes everyone or only the observed group.',['Entire group / its numerical summary → population / parameter.','Observed subset / its numerical summary → sample / statistic.'],'An average from 50 surveyed students is a statistic.'],
 significance:['Interpret statistical significance','Ask how surprising the result would be under the null hypothesis.',['A small p-value gives evidence against the null.','Statistical significance does not automatically mean a large practical effect.'],'Compare the p-value with the stated significance level.'],
 'read-question':['Focus on this question','Find the exact decision the question asks you to make.',['Identify the quantity or term requested.','Use only the data and defining clues needed for that decision.'],'Ignore story details that do not change the requested quantity.']
};
function render(q){const skill=focusedSkill(q),c=CARDS[skill]||CARDS['read-question'],visual=c[4];
 return '<section class="anchorChart focusedAnchor" data-anchor-skill="'+skill+'"><h3>'+esc(c[0])+'</h3><p class="anchorRule"><b>'+esc(c[1])+'</b></p><ul>'+c[2].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p><b>Skill example:</b> '+esc(c[3])+'</p>'+(visual?'<details><summary>See one visual example</summary>'+MAP[visual]()+'</details><details><summary>Whiteboard setup</summary><p>'+renderWhiteboardSetup(visual)+'</p></details>'+(['mean','median','range','ratio','probability'].includes(visual)?'<details><summary>Calculator steps for the example</summary><ol>'+renderCalculatorSteps(visual)+'</ol></details>':''):'')+'<small>Support marks this attempt as guided.</small></section>';
}
const style=document.createElement('style');style.textContent='.majVisualExample{margin-top:16px;padding:14px;border:1px solid #bba26b;border-radius:12px;background:#fff8e8;color:#352943}.majVisualExample h4{font:700 15px Georgia,serif;margin:13px 0 7px;color:#594269}.majVisualExample li{margin:5px 0;line-height:1.5}.majVisualExample p{line-height:1.6}';document.head.appendChild(style);
function pinClassroomAnchors(){
 const root=document.getElementById('content');if(!root||window.S?.activeCourse!=='D772')return;
 const screen=String(window.S?.screen||'');
 if(!['learninglab','mission','games','guide'].includes(screen))return;
 let host=root.querySelector('#majickClassroomAnchorShelf');
 if(host)return;
 host=document.createElement('aside');host.id='majickClassroomAnchorShelf';host.className='majickClassroomAnchorShelf';
 host.innerHTML='<details><summary>✦ Professor’s Anchor Wall · WGU reference charts</summary><p>Study the chart, vocabulary and whiteboard method before attempting independent mastery. Use the exact question graph when a problem provides one.</p><div class="majickAnchorButtons"></div><div class="majickAnchorContent" aria-live="polite"></div></details>';
 const presets=[['mean','Mean & averages'],['median','Median & quartiles'],['boxplot','Box plot & IQR'],['histogram','Histogram'],['graph','Scatterplot'],['probability','Probability'],['ratio','Ratio & proportion']];
 const buttons=host.querySelector('.majickAnchorButtons'),body=host.querySelector('.majickAnchorContent');
 const examples={mean:renderMeanWorkedExample,median:renderMedianWorkedExample,boxplot:renderBoxPlotExample,histogram:renderHistogramExample,graph:renderGraphExample,probability:renderProbabilityTree,ratio:renderRatioModel};
 for(const [key,label] of presets){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>{buttons.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));body.innerHTML='<h4>'+esc(label)+'</h4>'+examples[key]()+('<p class="majickAnchorTip">'+(key==='histogram'?'Start with axes and equal-width intervals; inspect shape, center, spread and outliers.':key==='graph'?'Describe direction, form and strength; association alone never proves causation.':key==='boxplot'?'Order observations; use minimum, Q1, median, Q3 and maximum. IQR = Q3 − Q1.':'Identify the given values, name the formula or rule, and check your result in context.')+'</p>')});buttons.appendChild(b)}
 root.prepend(host);
 const reviews=window.S?.progress?.D772?.adaptiveSkills||{};
 const pending=Object.values(reviews).filter(x=>x.status==='review-needed'||x.status==='reviewing'||x.status==='retry');
 if(pending.length){
  const footer=document.createElement('div');footer.className='majickAnchorRepair';footer.style.cssText='padding:10px;border-top:1px solid #c7a56f';
  const label=document.createElement('strong');label.textContent='Professor’s Recovery Circle · '+pending.length+' skill(s) to revisit';footer.append(label);
  for(const item of pending.slice(0,4)){
   const button=document.createElement('button');button.type='button';button.style.margin='6px';button.textContent=(item.status==='review-needed'?'Reteach ':'Practice again ')+item.lessonId;
   button.addEventListener('click',()=>{if(item.status==='review-needed')window.MajickLearningContinuity?.skillReview?.(item.lessonId);else window.MajickLearningContinuity?.skillRetry?.(item.lessonId)});footer.append(button)
  }
  host.querySelector('details').append(footer);
 }
}
const anchorStyle=document.createElement('style');
anchorStyle.textContent='.majickClassroomAnchorShelf{position:relative;z-index:2;margin:12px 16px;padding:12px;background:#2d203b;color:#fff3dd;border:2px solid #c7a56f;border-radius:15px}.majickClassroomAnchorShelf summary{cursor:pointer;font-weight:800;font-size:1.05rem;color:#ffe0a5}.majickAnchorButtons{display:flex;flex-wrap:wrap;gap:6px;padding:10px 0}.majickAnchorButtons button{background:#5e426e;color:#fff6e7;border:1px solid #d1af80;border-radius:8px;padding:9px;cursor:pointer}.majickAnchorButtons button[aria-pressed=true]{background:#936ca5;border:2px solid #ffe0a5}.majickAnchorContent{max-width:700px}.majickAnchorContent p{color:#fff3dd!important}.majickClassroomAnchorShelf svg{width:100%;height:auto;max-width:620px}.majickClassroomAnchorShelf button:focus-visible{outline:3px solid #fff0b0}';
document.head.append(anchorStyle);
const legacyRender=window.render;
if(typeof legacyRender==='function')window.render=function(){const out=legacyRender.apply(this,arguments);setTimeout(pinClassroomAnchors,70);return out};
setTimeout(pinClassroomAnchors,500);
window.MajickVisualAnchors={render,kind,focusedSkill,pinClassroomAnchors,renderMeanWorkedExample,renderMedianWorkedExample,renderRatioModel,renderProbabilityTree,renderBoxPlotExample,renderHistogramExample,renderGraphExample,renderCalculatorSteps,renderWhiteboardSetup,VERSION:'3.4.2-visual-anchors-1'};
})();
