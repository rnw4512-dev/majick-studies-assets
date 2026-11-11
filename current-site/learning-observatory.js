/* Aetheria Learning Observatory — read-only reporting over existing course records. */
(function(){
'use strict';
if(window.MajickLearningObservatory)return;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msDay=86400000;
let selected='all',windowDays=30,focusBefore=null;
function now(){return Date.now()}
function data(){
 const st=window.S||{},courses=st.progress||{},out=[],seen=new Set();
 function add(course,row,source){
  if(!row||typeof row!=='object')return;
  const at=Number(row.at||row.timestamp||row.completedAt||0);
  if(!Number.isFinite(at)||at<=0||at>now()+msDay)return;
  const correct=typeof row.correct==='boolean'?row.correct:null;
  const modeName=String(row.mode||row.source||source||'').toLowerCase();
  const classification=row.assisted===true?'guided':row.assisted===false?'independent':row.independent===true?'independent':row.independent===false?'guided':/(guided|repair|hint|worked|teaching|coach)/.test(modeName)?'guided':/(independent|transfer|oa-|mock|diagnostic|exam)/.test(modeName)?'independent':'unknown';
  const key=String(row.guardianBridgeKey||row.key||row.id||'');
  const uid=course+'|'+(key?'id:'+key:'row:'+at+':'+String(row.qid||'')+':'+String(row.source||row.mode||source));
  if(seen.has(uid))return;seen.add(uid);
  out.push({course,at,correct,source:String(row.source||row.mode||source||'unclassified'),topic:String(row.topicId||row.conceptId||row.topic||'Unclassified skill'),classification,transfer:row.transfer===true||/(transfer|delayed|retriev)/.test(modeName),confidence:String(row.confidence||'')});
 }
 for(const [course,p] of Object.entries(courses)){
  if(Array.isArray(p?.answers))p.answers.forEach(r=>add(course,r,'course answers'));
 }
 // Event ledger is supplementary only: use it for answers not already in the canonical arrays.
 const events=st.majickAccount?.studyProgressBridge?.events||{};
 for(const [key,x] of Object.entries(events)){
  if(!x||x.historical||x.legacyAwarded)continue;
  const course=String(x.course||'Unclassified'),p=courses[course];
  if(p?.answers?.some(a=>a.guardianBridgeKey===key))continue;
  add(course,{...x,key,topicId:x.topicId||'Unclassified skill',assisted:x.independent===false,independent:x.independent===true},'study ledger');
 }
 return out.sort((a,b)=>a.at-b.at);
}
function number(n){return Number.isFinite(n)?Math.round(n*100)+'%':'—'}
function accuracy(rows){let assessed=rows.filter(x=>x.correct!==null);return assessed.length?assessed.filter(x=>x.correct).length/assessed.length:NaN}
function rows(){let cutoff=now()-windowDays*msDay;return data().filter(x=>x.at>=cutoff&&(selected==='all'||x.course===selected))}
function buckets(items){
 const groups=new Map();
 for(let r of items){let x=groups.get(r.topic)||[];x.push(r);groups.set(r.topic,x)}
 return [...groups.entries()].map(([topic,a])=>{
  const scored=a.filter(x=>x.correct!==null),recent=scored.slice(-8),previous=scored.slice(-16,-8);
  let delta=recent.length>=4&&previous.length>=4?accuracy(recent)-accuracy(previous):null;
  return {topic,attempts:scored.length,acc:accuracy(scored),guided:accuracy(scored.filter(x=>x.classification==='guided')),independent:accuracy(scored.filter(x=>x.classification==='independent')),unknown:scored.filter(x=>x.classification==='unknown').length,delta};
 }).sort((a,b)=>(Number.isNaN(a.acc)?1:a.acc)-(Number.isNaN(b.acc)?1:b.acc));
}

function weeklySeries(records){
 const groups=new Map();
 for(const x of records){let d=new Date(x.at);d.setDate(d.getDate()-(d.getDay()+6)%7);let k=d.toISOString().slice(0,10);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(x)}
 return [...groups].sort((a,b)=>a[0].localeCompare(b[0])).slice(-15).map(([week,a])=>({week,n:a.filter(x=>x.correct!==null).length,overall:accuracy(a),guided:accuracy(a.filter(x=>x.classification==='guided')),independent:accuracy(a.filter(x=>x.classification==='independent'))}));
}
function insights(records){
 const group=buckets(records),out=[];
 for(let x of group.filter(x=>x.attempts>=4&&Number.isFinite(x.independent)&&x.independent<.65).slice(0,3))out.push({title:'Independent practice recommended',text:x.topic+' · '+number(x.independent)+' independent accuracy. Review the specific mistakes and try a fresh no-hint question.'});
 for(let x of group.filter(x=>x.attempts>=4&&Number.isFinite(x.guided)&&Number.isFinite(x.independent)&&x.guided-x.independent>=.2).slice(0,2))out.push({title:'Guided-to-independent gap',text:x.topic+' · guided '+number(x.guided)+', independent '+number(x.independent)+'. Gradually remove coaching, then check transfer.'});
 for(let x of group.filter(x=>x.delta!==null&&x.delta<=-.2).slice(0,2))out.push({title:'Declining recent performance',text:x.topic+' · recent accuracy declined by '+Math.abs(Math.round(x.delta*100))+' percentage points. Review recurring errors.'});
 if(!out.length)out.push({title:'Next learning step',text:records.length?'Keep collecting fresh independent evidence. Too little consistent data exists for a reliable weakness diagnosis.':'Complete guided and independent practice activities to create your first trend.'});
 return out.slice(0,5);
}
function coverage(records,meetings){
 const all=records.map(x=>x.source.toLowerCase()),has=re=>all.some(s=>re.test(s));
 const map=[
 ['Scholar’s Study Hall',records.length>0,'Saved course answer arrays and shared ledger'],
 ['Learn Lab / lesson checks',has(/lab|learn|checkpoint|lesson/),'Look for learning-checkpoint events and independent follow-up'],
 ['Game Realm / Arcade',has(/game|realm|arcade|boss|duel/),'Game wins alone are not academic mastery'],
 ['Professor’s Repair',has(/repair|mistake|misconception/),'Require paired initial mistake, repair, and fresh transfer'],
 ['Trial Chamber / independent',has(/trial|independent|transfer|mock|exam/),'Need unassisted response records and skill IDs'],
 ['Council Chamber / D756',meetings.length>0,'Saved rehearsal rubric; not official Mursion scoring'],
 ['Historical D755/D772',records.some(x=>/d755|d772/i.test(x.course)),'Older records may lack timestamps or mode labels']
 ];
 return map.map(([name,found,detail])=>({name,status:found?'Evidence present':'Not confirmed',detail}));
}
function csv(records){
 const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
 const lines=[['course','timestamp','topic','source','mode','correct','transfer'].join(',')];
 for(let x of records)lines.push([x.course,new Date(x.at).toISOString(),x.topic,x.source,x.classification,x.correct,x.transfer].map(quote).join(','));
 const link=document.createElement('a'),blob=new Blob([lines.join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
 link.href=url;link.download='aetheria-learning-trends-'+new Date().toISOString().slice(0,10)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
}

function d756(){
 try{
  let records=JSON.parse(localStorage.getItem('majick-d756-task2-rehearsal-v1-history')||'[]');
  return Array.isArray(records)?records.filter(x=>x&&x.done).map(x=>({at:Number(x.completedAt||0),profile:x.profile||'angela',mode:x.mode||'unknown',met:!!x.assessment?.passed,checks:x.assessment?.checks||[],xp:Number(x.reward?.xp||0)})):[];
 }catch(_){return []}
}
function style(){
 if(document.getElementById('majLearningObservatoryCSS'))return;
 const el=document.createElement('style');el.id='majLearningObservatoryCSS';
 el.textContent='#majLearningObservatoryBtn{cursor:pointer}#majLearningObservatory{position:fixed;inset:0;background:#100918e8;z-index:1600;display:grid;place-items:center;padding:12px;color:#fff3e9}#majLearningObservatory section{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#241a32;border:2px solid #d8b47d;border-radius:18px;padding:20px}#majLearningObservatory header,#majLearningObservatory .loControls,#majLearningObservatory .loMetrics{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center}#majLearningObservatory h2,#majLearningObservatory h3{color:#ffe0a6}#majLearningObservatory button,#majLearningObservatory select{background:#473254;color:#fff4e4;border:1px solid #bca078;border-radius:10px;padding:9px;cursor:pointer}#majLearningObservatory button:focus-visible,#majLearningObservatory select:focus-visible,#majLearningObservatoryBtn:focus-visible{outline:3px solid #ffdf99;outline-offset:2px}#majLearningObservatory .loMetric{flex:1;min-width:150px;background:#382745;border:1px solid #775c74;border-radius:12px;padding:12px}#majLearningObservatory .loMetric b{display:block;font-size:25px}#majLearningObservatory table{width:100%;border-collapse:collapse}#majLearningObservatory td,#majLearningObservatory th{text-align:left;border-bottom:1px solid #6b536f;padding:10px;vertical-align:top}#majLearningObservatory .loScroll{overflow-x:auto}#majLearningObservatory .loNote{background:#3a2a45;border-left:4px solid #d8b47d;padding:12px;margin:12px 0}#majLearningObservatory .loLow{color:#ffdb9c}#majLearningObservatory .loTrend{font-size:12px}#majLearningObservatory small{color:#e4d5dc} @media(max-width:600px){#majLearningObservatory section{padding:12px}#majLearningObservatoryBtn{bottom:72px;right:8px}}';
 document.head.append(el);
}
function draw(){
 let host=document.getElementById('majLearningObservatory');if(!host)return;
 const items=rows(),scored=items.filter(x=>x.correct!==null),ind=scored.filter(x=>x.classification==='independent'),guided=scored.filter(x=>x.classification==='guided'),uncertain=scored.filter(x=>x.classification==='unknown');
 const skills=buckets(items),total=data(),available=[...new Set(total.map(x=>x.course))].sort();
 const meetings=d756().filter(x=>x.at>=now()-windowDays*msDay),pass=meetings.filter(x=>x.met).length;
 const date=new Date(now()-windowDays*msDay).toLocaleDateString();
 const weeks=weeklySeries(items),studyTips=insights(items),audit=coverage(items,meetings);
 const metrics=[['Recorded attempts',scored.length],['Accuracy',number(accuracy(scored))],['Guided accuracy',number(accuracy(guided))],['Independent accuracy',number(accuracy(ind))],['Unknown mode',uncertain.length],['IEP rehearsals',meetings.length]];
 const metricHTML=metrics.map(([k,v])=>'<div class="loMetric"><small>'+E(k)+'</small><b>'+E(v)+'</b></div>').join('');
 const skillHTML=skills.map(v=>'<tr><td>'+E(v.topic)+'</td><td>'+v.attempts+'</td><td>'+number(v.acc)+'</td><td>'+number(v.guided)+'</td><td>'+number(v.independent)+'</td><td class="loTrend">'+(v.delta===null?'Not enough data':(v.delta>=0?'+':'')+Math.round(v.delta*100)+' percentage points')+'</td></tr>').join('');
 const sourceMap=new Map();items.forEach(x=>{const a=sourceMap.get(x.source)||[];a.push(x);sourceMap.set(x.source,a)});
 const sourceHTML=[...sourceMap.entries()].sort((a,b)=>b[1].length-a[1].length).map(([k,a])=>'<tr><td>'+E(k)+'</td><td>'+a.length+'</td><td>'+number(accuracy(a))+'</td></tr>').join('');
 const meetingsHTML=meetings.slice(-12).reverse().map(x=>'<tr><td>'+new Date(x.at).toLocaleDateString()+'</td><td>'+E(x.profile)+'</td><td>'+E(x.mode)+'</td><td>'+(x.met?'Practice checks met':'Needs practice')+'</td><td>'+x.xp+'</td></tr>').join('');
 const weekHTML=weeks.map(x=>'<tr><td>'+E(x.week)+'</td><td>'+x.n+'</td><td>'+number(x.overall)+'</td><td>'+number(x.guided)+'</td><td>'+number(x.independent)+'</td></tr>').join('');
 const tipHTML=studyTips.map(x=>'<li><b>'+E(x.title)+':</b> '+E(x.text)+'</li>').join('');
 const auditHTML=audit.map(x=>'<tr><td>'+E(x.name)+'</td><td>'+E(x.status)+'</td><td>'+E(x.detail)+'</td></tr>').join('');
 host.innerHTML='<section role="dialog" aria-modal="true" aria-label="Learning progress observatory"><header><div><small>Moonlit Collegium · Learning Observatory</small><h2>My Learning Trends</h2></div><button id="loClose">Close ✕</button></header>'+
 '<p>Compare what is working across your course practice. These charts are based on saved records in this browser, not a complete audit of every learning system.</p>'+
 '<div class="loControls"><label>Course <select id="loCourse"><option value="all">All courses</option>'+available.map(x=>'<option value="'+E(x)+'" '+(selected===x?'selected':'')+'>'+E(x)+'</option>').join('')+'</select></label><label>Period <select id="loWindow">'+[7,30,90,365].map(n=>'<option value="'+n+'" '+(windowDays===n?'selected':'')+'>'+n+' days</option>').join('')+'</select></label><button id="loRefresh">Refresh</button></div>'+
 '<p><small>From '+E(date)+' · '+scored.length+' scored attempts with timestamps · '+(total.length-scored.length)+' records outside the selected period or course</small></p><div class="loMetrics">'+metricHTML+'</div>'+
 '<div class="loNote"><b>How to interpret:</b> Guided and independent attempts are separate. Unlabeled records remain unknown mode, not assumed independent. A good guided score does not prove mastery. Skill trends compare the latest eight scored responses against the previous eight, only when each period contains four or more attempts. Small samples are not definitive.</div>'+
 '<h3>Skills that need attention</h3><div class="loScroll"><table><thead><tr><th>Concept</th><th>Attempts</th><th>Overall</th><th>Guided</th><th>Independent</th><th>Unknown mode</th><th>Recent change</th></tr></thead><tbody>'+(skillHTML||'<tr><td colspan="7">No timestamped skill records yet.</td></tr>')+'</tbody></table></div>'+
 '<h3>Weekly performance trends</h3><div class="loScroll"><table><thead><tr><th>Week</th><th>Attempts</th><th>Overall</th><th>Guided</th><th>Independent</th></tr></thead><tbody>'+(weekHTML||'<tr><td colspan="5">No dated attempts yet.</td></tr>')+'</tbody></table></div>'+
 '<h3>Which practice systems are generating results?</h3><div class="loScroll"><table><thead><tr><th>Source</th><th>Attempts</th><th>Accuracy</th></tr></thead><tbody>'+(sourceHTML||'<tr><td colspan="3">No answer-level records available for this selection.</td></tr>')+'</tbody></table></div>'+
 '<h3>D756 meeting practice</h3><p>'+meetings.length+' completed rehearsals in this period; '+pass+' met the app’s provisional practice criteria. This is not official Mursion scoring.</p><div class="loScroll"><table><thead><tr><th>Date</th><th>Case</th><th>Mode</th><th>Checks</th><th>XP</th></tr></thead><tbody>'+(meetingsHTML||'<tr><td colspan="5">No completed meeting history saved in this browser.</td></tr>')+'</tbody></table></div>'+
 '<h3>What to work on next</h3><div class="loNote"><ul>'+tipHTML+'</ul><small>Data-driven practice suggestions are provisional; they do not establish cause or independently certify mastery.</small></div>'+
 '<h3>Evidence coverage by practice room</h3><div class="loScroll"><table><thead><tr><th>System</th><th>Status</th><th>Notes</th></tr></thead><tbody>'+auditHTML+'</tbody></table></div><button id="loExport">Export filtered practice data (CSV)</button>'+
 '<div class="loNote"><b>Coverage limitation:</b> This view reads existing course answer arrays, the study ledger and saved D756 history. Activities that only store a summary or save no attempt-level results cannot yet produce meaningful trend lines. Old responses with missing timestamps are excluded, not assigned invented dates. Records in a different browser/device are not included unless synchronized.</div>'+
 '<p><small>Read-only report. Viewing this screen never awards XP or changes academic mastery.</small></p></section>';
 host.querySelector('#loClose').onclick=close;
 host.querySelector('#loCourse').value=selected;
 host.querySelector('#loCourse').onchange=e=>{selected=e.target.value;draw()};
 host.querySelector('#loWindow').onchange=e=>{windowDays=Number(e.target.value);draw()};
 host.querySelector('#loRefresh').onclick=draw;
 host.querySelector('#loExport').onclick=()=>csv(items);
}
function open(){style();focusBefore=document.activeElement;let host=document.getElementById('majLearningObservatory');if(!host){host=document.createElement('div');host.id='majLearningObservatory';document.body.append(host);}draw();host.querySelector('#loClose')?.focus();}
function close(){document.getElementById('majLearningObservatory')?.remove();focusBefore?.focus?.();}
function attach(){style();const nav=document.querySelector('.side .nav, aside .nav');if(!nav||document.getElementById('majLearningObservatoryBtn'))return;let b=document.createElement('button');b.id='majLearningObservatoryBtn';b.type='button';b.setAttribute('aria-label','Open Learning Observatory');b.innerHTML='<span>◈</span><span class="label">Learning Observatory</span>';b.onclick=open;const journal=nav.querySelector('button[data-nav="journal"]');if(journal)journal.after(b);else nav.append(b);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();const watcher=new MutationObserver(()=>{if(!document.getElementById('majLearningObservatoryBtn'))attach()});watcher.observe(document.body,{childList:true,subtree:true});
window.MajickLearningObservatory={version:'1.0',open,refresh:draw,summary:()=>({attempts:data().length,meetings:d756().length})};
})();