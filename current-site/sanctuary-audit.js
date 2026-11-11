(()=>{
 'use strict';
 const VERSION='3.4.2',states=new WeakMap();
 const frames=()=>[...document.querySelectorAll('#phase4SanctuaryFrame,.v3317SanctuaryFrame')];
 function expected(){return (window.S?.legacy?.pets||[]).filter(p=>p?.id).map(p=>({id:String(p.id),name:p.name||'Guardian'}))}
 function frameFor(source){return frames().find(f=>f.contentWindow===source)}
 function scholarCard(frame){
   const wrap=frame.closest('.phase4Wrap'),atelier=window.MajickAtelier,p=atelier?.player?.();if(!wrap||!p)return;
   let card=wrap.querySelector('.majSanctuaryScholar');if(!card){card=document.createElement('section');card.className='majSanctuaryScholar';card.setAttribute('aria-label','Your Scholar in the Sanctuary');frame.before(card)}
   const signature=JSON.stringify([p.skin,p.hair,p.robe,p.color,p.accessory,p.equipped]);
   if(card.dataset.look===signature&&card.querySelector('img'))return;
   card.dataset.look=signature;card.replaceChildren();
   const figure=document.createElement('div');figure.className='majSanctuaryScholarFigure';figure.innerHTML=atelier.renderAvatar(p,true,'');
   const text=document.createElement('div');text.innerHTML='<strong>Your Scholar · Sanctuary visit</strong><p>The same saved look from the Enchanted Atelier accompanies your Guardians.</p>';
   if(p.accessory||p.equipped!=null){const note=document.createElement('p');note.textContent='Your equipped accessory is saved. Fitted accessory artwork is pending.';text.append(note)}
   const button=document.createElement('button');button.type='button';button.textContent='Change saved look';button.onclick=()=>window.MajickWardrobeStudio?.open();text.append(button);card.append(figure,text);
   // Atelier checks its approved layered artwork asynchronously. Retry only this presentation.
   if(!figure.querySelector('img'))setTimeout(()=>{if(frame.isConnected)scholarCard(frame)},400);
 }
 function banner(frame){
   const wrap=frame.closest('.phase4Wrap');if(!wrap)return null;
   let box=wrap.querySelector('.v3350RoomAudit');if(box)return box;
   box=document.createElement('div');box.className='v3350RoomAudit';box.setAttribute('role','status');box.setAttribute('aria-live','polite');
   frame.before(box);return box;
 }
 function show(frame,rows){
   const wanted=expected(),ids=new Set(wanted.map(g=>g.id)),found=new Set((rows||[]).filter(x=>x.present).map(x=>String(x.petId)));
   const duplicateSavedIds=wanted.map(g=>g.id).filter((id,i,a)=>a.indexOf(id)!==i),duplicateRenderedIds=(rows||[]).map(g=>String(g.petId)).filter((id,i,a)=>a.indexOf(id)!==i);
   const missing=wanted.filter(g=>!found.has(g.id)),extra=(rows||[]).filter(x=>x.present&&!ids.has(String(x.petId))),box=banner(frame);if(!box)return;
   states.set(frame,{expected:wanted.length,present:wanted.length-missing.length,missing:missing.map(g=>g.name),extra:extra.map(g=>g.name),duplicateSavedIds,duplicateRenderedIds});
   box.dataset.status=missing.length||extra.length?'missing':'ready';
   box.replaceChildren();
   const msg=document.createElement('span');
   msg.textContent=missing.length||extra.length
     ?(missing.length?'Sanctuary needs '+missing.map(g=>g.name).join(', ')+'. ':'')+(extra.length?'Unexpected Guardian in room: '+extra.map(g=>g.name).join(', ')+'. ':'')+(wanted.length-missing.length)+' of '+wanted.length+' owned Guardians are visible.'
     :'✦ All '+wanted.length+' owned Guardian'+(wanted.length===1?'':'s')+' present in the Sanctuary';
   box.append(msg);
   if(duplicateSavedIds.length||duplicateRenderedIds.length){const warning=document.createElement('span');warning.textContent=' Duplicate record IDs detected. Export a backup before investigating; saved records were not changed.';box.append(warning)}
   if(missing.length||extra.length){
     const button=document.createElement('button');button.type='button';button.textContent='Repair room';
     button.addEventListener('click',()=>{
       if(!confirm('Reload the Sanctuary renderer? Saved Guardians, care, furniture and progress will remain unchanged.'))return;
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
     // An unanswered iframe request is not evidence of missing Guardians.
     const box=banner(frame);if(!box)return;
     box.dataset.status='unverified';
     box.replaceChildren();
     const msg=document.createElement('span');msg.textContent='Sanctuary room status could not be verified. Your Guardians and saved room are unchanged.';
     const retry=document.createElement('button');retry.type='button';retry.textContent='Check again';
     retry.addEventListener('click',()=>{states.delete(frame);request(frame)});
     box.append(msg,retry);
     states.set(frame,{expected:expected().length,unverified:true,reason:'roster-timeout'});
   },6500);
 }
 function mount(){frames().forEach(f=>{scholarCard(f);if(!f.dataset.v3350Audit){f.dataset.v3350Audit='1';request(f)}})}
 window.addEventListener('message',ev=>{
   if(ev.origin!==location.origin)return;
   const frame=frameFor(ev.source);if(!frame)return;
   if(ev.data?.type==='MAJICK_SANCTUARY_READY'||ev.data?.type==='MAJICK_SANCTUARY_READY_V3317'||ev.data?.type==='MAJICK_PIXI_SANCTUARY_READY'){
     if(states.get(frame)?.unverified)states.delete(frame);
     request(frame);
     return;
   }
   if(ev.data?.type==='MAJICK_SANCTUARY_ROSTER_V3350')show(frame,ev.data.rows||[]);
 });
 const previous=window.render;
 if(typeof previous==='function')window.render=function(){const result=previous.apply(this,arguments);setTimeout(mount,0);return result};
 document.addEventListener('majick:scholar-appearance-changed',mount);
 setTimeout(mount,300);
 window.MajickSanctuaryAudit={VERSION,expected,status:()=>frames().map(f=>states.get(f)||{checking:true}),request};
})();
