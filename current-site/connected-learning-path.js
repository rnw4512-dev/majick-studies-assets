/* Shared course-aware Learning Path. One owner, no rewards/mastery changes. */
(()=>{'use strict';
if(window.MajickConnectedPath)return;
const KEY='aetheria-learning-path-current-v2';
const COURSE_STAGE={home:0,guide:0,learninglab:0,mission:1,'hands-on':1,reasoning:3,test:3,games:2};
const STAGES=['Learn the source','Practice with support','Try independently','Prepare for OA / assessment'];
let selections={};try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))selections=v}catch(_){}
let pending=false,expanded=false,lastSignature='';
const state=()=>window.S||{};
const course=()=>String(document.querySelector('.courseSelect')?.value||state().activeCourse||'').trim().toUpperCase();
const screen=()=>String(state().screen||'home').toLowerCase();
const $=s=>document.querySelector(s);
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(selections))}catch(_){}};
function catalog(cid){
 const result=[],seen=new Set();
 function add(id,title,kind,detail='',loc=null){
  title=clean(title);id=clean(id);if(!id||!title)return;
  const k=(kind==='source'?'source:':'lesson:')+id.toLowerCase();
  if(seen.has(k))return;seen.add(k);
  result.push({id,title,kind,detail:clean(detail),locator:loc});
 }
 // Reuse authoritative, source-backed packs instead of hard-coding a course.
 const packs=Object.values(window.MajickCourseActivityPlayer?.packs||{}).filter(p=>String(p.courseId||'').toUpperCase()===cid);
 packs.forEach(p=>add('pack:'+p.id,p.title,'source',p.summary,p.id));
 // Existing curriculum activities are lesson-level classroom application tasks.
 const tasks=(window.MajickLessonActivities?.tasks||[]).filter(t=>String(t.course||'').toUpperCase()===cid);
 tasks.forEach(t=>{const code=String(t.lessonId||'').match(/-l(\d+)-(\d+)$/);const hasSource=code&&packs.some(p=>p.id==='lesson-'+Number(code[1])+'-'+Number(code[2]));if(!hasSource)add('task:'+t.id,t.title,'task',t.objective,t.lessonId)});
 // Lessons shown in the existing Learning Lab, including notes the user added.
 const model=window.MajickLearningLab;
 try{(model?.lessons?.(cid)||[]).forEach((l,i)=>add('lab:'+i,l.title||('Lesson '+(i+1)),'lab',l.source||'',i))}catch(_){}
 // When a course has no authored lesson catalog, use a transparent course overview.
 if(!result.length){
  const c=state().courses?.[cid];
  if(c?.title)add('overview',c.title+' — Course overview','overview','Add course sources or open the course question bank');
 }
 return result;
}
function current(cid,items){
 if(!items.length)return null;
 const explicit=selections[cid],found=items.find(x=>x.id===explicit);
 if(found)return found;
 // Respect Learning Lab's previously saved lesson cursor when it exists.
 const labIndex=Number(state().majickLearningLab?.[cid]?.lessonIndex);
 if(screen()==='learninglab'&&Number.isInteger(labIndex)&&labIndex>0){
  const match=items.find(x=>x.id==='lab:'+labIndex);if(match)return match;
 }
 return items[0];
}
function stage(){
 const room=screen();
 if(room==='learninglab'){
  const panel=$('.learnPanel:not([hidden])')?.dataset.panel;
  if(panel==='practice')return 1;
  if(panel==='mastery')return 2;
  return 0;
 }
 return COURSE_STAGE[room]??0;
}
function progressFor(cid,item){
 const p=window.MajickStudyObservatory;
 if(item?.kind==='source'&&p?.summary){
  try{const summary=p.summary(cid),row=summary.skills?.find(x=>x.id===item.locator);
   if(row)return row.unique+' of '+row.total+' sourced checks solved · '+row.attempts+' recent checks';}catch(_){}
 }
 const courseProgress=state().progress?.[cid];
 const answers=(courseProgress?.answers||[]).length;
 return answers?answers+' recorded course answers (not lesson-specific mastery)':'No scored lesson evidence yet';
}
function navigateTo(item){
 if(!item)return;
 if(item.kind==='source'){
  window.navigate?.('learninglab');
  setTimeout(()=>{
   const el=[...document.querySelectorAll('[data-cap-pack]')].find(x=>x.dataset.capPack===item.locator);
   if(el){el.open=true;el.scrollIntoView?.({block:'start',behavior:'auto'})}
  },180);
 }else if(item.kind==='lab'){
  const st=window.MajickLearningLab?.state?.(course());
  if(st&&Number.isInteger(item.locator))st.lessonIndex=item.locator;
  window.navigate?.('learninglab');
  setTimeout(()=>{window.MajickLearningLab?.showTab?.('learn');window.MajickLearningLab?.refresh?.()},120);
 }else window.navigate?.('mission');
 schedule();
}
function render(){
 const root=$('#content'),cid=course(),room=screen();
 if(!root||!cid||!state().courses?.[cid]||!['home','mission','guide','learninglab','reasoning','test','games','hands-on'].includes(room)){
  root?.querySelector(':scope > #majConnectedPath')?.remove();return;
 }
 const list=catalog(cid),item=current(cid,list);
 if(!item){root.querySelector(':scope > #majConnectedPath')?.remove();return}
 const idx=stage(),key=cid+'|'+room+'|'+item.id+'|'+idx+'|'+list.map(x=>x.id).join(',')+'|'+progressFor(cid,item);
 const host=root.querySelector(':scope > #majConnectedPath')||document.createElement('section');
 if(!host.isConnected){host.id='majConnectedPath';host.setAttribute('aria-label','Course and lesson learning path');root.prepend(host)}
 if(host.dataset.signature===key)return;
 const prior=host.querySelector('details');if(prior)expanded=prior.open;
 host.dataset.signature=key;host.replaceChildren();
 const details=document.createElement('details');details.className='majPathDisclosure';details.open=expanded;
 details.addEventListener('toggle',()=>{expanded=details.open});
 const summary=document.createElement('summary');summary.className='majPathSummary';
 summary.textContent='✦ '+cid+' · '+item.title+' · '+STAGES[idx];details.append(summary);
 const body=document.createElement('div');body.className='majPathBody';details.append(body);
 const h=document.createElement('h2');h.textContent='Your Learning Path';body.append(h);
 const currentLine=document.createElement('p');currentLine.textContent=(state().courses?.[cid]?.title||cid)+' · Current topic: '+item.title;body.append(currentLine);
 if(item.detail){const d=document.createElement('p');d.textContent=item.detail;body.append(d)}
 const progress=document.createElement('p');progress.className='majPathEvidence';progress.textContent=progressFor(cid,item);body.append(progress);
 const label=document.createElement('label');label.className='majPathSelectLabel';label.textContent='Choose your lesson or topic';label.htmlFor='majPathLessonSelect';body.append(label);
 const select=document.createElement('select');select.id='majPathLessonSelect';select.className='majPathLessonSelect';
 list.forEach(o=>{const opt=document.createElement('option');opt.value=o.id;opt.textContent=o.title;opt.selected=o.id===item.id;select.append(opt)});
 select.addEventListener('change',()=>{selections[cid]=select.value;save();host.dataset.signature='';render()});body.append(select);
 const steps=document.createElement('ol');steps.className='majPathSteps';
 STAGES.forEach((name,i)=>{const li=document.createElement('li');if(idx===i)li.className='is-current';const button=document.createElement('button');button.type='button';button.textContent=(i+1)+'. '+name;button.setAttribute('aria-current',idx===i?'step':'false');button.addEventListener('click',()=>{if(i===0)navigateTo(current(cid,catalog(cid)));else window.navigate?.(i===1?'mission':i===2?'hands-on':'reasoning');schedule()});li.append(button);steps.append(li)});
 body.append(steps);
 const actions=document.createElement('div');actions.className='majPathActions';
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);actions.append(b)}
 button('Open current topic',()=>navigateTo(current(cid,catalog(cid))));
 button('Practice this topic',()=>{const target=current(cid,catalog(cid));if(target?.kind==='source')navigateTo(target);else window.navigate?.('mission')});
 button('Hands-on scenarios',()=>window.navigate?.('hands-on'));
 body.append(actions);
 const note=document.createElement('p');note.className='majPathNote';note.textContent='The path follows your course and selected topic. Practice counts are not WGU certification or verified independent mastery.';body.append(note);
 host.append(details);
}
function schedule(){if(pending)return;pending=true;setTimeout(()=>{pending=false;render()},80)}
function detectSourceClick(e){
 const header=e.target.closest('[data-cap-pack]>summary');
 if(!header)return;
 const block=header.parentElement,selected='pack:'+block.dataset.capPack,cid=course();
 if(selected&&catalog(cid).some(x=>x.id===selected)){selections[cid]=selected;save();schedule()}
}
document.addEventListener('click',e=>{
 detectSourceClick(e);
 const b=e.target.closest('button');
 if(b?.id==='learnNextLesson'||b?.id==='learnPrevLesson'){setTimeout(()=>{const cid=course(),idx=Number(state().majickLearningLab?.[cid]?.lessonIndex)||0,which='lab:'+idx;if(catalog(cid).some(x=>x.id===which)){selections[cid]=which;save()}schedule()},60)}
 if(b?.hasAttribute('data-nav')||b?.hasAttribute('data-learn-tab')||b?.hasAttribute('data-cap-answer'))setTimeout(schedule,30);
});
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect,[data-course],#majPathLessonSelect'))schedule()});
document.addEventListener('majick:sourced-practice',e=>{const d=e.detail||{};if(d.courseId&&d.lessonId){selections[String(d.courseId).toUpperCase()]='pack:'+d.lessonId;save();schedule()}});
document.addEventListener('majick:hands-on-practice',schedule);
let lastContext='';
function checkContext(){
 const cid=course(),room=screen(),idx=Number(state().majickLearningLab?.[cid]?.lessonIndex)||0;
 const sig=cid+'|'+room+'|'+idx;
 if(sig!==lastContext){lastContext=sig;schedule()}
}
function init(){
 const root=$('#content');if(root){
  new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&n.id!=='majConnectedPath'&&!n.closest?.('#majConnectedPath'))))schedule()}).observe(root,{childList:true});
 }
 checkContext();schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setInterval(checkContext,1200);
window.MajickConnectedPath=Object.freeze({refresh:schedule,catalog:(id)=>catalog(String(id||course()).toUpperCase()),current:()=>current(course(),catalog(course()))});
})();