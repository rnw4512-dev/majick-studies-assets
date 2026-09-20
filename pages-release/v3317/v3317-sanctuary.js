// Majick Studies V3.3.17 — CLEAN PHASER SANCTUARY RUNTIME
// Runtime chain: base Game.js -> V3.3.10 protected motion -> THIS FILE.
// Do not load V3.3.11–V3.3.15 sanctuary wrappers with this file.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const NAMES={luna:'Velora',ember:'Cascade',nova:'Solstice',mallow:'Aurelia'};
const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];

function stageFromLevel(level){
  const n=Math.max(1,Number(level)||1);
  return n>=12?'celestial':n>=8?'ascendant':n>=5?'guardian':n>=3?'apprentice':'new-bond';
}
function guardianState(scene,type){
  const known=scene.v3317GuardianStates?.[type]||{};
  const level=Math.max(1,Number(known.level||scene[type]?.getData?.('level')||1)||1);
  return {type,canon:CANON[type]||type,level,stage:known.stageSlug||known.stage||stageFromLevel(level)};
}
function evoKey(scene,type,action){
  const s=guardianState(scene,type);
  return 'v3317-'+s.canon+'-'+s.stage+'-'+action;
}
function evoSrc(scene,type,action){
  const s=guardianState(scene,type);
  return './assets/evolutions/'+s.canon+'/'+s.stage+'/'+action+'.webp?v=3317-final';
}
function manifest(scene){
  try{return scene.cache.json.get('majick-object-manifest')||{objects:[]}}catch(_){return {objects:[]}}
}
function route(scene,destination,extra={}){
  if(!destination)return;
  scene.sendToStudyApp?.('MAJICK_OPEN_ROUTE_V3311',{route:destination,...extra});
}
function objectArt(scene,key,width){
  const c=scene.add.container(0,0);
  const im=scene.add.image(0,55,key).setOrigin(.5,1);
  im.setScale((width||240)/Math.max(1,im.width));
  c.add(im);
  return c;
}
function activateObject(scene,obj){
  if(!obj)return;
  const panel=obj.panelAction;
  if(panel&&typeof scene[panel]==='function')return scene[panel]();

  switch(obj.id){
    case 'arcane-stacks': return scene.openArcaneStacks?.();
    case 'moonlit-study-desk': return scene.openStudyDesk?.();
    case 'observatory-telescope': return scene.openObservatory?.();
    case 'crystal-focus-pedestal':
    case 'study-apothecary': return scene.openCrystalFocus?.();
    case 'familiar-lounge': return scene.openFamiliarLounge?.();
    case 'magic-mirror': return scene.showMirrorPanel?.();
  }

  if(obj.interaction==='assign-rest')return scene.openFamiliarObjectPicker?.(obj.placement?.slot||obj.id);
  if(obj.interaction==='progress-mirror')return scene.showMirrorPanel?.();
  if(obj.interaction==='guardian-care')return route(scene,'companions',{objectId:obj.id});
  if(obj.interaction==='open-route')return route(scene,obj.destination,{objectId:obj.id});
  if(obj.interaction==='world-navigation'){
    if(obj.destination)return route(scene,obj.destination,{objectId:obj.id});
    return scene.showToast?.(obj.displayName,'This Sanctuary path is not unlocked yet.');
  }
}

// -----------------------------------------------------------------------------
// RICH PANELS — directly on V3.3.17, no dependency on old sanctuary wrappers.
// -----------------------------------------------------------------------------
Game.prototype.openArcaneStacks=function(){
  this.createSparkles?.(360,390,12);
  this.showInteractionPanel?.('The Arcane Stacks','Living Library',
    'The shelves connect to your Living Grimoire, mistake repair, and study guide.',
    [
      {label:'OPEN LIVING GRIMOIRE',primary:true,run:()=>route(this,'livinggrimoire')},
      {label:'MISTAKE GRIMOIRE',run:()=>route(this,'grimoire')},
      {label:'STUDY GUIDE',run:()=>route(this,'guide')},
      {label:'READ WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('stacks')}
    ]);
};
Game.prototype.openStudyDesk=function(){
  this.createSparkles?.(1080,610,12);
  this.showInteractionPanel?.('Moonlit Study Desk','Notes Forge + Study Workspace',
    'Add WGU material, continue studying, write notes, or study beside a Guardian.',
    [
      {label:'ADD STUDY MATERIAL',primary:true,run:()=>route(this,'addmaterial')},
      {label:'CONTINUE STUDYING',run:()=>route(this,'mission')},
      {label:'OPEN MY JOURNAL',run:()=>route(this,'journal')},
      {label:'OPEN LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')},
      {label:'STUDY WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('desk')}
    ]);
};
Game.prototype.openObservatory=function(){
  this.showInteractionPanel?.('Celestial Observatory','Upper College',
    'Use the telescope for readiness, final review, constellations, and Guardian evolution.',
    [
      {label:'CONSTELLATION',primary:true,run:()=>route(this,'constellation')},
      {label:'FINAL REVIEW',run:()=>route(this,'finalreview')},
      {label:'GUARDIAN EVOLUTIONS',run:()=>route(this,'companions')},
      {label:'STARGAZE WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('observatory')}
    ]);
};
Game.prototype.openCrystalFocus=function(){
  const s=this.studyState||{};
  this.createSparkles?.(1480,655,18);
  this.showInteractionPanel?.('Crystal Focus Alcove','Quiet Study',
    'Your crystal reserve is '+(s.crystals||0)+'. Use focus tools or invite a Guardian.',
    [
      {label:'FOCUS TOOLS',primary:true,run:()=>route(this,'focus')},
      {label:'MAGIC VAULT',run:()=>route(this,'vault')},
      {label:'STUDY PLANNER',run:()=>route(this,'planner')},
      {label:'FOCUS WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('focus')}
    ]);
};

// -----------------------------------------------------------------------------
// MANIFEST OBJECTS — one owner.
// -----------------------------------------------------------------------------
Game.prototype.createDecor=function(){
  const m=manifest(this);
  const live=(m.objects||[]).filter(o=>o.enabled&&o.preload&&o.placement&&this.textures.exists('obj-'+o.id));
  this.decorItems=this.decorItems||[];

  if(!live.length){
    console.warn('V3.3.17 manifest objects unavailable; using base decor');
    return;
  }

  live.forEach(obj=>{
    const width=(obj.placement.width||240)*(obj.scale||1);
    const item=this.createMovableDecor(
      obj.id,
      obj.placement.x,
      obj.placement.y,
      obj.displayName,
      ()=>objectArt(this,'obj-'+obj.id,width),
      ()=>activateObject(this,obj)
    );
    if(!item)return;

    item.setData('objectId',obj.id);
    item.setData('manifestObject',obj);
    item.setData('blocksWalking',!!obj.blocksWalking);

    // Base createMovableDecor already supplies edit-mode drag + saved positions.
    item.setDepth(30+Math.round(item.y/30));
    item.on('drag',()=>item.setDepth(30+Math.round(item.y/30)));
    item.on('dragend',()=>item.setDepth(30+Math.round(item.y/30)));
  });
};
Game.prototype.getSanctuaryObjectManifest=function(){return manifest(this)};
Game.prototype.getSanctuaryObject=function(id){return (manifest(this).objects||[]).find(o=>o.id===id)||null};

// -----------------------------------------------------------------------------
// EVOLVED VISUALS — movement remains controlled by the protected Phase 4 mover.
// -----------------------------------------------------------------------------
Game.prototype.v3317LoadAction=function(type,action,done){
  const k=evoKey(this,type,action),src=evoSrc(this,type,action);
  if(this.textures.exists(k)){done?.(k);return;}
  if(this['__v3317Loading_'+k]){
    this.time.delayedCall(100,()=>this.v3317LoadAction(type,action,done));
    return;
  }
  this['__v3317Loading_'+k]=true;
  this.load.image(k,src);
  this.load.once('complete',()=>{
    this['__v3317Loading_'+k]=false;
    done?.(this.textures.exists(k)?k:null);
  });
  this.load.once('loaderror',()=>{
    this['__v3317Loading_'+k]=false;
    done?.(null);
  });
  this.load.start();
};

Game.prototype.v3317EnsureWalkSkin=function(type){
  const pet=this[type];if(!pet?.active)return;
  const expected=evoKey(this,type,'walk');
  const old=this['v3317Walk_'+type];
  if(old?.active&&old.texture?.key===expected)return;
  try{old?.destroy()}catch(_){}
  this['v3317Walk_'+type]=null;

  this.v3317LoadAction(type,'walk',k=>{
    if(!k||!pet?.active)return;
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+2);
    const targetH=Math.max(285,Math.min(380,(pet.displayHeight||165)*2));
    img.setScale(targetH/Math.max(1,img.height));
    this['v3317Walk_'+type]=img;
  });
};

Game.prototype.v3317ShowAction=function(type,action,duration){
  const pet=this[type];if(!pet?.active)return;
  this.v3317LoadAction(type,action,k=>{
    if(!k||!pet?.active)return;
    const old=this['v3317Action_'+type];try{old?.destroy()}catch(_){}
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+3);
    const targetH=Math.max(285,Math.min(380,(pet.displayHeight||165)*2));
    img.setScale(targetH/Math.max(1,img.height));
    this['v3317Action_'+type]=img;
    const follow=this.time.addEvent({delay:45,loop:true,callback:()=>{
      if(img.active&&pet.active)img.setPosition(pet.x,pet.y).setDepth((pet.depth||70)+3);
    }});
    this.time.delayedCall(Math.max(900,Number(duration)||2400),()=>{
      follow.remove(false);
      try{img.destroy()}catch(_){}
      if(this['v3317Action_'+type]===img)this['v3317Action_'+type]=null;
    });
  });
};

Game.prototype.v3317UpdateGuardianVisuals=function(){
  this.__v3317Prev=this.__v3317Prev||{};
  const now=this.time.now;

  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];if(!pet?.active)return;
    this.v3317EnsureWalkSkin(type);

    const walk=this['v3317Walk_'+type],action=this['v3317Action_'+type];
    const prev=this.__v3317Prev[type]||{x:pet.x,y:pet.y};
    const dx=pet.x-prev.x,dy=pet.y-prev.y;
    const moving=Math.abs(dx)>.8||Math.abs(dy)>.8;
    this.__v3317Prev[type]={x:pet.x,y:pet.y};

    if(walk?.active){
      const base=walk.scaleX||1,step=Math.sin(now/92),breath=Math.sin(now/620);
      walk.setVisible(!action?.active);
      walk.setPosition(pet.x,pet.y+(moving?step*4:breath*2));
      walk.setDepth((pet.depth||70)+2);
      if(dx<-.2)walk.setFlipX(true);else if(dx>.2)walk.setFlipX(false);
      const abs=Math.abs(base);
      walk.setScale(abs*(moving?1-step*.014:1+breath*.006),abs*(moving?1+step*.020:1-breath*.004));
      walk.setRotation(moving?step*.009:0);

      // The original sprite stays alive and moving underneath as the controller.
      pet.setAlpha(.01).setVisible(true);
    }else{
      pet.setAlpha(1).setVisible(true);
    }

    if(action?.active)walk?.setVisible(false);
  });
};

const baseReaction=Game.prototype.playFamiliarObjectReaction;
Game.prototype.playFamiliarObjectReaction=function(def,obj,token){
  const result=baseReaction?.call(this,def,obj,token);
  const action=obj?.mode==='sleep'?'sleep':'play';
  this.v3317ShowAction?.(def?.id,action,obj?.mode==='sleep'?3900:2900);
  return result;
};

function hideLegacyLabels(scene){
  ['lunaName','lunaType','emberName','emberType','novaName','novaType','mallowName','mallowType']
    .forEach(k=>{if(scene[k])scene[k].setVisible(false).setAlpha(0)});
}

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  this.v3317GuardianStates={};
  baseCreate.call(this);
  hideLegacyLabels(this);

  // Preserve base edit mode; only improve its visible label.
  if(this.editModeText)this.editModeText.setText('✦ EDIT SANCTUARY');

  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];if(!pet)return;
    try{
      pet.setInteractive({useHandCursor:true});
      pet.on('pointerup',()=>{
        if(!this.editMode)route(this,'companions',{guardian:type});
      });
    }catch(_){}
  });

  this.time.addEvent({delay:70,loop:true,callback:()=>{
    hideLegacyLabels(this);
    this.v3317UpdateGuardianVisuals();
  }});
  this.time.delayedCall(250,()=>this.v3317UpdateGuardianVisuals());

  try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_READY_V3317'},location.origin)}catch(_){}
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type!=='MAJICK_GUARDIAN_LEVELS_V3317'||!d.guardians)return;
  const scene=window.majickPhaserGame?.scene?.getScene('Game');
  if(!scene)return;

  scene.v3317GuardianStates=d.guardians;
  ['luna','ember','nova','mallow'].forEach(type=>{
    try{scene['v3317Walk_'+type]?.destroy()}catch(_){}
    try{scene['v3317Action_'+type]?.destroy()}catch(_){}
    scene['v3317Walk_'+type]=null;
    scene['v3317Action_'+type]=null;
    scene.v3317EnsureWalkSkin(type);
  });
});

})();
