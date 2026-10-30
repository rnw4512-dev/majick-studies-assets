'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);if(!chrome)throw Error('Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'maj-commons-'));
const server=http.createServer((req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ogg':'audio/ogg'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}});
let proc,ws,id=0,stderr='';const contrastFailures=[],diagnostics=[];const inflight=new Map();
async function call(method,params={}){const n=++id;return new Promise((resolve,reject)=>{inflight.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(inflight.has(n)){inflight.delete(n);reject(Error('Timed out '+method))}},method==='Page.captureScreenshot'?60000:45000).unref()})}
async function ev(js){let r=await call('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function waitFor(js){for(let n=0;n<100;n++){try{if(await ev(js))return}catch(e){if(/Timed out/.test(e.message))throw e}await sleep(250)}console.error('Audio state',await ev('MajickCollegiumAtmosphere.inspect()').catch(()=>null));console.error('Repair state',await ev('JSON.stringify({screen:S.screen,session:typeof session!=="undefined"?session:null,body:document.body.innerText.slice(-7000)})').catch(()=>null));console.error('Sanctuary diagnostic',JSON.stringify({errors:diagnostics,frame:await ev('(()=>{const f=document.querySelector(".v3317SanctuaryFrame"),w=f?.contentWindow;return {url:f?.src,note:w?.document?.body?.innerText.slice(0,300),game:!!w?.majickPhaserGame,scenes:w?.majickPhaserGame?.scene?.scenes.map(s=>({key:s.sys.settings.key,status:s.sys.settings.status,decor:s.decorItems?.length,button:!!s.v3321FurnitureButton}))}})()').catch(()=>null)}));throw Error('Page condition: '+js)}
const deadline=setTimeout(()=>{console.error('Commons audit exceeded 480 seconds');try{proc?.kill()}catch{};server.closeAllConnections();process.exit(1)},process.env.COMMONS_WIDTH?480000:900000);deadline.unref();
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--enable-unsafe-swiftshader','--remote-allow-origins=*','--remote-debugging-port=0','--no-first-run','--no-default-browser-check','--disable-background-networking','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});proc.stderr.on('data',d=>stderr+=String(d).slice(-3000));
 let port;for(let k=0;k<400;k++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}if(!port)throw Error('Chrome start '+stderr.slice(-1500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});ws.onmessage=e=>{const m=JSON.parse(e.data),p=inflight.get(m.id);if(m.method==='Runtime.exceptionThrown')diagnostics.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')diagnostics.push(m.params.args.map(a=>a.description||a.value));if(p){inflight.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};await call('Runtime.enable');await call('Page.enable');await call('Page.navigate',{url});


 await waitFor('!!window.MajickCollegiumAtmosphere&&!!window.AetheriaBrand&&!!window.MajickLivingMagic');
 await ev('switchCourse("D772");navigate("home")');
 await waitFor('!!document.querySelector(".aetheriaCastleArrival")&&!!document.querySelector(".caSoundControls")');
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().enabled'),false);
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().loaded'),0);
 await ev('navigate("mission")');await waitFor('!!S.progress.D772.solutionWorkshop&&!!S.progress.D772.guidedExampleSequences');await ev('navigate("home")');await waitFor('!!document.querySelector(".aetheriaCastleArrival")');
 const protectedBefore=await ev('JSON.stringify({progress:S.progress,pets:S.legacy.pets,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,inventory:S.majickAccount.inventory})');
 assert((await ev('getComputedStyle(document.querySelector(".aetheriaCastleArrival")).backgroundImage')).includes('landscape-castle.webp'));
 assert.equal(await ev('document.querySelector(".majRoomEmblem").textContent.includes("🏰")'),false);
 assert.equal(await ev('document.querySelectorAll(".aetheriaCastleFairy").length'),3);
 await ev('AetheriaBrand.refresh()');
 assert.equal(await ev('document.querySelector(".aetheriaCastleArrival").textContent.includes("—")'),false);
 await ev('document.querySelector(".caAmbience").scrollIntoView({block:"center"})');
 const musicButton=await ev('(()=>{const b=document.querySelector(".caAmbience").getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()');
 await call('Input.dispatchMouseEvent',{type:'mousePressed',...musicButton,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...musicButton,button:'left',clickCount:1});
 await waitFor('MajickCollegiumAtmosphere.inspect().playing&&MajickCollegiumAtmosphere.inspect().loaded>=2');
 assert.equal(await ev('document.querySelector(".caAmbience").getAttribute("aria-pressed")'), 'true');
 await ev('(()=>{const slider=document.querySelector(".caSoundOptions input");slider.value="12";slider.dispatchEvent(new Event("input",{bubbles:true}))})()');
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().volume'),.12);
 await ev('navigate("mission")');await waitFor('!!document.querySelector(".caAmbience")');
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().playing'),true);
 await ev('document.querySelector(".caAmbience").click()');
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().playing'),false);
 const protectedAfter=await ev('JSON.stringify({progress:S.progress,pets:S.legacy.pets,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,inventory:S.majickAccount.inventory})');
 const diff=(a,b,path='')=>a&&b&&typeof a==='object'&&typeof b==='object'?[...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>diff(a[k],b[k],path+'.'+k)):JSON.stringify(a)===JSON.stringify(b)?[]:[path];
 const changed=diff(JSON.parse(protectedBefore),JSON.parse(protectedAfter));console.log('Immersion state changes',JSON.stringify(changed));assert.deepEqual(changed,[]);
 console.log('PASS opt-in human music decodes and plays, volume persists, navigation continuity, mute and protected learner state');
 await ev('navigate("home")');await waitFor('!!document.querySelector(".aetheriaCastleArrival")');
 const output=process.env.IMMERSION_QA_DIR||path.join(os.tmpdir(),'majick-immersion-qa');fs.mkdirSync(output,{recursive:true});
 for(const width of [1366,390]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:860,deviceScaleFactor:1,mobile:width<600});
  await ev('document.querySelector(".aetheriaCastleArrival").scrollIntoView({block:"center"})');await sleep(300);
  const geometry=await ev('(()=>{const b=document.querySelector(".aetheriaCastleArrival").getBoundingClientRect();return {width:b.width,height:b.height,scroll:document.documentElement.scrollWidth,viewport:innerWidth}})()');assert(geometry.height>=300);assert(geometry.scroll<=geometry.viewport+2,JSON.stringify(geometry));
  const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,'castle-'+width+'.png'),Buffer.from(shot.result.data,'base64'));
 }
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await ev('getComputedStyle(document.querySelector(".aetheriaCastleFairy")).animationName'),'none');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!window.MajickCollegiumAtmosphere&&!!window.S?.majickAccount');
 assert.equal(await ev('MajickCollegiumAtmosphere.inspect().enabled'),false);assert.equal(await ev('MajickCollegiumAtmosphere.inspect().volume'),.12);
 console.log('PASS human castle artwork, three bounded fairies, desktop/mobile layout, reduced motion and reload-safe music preferences');

}
run().catch(e=>{console.error('FAIL immersion browser:',e.stack||e);process.exitCode=1}).finally(async()=>{clearTimeout(deadline);try{ws?.close()}catch{}try{proc?.kill()}catch{}server.closeAllConnections();await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
