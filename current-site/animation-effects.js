/* Visual-only owner: no learning, reward, guardian or save state mutations. */
(()=>{'use strict';if(window.MajickAnimationEffects)return;
const TYPES=Object.freeze({
 success:['celebrations/celebration-starburst.svg',145,750,'Correct'],
 mastery:['celebrations/celebration-constellation-ring.svg',230,1250,'Mastery earned'],
 lesson:['celebrations/celebration-constellation-ring.svg',285,1500,'Lesson complete'],
 course:['celebrations/celebration-constellation-ring.svg',340,1900,'Course complete'],
 guardian:['guardians/guardian-heart-sigil.svg',150,1000,'Bond strengthened'],
 reward:['celebrations/celebration-starburst.svg',215,1150,'Reward unlocked'],
 egg:['celebrations/celebration-constellation-ring.svg',200,1300,'Almost ready'],
 match:['celebrations/celebration-starburst.svg',125,650,'Match'],
 sanctuary:['celebrations/celebration-starburst.svg',170,850,'Placed']
});
let layer=null,active=null,clock=null;const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
function clear(){if(clock!==null)clearTimeout(clock);clock=null;active?.remove();active=null}
function host(){if(!document.body)return null;if(layer?.isConnected)return layer;layer=document.createElement('div');layer.className='majickFxLayer';layer.setAttribute('aria-hidden','true');document.body.append(layer);return layer}
function play(type,{target=null,label=null}={}){
 const cfg=TYPES[type];if(!cfg)return false;
 const container=host();if(!container)return false;clear();
 const visual=document.createElement('div');visual.className='majickFx';
 const img=document.createElement('img');img.src='./assets/effects/'+cfg[0];img.alt='';img.decoding='async';visual.append(img);
 const text=document.createElement('span');text.className='majickFxLabel';text.textContent=label==null?cfg[3]:String(label).slice(0,48);visual.append(text);
 const bounds=target?.isConnected?target.getBoundingClientRect():null;
 if(bounds){visual.style.setProperty('--fx-x',(bounds.left+bounds.width/2)+'px');visual.style.setProperty('--fx-y',(bounds.top+bounds.height/2)+'px')}
 visual.style.setProperty('--fx-size',cfg[1]+'px');visual.style.setProperty('--fx-duration',cfg[2]+'ms');
 container.append(visual);active=visual;
 clock=setTimeout(clear,reduced()?450:cfg[2]+100);
 return true
}
function onEvent(e){const type=e.detail?.type;if(Object.hasOwn(TYPES,type))play(type,{target:e.detail?.target,label:e.detail?.label})}
document.addEventListener('majick:celebrate',onEvent);
window.MajickAnimationEffects=Object.freeze({play,clear,types:Object.keys(TYPES),version:'1.0'});
})();