/* Aetheria Learning Observatory — read-only reporting over existing course records. */
(function(){
'use strict';
if(window.MajickLearningObservatory)return;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msDay=86400000;
let selected='all',windowDays=30,focusBefore=null;
function now(){return Date.now()}
// Producers verified in source review to report assistance truthfully on a first attempt:
// learning-lab.js (guided-independent-retry is emitted only for the unassisted retry),
// course-tutor.js (lesson-you-do tracks hint/retry use), adaptive-learning-core.js
// (assisted only in the help scope) and learning-continuity.js (connected-*).
// For every other source a missing or default assisted:false stays unknown.
function verifiedUnassistedSource(source){
 const s=String(source||'').toLowerCase();
 return s==='guided-independent-retry'||s==='lesson-you-do'||s==='connected-reasoning'||s==='connected-transfer'||(s.indexOf('adaptive-')===0&&s!=='adaptive-help');
}
function classify(row,fallbackSource){
 if(row.assisted===true)return 'guided';
 const origin=String(row.source||row.mode||fallbackSource||'').toLowerCase();
 if(verifiedUnassistedSource(origin))return 'independent';
 const names=[row.mode,row.source,fallbackSource].map(x=>String(x||'').toLowerCase()).join(' ');
 if(/(guided|repair|hint|worked|teaching|coach|help)/.test(names))return 'guided';
 if(/(independent|transfer|oa-|mock|diagnostic|exam)/.test(names))return 'independent';
 return 'unknown';
}
function localDay(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function data(){
 const st=window.S||{},courses=st.progress||{},out=[],seen=new Set();
 function add(course,row,source){
  if(!row||typeof row!=='object')return;
  const at=Number(row.at||row.timestamp||row.completedAt||0);
  if(!Number.isFinite(at)||at<=0||at>now()+msDay)return;
  const correct=typeof row.correct==='boolean'?row.correct:null;
  const modeName=String(row.mode||row.source||source||'').toLowerCase();
  const classification=classify(row,source);
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
 for(const x of records){let d=new Date(x.at);d.setDate(d.getDate()-(d.getDay()+6)%7);let k=localDay(d);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(x)}
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
 ['Saved course answers (all rooms combined)',records.length>0,'Course answer arrays and shared ledger; this row does not identify a specific room'],
 ['Learn Lab / lesson checks',has(/lab|learn|checkpoint|lesson/),'Look for learning-checkpoint events and independent follow-up'],
 ['Game Realm / Arcade',has(/game|realm|arcade|boss|duel/),'Game wins alone are not academic mastery'],
 ['Professor’s Repair',has(/repair|mistake|misconception/),'Require paired initial mistake, repair, and fresh transfer'],
 ['Trial Chamber / independent',has(/trial|independent|transfer|mock|exam/),'Need unassisted response records and skill IDs'],
 ['Council Chamber / D756',meetings.length>0,'Saved rehearsal rubric; not official Mursion scoring'],
 ['Historical D755/D772',records.some(x=>/d755|d772/i.test(x.course)),'Older records may lack timestamps or mode labels']
 ];
 const rowsOut=map.map(([name,found,detail])=>({name,status:found?'Evidence present':'Not confirmed',detail}));
 // Source review (November 2026): these engines save only a rolling five-attempt window per skill
 // or no attempt record at all, so they cannot appear in the trends above.
 rowsOut.push({name:'Trial practice, generated questions, D772 adaptive mastery',status:'Summary only — not in trends',detail:'Kept as the latest five attempts per skill; no durable dated attempt history'});
 rowsOut.push({name:'Probability workshop (connected practice)',status:'Partial — correct answers only',detail:'Incorrect attempts are not sent to the answer ledger, so accuracy for this source is overstated'});
 rowsOut.push({name:'Hands-on Studio, formula lab, manipulatives, teach-back, embedded lesson practice',status:'No attempt records',detail:'No dated graded attempts are saved by these activities'});
 return rowsOut;
}
function csv(records){
 const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
 const lines=[['course','timestamp','topic','source','mode','correct','transfer'].join(',')];
 for(let x of records)lines.push([x.course,new Date(x.at).toISOString(),x.topic,x.source,x.classification,x.correct,x.transfer].map(quote).join(','));
 const link=document.createElement('a'),blob=new Blob([lines.join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
 link.href=url;link.download='aetheria-learning-trends-'+new Date().toISOString().slice(0,10)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
}



function skillEvidence(records){
 const out=[],by=new Map();
 for(const r of records){if(r.correct===null)continue;let group=by.get(r.topic)||[];group.push(r);by.set(r.topic,group)}
 for(const [topic,group] of by){
  const independent=group.filter(r=>r.classification==='independent'),transfer=independent.filter(r=>r.transfer),days=new Set(independent.map(r=>localDay(new Date(r.at))));
  const recent=independent.slice(-5),acc=accuracy(recent);
  const strong=recent.length>=5&&acc>=.8&&days.size>=2&&transfer.some(r=>r.correct);
  const status=strong?'Strong independent evidence':recent.length>=2?'Developing independent evidence':'Insufficient independent evidence';
  const wrong=group.filter(r=>!r.correct).length;
  out.push({topic,status,independent:independent.length,accuracy:acc,transfer:transfer.length,days:days.size,wrong});
 }
 return out.sort((a,b)=>a.status.localeCompare(b.status)||a.accuracy-b.accuracy);
}
function trendSVG(series){
 const valid=series.map((x,i)=>({...x,i})).filter(x=>Number.isFinite(x.overall));
 if(valid.length<2)return '<p><small>At least two recorded weeks are needed for a trend line.</small></p>';
 const W=720,H=190,L=40,R=15,T=15,B=30,xx=i=>L+(i/(Math.max(1,series.length-1)))*(W-L-R),yy=v=>H-B-(v*(H-T-B));
 const path=valid.map((r,i)=>(i?'L':'M')+xx(r.i).toFixed(1)+' '+yy(r.overall).toFixed(1)).join(' ');
 const grid=[0,.25,.5,.75,1].map(v=>'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy(v)+'" y2="'+yy(v)+'" stroke="#695675" stroke-width="1"/><text x="3" y="'+(yy(v)+4)+'" font-size="12" fill="#fff1e3">'+Math.round(v*100)+'%</text>').join('');
 const tick=series.filter((x,i)=>i===0||i===series.length-1||i%3===0).map((x)=>{const i=series.indexOf(x);return '<text x="'+xx(i)+'" y="'+(H-7)+'" text-anchor="middle" font-size="11" fill="#fff1e3">'+E(x.week.slice(5))+'</text>'}).join('');
 return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block" role="img" aria-label="Overall weekly accuracy trend"><title>Weekly correct-answer rate</title><desc>Line showing recorded overall answer accuracy by week. The table below provides exact values.</desc>'+grid+tick+'<path d="'+path+'" fill="none" stroke="#ffdc94" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+valid.map(x=>'<circle cx="'+xx(x.i)+'" cy="'+yy(x.overall)+'" r="4.5" fill="#ffe5aa"/>').join('')+'</svg>';
}

function learningTransitions(records){
 const ordered=records.filter(x=>x.correct!==null).slice().sort((a,b)=>a.at-b.at),byTopic=new Map();
 for(const row of ordered){if(!byTopic.has(row.topic))byTopic.set(row.topic,[]);byTopic.get(row.topic).push(row)}
 const result={guidedToIndependent:0,guidedToIndependentCorrect:0,errorToIndependent:0,errorToIndependentCorrect:0,transferAttempts:0,transferCorrect:0};
 for(const row of ordered){if(row.transfer){result.transferAttempts++;if(row.correct)result.transferCorrect++;}}
 for(const rows of byTopic.values()){
  for(let i=0;i<rows.length;i++){
   const r=rows[i];if(r.classification!=='independent')continue;
   const earlier=rows.slice(0,i).filter(p=>r.at>p.at&&r.at-p.at<=7*msDay);
   if(earlier.some(p=>p.classification==='guided')){result.guidedToIndependent++;if(r.correct)result.guidedToIndependentCorrect++}
   if(earlier.some(p=>p.correct===false)){result.errorToIndependent++;if(r.correct)result.errorToIndependentCorrect++}
  }
 }
 return result;
}
function gameSessionTrends(){
 const out=[],cutoff=now()-windowDays*msDay;
 for(const [course,p] of Object.entries(window.S?.progress||{})){
  if(selected!=='all'&&selected!==course)continue;
  for(const x of (Array.isArray(p?.realmSessions)?p.realmSessions:[])){
   if(Number(x.at)<cutoff||Number(x.at)>now()+msDay)continue;
   const score=Number(x.score),total=Number(x.total);
   out.push({course,game:String(x.gameId||'Game Realm'),at:Number(x.at),percent:total>0?score/total:null,won:x.won===true});
  }
 }
 return out.sort((a,b)=>a.at-b.at);
}
function summaryOnly(){
 const progress=window.S?.progress||{},out=[];
 for(const [course,p] of Object.entries(progress)){
  if(p?.realmRecords&&typeof p.realmRecords==='object'){
   const sessions=Array.isArray(p.realmSessions)?p.realmSessions:[];
   const plays=Object.values(p.realmRecords).reduce((n,r)=>n+Math.max(0,Number(r?.plays||0)),0);
   if(plays)out.push({course,system:'Game Realm',amount:plays,note:sessions.length?'Dated game sessions: '+sessions.length+'; game scores still do not establish independent skill mastery':'Older aggregate game plays only; no dated session history'});
  }
  if(Array.isArray(p?.repair)&&p.repair.length)out.push({course,system:'Legacy repair log',amount:p.repair.length,note:'Repairs recorded; independent transfer evidence not guaranteed'});
  if(Array.isArray(p?.solutionWorkshopSessions)&&p.solutionWorkshopSessions.length)out.push({course,system:'Solution Workshop',amount:p.solutionWorkshopSessions.length,note:'Dated guided completion records; no independent academic mastery is implied'});
 }
 return out;
}

function meetingSkillHistory(meetings){
 const m=new Map();
 for(const meeting of meetings){
  for(const check of meeting.checks||[]){
   if(!Array.isArray(check)||typeof check[1]!=='boolean')continue;
   let a=m.get(String(check[0]))||{name:String(check[0]),count:0,met:0};
   a.count++;if(check[1])a.met++;m.set(a.name,a);
  }
 }
 return [...m.values()].sort((a,b)=>(a.met/a.count)-(b.met/b.count));
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
 const moves=learningTransitions(items),aggregates=summaryOnly();
 const games=gameSessionTrends();
 const meetingSkills=meetingSkillHistory(meetings);
 const evidence=skillEvidence(items),confidentErrors=items.filter(x=>x.correct===false&&/^(certain|very sure|high)$/i.test(x.confidence)).length;
 const metrics=[['Recorded attempts',scored.length],['Accuracy',number(accuracy(scored))],['Guided accuracy',number(accuracy(guided))],['Independent accuracy',number(accuracy(ind))],['Unknown mode',uncertain.length],['IEP rehearsals',meetings.length]];
 const metricHTML=metrics.map(([k,v])=>'<div class="loMetric"><small>'+E(k)+'</small><b>'+E(v)+'</b></div>').join('');
 const skillHTML=skills.map(v=>'<tr><td>'+E(v.topic)+'</td><td>'+v.attempts+'</td><td>'+number(v.acc)+'</td><td>'+number(v.guided)+'</td><td>'+number(v.independent)+'</td><td>'+v.unknown+'</td><td class="loTrend">'+(v.delta===null?'Not enough data':(v.delta>=0?'+':'')+Math.round(v.delta*100)+' percentage points')+'</td></tr>').join('');
 const sourceMap=new Map();items.forEach(x=>{const a=sourceMap.get(x.source)||[];a.push(x);sourceMap.set(x.source,a)});
 const sourceHTML=[...sourceMap.entries()].sort((a,b)=>b[1].length-a[1].length).map(([k,a])=>'<tr><td>'+E(k)+'</td><td>'+a.length+'</td><td>'+number(accuracy(a))+'</td></tr>').join('');
 const meetingsHTML=meetings.slice(-12).reverse().map(x=>'<tr><td>'+new Date(x.at).toLocaleDateString()+'</td><td>'+E(x.profile)+'</td><td>'+E(x.mode)+'</td><td>'+(x.met?'Practice checks met':'Needs practice')+'</td><td>'+x.xp+'</td></tr>').join('');
 const evidenceHTML=evidence.map(x=>'<tr><td>'+E(x.topic)+'</td><td>'+E(x.status)+'</td><td>'+x.independent+'</td><td>'+number(x.accuracy)+'</td><td>'+x.transfer+'</td><td>'+x.days+'</td></tr>').join('');
 const weekHTML=weeks.map(x=>'<tr><td>'+E(x.week)+'</td><td>'+x.n+'</td><td>'+number(x.overall)+'</td><td>'+number(x.guided)+'</td><td>'+number(x.independent)+'</td></tr>').join('');
 const tipHTML=studyTips.map(x=>'<li><b>'+E(x.title)+':</b> '+E(x.text)+'</li>').join('');
 const meetingSkillHTML=meetingSkills.map(x=>'<tr><td>'+E(x.name)+'</td><td>'+x.met+' / '+x.count+'</td><td>'+number(x.met/x.count)+'</td></tr>').join('');
 const gameHTML=games.slice(-50).reverse().map(x=>'<tr><td>'+new Date(x.at).toLocaleDateString()+'</td><td>'+E(x.course)+'</td><td>'+E(x.game)+'</td><td>'+(x.percent===null?'Not scored':number(x.percent))+'</td><td>'+(x.won?'Yes':'No')+'</td></tr>').join('');
 const aggregateHTML=aggregates.map(x=>'<tr><td>'+E(x.course)+'</td><td>'+E(x.system)+'</td><td>'+x.amount+'</td><td>'+E(x.note)+'</td></tr>').join('');
 const auditHTML=audit.map(x=>'<tr><td>'+E(x.name)+'</td><td>'+E(x.status)+'</td><td>'+E(x.detail)+'</td></tr>').join('');
 host.innerHTML='<section role="dialog" aria-modal="true" aria-label="Learning progress observatory"><header><div><small>Moonlit Collegium · Learning Observatory</small><h2>My Learning Trends</h2></div><button id="loClose">Close ✕</button></header>'+
 '<p>Compare what is working across your course practice. These charts are based on saved records in this browser, not a complete audit of every learning system.</p>'+
 '<div class="loControls"><label>Course <select id="loCourse"><option value="all">All courses</option>'+available.map(x=>'<option value="'+E(x)+'" '+(selected===x?'selected':'')+'>'+E(x)+'</option>').join('')+'</select></label><label>Period <select id="loWindow">'+[7,30,90,365].map(n=>'<option value="'+n+'" '+(windowDays===n?'selected':'')+'>'+n+' days</option>').join('')+'</select></label><button id="loRefresh">Refresh</button></div>'+
 '<p><small>From '+E(date)+' · '+scored.length+' scored attempts with timestamps · '+(items.length-scored.length)+' unscored in this selection · '+(total.length-items.length)+' records outside the selected period or course</small></p><div class="loMetrics">'+metricHTML+'</div>'+
 '<div class="loNote"><b>How to interpret:</b> Guided and independent attempts are separate. Unlabeled records remain unknown mode, not assumed independent. A good guided score does not prove mastery. Skill trends compare the latest eight scored responses against the previous eight, only when each period contains four or more attempts. Small samples are not definitive.</div>'+
 '<h3>Mastery evidence — not automatic mastery credit</h3><p><small>Strong evidence requires at least five recent independent attempts, 80% accuracy, attempts on two dates, and one correct fresh transfer-marked attempt. This is an advisory signal, not the formal independent mastery engine.</small></p><div class="loScroll"><table><thead><tr><th>Skill</th><th>Evidence</th><th>Independent attempts</th><th>Recent accuracy</th><th>Transfer attempts</th><th>Practice days</th></tr></thead><tbody>'+(evidenceHTML||'<tr><td colspan="6">No independent skill evidence available.</td></tr>')+'</tbody></table></div>'+
 '<p><small>High-confidence errors in selected attempts: '+confidentErrors+'. These may deserve priority review when the original confidence label is available.</small></p>'+
 '<h3>Skills that need attention</h3><div class="loScroll"><table><thead><tr><th>Concept</th><th>Attempts</th><th>Overall</th><th>Guided</th><th>Independent</th><th>Unknown mode</th><th>Recent change</th></tr></thead><tbody>'+(skillHTML||'<tr><td colspan="7">No timestamped skill records yet.</td></tr>')+'</tbody></table></div>'+
 '<h3>Weekly performance trends</h3><div class="loNote">'+trendSVG(weeks)+'</div><div class="loScroll"><table><thead><tr><th>Week</th><th>Attempts</th><th>Overall</th><th>Guided</th><th>Independent</th></tr></thead><tbody>'+(weekHTML||'<tr><td colspan="5">No dated attempts yet.</td></tr>')+'</tbody></table></div>'+
 '<h3>Which practice systems are generating results?</h3><div class="loScroll"><table><thead><tr><th>Source</th><th>Attempts</th><th>Accuracy</th></tr></thead><tbody>'+(sourceHTML||'<tr><td colspan="3">No answer-level records available for this selection.</td></tr>')+'</tbody></table></div>'+
 '<h3>D756 meeting rubric trends</h3><p><small>Shows the share of completed rehearsals meeting each provisional criterion. It is not official WGU scoring.</small></p><div class="loScroll"><table><thead><tr><th>Collaboration skill</th><th>Meetings met</th><th>Rate</th></tr></thead><tbody>'+(meetingSkillHTML||'<tr><td colspan="3">No comparable D756 meeting rubric history yet.</td></tr>')+'</tbody></table></div>'+ 
 '<h3>D756 meeting practice</h3><p>'+meetings.length+' completed rehearsals in this period; '+pass+' met the app’s provisional practice criteria. This is not official Mursion scoring.</p><div class="loScroll"><table><thead><tr><th>Date</th><th>Case</th><th>Mode</th><th>Checks</th><th>XP</th></tr></thead><tbody>'+(meetingsHTML||'<tr><td colspan="5">No completed meeting history saved in this browser.</td></tr>')+'</tbody></table></div>'+
 '<h3>What to work on next</h3><div class="loNote"><ul>'+tipHTML+'</ul><small>Data-driven practice suggestions are provisional; they do not establish cause or independently certify mastery.</small></div>'+
 '<h3>Are practice strategies translating into independence?</h3><div class="loMetrics">'+
 '<div class="loMetric"><small>Independent attempts after guided practice (same skill, within 7 days)</small><b>'+moves.guidedToIndependent+'</b><small>Correct: '+moves.guidedToIndependentCorrect+' · This is an association, not proof of cause</small></div>'+
 '<div class="loMetric"><small>Independent attempts after an earlier mistake (same skill, within 7 days)</small><b>'+moves.errorToIndependent+'</b><small>Correct: '+moves.errorToIndependentCorrect+'</small></div>'+
 '<div class="loMetric"><small>Saved transfer/recall-marked attempts</small><b>'+moves.transferAttempts+'</b><small>Correct: '+moves.transferCorrect+'</small></div></div>'+
 '<p><small>These counts require chronological, skill-tagged answers. Missing timestamps and summary-only activities cannot support the analysis.</small></p>'+
 '<h3>Game Realm sessions (scores, not mastery)</h3><div class="loScroll"><table><thead><tr><th>Date</th><th>Course</th><th>Game</th><th>Score</th><th>Won</th></tr></thead><tbody>'+(gameHTML||'<tr><td colspan="5">No dated game sessions available yet. Historical aggregate game results are listed below.</td></tr>')+'</tbody></table></div>'+'<h3>Summary-only practice records</h3><div class="loScroll"><table><thead><tr><th>Course</th><th>Activity</th><th>Count</th><th>Interpretation</th></tr></thead><tbody>'+(aggregateHTML||'<tr><td colspan="4">No separate summary-only results found.</td></tr>')+'</tbody></table></div>'+
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
function open(){style();focusBefore=document.activeElement;let host=document.getElementById('majLearningObservatory');if(!host){host=document.createElement('div');host.id='majLearningObservatory';host.addEventListener?.('keydown',keys);document.body.append(host);}draw();host.querySelector('#loClose')?.focus();}
function close(){document.getElementById('majLearningObservatory')?.remove();focusBefore?.focus?.();}
function keys(e){
 const host=document.getElementById('majLearningObservatory');if(!host)return;
 if(e.key==='Escape'){e.preventDefault();close();return}
 if(e.key!=='Tab')return;
 const f=[...host.querySelectorAll('button,select,[href],[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled);if(!f.length)return;
 const first=f[0],last=f[f.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
function attach(){style();const nav=document.querySelector('.side .nav, aside .nav');if(!nav||document.getElementById('majLearningObservatoryBtn'))return;let b=document.createElement('button');b.id='majLearningObservatoryBtn';b.type='button';b.setAttribute('aria-label','Open Learning Observatory');b.innerHTML='<span>◈</span><span class="label">Learning Observatory</span>';b.onclick=open;const journal=nav.querySelector('button[data-nav="journal"]');if(journal)journal.after(b);else nav.append(b);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();const watcher=new MutationObserver(()=>{if(!document.getElementById('majLearningObservatoryBtn'))attach()});watcher.observe(document.body,{childList:true,subtree:true});
window.MajickLearningObservatory={version:'1.1',open,close,refresh:draw,classify:(row,source)=>classify(row||{},source),summary:()=>({attempts:data().length,meetings:d756().length})};
})();