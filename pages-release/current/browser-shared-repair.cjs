'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);if(!chrome)throw Error('Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'maj-commons-'));
const server=http.createServer((req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}});
let proc,ws,id=0,stderr='';const contrastFailures=[],diagnostics=[];const inflight=new Map();
async function call(method,params={}){const n=++id;return new Promise((resolve,reject)=>{inflight.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(inflight.has(n)){inflight.delete(n);reject(Error('Timed out '+method))}},method==='Page.captureScreenshot'?60000:45000).unref()})}
async function ev(js){let r=await call('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function waitFor(js){for(let n=0;n<100;n++){try{if(await ev(js))return}catch(e){if(/Timed out/.test(e.message))throw e}await sleep(250)}console.error('Repair state',await ev('JSON.stringify({screen:S.screen,session:typeof session!=="undefined"?session:null,body:document.body.innerText.slice(-7000)})').catch(()=>null));console.error('Sanctuary diagnostic',JSON.stringify({errors:diagnostics,frame:await ev('(()=>{const f=document.querySelector(".v3317SanctuaryFrame"),w=f?.contentWindow;return {url:f?.src,note:w?.document?.body?.innerText.slice(0,300),game:!!w?.majickPhaserGame,scenes:w?.majickPhaserGame?.scene?.scenes.map(s=>({key:s.sys.settings.key,status:s.sys.settings.status,decor:s.decorItems?.length,button:!!s.v3321FurnitureButton}))}})()').catch(()=>null)}));throw Error('Page condition: '+js)}
const deadline=setTimeout(()=>{console.error('Commons audit exceeded 480 seconds');try{proc?.kill()}catch{};server.closeAllConnections();process.exit(1)},process.env.COMMONS_WIDTH?480000:900000);deadline.unref();
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--enable-unsafe-swiftshader','--remote-allow-origins=*','--remote-debugging-port=0','--no-first-run','--no-default-browser-check','--disable-background-networking','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});proc.stderr.on('data',d=>stderr+=String(d).slice(-3000));
 let port;for(let k=0;k<400;k++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}if(!port)throw Error('Chrome start '+stderr.slice(-1500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});ws.onmessage=e=>{const m=JSON.parse(e.data),p=inflight.get(m.id);if(m.method==='Runtime.exceptionThrown')diagnostics.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')diagnostics.push(m.params.args.map(a=>a.description||a.value));if(p){inflight.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};await call('Runtime.enable');await call('Page.enable');await call('Page.navigate',{url});


 await waitFor('!!window.MajickQuestionRepair&&!!window.MajickWGUPractice&&!!window.MajickGeneratedPractice&&!!window.MajickLearningContinuity&&!!window.MajickSolutionEngine');
 await ev('switchCourse("D772");navigate("mission")');
 await ev('window.__repairFixture=MajickGeneratedPractice.generate("mean",2);session={type:"test",opts:{label:"Shared repair test",kind:"d772-diagnostic",assessmentOnly:true,limit:1},questions:[__repairFixture],current:__repairFixture,index:1,score:0,combo:0,review:[],answered:false};render()');
 const q=await ev('__repairFixture');const wrong=q.options.find(o=>o!==q.answer);
 await ev('MajickWGUPractice.select('+JSON.stringify(wrong)+');MajickWGUPractice.submit()');
 await waitFor('document.querySelectorAll(".v3333Feedback .aetheriaQuestionRepair details").length===8');
 const headings=await ev('[...document.querySelectorAll(".aetheriaQuestionRepair summary")].map(s=>s.textContent)');
 assert.deepEqual(headings,['Your Answer','Correct Answer','Mistake Diagnosis','Remember','Reconstruct','Visualize','Fix Your Approach','Try Again'].map((s,i)=>(i+1)+' · '+s));
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(__repairFixture,false).required'),false);
 const diagnostic=await ev('document.querySelector(".aetheriaQuestionRepair").textContent');assert(diagnostic.includes(wrong));for(const v of q.data)assert(diagnostic.includes(String(v)));
 assert(diagnostic.includes('selection alone does not establish'));assert.equal(await ev('!!S.progress.D772.interactiveMastery?.["interactive-independent:D772:mean"]'),false);
 console.log('PASS Professor Repair: eight ordered details, selected answer, actual values, uncertain diagnosis and first-miss threshold');
 const newq=await ev('window.__trialFixture=MajickGeneratedPractice.generate("mean",2);window.__transferFixture=MajickGeneratedPractice.generate("mean",2);S.progress.D772.mixedExamRound={version:1,deck:[__trialFixture,__transferFixture],index:0,selected:"",submitted:false,correct:0,attempted:0,skillResults:{}};navigate("reasoning");__trialFixture');
 await waitFor('!!document.querySelector("[data-exam-submit]")');
 const tw=newq.options.find(o=>o!==newq.answer);
 await ev('(()=>{const inputs=[...document.querySelectorAll(".majMixedExam input[type=radio]")];const target=inputs.find(i=>i.value==='+JSON.stringify(tw)+');if(!target)throw Error("Missing trial option");target.click();document.querySelector("[data-exam-submit]").click()})()');
 await waitFor('document.querySelectorAll(".majExamFeedback .aetheriaQuestionRepair details").length===8');
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(__trialFixture,false).misses'),2);
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(__trialFixture,false).required'),true);
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!window.MajickQuestionRepair&&!!document.querySelector(".majExamActions button")');
 const current=await ev('S.progress.D772.mixedExamRound.deck[0]');
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(S.progress.D772.mixedExamRound.deck[0],false).misses'),2);
 await ev('document.querySelector(".majExamActions button").click()');
 await waitFor('!!document.querySelector("[data-reconstruction-fields]")');
 const masteryBefore=await ev('JSON.stringify(S.progress.D772.interactiveMastery||{})');
 for(let i=0;i<60;i++){
  const step=await ev('(()=>{const q=S.progress.D772.mixedExamRound.deck[0],r=MajickLearningContinuity.practiceRecovery(q,false);return r.required?MajickSolutionEngine.reconstructionPlan(q)[r.stage]:null})()');if(!step)break;
  await ev('(()=>{const step='+JSON.stringify(step)+',form=document.querySelector("[data-reconstruction-fields]");if(step.regions){[...form.querySelectorAll("button")].forEach((b,i)=>{if(step.regions[i].selected)b.click()})}else if(step.fields){[...form.querySelectorAll("select")].forEach((s,i)=>{s.value=String(step.fields[i].value);s.dispatchEvent(new Event("change",{bubbles:true}))})}else{const radios=[...form.querySelectorAll("input[type=radio]")],index=step.choices.indexOf(step.answer);radios[index].click()}[...form.parentElement.querySelectorAll("button")].find(b=>b.textContent==="Verify reconstruction step").click()})()');
 }
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(S.progress.D772.mixedExamRound.deck[0],false).required'),false);
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(S.progress.D772.mixedExamRound.deck[0],false).awaitingTransfer'),true);
 assert.equal(await ev('JSON.stringify(S.progress.D772.interactiveMastery||{})'),masteryBefore);
 console.log('PASS cross-room second mistake, reload-safe mandatory reconstruction and no independent mastery from guided steps');
 await ev('[...document.querySelectorAll(".majMixedExam button")].find(b=>b.textContent==="Continue to fresh independent practice").click()');
 await waitFor('!!document.querySelector("[data-exam-submit]")');
 const transfer=await ev('S.progress.D772.mixedExamRound.deck[S.progress.D772.mixedExamRound.index]');
 assert.notDeepEqual(transfer.data,current.data,'Transfer must change actual data');
 await ev('(()=>{const q=S.progress.D772.mixedExamRound.deck[S.progress.D772.mixedExamRound.index];[...document.querySelectorAll(".majMixedExam input[type=radio]")].find(i=>i.value===q.answer).click();document.querySelector("[data-exam-submit]").click()})()');
 assert.equal(await ev('MajickLearningContinuity.practiceRecovery(S.progress.D772.mixedExamRound.deck[0],false).awaitingTransfer'),false);
 console.log('PASS fresh independent transfer clears recovery without recycling failed givens');
 await ev('MajickCourseTutor.openLesson("d772-s2-l2",null,"D772")');await waitFor('!!document.querySelector("[data-classroom-tab=turn]")');await ev('document.querySelector("[data-classroom-tab=turn]").click()');
 await waitFor('!!document.querySelector("[data-v3401-q]")');
 await ev('(async()=>{const card=document.querySelector("[data-v3401-q]"),draft=card.querySelector("textarea");draft.value="I compared the category proportions in this question.";draft.dispatchEvent(new Event("input",{bubbles:true}));await MajickCourseTutor.hydrate("D772");if(document.querySelector("[data-v3401-q]")!==card||draft.value!=="I compared the category proportions in this question.")throw Error("Hydration erased the active question or draft")})()');

 await ev('(()=>{const card=document.querySelector("[data-v3401-q]"),q=MajickCourseTutor.officialD772Content({id:"d772-s2-l2"},"D772").practice.find(q=>String(q.id)===card.dataset.v3401Q);if(!q)throw Error("Missing real lesson question");[...card.querySelectorAll("[data-v3401-answer]")].find(b=>Number(b.dataset.v3401Answer)!==Number(q.answer)).click()})()');
 await waitFor('document.querySelectorAll(".v3401Feedback .aetheriaQuestionRepair details").length===8');
 console.log('PASS actual Learn Lab wrong-answer handler uses shared eight-step teaching');
 await ev('startOracleLens();session.current=MajickGeneratedPractice.probabilityCase(0);session.current.section="Section 3 · Probability";render()');await waitFor('!!document.querySelector(".realmLensChoices button")');
 await ev('document.querySelector(".realmLensChoices button").click();[...document.querySelectorAll(".realmOracle [data-answer]")].find(b=>b.dataset.answer!==session.current.answer).click()');
 await waitFor('document.querySelectorAll(".aetheriaQuestionRepair details").length===8');
 const visible=await ev('(()=>{const summary=document.querySelectorAll(".aetheriaQuestionRepair summary")[2];summary.focus();return !!summary.getClientRects().length})()');assert(visible);
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 assert.equal(await ev('document.querySelectorAll(".aetheriaQuestionRepair details")[2].open'),true);
 assert(await ev('!!document.querySelector(".aetheriaQuestionRepair textarea[aria-label]")'));
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 assert(await ev('document.documentElement.scrollWidth<=innerWidth+2'));
 console.log('PASS actual Game Realm handler, keyboard expandable diagnostics, labelled controls and mobile width');

}
run().catch(e=>{console.error('FAIL shared repair browser:',e.stack||e);process.exitCode=1}).finally(async()=>{clearTimeout(deadline);try{ws?.close()}catch{}try{proc?.kill()}catch{}server.closeAllConnections();await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
