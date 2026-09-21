(function(){
'use strict';

const DB='majick-studies-sources-v1';
const STORE='sources';
const FALLBACK='majick-study-materials-v1';
const deletedIds=new Set();

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
  // A late Tutor hydration must never resurrect a source the learner deleted.
  if(deletedIds.has(row.id))return null;
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
  if(!id)return;
  deletedIds.add(id);
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

async function migrateCourseId(fromCourseId,toCourseId){
  fromCourseId=String(fromCourseId||'').trim();
  toCourseId=String(toCourseId||'').trim();
  if(!fromCourseId||!toCourseId||fromCourseId===toCourseId)return {migrated:0};
  const rows=await list(fromCourseId);
  let migrated=0;
  for(const row of rows){
    if(row.courseId!==fromCourseId)continue;
    row.courseId=toCourseId;
    await save(row);
    migrated++;
  }
  return {migrated};
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
function qsig(q){
  return (String(q?.prompt||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+'|'+
    String(q?.answer||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim());
}
function roundRobinBySource(rows,rigor,limit){
  const queues=rows.map(row=>({
    row,
    qs:((row.generated&&row.generated.practiceQuestions)||[]).filter(q=>Number(q.rigorLevel||1)===rigor)
  }));
  const out=[],seen=new Set();
  let advanced=true;
  while(out.length<limit&&advanced){
    advanced=false;
    for(const bucket of queues){
      const q=bucket.qs.shift();
      if(!q)continue;
      advanced=true;
      const sig=qsig(q);
      if(seen.has(sig))continue;
      seen.add(sig);
      out.push({q,row:bucket.row});
      if(out.length>=limit)break;
    }
  }
  return out;
}
async function syncQuestions(courseObj,courseId){
  if(!courseObj||!Array.isArray(courseObj.questionBank))return {added:0,removed:0,total:0,target:100};

  const rows=await list(courseId);
  const activeRows=rows.filter(r=>r.active!==false)
    .sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));

  const before=courseObj.questionBank.length;
  courseObj.questionBank=courseObj.questionBank.filter(q=>!isNotesForgeQuestion(q)&&!String(q?.id||'').startsWith('d772_wgu_'));
  const removed=before-courseObj.questionBank.length;

  // D772 uses the curated concept-and-scenario bank instead of generic note-matching prompts.
  if(String(courseId)==='D772'&&window.MajickQuestionBuilder?.d772Questions){
    const sourceId=activeRows[0]?.id||'d772-master-section-1';
    const sourceName=activeRows[0]?.sourceName||'D772 Section 1 Master Notes';
    const curated=MajickQuestionBuilder.d772Questions(sourceId)
      .filter(q=>!MajickQuestionBuilder.isLowValueMetaQuestion?.(q));
    // D772 Section 1 has one authoritative concept-first practice bank.
    // Do not mix legacy generic questions back into Study Now.
    courseObj.questionBank=[];
    for(const q of curated){
      courseObj.questionBank.push(Object.assign({},q,{
        courseId:'D772',
        sourceId,
        sourceName,
        sourceType:activeRows[0]?.sourceType||'built-in-master-notes',
        managedBy:'d772-wgu-concept-bank',
        bankTarget:curated.length
      }));
    }
    return {
      added:curated.length,
      removed,
      total:curated.length,
      available:curated.length,
      target:curated.length,
      activeSources:activeRows.length,
      rigorMix:[1,2,3,4].reduce((o,r)=>(o[r]=curated.filter(q=>Number(q.rigorLevel||1)===r).length,o),{}),
      questionStyle:'wgu-concept-scenario'
    };
  }

  const target=100;
  const quotas={1:20,2:30,3:30,4:20};
  const selected=[],globalSeen=new Set();
  for(const rigor of [1,2,3,4]){
    for(const item of roundRobinBySource(activeRows,rigor,quotas[rigor])){
      const sig=qsig(item.q);
      if(globalSeen.has(sig))continue;
      globalSeen.add(sig);selected.push(item);
    }
  }
  if(selected.length<target){
    for(const row of activeRows){
      for(const q of ((row.generated&&row.generated.practiceQuestions)||[])){
        if(selected.length>=target)break;
        const sig=qsig(q);
        if(globalSeen.has(sig))continue;
        globalSeen.add(sig);selected.push({q,row});
      }
      if(selected.length>=target)break;
    }
  }

  let added=0;
  for(const {q,row} of selected.slice(0,110)){
    const next=Object.assign({},q,{
      courseId:String(courseId||row.courseId||''),
      sourceId:row.id,
      sourceName:row.sourceName,
      sourceType:row.sourceType,
      managedBy:'notes-forge',
      bankTarget:target,
      learningPathLessonId:q.learningPathLessonId||row.learningPath?.lessonId||null,
      learningPathLessonTitle:q.learningPathLessonTitle||row.learningPath?.lessonTitle||null,
      learningPathSectionId:q.learningPathSectionId||row.learningPath?.sectionId||null
    });
    if(!courseObj.questionBank.some(x=>x.id===next.id)){
      courseObj.questionBank.push(next);added++;
    }
  }

  return {
    added,removed,
    total:courseObj.questionBank.filter(isNotesForgeQuestion).length,
    available:selected.length,
    target,
    activeSources:activeRows.length,
    rigorMix:[1,2,3,4].reduce((o,r)=>(o[r]=courseObj.questionBank.filter(q=>isNotesForgeQuestion(q)&&Number(q.rigorLevel||1)===r).length,o),{})
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
  migrateCourseId,
  isNotesForgeQuestion
};
})();
