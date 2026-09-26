(()=>{
'use strict';
const VERSION='3.3.41';
const COURSE_LABEL=()=>window.S?.activeCourse||'WGU';
const E=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

let audioCtx=null;
let lastReactionAt=0;
const seenNodes=new WeakSet();

function account(){
  try{return window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount||null}catch(_){return window.S?.majickAccount||null}
}
function pets(){return (window.S?.legacy?.pets||[]).filter(Boolean)}
function careSnapshot(){try{return window.MajickGuardianCare?.snapshot?.()||null}catch(_){return null}}
function activePet(){
  const rows=pets(); if(!rows.length)return null;
  const snap=careSnapshot();
  const wanted=window.S?.legacy?.activePetId||snap?.focusPetId;
  const pet=rows.find(p=>p.id===wanted)||rows[0];
  if(pet&&window.S?.legacy&&!window.S.legacy.activePetId)window.S.legacy.activePetId=pet.id;
  return pet;
}
function guardianMeta(p){
  if(!p)return null;
  const reg=window.MajickGuardianRegistry?.get?.(p.type)||{};
  const name=window.v338Canon?.(p.type)?.display||reg.name||p.name||'Guardian';
  const level=typeof window.masPetLevel==='function'?window.masPetLevel(p):Math.max(1,Number(p.level||1)||1);
  const stage=level>=12?'Celestial':level>=8?'Ascendant':level>=5?'Guardian':level>=3?'Apprentice':'New Bond';
  const image=(()=>{try{return window.v3312CurrentGuardianImage?.(p)||window.v338Canon?.(p.type)?.portrait||''}catch(_){return ''}})();
  const snap=careSnapshot();
  const g=snap?.guardians?.[p.id]||snap?.byType?.[p.type]||{};
  return {pet:p,id:p.id,type:p.type,name,level,stage,image,bond:Math.round(Number(g.bond??p.bond??0)),mood:g.mood?.label||'Bonded',icon:g.icon||reg.icon||'✦'};
}
function journey(){
  const a=account();if(!a)return {guardians:{},memories:[]};
  a.guardianJourney=a.guardianJourney||{schemaVersion:1,guardians:{},memories:[]};
  a.guardianJourney.guardians=a.guardianJourney.guardians||{};
  a.guardianJourney.memories=Array.isArray(a.guardianJourney.memories)?a.guardianJourney.memories:[];
  return a.guardianJourney;
}
function guardianJourney(p=activePet()){
  const j=journey(); if(!p)return {questProgress:0,questTarget:5,questCompletions:0,studyMoments:0};
  const g=j.guardians[p.id]||(j.guardians[p.id]={questProgress:0,questTarget:5,questCompletions:0,studyMoments:0,lastReactionAt:0,courses:{}});
  g.courses=g.courses||{};
  return g;
}
function saveState(){
  try{window.save?.()}catch(_){}
  try{window.MajickGuardianCare?.broadcastState?.()}catch(_){}
}
function setActive(id){
  const p=pets().find(x=>x.id===id);if(!p)return false;
  window.S.legacy=window.S.legacy||{};window.S.legacy.activePetId=p.id;
  const a=account();
  if(a?.guardianCare)a.guardianCare.focusPetId=p.id;
  guardianJourney(p);
  saveState();
  sound('hello',p.type);
  sparks(document.querySelector('.v3341GuardianHeroPortrait,.v3341StudyGuardianPortrait'),18);
  try{window.render?.()}catch(_){}
  setTimeout(decorate,30);
  return true;
}
function settings(){
  const a=account();if(!a)return {enabled:true,guardian:true,magic:true,volume:.58};
  a.guardianAudio=a.guardianAudio||{enabled:true,guardian:true,magic:true,volume:.58};
  return a.guardianAudio;
}
function studyPrefs(){
  const a=account();if(!a)return {finishDebriefEnabled:true};
  a.studyPreferences=a.studyPreferences||{};
  if(typeof a.studyPreferences.finishDebriefEnabled!=='boolean')a.studyPreferences.finishDebriefEnabled=true;
  return a.studyPreferences;
}
function debriefEnabled(){return studyPrefs().finishDebriefEnabled!==false}
function applyDebriefPreference(){
  const enabled=debriefEnabled();
  document.querySelectorAll?.('.mcPanel').forEach(panel=>{
    const h=panel.querySelector?.('h3');
    if(h?.textContent?.trim()==='After-test debrief')panel.style.display=enabled?'':'none';
  });
  const stop=document.getElementById?.('ascStop');
  if(stop){
    const finish=[...stop.querySelectorAll?.('button')||[]].find(b=>/Finish/i.test(b.textContent||''));
    if(finish)finish.textContent=enabled?'Finish & debrief':'Finish session';
  }
  document.querySelectorAll?.('[data-v3341-debrief-label]').forEach(x=>x.textContent=enabled?'Debrief on':'Debrief off');
  return enabled;
}
function toggleDebrief(){
  const p=studyPrefs();p.finishDebriefEnabled=!debriefEnabled();saveState();
  applyDebriefPreference();decorate();
  return p.finishDebriefEnabled;
}
function toggleSound(){
  const s=settings();s.enabled=!s.enabled;saveState();
  if(s.enabled){unlockAudio();sound('hello',activePet()?.type)}
  decorate();
}
function unlockAudio(){
  if(audioCtx)return audioCtx;
  try{
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)return null;
    audioCtx=new C();
    if(audioCtx.state==='suspended')audioCtx.resume?.();
  }catch(_){audioCtx=null}
  return audioCtx;
}
function tone(ctx,freq,start,duration,volume=.04,type='sine',endFreq=null){
  try{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,start);
    if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(25,endFreq),start+duration);
    g.gain.setValueAtTime(.0001,start);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.018);
    g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    o.connect(g);g.connect(ctx.destination);o.start(start);o.stop(start+duration+.03);
  }catch(_){}
}
function noise(ctx,start,duration,volume=.015){
  try{
    const size=Math.max(1,Math.floor(ctx.sampleRate*duration)),buf=ctx.createBuffer(1,size,ctx.sampleRate),data=buf.getChannelData(0);
    for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*(1-i/size);
    const src=ctx.createBufferSource(),g=ctx.createGain(),filter=ctx.createBiquadFilter();
    src.buffer=buf;filter.type='bandpass';filter.frequency.value=780;filter.Q.value=2.1;
    g.gain.setValueAtTime(volume,start);g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    src.connect(filter);filter.connect(g);g.connect(ctx.destination);src.start(start);src.stop(start+duration);
  }catch(_){}
}
function sound(kind,type){
  const s=settings();if(!s.enabled)return;
  const ctx=unlockAudio();if(!ctx)return;
  try{if(ctx.state==='suspended')ctx.resume?.()}catch(_){}
  const now=ctx.currentTime+.01,vol=Math.max(.1,Math.min(1,Number(s.volume)||.58));
  const guardian=s.guardian!==false,magic=s.magic!==false;
  if((kind==='correct'||kind==='concept'||kind==='mastery'||kind==='course-pass')&&magic){
    const big=kind==='mastery'||kind==='course-pass';
    tone(ctx,big?523:659,now,.16,.035*vol,'sine',big?784:880);
    tone(ctx,big?659:784,now+.11,.2,.027*vol,'triangle',big?988:1046);
    if(kind==='course-pass')tone(ctx,784,now+.28,.28,.03*vol,'sine',1568);
  }
  if(!guardian)return;
  const t=String(type||activePet()?.type||'');
  if(t==='luna'){
    tone(ctx,170,now+.02,.12,.025*vol,'sine',145);
    tone(ctx,620,now+.11,.14,.022*vol,'sine',760);
  }else if(t==='ember'){
    noise(ctx,now,.11,.014*vol);tone(ctx,240,now+.02,.16,.03*vol,'sawtooth',150);tone(ctx,520,now+.13,.1,.018*vol,'triangle',650);
  }else if(t==='nova'){
    tone(ctx,760,now,.08,.026*vol,'sine',980);tone(ctx,980,now+.075,.08,.022*vol,'sine',820);tone(ctx,820,now+.15,.1,.019*vol,'triangle',1080);
  }else if(t==='mallow'){
    tone(ctx,880,now,.08,.021*vol,'sine',1120);tone(ctx,1180,now+.08,.09,.018*vol,'sine',920);
  }else{
    tone(ctx,560,now,.11,.022*vol,'triangle',720);tone(ctx,740,now+.09,.11,.018*vol,'sine',900);
  }
}
function sparks(target,count=14){
  try{
    const host=document.createElement('div');host.className='v3341SparkBurst';
    const rect=target?.getBoundingClientRect?.();
    host.style.left=((rect?rect.left+rect.width/2:window.innerWidth*.72))+'px';
    host.style.top=((rect?rect.top+rect.height/2:window.innerHeight*.28))+'px';
    for(let i=0;i<count;i++){
      const s=document.createElement('i');
      s.style.setProperty('--a',(i*(360/count)+(Math.random()*20-10))+'deg');
      s.style.setProperty('--d',(42+Math.random()*58)+'px');
      s.style.setProperty('--delay',(Math.random()*.12)+'s');
      s.textContent=i%3===0?'✦':i%3===1?'·':'✧';host.appendChild(s);
    }
    document.body.appendChild(host);setTimeout(()=>host.remove(),1250);
  }catch(_){}
}
function addMemory(p,text,kind){
  if(!p||!text)return;
  const j=journey(),key=p.id+'|'+COURSE_LABEL()+'|'+kind+'|'+text;
  if(j.memories.some(m=>m.key===key))return;
  j.memories.unshift({key,petId:p.id,type:p.type,name:guardianMeta(p)?.name||p.name,course:COURSE_LABEL(),kind,text,at:new Date().toISOString()});
  j.memories=j.memories.slice(0,80);
}
function addBond(p,amount){
  if(!p||!amount)return;
  try{
    const a=account(),g=a?.guardianCare?.guardians?.[p.id];
    if(g)g.bond=Math.max(0,Number(g.bond||0)+Number(amount||0));
  }catch(_){}
}
function broadcastReaction(kind,p,meta={}){
  const payload={type:'MAJICK_STUDY_GUARDIAN_REACTION_V3341',kind,guardianId:p?.id||null,guardianType:p?.type||null,name:guardianMeta(p)?.name||p?.name||'Guardian',course:COURSE_LABEL(),meta};
  document.querySelectorAll('.v3317SanctuaryFrame').forEach(f=>{try{f.contentWindow?.postMessage(payload,location.origin)}catch(_){}});
}
function react(kind,meta={}){
  const now=Date.now();if(kind==='correct'&&now-lastReactionAt<500)return;
  lastReactionAt=now;
  const p=activePet();if(!p)return;
  const gj=guardianJourney(p);
  let bond=0,quest=0,msg='';
  if(kind==='correct'){bond=1;quest=1;msg='Nice reasoning!'}
  else if(kind==='concept'){bond=3;quest=2;msg='Concept mastered together.'}
  else if(kind==='mastery'){bond=5;quest=3;msg='A major study milestone!'}
  else if(kind==='course-pass'){bond=12;quest=5;msg='Course passed together!';addMemory(p,'Passed '+COURSE_LABEL()+' with you.','course-pass')}
  else if(kind==='care'){bond=0;msg='Bond moment.'}
  gj.studyMoments=Number(gj.studyMoments||0)+1;gj.lastReactionAt=now;
  if(quest){
    gj.questProgress=Number(gj.questProgress||0)+quest;
    const target=Math.max(1,Number(gj.questTarget||5));
    if(gj.questProgress>=target){
      gj.questProgress=gj.questProgress-target;gj.questCompletions=Number(gj.questCompletions||0)+1;addBond(p,2);
      msg+=' Bond Quest complete: +2 Bond.';
      addMemory(p,'Completed a Bond Quest while studying '+COURSE_LABEL()+'.','bond-quest');
    }
  }
  addBond(p,bond);
  const courseRow=gj.courses[COURSE_LABEL()]||(gj.courses[COURSE_LABEL()]={correct:0,concepts:0,mastery:0});
  if(kind==='correct')courseRow.correct++;
  if(kind==='concept'){courseRow.concepts++;addMemory(p,'Completed a '+COURSE_LABEL()+' concept with you.','concept')}
  if(kind==='mastery'){courseRow.mastery++;addMemory(p,'Reached a '+COURSE_LABEL()+' mastery checkpoint with you.','mastery')}
  if(kind==='course-pass'){courseRow.passed=true;courseRow.passedAt=new Date().toISOString()}
  saveState();sound(kind,p.type);
  const dock=document.querySelector('.v3341StudyGuardian,.v3341GuardianHero');
  if(dock){dock.classList.remove('reacting');void dock.offsetWidth;dock.classList.add('reacting');const line=dock.querySelector('.v3341ReactionLine');if(line)line.textContent=msg}
  sparks(dock?.querySelector?.('.v3341StudyGuardianPortrait,.v3341GuardianHeroPortrait')||dock,kind==='course-pass'?38:kind==='mastery'?28:kind==='concept'?22:14);
  broadcastReaction(kind,p,meta);
  setTimeout(()=>decorate(),180);
}
function questText(p){
  const g=guardianJourney(p),target=Math.max(1,Number(g.questTarget||5));
  return {progress:Math.min(target,Number(g.questProgress||0)),target,completions:Number(g.questCompletions||0)};
}
function selectorHtml(active){
  const rows=pets();if(rows.length<2)return '';
  return '<div class="v3341GuardianSelector">'+rows.map(p=>{const m=guardianMeta(p);return '<button type="button" class="'+(p.id===active.id?'active':'')+'" onclick="MajickGuardianCore.select('+JSON.stringify(p.id)+')" title="Study with '+E(m.name)+'">'+(m.image?'<img src="'+E(m.image)+'" alt="">':'<span>'+E(m.icon)+'</span>')+'<small>'+E(m.name)+'</small></button>'}).join('')+'</div>';
}
function guardianHeroHtml(){
  const p=activePet();if(!p)return '<div class="v3341GuardianHero empty"><span>✦</span><b>Your Study Guardian is waiting to awaken</b><button onclick="navigate(\'companions\')">Visit Guardian House</button></div>';
  const m=guardianMeta(p),q=questText(p),s=settings();
  return '<section class="v3341GuardianHero">'+
    '<div class="v3341GuardianHeroPortrait">'+(m.image?'<img src="'+E(m.image)+'" alt="'+E(m.name)+'">':'<span>'+E(m.icon)+'</span>')+'<i>✦</i></div>'+
    '<div class="v3341GuardianHeroCopy"><small>ACTIVE STUDY GUARDIAN</small><h3>'+E(m.name)+'</h3><p>'+E(m.stage)+' • '+E(m.mood)+' • Bond '+m.bond+'</p>'+
      '<div class="v3341BondQuest"><div><span>Current Bond Quest</span><b>'+q.progress+' / '+q.target+'</b></div><i><em style="width:'+(q.progress/q.target*100)+'%"></em></i><small>Correct answers and completed concepts fill this. Complete it for +2 Bond.</small></div>'+
      '<div class="v3341GuardianHeroActions"><button class="primary" onclick="MajickGuardianCore.study()">Study with '+E(m.name)+'</button><button onclick="navigate(\'companions\')">Visit Sanctuary</button><button onclick="MajickGuardianCore.toggleSound()">'+(s.enabled?'🔊 Sound on':'🔇 Sound off')+'</button><button onclick="MajickGuardianCore.toggleDebrief()">📝 <span data-v3341-debrief-label>'+(debriefEnabled()?'Debrief on':'Debrief off')+'</span></button></div>'+
      selectorHtml(p)+'<div class="v3341ReactionLine">'+E(m.name)+' is ready to study beside you.</div>'+((recentMemories(2).length)?'<div class="v3341GuardianMemories"><small>RECENT MEMORIES</small>'+recentMemories(2).map(x=>'<span>✦ '+E(x.text)+'</span>').join('')+'</div>':'')+
    '</div>'+
  '</section>';
}
function studyDockHtml(){
  const p=activePet();if(!p)return '';
  const m=guardianMeta(p),q=questText(p);
  return '<aside class="v3341StudyGuardian"><div class="v3341StudyGuardianPortrait">'+(m.image?'<img src="'+E(m.image)+'" alt="'+E(m.name)+'">':'<span>'+E(m.icon)+'</span>')+'<i>✦</i></div><div><small>STUDYING WITH</small><b>'+E(m.name)+'</b><span>'+E(m.mood)+' • Bond '+m.bond+' • Quest '+q.progress+'/'+q.target+'</span><em class="v3341ReactionLine">Your Guardian reacts to your study progress.</em></div><div class="v3341StudyGuardianTools"><button onclick="MajickGuardianCore.cycle()">Switch</button><button onclick="MajickGuardianCore.toggleDebrief()">📝 <span data-v3341-debrief-label>'+(debriefEnabled()?'Debrief on':'Debrief off')+'</span></button></div></aside>';
}
function decorateHome(){
  const hero=document.querySelector('.v3327PortalHero');if(!hero)return;
  const old=hero.querySelector('.v3327RegistrarSeal');
  let card=hero.querySelector('.v3341GuardianHero');
  if(!card){
    const wrap=document.createElement('div');wrap.innerHTML=guardianHeroHtml();card=wrap.firstElementChild;
    if(old)old.replaceWith(card);else hero.appendChild(card);
  }else{
    const wrap=document.createElement('div');wrap.innerHTML=guardianHeroHtml();card.replaceWith(wrap.firstElementChild);
  }
}
function decorateStudy(){
  if(window.S?.screen!=='learninglab'&&window.S?.screen!=='mission')return;
  const targets=[...document.querySelectorAll('.d755Retake,.v3338Classroom,.v3333QuestionShell,.learnLab')];
  const target=targets.find(x=>x.offsetParent!==null)||targets[0];if(!target)return;
  if(target.querySelector(':scope > .v3341StudyGuardian'))return;
  const wrap=document.createElement('div');wrap.innerHTML=studyDockHtml();const el=wrap.firstElementChild;if(el)target.prepend(el);
}
function decorate(){
  try{if(window.S?.screen==='home')decorateHome();else decorateStudy()}catch(e){console.warn('Guardian Core decorate',e)}
}
function study(){
  try{
    if(typeof window.navigate==='function')window.navigate('learninglab');
    else{window.S.screen='learninglab';window.save?.();window.render?.()}
    setTimeout(()=>{
      if(window.S?.activeCourse==='D755')window.MajickD755Retake?.show?.();
      else if(window.S?.activeCourse==='D772')window.MajickInstruction?.show?.();
      decorate();
    },100);
  }catch(_){}
}
function cycle(){
  const rows=pets(),p=activePet();if(rows.length<2)return;
  const i=Math.max(0,rows.findIndex(x=>x.id===p?.id));setActive(rows[(i+1)%rows.length].id);
}
function observeReactions(){
  if(!document.body||window.__v3341Observer)return;
  window.__v3341Observer=new MutationObserver(records=>{
    for(const rec of records)for(const node of rec.addedNodes){
      if(!(node instanceof Element))continue;
      const candidates=[node,...(node.querySelectorAll?.('.v3333Feedback.correct,.v3338Feedback.correct,.d755Feedback.correct,.conceptComplete,.d755Stage.complete,.v3338CheckpointResult.ready,.v3316PassOverlay')||[])];
      for(const el of candidates){
        if(seenNodes.has(el))continue;
        let kind=null;
        if(el.matches?.('.v3333Feedback.correct,.v3338Feedback.correct,.d755Feedback.correct'))kind='correct';
        else if(el.matches?.('.conceptComplete,.d755Stage.complete'))kind='concept';
        else if(el.matches?.('.v3338CheckpointResult.ready'))kind='mastery';
        else if(el.matches?.('.v3316PassOverlay')||el.querySelector?.('.v3316PassOverlay'))kind='course-pass';
        if(kind){seenNodes.add(el);react(kind,{screen:window.S?.screen})}
      }
    }
    setTimeout(decorate,0);
  });
  window.__v3341Observer.observe(document.body,{childList:true,subtree:true});
}
function wrapCare(){
  const old=window.majickCareAction;if(typeof old!=='function'||old.__v3341)return;
  const fn=function(){const r=old.apply(this,arguments);if(r?.ok)react('care',{action:arguments[1]});return r};fn.__v3341=true;window.majickCareAction=fn;
}
function wrapDebrief(){
  const old=window.ascStopRule;
  if(typeof old==='function'&&!old.__v3341Debrief){
    const fn=function(){
      const r=old.apply(this,arguments);
      setTimeout(applyDebriefPreference,0);
      return r;
    };
    fn.__v3341Debrief=true;
    window.ascStopRule=fn;
  }
}
function recentMemories(limit=4){
  const p=activePet();return journey().memories.filter(m=>m.petId===p?.id).slice(0,limit);
}
document.addEventListener('pointerdown',()=>unlockAudio(),{once:true,capture:true});
const previousRender=window.render;
if(typeof previousRender==='function'&&!previousRender.__v3341){
  const wrapped=function(){const r=previousRender.apply(this,arguments);setTimeout(()=>{wrapCare();wrapDebrief();applyDebriefPreference();decorate()},0);return r};
  wrapped.__v3341=true;window.render=wrapped;
}
setTimeout(()=>{wrapCare();wrapDebrief();applyDebriefPreference();decorate();observeReactions()},0);
window.MajickGuardianCore={VERSION,activePet,meta:guardianMeta,select:setActive,cycle,study,react,sound,sparks,toggleSound,settings,studyPrefs,debriefEnabled,toggleDebrief,applyDebriefPreference,journey:guardianJourney,recentMemories,decorate,guardianHeroHtml,studyDockHtml};
document.documentElement.dataset.majickGuardianCore=VERSION;
})();