(()=>{
'use strict';
const VERSION='3.3.71';
const COURSE='D772';
const KEY='majick_d772_material_section';
function preferred(){
 try{return sessionStorage.getItem(KEY)||''}catch(_){return ''}
}
function setPreferred(id){
 try{sessionStorage.setItem(KEY,id)}catch(_){}
}
function openMaterials(id){
 setPreferred(id);
 try{window.S.activeCourse=COURSE}catch(_){}
 try{window.navigate?.('addmaterial')}catch(_){}
}
function decorateMap(){
 if(window.S?.activeCourse!==COURSE||window.S?.screen!=='home')return;
 const map=window.MajickD772CourseMap;if(!map?.SECTIONS)return;
 const cards=[...document.querySelectorAll('.v3367SectionCard')];
 cards.forEach((card,i)=>{
   const sec=map.SECTIONS[i];if(!sec||sec.status==='active')return;
   let b=card.querySelector('.v3371AddMaterials');
   if(!b){
     b=document.createElement('button');b.type='button';b.className='v3371AddMaterials';
     b.addEventListener('click',()=>openMaterials(sec.id));
     card.append(b);
   }
   b.textContent='✦ Add Section '+sec.number+' materials';
   b.setAttribute('aria-label','Add study materials for '+sec.title);
 });
}
function applyToForge(){
 if(window.S?.screen!=='addmaterial')return;
 const id=preferred();if(!id)return;
 const course=document.getElementById('materialCourse'),section=document.getElementById('materialSection'),wrap=document.getElementById('materialSectionWrap');
 if(!course||!section)return;
 course.value=COURSE;
 if(wrap)wrap.hidden=false;
 if([...section.options].some(o=>o.value===id))section.value=id;
 const meta=window.AddStudyMaterialPage?.sectionMeta?.(id);
 const status=document.getElementById('materialStatus');
 if(status&&meta)status.textContent='Ready to add material to '+meta.title+'.';
}
function decorate(){
 document.documentElement.dataset.majickSectionIntakeShortcut='3371';
 decorateMap();applyToForge();
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('section-intake-shortcuts',decorate,130);q.schedule()}else setTimeout(decorate,180);
window.MajickSectionIntakeShortcuts={VERSION,COURSE,KEY,preferred,setPreferred,openMaterials,decorateMap,applyToForge,decorate};
})();