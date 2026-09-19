(function(){
 const V3310='V3.3.10 Phaser Motion Restore';
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
 const prevRender=render;
 render=function(){
   prevRender();
   const pill=document.querySelector('.top .pill'); if(pill)pill.textContent='Living Familiars • V3.3.10 Motion Restore';
   document.title='Majick Studies — Dark Collegium Motion Restore';
   setTimeout(()=>{try{if(typeof v523MountGuardian==='function')v523MountGuardian();if(typeof v523EnhanceCompanions==='function')v523EnhanceCompanions()}catch(e){console.warn('V3.3.10 canon mount',e)}},0);
 };
 try{
   if(typeof V336_PROJECT_PROGRESS==='object'){
     V336_PROJECT_PROGRESS.overall=84;V336_PROJECT_PROGRESS.usableStudy=93;
     const a=V336_PROJECT_PROGRESS.areas||[];
     const s=a.find(x=>x[0]==='Magical college sanctuary');if(s){s[1]=89;s[2]='Original Phase 4 sprite art is preserved exactly; a movement director, visible startup patrols, depth correction, local assets and a richer Dark Collegium room are deployed.'}
     const g=a.find(x=>x[0]==='Guardian identity system');if(g){g[1]=97;g[2]='Approved canon portraits now replace legacy emoji/simple-art guardian displays outside Phaser; original movement sprites remain untouched inside Phaser.'}
     V336_PROJECT_PROGRESS.next=['Verify all four original movers visibly patrol in the live sanctuary','Continue replacing flat sanctuary props with richer collectible art','Create exact-design movement sets for the six newer guardians without altering the original four'];
   }
 }catch(_){ }
 try{save();render()}catch(e){console.error('V3.3.10 boot',e)}
})();