(function(){
'use strict';
const VERSION='3.3.37';

function E(s){try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}}
function currentCourse(){try{return course()}catch(_){return S?.courses?.[S?.activeCourse]||{id:'',title:''}}}
function academic(){
  const c=currentCourse(),id=c.id||S?.activeCourse||'';
  const tutor=window.MajickCourseTutor;
  const lesson=tutor?.selectedLesson?.(id)||null;
  const sections=tutor?.sections?.(id)||[];
  const section=sections.find(s=>s.lessons?.some(l=>l.id===lesson?.id))||sections[0]||null;
  const mastery=lesson?tutor?.mastery?.(lesson,id):null;
  const sectionProgress=section?tutor?.sectionProgress?.(section,id):null;
  let st={readiness:0,acc:0,recent:[],hardAcc:0};
  try{st=stats()}catch(_){}
  const p=(()=>{try{return prog()}catch(_){return {answers:[]}}})();
  return {c,id,lesson,section,mastery,sectionProgress,st,p};
}
function stageFor(p){
  try{
    const level=typeof masPetLevel==='function'?masPetLevel(p):Math.max(1,Number(p?.level||1)||1);
    return level>=12?'Celestial':level>=8?'Ascendant':level>=5?'Guardian':level>=3?'Apprentice':'New Bond';
  }catch(_){return 'New Bond'}
}
function guardianImage(p){
  try{return window.v3312CurrentGuardianImage?.(p)||window.v338Canon?.(p.type)?.portrait||''}catch(_){return ''}
}
function guardianName(p){
  try{return window.v338Canon?.(p.type)?.display||p.name||'Guardian'}catch(_){return p?.name||'Guardian'}
}
function guardians(){
  return (S?.legacy?.pets||[]).filter(Boolean);
}
function account(){
  try{return MajickStateCore?.ensureAccount?.()||S?.majickAccount||{}}catch(_){return S?.majickAccount||{}}
}
function coursePace(a){
  const record=window.S?.majickCourseRecords?.[a.id]||null;
  const minWeeks=Math.max(1,Number(record?.paceMinWeeks||4));
  const targetWeeks=Math.max(minWeeks,Number(record?.paceTargetWeeks||5));
  const maxWeeks=Math.max(targetWeeks,Number(record?.paceMaxWeeks||6));
  const started=record?.startedAt?new Date(record.startedAt):null;
  const validStart=started&&!Number.isNaN(started.getTime());
  const elapsedDays=validStart?Math.max(1,Math.floor((Date.now()-started.getTime())/86400000)+1):null;
  const week=elapsedDays?Math.max(1,Math.ceil(elapsedDays/7)):null;
  let phase='SELF-PACED';
  let advice='Aim to complete the course in 4–6 weeks, but test sooner whenever your mastery and OA readiness support it.';
  if(week!==null){
    if(week<minWeeks){
      phase='ACCELERATION WINDOW';
      advice='Keep building mastery, but do not wait for the calendar. If you are genuinely OA-ready before Week '+minWeeks+', accelerate.';
    }else if(week<=targetWeeks){
      phase='TARGET FINISH WINDOW';
      advice='You are in your preferred finish zone. Shift toward mixed OA practice and repair only the concepts that still need work.';
    }else if(week<=maxWeeks){
      phase='EFFICIENCY GUARDRAIL';
      advice='Use this week as a guardrail, not a deadline. Avoid unnecessary new material and focus on remaining weak concepts plus OA readiness.';
    }else{
      phase='FOCUS & FINISH';
      advice='This course is using more time than your preferred plan. Study only the remaining weak concepts and move toward the OA as soon as mastery supports it.';
    }
  }
  return {record,minWeeks,targetWeeks,maxWeeks,elapsedDays,week,phase,advice};
}
function paceCard(a){
  const p=coursePace(a);
  const headline=p.week?'Week '+p.week+' of a ~'+p.targetWeeks+'-week target':'4–6 week self-paced target';
  return '<div class="v3337PaceCard">'+
    '<div class="v3337PaceTop"><div><small>SELF-PACED COURSE CLOCK</small><b>'+E(headline)+'</b></div><span>'+E(p.phase)+'</span></div>'+
    '<div class="v3337PaceWindow"><i>Earliest preferred finish <b>Week '+p.minWeeks+'</b></i><i>Target <b>Week '+p.targetWeeks+'</b></i><i>Guardrail <b>Week '+p.maxWeeks+'</b></i></div>'+
    '<p>'+E(p.advice)+'</p>'+
    '<em>No fixed Sunday deadline • finish as soon as you are ready</em>'+
  '</div>';
}
function nextAcademicText(a){
  const m=a.mastery;
  if(!a.lesson)return 'Open the Course Tutor and choose the next lesson in your learning path.';
  if(!m?.sourceCount)return 'Add the notes for '+a.lesson.title+' so Majick can build its tutor chapter.';
  if(m.status==='Needs Review')return 'Re-enter '+a.lesson.title+' through the Tutor, review the traps, then rebuild at R'+m.targetRigor+'.';
  if(m.status==='Learning')return 'Read the '+a.lesson.title+' tutor chapter, learn the vocabulary, then complete foundation practice.';
  if(m.status==='Developing')return 'Continue '+a.lesson.title+' practice. Your next questions target rigor R'+m.targetRigor+'.';
  if(m.status==='Proficient')return 'Push '+a.lesson.title+' into analysis and OA-style scenarios.';
  if(m.status==='Mastered')return 'Move forward in the learning path and keep this lesson alive with spaced review.';
  return 'Continue your course path.';
}
function openTutor(){
  try{
    if(typeof navigate==='function')navigate('learninglab');
    else {S.screen='learninglab';save();render()}
    setTimeout(()=>window.MajickCourseTutor?.show?.('tutor'),80);
  }catch(_){try{navigate('learninglab')}catch(__){}}
}
window.v3327OpenTutor=openTutor;

function guardianCards(){
  const pets=guardians();
  if(!pets.length)return '<div class="v3327NoGuardians">Your Guardian House will awaken as you study.</div>';
  return pets.map((p,i)=>{
    const img=guardianImage(p),name=guardianName(p),stage=stageFor(p);
    const active=p.id===S?.legacy?.activePetId;
    return '<article class="v3327GuardianCard '+(active?'active':'')+'">'+
      '<div class="v3327GuardianPortrait">'+(img?'<img src="'+E(img)+'" alt="'+E(name)+'">':'<span>✦</span>')+'</div>'+
      '<div><small>'+(active?'ACTIVE STUDY GUARDIAN':'GUARDIAN HOUSE')+'</small><b>'+E(name)+'</b><span>'+E(stage)+' • Bond '+Math.round(Number(p.bond)||0)+'</span></div>'+
    '</article>';
  }).join('');
}
function sanctuary(){
  try{
    const html=typeof phase4SanctuaryHTML==='function'?phase4SanctuaryHTML():'';
    return '<section class="v3317HomeSanctuary v3327CampusSanctuary"><div class="v3327SanctuaryTitle"><div><small>LIVING CAMPUS</small><h3>Guardian Sanctuary</h3><p>Your companions grow beside your coursework—rest, bond, customize, then return to your studies.</p></div><button class="v3327TextBtn" onclick="navigate(\'companions\')">Open Guardian House →</button></div>'+html+'</section>';
  }catch(_){return ''}
}
function magicalHomeHTML(){
  const a=academic(),acct=account(),pets=guardians();
  const answers=(a.p?.answers||[]).length;
  const status=a.mastery?.status||'Not Started';
  const target=a.mastery?.targetRigor||1;
  const sectionPct=a.sectionProgress?.pct||0;
  const sectionTitle=a.section?.title||'Course Path';
  const lessonTitle=a.lesson?.title||'Choose your next lesson';
  const recent=Math.round(Number(a.st?.acc||0)*100);
  const readiness=Math.max(0,Math.min(100,Number(a.st?.readiness||0)));
  const streak=(()=>{try{return dayStreak()}catch(_){return Number(a.p?.streak||0)}})();
  const lessonNo=a.lesson?.review?'SECTION REVIEW':a.lesson?.number?('LESSON '+a.lesson.number):'CURRENT LESSON';

  return '<div class="v3327Home">'+
    '<section class="v3327PortalHero">'+
      '<div class="v3327Constellation" aria-hidden="true"><i>✦</i><i>☾</i><i>✧</i><i>✦</i><i>⋆</i></div>'+
      '<div class="v3327HeroCopy"><span class="v3327Eyebrow">MOONLIT COLLEGIUM • STUDENT ARCANA PORTAL</span><h2>'+E(a.id)+' • '+E(a.c.title)+'</h2><p>Your coursework and Guardian magic belong to the same world. Study the lesson, strengthen your mastery, earn Moon Crystals, and grow your Guardian House.</p><div class="v3327HeroActions"><button class="v3327Primary" onclick="v3327OpenTutor()">✦ Enter Course Tutor</button><button onclick="navigate(\'mission\')">Study Now</button><button onclick="navigate(\'grimoire\')">Living Grimoire</button><button onclick="navigate(\'addmaterial\')">Add Course Notes</button></div></div>'+
      '<div class="v3327RegistrarSeal"><span>☾</span><small>ARCANE REGISTRAR</small><b>'+E(a.id)+'</b><em>'+sectionPct+'% section progress</em></div>'+
    '</section>'+

    '<div class="v3327HallGrid">'+
      '<section class="v3327Hall v3327AcademicHall"><header><div><small>ACADEMIC HALL</small><h3>Your Current Learning Path</h3></div><span class="v3327Status '+E(status.toLowerCase().replace(/\s+/g,'-'))+'">'+E(status)+'</span></header>'+
        '<div class="v3327CourseScroll"><small>'+E(sectionTitle)+'</small><h2>'+E(lessonTitle)+'</h2><p>'+E(nextAcademicText(a))+'</p></div>'+
        paceCard(a)+
        '<div class="v3327AcademicMetrics"><div><b>'+readiness+'%</b><span>OA readiness</span></div><div><b>'+recent+'%</b><span>recent accuracy</span></div><div><b>R'+target+'</b><span>next rigor</span></div><div><b>'+answers+'</b><span>course answers</span></div></div>'+
        '<div class="v3327SectionProgress"><div><span>'+E(lessonNo)+'</span><b>'+sectionPct+'%</b></div><i><em style="width:'+sectionPct+'%"></em></i></div>'+
        '<div class="v3327Ritual"><small>TODAY’S ACADEMIC RITUAL</small><ol><li>Open the current Tutor chapter.</li><li>Read until you can explain the key idea without looking.</li><li>Complete adaptive practice at R'+target+'.</li><li>Repair any concept that drops into Needs Review.</li></ol></div>'+
      '</section>'+

      '<section class="v3327Hall v3327GuardianHall"><header><div><small>GUARDIAN HOUSE</small><h3>Your Magical Campus Life</h3></div><button class="v3327TextBtn" onclick="navigate(\'companions\')">Care & bond →</button></header>'+
        '<div class="v3327GuardianGrid">'+guardianCards()+'</div>'+
        '<div class="v3327AccountRecord"><div><span>✦</span><b>'+Math.round(Number(acct.xp)||0)+'</b><small>Majick XP</small></div><div><span>◆</span><b>'+Math.round(Number(acct.crystals)||0)+'</b><small>Moon Crystals</small></div><div><span>☾</span><b>'+streak+'</b><small>day streak</small></div><div><span>✧</span><b>'+pets.length+'</b><small>hatched Guardians</small></div></div>'+
        '<div class="v3327HouseMessage">Academic progress fuels the magical side of campus. Study success earns the resources that care for, evolve, and personalize your Guardian House.</div>'+
      '</section>'+
    '</div>'+

    sanctuary()+

    '<section class="v3327StudentRecord"><div class="v3327RecordHead"><div><small>ARCANE STUDENT RECORD</small><h3>Course progress and Majick progress are tracked separately</h3></div><span>'+E(a.id)+' • '+E(status)+'</span></div><div class="v3327RecordGrid">'+
      '<article><small>ACADEMIC RECORD</small><b>'+readiness+'% OA readiness</b><p>'+answers+' answered questions • '+recent+'% recent accuracy • '+sectionPct+'% through this section</p></article>'+
      '<article><small>MAJICK RECORD</small><b>'+Math.round(Number(acct.xp)||0)+' XP • '+Math.round(Number(acct.crystals)||0)+' crystals</b><p>'+pets.length+' Guardians • '+streak+' day study streak • shared across every course</p></article>'+
      '<article><small>QUICK HALLS</small><div class="v3327QuickLinks"><button onclick="navigate(\'learninglab\')">Course Path</button><button onclick="navigate(\'guide\')">Study Guide</button><button onclick="navigate(\'analytics\')">Analytics</button><button onclick="navigate(\'vault\')">Magic Vault</button></div></article>'+
    '</div></section>'+
  '</div>';
}

window.v3327MagicalHomeHTML=magicalHomeHTML;
try{window.homeHTML=magicalHomeHTML}catch(_){}
const previousScreenHTML=window.screenHTML;
if(typeof previousScreenHTML==='function'&&!previousScreenHTML.__v3327MoonlitHome){
  const moonlitScreenHTML=function(){
    if(window.S?.screen==='home')return magicalHomeHTML();
    return previousScreenHTML.apply(this,arguments);
  };
  moonlitScreenHTML.__v3327MoonlitHome=true;
  window.screenHTML=moonlitScreenHTML;
}
window.MajickCollegeDashboard={VERSION,academic,coursePace,paceCard,magicalHomeHTML};
// The authoritative app runtime performs its first render before this overlay loads.
// Re-render home once so Moonlit Collegium is the first screen, not a second-visit upgrade.
if(window.S?.screen==='control'){
  window.S.screen='home';
  try{window.save?.()}catch(_){}
}
if(window.S?.screen==='home')setTimeout(()=>{
  if(!document.querySelector('.v3327Home'))try{window.render?.()}catch(e){console.warn('Moonlit Collegium first render',e)}
},0);
})();
