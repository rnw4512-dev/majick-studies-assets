(function(){
'use strict';
if(typeof Game==='undefined')return;

const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];
const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};

function stageFromLevel(level){
  const n=Math.max(1,Number(level)||1);
  return n>=12?'celestial':n>=8?'ascendant':n>=5?'guardian':n>=3?'apprentice':'new-bond';
}
function state(scene,type){
  const known=scene?.v3314GuardianStates?.[type]||{};
  return {
    canon:CANON[type]||known.canon||type,
    stage:known.stageSlug||stageFromLevel(known.level||scene?.[type]?.getData?.('level')||1)
  };
}
function key(scene,type,action){
  const s=state(scene,type);
  return 'v3317-'+s.canon+'-'+s.stage+'-'+action;
}
function src(scene,type,action){
  const s=state(scene,type);
  return './assets/evolutions/'+s.canon+'/'+s.stage+'/'+action+'.webp?v=3317';
}

Game.prototype.v3317LoadAction=function(type,action,done){
  const k=key(this,type,action);
  if(this.textures.exists(k)){done?.(k);return;}
  if(this['__v3317Loading_'+k]){this.time.delayedCall(120,()=>this.v3317LoadAction(type,action,done));return;}
  this['__v3317Loading_'+k]=true;
  this.load.image(k,src(this,type,action));
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

Game.prototype.v3317EnsureSkin=function(type){
  const pet=this[type];
  if(!pet?.active)return;
  const existing=this['v3317Skin_'+type];
  const expected=key(this,type,'walk');
  if(existing?.active && existing.texture?.key===expected)return;
  try{existing?.destroy()}catch(_){}
  this['v3317Skin_'+type]=null;

  this.v3317LoadAction(type,'walk',k=>{
    if(!k||!pet?.active)return;
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+2);
    const targetH=Math.max(150,Math.min(250,(pet.displayHeight||150)*1.45));
    const sc=targetH/Math.max(1,img.height);
    img.setScale(sc);
    this['v3317Skin_'+type]=img;
  });
};

Game.prototype.v3317UpdateSkins=function(){
  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];
    if(!pet?.active)return;
    this.v3317EnsureSkin(type);
    const skin=this['v3317Skin_'+type];
    const action=this['v3317Action_'+type];
    if(skin?.active){
      skin.setPosition(pet.x,pet.y).setDepth((pet.depth||70)+2);
      skin.setVisible(!action?.active);
      pet.setAlpha(action?.active?0.01:0.01).setVisible(true);
    }else{
      pet.setAlpha(1).setVisible(true);
    }
  });
};

Game.prototype.v3317ShowAction=function(type,action,duration){
  const pet=this[type];
  if(!pet?.active)return;
  this.v3317LoadAction(type,action,k=>{
    if(!k||!pet?.active)return;
    const old=this['v3317Action_'+type];
    try{old?.destroy()}catch(_){}
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+3);
    const targetH=Math.max(150,Math.min(250,(pet.displayHeight||150)*1.45));
    img.setScale(targetH/Math.max(1,img.height));
    this['v3317Action_'+type]=img;
    pet.setAlpha(0.01).setVisible(true);
    const follow=this.time.addEvent({delay:50,loop:true,callback:()=>{if(img.active&&pet.active)img.setPosition(pet.x,pet.y)}});
    this.time.delayedCall(Math.max(800,Number(duration)||2200),()=>{
      follow.remove(false);
      try{img.destroy()}catch(_){}
      if(this['v3317Action_'+type]===img)this['v3317Action_'+type]=null;
      if(pet.active)pet.setAlpha(this['v3317Skin_'+type]?.active?0.01:1);
    });
  });
};

const baseStart=Game.prototype.startFamiliarObjectInteraction;
if(typeof baseStart==='function'){
  Game.prototype.startFamiliarObjectInteraction=function(type,obj){
    const id=String(obj?.getData?.('objectId')||obj?.getData?.('id')||'');
    const a=/bed|nest|cushion|rest/i.test(id)?'sleep':'play';
    this.v3317ShowAction(type,a,a==='sleep'?3200:2000);
    return baseStart.apply(this,arguments);
  };
}

const prevCreate=Game.prototype.create;
Game.prototype.create=function(){
  prevCreate.call(this);
  this.time.addEvent({delay:90,loop:true,callback:()=>this.v3317UpdateSkins()});
  this.time.delayedCall(240,()=>this.v3317UpdateSkins());
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type!=='MAJICK_GUARDIAN_LEVELS_V3314'||!d.guardians)return;
  const scene=window.majickPhaserGame?.scene?.getScene('Game');
  if(!scene)return;
  scene.v3314GuardianStates=d.guardians;
  ['luna','ember','nova','mallow'].forEach(type=>{
    const old=scene['v3317Skin_'+type];
    try{old?.destroy()}catch(_){}
    scene['v3317Skin_'+type]=null;
    scene.v3317EnsureSkin(type);
  });
});
})();