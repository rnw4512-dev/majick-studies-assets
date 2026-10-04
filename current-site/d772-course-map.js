(()=>{
'use strict';
const VERSION='3.3.67';
const COURSE='D772';
const SECTIONS=[
 {id:'d772-s1',number:1,title:'Assessing Research and Data Credibility',status:'active',lessons:[
  {id:'d772-s1-l1',title:'Understanding Data Collection Methods'},
  {id:'d772-s1-l2',title:'Recognizing Bias in Data Collection'},
  {id:'d772-s1-l3',title:'Unveiling Data Misrepresentations'},
  {id:'d772-s1-l4',title:'Conclusions About Data Findings'},
  {id:'d772-s1-review',title:'Section 1 Summary and Test'}
 ]},
 {id:'d772-s2',number:2,title:'Interpreting Data Using Statistics and Graphs',status:'structure-ready',masteryTargets:[
  'Identify different classifications of data',
  'Select an appropriate graphical display based on data type(s)',
  'Describe the distribution of data given a graphical display',
  'Calculate single-variable descriptive statistics'
 ],lessons:[
  {id:'d772-s2-l1',title:'Exploring Various Types of Data'},
  {id:'d772-s2-l2',title:'Choosing Graphical Displays'},
  {id:'d772-s2-l3',title:'Data Distribution Interpretation'},
  {id:'d772-s2-l4',title:'Calculating Single-Variable Descriptive Statistics'},
  {id:'d772-s2-review',title:'Section 2 Summary and Test'}
 ]},
 {id:'d772-s3',number:3,title:'Applying Probability',status:'awaiting-material',lessons:[]}
];
function active(){return window.S?.activeCourse===COURSE}
function E(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function selectedLesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(COURSE)?.id||'d772-s1-l1'}catch(_){return 'd772-s1-l1'}
}
function openLesson(id){
 try{
  if(window.S?.screen!=='learninglab')window.navigate?.('learninglab');
  setTimeout(()=>window.MajickCourseTutor?.openLesson?.(id,null,COURSE),70);
 }catch(_){}
}
function card(section){
 const current=selectedLesson();
 const activeSection=section.lessons.some(l=>l.id===current);
 return '<article class="v3367SectionCard '+section.status+(activeSection?' current':'')+'">'+
  '<header><span>'+section.number+'</span><div><small>SECTION '+section.number+'</small><h3>'+E(section.title)+'</h3></div></header>'+
  (section.lessons.length?
   '<div class="v3367SectionLessons">'+section.lessons.map((l,i)=>'<button type="button" data-v3367-lesson="'+l.id+'" class="'+(l.id===current?'active':'')+'"><i>'+(i<4?'L'+(i+1):'✦')+'</i><span>'+E(l.title)+'</span></button>').join('')+'</div>'+
   '<p class="v3367SectionNote">'+(section.id==='d772-s1'?'Section 1 remains isolated from later sections.':section.id==='d772-s2'?'Section 2 structure and competency targets are loaded; detailed teaching expands only from verified material.':'This section remains separate until its course structure is supplied.')+'</p>'
   :
   '<div class="v3367Awaiting"><span>☾</span><b>Ready for your next course materials</b><p>This section stays separate until you add its lesson content. Nothing from Section 1 is copied here.</p></div>')+
  '</article>';
}
function renderHome(){
 if(window.MajickHomeFocus?.compactHome?.()){document.querySelector('.v3367CourseMap')?.remove();return;}
 if(!active()||window.S?.screen!=='home')return;
 const hall=document.querySelector('.v3358HallMap');if(!hall)return;
 let map=document.querySelector('.v3367CourseMap');
 if(map)map.remove();
 map=document.createElement('section');map.className='v3367CourseMap';
 map.innerHTML='<header><div><small>D772 • FULL COURSE MAP</small><h2>Statistical Data Literacy Collegium</h2><p>Three separate academic wings. Section 1 is built; Section 2 now has its four official lessons and assessment targets; Section 3 remains reserved until you add its course structure.</p></div><span>3 COURSE SECTIONS</span></header><div class="v3367SectionGrid">'+SECTIONS.map(card).join('')+'</div>';
 map.querySelectorAll('[data-v3367-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(b.dataset.v3367Lesson)));
 hall.insertAdjacentElement('beforebegin',map);
}
function renderGrimoire(){
 if(!active()||window.S?.screen!=='livinggrimoire')return;
 const host=document.querySelector('.v3354ArchiveDesk');if(!host)return;
 let nav=document.querySelector('.v3367ArchiveSections');
 if(nav)nav.remove();
 nav=document.createElement('nav');nav.className='v3367ArchiveSections';nav.setAttribute('aria-label','D772 course sections');
 nav.innerHTML=SECTIONS.map(s=>'<div class="'+s.status+'"><small>SECTION '+s.number+'</small><b>'+E(s.title)+'</b><span>'+(s.lessons.length?s.lessons.length+' entries':'awaiting materials')+'</span></div>').join('');
 host.insertAdjacentElement('beforebegin',nav);
}
function decorate(){
 document.documentElement.dataset.majickD772CourseMap='3367';
 renderHome();renderGrimoire();
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('d772-course-map',decorate,75);q.schedule()}else setTimeout(decorate,150);
window.MajickD772CourseMap={VERSION,COURSE,SECTIONS,selectedLesson,openLesson,renderHome,renderGrimoire,decorate};
})();