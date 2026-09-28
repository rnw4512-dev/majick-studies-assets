(()=>{
 'use strict';
 const VERSION='3.3.47';
 const ROOMS={home:'College entrance',learninglab:'Candlelit classroom',livinggrimoire:'Working grimoire',companions:'Guardian residence'};
 let ctx,timer,enabled=false;
 try{enabled=localStorage.getItem('majick-ambience')==='on'}catch(_){}
 function room(){return Object.hasOwn(ROOMS,window.S?.screen)?window.S.screen:'home'}
 function stop(){clearTimeout(timer);timer=null}
 function tone(){
   if(!enabled||document.hidden||!ctx||ctx.state!=='running')return;
   const r=room(),now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
   const tones={home:[392,587.33],learninglab:[261.63,392],livinggrimoire:[196,293.66],companions:[329.63,493.88]};
   osc.type='sine';osc.frequency.value=tones[r][Math.random()<.5?0:1];
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.012,now+.08);gain.gain.exponentialRampToValueAtTime(.0001,now+1.4);
   osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+1.45);
   timer=setTimeout(tone,12000+Math.random()*12000);
 }
 async function toggle(){
   enabled=!enabled;
   try{localStorage.setItem('majick-ambience',enabled?'on':'off')}catch(_){}
   stop();
   if(enabled){
     const Audio=window.AudioContext||window.webkitAudioContext;
     if(!Audio){enabled=false;return decorate()}
     try{ctx=ctx||new Audio();await ctx.resume();tone()}catch(_){enabled=false}
   }else if(ctx)ctx.suspend();
   decorate();
 }
 function decorate(){
   const r=room();document.body.dataset.majickRoom=r;
   const top=document.querySelector('.top');if(!top)return;
   let b=top.querySelector('.caAmbience');
   if(!b){b=document.createElement('button');b.type='button';b.className='caAmbience';b.addEventListener('click',toggle);top.append(b)}
   b.textContent=(enabled?'♫ ':'♪ ')+ROOMS[r]+' · ambience '+(enabled?'on':'off');
   b.setAttribute('aria-label',(enabled?'Turn off':'Turn on')+' quiet '+ROOMS[r]+' ambience');
   b.setAttribute('aria-pressed',String(enabled));
   document.title='Majick Studies — V'+VERSION+' Collegium Atmospheres';
 }
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden&&enabled&&ctx?.state==='running')tone()});
 const previous=window.render;
 if(typeof previous==='function')window.render=function(){const result=previous.apply(this,arguments);setTimeout(decorate,0);return result};
 setTimeout(decorate,160);
 window.MajickCollegiumAtmosphere={VERSION,ROOMS,room,decorate};
})();
