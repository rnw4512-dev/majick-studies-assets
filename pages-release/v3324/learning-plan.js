(function(){
'use strict';
if(!window.MajickLearningLab)return;
const VERSION='3.3.24';
const sourceCache={};
function E(s){try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}}
function cid(){return String(window.S?.activeCourse||'D755')}
function course(id=cid()){return window.S?.courses?.[id]||{questionBank:[]}}
function state(id=cid()){
  const s=MajickLearningLab.state(id);
  s.readPassages=Array.isArray(s.readPassages)?s.readPassages:[];
  s.readingIndex=Number(s.readingIndex||0);
  return s;
}
async function hydrate(id=cid()){
  sourceCache[id]=window.MajickMaterialStore?await MajickMaterialStore.list(id):[];
  renderPlan();renderRead();
  return sourceCache[id];
}
function passageList(id=cid()){
  const out=[],seen=new Set();
  for(const row of (sourceCache[id]||[])){
    if(row.active===false)continue;
    for(const p of (row.generated?.passages||[])){
      if(!p?.id||seen.has(p.id))continue;
      seen.add(p.id);out.push({...p,sourceName:row.sourceName});
    }
  }
  if(!out.length){
    for(const l of MajickLearningLab.lessons(id)||[]){
      const key='starter_'+String(l.title||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
      if(seen.has(key))continue;seen.add(key);
      out.push({id:key,title:l.title,text:l.explain,keyIdea:l.explain,keyTerms:[],sourceName:l.source||'Majick starter'});
    }
  }
  return out;
}
function profile(id=cid()){
  const m=MajickLearningLab.mastery(id);
  const qs=(course(id).questionBank||[]).filter(q=>q.managedBy==='notes-forge');
  const st=state(id),passages=passageList(id);
  const vocab=MajickLearningLab.vocab(id);
  const known=vocab.filter(v=>st.knownVocab.includes(v.term)).length;
  const by={};
  for(const t of m.topics){
    let target=1;
    if(t.attempts>=2&&t.accuracy>=55)target=2;
    if(t.attempts>=3&&t.accuracy>=72)target=3;
    if(t.attempts>=5&&t.accuracy>=86)target=4;
    by[t.topic]={...t,targetRigor:target};
  }
  const weak=Object.values(by).filter(x=>x.attempts>=2&&x.accuracy<75).sort((a,b)=>a.accuracy-b.accuracy);
  const read=new Set(st.readPassages);
  let phase='Build vocabulary';
  if(vocab.length&&known/vocab.length>=.65)phase='Read & explain';
  if(passages.length&&passages.filter(p=>read.has(p.id)).length/Math.max(1,passages.length)>=.6)phase='Guided application';
  if(m.attempts>=15)phase='Adaptive practice';
  if(m.attempts>=30&&(!weak.length))phase='Rigor & mastery';
  return {
    mastery:m,questions:qs,passages,vocab,known,by,weak,phase,
    readCount:passages.filter(p=>read.has(p.id)).length,
    sourceCount:(sourceCache[id]||[]).filter(r=>r.active!==false).length,
    rigor:[1,2,3,4].map(r=>qs.filter(q=>Number(q.rigorLevel||1)===r).length)
  };
}
function recommendation(id=cid()){
  const p=profile(id);
  if(p.vocab.length&&p.known/p.vocab.length<.65)return 'Learn the class vocabulary first, then play Vocab Constellation.';
  if(p.passages.length&&p.readCount<p.passages.length)return 'Read the next course passage and explain the key idea in your own words.';
  if(p.weak.length)return 'Re-read the passage connected to '+p.weak[0].topic+', then retry it at a lower rigor before moving back up.';
  if(p.mastery.attempts<15)return 'Do guided application questions so Majick can learn your strengths and gaps.';
  return 'Continue adaptive practice. Strong concepts will move toward application and analysis; weak concepts will cycle back through explanation.';
}
function show(name){
  document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
  const panel=document.querySelector('.learnPanel[data-panel="'+name+'"]');
  if(panel)panel.hidden=false;
  document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-plan-tab="'+name+'"]')?.classList.add('active');
  if(name==='plan')renderPlan();
  if(name==='read')renderRead();
}
function renderPlan(){
  const box=document.getElementById('learningPlanPanel');if(!box)return;
  const id=cid(),p=profile(id);
  const accuracy=p.mastery.attempts?Math.round(p.mastery.correct/p.mastery.attempts*100):0;
  box.innerHTML='<div class="planHero"><div><span>PERSONAL LEARNING PLAN • '+E(id)+'</span><h3>'+E(p.phase)+'</h3><p>'+E(recommendation(id))+'</p></div><button class="btn primary" id="planStartRead">Read next passage →</button></div>'+
    '<div class="planStats"><article><b>'+p.sourceCount+'</b><span>active lesson sources</span></article><article><b>'+p.passages.length+'</b><span>reading passages</span></article><article><b>'+p.questions.length+'</b><span>adaptive questions</span></article><article><b>'+accuracy+'%</b><span>practice accuracy</span></article></div>'+
    '<div class="planPath">'+
      [['1','Vocabulary','Learn the language of the class.',p.known+'/'+p.vocab.length+' known'],
       ['2','Read & Explain','Short course passages built from your notes.',p.readCount+'/'+p.passages.length+' read'],
       ['3','Guided Practice','Use hints and source-linked explanations.',p.mastery.attempts+' attempts'],
       ['4','Apply & Analyze','Scenario and evidence-based questions.',p.rigor[2]+p.rigor[3]+' higher-rigor questions'],
       ['5','Master & Review','Weak ideas return; strong ideas get harder.',p.weak.length+' weak concepts']
      ].map(x=>'<article><i>'+x[0]+'</i><div><b>'+x[1]+'</b><p>'+x[2]+'</p><small>'+x[3]+'</small></div></article>').join('')+
    '</div>'+
    '<div class="rigorMap"><h4>Question rigor available now</h4><div>'+['Foundation','Understand','Apply','Analyze / OA-style'].map((n,i)=>'<span><b>'+p.rigor[i]+'</b>'+n+'</span>').join('')+'</div></div>';
  document.getElementById('planStartRead')?.addEventListener('click',()=>show('read'));
}
function renderRead(){
  const box=document.getElementById('readLearnPanel');if(!box)return;
  const rows=passageList(),st=state();
  if(!rows.length){box.innerHTML='<div class="learnEmpty">Add class notes and Majick will build readable lesson passages here.</div>';return}
  st.readingIndex=Math.max(0,Math.min(rows.length-1,st.readingIndex));
  const p=rows[st.readingIndex],read=st.readPassages.includes(p.id);
  const linked=(course().questionBank||[]).filter(q=>q.passageId===p.id).slice(0,4);
  box.innerHTML='<div class="readTop"><div><span>READ & LEARN • PASSAGE '+(st.readingIndex+1)+' OF '+rows.length+'</span><h3>'+E(p.title)+'</h3><small>'+E(p.sourceName||'Course material')+'</small></div><div class="readStatus">'+(read?'✓ Read':'Not read yet')+'</div></div>'+
    '<article class="coursePassage"><p>'+E(p.text)+'</p></article>'+
    '<div class="passageSupport"><section><h4>Key idea</h4><p>'+E(p.keyIdea||p.text)+'</p></section><section><h4>Key terms</h4><div class="passageTerms">'+((p.keyTerms||[]).length?(p.keyTerms||[]).map(t=>'<span>'+E(t)+'</span>').join(''):'<span>Use the vocabulary deck for this lesson.</span>')+'</div></section></div>'+
    (linked.length?'<section class="passageChecks"><h4>Check your understanding</h4>'+linked.map(q=>'<details><summary>'+E(q.prompt)+'</summary><p><b>Answer:</b> '+E(q.answer)+'</p><p>'+E(q.why||'')+'</p></details>').join('')+'</section>':'')+
    '<div class="readNav"><button class="btn ghost" id="readPrev" '+(st.readingIndex===0?'disabled':'')+'>← Previous</button><button class="btn ghost" id="markRead">'+(read?'✓ Marked read':'Mark passage read')+'</button><button class="btn primary" id="readNext">'+(st.readingIndex===rows.length-1?'Go to guided practice →':'Next passage →')+'</button></div>';
  document.getElementById('readPrev')?.addEventListener('click',()=>{st.readingIndex=Math.max(0,st.readingIndex-1);try{save()}catch(_){}renderRead()});
  document.getElementById('markRead')?.addEventListener('click',()=>{if(!st.readPassages.includes(p.id))st.readPassages.push(p.id);try{save()}catch(_){}renderRead()});
  document.getElementById('readNext')?.addEventListener('click',()=>{
    if(!st.readPassages.includes(p.id))st.readPassages.push(p.id);
    if(st.readingIndex<rows.length-1){st.readingIndex++;try{save()}catch(_){}renderRead()}
    else MajickLearningLab.showTab('practice');
  });
}
const baseRender=MajickLearningLab.render;
MajickLearningLab.render=function(){
  let h=baseRender();
  h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-plan-tab="plan">Learning Plan</button><button type="button" data-plan-tab="read">Read & Learn</button>');
  h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="plan"><div id="learningPlanPanel"></div></section><section class="learnPanel" data-panel="read" hidden><div id="readLearnPanel"></div></section>');
  return h;
};
const baseBind=MajickLearningLab.bind;
MajickLearningLab.bind=function(){
  baseBind();
  document.querySelectorAll('[data-plan-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.planTab)}));
  hydrate().then(()=>show('plan'));
};
const baseRefresh=MajickLearningLab.refresh;
MajickLearningLab.refresh=function(){baseRefresh();hydrate()};
MajickLearningLab.learningPlan=profile;
MajickLearningLab.passages=passageList;
window.MajickLearningPlan={VERSION,hydrate,profile,recommendation,passageList,show,renderPlan,renderRead};
})();