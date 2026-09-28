// Sanctuary presence follows the actual owned roster, including Guardians beyond the four original Phaser slots.
(()=>{
 'use strict';
 if(typeof Game==='undefined')return;
 const VERSION='3.3.48';
 const ORIGINAL=new Set(['luna','ember','nova','mallow']);
 const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];
 const MOVES={luna:'lunaWalk',ember:'emberWalk',nova:'novaRun',mallow:'mallowHop'};
 function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
 function stage(g,scene){
   const state=scene?.v3317GuardianStates?.[g.type]||{};
   const level=Number(state.level||g.level||1),slug=state.stageSlug||g.stageSlug;
   return STAGES.includes(slug)?slug:level>=12?'celestial':level>=8?'ascendant':level>=5?'guardian':level>=3?'apprentice':'new-bond';
 }
 function canon(g){return window.MajickGuardianRegistry?.get?.(g.type)?.canon||String(g.type).replace(/[^a-z0-9-]/gi,'').toLowerCase()}
 function imageKey(g){return 'v3348-'+canon(g)+'-room'}
 function imageURL(g){return '../assets/familiars/canon/'+canon(g)+'-guardian.webp?v=3348'}
 function point(scene,g,index){
   const bed=scene.v3342Nooks?.[index]?.bed;
   if(bed)return {x:Math.max(160,Math.min((scene.worldWidth||2400)-160,bed.x+80)),y:Math.max(370,bed.y-80)};
   return {x:340+(index%5)*370,y:560+Math.floor(index/5)*110};
 }
 Game.prototype.v3348SyncRoster=function(){
   const rs=roster(this),owned=new Set(rs.map(g=>g.type));
   this.v3348Sprites=this.v3348Sprites||{};
   for(const [type,pet] of Object.entries(this.v3348Sprites))if(!owned.has(type)){
     this.tweens.killTweensOf(pet);pet.destroy();delete this.v3348Sprites[type];delete this[type];
   }
   rs.forEach((g,index)=>{
     if(ORIGINAL.has(g.type))return;
     const key=imageKey(g,this),existing=this.v3348Sprites[g.type];
     if(existing?.active&&existing.texture?.key===key)return;
     if(this['v3348Pending_'+g.type]===key)return;
     this['v3348Pending_'+g.type]=key;
     const add=()=>{
       this['v3348Pending_'+g.type]=null;
       if(!this.sys?.isActive?.()||!roster(this).some(x=>x.type===g.type))return;
       const old=this.v3348Sprites[g.type];if(old?.active){this.tweens.killTweensOf(old);old.destroy()}
       const p=point(this,g,index),pet=this.add.image(p.x,p.y,key).setOrigin(.5,1).setDepth(80);
       pet.setScale(Math.min(.7,Math.max(.15,240/Math.max(1,pet.height))));
       pet.setInteractive({useHandCursor:true});
       pet.on('pointerup',()=>{if(!this.editMode)this.openGuardianCarePanel?.(g.petId)});
       pet.setData('guardianId',g.petId);pet.setData('guardianName',g.name);
       this.v3348Sprites[g.type]=pet;this[g.type]=pet;
       this.v3320RefreshGuardianLabels?.(this.v3317CareState);
       this.v3348Roam(g.type);
     };
     if(this.textures.exists(key)){add();return}
     this.load.once('filecomplete-image-'+key,add);
     this.load.once('loaderror',file=>{if(file?.key===key)this['v3348Pending_'+g.type]=null});
     this.load.image(key,imageURL(g,this));this.load.start();
   });
   this.v3320RefreshGuardianLabels?.(this.v3317CareState);
 };
 Game.prototype.v3348Roam=function(type){
   const pet=this.v3348Sprites?.[type];if(!pet?.active||this.editMode)return false;
   const w=this.worldWidth||2400,h=this.worldHeight||950;
   const tx=Math.max(180,Math.min(w-180,pet.x+(Math.random()-.5)*530));
   const ty=Math.max(430,Math.min(h-135,pet.y+(Math.random()-.5)*230));
   pet.setFlipX(tx<pet.x);
   this.tweens.add({targets:pet,x:tx,y:ty,duration:2000+Math.random()*1700,ease:'Sine.inOut',onComplete:()=>{
     if(pet.active)this.time.delayedCall(1800+Math.random()*3000,()=>this.v3348Roam(type));
   }});
   return true;
 };
 const travel=Game.prototype.v3342TravelGuardian;
 Game.prototype.v3342TravelGuardian=function(type,target,action,bubble){
   const pet=this.v3348Sprites?.[type];if(!pet?.active)return travel?.call(this,type,target,action,bubble);
   if(this.editMode)return false;
   const p=typeof target==='string'?this.v3342ObjectPoint?.(target):target;if(!p)return false;
   this.tweens.killTweensOf(pet);pet.setFlipX(Number(p.x)<pet.x);
   this.tweens.add({targets:pet,x:Number(p.x)+50,y:Number(p.y)-25,duration:2200,ease:'Sine.inOut',onComplete:()=>{
     if(bubble)this.showPetMessage?.(pet,bubble,'#e7d2f5');
     this.v3342RecordUse?.(type,typeof target==='string'?target:'personal-nook');
     this.time.delayedCall(action==='sleep'?5200:2200,()=>this.v3348Roam(type));
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
   this.time.addEvent({delay:12000,loop:true,callback:()=>{
     for(const g of roster(this)){
       if(!ORIGINAL.has(g.type)){
         const p=this.v3348Sprites?.[g.type];
         if(p?.active&&!this.tweens.isTweening(p))this.v3348Roam(g.type);
         continue;
       }
       const p=this[g.type],move=MOVES[g.type];
       if(p?.active&&!this.editMode&&!this.tweens.isTweening(p)&&!this[g.type+'NextTimer']&&!this[g.type+'MoveTween']&&typeof this[move]==='function')this[move]();
     }
   }});
   return result;
 };
 window.MajickSanctuaryRoster={VERSION,stage,canon,inspect(scene){
   const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
   return {roster:roster(s).map(g=>({name:g.name,type:g.type,present:!!s?.[g.type]?.active,x:s?.[g.type]?.x,y:s?.[g.type]?.y})),dynamic:Object.keys(s?.v3348Sprites||{})};
 }};
})();
