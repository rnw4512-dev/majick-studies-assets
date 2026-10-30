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
let layer=null,active=null,clock=null;let last={type:null,at:0};const reduced=()=>document.documentElement?.dataset?.majickReduceMotion==='true'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
function clear(){if(clock!==null)clearTimeout(clock);clock=null;active?.remove();active=null}
function host(){if(!document.body)return null;if(layer?.isConnected)return layer;layer=document.createElement('div');layer.className='majickFxLayer';layer.setAttribute('aria-hidden','true');document.body.append(layer);return layer}
function play(type,{target=null,label=null}={}){
 const cfg=TYPES[type];if(!cfg)return false;
 const now=Date.now();if(last.type===type&&now-last.at<700)return false;last={type,at:now};
 const container=host();if(!container)return false;clear();
 const visual=document.createElement('div');visual.className='majickFx';
 const img=document.createElement('img');img.src='./assets/effects/'+cfg[0];img.alt='';img.decoding='async';visual.append(img);
 const text=document.createElement('span');text.className='majickFxLabel';text.textContent=label==null?cfg[3]:String(label).slice(0,48);if(type!=='touch')visual.append(text);
 const bounds=target?.isConnected?target.getBoundingClientRect():null;
 if(bounds){visual.style.setProperty('--fx-x',(bounds.left+bounds.width/2)+'px');visual.style.setProperty('--fx-y',(bounds.top+bounds.height/2)+'px')}
 visual.dataset.fxType=type;
 if(!reduced()){
  const count=type==='touch'?3:type==='course'?22:type==='lesson'?13:type==='guardian'?9:5;
  for(let i=0;i<count;i++){
   const star=document.createElement('i');star.className='majickFxParticle';
   star.style.setProperty('--angle',(i*360/count)+'deg');
   star.style.setProperty('--dist',(type==='touch'?18:type==='course'?100:70)+(i%3)*8+'px');
   star.style.setProperty('--delay',(i%4)*45+'ms');
   visual.append(star);
  }
 }
 visual.style.setProperty('--fx-size',cfg[1]+'px');visual.style.setProperty('--fx-duration',cfg[2]+'ms');
 container.append(visual);active=visual;
 clock=setTimeout(clear,reduced()?450:cfg[2]+100);
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
window.MajickAnimationEffects=Object.freeze({play,clear,types:Object.keys(TYPES),version:'1.0'});
})();