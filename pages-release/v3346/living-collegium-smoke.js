const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/living-collegium.js','utf8');
const state={legacy:{pets:[{id:'p1',type:'luna',name:'Velora'},{id:'p2',type:'nova',name:'Solstice'}],eggs:[{id:'new-egg',type:'ember',progress:7,goal:22}]},majickAccount:{guardianCare:{log:[]}}};
const context={window:{S:state},document:{querySelector(){return null},title:''},setTimeout(){}};
vm.createContext(context);vm.runInContext(source,context);
const app=context.window.MajickLivingCollegium;
assert.equal(app.VERSION,'3.3.46');
assert.notEqual(app.persona('luna').place,app.persona('nova').place);
assert.equal((app.sceneHTML().match(/class="lcGuardianMoment"/g)||[]).length,2,'Only owned Guardians get moments');
assert(!app.sceneHTML().includes('new-egg'),'An egg must not appear as an owned Guardian');
state.legacy.pets.push({id:'p3',type:'ember',name:'Cascade'});
assert.equal((app.sceneHTML().match(/class="lcGuardianMoment"/g)||[]).length,3,'A newly hatched Guardian joins automatically');
state.legacy.pets[2].name='<script>alert(1)</script>';
assert(!app.sceneHTML().includes('<script>'),'Guardian names must be escaped');
console.log('V3.3.46 LIVING COLLEGIUM SMOKE PASSED');

context.document.documentElement={dataset:{}};
context.window.matchMedia=()=>({matches:true});
let saves=0;context.window.save=()=>saves++;
state.activeCourse='D755';state.screen='learninglab';app.rememberStudyRoute();
assert.equal(app.studyDestination(),'learninglab');
state.screen='mission';app.rememberStudyRoute();assert.equal(app.studyDestination(),'mission');
state.activeCourse='D772';assert.equal(app.studyDestination(),'learninglab','A different course must not inherit the prior course route');
state.screen='livinggrimoire';app.rememberStudyRoute();
state.activeCourse='D755';assert.equal(app.studyDestination(),'mission');
let route;context.window.navigate=x=>route=x;app.returnToStudy();assert.equal(route,'mission');
assert.equal(app.reducedMotion(),true,'Honor system reduced-motion setting by default');
app.toggleComfort('reduceMotion');assert.equal(app.reducedMotion(),false,'Explicit preference can override system setting');
app.toggleComfort('largeText');assert.equal(context.document.documentElement.dataset.majickLargeText,'true');
state.activeCourse='D772';assert.equal(app.comfort().largeText,true,'Comfort preferences follow the account across courses');
const before=saves;app.rememberStudyRoute();assert.equal(saves,before,'Decoration must not repeatedly save an unchanged study route');
assert.equal(state.legacy.pets.length,3,'Study shortcuts must not change Guardians');
console.log('APP-WIDE STUDY COMPASS AND COMFORT SMOKE PASSED');

state.activeCourse='D755';state.screen='learninglab';
app.rememberStudyTool('D755',{kind:'retake',value:'d755retake',label:'Retake Studio'});
assert.equal(app.savedStudyTool().label,'Retake Studio');
state.activeCourse='D772';assert.equal(app.savedStudyTool(),null,'Tool must not leak between courses');
app.rememberStudyTool('D772',{kind:'learn',value:'vocab',label:'Vocabulary'});
app.rememberStudyTool('D772',{kind:'retake',value:'d755retake',label:'Wrong course'});
assert.equal(app.savedStudyTool().label,'Vocabulary','D755-only tool replaced another course tool');
let clicks=0;const toolbox={open:false};
context.document.querySelectorAll=()=>[{dataset:{learnTab:'vocab'},textContent:'Vocabulary',closest(){return toolbox},click(){clicks++}}];
app.restoreStudyTool('D755');assert.equal(clicks,0,'Stale restoration changed a switched course');
app.restoreStudyTool('D772');assert.equal(clicks,1);assert.equal(toolbox.open,true);
state.screen='home';app.restoreStudyTool('D772');assert.equal(clicks,1,'Restoration navigated after the user left Learn Lab');
const parsed=app.studyToolFromButton({dataset:{planTab:'read'},textContent:'Read & Learn'});assert.equal(parsed.kind,'plan');
assert.equal(app.studyToolFromButton({dataset:{learnTab:'unknown'},textContent:'Unknown'}),null);
const beforeToolSave=saves;app.rememberStudyTool('D772',{kind:'learn',value:'vocab',label:'Vocabulary'});assert.equal(saves,beforeToolSave,'Repeated tool selection resaved unchanged state');
app.toggleComfort('largeText');app.resetComfort();
assert.equal(app.reducedMotion(),true,'Reset must restore system motion preference');assert.equal(!!app.comfort().largeText,false);
assert.equal(app.savedStudyTool().label,'Vocabulary','Reset changed saved course location');
const scrollCalls=[];context.document.querySelector=selector=>selector==='.top'?null:({scrollTo(options){scrollCalls.push({selector,...options})}});context.window.scrollTo=options=>scrollCalls.push(options);
app.pageTop();assert.equal(scrollCalls.length,3);assert(scrollCalls.every(x=>x.top===0&&x.behavior==='auto'),'Reduced motion top action animated');
app.toggleComfort('reduceMotion');scrollCalls.length=0;app.pageTop();assert(scrollCalls.every(x=>x.behavior==='smooth'),'Normal top action omitted smooth scroll');
assert.equal(state.legacy.pets.length,3,'App-wide study updates changed Guardians');
console.log('COURSE TOOL RESUME, DEFAULT COMFORT AND PAGE TOP PASSED');
// Exercise the actual Tutor bind callback with delayed hydration.
(async()=>{
 for(const testCase of ['saved-tool','course-switch','left-lab','default-path']){
  const courseState={activeCourse:'D772',screen:'learninglab',majickAccount:{studyTool:testCase==='saved-tool'?{D772:{kind:'learn',value:'vocab'}}:{}}};
  const panels=[{hidden:true,name:'path'},{hidden:false,name:'vocab'}],timers=[];
  let finish;
  const store={list:()=>new Promise(resolve=>finish=resolve)},lab={render:()=>'',bind(){},refresh(){}};
  const tutorContext={window:{S:courseState,MajickLearningLab:lab,MajickMaterialStore:store},S:courseState,MajickLearningLab:lab,MajickMaterialStore:store,document:{getElementById:()=>null,querySelectorAll:selector=>selector==='.learnPanel'?panels:[],querySelector:selector=>selector==='.learnPanel[data-panel="path"]'?panels[0]:null},setTimeout:fn=>timers.push(fn),console};
  vm.createContext(tutorContext);vm.runInContext(fs.readFileSync(__dirname+'/../v3326/course-tutor.js','utf8'),tutorContext);
  lab.bind();const pending=timers.shift()();
  if(testCase==='course-switch')courseState.activeCourse='D755';
  if(testCase==='left-lab')courseState.screen='home';
  finish([]);await pending;
  assert.equal(panels[0].hidden,testCase!=='default-path','Delayed Tutor default overwrote navigation: '+testCase);
 }
 console.log('DELAYED TUTOR STARTUP RESPECTS SAVED TOOL AND NAVIGATION');
})().catch(error=>{console.error(error);process.exitCode=1});

// A burst of renders should queue one shared decoration, then allow the next burst.
{
 const timers=[];let baseCalls=0,queries=0;
 const c={window:{render(){baseCalls++;return 'render-result'}},document:{querySelector(){queries++;return null},title:''},setTimeout(fn){timers.push(fn)}};
 vm.createContext(c);vm.runInContext(source,c);timers.length=0;
 for(let i=0;i<20;i++)assert.equal(c.window.render(),'render-result');
 assert.equal(baseCalls,20,'Shared scheduling swallowed a base render');
 assert.equal(timers.length,1,'Render burst queued redundant decoration passes');
 timers.shift()();assert(queries>0,'Coalesced decoration did not execute');
 c.window.render();assert.equal(timers.length,1,'Next render could not schedule decoration');
 timers.shift()();
 console.log('APP-WIDE DECORATION BURSTS COALESCED WITHOUT CHANGING BASE RENDERS');
}

assert(app.toolMatches('Guided Practice',' PRACTICE '));assert(app.toolMatches('Vocabulary','vocab'));assert(app.toolMatches('My Notes',''));assert(!app.toolMatches('Mastery','notes'));console.log('Classroom tool search matching passed');
