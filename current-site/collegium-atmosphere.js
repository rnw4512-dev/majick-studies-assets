(()=>{
 'use strict';
 const VERSION='3.3.64';
 const ROOMS={home:'College entrance',learninglab:'Candlelit classroom',livinggrimoire:'Working grimoire',games:'Game realm',mission:'Practice chamber',companions:'Guardian residence',journal:'Scholar Journal',vault:'Moon Crystal Vault'};
 const TRACKS=Object.freeze({
   dreams:{title:'Dreams Become Real',artist:'Kevin MacLeod',path:'./assets/audio/dreams-become-real.ogg'},
   'crystal-cave':{title:'Crystal Cave',artist:'The Cynic Project',path:'./assets/licensed/music/crystal-cave.ogg'},
   'crystal-mystery':{title:'Crystal Cave + Mysterious Ambience',artist:'The Cynic Project · congusbongus',path:'./assets/licensed/music/crystal-mystery.ogg'},
   'mystical-theme':{title:'Mystical Theme',artist:'Alexandr Zhelanov',path:'./assets/licensed/music/mystical-theme.ogg'},
   'enchanted-tiki':{title:'Enchanted Tiki 86',artist:'The Cynic Project',path:'./assets/licensed/music/enchanted-tiki.ogg'},
   'dark-ambience':{title:'Dark Ambience Loop',artist:'Iwan Gabovitch',path:'./assets/licensed/music/dark-ambience.ogg'},
   'enchanted-festival':{title:'Enchanted Festival',artist:'Matthew Pablo',path:'./assets/licensed/music/enchanted-festival.ogg'}
 });
 let selectedTrack='dreams',loadedTrack=null,personalTrack=null,personalLoaded=false;
 function track(id){return id==='personal'?personalTrack:TRACKS[id]}
 function attachPersonal(file){
   if(personalTrack)URL.revokeObjectURL(personalTrack.path);
   personalTrack={title:file.name.replace(/\.[^.]+$/,''),artist:'Personal audio',path:URL.createObjectURL(file)};
 }
 async function choosePersonal(file){
   if(!file)return;
   if(file.size>24*1024*1024||!(/^(audio\/)/i.test(file.type)||/\.(mp3|ogg|wav|m4a)$/i.test(file.name))){
     error='Choose an audio file under 24 MB.';decorate();return;
   }
   try{await window.MajickPersonalArtwork.storeMusic(file);}
   catch(_){error='This browser could not store the audio file.';decorate();return;}
   if(selectedTrack==='personal')loadedTrack=null;
   attachPersonal(file);
   if(selectedTrack==='personal'){
    const resume=enabled;stop();enabled=false;
    if(resume)await start();else decorate();
   }else await selectTrack('personal');
 }
 function loadPersonal(){
   if(personalLoaded||!window.MajickPersonalArtwork?.readMusic)return;
   personalLoaded=true;
   window.MajickPersonalArtwork.readMusic().then(file=>{
    if(file&&!personalTrack){attachPersonal(file);decorate();}
   }).catch(()=>{});
 }
 let ctx,enabled=false,lastRoom=null,music=null,error='',audioRequest=0,lastMicroAt=0;
 function room(){return Object.hasOwn(ROOMS,window.S?.screen)?window.S.screen:'home'}
 function volume(){const value=Number(window.S?.majickAccount?.guardianAudio?.musicVolume??.22);return Math.max(0,Math.min(.7,Number.isFinite(value)?value:.22))}
 const spellClips=new Map();
 function stop(){music?.pause();spellClips.forEach(a=>{a.pause();a.currentTime=0})}
 function recording(){
   const source=track(selectedTrack).path+(selectedTrack==='personal'?'':'?v='+encodeURIComponent(window.MAJICK_RELEASE||'source'));
   if(!music){music=new window.Audio(source);loadedTrack=selectedTrack;music.loop=true;music.preload='none';music.addEventListener('error',()=>{enabled=false;error='The selected music could not load. Try another track or check your connection.';stop();decorate()});music.addEventListener('ended',()=>{if(enabled){enabled=false;decorate()}})}
   else if(loadedTrack!==selectedTrack){music.pause();music.preload='none';music.src=source;loadedTrack=selectedTrack}
   music.volume=volume()*(window.speechSynthesis?.speaking?0.18:1);return music;
 }
 async function selectTrack(id){
   if(!track(id))return false;
   if(id===selectedTrack)return true;
   const resume=enabled;audioRequest++;stop();selectedTrack=id;error='';
   if(resume)return start();
   decorate();return true;
 }

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
     if(request!==audioRequest)return false;
     if(!enabled){stop();return false}
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
   const preferences=window.MajickGuardianCore?.settings?.();
   if(preferences?.enabled===false||preferences?.magic===false)return false;
   const sample={home:1,learninglab:2,livinggrimoire:3,games:4,mission:2,companions:5}[r];
   if(sample&&volume()>0){try{let clip=spellClips.get(sample);if(!clip){clip=new window.Audio('./assets/licensed/audio/magical_'+sample+'.ogg?v='+encodeURIComponent(window.MAJICK_RELEASE||'source'));clip.preload='none';spellClips.set(sample,clip)}clip.volume=Math.min(.18,volume()*.4);clip.currentTime=0;clip.play().catch(()=>{});return true}catch(_){/* Preserve synthesized fallback below. */}}
   if(r==='home'){ping(523.25,.12,.008,'sine',659.25);ping(783.99,.16,.006,'triangle',987.77,.07)}
   else if(r==='learninglab'){ping(kind==='chalk'?410:329.63,.11,.006,'triangle',kind==='chalk'?520:392)}
   else if(r==='livinggrimoire'){ping(220,.09,.005,'triangle',277.18);ping(329.63,.1,.004,'sine',392,.055)}
   else if(r==='games'){ping(440,.1,.007,'triangle',659.25);ping(659.25,.11,.005,'sine',880,.065)}
   else if(r==='mission'){ping(349.23,.09,.006,'triangle',523.25)}
   else if(r==='companions'){ping(329.63,.13,.006,'sine',493.88)}
   return true;
 }
 const cueKeys=new Map();
 function eventCue(kind,key){
   if(!enabled||document.hidden||!ctx||ctx.state!=='running'||volume()<=0)return;
   const settings=window.MajickGuardianCore?.settings?.();if(settings?.enabled===false||settings?.magic===false)return;
   if(window.speechSynthesis?.speaking)return;
   if(key){if(cueKeys.has(key))return;cueKeys.set(key,Date.now());if(cueKeys.size>300)cueKeys.delete(cueKeys.keys().next().value)}
   const v=Math.min(.025,volume()*.07);
   if(kind==='correct'){ping(659.25,.12,v,'sine');ping(880,.16,v*.8,'sine',null,.09)}
   else if(kind==='incorrect'){ping(392,.18,v*.5,'sine',349.23)}
   else if(kind==='mastery'||kind==='course'){[523.25,659.25,783.99,1046.5].forEach((f,i)=>ping(f,.25,v*.65,'sine',null,i*.095))}
   else if(kind==='hatch'){[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>ping(f,.28,v*.65,'sine',null,i*.11))}
   else if(kind==='repair'){ping(440,.18,v*.6,'sine',523.25);ping(659.25,.22,v*.7,'sine',783.99,.12)}
   else if(kind==='ingredient'){ping(330,.10,v*.65,'triangle',220)}
   else if(kind==='stir'){ping(180,.18,v*.45,'sine',360)}
   else if(kind==='bottle'){ping(523.25,.15,v,'sine',783.99);ping(1046.5,.2,v*.6,'sine',null,.12)}
 }
 document.addEventListener('majick:verified-study-answer',e=>{const d=e.detail||{};if(d.historical)return;eventCue(d.correct?'correct':'incorrect',d.key?'answer:'+d.key:null)});
 document.addEventListener('majick:celebrate',e=>{const d=e.detail||{};if(d.verified)eventCue(d.type,d.key?'celebrate:'+d.key:null)});
 document.addEventListener('majick:guardian-hatched',e=>{const d=e.detail||{};if(d.verified)eventCue('hatch',d.key?'hatch:'+d.key:null)});
 document.addEventListener('majick:repair-confirmed',e=>{const d=e.detail||{};if(d.verified)eventCue('repair',d.key?'repair:'+d.key:null)});
 document.addEventListener('majick:brew-stage',e=>{const d=e.detail||{};eventCue(d.kind)});
 function speechVolume(){if(music)music.volume=volume()*(window.speechSynthesis?.speaking?0.18:1)}
 document.addEventListener('majick:workspace-ready',loadPersonal,{once:true});
 document.addEventListener('visibilitychange',speechVolume);
 setInterval(()=>{if(enabled&&music&&!music.paused)speechVolume()},300);
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

   loadPersonal();
   const top=document.querySelector('.top');if(!top)return;
   const pill=top.querySelector('.pill');if(pill)pill.textContent='Guardian Room Check • V'+VERSION;
   let controls=top.querySelector('.caSoundControls');
   if(!controls){controls=document.createElement('div');controls.className='caSoundControls';const button=document.createElement('button');button.type='button';button.className='caAmbience';button.addEventListener('click',toggle);controls.append(button);const options=document.createElement('details');options.className='caSoundOptions';const summary=document.createElement('summary');summary.textContent='Sound settings';options.append(summary);const label=document.createElement('label');label.textContent='Music volume ';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='70';slider.step='1';slider.value=String(Math.round(volume()*100));slider.setAttribute('aria-label','Music volume');slider.addEventListener('input',()=>setVolume(Number(slider.value)/100));label.append(slider);options.append(label);const trackLabel=document.createElement('label');trackLabel.textContent='Music track ';const picker=document.createElement('select');picker.className='caTrackSelect';picker.setAttribute('aria-label','Music track');Object.entries(TRACKS).forEach(([id,track])=>{const option=document.createElement('option');option.value=id;option.textContent=track.title;picker.append(option)});picker.value=selectedTrack;picker.addEventListener('change',()=>selectTrack(picker.value));trackLabel.append(picker);options.append(trackLabel);const personalLabel=document.createElement('label');personalLabel.textContent='Add personal music from this device ';const file=document.createElement('input');file.type='file';file.accept='audio/*,.mp3,.ogg,.wav,.m4a';file.addEventListener('change',()=>{choosePersonal(file.files[0]);file.value=''});personalLabel.append(file);options.append(personalLabel);const credit=document.createElement('a');credit.className='caMusicCredit';credit.href='./assets/IMMERSION-CREDITS.html';credit.textContent='Music by Kevin MacLeod · Artist credits';options.append(credit);const note=document.createElement('p');note.className='caSoundStatus';note.setAttribute('role','status');options.append(note);controls.append(options);top.append(controls)}
   const b=controls.querySelector('.caAmbience');
   if(enabled&&music?.paused){enabled=false;error=error||'Music stopped. Tap Enable music to restart it.'}
   b.textContent=(enabled?'♫ ':'♪ ')+ROOMS[r]+' · music '+(enabled?'on':'off');
   b.setAttribute('aria-label',(enabled?'Mute':'Enable')+' ethereal music');
   b.setAttribute('aria-pressed',String(enabled));
   const picker=controls.querySelector('.caTrackSelect');
   if(personalTrack){
    let option=picker.querySelector('option[value="personal"]');
    if(!option){option=document.createElement('option');option.value='personal';picker.append(option);}
    option.textContent=personalTrack.title+' (this device)';
   }
   picker.value=selectedTrack;
   controls.querySelector('.caMusicCredit').textContent=selectedTrack==='personal'?'Built-in music credits':'Music credits · '+track(selectedTrack).artist;
   controls.querySelector('.caSoundStatus').textContent=error||(enabled?'Playing '+track(selectedTrack).title+'.':'Music is off. Choose a track, then enable music when you want it.');
   document.title='Majick Studies — V'+VERSION+' Collegium Atmospheres';
 }
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden&&enabled)recording().play().catch(()=>{enabled=false;error='Tap Enable music to resume audio.';decorate()})});
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
 window.MajickCollegiumAtmosphere={VERSION,ROOMS,room,decorate,micro,start,selectTrack,stop:()=>{enabled=false;audioRequest++;stop();ctx?.suspend();decorate()},setVolume,inspect:()=>({enabled,playing:!!music&&!music.paused,volume:volume(),loaded:music?.readyState||0,error,spellClips:spellClips.size,track:selectedTrack,loadedTrack}),enabled:()=>enabled};
})();
