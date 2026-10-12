(()=>{
'use strict';
if(window.MajickScholarCompanion)return;
const SCENES={home:['Collegium','idle','✦'],mission:['Study Now','studying','📖'],guide:['Study Guide','reading','📚'],lab:['Learn Lab','studying','📖'],learn:['Learn Lab','studying','📖'],journal:['Journal','writing','✒'],grimoire:['Grimoire','writing','✒'],sanctuary:['Sanctuary','guardian-bonding','♡'],games:['Game Realm','game-cheer','✦'],test:['OA Practice','thinking','✧'],analytics:['Progress','reading','✧'],vault:['Magic Vault','idle','✦']};
let dock=null,opened=false,poseUntil=0,specialPose='',current='';
const state=()=>window.MajickAtelier?.player?.()||window.S?.majickIdentity?.atelier||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function scene(){
 const s=String(window.S?.screen||'').toLowerCase(), heading=(document.querySelector('main h1, main h2, .main h1, .main h2')?.textContent||'').toLowerCase();
 if(s==='home'&&/sanctuary/.test(heading))return 'sanctuary';
 if(/sanctuary/.test(s))return 'sanctuary';
 if(/journal|grimoire/.test(s))return 'journal';
 if(/learn lab/.test(heading))return 'lab';
 return SCENES[s]?s:'home';
}
function art(p,pose=''){return window.MajickAtelier?.renderAvatar?.(p,true,pose)||''}
function ensure(){
 if(!document.body||dock)return;
 dock=document.createElement('aside');dock.id='majickScholarCompanion';dock.setAttribute('aria-label','Your scholar companion');
 dock.innerHTML='<button type="button" class="mscToggle" aria-expanded="false"><span class="mscSmall"></span><span class="mscLabel"></span><span aria-hidden="true">⌃</span></button><div class="mscPanel" hidden><div class="mscStage"><small>✦ THE MOONLIT COLLEGIUM ✦</small><div class="mscLarge"></div><div class="mscEffect"></div></div><div class="mscPanelInfo"><strong class="mscScene"></strong><p class="mscLine"></p><div class="mscButtons"><button type="button" data-scholar="atelier">Customize</button><button type="button" data-scholar="study">Study together</button></div></div></div>';
 document.body.append(dock);
 dock.querySelector('.mscToggle').addEventListener('click',()=>{opened=!opened;dock.querySelector('.mscPanel').hidden=!opened;dock.querySelector('.mscToggle').setAttribute('aria-expanded',String(opened));refresh(true)});
 dock.querySelector('[data-scholar="atelier"]').addEventListener('click',()=>window.MajickAtelier?.open?.());
 dock.querySelector('[data-scholar="study"]').addEventListener('click',()=>{if(typeof window.navigate==='function')window.navigate('mission');else document.querySelector('[data-nav="mission"]')?.click();react('studying')});
}
function refresh(force=false){
 ensure();if(!dock)return;
 const p=state(),s=scene(),info=SCENES[s]||SCENES.home,pose=Date.now()<poseUntil?specialPose:info[1];
 const key=[s,pose,p.name,p.skin,p.hair,p.robe,p.color,p.equipped,p.accessory,opened].join('|');
 if(!force&&key===current)return;current=key;
 dock.dataset.scene=s;dock.dataset.pose=pose;
 const markup=art(p);
 dock.querySelector('.mscSmall').innerHTML=markup;
 dock.querySelector('.mscLarge').innerHTML=art(p,pose);
 dock.querySelector('.mscLabel').innerHTML='<b>'+esc(p.name||'Scholar')+'</b><small>'+esc(info[0])+'</small>';
 dock.querySelector('.mscScene').textContent=info[0]+' · '+pose.replaceAll('-',' ');
 dock.querySelector('.mscEffect').textContent=pose==='celebrating'?'✦ ✨ ✦':info[2];
 dock.querySelector('.mscLine').textContent=s==='sanctuary'?'Together with your Guardians in the Sanctuary.':pose==='celebrating'?'Excellent work! Your scholar celebrates with you.':pose==='thinking'?'Working through the question with you.':s==='journal'?'Keeping notes beside you.':s==='games'?'Ready for the next challenge.':'Your scholar is here while you learn.';
}
function react(pose){specialPose=pose;poseUntil=Date.now()+3200;refresh(true)}
const style=document.createElement('style');
style.textContent=`
#majickScholarCompanion{position:fixed;bottom:12px;left:12px;z-index:935;color:#f4dfc2;font-family:Georgia,serif;pointer-events:none}
#majickScholarCompanion *{box-sizing:border-box}
#majickScholarCompanion button{cursor:pointer}
.mscToggle{pointer-events:auto;display:flex;align-items:center;gap:10px;max-width:225px;background:linear-gradient(120deg,#36223e,#1c1626);border:1px solid #c6a06b;border-radius:34px;padding:5px 12px 5px 5px;color:#fbe2ae;box-shadow:0 5px 25px #090611a8}
.mscSmall{width:38px;height:52px;border-radius:23px;overflow:hidden;background:radial-gradient(#6b4a68,#292132);position:relative}
.mscLabel{display:flex;flex-direction:column;text-align:left;gap:3px;min-width:85px}.mscLabel b{font-size:13px}.mscLabel small{font:10px system-ui;color:#dbc3d1}
.mscPanel{pointer-events:auto;position:absolute;bottom:68px;left:0;width:min(310px,calc(100vw - 24px));border:1px solid #c3a16d;border-radius:17px;overflow:hidden;background:#251b2d;box-shadow:0 16px 55px #080510b9}
.mscPanel[hidden]{display:none}
.mscStage{height:245px;background:radial-gradient(ellipse at 50% 32%,#74516c,#33283c 60%,#181423);position:relative;text-align:center;overflow:hidden}
.mscStage>small{position:absolute;top:12px;left:0;right:0;z-index:1;color:#e9c994;letter-spacing:.14em;font-size:9px}
.mscLarge{height:230px;width:174px;position:absolute;bottom:0;left:calc(50% - 87px)}
.mscLayers{position:relative;height:100%;aspect-ratio:1086/1448;margin:auto}
.mscLayers img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.mscSmall .mscLayers{height:52px}
.mscFallback{display:grid;place-items:center;height:100%;font-size:60px;color:#d6aa68}.mscSmall .mscFallback{font-size:30px}
.mscEffect{position:absolute;top:65px;right:22px;color:#f6d18e;font-size:24px;text-shadow:0 0 18px #db9d65;animation:mscDrift 3s ease-in-out infinite}
.mscPanelInfo{padding:14px 17px}.mscPanelInfo strong{color:#f3d099;font-size:17px}.mscPanelInfo p{font:12px/1.5 system-ui;color:#e8d5df}
.mscButtons{display:flex;gap:8px}.mscButtons button{flex:1;border:1px solid #b99a79;background:#53384e;border-radius:8px;color:#f7e4d4;padding:9px 7px;font-size:12px}
#majickScholarCompanion[data-pose="celebrating"] .mscLarge{animation:mscCheer .65s ease-in-out infinite alternate}
#majickScholarCompanion[data-pose="studying"] .mscEffect,#majickScholarCompanion[data-pose="writing"] .mscEffect{animation:mscDrift 2s ease-in-out infinite}
@keyframes mscDrift{50%{transform:translateY(-8px) rotate(7deg)}}@keyframes mscCheer{to{transform:translateY(-7px)}}
@media(max-width:550px){#majickScholarCompanion{left:6px;bottom:6px}.mscToggle{padding:3px 7px 3px 3px}.mscPanel{bottom:62px}}
@media(prefers-reduced-motion:reduce){#majickScholarCompanion *{animation:none!important}}
`;document.head.append(style);
function start(){
 ensure();refresh(true);
 document.addEventListener('click',e=>{
  const t=e.target;if(!(t instanceof Element))return;
  if(t.closest('[data-nav],.nav button'))queueMicrotask(()=>refresh(true));
  if(t.closest('[data-guardian],[data-pet],.guardianAction,.mcPetAction'))react('guardian-bonding');
  if(t.closest('[data-hint],[data-action="hint"],.hintBtn'))react('thinking');
  if(t.closest('[data-correct],.correctAnswer,.is-correct'))react('celebrating');
 },true);
 const root=document.getElementById('app');
 if(root)new MutationObserver(()=>{if(!document.getElementById('atelierOverlay')?.hidden)return;refresh()}).observe(root,{childList:true,subtree:false});
 document.addEventListener('majick-scholar-react',e=>react(e.detail?.pose||'celebrating'));
 window.addEventListener('majick-save-status',()=>refresh());
 setInterval(()=>refresh(),2500);
}
window.MajickScholarCompanion={refresh,react,version:'3.4.2-companion-2'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();