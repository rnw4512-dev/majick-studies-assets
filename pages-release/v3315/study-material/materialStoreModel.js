(function(){
'use strict';

const DB='majick-studies-sources-v1';
const STORE='sources';
const FALLBACK='majick-study-materials-v1';

function openDb(){
  return new Promise((resolve,reject)=>{
    if(!window.indexedDB){resolve(null);return;}
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=()=>{
      if(!req.result.objectStoreNames.contains(STORE)){
        req.result.createObjectStore(STORE,{keyPath:'id'});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
function fallbackRead(){
  try{return JSON.parse(localStorage.getItem(FALLBACK)||'[]')}
  catch(_){return[]}
}
function fallbackWrite(rows){
  localStorage.setItem(FALLBACK,JSON.stringify(rows.slice(-35)));
}

async function save(record){
  const row=Object.assign({},record,{updatedAt:new Date().toISOString()});
  try{
    const db=await openDb();
    if(!db)throw new Error('fallback');
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).put(row);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
    db.close();
    return row;
  }catch(_){
    const rows=fallbackRead().filter(x=>x.id!==row.id);
    rows.push(row);
    fallbackWrite(rows);
    return row;
  }
}

async function get(id){
  if(!id)return null;
  try{
    const db=await openDb();
    if(!db)throw new Error('fallback');
    const row=await new Promise((resolve,reject)=>{
      const req=db.transaction(STORE).objectStore(STORE).get(id);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
    });
    db.close();
    return row;
  }catch(_){
    return fallbackRead().find(x=>x.id===id)||null;
  }
}

async function list(courseId){
  let rows=[];
  try{
    const db=await openDb();
    if(!db)throw new Error('fallback');
    rows=await new Promise((resolve,reject)=>{
      const req=db.transaction(STORE).objectStore(STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
    db.close();
  }catch(_){
    rows=fallbackRead();
  }
  if(courseId)rows=rows.filter(x=>x.courseId===courseId);
  return rows.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}

async function remove(id){
  try{
    const db=await openDb();
    if(!db)throw new Error('fallback');
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
    });
    db.close();
  }catch(_){
    fallbackWrite(fallbackRead().filter(x=>x.id!==id));
  }
}

async function setActive(id,active){
  const row=await get(id);
  if(!row)return null;
  row.active=active!==false;
  return save(row);
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

function isNotesForgeQuestion(q){
  return !!(
    q &&
    typeof q.id==='string' &&
    q.id.startsWith('notes_') &&
    q.sourceId
  );
}

// Make Notes Forge questions a synchronized view of ACTIVE sources for one course.
// This removes questions from deleted/inactive sources before re-adding active ones.
async function syncQuestions(courseObj,courseId){
  if(!courseObj||!Array.isArray(courseObj.questionBank))return {added:0,removed:0,total:0};

  const rows=await list(courseId);
  const activeRows=rows.filter(r=>r.active!==false);

  const before=courseObj.questionBank.length;
  courseObj.questionBank=courseObj.questionBank.filter(q=>!isNotesForgeQuestion(q));
  const removed=before-courseObj.questionBank.length;

  let added=0;
  for(const row of activeRows){
    for(const q of ((row.generated&&row.generated.practiceQuestions)||[])){
      const next=Object.assign({},q,{
        courseId:String(courseId||row.courseId||''),
        sourceId:row.id,
        sourceName:row.sourceName,
        sourceType:row.sourceType,
        managedBy:'notes-forge'
      });
      if(!courseObj.questionBank.some(x=>x.id===next.id)){
        courseObj.questionBank.push(next);
        added++;
      }
    }
  }

  return {
    added,
    removed,
    total:courseObj.questionBank.filter(isNotesForgeQuestion).length,
    activeSources:activeRows.length
  };
}

// Backward-compatible name used by the current V3.3.17 bridge.
async function injectQuestions(courseObj,courseId){
  const result=await syncQuestions(courseObj,courseId);
  return result.added;
}

window.MajickMaterialStore={
  save,
  get,
  list,
  remove,
  setActive,
  newRecord,
  syncQuestions,
  injectQuestions,
  isNotesForgeQuestion
};
})();