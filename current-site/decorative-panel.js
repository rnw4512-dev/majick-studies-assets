/* Shared presentation-only decorative panels. No identity, progress, or economy writes. */
(()=>{'use strict';if(window.MajickDecorativePanel)return;
const kinds=new Set(['guardian','wardrobe','evolution','reward']);
const style=document.createElement('style');
style.textContent=`.majick-decorative-panel{position:relative;isolation:isolate;overflow:hidden;border:2px solid #cda96c;border-radius:20px;background:linear-gradient(145deg,#382640,#241b34 70%,#40304e);color:#fff4df;box-shadow:inset 0 0 0 3px #ffffff12,0 14px 34px #100a2255;padding:clamp(12px,2vw,22px)}.majick-decorative-panel:before{content:"";pointer-events:none;position:absolute;inset:6px;border:1px solid #e8d2a477;border-radius:14px}.majick-decorative-panel[data-panel-kind="wardrobe"]{background:linear-gradient(135deg,#fff4ed,#e9d9f5);color:#34223e;border-color:#ad8cba}.majick-decorative-panel[data-panel-kind="guardian"]{background:linear-gradient(140deg,#35274b,#263c4b)}.majick-decorative-panel[data-panel-kind="evolution"]{border-color:#e8c77b;box-shadow:0 0 28px #d6a75a44}.majick-decorative-panel[data-panel-kind="reward"]{border-color:#e4c98b}.majick-decorative-panel>*{position:relative;z-index:1}@media(prefers-reduced-motion:reduce){.majick-decorative-panel,.majick-decorative-panel *{animation:none!important;transition:none!important}}`;
document.head.append(style);
function create(kind='reward'){const el=document.createElement('section');el.className='majick-decorative-panel';el.dataset.panelKind=kinds.has(kind)?kind:'reward';return el}
window.MajickDecorativePanel=Object.freeze({create,types:[...kinds]});
})();
