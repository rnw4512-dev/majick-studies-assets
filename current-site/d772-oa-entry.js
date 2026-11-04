(()=>{'use strict';
const add=()=>{const nav=document.querySelector('.side .nav')||document.querySelector('nav');if(!nav||nav.querySelector('[data-d772-oa-focus]'))return;const a=document.createElement('a');a.dataset.d772OaFocus='true';a.href='./d772-oa-focus.html';a.textContent='🧮 D772 OA Focus • CATIGA CS-229';a.setAttribute('aria-label','D772 OA Focus guided practice with CATIGA CS-229 calculator instructions');a.style.cssText='display:block;border:1px solid #ab94ce;background:#f4eaff;color:#352253;text-decoration:none;text-align:left;padding:12px 14px;border-radius:15px;font-weight:800;line-height:1.4;';nav.appendChild(a);};
add();let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;add()})});
observer.observe(document.body,{subtree:true,childList:true});
})();