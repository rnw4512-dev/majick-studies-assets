(function(){
 function canonForPet(p){try{return v338Canon(p?.type||'luna')}catch(_){return null}}
 // Replace the older emoji guardian dock with the approved canon art.
 if(typeof v523GuardianDockHTML==='function'){
   v523GuardianDockHTML=function(){
     if(S.screen!=='mission'||!session||session.finished||!session.current||session.focus||session.finalTransformation)return '';
     const pet=activePet(),c=canonForPet(pet),d=petDef(pet),stage=petStage(pet),tip=petTip(session.current);
     const img=c?.icon||c?.portrait||'';
     return `<div class="v523GuardianDock v3310CanonDock" id="v523GuardianDock"><div class="v3310PortraitStage">${img?`<img class="v3310Portrait" src="${img}" alt="${esc(c?.display||pet.name)}">`:`<span>${d.emoji||'✦'}</span>`}</div><div class="v523GuardianCopy"><b>${esc(c?.display||pet.name)} • ${esc(stage)} ${esc(c?.species||d.species)}</b><p>${esc(tip)}</p><span class="v523GuardianTag">${esc(typeof v523GuardianTag==='function'?v523GuardianTag(session.current):'Guardian tip')}</span>${!session.answered?`<button class="v523GuardianAbility" onclick="usePetAbility()">✦ ${esc(d.abilityName)}</button>`:''}</div></div>`;
   };
 }
 // Non-Phaser mini habitat also uses approved portraits; the actual Phase 4 movers remain untouched.
 if(typeof v523HabitatHTML==='function'){
   v523HabitatHTML=function(){
     const L=S.legacy||{},pets=L.pets||[],items=L.roomItems||[];
     const pp=pets.map((p,i)=>{const c=canonForPet(p),cls=['runner','hopper','waver'][i%3],x=6+(i%5)*16,y=28+(i%2)*42,delay=-(i*1.1),dur=(5.8+(i%3)*1.3).toFixed(1),travel=(42+(i%3)*18)+'px';return `<span class="v3310HabPet ${cls}" style="--x:${x}%;--y:${y}px;--delay:${delay}s;--dur:${dur}s;--travel:${travel}" title="${esc(c?.display||p.name)}"><img src="${c?.icon||c?.portrait||''}" alt="${esc(c?.display||p.name)}"><span class="name">${esc(c?.display||p.name)}</span></span>`}).join('');
     const ii=items.map((x,i)=>`<span class="v523RoomItem" style="left:${10+(i%8)*11}%;">${x}</span>`).join('');
     return pp+ii;
   };
 }
 // Preserve only active Guardian dock and habitat compatibility adapters.
})();