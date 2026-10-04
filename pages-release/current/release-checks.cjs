// Deterministic checks against the canonical app, never historical overlays.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site');
function context(state={}){
 const c={S:state,console,Date,Math,setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>0,
 document:{documentElement:{dataset:{}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>({onclick:null,remove(){}})},
 moonwordPick:()=>{},pickAdaptive:pool=>pool?.[0],session:null,MajickLearningLab:{},MajickMaterialStore:{},save:()=>{},render:()=>{}};
 c.window=c;c.globalThis=c;c.MajickStateCore={ensureAccount:()=>state.majickAccount||(state.majickAccount={})};
 return vm.createContext(c);
}
function load(c,file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file})}
function check(name,fn){fn();console.log('PASS',name)}
check('course units, question keys, coverage and visual assets',()=>{
 const c=context();load(c,'course-tutor.js');const t=c.MajickCourseTutor,units=t.allOfficialLessons();
 assert.equal(t.sections('D772').length,3);assert.equal(new Set(units.map(u=>u.id)).size,units.length);
 const questionIds=new Set();
 for(const unit of units){const content=t.officialD772Content(unit,'D772');if(!content)continue;
  for(const q of content.practice||[]){assert(!questionIds.has(q.id),'duplicate question '+q.id);questionIds.add(q.id);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert(q.rationale)}
  for(const visual of content.visuals||[])assert(fs.existsSync(path.join(root,visual.src)),visual.src);
 }
 const quiz=t.officialD772Content({id:'d772-s2-l3-quiz'},'D772');assert.equal(quiz.provenance.reportedResult.correct,9);assert.equal(quiz.practice.length,10);assert.equal(quiz.practice[2].answer,2);assert.equal(quiz.visuals.length,2);
 const shape=t.officialD772Content({id:'d772-s2-l3-1'},'D772');assert.equal(shape.practice.length,8);
 assert.equal(t.officialD772Content({id:'d772-s2-l2-quiz'},'D772').provenance.reportedResult.correct,10);
 for(const file of fs.readdirSync(path.join(root,'coverage'))){const record=JSON.parse(fs.readFileSync(path.join(root,'coverage',file)));assert(units.some(u=>u.id===record.lessonId));}
});
check('games have unique usable D772 questions and valid answer choices',()=>{
 const c=context({activeCourse:'D772',progress:{},courses:{D772:{questionBank:[]}}});load(c,'game-realm.js');
 const qs=c.MajickGameRealm.d772RealmPool();assert(qs.length>20);assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
 for(const q of qs){assert(q.prompt);assert(q.options.includes(q.answer),'invalid game answer '+q.id);assert(q.why)}
});
check('reward replay, focused eggs, course isolation and saved reload',()=>{
 const state={activeCourse:'D772',majickAccount:{},progress:{D755:{answers:[]}},legacy:{activePetId:'g1',pets:[{id:'g1',type:'vesper'}],eggs:[1,2,3].map(i=>({id:'e'+i,type:'vesper',progress:0,goal:20}))}};
 let c=context(state);load(c,'study-progress-bridge.js');const api=c.MajickStudyProgress;assert(api.setFocusedEgg('e2'));
 const event={key:'release-check-answer',course:'D772',qid:'q1',correct:true,difficulty:3};assert(api.creditAnswer(event));
 assert.deepEqual(state.legacy.eggs.map(e=>e.progress),[0,2,0]);const gain=state.legacy.pets[0].studyXP;assert(gain>0);assert.equal(api.creditAnswer(event),false);assert.equal(state.legacy.pets[0].studyXP,gain);assert.equal(state.progress.D755.answers.length,0);assert.equal(state.progress.D772.answers.length,1);
 // Serialize the actual saved state, then construct a fresh runtime.
 const restored=JSON.parse(JSON.stringify(state));c=context(restored);load(c,'study-progress-bridge.js');assert.equal(c.MajickStudyProgress.focusedEgg().id,'e2');assert.equal(c.MajickStudyProgress.creditAnswer(event),false);assert.equal(restored.legacy.eggs.length,3);assert.equal(restored.legacy.eggs[1].progress,2);
 restored.legacy.eggs[1].progress=20;c.MajickCelestialIncubator.complete('e2');assert.equal(restored.legacy.pets.filter(p=>p.sourceEggId==='e2').length,1);assert.equal(restored.legacy.eggs.length,2);c.MajickCelestialIncubator.complete('e2');assert.equal(restored.legacy.pets.filter(p=>p.sourceEggId==='e2').length,1);
 const reloaded=context(JSON.parse(JSON.stringify(restored)));load(reloaded,'study-progress-bridge.js');reloaded.MajickCelestialIncubator.complete('e2');assert.equal(reloaded.S.legacy.pets.length,2);
});
console.log('Canonical release checks passed. Browser interaction and cloud-sync checks remain separate.');
