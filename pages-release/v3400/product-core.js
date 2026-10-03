(()=>{
'use strict';
const VERSION='3.4.0';
const SCHEMA=1;
const STAGES=[
 {key:'entered',label:'Enter',route:'home'},
 {key:'learn',label:'Learn',route:'learninglab'},
 {key:'check',label:'Quick Check',route:'learninglab'},
 {key:'practice',label:'Practice',route:'games'},
 {key:'reward',label:'Reward',route:'games'},
 {key:'guardian',label:'Guardian',route:'companions'},
 {key:'dorm',label:'Dorm',route:'companions'}
];
const EVENT_STAGE={
 'enter-college':'entered',
 'learn-start':'learn',
 'concept-complete':'learn',
 'quick-check-complete':'check',
 'practice-complete':'practice',
 'reward-earned':'reward',
 'guardian-reacted':'guardian',
 'dorm-return':'dorm'
};
function account(){
 try{return window.MajickStateCore?.ensureAccount?.()||window.S?.majickAccount||null}catch(_){return window.S?.majickAccount||null}
}
function course(){return String(window.S?.activeCourse||'D772')}
function lesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(course())||null}catch(_){return null}
}
function dayKey(d=new Date()){
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
 return y+'-'+m+'-'+day;
}
function ensure(){
 const a=account();if(!a)return null;
 a.productV34=a.productV34&&typeof a.productV34==='object'?a.productV34:{schemaVersion:SCHEMA,daily:null,history:[]};
 a.productV34.schemaVersion=SCHEMA;
 a.productV34.history=Array.isArray(a.productV34.history)?a.productV34.history:[];
 const c=course(),l=lesson(),today=dayKey();
 const id=today+'|'+c;
 let d=a.productV34.daily;
 if(!d||d.id!==id){
   if(d?.id)a.productV34.history.unshift({...d,closedAt:new Date().toISOString()});
   a.productV34.history=a.productV34.history.slice(0,40);
   d=a.productV34.daily={
     id,date:today,course:c,lessonId:l?.id||null,lessonTitle:l?.title||null,
     startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
     stages:Object.fromEntries(STAGES.map(s=>[s.key,false])),events:[]
   };
 }
 if(l?.id&&d.lessonId!==l.id&& !d.stages.check && !d.stages.practice){
   d.lessonId=l.id;d.lessonTitle=l.title||null;
 }
 d.stages=d.stages&&typeof d.stages==='object'?d.stages:{};
 for(const s of STAGES)if(typeof d.stages[s.key]!=='boolean')d.stages[s.key]=false;
 d.events=Array.isArray(d.events)?d.events:[];
 return d;
}
function save(){try{window.save?.()}catch(_){}}
function guardianEvent(kind,meta={}){
 try{return window.MajickGuardianCore?.relationshipEvent?.(kind,{course:course(),lessonId:ensure()?.lessonId,...meta})}catch(_){return null}
}
function record(kind,meta={}){
 const d=ensure();if(!d)return null;
 const stage=EVENT_STAGE[kind]||null,now=new Date().toISOString();
 if(stage)d.stages[stage]=true;
 if(kind==='practice-complete'&&meta?.won){
   d.stages.practice=true;
   if(Number(meta?.xp||0)>0||Number(meta?.crystals||0)>0)d.stages.reward=true;
 }
 if(kind==='reward-earned')d.stages.reward=true;
 if(kind==='guardian-reacted')d.stages.guardian=true;
 if(kind==='dorm-return')d.stages.dorm=true;
 const sig=kind+'|'+String(meta.lessonId||d.lessonId||'')+'|'+String(meta.qid||meta.game||meta.status||'');
 if(!d.events.some(e=>e.sig===sig&&kind!=='concept-complete')){
   d.events.unshift({sig,kind,stage,meta:{...meta},at:now});
   d.events=d.events.slice(0,80);
 }
 d.updatedAt=now;
 if(['learn-start','concept-complete','quick-check-complete','practice-complete','reward-earned','dorm-return'].includes(kind))guardianEvent(kind,meta);
 save();
 try{window.MajickRenderQueue?.schedule?.()}catch(_){}
 return d;
}
function firstIncomplete(){
 const d=ensure();if(!d)return STAGES[0];
 if(!d.stages.entered)return STAGES[0];
 if(!d.stages.learn)return STAGES[1];
 if(!d.stages.check)return STAGES[2];
 if(!d.stages.practice)return STAGES[3];
 if(!d.stages.reward)return STAGES[4];
 if(!d.stages.guardian)return STAGES[5];
 if(!d.stages.dorm)return STAGES[6];
 return null;
}
function nextAction(){
 const d=ensure(),n=firstIncomplete();
 if(!d)return {label:'Enter the Collegium',route:'home',stage:'entered'};
 if(!n)return {label:'Daily loop complete',route:'companions',stage:'complete',detail:'Rest in your dorm or choose the next lesson.'};
 const map={
  entered:['Enter the Collegium','home','Begin today’s study path.'],
  learn:['Continue '+course(),'learninglab',d.lessonTitle||'Open the next lesson.'],
  check:['Take the quick check','learninglab','Prove the lesson before practice.'],
  practice:['Enter the Game Realm','games','Use the concept in a new context.'],
  reward:['Claim your study reward','games','Finish the practice result and collect the reward.'],
  guardian:['Share the win with your Guardian','companions','Your Guardian should remember the milestone.'],
  dorm:['Return to your dorm','companions','See today’s progress reflected in your world.']
 };
 const [label,route,detail]=map[n.key];
 return {label,route,detail,stage:n.key};
}
function progress(){
 const d=ensure();if(!d)return {done:0,total:STAGES.length,percent:0};
 const done=STAGES.filter(s=>d.stages[s.key]).length,total=STAGES.length;
 return {done,total,percent:Math.round(done/total*100)};
}
function snapshot(){
 const d=ensure(),p=progress(),next=nextAction();
 return {version:VERSION,schemaVersion:SCHEMA,daily:d,progress:p,next,course:course(),lesson:lesson()};
}
function goNext(){
 const n=nextAction();
 if(n.stage==='entered')record('enter-college');
 if(n.stage==='learn')record('learn-start',{lessonId:ensure()?.lessonId});
 try{window.navigate?.(n.route)}catch(_){}
}
function escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const UI={
 button(label,{className='secondary',attrs=''}={}){return '<button class="v34Button '+className+'" '+attrs+'>'+escape(label)+'</button>'},
 pill(label,{className=''}={}){return '<span class="v34Pill '+className+'">'+escape(label)+'</span>'},
 card(body,{className=''}={}){return '<section class="v34Card '+className+'">'+body+'</section>'}
};
function loopHtml(){
 const s=snapshot(),d=s.daily;
 const items=STAGES.map(stage=>{
   const done=!!d?.stages?.[stage.key],current=s.next.stage===stage.key;
   return '<li class="'+(done?'done ':'')+(current?'current':'')+'"><i>'+(done?'✓':stage.label==='Guardian'?'◆':'✦')+'</i><span>'+escape(stage.label)+'</span></li>';
 }).join('');
 return '<section id="v3400DailyLoop" class="v3400DailyLoop">'+
  '<header><div><small>DAILY STUDY LOOP</small><h3>'+escape(s.next.label)+'</h3><p>'+escape(s.next.detail||'')+'</p></div><b>'+s.progress.done+'/'+s.progress.total+'</b></header>'+
  '<ol>'+items+'</ol>'+
  '<div class="v3400LoopActions"><button class="v34Button primary" type="button" data-v3400-next>'+escape(s.next.stage==='complete'?'Visit Dormitory':s.next.label)+'</button><span>'+escape(d?.lessonTitle||s.lesson?.title||s.course)+'</span></div>'+
 '</section>';
}
function decorateHome(){
 if(window.S?.screen!=='home')return;
 const doors=document.getElementById('v3377CampusDoors')||document.querySelector('.v3327PortalHero');
 if(!doors)return;
 document.getElementById('v3400DailyLoop')?.remove();
 const wrap=document.createElement('div');wrap.innerHTML=loopHtml();const el=wrap.firstElementChild;
 if(doors.id==='v3377CampusDoors')doors.insertAdjacentElement('beforebegin',el);else doors.insertAdjacentElement('afterend',el);
 el.querySelector('[data-v3400-next]')?.addEventListener('click',goNext);
 if(!ensure()?.stages?.entered)record('enter-college',{screen:'home'});
}
function decorateDorm(){
 if(window.S?.screen!=='companions')return;
 const d=ensure();if(!d?.stages?.reward)return;
 if(!d.stages.guardian)record('guardian-reacted',{screen:'companions',source:'dorm-arrival'});
 const next=ensure();
 if(next?.stages?.guardian&&!next.stages.dorm)record('dorm-return',{screen:'companions'});
}
function decorate(){decorateHome();decorateDorm();document.documentElement.dataset.majickProductCore='3400'}
const q=window.MajickRenderQueue;
if(q?.register){q.register('product-core-v34',decorate,15);q.schedule()}else setTimeout(decorate,120);
window.MajickUI=window.MajickUI||UI;
window.MajickProductCore={VERSION,SCHEMA,STAGES,EVENT_STAGE,ensure,record,nextAction,progress,snapshot,goNext,loopHtml,decorate,UI,dayKey};
})();