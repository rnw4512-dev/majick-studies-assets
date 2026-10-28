(()=>{'use strict';
const TYPES={learn:{xp:5,crystals:1,effort:1},guided:{xp:3,crystals:0,effort:1},feedback:{xp:2,crystals:0,effort:1},repair:{xp:8,crystals:1,effort:1},independent:{xp:10,crystals:2,effort:2},transfer:{xp:15,crystals:3,effort:2},session:{xp:15,crystals:3,effort:2},mastery:{xp:30,crystals:5,effort:4},oa:{xp:20,crystals:4,effort:2}};
function root(){const a=window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount;if(!a)return null;const r=a.rewardCore;if(!r)return null;r.scholarEffort=r.scholarEffort||{version:1,points:0,events:{},journal:[],daily:{}};return {a,r,e:r.scholarEffort}}
function save(){try{window.save?.()}catch(_){}}
function date(){return new Date().toLocaleDateString('en-CA')}
function grant(type,key,opts={}){const s=root(),cfg=TYPES[type];if(!s||!cfg||!key||opts.historical)return null;const {a,r,e}=s,id=String(key);if(e.events[id])return null;
if(type==='mastery'&&!opts.independentlyVerified)return null;
if(type==='independent'&&opts.assisted)return null;
if(type==='transfer'&&(!opts.correct||opts.assisted))return null;
if(type==='feedback'&&!opts.feedbackCompleted)return null;
if(type==='learn'&&!opts.completed)return null;
if(type==='session'&&Number(opts.questionCount||0)<5)return null;
if(type==='oa'&&(!opts.completed||Number(opts.questionCount||0)<10))return null;
const today=date(),d=e.daily[today]||{fragments:0};let xp=opts.existingReward?0:cfg.xp,crystals=opts.existingReward?0:cfg.crystals;
if(opts.repeat){xp=Math.floor(xp/2);crystals=0}
const before=Number(e.points||0);e.points=(before+cfg.effort)%10;
let fragments=Math.floor((before+cfg.effort)/10);if(d.fragments>=3)fragments=0;else fragments=Math.min(fragments,3-d.fragments);
if(fragments){r.eggFragments=Number(r.eggFragments||0)+fragments;d.fragments+=fragments}
e.daily[today]=d;
const oldXp=Math.max(Number(a.xp||0),Number(a.xpHighWater||0));a.xp=oldXp+xp;a.xpHighWater=Math.max(Number(a.xpHighWater||0),a.xp);a.lifetimeXpHighWater=a.xpHighWater;a.crystals=Math.max(0,Number(a.crystals||0)+crystals);
const receipt={type,key:id,xp,crystals,effort:cfg.effort,fragments,at:Date.now(),course:opts.course||window.S?.activeCourse||''};
e.events[id]=receipt;e.journal.push(receipt);if(e.journal.length>300)e.journal=e.journal.slice(-300);
save();render();return receipt}
function snapshot(){const s=root();return s?{points:s.e.points,fragments:s.r.eggFragments,journal:s.e.journal.slice(),events:Object.keys(s.e.events).length}:null}
function render(){const s=snapshot();if(!s)return;document.querySelectorAll('[data-scholar-effort]').forEach(n=>{n.textContent='🥚 '+s.fragments+'/10 fragments · '+s.points+'/10 effort to next fragment'});
const j=document.querySelector('[data-scholar-reward-journal]');if(j)j.innerHTML=s.journal.slice(-15).reverse().map(v=>'<li>'+v.type.replace(/-/g,' ')+' · +'+v.xp+' XP · +'+v.crystals+' crystals · +'+v.effort+' effort'+(v.fragments?' · +'+v.fragments+' fragment':'')+'</li>').join('')||'<li>No new rewards yet.</li>'}
function mount(){if(document.getElementById('scholarEffortWidget'))return;const host=document.createElement('aside');host.id='scholarEffortWidget';host.style.cssText='position:fixed;right:12px;bottom:12px;z-index:1200;background:#fff9ed;color:#24213f;border:2px solid #9b7b42;border-radius:14px;padding:9px;max-width:min(340px,90vw);box-shadow:0 4px 16px #0004';host.innerHTML='<div data-scholar-effort aria-live="polite"></div><details><summary>Scholar’s Reward Journal</summary><ol data-scholar-reward-journal style="max-height:200px;overflow:auto"></ol></details>';document.body.appendChild(host);render()}
document.addEventListener('majick:verified-study-answer',ev=>{const v=ev.detail||{};if(v.historical||!v.key)return;grant(v.correct?(v.independent?'independent':'guided'):'feedback','answer:'+v.key,{existingReward:v.correct,assisted:!v.independent,feedbackCompleted:!v.correct,course:v.course})});
window.MajickScholarEffort={grant,snapshot,render,TYPES};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();