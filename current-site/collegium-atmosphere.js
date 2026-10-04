(()=>{
 'use strict';
 const VERSION='3.3.64';
 const ROOMS={home:'College entrance',learninglab:'Candlelit classroom',livinggrimoire:'Working grimoire',games:'Game realm',mission:'Practice chamber',companions:'Guardian residence'};
 let ctx,timer,enabled=false,lastRoom=null;
 function room(){return Object.hasOwn(ROOMS,window.S?.screen)?window.S.screen:'home'}
 function stop(){clearTimeout(timer);timer=null}
 function tone(){
   if(!enabled||document.hidden||!ctx||ctx.state!=='running')return;
   const r=room(),now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
   const tones={home:[392,587.33],learninglab:[261.63,392],livinggrimoire:[196,293.66],games:[440,659.25],mission:[349.23,523.25],companions:[329.63,493.88]};
   osc.type='sine';osc.frequency.value=tones[r][Math.random()<.5?0:1];
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.012,now+.08);gain.gain.exponentialRampToValueAtTime(.0001,now+1.4);
   osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+1.45);
   timer=setTimeout(tone,12000+Math.random()*12000);
 }
 async function toggle(){
   enabled=!enabled;
   stop();
   if(enabled){
     const Audio=window.AudioContext||window.webkitAudioContext;
     if(!Audio){enabled=false;return decorate()}
     try{ctx=ctx||new Audio();await ctx.resume();tone()}catch(_){enabled=false}
   }else if(ctx)ctx.suspend();
   decorate();
 }
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
   let b=top.querySelector('.caAmbience');
   if(!b){b=document.createElement('button');b.type='button';b.className='caAmbience';b.addEventListener('click',toggle);top.append(b)}
   b.textContent=(enabled?'♫ ':'♪ ')+ROOMS[r]+' · ambience '+(enabled?'on':'off');
   b.setAttribute('aria-label',(enabled?'Turn off':'Turn on')+' quiet '+ROOMS[r]+' ambience');
   b.setAttribute('aria-pressed',String(enabled));
   document.title='Majick Studies — V'+VERSION+' Collegium Atmospheres';
 }
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden&&enabled&&ctx?.state==='running')tone()});
 document.addEventListener('click',ev=>{
   if(!enabled)return;
   const t=ev.target?.closest?.('.v3358Door,.v3354LessonTabs button,[data-v3338-begin],[data-v3338-phase],.realmTrialCard');
   if(!t)return;
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
 window.MajickCollegiumAtmosphere={VERSION,ROOMS,room,decorate,micro,enabled:()=>enabled};
})();
