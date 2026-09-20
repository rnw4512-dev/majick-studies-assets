(function(){
'use strict';
const PASS_XP=500;
const SHARED=['xp','crystals','chests'];
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};
const clone=x=>{try{return JSON.parse(JSON.stringify(x))}catch(_){return x}};

function blankProgress(){
  return {
    answers:[],explanations:[],repair:[],spacedQueue:[],streak:0,lastDay:'',
    bossWins:0,xp:0,crystals:0,charms:[],chests:0,
    inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},
    cosmetics:[],eliminationWins:0,voicePractices:0
  };
}
function normalizeProgressRow(row,cid=''){
  const p=(row&&typeof row==='object'&&!Array.isArray(row))?row:blankProgress();
  p.answers=Array.isArray(p.answers)?p.answers:[];
  p.explanations=Array.isArray(p.explanations)?p.explanations:[];
  p.repair=Array.isArray(p.repair)?p.repair:[];
  p.spacedQueue=Array.isArray(p.spacedQueue)?p.spacedQueue:[];
  p.charms=Array.isArray(p.charms)?p.charms:[];
  p.inventory=(p.inventory&&typeof p.inventory==='object'&&!Array.isArray(p.inventory))
    ?p.inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  p.streak=Number(p.streak||0);
  p.bossWins=Number(p.bossWins||0);
  p.xp=Number(p.xp||0);
  p.crystals=Number(p.crystals||0);
  p.chests=Number(p.chests||0);
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
function ensure(){
  if(!window.S)return;
  S.courses=(S.courses&&typeof S.courses==='object'&&!Array.isArray(S.courses))?S.courses:{};
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
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
      courseId:cid,title:c?.title||cid,status:'active',startedAt:new Date().toISOString(),
      passedAt:null,completionXp:0
    };
  }
}
function captureAccount(){
  ensure();
  const p=activeProgress();if(!p)return;
  for(const k of SHARED)S.majickAccount[k]=Number(p[k]??S.majickAccount[k]??0);
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
    passedAt:null,completionXp:0
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
  [...sel.options].forEach(o=>{
    const r=S.majickCourseRecords?.[o.value];
    if(r?.status==='passed'&&!o.textContent.startsWith('✓ '))o.textContent='✓ '+o.textContent;
  });
}

ensure();mirrorAccount();
const oldRender=window.AddStudyMaterialPage?.render;
const oldBind=window.AddStudyMaterialPage?.bind;
if(window.AddStudyMaterialPage&&oldRender){
  window.AddStudyMaterialPage.render=function(){return panelHTML()+oldRender()};
  window.AddStudyMaterialPage.bind=function(){oldBind?.();bindPanel()};
  window.v3315BindStudyMaterialPage=window.AddStudyMaterialPage.bind;
}
window.MajickCourseManager={ensure,captureAccount,mirrorAccount,normalizeProgressRow,normalizeAllProgress,createCourse,passCourse,currentStatus,panelHTML,bindPanel,decorateSelector,record,PASS_XP};
})();