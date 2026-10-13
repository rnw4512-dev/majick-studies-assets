'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);
if(!chrome)throw Error('Chrome or Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'majick-chrome-'));
const server=http.createServer((req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,name);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file);res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript':ext==='.html'?'text/html':'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{res.writeHead(404).end()}});
let child,ws,id=0;const wait=new Map();
function call(method,params={}){return new Promise((resolve,reject)=>{const n=++id;wait.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(wait.has(n)){wait.delete(n);reject(Error('CDP timeout '+method))}},12000)})}
async function evalPage(expression){const x=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(x.exceptionDetails)throw Error(JSON.stringify(x.exceptionDetails));return x.result?.value}
async function waitFor(expression){for(let n=0;n<100;n++){try{if(await evalPage(expression))return}catch{}await sleep(250)}throw Error('Page condition failed '+expression)}
async function action(statement){return evalPage('(()=>{'+statement+';return true})()')}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/index.html';
 child=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,url],{stdio:'ignore'});
 const portFile=path.join(profile,'DevToolsActivePort');let port;
 for(let n=0;n<120;n++){if(fs.existsSync(portFile)){port=+fs.readFileSync(portFile,'utf8').split('\n')[0];break}await sleep(150)}
 if(!port)throw Error('Chrome debugging port missing');
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
 await action('const a=document.querySelector("[data-field=known]"),b=document.querySelector("[data-field=unknown]");a.value="8, 12, 16, 20";a.dispatchEvent(new Event("input"));b.value="mean";b.dispatchEvent(new Event("input"));document.querySelector("[data-check]").click()');
 await waitFor('!!document.querySelector("[data-choice]")');
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
 console.log('PASS browser: course lesson selection, form input, participation XP, save/reload, duplicate prevention, D756 isolation');
})().catch(e=>{console.error('FAIL browser QA:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
