'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);if(!chrome)throw Error('Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'maj-commons-'));
const server=http.createServer((req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}});
let proc,ws,id=0,stderr='';const inflight=new Map();
async function call(method,params={}){const n=++id;return new Promise((resolve,reject)=>{inflight.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(inflight.has(n)){inflight.delete(n);reject(Error('Timed out '+method))}},14000)})}
async function ev(js){let r=await call('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function waitFor(js){for(let n=0;n<100;n++){try{if(await ev(js))return}catch{}await sleep(250)}throw Error('Page condition: '+js)}
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,url],{stdio:['ignore','ignore','pipe']});proc.stderr.on('data',d=>stderr+=String(d).slice(-3000));
 let port;for(let k=0;k<120;k++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}if(!port)throw Error('Chrome start '+stderr.slice(-1500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});ws.onmessage=e=>{const m=JSON.parse(e.data),p=inflight.get(m.id);if(p){inflight.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};await call('Runtime.enable');await call('Page.enable');
 await waitFor('!!window.MajickCollegiumCommons && !!document.querySelector("#content")');
 await ev('navigate("home");MajickCollegiumCommons.sync()');await waitFor('!!document.querySelector("#majCommonsHub")');
 for(const width of [1366,820,390]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:860,deviceScaleFactor:1,mobile:width<600});
  await sleep(350);
  let baseline=await ev('(()=>{const h=document.querySelector("#majCommonsHub"),t=[...h.querySelectorAll("[data-commons-tab]")],p=[...h.querySelectorAll("[data-commons-panel]")];return {tabs:t.length,panels:p.length,active:p.filter(x=>!x.hidden).length,escaped:[...document.querySelector("#content").children].filter(x=>x!==h&&x.nodeType===1).map(x=>x.className||x.id),scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}})()');
  assert.equal(baseline.tabs,5);assert.equal(baseline.panels,5);assert.equal(baseline.active,1);assert.equal(baseline.escaped.length,0,'Home content escaped Commons: '+JSON.stringify(baseline.escaped));assert(baseline.scrollWidth<=baseline.clientWidth+2,'Horizontal overflow width '+width);
  for(const tab of ['overview','today','review','guardians','sanctuary']){
   await ev('MajickCollegiumCommons.select('+JSON.stringify(tab)+')');
   let snapshot=await ev('(()=>{const h=document.querySelector("#majCommonsHub"),a=[...h.querySelectorAll("[data-commons-panel]")].filter(x=>!x.hidden);return {panel:a[0]?.dataset.commonsPanel,count:a.length,selected:h.querySelector("[aria-selected=true]")?.dataset.commonsTab,escaped:[...document.querySelector("#content").children].filter(x=>x!==h&&x.nodeType===1).length}})()');
   assert.equal(snapshot.count,1);assert.equal(snapshot.panel,tab);assert.equal(snapshot.selected,tab);assert.equal(snapshot.escaped,0);
  }
  await ev('document.querySelector("[data-commons-next]").click()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'overview');
  await ev('document.querySelector("[data-commons-previous]").click()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'sanctuary');
  const contrast=await ev('(()=>{const h=document.querySelector("#majCommonsHub"),panel=h.querySelector("[data-commons-panel]:not([hidden])");function rgb(s){let x=s.match(/[\d.]+/g);return x?x.slice(0,3).map(Number):null}function lum(v){return v.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0)}let failures=[];for(const e of panel.querySelectorAll("p,label,h2,h3,h4,h5,button")){const st=getComputedStyle(e);if(!e.getClientRects().length||st.visibility==="hidden"||+st.opacity<1)continue;let bg=e;while(bg&&getComputedStyle(bg).backgroundColor==="rgba(0, 0, 0, 0)")bg=bg.parentElement;const a=rgb(st.color),b=bg&&rgb(getComputedStyle(bg).backgroundColor);if(a&&b){let x=lum(a),y=lum(b),ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);if(ratio<4.5)failures.push({text:e.textContent.slice(0,42),ratio:+ratio.toFixed(2)})}}return failures.slice(0,12)})()');
  console.log('Commons '+width+'px: tabs, panel ownership, navigation and layout PASS; solid-surface contrast candidates '+JSON.stringify(contrast));
 }
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector("#majCommonsHub")');await waitFor('document.querySelector("[aria-selected=true]")?.dataset.commonsTab==="sanctuary"');
 await ev('MajickCollegiumCommons.select("review")');await ev('MajickCollegiumCommons.sync()');assert.equal(await ev('document.querySelector("[aria-selected=true]")?.dataset.commonsTab'),'review');
 console.log('PASS Commons actual browser audit: 1366/820/390 widths, five tabs, no escaped nodes, Next/Previous, persistence after reload');
}
run().catch(e=>{console.error('FAIL Commons browser:',e.stack||e);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{proc?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
