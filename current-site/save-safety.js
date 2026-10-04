/* One local save-safety owner. Academic/world state stays in the existing S object. */
(()=>{'use strict';
 const KEY='moonlit_learning_v1',PREVIOUS=KEY+'__recovery_previous',PIN=KEY+'__before_restore',META=KEY+'__safety_meta',BAD=KEY+'__unreadable';
 const SCHEMA=1;let adapter=null;let status={ok:true,message:'Local save ready',at:0};
 const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 function validate(x){
  if(!object(x)||!object(x.courses)||!object(x.progress))throw Error('The file does not contain Majick courses and progress.');
  if(x.saveSchemaVersion!=null&&(!Number.isInteger(x.saveSchemaVersion)||x.saveSchemaVersion>SCHEMA))throw Error('This save uses a newer schema. Open it in a compatible release.');
  for(const [id,p] of Object.entries(x.progress)){if(!object(p)||p.answers!=null&&!Array.isArray(p.answers))throw Error('Invalid course progress: '+id)}
  if(x.legacy){if(!object(x.legacy))throw Error('Invalid Guardian state.');for(const k of ['pets','eggs'])if(x.legacy[k]!=null&&!Array.isArray(x.legacy[k]))throw Error('Invalid '+k+' roster.');}
  return x;
 }
 function parse(raw){return validate(JSON.parse(raw))}
 function migrate(value){const x=JSON.parse(JSON.stringify(validate(value)));x.saveSchemaVersion=SCHEMA;return x;}
 function notify(ok,message){status={ok,message,at:Date.now()};try{window.dispatchEvent(new CustomEvent('majick-save-status',{detail:{...status}}))}catch(_){}return status;}
 function read(){
  let raw;try{raw=localStorage.getItem(KEY);if(raw){try{return migrate(parse(raw))}catch(error){try{localStorage.setItem(BAD,raw)}catch(_){} }}
   for(const key of [PREVIOUS,PIN,KEY+'__good_backup',KEY+'__session_backup']){const backup=localStorage.getItem(key);if(!backup)continue;try{const recovered=migrate(parse(backup));localStorage.setItem(KEY,JSON.stringify(recovered));notify(true,'Recovered a validated browser snapshot.');return recovered}catch(_){}}
   if(raw){notify(false,'The saved data could not be read. Its original copy has been retained for recovery.');throw Error(status.message)}return null;
  }catch(error){notify(false,error.message);throw error;}
 }
 function write(value){
  try{validate(value);value.saveSchemaVersion=SCHEMA;const raw=JSON.stringify(value),prior=localStorage.getItem(KEY);
   // Save current state first. A full quota must not make an older snapshot replace it.
   localStorage.setItem(KEY,raw);let backupOk=true;
   if(prior&&prior!==raw){try{parse(prior);localStorage.setItem(PREVIOUS,prior)}catch(_){backupOk=false}}
   const at=Date.now();try{localStorage.setItem(META,JSON.stringify({schema:SCHEMA,at,backupOk,release:window.MAJICK_RELEASE||'3.4.2'}))}catch(_){}
   notify(true,backupOk?'Saved in this browser.':'Saved; recovery snapshot unavailable. Download a backup.');return {ok:true,backupOk,at};
  }catch(error){notify(false,'Progress is not saved: '+error.message);throw error;}
 }
 function summary(x){validate(x);return {courses:Object.keys(x.courses).length,answers:Object.values(x.progress).reduce((n,p)=>n+(p.answers||[]).length,0),guardians:(x.legacy?.pets||[]).length,eggs:(x.legacy?.eggs||[]).length};}
 function preview(payload){if(payload?.schemaVersion>SCHEMA)throw Error('Backup schema is newer than this app.');return migrate(payload?.state||payload);}
 function exportPayload(value){return {type:'MajickStudiesSave',schemaVersion:SCHEMA,version:'3.4.2',exportedAt:new Date().toISOString(),state:migrate(value)};}
 function download(){const blob=new Blob([JSON.stringify(exportPayload(adapter.get()),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Majick_Studies_Backup_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function replace(x){const candidate=migrate(x),before=JSON.stringify(adapter.get());localStorage.setItem(PIN,before);write(candidate);adapter.set(candidate);adapter.refresh();}
 async function importFile(event){const file=event.target.files?.[0];if(!file)return;try{const x=preview(JSON.parse(await file.text())),info=summary(x);if(!confirm('Replace the open save with '+info.courses+' courses, '+info.answers+' answers, '+info.guardians+' Guardians and '+info.eggs+' eggs? Your current save will be retained as a recovery copy.'))return;replace(x);alert('Backup restored. Your previous save is retained.')}catch(error){alert('Backup was not imported: '+error.message)}finally{event.target.value='';}}
 function restorePrevious(){try{const raw=localStorage.getItem(PIN)||localStorage.getItem(PREVIOUS);if(!raw)throw Error('No recovery snapshot is available yet.');const x=parse(raw),info=summary(x);if(!confirm('Restore a browser snapshot with '+info.answers+' answers, '+info.guardians+' Guardians and '+info.eggs+' eggs? The open save will be retained.'))return;replace(x)}catch(error){alert('Recovery was not applied: '+error.message)}}
 function panel(){let meta={};try{meta=JSON.parse(localStorage.getItem(META)||'{}')}catch(_){}return '<section class="v338SavePanel"><h3>Progress safety</h3><p>Your courses, progress, Guardians, eggs and inventory use one browser save. Download a backup before changing devices.</p><p role="status" id="majickSaveSafetyStatus">'+(status.ok?'':'⚠ ')+escape(status.message)+(meta.at?' Last saved: '+new Date(meta.at).toLocaleString():'')+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" onclick="save()">Save now</button><button class="btn violet" onclick="MajickSaveSafety.download()">Download backup</button><label class="btn ghost">Import backup<input type="file" accept=".json,application/json" onchange="MajickSaveSafety.importFile(event)"></label><button class="btn ghost" onclick="MajickSaveSafety.restorePrevious()">Restore recovery copy</button></div><p>Local save protection is active. Cloud synchronization is a separate connection and has not been verified by these controls.</p></section>';}
 window.MajickSaveSafety={read,write,validate,migrate,summary,preview,exportPayload,download,importFile,restorePrevious,panel,attach:a=>{adapter=a},status:()=>({...status}),keys:{KEY,PREVIOUS,PIN,META,BAD}};
})();
