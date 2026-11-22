/* Reusable course-linked practice shelf. No changes to XP, mastery, or navigation. */
(function(){
  'use strict';
  if(window.MajickCourseActivityPlayer)return;
  const PACKS=Object.create(null), selected=Object.create(null), attempts=Object.create(null);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key=(course,id)=>course+':'+id;
  const pref=()=>window.MajickStudyPreferences?.responseMode||'choice';
  const showChoice=()=>pref()!=='writing';
  const showWriting=()=>pref()!=='choice';
  function register(pack){
    if(!pack||!pack.courseId||!pack.id||!Array.isArray(pack.activities))return;
    // Unsupported or unreferenced content is visible for audit but never scoreable.
    pack.activities.forEach(a=>{const p=a.provenance||{};a._sourceVerified=!!(p.source_title&&/^https:\/\//.test(String(p.source_url||''))&&['original_course_question','source_based_practice'].includes(p.kind));});
    PACKS[key(pack.courseId,pack.id)]=pack;
  }
  function courses(){
    const id=String(window.S?.activeCourse||'');
    return Object.values(PACKS).filter(p=>p.courseId===id);
  }
  function render(){
    const packs=courses();
    if(!packs.length)return '';
    return '<section class="cap-shelf" data-aeth-surface="paper" aria-label="Course lessons and interactive practice"><div class="cap-heading"><span>✦ COURSE MATERIAL • REUSABLE PRACTICE</span><h3>Lessons and hands-on checks</h3><p>Study the source material, then practice. These review activities do not award XP or count as independent mastery.</p></div>'+
      packs.map(p=>'<details class="cap-pack" data-cap-pack="'+esc(p.id)+'"><summary>'+esc(p.title)+' <span>Study + practice</span></summary><div class="cap-inside">'+
        (p.summary?'<p>'+esc(p.summary)+'</p>':'')+
        (p.concepts?.length?'<div class="cap-concepts">'+p.concepts.map(c=>'<div class="cap-concept"><strong>'+esc(c.term)+'</strong><p>'+esc(c.text)+'</p></div></details>').join('')+'</div>':'')+
        (p.resources?.length?'<p class="cap-resources"><strong>Course video and readings:</strong> '+p.resources.map(r=>'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+'</a>').join(' · ')+'</p>':'')+
        p.activities.map((a,i)=>'<details class="cap-activity" data-cap-activity="'+esc(a.id)+'" '+(i===0?'open':'')+'><summary>Question '+(i+1)+' · '+esc(a.title)+'</summary><div class="cap-question-body"><p>'+esc(a.prompt)+'</p>'+(showChoice()?'<div class="cap-options" role="group" aria-label="'+esc(a.title)+'">'+a.options.map((o,i)=>'<button type="button" class="cap-option" data-cap-answer="'+esc(i)+'" data-cap-key="'+esc(key(p.courseId,p.id)+':'+a.id)+'" aria-pressed="false"'+(!a._sourceVerified?' disabled title="Source review required"':'')+'>'+esc(o)+'</button>').join('')+'</div>':'')+(showWriting()?'<label class="cap-written-label">Explain your answer and reasoning<textarea class="cap-written" data-cap-written rows="3" placeholder="Write your response or classroom reasoning…"></textarea></label><button type="button" data-cap-save-written '+(!a._sourceVerified?'disabled':'')+'>Save written practice</button>':'')+'<p class="cap-source"><strong>'+esc(a.provenance?.kind==='original_course_question'?'Original WGU guided practice':'Aetheria practice based on course material')+'</strong> · '+(a._sourceVerified?'<a target="_blank" rel="noopener noreferrer" href="'+esc(a.provenance.source_url)+'">Source: '+esc(a.provenance.source_title)+'</a>':'Source review required — answering disabled')+'</p><p class="cap-feedback" role="status" aria-live="polite">'+(a._sourceVerified?'Choose an answer to see feedback.':'This activity cannot be scored until a source is attached.')+'</p></div>').join('')+
       '</div></details>').join('')+'</section>';
  }
  const style=document.createElement('style');
  style.textContent='.cap-shelf{margin:16px 0 24px;padding:18px;border:1px solid #bdabd5;border-radius:18px;background:#fffaf1;color:#29243d}.cap-heading h3{margin:6px 0}.cap-heading span{font-size:.72rem;letter-spacing:.06em;font-weight:800;color:#5c4978}.cap-heading p{margin:4px 0 12px}.cap-pack{border:1px solid #baaad0;border-radius:12px;margin:10px 0;background:#fff}.cap-pack summary{cursor:pointer;padding:13px;font-weight:700;list-style-position:inside}.cap-pack summary span{font-size:.72rem;color:#625271;float:right}.cap-inside{padding:4px 14px 14px}.cap-concepts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}.cap-concept{border:1px solid #ddd2e7;border-radius:10px;padding:10px;background:#faf6ff}.cap-concept p{margin:5px 0;font-size:.9rem}.cap-resources a{color:#56368b;text-decoration:underline;font-weight:600}.cap-activity{margin-top:14px;border-top:1px solid #d9cfdf;padding-top:12px}.cap-activity h4{margin:0 0 5px}.cap-activity>p{margin:6px 0 12px}.cap-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.cap-option{border:2px solid #8670a0;border-radius:10px;background:#fff;padding:12px;text-align:left;color:#29243d;min-height:46px;cursor:pointer;font-weight:600}.cap-option:hover,.cap-option:focus-visible{outline:2px solid #59418a;outline-offset:1px}.cap-option[aria-pressed="true"]{background:#efe6fc;border-color:#574183}.cap-feedback{padding:10px;border-radius:9px;background:#f3eff8;font-size:.92rem;min-height:40px}.cap-feedback[data-result="correct"]{background:#e2f4e9;color:#164f36}.cap-feedback[data-result="try"]{background:#fff0d9;color:#633d14}@media(max-width:420px){.cap-shelf{padding:12px}.cap-options{grid-template-columns:1fr}}';
  style.textContent+=' .cap-written-label{display:block;margin:10px 0}.cap-written{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;background:white;color:#262138;min-height:90px;border:1px solid #8670a0;border-radius:8px;font:inherit}.cap-activity [data-cap-save-written]{padding:10px;border:1px solid #675184;background:#554064;color:white;border-radius:8px;cursor:pointer} .cap-source{font-size:.82rem;margin:8px 0 0;color:#4d4164}.cap-source a{font-weight:700;color:#523682;text-decoration:underline}.cap-option:disabled{opacity:.55;cursor:not-allowed}';
  style.textContent+=' .cap-activity{display:block;background:#fffdf9;border:1px solid #ddd2e7;border-radius:10px;margin:10px 0;padding:0;overflow:clip}.cap-activity>summary{padding:13px 16px;cursor:pointer;font-weight:750;color:#2f2443;list-style-position:inside}.cap-activity[open]>summary{border-bottom:1px solid #ded2e6;background:#f4edf8}.cap-question-body{padding:12px 16px}.cap-activity>summary:focus-visible{outline:3px solid #694b8b;outline-offset:-3px}';
  document.head.appendChild(style);

  // D669 visual formative games; local fictional evidence, no reward owner.
  const fluencyCases=[
    {name:'Maya',prompt:'Reads at a suitable pace but substitutes words.',evidence:'Print: The house was near the river. | Reads: The horse was near the river.',options:['Accuracy','Rate','Prosody'],correct:0,why:'Word substitutions suggest an accuracy concern. Investigate decoding.'},
    {name:'Leo',prompt:'Reads accurately but word by word, with long hesitations.',evidence:'Print: The little fox ran home. | Reads: The … little … fox … ran … home.',options:['Prosody only','Rate / automaticity','Accuracy'],correct:1,why:'Accurate but effortful word recognition suggests a need for automaticity practice.'},
    {name:'Nia',prompt:'Reads accurately at an appropriate pace but ignores punctuation.',evidence:'“Stop!” cried the child. | Reads in a flat voice with no phrase breaks.',options:['Accuracy','Rate','Prosody'],correct:2,why:'Expression and phrasing are the concern.'}
  ];
  const phraseCases=[{words:['After','the','storm,','the','fox','returned','home.'],correct:[2,6]},{words:['Wait!','The','bridge','is','broken.'],correct:[0,4]},{words:['When','the','bell','rang,','we','packed','our','bags.'],correct:[3,7]}];
  const labCases=[
    {name:'Jordan',rates:[64,71,79,87,94],accuracy:[96,94,91,88,84],options:['Raise speed target','Analyze errors and provide targeted decoding instruction','End intervention'],correct:1,why:'Rate increased while accuracy declined. Examine errors before increasing speed.'},
    {name:'Ari',rates:[45,47,48,49,50],accuracy:[97,98,98,99,99],options:['Provide supported repeated accurate reading','Teach only spelling','Require maximum speed'],correct:0,why:'Accuracy is strong but rate changes little. Supported repeated reading may strengthen automaticity.'},
    {name:'Sam',rates:[55,62,70,76,82],accuracy:[91,93,95,96,98],options:['Stop monitoring immediately','Focus only on speed','Continue monitoring and check prosody and comprehension'],correct:2,why:'Both measures improve, but fluency and comprehension need additional evidence.'}
  ];
  const fgState={detective:0,prosody:0,lab:0,pauses:[]};
  function fgChart(values,label,max){
    const X=i=>48+i*65,Y=v=>139-v/max*105;
    return '<figure style="margin:8px 0"><figcaption><strong>'+esc(label)+'</strong></figcaption><svg role="img" aria-label="'+esc(values.join(', '))+'" viewBox="0 0 340 170" style="width:100%;max-height:210px;background:#fff;border-radius:8px"><g stroke="#d9d0df">'+[0,.25,.5,.75,1].map(t=>'<path d="M48 '+Y(max*t)+' H310"/>').join('')+'</g><g fill="#352846" font-size="10">'+[0,.25,.5,.75,1].map(t=>'<text x="42" y="'+(Y(max*t)+3)+'" text-anchor="end">'+Math.round(max*t)+'</text>').join('')+values.map((v,i)=>'<text x="'+X(i)+'" y="158" text-anchor="middle">W'+(i+1)+'</text><text x="'+X(i)+'" y="'+(Y(v)-9)+'" text-anchor="middle">'+v+'</text>').join('')+'</g><polyline fill="none" stroke="#65438b" stroke-width="3" points="'+values.map((v,i)=>X(i)+','+Y(v)).join(' ')+'"/>'+values.map((v,i)=>'<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="4" fill="#65438b"/>').join('')+'</svg></figure>';
  }
  function fgCard(type){
    const i=fgState[type],c=(type==='detective'?fluencyCases:type==='prosody'?phraseCases:labCases)[i];
    const options=(c.options||[]).map((o,j)=>'<button class="cap-option" type="button" data-fg-choice="'+j+'">'+esc(o)+'</button>').join('');
    let body=type==='prosody'?'<p>Tap each word after which you would pause, including the end.</p><div class="cap-options" style="display:flex;flex-wrap:wrap">'+c.words.map((w,j)=>'<button type="button" class="cap-option" data-fg-pause="'+j+'" aria-pressed="'+fgState.pauses.includes(j)+'">'+esc(w)+(fgState.pauses.includes(j)?' /':'')+'</button>').join('')+'</div><button class="cap-option" data-fg-check type="button">Check phrasing</button>':type==='detective'?'<h4>Case: '+esc(c.name)+'</h4><p>'+esc(c.prompt)+'</p><p style="padding:12px;background:#f4edf8;border-radius:8px">'+esc(c.evidence)+'</p><p>Which fluency component needs investigation?</p><div class="cap-options">'+options+'</div>':'<h4>Student: '+esc(c.name)+'</h4><p>Fictional weekly progress data. Compare both measures.</p>'+fgChart(c.rates,'Words correct per minute',120)+fgChart(c.accuracy,'Accuracy (%)',100)+'<details><summary>Data table</summary><p>WCPM: '+c.rates.join(', ')+'<br>Accuracy (%): '+c.accuracy.join(', ')+'</p></details><p>Choose the next instructional step.</p><div class="cap-options">'+options+'</div>';
    return '<div data-fg-game="'+type+'"><p>Case '+(i+1)+' of 3</p>'+body+'<p class="cap-feedback" role="status" aria-live="polite">Examine the evidence and respond.</p><button type="button" class="cap-option" data-fg-next>Next case ↗</button></div>';
  }
  function fgRender(){
    if(window.S?.activeCourse!=='D669')return '';
    return '<section class="cap-shelf" aria-label="Fluency visual games"><div class="cap-heading"><span>✦ D669 · FLUENCY QUESTS</span><h3>Reading investigation studio</h3><p>Three visual formative games. Fictional student data; no independent mastery or XP awarded.</p></div>'+[['detective','Fluency Detective'],['prosody','Prosody Challenge'],['lab','Reading Intervention Lab']].map(([t,n])=>'<details class="cap-pack"><summary>'+n+'</summary><div class="cap-inside">'+fgCard(t)+'</div></details>').join('')+'</section>';
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button'),g=b?.closest('[data-fg-game]');
    if(!g||window.S?.activeCourse!=='D669')return;
    const t=g.dataset.fgGame,i=fgState[t],c=(t==='detective'?fluencyCases:t==='prosody'?phraseCases:labCases)[i],line=g.querySelector('.cap-feedback');
    if(b.hasAttribute('data-fg-next')){fgState[t]=(i+1)%3;if(t==='prosody')fgState.pauses=[];g.outerHTML=fgCard(t);return;}
    if(b.hasAttribute('data-fg-pause')){const j=Number(b.dataset.fgPause),p=fgState.pauses;fgState.pauses=p.includes(j)?p.filter(x=>x!==j):p.concat(j);b.setAttribute('aria-pressed',String(fgState.pauses.includes(j)));b.textContent=c.words[j]+(fgState.pauses.includes(j)?' /':'');line.textContent='Check your phrasing when ready.';delete line.dataset.result;return;}
    let ok,why;
    if(b.hasAttribute('data-fg-choice')){ok=Number(b.dataset.fgChoice)===c.correct;why=c.why;g.querySelectorAll('[data-fg-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}
    else if(b.hasAttribute('data-fg-check')){ok=fgState.pauses.length===c.correct.length&&c.correct.every(j=>fgState.pauses.includes(j));why='Suggested phrasing: '+c.words.map((w,j)=>w+(c.correct.includes(j)?' /':'')).join(' ')+'. Punctuation guides natural phrase boundaries.';}
    else return;
    line.dataset.result=ok?'correct':'try';line.textContent=(ok?'Correct. ':'Try again. ')+why;
  });

  let installed=false;
  function install(){
    if(installed||!window.MajickLearningLab||typeof window.MajickLearningLab.render!=='function')return;
    installed=true;
    const prev=window.MajickLearningLab.render;
    window.MajickLearningLab.render=function(){
      const html=prev.apply(this,arguments),extension=render()+fgRender();
      return extension?html.replace('</header>','</header>'+extension):html;
    };
  }
  document.addEventListener('click',function(e){
    const save=e.target.closest('button[data-cap-save-written]');
    if(save&&save.closest('.cap-shelf')){const area=save.closest('.cap-activity'),value=area?.querySelector('[data-cap-written]')?.value.trim()||'',line=area?.querySelector('.cap-feedback');if(line)line.textContent=value.length<15?'Write at least a brief explanation before saving.':'Written rehearsal saved locally for this session. Compare with the cited source; this has not been graded or counted as mastery.';if(value.length>=15){const row=area?.dataset.capActivity;const pack=save.closest('[data-cap-pack]')?.dataset.capPack;try{sessionStorage.setItem('majick-written-'+String(window.S?.activeCourse||'')+'-'+pack+'-'+row,value)}catch(_){}}return}
    const b=e.target.closest('button[data-cap-answer]');
    if(!b||!b.closest('.cap-shelf'))return;
    const activity=b.closest('.cap-activity'),packEl=b.closest('[data-cap-pack]');
    const pack=PACKS[key(String(window.S?.activeCourse||''),packEl?.dataset.capPack)];
    const item=pack?.activities.find(x=>x.id===activity?.dataset.capActivity);
    if(!item||!item._sourceVerified)return;
    const idx=Number(b.dataset.capAnswer),ok=idx===item.correct;
    activity.querySelectorAll('.cap-option').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const line=activity.querySelector('.cap-feedback');
    if(line){line.dataset.result=ok?'correct':'try';line.textContent=(ok?'✓ Correct. ':'Not quite. ')+item.explanation;}
    const k=key(pack.courseId,pack.id)+':'+item.id;
    selected[k]=idx;attempts[k]=(attempts[k]||0)+1;
    // Observed practice only. Never claim independent mastery from immediate-feedback questions.
    document.dispatchEvent(new CustomEvent('majick:sourced-practice',{detail:{courseId:pack.courseId,lessonId:pack.id,questionId:item.id,sourceUrl:item.provenance?.source_url||'',sourceType:item.provenance?.kind||'unknown',sourceTitle:item.provenance?.source_title||'',concept:item.concept||item.title||'Course practice',correct:ok,assisted:true,questionCount:pack.activities.length}}));
  });
  window.MajickCourseActivityPlayer={register,install,packs:PACKS};
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
})();
