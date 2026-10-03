(()=>{
'use strict';
const VERSION='3.3.62';
const COURSE='D772';
let lastLesson='';
function lesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(COURSE)?.id||''}catch(_){return ''}
}
function reduced(){return window.MajickRenderQueue?.reduced?.()||document.documentElement?.dataset?.majickReduceMotion==='true'}
function classroom(){
 if(window.S?.screen!=='learninglab')return;
 const lab=document.querySelector('.learnLab');if(!lab)return;
 const id=lesson();lab.dataset.majickActiveLesson=id||'none';
 const board=lab.querySelector('.v3354TeachingBoard');
 if(!board)return;
 if(!board.querySelector('.v3362BoardRunes')){
  const runes=document.createElement('div');runes.className='v3362BoardRunes';runes.setAttribute('aria-hidden','true');
  runes.innerHTML='<i>ᚱ</i><i>✦</i><i>☾</i><i>◇</i>';
  board.append(runes);
 }
 if(id&&id!==lastLesson&&!reduced()){
  board.classList.remove('v3362BoardAwake');void board.offsetWidth;board.classList.add('v3362BoardAwake');
 }
 if(id)lastLesson=id;
}
function grimoire(){
 if(window.S?.screen!=='livinggrimoire')return;
 const desk=document.querySelector('.v3354ArchiveDesk');if(!desk)return;
 const id=lesson();
 desk.dataset.majickActiveLesson=id||'none';
 const tabs=[...desk.querySelectorAll('.v3354LessonTabs button')];
 tabs.forEach(b=>{const active=b.classList.contains('active');b.toggleAttribute('aria-current',active)});
 const parchment=desk.querySelector('.v3354Parchment');
 if(parchment){
  let mark=parchment.querySelector('.v3362Bookmark');
  if(!mark){mark=document.createElement('span');mark.className='v3362Bookmark';mark.setAttribute('aria-hidden','true');parchment.append(mark)}
  const idx=['d772-s1-l1','d772-s1-l2','d772-s1-l3','d772-s1-l4','d772-s1-review'].indexOf(id);
  mark.textContent=idx<0?'D772':idx===4?'REVIEW':'L'+(idx+1);
 }
}
function decorate(){
 document.documentElement.dataset.majickRoomLife='3362';
 classroom();grimoire();
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('classroom-library-life',decorate,80);q.schedule()}
else setTimeout(decorate,140);
window.MajickClassroomLibraryLife={VERSION,COURSE,lesson,classroom,grimoire,decorate};
})();