/* Majick Studies · shared visual-evidence gate · V3.4.2
 * No renderer may grade a question that requires an absent chart.
 * This module has no academic mastery, XP, guardian, or progress ownership.
 */
(()=>{
'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reference=/\b(?:supplied|shown|pictured|provided|accompanying|following|in the|from the|using the)\b.{0,105}\b(?:histogram|scatter\s?plot|box\s?plot|bar\s?(?:chart|graph)|line\s?graph|pie\s?chart|graph|chart|figure|diagram|dot\s?plot)\b|\b(?:histogram|scatter\s?plot|box\s?plot|graph|chart|figure|diagram)\b.{0,75}\b(?:shown|provided|pictured|below|above)\b/i;
function knownSalary(q){
 return /supplied salary histogram/i.test(String(q?.prompt||'')) && /\bunimodal\b/i.test(String(q?.answer||''));
}
function salaryHistogram(){
 const bins=[12,9,6,4,2,1],labels=['20–39','40–59','60–79','80–99','100–119','120–139'];
 const bars=bins.map((n,i)=>'<rect x="'+(56+i*47)+'" y="'+(187-n*11)+'" width="47" height="'+(n*11)+'" fill="#a879d3" stroke="#f8dfaa" stroke-width=".8"/>').join('');
 const ticks=labels.map((t,i)=>'<text x="'+(79+i*47)+'" y="204" text-anchor="middle" font-size="10" fill="#fff0db">'+t+'</text>').join('');
 return '<figure class="majickEvidenceChart" style="padding:16px;margin:16px 0;border:1px solid #bc91ce;border-radius:14px;background:#24142f;color:#fff0db"><figcaption><b>Salary histogram · practice data</b><p style="margin:4px 0">Read the bar heights and count distinct peaks.</p></figcaption><svg role="img" aria-label="Histogram: salaries in thousands 20–39 frequency 12; 40–59 frequency 9; 60–79 frequency 6; 80–99 frequency 4; 100–119 frequency 2; 120–139 frequency 1." viewBox="0 0 370 240" style="width:100%;max-width:550px;display:block;margin:auto"><line x1="56" y1="187" x2="338" y2="187" stroke="#fff0db"/><line x1="56" y1="51" x2="56" y2="187" stroke="#fff0db"/>'+bars+ticks+'<text x="195" y="231" fill="#fff0db" font-size="12" text-anchor="middle">Salary ($ thousands)</text><text x="15" y="121" transform="rotate(-90 15 121)" fill="#fff0db" font-size="12" text-anchor="middle">Frequency</text><text x="48" y="191" fill="#fff0db" font-size="10" text-anchor="end">0</text><text x="48" y="126" fill="#fff0db" font-size="10" text-anchor="end">6</text><text x="48" y="58" fill="#fff0db" font-size="10" text-anchor="end">12</text></svg><figcaption>Illustrative values for this practice question; not actual salary survey data.</figcaption></figure>';
}
/* Audit metadata before allowing any visual interpretation to be scored.
 * Visual data must be supported by an actual, nonempty representation and matching type.
 */
const finite=n=>Number.isFinite(Number(n));
function validateVisual(v){
 if(!v||typeof v!=='object')return {ok:false,reason:'missing visual specification'};
 const type=String(v.type||'').toLowerCase();
 if(type==='bars'||type==='histogram'){
  if(!Array.isArray(v.values)||!v.values.length||v.values.length>40||!v.values.every(n=>finite(n)&&Number(n)>=0))return {ok:false,reason:'invalid bar frequencies'};
  if(!Array.isArray(v.labels)||v.labels.length!==v.values.length)return {ok:false,reason:'interval labels do not match frequencies'};
  if(type==='bars'&&(!finite(v.max)||Number(v.max)<=0||!finite(v.step)||Number(v.step)<=0||v.values.some(n=>Number(n)>Number(v.max))))return {ok:false,reason:'invalid chart scale'};
  return {ok:true,type};
 }
 if(type==='dots')return {ok:Array.isArray(v.values)&&v.values.length>0&&v.values.every(finite)&&finite(v.min)&&finite(v.max)&&Number(v.max)>Number(v.min),type,reason:'dot plot requires finite observations and a valid range'};
 if(type==='venn'||type==='tokens')return {ok:Array.isArray(v.values)&&v.values.length>0&&v.values.every(n=>finite(n)&&Number(n)>=0)&&Array.isArray(v.labels)&&v.labels.length>=2,type,reason:'probability diagram needs valid labels and counts'};
 if(type==='table')return {ok:Array.isArray(v.headers)&&v.headers.length>0&&Array.isArray(v.rows)&&v.rows.length>0&&v.rows.every(row=>Array.isArray(row)&&row.length===v.headers.length),type,reason:'data table has missing columns or rows'};
 if(type==='scatter'||type==='scatterplot')return {ok:Array.isArray(v.points)&&v.points.length>=2&&v.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(finite)),type,reason:'scatterplot needs at least two finite ordered pairs'};
 if(type==='box'||type==='boxplot'||type==='box-plot'){const a=v.fiveNumber||v.fiveNumberSummary||v.values;return {ok:Array.isArray(a)&&a.length===5&&a.every(finite)&&a.every((n,i)=>i===0||Number(n)>=Number(a[i-1])),type,reason:'box plot requires ordered minimum, Q1, median, Q3 and maximum'};}
 return {ok:false,type,reason:'visual type lacks a verified renderer'};
}
function audit(questions){
 const rows=(Array.isArray(questions)?questions:[]).map(q=>{const result=evidence(q);return {id:String(q?.id||q?.qid||''),required:result.required,status:result.ok?'usable':'blocked',source:result.source,reason:result.reason||''}});
 return {total:rows.length,requiringVisual:rows.filter(x=>x.required).length,blocked:rows.filter(x=>x.status==='blocked'),rows};
}
function evidence(q,extraRenderer){
 const prompt=String(q?.prompt||'');
 if(knownSalary(q))return {required:true,ok:true,prompt:'Examine the salary histogram. What is its modality?',html:salaryHistogram(),source:'verified-example'};
 const explicit=Boolean(q?.visual||q?.chart||q?.graph||q?.figure||q?.visualHtml);
 const required=explicit||reference.test(prompt);
 if(!required)return {required:false,ok:true,prompt,html:'',source:'not-required'};
 let html='';
 if(q?.visual){const check=validateVisual(q.visual);if(!check.ok)return {required:true,ok:false,prompt,html:'',source:'invalid-visual',reason:check.reason};}
 if(typeof q?.visualHtml==='string'&&/<(?:svg|img|canvas|table|figure)\b/i.test(q.visualHtml))html=q.visualHtml;
 if(!html&&q?.visual&&typeof extraRenderer==='function'){try{html=String(extraRenderer(q)||'')}catch(error){html=''}}
 if(!html&&q?.visual&&typeof globalThis.MajickCourseTutor?.questionVisualHtml==='function'){try{html=String(globalThis.MajickCourseTutor.questionVisualHtml(q)||'')}catch(error){html=''}}
 // Do not confuse a blank string or a label-only fragment with visual evidence.
 const ok=/<(?:svg|img|canvas|table|figure)\b/i.test(html);
 return {required,ok,prompt,html:ok?html:'',source:ok?'question-metadata':'missing'};
}
function blockedHtml(){
 return '<section class="majickMissingEvidence" role="alert" style="border:2px solid #e5bc75;border-radius:14px;padding:18px;margin:14px 0;background:#25182e;color:#fff1d9"><strong>Visual evidence unavailable</strong><p>This question requires a graph or diagram that was not provided. You should not have to guess. This is a technical/content issue, not a learning mistake; it cannot be graded or counted toward mastery.</p></section>';
}
globalThis.MajickVisualEvidence=Object.freeze({evidence,blockedHtml,validateVisual,audit,needsVisual:q=>evidence(q).required,hasVisual:q=>evidence(q).ok,escape});
})();