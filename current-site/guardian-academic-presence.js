(()=>{
'use strict';
const VERSION='3.3.66';
const COURSE='D772';
function active(){return window.S?.activeCourse===COURSE}
function guardian(){
 try{
  const core=window.MajickGuardianCore,p=core?.activePet?.();
  return p?core.meta?.(p):null;
 }catch(_){return null}
}
function lesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(COURSE)||null}catch(_){return null}
}
function learnState(){
 try{return window.S?.progress?.[COURSE]?.learnModeV3338||null}catch(_){return null}
}
function contextLine(){
 const l=lesson(),st=learnState();
 if(!l)return 'I’m here when you choose the next lesson.';
 if(st?.mode==='checkpointResult'){
   const r=st.checkpoints?.[l.id];
   if(r?.status==='Ready to move on')return 'That lesson is secure. We can move forward.';
   if(r?.status==='One distinction to repair')return 'One distinction needs a quick repair. I’m staying with you.';
   if(r)return 'We know exactly what to revisit. No guessing.';
 }
 if(st?.mode==='checkpoint')return 'Checkpoint time. I’ll stay quiet while you reason it out.';
 if(st?.mode==='concept')return 'One concept at a time. Find the defining clue first.';
 return 'We’re working through '+String(l.title||'this lesson')+'.';
}
function cardClass(){const s=window.S?.screen;return s==='learninglab'?'learn':s==='livinggrimoire'?'archive':s==='games'||s==='mission'?'realm':'home'}
function mount(){
 if(!active())return remove();
 const g=guardian();if(!g)return remove();
 const screen=window.S?.screen||'home';
 let anchor=null;
 if(screen==='learninglab')anchor=document.querySelector('.v3356ProfessorBrief,.v3354TeachingBoard,.learnLab');
 else if(screen==='livinggrimoire')anchor=document.querySelector('.v3354ArchiveDesk,.v3356ArchiveIndex');
 else if(screen==='games'||screen==='mission')anchor=document.querySelector('.realmHub,.realmShell,.mission,.content');
 else if(screen==='home')anchor=document.querySelector('.v3358HallMap,.v3354CampusGate');
 if(!anchor)return remove();
 let card=document.getElementById('v3366AcademicGuardian');
 if(!card){
   card=document.createElement('aside');card.id='v3366AcademicGuardian';card.className='v3366AcademicGuardian';
 }
 card.className='v3366AcademicGuardian '+cardClass();
 card.innerHTML=(g.image?'<img src="'+String(g.image).replace(/"/g,'&quot;')+'" alt="">':'<span>'+String(g.icon||'✦')+'</span>')+
  '<div><small>STUDY GUARDIAN • '+String(g.stage||'Bonded')+'</small><b>'+String(g.name||'Guardian')+'</b><p>'+contextLine()+'</p></div>';
 if(anchor.previousElementSibling!==card)anchor.insertAdjacentElement('beforebegin',card);
}
function remove(){document.getElementById('v3366AcademicGuardian')?.remove()}
function decorate(){document.documentElement.dataset.majickGuardianAcademic='3366';mount()}
const q=window.MajickRenderQueue;
if(q?.register){q.register('guardian-academic-presence',decorate,95);q.schedule()}else setTimeout(decorate,160);
window.MajickGuardianAcademicPresence={VERSION,COURSE,guardian,lesson,learnState,contextLine,mount,remove,decorate};
})();