(()=>{
'use strict';
const VERSION='3.3.69';
const COURSE='D772';
let cache={at:0,counts:{},rows:0},pending=null;
function sectionOf(row){return String(row?.sectionId||row?.learningPath?.sectionId||'d772-s1')}
async function counts(force=false){
 const now=Date.now();
 if(!force&&now-cache.at<2500)return cache;
 if(pending)return pending;
 pending=(async()=>{
  try{
   const rows=await window.MajickMaterialStore?.list?.(COURSE)||[];
   const c={'d772-s1':0,'d772-s2':0,'d772-s3':0};
   for(const row of rows){const id=sectionOf(row);if(Object.hasOwn(c,id))c[id]++}
   cache={at:Date.now(),counts:c,rows:rows.length};return cache;
  }catch(_){return cache}
  finally{pending=null}
 })();
 return pending;
}
function label(section,count){
 if(section.status==='active')return count?count+' saved source'+(count===1?'':'s')+' • learning path active':'Built-in Section 1 path active';
 if(count)return count+' source'+(count===1?'':'s')+' added • lesson build pending';
 return 'Awaiting your materials';
}
async function decorate(){
 if(window.S?.activeCourse!==COURSE)return;
 const map=window.MajickD772CourseMap;if(!map?.SECTIONS)return;
 const data=await counts();
 const cards=[...document.querySelectorAll('.v3367SectionCard')];
 cards.forEach((card,i)=>{
  const section=map.SECTIONS[i];if(!section)return;
  const count=Number(data.counts[section.id]||0);
  card.dataset.sourceCount=String(count);
  card.classList.toggle('has-sources',count>0);
  let badge=card.querySelector('.v3369SourceStatus');
  if(!badge){badge=document.createElement('div');badge.className='v3369SourceStatus';card.append(badge)}
  badge.innerHTML='<span>'+(count?'✦':'☾')+'</span><b>'+label(section,count)+'</b>';
 });
 document.querySelectorAll('.v3367ArchiveSections>div').forEach((card,i)=>{
  const section=map.SECTIONS[i];if(!section)return;
  const count=Number(data.counts[section.id]||0);
  card.classList.toggle('has-sources',count>0);
  card.title=label(section,count);
 });
 document.documentElement.dataset.majickD772SectionReadiness='3369';
}
function refresh(){
 cache.at=0;
 return decorate();
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('d772-section-readiness',()=>{decorate()},120);q.schedule()}else setTimeout(decorate,220);
window.addEventListener('focus',()=>refresh(),{passive:true});
window.MajickD772SectionReadiness={VERSION,COURSE,counts,sectionOf,label,decorate,refresh,inspect:()=>cache};
})();