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

async function retireOldMajickCaches(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(regs.map(r=>r.unregister()));
    }
  }catch(e){console.warn('V3.3.17 service-worker cleanup',e)}
  try{
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.allSettled(keys.filter(k=>String(k).startsWith('majick-studies-')).map(k=>caches.delete(k)));
    }
  }catch(e){console.warn('V3.3.17 cache cleanup',e)}
}
window.v3317RetireOldMajickCaches=retireOldMajickCaches;

function showRuntimeNotice(error){
  const message=String(error?.message||error||'Unknown runtime error');
  console.error('Majick V3.3.17 runtime error',error);
  if(document.getElementById('v3317RuntimeNotice'))return;
  try{
    const n=document.createElement('div');
    n.id='v3317RuntimeNotice';
    n.className='v5Safe card';
    n.style.cssText='position:fixed;z-index:120;left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,90vw);box-shadow:0 30px 80px #33224b55';
    const safe=typeof esc==='function'?esc(message):message.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
    n.innerHTML='<h2>🌙 A study screen hit a snag</h2><p>Your progress is still stored.</p><p class="tiny">Runtime error: '+safe+'</p><button class="btn violet" id="v3317Reload">Reload screen</button> <button class="btn ghost" id="v3317Guide">Safe Study Guide</button>';
    document.body.appendChild(n);
    n.querySelector('#v3317Reload')?.addEventListener('click',()=>{n.remove();try{render()}catch(e){console.error(e)}});
    n.querySelector('#v3317Guide')?.addEventListener('click',()=>{n.remove();try{window.session=null;S.screen='guide';save();render()}catch(e){console.error(e)}});
  }catch(e){console.error('Could not show V3.3.17 runtime notice',e)}
}

window.addEventListener('error',ev=>{
  // Resource/image failures are not app crashes.
  if(!ev.error){
    console.warn('Majick resource warning',ev.target?.src||ev.target?.href||ev.message||'unknown resource');
    return;
  }
  showRuntimeNotice(ev.error);
});
window.addEventListener('unhandledrejection',ev=>{
  console.warn('Majick promise warning',ev.reason);
});

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

retireOldMajickCaches();
applyReleaseBadge();
setTimeout(applyReleaseBadge,0);
setTimeout(applyReleaseBadge,300);
})();