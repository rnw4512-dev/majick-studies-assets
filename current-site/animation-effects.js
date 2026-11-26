/* Visual-only owner: no learning, reward, guardian or save state mutations. */
(()=>{'use strict';if(window.MajickAnimationEffects)return;
const TYPES=Object.freeze({
 touch:['celebrations/celebration-starburst.svg',54,420,''],
 success:['celebrations/celebration-starburst.svg',145,750,'Correct'],
 mastery:['celebrations/celebration-constellation-ring.svg',230,1250,'Mastery earned'],
 lesson:['celebrations/lesson-complete-seal.svg',285,1500,'Lesson complete'],
 course:['celebrations/course-complete-sigil.svg',340,1900,'Course complete'],
 guardian:['guardians/guardian-heart-sigil.svg',150,1000,'Bond strengthened'],
 reward:['celebrations/celebration-starburst.svg',215,1150,'Reward unlocked'],
 egg:['celebrations/celebration-constellation-ring.svg',200,1300,'Almost ready'],
 match:['celebrations/celebration-starburst.svg',125,650,'Match'],
 sanctuary:['celebrations/celebration-starburst.svg',170,850,'Placed']
});
const LICENSED={success:'light',mastery:'arcane',lesson:'light',course:'arcane',guardian:'nature',reward:'projectile',match:'light',sanctuary:'nature'};
let layer=null,active=null,clock=null;let last={type:null,at:0};const reduced=()=>document.documentElement?.dataset?.majickReduceMotion==='true'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
function clear(){if(clock!==null)clearTimeout(clock);clock=null;active?.remove();active=null}
function host(){if(!document.body)return null;if(layer?.isConnected)return layer;layer=document.createElement('div');layer.className='majickFxLayer';layer.setAttribute('aria-hidden','true');document.body.append(layer);return layer}
function play(type,{target=null,label=null}={}){
 const cfg=TYPES[type];if(!cfg)return false;
 const now=Date.now();if(last.type===type&&now-last.at<700)return false;last={type,at:now};
 const container=host();if(!container)return false;clear();
 const visual=document.createElement('div');visual.className='majickFx';
 const img=document.createElement('img');img.src='./assets/effects/'+cfg[0];img.alt='';img.decoding='async';visual.append(img);
 let licensedArt=null;
 if(LICENSED[type]){const art=document.createElement('img');licensedArt=art;art.className='majickFxLicensed';art.alt='';art.decoding='async';art.src='./assets/licensed/effects/'+LICENSED[type]+(reduced()?'-poster':'')+'.webp?v='+encodeURIComponent(window.MAJICK_RELEASE||'source');visual.append(art);}
 const text=document.createElement('span');text.className='majickFxLabel';text.textContent=label==null?cfg[3]:String(label).slice(0,48);if(type!=='touch')visual.append(text);
 const bounds=target?.isConnected?target.getBoundingClientRect():null;
 if(bounds&&type==='touch')visual.style.setProperty('--fx-touch-size',Math.max(0,Math.min(36,bounds.width-8,bounds.height-8))+'px');
 if(bounds){visual.style.setProperty('--fx-x',(bounds.left+bounds.width/2)+'px');visual.style.setProperty('--fx-y',(bounds.top+bounds.height/2)+'px')}
 visual.dataset.fxType=type;
 if(!reduced()){
  const count=type==='touch'?3:type==='course'?22:type==='lesson'?13:type==='guardian'?9:5;
  for(let i=0;i<count;i++){
   const star=document.createElement('i');star.className='majickFxParticle';
   // Kenney Particle Pack, star_05, CC0; resized to 32px WebP.
   if(type!=='touch'){star.style.background='transparent url("data:image/webp;base64,UklGRtIBAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSCoBAAANuS5E9D80lCNJciRJi/nn9/D1TB0kwIoAk/iH2HskCej+R0zABHzK/+tnv4H8B8wy/wEe42/84lcQOzs42xLMXnBkdqKdEcHBfA/oqzEFa+kXxtXEFglQiMhLCgKzQAQuF81cpk5QIytXM+l8U1M1+NIuuMEcDvOTvX92ew7m4BvSAhPnY59Vagb5QJvszDyZOkeNxkwwZ9uxJ4PMa5m92UwgYhi4xdmWdloAediBBG4UlpenQ9CDIwMw95zxnNd8tOjwtsGO9ez5g+fsOc+81y5sy4wuVrM6Ju9q1HQW47myY+Y7JDMc3Trz8YKUqzbYkdhZn3puxwtlrABziLphuWIsOOniGNIVwCSLjDS56mxCIpTFjlfYBJw3QEiuy6NmvCl/q8k/LH8dVlA4IIIAAABQBQCdASogACAAPo08l0elI6IhMAwAoBGJaQAA8HT6rEWOW3xa5s6IOt+oqWbsrgpCEwAA/v72V/5AxJgBtVyB7+RKZzXhzx5v92Abs+aoeuiK77Zjt9FtAkjJssQblCZcaTOJ5K7YxkXTqymTkIygthtkT+ykslrSUfRZ+TstqAAA") center/contain no-repeat';star.style.width='18px';star.style.height='18px';star.style.borderRadius='0';star.style.filter='drop-shadow(0 0 3px #f2cf8e)';}
   star.style.setProperty('--angle',(i*360/count)+'deg');
   star.style.setProperty('--dist',(type==='touch'?18:type==='course'?100:70)+(i%3)*8+'px');
   star.style.setProperty('--delay',(i%4)*45+'ms');
   visual.append(star);
  }
 }
 visual.style.setProperty('--fx-size',cfg[1]+'px');visual.style.setProperty('--fx-duration',cfg[2]+'ms');
 container.append(visual);active=visual;
 const duration=reduced()?450:cfg[2]+100;
 function expire(){if(active!==visual)return;if(clock!==null)clearTimeout(clock);clock=setTimeout(clear,duration)}
 // Cold image decoding must not consume the short acknowledgment window.
 // A failed or stalled request still releases the single overlay within a bounded interval.
 if(licensedArt&&!licensedArt.complete){clock=setTimeout(clear,Math.max(2000,duration));licensedArt.onload=expire;licensedArt.onerror=expire}else expire();
 return true
}
function onEvent(e){const type=e.detail?.type;if(Object.hasOwn(TYPES,type))play(type,{target:e.detail?.target,label:e.detail?.label})}
document.addEventListener('majick:celebrate',onEvent);
// Small interaction spells share the existing bounded effect layer and cleanup.
// They carry no success claim and never interrupt a reward or mastery celebration.
function glimmer(event){
 if(active||reduced()||document.hidden)return;
 const target=event.target.closest?.('button,a[href],summary,[role="button"],input[type="radio"],input[type="checkbox"]');
 if(!target||target.disabled||target.getAttribute('aria-disabled')==='true'||target.closest('[inert]'))return;
 play('touch',{target});
}
document.addEventListener('pointerdown',glimmer,{passive:true});
document.addEventListener('focusin',glimmer);
window.MajickAnimationEffects=Object.freeze({play,clear,types:Object.keys(TYPES),version:'1.1-kenney-rewards'});
})();