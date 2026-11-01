/* Persistent study sound owner; no audio or preferences are reset on reload. */
(()=>{'use strict';if(window.MajickStudyAudio)return;
 let ctx=null,masterGain=null;
 function context(){
   const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
   if(!ctx){ctx=new A();masterGain=ctx.createGain();masterGain.gain.value=.9;masterGain.connect(ctx.destination)}
   return ctx;
 }
 async function unlock(){try{const c=context();if(c&&c.state==='suspended')await c.resume();return !!c}catch(_){return false}}
 window.addEventListener('pointerdown',unlock,{passive:true});window.addEventListener('keydown',unlock,{passive:true});
 function chime(ok=true){
   try{
     if(S.sound===false||S.v5?.settings?.sounds===false)return;
     const c=context();if(!c)return; if(c.state==='suspended'){c.resume().then(()=>chime(ok));return}
     const now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(masterGain);o.type=ok?'sine':'triangle';o.frequency.setValueAtTime(ok?659.25:220,now);if(ok)o.frequency.exponentialRampToValueAtTime(987.77,now+.17);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.10,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+.30);o.start(now);o.stop(now+.31);
   }catch(e){console.warn('Majick chime',e)}
 };
 async function toggleSound(){
   S.sound=S.sound===false?true:false;S.v5=S.v5||{};S.v5.settings=S.v5.settings||{};S.v5.settings.sounds=S.sound;
   await unlock();if(S.sound)chime(true);try{save();render()}catch(_){ }
 };
 mcStartAmbience=function(){return window.MajickCollegiumAtmosphere?.start?.()};
 mcStopAmbience=function(){return window.MajickCollegiumAtmosphere?.stop?.()};


window.MajickStudyAudio=Object.freeze({context,unlock,chime,toggleSound});
window.playChime=chime;window.v339ToggleSound=toggleSound;
})();
