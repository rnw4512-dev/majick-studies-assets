(function(){
'use strict';
const STAGES=['New Bond','Apprentice','Guardian','Ascendant','Celestial'];
const POS=[0,25,50,75,100];
function e(s){try{return esc(String(s??''))}catch(_){return String(s??'')}}
function canon(type){try{return v338Canon(type)}catch(_){return (window.V338_CANON||{})[type]||null}}
function idx(p){const lv=typeof masPetLevel==='function'?masPetLevel(p):1;return lv>=12?4:lv>=8?3:lv>=5?2:lv>=3?1:0}
function stage(p){return STAGES[idx(p)]}
function bannerSlice(type,i,cls=''){
  const c=canon(type); if(!c)return '';
  return '<div class="v3311Slice '+cls+'" style="--slice-img:url(\''+c.banner+'\');--slice-pos:'+POS[i]+'%;--slice-accent:'+c.accent+'"><span>'+STAGES[i]+'</span></div>';
}
window.v3311StageSlice=bannerSlice;

// Keep approved canon portrait art in normal UI. Evolution banners are only used in the Evolution Codex.
const oldPortrait=window.v334Portrait;
window.v334Portrait=function(p,variant='card'){
  if(!p||!canon(p.type))return oldPortrait?oldPortrait(p,variant):'';
  const c=canon(p.type),name=e(c.display||p.name),st=stage(p);
  return '<div class="familiarPortrait '+variant+' v3311CanonPortrait" data-pet-type="'+e(p.type)+'" title="'+name+' • '+e(c.species)+' • '+st+'"><img src="'+c.portrait+'" alt="'+name+', '+e(c.species)+'"><span class="familiarSigil">'+e(c.sigil)+'</span><span class="v3311StageBadge">'+st+'</span></div>';
};

function pages(){
 const c=course(), out=[{id:'cover',title:c.id+' Living Grimoire',sub:c.title,kind:'cover'}];
 const sections=(c.studySections&&c.studySections.length)?c.studySections:autoStudySections(c);
 sections.forEach((s,i)=>out.push({id:'s'+i,title:s.title||('Chapter '+(i+1)),sub:s.summary||'',kind:'section',rows:s.rows||[],concepts:s.concepts||[],trap:s.trap||''}));
 out.push({id:'mistakes',title:'Mistake Grimoire',sub:'Recent traps worth repairing',kind:'mistakes'});
 out.push({id:'glossary',title:'Spellbook of Terms',sub:'Fast retrieval of course language',kind:'glossary',glossary:c.glossary||{}});
 return out;
}
function textOf(p){
 let a=[p.title,p.sub,p.trap];
 (p.rows||[]).forEach(r=>a.push(...r));
 Object.entries(p.glossary||{}).forEach(([k,v])=>a.push(k,v));
 return a.filter(Boolean).join('. ');
}
function body(p){
 if(p.kind==='cover')return '<div class="v3311CoverSigil">☾</div><p class="v3311Lead">Your free interactive course book. No credits, no paywall, no external page service.</p><div class="v3311Promise"><span>✦ Page turning</span><span>✦ Search</span><span>✦ Read aloud</span><span>✦ Built-in practice</span></div>';
 if(p.kind==='section')return '<p class="v3311Lead">'+e(p.sub)+'</p><div class="v3311Rows">'+(p.rows||[]).map(r=>'<div><b>'+e(r[0])+'</b><span>'+e(r[1])+'</span>'+(r[2]?'<em>'+e(r[2])+'</em>':'')+'</div>').join('')+'</div>'+(p.trap?'<aside><b>WGU trap</b><span>'+e(p.trap)+'</span></aside>':'')+(p.concepts?.length?'<button class="btn violet" onclick=\'practiceTopics('+JSON.stringify(p.concepts)+')\'>Practice this chapter ✦</button>':'');
 if(p.kind==='mistakes'){
   const recent=(prog().answers||[]).slice(-60).filter(a=>!a.correct).slice(-8).reverse();
   if(!recent.length)return '<div class="v3311Empty">No recent missed-question repairs yet ✨</div>';
   return '<div class="v3311Mistakes">'+recent.map(a=>{const q=course().questionBank.find(x=>x.id===a.questionId);if(!q)return '';return '<article><b>'+e(cleanPrompt(q.prompt))+'</b><span class="bad">You chose: '+e(a.chosen)+'</span><span class="good">Best answer: '+e(q.answer)+'</span><p>'+e(q.why||'')+'</p><button class="btn ghost" onclick="practiceTopics([\''+e(a.topicId)+'\'])">Repair this concept</button></article>'}).join('')+'</div>';
 }
 return '<div class="v3311Glossary">'+Object.entries(p.glossary||{}).map(([k,v])=>'<details><summary>'+e(k)+'</summary><p>'+e(v)+'</p></details>').join('')+'</div>';
}
window.v3311SetPage=function(n){S.v3311Page=Math.max(0,Number(n)||0);save();render()};
window.v3311Speak=function(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t||''));u.rate=.94;speechSynthesis.speak(u)}catch(_){}};
function grimoire(){
 const ps=pages(),i=Math.min(ps.length-1,Math.max(0,Number(S.v3311Page)||0)),p=ps[i];
 return '<section class="v3311BookShell"><header><div><div class="eyebrow">THE ARCANE STACKS • FREE EDITION</div><h2>Living Grimoire</h2><p>Built into Majick Studies. No purchased credits.</p></div></header><div class="v3311BookStage"><button class="v3311Arrow" '+(i===0?'disabled':'')+' onclick="v3311SetPage('+(i-1)+')">‹</button><article class="v3311Book '+(p.kind==='cover'?'cover':'')+'"><div class="v3311Folio">'+(i+1)+' / '+ps.length+'</div><h3>'+e(p.title)+'</h3>'+body(p)+'<footer><button class="btn ghost" onclick=\'v3311Speak('+JSON.stringify(textOf(p))+')\'>🔊 Read this page</button>'+(p.concepts?.length?'<button class="btn primary" onclick=\'practiceTopics('+JSON.stringify(p.concepts)+')\'>Study this page</button>':'')+'</footer></article><button class="v3311Arrow" '+(i===ps.length-1?'disabled':'')+' onclick="v3311SetPage('+(i+1)+')">›</button></div><nav class="v3311Chapters">'+ps.map((x,j)=>'<button class="'+(j===i?'active':'')+'" onclick="v3311SetPage('+j+')">'+e(x.title)+'</button>').join('')+'</nav></section>';
}
window.livingGrimoireHTML=grimoire;

const oldScreen=window.screenHTML;
window.screenHTML=function(){if(S.screen==='livinggrimoire')return grimoire();return oldScreen()};
const oldSide=window.sideHTML;
window.sideHTML=function(){
 let h=oldSide();
 if(!h.includes('data-nav="livinggrimoire"')){
  const target='<button data-nav="guide"';
  const at=h.indexOf(target);
  if(at>=0)h=h.slice(0,at)+'<button data-nav="livinggrimoire" class="'+(S.screen==='livinggrimoire'?'active':'')+'" onclick="navigate(\'livinggrimoire\')"><span>◫</span><span class="label">Living Grimoire</span></button>'+h.slice(at);
 }
 return h;
};

function evoPanel(type,pet){
 const c=canon(type); if(!c)return '';
 const ci=pet?idx(pet):2,lv=pet&&typeof masPetLevel==='function'?masPetLevel(pet):null;
 return '<section class="v3311Evolution" style="--evo:'+c.accent+'"><div class="v3311EvoHead"><div><div class="eyebrow">EVOLUTION CODEX</div><h3>'+e(c.display)+' • '+e(c.title)+'</h3><p>'+e(c.species)+(lv?' • Level '+lv+' • '+STAGES[ci]:'')+'</p></div><img src="'+c.portrait+'" alt="'+e(c.display)+' canon portrait"></div><img class="v3311FullBanner" src="'+c.banner+'" alt="'+e(c.display)+' five-stage evolution banner"><div class="v3311StageChips">'+STAGES.map((s,i)=>'<span class="'+(i===ci?'current':'')+'">'+s+'</span>').join('')+'</div></section>';
}
try{
 const oldComp=window.companionHTML;
 window.companionHTML=function(){
   const base=oldComp(),pets=S.legacy?.pets||[];
   const extras=Object.keys(V338_CANON||{}).map(t=>evoPanel(t,pets.find(p=>p.type===t))).join('');
   return base+'<section class="v3311EvolutionWrap"><div class="sectionTitle"><div><h2>Guardian Evolution Codex</h2><p>Exact approved portraits remain the normal UI art. The full five-stage approved banners live here.</p></div></div>'+extras+'</section>';
 };
}catch(e){console.warn('V3.3.11 codex',e)}

if(!window.__v3311Bridge){
 window.__v3311Bridge=true;
 window.addEventListener('message',ev=>{const d=ev.data||{};if(d.type==='MAJICK_OPEN_ROUTE_V3311'&&d.route)navigate(d.route)});
}

window.v3311RefreshBrand=function(){
  const p=document.querySelector('.top .pill');
  if(p)p.textContent='Living Familiars • V3.3.11 Living Grimoire';
  document.title='Majick Studies — Living Grimoire';
};
})();