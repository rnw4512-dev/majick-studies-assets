const fs=require('fs');
const vm=require('vm');
function assert(cond,msg){if(!cond)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3338/learn-mode.js','utf8');

const fakeQuestions=[];
for(let lesson=1;lesson<=4;lesson++){
  const lid='d772-s1-l'+lesson;
  for(let i=0;i<6;i++){
    fakeQuestions.push({
      id:'fake-'+lesson+'-'+i,
      learningPathLessonId:lid,
      prompt:'Lesson '+lesson+' scenario '+(i+1),
      options:['Correct','Distractor A','Distractor B'],
      answer:'Correct',
      why:'This is the WGU-grounded rationale for the scenario.',
      wguTerm:lesson===1?'Sampling method':lesson===2?'Bias':lesson===3?'Data credibility':'Association vs. causation',
      testedConcept:lesson===1?'Sampling method':lesson===2?'Bias':lesson===3?'Data credibility':'Association vs. causation'
    });
  }
}
const ctx={
 console,Date,Math,setTimeout,clearTimeout,
 S:{
   activeCourse:'D772',screen:'learninglab',
   progress:{D772:{xp:4987,crystals:50,answers:[],mistakes:[]}},
   courses:{D772:{id:'D772',title:'Statistical Data Literacy',questionBank:[...fakeQuestions]}}
 },
 save(){},
 render(){},
 screenHTML(){return '<section class="v3311BookShell">Living Grimoire</section>'},
 MajickQuestionBuilder:{d772Questions(){return [...fakeQuestions]}},
 MajickWGUPractice:{visualHtml(){return '<svg></svg>'}},
 MajickCourseTutor:{show(){}},
 MajickLearningLab:{
   render(){return '<section class="learnLab"><nav class="learnTabs" aria-label="Learning Lab"></nav><div class="learnPanels"></div></section>'},
   bind(){}
 },
 document:{
   documentElement:{dataset:{}},
   getElementById(){return null},
   querySelector(){return null},
   querySelectorAll(){return []},
   createElement(){return {className:'',innerHTML:'',appendChild(){}}},
   body:{appendChild(){}}
 }
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'learn-mode.js'});

assert(ctx.MajickInstruction?.VERSION==='3.3.38','Learn Mode runtime version wrong');
assert(ctx.document.documentElement.dataset.majickLearnMode==='3.3.38','Learn Mode dataset marker missing');

const shell=ctx.MajickLearningLab.render();
assert(/data-instruction-tab="instruction"/.test(shell),'Learn Mode tab was not injected');
assert(/data-panel="instruction"/.test(shell),'Learn Mode panel was not injected');

const xpBefore=ctx.S.progress.D772.xp;
let st=ctx.MajickInstruction.state();
assert(st.mode==='opening','New Learn Mode did not start on lesson opening');
let html=ctx.MajickInstruction.classroomHtml();
assert(/WHAT AM I LEARNING/.test(html),'Lesson opening is missing');
assert(/By the end of this lesson/.test(html),'Lesson goals are missing');

ctx.MajickInstruction.beginLesson();
st=ctx.MajickInstruction.state();
assert(st.mode==='concept'&&st.phase===0,'Begin Lesson did not enter concept teaching');
html=ctx.MajickInstruction.classroomHtml();
assert(/I TEACH/.test(html),'Teach stage is missing');

ctx.MajickInstruction.setPhase(1);
st=ctx.MajickInstruction.state();
assert(st.anchors['l1-foundations']===true,'Anchor chart did not unlock on Visual stage');
html=ctx.MajickInstruction.classroomHtml();
assert(/ARCANE ANCHOR CHART/.test(html),'Anchor chart is missing from Visual stage');

ctx.MajickInstruction.setPhase(3);
ctx.MajickInstruction.answer('check','Parameter');
ctx.MajickInstruction.answer('check','Parameter');
html=ctx.MajickInstruction.classroomHtml();
assert(/ADAPTIVE REPAIR INSERTED/.test(html),'Repeated mistake did not insert an adaptive repair lesson');

ctx.MajickInstruction.setPhase(4);
ctx.MajickInstruction.answer('transfer','Parameter');
ctx.MajickInstruction.setPhase(5);
ctx.MajickInstruction.explainAloud();
html=ctx.MajickInstruction.classroomHtml();
assert(/MODEL EXPLANATION/.test(html),'Explain Why did not reveal a model explanation after completion');

ctx.MajickInstruction.setPhase(6);
ctx.MajickInstruction.completeConcept();
st=ctx.MajickInstruction.state();
assert(st.completedConcepts['l1-foundations']===true,'Concept completion was not recorded');
assert(st.conceptIndex===1,'Concept completion did not advance one concept at a time');

const wall=ctx.MajickInstruction.anchorWallHtml();
assert(/Population vs. Sample/.test(wall),'Unlocked anchor chart is missing from the Anchor Wall');

ctx.S.screen='livinggrimoire';
const grimoire=ctx.screenHTML();
assert(/Arcane Anchor Wall/.test(grimoire),'Anchor charts were not copied into the Living Grimoire');

ctx.S.screen='learninglab';
ctx.MajickInstruction.selectLesson('d772-s1-l1');
ctx.MajickInstruction.beginLesson();
ctx.MajickInstruction.startCheckpoint();
st=ctx.MajickInstruction.state();
assert(st.mode==='checkpoint','Lesson checkpoint did not start');
for(let i=0;i<6;i++){
  ctx.MajickInstruction.checkpointSelect('Correct');
  ctx.MajickInstruction.checkpointSubmit();
  ctx.MajickInstruction.checkpointNext();
}
st=ctx.MajickInstruction.state();
assert(st.mode==='checkpointResult','Checkpoint did not end in a readiness result');
assert(st.checkpoints['d772-s1-l1'].status==='Ready to move on','Perfect checkpoint did not return Ready to move on');
assert(ctx.S.progress.D772.xp===xpBefore,'Learn Mode changed game XP; academic mastery must stay separate');

console.log('V3.3.38 LEARN MODE SMOKE PASSED');
console.log(JSON.stringify({
 version:ctx.MajickInstruction.VERSION,
 lessons:ctx.MajickInstruction.LESSONS.length,
 anchors:ctx.MajickInstruction.unlockedAnchors().length,
 checkpoint:st.checkpoints['d772-s1-l1'].status,
 xp:ctx.S.progress.D772.xp
}));
