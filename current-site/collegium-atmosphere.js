(()=>{
 'use strict';
 const VERSION='3.3.64';
 const ROOMS={home:'College entrance',learninglab:'Candlelit classroom',livinggrimoire:'Working grimoire',games:'Game realm',mission:'Practice chamber',companions:'Guardian residence'};
 let ctx,enabled=false,lastRoom=null,music=null,error='',audioRequest=0,lastMicroAt=0;
 function room(){return Object.hasOwn(ROOMS,window.S?.screen)?window.S.screen:'home'}
 function volume(){const value=Number(window.S?.majickAccount?.guardianAudio?.musicVolume??.22);return Math.max(0,Math.min(.7,Number.isFinite(value)?value:.22))}
 function stop(){music?.pause()}
 function recording(){if(!music){music=new window.Audio('./assets/audio/dreams-become-real.ogg');music.loop=true;music.preload='auto';music.addEventListener('error',()=>{enabled=false;error='Music file could not load. Check the audio asset and connection.';stop();decorate()});music.addEventListener('ended',()=>{if(enabled){enabled=false;decorate()}})}music.volume=volume();return music}
 async function start(){
   if(enabled&&music&&!music.paused)return true;
   error='';enabled=true;const request=++audioRequest;
   try{
     // Begin HTMLAudioElement playback directly inside the user's click gesture.
     // Waiting for AudioContext.resume() first can lose transient user activation.
     const track=recording();
     if(track.volume<=0){error='Music volume is 0. Raise it under Sound settings.';enabled=false;decorate();return false}
     const playPromise=track.play();
     const AudioContext=window.AudioContext||window.webkitAudioContext;
     if(AudioContext){
       try{ctx=ctx||new AudioContext();ctx.resume().catch(()=>{})}
       catch(_){/* Music can play without Web Audio sound effects. */}
     }
     await playPromise;
     if(!enabled||request!==audioRequest){stop();return false}
   }catch(e){
     if(request!==audioRequest)return false;
     enabled=false;stop();
     error='Music could not start. Check volume, browser sound permission, and audio loading, then tap Enable music again.';
   }
   decorate();return enabled;
 }
 async function toggle(){if(enabled){enabled=false;audioRequest++;stop();if(ctx)ctx.suspend();decorate()}else await start()}
 function setVolume(value){const v=Math.max(0,Math.min(.7,Number(value)||0));const account=window.S?.majickAccount;if(account){account.guardianAudio=window.MajickGuardianCore?.settings?.()||account.guardianAudio||{enabled:true,guardian:true,magic:true,volume:.58};account.guardianAudio.musicVolume=v;window.save?.()}if(music)music.volume=v}
 function ping(freq,duration=.12,volume=.008,type='sine',endFreq=null,offset=0){
   if(!ctx||ctx.state!=='running')return;
   try{
     const now=ctx.currentTime+offset,o=ctx.createOscillator(),g=ctx.createGain();
     o.type=type;o.frequency.setValueAtTime(freq,now);
     if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),now+duration);
     g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
     o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+duration+.02);
   }catch(_){}
 }
 function micro(kind='enter',forcedRoom=room()){
   if(!enabled||document.hidden||!ctx||ctx.state!=='running')return false;
   const now=Date.now();if(now-lastMicroAt<160)return false;lastMicroAt=now;
   const r=Object.hasOwn(ROOMS,forcedRoom)?forcedRoom:room();
   if(r==='home'){ping(523.25,.12,.008,'sine',659.25);ping(783.99,.16,.006,'triangle',987.77,.07)}
   else if(r==='learninglab'){ping(kind==='chalk'?410:329.63,.11,.006,'triangle',kind==='chalk'?520:392)}
   else if(r==='livinggrimoire'){ping(220,.09,.005,'triangle',277.18);ping(329.63,.1,.004,'sine',392,.055)}
   else if(r==='games'){ping(440,.1,.007,'triangle',659.25);ping(659.25,.11,.005,'sine',880,.065)}
   else if(r==='mission'){ping(349.23,.09,.006,'triangle',523.25)}
   else if(r==='companions'){ping(329.63,.13,.006,'sine',493.88)}
   return true;
 }
 function decorate(){
   const r=room();
   if(lastRoom&&lastRoom!==r&&enabled)micro('enter',r);
   lastRoom=r;document.body.dataset.majickRoom=r;
   const libraryRoom=r==='home'||r==='mission';
   const content=document.querySelector('.content');
   if(content){
     let magic=content.querySelector('.ancientLibraryMagic');
     if(libraryRoom&&!magic){
       magic=document.createElement('div');magic.className='ancientLibraryMagic';magic.setAttribute('aria-hidden','true');
       ['⚗︎','☾','✧','⚗︎','✦'].forEach((glyph,i)=>{const charm=document.createElement('span');charm.textContent=glyph;charm.style.setProperty('--charm-index',i);magic.append(charm)});
       content.prepend(magic);
     }else if(!libraryRoom&&magic)magic.remove();
     content.classList.toggle('ancientLibraryRoom',libraryRoom);
   }

   const top=document.querySelector('.top');if(!top)return;
   const pill=top.querySelector('.pill');if(pill)pill.textContent='Guardian Room Check • V'+VERSION;
   let controls=top.querySelector('.caSoundControls');
   if(!controls){controls=document.createElement('div');controls.className='caSoundControls';const button=document.createElement('button');button.type='button';button.className='caAmbience';button.addEventListener('click',toggle);controls.append(button);const options=document.createElement('details');options.className='caSoundOptions';const summary=document.createElement('summary');summary.textContent='Sound settings';options.append(summary);const label=document.createElement('label');label.textContent='Music volume ';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='70';slider.step='1';slider.value=String(Math.round(volume()*100));slider.setAttribute('aria-label','Music volume');slider.addEventListener('input',()=>setVolume(Number(slider.value)/100));label.append(slider);options.append(label);const credit=document.createElement('a');credit.href='./assets/IMMERSION-CREDITS.html';credit.textContent='Music by Kevin MacLeod · Artist credits';options.append(credit);const note=document.createElement('p');note.className='caSoundStatus';note.setAttribute('role','status');options.append(note);controls.append(options);top.append(controls)}
   const b=controls.querySelector('.caAmbience');
   if(enabled&&music?.paused){enabled=false;error=error||'Music stopped. Tap Enable music to restart it.'}
   b.textContent=(enabled?'♫ ':'♪ ')+ROOMS[r]+' · music '+(enabled?'on':'off');
   b.setAttribute('aria-label',(enabled?'Mute':'Enable')+' ethereal music');
   b.setAttribute('aria-pressed',String(enabled));
   controls.querySelector('.caSoundStatus').textContent=error||(enabled?'Playing Dreams Become Real.':'Music is off. Enable it when you want an enchanted atmosphere.');
   document.title='Majick Studies — V'+VERSION+' Collegium Atmospheres';
 }
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden&&enabled)recording().play().catch(()=>{enabled=false;error='Tap Enable music to resume audio.';decorate()})});
 document.addEventListener('click',ev=>{
   if(!enabled)return;
   const t=ev.target?.closest?.('.v3358Door,.v3354LessonTabs button,[data-v3338-begin],[data-v3338-phase],.realmTrialCard');
   if(!t){const control=ev.target?.closest?.('button,summary,[role=button]');if(control&&!control.disabled&&!control.closest('.caSoundControls'))micro('touch');return}
   if(t.matches?.('.v3354LessonTabs button'))micro('page','livinggrimoire');
   else if(t.matches?.('[data-v3338-begin],[data-v3338-phase]'))micro('chalk','learninglab');
   else if(t.matches?.('.v3358Door'))micro('bell','home');
   else if(t.matches?.('.realmTrialCard'))micro('trial','games');
 },{passive:true});
const renderQueue=window.MajickRenderQueue;
if(renderQueue?.register){
 renderQueue.register('collegium-atmosphere',decorate,40);
 renderQueue.schedule();
}else{
 const previousRender=window.render;
 if(typeof previousRender==='function'&&!previousRender.__collegium_atmosphereFallback){
  const wrapped=function(){const out=previousRender.apply(this,arguments);setTimeout(decorate,0);return out};
  wrapped.__collegium_atmosphereFallback=true;window.render=wrapped;
 }
 setTimeout(decorate,120);
}
 window.MajickCollegiumAtmosphere={VERSION,ROOMS,room,decorate,micro,start,stop:()=>{enabled=false;audioRequest++;stop();ctx?.suspend();decorate()},setVolume,inspect:()=>({enabled,playing:!!music&&!music.paused,volume:volume(),loaded:music?.readyState||0,error}),enabled:()=>enabled};
})();
