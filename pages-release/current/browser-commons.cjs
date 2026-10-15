'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);if(!chrome)throw Error('Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'maj-commons-'));
const server=http.createServer((req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}});
let proc,ws,id=0,stderr='';const contrastFailures=[];const inflight=new Map();
async function call(method,params={}){const n=++id;return new Promise((resolve,reject)=>{inflight.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(inflight.has(n)){inflight.delete(n);reject(Error('Timed out '+method))}},method==='Page.captureScreenshot'?60000:45000)})}
async function ev(js){let r=await call('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function waitFor(js){for(let n=0;n<100;n++){try{if(await ev(js))return}catch(e){if(/Timed out/.test(e.message))throw e}await sleep(250)}throw Error('Page condition: '+js)}
const deadline=setTimeout(()=>{console.error('Commons audit exceeded 480 seconds');try{proc?.kill()}catch{};server.closeAllConnections();process.exit(1)},process.env.COMMONS_WIDTH?480000:900000);deadline.unref();
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,url],{stdio:['ignore','ignore','pipe']});proc.stderr.on('data',d=>stderr+=String(d).slice(-3000));
 let port;for(let k=0;k<120;k++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}if(!port)throw Error('Chrome start '+stderr.slice(-1500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});ws.onmessage=e=>{const m=JSON.parse(e.data),p=inflight.get(m.id);if(p){inflight.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};await call('Runtime.enable');await call('Page.enable');
 console.log('Commons Chrome connected');
 await waitFor('!!window.MajickCollegiumCommons && !!document.querySelector("#content")');
 await ev('switchCourse("D772");navigate("home");MajickCollegiumCommons.sync()');await waitFor('!!document.querySelector("#majCommonsHub")');
 console.log('Commons D772 Home mounted');
 // Exercise real delayed insertions into a wrong panel and at the Home root.
 await ev(`(()=>{const n=document.createElement('section');n.className='dailyStudyLoop';n.id='commonsDelayedProbe';n.textContent='Delayed daily study with a dorm shortcut';document.querySelector('[data-commons-panel=sanctuary]').append(n)})()`);
 await waitFor(`document.querySelector('#commonsDelayedProbe')?.closest('[data-commons-panel]')?.dataset.commonsPanel==='today'`);
 await ev(`document.querySelector('#commonsDelayedProbe').remove()`);
 await ev(`(()=>{const n=document.createElement('section');n.id='commonsRootProbe';n.textContent='Spaced recall';document.querySelector('#content').append(n)})()`);
 await waitFor(`document.querySelector('#commonsRootProbe')?.closest('[data-commons-panel]')?.dataset.commonsPanel==='review'`);
 await ev(`document.querySelector('#commonsRootProbe').remove()`);
 // A real keyboard event must change both selection and focus.
 await ev(`document.querySelector('[data-commons-tab=overview]').focus()`);
 for(const [key,code,expected] of [['ArrowRight','ArrowRight','today'],['End','End','sanctuary'],['Home','Home','overview'],['ArrowLeft','ArrowLeft','sanctuary']]){
  await call('Input.dispatchKeyEvent',{type:'keyDown',key,code});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code});
  assert.equal(await ev(`document.activeElement?.dataset.commonsTab`),expected,'Keyboard focus '+key);
  assert.equal(await ev(`document.querySelector('[aria-selected=true]')?.dataset.commonsTab`),expected,'Keyboard selection '+key);
 }
 console.log('PASS Commons delayed root/panel hydration and physical keyboard focus');
 const widths=process.env.COMMONS_WIDTH?[Number(process.env.COMMONS_WIDTH)]:[1366,820,390];
 assert(widths.every(w=>[1366,820,390].includes(w)),'Unsupported audit width');
 for(const width of widths){
  await call('Emulation.setDeviceMetricsOverride',{width,height:860,deviceScaleFactor:1,mobile:width<600});
  await sleep(350);
  let baseline=await ev('(()=>{const h=document.querySelector("#majCommonsHub"),t=[...h.querySelectorAll("[data-commons-tab]")],p=[...h.querySelectorAll("[data-commons-panel]")];return {tabs:t.length,panels:p.length,active:p.filter(x=>!x.hidden).length,escaped:[...document.querySelector("#content").children].filter(x=>x!==h&&x.nodeType===1).map(x=>x.className||x.id),scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}})()');
  const placement=await ev(`(()=>{
   const expected={'.v3400MemoryQuest':'review','#v3400DailyLoop':'today','#v3377CampusDoors':'overview','.v3327PortalHero':'overview','.v3327StudentRecord':'overview','.v3327AcademicHall':'today','.v3327GuardianHall':'guardians','.v3317HomeSanctuary':'sanctuary','#mjPreassessmentReview':'review','#mjAdaptiveMastery':'review'};
   return Object.entries(expected).flatMap(([selector,tab])=>[...document.querySelectorAll(selector)].map(n=>({selector,expected:tab,actual:n.closest('[data-commons-panel]')?.dataset.commonsPanel})));
  })()`);
  assert(placement.some(x=>x.selector==='#mjPreassessmentReview'),'D772 preassessment must render');
  assert(placement.some(x=>x.selector==='#mjAdaptiveMastery'),'D772 adaptive mastery must render');
  for(const item of placement)assert.equal(item.actual,item.expected,'Misplaced Home component '+item.selector);
  assert.equal(baseline.tabs,5);assert.equal(baseline.panels,5);assert.equal(baseline.active,1);assert.equal(baseline.escaped.length,0,'Home content escaped Commons: '+JSON.stringify(baseline.escaped));assert(baseline.scrollWidth<=baseline.clientWidth+2,'Horizontal overflow width '+width);
  for(const tab of ['overview','today','review','guardians','sanctuary']){
   await ev('MajickCollegiumCommons.select('+JSON.stringify(tab)+')');
   let snapshot=await ev('(()=>{const h=document.querySelector("#majCommonsHub"),a=[...h.querySelectorAll("[data-commons-panel]")].filter(x=>!x.hidden);return {panel:a[0]?.dataset.commonsPanel,count:a.length,selected:h.querySelector("[aria-selected=true]")?.dataset.commonsTab,escaped:[...document.querySelector("#content").children].filter(x=>x!==h&&x.nodeType===1).length}})()');
   const audit=await require('./commons-contrast.cjs')({call,ev,tab,width,out:process.env.COMMONS_QA_DIR||'commons-qa'});
   contrastFailures.push(...audit.failures.map(f=>({...f,width,tab})));
   if(tab==='overview'&&width===1366){await ev('document.querySelector(".majCommonsRecordShelf").open=true');const recordAudit=await require('./commons-contrast.cjs')({call,ev,tab:'student-record',width,out:'commons-qa'});contrastFailures.push(...recordAudit.failures);await ev('document.querySelector(".majCommonsRecordShelf").open=false')}
   assert.equal(snapshot.count,1);assert.equal(snapshot.panel,tab);assert.equal(snapshot.selected,tab);assert.equal(snapshot.escaped,0);
   assert(await ev('document.documentElement.scrollWidth<=innerWidth+2'),'Horizontal overflow in '+tab+' at '+width);
  }
  await ev('document.querySelector("[data-commons-next]").click()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'overview');
  await ev('document.querySelector("[data-commons-previous]").click()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'sanctuary');

 }
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector("#majCommonsHub")');await waitFor('document.querySelector("[aria-selected=true]")?.dataset.commonsTab==="sanctuary"');
 await ev('MajickCollegiumCommons.select("review")');await ev('MajickCollegiumCommons.sync()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'review');
 if(!process.env.COMMONS_WIDTH||process.env.COMMONS_WIDTH==='1366'){await call('Emulation.setDeviceMetricsOverride',{width:1366,height:860,deviceScaleFactor:1,mobile:false});await require('./commons-control-states.cjs')({ev,call});await require('./commons-interactions.cjs')({ev,waitFor,call,sleep})}
 assert.equal(contrastFailures.length,0,'Rendered Commons contrast failures: '+JSON.stringify(contrastFailures));
 console.log('PASS Commons actual browser audit: 1366/820/390 widths, five tabs, no escaped nodes, Next/Previous, persistence after reload');
}
run().catch(e=>{console.error('FAIL Commons browser:',e.stack||e);process.exitCode=1}).finally(async()=>{clearTimeout(deadline);try{ws?.close()}catch{}try{proc?.kill()}catch{}server.closeAllConnections();await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
