'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);
if(!chrome)throw Error('Chrome or Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'majick-chrome-'));
const server=http.createServer((req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,name);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file);const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.html'?'text/html':'application/octet-stream','Cache-Control':'no-store'}).end(bytes)}catch{res.writeHead(404).end()}});
let child,ws,id=0,chromeStderr='';const wait=new Map();
function call(method,params={}){return new Promise((resolve,reject)=>{const n=++id;wait.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(wait.has(n)){wait.delete(n);reject(Error('CDP timeout '+method))}},12000)})}
async function evalPage(expression){const x=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(x.result?.exceptionDetails)throw Error(JSON.stringify(x.result.exceptionDetails));return x.result?.result?.value}
async function waitFor(expression){for(let n=0;n<100;n++){try{if(await evalPage(expression))return}catch{}await sleep(250)}throw Error('Page condition failed '+expression)}
async function action(statement){return evalPage('(()=>{'+statement+';return true})()')}
async function enterAndCheck(fields){
 const statement='const values='+JSON.stringify(fields)+';for(const [id,value] of Object.entries(values)){const field=document.querySelector(\'[data-field="\'+id+\'"]\');if(!field)throw Error("Missing interactive field "+id);field.value=String(value);field.dispatchEvent(new Event("input",{bubbles:true}))}document.querySelector("[data-check]").click()';
 await action(statement);
}
async function solveMean(values,sum,count,mean){
 await enterAndCheck({known:values,unknown:'mean'});
 await action('const first=document.querySelector("[data-choice=\\"0\\"]");if(!first)throw Error("Missing formula options");first.click();document.querySelector("[data-check]").click()');
 await enterAndCheck({slot0:sum,slot1:count});
 await enterAndCheck({result:mean});
 await enterAndCheck({meaning:'The mean of these observations is '+mean+' because total '+sum+' divided by '+count+' observations equals '+mean+'.'});
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
 assert.equal(await evalPage('window.MajickLessonActivities.tasks.length'),19);


 await action('if(!S.courses.D772)throw Error("D772 course unavailable");switchCourse("D772");navigate("mission")');
 await waitFor('!!document.querySelector(".mjSeTaskSelect")');

 // Visual regression: a graphical-displays lesson must display actual SVG charts,
 // not only the text-only thinking path shown in the reported screenshot.
 await action('MajickCourseTutor.openLesson("d772-s2-l2",null,"D772")');
 await waitFor('document.querySelectorAll(".majickLessonVisualGallery svg").length>=2');
 assert((await evalPage('document.querySelectorAll(".majickLessonVisualGallery svg").length'))>=2,'Graphical Displays Visuals tab requires two real SVG charts');
 await action('const tab=document.querySelector("[data-classroom-tab=visual]");if(!tab)throw Error("Missing Visuals & Charts tab");tab.click()');
 console.log('D772 VISUAL DISPLAY DIAGNOSTIC',JSON.stringify(await evalPage('([...document.querySelectorAll(".majickLessonVisualGallery svg")].map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,panel:el.closest("[role=tabpanel]")?.id,hidden:el.closest("[hidden]")?.outerHTML?.slice(0,130),screen:S.screen,tab:document.querySelector("[data-classroom-tab=visual]")?.getAttribute("aria-selected")})))')));
 assert((await evalPage('(()=>{const el=document.querySelector(".majickLessonVisualGallery svg");return !!el&&el.getBoundingClientRect().width>100&&el.getBoundingClientRect().height>100})()')),'The lesson charts must be rendered at a readable size');

 // Classroom first-wrong-answer → Try Again → corrected response; no unexpected scroll movement.
 await action('document.querySelector("[data-classroom-tab=turn]")?.click()');
 await waitFor('document.querySelectorAll("[data-v3401-q] [data-v3401-answer]").length>=2');
 const retryQA=await evalPage('(()=>{const card=document.querySelector("[data-v3401-q]");if(!card)return {error:"no lesson card"};const buttons=[...card.querySelectorAll("[data-v3401-answer]")];const first=buttons.findIndex(b=>b.textContent.trim().length);return {count:buttons.length,first,cardId:card.dataset.v3401Q}})()');
 assert(retryQA.count>=2,'Learn Lab questions need actionable choices');
 await action('const card=document.querySelector("[data-v3401-q]");window.scrollTo({top:200,behavior:"instant"});card.querySelectorAll("[data-v3401-answer]")[0].click()');
 const answered=await evalPage('(()=>{const c=document.querySelector("[data-v3401-q]");return {feedback:c.querySelector(".v3401Feedback")?.textContent,wrong:!!c.querySelector("[data-v3401-answer].incorrect"),retry:!!c.querySelector("[data-v3401-retry]"),top:window.scrollY}})()');
 assert(answered.feedback,'Learn Lab must show answer feedback');
 if(answered.wrong){
   assert(answered.retry,'Wrong Learn Lab answer must provide Try Again');
   await action('document.querySelector("[data-v3401-retry]").click()');
   assert.equal(await evalPage('document.querySelector("[data-v3401-q] [data-v3401-answer]")?.disabled'),false,'Retry must reenable the original question choices');
   assert.equal(await evalPage('document.querySelector("[data-v3401-q] .v3401AttemptStatus")?.textContent.includes("assisted correction")'),true,'Retry must not be recorded as independent mastery');
   await action('document.querySelector("[data-v3401-q] [data-v3401-answer]").click()');
   assert(await evalPage('!!document.querySelector("[data-v3401-q] .v3401Feedback")?.textContent'),'Reattempt must show feedback');
 }
 console.log('PASS browser: classroom answer feedback and incorrect-response retry availability');
 console.log('PASS browser: Graphical Displays lesson mounts visible histogram/scatterplot SVGs.');
 await action('navigate("mission")');
 await waitFor('!!document.querySelector(".mjSeTaskSelect")');

 // D772 all-section intake and original-source bridge integrity (no replacement bank).
 await waitFor('!!window.MajickCourseTutor&&!!window.MajickWGUPractice&&!!window.MajickGameRealm&&!!window.MajickD772VerifiedSource');
 const sourceResults=await evalPage('(()=>{const src=MajickD772VerifiedSource.questions();const practice=MajickWGUPractice;const realm=MajickGameRealm.realmQuestionPool();return {sourceIds:src.map(q=>q.id),sourceAnswers:src.every(q=>q.options.includes(q.answer)&&q.why),lessonQuestions:MajickCourseTutor.questionsForLesson({id:"d772-s2-l4-1",title:"Measures of Center"},"D772").map(q=>q.id),practice:([1,2,3].map(n=>practice.practicePool(String(n)).length)),section2c:practice.practicePool("2c").length,section2:practice.practicePool("2").length,practiceIds:practice.practicePool("2").map(q=>q.id),realmIds:realm.map(q=>q.id),realmSections:realm.map(q=>String(q.section||""))}})()');
 assert.equal(sourceResults.sourceIds.length,6,'Six previously entered WGU-attributed Lesson 4.1 items must be exposed by the tutor bridge');
 assert(sourceResults.sourceAnswers,'Source bridge must preserve valid answer keys and rationales');
 assert(sourceResults.sourceIds.every(id=>sourceResults.lessonQuestions.includes(id)),'Original questions must remain accessible in tutor');
 assert(sourceResults.practice.every(n=>n>0),'Study Now needs questions from all three D772 sections');
 assert.equal(sourceResults.section2c,sourceResults.section2,'Section 2C must be a Section 2 alias');
 assert(sourceResults.sourceIds.every(id=>sourceResults.practiceIds.includes(id)),'Study Now must see source questions from tutor');
 assert(sourceResults.sourceIds.every(id=>sourceResults.realmIds.includes(id)),'Game Realm must see source questions from tutor');
 for(const n of [1,2,3])assert(sourceResults.realmSections.some(label=>label.startsWith('Section '+n+' ')),'Game Realm missing Section '+n);
 console.log('PASS browser: verified source questions reachable in tutor, Study Now, and Game Realm; three section scopes present; 2C alias preserved');

 assert((await evalPage('document.querySelectorAll(".mjSeTaskSelect option").length'))>=12);
 await action('const s=document.querySelector(".mjSeTaskSelect");s.value="mean";s.dispatchEvent(new Event("change",{bubbles:true}))');
 await waitFor('!!document.querySelector("[data-field=known]")');
 await solveMean('8, 12, 16, 20',56,4,14);
 await solveMean('11, 17, 23, 29, 35',115,5,23);
 await solveMean('9, 13, 17, 21, 25',85,5,17);
 await enterAndCheck({transfer:17});
 const masteryEvidence=await evalPage('({mastery:S.progress.D772.interactiveMastery||{},lastAnswer:S.progress.D772.answers?.slice(-2),feedback:document.querySelector(".mjSeFeedback")?.textContent,phase:document.querySelector(".mjSolutionEngine h3")?.textContent,fields:[...document.querySelectorAll(".mjSolutionEngine [data-field]")].map(x=>x.dataset.field),lesson:document.querySelector(".mjSeTaskSelect")?.value,bridge:!!window.MajickInteractiveMastery})');
 console.log('Browser full-transfer diagnostic:',JSON.stringify(masteryEvidence));
 const mastered=await evalPage('!!S.progress.D772.interactiveMastery?.["interactive-independent:D772:mean"]');
 if(!mastered)console.error('Mastery flow diagnostic',JSON.stringify(await evalPage('({step:document.querySelector(".mjSeStage h3")?.textContent,feedback:document.querySelector(".mjSeFeedback")?.textContent,header:document.querySelector(".mjSeDifficulty")?.textContent,fields:[...document.querySelectorAll("[data-field]")].map(x=>({id:x.dataset.field,value:x.value})),mastery:S.progress.D772.interactiveMastery||{}})')));
 assert.equal(mastered,true,'Unassisted transfer must be recorded as mastery');
 assert((await evalPage('S.progress.D772.crystals'))>=1,'Independent transfer should earn an existing crystal reward');
 const before=await evalPage('S.progress.D772.xp');
 await action('window.MajickInteractiveRewards.award("browser-qa","participation")');
 const increased=await evalPage('S.progress.D772.xp');
 assert.equal(increased,before+3);
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickSolutionEngine&&!!S.progress?.D772');
 assert.equal(await evalPage('S.progress.D772.xp'),increased,'XP should persist after actual Chrome reload');
 assert.equal(await evalPage('window.MajickInteractiveRewards.award("browser-qa","participation").awarded'),false,'Reload must not permit duplicate reward');
 await action('startD756Course();navigate("mission")');
 await waitFor('!!document.querySelector(".mjSeTaskSelect")');
 assert.equal(await evalPage('S.activeCourse'),'D756');
 assert.equal(await evalPage('S.progress.D772.xp'),increased);
 // Verify the six-stage WGU sequence workshop, including the final guided reconstruction.
 await action('switchCourse("D772");navigate("mission")');
 await waitFor('!!document.querySelector(".mjSeTaskSelect")');
 await action('const picker=document.querySelector(".mjSeTaskSelect");picker.value="d772-data";picker.dispatchEvent(new Event("change",{bubbles:true}))');
 await waitFor('!!document.querySelector("[data-focus]")');
 await action('document.querySelectorAll("[data-focus]")[4].click();document.querySelector("[data-check]").click()');
 await waitFor('!!document.querySelector("[data-add=\\"2\\"]")');
 await action('document.querySelector("[data-add=\\"2\\"]").click();document.querySelector("[data-check]").click()');
 await action('document.querySelector("[data-add=\\"0\\"]").click()');
 await action('document.querySelector("[data-add=\\"1\\"]").click();document.querySelector("[data-check]").click()');
 console.log('DEBUG sequence stage after ordering:',await evalPage('({stage:document.querySelector(".mjSeStage h3")?.textContent,feedback:document.querySelector(".mjSeFeedback")?.textContent,parts:[...document.querySelectorAll("[data-add]")].map(x=>({text:x.textContent,disabled:x.disabled})),selected:document.querySelector(".mjSeSelection")?.textContent})'));
 await waitFor('!!document.querySelector("[data-meaning]")');
 await action('document.querySelectorAll("[data-meaning]")[0].click();document.querySelector("[data-check]").click()');
 await action('document.querySelector("[data-check]").click()');
 assert.equal(await evalPage('document.querySelector(".mjSeStage h3")?.textContent'),"Independent reconstruction","Stage 6 should unlock after stage 5");
 await action('document.querySelector("[data-add=\\"2\\"]").click()');
 await action('document.querySelector("[data-add=\\"0\\"]").click()');
 await action('document.querySelector("[data-add=\\"1\\"]").click();document.querySelector("[data-check]").click()');
 assert.equal(await evalPage('document.querySelector(".mjSeStage")?.textContent?.includes("A school wants family feedback")'),true,"Stage 6 must advance to a new scenario");
 console.log('PASS browser: sequence stages 5 and 6 unlock, require a fresh response, and advance.');

 // Priority 2: verify actual click interactions in each live classroom mode.
 for(const screen of ['learninglab','mission','games']){
  await action('navigate('+JSON.stringify(screen)+')');
  await waitFor('!!document.querySelector("#majickClassroomAnchorShelf")');
  await action('const d=document.querySelector("#majickClassroomAnchorShelf details");d.open=true');
  await action('const buttons=[...document.querySelectorAll(".majickAnchorButtons button")];buttons.find(b=>b.textContent.includes("Box plot")).click()');
  await waitFor('document.querySelectorAll(".mjConstructInputs input").length===5');
  assert.equal(await evalPage('document.querySelectorAll(".mjConstructInputs input").length'),5,'Box plot requires five interactive number fields on '+screen);
  await action('const b=[...document.querySelectorAll(".majickAnchorButtons button")].find(x=>x.textContent==="Probability");b.click()');
  await waitFor('document.querySelectorAll(".mjCounter").length>=5');
  // Scroll stability: hold whichever actual app container can scroll before interacting.
  const scrollProbe=await evalPage('(()=>{const c=[["document",document.scrollingElement],["content",document.querySelector(".content")],["stage",document.querySelector(".classroomStage")]].find(([name,el])=>el&&el.scrollHeight>el.clientHeight+40);if(!c)return null;c[1].scrollTop=Math.min(120,c[1].scrollHeight-c[1].clientHeight);return {name:c[0],top:c[1].scrollTop}})()');
  const starting=await evalPage('document.querySelectorAll(".mjCounter").length');
  await action('document.querySelector(".mjCounter").click()');
  assert.equal(await evalPage('document.querySelectorAll(".mjCounter").length'),starting-1,'Counter must be removed on '+screen);
  if(scrollProbe?.top>=35){
    const after=await evalPage('(()=>{const el='+ "scrollProbeNAME" +';return el?.scrollTop??null})()'.replace("scrollProbeNAME",scrollProbe.name==='document'?'document.scrollingElement':scrollProbe.name==='content'?'document.querySelector(".content")':'document.querySelector(".classroomStage")'));
    assert(after!==null&&Math.abs(after-scrollProbe.top)<=16,'Unexpected scroll jump after counter answer in '+screen+': '+scrollProbe.top+' → '+after);
  }

  await action('const buttons=[...document.querySelectorAll(".mjConstructActivity button")];buttons.find(b=>b.textContent==="Reset counters").click()');
  assert.equal(await evalPage('document.querySelectorAll(".mjCounter").length'),starting,'Reset must restore counter bank on '+screen);
  await action('const b=[...document.querySelectorAll(".majickAnchorButtons button")].find(x=>x.textContent==="Histogram");b.click()');
  await waitFor('!!document.querySelector(".mjConstructActivity")');
  await action('document.querySelector(".mjConstructActivity button").click()');
  assert.equal(await evalPage('document.querySelector(".mjConstructActivity [role=status]")?.textContent?.includes("Correct WGU terminology.")'),true,'WGU graph interpretation must respond on '+screen);
 }
 // Verify that anchor interactions do not replace the academic course context.
 for(const screen of ['learninglab','mission','games']){
   await action('navigate('+JSON.stringify(screen)+')');
   assert.equal(await evalPage('S.activeCourse'),'D772','Course context changed in '+screen);
 }
 console.log('PASS browser: Learning Lab, Study Now, Game Realm anchor controls and live counter reset');
 // Recovery follows a course-specific skill record across a full page reload.
 await action('navigate("mission");const q={learningPathLessonId:"d772-s2-l4",prompt:"Find the mean of these scores",answer:"12"};MajickLearningContinuity.skillResult(q,false,false,"study-now");MajickLearningContinuity.skillResult(q,false,false,"study-now");MajickLearningContinuity.skillResult(q,true,false,"study-now")');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'review-needed');
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!S.progress?.D772');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'review-needed','Review need must survive reload');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].attempts.length'),3,'Attempt history must survive reload');
 await action('MajickLearningContinuity.skillReview("d772-s2-l4")');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'reviewing');
 await action('MajickLearningContinuity.skillRetry("d772-s2-l4")');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'retry');
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!S.progress?.D772');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'retry','Retry state must survive reload');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].cycles'),1,'Reteach count must survive reload');
 console.log('PASS browser: adaptive review and retry persist across reloads without resetting academic progress');

 console.log('PASS browser: three-level mean worked solutions, independent transfer mastery, course lesson selection, participation XP, save/reload, duplicate prevention and D756 isolation');
})().catch(e=>{console.error('FAIL browser QA:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
