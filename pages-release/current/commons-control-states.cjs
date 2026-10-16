'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pngPixels,contrast}=require('./commons-contrast.cjs');
module.exports=async({call,ev})=>{
 await call('DOM.enable');await call('CSS.enable');const reports=[];fs.mkdirSync('commons-qa',{recursive:true});
 const controls=[['overview','[data-commons-tab=overview]'],['overview','[data-commons-tab=review]'],['overview','[data-commons-next]'],['overview','.v3327Primary'],['today','[data-v3400-next]'],['review','[data-mj-pa-check]'],['review','[data-am-work] button'],['guardians','.v3327GuardianHall .v3327TextBtn'],['sanctuary','.v3327CampusSanctuary .v3327TextBtn']];
 for(let index=0;index<controls.length;index++){
  const [tab,selector]=controls[index];await ev('document.querySelector("[data-commons-tab='+tab+']").click()');
  await ev('(()=>{const b=document.querySelector("#majCommonsHub '+selector+'");if(b){for(let p=b.parentElement;p;p=p.parentElement)if(p.tagName==="DETAILS")p.open=true}if(!b||!b.getClientRects().length)throw Error("Missing state-audit control");b.dataset.commonsControl="true";b.scrollIntoView({block:"center",behavior:"instant"})})()');
  const root=(await call('DOM.getDocument')).result.root.nodeId,nodeId=(await call('DOM.querySelector',{nodeId:root,selector:'[data-commons-control]'})).result.nodeId;
  const disabled=await ev('document.querySelector("[data-commons-control]").disabled');
  try{for(const state of ['normal','hover','focus','disabled']){
   await ev('document.querySelector("[data-commons-control]").disabled='+JSON.stringify(state==='disabled'?true:disabled));
   await call('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state==='hover'?['hover']:state==='focus'?['focus','focus-visible']:[]});
   await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
   const text=await ev(`(()=>{const b=document.querySelector('[data-commons-control]'),walker=document.createTreeWalker(b,NodeFilter.SHOW_TEXT),items=[];let n;while(n=walker.nextNode()){const e=n.parentElement;if(!n.textContent.trim()||e.closest('[aria-hidden=true]'))continue;const r=document.createRange();r.selectNode(n);let alpha=1;for(let p=e;p;p=p.parentElement)alpha*=Number(getComputedStyle(p).opacity);items.push({text:n.textContent.trim(),color:getComputedStyle(e).color,alpha,rects:[...r.getClientRects()].map(r=>({x:r.x,y:r.y,w:r.width,h:r.height}))})}return items})()`);
   let shot;try{
    await ev(`(()=>{const b=document.querySelector('[data-commons-control]');[b,...b.querySelectorAll('*')].forEach(e=>{e.dataset.controlPrior=e.getAttribute('style')||'';e.style.setProperty('color','transparent','important');e.style.setProperty('-webkit-text-fill-color','transparent','important');e.style.setProperty('text-shadow','none','important')})})()`);
    await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');shot=await call('Page.captureScreenshot',{format:'png'});
   }finally{await ev(`document.querySelectorAll('[data-control-prior]').forEach(e=>{e.setAttribute('style',e.dataset.controlPrior);delete e.dataset.controlPrior})`)}
   const image=pngPixels(Buffer.from(shot.result.data,'base64'));let minimum=Infinity,samples=0;
   for(const item of text){const rgba=item.color.match(/[\d.]+/g).map(Number),alpha=item.alpha*(rgba[3]??1);for(const r of item.rects)for(let y=Math.ceil(r.y+2);y<Math.floor(r.y+r.h-2);y+=2)for(let x=Math.ceil(r.x+2);x<Math.floor(r.x+r.w-2);x+=2){assert(x>=0&&x<image.width&&y>=0&&y<image.height,'Control text clipped');const bg=image.pixel(x,y),fg=rgba.slice(0,3).map((c,i)=>c*alpha+bg[i]*(1-alpha));minimum=Math.min(minimum,contrast(fg,bg));samples++}}
   const report={tab,selector,state,minimum:+minimum.toFixed(2),samples};reports.push(report);console.log('COMMONS CONTROL STATE '+JSON.stringify(report));
   const visual=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join('commons-qa','control-'+index+'-'+state+'.png'),Buffer.from(visual.result.data,'base64'));
   assert(samples>0&&minimum>=4.5,'Unreadable Home control state: '+JSON.stringify(report));
  }}finally{await call('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});await ev('(()=>{const b=document.querySelector("[data-commons-control]");b.disabled='+JSON.stringify(disabled)+';delete b.dataset.commonsControl})()')}
 }
 fs.writeFileSync('commons-qa/control-states.json',JSON.stringify(reports,null,2));console.log('PASS Commons rendered normal, hover, focus and disabled states');
};
