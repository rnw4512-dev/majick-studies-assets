// Sanctuary presence follows the actual owned roster, including Guardians beyond the four original Phaser slots.
(()=>{
 'use strict';
 if(typeof Game==='undefined')return;
 const VERSION='3.3.50';
 const ORIGINAL=new Set(['luna','ember','nova','mallow']);
 const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];
 const MOVES={luna:'lunaWalk',ember:'emberWalk',nova:'novaRun',mallow:'mallowHop'};
 const TOYS={'starter-ribbon-toy':'🎐','comet-ball':'◉','celestial-feather-wand':'✧','moonflower-plush':'❀','rune-puzzle':'◇','moonvine-plush':'❀','ribbon-comet':'🎐','crystal-bubble-orb':'◌','strategy-rune-tokens':'♟','sunburst-ball':'☀','velvet-moon-cushion':'☾'};
 function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
 function stage(g,scene){
   const state=scene?.v3317GuardianStates?.[g.type]||{};
   const level=Number(state.level||g.level||1),slug=state.stageSlug||g.stageSlug;
   return STAGES.includes(slug)?slug:level>=12?'celestial':level>=8?'ascendant':level>=5?'guardian':level>=3?'apprentice':'new-bond';
 }
 function identity(g){return window.MajickGuardianRegistry?.getFor?.(g)||window.MajickGuardianRegistry?.get?.(g.type)||null}
 function resolvedType(g){return identity(g)?.type||String(g.type||'')}
 function canon(g){return identity(g)?.canon||String(g.type).replace(/[^a-z0-9-]/gi,'').toLowerCase()}
 function imageKey(g){return 'v3348-'+canon(g)+'-room'}
 function imageURL(g){return '../assets/familiars/canon/'+canon(g)+'-guardian.webp?v=3348'}
 function tintValue(meta){
   const hex=String(meta?.accent||'').replace('#','');
   const n=parseInt(hex,16);
   return Number.isFinite(n)?n:null;
 }
 function applyIndividualTint(target,meta){
   const tint=tintValue(meta);
   if(!target?.setTint||tint==null)return;
   try{target.setTint(tint)}catch(_){}
 }
 function point(scene,g,index){
   const bed=scene.v3342Nooks?.[index]?.bed;
   if(bed)return {x:Math.max(160,Math.min((scene.worldWidth||2400)-160,bed.x+80)),y:Math.max(370,bed.y-80)};
   return {x:340+(index%5)*370,y:560+Math.floor(index/5)*110};
 }
 function motionProfile(g){
   const type=resolvedType(g);
   if(['vesper','zephyr','prism'].includes(type))return {bob:12,tilt:2.4,squash:.035,pace:.92,idle:10};
   if(['briar','solara','nova'].includes(type))return {bob:8,tilt:3.2,squash:.05,pace:1.05,idle:6};
   if(['rook','luna','mallow'].includes(type))return {bob:7,tilt:2.2,squash:.038,pace:.98,idle:5};
   return {bob:8,tilt:2.6,squash:.04,pace:1,idle:6};
 }
 function baseScale(pet){
   const sx=Math.abs(Number(pet?.getData?.('v3351BaseScaleX')??pet?.scaleX??1))||1;
   const sy=Math.abs(Number(pet?.getData?.('v3351BaseScaleY')??pet?.scaleY??1))||1;
   return {sx,sy};
 }
 function rememberBaseMotion(pet){
   if(!pet?.setData)return;
   const b=baseScale(pet);
   pet.setData('v3351BaseScaleX',b.sx);pet.setData('v3351BaseScaleY',b.sy);
   pet.setData('v3351MotionState','idle');
 }
 function resetDynamicPose(pet){
   if(!pet?.active)return;
   const b=baseScale(pet);
   try{pet.setScale?.(b.sx,b.sy)}catch(_){}
   try{pet.setAngle?.(0)}catch(_){if('angle' in pet)pet.angle=0}
   try{pet.setAlpha?.(1)}catch(_){if('alpha' in pet)pet.alpha=1}
   try{pet.setData?.('v3351MotionState','idle')}catch(_){}
 }
 function stopDynamicMotion(scene,pet){
   if(!pet)return;
   try{scene.tweens.killTweensOf(pet)}catch(_){}
   resetDynamicPose(pet);
 }
 function idleDynamicGuardian(scene,g){
   const pet=scene.v3348Sprites?.[g.petId];
   if(!pet?.active||scene.editMode)return false;
   const profile=motionProfile(g),b=baseScale(pet);
   pet.setData?.('v3351MotionState','breathing');
   scene.tweens.add({
     targets:pet,
     scaleX:b.sx*(1+profile.squash*.45),
     scaleY:b.sy*(1-profile.squash*.32),
     y:pet.y-profile.idle,
     duration:700,
     yoyo:true,
     ease:'Sine.inOut',
     onComplete:()=>{if(pet.active)resetDynamicPose(pet)}
   });
   return true;
 }
 function playStyle(g){
   const type=resolvedType(g);
   if(['vesper','rook'].includes(type))return 'arcane-float';
   if(['zephyr'].includes(type))return 'dash';
   if(['briar','solara','mallow'].includes(type))return 'double-hop';
   if(['prism','cascade','ember'].includes(type))return 'wiggle-bob';
   if(['luna','velora'].includes(type))return 'pounce';
   if(['nova','solstice'].includes(type))return 'fox-skip';
   return 'bounce';
 }
 function sleepAura(scene,pet,result){
   if(!pet?.active)return null;
   try{
     const glyph=result?.familiarBed?'☾ ✦ ☾':'☾  z  z';
     const aura=scene.add?.text?.(pet.x,pet.y-118,glyph,{fontFamily:'Georgia',fontSize:result?.familiarBed?'25px':'22px',color:result?.familiarBed?'#ffe4a8':'#d9caf0'}).setOrigin?.(.5)?.setDepth?.(509);
     if(aura){
       scene.tweens.add({targets:aura,y:aura.y-26,alpha:.28,duration:1700,yoyo:true,repeat:1,ease:'Sine.inOut',onComplete:()=>aura.destroy?.()});
     }
     if(result?.familiarBed)scene.createSparkles?.(pet.x,pet.y-95,18);
     return aura;
   }catch(_){return null}
 }
 function wakeDynamicGuardian(scene,g){
   const pet=scene.v3348Sprites?.[g.petId];if(!pet?.active)return false;
   const b=baseScale(pet);
   stopDynamicMotion(scene,pet);
   pet.setData?.('v3353SleepState','waking');
   scene.tweens.add({targets:pet,y:pet.y-16,scaleX:b.sx*1.06,scaleY:b.sy*.94,angle:pet.flipX?-3:3,duration:320,yoyo:true,ease:'Sine.inOut',onComplete:()=>{
     resetDynamicPose(pet);
     pet.setData?.('v3353SleepState','awake');
   }});
   return true;
 }
 function favoritePlayBurst(scene,pet,g,result){
   if(!pet?.active||!result?.favoriteBonus)return;
   try{scene.createSparkles?.(pet.x,pet.y-110,26)}catch(_){}
   try{
     const glyphs=['✦','✧','⋆'];
     glyphs.forEach((glyph,i)=>{
       const star=scene.add?.text?.(pet.x+(i-1)*24,pet.y-90-(i%2)*18,glyph,{fontFamily:'Georgia',fontSize:'24px',color:'#ffe8a8'}).setOrigin?.(.5)?.setDepth?.(510);
       if(star)scene.tweens.add({targets:star,y:star.y-70,x:star.x+(i-1)*18,alpha:0,duration:850+i*120,ease:'Sine.out',onComplete:()=>star.destroy?.()});
     });
   }catch(_){}
 }
 function actionDynamicGuardian(scene,g,action='care'){
   const pet=scene.v3348Sprites?.[g.petId];if(!pet?.active)return false;
   const b=baseScale(pet);
   stopDynamicMotion(scene,pet);
   pet.setData?.('v3351MotionState',action);
   if(action==='sleep'){
     pet.setData?.('v3353SleepState','sleeping');
     scene.tweens.add({targets:pet,angle:-5,scaleY:b.sy*.9,scaleX:b.sx*1.05,alpha:.88,duration:850,yoyo:true,repeat:1,ease:'Sine.inOut',onComplete:()=>{
       if(!pet.active)return;
       try{pet.setAngle?.(-5)}catch(_){pet.angle=-5}
       try{pet.setScale?.(b.sx*1.05,b.sy*.9)}catch(_){}
       try{pet.setAlpha?.(.9)}catch(_){pet.alpha=.9}
       pet.setData?.('v3351MotionState','sleeping');
     }});
   }else if(action==='play'){
     const style=playStyle(g);
     pet.setData?.('v3352PlayStyle',style);
     if(style==='arcane-float'){
       scene.tweens.add({targets:pet,y:pet.y-42,angle:pet.flipX?-10:10,scaleX:b.sx*1.03,scaleY:b.sy*.97,duration:360,yoyo:true,repeat:2,ease:'Sine.inOut',onComplete:()=>resetDynamicPose(pet)});
     }else if(style==='dash'){
       scene.tweens.add({targets:pet,x:pet.x+(pet.flipX?-54:54),y:pet.y-14,angle:pet.flipX?-5:5,duration:190,yoyo:true,repeat:2,ease:'Quad.inOut',onComplete:()=>resetDynamicPose(pet)});
     }else if(style==='double-hop'){
       scene.tweens.add({targets:pet,y:pet.y-46,scaleX:b.sx*.98,scaleY:b.sy*1.05,duration:240,yoyo:true,repeat:3,ease:'Quad.out',onComplete:()=>resetDynamicPose(pet)});
     }else if(style==='wiggle-bob'){
       scene.tweens.add({targets:pet,y:pet.y-26,angle:pet.flipX?-12:12,scaleX:b.sx*1.06,scaleY:b.sy*.94,duration:220,yoyo:true,repeat:4,ease:'Sine.inOut',onComplete:()=>resetDynamicPose(pet)});
     }else if(style==='pounce'){
       scene.tweens.add({targets:pet,x:pet.x+(pet.flipX?-34:34),y:pet.y-30,angle:pet.flipX?-4:4,scaleX:b.sx*1.05,scaleY:b.sy*.95,duration:260,yoyo:true,repeat:2,ease:'Quad.out',onComplete:()=>resetDynamicPose(pet)});
     }else if(style==='fox-skip'){
       scene.tweens.add({targets:pet,x:pet.x+(pet.flipX?-24:24),y:pet.y-36,angle:pet.flipX?-8:8,duration:230,yoyo:true,repeat:3,ease:'Sine.out',onComplete:()=>resetDynamicPose(pet)});
     }else{
       scene.tweens.add({targets:pet,y:pet.y-34,angle:pet.flipX?-7:7,scaleX:b.sx*1.04,scaleY:b.sy*.96,duration:280,yoyo:true,repeat:2,ease:'Quad.out',onComplete:()=>resetDynamicPose(pet)});
     }
   }else if(action==='affection'){
     scene.tweens.add({targets:pet,y:pet.y-22,scaleX:b.sx*1.05,scaleY:b.sy*1.05,duration:330,yoyo:true,ease:'Sine.inOut',onComplete:()=>resetDynamicPose(pet)});
   }else{
     scene.tweens.add({targets:pet,angle:pet.flipX?-3:3,scaleY:b.sy*.96,duration:260,yoyo:true,ease:'Sine.inOut',onComplete:()=>resetDynamicPose(pet)});
   }
   return true;
 }
 function report(scene){
   const rows=roster(scene).map(g=>{
     const type=resolvedType(g),meta=identity(g)||{};
     const pet=scene.v3348PetById?.[g.petId],walk=scene['v3317Walk_'+type],action=scene['v3317Action_'+type];
     const visible=pet?.active&&((pet.visible!==false&&Number(pet.alpha??1)>.05)||(ORIGINAL.has(type)&&String(g.type||'')===type&&((walk?.active&&walk.visible!==false)||(action?.active&&action.visible!==false))));
     return {petId:g.petId,name:meta.name||g.name,type,canon:meta.canon||canon(g),species:meta.species||g.species,accent:meta.accent||g.accent,personality:meta.personality||g.personality,variantIndex:meta.variantIndex||0,present:!!visible};
   });
   try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_ROSTER_V3350',rows},location.origin)}catch(_){}
   return rows;
 }
 function makeSprite(scene,g,index,key){
   if(!roster(scene).some(x=>x.petId===g.petId)||!scene.sys?.isActive?.())return;
   const existing=scene.v3348Sprites[g.petId];
   if(existing?.active&&existing.texture?.key===key)return;
   if(existing?.active){stopDynamicMotion(scene,existing);existing.destroy()}
   const p=point(scene,g,index),pet=key==='v3350-placeholder'
     ?scene.add.text(p.x,p.y,g.icon||'✦',{fontFamily:'Georgia',fontSize:'80px',color:'#f2d9ff'}).setOrigin(.5,1).setDepth(80)
     :scene.add.image(p.x,p.y,key).setOrigin(.5,1).setDepth(80);
   if(key!=='v3350-placeholder')pet.setScale(Math.min(.7,Math.max(.15,240/Math.max(1,pet.height))));
   const meta=identity(g)||{},type=resolvedType(g);
   applyIndividualTint(pet,meta);
   pet.setInteractive({useHandCursor:true});pet.on('pointerup',()=>{if(!scene.editMode)scene.openGuardianCarePanel?.(g.petId)});
   pet.setData('guardianId',g.petId);pet.setData('guardianName',meta.name||g.name);pet.setData('guardianType',type);pet.v3350Texture=key;
   rememberBaseMotion(pet);
   scene.v3348Sprites[g.petId]=pet;scene.v3348PetById[g.petId]=pet;
   if(!scene[type]||!scene[type].active)scene[type]=pet;
   scene.v3320RefreshGuardianLabels?.(scene.v3317CareState);
   scene.v3348Roam(g.petId);report(scene);
 }
 Game.prototype.v3348SyncRoster=function(){
   const rs=roster(this),owned=new Set(rs.map(g=>g.petId)),seenTypes=new Set();
   this.v3348Sprites=this.v3348Sprites||{};this.v3348PetById=this.v3348PetById||{};this.v3348Loading=this.v3348Loading||{};this.v3348Fallback=this.v3348Fallback||{};
   for(const id of Object.keys(this.v3348PetById))if(!owned.has(id))delete this.v3348PetById[id];
   for(const [id,pet] of Object.entries(this.v3348Sprites))if(!owned.has(id)){
     stopDynamicMotion(this,pet);pet.destroy();delete this.v3348Sprites[id];delete this.v3348PetById[id];
     const type=pet.getData?.('guardianType');if(type&&this[type]===pet)delete this[type];
   }
   rs.forEach((g,index)=>{
     const type=resolvedType(g),first=!seenTypes.has(type);seenTypes.add(type);
     // Only reuse an original protected Phaser body when saved type and canon identity agree.
     if(first&&ORIGINAL.has(type)&&String(g.type||'')===type){
       const meta=identity(g)||{};
       if(this[type]?.active){
         applyIndividualTint(this[type],meta);
         applyIndividualTint(this['v3317Walk_'+type],meta);
         applyIndividualTint(this['v3317Action_'+type],meta);
         this.v3348PetById[g.petId]=this[type];
       }
       return;
     }
     const primary=imageKey(g,this),key=this.v3348Fallback[primary]||primary,existing=this.v3348Sprites[g.petId];
     if(existing?.active&&existing.v3350Texture===key){this.v3348PetById[g.petId]=existing;return}
     if(key==='v3350-placeholder'){makeSprite(this,g,index,key);return}
     if(this.textures.exists(key)){makeSprite(this,g,index,key);return}
     if(this.v3348Loading[key])return;
     this.v3348Loading[key]=true;
     this.load.once('filecomplete-image-'+key,()=>{delete this.v3348Loading[key];this.v3348SyncRoster()});
     this.load.once('loaderror',file=>{
       if(file?.key!==key)return;
       delete this.v3348Loading[key];
       const fallback='v3350-icon-'+canon(g);
       this.v3348Fallback[primary]=fallback;
       if(this.textures.exists(fallback)){this.v3348SyncRoster();return}
       this.load.once('filecomplete-image-'+fallback,()=>this.v3348SyncRoster());
       this.load.once('loaderror',f=>{if(f?.key===fallback){this.v3348Fallback[primary]='v3350-placeholder';this.v3348SyncRoster()}});
       this.load.image(fallback,'../assets/familiars/icons/'+canon(g)+'-icon.webp?v=3350');this.load.start();
     });
     this.load.image(key,imageURL(g,this));this.load.start();
   });
   this.v3320RefreshGuardianLabels?.(this.v3317CareState);
   report(this);
 };
 Game.prototype.v3348Roam=function(id){
   const pet=this.v3348Sprites?.[id];if(!pet?.active||this.editMode||this.tweens.isTweening?.(pet))return false;
   const g=roster(this).find(x=>x.petId===id);if(!g)return false;
   const profile=motionProfile(g),b=baseScale(pet),w=this.worldWidth||2400,h=this.worldHeight||950;
   const tx=Math.max(180,Math.min(w-180,pet.x+(Math.random()-.5)*530));
   const ty=Math.max(430,Math.min(h-135,pet.y+(Math.random()-.5)*230));
   const duration=(2000+Math.random()*1700)/profile.pace;
   pet.setFlipX(tx<pet.x);pet.setData?.('v3351MotionState','walking');
   const pulse=this.tweens.add({
     targets:pet,
     scaleX:b.sx*(1+profile.squash),
     scaleY:b.sy*(1-profile.squash),
     angle:pet.flipX?-profile.tilt:profile.tilt,
     duration:240,
     yoyo:true,
     repeat:-1,
     ease:'Sine.inOut'
   });
   this.tweens.add({targets:pet,x:tx,y:ty,duration,ease:'Sine.inOut',onComplete:()=>{
     try{pulse?.stop?.()}catch(_){}
     if(!pet.active)return;
     resetDynamicPose(pet);
     idleDynamicGuardian(this,g);
     this.time.delayedCall(1900+Math.random()*2800,()=>this.v3348Roam(id));
   }});
   return true;
 };
 const careReaction=Game.prototype.v3317CareReaction;
 Game.prototype.v3317CareReaction=function(result){
   const response=careReaction?.call(this,result);
   if(result?.ok!==false&&this.v3348Sprites?.[result?.guardianId]?.active){
     const g=roster(this).find(x=>x.petId===result.guardianId);
     if(result.travelObject){
       if(g)g.familiarBed=!!result.familiarBed;
       this.v3342TravelGuardian(result.guardianId,result.travelObject,result.visualAction||result.action,result.message);
     }
     else if(g)actionDynamicGuardian(this,g,result.action||'care');
   }
   if(result?.ok===false||result?.action!=='play')return response;
   const pet=this.v3348PetById?.[result.guardianId]||this[result.guardianType];if(!pet?.active)return response;
   const g=roster(this).find(x=>x.petId===result.guardianId);
   const glyph=TOYS[result.itemId]||'✦';
   const toy=this.add.text(pet.x,pet.y-110,glyph,{fontFamily:'Georgia',fontSize:'44px',color:'#ffe5ad',stroke:'#21102d',strokeThickness:4}).setOrigin(.5).setDepth(505);
   favoritePlayBurst(this,pet,g||{type:result.guardianType},result);
   this.tweens.add({targets:toy,x:pet.x+62,y:pet.y-200,alpha:0,angle:result.favoriteBonus?35:15,duration:1700,ease:'Sine.out',onComplete:()=>toy.destroy()});
   if(result.favoriteBonus)this.createSparkles?.(pet.x,pet.y-120,20);
   return response;
 };
 const travel=Game.prototype.v3342TravelGuardian;
 Game.prototype.v3342TravelGuardian=function(type,target,action,bubble){
   const g=roster(this).find(x=>x.petId===type)||roster(this).find(x=>x.type===type),pet=g&&this.v3348Sprites?.[g.petId];
   if(!pet?.active)return travel?.call(this,type,target,action,bubble);
   if(this.editMode)return false;
   const p=typeof target==='string'?this.v3342ObjectPoint?.(target):target;if(!p)return false;
   stopDynamicMotion(this,pet);pet.setFlipX(Number(p.x)<pet.x);
   const profile=motionProfile(g),b=baseScale(pet);
   pet.setData?.('v3351MotionState','walking-to-care');
   const pulse=this.tweens.add({targets:pet,scaleX:b.sx*(1+profile.squash),scaleY:b.sy*(1-profile.squash),angle:pet.flipX?-profile.tilt:profile.tilt,duration:230,yoyo:true,repeat:-1,ease:'Sine.inOut'});
   this.tweens.add({targets:pet,x:Number(p.x)+50,y:Number(p.y)-25,duration:2200/profile.pace,ease:'Sine.inOut',onComplete:()=>{
     try{pulse?.stop?.()}catch(_){}
     resetDynamicPose(pet);
     if(bubble)this.showPetMessage?.(pet,bubble,'#e7d2f5');
     this.v3342RecordUse?.(g.type,typeof target==='string'?target:'personal-nook');
     actionDynamicGuardian(this,g,action||'care');
     if(action==='sleep')sleepAura(this,pet,{familiarBed:!!g.familiarBed});
     this.time.delayedCall(action==='sleep'?5200:2400,()=>{
       if(action==='sleep'){
         wakeDynamicGuardian(this,g);
         this.time.delayedCall(520,()=>this.v3348Roam(g.petId));
       }else this.v3348Roam(g.petId);
     });
   }});
   return true;
 };
 const apply=Game.prototype.v3320ApplyCareSnapshot;
 Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
   const result=apply?.call(this,snapshot);this.v3348SyncRoster();return result;
 };
 const create=Game.prototype.create;
 Game.prototype.create=function(){
   const result=create.apply(this,arguments);
   this.time.delayedCall(900,()=>this.v3348SyncRoster());
   this.time.delayedCall(2300,()=>report(this));
   this.time.addEvent({delay:12000,loop:true,callback:()=>{
     for(const g of roster(this)){
       if(this.v3348Sprites?.[g.petId]){
         const p=this.v3348Sprites[g.petId];
         if(p?.active&&!this.tweens.isTweening(p))this.v3348Roam(g.petId);
         continue;
       }
       const p=this[g.type],move=MOVES[g.type];
       if(p?.active&&!this.editMode&&!this.tweens.isTweening(p)&&!this[g.type+'NextTimer']&&!this[g.type+'MoveTween']&&typeof this[move]==='function')this[move]();
     }
     report(this);
   }});
   return result;
 };
 window.MajickSanctuaryRoster={VERSION,stage,canon,inspect(scene){
   const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
   return {roster:report(s),dynamic:Object.keys(s?.v3348Sprites||{}),motion:Object.fromEntries(Object.entries(s?.v3348Sprites||{}).map(([id,p])=>[id,p?.getData?.('v3351MotionState')||'unknown'])),playStyles:Object.fromEntries(Object.entries(s?.v3348Sprites||{}).map(([id,p])=>[id,p?.getData?.('v3352PlayStyle')||''])),sleepStates:Object.fromEntries(Object.entries(s?.v3348Sprites||{}).map(([id,p])=>[id,p?.getData?.('v3353SleepState')||'']))};
 }};
 window.addEventListener('message',ev=>{
   if(ev.origin!==location.origin||ev.data?.type!=='MAJICK_SANCTUARY_ROSTER_REQUEST_V3350')return;
   const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
   if(scene){scene.v3348SyncRoster();report(scene)}
 });
})();
