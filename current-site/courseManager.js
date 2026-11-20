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
  D669:{
    id:'D669',
    title:'Early Literacy Methods',
    version:'majick-d669-2026-11',
    concepts:[
      {id:'d669-s1-standards',title:'Standards and Resources in Literacy',section:'Section 1',priority:'core'},
      {id:'d669-s2-reading',title:'Foundations of Reading',section:'Section 2',priority:'core'},
      {id:'d669-s3-communication',title:'Elements of Literacy',section:'Section 3',priority:'core'},
      {id:'d669-s4-genres',title:'Features of Text Across Genres',section:'Section 4',priority:'core'},
      {id:'d669-s5-writing',title:'Concepts and Structures in Writing',section:'Section 5',priority:'core'}
    ],
    glossary:{
      literacy:'The ability to read, write, understand and use information to communicate and participate in society.',
      'reading brain':'A network of brain regions working together to connect written words, spoken language and meaning.',
      'systematic instruction':'Teaching skills in a planned sequence, building from easier concepts to more complex ones.',
      'explicit instruction':'Direct explanation and modeling followed by guided practice, feedback and independent application.'
    },
    questionBank:[
      {id:'d669-s1-l1-dyslexia-myth',topicId:'d669-s1-standards',section:'Section 1',prompt:'True or false: Dyslexia is a visual problem in which people see letters and words backward.',options:['True','False'],answer:'False',why:'Dyslexia is not explained by seeing letters backward. Reading instruction should teach sound–letter connections explicitly and systematically.',source:'User-provided D669 Lesson 1.1 guided practice'},
      {id:'d669-s1-l1-discovery',topicId:'d669-s1-standards',section:'Section 1',prompt:'True or false: Discovery learning alone is the most effective way to teach beginning reading.',options:['True','False'],answer:'False',why:'Foundational skills benefit from systematic, explicit instruction with modeling, guided practice and feedback.',source:'User-provided D669 Lesson 1.1 guided practice'}
    ],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['d669-s1-standards','d669-s2-reading','d669-s3-communication','d669-s4-genres','d669-s5-writing']},
    studySections:[
      {id:'d669-section-1',title:'Section 1: Analyzes Standards and Resources in Literacy',competency:'2068.1.1',
       lessons:[
         {title:'Lesson 1: Standards Alignment for Literacy',topics:['1.1 Introduction to Literacy Education','1.2 Instructional Considerations and Structured Literacy','1.3 Literacy Standards','1.4 Standards Across the School Year'],
          sublessons:[{id:'d669-s1-l1-1',title:'Lesson 1.1: Introduction to Literacy Education',
           keyIdeas:['Literacy has shaped access to knowledge and participation in society; printing expanded access to written material.','Whole language emphasizes meaning and context. Balanced literacy combines some phonics with meaningful texts. Structured literacy explicitly and systematically teaches foundational skills and language structure.','Dyslexia is not a visual reversal problem or a lack of effort. Teach phonemic awareness and phonics directly, with a planned sequence and feedback.','Reading involves coordinated visual, language, sound, speech and motor processes; no single brain region teaches a child to read.'],
           reflection:['How was I taught to read?','Which assumptions about literacy instruction should I reconsider?'],
           visual:{src:'https://assets.wgu.edu/25076e90e604c9e34a82a472f0912c55',alt:'WGU Reading Brain figure with frontal, temporal, parietal and occipital lobes, Broca’s area, planum temporale and cerebellum.'},
           references:['WGU D669 Lesson 1.1, user-provided text','Hiebert (2023), Thinking Through Research and the Science of Reading','Hougen and Smartt (2012), Fundamentals of Literacy Instruction and Assessment, Chapter 1','Schwartz (2023), How Reading Policy Evolved in 2023 and What’s Ahead']}]},
         {title:'Lesson 2: Literacy-Rich Classroom Environments',topics:['2.1 Literacy-Rich Classrooms','2.2 Multisensory Activities']}
       ],
       learningObjective:'Analyze reading instruction for alignment to a given content standard.',
       summary:'Lesson 1.1: literacy history, research-based instruction, dyslexia myths and the reading brain.',
       concepts:['d669-s1-standards'],
       rows:[
         ['History of literacy','Reading and writing have shaped access to learning, information and civic participation. The printing press expanded access to books.','Reflect: Who had access to literacy, and how did that access change?'],
         ['Rethinking assumptions','Reading is learned through instruction that connects spoken language, print and meaning. Literacy also includes interpreting digital and visual information.','Your experience as a reader may differ from what current research recommends for beginners.'],
         ['Whole language and balanced literacy','Whole language stresses meaning and context. Balanced literacy mixes phonics with meaningful reading; the amount and sequence of explicit phonics can vary.','Compare these approaches with a clearly sequenced, explicit foundational-skills lesson.'],
         ['Structured literacy','Teach phonemic awareness, decoding, encoding and language structure through an explicit, systematic sequence with modeling, practice and feedback.','Phonology, orthography, morphology, syntax, semantics and discourse all contribute to reading.'],
         ['Dyslexia','Dyslexia is not caused by seeing letters backward or by a child failing to try. Explicit and systematic foundational reading instruction supports students with dyslexia.','Do not treat a visual reversal myth as a diagnosis.'],
         ['The reading brain','Visual processing, sound–letter mapping, speech and language comprehension work together. The WGU figure labels the frontal, temporal, parietal and occipital lobes, Broca’s area, planum temporale and cerebellum.','The figure is a learning aid; avoid assigning an entire reading skill to one lobe.'],
         ['Reflect','How was I taught to read? Which beliefs about literacy instruction might I need to reconsider?','Use the two guided true-or-false questions to check the dyslexia and discovery-learning myths.']
       ],
       visual:{src:'https://assets.wgu.edu/25076e90e604c9e34a82a472f0912c55',alt:'WGU Reading Brain figure, showing labeled left-hemisphere regions associated with language and reading.'},
       practice:[
         {question:'What is a key component of structured literacy instruction?',answer:'Integrating explicit, systematic teaching of decoding and encoding skills.'},
         {question:'How do standards help teachers keep lessons consistent throughout the school year?',answer:'By giving teachers a clear guide on what to teach and when.'}
       ]},
      {id:'d669-section-2',title:'Section 2: Foundations of Reading',competency:'2068.1.2'},
      {id:'d669-section-3',title:'Section 3: Analyzes Elements of Literacy',competency:'2068.1.3'},
      {id:'d669-section-4',title:'Section 4: Describes Key Features of Texts Across Genres',competency:'2068.1.4'},
      {id:'d669-section-5',title:'Section 5: Analyzes Concepts and Structures in Writing',competency:'2068.1.5'}
    ],
    sources:[{title:'WGU D669 course introduction and Section 1 materials',type:'user-provided',assessment:'objective'}],
    localGenerated:true,catalogSeed:true
  },
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
    const sectionOne=d669.studySections.find(row=>row?.id==='d669-section-1');
    if(sectionOne){
      sectionOne.rows=Array.isArray(sectionOne.rows)?sectionOne.rows:[];
      const present=new Set(sectionOne.rows.map(row=>String(row?.[0]||'')));
      for(const row of template.studySections[0].rows){
        if(!present.has(row[0]))sectionOne.rows.push(clone(row));
      }
      sectionOne.summary=sectionOne.summary||template.studySections[0].summary;
      sectionOne.visual=sectionOne.visual||clone(template.studySections[0].visual);
      sectionOne.concepts=mergeUniqueRows(sectionOne.concepts,template.studySections[0].concepts);
      sectionOne.lessons=Array.isArray(sectionOne.lessons)?sectionOne.lessons:[];
      const first=sectionOne.lessons.find(row=>row?.title==='Lesson 1: Standards Alignment for Literacy');
      if(first){
        first.sublessons=Array.isArray(first.sublessons)?first.sublessons:[];
        if(!first.sublessons.some(row=>row?.id==='d669-s1-l1-1'))first.sublessons.unshift(clone(template.studySections[0].lessons[0].sublessons[0]));
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
