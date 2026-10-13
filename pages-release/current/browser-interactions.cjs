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
 assert((await evalPage('document.querySelectorAll(".mjSeTaskSelect option").length'))>=12);
 await action('const s=document.querySelector(".mjSeTaskSelect");s.value="mean";s.dispatchEvent(new Event("change",{bubbles:true}))');
 await waitFor('!!document.querySelector("[data-field=known]")');
 await solveMean('8, 12, 16, 20',56,4,14);
 await solveMean('11, 17, 23, 29, 35',115,5,23);
 await solveMean('9, 13, 17, 21, 25',85,5,17);
 await enterAndCheck({transfer:17});
 const masteryEvidence=await evalPage('({mastery:S.progress.D772.interactiveMastery||{},lastAnswer:S.progress.D772.answers?.slice(-2),feedback:document.querySelector(".mjSeFeedback")?.textContent,phase:document.querySelector(".mjSolutionEngine h3")?.textContent,fields:[...document.querySelectorAll(".mjSolutionEngine [data-field]")].map(x=>x.dataset.field),lesson:document.querySelector(".mjSeTaskSelect")?.value,bridge:!!window.MajickInteractiveMastery})');
 console.log('Browser full-transfer diagnostic:',JSON.stringify(masteryEvidence));
 assert.equal(await evalPage('!!S.progress.D772.interactiveMastery?.["interactive-independent:D772:mean"]'),true,'Unassisted transfer must be recorded as mastery');
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
 console.log('PASS browser: three-level mean worked solutions, independent transfer mastery, course lesson selection, participation XP, save/reload, duplicate prevention and D756 isolation');
})().catch(e=>{console.error('FAIL browser QA:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
