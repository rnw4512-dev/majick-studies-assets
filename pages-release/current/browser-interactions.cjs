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
 await waitFor('!!document.querySelector("#mjStudyReasoning .mjSolutionEngine")');

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
 const retryQA=await evalPage('(()=>{const card=document.querySelector("[data-v3401-q]");if(!card)return {error:"no lesson card"};const buttons=[...card.querySelectorAll("[data-v3401-answer]")];const qid=card.dataset.v3401Q;const lesson=MajickCourseTutor.officialD772Content({id:"d772-s2-l2"},"D772");const question=(lesson?.practice||[]).find(q=>String(q.id)===String(qid));if(!question)return {error:"source question not found",qid};const correct=Number(question.answer);return {count:buttons.length,wrongIndex:buttons.findIndex(b=>Number(b.dataset.v3401Answer)!==correct),correctIndex:correct,qid}})()');
 assert(!retryQA.error,JSON.stringify(retryQA));
 assert(retryQA.count>=2&&retryQA.wrongIndex>=0&&retryQA.correctIndex>=0,'Learn Lab requires a known wrong answer and known correct answer');
 await action('const card=document.querySelector("[data-v3401-q]");window.scrollTo({top:200,behavior:"instant"});card.querySelectorAll("[data-v3401-answer]")['+retryQA.wrongIndex+'].click()');
 const answered=await evalPage('(()=>{const c=document.querySelector("[data-v3401-q]");return {feedback:c.querySelector(".v3401Feedback")?.textContent,wrong:!!c.querySelector("[data-v3401-answer].incorrect"),retry:!!c.querySelector("[data-v3401-retry]"),top:window.scrollY,allDisabled:[...c.querySelectorAll("[data-v3401-answer]")].every(x=>x.disabled)}})()');
 assert(answered.feedback&&answered.wrong&&answered.retry&&answered.allDisabled,'Wrong Learn Lab answer must show feedback, disable answers, and provide Try Again');
 await action('document.querySelector("[data-v3401-retry]").click()');
 assert.equal(await evalPage('[...document.querySelectorAll("[data-v3401-q] [data-v3401-answer]")].every(b=>!b.disabled)'),true,'Retry must reenable every question choice');
 assert.equal(await evalPage('document.querySelector("[data-v3401-q] .v3401AttemptStatus")?.textContent.includes("assisted correction")'),true,'Retry must not be recorded as independent mastery');
 await action('document.querySelectorAll("[data-v3401-q] [data-v3401-answer]")['+retryQA.correctIndex+'].click()');
 const corrected=await evalPage('(()=>{const c=document.querySelector("[data-v3401-q]");return {feedback:c.querySelector(".v3401Feedback")?.textContent,status:c.querySelector(".v3401AttemptStatus")?.textContent,correct:!!c.querySelector("[data-v3401-answer].correct")}})()');
 assert(corrected.correct&&corrected.feedback&&/guided recovery|not independent mastery/i.test(corrected.status),'Corrected retry must give accurate feedback without independent mastery');
 console.log('PASS browser: forced incorrect response, Try Again, enabled choices, correct recovery, and no automatic mastery');

 // Theme contrast regression: instructional parchment and disabled controls must remain legible.
 const contrastQA=await evalPage('(()=>{const panel=document.createElement("section");panel.className="v342Repair";panel.style.cssText="padding:12px";panel.innerHTML="<p>Explain your reasoning using the evidence.</p><button disabled data-repair-transfer>Try a different question</button>";document.body.append(panel);const text=panel.querySelector("p"),button=panel.querySelector("button");const rgba=x=>(x.match(/[\\d.]+/g)||[]).map(Number);const luminance=x=>{const n=rgba(x).slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*n[0]+.7152*n[1]+.0722*n[2]};const contrast=(a,b)=>{let x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};const result={parchment:contrast(getComputedStyle(text).color,getComputedStyle(panel).backgroundColor),disabledButton:contrast(getComputedStyle(button).color,getComputedStyle(button).backgroundColor),textColor:getComputedStyle(text).color,panelBackground:getComputedStyle(panel).backgroundColor,buttonColor:getComputedStyle(button).color,buttonBackground:getComputedStyle(button).backgroundColor};panel.remove();return result})()');
 console.log('PARCHMENT COMPUTED CONTRAST DIAGNOSTIC',JSON.stringify(contrastQA));
 assert(contrastQA.parchment>=4.5,'Instructional text on parchment fails WCAG AA contrast');
 assert(contrastQA.disabledButton>=4.5,'Disabled instructional button is illegible');
 console.log('PASS browser: repair parchment text and disabled action pass 4.5:1 contrast',JSON.stringify(contrastQA));
 console.log('PASS browser: Graphical Displays lesson mounts visible histogram/scatterplot SVGs.');
 await action('navigate("mission")');
 await waitFor('!!document.querySelector("#mjStudyReasoning .mjSolutionEngine")');

 // D772 all-section intake and original-source bridge integrity (no replacement bank).
 await waitFor('!!window.MajickCourseTutor&&!!window.MajickWGUPractice&&!!window.MajickGameRealm&&!!window.MajickD772VerifiedSource');
 const sourceResults=await evalPage('(()=>{const src=MajickD772VerifiedSource.questions();const practice=MajickWGUPractice;const realm=MajickGameRealm.realmQuestionPool();return {sourceIds:src.map(q=>q.id),sourceAnswers:src.every(q=>q.options.includes(q.answer)&&q.why),lessonQuestions:MajickCourseTutor.questionsForLesson({id:"d772-s2-l4-1",title:"Measures of Center"},"D772").map(q=>q.id),practice:([1,2,3].map(n=>practice.practicePool(String(n)).length)),section2c:practice.practicePool("2c").length,section2:practice.practicePool("2").length,practiceIds:practice.practicePool("2").map(q=>q.id),realmIds:realm.map(q=>q.id),realmSections:realm.map(q=>String(q.section||""))}})()');
 const aligned=await evalPage('(()=>{const q=MajickD772PreassessmentReview.practiceQuestions();const study=[1,2,3].flatMap(n=>MajickWGUPractice.practicePool(String(n)));const realm=MajickGameRealm.realmQuestionPool();return q.map(x=>({id:x.id,four:x.options.length===4,study:study.some(y=>y.id===x.id),realm:realm.some(y=>y.id===x.id),tutor:MajickCourseTutor.questionsForLesson({id:x.lessonId,title:"D772 practice"},"D772").some(y=>y.id===x.id)}))})()');
 assert.equal(aligned.length,30);
 for(const q of aligned)assert(q.four&&q.study&&q.realm&&q.tutor,'Four-choice shared practice missing from a learning room: '+JSON.stringify(q));
 console.log('PASS D772 language: all 30 four-choice supplements available in Learn Lab, Study Now and Game Realm');
 assert.equal(sourceResults.sourceIds.length,6,'Six previously entered WGU-attributed Lesson 4.1 items must be exposed by the tutor bridge');
 assert(sourceResults.sourceAnswers,'Source bridge must preserve valid answer keys and rationales');
 assert(sourceResults.sourceIds.every(id=>sourceResults.lessonQuestions.includes(id)),'Original questions must remain accessible in tutor');
 assert(sourceResults.practice.every(n=>n>0),'Study Now needs questions from all three D772 sections');
 assert.equal(sourceResults.section2c,sourceResults.section2,'Section 2C must be a Section 2 alias');
 assert(sourceResults.sourceIds.every(id=>sourceResults.practiceIds.includes(id)),'Study Now must see source questions from tutor');
 assert(sourceResults.sourceIds.every(id=>sourceResults.realmIds.includes(id)),'Game Realm must see source questions from tutor');
 for(const n of [1,2,3])assert(sourceResults.realmSections.some(label=>label.startsWith('Section '+n+' ')),'Game Realm missing Section '+n);
 console.log('PASS browser: verified source questions reachable in tutor, Study Now, and Game Realm; three section scopes present; 2C alias preserved');

 assert((await evalPage('!!document.querySelector("[data-study-view=reasoning]")')), 'Reasoning Workshop must share a tabbed Study Realm panel');
 await action('document.querySelector("[data-study-view=reasoning]").click()');
 let meanFound=false;
 for(let i=0;i<35;i++){
  if(await evalPage('document.querySelector("#mjStudyReasoning .mjSolutionEngine")?.dataset.selectedTask==="mean"')){meanFound=true;break}
  await action('const b=document.querySelector(".mjSeMixNext");if(!b)throw Error("Missing next mixed OA skill");b.click()');
 }
 assert(meanFound,'Mixed section OA queue must include existing mean reasoning task');
 await waitFor('!!document.querySelector("#mjStudyReasoning [data-field=known]")');
 await solveMean('8, 12, 16, 20',56,4,14);
 await solveMean('11, 17, 23, 29, 35',115,5,23);
 await solveMean('9, 13, 17, 21, 25',85,5,17);
 await enterAndCheck({transfer:17});
 const masteryEvidence=await evalPage('({mastery:S.progress.D772.interactiveMastery||{},lastAnswer:S.progress.D772.answers?.slice(-2),feedback:document.querySelector(".mjSeFeedback")?.textContent,phase:document.querySelector(".mjSolutionEngine h3")?.textContent,fields:[...document.querySelectorAll(".mjSolutionEngine [data-field]")].map(x=>x.dataset.field),lesson:document.querySelector(".mjSolutionEngine")?.dataset.selectedTask,bridge:!!window.MajickInteractiveMastery})');
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
 await waitFor('!!document.querySelector("#mjStudyReasoning .mjSolutionEngine")');
 assert.equal(await evalPage('S.activeCourse'),'D756');
 assert.equal(await evalPage('S.progress.D772.xp'),increased);
 // Verify the six-stage WGU sequence workshop, including the final guided reconstruction.
 await action('switchCourse("D772");navigate("mission")');
 await waitFor('!!document.querySelector("#mjStudyReasoning .mjSolutionEngine")');
 await action('document.querySelector("[data-study-view=reasoning]")?.click()');
 let sequenceFound=false;
 for(let i=0;i<35;i++){
   if(await evalPage('document.querySelector("#mjStudyReasoning .mjSolutionEngine")?.dataset.selectedTask==="d772-data"')){sequenceFound=true;break}
   await action('const next=document.querySelector(".mjSeMixNext");if(!next)throw Error("Mixed OA next control missing");next.click()');
 }
 assert(sequenceFound,'D772 Section 1 evidence sequence should remain in the mixed OA bank');
 await waitFor('!!document.querySelector("[data-focus]")');
 const caseData=await evalPage('(()=>{const task=MajickLessonActivities.tasks.find(x=>x.id==="d772-data");return task.cases.find(c=>document.querySelector(".mjSeStage")?.textContent.includes(c.prompt))||task.cases[0]})()');
 const focus=/surveys only|only reaches|only staff|only families|one school|evening event|downtown station|gym website|volunteer/i.test(caseData.prompt)?'Selection bias':'Association is not causation';
 await action('const btn=[...document.querySelectorAll("[data-focus]")].find(x=>x.textContent.trim()==='+JSON.stringify(focus)+');if(!btn)throw Error("Missing focus");btn.click();document.querySelector("[data-check]").click()');
 await waitFor('!!document.querySelector("[data-add]")');
 await action('document.querySelectorAll("[data-add]")['+caseData.correct[0]+'].click();document.querySelector("[data-check]").click()');
 for(const part of caseData.correct)await action('document.querySelectorAll("[data-add]")['+part+'].click()');
 await action('document.querySelector("[data-check]").click()');
 const stageDiagnostic=await evalPage('({title:document.querySelector(".mjSeStage h3")?.textContent,feedback:document.querySelector(".mjSeFeedback")?.textContent,scenario:document.querySelector(".mjSeStage")?.textContent?.slice(0,600),selectedTask:document.querySelector(".mjSolutionEngine")?.dataset.selectedTask})');
 console.log('SEQUENCE STAGE AFTER THIRD CHECK',JSON.stringify({caseData,stageDiagnostic}));
 await waitFor('!!document.querySelector("[data-meaning]")');
 const meaning=/observational|caused|causation|correlation|association/i.test(caseData.prompt)?'An observational study can show association':'The target population and sampled group differ';
 await action('const btn=[...document.querySelectorAll("[data-meaning]")].find(x=>x.textContent.includes('+JSON.stringify(meaning)+'));if(!btn)throw Error("Missing rationale");btn.click();document.querySelector("[data-check]").click()');
 await action('document.querySelector("[data-check]").click()');
 await waitFor('document.querySelector(".mjSeStage h3")?.textContent==="Independent reconstruction"');
 for(const part of caseData.correct)await action('document.querySelectorAll("[data-add]")['+part+'].click()');
 await action('document.querySelector("[data-check]").click()');
 assert(await evalPage('document.querySelector(".mjSeStage")?.textContent?.includes("A school wants family feedback")||document.querySelector(".mjSeStage")?.textContent?.includes("Guided reconstruction completed")'),'Sequence should advance after verified reconstruction');

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
    const scrollElementExpr=scrollProbe.name==='document'?'document.scrollingElement':scrollProbe.name==='content'?'document.querySelector(".content")':'document.querySelector(".classroomStage")';
    const after=await evalPage('(()=>{const el='+scrollElementExpr+';return el?.scrollTop??null})()');
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
 await action('navigate("mission")');
 await waitFor('!!document.querySelector(".v3333Scope button[onclick*=skillReview]")');
 await action('const b=document.querySelector(".v3333Scope button[onclick*=skillReview]");if(typeof b.onclick!=="function")throw Error("Malformed review button handler");b.click()');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'reviewing');
 await action('navigate("mission")');
 await waitFor('!!document.querySelector(".v3333Scope button[onclick*=startSkillRetry]")');
 await action('const b=document.querySelector(".v3333Scope button[onclick*=startSkillRetry]");if(typeof b.onclick!=="function")throw Error("Malformed retry button handler");b.click()');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'retry');
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!S.progress?.D772');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].status'),'retry','Retry state must survive reload');
 assert.equal(await evalPage('S.progress.D772.adaptiveSkills["d772-s2-l4"].cycles'),1,'Reteach count must survive reload');
 console.log('PASS browser: adaptive review and retry persist across reloads without resetting academic progress');


 // Phase 1 browser coverage expansion: rendered controls, contrast and saved state.
 // This is deliberately scoped to observed app screens, not a claim of universal WCAG conformance.
 const phase1={screens:[],state:null};
 for(const viewport of [{width:390,height:844},{width:1365,height:900}]){
   await call('Emulation.setDeviceMetricsOverride',{width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.width<500});
   for(const screen of ['learninglab','mission','games']){
     await action('navigate('+JSON.stringify(screen)+')');
     await sleep(180);
     const cssDiagnostic=await evalPage('(()=>{const link=[...document.styleSheets].filter(x=>/readability-guard/.test(x.href||""));const a=document.querySelector(".v3333Scope button"),b=document.querySelector("button.realmTrialCard"),c=document.querySelector(".familiarPortrait .v3313Stage");const row=e=>e?{outer:e.outerHTML.slice(0,90),bg:getComputedStyle(e).backgroundColor,fg:getComputedStyle(e).color}:null;return {styles:link.map(x=>({href:x.href,rules:(()=>{try{return x.cssRules.length}catch(e){return e.message}})()})),study:row(a),realm:row(b),guardian:row(c)}})()');console.log('CSS RENDER LOADING DIAGNOSTIC',JSON.stringify({viewport:viewport.width,screen,cssDiagnostic}));
     const sample=await evalPage('(()=>{const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"};const rgba=c=>{const m=c.match(/rgba?\\(([^)]+)\\)/);return m?m[1].split(",").map(Number):null};const lum=rgb=>{const v=rgb.slice(0,3).map(x=>{x/=255;return x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4});return .2126*v[0]+.7152*v[1]+.0722*v[2]};const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};const control=[...document.querySelectorAll("button,input,select,textarea,a[href],[role=button]")].filter(vis);const unnamed=control.filter(e=>!(e.getAttribute("aria-label")||e.getAttribute("aria-labelledby")||e.getAttribute("title")||e.textContent||e.value||"").trim()).slice(0,15).map(e=>e.outerHTML.slice(0,160));const bad=[];const candidates=[...document.querySelectorAll("p,label,button,small,span,li,svg text")].filter(vis).slice(0,1300);for(const e of candidates){if(!e.textContent.trim()||e.children.length>2)continue;const cs=getComputedStyle(e),fg=rgba(cs.color);let bg=null,n=e,paint="";while(n&&!bg){const style=getComputedStyle(n);paint+=" "+style.backgroundImage;const a=rgba(style.backgroundColor);if(a&&a[3]!==0)bg=a;n=n.parentElement}if(!bg||!fg||fg[3]===0)continue;const r=ratio(fg,bg),size=parseFloat(cs.fontSize),large=size>=24||(size>=18.66&&parseInt(cs.fontWeight)>=700);if(r<(large?3:4.5)){bad.push({tag:e.tagName,text:e.textContent.trim().slice(0,45),ratio:+r.toFixed(2),size,classes:String(e.className||"").slice(0,90),parentClass:String(e.parentElement?.className||"").slice(0,90),parentBackground:getComputedStyle(e.parentElement||e).backgroundImage.slice(0,100),gradientOrImage:/gradient\\(|url\\(/i.test(paint),foreground:cs.color,background:bg.join(","),ancestors:(()=>{const out=[];let n=e;for(let i=0;n&&i<5;i++,n=n.parentElement)out.push(n.tagName+"."+String(n.className||"").slice(0,55));return out.join(" > ")})()})}}const tooSmall=[...document.querySelectorAll("svg text")].filter(vis).filter(e=>parseFloat(getComputedStyle(e).fontSize)<11).slice(0,12).map(e=>e.textContent.trim().slice(0,30));return {screen:S.screen,course:S.activeCourse,controls:control.length,unnamed,badContrast:bad.slice(0,20),badContrastCount:bad.length,tinySVG:tooSmall}})()');
     phase1.screens.push({viewport,requested:screen,...sample});
   }
 }
 await call('Emulation.clearDeviceMetricsOverride');
 console.log('PHASE1 RENDERED ACCESSIBILITY AUDIT',JSON.stringify(phase1.screens));
 const unnamed=phase1.screens.flatMap(x=>x.unnamed.map(y=>({screen:x.screen,viewport:x.viewport.width,html:y})));
 const contrast=phase1.screens.flatMap(x=>x.badContrast.map(y=>({...y,screen:x.screen,viewport:x.viewport.width})));
 const ambiguousContrast=contrast.filter(x=>x.gradientOrImage);
 const solidContrast=contrast.filter(x=>!x.gradientOrImage);
 console.log('PHASE1 ACCESSIBILITY FINDINGS',JSON.stringify({unnamed:unnamed.slice(0,8),contrast:contrast.slice(0,20),totalContrast:contrast.length,solidContrast:solidContrast.length,requiresVisualReview:ambiguousContrast.length}));
 // Compare the actual serialized academic/world records through a fresh browser reload.
 await sleep(350);
 const phase1Before=await evalPage('JSON.stringify({courses:S.courses,progress:S.progress,majickAccount:S.majickAccount,legacy:S.legacy})');
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!S.courses&&!!S.progress');
 await sleep(500);
 const phase1After=await evalPage('JSON.stringify({courses:S.courses,progress:S.progress,majickAccount:S.majickAccount,legacy:S.legacy})');
 const savedBefore=JSON.parse(phase1Before),savedAfter=JSON.parse(phase1After);
 const diffs=[];
 for(const key of Object.keys(savedBefore))if(JSON.stringify(savedBefore[key])!==JSON.stringify(savedAfter[key]))diffs.push(key);
 const accountKeys=[...new Set([...Object.keys(savedBefore.majickAccount||{}),...Object.keys(savedAfter.majickAccount||{})])];
 const accountChanges=accountKeys.filter(k=>JSON.stringify(savedBefore.majickAccount?.[k])!==JSON.stringify(savedAfter.majickAccount?.[k])).map(k=>({key:k,before:JSON.stringify(savedBefore.majickAccount?.[k])?.slice(0,240),after:JSON.stringify(savedAfter.majickAccount?.[k])?.slice(0,240)}));
 const differentPaths=[];function walk(a,b,p,depth){if(differentPaths.length>=30||depth>8)return;if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k,depth+1)}else differentPaths.push({path:p,before:JSON.stringify(a)?.slice(0,75),after:JSON.stringify(b)?.slice(0,75)})}
 walk(savedBefore.majickAccount,savedAfter.majickAccount,'majickAccount',0);
 for(const key of ['courses','progress','legacy'])if(JSON.stringify(savedBefore[key])!==JSON.stringify(savedAfter[key]))walk(savedBefore[key],savedAfter[key],key,0);
 console.log('PHASE1 SAVE RELOAD COMPARISON',JSON.stringify({fields:Object.keys(savedBefore),different:diffs,accountChanges,exactChanges:differentPaths}));
 assert.equal(diffs.length,0,'Reload changed learner academic/world state: '+diffs.join(', '));
 console.log('PASS browser: full core state JSON equivalence after reload');
 assert.equal(unnamed.length,0,'Visible controls without accessible names: '+JSON.stringify(unnamed.slice(0,8)));
 assert.equal(solidContrast.length,0,'Computed contrast below WCAG AA on solid surfaces: '+JSON.stringify(solidContrast.slice(0,12)));
 console.log('UNVERIFIED GRADIENT/IMAGE CONTRAST',JSON.stringify({count:ambiguousContrast.length,samples:ambiguousContrast.slice(0,20)}));
 console.log('PASS browser: sampled mobile/desktop accessibility contrast checks');

 console.log('PASS browser: three-level mean worked solutions, independent transfer mastery, course lesson selection, participation XP, save/reload, duplicate prevention and D756 isolation');
 await require('./parchment-contrast.cjs')({call,evalPage,action,waitFor,sleep});
})().catch(e=>{console.error('FAIL browser QA:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
