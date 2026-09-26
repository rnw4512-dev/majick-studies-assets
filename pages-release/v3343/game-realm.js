/* Game Realm readability and question variety. Runs after the legacy game definitions. */
(()=>{
  'use strict';
  const normalize=v=>String(v||'').trim().toLocaleLowerCase();
  const originalPick=pickAdaptive;
  pickAdaptive=function(pool=questionPool()){
    if(!Array.isArray(pool)||!pool.length)return originalPick(pool);
    const played=new Set((session?.questions||[]).map(q=>typeof q==='string'?q:q?.id));
    const fresh=pool.filter(q=>!played.has(q.id));
    if(fresh.length)pool=fresh;
    const recent=new Set((prog().answers||[]).slice(-20).map(a=>a.qid));
    const lessRecent=pool.filter(q=>!recent.has(q.id));
    return originalPick(lessRecent.length?lessRecent:pool);
  };

  const originalMoonwordPick=moonwordPick;
  moonwordPick=function(i,value){
    if(!session||session.type!=='moonword'||!session.items?.[i])return;
    return originalMoonwordPick(i,value);
  };
  moonwordHTML=function(){
    if(session?.finished)return resultHTML();
    const items=session?.items||[];
    const words=[...new Map(items.map(x=>[normalize(x.term),x.term])).values()];
    const required=new Map(),used=new Map();
    items.forEach(x=>{
      const key=normalize(x.term);required.set(key,(required.get(key)||0)+1);
      if(x.ok&&normalize(x.choice)===key)used.set(key,(used.get(key)||0)+1);
    });
    const bank=words.map(w=>{
      const key=normalize(w),done=used.get(key)||0,total=required.get(key)||1;
      return `<li class="realmWord ${done>=total?'used':''}"><span>${esc(w)}</span><small>${done>=total?'Used':total>1?`${done}/${total} used`:'Available'}</small></li>`;
    }).join('');
    const clues=items.map((x,i)=>{
      const options=words.map(w=>`<option value="${esc(w)}" ${x.choice===w?'selected':''}>${esc(w)}</option>`).join('');
      return `<div class="realmClue"><label for="realmClue${i}"><b>${i+1}. ${esc(x.def)}</b></label><select id="realmClue${i}" onchange="moonwordPick(${i},this.value)"><option value="">Choose a word...</option>${options}</select>${x.choice?`<div class="${x.ok?'strong':'weak'}">${x.ok?'✓ Correct':'Try again'}</div>`:''}</div>`;
    }).join('');
    return `<div class="qwrap realmMoonword"><div class="qtop"><span class="qbadge">🧩 Moon Crystal Words</span><b>${items.filter(x=>x.ok).length}/${items.length}</b></div><div class="card"><p>Match each clue. A word is crossed off when all its clues are correct.</p><h3>Word bank</h3><ul class="realmWordBank" aria-label="Available crossword words">${bank}</ul>${clues}<button class="btn violet" style="margin-top:12px" onclick="finishMoonword()">Finish</button></div></div>`;
  };
  document.documentElement.dataset.majickRealmVariety='3343';
})();
