/* Reusable course-linked practice shelf. No changes to XP, mastery, or navigation. */
(function(){
  'use strict';
  if(window.MajickCourseActivityPlayer)return;
  const PACKS=Object.create(null), selected=Object.create(null), attempts=Object.create(null);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key=(course,id)=>course+':'+id;
  function register(pack){
    if(!pack||!pack.courseId||!pack.id||!Array.isArray(pack.activities))return;
    PACKS[key(pack.courseId,pack.id)]=pack;
  }
  function courses(){
    const id=String(window.S?.activeCourse||'');
    return Object.values(PACKS).filter(p=>p.courseId===id);
  }
  function render(){
    const packs=courses();
    if(!packs.length)return '';
    return '<section class="cap-shelf" aria-label="Course lessons and interactive practice"><div class="cap-heading"><span>✦ COURSE MATERIAL • REUSABLE PRACTICE</span><h3>Lessons and hands-on checks</h3><p>Study the source material, then practice. These review activities do not award XP or count as independent mastery.</p></div>'+
      packs.map(p=>'<details class="cap-pack" data-cap-pack="'+esc(p.id)+'"><summary>'+esc(p.title)+' <span>Study + practice</span></summary><div class="cap-inside">'+
        (p.summary?'<p>'+esc(p.summary)+'</p>':'')+
        (p.concepts?.length?'<div class="cap-concepts">'+p.concepts.map(c=>'<div class="cap-concept"><strong>'+esc(c.term)+'</strong><p>'+esc(c.text)+'</p></div>').join('')+'</div>':'')+
        (p.resources?.length?'<p class="cap-resources"><strong>Course video and readings:</strong> '+p.resources.map(r=>'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+'</a>').join(' · ')+'</p>':'')+
        p.activities.map(a=>'<div class="cap-activity" data-cap-activity="'+esc(a.id)+'"><h4>'+esc(a.title)+'</h4><p>'+esc(a.prompt)+'</p><div class="cap-options" role="group" aria-label="'+esc(a.title)+'">'+a.options.map((o,i)=>'<button type="button" class="cap-option" data-cap-answer="'+esc(i)+'" data-cap-key="'+esc(key(p.courseId,p.id)+':'+a.id)+'" aria-pressed="false">'+esc(o)+'</button>').join('')+'</div><p class="cap-feedback" role="status" aria-live="polite">Choose an answer to see feedback.</p></div>').join('')+
       '</div></details>').join('')+'</section>';
  }
  const style=document.createElement('style');
  style.textContent='.cap-shelf{margin:16px 0 24px;padding:18px;border:1px solid #bdabd5;border-radius:18px;background:#fffaf1;color:#29243d}.cap-heading h3{margin:6px 0}.cap-heading span{font-size:.72rem;letter-spacing:.06em;font-weight:800;color:#5c4978}.cap-heading p{margin:4px 0 12px}.cap-pack{border:1px solid #baaad0;border-radius:12px;margin:10px 0;background:#fff}.cap-pack summary{cursor:pointer;padding:13px;font-weight:700;list-style-position:inside}.cap-pack summary span{font-size:.72rem;color:#625271;float:right}.cap-inside{padding:4px 14px 14px}.cap-concepts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}.cap-concept{border:1px solid #ddd2e7;border-radius:10px;padding:10px;background:#faf6ff}.cap-concept p{margin:5px 0;font-size:.9rem}.cap-resources a{color:#56368b;text-decoration:underline;font-weight:600}.cap-activity{margin-top:14px;border-top:1px solid #d9cfdf;padding-top:12px}.cap-activity h4{margin:0 0 5px}.cap-activity>p{margin:6px 0 12px}.cap-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.cap-option{border:2px solid #8670a0;border-radius:10px;background:#fff;padding:12px;text-align:left;color:#29243d;min-height:46px;cursor:pointer;font-weight:600}.cap-option:hover,.cap-option:focus-visible{outline:2px solid #59418a;outline-offset:1px}.cap-option[aria-pressed="true"]{background:#efe6fc;border-color:#574183}.cap-feedback{padding:10px;border-radius:9px;background:#f3eff8;font-size:.92rem;min-height:40px}.cap-feedback[data-result="correct"]{background:#e2f4e9;color:#164f36}.cap-feedback[data-result="try"]{background:#fff0d9;color:#633d14}@media(max-width:420px){.cap-shelf{padding:12px}.cap-options{grid-template-columns:1fr}}';
  document.head.appendChild(style);
  let installed=false;
  function install(){
    if(installed||!window.MajickLearningLab||typeof window.MajickLearningLab.render!=='function')return;
    installed=true;
    const prev=window.MajickLearningLab.render;
    window.MajickLearningLab.render=function(){
      const html=prev.apply(this,arguments),extension=render();
      return extension?html.replace('</header>','</header>'+extension):html;
    };
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('button[data-cap-answer]');
    if(!b||!b.closest('.cap-shelf'))return;
    const activity=b.closest('.cap-activity'),packEl=b.closest('[data-cap-pack]');
    const pack=PACKS[key(String(window.S?.activeCourse||''),packEl?.dataset.capPack)];
    const item=pack?.activities.find(x=>x.id===activity?.dataset.capActivity);
    if(!item)return;
    const idx=Number(b.dataset.capAnswer),ok=idx===item.correct;
    activity.querySelectorAll('.cap-option').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const line=activity.querySelector('.cap-feedback');
    if(line){line.dataset.result=ok?'correct':'try';line.textContent=(ok?'✓ Correct. ':'Not quite. ')+item.explanation;}
    const k=key(pack.courseId,pack.id)+':'+item.id;
    selected[k]=idx;attempts[k]=(attempts[k]||0)+1;
  });
  window.MajickCourseActivityPlayer={register,install,packs:PACKS};
  install();
  document.addEventListener('DOMContentLoaded',install,{once:true});
})();
