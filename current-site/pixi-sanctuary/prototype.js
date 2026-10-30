/* Pixi render adapter. The parent account and Guardian care API own all saves. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),room=$('room'),status=$('status');
const registry=window.MajickGuardianRegistry;
const FLOOR={left:60,right:1140,top:490,bottom:650};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
// Shared Phaser-world coordinates, mapped reversibly onto the Pixi floor.
const toFloor=p=>({x:clamp(60+(Number(p.x)-100)*1080/2000,60,1140),y:clamp(490+(Number(p.y)-620)*160/260,490,650)});
const fromFloor=p=>({x:Math.round(100+(p.x-60)*2000/1080),y:Math.round(620+(p.y-490)*260/160)});
function failure(error){console.error(error);status.textContent='Graphics unavailable. Use the original Sanctuary above.';parent.postMessage({type:'MAJICK_PIXI_SANCTUARY_ERROR'},location.origin)}
if(!window.PIXI){failure(Error('Pixi unavailable'));return}
const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');let reduced=motionMedia.matches;
let paused=reduced,ambient=!reduced,stress=false,liveRoster=[],liveRoom=null,sequence=0,syncRevision=0;
const pending=new Map(),entities=new Map(),furnitureSprites=new Map(),revealGlows=new Map();
motionMedia.addEventListener('change',event=>{reduced=event.matches;if(reduced){paused=true;ambient=false;$('toggle').textContent='Resume movement';$('motion').textContent='Ambient effects: off';$('motion').setAttribute('aria-pressed','false')}});

const app=new PIXI.Application();
try{await app.init({width:1200,height:700,backgroundAlpha:0,antialias:false,resolution:Math.min(devicePixelRatio||1,2),preference:'webgl',powerPreference:'low-power'})}catch(error){failure(error);return}
room.append(app.canvas);
const world=new PIXI.Container(),objects=new PIXI.Container();app.stage.addChild(world);world.addChild(objects);objects.sortableChildren=true;
const sparks=new PIXI.Container();world.addChildAt(sparks,0);
// Pixi 8.6 uses FillPattern(texture, repetition), rather than the newer
// textureSpace options in the reference. One tiled constellation lives in room space.
const tileArt=new PIXI.Graphics();tileArt.rect(0,0,64,64).fill({color:0x000000,alpha:0});tileArt.star(16,18,4,5,1.5).fill({color:0xf7e0a2});tileArt.circle(45,43,1.5).fill({color:0xd6b4ef});
const constellationTexture=app.renderer.generateTexture({target:tileArt});tileArt.destroy();
const floorPattern=new PIXI.FillPattern(constellationTexture,'repeat');
const floorSigil=new PIXI.Graphics();floorSigil.ellipse(600,571,460,55).fill(floorPattern);floorSigil.alpha=.13;floorSigil.eventMode='none';sparks.addChild(floorSigil);

for(let i=0;i<24;i++){const spark=new PIXI.Graphics();spark.circle(0,0,1+i%3).fill({color:0xe3c38c,alpha:.25});spark.position.set(30+Math.random()*1140,20+Math.random()*440);sparks.addChild(spark)}
try{const texture=await PIXI.Assets.load('../assets/guardian-dorm-v1.png');const bg=new PIXI.Sprite(texture);bg.width=1200;bg.height=700;world.addChildAt(bg,0)}catch(error){console.warn('Room backdrop unavailable',error)}
function resize(){const b=room.getBoundingClientRect(),w=Math.max(240,b.width),h=Math.max(240,b.height);app.renderer.resize(w,h);const k=Math.min(w/1200,h/700);world.scale.set(k);world.position.set((w-1200*k)/2,(h-700*k)/2);$('viewport').textContent=Math.round(w)+' × '+Math.round(h)}
new ResizeObserver(resize).observe(room);resize();
function action(kind,fields={}){
 if(parent===window){$('care-result').textContent='Open Sanctuary inside Majick Studies to save changes.';return}
 const requestId=++sequence;
 const timer=setTimeout(()=>{if(pending.delete(requestId))$('care-result').textContent='Save was not confirmed. Retry after reconnecting.'},10000);
 pending.set(requestId,{timer,kind,...fields});
 parent.postMessage({type:'MAJICK_PIXI_ACTION',action:kind,requestId,...fields},location.origin);
 $('care-result').textContent='Saving…';
}
function care(kind,objectId){const petId=$('care-guardian').value;if(!petId){$('care-result').textContent='Choose a Guardian first.';return}action(kind,{petId,objectId})}
for(const kind of ['pet','play','feed','water','groom','sleep'])if($('care-'+kind))$('care-'+kind).onclick=()=>care(kind);
function updateEvolution(){
 const p=liveRoster.find(p=>String(p.id)===$('care-guardian').value),meta=p&&registry.get(p);
 if(!p||!meta){$('evolution-art').hidden=true;return}
 $('evolution-art').hidden=false;$('evolution-name').textContent=p.name+' · '+registry.stage(p.level).name;
 $('evolution-image').src='../assets/familiars/evolution_stages/'+meta.canon+'-'+registry.stage(p.level).slug+'.webp';
 $('evolution-image').alt=p.name+' · '+registry.stage(p.level).name+' evolution artwork';
}
$('care-guardian').onchange=updateEvolution;
let editing=false;
$('edit-furniture').onclick=()=>{editing=!editing;$('edit-furniture').setAttribute('aria-pressed',String(editing));$('edit-furniture').textContent='Arrange furniture: '+(editing?'on':'off')};
$('furniture-store').onclick=()=>{const id=$('furniture-select').value;if(id)action('furniture-store',{id,stored:true})};
$('furniture-place').onclick=()=>{const id=$('furniture-select').value;if(id)action('furniture-store',{id,stored:false})};
function applyFurniture(){
 for(const [id,{sprite,obj}] of furnitureSprites){const pos=toFloor(liveRoom?.positions?.[id]||obj.placement);sprite.position.set(pos.x,pos.y);sprite.zIndex=pos.y;const wasVisible=sprite.visible;sprite.visible=!!liveRoom?.owned?.includes(id)&&!liveRoom?.stored?.includes(id);if(sprite.visible&&!wasVisible)revealSprite(sprite)}
 const select=$('furniture-select'),selected=select.value;
 select.replaceChildren(new Option('Choose furniture',''));
 for(const [id,{obj}] of furnitureSprites)if(liveRoom?.owned?.includes(id))select.add(new Option(obj.displayName+(liveRoom.stored?.includes(id)?' (stored)':''),id));
 select.value=[...select.options].some(o=>o.value===selected)?selected:'';
}
let drag=null;
app.stage.eventMode='static';app.stage.hitArea=app.screen;
app.stage.on('globalpointermove',event=>{if(!drag)return;const p=objects.toLocal(event.global);drag.sprite.position.set(clamp(p.x,60,1140),clamp(p.y,490,650));drag.sprite.zIndex=drag.sprite.y;drag.moved=true});
function finishDrag(){if(!drag)return;const d=drag;drag=null;d.sprite.alpha=1;if(d.moved)action('furniture-position',{id:d.id,...fromFloor(d.sprite.position)})}
app.stage.on('pointerup',finishDrag);app.stage.on('pointerupoutside',finishDrag);
const furnitureReady=(async()=>{
 const response=await fetch('../sanctuary/assets/objects/objects-manifest.json');if(!response.ok)throw Error('Furniture manifest unavailable');
 const manifest=await response.json();
 await Promise.all(manifest.objects.filter(o=>o.enabled&&o.preload&&o.placement).map(async obj=>{
  try{
   const texture=await PIXI.Assets.load('../sanctuary/assets/objects/'+obj.filename),sprite=new PIXI.Sprite(texture);sprite.anchor.set(.5,1);sprite.scale.set(Number(obj.placement.width||180)*1200/2200/texture.width);interactiveSprite(sprite);
   sprite.on('pointerdown',event=>{if(!editing)return;event.stopPropagation();$('furniture-select').value=obj.id;drag={id:obj.id,sprite,moved:false};sprite.alpha=.75});
   sprite.on('pointertap',()=>{
    if(editing){$('furniture-select').value=obj.id;return}
    const careActions={'guardian-food-bowl':'feed','guardian-water-basin':'water','guardian-treat-jar':'treat','guardian-brush':'groom','guardian-play-rug':'play','guardian-toy-basket':'play'};
    if(careActions[obj.id])care(careActions[obj.id],obj.id);
    else if(obj.interaction==='assign-rest')care('sleep',obj.id);
    else if(obj.destination)parent.postMessage({type:'MAJICK_OPEN_ROUTE',route:obj.destination},location.origin);
    else $('care-result').textContent=obj.displayName;
   });
   objects.addChild(sprite);furnitureSprites.set(obj.id,{sprite,obj});applyFurniture();
  }catch(error){console.warn('Furniture artwork unavailable',obj.id,error)}
 }));
})();
const assetCache=new Map();
function artFor(canon,stage){
 const key=canon+':'+stage;
 if(!assetCache.has(key))assetCache.set(key,(async()=>{
  const original=['velora','cascade','solstice','aurelia'].includes(canon);
  // Six species have illustrated evolution cards, not transparent stage sprites.
  // Keep those cards in the profile; never walk an opaque card around the floor.
  const base=await PIXI.Assets.load(original?'../sanctuary/assets/evolutions/'+canon+'/'+stage+'/walk.webp':'../assets/familiars/canon/'+canon+'-guardian.webp');
  let frames=[],source=original?'stage artwork (no approved walking pair)':'transparent canonical portrait fallback; evolution artwork in profile';
  if(canon==='velora'){
   try{frames=await Promise.all([1,2].map(n=>PIXI.Assets.load('./frames/velora/'+stage+'/walk-'+n+'.png')));source='approved stage walking pair'}catch(error){console.info('Walking pair unavailable; preserving stage art',key)}
  }else if(stage==='new-bond'&&['cascade','solstice','aurelia'].includes(canon)){
   try{frames=await Promise.all([1,2].map(n=>PIXI.Assets.load('../assets/atelier/v2/fitted/companions/'+canon+'_walk_'+n+'.webp')));source='existing new-bond walking pair'}catch(error){console.info('Walking pair unavailable',key)}
  }
  return {base,frames,source};
 })().catch(error=>{assetCache.delete(key);throw error}));
 return assetCache.get(key);
}
function home(slot){const rows=Math.max(2,Math.ceil(liveRoster.length/6));return {x:130+(slot%6)*188,y:510+Math.floor(slot/6)*120/(rows-1)}}
function setTarget(e){const h=home(e.slot);e.tx=clamp(h.x+(Math.random()-.5)*160,90,1110);e.ty=clamp(h.y+(Math.random()-.5)*35,490,650);e.pause=.6+Math.random()*2.1;e.speed=30+Math.random()*16}
// Hit areas use the sprite's local coordinates, including its bottom-center anchor.
// Mirroring and room scaling are handled by Pixi's existing event transform.
function revealSprite(sprite){
 if(reduced||paused||document.hidden||!sprite.visible||!sprite.parent)return;
 let pulse=revealGlows.get(sprite);
 if(!pulse){const glow=new PIXI.Graphics();glow.eventMode='none';glow.ellipse(0,0,Math.max(24,sprite.width*.62),Math.max(18,sprite.height*.55)).fill({color:0xe9c775,alpha:.35});sprite.parent.addChildAt(glow,0);pulse={glow,elapsed:0};revealGlows.set(sprite,pulse)}
 pulse.elapsed=0;pulse.glow.position.set(sprite.x,sprite.y-sprite.height*.5);
}
function interactiveSprite(sprite){
 sprite.eventMode='static';sprite.cursor='pointer';
 sprite.hitArea=new PIXI.Rectangle(-sprite.texture.width/2,-sprite.texture.height,sprite.texture.width,sprite.texture.height);
 let over=false;
 sprite.on('pointerover',()=>{over=true;sprite.tint=0xe6d5ff;revealSprite(sprite)});
 sprite.on('pointerout',()=>{over=false;sprite.tint=0xffffff});
 sprite.on('pointerdown',()=>{sprite.tint=0xc5a6e8});
 sprite.on('pointerup',()=>{sprite.tint=over?0xe6d5ff:0xffffff});
 sprite.on('pointerupoutside',()=>{over=false;sprite.tint=0xffffff});
 sprite.on('pointercancel',()=>{over=false;sprite.tint=0xffffff});
 sprite.on('visibleChanged',()=>{if(sprite.visible)revealSprite(sprite)});
 return sprite;
}
function fit(e,texture,direction=1){if(!texture)return;const scale=Math.min(110/texture.width,105/texture.height);e.sprite.scale.set(scale*direction,scale);e.sprite.position.set(0,0);e.sprite.rotation=0;if(e.sprite instanceof PIXI.AnimatedSprite){if(e.sprite.textures.length===1)e.sprite.gotoAndStop(0)}else e.sprite.texture=texture}
function setMotion(e,moving,direction=1){const sprite=e.sprite;if(!(sprite instanceof PIXI.AnimatedSprite))return;sprite.scale.x=Math.abs(sprite.scale.x)*(direction<0?-1:1);if(!moving||paused||document.hidden){if(sprite.playing)sprite.gotoAndStop(0);return}if(sprite.textures.length>1&&!sprite.playing)sprite.play()}
function installFrames(e,art){const previous=e.sprite;const textures=art.frames.length>=2?art.frames:[art.base];const sprite=new PIXI.AnimatedSprite(textures.map(texture=>({texture,time:180})));sprite.anchor.set(.5,1);sprite.loop=true;sprite.autoUpdate=true;interactiveSprite(sprite);sprite.on('pointertap',()=>{$('care-guardian').value=e.id;care('pet')});e.root.removeChild(previous);previous.destroy();e.root.addChildAt(sprite,1);e.sprite=sprite;fit(e,art.base);sprite.gotoAndStop(0);revealSprite(sprite)}
function createEntity(id,slot){
 const root=new PIXI.Container(),shadow=new PIXI.Graphics();shadow.ellipse(0,0,42,8).fill({color:0x000000,alpha:.25});root.addChild(shadow);
 const sprite=new PIXI.Sprite(PIXI.Texture.EMPTY);sprite.anchor.set(.5,1);root.addChild(sprite);
 const caption=new PIXI.Text({text:'',style:new PIXI.TextStyle({fontFamily:'Georgia, serif',fontSize:16,fontWeight:'bold',fill:0xffe4ae,stroke:{color:0x1b1022,width:4,join:'round'},dropShadow:{color:0x110b19,alpha:.75,blur:3,distance:2},align:'center'})});caption.anchor.set(.5,0);caption.y=8;root.addChild(caption);
 const h=home(slot);root.position.set(h.x,h.y);objects.addChild(root);
 const e={id,slot,root,sprite,caption,tx:h.x,ty:h.y,pause:0,speed:38,clock:0,token:0,base:null,frames:[],ready:false};
 sprite.eventMode='static';sprite.cursor='pointer';sprite.on('pointertap',()=>{$('care-guardian').value=id;care('pet')});
 entities.set(id,e);return e;
}
function rosterReport(){return [...entities.values()].map(e=>({petId:e.id,name:e.pet.name,canon:e.canon,stage:e.stage,present:e.ready,frameSource:e.frameSource}))}
function publish(){if(parent!==window)parent.postMessage({type:'MAJICK_SANCTUARY_ROSTER_V3350',rows:rosterReport()},location.origin)}
async function applyState(payload){
 if(!Array.isArray(payload?.pets))return;
 const revision=++syncRevision;liveRoster=payload.pets;liveRoom=payload.room;
 applyFurniture();
 const select=$('care-guardian'),selected=select.value;
 select.replaceChildren(new Option('Choose a saved Guardian',''));
 for(const p of liveRoster)select.add(new Option(p.name+' · Lv '+p.level+' · '+p.id,String(p.id)));
 select.value=liveRoster.some(p=>String(p.id)===selected)?selected:(liveRoster.length?String(payload.activePetId||liveRoster[0].id):'');
 updateEvolution();
 const ids=new Set(liveRoster.map(p=>String(p.id)));
 for(const [id,e] of entities)if(!ids.has(id)){e.token++;e.root.destroy({children:true});entities.delete(id)}
 await Promise.all(liveRoster.map(async(p,slot)=>{
  const id=String(p.id),meta=registry.get(p),canon=meta?.canon;
  const e=entities.get(id)||createEntity(id,slot);e.pet=p;e.slot=slot;e.caption.text=p.name+' · Lv '+p.level;
  const stage=registry.stage(p.level).slug,key=canon+':'+stage;
  if(e.key===key&&e.ready)return;
  const token=++e.token;e.key=key;e.canon=canon;e.stage=stage;e.ready=false;
  try{
   if(!canon)throw Error('Unrecognized saved Guardian species: '+p.type);
   const art=await artFor(canon,stage);if(token!==e.token||!entities.has(id))return;
   e.base=art.base;e.frames=art.frames;e.frameSource=art.source;e.clock=0;installFrames(e,art);e.ready=true;
  }catch(error){console.warn('Guardian artwork unavailable',id,error);e.frameSource=error.message}
 }));
 if(revision!==syncRevision)return;
 const ready=[...entities.values()].filter(e=>e.ready).length;$('loaded').textContent=ready+' / '+liveRoster.length;
 status.textContent=ready+' of '+liveRoster.length+' saved Guardians accounted for';publish();
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent)return;
 const data=event.data;
 if(data?.type==='MAJICK_STATE')applyState(data.payload);
 if(data?.type==='MAJICK_SANCTUARY_ROSTER_REQUEST_V3350')publish();
 if(data?.type==='MAJICK_PIXI_ACTION_RESULT'){
  const request=pending.get(data.requestId);if(!request)return;clearTimeout(request.timer);pending.delete(data.requestId);
  $('care-result').textContent=data.message||(data.ok?'Saved':'Could not save');
  if(data.ok&&request.petId){const e=entities.get(request.petId),object=furnitureSprites.get(data.travelObject||request.objectId);if(e&&object?.sprite.visible){e.tx=object.sprite.x;e.ty=object.sprite.y;e.pause=0}}
  if(!data.ok)applyFurniture();
 }
});
$('toggle').textContent=paused?'Resume movement':'Pause movement';$('toggle').onclick=()=>{paused=!paused;$('toggle').textContent=paused?'Resume movement':'Pause movement'};
$('reset').onclick=()=>{for(const e of entities.values()){const h=home(e.slot);e.root.position.set(h.x,h.y);e.tx=h.x;e.ty=h.y;e.pause=1;if(e.base){fit(e,e.base);setMotion(e,false)}}};
$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off');$('motion').onclick=()=>{ambient=!ambient;$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off')};
$('stress').onclick=()=>{stress=!stress;$('stress').setAttribute('aria-pressed',String(stress));$('stress').textContent='Stress test: '+(stress?'on':'off')};
let frames=0,seconds=0,ambientTime=0;
app.ticker.maxFPS=45;app.ticker.add(ticker=>{
 const dt=Math.min(ticker.deltaMS/1000,.06);let moving=0;
 for(const [sprite,pulse] of revealGlows){
  pulse.elapsed+=dt;const t=pulse.elapsed/.55;
  if(t>=1||sprite.destroyed||!sprite.visible||paused||document.hidden){pulse.glow.destroy();revealGlows.delete(sprite);continue}
  pulse.glow.position.set(sprite.x,sprite.y-sprite.height*.5);pulse.glow.alpha=(1-t)*.8;pulse.glow.scale.set(1+t*.2);
 }

 sparks.visible=ambient;if(ambient&&!paused&&!document.hidden){ambientTime+=dt;floorSigil.alpha=.11+Math.sin(ambientTime*.9)*.025}if(ambient&&!document.hidden)for(const spark of sparks.children){if(spark===floorSigil)continue;spark.y+=dt*(stress?24:5);if(spark.y>470)spark.y=20}
 for(const e of entities.values()){
  e.root.zIndex=e.root.y;if(!e.ready)continue;if(paused||document.hidden){setMotion(e,false);continue;}
  if(e.pause>0){e.pause-=dt;setMotion(e,false);continue}
  const dx=e.tx-e.root.x,dy=e.ty-e.root.y,d=Math.hypot(dx,dy);
  if(d<3){setMotion(e,false);setTarget(e);continue}
  const step=Math.min(d,dt*e.speed);e.root.x=clamp(e.root.x+dx/d*step,90,1110);e.root.y=clamp(e.root.y+dy/d*step,490,650);e.clock+=dt;
  setMotion(e,true,dx<0?-1:1);moving++;
 }
 frames++;seconds+=dt;if(seconds>=1){$('fps').textContent=Math.round(frames/seconds);$('ms').textContent=(seconds/frames*1000).toFixed(1)+' ms';$('moving').textContent=moving+' / '+entities.size;frames=0;seconds=0}
});
await furnitureReady.catch(error=>{$('care-result').textContent=error.message});
// Inspection exposes renderer facts, not another state or persistence owner.
window.MajickPixiSanctuary=Object.freeze({inspect:()=>({ready:true,floor:FLOOR,roster:rosterReport(),guardians:[...entities.values()].map(e=>({id:e.id,x:e.root.x,y:e.root.y,spriteY:e.sprite.y,stage:e.stage,canon:e.canon,frames:e.frames.length})),furniture:[...furnitureSprites].map(([id,e])=>({id,x:e.sprite.x,y:e.sprite.y,visible:e.sprite.visible})),pending:pending.size}),app});
status.textContent='Room ready · waiting for saved Guardians';
if(parent!==window)parent.postMessage({type:'MAJICK_PIXI_SANCTUARY_READY'},location.origin);
})();
