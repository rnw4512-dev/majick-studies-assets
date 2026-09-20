(function(){
'use strict';
const DB='majick-studies-sources-v1';
const STORE='sources';
const FALLBACK='majick-study-materials-v1';

function openDb(){
  return new Promise((resolve,reject)=>{
    if(!window.indexedDB){resolve(null);return;}
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
function fallbackRead(){try{return JSON.parse(localStorage.getItem(FALLBACK)||'[]')}catch(_){return[]}}
function fallbackWrite(rows){localStorage.setItem(FALLBACK,JSON.stringify(rows.slice(-35)))}

async function save(record){
  const row=Object.assign({},record,{updatedAt:new Date().toISOString()});
  try{
    const db=await openDb();if(!db)throw new Error('fallback');
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(row);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
    db.close();return row;
  }catch(_){
    const rows=fallbackRead().filter(x=>x.id!==row.id);rows.push(row);fallbackWrite(rows);return row;
  }
}
async function list(courseId){
  let rows=[];
  try{
    const db=await openDb();if(!db)throw new Error('fallback');
    rows=await new Promise((resolve,reject)=>{
      const req=db.transaction(STORE).objectStore(STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
    db.close();
  }catch(_){rows=fallbackRead();}
  if(courseId)rows=rows.filter(x=>x.courseId===courseId);
  return rows.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}
async function remove(id){
  try{
    const db=await openDb();if(!db)throw new Error('fallback');
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }catch(_){fallbackWrite(fallbackRead().filter(x=>x.id!==id));}
}
function newRecord(input){
  return {
    id:'source_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
    courseId:String(input.courseId||''),
    sourceType:input.sourceType||'pasted-text',
    sourceName:input.sourceName||'Study Notes',
    text:String(input.text||''),
    active:true,
    createdAt:new Date().toISOString(),
    outputs:input.outputs||{},
    generated:input.generated||null
  };
}
async function injectQuestions(courseObj,courseId){
  if(!courseObj||!Array.isArray(courseObj.questionBank))return 0;
  const rows=await list(courseId);let added=0;
  for(const row of rows){
    for(const q of ((row.generated&&row.generated.practiceQuestions)||[])){
      if(!courseObj.questionBank.some(x=>x.id===q.id)){courseObj.questionBank.push(q);added++;}
    }
  }
  return added;
}
window.MajickMaterialStore={save,list,remove,newRecord,injectQuestions};
})();