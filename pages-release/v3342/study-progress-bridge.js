(()=>{
'use strict';
const VERSION='3.3.42';

function account(){
  try{return window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount||null}
  catch(_){return window.S?.majickAccount||null}
}
function ledger(){
  const a=account();if(!a)return {events:{},version:VERSION};
  a.studyProgressBridge=a.studyProgressBridge||{version:VERSION,events:{},reconciledAt:0,reconciledCount:0};
  a.studyProgressBridge.version=VERSION;
  a.studyProgressBridge.events=a.studyProgressBridge.events||{};
  return a.studyProgressBridge;
}
function pets(){return (window.S?.legacy?.pets||[]).filter(Boolean)}
function activePet(){
  const rows=pets();if(!rows.length)return null;
  const id=window.S?.legacy?.activePetId||window.MajickGuardianCare?.snapshot?.()?.focusPetId;
  return rows.find(p=>p.id===id)||rows[0];
}
function save(){try{window.save?.()}catch(_){}}
function ensureProgress(course){
  if(!window.S)return null;
  S.progress=S.progress||{};
  S.progress[course]=S.progress[course]||{answers:[],explanations:[],repair:[],streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,charms:[]};
  S.progress[course].answers=Array.isArray(S.progress[course].answers)?S.progress[course].answers:[];
  return S.progress[course];
}
function canonicalAnswer(evt){
  const p=ensureProgress(evt.course||window.S?.activeCourse||'');
  if(!p)return;
  const key=String(evt.key||'');
  if(p.answers.some(a=>a.guardianBridgeKey===key))return;
  p.answers.push({
    qid:evt.qid||key,
    topicId:evt.topicId||'course-practice',
    chosen:evt.chosen||'',
    answer:evt.answer||'',
    correct:!!evt.correct,
    confidence:evt.confidence||'sure',
    mode:evt.source||'study',
    difficulty:Number(evt.difficulty||3),
    format:evt.format||'scenario',
    at:Number(evt.at||Date.now()),
    guardianBridge:true,
    guardianBridgeKey:key
  });
  if(p.answers.length>1200)p.answers=p.answers.slice(-1200);
}
function hatchIfReady(egg){
  if(!egg||Number(egg.progress||0)<Number(egg.goal||1))return;
  try{
    if(typeof window.hatchEgg==='function'){window.hatchEgg(egg);return}
  }catch(_){}
  egg.progress=Math.min(Number(egg.progress||0),Number(egg.goal||1));
}
function awardGuardians(evt){
  const rows=pets(),active=activePet(),correct=!!evt.correct,hard=Number(evt.difficulty||3)>=4;
  const activeGain=correct?(hard?15:10):3;
  const sharedGain=correct?(hard?5:3):1;
  for(const p of rows){
    const isActive=active&&p.id===active.id,gain=isActive?activeGain:sharedGain;
    p.studyXP=Math.max(0,Number(p.studyXP||0))+gain;
    p.totalStudyXP=Math.max(Number(p.totalStudyXP||0),Number(p.studyXP||0));
    p.lastGain=gain;p.lastGainAt=Date.now();
    p.bond=Math.max(0,Number(p.bond||0))+(correct?(isActive?(hard?4:3):1):(isActive?1:0));
  }
  const egg=window.S?.legacy?.eggs?.[0];
  if(correct&&egg){
    egg.progress=Math.max(0,Number(egg.progress||0))+(hard?3:2);
    hatchIfReady(egg);
  }
  if(window.S?.legacy)window.S.legacy.lastPetXPGains={active:activeGain,shared:sharedGain,at:Date.now(),correct,hard,source:evt.source||'study'};
}
function creditAnswer(evt={}){
  if(!evt||!evt.key)return false;
  const l=ledger(),key=String(evt.key);
  if(l.events[key])return false;
  l.events[key]={source:evt.source||'study',course:evt.course||window.S?.activeCourse||'',qid:evt.qid||'',correct:!!evt.correct,difficulty:Number(evt.difficulty||3),at:Number(evt.at||Date.now()),historical:!!evt.historical};
  canonicalAnswer(evt);
  awardGuardians(evt);
  save();
  return true;
}
function bankQ(course,qid){
  return (window.S?.courses?.[course]?.questionBank||[]).find(q=>q.id===qid)||null;
}
function addD755(out){
  const p=window.S?.progress?.D755,st=p?.d755Retake;if(!st)return;
  for(const [k,r] of Object.entries(st.responses||{})){
    if(!r)return;
    const topicId=k.split(':')[0]||'s1-data-sources';
    out.push({key:'hist:D755:learn:'+k+':'+Number(r.at||0),course:'D755',source:'d755-learn',qid:'d755_learn_'+k.replace(':','_'),topicId,correct:!!r.correct,difficulty:3,chosen:r.choice||'',at:Number(r.at||0)||Date.now(),historical:true});
  }
  for(const mode of ['diagnostic','mock']){
    const o=st[mode];if(!o?.answers?.length)continue;
    o.answers.forEach((a,i)=>{
      const q=bankQ('D755',a.id)||{};
      out.push({key:'hist:D755:'+mode+':'+Number(o.startedAt||0)+':'+String(a.id||i)+':'+i,course:'D755',source:'d755-'+mode,qid:a.id||('d755_'+mode+'_'+i),topicId:q.topicId||a.concept||'course-practice',correct:!!a.correct,difficulty:Number(q.difficulty||4),chosen:a.chosen||'',answer:q.answer||'',at:Number(a.at||o.startedAt||Date.now()),historical:true});
    });
  }
  for(const [sectionKey,res] of Object.entries(st.sectionChecks||{})){
    (res?.answers||[]).forEach((a,i)=>{
      const q=bankQ('D755',a.id)||{};
      out.push({key:'hist:D755:section-check:'+sectionKey+':'+Number(res.at||0)+':'+String(a.id||i)+':'+i,course:'D755',source:'d755-section-check',qid:a.id||('d755_check_'+i),topicId:q.topicId||a.concept||'course-practice',correct:!!a.correct,difficulty:Number(q.difficulty||4),chosen:a.chosen||'',answer:q.answer||'',at:Number(a.at||res.at||Date.now()),historical:true});
    });
  }
}
function addD772(out){
  const p=window.S?.progress?.D772,st=p?.learnModeV3338;if(!st)return;
  for(const [k,r] of Object.entries(st.responses||{})){
    out.push({key:'hist:D772:learn:'+k+':'+Number(r.at||0),course:'D772',source:'d772-learn',qid:'d772_learn_'+k.replace(':','_'),topicId:k.split(':')[0]||'d772-learning',correct:!!r.correct,difficulty:3,chosen:r.choice||'',at:Number(r.at||0)||Date.now(),historical:true});
  }
  for(const [lessonId,res] of Object.entries(st.checkpoints||{})){
    (res?.answers||[]).forEach((a,i)=>{
      const q=bankQ('D772',a.qid)||{};
      out.push({key:'hist:D772:checkpoint:'+lessonId+':'+Number(res.at||0)+':'+String(a.qid||i)+':'+i,course:'D772',source:'d772-learn-checkpoint',qid:a.qid||('d772_checkpoint_'+i),topicId:q.topicId||q.learningPathLessonId||lessonId,correct:!!a.correct,difficulty:Number(q.difficulty||3),chosen:a.chosen||'',answer:q.answer||'',at:Number(a.at||res.at||Date.now()),historical:true});
    });
  }
}
function reconcileHistorical(){
  const all=[];addD755(all);addD772(all);
  let credited=0,correct=0;
  for(const evt of all){
    if(creditAnswer(evt)){credited++;if(evt.correct)correct++}
  }
  const l=ledger();l.reconciledAt=Date.now();l.reconciledCount=Number(l.reconciledCount||0)+credited;
  save();
  if(credited){
    try{
      window.rewardToast?.('✦ Guardian progress restored',credited+' saved study answers were credited to your Guardian journey'+(correct?' • '+correct+' correct':'')+'.');
    }catch(_){}
    try{window.MajickGuardianCore?.decorate?.()}catch(_){}
  }
  return {found:all.length,credited,correct};
}
function wrapLegacyRecord(){
  const old=window.record;
  if(typeof old!=='function'||old.__majickStudyProgress)return;
  const fn=function(q,chosen,correct,confidence,mode){
    const r=old.apply(this,arguments);
    const l=ledger(),at=Date.now(),key='legacy:'+String(window.S?.activeCourse||'')+':'+String(q?.id||'q')+':'+at;
    l.events[key]={source:'game-realm',course:window.S?.activeCourse||'',qid:q?.id||'',correct:!!correct,difficulty:Number(q?.difficulty||1),at,legacyAwarded:true};
    save();
    return r;
  };
  fn.__majickStudyProgress=true;window.record=fn;
}
function inspect(){
  const l=ledger(),rows=pets();
  return {
    version:VERSION,
    events:Object.keys(l.events||{}).length,
    reconciledCount:Number(l.reconciledCount||0),
    pets:rows.map(p=>({id:p.id,type:p.type,name:p.name,studyXP:Number(p.studyXP||0),bond:Number(p.bond||0)})),
    egg:(window.S?.legacy?.eggs||[])[0]||null
  };
}
setTimeout(()=>{wrapLegacyRecord();reconcileHistorical()},60);
window.MajickStudyProgress={VERSION,creditAnswer,reconcileHistorical,inspect,wrapLegacyRecord};
document.documentElement.dataset.majickStudyProgress=VERSION;
})();