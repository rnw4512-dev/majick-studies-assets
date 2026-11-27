/* One local save-safety owner. Academic/world state stays in the existing S object. */
(()=>{'use strict';
 const KEY='moonlit_learning_v1',PREVIOUS=KEY+'__recovery_previous',PIN=KEY+'__before_restore',META=KEY+'__safety_meta',BAD=KEY+'__unreadable';
 const SCHEMA=1;let adapter=null;let writeGeneration=0,writeQueue=Promise.resolve();let status={ok:true,message:'Local save ready',at:0};
 const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 function validate(x){
  if(!object(x)||!object(x.courses)||!object(x.progress))throw Error('The file does not contain Majick courses and progress.');
  if(x.saveSchemaVersion>SCHEMA){const error=Error('This save uses a newer schema. Open it in a compatible release.');error.code='MAJICK_NEWER_SAVE_SCHEMA';throw error;}
  if(x.saveSchemaVersion!=null&&!Number.isInteger(x.saveSchemaVersion))throw Error('Invalid save schema version.');
  for(const [id,p] of Object.entries(x.progress)){if(!object(p)||p.answers!=null&&!Array.isArray(p.answers))throw Error('Invalid course progress: '+id)}
  if(x.legacy){if(!object(x.legacy))throw Error('Invalid Guardian state.');for(const k of ['pets','eggs'])if(x.legacy[k]!=null&&!Array.isArray(x.legacy[k]))throw Error('Invalid '+k+' roster.');}
  return x;
 }
 function parse(raw){return validate(JSON.parse(raw))}
 function migrate(value){const x=JSON.parse(JSON.stringify(validate(value)));x.saveSchemaVersion=SCHEMA;return x;}
 function notify(ok,message){status={ok,message,at:Date.now()};try{window.dispatchEvent(new CustomEvent('majick-save-status',{detail:{...status}}))}catch(_){}return status;}
 function read(){
  let raw;try{raw=localStorage.getItem(KEY);if(raw){try{return migrate(parse(raw))}catch(error){if(error.code==='MAJICK_NEWER_SAVE_SCHEMA')throw error;try{localStorage.setItem(BAD,raw)}catch(_){} }}
   for(const key of [PREVIOUS,PIN,KEY+'__good_backup',KEY+'__session_backup']){const backup=localStorage.getItem(key);if(!backup)continue;try{const recovered=migrate(parse(backup));localStorage.setItem(KEY,JSON.stringify(recovered));notify(true,'Recovered a validated browser snapshot.');return recovered}catch(_){}}
   if(raw){notify(false,'The saved data could not be read. Its original copy has been retained for recovery.');throw Error(status.message)}return null;
  }catch(error){notify(false,error.message);throw error;}
 }
 function write(value){
  const generation=++writeGeneration;let raw;try{validate(value);value.saveSchemaVersion=SCHEMA;raw=JSON.stringify(value);const prior=localStorage.getItem(KEY);
   // Save current state first. A full quota must not make an older snapshot replace it.
   let backupOk=true;
   try{localStorage.setItem(KEY,raw)}catch(error){
    if(error?.name!=='QuotaExceededError'&&error?.code!==22&&error?.code!==1014)throw error;
    // Only release redundant snapshots after validating the existing primary save.
    // Never remove the current save, recovery pin, or separate study records.
    if(!prior)throw error;parse(prior);
    for(const k of [PREVIOUS,KEY+'__session_backup',KEY+'__known_good',KEY+'__good_backup']){
      const copy=localStorage.getItem(k);
      if(copy===prior)localStorage.removeItem(k);
    }
    localStorage.setItem(KEY,raw);backupOk=false;
   }
   if(backupOk&&prior&&prior!==raw){try{parse(prior);localStorage.setItem(PREVIOUS,prior)}catch(_){backupOk=false}}
   // A newer successful local save must supersede an older overflow checkpoint.
   writeQueue=writeQueue.catch(()=>{}).then(async()=>{if(await archive.get('primary-workspace'))await archive.put('primary-workspace',null)}).catch(()=>{});
   const at=Date.now();try{localStorage.setItem(META,JSON.stringify({schema:SCHEMA,at,backupOk,release:window.MAJICK_RELEASE||'3.4.2'}))}catch(_){}
   notify(true,backupOk?'Saved in this browser.':'Saved; recovery snapshot unavailable. Download a backup.');cloud.schedule();return {ok:true,backupOk,at};
  }catch(error){
   if(!raw||!(error?.name==='QuotaExceededError'||error?.code===22||error?.code===1014)){notify(false,'Progress is not saved locally: '+error.message);throw error;}
   const payload=JSON.stringify({raw,browserData:auxiliary(),at:Date.now()});
   notify(false,'Browser storage full. Saving complete workspace to IndexedDB…');
   writeQueue=writeQueue.catch(()=>{}).then(async()=>{
    await archive.put('primary-workspace',payload);
    if(await archive.get('primary-workspace')!==payload)throw Error('IndexedDB read-back mismatch');
    if(generation===writeGeneration)notify(true,'Complete workspace verified in IndexedDB.');
   }).catch(e=>{if(generation===writeGeneration)notify(false,'IndexedDB save failed: '+e.message);});
   cloud.schedule();return {ok:false,pending:true,at:Date.now()};
  }
 }
 function summary(x){validate(x);return {courses:Object.keys(x.courses).length,answers:Object.values(x.progress).reduce((n,p)=>n+(p.answers||[]).length,0),guardians:(x.legacy?.pets||[]).length,eggs:(x.legacy?.eggs||[]).length};}
 function preview(payload){if(payload?.schemaVersion>SCHEMA)throw Error('Backup schema is newer than this app.');return migrate(payload?.state||payload);}
 const PREFIX='majick-d756-task2-rehearsal-v1',AUX=PIN+'__council';
 const STUDY_OWNERS={
  'majick-learning-observatory-v1':'MajickStudyObservatory',
  'aetheria-experiences-v1':'MajickLearningExperiences',
  'aetheria-adventure-journal-v1':'MajickAetheriaAdventures'
 };
 const allowedAux=k=>k.startsWith(PREFIX)||Object.hasOwn(STUDY_OWNERS,k);
 function auxiliary(){const out={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&allowedAux(k))out[k]=localStorage.getItem(k);}for(const [key,owner]of Object.entries(STUDY_OWNERS)){const api=window[owner];if(typeof api?.exportState==='function')out[key]=JSON.stringify(api.exportState())}return out;}
 function validateAux(value){if(value==null)return null;if(!object(value))throw Error('Invalid separate study backup data.');for(const [k,v]of Object.entries(value)){if(!allowedAux(k)||typeof v!=='string')throw Error('Unexpected separate save key.');const parsed=JSON.parse(v);if(Object.hasOwn(STUDY_OWNERS,k)&&!object(parsed))throw Error('Invalid saved study record.');}return value;}
 function protectEarned(candidate,current){const old=current.majickAccount||{},target=candidate.majickAccount||{},a=old.rewardCore||{},b=target.rewardCore||{};const laterReward=Object.keys(a.ledger||{}).some(k=>!b.ledger?.[k]),laterAlchemy=Object.keys(a.alchemyTransactions||{}).some(k=>!b.alchemyTransactions?.[k]);if(!laterReward&&!laterAlchemy)return candidate;
  candidate.majickAccount={...target,...old,rewardCore:{...b,...a,ledger:{...(b.ledger||{}),...(a.ledger||{})},alchemyTransactions:{...(b.alchemyTransactions||{}),...(a.alchemyTransactions||{})}}};
  const incomingPets=candidate.legacy?.pets,incomingEggs=candidate.legacy?.eggs;candidate.legacy={...(candidate.legacy||{}),...(current.legacy||{})};const merge=(incoming,owned)=>[...new Map([...(incoming||[]),...(owned||[])].filter(x=>x?.id).map(x=>[x.id,x])).values()];candidate.legacy.pets=merge(incomingPets,current.legacy?.pets);candidate.legacy.eggs=merge(incomingEggs,current.legacy?.eggs);const hatched=new Set(candidate.legacy.pets.map(p=>p.sourceEggId).filter(Boolean));candidate.legacy.eggs=candidate.legacy.eggs.filter(e=>!hatched.has(e.id));return candidate;
 }
 function exportPayload(value){return {type:'MajickStudiesSave',schemaVersion:SCHEMA,version:'3.4.2',exportedAt:new Date().toISOString(),state:migrate(value),browserData:auxiliary()};}
 function download(){const blob=new Blob([JSON.stringify(exportPayload(adapter.get()),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Majick_Studies_Backup_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function replace(x,browserData=null){const beforeState=JSON.parse(JSON.stringify(adapter.get())),candidate=protectEarned(migrate(x),beforeState),beforeAux=auxiliary(),incoming=validateAux(browserData);localStorage.setItem(PIN,JSON.stringify(beforeState));localStorage.setItem(AUX,JSON.stringify(beforeAux));write(candidate);try{for(const [k,v] of Object.entries(incoming||{}))localStorage.setItem(k,v);}catch(error){write(beforeState);for(const [k,v] of Object.entries(beforeAux))localStorage.setItem(k,v);throw error;}adapter.set(candidate);document.dispatchEvent?.(new CustomEvent('majick:save-restored'));adapter.refresh();}
 async function importFile(event){const file=event.target.files?.[0];if(!file)return;try{const payload=JSON.parse(await file.text()),x=preview(payload),info=summary(x);validateAux(payload.browserData);if(!confirm('Replace the open save with '+info.courses+' courses, '+info.answers+' answers, '+info.guardians+' Guardians and '+info.eggs+' eggs? Your current save will be retained as a recovery copy; later earned rewards and alchemy transactions remain protected.'))return;replace(x,payload.browserData);alert('Backup restored. Your previous save is retained.')}catch(error){alert('Backup was not imported: '+error.message)}finally{event.target.value='';}}
 async function restorePrevious(){try{const overflow=await archive.get('primary-workspace').catch(()=>null);if(overflow){const p=JSON.parse(overflow);parse(p.raw);validateAux(p.browserData);if(confirm('Recover the complete workspace saved to IndexedDB? Download your current backup first if needed.')){adapter.set(migrate(parse(p.raw)));document.dispatchEvent?.(new CustomEvent('majick:save-restored'));adapter.refresh();notify(true,'Recovered verified IndexedDB workspace.');return;}}const raw=localStorage.getItem(PIN)||localStorage.getItem(PREVIOUS)||await archive.get(PREVIOUS)||await archive.get(KEY+'__good_backup')||await archive.get(KEY+'__session_backup')||await archive.get(KEY+'__known_good');if(!raw)throw Error('No recovery snapshot is available yet.');const x=parse(raw),info=summary(x);if(!confirm('Restore a browser snapshot with '+info.answers+' answers, '+info.guardians+' Guardians and '+info.eggs+' eggs? The open save will be retained.'))return;const extra=localStorage.getItem(AUX);replace(x,extra?JSON.parse(extra):null)}catch(error){alert('Recovery was not applied: '+error.message)}}
 function panel(){let meta={};try{meta=JSON.parse(localStorage.getItem(META)||'{}')}catch(_){}return '<section class="v338SavePanel"><h3>Progress safety</h3><p>Your course and world state use the main save; this backup also includes game discoveries, guided practice, Observatory records and Council attempts. Download a backup before changing devices.</p><p role="status" id="majickSaveSafetyStatus">'+(status.ok?'':'⚠ ')+escape(status.message)+(meta.at?' Last saved: '+new Date(meta.at).toLocaleString():'')+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" onclick="save()">Save now</button><button class="btn violet" onclick="MajickSaveSafety.download()">Download backup</button><label class="btn ghost">Import backup<input type="file" accept=".json,application/json" onchange="MajickSaveSafety.importFile(event)"></label><button class="btn ghost" onclick="MajickSaveSafety.restorePrevious()">Restore recovery copy</button></div><p>Local save protection is active. Cloud backup can be connected below.</p></section>'+cloud.panel();}

 /* Aetheria private cloud checkpoint. No service-role credentials; no automatic remote overwrite. */
 const archive=(()=>{
  let dbPromise;
  function db(){return dbPromise??=new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(Error('IndexedDB unavailable'));const r=window.indexedDB.open('aetheria-recovery-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('snapshots');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Recovery database blocked'));});}
  async function put(key,value){const d=await db();await new Promise((resolve,reject)=>{const t=d.transaction('snapshots','readwrite');t.objectStore('snapshots').put(value,key);t.oncomplete=resolve;t.onabort=t.onerror=()=>reject(t.error);});}
  async function get(key){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('snapshots').objectStore('snapshots').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  async function compact(){for(const k of [PREVIOUS,KEY+'__session_backup',KEY+'__known_good',KEY+'__good_backup']){const raw=localStorage.getItem(k);if(!raw)continue;try{parse(raw);await put(k,raw);if(await get(k)===raw&&localStorage.getItem(k)===raw)localStorage.removeItem(k);}catch(_){}}}
  return {put,get,compact};
 })();
 const cloud=(()=>{
  const base='https://qxknfupnmtghyxwzydap.supabase.co',key='sb_publishable_9AQreTj9E0hyXDdJ7Z4SNQ_OlQPrldq';
  let auth=null,revision=null,enabled=false,busy=false,timer=null,dirty=false,cloudMessage='Cloud disconnected. Local saves remain active.';
  const AUTHKEY='aetheria-cloud-session-v1';
  function persist(){try{if(auth)localStorage.setItem(AUTHKEY,JSON.stringify({auth,revision,enabled}));else localStorage.removeItem(AUTHKEY);}catch(_){}}
  function show(message){cloudMessage=message;const n=document.getElementById('aetheriaCloudStatus');if(n)n.textContent=message;let badge=document.getElementById('aetheriaCloudGlobal');if(!badge&&document.body){badge=document.createElement('button');badge.id='aetheriaCloudGlobal';badge.type='button';badge.style.cssText='position:fixed;right:12px;bottom:12px;z-index:8000;background:#301b49;color:#fff;border:1px solid #c6a76a;border-radius:10px;padding:8px 12px;max-width:calc(100vw - 24px);font-size:12px';badge.setAttribute('aria-live','polite');badge.onclick=()=>{const panel=document.getElementById('aetheriaCloudStatus');if(panel)panel.scrollIntoView({block:'center'});else alert(cloudMessage+' Open Progress safety to manage backups.');};document.body.appendChild(badge);}if(badge){badge.textContent=enabled?'Cloud: autosave on':auth?'Cloud: connected / paused':'Cloud: local only';badge.title=message;badge.setAttribute('aria-label',message);}}
  async function resume(){if(busy||auth)return;busy=true;try{const saved=JSON.parse(localStorage.getItem(AUTHKEY)||'null');if(!saved?.auth?.refresh_token)return;auth=saved.auth;revision=saved.revision;const row=await readRemote();enabled=!!saved.enabled&&row?.revision===revision;persist();show(enabled?'Cloud connected. Autosave on.':'Cloud connected. Review checkpoint before enabling autosave.');}catch(e){auth=null;enabled=false;show('Cloud session unavailable. Reconnect your study account.');}finally{busy=false;}}

  async function request(path,options={},token=null){const r=await fetch(base+path,{...options,headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})}});const data=await r.json().catch(()=>null);if(!r.ok)throw Error(data?.msg||data?.message||data?.error_description||'Cloud request failed ('+r.status+')');return data;}
  async function token(){if(!auth)throw Error('Connect your study account first.');if(Date.now()+60000>=auth.expires){const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:auth.refresh_token})});auth={...next,expires:Date.now()+next.expires_in*1000};persist();}return auth.access_token;}
  async function readRemote(){const t=await token();const rows=await request('/rest/v1/aetheria_saves?user_id=eq.'+encodeURIComponent(auth.user.id)+'&select=revision,payload,updated_at',{},t);return rows[0]||null;}
  async function signIn(event){event.preventDefault();if(busy||auth)return;busy=true;const form=event.currentTarget;const email=form.elements.email.value.trim(),password=form.elements.password.value;form.elements.password.value='';try{const result=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});auth={...result,expires:Date.now()+result.expires_in*1000};const row=await readRemote();revision=row?.revision??null;enabled=false;persist();show(row?'Connected. Cloud save exists. Restore it or explicitly back up this browser before enabling autosave.':'Connected. No cloud save yet. Choose Back up this browser.');}catch(e){auth=null;show(e.message);}finally{busy=false;}}
  async function push(manual=false){if(!auth||busy||(!manual&&!enabled))return;busy=true;dirty=false;try{const remote=await readRemote();if((remote?.revision??null)!==revision){enabled=false;throw Error('Cloud revision changed on another device. Autosave paused; download a local backup and review the cloud copy.');}
    if(manual&&remote&&!enabled&&!confirm('Replace the current cloud checkpoint with this browser’s progress? Download a backup first if needed.'))return;
    const payload=exportPayload(adapter.get());
    // Do not transmit credential-shaped fields in a legacy save.
    const inspect=v=>{if(!v||typeof v!=='object')return;for(const [k,x] of Object.entries(v)){if(/^(api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret[_-]?key|service[_-]?role[_-]?key)$/i.test(k)&&x)throw Error('A credential field was detected. Cloud upload stopped.');inspect(x);}};inspect(payload.state);for(const v of Object.values(payload.browserData||{}))inspect(JSON.parse(v));
    const next=(revision??0)+1,t=await token(),body={user_id:auth.user.id,payload,revision:next,updated_at:new Date().toISOString()};
    const rows=await request('/rest/v1/aetheria_saves'+(remote?'?user_id=eq.'+encodeURIComponent(auth.user.id)+'&revision=eq.'+revision:''),{method:remote?'PATCH':'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)},t);
    if(!Array.isArray(rows)||rows.length!==1||rows[0].revision!==next)throw Error('Cloud save was not confirmed. Autosave paused.');
    revision=next;enabled=true;persist();const verified=await readRemote();if(verified?.revision!==next||JSON.stringify(summary(preview(verified.payload)))!==JSON.stringify(summary(payload.state)))throw Error('Cloud read-back verification failed.');await archive.compact();show('Cloud checkpoint verified at '+new Date().toLocaleTimeString()+'.');
  }catch(e){enabled=false;persist();show('Cloud save paused: '+e.message+' Keep or download your local backup.');}finally{busy=false;if(dirty&&enabled)schedule();}}
  async function restore(){if(!auth||busy)return;busy=true;try{const row=await readRemote();if(!row)throw Error('No cloud checkpoint exists.');const candidate=preview(row.payload);validateAux(row.payload.browserData);const info=summary(candidate);if(!confirm('Restore cloud checkpoint with '+info.answers+' answers and '+info.guardians+' Guardians? This uses the existing browser recovery system.'))return;enabled=false;replace(candidate,row.payload.browserData);revision=row.revision;persist();show('Cloud checkpoint restored locally. Choose Back up this browser to enable autosave.');}catch(e){show('Cloud restore not applied: '+e.message);}finally{busy=false;}}
  function schedule(){if(!enabled)return;dirty=true;clearTimeout(timer);timer=setTimeout(()=>push(),1800);}
  function disconnect(){if(busy)return;clearTimeout(timer);enabled=false;auth=null;revision=null;dirty=false;persist();show('Cloud disconnected. Local saves remain active.');}
  function panel(){return '<section class="v338SavePanel"><h3>Aetheria cloud backup</h3><p>Connect a study-app account. Your existing browser save is retained; cloud autosave begins only after you choose to upload.</p><p role="status" id="aetheriaCloudStatus">'+escape(cloudMessage)+'</p><form onsubmit="MajickSaveSafety.cloud.signIn(event)" style="display:flex;gap:8px;flex-wrap:wrap"><label>Email <input name="email" type="email" autocomplete="username" required></label><label>Password <input name="password" type="password" autocomplete="current-password" required></label><button class="btn primary" type="submit">Connect study account</button></form><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn violet" onclick="MajickSaveSafety.cloud.push(true)">Back up this browser</button><button class="btn ghost" onclick="MajickSaveSafety.cloud.restore()">Restore cloud checkpoint</button><button class="btn ghost" onclick="MajickSaveSafety.cloud.disconnect()">Disconnect</button></div></section>';}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{show(cloudMessage);resume();},{once:true});else setTimeout(()=>{show(cloudMessage);resume();},0);
  return {panel,signIn,push,restore,disconnect,schedule};
 })();

 window.MajickSaveSafety={cloud,read,write,validate,migrate,summary,preview,exportPayload,download,importFile,restorePrevious,panel,attach:a=>{adapter=a;window.exportSave=download},status:()=>({...status}),keys:{KEY,PREVIOUS,PIN,META,BAD}};
})();
