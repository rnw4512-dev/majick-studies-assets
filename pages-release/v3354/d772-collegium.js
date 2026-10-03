(()=>{
'use strict';
const VERSION='3.3.54';
const COURSE='D772';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SECTION_ONE=[
 {id:'d772-s1-l1',number:1,title:'Understanding Data Collection Methods',objective:'Identify populations, samples, parameters, statistics, variables, sampling methods, and study designs.',anchors:['POPULATION = all • SAMPLE = some','PARAMETER → population • STATISTIC → sample','STRATIFIED = some from all • CLUSTER = all from some','EXPERIMENT imposes a treatment • OBSERVATIONAL STUDY does not']},
 {id:'d772-s1-l2',number:2,title:'Recognizing Bias in Data Collection',objective:'Identify how sampling, participation, wording, response, and nonresponse can distort results.',anchors:['VOLUNTARY RESPONSE = people choose themselves','CONVENIENCE = easiest people to reach','LOADED QUESTION = wording pushes an answer','NONRESPONSE = selected people do not respond']},
 {id:'d772-s1-l3',number:3,title:'Unveiling Data Misrepresentations',objective:'Detect misleading displays, weak samples, overstated claims, and misuse of statistical significance.',anchors:['CHECK THE AXIS before trusting the picture','SAMPLE SIZE affects how convincing a result is','STATISTICAL SIGNIFICANCE ≠ practical importance','A claim cannot be stronger than the evidence']},
 {id:'d772-s1-l4',number:4,title:'Conclusions About Data Findings',objective:'Decide what conclusions a study supports and separate association, causation, and generalization.',anchors:['ASSOCIATION does not automatically mean CAUSATION','Random assignment supports causal conclusions','Random sampling supports generalization','State conclusions only as strongly as the design allows']}
];
function activeLesson(){
 try{
  const row=window.MajickCourseTutor?.selectedLesson?.(COURSE);
  return SECTION_ONE.find(x=>x.id===row?.id)||SECTION_ONE[0];
 }catch(_){return SECTION_ONE[0]}
}
function openLesson(id){
 try{
  if(window.S?.screen!=='learninglab')window.navigate?.('learninglab');
  setTimeout(()=>window.MajickCourseTutor?.openLesson?.(id,null,COURSE),80);
 }catch(_){}
}
function home(){
 if(window.S?.screen!=='home'||window.S?.activeCourse!==COURSE)return;
 const host=document.querySelector('.v3327Home,.content'); if(!host||host.querySelector('.v3354CampusGate'))return;
 const lesson=activeLesson();
 const gate=document.createElement('section');gate.className='v3354CampusGate';
 gate.innerHTML='<div class="v3354Arch" aria-hidden="true"><span>✦</span></div><div class="v3354GateCopy"><small>THE MOONLIT COLLEGIUM • SCHOOL OF DATA LITERACY</small><h2>Welcome back to the Statistical Data Literacy hall.</h2><p>Section 1 is your current academic corridor: research design, bias, misrepresentation, and evidence-based conclusions.</p><div class="v3354Schedule"><b>Floating Course Board</b><span>Current class: D772</span><span>Next lesson: '+E(lesson.title)+'</span><button type="button">Enter today\'s class →</button></div></div><div class="v3354Banners" aria-hidden="true"><i>DATA</i><i>EVIDENCE</i><i>REASONING</i></div>';
 gate.querySelector('button').addEventListener('click',()=>openLesson(lesson.id));
 host.prepend(gate);
}
function classroom(){
 if(window.S?.screen!=='learninglab'||window.S?.activeCourse!==COURSE)return;
 const lab=document.querySelector('.learnLab');if(!lab||lab.querySelector('.v3354TeachingBoard'))return;
 const lesson=activeLesson();
 const board=document.createElement('section');board.className='v3354TeachingBoard';
 board.innerHTML='<div class="v3354BoardFrame"><small>ENCHANTED TEACHING BOARD • SECTION 1</small><h2>Lesson '+lesson.number+': '+E(lesson.title)+'</h2><p>'+E(lesson.objective)+'</p><div class="v3354Targets"><b>Today\'s classroom targets</b>'+lesson.anchors.map(x=>'<span>✦ '+E(x)+'</span>').join('')+'</div></div><aside><b>LEARN</b><span>Teach → Visual → Worked Example</span><b>PRACTICE</b><span>We Do → You Do → Explain Why</span><em>Learning and practice are intentionally separated.</em></aside>';
 const anchor=lab.querySelector('.lcContinue,.learnTabs,.v3338Classroom');(anchor||lab.firstChild)?.before?.(board);if(!board.isConnected)lab.prepend(board);
}
function grimoire(){
 if(window.S?.screen!=='livinggrimoire'||window.S?.activeCourse!==COURSE)return;
 const host=document.querySelector('.content');if(!host||host.querySelector('.v3354ArchiveDesk'))return;
 const lesson=activeLesson();
 const desk=document.createElement('section');desk.className='v3354ArchiveDesk';
 desk.innerHTML='<div class="v3354Shelves" aria-hidden="true"><span>RESEARCH METHODS</span><span>BIAS ARCHIVE</span><span>DATA DISPLAYS</span><span>CONCLUSIONS</span></div><div class="v3354Parchment"><small>COLLEGIUM RESEARCH LIBRARY • D772 ARCHIVE</small><h2>Section 1 Research Desk</h2><p>Use the Grimoire as your reference room: vocabulary, anchor charts, examples, traps, and lesson notes live here while the Learn Lab handles direct teaching.</p><nav class="v3354LessonTabs" aria-label="D772 Section 1 lessons">'+SECTION_ONE.map(x=>'<button type="button" data-v3354-lesson="'+x.id+'" class="'+(x.id===lesson.id?'active':'')+'">L'+x.number+' '+E(x.title)+'</button>').join('')+'</nav><div class="v3354Callout"><b>Anchor-chart callout</b><span>'+E(lesson.anchors[0])+'</span><span>'+E(lesson.anchors[1])+'</span></div></div><aside class="v3354Librarian"><span aria-hidden="true">☾</span><b>Research Desk</b><p>When a question feels tricky, identify the exact clue the problem gives you before choosing the statistical term.</p></aside>';
 desk.querySelectorAll('[data-v3354-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(b.dataset.v3354Lesson)));
 host.prepend(desk);
}
function decorate(){
 document.documentElement.dataset.majickD772Collegium='3354';
 home();classroom();grimoire();
}
const renderQueue=window.MajickRenderQueue;
if(renderQueue?.register){
 renderQueue.register('d772-collegium',decorate,50);
 renderQueue.schedule();
}else{
 const previousRender=window.render;
 if(typeof previousRender==='function'&&!previousRender.__d772_collegiumFallback){
  const wrapped=function(){const out=previousRender.apply(this,arguments);setTimeout(decorate,0);return out};
  wrapped.__d772_collegiumFallback=true;window.render=wrapped;
 }
 setTimeout(decorate,120);
}
window.MajickD772Collegium={VERSION,COURSE,SECTION_ONE,activeLesson,decorate,openLesson};
})();