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

module.exports=async function parchmentContrast({call,evalPage,action,waitFor,sleep}){
 await action('switchCourse("D772");MajickCourseTutor.openLesson("d772-s2-l4",null,"D772")');
 await waitFor('!!document.querySelector("#classroom-tab-opening")');await sleep(500);
 const results=[];
 try{
  for(const viewport of [{width:390,height:844},{width:1365,height:900}]){
   await call('Emulation.setDeviceMetricsOverride',{...viewport,deviceScaleFactor:1,mobile:viewport.width<500});
   await action('document.querySelector("#classroom-tab-opening").click()');await sleep(500);
   await action('const e=[...document.querySelectorAll("#classroom-panel-opening li")].find(e=>e.textContent.includes("Calculating correctly but interpreting the statistic incorrectly"));if(!e)throw Error("Expected lesson warning missing");e.dataset.parchmentContrast="target";e.scrollIntoView({block:"center",behavior:"instant"})');
   await waitFor('!document.querySelector("#majickCampusPortal.active")&&!document.querySelector(".rewardToast")');await sleep(300);
   await action('document.querySelector("[data-parchment-contrast=target]").scrollIntoView({block:"center",behavior:"instant"})');await sleep(300);
   await waitFor('(()=>{const r=document.querySelector("[data-parchment-contrast=target]").getBoundingClientRect();return r.y>80&&r.bottom<innerHeight-90})()');
   const info=await evalPage('(()=>{const e=document.querySelector("[data-parchment-contrast=target]"),range=document.createRange();range.selectNodeContents(e);const cs=getComputedStyle(e),layers=[];for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);layers.push({opacity:s.opacity,filter:s.filter})}return {text:e.textContent,color:cs.color,size:cs.fontSize,rects:[...range.getClientRects()].map(r=>({x:r.x,y:r.y,width:r.width,height:r.height})),gradient:getComputedStyle(e.closest(".classroomStage")).backgroundImage,layers}})()');
   assert(info.gradient.startsWith('linear-gradient('),'Approved parchment gradient must remain intact');
   assert(info.layers.every(x=>Number(x.opacity)===1&&x.filter==='none'),'Text needs separate opacity/filter analysis');
   const fg=info.color.match(/[\d.]+/g).map(Number);assert.equal(fg.length,3,'Text must be opaque RGB');
   let shot;
   // Hide only the glyph paint, preserving layout, the gradient, textures and ambient particles.
   const prior=await evalPage('document.querySelector("[data-parchment-contrast=target]").getAttribute("style")');
   try{
    await action('const e=document.querySelector("[data-parchment-contrast=target]");e.style.setProperty("color","transparent","important");e.style.setProperty("text-shadow","none","important")');
    assert.equal(await evalPage('getComputedStyle(document.querySelector("[data-parchment-contrast=target]")).color'),'rgba(0, 0, 0, 0)');
    shot=await call('Page.captureScreenshot',{format:'png'});
   }finally{await action('const e=document.querySelector("[data-parchment-contrast=target]");const prior='+JSON.stringify(prior)+';if(prior===null)e.removeAttribute("style");else e.setAttribute("style",prior)');}
   const image=pngPixels(Buffer.from(shot.result.data,'base64'));assert.equal(image.width,viewport.width);assert.equal(image.height,viewport.height);
   let minimum=Infinity,samples=0;
   for(const r of info.rects){
    assert(r.x>=0&&r.y>=0&&r.x+r.width<=image.width&&r.y+r.height<=image.height,'Text must be fully visible');
    for(let y=Math.ceil(r.y);y<Math.floor(r.y+r.height);y++)for(let x=Math.ceil(r.x);x<Math.floor(r.x+r.width);x++){minimum=Math.min(minimum,contrast(fg,image.pixel(x,y)));samples++;}
   }
   assert(samples>0,'Zero sampled pixels cannot certify contrast');
   assert(minimum>=4.5,'Rendered parchment warning fails WCAG AA at '+viewport.width+'px: '+minimum.toFixed(2)+':1');
   results.push({viewport:viewport.width,minimumContrast:+minimum.toFixed(2),samples,text:info.text});
  }
 }finally{await call('Emulation.clearDeviceMetricsOverride');await action('document.querySelectorAll("[data-parchment-contrast]").forEach(e=>e.removeAttribute("data-parchment-contrast"))');}
 console.log('PASS browser: rendered parchment warning contrast at mobile and desktop',JSON.stringify(results));
 return results;
};
