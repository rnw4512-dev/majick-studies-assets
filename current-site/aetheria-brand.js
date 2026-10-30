/* Presentation-only Aetheria branding. Never writes application or learner state. */
(()=>{'use strict';if(window.AetheriaBrand)return;
const map=new Map([['Majick Studies','Aetheria'],['MAJICK STUDIES','AETHERIA'],['Moonlit Learning','Aetheria'],['Collegium Commons','Moonlit Collegium'],['Study Now','Scholar’s Study Hall'],['Reasoning Workshop','Scholar’s Trial Chamber'],['Game Realm','The Enchanted Arcade'],['Learn Lab','The Athenaeum'],['My Journal','The Scholar’s Chronicle']]);
const attr=['aria-label','title','alt','placeholder'];let busy=false;
function convert(s){let x=String(s||'').replace(/\s*\u2014\s*/g,' - ');for(const [a,b] of map)x=x.replaceAll(a,b);return x}
function apply(){if(busy)return;busy=true;try{
 document.title='Aetheria | Moonlit Collegium';
 const root=document.querySelector('#app')||document.body;
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;return p&&!p.closest('script,style,textarea,code,pre,[contenteditable=true]')&&n.nodeValue?.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
 const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);
 for(const n of nodes){const x=convert(n.nodeValue);if(x!==n.nodeValue)n.nodeValue=x}
 for(const el of root.querySelectorAll('[aria-label],[title],[alt],[placeholder]'))for(const a of attr){if(!el.hasAttribute(a))continue;const v=el.getAttribute(a),x=convert(v);if(x!==v)el.setAttribute(a,x)}
 const brand=root.querySelector('.brand .txt b');if(brand){if(brand.textContent!=='Aetheria')brand.textContent='Aetheria';const sub=root.querySelector('.brand .txt small');if(sub&&sub.textContent!=='Where Knowledge Awakens Magic')sub.textContent='Where Knowledge Awakens Magic'}
 const h=root.querySelector('header .brand, .topbar .brand');if(h&&h.getAttribute('aria-label')!=='Aetheria - Moonlit Collegium')h.setAttribute('aria-label','Aetheria - Moonlit Collegium');
 }finally{busy=false}}
let timer;function start(){apply();new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,90)}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:attr})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();window.AetheriaBrand={refresh:apply};
})();
