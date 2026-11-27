(()=>{
'use strict';
if(window.MajickMilestoneParticles)return;
const TYPES=Object.freeze({guardian:{count:18,duration:1500},hatch:{count:38,duration:1600},academic:{count:26,duration:1350}});
let last=0;
function play(type,anchor){
 const spec=TYPES[type];
 if(!spec||!anchor?.isConnected||(document.documentElement.dataset.majickReduceMotion==='true'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches))return false;
 const now=Date.now();if(now-last<450)return false;last=now;
 const rect=anchor.getBoundingClientRect(),cx=Math.min(innerWidth-30,Math.max(30,rect.left+rect.width/2)),cy=Math.min(innerHeight-30,Math.max(30,rect.top+rect.height/2));
 const host=document.createElement('div');host.className='majMilestoneParticles';
 if(type==='hatch'||type==='guardian')host.classList.add('majMilestoneParticles--golden');host.setAttribute('aria-hidden','true');
 host.style.setProperty('--burst-x',cx+'px');host.style.setProperty('--burst-y',cy+'px');
 const count=Math.min(spec.count,innerWidth<600?18:40);
 for(let i=0;i<count;i++){
  const p=document.createElement('span');p.textContent=i%5===0?'✧':'✦';
  const a=(i/count)*Math.PI*2,dist=(type==='hatch'?130:90)*(0.6+Math.random()*.8);
  p.style.setProperty('--dx',Math.round(Math.cos(a)*dist)+'px');p.style.setProperty('--dy',Math.round(Math.sin(a)*dist+75)+'px');
  p.style.setProperty('--dur',spec.duration+'ms');p.style.setProperty('--delay',Math.floor(Math.random()*170)+'ms');host.append(p);
 }
 if(type==='hatch'||type==='guardian'){
  const halo=document.createElement('div');
  halo.className='majMilestoneGoldenHalo';
  for(let i=0;i<7;i++){
   const ray=document.createElement('i');
   ray.style.setProperty('--ray-x',(i-3)*12+'px');
   ray.style.setProperty('--ray-delay',(i%4)*85+'ms');
   halo.append(ray);
  }
  host.append(halo);
  const mistCount=innerWidth<600?5:9;
  for(let i=0;i<mistCount;i++){
   const puff=document.createElement('i');puff.className='majMilestoneMist';
   const a=i/mistCount*Math.PI*2,spread=18+Math.random()*35;
   puff.style.setProperty('--mx',Math.round(Math.cos(a)*spread)+'px');
   puff.style.setProperty('--my',Math.round(Math.sin(a)*spread)+'px');
   puff.style.setProperty('--mist-delay',Math.round(Math.random()*130)+'ms');
   host.append(puff);
  }
 }
 if(type==='academic'||type==='guardian'){
  const shine=document.createElement('b');shine.className='majMilestoneShine';
  host.append(shine);
 }
 document.body.append(host);window.setTimeout(()=>host.remove(),spec.duration+300);return true;
}
const style=document.createElement('style');style.textContent=`
.majMilestoneParticles{position:fixed;inset:0;z-index:1900;pointer-events:none;overflow:hidden}
/* A single golden ascent around the app's existing egg or Guardian art. */
.majMilestoneParticles--golden{z-index:100010}
.majMilestoneGoldenHalo{position:absolute;left:var(--burst-x);top:var(--burst-y);width:clamp(86px,23vw,155px);height:clamp(118px,32vw,205px);transform:translate(-50%,-60%);mix-blend-mode:screen}
.majMilestoneGoldenHalo::before,.majMilestoneGoldenHalo::after{content:"";position:absolute;display:block}
.majMilestoneGoldenHalo::before{inset:0 14% 12%;border-radius:50%;background:radial-gradient(ellipse,#ffecc590,#f3b63b5c 24%,#b6571628 54%,transparent 72%);transform-origin:50% 86%;animation:majGoldenPillar 1420ms ease-out both}
.majMilestoneGoldenHalo::after{left:14%;right:14%;bottom:10%;height:19%;border:2px solid #ffe9ad;border-radius:50%;box-shadow:0 0 18px #ffcc6c,inset 0 0 12px #e9a737;animation:majGoldenRing 1450ms ease-out both}
.majMilestoneGoldenHalo i{position:absolute;left:50%;bottom:16%;width:2px;height:22px;border-radius:60%;background:#ffeabe;box-shadow:0 0 8px #ffbd4b;animation:majGoldenRay 940ms ease-out var(--ray-delay) both}
@keyframes majGoldenPillar{0%{opacity:0;transform:scale(.25,.22)}30%{opacity:.92;transform:scale(.95,1.1)}100%{opacity:0;transform:scale(.72,1.24)}}
@keyframes majGoldenRing{0%{opacity:0;transform:scale(.36)}22%{opacity:.9}100%{opacity:0;transform:scale(1.46)}}
@keyframes majGoldenRay{0%{opacity:0;transform:translate(var(--ray-x),0) scaleY(.45)}27%{opacity:.9}100%{opacity:0;transform:translate(var(--ray-x),-105px) scaleY(.6)}}
.majMilestoneParticles span{mix-blend-mode:screen;position:absolute;left:var(--burst-x);top:var(--burst-y);color:#f7d58e;text-shadow:0 0 12px #b77cff;font-size:clamp(13px,2vw,24px);animation:majMilestoneFly var(--dur) ease-out var(--delay) both}
.majMilestoneParticles .majMilestoneMist{display:block;position:absolute;left:var(--burst-x);top:var(--burst-y);width:38px;height:38px;border-radius:50%;background:radial-gradient(circle,rgba(215,189,255,.45),rgba(158,132,214,.17) 45%,transparent 73%);filter:blur(5px);mix-blend-mode:screen;animation:majMilestoneMistRise 1150ms ease-out var(--mist-delay) both}
@keyframes majMilestoneMistRise{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}20%{opacity:.8}100%{opacity:0;transform:translate(calc(-50% + var(--mx)),calc(-95% + var(--my))) scale(2.4)}}
.majMilestoneParticles .majMilestoneShine{position:absolute;left:var(--burst-x);top:var(--burst-y);width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,rgba(255,244,199,.65),rgba(210,175,255,.18) 45%,transparent 75%);animation:majMilestoneShine 650ms ease-out both}
@keyframes majMilestoneShine{from{opacity:0;transform:translate(-50%,-50%) scale(.3)}35%{opacity:.9}to{opacity:0;transform:translate(-50%,-50%) scale(1.8)}}
@keyframes majMilestoneFly{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.8)}}
@media(prefers-reduced-motion:reduce){.majMilestoneParticles{display:none}}
`;document.head.append(style);
window.MajickMilestoneParticles=Object.freeze({play,types:Object.keys(TYPES)});
// Existing academic celebration dispatcher owns the proof of completion; effects remain presentation-only.
document.addEventListener('majick:celebrate',event=>{
 const detail=event.detail||{};
 if((detail.type!=='mastery'&&detail.type!=='course')||detail.verified!==true)return;
 const target=detail.target?.isConnected?detail.target:document.querySelector('.majickFxLayer,main');
 play('academic',target);
});
window.addEventListener('majick-milestone-celebration',ev=>{const d=ev.detail||{};if(!TYPES[d.type]||d.verified!==true)return;play(d.type,d.anchor||document.querySelector('#majEvolutionCelebration,.majEvoCard,.sanctuary-dorm,.v3341GuardianHeroPortrait,main'))});
})();