(function(){
'use strict';

const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};

function courseOptions(){
  const rows=[];
  let current=null;
  try{current=typeof course==='function'?course():null}catch(_){}
  try{
    const src=window.S?.courses||window.COURSES||window.COURSE_DATA||{};
    Object.entries(src).forEach(([id,c])=>rows.push({id:c.id||id,title:c.title||c.name||id}));
  }catch(_){}
  if(current&&!rows.some(x=>x.id===current.id))rows.unshift({id:current.id,title:current.title||current.id});
  rows.sort((a,b)=>{
    if(a.id===window.S?.activeCourse)return -1;
    if(b.id===window.S?.activeCourse)return 1;
    return String(a.id).localeCompare(String(b.id));
  });
  return rows.length?rows:[{id:'current',title:'Current WGU Course'}];
}

function outputChecks(){
  return [
    ['matQ','Practice Questions'],
    ['matE','Explanations'],
    ['matV','Vocabulary'],
    ['matM','Misconception Repair'],
    ['matR','Review']
  ].map(x=>'<label><input id="'+x[0]+'" type="checkbox" checked> '+x[1]+'</label>').join('');
}

function render(){
  const opts=courseOptions();
  return '<section class="v3315Material">'+
    '<header class="v3315MaterialHero"><div><div class="eyebrow">MOONLIT STUDY DESK • NOTES FORGE</div><h2>Add Study Material</h2><p>Turn your own WGU notes and documents into extra practice built around the course you are studying.</p></div><span class="v3315ForgeSigil">✦</span></header>'+
    '<div class="v3315MaterialGrid">'+
      '<section class="v3315SourceCard">'+
        '<h3>1. Choose your course</h3>'+
        '<select id="materialCourse">'+opts.map(x=>'<option value="'+E(x.id)+'" '+(x.id===window.S?.activeCourse?'selected':'')+'>'+E((window.MajickCourseManager?.record?.(x.id)?.status==='passed'?'✓ ':'')+x.id+' • '+x.title)+'</option>').join('')+'</select>'+
        '<h3>2. Add your notes</h3>'+
        '<div class="v3315UploadRow">'+
          '<label class="v3315Drop"><span>⬆</span><b>Upload File</b><small>PDF • Word DOCX • TXT • MD</small><input id="materialFile" type="file" accept=".pdf,.docx,.txt,.md"></label>'+
          '<div class="v3315Or">OR</div>'+
          '<label class="v3315Paste"><b>Paste Notes</b><textarea id="materialPaste" rows="9" placeholder="Paste lecture notes, study notes, a rubric, textbook notes, or your own review here…"></textarea></label>'+
        '</div>'+
        '<div id="materialStatus" class="v3315Status" aria-live="polite">Nothing added yet.</div>'+
      '</section>'+
      '<aside class="v3315ForgeCard">'+
        '<h3>3. What should Majick build?</h3>'+
        '<div class="v3315Checks">'+outputChecks()+'</div>'+
        '<label class="v3315Count">Question count <select id="materialCount"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>25</option></select></label>'+
        '<button class="btn primary v3315ForgeButton" id="materialForgeBtn">✦ Forge Study Material</button>'+
        '<p class="v3315Small">Generated questions stay linked to the source that created them. Only active sources feed that course\'s practice bank.</p>'+
      '</aside>'+
    '</div>'+
    '<section class="v3315Preview"><div class="sectionTitle"><div><h3>Generated Study Set</h3><p>Open or forge a source to preview its practice, vocabulary, explanations, and review.</p></div></div><div id="materialPreview"><div class="v3315Empty">No generated set yet.</div></div></section>'+
    '<section class="v3315Library"><div class="sectionTitle"><div><h3>My Study Sources</h3><p>Each course keeps its own source library. Reopen, pause, regenerate, or remove a source at any time.</p></div></div><div id="materialLibrary"><div class="v3315Empty">No saved sources yet.</div></div></section>'+
  '</section>';
}

function values(){
  return {
    practiceQuestions:document.getElementById('matQ')?.checked!==false,
    explanations:document.getElementById('matE')?.checked!==false,
    vocabulary:document.getElementById('matV')?.checked!==false,
    misconceptionRepair:document.getElementById('matM')?.checked!==false,
    review:document.getElementById('matR')?.checked!==false
  };
}

function selectedCourseId(){
  return document.getElementById('materialCourse')?.value||window.S?.activeCourse||'';
}

function courseForId(courseId){
  try{
    if(window.S?.courses?.[courseId])return window.S.courses[courseId];
    const c=typeof course==='function'?course():null;
    return c?.id===courseId?c:null;
  }catch(_){return null}
}

function setStatus(message,html=false){
  const status=document.getElementById('materialStatus');
  if(!status)return;
  if(html)status.innerHTML=message;
  else status.textContent=message;
}

function applyOutputs(outputs){
  const map={matQ:'practiceQuestions',matE:'explanations',matV:'vocabulary',matM:'misconceptionRepair',matR:'review'};
  for(const [id,key] of Object.entries(map)){
    const el=document.getElementById(id);
    if(el)el.checked=outputs?.[key]!==false;
  }
}

function showPreview(g){
  const box=document.getElementById('materialPreview');
  if(!box)return;
  if(!g){
    box.innerHTML='<div class="v3315Empty">No generated set yet.</div>';
    return;
  }
  const cards=[];
  if(g.practiceQuestions?.length)cards.push('<article><b>Practice Questions • '+g.practiceQuestions.length+'</b>'+g.practiceQuestions.slice(0,4).map(q=>'<p>'+E(q.prompt)+'</p>').join('')+'</article>');
  if(g.vocabulary?.length)cards.push('<article><b>Vocabulary • '+g.vocabulary.length+'</b>'+g.vocabulary.slice(0,6).map(v=>'<p><strong>'+E(v.term)+':</strong> '+E(v.definition)+'</p>').join('')+'</article>');
  if(g.explanations?.length)cards.push('<article><b>Explanations</b>'+g.explanations.slice(0,4).map(v=>'<p><strong>'+E(v.concept)+':</strong> '+E(v.explanation)+'</p>').join('')+'</article>');
  if(g.misconceptionRepair?.length)cards.push('<article><b>Misconception Repair</b>'+g.misconceptionRepair.slice(0,3).map(v=>'<p>'+E(v.correction)+'</p>').join('')+'</article>');
  if(g.review)cards.push('<article><b>Review</b><p>'+E(g.review.summary)+'</p></article>');
  box.innerHTML='<div class="v3315PreviewGrid">'+cards.join('')+'</div>';
}

async function syncCourse(courseId){
  const c=courseForId(courseId);
  if(!c||!window.MajickMaterialStore)return null;
  const result=await MajickMaterialStore.syncQuestions(c,courseId);
  try{save()}catch(_){}
  return result;
}

function addGeneratedCourseMetadata(courseId,row){
  const c=courseForId(courseId);
  if(!c)return;
  c.glossary=c.glossary||{};
  (row.generated?.vocabulary||[]).forEach(v=>{
    if(v?.term&&v?.definition)c.glossary[v.term]=v.definition;
  });
  c.concepts=c.concepts||[];
  if(!c.concepts.some(x=>x.id==='uploaded-notes')){
    c.concepts.push({id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'});
  }
  c.sources=c.sources||[];
  const meta={id:row.id,name:row.sourceName,note:'Uploaded through Notes Forge',type:row.sourceType,active:row.active!==false};
  const at=c.sources.findIndex(x=>x.id===row.id);
  if(at>=0)c.sources[at]=meta;else c.sources.push(meta);
}

async function openSource(id){
  const row=await MajickMaterialStore.get(id);
  if(!row)return;
  const select=document.getElementById('materialCourse');
  if(select&&[...select.options].some(o=>o.value===row.courseId))select.value=row.courseId;
  const paste=document.getElementById('materialPaste');
  if(paste)paste.value=row.text||'';
  const file=document.getElementById('materialFile');
  if(file)file.value='';
  applyOutputs(row.outputs||{});
  const count=document.getElementById('materialCount');
  if(count){
    const n=String(row.settings?.count||row.generated?.practiceQuestions?.length||10);
    if([...count.options].some(o=>o.value===n))count.value=n;
  }
  showPreview(row.generated);
  setStatus('Opened '+row.sourceName+' • '+(row.active===false?'paused':'active')+' for '+row.courseId+'.');
  await refreshLibrary();
}

async function regenerateSource(id){
  const row=await MajickMaterialStore.get(id);
  if(!row)return;
  setStatus('Regenerating '+row.sourceName+'…');
  const opts=row.outputs||values();
  const count=Number(row.settings?.count||row.generated?.practiceQuestions?.length||10);
  row.generated=MajickQuestionBuilder.build(row.text,{
    ...opts,
    count,
    courseId:row.courseId,
    sourceId:row.id
  });
  row.settings={...(row.settings||{}),count};
  await MajickMaterialStore.save(row);
  addGeneratedCourseMetadata(row.courseId,row);
  await syncCourse(row.courseId);
  showPreview(row.generated);
  setStatus('✓ Regenerated '+row.generated.practiceQuestions.length+' questions from '+row.sourceName+'.');
  await refreshLibrary();
}

async function toggleSource(id){
  const row=await MajickMaterialStore.get(id);
  if(!row)return;
  const updated=await MajickMaterialStore.setActive(id,row.active===false);
  if(updated){
    const c=courseForId(updated.courseId);
    if(c?.sources){
      const meta=c.sources.find(x=>x.id===id);
      if(meta)meta.active=updated.active!==false;
    }
    const result=await syncCourse(updated.courseId);
    setStatus((updated.active!==false?'Activated ':'Paused ')+updated.sourceName+' • '+(result?.total||0)+' active Notes Forge questions in '+updated.courseId+'.');
  }
  await refreshLibrary();
}

async function removeSource(id){
  const row=await MajickMaterialStore.get(id);
  if(!row)return;
  await MajickMaterialStore.remove(id);
  const c=courseForId(row.courseId);
  if(c?.sources)c.sources=c.sources.filter(x=>x.id!==id);
  const result=await syncCourse(row.courseId);
  showPreview(null);
  setStatus('Removed '+row.sourceName+' from '+row.courseId+' • '+(result?.total||0)+' Notes Forge questions remain active.');
  await refreshLibrary();
}

async function refreshLibrary(){
  const box=document.getElementById('materialLibrary');
  if(!box||!window.MajickMaterialStore)return;
  const cid=selectedCourseId();
  const rows=await MajickMaterialStore.list(cid);
  if(!rows.length){
    box.innerHTML='<div class="v3315Empty">No saved sources for this course yet.</div>';
    return;
  }
  box.innerHTML=rows.map(r=>{
    const active=r.active!==false;
    return '<article class="v3315SourceRow '+(active?'':'paused')+'" data-source="'+E(r.id)+'">'+
      '<div><b>'+E(r.sourceName)+'</b><small>'+E(String(r.sourceType||'').toUpperCase())+' • '+new Date(r.createdAt).toLocaleDateString()+' • '+(r.generated?.practiceQuestions?.length||0)+' questions • '+(active?'ACTIVE':'PAUSED')+'</small></div>'+
      '<div class="v3315SourceActions">'+
        '<button class="btn ghost v3315OpenSource" type="button">Open</button>'+
        '<button class="btn ghost v3315RegenerateSource" type="button">Regenerate</button>'+
        '<button class="btn ghost v3315ToggleSource" type="button">'+(active?'Pause':'Activate')+'</button>'+
        '<button class="btn ghost v3315RemoveSource" type="button">Remove</button>'+
      '</div>'+
    '</article>';
  }).join('');

  box.querySelectorAll('.v3315OpenSource').forEach(btn=>btn.addEventListener('click',()=>openSource(btn.closest('[data-source]')?.dataset.source)));
  box.querySelectorAll('.v3315RegenerateSource').forEach(btn=>btn.addEventListener('click',()=>regenerateSource(btn.closest('[data-source]')?.dataset.source)));
  box.querySelectorAll('.v3315ToggleSource').forEach(btn=>btn.addEventListener('click',()=>toggleSource(btn.closest('[data-source]')?.dataset.source)));
  box.querySelectorAll('.v3315RemoveSource').forEach(btn=>btn.addEventListener('click',()=>removeSource(btn.closest('[data-source]')?.dataset.source)));
}

async function forge(){
  const file=document.getElementById('materialFile')?.files?.[0];
  const pasted=document.getElementById('materialPaste')?.value||'';
  const courseId=selectedCourseId();
  const btn=document.getElementById('materialForgeBtn');
  try{
    if(btn)btn.disabled=true;
    if(!courseId)throw new Error('Choose a WGU course first.');
    if(!courseForId(courseId))throw new Error('That course is not available in Majick Studies.');
    setStatus('Reading your material…');
    const parsed=await MajickMaterialParser.extract(file,pasted);
    if(parsed.text.length<80)throw new Error('The material is too short to build a useful study set. Add a little more detail.');
    const opts=values();
    const count=Number(document.getElementById('materialCount')?.value||10);
    const draft=MajickMaterialStore.newRecord({
      courseId,
      sourceType:parsed.sourceType,
      sourceName:parsed.name,
      text:parsed.text,
      outputs:opts
    });
    draft.settings={count};
    setStatus('Forging questions, explanations, vocabulary and review…');
    draft.generated=MajickQuestionBuilder.build(parsed.text,{
      ...opts,
      count,
      courseId,
      sourceId:draft.id
    });
    await MajickMaterialStore.save(draft);
    addGeneratedCourseMetadata(courseId,draft);
    const synced=await syncCourse(courseId);
    setStatus('<b>✓ Study material saved.</b> '+draft.generated.practiceQuestions.length+' questions forged • '+(synced?.total||0)+' active Notes Forge questions in '+courseId+'.',true);
    showPreview(draft.generated);
    await refreshLibrary();
  }catch(err){
    setStatus(err?.message||'Majick could not read that material.');
  }finally{
    if(btn)btn.disabled=false;
  }
}

function bind(){
  const root=document.querySelector('.v3315Material');
  if(!root||root.__bound)return;
  root.__bound=true;
  document.getElementById('materialForgeBtn')?.addEventListener('click',forge);
  document.getElementById('materialCourse')?.addEventListener('change',()=>{
    showPreview(null);
    setStatus('Showing saved sources for '+selectedCourseId()+'.');
    refreshLibrary();
  });
  document.getElementById('materialFile')?.addEventListener('change',e=>{
    const f=e.target.files?.[0];
    setStatus(f?'Ready: '+f.name:'Nothing added yet.');
  });
  refreshLibrary();
}

window.AddStudyMaterialPage={render,bind,refreshLibrary,openSource,regenerateSource,toggleSource,removeSource};
window.v3315BindStudyMaterialPage=bind;
})();