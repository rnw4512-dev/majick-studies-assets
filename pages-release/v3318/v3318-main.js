(function(){
'use strict';

window.__majickV3318SanctuaryOwner=true;
const RELEASE_LABEL='Living Familiars • V3.3.18 Sanctuary Objects';

function sanctuaryMarkup(context){
  if(location.protocol==='file:'){
    return '<section class="phase4Wrap v3318Phase"><div class="phase4Top"><b>✦ Phaser 4 Living Sanctuary</b><br><span>Open Majick Studies through GitHub Pages so the Sanctuary can load.</span></div></section>';
  }
  const q='?v=3318&context='+encodeURIComponent(context||'app');
  return '<section class="phase4Wrap v3318Phase" aria-label="Phaser 4 Living Sanctuary">'+
    '<div class="phase4Top"><div><b>✦ Living Sanctuary • Phaser 4</b><br><span>Protected movement • evolved Guardians • interactive furniture</span></div>'+
    '<div class="phase4Actions"><button class="btn ghost" onclick="phase4OpenFullscreen()">Full Sanctuary</button><button class="btn primary" onclick="navigate(\'addmaterial\')">Add Study Material</button></div></div>'+
    '<iframe class="phase4Frame v3318SanctuaryFrame" src="sanctuary/index.html'+q+'" title="Majick Studies Living Sanctuary" loading="eager" allow="fullscreen"></iframe>'+
    '<div class="phase4Help">Click furniture to use it • Edit Sanctuary lets you drag and save objects • Guardian movement remains controlled by the protected Phase 4 system.</div>'+
  '</section>';
}

window.phase4SanctuaryHTML=function(){return sanctuaryMarkup('companions')};

function pushGuardianLevels(){
  try{window.v3314PushGuardianLevels?.()}catch(_){}
}

function ensureHomeSanctuary(){
  if(!window.S||S.screen!=='home')return;
  if(document.querySelector('.v3318HomeSanctuary')){pushGuardianLevels();return;}

  const target=document.querySelector(
    '.v3316HomeSanctuary,.v3314HomeSanctuary,.masHabitat,.majHabitat,.v3313Portal'
  );
  if(!target)return;

  const wrap=document.createElement('section');
  wrap.className='v3318HomeSanctuary';
  wrap.innerHTML=sanctuaryMarkup('home');
  target.replaceWith(wrap);
  setTimeout(pushGuardianLevels,140);
}
window.v3318EnsureHomeSanctuary=ensureHomeSanctuary;

window.phase4OpenFullscreen=function(){
  const f=document.querySelector('.v3318SanctuaryFrame,.v3314SanctuaryFrame,.phase4Frame');
  if(f?.requestFullscreen)f.requestFullscreen().catch(()=>{});
};

const previousRender=window.render;
window.render=function(){
  const result=previousRender.apply(this,arguments);
  if(window.S?.screen==='home')setTimeout(ensureHomeSanctuary,0);
  if(window.S?.screen==='companions')setTimeout(pushGuardianLevels,140);
  const pill=document.querySelector('.top .pill');
  if(pill)pill.textContent=RELEASE_LABEL;
  document.title='Majick Studies — V3.3.18 Living Sanctuary';
  return result;
};

const observer=new MutationObserver(()=>{
  if(window.S?.screen==='home')ensureHomeSanctuary();
});
observer.observe(document.documentElement,{childList:true,subtree:true});

try{render()}catch(e){console.error('V3.3.18 main',e)}
})();