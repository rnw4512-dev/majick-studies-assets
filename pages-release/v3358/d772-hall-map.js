(()=>{
'use strict';
const VERSION='3.3.58';
const COURSE='D772';
const PATH=[
 {id:'d772-s1-l1',n:'01',title:'Data Collection',subtitle:'Population • samples • sampling • study design'},
 {id:'d772-s1-l2',n:'02',title:'Bias',subtitle:'Selection • response • wording • nonresponse'},
 {id:'d772-s1-l3',n:'03',title:'Misrepresentation',subtitle:'Graphs • sample size • significance • integrity'},
 {id:'d772-s1-l4',n:'04',title:'Conclusions',subtitle:'Association • causation • generalization • limits'},
 {id:'d772-s1-review',n:'✦',title:'Section Review',subtitle:'Mixed credibility practice • prepare for the section test',review:true}
];
function E(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function current(){
 try{return window.MajickCourseTutor?.selectedLesson?.(COURSE)?.id||'d772-s1-l1'}catch(_){return 'd772-s1-l1'}
}
function open(id){
 try{
   if(window.S?.screen!=='learninglab')window.navigate?.('learninglab');
   setTimeout(()=>window.MajickCourseTutor?.openLesson?.(id,null,COURSE),80);
 }catch(_){}
}
function render(){
 if(window.MajickHomeFocus?.compactHome?.()){document.querySelector('.v3358HallMap')?.remove();return;}
 if(window.S?.screen!=='home'||window.S?.activeCourse!==COURSE)return;
 const gate=document.querySelector('.v3354CampusGate');if(!gate)return;
 gate.parentElement?.querySelector('.v3358HallMap')?.remove();
 const active=current();
 const map=document.createElement('section');map.className='v3358HallMap';
 map.innerHTML='<header><div><small>D772 • SECTION 1 ACADEMIC HALL</small><h2>Walk the Statistical Data Literacy corridor.</h2><p>Each door opens a lesson room. Finish the four lesson halls, then enter the Section Review chamber.</p></div><span>ASSESSING RESEARCH & DATA CREDIBILITY</span></header>'+
 '<div class="v3358Corridor">'+PATH.map((x,i)=>'<button type="button" class="v3358Door '+(active===x.id?'current ':'')+(x.review?'review ':'')+'" data-lesson="'+x.id+'"><span class="v3358DoorNo">'+E(x.n)+'</span><span class="v3358DoorArch"><i>✦</i></span><strong>'+E(x.title)+'</strong><small>'+E(x.subtitle)+'</small><em>'+(active===x.id?'CURRENT ROOM':'ENTER ROOM')+'</em></button>'+(i<PATH.length-1?'<span class="v3358HallLine" aria-hidden="true">✧</span>':'')).join('')+'</div>';
 map.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.lesson)));
 gate.insertAdjacentElement('afterend',map);
}
function decorate(){document.documentElement.dataset.majickD772Hall='3358';render()}
const renderQueue=window.MajickRenderQueue;
if(renderQueue?.register){
 renderQueue.register('d772-hall',decorate,70);
 renderQueue.schedule();
}else{
 const previousRender=window.render;
 if(typeof previousRender==='function'&&!previousRender.__d772_hallFallback){
  const wrapped=function(){const out=previousRender.apply(this,arguments);setTimeout(decorate,0);return out};
  wrapped.__d772_hallFallback=true;window.render=wrapped;
 }
 setTimeout(decorate,120);
}
window.MajickD772HallMap={VERSION,COURSE,PATH,render,open};
})();