/* Read-only room identity bridge. No mutation of progress or navigation. */
(()=>{'use strict';
 const aliases={home:'home',commons:'home',mission:'mission',study:'mission',studynow:'mission',reasoning:'reasoning',workshop:'reasoning',trial:'reasoning',learninglab:'learninglab',learn:'learninglab',game:'game',gamerealm:'game',sanctuary:'sanctuary',atelier:'atelier',wardrobe:'atelier',potions:'potions',potion:'potions',store:'store',shop:'store',analytics:'analytics',journal:'analytics'};
 const apply=()=>{const el=document.getElementById('content');if(!el)return;const key=String(window.S?.screen||'').toLowerCase().replace(/[^a-z]/g,'');const next=aliases[key];if(next)el.dataset.majickRoom=next;else el.removeAttribute('data-majick-room')};
 const target=document.getElementById('app')||document.body;let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;apply()})}).observe(target,{childList:true,subtree:false});apply();
})();
