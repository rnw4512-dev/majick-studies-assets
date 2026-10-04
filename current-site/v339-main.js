(function(){
 const oldObject=typeof lfObjectHTML==='function'?lfObjectHTML:null;
 lfObjectHTML=function(){
  return `${lfWeatherHTML()}<div class="v339RoomLegend">Dark Collegium • Living Sanctuary</div><div class="v339StoneArch a"></div><div class="v339StoneArch b"></div><div class="v339StoneArch c"></div>
  <div class="v339Shelf" title="Arcane Stacks" onclick="lfObjectInteract('books')"></div>
  <div class="v339Desk" title="Moonlit Study Desk" onclick="lfObjectInteract('page')"></div>
  <div class="v339Telescope" title="Celestial Observatory" onclick="lfObjectInteract('window')"></div>
  <div class="v339CrystalPedestal" title="Crystal Focus Pedestal" onclick="lfObjectInteract('crystal')"></div>
  <div class="v339Apothecary" title="Study Apothecary" onclick="lfObjectInteract('crystal')"></div>
  <div class="v339Settee" title="Familiar Lounge" onclick="lfObjectInteract('bed')"></div>
  <div class="v339CrystalBed left" title="Amethyst Crystal Bed" onclick="lfObjectInteract('bed')"></div>
  <div class="v339CrystalBed right" title="Moonstone Crystal Bed" onclick="lfObjectInteract('bed')"></div>`;
 };
 try{
  if(typeof V336_PROJECT_PROGRESS==='object'){
   V336_PROJECT_PROGRESS.overall=79;V336_PROJECT_PROGRESS.usableStudy=89;
   const row=V336_PROJECT_PROGRESS.areas?.find(x=>x[0]==='Magical college sanctuary');if(row){row[1]=82;row[2]='Dark Collegium room skin, interactive furniture, two crystal beds, local same-origin Phase 4 motion assets, and the existing four familiar movement routines are preserved.'}
   const dep=V336_PROJECT_PROGRESS.areas?.find(x=>x[0]==='Web/GitHub deployment');if(dep){dep[1]=90;dep[2]='Permanent GitHub Pages deployment is live at one stable URL; sanctuary assets now deploy from the same origin.'}
   V336_PROJECT_PROGRESS.next=['Verify the restored sanctuary across desktop and phone','Build the polished collectible furniture inventory and unlock loop','Create movement sets for the six portrait-ready guardians without altering the original four movers'];
  }
 }catch(_){ }
 try{render()}catch(e){console.warn('V3.3.9 sanctuary re-render',e)}
})();

(function(){
 const V339_VERSION='V3.3.9 Dark Collegium + Adaptive Stability';

 // ---------- Remove the old Test Week lock from both defaults and existing saved state ----------
 function v339UnlockStudyState(){
   try{
     S.v5=S.v5||{};S.v5.settings=S.v5.settings||{};
     S.v5.settings.testWeek=false;
     S.v5.settings.freezeUpdates=false;
     // Keep source grounding on by default; this is not a lock and prevents invented course facts.
     if(typeof S.v5.settings.noNewConcepts!=='boolean')S.v5.settings.noNewConcepts=true;
     S.asc=S.asc||{};S.asc.settings=S.asc.settings||{};
     S.asc.settings.testWeekLock=false;
     S.campus=S.campus||{};S.campus.settings=S.campus.settings||{};
     S.campus.settings.pretestLock=false;
     document.body.classList.remove('ascFrozen');
   }catch(e){console.warn('V3.3.9 unlock migration',e)}
 }
 v339UnlockStudyState();
 try{save()}catch(_){ }

 // The lock functions are retained as harmless no-ops so stale buttons cannot re-freeze the app.
 ascLock=function(){v339UnlockStudyState();try{save();render()}catch(_){ }rewardToast('✦ Study system stays open','The old Test Week lock has been retired in V3.3.9.');};
 ascUnlock=function(){v339UnlockStudyState();try{save();render()}catch(_){ }};
 ascApplyBody=function(){document.body.classList.toggle('ascLowMotion',!!S.asc?.settings?.performance);document.body.classList.remove('ascFrozen');};

 // ---------- Persistent browser audio engine ----------
 let v339AudioCtx=null,v339MasterGain=null,v339AmbienceNode=null,v339AmbienceGain=null;
 function v339AudioContext(){
   const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
   if(!v339AudioCtx){v339AudioCtx=new A();v339MasterGain=v339AudioCtx.createGain();v339MasterGain.gain.value=.9;v339MasterGain.connect(v339AudioCtx.destination)}
   return v339AudioCtx;
 }
 async function v339UnlockAudio(){try{const c=v339AudioContext();if(c&&c.state==='suspended')await c.resume();return !!c}catch(_){return false}}
 window.addEventListener('pointerdown',v339UnlockAudio,{passive:true});window.addEventListener('keydown',v339UnlockAudio,{passive:true});
 playChime=function(ok=true){
   try{
     if(S.sound===false||S.v5?.settings?.sounds===false)return;
     const c=v339AudioContext();if(!c)return; if(c.state==='suspended'){c.resume().then(()=>playChime(ok));return}
     const now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(v339MasterGain);o.type=ok?'sine':'triangle';o.frequency.setValueAtTime(ok?659.25:220,now);if(ok)o.frequency.exponentialRampToValueAtTime(987.77,now+.17);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.10,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+.30);o.start(now);o.stop(now+.31);
   }catch(e){console.warn('Majick chime',e)}
 };
 window.v339ToggleSound=async function(){
   S.sound=S.sound===false?true:false;S.v5=S.v5||{};S.v5.settings=S.v5.settings||{};S.v5.settings.sounds=S.sound;
   await v339UnlockAudio();if(S.sound)playChime(true);try{save();render()}catch(_){ }
 };
 mcStartAmbience=function(){
   try{
     const c=v339AudioContext();if(!c)return;if(c.state==='suspended')c.resume();if(v339AmbienceNode)return;
     const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*.12;
     const n=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();n.buffer=buf;n.loop=true;filter.type='lowpass';filter.frequency.value=420;gain.gain.value=.030;n.connect(filter).connect(gain).connect(v339MasterGain);n.start();v339AmbienceNode=n;v339AmbienceGain=gain;
   }catch(e){console.warn('Majick ambience',e)}
 };
 mcStopAmbience=function(){try{v339AmbienceNode?.stop()}catch(_){ }v339AmbienceNode=null;v339AmbienceGain=null};

 // ---------- Canon portraits everywhere in non-Phaser UI ----------
 masPetImage=function(p){const c=window.V338_CANON?.[p?.type]||V338_CANON?.[p?.type];return c?.portrait||''};
 petCoachHTML=function(){
   if(!session||session.finished||!session.current||session.focus)return '';
   const pet=activePet(),c=v338Canon(pet.type),stage=petStage(pet),tip=petTip(session.current);
   return `<div class="petCoach v339CanonCoach" id="petCoach"><div class="portrait"><img src="${c.icon||c.portrait}" alt="${esc(c.display)}"></div><div><div class="tipTitle">${esc(c.display)} • ${esc(stage)} ${esc(c.species)}</div><p>${esc(tip)}</p>${!session.answered?`<button class="petAbility" onclick="usePetAbility()">✦ ${esc(petDef(pet).abilityName)}</button>`:''}</div></div>`;
 };

 // ---------- Stronger adaptive scheduler ----------
 function v339Norm(s=''){return promptTokens(String(s)).slice(0,10).sort().join('|')}
 function v339ScenarioFamily(q){return `${q?.topicId||'mixed'}::${v339Norm(q?.answer||'')}::${v339Norm(q?.keyClue||q?.why||q?.prompt||'')}`}
 function v339GlobalTargetDifficulty(){
   const a=(prog().answers||[]).filter(x=>!x.assisted).slice(-24);if(a.length<4)return 2;
   const acc=a.filter(x=>x.correct).length/a.length;
   let streak=0;for(let i=a.length-1;i>=0&&a[i].correct;i--)streak++;
   let target=2;
   if(a.length>=6&&acc>=.60)target=3;
   if(a.length>=8&&acc>=.72)target=4;
   if(a.length>=12&&acc>=.84)target=5;
   // Three or more independent correct answers in a row should feel like a real level-up.
   if(streak>=3)target=Math.min(5,target+1);
   return target;
 }
 window.v339GlobalTargetDifficulty=v339GlobalTargetDifficulty;
 topicTargetDifficulty=function(topicId){
   const base=v339GlobalTargetDifficulty(),a=(prog().answers||[]).filter(x=>x.topicId===topicId&&!x.assisted).slice(-12);
   if(!a.length)return base;
   const acc=a.filter(x=>x.correct).length/a.length;
   if(a.length>=6&&acc>=.84)return Math.max(base,5);
   if(a.length>=5&&acc>=.74)return Math.max(base,4);
   if(acc<.50)return Math.min(base,2);
   return base;
 };
 pickAdaptive=function(pool=questionPool()){
   if(!pool?.length)return null;
   const p=prog(),answers=p.answers||[],recent=answers.slice(-56),sessionIds=new Set((session?.questions||[]).map(x=>typeof x==='string'?x:x?.id).filter(Boolean));
   const veryRecentIds=new Set(recent.slice(-40).map(a=>a.qid));
   const byId=new Map((questionPool()||[]).map(q=>[q.id,q]));
   const recentFamilies=new Set(recent.slice(-28).map(a=>a.v339Family||(byId.get(a.qid)?v339ScenarioFamily(byId.get(a.qid)):a.family)).filter(Boolean));
   const recentQs=recent.slice(-14).map(a=>byId.get(a.qid)).filter(Boolean);
   const target=v339GlobalTargetDifficulty();
   let candidates=pool.filter(q=>!sessionIds.has(q.id)&&!veryRecentIds.has(q.id));
   if(candidates.length<10)candidates=pool.filter(q=>!sessionIds.has(q.id)&&!recent.slice(-22).some(a=>a.qid===q.id));
   if(candidates.length<6)candidates=pool.filter(q=>!sessionIds.has(q.id)&&!recent.slice(-10).some(a=>a.qid===q.id));
   if(!candidates.length)candidates=pool.filter(q=>!sessionIds.has(q.id));
   if(!candidates.length)candidates=pool.slice();

   // Same conceptual/scenario family stays out while enough alternatives exist.
   let familyFresh=candidates.filter(q=>!recentFamilies.has(v339ScenarioFamily(q)));
   if(familyFresh.length>=6)candidates=familyFresh;

   // Near-duplicate wording also stays out. This prevents the same scenario being recycled with tiny wording changes.
   if(typeof qFingerprint==='function'&&typeof jaccard==='function'&&recentQs.length){
     const freshByMeaning=candidates.filter(q=>{
       const fp=qFingerprint(q);return !recentQs.some(r=>jaccard(fp,qFingerprint(r))>=.48);
     });
     if(freshByMeaning.length>=6)candidates=freshByMeaning;
   }

   // Repairs use a DIFFERENT question/scenario from the missed item whenever possible.
   const urgent=(p.urgentRepair||[]).slice(-10).reverse();
   if(urgent.length&&!session?.currentWasRepair&&Math.random()<.24){
     const u=urgent[0],r=candidates.filter(q=>q.topicId===u.topicId&&q.id!==u.qid);
     if(r.length){const hi=Math.max(...r.map(q=>q.difficulty||1));const rr=r.filter(q=>(q.difficulty||1)>=Math.max(2,hi-1));if(rr.length)candidates=rr;else candidates=r;}
   }

   // Once the learner is performing strongly, prefer actual application/hard items.
   let challenging=candidates.filter(q=>(q.difficulty||1)>=target);
   if(challenging.length>=5)candidates=challenging;
   else {
     let close=candidates.filter(q=>(q.difficulty||1)>=Math.max(2,target-1));
     if(close.length>=5)candidates=close;
   }

   const recentTopic={},recentSection={},recentFormat={};
   for(const a of recent.slice(-18)){recentTopic[a.topicId]=(recentTopic[a.topicId]||0)+1;recentSection[a.section||'']=(recentSection[a.section||'']||0)+1;recentFormat[a.format||'scenario']=(recentFormat[a.format||'scenario']||0)+1}
   const hist=new Set(answers.map(a=>a.qid));
   const scored=candidates.map(q=>{
     const d=q.difficulty||1,fmt=q.format||'scenario',sec=q.section||'';
     let score=12-Math.abs(d-target)*2.15;
     if(d>=4)score+=target>=4?3.1:.4;if(d===5&&target===5)score+=3.0;
     if(!hist.has(q.id))score+=3.2;
     score-=Math.min(3,recentTopic[q.topicId]||0)*1.15;
     score-=Math.min(3,recentSection[sec]||0)*.55;
     score-=Math.min(3,recentFormat[fmt]||0)*.38;
     if(['transfer','error_analysis','discrimination'].includes(fmt))score+=1.35;
     if(recentFamilies.has(v339ScenarioFamily(q)))score-=4.5;
     score+=Math.random()*.85;
     return [q,score];
   }).sort((a,b)=>b[1]-a[1]);
   const top=scored.slice(0,Math.min(4,scored.length));
   return (top.length?top[Math.floor(Math.random()*top.length)][0]:candidates[0])||pool[0];
 };

 // Record stronger family signature and section for future rotation without changing existing save schema.
 const _v339RecordBase=record;
 record=function(q,chosen,correct,confidence,mode){
   _v339RecordBase(q,chosen,correct,confidence,mode);
   const a=prog().answers?.at(-1);if(a){a.v339Family=v339ScenarioFamily(q);a.section=q.section||'';}
   try{save()}catch(_){ }
 };

 // ---------- UI cleanup / verification ----------
 const _v339ControlBase=controlHTML;
 controlHTML=function(){
   let html=_v339ControlBase();
   html=html.replace(/<div class="ascPanel"><h3>🔒 Test Week Lock<\/h3>[\s\S]*?<\/div>/,'');
   html=html.replace(/⚙️ Test Week Control Room/g,'⚙️ Majick Studies Control Room');
   return `<div class="v339UnlockedNote"><b>✦ V3.3.9:</b> Test Week Lock retired. Adaptive Study is open and will rotate scenarios while escalating difficulty from your recent performance.</div>`+html;
 };

 const _v339SideBase=sideHTML;
 sideHTML=function(){
   let html=_v339SideBase();
   const soundOn=S.sound!==false&&S.v5?.settings?.sounds!==false;
   return html.replace('</nav>',`<div class="v339SoundRow"><button class="v339SoundBtn" onclick="v339ToggleSound()">${soundOn?'🔊 Sound on • tap to test/mute':'🔇 Sound off • tap to enable'}</button></div></nav>`);
 };

 const _v339SessionBase=sessionHTML;
 sessionHTML=function(){
   let html=_v339SessionBase();
   if(session?.current&&!session?.opts?.hideMeta&&!session?.finalTransformation){
     const target=v339GlobalTargetDifficulty();
     html=html.replace(`Difficulty ${session.current.difficulty||1}`,`Difficulty ${session.current.difficulty||1} <span class="v339AdaptiveChip">adaptive target ${target}</span>`);
   }
   return html;
 };

 const _v339RenderBase=render;
 render=function(){
   v339UnlockStudyState();_v339RenderBase();
   const pill=document.querySelector('.top .pill');if(pill)pill.textContent='Living Familiars • V3.3.9 Dark Collegium';
   document.title='Majick Studies — Dark Collegium';
   // Hide stale Test Week controls/wording left by older layers.
   document.querySelectorAll('.v5Toggle').forEach(el=>{if(/Test Week Freeze/i.test(el.textContent||''))el.style.display='none'});
   document.querySelectorAll('h2,h3,.rankBadge').forEach(el=>{if(/Test Week/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/Test Week/gi,'Study')});
   setTimeout(()=>{try{injectPetCoach()}catch(_){ }},0);
 };

 // Project progress protocol for this release.
 try{
   V336_PROJECT_PROGRESS.overall=82;V336_PROJECT_PROGRESS.usableStudy=92;
   V336_PROJECT_PROGRESS.areas=[
    ['Core study engine',92,'Stable V5.2 question/scoring foundation preserved; V3.3.9 changes scheduler selection, audio and UI presentation without resetting progress.'],
    ['Adaptive study + analytics',88,'Scenario families now rotate across a wider recent-history window and difficulty escalates toward 4–5 after sustained independent accuracy.'],
    ['Guardian identity system',95,'Canon names and exact approved portrait/icon assets are used throughout non-Phaser UI; old movement art remains only inside the existing Phase 4 movers.'],
    ['Magical college sanctuary',85,'Dark Collegium room skin, interactive study furniture, crystal beds and same-origin Phase 4 assets restore the sanctuary while preserving movement routines.'],
    ['Collectibles / decorating',55,'Core movable furniture and crystal resting objects exist; a larger study-earned furniture inventory is still next.'],
    ['10-guardian roster',80,'All ten guardians remain in roster/codex; the original four have movement and the six newer guardians remain portrait-ready.'],
    ['Evolution system',58,'Five phases and ten banners are visible; separate per-stage portrait/sprite files are still incomplete.'],
    ['Save / update safety',88,'Permanent GitHub Pages origin is live; browser progress survives code updates and emergency recovery remains available.'],
    ['Web/GitHub deployment',94,'One permanent Pages URL is live and V3.3.9 uses a patch-overlay workflow so future text/code fixes deploy in place.']
   ];
   V336_PROJECT_PROGRESS.next=['Verify Dark Collegium sanctuary and same-origin familiar movement in the live browser','Expand study-earned furniture inventory and placement without changing the four existing movement routines','Create movement sets for Vesper, Briar, Zephyr, Prism, Rook and Solara from their exact canon designs'];
 }catch(_){ }

 try{save();render()}catch(e){console.error('V3.3.9 boot',e)}
})();
