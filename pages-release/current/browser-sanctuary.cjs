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
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'majick-real-sanctuary-'));let child,ws,n=0;
const pending=new Map();
async function call(method,params={}){const id=++n;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('CDP timeout '+method))}},20000)})}
async function ev(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function until(expr,limit=110){for(let i=0;i<limit;i++){try{if(await ev(expr))return true}catch{}await sleep(250)}throw Error('Sanctuary condition not met: '+expr)}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 child=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-software-rasterizer','--enable-webgl','--remote-allow-origins=*','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
 let port;for(let i=0;i<110;i++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}assert(port,'Chrome debugging unavailable');
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=e=>{const m=JSON.parse(e.data),q=pending.get(m.id);if(q){pending.delete(m.id);m.error?q.reject(Error(m.error.message)):q.resolve(m)}};
 await call('Runtime.enable');await call('Page.enable');
 await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:width<600});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/sanctuary/index.html'});
 await until("!!window.majickPhaserGame?.scene?.getScene?.('Game')?.sys?.isActive?.()",180);
 const kinds=['luna','ember','nova','mallow','vesper','briar','zephyr','prism','rook','solara'];
 const setup=await ev('(()=>{const s=majickPhaserGame.scene.getScene("Game");const types='+JSON.stringify(kinds)+';const names=["Velora","Cascade","Solstice","Aurelia","Vesper","Briar","Zephyr","Prism","Rook","Solara"];s.v3317CareState={roster:types.map((type,i)=>({petId:"qa-"+type,type,name:names[i],level:6,stageSlug:"guardian",bond:20,mood:{label:"curious"}}))};s.v3348SyncRoster();return {active:s.sys.isActive(),count:s.v3317CareState.roster.length}})()');
 assert.equal(setup.count,10);
 await until('(()=>{const s=majickPhaserGame.scene.getScene("Game");return ["vesper","briar","zephyr","prism","rook","solara"].every(t=>s.v3348Sprites?.["qa-"+t]?.active&&s.v3348Sprites["qa-"+t].texture?.key.includes("-guardian-room"))})()',180);
 const initial=await ev('(()=>{const s=majickPhaserGame.scene.getScene("Game");return s.v3317CareState.roster.map(g=>{const p=s.v3348PetById?.[g.petId];return {type:g.type,key:p?.texture?.key||"",x:p?.x??null,y:p?.y??null,interactive:!!p?.input,active:!!p?.active}})})()');
 assert.equal(initial.length,10);assert(initial.every(p=>p.active),'Not every Guardian has an active Phaser sprite');
 assert(initial.slice(4).every(p=>p.key.includes('-guardian-room')),'Six new Guardians missing stage-correct sprites');
 await sleep(1500);
 const second=await ev('(()=>{const s=majickPhaserGame.scene.getScene("Game");return s.v3317CareState.roster.map(g=>{const p=s.v3348PetById?.[g.petId];return {type:g.type,x:p?.x??null,y:p?.y??null,interactive:!!p?.input,key:p?.texture?.key||""}})})()');
 assert(second.slice(4).every((p,i)=>p.interactive),'Six Guardian care targets are not interactive');
 assert(second.slice(4).some((p,i)=>Math.abs(p.x-initial[i+4].x)>1||Math.abs(p.y-initial[i+4].y)>1),'None of six Guardians moved in actual Phaser time');
 // For original four, verify that the intended two painted walking frames both load.
 const frame=await ev('(()=>{const s=majickPhaserGame.scene.getScene("Game");return ["luna","ember","nova","mallow"].map(t=>({type:t,frames:s["v3317Walk_"+t]?.getData?.("motionFrames")||[],visible:!!s[t]?.active}))})()');
 assert(frame.every(x=>x.visible),'One of the protected four original Phaser bodies is missing');
 assert(frame.every(x=>x.frames.length===2&&x.frames[0]!==x.frames[1]),'Original four must have distinct painted walk frames, not one squashed image');
 const played=await ev('(()=>{const s=majickPhaserGame.scene.getScene("Game");for(const t of ["vesper","briar","zephyr","prism","rook","solara"]){s.v3317CareReaction?.({ok:true,guardianId:"qa-"+t,guardianType:t,action:"play",visualAction:"play"})}return ["vesper","briar","zephyr","prism","rook","solara"].map(t=>({type:t,state:s.v3348Sprites?.["qa-"+t]?.getData?.("v3351MotionState")}))})()');
 assert(played.some(x=>String(x.state).includes('play')),'Care interaction did not produce Guardian play motion');
 console.log('PASS REAL PHASER',JSON.stringify({width,guardianCount:initial.length,originalFramePairs:frame,stageImages:second.slice(4).map(x=>({type:x.type,key:x.key})),interaction:played}));
})().catch(err=>{console.error('FAIL REAL PHASER',err.stack||err);process.exitCode=1}).finally(async()=>{try{ws?.close()}catch{}try{child?.kill()}catch{}await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
