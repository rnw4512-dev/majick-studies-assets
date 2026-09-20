(function(){
'use strict';
const ST=['New Bond','Apprentice','Guardian','Ascendant','Celestial'];
const SL=['new-bond','apprentice','guardian','ascendant','celestial'];
const TYPE={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia',vesper:'vesper',briar:'briar',zephyr:'zephyr',prism:'prism',rook:'rook',solara:'solara'};
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'')}};
const C=t=>{try{return v338Canon(t)}catch(_){return (window.V338_CANON||{})[t]||null}};
const LV=p=>{try{return masPetLevel(p)}catch(_){return Math.max(1,Number(p?.level||1)||1)}};
const SI=p=>{const l=LV(p);return l>=12?4:l>=8?3:l>=5?2:l>=3?1:0};
const IMG=(t,i)=>`assets/familiars/evolution_stages/${TYPE[t]||t}-${SL[i]}.webp?v=3313`;
window.v3313CurrentImage=p=>IMG(p?.type||'luna',SI(p));

/* Force fresh evolution files so older browser image cache cannot keep stale crops/text. */
const oldPortrait=window.v334Portrait;
window.v334Portrait=function(p,variant='card'){
  if(!p||!C(p.type))return oldPortrait?oldPortrait(p,variant):'';
  const c=C(p.type),i=SI(p),src=IMG(p.type,i),priority=(variant==='sidebar'||variant==='study')?'eager':'lazy';
  return `<div class="familiarPortrait ${variant} v3313Portrait" data-pet-type="${E(p.type)}" data-stage="${SL[i]}" style="--pet-accent:${E(c.accent)}" title="${E(c.display)} • ${E(c.species)} • ${ST[i]}"><img src="${src}" data-fallback="${c.portrait}?v=3313" loading="${priority}" decoding="async" ${priority==='eager'?'fetchpriority="high"':''} onerror="this.onerror=null;this.src=this.dataset.fallback" alt="${E(c.display)}, ${ST[i]} ${E(c.species)}"><span class="v3313Stage">${ST[i]}</span></div>`;
};

/* Home no longer pretends the HTML portrait cards are the moving sanctuary.
   The real Phaser sanctuary lives on Companions and keeps the big sprite download off Home. */
window.lfUpgradeHomeHabitat=function(){
  if(S.screen!=='home')return;
  const old=document.querySelector('.masHabitat');if(!old)return;
  const p=activePet(),c=C(p.type),i=SI(p);
  const portal=document.createElement('section');
  portal.className='v3313Portal';
  portal.innerHTML=`<div class="v3313PortalArt"><div class="v3313PortalCopy"><span class="eyebrow">DARK COLLEGIUM • PHASER 4</span><h3>The Living Sanctuary</h3><p>This is the doorway to the actual moving-familiar sanctuary — not a fake portrait animation.</p><div class="v3313PortalActions"><button class="btn primary" onclick="navigate('companions')">✦ Enter Living Sanctuary</button><button class="btn ghost" onclick="navigate('livinggrimoire')">Open Living Grimoire</button></div></div><div class="v3313PortalGuardian"><img src="${IMG(p.type,i)}" data-fallback="${c?.portrait||''}" onerror="this.onerror=null;this.src=this.dataset.fallback" alt="${E(c?.display||p.name)}"><b>${E(c?.display||p.name)} • ${ST[i]}</b><small>The moving sprite remains your original protected Phase 4 art inside Phaser.</small></div></div>`;
  old.replaceWith(portal);
};

/* Restore the real sanctuary directly on the Companions screen.
   Home stays lightweight; Companions boots Phaser immediately. */
window.phase4SanctuaryHTML=function(){
  if(location.protocol==='file:')return `<section class="phase4Wrap"><div class="phase4Top"><div><b>✦ Phase 4 Living Sanctuary</b><br><span>Open Majick Studies through GitHub Pages or the launcher so Phaser can load.</span></div></div></section>`;
  return `<section class="phase4Wrap v3313Phase" aria-label="Phase 4 Living Sanctuary"><div class="phase4Top"><div><b>✦ Phase 4 Living Sanctuary</b><br><span>The original Velora, Cascade, Solstice, and Aurelia Phaser movement system is running here unchanged.</span></div><div class="phase4Actions"><button class="btn ghost" onclick="phase4OpenFullscreen()">Full Sanctuary</button><button class="btn primary" onclick="navigate('mission')">Continue Studying</button></div></div><iframe id="phase4SanctuaryFrame" class="phase4Frame" src="sanctuary/index.html?v=3313" title="Majick Studies Living Sanctuary" loading="eager" allow="fullscreen"></iframe><div class="phase4Help">Click the familiars for profiles • Arcane Stacks → Living Grimoire • desk → study • telescope → review • beds → rest • apothecary → focus • Magic Mirror → real progress.</div></section>`;
};

const oldFull=window.phase4OpenFullscreen;
window.phase4OpenFullscreen=function(){
  const f=document.getElementById('phase4SanctuaryFrame');
  if(f?.requestFullscreen)f.requestFullscreen().catch(()=>{});
  else if(oldFull)oldFull();
};

/* Keep evolution gallery current pictures cache-busted too. */
window.v3312StageImage=(t,i)=>IMG(t,i);
window.v3312CurrentGuardianImage=p=>IMG(p?.type||'luna',SI(p));

const oldRender=window.render;
window.render=function(){
  oldRender();
  const pill=document.querySelector('.top .pill');if(pill)pill.textContent='Living Familiars • V3.3.13 Sanctuary Restore';
  document.title='Majick Studies — Sanctuary Restore';
};
try{render()}catch(e){console.error('V3.3.13 main',e)}
})();