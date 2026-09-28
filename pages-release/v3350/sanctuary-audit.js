(()=>{
 'use strict';
 const VERSION='3.3.50',states=new WeakMap();
 function expected(){return (window.S?.legacy?.pets||[]).filter(p=>p?.id).map(p=>({id:String(p.id),name:p.name||'Guardian'}))}
 function frameFor(source){return [...document.querySelectorAll('.v3317SanctuaryFrame')].find(f=>f.contentWindow===source)}
 function banner(frame){
   const wrap=frame.closest('.phase4Wrap');if(!wrap)return null;
   let box=wrap.querySelector('.v3350RoomAudit');if(box)return box;
   box=document.createElement('div');box.className='v3350RoomAudit';box.setAttribute('role','status');box.setAttribute('aria-live','polite');
   frame.before(box);return box;
 }
 function show(frame,rows){
   const wanted=expected(),ids=new Set(wanted.map(g=>g.id)),found=new Set((rows||[]).filter(x=>x.present).map(x=>String(x.petId)));
   const missing=wanted.filter(g=>!found.has(g.id)),extra=(rows||[]).filter(x=>x.present&&!ids.has(String(x.petId))),box=banner(frame);if(!box)return;
   states.set(frame,{expected:wanted.length,present:wanted.length-missing.length,missing:missing.map(g=>g.name),extra:extra.map(g=>g.name)});
   box.dataset.status=missing.length||extra.length?'missing':'ready';
   box.replaceChildren();
   const msg=document.createElement('span');
   msg.textContent=missing.length||extra.length
     ?(missing.length?'Sanctuary needs '+missing.map(g=>g.name).join(', ')+'. ':'')+(extra.length?'Unexpected Guardian in room: '+extra.map(g=>g.name).join(', ')+'. ':'')+(wanted.length-missing.length)+' of '+wanted.length+' owned Guardians are visible.'
     :'✦ All '+wanted.length+' owned Guardian'+(wanted.length===1?'':'s')+' present in the Sanctuary';
   box.append(msg);
   if(missing.length||extra.length){
     const button=document.createElement('button');button.type='button';button.textContent='Repair room';
     button.addEventListener('click',()=>{
       states.delete(frame);
       box.dataset.status='checking';msg.textContent='Rebuilding the Guardian room…';button.remove();
       const url=new URL(frame.src,location.href);url.searchParams.set('repair',String(Date.now()));frame.src=url.href;
       setTimeout(()=>request(frame),2500);
     });box.append(button);
   }
 }
 function request(frame){
   if(!frame?.isConnected)return;
   const box=banner(frame);if(!box)return;
   if(!states.has(frame)){box.dataset.status='checking';box.textContent='Checking Guardian room…'}
   try{frame.contentWindow?.postMessage({type:'MAJICK_SANCTUARY_ROSTER_REQUEST_V3350'},location.origin)}catch(_){}
   setTimeout(()=>{
     if(!frame.isConnected||states.has(frame))return;
     show(frame,[]);
   },6500);
 }
 function mount(){document.querySelectorAll('.v3317SanctuaryFrame').forEach(f=>{if(!f.dataset.v3350Audit){f.dataset.v3350Audit='1';request(f)}})}
 window.addEventListener('message',ev=>{
   if(ev.origin!==location.origin||ev.data?.type!=='MAJICK_SANCTUARY_ROSTER_V3350')return;
   const frame=frameFor(ev.source);if(frame)show(frame,ev.data.rows||[]);
 });
 const previous=window.render;
 if(typeof previous==='function')window.render=function(){const result=previous.apply(this,arguments);setTimeout(mount,0);return result};
 setTimeout(mount,300);
 window.MajickSanctuaryAudit={VERSION,expected,status:()=>[...document.querySelectorAll('.v3317SanctuaryFrame')].map(f=>states.get(f)||{checking:true}),request};
})();
