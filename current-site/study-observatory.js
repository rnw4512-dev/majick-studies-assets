/* Aetheria Learning Observatory • evidence-based study progress and academic brain breaks.
   The dashboard tracks supported practice only; it never writes XP, official mastery, or assessment scores. */
(function(){
'use strict';
if(window.MajickStudyObservatory)return;
const KEY='majick-learning-observatory-v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store=(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch(_){return {}}})();
const currentCourse=()=>String(window.S?.activeCourse||'D669');
const rows=course=>store[course]||(store[course]={lessons:{},spent:0,history:[],milestones:[]});
const allPacks=()=>Object.values(window.MajickCourseActivityPlayer?.packs||{});
const lessonsFor=course=>allPacks().filter(p=>p.courseId===course);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(store))}catch(_){}};
const distinctCorrect=course=>Object.values(rows(course).lessons).reduce((total,l)=>total+Object.values(l.questions||{}).filter(q=>q.firstCorrect).length,0);
const earned=course=>Math.floor(distinctCorrect(course)/5);
const tickets=course=>Math.max(0,earned(course)-Number(rows(course).spent||0));
const ratio=(n,d)=>d?Math.round(100*n/d):0;
let play=null;
function allHistory(course){return rows(course).history||[]}
function recordScenario(e){const d=e?.detail||{},course=String(d.courseId||'');if(!course||!d.scenarioId)return;const r=rows(course);r.scenarios=Array.isArray(r.scenarios)?r.scenarios:[];r.scenarios.push({scenarioId:String(d.scenarioId),stage:Number(d.stage||0),correct:!!d.correct,sourceVerified:!!d.sourceVerified,at:new Date().toISOString()});r.scenarios=r.scenarios.slice(-200);save();refresh();}
function record(e){
 const d=e?.detail||{},course=String(d.courseId||''),lesson=String(d.lessonId||''),id=String(d.questionId||'');
 if(!course||!lesson||!id||!d.sourceUrl||!/^https:\/\//.test(d.sourceUrl))return;
 const r=rows(course),l=r.lessons[lesson]||(r.lessons[lesson]={questions:{},recent:[]});
 const q=l.questions[id]||(l.questions[id]={tries:0,correct:0,firstCorrect:false,sourceUrl:d.sourceUrl});
 const was=distinctCorrect(course);
 q.tries++;if(d.correct){q.correct++;q.firstCorrect=true;}
 l.recent.push(d.correct?1:0);l.recent=l.recent.slice(-16);
 const entry={lesson,questionId:id,correct:!!d.correct,assisted:!!d.assisted,at:new Date().toISOString()};
 r.history.push(entry);r.history=r.history.slice(-250);
 const now=distinctCorrect(course);
 for(const n of [1,3,5,10,20,30]){
   const tag='distinct-'+n;
   if(now>=n&&was<n&&!r.milestones.includes(tag))r.milestones.push(tag);
 }
 save();
 refresh();
}
function summary(course){
 const packs=lessonsFor(course),r=rows(course),answered=allHistory(course),count=answered.length;
 return {course,questions:count,correct:answered.filter(a=>a.correct).length,uniqueCorrect:distinctCorrect(course),tickets:tickets(course),spent:r.spent||0,scenarios:(r.scenarios||[]).length,scenarioCorrect:(r.scenarios||[]).filter(x=>x.correct).length,skills:packs.map(p=>{
   const l=r.lessons[p.id]||{},q=l.questions||{},recent=l.recent||[],unique=Object.values(q).filter(x=>x.firstCorrect).length;
   return {id:p.id,title:p.title,total:p.activities.filter(a=>a._sourceVerified).length,unique,accuracy:ratio(recent.filter(Boolean).length,recent.length),attempts:recent.length,trend:recent.slice(-12)};
 })};
}
function spark(vals){
 if(!vals.length)return '<span class="obs-muted">No attempts yet</span>';
 return '<div class="obs-spark" aria-label="Recent attempts: '+vals.map(v=>v?'correct':'needs repair').join(', ')+'">'+vals.map(v=>'<span class="'+(v?'hit':'miss')+'" title="'+(v?'Correct':'Needs repair')+'"></span>').join('')+'</div>';
}
function milestone(n,s){
 return '<div class="obs-step '+(s.uniqueCorrect>=n?'reached':'')+'"><span class="obs-orb">✧</span><b>'+n+'</b><small>distinct correct</small></div>';
}
function gamePool(course){
 const packs=lessonsFor(course);return packs.flatMap(p=>p.activities.filter(a=>a._sourceVerified&&Array.isArray(a.options)&&Number.isInteger(a.correct)).map(a=>({id:p.id+'|'+a.id,title:a.title,prompt:a.prompt,options:a.options,correct:a.correct,explanation:a.explanation,source:a.provenance?.source_url||'',sourceTitle:a.provenance?.source_title||'',kind:a.provenance?.kind||'source_based_practice'})));
}
function gameHTML(course){
 if(!play||play.course!==course)return '';
 if(play.index>=play.questions.length){
  return '<section class="obs-game" aria-label="Finished brain break"><h4>✦ Constellation cleared!</h4><p>You collected '+play.points+' of '+play.questions.length+' stars. This replay is a fun review and does not change mastery or XP.</p><button type="button" data-obs-close>Return to study</button></section>';
 }
 const q=play.questions[play.index];
 return '<section class="obs-game" aria-label="Academic brain-break Starfall">'+
 '<div class="obs-game-head"><span>✦ STARFALL • ACADEMIC BRAIN BREAK</span><strong>'+String(play.index+1)+' / '+String(play.questions.length)+'</strong></div>'+
 '<div class="obs-stars" aria-hidden="true">✦ · ✧ ✦ · ✦ · ✧</div><h4>'+esc(q.prompt)+'</h4>'+
 '<p>Launch at the correct answer star:</p><div class="obs-targets">'+q.options.map((o,i)=>'<button type="button" data-obs-answer="'+i+'" '+(play.feedback?'disabled':'')+'><span aria-hidden="true">✦</span>'+esc(o)+'</button>').join('')+'</div>'+
 (play.feedback?'<div class="obs-game-feedback" role="status"><b>'+esc(play.feedback.correct?'Star collected!':'Repair the constellation')+'</b><p>'+esc(q.explanation||'Compare your choice to the sourced explanation.')+'</p><a href="'+esc(q.source)+'" target="_blank" rel="noopener noreferrer">View source: '+esc(q.sourceTitle)+'</a><button data-obs-next>Next constellation</button></div>':'')+
 '<button type="button" class="obs-exit" data-obs-close>Exit brain break</button></section>';
}
function render(){
 const course=currentCourse(),s=summary(course),packs=lessonsFor(course);
 if(!packs.length)return '';
 const answered=s.questions,acc=ratio(s.correct,answered),studyWidth=Math.min(100,ratio(s.uniqueCorrect,packs.reduce((x,p)=>x+p.activities.filter(a=>a._sourceVerified).length,0)));
 return '<section class="obs-shell" aria-label="Learning Observatory progress">'+
 '<div class="obs-header"><div><span>✦ LEARNING OBSERVATORY • '+esc(course)+'</span><h3>Watch your skills grow</h3><p>Real practice. Visible growth. A little magic along the way.</p></div><div class="obs-medallion" aria-hidden="true">✧</div></div>'+
 '<div class="obs-kpis"><div><b>'+s.uniqueCorrect+'</b><small>Unique questions solved</small></div><div><b>'+answered+'</b><small>Sourced practice checks</small></div><div><b>'+acc+'%</b><small>Practice accuracy</small></div><div><b>'+s.tickets+'</b><small>Starfall passes earned</small></div></div>'+
 '<p class="obs-scenario-metric">Hands-on scenario checks: <b>'+s.scenarios+'</b> · correct <b>'+s.scenarioCorrect+'</b> · tracked separately from sourced OA practice.</p>'+
 '<div class="obs-meter"><div><b>Source-based skill coverage</b><span>'+studyWidth+'%</span></div><div class="obs-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+studyWidth+'" aria-label="Unique source questions solved"><i style="width:'+studyWidth+'%"></i></div><p>Each question counts once toward coverage. Retry practice helps learning, but never creates duplicate rewards.</p></div>'+
 '<h4 class="obs-subhead">Skill growth by lesson</h4><div class="obs-skills">'+s.skills.map(l=>'<div class="obs-skill"><div><b>'+esc(l.title)+'</b><small>'+l.unique+' / '+l.total+' distinct questions answered correctly</small></div><div class="obs-mini"><div class="obs-track"><i style="width:'+ratio(l.unique,l.total)+'%"></i></div><span>'+l.accuracy+'% recent accuracy</span></div>'+spark(l.trend)+'</div>').join('')+'</div>'+
 '<p class="obs-nextstep"><b>Suggested next step:</b> '+(s.skills.filter(l=>l.attempts&&l.accuracy<70).length?'Review '+esc(s.skills.filter(l=>l.attempts&&l.accuracy<70)[0].title)+' and repair recent mistakes.':s.skills.some(l=>l.unique<l.total)?'Work through fresh sourced questions in '+esc(s.skills.find(l=>l.unique<l.total).title)+'.':'Revisit the lesson sources and attempt a fresh independent transfer challenge.')+'</p>'+
 '<h4 class="obs-subhead">Milestones</h4><div class="obs-milestones">'+[1,3,5,10,20].map(n=>milestone(n,s)).join('')+'</div>'+
 '<div class="obs-break"><div><h4>✦ Starfall Study Break</h4><p>Earn one 3-question constellation game for every five *new* correct sourced questions. Games revisit lesson skills; their scores never boost mastery.</p><small>'+s.tickets+' passes ready · '+s.spent+' used</small></div><button type="button" data-obs-play '+(s.tickets<1?'disabled':'')+'>'+(s.tickets?'Play a study break':'Earn 5 distinct correct answers')+'</button></div>'+
 gameHTML(course)+'<p class="obs-disclaimer">Practice proficiency is not official WGU OA readiness or independently verified mastery. Assisted, independent and certification-writing results remain separate; this dashboard never changes your existing XP, crystals, Guardians or course-completion records.</p>'+
 '</section>';
}
function refresh(){
 const root=document.querySelector('.obs-shell');if(!root)return;
 const wrap=document.createElement('div');wrap.innerHTML=render();
 const next=wrap.firstElementChild;if(root&&next)root.replaceWith(next);
}
function playGame(){
 const course=currentCourse();if(tickets(course)<1)return;
 const pool=gamePool(course);if(pool.length<3)return;
 const prior=new Set((rows(course).history||[]).slice(-12).map(x=>x.lesson+'|'+x.questionId));
 pool.sort((a,b)=>Number(prior.has(a.id))-Number(prior.has(b.id)));
 // Rotate starting point deterministically across earned passes; no fabricated question bank.
 const shift=(rows(course).spent||0)%pool.length,rotated=pool.slice(shift).concat(pool.slice(0,shift));
 play={course,questions:rotated.slice(0,3),index:0,points:0,feedback:null};
 rows(course).spent++;save();refresh();
 document.querySelector('.obs-game')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
document.addEventListener('majick:sourced-practice',record);
document.addEventListener('majick:hands-on-practice',recordScenario);
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||!b.closest('.obs-shell'))return;
 if(b.hasAttribute('data-obs-play')){playGame();return;}
 if(b.hasAttribute('data-obs-close')){play=null;refresh();return;}
 if(b.hasAttribute('data-obs-answer')&&play&&!play.feedback){const q=play.questions[play.index];const ok=Number(b.dataset.obsAnswer)===q.correct;if(ok)play.points++;play.feedback={correct:ok};refresh();return;}
 if(b.hasAttribute('data-obs-next')&&play){play.index++;play.feedback=null;if(play.index>=play.questions.length&&play.points===play.questions.length&&play.questions.length>=3){try{document.dispatchEvent(new CustomEvent('majick:starfall-complete',{detail:{courseId:play.course,earnedPass:Number(rows(play.course).spent||0),score:play.points,total:play.questions.length,perfect:true}}))}catch(_){}}refresh();return;}
});
const style=document.createElement('style');
style.textContent=`.obs-scenario-metric,.obs-nextstep{background:#fffaf2;border-radius:9px;border:1px solid #e0d0df;padding:9px;font-size:.82rem;line-height:1.45}.obs-shell{margin:14px 0 22px;padding:20px;background:linear-gradient(145deg,#fcf7ec,#f3e9f7);border:1px solid #bc9dca;border-radius:18px;color:#2e2540;box-shadow:0 8px 30px #2b1d3a15}.obs-header{display:flex;justify-content:space-between;align-items:center;gap:12px}.obs-header span{font-size:.7rem;font-weight:800;letter-spacing:.1em;color:#634e74}.obs-header h3{color:#382950;font-family:Georgia,serif;font-size:1.45rem;margin:5px 0}.obs-header p{margin:2px 0 14px;font-size:.88rem}.obs-medallion{width:55px;height:55px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,#f8df9e,#9c7bb4);font-size:2rem;animation:obsBreathe 4s ease-in-out infinite}.obs-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.obs-kpis>div{border:1px solid #d5c2df;background:#fffaf5;border-radius:11px;padding:12px 9px}.obs-kpis b{display:block;font-size:1.4rem;color:#493260;font-variant-numeric:tabular-nums}.obs-kpis small{font-size:.72rem;color:#584b62}.obs-meter{margin:15px 0}.obs-meter>div:first-child{display:flex;justify-content:space-between}.obs-meter p,.obs-disclaimer{font-size:.76rem;color:#554962;line-height:1.45}.obs-track{height:10px;border-radius:10px;background:#e1d5e5;overflow:hidden;margin:6px 0}.obs-track i{display:block;height:100%;background:linear-gradient(90deg,#477862,#b88a43);border-radius:10px;transition:width .3s ease}.obs-subhead{margin:14px 0 8px;color:#3d2f52}.obs-skills{display:grid;gap:8px}.obs-skill{border:1px solid #ddcfe5;border-radius:11px;padding:11px;background:#fffdf8;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(100px,1fr) auto;gap:12px;align-items:center}.obs-skill b,.obs-skill small{display:block}.obs-skill b{font-size:.9rem}.obs-skill small,.obs-mini span{font-size:.74rem;color:#62536a}.obs-spark{display:flex;gap:3px;align-items:center}.obs-spark span{width:8px;height:16px;border-radius:3px;background:#b1a0b9}.obs-spark .hit{background:#478465}.obs-spark .miss{background:#c48955}.obs-muted{font-size:.7rem;color:#7e7184}.obs-milestones{display:flex;flex-wrap:wrap;gap:9px}.obs-step{flex:1;min-width:70px;background:#eee7f0;border:1px solid #d0c0da;border-radius:10px;padding:8px;text-align:center;opacity:.62}.obs-step.reached{background:#f8e4b7;opacity:1;border-color:#b68b4b}.obs-step b,.obs-step small{display:block}.obs-orb{font-size:1.4rem}.obs-step small{font-size:.64rem}.obs-break{margin:16px 0 0;border:1px solid #a688b6;border-radius:12px;padding:14px;background:#f4eaf9;display:flex;justify-content:space-between;gap:15px;align-items:center}.obs-break h4{margin:0}.obs-break p{font-size:.84rem;line-height:1.45}.obs-break button,.obs-game button{background:#56406e;border:1px solid #ac8bc0;border-radius:9px;color:#fff8ed;padding:12px;cursor:pointer;font-weight:700}.obs-break button:disabled{opacity:.55;cursor:not-allowed}.obs-game{margin:15px 0;padding:18px;border-radius:16px;background:radial-gradient(ellipse at top,#4b3b6c,#211b39);color:#fff7e2}.obs-game h4{color:#ffe9bb}.obs-game-head{display:flex;justify-content:space-between;gap:10px;font-size:.75rem;color:#f9d89a}.obs-stars{text-align:center;color:#f6d18d;font-size:2.2rem;letter-spacing:.3em;animation:obsBreathe 3s ease-in-out infinite}.obs-targets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.obs-targets button{min-height:84px;text-align:left;display:flex;gap:11px;align-items:center}.obs-targets button span{font-size:1.7rem;color:#f6d389}.obs-targets button:hover,.obs-targets button:focus-visible{background:#85678d;outline:3px solid #f4d594}.obs-game-feedback{background:#eae1f1;color:#2a2040;padding:12px;border-radius:9px;margin:12px 0}.obs-game-feedback a{display:block;color:#523e8a}.obs-game-feedback button{display:block;margin-top:9px}.obs-exit{margin-top:12px;background:transparent!important}.obs-disclaimer{margin-bottom:0}@keyframes obsBreathe{50%{transform:scale(1.06);opacity:.87}}@media(max-width:700px){.obs-kpis{grid-template-columns:repeat(2,1fr)}.obs-skill{grid-template-columns:1fr}.obs-targets{grid-template-columns:1fr}.obs-shell{padding:13px}.obs-break{display:block}.obs-break button{margin-top:10px}}@media(prefers-reduced-motion:reduce){.obs-shell *{animation:none!important;transition:none!important}}`;
document.head.appendChild(style);
function install(){
 const lab=window.MajickLearningLab;
 if(!lab||typeof lab.render!=='function'||lab.__observatoryWrapped)return false;
 const base=lab.render;
 lab.render=function(){const html=base.apply(this,arguments),extension=render();return extension?html.replace('</header>','</header>'+extension):html};
 lab.__observatoryWrapped=true;
 return true;
}
if(!install())document.addEventListener('DOMContentLoaded',install,{once:true});
window.MajickStudyObservatory={render,summary,record,refresh,tickets};
})();