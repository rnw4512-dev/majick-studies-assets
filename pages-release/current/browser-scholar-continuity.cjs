'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{spawn,spawnSync}=require('node:child_process');
const root=path.resolve(process.argv[2]||'_site'),width=Number(process.env.COMMONS_WIDTH||1366);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(x=>spawnSync('which',[x]).status===0);
if(!chrome)throw Error('Chromium required for actual Phaser certification');
const server=http.createServer((req,res)=>{
 try{
  const file=path.resolve(root,new URL(req.url,'http://localhost').pathname.slice(1)||'sanctuary/index.html');
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  const mime={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.webp':'image/webp','.json':'application/json'};
  const bytes=fs.readFileSync(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(bytes);
 }catch(err){if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}
});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'majick-scholar-continuity-'));let child,ws,n=0;
const pending=new Map();
async function call(method,params={}){const id=++n;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('CDP timeout '+method))}},20000)})}
async function ev(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function until(expr,limit=110){for(let i=0;i<limit;i++){try{if(await ev(expr))return true}catch{}await sleep(250)}throw Error('Sanctuary condition not met: '+expr)}

(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 child=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
 let port;for(let i=0;i<110;i++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}
 assert(port,'Chrome debugging unavailable');
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=e=>{const m=JSON.parse(e.data),q=pending.get(m.id);if(q){pending.delete(m.id);m.error?q.reject(Error(m.error.message)):q.resolve(m)}};
 await call('Runtime.enable');await call('Page.enable');
 await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:width<600});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/index.html'});
 await until('!!window.MajickAtelier?.player&&!!window.MajickScholarCompanion?.refresh&&!!window.S',180);
 await until('window.MajickAtelier.renderAvatar(window.MajickAtelier.player(),true).includes("data-avatar-layer")',180);
 const initial=await ev('(()=>{const p=MajickAtelier.player();p.skin=5;p.hair=1;p.robe=1;p.hairFit={x:7,y:-6,size:12};save();MajickScholarCompanion.refresh(true);return {screen:S.screen,stored:JSON.stringify(p),fitted:MajickAtelier.renderAvatar(p,true).includes("translate:7% -6%;scale:1.12"),count:document.querySelectorAll("#majickScholarCompanion .mscSmall [data-avatar-layer]").length}})()');
 assert(initial.fitted,'Hair fit not reflected in the actual fitted layers');
 assert.equal(initial.count,4,'Scholar companion is missing fitted transparent body, robe, boots or hair layers');
 const rooms=['mission','companions','home'];
 for(const room of rooms){
   await ev('navigate('+JSON.stringify(room)+');MajickScholarCompanion.refresh(true);true');
   const snap=await ev('(()=>{const p=MajickAtelier.player();return {room:S.screen,skin:p.skin,hair:p.hair,robe:p.robe,fit:p.hairFit,dock:!!document.getElementById("majickScholarCompanion"),markup:document.querySelector("#majickScholarCompanion .mscSmall")?.innerHTML||""}})()');
   assert.equal(snap.room,room,'Scholar navigation did not reach '+room);
   assert(snap.dock,'Scholar companion disappeared in '+room);
   assert(snap.markup.includes('translate:7% -6%;scale:1.12'),'Fitted hairstyle lost between rooms in '+room);
   assert.equal(snap.skin,5);assert.equal(snap.hair,1);assert.equal(snap.robe,1);
 }
 await call('Page.reload',{ignoreCache:true});
 await until('!!window.MajickAtelier?.player&&!!window.MajickScholarCompanion?.refresh&&!!window.S',180);
 const restored=await ev('(()=>{const p=MajickAtelier.player();MajickScholarCompanion.refresh(true);return {skin:p.skin,hair:p.hair,robe:p.robe,fit:p.hairFit,markup:document.querySelector("#majickScholarCompanion .mscSmall")?.innerHTML||""}})()');
 assert.equal(restored.skin,5);assert.equal(restored.hair,1);assert.equal(restored.robe,1);
 assert.deepEqual(restored.fit,{x:7,y:-6,size:12},'Saved Scholar hair alignment did not survive browser reload');
 assert(restored.markup.includes('translate:7% -6%;scale:1.12'),'Saved Scholar appearance not present after reload');
 const images=await ev('(()=>[...document.querySelectorAll("#majickScholarCompanion .mscSmall img")].map(x=>({src:x.getAttribute("src"),loaded:x.complete&&x.naturalWidth>0})))()');
 assert(images.length===4&&images.every(x=>x.loaded),'One or more of Scholar layered outfit PNGs did not load');
 console.log('PASS REAL SCHOLAR',JSON.stringify({width,rooms,skin:restored.skin,hair:restored.hair,robe:restored.robe,hairFit:restored.fit,visibleLayers:images.length,transparentAssetLoads:images.every(x=>x.loaded),savedReload:true}));
})().catch(err=>{console.error('FAIL REAL SCHOLAR',err.stack||err);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
