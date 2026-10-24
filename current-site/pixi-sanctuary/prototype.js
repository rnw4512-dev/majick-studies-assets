/* Isolated read-only PixiJS trial. Never accesses Majick storage or writes progress. */
(async function(){
'use strict';
const names=['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara'];
const room=document.getElementById('room'),status=document.getElementById('status');
const $=id=>document.getElementById(id);
if(!window.PIXI){status.textContent='PixiJS could not load. Check your connection and retry.';return}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// This is an explicitly requested movement test: start wandering even if the OS
// requests reduced decorative motion; keep ambient effects disabled in that case.
let paused=false,stress=false,ambient=!reduced,loaded=0;
const app=new PIXI.Application();
try {
 await app.init({width:1200,height:700,backgroundAlpha:0,antialias:false,autoDensity:true,resolution:Math.min(devicePixelRatio||1,2),preference:'webgl',powerPreference:'low-power'});
} catch(error) { console.error('PixiJS v8 initialization failed',error); status.textContent='PixiJS could not initialize graphics on this device.'; return; }
room.appendChild(app.canvas);
const world=new PIXI.Container();app.stage.addChild(world);
const ground=new PIXI.Graphics();ground.ellipse(600,625,570,150).fill({color:0x36243f,alpha:.85});world.addChild(ground);
const backdrop=new PIXI.Container();world.addChildAt(backdrop,0);
PIXI.Assets.load('../assets/approved_sanctuary_backdrop.jpg').then(texture=>{
 const image=new PIXI.Sprite(texture);image.width=1200;image.height=700;backdrop.addChild(image);
}).catch(error=>console.warn('Sanctuary background unavailable',error));
const furnitureLayer=new PIXI.Container();world.addChild(furnitureLayer);
const furnitureSprites=new Map();
async function loadFurniture(){
 try{
  const response=await fetch('../sanctuary/assets/objects/objects-manifest.json');
  if(!response.ok)throw Error('Furniture manifest unavailable');
  const data=await response.json();
  for(const obj of data.objects||[]){
   if(!obj.enabled||!obj.preload||!obj.placement||!obj.filename)continue;
   try{
    const texture=await PIXI.Assets.load('../sanctuary/assets/objects/'+obj.filename);
    const sprite=new PIXI.Sprite(texture);sprite.anchor.set(.5,1);
    const width=Math.min(165,Number(obj.placement.width||180)*.48);
    sprite.scale.set(width/Math.max(1,texture.width));
    sprite.x=Math.max(60,Math.min(1140,Number(obj.placement.x||600)*.57));
    sprite.y=Math.max(240,Math.min(665,Number(obj.placement.y||750)*.69));
    sprite.eventMode='static';sprite.cursor='pointer';
    sprite.on('pointertap',()=>{if(obj.destination&&window.parent!==window)window.parent.postMessage({type:'MAJICK_OPEN_ROUTE',route:obj.destination},location.origin);else status.textContent=obj.displayName+' · '+(obj.interaction||'Sanctuary furnishing')});
    furnitureLayer.addChild(sprite);furnitureSprites.set(obj.id,{sprite,obj});
   }catch(error){console.warn('Furniture art missing:',obj.id,error)}
  }
 }catch(error){console.warn('Furniture manifest could not load',error)}
}
loadFurniture();
const dots=new PIXI.Container();world.addChild(dots);
const guardianLayer=new PIXI.Container();world.addChild(guardianLayer);
const entities=[];
let seed=12345;const rand=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const colors=[0xe3c38c,0xc6a1f6,0x9fd2e5];
for(let i=0;i<42;i++){const star=new PIXI.Graphics();star.circle(0,0,1+rand()*2).fill({color:colors[i%3],alpha:.22});star.x=30+rand()*1140;star.y=20+rand()*580;dots.addChild(star)}
function resize(){const b=room.getBoundingClientRect();const width=Math.max(240,b.width),height=Math.max(240,b.height);app.renderer.resize(Math.round(width),Math.round(height));const k=Math.min(width/1200,height/700);world.scale.set(k);world.position.set((width-1200*k)/2,(height-700*k)/2);$('viewport').textContent=Math.round(width)+' × '+Math.round(height)}
new ResizeObserver(resize).observe(room);resize();
function newTarget(e){
 const homeX=145+(e.slot%5)*225,homeY=245+Math.floor(e.slot/5)*300;
 for(let tries=0;tries<24;tries++){
  const x=Math.max(100,Math.min(1100,homeX+(rand()-.5)*115));
  const y=Math.max(210,Math.min(560,homeY+(rand()-.5)*65));
  if(entities.every(other=>other===e||Math.hypot(x-other.tx,y-other.ty)>170)){
   e.tx=x;e.ty=y;e.pause=.6+rand()*2.3;return;
  }
 }
 e.tx=homeX;e.ty=homeY;e.pause=1.5;
}
function label(text){return new PIXI.Text({text,style:{fontFamily:'Georgia,serif',fontSize:21,fill:0xffe4ae,stroke:{color:0x1b1022,width:4},align:'center'}})}
async function makeStageWalkFrames(texture){
 // Temporary pose pair derived from the CURRENT evolution texture. Unlike
 // static-image sliding, the silhouette changes across the walking cycle.
 const source=texture.source?.resource;
 let img=source;
 if(!img||!(img.width||img.videoWidth)){
  const canvas=document.createElement('canvas');
  canvas.width=texture.width;canvas.height=texture.height;
  const rendererCanvas=canvas.getContext('2d');
  if(!texture.source?.resource)throw Error('Evolution texture has no image resource');
  img=texture.source.resource;
 }
 const w=texture.width,h=texture.height;
 if(!w||!h)throw Error('Invalid evolution texture');
 return [-1,1].map(direction=>{
  const canvas=document.createElement('canvas');
  const pad=Math.max(8,Math.ceil(w*.08));
  canvas.width=w+pad*2;canvas.height=h+Math.ceil(h*.05);
  const ctx=canvas.getContext('2d',{alpha:true});
  const band=Math.max(1,Math.ceil(h/110));
  for(let y=0;y<h;y+=band){
   const bh=Math.min(band,h-y),ratio=y/h;
   // Preserve the complete image while alternating lower-body stride.
   const offset=Math.sin(ratio*Math.PI*2)*w*.012*direction+
     (ratio>.68?Math.sin((ratio-.68)/.32*Math.PI)*w*.035*direction:0);
   ctx.drawImage(img,0,y,w,bh,pad+offset,y,w,bh+0.3);
  }
  return PIXI.Texture.from(canvas);
 });
}
async function makeCleanWalkFrames(name){
 // Derive two genuinely distinct raster frames from the approved portrait pixels.
 // Do not crop crowded atlas cells: those contain other Guardians and cut-off tails.
 const img=new Image();img.decoding='async';
 img.src='../assets/familiars/canon/'+name+'-guardian.webp';
 await img.decode();
 const w=img.naturalWidth,h=img.naturalHeight;
 if(!w||!h)throw Error('Missing canonical portrait for '+name);
 const padding=Math.ceil(w*.16),outW=w+padding*2,outH=h+Math.ceil(h*.12);
 return [-1,1].map(direction=>{
  const canvas=document.createElement('canvas');canvas.width=outW;canvas.height=outH;
  const ctx=canvas.getContext('2d',{alpha:true});
  // A subtle articulated stride: displace horizontal bands differently while
  // preserving every original pixel, including ears, tails and wings.
  const strip=Math.max(1,Math.ceil(h/90));
  for(let y=0;y<h;y+=strip){
   const band=Math.min(strip,h-y),relative=y/h;
   const sway=Math.sin(relative*Math.PI*2.3)*w*.015*direction;
   const footShift=relative>.7?Math.sin((relative-.7)/.3*Math.PI)*w*.025*direction:0;
   const x=padding+sway+footShift;
   const bounce=(1-relative)*h*.007*direction;
   ctx.drawImage(img,0,y,w,band,x,y+bounce,w,band+1);
  }
  return PIXI.Texture.from(canvas);
 });
}

await Promise.all(names.map(async(name,i)=>{
 try{
  const texture=await PIXI.Assets.load('../assets/familiars/canon/'+name+'-guardian.webp');
  const root=new PIXI.Container();root.x=145+(i%5)*225;root.y=245+Math.floor(i/5)*300;
  const shadow=new PIXI.Graphics();shadow.ellipse(0,0,65,12).fill({color:0x000000,alpha:.26});root.addChild(shadow);
  const sprite=new PIXI.Sprite(texture);sprite.anchor.set(.5,1);const scale=Math.min(170/Math.max(1,texture.width),165/Math.max(1,texture.height));sprite.scale.set(scale);sprite.y=-10;root.addChild(sprite);
  const text=label(name.charAt(0).toUpperCase()+name.slice(1));text.anchor.set(.5,0);text.y=20;root.addChild(text);
  const e={root,sprite,shadow,name,slot:i,tx:root.x,ty:root.y,pause:rand()*2,playing:0,phase:rand()*6.28,speed:42+rand()*23,baseScale:scale,walkTexture:null,walkFrames:[],walkClock:0,baseTexture:texture};
  // Keep the approved two-frame assets for the original four.
  // For the six missing sets, build complete clean frames directly from their
  // canonical portraits. This is temporary raster deformation, not new painted art.
  const framesPromise=i<4
   ?Promise.all([1,2].map(n=>PIXI.Assets.load('../assets/atelier/v2/fitted/companions/'+name+'_walk_'+n+'.webp')))
   :makeCleanWalkFrames(name);
  framesPromise.then(frames=>{e.walkFrames=frames;})
   .catch(error=>console.warn('Using portrait fallback for',name,error));
  sprite.eventMode='static';sprite.cursor='pointer';sprite.on('pointertap',()=>{e.playing=1.3;e.pause=1.3});
  guardianLayer.addChild(root);entities.push(e);loaded++;$('loaded').textContent=loaded+' / 10';
 }catch(err){console.warn('Guardian art unavailable:',name,err)}
}));

// Stage-aware, isolated Velora loader. Upload the reviewed transparent PNGs to
// pixi-sanctuary/frames/velora/<stage>/walk-1.png and walk-2.png.
// Missing frames never replace the existing working animation.
const velora=entities.find(e=>e.name==='velora');
const stagePicker=$('velora-stage');
if(velora&&stagePicker){
 const defaultFrames=await Promise.all([1,2].map(n=>PIXI.Assets.load('../assets/atelier/v2/fitted/companions/velora_walk_'+n+'.webp'))).catch(()=>velora.walkFrames.slice());
 const defaultBase=velora.baseTexture;
 const stageCache=new Map();
 let requestId=0;
 const applyStage=(stage,base,frames,source)=>{
  velora.baseTexture=base;
  velora.walkFrames=frames;
  velora.walkClock=0;
  velora.sprite.texture=base;
  velora.sprite.scale.set(Math.min(170/Math.max(1,base.width),165/Math.max(1,base.height)));
  velora.sprite.y=-10;
  velora.stage=stage;
  velora.frameSource=source;
  status.textContent='Velora '+stage+': '+source;
 };
 stagePicker.onchange=async()=>{
  const stage=stagePicker.value,id=++requestId;
  stagePicker.disabled=true;
  try{
   if(stageCache.has(stage)){
    const saved=stageCache.get(stage);
    applyStage(stage,saved.base,saved.frames,saved.source);
    return;
   }
   const base=stage==='new-bond'?defaultBase:await PIXI.Assets.load('../sanctuary/assets/evolutions/velora/'+stage+'/walk.webp');
   if(id!==requestId)return;
   let frames=[],source='temporary articulated stage walking';
   try{
    const urls=[1,2].map(n=>'./frames/velora/'+stage+'/walk-'+n+'.png');
    frames=await Promise.all(urls.map(url=>PIXI.Assets.load(url)));
    if(frames.some(t=>!t||!t.width||!t.height))throw Error('Empty walking frame');
    source='two transparent walking frames';
   }catch(error){
    frames=await makeStageWalkFrames(base);
    console.info('Using temporary stage walking until approved PNG pairs are uploaded:',stage,error);
   }
   if(id!==requestId)return;
   stageCache.set(stage,{base,frames,source});
   applyStage(stage,base,frames,source);
  }catch(error){
   console.warn('Velora stage load failed; original art preserved',error);
   stagePicker.value='new-bond';
   applyStage('new-bond',defaultBase,defaultFrames,'fallback original approved art');
  }finally{
   if(id===requestId)stagePicker.disabled=false;
  }
 };
 stagePicker.onchange(); // Load uploaded New Bond pair on initial render.
}
// Read-only live account bridge. Parent remains the only owner of progress and room persistence.
let liveRoster=null,liveRoom=null;
function applyLiveState(payload){
 if(!payload||!Array.isArray(payload.pets))return;
 liveRoster=payload.pets;liveRoom=payload.room||null;
 for(const [id,entry] of furnitureSprites){const pos=liveRoom?.positions?.[id];if(pos&&Number.isFinite(Number(pos.x))&&Number.isFinite(Number(pos.y))){entry.sprite.x=Math.max(35,Math.min(1165,Number(pos.x)*.57));entry.sprite.y=Math.max(200,Math.min(685,Number(pos.y)*.69))}entry.sprite.visible=!liveRoom?.stored?.includes(id)}
 const owned=new Map(payload.pets.map(p=>[String(p.type||'').toLowerCase(),p]));
 for(const e of entities){
  const p=owned.get(e.name);
  e.root.visible=!!p;
  if(p){
   const labelNode=e.root.children.find(x=>x instanceof PIXI.Text);
   if(labelNode)labelNode.text=String(p.name||e.name)+' · Lv '+(Number(p.level)||1);
   e.savedStage=String(p.stage||'new-bond');
   const requested=e.savedStage,token=e.stageRequest=(e.stageRequest||0)+1;
   if(e.name==='velora'&&stagePicker){stagePicker.value=requested;stagePicker.onchange?.()}
   else PIXI.Assets.load('../sanctuary/assets/evolutions/'+e.name+'/'+requested+'/walk.webp').then(texture=>{
    if(e.stageRequest!==token||!e.root.visible)return;
    e.baseTexture=texture;e.sprite.texture=texture;e.walkFrames=[];
    e.sprite.scale.set(Math.min(170/Math.max(1,texture.width),165/Math.max(1,texture.height)));
   }).catch(()=>{});

  }
 }
 const count=entities.filter(e=>e.root.visible).length;
 status.textContent=count+' saved Guardians connected · room state '+(liveRoom?'received':'unavailable');
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==window.parent)return;
 if(event.data?.type==='MAJICK_STATE')applyLiveState(event.data.payload);
});
if(window.parent!==window)window.parent.postMessage({type:'MAJICK_PIXI_SANCTUARY_READY'},location.origin);
if(!entities.length){status.textContent='Guardian images could not load. Please check network access.';return}
status.textContent='PixiJS running · select a stage to test Velora’s two walking poses';
$('toggle').textContent=paused?'Resume movement':'Pause movement';
$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off');
$('toggle').onclick=()=>{paused=!paused;$('toggle').textContent=paused?'Resume movement':'Pause movement'};
$('reset').onclick=()=>entities.forEach((e,i)=>{e.root.position.set(145+(i%5)*225,245+Math.floor(i/5)*300);e.tx=e.root.x;e.ty=e.root.y;e.pause=1;e.sprite.texture=e.baseTexture;e.walkClock=0;e.sprite.scale.set(e.baseScale);e.sprite.y=-10});
$('stress').onclick=()=>{stress=!stress;$('stress').setAttribute('aria-pressed',String(stress));$('stress').textContent='Stress test: '+(stress?'on':'off')};
$('motion').onclick=()=>{ambient=!ambient;$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off')};
let last=performance.now(),frames=0,total=0,moving=0,elapsed=0;
app.ticker.add(()=>{
 const now=performance.now(),dt=Math.min((now-last)/1000,.06);last=now;frames++;total+=dt;elapsed+=dt;
 moving=0;
 if(!paused)for(const e of entities){
  e.phase+=dt*3;
  if(e.playing>0){e.playing-=dt;e.sprite.texture=e.baseTexture;e.sprite.rotation=Math.sin(e.phase*5)*.11;e.sprite.y=-10-Math.abs(Math.sin(e.phase*5))*13;continue}
  e.sprite.rotation=0;
  if(e.pause>0){e.pause-=dt;e.sprite.texture=e.baseTexture;e.sprite.scale.set(e.baseScale);e.sprite.y=-10+(ambient?Math.sin(e.phase)*2:0);continue}
  const dx=e.tx-e.root.x,dy=e.ty-e.root.y,dist=Math.hypot(dx,dy);
  if(dist<7){newTarget(e);continue}
  const ux=dx/dist,uy=dy/dist,step=Math.min(dist,e.speed*dt);
  const nextX=e.root.x+ux*step,nextY=e.root.y+uy*step;
  const blocked=entities.some(other=>other!==e&&other.root.visible&&Math.hypot(nextX-other.root.x,nextY-other.root.y)<168);
  if(blocked){newTarget(e);continue}
  moving++;
  e.root.x=nextX;e.root.y=nextY;
  if(e.walkFrames.length===2){
   e.walkClock+=dt;
   const frame=e.walkFrames[Math.floor(e.walkClock/.18)%2];
   if(e.sprite.texture!==frame)e.sprite.texture=frame;
  } else if(e.sprite.texture!==e.baseTexture)e.sprite.texture=e.baseTexture;
  // The six additional Guardians lack approved frame images. Give them
  // distinct species-specific movement until true character frames are supplied.
  const gait={
   vesper:{frequency:5,lift:4,tilt:.038},briar:{frequency:8,lift:9,tilt:.014},
   zephyr:{frequency:10,lift:13,tilt:.045},prism:{frequency:7,lift:5,tilt:.025},
   rook:{frequency:5.5,lift:3,tilt:.018},solara:{frequency:9,lift:8,tilt:.033}
  }[e.name]||{frequency:7,lift:7,tilt:.012};
  const stride=Math.sin(e.phase*gait.frequency);
  const scale=Math.min(170/Math.max(1,e.sprite.texture.width),165/Math.max(1,e.sprite.texture.height));
  e.sprite.scale.set(scale*(dx<0?-1:1)*(1+stride*.025),scale*(1-stride*.035));
  e.sprite.y=-10-Math.abs(stride)*gait.lift;
  e.sprite.rotation=stride*gait.tilt;
 }
 guardianLayer.children.sort((a,b)=>a.y-b.y);
 dots.visible=ambient;
 if(ambient){for(let i=0;i<dots.children.length;i++){const p=dots.children[i];p.alpha=.35+Math.sin(elapsed*1.3+i)*.2;p.y+=dt*(stress?32:5);if(p.y>650)p.y=15}}
 if(stress){for(let i=0;i<dots.children.length;i++){const p=dots.children[i];p.scale.set(2)}}else for(const p of dots.children)p.scale.set(1);
 if(total>=1){status.textContent=paused?'Movement paused · press Resume movement':moving+' Guardians walking · tap one to play';$('fps').textContent=Math.round(frames/total);$('ms').textContent=(total/frames*1000).toFixed(1)+' ms';$('moving').textContent=moving+' / '+entities.length;frames=0;total=0}
});
})();