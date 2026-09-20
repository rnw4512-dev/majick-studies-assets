(function(){
'use strict';
if(typeof Game==='undefined')return;

const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const PANEL_BY_ID={
  'arcane-stacks':'openArcaneStacks',
  'moonlit-study-desk':'openStudyDesk',
  'observatory-telescope':'openObservatory',
  'crystal-focus-pedestal':'openCrystalFocus',
  'study-apothecary':'openCrystalFocus',
  'familiar-lounge':'openFamiliarLounge',
  'magic-mirror':'openMagicMirror3313'
};

function getManifest(scene){
  try{return scene.cache.json.get('majick-object-manifest')||{objects:[]}}catch(_){return {objects:[]}}
}
function objectAction(scene,obj){
  if(!obj)return;
  const fn=obj.panelAction||PANEL_BY_ID[obj.id];
  if(fn&&typeof scene[fn]==='function')return scene[fn]();

  if(obj.interaction==='assign-rest'){
    return scene.openFamiliarObjectPicker?.(obj.placement?.slot||obj.id);
  }
  if(obj.interaction==='progress-mirror'&&typeof scene.openMagicMirror3313==='function'){
    return scene.openMagicMirror3313();
  }
  if(obj.interaction==='guardian-care'){
    return scene.sendToStudyApp?.('MAJICK_OPEN_ROUTE_V3311',{route:'companions',objectId:obj.id});
  }
  if(obj.interaction==='open-route'&&obj.destination){
    return scene.sendToStudyApp?.('MAJICK_OPEN_ROUTE_V3311',{route:obj.destination,objectId:obj.id});
  }
}
function objectArt(scene,key,width){
  const c=scene.add.container(0,0);
  const im=scene.add.image(0,55,key).setOrigin(.5,1);
  const sc=(width||240)/Math.max(1,im.width);
  im.setScale(sc);
  c.add(im);
  return c;
}

Game.prototype.createDecor=function(){
  const m=getManifest(this);
  const live=(m.objects||[]).filter(o=>
    o.enabled&&o.preload&&o.placement&&this.textures.exists('obj-'+o.id)
  );

  if(!live.length)return;

  this.decorItems=[];
  live.forEach(o=>{
    const w=(o.placement.width||240)*(o.scale||1);
    const item=this.createMovableDecor(
      'manifest-'+o.id,
      o.placement.x,
      o.placement.y,
      o.displayName,
      ()=>objectArt(this,'obj-'+o.id,w),
      ()=>objectAction(this,o)
    );

    if(!item)return;
    item.setData('objectId',o.id);
    item.setData('manifestObject',o);
    item.setData('blocksWalking',!!o.blocksWalking);

    // Match the click target to the actual visible furniture instead of a tiny fixed box.
    const hitW=Math.max(150,Math.min(420,w+28));
    const hitH=Math.max(130,Math.min(360,w*.78));
    try{
      item.removeInteractive();
      item.setSize(hitW,hitH);
      item.setInteractive(
        new Phaser.Geom.Rectangle(-hitW/2,-hitH+55,hitW,hitH),
        Phaser.Geom.Rectangle.Contains
      );
      item.input.cursor='pointer';
    }catch(_){}

    const depthFromY=()=>item.setDepth(30+Math.round(item.y/30));
    depthFromY();
    item.on('drag',depthFromY);
    item.on('dragend',depthFromY);
  });
};

Game.prototype.v3318GuardianState=function(type){
  const known=this.v3314GuardianStates?.[type]||{};
  const level=Math.max(1,Number(known.level||1)||1);
  const stage=level>=12?'celestial':level>=8?'ascendant':level>=5?'guardian':level>=3?'apprentice':'new-bond';
  return {canon:CANON[type]||type,stage,level};
};

// The protected Phase 4 movers remain the movement controller.
// V3.3.18 only animates the evolved visual skin around their existing coordinates.
Game.prototype.v3318UpdateGuardianSkins=function(){
  this.__v3318Prev=this.__v3318Prev||{};
  const now=this.time.now;

  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];
    if(!pet?.active)return;

    // V3.3.17 owns loading the correct current-stage WebP.
    this.v3317EnsureSkin?.(type);
    const skin=this['v3317Skin_'+type];
    const action=this['v3317Action_'+type];
    const prev=this.__v3318Prev[type]||{x:pet.x,y:pet.y};

    const dx=pet.x-prev.x,dy=pet.y-prev.y;
    const moving=Math.abs(dx)>0.8||Math.abs(dy)>0.8;
    this.__v3318Prev[type]={x:pet.x,y:pet.y};

    if(!skin?.active){
      pet.setAlpha(1).setVisible(true);
      return;
    }

    const desiredH=Math.max(300,Math.min(380,(pet.displayHeight||165)*2.0));
    const baseScale=desiredH/Math.max(1,skin.height);
    const step=Math.sin(now/95);
    const breathe=Math.sin(now/650);

    skin.setVisible(!action?.active);
    skin.setPosition(pet.x,pet.y+(moving?step*5:breathe*2));
    skin.setDepth((pet.depth||70)+2);
    skin.setFlipX(dx<-0.25?true:dx>0.25?false:skin.flipX);
    skin.setScale(
      baseScale*(moving?1-step*.018:1+breathe*.008),
      baseScale*(moving?1+step*.025:1-breathe*.006)
    );
    skin.setRotation(moving?step*.012:0);

    // Hide only the visual pixels of the protected mover; its timers, tweens,
    // hit state, coordinates, behavior selection and movement methods remain active.
    pet.setAlpha(0.015).setVisible(true);
  });
};

const oldUpdate=Game.prototype.v3317UpdateSkins;
Game.prototype.v3317UpdateSkins=function(){
  this.v3318UpdateGuardianSkins();
};

// Keep play/sleep art stage-specific while the protected mover stays in charge of position.
const oldShowAction=Game.prototype.v3317ShowAction;
Game.prototype.v3317ShowAction=function(type,action,duration){
  if(!oldShowAction)return;
  oldShowAction.call(this,type,action,duration);
};

const previousToggle=Game.prototype.toggleEditMode;
Game.prototype.toggleEditMode=function(){
  previousToggle.call(this);
  if(this.editModeText)this.editModeText.setText(this.editMode?'✓ DONE EDITING':'✦ EDIT SANCTUARY');
};

const previousCreate=Game.prototype.create;
Game.prototype.create=function(){
  previousCreate.call(this);
  if(this.editModeText)this.editModeText.setText('✦ EDIT SANCTUARY');
  this.time.addEvent({delay:70,loop:true,callback:()=>this.v3318UpdateGuardianSkins()});
  this.time.delayedCall(240,()=>this.v3318UpdateGuardianSkins());
  try{
    window.parent?.postMessage({type:'MAJICK_SANCTUARY_READY_V3318'},location.origin);
  }catch(_){}
};

})();