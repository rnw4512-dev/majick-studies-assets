(()=>{
'use strict';
const VERSION='3.3.56';
const COURSE='D772';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LESSON_DEPTH={
 'd772-s1-l1':{
  label:'Lesson 1 • Data Collection',
  terms:['Population','Sample','Parameter','Statistic','Individuals','Variables','Quantitative','Categorical','Simple random sample','Stratified','Cluster','Systematic','Observational study','Sample survey','Experiment','Randomization','Replication','Control'],
  trap:'Random sampling chooses WHO enters the study. Randomization decides WHERE participants go after they enter.',
  clue:'Ask in order: Who is the full group? Who gave data? How were they selected? Did the researcher impose a treatment?',
  compare:['STRATIFIED = some from all groups','CLUSTER = all from some selected groups']
 },
 'd772-s1-l2':{
  label:'Lesson 2 • Bias',
  terms:['Sampling bias','Voluntary response bias','Convenience sampling','Self-interest bias','Response bias','Perceived lack of anonymity','Loaded question','Nonresponse bias','Sampling frame'],
  trap:'Voluntary response and nonresponse are opposites: volunteers choose themselves IN; nonresponders were selected but stay OUT.',
  clue:'Locate where the distortion entered: selection problem, participation problem, wording problem, or inaccurate-answer problem.',
  compare:['SAMPLING BIAS = wrong mix of people','RESPONSE BIAS = inaccurate answers']
 },
 'd772-s1-l3':{
  label:'Lesson 3 • Misrepresentation',
  terms:['Misleading display','Truncated axis','2-D icon distortion','3-D pie chart','Sample size','Statistical significance','Practical significance','Misrepresentation','Falsification'],
  trap:'Statistically significant does not automatically mean important, unbiased, causal, or generalizable.',
  clue:'Check scale, labels, sample size, comparison group, significance claim, and whether the report overstates what the data support.',
  compare:['STATISTICAL SIGNIFICANCE = unlikely from chance alone under the model','PRACTICAL SIGNIFICANCE = effect matters in real life']
 },
 'd772-s1-l4':{
  label:'Lesson 4 • Conclusions',
  terms:['Association','Correlation','Causation','Generalization','Random sampling','Random assignment','Lurking variable','Study limitation'],
  trap:'Random assignment helps causation. Random sampling helps generalization. They solve different problems.',
  clue:'Match the conclusion to the design: observational evidence supports association; a strong randomized experiment can support causation.',
  compare:['RANDOM ASSIGNMENT → stronger causal inference','RANDOM SAMPLING → stronger population generalization']
 }
};
function currentLesson(){
 try{
  const row=window.MajickCourseTutor?.selectedLesson?.(COURSE);
  return row?.id&&LESSON_DEPTH[row.id]?row.id:'d772-s1-l1';
 }catch(_){return 'd772-s1-l1'}
}
function openPractice(){
 try{window.navigate?.('mission')}catch(_){}
}
function renderBrief(){
 if(window.S?.screen!=='learninglab'||window.S?.activeCourse!==COURSE)return;
 const lab=document.querySelector('.learnLab');if(!lab)return;
 const old=lab.querySelector('.v3356ProfessorBrief');if(old)old.remove();
 const id=currentLesson(),d=LESSON_DEPTH[id];
 const card=document.createElement('section');card.className='v3356ProfessorBrief';
 card.innerHTML='<div class="v3356ProfessorHead"><div><small>PROFESSOR\'S LESSON BRIEF</small><h2>'+E(d.label)+'</h2><p>'+E(d.clue)+'</p></div><span>☾ D772</span></div>'+
 '<div class="v3356BriefGrid">'+
 '<article><small>KEY TERMS</small><div class="v3356TermCloud">'+d.terms.map(t=>'<span>'+E(t)+'</span>').join('')+'</div></article>'+
 '<article><small>COMMON WGU TRAP</small><p>'+E(d.trap)+'</p><div class="v3356Compare"><b>'+E(d.compare[0])+'</b><b>'+E(d.compare[1])+'</b></div></article>'+
 '</div><div class="v3356BriefActions"><button type="button" data-action="lesson">Return to lesson</button><button type="button" data-action="practice">Practice this material →</button></div>';
 card.querySelector('[data-action="lesson"]').addEventListener('click',()=>window.MajickCourseTutor?.openLesson?.(id,null,COURSE));
 card.querySelector('[data-action="practice"]').addEventListener('click',openPractice);
 const board=lab.querySelector('.v3354TeachingBoard');
 if(board)board.insertAdjacentElement('afterend',card);else lab.prepend(card);
}
function renderArchiveIndex(){
 if(window.S?.screen!=='livinggrimoire'||window.S?.activeCourse!==COURSE)return;
 const host=document.querySelector('.content');if(!host||host.querySelector('.v3356ArchiveIndex'))return;
 const wrap=document.createElement('section');wrap.className='v3356ArchiveIndex';
 wrap.innerHTML='<header><small>D772 SECTION 1 • RESEARCH INDEX</small><h2>Concept shelves</h2><p>Use this index to find the exact distinction you need before returning to a lesson or practice.</p></header><div class="v3356ArchiveGrid">'+
 Object.entries(LESSON_DEPTH).map(([id,d])=>'<article><small>'+E(d.label)+'</small><div>'+d.terms.slice(0,8).map(t=>'<span>'+E(t)+'</span>').join('')+'</div><button type="button" data-lesson="'+id+'">Open lesson →</button></article>').join('')+'</div>';
 wrap.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{try{window.navigate?.('learninglab');setTimeout(()=>window.MajickCourseTutor?.openLesson?.(b.dataset.lesson,null,COURSE),80)}catch(_){}}));
 const desk=host.querySelector('.v3354ArchiveDesk');if(desk)desk.insertAdjacentElement('afterend',wrap);else host.prepend(wrap);
}
function decorate(){
 document.documentElement.dataset.majickD772Instruction='3356';
 renderBrief();renderArchiveIndex();
}
const prev=window.render;
if(typeof prev==='function'&&!prev.__v3356){
 const wrapped=function(){const out=prev.apply(this,arguments);setTimeout(decorate,0);return out};wrapped.__v3356=true;window.render=wrapped;
}
setTimeout(decorate,140);
window.MajickD772InstructionDepth={VERSION,COURSE,LESSON_DEPTH,currentLesson,decorate};
})();