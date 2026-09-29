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
 function point(scene,g,index){
   const bed=scene.v3342Nooks?.[index]?.bed;
   if(bed)return {x:Math.max(160,Math.min((scene.worldWidth||2400)-160,bed.x+80)),y:Math.max(370,bed.y-80)};
   return {x:340+(index%5)*370,y:560+Math.floor(index/5)*110};
 }
 function report(scene){
   const rows=roster(scene).map(g=>{
     const type=resolvedType(g),meta=identity(g)||{};
     const pet=scene.v3348PetById?.[g.petId],walk=scene['v3317Walk_'+type],action=scene['v3317Action_'+type];
     const visible=pet?.active&&((pet.visible!==false&&Number(pet.alpha??1)>.05)||(ORIGINAL.has(type)&&String(g.type||'')===type&&((walk?.active&&walk.visible!==false)||(action?.active&&action.visible!==false))));
     return {petId:g.petId,name:meta.name||g.name,type,canon:meta.canon||canon(g),present:!!visible};
   });
   try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_ROSTER_V3350',rows},location.origin)}catch(_){}
   return rows;
 }
 function makeSprite(scene,g,index,key){
   if(!roster(scene).some(x=>x.petId===g.petId)||!scene.sys?.isActive?.())return;
   const existing=scene.v3348Sprites[g.petId];
   if(existing?.active&&existing.texture?.key===key)return;
   if(existing?.active){scene.tweens.killTweensOf(existing);existing.destroy()}
   const p=point(scene,g,index),pet=key==='v3350-placeholder'
     ?scene.add.text(p.x,p.y,g.icon||'✦',{fontFamily:'Georgia',fontSize:'80px',color:'#f2d9ff'}).setOrigin(.5,1).setDepth(80)
     :scene.add.image(p.x,p.y,key).setOrigin(.5,1).setDepth(80);
   if(key!=='v3350-placeholder')pet.setScale(Math.min(.7,Math.max(.15,240/Math.max(1,pet.height))));
   pet.setInteractive({useHandCursor:true});pet.on('pointerup',()=>{if(!scene.editMode)scene.openGuardianCarePanel?.(g.petId)});
   const meta=identity(g)||{},type=resolvedType(g);
   pet.setData('guardianId',g.petId);pet.setData('guardianName',meta.name||g.name);pet.setData('guardianType',type);pet.v3350Texture=key;
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
     this.tweens.killTweensOf(pet);pet.destroy();delete this.v3348Sprites[id];delete this.v3348PetById[id];
     const type=pet.getData?.('guardianType');if(type&&this[type]===pet)delete this[type];
   }
   rs.forEach((g,index)=>{
     const type=resolvedType(g),first=!seenTypes.has(type);seenTypes.add(type);
     // Only reuse an original protected Phaser body when saved type and canon identity agree.
     if(first&&ORIGINAL.has(type)&&String(g.type||'')===type){
       if(this[type]?.active)this.v3348PetById[g.petId]=this[type];
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
   const w=this.worldWidth||2400,h=this.worldHeight||950;
   const tx=Math.max(180,Math.min(w-180,pet.x+(Math.random()-.5)*530));
   const ty=Math.max(430,Math.min(h-135,pet.y+(Math.random()-.5)*230));
   pet.setFlipX(tx<pet.x);
   this.tweens.add({targets:pet,x:tx,y:ty,duration:2000+Math.random()*1700,ease:'Sine.inOut',onComplete:()=>{
     if(pet.active)this.time.delayedCall(1800+Math.random()*3000,()=>this.v3348Roam(id));
   }});
   return true;
 };
 const careReaction=Game.prototype.v3317CareReaction;
 Game.prototype.v3317CareReaction=function(result){
   const response=careReaction?.call(this,result);
   if(result?.ok!==false&&this.v3348Sprites?.[result?.guardianId]?.active){
     if(result.travelObject)this.v3342TravelGuardian(result.guardianId,result.travelObject,result.visualAction||result.action,result.message);
     else if(result.action==='affection'){
       const pet=this.v3348Sprites[result.guardianId];
       this.tweens.add({targets:pet,y:pet.y-24,duration:340,yoyo:true,ease:'Sine.inOut'});
     }
   }
   if(result?.ok===false||result?.action!=='play')return response;
   const pet=this.v3348PetById?.[result.guardianId]||this[result.guardianType];if(!pet?.active)return response;
   const glyph=TOYS[result.itemId]||'✦';
   const toy=this.add.text(pet.x,pet.y-110,glyph,{fontFamily:'Georgia',fontSize:'44px',color:'#ffe5ad',stroke:'#21102d',strokeThickness:4}).setOrigin(.5).setDepth(505);
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
   this.tweens.killTweensOf(pet);pet.setFlipX(Number(p.x)<pet.x);
   this.tweens.add({targets:pet,x:Number(p.x)+50,y:Number(p.y)-25,duration:2200,ease:'Sine.inOut',onComplete:()=>{
     if(bubble)this.showPetMessage?.(pet,bubble,'#e7d2f5');
     this.v3342RecordUse?.(g.type,typeof target==='string'?target:'personal-nook');
     this.time.delayedCall(action==='sleep'?5200:2200,()=>this.v3348Roam(g.petId));
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
   return {roster:report(s),dynamic:Object.keys(s?.v3348Sprites||{})};
 }};
 window.addEventListener('message',ev=>{
   if(ev.origin!==location.origin||ev.data?.type!=='MAJICK_SANCTUARY_ROSTER_REQUEST_V3350')return;
   const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
   if(scene){scene.v3348SyncRoster();report(scene)}
 });
})();
