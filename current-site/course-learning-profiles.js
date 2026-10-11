(()=>{
'use strict';
const VERSION='3.4.7-course-learning-profiles';
const TYPES={
 definition:{
  id:'definition',label:'Definition / Distinction',
  supports:['compare-contrast','scenario-sort','misconception-traps','guardian-clue-fade'],
  sequence:['define','contrast','scenario','error-analysis','mixed-retrieval'],
  prompt:'Can the learner tell this concept apart from a similar one in a new scenario?'
 },
 procedure:{
  id:'procedure',label:'Procedure / Calculation',
  supports:['formula-breakdown','worked-example','substitution','calculator','pre-algebra-rescue','worked-error'],
  sequence:['recognize','formula','worked-example','guided-setup','independent-calc','interpret'],
  prompt:'Can the learner select, set up, calculate, and interpret the procedure independently?'
 },
 interpretation:{
  id:'interpretation',label:'Interpretation',
  supports:['visuals','graphs','context-questions','explain-answer','error-analysis'],
  sequence:['read-display','notice-pattern','translate-context','interpret','transfer'],
  prompt:'Can the learner explain what the data, graph, statistic, or result means in context?'
 },
 application:{
  id:'application',label:'Application / Decision',
  supports:['mixed-scenarios','transfer-questions','compare-actions','justify-choice','guardian-questioning'],
  sequence:['identify-goal','compare-options','apply-rule','justify','transfer'],
  prompt:'Can the learner choose and justify the best action in a realistic scenario?'
 },
 memory:{
  id:'memory',label:'Memorization-Heavy',
  supports:['retrieval','matching','spaced-review','guardian-recall','flashcards'],
  sequence:['encode','retrieve','match','space','mixed-recall'],
  prompt:'Can the learner recall the term, rule, or fact later without seeing it first?'
 }
};
const COURSE_OVERRIDES={
 D772:[
  {match:/population|sample|parameter|statistic|categorical|quantitative|explanatory|response|independent|dependent|disjoint/i,type:'definition'},
  {match:/bias|misleading|credibility|significance|misrepresentation/i,type:'application'},
  {match:/graph|display|distribution|skew|normal|box plot|five-number|scatter|histogram/i,type:'interpretation'},
  {match:/mean|median|mode|range|iqr|quartile|theoretical probability|empirical probability|union|intersection|complement|expected value/i,type:'procedure'},
  {match:/expected value|fair game|better outcome|decision/i,type:'application',secondary:'procedure'},
  {match:/key term|terminology|notation/i,type:'memory'}
 ],
 D755:[
  {match:/formative|summative|diagnostic|screening|norm-referenced|criterion-referenced|accommodation|modification|validity|reliability/i,type:'definition'},
  {match:/progress monitoring|data-based decision|eligibility|assessment purpose|evaluation/i,type:'application'},
  {match:/score|graph|trend|interpret/i,type:'interpretation'},
  {match:/iep|definition|term|law|requirement/i,type:'memory'}
 ]
};
function cid(){return String(window.S?.activeCourse||'')}
function course(id=cid()){return window.S?.courses?.[id]||{}}
function textOf(concept,lesson){
 return [concept?.id,concept?.title,concept?.teach,concept?.wguAsk,concept?.anchor?.trap,lesson?.id,lesson?.title,lesson?.goal,lesson?.teach].filter(Boolean).join(' ');
}
function inferType(concept,lesson,id=cid()){
 const text=textOf(concept,lesson);
 for(const row of (COURSE_OVERRIDES[id]||[])){if(row.match.test(text))return {primary:row.type,secondary:row.secondary||null,source:'course-override'}}
 const scores={definition:0,procedure:0,interpretation:0,application:0,memory:0};
 const rules=[
  ['definition',/define|difference|distinguish|identify|classify|which type|term|meaning|versus|vs\.?/gi,2],
  ['procedure',/calculate|compute|formula|solve|probability|mean|median|range|quartile|expected value|percent|decimal|equation/gi,2],
  ['interpretation',/interpret|graph|chart|display|distribution|trend|shape|what does .* mean|context/gi,2],
  ['application',/decision|choose|best|fair|should|apply|scenario|recommend|action|which .* better|evaluate/gi,2],
  ['memory',/remember|recall|vocabulary|key term|notation|list|name|memorize/gi,2]
 ];
 for(const [k,re,w] of rules){const m=text.match(re);if(m)scores[k]+=m.length*w}
 if(!Object.values(scores).some(Boolean))scores.definition=1;
 const sorted=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
 return {primary:sorted[0][0],secondary:sorted[1][1]>0?sorted[1][0]:null,source:'inferred',scores};
}
function explicitProfile(concept,lesson,id=cid()){
 const cp=concept?.learningProfile||concept?.profile||null;
 if(cp){
  const primary=TYPES[cp.primary||cp.type]?cp.primary||cp.type:'definition';
  return {primary,secondary:TYPES[cp.secondary]?cp.secondary:null,source:'explicit'};
 }
 return inferType(concept,lesson,id);
}
function profileFor(concept,lesson,id=cid()){
 const base=explicitProfile(concept,lesson,id),primary=TYPES[base.primary]||TYPES.definition,secondary=base.secondary?TYPES[base.secondary]:null;
 return {
  courseId:id,conceptId:concept?.id||'',title:concept?.title||lesson?.title||'Concept',
  primary:primary.id,primaryLabel:primary.label,secondary:secondary?.id||null,secondaryLabel:secondary?.label||null,
  supports:[...new Set([...(primary.supports||[]),...(secondary?.supports||[])])],
  sequence:[...(primary.sequence||[])],
  masteryQuestion:primary.prompt,
  source:base.source,
  scores:base.scores||null
 };
}
function ensureCourseProfiles(id=cid()){
 const c=course(id);if(!c)return {};
 c.learningProfiles=c.learningProfiles&&typeof c.learningProfiles==='object'?c.learningProfiles:{};
 return c.learningProfiles;
}
function saveProfile(concept,lesson,id=cid()){
 const profiles=ensureCourseProfiles(id),p=profileFor(concept,lesson,id),key=concept?.id||lesson?.id||('concept-'+Object.keys(profiles).length);
 profiles[key]=p;try{window.save?.()}catch(_){}
 return p;
}
function supportLabel(id){
 const labels={
  'compare-contrast':'Compare / Contrast','scenario-sort':'Scenario Sorting','misconception-traps':'Misconception Traps','guardian-clue-fade':'Fading Guardian Clues',
  'formula-breakdown':'Formula Breakdown','worked-example':'Worked Example','substitution':'Substitution Practice','calculator':'Calculator Support','pre-algebra-rescue':'Pre-Algebra Rescue','worked-error':'Worked Error',
  'visuals':'Visual Models','graphs':'Graph / Display Reading','context-questions':'Context Questions','explain-answer':'Explain the Answer','error-analysis':'Error Analysis',
  'mixed-scenarios':'Mixed Scenarios','transfer-questions':'Transfer Questions','compare-actions':'Compare Actions','justify-choice':'Justify the Choice','guardian-questioning':'Guardian Questioning',
  'retrieval':'Retrieval Practice','matching':'Matching','spaced-review':'Spaced Review','guardian-recall':'Guardian Recall','flashcards':'Flashcards'
 };
 return labels[id]||id.replace(/-/g,' ');
}
function cardHtml(concept,lesson,id=cid()){
 const p=profileFor(concept,lesson,id);
 return '<div class="v347LearningProfile"><small>COURSE LEARNING PROFILE</small><h3>'+p.primaryLabel+(p.secondaryLabel?' + '+p.secondaryLabel:'')+'</h3><p>'+p.masteryQuestion+'</p><div>'+p.supports.map(x=>'<span>'+supportLabel(x)+'</span>').join('')+'</div><em>'+(p.source==='explicit'||p.source==='course-override'?'Profile tuned for this course.':'Profile inferred from the concept; it can be refined as more course material is added.')+'</em></div>';
}
window.MajickLearningProfiles={VERSION,TYPES,COURSE_OVERRIDES,profileFor,saveProfile,ensureCourseProfiles,supportLabel,cardHtml,inferType};
document.documentElement.dataset.majickLearningProfiles=VERSION;
})();