// Majick Studies V3.3.25 — SINGLE GUARDIAN VISUAL AUTHORITY
// One visible Phaser skin per owned Guardian. Protected movement coordinates remain authoritative.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const VERSION='3.3.25';
const TYPES=['luna','ember','nova','mallow'];
const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];
const HEIGHT={ 'new-bond':220, apprentice:238, guardian:252, ascendant:270, celestial:288 };
const DEFAULT_MOVE={luna:'lunaWalk',ember:'emberWalk',nova:'novaRun',mallow:'mallowHop'};

function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
function isOwned(scene,type){return roster(scene).some(g=>String(g?.type||'')===type)}
function state(scene,type){
  const known=scene?.v3317GuardianStates?.[type]||{};
  const level=Math.max(1,Number(known.level||scene?.[type]?.getData?.('level')||1)||1);
  const stage=String(known.stageSlug||known.stage||(level>=12?'celestial':level>=8?'ascendant':level>=5?'guardian':level>=3?'apprentice':'new-bond'));
  return {level,stage:STAGES.includes(stage)?stage:'new-bond',canon:CANON[type]||type};
}
function expectedKey(scene,type,action){
  const s=state(scene,type);
  return 'v3317-'+s.canon+'-'+s.stage+'-'+action;
}
function visualHeight(scene,type){
  return HEIGHT[state(scene,type).stage]||238;
}
function timerStop(scene,key){
  try{scene?.[key]?.remove?.(false)}catch(_){}
  try{scene[key]=null}catch(_){}
}
function stopLegacyMotion(scene,type){
  timerStop(scene,type+'FrameTimer');
  timerStop(scene,type+'NextTimer');
  try{scene?.[type+'MoveTween']?.stop?.()}catch(_){}
  try{scene[type+'MoveTween']=null}catch(_){}
  const arr=scene?.[type+'ActionTimers'];
  if(Array.isArray(arr)){
    arr.forEach(t=>{try{t?.remove?.(false)}catch(_){}});
    scene[type+'ActionTimers']=[];
  }
  try{scene?.tweens?.killTweensOf?.(scene?.[type])}catch(_){}
}
function tagged(scene,type,role){
  const list=scene?.children?.list||[];
  return list.filter(o=>o?.getData?.('v3325GuardianType')===type&&(!role||o?.getData?.('v3325GuardianRole')===role));
}
function prune(scene,type,role,keep=null){
  tagged(scene,type,role).forEach(o=>{
    if(o===keep)return;
    try{o.destroy()}catch(_){}
  });
}
function hideSupport(scene,type,hidden){
  for(const suffix of ['Glow','Name','Type']){
    const obj=scene?.[type+suffix];
    if(!obj)continue;
    try{obj.setVisible(!hidden)}catch(_){}
    if(hidden)try{obj.setAlpha(0)}catch(_){}
  }
}
function visibleCount(scene,type){
  const seen=new Set(),rows=[];
  const add=(name,o)=>{
    if(!o||seen.has(o)||o.active===false)return;
    seen.add(o);
    const visible=o.visible!==false&&Number(o.alpha??1)>.05;
    rows.push({name,visible,alpha:Number(o.alpha??1),texture:o.texture?.key||null});
  };
  add('controller',scene?.[type]);
  add('walk',scene?.['v3317Walk_'+type]);
  add('action',scene?.['v3317Action_'+type]);
  tagged(scene,type).forEach((o,i)=>add('tagged-'+i,o));
  return {count:rows.filter(r=>r.visible).length,rows};
}

Game.prototype.v3325SyncOwnedVisuals=function(){
  this.__v3325OwnedPrevious=this.__v3325OwnedPrevious||{};
  for(const type of TYPES){
    const pet=this[type],owned=isOwned(this,type);
    const walk=this['v3317Walk_'+type],action=this['v3317Action_'+type];
    const wasOwned=!!this.__v3325OwnedPrevious[type];
    this.__v3325OwnedPrevious[type]=owned;

    if(!owned){
      stopLegacyMotion(this,type);
      try{pet?.setVisible?.(false).setAlpha?.(0)}catch(_){}
      if(pet?.input)pet.input.enabled=false;
      hideSupport(this,type,true);
      try{walk?.destroy?.()}catch(_){}
      try{action?.destroy?.()}catch(_){}
      this['v3317Walk_'+type]=null;
      this['v3317Action_'+type]=null;
      this['__v3325WalkPending_'+type]=null;
      this['__v3325ActionPending_'+type]=null;
      prune(this,type);
      continue;
    }

    hideSupport(this,type,true); // Guardian Home label is the only room label authority.
    if(pet?.input)pet.input.enabled=true;
    try{pet?.setVisible?.(true)}catch(_){}

    const overlay=action?.active?action:(walk?.active?walk:null);
    try{pet?.setAlpha?.(overlay?0:1)}catch(_){}

    if(!wasOwned&&pet?.active){
      this.time?.delayedCall?.(80,()=>{
        const fn=DEFAULT_MOVE[type];
        if(isOwned(this,type)&&typeof this[fn]==='function'&&!this[type+'MoveTween']&&!this[type+'NextTimer']){
          try{this[fn]()}catch(_){}
        }
      });
    }
  }
  return TYPES.filter(t=>isOwned(this,t));
};

Game.prototype.v3317EnsureWalkSkin=function(type){
  const pet=this[type];
  if(!pet?.active||!isOwned(this,type)){
    this.v3325SyncOwnedVisuals?.();
    return;
  }
  const expected=expectedKey(this,type,'walk');
  const current=this['v3317Walk_'+type];
  if(current?.active&&current.texture?.key===expected){
    prune(this,type,'walk',current);
    try{pet.setAlpha(0).setVisible(true)}catch(_){}
    return current;
  }

  if(this['__v3325WalkPending_'+type]===expected)return current||null;
  const token=expected+'|'+Date.now()+'|'+Math.random();
  this['__v3325WalkPending_'+type]=expected;
  this['__v3325WalkToken_'+type]=token;

  try{current?.destroy?.()}catch(_){}
  this['v3317Walk_'+type]=null;

  this.v3317LoadAction(type,'walk',k=>{
    if(this['__v3325WalkToken_'+type]!==token)return;
    this['__v3325WalkPending_'+type]=null;
    if(!k||!pet?.active||!isOwned(this,type)){
      if(isOwned(this,type))try{pet.setAlpha(1).setVisible(true)}catch(_){}
      return;
    }

    prune(this,type,'walk');
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+2);
    const base=visualHeight(this,type)/Math.max(1,img.height);
    img.setScale(base);
    img.setData('v3325GuardianType',type);
    img.setData('v3325GuardianRole','walk');
    img.setData('v3325BaseScale',base);
    this['v3317Walk_'+type]=img;
    try{pet.setAlpha(0).setVisible(true)}catch(_){}
    prune(this,type,'walk',img);
    return img;
  });
  return null;
};

Game.prototype.v3317ShowAction=function(type,action,duration){
  const pet=this[type];
  if(!pet?.active||!isOwned(this,type))return;
  const expected=expectedKey(this,type,action);
  const token=expected+'|'+Date.now()+'|'+Math.random();
  this['__v3325ActionPending_'+type]=expected;
  this['__v3325ActionToken_'+type]=token;

  this.v3317LoadAction(type,action,k=>{
    if(this['__v3325ActionToken_'+type]!==token)return;
    this['__v3325ActionPending_'+type]=null;
    if(!k||!pet?.active||!isOwned(this,type))return;

    try{this['v3317Action_'+type]?.destroy?.()}catch(_){}
    prune(this,type,'action');
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+3);
    const base=visualHeight(this,type)/Math.max(1,img.height);
    img.setScale(base);
    img.setData('v3325GuardianType',type);
    img.setData('v3325GuardianRole','action');
    img.setData('v3325BaseScale',base);
    this['v3317Action_'+type]=img;
    try{pet.setAlpha(0).setVisible(true)}catch(_){}
    this['v3317Walk_'+type]?.setVisible?.(false);

    const follow=this.time.addEvent({delay:55,loop:true,callback:()=>{
      if(img.active&&pet.active){
        img.setPosition(pet.x,pet.y).setDepth((pet.depth||70)+3);
        img.setFlipX?.(!!pet.flipX);
      }
    }});
    this.time.delayedCall(Math.max(900,Number(duration)||2400),()=>{
      follow.remove(false);
      try{img.destroy()}catch(_){}
      if(this['v3317Action_'+type]===img)this['v3317Action_'+type]=null;
      if(isOwned(this,type)){
        const walk=this['v3317Walk_'+type];
        walk?.setVisible?.(true);
        try{pet.setAlpha(walk?.active?0:1)}catch(_){}
      }
    });
  });
};

Game.prototype.v3317UpdateGuardianVisuals=function(){
  this.__v3317Prev=this.__v3317Prev||{};
  const now=this.time.now;
  this.v3325SyncOwnedVisuals();

  TYPES.forEach(type=>{
    if(!isOwned(this,type))return;
    const pet=this[type];if(!pet?.active)return;
    this.v3317EnsureWalkSkin(type);

    const walk=this['v3317Walk_'+type],action=this['v3317Action_'+type];
    const prev=this.__v3317Prev[type]||{x:pet.x,y:pet.y};
    const dx=pet.x-prev.x,dy=pet.y-prev.y;
    const moving=Math.abs(dx)>.8||Math.abs(dy)>.8;
    this.__v3317Prev[type]={x:pet.x,y:pet.y};

    if(walk?.active){
      const base=Number(walk.getData?.('v3325BaseScale'))||Math.abs(walk.scaleX)||1;
      const bob=Math.sin(now/165)*(moving?1.6:.8);
      walk.setVisible(!action?.active);
      walk.setPosition(pet.x,pet.y+bob);
      walk.setDepth((pet.depth||70)+2);
      if(dx<-.2)walk.setFlipX(true);else if(dx>.2)walk.setFlipX(false);
      // Fixed scale: never use the previous animated frame as the next base.
      walk.setScale(base);
      walk.setRotation(0);
      try{pet.setAlpha(0).setVisible(true)}catch(_){}
      prune(this,type,'walk',walk);
    }else if(!action?.active){
      try{pet.setAlpha(1).setVisible(true)}catch(_){}
    }

    if(action?.active){
      walk?.setVisible?.(false);
      try{pet.setAlpha(0).setVisible(true)}catch(_){}
      prune(this,type,'action',action);
    }
  });
};

const priorSync=Game.prototype.v3322SyncOwnedGuardians;
Game.prototype.v3322SyncOwnedGuardians=function(){
  // V3.3.25 is the visual authority; retain V3.3.22 only for compatibility state.
  const owned=this.v3325SyncOwnedVisuals();
  return owned;
};

const priorCreate=Game.prototype.create;
Game.prototype.create=function(){
  priorCreate.apply(this,arguments);
  this.time?.delayedCall?.(60,()=>this.v3325SyncOwnedVisuals());
  this.time?.delayedCall?.(500,()=>this.v3325SyncOwnedVisuals());
};

function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
  const visuals={};
  for(const type of TYPES)visuals[type]={owned:isOwned(s,type),...visibleCount(s,type),stage:state(s,type).stage,height:visualHeight(s,type)};
  return {
    version:VERSION,
    owned:TYPES.filter(t=>isOwned(s,t)),
    visuals,
    totalVisible:TYPES.reduce((n,t)=>n+visibleCount(s,t).count,0)
  };
}
window.MajickGuardianVisualAuthority={VERSION,inspect};
})();