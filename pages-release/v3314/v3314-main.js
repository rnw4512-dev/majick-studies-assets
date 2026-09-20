(function(){
'use strict';
function sanctuaryMarkup(context){
  if(location.protocol==='file:') return '<section class="phase4Wrap"><div class="phase4Top"><b>✦ Phaser 4 Living Sanctuary</b><br><span>Open the GitHub Pages app so Phaser assets can load.</span></div></section>';
  const q='?v=3314&context='+encodeURIComponent(context||'app');
  return '<section class="phase4Wrap v3314Phase" aria-label="Phaser 4 Living Sanctuary"><div class="phase4Top"><div><b>✦ Phaser 4 Living Sanctuary</b><br><span>Every Sanctuary view now uses the same protected Phaser 4 world.</span></div><div class="phase4Actions"><button class="btn ghost" onclick="phase4OpenFullscreen()">Full Sanctuary</button><button class="btn primary" onclick="navigate(\'mission\')">Continue Studying</button></div></div><iframe class="phase4Frame v3314SanctuaryFrame" src="sanctuary/index.html'+q+'" title="Majick Studies Living Sanctuary" loading="eager" allow="fullscreen"></iframe><div class="phase4Help">Same world • same protected Guardian movement • manifest-driven furniture and study objects.</div></section>';
}
window.phase4SanctuaryHTML=function(){return sanctuaryMarkup('companions')};
window.lfUpgradeHomeHabitat=function(){
  if(!window.S||S.screen!=='home') return;
  const target=document.querySelector('.masHabitat, .v3313Portal');
  if(!target) return;
  const wrap=document.createElement('div');
  wrap.className='v3314HomeSanctuary';
  wrap.innerHTML=sanctuaryMarkup('home');
  target.replaceWith(wrap);
};
window.phase4OpenFullscreen=function(){
  const f=document.querySelector('.v3314SanctuaryFrame');
  if(f?.requestFullscreen) f.requestFullscreen().catch(()=>{});
};
const oldRender=window.render;
window.render=function(){
  oldRender();
  try{ window.lfUpgradeHomeHabitat(); }catch(e){ console.error('home sanctuary',e); }
  const pill=document.querySelector('.top .pill'); if(pill) pill.textContent='Living Familiars • V3.3.14 One Sanctuary';
  document.title='Majick Studies — One Living Sanctuary';
};
const obs=new MutationObserver(()=>{try{
  if(window.S?.screen==='home' && document.querySelector('.masHabitat,.v3313Portal')) window.lfUpgradeHomeHabitat();
}catch(_){}});
obs.observe(document.documentElement,{childList:true,subtree:true});
try{render()}catch(e){console.error('V3.3.14 main',e)}
})();