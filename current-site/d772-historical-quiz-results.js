(()=>{'use strict';
if(window.MajickD772QuizHistory)return;
const SOURCE='user-reported-wgu-quiz-history-2026-10';
const ROWS=Object.freeze([
 {date:'2026-10-01',lessonId:'d772-s1-l1',section:1,lesson:1,form:'Section 1 Lsn 1 Quiz 1',percent:100},
 {date:'2026-10-01',lessonId:'d772-s1-l2',section:1,lesson:2,form:'Section 1 Lsn 2 Quiz 1',percent:90},
 {date:'2026-10-03',lessonId:'d772-s1-l3',section:1,lesson:3,form:'Section 1 Lsn 3 Quiz 1',percent:70},
 {date:'2026-10-04',lessonId:'d772-s2-l2',section:2,lesson:2,form:'Section 2 Lsn 2 Quiz 1',percent:100},
 {date:'2026-10-04',lessonId:'d772-s2-l3',section:2,lesson:3,form:'Section 2 Lsn 3 Quiz 1',percent:90},
 {date:'2026-10-07',lessonId:'d772-s3-l1',section:3,lesson:1,form:'Section 3 Lsn 1 Quiz 1',percent:90},
 {date:'2026-10-07',lessonId:'d772-s3-l2',section:3,lesson:2,form:'Section 3 Lsn 2 Quiz 1',percent:90}
].map(r=>Object.freeze({...r,id:SOURCE+':'+r.lessonId+':'+r.date+':quiz1',source:'Historical WGU quiz (user reported)',masteryVerified:false,rewardEligible:false})));
function records(){return window.S?.progress?.D772?.historicalWguQuizResults||[]}
function ensure(){
 const p=window.S?.progress?.D772;if(!p)return false;
 const prev=Array.isArray(p.historicalWguQuizResults)?p.historicalWguQuizResults:[];
 const existing=new Set(prev.map(r=>r?.id));
 const missing=ROWS.filter(r=>!existing.has(r.id));
 if(!missing.length)return false;
 p.historicalWguQuizResults=prev.concat(missing.map(r=>({...r})));
 try{if(typeof window.save==='function')window.save();else if(typeof save==='function')save()}catch(e){console.warn('D772 historical quiz import could not persist:',e)}
 return true;
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))}
function render(){
 if(window.S?.activeCourse!=='D772')return;
 ensure();
 if(!['home','mission','learninglab'].includes(window.S?.screen))return;
 const root=document.querySelector('.content');if(!root||root.querySelector('#mjD772WguHistory'))return;
 const data=records().filter(r=>r&&r.source==='Historical WGU quiz (user reported)'&&Number.isFinite(Number(r.percent))).sort((a,b)=>a.section-b.section||a.lesson-b.lesson);
 if(!data.length)return;
 const average=(data.reduce((s,r)=>s+Number(r.percent),0)/data.length).toFixed(1).replace(/\.0$/,'');
 const el=document.createElement('section');el.id='mjD772WguHistory';el.setAttribute('aria-label','Historical WGU quiz scores');
 el.style.cssText='margin:18px 0;padding:18px;border:2px solid #bda185;border-radius:12px;background:#f6ebd9;color:#271b2d;line-height:1.5';
 el.innerHTML='<h3 style="color:#271b2d;margin:0 0 6px">D772 · Historical WGU quiz scores</h3>'+
 '<p style="color:#35283a;margin:0 0 10px">Seven user-reported quizzes · unweighted average <strong>'+average+'%</strong>. These are historical WGU results, not verified app mastery. No XP or crystals are awarded for importing them.</p>'+
 '<p style="color:#35283a;margin:0 0 10px"><strong>Review priority:</strong> Section 1, Lesson 3 — Data Misrepresentations (70%). Practice misleading axes, graphs, visual scales, unsupported claims, and how to explain corrections to students.</p>'+
 '<details><summary style="cursor:pointer;font-weight:700">Show all seven dated quiz results</summary>'+
 '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;color:#271b2d"><thead><tr><th scope="col">Date</th><th scope="col">WGU quiz</th><th scope="col">Score</th><th scope="col">Source</th></tr></thead><tbody>'+
 data.map(r=>'<tr><td>'+escapeHtml(r.date)+'</td><td>'+escapeHtml(r.form)+'</td><td>'+escapeHtml(r.percent)+'%</td><td>'+escapeHtml(r.source)+'</td></tr>').join('')+
 '</tbody></table></div><p style="color:#35283a">A quiz score indicates review priority but does not establish independent mastery or identify individual missed questions.</p></details>';
 el.querySelectorAll('h3,p,summary,td,th,strong').forEach(node=>node.style.setProperty('color','#271b2d','important'));
 el.querySelectorAll('td,th').forEach(cell=>cell.style.cssText='border-bottom:1px solid #b49b91;padding:8px;text-align:left;color:#271b2d');
 root.prepend(el);
}
window.MajickD772QuizHistory={source:SOURCE,seed:ROWS,records,ensure,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-historical-quiz-results',render,78);window.MajickRenderQueue.schedule()}
else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1200)}
})();