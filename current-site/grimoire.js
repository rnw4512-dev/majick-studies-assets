/* Living Grimoire owner. v3311 is a retained save-format key, not a renderer. */
(()=>{'use strict';
if(window.MajickGrimoire)return;
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function state(){return window.MajickStateCore.legacyExtensions()}
function courseView(){
 const g=state().grimoire,id=course().id;
 // Attribute the old shared view to the course active at migration, once.
 if(!g.courseViews)g.courseViews={[id]:{page:g.page,search:g.search}};
 return g.courseViews[id]||(g.courseViews[id]={page:0,search:''});
}
function setPage(n){const g=state().grimoire,v=courseView();v.page=Math.max(0,Number(n)||0);g.page=v.page;S.v3311Page=v.page;save();render()}
function setSearch(text){const g=state().grimoire,v=courseView();v.search=String(text||'');v.page=0;g.search=v.search;g.page=0;save();render()}
function toggleBookmark(id){const a=state().grimoire.bookmarks,i=a.indexOf(id);i>=0?a.splice(i,1):a.push(id);save();render()}
function toggleRemember(id){const g=state().grimoire;g.remember[id]=!g.remember[id];save();render()}
function saveNote(id,value){state().grimoire.notes[id]=String(value||'');save()}
function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.rate=.94;speechSynthesis.speak(u)}catch(_){}}
function pages(){let c=course(),a=[{id:'cover',title:c.id+' Living Grimoire',sub:c.title,kind:'cover'}],s=c.studySections?.length?c.studySections:autoStudySections(c);s.forEach((x,i)=>a.push({id:'s'+i,title:x.title||`Chapter ${i+1}`,sub:x.summary||'',rows:x.rows||[],concepts:x.concepts||[],trap:x.trap||'',kind:'section'}));a.push({id:'mistakes',title:'Mistake Grimoire',sub:'Repair recent traps.',kind:'mistakes'},{id:'glossary',title:'Spellbook of Terms',sub:'Tap a term to reveal its meaning.',kind:'glossary',glossary:c.glossary||{}});return a}
function txt(p){let a=[p.title,p.sub,p.trap];(p.rows||[]).forEach(r=>a.push(...r));Object.entries(p.glossary||{}).forEach(([k,v])=>a.push(k,v));return a.filter(Boolean).join('. ')}
function hi(text){
 const raw=String(text||''),terms=Object.keys(course().glossary||{}).filter(t=>t.length>=4).sort((a,b)=>b.length-a.length).slice(0,60);
 if(!terms.length)return E(raw);
 const escaped=terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const regex=new RegExp('\\b('+escaped.join('|')+')\\b','gi');
 let end=0,out='';for(const match of raw.matchAll(regex)){out+=E(raw.slice(end,match.index))+'<mark>'+E(match[0])+'</mark>';end=match.index+match[0].length}return out+E(raw.slice(end));
}
function currentPage(){const view=courseView(),all=pages(),query=view.search.trim().toLowerCase();let ps=query?all.filter(p=>txt(p).toLowerCase().includes(query)):all;if(!ps.length)ps=all;const i=Math.max(0,Math.min(ps.length-1,view.page||0));return {ps,i,p:ps[i]}}
function speakCurrent(){speak(txt(currentPage().p))}
function quiz(p){let q=(course().questionBank||[]).find(x=>!p.concepts?.length||p.concepts.includes(x.topicId));if(!q)return'';return `<section class="v3311Mini"><b>${hi(cleanPrompt(q.prompt))}</b>${q.options.map((o,i)=>`<button data-grimoire-question="${E(q.id)}" data-grimoire-option="${i}" onclick="MajickGrimoire.miniQuiz(this.dataset.grimoireQuestion,Number(this.dataset.grimoireOption),this)">${E(o)}</button>`).join('')}<div id="mq-${E(q.id)}"></div></section>`}
const miniQuiz=(id,i,b)=>{let q=course().questionBank.find(x=>x.id===id),ok=q&&q.options[i]===q.answer,d=document.getElementById('mq-'+id);if(d)d.innerHTML=`<b class="${ok?'good':'bad'}">${ok?'✓ Correct':'Not quite'}</b><p>${ok?E(q.why||''):`Best answer: <b>${E(q.answer)}</b>. ${E(q.why||'')}`}</p>`;b?.parentElement?.querySelectorAll('button').forEach(x=>x.disabled=true)};
function body(p){if(p.kind==='cover')return'<div class="v3311CoverSigil">☾</div><p class="v3311Lead">Your free interactive WGU course book. No credits. No paywall.</p><div class="v3311Promise"><span>Page turns</span><span>Search</span><span>Bookmarks</span><span>Notes</span><span>Read aloud</span><span>Mini quizzes</span></div>';if(p.kind==='mistakes'){let r=(prog().answers||[]).slice(-80).filter(a=>!a.correct).slice(-8).reverse();return r.length?`<div class="v3311Mistakes">${r.map(a=>{let q=course().questionBank.find(x=>x.id===a.questionId);return q?`<article><b>${hi(cleanPrompt(q.prompt))}</b><span class="bad">You chose: ${E(a.chosen)}</span><span class="good">Best answer: ${E(q.answer)}</span><p>${hi(q.why||'')}</p></article>`:''}).join('')}</div>`:'<div class="v3311Empty">No recent repairs yet ✨</div>'}if(p.kind==='glossary')return`<div class="v3311Glossary">${Object.entries(p.glossary||{}).map(([k,v])=>`<details><summary>${E(k)}</summary><p>${hi(v)}</p></details>`).join('')}</div>`;return`<p class="v3311Lead">${hi(p.sub)}</p><div class="v3311Rows">${(p.rows||[]).map(r=>`<div><b>${hi(r[0])}</b><span>${hi(r[1])}</span>${r[2]?`<em>${hi(r[2])}</em>`:''}</div>`).join('')}</div>${p.trap?`<aside><b>WGU trap</b><span>${hi(p.trap)}</span></aside>`:''}${quiz(p)}`}
function book(){const g=state().grimoire,view=courseView(),{ps,i,p}=currentPage(),k=course().id+':'+p.id,bm=g.bookmarks.includes(k),rm=!!g.remember[k];return`<section id="majickLivingGrimoire" class="v3311BookShell"><header><div><div class="eyebrow">THE ARCANE STACKS • FREE EDITION</div><h2>Majick Living Grimoire</h2><p>Search, learn, annotate, practice and repair mistakes without leaving Majick Studies.</p></div><div class="v3311BookTools"><input value="${E(view.search)}" placeholder="Search this grimoire…"><button class="btn ghost" onclick="MajickGrimoire.setSearch(this.previousElementSibling.value)">Search</button><button class="btn ghost" onclick="MajickGrimoire.setSearch('')">Clear</button></div></header><div class="v3311BookStage"><button class="v3311Arrow" ${i?'':'disabled'} onclick="MajickGrimoire.setPage(${i-1})">‹</button><article class="v3311Book ${p.kind==='cover'?'cover':''}"><div class="v3311Folio">${i+1} / ${ps.length}</div><div class="v3311PageActions"><button class="${bm?'active':''}" data-grimoire-key="${E(k)}" onclick="MajickGrimoire.toggleBookmark(this.dataset.grimoireKey)">${bm?'★ Bookmarked':'☆ Bookmark'}</button><button class="${rm?'active':''}" data-grimoire-key="${E(k)}" onclick="MajickGrimoire.toggleRemember(this.dataset.grimoireKey)">${rm?'✦ Remembered':'✧ Remember this'}</button></div><h3>${E(p.title)}</h3>${body(p)}<section class="v3311Notes"><label>Your margin notes</label><textarea data-grimoire-key="${E(k)}" onblur="MajickGrimoire.saveNote(this.dataset.grimoireKey,this.value)" placeholder="Write a note to future-you…">${E(g.notes[k]||'')}</textarea></section><footer><button class="btn ghost" onclick="MajickGrimoire.speakCurrent()">🔊 Read this page</button>${p.concepts?.length?`<button class="btn primary" onclick='practiceTopics(${JSON.stringify(p.concepts)})'>Practice this concept</button>`:''}</footer></article><button class="v3311Arrow" ${i===ps.length-1?'disabled':''} onclick="MajickGrimoire.setPage(${i+1})">›</button></div><nav class="v3311Chapters">${ps.map((x,j)=>`<button class="${j===i?'active':''}" onclick="MajickGrimoire.setPage(${j})">${E(x.title)}</button>`).join('')}</nav></section>`}
window.MajickGrimoire=Object.freeze({state,courseView,pages,render:book,setPage,setSearch,toggleBookmark,toggleRemember,saveNote,speak,speakCurrent,miniQuiz});
window.livingGrimoireHTML=book;
window.v3311Mini=miniQuiz;
window.v3311SetPage=setPage;
window.v3311Speak=speak;
window.v3311SetSearch=setSearch;
window.v3311ToggleBookmark=toggleBookmark;
window.v3311ToggleRemember=toggleRemember;
window.v3311SaveNote=saveNote;
})();
