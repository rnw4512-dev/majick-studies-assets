(function(){
'use strict';
const PASS_XP=500;
const COURSE_PACE={minWeeks:4,targetWeeks:5,maxWeeks:6};
const SHARED=['xp','crystals','chests'];
const COURSE_CATALOG={
  D755:{
    id:'D755',
    title:'Assessment for Special Education',
    version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  },
  D772:{
    id:'D772',
    title:'Statistical Data Literacy',
    version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  },
  D669:window.MajickCourseSources.D669,
  D756:{
    id:'D756',
    title:'IEP Collaboration and Communication',
    version:'majick-d756-2026-11',
    concepts:[
      {id:'d756-s1-collaboration',title:'Collaboration and Communication',section:'Section 1',priority:'core'},
      {id:'d756-s2-resources',title:'Collaboration and Resources',section:'Section 2',priority:'core'}
    ],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['d756-s1-collaboration','d756-s2-resources']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  }
};
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};
const clone=x=>{try{return JSON.parse(JSON.stringify(x))}catch(_){return x}};

function blankProgress(){
  if(window.MajickStateCore?.blankProgress)return window.MajickStateCore.blankProgress();
  return {
    answers:[],explanations:[],repair:[],spacedQueue:[],charms:[],cosmetics:[],
    questionMemory:[],sessionHistory:[],masteryRewarded:[],helpHistory:[],familyMemory:[],
    urgentRepair:[],v5SessionHistory:[],errorTags:[],strategyHistory:[],
    distractorHistory:{},flaggedQuestions:{},masteryProofs:{},sourceCoverage:{},
    questionExposure:{},aiCache:{},
    streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,chests:0,bestCombo:0,
    aiGeneratedCount:0,petAbilityUses:0,eliminationWins:0,voicePractices:0,
    dailyClaimed:'',weeklyClaimed:'',
    inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0}
  };
}
function normalizeProgressRow(row,cid=''){
  if(window.MajickStateCore?.normalizeProgressRow){
    return window.MajickStateCore.normalizeProgressRow(row,cid);
  }
  const p=(row&&typeof row==='object'&&!Array.isArray(row))?row:blankProgress();
  const arrays=[
    'answers','explanations','repair','spacedQueue','charms','cosmetics',
    'questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory',
    'urgentRepair','v5SessionHistory','errorTags','strategyHistory'
  ];
  for(const key of arrays)p[key]=Array.isArray(p[key])?p[key]:[];
  const objects=['distractorHistory','flaggedQuestions','masteryProofs','sourceCoverage','questionExposure','aiCache'];
  for(const key of objects)p[key]=(p[key]&&typeof p[key]==='object'&&!Array.isArray(p[key]))?p[key]:{};
  p.inventory=(p.inventory&&typeof p.inventory==='object'&&!Array.isArray(p.inventory))
    ?Object.assign({streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},p.inventory)
    :{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  for(const key of ['streak','bossWins','bestCombo','aiGeneratedCount','petAbilityUses','eliminationWins','voicePractices']){
    p[key]=Number(p[key]||0);
  }
  for(const key of SHARED)p[key]=Number(p[key]||0);
  p.lastDay=typeof p.lastDay==='string'?p.lastDay:'';
  p.dailyClaimed=typeof p.dailyClaimed==='string'?p.dailyClaimed:'';
  p.weeklyClaimed=typeof p.weeklyClaimed==='string'?p.weeklyClaimed:'';
  if(cid)p.courseId=cid;
  return p;
}
function normalizeAllProgress(){
  if(!window.S)return;
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
  for(const [cid,row] of Object.entries(S.progress)){
    S.progress[cid]=normalizeProgressRow(row,cid);
  }
  for(const cid of Object.keys(S.courses||{})){
    S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
  }
}
function activeProgress(){
  if(!window.S)return null;
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
  const cid=S.activeCourse;
  if(!cid)return null;
  S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
  return S.progress[cid];
}
function mergeUniqueRows(a,b){
  const out=[],seen=new Set();
  for(const row of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){
    const key=String(row?.id||row?.qid||JSON.stringify(row));
    if(seen.has(key))continue;
    seen.add(key);out.push(row);
  }
  return out;
}
function migrateLegacyAssessmentCourse(){
  if(!window.S)return;
  const legacyId='PMFC',targetId='D755';
  const legacyCourse=S.courses?.[legacyId];
  const existingCourse=S.courses?.[targetId];

  if(legacyCourse){
    if(!existingCourse){
      S.courses[targetId]=legacyCourse;
    }else{
      existingCourse.questionBank=mergeUniqueRows(legacyCourse.questionBank,existingCourse.questionBank);
      existingCourse.concepts=mergeUniqueRows(legacyCourse.concepts,existingCourse.concepts);
      existingCourse.misconceptionCatalog=mergeUniqueRows(legacyCourse.misconceptionCatalog,existingCourse.misconceptionCatalog);
      existingCourse.studySections=mergeUniqueRows(legacyCourse.studySections,existingCourse.studySections);
      existingCourse.sources=mergeUniqueRows(legacyCourse.sources,existingCourse.sources);
      existingCourse.glossary=Object.assign({},legacyCourse.glossary||{},existingCourse.glossary||{});
    }
    S.courses[targetId].id=targetId;
    S.courses[targetId].title='Assessment for Special Education';
    S.courses[targetId].catalogSeed=false;
    delete S.courses[legacyId];
  }

  if(S.progress?.[legacyId]){
    if(!S.progress[targetId])S.progress[targetId]=S.progress[legacyId];
    else{
      const target=S.progress[targetId],legacy=S.progress[legacyId];
      for(const key of ['answers','explanations','repair','spacedQueue','charms','cosmetics','questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory','urgentRepair','v5SessionHistory','errorTags','strategyHistory']){
        target[key]=mergeUniqueRows(legacy[key],target[key]);
      }
      target.streak=Math.max(Number(target.streak||0),Number(legacy.streak||0));
      target.lastDay=target.lastDay||legacy.lastDay||'';
    }
    delete S.progress[legacyId];
  }

  S.majickCourseRecords=S.majickCourseRecords||{};
  if(S.majickCourseRecords[legacyId]){
    if(!S.majickCourseRecords[targetId])S.majickCourseRecords[targetId]=S.majickCourseRecords[legacyId];
    S.majickCourseRecords[targetId].courseId=targetId;
    S.majickCourseRecords[targetId].title='Assessment for Special Education';
    delete S.majickCourseRecords[legacyId];
  }

  S.majickCourseUI=S.majickCourseUI||{};
  if(S.majickCourseUI[legacyId]&&!S.majickCourseUI[targetId])S.majickCourseUI[targetId]=S.majickCourseUI[legacyId];
  delete S.majickCourseUI[legacyId];

  if(S.activeCourse===legacyId)S.activeCourse=targetId;
}

function ensure(){
  if(!window.S)return;
  S.courses=(S.courses&&typeof S.courses==='object'&&!Array.isArray(S.courses))?S.courses:{};
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};

  migrateLegacyAssessmentCourse();

  // Seed official courses without replacing an existing learner-owned version
  // and without changing the user's active class.
  for(const [cid,template] of Object.entries(COURSE_CATALOG)){
    if(!S.courses[cid])S.courses[cid]=clone(template);
  }
  // Earlier D669 starters may already exist in local storage. Add only the
  // missing official outline sections; keep learner notes and progress intact.
  const d669=S.courses.D669;
  if(d669){
    const template=COURSE_CATALOG.D669;
    d669.studySections=Array.isArray(d669.studySections)?d669.studySections:[];
    const existing=new Set(d669.studySections.map(row=>String(row?.id||'')));
    for(const section of template.studySections){
      if(!existing.has(section.id))d669.studySections.push(clone(section));
    }
    d669.concepts=mergeUniqueRows(d669.concepts,template.concepts);
    d669.sources=mergeUniqueRows(d669.sources,template.sources);
    d669.questionBank=mergeUniqueRows(d669.questionBank,template.questionBank);
    d669.glossary=Object.assign({},template.glossary,d669.glossary||{});
    const sectionTwo=d669.studySections.find(row=>row?.id==='d669-section-2');
    const sectionTwoSeed=template.studySections.find(row=>row?.id==='d669-section-2');
    if(sectionTwo&&sectionTwoSeed){
      sectionTwo.title=sectionTwoSeed.title;
      sectionTwo.learningObjective=sectionTwo.learningObjective||sectionTwoSeed.learningObjective;
      sectionTwo.lessons=Array.isArray(sectionTwo.lessons)?sectionTwo.lessons:[];
      for(const lesson of sectionTwoSeed.lessons){
        const prior=sectionTwo.lessons.find(row=>row?.title===lesson.title);
        if(!prior)sectionTwo.lessons.push(clone(lesson));
        else if(lesson.title==='Lesson 2: Five Pillars of Literacy'){
          prior.learningObjective=lesson.learningObjective;
          prior.summary=lesson.summary;
          prior.status=lesson.status;
          prior.topics=mergeUniqueRows(prior.topics,lesson.topics);
          prior.sublessons=Array.isArray(prior.sublessons)?prior.sublessons:[];
          for(const sub of lesson.sublessons||[]){
            const current=prior.sublessons.find(row=>row?.id===sub.id);
            if(!current)prior.sublessons.push(clone(sub));
            else Object.assign(current,clone(sub));
          }
        }
      }
      sectionTwo.practice=Array.isArray(sectionTwo.practice)?sectionTwo.practice:[];
      for(const row of sectionTwoSeed.practice){
        if(!sectionTwo.practice.some(saved=>saved?.question===row.question))sectionTwo.practice.push(clone(row));
      }
    }
    const sectionOne=d669.studySections.find(row=>row?.id==='d669-section-1');
    if(sectionOne){
      sectionOne.rows=Array.isArray(sectionOne.rows)?sectionOne.rows:[];
      const present=new Set(sectionOne.rows.map(row=>String(row?.[0]||'')));
      for(const row of template.studySections[0].rows){
        if(!present.has(row[0]))sectionOne.rows.push(clone(row));
      }
      if(!sectionOne.summary||sectionOne.summary.startsWith('Lesson 1.1:')||sectionOne.summary.startsWith('Lessons 1.1–')||sectionOne.summary.startsWith('Lesson 1:')||sectionOne.summary.startsWith('Lessons 1–2.1:')) sectionOne.summary=template.studySections[0].summary;
      sectionOne.visual=sectionOne.visual||clone(template.studySections[0].visual);
      sectionOne.links=mergeUniqueRows(sectionOne.links,template.studySections[0].links);
      sectionOne.concepts=mergeUniqueRows(sectionOne.concepts,template.studySections[0].concepts);
      sectionOne.lessons=Array.isArray(sectionOne.lessons)?sectionOne.lessons:[];
      const first=sectionOne.lessons.find(row=>row?.title==='Lesson 1: Standards Alignment for Literacy');
      if(first){
        first.sublessons=Array.isArray(first.sublessons)?first.sublessons:[];
        for(const sublesson of template.studySections[0].lessons[0].sublessons){
          if(!first.sublessons.some(row=>row?.id===sublesson.id))first.sublessons.push(clone(sublesson));
        }
      }
      const second=sectionOne.lessons.find(row=>row?.title==='Lesson 2: Literacy-Rich Classroom Environments');
      if(second){
        second.learningObjective=second.learningObjective||template.studySections[0].lessons[1].learningObjective;
        second.sublessons=Array.isArray(second.sublessons)?second.sublessons:[];
        for(const sublesson of template.studySections[0].lessons[1].sublessons){
          if(!second.sublessons.some(row=>row?.id===sublesson.id))second.sublessons.push(clone(sublesson));
        }
      }
    }
    // Reconcile all supplied lesson content, including existing local courses.
    // Preserve learner-authored fields and never modify recorded attempts here.
    for(const seedSection of template.studySections){
      const savedSection=d669.studySections.find(x=>x?.id===seedSection.id);
      if(!savedSection||!Array.isArray(seedSection.lessons))continue;
      savedSection.lessons=Array.isArray(savedSection.lessons)?savedSection.lessons:[];
      for(const seedLesson of seedSection.lessons){
        const savedLesson=savedSection.lessons.find(x=>x?.title===seedLesson.title);
        if(!savedLesson){savedSection.lessons.push(clone(seedLesson));continue;}
        for(const [k,v] of Object.entries(seedLesson)){
          if(k==='sublessons')continue;
          if(savedLesson[k]==null||k==='status')savedLesson[k]=clone(v);
        }
        if(!Array.isArray(seedLesson.sublessons))continue;
        savedLesson.sublessons=Array.isArray(savedLesson.sublessons)?savedLesson.sublessons:[];
        for(const seedSub of seedLesson.sublessons){
          const savedSub=savedLesson.sublessons.find(x=>x?.id===seedSub.id);
          if(!savedSub)savedLesson.sublessons.push(clone(seedSub));
          else for(const [k,v] of Object.entries(seedSub))if(savedSub[k]==null)savedSub[k]=clone(v);
        }
      }
    }
    // Canonical source order: reorder existing objects, never replace progress records.
    const bySource=(rows,seed,key)=>{
      if(!Array.isArray(rows)||!Array.isArray(seed))return;
      const rank=new Map(seed.map((row,i)=>[key(row),i]));
      const unknown=Number.MAX_SAFE_INTEGER;
      rows.sort((a,b)=>(rank.get(key(a))??unknown)-(rank.get(key(b))??unknown));
    };
    bySource(d669.studySections,template.studySections,row=>row?.id);
    bySource(d669.concepts,template.concepts,row=>row?.id);
    for(const section of d669.studySections){
      const seed=template.studySections.find(row=>row.id===section.id);
      if(!seed)continue;
      bySource(section.lessons,seed.lessons,row=>row?.title);
      for(const lesson of section.lessons||[]){
        const seedLesson=seed.lessons?.find(row=>row.title===lesson.title);
        if(seedLesson)bySource(lesson.sublessons,seedLesson.sublessons,row=>row?.id);
      }
    }
    if(!d669.preassessmentProfile?.priorityConcepts?.length){
      d669.preassessmentProfile=clone(template.preassessmentProfile);
    }
  }
  if(!S.courses?.[S.activeCourse]){
    S.activeCourse=S.courses?.D755?'D755':Object.keys(S.courses||{})[0]||'D755';
  }
  normalizeAllProgress();
  S.majickCourseRecords=S.majickCourseRecords||{};
  S.majickCourseUI=S.majickCourseUI||{};
  if(!S.majickAccount){
    const p=activeProgress()||{};
    S.majickAccount={
      xp:Number(p.xp||0),crystals:Number(p.crystals||0),chests:Number(p.chests||0),
      createdAt:new Date().toISOString(),schemaVersion:1
    };
  }
  for(const [cid,c] of Object.entries(S.courses)){
    const p=S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
    p.courseId=cid;
    if(!p.__majickSharedReady){
      for(const k of SHARED)p[k]=Number(S.majickAccount[k]||0);
      p.__majickSharedReady=true;
    }
    S.majickCourseRecords[cid]=S.majickCourseRecords[cid]||{
      courseId:cid,
      title:c?.title||cid,
      status:c?.catalogSeed?'available':'active',
      startedAt:c?.catalogSeed?null:new Date().toISOString(),
      passedAt:null,
      completionXp:0,
      paceMinWeeks:COURSE_PACE.minWeeks,
      paceTargetWeeks:COURSE_PACE.targetWeeks,
      paceMaxWeeks:COURSE_PACE.maxWeeks
    };
    const paceRecord=S.majickCourseRecords[cid];
    paceRecord.paceMinWeeks=Math.max(1,Number(paceRecord.paceMinWeeks||COURSE_PACE.minWeeks));
    paceRecord.paceTargetWeeks=Math.max(paceRecord.paceMinWeeks,Number(paceRecord.paceTargetWeeks||COURSE_PACE.targetWeeks));
    paceRecord.paceMaxWeeks=Math.max(paceRecord.paceTargetWeeks,Number(paceRecord.paceMaxWeeks||COURSE_PACE.maxWeeks));
  }
}
function captureAccount(){
  ensure();
  const p=activeProgress();if(!p)return;
  for(const k of SHARED){
    const incoming=Number(p[k]??S.majickAccount[k]??0);
    if(k==='xp'){
      const current=Number(S.majickAccount?.xp||0);
      const high=Number(S.majickAccount?.xpHighWater||S.majickAccount?.lifetimeXpHighWater||0);
      S.majickAccount.xp=Math.max(current,high,Number.isFinite(incoming)?incoming:0);
      S.majickAccount.xpHighWater=Math.max(high,S.majickAccount.xp);
      S.majickAccount.lifetimeXpHighWater=S.majickAccount.xpHighWater;
    }else{
      S.majickAccount[k]=Number.isFinite(incoming)?incoming:Number(S.majickAccount[k]||0);
    }
  }
}
function mirrorAccount(){
  ensure();
  for(const [cid,row] of Object.entries(S.progress||{})){
    const p=S.progress[cid]=normalizeProgressRow(row,cid);
    for(const k of SHARED)p[k]=Number(S.majickAccount?.[k]||0);
    p.__majickSharedReady=true;
  }
}
function saveCourseUI(cid){
  if(!cid)return;
  ensure();
  S.majickCourseUI[cid]={
    grimoire:clone(S.v3311?.grimoire||{page:0,bookmarks:[],notes:{},remember:{},search:''}),
    grimoirePage:Number(S.v3311Page||0)
  };
}
function restoreCourseUI(cid){
  ensure();
  const ui=S.majickCourseUI[cid]||{grimoire:{page:0,bookmarks:[],notes:{},remember:{},search:''},grimoirePage:0};
  S.v3311=S.v3311||{};
  S.v3311.grimoire=clone(ui.grimoire);
  S.v3311Page=Number(ui.grimoirePage||0);
}
const baseSave=window.save;
window.save=function(){
  ensure();
  captureAccount();
  mirrorAccount();
  saveCourseUI(S.activeCourse);
  return baseSave();
};

window.switchCourse=function(id){
  ensure();
  if(!S.courses?.[id])return;
  saveCourseUI(S.activeCourse);
  captureAccount();mirrorAccount();
  S.activeCourse=id;
  const record=S.majickCourseRecords?.[id];
  if(record?.status==='available'){
    record.status='active';
    record.startedAt=record.startedAt||new Date().toISOString();
  }
  S.progress[id]=S.progress[id]||blankProgress();
  for(const k of SHARED)S.progress[id][k]=Number(S.majickAccount[k]||0);
  S.progress[id].__majickSharedReady=true;
  restoreCourseUI(id);
  window.session=null;
  S.screen='home';
  window.save();
  window.render();
};

function createCourse(code,title){
  ensure();
  code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9-]/g,'').slice(0,24);
  title=String(title||'').trim();
  if(!code)throw new Error('Enter the WGU course code.');
  if(!title)throw new Error('Enter the course title.');
  if(S.courses[code])throw new Error(code+' is already in Majick Studies. Switch to that course instead.');
  S.courses[code]={
    id:code,title,version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true
  };
  S.progress[code]=blankProgress();
  for(const k of SHARED)S.progress[code][k]=Number(S.majickAccount[k]||0);
  S.progress[code].__majickSharedReady=true;
  S.majickCourseRecords[code]={
    courseId:code,title,status:'active',startedAt:new Date().toISOString(),
    passedAt:null,completionXp:0,
    paceMinWeeks:COURSE_PACE.minWeeks,
    paceTargetWeeks:COURSE_PACE.targetWeeks,
    paceMaxWeeks:COURSE_PACE.maxWeeks
  };
  saveCourseUI(S.activeCourse);
  S.activeCourse=code;
  restoreCourseUI(code);
  S.screen='addmaterial';window.session=null;
  window.save();window.render();
  try{rewardToast('✦ New Course Started',code+' begins with a fresh 0-day class streak. Your Majick XP stays with you.')}catch(_){}
}
function passCourse(){
  ensure();
  const cid=S.activeCourse,c=S.courses?.[cid],r=S.majickCourseRecords?.[cid];
  if(!c||!r)return;
  if(r.status==='passed'){celebratePass(c,r,false);return;}
  if(!confirm('Mark '+cid+' • '+c.title+' as passed? This keeps its course record and awards '+PASS_XP+' Majick XP.'))return;
  captureAccount();
  S.majickAccount.xp=Number(S.majickAccount.xp||0)+PASS_XP;
  r.status='passed';r.passedAt=new Date().toISOString();r.completionXp=PASS_XP;
  const p=S.progress[cid]||(S.progress[cid]=blankProgress());
  p.completed=true;p.completedAt=r.passedAt;
  mirrorAccount();
  window.save();
  celebratePass(c,r,true);
  document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{type:'course',course:cid,key:'course-pass:'+cid,verified:true}}));
  window.render();
}
function celebratePass(c,r,newAward){
  try{rewardToast('🎓 Course Passed!',c.id+' completed'+(newAward?' • +'+PASS_XP+' XP':''));}catch(_){}
  const old=document.querySelector('.v3316PassOverlay');if(old)old.remove();
  const d=document.createElement('div');d.className='v3316PassOverlay';
  d.innerHTML='<div class="v3316PassCard"><div class="v3316PassSigil">✦</div><div class="eyebrow">COURSE COMPLETE</div><h2>You passed '+E(c.id)+'!</h2><h3>'+E(c.title)+'</h3><p>'+ (newAward?'+'+PASS_XP+' Majick XP has been added to your overall experience. ':'') +'This class keeps its own history. Your next class starts a brand-new streak.</p><div class="v3316PassActions"><button class="btn primary" id="v3316NewAfterPass">Start My Next Class</button><button class="btn ghost" id="v3316ClosePass">Keep Celebrating</button></div></div>';
  document.body.appendChild(d);
  d.querySelector('#v3316ClosePass')?.addEventListener('click',()=>d.remove());
  d.querySelector('#v3316NewAfterPass')?.addEventListener('click',()=>{d.remove();navigate('addmaterial')});
}
function record(cid){ensure();return S.majickCourseRecords?.[cid]||null}
function currentStatus(){
  ensure();const cid=S.activeCourse,c=S.courses?.[cid],p=S.progress?.[cid]||blankProgress(),r=record(cid);
  return {courseId:cid,title:c?.title||cid,status:r?.status||'active',streak:Number(p.streak||0),answers:(p.answers||[]).length,passedAt:r?.passedAt||null};
}
function panelHTML(){
  const x=currentStatus();
  return '<section class="v3316CourseCenter">'+
    '<div class="v3316CourseHead"><div><div class="eyebrow">COURSE CENTER • SEPARATE CLASSES</div><h2>'+E(x.courseId)+' • '+E(x.title)+'</h2><p>Each class keeps its own notes, questions, mistakes, mastery, readiness, and streak. Majick XP and Guardian growth belong to you and travel forward.</p></div><span class="v3316CourseStatus '+(x.status==='passed'?'passed':'')+'">'+(x.status==='passed'?'✓ PASSED':'CURRENT CLASS')+'</span></div>'+
    '<div class="v3316CourseStats"><span><b>'+x.streak+'</b> class streak</span><span><b>'+x.answers+'</b> answers in this class</span><span><b>'+Number(S.majickAccount?.xp||0)+'</b> overall Majick XP</span></div>'+
    '<div class="v3316CourseActions"><button class="btn '+(x.status==='passed'?'good':'violet')+'" id="v3316PassCourse" '+(x.status==='passed'?'disabled':'')+'>'+(x.status==='passed'?'✓ Course Passed':'🎓 I Passed This Course')+'</button></div>'+
    '<details class="v3316NewCourse"><summary>＋ Add / Start a New WGU Course</summary><div class="v3316NewCourseGrid"><label>Course code<input id="v3316CourseCode" placeholder="D772"></label><label>Course title<input id="v3316CourseTitle" placeholder="Statistical Data Literacy"></label><button class="btn primary" id="v3316CreateCourse">Create Course & Start Fresh Streak</button></div><p class="v3316CourseNote">Creating a course starts its academic record at zero. Your overall experience and Guardians remain with you.</p></details>'+
  '</section>';
}
function bindPanel(){
  document.getElementById('v3316PassCourse')?.addEventListener('click',passCourse);
  document.getElementById('v3316CreateCourse')?.addEventListener('click',()=>{
    try{createCourse(document.getElementById('v3316CourseCode')?.value,document.getElementById('v3316CourseTitle')?.value)}
    catch(e){alert(e.message)}
  });
}
function decorateSelector(){
  ensure();
  const sel=document.querySelector('.courseSelect');if(!sel)return;

  // The shell may have been rendered from an older course list. Reconcile the
  // selector with the authoritative course registry every time it appears.
  for(const [cid,c] of Object.entries(S.courses||{})){
    let option=[...sel.options].find(o=>o.value===cid);
    if(!option){
      option=document.createElement('option');
      option.value=cid;
      sel.appendChild(option);
    }
    const r=S.majickCourseRecords?.[cid];
    const prefix=r?.status==='passed'?'✓ ':r?.status==='available'?'＋ ':'';
    option.textContent=prefix+cid+' • '+(c?.title||cid);
    option.selected=cid===S.activeCourse;
  }
}

ensure();mirrorAccount();
// Reconcile the already-rendered dropdown now and after every subsequent render.
// No course progress or reward data is changed by this view-only synchronization.
const previousCourseSelectorRender=window.render;
if(typeof previousCourseSelectorRender==='function'){
  window.render=function(){
    const result=previousCourseSelectorRender.apply(this,arguments);
    decorateSelector();
    return result;
  };
}
decorateSelector();

async function migrateLegacyMaterialSources(){
  try{
    if(!window.MajickMaterialStore?.migrateCourseId)return;
    const result=await window.MajickMaterialStore.migrateCourseId('PMFC','D755');
    if(result?.migrated){
      const d755=S.courses?.D755;
      if(d755)await window.MajickMaterialStore.syncQuestions(d755,'D755');
      try{window.save()}catch(_){}
    }
  }catch(e){console.warn('Majick D755 Notes Forge migration',e)}
}
migrateLegacyMaterialSources();

const materialPage=window.AddStudyMaterialPage;
const oldMaterialRender=materialPage?.render;
const oldMaterialBind=materialPage?.bind;
if(materialPage&&typeof oldMaterialRender==='function'){
  materialPage.render=function(){return panelHTML()+oldMaterialRender.call(materialPage)};
  materialPage.bind=function(){
    if(typeof oldMaterialBind==='function')oldMaterialBind.call(materialPage);
    bindPanel();
  };
  window.v3315BindStudyMaterialPage=materialPage.bind;
}
window.MajickCourseManager={COURSE_PACE,ensure,captureAccount,mirrorAccount,normalizeProgressRow,normalizeAllProgress,migrateLegacyAssessmentCourse,migrateLegacyMaterialSources,createCourse,passCourse,currentStatus,panelHTML,bindPanel,decorateSelector,record,PASS_XP,COURSE_CATALOG};
})();
