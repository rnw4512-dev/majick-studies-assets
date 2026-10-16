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
 if(!['home','analytics'].includes(window.S?.screen))return;
 const reports=window.S.screen==='analytics';
 const root=document.querySelector('.content');if(!root||root.querySelector(reports?'#mjD772WguHistory':'#mjD772AxisLab'))return;
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
 if(reports){root.prepend(el);return}
 const activity=document.createElement('section');
 activity.id='mjD772AxisLab';
 activity.style.cssText='margin-top:16px;padding:15px;border:2px solid #9c7d60;border-radius:10px;background:#fff7e9;color:#271b2d';
 activity.innerHTML='<h4>Try it · Catch a misleading graph</h4><p>A school reports attendance improving from <strong>92%</strong> to <strong>94%</strong>. Both charts contain the same values. Does the picture exaggerate the difference?</p>'+
 '<fieldset style="border:0;padding:0"><legend><strong>Choose the starting point for the vertical axis:</strong></legend>'+
 '<label style="display:inline-block;margin:4px 14px 4px 0"><input type="radio" name="mjAxisStart" value="90" checked> Start at 90%</label>'+
 '<label style="display:inline-block;margin:4px"><input type="radio" name="mjAxisStart" value="0"> Start at 0%</label></fieldset>'+
 '<svg data-axis-chart role="img" aria-label="Attendance bars at 92 and 94 percent" viewBox="0 0 360 215" style="display:block;width:min(100%,420px);height:auto;background:#fff;border:1px solid #ac9886;border-radius:6px"></svg>'+
 '<p data-axis-explanation aria-live="polite"></p>'+
 '<fieldset style="border:0;padding:0"><legend><strong>Which statement is most accurate?</strong></legend>'+
 '<label style="display:block;margin:6px 0"><input type="radio" name="mjAxisAnswer" value="a"> Attendance increased by 50%.</label>'+
 '<label style="display:block;margin:6px 0"><input type="radio" name="mjAxisAnswer" value="b"> Attendance increased by 2 percentage points; a truncated axis can exaggerate the visual gap.</label>'+
 '<label style="display:block;margin:6px 0"><input type="radio" name="mjAxisAnswer" value="c"> The result proves the school program caused the increase.</label></fieldset>'+
 '<button type="button" data-axis-check style="padding:9px 13px;background:#332041;color:#fff8ef;border:2px solid #aa8baf;border-radius:7px;cursor:pointer">Check my interpretation</button>'+
 '<p data-axis-feedback role="status" aria-live="polite"></p>'+
 '<details><summary>Professor tip · How would you teach this?</summary><p>Ask students to read the axis before comparing bar heights. Rebuild the same graph with an axis from zero. Ask: did the data change, or only the appearance? A 2-percentage-point increase does not by itself establish the cause.</p></details>';
 el.append(activity);
 const chart=activity.querySelector('[data-axis-chart]'),explanation=activity.querySelector('[data-axis-explanation]');
 function drawAxis(){
  const start=Number(activity.querySelector('input[name="mjAxisStart"]:checked').value);
  const ys=v=>170-120*(v-start)/(100-start);
  const h1=170-ys(92),h2=170-ys(94);
  chart.setAttribute('aria-label','Attendance: first period 92%, second period 94%, vertical axis starts at '+start+'%.');
  chart.innerHTML='<line x1="55" y1="24" x2="55" y2="170" stroke="#382943" stroke-width="2"/><line x1="55" y1="170" x2="330" y2="170" stroke="#382943" stroke-width="2"/>'+
    [start,100].map(v=>'<text x="47" y="'+(ys(v)+4)+'" text-anchor="end" font-size="14" fill="#271b2d">'+v+'%</text>').join('')+
    '<rect x="92" y="'+ys(92)+'" width="76" height="'+h1+'" fill="#655078"/><rect x="217" y="'+ys(94)+'" width="76" height="'+h2+'" fill="#856b44"/>'+
    '<text x="130" y="'+(ys(92)-5)+'" text-anchor="middle" fill="#271b2d" font-size="15">92%</text><text x="255" y="'+(ys(94)-5)+'" text-anchor="middle" fill="#271b2d" font-size="15">94%</text>'+
    '<text x="130" y="190" text-anchor="middle" fill="#271b2d" font-size="14">Before</text><text x="255" y="190" text-anchor="middle" fill="#271b2d" font-size="14">After</text>';
  explanation.textContent=start===90?'The axis starts at 90%, making the 2-point increase appear proportionally large. Compare it with the zero baseline.':'The axis starts at 0%, so the two bars look similar. The numbers have NOT changed: 92% and 94%.';
 }
 activity.querySelectorAll('input[name="mjAxisStart"]').forEach(r=>r.addEventListener('change',drawAxis));
 activity.querySelector('[data-axis-check]').addEventListener('click',()=>{
  const selected=activity.querySelector('input[name="mjAxisAnswer"]:checked');
  const status=activity.querySelector('[data-axis-feedback]');
  if(!selected){status.textContent='Choose an answer before checking.';return}
  const correct=selected.value==='b';
  status.textContent=correct?'Correct: 94% − 92% = 2 percentage points. A shortened axis can make that difference look much larger. A change alone does not show causation.':'Not quite. Compare 94 − 92, then decide whether the graph scale distorts the size of that difference. Try again.';
  window.MajickLearningContinuity?.record?.({courseId:'D772',lessonTitle:'d772-s1-l3',correct,activity:'guided-axis-audit'});
 });
 drawAxis();
 el.querySelectorAll('h3,p,summary,td,th,strong').forEach(node=>node.style.setProperty('color','#271b2d','important'));
 el.querySelectorAll('td,th').forEach(cell=>cell.style.cssText='border-bottom:1px solid #b49b91;padding:8px;text-align:left;color:#271b2d');
 root.prepend(activity);
}
window.MajickD772QuizHistory={source:SOURCE,seed:ROWS,records,ensure,render};
if(window.MajickRenderQueue?.register){window.MajickRenderQueue.register('d772-historical-quiz-results',render,78);window.MajickRenderQueue.schedule()}
else{document.addEventListener('DOMContentLoaded',render);setInterval(render,1200)}
})();
