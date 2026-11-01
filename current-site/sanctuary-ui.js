/* Sanctuary DOM presentation; account state and canvas renderers remain separate. */
(()=>{'use strict';if(window.MajickSanctuaryUI)return;
const REALM_ART={moonPalace:'assets/academy_hero.jpg',pearlCloud:'assets/majick_cosmos.jpg',celestialLibrary:'assets/room_library.jpg',roseNebula:'assets/majick_garden.jpg',starlightRooftop:'assets/majick_cosmos.jpg',dreamTemple:'assets/room_conservatory.jpg',midnightObservatory:'assets/room_observatory.jpg'};
const esc12=s=>esc(String(s??''));const canonForPet=p=>window.MajickGuardianPresentation.canon(p?.type||'luna');
 // Non-Phaser mini habitat also uses approved portraits; the actual Phase 4 movers remain untouched.
 if(typeof v523HabitatHTML==='function'){
   v523HabitatHTML=function(){
     const L=S.legacy||{},pets=L.pets||[],items=L.roomItems||[];
     const pp=pets.map((p,i)=>{const c=canonForPet(p),cls=['runner','hopper','waver'][i%3],x=6+(i%5)*16,y=28+(i%2)*42,delay=-(i*1.1),dur=(5.8+(i%3)*1.3).toFixed(1),travel=(42+(i%3)*18)+'px';return `<span class="v3310HabPet ${cls}" style="--x:${x}%;--y:${y}px;--delay:${delay}s;--dur:${dur}s;--travel:${travel}" title="${esc(c?.display||p.name)}"><img src="${c?.icon||c?.portrait||''}" alt="${esc(c?.display||p.name)}"><span class="name">${esc(c?.display||p.name)}</span></span>`}).join('');
     const ii=items.map((x,i)=>`<span class="v523RoomItem" style="left:${10+(i%8)*11}%;">${x}</span>`).join('');
     return pp+ii;
   };
 }
window.realmGalleryHTML=function(){const L=S.legacy||{};return `<div class="sectionTitle"><div><h2>Magical Study Realms</h2><p>Study spaces now use actual Majick art instead of blank placeholder swatches.</p></div></div><div class="v3312RealmGallery">${Object.entries(V4_REALMS).map(([id,r])=>{const owned=(L.realms||[]).includes(id),active=L.activeRealm===id,art=REALM_ART[id]||'assets/academy_hero.jpg';return `<article class="v3312RealmCard ${owned?'':'locked'} ${active?'active':''}" onclick="realmAction('${id}')"><div class="v3312RealmPreview" style="background-image:linear-gradient(180deg,transparent 30%,rgba(10,4,15,.88)),url('${art}')"><span>${r.icon}</span><em>${!owned?'◆ '+r.cost:active?'ACTIVE':'OWNED'}</em></div><div class="v3312RealmCopy"><h3>${esc12(r.name)}</h3><p>${esc12(r.desc)}</p></div></article>`}).join('')}</div>`};
 lfObjectHTML=function(){
  return `${lfWeatherHTML()}<div class="v339RoomLegend">Dark Collegium • Living Sanctuary</div><div class="v339StoneArch a"></div><div class="v339StoneArch b"></div><div class="v339StoneArch c"></div>
  <div class="v339Shelf" title="Arcane Stacks" onclick="lfObjectInteract('books')"></div>
  <div class="v339Desk" title="Moonlit Study Desk" onclick="lfObjectInteract('page')"></div>
  <div class="v339Telescope" title="Celestial Observatory" onclick="lfObjectInteract('window')"></div>
  <div class="v339CrystalPedestal" title="Crystal Focus Pedestal" onclick="lfObjectInteract('crystal')"></div>
  <div class="v339Apothecary" title="Study Apothecary" onclick="lfObjectInteract('crystal')"></div>
  <div class="v339Settee" title="Familiar Lounge" onclick="lfObjectInteract('bed')"></div>
  <div class="v339CrystalBed left" title="Amethyst Crystal Bed" onclick="lfObjectInteract('bed')"></div>
  <div class="v339CrystalBed right" title="Moonstone Crystal Bed" onclick="lfObjectInteract('bed')"></div>`;
 };

window.MajickSanctuaryUI=Object.freeze({habitatHTML:window.v523HabitatHTML,realmGalleryHTML:window.realmGalleryHTML,objectHTML:window.lfObjectHTML});
})();
