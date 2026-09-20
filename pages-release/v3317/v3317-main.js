(function(){
'use strict';

const RELEASE_LABEL='Living Familiars • V3.3.17 Guardian Repair';
const RELEASE_TITLE='Majick Studies — V3.3.17 Guardian Repair';

function applyReleaseBadge(){
  const pill=document.querySelector('.top .pill');
  if(pill && pill.textContent!==RELEASE_LABEL) pill.textContent=RELEASE_LABEL;
  document.title=RELEASE_TITLE;
  document.documentElement.dataset.majickVersion='3.3.17';
}

window.v3317ApplyReleaseBadge=applyReleaseBadge;

const previousRender=window.render;
if(typeof previousRender==='function'){
  window.render=function(){
    const result=previousRender.apply(this,arguments);
    applyReleaseBadge();
    requestAnimationFrame(applyReleaseBadge);
    setTimeout(applyReleaseBadge,60);
    setTimeout(applyReleaseBadge,250);
    return result;
  };
}

const observer=new MutationObserver(()=>applyReleaseBadge());
observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});

window.addEventListener('pageshow',applyReleaseBadge);
window.addEventListener('focus',applyReleaseBadge);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)applyReleaseBadge();});

applyReleaseBadge();
setTimeout(applyReleaseBadge,0);
setTimeout(applyReleaseBadge,300);
})();