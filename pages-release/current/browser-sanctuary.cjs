'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn,spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'_site'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const chrome=['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(c=>spawnSync('which',[c]).status===0);if(!chrome)throw Error('Chromium not available');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'maj-commons-'));
const server=http.createServer((req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html',file=path.resolve(root,pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();const ext=path.extname(file),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'}).end(fs.readFileSync(file))}catch{if(!res.headersSent)res.writeHead(404).end();else if(!res.writableEnded)res.end()}});
let proc,ws,id=0,stderr='';const contrastFailures=[],diagnostics=[];const inflight=new Map();
async function call(method,params={}){const n=++id;return new Promise((resolve,reject)=>{inflight.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(inflight.has(n)){inflight.delete(n);reject(Error('Timed out '+method))}},method==='Page.captureScreenshot'?60000:45000)})}
async function ev(js){let r=await call('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value}
async function waitFor(js){for(let n=0;n<100;n++){try{if(await ev(js))return}catch(e){if(/Timed out/.test(e.message))throw e}await sleep(250)}console.error('Sanctuary diagnostic',JSON.stringify({errors:diagnostics,frame:await ev('(()=>{const f=document.querySelector(".v3317SanctuaryFrame"),w=f?.contentWindow;return {url:f?.src,note:w?.document?.body?.innerText.slice(0,300),game:!!w?.majickPhaserGame,scenes:w?.majickPhaserGame?.scene?.scenes.map(s=>({key:s.sys.settings.key,status:s.sys.settings.status,decor:s.decorItems?.length,button:!!s.v3321FurnitureButton}))}})()').catch(()=>null)}));throw Error('Page condition: '+js)}
const deadline=setTimeout(()=>{console.error('Commons audit exceeded 480 seconds');try{proc?.kill()}catch{};server.closeAllConnections();process.exit(1)},process.env.COMMONS_WIDTH?480000:900000);deadline.unref();
async function run(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--enable-unsafe-swiftshader','--remote-allow-origins=*','--remote-debugging-port=0','--no-first-run','--no-default-browser-check','--disable-background-networking','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});proc.stderr.on('data',d=>stderr+=String(d).slice(-3000));
 let port;for(let k=0;k<400;k++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=+fs.readFileSync(f,'utf8').split('\n')[0];break}await sleep(150)}if(!port)throw Error('Chrome start '+stderr.slice(-1500));
 const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(tabs.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});ws.onmessage=e=>{const m=JSON.parse(e.data),p=inflight.get(m.id);if(m.method==='Runtime.exceptionThrown')diagnostics.push(m.params.exceptionDetails);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')diagnostics.push(m.params.args.map(a=>a.description||a.value));if(p){inflight.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m)}};await call('Runtime.enable');await call('Page.enable');await call('Page.navigate',{url});

 await waitFor('!!window.MajickSanctuaryState&&!!window.MajickGuardianCare&&!!window.MajickGuardianRegistry');
 await ev('MajickSanctuaryState.initialize()');
 const fixture=await ev(`(()=>{
  const species=['Moon Cat','Pocket Dragon','Star Fox','Winged Bunny','Starlight Owl','Moonlit Fawn','Cloud Ferret','Crystal Axolotl','Twilight Raven','Sunrise Hedgehog','Moonlit Fawn'];
  const levels=[1,3,5,8,12,3,5,8,12,1,8];
  const pets=species.map((type,i)=>({id:'saved-guardian-'+i,type:type.toLowerCase().replaceAll(' ','-'),name:i===5||i===10?'Briar':'Custom '+i,studyXP:0,level:levels[i]}));
  // The app computes levels from studyXP, not a renderer-owned level field.
  for(const p of pets){for(let xp=0;xp<100000;xp++){p.studyXP=xp;if(masPetLevel(p)>=p.level)break}}
  S.legacy.pets=pets;S.legacy.activePetId=pets[0].id;
  ensureV3();MajickGuardianCare.ensure();save();navigate('companions');
  return phase4StudyState().pets;
 })()`);
 assert.equal(fixture.length,11);assert.equal(fixture.filter(p=>p.name==='Briar').length,2);
 await waitFor('!!document.querySelector(".v3317SanctuaryFrame")?.contentWindow?.MajickPixiSanctuary');
 const inspect='document.querySelector(".v3317SanctuaryFrame").contentWindow.MajickPixiSanctuary.inspect()';
 const inside=js=>'document.querySelector(".v3317SanctuaryFrame").contentWindow.eval('+JSON.stringify(js)+')';
 await waitFor(inspect+'.roster.length===11&&'+inspect+'.roster.every(p=>p.present)');
 let snapshot=await ev(inspect);assert.equal(snapshot.roster.length,11);assert.equal(new Set(snapshot.roster.map(p=>p.petId)).size,11);
 const expected=['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara','briar'];
 assert.deepEqual(snapshot.roster.map(p=>p.canon),expected);
 for(const p of fixture)assert.equal(snapshot.roster.find(e=>e.petId===p.id).stage,p.stage);
 assert.equal(snapshot.guardians.find(e=>e.canon==='velora').frames,2);
 await ev('MajickRoomSections.refresh();(()=>{const f=document.querySelector(".v3317SanctuaryFrame"),p=f.closest(".phase4Wrap");[...document.querySelectorAll("#majickRoomSections button")].find(b=>b.getAttribute("aria-controls")===p.id)?.click()})()');
 await call('Emulation.setDeviceMetricsOverride',{width:1400,height:1200,deviceScaleFactor:1,mobile:false});
 await ev('document.querySelector(".v3317SanctuaryFrame").scrollIntoView({block:"start"})');
 await ev(inside('document.querySelector("#room").scrollIntoView({block:"center"})'));
 await sleep(300);
 const screenshot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});const output=process.env.SANCTUARY_QA_DIR||path.join(os.tmpdir(),'majick-sanctuary-qa');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'sanctuary-eleven.png'),Buffer.from(screenshot.result.data,'base64'));

 const protectedState=await ev('JSON.stringify({pets:S.legacy.pets.map(p=>({id:p.id,type:p.type,name:p.name,studyXP:p.studyXP})),progress:S.progress,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,inventory:S.majickAccount.inventory})');
 await ev(inside('document.querySelector("#toggle").textContent.includes("Resume")&&document.querySelector("#toggle").click()'));
 const initialPositions=(await ev(inspect)).guardians;
 await waitFor(inspect+'.guardians.every(g=>{const start='+JSON.stringify(initialPositions)+'.find(p=>p.id===g.id);return Math.hypot(start.x-g.x,start.y-g.y)>0})');snapshot=await ev(inspect);
 for(const g of snapshot.guardians){const start=initialPositions.find(p=>p.id===g.id);assert(Math.hypot(start.x-g.x,start.y-g.y)>0,'Saved Guardian must actually move: '+g.id)}
 for(const g of snapshot.guardians){assert(g.y>=490&&g.y<=650);assert(g.x>=60&&g.x<=1140);assert.equal(g.spriteY,0)}
 await ev('phase4PushState();phase4PushState()');await sleep(300);assert.equal((await ev(inspect)).roster.length,11);
 console.log('PASS Pixi eleven identities, duplicate Briars, species mapping, saved evolution stages, walking frames, repeated sync and floor bounds');
 assert.equal(snapshot.furniture.length,15);assert(snapshot.furniture.every(o=>o.visible));
 const id=snapshot.furniture[0].id;
 await ev(inside('document.querySelector("#furniture-select").value='+JSON.stringify(id)+';document.querySelector("#furniture-store").click()'));
 await waitFor('S.majickAccount.sanctuaryFurniture.stored.includes('+JSON.stringify(id)+')');
 await waitFor(inspect+'.furniture.find(o=>o.id==='+JSON.stringify(id)+').visible===false');
 await ev(inside('document.querySelector("#furniture-place").click()'));
 await waitFor('!S.majickAccount.sanctuaryFurniture.stored.includes('+JSON.stringify(id)+')');
 // Exercise the actual Pixi pointer drag handlers at scaled canvas coordinates.
 await ev(inside('document.querySelector("#edit-furniture").click()'));
 const drag=await ev(inside(`(()=>{const app=MajickPixiSanctuary.app,world=app.stage.children[0],layer=world.children.find(c=>c.sortableChildren),s=layer.children.find(c=>c.texture&&c.visible),global=s.getGlobalPosition();s.emit('pointerdown',{global,stopPropagation(){}});app.stage.emit('globalpointermove',{global:world.toGlobal({x:420,y:590})});app.stage.emit('pointerup',{});return true})()`));assert(drag);
 await waitFor('Object.values(S.majickAccount.sanctuaryFurniture.positions).some(p=>Math.abs(p.x-767)<2&&Math.abs(p.y-783)<2)');
 const room=await ev('JSON.stringify(S.majickAccount.sanctuaryFurniture)');
 await call('Page.reload',{ignoreCache:true});await waitFor(inspect+'.roster.length===11&&'+inspect+'.roster.every(p=>p.present)');
 assert.equal(await ev('JSON.stringify(S.majickAccount.sanctuaryFurniture)'),room);
 console.log('PASS furniture initialization, store/place, floor-coordinate drag and actual reload persistence');
 await ev(inside('document.querySelector("#care-guardian").value="saved-guardian-10";document.querySelector("#care-water").click()'));
 await waitFor('S.majickAccount.guardianCare.log[0]?.petId==="saved-guardian-10"&&S.majickAccount.guardianCare.log[0]?.action==="water"');
 assert.equal(await ev('JSON.stringify({pets:S.legacy.pets.map(p=>({id:p.id,type:p.type,name:p.name,studyXP:p.studyXP})),progress:S.progress,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,inventory:S.majickAccount.inventory})'),protectedState);
 await ev('S.majickAccount.guardianInventory["moonberry-meal"]=1;save()');
 await ev(inside('document.querySelector("#care-feed").click()'));
 await waitFor('S.majickAccount.guardianInventory["moonberry-meal"]===0');
 await waitFor(inside('document.querySelector("#care-result").textContent.includes("meal")'));
 const careCount=await ev('S.majickAccount.guardianCare.log.length');
 await ev(inside('document.querySelector("#care-feed").click()'));
 await waitFor(inside('document.querySelector("#care-result").textContent.includes("out of")'));
 assert.equal(await ev('S.majickAccount.guardianCare.log.length'),careCount,'Unavailable food must not create false care');
 const care=await ev('JSON.stringify(S.majickAccount.guardianCare)');
 await call('Page.reload',{ignoreCache:true});await waitFor(inspect+'.roster.length===11');assert.equal(await ev('JSON.stringify(S.majickAccount.guardianCare)'),care);
 console.log('PASS exact duplicate Guardian care through shared API, progress/currency/inventory isolation and reload');
 await ev('document.querySelector("[onclick^=majickTogglePixiSanctuary]").click()');
 await waitFor('!!document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame?.scene?.getScene("Game")?.v3321FurnitureButton?.active');
 await waitFor('JSON.stringify(document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game").v3321FurnitureState.positions)===JSON.stringify(S.majickAccount.sanctuaryFurniture.positions)');
 assert.equal(await ev('JSON.stringify({pets:S.legacy.pets.map(p=>({id:p.id,type:p.type,name:p.name,studyXP:p.studyXP})),progress:S.progress,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,inventory:S.majickAccount.inventory})'),protectedState);
 console.log('PASS Phaser fallback shares room positions without resetting eleven Guardians or learner state');
}
run().catch(e=>{console.error('FAIL Sanctuary browser:',e.stack||e);process.exitCode=1}).finally(async()=>{clearTimeout(deadline);try{ws?.close()}catch{}try{proc?.kill()}catch{}server.closeAllConnections();await new Promise(r=>server.close(r));try{fs.rmSync(profile,{recursive:true,force:true})}catch{}});
