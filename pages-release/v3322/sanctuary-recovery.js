// Majick Studies V3.3.22 — OWNED-GUARDIAN SANCTUARY RECOVERY
// Visibility/HUD layer only. Protected movement code and all 33 motion PNGs remain untouched.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const VERSION='3.3.22';
const PROTECTED=['luna','ember','nova','mallow'];

function ownedTypes(scene){
  return new Set((scene?.v3317CareState?.roster||[]).map(g=>String(g?.type||'')).filter(Boolean));
}
function setInteractiveEnabled(obj,on){
  if(!obj)return;
  try{
    if(on){
      if(obj.input)obj.input.enabled=true;
    }else if(obj.input){
      obj.input.enabled=false;
    }
  }catch(_){}
}
function hideVisual(obj){
  try{obj?.setVisible?.(false)}catch(_){}
}
function showController(obj){
  try{obj?.setVisible?.(true)}catch(_){}
}

Game.prototype.v3322SyncOwnedGuardians=function(){
  const owned=ownedTypes(this);
  for(const type of PROTECTED){
    const isOwned=owned.has(type);
    const pet=this[type];
    const walk=this['v3317Walk_'+type];
    const action=this['v3317Action_'+type];

    if(!isOwned){
      hideVisual(pet);hideVisual(walk);hideVisual(action);
      try{pet?.setAlpha?.(0)}catch(_){}
      setInteractiveEnabled(pet,false);
      continue;
    }

    setInteractiveEnabled(pet,true);
    // The protected movement layer decides whether controller or walk skin is visible.
    // We only ensure an owned controller is allowed to participate.
    if(!walk?.active&&!action?.active){
      showController(pet);
      try{pet?.setAlpha?.(1)}catch(_){}
    }
  }
  return [...owned];
};

Game.prototype.v3322DockGuardianHome=function(){
  const c=this.v3320HomeHud;
  if(!c?.active)return null;
  const width=356;
  const x=Math.max(18,(this.scale?.width||this.game?.scale?.width||1200)-width-24);
  const y=82;
  this.fixToScreen?.(c,x,y);
  return {x,y};
};

const baseUpdate=Game.prototype.v3317UpdateGuardianVisuals;
if(typeof baseUpdate==='function'){
  Game.prototype.v3317UpdateGuardianVisuals=function(){
    const r=baseUpdate.apply(this,arguments);
    this.v3322SyncOwnedGuardians();
    return r;
  };
}

const baseApply=Game.prototype.v3320ApplyCareSnapshot;
if(typeof baseApply==='function'){
  Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
    const r=baseApply.apply(this,arguments);
    this.v3322SyncOwnedGuardians();
    this.v3322DockGuardianHome();
    return r;
  };
}

const baseRefit=Game.prototype.v3320RefitHud;
Game.prototype.v3320RefitHud=function(){
  const r=typeof baseRefit==='function'?baseRefit.apply(this,arguments):undefined;
  this.v3322DockGuardianHome();
  return r;
};

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  baseCreate.apply(this,arguments);
  // Hide every protected slot until the real owned roster arrives.
  this.v3322SyncOwnedGuardians();
  this.time?.delayedCall?.(120,()=>this.v3322SyncOwnedGuardians());
  this.time?.delayedCall?.(420,()=>{this.v3322SyncOwnedGuardians();this.v3322DockGuardianHome()});
};

function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
  const owned=[...ownedTypes(s)];
  const visible={};
  for(const type of PROTECTED){
    visible[type]={
      owned:owned.includes(type),
      controller:!!s?.[type]?.visible,
      walk:!!s?.['v3317Walk_'+type]?.visible,
      action:!!s?.['v3317Action_'+type]?.visible
    };
  }
  return {
    version:VERSION,
    owned,
    visible,
    hud:s?.v3320HomeHud?.active?{x:s.v3320HomeHud.x,y:s.v3320HomeHud.y}:null
  };
}
window.MajickSanctuaryRecovery={VERSION,inspect};
})();