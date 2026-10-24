(()=>{
'use strict';
if(window.MajickMilestoneParticles)return;
const TYPES=Object.freeze({guardian:{count:18,duration:1000},hatch:{count:38,duration:1600},academic:{count:26,duration:1350}});
let last=0;
function play(type,anchor){
 const spec=TYPES[type];
 if(!spec||!anchor?.isConnected||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return false;
 const now=Date.now();if(now-last<450)return false;last=now;
 const rect=anchor.getBoundingClientRect(),cx=Math.min(innerWidth-30,Math.max(30,rect.left+rect.width/2)),cy=Math.min(innerHeight-30,Math.max(30,rect.top+rect.height/2));
 const host=document.createElement('div');host.className='majMilestoneParticles';host.setAttribute('aria-hidden','true');
 host.style.setProperty('--burst-x',cx+'px');host.style.setProperty('--burst-y',cy+'px');
 const count=Math.min(spec.count,innerWidth<600?18:40);
 for(let i=0;i<count;i++){
  const p=document.createElement('span');p.textContent=i%5===0?'✧':'✦';
  const a=(i/count)*Math.PI*2,dist=(type==='hatch'?130:90)*(0.6+Math.random()*.8);
  p.style.setProperty('--dx',Math.round(Math.cos(a)*dist)+'px');p.style.setProperty('--dy',Math.round(Math.sin(a)*dist+75)+'px');
  p.style.setProperty('--dur',spec.duration+'ms');p.style.setProperty('--delay',Math.floor(Math.random()*170)+'ms');host.append(p);
 }
 document.body.append(host);window.setTimeout(()=>host.remove(),spec.duration+300);return true;
}
const style=document.createElement('style');style.textContent=`
.majMilestoneParticles{position:fixed;inset:0;z-index:1900;pointer-events:none;overflow:hidden}
.majMilestoneParticles span{position:absolute;left:var(--burst-x);top:var(--burst-y);color:#f7d58e;text-shadow:0 0 12px #b77cff;font-size:clamp(13px,2vw,24px);animation:majMilestoneFly var(--dur) ease-out var(--delay) both}
@keyframes majMilestoneFly{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.8)}}
@media(prefers-reduced-motion:reduce){.majMilestoneParticles{display:none}}
`;document.head.append(style);
window.MajickMilestoneParticles=Object.freeze({play,types:Object.keys(TYPES)});
// Existing academic celebration dispatcher owns the proof of completion; effects remain presentation-only.
document.addEventListener('majick:celebrate',event=>{
 const detail=event.detail||{};
 if(detail.type!=='mastery'&&detail.type!=='course')return;
 const target=detail.target?.isConnected?detail.target:document.querySelector('.majickFxLayer,main');
 play('academic',target);
});
window.addEventListener('majick-milestone-celebration',ev=>{const d=ev.detail||{};if(!TYPES[d.type]||d.verified!==true)return;play(d.type,d.anchor||document.querySelector('#majEvolutionCelebration,.majEvoCard,.sanctuary-dorm,.v3341GuardianHeroPortrait,main'))});
})();