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
 const center=t.officialD772Content({id:'d772-s2-l4-1'},'D772');const supplied=center.practice.filter(q=>q.id.startsWith('s2l41-course-'));assert.equal(supplied.length,6);assert.deepEqual(Array.from(supplied,q=>q.answer),[2,0,1,3,0,1]);assert.equal([1,1,1,3,6,6].reduce((a,b)=>a+b,0)/6,3);assert.equal([2,3,5,5,7,8,8,9].reduce((a,b)=>a+b,0)/8,5.875);
 const shape=t.officialD772Content({id:'d772-s2-l3-1'},'D772');assert.equal(shape.practice.length,8);
 assert.equal(t.officialD772Content({id:'d772-s2-l2-quiz'},'D772').provenance.reportedResult.correct,10);
 for(const file of fs.readdirSync(path.join(root,'coverage'))){const record=JSON.parse(fs.readFileSync(path.join(root,'coverage',file)));if(record.lessonId)assert(units.some(u=>u.id===record.lessonId),'Unknown coverage lesson '+file+': '+record.lessonId);else assert(record.courseId==='D772'||record.section?.id==='d772-s3','Unexpected coverage metadata '+file);}
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

check('D772 generated Section 2 math, charts and visual evidence across fresh datasets',()=>{
 const c=context({activeCourse:'D772',progress:{D772:{}}});load(c,'generated-question-engine.js');load(c,'visual-evidence-gate.js');
 const g=c.MajickGeneratedPractice,gate=c.MajickVisualEvidence;
 for(const skill of ['mean','median','boxplot','histogram','scatterplot','probability']){
  for(let i=0;i<30;i++){
   const q=g.generate(skill,i%2?2:3);
   assert(q,'generator returned no question for '+skill);
   assert(g.validate(q),'mathematical answer incorrect: '+skill);
   assert.equal(new Set(q.options).size,4,'duplicate choices: '+skill);
   assert(q.options.includes(q.answer),'answer missing from choices: '+skill);
   const result=gate.evidence(q);
   assert(result.required&&result.ok&&/<svg\b/.test(result.html),'unrenderable generated graph: '+skill);
   if(skill==='histogram')assert(q.visualHtml.includes('Quiz score intervals')&&q.visualHtml.includes('Frequency'),'histogram lacks labeled axes');
   if(skill==='scatterplot')assert(q.visualHtml.includes('Weekly practice hours')&&q.visualHtml.includes('Performance score'),'scatterplot axes unlabeled');
   if(skill==='boxplot')assert(q.why.includes('Q3')&&q.why.includes('Q1'),'missing IQR reasoning');
  }
 }
 const missing=gate.evidence({id:'broken-chart',prompt:'Use the supplied histogram to identify its shape.',answer:'Right skew'});
 assert(missing.required&&!missing.ok,'a missing graph must never be graded');
});

check('save migration, backups, corruption recovery and storage failure',()=>{
 const data=new Map();let fail=false;const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('Storage full');data.set(k,String(v))}};
 const c=context();c.localStorage=storage;load(c,'save-safety.js');const a=c.MajickSaveSafety;
 const original={courses:{D772:{id:'D772'},D755:{id:'D755'}},progress:{D772:{answers:[{qid:'q1'}],mastery:{c1:'shaky'}},D755:{answers:[]}},majickAccount:{xp:4500,crystals:150,sanctuaryFurniture:{owned:['bed'],placements:{bed:{x:10,y:20}}}},legacy:{pets:[{id:'unique-guardian',name:'Vesper A'}],eggs:[{id:'e1',progress:4},{id:'e2',progress:9},{id:'e3',progress:0}]}};
 const migrated=a.migrate(original);assert.equal(migrated.saveSchemaVersion,1);assert.equal(JSON.stringify(original),JSON.stringify({...migrated,saveSchemaVersion:undefined}));
 a.write(migrated);const next=JSON.parse(JSON.stringify(migrated));next.progress.D772.answers.push({qid:'q2'});a.write(next);assert.equal(JSON.parse(storage.getItem(a.keys.PREVIOUS)).progress.D772.answers.length,1);
 const exported=a.exportPayload(next),restored=a.preview(JSON.parse(JSON.stringify(exported)));assert.equal(JSON.stringify(restored),JSON.stringify(next));assert.equal(restored.legacy.eggs.length,3);assert.equal(restored.majickAccount.xp,4500);
 storage.setItem(a.keys.KEY,'broken-json');const recovered=a.read();assert.equal(recovered.progress.D772.answers.length,1);assert.equal(storage.getItem(a.keys.BAD),'broken-json');
 assert.throws(()=>a.preview({schemaVersion:2,state:next}),/newer/);assert.throws(()=>a.preview({courses:{},progress:{D772:{answers:'bad'}}}),/Invalid/);
 const before=storage.getItem(a.keys.KEY);fail=true;assert.throws(()=>a.write(next),/Storage full/);assert.equal(storage.getItem(a.keys.KEY),before);assert.equal(a.status().ok,false);
});
