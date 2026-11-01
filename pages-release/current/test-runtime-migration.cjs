'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site'),baseline=process.argv[3]&&path.resolve(process.argv[3]);
const read=(name,base=root)=>fs.readFileSync(path.join(base,name),'utf8');
const retired=['v3311-main.js','v3311-plus.js','v339-main.js','study-ui-compat.js','ui-compat.js','sanctuary/v3310-sanctuary.js'];
for(const file of retired){assert(!fs.existsSync(path.join(root,file)),'Retired runtime still present: '+file);assert(!read(file.startsWith('sanctuary/')?'sanctuary/index.html':'index.html').includes('src="./'+path.basename(file)),'Retired runtime still loaded: '+file)}
const items=Array.from({length:90},(_,i)=>({id:'q'+i,topicId:'t'+i%8,answer:'result '+i,why:'reasoning about evidence '+i,keyClue:'different situation '+i,prompt:'Scenario '+i,section:'s'+i%3,format:['scenario','transfer','error_analysis'][i%3],difficulty:i%5+1}));
function context(seed){let n=seed;const math=Object.create(Math);math.random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};const progress={answers:[],urgentRepair:[]};const c={console,Math:math,prog:()=>progress,questionPool:()=>items,session:{questions:[]},promptTokens:s=>s.toLowerCase().split(/\s+/),save(){},record(q,chosen,correct,confidence,mode){progress.answers.push({qid:q.id,topicId:q.topicId,correct,chosen,confidence,mode})}};c.window=c;vm.createContext(c);return {c,progress}}
const next=context(733);vm.runInContext(read('question-scheduler.js'),next.c);
if(baseline){
 const prior=context(733),source=read('v339-main.js',baseline);vm.runInContext('(function(){'+source.slice(source.indexOf(' function v339Norm('),source.indexOf(' // ---------- UI cleanup'))+'})();',prior.c);
 for(let i=0;i<120;i++){
  assert.equal(next.c.v339GlobalTargetDifficulty(),prior.c.v339GlobalTargetDifficulty(),'Difficulty drift at attempt '+i);
  for(const topic of ['t0','t3','unknown'])assert.equal(next.c.topicTargetDifficulty(topic),prior.c.topicTargetDifficulty(topic));
  const a=next.c.pickAdaptive(items),b=prior.c.pickAdaptive(items);assert.equal(a.id,b.id,'Selection drift at attempt '+i);
  for(const x of [next,prior]){x.c.record(a,a.answer,i%6!==0,'sure','practice');if(i%9===0)x.progress.answers.at(-1).assisted=true;x.c.session.questions=[items[(i+6)%items.length]];}
  assert.equal(JSON.stringify(next.progress),JSON.stringify(prior.progress),'Recorded history drift at '+i);
 }
 console.log('PASS 120 seeded scheduler/recording comparisons against the retained baseline');
}
// Exercise actual scene methods without constructing a renderer or touching art.
function sceneContext(base,legacy){const c={console,window:{},Phaser:{Scene:class{},AUTO:0,Scale:{FIT:0,CENTER_BOTH:0},Math:{Between:()=>0}},Preloader:class{}};vm.createContext(c);vm.runInContext(read('sanctuary/Game.js',base)+'\nglobalThis.SceneOwner=Game;',c);if(legacy)vm.runInContext(read('sanctuary/v3310-sanctuary.js',base),c);return c}
const scene=sceneContext(root,false),priorScene=baseline&&sceneContext(baseline,true);
for(const species of ['Luna','Ember','Nova','Mallow'])for(let choice=0;choice<10;choice++){
 const outcomes=[];
 for(const c of [scene,...(priorScene?[priorScene]:[])]){c.Phaser.Math.Between=()=>choice;const stub={};for(const action of ['Walk','Hop','Sit','Sleep','Slither','Fly','Run','Pounce','Spin','Binky','Paw'])stub[species.toLowerCase()+action]=()=>action;outcomes.push(c.SceneOwner.prototype['choose'+species+'Behavior'].call(stub));}
 if(priorScene)assert.equal(outcomes[0],outcomes[1],species+' behavior '+choice);
}
console.log('PASS all 40 original Guardian behavior branches retain their motion actions');
let shutdown,removed=false;const calls=[],stub={events:{once(name,fn){assert.equal(name,'shutdown');shutdown=fn}},setPetDepths(){calls.push('depths')},time:{delayedCall(ms){calls.push(ms)},addEvent(config){assert.equal(config.delay,5200);assert.equal(config.loop,true);return {...config,remove(){removed=true}}}}};scene.SceneOwner.prototype.startMotionDirector.call(stub);assert.deepEqual(calls,['depths',650,1050,1450,1850]);shutdown();assert(removed);assert.equal(stub.motionWatchdog,null);
console.log('PASS scene-owned motion startup delays and watchdog preserve the original schedule');
const noOverrides=['grimoire.js','guardian-presentation.js','question-scheduler.js','study-audio.js','sanctuary-ui.js'];for(const f of noOverrides)assert(!read(f).includes('V336_PROJECT_PROGRESS'),'Historical completion overwrite migrated into '+f);
console.log('PASS legacy files retired without restoring fabricated project percentages');
