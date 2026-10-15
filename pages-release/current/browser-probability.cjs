'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);
if(!chrome)throw Error('Chrome or Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'majick-chrome-'));
const server=http.createServer((req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,name);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file);const bytes=fs.readFileSync(file);const mime={'.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes)}catch{res.writeHead(404).end()}});
let child,ws,id=0,chromeStderr='';const wait=new Map();
function call(method,params={}){return new Promise((resolve,reject)=>{const n=++id;wait.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(wait.has(n)){wait.delete(n);reject(Error('CDP timeout '+method))}},12000)})}
async function evalPage(expression){const x=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(x.result?.exceptionDetails)throw Error(JSON.stringify(x.result.exceptionDetails));return x.result?.result?.value}
async function waitFor(expression){for(let n=0;n<100;n++){try{if(await evalPage(expression))return}catch{}await sleep(250)}throw Error('Page condition failed '+expression)}
async function action(statement){return evalPage('(()=>{'+statement+';return true})()')}
async function click(selector){
 await action('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center",behavior:"instant"})');
 if(selector==='[data-prob-next]'){const detail=await evalPage('(()=>{const e=document.querySelector("[data-prob-next]");if(!e)return {found:false};const r=e.getBoundingClientRect(),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {disabled:e.disabled,rect:{x:r.x,y:r.y,w:r.width,h:r.height},hit:h?.outerHTML.slice(0,300),button:e.outerHTML.slice(0,300),screen:S.screen,history:!!document.querySelector("#mjD772WguHistory")}})()');console.log('PROBABILITY NEXT HIT TEST',JSON.stringify(detail))}
 if(selector==='[data-prob-form] button[type=submit]'){const d=await evalPage('(()=>{const e=document.querySelector("[data-prob-form] button[type=submit]");if(!e)return {missing:true};const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {disabled:e.disabled,hit:hit?.outerHTML.slice(0,300),rect:{x:r.x,y:r.y,w:r.width,h:r.height},screen:S.screen}})()');console.log('PROBABILITY SUBMIT HIT',JSON.stringify(d))}
 await waitFor('(()=>{const e=document.querySelector('+JSON.stringify(selector)+');if(!e||e.disabled)return false;const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===e||e.contains(hit)})()');
 const r=await evalPage('(()=>{const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
 await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...r});
 await action('MajickProbabilityWorkshop.mount();MajickProbabilityWorkshop.mount()');
 await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...r});
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/index.html';
 child=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,url],{stdio:['ignore','ignore','pipe']});child.stderr.on('data',d=>chromeStderr+=String(d).slice(-4000));
 const portFile=path.join(profile,'DevToolsActivePort');let port;
 for(let n=0;n<120;n++){if(fs.existsSync(portFile)){port=+fs.readFileSync(portFile,'utf8').split('\n')[0];break}await sleep(150)}
 if(!port)throw Error('Chrome debugging port missing; command='+chrome+' exit='+child.exitCode+' stderr='+chromeStderr.slice(-2500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json(),tab=tabs.find(x=>x.type==='page');
 if(!tab)throw Error('Chrome tab missing');
 ws=new WebSocket(tab.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(wait.has(m.id)){const p=wait.get(m.id);wait.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};
 await call('Runtime.enable');
 try{await waitFor('!!document.querySelector("#content")&&!!window.MajickSolutionEngine&&!!window.MajickLessonActivities')}catch(e){
  let state=await evalPage('({ready:document.readyState,title:document.title,head:document.body?.innerText?.slice(0,600),content:!!document.querySelector("#content"),engine:!!window.MajickSolutionEngine,bank:!!window.MajickLessonActivities,scripts:[...document.scripts].slice(-8).map(s=>s.src)})').catch(err=>'CDP:'+err.message);
  console.error('Browser diagnostic:',JSON.stringify(state));throw e;
 }

 await waitFor('!!window.MajickProbabilityWorkshop&&!!window.MajickLearningContinuity');
 await action('startD756Course();switchCourse("D755");S.progress.D755.answers.push({qid:"phase2-d755-history",correct:true});switchCourse("D756");S.progress.D756.answers.push({qid:"phase2-d756-history",correct:false});switchCourse("D772");navigate("home")');
 await waitFor('!!document.querySelector("#mjAdaptiveMastery")');
 await action('navigate("games")');
 await waitFor('!!document.querySelector("#connectedProbability")');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector("#connectedProbability")');
 const backState=await evalPage('JSON.stringify(S.progress)');
 await click('[data-connected-back]');
 await waitFor('S.screen!=="games"');
 assert.equal(await evalPage('JSON.stringify(S.progress)'),backState,'Local probability Back preserves academic progress');
 await action('navigate("games")');await waitFor('!!document.querySelector("[data-connected-back]")');
 console.log('PASS probability: in-card Back returns to the previous room and preserves progress');
 // Fixture selects a probability question; the actual wrong answer is clicked in Oracle Lens.
 await action('startOracleLens();session.current=MajickGeneratedPractice.probabilityCase(0);session.current.section="Section 3 · Probability";render()');
 await waitFor('!!document.querySelector(".realmLensChoices button")');
 await action('document.querySelector(".realmLensChoices button").click()');
 await action('const wrong=[...document.querySelectorAll(".realmOracle [data-answer]")].find(b=>b.dataset.answer!==session.current.answer);if(!wrong)throw Error("No wrong Oracle option");wrong.click()');
 await waitFor('MajickLearningContinuity.probabilityState(false)?.need?.origin==="game-realm"');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),false);
 console.log('PASS probability: real Oracle Lens miss creates shared misconception');
 const before=await evalPage('JSON.stringify({D755:S.progress.D755,D756:S.progress.D756,history:S.progress.D772.answers.map(x=>x.qid),guardians:S.legacy.pets.map(x=>x.id),xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,furniture:S.majickAccount.sanctuaryFurniture})');
 const baseline=JSON.parse(before),datasets=new Set([JSON.stringify([3,2])]);
 async function openKind(kind){
  await waitFor('!!document.querySelector("[data-connected-open='+kind+']")&&!document.querySelector("[data-connected-open='+kind+']").disabled');
  await click('[data-connected-open='+kind+']');
  await waitFor('!!document.querySelector("[data-prob-form]")&&MajickLearningContinuity.probabilityState().focus==='+JSON.stringify(kind));
  const task=await evalPage('MajickLearningContinuity.probabilityState().tasks['+JSON.stringify(kind)+']');
  const sign=JSON.stringify(task.q.data);assert(!datasets.has(sign),'fresh practice must change the dataset');datasets.add(sign);
  assert.equal(await evalPage('S.screen'),{repair:'learninglab',reasoning:'mission',transfer:'games',teaching:'learninglab'}[kind]);
  return task;
 }
 async function fillTask(task,teaching=false){
  const [g,p]=task.q.data,n=g+p,second=task.q.event==='green-purple'?p:g-1;
  const fields={first:g,total:n,second,remaining:n-1,result:(g*second)+'/'+(n*(n-1)),rule:'multiply-conditional',whiteboard:'P(first and second) = '+g+'/'+n+' × '+second+'/'+(n-1)+'. The total falls by one; multiply conditional probabilities.',...(teaching?{diagnosis:'sample-space',model:'remove',probe:'new-draw',teaching:'Remove one green, ask the student to recount both colors and total, then use a fresh exit question.'}:{})};
  await action('const fields='+JSON.stringify(fields)+';for(const [key,value] of Object.entries(fields)){const e=document.querySelector("[data-prob-field="+key+"]");if(!e)throw Error("Missing probability field "+key);e.value=String(value);e.dispatchEvent(new Event("input",{bubbles:true}))}');
 }
 let task=await openKind('repair');
 assert.equal(await evalPage('document.querySelector("[data-connected-open=transfer]").disabled'),true);
 // Real keyboard input and selection must survive unrelated render-queue passes.
 await click('[data-prob-field=whiteboard]');
 await call('Input.insertText',{text:'Recount the remaining outcomes.'});
 await action('window.__probInput=document.querySelector("[data-prob-field=whiteboard]");window.__probForm=document.querySelector("[data-prob-form]");__probInput.setSelectionRange(8,11);for(let i=0;i<20;i++)MajickProbabilityWorkshop.mount()');
 assert.equal(await evalPage('document.querySelector("[data-prob-form]")===window.__probForm && document.activeElement===window.__probInput && __probInput.selectionStart===8 && __probInput.selectionEnd===11'),true,'Repeated mounts preserve actual form, focus and selection');
 await call('Input.insertText',{text:'these'});
 assert.equal(await evalPage('document.querySelector("[data-prob-field=whiteboard]").value'),'Recount these remaining outcomes.');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityState().drafts.repair.whiteboard'),'Recount these remaining outcomes.');
 console.log('PASS probability: repeated mounts preserve typing, selection and saved draft; pointer clicks include an intervening mount');

 await click('[data-remove-green]');
 assert.equal(await evalPage('document.querySelectorAll("[data-remove-green]:disabled").length'),task.q.data[0]-1);
 await fillTask(task);await click('[data-prob-form] button[type=submit]');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().repairVerified'),true);
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().independentCorrect'),0);
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),false);
 console.log('PASS probability: counter removal, guided calculation, no independent mastery credit');
 task=await openKind('reasoning');await fillTask(task);
 const draft=await evalPage('MajickLearningContinuity.probabilityState().drafts.reasoning.whiteboard');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector("[data-prob-form]")');
 assert.equal(await evalPage('document.querySelector("[data-prob-field=whiteboard]").value'),draft);
 await action('document.querySelector("[data-prob-form] button[type=submit]").click()');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().independentCorrect'),1);
 await click('[data-prob-next]');
 task=await evalPage('MajickLearningContinuity.probabilityState().tasks.reasoning');
 assert(!datasets.has(JSON.stringify(task.q.data)));datasets.add(JSON.stringify(task.q.data));
 await fillTask(task);await click('[data-prob-form] button[type=submit]');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().independentCorrect'),2);
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),false);
 console.log('PASS probability: two fresh multi-step Study Now responses and persisted whiteboard');
 task=await openKind('transfer');assert.equal(task.q.event,'green-purple');
 await fillTask(task);await click('[data-prob-form] button[type=submit]');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().transferVerified'),true);
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),false);
 const creditsBefore=await evalPage('Object.keys(S.majickAccount.studyProgressBridge.events).filter(k=>k.startsWith("connected:D772:")).length');
 assert.equal(creditsBefore,4);
 task=await openKind('teaching');await fillTask(task,true);await click('[data-prob-form] button[type=submit]');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),true);
 assert.equal(await evalPage('Object.keys(S.majickAccount.studyProgressBridge.events).filter(k=>k.startsWith("connected:D772:")).length'),creditsBefore);
 console.log('PASS probability: Game Realm transfer and structured classroom teach-back unlock certification separately');
 const screenshot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'majick-phase2-certified.png'),Buffer.from(screenshot.result.data,'base64'));
 const persisted=await evalPage('JSON.stringify(MajickLearningContinuity.probabilityState())');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector("#connectedProbability")');
 assert.equal(await evalPage('JSON.stringify(MajickLearningContinuity.probabilityState())'),persisted);
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),true);
 await action('document.querySelector("[data-prob-form] button[type=submit]").click()');
 assert.equal(await evalPage('JSON.stringify(MajickLearningContinuity.probabilityState())'),persisted,'disabled response must not replay');
 const after=await evalPage('({D755:S.progress.D755,D756:S.progress.D756,history:S.progress.D772.answers.map(x=>x.qid),guardians:S.legacy.pets.map(x=>x.id),xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,furniture:S.majickAccount.sanctuaryFurniture})');
 const academic=row=>Object.fromEntries(Object.entries(row||{}).filter(([key])=>!['xp','crystals','chests'].includes(key)));
 assert.deepEqual(academic(after.D755),academic(baseline.D755));assert.deepEqual(academic(after.D756),academic(baseline.D756));assert.deepEqual(after.furniture,baseline.furniture);
 assert(baseline.history.every(x=>after.history.includes(x)));assert(baseline.guardians.every(x=>after.guardians.includes(x)));assert(after.xp>=baseline.xp);assert(after.crystals>=baseline.crystals);
 for(const course of ['D755','D756']){
  const available=await evalPage('!!S.courses['+JSON.stringify(course)+']');if(!available)throw Error('Missing isolation course '+course);
  await action('switchCourse('+JSON.stringify(course)+');navigate("mission")');
  await sleep(200);assert.equal(await evalPage('!!document.querySelector("#connectedProbability")'),false);
 }
 await action('switchCourse("D772");navigate("home")');await waitFor('!!document.querySelector("#connectedProbability")');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),true);
 await action('document.querySelector("#connectedProbability").scrollIntoView({block:"start"})');
 await waitFor('!document.querySelector("#majickCampusPortal.active")');await sleep(200);
 const proof=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(os.tmpdir(),'majick-phase2-certified.png'),Buffer.from(proof.result.data,'base64'));
 // Validate the new panel actually fits a phone viewport.
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 assert(await evalPage('(()=>{const el=document.querySelector("#connectedProbability"),r=el.getBoundingClientRect();return r.width>100&&el.scrollWidth<=el.clientWidth+2})()'),'Connected flow overflows phone viewport');
 console.log('PASS probability: reload, replay prevention, D755/D756 isolation, history/Guardian/Sanctuary preservation and phone layout');

 await call('Emulation.clearDeviceMetricsOverride');
 await action('MajickWGUPractice.startSkillRetry("d772-s3-l2-1");session.type="adaptive";session.current=MajickGeneratedPractice.probabilityCase(41);session.questions=[session.current];session.answered=false;session.adaptiveTracked=false;render()');
 await waitFor('!!document.querySelector(".v3333Option")');
 await action('const i=session.current.options.findIndex(x=>x!==session.current.answer);document.querySelectorAll(".v3333Option")[i].click()');
 await action('document.querySelector(".v3333Submit").click()');
 await waitFor('MajickLearningContinuity.probabilityState().need?.origin==="study-now"');
 assert.equal(await evalPage('MajickLearningContinuity.probabilityMastery().certified'),false);
 await action('navigate("games")');await waitFor('document.querySelector("#connectedProbability").textContent.includes("study-now")');
 console.log('PASS probability: native Study Now miss revokes current certification and recommends repair in Game Realm');
 await action('navigate("learninglab")');
 await waitFor('!!document.querySelector("#learnLesson")');await sleep(300);
 await action('MajickLearningLab.showTab("learn");let steps=0;while(!/probability/i.test(document.querySelector(".learnStepHeader h3")?.textContent||"")){if(++steps>MajickLearningLab.lessons().length)throw Error("Probability lesson missing");document.querySelector("#learnNextLesson").click()}');
 await waitFor('!!document.querySelector(".majickGeneratedLab [data-check]")');
 await action('const box=document.querySelector(".majickGeneratedLab");box.querySelector("[data-answer]").value="0/1";box.querySelector("[data-reason]").value="Wrong sample-space explanation";box.querySelector("[data-check]").click()');
 await waitFor('MajickLearningContinuity.probabilityState().need?.origin==="generated-lab-guided"');
 await action('navigate("mission")');await waitFor('document.querySelector("#connectedProbability").textContent.includes("generated-lab-guided")');
 console.log('PASS probability: native Learn Lab guided miss produces shared Study Now recommendation');
 console.log('PASS Phase 2 probability end-to-end browser flow');

})().catch(e=>{console.error('FAIL browser QA:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
