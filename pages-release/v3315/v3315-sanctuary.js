// V3.3.15 — stage resolver + evolved interaction art around protected Guardian movement.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
function evoManifest(scene){
  try{return scene.cache.json.get('majick-evolution-manifest')||null}catch(_){return null}
}
function resolveStage(scene,level){
  const n=Math.max(1,Number(level)||1),m=evoManifest(scene);
  if(m?.levelResolution){
    const row=m.levelResolution.find(x=>n>=x.minLevel&&(x.maxLevel==null||n<=x.maxLevel));
    if(row)return {slug:row.stage,name:m.stages?.[row.stage]?.displayName||row.stage,index:m.stageOrder?.indexOf(row.stage)??0};
  }
  if(n>=12)return {slug:'celestial',name:'Celestial',index:4};
  if(n>=8)return {slug:'ascendant',name:'Ascendant',index:3};
  if(n>=5)return {slug:'guardian',name:'Guardian',index:2};
  if(n>=3)return {slug:'apprentice',name:'Apprentice',index:1};
  return {slug:'new-bond',name:'New Bond',index:0};
}
function state(scene,type){
  const raw=scene.v3314GuardianStates?.[type];
  if(!raw)return null;
  const st=resolveStage(scene,raw.level);
  return Object.assign({},raw,{canon:raw.canon||CANON[type],stage:st.name,stageSlug:st.slug,stageIndex:st.index});
}
function asset(scene,type,action){
  const s=state(scene,type);if(!s)return null;
  const m=evoManifest(scene);
  const row=m?.guardians?.[s.canon]?.stages?.[s.stageSlug]?.assets;
  const rel=row?.[action];
  return rel?'./assets/evolutions/'+rel+'?v=3315':'./assets/evolutions/'+s.canon+'/'+s.stageSlug+'/'+action+'.webp?v=3315';
}
function key(scene,type,action){
  const s=state(scene,type);if(!s)return null;
  return 'evo-'+s.canon+'-'+s.stageSlug+'-'+action;
}

Game.prototype.v3315ResolveStage=function(level){return resolveStage(this,level)};
Game.prototype.v3315GuardianState=function(type){return state(this,type)};
Game.prototype.v3315EvolutionAsset=function(type,action){return asset(this,type,action||'walk')};

// V3.3.15 NOTES FORGE DESK: keep the fallback/procedural desk useful too.
Game.prototype.openStudyDesk=function(){
  this.createSparkles?.(1080,610,12);
  this.showInteractionPanel?.(
    'Moonlit Study Desk',
    'Notes Forge + Study Workspace',
    'Add your own WGU notes or documents, turn them into practice, or continue studying.',
    [
      {label:'ADD STUDY MATERIAL',primary:true,run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route:'addmaterial'})},
      {label:'CONTINUE STUDYING',run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route:'mission'})},
      {label:'OPEN MY JOURNAL',run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route:'journal'})},
      {label:'OPEN LIVING GRIMOIRE',run:()=>this.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route:'livinggrimoire'})},
      {label:'STUDY WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker?.('desk')}
    ]
  );
};

Game.prototype.v3315EnsureEvolutionTexture=function(type,action,done){
  const k=key(this,type,action),src=asset(this,type,action);
  if(!k||!src){done?.(null);return;}
  if(this.textures.exists(k)){done?.(k);return;}
  if(this['__loading_'+k]){this.time.delayedCall(120,()=>this.v3315EnsureEvolutionTexture(type,action,done));return;}
  this['__loading_'+k]=true;
  this.load.image(k,src);
  this.load.once('complete',()=>{this['__loading_'+k]=false;done?.(this.textures.exists(k)?k:null)});
  this.load.once('loaderror',()=>{this['__loading_'+k]=false;done?.(null)});
  this.load.start();
};

Game.prototype.v3315EnsureWalkSkin=function(type){
  const pet=this[type];if(!pet||this['v3315WalkSkin_'+type])return;
  this.v3315EnsureEvolutionTexture(type,'walk',k=>{
    if(!k||!pet?.active||this['v3315WalkSkin_'+type])return;
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+1).setVisible(false);
    const maxW=Math.max(110,pet.displayWidth*1.35),maxH=Math.max(120,pet.displayHeight*1.55);
    const sc=Math.min(maxW/Math.max(1,img.width),maxH/Math.max(1,img.height));
    img.setScale(sc);
    this['v3315WalkSkin_'+type]=img;
  });
};

Game.prototype.v3315UpdateWalkSkins=function(){
  this.__v3315WalkPositions=this.__v3315WalkPositions||{};
  const now=this.time.now;
  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];if(!pet?.active)return;
    this.v3315EnsureWalkSkin(type);
    const img=this['v3315WalkSkin_'+type],prev=this.__v3315WalkPositions[type];
    const moved=prev&&(Math.abs(pet.x-prev.x)>1.5||Math.abs(pet.y-prev.y)>1.5);
    this.__v3315WalkPositions[type]={x:pet.x,y:pet.y,at:now};
    if(!img?.active)return;
    img.setPosition(pet.x,pet.y).setDepth((pet.depth||70)+1);
    const actionActive=!!this['v3315Action_'+type]?.active;
    if(moved&&!actionActive){
      img.setVisible(true);
      pet.setAlpha(.08);
      this['__v3315LastMove_'+type]=now;
    }else if(!actionActive&&now-(this['__v3315LastMove_'+type]||0)>260){
      img.setVisible(false);
      pet.setAlpha(1);
    }else if(actionActive){
      img.setVisible(false);
    }
  });
};

Game.prototype.v3315ShowGuardianAction=function(type,action,duration){
  const pet=this[type];if(!pet)return;
  this.v3315EnsureEvolutionTexture(type,action,k=>{
    if(!k||!pet?.active)return;
    const old=this['v3315Action_'+type];try{old?.destroy()}catch(_){}
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+2);
    const maxW=Math.max(110,pet.displayWidth*1.35),maxH=Math.max(120,pet.displayHeight*1.55);
    const sc=Math.min(maxW/Math.max(1,img.width),maxH/Math.max(1,img.height));
    img.setScale(sc);
    this['v3315Action_'+type]=img;
    const oldAlpha=pet.alpha;pet.setAlpha(.08);
    const follow=this.time.addEvent({delay:50,loop:true,callback:()=>{if(img.active&&pet.active)img.setPosition(pet.x,pet.y)}});
    this.time.delayedCall(Math.max(700,Number(duration)||2200),()=>{
      follow.remove(false);try{img.destroy()}catch(_){}
      if(pet.active)pet.setAlpha(oldAlpha);
      if(this['v3315Action_'+type]===img)this['v3315Action_'+type]=null;
    });
  });
};

const baseStart=Game.prototype.startFamiliarObjectInteraction;
if(typeof baseStart==='function'){
  Game.prototype.startFamiliarObjectInteraction=function(familiarId,objectId){
    const result=baseStart.call(this,familiarId,objectId);
    if(String(objectId||'').includes('bed'))this.v3315ShowGuardianAction(familiarId,'sleep',3000);
    else if(String(objectId||'').includes('toy')||String(objectId||'').includes('play'))this.v3315ShowGuardianAction(familiarId,'play',2200);
    return result;
  };
}

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  baseCreate.call(this);
  this.time.addEvent({delay:90,loop:true,callback:()=>this.v3315UpdateWalkSkins()});
  this.time.delayedCall(180,()=>{
    ['luna','ember','nova','mallow'].forEach(type=>{
      const pet=this[type],s=state(this,type);if(!pet||!s)return;
      pet.setData('majickStage',s.stageSlug);
      pet.setData('majickStageName',s.stage);
      pet.setData('majickEvolutionWalk',asset(this,type,'walk'));
      pet.setData('majickEvolutionPlay',asset(this,type,'play'));
      pet.setData('majickEvolutionSleep',asset(this,type,'sleep'));
    });
  });
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};if(d.type!=='MAJICK_GUARDIAN_LEVELS_V3314'||!d.guardians)return;
  const scene=window.majickPhaserGame?.scene?.getScene('Game');if(!scene)return;
  scene.v3314GuardianStates=d.guardians;
  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=scene[type],s=state(scene,type);if(!pet||!s)return;
    pet.setData('majickStage',s.stageSlug);
    pet.setData('majickStageName',s.stage);
    scene.v3315EnsureWalkSkin(type);
  });
});

})();

// V3317_PROTECTED_MOTION_RESTORE
// The generated evolution-action sheets were not suitable as live movement sprites.
// Keep the original 33 Phase 4 movement images authoritative until true individual
// stage-specific motion art is approved.
(function(){
  if(typeof Game==='undefined')return;
  Game.prototype.v3315EnsureWalkSkin=function(type){
    const pet=this[type];
    const skin=this['v3315WalkSkin_'+type];
    try{skin?.destroy()}catch(_){}
    this['v3315WalkSkin_'+type]=null;
    if(pet?.active)pet.setAlpha(1).setVisible(true);
  };
  Game.prototype.v3315UpdateWalkSkins=function(){
    ['luna','ember','nova','mallow'].forEach(type=>{
      const pet=this[type],skin=this['v3315WalkSkin_'+type],action=this['v3315Action_'+type];
      try{skin?.destroy()}catch(_){}
      try{action?.destroy()}catch(_){}
      this['v3315WalkSkin_'+type]=null;
      this['v3315Action_'+type]=null;
      if(pet?.active)pet.setAlpha(1).setVisible(true);
    });
  };
  Game.prototype.v3315ShowGuardianAction=function(type){
    const pet=this[type];
    if(pet?.active)pet.setAlpha(1).setVisible(true);
  };
  const _restoreCreate=Game.prototype.create;
  Game.prototype.create=function(){
    _restoreCreate.call(this);
    this.time.delayedCall(300,()=>this.v3315UpdateWalkSkins());
  };
})();
