'use strict';
const assert=require('node:assert/strict'),{inflateSync}=require('node:zlib');

// Decode Chrome's lossless RGB/RGBA PNG screenshots without adding a package dependency.
function pngPixels(bytes){
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 let width,height,channels;const chunks=[];
 for(let i=8;i<bytes.length;){const n=bytes.readUInt32BE(i),type=bytes.toString('ascii',i+4,i+8),data=bytes.subarray(i+8,i+8+n);i+=n+12;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);assert.equal(data[8],8);assert([2,6].includes(data[9]),'Unsupported screenshot color type');channels=data[9]===6?4:3;assert.equal(data[12],0,'Interlaced screenshot unsupported');}
  if(type==='IDAT')chunks.push(data);if(type==='IEND')break;
 }
 assert(width&&height&&channels&&chunks.length,'Incomplete screenshot');
 const raw=inflateSync(Buffer.concat(chunks)),stride=width*channels,out=Buffer.alloc(height*stride);
 assert.equal(raw.length,(stride+1)*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){
  const filter=raw[y*(stride+1)];assert(filter<=4,'Unsupported PNG filter');
  for(let x=0;x<stride;x++){
   const i=y*stride+x,a=x>=channels?out[i-channels]:0,b=y?out[i-stride]:0,c=y&&x>=channels?out[i-stride-channels]:0;
   const predictor=filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c);
   out[i]=(raw[y*(stride+1)+1+x]+predictor)&255;
  }
 }
 return {width,height,pixel(x,y){const i=(y*width+x)*channels;if(channels===4)assert.equal(out[i+3],255,'Screenshot background must be opaque');return [out[i],out[i+1],out[i+2]];}};
}
function luminance(rgb){const v=rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}

module.exports=async function({call,ev,tab,width,out}){
 const fs=require('node:fs'),path=require('node:path');
 if(out)fs.mkdirSync(out,{recursive:true});
 await ev('document.fonts.ready');
 const scrollInfo=await ev(`(()=>{const hub=document.querySelector('#majCommonsHub');let scroller;for(let n=hub.parentElement;n;n=n.parentElement){const s=getComputedStyle(n);if(/auto|scroll/.test(s.overflowY)&&n.scrollHeight>n.clientHeight+1){scroller=n;break}}scroller=scroller||document.scrollingElement;scroller.dataset.commonsScroll='true';return {height:scroller.scrollHeight,viewport:scroller.clientHeight,tag:scroller.tagName,className:scroller.className}})()`);
 console.log('Commons scroll geometry '+JSON.stringify({width,tab,...scrollInfo}));
 const failures=[],seen=new Set();let count=0,minimum=Infinity,frames=0;
 const step=Math.max(200,scrollInfo.viewport-180);
 try{for(let offset=0;offset<=scrollInfo.height;offset+=step){
  await ev(`(()=>{const s=document.querySelector('[data-commons-scroll]');s.scrollTop=${offset};document.querySelectorAll('#majCommonsHub details').forEach(d=>{if(d.dataset.commonsAuditOpen)d.open=true})})()`);
  await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const info=await ev(`(()=>{
   const hub=document.querySelector('#majCommonsHub'),walker=document.createTreeWalker(hub,NodeFilter.SHOW_TEXT),items=[];let n,index=0;
   while(n=walker.nextNode()){
    index++;const e=n.parentElement;if(!n.textContent.trim()||e.closest('[hidden],[aria-hidden=true],script,style,svg,option')||!e.getClientRects().length)continue;
    const s=getComputedStyle(e);if(s.visibility!=='visible')continue;
    const range=document.createRange();range.selectNode(n);
    const rects=[...range.getClientRects()].filter(r=>r.width>3&&r.height>3&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth).map(r=>({x:r.x,y:r.y,w:r.width,h:r.height})).filter(r=>{
     const hit=document.elementFromPoint(Math.min(innerWidth-2,Math.max(2,r.x+r.w/2)),Math.min(innerHeight-2,Math.max(2,r.y+r.h/2)));
     return hit&&(hit===e||e.contains(hit));
    });
    if(!rects.length)continue;
    let opacity=1;for(let a=e;a;a=a.parentElement)opacity*=Number(getComputedStyle(a).opacity);
    items.push({index,text:n.textContent.trim().slice(0,110),color:s.color,opacity,size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight),className:e.className,rects});
   }return items;
  })()`);
  const screenshot=await call('Page.captureScreenshot',{format:'png'});
  if(out)fs.writeFileSync(path.join(out,width+'-'+tab+'-'+frames+'.png'),Buffer.from(screenshot.result.data,'base64'));
  let shot;try{
   await ev(`(()=>{document.querySelectorAll('#majCommonsHub,#majCommonsHub *').forEach(e=>{e.dataset.commonsAuditStyle=e.getAttribute('style')||'';e.style.setProperty('color','transparent','important');e.style.setProperty('-webkit-text-fill-color','transparent','important');e.style.setProperty('text-shadow','none','important')})})()`);
   await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
   shot=await call('Page.captureScreenshot',{format:'png'});
  }finally{await ev(`(()=>{document.querySelectorAll('[data-commons-audit-style]').forEach(e=>{e.setAttribute('style',e.dataset.commonsAuditStyle);delete e.dataset.commonsAuditStyle})})()`)}
  const image=pngPixels(Buffer.from(shot.result.data,'base64'));
  for(const item of info){
   const rgba=item.color.match(/[\d.]+/g).map(Number),alpha=(rgba[3]??1)*item.opacity,required=item.size>=24||(item.size>=18.66&&item.weight>=700)?3:4.5;let ratio=Infinity,samples=0,minimumPixel=null;
   for(const r of item.rects){
    // A line partly behind a fixed header is measured when scrolled fully into view.
    if(r.y<105||r.y+r.h>image.height-75)continue;
    for(let y=Math.max(0,Math.ceil(r.y+2));y<Math.min(image.height,Math.floor(r.y+r.h-2));y+=2)for(let x=Math.max(0,Math.ceil(r.x+2));x<Math.min(image.width,Math.floor(r.x+r.w-2));x+=2){const bg=image.pixel(x,y),fg=rgba.slice(0,3).map((v,i)=>v*alpha+bg[i]*(1-alpha));const value=contrast(fg,bg);if(value<ratio){ratio=value;minimumPixel={x,y,bg,fg}}samples++}
   }
   if(!samples)continue;if(!seen.has(item.index)){count++;seen.add(item.index)}minimum=Math.min(minimum,ratio);
   if(ratio<required)failures.push({...item,minimumPixel,frame:frames,ratio:+ratio.toFixed(2),required});
  }
  if(out&&failures.some(f=>f.frame===frames))fs.writeFileSync(path.join(out,width+'-'+tab+'-'+frames+'-background.png'),Buffer.from(shot.result.data,'base64'));
  frames++;if(offset>=scrollInfo.height-scrollInfo.viewport)break;
 }}finally{await ev(`(()=>{const s=document.querySelector('[data-commons-scroll]');s.scrollTop=0;delete s.dataset.commonsScroll})()`)}
 const report={width,tab,count,frames,minimum:+minimum.toFixed(2),failures};
 if(out)fs.writeFileSync(path.join(out,width+'-'+tab+'-contrast.json'),JSON.stringify(report,null,2));
 console.log('COMMONS RENDERED CONTRAST '+JSON.stringify(report));
 assert(count>0,'No visible text measured');return report;
};
