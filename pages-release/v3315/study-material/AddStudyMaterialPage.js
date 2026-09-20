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
        '<p class="v3315Small">Generated questions stay linked to the source that created them, so explanations can point back to your notes.</p>'+
      '</aside>'+
    '</div>'+
    '<section class="v3315Preview"><div class="sectionTitle"><div><h3>Generated Study Set</h3><p>Your generated practice appears here after Majick reads the source.</p></div></div><div id="materialPreview"><div class="v3315Empty">No generated set yet.</div></div></section>'+
    '<section class="v3315Library"><div class="sectionTitle"><div><h3>My Study Sources</h3><p>Saved sources can be reopened or removed later.</p></div></div><div id="materialLibrary"><div class="v3315Empty">No saved sources yet.</div></div></section>'+
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

function showPreview(g){
  const box=document.getElementById('materialPreview');
  if(!box)return;
  const cards=[];
  if(g.practiceQuestions?.length)cards.push('<article><b>Practice Questions • '+g.practiceQuestions.length+'</b>'+g.practiceQuestions.slice(0,4).map(q=>'<p>'+E(q.prompt)+'</p>').join('')+'</article>');
  if(g.vocabulary?.length)cards.push('<article><b>Vocabulary • '+g.vocabulary.length+'</b>'+g.vocabulary.slice(0,6).map(v=>'<p><strong>'+E(v.term)+':</strong> '+E(v.definition)+'</p>').join('')+'</article>');
  if(g.explanations?.length)cards.push('<article><b>Explanations</b>'+g.explanations.slice(0,4).map(v=>'<p><strong>'+E(v.concept)+':</strong> '+E(v.explanation)+'</p>').join('')+'</article>');
  if(g.misconceptionRepair?.length)cards.push('<article><b>Misconception Repair</b>'+g.misconceptionRepair.slice(0,3).map(v=>'<p>'+E(v.correction)+'</p>').join('')+'</article>');
  if(g.review)cards.push('<article><b>Review</b><p>'+E(g.review.summary)+'</p></article>');
  box.innerHTML='<div class="v3315PreviewGrid">'+cards.join('')+'</div>';
}

async function refreshLibrary(){
  const box=document.getElementById('materialLibrary');
  if(!box||!window.MajickMaterialStore)return;
  const cid=document.getElementById('materialCourse')?.value||'';
  const rows=await MajickMaterialStore.list(cid);
  if(!rows.length){box.innerHTML='<div class="v3315Empty">No saved sources for this course yet.</div>';return;}
  box.innerHTML=rows.map(r=>
    '<article class="v3315SourceRow" data-source="'+E(r.id)+'">'+
      '<div><b>'+E(r.sourceName)+'</b><small>'+E(String(r.sourceType||'').toUpperCase())+' • '+new Date(r.createdAt).toLocaleDateString()+' • '+(r.generated?.practiceQuestions?.length||0)+' questions</small></div>'+
      '<button class="btn ghost v3315RemoveSource" type="button">Remove</button>'+
    '</article>'
  ).join('');
  box.querySelectorAll('.v3315RemoveSource').forEach(btn=>btn.addEventListener('click',async()=>{
    const id=btn.closest('[data-source]')?.dataset.source;
    if(id){await MajickMaterialStore.remove(id);await refreshLibrary();}
  }));
}

async function forge(){
  const status=document.getElementById('materialStatus');
  const file=document.getElementById('materialFile')?.files?.[0];
  const pasted=document.getElementById('materialPaste')?.value||'';
  const courseId=document.getElementById('materialCourse')?.value||'';
  const btn=document.getElementById('materialForgeBtn');
  try{
    if(btn)btn.disabled=true;
    if(status)status.textContent='Reading your material…';
    const parsed=await MajickMaterialParser.extract(file,pasted);
    if(parsed.text.length<80)throw new Error('The material is too short to build a useful study set. Add a little more detail.');
    const opts=values();
    const draft=MajickMaterialStore.newRecord({
      courseId,
      sourceType:parsed.sourceType,
      sourceName:parsed.name,
      text:parsed.text,
      outputs:opts
    });
    if(status)status.textContent='Forging questions, explanations, vocabulary and review…';
    draft.generated=MajickQuestionBuilder.build(parsed.text,{
      ...opts,
      count:Number(document.getElementById('materialCount')?.value||10),
      courseId,
      sourceId:draft.id
    });
    await MajickMaterialStore.save(draft);
    try{
      const c=window.S?.courses?.[courseId]||(typeof course==='function'?course():null);
      if(c&&c.id===courseId){
        c.glossary=c.glossary||{};
        (draft.generated.vocabulary||[]).forEach(v=>{if(v?.term&&v?.definition)c.glossary[v.term]=v.definition;});
        c.concepts=c.concepts||[];
        if(!c.concepts.some(x=>x.id==='uploaded-notes'))c.concepts.push({id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'});
        c.sources=c.sources||[];
        if(!c.sources.some(x=>x.id===draft.id))c.sources.push({id:draft.id,name:draft.sourceName,note:'Uploaded through Notes Forge',type:draft.sourceType});
        await MajickMaterialStore.injectQuestions(c,courseId);
        try{save()}catch(_){}
      }
    }catch(_){}
    if(status)status.innerHTML='<b>✓ Study material saved.</b> '+draft.generated.practiceQuestions.length+' new practice questions are ready.';
    showPreview(draft.generated);
    await refreshLibrary();
  }catch(err){
    if(status)status.textContent=err?.message||'Majick could not read that material.';
  }finally{
    if(btn)btn.disabled=false;
  }
}

function bind(){
  const root=document.querySelector('.v3315Material');
  if(!root||root.__bound)return;
  root.__bound=true;
  document.getElementById('materialForgeBtn')?.addEventListener('click',forge);
  document.getElementById('materialCourse')?.addEventListener('change',refreshLibrary);
  document.getElementById('materialFile')?.addEventListener('change',e=>{
    const s=document.getElementById('materialStatus');
    const f=e.target.files?.[0];
    if(s)s.textContent=f?'Ready: '+f.name:'Nothing added yet.';
  });
  refreshLibrary();
}

window.AddStudyMaterialPage={render,bind};
window.v3315BindStudyMaterialPage=bind;
})();